import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, Arrowhead, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Whole Numbers — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const FADE = '@keyframes wnFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';

const indian = (n) => {
  const neg = n < 0;
  const s = String(Math.abs(Math.round(n)));
  const out = s.length <= 3 ? s : `${s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${s.slice(-3)}`;
  return neg ? `−${out}` : out;
};

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

const btn = 'px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 text-slate-200 bg-slate-800 hover:bg-slate-700 transition';

function Slider({ label, value, min, max, onChange, tone = 'text-amber-300' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// A laddoo (round sweet) with a little shine
function Laddoo({ x, y, r, dim }) {
  return (
    <g opacity={dim ? 0.25 : 1}>
      <circle cx={x} cy={y} r={r} fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fde68a" opacity="0.7" />
    </g>
  );
}

// Small steam engine (facing right). (x, y) = point on the rail under the middle wheel.
function Engine({ x, y, spin = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="17" cy="-50" r="5" fill="#cbd5e1" opacity="0">
          <animate attributeName="cy" values="-50;-86" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="4;11" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="-29" y="-50" width="24" height="5" rx="2" fill="#7f1d1d" />
      <rect x="-26" y="-46" width="18" height="32" rx="3" fill={RED} />
      <rect x="-22" y="-42" width="10" height="9" rx="2" fill="#bae6fd" />
      <rect x="-8" y="-34" width="32" height="20" rx="8" fill={AMBER} />
      <rect x="14" y="-46" width="7" height="13" fill="#475569" />
      <rect x="-28" y="-16" width="54" height="6" rx="2" fill="#334155" />
      <polygon points="26,-12 33,-2 26,-2" fill="#94a3b8" />
      {[-18, -2, 14].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="-6" r="6" fill="#1e293b" stroke={INK} strokeWidth="2" />
          <line x1={cx} y1="-11" x2={cx} y2="-1" stroke={INK} strokeWidth="1.5" transform={`rotate(${spin} ${cx} -6)`} />
        </g>
      ))}
    </g>
  );
}

// ─── WIDGET 1: Papa's railway number line (natural vs whole numbers, successor, predecessor, comparing) ───
export function Class6WholeNumberLineWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ showZero: true, train: 0, mark: null, compare: null, task: null, of: 0 }, visual);
  const minN = s.showZero ? 0 : 1;
  const train = clamp(Math.round(Number(s.train) || 0), minN, 999);
  const cmp = Array.isArray(s.compare) && s.compare.length === 2 ? s.compare : null;
  const lo = cmp ? clamp(Math.floor((cmp[0] + cmp[1]) / 2) - 5, 0, 990) : clamp(train - 5, 0, 990);
  const loT = useTween(lo, 900);
  const trainT = useTween(train, 900);
  const X = (n) => 50 + (n - loT) * 50;
  const RAIL = 205;
  const first = Math.max(0, Math.floor(loT) - 1);
  const stones = Array.from({ length: 14 }, (_, i) => first + i);
  const target = s.task === 'pred' ? s.of - 1 : s.task === 'succ' ? s.of + 1 : null;
  const done = target !== null && train === target;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const hasPred = train > minN;
  const move = (d) => update({ train: clamp(train + d, minN, 999), mark: d > 0 ? 'succ' : 'pred', compare: null });
  const railStart = s.showZero ? Math.max(-10, X(0) - 44) : -10;

  // successor / predecessor hop arc above the train
  const markArc = (() => {
    if (cmp || !s.mark) return null;
    const dir = s.mark === 'succ' ? 1 : -1;
    if (dir < 0 && !hasPred) return { blocked: true };
    const x1 = X(trainT);
    const x2 = X(trainT + dir);
    const y = RAIL - 58;
    const cx = (x1 + x2) / 2;
    const deg = (Math.atan2(-(y - (RAIL - 130)), x2 - cx) * 180) / Math.PI;
    return { x1, x2, y, cx, deg, color: dir > 0 ? GREEN : PINK, label: dir > 0 ? `+1 → successor ${train + 1}` : `−1 → predecessor ${train - 1}` };
  })();

  return (
    <StoryStage
      eyebrow="Visualizer · The Number Line"
      title={cmp ? 'Comparing on the number line' : s.showZero ? 'Whole numbers: 0, 1, 2, 3, …' : 'Natural numbers: 1, 2, 3, …'}
      footer={
        <div className="space-y-3">
          <ModePills value={s.showZero ? 'whole' : 'natural'} onChange={(v) => update({ showZero: v === 'whole', train: Math.max(v === 'whole' ? 0 : 1, train) })} options={[{ value: 'natural', label: 'Natural numbers (start at 1)' }, { value: 'whole', label: 'Whole numbers (start at 0)' }]} />
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => move(-1)} className={btn}>◀ Predecessor (−1)</button>
            <button onClick={() => move(1)} className={btn}>Successor (+1) ▶</button>
            <div className="flex gap-2 ml-auto">
              <Readout label="Train at" value={train} tone="text-amber-300" />
              <Readout label="Successor" value={train + 1} tone="text-emerald-300" />
              <Readout label="Predecessor" value={hasPred ? train - 1 : 'none'} tone="text-pink-300" />
            </div>
          </div>
          <Slider label="Move the train to stone" value={train} min={minN} max={120} onChange={(v) => update({ train: v, mark: null, compare: null })} />
          {s.task && <TaskBanner text={`Your turn: park the train at the ${s.task === 'pred' ? 'predecessor' : 'successor'} of ${s.of}.`} done={done} />}
          <p className="text-sm text-slate-300">
            Successor = the number just after (add 1). Predecessor = the number just before (take away 1). {s.showZero ? '0 is the smallest whole number, so it has no whole-number predecessor.' : '1 is the smallest natural number.'} There is no largest number: every number has a successor.
          </p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="24" y="38" fill={SKY} fontSize="17" fontWeight="800" fontFamily="sans-serif">Natural numbers: <tspan fill={INK} fontFamily="monospace">1, 2, 3, 4, 5, …</tspan></text>
        <g style={{ opacity: s.showZero ? 1 : 0, transition: 'opacity 800ms ease' }}>
          <text x="24" y="66" fill={AMBER} fontSize="17" fontWeight="800" fontFamily="sans-serif">Whole numbers: <tspan fontFamily="monospace" fontWeight="900">0</tspan><tspan fill={INK} fontFamily="monospace">, 1, 2, 3, 4, …</tspan></text>
        </g>

        {/* rail and sleepers */}
        {stones.map((n) => (
          <g key={`sl${n}`}>
            {[0, 25].map((o) => (X(n) + o > railStart ? <rect key={o} x={X(n) + o - 4} y={RAIL + 2} width="8" height="10" fill="#57534e" /> : null))}
          </g>
        ))}
        <line x1={railStart} y1={RAIL} x2={W + 10} y2={RAIL} stroke="#94a3b8" strokeWidth="4" />
        {s.showZero && X(0) - 40 > -10 && <rect x={X(0) - 50} y={RAIL - 22} width="9" height="24" fill={RED} rx="2" />}

        {/* kilometre stones */}
        {stones.map((n) => {
          const x = X(n);
          if (x < -30 || x > W + 30) return null;
          const isZero = n === 0;
          const hidden = isZero && !s.showZero;
          const inCmp = cmp && (n === cmp[0] || n === cmp[1]);
          const stonePath = `M ${x - 19} 272 L ${x - 19} 240 Q ${x - 19} 228 ${x} 228 Q ${x + 19} 228 ${x + 19} 240 L ${x + 19} 272 Z`;
          return (
            <g key={`st${n}`}>
              {hidden && <path d={stonePath} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />}
              <g style={isZero ? { transform: `translateY(${s.showZero ? 0 : -90}px)`, opacity: s.showZero ? 1 : 0, transition: 'transform 900ms cubic-bezier(.3,1.6,.5,1), opacity 500ms ease' } : undefined}>
                <path d={stonePath} fill={isZero ? 'rgba(251,191,36,0.18)' : inCmp ? 'rgba(52,211,153,0.15)' : '#0f172a'} stroke={isZero ? AMBER : inCmp ? GREEN : '#475569'} strokeWidth="2" />
                <text x={x} y="258" textAnchor="middle" fill={isZero ? AMBER : n === train && !cmp ? INK : SKY} fontSize={n >= 100 ? 13 : 16} fontWeight="900" fontFamily="monospace">{n}</text>
                {isZero && <text x={x} y="292" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="700" fontFamily="sans-serif">station</text>}
              </g>
            </g>
          );
        })}

        {/* train */}
        {!cmp && <Engine x={X(trainT)} y={RAIL - 2} spin={trainT * 140} />}

        {/* successor / predecessor arc */}
        {markArc && !markArc.blocked && (
          <g key={`${s.mark}-${train}`} style={{ animation: 'wnFadeIn 500ms ease' }}>
            <path d={`M ${markArc.x1} ${markArc.y} Q ${markArc.cx} ${RAIL - 130} ${markArc.x2} ${markArc.y}`} fill="none" stroke={markArc.color} strokeWidth="3" strokeDasharray="7 5" />
            <Arrowhead x={markArc.x2} y={markArc.y} deg={markArc.deg} color={markArc.color} size={11} />
            <text x={clamp(markArc.cx, 110, 490)} y={RAIL - 104} textAnchor="middle" fill={markArc.color} fontSize="16" fontWeight="900" fontFamily="sans-serif">{markArc.label}</text>
          </g>
        )}
        {markArc && markArc.blocked && (
          <g style={{ animation: 'wnFadeIn 500ms ease' }}>
            <text x={clamp(X(trainT), 150, 450)} y={RAIL - 100} textAnchor="middle" fill={RED} fontSize="16" fontWeight="900" fontFamily="sans-serif">{s.showZero ? 'No whole number comes before 0!' : 'No natural number comes before 1!'}</text>
          </g>
        )}

        {/* comparing two numbers */}
        {cmp && (() => {
          const [a, b] = cmp;
          const small = Math.min(a, b);
          const big = Math.max(a, b);
          return (
            <g>
              {[[small, SKY], [big, GREEN]].map(([n, color]) => (
                <g key={n} style={{ animation: 'wnFadeIn 600ms ease' }}>
                  <line x1={X(n)} y1={RAIL - 4} x2={X(n)} y2={RAIL - 80} stroke={color} strokeWidth="3" />
                  <polygon points={`${X(n)},${RAIL - 80} ${X(n) + 34},${RAIL - 68} ${X(n)},${RAIL - 56}`} fill={color} />
                  <text x={X(n) + 3} y={RAIL - 88} fill={color} fontSize="20" fontWeight="900" fontFamily="monospace">{n}</text>
                </g>
              ))}
              <path d={`M ${X(small) + 6} ${RAIL - 22} L ${X(big) - 10} ${RAIL - 22}`} stroke={AMBER} strokeWidth="2.5" strokeDasharray="6 5" />
              <Arrowhead x={X(big) - 6} y={RAIL - 22} deg={0} color={AMBER} size={10} />
              <text x="300" y="322" textAnchor="middle" fill={INK} fontSize="17" fontWeight="800" fontFamily="sans-serif">{small} is to the left of {big}, so <tspan fill={GREEN} fontFamily="monospace">{small} &lt; {big}</tspan></text>
            </g>
          );
        })()}
        <text x="300" y="350" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="700" fontFamily="sans-serif">smaller ←   numbers grow as you go right   → bigger</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Jumps on the number line (add = right, subtract = left, multiply = equal jumps from 0, divide = jumps back) ───
const JUMP_OPS = [
  { value: 'add', label: 'Add (+)' },
  { value: 'sub', label: 'Subtract (−)' },
  { value: 'mul', label: 'Multiply (×)' },
  { value: 'div', label: 'Divide (÷)' },
];
const LIMITS = { add: [20, 12], sub: [20, 12], mul: [8, 8], div: [24, 8] };
const SYM = { add: '+', sub: '−', mul: '×', div: '÷' };

function jumpsFor(op, a, b) {
  if (op === 'add') return { start: a, hops: Array.from({ length: b }, (_, i) => [a + i, a + i + 1]), end: a + b };
  if (op === 'sub') {
    const n = Math.min(a, b);
    return { start: a, hops: Array.from({ length: n }, (_, i) => [a - i, a - i - 1]), end: a - b, stuck: b > a };
  }
  if (op === 'mul') return { start: 0, hops: Array.from({ length: a }, (_, i) => [i * b, (i + 1) * b]), end: a * b };
  if (b === 0) return { start: a, hops: [], end: null, zero: true };
  const q = Math.floor(a / b);
  return { start: a, hops: Array.from({ length: q }, (_, i) => [a - i * b, a - (i + 1) * b]), end: q, rem: a % b };
}

export function Class6NumberLineJumpsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ op: 'add', a: 3, b: 4, target: null }, visual);
  const [replay, setReplay] = useState(0);
  const [zeroCount, setZeroCount] = useState(0);
  const op = LIMITS[s.op] ? s.op : 'add';
  const [ma, mb] = LIMITS[op];
  const a = clamp(Math.round(Number(s.a)) || 0, 0, ma);
  const b = clamp(Math.round(Number(s.b)) || 0, 0, mb);
  const J = jumpsFor(op, a, b);
  const need = Math.max(10, J.start, op === 'add' ? a + b : op === 'mul' ? a * b : a);
  const step = need <= 12 ? 1 : need <= 24 ? 2 : need <= 40 ? 5 : 10;
  const hi = Math.max(10, Math.ceil(need / step) * step);
  const n = J.hops.length;
  const per = n ? Math.min(550, 2200 / n) : 500;
  const p = useReplay(`${op}-${a}-${b}-${replay}`, Math.max(500, per * n));
  const finished = p >= 1;

  const Y = 250;
  const X = (v) => 40 + (v / hi) * 520;
  const arcOf = ([f, t]) => {
    const x1 = X(f);
    const x2 = X(t);
    const h = clamp(14 + Math.abs(x2 - x1) * 0.35, 20, 100);
    return { x1, x2, cx: (x1 + x2) / 2, cy: Y - 4 - 2 * h, h };
  };
  const prog = p * n;
  const cur = n ? clamp(Math.floor(prog), 0, n - 1) : 0;
  const frac = n ? (prog >= n ? 1 : prog - cur) : 1;
  let tok = [X(J.start), Y - 4];
  if (n) {
    const A = arcOf(J.hops[cur]);
    const t = ease(frac);
    tok = [(1 - t) ** 2 * A.x1 + 2 * (1 - t) * t * A.cx + t * t * A.x2, (1 - t) ** 2 * (Y - 4) + 2 * (1 - t) * t * A.cy + t * t * (Y - 4)];
  }

  useEffect(() => {
    setZeroCount(0);
    if (!J.zero) return undefined;
    const timer = setInterval(() => setZeroCount((c) => c + 1), 800);
    return () => clearInterval(timer);
  }, [J.zero, a, replay]);

  const done = !!s.target && op === 'mul' && a > 0 && b > 0 && a * b === s.target;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const color = { add: GREEN, sub: PINK, mul: SKY, div: PURPLE }[op];
  const result = op === 'add' ? a + b : op === 'sub' ? (a >= b ? a - b : '?') : op === 'mul' ? a * b : b === 0 ? '?' : J.rem ? `${J.end}, remainder ${J.rem}` : J.end;
  const how = {
    add: `Start at ${a}. Take ${b} jump${b === 1 ? '' : 's'} of 1 to the RIGHT.`,
    sub: `Start at ${a}. Take ${b} jump${b === 1 ? '' : 's'} of 1 to the LEFT.`,
    mul: `${a} equal jump${a === 1 ? '' : 's'} of ${b}, starting from 0.`,
    div: `From ${a}, jump back ${b} at a time. How many jumps reach 0?`,
  }[op];
  const labels = { add: ['Start at', 'Jumps to the right'], sub: ['Start at', 'Jumps to the left'], mul: ['Number of jumps', 'Size of each jump'], div: ['Start at', 'Size of each jump'] }[op];
  const hopLabel = op === 'add' ? '+1' : op === 'sub' ? '−1' : op === 'mul' ? `+${b}` : `−${b}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Jumps on the Number Line"
      title={`${a} ${SYM[op]} ${b} on the number line`}
      footer={
        <div className="space-y-3">
          <ModePills value={op} onChange={(v) => update({ op: v, a: clamp(a, 0, LIMITS[v][0]), b: clamp(b, 0, LIMITS[v][1]) })} options={JUMP_OPS} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label={labels[0]} value={a} min={0} max={ma} onChange={(v) => update({ a: v })} />
            <Slider label={labels[1]} value={b} min={0} max={mb} onChange={(v) => update({ b: v })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setReplay((r) => r + 1)} className={btn}>↻ Replay the jumps</button>
            <span className="text-sm text-slate-300">{how}</span>
          </div>
          {s.target && <TaskBanner text={`Your turn: choose Multiply and make ${s.target} with equal jumps from 0. Change the number of jumps and the jump size.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="300" y="48" textAnchor="middle" fill={INK} fontSize="30" fontWeight="900" fontFamily="monospace">
          {a} {SYM[op]} {b} = <tspan fill={finished && result !== '?' ? GREEN : AMBER}>{finished ? result : '?'}</tspan>
        </text>
        <text x="300" y="80" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">{how}</text>
        {finished && J.stuck && <text x="300" y="110" textAnchor="middle" fill={RED} fontSize="16" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 500ms ease' }}>Stuck at 0! There is no whole number to the left of 0.</text>}
        {finished && J.rem > 0 && <text x="300" y="110" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 500ms ease' }}>{J.end} jumps, and {J.rem} is left over: too small for another jump.</text>}
        {J.zero && <text x="300" y="110" textAnchor="middle" fill={RED} fontSize="16" fontWeight="900" fontFamily="sans-serif">Jumps of 0 never move! Jumps made: {zeroCount}, still at {a}.</text>}

        <line x1="28" y1={Y} x2="578" y2={Y} stroke={INK} strokeWidth="3" />
        <Arrowhead x={584} y={Y} deg={0} color={INK} size={10} />
        {Array.from({ length: hi + 1 }, (_, v) => (
          <g key={v}>
            <line x1={X(v)} y1={Y - (v % step === 0 ? 9 : 5)} x2={X(v)} y2={Y + (v % step === 0 ? 9 : 5)} stroke="#94a3b8" strokeWidth={v % step === 0 ? 2 : 1} />
            {v % step === 0 && <text x={X(v)} y={Y + 28} textAnchor="middle" fill={v === 0 ? AMBER : '#cbd5e1'} fontSize="14" fontWeight="800" fontFamily="monospace">{v}</text>}
          </g>
        ))}
        <circle cx={X(J.start)} cy={Y} r="7" fill={SKY} />
        <text x={X(J.start)} y={Y + 50} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily="sans-serif">start</text>

        {J.hops.map((hop, i) => {
          const A = arcOf(hop);
          const f = i < cur ? 1 : i === cur ? frac : 0;
          if (f <= 0) return null;
          return (
            <g key={i}>
              <path d={`M ${A.x1} ${Y - 4} Q ${A.cx} ${A.cy} ${A.x2} ${Y - 4}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - f} fill="none" stroke={color} strokeWidth="3" />
              {f >= 1 && n <= 12 && <text x={A.cx} y={Y - 4 - A.h - 8} textAnchor="middle" fill={color} fontSize="12" fontWeight="900" fontFamily="monospace">{hopLabel}</text>}
            </g>
          );
        })}
        {finished && J.end !== null && J.end >= 0 && op !== 'div' && (
          <g style={{ animation: 'wnFadeIn 500ms ease' }}>
            <circle cx={X(J.end)} cy={Y} r="9" fill="none" stroke={GREEN} strokeWidth="3" />
            <text x={X(J.end)} y={Y + 50} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="900" fontFamily="sans-serif">answer</text>
          </g>
        )}
        {finished && J.stuck && <text x={X(0)} y={Y + 50} textAnchor="middle" fill={RED} fontSize="13" fontWeight="900" fontFamily="sans-serif">wall!</text>}
        <circle cx={tok[0]} cy={tok[1]} r="10" fill={AMBER} stroke="white" strokeWidth="2">
          {J.zero && <animate attributeName="cy" values={`${Y - 4};${Y - 44};${Y - 4}`} dur="0.8s" repeatCount="indefinite" />}
        </circle>
        {op === 'div' && finished && !J.zero && <text x="300" y={Y + 80} textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="800" fontFamily="sans-serif">Count the jumps: {J.end} jump{J.end === 1 ? '' : 's'} of {b}</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: The closure machine and the mystery of dividing by zero ───
function closureOf(op, a, b) {
  if (op === 'add') return { value: a + b, whole: true };
  if (op === 'mul') return { value: a * b, whole: true };
  if (op === 'sub') return { value: a - b, whole: a >= b };
  if (b === 0) return { value: null, whole: false, undef: true };
  return { value: a / b, whole: a % b === 0 };
}

function ClosureView({ s, onInteract }) {
  const op = SYM[s.op] ? s.op : 'add';
  const a = clamp(Math.round(Number(s.a)) || 0, 0, 20);
  const b = clamp(Math.round(Number(s.b)) || 0, 0, 20);
  const r = closureOf(op, a, b);
  const key = `${op}-${a}-${b}`;
  const p = useReplay(key, 1800);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const text = r.whole ? `${a} ${SYM[op]} ${b} = ${r.value}` : `${a} ${SYM[op]} ${b}`;
      setHistory((h) => [{ text, whole: r.whole }, ...h.filter((x) => x.text !== text)].slice(0, 8));
    }, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const done = !!s.task && op === s.task && !r.whole;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const t1 = ease(seg(p, 0, 0.4));
  const t3 = ease(seg(p, 0.6, 1));
  const busy = p > 0.35 && p < 0.65;
  const dest = r.whole ? [195, 288] : [485, 288];
  const out = [lerp(300, dest[0], t3), lerp(200, dest[1], t3)];
  const outText = r.whole ? String(r.value) : r.undef ? '!' : '?';
  const wholeChips = history.filter((h) => h.whole).slice(0, 3);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {/* inputs sliding into the machine */}
        {[[a, 170, 270, AMBER], [b, 430, 330, SKY]].map(([v, x0, x1, c], i) => (
          <g key={i} opacity={1 - seg(p, 0.3, 0.42)}>
            <circle cx={lerp(x0, x1, t1)} cy={lerp(52, 140, t1)} r="24" fill="#0f172a" stroke={c} strokeWidth="3" />
            <text x={lerp(x0, x1, t1)} y={lerp(52, 140, t1) + 7} textAnchor="middle" fill={c} fontSize="20" fontWeight="900" fontFamily="monospace">{v}</text>
          </g>
        ))}
        <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">{a} {SYM[op]} {b}</text>
        {/* the machine */}
        <g transform={busy ? `translate(${Math.sin(p * 80) * 2} 0)` : undefined}>
          <rect x="215" y="112" width="170" height="76" rx="16" fill="#1e1b4b" stroke={busy ? AMBER : PURPLE} strokeWidth="3" />
          <text x="300" y="164" textAnchor="middle" fill={busy ? AMBER : PURPLE} fontSize="40" fontWeight="900" fontFamily="monospace">{SYM[op]}</text>
          {[240, 360].map((gx) => (
            <g key={gx}>
              <circle cx={gx} cy="150" r="13" fill="none" stroke="#6366f1" strokeWidth="5" strokeDasharray="5 4">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${gx} 150`} to={`${gx === 240 ? 360 : -360} ${gx} 150`} dur={busy ? '0.6s' : '4s'} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>
        {/* zones */}
        <rect x="28" y="228" width="340" height="118" rx="18" fill="rgba(52,211,153,0.07)" stroke={GREEN} strokeWidth="2" strokeDasharray="8 6" />
        <text x="44" y="250" fill={GREEN} fontSize="14" fontWeight="900" fontFamily="sans-serif">Whole number family: 0, 1, 2, 3, …</text>
        <rect x="388" y="228" width="184" height="118" rx="18" fill="rgba(248,113,113,0.07)" stroke={RED} strokeWidth="2" strokeDasharray="8 6" />
        <text x="404" y="250" fill={RED} fontSize="14" fontWeight="900" fontFamily="sans-serif">Outside the family</text>
        {wholeChips.map((h, i) => (
          <text key={h.text} x={88 + i * 110} y="336" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="700" fontFamily="monospace">{h.text}</text>
        ))}
        {/* output */}
        {p > 0.55 && (
          <g>
            <circle cx={out[0]} cy={out[1]} r="24" fill={r.whole ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'} stroke={r.whole ? GREEN : RED} strokeWidth="3" />
            <text x={out[0]} y={out[1] + 7} textAnchor="middle" fill={r.whole ? GREEN : RED} fontSize={outText.length > 2 ? 15 : 20} fontWeight="900" fontFamily="monospace">{outText}</text>
            {p >= 1 && r.whole && <text x={out[0] + 34} y={out[1] + 6} fill={GREEN} fontSize="14" fontWeight="900" fontFamily="sans-serif">✔ stays in</text>}
            {p >= 1 && !r.whole && <text x={out[0]} y="336" textAnchor="middle" fill={RED} fontSize="13" fontWeight="900" fontFamily="monospace">{a} {SYM[op]} {b}: {r.undef ? 'not defined' : 'not whole ✘'}</text>}
          </g>
        )}
    </svg>
  );
}

function DivZeroView({ s }) {
  const a = clamp(Math.round(Number(s.a)) || 0, 0, 24);
  const b = clamp(Math.round(Number(s.b)) || 0, 0, 8);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const timer = setInterval(() => setCount((c) => (c >= 8 ? c : c + 1)), 300);
    return () => clearInterval(timer);
  }, [a, b]);

  let ks;
  let verdict;
  if (b === 0) {
    ks = [0, 1, 2, 3, 4, 10, 100, 1000];
    verdict = a === 0
      ? { ok: false, text: 'Every number works, so there is no single answer. 0 ÷ 0 is not defined.' }
      : { ok: false, text: `No number times 0 gives ${a}. So ${a} ÷ 0 is NOT DEFINED.` };
  } else {
    const q = Math.floor(a / b);
    const last = a % b === 0 ? q : q + 1;
    const startK = Math.max(0, last - 7);
    ks = Array.from({ length: last - startK + 1 }, (_, i) => startK + i);
    verdict = a % b === 0 ? { ok: true, text: `${q} × ${b} = ${a}, so ${a} ÷ ${b} = ${q}` } : { ok: false, text: `${q} × ${b} is too small and ${q + 1} × ${b} is too big: not a whole number.` };
  }
  const shown = ks.slice(0, Math.min(count, ks.length));
  const allShown = count >= ks.length;
  const kNow = shown.length ? shown[shown.length - 1] : 0;
  const boxes = Math.min(kNow, 6);
  const packed = Math.min(kNow * b, a);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="170" y="42" textAnchor="middle" fill={INK} fontSize="28" fontWeight="900" fontFamily="monospace">{a} ÷ {b} = ?</text>
      <text x="170" y="70" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">Ask: which number times {b} gives {a}?</text>
      {shown.map((k, i) => {
        const ok = k * b === a;
        return (
          <g key={`${a}-${b}-${k}`} style={{ animation: 'wnFadeIn 300ms ease' }}>
            <text x="60" y={104 + i * 27} fill={ok ? GREEN : INK} fontSize="17" fontWeight="800" fontFamily="monospace">{indian(k)} × {b} = {indian(k * b)}</text>
            <text x="270" y={104 + i * 27} fill={ok ? GREEN : RED} fontSize="17" fontWeight="900" fontFamily="sans-serif">{ok ? '✔' : '✘'}</text>
          </g>
        );
      })}
      {/* laddoo picture */}
      <rect x="318" y="20" width="262" height="290" rx="16" fill="#0f172a" stroke="#1e293b" />
      <text x="449" y="44" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight="800" fontFamily="sans-serif">{a} laddoo{a === 1 ? '' : 's'}, boxes of {b}</text>
      {Array.from({ length: a }, (_, i) => (
        <Laddoo key={i} x={346 + (i % 8) * 29} y={68 + Math.floor(i / 8) * 26} r={10} dim={i < packed} />
      ))}
      {a === 0 && <text x="449" y="82" textAnchor="middle" fill="#64748b" fontSize="13" fontFamily="sans-serif">(no laddoos at all)</text>}
      {Array.from({ length: boxes }, (_, i) => {
        const bx = 336 + (i % 3) * 80;
        const by = 160 + Math.floor(i / 3) * 70;
        return (
          <g key={`box${i}`} style={{ animation: 'wnFadeIn 300ms ease' }}>
            <rect x={bx} y={by} width="66" height="56" rx="8" fill="rgba(244,114,182,0.1)" stroke={PINK} strokeWidth="2" />
            {Array.from({ length: b }, (_, j) => (
              <Laddoo key={j} x={bx + 13 + (j % 3) * 20} y={by + 13 + Math.floor(j / 3) * 16} r={6} />
            ))}
            {b === 0 && <text x={bx + 33} y={by + 33} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="sans-serif">empty</text>}
          </g>
        );
      })}
      <text x="449" y="302" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="sans-serif">{kNow > 6 ? `${indian(kNow)} boxes (6 shown)` : `${kNow} box${kNow === 1 ? '' : 'es'}`} · {indian(kNow * b)} laddoo{kNow * b === 1 ? '' : 's'} packed</text>
      {allShown && (
        <text x="300" y="342" textAnchor="middle" fill={verdict.ok ? GREEN : RED} fontSize="16" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 500ms ease' }}>{verdict.text}</text>
      )}
    </svg>
  );
}

export function Class6ClosureLabWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'closure', op: 'add', a: 5, b: 7, task: null }, visual);
  const op = SYM[s.op] ? s.op : 'add';
  const a = clamp(Math.round(Number(s.a)) || 0, 0, s.mode === 'divzero' ? 24 : 20);
  const b = clamp(Math.round(Number(s.b)) || 0, 0, s.mode === 'divzero' ? 8 : 20);
  const r = closureOf(op, a, b);
  const why = r.whole
    ? `${a} ${SYM[op]} ${b} = ${r.value}, a whole number. It stays in the family.`
    : r.undef
      ? `${a} ÷ 0 is not defined at all, so it cannot be a whole number.`
      : op === 'sub'
        ? `${a} − ${b}: you cannot take ${b} away from ${a}. There is no whole number answer.`
        : `${a} ÷ ${b} = ${Math.floor(a / b)} with ${a % b} left over, so the answer is not a whole number.`;

  return (
    <StoryStage
      eyebrow="Visualizer · Closure and Division by Zero"
      title={s.mode === 'divzero' ? `The mystery of ${a} ÷ ${b}` : 'Does the answer stay a whole number?'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode, a: mode === 'divzero' ? 5 : a, b: mode === 'divzero' ? 0 : b })} options={[{ value: 'closure', label: 'Closure machine' }, { value: 'divzero', label: 'Dividing by zero' }]} />
          {s.mode === 'closure' ? (
            <>
              <ModePills value={op} onChange={(v) => update({ op: v })} options={JUMP_OPS} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label="First number" value={a} min={0} max={20} onChange={(v) => update({ a: v })} />
                <Slider label="Second number" value={b} min={0} max={20} onChange={(v) => update({ b: v })} tone="text-sky-300" />
              </div>
              {s.task && <TaskBanner text={`Your turn: find a ${s.task === 'div' ? 'division' : 'subtraction'} of two whole numbers whose answer is NOT a whole number.`} done={op === s.task && !r.whole} />}
              <p className="text-sm text-slate-300">{why}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[['add', 'Addition', true], ['mul', 'Multiplication', true], ['sub', 'Subtraction', false], ['div', 'Division', false]].map(([k, name, closed]) => (
                  <div key={k} className={`px-2 py-1.5 rounded-lg border ${closed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-red-500/40 bg-red-500/10 text-red-200'}`}>
                    <div className="font-bold">{name}</div>
                    <div>{closed ? 'Closed: always whole' : 'Not closed: try 3 − 5 or 7 ÷ 2'}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label="Laddoos (number to divide)" value={a} min={0} max={24} onChange={(v) => update({ a: v })} />
                <Slider label="Divide by" value={b} min={0} max={8} onChange={(v) => update({ b: v })} tone="text-sky-300" />
              </div>
              <p className="text-sm text-slate-300">Division is multiplication backwards: {a} ÷ {b} asks which number times {b} gives {a}. Every number times 0 is 0, so dividing a number other than 0 by 0 has no answer. Division by zero is <strong className="text-red-300">not defined</strong>.</p>
            </>
          )}
        </div>
      }
    >
      {s.mode === 'divzero' ? <DivZeroView s={{ a, b }} /> : <ClosureView s={{ ...s, op, a, b }} onInteract={onInteract} />}
    </StoryStage>
  );
}

// ─── WIDGET 4: Laddoo trays: commutative and associative properties ───
export function Class6ArrayPropertiesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'commute', r: 3, c: 5, turned: false, a: 4, b: 6, swapped: false, op: 'sub', grouping: 'left', task: null }, visual);
  const mode = ['commute', 'add', 'notcommute', 'assoc'].includes(s.mode) ? s.mode : 'commute';
  const done = s.task === 'turn' && s.turned;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const titles = {
    commute: s.turned ? `${s.c} rows of ${s.r} = ${s.r} rows of ${s.c}` : `${s.r} rows of ${s.c} laddoos`,
    add: 'Order does not matter in addition',
    notcommute: s.op === 'div' ? 'Swap a division? It breaks!' : 'Swap a subtraction? It breaks!',
    assoc: 'Grouping does not matter in multiplication',
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Properties of Operations"
      title={titles[mode]}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'commute', label: 'Turn the tray (×)' }, { value: 'add', label: 'Swap the order (+)' }, { value: 'notcommute', label: 'Swap − or ÷?' }, { value: 'assoc', label: 'Regroup (associative)' }]} />
          {mode === 'commute' && (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label="Rows" value={s.r} min={1} max={6} onChange={(v) => update({ r: v, turned: false })} />
                <Slider label="Laddoos in each row" value={s.c} min={1} max={8} onChange={(v) => update({ c: v, turned: false })} tone="text-sky-300" />
              </div>
              <button onClick={() => update({ turned: !s.turned })} className={btn}>⟳ Turn the tray a quarter turn</button>
              {s.task === 'turn' && <TaskBanner text={`Your turn: turn the tray so that ${s.r} rows of ${s.c} become ${s.c} rows of ${s.r}.`} done={done} />}
              <p className="text-sm text-slate-300">Turning the tray does not add or remove a single laddoo, so <strong className="text-emerald-300">{s.r} × {s.c} = {s.c} × {s.r} = {s.r * s.c}</strong>. Multiplication is commutative.</p>
            </>
          )}
          {mode === 'add' && (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label="First number" value={s.a} min={0} max={10} onChange={(v) => update({ a: v })} />
                <Slider label="Second number" value={s.b} min={0} max={10} onChange={(v) => update({ b: v })} tone="text-sky-300" />
              </div>
              <button onClick={() => update({ swapped: !s.swapped })} className={btn}>⇄ Swap the order</button>
              <p className="text-sm text-slate-300">The blocks only change places, the total length stays {s.a + s.b}. So <strong className="text-emerald-300">{s.a} + {s.b} = {s.b} + {s.a}</strong>. Addition is commutative.</p>
            </>
          )}
          {mode === 'notcommute' && (
            <>
              <ModePills value={s.op} onChange={(o) => update({ op: o, a: o === 'div' ? 12 : 7, b: o === 'div' ? 3 : 3 })} options={[{ value: 'sub', label: 'Subtraction' }, { value: 'div', label: 'Division' }]} />
              <p className="text-sm text-slate-300">{s.op === 'div' ? `${s.a} ÷ ${s.b} = ${s.a / s.b}, but ${s.b} ÷ ${s.a} is not even a whole number.` : `${s.a} − ${s.b} = ${s.a - s.b}, but ${s.b} − ${s.a} has no whole number answer.`} So subtraction and division are <strong className="text-red-300">not commutative</strong>.</p>
            </>
          )}
          {mode === 'assoc' && (
            <>
              <button onClick={() => update({ grouping: s.grouping === 'left' ? 'right' : 'left' })} className={btn}>⇄ Regroup the laddoos</button>
              <p className="text-sm text-slate-300">Same 24 laddoos, packed two different ways: <strong className="text-emerald-300">(2 × 3) × 4 = 2 × (3 × 4) = 24</strong>. Multiplication (and addition) is associative: you may group in whichever way is easiest.</p>
            </>
          )}
        </div>
      }
    >
      {mode === 'commute' && <TrayView r={s.r} c={s.c} turned={s.turned} />}
      {mode === 'add' && <SwapBarsView a={s.a} b={s.b} swapped={s.swapped} />}
      {mode === 'notcommute' && <NotCommuteView op={s.op} a={s.a} b={s.b} />}
      {mode === 'assoc' && <AssocView grouping={s.grouping} />}
    </StoryStage>
  );
}

function TrayView({ r, c, turned }) {
  const rr = clamp(r, 1, 6);
  const cc = clamp(c, 1, 8);
  const angle = useTween(turned ? 90 : 0, 1300);
  const p = useReplay(`${rr}-${cc}-${turned}`, 1600);
  const u = Math.min(40, 205 / Math.max(rr, cc));
  const cx = 300;
  const cy = 172;
  const gw = cc * u;
  const gh = rr * u;
  const total = rr * cc;
  const counted = Math.min(total, Math.floor(seg(p, 0.6, 1) * total));
  const rows = turned ? cc : rr;
  const cols = turned ? rr : cc;
  const settled = Math.abs(angle - (turned ? 90 : 0)) < 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        <rect x={cx - gw / 2 - 14} y={cy - gh / 2 - 14} width={gw + 28} height={gh + 28} rx="14" fill="#451a03" stroke="#a16207" strokeWidth="4" />
        {Array.from({ length: total }, (_, i) => {
          const row = Math.floor(i / cc);
          const col = i % cc;
          const lit = p >= 1 || i < counted;
          return <Laddoo key={i} x={cx - gw / 2 + col * u + u / 2} y={cy - gh / 2 + row * u + u / 2} r={u * 0.38} dim={!lit && p > 0.55} />;
        })}
      </g>
      <text x="300" y="34" textAnchor="middle" fill={AMBER} fontSize="22" fontWeight="900" fontFamily="sans-serif" opacity={settled ? 1 : 0.3}>{rows} rows of {cols}</text>
      <text x="300" y="320" textAnchor="middle" fill={INK} fontSize="24" fontWeight="900" fontFamily="monospace" opacity={settled ? 1 : 0.3}>{rows} × {cols} = {p >= 1 ? total : counted}</text>
      {turned && settled && <text x="300" y="350" textAnchor="middle" fill={GREEN} fontSize="17" fontWeight="900" fontFamily="monospace" style={{ animation: 'wnFadeIn 500ms ease' }}>{rr} × {cc} = {cc} × {rr}</text>}
    </svg>
  );
}

function SwapBarsView({ a, b, swapped }) {
  const t = useTween(swapped ? 1 : 0, 1300);
  const n = a + b;
  const bw = Math.min(40, 480 / Math.max(1, n));
  const x0 = 300 - (n * bw) / 2;
  const Y = 160;
  const first = t < 0.5 ? [a, AMBER] : [b, SKY];
  const second = t < 0.5 ? [b, SKY] : [a, AMBER];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="300" y="60" textAnchor="middle" fill={INK} fontSize="30" fontWeight="900" fontFamily="monospace">
        <tspan fill={first[1]}>{first[0]}</tspan> + <tspan fill={second[1]}>{second[0]}</tspan> = <tspan fill={GREEN}>{n}</tspan>
      </text>
      {Array.from({ length: a }, (_, i) => {
        const x = lerp(x0 + i * bw, x0 + (b + i) * bw, t);
        const y = Y - Math.sin(Math.PI * t) * 60;
        return <rect key={`a${i}`} x={x + 2} y={y} width={bw - 4} height="44" rx="6" fill={AMBER} />;
      })}
      {Array.from({ length: b }, (_, j) => {
        const x = lerp(x0 + (a + j) * bw, x0 + j * bw, t);
        const y = Y + Math.sin(Math.PI * t) * 60;
        return <rect key={`b${j}`} x={x + 2} y={y} width={bw - 4} height="44" rx="6" fill={SKY} />;
      })}
      <line x1={x0} y1="262" x2={x0 + n * bw} y2="262" stroke={GREEN} strokeWidth="3" />
      <line x1={x0} y1="252" x2={x0} y2="272" stroke={GREEN} strokeWidth="3" />
      <line x1={x0 + n * bw} y1="252" x2={x0 + n * bw} y2="272" stroke={GREEN} strokeWidth="3" />
      <text x="300" y="298" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="sans-serif">total length {n}, whichever comes first</text>
    </svg>
  );
}

function NotCommuteView({ op, a, b }) {
  const p = useReplay(`${op}-${a}-${b}`, 1800);
  const fly = ease(seg(p, 0.15, 0.75));
  const show = p > 0.75;
  const panel = (x0, title) => (
    <g>
      <rect x={x0} y="20" width="270" height="320" rx="16" fill="#0f172a" stroke="#1e293b" />
      <text x={x0 + 135} y="54" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">{title}</text>
    </g>
  );
  if (op === 'div') {
    const q = a / b;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {panel(20, `${a} ÷ ${b}`)}
        {panel(310, `${b} ÷ ${a}`)}
        {Array.from({ length: b }, (_, k) => {
          const bx = 40 + k * (230 / b);
          return (
            <g key={k}>
              <rect x={bx} y="150" width={230 / b - 10} height="110" rx="10" fill="rgba(56,189,248,0.08)" stroke={SKY} strokeWidth="2" />
              {Array.from({ length: q }, (_, j) => {
                const idx = j * b + k;
                const t = ease(seg(p, 0.1 + (idx / a) * 0.6, 0.2 + (idx / a) * 0.6));
                const tx = bx + (230 / b - 10) / 2 + ((j % 2) - 0.5) * 22;
                const ty = 180 + Math.floor(j / 2) * 26;
                return <Laddoo key={j} x={lerp(155, tx, t)} y={lerp(95, ty, t)} r={9} />;
              })}
            </g>
          );
        })}
        {show && <text x="155" y="300" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 400ms ease' }}>{q} in each box ✔</text>}
        {Array.from({ length: a }, (_, k) => (
          <rect key={k} x={330 + (k % 6) * 38} y={150 + Math.floor(k / 6) * 50} width="30" height="40" rx="6" fill="rgba(248,113,113,0.06)" stroke={RED} strokeWidth="1.5" />
        ))}
        {Array.from({ length: b }, (_, k) => {
          const t = ease(seg(p, 0.1 + k * 0.15, 0.35 + k * 0.15));
          return <Laddoo key={k} x={lerp(420 + k * 26, 345 + k * 38, t)} y={lerp(95, 170, t)} r={9} />;
        })}
        {show && <text x="445" y="300" textAnchor="middle" fill={RED} fontSize="16" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 400ms ease' }}>Not even 1 each ✘</text>}
      </svg>
    );
  }
  const block = (x, y, color, extra) => <rect x={x} y={y} width="22" height="30" rx="5" fill={color} {...extra} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      {panel(20, `${a} − ${b}`)}
      {panel(310, `${b} − ${a}`)}
      {Array.from({ length: a }, (_, i) => {
        const gone = i >= a - b;
        const x = 155 - (Math.min(a, 8) * 28) / 2 + (i % 8) * 28;
        const y = 150 + Math.floor(i / 8) * 40;
        return <g key={i}>{block(x, gone ? y - fly * 90 : y, gone ? PINK : AMBER, { opacity: gone ? 1 - fly * 0.8 : 1 })}</g>;
      })}
      {show && <text x="155" y="300" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 400ms ease' }}>{a - b} left ✔</text>}
      {Array.from({ length: a }, (_, i) => {
        const real = i < b;
        const x = 445 - (Math.min(a, 8) * 28) / 2 + (i % 8) * 28;
        const y = 150 + Math.floor(i / 8) * 40;
        if (real) return <g key={i}>{block(x, y - fly * 90, PINK, { opacity: 1 - fly * 0.8 })}</g>;
        return show ? <g key={i} style={{ animation: 'wnFadeIn 400ms ease' }}>{block(x, y, 'none', { stroke: RED, strokeWidth: 2, strokeDasharray: '4 3' })}</g> : null;
      })}
      {show && <text x="445" y="270" textAnchor="middle" fill={RED} fontSize="14" fontWeight="800" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 400ms ease' }}>{a - b} more needed, but none left</text>}
      {show && <text x="445" y="300" textAnchor="middle" fill={RED} fontSize="18" fontWeight="900" fontFamily="sans-serif" style={{ animation: 'wnFadeIn 400ms ease' }}>No whole number ✘</text>}
    </svg>
  );
}

function AssocView({ grouping }) {
  const t = useTween(grouping === 'right' ? 1 : 0, 1500);
  const U = 28;
  // left: (2 × 3) × 4 → 4 boxes, each 2 rows × 3 columns
  const L = { bw: 3 * U + 16, gap: 18, y: 120 };
  const Lx0 = 300 - (4 * L.bw + 3 * L.gap) / 2;
  // right: 2 × (3 × 4) → 2 boxes, each 3 rows × 4 columns
  const R = { bw: 4 * U + 16, gap: 40, y: 104 };
  const Rx0 = 300 - (2 * R.bw + R.gap) / 2;
  const dots = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 4; k++) {
    const lx = Lx0 + k * (L.bw + L.gap) + 8 + j * U + U / 2;
    const ly = L.y + 8 + i * U + U / 2;
    const rx = Rx0 + i * (R.bw + R.gap) + 8 + k * U + U / 2;
    const ry = R.y + 8 + j * U + U / 2;
    dots.push([lerp(lx, rx, ease(t)), lerp(ly, ry, ease(t)), `${i}${j}${k}`]);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <g opacity={1 - t}>
        {Array.from({ length: 4 }, (_, k) => (
          <rect key={k} x={Lx0 + k * (L.bw + L.gap)} y={L.y} width={L.bw} height={2 * U + 16} rx="10" fill="rgba(251,191,36,0.06)" stroke={AMBER} strokeWidth="2" />
        ))}
        <text x="300" y="48" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace"><tspan fill={AMBER}>(2 × 3)</tspan> × 4</text>
        <text x="300" y="84" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">4 boxes, each holding 2 × 3 = 6 laddoos</text>
        <text x="300" y="250" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">= 6 × 4 = 24</text>
      </g>
      <g opacity={t}>
        {Array.from({ length: 2 }, (_, i) => (
          <rect key={i} x={Rx0 + i * (R.bw + R.gap)} y={R.y} width={R.bw} height={3 * U + 16} rx="10" fill="rgba(56,189,248,0.06)" stroke={SKY} strokeWidth="2" />
        ))}
        <text x="300" y="48" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">2 × <tspan fill={SKY}>(3 × 4)</tspan></text>
        <text x="300" y="84" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">2 boxes, each holding 3 × 4 = 12 laddoos</text>
        <text x="300" y="250" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">= 2 × 12 = 24</text>
      </g>
      {dots.map(([x, y, k]) => <Laddoo key={k} x={x} y={y} r={10} />)}
      <text x="300" y="300" textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" fontFamily="monospace">(2 × 3) × 4 = 2 × (3 × 4)</text>
      <text x="300" y="332" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">The laddoos only move between boxes. None are added or lost.</text>
    </svg>
  );
}

// ─── WIDGET 5: The area model: distributive property, mental maths, and the identities 0 and 1 ───
export function Class6AreaModelWidget({ visual, onInteract }) {
  const svgRef = useRef(null);
  const [s, update] = useSceneState({ mode: 'split', a: 6, b: 14, cut: 14, apart: false, base: 100, kind: 'mul1', n: 7, task: null }, visual);
  const mode = ['split', 'mental', 'identity'].includes(s.mode) ? s.mode : 'split';
  const a = clamp(Math.round(Number(s.a)) || 1, 1, 12);
  const b = clamp(Math.round(Number(s.b)) || 1, 1, 20);
  const cut = clamp(Math.round(Number(s.cut)), 0, b);
  const split = mode === 'split' && cut > 0 && cut < b;
  const gap = useTween(split && s.apart ? 34 : 0, 900);
  const u = Math.min(28, 480 / b, 200 / a);
  const x0 = 300 - (b * u) / 2 - 17;
  const y0 = 66;
  const dragProps = useSvgDrag(svgRef, (x) => update({ cut: clamp(Math.round((x - x0) / u), 0, b), apart: true }));
  const done = mode === 'split' && s.task !== null && s.task !== undefined && cut === s.task;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <StoryStage
      eyebrow="Visualizer · Area Model"
      title={mode === 'split' ? `${a} × ${b}: split it into easy pieces` : mode === 'mental' ? 'Mental maths with a round number' : 'The special numbers 0 and 1'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'split', label: 'Distributive split' }, { value: 'mental', label: 'Mental maths' }, { value: 'identity', label: 'Identities 0 and 1' }]} />
          {mode === 'split' && (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <Slider label="Rows" value={a} min={1} max={12} onChange={(v) => update({ a: v })} />
                <Slider label="Columns" value={b} min={2} max={20} onChange={(v) => update({ b: v, cut: Math.min(cut, v) })} tone="text-sky-300" />
                <Slider label="Cut after column" value={cut} min={0} max={b} onChange={(v) => update({ cut: v, apart: true })} tone="text-pink-300" />
              </div>
              {s.task !== null && s.task !== undefined && <TaskBanner text={`Your turn: drag the cut line so that ${a} × ${b} splits into ${a} × ${s.task} and ${a} × ${b - s.task}.`} done={done} />}
              <p className="text-sm text-slate-300 font-mono">{split ? `${a} × ${b} = ${a} × (${cut} + ${b - cut}) = ${a} × ${cut} + ${a} × ${b - cut} = ${a * cut} + ${a * (b - cut)} = ${a * b}` : 'Drag the pink cut line (or use the slider) to split the rectangle.'}</p>
            </>
          )}
          {mode === 'mental' && (
            <div className="flex flex-wrap gap-2">
              {[[98, 25], [102, 25], [99, 47], [101, 36]].map(([x, y]) => (
                <button key={`${x}-${y}`} onClick={() => update({ a: x, b: y, base: 100 })} className={btn}>{x} × {y}</button>
              ))}
            </div>
          )}
          {mode === 'identity' && (
            <>
              <ModePills value={s.kind} onChange={(kind) => update({ kind })} options={[{ value: 'add0', label: 'Add 0' }, { value: 'mul1', label: 'Multiply by 1' }, { value: 'mul0', label: 'Multiply by 0' }]} />
              <Slider label="Number" value={clamp(s.n, 1, 10)} min={1} max={10} onChange={(v) => update({ n: v })} />
            </>
          )}
        </div>
      }
    >
      {mode === 'split' && (
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none" {...dragProps}>
          <rect width={W} height={H} fill="#020617" />
          {Array.from({ length: a * b }, (_, i) => {
            const row = Math.floor(i / b);
            const col = i % b;
            const left = col < cut || !split;
            const x = x0 + col * u + (left ? 0 : gap);
            return <rect key={i} x={x + 1} y={y0 + row * u + 1} width={u - 2} height={u - 2} rx="3" fill={left ? AMBER : SKY} opacity={left ? 0.75 : 0.7} style={{ transition: 'fill 400ms ease' }} />;
          })}
          <text x={x0 - 12} y={y0 + (a * u) / 2 + 6} textAnchor="end" fill={INK} fontSize="18" fontWeight="900" fontFamily="monospace">{a}</text>
          {split ? (
            <g>
              <text x={x0 + (cut * u) / 2} y={y0 - 10} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily="monospace">{cut}</text>
              <text x={x0 + cut * u + gap + ((b - cut) * u) / 2} y={y0 - 10} textAnchor="middle" fill={SKY} fontSize="18" fontWeight="900" fontFamily="monospace">{b - cut}</text>
              <PieceLabel cx={x0 + (cut * u) / 2} cy={y0 + (a * u) / 2} w={cut * u} h={a * u} stroke="#78350f" text={`${a} × ${cut} = ${a * cut}`} />
              <PieceLabel cx={x0 + cut * u + gap + ((b - cut) * u) / 2} cy={y0 + (a * u) / 2} w={(b - cut) * u} h={a * u} stroke="#0c4a6e" text={`${a} × ${b - cut} = ${a * (b - cut)}`} />
            </g>
          ) : (
            <g>
              <text x={x0 + (b * u) / 2} y={y0 - 10} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily="monospace">{b}</text>
              <text x={x0 + (b * u) / 2} y={y0 + (a * u) / 2 + 6} textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="monospace" paintOrder="stroke" stroke="#78350f" strokeWidth="4">{a} × {b} = ?</text>
            </g>
          )}
          {/* cut line and its handle */}
          <g style={{ cursor: 'ew-resize' }}>
            <line x1={x0 + cut * u + gap / 2} y1={y0 - 4} x2={x0 + cut * u + gap / 2} y2={y0 + a * u + 4} stroke={PINK} strokeWidth="3" strokeDasharray="6 4" />
            <circle cx={x0 + cut * u + gap / 2} cy={y0 + a * u + 18} r="11" fill={PINK} opacity="0.85">
              <animate attributeName="r" values="9;13;9" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
          <text x="300" y={Math.min(y0 + a * u + 60, 318)} textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" fontFamily="monospace">{split ? `${a} × ${b} = ${a} × ${cut} + ${a} × ${b - cut}` : `${a} × ${b}`}</text>
          {split && <text x="300" y={Math.min(y0 + a * u + 90, 348)} textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace" style={{ animation: 'wnFadeIn 500ms ease' }}>= {a * cut} + {a * (b - cut)} = {a * b}</text>}
        </svg>
      )}
      {mode === 'mental' && <MentalView a={clamp(Math.round(Number(s.a)) || 98, 90, 110)} b={clamp(Math.round(Number(s.b)) || 25, 1, 99)} base={100} />}
      {mode === 'identity' && <IdentityView kind={s.kind} n={clamp(Math.round(Number(s.n)) || 7, 1, 10)} />}
    </StoryStage>
  );
}

// Label inside one piece of the split rectangle; turned sideways when the piece is too thin
function PieceLabel({ cx, cy, w, h, stroke, text }) {
  const side = w < text.length * 9 && h > w;
  const size = side ? Math.min(15, (h - 10) / (text.length * 0.62)) : Math.min(17, (w - 8) / (text.length * 0.62));
  return (
    <text x={cx} y={cy + size / 3} textAnchor="middle" fill="white" fontSize={size} fontWeight="900" fontFamily="monospace" paintOrder="stroke" stroke={stroke} strokeWidth="4" transform={side ? `rotate(-90 ${cx} ${cy})` : undefined}>{text}</text>
  );
}

function MentalView({ a, b, base }) {
  const p = useReplay(`${a}-${b}`, 2200);
  const grow = ease(seg(p, 0, 0.35));
  const move = ease(seg(p, 0.45, 0.85));
  const diff = Math.abs(base - a);
  const less = a < base;
  const RX = 70;
  const RY = 92;
  const RW = 400;
  const RH = 130;
  const SW = Math.max(40, diff * 18);
  const stripX = less ? RX + RW - SW + move * 70 : RX + RW + (1 - move) * 90;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">{a} × {b} = ?</text>
      <text x="300" y="68" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">{a} is close to {base}. Use {base}, then fix the difference.</text>
      <text x={RX} y={RY + RH + 26} fill="#64748b" fontSize="11" fontWeight="700" fontFamily="sans-serif">not drawn to scale</text>
      <rect x={RX} y={RY} width={RW * grow} height={RH} rx="8" fill={SKY} opacity="0.35" stroke={SKY} strokeWidth="2" />
      <text x={RX - 10} y={RY + RH / 2 + 6} textAnchor="end" fill={INK} fontSize="18" fontWeight="900" fontFamily="monospace">{b}</text>
      <text x={RX + RW / 2} y={RY + RH + 26} textAnchor="middle" fill={SKY} fontSize="16" fontWeight="900" fontFamily="monospace" opacity={grow}>{base}</text>
      <text x={RX + (RW - (less ? SW : 0)) / 2} y={RY + RH / 2 + 7} textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="monospace" opacity={grow} paintOrder="stroke" stroke="#0c4a6e" strokeWidth="4">{base} × {b} = {indian(base * b)}</text>
      {p > 0.4 && diff > 0 && (
        <g opacity={less ? 1 - move * 0.35 : 1}>
          <rect x={stripX} y={RY} width={SW} height={RH} rx="6" fill={less ? RED : GREEN} opacity="0.55" stroke={less ? RED : GREEN} strokeWidth="2" />
          <text x={stripX + SW / 2} y={RY + RH + 26} textAnchor="middle" fill={less ? RED : GREEN} fontSize="14" fontWeight="900" fontFamily="monospace">{diff}</text>
          <text x={Math.min(stripX + SW / 2, 545)} y={RY + RH + 48} textAnchor="middle" fill={less ? RED : GREEN} fontSize="14" fontWeight="900" fontFamily="monospace">{less ? '−' : '+'} {diff} × {b} = {diff * b}</text>
        </g>
      )}
      <text x="300" y="296" textAnchor="middle" fill={INK} fontSize="19" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.5, 0.7)}>{a} × {b} = {base} × {b} {less ? '−' : '+'} {diff} × {b}</text>
      <text x="300" y="330" textAnchor="middle" fill={GREEN} fontSize="21" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.8, 1)}>= {indian(base * b)} {less ? '−' : '+'} {indian(diff * b)} = {indian(a * b)}</text>
    </svg>
  );
}

function IdentityView({ kind, n }) {
  const p = useReplay(`${kind}-${n}`, 1800);
  const u = Math.min(48, 440 / n);
  const x0 = 300 - (n * u) / 2;
  const appear = (i) => ease(seg(p, (i / n) * 0.4, (i / n) * 0.4 + 0.2));
  const squash = kind === 'mul0' ? 1 - ease(seg(p, 0.55, 0.95)) : 1;
  const eq = kind === 'add0' ? `${n} + 0 = ${n}` : kind === 'mul1' ? `${n} × 1 = ${n}` : `${n} × 0 = 0`;
  const note = kind === 'add0' ? 'Adding an empty basket changes nothing: 0 is the identity for addition.' : kind === 'mul1' ? `One row of ${n} is just ${n}: 1 is the identity for multiplication.` : 'Zero rows means zero laddoos. Any number times 0 is 0.';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="300" y="50" textAnchor="middle" fill={INK} fontSize="32" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.6, 0.9)}>{eq}</text>
      {kind === 'add0' ? (
        <g>
          {Array.from({ length: n }, (_, i) => (
            <rect key={i} x={x0 - 70 + i * u + 2} y={150 - (1 - appear(i)) * 60} width={u - 4} height={u - 4} rx="6" fill={AMBER} opacity={appear(i)} />
          ))}
          <text x={x0 - 70 + n * u + 18} y={150 + u / 2 + 4} fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">+</text>
          <g transform={`translate(${(1 - ease(seg(p, 0.4, 0.7))) * 120} 0)`} opacity={seg(p, 0.4, 0.6)}>
            <rect x={x0 - 70 + n * u + 50} y={140} width="90" height={u + 16} rx="10" fill="none" stroke={SKY} strokeWidth="3" strokeDasharray="7 5" />
            <text x={x0 - 70 + n * u + 95} y={140 + u + 40} textAnchor="middle" fill={SKY} fontSize="14" fontWeight="800" fontFamily="sans-serif">0 (empty)</text>
          </g>
        </g>
      ) : (
        <g>
          <g transform={`translate(0 ${170}) scale(1 ${squash}) translate(0 ${-170})`}>
            <rect x={x0 - 10} y={170 - u / 2 - 10} width={n * u + 20} height={u + 20} rx="12" fill="#451a03" stroke="#a16207" strokeWidth="3" />
            {Array.from({ length: n }, (_, i) => (
              <g key={i} opacity={appear(i)}>
                <Laddoo x={x0 + i * u + u / 2} y={170} r={u * 0.38} />
              </g>
            ))}
          </g>
          {kind === 'mul0' && <rect x={x0 - 10} y={170 - u / 2 - 10} width={n * u + 20} height={u + 20} rx="12" fill="none" stroke="#a16207" strokeWidth="2" strokeDasharray="8 6" opacity={seg(p, 0.8, 1)} />}
          {kind === 'mul0' && p > 0.95 && <text x="300" y={170 + u / 2 + 34} textAnchor="middle" fill="#a16207" fontSize="14" fontWeight="800" fontFamily="sans-serif">the tray is empty</text>}
          <text x={x0 - 22} y={176} textAnchor="end" fill={kind === 'mul0' ? RED : SKY} fontSize="16" fontWeight="900" fontFamily="sans-serif">{kind === 'mul0' ? (p > 0.95 ? '0 rows' : '1 row') : '1 row'}</text>
        </g>
      )}
      <text x="300" y="290" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="800" fontFamily="sans-serif" opacity={seg(p, 0.7, 1)}>{note}</text>
    </svg>
  );
}

// ─── WIDGET 6: Numbers as dot shapes (line, rectangle, square, triangle) and shortcuts with 9, 99, 999 ───
const isPrime = (n) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
const rectPairs = (n) => {
  const out = [];
  for (let r = 2; r * r <= n; r++) if (n % r === 0) out.push([r, n / r]);
  return out;
};
const isTri = (n) => {
  let t = 0;
  for (let k = 1; t < n; k++) t += k;
  return t === n;
};

function arrangeDots(n, shape, rectIdx) {
  const cells = [];
  let ok = true;
  if (shape === 'rect') {
    const pairs = rectPairs(n);
    if (pairs.length) {
      const [r, c] = pairs[rectIdx % pairs.length];
      for (let i = 0; i < n; i++) cells.push([i % c, Math.floor(i / c), true]);
      void r;
    } else {
      ok = false;
      const c = Math.max(1, Math.floor(n / 2));
      for (let i = 0; i < n; i++) cells.push(i < 2 * c ? [i % c, Math.floor(i / c), true] : [c, 0.5, false]);
    }
  } else if (shape === 'square') {
    const k = Math.floor(Math.sqrt(n));
    ok = k * k === n;
    for (let i = 0; i < n; i++) cells.push(i < k * k ? [i % k, Math.floor(i / k), true] : [i - k * k, k, false]);
  } else if (shape === 'triangle') {
    let row = 0;
    let used = 0;
    while (used + row + 1 <= n) { used += row + 1; row += 1; }
    ok = used === n;
    let i = 0;
    for (let r = 0; r < row; r++) for (let j = 0; j <= r; j++) { cells.push([j - r / 2, r, true]); i++; }
    for (let j = 0; i < n; j++, i++) cells.push([j - row / 2, row, false]);
  } else {
    for (let i = 0; i < n; i++) cells.push([i, 0, true]);
  }
  const xs = cells.map((c) => c[0]);
  const ys = cells.map((c) => c[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const sp = Math.min(42, 500 / Math.max(1, maxX - minX + 1), 200 / Math.max(1, maxY + 1));
  const pts = cells.map(([cx, cy, good]) => [300 + (cx - (minX + maxX) / 2) * sp, 175 + (cy - maxY / 2) * sp, good]);
  return { pts, ok, r: Math.min(13, sp * 0.36) };
}

function DotsView({ n, shape, rectIdx }) {
  const { pts, ok, r } = arrangeDots(n, shape, rectIdx);
  const pairs = rectPairs(n);
  const pair = pairs.length ? pairs[rectIdx % pairs.length] : null;
  const k = Math.floor(Math.sqrt(n));
  const left = pts.filter((q) => !q[2]).length;
  let msg;
  if (shape === 'line') msg = `${n} as a line: every number can be a line of dots.`;
  else if (shape === 'rect') msg = ok ? `${n} = ${pair[0]} rows of ${pair[1]}: a rectangle!` : n < 2 ? '1 dot cannot make a rectangle.' : `No rectangle for ${n}: it can only be a line. ${n} is a prime number!`;
  else if (shape === 'square') msg = ok ? `${n} = ${k} × ${k}: a square number!` : `${n} is not a square number: ${left} dot${left === 1 ? '' : 's'} left over.`;
  else msg = ok ? `${n} is a triangular number!` : `${n} is not a triangular number: ${left} dot${left === 1 ? '' : 's'} left over.`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="26" fontWeight="900" fontFamily="sans-serif">{n} dot{n === 1 ? '' : 's'}</text>
      {pts.map(([x, y, good], i) => (
        <g key={i} style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform 900ms cubic-bezier(.4,1.3,.6,1) ${i * 18}ms` }}>
          <circle r={r} fill={good ? AMBER : RED} />
          <circle r={r * 0.4} cx={-r * 0.3} cy={-r * 0.3} fill={good ? '#fde68a' : '#fecaca'} opacity="0.7" />
          {!good && <circle r={r + 4} fill="none" stroke={RED} strokeWidth="2"><animate attributeName="r" values={`${r + 2};${r + 9};${r + 2}`} dur="1.2s" repeatCount="indefinite" /></circle>}
        </g>
      ))}
      <text x="300" y="322" textAnchor="middle" fill={ok ? GREEN : RED} fontSize="17" fontWeight="900" fontFamily="sans-serif" key={`${n}-${shape}-${rectIdx}`} style={{ animation: 'wnFadeIn 600ms ease' }}>{msg}</text>
    </svg>
  );
}

function ShortcutView({ kind, a, k }) {
  const p = useReplay(`${kind}-${a}-${k}`, 2400);
  if (kind === 'mul') {
    const kk = k === 9 ? 9 : 99;
    const cells = kk + 1;
    const cols = 10;
    const cell = kk === 9 ? 46 : 21;
    const gx0 = 300 - (cols * cell) / 2;
    const gy0 = kk === 9 ? 150 : 62;
    const move = ease(seg(p, 0.4, 0.8));
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">{a} × {kk} = {a} × {kk + 1} − {a}</text>
        {Array.from({ length: cells }, (_, i) => {
          const last = i === cells - 1;
          const x = gx0 + (i % cols) * cell;
          const y = gy0 + Math.floor(i / cols) * cell;
          const appear = seg(p, (i / cells) * 0.35, (i / cells) * 0.35 + 0.05);
          return (
            <g key={i} transform={last ? `translate(${move * (kk === 9 ? 0 : 110)} ${move * (kk === 9 ? 70 : 0)})` : undefined} opacity={appear}>
              <rect x={x + 1.5} y={y + 1.5} width={cell - 3} height={cell - 3} rx="4" fill={last && p > 0.4 ? RED : SKY} opacity={last && p > 0.4 ? 0.8 : 0.45} />
              {kk === 9 && <text x={x + cell / 2} y={y + cell / 2 + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="monospace">{a}</text>}
            </g>
          );
        })}
        {kk === 99 && <text x="300" y="296" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">each little square is one {a} · 100 squares = {a} × 100</text>}
        {kk === 9 && <text x="300" y="134" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">10 boxes of {a} = {a} × 10 = {indian(a * 10)}</text>}
        {p > 0.6 && <text x={kk === 9 ? gx0 + 9 * cell + cell / 2 : gx0 + 10 * cell + 70} y={kk === 9 ? gy0 + cell + 92 : gy0 + 9 * cell - 8} textAnchor="middle" fill={RED} fontSize="15" fontWeight="900" fontFamily="monospace" style={{ animation: 'wnFadeIn 400ms ease' }}>− {a}</text>}
        <text x="300" y="334" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.75, 1)}>= {indian(a * (kk + 1))} − {a} = {indian(a * kk)}</text>
      </svg>
    );
  }
  const big = k + 1;
  const pad = Math.round(big * 0.2);
  const lo = a - pad;
  const hi = a + big + pad;
  const X = (v) => 40 + ((v - lo) / (hi - lo)) * 520;
  const tick = big / 10;
  const Y = 200;
  const t1 = ease(seg(p, 0.05, 0.5));
  const t2 = ease(seg(p, 0.55, 0.85));
  const firstTick = Math.ceil(lo / tick) * tick;
  const ticks = [];
  for (let v = firstTick; v <= hi; v += tick) ticks.push(v);
  const x1 = X(a);
  const x2 = X(a + big);
  const cx = (x1 + x2) / 2;
  const qx = (1 - t1) ** 2 * x1 + 2 * (1 - t1) * t1 * cx + t1 * t1 * x2;
  const qy = (1 - t1) ** 2 * (Y - 4) + 2 * (1 - t1) * t1 * (Y - 170) + t1 * t1 * (Y - 4);
  const back = X(a + big) + (X(a + k) - X(a + big)) * t2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
      <rect width={W} height={H} fill="#020617" />
      <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">{a} + {k} = {a} + {big} − 1</text>
      <line x1="28" y1={Y} x2="578" y2={Y} stroke={INK} strokeWidth="3" />
      {ticks.map((v) => <line key={v} x1={X(v)} y1={Y - 6} x2={X(v)} y2={Y + 6} stroke="#64748b" strokeWidth="1.5" />)}
      <circle cx={x1} cy={Y} r="7" fill={SKY} />
      <text x={x1} y={Y + 28} textAnchor="middle" fill={SKY} fontSize="15" fontWeight="900" fontFamily="monospace">{a}</text>
      <path d={`M ${x1} ${Y - 4} Q ${cx} ${Y - 170} ${x2} ${Y - 4}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - t1} fill="none" stroke={GREEN} strokeWidth="3" />
      {t1 >= 1 && <text x={cx} y={Y - 96} textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="monospace">+ {big}</text>}
      {t1 >= 1 && <text x={x2 + 6} y={Y - 14} textAnchor="start" fill={GREEN} fontSize="14" fontWeight="900" fontFamily="monospace">{a + big}</text>}
      {p > 0.55 && (
        <g>
          <path d={`M ${x2} ${Y + 4} C ${x2 + 34} ${Y + 56}, ${back - 34} ${Y + 56}, ${back} ${Y + 4}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - t2} fill="none" stroke={PINK} strokeWidth="3" />
          <text x={x2 + 26} y={Y + 46} textAnchor="start" fill={PINK} fontSize="16" fontWeight="900" fontFamily="monospace">− 1</text>
        </g>
      )}
      <circle cx={t2 > 0 ? back : qx} cy={t2 > 0 ? Y - 4 : qy} r="9" fill={AMBER} stroke="white" strokeWidth="2" />
      <text x={X(a + k)} y={Y + 92} textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.85, 1)}>answer {indian(a + k)}</text>
      <text x="300" y="334" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.85, 1)}>= {indian(a + big)} − 1 = {indian(a + k)}</text>
    </svg>
  );
}

export function Class6DotPatternsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'dots', n: 6, shape: 'line', rectIdx: 0, kind: 'add', a: 437, k: 99, task: null }, visual);
  const mode = s.mode === 'shortcut' ? 'shortcut' : 'dots';
  const n = clamp(Math.round(Number(s.n)) || 1, 1, 30);
  const shape = ['line', 'rect', 'square', 'triangle'].includes(s.shape) ? s.shape : 'line';
  const a = clamp(Math.round(Number(s.a)) || 0, 0, 9999);
  const done = s.task === 'prime' && n > 10 && n < 30 && isPrime(n);
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const pairs = rectPairs(n);
  const k = mode === 'shortcut' && s.kind === 'mul' && s.k === 999 ? 99 : s.k;

  return (
    <StoryStage
      eyebrow="Visualizer · Patterns in Whole Numbers"
      title={mode === 'dots' ? `What shapes can ${n} dots make?` : s.kind === 'mul' ? `Shortcut: ${a} × ${k}` : `Shortcut: ${a} + ${k}`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'dots', label: 'Dot shapes' }, { value: 'shortcut', label: 'Shortcuts with 9, 99, 999' }]} />
          {mode === 'dots' ? (
            <>
              <Slider label="Number of dots" value={n} min={1} max={30} onChange={(v) => update({ n: v, rectIdx: 0 })} />
              <div className="flex flex-wrap items-center gap-2">
                <ModePills value={shape} onChange={(sh) => update({ shape: sh, rectIdx: sh === 'rect' && shape === 'rect' ? s.rectIdx + 1 : s.rectIdx })} options={[{ value: 'line', label: 'Line' }, { value: 'rect', label: 'Rectangle' }, { value: 'square', label: 'Square' }, { value: 'triangle', label: 'Triangle' }]} />
                {shape === 'rect' && pairs.length > 1 && <button onClick={() => update({ rectIdx: s.rectIdx + 1 })} className={btn}>Another rectangle</button>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Readout label="Line" value="✔" tone="text-emerald-300" />
                <Readout label="Rectangle" value={pairs.length ? '✔' : '✘'} tone={pairs.length ? 'text-emerald-300' : 'text-red-300'} />
                <Readout label="Square" value={Math.floor(Math.sqrt(n)) ** 2 === n ? '✔' : '✘'} tone={Math.floor(Math.sqrt(n)) ** 2 === n ? 'text-emerald-300' : 'text-red-300'} />
                <Readout label="Triangle" value={isTri(n) ? '✔' : '✘'} tone={isTri(n) ? 'text-emerald-300' : 'text-red-300'} />
                <Readout label="Prime?" value={isPrime(n) ? 'yes' : 'no'} tone={isPrime(n) ? 'text-amber-300' : 'text-slate-400'} />
              </div>
              {s.task === 'prime' && <TaskBanner text="Your turn: find a number between 10 and 30 whose dots can only make a line (no rectangle)." done={done} />}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <ModePills value={s.kind} onChange={(kind) => update({ kind })} options={[{ value: 'add', label: 'Adding' }, { value: 'mul', label: 'Multiplying' }]} />
                <ModePills value={String(k)} onChange={(v) => update({ k: Number(v) })} options={(s.kind === 'mul' ? [9, 99] : [9, 99, 999]).map((v) => ({ value: String(v), label: `${v}` }))} />
                <input value={a} onChange={(e) => update({ a: Number(e.target.value.replace(/\D/g, '').slice(0, 4)) || 0 })} className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
              </div>
              <p className="text-sm text-slate-300">{s.kind === 'mul' ? `${k} is just 1 less than ${k + 1}. So ${a} × ${k} is ${k + 1} lots of ${a}, minus one ${a}.` : `${k} is just 1 less than ${k + 1}. Jump ${k + 1} (easy!), then step back 1.`}</p>
            </>
          )}
        </div>
      }
    >
      {mode === 'dots' ? <DotsView n={n} shape={shape} rectIdx={s.rectIdx || 0} /> : <ShortcutView kind={s.kind} a={a} k={k} />}
    </StoryStage>
  );
}
