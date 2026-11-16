import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Pair of Linear Equations in Two Variables — scene-driven story widgets.
// Every equation is stored as [a, b, k], meaning a x + b y = k (NCERT form a x + b y + c = 0 has c = −k).

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const FADE = '@keyframes leFadeIn { from { opacity: 0; transform: translateX(14px) } to { opacity: 1; transform: none } }';

const num = (v) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? `−${Math.abs(r)}` : `${Math.abs(r) === 0 ? 0 : r}`;
};
// reduced fraction p/q (q may be negative); null when q = 0
function frac(p, q) {
  if (q === 0) return null;
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(Math.abs(p), q) || 1;
  return { n: p / g, d: q / g };
}
const fstr = (f) => (!f ? 'undefined' : f.d === 1 ? num(f.n) : `${num(f.n)}/${f.d}`);

function lhs(a, b, xv = 'x', yv = 'y') {
  const term = (c, v, first) => {
    if (c === 0) return '';
    const abs = Math.abs(c);
    const sign = c < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ';
    return `${sign}${abs === 1 ? '' : abs}${v}`;
  };
  const s = term(a, xv, true) + term(b, yv, a === 0);
  return s || '0';
}
const eqStr = (e, xv, yv) => `${lhs(e[0], e[1], xv, yv)} = ${num(e[2])}`;
const ncertStr = (e) => {
  const c = -e[2];
  return `${lhs(e[0], e[1])}${c === 0 ? '' : c < 0 ? ` − ${Math.abs(c)}` : ` + ${c}`} = 0`;
};

function solve(e1, e2) {
  const D = e1[0] * e2[1] - e2[0] * e1[1];
  if (Math.abs(D) < 1e-9) return null;
  return [(e1[2] * e2[1] - e2[2] * e1[1]) / D, (e1[0] * e2[2] - e2[0] * e1[2]) / D];
}
function kindOf(e1, e2) {
  if (e1[0] * e2[1] - e2[0] * e1[1] !== 0) return 'intersect';
  return e1[0] * e2[2] === e2[0] * e1[2] && e1[1] * e2[2] === e2[1] * e1[2] ? 'coincident' : 'parallel';
}
const KIND = {
  intersect: { title: 'Intersecting lines', sub: 'Exactly one solution', tag: 'Consistent', color: GREEN },
  coincident: { title: 'Coincident lines', sub: 'Infinitely many solutions', tag: 'Dependent (consistent)', color: SKY },
  parallel: { title: 'Parallel lines', sub: 'No solution', tag: 'Inconsistent', color: RED },
};

const isEq = (e) => Array.isArray(e) && e.length === 3 && e.every((v) => Number.isFinite(Number(v)));
const toEq = (e, dflt) => (isEq(e) ? e.map(Number) : dflt);
const isRange = (r) => Array.isArray(r) && r.length === 4 && r.every(Number.isFinite) && r[1] > r[0] && r[3] > r[2];

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

function Slider({ label, value, min, max, onChange, tone = 'text-amber-300' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{num(value)}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// ─── Plot helpers ───
function scaleFor(range, X, Y, w, h) {
  const [x0, x1, y0, y1] = range;
  return {
    sx: (v) => X + ((v - x0) / (x1 - x0)) * w,
    sy: (v) => Y + h - ((v - y0) / (y1 - y0)) * h,
    ix: (px) => x0 + ((px - X) / w) * (x1 - x0),
    iy: (py) => y0 + ((Y + h - py) / h) * (y1 - y0),
    X, Y, w, h, range,
  };
}

// The part of a x + b y = k inside the range, as two points (data coordinates), left to right
function clipLine(a, b, k, [x0, x1, y0, y1]) {
  const pts = [];
  const eps = 1e-9;
  if (Math.abs(b) > eps) for (const x of [x0, x1]) { const y = (k - a * x) / b; if (y >= y0 - eps && y <= y1 + eps) pts.push([x, y]); }
  if (Math.abs(a) > eps) for (const y of [y0, y1]) { const x = (k - b * y) / a; if (x >= x0 - eps && x <= x1 + eps) pts.push([x, y]); }
  if (pts.length < 2) return null;
  let best = [pts[0], pts[1]];
  let bd = -1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2;
    if (d > bd) { bd = d; best = [pts[i], pts[j]]; }
  }
  return best.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
}

function Grid({ sc, grid = 1, tick = 1, small = false }) {
  const [x0, x1, y0, y1] = sc.range;
  const xs = [];
  const ys = [];
  for (let v = Math.ceil(x0 / grid) * grid; v <= x1 + 1e-9; v += grid) xs.push(Math.round(v * 1000) / 1000);
  for (let v = Math.ceil(y0 / grid) * grid; v <= y1 + 1e-9; v += grid) ys.push(Math.round(v * 1000) / 1000);
  const labelled = (v) => Math.abs(v / tick - Math.round(v / tick)) < 1e-6 && v !== 0;
  const ax = clamp(sc.sx(0), sc.X, sc.X + sc.w);
  const ay = clamp(sc.sy(0), sc.Y, sc.Y + sc.h);
  return (
    <g>
      <rect x={sc.X} y={sc.Y} width={sc.w} height={sc.h} fill="#0b1222" stroke="#1e293b" />
      {xs.map((v) => <line key={`gx${v}`} x1={sc.sx(v)} y1={sc.Y} x2={sc.sx(v)} y2={sc.Y + sc.h} stroke="#1e293b" strokeWidth="1" />)}
      {ys.map((v) => <line key={`gy${v}`} x1={sc.X} y1={sc.sy(v)} x2={sc.X + sc.w} y2={sc.sy(v)} stroke="#1e293b" strokeWidth="1" />)}
      {x0 <= 0 && x1 >= 0 && <line x1={sc.sx(0)} y1={sc.Y} x2={sc.sx(0)} y2={sc.Y + sc.h} stroke="#64748b" strokeWidth="1.6" />}
      {y0 <= 0 && y1 >= 0 && <line x1={sc.X} y1={sc.sy(0)} x2={sc.X + sc.w} y2={sc.sy(0)} stroke="#64748b" strokeWidth="1.6" />}
      {!small && xs.filter(labelled).map((v) => <text key={`tx${v}`} x={sc.sx(v)} y={Math.min(ay + 15, sc.Y + sc.h + 15)} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">{num(v)}</text>)}
      {!small && ys.filter(labelled).map((v) => <text key={`ty${v}`} x={Math.max(ax - 5, sc.X - 4)} y={sc.sy(v) + 4} textAnchor="end" fill="#64748b" fontSize="11" fontFamily="monospace">{num(v)}</text>)}
      {!small && <text x={sc.X + sc.w - 4} y={ay - 6} textAnchor="end" fill="#94a3b8" fontSize="13" fontWeight="800" fontStyle="italic">x</text>}
      {!small && <text x={ax + 6} y={sc.Y + 14} fill="#94a3b8" fontSize="13" fontWeight="800" fontStyle="italic">y</text>}
    </g>
  );
}

function PlotLine({ sc, e, color, prog = 1, width = 3.5, glow = false }) {
  const pts = clipLine(e[0], e[1], e[2], sc.range);
  if (!pts || prog <= 0) return null;
  const [p, q] = pts;
  const end = [lerp(p[0], q[0], prog), lerp(p[1], q[1], prog)];
  return (
    <g>
      {glow && <line x1={sc.sx(p[0])} y1={sc.sy(p[1])} x2={sc.sx(end[0])} y2={sc.sy(end[1])} stroke={color} strokeWidth={width * 3.2} strokeLinecap="round" opacity="0.28" />}
      <line x1={sc.sx(p[0])} y1={sc.sy(p[1])} x2={sc.sx(end[0])} y2={sc.sy(end[1])} stroke={color} strokeWidth={width} strokeLinecap="round" />
    </g>
  );
}

function MiniPlot({ X, Y, w, h, range, e1, e2, show = true, grid = 1 }) {
  const sc = scaleFor(range, X, Y, w, h);
  const sol = e1 && e2 ? solve(e1, e2) : null;
  const inside = sol && sol[0] >= range[0] && sol[0] <= range[1] && sol[1] >= range[2] && sol[1] <= range[3];
  return (
    <g style={{ opacity: show ? 1 : 0.25, transition: 'opacity 600ms ease' }}>
      <Grid sc={sc} grid={grid} small />
      <PlotLine sc={sc} e={e1} color={AMBER} width={2.5} />
      {e2 && <PlotLine sc={sc} e={e2} color={SKY} width={kindOf(e1, e2) === 'coincident' ? 7 : 2.5} />}
      {e2 && kindOf(e1, e2) === 'coincident' && <PlotLine sc={sc} e={e1} color={AMBER} width={2.5} />}
      {inside && show && <circle cx={sc.sx(sol[0])} cy={sc.sy(sol[1])} r="5" fill={GREEN} stroke="#020617" strokeWidth="2" />}
    </g>
  );
}

// ─── WIDGET 1: Lines on a graph (one equation = a line; a pair = two lines) ───
export function Class10LinEqGraphWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({
    eqs: [[1, 1, 5]], range: [-1, 8, -1, 8], grid: 1, tick: 1, snap: 0, points: [], meet: false, verdict: true,
    drag: false, dot: null, sliders: false, task: null, caption: '', xName: 'x', yName: 'y',
  }, visual);
  const range = isRange(s.range) ? s.range : [-1, 8, -1, 8];
  const grid = Number(s.grid) > 0 ? Number(s.grid) : 1;
  const tick = Number(s.tick) > 0 ? Number(s.tick) : grid;
  const snap = Number(s.snap) > 0 ? Number(s.snap) : grid;
  const list = (Array.isArray(s.eqs) ? s.eqs : []).filter(isEq).slice(0, 2).map((e) => e.map(Number));
  const e1 = list[0] || [1, 1, 5];
  const e2 = list[1] || null;
  const t1 = [useTween(e1[0], 400), useTween(e1[1], 400), useTween(e1[2], 400)];
  const t2 = [useTween(e2 ? e2[0] : e1[0], 400), useTween(e2 ? e2[1] : e1[1], 400), useTween(e2 ? e2[2] : e1[2], 400)];
  const p = useReplay(JSON.stringify(visual?.eqs || null) + JSON.stringify(visual?.points || null), 2200);
  const sc = scaleFor(range, 48, 18, 300, 318);
  const kind = e2 ? kindOf(e1, e2) : null;
  const sol = kind === 'intersect' ? solve(e1, e2) : null;
  const solIn = sol && sol[0] >= range[0] && sol[0] <= range[1] && sol[1] >= range[2] && sol[1] <= range[3];
  const points = (Array.isArray(s.points) ? s.points : []).filter((q) => Array.isArray(q) && q.length === 2);
  const dflt = [Math.round((range[0] + range[1]) / 2 / snap) * snap, Math.round((range[2] + range[3]) / 2 / snap) * snap];
  const dot = s.drag ? (Array.isArray(s.dot) && s.dot.length === 2 ? s.dot.map(Number) : dflt) : null;
  const drag = useSvgDrag(svgRef, (px, py) => {
    const x = clamp(Math.round(sc.ix(px) / snap) * snap, range[0], range[1]);
    const y = clamp(Math.round(sc.iy(py) / snap) * snap, range[2], range[3]);
    update({ dot: [Math.round(x * 100) / 100, Math.round(y * 100) / 100] });
  });
  const onLine = (e, d) => d && Math.abs(e[0] * d[0] + e[1] * d[1] - e[2]) < 1e-6;

  const task = s.task && s.task.type ? s.task : null;
  let done = false;
  if (task) {
    if (task.type === 'point') done = !!dot && dot[0] === task.x && dot[1] === task.y;
    else if (task.type === 'both') done = !!dot && onLine(e1, dot) && !!e2 && onLine(e2, dot);
    else if (task.type === 'line') done = !!dot && onLine(e1, dot) && !(task.notX != null && dot[0] === task.notX);
    else done = kind === task.type;
  }
  useDone(done, onInteract);

  const setE2 = (i, v) => {
    const n = [...(e2 || [1, 1, 0])];
    n[i] = v;
    update({ eqs: [e1, n] });
  };
  const xn = s.xName || 'x';
  const yn = s.yName || 'y';
  const pLine1 = points.length ? seg(p, 0.35, 0.7) : seg(p, 0, 0.45);
  const pLine2 = seg(p, 0.5, 0.9);
  const info = kind ? KIND[kind] : null;
  const cap = Array.isArray(s.caption) ? s.caption : s.caption ? [s.caption] : [];

  return (
    <StoryStage
      eyebrow="Visualizer · Graphical method"
      title={info && s.verdict ? `${info.title}: ${info.sub.toLowerCase()}` : e2 ? 'Two equations, two lines' : 'One equation, one line'}
      footer={
        <div className="space-y-3">
          {task && <TaskBanner text={task.text} done={done} />}
          {s.sliders && e2 && (
            <div className="grid sm:grid-cols-3 gap-3">
              <Slider label="Line 2: a (x coefficient)" value={e2[0]} min={-6} max={6} onChange={(v) => setE2(0, v)} tone="text-sky-300" />
              <Slider label="Line 2: b (y coefficient)" value={e2[1]} min={-6} max={6} onChange={(v) => setE2(1, v)} tone="text-sky-300" />
              <Slider label="Line 2: right-hand side" value={e2[2]} min={-20} max={20} onChange={(v) => setE2(2, v)} tone="text-sky-300" />
            </div>
          )}
          {dot && <div className="text-xs text-slate-400">Drag the green dot. It snaps to the grid; the panel checks it in each equation.</div>}
        </div>
      }
    >
      <svg ref={svgRef} viewBox="0 0 600 360" className="w-full h-auto select-none" style={{ touchAction: dot ? 'none' : 'auto' }}>
        <Grid sc={sc} grid={grid} tick={tick} />
        <PlotLine sc={sc} e={t1} color={AMBER} prog={pLine1} />
        {e2 && <PlotLine sc={sc} e={t2} color={SKY} prog={pLine2} width={kind === 'coincident' ? 4 : 3.5} glow={kind === 'coincident'} />}
        {e2 && kind === 'coincident' && <PlotLine sc={sc} e={t1} color={AMBER} prog={Math.min(pLine1, pLine2)} width={2} />}
        {points.map((q, i) => {
          const show = seg(p, 0.04 + i * 0.07, 0.1 + i * 0.07);
          return (
            <g key={`pt${i}`} opacity={show}>
              <circle cx={sc.sx(q[0])} cy={sc.sy(q[1])} r={4 + 3 * show} fill={PINK} stroke="#020617" strokeWidth="2" />
              <text x={sc.sx(q[0]) + 8} y={sc.sy(q[1]) - 8} fill={PINK} fontSize="12" fontWeight="800" fontFamily="monospace">({num(q[0])}, {num(q[1])})</text>
            </g>
          );
        })}
        {s.meet && solIn && pLine2 >= 1 && (
          <g>
            <circle cx={sc.sx(sol[0])} cy={sc.sy(sol[1])} r="7" fill={GREEN} stroke="#020617" strokeWidth="2" />
            <circle cx={sc.sx(sol[0])} cy={sc.sy(sol[1])} r="7" fill="none" stroke={GREEN} strokeWidth="2">
              <animate attributeName="r" values="7;24" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <text x={sc.sx(sol[0]) + (sc.sx(sol[0]) > 280 ? -10 : 10)} y={sc.sy(sol[1]) - 12} textAnchor={sc.sx(sol[0]) > 280 ? 'end' : 'start'} fill={GREEN} fontSize="14" fontWeight="900" fontFamily="monospace">({num(sol[0])}, {num(sol[1])})</text>
          </g>
        )}
        {dot && (
          <g {...drag} style={{ cursor: 'grab' }}>
            <circle cx={sc.sx(dot[0])} cy={sc.sy(dot[1])} r="20" fill="transparent" />
            <circle cx={sc.sx(dot[0])} cy={sc.sy(dot[1])} r="8" fill={done ? GREEN : '#22c55e'} stroke="#f8fafc" strokeWidth="2.5" />
          </g>
        )}

        {/* info panel */}
        <g fontFamily="monospace" fontWeight="800">
          <text x="372" y="34" fill={AMBER} fontSize="17">(1) {eqStr(e1, xn, yn)}</text>
          {e2 && <text x="372" y="62" fill={SKY} fontSize="17" opacity={seg(p, 0.45, 0.6)}>(2) {eqStr(e2, xn, yn)}</text>}
        </g>
        {info && s.verdict && (
          <g opacity={seg(p, 0.85, 1)}>
            <rect x="368" y="80" width="222" height="84" rx="12" fill="#0f172a" stroke={info.color} strokeWidth="2" />
            <text x="479" y="106" textAnchor="middle" fill={info.color} fontSize="16" fontWeight="900">{info.title}</text>
            <text x="479" y="130" textAnchor="middle" fill={INK} fontSize="14" fontWeight="700">{info.sub}</text>
            <text x="479" y="152" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">{info.tag}</text>
          </g>
        )}
        {s.meet && sol && (
          <text x="479" y="190" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.9, 1)}>{xn} = {num(sol[0])}, {yn} = {num(sol[1])}</text>
        )}
        {dot && (
          <g fontFamily="monospace" fontSize="13" fontWeight="800">
            <text x="372" y="214" fill="#22c55e">Dot at ({num(dot[0])}, {num(dot[1])})</text>
            {[e1, e2].filter(Boolean).map((e, i) => {
              const v = e[0] * dot[0] + e[1] * dot[1];
              const ok = Math.abs(v - e[2]) < 1e-6;
              return (
                <text key={`chk${i}`} x="372" y={238 + i * 22} fill={ok ? GREEN : '#94a3b8'}>
                  ({i + 1}) LHS = {num(v)} {ok ? '✔ on line' : `✘ need ${num(e[2])}`}
                </text>
              );
            })}
          </g>
        )}
        {cap.map((c, i) => (
          <text key={`cap${i}`} x="372" y={300 + i * 20} fill="#cbd5e1" fontSize="13" fontWeight="700">{c}</text>
        ))}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: The ratio test (a1/a2, b1/b2, c1/c2) ───
function Ratio({ x, y, top, bottom, color, show }) {
  return (
    <g style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(12px)', transition: 'opacity 500ms ease, transform 500ms ease' }}>
      <text x={x} y={y - 8} textAnchor="middle" fill={color} fontSize="24" fontWeight="900" fontFamily="monospace">{num(top)}</text>
      <line x1={x - 26} y1={y} x2={x + 26} y2={y} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <text x={x} y={y + 26} textAnchor="middle" fill={color} fontSize="24" fontWeight="900" fontFamily="monospace">{num(bottom)}</text>
      <text x={x} y={y + 62} textAnchor="middle" fill={INK} fontSize="17" fontWeight="800" fontFamily="monospace">= {fstr(frac(top, bottom))}</text>
    </g>
  );
}

export function Class10LinEqRatioWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ e1: [5, -4, -8], e2: [7, 6, 9], step: 4, sliders: false, task: null, range: [-6, 6, -6, 6] }, visual);
  const e1 = toEq(s.e1, [5, -4, -8]);
  const e2 = toEq(s.e2, [7, 6, 9]);
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 4);
  const range = isRange(s.range) ? s.range : [-6, 6, -6, 6];
  const c1 = -e1[2];
  const c2 = -e2[2];
  const kind = kindOf(e1, e2);
  const info = KIND[kind];
  const eqAB = e1[0] * e2[1] === e2[0] * e1[1];
  const eqBC = e1[1] * c2 === e2[1] * c1 && c1 !== 0 && c2 !== 0;
  const task = s.task && s.task.type ? s.task : null;
  const done = !!task && kind === task.type;
  useDone(done, onInteract);
  const setE2 = (i, v) => { const n = [...e2]; n[i] = i === 2 ? -v : v; update({ e2: n }); };
  const cols = [
    { x: 80, top: e1[0], bottom: e2[0], label: 'a1 / a2', color: AMBER },
    { x: 205, top: e1[1], bottom: e2[1], label: 'b1 / b2', color: SKY },
    { x: 330, top: c1, bottom: c2, label: 'c1 / c2', color: PINK },
  ];
  const rule = kind === 'intersect' ? 'a1/a2 ≠ b1/b2' : kind === 'coincident' ? 'a1/a2 = b1/b2 = c1/c2' : 'a1/a2 = b1/b2 ≠ c1/c2';

  return (
    <StoryStage
      eyebrow="Visualizer · Ratio test"
      title={step >= 4 ? `${info.title} · ${info.tag}` : 'Compare the coefficients'}
      footer={
        <div className="space-y-3">
          {task && <TaskBanner text={task.text} done={done} />}
          {s.sliders && (
            <div className="grid sm:grid-cols-3 gap-3">
              <Slider label="a2" value={e2[0]} min={-12} max={12} onChange={(v) => setE2(0, v)} tone="text-amber-300" />
              <Slider label="b2" value={e2[1]} min={-12} max={12} onChange={(v) => setE2(1, v)} tone="text-sky-300" />
              <Slider label="c2" value={c2} min={-30} max={30} onChange={(v) => setE2(2, v)} tone="text-pink-300" />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Readout label="a1 b2 vs a2 b1" value={`${num(e1[0] * e2[1])} | ${num(e2[0] * e1[1])}`} tone={eqAB ? 'text-sky-300' : 'text-emerald-400'} />
            <Readout label="Solutions" value={kind === 'intersect' ? 'one' : kind === 'coincident' ? 'infinite' : 'none'} tone={kind === 'parallel' ? 'text-red-400' : 'text-emerald-400'} />
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x="205" y="36" textAnchor="middle" fill={AMBER} fontSize="20" fontWeight="900" fontFamily="monospace">{ncertStr(e1)}</text>
        <text x="205" y="68" textAnchor="middle" fill={SKY} fontSize="20" fontWeight="900" fontFamily="monospace">{ncertStr(e2)}</text>
        {cols.map((c, i) => (
          <g key={c.label}>
            <text x={c.x} y="112" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily="monospace" opacity={step > i ? 1 : 0.35}>{c.label}</text>
            <Ratio x={c.x} y={160} top={c.top} bottom={c.bottom} color={c.color} show={step > i} />
          </g>
        ))}
        <g style={{ opacity: step >= 4 ? 1 : 0, transition: 'opacity 600ms ease 200ms' }}>
          <text x="142" y="166" textAnchor="middle" fill={eqAB ? SKY : GREEN} fontSize="30" fontWeight="900">{eqAB ? '=' : '≠'}</text>
          {eqAB && <text x="267" y="166" textAnchor="middle" fill={eqBC ? SKY : RED} fontSize="30" fontWeight="900">{eqBC ? '=' : '≠'}</text>}
          <rect x="20" y="262" width="370" height="84" rx="14" fill="#0f172a" stroke={info.color} strokeWidth="2" />
          <text x="205" y="290" textAnchor="middle" fill={info.color} fontSize="18" fontWeight="900" fontFamily="monospace">{rule}</text>
          <text x="205" y="314" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800">{info.title}: {info.sub.toLowerCase()}</text>
          <text x="205" y="335" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">The pair is {info.tag.toLowerCase()}.</text>
        </g>
        <text x="502" y="102" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800">What the graph shows</text>
        <MiniPlot X={418} Y={115} w={168} h={168} range={range} e1={e1} e2={e2} show={step >= 4} />
        <text x="502" y="306" textAnchor="middle" fill={step >= 4 ? info.color : '#475569'} fontSize="13" fontWeight="800">{step >= 4 ? info.title : 'hidden until the test'}</text>
      </svg>
    </StoryStage>
  );
}

// Step text with [[highlighted]] parts
function StepText({ x, y, text, size = 16, color = INK, hl = AMBER }) {
  const parts = String(text).split(/(\[\[.*?\]\])/g).filter(Boolean);
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight="800" fontFamily="monospace">
      {parts.map((pt, i) => (pt.startsWith('[[')
        ? <tspan key={i} fill={hl}>{pt.slice(2, -2)}</tspan>
        : <tspan key={i}>{pt}</tspan>))}
    </text>
  );
}

// Two number boxes that check a guessed (x, y) in both equations
function Checker({ eqs, sol, names = ['x', 'y'], onSolved, label = 'Check your answer' }) {
  const [xv, setX] = useState('');
  const [yv, setY] = useState('');
  const x = Number(xv);
  const y = Number(yv);
  const filled = xv.trim() !== '' && yv.trim() !== '' && Number.isFinite(x) && Number.isFinite(y);
  const ok = filled && Math.abs(x - sol[0]) < 1e-9 && Math.abs(y - sol[1]) < 1e-9;
  useEffect(() => {
    if (ok) onSolved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1 text-amber-300 font-mono font-bold">{names[0]} = <input value={xv} onChange={(e) => setX(e.target.value)} className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white" inputMode="decimal" /></label>
        <label className="flex items-center gap-1 text-sky-300 font-mono font-bold">{names[1]} = <input value={yv} onChange={(e) => setY(e.target.value)} className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white" inputMode="decimal" /></label>
      </div>
      {filled && (
        <div className="text-xs font-mono space-y-0.5">
          {eqs.map((e, i) => {
            const v = e[0] * x + e[1] * y;
            const good = Math.abs(v - e[2]) < 1e-9;
            return <div key={i} className={good ? 'text-emerald-400' : 'text-red-300'}>({i + 1}) {eqStr(e, names[0], names[1])}: LHS = {num(v)} {good ? '✔' : '✘'}</div>;
          })}
          {ok && <div className="text-emerald-300 font-bold">Both equations are satisfied. Solved!</div>}
        </div>
      )}
    </div>
  );
}

// ─── WIDGET 3: Substitution method ───
const SUB = {
  bat: {
    label: 'Bat and ball', names: ['x', 'y'], eqs: [[1, -1, 300], [1, 3, 700]], sol: [400, 100], range: [0, 800, -100, 500], grid: 100,
    note: 'x = price of a bat, y = price of a ball (₹)',
    steps: ['From (1):  x = [[y + 300]]          (3)', 'Put (3) in (2):  [[(y + 300)]] + 3y = 700', '4y + 300 = 700  ⇒  4y = 400', 'y = 100', 'From (3):  x = 100 + 300 = 400', 'Check (2): 400 + 3 × 100 = 700 ✔'],
  },
  sum: {
    label: 'x + y = 14', names: ['x', 'y'], eqs: [[1, 1, 14], [1, -1, 4]], sol: [9, 5], range: [0, 16, -2, 16], grid: 2,
    note: 'Two numbers: sum 14, difference 4',
    steps: ['From (1):  x = [[14 − y]]           (3)', 'Put (3) in (2):  [[(14 − y)]] − y = 4', '14 − 2y = 4  ⇒  2y = 10', 'y = 5', 'From (3):  x = 14 − 5 = 9', 'Check (2): 9 − 5 = 4 ✔'],
  },
  board: {
    label: '2x + 3y = 11', names: ['x', 'y'], eqs: [[2, 3, 11], [2, -4, -24]], sol: [-2, 5], range: [-8, 6, -2, 10], grid: 2,
    note: 'NCERT style: also find m if y = mx + 3',
    steps: ['From (1):  2x = [[11 − 3y]]          (3)', 'Put (3) in (2):  [[(11 − 3y)]] − 4y = −24', '11 − 7y = −24  ⇒  7y = 35', 'y = 5', 'From (3):  2x = 11 − 15 = −4, x = −2', 'y = mx + 3:  5 = −2m + 3, so m = −1'],
  },
};

export function Class10LinEqSubstitutionWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ problem: 'bat', step: 0, task: null }, visual);
  const key = SUB[s.problem] ? s.problem : 'bat';
  const P = SUB[key];
  const step = clamp(Math.round(Number(s.step)) || 0, 0, P.steps.length);
  const task = s.task && s.task.text ? s.task : null;
  const [solved, setSolved] = useState(false);
  useEffect(() => { setSolved(false); }, [key, JSON.stringify(visual || {})]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = !!task && solved;
  useDone(done, onInteract);
  const finished = step >= 5;

  return (
    <StoryStage
      eyebrow="Visualizer · Substitution method"
      title={`Substitution: ${P.label}`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {task && <TaskBanner text={task.text} done={done} />}
          <div className="flex flex-wrap items-center gap-2">
            <ModePills value={key} onChange={(v) => update({ problem: v, step: 0 })} options={Object.entries(SUB).map(([k, v]) => ({ value: k, label: v.label }))} />
            <button onClick={() => update({ step: Math.min(P.steps.length, step + 1) })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">Show next step</button>
            <button onClick={() => update({ step: 0 })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">Reset</button>
          </div>
          {task && <Checker key={key} eqs={P.eqs} sol={P.sol} names={P.names} onSolved={() => setSolved(true)} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x="20" y="30" fill="#94a3b8" fontSize="13" fontWeight="700">{P.note}</text>
        <text x="20" y="62" fill={AMBER} fontSize="19" fontWeight="900" fontFamily="monospace">(1)  {eqStr(P.eqs[0])}</text>
        <text x="20" y="92" fill={SKY} fontSize="19" fontWeight="900" fontFamily="monospace">(2)  {eqStr(P.eqs[1])}</text>
        <line x1="20" y1="106" x2="410" y2="106" stroke="#334155" strokeWidth="1.5" />
        {P.steps.map((t, i) => (i < step ? (
          <g key={`${key}-${i}`} style={{ animation: 'leFadeIn 600ms ease both' }}>
            <circle cx="30" cy={130 + i * 36} r="11" fill={i === step - 1 ? AMBER : '#334155'} />
            <text x="30" y={135 + i * 36} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900">{i + 1}</text>
            <StepText x={50} y={136 + i * 36} text={t} size={15} color={i === 3 || (key !== 'board' && i === 4) ? GREEN : INK} />
          </g>
        ) : null))}
        {step === 0 && <text x="215" y="200" textAnchor="middle" fill="#64748b" fontSize="15" fontWeight="700">Pick the easier equation and make one letter the subject.</text>}
        <text x="502" y="62" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="800">Both lines on a graph</text>
        <MiniPlot X={424} Y={74} w={160} h={160} range={P.range} e1={P.eqs[0]} e2={P.eqs[1]} show={finished} grid={P.grid} />
        <text x="504" y="258" textAnchor="middle" fill={finished ? GREEN : '#475569'} fontSize="15" fontWeight="900" fontFamily="monospace">{finished ? `(${num(P.sol[0])}, ${num(P.sol[1])})` : '( ?, ? )'}</text>
        {finished && <text x="504" y="278" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">algebra = meeting point</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Elimination method ───
const ELIM = {
  sweets: { label: 'Sweet boxes', names: ['x', 'y'], eqs: [[2, 3, 1550], [3, 2, 1700]], m: [3, 2], note: 'x = kaju box, y = besan box (₹)' },
  board: { label: '3x + 4y = 10', names: ['x', 'y'], eqs: [[3, 4, 10], [2, -2, 2]], m: [1, 2], note: 'Board practice' },
  ages: { label: 'Ages', names: ['x', 'y'], eqs: [[1, -1, 30], [1, -6, -50]], m: [1, 1], note: 'x = Papa’s age, y = Harsh’s age' },
  parallel: { label: 'No solution?', names: ['x', 'y'], eqs: [[2, 4, 12], [1, 2, 4]], m: [1, 2], note: 'Railway tracks pair' },
  same: { label: 'Same line?', names: ['x', 'y'], eqs: [[1, 2, 4], [2, 4, 8]], m: [2, 1], note: 'One equation is a multiple of the other' },
};

function EqRow({ y, e, hlX, hlY, color, label, size = 20 }) {
  const termX = e[0] === 0 ? '0x' : lhs(e[0], 0);
  const yPart = e[1] === 0 ? ' + 0y' : (e[1] < 0 ? ' − ' : ' + ') + (Math.abs(e[1]) === 1 ? '' : Math.abs(e[1])) + 'y';
  return (
    <text x="70" y={y} fontSize={size} fontWeight="900" fontFamily="monospace" fill={color}>
      <tspan fill="#64748b" fontSize="15">{label}</tspan>
      <tspan x="130" fill={hlX || color}>{termX}</tspan>
      <tspan fill={hlY || color}>{yPart}</tspan>
      <tspan> = {num(e[2])}</tspan>
    </text>
  );
}

export function Class10LinEqEliminationWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ problem: 'sweets', m1: null, m2: null, step: 0, prefer: null, task: null }, visual);
  const key = ELIM[s.problem] ? s.problem : 'sweets';
  const P = ELIM[key];
  const m1 = clamp(Math.round(Number(s.m1 ?? P.m[0])) || 1, 1, 9);
  const m2 = clamp(Math.round(Number(s.m2 ?? P.m[1])) || 1, 1, 9);
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 4);
  const [a1, b1, k1] = P.eqs[0];
  const [a2, b2, k2] = P.eqs[1];
  const S1 = [m1 * a1, m1 * b1, m1 * k1];
  const S2 = [m2 * a2, m2 * b2, m2 * k2];
  const opY = S1[1] === S2[1] ? '−' : S1[1] === -S2[1] ? '+' : null;
  const opX = S1[0] === S2[0] ? '−' : S1[0] === -S2[0] ? '+' : null;
  const target = s.prefer === 'x' && opX ? 'x' : opY ? 'y' : opX ? 'x' : null;
  const op = target === 'y' ? opY : target === 'x' ? opX : null;
  const R = op ? S1.map((v, i) => (op === '−' ? v - S2[i] : v + S2[i])) : null;
  const left = R && target === 'y' ? R[0] : R ? R[1] : 0;
  const leftVar = target === 'y' ? 'x' : 'y';
  let outcome = null;
  if (R) {
    if (R[0] === 0 && R[1] === 0) outcome = R[2] === 0 ? 'many' : 'none';
    else {
      const v = frac(R[2], left);
      // back-substitute in the original equation (1) (or (2) if needed)
      const [ea, eb, ek] = (target === 'y' ? b1 : a1) !== 0 ? P.eqs[0] : P.eqs[1];
      let other;
      if (target === 'y') other = frac(ek * v.d - ea * v.n, eb * v.d);
      else other = frac(ek * v.d - eb * v.n, ea * v.d);
      outcome = { v, other };
    }
  }
  const task = s.task && s.task.eliminate ? s.task : null;
  const done = !!task && target === task.eliminate && (task.eliminate === 'x' ? !!opX : !!opY);
  useDone(done, onInteract);
  const tm1 = useTween(m1, 500);
  const tm2 = useTween(m2, 500);
  const shown1 = [Math.round(tm1 * a1), Math.round(tm1 * b1), Math.round(tm1 * k1)];
  const shown2 = [Math.round(tm2 * a2), Math.round(tm2 * b2), Math.round(tm2 * k2)];
  const cancelColor = GREEN;
  const hl = (v) => (target === v ? cancelColor : null);
  const xs = outcome && outcome.v ? (target === 'y' ? [fstr(outcome.v), fstr(outcome.other)] : [fstr(outcome.other), fstr(outcome.v)]) : null;

  return (
    <StoryStage
      eyebrow="Visualizer · Elimination method"
      title={`Elimination: ${P.label}`}
      footer={
        <div className="space-y-3">
          {task && <TaskBanner text={task.text} done={done} />}
          <ModePills value={key} onChange={(v) => update({ problem: v, m1: ELIM[v].m[0], m2: ELIM[v].m[1], step: 0 })} options={Object.entries(ELIM).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <Slider label="Multiply (1) by" value={m1} min={1} max={9} onChange={(v) => update({ m1: v, step: Math.max(step, 1) })} />
            <Slider label="Multiply (2) by" value={m2} min={1} max={9} onChange={(v) => update({ m2: v, step: Math.max(step, 1) })} tone="text-sky-300" />
            <button onClick={() => update({ step: Math.min(4, step + 1) })} className="px-3 py-2 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">Show next step</button>
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x="20" y="26" fill="#94a3b8" fontSize="13" fontWeight="700">{P.note}</text>
        <EqRow y={58} e={P.eqs[0]} color={AMBER} label="(1)" />
        <EqRow y={90} e={P.eqs[1]} color={SKY} label="(2)" />
        <g style={{ opacity: step >= 1 ? 1 : 0.35, transition: 'opacity 500ms' }}>
          <rect x="470" y="40" width="58" height="26" rx="13" fill="#78350f" />
          <text x="499" y="59" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily="monospace">× {m1}</text>
          <rect x="470" y="72" width="58" height="26" rx="13" fill="#0c4a6e" />
          <text x="499" y="91" textAnchor="middle" fill={SKY} fontSize="16" fontWeight="900" fontFamily="monospace">× {m2}</text>
        </g>
        <g style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'none' : 'translateY(-60px)', transition: 'opacity 600ms ease, transform 700ms ease' }}>
          <EqRow y={146} e={shown1} color={AMBER} label="(3)" hlX={step >= 2 ? hl('x') : null} hlY={step >= 2 ? hl('y') : null} />
          <EqRow y={180} e={shown2} color={SKY} label="(4)" hlX={step >= 2 ? hl('x') : null} hlY={step >= 2 ? hl('y') : null} />
        </g>
        <g style={{ opacity: step >= 2 ? 1 : 0, transition: 'opacity 600ms ease' }}>
          <line x1="60" y1="194" x2="460" y2="194" stroke="#475569" strokeWidth="2" />
          {op ? (
            <>
              <text x="40" y="184" fill={GREEN} fontSize="26" fontWeight="900">{op}</text>
              <text x="474" y="168" fill={GREEN} fontSize="13" fontWeight="800">{op === '−' ? 'subtract' : 'add'}:</text>
              <text x="474" y="184" fill={GREEN} fontSize="13" fontWeight="800">{target} cancels</text>
              {outcome && outcome.v
                ? <text x="130" y="226" fill={INK} fontSize="20" fontWeight="900" fontFamily="monospace">{num(left)}{leftVar} = {num(R[2])}</text>
                : <text x="130" y="226" fill={outcome === 'many' ? SKY : RED} fontSize="20" fontWeight="900" fontFamily="monospace">0 = {num(R[2])}</text>}
            </>
          ) : (
            <text x="70" y="226" fill={RED} fontSize="15" fontWeight="800">No letter cancels yet: make the x or y coefficients equal.</text>
          )}
        </g>
        <g style={{ opacity: step >= 3 && outcome ? 1 : 0, transition: 'opacity 600ms ease' }}>
          {outcome && outcome.v && <text x="130" y="262" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">{leftVar} = {fstr(outcome.v)}</text>}
          {outcome === 'none' && <text x="70" y="262" fill={RED} fontSize="16" fontWeight="800">A false statement: no solution (parallel lines).</text>}
          {outcome === 'many' && <text x="70" y="262" fill={SKY} fontSize="16" fontWeight="800">Always true: infinitely many solutions (same line).</text>}
        </g>
        <g style={{ opacity: step >= 4 && xs ? 1 : 0, transition: 'opacity 600ms ease' }}>
          {xs && <text x="130" y="298" fill={INK} fontSize="16" fontWeight="800" fontFamily="monospace">Put {leftVar} = {fstr(outcome.v)} back in an original equation:</text>}
          {xs && <text x="130" y="334" fill={GREEN} fontSize="24" fontWeight="900" fontFamily="monospace">x = {xs[0]},  y = {xs[1]}</text>}
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Word problems → a pair of equations ───
const WORD = {
  cricket: {
    label: 'Cricket boundaries', names: ['x', 'y'], eqs: [[1, 1, 11], [4, 6, 52]], sol: [7, 4],
    story: ['Harsh hit 11 boundaries,', 'only fours and sixes,', 'and they gave 52 runs.'],
    vars: ['x = number of fours', 'y = number of sixes'],
    why: ['count of boundaries', 'runs: 4 each, 6 each'],
    answer: ['7 fours and 4 sixes', 'Check: 28 + 24 = 52 ✔'],
  },
  ages: {
    label: 'Ages', names: ['x', 'y'], eqs: [[1, -1, 30], [1, -6, -50]], sol: [46, 16],
    story: ['Papa is 30 years older', 'than Harsh. Ten years ago', 'he was 6 times as old.'],
    vars: ['x = Papa’s age now', 'y = Harsh’s age now'],
    why: ['difference of ages', 'x − 10 = 6(y − 10)'],
    answer: ['Papa 46, Harsh 16', 'Check: 36 = 6 × 6 ✔'],
  },
  parcel: {
    label: 'Parcel charges', names: ['x', 'y'], eqs: [[1, 10, 250], [1, 15, 350]], sol: [50, 20],
    story: ['A parcel office charges a', 'fixed fee plus a rate per kg.', '10 kg: ₹250, 15 kg: ₹350.'],
    vars: ['x = fixed fee (₹)', 'y = rate per kg (₹)'],
    why: ['bill for 10 kg', 'bill for 15 kg'],
    answer: ['Fee ₹50, ₹20 per kg', 'Check: 50 + 300 = 350 ✔'],
  },
};

function WordPicture({ kind, step }) {
  if (kind === 'cricket') {
    return (
      <g>
        <rect x="40" y="70" width="18" height="150" rx="6" fill="#d6a46a" transform="rotate(-20 49 145)" />
        <rect x="44" y="210" width="10" height="40" rx="4" fill="#78350f" transform="rotate(-20 49 145)" />
        {Array.from({ length: 11 }, (_, i) => {
          const six = i >= 7;
          return (
            <g key={`b${i}`}>
              <circle cx={120 + (i % 4) * 34} cy={90 + Math.floor(i / 4) * 40} r="14" fill={step >= 4 ? (six ? PURPLE : AMBER) : '#475569'} style={{ transition: `fill 500ms ease ${i * 60}ms` }} />
              <text x={120 + (i % 4) * 34} y={95 + Math.floor(i / 4) * 40} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900">{step >= 4 ? (six ? 6 : 4) : '?'}</text>
            </g>
          );
        })}
        <text x="170" y="230" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800">11 boundaries, 52 runs</text>
      </g>
    );
  }
  if (kind === 'ages') {
    const fig = (x, h, color, tag) => (
      <g>
        <circle cx={x} cy={200 - h} r="16" fill={color} />
        <rect x={x - 16} y={218 - h} width="32" height={h - 18} rx="10" fill={color} opacity="0.8" />
        <text x={x} y="232" textAnchor="middle" fill={color} fontSize="15" fontWeight="900" fontFamily="monospace">{tag}</text>
      </g>
    );
    return (
      <g>
        {fig(90, 130, SKY, step >= 4 ? '46' : step >= 1 ? 'x' : '?')}
        {fig(190, 105, AMBER, step >= 4 ? '16' : step >= 1 ? 'y' : '?')}
        <text x="140" y="36" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800">Papa and Harsh</text>
      </g>
    );
  }
  return (
    <g>
      {[[60, 120, 10, '₹250'], [150, 100, 15, '₹350']].map(([x, h, kg, price]) => (
        <g key={kg}>
          <rect x={x} y={220 - h} width="70" height={h} rx="6" fill="#92400e" stroke="#fbbf24" strokeWidth="2" />
          <line x1={x} y1={220 - h + 18} x2={x + 70} y2={220 - h + 18} stroke="#fbbf24" strokeWidth="2" />
          <text x={x + 35} y={220 - h / 2 + 10} textAnchor="middle" fill="#fde68a" fontSize="17" fontWeight="900">{kg} kg</text>
          <text x={x + 35} y="244" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900">{price}</text>
        </g>
      ))}
    </g>
  );
}

export function Class10LinEqWordProblemWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ problem: 'cricket', step: 0, task: null }, visual);
  const key = WORD[s.problem] ? s.problem : 'cricket';
  const P = WORD[key];
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 4);
  const task = s.task && s.task.text ? s.task : null;
  const [solved, setSolved] = useState(false);
  useEffect(() => { setSolved(false); }, [key, JSON.stringify(visual || {})]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = !!task && solved;
  useDone(done, onInteract);
  const rows = [
    { show: step >= 1, y: 140, color: '#cbd5e1', lines: P.vars },
    { show: step >= 2, y: 206, color: AMBER, lines: [`(1) ${eqStr(P.eqs[0])}`], sub: P.why[0] },
    { show: step >= 3, y: 254, color: SKY, lines: [`(2) ${eqStr(P.eqs[1])}`], sub: P.why[1] },
  ];
  return (
    <StoryStage
      eyebrow="Visualizer · Words to equations"
      title={`Word problem: ${P.label}`}
      footer={
        <div className="space-y-3">
          {task && <TaskBanner text={task.text} done={done} />}
          <div className="flex flex-wrap items-center gap-2">
            <ModePills value={key} onChange={(v) => update({ problem: v, step: 0 })} options={Object.entries(WORD).map(([k, v]) => ({ value: k, label: v.label }))} />
            <button onClick={() => update({ step: Math.min(4, step + 1) })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">Show next step</button>
          </div>
          {task && <Checker key={key} eqs={P.eqs} sol={P.sol} names={P.names} onSolved={() => setSolved(true)} label="Your answer" />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <WordPicture kind={key} step={step} />
        {P.story.map((t, i) => <text key={`st${i}`} x="290" y={36 + i * 22} fill={INK} fontSize="16" fontWeight="700">{t}</text>)}
        {rows.map((r, i) => (
          <g key={`r${i}`} style={{ opacity: r.show ? 1 : 0, transform: r.show ? 'none' : 'translateX(20px)', transition: 'opacity 600ms ease, transform 600ms ease' }}>
            {r.lines.map((t, j) => <text key={j} x="290" y={r.y + j * 22} fill={r.color} fontSize={i ? 19 : 15} fontWeight="900" fontFamily="monospace">{t}</text>)}
            {r.sub && <text x="330" y={r.y + 20} fill="#64748b" fontSize="12" fontWeight="700">{r.sub}</text>}
          </g>
        ))}
        <g style={{ opacity: step >= 4 ? 1 : 0, transition: 'opacity 700ms ease' }}>
          <rect x="282" y="290" width="306" height="60" rx="12" fill="#052e1b" stroke={GREEN} strokeWidth="2" />
          <text x="435" y="314" textAnchor="middle" fill={GREEN} fontSize="17" fontWeight="900">{P.answer[0]}</text>
          <text x="435" y="337" textAnchor="middle" fill="#a7f3d0" fontSize="14" fontWeight="800" fontFamily="monospace">{P.answer[1]}</text>
        </g>
      </svg>
    </StoryStage>
  );
}
