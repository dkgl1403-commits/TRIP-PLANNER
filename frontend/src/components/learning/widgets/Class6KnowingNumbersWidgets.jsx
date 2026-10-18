import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner, AMBER, SKY, GREEN, PINK,
} from '../engine/storyKit';

// Class 6 · Knowing Our Numbers — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const FADE = '@keyframes knFadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }';

// ─── Number formatting and number names ───
export const indianCommas = (n) => {
  const s = String(n);
  if (s.length <= 3) return s;
  return `${s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${s.slice(-3)}`;
};
export const intlCommas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const two = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ''}`);
const three = (n) => [n >= 100 ? `${ONES[Math.floor(n / 100)]} hundred` : '', two(n % 100)].filter(Boolean).join(' ');

export function indianName(n) {
  if (n === 0) return 'zero';
  const parts = [];
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor(n / 1e5) % 100;
  const thousand = Math.floor(n / 1e3) % 100;
  const rest = n % 1000;
  if (crore) parts.push(`${three(crore)} crore`);
  if (lakh) parts.push(`${two(lakh)} lakh`);
  if (thousand) parts.push(`${two(thousand)} thousand`);
  if (rest) parts.push(three(rest));
  return parts.join(' ');
}

export function intlName(n) {
  if (n === 0) return 'zero';
  const parts = [];
  const groups = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
  let r = n;
  groups.forEach(([v, name]) => {
    const g = Math.floor(r / v);
    if (g) parts.push(`${three(g)} ${name}`);
    r %= v;
  });
  if (r) parts.push(three(r));
  return parts.join(' ');
}

// ─── WIDGET 1: Place value chart with rolling digits (Indian and International systems) ───
const INDIAN_PLACES = [
  { name: 'Arab (100 crore)', short: 'Ar', period: 'Crores' },
  { name: 'Ten Crores', short: 'TC', period: 'Crores' },
  { name: 'Crores', short: 'C', period: 'Crores' },
  { name: 'Ten Lakhs', short: 'TL', period: 'Lakhs' },
  { name: 'Lakhs', short: 'L', period: 'Lakhs' },
  { name: 'Ten Thousands', short: 'TTh', period: 'Thousands' },
  { name: 'Thousands', short: 'Th', period: 'Thousands' },
  { name: 'Hundreds', short: 'H', period: 'Ones' },
  { name: 'Tens', short: 'T', period: 'Ones' },
  { name: 'Ones', short: 'O', period: 'Ones' },
];
const INTL_PLACES = [
  { name: 'Billions', short: 'B', period: 'Billions' },
  { name: 'Hundred Millions', short: 'HM', period: 'Millions' },
  { name: 'Ten Millions', short: 'TM', period: 'Millions' },
  { name: 'Millions', short: 'M', period: 'Millions' },
  { name: 'Hundred Thousands', short: 'HTh', period: 'Thousands' },
  { name: 'Ten Thousands', short: 'TTh', period: 'Thousands' },
  { name: 'Thousands', short: 'Th', period: 'Thousands' },
  { name: 'Hundreds', short: 'H', period: 'Ones' },
  { name: 'Tens', short: 'T', period: 'Ones' },
  { name: 'Ones', short: 'O', period: 'Ones' },
];
const PERIOD_COLORS = { Billions: 'bg-pink-500/15 border-pink-500/40', Crores: 'bg-pink-500/15 border-pink-500/40', Millions: 'bg-purple-500/15 border-purple-500/40', Lakhs: 'bg-purple-500/15 border-purple-500/40', Thousands: 'bg-sky-500/15 border-sky-500/40', Ones: 'bg-amber-500/15 border-amber-500/40' };
const PRESETS = [
  { label: "India's population (Census 2011)", value: 1210854977 },
  { label: 'Earth to Moon (km)', value: 384400 },
  { label: 'Mount Everest (m)', value: 8849 },
  { label: 'Narendra Modi Stadium seats', value: 132000 },
  { label: 'River Ganga length (km)', value: 2525 },
];

// One odometer digit: a column 0–9 that rolls to the right digit
function RollingDigit({ d, dim, highlight }) {
  return (
    <div className={`relative h-12 w-full overflow-hidden rounded-lg border ${highlight ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-700 bg-slate-900'} ${dim ? 'opacity-25' : ''}`}>
      <div className="absolute inset-x-0 top-0 transition-transform duration-700 ease-out" style={{ transform: `translateY(-${(d ?? 0) * 3}rem)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`h-12 flex items-center justify-center font-mono text-2xl font-black ${highlight ? 'text-emerald-300' : 'text-amber-300'}`}>{i}</div>
        ))}
      </div>
    </div>
  );
}

export function Class6PlaceValueWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ value: 1210854977, system: 'indian', highlight: null, words: true, expanded: false, task: null }, visual);
  const [input, setInput] = useState(String(s.value));
  useEffect(() => { setInput(String(s.value)); }, [s.value]);

  const value = clamp(Math.floor(s.value) || 0, 0, 9999999999);
  const digits = String(value).padStart(10, '0').split('').map(Number);
  const firstNonZero = digits.findIndex((d) => d !== 0);
  const places = s.system === 'international' ? INTL_PLACES : INDIAN_PLACES;
  const fmt = s.system === 'international' ? intlCommas : indianCommas;
  const hi = s.highlight; // index from the right (0 = ones)
  const hiIdx = hi === null || hi === undefined ? null : 9 - hi;
  const hiDigit = hiIdx !== null ? digits[hiIdx] : null;
  const placeValue = hiIdx !== null ? hiDigit * 10 ** hi : null;
  const expandedParts = digits.map((d, i) => d * 10 ** (9 - i)).filter((v) => v > 0);

  const onType = (v) => {
    const clean = v.replace(/[^0-9]/g, '').slice(0, 10);
    setInput(clean);
    if (clean) update({ value: Number(clean) });
  };

  useEffect(() => {
    if (s.task && Number(input) === s.task) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, s.task]);

  return (
    <StoryStage
      eyebrow="Visualizer · Place Value"
      title={s.system === 'international' ? 'International place value chart' : 'Indian place value chart'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.system} onChange={(system) => update({ system })} options={[{ value: 'indian', label: 'Indian (lakh, crore)' }, { value: 'international', label: 'International (million, billion)' }]} />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.value} onClick={() => update({ value: p.value, highlight: null })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${value === p.value ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{p.label}</button>
            ))}
          </div>
          {s.task && <TaskBanner text={`Your turn: type the number "${indianName(s.task)}" in digits.`} done={Number(input) === s.task} />}
          <div className="flex flex-wrap items-center gap-2">
            <input value={input} onChange={(e) => onType(e.target.value)} className="w-44 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 font-mono text-amber-300" placeholder="type a number" />
            <button onClick={() => update({ expanded: !s.expanded })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">{s.expanded ? 'Hide expanded form' : 'Show expanded form'}</button>
            <span className="text-[11px] text-slate-500">Tap any digit to see its place value.</span>
          </div>
        </div>
      }
    >
      <div className="p-3 md:p-4 space-y-4">
        <div className="grid grid-cols-10 gap-1">
          {places.map((p, i) => (
            <div key={i} className={`rounded-md border px-0.5 py-1 text-center ${PERIOD_COLORS[p.period]} ${i < firstNonZero ? 'opacity-30' : ''}`}>
              <div className="text-[9px] md:text-[10px] font-bold text-slate-300 leading-tight min-h-[2.2em] flex items-center justify-center">{p.name}</div>
            </div>
          ))}
          {digits.map((d, i) => (
            <button key={`d${i}`} onClick={() => update({ highlight: 9 - i })} className="block">
              <RollingDigit d={d} dim={i < firstNonZero} highlight={hiIdx === i} />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-1 text-[10px] font-bold uppercase tracking-wider">
          {[...new Set(places.map((p) => p.period))].map((period) => (
            <span key={period} className={`px-2 py-0.5 rounded-full border ${PERIOD_COLORS[period]} text-slate-300`}>{period} period</span>
          ))}
        </div>

        <div className="text-center">
          <div className="font-mono text-3xl md:text-4xl font-black text-white tracking-wide">{fmt(value)}</div>
          {s.words && <div key={`${value}-${s.system}`} className="mt-1 text-sm md:text-base text-amber-200 capitalize" style={{ animation: 'knFadeIn 500ms ease' }}>{s.system === 'international' ? intlName(value) : indianName(value)}</div>}
        </div>

        {hiIdx !== null && (
          <div className="flex flex-wrap justify-center gap-2" style={{ animation: 'knFadeIn 400ms ease' }}>
            <Readout label="Digit (face value)" value={hiDigit} tone="text-amber-300" />
            <Readout label="Place" value={<span className="text-sm">{places[hiIdx].name}</span>} tone="text-sky-300" />
            <Readout label="Place value" value={<span className="text-sm">{fmt(placeValue)}</span>} tone="text-emerald-300" />
          </div>
        )}
        {s.expanded && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs md:text-sm text-slate-200 leading-relaxed" style={{ animation: 'knFadeIn 400ms ease' }}>
            {fmt(value)} = {expandedParts.map((v, i) => <span key={i}>{fmt(v)}{i < expandedParts.length - 1 ? ' + ' : ''}</span>)}
          </div>
        )}
      </div>
    </StoryStage>
  );
}

// ─── WIDGET 2: Comparing, ordering, and making the largest / smallest number from digits ───
export function Class6CompareOrderWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'compare', a: 8611, b: 8586, nums: [8849, 8611, 8586, 8516, 8485], order: 'none', digits: [7, 0, 4, 9], make: 'largest', task: null }, visual);
  const [scan, setScan] = useState(-1);

  // Compare: walk the digits from the left until they differ
  const A = String(s.a);
  const B = String(s.b);
  const sameLength = A.length === B.length;
  const diffAt = sameLength ? [...A].findIndex((c, i) => c !== B[i]) : -1;
  useEffect(() => {
    if (s.mode !== 'compare') return undefined;
    setScan(-1);
    if (!sameLength) return undefined;
    let i = -1;
    const stop = diffAt === -1 ? A.length - 1 : diffAt;
    const timer = setInterval(() => {
      i += 1;
      setScan(i);
      if (i >= stop) clearInterval(timer);
    }, 700);
    return () => clearInterval(timer);
  }, [s.mode, s.a, s.b, sameLength, diffAt, A.length]);
  const sign = s.a > s.b ? '>' : s.a < s.b ? '<' : '=';
  const done = !sameLength || scan >= (diffAt === -1 ? A.length - 1 : diffAt);

  // Order: cards slide to their sorted positions
  const sorted = s.order === 'asc' ? [...s.nums].sort((x, y) => x - y) : s.order === 'desc' ? [...s.nums].sort((x, y) => y - x) : s.nums;
  const slotOf = (n, i) => sorted.indexOf(n) === -1 ? i : sorted.indexOf(n);

  // Digits: largest = digits in descending order; smallest = ascending, but never start with 0
  const desc = [...s.digits].sort((x, y) => y - x);
  let asc = [...s.digits].sort((x, y) => x - y);
  if (asc[0] === 0) {
    const k = asc.findIndex((d) => d !== 0);
    asc = [asc[k], ...asc.slice(0, k), ...asc.slice(k + 1)];
  }
  const arranged = s.make === 'largest' ? desc : asc;
  const posOf = s.digits.map((d, i) => {
    const target = arranged.findIndex((x, j) => x === d && s.digits.slice(0, i).filter((y) => y === d).length === arranged.slice(0, j).filter((y) => y === d).length);
    return target;
  });

  useEffect(() => {
    if (s.task && s.mode === 'digits' && s.make === s.task) onInteract?.();
    if (s.task && s.mode === 'order' && s.order === s.task) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.make, s.order, s.mode, s.task]);

  const cardW = 100;
  return (
    <StoryStage
      eyebrow="Visualizer · Comparing Numbers"
      title={{ compare: 'Which number is bigger?', order: 'Putting numbers in order', digits: 'Make the largest and smallest number' }[s.mode]}
      footer={
        <div className="space-y-3">
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'compare', label: 'Compare two' }, { value: 'order', label: 'Order many' }, { value: 'digits', label: 'Digit cards' }]} />
          {s.mode === 'compare' && (
            <div className="flex flex-wrap gap-2 items-center">
              <input value={s.a} onChange={(e) => update({ a: Number(e.target.value.replace(/\D/g, '').slice(0, 9)) || 0 })} className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
              <span className="text-slate-400 text-sm">and</span>
              <input value={s.b} onChange={(e) => update({ b: Number(e.target.value.replace(/\D/g, '').slice(0, 9)) || 0 })} className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-sky-300" />
            </div>
          )}
          {s.mode === 'order' && (
            <div className="flex gap-2">
              <button onClick={() => update({ order: 'asc' })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.order === 'asc' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>Ascending (small → big)</button>
              <button onClick={() => update({ order: 'desc' })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.order === 'desc' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>Descending (big → small)</button>
            </div>
          )}
          {s.mode === 'digits' && (
            <div className="flex gap-2">
              <button onClick={() => update({ make: 'largest' })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.make === 'largest' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>Largest number</button>
              <button onClick={() => update({ make: 'smallest' })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.make === 'smallest' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>Smallest number</button>
            </div>
          )}
          {s.task && <TaskBanner text={s.mode === 'digits' ? `Your turn: make the ${s.task} number with these digit cards.` : `Your turn: arrange the numbers in ${s.task === 'asc' ? 'ascending' : 'descending'} order.`} done={(s.mode === 'digits' && s.make === s.task) || (s.mode === 'order' && s.order === s.task)} />}
          <p className="text-sm text-slate-300">
            {s.mode === 'compare' && (!sameLength ? `More digits means a bigger number: ${A.length} digits vs ${B.length} digits.` : diffAt === -1 ? 'Every digit matches, so the numbers are equal.' : `Same number of digits, so compare from the left. The first different digits are ${A[diffAt]} and ${B[diffAt]}.`)}
            {s.mode === 'order' && 'Compare the numbers two at a time and slide them into place.'}
            {s.mode === 'digits' && (s.make === 'largest' ? 'For the largest number, put the biggest digit in the highest place.' : 'For the smallest number, put the smallest digit first, but a number cannot start with 0!')}
          </p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'compare' && (() => {
          const len = Math.max(A.length, B.length);
          const cw = Math.min(56, 480 / len);
          const x0 = 300 - (len * cw) / 2;
          const row = (str, y, color) => [...str.padStart(len, ' ')].map((c, i) => {
            const realIdx = i - (len - str.length);
            const active = sameLength && i === scan;
            const decisive = sameLength && i === diffAt && done;
            return (
              <g key={`${y}-${i}`}>
                <rect x={x0 + i * cw + 3} y={y} width={cw - 6} height="60" rx="10" fill={decisive ? 'rgba(52,211,153,0.25)' : active ? 'rgba(251,191,36,0.2)' : '#0f172a'} stroke={decisive ? GREEN : active ? AMBER : '#334155'} strokeWidth="2" opacity={c === ' ' ? 0.2 : 1} />
                <text x={x0 + i * cw + cw / 2} y={y + 41} textAnchor="middle" fill={color} fontSize={Math.min(32, cw * 0.6)} fontWeight="900" fontFamily="monospace">{realIdx >= 0 ? c : ''}</text>
              </g>
            );
          });
          return (
            <g>
              {row(A, 70, AMBER)}
              {row(B, 210, SKY)}
              {done && <text x="300" y="185" textAnchor="middle" fill={GREEN} fontSize="34" fontWeight="900" fontFamily="monospace" style={{ animation: 'knFadeIn 400ms ease' }}>{indianCommas(s.a)} {sign} {indianCommas(s.b)}</text>}
            </g>
          );
        })()}
        {s.mode === 'order' && s.nums.map((n, i) => {
          const x = 300 - (s.nums.length * cardW) / 2 + slotOf(n, i) * cardW;
          return (
            <g key={n} style={{ transform: `translate(${x}px, 140px)`, transition: 'transform 900ms cubic-bezier(.4,1.4,.6,1)' }}>
              <rect x="6" y="0" width={cardW - 12} height="70" rx="12" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
              <text x={cardW / 2} y="44" textAnchor="middle" fill={AMBER} fontSize="20" fontWeight="900" fontFamily="monospace">{indianCommas(n)}</text>
            </g>
          );
        })}
        {s.mode === 'order' && s.order !== 'none' && (
          <text x="300" y="260" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="800" fontFamily="sans-serif">{s.order === 'asc' ? 'smallest → largest' : 'largest → smallest'}</text>
        )}
        {s.mode === 'digits' && (
          <g>
            {s.digits.map((d, i) => {
              const x = 300 - (s.digits.length * 90) / 2 + posOf[i] * 90;
              return (
                <g key={i} style={{ transform: `translate(${x}px, 120px)`, transition: 'transform 900ms cubic-bezier(.4,1.4,.6,1)' }}>
                  <rect x="8" y="0" width="74" height="96" rx="14" fill="#0f172a" stroke={d === 0 ? PINK : AMBER} strokeWidth="2.5" />
                  <text x="45" y="64" textAnchor="middle" fill={d === 0 ? PINK : AMBER} fontSize="44" fontWeight="900" fontFamily="monospace">{d}</text>
                </g>
              );
            })}
            <text x="300" y="270" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace">{s.make === 'largest' ? 'Largest' : 'Smallest'}: {indianCommas(Number(arranged.join('')))}</text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Estimation: rounding on a number line, and estimating sums ───
export function Class6EstimationWidget({ visual }) {
  const [s, update] = useSceneState({ mode: 'round', value: 98476, place: 1000, a: 5290, b: 17986 }, visual);
  const v = s.value;
  const p = s.place;
  const lower = Math.floor(v / p) * p;
  const upper = lower + p;
  const half = lower + p / 2;
  const rounded = v - lower >= p / 2 ? upper : lower;
  const goes = useTween(rounded === upper ? 1 : 0, 900);
  const xOf = (n) => 80 + ((n - lower) / p) * 440;
  const marker = useTween(xOf(v), 900);

  const est = (n) => Math.round(n / s.place) * s.place;
  const ea = est(s.a);
  const eb = est(s.b);

  return (
    <StoryStage
      eyebrow="Visualizer · Estimation"
      title={s.mode === 'round' ? `Round ${indianCommas(v)} to the nearest ${indianCommas(p)}` : 'Estimate a sum'}
      footer={
        <div className="space-y-3">
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'round', label: 'Rounding' }, { value: 'sum', label: 'Estimate a sum' }]} />
          <ModePills value={String(s.place)} onChange={(pl) => update({ place: Number(pl) })} options={[{ value: '10', label: 'Nearest 10' }, { value: '100', label: 'Nearest 100' }, { value: '1000', label: 'Nearest 1,000' }]} />
          {s.mode === 'round' ? (
            <>
              <label className="block text-xs text-slate-400">
                Number: <span className="text-amber-300 font-mono font-bold">{indianCommas(v)}</span>
                <input type="range" min={lower} max={upper - 1} value={v} onChange={(e) => update({ value: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <p className="text-sm text-slate-300">{indianCommas(v)} lies between {indianCommas(lower)} and {indianCommas(upper)}. The halfway mark is {indianCommas(half)}. It is nearer to <strong className="text-emerald-300">{indianCommas(rounded)}</strong>{v === half ? ' (exactly halfway always rounds up)' : ''}.</p>
            </>
          ) : (
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-sm space-y-1">
              <div>Exact: {indianCommas(s.a)} + {indianCommas(s.b)} = <strong className="text-amber-300">{indianCommas(s.a + s.b)}</strong></div>
              <div>Estimate: {indianCommas(ea)} + {indianCommas(eb)} = <strong className="text-emerald-300">{indianCommas(ea + eb)}</strong></div>
              <div className="text-slate-400 font-sans text-xs">The estimate is off by only {indianCommas(Math.abs(s.a + s.b - ea - eb))}, and you can do it in your head!</div>
            </div>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'round' ? (
          <g>
            <rect x={xOf(half)} y="150" width={xOf(upper) - xOf(half)} height="40" fill={GREEN} opacity="0.08" />
            <rect x={xOf(lower)} y="150" width={xOf(half) - xOf(lower)} height="40" fill={SKY} opacity="0.08" />
            <line x1="60" y1="170" x2="540" y2="170" stroke="#e2e8f0" strokeWidth="3" />
            {Array.from({ length: 11 }, (_, i) => {
              const x = xOf(lower + (p / 10) * i);
              return <line key={i} x1={x} y1={i % 5 === 0 ? 150 : 160} x2={x} y2={i % 5 === 0 ? 190 : 180} stroke="#94a3b8" strokeWidth={i % 5 === 0 ? 3 : 1.5} />;
            })}
            <text x={xOf(lower)} y="220" textAnchor="middle" fill={SKY} fontSize="16" fontWeight="800" fontFamily="monospace">{indianCommas(lower)}</text>
            <text x={xOf(half)} y="220" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="monospace">{indianCommas(half)}</text>
            <text x={xOf(upper)} y="220" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="800" fontFamily="monospace">{indianCommas(upper)}</text>
            <g transform={`translate(${marker} 0)`}>
              <polygon points="0,148 -10,128 10,128" fill={AMBER} />
              <text x="0" y="118" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily="monospace">{indianCommas(v)}</text>
            </g>
            <path d={`M ${marker} 200 Q ${(marker + (goes > 0.5 ? xOf(upper) : xOf(lower))) / 2} 290 ${goes > 0.5 ? xOf(upper) : xOf(lower)} 236`} fill="none" stroke={GREEN} strokeWidth="2.5" strokeDasharray="6 5" />
            <text x="300" y="320" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="sans-serif">≈ {indianCommas(rounded)}</text>
          </g>
        ) : (
          <g>
            {[[s.a, ea, 90, AMBER], [s.b, eb, 170, SKY]].map(([exact, approx, y, color], i) => {
              const scale = 440 / Math.max(s.a + s.b, ea + eb);
              return (
                <g key={i}>
                  <rect x="80" y={y} width={exact * scale} height="26" rx="6" fill={color} opacity="0.85" />
                  <rect x="80" y={y + 30} width={approx * scale} height="10" rx="4" fill={GREEN} opacity="0.7" />
                  <text x={86 + exact * scale} y={y + 19} fill={color} fontSize="14" fontWeight="800" fontFamily="monospace">{indianCommas(exact)} ≈ {indianCommas(approx)}</text>
                </g>
              );
            })}
            <text x="300" y="290" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace">≈ {indianCommas(ea + eb)}  (exact {indianCommas(s.a + s.b)})</text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: The unit ladder (length, mass, capacity) ───
const LADDERS = {
  length: { units: ['km', 'm', 'cm', 'mm'], steps: [1000, 100, 10], label: 'Length' },
  mass: { units: ['kg', 'g', 'mg'], steps: [1000, 1000], label: 'Mass' },
  capacity: { units: ['L', 'mL'], steps: [1000], label: 'Capacity' },
};
const fmtNum = (x) => {
  if (Number.isInteger(x)) return indianCommas(x);
  return x.toLocaleString('en-IN', { maximumFractionDigits: 6 });
};

export function Class6UnitLadderWidget({ visual }) {
  const [s, update] = useSceneState({ kind: 'length', value: 8849, unit: 'm', label: 'Mount Everest' }, visual);
  const ladder = LADDERS[s.kind];
  const from = ladder.units.indexOf(s.unit) === -1 ? 0 : ladder.units.indexOf(s.unit);
  const toBase = ladder.units.map((u, i) => {
    let factor = 1;
    if (i > from) for (let k = from; k < i; k++) factor *= ladder.steps[k];
    if (i < from) for (let k = i; k < from; k++) factor /= ladder.steps[k];
    return s.value * factor;
  });

  return (
    <StoryStage
      eyebrow="Visualizer · Units and Big Numbers"
      title={s.label ? `${s.label}: ${fmtNum(s.value)} ${s.unit}` : `${ladder.label} conversions`}
      footer={
        <div className="space-y-3">
          <ModePills value={s.kind} onChange={(kind) => update({ kind, unit: LADDERS[kind].units[0], label: '' })} options={Object.entries(LADDERS).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="flex flex-wrap items-center gap-2">
            <input value={s.value} onChange={(e) => update({ value: Number(e.target.value.replace(/[^0-9.]/g, '')) || 0, label: '' })} className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
            <ModePills value={s.unit} onChange={(unit) => update({ unit, label: '' })} options={ladder.units.map((u) => ({ value: u, label: u }))} />
          </div>
          <p className="text-sm text-slate-300">Going down the ladder (to a smaller unit) we multiply; going up (to a bigger unit) we divide.</p>
        </div>
      }
    >
      <div className="p-4 space-y-2">
        <style>{FADE}</style>
        {ladder.units.map((u, i) => (
          <React.Fragment key={`${s.kind}-${u}`}>
            <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${i === from ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-900'}`} style={{ animation: `knFadeIn 400ms ease ${i * 150}ms both` }}>
              <span className={`text-lg font-black ${i === from ? 'text-amber-300' : 'text-slate-300'}`}>{u}</span>
              <span className="font-mono text-xl md:text-2xl font-black text-white">{fmtNum(toBase[i])}</span>
            </div>
            {i < ladder.units.length - 1 && (
              <div className="flex items-center justify-center gap-6 text-xs font-bold" style={{ animation: `knFadeIn 400ms ease ${i * 150 + 80}ms both` }}>
                <span className="text-emerald-300">↓ × {fmtNum(ladder.steps[i])}</span>
                <span className="text-sky-300">↑ ÷ {fmtNum(ladder.steps[i])}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </StoryStage>
  );
}

// ─── WIDGET 5: Roman numerals (build from tiles; clock face; write it yourself) ───
const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export function toRoman(n) {
  const parts = [];
  let r = n;
  ROMAN.forEach(([v, sym]) => { while (r >= v) { parts.push([v, sym]); r -= v; } });
  return parts;
}

export function Class6RomanNumeralsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'build', value: 2026, task: null }, visual);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  useEffect(() => { setAnswer(''); setResult(null); }, [s.task]);
  const n = clamp(Math.floor(s.value) || 1, 1, 3999);
  const parts = toRoman(n);

  const check = () => {
    const ok = answer.trim().toUpperCase() === toRoman(s.task).map((p) => p[1]).join('');
    setResult(ok);
    if (ok) onInteract?.();
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Roman Numerals"
      title={s.mode === "clock" ? "Dadi's wall clock" : `${n} = ${parts.map((p) => p[1]).join('')}`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'build', label: 'Build a number' }, { value: 'clock', label: 'Clock face' }]} />
          {s.mode === 'build' && (
            <label className="block text-xs text-slate-400">
              Number: <input type="number" min="1" max="3999" value={n} onChange={(e) => update({ value: Number(e.target.value) })} className="ml-2 w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
              <input type="range" min="1" max="3999" value={n} onChange={(e) => update({ value: +e.target.value })} className="w-full accent-amber-400 mt-2" />
            </label>
          )}
          {s.task && (
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-amber-400/60 bg-amber-500/5">
              <span className="text-sm text-amber-200">👉 Your turn: write {s.task} in Roman numerals</span>
              <input value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase().replace(/[^IVXLCDM]/g, ''))} onKeyDown={(e) => e.key === 'Enter' && check()} className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
              <button onClick={check} className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">Check</button>
              {result === true && <span className="text-emerald-300 text-sm font-bold">✔ Correct!</span>}
              {result === false && <span className="text-amber-300 text-sm">Not quite. Break {s.task} into tens and ones first.</span>}
            </div>
          )}
          <div className="text-xs text-slate-400 grid sm:grid-cols-2 gap-1">
            <span>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000</span>
            <span>A symbol repeats at most 3 times. V, L, D never repeat.</span>
            <span>Smaller after bigger → add (VI = 6)</span>
            <span>Smaller before bigger → subtract (IV = 4). Only I, X, C can subtract.</span>
          </div>
        </div>
      }
    >
      {s.mode === 'clock' ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
          <rect width={W} height={H} fill="#020617" />
          <circle cx="300" cy="180" r="150" fill="#1c1917" stroke="#a16207" strokeWidth="10" />
          {Array.from({ length: 12 }, (_, i) => {
            const h = i === 0 ? 12 : i;
            const ang = ((90 - i * 30) * Math.PI) / 180;
            return <text key={i} x={300 + Math.cos(ang) * 118} y={180 - Math.sin(ang) * 118 + 8} textAnchor="middle" fill="#fde68a" fontSize="22" fontWeight="800" fontFamily="serif" style={{ opacity: 0, animation: `knFadeIn 300ms ease ${i * 120}ms forwards` }}>{toRoman(h).map((p) => p[1]).join('')}</text>;
          })}
          <line x1="300" y1="180" x2="300" y2="95" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" />
          <line x1="300" y1="180" x2="370" y2="215" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="300" cy="180" r="8" fill="#a16207" />
        </svg>
      ) : (
        <div className="p-4 min-h-[260px] flex flex-col items-center justify-center gap-4">
          <div key={n} className="flex flex-wrap justify-center gap-2">
            {parts.map(([v, sym], i) => (
              <div key={i} className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 ${sym.length === 2 ? 'border-pink-400 bg-pink-500/10' : 'border-amber-400 bg-amber-500/10'}`} style={{ opacity: 0, animation: `knFadeIn 350ms ease ${i * 200}ms forwards` }}>
                <span className={`font-serif text-3xl font-black ${sym.length === 2 ? 'text-pink-300' : 'text-amber-300'}`}>{sym}</span>
                <span className="text-xs font-mono text-slate-300">{v}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-sm text-slate-300 text-center">{parts.map((p) => p[0]).join(' + ')} = <strong className="text-emerald-300">{n}</strong></div>
          <p className="text-[11px] text-slate-500">Pink tiles use the subtraction rule (like IV = 5 − 1).</p>
        </div>
      )}
    </StoryStage>
  );
}
