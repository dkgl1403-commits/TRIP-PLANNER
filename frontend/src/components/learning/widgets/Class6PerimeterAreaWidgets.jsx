import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner, Dot,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Perimeter and Area — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const int = (v, lo, hi, dflt) => clamp(Math.round(Number(v)) || dflt, lo, hi);
const fmt = (v) => (Math.abs(v - Math.round(v)) < 0.01 ? String(Math.round(v)) : v.toFixed(1));
const FADE = '@keyframes paFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } } @keyframes paPop { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: scale(1) } }';
const SANS = 'sans-serif';
const MONO = 'monospace';

// 0 → 1 progress that restarts whenever `dep` changes (drives step-by-step animations)
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

function Slider({ label, value, min, max, onChange, tone = 'text-amber-300', suffix = '' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}{suffix}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function Grid({ x, y, cols, rows, cell, opacity = 0.3 }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: cols + 1 }, (_, i) => <line key={`v${i}`} x1={x + i * cell} y1={y} x2={x + i * cell} y2={y + rows * cell} stroke="#64748b" strokeWidth="1" />)}
      {Array.from({ length: rows + 1 }, (_, i) => <line key={`h${i}`} x1={x} y1={y + i * cell} x2={x + cols * cell} y2={y + i * cell} stroke="#64748b" strokeWidth="1" />)}
    </g>
  );
}

// Walking along a closed polygon: segment lengths and the point at distance d
function pathInfo(pts) {
  const segs = pts.map((a, i) => {
    const b = pts[(i + 1) % pts.length];
    return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) };
  });
  return { segs, total: segs.reduce((s, g) => s + g.len, 0) };
}

function walkTrail(info, d) {
  const out = [info.segs[0].a];
  let left = d;
  for (const g of info.segs) {
    if (left >= g.len) { out.push(g.b); left -= g.len; continue; }
    const t = g.len ? left / g.len : 0;
    out.push([lerp(g.a[0], g.b[0], t), lerp(g.a[1], g.b[1], t)]);
    break;
  }
  return out;
}

// Outward label position for a clockwise (on screen) polygon edge
function edgeLabel(a, b, off = 18) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const n = Math.hypot(dx, dy) || 1;
  return [(a[0] + b[0]) / 2 + (dy / n) * off, (a[1] + b[1]) / 2 - (dx / n) * off + 6];
}

// ─── WIDGET 1: Walking the boundary (perimeter of rectangle, square, any rectilinear shape) ───
const L_SHAPE = [[0, 0], [8, 0], [8, 3], [5, 3], [5, 6], [0, 6]];

export function Class6FenceWalkWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'rect', l: 12, b: 8, unit: 'm', walk: 1, task: null }, visual);
  const mode = ['rect', 'square', 'lshape'].includes(s.mode) ? s.mode : 'rect';
  const l = int(s.l, 1, 14, 12);
  const b = mode === 'square' ? l : int(s.b, 1, 9, 8);
  const unitPts = mode === 'lshape' ? L_SHAPE : [[0, 0], [l, 0], [l, b], [0, b]];
  const wU = Math.max(...unitPts.map((p) => p[0]));
  const hU = Math.max(...unitPts.map((p) => p[1]));
  const px = Math.min(330 / wU, 210 / hU, 36);
  const ox = 210 - (wU * px) / 2;
  const oy = 190 - (hU * px) / 2;
  const pts = unitPts.map(([u, v]) => [ox + u * px, oy + v * px]);
  const info = pathInfo(pts);
  const sides = info.segs.map((g) => Math.round(g.len / px));
  const P = sides.reduce((a, c) => a + c, 0);
  const p = useReplay(`${mode}-${l}-${b}-${s.walk}`, 600 + sides.length * 340);
  const d = p * info.total;
  const trail = walkTrail(info, d);
  const walker = trail[trail.length - 1];
  const doneSides = [];
  let acc = 0;
  info.segs.forEach((g, i) => { acc += g.len; if (d >= acc - 0.5) doneSides.push(i); });
  const covered = Math.round(d / px);
  const task = s.task && s.task.perimeter ? s.task : null;
  const done = !!task && mode === 'rect' && P === task.perimeter;
  useDone(done, onInteract);
  const u = s.unit || 'm';
  const formula = mode === 'rect' ? `2 × (${l} + ${b}) = ${P}` : mode === 'square' ? `4 × ${l} = ${P}` : `sum of all ${sides.length} sides = ${P}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Walk the boundary"
      title={mode === 'lshape' ? 'Perimeter of an L-shaped garden' : mode === 'square' ? 'Perimeter of a square' : 'Perimeter of a rectangle'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m, walk: (s.walk || 0) + 1 })} options={[{ value: 'rect', label: 'Rectangle' }, { value: 'square', label: 'Square' }, { value: 'lshape', label: 'L-shape' }]} />
          {mode !== 'lshape' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label={mode === 'square' ? 'Side' : 'Length'} value={l} min={1} max={14} suffix={` ${u}`} onChange={(v) => update({ l: v })} />
              {mode === 'rect' && <Slider label="Breadth" value={b} min={1} max={9} suffix={` ${u}`} onChange={(v) => update({ b: v })} tone="text-sky-300" />}
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Walked so far" value={`${covered} ${u}`} tone="text-amber-300" />
            <Readout label="Perimeter" value={`${P} ${u}`} />
            <button onClick={() => update({ walk: (s.walk || 0) + 1 })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">Walk again</button>
          </div>
          {task && <TaskBanner text={`Your turn: make a rectangular garden with a fence (perimeter) of exactly ${task.perimeter} ${u}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <polygon points={pts.map((q) => q.join(',')).join(' ')} fill="#14532d" opacity="0.55" stroke="#475569" strokeWidth="3" strokeDasharray="6 5" />
        {Array.from({ length: 7 }, (_, i) => {
          const fx = ox + 14 + ((i + 0.5) * (wU * px - 28)) / 7;
          const fy = oy + (hU * px) / 2 + ((i % 2) ? 12 : -12);
          return mode === 'lshape' && (fx > ox + 5 * px && fy > oy + 3 * px) ? null : <g key={i}><circle cx={fx} cy={fy} r="7" fill={PINK} opacity="0.8" /><circle cx={fx} cy={fy} r="3" fill={AMBER} /></g>;
        })}
        <polyline points={trail.map((q) => q.join(',')).join(' ')} fill="none" stroke={AMBER} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {info.segs.map((g, i) => {
          const [lx, ly] = edgeLabel(g.a, g.b, 20);
          const on = doneSides.includes(i);
          return <text key={`${mode}-${i}`} x={lx} y={ly} textAnchor="middle" fill={on ? AMBER : '#64748b'} fontSize="16" fontWeight="900" fontFamily={MONO} style={{ transition: 'fill 300ms' }}>{sides[i]} {u}</text>;
        })}
        <Dot x={walker[0]} y={walker[1]} color={PINK} r={8} pulse={p < 1} />
        {/* running sum */}
        <text x="525" y="60" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>Add the sides</text>
        {sides.map((v, i) => (
          <text key={`${mode}-${l}-${b}-${i}`} x="525" y={88 + i * 26} textAnchor="middle" fill={doneSides.includes(i) ? AMBER : '#334155'} fontSize="18" fontWeight="900" fontFamily={MONO} style={{ transition: 'fill 300ms' }}>
            {i ? '+ ' : ''}{v}
          </text>
        ))}
        <line x1="475" y1={78 + sides.length * 26} x2="575" y2={78 + sides.length * 26} stroke="#475569" strokeWidth="2" />
        <text x="525" y={104 + sides.length * 26} textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily={MONO} opacity={p >= 1 ? 1 : 0.15} style={{ transition: 'opacity 400ms' }}>{P} {u}</text>
        <text x="210" y="345" textAnchor="middle" fill={p >= 1 ? GREEN : '#475569'} fontSize="18" fontWeight="900" fontFamily={MONO} style={{ transition: 'fill 400ms' }}>Perimeter = {formula} {u}</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Regular polygons — unroll the boundary into a straight line ───
const POLY_NAMES = { 3: 'Equilateral triangle', 4: 'Square', 5: 'Regular pentagon', 6: 'Regular hexagon', 7: 'Regular heptagon', 8: 'Regular octagon' };
const RIGHT_TRI = [[0, 3], [0, 0], [4, 3]];

export function Class6PolygonUnrollWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'regular', n: 3, side: 5, unroll: false, unit: 'cm', task: null }, visual);
  const mode = s.mode === 'triangle' ? 'triangle' : 'regular';
  const n = int(s.n, 3, 8, 3);
  const side = int(s.side, 1, 10, 5);
  const t = useTween(s.unroll ? 1 : 0, 1500);
  const u = s.unit || 'cm';

  let unitPts;
  if (mode === 'triangle') unitPts = RIGHT_TRI;
  else {
    const R = side / (2 * Math.sin(Math.PI / n));
    unitPts = Array.from({ length: n }, (_, i) => {
      const a = (-90 - 180 / n + (360 * i) / n) * (Math.PI / 180);
      return [R * Math.cos(a), R * Math.sin(a)];
    });
  }
  const lens = unitPts.map((a, i) => { const b2 = unitPts[(i + 1) % unitPts.length]; return Math.hypot(b2[0] - a[0], b2[1] - a[1]); });
  const total = lens.reduce((a, c) => a + c, 0);
  const xs = unitPts.map((q) => q[0]);
  const ys = unitPts.map((q) => q[1]);
  const wU = Math.max(...xs) - Math.min(...xs);
  const hU = Math.max(...ys) - Math.min(...ys);
  const px = Math.min(190 / Math.max(wU, hU), 500 / total, 34);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const poly = unitPts.map(([x, y]) => [300 + (x - cx) * px, 140 + (y - cy) * px]);
  const lx0 = 300 - (total * px) / 2;
  const cum = [0];
  lens.forEach((v) => cum.push(cum[cum.length - 1] + v));
  const pos = cum.map((c, i) => {
    const a = poly[i % poly.length];
    return [lerp(a[0], lx0 + c * px, t), lerp(a[1], 290, t)];
  });
  const sideLabels = mode === 'triangle' ? lens.map((v) => fmt(v)) : lens.map(() => String(side));
  const P = mode === 'triangle' ? 12 : n * side;
  const task = s.task && s.task.perimeter ? s.task : null;
  const done = !!task && mode === 'regular' && P === task.perimeter && (!task.n || task.n === n);
  useDone(done, onInteract);
  const colors = [AMBER, SKY, PINK, GREEN, PURPLE, '#fb923c', '#2dd4bf', RED];

  return (
    <StoryStage
      eyebrow="Visualizer · Unroll the boundary"
      title={mode === 'triangle' ? 'A triangle with sides 3, 4 and 5' : `${POLY_NAMES[n]}, side ${side} ${u}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'regular', label: 'Regular polygon' }, { value: 'triangle', label: 'Any triangle' }]} />
          {mode === 'regular' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Number of equal sides" value={n} min={3} max={8} onChange={(v) => update({ n: v })} tone="text-sky-300" />
              <Slider label="Length of each side" value={side} min={1} max={10} suffix={` ${u}`} onChange={(v) => update({ side: v })} />
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => update({ unroll: !s.unroll })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-amber-400 text-amber-300 bg-amber-500/10">{s.unroll ? 'Fold it back' : 'Unroll the boundary'}</button>
            <Readout label="Perimeter" value={`${P} ${u}`} />
          </div>
          {task && <TaskBanner text={`Your turn: build a regular polygon whose perimeter is ${task.perimeter} ${u}${task.n ? ` using ${task.n} sides` : ''}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <polygon points={poly.map((q) => q.join(',')).join(' ')} fill={AMBER} opacity={0.12 * (1 - t)} stroke="#334155" strokeWidth="2" strokeDasharray="5 5" />
        {pos.slice(0, -1).map((a, i) => {
          const b2 = pos[i + 1];
          const [lx, ly] = t < 0.5 ? edgeLabel(a, b2, 18) : [(a[0] + b2[0]) / 2, a[1] - 14];
          return (
            <g key={`${mode}-${n}-${i}`}>
              <line x1={a[0]} y1={a[1]} x2={b2[0]} y2={b2[1]} stroke={colors[i % colors.length]} strokeWidth="6" strokeLinecap="round" />
              <text x={lx} y={ly} textAnchor="middle" fill={colors[i % colors.length]} fontSize={n > 6 && t > 0.5 ? 12 : 15} fontWeight="900" fontFamily={MONO}>{sideLabels[i]}</text>
            </g>
          );
        })}
        {pos.map((q, i) => <circle key={`d${i}`} cx={q[0]} cy={q[1]} r="4" fill={INK} />)}
        <g opacity={clamp((t - 0.7) / 0.3, 0, 1)}>
          <line x1={lx0} y1="312" x2={lx0 + total * px} y2="312" stroke={GREEN} strokeWidth="2" />
          <line x1={lx0} y1="304" x2={lx0} y2="320" stroke={GREEN} strokeWidth="2" />
          <line x1={lx0 + total * px} y1="304" x2={lx0 + total * px} y2="320" stroke={GREEN} strokeWidth="2" />
          <text x="300" y="342" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily={MONO}>
            {mode === 'triangle' ? `3 + 4 + 5 = 12 ${u}` : `${n} × ${side} = ${P} ${u}`}
          </text>
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Area by counting squares (compare, count, a leaf on squared paper, paint your own) ───
const GC = 14;
const GR = 9;
const CELL = 30;
const GX = 20;
const GY = 50;
const SHAPE_A = []; // 4 by 3 block
for (let r = 2; r < 5; r += 1) for (let c = 1; c < 5; c += 1) SHAPE_A.push([c, r]);
const SHAPE_B = [[9, 2], [10, 2], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [10, 5]];

// Fraction of cell (c, r) inside the leaf, by sampling a 10 by 10 net of points
function leafInside(x, y) {
  const R = 5.2;
  const k = 3.1;
  return Math.hypot(x - 7, y - (4.5 - k)) < R && Math.hypot(x - 7, y - (4.5 + k)) < R;
}
function leafCells() {
  const out = [];
  for (let r = 0; r < GR; r += 1) {
    for (let c = 0; c < GC; c += 1) {
      let hits = 0;
      for (let i = 0; i < 10; i += 1) for (let j = 0; j < 10; j += 1) if (leafInside(c + (i + 0.5) / 10, r + (j + 0.5) / 10)) hits += 1;
      if (hits > 0) out.push({ c, r, f: hits / 100 });
    }
  }
  return out;
}
const LEAF = leafCells();
const leafKind = (f) => (f >= 0.99 ? 'full' : f > 0.55 ? 'more' : f >= 0.45 ? 'half' : 'less');
const KIND_COLOR = { full: GREEN, more: AMBER, half: SKY, less: PINK };

function leafPath() {
  const R = 5.2;
  const k = 3.1;
  const hw = Math.sqrt(R * R - k * k);
  const x1 = GX + (7 - hw) * CELL;
  const x2 = GX + (7 + hw) * CELL;
  const y = GY + 4.5 * CELL;
  return `M ${x1} ${y} A ${R * CELL} ${R * CELL} 0 0 1 ${x2} ${y} A ${R * CELL} ${R * CELL} 0 0 1 ${x1} ${y} Z`;
}

export function Class6SquareCountWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'compare', show: 'both', painted: [], task: null }, visual);
  const mode = ['compare', 'count', 'leaf', 'paint'].includes(s.mode) ? s.mode : 'compare';
  const p = useReplay(`${mode}-${s.show}`, mode === 'leaf' ? 2600 : 2400);
  const painted = Array.isArray(s.painted) ? s.painted : [];
  const task = s.task && s.task.area ? s.task : null;
  const done = !!task && mode === 'paint' && painted.length === task.area;
  useDone(done, onInteract);
  const cellRect = (c, r, fill, op, key, extra = {}) => (
    <rect key={key} x={GX + c * CELL + 1.5} y={GY + r * CELL + 1.5} width={CELL - 3} height={CELL - 3} rx="3" fill={fill} opacity={op} {...extra} />
  );

  let picture;
  let side;
  if (mode === 'compare' || mode === 'count') {
    const showB = s.show !== 'A';
    const showA = s.show !== 'B';
    const counting = mode === 'count';
    const k = counting ? Math.floor(p * 14) : 99;
    picture = (
      <>
        {!counting && (
          <>
            <path d={`M ${GX + CELL} ${GY + 2 * CELL} h ${4 * CELL} v ${3 * CELL} h ${-4 * CELL} Z`} fill="none" stroke={AMBER} strokeWidth="3" />
            <path d={`M ${GX + 9 * CELL} ${GY + 2 * CELL} h ${2 * CELL} v ${CELL} h ${2 * CELL} v ${2 * CELL} h ${-2 * CELL} v ${CELL} h ${-CELL} v ${-CELL} h ${-2 * CELL} v ${-2 * CELL} h ${CELL} Z`} fill="none" stroke={SKY} strokeWidth="3" />
          </>
        )}
        {showA && SHAPE_A.map(([c, r], i) => (
          <g key={`a${i}`} opacity={i < k ? 1 : 0.15} style={{ transition: 'opacity 250ms' }}>
            {cellRect(c, r, AMBER, 0.75, 'r')}
            {counting && <text x={GX + c * CELL + CELL / 2} y={GY + r * CELL + 20} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900" fontFamily={MONO}>{i + 1}</text>}
          </g>
        ))}
        {showB && SHAPE_B.map(([c, r], i) => (
          <g key={`b${i}`} opacity={i < k ? 1 : 0.15} style={{ transition: 'opacity 250ms' }}>
            {cellRect(c, r, SKY, 0.75, 'r')}
            {counting && <text x={GX + c * CELL + CELL / 2} y={GY + r * CELL + 20} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900" fontFamily={MONO}>{i + 1}</text>}
          </g>
        ))}
        <text x={GX + 3 * CELL} y={GY + 6.6 * CELL} textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={SANS}>Harsh's tile</text>
        <text x={GX + 10.5 * CELL} y={GY + 6.6 * CELL} textAnchor="middle" fill={SKY} fontSize="16" fontWeight="900" fontFamily={SANS}>Disha's tile</text>
      </>
    );
    side = counting && p >= 1
      ? <text x="300" y="34" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily={MONO} style={{ animation: 'paFadeIn 500ms ease both' }}>Harsh: 12 squares · Disha: 13 squares</text>
      : <text x="300" y="34" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="800" fontFamily={SANS}>{counting ? 'Counting unit squares…' : 'Which tile covers more of the floor?'}</text>;
  } else if (mode === 'leaf') {
    const order = ['full', 'more', 'half', 'less'];
    const counts = { full: 0, more: 0, half: 0, less: 0 };
    LEAF.forEach((q) => { counts[leafKind(q.f)] += 1; });
    const est = counts.full + counts.more + counts.half / 2;
    picture = (
      <>
        {LEAF.map((q) => {
          const kind = leafKind(q.f);
          const on = p > 0.15 + order.indexOf(kind) * 0.18;
          return cellRect(q.c, q.r, KIND_COLOR[kind], on ? (kind === 'less' ? 0.25 : 0.6) : 0, `${q.c}-${q.r}`, { style: { transition: 'opacity 500ms' } });
        })}
        <path d={leafPath()} fill="#22c55e" fillOpacity="0.15" stroke={GREEN} strokeWidth="3" />
        <line x1={GX + 2.5 * CELL} y1={GY + 4.5 * CELL} x2={GX + 11.5 * CELL} y2={GY + 4.5 * CELL} stroke={GREEN} strokeWidth="2" opacity="0.6" />
      </>
    );
    side = (
      <g>
        {order.map((kind, i) => (
          <text key={kind} x={20 + i * 150} y="34" fill={KIND_COLOR[kind]} fontSize="14" fontWeight="900" fontFamily={SANS} opacity={p > 0.15 + i * 0.18 ? 1 : 0.2} style={{ transition: 'opacity 400ms' }}>
            {kind === 'full' ? 'Full' : kind === 'more' ? 'More than half' : kind === 'half' ? 'Half' : 'Less than half'}: {counts[kind]}
          </text>
        ))}
        <text x="300" y={GY + GR * CELL + 34} textAnchor="middle" fill={INK} fontSize="17" fontWeight="900" fontFamily={MONO} opacity={p >= 1 ? 1 : 0} style={{ transition: 'opacity 500ms' }}>
          Area about {counts.full} + {counts.more}{counts.half ? ` + ${counts.half}/2` : ''} = {fmt(est)} squares
        </text>
      </g>
    );
  } else {
    const key = (c, r) => `${c},${r}`;
    picture = (
      <>
        {Array.from({ length: GR }, (_, r) => Array.from({ length: GC }, (_, c) => {
          const on = painted.includes(key(c, r));
          return cellRect(c, r, on ? PURPLE : '#0f172a', on ? 0.85 : 0.6, key(c, r), {
            style: { cursor: 'pointer', transition: 'fill 200ms' },
            onClick: () => update({ painted: on ? painted.filter((x) => x !== key(c, r)) : [...painted, key(c, r)] }),
          });
        }))}
      </>
    );
    side = <text x="300" y="34" textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="900" fontFamily={MONO}>Painted: {painted.length} square{painted.length === 1 ? '' : 's'}</text>;
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Area by counting squares"
      title={mode === 'leaf' ? 'Area of a leaf on squared paper' : mode === 'paint' ? 'Paint your own shape' : 'How much surface does it cover?'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'compare', label: 'Compare tiles' }, { value: 'count', label: 'Count squares' }, { value: 'leaf', label: 'Leaf on squared paper' }, { value: 'paint', label: 'Paint a shape' }]} />
          {mode === 'leaf' && <p className="text-xs text-slate-400">Rule: full square = 1, more than half = 1, exactly half = half, less than half = 0.</p>}
          {mode === 'paint' && <p className="text-xs text-slate-400">Tap squares to paint or un-paint them.</p>}
          {task && <TaskBanner text={`Your turn: paint any shape with an area of exactly ${task.area} square units.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <Grid x={GX} y={GY} cols={GC} rows={GR} cell={CELL} opacity={0.45} />
        {picture}
        {side}
        {mode !== 'leaf' && <text x="560" y={GY + GR * CELL + 30} textAnchor="end" fill="#64748b" fontSize="12" fontWeight="700" fontFamily={SANS}>each small square = 1 square unit</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Area of a rectangle and a square — rows of unit tiles ───
export function Class6TileAreaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ l: 5, b: 4, unit: 'm', rows: false, task: null }, visual);
  const l = int(s.l, 1, 12, 5);
  const b = int(s.b, 1, 8, 4);
  const u = s.unit || 'm';
  const cell = Math.min(280 / l, 250 / b, 46);
  const ox = 215 - (l * cell) / 2;
  const oy = 190 - (b * cell) / 2;
  const n = l * b;
  const p = useReplay(`${l}-${b}-${s.rows}`, 700 + Math.min(n, 60) * 35);
  const shown = Math.floor(p * (n + 0.999));
  const task = s.task && s.task.area ? s.task : null;
  const done = !!task && n === task.area && (!task.square || l === b) && (!task.notSquare || l !== b);
  useDone(done, onInteract);
  const sq = l === b;

  return (
    <StoryStage
      eyebrow="Visualizer · Tiling a floor"
      title={sq ? `A square, side ${l} ${u}` : `A rectangle, ${l} ${u} by ${b} ${u}`}
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Length" value={l} min={1} max={12} suffix={` ${u}`} onChange={(v) => update({ l: v })} />
            <Slider label="Breadth" value={b} min={1} max={8} suffix={` ${u}`} onChange={(v) => update({ b: v })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Tiles (area)" value={`${n} sq ${u}`} />
            <Readout label="Fence (perimeter)" value={`${2 * (l + b)} ${u}`} tone="text-amber-300" />
            <button onClick={() => update({ rows: !s.rows })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">{s.rows ? 'Hide rows' : 'Show rows'}</button>
          </div>
          {task && <TaskBanner text={`Your turn: make a ${task.square ? 'square ' : task.notSquare ? 'rectangle (not a square) ' : ''}floor with an area of exactly ${task.area} square ${u === 'm' ? 'metres' : u}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <rect x={ox} y={oy} width={l * cell} height={b * cell} fill="#0f172a" stroke={INK} strokeWidth="3" />
        {Array.from({ length: n }, (_, i) => {
          const r = Math.floor(i / l);
          const c = i % l;
          const on = i < shown;
          return (
            <rect key={`${l}-${b}-${i}`} x={ox + c * cell + 1.5} y={oy + r * cell + 1.5} width={cell - 3} height={cell - 3} rx="3"
              fill={s.rows ? (r % 2 ? SKY : AMBER) : (r + c) % 2 ? '#0d9488' : GREEN} opacity={on ? 0.8 : 0}
              style={{ transform: on ? 'none' : 'scale(0.6)', transformOrigin: `${ox + c * cell + cell / 2}px ${oy + r * cell + cell / 2}px`, transition: 'opacity 250ms, transform 250ms' }} />
          );
        })}
        <text x={ox + (l * cell) / 2} y={oy - 12} textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={MONO}>{l} {u}</text>
        <text x={ox - 12} y={oy + (b * cell) / 2 + 6} textAnchor="end" fill={SKY} fontSize="16" fontWeight="900" fontFamily={MONO}>{b} {u}</text>
        {s.rows && Array.from({ length: b }, (_, r) => (
          <text key={`rw${r}`} x={ox + l * cell + 10} y={oy + r * cell + cell / 2 + 5} fill={r % 2 ? SKY : AMBER} fontSize={Math.min(14, cell * 0.6)} fontWeight="800" fontFamily={MONO} opacity={shown >= (r + 1) * l ? 1 : 0}>row {r + 1}: {l}</text>
        ))}
        <g transform="translate(520 0)">
          <text x="0" y="110" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>{s.rows ? `${b} rows of ${l}` : 'Tiles laid'}</text>
          <text x="0" y="150" textAnchor="middle" fill={INK} fontSize="34" fontWeight="900" fontFamily={MONO}>{Math.min(shown, n)}</text>
          <text x="0" y="205" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily={MONO} opacity={p >= 1 ? 1 : 0.1} style={{ transition: 'opacity 400ms' }}>{sq ? 'side × side' : 'length × breadth'}</text>
          <text x="0" y="232" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily={MONO} opacity={p >= 1 ? 1 : 0.1} style={{ transition: 'opacity 400ms' }}>{l} × {b} = {n}</text>
          <text x="0" y="258" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="800" fontFamily={MONO} opacity={p >= 1 ? 1 : 0.1}>square {u === 'm' ? 'metres' : u}</text>
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: A triangle is half of its rectangle ───
export function Class6TriangleHalfWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'right', b: 8, h: 6, a: 0, task: null }, visual);
  const mode = s.mode === 'any' ? 'any' : 'right';
  const b = int(s.b, 1, 12, 8);
  const h = int(s.h, 1, 8, 6);
  const a = mode === 'right' ? 0 : clamp(Math.round(Number(s.a)) || 0, 0, b);
  const svgRef = useRef(null);
  const cell = Math.min(360 / b, 250 / h, 34);
  const ox = 210 - (b * cell) / 2;
  const by = 300;
  const ty = by - h * cell;
  const ax = useTween(ox + a * cell, 700);
  const drag = useSvgDrag(svgRef, (x) => update({ a: clamp(Math.round((x - ox) / cell), 0, b), mode: 'any' }));
  const p = useReplay(`${mode}-${b}-${h}`, 1600);
  const flip = clamp((p - 0.35) / 0.5, 0, 1);
  const task = s.task && s.task.area ? s.task : null;
  const done = !!task && b * h === task.area * 2;
  useDone(done, onInteract);
  const area = (b * h) / 2;
  const R = ox + b * cell;

  return (
    <StoryStage
      eyebrow="Visualizer · Half a rectangle"
      title={mode === 'right' ? 'Cut a rectangle along its diagonal' : 'Any triangle in its rectangle'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m, a: m === 'any' ? Math.round(b / 3) : 0 })} options={[{ value: 'right', label: 'Diagonal cut' }, { value: 'any', label: 'Move the top corner' }]} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Base" value={b} min={1} max={12} suffix=" cm" onChange={(v) => update({ b: v, a: Math.min(a, v) })} />
            <Slider label="Height" value={h} min={1} max={8} suffix=" cm" onChange={(v) => update({ h: v })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Rectangle" value={`${b * h} sq cm`} tone="text-slate-300" />
            <Readout label="Triangle" value={`${fmt(area)} sq cm`} />
            {mode === 'any' && <span className="text-xs text-slate-400">Drag the pink corner along the top.</span>}
          </div>
          {task && <TaskBanner text={`Your turn: make a triangle with an area of exactly ${task.area} square cm.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        <Grid x={ox} y={ty} cols={b} rows={h} cell={cell} opacity={0.35} />
        {mode === 'right' ? (
          <>
            <polygon points={`${ox},${ty} ${ox},${by} ${R},${by}`} fill={AMBER} opacity="0.75" />
            {/* the other half flips over onto the first one */}
            <g style={{ transformOrigin: `${(ox + R) / 2}px ${(ty + by) / 2}px`, transform: `rotate(${180 * flip}deg)` }}>
              <polygon points={`${ox},${ty} ${R},${ty} ${R},${by}`} fill={SKY} opacity={0.75 - 0.35 * flip} stroke={SKY} strokeWidth="2" />
            </g>
            <line x1={ox} y1={ty} x2={R} y2={by} stroke={INK} strokeWidth="3" strokeDasharray="8 5" />
          </>
        ) : (
          <>
            <polygon points={`${ox},${ty} ${ax},${ty} ${ox},${by}`} fill={AMBER} opacity="0.25" />
            <polygon points={`${ax},${ty} ${ox},${by} ${ax},${by}`} fill={AMBER} opacity="0.8" />
            <polygon points={`${ax},${ty} ${R},${ty} ${R},${by}`} fill={SKY} opacity="0.25" />
            <polygon points={`${ax},${ty} ${ax},${by} ${R},${by}`} fill={SKY} opacity="0.8" />
            <line x1={ax} y1={ty} x2={ax} y2={by} stroke={INK} strokeWidth="2" strokeDasharray="6 5" />
            <polygon points={`${ax},${ty} ${ox},${by} ${R},${by}`} fill="none" stroke={INK} strokeWidth="3" />
            <g {...drag} style={{ cursor: 'grab' }}>
              <circle cx={ax} cy={ty} r="18" fill="transparent" />
              <Dot x={ax} y={ty} color={PINK} r={8} pulse />
            </g>
          </>
        )}
        <rect x={ox} y={ty} width={b * cell} height={h * cell} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        <text x={(ox + R) / 2} y={by + 24} textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={MONO}>base {b} cm</text>
        <text x={R + 10} y={(ty + by) / 2 + 5} fill={SKY} fontSize="16" fontWeight="900" fontFamily={MONO}>height {h} cm</text>
        <text x="300" y="26" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>{mode === 'right' ? 'Turn one half over: the two halves match' : 'Each colour: dark half inside the triangle, light half outside'}</text>
        <text x="300" y="346" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily={MONO} opacity={p >= 0.9 ? 1 : 0} style={{ transition: 'opacity 400ms' }}>
          Triangle = half of {b} × {h} = {fmt(area)} sq cm
        </text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Same perimeter, different area (and the other way round), split and rearrange ───
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0 && d <= n / d);

export function Class6RopeShapesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'rope', P: 24, l: 3, A: 12, w: 2, cut: false, task: null }, visual);
  const mode = ['rope', 'tiles', 'rearrange'].includes(s.mode) ? s.mode : 'rope';
  const half = int(s.P, 8, 28, 24) / 2;
  const P = half * 2;
  const l = int(s.l, 1, half - 1, 3);
  const bb = half - l;
  const lw = useTween(l, 700);
  const bw = useTween(bb, 700);
  const A = int(s.A, 4, 36, 12);
  const divs = divisors(A);
  const w = divs.includes(Number(s.w)) ? Number(s.w) : divs[divs.length - 1];
  const cutT = useTween(s.cut ? 1 : 0, 1600);
  const best = Math.floor(half / 2);
  const task = s.task || null;
  const done = !!task && mode === 'rope' && task.maxArea && l * bb === best * (half - best);
  useDone(done, onInteract);

  let picture;
  if (mode === 'rope') {
    const px = 16;
    const rx = 140 - (lw * px) / 2;
    const ry = 175 - (bw * px) / 2;
    const maxA = best * (half - best);
    const n = half - 1;
    const barW = Math.min(26, 250 / n);
    picture = (
      <>
        <rect x={rx} y={ry} width={lw * px} height={bw * px} fill={GREEN} fillOpacity="0.25" stroke={AMBER} strokeWidth="5" strokeLinejoin="round" rx="2" />
        <text x="140" y={ry - 10} textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily={MONO}>{l} m</text>
        <text x={rx - 8} y="180" textAnchor="end" fill={AMBER} fontSize="15" fontWeight="900" fontFamily={MONO}>{bb} m</text>
        <text x="140" y="335" textAnchor="middle" fill={GREEN} fontSize="17" fontWeight="900" fontFamily={MONO}>Area {l} × {bb} = {l * bb} sq m</text>
        <text x="140" y="30" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>Rope always {P} m long</text>
        {Array.from({ length: n }, (_, i) => {
          const L = i + 1;
          const ar = L * (half - L);
          const hgt = (ar / maxA) * 220;
          const x = 300 + i * (270 / n);
          const on = L === l;
          return (
            <g key={`${P}-${i}`}>
              <rect x={x} y={290 - hgt} width={barW} height={hgt} rx="3" fill={on ? AMBER : '#334155'} style={{ transition: 'fill 300ms' }} />
              <text x={x + barW / 2} y="308" textAnchor="middle" fill={on ? AMBER : '#64748b'} fontSize="11" fontWeight="800" fontFamily={MONO}>{L}</text>
              {(on || n <= 11) && <text x={x + barW / 2} y={284 - hgt} textAnchor="middle" fill={on ? AMBER : '#64748b'} fontSize="11" fontWeight="800" fontFamily={MONO}>{ar}</text>}
            </g>
          );
        })}
        <text x="435" y="330" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="800" fontFamily={SANS}>length (m) → area (sq m)</text>
        <text x="435" y="30" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>Same perimeter, different areas</text>
      </>
    );
  } else if (mode === 'tiles') {
    const len = A / w;
    const cell = Math.min(300 / len, 180 / w, 40);
    const ox = 190 - (len * cell) / 2;
    const oy = 150 - (w * cell) / 2;
    picture = (
      <>
        <text x="190" y="30" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>Always {A} tiles</text>
        {Array.from({ length: A }, (_, i) => (
          <rect key={`${A}-${w}-${i}`} x={ox + (i % len) * cell + 1.5} y={oy + Math.floor(i / len) * cell + 1.5} width={cell - 3} height={cell - 3} rx="3" fill={PINK} opacity="0.75"
            style={{ animation: 'paPop 400ms ease both', animationDelay: `${i * 30}ms`, transformOrigin: `${ox + (i % len) * cell + cell / 2}px ${oy + Math.floor(i / len) * cell + cell / 2}px` }} />
        ))}
        <rect x={ox} y={oy} width={len * cell} height={w * cell} fill="none" stroke={AMBER} strokeWidth="4" />
        <text x="190" y="290" textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="900" fontFamily={MONO}>{len} by {w}: perimeter 2 × ({len} + {w}) = {2 * (len + w)}</text>
        <text x="510" y="70" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>Area {A}, every way</text>
        {divs.slice().reverse().map((d, i) => (
          <text key={d} x="510" y={105 + i * 30} textAnchor="middle" fill={d === w ? AMBER : '#64748b'} fontSize="16" fontWeight="900" fontFamily={MONO}>{A / d} × {d}: P = {2 * (A / d + d)}</text>
        ))}
      </>
    );
  } else {
    const px = 40;
    const x0 = 140;
    const y0 = 110;
    const slide = clamp(cutT * 1.4, 0, 1) * 6 * px;
    const show = cutT > 0.02;
    const slant = Math.hypot(2, 4);
    const perim = 12 + 2 * lerp(4, slant, clamp((cutT - 0.6) / 0.4, 0, 1));
    picture = (
      <>
        <polygon points={`${x0},${y0} ${x0 + 6 * px},${y0} ${x0 + 6 * px},${y0 + 4 * px} ${x0 + 2 * px},${y0 + 4 * px}`} fill={SKY} opacity="0.7" />
        <polygon points={`${x0 + slide},${y0} ${x0 + slide},${y0 + 4 * px} ${x0 + 2 * px + slide},${y0 + 4 * px}`} fill={show ? PINK : SKY} opacity="0.8" style={{ transition: 'fill 300ms' }} />
        <Grid x={x0} y={y0} cols={8} rows={4} cell={px} opacity={0.25} />
        <line x1={x0} y1={y0} x2={x0 + 2 * px} y2={y0 + 4 * px} stroke={INK} strokeWidth="3" strokeDasharray="7 5" />
        <text x="300" y="40" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800" fontFamily={SANS}>{cutT < 0.5 ? 'A 6 by 4 rectangle of 24 squares' : 'Cut off the pink piece and slide it across'}</text>
        <text x="300" y="320" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily={MONO}>Area: 24 square units (no paper lost)</text>
        <text x="300" y="347" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={MONO}>Perimeter: {perim.toFixed(1)} units {cutT > 0.9 ? '(it grew!)' : ''}</text>
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Perimeter vs area"
      title={mode === 'rope' ? `A ${P} m rope, many rectangles` : mode === 'tiles' ? `${A} tiles, many rectangles` : 'Split and rearrange'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'rope', label: 'Same rope' }, { value: 'tiles', label: 'Same tiles' }, { value: 'rearrange', label: 'Cut and slide' }]} />
          {mode === 'rope' && <Slider label="Length of the rectangle" value={l} min={1} max={half - 1} suffix=" m" onChange={(v) => update({ l: v })} />}
          {mode === 'tiles' && (
            <div className="flex flex-wrap gap-2">
              {divs.slice().reverse().map((d) => (
                <button key={d} onClick={() => update({ w: d })} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${d === w ? 'border-pink-400 text-pink-300 bg-pink-500/10' : 'border-slate-700 text-slate-400'}`}>{A / d} by {d}</button>
              ))}
            </div>
          )}
          {mode === 'rearrange' && <button onClick={() => update({ cut: !s.cut })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-amber-400 text-amber-300 bg-amber-500/10">{s.cut ? 'Put it back' : 'Cut and slide'}</button>}
          {task && task.maxArea && <TaskBanner text={`Your turn: with the ${P} m rope, make the rectangle with the BIGGEST area.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {picture}
      </svg>
    </StoryStage>
  );
}
