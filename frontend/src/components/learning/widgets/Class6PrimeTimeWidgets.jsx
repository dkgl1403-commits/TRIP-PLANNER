import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useSceneState, TaskBanner, AMBER, SKY, GREEN, PINK, PURPLE, RED, INK,
} from '../engine/storyKit';

// Class 6 · Playing with Numbers (old NCERT Ch. 3) + Prime Time (Ganita Prakash Ch. 5) — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const seg = (t, from, to) => clamp((t - from) / (to - from), 0, 1);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const KF = [
  '@keyframes ptPop { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: none } }',
  '@keyframes ptFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }',
  '@keyframes ptDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }',
  '@keyframes ptShake { 0%, 100% { transform: translateX(0) } 20% { transform: translateX(-12px) } 40% { transform: translateX(10px) } 60% { transform: translateX(-7px) } 80% { transform: translateX(4px) } }',
  '@keyframes ptGlow { 0%, 100% { opacity: 0.35 } 50% { opacity: 1 } }',
].join(' ');
const POP = { transformBox: 'fill-box', transformOrigin: 'center' };
const SANS = 'sans-serif';
const MONO = 'monospace';

// ─── Number helpers ───
const indianCommas = (n) => {
  const neg = n < 0;
  const s = String(Math.abs(n));
  const out = s.length <= 3 ? s : `${s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${s.slice(-3)}`;
  return neg ? `−${out}` : out;
};
const factorsOf = (n) => {
  const f = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
  return f;
};
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
const primeFactors = (n) => {
  const out = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
};
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const middlePair = (v) => {
  let best = 1;
  for (let i = 2; i * i <= v; i++) if (v % i === 0) best = i;
  return [best, v / best];
};
// Multiset split of two prime-factor lists: [onlyA, common, onlyB]
const splitPrimes = (a, b) => {
  const pb = primeFactors(b);
  const onlyA = [];
  const common = [];
  primeFactors(a).forEach((p) => {
    const k = pb.indexOf(p);
    if (k >= 0) { common.push(p); pb.splice(k, 1); } else onlyA.push(p);
  });
  return [onlyA, common, pb];
};
const product = (arr) => arr.reduce((x, y) => x * y, 1);
const times = (arr) => (arr.length ? arr.join(' × ') : '1');

// Plays a 0→1 clock whenever `key` changes (used for staged, frame-by-frame animations)
function useClock(key, duration = 2200) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    setT(0);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setT(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration]);
  return t;
}

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300', accent = 'accent-amber-400' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className={`w-full ${accent}`} />
    </label>
  );
}

function NumInput({ value, onChange, max = 99999, className = 'text-amber-300' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(clamp(Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 1, 1, max))}
      className={`w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono ${className}`}
    />
  );
}

// ═══ WIDGET 1: Laddoo trays — factors as rectangles, factor pairs, multiples, perfect numbers ═══
function LaddooDefs() {
  return (
    <defs>
      <radialGradient id="ptLaddoo" cx="35%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="45%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b45309" />
      </radialGradient>
    </defs>
  );
}

const PAIR_COLORS = [AMBER, SKY, PINK, GREEN, PURPLE, RED, '#fb923c', '#2dd4bf'];

export function Class6LaddooTrayWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'rect', n: 12, rows: 3, task: null }, visual);
  const n = clamp(Math.round(s.n) || 1, 1, 40);
  const rows = clamp(Math.round(s.rows) || 1, 1, n);
  const cols = Math.floor(n / rows);
  const leftover = n - rows * cols;
  const facs = factorsOf(n);
  const proper = facs.slice(0, -1);
  const sum = proper.reduce((x, y) => x + y, 0);
  const t = useClock(`${s.mode}-${n}`, 2200);
  const done = s.task === 'square' && s.mode === 'rect' && rows * rows === n;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const title = {
    rect: `${n} laddoos in ${rows} equal row${rows > 1 ? 's' : ''}?`,
    all: `Every rectangle you can make with ${n}`,
    multiples: `Multiples of ${n}: tray after tray`,
    perfect: `Is ${n} a perfect number?`,
  }[s.mode];

  // Rectangle mode geometry
  const cell = Math.min(400 / Math.max(cols, 1), 240 / rows, 46);
  const trayW = cols * cell;
  const trayH = rows * cell;
  const x0 = 240 - trayW / 2;
  const y0 = 180 - trayH / 2;
  const leftSize = Math.min(30, 250 / Math.max(1, Math.ceil(leftover / 2)));

  // Pairs for the "all" mode
  const k = facs.length;
  const pairs = [];
  for (let i = 0; i < Math.ceil(k / 2); i++) pairs.push([facs[i], facs[k - 1 - i]]);
  const sp = Math.min(56, 540 / k);
  const chipX = (i) => 300 - ((k - 1) * sp) / 2 + i * sp;

  return (
    <StoryStage
      eyebrow="Visualizer · Factors and Multiples"
      title={title}
      footer={
        <div className="space-y-3">
          <style>{KF}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'rect', label: 'Make a tray' }, { value: 'all', label: 'All factor pairs' }, { value: 'multiples', label: 'Multiples' }, { value: 'perfect', label: 'Perfect number?' }]} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Laddoos" value={n} min={1} max={40} onChange={(v) => update({ n: v, rows: Math.min(rows, v) })} />
            {s.mode === 'rect' && <Slider label="Rows" value={rows} min={1} max={n} onChange={(v) => update({ rows: v })} tone="text-sky-300" accent="accent-sky-400" />}
          </div>
          {s.task === 'square' && <TaskBanner text={`Your turn: arrange ${n} laddoos in a square tray (same number of rows and columns).`} done={done} />}
          <div className="flex flex-wrap gap-2">
            <Readout label={`Factors of ${n}`} value={<span className="text-sm">{facs.join(', ')}</span>} tone="text-emerald-300" />
            <Readout label="How many" value={k} tone="text-amber-300" />
          </div>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <LaddooDefs />
        <rect width={W} height={H} fill="#020617" />

        {s.mode === 'rect' && (
          <g>
            <rect x={x0 - 10} y={y0 - 10} width={trayW + 20} height={trayH + 20} rx="14" fill="#451a03" fillOpacity="0.55" stroke={leftover ? '#92400e' : AMBER} strokeWidth="3"
              style={{ transition: 'all 700ms cubic-bezier(.4,1.3,.6,1)' }} />
            {Array.from({ length: n }, (_, i) => {
              const inTray = i < rows * cols;
              const j = i - rows * cols;
              const x = inTray ? x0 + (i % cols) * cell + cell / 2 : 515 + (j % 2) * (leftSize + 4);
              const y = inTray ? y0 + Math.floor(i / cols) * cell + cell / 2 : 80 + Math.floor(j / 2) * (leftSize + 4);
              const r = inTray ? cell * 0.42 : leftSize * 0.45;
              return (
                <g key={i} style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform 750ms cubic-bezier(.4,1.3,.6,1) ${i * 14}ms` }}>
                  <circle r={r} fill="url(#ptLaddoo)" stroke={inTray ? 'none' : RED} strokeWidth="2.5" style={{ transition: 'r 600ms ease' }} />
                </g>
              );
            })}
            {leftover > 0 && <text x="532" y="50" textAnchor="middle" fill={RED} fontSize="14" fontWeight="800" fontFamily={SANS}>{leftover} left over</text>}
            <text x="240" y="26" textAnchor="middle" fill={INK} fontSize="17" fontWeight="800" fontFamily={MONO}>
              {leftover ? `${rows} rows of ${cols}, and ${leftover} left over` : `${rows} row${rows > 1 ? 's' : ''} × ${cols} = ${n}`}
            </text>
            <text key={`${n}-${rows}`} x="300" y="344" textAnchor="middle" fill={leftover ? RED : GREEN} fontSize="17" fontWeight="900" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 500ms both' }}>
              {leftover ? `✗ ${rows} is not a factor of ${n}` : `✓ ${rows} and ${cols} are factors of ${n}${rows === cols ? ' (a square!)' : ''}`}
            </text>
          </g>
        )}

        {s.mode === 'all' && (
          <g>
            <text x="300" y="26" textAnchor="middle" fill={INK} fontSize="16" fontWeight="800" fontFamily={SANS}>Factors of {n} come in pairs that multiply to {n}</text>
            {pairs.map(([p, q], i) => {
              const xa = chipX(i);
              const xb = chipX(k - 1 - i);
              const prog = ease(seg(t, 0.1 + i * 0.1, 0.4 + i * 0.1));
              const color = PAIR_COLORS[i % PAIR_COLORS.length];
              const h = Math.min(100, 26 + (xb - xa) * 0.3);
              return (
                <g key={`arc${i}`}>
                  {p !== q ? (
                    <path d={`M ${xa} 150 C ${xa} ${150 - h}, ${xb} ${150 - h}, ${xb} 150`} fill="none" stroke={color} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - prog} />
                  ) : (
                    <circle cx={xa} cy="134" r="14" fill="none" stroke={color} strokeWidth="3" opacity={prog} />
                  )}
                  <text x={(xa + xb) / 2} y={p !== q ? 150 - h * 0.75 - 6 : 112} textAnchor="middle" fill={color} fontSize="12" fontWeight="800" fontFamily={MONO} opacity={prog}>{p}×{q}</text>
                </g>
              );
            })}
            {facs.map((f, i) => (
              <g key={`c${f}`} style={{ ...POP, animation: `ptPop 400ms ease ${i * 60}ms both` }}>
                <circle cx={chipX(i)} cy="168" r={Math.min(18, sp * 0.42)} fill="#0f172a" stroke={AMBER} strokeWidth="2" />
                <text x={chipX(i)} y="173" textAnchor="middle" fill={AMBER} fontSize={f > 9 ? 13 : 15} fontWeight="900" fontFamily={MONO}>{f}</text>
              </g>
            ))}
            {pairs.map(([p, q], i) => {
              const m = pairs.length;
              const slotW = 560 / m;
              const cx = 20 + slotW * (i + 0.5);
              const d = Math.min((slotW - 20) / q, 96 / p, 16);
              const op = seg(t, 0.45 + i * 0.1, 0.65 + i * 0.1);
              return (
                <g key={`r${i}`} opacity={op} transform={`translate(0 ${(1 - op) * 16})`}>
                  <rect x={cx - (q * d) / 2 - 5} y={214} width={q * d + 10} height={p * d + 10} rx="6" fill="none" stroke={PAIR_COLORS[i % PAIR_COLORS.length]} strokeWidth="1.5" opacity="0.7" />
                  {Array.from({ length: p * q }, (_, j) => (
                    <circle key={j} cx={cx - (q * d) / 2 + (j % q) * d + d / 2} cy={219 + Math.floor(j / q) * d + d / 2} r={d * 0.38} fill="url(#ptLaddoo)" />
                  ))}
                  <text x={cx} y={Math.min(342, 214 + p * d + 34)} textAnchor="middle" fill={PAIR_COLORS[i % PAIR_COLORS.length]} fontSize="14" fontWeight="800" fontFamily={MONO}>{p} × {q}</text>
                </g>
              );
            })}
          </g>
        )}

        {s.mode === 'multiples' && (() => {
          const [pr, pc] = middlePair(n);
          const scale = 520 / (6 * n);
          return (
            <g>
              {[1, 2, 3, 4, 5].map((m, i) => {
                const op = seg(t, i * 0.13, i * 0.13 + 0.15);
                const cx = 60 + i * 120;
                const d = Math.min(90 / Math.max(pc, 1), 80 / pr, 14);
                return (
                  <g key={m} opacity={op} transform={`translate(0 ${(1 - op) * -20})`}>
                    <rect x={cx - 50} y="36" width="100" height="100" rx="10" fill="#451a03" fillOpacity="0.5" stroke={AMBER} strokeWidth="1.5" />
                    {Array.from({ length: n }, (_, j) => (
                      <circle key={j} cx={cx - (pc * d) / 2 + (j % pc) * d + d / 2} cy={86 - (pr * d) / 2 + Math.floor(j / pc) * d + d / 2} r={d * 0.4} fill="url(#ptLaddoo)" />
                    ))}
                    <text x={cx} y="160" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="800" fontFamily={MONO}>{m} × {n} = {m * n}</text>
                  </g>
                );
              })}
              <line x1="40" y1="260" x2="575" y2="260" stroke={INK} strokeWidth="2.5" />
              <text x="40" y="285" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={MONO}>0</text>
              {[1, 2, 3, 4, 5].map((m, i) => {
                const prog = ease(seg(t, i * 0.13 + 0.05, i * 0.13 + 0.2));
                const xa = 40 + (m - 1) * n * scale;
                const xb = 40 + m * n * scale;
                return (
                  <g key={`j${m}`}>
                    <path d={`M ${xa} 258 Q ${(xa + xb) / 2} 196 ${xb} 258`} fill="none" stroke={GREEN} strokeWidth="2.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - prog} />
                    <circle cx={xb} cy="260" r="6" fill={GREEN} opacity={prog} />
                    <text x={xb} y="285" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily={MONO} opacity={prog}>{m * n}</text>
                  </g>
                );
              })}
              <text x="575" y="320" textAnchor="end" fill={PINK} fontSize="15" fontWeight="800" fontFamily={SANS} opacity={seg(t, 0.8, 1)}>…and on forever: multiples never end</text>
              <text x="40" y="320" fill="#94a3b8" fontSize="13" fontFamily={SANS} opacity={seg(t, 0.8, 1)}>Skip counting by {n}</text>
            </g>
          );
        })()}

        {s.mode === 'perfect' && (() => {
          const sc = 500 / Math.max(sum, n, 1);
          let acc = 0;
          const verdict = sum === n ? `${proper.join(' + ')} = ${n}: a perfect number!` : `${proper.join(' + ') || '0'} = ${sum}, ${sum > n ? 'more' : 'less'} than ${n}`;
          return (
            <g>
              <text x="50" y="96" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>Factors of {n}, except {n} itself</text>
              {proper.map((f, i) => {
                const x = 50 + acc * sc;
                acc += f;
                const p = ease(seg(t, 0.08 + i * 0.1, 0.3 + i * 0.1));
                const w = f * sc;
                return (
                  <g key={f} opacity={p} transform={`translate(${(1 - p) * 60} 0)`}>
                    <rect x={x} y="108" width={Math.max(w - 2, 1)} height="48" rx="6" fill={PAIR_COLORS[i % PAIR_COLORS.length]} fillOpacity="0.85" />
                    {w > 14 && <text x={x + w / 2 - 1} y="138" textAnchor="middle" fill="#020617" fontSize={w > 24 ? 16 : 11} fontWeight="900" fontFamily={MONO}>{f}</text>}
                  </g>
                );
              })}
              <text x="50" y="206" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>The number itself</text>
              <rect x="50" y="218" width={n * sc} height="48" rx="6" fill={SKY} fillOpacity="0.85" />
              <text x={50 + (n * sc) / 2} y="248" textAnchor="middle" fill="#020617" fontSize="18" fontWeight="900" fontFamily={MONO}>{n}</text>
              <line x1={50 + n * sc} y1="100" x2={50 + n * sc} y2="274" stroke={INK} strokeWidth="2" strokeDasharray="5 4" opacity={seg(t, 0.7, 0.9)} />
              <text x="300" y="320" textAnchor="middle" fill={sum === n ? GREEN : AMBER} fontSize={verdict.length > 44 ? 15 : 18} fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.75, 1)}>{verdict}</text>
            </g>
          );
        })()}
      </svg>
    </StoryStage>
  );
}

// ═══ WIDGET 2: Idli-Vada — the game board, a playable round, and two animals jumping to common multiples ═══
const kindOf = (n, a, b) => (n % a === 0 && n % b === 0 ? 'idli-vada' : n % a === 0 ? 'idli' : n % b === 0 ? 'vada' : 'number');
const KIND_COLOR = { idli: AMBER, vada: SKY, 'idli-vada': GREEN, number: '#94a3b8' };

function Idli({ x, y, s = 1 }) {
  return <ellipse cx={x} cy={y} rx={9 * s} ry={5.5 * s} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />;
}
function Vada({ x, y, s = 1 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7.5 * s} fill="#b45309" stroke="#78350f" strokeWidth="1" />
      <circle cx={x} cy={y} r={2.6 * s} fill="#020617" />
    </g>
  );
}
function Frog({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="13" ry="10" fill="#22c55e" />
      <circle cx="-6" cy="-9" r="4.5" fill="#22c55e" /><circle cx="6" cy="-9" r="4.5" fill="#22c55e" />
      <circle cx="-6" cy="-9" r="2" fill="#020617" /><circle cx="6" cy="-9" r="2" fill="#020617" />
      <path d="M -5 3 Q 0 6 5 3" stroke="#14532d" strokeWidth="1.5" fill="none" />
    </g>
  );
}
function Rabbit({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="-4" cy="-17" rx="3.5" ry="9" fill="#e2e8f0" /><ellipse cx="4" cy="-17" rx="3.5" ry="9" fill="#e2e8f0" />
      <ellipse cx="0" cy="0" rx="12" ry="10" fill="#e2e8f0" />
      <circle cx="-4" cy="-2" r="1.8" fill="#020617" /><circle cx="4" cy="-2" r="1.8" fill="#020617" />
      <circle cx="0" cy="3" r="1.8" fill={PINK} />
    </g>
  );
}

export function Class6IdliVadaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'board', a: 3, b: 5, upto: 30, common: false, start: 1, end: 30, task: false }, visual);
  const a = s.a;
  const b = s.b;
  const L = lcm(a, b);
  const t = useClock(`${s.mode}-${a}-${b}-${s.upto}-${s.replay || 0}`, 2300);

  // Game state
  const [cur, setCur] = useState(s.start);
  const [hist, setHist] = useState([]);
  const [miss, setMiss] = useState(null);
  useEffect(() => { setCur(s.start); setHist([]); setMiss(null); }, [s.start, s.end, a, b, s.mode]);
  const finished = cur > s.end;
  const say = (w) => {
    if (finished) return;
    if (w === kindOf(cur, a, b)) {
      setHist((h) => [...h, cur].slice(-7));
      setCur((c) => c + 1);
      setMiss(null);
    } else setMiss({ n: cur, said: w, id: Date.now() });
  };
  useEffect(() => {
    if (s.task && s.mode === 'game' && finished) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, s.task, s.mode]);

  const upto = s.upto;
  const rowsN = Math.ceil(upto / 10);
  const ch = Math.min(56, 270 / rowsN);
  const commons = [];
  for (let m = L; m <= upto; m += L) commons.push(m);
  const pairsOpts = [[3, 5], [2, 5], [2, 4], [3, 7], [4, 6], [3, 4]];

  return (
    <StoryStage
      eyebrow="Visualizer · Idli-Vada and Common Multiples"
      title={s.mode === 'jumps' ? `Two animals: jumps of ${a} and ${b}` : `Idli for ${a}s, vada for ${b}s`}
      footer={
        <div className="space-y-3">
          <style>{KF}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'board', label: 'Game board' }, { value: 'game', label: 'Play a round' }, { value: 'jumps', label: 'Jumping animals' }]} />
          <ModePills value={`${a},${b}`} onChange={(v) => { const [x, y] = v.split(',').map(Number); update({ a: x, b: y }); }} options={pairsOpts.map(([x, y]) => ({ value: `${x},${y}`, label: s.mode === 'jumps' ? `${x} and ${y}` : `idli ${x}, vada ${y}` }))} />
          {s.mode === 'game' && (
            <div className="grid grid-cols-4 gap-2">
              {[['number', 'Say the number'], ['idli', 'Idli'], ['vada', 'Vada'], ['idli-vada', 'Idli-vada']].map(([k, label]) => (
                <button key={k} onClick={() => say(k)} disabled={finished} className={`px-2 py-2 rounded-xl text-sm font-black border-2 transition active:scale-95 ${finished ? 'opacity-40 border-slate-700 text-slate-500' : k === 'idli' ? 'border-amber-400 text-amber-300 hover:bg-amber-500/10' : k === 'vada' ? 'border-sky-400 text-sky-300 hover:bg-sky-500/10' : k === 'idli-vada' ? 'border-emerald-400 text-emerald-300 hover:bg-emerald-500/10' : 'border-slate-500 text-slate-200 hover:bg-slate-800'}`}>{label}</button>
              ))}
            </div>
          )}
          {s.mode === 'board' && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => update({ upto: upto === 30 ? 60 : 30 })} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200">{upto === 30 ? 'Count to 60' : 'Count to 30'}</button>
              <button onClick={() => update({ common: !s.common })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.common ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>Spotlight common multiples</button>
            </div>
          )}
          {s.mode === 'jumps' && <button onClick={() => update({ replay: (s.replay || 0) + 1 })} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200">Replay the jumps</button>}
          {s.task && s.mode === 'game' && <TaskBanner text={`Your turn: play from ${s.start} to ${s.end}. Say idli, vada, idli-vada or the number.`} done={finished} />}
          <p className="text-sm text-slate-300">Common multiples of {a} and {b}: <strong className="text-emerald-300">{[L, 2 * L, 3 * L].join(', ')}, …</strong> The smallest one, {L}, is their <strong className="text-emerald-300">LCM</strong>.</p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />

        {s.mode === 'board' && (
          <g key={`${a}-${b}-${upto}`}>
            {Array.from({ length: upto }, (_, i) => {
              const nn = i + 1;
              const kd = kindOf(nn, a, b);
              const x = 20 + (i % 10) * 56;
              const y = 14 + Math.floor(i / 10) * ch;
              const dim = s.common && kd !== 'idli-vada';
              const col = KIND_COLOR[kd];
              return (
                <g key={nn} opacity={dim ? 0.25 : 1} style={{ transition: 'opacity 500ms' }}>
                  <g style={{ ...POP, animation: `ptPop 350ms ease ${i * (upto > 30 ? 32 : 55)}ms both` }}>
                    <rect x={x + 2} y={y + 2} width="52" height={ch - 4} rx="9" fill={kd === 'number' ? '#0f172a' : `${col}22`} stroke={col} strokeWidth={kd === 'idli-vada' ? 3 : 1.5} />
                    {kd === 'number' ? (
                      <text x={x + 28} y={y + ch / 2 + 7} textAnchor="middle" fill={INK} fontSize="19" fontWeight="800" fontFamily={MONO}>{nn}</text>
                    ) : (
                      <g>
                        <text x={x + 8} y={y + 15} fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily={MONO}>{nn}</text>
                        {kd !== 'vada' && <Idli x={x + (kd === 'idli-vada' ? 21 : 34)} y={y + 15} s={0.7} />}
                        {kd !== 'idli' && <Vada x={x + (kd === 'idli-vada' ? 40 : 38)} y={y + 15} s={0.75} />}
                        <text x={x + 28} y={y + ch - 9} textAnchor="middle" fill={col} fontSize={kd === 'idli-vada' ? 10.5 : 13} fontWeight="900" fontFamily={SANS}>{kd}</text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
            {(() => {
              const yy = 14 + rowsN * ch + 24;
              return (
                <g style={{ animation: `ptFade 500ms ease ${upto * (upto > 30 ? 32 : 55)}ms both` }}>
                  <text x="300" y={yy} textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900" fontFamily={SANS}>
                    {commons.length ? `idli-vada at ${commons.join(', ')}: common multiples of ${a} and ${b}` : `No idli-vada up to ${upto}: the first is ${L}`}
                  </text>
                  {b % a === 0 && <text x="300" y={yy + 24} textAnchor="middle" fill={PINK} fontSize="14" fontWeight="800" fontFamily={SANS}>Never a plain vada: every multiple of {b} is already a multiple of {a}!</text>}
                </g>
              );
            })()}
          </g>
        )}

        {s.mode === 'game' && (
          <g>
            <text x="300" y="30" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>Already said</text>
            {hist.map((hn, i) => {
              const kd = kindOf(hn, a, b);
              const x = 300 - ((hist.length - 1) * 78) / 2 + i * 78;
              return (
                <g key={hn} style={{ transform: `translate(${x}px, 70px)`, transition: 'transform 400ms ease' }}>
                  <g style={{ ...POP, animation: 'ptPop 300ms ease both' }}>
                    <rect x="-36" y="-22" width="72" height="44" rx="10" fill={`${KIND_COLOR[kd]}22`} stroke={KIND_COLOR[kd]} strokeWidth="2" />
                    <text x="0" y="-6" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={MONO}>{hn}</text>
                    <text x="0" y="12" textAnchor="middle" fill={KIND_COLOR[kd]} fontSize={kd === 'idli-vada' ? 11 : 15} fontWeight="900" fontFamily={SANS}>{kd === 'number' ? hn : kd}</text>
                  </g>
                </g>
              );
            })}
            <g key={miss ? miss.id : 'ok'} style={miss ? { animation: 'ptShake 450ms ease' } : undefined}>
              <rect x="160" y="125" width="280" height="130" rx="20" fill="#0f172a" stroke={miss ? RED : finished ? GREEN : AMBER} strokeWidth="4" />
              {finished ? (
                <>
                  <text x="300" y="185" textAnchor="middle" fill={GREEN} fontSize="28" fontWeight="900" fontFamily={SANS}>Shabash!</text>
                  <text x="300" y="220" textAnchor="middle" fill={INK} fontSize="15" fontFamily={SANS}>You reached {s.end} without getting out</text>
                </>
              ) : (
                <>
                  <text x="300" y="150" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>Your number</text>
                  <text x="300" y="222" textAnchor="middle" fill={AMBER} fontSize="64" fontWeight="900" fontFamily={MONO}>{cur}</text>
                </>
              )}
            </g>
            {miss && !finished && (
              <text x="300" y="292" textAnchor="middle" fill={RED} fontSize="16" fontWeight="800" fontFamily={SANS} style={{ animation: 'ptFade 300ms ease both' }}>
                Oops! {miss.n} is {kindOf(miss.n, a, b) === 'number' ? `not a multiple of ${a} or ${b}: just say ${miss.n}` : `"${kindOf(miss.n, a, b)}". Try again!`}
              </text>
            )}
            <text x="300" y="336" textAnchor="middle" fill="#64748b" fontSize="13" fontFamily={SANS}>Round: {s.start} to {s.end} · multiples of {a} → idli · multiples of {b} → vada · both → idli-vada</text>
          </g>
        )}

        {s.mode === 'jumps' && (() => {
          const T = L * Math.max(2, Math.min(3, Math.floor(40 / L) || 2));
          const sc = 520 / T;
          const X = (v) => 45 + v * sc;
          const pos = seg(t, 0.03, 0.92) * T;
          const track = (step, y, color, Pet, name) => {
            const hops = Math.min(Math.floor(pos / step), T / step);
            const frac = hops >= T / step ? 0 : (pos - hops * step) / step;
            const px = X(hops * step + frac * step);
            const py = y - 16 - Math.sin(Math.PI * frac) * 42;
            const spacing = step * sc;
            return (
              <g>
                <line x1={X(0)} y1={y} x2={X(T)} y2={y} stroke={INK} strokeWidth="2.5" />
                {Array.from({ length: T + 1 }, (_, v) => (
                  <line key={`t${v}`} x1={X(v)} y1={y - 4} x2={X(v)} y2={y + 4} stroke="#475569" strokeWidth="1" />
                ))}
                {Array.from({ length: T / step }, (_, i) => {
                  const xa = X(i * step);
                  const xb = X((i + 1) * step);
                  return <path key={`a${i}`} d={`M ${xa} ${y} Q ${(xa + xb) / 2} ${y - 92} ${xb} ${y}`} fill="none" stroke={color} strokeWidth="2.2" opacity={i < hops ? 0.9 : 0.12} />;
                })}
                {Array.from({ length: T / step + 1 }, (_, i) => (
                  <g key={`d${i}`} opacity={i * step <= pos ? 1 : 0.2}>
                    <circle cx={X(i * step)} cy={y} r="5" fill={color} />
                    {(spacing >= 22 || i * step === 0) && <text x={X(i * step)} y={y + 20} textAnchor="middle" fill={color} fontSize="12" fontWeight="800" fontFamily={MONO}>{i * step}</text>}
                  </g>
                ))}
                <Pet x={px} y={py} />
                <text x={X(0)} y={y + 40} fill={color} fontSize="13" fontWeight="800" fontFamily={SANS}>{name} jumps {step} at a time</text>
              </g>
            );
          };
          const commonsJ = Array.from({ length: Math.floor(T / L) }, (_, i) => (i + 1) * L);
          return (
            <g>
              {commonsJ.map((m) => (
                <g key={`c${m}`} opacity={pos >= m ? 1 : 0} style={{ transition: 'opacity 300ms' }}>
                  <rect x={X(m) - 20} y="58" width="40" height="252" rx="10" fill={GREEN} fillOpacity="0.1" stroke={GREEN} strokeDasharray="4 4" />
                  <text x={X(m)} y="50" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900" fontFamily={MONO}>{m}</text>
                </g>
              ))}
              {track(a, 150, AMBER, Frog, 'Frog')}
              {track(b, 290, SKY, Rabbit, 'Rabbit')}
              <text x="300" y="22" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily={SANS} opacity={seg(t, 0.9, 1)}>Both land on {commonsJ.join(', ')}: common multiples of {a} and {b}</text>
            </g>
          );
        })()}
      </svg>
    </StoryStage>
  );
}

// ═══ WIDGET 3: Primes — factor counts, the Sieve of Eratosthenes, twin primes and Goldbach's mystery ═══
const SIEVE_PRIMES = [2, 3, 5, 7];
const SIEVE_COLORS = { 2: AMBER, 3: SKY, 5: PINK, 7: PURPLE };
const spf = (n) => primeFactors(n)[0];
const TWINS = [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43], [59, 61], [71, 73]];

export function Class6PrimeSieveWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'sieve', step: 0, focus: 7, even: 30, task: null }, visual);
  const step = clamp(s.step, 0, 4);
  const prevRef = useRef(step);
  const prev = prevRef.current;
  useEffect(() => { prevRef.current = step; }, [step]);
  const t = useClock(`${s.mode}-${s.focus}-${s.even}`, 2200);
  const [flash, setFlash] = useState(null);
  const [gIdx, setGIdx] = useState(0);
  const E = clamp(Math.round(s.even / 2) * 2, 4, 100);
  const gPairs = [];
  for (let p = 2; p <= E / 2; p++) if (isPrime(p) && isPrime(E - p)) gPairs.push([p, E - p]);
  useEffect(() => {
    setGIdx(0);
    if (s.mode !== 'goldbach') return undefined;
    const id = setInterval(() => setGIdx((i) => i + 1), 1300);
    return () => clearInterval(id);
  }, [s.mode, E]);
  const gp = gPairs.length ? gPairs[gIdx % gPairs.length] : [0, 0];

  const done = s.task === 'sieve' && step >= 4;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const tapCell = (n) => {
    if (s.mode !== 'sieve' || step >= 4) return;
    if (n === SIEVE_PRIMES[step]) { update({ step: step + 1 }); setFlash(null); } else setFlash({ n, id: Date.now() });
  };

  const cellX = (n) => 14 + ((n - 1) % 10) * 40;
  const cellY = (n) => 22 + Math.floor((n - 1) / 10) * 31.5;
  const primeCount = Array.from({ length: 100 }, (_, i) => i + 1).filter((n) => isPrime(n) && (step >= 4 || (SIEVE_PRIMES.indexOf(n) >= 0 && SIEVE_PRIMES.indexOf(n) < step))).length;
  const crossedCount = (p) => Array.from({ length: 99 }, (_, i) => i + 2).filter((n) => !isPrime(n) && spf(n) === p).length;

  const titles = {
    count: 'How many factors does each number have?',
    sieve: 'Sieve of Eratosthenes: 1 to 100',
    twins: 'Twin primes: primes that differ by 2',
    goldbach: `Goldbach: ${E} as a sum of two primes`,
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Prime Time"
      title={titles[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{KF}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'count', label: 'Count factors' }, { value: 'sieve', label: 'The sieve' }, { value: 'twins', label: 'Twin primes' }, { value: 'goldbach', label: 'Goldbach' }]} />
          {s.mode === 'count' && <Slider label="Spotlight number" value={s.focus} min={1} max={20} onChange={(v) => update({ focus: v })} />}
          {s.mode === 'sieve' && !s.task && (
            <div className="flex gap-2">
              <button onClick={() => update({ step: Math.min(4, step + 1) })} disabled={step >= 4} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white disabled:opacity-40">{step < 4 ? `Sieve out multiples of ${SIEVE_PRIMES[step]}` : 'Sieve complete'}</button>
              <button onClick={() => update({ step: 0 })} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200">Reset</button>
            </div>
          )}
          {s.mode === 'sieve' && s.task && (
            <div className="flex flex-wrap gap-2 items-center">
              <TaskBanner text={done ? 'Sieve complete: 25 primes are left!' : `Your turn: tap the next number that is not crossed out (it is prime!). Next: ${step === 0 ? 'start with the first prime' : 'the smallest number still standing'}.`} done={done} />
              <button onClick={() => update({ step: 0 })} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200">Start again</button>
            </div>
          )}
          {s.mode === 'goldbach' && <Slider label="Even number" value={E} min={4} max={100} step={2} onChange={(v) => update({ even: v })} tone="text-pink-300" accent="accent-pink-400" />}
          {s.mode === 'count' && <p className="text-sm text-slate-300"><strong className="text-emerald-300">Prime</strong>: exactly 2 factors. <strong className="text-amber-300">Composite</strong>: more than 2. <strong className="text-slate-300">1</strong>: only 1 factor, neither.</p>}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />

        {s.mode === 'count' && (() => {
          const f = clamp(s.focus, 1, 20);
          const ff = factorsOf(f);
          const kind = f === 1 ? 'neither prime nor composite' : ff.length === 2 ? 'prime' : 'composite';
          return (
            <g>
              <text x="300" y="30" textAnchor="middle" fill={f === 1 ? '#cbd5e1' : ff.length === 2 ? GREEN : AMBER} fontSize="17" fontWeight="900" fontFamily={SANS}>
                {f} has {ff.length} factor{ff.length > 1 ? 's' : ''} ({ff.join(', ')}): {kind}
              </text>
              {Array.from({ length: 20 }, (_, i) => {
                const nn = i + 1;
                const fs = factorsOf(nn);
                const col = nn === 1 ? '#94a3b8' : fs.length === 2 ? GREEN : AMBER;
                const x = 22 + i * 28;
                const isF = nn === f;
                return (
                  <g key={nn} opacity={isF ? 1 : 0.8}>
                    {isF && <rect x={x - 2} y={300 - fs.length * 30 - 8} width="28" height={fs.length * 30 + 42} rx="6" fill="none" stroke={INK} strokeWidth="2" style={{ animation: 'ptGlow 1.4s ease infinite' }} />}
                    {fs.map((d, j) => {
                      const p = seg(t, i * 0.03 + j * 0.04, i * 0.03 + j * 0.04 + 0.12);
                      return (
                        <g key={d} opacity={p} transform={`translate(0 ${(1 - p) * -30})`}>
                          <rect x={x} y={300 - (j + 1) * 30} width="24" height="27" rx="4" fill={col} fillOpacity={isF ? 0.9 : 0.55} />
                          <text x={x + 12} y={300 - (j + 1) * 30 + 18} textAnchor="middle" fill="#020617" fontSize={d > 9 ? 10 : 12} fontWeight="900" fontFamily={MONO}>{d}</text>
                        </g>
                      );
                    })}
                    <text x={x + 12} y="322" textAnchor="middle" fill={isF ? INK : col} fontSize="13" fontWeight="900" fontFamily={MONO}>{nn}</text>
                  </g>
                );
              })}
              <text x="22" y="348" fill="#64748b" fontSize="12" fontFamily={SANS}>Each stack shows the factors of the number below it.</text>
            </g>
          );
        })()}

        {s.mode !== 'count' && (
          <g>
            {Array.from({ length: 100 }, (_, i) => {
              const nn = i + 1;
              const x = cellX(nn);
              const y = cellY(nn);
              const prime = isPrime(nn);
              const p = nn > 1 && !prime ? spf(nn) : null;
              const k = p ? SIEVE_PRIMES.indexOf(p) : -1;
              const sieveMode = s.mode === 'sieve';
              const crossed = sieveMode ? p !== null && k < step : !prime && nn > 1;
              const crossDelay = crossed && k >= prev ? (k - prev) * 620 + Math.floor(nn / p) * 11 : 0;
              const pIdx = SIEVE_PRIMES.indexOf(nn);
              const circled = sieveMode && pIdx >= 0 && pIdx < step;
              const circleDelay = circled && pIdx >= prev ? (pIdx - prev) * 620 : 0;
              const golden = prime && (!sieveMode || step >= 4);
              const goldDelay = sieveMode ? Math.max(0, 4 - prev) * 620 + nn * 6 : 0;
              const twin = s.mode === 'twins' && TWINS.some(([u, v]) => u === nn || v === nn);
              const gb = s.mode === 'goldbach' && (nn === gp[0] || nn === gp[1]);
              const fl = flash && flash.n === nn;
              return (
                <g key={nn} onClick={() => tapCell(nn)} style={{ cursor: sieveMode && step < 4 ? 'pointer' : 'default' }}>
                  <rect x={x + 1} y={y + 1} width="38" height="29" rx="5"
                    fill={nn === 1 ? '#334155' : gb ? 'rgba(244,114,182,0.35)' : twin ? 'rgba(244,114,182,0.18)' : golden ? 'rgba(52,211,153,0.16)' : '#0f172a'}
                    stroke={fl ? RED : gb ? PINK : golden ? GREEN : '#1e293b'} strokeWidth={fl || gb ? 2.5 : 1}
                    style={{ transition: `fill 400ms ease ${golden ? goldDelay : 0}ms, stroke 400ms ease ${golden ? goldDelay : 0}ms` }} />
                  <text x={x + 20} y={y + 21} textAnchor="middle" fontSize="14" fontWeight="800" fontFamily={MONO}
                    fill={nn === 1 ? '#94a3b8' : golden ? GREEN : INK}
                    style={{ opacity: crossed ? 0.38 : 1, transition: `opacity 300ms ease ${crossDelay}ms, fill 400ms ease ${golden ? goldDelay : 0}ms` }}>{nn}</text>
                  {sieveMode && p && (
                    <line x1={x + 6} y1={y + 26} x2={x + 34} y2={y + 5} stroke={SIEVE_COLORS[p]} strokeWidth="2.5" pathLength="1" strokeDasharray="1"
                      style={{ strokeDashoffset: crossed ? 0 : 1, transition: `stroke-dashoffset 260ms ease ${crossDelay}ms` }} />
                  )}
                  {nn === 1 && sieveMode && <line x1={x + 6} y1={y + 26} x2={x + 34} y2={y + 5} stroke="#94a3b8" strokeWidth="2.5" />}
                  {sieveMode && pIdx >= 0 && (
                    <circle cx={x + 20} cy={y + 15.5} r="13" fill="none" stroke={SIEVE_COLORS[nn]} strokeWidth="2.5"
                      style={{ opacity: circled ? 1 : 0, transition: `opacity 300ms ease ${circleDelay}ms` }} />
                  )}
                </g>
              );
            })}
            {s.mode === 'twins' && TWINS.map(([u, v], i) => (
              <line key={u} x1={cellX(u) + 20} y1={cellY(u) + 28} x2={cellX(v) + 20} y2={cellY(v) + 28} stroke={PINK} strokeWidth="3" strokeLinecap="round" opacity={seg(t, i * 0.1, i * 0.1 + 0.15)} />
            ))}

            {/* Side panel */}
            <g transform="translate(428 0)">
              {s.mode === 'sieve' && (
                <g>
                  {(step === 0 ? ['Cross out 1.', 'Circle 2, then cross', 'out its multiples.'] : step < 4 ? [`Circle ${SIEVE_PRIMES[step]}, then cross`, 'out its multiples.', ''] : ['Only primes are left!', 'Crossed numbers', 'are composite.']).map((ln, i) => (
                    <text key={`${step}-${i}`} x="0" y={30 + i * 18} fill={i === 0 ? INK : '#94a3b8'} fontSize={i === 0 ? 14 : 12} fontWeight={i === 0 ? 900 : 600} fontFamily={SANS}>{ln}</text>
                  ))}
                  {SIEVE_PRIMES.map((p, i) => (
                    <g key={p} transform={`translate(0 ${88 + i * 34})`} opacity={i < step ? 1 : 0.3} style={{ transition: `opacity 300ms ease ${i >= prev ? (i - prev) * 620 : 0}ms` }}>
                      <line x1="0" y1="0" x2="18" y2="-14" stroke={SIEVE_COLORS[p]} strokeWidth="3" />
                      <text x="28" y="-2" fill={SIEVE_COLORS[p]} fontSize="13" fontWeight="800" fontFamily={SANS}>multiples of {p}: {crossedCount(p)}</text>
                    </g>
                  ))}
                  <text x="0" y="250" fill="#94a3b8" fontSize="12" fontFamily={SANS}>Primes found</text>
                  <text x="0" y="290" fill={GREEN} fontSize="38" fontWeight="900" fontFamily={MONO}>{primeCount}</text>
                  {step >= 4 && <text x="0" y="318" fill={GREEN} fontSize="12" fontWeight="700" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 2400ms both' }}>11 × 11 = 121 &gt; 100,</text>}
                  {step >= 4 && <text x="0" y="336" fill={GREEN} fontSize="12" fontWeight="700" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 2400ms both' }}>so 7 was the last sieve.</text>}
                </g>
              )}
              {s.mode === 'twins' && (
                <g>
                  <text x="0" y="36" fill={PINK} fontSize="14" fontWeight="900" fontFamily={SANS}>8 twin pairs</text>
                  <text x="0" y="54" fill="#94a3b8" fontSize="12" fontFamily={SANS}>up to 100</text>
                  {TWINS.map(([u, v], i) => (
                    <text key={u} x="0" y={84 + i * 30} fill={PINK} fontSize="16" fontWeight="800" fontFamily={MONO} opacity={seg(t, i * 0.1, i * 0.1 + 0.15)}>{u} and {v}</text>
                  ))}
                  <text x="0" y="335" fill="#94a3b8" fontSize="11" fontFamily={SANS}>Endless? Nobody knows!</text>
                </g>
              )}
              {s.mode === 'goldbach' && (
                <g>
                  <text x="0" y="36" fill={PINK} fontSize="15" fontWeight="900" fontFamily={SANS}>{E} = prime + prime</text>
                  {gPairs.slice(0, 8).map(([u, v], i) => (
                    <text key={u} x="0" y={70 + i * 30} fill={u === gp[0] ? PINK : '#cbd5e1'} fontSize="17" fontWeight="800" fontFamily={MONO} style={{ transition: 'fill 300ms' }}>{u} + {v}</text>
                  ))}
                  <text x="0" y="318" fill="#94a3b8" fontSize="11" fontFamily={SANS}>Checked by computer for</text>
                  <text x="0" y="334" fill="#94a3b8" fontSize="11" fontFamily={SANS}>huge numbers, never proved.</text>
                </g>
              )}
            </g>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ═══ WIDGET 4: Divisibility lab — each test, and WHY it works ═══
const TESTS = [2, 3, 4, 5, 6, 8, 9, 10, 11];
const TAIL = { 2: 1, 5: 1, 10: 1, 4: 2, 8: 3 };
const TAIL_WHY = {
  2: ['10 = 2 × 5, so every ten, hundred and thousand', 'is already a multiple of 2. Only the ones digit decides.'],
  5: ['10 = 2 × 5, so every ten, hundred and thousand', 'is already a multiple of 5. Only the ones digit decides.'],
  10: ['Tens, hundreds, thousands are all multiples of 10.', 'Only the ones digit decides: it must be 0.'],
  4: ['100 = 4 × 25, so every hundred is a multiple of 4.', 'Only the last two digits decide.'],
  8: ['1,000 = 8 × 125, so every thousand is a multiple of 8.', 'Only the last three digits decide.'],
};
const quickTest = (n, d) => n % d === 0;

export function Class6DivisibilityLabWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ num: 7236, test: 9, task: null }, visual);
  const [pick, setPick] = useState(null);
  const taskKey = JSON.stringify(s.task);
  useEffect(() => { setPick(null); }, [taskKey]);
  const task = s.task;
  const taskNum = task ? Number(task.pattern.replace('_', pick === null ? '0' : String(pick))) : null;
  const num = task ? taskNum : clamp(Math.round(s.num) || 1, 1, 9999999);
  const test = task ? task.by : s.test;
  const digits = String(num).split('').map(Number);
  const len = digits.length;
  const blankIdx = task ? task.pattern.indexOf('_') : -1;
  const blankOpen = blankIdx >= 0 && pick === null;
  const ok = num % test === 0;
  const done = !!task && pick !== null && ok;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const t = useClock(`${num}-${test}-${pick}`, 2300);

  const bw = Math.min(64, 420 / len);
  const dx = (i) => 300 - (len * bw) / 2 + i * bw + bw / 2;
  const tail = TAIL[test];
  const digitSum = digits.reduce((x, y) => x + y, 0);
  const altTerms = digits.map((d, i) => ((len - 1 - i) % 2 === 0 ? d : -d));
  const altSum = altTerms.reduce((x, y) => x + y, 0);
  const verdictText = task && pick === null
    ? 'Pick a digit for the blank'
    : `${indianCommas(num)} ${ok ? 'IS' : 'is NOT'} divisible by ${test}${ok ? `: ${indianCommas(num)} ÷ ${test} = ${indianCommas(num / test)}` : ''}`;

  const renderDigits = (shiftFn, colorFn) => digits.map((d, i) => {
    const sh = shiftFn ? shiftFn(i) : 0;
    const isBlank = i === blankIdx && pick === null;
    const col = isBlank ? PINK : colorFn ? colorFn(i) : AMBER;
    return (
      <g key={i} style={{ transform: `translateX(${sh}px)`, transition: 'transform 700ms cubic-bezier(.4,1.3,.6,1) 300ms' }}>
        <rect x={dx(i) - bw / 2 + 3} y="18" width={bw - 6} height="54" rx="9" fill="#0f172a" stroke={i === blankIdx ? PINK : col} strokeWidth="2.5" strokeDasharray={isBlank ? '5 4' : undefined} />
        <text x={dx(i)} y="58" textAnchor="middle" fill={col} fontSize={Math.min(34, bw * 0.62)} fontWeight="900" fontFamily={MONO}>{isBlank ? '?' : d}</text>
      </g>
    );
  });

  let body = null;
  if (tail) {
    const headLen = Math.max(0, len - tail);
    const head = headLen ? Number(String(num).slice(0, headLen)) * 10 ** tail : 0;
    const tailNum = num % 10 ** tail;
    const tailOk = tailNum % test === 0;
    body = (
      <g>
        {renderDigits((i) => (i < headLen ? -24 : 24), (i) => (i < headLen ? '#64748b' : SKY))}
        <g style={{ animation: 'ptFade 500ms ease 800ms both' }}>
          {headLen > 0 && <text x={dx(0) - 24} y="100" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={MONO}>{indianCommas(head)} ✓ always divisible</text>}
          <text x={dx(len - 1) + 24} y={headLen > 0 ? 124 : 100} textAnchor="end" fill={SKY} fontSize="14" fontWeight="800" fontFamily={MONO}>check only {tailNum}</text>
        </g>
        <text x="300" y="170" textAnchor="middle" fill={INK} fontSize="14" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 1100ms both' }}>{TAIL_WHY[test][0]}</text>
        <text x="300" y="192" textAnchor="middle" fill={INK} fontSize="14" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 1200ms both' }}>{TAIL_WHY[test][1]}</text>
        <text x="300" y="250" textAnchor="middle" fill={tailOk ? GREEN : RED} fontSize="24" fontWeight="900" fontFamily={MONO} style={{ animation: 'ptFade 500ms ease 1500ms both' }}>
          {tailNum} ÷ {test} {tailOk ? `= ${tailNum / test} ✓` : `leaves ${tailNum % test} ✗`}
        </text>
      </g>
    );
  } else if (test === 3 || test === 9) {
    // Every 10 = 9 + 1, 100 = 99 + 1 ... : take away the nines, the digits are what is left over
    const cw = Math.min(110, 560 / len);
    const cx = (i) => 300 - (len * cw) / 2 + i * cw + cw / 2;
    let dotIdx = 0;
    const dots = [];
    digits.forEach((d, i) => { for (let j = 0; j < d; j++) dots.push({ i, j, k: dotIdx++ }); });
    const total = dots.length;
    const potSp = Math.min(16, 440 / Math.max(total, 1));
    body = (
      <g>
        {renderDigits(null, () => AMBER)}
        {digits.map((d, i) => {
          const place = 10 ** (len - 1 - i);
          return (
            <g key={`col${i}`} opacity={seg(t, 0.02, 0.15)}>
              <text x={cx(i)} y="92" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily={MONO}>{place === 1 ? 'ones' : `${indianCommas(place)} =`}</text>
              {place > 1 && <text x={cx(i)} y="106" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily={MONO}>{indianCommas(place - 1)} + 1</text>}
              {Array.from({ length: d }, (_, j) => (
                <rect key={j} x={cx(i) - cw / 2 + 8} y={114 + j * 15} width={cw - 30} height="12" rx="3" fill="#334155" opacity={place > 1 ? seg(t, 0.05 + j * 0.02, 0.2 + j * 0.02) : 0} />
              ))}
              {place > 1 && d > 0 && <text x={cx(i) - 8} y={114 + d * 15 + 12} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily={MONO} opacity={seg(t, 0.2, 0.3)}>{test === 9 ? 'nines' : 'threes'}</text>}
            </g>
          );
        })}
        {dots.map(({ i, j, k }) => {
          const p = ease(seg(t, 0.35 + k * (0.3 / Math.max(total, 1)), 0.55 + k * (0.3 / Math.max(total, 1))));
          const x0 = cx(i) + cw / 2 - 14;
          const y0 = 120 + j * 15;
          const x1 = 300 - ((total - 1) * potSp) / 2 + k * potSp;
          const y1 = 300;
          return <circle key={`dot${k}`} cx={x0 + (x1 - x0) * p} cy={y0 + (y1 - y0) * p} r="5" fill={AMBER} opacity={seg(t, 0.1, 0.25)} />;
        })}
        <rect x="70" y="284" width="460" height="32" rx="12" fill="none" stroke={AMBER} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
        <text x="300" y="276" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight="800" fontFamily={SANS} opacity={seg(t, 0.6, 0.75)}>Left over after removing the {test === 9 ? 'nines' : 'threes'}: {blankOpen ? `${digits.map((d, i) => (i === blankIdx ? '?' : d)).join(' + ')} = ${digitSum} + ?` : `${digits.join(' + ')} = ${digitSum}`}</text>
        <text x="300" y="342" textAnchor="middle" fill={blankOpen ? PINK : digitSum % test === 0 ? GREEN : RED} fontSize="17" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.85, 1)}>
          {blankOpen ? `${digitSum} + ? must be a multiple of ${test}` : `digit sum ${digitSum} ${digitSum % test === 0 ? `is a multiple of ${test} ✓` : `is not a multiple of ${test} ✗`}`}
        </text>
      </g>
    );
  } else if (test === 6) {
    const two = num % 2 === 0;
    const three = digitSum % 3 === 0;
    body = (
      <g>
        {renderDigits(null, (i) => (i === len - 1 ? SKY : AMBER))}
        {[[two, 'Test for 2', `last digit ${digits[len - 1]} is ${two ? 'even' : 'odd'}`, 150], [three, 'Test for 3', `digit sum ${digitSum}`, 450]].map(([pass, head, line, x], i) => (
          <g key={head} style={{ animation: `ptFade 500ms ease ${400 + i * 500}ms both` }}>
            <rect x={x - 130} y="110" width="260" height="120" rx="16" fill="#0f172a" stroke={pass ? GREEN : RED} strokeWidth="2.5" />
            <text x={x} y="144" textAnchor="middle" fill={INK} fontSize="17" fontWeight="900" fontFamily={SANS}>{head}</text>
            <text x={x} y="176" textAnchor="middle" fill="#cbd5e1" fontSize="15" fontFamily={MONO}>{line}</text>
            <text x={x} y="212" textAnchor="middle" fill={pass ? GREEN : RED} fontSize="22" fontWeight="900" fontFamily={SANS}>{pass ? '✓ passes' : '✗ fails'}</text>
          </g>
        ))}
        <text x="300" y="270" textAnchor="middle" fill={INK} fontSize="14" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 1400ms both' }}>6 = 2 × 3, and 2 and 3 are co-prime: a number must pass BOTH tests.</text>
      </g>
    );
  } else if (test === 11) {
    const reasons = ['1', '10 = 11 − 1', '100 = 99 + 1', '1,000 = 1,001 − 1', '10,000 = 9,999 + 1', '1,00,000 = 1,00,001 − 1', '10,00,000 = 9,99,999 + 1'];
    body = (
      <g>
        {renderDigits(null, (i) => ((len - 1 - i) % 2 === 0 ? GREEN : PINK))}
        {digits.map((d, i) => {
          const plus = (len - 1 - i) % 2 === 0;
          const order = len - 1 - i;
          const p = seg(t, 0.1 + order * 0.08, 0.25 + order * 0.08);
          return (
            <g key={`b${i}`} opacity={p}>
              <circle cx={dx(i)} cy="94" r="12" fill={plus ? GREEN : PINK} />
              <text x={dx(i)} y="100" textAnchor="middle" fill="#020617" fontSize="18" fontWeight="900" fontFamily={MONO}>{plus ? '+' : '−'}</text>
            </g>
          );
        })}
        {digits.map((d, i) => {
          const order = len - 1 - i;
          const plus = order % 2 === 0;
          return (
            <text key={`r${i}`} x="300" y={136 + order * 19} textAnchor="middle" fill={plus ? GREEN : PINK} fontSize="13" fontFamily={MONO} opacity={seg(t, 0.1 + order * 0.08, 0.25 + order * 0.08)}>
              {order === 0 ? 'ones digit: add' : `${reasons[order] || ''} → ${plus ? 'add' : 'subtract'} this digit`}
            </text>
          );
        })}
        <text x="300" y="296" textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.65, 0.8)}>
          {[...altTerms].reverse().map((v, i) => (i === 0 ? `${v}` : v < 0 ? ` − ${-v}` : ` + ${v}`)).join('')} = {indianCommas(altSum)}
        </text>
        <text x="300" y="336" textAnchor="middle" fill={altSum % 11 === 0 ? GREEN : RED} fontSize="16" fontWeight="900" fontFamily={SANS} opacity={seg(t, 0.8, 0.95)}>
          {altSum === 0 ? '0 counts as a multiple of 11 ✓' : altSum % 11 === 0 ? `${indianCommas(altSum)} is a multiple of 11 ✓` : `${indianCommas(altSum)} is not a multiple of 11 ✗`}
        </text>
      </g>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Divisibility Tests"
      title={`Is ${task && pick === null ? task.pattern.replace('_', '?') : indianCommas(num)} divisible by ${test}?`}
      footer={
        <div className="space-y-3">
          <style>{KF}</style>
          {!task && <ModePills value={String(test)} onChange={(v) => update({ test: Number(v) })} options={TESTS.map((d) => ({ value: String(d), label: `÷ ${d}` }))} />}
          {!task && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              Number: <NumInput value={num} max={9999999} onChange={(v) => update({ num: v })} />
              <span>Try a number of your own.</span>
            </div>
          )}
          {task && (
            <div className="space-y-2">
              <TaskBanner text={`Your turn: choose the missing digit so that ${task.pattern.replace('_', '?')} is divisible by ${task.by}.`} done={done} />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 10 }, (_, d) => (
                  <button key={d} onClick={() => setPick(d)} className={`w-9 h-9 rounded-lg font-mono font-black border-2 ${pick === d ? (ok ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-red-400 bg-red-500/10 text-red-300') : 'border-slate-700 text-slate-200 hover:bg-slate-800'}`}>{d}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {TESTS.map((d) => (
              <span key={d} className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border ${task && pick === null ? 'border-slate-700 text-slate-500' : quickTest(num, d) ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10' : 'border-slate-700 text-slate-500'}`}>÷{d} {task && pick === null ? '?' : quickTest(num, d) ? '✓' : '✗'}</span>
            ))}
          </div>
          <p className={`text-sm font-bold ${task && pick === null ? 'text-slate-400' : ok ? 'text-emerald-300' : 'text-red-300'}`}>{verdictText}</p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <g key={`${num}-${test}-${pick}`}>{body}</g>
      </svg>
    </StoryStage>
  );
}

// ═══ WIDGET 5: Factor trees, co-primes and string art ═══
function buildTree(v, first, id = 'r') {
  if (v < 4 || isPrime(v)) return { v, id, kids: null };
  const [l, r] = first && first[0] * first[1] === v && first[0] > 1 && first[1] > 1 ? first : middlePair(v);
  return { v, id, kids: [buildTree(l, null, `${id}0`), buildTree(r, null, `${id}1`)] };
}
function growTree(v, split, id = 'r') {
  if (split.has(id) && v > 3 && !isPrime(v)) {
    const [l, r] = middlePair(v);
    return { v, id, kids: [growTree(l, split, `${id}0`), growTree(r, split, `${id}1`)] };
  }
  return { v, id, kids: null };
}
function layoutTree(root, x0, width, y0, maxH) {
  const depthOf = (nd) => (nd.kids ? 1 + Math.max(depthOf(nd.kids[0]), depthOf(nd.kids[1])) : 0);
  const leavesOf = (nd) => (nd.kids ? leavesOf(nd.kids[0]) + leavesOf(nd.kids[1]) : 1);
  const depth = depthOf(root);
  const dy = depth ? Math.min(62, maxH / depth) : 0;
  const slot = width / leavesOf(root);
  const nodes = [];
  const edges = [];
  let li = 0;
  const place = (nd, d) => {
    let x;
    if (!nd.kids) { x = x0 + slot * (li + 0.5); li += 1; } else {
      const A = place(nd.kids[0], d + 1);
      const B = place(nd.kids[1], d + 1);
      x = (A.x + B.x) / 2;
      edges.push({ from: { x, y: y0 + d * dy }, to: A, depth: d, id: `${nd.id}a` });
      edges.push({ from: { x, y: y0 + d * dy }, to: B, depth: d, id: `${nd.id}b` });
    }
    const node = { v: nd.v, x, y: y0 + d * dy, depth: d, leaf: !nd.kids, id: nd.id };
    nodes.push(node);
    return node;
  };
  place(root, 0);
  return { nodes, edges };
}
const leafValues = (nd) => (nd.kids ? [...leafValues(nd.kids[0]), ...leafValues(nd.kids[1])] : [nd.v]);

function TreeDrawing({ tree, x0, width, y0 = 40, maxH = 220, stagger = 380, onTap, r = 20 }) {
  const { nodes, edges } = layoutTree(tree, x0, width, y0, maxH);
  return (
    <g>
      {edges.map((e) => (
        <line key={e.id} x1={e.from.x} y1={e.from.y + r * 0.9} x2={e.to.x} y2={e.to.y - r * 0.9} stroke="#64748b" strokeWidth="2.5" pathLength="1" strokeDasharray="1"
          style={{ animation: `ptDraw 350ms ease ${(e.depth + 0.6) * stagger}ms both` }} />
      ))}
      {nodes.map((nd) => {
        const prime = isPrime(nd.v);
        const tappable = onTap && nd.leaf && !prime && nd.v > 1;
        return (
          <g key={nd.id} onClick={tappable ? () => onTap(nd.id) : undefined} style={{ cursor: tappable ? 'pointer' : 'default' }}>
            <g style={{ ...POP, animation: `ptPop 400ms ease ${nd.depth * stagger}ms both` }}>
              {tappable && <circle cx={nd.x} cy={nd.y} r={r + 5} fill="none" stroke={AMBER} strokeWidth="2" style={{ animation: 'ptGlow 1.2s ease infinite' }} />}
              <circle cx={nd.x} cy={nd.y} r={r} fill={prime ? 'rgba(52,211,153,0.2)' : '#0f172a'} stroke={prime ? GREEN : AMBER} strokeWidth="2.5" />
              <text x={nd.x} y={nd.y + 6} textAnchor="middle" fill={prime ? GREEN : AMBER} fontSize={nd.v > 99 ? 14 : 17} fontWeight="900" fontFamily={MONO}>{nd.v}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function Class6FactorTreeWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'tree', n: 72, split: [8, 9], split2: [6, 12], a: 8, b: 15, pins: 10, step: 3, task: false }, visual);
  const n = clamp(Math.round(s.n) || 2, 2, 999);
  const [splitIds, setSplitIds] = useState(() => new Set());
  useEffect(() => { setSplitIds(new Set()); }, [n, s.mode]);
  const t = useClock(`${s.mode}-${s.a}-${s.b}-${s.pins}-${s.step}`, 2300);

  const grown = growTree(n, splitIds);
  const buildDone = s.mode === 'build' && leafValues(grown).every((v) => isPrime(v));
  useEffect(() => {
    if (s.task && buildDone) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildDone, s.task]);

  const fullTree = buildTree(n, s.split);
  const sortedLeaves = (tr) => leafValues(tr).sort((x, y) => x - y);
  const titles = {
    tree: `Factor tree of ${n}`,
    compare: 'Two different trees, same primes?',
    build: `Build the factor tree of ${n}`,
    coprime: `Are ${s.a} and ${s.b} co-prime?`,
    thread: `String art: ${s.pins} nails, jump ${s.step}`,
  };
  const splitOptions = factorsOf(n).filter((f) => f > 1 && f * f <= n && f !== n);

  return (
    <StoryStage
      eyebrow="Visualizer · Prime Factorisation"
      title={titles[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{KF}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'tree', label: 'Factor tree' }, { value: 'compare', label: 'Compare trees' }, { value: 'build', label: 'Build it' }, { value: 'coprime', label: 'Co-prime?' }, { value: 'thread', label: 'String art' }]} />
          {(s.mode === 'tree' || s.mode === 'build' || s.mode === 'compare') && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              Number: <NumInput value={n} max={999} onChange={(v) => update({ n: v, split: null, split2: null })} />
              {s.mode === 'tree' && splitOptions.length > 0 && (
                <>
                  <span>First split:</span>
                  {splitOptions.map((f) => (
                    <button key={f} onClick={() => update({ split: [f, n / f] })} className={`px-2 py-1 rounded-lg font-mono font-bold border ${s.split && s.split[0] === f ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-300'}`}>{f} × {n / f}</button>
                  ))}
                </>
              )}
              {s.mode === 'build' && <button onClick={() => setSplitIds(new Set())} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold">Start again</button>}
            </div>
          )}
          {s.mode === 'coprime' && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              First: <NumInput value={s.a} max={200} onChange={(v) => update({ a: v })} /> Second: <NumInput value={s.b} max={200} onChange={(v) => update({ b: v })} className="text-sky-300" />
            </div>
          )}
          {s.mode === 'thread' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Nails" value={s.pins} min={3} max={24} onChange={(v) => update({ pins: v, step: Math.min(s.step, v - 1) })} />
              <Slider label="Jump" value={s.step} min={1} max={s.pins - 1} onChange={(v) => update({ step: v })} tone="text-pink-300" accent="accent-pink-400" />
            </div>
          )}
          {s.mode === 'build' && <TaskBanner text={s.task ? `Your turn: tap every glowing (composite) number to split it, until only primes are left.` : 'Tap a glowing number to split it into two factors.'} done={buildDone} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />

        {s.mode === 'tree' && (
          <g key={`t${n}-${JSON.stringify(s.split)}`}>
            <TreeDrawing tree={fullTree} x0={40} width={520} y0={36} maxH={230} />
            <text x="300" y="336" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily={MONO} style={{ animation: 'ptFade 500ms ease 1700ms both' }}>
              {n} = {times(sortedLeaves(fullTree))}
            </text>
          </g>
        )}

        {s.mode === 'compare' && (() => {
          const tA = buildTree(n, s.split);
          const tB = buildTree(n, s.split2);
          return (
            <g key={`c${n}-${JSON.stringify(s.split)}-${JSON.stringify(s.split2)}`}>
              <line x1="300" y1="20" x2="300" y2="280" stroke="#1e293b" strokeWidth="2" />
              {[[tA, 10, s.split, AMBER], [tB, 310, s.split2, SKY]].map(([tr, x0, sp, col], i) => (
                <g key={i}>
                  <text x={x0 + 140} y="22" textAnchor="middle" fill={col} fontSize="13" fontWeight="800" fontFamily={SANS}>first split {sp ? `${sp[0]} × ${sp[1]}` : 'any'}</text>
                  <TreeDrawing tree={tr} x0={x0} width={280} y0={52} maxH={200} r={17} />
                  <text x={x0 + 140} y="296" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily={MONO} style={{ animation: 'ptFade 500ms ease 1500ms both' }}>{times(sortedLeaves(tr))}</text>
                </g>
              ))}
              <text x="300" y="336" textAnchor="middle" fill={PINK} fontSize="18" fontWeight="900" fontFamily={SANS} style={{ animation: 'ptFade 500ms ease 1900ms both' }}>
                {times(sortedLeaves(tA)) === times(sortedLeaves(tB)) ? 'Different trees, exactly the same primes!' : 'Check the trees again'}
              </text>
            </g>
          );
        })()}

        {s.mode === 'build' && (
          <g>
            <TreeDrawing tree={grown} x0={40} width={520} y0={40} maxH={220} stagger={0} onTap={(id) => setSplitIds((old) => new Set([...old, id]))} />
            <text x="300" y="336" textAnchor="middle" fill={buildDone ? GREEN : '#94a3b8'} fontSize="20" fontWeight="900" fontFamily={MONO}>
              {buildDone ? `${n} = ${times(sortedLeaves(grown))}` : `leaves so far: ${leafValues(grown).join(' × ')}`}
            </text>
          </g>
        )}

        {s.mode === 'coprime' && (() => {
          const A = clamp(s.a, 1, 200);
          const B = clamp(s.b, 1, 200);
          const fa = factorsOf(A);
          const fb = factorsOf(B);
          const uni = [...new Set([...fa, ...fb])].sort((x, y) => x - y);
          const sp = Math.min(46, 520 / uni.length);
          const ux = (v) => 300 - ((uni.length - 1) * sp) / 2 + uni.indexOf(v) * sp;
          const common = fa.filter((v) => fb.includes(v));
          const g = gcd(A, B);
          return (
            <g key={`${A}-${B}`}>
              <text x="20" y="70" fill={AMBER} fontSize="15" fontWeight="900" fontFamily={MONO}>{A}</text>
              <text x="20" y="190" fill={SKY} fontSize="15" fontWeight="900" fontFamily={MONO}>{B}</text>
              {common.map((v, i) => (
                <line key={`l${v}`} x1={ux(v)} y1="80" x2={ux(v)} y2="162" stroke={GREEN} strokeWidth="3" strokeDasharray="5 4" opacity={seg(t, 0.4 + i * 0.05, 0.6 + i * 0.05)} />
              ))}
              {[[fa, 66, AMBER], [fb, 186, SKY]].map(([list, y, col], r) => list.map((v, i) => {
                const isC = common.includes(v);
                const rr = Math.min(17, sp * 0.42);
                return (
                  <g key={`${r}-${v}`} style={{ ...POP, animation: `ptPop 350ms ease ${r * 300 + i * 60}ms both` }}>
                    <circle cx={ux(v)} cy={y - 5} r={rr} fill={isC ? 'rgba(52,211,153,0.25)' : '#0f172a'} stroke={isC ? GREEN : col} strokeWidth="2" />
                    <text x={ux(v)} y={y} textAnchor="middle" fill={isC ? GREEN : col} fontSize={v > 99 ? 10 : 13} fontWeight="900" fontFamily={MONO}>{v}</text>
                  </g>
                );
              }))}
              <g opacity={seg(t, 0.55, 0.7)}>
                <rect x={300 - (common.join(', ').length * 7 + 130) / 2} y="109" width={common.join(', ').length * 7 + 130} height="22" rx="8" fill="#020617" stroke={GREEN} strokeWidth="1" />
                <text x="300" y="124" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="800" fontFamily={SANS}>common factors: {common.join(', ')}</text>
              </g>
              <text x="160" y="250" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="800" fontFamily={MONO} opacity={seg(t, 0.6, 0.75)}>{A} = {times(primeFactors(A))}</text>
              <text x="440" y="250" textAnchor="middle" fill={SKY} fontSize="16" fontWeight="800" fontFamily={MONO} opacity={seg(t, 0.6, 0.75)}>{B} = {times(primeFactors(B))}</text>
              <text x="300" y="300" textAnchor="middle" fill={g === 1 ? GREEN : PINK} fontSize="20" fontWeight="900" fontFamily={SANS} opacity={seg(t, 0.75, 0.9)}>
                {g === 1 ? `Only 1 is common: ${A} and ${B} are co-prime ✓` : `They share ${common.slice(1).join(', ')}: not co-prime`}
              </text>
              {g === 1 && !isPrime(A) && !isPrime(B) && A > 1 && B > 1 && <text x="300" y="330" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={SANS} opacity={seg(t, 0.85, 1)}>Both numbers are composite, yet they are co-prime.</text>}
            </g>
          );
        })()}

        {s.mode === 'thread' && (() => {
          const P = clamp(s.pins, 3, 24);
          const k = clamp(s.step, 1, P - 1);
          const g = gcd(P, k);
          const visits = P / g;
          const R = 135;
          const cx = 360;
          const cy = 180;
          const pin = (i) => [cx + R * Math.sin((2 * Math.PI * i) / P), cy - R * Math.cos((2 * Math.PI * i) / P)];
          const path = Array.from({ length: visits + 1 }, (_, j) => (j * k) % P);
          const prog = seg(t, 0.05, 0.85) * visits;
          const full = Math.floor(prog);
          const pts = path.slice(0, full + 1).map(pin);
          if (full < visits) {
            const [ax, ay] = pin(path[full]);
            const [bx, by] = pin(path[full + 1]);
            const f = prog - full;
            pts.push([ax + (bx - ax) * f, ay + (by - ay) * f]);
          }
          const visited = new Set(path.slice(0, full + 1));
          return (
            <g>
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1e293b" strokeWidth="2" />
              <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={PINK} strokeWidth="2.2" strokeLinejoin="round" />
              {Array.from({ length: P }, (_, i) => {
                const [x, y] = pin(i);
                const [lx, ly] = [cx + (R + 18) * Math.sin((2 * Math.PI * i) / P), cy - (R + 18) * Math.cos((2 * Math.PI * i) / P)];
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="7" fill={visited.has(i) ? AMBER : '#334155'} stroke={visited.has(i) ? '#fef3c7' : '#475569'} strokeWidth="1.5" />
                    <text x={lx} y={ly + 4} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily={MONO}>{i}</text>
                  </g>
                );
              })}
              <text x="20" y="40" fill={INK} fontSize="15" fontWeight="900" fontFamily={SANS}>{P} nails, jump {k}</text>
              <text x="20" y="66" fill="#94a3b8" fontSize="13" fontFamily={SANS}>Nails visited:</text>
              <text x="20" y="104" fill={AMBER} fontSize="34" fontWeight="900" fontFamily={MONO}>{Math.min(visited.size, visits)} / {P}</text>
              <g opacity={seg(t, 0.85, 1)}>
                <text x="20" y="150" fill={g === 1 ? GREEN : PINK} fontSize="14" fontWeight="900" fontFamily={SANS}>{g === 1 ? 'Every nail visited!' : `Back to 0 after ${visits} nails`}</text>
                <text x="20" y="172" fill={g === 1 ? GREEN : PINK} fontSize="13" fontFamily={SANS}>{g === 1 ? `${P} and ${k} are co-prime` : `${P} and ${k} share the factor ${g}`}</text>
                <text x="20" y="194" fill="#94a3b8" fontSize="12" fontFamily={SANS}>HCF({P}, {k}) = {g}</text>
              </g>
            </g>
          );
        })()}
      </svg>
    </StoryStage>
  );
}

// ═══ WIDGET 6: HCF and LCM — listing, prime Venn, continued division, the ladder, timelines, HCF × LCM ═══
const parseClock = (str) => {
  if (!str) return null;
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};
const clockStr = (mins) => `${Math.floor(mins / 60) % 24}:${String(mins % 60).padStart(2, '0')}`;

export function Class6HcfLcmWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'list', kind: 'multiples', a: 12, b: 18, c: null, show: 'both', start: null, unit: 'min', labels: ['A', 'B', 'C'], task: null }, visual);
  const a = clamp(Math.round(s.a) || 1, 1, 9999);
  const b = clamp(Math.round(s.b) || 1, 1, 9999);
  const c = s.c ? clamp(Math.round(s.c), 1, 999) : null;
  const nums = c ? [a, b, c] : [a, b];
  const G = c ? gcd(gcd(a, b), c) : gcd(a, b);
  const Lm = c ? lcm(lcm(a, b), c) : lcm(a, b);
  const [guess, setGuess] = useState(1);
  useEffect(() => { setGuess(1); }, [s.task, a, b, c]);
  const done = s.task === 'lcm' && guess === Lm;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const t = useClock(`${s.mode}-${s.kind}-${a}-${b}-${c}-${s.show}`, s.mode === 'timeline' ? 2400 : 2200);
  const T = Lm * 2;

  const titles = {
    list: s.kind === 'factors' ? `Common factors of ${a} and ${b}` : `Common multiples of ${a} and ${b}`,
    prime: `Prime factors of ${a} and ${b}`,
    division: `Continued division: HCF of ${a} and ${b}`,
    ladder: `Division method: LCM of ${nums.join(', ')}`,
    timeline: `Every ${nums.join(', ')} ${s.unit === 's' ? 'seconds' : 'minutes'}: when together?`,
    product: 'HCF × LCM = product of the two numbers',
  };

  const footer = (
    <div className="space-y-3">
      <style>{KF}</style>
      <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'list', label: 'Listing' }, { value: 'prime', label: 'Prime factors' }, { value: 'division', label: 'Continued division' }, { value: 'ladder', label: 'LCM ladder' }, { value: 'timeline', label: 'Together when?' }, { value: 'product', label: 'HCF × LCM' }]} />
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        Numbers: <NumInput value={a} max={9999} onChange={(v) => update({ a: v })} />
        <NumInput value={b} max={9999} onChange={(v) => update({ b: v })} className="text-sky-300" />
        {s.mode === 'list' && <ModePills value={s.kind} onChange={(kind) => update({ kind })} options={[{ value: 'factors', label: 'Factors (HCF)' }, { value: 'multiples', label: 'Multiples (LCM)' }]} />}
        {s.mode === 'prime' && <ModePills value={s.show} onChange={(show) => update({ show })} options={[{ value: 'hcf', label: 'HCF' }, { value: 'lcm', label: 'LCM' }, { value: 'both', label: 'Both' }]} />}
      </div>
      {s.task === 'lcm' && (
        <div className="space-y-2">
          <TaskBanner text={`Your turn: slide the marker to the first time (after 0) when ${nums.length === 2 ? 'both' : 'all of them'} happen together.`} done={done} />
          <Slider label="Marker" value={guess} min={1} max={T} onChange={setGuess} tone={done ? 'text-emerald-300' : 'text-amber-300'} />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Readout label={`HCF(${nums.join(', ')})`} value={G} tone="text-emerald-300" />
        <Readout label={`LCM(${nums.join(', ')})`} value={s.task === 'lcm' && !done ? '?' : Lm} tone="text-pink-300" />
      </div>
    </div>
  );

  let body = null;
  if (s.mode === 'list') {
    const fac = s.kind === 'factors';
    const listOf = (n) => {
      if (fac) return factorsOf(n);
      const lim = Lm * (Lm / Math.max(a, b) > 5 ? 1 : 2);
      const out = [];
      for (let m = n; m <= lim && out.length < 12; m += n) out.push(m);
      return out;
    };
    const la = listOf(a);
    const lb = listOf(b);
    const uni = [...new Set([...la, ...lb])].sort((x, y) => x - y);
    const sp = Math.min(48, 540 / uni.length);
    const ux = (v) => 300 - ((uni.length - 1) * sp) / 2 + uni.indexOf(v) * sp;
    const common = la.filter((v) => lb.includes(v));
    const star = fac ? Math.max(...common) : Math.min(...common);
    const rr = Math.min(18, sp * 0.44);
    body = (
      <g>
        <text x="16" y="80" fill={AMBER} fontSize="13" fontWeight="900" fontFamily={SANS}>{fac ? 'factors' : 'multiples'} of {a}</text>
        <text x="16" y="250" fill={SKY} fontSize="13" fontWeight="900" fontFamily={SANS}>{fac ? 'factors' : 'multiples'} of {b}</text>
        {common.map((v, i) => (
          <g key={`l${v}`} opacity={seg(t, 0.45 + i * 0.05, 0.6 + i * 0.05)}>
            <line x1={ux(v)} y1={110 + rr} x2={ux(v)} y2={210 - rr} stroke={GREEN} strokeWidth="3" />
            <text x={ux(v) + 6} y="165" fill={GREEN} fontSize="12" fontWeight="900" fontFamily={SANS}>{v === star ? (fac ? 'HCF' : 'LCM') : ''}</text>
          </g>
        ))}
        {[[la, 110, AMBER], [lb, 210, SKY]].map(([list, y, col], r) => list.map((v, i) => {
          const isC = common.includes(v);
          return (
            <g key={`${r}-${v}`} style={{ ...POP, animation: `ptPop 350ms ease ${r * 350 + i * 55}ms both` }}>
              {v === star && <circle cx={ux(v)} cy={y} r={rr + 6} fill="none" stroke={GREEN} strokeWidth="2" style={{ animation: 'ptGlow 1.3s ease infinite' }} />}
              <circle cx={ux(v)} cy={y} r={rr} fill={isC ? 'rgba(52,211,153,0.25)' : '#0f172a'} stroke={isC ? GREEN : col} strokeWidth="2" />
              <text x={ux(v)} y={y + 5} textAnchor="middle" fill={isC ? GREEN : col} fontSize={v > 99 ? 11 : 14} fontWeight="900" fontFamily={MONO}>{v}</text>
            </g>
          );
        }))}
        <text x="300" y="300" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.65, 0.8)}>common {fac ? 'factors' : 'multiples'}: {common.join(', ')}{fac ? '' : ', …'}</text>
        <text x="300" y="334" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily={SANS} opacity={seg(t, 0.8, 0.95)}>{fac ? `Highest Common Factor = ${star}` : `Lowest Common Multiple = ${star}`}</text>
      </g>
    );
  } else if (s.mode === 'prime') {
    const [oa, cm, ob] = splitPrimes(a, b);
    const pa = primeFactors(a);
    const pb = primeFactors(b);
    const chip = (key, p, from, to, col, delay, hi) => {
      const k = ease(seg(t, delay, delay + 0.3));
      const x = from[0] + (to[0] - from[0]) * k;
      const y = from[1] + (to[1] - from[1]) * k;
      return (
        <g key={key}>
          <circle cx={x} cy={y} r="17" fill={hi ? `${col}44` : '#0f172a'} stroke={col} strokeWidth="2.5" />
          <text x={x} y={y + 6} textAnchor="middle" fill={col} fontSize="16" fontWeight="900" fontFamily={MONO}>{p}</text>
        </g>
      );
    };
    const stackY = (j, m) => 205 - ((m - 1) * 38) / 2 + j * 38;
    const gapA = Math.min(34, 150 / Math.max(pa.length, 1));
    const gapB = Math.min(34, 150 / Math.max(pb.length, 1));
    const fromA = (j) => [165 - ((pa.length - 1) * gapA) / 2 + j * gapA, 60];
    const fromB = (j) => [435 - ((pb.length - 1) * gapB) / 2 + j * gapB, 60];
    const usedA = [];
    const usedB = [];
    const findIdx = (arr, p, used) => { const i = arr.findIndex((q, k) => q === p && !used.includes(k)); used.push(i); return i; };
    const showH = s.show === 'hcf' || s.show === 'both';
    const showL = s.show === 'lcm' || s.show === 'both';
    body = (
      <g>
        <text x="165" y="30" textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily={MONO}>{a} = {times(pa)}</text>
        <text x="435" y="30" textAnchor="middle" fill={SKY} fontSize="15" fontWeight="900" fontFamily={MONO}>{b} = {times(pb)}</text>
        <circle cx="228" cy="205" r="105" fill={AMBER} fillOpacity={showL ? 0.1 : 0.04} stroke={AMBER} strokeWidth="2" />
        <circle cx="372" cy="205" r="105" fill={SKY} fillOpacity={showL ? 0.1 : 0.04} stroke={SKY} strokeWidth="2" />
        {showH && <ellipse cx="300" cy="205" rx="30" ry="70" fill={GREEN} fillOpacity="0.18" style={{ animation: 'ptGlow 1.6s ease infinite' }} />}
        <text x="165" y="92" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800" fontFamily={SANS}>only in {a}</text>
        <text x="435" y="92" textAnchor="middle" fill={SKY} fontSize="12" fontWeight="800" fontFamily={SANS}>only in {b}</text>
        <text x="300" y="92" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="800" fontFamily={SANS}>common</text>
        {oa.map((p, j) => chip(`oa${j}`, p, fromA(findIdx(pa, p, usedA)), [165, stackY(j, oa.length)], AMBER, 0.05 + j * 0.06, showL))}
        {cm.map((p, j) => chip(`cmA${j}`, p, fromA(findIdx(pa, p, usedA)), [300, stackY(j, cm.length)], GREEN, 0.15 + j * 0.06, showH || showL))}
        {ob.map((p, j) => chip(`ob${j}`, p, fromB(findIdx(pb, p, usedB)), [435, stackY(j, ob.length)], SKY, 0.25 + j * 0.06, showL))}
        {cm.map((p, j) => {
          // b's copy of each common prime merges into the same middle chip
          const from = fromB(findIdx(pb, p, usedB));
          const k = ease(seg(t, 0.35 + j * 0.06, 0.6 + j * 0.06));
          const to = [300, stackY(j, cm.length)];
          return <circle key={`cmB${j}`} cx={from[0] + (to[0] - from[0]) * k} cy={from[1] + (to[1] - from[1]) * k} r="17" fill="none" stroke={SKY} strokeWidth="2" opacity={1 - k * 0.9} />;
        })}
        {showH && <text x={s.show === 'both' ? 150 : 300} y="342" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.7, 0.85)}>HCF = {times(cm)} = {product(cm)}</text>}
        {showL && <text x={s.show === 'both' ? 440 : 300} y="342" textAnchor="middle" fill={PINK} fontSize="16" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.8, 0.95)}>LCM = {times([...oa, ...cm, ...ob].sort((x, y) => x - y))} = {product([...oa, ...cm, ...ob])}</text>}
      </g>
    );
  } else if (s.mode === 'division') {
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    const sc = Math.min(330 / big, 250 / small);
    const squares = [];
    const steps = [];
    let w = big;
    let h = small;
    let x = 0;
    let y = 0;
    let si = 0;
    let guard = 0;
    while (w > 0 && h > 0 && guard < 30) {
      guard += 1;
      if (w >= h) {
        const q = Math.floor(w / h);
        steps.push([w, q, h, w - q * h]);
        for (let i = 0; i < q && squares.length < 60; i++) squares.push({ x: x + i * h, y, side: h, step: si });
        x += q * h;
        w -= q * h;
      } else {
        const q = Math.floor(h / w);
        steps.push([h, q, w, h - q * w]);
        for (let i = 0; i < q && squares.length < 60; i++) squares.push({ x, y: y + i * w, side: w, step: si });
        y += q * w;
        h -= q * w;
      }
      si += 1;
    }
    const nS = squares.length;
    const cols = [AMBER, SKY, PINK, PURPLE, '#fb923c', '#2dd4bf', RED];
    const ox = 20;
    const oy = 50;
    body = (
      <g>
        <text x={ox} y="36" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>{big} × {small} rectangle: cut off the biggest squares</text>
        <rect x={ox} y={oy} width={big * sc} height={small * sc} fill="none" stroke={INK} strokeWidth="2" />
        {squares.map((q, i) => {
          const p = seg(t, (i / nS) * 0.7, (i / nS) * 0.7 + 0.08);
          const last = q.step === steps.length - 1;
          return (
            <g key={i} opacity={p}>
              <rect x={ox + q.x * sc + 1} y={oy + q.y * sc + 1} width={Math.max(q.side * sc - 2, 1)} height={Math.max(q.side * sc - 2, 1)} fill={last ? GREEN : cols[q.step % cols.length]} fillOpacity={last ? 0.5 : 0.28} stroke={last ? GREEN : cols[q.step % cols.length]} strokeWidth="1.5" />
              {q.side * sc > 34 && <text x={ox + (q.x + q.side / 2) * sc} y={oy + (q.y + q.side / 2) * sc + 5} textAnchor="middle" fill={INK} fontSize="12" fontWeight="800" fontFamily={MONO}>{q.side}</text>}
            </g>
          );
        })}
        {steps.map(([dd, q, dv, r], i) => {
          const firstSq = squares.findIndex((qq) => qq.step === i);
          const p = seg(t, (Math.max(firstSq, 0) / nS) * 0.7, (Math.max(firstSq, 0) / nS) * 0.7 + 0.1);
          return (
            <text key={i} x="370" y={70 + i * 28} fill={r === 0 ? GREEN : cols[i % cols.length]} fontSize={steps.length > 6 ? 12 : 14} fontWeight="800" fontFamily={MONO} opacity={p}>
              {dd} = {q} × {dv} + {r}
            </text>
          );
        })}
        <text x="370" y={Math.min(330, 90 + steps.length * 28)} fill={GREEN} fontSize="20" fontWeight="900" fontFamily={SANS} opacity={seg(t, 0.82, 0.95)}>HCF = {G}</text>
        <text x={ox} y="340" fill="#94a3b8" fontSize="12" fontFamily={SANS} opacity={seg(t, 0.85, 1)}>The last square ({G} × {G}) tiles the whole rectangle exactly.</text>
      </g>
    );
  } else if (s.mode === 'ladder') {
    const rows = [];
    let vals = [...nums];
    let guard = 0;
    while (vals.some((v) => v > 1) && guard < 12) {
      guard += 1;
      let p = 2;
      while (!vals.some((v) => v % p === 0)) p += 1;
      rows.push({ p, vals: [...vals] });
      vals = vals.map((v) => (v % p === 0 ? v / p : v));
    }
    rows.push({ p: null, vals });
    const cw = 70;
    const rh = Math.min(40, 250 / rows.length);
    const x0 = 300 - ((nums.length + 1) * cw) / 2;
    const divs = rows.filter((r) => r.p).map((r) => r.p);
    body = (
      <g>
        {rows.map((r, i) => {
          const p = seg(t, i * (0.7 / rows.length), i * (0.7 / rows.length) + 0.12);
          const y = 30 + i * rh;
          return (
            <g key={i} opacity={p} transform={`translate(${(1 - p) * -20} 0)`}>
              {r.p && <text x={x0 + cw / 2} y={y + rh * 0.68} textAnchor="middle" fill={PINK} fontSize="20" fontWeight="900" fontFamily={MONO}>{r.p}</text>}
              {r.p && <line x1={x0 + cw - 6} y1={y + 4} x2={x0 + cw - 6} y2={y + rh} stroke="#64748b" strokeWidth="2" />}
              {r.p && <line x1={x0 + cw - 6} y1={y + rh} x2={x0 + (nums.length + 1) * cw} y2={y + rh} stroke="#64748b" strokeWidth="2" />}
              {r.vals.map((v, j) => {
                const divides = r.p && v % r.p === 0;
                return <text key={j} x={x0 + (j + 1.5) * cw} y={y + rh * 0.68} textAnchor="middle" fill={r.p ? (divides ? INK : '#64748b') : GREEN} fontSize="20" fontWeight="900" fontFamily={MONO}>{v}</text>;
              })}
            </g>
          );
        })}
        <text x="300" y="306" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily={SANS} opacity={seg(t, 0.7, 0.8)}>Divide by a prime that divides at least one number; carry the others down unchanged.</text>
        <text x="300" y="338" textAnchor="middle" fill={PINK} fontSize="20" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.8, 0.95)}>LCM = {times(divs)} = {Lm}</text>
      </g>
    );
  } else if (s.mode === 'timeline') {
    const sc = 530 / T;
    const X = (v) => 40 + v * sc;
    const sweep = s.task ? T : t * T;
    const startMin = parseClock(s.start);
    const fmtT = (v) => (startMin !== null ? clockStr(startMin + v) : `${v} ${s.unit === 's' ? 's' : 'min'}`);
    const trackY = nums.map((_, i) => 90 + i * (c ? 66 : 84));
    const colors = [AMBER, SKY, PINK];
    const showTogether = !s.task || done;
    body = (
      <g>
        {nums.map((n, i) => {
          const marks = Array.from({ length: Math.floor(T / n) + 1 }, (_, k) => k * n);
          const spacing = n * sc;
          return (
            <g key={i}>
              <text x="40" y={trackY[i] - 22} fill={colors[i]} fontSize="13" fontWeight="900" fontFamily={SANS}>{(s.labels || [])[i] || `Event ${i + 1}`}: every {n} {s.unit === 's' ? 'seconds' : 'minutes'}</text>
              <line x1={X(0)} y1={trackY[i]} x2={X(T)} y2={trackY[i]} stroke="#334155" strokeWidth="2" />
              {marks.map((m) => {
                const on = m <= sweep;
                const ring = clamp((sweep - m) / (T * 0.06), 0, 1);
                return (
                  <g key={m}>
                    {on && ring < 1 && !s.task && <circle cx={X(m)} cy={trackY[i]} r={8 + ring * 14} fill="none" stroke={colors[i]} strokeWidth="2" opacity={1 - ring} />}
                    <circle cx={X(m)} cy={trackY[i]} r="7" fill={on ? colors[i] : '#1e293b'} stroke={colors[i]} strokeWidth="1.5" />
                    {spacing >= 30 && <text x={X(m)} y={trackY[i] + 22} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily={MONO}>{m}</text>}
                  </g>
                );
              })}
            </g>
          );
        })}
        {showTogether && [Lm, 2 * Lm].map((m) => (
          <g key={`tg${m}`} opacity={m <= sweep ? 1 : 0} style={{ transition: 'opacity 300ms' }}>
            <rect x={X(m) - 16} y={trackY[0] - 16} width="32" height={trackY[nums.length - 1] - trackY[0] + 32} rx="12" fill={GREEN} fillOpacity="0.12" stroke={GREEN} strokeWidth="2" />
            <text x={m === T ? X(m) - 20 : X(m)} y={trackY[nums.length - 1] + 50} textAnchor={m === T ? 'end' : 'middle'} fill={GREEN} fontSize="15" fontWeight="900" fontFamily={SANS}>together at {fmtT(m)}</text>
          </g>
        ))}
        {!s.task && <line x1={X(sweep)} y1="50" x2={X(sweep)} y2={trackY[nums.length - 1] + 20} stroke={INK} strokeWidth="1.5" strokeDasharray="4 4" opacity={t < 1 ? 0.8 : 0} />}
        {s.task && (
          <g style={{ transform: `translateX(${X(guess)}px)`, transition: 'transform 200ms' }}>
            <line x1="0" y1={trackY[0] - 12} x2="0" y2={trackY[nums.length - 1] + 30} stroke={done ? GREEN : INK} strokeWidth="2.5" strokeDasharray="6 4" />
            {!done && <rect x="-22" y={trackY[nums.length - 1] + 32} width="44" height="24" rx="8" fill={INK} />}
            {!done && <text x="0" y={trackY[nums.length - 1] + 49} textAnchor="middle" fill="#020617" fontSize="14" fontWeight="900" fontFamily={MONO}>{guess}</text>}
          </g>
        )}
        {startMin !== null && <text x={X(0)} y="340" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily={MONO}>{fmtT(0)}</text>}
        <text x="560" y="340" textAnchor="end" fill={showTogether ? GREEN : '#94a3b8'} fontSize="14" fontWeight="900" fontFamily={SANS} opacity={s.task ? 1 : seg(t, 0.6, 0.8)}>{showTogether ? `LCM(${nums.join(', ')}) = ${Lm}` : 'Find the first time all ring together'}</text>
      </g>
    );
  } else if (s.mode === 'product') {
    const [oa, cm, ob] = splitPrimes(a, b);
    const pa = [...cm, ...oa];
    const pb = [...cm, ...ob];
    const H0 = product(cm);
    const L0 = product([...oa, ...cm, ...ob]);
    const box = (cx, y, list) => list.map((_, j) => [cx + (j - (list.length - 1) / 2) * 38, y]);
    const topA = box(150, 110, pa);
    const topB = box(450, 110, pb);
    const hcfPos = box(150, 260, cm);
    const lcmPos = box(430, 260, [...cm, ...oa, ...ob]);
    // a's chips all go to the LCM group; b's common chips go to the HCF group, b's other chips join the LCM group
    const moves = [
      ...pa.map((p, j) => ({ p, from: topA[j], to: lcmPos[j < cm.length ? j : j], col: AMBER, d: 0.1 + j * 0.05 })),
      ...pb.map((p, j) => ({ p, from: topB[j], to: j < cm.length ? hcfPos[j] : lcmPos[cm.length + oa.length + (j - cm.length)], col: SKY, d: 0.35 + j * 0.05 })),
    ];
    return (
      <StoryStage eyebrow="Visualizer · HCF and LCM" title={titles.product} footer={footer}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
          <rect width={W} height={H} fill="#020617" />
          <text x="300" y="36" textAnchor="middle" fill={INK} fontSize="20" fontWeight="900" fontFamily={MONO}>{a} × {b} = {a * b}</text>
          <text x="150" y="76" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="800" fontFamily={MONO}>{a} = {times(primeFactors(a))}</text>
          <text x="450" y="76" textAnchor="middle" fill={SKY} fontSize="14" fontWeight="800" fontFamily={MONO}>{b} = {times(primeFactors(b))}</text>
          {topA.concat(topB).map(([x, y], i) => <circle key={`g${i}`} cx={x} cy={y} r="17" fill="none" stroke="#334155" strokeDasharray="3 3" />)}
          <text x="300" y="185" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily={SANS} opacity={seg(t, 0.1, 0.3)}>the same prime chips, regrouped</text>
          <rect x={150 - Math.max(cm.length, 1) * 22 - 6} y="236" width={Math.max(cm.length, 1) * 44 + 12} height="48" rx="12" fill="none" stroke={GREEN} strokeWidth="2" opacity={seg(t, 0.5, 0.7)} />
          <rect x={430 - (cm.length + oa.length + ob.length) * 19 - 8} y="236" width={(cm.length + oa.length + ob.length) * 38 + 16} height="48" rx="12" fill="none" stroke={PINK} strokeWidth="2" opacity={seg(t, 0.5, 0.7)} />
          <text x="150" y="304" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.6, 0.8)}>HCF = {H0}</text>
          <text x="430" y="304" textAnchor="middle" fill={PINK} fontSize="14" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.6, 0.8)}>LCM = {L0}</text>
          {moves.map((m, i) => {
            const k = ease(seg(t, m.d, m.d + 0.3));
            const x = m.from[0] + (m.to[0] - m.from[0]) * k;
            const y = m.from[1] + (m.to[1] - m.from[1]) * k;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="17" fill="#0f172a" stroke={m.col} strokeWidth="2.5" />
                <text x={x} y={y + 6} textAnchor="middle" fill={m.col} fontSize="16" fontWeight="900" fontFamily={MONO}>{m.p}</text>
              </g>
            );
          })}
          <text x="300" y="344" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily={MONO} opacity={seg(t, 0.8, 0.95)}>{H0} × {L0} = {H0 * L0} ✓</text>
        </svg>
      </StoryStage>
    );
  }


  return (
    <StoryStage eyebrow="Visualizer · HCF and LCM" title={titles[s.mode]} footer={footer}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {body}
      </svg>
    </StoryStage>
  );
}
