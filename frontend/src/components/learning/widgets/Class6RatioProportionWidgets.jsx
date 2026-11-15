import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner,
  INK, AMBER, SKY, GREEN, RED,
} from '../engine/storyKit';

// Class 6 · Ratio and Proportion — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const int = (v, lo, hi, dflt) => clamp(Math.round(Number(v)) || dflt, lo, hi);
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const simp = (a, b) => {
  const g = gcd(a, b) || 1;
  return [a / g, b / g];
};
const fmt = (n) => (Number.isInteger(n) ? n.toLocaleString('en-IN') : (Math.round(n * 100) / 100).toLocaleString('en-IN'));
const FADE = '@keyframes rpFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';
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

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function Stepper({ label, value, min, max, onChange, tone = 'text-amber-300' }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className="w-6 font-bold">{label}</span>
      <button onClick={() => onChange(clamp(value - 1, min, max))} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold">−</button>
      <span className={`w-8 text-center font-mono font-bold text-base ${tone}`}>{value}</span>
      <button onClick={() => onChange(clamp(value + 1, min, max))} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold">+</button>
    </div>
  );
}

const T = ({ x, y, children, fill = INK, size = 16, weight = 800, anchor = 'middle', font = SANS, ...rest }) => (
  <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={weight} fontFamily={font} {...rest}>{children}</text>
);

// ─── WIDGET 1: Comparing two quantities, by difference and by division (and same units) ───
export function Class6RatioCompareWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    mode: 'compare', a: 48, b: 16, nameA: 'Harsh', nameB: 'Disha', unit: 'runs', show: 'diff',
    pairs: [[2, 4], [100, 102]], ua: 'km', ub: 'm', factor: 1000, step: 1, task: null,
  }, visual);
  const mode = ['compare', 'pairs', 'units'].includes(s.mode) ? s.mode : 'compare';
  const a = int(s.a, 1, 9999, 48);
  const b = int(s.b, 1, 9999, 16);
  const factor = int(s.factor, 1, 1000, 1);
  const step = mode === 'units' ? int(s.step, 0, 1, 1) : 1;
  const A = mode === 'units' && step === 1 ? a * factor : a; // value of A in the same unit as B
  const big = Math.max(A, b);
  const wa = useTween((A / big) * 340, 800);
  const wb = useTween((b / big) * 340, 800);
  const p = useReplay(`${mode}-${s.show}-${A}-${b}-${step}`, 1800);
  const [ra, rb] = simp(A, b);
  const task = s.task && s.task.p ? s.task : null;
  const done = !!task && ra === task.p && rb === task.q && (mode !== 'units' || step === 1);
  useDone(done, onInteract);
  const X0 = 130;
  const unitA = mode === 'units' ? (step === 1 ? s.ub : s.ua) : s.unit;
  const unitB = mode === 'units' ? s.ub : s.unit;

  let picture;
  if (mode === 'pairs') {
    const pairs = (Array.isArray(s.pairs) && s.pairs.length === 2 ? s.pairs : [[2, 4], [100, 102]]).map(([x, y]) => [int(x, 1, 999, 1), int(y, 1, 999, 2)]);
    picture = pairs.map(([x, y], k) => {
      const cx = 155 + k * 290;
      const m = Math.max(x, y);
      const hx = (x / m) * 190 * ease(seg(p, 0, 0.5));
      const hy = (y / m) * 190 * ease(seg(p, 0, 0.5));
      const [sx, sy] = simp(x, y);
      return (
        <g key={k}>
          <rect x={cx - 70} y={240 - hx} width="56" height={hx} rx="6" fill={AMBER} />
          <rect x={cx + 14} y={240 - hy} width="56" height={hy} rx="6" fill={SKY} />
          <T x={cx - 42} y={262} fill={AMBER} size={18} font={MONO}>{x}</T>
          <T x={cx + 42} y={262} fill={SKY} size={18} font={MONO}>{y}</T>
          <g opacity={seg(p, 0.45, 0.7)}>
            <T x={cx} y={296} fill={RED} size={16}>difference = {y - x}</T>
          </g>
          <g opacity={seg(p, 0.7, 1)}>
            <T x={cx} y={326} fill={GREEN} size={17} font={MONO}>ratio {x} : {y} = {sx} : {sy}</T>
          </g>
        </g>
      );
    });
    picture = (
      <>
        <line x1="300" y1="30" x2="300" y2="330" stroke="#334155" strokeWidth="2" strokeDasharray="5 5" />
        {picture}
      </>
    );
  } else {
    const showDiff = mode === 'compare' && s.show !== 'ratio';
    const showRatio = mode === 'units' || s.show !== 'diff';
    const small = Math.min(A, b);
    const smallW = Math.min(wa, wb);
    const fits = Math.floor(big / small);
    const copies = Math.min(fits, 12);
    const aIsBig = A >= b;
    const yBig = aIsBig ? 80 : 180;
    const ySmall = aIsBig ? 180 : 80;
    picture = (
      <>
        {mode === 'units' && step === 0 && (
          <T x={300} y={34} fill={RED} size={17}>Different units: {a} {s.ua} and {b} {s.ub}. Do not compare yet!</T>
        )}
        {mode === 'units' && step === 1 && (
          <T x={300} y={34} fill={GREEN} size={17}>First make the units the same: {a} {s.ua} = {fmt(a * factor)} {s.ub}</T>
        )}
        <T x={X0 - 12} y={112} anchor="end" fill={AMBER} size={17}>{s.nameA}</T>
        <T x={X0 - 12} y={212} anchor="end" fill={SKY} size={17}>{s.nameB}</T>
        <rect x={X0} y={80} width={Math.max(2, wa)} height="50" rx="6" fill={AMBER} opacity="0.9" />
        <rect x={X0} y={180} width={Math.max(2, wb)} height="50" rx="6" fill={SKY} opacity="0.9" />
        <T x={X0 + wa + 8} y={112} anchor="start" fill={AMBER} size={16} font={MONO}>{fmt(A)} {unitA}</T>
        <T x={X0 + wb + 8} y={212} anchor="start" fill={SKY} size={16} font={MONO}>{fmt(b)} {unitB}</T>
        {showDiff && A !== b && (
          <g opacity={seg(p, 0.1, 0.4)}>
            <line x1={X0 + smallW} y1={60} x2={X0 + smallW} y2={250} stroke={RED} strokeWidth="2" strokeDasharray="6 4" />
            <rect x={X0 + smallW} y={aIsBig ? 80 : 180} width={Math.abs(wa - wb)} height="50" fill="none" stroke={RED} strokeWidth="3" rx="4" />
            <T x={X0 + smallW + Math.abs(wa - wb) / 2} y={aIsBig ? 156 : 256} fill={RED} size={15}>{fmt(Math.abs(A - b))} more</T>
          </g>
        )}
        {showRatio && small > 0 && (mode !== 'units' || step === 1) && Array.from({ length: copies }, (_, i) => {
          const t = ease(seg(p, 0.3 + i * 0.12, 0.55 + i * 0.12));
          return (
            <rect key={`${A}-${b}-${i}`} x={X0 + lerp(0, i * smallW, t)} y={lerp(ySmall, yBig, t) + 6} width={Math.max(2, smallW - 2)} height="38" rx="4"
              fill="none" stroke={GREEN} strokeWidth="3" opacity={t > 0 ? 1 : 0} />
          );
        })}
        <g opacity={seg(p, 0.75, 1)}>
          {mode === 'units' && step === 0 ? (
            <T x={300} y={300} fill={RED} size={20} font={MONO}>{a} : {b} ✘ (units differ)</T>
          ) : showRatio ? (
            <>
              <T x={300} y={296} fill={GREEN} size={20} font={MONO}>{fmt(A)} : {fmt(b)} = {ra} : {rb}</T>
              <T x={300} y={326} fill="#94a3b8" size={14}>
                {Number.isInteger(big / small) ? `${fmt(big)} is ${fmt(big / small)} times ${fmt(small)}` : `divide both by their HCF ${gcd(A, b)}`}
              </T>
            </>
          ) : (
            <T x={300} y={300} fill={RED} size={20} font={MONO}>{fmt(Math.max(A, b))} − {fmt(small)} = {fmt(Math.abs(A - b))}</T>
          )}
        </g>
      </>
    );
  }

  const title = mode === 'pairs' ? 'Same difference, very different story' : mode === 'units' ? 'Same units first' : s.show === 'diff' ? 'Compare by difference' : 'Compare by division: the ratio';
  return (
    <StoryStage
      eyebrow="Visualizer · Comparing quantities"
      title={title}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, show: 'both' })} options={[{ value: 'compare', label: 'Two quantities' }, { value: 'pairs', label: 'Two pairs' }, { value: 'units', label: 'Mixed units' }]} />
          {mode === 'compare' && (
            <>
              <ModePills value={s.show} onChange={(v) => update({ show: v })} options={[{ value: 'diff', label: 'Difference' }, { value: 'ratio', label: 'Ratio' }, { value: 'both', label: 'Both' }]} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Slider label={s.nameA} value={a} min={1} max={60} onChange={(v) => update({ a: v })} />
                <Slider label={s.nameB} value={b} min={1} max={60} onChange={(v) => update({ b: v })} tone="text-sky-300" />
              </div>
            </>
          )}
          {mode === 'units' && (
            <div className="grid sm:grid-cols-2 gap-3 items-end">
              <Slider label={`${s.nameB} (${s.ub})`} value={b} min={factor >= 100 ? 50 : 1} max={factor >= 100 ? 5000 : 240} step={factor >= 100 ? 50 : 1} onChange={(v) => update({ b: v })} tone="text-sky-300" />
              <ModePills value={step} onChange={(v) => update({ step: v })} options={[{ value: 0, label: 'Mixed units' }, { value: 1, label: 'Convert first' }]} />
            </div>
          )}
          {mode !== 'pairs' && (
            <div className="flex flex-wrap gap-2">
              <Readout label="Difference" value={fmt(Math.abs(A - b))} tone="text-rose-300" />
              <Readout label="Ratio (simplest)" value={`${ra} : ${rb}`} tone="text-emerald-300" />
            </div>
          )}
          {task && <TaskBanner text={task.text || `Your turn: make the ratio ${task.p} : ${task.q}.`} done={done} />}
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

// ─── WIDGET 2: Equivalent ratios — Holi colour mixing (same ratio, same shade) ───
const mixColor = (p, q) => {
  const t = q / (p + q); // share of white
  const c = [lerp(225, 253, t), lerp(29, 242, t), lerp(72, 248, t)];
  return `rgb(${c.map(Math.round).join(',')})`;
};

function Jar({ x, y, w, h, level, color, label }) {
  const lh = h * level;
  return (
    <g>
      <rect x={x} y={y + h - lh} width={w} height={lh} rx="8" fill={color} style={{ transition: 'fill 700ms ease' }} />
      <path d={`M ${x} ${y} L ${x} ${y + h - 10} Q ${x} ${y + h} ${x + 10} ${y + h} L ${x + w - 10} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - 10} L ${x + w} ${y}`} fill="none" stroke={INK} strokeWidth="3" />
      <rect x={x - 6} y={y - 8} width={w + 12} height="10" rx="4" fill="#475569" />
      {label && <T x={x + w / 2} y={y + h + 24} fill={INK} size={15} font={MONO}>{label}</T>}
    </g>
  );
}

export function Class6RatioMixWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ p: 2, q: 3, k: 1, cmp: null, task: null }, visual);
  const p = int(s.p, 1, 6, 2);
  const q = int(s.q, 1, 6, 3);
  const k = int(s.k, 1, 6, 1);
  const red = p * k;
  const white = q * k;
  const [sp, sq] = simp(red, white);
  const lvl = useTween(Math.min(1, (red + white) / 36), 900);
  const task = s.task && s.task.red ? s.task : null;
  const done = !!task && red === task.red && white === task.white;
  useDone(done, onInteract);
  const cmp = s.cmp && s.cmp.p ? [int(s.cmp.p, 1, 12, 3), int(s.cmp.q, 1, 12, 4)] : null;
  const colW = 40;
  const r = 9;
  const gap = 20;
  const x0 = 30;
  const rows = p + q;
  const top = Math.max(50, 190 - (rows * gap) / 2);

  return (
    <StoryStage
      eyebrow="Visualizer · Equivalent ratios"
      title={`Red : White = ${red} : ${white}`}
      accent="text-pink-400"
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="Red spoons in one batch" value={p} min={1} max={6} onChange={(v) => update({ p: v })} tone="text-rose-300" />
            <Slider label="White spoons in one batch" value={q} min={1} max={6} onChange={(v) => update({ q: v })} tone="text-slate-200" />
            <Slider label="Number of batches" value={k} min={1} max={6} onChange={(v) => update({ k: v })} tone="text-emerald-300" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Readout label="Total red" value={red} tone="text-rose-300" />
            <Readout label="Total white" value={white} tone="text-slate-200" />
            <Readout label="Simplest form" value={`${sp} : ${sq}`} tone="text-emerald-300" />
          </div>
          {task && <TaskBanner text={`Your turn: mix the same pink using exactly ${task.red} red and ${task.white} white spoons.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <T x={x0} y={30} anchor="start" fill="#94a3b8" size={14}>{k} batch{k > 1 ? 'es' : ''} of {p} red and {q} white</T>
        {Array.from({ length: k }, (_, b) => {
          const bx = x0 + b * (colW + 8);
          return (
            <g key={`${p}-${q}-${b}`} style={{ animation: 'rpFadeIn 450ms ease both', animationDelay: `${b * 160}ms` }}>
              <rect x={bx} y={top - 14} width={colW} height={rows * gap + 8} rx="10" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />
              {Array.from({ length: rows }, (_, i) => (
                <circle key={i} cx={bx + colW / 2} cy={top + i * gap} r={r} fill={i < p ? '#e11d48' : '#f8fafc'} stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </g>
          );
        })}
        <T x={x0} y={top + rows * gap + 22} anchor="start" fill={INK} size={16} font={MONO}>
          {p} × {k} : {q} × {k} = {red} : {white}
        </T>
        {cmp ? (
          <>
            <Jar x={350} y={70} w={90} h={190} level={lvl} color={mixColor(red, white)} label={`${red} : ${white}`} />
            <Jar x={480} y={70} w={90} h={190} level={Math.min(1, (cmp[0] + cmp[1]) / 36)} color={mixColor(cmp[0], cmp[1])} label={`${cmp[0]} : ${cmp[1]}`} />
            <T x={460} y={335} fill={simp(cmp[0], cmp[1]).join() === `${sp},${sq}` ? GREEN : RED} size={15}>
              {simp(cmp[0], cmp[1]).join() === `${sp},${sq}` ? 'Same ratio, same shade ✔' : 'Different ratio, different shade ✘'}
            </T>
          </>
        ) : (
          <>
            <Jar x={410} y={70} w={120} h={190} level={lvl} color={mixColor(red, white)} label={`${red} : ${white} = ${sp} : ${sq}`} />
            <T x={470} y={335} fill="#94a3b8" size={14}>More batches, same shade of pink</T>
          </>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Dividing a quantity in a given ratio ───
export function Class6RatioShareWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ total: 60, p: 3, q: 2, step: 3, nameA: 'Disha', nameB: 'Harsh', unit: '₹', task: null }, visual);
  const total = int(s.total, 2, 1000, 60);
  const p = int(s.p, 1, 9, 3);
  const q = int(s.q, 1, 9, 2);
  const step = int(s.step, 0, 3, 3);
  const n = p + q;
  const part = total / n;
  const amtA = part * p;
  const amtB = part * q;
  const sep = useTween(step >= 2 ? 1 : 0, 900);
  const anim = useReplay(`${p}-${q}-${step}`, 900);
  const task = s.task && s.task.a ? s.task : null;
  const done = !!task && total === task.total && amtA === task.a;
  useDone(done, onInteract);
  const X = 40;
  const BW = 520;
  const sw = BW / n;
  const money = (v) => (s.unit === '₹' ? `₹${fmt(v)}` : `${fmt(v)} ${s.unit}`);

  return (
    <StoryStage
      eyebrow="Visualizer · Dividing in a ratio"
      title={`Share ${money(total)} in the ratio ${p} : ${q}`}
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="Total" value={total} min={5} max={1000} step={5} onChange={(v) => update({ total: v })} tone="text-emerald-300" />
            <Slider label={`${s.nameA}'s parts`} value={p} min={1} max={9} onChange={(v) => update({ p: v, step: 3 })} />
            <Slider label={`${s.nameB}'s parts`} value={q} min={1} max={9} onChange={(v) => update({ q: v, step: 3 })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ModePills value={step} onChange={(v) => update({ step: v })} options={[{ value: 0, label: 'Whole' }, { value: 1, label: 'Cut into parts' }, { value: 2, label: 'Hand out' }, { value: 3, label: 'Check' }]} />
            <Readout label={s.nameA} value={money(amtA)} tone="text-amber-300" />
            <Readout label={s.nameB} value={money(amtB)} tone="text-sky-300" />
          </div>
          {task && <TaskBanner text={task.text || `Your turn: share ${money(task.total)} so that ${s.nameA} gets ${money(task.a)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <T x={300} y={40} fill="#94a3b8" size={15}>
          {step === 0 ? `The whole: ${money(total)}` : `${p} + ${q} = ${n} equal parts, each ${money(total)} ÷ ${n} = ${money(part)}`}
        </T>
        {Array.from({ length: n }, (_, i) => {
          const isA = i < p;
          const dx = (isA ? -14 : 14) * sep;
          const y = lerp(80, 170, sep);
          const cutT = step >= 1 ? 1 : 0;
          return (
            <g key={`${n}-${i}`} transform={`translate(${dx} ${y - 80})`}>
              <rect x={X + i * sw + 1.5 * cutT} y={80} width={sw - 3 * cutT} height="70" rx={cutT ? 6 : 0}
                fill={step >= 2 ? (isA ? AMBER : SKY) : GREEN} opacity={step >= 2 ? 0.85 : 0.75} style={{ transition: 'fill 500ms ease' }} />
              {step >= 1 && sw >= 44 && (
                <T x={X + i * sw + sw / 2} y={121} fill="#0f172a" size={sw >= 60 ? 16 : 12} font={MONO} opacity={seg(anim, 0.2 + i * 0.04, 0.5 + i * 0.04)}>{money(part)}</T>
              )}
            </g>
          );
        })}
        {step === 0 && <T x={300} y={124} fill="#0f172a" size={26} font={MONO}>{money(total)}</T>}
        <g opacity={sep}>
          <T x={X + (p * sw) / 2 - 14} y={278} fill={AMBER} size={17}>{s.nameA}: {p} part{p > 1 ? 's' : ''}</T>
          <T x={X + p * sw + (q * sw) / 2 + 14} y={278} fill={SKY} size={17}>{s.nameB}: {q} part{q > 1 ? 's' : ''}</T>
          <T x={X + (p * sw) / 2 - 14} y={302} fill={AMBER} size={18} font={MONO}>{money(amtA)}</T>
          <T x={X + p * sw + (q * sw) / 2 + 14} y={302} fill={SKY} size={18} font={MONO}>{money(amtB)}</T>
        </g>
        {step === 3 && (
          <T x={300} y={340} fill={GREEN} size={15} font={MONO} opacity={seg(anim, 0.3, 1)}>
            {p}/{n} × {fmt(total)} = {fmt(amtA)}, {q}/{n} × {fmt(total)} = {fmt(amtB)}, total {fmt(amtA + amtB)} ✔
          </T>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Proportion — a : b :: c : d, extremes and means ───
export function Class6ProportionWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 2, b: 3, c: 4, d: 6, show: 'both', hideD: false, task: null }, visual);
  const a = int(s.a, 1, 99, 2);
  const b = int(s.b, 1, 99, 3);
  const c = int(s.c, 1, 99, 4);
  const d = int(s.d, 1, 99, 6);
  const show = ['simplify', 'cross', 'both', 'none'].includes(s.show) ? s.show : 'both';
  const task = s.task && s.task.a ? s.task : null;
  const hideD = !!s.hideD && !task;
  const p = useReplay(`${a}-${b}-${c}-${d}-${show}-${hideD}`, 1800);
  const [sa, sb] = simp(a, b);
  const [sc, sd] = simp(c, d);
  const equal = a * d === b * c;
  const done = !!task && a === task.a && b === task.b && c === task.c && equal;
  useDone(done, onInteract);
  const xs = [90, 200, 400, 510];
  const vals = [a, b, c, hideD ? '?' : d];
  const cols = [AMBER, SKY, SKY, AMBER];
  const arc = (x1, x2, y, up) => `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + (up ? -120 : 120)} ${x2} ${y}`;
  const len = 520;

  return (
    <StoryStage
      eyebrow="Visualizer · Proportion"
      title={hideD ? `${a} : ${b} :: ${c} : ?` : `Is ${a} : ${b} :: ${c} : ${d}?`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <Stepper label="a" value={a} min={1} max={99} onChange={(v) => update({ a: v })} />
            <Stepper label="b" value={b} min={1} max={99} onChange={(v) => update({ b: v })} tone="text-sky-300" />
            <Stepper label="c" value={c} min={1} max={99} onChange={(v) => update({ c: v })} tone="text-sky-300" />
            <Stepper label="d" value={d} min={1} max={99} onChange={(v) => update({ d: v, hideD: false })} />
          </div>
          <ModePills value={show} onChange={(v) => update({ show: v })} options={[{ value: 'simplify', label: 'Simplest forms' }, { value: 'cross', label: 'Extremes and means' }, { value: 'both', label: 'Both' }]} />
          {task && <TaskBanner text={`Your turn: find d so that ${task.a} : ${task.b} :: ${task.c} : d.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {(show === 'cross' || show === 'both') && (
          <>
            <path d={arc(xs[0], xs[3], 105, true)} fill="none" stroke={AMBER} strokeWidth="3" strokeDasharray={len} strokeDashoffset={len * (1 - seg(p, 0, 0.4))} />
            <T x={300} y={36} fill={AMBER} size={14}>extremes (outside terms)</T>
            <path d={arc(xs[1], xs[2], 175, false)} fill="none" stroke={SKY} strokeWidth="3" strokeDasharray={len} strokeDashoffset={len * (1 - seg(p, 0.1, 0.5))} />
            <T x={300} y={252} fill={SKY} size={14}>means (middle terms)</T>
          </>
        )}
        {vals.map((v, i) => (
          <g key={i}>
            <rect x={xs[i] - 40} y={110} width="80" height="60" rx="12" fill="#0f172a" stroke={cols[i]} strokeWidth="3" />
            <T x={xs[i]} y={152} fill={v === '?' ? RED : cols[i]} size={30} font={MONO} weight={900}>{v}</T>
          </g>
        ))}
        <T x={145} y={152} fill={INK} size={30} font={MONO} weight={900}>:</T>
        <T x={455} y={152} fill={INK} size={30} font={MONO} weight={900}>:</T>
        <T x={300} y={152} fill={GREEN} size={30} font={MONO} weight={900}>::</T>
        {(show === 'simplify' || show === 'both') && !hideD && (
          <g opacity={seg(p, 0.4, 0.7)}>
            <T x={145} y={205} fill="#94a3b8" size={16} font={MONO}>= {sa} : {sb}</T>
            <T x={455} y={205} fill="#94a3b8" size={16} font={MONO}>= {sc} : {sd}</T>
          </g>
        )}
        {(show === 'cross' || show === 'both') && !hideD && (
          <g opacity={seg(p, 0.6, 0.85)}>
            <T x={300} y={290} fill={INK} size={17} font={MONO}>extremes {a} × {d} = {a * d}   means {b} × {c} = {b * c}</T>
          </g>
        )}
        {hideD && (
          <T x={300} y={300} fill={INK} size={17} font={MONO} opacity={seg(p, 0.5, 0.9)}>{a} × ? = {b} × {c} = {b * c}, so ? = {b * c} ÷ {a}</T>
        )}
        {!hideD && show !== 'none' && (
          <T x={300} y={330} fill={equal ? GREEN : RED} size={18} opacity={seg(p, 0.8, 1)}>
            {equal ? 'Equal ratios: they are in proportion ✔' : 'Not equal: not in proportion ✘'}
          </T>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: The unitary method — find one, then find many ───
function Item({ x, y, kind, color = AMBER, s = 1 }) {
  if (kind === 'laddoo') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle r="15" fill={color} stroke="#78350f" strokeWidth="1.5" />
        <circle cx="-5" cy="-5" r="4" fill="#fef3c7" opacity="0.6" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-16" y="-20" width="32" height="40" rx="4" fill={color} stroke="#0f172a" strokeWidth="1.5" />
      <rect x="-11" y="-13" width="22" height="9" rx="2" fill="#0f172a" opacity="0.5" />
      <line x1="-11" y1="4" x2="11" y2="4" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="-11" y1="11" x2="6" y2="11" stroke="#0f172a" strokeWidth="2" />
    </g>
  );
}

export function Class6UnitaryWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ n: 4, cost: 600, m: 7, step: 2, item: 'ticket', label: 'tickets', unit: '₹', task: null }, visual);
  const n = int(s.n, 1, 10, 4);
  const cost = int(s.cost, 1, 100000, 600);
  const m = int(s.m, 1, 12, 7);
  const step = int(s.step, 0, 2, 2);
  const unitVal = cost / n;
  const kind = s.item === 'laddoo' ? 'laddoo' : 'ticket';
  const label = s.label || 'items';
  const one = label.endsWith('s') ? label.slice(0, -1) : label;
  const task = s.task && s.task.target ? s.task : null;
  const done = !!task && m * unitVal === task.target && step === 2;
  useDone(done, onInteract);
  const p = useReplay(`${n}-${cost}-${m}-${step}`, 1600);
  const money = (v) => (s.unit === '₹' ? `₹${fmt(v)}` : `${fmt(v)} ${s.unit}`);
  const drop = ease(seg(p, 0, 0.5));
  const gx = (count, i) => 300 + (i - (count - 1) / 2) * 44;

  return (
    <StoryStage
      eyebrow="Visualizer · Unitary method"
      title={step === 0 ? `${n} ${label} cost ${money(cost)}` : step === 1 ? `1 ${one} costs ${money(unitVal)}` : `${m} ${m === 1 ? one : label} cost${m === 1 ? "s" : ""} ${money(m * unitVal)}`}
      accent="text-emerald-400"
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={step} onChange={(v) => update({ step: v })} options={[{ value: 0, label: '1. What we know' }, { value: 1, label: '2. Find one' }, { value: 2, label: '3. Find many' }]} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label={`${label} we know`} value={n} min={1} max={10} onChange={(v) => update({ n: v })} tone="text-sky-300" />
            <Slider label="Their cost" value={cost} min={10} max={2000} step={10} onChange={(v) => update({ cost: v })} />
            <Slider label={`${label} we want`} value={m} min={1} max={12} onChange={(v) => update({ m: v, step: 2 })} tone="text-emerald-300" />
          </div>
          {task && <TaskBanner text={task.text || `Your turn: how many ${label} can you get for ${money(task.target)}? Set the number we want.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <T x={300} y={30} fill={SKY} size={16}>{n} {label} = {money(cost)}</T>
        {Array.from({ length: n }, (_, i) => (
          <Item key={`a${n}-${i}`} x={gx(n, i)} y={70} kind={kind} color={i === 0 && step >= 1 ? GREEN : SKY} />
        ))}
        {step >= 1 && (
          <g>
            <line x1={gx(n, 0)} y1={95} x2={300} y2={lerp(95, 150, drop)} stroke={GREEN} strokeWidth="2" strokeDasharray="4 4" />
            <Item x={lerp(gx(n, 0), 300, drop)} y={lerp(70, 170, drop)} kind={kind} color={GREEN} s={lerp(1, 1.4, drop)} />
            <T x={300} y={222} fill={GREEN} size={16} font={MONO} opacity={seg(p, 0.4, 0.7)}>1 {one} = {money(cost)} ÷ {n} = {money(unitVal)}</T>
          </g>
        )}
        {step >= 2 && (
          <g>
            {Array.from({ length: m }, (_, i) => (
              <g key={`m${m}-${i}`} style={{ animation: 'rpFadeIn 350ms ease both', animationDelay: `${600 + i * 80}ms` }}>
                <Item x={gx(m, i)} y={270} kind={kind} color={AMBER} />
              </g>
            ))}
            <T x={300} y={330} fill={AMBER} size={18} font={MONO} opacity={seg(p, 0.7, 1)}>{m} {m === 1 ? one : label} = {m} × {money(unitVal)} = {money(m * unitVal)}</T>
          </g>
        )}
        {step === 0 && <T x={300} y={200} fill="#94a3b8" size={15}>Step 1: write what we know. Next, find the cost of ONE.</T>}
      </svg>
    </StoryStage>
  );
}
