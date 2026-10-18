import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, polar, arcPath, sectorPath,
  Dot, RightAngleMark, TaskBanner, INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Understanding Elementary Shapes — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const round = (v) => Math.round(v);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const normDeg = (d) => ((d % 360) + 360) % 360;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const dist = ([ax, ay], [bx, by]) => Math.hypot(bx - ax, by - ay);
const cm = (px) => (px / 40).toFixed(1);
const dirDeg = ([ax, ay], [bx, by]) => normDeg((Math.atan2(ay - by, bx - ax) * 180) / Math.PI);
const mid = ([ax, ay], [bx, by]) => [(ax + bx) / 2, (ay + by) / 2];

// Interior angle at P between rays P→A and P→B (0..180)
function angleAt(P, A, B) {
  const v1 = [A[0] - P[0], A[1] - P[1]];
  const v2 = [B[0] - P[0], B[1] - P[1]];
  const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) || 1);
  return (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI;
}

// The CCW start direction and sweep of the interior angle at P (for drawing sectors)
function interiorArc(P, A, B) {
  const a1 = dirDeg(P, A);
  const a2 = dirDeg(P, B);
  const sweep = normDeg(a2 - a1);
  return sweep <= 180 ? { start: a1, sweep } : { start: a2, sweep: 360 - sweep };
}

// Animates a list of points to new positions (shape morphing)
function useMorph(points, duration = 1200) {
  const key = JSON.stringify(points);
  const [cur, setCur] = useState(points);
  const curRef = useRef(points);
  useEffect(() => {
    const from = curRef.current;
    const to = points;
    if (from.length !== to.length) {
      curRef.current = to;
      setCur(to);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = ease(Math.min(1, Math.max(0, (now - start) / duration)));
      const v = from.map((p, i) => [p[0] + (to[i][0] - p[0]) * t, p[1] + (to[i][1] - p[1]) * t]);
      curRef.current = v;
      setCur(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return cur;
}

// 0 → 1 progress that restarts whenever `dep` changes (used to "draw" shapes)
function useReplay(dep, duration = 1400) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setP(ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setP(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dep, duration]);
  return p;
}

const pts = (list) => list.map((p) => p.join(',')).join(' ');
const LETTERS = 'ABCDEFGHIJ';

// Small "|" tick marks across the middle of a side, used to show equal sides
const along = ([ax, ay], [bx, by], t) => [ax + (bx - ax) * t, ay + (by - ay) * t];

function SideTicks({ a, b, count, color = AMBER, at = 0.5 }) {
  if (!count) return null;
  const [mx, my] = along(a, b, at);
  const len = dist(a, b) || 1;
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const off = (i - (count - 1) / 2) * 7;
        const cx = mx + ux * off;
        const cy = my + uy * off;
        return <line key={i} x1={cx - uy * 9} y1={cy + ux * 9} x2={cx + uy * 9} y2={cy - ux * 9} stroke={color} strokeWidth="2.5" />;
      })}
    </g>
  );
}

// ">" chevrons in the middle of a side, used to show parallel sides
function ParallelMarks({ a, b, count, color = SKY, at = 0.5 }) {
  if (!count) return null;
  const [mx, my] = along(a, b, at);
  const d = dirDeg(a, b);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const [cx, cy] = polar(mx, my, (i - (count - 1) / 2) * 9, d);
        const [x1, y1] = polar(cx, cy, 9, d + 150);
        const [x2, y2] = polar(cx, cy, 9, d - 150);
        return <polyline key={i} points={`${x1},${y1} ${cx},${cy} ${x2},${y2}`} fill="none" stroke={color} strokeWidth="2.5" />;
      })}
    </g>
  );
}

function AngleLabel({ P, start, sweep, text, color, r = 52 }) {
  const [x, y] = polar(P[0], P[1], r, start + sweep / 2);
  return <text x={x} y={y + 5} textAnchor="middle" fill={color} fontSize="14" fontWeight="900" fontFamily="monospace" paintOrder="stroke" stroke="#020617" strokeWidth="4">{text}</text>;
}

function DragHandle({ x, y, color = AMBER, onPointerDown }) {
  return (
    <circle cx={x} cy={y} r="16" fill={color} opacity="0.28" style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
      <animate attributeName="r" values="13;18;13" dur="1.8s" repeatCount="indefinite" />
    </circle>
  );
}

// ─── WIDGET 1: Curves (open / closed / simple) and Polygons (sides, vertices, diagonals) ───
const CURVES = {
  open: 'M 80 260 C 160 80, 260 320, 330 170 S 480 60, 530 200',
  closed: 'M 300 60 C 430 50, 520 150, 470 250 C 420 340, 220 330, 150 270 C 70 200, 170 70, 300 60 Z',
  crossing: 'M 300 180 C 380 60, 520 80, 500 180 C 480 290, 370 280, 300 180 C 230 80, 110 70, 100 180 C 90 290, 230 300, 300 180 Z',
};
const POLYGON_NAMES = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon' };
const WOBBLE = [1, 0.84, 1.08, 0.9, 1.04, 0.8, 1.1, 0.88, 1, 0.92];

export function Class6CurvesPolygonsWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const fillRef = useRef(null);
  const strokeRef = useRef(null);
  const [s, update] = useSceneState(
    { mode: 'curves', curve: 'open', regions: false, probe: [300, 190], n: 5, irregular: false, diagonals: 'none', highlight: null, task: null },
    visual
  );
  const draw = useReplay(`${s.mode}-${s.curve}-${s.n}`);
  const [where, setWhere] = useState(null);

  const dragProps = useSvgDrag(svgRef, (x, y) => update({ probe: [clamp(x, 10, W - 10), clamp(y, 10, H - 10)] }));

  // Where is the probe: inside, on the boundary, or outside the closed curve?
  useEffect(() => {
    if (s.mode !== 'curves' || s.curve !== 'closed' || !fillRef.current) { setWhere(null); return; }
    const pt = new DOMPoint(s.probe[0], s.probe[1]);
    let w = 'exterior';
    if (strokeRef.current?.isPointInStroke?.(pt)) w = 'boundary';
    else if (fillRef.current.isPointInFill?.(pt)) w = 'interior';
    setWhere(w);
    if (s.task && s.task === w) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.probe, s.mode, s.curve, s.task]);

  const n = s.n;
  const cx = 300;
  const cy = 190;
  const verts = Array.from({ length: n }, (_, k) => polar(cx, cy, 140 * (s.irregular ? WOBBLE[k] : 1), -90 - 180 / n + (k * 360) / n));
  const diagonals = [];
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) diagonals.push([i, j]);
  const shownDiagonals = s.diagonals === 'all' ? diagonals : s.diagonals === 'fromA' ? diagonals.filter(([i]) => i === 0) : [];
  const total = (n * (n - 3)) / 2;

  const curveText = {
    open: 'An open curve does not end where it began, like a loose kite string.',
    closed: 'A closed curve ends where it began. A simple closed curve never crosses itself.',
    crossing: 'This closed curve crosses itself, so it is NOT a simple closed curve.',
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Curves and Polygons"
      title={s.mode === 'curves' ? 'Curves: open or closed?' : `${POLYGON_NAMES[n]}: ${n} sides`}
      footer={
        <div className="space-y-3">
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'curves', label: 'Curves' }, { value: 'polygon', label: 'Polygons' }]} />
          {s.mode === 'curves' ? (
            <>
              <ModePills value={s.curve} onChange={(curve) => update({ curve })} options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Simple closed' }, { value: 'crossing', label: 'Crosses itself' }]} />
              {s.task && <TaskBanner text={`Your turn: drag the white probe into the ${s.task} of the curve.`} done={where === s.task} />}
              <p className="text-sm text-slate-300">
                {curveText[s.curve]}
                {where && <> The probe is in the <strong className={where === 'interior' ? 'text-emerald-300' : where === 'boundary' ? 'text-amber-300' : 'text-sky-300'}>{where}</strong>.</>}
              </p>
            </>
          ) : (
            <>
              <label className="block text-xs text-slate-400">
                Number of sides: <span className="text-amber-300 font-mono font-bold">{n}</span>
                <input type="range" min="3" max="10" value={n} onChange={(e) => update({ n: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <div className="flex flex-wrap gap-2">
                <ModePills value={s.diagonals} onChange={(diagonals) => update({ diagonals })} options={[{ value: 'none', label: 'No diagonals' }, { value: 'fromA', label: 'Diagonals from A' }, { value: 'all', label: 'All diagonals' }]} />
                <button onClick={() => update({ irregular: !s.irregular })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">{s.irregular ? 'Make regular' : 'Make irregular'}</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Readout label="Sides" value={n} tone="text-amber-300" />
                <Readout label="Vertices" value={n} tone="text-pink-300" />
                <Readout label="Diagonals" value={s.diagonals === 'none' ? '?' : (s.diagonals === 'fromA' ? `${n - 3} from A` : total)} tone="text-sky-300" />
              </div>
              {s.diagonals !== 'none' && (
                <p className="text-sm text-slate-300 font-mono">From one vertex: {n} − 3 = {n - 3} diagonals. All vertices: {n} × {n - 3} = {n * (n - 3)}, but each diagonal is counted twice → {n * (n - 3)} ÷ 2 = <strong className="text-sky-300">{total}</strong></p>
              )}
            </>
          )}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps}>
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'curves' ? (
          <g>
            {s.curve === 'closed' && s.regions && (
              <g>
                <path d={CURVES.closed} fill={GREEN} opacity="0.16" />
                <text x="300" y="195" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="800" fontFamily="sans-serif">interior</text>
                <text x="40" y="40" fill={SKY} fontSize="18" fontWeight="800" fontFamily="sans-serif">exterior</text>
                <text x="478" y="300" fill={AMBER} fontSize="16" fontWeight="800" fontFamily="sans-serif">boundary</text>
              </g>
            )}
            <path ref={fillRef} d={CURVES[s.curve]} fill="transparent" stroke="none" />
            <path ref={strokeRef} d={CURVES[s.curve]} fill="none" stroke="transparent" strokeWidth="14" />
            <path d={CURVES[s.curve]} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} fill="none" stroke={s.curve === 'crossing' ? PINK : AMBER} strokeWidth="5" strokeLinecap="round" />
            {s.curve === 'open' && draw > 0.98 && (
              <g>
                <Dot x={80} y={260} label="start" dx={-20} dy={24} color={SKY} />
                <Dot x={530} y={200} label="end" dx={-10} dy={26} color={PINK} />
              </g>
            )}
            {s.curve === 'crossing' && draw > 0.98 && <Dot x={300} y={180} label="crosses here!" dx={-50} dy={-14} color={RED} pulse />}
            {s.curve === 'closed' && (
              <g style={{ cursor: 'grab' }} onPointerDown={dragProps.onPointerDown}>
                <circle cx={s.probe[0]} cy={s.probe[1]} r="18" fill="white" opacity="0.15" />
                <circle cx={s.probe[0]} cy={s.probe[1]} r="7" fill="white" />
              </g>
            )}
          </g>
        ) : (
          <g>
            <polygon points={pts(verts)} fill={AMBER} opacity="0.08" />
            {verts.map((v, i) => {
              const w = verts[(i + 1) % n];
              const len = dist(v, w);
              return (
                <line key={`s${i}`} x1={v[0]} y1={v[1]} x2={v[0] + (w[0] - v[0]) * draw} y2={v[1] + (w[1] - v[1]) * draw}
                  stroke={s.highlight === 'sides' ? AMBER : INK} strokeWidth={s.highlight === 'sides' ? 6 : 4} strokeLinecap="round" opacity={len ? 1 : 0}>
                  {s.highlight === 'sides' && <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />}
                </line>
              );
            })}
            {diagonals.map(([i, j], k) => {
              const on = shownDiagonals.some(([a, b]) => a === i && b === j);
              return (
                <line key={`d${i}-${j}`} x1={verts[i][0]} y1={verts[i][1]} x2={verts[j][0]} y2={verts[j][1]}
                  stroke={s.diagonals === 'fromA' ? AMBER : SKY} strokeWidth="2.5" strokeDasharray="7 5"
                  style={{ opacity: on ? 1 : 0, transition: 'opacity 400ms ease', transitionDelay: on ? `${k * 140}ms` : '0ms' }} />
              );
            })}
            {verts.map((v, i) => {
              const [lx, ly] = polar(cx, cy, 140 * (s.irregular ? WOBBLE[i] : 1) + 24, -90 - 180 / n + (i * 360) / n);
              return (
                <g key={`v${i}`}>
                  <circle cx={v[0]} cy={v[1]} r={s.highlight === 'vertices' ? 9 : 6} fill={s.highlight === 'vertices' ? PINK : AMBER}>
                    {s.highlight === 'vertices' && <animate attributeName="r" values="7;11;7" dur="1.2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={lx} y={ly + 6} textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="800" fontFamily="sans-serif">{LETTERS[i]}</text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Triangle lab (drag the corners; classify by sides and by angles) ───
const TRIANGLE_PRESETS = {
  equilateral: [[180, 290], [420, 290], [300, 82]],
  isosceles: [[200, 290], [400, 290], [300, 80]],
  scalene: [[150, 290], [450, 290], [230, 120]],
  right: [[180, 290], [420, 290], [180, 110]],
  obtuse: [[120, 290], [330, 290], [470, 150]],
  acute: [[180, 290], [440, 290], [280, 100]],
};

function classifyTriangle(P) {
  const sides = [dist(P[1], P[2]), dist(P[2], P[0]), dist(P[0], P[1])].map((d) => +cm(d));
  const a = round(angleAt(P[0], P[1], P[2]));
  const b = round(angleAt(P[1], P[2], P[0]));
  const angles = [a, b, 180 - a - b];
  const eq = (x, y) => Math.abs(x - y) < 0.05;
  const equalPairs = [eq(sides[0], sides[1]), eq(sides[1], sides[2]), eq(sides[2], sides[0])].filter(Boolean).length;
  const bySides = equalPairs === 3 ? 'Equilateral' : equalPairs >= 1 ? 'Isosceles' : 'Scalene';
  const big = Math.max(...angles);
  const byAngles = big === 90 ? 'Right-angled' : big > 90 ? 'Obtuse-angled' : 'Acute-angled';
  return { sides, angles, bySides, byAngles };
}

export function Class6TriangleLabWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ preset: 'scalene', P: null, show: 'both', task: null }, visual);
  const [drag, setDrag] = useState(null);
  const target = s.P || TRIANGLE_PRESETS[s.preset];
  const P = useMorph(target, 900);
  const info = classifyTriangle(target);

  useEffect(() => {
    if (!s.task) return;
    if (info.bySides === s.task || info.byAngles === s.task) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.bySides, info.byAngles, s.task]);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (drag === null) return;
    const next = target.map((p) => [...p]);
    next[drag] = [clamp(x, 30, W - 30), clamp(y, 30, H - 30)];
    update({ P: next });
  });

  // Group equal sides so they get the same number of tick marks
  const tickCounts = [0, 0, 0];
  if (info.bySides === 'Equilateral') tickCounts.fill(1);
  else if (info.bySides === 'Isosceles') {
    const [x, y, z] = info.sides;
    if (Math.abs(x - y) < 0.05) { tickCounts[0] = 1; tickCounts[1] = 1; } else if (Math.abs(y - z) < 0.05) { tickCounts[1] = 1; tickCounts[2] = 1; } else { tickCounts[2] = 1; tickCounts[0] = 1; }
  }
  const sideEnds = [[P[1], P[2]], [P[2], P[0]], [P[0], P[1]]];
  const angleColors = [GREEN, SKY, PINK];
  const showSides = s.show !== 'angles';
  const showAngles = s.show !== 'sides';

  return (
    <StoryStage
      eyebrow="Triangle Lab · drag any corner"
      title={`${info.bySides} · ${info.byAngles}`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(TRIANGLE_PRESETS).map((k) => (
              <button key={k} onClick={() => update({ preset: k, P: null })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${s.preset === k && !s.P ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{k}</button>
            ))}
          </div>
          {s.task && <TaskBanner text={`Your turn: drag the corners to make a ${s.task.toLowerCase()} triangle.`} done={info.bySides === s.task || info.byAngles === s.task} />}
          <div className="flex flex-wrap gap-2">
            <Readout label="By sides" value={<span className="text-sm">{info.bySides}</span>} tone="text-amber-300" />
            <Readout label="By angles" value={<span className="text-sm">{info.byAngles}</span>} tone="text-sky-300" />
            <Readout label="Angle sum" value={`${info.angles.join(' + ')} = 180°`} tone="text-emerald-300" />
          </div>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDrag(null); }}>
        <rect width={W} height={H} fill="#020617" />
        <polygon points={pts(P)} fill={AMBER} opacity="0.1" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {showAngles && P.map((v, i) => {
          const { start, sweep } = interiorArc(v, P[(i + 1) % 3], P[(i + 2) % 3]);
          const isRight = info.angles[i] === 90;
          return (
            <g key={`a${i}`}>
              {isRight
                ? <RightAngleMark cx={v[0]} cy={v[1]} deg={start} size={20} color={angleColors[i]} />
                : <path d={sectorPath(v[0], v[1], 30, start, start + sweep)} fill={angleColors[i]} opacity="0.35" />}
              <AngleLabel P={v} start={start} sweep={sweep} text={`${info.angles[i]}°`} color={angleColors[i]} r={isRight ? 40 : 54} />
            </g>
          );
        })}
        {showSides && sideEnds.map(([a, b], i) => {
          const [mx, my] = mid(a, b);
          const c = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
          const away = Math.hypot(mx - c[0], my - c[1]) || 1;
          return (
            <g key={`s${i}`}>
              <SideTicks a={a} b={b} count={tickCounts[i]} />
              <text x={mx + ((mx - c[0]) / away) * 26} y={my + ((my - c[1]) / away) * 26 + 5} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="800" fontFamily="monospace">{info.sides[i]} cm</text>
            </g>
          );
        })}
        {P.map((v, i) => (
          <g key={`h${i}`}>
            <Dot x={v[0]} y={v[1]} r={5} label={LETTERS[i]} dx={i === 2 ? -6 : (i === 0 ? -22 : 10)} dy={i === 2 ? -14 : 22} />
            <DragHandle x={v[0]} y={v[1]} onPointerDown={(e) => { setDrag(i); dragProps.onPointerDown(e); }} />
          </g>
        ))}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Proof lab: triangle angles add to 180° (tear the corners), quadrilateral to 360° ───
export function Class6AngleSumProofWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({
    mode: 'triangle', step: 0,
    T: [[130, 240], [470, 240], [250, 60]],
    Q: [[120, 270], [470, 290], [430, 90], [190, 60]],
  }, visual);
  const [drag, setDrag] = useState(null);
  const tear = useTween(s.mode === 'triangle' && s.step >= 1 ? 1 : 0, 2200);
  const diag = useTween(s.mode === 'quad' && s.step >= 1 ? 1 : 0, 1200);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (drag === null) return;
    const key = s.mode === 'triangle' ? 'T' : 'Q';
    const next = s[key].map((p) => [...p]);
    next[drag] = [clamp(x, 30, W - 30), clamp(y, 30, s.mode === 'triangle' ? 270 : H - 30)];
    update({ [key]: next });
    onInteract?.();
  });

  const T = s.T;
  const tri = T.map((v, i) => ({ v, ...interiorArc(v, T[(i + 1) % 3], T[(i + 2) % 3]) }));
  const [A, B] = tri.map((t) => round(t.sweep));
  const Cfix = 180 - A - B;
  const colors = [GREEN, SKY, PINK];
  // Where each torn corner lands on the straight line at P: A on the left, C in the middle, B on the right
  const Pt = [300, 325];
  const targets = [180 - tri[0].sweep, 0, tri[1].sweep];

  const Q = s.Q;
  const quadAngles = Q.map((v, i) => interiorArc(v, Q[(i + 1) % 4], Q[(i + 3) % 4]));
  const qa = quadAngles.map((q) => round(q.sweep));
  const qColors = [GREEN, SKY, PINK, AMBER];

  const turn = (from, to, t) => {
    let d = normDeg(to - from);
    if (d > 180) d -= 360;
    return from + d * t;
  };

  return (
    <StoryStage
      eyebrow="Proof Lab · see it, then prove it"
      title={s.mode === 'triangle' ? 'Angles of a triangle add up to 180°' : 'Angles of a quadrilateral add up to 360°'}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ModePills value={s.mode} onChange={(mode) => update({ mode, step: 0 })} options={[{ value: 'triangle', label: 'Triangle' }, { value: 'quad', label: 'Quadrilateral' }]} />
            <button onClick={() => update({ step: s.step >= 2 ? 0 : s.step + 1 })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white">
              {s.step >= 2 ? '↺ Start again' : (s.mode === 'triangle' ? (s.step === 0 ? '✂ Tear the corners' : 'Show the proof') : (s.step === 0 ? 'Draw a diagonal' : 'Show the proof'))}
            </button>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-sm space-y-1">
            {s.mode === 'triangle' ? (
              <>
                <div><span className="text-emerald-300">∠A = {A}°</span> + <span className="text-sky-300">∠B = {B}°</span> + <span className="text-pink-300">∠C = {Cfix}°</span> = <strong className="text-amber-300">180°</strong></div>
                {s.step >= 2 && <div className="text-slate-300 font-sans text-xs">The three torn corners fit together exactly on a straight line, and a straight angle is 180°. Drag any corner of the triangle: the corners still make a straight line.</div>}
              </>
            ) : (
              <>
                <div>{qa.map((a, i) => <span key={i} style={{ color: qColors[i] }}>{a}°{i < 3 ? ' + ' : ''}</span>)} = <strong className="text-amber-300">{qa.reduce((t, a) => t + a, 0)}°</strong></div>
                {s.step >= 2 && <div className="text-slate-300 font-sans text-xs">Diagonal AC cuts the quadrilateral into 2 triangles. Each triangle gives 180°, so 2 × 180° = 360°.</div>}
              </>
            )}
          </div>
          <p className="text-xs text-slate-500">Drag the corners to change the shape. The total never changes.</p>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDrag(null); }}>
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'triangle' ? (
          <g>
            <polygon points={pts(T)} fill={AMBER} opacity="0.08" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {/* the corner "holes" left behind after tearing */}
            {tri.map((t, i) => <path key={`h${i}`} d={sectorPath(t.v[0], t.v[1], 42, t.start, t.start + t.sweep)} fill="none" stroke={colors[i]} strokeWidth="1.5" strokeDasharray="4 4" opacity={tear} />)}
            {tear > 0.02 && (
              <g opacity={tear}>
                <line x1="60" y1={Pt[1]} x2={W - 60} y2={Pt[1]} stroke="#475569" strokeWidth="3" />
              </g>
            )}
            {tri.map((t, i) => {
              const x = t.v[0] + (Pt[0] - t.v[0]) * tear;
              const y = t.v[1] + (Pt[1] - t.v[1]) * tear;
              const start = turn(t.start, targets[i], tear);
              return (
                <g key={`c${i}`}>
                  <path d={sectorPath(x, y, 42, start, start + t.sweep)} fill={colors[i]} opacity="0.55" stroke={colors[i]} strokeWidth="2" />
                  <AngleLabel P={[x, y]} start={start} sweep={t.sweep} text={`${[A, B, Cfix][i]}°`} color={colors[i]} r={60} />
                </g>
              );
            })}
            {s.step >= 2 && tear > 0.98 && <text x={Pt[0]} y={H - 6} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="800" fontFamily="sans-serif">a straight line = 180°</text>}
            {T.map((v, i) => (
              <g key={`v${i}`}>
                <text x={v[0] + (i === 0 ? -24 : i === 1 ? 12 : -6)} y={v[1] + (i === 2 ? -14 : 6)} fill={INK} fontSize="16" fontWeight="800" fontFamily="sans-serif">{LETTERS[i]}</text>
                <DragHandle x={v[0]} y={v[1]} color={colors[i]} onPointerDown={(e) => { setDrag(i); dragProps.onPointerDown(e); }} />
              </g>
            ))}
          </g>
        ) : (
          <g>
            <polygon points={pts([Q[0], Q[1], Q[2]])} fill={GREEN} opacity={0.18 * diag} />
            <polygon points={pts([Q[0], Q[2], Q[3]])} fill={SKY} opacity={0.18 * diag} />
            <polygon points={pts(Q)} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <line x1={Q[0][0]} y1={Q[0][1]} x2={Q[0][0] + (Q[2][0] - Q[0][0]) * diag} y2={Q[0][1] + (Q[2][1] - Q[0][1]) * diag} stroke={AMBER} strokeWidth="3" strokeDasharray="8 6" />
            {quadAngles.map((q, i) => (
              <g key={`q${i}`}>
                <path d={sectorPath(Q[i][0], Q[i][1], 30, q.start, q.start + q.sweep)} fill={qColors[i]} opacity="0.4" />
                <AngleLabel P={Q[i]} start={q.start} sweep={q.sweep} text={`${qa[i]}°`} color={qColors[i]} r={52} />
              </g>
            ))}
            {s.step >= 2 && (
              <g fontFamily="sans-serif" fontWeight="800" fontSize="15">
                <text x={(Q[0][0] + Q[1][0] + Q[2][0]) / 3} y={(Q[0][1] + Q[1][1] + Q[2][1]) / 3 + 5} textAnchor="middle" fill={GREEN}>180°</text>
                <text x={(Q[0][0] + Q[2][0] + Q[3][0]) / 3} y={(Q[0][1] + Q[2][1] + Q[3][1]) / 3 + 5} textAnchor="middle" fill={SKY}>180°</text>
              </g>
            )}
            {Q.map((v, i) => (
              <g key={`v${i}`}>
                <text x={v[0] + (i === 0 || i === 3 ? -24 : 12)} y={v[1] + (i >= 2 ? -10 : 20)} fill={INK} fontSize="16" fontWeight="800" fontFamily="sans-serif">{LETTERS[i]}</text>
                <DragHandle x={v[0]} y={v[1]} color={qColors[i]} onPointerDown={(e) => { setDrag(i); dragProps.onPointerDown(e); }} />
              </g>
            ))}
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: The quadrilateral family (shape morphs between members; property checklist) ───
const QUADS = {
  quadrilateral: { label: 'Quadrilateral', P: [[170, 280], [440, 300], [400, 110], [220, 80]], parallel: {}, ticks: [0, 0, 0, 0], right: false,
    props: ['4 sides, 4 vertices, 4 angles', 'No special rules', 'Angles add up to 360°'] },
  trapezium: { label: 'Trapezium', P: [[140, 280], [460, 280], [380, 110], [220, 110]], parallel: { 0: 1, 2: 1 }, ticks: [0, 0, 0, 0], right: false,
    props: ['Exactly one pair of parallel sides', 'Like a bucket or a handbag'] },
  parallelogram: { label: 'Parallelogram', P: [[150, 280], [390, 280], [450, 110], [210, 110]], parallel: { 0: 1, 2: 1, 1: 2, 3: 2 }, ticks: [1, 2, 1, 2], right: false,
    props: ['Both pairs of opposite sides parallel', 'Opposite sides equal', 'Opposite angles equal'] },
  rectangle: { label: 'Rectangle', P: [[170, 280], [430, 280], [430, 110], [170, 110]], parallel: { 0: 1, 2: 1, 1: 2, 3: 2 }, ticks: [1, 2, 1, 2], right: true, diagonals: 'equal',
    props: ['A parallelogram with all angles 90°', 'Opposite sides equal', 'Diagonals are equal'] },
  rhombus: { label: 'Rhombus', P: [[170, 280], [370, 280], [470, 107], [270, 107]], parallel: { 0: 1, 2: 1, 1: 2, 3: 2 }, ticks: [1, 1, 1, 1], right: false, diagonals: 'perpendicular',
    props: ['A parallelogram with all sides equal', 'Diagonals cut each other at 90°'] },
  square: { label: 'Square', P: [[200, 290], [400, 290], [400, 90], [200, 90]], parallel: { 0: 1, 2: 1, 1: 2, 3: 2 }, ticks: [1, 1, 1, 1], right: true, diagonals: 'both',
    props: ['All sides equal AND all angles 90°', 'It is a rectangle AND a rhombus', 'Diagonals equal and cut at 90°'] },
  kite: { label: 'Kite', P: [[300, 305], [410, 160], [300, 60], [190, 160]], parallel: {}, ticks: [1, 2, 2, 1], right: false, diagonals: 'perpendicular',
    props: ['Two pairs of equal sides next to each other', 'Diagonals cut at 90°', 'Exactly like Disha\'s patang!'] },
};
const FAMILY_ROWS = [['quadrilateral'], ['trapezium', 'parallelogram', 'kite'], ['rectangle', 'rhombus'], ['square']];
const ANCESTORS = {
  quadrilateral: ['quadrilateral'],
  trapezium: ['quadrilateral', 'trapezium'],
  parallelogram: ['quadrilateral', 'parallelogram'],
  kite: ['quadrilateral', 'kite'],
  rectangle: ['quadrilateral', 'parallelogram', 'rectangle'],
  rhombus: ['quadrilateral', 'parallelogram', 'rhombus'],
  square: ['quadrilateral', 'parallelogram', 'rectangle', 'rhombus', 'square'],
};

export function Class6QuadFamilyWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ shape: 'quadrilateral', showDiagonals: false, task: null }, visual);
  const q = QUADS[s.shape];
  const P = useMorph(q.P, 1300);
  const settled = dist(P[0], q.P[0]) < 1 && dist(P[2], q.P[2]) < 1;

  useEffect(() => {
    if (s.task && s.shape === s.task) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.shape, s.task]);

  const center = mid(P[0], P[2]);

  return (
    <StoryStage
      eyebrow="Visualizer · The Quadrilateral Family"
      title={q.label}
      footer={
        <div className="space-y-3">
          {s.task && <TaskBanner text={`Your turn: tap the family tree to find the ${QUADS[s.task].label.toLowerCase()}.`} done={s.shape === s.task} />}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2">
            {FAMILY_ROWS.map((row, r) => (
              <div key={r} className="flex justify-center gap-2 flex-wrap">
                {row.map((k) => {
                  const lit = ANCESTORS[s.shape].includes(k);
                  return (
                    <button key={k} onClick={() => update({ shape: k })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${k === s.shape ? 'bg-amber-500 text-black border-amber-400' : lit ? 'bg-amber-500/15 text-amber-200 border-amber-500/50' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                      {QUADS[k].label}
                    </button>
                  );
                })}
              </div>
            ))}
            <p className="text-[11px] text-slate-500 text-center">Highlighted boxes = every family name this shape also belongs to.</p>
          </div>
          <ul className="text-sm text-slate-300 space-y-0.5">
            {q.props.map((p) => <li key={p}>✔ {p}</li>)}
          </ul>
          <button onClick={() => update({ showDiagonals: !s.showDiagonals })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">{s.showDiagonals ? 'Hide diagonals' : 'Show diagonals'}</button>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <polygon points={pts(P)} fill={AMBER} opacity="0.1" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {settled && (
          <g>
            {P.map((a, i) => <ParallelMarks key={`p${i}`} a={a} b={P[(i + 1) % 4]} count={q.parallel[i] || 0} at={0.36} />)}
            {P.map((a, i) => <SideTicks key={`t${i}`} a={a} b={P[(i + 1) % 4]} count={q.ticks[i]} color={PINK} at={q.parallel[i] ? 0.64 : 0.5} />)}
            {q.right && P.map((v, i) => <RightAngleMark key={`r${i}`} cx={v[0]} cy={v[1]} deg={interiorArc(v, P[(i + 1) % 4], P[(i + 3) % 4]).start} size={18} color={GREEN} />)}
          </g>
        )}
        {s.showDiagonals && (
          <g>
            <line x1={P[0][0]} y1={P[0][1]} x2={P[2][0]} y2={P[2][1]} stroke={SKY} strokeWidth="2.5" strokeDasharray="7 5" />
            <line x1={P[1][0]} y1={P[1][1]} x2={P[3][0]} y2={P[3][1]} stroke={SKY} strokeWidth="2.5" strokeDasharray="7 5" />
            {settled && q.diagonals && (
              <text x={center[0]} y={H - 12} textAnchor="middle" fill={SKY} fontSize="14" fontWeight="800" fontFamily="sans-serif">
                {{ equal: 'diagonals are equal', perpendicular: 'diagonals cut at 90°', both: 'diagonals equal and cut at 90°' }[q.diagonals]}
              </text>
            )}
          </g>
        )}
        {P.map((v, i) => <Dot key={`v${i}`} x={v[0]} y={v[1]} r={5} />)}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Circle anatomy (and the Ashoka Chakra) ───
const CIRCLE_PARTS = ['centre', 'radius', 'diameter', 'chord', 'arc', 'sector', 'segment', 'circumference'];
const PART_TEXT = {
  centre: 'The centre O is the fixed point. Every point on the circle is the same distance from it.',
  radius: 'A radius joins the centre to any point on the circle. All radii of a circle are equal.',
  diameter: 'A diameter passes through the centre. Diameter = 2 × radius.',
  chord: 'A chord joins any two points on the circle. Drag P or Q: the longest chord is the diameter.',
  arc: 'An arc is a part of the circle. The short one is the minor arc, the long one the major arc.',
  sector: 'A sector is the region between two radii and an arc, like a slice of pizza.',
  segment: 'A segment is the region between a chord and its arc.',
  circumference: 'The circumference is the whole boundary of the circle: the distance all the way round.',
};

export function Class6CircleAnatomyWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ part: 'centre', p: 40, q: 140, chakra: false, task: null }, visual);
  const [drag, setDrag] = useState(null);
  const pA = useTween(s.p, 1000);
  const qA = useTween(s.q, 1000);
  const ring = useReplay(`${s.part}-${s.chakra}`, 1600);
  const cx = 300;
  const cy = 185;
  const R = 140;
  const P = polar(cx, cy, R, pA);
  const Q = polar(cx, cy, R, qA);
  const chordLen = dist(P, Q);
  const isDiameter = Math.abs(normDeg(s.q - s.p) - 180) < 2;

  useEffect(() => {
    if (s.task === 'diameter' && s.part === 'chord' && isDiameter) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDiameter, s.task, s.part]);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (!drag) return;
    let d = round(dirDeg([cx, cy], [x, y]));
    const other = drag === 'p' ? s.q : s.p;
    if (Math.abs(normDeg(d - other) - 180) < 4) d = normDeg(other + 180); // snap to a diameter
    update({ [drag]: d });
  });

  const d = normDeg(qA - pA);
  const [m1, m2] = d <= 180 ? [pA, pA + d] : [qA, qA + (360 - d)];
  const show = (part) => s.part === part || s.part === 'all';
  const opposite = polar(cx, cy, R, pA + 180);

  return (
    <StoryStage
      eyebrow="Visualizer · Parts of a Circle"
      title={s.chakra ? 'The Ashoka Chakra: 24 spokes' : s.part === 'all' ? 'All the parts of a circle' : `The ${s.part}`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {CIRCLE_PARTS.map((k) => (
              <button key={k} onClick={() => update({ part: k, chakra: false })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${s.part === k && !s.chakra ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{k}</button>
            ))}
            <button onClick={() => update({ chakra: !s.chakra })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${s.chakra ? 'border-sky-400 text-sky-300 bg-sky-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>Ashoka Chakra</button>
          </div>
          {s.task === 'diameter' && <TaskBanner text="Your turn: drag P or Q to make the longest possible chord." done={s.part === 'chord' && isDiameter} />}
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Radius" value={`${cm(R)} cm`} tone="text-amber-300" />
            <Readout label="Diameter" value={`${cm(2 * R)} cm`} tone="text-pink-300" />
            {s.part === 'chord' && <Readout label="Chord PQ" value={`${cm(chordLen)} cm`} tone={isDiameter ? 'text-emerald-300' : 'text-sky-300'} />}
            <p className="text-sm text-slate-300 flex-1 min-w-[200px]">{s.chakra ? 'Our national flag has the Ashoka Chakra with 24 equally spaced spokes. They are radii! The angle between two spokes is 360° ÷ 24 = 15°.' : PART_TEXT[s.part] || 'Tap a part to explore it.'}</p>
          </div>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDrag(null); }}>
        <rect width={W} height={H} fill="#020617" />
        {s.chakra ? (
          <g>
            <circle cx={cx} cy={cy} r={R} fill="#f8fafc" opacity="0.06" />
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3b82f6" strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ring} />
            {Array.from({ length: 24 }, (_, i) => {
              const [x, y] = polar(cx, cy, R * ring, i * 15);
              return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#3b82f6" strokeWidth={i < 2 ? 4 : 2.5} />;
            })}
            <path d={sectorPath(cx, cy, 70, 0, 15)} fill={AMBER} opacity={0.5 * ring} />
            <text x={polar(cx, cy, 95, 7)[0]} y={polar(cx, cy, 95, 7)[1] + 5} fill={AMBER} fontSize="16" fontWeight="900" fontFamily="monospace" opacity={ring}>15°</text>
            <circle cx={cx} cy={cy} r="12" fill="#3b82f6" />
          </g>
        ) : (
          <g>
            {show('sector') && <path d={sectorPath(cx, cy, R, m1, m2)} fill={PINK} opacity="0.3" />}
            {show('segment') && <path d={`${arcPath(cx, cy, R, m1, m2)} Z`} fill={PURPLE} opacity="0.35" />}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#475569" strokeWidth="3" />
            {show('circumference') && <circle cx={cx} cy={cy} r={R} fill="none" stroke={AMBER} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ring} transform={`rotate(-90 ${cx} ${cy})`} />}
            {show('arc') && (
              <g>
                <path d={arcPath(cx, cy, R, m1, m2)} fill="none" stroke={GREEN} strokeWidth="7" strokeLinecap="round" />
                <path d={arcPath(cx, cy, R, m2, m1 + 360)} fill="none" stroke={SKY} strokeWidth="3" strokeDasharray="8 6" />
                <text x={polar(cx, cy, R + 24, (m1 + m2) / 2)[0]} y={polar(cx, cy, R + 24, (m1 + m2) / 2)[1] + 5} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="800" fontFamily="sans-serif">minor arc</text>
                <text x={polar(cx, cy, R + 26, (m1 + m2) / 2 + 180)[0]} y={polar(cx, cy, R + 26, (m1 + m2) / 2 + 180)[1] + 5} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily="sans-serif">major arc</text>
              </g>
            )}
            {show('radius') && <line x1={cx} y1={cy} x2={P[0]} y2={P[1]} stroke={AMBER} strokeWidth="4" strokeLinecap="round" />}
            {(show('sector')) && <><line x1={cx} y1={cy} x2={P[0]} y2={P[1]} stroke={PINK} strokeWidth="3" /><line x1={cx} y1={cy} x2={Q[0]} y2={Q[1]} stroke={PINK} strokeWidth="3" /></>}
            {show('diameter') && <line x1={opposite[0]} y1={opposite[1]} x2={P[0]} y2={P[1]} stroke={PINK} strokeWidth="4" strokeLinecap="round" />}
            {(show('chord') || show('segment')) && <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke={isDiameter ? GREEN : SKY} strokeWidth="4" strokeLinecap="round" />}
            {s.part === 'chord' && isDiameter && <text x={cx} y={H - 8} textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily="sans-serif">Through the centre: this chord is a diameter, the longest chord!</text>}
            <Dot x={cx} y={cy} r={6} label="O" dx={-20} dy={-6} pulse={s.part === 'centre'} />
            <Dot x={P[0]} y={P[1]} r={6} label="P" dx={P[0] >= cx ? 12 : -24} dy={-8} color={PINK} />
            {['chord', 'arc', 'sector', 'segment', 'all'].includes(s.part) && <Dot x={Q[0]} y={Q[1]} r={6} label="Q" dx={Q[0] >= cx ? 12 : -24} dy={-8} color={SKY} />}
            <DragHandle x={P[0]} y={P[1]} color={PINK} onPointerDown={(e) => { setDrag('p'); dragProps.onPointerDown(e); }} />
            {['chord', 'arc', 'sector', 'segment', 'all'].includes(s.part) && <DragHandle x={Q[0]} y={Q[1]} color={SKY} onPointerDown={(e) => { setDrag('q'); dragProps.onPointerDown(e); }} />}
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: 3D shapes: rotating solids; count faces, edges, vertices; Euler's formula ───
const box = (sx, sy, sz) => ({
  V: [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, sy, -sz], [-sx, sy, -sz], [-sx, -sy, sz], [sx, -sy, sz], [sx, sy, sz], [-sx, sy, sz]],
  F: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4]],
});
const SOLIDS = {
  cube: { label: 'Cube', example: 'a dice 🎲', ...box(1, 1, 1) },
  cuboid: { label: 'Cuboid', example: 'a Diwali gift box 🎁', ...box(1.5, 0.8, 0.9) },
  pyramid: { label: 'Square pyramid', example: 'the Great Pyramid of Giza', V: [[-1, -0.9, -1], [1, -0.9, -1], [1, -0.9, 1], [-1, -0.9, 1], [0, 1.1, 0]], F: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]] },
  prism: { label: 'Triangular prism', example: 'a tent ⛺', V: [[-1.1, -0.8, -1.3], [1.1, -0.8, -1.3], [0, 1, -1.3], [-1.1, -0.8, 1.3], [1.1, -0.8, 1.3], [0, 1, 1.3]], F: [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]] },
  cylinder: { label: 'Cylinder', example: 'a cricket stump base, a gas cylinder', curved: true, counts: { F: '3 (2 flat + 1 curved)', E: '2 (curved)', V: 0 } },
  cone: { label: 'Cone', example: 'an ice-cream cone 🍦', curved: true, counts: { F: '2 (1 flat + 1 curved)', E: '1 (curved)', V: 1 } },
  sphere: { label: 'Sphere', example: 'a cricket ball 🏏', curved: true, counts: { F: '1 (curved)', E: 0, V: 0 } },
};
const FACE_COLORS = [AMBER, SKY, GREEN, PINK, PURPLE, RED];

function edgesOf(F) {
  const set = new Map();
  F.forEach((f) => f.forEach((a, i) => {
    const b = f[(i + 1) % f.length];
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!set.has(k)) set.set(k, [Math.min(a, b), Math.max(a, b)]);
  }));
  return [...set.values()];
}

export function Class6SolidsWidget({ visual }) {
  const [s, update] = useSceneState({ solid: 'cube', count: null, euler: false }, visual);
  const [angles, setAngles] = useState({ yaw: 30, pitch: 22 });
  const dragRef = useRef(null);
  const solid = SOLIDS[s.solid];

  // Gentle automatic spin unless the learner is turning it
  useEffect(() => {
    if (solid.curved) return undefined;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      if (!dragRef.current) setAngles((a) => ({ ...a, yaw: (a.yaw + ((now - last) / 1000) * 18) % 360 }));
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [solid.curved]);

  const onDown = (e) => { dragRef.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setAngles((a) => ({ yaw: a.yaw + dx * 0.6, pitch: clamp(a.pitch + dy * 0.4, -60, 60) }));
  };
  const onUp = () => { dragRef.current = null; };

  const cx = 300;
  const cy = 185;
  const scale = 92;
  let counts;
  let body;

  if (!solid.curved) {
    const yaw = (angles.yaw * Math.PI) / 180;
    const pitch = (angles.pitch * Math.PI) / 180;
    const proj = solid.V.map(([x, y, z]) => {
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
      const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
      const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
      const depth = y * Math.sin(pitch) + z1 * Math.cos(pitch);
      return { x: cx + x1 * scale, y: cy - y2 * scale, depth };
    });
    const E = edgesOf(solid.F);
    counts = { F: solid.F.length, E: E.length, V: solid.V.length };
    const faces = solid.F.map((f, i) => ({ f, i, depth: f.reduce((t, k) => t + proj[k].depth, 0) / f.length })).sort((a, b) => a.depth - b.depth);
    body = (
      <g>
        {faces.map(({ f, i }) => (
          <polygon key={`f${i}`} points={f.map((k) => `${proj[k].x},${proj[k].y}`).join(' ')}
            fill={s.count === 'faces' ? FACE_COLORS[i % FACE_COLORS.length] : SKY} opacity={s.count === 'faces' ? 0.32 : 0.07} stroke="none" />
        ))}
        {E.map(([a, b], i) => (
          <line key={`e${i}`} x1={proj[a].x} y1={proj[a].y} x2={proj[b].x} y2={proj[b].y}
            stroke={s.count === 'edges' ? AMBER : INK} strokeWidth={s.count === 'edges' ? 4 : 2.5} strokeLinecap="round" />
        ))}
        {proj.map((p, i) => <circle key={`v${i}`} cx={p.x} cy={p.y} r={s.count === 'vertices' ? 8 : 4} fill={s.count === 'vertices' ? PINK : INK} />)}
        {/* Numbered labels appear one by one, as if counting aloud */}
        <g key={`${s.count}-${s.solid}`}>
          {s.count === 'faces' && faces.map(({ f, i }, order) => {
            const c = f.reduce((t, k) => [t[0] + proj[k].x / f.length, t[1] + proj[k].y / f.length], [0, 0]);
            return <text key={i} x={c[0]} y={c[1] + 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif" style={{ opacity: 0, animation: `fadeIn 300ms ease ${order * 400}ms forwards` }}>{i + 1}</text>;
          })}
          {s.count === 'edges' && E.map(([a, b], i) => (
            <text key={i} x={(proj[a].x + proj[b].x) / 2} y={(proj[a].y + proj[b].y) / 2 - 6} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily="sans-serif" paintOrder="stroke" stroke="#020617" strokeWidth="4" style={{ opacity: 0, animation: `fadeIn 300ms ease ${i * 300}ms forwards` }}>{i + 1}</text>
          ))}
          {s.count === 'vertices' && proj.map((p, i) => (
            <text key={i} x={p.x + 12} y={p.y - 10} fill={PINK} fontSize="15" fontWeight="900" fontFamily="sans-serif" paintOrder="stroke" stroke="#020617" strokeWidth="4" style={{ opacity: 0, animation: `fadeIn 300ms ease ${i * 400}ms forwards` }}>{i + 1}</text>
          ))}
        </g>
      </g>
    );
  } else {
    counts = solid.counts;
    const hl = (part) => s.count === part;
    if (s.solid === 'cylinder') {
      body = (
        <g>
          <rect x={210} y={95} width={180} height={190} fill={hl('faces') ? PURPLE : SKY} opacity={hl('faces') ? 0.3 : 0.07} />
          <ellipse cx={300} cy={95} rx={90} ry={26} fill={hl('faces') ? AMBER : SKY} opacity={hl('faces') ? 0.45 : 0.1} stroke={hl('edges') ? AMBER : INK} strokeWidth={hl('edges') ? 5 : 2.5} />
          <path d="M 210 285 A 90 26 0 0 0 390 285" fill="none" stroke={hl('edges') ? AMBER : INK} strokeWidth={hl('edges') ? 5 : 2.5} />
          <path d="M 210 285 A 90 26 0 0 1 390 285" fill="none" stroke={hl('edges') ? AMBER : INK} strokeWidth="2" strokeDasharray="6 5" opacity="0.6" />
          <line x1={210} y1={95} x2={210} y2={285} stroke={INK} strokeWidth="2.5" />
          <line x1={390} y1={95} x2={390} y2={285} stroke={INK} strokeWidth="2.5" />
        </g>
      );
    } else if (s.solid === 'cone') {
      body = (
        <g>
          <polygon points="300,60 205,280 395,280" fill={hl('faces') ? PURPLE : SKY} opacity={hl('faces') ? 0.3 : 0.07} />
          <path d="M 205 280 A 95 26 0 0 0 395 280" fill={hl('faces') ? AMBER : 'none'} fillOpacity="0.4" stroke={hl('edges') ? AMBER : INK} strokeWidth={hl('edges') ? 5 : 2.5} />
          <path d="M 205 280 A 95 26 0 0 1 395 280" fill="none" stroke={hl('edges') ? AMBER : INK} strokeWidth="2" strokeDasharray="6 5" opacity="0.6" />
          <line x1={300} y1={60} x2={205} y2={280} stroke={INK} strokeWidth="2.5" />
          <line x1={300} y1={60} x2={395} y2={280} stroke={INK} strokeWidth="2.5" />
          <circle cx={300} cy={60} r={hl('vertices') ? 9 : 4} fill={hl('vertices') ? PINK : INK} />
          {hl('vertices') && <text x={315} y={55} fill={PINK} fontSize="15" fontWeight="800" fontFamily="sans-serif">vertex (apex)</text>}
        </g>
      );
    } else {
      body = (
        <g>
          <circle cx={300} cy={180} r={120} fill={hl('faces') ? PURPLE : SKY} opacity={hl('faces') ? 0.3 : 0.08} stroke={INK} strokeWidth="2.5" />
          <ellipse cx={300} cy={180} rx={120} ry={32} fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.5" />
          <ellipse cx={262} cy={135} rx={28} ry={16} fill="white" opacity="0.12" />
        </g>
      );
    }
  }

  const euler = !solid.curved ? counts.F + counts.V - counts.E : null;

  return (
    <StoryStage
      eyebrow="Visualizer · 3D Shapes"
      title={`${solid.label}: like ${solid.example}`}
      footer={
        <div className="space-y-3">
          <style>{'@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }'}</style>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SOLIDS).map(([k, v]) => (
              <button key={k} onClick={() => update({ solid: k })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${s.solid === k ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{v.label}</button>
            ))}
          </div>
          <ModePills value={s.count || 'none'} onChange={(c) => update({ count: c === 'none' ? null : c })} options={[{ value: 'none', label: 'Just look' }, { value: 'faces', label: 'Count faces' }, { value: 'edges', label: 'Count edges' }, { value: 'vertices', label: 'Count vertices' }]} />
          <div className="flex flex-wrap gap-2">
            <Readout label="Faces (F)" value={<span className="text-sm">{counts.F}</span>} tone="text-purple-300" />
            <Readout label="Edges (E)" value={<span className="text-sm">{counts.E}</span>} tone="text-amber-300" />
            <Readout label="Vertices (V)" value={<span className="text-sm">{counts.V}</span>} tone="text-pink-300" />
            {s.euler && euler !== null && <Readout label="F + V − E" value={`${counts.F} + ${counts.V} − ${counts.E} = ${euler}`} tone="text-emerald-300" />}
          </div>
          {!solid.curved && <p className="text-xs text-slate-500">Drag the shape to turn it around and check the hidden side.</p>}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} style={{ cursor: solid.curved ? 'default' : 'grab' }}>
        <rect width={W} height={H} fill="#020617" />
        {body}
      </svg>
    </StoryStage>
  );
}
