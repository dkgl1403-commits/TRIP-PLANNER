import React, { useState, useEffect, useRef } from 'react';
import { StoryStage, ModePills, Readout, Reveal, useTween, useSceneState, useSvgDrag, polar, arcPath, sectorPath } from '../engine/storyKit';

// Class 6 · Lines and Angles — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene, and the learner
// can take over (drag / switch modes) at any time.

const W = 600;
const H = 360;
const INK = '#e2e8f0';
const AMBER = '#fbbf24';
const SKY = '#38bdf8';
const GREEN = '#34d399';
const PINK = '#f472b6';
const PURPLE = '#a78bfa';
const RED = '#f87171';

const round = (v) => Math.round(v);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const normDeg = (d) => ((d % 360) + 360) % 360;
const pointerDeg = (cx, cy, x, y) => normDeg((Math.atan2(cy - y, x - cx) * 180) / Math.PI);

// Avoid jumping from 359° to 0° (and back) while dragging around a full turn
const unwrap = (prev, next) => {
  if (prev > 270 && next < 90) return 360;
  if (prev < 90 && next > 270) return 0;
  return next;
};

export function angleType(a) {
  const d = round(a);
  if (d <= 0) return { name: 'Zero angle', color: '#94a3b8' };
  if (d < 90) return { name: 'Acute angle', color: GREEN };
  if (d === 90) return { name: 'Right angle', color: SKY };
  if (d < 180) return { name: 'Obtuse angle', color: AMBER };
  if (d === 180) return { name: 'Straight angle', color: PURPLE };
  if (d < 360) return { name: 'Reflex angle', color: PINK };
  return { name: 'Complete angle', color: RED };
}

const TURN_NAMES = { 90: '¼ turn', 180: '½ turn', 270: '¾ turn', 360: '1 full turn' };

function Arrowhead({ x, y, deg, color = INK, size = 12 }) {
  const [x1, y1] = polar(x, y, size, deg + 150);
  const [x2, y2] = polar(x, y, size, deg - 150);
  return <polygon points={`${x},${y} ${x1},${y1} ${x2},${y2}`} fill={color} />;
}

function Dot({ x, y, label, color = AMBER, dx = -6, dy = -14, r = 6, pulse }) {
  return (
    <g>
      {pulse && (
        <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2">
          <animate attributeName="r" values={`${r};${r * 4}`} dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={r} fill={color} />
      {label && <text x={x + dx} y={y + dy} fill={color} fontSize="18" fontWeight="800" fontFamily="sans-serif">{label}</text>}
    </g>
  );
}

function RightAngleMark({ cx, cy, deg, size = 18, color = SKY }) {
  const [ax, ay] = polar(cx, cy, size, deg);
  const [bx, by] = polar(cx, cy, size, deg + 90);
  const [mx, my] = [ax + bx - cx, ay + by - cy];
  return <polyline points={`${ax},${ay} ${mx},${my} ${bx},${by}`} fill="none" stroke={color} strokeWidth="2.5" />;
}

function TaskBanner({ text, done }) {
  if (!text) return null;
  return (
    <div className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${done ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300' : 'bg-amber-500/10 border-amber-400/60 text-amber-200'}`}>
      {done ? '✔ ' : '👉 '}{text}
    </div>
  );
}

// Largest t so that P + t·u stays inside the drawing area (keeps arrowheads visible)
function distanceToEdge([px, py], [ux, uy], m = 18) {
  const ts = [];
  if (ux > 1e-6) ts.push((W - m - px) / ux);
  if (ux < -1e-6) ts.push((m - px) / ux);
  if (uy > 1e-6) ts.push((H - m - py) / uy);
  if (uy < -1e-6) ts.push((m - py) / uy);
  return Math.max(0, Math.min(...ts));
}

// Continuous rotation (degrees) while `active` is true
function useSpin(active, degPerSec = 20) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      setDeg((d) => (d + ((now - last) / 1000) * degPerSec) % 360);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, degPerSec]);
  return deg;
}

function Notation({ kind }) {
  const mark = { segment: '—', ray: '→', line: '↔' }[kind];
  if (kind === 'point') return <span className="font-black">P</span>;
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className="text-xs -mb-1">{mark}</span>
      <span className="font-black">AB</span>
    </span>
  );
}

// ─── WIDGET 1: Point → Segment → Ray → Line (Meera's kite string and Dadaji's torch) ───
export function Class6PointLineRayWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState(
    { stage: 'point', A: [170, 210], B: [430, 150], kite: false, torch: false, rail: false },
    visual
  );
  const [dragging, setDragging] = useState(null);

  const ext = ['ray', 'line'].includes(s.stage);
  const fwd = useTween(ext ? 1 : 0, 1200);
  const back = useTween(s.stage === 'line' ? 1 : 0, 1200);
  const draw = useTween(['segment', 'ray', 'line'].includes(s.stage) ? 1 : 0, 900);
  const spinning = s.stage === 'onePoint';
  const spin = useSpin(spinning, 24);
  const AB = Math.atan2(-(s.B[1] - s.A[1]), s.B[0] - s.A[0]) * 180 / Math.PI;
  const search = useTween(s.stage === 'twoPoints' ? AB : AB + 150, s.stage === 'twoPoints' ? 3200 : 1);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (!dragging) return;
    const p = [clamp(x, 30, W - 30), clamp(y, 30, H - 30)];
    update({ [dragging]: p });
    onInteract?.();
  });

  const [ax, ay] = s.A;
  const [bx, by] = s.B;
  const len = Math.hypot(bx - ax, by - ay);
  const u = [(bx - ax) / len, (by - ay) / len];
  const fwdEnd = [bx + u[0] * distanceToEdge(s.B, u) * fwd, by + u[1] * distanceToEdge(s.B, u) * fwd];
  const backEnd = [ax - u[0] * distanceToEdge(s.A, [-u[0], -u[1]]) * back, ay - u[1] * distanceToEdge(s.A, [-u[0], -u[1]]) * back];
  const segEnd = [ax + (bx - ax) * draw, ay + (by - ay) * draw];
  const dirDeg = Math.atan2(-(u[1]), u[0]) * 180 / Math.PI;
  const lineStages = ['segment', 'ray', 'line'];
  const kind = lineStages.includes(s.stage) ? s.stage : 'point';

  const labels = {
    point: 'A point shows an exact position. It has no length, no width, no thickness.',
    segment: 'A line segment has two end points. We can measure it.',
    ray: 'A ray starts at one point and goes on forever in one direction.',
    line: 'A line goes on forever in both directions. No end points!',
    onePoint: 'Through one point, we can draw endless lines.',
    twoPoints: 'Through two points, exactly ONE line passes.',
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Basic Geometry"
      title="Point, Segment, Ray and Line"
      footer={
        <div className="space-y-3">
          <ModePills
            value={s.stage}
            onChange={(stage) => update({ stage })}
            options={[
              { value: 'point', label: 'Point' },
              { value: 'segment', label: 'Segment' },
              { value: 'ray', label: 'Ray' },
              { value: 'line', label: 'Line' },
              { value: 'onePoint', label: '1 point' },
              { value: 'twoPoints', label: '2 points' },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            {lineStages.includes(s.stage) && (
              <>
                <Readout label="Symbol" value={<Notation kind={kind} />} tone="text-amber-300" />
                <Readout label="Length" value={s.stage === 'segment' ? `${(len / 40).toFixed(1)} cm` : '∞'} tone={s.stage === 'segment' ? 'text-emerald-400' : 'text-pink-400'} />
                <Readout label="End points" value={{ segment: 2, ray: 1, line: 0 }[s.stage]} tone="text-sky-400" />
              </>
            )}
            <p className="text-sm text-slate-300 flex-1 min-w-[200px]">{labels[s.stage]}</p>
          </div>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDragging(null); }}>
        <defs>
          <linearGradient id="torchBeam" x1="0" x2="1">
            <stop offset="0" stopColor="#fde68a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
          </linearGradient>
          <pattern id="grid6" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid6)" />

        {/* Point */}
        {s.stage === 'point' && <Dot x={300} y={180} label="P" pulse r={7} />}

        {/* Segment / ray / line */}
        {lineStages.includes(s.stage) && (
          <g>
            {s.torch && fwd > 0.05 && (
              <polygon
                points={`${ax},${ay} ${polar(fwdEnd[0], fwdEnd[1], 70, dirDeg + 90).join(',')} ${polar(fwdEnd[0], fwdEnd[1], 70, dirDeg - 90).join(',')}`}
                fill="url(#torchBeam)"
                opacity={fwd}
              />
            )}
            {s.rail && s.stage === 'line' && Array.from({ length: 16 }, (_, i) => {
              const t = -7 + i;
              const cx = ax + u[0] * t * 40 + u[0] * len / 2;
              const cy = ay + u[1] * t * 40 + u[1] * len / 2;
              return <line key={i} x1={cx - u[1] * 16} y1={cy + u[0] * 16} x2={cx + u[1] * 16} y2={cy - u[0] * 16} stroke="#92400e" strokeWidth="6" opacity={back} />;
            })}
            <line x1={backEnd[0]} y1={backEnd[1]} x2={ax} y2={ay} stroke={PINK} strokeWidth="4" strokeLinecap="round" />
            <line x1={ax} y1={ay} x2={segEnd[0]} y2={segEnd[1]} stroke={INK} strokeWidth="4" strokeLinecap="round" />
            <line x1={bx} y1={by} x2={fwdEnd[0]} y2={fwdEnd[1]} stroke={PINK} strokeWidth="4" strokeLinecap="round" />
            {fwd > 0.97 && <Arrowhead x={fwdEnd[0]} y={fwdEnd[1]} deg={dirDeg} color={PINK} />}
            {back > 0.97 && <Arrowhead x={backEnd[0]} y={backEnd[1]} deg={dirDeg + 180} color={PINK} />}

            {s.stage === 'segment' && draw > 0.98 && (
              <g opacity="0.8">
                {Array.from({ length: Math.floor(len / 40) + 1 }, (_, i) => {
                  const p = [ax + u[0] * i * 40, ay + u[1] * i * 40];
                  return (
                    <g key={i}>
                      <line x1={p[0] + u[1] * 14} y1={p[1] - u[0] * 14} x2={p[0] + u[1] * 24} y2={p[1] - u[0] * 24} stroke={GREEN} strokeWidth="2" />
                      <text x={p[0] + u[1] * 36 - 4} y={p[1] - u[0] * 36 + 4} fill={GREEN} fontSize="11" fontFamily="monospace">{i}</text>
                    </g>
                  );
                })}
              </g>
            )}

            {s.kite && (
              <g transform={`translate(${bx} ${by})`}>
                <animateTransform attributeName="transform" type="rotate" additive="sum" values="-5;5;-5" dur="2.4s" repeatCount="indefinite" />
                <polygon points="0,-34 22,0 0,30 -22,0" fill="#f97316" stroke="#fed7aa" strokeWidth="2" />
                <line x1="0" y1="-34" x2="0" y2="30" stroke="#fed7aa" strokeWidth="1.5" />
                <line x1="-22" y1="0" x2="22" y2="0" stroke="#fed7aa" strokeWidth="1.5" />
                <path d="M 0 30 q 10 14 -2 26 q -12 12 4 24" fill="none" stroke="#f97316" strokeWidth="2" />
              </g>
            )}
            {s.kite && <circle cx={ax} cy={ay} r="16" fill="#7c2d12" stroke="#fdba74" strokeWidth="3" />}
            {s.torch && <rect x={ax - 26} y={ay - 9} width="26" height="18" rx="4" fill="#475569" stroke="#cbd5e1" transform={`rotate(${-dirDeg} ${ax} ${ay})`} />}

            <g style={{ cursor: 'grab' }} onPointerDown={(e) => { setDragging('A'); dragProps.onPointerDown(e); }}>
              <circle cx={ax} cy={ay} r="18" fill="transparent" />
              <Dot x={ax} y={ay} label="A" dx={-22} dy={-10} />
            </g>
            <g style={{ cursor: 'grab' }} onPointerDown={(e) => { setDragging('B'); dragProps.onPointerDown(e); }}>
              <circle cx={bx} cy={by} r="18" fill="transparent" />
              <Dot x={bx} y={by} label="B" dx={10} dy={-12} />
            </g>
          </g>
        )}

        {/* Endless lines through one point */}
        {s.stage === 'onePoint' && (
          <g>
            {Array.from({ length: 8 }, (_, i) => {
              const d = spin + i * 22.5;
              const [x1, y1] = polar(300, 180, 400, d);
              const [x2, y2] = polar(300, 180, 400, d + 180);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={[AMBER, SKY, GREEN, PINK, PURPLE][i % 5]} strokeWidth="2.5" opacity="0.85" />;
            })}
            <Dot x={300} y={180} label="P" dx={10} dy={-12} pulse />
            <text x={300} y={340} textAnchor="middle" fill="#94a3b8" fontSize="15" fontFamily="sans-serif">…and still more lines can be drawn — infinitely many!</text>
          </g>
        )}

        {/* Exactly one line through two points */}
        {s.stage === 'twoPoints' && (() => {
          const hit = Math.abs(search - AB) < 0.8;
          const [x1, y1] = polar(ax, ay, 700, search);
          const [x2, y2] = polar(ax, ay, 700, search + 180);
          return (
            <g>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hit ? GREEN : '#64748b'} strokeWidth={hit ? 4 : 2.5} strokeDasharray={hit ? '' : '8 6'} />
              <Dot x={ax} y={ay} label="A" dx={-22} dy={-10} />
              <Dot x={bx} y={by} label="B" dx={10} dy={-12} color={hit ? GREEN : AMBER} pulse={hit} />
              {hit && <text x={300} y={340} textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="700" fontFamily="sans-serif">Only this ONE line passes through both A and B</text>}
            </g>
          );
        })()}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Intersecting, Parallel and Perpendicular lines (railway tracks, window grills) ───
export function Class6LinePairsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'intersecting', angle: 50, tilt: 0, gap: 100, rail: false, task: null }, visual);
  const angle = useTween(s.angle, 1100);
  const tilt = useTween(s.tilt, 900);
  const gap = useTween(s.gap, 900);
  const cx = 300;
  const cy = 180;
  const isPerp = Math.abs(round(angle) - 90) === 0;

  useEffect(() => {
    if (s.task === 'perpendicular' && s.mode === 'intersecting' && round(s.angle) === 90) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.angle, s.mode, s.task]);

  const y1 = 180 - gap / 2;
  const y2 = 180 + gap / 2;
  const slope = Math.tan((tilt * Math.PI) / 180);
  const line2Y = (x) => y2 - slope * (x - cx);
  const meetX = Math.abs(slope) > 1e-4 ? cx + (y2 - y1) / slope : null;
  const meetCm = meetX !== null ? Math.abs(meetX - cx) / 40 : null;

  return (
    <StoryStage
      eyebrow="Visualizer · Pairs of Lines"
      title={s.mode === 'parallel' ? 'Parallel Lines: never meet' : isPerp ? 'Perpendicular Lines ⟂' : 'Intersecting Lines'}
      footer={
        <div className="space-y-3">
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'intersecting', label: 'Intersecting / ⟂' }, { value: 'parallel', label: 'Parallel' }]} />
          {s.task === 'perpendicular' && <TaskBanner text="Your turn: turn the line until the two lines are perpendicular (90°)." done={s.mode === 'intersecting' && round(s.angle) === 90} />}
          {s.mode === 'intersecting' ? (
            <label className="block text-xs text-slate-400">
              Turn the second line: <span className="text-amber-300 font-mono font-bold">{round(angle)}°</span>
              <input type="range" min="5" max="175" value={round(s.angle)} onChange={(e) => update({ angle: +e.target.value })} className="w-full accent-amber-400" />
            </label>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs text-slate-400">
                Tilt the bottom line: <span className="text-amber-300 font-mono font-bold">{tilt.toFixed(1)}°</span>
                <input type="range" min="-10" max="10" step="0.5" value={s.tilt} onChange={(e) => update({ tilt: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <label className="block text-xs text-slate-400">
                Gap between lines: <span className="text-amber-300 font-mono font-bold">{(gap / 40).toFixed(1)} cm</span>
                <input type="range" min="40" max="200" value={s.gap} onChange={(e) => update({ gap: +e.target.value })} className="w-full accent-amber-400" />
              </label>
            </div>
          )}
          <p className="text-sm text-slate-300">
            {s.mode === 'parallel'
              ? (Math.abs(tilt) < 0.25 ? 'The gap is the same everywhere, so these lines will never meet, however far they go. They are parallel ( ∥ ).' : `Tilted by just ${Math.abs(tilt).toFixed(1)}°, the gap keeps changing. These lines will meet about ${meetCm.toFixed(0)} cm away. Not parallel!`)
              : (isPerp ? 'The lines meet at a right angle (90°). They are perpendicular ( ⟂ ). Look for this in window grills, notebook margins and the plus sign.' : 'The two lines cross at exactly one point. That point is called the point of intersection.')}
          </p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'intersecting' ? (
          <g>
            <line x1="20" y1={cy} x2={W - 20} y2={cy} stroke={INK} strokeWidth="4" />
            <Arrowhead x={W - 20} y={cy} deg={0} />
            <Arrowhead x={20} y={cy} deg={180} />
            {(() => {
              const [x1, y1b] = polar(cx, cy, 200, angle);
              const [x2, y2b] = polar(cx, cy, 200, angle + 180);
              return (
                <g>
                  <line x1={x1} y1={y1b} x2={x2} y2={y2b} stroke={isPerp ? SKY : AMBER} strokeWidth="4" />
                  <Arrowhead x={x1} y={y1b} deg={angle} color={isPerp ? SKY : AMBER} />
                  <Arrowhead x={x2} y={y2b} deg={angle + 180} color={isPerp ? SKY : AMBER} />
                </g>
              );
            })()}
            {isPerp ? <RightAngleMark cx={cx} cy={cy} deg={0} size={26} /> : <path d={arcPath(cx, cy, 44, 0, angle)} fill="none" stroke={GREEN} strokeWidth="3" />}
            {!isPerp && <text x={polar(cx, cy, 66, angle / 2)[0] - 14} y={polar(cx, cy, 66, angle / 2)[1] + 6} fill={GREEN} fontSize="16" fontWeight="800" fontFamily="monospace">{round(angle)}°</text>}
            <Dot x={cx} y={cy} label="O" dx={-24} dy={22} pulse color={isPerp ? SKY : AMBER} />
          </g>
        ) : (
          <g>
            {s.rail && Math.abs(tilt) < 0.25 && Array.from({ length: 15 }, (_, i) => (
              <rect key={i} x={30 + i * 38} y={y1 - 10} width="14" height={gap + 20} fill="#78350f" rx="2" opacity="0.8" />
            ))}
            <line x1="20" y1={y1} x2={W - 20} y2={y1} stroke={INK} strokeWidth="4" />
            <Arrowhead x={W - 20} y={y1} deg={0} />
            <Arrowhead x={20} y={y1} deg={180} />
            <line x1="20" y1={line2Y(20)} x2={W - 20} y2={line2Y(W - 20)} stroke={AMBER} strokeWidth="4" />
            <Arrowhead x={W - 20} y={line2Y(W - 20)} deg={tilt} color={AMBER} />
            <Arrowhead x={20} y={line2Y(20)} deg={tilt + 180} color={AMBER} />
            {[110, 300, 490].map((x) => {
              const d = line2Y(x) - y1;
              return (
                <g key={x}>
                  <line x1={x} y1={y1} x2={x} y2={line2Y(x)} stroke={GREEN} strokeWidth="2" strokeDasharray="5 4" />
                  <text x={x + 6} y={(y1 + line2Y(x)) / 2 + 5} fill={GREEN} fontSize="14" fontWeight="700" fontFamily="monospace">{(d / 40).toFixed(2)} cm</text>
                </g>
              );
            })}
            {meetX !== null && meetX > 20 && meetX < W - 20 && <Dot x={meetX} y={y1} color={RED} pulse label="meet!" dx={-20} dy={-14} />}
            {meetX !== null && (meetX <= 20 || meetX >= W - 20) && (
              <text x={meetX > cx ? W - 30 : 30} y={40} textAnchor={meetX > cx ? 'end' : 'start'} fill={RED} fontSize="14" fontWeight="700" fontFamily="sans-serif">
                {meetX > cx ? 'they meet far away →' : '← they meet far away'}
              </text>
            )}
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Angle = amount of turn (door, clock, rotating arm) + types of angles ───
export function Class6AngleTurnWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ angle: 40, context: 'plain', showParts: true, showType: true, task: null }, visual);
  const angle = useTween(s.angle, 1300);
  const clock = s.context === 'clock';
  const base = clock ? 90 : 0;
  const dir = clock ? -1 : 1;
  const cx = 300;
  const cy = clock ? 185 : 215;
  const R = clock ? 140 : 190;
  const armDeg = base + dir * angle;
  const type = angleType(angle);
  const shown = round(angle);
  const taskDone = s.task && shown >= s.task.min && shown <= s.task.max;

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    const raw = pointerDeg(cx, cy, x, y);
    let a = normDeg(dir * (raw - base));
    a = unwrap(s.angle, a);
    if (s.context === 'door') a = clamp(a, 0, 180);
    update({ angle: round(a) });
  });

  const [ex, ey] = polar(cx, cy, R, armDeg);
  const [fx, fy] = polar(cx, cy, R, base);
  const arcFrom = Math.min(base, armDeg);
  const arcTo = Math.max(base, armDeg);
  const [lx, ly] = polar(cx, cy, 78, base + (dir * angle) / 2);

  return (
    <StoryStage
      eyebrow="Visualizer · Angles"
      title="An angle is an amount of turn"
      footer={
        <div className="space-y-3">
          <ModePills
            value={s.context}
            onChange={(context) => update({ context, angle: context === 'door' ? Math.min(s.angle, 180) : s.angle })}
            options={[{ value: 'plain', label: 'Rays' }, { value: 'door', label: 'Door' }, { value: 'clock', label: 'Clock' }]}
          />
          {s.task && <TaskBanner text={s.task.text} done={taskDone} />}
          <div className="flex flex-wrap gap-2">
            <Readout label="Angle" value={`${shown}°`} tone="text-amber-300" />
            {s.showType && <Readout label="Type" value={<span style={{ color: type.color }} className="text-sm">{type.name}</span>} />}
            {TURN_NAMES[shown] && <Readout label="Turn" value={TURN_NAMES[shown]} tone="text-sky-300" />}
            {clock && <Readout label="Hours apart" value={(shown / 30).toFixed(shown % 30 ? 1 : 0)} tone="text-pink-300" />}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[30, 90, 135, 180, 240, 360].map((a) => (
              <button key={a} onClick={() => update({ angle: a })} className="px-2.5 py-1 rounded-lg text-xs font-mono border border-slate-700 text-slate-300 hover:bg-slate-800">{a}°</button>
            ))}
          </div>
          <p className="text-xs text-slate-500">Drag the glowing handle to turn the arm yourself.</p>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps}>
        <rect width={W} height={H} fill="#020617" />

        {clock && (
          <g>
            <circle cx={cx} cy={cy} r={R + 18} fill="#0f172a" stroke="#475569" strokeWidth="4" />
            {Array.from({ length: 12 }, (_, i) => {
              const d = 90 - i * 30;
              const [tx, ty] = polar(cx, cy, R - 4, d);
              return <text key={i} x={tx} y={ty + 6} textAnchor="middle" fill="#cbd5e1" fontSize="17" fontWeight="700" fontFamily="sans-serif">{i === 0 ? 12 : i}</text>;
            })}
          </g>
        )}

        {s.context === 'door' && (
          <g>
            <rect x={cx - 250} y={cy} width={250} height="14" fill="#475569" />
            <rect x={cx + R} y={cy} width={W - cx - R} height="14" fill="#475569" />
            <text x={cx - 240} y={cy + 40} fill="#64748b" fontSize="13" fontFamily="sans-serif">wall (seen from above)</text>
          </g>
        )}

        <path d={sectorPath(cx, cy, clock ? 60 : 70, arcFrom, arcTo)} fill={type.color} opacity="0.22" />
        <path d={arcPath(cx, cy, clock ? 60 : 70, arcFrom, arcTo)} fill="none" stroke={type.color} strokeWidth="3" />
        {shown === 90 && <RightAngleMark cx={cx} cy={cy} deg={arcFrom} size={24} />}

        {s.context === 'door' ? (
          <g>
            <line x1={cx} y1={cy + 7} x2={fx} y2={fy + 7} stroke="#334155" strokeWidth="3" strokeDasharray="6 5" />
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#b45309" strokeWidth="14" strokeLinecap="round" />
            <circle cx={polar(cx, cy, R - 24, armDeg)[0]} cy={polar(cx, cy, R - 24, armDeg)[1]} r="5" fill="#fde68a" />
          </g>
        ) : (
          <g>
            <line x1={cx} y1={cy} x2={fx} y2={fy} stroke={INK} strokeWidth={clock ? 7 : 4} strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={AMBER} strokeWidth={clock ? 5 : 4} strokeLinecap="round" />
            {!clock && <Arrowhead x={fx} y={fy} deg={base} />}
            {!clock && <Arrowhead x={ex} y={ey} deg={armDeg} color={AMBER} />}
          </g>
        )}

        <text x={lx - 18} y={ly + 6} fill={type.color} fontSize="18" fontWeight="900" fontFamily="monospace">{shown}°</text>

        {s.showParts && !clock && (
          <g fontFamily="sans-serif" fontSize="15" fontWeight="700">
            <Dot x={cx} y={cy} label="O" dx={-12} dy={30} r={5} />
            <text x={fx - 30} y={fy + 28} fill={INK}>A</text>
            <text x={ex + 10} y={ey - 8} fill={AMBER}>B</text>
            <text x={20} y={30} fill="#94a3b8">vertex = O · arms = OA and OB · name: ∠AOB</text>
          </g>
        )}
        {clock && <circle cx={cx} cy={cy} r="7" fill={AMBER} />}

        <circle cx={ex} cy={ey} r="16" fill={AMBER} opacity="0.25" style={{ cursor: 'grab' }} onPointerDown={dragProps.onPointerDown}>
          <animate attributeName="r" values="13;19;13" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Measuring with a protractor (and the classic inner/outer scale mistake) ───
export function Class6ProtractorWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ angle: 65, place: false, scale: 'none', reading: false, guess: false }, visual);
  const [estimate, setEstimate] = useState(45);
  const [checked, setChecked] = useState(false);
  const angle = useTween(s.angle, 1000);
  const place = useTween(s.place ? 1 : 0, 1600);
  const cx = 300;
  const cy = 300;
  const R = 210;

  useEffect(() => { setChecked(false); }, [s.guess, s.angle]);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (s.guess && !checked) return;
    update({ angle: clamp(round(pointerDeg(cx, cy, x, y) > 180 ? (x > cx ? 0 : 180) : pointerDeg(cx, cy, x, y)), 0, 180) });
  });

  const check = () => {
    setChecked(true);
    update({ place: true, scale: 'inner', reading: true });
    if (Math.abs(estimate - s.angle) <= 10) onInteract?.();
  };

  const newAngle = () => {
    update({ angle: 15 + Math.floor(Math.random() * 150), place: false, reading: false, scale: 'none' });
    setChecked(false);
  };

  const shown = round(angle);
  const [ex, ey] = polar(cx, cy, R + 40, angle);
  const innerCol = s.scale === 'inner' || s.scale === 'both' ? GREEN : '#64748b';
  const outerCol = s.scale === 'outer' ? RED : s.scale === 'both' ? SKY : '#64748b';
  const close = Math.abs(estimate - s.angle) <= 10;

  return (
    <StoryStage
      eyebrow="Visualizer · Measuring Angles"
      title="Using a Protractor"
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Readout label="Inner scale" value={s.reading ? `${shown}°` : '?'} tone="text-emerald-400" />
            <Readout label="Outer scale" value={s.reading ? `${180 - shown}°` : '?'} tone={s.scale === 'outer' ? 'text-red-400' : 'text-sky-400'} />
          </div>
          {s.guess ? (
            <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <label className="block text-xs text-slate-400">
                Your estimate (no protractor!): <span className="text-amber-300 font-mono font-bold">{estimate}°</span>
                <input type="range" min="0" max="180" value={estimate} disabled={checked} onChange={(e) => setEstimate(+e.target.value)} className="w-full accent-amber-400" />
              </label>
              <div className="flex gap-2">
                <button onClick={check} disabled={checked} className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-sm font-bold">Check with protractor</button>
                <button onClick={newAngle} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold">New angle</button>
              </div>
              {checked && (
                <p className={`text-sm font-bold ${close ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {close ? `Great eye! Actual ${s.angle}°, you said ${estimate}° (off by ${Math.abs(estimate - s.angle)}°).` : `Actual ${s.angle}°, you said ${estimate}°. Tip: compare with 90° (a book corner) first, then halve it.`}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => update({ place: !s.place })} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">{s.place ? 'Remove protractor' : 'Place protractor'}</button>
              <button onClick={() => update({ scale: 'inner', reading: true, place: true })} className="px-3 py-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-600 text-white text-xs font-bold">Read correct scale</button>
              <button onClick={() => update({ scale: 'outer', reading: true, place: true })} className="px-3 py-1.5 rounded-lg bg-red-700/50 hover:bg-red-600 text-white text-xs font-bold">Show the common mistake</button>
              <button onClick={() => update({ guess: true, place: false, reading: false, scale: 'none' })} className="px-3 py-1.5 rounded-lg bg-amber-600/60 hover:bg-amber-500 text-white text-xs font-bold">Estimation game</button>
            </div>
          )}
          {s.scale === 'outer' && <p className="text-sm text-red-300">Reading the outer scale here gives {180 - shown}°. Wrong! Always start counting from the 0 that sits on your first arm.</p>}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H + 20}`} className="w-full h-auto touch-none select-none" {...dragProps}>
        <rect width={W} height={H + 20} fill="#020617" />

        {/* Protractor slides in from the bottom-right and settles on the vertex */}
        <g transform={`translate(${(1 - place) * 260} ${(1 - place) * 140}) rotate(${(1 - place) * -30} ${cx} ${cy})`} opacity={0.25 + place * 0.75}>
          <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`} fill="rgba(56,189,248,0.08)" stroke={SKY} strokeWidth="2" />
          <path d={`M ${cx - 60} ${cy} A 60 60 0 0 1 ${cx + 60} ${cy}`} fill="none" stroke={SKY} strokeWidth="1" opacity="0.6" />
          {Array.from({ length: 181 }, (_, d) => {
            const long = d % 10 === 0;
            const mid = d % 5 === 0;
            const [x1, y1] = polar(cx, cy, R, d);
            const [x2, y2] = polar(cx, cy, R - (long ? 18 : mid ? 12 : 6), d);
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SKY} strokeWidth={long ? 1.6 : 0.8} opacity="0.8" />;
          })}
          {Array.from({ length: 19 }, (_, i) => {
            const d = i * 10;
            const [ox, oy] = polar(cx, cy, R - 32, d);
            const [ix, iy] = polar(cx, cy, R - 56, d);
            return (
              <g key={d} fontFamily="monospace" fontWeight="700" textAnchor="middle">
                <text x={ox} y={oy + 4} fontSize="11" fill={outerCol}>{180 - d}</text>
                <text x={ix} y={iy + 4} fontSize="11" fill={innerCol}>{d}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="4" fill={SKY} />
          <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke={SKY} strokeWidth="1.5" />
        </g>

        {/* The angle being measured */}
        <path d={arcPath(cx, cy, 40, 0, angle)} fill="none" stroke={AMBER} strokeWidth="3" />
        <line x1={cx} y1={cy} x2={cx + R + 50} y2={cy} stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={AMBER} strokeWidth="4" strokeLinecap="round" />
        <Dot x={cx} y={cy} label="O" dx={-8} dy={28} r={5} />
        {(!s.guess || checked) && (
          <circle cx={ex} cy={ey} r="15" fill={AMBER} opacity="0.25" style={{ cursor: 'grab' }} onPointerDown={dragProps.onPointerDown} />
        )}

        {s.reading && place > 0.95 && (() => {
          const wrong = s.scale === 'outer';
          const [px, py] = polar(cx, cy, wrong ? R - 32 : R - 56, angle);
          return (
            <g>
              <circle cx={px} cy={py} r="16" fill="none" stroke={wrong ? RED : GREEN} strokeWidth="3">
                <animate attributeName="r" values="14;20;14" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <text x={20} y={34} fill={wrong ? RED : GREEN} fontSize="18" fontWeight="800" fontFamily="sans-serif">
                {wrong ? `✗ ${180 - shown}° (wrong scale)` : `✔ ∠ = ${shown}°`}
              </text>
            </g>
          );
        })()}
        {s.scale === 'inner' && place > 0.95 && (
          <text x={cx + R - 10} y={cy + 24} fill={GREEN} fontSize="12" fontWeight="700" fontFamily="sans-serif" textAnchor="end">start at this 0 →</text>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Proofs: linear pair (180°), vertically opposite angles, angles around a point (360°) ───
export function Class6AngleProofsWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ mode: 'linear', angle: 60, step: 9, rays: [35, 120, 215, 300], task: null }, visual);
  const [dragRay, setDragRay] = useState(null);
  const angle = useTween(s.angle, 1100);
  const rot = useTween(s.mode === 'vertical' && s.step >= 2 ? 180 : 0, 2200);
  const cx = 300;
  const cy = s.mode === 'linear' ? 250 : 180;

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    const d = pointerDeg(cx, cy, x, y);
    if (s.mode === 'point' && dragRay !== null) {
      const rays = [...s.rays];
      rays[dragRay] = round(d);
      update({ rays });
      onInteract?.();
    } else if (s.mode === 'linear') {
      update({ angle: clamp(round(d > 180 ? (x > cx ? 1 : 179) : d), 1, 179) });
      onInteract?.();
    } else if (s.mode === 'vertical') {
      update({ angle: clamp(round(d > 180 ? d - 180 : d), 10, 170) });
      onInteract?.();
    }
  });

  const a = round(angle);
  const b = 180 - a;
  const step = s.step;

  const formula = {
    linear: [
      ['A straight line makes a straight angle', '∠AOB = 180°'],
      ['The ray OC splits it into two parts', `∠COB = ${a}°,  ∠AOC = ${b}°`],
      ['The two parts still fill the same half-turn', `${a}° + ${b}° = 180°`],
      ['So, angles of a linear pair always add up to 180°', '∠1 + ∠2 = 180°  ✔'],
    ],
    vertical: [
      ['Two lines cross at O, making 4 angles', '∠1, ∠2, ∠3, ∠4'],
      ['∠1 and ∠2 sit on the same straight line', `∠1 + ∠2 = 180°  (${a} + ${b})`],
      ['∠2 and ∠3 also sit on a straight line', `∠2 + ∠3 = 180°  (${b} + ${a})`],
      ['Both sums equal 180°, and ∠2 is common', '∠1 + ∠2 = ∠2 + ∠3'],
      ['Take away ∠2 from both sides', '∠1 = ∠3  ✔ (and similarly ∠2 = ∠4)'],
    ],
    point: [
      ['Angles all the way around a point make one full turn', 'sum = 360°'],
    ],
  }[s.mode];

  const sortedRays = [...s.rays].map((r, i) => ({ r: normDeg(r), i })).sort((p, q) => p.r - q.r);
  const pointAngles = sortedRays.map((p, k) => {
    const next = sortedRays[(k + 1) % sortedRays.length].r;
    return { from: p.r, to: next > p.r ? next : next + 360, size: normDeg(next - p.r) || 360 };
  });
  const colors = [GREEN, SKY, AMBER, PINK, PURPLE];

  return (
    <StoryStage
      eyebrow="Proof Lab · see it, then prove it"
      title={{ linear: 'Linear Pair: angles on a line = 180°', vertical: 'Vertically Opposite Angles are Equal', point: 'Angles around a point = 360°' }[s.mode]}
      footer={
        <div className="space-y-3">
          <ModePills
            value={s.mode}
            onChange={(mode) => update({ mode, step: 9 })}
            options={[{ value: 'linear', label: 'Linear pair' }, { value: 'vertical', label: 'Vertically opposite' }, { value: 'point', label: 'Around a point' }]}
          />
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-1.5 font-mono text-xs md:text-sm">
            {s.mode === 'point' ? (
              <div className="text-slate-200">
                {pointAngles.map((p, k) => <span key={k} style={{ color: colors[k % colors.length] }}>{round(p.size)}°{k < pointAngles.length - 1 ? ' + ' : ''}</span>)}
                <span className="text-emerald-300 font-bold"> = {round(pointAngles.reduce((t, p) => t + p.size, 0))}°</span>
              </div>
            ) : (s.mode === 'vertical' && step < 3) ? (
              <div className="text-slate-500 font-sans text-xs">The proof will build up here, one line at a time…</div>
            ) : formula.map(([why, eq], i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:justify-between gap-1 transition-all duration-500 ${i <= step - (s.mode === 'vertical' ? 2 : 0) || step >= 9 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <span className="text-slate-400 font-sans">{why}</span>
                <span className="text-emerald-300 font-bold">{eq}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Drag the {s.mode === 'point' ? 'coloured dots' : 'glowing handle'}. The numbers change, but the rule never breaks. That is what makes it a theorem!</p>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDragRay(null); }}>
        <rect width={W} height={H} fill="#020617" />

        {s.mode === 'linear' && (() => {
          const [ex, ey] = polar(cx, cy, 200, angle);
          return (
            <g>
              <Reveal show={step === 0}>
                <path d={sectorPath(cx, cy, 90, 0, 180)} fill={PURPLE} opacity="0.2" />
                <text x={cx} y={cy - 100} textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="800" fontFamily="monospace">180° (half turn)</text>
              </Reveal>
              <line x1="40" y1={cy} x2={W - 40} y2={cy} stroke={INK} strokeWidth="4" />
              <Arrowhead x={40} y={cy} deg={180} />
              <Arrowhead x={W - 40} y={cy} deg={0} />
              <Reveal show={step >= 1}>
                <path d={sectorPath(cx, cy, 70, 0, angle)} fill={GREEN} opacity={step >= 2 ? 0.3 : 0} />
                <path d={sectorPath(cx, cy, 70, angle, 180)} fill={AMBER} opacity={step >= 2 ? 0.3 : 0} />
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={SKY} strokeWidth="4" strokeLinecap="round" />
                <Arrowhead x={ex} y={ey} deg={angle} color={SKY} />
                <text x={ex + 8} y={ey - 6} fill={SKY} fontSize="16" fontWeight="800" fontFamily="sans-serif">C</text>
                <Reveal show={step >= 2}>
                  <text x={polar(cx, cy, 100, angle / 2)[0] - 14} y={polar(cx, cy, 100, angle / 2)[1] + 6} fill={GREEN} fontSize="17" fontWeight="900" fontFamily="monospace">{a}°</text>
                  <text x={polar(cx, cy, 100, 90 + angle / 2)[0] - 18} y={polar(cx, cy, 100, 90 + angle / 2)[1] + 6} fill={AMBER} fontSize="17" fontWeight="900" fontFamily="monospace">{b}°</text>
                </Reveal>
                <circle cx={ex} cy={ey} r="15" fill={SKY} opacity="0.3" style={{ cursor: 'grab' }} onPointerDown={dragProps.onPointerDown} />
              </Reveal>
              <text x={50} y={cy + 30} fill={INK} fontSize="16" fontWeight="700" fontFamily="sans-serif">A</text>
              <text x={W - 60} y={cy + 30} fill={INK} fontSize="16" fontWeight="700" fontFamily="sans-serif">B</text>
              <Dot x={cx} y={cy} label="O" dx={-6} dy={30} r={5} />
            </g>
          );
        })()}

        {s.mode === 'vertical' && (() => {
          const [x1, y1] = polar(cx, cy, 230, angle);
          const [x2, y2] = polar(cx, cy, 230, angle + 180);
          const [hx, hy] = polar(cx, cy, 150, angle);
          const lab = (deg, txt, col, r = 100) => {
            const [lx, ly] = polar(cx, cy, r, deg);
            return <text x={lx} y={ly + 6} textAnchor="middle" fill={col} fontSize="16" fontWeight="900" fontFamily="monospace" paintOrder="stroke" stroke="#020617" strokeWidth="5">{txt}</text>;
          };
          return (
            <g>
              <path d={sectorPath(cx, cy, 64, 0, angle)} fill={GREEN} opacity="0.35" />
              <path d={sectorPath(cx, cy, 64, 180, 180 + angle)} fill={GREEN} opacity={step >= 1 ? 0.35 : 0} />
              <path d={arcPath(cx, cy, 40, angle, 180)} fill="none" stroke={AMBER} strokeWidth="3" opacity={step >= 1 ? 1 : 0} />
              <path d={arcPath(cx, cy, 40, 180 + angle, 360)} fill="none" stroke={AMBER} strokeWidth="3" opacity={step >= 1 ? 1 : 0} />
              <line x1="30" y1={cy} x2={W - 30} y2={cy} stroke={INK} strokeWidth="4" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SKY} strokeWidth="4" />
              <circle cx={hx} cy={hy} r="15" fill={SKY} opacity="0.35" style={{ cursor: 'grab' }} onPointerDown={dragProps.onPointerDown}>
                <animate attributeName="r" values="12;18;12" dur="1.8s" repeatCount="indefinite" />
              </circle>
              {/* A copy of ∠1 spins half a turn about O and lands exactly on ∠3 */}
              {step >= 2 && (
                <g transform={`rotate(${-rot} ${cx} ${cy})`}>
                  <path d={sectorPath(cx, cy, 64, 0, angle)} fill={GREEN} fillOpacity="0.15" stroke={GREEN} strokeWidth="3" strokeDasharray="6 4" />
                </g>
              )}
              {lab(angle / 2, `∠1=${a}°`, GREEN)}
              {step >= 1 && lab(90 + angle / 2, `∠2=${b}°`, AMBER, 70)}
              {step >= 1 && lab(180 + angle / 2, `∠3=${a}°`, GREEN)}
              {step >= 1 && lab(270 + angle / 2, `∠4=${b}°`, AMBER, 70)}
              <circle cx={cx} cy={cy} r="5" fill={AMBER} />
              {step >= 2 && rot > 179 && <text x={cx} y={H - 14} textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="700" fontFamily="sans-serif">Spin ∠1 half a turn about O and it fits exactly on ∠3!</text>}
            </g>
          );
        })()}

        {s.mode === 'point' && (
          <g>
            {pointAngles.map((p, k) => (
              <g key={k}>
                <path d={sectorPath(cx, cy, 70 + k * 6, p.from, p.to)} fill={colors[k % colors.length]} opacity="0.28" />
                <text x={polar(cx, cy, 110, (p.from + p.to) / 2)[0] - 16} y={polar(cx, cy, 110, (p.from + p.to) / 2)[1] + 6} fill={colors[k % colors.length]} fontSize="16" fontWeight="900" fontFamily="monospace">{round(p.size)}°</text>
              </g>
            ))}
            {s.rays.map((r, i) => {
              const [ex, ey] = polar(cx, cy, 160, r);
              return (
                <g key={i}>
                  <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx={ex} cy={ey} r="12" fill={AMBER} opacity="0.5" style={{ cursor: 'grab' }} onPointerDown={(e) => { setDragRay(i); dragProps.onPointerDown(e); }} />
                </g>
              );
            })}
            <Dot x={cx} y={cy} label="O" dx={10} dy={-10} r={5} />
          </g>
        )}
      </svg>
    </StoryStage>
  );
}
