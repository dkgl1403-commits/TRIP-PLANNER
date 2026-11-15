import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useSceneState, useSvgDrag, TaskBanner, RightAngleMark, polar, arcPath,
  INK, AMBER, SKY, GREEN, PINK, PURPLE,
} from '../engine/storyKit';

// Class 6 · Practical Geometry and Constructions — scene-driven story widgets.
// Every construction is a list of steps; each step's pieces are drawn one after another while a compass,
// ruler or protractor moves on the stage. `visual.step` = how many steps are shown (the last one animates).

const W = 600;
const H = 360;
const CM = 40; // 1 cm on the stage = 40 px
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const num = (v, lo, hi, dflt) => {
  const n = Number(v);
  return clamp(Number.isFinite(n) ? n : dflt, lo, hi);
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const angOf = (from, to) => (Math.atan2(-(to[1] - from[1]), to[0] - from[0]) * 180) / Math.PI; // maths degrees
const P = (c, r, deg) => polar(c[0], c[1], r, deg);
const fmt = (v) => (Math.round(v * 10) / 10).toString();

// The two crossing points of circles (c1, r1) and (c2, r2): [left of c1→c2 as seen on screen, right of it]
function cross(c1, r1, c2, r2) {
  const d = dist(c1, c2) || 1;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const ux = (c2[0] - c1[0]) / d;
  const uy = (c2[1] - c1[1]) / d;
  const mx = c1[0] + a * ux;
  const my = c1[1] + a * uy;
  return [[mx + h * uy, my - h * ux], [mx - h * uy, my + h * ux]];
}

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

function Slider({ label, value, min, max, step = 1, onChange, shown, tone = 'text-amber-300' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{shown ?? value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// ─── Item constructors (pieces of a construction) ───
const pt = (p, label, o = {}) => ({ k: 'pt', x: p[0], y: p[1], label, ...o });
const line = (a, b, o = {}) => ({ k: 'line', a, b, ...o });
const arc = (c, r, a0, a1, o = {}) => ({ k: 'arc', c, r, a0, a1, ...o });
const txt = (p, text, o = {}) => ({ k: 'text', x: p[0], y: p[1], text, ...o });
const measure = (c, r, a, o = {}) => ({ k: 'measure', c, r, a, ...o });
const right = (c, deg, o = {}) => ({ k: 'right', c, deg, ...o });
const angMark = (c, r, a0, a1, label, o = {}) => ({ k: 'ang', c, r, a0, a1, label, ...o });
const scale = (p, cm, o = {}) => ({ k: 'scale', x: p[0], y: p[1], cm, ...o });
const protractor = (c, o = {}) => ({ k: 'protractor', c, ...o });
const shape = (pts, o = {}) => ({ k: 'shape', pts, ...o });
const lens = (a, b, r, o = {}) => ({ k: 'lens', a, b, r, ...o });
const TOOL_KINDS = ['arc', 'line', 'measure'];

// ─── Drawing tools ───
function Compass({ pivot, pencil }) {
  const [px, py] = pivot;
  const [qx, qy] = pencil;
  const d = Math.hypot(qx - px, qy - py);
  const L = Math.max(d / 2 + 22, 92);
  let nx = d > 1 ? (qy - py) / d : 0;
  let ny = d > 1 ? -(qx - px) / d : -1;
  if (ny > 0 || (Math.abs(ny) < 1e-6 && nx > 0)) { nx = -nx; ny = -ny; }
  const h = Math.sqrt(Math.max(0, L * L - (d / 2) * (d / 2)));
  const hx = (px + qx) / 2 + nx * h;
  const hy = (py + qy) / 2 + ny * h;
  return (
    <g style={{ pointerEvents: 'none' }} opacity="0.95">
      <line x1={hx} y1={hy} x2={px} y2={py} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={qx} y2={qy} stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
      <line x1={lerp(hx, qx, 0.8)} y1={lerp(hy, qy, 0.8)} x2={qx} y2={qy} stroke={AMBER} strokeWidth="6" strokeLinecap="round" />
      <circle cx={px} cy={py} r="3" fill="#f8fafc" />
      <line x1={hx} y1={hy} x2={hx + nx * 18} y2={hy + ny * 18} stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r="7" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
    </g>
  );
}

function Ruler({ a, b, tip }) {
  const deg = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  const len = dist(a, b);
  const ticks = Math.floor((len + 20) / CM);
  return (
    <g style={{ pointerEvents: 'none' }}>
      <g transform={`translate(${a[0]} ${a[1]}) rotate(${deg})`}>
        <rect x="-20" y="4" width={len + 40} height="26" rx="3" fill="#fde68a" opacity="0.16" stroke={AMBER} strokeOpacity="0.6" />
        {Array.from({ length: ticks + 1 }, (_, i) => (
          <line key={i} x1={i * CM} y1="4" x2={i * CM} y2="14" stroke={AMBER} strokeOpacity="0.8" strokeWidth="1.5" />
        ))}
      </g>
      {tip && <polygon points={`${tip[0]},${tip[1]} ${tip[0] + 6},${tip[1] - 16} ${tip[0] + 14},${tip[1] - 12}`} fill={PINK} />}
    </g>
  );
}

function ScaleBar({ x, y, cm, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <rect x={x - 14} y={y} width={cm * CM + 28} height="34" rx="4" fill="#fde68a" opacity="0.18" stroke={AMBER} strokeOpacity="0.7" />
      {Array.from({ length: cm * 10 + 1 }, (_, i) => (
        <line key={i} x1={x + i * 4} y1={y} x2={x + i * 4} y2={y + (i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6)} stroke={AMBER} strokeWidth={i % 10 === 0 ? 1.6 : 0.8} />
      ))}
      {Array.from({ length: cm + 1 }, (_, i) => (
        <text key={`n${i}`} x={x + i * CM} y={y + 28} textAnchor="middle" fill={AMBER} fontSize="11" fontWeight="700" fontFamily="monospace">{i}</text>
      ))}
    </g>
  );
}

function Protractor({ c, R = 140, opacity = 1 }) {
  const [cx, cy] = c;
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <path d={`${arcPath(cx, cy, R, 0, 180)} Z`} fill="#38bdf8" fillOpacity="0.12" stroke={SKY} strokeWidth="2" />
      {Array.from({ length: 19 }, (_, i) => {
        const a = i * 10;
        const [x1, y1] = polar(cx, cy, R, a);
        const [x2, y2] = polar(cx, cy, R - (i % 3 === 0 ? 16 : 9), a);
        const [tx, ty] = polar(cx, cy, R - 28, a);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SKY} strokeWidth="1.5" />
            {i % 3 === 0 && <text x={tx} y={ty + 4} textAnchor="middle" fill={SKY} fontSize="11" fontWeight="700" fontFamily="monospace">{a}</text>}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="4" fill={SKY} />
    </g>
  );
}

// Renders one item at progress t (0..1)
function Item({ it, t }) {
  const color = it.color || INK;
  switch (it.k) {
    case 'line': {
      const bx = lerp(it.a[0], it.b[0], t);
      const by = lerp(it.a[1], it.b[1], t);
      return <line x1={it.a[0]} y1={it.a[1]} x2={bx} y2={by} stroke={color} strokeWidth={it.w || 3} strokeLinecap="round" strokeDasharray={it.dash ? '7 6' : undefined} opacity={it.op ?? 1} />;
    }
    case 'arc': {
      if (t <= 0) return null;
      return <path d={arcPath(it.c[0], it.c[1], it.r, it.a0, lerp(it.a0, it.a1, t))} fill="none" stroke={it.color || SKY} strokeWidth={it.w || 2} opacity={it.op ?? 0.9} />;
    }
    case 'pt':
      return (
        <g opacity={t}>
          <circle cx={it.x} cy={it.y} r={it.r || 5} fill={it.color || AMBER} />
          {it.label && <text x={it.x + (it.dx ?? -6)} y={it.y + (it.dy ?? -12)} fill={it.color || AMBER} fontSize="17" fontWeight="800" fontFamily="sans-serif">{it.label}</text>}
        </g>
      );
    case 'text':
      return <text x={it.x} y={it.y} opacity={t} textAnchor={it.anchor || 'middle'} fill={it.color || GREEN} fontSize={it.size || 16} fontWeight="800" fontFamily="sans-serif">{it.text}</text>;
    case 'right':
      return <g opacity={t}><RightAngleMark cx={it.c[0]} cy={it.c[1]} deg={it.deg} color={it.color || PINK} /></g>;
    case 'ang': {
      const mid = (it.a0 + it.a1) / 2;
      const [lx, ly] = P(it.c, it.r + 22, mid);
      return (
        <g opacity={t}>
          <path d={arcPath(it.c[0], it.c[1], it.r, it.a0, lerp(it.a0, it.a1, t))} fill="none" stroke={it.color || PINK} strokeWidth="3" />
          {it.label && <text x={lx} y={ly + 6} textAnchor="middle" fill={it.color || PINK} fontSize="16" fontWeight="900" fontFamily="monospace">{it.label}</text>}
        </g>
      );
    }
    case 'scale':
      return <ScaleBar x={it.x} y={it.y} cm={it.cm} opacity={t} />;
    case 'protractor':
      return <Protractor c={it.c} opacity={t} />;
    case 'shape':
      return <polygon points={it.pts.map((q) => q.join(',')).join(' ')} fill={it.color || AMBER} opacity={0.18 * t} />;
    case 'lens': {
      const [a, b, r] = [it.a, it.b, it.r];
      return <path d={`M ${a[0]} ${a[1]} A ${r} ${r} 0 0 1 ${b[0]} ${b[1]} A ${r} ${r} 0 0 1 ${a[0]} ${a[1]} Z`} fill={it.color || PINK} opacity={0.55 * t} />;
    }
    default:
      return null;
  }
}

// The tool for an item at progress t
function toolFor(it, t) {
  if (it.k === 'arc') return <Compass pivot={it.c} pencil={P(it.c, it.r, lerp(it.a0, it.a1, t))} />;
  if (it.k === 'measure') return <Compass pivot={it.c} pencil={P(it.c, lerp(it.r * 0.35, it.r, ease(t)), it.a)} />;
  if (it.k === 'line' && !it.noRuler && t < 1) {
    const tip = [lerp(it.a[0], it.b[0], t), lerp(it.a[1], it.b[1], t)];
    return <Ruler a={it.a} b={it.b} tip={t < 1 ? tip : null} />;
  }
  return null;
}

// Draws steps[0..k-1]; the last shown step is animated piece by piece with its tool
function useBoard(steps, k) {
  const n = steps.length;
  const shown = clamp(k, 0, n);
  const cur = shown > 0 ? steps[shown - 1] : null;
  const items = cur ? cur.items : [];
  const animCount = items.filter((it) => TOOL_KINDS.includes(it.k)).length;
  const dur = clamp(600 + animCount * 650, 900, 2300);
  const p = useReplay(`${shown}|${JSON.stringify(items)}`, dur);
  const visible = (it, i) => (it.only ? i === shown - 1 : it.until ? shown <= it.until : true);
  const nodes = [];
  steps.slice(0, shown).forEach((st, i) => {
    st.items.forEach((it, j) => {
      if (!visible(it, i)) return;
      const t = i === shown - 1 ? ease(seg(p, j / items.length, (j + 1) / items.length)) : 1;
      nodes.push(<Item key={`${i}-${j}`} it={it} t={t} />);
    });
  });
  let tool = null;
  if (cur) {
    const active = Math.min(items.length - 1, Math.floor(p * items.length));
    for (let j = active; j >= 0; j -= 1) {
      if (TOOL_KINDS.includes(items[j].k) && !items[j].noRuler) {
        tool = toolFor(items[j], ease(seg(p, j / items.length, (j + 1) / items.length)));
        break;
      }
    }
  }
  return { nodes, tool, cur, shown, n, p };
}

function StepControls({ shown, n, cur, onStep }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onStep(Math.max(1, shown - 1))} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200">◀ Back</button>
        <button onClick={() => onStep(Math.min(n, shown + 1))} className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/60 hover:bg-amber-500/30 text-xs font-bold text-amber-200">Next step ▶</button>
        <button onClick={() => onStep(1)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">Start again</button>
        <span className="text-xs text-slate-400 font-mono">Step {shown} of {n}</span>
      </div>
      {cur && <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200">{cur.cap}</div>}
    </div>
  );
}

function Board({ board, svgRef, children, under }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
      <rect width={W} height={H} fill="#020617" />
      {under}
      {board.nodes}
      {children}
      {board.tool}
    </svg>
  );
}

// ═══════════════════ WIDGET 1: Circles, segments and copying a segment ═══════════════════
function circleSteps(rc) {
  const O = [300, 180];
  const R = rc * CM;
  const E = P(O, R, 0);
  return [
    { cap: 'Mark a point O. It will be the centre.', items: [pt(O, 'O', { dx: -18, dy: 22 })] },
    { cap: `Open the compass to ${rc} cm using the ruler: needle on 0, pencil on ${rc}.`, items: [scale([O[0], O[1] + 2], Math.ceil(rc), { only: true }), measure(O, R, 0)] },
    { cap: 'Keep the needle on O and turn the compass one full round.', items: [arc(O, R, 0, 360, { color: AMBER, w: 3 })] },
    { cap: `Every point on the circle is ${rc} cm from O. That distance is the radius.`, items: [line(O, P(O, R, 35), { color: GREEN, dash: true, noRuler: true }), pt(P(O, R, 35), '', { color: GREEN }), txt([O[0] + 10, O[1] + 34], `radius = ${rc} cm`, { anchor: 'start' }), pt(E, '', { color: AMBER, r: 0.1 })] },
  ];
}

function segmentSteps(L) {
  const y = 170;
  const A = [70, y];
  const B = [70 + L * CM, y];
  return [
    { cap: 'Draw a long line l with the ruler and mark a point A on it.', items: [line([30, y], [575, y], { w: 2 }), txt([585, y + 5], 'l', { color: INK }), pt(A, 'A', { dy: -16 })] },
    { cap: `Needle on 0 of the ruler, open the pencil to ${fmt(L)} cm.`, items: [scale([70, 260], Math.ceil(L), { only: true }), measure([70, 260], L * CM, 0)] },
    { cap: 'Do not change the opening. Needle on A, draw a small arc that cuts l at B.', items: [arc(A, L * CM, 14, -14, { color: SKY, w: 2.5 }), pt(B, 'B', { dy: -16 })] },
    { cap: `AB is exactly ${fmt(L)} cm long. The compass carried the length for us.`, items: [line(A, B, { color: AMBER, w: 5, noRuler: true }), txt([(A[0] + B[0]) / 2, y + 40], `AB = ${fmt(L)} cm`)] },
  ];
}

function copySteps(L) {
  const A = [110, 90];
  const B = [110 + L * CM, 90];
  const Pp = [150, 260];
  const Q = [150 + L * CM, 260];
  return [
    { cap: 'Here is a line segment AB. We will copy it without reading any numbers.', items: [line(A, B, { color: AMBER, w: 5, noRuler: true }), pt(A, 'A'), pt(B, 'B')] },
    { cap: 'Needle on A, open the compass until the pencil sits on B.', items: [measure(A, L * CM, 0)] },
    { cap: 'Draw a line l and mark a point P on it.', items: [line([60, 260], [575, 260], { w: 2 }), txt([585, 265], 'l', { color: INK }), pt(Pp, 'P', { dy: -16 })] },
    { cap: 'Same opening: needle on P, draw an arc that cuts l at Q.', items: [arc(Pp, L * CM, 16, -16, { color: SKY, w: 2.5 }), pt(Q, 'Q', { dy: -16 })] },
    { cap: 'PQ has the same length as AB. It is a copy!', items: [line(Pp, Q, { color: GREEN, w: 5, noRuler: true }), txt([(Pp[0] + Q[0]) / 2, 310], 'PQ = AB')] },
  ];
}

export function Class6CompassRulerWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'circle', r: 3, len: 4.7, step: 99, task: null }, visual);
  const mode = ['circle', 'segment', 'copy'].includes(s.mode) ? s.mode : 'circle';
  const r = Math.round(num(s.r, 1, 4, 3) * 2) / 2;
  const len = Math.round(num(s.len, 2, 11, 4.7) * 10) / 10;
  const copyLen = clamp(len, 2, 10);
  const steps = mode === 'circle' ? circleSteps(r) : mode === 'segment' ? segmentSteps(len) : copySteps(copyLen);
  const board = useBoard(steps, Math.round(num(s.step, 0, 99, 99)));
  const task = s.task && s.task.r ? s.task : null;
  const done = !!task && mode === 'circle' && r === task.r && board.shown === board.n;
  useDone(done, onInteract);
  return (
    <StoryStage
      eyebrow="Visualizer · Ruler and compass"
      title={mode === 'circle' ? `A circle of radius ${r} cm` : mode === 'segment' ? `A line segment of ${fmt(len)} cm` : 'Copying a line segment'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, step: 1 })} options={[{ value: 'circle', label: 'Circle' }, { value: 'segment', label: 'Segment of given length' }, { value: 'copy', label: 'Copy a segment' }]} />
          {mode === 'circle'
            ? <Slider label="Radius" value={r} min={1} max={4} step={0.5} shown={`${r} cm`} onChange={(v) => update({ r: v })} />
            : <Slider label="Length" value={mode === 'copy' ? copyLen : len} min={2} max={mode === 'copy' ? 10 : 11} step={0.1} shown={`${fmt(mode === 'copy' ? copyLen : len)} cm`} onChange={(v) => update({ len: v })} />}
          <StepControls shown={board.shown} n={board.n} cur={board.cur} onStep={(k) => update({ step: k })} />
          {task && <TaskBanner text={`Your turn: set the radius to ${task.r} cm and play every step until the circle is drawn.`} done={done} />}
        </div>
      }
    >
      <Board board={board} />
    </StoryStage>
  );
}

// ═══════════════════ WIDGET 2: Perpendiculars, perpendicular bisector, equidistant points ═══════════════════
function bisectorSteps() {
  const A = [160, 200];
  const B = [440, 200];
  const r = 180;
  const [Pu, Qd] = cross(A, r, B, r);
  const M = [300, 200];
  return [
    { cap: 'Draw a line segment AB of 7 cm.', items: [line(A, B, { color: AMBER, w: 4 }), pt(A, 'A', { dx: -20, dy: 6 }), pt(B, 'B', { dx: 10, dy: 6 })] },
    { cap: 'Open the compass to more than half of AB. Needle on A: draw an arc above and below AB.', items: [arc(A, r, -55, 55)] },
    { cap: 'Same opening, needle on B. The two arcs cross at P and Q.', items: [arc(B, r, 125, 235), pt(Pu, 'P', { dx: 10, dy: -4 }), pt(Qd, 'Q', { dx: 10, dy: 16 })] },
    { cap: 'Join P and Q with the ruler.', items: [line([Pu[0], Pu[1] - 30], [Qd[0], Qd[1] + 30], { color: GREEN, w: 3 })] },
    { cap: 'PQ cuts AB at M exactly in half, and at 90 degrees. PQ is the perpendicular bisector of AB.', items: [pt(M, 'M', { dx: -22, dy: 22, color: GREEN }), right(M, 0), txt([480, 250], 'AM = MB = 3.5 cm'), txt([480, 274], 'angle = 90°', { color: PINK })] },
  ];
}

function onLineSteps() {
  const y = 240;
  const Pp = [300, y];
  const A = [200, y];
  const B = [400, y];
  const Q = cross(A, 160, B, 160)[0];
  return [
    { cap: 'Here is a line l with a point P on it. We want a line through P at 90 degrees to l.', items: [line([50, y], [550, y], { w: 2 }), txt([565, y + 5], 'l', { color: INK }), pt(Pp, 'P', { dx: 6, dy: 24 })] },
    { cap: 'Needle on P: draw an arc that cuts l at A and B. Now PA = PB.', items: [arc(Pp, 100, 0, 180), pt(A, 'A', { dx: -6, dy: 24 }), pt(B, 'B', { dx: -6, dy: 24 })] },
    { cap: 'Open the compass wider. From A and from B draw arcs that cross at Q.', items: [arc(A, 160, 38, 64), arc(B, 160, 116, 142), pt(Q, 'Q', { dx: 10, dy: -8 })] },
    { cap: 'Join P and Q. PQ is perpendicular to l.', items: [line(Pp, [300, 70], { color: GREEN, w: 3 }), right(Pp, 0)] },
  ];
}

function offLineSteps() {
  const y = 250;
  const Pp = [300, 100];
  const dx = Math.sqrt(190 * 190 - 150 * 150);
  const A = [300 - dx, y];
  const B = [300 + dx, y];
  const Q = cross(A, 135, B, 135)[1];
  const M = [300, y];
  return [
    { cap: 'Point P is not on line l. We want a line from P that meets l at 90 degrees.', items: [line([40, y], [560, y], { w: 2 }), txt([575, y + 5], 'l', { color: INK }), pt(Pp, 'P', { dx: 10, dy: -8 })] },
    { cap: 'Needle on P: draw an arc that cuts l at A and B.', items: [arc(Pp, 190, -140, -40), pt(A, 'A', { dx: -20, dy: -8 }), pt(B, 'B', { dx: 8, dy: -8 })] },
    { cap: 'Same opening from A and from B: draw arcs below l that cross at Q.', items: [arc(A, 135, -45, -15), arc(B, 135, -165, -135), pt(Q, 'Q', { dx: 10, dy: 8 })] },
    { cap: 'Join P and Q. PQ meets l at M at 90 degrees.', items: [line([300, 80], [Q[0], Q[1] + 20], { color: GREEN, w: 3 }), pt(M, 'M', { dx: 8, dy: 20, color: GREEN }), right(M, 0)] },
  ];
}

function equalSteps() {
  const A = [200, 190];
  const B = [400, 190];
  const [P4, Q4] = cross(A, 160, B, 160);
  const [R3, S3] = cross(A, 120, B, 120);
  return [
    { cap: 'A and B are 5 cm apart. Which points are the same distance from both?', items: [line(A, B, { dash: true, w: 2, noRuler: true, color: '#64748b' }), pt(A, 'A', { dx: -22, dy: 6 }), pt(B, 'B', { dx: 10, dy: 6 })] },
    { cap: 'Draw a circle of radius 4 cm with centre A.', items: [arc(A, 160, 0, 360, { op: 0.6 })] },
    { cap: 'Same radius with centre B. The two crossing points are 4 cm from A and 4 cm from B.', items: [arc(B, 160, 180, 540, { op: 0.6 }), pt(P4, 'P', { dx: 10 }), pt(Q4, 'Q', { dx: 10, dy: 0 })] },
    { cap: 'Repeat with 3 cm circles. Two more such points, R and S.', items: [arc(A, 120, 0, 360, { color: PINK, op: 0.7 }), arc(B, 120, 180, 540, { color: PINK, op: 0.7 }), pt(R3, 'R', { color: PINK, dx: 10 }), pt(S3, 'S', { color: PINK, dx: 10, dy: 2 })] },
    { cap: 'All of them lie on one straight line: the perpendicular bisector of AB!', items: [line([300, 22], [300, 352], { color: GREEN, w: 3 }), right([300, 190], 0, { color: GREEN })] },
  ];
}

export function Class6PerpendicularsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'bisector', step: 99, x: 230, y: 90, task: null }, visual);
  const mode = ['onLine', 'offLine', 'bisector', 'equal', 'hunt'].includes(s.mode) ? s.mode : 'bisector';
  const svgRef = useRef(null);
  const A = [200, 190];
  const B = [400, 190];
  const X = [num(s.x, 20, 580, 230), num(s.y, 20, 340, 90)];
  const drag = useSvgDrag(svgRef, (x, y) => update({ x: clamp(x, 20, 580), y: clamp(y, 20, 340) }));
  const steps = mode === 'onLine' ? onLineSteps() : mode === 'offLine' ? offLineSteps() : mode === 'equal' ? equalSteps() : bisectorSteps();
  const board = useBoard(mode === 'hunt' ? [] : steps, Math.round(num(s.step, 0, 99, 99)));
  const xa = dist(X, A) / CM;
  const xb = dist(X, B) / CM;
  const same = Math.abs(xa - xb) < 0.06;
  const onAB = Math.abs(X[1] - A[1]) < 12;
  const task = s.task ? s.task : null;
  const done = !!task && mode === 'hunt' && same && !onAB;
  useDone(done, onInteract);

  let hunt = null;
  if (mode === 'hunt') {
    hunt = (
      <g>
        <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
        {same && <line x1="300" y1="20" x2="300" y2="350" stroke={GREEN} strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />}
        <line x1={X[0]} y1={X[1]} x2={A[0]} y2={A[1]} stroke={SKY} strokeWidth="3" />
        <line x1={X[0]} y1={X[1]} x2={B[0]} y2={B[1]} stroke={PINK} strokeWidth="3" />
        <text x={(X[0] + A[0]) / 2 - 12} y={(X[1] + A[1]) / 2} textAnchor="end" fill={SKY} fontSize="16" fontWeight="900" fontFamily="monospace">{fmt(xa)} cm</text>
        <text x={(X[0] + B[0]) / 2 + 12} y={(X[1] + B[1]) / 2} fill={PINK} fontSize="16" fontWeight="900" fontFamily="monospace">{fmt(xb)} cm</text>
        <circle cx={A[0]} cy={A[1]} r="6" fill={AMBER} />
        <text x={A[0] - 22} y={A[1] + 6} fill={AMBER} fontSize="17" fontWeight="800">A</text>
        <circle cx={B[0]} cy={B[1]} r="6" fill={AMBER} />
        <text x={B[0] + 10} y={B[1] + 6} fill={AMBER} fontSize="17" fontWeight="800">B</text>
        <g {...drag} style={{ cursor: 'grab' }}>
          <circle cx={X[0]} cy={X[1]} r="20" fill="transparent" />
          <circle cx={X[0]} cy={X[1]} r="9" fill={same ? GREEN : PURPLE} stroke="#f8fafc" strokeWidth="2" />
          <text x={X[0] + 12} y={X[1] - 12} fill={same ? GREEN : PURPLE} fontSize="17" fontWeight="800">X</text>
        </g>
        <text x="300" y="342" textAnchor="middle" fill={same ? GREEN : '#94a3b8'} fontSize="15" fontWeight="800" fontFamily="sans-serif">
          {same ? 'XA = XB. X is on the perpendicular bisector!' : 'Drag X until both distances match.'}
        </text>
      </g>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Perpendiculars"
      title={{ onLine: 'Perpendicular through a point on a line', offLine: 'Perpendicular from a point outside', bisector: 'Perpendicular bisector', equal: 'Points equally far from A and B', hunt: 'Find a point equally far from A and B' }[mode]}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, step: 1 })} options={[{ value: 'onLine', label: 'Point on line' }, { value: 'offLine', label: 'Point outside line' }, { value: 'bisector', label: 'Perpendicular bisector' }, { value: 'equal', label: 'Equal distances' }, { value: 'hunt', label: 'Drag X' }]} />
          {mode === 'hunt'
            ? (
              <div className="flex flex-wrap gap-2">
                <Readout label="X to A" value={`${fmt(xa)} cm`} tone="text-sky-300" />
                <Readout label="X to B" value={`${fmt(xb)} cm`} tone="text-pink-300" />
              </div>
            )
            : <StepControls shown={board.shown} n={board.n} cur={board.cur} onStep={(k) => update({ step: k })} />}
          {task && <TaskBanner text="Your turn: drag X to a spot that is the same distance from A and from B (not on AB itself)." done={done} />}
        </div>
      }
    >
      <Board board={board} svgRef={svgRef}>{hunt}</Board>
    </StoryStage>
  );
}

// ═══════════════════ WIDGET 3: Protractor angle, copying an angle, bisecting an angle ═══════════════════
function protractorSteps(deg) {
  const B = [300, 290];
  const A = [540, 290];
  const C = P(B, 158, deg);
  return [
    { cap: 'Draw a ray BA with the ruler.', items: [line(B, A, { w: 3 }), pt(B, 'B', { dx: -6, dy: 26 }), pt(A, 'A', { dx: -6, dy: 26 })] },
    { cap: 'Put the protractor centre exactly on B, with its zero line along BA.', items: [protractor(B, { until: 3 })] },
    { cap: `Count up from 0 on the BA side and mark C at ${deg} degrees.`, items: [angMark(B, 118, 0, deg, '', { color: AMBER, until: 3 }), pt(C, 'C', { dx: 8, dy: -6 })] },
    { cap: 'Take the protractor away and join B to C.', items: [line(B, P(B, 245, deg), { color: AMBER, w: 3 })] },
    { cap: `Angle ABC measures ${deg} degrees.`, items: [angMark(B, 48, 0, deg, `${deg}°`)] },
  ];
}

function copyAngleSteps(deg) {
  const A = [70, 280];
  const Pp = [330, 280];
  const r = 110;
  const B = P(A, r, 0);
  const C = P(A, r, deg);
  const Q = P(Pp, r, 0);
  const R = P(Pp, r, deg);
  const bc = dist(B, C);
  const aq = angOf(Q, R);
  return [
    { cap: `Here is angle A. We will copy it with only a compass and ruler.`, items: [line(A, P(A, 215, 0), { noRuler: true }), line(A, P(A, 215, deg), { noRuler: true }), pt(A, 'A', { dx: -8, dy: 26 })] },
    { cap: 'Draw a ray from a new point P.', items: [line(Pp, [580, 280]), pt(Pp, 'P', { dx: -8, dy: 26 })] },
    { cap: 'Needle on A: draw an arc that cuts both arms, at B and C.', items: [arc(A, r, -10, deg + 15), pt(B, 'B', { dx: 6, dy: 24 }), pt(C, 'C', { dx: 8, dy: -6 })] },
    { cap: 'Same opening, needle on P: draw a long arc that cuts the ray at Q.', items: [arc(Pp, r, -10, deg + 25), pt(Q, 'Q', { dx: 6, dy: 24 })] },
    { cap: 'Now open the compass from B to C. This opening holds the angle.', items: [measure(B, bc, angOf(B, C))] },
    { cap: 'Needle on Q with that opening: cut the arc at R.', items: [arc(Q, bc, aq - 18, aq + 18, { color: PINK }), pt(R, 'R', { dx: 8, dy: -6 })] },
    { cap: 'Join P to R. Angle P is an exact copy of angle A!', items: [line(Pp, P(Pp, 215, deg), { color: GREEN, w: 3 }), angMark(A, 40, 0, deg, `${deg}°`), angMark(Pp, 40, 0, deg, `${deg}°`, { color: GREEN })] },
  ];
}

function bisectAngleSteps(deg) {
  const O = [150, 300];
  const r = 150;
  const A = P(O, r, 0);
  const B = P(O, r, deg);
  const cs = cross(A, 120, B, 120);
  const C = dist(cs[0], O) > dist(cs[1], O) ? cs[0] : cs[1];
  const ca = angOf(A, C);
  const cb = angOf(B, C);
  return [
    { cap: `Angle O is ${deg} degrees. Let us cut it into two equal halves.`, items: [line(O, P(O, 300, 0), { noRuler: true }), line(O, P(O, 290, deg), { noRuler: true }), pt(O, 'O', { dx: -10, dy: 26 }), angMark(O, 40, 0, deg, `${deg}°`, { color: PURPLE })] },
    { cap: 'Needle on O: draw an arc that cuts the arms at A and B.', items: [arc(O, r, -8, deg + 8), pt(A, 'A', { dx: 6, dy: 24 }), pt(B, 'B', { dx: -24, dy: -4 })] },
    { cap: 'From A and from B, with the same opening, draw arcs that cross at C.', items: [arc(A, 120, ca - 18, ca + 18), arc(B, 120, cb - 18, cb + 18), pt(C, 'C', { dx: 10, dy: -6 })] },
    { cap: 'Join O to C. Ray OC is the angle bisector.', items: [line(O, P(O, 300, deg / 2), { color: GREEN, w: 3 })] },
    { cap: `Each half measures ${fmt(deg / 2)} degrees.`, items: [angMark(O, 70, 0, deg / 2, `${fmt(deg / 2)}°`, { color: AMBER }), angMark(O, 95, deg / 2, deg, `${fmt(deg / 2)}°`, { color: GREEN })] },
  ];
}

export function Class6AngleToolsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'protractor', deg: 40, step: 99, task: null }, visual);
  const mode = ['protractor', 'copy', 'bisect'].includes(s.mode) ? s.mode : 'protractor';
  const lim = mode === 'protractor' ? [10, 170] : mode === 'copy' ? [20, 80] : [30, 120];
  const deg = Math.round(num(s.deg, lim[0], lim[1], 40) / 5) * 5;
  const steps = mode === 'protractor' ? protractorSteps(deg) : mode === 'copy' ? copyAngleSteps(deg) : bisectAngleSteps(deg);
  const board = useBoard(steps, Math.round(num(s.step, 0, 99, 99)));
  const task = s.task && s.task.deg ? s.task : null;
  const done = !!task && mode === 'protractor' && deg === task.deg && board.shown === board.n;
  useDone(done, onInteract);
  return (
    <StoryStage
      eyebrow="Visualizer · Making angles"
      title={mode === 'protractor' ? `An angle of ${deg}° with a protractor` : mode === 'copy' ? 'Copying an angle' : 'Bisecting an angle'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, step: 1 })} options={[{ value: 'protractor', label: 'Protractor' }, { value: 'copy', label: 'Copy an angle' }, { value: 'bisect', label: 'Angle bisector' }]} />
          <Slider label="Angle" value={deg} min={lim[0]} max={lim[1]} step={5} shown={`${deg}°`} onChange={(v) => update({ deg: v })} />
          <StepControls shown={board.shown} n={board.n} cur={board.cur} onStep={(k) => update({ step: k })} />
          {task && <TaskBanner text={`Your turn: make an angle of ${task.deg}° with the protractor, right up to the last step.`} done={done} />}
        </div>
      }
    >
      <Board board={board} />
    </StoryStage>
  );
}

// ═══════════════════ WIDGET 4: 60, 120, 30, 90 and 45 degrees with a compass ═══════════════════
function specialSteps(mode) {
  const O = [160, 300];
  const r = 130;
  const Pp = P(O, r, 0);
  const Q = P(O, r, 60);
  const R = P(O, r, 120);
  const T = P(O, r, 90);
  const other = (a, b) => {
    const cs = cross(a, r, b, r);
    return dist(cs[0], O) > dist(cs[1], O) ? cs[0] : cs[1];
  };
  const S30 = other(Pp, Q);
  const S90 = other(Q, R);
  const U45 = other(Pp, T);
  const far = (p, a) => P(O, a, angOf(O, p));
  const near = (c, p, w = 15) => [angOf(c, p) - w, angOf(c, p) + w];
  const base = [
    { cap: 'Draw a ray OA.', items: [line(O, [570, 300]), pt(O, 'O', { dx: -8, dy: 26 }), pt([570, 300], 'A', { dx: -18, dy: 26 })] },
    { cap: 'Needle on O: draw a big arc that cuts OA at P.', items: [arc(O, r, -6, 150), pt(Pp, 'P', { dx: 6, dy: 24 })] },
    { cap: 'Same opening, needle on P: cut the arc at Q.', items: [arc(Pp, r, ...near(Pp, Q)), pt(Q, 'Q', { dx: 8, dy: -8 })] },
  ];
  const cutR = { cap: 'Same opening again, needle on Q: cut the arc at R.', items: [arc(Q, r, ...near(Q, R)), pt(R, 'R', { dx: -22, dy: -8 })] };
  if (mode === '60') {
    return [
      ...base,
      { cap: 'Join O to Q. Angle QOP is 60 degrees!', items: [line(O, far(Q, 270), { color: AMBER, w: 3 }), angMark(O, 45, 0, 60, '60°')] },
      { cap: 'Why? OP, OQ and PQ are all one compass opening, so triangle OPQ is equilateral.', items: [line(Pp, Q, { color: GREEN, w: 3, noRuler: true }), line(O, Pp, { color: GREEN, w: 3, noRuler: true }), txt([430, 120], 'OP = PQ = OQ', { color: GREEN })] },
    ];
  }
  if (mode === '120') {
    return [
      ...base,
      cutR,
      { cap: 'Join O to R. Angle ROP is 120 degrees: two 60s side by side!', items: [line(O, far(R, 270), { color: AMBER, w: 3 }), angMark(O, 45, 0, 120, '120°')] },
    ];
  }
  if (mode === '30') {
    return [
      ...base,
      { cap: 'Join O to Q for 60 degrees. Now bisect it: from P and Q, draw arcs that cross at S.', items: [line(O, far(Q, 270), { color: '#64748b', w: 2 }), arc(Pp, r, ...near(Pp, S30)), arc(Q, r, ...near(Q, S30)), pt(S30, 'S', { dx: 10, dy: -4 })] },
      { cap: 'Join O to S. Angle SOP is 30 degrees, half of 60.', items: [line(O, far(S30, 330), { color: AMBER, w: 3 }), angMark(O, 60, 0, 30, '30°')] },
    ];
  }
  if (mode === '90' || mode === '45') {
    const ninety = [
      ...base,
      cutR,
      { cap: 'From Q and from R, with the same opening, draw arcs that cross at S.', items: [arc(Q, r, ...near(Q, S90)), arc(R, r, ...near(R, S90)), pt(S90, 'S', { dx: 10, dy: -4 })] },
      { cap: 'Join O to S. Angle SOP is 90 degrees, exactly halfway between 60 and 120!', items: [line(O, [160, 30], { color: mode === '90' ? AMBER : '#94a3b8', w: 3 }), right(O, 0)] },
    ];
    if (mode === '90') return ninety;
    return [
      ...ninety,
      { cap: 'OS cuts the big arc at T. From P and from T, draw arcs that cross at U.', items: [pt(T, 'T', { dx: -24, dy: -4, color: GREEN }), arc(Pp, r, ...near(Pp, U45)), arc(T, r, ...near(T, U45)), pt(U45, 'U', { dx: 10, dy: -4 })] },
      { cap: 'Join O to U. Angle UOP is 45 degrees, half of 90.', items: [line(O, far(U45, 330), { color: AMBER, w: 3 }), angMark(O, 62, 0, 45, '45°')] },
    ];
  }
  return base;
}

export function Class6CompassAnglesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: '60', step: 99, task: null }, visual);
  const mode = ['60', '120', '30', '90', '45'].includes(String(s.mode)) ? String(s.mode) : '60';
  const steps = specialSteps(mode);
  const board = useBoard(steps, Math.round(num(s.step, 0, 99, 99)));
  const task = s.task && s.task.mode ? s.task : null;
  const done = !!task && mode === String(task.mode) && board.shown === board.n;
  useDone(done, onInteract);
  return (
    <StoryStage
      eyebrow="Visualizer · Angles with only a compass"
      title={`Constructing ${mode}°`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, step: 1 })} options={['60', '120', '30', '90', '45'].map((m) => ({ value: m, label: `${m}°` }))} />
          <StepControls shown={board.shown} n={board.n} cur={board.cur} onStep={(k) => update({ step: k })} />
          {task && <TaskBanner text={`Your turn: pick ${task.mode}° and press Next step until the angle is finished.`} done={done} />}
        </div>
      }
    >
      <Board board={board} />
    </StoryStage>
  );
}

// ═══════════════════ WIDGET 5: Squares, rectangles and compass art ═══════════════════
function rectSteps(w, h, square) {
  const A = [300 - (w * CM) / 2, 315];
  const B = [300 + (w * CM) / 2, 315];
  const D = [A[0], A[1] - h * CM];
  const C = [B[0], B[1] - h * CM];
  const top = Math.max(18, D[1] - 34);
  const name = square ? 'square' : 'rectangle';
  return [
    { cap: `Draw AB = ${fmt(w)} cm.`, items: [line(A, B, { color: AMBER, w: 4 }), pt(A, 'A', { dx: -20, dy: 18 }), pt(B, 'B', { dx: 8, dy: 18 })] },
    { cap: 'At A, make a 90 degree angle (use the compass method) and draw that arm up.', items: [line(A, [A[0], top], { w: 2 }), right(A, 0)] },
    { cap: `Open the compass to ${fmt(h)} cm. Needle on A, cut the arm at D.`, items: [arc(A, h * CM, 78, 102), pt(D, 'D', { dx: -22, dy: -4 })] },
    { cap: `Do the same at B: a 90 degree arm, then cut it at C, ${fmt(h)} cm up.`, items: [line(B, [B[0], top], { w: 2 }), right(B, 90), arc(B, h * CM, 78, 102), pt(C, 'C', { dx: 10, dy: -4 })] },
    { cap: `Join D to C. DC is also ${fmt(w)} cm and all four corners are 90 degrees. A ${name}!`, items: [line(D, C, { color: AMBER, w: 4 }), line(A, D, { color: AMBER, w: 4, noRuler: true }), line(B, C, { color: AMBER, w: 4, noRuler: true }), shape([A, B, C, D]), right(D, 270), right(C, 180), txt([300, (A[1] + D[1]) / 2 + 6], `${fmt(w)} cm by ${fmt(h)} cm`, { color: AMBER })] },
  ];
}

function artSteps() {
  const O = [300, 180];
  const r = 80;
  const centre = (k) => P(O, r, 90 + 60 * k);
  const petal = (k) => arc(centre(k), r, 90 + 60 * k + 120, 90 + 60 * k + 240, { color: PINK, w: 2.5 });
  const petals = [0, 1, 2, 3, 4, 5].map((k) => lens(O, P(O, r, 90 + 60 * k), r, { color: k % 2 ? AMBER : PINK }));
  return [
    { cap: 'Rangoli time! Draw a circle of radius 2 cm.', items: [pt(O, '', { r: 3 }), arc(O, r, 90, 450, { color: SKY, w: 2.5 })] },
    { cap: 'Same opening. Put the needle on the top of the circle and draw the arc inside it.', items: [petal(0)] },
    { cap: 'Move the needle to where that arc meets the circle, and draw again.', items: [petal(1), petal(2)] },
    { cap: 'Keep going round the circle.', items: [petal(3), petal(4), petal(5)] },
    { cap: 'Six petals appear, because the radius fits exactly 6 times around the circle. Colour it in!', items: [...petals, arc(O, 2 * r, 0, 360, { color: GREEN, w: 2.5 }), arc(O, 2 * r - 10, 0, 360, { color: AMBER, w: 1.5 })] },
  ];
}

export function Class6SquareArtWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'rect', w: 6, h: 4, side: 5, step: 99, task: null }, visual);
  const mode = ['rect', 'square', 'art'].includes(s.mode) ? s.mode : 'rect';
  const w = Math.round(num(s.w, 2, 11, 6) * 2) / 2;
  const h = Math.round(num(s.h, 1, 6.5, 4) * 2) / 2;
  const side = Math.round(num(s.side, 2, 6.5, 5) * 2) / 2;
  const steps = mode === 'rect' ? rectSteps(w, h, false) : mode === 'square' ? rectSteps(side, side, true) : artSteps();
  const board = useBoard(steps, Math.round(num(s.step, 0, 99, 99)));
  const task = s.task && s.task.w ? s.task : null;
  const done = !!task && mode === 'rect' && w === task.w && h === task.h && board.shown === board.n;
  useDone(done, onInteract);
  return (
    <StoryStage
      eyebrow="Visualizer · Playing with constructions"
      title={mode === 'rect' ? `Rectangle ${fmt(w)} cm by ${fmt(h)} cm` : mode === 'square' ? `Square of side ${fmt(side)} cm` : 'Compass art: a six petal flower'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, step: 1 })} options={[{ value: 'rect', label: 'Rectangle' }, { value: 'square', label: 'Square' }, { value: 'art', label: 'Compass art' }]} />
          {mode === 'rect' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Length AB" value={w} min={2} max={11} step={0.5} shown={`${fmt(w)} cm`} onChange={(v) => update({ w: v })} />
              <Slider label="Breadth" value={h} min={1} max={6.5} step={0.5} shown={`${fmt(h)} cm`} onChange={(v) => update({ h: v })} tone="text-sky-300" />
            </div>
          )}
          {mode === 'square' && <Slider label="Side" value={side} min={2} max={6.5} step={0.5} shown={`${fmt(side)} cm`} onChange={(v) => update({ side: v })} />}
          <StepControls shown={board.shown} n={board.n} cur={board.cur} onStep={(k) => update({ step: k })} />
          {task && <TaskBanner text={`Your turn: construct a rectangle ${task.w} cm by ${task.h} cm, all the way to the last step.`} done={done} />}
        </div>
      }
    >
      <Board board={board} />
    </StoryStage>
  );
}
