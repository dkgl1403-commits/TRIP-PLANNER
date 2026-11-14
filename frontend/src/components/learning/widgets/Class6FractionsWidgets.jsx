import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner, sectorPath,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Fractions — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const int = (v, lo, hi, dflt) => clamp(Math.round(Number(v)) || dflt, lo, hi);
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);
const FADE = '@keyframes frFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';

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

function Slider({ label, value, min, max, onChange, tone = 'text-amber-300' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

// A stacked fraction: numerator, bar, denominator (bar can be hidden for the history scene)
function Frac({ x, y, n, d, color = INK, size = 26, bar = 1 }) {
  const w = size * 0.65 * Math.max(String(n).length, String(d).length) + 8;
  return (
    <g>
      <text x={x} y={y - size * 0.22} textAnchor="middle" fill={color} fontSize={size} fontWeight="900" fontFamily="monospace">{n}</text>
      <line x1={x - (w / 2) * bar} y1={y} x2={x + (w / 2) * bar} y2={y} stroke={color} strokeWidth="3" strokeLinecap="round" opacity={bar > 0 ? 1 : 0} />
      <text x={x} y={y + size * 0.95} textAnchor="middle" fill={color} fontSize={size} fontWeight="900" fontFamily="monospace">{d}</text>
    </g>
  );
}

// A bar split into `den` equal parts with the first `num` shaded (num may exceed den for whole bars only)
function Bar({ x, y, w, h, den, num, color = AMBER, label, delayStep = 60, splitOpacity = 1 }) {
  const pw = w / den;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      {Array.from({ length: den }, (_, i) => (
        <rect key={`${den}-${i}`} x={x + i * pw + 1.5} y={y + 1.5} width={Math.max(0, pw - 3)} height={h - 3} rx="4"
          fill={color} opacity={i < num ? 0.85 : 0} style={{ transition: `opacity 400ms ease ${i * delayStep}ms` }} />
      ))}
      {Array.from({ length: den - 1 }, (_, i) => (
        <line key={`l${den}-${i}`} x1={x + (i + 1) * pw} y1={y} x2={x + (i + 1) * pw} y2={y + h} stroke={INK} strokeWidth="2" opacity={splitOpacity} />
      ))}
      {label && <text x={x + w + 14} y={y + h / 2 + 7} fill={color} fontSize="18" fontWeight="900" fontFamily="monospace">{label}</text>}
    </g>
  );
}

// A round pizza cut into `den` equal slices (or custom slice angles), `num` slices topped
function Pizza({ cx, cy, r, den, num, angles, color = AMBER, popIn = true }) {
  const cuts = angles || Array.from({ length: den + 1 }, (_, i) => 90 - (360 * i) / den);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 6} fill="#92400e" />
      <circle cx={cx} cy={cy} r={r} fill="#fde68a" />
      {cuts.slice(0, -1).map((a0, i) => {
        const a1 = cuts[i + 1];
        const on = i < num;
        return (
          <g key={`${cuts.length}-${i}`} style={{ opacity: on ? 1 : 0.0001, transition: `opacity 450ms ease ${popIn ? i * 90 : 0}ms` }}>
            <path d={sectorPath(cx, cy, r, a1, a0)} fill={color} opacity="0.85" />
            {[0.35, 0.65].map((f) => {
              const mid = ((a0 + a1) / 2) * (Math.PI / 180);
              return <circle key={f} cx={cx + r * f * Math.cos(mid)} cy={cy - r * f * Math.sin(mid)} r={Math.min(7, r * 0.07)} fill="#b91c1c" />;
            })}
          </g>
        );
      })}
      {den > 1 && cuts.slice(0, -1).map((a) => (
        <line key={`c${cuts.length}-${a}`} x1={cx} y1={cy} x2={cx + r * Math.cos((a * Math.PI) / 180)} y2={cy - r * Math.sin((a * Math.PI) / 180)} stroke="#78350f" strokeWidth="3" />
      ))}
    </g>
  );
}

function Laddoo({ x, y, r, on, color = AMBER }) {
  return (
    <g style={{ opacity: on ? 1 : 0.25, transition: 'opacity 400ms ease' }}>
      <circle cx={x} cy={y} r={r} fill={on ? color : '#78716c'} stroke="#78350f" strokeWidth="1.5" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fef3c7" opacity="0.6" />
    </g>
  );
}

// ─── WIDGET 1: What is a fraction? Pizza slices, equal parts, part of a collection ───
const UNEQUAL = [90, 20, -60, -170, -270];

export function Class6FractionPizzaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'pizza', den: 4, num: 1, total: 12, task: null }, visual);
  const mode = ['pizza', 'bar', 'unequal', 'collection'].includes(s.mode) ? s.mode : 'pizza';
  const den = int(s.den, 1, 12, 4);
  const num = clamp(Math.round(Number(s.num)) || 0, 0, den);
  const total = int(s.total, den, 24, 12);
  const group = total % den === 0 ? total / den : 0;
  const task = s.task && s.task.den ? s.task : null;
  const done = !!task && mode !== 'unequal' && num === task.num && den === task.den;
  useDone(done, onInteract);

  let picture;
  if (mode === 'pizza') {
    picture = (
      <>
        <Pizza cx={190} cy={185} r={135} den={den} num={num} />
        <Frac x={455} y={160} n={num} d={den} color={AMBER} size={58} />
        <text x="455" y="270" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">{num} of {den} equal slice{den === 1 ? '' : 's'}</text>
      </>
    );
  } else if (mode === 'bar') {
    picture = (
      <>
        <text x="300" y="60" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">One chocolate bar, {den} equal pieces</text>
        <Bar x={60} y={100} w={480} h={90} den={den} num={num} color={PINK} />
        <Frac x={300} y={260} n={num} d={den} color={PINK} size={44} />
        <text x="380" y="248" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">← numerator: pieces taken</text>
        <text x="380" y="300" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">← denominator: equal pieces</text>
      </>
    );
  } else if (mode === 'unequal') {
    picture = (
      <>
        <Pizza cx={170} cy={185} r={130} den={4} num={1} angles={UNEQUAL} color={RED} popIn={false} />
        <text x="430" y="120" textAnchor="middle" fill={RED} fontSize="22" fontWeight="900" fontFamily="sans-serif">4 pieces, but</text>
        <text x="430" y="150" textAnchor="middle" fill={RED} fontSize="22" fontWeight="900" fontFamily="sans-serif">NOT equal ✘</text>
        <text x="430" y="200" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="700" fontFamily="sans-serif">The red piece is not</text>
        <text x="430" y="222" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontWeight="700" fontFamily="sans-serif">one quarter.</text>
        <text x="430" y="262" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="800" fontFamily="sans-serif">Fractions need EQUAL parts.</text>
      </>
    );
  } else {
    const cols = group > 0 && group <= 8 ? group * Math.floor(8 / group) : Math.min(total, 8); // whole groups per row
    picture = (
      <>
        <text x="300" y="40" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">{total} laddoos in {den} equal group{den === 1 ? '' : 's'}</text>
        {Array.from({ length: total }, (_, i) => {
          const g = group ? Math.floor(i / group) : 0;
          return <Laddoo key={i} x={110 + (i % cols) * 50} y={85 + Math.floor(i / cols) * 50} r={17} on={group ? g < num : false} color={g % 2 ? AMBER : '#f59e0b'} />;
        })}
        {group > 0 && Array.from({ length: den }, (_, g) => {
          const first = g * group;
          const last = first + group - 1;
          const rows = [Math.floor(first / cols), Math.floor(last / cols)];
          if (rows[0] !== rows[1]) return null;
          const x0 = 110 + (first % cols) * 50 - 23;
          const x1 = 110 + (last % cols) * 50 + 23;
          return <rect key={`g${den}-${g}`} x={x0} y={85 + rows[0] * 50 - 23} width={x1 - x0} height="46" rx="14" fill="none" stroke={g < num ? AMBER : '#475569'} strokeWidth="2" strokeDasharray="5 4" />;
        })}
        {group > 0
          ? <text x="300" y="325" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">{num}/{den} of {total} = {num} × {group} = {num * group}</text>
          : <text x="300" y="325" textAnchor="middle" fill={RED} fontSize="17" fontWeight="800" fontFamily="sans-serif">{total} cannot be split into {den} equal groups. Try another number.</text>}
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Equal parts"
      title={mode === 'collection' ? 'A fraction of a collection' : mode === 'unequal' ? 'Are these quarters?' : `${num} out of ${den} equal parts`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'pizza', label: 'Pizza' }, { value: 'bar', label: 'Chocolate bar' }, { value: 'unequal', label: 'Unequal cut' }, { value: 'collection', label: 'Laddoo box' }]} />
          {mode !== 'unequal' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Equal parts (denominator)" value={den} min={1} max={12} onChange={(v) => update({ den: v, num: Math.min(num, v) })} tone="text-sky-300" />
              <Slider label="Parts taken (numerator)" value={num} min={0} max={den} onChange={(v) => update({ num: v })} />
            </div>
          )}
          {mode === 'collection' && <Slider label="Laddoos in the box" value={total} min={den} max={24} onChange={(v) => update({ total: v })} tone="text-emerald-300" />}
          {task && <TaskBanner text={`Your turn: show ${task.num}/${task.den}: cut into ${task.den} equal parts and take ${task.num}.`} done={done} />}
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

// ─── WIDGET 2: Fractions on the number line (Papa's track), proper, improper and mixed ───
export function Class6FractionLineWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ den: 4, num: 3, max: 3, showMixed: false, task: null }, visual);
  const den = int(s.den, 1, 10, 4);
  const max = int(s.max, 1, 4, 3);
  const num = clamp(Math.round(Number(s.num)) || 0, 0, den * max);
  const svgRef = useRef(null);
  const X0 = 50;
  const X1 = 550;
  const unit = (X1 - X0) / max;
  const tx = useTween(X0 + (num / den) * unit, 800);
  const drag = useSvgDrag(svgRef, (x) => update({ num: clamp(Math.round(((x - X0) / unit) * den), 0, den * max) }));
  const task = s.task && s.task.den ? s.task : null;
  const done = !!task && num * task.den === task.num * den;
  useDone(done, onInteract);
  const whole = Math.floor(num / den);
  const rem = num % den;
  const kind = num < den ? 'Proper fraction (less than 1)' : num === den * Math.round(num / den) ? 'Equal to a whole number' : 'Improper fraction (more than 1)';

  return (
    <StoryStage
      eyebrow="Visualizer · Fractions on the number line"
      title={`The train stops at ${num}/${den}`}
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Split each kilometre into (denominator)" value={den} min={1} max={10} onChange={(v) => update({ den: v, num: Math.min(Math.round((num / den) * v), v * max) })} tone="text-sky-300" />
            <Slider label="Parts travelled (numerator)" value={num} min={0} max={den * max} onChange={(v) => update({ num: v })} />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Fraction" value={`${num}/${den}`} tone="text-amber-300" />
            <Readout label="Mixed form" value={rem === 0 ? `${whole}` : whole === 0 ? `${rem}/${den}` : `${whole} ${rem}/${den}`} tone="text-emerald-300" />
            <span className="text-sm text-slate-300">{kind}. Drag the train too.</span>
          </div>
          {task && <TaskBanner text={`Your turn: park the train at ${task.num}/${task.den}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        {/* sleepers and rails */}
        {Array.from({ length: 41 }, (_, i) => <rect key={i} x={X0 - 10 + i * 13} y="196" width="6" height="26" fill="#57534e" />)}
        <line x1={X0 - 15} y1="200" x2={X1 + 15} y2="200" stroke="#a8a29e" strokeWidth="3" />
        <line x1={X0 - 15} y1="218" x2={X1 + 15} y2="218" stroke="#a8a29e" strokeWidth="3" />
        {/* part ticks */}
        {Array.from({ length: den * max + 1 }, (_, i) => {
          const x = X0 + (i / den) * unit;
          const major = i % den === 0;
          return (
            <g key={`${den}-${i}`} style={{ animation: 'frFadeIn 400ms ease both', animationDelay: `${i * 25}ms` }}>
              <line x1={x} y1={major ? 236 : 240} x2={x} y2={major ? 270 : 258} stroke={major ? INK : SKY} strokeWidth={major ? 3 : 2} />
              {major
                ? <text x={x} y="296" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">{i / den}</text>
                : den <= 6 && <text x={x} y="280" textAnchor="middle" fill={SKY} fontSize="11" fontWeight="700" fontFamily="monospace">{i}/{den}</text>}
            </g>
          );
        })}
        {/* highlighted distance */}
        <line x1={X0} y1="248" x2={tx} y2="248" stroke={AMBER} strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        {/* the train (draggable) */}
        <g transform={`translate(${tx} 0)`} {...drag} style={{ cursor: 'grab' }}>
          <rect x="-44" y="146" width="88" height="44" rx="8" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
          <rect x="-34" y="154" width="20" height="16" rx="3" fill="#bae6fd" />
          <rect x="-6" y="154" width="20" height="16" rx="3" fill="#bae6fd" />
          <rect x="22" y="134" width="14" height="14" fill="#44403c" />
          {[-28, 0, 28].map((wx) => <circle key={wx} cx={wx} cy="194" r="8" fill="#1c1917" stroke="#a8a29e" strokeWidth="2" />)}
          <polygon points="0,226 -8,238 8,238" fill={AMBER} />
        </g>
        <g>
          <Frac x={tx} y={88} n={num} d={den} color={AMBER} size={30} />
        </g>
        {s.showMixed && num > den && rem !== 0 && (
          <text x="300" y="336" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="monospace" style={{ animation: 'frFadeIn 500ms ease both' }}>
            {num}/{den} = {whole} whole{whole === 1 ? '' : 's'} and {rem}/{den} more = {whole} {rem}/{den}
          </text>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Dadi's fraction wall and equivalent fractions ───
const WALL_COLORS = [AMBER, PINK, SKY, GREEN, PURPLE, '#fb923c', '#facc15', '#2dd4bf'];

export function Class6FractionWallWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'wall', num: 1, den: 2, k: 1, task: null }, visual);
  const mode = s.mode === 'equiv' ? 'equiv' : 'wall';
  const den = int(s.den, 1, 8, 2);
  const num = clamp(Math.round(Number(s.num)) || 0, 0, den);
  const k = int(s.k, 1, 6, 1);
  const p = useReplay(`${mode}-${num}-${den}-${k}`, 1300);
  const task = s.task && s.task.den ? s.task : null;
  const done = !!task && mode === 'equiv' && den * k === task.den && num === task.base?.[0] && den === task.base?.[1];
  useDone(done, onInteract);
  const g = gcd(num, den) || 1;

  let picture;
  if (mode === 'wall') {
    const target = num / den;
    picture = (
      <>
        {Array.from({ length: 8 }, (_, r) => {
          const d = r + 1;
          const y = 18 + r * 41;
          const match = Number.isInteger(target * d);
          const n = Math.round(target * d);
          return (
            <g key={d} style={{ animation: 'frFadeIn 400ms ease both', animationDelay: `${r * 70}ms` }}>
              <Bar x={40} y={y} w={440} h={34} den={d} num={match ? n : 0} color={WALL_COLORS[r]} delayStep={30} />
              <text x="498" y={y + 24} fill={match ? WALL_COLORS[r] : '#475569'} fontSize="16" fontWeight="900" fontFamily="monospace">{match ? `${n}/${d} ✔` : `1/${d}`}</text>
            </g>
          );
        })}
        <line x1={40 + target * 440} y1="10" x2={40 + target * 440} y2="350" stroke={INK} strokeWidth="2" strokeDasharray="6 5" style={{ transition: 'all 600ms ease' }} />
      </>
    );
  } else {
    const t = ease(seg(p, 0.15, 0.8));
    picture = (
      <>
        <Bar x={50} y={60} w={420} h={70} den={den} num={num} color={AMBER} />
        <Frac x={530} y={95} n={num} d={den} color={AMBER} size={28} />
        {/* the same bar, every part split into k smaller parts */}
        <rect x="50" y="200" width="420" height="70" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        {Array.from({ length: den * k }, (_, i) => (
          <rect key={`${den}-${k}-${i}`} x={50 + (i * 420) / (den * k) + 1.5} y="201.5" width={Math.max(0, 420 / (den * k) - 3)} height="67" rx="3" fill={GREEN} opacity={i < num * k ? 0.8 : 0} />
        ))}
        {Array.from({ length: den * k - 1 }, (_, i) => {
          const major = (i + 1) % k === 0;
          return <line key={`s${den}-${k}-${i}`} x1={50 + ((i + 1) * 420) / (den * k)} y1={major ? 200 : lerp(235, 200, t)} x2={50 + ((i + 1) * 420) / (den * k)} y2={major ? 270 : lerp(235, 270, t)} stroke={INK} strokeWidth={major ? 2.5 : 1.5} opacity={major ? 1 : t} />;
        })}
        <Frac x={530} y={235} n={num * k} d={den * k} color={GREEN} size={28} />
        <text x="300" y="168" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">↓ cut every part into {k} ↓</text>
        <text x="300" y="320" textAnchor="middle" fill={INK} fontSize="20" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.7, 1)}>
          {num}/{den} = ({num} × {k})/({den} × {k}) = {num * k}/{den * k}
        </text>
        {g > 1 && <text x="300" y="348" textAnchor="middle" fill={SKY} fontSize="14" fontWeight="800" fontFamily="sans-serif">Simplest form: {num}/{den} = {num / g}/{den / g} (divide both by {g})</text>}
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Fraction wall"
      title={mode === 'wall' ? `Which rows match ${num}/${den}?` : 'Same amount, more pieces'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'wall', label: 'Fraction wall' }, { value: 'equiv', label: 'Make equivalent fractions' }]} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="Numerator" value={num} min={0} max={den} onChange={(v) => update({ num: v })} />
            <Slider label="Denominator" value={den} min={1} max={8} onChange={(v) => update({ den: v, num: Math.min(num, v) })} tone="text-sky-300" />
            {mode === 'equiv' && <Slider label="Cut each part into" value={k} min={1} max={6} onChange={(v) => update({ k: v })} tone="text-emerald-300" />}
          </div>
          {task && <TaskBanner text={`Your turn: write ${task.base[0]}/${task.base[1]} as an equivalent fraction with denominator ${task.den}.`} done={done} />}
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

// ─── WIDGET 4: Comparing fractions (Makar Sankranti kite strings) ───
function cmp(a, b) {
  const l = a[0] * b[1];
  const r = b[0] * a[1];
  return l > r ? '>' : l < r ? '<' : '=';
}

export function Class6FractionCompareWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'bars', a: [3, 4], b: [2, 3], task: null }, visual);
  const mode = s.mode === 'common' ? 'common' : 'bars';
  const a = [clamp(Math.round(Number(s.a?.[0])) || 0, 0, 12), int(s.a?.[1], 1, 12, 4)];
  const b = [clamp(Math.round(Number(s.b?.[0])) || 0, 0, 12), int(s.b?.[1], 1, 12, 3)];
  a[0] = Math.min(a[0], a[1]);
  b[0] = Math.min(b[0], b[1]);
  const L = lcm(a[1], b[1]);
  const wa = useTween((a[0] / a[1]) * 420, 800);
  const wb = useTween((b[0] / b[1]) * 420, 800);
  const p = useReplay(`${mode}-${a.join('/')}-${b.join('/')}`, 1600);
  const sign = cmp(a, b);
  const task = s.task || null;
  const done = task === 'equal' ? sign === '=' && a[1] !== b[1] : task === 'beat' ? sign === '<' : false;
  useDone(done, onInteract);
  const set = (key, i, v) => {
    const f = key === 'a' ? [...a] : [...b];
    f[i] = v;
    if (i === 1) f[0] = Math.min(f[0], v);
    update({ [key]: f });
  };

  const kite = (x, y, c) => (
    <g>
      <polygon points={`${x},${y - 22} ${x + 18},${y} ${x},${y + 26} ${x - 18},${y}`} fill={c} stroke="#0f172a" strokeWidth="2" />
      <line x1={x} y1={y - 22} x2={x} y2={y + 26} stroke="#0f172a" strokeWidth="1.5" />
      <line x1={x - 18} y1={y} x2={x + 18} y2={y} stroke="#0f172a" strokeWidth="1.5" />
    </g>
  );

  return (
    <StoryStage
      eyebrow="Visualizer · Comparing fractions"
      title={`${a[0]}/${a[1]} ${sign} ${b[0]}/${b[1]}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'bars', label: 'Compare the strings' }, { value: 'common', label: 'Same-size pieces (common denominator)' }]} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Slider label="Disha: numerator" value={a[0]} min={0} max={a[1]} onChange={(v) => set('a', 0, v)} tone="text-pink-300" />
            <Slider label="Disha: denominator" value={a[1]} min={1} max={12} onChange={(v) => set('a', 1, v)} tone="text-pink-300" />
            <Slider label="Harsh: numerator" value={b[0]} min={0} max={b[1]} onChange={(v) => set('b', 0, v)} tone="text-sky-300" />
            <Slider label="Harsh: denominator" value={b[1]} min={1} max={12} onChange={(v) => set('b', 1, v)} tone="text-sky-300" />
          </div>
          {task === 'equal' && <TaskBanner text="Your turn: give Harsh a fraction with a DIFFERENT denominator that is exactly equal to Disha's." done={done} />}
          {task === 'beat' && <TaskBanner text="Your turn: make Harsh's string longer than Disha's." done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'bars' ? (
          <>
            <text x="40" y="44" fill={PINK} fontSize="16" fontWeight="900" fontFamily="sans-serif">Disha's kite string</text>
            <Bar x={40} y={58} w={420} h={44} den={a[1]} num={a[0]} color={PINK} />
            <line x1="40" y1="128" x2={40 + wa} y2="128" stroke={PINK} strokeWidth="3" />
            {kite(40 + wa, 128, PINK)}
            <text x="40" y="200" fill={SKY} fontSize="16" fontWeight="900" fontFamily="sans-serif">Harsh's kite string</text>
            <Bar x={40} y={214} w={420} h={44} den={b[1]} num={b[0]} color={SKY} />
            <line x1="40" y1="284" x2={40 + wb} y2="284" stroke={SKY} strokeWidth="3" />
            {kite(40 + wb, 284, SKY)}
            <Frac x={530} y={86} n={a[0]} d={a[1]} color={PINK} size={26} />
            <text x="530" y="178" textAnchor="middle" fill={sign === '=' ? GREEN : AMBER} fontSize="44" fontWeight="900" fontFamily="monospace">{sign}</text>
            <Frac x={530} y={242} n={b[0]} d={b[1]} color={SKY} size={26} />
            <text x="300" y="340" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">
              {a[1] === b[1] ? 'Same denominator: more pieces means bigger.' : a[0] === b[0] ? 'Same numerator: bigger pieces (smaller denominator) means bigger.' : 'Different pieces: cut both into the same size to compare.'}
            </text>
          </>
        ) : (
          <>
            <text x="300" y="34" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">Cut both into {L}ths (LCM of {a[1]} and {b[1]} is {L})</text>
            <Bar x={40} y={56} w={420} h={46} den={a[1]} num={a[0]} color={PINK} splitOpacity={1 - seg(p, 0.2, 0.6)} />
            <g opacity={seg(p, 0.2, 0.6)}>
              {Array.from({ length: L - 1 }, (_, i) => <line key={`a${L}-${i}`} x1={40 + ((i + 1) * 420) / L} y1="56" x2={40 + ((i + 1) * 420) / L} y2="102" stroke={INK} strokeWidth="1.5" />)}
            </g>
            <Bar x={40} y={170} w={420} h={46} den={b[1]} num={b[0]} color={SKY} splitOpacity={1 - seg(p, 0.2, 0.6)} />
            <g opacity={seg(p, 0.2, 0.6)}>
              {Array.from({ length: L - 1 }, (_, i) => <line key={`b${L}-${i}`} x1={40 + ((i + 1) * 420) / L} y1="170" x2={40 + ((i + 1) * 420) / L} y2="216" stroke={INK} strokeWidth="1.5" />)}
            </g>
            <g opacity={seg(p, 0.55, 0.9)}>
              <Frac x={530} y={78} n={(a[0] * L) / a[1]} d={L} color={PINK} size={24} />
              <Frac x={530} y={192} n={(b[0] * L) / b[1]} d={L} color={SKY} size={24} />
              <text x="300" y="282" textAnchor="middle" fill={INK} fontSize="20" fontWeight="900" fontFamily="monospace">
                {a[0]}/{a[1]} = {(a[0] * L) / a[1]}/{L}   and   {b[0]}/{b[1]} = {(b[0] * L) / b[1]}/{L}
              </text>
              <text x="300" y="322" textAnchor="middle" fill={sign === '=' ? GREEN : AMBER} fontSize="22" fontWeight="900" fontFamily="monospace">
                {(a[0] * L) / a[1]} {sign} {(b[0] * L) / b[1]}, so {a[0]}/{a[1]} {sign} {b[0]}/{b[1]}
              </text>
            </g>
          </>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Adding and subtracting fractions (bakery cake pieces) ───
export function Class6FractionAddWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ op: 'add', a: [1, 4], b: [2, 4], task: null }, visual);
  const op = s.op === 'sub' ? 'sub' : 'add';
  const a = [clamp(Math.round(Number(s.a?.[0])) || 0, 0, 12), int(s.a?.[1], 1, 12, 4)];
  const b = [clamp(Math.round(Number(s.b?.[0])) || 0, 0, 12), int(s.b?.[1], 1, 12, 4)];
  a[0] = Math.min(a[0], a[1]);
  b[0] = Math.min(b[0], b[1]);
  const L = lcm(a[1], b[1]);
  const na = (a[0] * L) / a[1];
  const nb = (b[0] * L) / b[1];
  const rn = op === 'add' ? na + nb : na - nb;
  const p = useReplay(`${op}-${a.join('/')}-${b.join('/')}`, 2600);
  const g = gcd(Math.abs(rn), L) || 1;
  const task = s.task && s.task.den ? s.task : null;
  const done = !!task && rn >= 0 && rn * task.den === task.num * L;
  useDone(done, onInteract);
  const set = (key, i, v) => {
    const f = key === 'a' ? [...a] : [...b];
    f[i] = v;
    if (i === 1) f[0] = Math.min(f[0], v);
    update({ [key]: f });
  };
  const sameDen = a[1] === b[1];
  const tSplit = sameDen ? 1 : ease(seg(p, 0.1, 0.4));
  const tMove = ease(seg(p, 0.45, 0.8));
  const pw = 420 / L;
  const sym = op === 'add' ? '+' : '−';
  const resultBars = Math.max(1, Math.ceil(Math.max(rn, 0) / L));

  return (
    <StoryStage
      eyebrow="Visualizer · Adding and subtracting fractions"
      title={`${a[0]}/${a[1]} ${sym} ${b[0]}/${b[1]}`}
      footer={
        <div className="space-y-3">
          <ModePills value={op} onChange={(v) => update({ op: v })} options={[{ value: 'add', label: 'Add (+)' }, { value: 'sub', label: 'Subtract (−)' }]} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Slider label="First: numerator" value={a[0]} min={0} max={a[1]} onChange={(v) => set('a', 0, v)} />
            <Slider label="First: denominator" value={a[1]} min={1} max={12} onChange={(v) => set('a', 1, v)} />
            <Slider label="Second: numerator" value={b[0]} min={0} max={b[1]} onChange={(v) => set('b', 0, v)} tone="text-sky-300" />
            <Slider label="Second: denominator" value={b[1]} min={1} max={12} onChange={(v) => set('b', 1, v)} tone="text-sky-300" />
          </div>
          {task && <TaskBanner text={`Your turn: make the answer exactly ${task.num}/${task.den}${task.num === task.den ? ' (one whole cake)' : ''}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="300" y="30" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">
          {sameDen ? `Same-size pieces (${L}ths): just ${op === 'add' ? 'add' : 'subtract'} the numerators.` : `Step 1: cut both into ${L}ths, the LCM of ${a[1]} and ${b[1]}.`}
        </text>
        {/* first fraction */}
        <Bar x={40} y={48} w={420} h={42} den={a[1]} num={a[0]} color={AMBER} splitOpacity={1 - tSplit} />
        {Array.from({ length: L - 1 }, (_, i) => <line key={`a${L}-${i}`} x1={40 + (i + 1) * pw} y1="48" x2={40 + (i + 1) * pw} y2="90" stroke={INK} strokeWidth="1.5" opacity={tSplit} />)}
        <text x="478" y="77" fill={AMBER} fontSize="18" fontWeight="900" fontFamily="monospace">{tSplit > 0.5 ? `${na}/${L}` : `${a[0]}/${a[1]}`}</text>
        {/* second fraction */}
        <Bar x={40} y={118} w={420} h={42} den={b[1]} num={b[0]} color={SKY} splitOpacity={1 - tSplit} />
        {Array.from({ length: L - 1 }, (_, i) => <line key={`b${L}-${i}`} x1={40 + (i + 1) * pw} y1="118" x2={40 + (i + 1) * pw} y2="160" stroke={INK} strokeWidth="1.5" opacity={tSplit} />)}
        <text x="478" y="147" fill={SKY} fontSize="18" fontWeight="900" fontFamily="monospace">{tSplit > 0.5 ? `${nb}/${L}` : `${b[0]}/${b[1]}`}</text>
        {/* result tray */}
        <text x="40" y="196" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily="sans-serif">{op === 'add' ? 'Put the pieces together' : 'Take the blue pieces away from the orange ones'}</text>
        {Array.from({ length: resultBars }, (_, r) => (
          <rect key={r} x={40} y={206 + r * 50} width="420" height="42" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        ))}
        {Array.from({ length: resultBars }, (_, r) => Array.from({ length: L - 1 }, (_, i) => (
          <line key={`r${L}-${r}-${i}`} x1={40 + (i + 1) * pw} y1={206 + r * 50} x2={40 + (i + 1) * pw} y2={248 + r * 50} stroke="#334155" strokeWidth="1" />
        )))}
        {op === 'add'
          ? Array.from({ length: na + nb }, (_, i) => {
            const fromA = i < na;
            const sx = 40 + (fromA ? i : i - na) * pw;
            const sy = fromA ? 48 : 118;
            const dx = 40 + (i % L) * pw;
            const dy = 206 + Math.floor(i / L) * 50;
            return <rect key={`p${L}-${i}`} x={lerp(sx, dx, tMove) + 1.5} y={lerp(sy, dy, tMove) + 1.5} width={pw - 3} height="39" rx="3" fill={fromA ? AMBER : SKY} opacity={tMove > 0 ? 0.85 : 0} />;
          })
          : Array.from({ length: na }, (_, i) => {
            const gone = i >= na - nb;
            return <rect key={`p${L}-${i}`} x={40 + i * pw + 1.5} y={lerp(48, 206, tMove) + 1.5} width={pw - 3} height="39" rx="3" fill={gone ? RED : AMBER} opacity={tMove > 0 ? (gone ? 0.85 * (1 - seg(p, 0.8, 1)) : 0.85) : 0} />;
          })}
        <g opacity={seg(p, 0.8, 1)}>
          {rn < 0 ? (
            <text x="300" y="340" textAnchor="middle" fill={RED} fontSize="17" fontWeight="900" fontFamily="sans-serif">Not enough cake: the first fraction is smaller than the second.</text>
          ) : (
            <text x="300" y={Math.min(340, 270 + resultBars * 50)} textAnchor="middle" fill={GREEN} fontSize="21" fontWeight="900" fontFamily="monospace">
              {na}/{L} {sym} {nb}/{L} = {rn}/{L}{g > 1 && rn > 0 ? ` = ${rn / g}/${L / g}` : ''}{rn > L && rn % L !== 0 ? ` = ${Math.floor(rn / L)} ${(rn % L) / gcd(rn % L, L)}/${L / gcd(rn % L, L)}` : ''}
            </text>
          )}
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Mixed numbers and how India wrote fractions ───
export function Class6MixedNumbersWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'convert', num: 7, den: 4, task: null }, visual);
  const mode = s.mode === 'history' ? 'history' : 'convert';
  const den = int(s.den, 2, 8, 4);
  const num = int(s.num, 1, den * 4, 7);
  const whole = Math.floor(num / den);
  const rem = num % den;
  const pizzas = Math.ceil(num / den);
  const p = useReplay(`${mode}-${num}-${den}`, mode === 'history' ? 3200 : 1200);
  const task = s.task && s.task.whole !== undefined ? s.task : null;
  const done = !!task && den === task.den && num === task.whole * task.den + task.num;
  useDone(done, onInteract);
  const r = pizzas <= 2 ? 92 : pizzas === 3 ? 74 : 60;
  const gap = W / (pizzas + 1);

  return (
    <StoryStage
      eyebrow={mode === 'history' ? 'Visualizer · Bhinna: the broken number' : 'Visualizer · Mixed numbers'}
      title={mode === 'history' ? 'How India wrote fractions' : `${num}/${den} = ${rem === 0 ? whole : whole === 0 ? `${rem}/${den}` : `${whole} ${rem}/${den}`}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'convert', label: 'Improper ⇄ mixed' }, { value: 'history', label: 'A pinch of history' }]} />
          {mode === 'convert' && (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label="Slices on the plate (numerator)" value={num} min={1} max={den * 4} onChange={(v) => update({ num: v })} />
                <Slider label="Slices in one pizza (denominator)" value={den} min={2} max={8} onChange={(v) => update({ den: v, num: Math.min(num, v * 4) })} tone="text-sky-300" />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Readout label="Whole pizzas" value={whole} tone="text-amber-300" />
                <Readout label="Slices left" value={`${rem}/${den}`} tone="text-sky-300" />
                <span className="text-sm text-slate-300">{num} ÷ {den} = {whole} remainder {rem}. Back again: {whole} × {den} + {rem} = {num}.</span>
              </div>
            </>
          )}
          {task && <TaskBanner text={`Your turn: show ${task.whole} ${task.num}/${task.den} as an improper fraction (set the slices).`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'convert' ? (
          <>
            {Array.from({ length: pizzas }, (_, i) => {
              const filled = Math.min(den, num - i * den);
              const t = ease(seg(p, i * 0.15, i * 0.15 + 0.5));
              return (
                <g key={`${den}-${i}`} transform={`translate(${gap * (i + 1)} ${lerp(200, 150, t)})`} opacity={t}>
                  <Pizza cx={0} cy={0} r={r} den={den} num={filled} color={filled === den ? AMBER : SKY} />
                  <text x="0" y={r + 34} textAnchor="middle" fill={filled === den ? AMBER : SKY} fontSize="17" fontWeight="900" fontFamily="monospace">{filled === den ? '1 whole' : `${filled}/${den}`}</text>
                </g>
              );
            })}
            <text x="300" y="342" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace" opacity={seg(p, 0.6, 1)}>
              {num}/{den} = {whole} whole{whole === 1 ? '' : 's'}{rem ? ` + ${rem}/${den}` : ''}
            </text>
          </>
        ) : (
          <>
            <text x="150" y="40" textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily="sans-serif">Brahmagupta, 628 CE</text>
            <text x="150" y="60" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">one number above the other</text>
            <g opacity={seg(p, 0.05, 0.25)}><Frac x={150} y={140} n={3} d={4} color={AMBER} size={54} bar={0} /></g>
            <text x="450" y="40" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif">Later: a line is added</text>
            <text x="450" y="60" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">(mathematicians of the Arab world)</text>
            <g opacity={seg(p, 0.35, 0.5)}><Frac x={450} y={140} n={3} d={4} color={GREEN} size={54} bar={ease(seg(p, 0.45, 0.75))} /></g>
            <g opacity={seg(p, 0.75, 1)}>
              <rect x="70" y="236" width="460" height="92" rx="16" fill="#0f172a" stroke="#334155" />
              <text x="300" y="270" textAnchor="middle" fill={INK} fontSize="20" fontWeight="900" fontFamily="sans-serif">Sanskrit word for fraction: bhinna</text>
              <text x="300" y="304" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="700" fontFamily="sans-serif">It means "broken": a whole broken into equal parts.</text>
            </g>
          </>
        )}
      </svg>
    </StoryStage>
  );
}
