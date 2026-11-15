import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Symmetry — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const int = (v, lo, hi, dflt) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? clamp(n, lo, hi) : dflt;
};
const rad = (d) => (d * Math.PI) / 180;
const pts = (poly) => poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const rectPoly = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const ngon = (n, r, start = -90) => Array.from({ length: n }, (_, i) => [r * Math.cos(rad(start + (360 * i) / n)), r * Math.sin(rad(start + (360 * i) / n))]);
const STYLE = '@keyframes syFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } } @keyframes syDraw { from { stroke-dashoffset: 420 } to { stroke-dashoffset: 0 } }';

// 0 → 1 progress that restarts whenever `dep` changes
function useReplay(dep, duration = 1400) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      setP(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setP(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dep, duration]);
  return p;
}

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300', suffix = '' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}{suffix}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// ─── Shape library (each shape = list of polygons centred on the origin) ───
const heartPoly = Array.from({ length: 48 }, (_, i) => {
  const t = (2 * Math.PI * i) / 48;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x * 7.5, -y * 7.5 - 15];
});
const half = (list) => [...list, ...list.slice().reverse().map(([x, y]) => [-x, y])];
const SHAPES = {
  kite: { label: 'Kite (patang)', polys: [[[0, -130], [90, -40], [0, 130], [-90, -40]]], color: PINK },
  heart: { label: 'Heart', polys: [heartPoly], color: RED },
  taj: {
    label: 'Taj Mahal',
    color: INK,
    polys: [
      half([[0, -150], [6, -132], [38, -116], [56, -92], [50, -66], [36, -56]]),
      rectPoly(-90, -56, 180, 136),
      rectPoly(-140, -110, 16, 190),
      rectPoly(124, -110, 16, 190),
      rectPoly(-150, 80, 300, 20),
    ],
    arch: true,
  },
  H: { label: 'Letter H', polys: [rectPoly(-75, -100, 34, 200), rectPoly(41, -100, 34, 200), rectPoly(-41, -16, 82, 32)], color: AMBER },
  E: { label: 'Letter E', polys: [rectPoly(-65, -100, 34, 200), rectPoly(-31, -100, 96, 32), rectPoly(-31, -16, 76, 32), rectPoly(-31, 68, 96, 32)], color: SKY },
  rect: { label: 'Rectangle', polys: [rectPoly(-130, -80, 260, 160)], color: GREEN },
  square: { label: 'Square', polys: [rectPoly(-100, -100, 200, 200)], color: PURPLE },
  para: { label: 'Parallelogram', polys: [[[-120, 70], [50, 70], [120, -70], [-50, -70]]], color: '#fb923c' },
};

// Mirror point p in the line through the origin at SVG angle a (a = 0 is vertical, a = 90 horizontal)
function reflect([x, y], a) {
  const dx = -Math.sin(rad(a));
  const dy = Math.cos(rad(a));
  const k = 2 * (x * dx + y * dy);
  return [k * dx - x, k * dy - y];
}
function polyMatches(poly, target) {
  return poly.every(([x, y]) => target.some(([u, v]) => Math.abs(u - x) < 1.5 && Math.abs(v - y) < 1.5));
}
function isLineOfSymmetry(shape, a) {
  return shape.polys.every((poly) => {
    const m = poly.map((p) => reflect(p, a));
    return shape.polys.some((q) => q.length === m.length && polyMatches(m, q));
  });
}
const FOLD_LINES = [
  { value: 0, label: 'Vertical |' },
  { value: 90, label: 'Horizontal —' },
  { value: 45, label: 'Slant /' },
  { value: 135, label: 'Slant \\' },
];

function ShapeDraw({ shape, fill, stroke, opacity = 1, dashed }) {
  return (
    <g opacity={opacity}>
      {shape.polys.map((poly, i) => (
        <polygon key={i} points={pts(poly)} fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" strokeDasharray={dashed ? '7 6' : undefined} />
      ))}
      {shape.arch && <path d="M -30 80 L -30 10 Q 0 -25 30 10 L 30 80" fill="#020617" stroke={stroke} strokeWidth="3" />}
    </g>
  );
}

// ─── WIDGET 1: Fold test, is this a line of symmetry? ───
export function Class6SymmetryFoldWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ shape: 'kite', line: 0, fold: 0, task: null }, visual);
  const key = SHAPES[s.shape] ? s.shape : 'kite';
  const shape = SHAPES[key];
  const a = [0, 45, 90, 135].includes(Number(s.line)) ? Number(s.line) : 0;
  const t = useTween(s.fold ? 1 : 0, 1200);
  const works = isLineOfSymmetry(shape, a);
  const allLines = [0, 45, 90, 135].filter((l) => isLineOfSymmetry(shape, l));
  const [found, setFound] = useState([]);
  const task = s.task && s.task.shape ? s.task : null;
  const taskKey = JSON.stringify(task);
  useEffect(() => { setFound([]); }, [taskKey]);
  useEffect(() => {
    if (task && key === task.shape && s.fold && works && t > 0.95 && !found.includes(a)) setFound((f) => [...f, a]);
  }, [task, key, s.fold, works, t, a, found]);
  const need = task ? [0, 45, 90, 135].filter((l) => isLineOfSymmetry(SHAPES[task.shape] || shape, l)).length : 0;
  const done = !!task && found.length >= need && need > 0;
  useDone(done, onInteract);
  const sx = 1 - 2 * ease(t);
  const cx = 230;
  const cy = 185;
  const clipId = `syfold-${key}-${a}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Fold test"
      title={`${shape.label}: fold along the ${FOLD_LINES.find((f) => f.value === a).label.split(' ')[0].toLowerCase()} line`}
      footer={
        <div className="space-y-3">
          <ModePills value={key} onChange={(v) => update({ shape: v, fold: 0 })} options={Object.entries(SHAPES).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="flex flex-wrap gap-2 items-center">
            <ModePills value={a} onChange={(v) => update({ line: v, fold: 0 })} options={FOLD_LINES} />
            <button onClick={() => update({ fold: s.fold ? 0 : 1 })} className="px-4 py-1.5 rounded-full text-xs font-black bg-sky-500/20 border border-sky-400 text-sky-200">
              {s.fold ? 'Unfold' : 'Fold!'}
            </button>
          </div>
          {task && <TaskBanner text={`Your turn: find every line of symmetry of the ${SHAPES[task.shape]?.label || ''} by folding. Found ${found.length} of ${need}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="-400" width="400" height="800" transform={`rotate(${a})`} />
          </clipPath>
          <clipPath id={`${clipId}-b`}>
            <rect x="-400" y="-400" width="400" height="800" transform={`rotate(${a})`} />
          </clipPath>
        </defs>
        <g transform={`translate(${cx} ${cy})`}>
          {/* the half that stays */}
          <g clipPath={`url(#${clipId}-b)`}>
            <ShapeDraw shape={shape} fill={`${shape.color}33`} stroke={shape.color} />
          </g>
          {/* the half that folds over */}
          <g transform={`rotate(${a}) scale(${sx} 1) rotate(${-a})`}>
            <g clipPath={`url(#${clipId})`}>
              <ShapeDraw shape={shape} fill={`${shape.color}55`} stroke={t > 0.95 ? (works ? GREEN : RED) : shape.color} />
            </g>
          </g>
          <line x1="0" y1="-170" x2="0" y2="170" transform={`rotate(${a})`} stroke={AMBER} strokeWidth="3" strokeDasharray="10 7" style={{ transition: 'all 500ms ease' }} />
        </g>
        <g style={{ opacity: t > 0.95 ? 1 : 0, transition: 'opacity 400ms ease' }}>
          <rect x="420" y="110" width="160" height="120" rx="14" fill="#0f172a" stroke={works ? GREEN : RED} strokeWidth="2" />
          <text x="500" y="152" textAnchor="middle" fill={works ? GREEN : RED} fontSize="20" fontWeight="900" fontFamily="sans-serif">{works ? 'Perfect fit!' : 'No fit'}</text>
          <text x="500" y="180" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="700" fontFamily="sans-serif">{works ? 'The halves cover' : 'The halves do not'}</text>
          <text x="500" y="198" textAnchor="middle" fill="#cbd5e1" fontSize="13" fontWeight="700" fontFamily="sans-serif">{works ? 'each other exactly.' : 'cover each other.'}</text>
        </g>
        {!task && <text x="500" y="300" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700" fontFamily="sans-serif">Lines that work: {allLines.length}</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: How many lines of symmetry? ───
const LINE_SHAPES = {
  scalene: { label: 'Scalene triangle', poly: [[-120, 80], [130, 80], [-40, -110]], axes: [], color: '#fb923c' },
  iso: { label: 'Isosceles triangle', poly: [[-90, 90], [90, 90], [0, -120]], axes: [90], color: PINK },
  rect: { label: 'Rectangle', poly: rectPoly(-140, -80, 280, 160), axes: [90, 0], color: GREEN },
  eqtri: { label: 'Equilateral triangle', poly: ngon(3, 140), axes: [90, 30, 150], color: SKY },
  square: { label: 'Square', poly: rectPoly(-110, -110, 220, 220), axes: [90, 0, 45, 135], color: PURPLE },
  pent: { label: 'Regular pentagon', poly: ngon(5, 130), axes: [90, 18, 162, 54, 126], color: AMBER },
  hex: { label: 'Regular hexagon', poly: ngon(6, 130), axes: [90, 30, 150, 0, 60, 120], color: GREEN },
  circle: { label: 'Circle', circle: true, axes: [90, 0, 45, 135, 15, 30, 60, 75, 105, 120, 150, 165], color: SKY },
};

export function Class6SymmetryLinesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ shape: 'square', show: 99, task: null }, visual);
  const key = LINE_SHAPES[s.shape] ? s.shape : 'square';
  const sh = LINE_SHAPES[key];
  const show = int(s.show, 0, 99, 99);
  const count = sh.circle ? Infinity : sh.axes.length;
  const task = s.task && s.task.lines !== undefined ? s.task : null;
  const done = !!task && count === task.lines;
  useDone(done, onInteract);
  const cx = 220;
  const cy = 180;

  return (
    <StoryStage
      eyebrow="Visualizer · Lines of symmetry"
      title={`${sh.label}: ${sh.circle ? 'endless lines' : `${count} line${count === 1 ? '' : 's'} of symmetry`}`}
      footer={
        <div className="space-y-3">
          <style>{STYLE}</style>
          <ModePills value={key} onChange={(v) => update({ shape: v, show: 99 })} options={Object.entries(LINE_SHAPES).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Lines of symmetry" value={sh.circle ? 'infinite' : count} tone="text-amber-300" />
            <span className="text-sm text-slate-300">{key === 'scalene' ? 'All sides different: no fold works.' : sh.circle ? 'Every line through the centre works.' : 'Each dashed line folds the shape onto itself.'}</span>
          </div>
          {task && <TaskBanner text={`Your turn: pick a shape that has exactly ${task.lines} lines of symmetry.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <g transform={`translate(${cx} ${cy})`}><g key={key} style={{ animation: 'syFadeIn 500ms ease both' }}>
          {sh.circle
            ? <circle cx="0" cy="0" r="135" fill={`${sh.color}22`} stroke={sh.color} strokeWidth="3" />
            : <polygon points={pts(sh.poly)} fill={`${sh.color}22`} stroke={sh.color} strokeWidth="3" strokeLinejoin="round" />}
          {sh.axes.slice(0, show).map((deg, i) => {
            const L = 165;
            const x = L * Math.cos(rad(deg));
            const y = -L * Math.sin(rad(deg));
            return (
              <line key={`${key}-${deg}`} x1={-x} y1={-y} x2={x} y2={y}
                stroke={AMBER} strokeWidth="2.5" strokeDasharray="420" style={{ animation: `syDraw 900ms ease ${300 + i * 350}ms both` }} />
            );
          })}
          <circle cx="0" cy="0" r="4" fill={INK} />
        </g></g>
        <g>
          <text x="500" y="120" textAnchor="middle" fill={AMBER} fontSize="64" fontWeight="900" fontFamily="monospace" key={`n-${key}`} style={{ animation: 'syFadeIn 500ms ease 400ms both' }}>{sh.circle ? '∞' : count}</text>
          <text x="500" y="150" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">lines of symmetry</text>
          {['pent', 'hex', 'eqtri', 'square'].includes(key) && (
            <>
              <text x="500" y="220" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily="sans-serif">Regular polygon:</text>
              <text x="500" y="242" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily="sans-serif">sides = lines</text>
            </>
          )}
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Mirror images, ink blots and paper cutting ───
const BLOTS = [[-70, -60, 34], [-40, -10, 26], [-95, 20, 22], [-55, 55, 30], [-20, 90, 14], [-110, -20, 12]];
const DIYA_HALF = 'M 0 70 L -35 70 Q -90 62 -105 15 L 0 15 Z M 0 0 Q -30 -35 0 -95 Z';

export function Class6SymmetryMirrorWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'mirror', px: 4, py: 3, task: null }, visual);
  const mode = ['mirror', 'inkblot', 'papercut'].includes(s.mode) ? s.mode : 'mirror';
  const svgRef = useRef(null);
  const CELL = 30;
  const OX = 30;
  const OY = 30;
  const MX = 300;
  const px = int(s.px, 0, 8, 4);
  const py = int(s.py, 0, 9, 3);
  const P = [OX + px * CELL, OY + py * CELL];
  const Pi = [2 * MX - P[0], P[1]];
  const tx = useTween(P[0], 300);
  const ty = useTween(P[1], 300);
  const drag = useSvgDrag(svgRef, (x, y) => update({ px: clamp(Math.round((x - OX) / CELL), 0, 8), py: clamp(Math.round((y - OY) / CELL), 0, 9) }));
  const p = useReplay(`${mode}`, 2600);
  const task = s.task && s.task.x !== undefined ? s.task : null;
  const target = task ? [OX + task.x * CELL, OY + task.y * CELL] : null;
  const done = !!target && mode === 'mirror' && Math.abs(Pi[0] - target[0]) < 1 && Math.abs(Pi[1] - target[1]) < 1;
  useDone(done, onInteract);
  const fold = ease(seg(p, 0.15, 0.75));
  const dist = (MX - P[0]) / CELL;

  let picture;
  if (mode === 'mirror') {
    picture = (
      <>
        {Array.from({ length: 19 }, (_, i) => <line key={`v${i}`} x1={OX + i * CELL} y1={OY} x2={OX + i * CELL} y2={OY + 9 * CELL} stroke="#1e293b" />)}
        {Array.from({ length: 10 }, (_, i) => <line key={`h${i}`} x1={OX} y1={OY + i * CELL} x2={OX + 18 * CELL} y2={OY + i * CELL} stroke="#1e293b" />)}
        <rect x={MX - 3} y={OY - 10} width="6" height={9 * CELL + 20} fill={SKY} opacity="0.8" />
        <text x={MX} y={OY - 14} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="900" fontFamily="sans-serif">mirror line</text>
        {/* a flag shows how left and right swap */}
        <g>
          <line x1="90" y1="300" x2="90" y2="210" stroke={INK} strokeWidth="4" />
          <polygon points="90,210 150,228 90,246" fill={AMBER} />
          <line x1="510" y1="300" x2="510" y2="210" stroke={INK} strokeWidth="4" opacity="0.8" />
          <polygon points="510,210 450,228 510,246" fill={AMBER} opacity="0.6" />
        </g>
        {target && <text x={target[0]} y={target[1] + 7} textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900">★</text>}
        <line x1={tx} y1={ty} x2={2 * MX - tx} y2={ty} stroke={PINK} strokeWidth="2" strokeDasharray="6 5" />
        {dist !== 0 && (
          <>
            <text x={(tx + MX) / 2} y={ty - 10} textAnchor="middle" fill={PINK} fontSize="14" fontWeight="900" fontFamily="monospace">{Math.abs(dist)}</text>
            <text x={(3 * MX - tx) / 2} y={ty - 10} textAnchor="middle" fill={PINK} fontSize="14" fontWeight="900" fontFamily="monospace">{Math.abs(dist)}</text>
          </>
        )}
        <g {...drag} style={{ cursor: 'grab' }}>
          <circle cx={tx} cy={ty} r="18" fill="transparent" />
          <circle cx={tx} cy={ty} r="9" fill={AMBER} stroke="#020617" strokeWidth="2" />
        </g>
        <text x={tx - 14} y={ty + 26} fill={AMBER} fontSize="16" fontWeight="900" fontFamily="sans-serif">P</text>
        <circle cx={2 * MX - tx} cy={ty} r="9" fill="none" stroke={AMBER} strokeWidth="3" />
        <text x={2 * MX - tx + 2} y={ty + 26} fill={AMBER} fontSize="16" fontWeight="900" fontFamily="sans-serif">P′</text>
      </>
    );
  } else if (mode === 'inkblot') {
    const sxx = 1 - 2 * fold;
    picture = (
      <>
        <rect x="120" y="40" width="360" height="280" rx="8" fill="#f8fafc" />
        <line x1={MX} y1="40" x2={MX} y2="320" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />
        <g transform={`translate(${MX} 180)`}>
          {BLOTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? PURPLE : '#7c3aed'} />)}
          <g opacity={seg(p, 0.7, 0.8)} transform="scale(-1 1)">
            {BLOTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? PURPLE : '#7c3aed'} />)}
          </g>
          {/* the right half of the paper folding over and back */}
          <g transform={`scale(${p < 0.75 ? sxx : lerp(-1, 1, ease(seg(p, 0.8, 1)))} 1)`} opacity={p < 0.98 ? 0.92 : 0}>
            <rect x="0" y="-140" width="180" height="280" fill="#e2e8f0" stroke="#94a3b8" />
          </g>
        </g>
        <text x="300" y="345" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="800" fontFamily="sans-serif">Ink on one half, fold, open: a symmetric ink blot!</text>
      </>
    );
  } else {
    const open = ease(seg(p, 0.25, 0.85));
    picture = (
      <>
        <g transform="translate(300 175)">
          <g>
            <rect x="-150" y="-130" width="150" height="250" fill="#fde68a" />
            <path d={DIYA_HALF} transform="scale(1.3)" fill="#020617" />
          </g>
          <g transform={`scale(${lerp(-0.02, 1, open) * -1} 1)`} opacity={open > 0 ? 1 : 0}>
            <rect x="-150" y="-130" width="150" height="250" fill="#fcd34d" />
            <path d={DIYA_HALF} transform="scale(1.3)" fill="#020617" />
          </g>
          <line x1="0" y1="-130" x2="0" y2="120" stroke={AMBER} strokeWidth="2" strokeDasharray="6 5" />
        </g>
        <text x="300" y="335" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="800" fontFamily="sans-serif">{open < 1 ? 'Cut half a diya on the folded edge...' : 'Unfold: the fold is the line of symmetry!'}</text>
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Mirror images"
      title={mode === 'mirror' ? 'Same distance on both sides of the mirror' : mode === 'inkblot' ? 'Ink blot on a folded paper' : 'Fold, cut, unfold'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'mirror', label: 'Mirror line' }, { value: 'inkblot', label: 'Ink blot' }, { value: 'papercut', label: 'Paper cut' }]} />
          {mode === 'mirror' && (
            <div className="flex flex-wrap gap-2 items-center">
              <Readout label="P to mirror" value={`${Math.abs(dist)} boxes`} tone="text-pink-300" />
              <Readout label="Mirror to P′" value={`${Math.abs(dist)} boxes`} tone="text-pink-300" />
              <span className="text-sm text-slate-300">Drag P. Its image is just as far on the other side. Left and right swap.</span>
            </div>
          )}
          {task && <TaskBanner text="Your turn: drag P so that its mirror image P′ lands on the green star." done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        {picture}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Complete the rangoli ───
const RANGOLI = {
  diya: [[4, 0], [3, 1], [4, 1], [2, 2], [3, 2], [4, 3], [1, 4], [2, 4], [3, 4], [4, 4], [0, 5], [1, 5], [2, 6], [3, 6], [4, 7]],
  flower: [[4, 0], [3, 1], [2, 2], [4, 2], [1, 3], [3, 3]],
};
const RCOLS = [PINK, AMBER, GREEN, SKY, PURPLE, RED, '#fb923c', '#2dd4bf'];

export function Class6SymmetryRangoliWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ lines: 1, pattern: 'diya', reveal: false, user: [], task: null }, visual);
  const lines = Number(s.lines) === 2 ? 2 : 1;
  const pattern = RANGOLI[s.pattern] ? s.pattern : (lines === 2 ? 'flower' : 'diya');
  const given = RANGOLI[pattern];
  const ROWS = 8;
  const COLS = 10;
  const CELL = 34;
  const OX = 300 - (COLS * CELL) / 2;
  const OY = 18;
  const k = (c, r) => `${c},${r}`;
  const targetSet = new Set();
  given.forEach(([c, r]) => {
    targetSet.add(k(COLS - 1 - c, r));
    if (lines === 2) {
      targetSet.add(k(c, ROWS - 1 - r));
      targetSet.add(k(COLS - 1 - c, ROWS - 1 - r));
    }
  });
  given.forEach(([c, r]) => targetSet.delete(k(c, r)));
  const user = new Set(Array.isArray(s.user) ? s.user : []);
  const isGivenZone = (c, r) => c < COLS / 2 && (lines === 1 || r < ROWS / 2);
  const givenSet = new Set(given.map(([c, r]) => k(c, r)));
  const correct = [...user].filter((x) => targetSet.has(x)).length;
  const wrong = [...user].filter((x) => !targetSet.has(x)).length;
  const task = s.task ? s.task : null;
  const done = !!task && correct === targetSet.size && wrong === 0;
  useDone(done, onInteract);
  const toggle = (c, r) => {
    if (isGivenZone(c, r)) return;
    const n = new Set(user);
    if (n.has(k(c, r))) n.delete(k(c, r)); else n.add(k(c, r));
    update({ user: [...n] });
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Rangoli symmetry"
      title={lines === 2 ? 'Two mirror lines: complete all four corners' : 'One mirror line: complete the other half'}
      footer={
        <div className="space-y-3">
          <style>{STYLE}</style>
          <div className="flex flex-wrap gap-2 items-center">
            <ModePills value={lines} onChange={(v) => update({ lines: v, pattern: v === 2 ? 'flower' : 'diya', user: [], reveal: false })} options={[{ value: 1, label: '1 line (diya)' }, { value: 2, label: '2 lines (flower)' }]} />
            <button onClick={() => update({ reveal: !s.reveal })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-600 text-slate-300">{s.reveal ? 'Hide answer' : 'Show answer'}</button>
            <button onClick={() => update({ user: [] })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-600 text-slate-300">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Correct dots" value={`${correct}/${targetSet.size}`} tone="text-emerald-300" />
            <Readout label="Wrong dots" value={wrong} tone={wrong ? 'text-red-300' : 'text-slate-400'} />
            <span className="text-sm text-slate-300">Tap the empty squares to fill the mirror image.</span>
          </div>
          {task && <TaskBanner text="Your turn: complete the rangoli so the mirror lines are lines of symmetry." done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <rect x={OX} y={OY} width={COLS * CELL} height={ROWS * CELL} fill="#1c1917" rx="6" />
        {Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
          const id = k(c, r);
          const isG = givenSet.has(id);
          const isU = user.has(id);
          const showAns = s.reveal && targetSet.has(id) && !isU;
          const col = RCOLS[(lines === 2 ? Math.min(r, ROWS - 1 - r) : r) % RCOLS.length];
          const x = OX + c * CELL + CELL / 2;
          const y = OY + r * CELL + CELL / 2;
          return (
            <g key={id} onClick={() => toggle(c, r)} style={{ cursor: isGivenZone(c, r) ? 'default' : 'pointer' }}>
              <rect x={x - CELL / 2} y={y - CELL / 2} width={CELL} height={CELL} fill={isGivenZone(c, r) ? '#292524' : '#1c1917'} stroke="#44403c" />
              <circle cx={x} cy={y} r="2" fill="#78716c" />
              {(isG || isU || showAns) && (
                <g style={{ animation: `syFadeIn 400ms ease ${showAns ? (c + r) * 40 : 0}ms both` }}>
                  <rect x={x - 11} y={y - 11} width="22" height="22" rx="4" transform={`rotate(45 ${x} ${y})`}
                    fill={isU && !targetSet.has(id) ? RED : col} opacity={showAns ? 0.55 : 1} />
                </g>
              )}
            </g>
          );
        }))}
        <line x1="300" y1={OY - 8} x2="300" y2={OY + ROWS * CELL + 8} stroke={SKY} strokeWidth="3" strokeDasharray="9 6" pointerEvents="none" />
        {lines === 2 && <line x1={OX - 8} y1={OY + (ROWS * CELL) / 2} x2={OX + COLS * CELL + 8} y2={OY + (ROWS * CELL) / 2} stroke={SKY} strokeWidth="3" strokeDasharray="9 6" pointerEvents="none" />}
        {done && <text x="300" y="350" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif">Shabash! A perfectly symmetric rangoli.</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Rotational symmetry, angle and order ───
function pinwheel() {
  return [0, 90, 180, 270].map((d) => [[0, 0], [0, -120], [70, -60]].map(([x, y]) => {
    const c = Math.cos(rad(d));
    const sn = Math.sin(rad(d));
    return [x * c - y * sn, x * sn + y * c];
  }));
}
function windmill() {
  return [0, 120, 240].map((d) => [[0, 0], [-22, -40], [0, -125], [40, -95]].map(([x, y]) => {
    const c = Math.cos(rad(d));
    const sn = Math.sin(rad(d));
    return [x * c - y * sn, x * sn + y * c];
  }));
}
const ROT_SHAPES = {
  chakra: { label: 'Ashoka Chakra', order: 24, color: '#3b82f6' },
  square: { label: 'Square', order: 4, polys: [rectPoly(-105, -105, 210, 210)], color: PURPLE },
  eqtri: { label: 'Equilateral triangle', order: 3, polys: [ngon(3, 130)], color: SKY },
  hex: { label: 'Regular hexagon', order: 6, polys: [ngon(6, 125)], color: GREEN },
  pinwheel: { label: 'Paper pinwheel', order: 4, polys: pinwheel(), color: PINK },
  windmill: { label: 'Windmill', order: 3, polys: windmill(), color: AMBER },
  rect: { label: 'Rectangle', order: 2, polys: [rectPoly(-135, -75, 270, 150)], color: GREEN },
  para: { label: 'Parallelogram', order: 2, polys: [[[-125, 70], [45, 70], [125, -70], [-45, -70]]], color: '#fb923c' },
  kite: { label: 'Kite (patang)', order: 1, polys: [[[0, -130], [90, -40], [0, 130], [-90, -40]]], color: PINK },
};

function Chakra({ r = 125 }) {
  return (
    <g>
      <circle cx="0" cy="0" r={r} fill="none" stroke="#3b82f6" strokeWidth="7" />
      <circle cx="0" cy="0" r="16" fill="#3b82f6" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = rad(i * 15 - 90);
        return <line key={i} x1={14 * Math.cos(a)} y1={14 * Math.sin(a)} x2={r * Math.cos(a)} y2={r * Math.sin(a)} stroke="#3b82f6" strokeWidth="3.5" />;
      })}
    </g>
  );
}

export function Class6SymmetryRotateWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ shape: 'square', angle: 0, task: null }, visual);
  const key = ROT_SHAPES[s.shape] ? s.shape : 'square';
  const sh = ROT_SHAPES[key];
  const angle = int(s.angle, 0, 360, 0);
  const ta = useTween(angle, 1000);
  const step = 360 / sh.order;
  const same = Math.abs(ta - Math.round(ta / step) * step) < 0.6;
  const task = s.task ? s.task : null;
  const done = !!task && key === (task.shape || key) && angle > 0 && angle < 360 && Math.abs(angle - step) < 0.01;
  useDone(done, onInteract);
  const cx = 200;
  const cy = 180;
  const marks = Array.from({ length: sh.order }, (_, i) => (i + 1) * step);
  const dotPoly = sh.polys ? sh.polys[0][Math.min(1, sh.polys[0].length - 1)] : [0, -125];

  return (
    <StoryStage
      eyebrow="Visualizer · Rotational symmetry"
      title={`${sh.label}: order ${sh.order}, angle of symmetry ${sh.order === 1 ? 360 : step} degrees`}
      accent="text-sky-400"
      footer={
        <div className="space-y-3">
          <ModePills value={key} onChange={(v) => update({ shape: v, angle: 0 })} options={Object.entries(ROT_SHAPES).map(([k, v]) => ({ value: k, label: v.label }))} />
          <Slider label="Turn it" value={angle} min={0} max={360} onChange={(v) => update({ angle: v })} suffix="°" tone="text-sky-300" />
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Turned" value={`${Math.round(ta)}°`} tone="text-sky-300" />
            <Readout label="Angle of symmetry" value={`${sh.order === 1 ? 360 : step}°`} tone="text-amber-300" />
            <Readout label="Order" value={sh.order} tone="text-emerald-300" />
          </div>
          {task && <TaskBanner text={`Your turn: turn the ${sh.label.toLowerCase()} by the SMALLEST angle that makes it look exactly the same.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <g transform={`translate(${cx} ${cy})`}>
          {/* ghost of the starting position */}
          {sh.polys
            ? sh.polys.map((poly, i) => <polygon key={`g${i}`} points={pts(poly)} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 5" />)
            : <circle cx="0" cy="0" r="125" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 5" />}
          <g transform={`rotate(${ta})`}>
            {sh.polys
              ? sh.polys.map((poly, i) => <polygon key={i} points={pts(poly)} fill={`${sh.color}${same ? '66' : '33'}`} stroke={same && ta > 0.5 ? GREEN : sh.color} strokeWidth="3" strokeLinejoin="round" />)
              : <Chakra />}
            <circle cx={dotPoly[0] * 0.8} cy={dotPoly[1] * 0.8} r="7" fill={RED} />
          </g>
          <circle cx="0" cy="0" r="5" fill={INK} />
        </g>
        {/* dial */}
        <g transform="translate(480 130)">
          <circle cx="0" cy="0" r="78" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          {marks.map((m) => {
            const a = rad(m - 90);
            const hit = ta >= m - 0.6;
            return <circle key={m} cx={68 * Math.cos(a)} cy={68 * Math.sin(a)} r={sh.order > 12 ? 3 : 6} fill={hit ? GREEN : '#475569'} style={{ transition: 'fill 300ms' }} />;
          })}
          <line x1="0" y1="0" x2={60 * Math.cos(rad(ta - 90))} y2={60 * Math.sin(rad(ta - 90))} stroke={SKY} strokeWidth="4" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5" fill={SKY} />
          <text x="0" y="112" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">green dots: looks the same</text>
        </g>
        <text x="480" y="300" textAnchor="middle" fill={same && ta > 0.5 ? GREEN : '#64748b'} fontSize="20" fontWeight="900" fontFamily="sans-serif" style={{ transition: 'fill 300ms' }}>
          {ta < 0.5 ? 'Start position' : same ? 'Looks the same!' : 'Looks different'}
        </text>
        <text x="480" y="328" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="monospace">360 ÷ {sh.order} = {Math.round(360 / sh.order * 10) / 10}</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Build a kolam / rangoli design: lines and rotation together ───
const PETAL_SYM = 'M 0 -18 C 34 -50 30 -95 0 -128 C -30 -95 -34 -50 0 -18 Z';
const PETAL_SWIRL = 'M 0 -18 C 40 -40 50 -90 10 -128 C 30 -95 0 -60 -22 -60 C -18 -40 -10 -28 0 -18 Z';

export function Class6SymmetryDesignWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ n: 4, sym: true, showLines: false, task: null }, visual);
  const n = int(s.n, 1, 12, 4);
  const sym = s.sym !== false;
  const lines = sym ? n : 0;
  const order = n;
  const p = useReplay(`${n}-${sym}`, 1400);
  const task = s.task && s.task.order !== undefined ? s.task : null;
  const done = !!task && lines === task.lines && order === task.order;
  useDone(done, onInteract);
  const cx = 210;
  const cy = 180;

  return (
    <StoryStage
      eyebrow="Visualizer · Kolam designer"
      title={`${n} petal${n === 1 ? '' : 's'}: ${lines} line${lines === 1 ? '' : 's'} of symmetry, order ${order}`}
      accent="text-pink-400"
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 items-end">
            <Slider label="Petals" value={n} min={1} max={12} onChange={(v) => update({ n: v })} tone="text-pink-300" />
            <div className="flex flex-wrap gap-2">
              <ModePills value={sym ? 'sym' : 'swirl'} onChange={(v) => update({ sym: v === 'sym' })} options={[{ value: 'sym', label: 'Petal (symmetric)' }, { value: 'swirl', label: 'Swirl (no mirror)' }]} />
              <button onClick={() => update({ showLines: !s.showLines })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-600 text-slate-300">{s.showLines ? 'Hide lines' : 'Show lines'}</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Lines of symmetry" value={lines} tone="text-amber-300" />
            <Readout label="Order of rotation" value={order} tone="text-emerald-300" />
            <Readout label="Angle of symmetry" value={`${Math.round((360 / n) * 10) / 10}°`} tone="text-sky-300" />
          </div>
          {task && <TaskBanner text={`Your turn: design a kolam with ${task.lines} lines of symmetry and rotational order ${task.order}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={cx - 160 + c * 40} cy={cy - 160 + r * 40} r="2.2" fill="#e7e5e4" opacity="0.35" />
        )))}
        <g transform={`translate(${cx} ${cy})`}>
          {Array.from({ length: n }, (_, i) => {
            const t = ease(seg(p, (i / n) * 0.6, (i / n) * 0.6 + 0.4));
            return (
              <g key={`${n}-${sym}-${i}`} transform={`rotate(${(360 * i) / n}) scale(${lerp(0.2, 1, t)})`} opacity={t}>
                <path d={sym ? PETAL_SYM : PETAL_SWIRL} fill={RCOLS[i % RCOLS.length]} fillOpacity="0.75" stroke="#fef3c7" strokeWidth="2" />
              </g>
            );
          })}
          <circle cx="0" cy="0" r="16" fill={AMBER} stroke="#fef3c7" strokeWidth="2" />
          {s.showLines && lines > 0 && Array.from({ length: lines }, (_, i) => {
            const a = rad(-90 + (180 * i) / n);
            return <line key={`l${n}-${i}`} x1={-160 * Math.cos(a)} y1={-160 * Math.sin(a)} x2={160 * Math.cos(a)} y2={160 * Math.sin(a)} stroke={SKY} strokeWidth="2" strokeDasharray="7 5" style={{ animation: `syFadeIn 400ms ease ${i * 120}ms both` }} />;
          })}
        </g>
        <g>
          <text x="490" y="110" textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily="sans-serif">{sym ? 'Each petal has a mirror' : 'Swirls have no mirror'}</text>
          <text x="490" y="132" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">{sym ? `so ${n} line${n === 1 ? '' : 's'} of symmetry` : 'so 0 lines of symmetry'}</text>
          <text x="490" y="200" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif">Turn by {Math.round((360 / n) * 10) / 10} degrees</text>
          <text x="490" y="222" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">{n === 1 ? 'only a full turn works' : `it looks the same ${n} times`}</text>
        </g>
        <style>{STYLE}</style>
      </svg>
    </StoryStage>
  );
}
