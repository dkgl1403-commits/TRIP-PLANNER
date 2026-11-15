import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Decimals — scene-driven story widgets.
// All amounts are kept as whole numbers of tenths / hundredths / thousandths internally, so no floating-point errors.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const num = (v, lo, hi, dflt) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? clamp(n, lo, hi) : dflt;
};
// Formats an integer count of 1/10^dp units as a decimal string: fmt(275, 2) = "2.75"
const fmt = (units, dp) => {
  if (dp === 0) return String(units);
  const neg = units < 0;
  const s = String(Math.abs(units)).padStart(dp + 1, '0');
  return `${neg ? '-' : ''}${s.slice(0, -dp)}.${s.slice(-dp)}`;
};
const FADE = '@keyframes dcFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';
const T = { fontFamily: 'sans-serif', fontWeight: 800 };
const M = { fontFamily: 'monospace', fontWeight: 900 };

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

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300', show }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{show ?? value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function Stepper({ label, value, onChange, tone = 'text-amber-300' }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange((value + 9) % 10)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold">−</button>
        <span className={`w-6 text-center font-mono font-black text-lg ${tone}`}>{value}</span>
        <button onClick={() => onChange((value + 1) % 10)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold">+</button>
      </div>
    </div>
  );
}

// ─── WIDGET 1: Tenths — a strip cut into 10 and Disha's ruler (1 mm = 0.1 cm) ───
export function Class6DecimalTenthsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'strip', t: 3, task: null }, visual);
  const mode = s.mode === 'ruler' ? 'ruler' : 'strip';
  const maxT = mode === 'ruler' ? 100 : 30;
  const t = num(s.t, 0, maxT, 3);
  const task = s.task && s.task.t !== undefined ? s.task : null;
  const done = !!task && t === task.t && (!task.mode || task.mode === mode);
  useDone(done, onInteract);
  const svgRef = useRef(null);
  const X0 = 40;
  const MM = 5.2; // pixels per mm on the ruler
  const tipX = useTween(X0 + t * MM, 700);
  const drag = useSvgDrag(svgRef, (x) => update({ t: clamp(Math.round((x - X0) / MM), 0, 100) }));
  const whole = Math.floor(t / 10);
  const tenth = t % 10;
  const bars = Math.max(1, Math.ceil(t / 10));

  return (
    <StoryStage
      eyebrow="Visualizer · Tenths"
      title={mode === 'ruler' ? `The pencil is ${fmt(t, 1)} cm long` : `${t} tenths = ${fmt(t, 1)}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, t: Math.min(t, m === 'ruler' ? 100 : 30) })} options={[{ value: 'strip', label: 'Strip of 10 parts' }, { value: 'ruler', label: 'Ruler (cm and mm)' }]} />
          <Slider label={mode === 'ruler' ? 'Length in millimetres' : 'Tenths shaded'} value={t} min={0} max={maxT} onChange={(v) => update({ t: v })} />
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Fraction" value={`${t}/10`} tone="text-sky-300" />
            <Readout label="Decimal" value={fmt(t, 1)} tone="text-amber-300" />
            <span className="text-sm text-slate-300">{whole} one{whole === 1 ? '' : 's'} and {tenth} tenth{tenth === 1 ? '' : 's'}{mode === 'ruler' ? '. Drag the pencil tip.' : ''}</span>
          </div>
          {task && <TaskBanner text={`Your turn: ${mode === 'ruler' ? 'make the pencil' : 'shade'} ${fmt(task.t, 1)}${mode === 'ruler' ? ' cm long' : ''}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'strip' ? (
          <>
            <text x="300" y="34" textAnchor="middle" fill="#94a3b8" fontSize="15" style={T}>Each whole strip is cut into 10 equal parts. One part is one tenth, 0.1</text>
            {Array.from({ length: Math.max(bars, 1) }, (_, b) => (
              <g key={b} style={{ animation: 'dcFadeIn 500ms ease both', animationDelay: `${b * 120}ms` }}>
                <rect x="60" y={60 + b * 74} width="440" height="52" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                {Array.from({ length: 10 }, (_, i) => (
                  <rect key={i} x={60 + i * 44 + 2} y={62 + b * 74} width="40" height="48" rx="4" fill={b === whole ? SKY : AMBER}
                    opacity={b * 10 + i < t ? 0.85 : 0} style={{ transition: `opacity 350ms ease ${i * 50}ms` }} />
                ))}
                {Array.from({ length: 9 }, (_, i) => <line key={i} x1={104 + i * 44} y1={60 + b * 74} x2={104 + i * 44} y2={112 + b * 74} stroke={INK} strokeWidth="1.5" />)}
                <text x="516" y={94 + b * 74} fill={b < whole ? AMBER : SKY} fontSize="18" style={M}>{b < whole ? '1 whole' : `${tenth}/10`}</text>
              </g>
            ))}
            <text x="300" y="320" textAnchor="middle" fill={GREEN} fontSize="26" style={M}>{t}/10 = {whole} + {tenth}/10 = {fmt(t, 1)}</text>
          </>
        ) : (
          <>
            <rect x="30" y="170" width="540" height="80" rx="8" fill="#fde68a" />
            {Array.from({ length: 101 }, (_, i) => {
              const x = X0 + i * MM;
              const cm = i % 10 === 0;
              const half = i % 5 === 0;
              return (
                <g key={i}>
                  <line x1={x} y1="170" x2={x} y2={cm ? 205 : half ? 195 : 186} stroke="#1c1917" strokeWidth={cm ? 2 : 1} />
                  {cm && <text x={x} y="226" textAnchor="middle" fill="#1c1917" fontSize="15" style={M}>{i / 10}</text>}
                </g>
              );
            })}
            <text x="562" y="244" textAnchor="end" fill="#78350f" fontSize="12" style={T}>cm</text>
            {/* the pencil */}
            <g>
              <rect x={X0} y="120" width={Math.max(0, tipX - X0 - 22)} height="26" fill={AMBER} />
              <rect x={X0} y="120" width="10" height="26" fill={PINK} />
              <polygon points={`${Math.max(X0, tipX - 22)},120 ${tipX},133 ${Math.max(X0, tipX - 22)},146`} fill="#fcd9a8" />
              <polygon points={`${tipX - 7},129 ${tipX},133 ${tipX - 7},137`} fill="#1c1917" />
            </g>
            <line x1={tipX} y1="112" x2={tipX} y2="172" stroke={SKY} strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={tipX} cy="104" r="11" fill={SKY} opacity="0.35" {...drag} style={{ cursor: 'grab' }} />
            {/* zoom: the last centimetre split into 10 mm */}
            <text x="300" y="44" textAnchor="middle" fill={INK} fontSize="22" style={M}>{whole} cm {tenth} mm = {whole} + {tenth}/10 cm = {fmt(t, 1)} cm</text>
            <text x="300" y="76" textAnchor="middle" fill="#94a3b8" fontSize="14" style={T}>1 cm has 10 equal millimetres, so 1 mm = 1/10 cm = 0.1 cm</text>
            <g style={{ animation: 'dcFadeIn 500ms ease both' }} key={whole}>
              <text x="300" y="282" textAnchor="middle" fill={SKY} fontSize="13" style={T}>Zoom into the cm from {whole} to {whole + 1}</text>
              {Array.from({ length: 10 }, (_, i) => (
                <rect key={i} x={150 + i * 30} y="292" width="28" height="30" rx="3" fill={i < tenth ? SKY : '#0f172a'} stroke="#334155" opacity={i < tenth ? 0.85 : 1} style={{ transition: `fill 300ms ease ${i * 40}ms` }} />
              ))}
              <text x="140" y="314" textAnchor="end" fill={INK} fontSize="15" style={M}>{whole}</text>
              <text x="460" y="314" fill={INK} fontSize="15" style={M}>{whole + 1}</text>
              <text x="300" y="346" textAnchor="middle" fill={SKY} fontSize="14" style={M}>{tenth} of 10 mm filled: 0.{tenth} cm</text>
            </g>
          </>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Hundredths — the 10 by 10 grid and rupees and paise ───
const COINS = [500, 200, 100, 50, 20, 10, 5, 2, 1]; // in paise: ₹5, ₹2, ₹1, 50p, plus small paise blocks

export function Class6DecimalGridWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'grid', h: 25, rupees: 0, task: null }, visual);
  const mode = s.mode === 'money' ? 'money' : 'grid';
  const h = num(s.h, 0, 100, 25);
  const rupees = num(s.rupees, 0, 5, 0);
  const task = s.task && s.task.h !== undefined ? s.task : null;
  const done = !!task && h === task.h && (task.rupees === undefined || rupees === task.rupees);
  useDone(done, onInteract);
  const tens = Math.floor(h / 10);
  const ones = h % 10;
  const total = rupees * 100 + h;
  const C = 25; // cell size
  const gx = mode === 'grid' ? 40 : 300;
  const gy = 50;

  // break the amount into ₹ coins / notes then small paise
  const coins = [];
  let left = total;
  COINS.forEach((c) => { while (left >= c && coins.length < 14) { coins.push(c); left -= c; } });

  return (
    <StoryStage
      eyebrow="Visualizer · Hundredths"
      title={mode === 'money' ? `₹${fmt(total, 2)} = ${total} paise` : `${h} hundredths = ${fmt(h, 2)}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'grid', label: '100 squares' }, { value: 'money', label: 'Rupees and paise' }]} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label={mode === 'money' ? 'Paise' : 'Hundredths shaded'} value={h} min={0} max={100} onChange={(v) => update({ h: v })} />
            {mode === 'money' && <Slider label="Whole rupees" value={rupees} min={0} max={5} onChange={(v) => update({ rupees: v })} tone="text-emerald-300" />}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Fraction" value={`${h}/100`} tone="text-sky-300" />
            <Readout label="Tenths" value={tens} tone="text-amber-300" />
            <Readout label="Hundredths" value={ones} tone="text-pink-300" />
            <Readout label="Decimal" value={mode === 'money' ? `₹${fmt(total, 2)}` : fmt(h, 2)} />
          </div>
          {task && <TaskBanner text={`Your turn: show ${task.rupees !== undefined ? `₹${fmt(task.rupees * 100 + task.h, 2)}` : fmt(task.h, 2)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x={gx + 125} y="36" textAnchor="middle" fill="#94a3b8" fontSize="13" style={T}>{mode === 'money' ? '₹1 = 100 paise' : '1 whole = 100 small squares'}</text>
        {Array.from({ length: 100 }, (_, i) => {
          const col = Math.floor(i / 10);
          const row = i % 10;
          const on = i < h;
          const fullCol = col < tens;
          return (
            <rect key={i} x={gx + col * C + 1} y={gy + row * C + 1} width={C - 2} height={C - 2} rx="3"
              fill={on ? (fullCol ? AMBER : PINK) : '#0f172a'} stroke="#1e293b"
              style={{ transition: `fill 300ms ease ${(i % 10) * 25 + col * 30}ms` }} />
          );
        })}
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={gx + i * C} y1={gy} x2={gx + i * C} y2={gy + 250} stroke="#475569" strokeWidth={i % 10 === 0 ? 2.5 : 1.5} />)}
        <rect x={gx} y={gy} width="250" height="250" fill="none" stroke={INK} strokeWidth="2.5" />
        {mode === 'grid' ? (
          <g>
            <text x="440" y="90" textAnchor="middle" fill={AMBER} fontSize="17" style={T}>{tens} full column{tens === 1 ? '' : 's'}</text>
            <text x="440" y="112" textAnchor="middle" fill={AMBER} fontSize="15" style={T}>= {tens} tenth{tens === 1 ? '' : 's'}</text>
            <text x="440" y="150" textAnchor="middle" fill={PINK} fontSize="17" style={T}>{ones} more square{ones === 1 ? '' : 's'}</text>
            <text x="440" y="172" textAnchor="middle" fill={PINK} fontSize="15" style={T}>= {ones} hundredth{ones === 1 ? '' : 's'}</text>
            <text x="440" y="226" textAnchor="middle" fill={GREEN} fontSize="28" style={M}>{h}/100</text>
            <text x="440" y="266" textAnchor="middle" fill={GREEN} fontSize="34" style={M}>= {fmt(h, 2)}</text>
            <text x="300" y="336" textAnchor="middle" fill="#94a3b8" fontSize="14" style={T}>One column of 10 squares = 10/100 = 1/10. So 0.1 = 0.10</text>
          </g>
        ) : (
          <g>
            <text x="150" y="36" textAnchor="middle" fill="#94a3b8" fontSize="13" style={T}>Notes and coins</text>
            {coins.map((c, i) => {
              const x = 40 + (i % 4) * 62;
              const y = 80 + Math.floor(i / 4) * 64;
              const note = c >= 100;
              return (
                <g key={`${total}-${i}`} style={{ animation: 'dcFadeIn 400ms ease both', animationDelay: `${i * 70}ms` }}>
                  {note && c > 100
                    ? <rect x={x - 26} y={y - 18} width="52" height="36" rx="5" fill={c === 500 ? GREEN : SKY} opacity="0.85" />
                    : <circle cx={x} cy={y} r={c >= 50 ? 24 : c >= 10 ? 19 : 14} fill={c >= 100 ? AMBER : c >= 10 ? '#cbd5e1' : '#94a3b8'} stroke="#78350f" strokeWidth="1.5" />}
                  <text x={x} y={y + 5} textAnchor="middle" fill="#0f172a" fontSize={c >= 10 ? 13 : 11} style={M}>{c >= 100 ? `₹${c / 100}` : `${c}p`}</text>
                </g>
              );
            })}
            <text x="150" y="330" textAnchor="middle" fill={GREEN} fontSize="22" style={M}>{total} paise = ₹{fmt(total, 2)}</text>
            <text x="425" y="330" textAnchor="middle" fill={PINK} fontSize="14" style={T}>{h} paise = {fmt(h, 2)} of ₹1</text>
          </g>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Place value table, expanded form, and fractions to decimals ───
const COLS = [
  { key: 'T', name: 'Tens', val: '10', color: PURPLE },
  { key: 'O', name: 'Ones', val: '1', color: SKY },
  { key: 't', name: 'Tenths', val: '1/10', color: AMBER },
  { key: 'h', name: 'Hundredths', val: '1/100', color: PINK },
  { key: 'th', name: 'Thousandths', val: '1/1000', color: GREEN },
];

export function Class6DecimalPlaceValueWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'table', digits: [2, 3, 0, 7, 0], num: 3, den: 5, task: null }, visual);
  const mode = s.mode === 'fraction' ? 'fraction' : 'table';
  const digits = COLS.map((_, i) => num(s.digits?.[i], 0, 9, 0));
  const fn = num(s.num, 1, 99, 3);
  const fd = [2, 4, 5, 8, 10, 20, 25, 50, 100, 1000].includes(Number(s.den)) ? Number(s.den) : 5;
  const p = useReplay(`${mode}-${digits.join('')}-${fn}-${fd}`, 1600);
  const task = s.task && s.task.digits ? s.task : null;
  const done = !!task && mode === 'table' && task.digits.every((d, i) => d === digits[i]);
  useDone(done, onInteract);
  const setDigit = (i, v) => { const d = [...digits]; d[i] = v; update({ digits: d }); };
  const lastNZ = digits[4] ? 3 : digits[3] ? 2 : digits[2] ? 1 : 0;
  const intPart = digits[0] * 10 + digits[1];
  const decStr = `${intPart}${lastNZ ? '.' + digits.slice(2, 2 + lastNZ).join('') : ''}`;
  const terms = [];
  if (digits[0]) terms.push(`${digits[0]} × 10`);
  if (digits[1]) terms.push(`${digits[1]} × 1`);
  if (digits[2]) terms.push(`${digits[2]} × 1/10`);
  if (digits[3]) terms.push(`${digits[3]} × 1/100`);
  if (digits[4]) terms.push(`${digits[4]} × 1/1000`);

  // fraction mode: scale denominator to 10, 100 or 1000
  const target = 10 % fd === 0 ? 10 : 100 % fd === 0 ? 100 : 1000;
  const k = target / fd;
  const scaled = fn * k;
  const dp = target === 10 ? 1 : target === 100 ? 2 : 3;

  return (
    <StoryStage
      eyebrow="Visualizer · Place value"
      title={mode === 'table' ? `Reading ${decStr}` : `${fn}/${fd} as a decimal`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'table', label: 'Place value table' }, { value: 'fraction', label: 'Fraction to decimal' }]} />
          {mode === 'table' ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {COLS.map((c, i) => <Stepper key={c.key} label={c.name} value={digits[i]} onChange={(v) => setDigit(i, v)} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Numerator" value={fn} min={1} max={fd * 3} onChange={(v) => update({ num: v })} />
              <label className="block text-xs text-slate-400">Denominator
                <select value={fd} onChange={(e) => update({ den: +e.target.value, num: Math.min(fn, +e.target.value * 3) })} className="block mt-1 w-full bg-slate-800 text-slate-200 rounded-lg p-1.5 font-mono">
                  {[2, 4, 5, 8, 10, 20, 25, 50, 100].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
            </div>
          )}
          {task && <TaskBanner text={`Your turn: build ${task.label} in the place value table.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'table' ? (
          <>
            {COLS.map((c, i) => {
              const x = 40 + i * 106 + (i >= 2 ? 14 : 0);
              const show = i < 2 || i - 2 < lastNZ;
              return (
                <g key={c.key} style={{ animation: 'dcFadeIn 400ms ease both', animationDelay: `${i * 80}ms` }}>
                  <rect x={x} y="30" width="96" height="44" rx="8" fill={c.color} opacity="0.18" stroke={c.color} />
                  <text x={x + 48} y="50" textAnchor="middle" fill={c.color} fontSize="13" style={T}>{c.name}</text>
                  <text x={x + 48} y="67" textAnchor="middle" fill="#94a3b8" fontSize="12" style={M}>{c.val}</text>
                  <rect x={x} y="82" width="96" height="96" rx="10" fill="#0f172a" stroke="#334155" />
                  <text key={digits[i]} x={x + 48} y="152" textAnchor="middle" fill={show ? c.color : '#475569'} fontSize="62" style={{ ...M, animation: 'dcFadeIn 350ms ease both' }}>{digits[i]}</text>
                </g>
              );
            })}
            <circle cx="259" cy="162" r="7" fill={INK} />
            <text x="259" y="200" textAnchor="middle" fill="#94a3b8" fontSize="12" style={T}>decimal point</text>
            <g opacity={seg(p, 0.2, 0.6)}>
              <text x="300" y="248" textAnchor="middle" fill={INK} fontSize="34" style={M}>{decStr}</text>
            </g>
            <g opacity={seg(p, 0.5, 1)}>
              <text x="300" y="292" textAnchor="middle" fill={GREEN} fontSize={terms.length > 3 ? 16 : 19} style={M}>{terms.length ? `= ${terms.join(' + ')}` : '= 0'}</text>
              <text x="300" y="328" textAnchor="middle" fill="#94a3b8" fontSize="14" style={T}>Each place is 10 times the place on its right.</text>
            </g>
          </>
        ) : (
          <>
            <text x="300" y="40" textAnchor="middle" fill="#94a3b8" fontSize="15" style={T}>Make the denominator 10, 100 or 1000, then read the decimal.</text>
            <g opacity={seg(p, 0, 0.25)}>
              <text x="110" y="120" textAnchor="middle" fill={AMBER} fontSize="46" style={M}>{fn}</text>
              <line x1="70" y1="134" x2="150" y2="134" stroke={AMBER} strokeWidth="4" />
              <text x="110" y="180" textAnchor="middle" fill={AMBER} fontSize="46" style={M}>{fd}</text>
            </g>
            <g opacity={seg(p, 0.25, 0.5)}>
              <text x="210" y="106" textAnchor="middle" fill={SKY} fontSize="16" style={M}>× {k}</text>
              <text x="210" y="166" textAnchor="middle" fill={SKY} fontSize="16" style={M}>× {k}</text>
              <text x="210" y="140" textAnchor="middle" fill={INK} fontSize="30" style={M}>=</text>
            </g>
            <g opacity={seg(p, 0.45, 0.7)}>
              <text x="320" y="120" textAnchor="middle" fill={SKY} fontSize="46" style={M}>{scaled}</text>
              <line x1="250" y1="134" x2="390" y2="134" stroke={SKY} strokeWidth="4" />
              <text x="320" y="180" textAnchor="middle" fill={SKY} fontSize="46" style={M}>{target}</text>
            </g>
            <g opacity={seg(p, 0.7, 1)}>
              <text x="415" y="140" textAnchor="middle" fill={INK} fontSize="30" style={M}>=</text>
              <text x="505" y="152" textAnchor="middle" fill={GREEN} fontSize={dp === 3 ? 36 : 46} style={M}>{fmt(scaled, dp)}</text>
              <text x="300" y="250" textAnchor="middle" fill="#cbd5e1" fontSize="16" style={T}>{fd === target ? `The denominator is already ${target}.` : `${fd} × ${k} = ${target}, so multiply the numerator by ${k} too.`}</text>
              <text x="300" y="284" textAnchor="middle" fill="#94a3b8" fontSize="15" style={T}>{scaled} {target === 10 ? 'tenths' : target === 100 ? 'hundredths' : 'thousandths'}: the last digit sits {dp} place{dp === 1 ? '' : 's'} after the point.</text>
            </g>
          </>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Decimals on the number line (with a zoom lens) and comparing decimals ───
export function Class6DecimalLineWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'line', v: 135, zoom: false, a: 50, b: 45, task: null }, visual);
  const mode = s.mode === 'compare' ? 'compare' : 'line';
  const v = num(s.v, 0, 300, 135); // hundredths
  const a = num(s.a, 0, 9999, 50);
  const b = num(s.b, 0, 9999, 45);
  const zoom = !!s.zoom;
  const svgRef = useRef(null);
  const X0 = 40;
  const X1 = 560;
  const unit = (X1 - X0) / 3;
  const tx = useTween(X0 + (v / 100) * unit, 800);
  const drag = useSvgDrag(svgRef, (x) => update({ v: clamp(Math.round(((x - X0) / unit) * (zoom ? 100 : 10)) * (zoom ? 1 : 10), 0, 300) }));
  const task = s.task || null;
  const done = !!task && (mode === 'line' ? task.v !== undefined && v === task.v : task.within !== undefined && a > b && a - b <= task.within);
  useDone(done, onInteract);
  const lo10 = Math.floor(v / 10); // tenth just below
  const zp = useTween(zoom ? 1 : 0, 700);
  const zx0 = 80;
  const zx1 = 520;
  const zu = (zx1 - zx0) / 10;

  // compare: digit columns
  const aS = fmt(a, 2);
  const bS = fmt(b, 2);
  const pad = (str) => str.padStart(5, ' ');
  const A = pad(aS);
  const B = pad(bS);
  let diff = -1;
  for (let i = 0; i < 5; i += 1) if (A[i] !== B[i]) { diff = i; break; }
  const sign = a > b ? '>' : a < b ? '<' : '=';

  return (
    <StoryStage
      eyebrow={mode === 'line' ? 'Visualizer · Decimals on the number line' : 'Visualizer · Comparing decimals'}
      title={mode === 'line' ? `The train stops at ${fmt(v, 2)} km` : `${aS} ${sign} ${bS}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'line', label: 'Number line' }, { value: 'compare', label: 'Compare two decimals' }]} />
          {mode === 'line' ? (
            <div className="grid sm:grid-cols-2 gap-3 items-end">
              <Slider label="Position (km)" value={v} min={0} max={300} step={zoom ? 1 : 10} onChange={(x) => update({ v: x })} show={fmt(v, 2)} />
              <button onClick={() => update({ zoom: !zoom })} className={`px-3 py-2 rounded-xl text-xs font-bold border ${zoom ? 'border-sky-400 text-sky-300 bg-sky-500/10' : 'border-slate-700 text-slate-300'}`}>{zoom ? 'Zoom lens ON: hundredths' : 'Turn on the zoom lens'}</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Orange number" value={a} min={0} max={300} onChange={(x) => update({ a: x })} show={aS} />
              <Slider label="Blue number" value={b} min={0} max={300} onChange={(x) => update({ b: x })} show={bS} tone="text-sky-300" />
            </div>
          )}
          {task && <TaskBanner text={mode === 'line' ? `Your turn: park the train at ${fmt(task.v ?? 0, 2)} km (use the zoom lens).` : `Your turn: make the orange number bigger than the blue one, but by at most ${fmt(task.within ?? 0, 2)}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'line' ? (
          <>
            <line x1={X0} y1="120" x2={X1} y2="120" stroke="#a8a29e" strokeWidth="4" />
            {Array.from({ length: 31 }, (_, i) => {
              const x = X0 + (i / 10) * unit;
              const major = i % 10 === 0;
              return (
                <g key={i}>
                  <line x1={x} y1={major ? 100 : 110} x2={x} y2={major ? 140 : 130} stroke={major ? INK : SKY} strokeWidth={major ? 3 : 1.5} />
                  {major ? <text x={x} y="166" textAnchor="middle" fill={INK} fontSize="20" style={M}>{i / 10}</text>
                    : (i % 10 === 5 && <text x={x} y="156" textAnchor="middle" fill={SKY} fontSize="11" style={M}>{fmt(i, 1)}</text>)}
                </g>
              );
            })}
            <line x1={X0} y1="120" x2={tx} y2="120" stroke={AMBER} strokeWidth="6" strokeLinecap="round" />
            <g transform={`translate(${tx} 0)`} {...drag} style={{ cursor: 'grab' }}>
              <rect x="-26" y="66" width="52" height="28" rx="6" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
              <rect x="-18" y="72" width="14" height="10" rx="2" fill="#bae6fd" />
              <rect x="2" y="72" width="14" height="10" rx="2" fill="#bae6fd" />
              <circle cx="-14" cy="98" r="5" fill="#1c1917" /><circle cx="14" cy="98" r="5" fill="#1c1917" />
              <text x="0" y="56" textAnchor="middle" fill={AMBER} fontSize="18" style={M}>{fmt(v, 2)}</text>
            </g>
            {/* zoom lens between two tenths */}
            <g opacity={zp}>
              <polygon points={`${X0 + (lo10 / 10) * unit},132 ${X0 + ((lo10 + 1) / 10) * unit},132 ${zx1},230 ${zx0},230`} fill={SKY} opacity="0.08" />
              <rect x={zx0 - 20} y="210" width={zx1 - zx0 + 40} height="130" rx="14" fill="#0f172a" stroke={SKY} strokeOpacity="0.5" />
              <line x1={zx0} y1="270" x2={zx1} y2="270" stroke="#a8a29e" strokeWidth="3" />
              {Array.from({ length: 11 }, (_, i) => {
                const x = zx0 + i * zu;
                const end = i === 0 || i === 10;
                return (
                  <g key={i}>
                    <line x1={x} y1={end ? 252 : 260} x2={x} y2={end ? 288 : 280} stroke={end ? INK : PINK} strokeWidth={end ? 3 : 1.5} />
                    <text x={x} y={end ? 310 : 302} textAnchor="middle" fill={end ? INK : PINK} fontSize={end ? 15 : 10} style={M}>{fmt(lo10 * 10 + i, 2)}</text>
                  </g>
                );
              })}
              <circle cx={zx0 + (v - lo10 * 10) * zu} cy="270" r="9" fill={AMBER} style={{ transition: 'cx 500ms ease' }} />
              <text x="300" y="238" textAnchor="middle" fill={SKY} fontSize="13" style={T}>Zoom: the gap from {fmt(lo10, 1)} to {fmt(lo10 + 1, 1)} cut into 10 hundredths</text>
              <text x="300" y="332" textAnchor="middle" fill={AMBER} fontSize="14" style={M}>{fmt(v, 2)} = {fmt(lo10, 1)} + {v - lo10 * 10} hundredths</text>
            </g>
            {!zoom && <text x="300" y="250" textAnchor="middle" fill="#94a3b8" fontSize="15" style={T}>Between two whole numbers there are 10 tenths. Each tenth hides 10 hundredths.</text>}
          </>
        ) : (
          <>
            {['Tens', 'Ones', '.', 'Tenths', 'Hundredths'].map((c, i) => (
              <text key={c} x={150 + i * 80} y="40" textAnchor="middle" fill="#94a3b8" fontSize="12" style={T}>{c === '.' ? '' : c}</text>
            ))}
            {[A, B].map((str, r) => (
              <g key={r}>
                {str.split('').map((ch, i) => (
                  <g key={`${i}-${ch}`}>
                    {i === diff && <rect x={150 + i * 80 - 32} y={58 + r * 74} width="64" height="64" rx="10" fill={GREEN} opacity="0.18" stroke={GREEN} />}
                    <text x={150 + i * 80} y={106 + r * 74} textAnchor="middle" fill={r ? SKY : AMBER} fontSize="46" style={{ ...M, animation: 'dcFadeIn 350ms ease both' }}>{ch}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x="555" y="152" textAnchor="middle" fill={GREEN} fontSize="44" style={M}>{sign}</text>
            <text x="300" y="232" textAnchor="middle" fill="#cbd5e1" fontSize="15" style={T}>
              {diff < 0 ? 'Every place is the same: the numbers are equal.' : `Line up the points. Compare place by place from the left. First difference: ${['tens', 'ones', '', 'tenths', 'hundredths'][diff]}.`}
            </text>
            {/* both on a number line 0 to 3 */}
            <line x1={X0} y1="290" x2={X1} y2="290" stroke="#a8a29e" strokeWidth="3" />
            {[0, 1, 2, 3].map((n) => (
              <g key={n}><line x1={X0 + n * unit} y1="280" x2={X0 + n * unit} y2="300" stroke={INK} strokeWidth="2" /><text x={X0 + n * unit} y="320" textAnchor="middle" fill={INK} fontSize="15" style={M}>{n}</text></g>
            ))}
            {a <= 300 && <circle cx={X0 + (a / 100) * unit} cy="290" r="9" fill={AMBER} style={{ transition: 'cx 500ms ease' }} />}
            {b <= 300 && <circle cx={X0 + (b / 100) * unit} cy="290" r="7" fill={SKY} style={{ transition: 'cx 500ms ease' }} />}
            {(a > 300 || b > 300) && <text x="300" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" style={T}>(numbers beyond 3 are off this line)</text>}
            <text x="300" y="348" textAnchor="middle" fill="#94a3b8" fontSize="13" style={T}>Further right on the number line means bigger.</text>
          </>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Units — paise to rupees, cm to m, g to kg (the point hops left) ───
const UNITS = {
  money: { small: 'paise', big: 'rupees', per: 100, max: 1000, color: AMBER, icon: '₹', step: 5 },
  length: { small: 'cm', big: 'm', per: 100, max: 1000, color: SKY, icon: 'm', step: 1 },
  weight: { small: 'g', big: 'kg', per: 1000, max: 5000, color: PINK, icon: 'kg', step: 5 },
};

export function Class6DecimalUnitsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'money', small: 250, task: null }, visual);
  const mode = UNITS[s.mode] ? s.mode : 'money';
  const U = UNITS[mode];
  const small = num(s.small, 0, U.max, 250);
  const dp = U.per === 100 ? 2 : 3;
  const p = useReplay(`${mode}-${small}`, 1500);
  const task = s.task && s.task.small !== undefined ? s.task : null;
  const done = !!task && small === task.small && (!task.mode || task.mode === mode);
  useDone(done, onInteract);
  const big = fmt(small, dp);
  const digitsS = String(small);
  const hop = ease(seg(p, 0.2, 0.7));
  const fillW = useTween((small / U.max) * 480, 700);
  const wholes = Math.floor(small / U.per);

  return (
    <StoryStage
      eyebrow="Visualizer · Decimals in measurement"
      title={`${small} ${U.small} = ${big} ${U.big}`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m, small: Math.min(small, UNITS[m].max) })} options={[{ value: 'money', label: 'Paise to rupees' }, { value: 'length', label: 'cm to m' }, { value: 'weight', label: 'g to kg' }]} />
          <Slider label={`Amount in ${U.small}`} value={small} min={0} max={U.max} step={U.step} onChange={(v) => update({ small: v })} />
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label={U.small} value={small} tone="text-sky-300" />
            <Readout label={U.big} value={big} tone="text-amber-300" />
            <span className="text-sm text-slate-300">1 {U.big.replace(/s$/, '')} = {U.per} {U.small}: divide by {U.per}, the point moves {dp} places left.</span>
          </div>
          {task && <TaskBanner text={`Your turn: set ${fmt(task.small, dp)} ${U.big}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="300" y="36" textAnchor="middle" fill="#94a3b8" fontSize="15" style={T}>1 {U.big.replace(/s$/, '')} = {U.per} {U.small}, so 1 {U.small} = {U.per === 100 ? '0.01' : '0.001'} {U.big.replace(/s$/, '')}</text>
        {/* digits with a hopping decimal point */}
        {digitsS.split('').map((d, i) => (
          <text key={`${i}-${d}`} x={300 + (i - digitsS.length + 1) * 40} y="110" textAnchor="middle" fill={INK} fontSize="50" style={M}>{d}</text>
        ))}
        <circle cx={300 + 20 - hop * dp * 40} cy="108" r="6" fill={U.color} />
        <text x="380" y="108" fill="#94a3b8" fontSize="20" style={T}>{U.small}</text>
        {Array.from({ length: dp }, (_, i) => (
          <path key={i} d={`M ${320 - i * 40} 124 q -20 22 -40 0`} fill="none" stroke={U.color} strokeWidth="2" opacity={seg(p, 0.2 + i * 0.15, 0.35 + i * 0.15)} />
        ))}
        <text x="300" y="186" textAnchor="middle" fill={U.color} fontSize="40" style={{ ...M, opacity: seg(p, 0.65, 1) }}>= {big} {U.big}</text>
        {/* measure bar */}
        <rect x="60" y="230" width="480" height="40" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <rect x="60" y="230" width={fillW} height="40" rx="8" fill={U.color} opacity="0.75" />
        {Array.from({ length: U.max / U.per + 1 }, (_, i) => {
          const x = 60 + (i * U.per / U.max) * 480;
          return (
            <g key={i}>
              <line x1={x} y1="226" x2={x} y2="276" stroke={INK} strokeWidth="2" />
              {<text x={x} y="296" textAnchor="middle" fill={INK} fontSize="13" style={M}>{i}</text>}
            </g>
          );
        })}
        <text x="300" y="330" textAnchor="middle" fill="#cbd5e1" fontSize="15" style={T}>{wholes} whole {U.big.replace(/s$/, '')}{wholes === 1 ? '' : 's'} and {small % U.per} {U.small} more</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Adding and subtracting decimals in columns (points lined up) ───
export function Class6DecimalAddWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ op: 'add', a: 235, b: 140, task: null }, visual);
  const op = s.op === 'sub' ? 'sub' : 'add';
  const a = num(s.a, 0, 9999, 235); // hundredths
  const b = num(s.b, 0, 9999, 140);
  const r = op === 'add' ? a + b : a - b;
  const p = useReplay(`${op}-${a}-${b}`, 2600);
  const task = s.task && s.task.r !== undefined ? s.task : null;
  const done = !!task && op === (task.op || op) && r === task.r && a !== b;
  useDone(done, onInteract);
  const cols = 4; // tens, ones, tenths, hundredths
  const dig = (n) => String(Math.abs(n)).padStart(cols, '0').split('').map(Number);
  const da = dig(a);
  const db = dig(b);
  // column-by-column from the right with carries (add) or borrows (sub)
  const carry = Array(cols).fill(0);
  const res = Array(cols).fill(0);
  const borrowed = Array(cols).fill(false);
  if (op === 'add') {
    let c = 0;
    for (let i = cols - 1; i >= 0; i -= 1) {
      const t = da[i] + db[i] + c;
      res[i] = t % 10; c = Math.floor(t / 10);
      if (i > 0) carry[i - 1] = c;
    }
  } else if (r >= 0) {
    let br = 0;
    for (let i = cols - 1; i >= 0; i -= 1) {
      let t = da[i] - br - db[i];
      if (t < 0) { t += 10; br = 1; borrowed[i] = true; } else br = 0;
      res[i] = t;
      if (i > 0) carry[i - 1] = br;
    }
  }
  const x = (i) => 210 + i * 62 + (i >= 2 ? 24 : 0);
  const colP = (i) => seg(p, 0.15 + (cols - 1 - i) * 0.18, 0.3 + (cols - 1 - i) * 0.18);
  const strip = (d, n) => { // hide leading zeros in the tens place
    const lead = n < 1000;
    return d.map((v, i) => (i === 0 && lead ? '' : String(v)));
  };
  const sym = op === 'add' ? '+' : '−';

  return (
    <StoryStage
      eyebrow="Visualizer · Adding and subtracting decimals"
      title={`${fmt(a, 2)} ${sym} ${fmt(b, 2)}${r >= 0 ? ` = ${fmt(r, 2)}` : ''}`}
      footer={
        <div className="space-y-3">
          <ModePills value={op} onChange={(v) => update({ op: v })} options={[{ value: 'add', label: 'Add (+)' }, { value: 'sub', label: 'Subtract (−)' }]} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Top number" value={a} min={0} max={2000} step={5} onChange={(v) => update({ a: v })} show={fmt(a, 2)} />
            <Slider label="Bottom number" value={b} min={0} max={2000} step={5} onChange={(v) => update({ b: v })} show={fmt(b, 2)} tone="text-sky-300" />
          </div>
          {task && <TaskBanner text={`Your turn: choose two different amounts whose ${task.op === 'sub' ? 'difference' : 'sum'} is exactly ₹${fmt(task.r, 2)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {['Tens', 'Ones', 'Tenths', 'Hundredths'].map((c, i) => (
          <text key={c} x={x(i)} y="34" textAnchor="middle" fill="#94a3b8" fontSize="12" style={T}>{c}</text>
        ))}
        <rect x={x(1) + 22} y="46" width="20" height="240" fill={AMBER} opacity="0.07" />
        {/* carries / borrows */}
        {carry.map((c, i) => c ? (
          <text key={`c${i}`} x={x(i) + 18} y="62" fill={op === 'add' ? GREEN : RED} fontSize="16" style={{ ...M, opacity: colP(i + 1) }}>{op === 'add' ? `+${c}` : '−1'}</text>
        ) : null)}
        {strip(da, a).map((d, i) => <text key={`a${i}`} x={x(i)} y="110" textAnchor="middle" fill={AMBER} fontSize="48" style={M}>{d}</text>)}
        {strip(db, b).map((d, i) => <text key={`b${i}`} x={x(i)} y="170" textAnchor="middle" fill={SKY} fontSize="48" style={M}>{d}</text>)}
        {[110, 170].map((y) => <circle key={y} cx={x(1) + 32} cy={y - 4} r="5" fill={INK} />)}
        <text x={x(0) - 60} y="170" textAnchor="middle" fill={INK} fontSize="40" style={M}>{sym}</text>
        <line x1={x(0) - 80} y1="190" x2={x(3) + 40} y2="190" stroke={INK} strokeWidth="3" />
        {r >= 0 ? (
          <>
            {strip(res, r).map((d, i) => <text key={`r${i}`} x={x(i)} y="246" textAnchor="middle" fill={GREEN} fontSize="48" style={{ ...M, opacity: colP(i) }}>{d}</text>)}
            <circle cx={x(1) + 32} cy="242" r="5" fill={GREEN} style={{ opacity: colP(1) }} />
            <text x="300" y="300" textAnchor="middle" fill="#cbd5e1" fontSize="15" style={{ ...T, opacity: seg(p, 0.85, 1) }}>Points in one straight line. Work from the right, just like whole numbers.</text>
            <text x="300" y="332" textAnchor="middle" fill="#94a3b8" fontSize="13" style={{ ...T, opacity: seg(p, 0.85, 1) }}>
              {op === 'add' ? `In hundredths: ${a} + ${b} = ${r}, so ${fmt(r, 2)}` : `In hundredths: ${a} − ${b} = ${r}, so ${fmt(r, 2)}`}
            </text>
          </>
        ) : (
          <text x="300" y="250" textAnchor="middle" fill={RED} fontSize="17" style={T}>The bottom number is bigger: we cannot take it away here.</text>
        )}
      </svg>
    </StoryStage>
  );
}
