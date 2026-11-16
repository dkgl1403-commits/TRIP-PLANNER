import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StoryStage, Readout, useTween, useSceneState, TaskBanner, svgPoint, RightAngleMark,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Coordinate Geometry (NCERT Ch. 7, rationalised) — scene-driven story widgets.
// Every widget draws on a shared coordinate grid that zooms smoothly to fit the scene's points.

const W = 600;
const H = 360;
const PLOT = { x: 12, y: 14, w: 360, h: 332 };
const PX = 386; // left edge of the text panel
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const isPt = (p) => Array.isArray(p) && p.length === 2 && p.every((v) => Number.isFinite(Number(v)));
const P = (p, d) => (isPt(p) ? [Number(p[0]), Number(p[1])] : d);
const ip = (p, d) => { const q = P(p, d); return [Math.round(q[0]), Math.round(q[1])]; };
const FADE = '@keyframes cgFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';

// ─── number formatting ───
const num = (v) => {
  const r = Math.round(v * 100) / 100;
  return `${r < 0 ? '−' : ''}${Math.abs(r)}`;
};
function frac(n, d) {
  if (d === 0) return '?';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1;
  n /= g; d /= g;
  return d === 1 ? num(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
}
const pt = (a, b) => `(${a}, ${b})`;
// √n in simplest surd form: 50 → "5√2", 25 → "5"
function surd(n) {
  if (n === 0) return '0';
  let a = 1;
  let b = n;
  for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) {
    if (n % (k * k) === 0) { a = k; b = n / (k * k); break; }
  }
  if (b === 1) return `${a}`;
  return `${a === 1 ? '' : a}√${b}`;
}
const paren = (v) => (v < 0 ? `(${num(v)})` : num(v));
const coef = (v) => (v === 1 ? '' : v === -1 ? '−' : num(v));

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300', show }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{show ?? value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// ─── the shared grid view: fits the given points, tweens smoothly when they change ───
function fitRange(pts) {
  const xs = pts.map((p) => p[0]).concat(0);
  const ys = pts.map((p) => p[1]).concat(0);
  let x0 = Math.floor(Math.min(...xs)) - 1;
  let x1 = Math.ceil(Math.max(...xs)) + 1;
  let y0 = Math.floor(Math.min(...ys)) - 1;
  let y1 = Math.ceil(Math.max(...ys)) + 1;
  while (x1 - x0 < 8) { x0 -= 1; if (x1 - x0 < 8) x1 += 1; }
  while (y1 - y0 < 7) { y0 -= 1; if (y1 - y0 < 7) y1 += 1; }
  const u = Math.min(PLOT.w / (x1 - x0), PLOT.h / (y1 - y0));
  const ex = Math.floor((PLOT.w / u - (x1 - x0)) + 1e-9);
  const ey = Math.floor((PLOT.h / u - (y1 - y0)) + 1e-9);
  x0 -= Math.floor(ex / 2); x1 += ex - Math.floor(ex / 2);
  y0 -= Math.floor(ey / 2); y1 += ey - Math.floor(ey / 2);
  return { x0, x1, y0, y1 };
}

function useView(scenePts) {
  const key = JSON.stringify(scenePts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const r = useMemo(() => fitRange(scenePts), [key]);
  const x0 = useTween(r.x0, 800);
  const x1 = useTween(r.x1, 800);
  const y0 = useTween(r.y0, 800);
  const y1 = useTween(r.y1, 800);
  const u = Math.min(PLOT.w / (x1 - x0), PLOT.h / (y1 - y0));
  const ox = PLOT.x + (PLOT.w - u * (x1 - x0)) / 2;
  const oy = PLOT.y + (PLOT.h - u * (y1 - y0)) / 2;
  return {
    u, x0, x1, y0, y1, r,
    sx: (x) => ox + (x - x0) * u,
    sy: (y) => oy + (y1 - y) * u,
    gx: (px) => x0 + (px - ox) / u,
    gy: (py) => y1 - (py - oy) / u,
  };
}

// Tweens a list of points together (one animation loop for all of them)
function useTweenPts(pts, duration = 650) {
  const key = JSON.stringify(pts);
  const [cur, setCur] = useState(pts);
  const ref = useRef(pts);
  useEffect(() => {
    const from = ref.current;
    const to = pts;
    if (from.length !== to.length) { ref.current = to; setCur(to); return undefined; }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const e = ease(t);
      const v = to.map((p, i) => [lerp(from[i][0], p[0], e), lerp(from[i][1], p[1], e)]);
      ref.current = v;
      setCur(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration]);
  return cur.length === pts.length ? cur : pts;
}

// Drag any of several grid points; positions snap to whole numbers inside the visible grid
function useGridDrag(svgRef, v, onMove) {
  const active = useRef(null);
  const down = (id) => (e) => {
    active.current = id;
    svgRef.current?.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };
  const end = () => { active.current = null; };
  const svgProps = {
    onPointerMove: (e) => {
      if (active.current == null || !svgRef.current) return;
      const p = svgPoint(svgRef.current, e);
      const x = clamp(Math.round(v.gx(p.x)), Math.ceil(v.r.x0), Math.floor(v.r.x1));
      const y = clamp(Math.round(v.gy(p.y)), Math.ceil(v.r.y0), Math.floor(v.r.y1));
      onMove(active.current, x, y);
    },
    onPointerUp: end,
    onPointerCancel: end,
  };
  return [down, svgProps];
}

function Grid({ v, glow }) {
  const xs = [];
  const ys = [];
  for (let i = Math.ceil(v.x0); i <= Math.floor(v.x1); i++) xs.push(i);
  for (let j = Math.ceil(v.y0); j <= Math.floor(v.y1); j++) ys.push(j);
  const step = v.u < 22 ? 2 : 1;
  const top = v.sy(v.y1);
  const bottom = v.sy(v.y0);
  const left = v.sx(v.x0);
  const right = v.sx(v.x1);
  const axY = clamp(v.sy(0), top, bottom);
  const axX = clamp(v.sx(0), left, right);
  return (
    <g fontFamily="monospace">
      <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx="10" fill="#060d1d" stroke="#1e293b" />
      {xs.map((i) => <line key={`gx${i}`} x1={v.sx(i)} y1={top} x2={v.sx(i)} y2={bottom} stroke="#16233a" strokeWidth="1" />)}
      {ys.map((j) => <line key={`gy${j}`} x1={left} y1={v.sy(j)} x2={right} y2={v.sy(j)} stroke="#16233a" strokeWidth="1" />)}
      {glow === 'x' && <line x1={left} y1={axY} x2={right} y2={axY} stroke={GREEN} strokeWidth="8" opacity="0.35" />}
      {glow === 'y' && <line x1={axX} y1={top} x2={axX} y2={bottom} stroke={GREEN} strokeWidth="8" opacity="0.35" />}
      <line x1={left} y1={axY} x2={right} y2={axY} stroke="#94a3b8" strokeWidth="2" />
      <line x1={axX} y1={top} x2={axX} y2={bottom} stroke="#94a3b8" strokeWidth="2" />
      <text x={right - 12} y={axY - 6} fill="#94a3b8" fontSize="14" fontWeight="800">x</text>
      <text x={axX + 7} y={top + 15} fill="#94a3b8" fontSize="14" fontWeight="800">y</text>
      <text x={axX - 13} y={axY + 15} fill="#64748b" fontSize="11" fontWeight="700">O</text>
      {xs.filter((i) => i !== 0 && i % step === 0 && v.sx(i) < right - 16).map((i) => (
        <text key={`lx${i}`} x={v.sx(i)} y={axY + 14} textAnchor="middle" fill="#64748b" fontSize="10">{i}</text>
      ))}
      {ys.filter((j) => j !== 0 && j % step === 0 && v.sy(j) > top + 18).map((j) => (
        <text key={`ly${j}`} x={axX - 5} y={v.sy(j) + 4} textAnchor="end" fill="#64748b" fontSize="10">{j}</text>
      ))}
    </g>
  );
}

// A labelled point; the label flips to stay inside the plot
function Pt({ v, p, label, color = AMBER, onDown, r = 6, below }) {
  const x = v.sx(p[0]);
  const y = v.sy(p[1]);
  const flip = x > PLOT.x + PLOT.w - 110;
  const under = below || y < PLOT.y + 24;
  return (
    <g style={{ cursor: onDown ? 'grab' : undefined }} onPointerDown={onDown}>
      {onDown && <circle cx={x} cy={y} r="17" fill={color} opacity="0.15" />}
      <circle cx={x} cy={y} r={r} fill={color} stroke="#020617" strokeWidth="2" />
      {label && (
        <text x={x + (flip ? -10 : 10)} y={y + (under ? 20 : -10)} textAnchor={flip ? 'end' : 'start'} fill={color}
          fontSize="14" fontWeight="800" fontFamily="sans-serif" stroke="#060d1d" strokeWidth="4" paintOrder="stroke">{label}</text>
      )}
    </g>
  );
}

// Text panel on the right side of the stage
function Panel({ title, lines }) {
  let y = 36;
  return (
    <g fontFamily="sans-serif">
      {title && <text x={PX} y={y} fill="#94a3b8" fontSize="12" fontWeight="800" letterSpacing="1">{title.toUpperCase()}</text>}
      {lines.filter(Boolean).map((l, i) => {
        y += l.gap ?? 24;
        return (
          <text key={`${i}-${l.t}`} x={PX} y={y} fill={l.c || INK} fontSize={l.s || 14} fontWeight={l.b ? 900 : 700}
            fontFamily={l.mono ? 'monospace' : 'sans-serif'} style={{ animation: 'cgFadeIn 450ms ease both', animationDelay: `${i * 90}ms` }}>
            {l.t}
          </text>
        );
      })}
    </g>
  );
}

// ─── WIDGET 1: The coordinate plane, and distance along a horizontal or vertical line ───
export function Class10CoordGeoPlaneWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'plot', pts: [[4, 3]], names: ['S'], task: null }, visual);
  const mode = s.mode === 'line' ? 'line' : 'plot';
  const pts = (Array.isArray(s.pts) && s.pts.length ? s.pts : [[4, 3]]).map((p) => ip(p, [0, 0]));
  const names = Array.isArray(s.names) ? s.names : [];
  const scenePts = (Array.isArray(visual?.pts) ? visual.pts : [[4, 3]]).map((p) => ip(p, [0, 0]));
  const v = useView(scenePts.concat([[-5, -3], [5, 4]]));
  const tp = useTweenPts(pts, 500);
  const svgRef = useRef(null);
  const [down, svgProps] = useGridDrag(svgRef, v, (i, x, y) => {
    const next = pts.slice();
    next[i] = [x, y];
    update({ pts: next });
  });
  const task = s.task && Number.isFinite(s.task.x) ? s.task : null;
  const last = pts[pts.length - 1];
  const done = !!task && last[0] === task.x && last[1] === task.y;
  useDone(done, onInteract);
  const quad = (p) => (p[0] === 0 && p[1] === 0 ? 'the origin' : p[1] === 0 ? 'on the x-axis' : p[0] === 0 ? 'on the y-axis'
    : p[0] > 0 ? (p[1] > 0 ? 'Quadrant I (+, +)' : 'Quadrant IV (+, −)') : (p[1] > 0 ? 'Quadrant II (−, +)' : 'Quadrant III (−, −)'));

  let extra = null;
  let lines = [];
  if (mode === 'plot') {
    extra = tp.map((p, i) => (
      <g key={`d${i}`} opacity="0.8">
        <line x1={v.sx(p[0])} y1={v.sy(p[1])} x2={v.sx(p[0])} y2={v.sy(0)} stroke={SKY} strokeWidth="2" strokeDasharray="5 4" />
        <line x1={v.sx(p[0])} y1={v.sy(p[1])} x2={v.sx(0)} y2={v.sy(p[1])} stroke={PINK} strokeWidth="2" strokeDasharray="5 4" />
      </g>
    ));
    lines = [
      ...pts.slice(-3).map((p, k) => {
        const i = pts.length - Math.min(3, pts.length) + k;
        return { t: `${names[i] || 'P'} ${pt(num(p[0]), num(p[1]))}`, c: i === pts.length - 1 ? AMBER : INK, s: 16, b: true, mono: true };
      }),
      { t: `x-coordinate (abscissa) = ${num(last[0])}`, c: SKY, s: 13, gap: 32 },
      { t: `y-coordinate (ordinate) = ${num(last[1])}`, c: PINK, s: 13 },
      { t: `${names[pts.length - 1] || 'P'} is in ${quad(last)}`, c: GREEN, s: 13, gap: 30 },
      { t: 'Distance from the y-axis = |x|', c: '#94a3b8', s: 12, gap: 34 },
      { t: 'Distance from the x-axis = |y|', c: '#94a3b8', s: 12, gap: 20 },
    ];
  } else {
    const [a, b] = [pts[0], pts[1] || [pts[0][0] + 4, pts[0][1]]];
    const [ta, tb] = [tp[0], tp[1] || tp[0]];
    const horiz = a[1] === b[1];
    const vert = a[0] === b[0];
    const d = horiz ? Math.abs(b[0] - a[0]) : Math.abs(b[1] - a[1]);
    extra = (
      <g>
        <line x1={v.sx(ta[0])} y1={v.sy(ta[1])} x2={v.sx(tb[0])} y2={v.sy(tb[1])} stroke={horiz || vert ? GREEN : RED} strokeWidth="5" strokeLinecap="round" />
        {(horiz || vert) && (
          <text x={(v.sx(ta[0]) + v.sx(tb[0])) / 2 + (vert ? 12 : 0)} y={(v.sy(ta[1]) + v.sy(tb[1])) / 2 + (horiz ? 24 : 5)} textAnchor={vert ? 'start' : 'middle'}
            fill={GREEN} fontSize="16" fontWeight="900" fontFamily="monospace" stroke="#060d1d" strokeWidth="4" paintOrder="stroke">{d} units</text>
        )}
      </g>
    );
    lines = [
      { t: `${names[0] || 'A'} ${pt(num(a[0]), num(a[1]))}`, c: AMBER, s: 16, b: true, mono: true },
      { t: `${names[1] || 'B'} ${pt(num(b[0]), num(b[1]))}`, c: SKY, s: 16, b: true, mono: true },
      horiz ? { t: 'Same y: a horizontal line', c: GREEN, s: 13, gap: 32 }
        : vert ? { t: 'Same x: a vertical line', c: GREEN, s: 13, gap: 32 }
          : { t: 'Slanting line!', c: RED, s: 14, b: true, gap: 32 },
      horiz ? { t: `d = |x₂ − x₁| = |${num(b[0])} − ${paren(a[0])}|`, c: INK, s: 13, mono: true }
        : vert ? { t: `d = |y₂ − y₁| = |${num(b[1])} − ${paren(a[1])}|`, c: INK, s: 13, mono: true }
          : { t: 'Counting squares fails here.', c: '#cbd5e1', s: 13 },
      (horiz || vert) ? { t: `d = ${d} units`, c: GREEN, s: 20, b: true, mono: true, gap: 32 }
        : { t: 'We need the distance formula.', c: AMBER, s: 13 },
    ];
  }

  return (
    <StoryStage
      eyebrow="Visualizer · The coordinate plane"
      title={mode === 'plot' ? 'Every point has an address (x, y)' : 'Distance along a grid line'}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label={names[pts.length - 1] || 'Point'} value={pt(num(last[0]), num(last[1]))} tone="text-amber-300" />
            <span className="text-sm text-slate-300">{mode === 'plot' ? 'Drag the amber point. The dashed lines show how far it is from each axis.' : 'Drag either end. Keep them on one grid line to count the distance.'}</span>
          </div>
          {task && <TaskBanner text={`Your turn: drag ${names[pts.length - 1] || 'the point'} to (${task.x}, ${task.y}).`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none" {...svgProps}>
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} />
        {mode === 'plot' && ['II', 'I', 'III', 'IV'].map((q, i) => {
          const qx = i % 2 ? (Math.max(0, v.x0) + v.x1) / 2 : (v.x0 + Math.min(0, v.x1)) / 2;
          const qy = i < 2 ? (Math.max(0, v.y0) + v.y1) / 2 : (v.y0 + Math.min(0, v.y1)) / 2;
          return <text key={q} x={v.sx(qx)} y={v.sy(qy)} textAnchor="middle" fill="#1e3a5f" fontSize="30" fontWeight="900" fontFamily="serif">{q}</text>;
        })}
        {extra}
        {tp.map((p, i) => (
          <Pt key={`p${i}`} v={v} p={p} color={mode === 'line' ? (i ? SKY : AMBER) : i === pts.length - 1 ? AMBER : PURPLE}
            label={`${names[i] || ''} ${pt(num(pts[i][0]), num(pts[i][1]))}`} onDown={mode === 'line' || i === pts.length - 1 ? down(i) : undefined} />
        ))}
        <Panel title={mode === 'plot' ? 'Coordinates' : 'Distance on a line'} lines={lines} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: The distance formula from Pythagoras ───
export function Class10CoordGeoDistanceWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ A: [1, 1], B: [5, 4], names: ['A', 'B'], step: 3, wrong: false, task: null }, visual);
  const A = ip(s.A, [1, 1]);
  const B = ip(s.B, [5, 4]);
  const names = Array.isArray(s.names) ? s.names : ['A', 'B'];
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 3);
  const v = useView([ip(visual?.A, [1, 1]), ip(visual?.B, [5, 4])]);
  const [ta, tb] = useTweenPts([A, B], 500);
  const svgRef = useRef(null);
  const [down, svgProps] = useGridDrag(svgRef, v, (i, x, y) => update(i === 0 ? { A: [x, y] } : { B: [x, y] }));
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const d2 = dx * dx + dy * dy;
  const task = s.task && Number.isFinite(s.task.d2) ? s.task : null;
  const done = !!task && d2 === task.d2 && (!task.slant || (dx !== 0 && dy !== 0));
  useDone(done, onInteract);
  const exact = Number.isInteger(Math.sqrt(d2));
  const dText = exact ? `${Math.sqrt(d2)}` : `${surd(d2)}`;

  // the right triangle and the squares on its sides
  const C = [tb[0], ta[1]];
  const tdx = tb[0] - ta[0];
  const tdy = tb[1] - ta[1];
  const sgx = Math.sign(tdx) || 1;
  const sgy = Math.sign(tdy) || 1;
  const poly = (ps) => ps.map((p) => `${v.sx(p[0])},${v.sy(p[1])}`).join(' ');
  const sqH = [ta, C, [C[0], C[1] - sgy * Math.abs(tdx)], [ta[0], ta[1] - sgy * Math.abs(tdx)]];
  const sqV = [C, tb, [tb[0] + sgx * Math.abs(tdy), tb[1]], [C[0] + sgx * Math.abs(tdy), C[1]]];
  let nx = -tdy;
  let ny = tdx;
  if (nx * (C[0] - ta[0]) + ny * (C[1] - ta[1]) > 0) { nx = -nx; ny = -ny; }
  const sqC = [ta, tb, [tb[0] + nx, tb[1] + ny], [ta[0] + nx, ta[1] + ny]];
  const center = (ps) => [(ps[0][0] + ps[2][0]) / 2, (ps[0][1] + ps[2][1]) / 2];

  const lines = [
    { t: `${names[0]} ${pt(num(A[0]), num(A[1]))}   ${names[1]} ${pt(num(B[0]), num(B[1]))}`, c: INK, s: 14, b: true, mono: true },
    step >= 1 && { t: `x₂ − x₁ = ${num(B[0])} − ${paren(A[0])} = ${num(dx)}`, c: SKY, s: 13, mono: true, gap: 30 },
    step >= 1 && { t: `y₂ − y₁ = ${num(B[1])} − ${paren(A[1])} = ${num(dy)}`, c: PINK, s: 13, mono: true },
    step >= 2 && !s.wrong && { t: `${names[0]}${names[1]}² = ${paren(dx)}² + ${paren(dy)}²`, c: INK, s: 13, mono: true, gap: 30 },
    step >= 2 && !s.wrong && { t: `     = ${dx * dx} + ${dy * dy} = ${d2}`, c: INK, s: 13, mono: true },
    step >= 2 && s.wrong && { t: `${Math.abs(dx)} + ${Math.abs(dy)} = ${Math.abs(dx) + Math.abs(dy)} ✘`, c: RED, s: 16, b: true, mono: true, gap: 30 },
    step >= 2 && s.wrong && { t: 'That is the walk along the', c: RED, s: 12 },
    step >= 2 && s.wrong && { t: 'two legs, not the straight path.', c: RED, s: 12, gap: 17 },
    step >= 3 && !s.wrong && { t: `${names[0]}${names[1]} = √${d2}${surd(d2) !== `√${d2}` ? ` = ${dText}` : ''}`, c: GREEN, s: 17, b: true, mono: true, gap: 34 },
    { t: 'd = √[(x₂−x₁)² + (y₂−y₁)²]', c: AMBER, s: 12, b: true, mono: true, gap: step >= 3 ? 40 : 60 },
  ];

  return (
    <StoryStage
      eyebrow="Visualizer · Pythagoras on the grid"
      title={step >= 3 ? `${names[0]}${names[1]} = ${exact ? dText : `√${d2}`} units` : 'How far apart are the two points?'}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Across" value={num(dx)} tone="text-sky-300" />
            <Readout label="Up" value={num(dy)} tone="text-pink-300" />
            <Readout label={`${names[0]}${names[1]}²`} value={d2} tone="text-slate-200" />
            <Readout label={`${names[0]}${names[1]}`} value={exact ? dText : `${dText} ≈ ${Math.sqrt(d2).toFixed(2)}`} />
            <span className="text-sm text-slate-300">Drag {names[0]} or {names[1]}.</span>
          </div>
          {task && <TaskBanner text={`Your turn: drag the points so that ${names[0]}${names[1]} is exactly ${Math.sqrt(task.d2)} units${task.slant ? ', on a slanting line (not along a grid line)' : ''}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none" {...svgProps}>
        <defs><clipPath id="cgDistClip"><rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx="10" /></clipPath></defs>
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} />
        <g clipPath="url(#cgDistClip)">
          {step >= 2 && !s.wrong && tdx !== 0 && tdy !== 0 && (
            <g style={{ animation: 'cgFadeIn 600ms ease both' }}>
              <polygon points={poly(sqH)} fill={SKY} opacity="0.18" stroke={SKY} strokeWidth="1.5" />
              <polygon points={poly(sqV)} fill={PINK} opacity="0.18" stroke={PINK} strokeWidth="1.5" />
              <polygon points={poly(sqC)} fill={GREEN} opacity="0.14" stroke={GREEN} strokeWidth="1.5" />
              {[[sqH, dx * dx, SKY], [sqV, dy * dy, PINK], [sqC, d2, GREEN]].map(([q, a, c]) => (
                <text key={c} x={v.sx(center(q)[0])} y={v.sy(center(q)[1]) + 6} textAnchor="middle" fill={c} fontSize="16" fontWeight="900" fontFamily="monospace">{a}</text>
              ))}
            </g>
          )}
          {step >= 1 && (
            <g>
              <line x1={v.sx(ta[0])} y1={v.sy(ta[1])} x2={v.sx(C[0])} y2={v.sy(C[1])} stroke={SKY} strokeWidth="4" strokeDasharray={s.wrong ? '' : '8 5'} />
              <line x1={v.sx(C[0])} y1={v.sy(C[1])} x2={v.sx(tb[0])} y2={v.sy(tb[1])} stroke={PINK} strokeWidth="4" strokeDasharray={s.wrong ? '' : '8 5'} />
              {tdx !== 0 && tdy !== 0 && <RightAngleMark cx={v.sx(C[0])} cy={v.sy(C[1])} deg={tdx > 0 ? (tdy > 0 ? 90 : 180) : (tdy > 0 ? 0 : -90)} size={14} color={INK} />}
              <text x={(v.sx(ta[0]) + v.sx(C[0])) / 2} y={v.sy(C[1]) + (tdy > 0 ? 20 : -10)} textAnchor="middle" fill={SKY} fontSize="14" fontWeight="900" fontFamily="monospace" stroke="#060d1d" strokeWidth="4" paintOrder="stroke">{Math.abs(dx)}</text>
              <text x={v.sx(C[0]) + (tdx > 0 ? 10 : -10)} y={(v.sy(C[1]) + v.sy(tb[1])) / 2 + 5} textAnchor={tdx > 0 ? 'start' : 'end'} fill={PINK} fontSize="14" fontWeight="900" fontFamily="monospace" stroke="#060d1d" strokeWidth="4" paintOrder="stroke">{Math.abs(dy)}</text>
            </g>
          )}
          {!s.wrong && <line x1={v.sx(ta[0])} y1={v.sy(ta[1])} x2={v.sx(tb[0])} y2={v.sy(tb[1])} stroke={GREEN} strokeWidth="4" strokeLinecap="round" />}
        </g>
        <Pt v={v} p={ta} label={`${names[0]} ${pt(num(A[0]), num(A[1]))}`} color={AMBER} onDown={names[0] === 'O' ? undefined : down(0)} below={tdy > 0} />
        <Pt v={v} p={tb} label={`${names[1]} ${pt(num(B[0]), num(B[1]))}`} color={SKY} onDown={down(1)} below={tdy < 0} />
        <Panel title="Distance formula" lines={lines} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Using distances: collinear points, kinds of triangles and quadrilaterals ───
const dist2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;

function classify(pts) {
  if (pts.length === 3) {
    const [a, b, c] = pts;
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cross === 0) return { keys: ['collinear'], text: 'Collinear: no triangle', tone: RED };
    const sq = [dist2(a, b), dist2(b, c), dist2(c, a)].sort((x, y) => x - y);
    const keys = [];
    if (sq[0] + sq[1] === sq[2]) keys.push('right');
    if (sq[0] === sq[2]) keys.push('equilateral');
    else if (sq[0] === sq[1] || sq[1] === sq[2]) keys.push('isosceles');
    else keys.push('scalene');
    const name = keys.includes('right') ? (keys.includes('isosceles') ? 'Right isosceles' : 'Right-angled') : keys[0][0].toUpperCase() + keys[0].slice(1);
    return { keys, text: `${name} triangle`, tone: GREEN };
  }
  const [a, b, c, d] = pts;
  const sides = [dist2(a, b), dist2(b, c), dist2(c, d), dist2(d, a)];
  const diag = [dist2(a, c), dist2(b, d)];
  const pg = a[0] + c[0] === b[0] + d[0] && a[1] + c[1] === b[1] + d[1];
  const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  if (!pg || cross === 0) return { keys: ['quad'], text: 'Just a quadrilateral', tone: '#cbd5e1' };
  const allEq = sides.every((x) => x === sides[0]);
  const dEq = diag[0] === diag[1];
  if (allEq && dEq) return { keys: ['square'], text: 'Square', tone: GREEN };
  if (allEq) return { keys: ['rhombus'], text: 'Rhombus (diagonals differ)', tone: GREEN };
  if (dEq) return { keys: ['rectangle'], text: 'Rectangle', tone: GREEN };
  return { keys: ['parallelogram'], text: 'Parallelogram', tone: GREEN };
}

export function Class10CoordGeoShapesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ pts: [[1, 5], [2, 3], [3, 1]], names: ['A', 'B', 'C', 'D'], task: null, fixed: false }, visual);
  const raw = Array.isArray(s.pts) && s.pts.length >= 3 ? s.pts.slice(0, 4) : [[1, 5], [2, 3], [3, 1]];
  const pts = raw.map((p) => ip(p, [0, 0]));
  const names = Array.isArray(s.names) ? s.names : ['A', 'B', 'C', 'D'];
  const scenePts = (Array.isArray(visual?.pts) ? visual.pts : raw).map((p) => ip(p, [0, 0]));
  const v = useView(scenePts);
  const tp = useTweenPts(pts, 550);
  const svgRef = useRef(null);
  const [down, svgProps] = useGridDrag(svgRef, v, (i, x, y) => {
    const next = pts.slice();
    next[i] = [x, y];
    update({ pts: next });
  });
  const verdict = classify(pts);
  const task = s.task && s.task.type ? s.task : null;
  const done = !!task && verdict.keys.includes(task.type);
  useDone(done, onInteract);
  const n = pts.length;
  const cx = tp.reduce((a, p) => a + p[0], 0) / n;
  const cy = tp.reduce((a, p) => a + p[1], 0) / n;
  const pairs = n === 3 ? [[0, 1], [1, 2], [0, 2]] : [[0, 1], [1, 2], [2, 3], [3, 0]];
  const diagonals = n === 4 ? [[0, 2], [1, 3]] : [];
  const collinear = verdict.keys.includes('collinear');

  const sideLabel = ([i, j], color, key) => {
    const mx = (tp[i][0] + tp[j][0]) / 2;
    const my = (tp[i][1] + tp[j][1]) / 2;
    let ox = v.sx(mx) - v.sx(cx);
    let oy = v.sy(my) - v.sy(cy);
    const len = Math.hypot(ox, oy) || 1;
    if (collinear) { ox = -(v.sy(tp[j][1]) - v.sy(tp[i][1])); oy = v.sx(tp[j][0]) - v.sx(tp[i][0]); }
    const l2 = Math.hypot(ox, oy) || len;
    return (
      <text key={key} x={v.sx(mx) + (ox / l2) * 20} y={v.sy(my) + (oy / l2) * 20 + 5} textAnchor="middle" fill={color} fontSize="13" fontWeight="900"
        fontFamily="monospace" stroke="#060d1d" strokeWidth="4" paintOrder="stroke">{surd(dist2(pts[i], pts[j]))}</text>
    );
  };

  const lines = [
    ...pairs.map(([i, j]) => ({ t: `${names[i]}${names[j]}² = ${dist2(pts[i], pts[j])}  (${names[i]}${names[j]} = ${surd(dist2(pts[i], pts[j]))})`, c: INK, s: 13, mono: true, gap: 21 })),
    ...diagonals.map(([i, j]) => ({ t: `${names[i]}${names[j]}² = ${dist2(pts[i], pts[j])}  diagonal`, c: PURPLE, s: 13, mono: true, gap: 21 })),
    { t: verdict.text, c: verdict.tone, s: 16, b: true, gap: 34 },
  ];
  if (n === 3 && collinear) {
    const sq = pairs.map(([i, j]) => [dist2(pts[i], pts[j]), `${names[i]}${names[j]}`]).sort((a, b) => a[0] - b[0]);
    lines.push({ t: `${sq[0][1]} + ${sq[1][1]} = ${sq[2][1]}`, c: AMBER, s: 14, b: true, mono: true });
    lines.push({ t: `${surd(sq[0][0])} + ${surd(sq[1][0])} = ${surd(sq[2][0])}`, c: AMBER, s: 14, mono: true });
  } else if (n === 3 && verdict.keys.includes('right')) {
    const sq = pairs.map(([i, j]) => dist2(pts[i], pts[j])).sort((a, b) => a - b);
    lines.push({ t: `${sq[0]} + ${sq[1]} = ${sq[2]} ✔`, c: AMBER, s: 13, mono: true });
  } else if (n === 4) {
    lines.push({ t: 'Mid of AC = mid of BD?', c: '#94a3b8', s: 12 });
    lines.push({ t: verdict.keys.includes('quad') ? 'No' : 'Yes: diagonals bisect', c: '#94a3b8', s: 12, gap: 17 });
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Distances decide the shape"
      title={verdict.text}
      footer={
        <div className="space-y-3">
          <div className="text-sm text-slate-300">Drag any corner. The side lengths and the verdict update from the distance formula alone.</div>
          {task && <TaskBanner text={`Your turn: ${task.text || `make it ${task.type}`}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none" {...svgProps}>
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} />
        <polygon points={tp.map((p) => `${v.sx(p[0])},${v.sy(p[1])}`).join(' ')} fill={collinear ? 'none' : verdict.tone} fillOpacity="0.12"
          stroke={collinear ? RED : verdict.tone} strokeWidth="3" strokeLinejoin="round" />
        {diagonals.map(([i, j]) => <line key={`dg${i}`} x1={v.sx(tp[i][0])} y1={v.sy(tp[i][1])} x2={v.sx(tp[j][0])} y2={v.sy(tp[j][1])} stroke={PURPLE} strokeWidth="2" strokeDasharray="6 5" />)}
        {pairs.map((pr, k) => sideLabel(pr, collinear && k === 2 ? AMBER : INK, `sl${k}`))}
        {tp.map((p, i) => <Pt key={`p${i}`} v={v} p={p} label={`${names[i]} ${pt(num(pts[i][0]), num(pts[i][1]))}`} color={[AMBER, SKY, PINK, GREEN][i]} onDown={s.fixed && i < n - 1 ? undefined : down(i)} />)}
        <Panel title="Side lengths" lines={lines} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: The section formula (internal division in the ratio m : n) ───
export function Class10CoordGeoSectionWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ A: [4, -3], B: [8, 5], m: 3, n: 1, step: 3, wrong: false, task: null }, visual);
  const A = ip(s.A, [4, -3]);
  const B = ip(s.B, [8, 5]);
  const m = clamp(Math.round(Number(s.m)) || 1, 1, 9);
  const n = clamp(Math.round(Number(s.n)) || 1, 1, 9);
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 3);
  const v = useView([ip(visual?.A, [4, -3]), ip(visual?.B, [8, 5])]);
  const px = (m * B[0] + n * A[0]) / (m + n);
  const py = (m * B[1] + n * A[1]) / (m + n);
  const [ta, tb, tP] = useTweenPts([A, B, [px, py]], 600);
  const svgRef = useRef(null);
  const [down, svgProps] = useGridDrag(svgRef, v, (i, x, y) => update(i === 0 ? { A: [x, y] } : { B: [x, y] }));
  const task = s.task && isPt(s.task.P) ? s.task : null;
  const done = !!task && px === task.P[0] && py === task.P[1];
  useDone(done, onInteract);
  const xs = frac(m * B[0] + n * A[0], m + n);
  const ys = frac(m * B[1] + n * A[1], m + n);
  const wx = (n * B[0] + m * A[0]) / (m + n);
  const wy = (n * B[1] + m * A[1]) / (m + n);

  const Q = [tP[0], ta[1]];
  const R = [tb[0], tP[1]];
  const k = m + n;
  const ux = (tb[0] - ta[0]) / k;
  const uy = (tb[1] - ta[1]) / k;
  const len = Math.hypot(v.sx(tb[0]) - v.sx(ta[0]), v.sy(tb[1]) - v.sy(ta[1])) || 1;
  const nx = -(v.sy(tb[1]) - v.sy(ta[1])) / len;
  const ny = (v.sx(tb[0]) - v.sx(ta[0])) / len;
  const tri = (ps) => ps.map((p) => `${v.sx(p[0])},${v.sy(p[1])}`).join(' ');

  const lines = [
    { t: `A ${pt(num(A[0]), num(A[1]))}  B ${pt(num(B[0]), num(B[1]))}`, c: INK, s: 14, b: true, mono: true },
    { t: `AP : PB = ${m} : ${n}`, c: AMBER, s: 18, b: true, mono: true, gap: 30 },
    step >= 2 && { t: 'x = (m·x₂ + n·x₁)/(m + n)', c: '#94a3b8', s: 12, mono: true, gap: 30 },
    step >= 2 && { t: 'y = (m·y₂ + n·y₁)/(m + n)', c: '#94a3b8', s: 12, mono: true, gap: 18 },
    step >= 3 && { t: `x = (${m}·${paren(B[0])} + ${n}·${paren(A[0])})/${k}`, c: SKY, s: 13, mono: true, gap: 28 },
    step >= 3 && { t: `  = ${xs}`, c: SKY, s: 13, b: true, mono: true, gap: 18 },
    step >= 3 && { t: `y = (${m}·${paren(B[1])} + ${n}·${paren(A[1])})/${k}`, c: PINK, s: 13, mono: true, gap: 24 },
    step >= 3 && { t: `  = ${ys}`, c: PINK, s: 13, b: true, mono: true, gap: 18 },
    step >= 3 && { t: `P ${pt(xs, ys)}`, c: GREEN, s: 18, b: true, mono: true, gap: 32 },
    s.wrong && { t: `Swapped m, n gives ${pt(frac(n * B[0] + m * A[0], k), frac(n * B[1] + m * A[1], k))} ✘`, c: RED, s: 12, b: true, gap: 22 },
  ];

  return (
    <StoryStage
      eyebrow="Visualizer · Section formula"
      title={`P divides AB in the ratio ${m} : ${n}`}
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="m (part from A to P)" value={m} min={1} max={9} onChange={(val) => update({ m: val })} />
            <Slider label="n (part from P to B)" value={n} min={1} max={9} onChange={(val) => update({ n: val })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="P" value={pt(xs, ys)} />
            <span className="text-sm text-slate-300">AB is cut into {k} equal steps; P sits after {m} of them. Drag A or B too.</span>
          </div>
          {task && <TaskBanner text={`Your turn: choose m and n so that P lands exactly on (${task.P[0]}, ${task.P[1]}).`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none" {...svgProps}>
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} />
        {step >= 2 && (
          <g style={{ animation: 'cgFadeIn 600ms ease both' }}>
            <polygon points={tri([ta, Q, tP])} fill={AMBER} fillOpacity="0.12" stroke={AMBER} strokeWidth="1.5" strokeDasharray="5 4" />
            <polygon points={tri([tP, R, tb])} fill={SKY} fillOpacity="0.12" stroke={SKY} strokeWidth="1.5" strokeDasharray="5 4" />
            <text x={(v.sx(ta[0]) + v.sx(Q[0])) / 2} y={v.sy(Q[1]) + (tP[1] >= ta[1] ? 18 : -8)} textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800" fontFamily="monospace">x − x₁</text>
            <text x={(v.sx(tP[0]) + v.sx(R[0])) / 2} y={v.sy(R[1]) + (tb[1] >= tP[1] ? 18 : -8)} textAnchor="middle" fill={SKY} fontSize="12" fontWeight="800" fontFamily="monospace">x₂ − x</text>
          </g>
        )}
        <line x1={v.sx(ta[0])} y1={v.sy(ta[1])} x2={v.sx(tP[0])} y2={v.sy(tP[1])} stroke={AMBER} strokeWidth="5" strokeLinecap="round" />
        <line x1={v.sx(tP[0])} y1={v.sy(tP[1])} x2={v.sx(tb[0])} y2={v.sy(tb[1])} stroke={SKY} strokeWidth="5" strokeLinecap="round" />
        {step >= 1 && Array.from({ length: k - 1 }, (_, i) => {
          const qx = v.sx(ta[0] + ux * (i + 1));
          const qy = v.sy(ta[1] + uy * (i + 1));
          return <line key={`t${k}-${i}`} x1={qx - nx * 7} y1={qy - ny * 7} x2={qx + nx * 7} y2={qy + ny * 7} stroke={INK} strokeWidth="2"
            style={{ animation: 'cgFadeIn 300ms ease both', animationDelay: `${i * 80}ms` }} />;
        })}
        {s.wrong && <Pt v={v} p={[wx, wy]} label="swapped ✘" color={RED} r={5} />}
        <Pt v={v} p={ta} label={`A ${pt(num(A[0]), num(A[1]))}`} color={AMBER} onDown={down(0)} />
        <Pt v={v} p={tb} label={`B ${pt(num(B[0]), num(B[1]))}`} color={SKY} onDown={down(1)} />
        <Pt v={v} p={tP} label={step >= 3 ? `P ${pt(xs, ys)}` : 'P'} color={GREEN} r={7} below={tb[1] > ta[1] && tb[0] < ta[0]} />
        <Panel title="Internal division" lines={lines} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Midpoint, points of trisection, equal parts, and the parallelogram test ───
export function Class10CoordGeoPartsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'parts', A: [2, -2], B: [-7, 4], k: 3, pts: [[1, 2], [4, 3], [6, 6], [3, 5]], task: null }, visual);
  const mode = s.mode === 'pgram' ? 'pgram' : 'parts';
  const A = ip(s.A, [2, -2]);
  const B = ip(s.B, [-7, 4]);
  const k = clamp(Math.round(Number(s.k)) || 2, 2, 6);
  const quad = (Array.isArray(s.pts) && s.pts.length === 4 ? s.pts : [[1, 2], [4, 3], [6, 6], [3, 5]]).map((p) => ip(p, [0, 0]));
  const scenePts = mode === 'pgram'
    ? (Array.isArray(visual?.pts) ? visual.pts : quad).map((p) => ip(p, [0, 0])).concat(Array.isArray(visual?.view) ? visual.view : [])
    : [ip(visual?.A, A), ip(visual?.B, B)];
  const v = useView(scenePts);
  const divs = Array.from({ length: k - 1 }, (_, i) => [((i + 1) * B[0] + (k - 1 - i) * A[0]) / k, ((i + 1) * B[1] + (k - 1 - i) * A[1]) / k]);
  const tAB = useTweenPts([A, B], 600);
  const tq = useTweenPts(quad, 500);
  const svgRef = useRef(null);
  const [down, svgProps] = useGridDrag(svgRef, v, (i, x, y) => {
    if (mode === 'parts') { update(i === 0 ? { A: [x, y] } : { B: [x, y] }); return; }
    const next = quad.slice();
    next[i] = [x, y];
    update({ pts: next });
  });
  const [qa, qb, qc, qd] = quad;
  const pg = qa[0] + qc[0] === qb[0] + qd[0] && qa[1] + qc[1] === qb[1] + qd[1];
  const task = s.task && s.task.type ? s.task : null;
  const done = !!task && (task.type === 'pgram' ? mode === 'pgram' && pg : mode === 'parts' && k === task.k);
  useDone(done, onInteract);
  const names = k === 2 ? ['M'] : k === 3 ? ['P', 'Q'] : divs.map((_, i) => `P${i + 1}`);
  const colors = [GREEN, PINK, PURPLE, SKY, AMBER];

  let picture;
  let lines;
  if (mode === 'parts') {
    const [ta, tb] = tAB;
    const tdivs = Array.from({ length: k - 1 }, (_, i) => [lerp(ta[0], tb[0], (i + 1) / k), lerp(ta[1], tb[1], (i + 1) / k)]);
    const marks = [ta, ...tdivs, tb];
    picture = (
      <g>
        <line x1={v.sx(ta[0])} y1={v.sy(ta[1])} x2={v.sx(tb[0])} y2={v.sy(tb[1])} stroke={INK} strokeWidth="4" strokeLinecap="round" />
        {marks.slice(0, -1).map((p, i) => {
          const q = marks[i + 1];
          const mx = v.sx((p[0] + q[0]) / 2);
          const my = v.sy((p[1] + q[1]) / 2);
          return (
            <g key={`seg${k}-${i}`} style={{ animation: 'cgFadeIn 400ms ease both', animationDelay: `${i * 160}ms` }}>
              <line x1={v.sx(p[0])} y1={v.sy(p[1])} x2={v.sx(q[0])} y2={v.sy(q[1])} stroke={i % 2 ? SKY : AMBER} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
              <circle cx={mx} cy={my} r="9" fill="#060d1d" stroke={i % 2 ? SKY : AMBER} strokeWidth="1.5" />
              <text x={mx} y={my + 4} textAnchor="middle" fill={INK} fontSize="10" fontWeight="900" fontFamily="monospace">{i + 1}</text>
            </g>
          );
        })}
        <Pt v={v} p={ta} label={`A ${pt(num(A[0]), num(A[1]))}`} color={AMBER} onDown={down(0)} />
        <Pt v={v} p={tb} label={`B ${pt(num(B[0]), num(B[1]))}`} color={SKY} onDown={down(1)} />
        {tdivs.map((p, i) => (
          <g key={`dv${k}-${i}`} style={{ animation: 'cgFadeIn 400ms ease both', animationDelay: `${300 + i * 160}ms` }}>
            <Pt v={v} p={p} label={names[i]} color={colors[i]} r={7} below={i % 2 === 1} />
          </g>
        ))}
      </g>
    );
    lines = [
      { t: `A ${pt(num(A[0]), num(A[1]))}  B ${pt(num(B[0]), num(B[1]))}`, c: INK, s: 14, b: true, mono: true },
      { t: `${k} equal parts`, c: AMBER, s: 16, b: true, gap: 28 },
      k === 2 && { t: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)', c: '#94a3b8', s: 12, mono: true, gap: 26 },
      ...divs.slice(0, 5).map((p, i) => ({
        t: `${names[i]} (${i + 1} : ${k - 1 - i}) = ${pt(frac((i + 1) * B[0] + (k - 1 - i) * A[0], k), frac((i + 1) * B[1] + (k - 1 - i) * A[1], k))}`,
        c: colors[i], s: 13, b: true, mono: true, gap: i === 0 ? 30 : 24,
      })),
      { t: 'Point number i divides AB', c: '#94a3b8', s: 12, gap: 34 },
      { t: `in the ratio i : (${k} − i).`, c: '#94a3b8', s: 12, gap: 17 },
    ];
  } else {
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const m1 = mid(tq[0], tq[2]);
    const m2 = mid(tq[1], tq[3]);
    picture = (
      <g>
        <polygon points={tq.map((p) => `${v.sx(p[0])},${v.sy(p[1])}`).join(' ')} fill={pg ? GREEN : '#334155'} fillOpacity="0.12" stroke={pg ? GREEN : '#94a3b8'} strokeWidth="3" strokeLinejoin="round" />
        <line x1={v.sx(tq[0][0])} y1={v.sy(tq[0][1])} x2={v.sx(tq[2][0])} y2={v.sy(tq[2][1])} stroke={PINK} strokeWidth="2" strokeDasharray="6 5" />
        <line x1={v.sx(tq[1][0])} y1={v.sy(tq[1][1])} x2={v.sx(tq[3][0])} y2={v.sy(tq[3][1])} stroke={PURPLE} strokeWidth="2" strokeDasharray="6 5" />
        <circle cx={v.sx(m1[0])} cy={v.sy(m1[1])} r="7" fill="none" stroke={PINK} strokeWidth="3" />
        <circle cx={v.sx(m2[0])} cy={v.sy(m2[1])} r="4" fill={PURPLE} />
        {tq.map((p, i) => <Pt key={`q${i}`} v={v} p={p} label={`${'ABCD'[i]} ${pt(num(quad[i][0]), num(quad[i][1]))}`} color={[AMBER, SKY, PINK, GREEN][i]} onDown={i === 3 ? down(3) : undefined} below={i === 0} />)}
      </g>
    );
    const f = (p, q, j) => frac(p[j] + q[j], 2);
    lines = [
      { t: 'Diagonals of a parallelogram', c: '#cbd5e1', s: 13 },
      { t: 'bisect each other.', c: '#cbd5e1', s: 13, gap: 18 },
      { t: `Mid of AC = ${pt(f(qa, qc, 0), f(qa, qc, 1))}`, c: PINK, s: 13, b: true, mono: true, gap: 32 },
      { t: `Mid of BD = ${pt(f(qb, qd, 0), f(qb, qd, 1))}`, c: PURPLE, s: 13, b: true, mono: true },
      { t: pg ? 'Same point: parallelogram ✔' : 'Different points ✘', c: pg ? GREEN : RED, s: 15, b: true, gap: 32 },
      { t: 'So A + C = B + D, giving', c: '#94a3b8', s: 12, gap: 32 },
      { t: `D = A + C − B = ${pt(num(qa[0] + qc[0] - qb[0]), num(qa[1] + qc[1] - qb[1]))}`, c: '#94a3b8', s: 12, mono: true, gap: 18 },
    ];
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Midpoints and equal parts"
      title={mode === 'pgram' ? (pg ? 'ABCD is a parallelogram' : 'Is ABCD a parallelogram?') : k === 2 ? 'The midpoint' : k === 3 ? 'Points of trisection' : `AB in ${k} equal parts`}
      footer={
        <div className="space-y-3">
          {mode === 'parts'
            ? <Slider label="Number of equal parts" value={k} min={2} max={6} onChange={(val) => update({ k: val })} />
            : <div className="text-sm text-slate-300">Drag the green corner D. Watch the two diagonal midpoints.</div>}
          {task && <TaskBanner text={`Your turn: ${task.text}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none" {...svgProps}>
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} />
        {picture}
        <Panel title={mode === 'pgram' ? 'Parallelogram test' : 'Dividing a segment'} lines={lines.filter(Boolean)} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Finding the ratio (slide P along AB; k : 1 method; where an axis cuts AB) ───
function niceRatio(t) {
  for (let q = 1; q <= 12; q++) {
    for (let p = 1; p <= 12; p++) {
      if (Math.abs(p / (p + q) - t) < 1e-6 && gcd(p, q) === 1) return [p, q];
    }
  }
  return null;
}

export function Class10CoordGeoRatioWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ A: [-6, 10], B: [3, -8], t: 0.5, axis: null, target: null, step: 2, task: null }, visual);
  const A = ip(s.A, [-6, 10]);
  const B = ip(s.B, [3, -8]);
  const axis = s.axis === 'x' || s.axis === 'y' ? s.axis : null;
  const target = isPt(s.target) ? P(s.target) : null;
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 3);
  const task = s.task && (s.task.axis || isPt(s.task.P)) ? s.task : null;
  // the special position (if any) that the slider snaps to
  const snapT = (() => {
    const ax = axis || task?.axis;
    if (ax === 'x' && A[1] !== B[1]) return A[1] / (A[1] - B[1]);
    if (ax === 'y' && A[0] !== B[0]) return A[0] / (A[0] - B[0]);
    const tg = target || (task && isPt(task.P) ? task.P : null);
    if (tg) return B[0] !== A[0] ? (tg[0] - A[0]) / (B[0] - A[0]) : (tg[1] - A[1]) / (B[1] - A[1]);
    return null;
  })();
  let t = clamp(Number(s.t) || 0, 0.01, 0.99);
  if (snapT != null && snapT > 0 && snapT < 1 && Math.abs(t - snapT) < 0.025) t = snapT;
  const v = useView([ip(visual?.A, [-6, 10]), ip(visual?.B, [3, -8])]);
  const tt = useTween(t, 700);
  const Pp = [lerp(A[0], B[0], tt), lerp(A[1], B[1], tt)];
  const kval = t / (1 - t);
  const nr = niceRatio(t);
  const exactP = nr ? [frac(nr[0] * B[0] + nr[1] * A[0], nr[0] + nr[1]), frac(nr[0] * B[1] + nr[1] * A[1], nr[0] + nr[1])] : [num(lerp(A[0], B[0], t)), num(lerp(A[1], B[1], t))];
  const atAxis = task?.axis === 'x' ? Math.abs(lerp(A[1], B[1], t)) < 1e-9 : task?.axis === 'y' ? Math.abs(lerp(A[0], B[0], t)) < 1e-9 : false;
  const atPoint = task && isPt(task.P) ? snapT != null && Math.abs(t - snapT) < 1e-9 : false;
  const done = !!task && (atAxis || atPoint);
  useDone(done, onInteract);

  const lines = [
    { t: `A ${pt(num(A[0]), num(A[1]))}  B ${pt(num(B[0]), num(B[1]))}`, c: INK, s: 14, b: true, mono: true },
    { t: 'Let AP : PB = k : 1', c: '#94a3b8', s: 13, gap: 28 },
    { t: `x = (${coef(B[0])}k + ${paren(A[0])})/(k + 1)`, c: '#94a3b8', s: 12, mono: true, gap: 20 },
    { t: `y = (${coef(B[1])}k + ${paren(A[1])})/(k + 1)`, c: '#94a3b8', s: 12, mono: true, gap: 18 },
    { t: `k = ${nr ? frac(nr[0], nr[1]) : kval.toFixed(2)}`, c: AMBER, s: 17, b: true, mono: true, gap: 32 },
    nr && { t: `AP : PB = ${nr[0]} : ${nr[1]}`, c: GREEN, s: 18, b: true, mono: true, gap: 28 },
    { t: `P ${pt(exactP[0], exactP[1])}`, c: GREEN, s: 15, b: true, mono: true, gap: 28 },
    step >= 2 && axis === 'x' && { t: `On the x-axis, y = 0:`, c: SKY, s: 12, gap: 30 },
    step >= 2 && axis === 'x' && { t: `${coef(B[1])}k + ${paren(A[1])} = 0 ⇒ k = ${frac(-A[1], B[1])}`, c: SKY, s: 13, mono: true, b: true, gap: 20 },
    step >= 2 && axis === 'y' && { t: `On the y-axis, x = 0:`, c: SKY, s: 12, gap: 30 },
    step >= 2 && axis === 'y' && { t: `${coef(B[0])}k + ${paren(A[0])} = 0 ⇒ k = ${frac(-A[0], B[0])}`, c: SKY, s: 13, mono: true, b: true, gap: 20 },
    step >= 2 && target && !axis && { t: `x: (${coef(B[0])}k + ${paren(A[0])})/(k+1) = ${num(target[0])}`, c: SKY, s: 12, mono: true, gap: 30 },
    step >= 2 && target && !axis && { t: `⇒ k = ${frac(target[0] - A[0], B[0] - target[0])}; check with y ✔`, c: SKY, s: 12, mono: true, b: true, gap: 20 },
  ];

  return (
    <StoryStage
      eyebrow="Visualizer · Finding the ratio"
      title={nr ? `P divides AB in the ratio ${nr[0]} : ${nr[1]}` : 'Slide P along AB'}
      footer={
        <div className="space-y-3">
          <Slider label="Slide P from A to B" value={t} min={0.01} max={0.99} step={0.005} onChange={(val) => update({ t: val })} show={`AP : PB = ${nr ? `${nr[0]} : ${nr[1]}` : `${kval.toFixed(2)} : 1`}`} />
          {task && <TaskBanner text={`Your turn: ${task.text}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <Grid v={v} glow={axis || task?.axis} />
        <line x1={v.sx(A[0])} y1={v.sy(A[1])} x2={v.sx(Pp[0])} y2={v.sy(Pp[1])} stroke={AMBER} strokeWidth="5" strokeLinecap="round" />
        <line x1={v.sx(Pp[0])} y1={v.sy(Pp[1])} x2={v.sx(B[0])} y2={v.sy(B[1])} stroke={SKY} strokeWidth="5" strokeLinecap="round" />
        {target && <circle cx={v.sx(target[0])} cy={v.sy(target[1])} r="12" fill="none" stroke={PINK} strokeWidth="2" strokeDasharray="4 3" />}
        <Pt v={v} p={A} label={`A ${pt(num(A[0]), num(A[1]))}`} color={AMBER} />
        <Pt v={v} p={B} label={`B ${pt(num(B[0]), num(B[1]))}`} color={SKY} />
        <Pt v={v} p={Pp} label="P" color={GREEN} r={8} below />
        <Panel title="k : 1 method" lines={lines.filter(Boolean)} />
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}
