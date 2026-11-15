import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Real Numbers — scene-driven story widgets.
// Fundamental Theorem of Arithmetic, HCF and LCM by prime factorisation, and irrationality proofs.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const int = (v, lo, hi, dflt) => clamp(Math.round(Number(v)) || dflt, lo, hi);
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const prod = (arr) => arr.reduce((x, y) => x * y, 1);
const fmt = (n) => Number(n).toLocaleString('en-IN');
const isPrime = (n) => {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
};
const factorize = (n) => {
  const f = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; }
  if (m > 1) f.push(m);
  return f;
};
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (e) => (e === 1 ? '' : String(e).split('').map((d) => SUP[+d]).join(''));
const powForm = (f) => {
  if (!f.length) return '1';
  const counts = [];
  f.forEach((p) => {
    const last = counts[counts.length - 1];
    if (last && last.p === p) last.e += 1; else counts.push({ p, e: 1 });
  });
  return counts.map(({ p, e }) => `${p}${sup(e)}`).join(' × ');
};
// multiset intersection of two sorted prime lists
const common = (a, b) => {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { out.push(a[i]); i++; j++; } else if (a[i] < b[j]) i++; else j++;
  }
  return out;
};
const minus = (a, c) => {
  const rest = [...a];
  c.forEach((p) => { const k = rest.indexOf(p); if (k >= 0) rest.splice(k, 1); });
  return rest;
};
const PCOL = { 2: SKY, 3: AMBER, 5: GREEN, 7: PINK, 11: PURPLE, 13: RED };
const pcol = (p) => PCOL[p] || '#94a3b8';
const ANIM = '@keyframes rnPop { from { opacity: 0; transform: scale(0.6) } to { opacity: 1; transform: none } } @keyframes rnFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';
const pop = (delay = 0) => ({ animation: `rnPop 500ms ease ${delay}ms both`, transformBox: 'fill-box', transformOrigin: 'center' });
const fade = (delay = 0) => ({ animation: `rnFade 500ms ease ${delay}ms both` });

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

function Slider({ label, value, min, max, onChange, step = 1 }) {
  return (
    <label className="block text-xs text-slate-400 flex-1 min-w-[140px]">
      {label}: <span className="text-amber-300 font-mono font-bold">{value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function NumBox({ label, value, onChange, min = 2, max = 9999 }) {
  return (
    <label className="text-xs text-slate-400 flex items-center gap-2">
      {label}
      <input type="number" min={min} max={max} value={value}
        onChange={(e) => onChange(clamp(Math.round(+e.target.value) || min, min, max))}
        className="w-24 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-200 font-mono font-bold" />
    </label>
  );
}

function Chip({ x, y, p, r = 15, dim = false, ring = false, delay = 0 }) {
  return (
    <g style={pop(delay)}>
      {ring && <circle cx={x} cy={y} r={r + 5} fill="none" stroke={GREEN} strokeWidth="2.5" strokeDasharray="4 3" />}
      <circle cx={x} cy={y} r={r} fill={dim ? '#334155' : pcol(p)} opacity={dim ? 0.7 : 0.9} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={p > 99 ? 11 : 14} fontWeight="900" fill="#020617" fontFamily="monospace">{p}</text>
    </g>
  );
}

function TreeNode({ x, y, v, prime, delay = 0 }) {
  const w = String(v).length * 11 + 18;
  return (
    <g style={pop(delay)}>
      {prime
        ? <circle cx={x} cy={y} r={17} fill={pcol(v)} opacity="0.9" />
        : <rect x={x - w / 2} y={y - 14} width={w} height={28} rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />}
      <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="900" fill={prime ? '#020617' : INK} fontFamily="monospace">{v}</text>
    </g>
  );
}

// ─── WIDGET 1: Factor tree · every composite number is a product of primes ───
const SAMPLES = [140, 156, 3825, 32760];
const PICKS = [2, 3, 5, 7, 11, 13, 17];

export function Class10RealNumFactorTreeWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'tree', n: 140, steps: 99, picks: null, task: null }, visual);
  const [flash, setFlash] = useState(null);
  const mode = s.mode === 'two' ? 'two' : 'tree';
  const n = int(s.n, 4, 99999, 140);
  const full = factorize(n);
  const picks = Array.isArray(s.picks) ? s.picks : null;
  const P = picks || full.slice(0, clamp(int(s.steps, 0, 99, 99), 0, Math.max(0, full.length - 1)));
  const rem = n / prod(P);
  const finished = isPrime(rem);
  const task = s.task && s.task.n ? s.task : null;
  const done = !!task && mode === 'tree' && n === task.n && finished;
  useDone(done, onInteract);

  const pick = (p) => {
    if (finished) return;
    if (rem % p !== 0) { setFlash(p); setTimeout(() => setFlash(null), 700); return; }
    update({ picks: [...P, p] });
  };

  let picture;
  if (mode === 'two') {
    const A = { x: 160 };
    const B = { x: 440 };
    const line = (x1, y1, x2, y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />;
    picture = (
      <>
        <text x={300} y={30} textAnchor="middle" fill={INK} fontSize="16" fontWeight="800">Two different trees for 60</text>
        {line(A.x, 70, A.x - 50, 125)}{line(A.x, 70, A.x + 40, 125)}
        {line(A.x + 40, 125, A.x - 10, 180)}{line(A.x + 40, 125, A.x + 80, 180)}
        {line(A.x + 80, 180, A.x + 40, 235)}{line(A.x + 80, 180, A.x + 120, 235)}
        <TreeNode x={A.x} y={70} v={60} />
        <TreeNode x={A.x - 50} y={125} v={2} prime delay={150} />
        <TreeNode x={A.x + 40} y={125} v={30} delay={150} />
        <TreeNode x={A.x - 10} y={180} v={2} prime delay={300} />
        <TreeNode x={A.x + 80} y={180} v={15} delay={300} />
        <TreeNode x={A.x + 40} y={235} v={3} prime delay={450} />
        <TreeNode x={A.x + 120} y={235} v={5} prime delay={450} />
        {line(B.x, 70, B.x - 60, 125)}{line(B.x, 70, B.x + 60, 125)}
        {line(B.x - 60, 125, B.x - 95, 180)}{line(B.x - 60, 125, B.x - 25, 180)}
        {line(B.x + 60, 125, B.x + 25, 180)}{line(B.x + 60, 125, B.x + 95, 180)}
        <TreeNode x={B.x} y={70} v={60} delay={600} />
        <TreeNode x={B.x - 60} y={125} v={6} delay={750} />
        <TreeNode x={B.x + 60} y={125} v={10} delay={750} />
        <TreeNode x={B.x - 95} y={180} v={2} prime delay={900} />
        <TreeNode x={B.x - 25} y={180} v={3} prime delay={900} />
        <TreeNode x={B.x + 25} y={180} v={2} prime delay={900} />
        <TreeNode x={B.x + 95} y={180} v={5} prime delay={900} />
        <g style={fade(1200)}>
          <text x={300} y={300} textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">60 = 2² × 3 × 5</text>
          <text x={300} y={330} textAnchor="middle" fill="#94a3b8" fontSize="14">Different paths, the same primes: the factorisation is unique</text>
        </g>
      </>
    );
  } else {
    const nodes = [];
    const lines = [];
    let v = n;
    const X = (i) => 250 + i * 36;
    const Y = (i) => 36 + i * 38;
    P.forEach((p, i) => {
      lines.push(<line key={`a${i}`} x1={X(i)} y1={Y(i)} x2={X(i) - 46} y2={Y(i + 1)} stroke="#64748b" strokeWidth="2" style={fade(i * 120)} />);
      lines.push(<line key={`b${i}`} x1={X(i)} y1={Y(i)} x2={X(i + 1)} y2={Y(i + 1)} stroke="#64748b" strokeWidth="2" style={fade(i * 120)} />);
      nodes.push(<TreeNode key={`n${i}-${v}`} x={X(i)} y={Y(i)} v={v} delay={i * 120} />);
      nodes.push(<TreeNode key={`p${i}-${p}`} x={X(i) - 46} y={Y(i + 1)} v={p} prime delay={i * 120 + 100} />);
      v /= p;
    });
    nodes.push(<TreeNode key={`last${P.length}-${v}`} x={X(P.length)} y={Y(P.length)} v={v} prime={finished} delay={P.length * 120 + 100} />);
    const leaves = finished ? [...P, rem] : P;
    picture = (
      <>
        {lines}{nodes}
        <text x={24} y={40} fill="#94a3b8" fontSize="13" fontWeight="700">Circles = primes</text>
        <text x={24} y={60} fill="#94a3b8" fontSize="13" fontWeight="700">Boxes = still composite</text>
        {!finished && <text x={24} y={90} fill={AMBER} fontSize="14" fontWeight="800">Left to split: {fmt(rem)}</text>}
        {finished && (
          <g key={`res${n}-${leaves.join('.')}`} style={fade(P.length * 120 + 250)}>
            <text x={300} y={344} textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">{fmt(n)} = {powForm([...leaves].sort((a, b) => a - b))}</text>
          </g>
        )}
      </>
    );
  }

  return (
    <StoryStage eyebrow="Visualizer · Fundamental Theorem of Arithmetic" title={mode === 'two' ? 'One number, one set of primes' : `Factor tree of ${fmt(n)}`}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? `Your turn: split ${fmt(task.n)} into primes. Tap a prime that divides the box.` : ''} done={done} />
          <ModePills options={[{ value: 'tree', label: 'Factor tree' }, { value: 'two', label: 'Two trees for 60' }]} value={mode} onChange={(m) => update({ mode: m })} />
          {mode === 'tree' && (
            <>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400">Divide by:</span>
                {PICKS.map((p) => (
                  <button key={p} onClick={() => pick(p)}
                    className={`w-9 h-9 rounded-full text-sm font-black transition ${flash === p ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'}`}>{p}</button>
                ))}
                <button onClick={() => update({ picks: [] })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">Start again</button>
              </div>
              {!task && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-400">Number:</span>
                  {SAMPLES.map((v) => (
                    <button key={v} onClick={() => update({ n: v, picks: null, steps: 99 })} className={`px-3 py-1 rounded-full text-xs font-bold border ${v === n ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}>{fmt(v)}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Can b to the power n end in zero? Needs both a 2 and a 5 ───
export function Class10RealNumPowerZeroWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ base: 4, n: 3, task: null }, visual);
  const base = int(s.base, 2, 15, 4);
  const n = int(s.n, 1, 6, 3);
  const value = base ** n;
  const fb = factorize(base);
  const all = Array.from({ length: n }, () => fb).flat();
  const c2 = all.filter((p) => p === 2).length;
  const c5 = all.filter((p) => p === 5).length;
  const zeros = Math.min(c2, c5);
  const task = s.task && s.task.zero ? s.task : null;
  const done = !!task && value % 10 === 0;
  useDone(done, onInteract);
  const str = String(value);
  const tz = (str.match(/0+$/) || [''])[0].length;
  let used2 = 0;
  let used5 = 0;

  return (
    <StoryStage eyebrow="Visualizer · Which numbers end in zero?" title={`${base} to the power ${n}`}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? 'Your turn: pick a base and a power so that the answer ends in 0.' : ''} done={done} />
          <div className="flex flex-wrap gap-4">
            <Slider label="Base" value={base} min={2} max={15} onChange={(v) => update({ base: v })} />
            <Slider label="Power" value={n} min={1} max={6} onChange={(v) => update({ n: v })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Readout label="2s" value={c2} tone="text-sky-400" />
            <Readout label="5s" value={c5} tone="text-emerald-400" />
            <Readout label="Ends in 0?" value={zeros > 0 ? 'Yes' : 'No'} tone={zeros > 0 ? 'text-emerald-400' : 'text-red-400'} />
          </div>
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x={30} y={34} fill="#94a3b8" fontSize="14" fontWeight="700">Prime factors, {n} copies of {base} = {powForm(fb)}</text>
        {Array.from({ length: n }, (_, r) => (
          <g key={`row${base}-${r}`}>
            <text x={30} y={78 + r * 42} fill="#64748b" fontSize="14" fontFamily="monospace">{base}</text>
            {fb.map((p, c) => {
              let ring = false;
              if (p === 2 && used2 < zeros) { used2 += 1; ring = true; }
              if (p === 5 && used5 < zeros) { used5 += 1; ring = true; }
              return <Chip key={`${base}-${r}-${c}`} x={85 + c * 40} y={73 + r * 42} p={p} ring={ring} delay={(r * fb.length + c) * 70} />;
            })}
          </g>
        ))}
        <line x1={250} y1={50} x2={250} y2={330} stroke="#1e293b" strokeWidth="2" />
        <text x={420} y={90} textAnchor="middle" fill="#94a3b8" fontSize="15">{base} to the power {n} =</text>
        <text key={value} x={420} y={150} textAnchor="middle" fontSize={str.length > 8 ? 34 : 44} fontWeight="900" fontFamily="monospace" style={fade(200)}>
          <tspan fill={INK}>{tz ? str.slice(0, -tz) : str}</tspan>
          {tz > 0 && <tspan fill={GREEN}>{str.slice(-tz)}</tspan>}
        </text>
        <text x={420} y={205} textAnchor="middle" fill={zeros ? GREEN : RED} fontSize="17" fontWeight="800">
          {zeros ? `${zeros} pair${zeros > 1 ? 's' : ''} of 2 and 5 = ${zeros} zero${zeros > 1 ? 's' : ''}` : (c5 === 0 ? 'No 5 in the factors' : 'No 2 in the factors')}
        </text>
        <text x={420} y={240} textAnchor="middle" fill="#94a3b8" fontSize="14">A number ends in 0 only if</text>
        <text x={420} y={262} textAnchor="middle" fill="#94a3b8" fontSize="14">10 = 2 × 5 divides it</text>
        <text x={420} y={300} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="700">Primes of a power = primes of the base</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: HCF and LCM by prime factorisation (Venn diagram) ───
function placeChips(list, x0, cols, y0, keyp) {
  return list.map((p, i) => <Chip key={`${keyp}${i}-${p}`} x={x0 + (i % cols) * 34} y={y0 + Math.floor(i / cols) * 34} p={p} delay={i * 80} />);
}

export function Class10RealNumHcfLcmWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 6, b: 20, showProduct: false, task: null }, visual);
  const a = int(s.a, 2, 9999, 6);
  const b = int(s.b, 2, 9999, 20);
  const fa = factorize(a);
  const fb = factorize(b);
  const c = common(fa, fb);
  const oa = minus(fa, c);
  const ob = minus(fb, c);
  const H = gcd(a, b);
  const Lm = lcm(a, b);
  const task = s.task && s.task.hcf ? s.task : null;
  const done = !!task && H === task.hcf && a !== b && a !== task.hcf && b !== task.hcf;
  useDone(done, onInteract);
  const colsFor = (k) => (k > 6 ? 3 : 2);
  const yStart = (k, cols) => 175 - ((Math.ceil(k / cols) - 1) * 34) / 2;

  return (
    <StoryStage eyebrow="Visualizer · HCF and LCM by prime factorisation" title={`HCF and LCM of ${fmt(a)} and ${fmt(b)}`}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? `Your turn: choose two different numbers (not ${task.hcf} itself) whose HCF is ${task.hcf}.` : ''} done={done} />
          <div className="flex flex-wrap gap-4 items-center">
            <NumBox label="First number" value={a} onChange={(v) => update({ a: v })} />
            <NumBox label="Second number" value={b} onChange={(v) => update({ b: v })} />
            <button onClick={() => update({ showProduct: !s.showProduct })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">{s.showProduct ? 'Hide' : 'Show'} the product check</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Readout label="HCF" value={fmt(H)} tone="text-amber-300" />
            <Readout label="LCM" value={fmt(Lm)} tone="text-sky-300" />
            {s.showProduct && <Readout label="HCF × LCM" value={fmt(H * Lm)} />}
            {s.showProduct && <Readout label="a × b" value={fmt(a * b)} />}
          </div>
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x={170} y={30} textAnchor="middle" fill={PINK} fontSize="16" fontWeight="900" fontFamily="monospace">{fmt(a)} = {powForm(fa)}</text>
        <text x={430} y={30} textAnchor="middle" fill={PURPLE} fontSize="16" fontWeight="900" fontFamily="monospace">{fmt(b)} = {powForm(fb)}</text>
        <circle cx={220} cy={175} r={125} fill={PINK} fillOpacity="0.08" stroke={PINK} strokeWidth="2.5" />
        <circle cx={380} cy={175} r={125} fill={PURPLE} fillOpacity="0.08" stroke={PURPLE} strokeWidth="2.5" />
        <text x={300} y={70} textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800">common</text>
        <g key={`v${a}-${b}`}>
          {placeChips(oa, 135, colsFor(oa.length), yStart(oa.length, colsFor(oa.length)), 'a')}
          {placeChips(c, 300 - (c.length > 1 ? 17 : 0), c.length > 1 ? 2 : 1, yStart(c.length, c.length > 1 ? 2 : 1), 'c')}
          {placeChips(ob, 400, colsFor(ob.length), yStart(ob.length, colsFor(ob.length)), 'b')}
        </g>
        <text x={300} y={322} textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="800" fontFamily="monospace">HCF = middle = {powForm(c)} = {fmt(H)}</text>
        <text x={300} y={346} textAnchor="middle" fill={SKY} fontSize="15" fontWeight="800" fontFamily="monospace">LCM = everything = {fmt(Lm)}</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: When do they meet again (LCM)? Biggest equal box (HCF) ───
export function Class10RealNumMeetWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'lcm', a: 18, b: 24, c: 0, x: 144, y: 180, d: 12, task: null }, visual);
  const mode = s.mode === 'hcf' ? 'hcf' : 'lcm';
  const a = int(s.a, 2, 40, 18);
  const b = int(s.b, 2, 40, 24);
  const c = clamp(Math.round(Number(s.c)) || 0, 0, 40);
  const ints = c >= 2 ? [a, b, c] : [a, b];
  const L = ints.reduce(lcm);
  const t = useTween(mode === 'lcm' ? L : 0, 1800);
  const x = int(s.x, 2, 400, 144);
  const y = int(s.y, 2, 400, 180);
  const d = int(s.d, 1, 60, 12);
  const H = gcd(x, y);
  const task = s.task || null;
  const done = !!task && (mode === 'lcm' ? (task.lcm && L === task.lcm && a !== b) : (task.hcf && d === H));
  useDone(done, onInteract);

  let picture;
  if (mode === 'lcm') {
    const R = Math.ceil(L * 1.15);
    const sx = (v) => 70 + (v / R) * 500;
    const cols = [PINK, SKY, GREEN];
    const names = s.names || ['Train A', 'Train B', 'Train C'];
    picture = (
      <>
        <line x1={sx(0)} y1={300} x2={sx(R)} y2={300} stroke="#475569" strokeWidth="2" />
        {[0, L].map((v) => <text key={v} x={sx(v)} y={322} textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="monospace">{v}</text>)}
        <text x={sx(R)} y={322} textAnchor="end" fill="#64748b" fontSize="12">minutes</text>
        {ints.map((iv, k) => {
          const yy = 80 + k * 70;
          const ticks = Array.from({ length: Math.floor(R / iv) + 1 }, (_, i) => i * iv);
          return (
            <g key={`lane${k}-${iv}`}>
              <text x={10} y={yy + 5} fill={cols[k]} fontSize="12" fontWeight="800">{names[k]}</text>
              <text x={10} y={yy + 21} fill="#94a3b8" fontSize="11">every {iv}</text>
              <line x1={sx(0)} y1={yy} x2={sx(R)} y2={yy} stroke="#1e293b" strokeWidth="2" />
              {ticks.map((v) => (
                <circle key={v} cx={sx(v)} cy={yy} r={v === L ? 9 : 5} fill={cols[k]} opacity={v <= t + 0.01 ? 1 : 0.15} />
              ))}
            </g>
          );
        })}
        <line x1={sx(t)} y1={55} x2={sx(t)} y2={300} stroke={AMBER} strokeWidth="2" strokeDasharray="5 4" />
        {t > L - 0.5 && (
          <g style={fade(0)}>
            <rect x={sx(L) - 85} y={20} width={170} height={28} rx="8" fill="#422006" stroke={AMBER} />
            <text x={sx(L)} y={39} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900">Together at {L} min</text>
          </g>
        )}
      </>
    );
  } else {
    const scale = 500 / Math.max(x, y);
    const strip = (len, yy, color, label) => {
      const pieces = Math.floor(len / d);
      const left = len - pieces * d;
      return (
        <g>
          <text x={50} y={yy - 10} fill={color} fontSize="14" fontWeight="800">{label}: {len}</text>
          {Array.from({ length: pieces }, (_, i) => (
            <rect key={`${d}-${i}`} x={50 + i * d * scale} y={yy} width={Math.max(1, d * scale - 2)} height={40} rx="4" fill={color} opacity="0.75" style={fade(Math.min(i, 40) * 15)} />
          ))}
          {left > 0 && <rect x={50 + pieces * d * scale} y={yy} width={left * scale} height={40} rx="4" fill={RED} opacity="0.85" />}
          <text x={50} y={yy + 62} fill={left ? RED : GREEN} fontSize="13" fontWeight="700">{left ? `${pieces} boxes of ${d}, ${left} left over` : `${pieces} full boxes of ${d}, nothing left`}</text>
        </g>
      );
    };
    picture = (
      <>
        {strip(x, 70, AMBER, s.labelX || 'Laddoos')}
        {strip(y, 200, PINK, s.labelY || 'Barfis')}
        <text x={300} y={345} textAnchor="middle" fill={d === H ? GREEN : '#94a3b8'} fontSize="15" fontWeight="800">{d === H ? `Biggest box that fits both = HCF = ${H}` : 'Find the biggest box size that leaves nothing over'}</text>
      </>
    );
  }

  return (
    <StoryStage eyebrow="Visualizer · LCM and HCF in real life" title={mode === 'lcm' ? 'When do they meet again?' : 'Biggest equal boxes'}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? (mode === 'lcm' ? `Your turn: set two different intervals that first meet at ${task.lcm} minutes.` : 'Your turn: find the biggest box size that fills both trays exactly.') : ''} done={done} />
          <ModePills options={[{ value: 'lcm', label: 'Meet again (LCM)' }, { value: 'hcf', label: 'Equal boxes (HCF)' }]} value={mode} onChange={(m) => update({ mode: m })} />
          {mode === 'lcm' ? (
            <div className="flex flex-wrap gap-4">
              <Slider label="First interval" value={a} min={2} max={40} onChange={(v) => update({ a: v })} />
              <Slider label="Second interval" value={b} min={2} max={40} onChange={(v) => update({ b: v })} />
              <Slider label="Third (0 = off)" value={c} min={0} max={40} onChange={(v) => update({ c: v })} />
              <Readout label="LCM" value={L} tone="text-amber-300" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-end">
              <Slider label="Box size" value={d} min={1} max={60} onChange={(v) => update({ d: v })} />
              <Readout label="Boxes" value={x % d === 0 && y % d === 0 ? x / d + y / d : '-'} tone="text-amber-300" />
            </div>
          )}
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Root 2 is irrational ───
const PROOF = (k) => [
  `Suppose √${k} is rational: √${k} = a/b, with a, b co-prime, b ≠ 0`,
  `Square both sides: ${k}b² = a²`,
  `So ${k} divides a², and since ${k} is prime, ${k} divides a`,
  `Write a = ${k}c. Then ${k}b² = ${k * k}c², so b² = ${k}c²`,
  `So ${k} divides b², and hence ${k} divides b`,
  `${k} divides both a and b: they are NOT co-prime!`,
  `Contradiction. So √${k} is irrational.`,
];

export function Class10RealNumRootTwoWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'diagonal', swing: false, p: 3, q: 2, step: 0, k: 2, task: null }, visual);
  const mode = ['diagonal', 'parity', 'hunt', 'proof'].includes(s.mode) ? s.mode : 'diagonal';
  const ang = useTween(s.swing ? 0 : 45, 1600);
  const q = int(s.q, 1, 40, 2);
  const pP = int(s.p, 1, 40, 3);
  const k = s.k === 3 ? 3 : 2;
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 7);
  const huntP = Math.round(q * Math.SQRT2);
  const diff = huntP * huntP - 2 * q * q;
  const task = s.task && s.task.near ? s.task : null;
  const done = !!task && mode === 'hunt' && Math.abs(diff) === 1 && q > 2;
  useDone(done, onInteract);

  let picture;
  if (mode === 'diagonal') {
    const ox = 90;
    const oy = 280;
    const u = 200;
    const rad = (ang * Math.PI) / 180;
    const ex = ox + u * Math.SQRT2 * Math.cos(rad);
    const ey = oy - u * Math.SQRT2 * Math.sin(rad);
    picture = (
      <>
        <line x1={50} y1={oy} x2={570} y2={oy} stroke="#64748b" strokeWidth="2" />
        {[0, 1, 2].map((v) => (
          <g key={v}><line x1={ox + v * u} y1={oy - 8} x2={ox + v * u} y2={oy + 8} stroke={INK} strokeWidth="2" /><text x={ox + v * u} y={oy + 28} textAnchor="middle" fill={INK} fontSize="16" fontFamily="monospace">{v}</text></g>
        ))}
        {[1.4, 1.5].map((v) => <g key={v}><line x1={ox + v * u} y1={oy - 5} x2={ox + v * u} y2={oy + 5} stroke="#94a3b8" /><text x={ox + v * u} y={oy + 46} textAnchor="middle" fill="#94a3b8" fontSize="12">{v}</text></g>)}
        <rect x={ox} y={oy - u} width={u} height={u} fill={SKY} fillOpacity="0.08" stroke={SKY} strokeWidth="2" />
        <text x={ox + u / 2} y={oy - u - 10} textAnchor="middle" fill={SKY} fontSize="13">side 1</text>
        <line x1={ox} y1={oy} x2={ex} y2={ey} stroke={AMBER} strokeWidth="4" strokeLinecap="round" />
        <circle cx={ex} cy={ey} r={7} fill={AMBER} />
        {s.swing && <path d={`M ${ox + u} ${oy - u} A ${u * Math.SQRT2} ${u * Math.SQRT2} 0 0 1 ${ox + u * Math.SQRT2} ${oy}`} fill="none" stroke={AMBER} strokeDasharray="4 4" opacity="0.6" />}
        <text x={ex + 12} y={ey - 12} fill={AMBER} fontSize="18" fontWeight="900">√2</text>
        <text x={480} y={110} textAnchor="middle" fill="#94a3b8" fontSize="14">diagonal² = 1² + 1² = 2</text>
        <text x={480} y={140} textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="800">√2 = 1.41421356…</text>
        <text x={480} y={162} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="700">never ends, never repeats</text>
      </>
    );
  } else if (mode === 'parity') {
    const left = [...factorize(pP), ...factorize(pP)].filter((v) => v > 1).sort((m, n) => m - n);
    const right = [2, ...factorize(q), ...factorize(q)].filter((v) => v > 1).sort((m, n) => m - n);
    const twos = (arr) => arr.filter((v) => v === 2).length;
    const row = (arr, yy, label, val) => (
      <g key={`${label}${val}`}>
        <text x={30} y={yy - 26} fill={INK} fontSize="15" fontWeight="800" fontFamily="monospace">{label} = {fmt(val)}</text>
        {arr.length === 0 && <text x={45} y={yy + 5} fill="#64748b" fontSize="13">(no prime factors)</text>}
        {arr.map((v, i) => <Chip key={i} x={45 + i * 36} y={yy} p={v} dim={v !== 2} delay={i * 60} />)}
        <text x={570} y={yy + 5} textAnchor="end" fill={twos(arr) % 2 ? PINK : SKY} fontSize="15" fontWeight="900">{twos(arr)} twos ({twos(arr) % 2 ? 'odd' : 'even'})</text>
      </g>
    );
    picture = (
      <>
        {row(left, 90, `p² = ${pP}²`, pP * pP)}
        {row(right, 210, `2q² = 2 × ${q}²`, 2 * q * q)}
        <text x={300} y={300} textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="800">A square has every prime in pairs: an even number of 2s.</text>
        <text x={300} y={326} textAnchor="middle" fill={PINK} fontSize="16" fontWeight="800">2 times a square always has an odd number of 2s.</text>
        <text x={300} y={350} textAnchor="middle" fill="#94a3b8" fontSize="14">So p² = 2q² can never happen.</text>
      </>
    );
  } else if (mode === 'hunt') {
    const big = Math.max(huntP * huntP, 2 * q * q);
    const bw = (v) => (v / big) * 420;
    picture = (
      <>
        <text x={300} y={34} textAnchor="middle" fill="#94a3b8" fontSize="14">Best try with bottom q = {q}: top p = {huntP}</text>
        <text x={300} y={70} textAnchor="middle" fill={AMBER} fontSize="26" fontWeight="900" fontFamily="monospace">{huntP}/{q} = {(huntP / q).toFixed(6)}</text>
        <text x={300} y={96} textAnchor="middle" fill="#64748b" fontSize="13">√2 = 1.414214 (rounded)</text>
        <text x={40} y={145} fill={SKY} fontSize="14" fontWeight="800">p² = {fmt(huntP * huntP)}</text>
        <rect x={150} y={128} width={bw(huntP * huntP)} height={26} rx="5" fill={SKY} opacity="0.8" style={{ transition: 'width 500ms ease' }} />
        <text x={40} y={195} fill={PINK} fontSize="14" fontWeight="800">2q² = {fmt(2 * q * q)}</text>
        <rect x={150} y={178} width={bw(2 * q * q)} height={26} rx="5" fill={PINK} opacity="0.8" style={{ transition: 'width 500ms ease' }} />
        <text x={300} y={260} textAnchor="middle" fill={Math.abs(diff) === 1 ? GREEN : INK} fontSize="20" fontWeight="900">p² − 2q² = {diff}</text>
        <text x={300} y={295} textAnchor="middle" fill="#94a3b8" fontSize="14">{Math.abs(diff) === 1 ? 'A near miss! Off by just 1, but never 0.' : 'Not even close to 0. Try another q.'}</text>
        <text x={300} y={330} textAnchor="middle" fill="#64748b" fontSize="13">No fraction ever makes this exactly 0.</text>
      </>
    );
  } else {
    const lines = PROOF(k);
    picture = (
      <>
        {lines.map((t, i) => (
          <g key={`${k}-${i}`} style={{ opacity: i < step ? 1 : 0.1, transition: 'opacity 500ms ease' }}>
            <circle cx={36} cy={44 + i * 44} r={13} fill={i === 5 || i === 6 ? RED : SKY} opacity="0.85" />
            <text x={36} y={49 + i * 44} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900">{i + 1}</text>
            <text x={60} y={50 + i * 44} fill={i === 6 ? GREEN : INK} fontSize="15" fontWeight={i >= 5 ? 900 : 600}>{t}</text>
          </g>
        ))}
      </>
    );
  }

  return (
    <StoryStage eyebrow="Visualizer · Irrational numbers" title={mode === 'proof' ? `Proof: √${k} is irrational` : 'Can √2 be a fraction?'}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? 'Your turn: find a bottom number q bigger than 2 where p² and 2q² differ by exactly 1.' : ''} done={done} />
          <ModePills options={[{ value: 'diagonal', label: 'Square diagonal' }, { value: 'hunt', label: 'Fraction hunt' }, { value: 'parity', label: 'Count the 2s' }, { value: 'proof', label: 'Formal proof' }]} value={mode} onChange={(m) => update({ mode: m })} />
          {mode === 'diagonal' && <button onClick={() => update({ swing: !s.swing })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">{s.swing ? 'Lift the diagonal' : 'Swing it onto the number line'}</button>}
          {mode === 'hunt' && <Slider label="Bottom number q" value={q} min={1} max={40} onChange={(v) => update({ q: v })} />}
          {mode === 'parity' && (
            <div className="flex flex-wrap gap-4">
              <Slider label="p" value={pP} min={1} max={30} onChange={(v) => update({ p: v })} />
              <Slider label="q" value={q} min={1} max={30} onChange={(v) => update({ q: v })} />
            </div>
          )}
          {mode === 'proof' && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => update({ step: Math.min(7, step + 1) })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-300">Next step</button>
              <button onClick={() => update({ step: 0 })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">Reset</button>
              <ModePills options={[{ value: 2, label: '√2' }, { value: 3, label: '√3' }]} value={k} onChange={(v) => update({ k: v, step: 0 })} />
            </div>
          )}
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Rational or irrational? Sorting game and "related results" proofs ───
const CARDS = [
  { e: '5 − √3', r: false }, { e: '√2 × √2', r: true },
  { e: '3√2', r: false }, { e: '√9', r: true },
  { e: '2 + √5', r: false }, { e: '1/√2', r: false },
  { e: '0.375', r: true }, { e: '(√3+1) − √3', r: true },
  { e: '√12 ÷ √3', r: true }, { e: '7√5', r: false },
];
const RELATED = {
  '5-r3': ['Suppose 5 − √3 is rational: 5 − √3 = a/b (a, b integers, b ≠ 0)', 'Rearrange: √3 = 5 − a/b = (5b − a)/b', '5b − a and b are integers, so (5b − a)/b is rational', 'That would make √3 rational', 'But √3 is irrational: contradiction!', 'So 5 − √3 is irrational.'],
  '3r2': ['Suppose 3√2 is rational: 3√2 = a/b (b ≠ 0)', 'Divide by 3: √2 = a/(3b)', 'a and 3b are integers, so a/(3b) is rational', 'That would make √2 rational', 'But √2 is irrational: contradiction!', 'So 3√2 is irrational.'],
  'inv-r2': ['Suppose 1/√2 is rational: 1/√2 = a/b (a, b ≠ 0)', 'Flip both sides: √2 = b/a', 'b and a are integers, so b/a is rational', 'That would make √2 rational', 'But √2 is irrational: contradiction!', 'So 1/√2 is irrational.'],
};
const RELATED_TITLE = { '5-r3': '5 − √3', '3r2': '3√2', 'inv-r2': '1/√2' };

export function Class10RealNumClassifyWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'sort', answers: {}, reveal: false, expr: '5-r3', step: 0, task: null }, visual);
  const mode = s.mode === 'proof' ? 'proof' : 'sort';
  const answers = s.reveal ? Object.fromEntries(CARDS.map((c, i) => [i, c.r])) : (s.answers || {});
  const right = CARDS.filter((c, i) => answers[i] === c.r).length;
  const task = s.task && s.task.all ? s.task : null;
  const done = !!task && mode === 'sort' && right === CARDS.length;
  useDone(done, onInteract);
  const expr = RELATED[s.expr] ? s.expr : '5-r3';
  const step = clamp(Math.round(Number(s.step)) || 0, 0, 6);
  const choose = (i, r) => update({ answers: { ...answers, [i]: r }, reveal: false });

  let picture;
  if (mode === 'sort') {
    picture = (
      <>
        {CARDS.map((c, i) => {
          const x = i % 2 === 0 ? 20 : 310;
          const y = 12 + Math.floor(i / 2) * 68;
          const a = answers[i];
          const ok = a === undefined ? null : a === c.r;
          return (
            <g key={i} style={fade(i * 60)}>
              <rect x={x} y={y} width={270} height={58} rx="10" fill="#0f172a" stroke={ok === null ? '#334155' : ok ? GREEN : RED} strokeWidth="2" />
              <text x={x + 12} y={y + 35} fill={INK} fontSize={c.e.length > 9 ? 14 : 19} fontWeight="900" fontFamily="monospace">{c.e}</text>
              {[{ r: true, t: 'Rational', col: SKY, dx: 140 }, { r: false, t: 'Irrational', col: PINK, dx: 205 }].map((bt) => (
                <g key={bt.t} onClick={() => choose(i, bt.r)} style={{ cursor: 'pointer' }}>
                  <rect x={x + bt.dx} y={y + 15} width={60} height={28} rx="14" fill={a === bt.r ? bt.col : 'transparent'} stroke={bt.col} strokeWidth="1.5" opacity={a === bt.r ? 0.9 : 0.7} />
                  <text x={x + bt.dx + 30} y={y + 34} textAnchor="middle" fill={a === bt.r ? '#020617' : bt.col} fontSize="11" fontWeight="800">{bt.t}</text>
                </g>
              ))}
            </g>
          );
        })}
      </>
    );
  } else {
    const lines = RELATED[expr];
    picture = (
      <>
        <text x={300} y={30} textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="900">Prove that {RELATED_TITLE[expr]} is irrational</text>
        {lines.map((t, i) => (
          <g key={`${expr}-${i}`} style={{ opacity: i < step ? 1 : 0.1, transition: 'opacity 500ms ease' }}>
            <circle cx={36} cy={70 + i * 48} r={13} fill={i >= 4 ? RED : SKY} opacity="0.85" />
            <text x={36} y={75 + i * 48} textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900">{i + 1}</text>
            <text x={60} y={76 + i * 48} fill={i === 5 ? GREEN : INK} fontSize="15" fontWeight={i >= 4 ? 900 : 600}>{t}</text>
          </g>
        ))}
      </>
    );
  }

  return (
    <StoryStage eyebrow="Visualizer · Rational or irrational?" title={mode === 'sort' ? `Sort the numbers (${right} of ${CARDS.length} right)` : 'Related results'}
      footer={(
        <div className="space-y-3">
          <style>{ANIM}</style>
          <TaskBanner text={task ? 'Your turn: sort all 10 cards correctly.' : ''} done={done} />
          <ModePills options={[{ value: 'sort', label: 'Sorting game' }, { value: 'proof', label: 'Proofs' }]} value={mode} onChange={(m) => update({ mode: m })} />
          {mode === 'sort' ? (
            <button onClick={() => update({ answers: {}, reveal: false })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300">Clear</button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <ModePills options={Object.keys(RELATED).map((k) => ({ value: k, label: RELATED_TITLE[k] }))} value={expr} onChange={(v) => update({ expr: v, step: 0 })} />
              <button onClick={() => update({ step: Math.min(6, step + 1) })} className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-300">Next step</button>
            </div>
          )}
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
    </StoryStage>
  );
}
