import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag,
  Arrowhead, TaskBanner, INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Integers: The Other Side of Zero — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene, and the learner
// can take over (drag / press buttons) at any time.

const W = 600;
const H = 360;
const MINUS = '−';
const TOKEN_POS = '#ef4444'; // red token = +1 (as in Ganita Prakash)
const TOKEN_NEG = '#22c55e'; // green token = −1

const round = (v) => Math.round(v);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const sum = (list) => list.reduce((t, v) => t + v, 0);
// "+3", "−5", "0"
const fmt = (n) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${Math.abs(n)}` : '0');
// "3", "−5", "0"
const plain = (n) => (n < 0 ? `${MINUS}${Math.abs(n)}` : `${n}`);
// "(+3)", "(−5)", "(0)"
const paren = (n) => `(${fmt(n)})`;
const inr = (n) => `${n < 0 ? MINUS : ''}₹${Math.abs(n).toLocaleString('en-IN')}`;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// 0 → 1 progress that restarts whenever `dep` changes
function useReplay(dep, duration = 1400) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setP(ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setP(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dep, duration]);
  return p;
}

// Counts 0, 1, 2 … upTo (first step after `first` ms, then one every `ms`), restarting whenever `key` changes
function useStepper(key, upTo, ms = 520, first = ms) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    if (upTo <= 0) return undefined;
    let n = 0;
    let id;
    const advance = () => {
      n += 1;
      setStep(n);
      if (n < upTo) id = setTimeout(advance, ms);
    };
    id = setTimeout(advance, first);
    return () => clearTimeout(id);
  }, [key, upTo, ms, first]);
  return step;
}

function Stepper({ label, value, min, max, onChange, tone = 'text-amber-300' }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <span className="font-bold">{label}</span>
      <button onClick={() => onChange(clamp(value - 1, min, max))} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black">{MINUS}</button>
      <span className={`w-9 text-center font-mono font-black text-base ${tone}`}>{fmt(value)}</span>
      <button onClick={() => onChange(clamp(value + 1, min, max))} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black">+</button>
    </div>
  );
}

// ─── WIDGET 1: Below zero (Ladakh thermometer, Kuttanad below sea level) ───
const T_MIN = -30;
const T_MAX = 45;
const tY = (t) => 300 - (t - T_MIN) * 3.6;

const SEA_SPOTS = {
  bird: { h: 8, x: 210, label: 'Bird flying', note: '8 m above sea level' },
  boat: { h: 0, x: 150, label: 'Boat on the water', note: 'at sea level' },
  field: { h: -2, x: 400, label: 'Kuttanad paddy field', note: 'about 2 m below sea level' },
  fish: { h: -6, x: 110, label: 'Fish in the water', note: '6 m below sea level' },
};
const hY = (h) => 190 - h * 15;

function Snowflakes() {
  return (
    <g>
      {Array.from({ length: 14 }, (_, i) => {
        const x = 320 + ((i * 37) % 250);
        const dur = 3 + (i % 4) * 0.7;
        return (
          <circle key={i} cx={x} cy={180} r={i % 3 === 0 ? 2.6 : 1.8} fill="#f8fafc" opacity="0.85">
            <animate attributeName="cy" values="172;336" dur={`${dur}s`} begin={`${(i % 5) * 0.6}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

export function Class6BelowZeroWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ mode: 'thermo', temp: 20, label: 'Room', pins: [], spot: 'boat', task: null }, visual);
  const temp = useTween(s.temp, 1400);
  const shown = round(temp);
  const spot = SEA_SPOTS[s.spot] || SEA_SPOTS.boat;
  const spotH = useTween(spot.h, 900);
  const taskDone = !!s.task && s.mode === 'thermo' && round(s.temp) === s.task.target;

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const dragProps = useSvgDrag(svgRef, (x, y) => {
    if (s.mode !== 'thermo') return;
    update({ temp: clamp(round(T_MIN + (300 - y) / 3.6), T_MIN, T_MAX) });
  });

  const cold = shown < 0;
  const phrase = shown < 0 ? `${Math.abs(shown)} degrees BELOW zero` : shown > 0 ? `${shown} degrees above zero` : 'exactly zero: water freezes';

  return (
    <StoryStage
      eyebrow="Visualizer · Below Zero"
      title={s.mode === 'thermo' ? 'The thermometer goes below zero' : 'Heights above and below sea level'}
      accent="text-sky-400"
      footer={
        <div className="space-y-3">
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'thermo', label: 'Thermometer' }, { value: 'sea', label: 'Sea level' }]} />
          {s.task && <TaskBanner text={s.task.text} done={taskDone} />}
          {s.mode === 'thermo' ? (
            <label className="block text-xs text-slate-400">
              Drag the thermometer or use the slider: <span className="text-amber-300 font-mono font-bold">{plain(round(s.temp))} °C</span>
              <input type="range" min={T_MIN} max={T_MAX} value={round(s.temp)} onChange={(e) => update({ temp: +e.target.value })} className="w-full accent-sky-400" />
            </label>
          ) : (
            <ModePills
              value={s.spot}
              onChange={(v) => update({ spot: v })}
              options={Object.entries(SEA_SPOTS).map(([k, v]) => ({ value: k, label: `${v.label} (${fmt(v.h)} m)` }))}
            />
          )}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps}>
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'thermo' ? (
          <g>
            {/* below-zero zone */}
            <rect x="40" y={tY(0)} width="250" height={tY(T_MIN) - tY(0) + 12} fill={SKY} opacity="0.08" />
            <text x="220" y={tY(0) + 24} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily="sans-serif">BELOW ZERO</text>
            <text x="220" y={tY(0) + 40} textAnchor="middle" fill={SKY} fontSize="12" fontFamily="sans-serif">negative numbers</text>
            <text x="220" y={tY(0) - 72} textAnchor="middle" fill={RED} fontSize="13" fontWeight="800" fontFamily="sans-serif">ABOVE ZERO</text>
            <text x="220" y={tY(0) - 56} textAnchor="middle" fill={RED} fontSize="12" fontFamily="sans-serif">positive numbers</text>
            <line x1="60" y1={tY(0)} x2="290" y2={tY(0)} stroke={AMBER} strokeWidth="2" strokeDasharray="6 5" />
            <text x="286" y={tY(0) - 6} textAnchor="end" fill={AMBER} fontSize="12" fontWeight="700" fontFamily="sans-serif">0 °C</text>

            {/* tube, scale and mercury */}
            <rect x="100" y="22" width="26" height="300" rx="13" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <rect x="106" y={tY(temp)} width="14" height={Math.max(0, 322 - tY(temp))} rx="7" fill={cold ? SKY : RED} />
            <circle cx="113" cy="326" r="20" fill={cold ? SKY : RED} stroke="#475569" strokeWidth="2" />
            {Array.from({ length: 16 }, (_, i) => T_MIN + i * 5).map((t) => (
              <g key={t}>
                <line x1="128" y1={tY(t)} x2={t % 10 === 0 ? 142 : 136} y2={tY(t)} stroke={t === 0 ? AMBER : '#64748b'} strokeWidth={t === 0 ? 3 : 1.5} />
                {t % 10 === 0 && <text x="68" y={tY(t) + 4} textAnchor="end" fill={t < 0 ? SKY : t > 0 ? '#fca5a5' : AMBER} fontSize="13" fontWeight="700" fontFamily="monospace">{plain(t)}</text>}
              </g>
            ))}
            <polygon points={`${150},${tY(temp)} ${160},${tY(temp) - 7} ${160},${tY(temp) + 7}`} fill={AMBER} />
            {/* place pins */}
            {s.pins.map((p) => (
              <g key={p.label}>
                <line x1="146" y1={tY(p.t)} x2="176" y2={tY(p.t)} stroke={PURPLE} strokeWidth="2" />
                <circle cx="146" cy={tY(p.t)} r="3.5" fill={PURPLE} />
                <text x="180" y={tY(p.t) + 4} fill="#c4b5fd" fontSize="12" fontWeight="700" fontFamily="sans-serif">{p.label} {plain(p.t)} °C</text>
              </g>
            ))}
            {/* drag hit area */}
            <rect x="60" y="10" width="110" height="340" fill="transparent" style={{ cursor: 'ns-resize' }} />

            {/* readout card */}
            <rect x="305" y="22" width="280" height="130" rx="16" fill="#0f172a" stroke="#1e293b" />
            <text x="445" y="50" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">{s.label}</text>
            <text x="445" y="104" textAnchor="middle" fill={cold ? SKY : shown > 0 ? '#fca5a5' : AMBER} fontSize="50" fontWeight="900" fontFamily="monospace">{plain(shown)} °C</text>
            <text x="445" y="136" textAnchor="middle" fill={INK} fontSize="14" fontWeight="700" fontFamily="sans-serif">{phrase}</text>

            {/* picture card */}
            <rect x="305" y="166" width="280" height="176" rx="16" fill={cold ? '#0c1a2e' : '#1c1405'} stroke="#1e293b" />
            {shown > 15 && (
              <g>
                <circle cx="530" cy="206" r="20" fill={AMBER}>
                  <animate attributeName="r" values="19;23;19" dur="2.4s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            <polygon points="315,330 380,232 430,290 480,214 575,330" fill={cold ? '#334155' : '#78350f'} />
            <polygon points="380,232 364,256 396,256" fill={cold ? '#f8fafc' : '#a16207'} />
            <polygon points="480,214 462,240 500,240" fill={cold ? '#f8fafc' : '#a16207'} />
            <rect x="315" y="312" width="260" height="22" rx="6" fill={cold ? '#bae6fd' : '#0284c7'} opacity={cold ? 0.9 : 0.8} />
            {cold && <path d="M 340 322 l 18 -5 l 14 7 M 450 318 l 22 6 l 16 -6" stroke="#e0f2fe" strokeWidth="1.5" fill="none" />}
            <text x="445" y="300" textAnchor="middle" fill={cold ? '#e0f2fe' : '#fde68a'} fontSize="12" fontWeight="700" fontFamily="sans-serif">{cold ? 'the lake has frozen' : 'water flows'}</text>
            {cold && <Snowflakes />}
          </g>
        ) : (
          <g>
            {/* height scale */}
            {Array.from({ length: 11 }, (_, i) => -10 + i * 2).map((h) => (
              <g key={h}>
                <line x1="44" y1={hY(h)} x2={h % 4 === 0 ? 58 : 52} y2={hY(h)} stroke={h === 0 ? AMBER : '#64748b'} strokeWidth={h === 0 ? 3 : 1.5} />
                <text x="38" y={hY(h) + 4} textAnchor="end" fill={h < 0 ? SKY : h > 0 ? '#fca5a5' : AMBER} fontSize="12" fontWeight="700" fontFamily="monospace">{plain(h)}</text>
              </g>
            ))}
            <line x1="50" y1={hY(10)} x2="50" y2={hY(-10)} stroke="#475569" strokeWidth="2" />
            <text x="10" y="18" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">metres</text>
            {/* backwater / sea */}
            <rect x="62" y={hY(0)} width="196" height={H - hY(0)} fill="#0369a1" opacity="0.75" />
            <path d={`M 62 ${hY(0)} q 12 -5 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} stroke="#7dd3fc" strokeWidth="2" fill="none">
              <animateTransform attributeName="transform" type="translate" values="0 0; -24 0; 0 0" dur="3s" repeatCount="indefinite" />
            </path>
            {/* bund (mud wall) */}
            <polygon points={`252,${H} 258,${hY(1)} 284,${hY(1)} 292,${H}`} fill="#92400e" />
            <text x="271" y={hY(1) - 8} textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="700" fontFamily="sans-serif">bund</text>
            {/* Kuttanad field below sea level */}
            <rect x="292" y={hY(-2)} width="230" height={H - hY(-2)} fill="#713f12" />
            {Array.from({ length: 15 }, (_, i) => (
              <path key={i} d={`M ${300 + i * 15} ${hY(-2)} l -4 -14 M ${300 + i * 15} ${hY(-2)} l 0 -17 M ${300 + i * 15} ${hY(-2)} l 4 -14`} stroke="#4ade80" strokeWidth="2" />
            ))}
            {/* high land with coconut tree */}
            <rect x="522" y={hY(1)} width="78" height={H - hY(1)} fill="#78350f" />
            <path d={`M 562 ${hY(1)} q -4 -40 6 -70`} stroke="#a16207" strokeWidth="5" fill="none" />
            {[-60, -20, 20, 60, 180].map((d) => <path key={d} d={`M 568 ${hY(1) - 70} q ${d / 2} -14 ${d} 6`} stroke="#22c55e" strokeWidth="4" fill="none" />)}
            {/* sea level line */}
            <line x1="50" y1={hY(0)} x2="590" y2={hY(0)} stroke={AMBER} strokeWidth="2" strokeDasharray="7 5" />
            <text x="440" y={hY(0) - 6} textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800" fontFamily="sans-serif">sea level = 0 m</text>
            {/* boat */}
            <g transform={`translate(150 ${hY(0)})`}>
              <animateTransform attributeName="transform" type="translate" values={`150 ${hY(0)}; 150 ${hY(0) + 3}; 150 ${hY(0)}`} dur="2.2s" repeatCount="indefinite" />
              <path d="M -26 -8 L 26 -8 L 16 4 L -16 4 Z" fill="#a16207" />
              <path d="M 0 -8 L 0 -36 L 18 -14 Z" fill="#f8fafc" />
            </g>
            {/* fish */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 30 0; 0 0" dur="4s" repeatCount="indefinite" />
              <ellipse cx="110" cy={hY(-6)} rx="16" ry="8" fill="#fb923c" />
              <polygon points={`94,${hY(-6)} 84,${hY(-6) - 8} 84,${hY(-6) + 8}`} fill="#fb923c" />
            </g>
            {/* bird */}
            <path d={`M 196 ${hY(8)} q 7 -9 14 0 q 7 -9 14 0`} stroke={INK} strokeWidth="3" fill="none">
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur="1.2s" repeatCount="indefinite" />
            </path>
            {/* pointer from scale to the chosen spot */}
            <line x1="58" y1={hY(spotH)} x2={spot.x - 22} y2={hY(spotH)} stroke={PINK} strokeWidth="2.5" strokeDasharray="4 4" />
            <polygon points={`58,${hY(spotH)} 70,${hY(spotH) - 7} 70,${hY(spotH) + 7}`} fill={PINK} />
            <circle cx={spot.x} cy={hY(spotH)} r="9" fill="none" stroke={PINK} strokeWidth="3">
              <animate attributeName="r" values="8;16;8" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <rect x="300" y="10" width="285" height="84" rx="12" fill="#0f172a" stroke="#1e293b" />
            <text x="442" y="32" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily="sans-serif">{spot.label}</text>
            <text x="442" y="52" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="sans-serif">{spot.note}</text>
            <text x="442" y="82" textAnchor="middle" fill={PINK} fontSize="22" fontWeight="900" fontFamily="monospace">height = {fmt(round(spotH))} m</text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: The integer number line (railway track): compare, opposites, ordering ───
const nX = (n) => 300 + n * 26;
const LINE_Y = 200;

export function Class6IntegerLineWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ mode: 'line', a: 3, b: -7, nums: [3, -5, 0, -2, 6], station: true, task: null }, visual);
  const [dragging, setDragging] = useState(null);
  const grow = useReplay(`${s.mode}-grow`, 1600);
  const ax = useTween(nX(s.a), 700);
  const bx = useTween(nX(s.b), 700);
  const fold = useReplay(`${s.mode}-${s.a}`, 1500);
  const orderP = useReplay(`${s.mode}-${JSON.stringify(s.nums)}`, 2200);
  const taskDone = !!s.task && round(s.a) === s.task.target;

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const dragProps = useSvgDrag(svgRef, (x) => {
    if (!dragging) return;
    update({ [dragging]: clamp(round((x - 300) / 26), -10, 10) });
  });

  const reach = s.mode === 'line' ? grow * 10 : 10;
  const ticks = Array.from({ length: 21 }, (_, i) => i - 10);
  const cmp = s.a > s.b ? '>' : s.a < s.b ? '<' : '=';
  const big = Math.max(s.a, s.b);
  const small = Math.min(s.a, s.b);
  const sorted = [...s.nums].sort((p, q) => p - q);

  const marker = (key, x, value, color, labelY) => (
    <g style={{ cursor: 'grab' }} onPointerDown={(e) => { setDragging(key); dragProps.onPointerDown(e); }}>
      <rect x={x - 20} y={LINE_Y - 70} width="40" height="80" fill="transparent" />
      <line x1={x} y1={LINE_Y - 34} x2={x} y2={LINE_Y} stroke={color} strokeWidth="3" />
      <polygon points={`${x},${LINE_Y - 2} ${x - 9},${LINE_Y - 16} ${x + 9},${LINE_Y - 16}`} fill={color} />
      <circle cx={x} cy={LINE_Y} r="7" fill={color} />
      <text x={x} y={labelY} textAnchor="middle" fill={color} fontSize="20" fontWeight="900" fontFamily="monospace">{plain(value)}</text>
    </g>
  );

  return (
    <StoryStage
      eyebrow="Visualizer · Number Line"
      title={{ line: 'Integers on a number line', compare: 'Which integer is greater?', opposite: 'Opposites: mirror images about zero', order: 'Putting integers in order' }[s.mode]}
      footer={
        <div className="space-y-3">
          <ModePills
            value={s.mode}
            onChange={(mode) => update({ mode })}
            options={[{ value: 'line', label: 'Number line' }, { value: 'compare', label: 'Compare' }, { value: 'opposite', label: 'Opposites' }, { value: 'order', label: 'Order' }]}
          />
          {s.task && <TaskBanner text={s.task.text} done={taskDone} />}
          <div className="flex flex-wrap items-center gap-3">
            {s.mode === 'compare' && <Readout label="Bigger" value={plain(big)} tone="text-amber-300" />}
            {s.mode === 'compare' && <Readout label="Smaller" value={plain(small)} tone="text-sky-300" />}
            {s.mode === 'opposite' && <Readout label="Number" value={plain(s.a)} tone="text-amber-300" />}
            {s.mode === 'opposite' && <Readout label="Opposite" value={plain(-s.a)} tone="text-pink-300" />}
            <p className="text-sm text-slate-300 flex-1 min-w-[200px]">
              {{
                line: 'Zero sits in the middle. Positive integers go right, negative integers go left, forever both ways.',
                compare: 'Drag the markers. The one further to the RIGHT is always the bigger integer.',
                opposite: 'Drag the amber marker. A number and its opposite are the same distance from 0 and add up to 0.',
                order: 'Smallest is furthest left, biggest is furthest right. Read the line from left to right.',
              }[s.mode]}
            </p>
          </div>
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps} onPointerUp={(e) => { dragProps.onPointerUp(e); setDragging(null); }}>
        <rect width={W} height={H} fill="#020617" />
        {/* sleepers make the line look like Papa's railway track */}
        {ticks.map((n) => Math.abs(n) <= reach && (
          <rect key={`s${n}`} x={nX(n) - 4} y={LINE_Y - 9} width="8" height="18" rx="2" fill="#78350f" opacity="0.55" />
        ))}
        <line x1={nX(-reach) - 10} y1={LINE_Y} x2={nX(reach) + 10} y2={LINE_Y} stroke={INK} strokeWidth="4" />
        {reach > 9.9 && <Arrowhead x={nX(10) + 22} y={LINE_Y} deg={0} />}
        {reach > 9.9 && <Arrowhead x={nX(-10) - 22} y={LINE_Y} deg={180} />}
        {ticks.map((n) => Math.abs(n) <= reach + 0.01 && (
          <g key={n}>
            <line x1={nX(n)} y1={LINE_Y - 8} x2={nX(n)} y2={LINE_Y + 8} stroke={n === 0 ? AMBER : '#94a3b8'} strokeWidth={n === 0 ? 3 : 2} />
            <text x={nX(n)} y={LINE_Y + 28} textAnchor="middle" fill={n < 0 ? SKY : n > 0 ? '#fca5a5' : AMBER} fontSize="13" fontWeight="700" fontFamily="monospace">{plain(n)}</text>
          </g>
        ))}
        {s.mode === 'line' && (
          <g opacity={grow}>
            <text x={nX(-5)} y={LINE_Y + 62} textAnchor="middle" fill={SKY} fontSize="15" fontWeight="800" fontFamily="sans-serif">← negative integers</text>
            <text x={nX(5)} y={LINE_Y + 62} textAnchor="middle" fill="#fca5a5" fontSize="15" fontWeight="800" fontFamily="sans-serif">positive integers →</text>
            <text x={300} y={LINE_Y + 90} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="700" fontFamily="sans-serif">0 is neither positive nor negative</text>
            <text x={300} y={LINE_Y + 116} textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">Integers: … −3, −2, −1, 0, 1, 2, 3 …</text>
          </g>
        )}
        {s.station && s.mode === 'line' && (
          <g>
            <rect x="268" y="122" width="64" height="40" rx="4" fill="#7c2d12" stroke="#fdba74" strokeWidth="2" />
            <polygon points="262,124 300,98 338,124" fill="#b45309" />
            <text x="300" y="147" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="800" fontFamily="sans-serif">JUNCTION</text>
            <text x={nX(-6)} y="140" textAnchor="middle" fill={SKY} fontSize="13" fontWeight="700" fontFamily="sans-serif">km to the west</text>
            <text x={nX(6)} y="140" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="700" fontFamily="sans-serif">km to the east</text>
          </g>
        )}

        {s.mode === 'compare' && (
          <g>
            <text x="300" y="62" textAnchor="middle" fontSize="40" fontWeight="900" fontFamily="monospace">
              <tspan fill={AMBER}>{plain(s.a)}</tspan>
              <tspan fill={INK}> {cmp} </tspan>
              <tspan fill={SKY}>{plain(s.b)}</tspan>
            </text>
            <text x="300" y="92" textAnchor="middle" fill="#cbd5e1" fontSize="14" fontFamily="sans-serif">
              {s.a === s.b ? 'Same place on the line: equal.' : `${plain(big)} is to the right of ${plain(small)}, so ${plain(big)} is greater.`}
            </text>
            <line x1={nX(-9)} y1={LINE_Y + 70} x2={nX(9)} y2={LINE_Y + 70} stroke="#475569" strokeWidth="2" />
            <Arrowhead x={nX(9) + 6} y={LINE_Y + 70} deg={0} color="#94a3b8" />
            <text x="300" y={LINE_Y + 94} textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">bigger and bigger as you go right →</text>
            {marker('b', bx, s.b, SKY, LINE_Y - 44)}
            {marker('a', ax, s.a, AMBER, LINE_Y - 44)}
          </g>
        )}

        {s.mode === 'opposite' && (() => {
          const ox = nX(-s.a);
          const gx = ax + (ox - ax) * fold;
          const gy = LINE_Y - 40 - Math.sin(Math.PI * fold) * 70;
          const d = Math.abs(s.a);
          return (
            <g>
              {d > 0 && (
                <g>
                  <path d={`M ${nX(0)} ${LINE_Y + 46} L ${nX(0)} ${LINE_Y + 54} L ${nX(s.a)} ${LINE_Y + 54} L ${nX(s.a)} ${LINE_Y + 46}`} fill="none" stroke={AMBER} strokeWidth="2" />
                  <path d={`M ${nX(0)} ${LINE_Y + 46} L ${nX(0)} ${LINE_Y + 54} L ${ox} ${LINE_Y + 54} L ${ox} ${LINE_Y + 46}`} fill="none" stroke={PINK} strokeWidth="2" opacity={fold} transform={`translate(0 18)`} />
                  <text x={(nX(0) + nX(s.a)) / 2} y={LINE_Y + 72} textAnchor="middle" fill={AMBER} fontSize="13" fontWeight="700" fontFamily="sans-serif">{d} steps</text>
                  <text x={(nX(0) + ox) / 2} y={LINE_Y + 90} textAnchor="middle" fill={PINK} fontSize="13" fontWeight="700" fontFamily="sans-serif" opacity={fold}>{d} steps</text>
                  <path d={`M ${ax} ${LINE_Y - 40} Q ${(ax + ox) / 2} ${LINE_Y - 180} ${ox} ${LINE_Y - 40}`} fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
                  {fold < 0.98 && <circle cx={gx} cy={gy} r="8" fill={PINK} />}
                </g>
              )}
              <line x1="300" y1="100" x2="300" y2={LINE_Y + 10} stroke={AMBER} strokeWidth="2" strokeDasharray="4 4" />
              <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">
                opposite of {plain(s.a)} is {plain(-s.a)}
              </text>
              <text x="300" y="70" textAnchor="middle" fill={GREEN} fontSize="17" fontWeight="800" fontFamily="monospace" opacity={fold}>
                {paren(s.a)} + {paren(-s.a)} = 0
              </text>
              {fold > 0.98 && (
                <g>
                  <circle cx={ox} cy={LINE_Y} r="7" fill={PINK} />
                  <text x={ox} y={LINE_Y - 44} textAnchor="middle" fill={PINK} fontSize="20" fontWeight="900" fontFamily="monospace">{plain(-s.a)}</text>
                </g>
              )}
              {marker('a', ax, s.a, AMBER, LINE_Y - 44)}
            </g>
          );
        })()}

        {s.mode === 'order' && (
          <g>
            {s.nums.map((n, i) => {
              const t = clamp(orderP * (s.nums.length + 1) - i, 0, 1);
              const sx = 300 + (i - (s.nums.length - 1) / 2) * 70;
              const x = sx + (nX(n) - sx) * t;
              const level = sorted.indexOf(n) % 2;
              const y = 40 + (LINE_Y - 66 - level * 44 - 40) * t;
              return (
                <g key={`${n}-${i}`}>
                  {t > 0.98 && <line x1={x} y1={y + 30} x2={x} y2={LINE_Y} stroke={PURPLE} strokeWidth="2" strokeDasharray="3 3" />}
                  <rect x={x - 22} y={y} width="44" height="30" rx="8" fill="#1e1b4b" stroke={PURPLE} strokeWidth="2" />
                  <text x={x} y={y + 21} textAnchor="middle" fill="#ddd6fe" fontSize="16" fontWeight="900" fontFamily="monospace">{plain(n)}</text>
                </g>
              );
            })}
            <text x="300" y={LINE_Y + 80} textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace" opacity={orderP > 0.95 ? 1 : 0} style={{ transition: 'opacity 500ms' }}>
              {sorted.map(plain).join('  <  ')}
            </text>
            <text x="300" y={LINE_Y + 108} textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif" opacity={orderP > 0.95 ? 1 : 0}>
              ascending order: read the cards from left to right
            </text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: The Building of Fun lift (addition as moving up and down) ───
const FLOORS = [
  { f: 5, name: 'Sky Deck' }, { f: 4, name: 'Toy Shop' }, { f: 3, name: 'Games Zone' }, { f: 2, name: 'Food Court' },
  { f: 1, name: 'Book Shop' }, { f: 0, name: 'Entrance' }, { f: -1, name: 'Car Parking' }, { f: -2, name: 'Bowling' },
  { f: -3, name: 'Ice Rink' },
];
const floorTop = (f) => 22 + (5 - f) * 34;
const floorName = (f) => (FLOORS.find((x) => x.f === f) || {}).name || '';

export function Class6LiftWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ start: 0, moves: [], task: null }, visual);
  const key = JSON.stringify([s.start, s.moves]);
  const step = useStepper(key, s.moves.length, 1000, 250);
  const done = step >= s.moves.length;
  const target = s.start + sum(s.moves.slice(0, step));
  const f = useTween(target, 850);
  const moving = Math.abs(f - target) > 0.02;
  const finalFloor = s.start + sum(s.moves);
  const taskDone = !!s.task && done && !moving && finalFloor === s.task.target;

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const press = (m) => {
    const next = finalFloor + m;
    if (next > 5 || next < -3) return;
    update({ start: finalFloor, moves: [m] });
  };

  const carY = floorTop(f) + 3;
  const doorGap = moving ? 0 : 9;
  const trailX0 = 352;
  let cur = s.start;

  return (
    <StoryStage
      eyebrow="Visualizer · Building of Fun"
      title="The lift: up is plus, down is minus"
      accent="text-emerald-400"
      footer={
        <div className="space-y-3">
          {s.task && <TaskBanner text={s.task.text} done={taskDone} />}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-bold">Lift buttons:</span>
            {[1, 2, 3].map((m) => (
              <button key={m} onClick={() => press(m)} className="px-2.5 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/60 text-emerald-300 text-sm font-black hover:bg-emerald-600/40">▲ {fmt(m)}</button>
            ))}
            {[-1, -2, -3].map((m) => (
              <button key={m} onClick={() => press(m)} className="px-2.5 py-1 rounded-lg bg-rose-600/20 border border-rose-500/60 text-rose-300 text-sm font-black hover:bg-rose-600/40">▼ {fmt(m)}</button>
            ))}
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-base md:text-lg font-black text-center">
            <span className="text-amber-300">{paren(s.start)}</span>
            {s.moves.slice(0, step).map((m, i) => (
              <span key={i} className={m > 0 ? 'text-emerald-300' : 'text-rose-300'}> + {paren(m)}</span>
            ))}
            {done && <span className="text-white"> = {plain(finalFloor)}</span>}
          </div>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <rect x="0" y="0" width={W} height={floorTop(0) + 34} fill="#0b1730" />
        <rect x="0" y={floorTop(0) + 34} width={W} height={H} fill="#1c1208" />
        <text x="590" y={floorTop(0) + 54} textAnchor="end" fill="#a16207" fontSize="12" fontWeight="800" fontFamily="sans-serif">UNDERGROUND</text>
        <line x1="0" y1={floorTop(0) + 34} x2={W} y2={floorTop(0) + 34} stroke="#65a30d" strokeWidth="4" />
        <text x="590" y={floorTop(0) + 28} textAnchor="end" fill="#a3e635" fontSize="12" fontWeight="800" fontFamily="sans-serif">GROUND LEVEL</text>

        {/* building and floors */}
        <rect x="110" y={floorTop(5)} width="222" height={9 * 34} fill="#111827" stroke="#334155" strokeWidth="2" />
        {FLOORS.map(({ f: fl, name }) => {
          const here = done && !moving && fl === target;
          return (
            <g key={fl}>
              <line x1="110" y1={floorTop(fl) + 34} x2="332" y2={floorTop(fl) + 34} stroke="#334155" strokeWidth="2" />
              <rect x="111" y={floorTop(fl) + 1} width="160" height="32" fill={here ? '#422006' : 'transparent'} style={{ transition: 'fill 400ms' }} />
              <text x="122" y={floorTop(fl) + 22} fill={here ? AMBER : '#cbd5e1'} fontSize="13" fontWeight={here ? 900 : 600} fontFamily="sans-serif">{name}</text>
              <text x="96" y={floorTop(fl) + 23} textAnchor="end" fill={fl > 0 ? '#86efac' : fl < 0 ? '#fda4af' : AMBER} fontSize="17" fontWeight="900" fontFamily="monospace">{fmt(fl)}</text>
            </g>
          );
        })}
        {/* lift shaft and car */}
        <rect x="276" y={floorTop(5)} width="52" height={9 * 34} fill="#0f172a" stroke="#475569" />
        <line x1="302" y1={floorTop(5)} x2="302" y2={carY} stroke="#64748b" strokeWidth="1.5" />
        <g>
          <rect x="280" y={carY} width="44" height="28" rx="3" fill="#334155" stroke={AMBER} strokeWidth="2" />
          <circle cx="302" cy={carY + 10} r="5" fill="#fcd34d" />
          <rect x="297" y={carY + 15} width="10" height="11" rx="2" fill={SKY} />
          <rect x="281" y={carY + 1} width={21 - doorGap} height="26" fill="#94a3b8" style={{ transition: 'width 400ms' }} />
          <rect x={302 + doorGap} y={carY + 1} width={21 - doorGap} height="26" fill="#94a3b8" style={{ transition: 'x 400ms, width 400ms' }} />
        </g>

        {/* trail of moves */}
        {s.moves.map((m, i) => {
          const from = cur;
          cur += m;
          if (i >= step) return null;
          const x = trailX0 + i * 44;
          const y1 = floorTop(from) + 17;
          const y2 = floorTop(from + m) + 17;
          const color = m > 0 ? GREEN : RED;
          return (
            <g key={i}>
              <line x1={x} y1={y1} x2={x} y2={y2 + (m > 0 ? 8 : -8)} stroke={color} strokeWidth="4" />
              <Arrowhead x={x} y={y2} deg={m > 0 ? 90 : -90} color={color} size={11} />
              <circle cx={x} cy={y1} r="4" fill={color} />
              <text x={x + 8} y={(y1 + y2) / 2 + 4} fill={color} fontSize="14" fontWeight="900" fontFamily="monospace">{fmt(m)}</text>
            </g>
          );
        })}

        {/* readout */}
        <rect x="450" y="40" width="138" height="96" rx="14" fill="#0f172a" stroke="#1e293b" />
        <text x="519" y="62" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="sans-serif">LIFT IS AT FLOOR</text>
        <text x="519" y="104" textAnchor="middle" fill={round(f) < 0 ? '#fda4af' : round(f) > 0 ? '#86efac' : AMBER} fontSize="38" fontWeight="900" fontFamily="monospace">{fmt(round(f))}</text>
        <text x="519" y="126" textAnchor="middle" fill={INK} fontSize="12" fontWeight="700" fontFamily="sans-serif">{floorName(round(f))}</text>
        <text x="519" y="166" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily="sans-serif">▲ up = add positive</text>
        <text x="519" y="186" textAnchor="middle" fill="#fda4af" fontSize="12" fontWeight="700" fontFamily="sans-serif">▼ down = add negative</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: The token model (red +1, green −1, zero pairs) for addition and subtraction ───
const TOKEN_R = 15;

function trayGrid(n, cx, y0, per = 6, gap = 36) {
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / per);
    const inRow = Math.min(per, n - row * per);
    return [cx - ((inRow - 1) * gap) / 2 + (i % per) * gap, y0 + row * 38];
  });
}

// Builds every token with its position/opacity for each stage of the animation
function tokenPlan(op, a, b) {
  const sgn = (n) => (n < 0 ? -1 : 1);
  const tokens = [];
  if (op === 'add') {
    const A = trayGrid(Math.abs(a), 158, 84);
    const B = trayGrid(Math.abs(b), 442, 84);
    const reds = [];
    const greens = [];
    A.forEach((p, i) => { const t = { id: `a${i}`, v: sgn(a), tray: p }; tokens.push(t); (t.v > 0 ? reds : greens).push(t); });
    B.forEach((p, i) => { const t = { id: `b${i}`, v: sgn(b), tray: p }; tokens.push(t); (t.v > 0 ? reds : greens).push(t); });
    const pairs = Math.min(reds.length, greens.length);
    const cols = Math.max(reds.length, greens.length);
    const colX = (i, n) => 300 - ((n - 1) * 42) / 2 + i * 42;
    const place = (list, y) => list.forEach((t, i) => {
      const paired = i < pairs;
      const box = [colX(i, cols), y];
      const left = list.length - pairs;
      const fin = paired ? box : [colX(i - pairs, left), y];
      t.col = i;
      t.paired = paired;
      t.frames = [
        { p: t.tray, o: 1, sc: 1 },
        { p: box, o: 1, sc: 1 },
        { p: box, o: 1, sc: 1 },
        { p: box, o: paired ? 0 : 1, sc: paired ? 0.2 : 1, delay: paired ? i * 120 : 0 },
        { p: fin, o: paired ? 0 : 1, sc: paired ? 0.2 : 1 },
      ];
    });
    place(reds, 212);
    place(greens, 262);
    const result = a + b;
    return { tokens, stages: 4, pairs, cols, colX, result, k: 0 };
  }
  // subtraction a − b
  const need = Math.abs(b);
  const sameSign = a !== 0 && b !== 0 && sgn(a) === sgn(b);
  const k = b === 0 ? 0 : sameSign ? Math.max(0, need - Math.abs(a)) : need;
  const own = trayGrid(Math.abs(a), 230, 108, 10, 36);
  own.forEach((p, i) => tokens.push({ id: `a${i}`, v: sgn(a), at: p }));
  for (let i = 0; i < k; i += 1) {
    const x = 230 - ((k - 1) * 40) / 2 + i * 40;
    tokens.push({ id: `pr${i}`, v: 1, at: [x, 168], pair: i, added: true });
    tokens.push({ id: `pg${i}`, v: -1, at: [x, 208], pair: i, added: true });
  }
  // tokens of b's colour get taken away: own tokens first, then from the added pairs
  const takeColour = sgn(b);
  const takeable = [...tokens.filter((t) => !t.added && t.v === takeColour), ...tokens.filter((t) => t.added && t.v === takeColour)];
  const taken = b === 0 ? [] : takeable.slice(0, need);
  const takenIds = new Set(taken.map((t) => t.id));
  const tray = trayGrid(need, 515, 108, 3, 34);
  const left = tokens.filter((t) => !takenIds.has(t.id));
  const fin = trayGrid(left.length, 230, 160, 10, 36);
  tokens.forEach((t) => {
    const ti = taken.findIndex((x) => x.id === t.id);
    const li = left.findIndex((x) => x.id === t.id);
    const hidden = t.added ? { p: t.at, o: 0, sc: 0.2 } : { p: t.at, o: 1, sc: 1 };
    const shown = { p: t.at, o: 1, sc: 1, delay: t.added ? t.pair * 110 : 0 };
    const away = ti >= 0 ? { p: tray[ti], o: 0.4, sc: 0.85, delay: ti * 110 } : { p: t.at, o: 1, sc: 1 };
    const end = ti >= 0 ? { p: tray[ti], o: 0.4, sc: 0.85 } : { p: fin[li], o: 1, sc: 1, delay: li * 40 };
    t.frames = [hidden, shown, away, end];
  });
  return { tokens, stages: 3, k, need, takeColour, result: a - b };
}

function Token({ t, frame }) {
  const { p, o, sc, delay = 0 } = frame;
  return (
    <g style={{ transform: `translate(${p[0]}px, ${p[1]}px) scale(${sc})`, opacity: o, transition: 'transform 600ms ease, opacity 450ms ease', transitionDelay: `${delay}ms` }}>
      <circle r={TOKEN_R} fill={t.v > 0 ? TOKEN_POS : TOKEN_NEG} stroke="#f8fafc" strokeOpacity="0.5" strokeWidth="2" />
      <text y="7" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="sans-serif">{t.v > 0 ? '+' : MINUS}</text>
    </g>
  );
}

const describe = (n) => (n === 0 ? 'nothing (zero)' : `${Math.abs(n)} ${n > 0 ? 'red' : 'green'}`);

export function Class6TokensWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ op: 'add', a: 3, b: -5, upTo: 4, play: 0, task: null, rule: false }, visual);
  const plan = tokenPlan(s.op, s.a, s.b);
  const upTo = Math.min(s.upTo, plan.stages);
  const planKey = `${s.op}|${s.a}|${s.b}`;
  const stage = useStepper(`${planKey}|${upTo}|${s.play}`, upTo, 550, 300);
  const finished = stage >= plan.stages;
  const exprText = `${paren(s.a)} ${s.op === 'add' ? '+' : MINUS} ${paren(s.b)}`;

  const t = s.task;
  const taskDone = !!t && finished && (t.kind === 'sumTo'
    ? s.op === 'add' && s.a + s.b === t.target && s.a * s.b < 0
    : s.op === t.op && s.a === t.a && s.b === t.b);

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const setVal = (patch) => update({ ...patch, upTo: 0, play: Date.now() });
  const lim = s.op === 'add' ? 6 : 5;

  let caption;
  if (s.op === 'add') {
    caption = [
      `${exprText}: two groups of tokens`,
      'Put them all together in one box',
      plan.pairs ? `Match each red with a green: ${plan.pairs} zero pair${plan.pairs > 1 ? 's' : ''}` : 'No red-green pairs to match',
      plan.pairs ? 'Each zero pair is worth 0. Remove them!' : 'Nothing to cancel',
      `Left: ${describe(plan.result)}, so ${exprText} = ${plain(plan.result)}`,
    ][stage];
  } else {
    const colour = plan.takeColour > 0 ? 'red' : 'green';
    caption = [
      `${exprText}: start with ${describe(s.a)}`,
      plan.k ? `Need ${plan.need} ${colour} to take away. Add ${plan.k} zero pair${plan.k > 1 ? 's' : ''}: value stays ${plain(s.a)}` : 'Enough tokens already: no zero pairs needed',
      plan.need ? `Take away ${plan.need} ${colour} token${plan.need > 1 ? 's' : ''}` : 'Nothing to take away',
      `Left: ${describe(plan.result)}, so ${exprText} = ${plain(plan.result)}`,
    ][stage];
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Token Model"
      title={s.op === 'add' ? 'Adding with tokens: zero pairs vanish' : 'Subtracting with tokens: take away'}
      accent="text-rose-400"
      footer={
        <div className="space-y-3">
          {t && <TaskBanner text={t.text} done={taskDone} />}
          <div className="flex flex-wrap items-center gap-3">
            <ModePills value={s.op} onChange={(op) => setVal({ op, a: clamp(s.a, -5, 5), b: clamp(s.b, -5, 5) })} options={[{ value: 'add', label: 'Add +' }, { value: 'sub', label: `Subtract ${MINUS}` }]} />
            <Stepper label="first" value={s.a} min={-lim} max={lim} onChange={(a) => setVal({ a })} />
            <Stepper label={s.op === 'add' ? 'add' : 'take'} value={s.b} min={-lim} max={lim} onChange={(b) => setVal({ b })} tone="text-sky-300" />
            <button onClick={() => update({ upTo: 4, play: Date.now() })} className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold">▶ Play</button>
          </div>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.op === 'add' ? (
          <g>
            <rect x="24" y="30" width="268" height="110" rx="14" fill="#0f172a" stroke="#334155" opacity={stage === 0 ? 1 : 0.35} />
            <rect x="308" y="30" width="268" height="110" rx="14" fill="#0f172a" stroke="#334155" opacity={stage === 0 ? 1 : 0.35} />
            <text x="158" y="54" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily="monospace">{paren(s.a)}</text>
            <text x="442" y="54" textAnchor="middle" fill={SKY} fontSize="16" fontWeight="900" fontFamily="monospace">{paren(s.b)}</text>
            <text x="300" y="92" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">+</text>
            <rect x="24" y="180" width="552" height="116" rx="14" fill="#0b1222" stroke={stage >= 1 ? AMBER : '#334155'} strokeDasharray={stage >= 1 ? '' : '6 6'} style={{ transition: 'stroke 400ms' }} />
            {Array.from({ length: plan.pairs }, (_, i) => (
              <g key={`pair${planKey}${i}`} style={{ opacity: stage === 2 ? 1 : 0, transition: 'opacity 400ms' }}>
                <rect x={plan.colX(i, plan.cols) - 19} y="193" width="38" height="88" rx="12" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="4 3" />
                <text x={plan.colX(i, plan.cols)} y="291" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight="900" fontFamily="monospace">0</text>
              </g>
            ))}
            {plan.pairs > 0 && (
              <text x="572" y="172" textAnchor="end" fill={AMBER} fontSize="12" fontWeight="800" fontFamily="sans-serif" style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 400ms' }}>
                {plan.pairs} zero pair{plan.pairs > 1 ? 's' : ''} removed (each = 0)
              </text>
            )}
          </g>
        ) : (
          <g>
            <rect x="24" y="58" width="412" height="214" rx="14" fill="#0b1222" stroke="#334155" />
            <text x="40" y="80" fill={AMBER} fontSize="14" fontWeight="900" fontFamily="monospace">{stage >= 2 ? 'left' : 'start'}: {stage >= 2 ? (finished ? paren(plan.result) : '…') : paren(s.a)}</text>
            <rect x="452" y="58" width="126" height="214" rx="14" fill="#1f0a0a" stroke="#7f1d1d" strokeDasharray="6 5" />
            <text x="515" y="80" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="800" fontFamily="sans-serif">taken away</text>
            <text x="300" y="44" textAnchor="middle" fill={INK} fontSize="24" fontWeight="900" fontFamily="monospace">{exprText} = {finished ? plain(plan.result) : '?'}</text>
            {Array.from({ length: plan.k }, (_, i) => {
              const x = 230 - ((plan.k - 1) * 40) / 2 + i * 40;
              return (
                <g key={`zp${planKey}${i}`} style={{ opacity: stage === 1 ? 1 : 0, transition: 'opacity 400ms' }}>
                  <rect x={x - 19} y="149" width="38" height="78" rx="12" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="4 3" />
                </g>
              );
            })}
            {plan.k > 0 && (
              <text x="230" y="258" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800" fontFamily="sans-serif" style={{ opacity: stage >= 1 ? 1 : 0, transition: 'opacity 400ms' }}>
                {plan.k} zero pair{plan.k > 1 ? 's' : ''} added (each is worth 0)
              </text>
            )}
          </g>
        )}
        <g key={planKey}>
          {plan.tokens.map((tk) => <Token key={tk.id} t={tk} frame={tk.frames[Math.min(stage, tk.frames.length - 1)]} />)}
        </g>
        <text x="300" y={s.op === 'add' ? 334 : 300} textAnchor="middle" fill={finished ? GREEN : INK} fontSize="15" fontWeight="800" fontFamily="sans-serif">{caption}</text>
        {s.op === 'sub' && s.rule && (
          <g>
            <rect x="60" y="314" width="480" height="34" rx="10" fill="#052e16" stroke="#10b981" strokeOpacity="0.5" />
            <text x="300" y="336" textAnchor="middle" fill="#6ee7b7" fontSize="14" fontWeight="800" fontFamily="monospace">
              same as {paren(s.a)} + {paren(-s.b)} = {plain(s.a - s.b)} · subtract = add the opposite
            </text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Integers in real life (Mummy's freezer, Papa's railway, cricket, money) ───
function niceStep(range) {
  return [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((st) => range / st <= 10) || 1000;
}

// Animated jumps on a number line strip at the bottom of the stage
function JumpStrip({ points, progress, unit = '', y = 318 }) {
  const lo0 = Math.min(0, ...points);
  const hi0 = Math.max(0, ...points);
  const step = niceStep(hi0 - lo0 || 10);
  const lo = Math.floor(lo0 / step) * step - (lo0 % step === 0 ? step : 0);
  const hi = Math.ceil(hi0 / step) * step + (hi0 % step === 0 ? step : 0);
  const x = (v) => 50 + ((v - lo) / (hi - lo)) * 500;
  const n = points.length - 1;
  const ticks = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(v);
  return (
    <g>
      <line x1="36" y1={y} x2="564" y2={y} stroke={INK} strokeWidth="2.5" />
      <Arrowhead x={570} y={y} deg={0} size={9} />
      <Arrowhead x={30} y={y} deg={180} size={9} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={y - 5} x2={x(v)} y2={y + 5} stroke={v === 0 ? AMBER : '#94a3b8'} strokeWidth={v === 0 ? 3 : 1.5} />
          <text x={x(v)} y={y + 22} textAnchor="middle" fill={v < 0 ? SKY : v > 0 ? '#fca5a5' : AMBER} fontSize="12" fontWeight="700" fontFamily="monospace">{plain(v)}</text>
        </g>
      ))}
      {points.slice(1).map((p, i) => {
        const t = clamp(progress * n - i, 0, 1);
        const x1 = x(points[i]);
        const x2 = x(p);
        const ly = y - 16 - i * 18;
        const xe = x1 + (x2 - x1) * t;
        const d = p - points[i];
        const color = d >= 0 ? GREEN : RED;
        return (
          d !== 0 && (
            <g key={i} opacity={t > 0 ? 1 : 0}>
              <line x1={x1} y1={y} x2={x1} y2={ly} stroke={color} strokeWidth="1.5" strokeDasharray="2 3" />
              <line x1={x1} y1={ly} x2={xe} y2={ly} stroke={color} strokeWidth="3" />
              {t > 0.05 && <Arrowhead x={xe} y={ly} deg={d > 0 ? 0 : 180} color={color} size={9} />}
              {t > 0.95 && <line x1={x2} y1={ly} x2={x2} y2={y} stroke={color} strokeWidth="1.5" strokeDasharray="2 3" />}
              {t > 0.95 && <text x={(x1 + x2) / 2} y={ly - 5} textAnchor="middle" fill={color} fontSize="12" fontWeight="900" fontFamily="monospace">{fmt(d)}{unit}</text>}
            </g>
          )
        );
      })}
      <circle cx={x(points[0])} cy={y} r="5" fill={AMBER} />
    </g>
  );
}

const TRACK = [[30, 0], [110, 0], [160, 20], [270, 20], [320, 0], [370, 0], [430, -15], [480, -15], [530, 0], [580, 0]];
const railY = (h) => 175 - 3 * h;
function trackHeight(x) {
  for (let i = 1; i < TRACK.length; i += 1) {
    const [x1, h1] = TRACK[i - 1];
    const [x2, h2] = TRACK[i];
    if (x <= x2) return h1 + ((h2 - h1) * (x - x1)) / (x2 - x1);
  }
  return 0;
}

const LEDGERS = {
  cricket: {
    title: "Harsh's team: run difference",
    unit: '',
    items: [{ label: 'Match 1', v: 18 }, { label: 'Match 2', v: -25 }, { label: 'Match 3', v: 4 }],
    word: (v) => (v > 0 ? `won by ${v}` : `lost by ${-v}`),
    totalLabel: 'Run difference',
  },
  money: {
    title: "Mummy's bakery account",
    unit: '',
    items: [{ label: 'Laddoo order', v: 500 }, { label: 'Flour and ghee', v: -800 }, { label: 'Cake order', v: 200 }],
    word: (v) => (v > 0 ? `credit ${inr(v)}` : `debit ${inr(-v)}`),
    totalLabel: 'Balance',
    money: true,
  },
};

export function Class6IntegerStoriesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'freezer', start: 25, end: -18, pos: 0, showDiff: false, task: null, play: 0 }, visual);
  const replayKey = s.mode === 'freezer' ? `f${s.start}|${s.end}|${s.play}` : `${s.mode}|${s.play}`;
  const p = useReplay(replayKey, 2000);
  const pos = useTween(s.pos, 1600);
  const taskDone = !!s.task && s.mode === 'freezer' && s.end === s.task.end && s.start === s.task.start;

  useEffect(() => {
    if (taskDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDone]);

  const ledger = LEDGERS[s.mode];
  const titles = { freezer: "Mummy's freezer: temperature change", rail: "Papa's railway: bridge and tunnel", cricket: 'Cricket: run difference', money: 'Money: credit and debit' };

  return (
    <StoryStage
      eyebrow="Visualizer · Integers in Real Life"
      title={titles[s.mode]}
      accent="text-purple-400"
      footer={
        <div className="space-y-3">
          <ModePills
            value={s.mode}
            onChange={(mode) => update({ mode })}
            options={[{ value: 'freezer', label: 'Freezer' }, { value: 'rail', label: 'Railway' }, { value: 'cricket', label: 'Cricket' }, { value: 'money', label: 'Money' }]}
          />
          {s.task && <TaskBanner text={s.task.text} done={taskDone} />}
          {s.mode === 'freezer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs text-slate-400">
                Start temperature: <span className="text-amber-300 font-mono font-bold">{plain(s.start)} °C</span>
                <input type="range" min="-20" max="35" value={s.start} onChange={(e) => update({ start: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <label className="block text-xs text-slate-400">
                End temperature: <span className="text-sky-300 font-mono font-bold">{plain(s.end)} °C</span>
                <input type="range" min="-25" max="35" value={s.end} onChange={(e) => update({ end: +e.target.value })} className="w-full accent-sky-400" />
              </label>
            </div>
          )}
          {s.mode === 'rail' && (
            <div className="flex flex-wrap items-center gap-3">
              <label className="block text-xs text-slate-400 flex-1 min-w-[200px]">
                Move the train
                <input type="range" min="0" max="100" value={round(s.pos * 100)} onChange={(e) => update({ pos: +e.target.value / 100 })} className="w-full accent-purple-400" />
              </label>
              <button onClick={() => update({ showDiff: !s.showDiff })} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">{s.showDiff ? 'Hide' : 'Show'} height difference</button>
            </div>
          )}
          {ledger && (
            <button onClick={() => update({ play: Date.now() })} className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold">▶ Replay</button>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'freezer' && (() => {
          const now = s.start + (s.end - s.start) * p;
          const fy = (t) => 250 - (t + 30) * (200 / 70);
          const change = s.end - s.start;
          const cold = now < 0;
          return (
            <g>
              {/* freezer */}
              <rect x="40" y="24" width="180" height="236" rx="14" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
              <rect x="52" y="36" width="156" height="90" rx="8" fill="#0c4a6e" />
              <rect x="52" y="136" width="156" height="112" rx="8" fill="#cbd5e1" />
              <rect x="196" y="60" width="6" height="40" rx="3" fill="#64748b" />
              <rect x="196" y="160" width="6" height="50" rx="3" fill="#64748b" />
              <text x="130" y="54" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="800" fontFamily="sans-serif">FREEZER</text>
              {/* tray of water turning into ice */}
              <rect x="78" y="80" width="104" height="34" rx="5" fill={cold ? '#e0f2fe' : '#0ea5e9'} stroke="#f8fafc" strokeWidth="2" style={{ transition: 'fill 500ms' }} />
              {[0, 1, 2, 3].map((i) => <line key={i} x1={78 + (i + 1) * 20.8} y1="80" x2={78 + (i + 1) * 20.8} y2="114" stroke="#f8fafc" strokeWidth="1.5" />)}
              {cold && [0, 1, 2].map((i) => (
                <text key={i} x={70 + i * 55} y="76" fill="#f0f9ff" fontSize="14" fontFamily="sans-serif">
                  ❄<animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
                </text>
              ))}
              {/* thermometer */}
              <rect x="252" y="26" width="18" height="228" rx="9" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <rect x="257" y={fy(now)} width="8" height={Math.max(0, 254 - fy(now))} rx="4" fill={cold ? SKY : RED} />
              {[-30, -20, -10, 0, 10, 20, 30, 40].map((t) => (
                <g key={t}>
                  <line x1="272" y1={fy(t)} x2="282" y2={fy(t)} stroke={t === 0 ? AMBER : '#64748b'} strokeWidth={t === 0 ? 3 : 1.5} />
                  <text x="286" y={fy(t) + 4} fill={t < 0 ? SKY : t > 0 ? '#fca5a5' : AMBER} fontSize="11" fontWeight="700" fontFamily="monospace">{plain(t)}</text>
                </g>
              ))}
              {/* readouts */}
              <rect x="330" y="24" width="250" height="236" rx="14" fill="#0f172a" stroke="#1e293b" />
              <text x="350" y="56" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">Start</text>
              <text x="560" y="56" textAnchor="end" fill={s.start < 0 ? SKY : '#fca5a5'} fontSize="20" fontWeight="900" fontFamily="monospace">{plain(s.start)} °C</text>
              <text x="350" y="92" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">Now</text>
              <text x="560" y="92" textAnchor="end" fill={cold ? SKY : '#fca5a5'} fontSize="20" fontWeight="900" fontFamily="monospace">{plain(round(now))} °C</text>
              <line x1="350" y1="108" x2="560" y2="108" stroke="#334155" />
              <text x="350" y="136" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">Change = end − start</text>
              <text x="455" y="172" textAnchor="middle" fill={change < 0 ? SKY : GREEN} fontSize="19" fontWeight="900" fontFamily="monospace" opacity={p > 0.95 ? 1 : 0.15}>
                {plain(s.end)} − {paren(s.start)} = {fmt(change)}
              </text>
              <text x="455" y="208" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily="sans-serif" opacity={p > 0.95 ? 1 : 0.15}>
                {change < 0 ? `${-change} degrees colder` : change > 0 ? `${change} degrees warmer` : 'no change'}
              </text>
              <text x="455" y="238" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">a fall shows up as a negative change</text>
              <JumpStrip points={[s.start, s.end]} progress={p} unit=" °C" />
            </g>
          );
        })()}

        {s.mode === 'rail' && (() => {
          const tx = 30 + pos * 550;
          const th = trackHeight(tx);
          return (
            <g>
              {Array.from({ length: 6 }, (_, i) => -20 + i * 10).map((hh) => (
                <g key={hh}>
                  <line x1="8" y1={railY(hh)} x2="16" y2={railY(hh)} stroke={hh === 0 ? AMBER : '#64748b'} strokeWidth="2" />
                  <text x="20" y={railY(hh) + 4} fill={hh < 0 ? SKY : hh > 0 ? '#fca5a5' : AMBER} fontSize="10" fontWeight="700" fontFamily="monospace">{plain(hh)}</text>
                </g>
              ))}
              {/* ground with a valley, and a river above the tunnel */}
              <path d={`M 40 ${railY(0)} L 110 ${railY(0)} L 160 ${railY(20)} L 172 ${railY(-10)} L 258 ${railY(-10)} L 270 ${railY(20)} L 320 ${railY(0)} L 370 ${railY(0)} L 380 ${railY(-8)} L 520 ${railY(-8)} L 530 ${railY(0)} L 590 ${railY(0)} L 590 262 L 40 262 Z`} fill="#3f2a14" />
              <rect x="380" y={railY(0)} width="140" height={railY(-8) - railY(0)} fill="#0369a1" opacity="0.85" />
              <path d={`M 380 ${railY(0)} q 10 -4 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0`} stroke="#7dd3fc" strokeWidth="2" fill="none" />
              <text x="450" y={railY(0) - 8} textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="700" fontFamily="sans-serif">river</text>
              <rect x="174" y={railY(-10) - 8} width="82" height="8" fill="#0284c7" />
              {/* tunnel tube */}
              <path d={`M 370 ${railY(0)} L 430 ${railY(-15)} L 480 ${railY(-15)} L 530 ${railY(0)}`} stroke="#111827" strokeWidth="26" fill="none" strokeLinejoin="round" />
              {/* bridge pillars */}
              {[180, 215, 250].map((x) => <rect key={x} x={x - 4} y={railY(20)} width="8" height={railY(-10) - railY(20) - 8} fill="#64748b" />)}
              {/* station-level line */}
              <line x1="30" y1={railY(0)} x2="590" y2={railY(0)} stroke={AMBER} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.7" />
              <text x="586" y={railY(0) - 8} textAnchor="end" fill={AMBER} fontSize="11" fontWeight="800" fontFamily="sans-serif">ground = 0 m</text>
              {/* track */}
              <polyline points={TRACK.map(([x, h]) => `${x},${railY(h)}`).join(' ')} fill="none" stroke={INK} strokeWidth="3" />
              {/* train */}
              <g transform={`translate(${tx} ${railY(th)})`}>
                <rect x="-16" y="-16" width="32" height="13" rx="3" fill={RED} />
                <rect x="4" y="-24" width="9" height="9" fill="#7f1d1d" />
                <circle cx="-9" cy="-2" r="3" fill="#0f172a" />
                <circle cx="9" cy="-2" r="3" fill="#0f172a" />
              </g>
              <rect x="420" y="16" width="160" height="62" rx="12" fill="#0f172a" stroke="#1e293b" />
              <text x="500" y="38" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="sans-serif">TRAIN HEIGHT</text>
              <text x="500" y="66" textAnchor="middle" fill={round(th) < 0 ? SKY : round(th) > 0 ? '#fca5a5' : AMBER} fontSize="24" fontWeight="900" fontFamily="monospace">{fmt(round(th))} m</text>
              <text x="215" y={railY(20) - 32} textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="800" fontFamily="sans-serif">bridge +20 m</text>
              <text x="455" y={railY(-15) + 28} textAnchor="middle" fill={SKY} fontSize="12" fontWeight="800" fontFamily="sans-serif">tunnel {MINUS}15 m</text>
              {s.showDiff && (
                <g>
                  <line x1="300" y1={railY(20)} x2="300" y2={railY(-15)} stroke={PURPLE} strokeWidth="3" />
                  <line x1="270" y1={railY(20)} x2="300" y2={railY(20)} stroke={PURPLE} strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="300" y1={railY(-15)} x2="430" y2={railY(-15)} stroke={PURPLE} strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="300" y1={railY(2.5)} x2="300" y2="52" stroke={PURPLE} strokeWidth="1.5" strokeDasharray="2 3" />
                  <rect x="200" y="22" width="200" height="30" rx="8" fill="#1e1b4b" stroke={PURPLE} />
                  <text x="300" y="42" textAnchor="middle" fill="#ddd6fe" fontSize="14" fontWeight="900" fontFamily="monospace">20 {MINUS} ({MINUS}15) = 35 m</text>
                </g>
              )}
              <JumpStrip points={s.showDiff ? [-15, 20] : [0, round(th)]} progress={s.showDiff ? p : 1} unit=" m" />
            </g>
          );
        })()}

        {ledger && (() => {
          const vals = ledger.items.map((it) => it.v);
          const cum = vals.reduce((acc, v) => [...acc, acc[acc.length - 1] + v], [0]);
          const maxAbs = Math.max(...vals.map(Math.abs), ...cum.map(Math.abs));
          const k = 80 / maxAbs;
          const zero = 150;
          const n = vals.length;
          const total = cum[cum.length - 1];
          return (
            <g>
              <text x="24" y="28" fill={INK} fontSize="15" fontWeight="800" fontFamily="sans-serif">{ledger.title}</text>
              <line x1="24" y1={zero} x2="430" y2={zero} stroke={AMBER} strokeWidth="2" />
              <text x="24" y={zero - 6} fill={AMBER} fontSize="11" fontWeight="700" fontFamily="monospace">0</text>
              {ledger.items.map((it, i) => {
                const t = clamp(p * n - i, 0, 1);
                const h = Math.abs(it.v) * k * t;
                const x = 70 + i * 125;
                const color = it.v > 0 ? GREEN : RED;
                return (
                  <g key={it.label}>
                    <rect x={x} y={it.v > 0 ? zero - h : zero} width="70" height={h} rx="5" fill={color} opacity="0.85" />
                    <text x={x + 35} y={it.v > 0 ? zero - h - 8 : zero + h + 18} textAnchor="middle" fill={color} fontSize="14" fontWeight="900" fontFamily="monospace" opacity={t}>{ledger.money ? (it.v > 0 ? '+' : MINUS) + inr(Math.abs(it.v)) : fmt(it.v)}</text>
                    <text x={x + 35} y={it.v > 0 ? zero + 18 : zero - 10} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="700" fontFamily="sans-serif">{it.label}</text>
                  </g>
                );
              })}
              <rect x="445" y="40" width="140" height="210" rx="14" fill="#0f172a" stroke="#1e293b" />
              <text x="515" y="62" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="800" fontFamily="sans-serif">{ledger.totalLabel.toUpperCase()}</text>
              {ledger.items.map((it, i) => (
                <text key={it.label} x="515" y={88 + i * 24} textAnchor="middle" fill={it.v > 0 ? '#86efac' : '#fda4af'} fontSize="12" fontWeight="700" fontFamily="sans-serif" opacity={clamp(p * n - i, 0, 1)}>
                  {ledger.word(it.v)}
                </text>
              ))}
              <line x1="460" y1={88 + n * 24 - 12} x2="570" y2={88 + n * 24 - 12} stroke="#334155" />
              <text x="515" y={88 + n * 24 + 22} textAnchor="middle" fill={total < 0 ? '#fda4af' : '#86efac'} fontSize="26" fontWeight="900" fontFamily="monospace" opacity={p > 0.97 ? 1 : 0.15}>
                {ledger.money ? inr(total) : fmt(total)}
              </text>
              <text x="515" y={88 + n * 24 + 46} textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="sans-serif" opacity={p > 0.97 ? 1 : 0}>
                {ledger.money ? (total < 0 ? 'short: owes money' : 'has money') : total < 0 ? 'lost more runs' : 'scored more runs'}
              </text>
              <JumpStrip points={cum} progress={p} unit={ledger.unit} />
            </g>
          );
        })()}
      </svg>
    </StoryStage>
  );
}
