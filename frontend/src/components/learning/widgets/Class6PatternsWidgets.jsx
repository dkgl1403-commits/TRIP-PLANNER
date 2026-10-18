import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, polar,
  TaskBanner, INK, AMBER, SKY, GREEN, PINK, PURPLE,
} from '../engine/storyKit';

// Class 6 · Patterns in Mathematics — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const LAYER_COLORS = [AMBER, SKY, GREEN, PINK, PURPLE, '#fb923c', '#2dd4bf', '#f87171'];
const FADE = '@keyframes patFadeIn { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: scale(1) } }';
const pop = (i, step = 70) => ({ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center', animation: `patFadeIn 320ms ease ${i * step}ms forwards` });

// ─── WIDGET 1: Number sequences as pictures (laddoo trays) ───
const SEQUENCES = {
  ones: { label: 'All 1s', term: () => 1 },
  counting: { label: 'Counting numbers', term: (n) => n },
  odd: { label: 'Odd numbers', term: (n) => 2 * n - 1 },
  even: { label: 'Even numbers', term: (n) => 2 * n },
  triangular: { label: 'Triangular numbers', term: (n) => (n * (n + 1)) / 2 },
  square: { label: 'Square numbers', term: (n) => n * n },
  cube: { label: 'Cube numbers', term: (n) => n * n * n },
  powers2: { label: 'Powers of 2', term: (n) => 2 ** (n - 1) },
};

// Dot positions (in a unit box) for the n-th picture of each sequence
function dotsFor(seq, n) {
  const d = [];
  if (seq === 'ones') d.push([0, 0]);
  if (seq === 'counting') for (let i = 0; i < n; i++) d.push([i, 0]);
  if (seq === 'odd') { for (let i = 0; i < n; i++) d.push([i, n - 1]); for (let j = 0; j < n - 1; j++) d.push([0, j]); }
  if (seq === 'even') for (let i = 0; i < n; i++) { d.push([i, 0]); d.push([i, 1]); }
  if (seq === 'triangular') for (let r = 0; r < n; r++) for (let i = 0; i <= r; i++) d.push([i - r / 2, r]);
  if (seq === 'square') for (let r = 0; r < n; r++) for (let i = 0; i < n; i++) d.push([i, r]);
  if (seq === 'powers2') { const t = 2 ** (n - 1); const cols = Math.ceil(Math.sqrt(t)); for (let k = 0; k < t; k++) d.push([k % cols, Math.floor(k / cols)]); }
  return d;
}

// An isometric cube made of n × n × n small cubes (only the three visible faces are drawn)
function IsoCube({ x, y, n, size }) {
  const u = size / (n * 1.8);
  const iso = (a, b, c) => [x + (a - b) * u * 0.87, y + (a + b) * u * 0.5 - c * u];
  const face = (pts, fill, key) => <polygon key={key} points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke="#020617" strokeWidth="1" />;
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    cells.push(face([iso(i, j, n), iso(i + 1, j, n), iso(i + 1, j + 1, n), iso(i, j + 1, n)], AMBER, `t${i}${j}`));
    cells.push(face([iso(n, i, j), iso(n, i + 1, j), iso(n, i + 1, j + 1), iso(n, i, j + 1)], '#b45309', `r${i}${j}`));
    cells.push(face([iso(i, n, j), iso(i + 1, n, j), iso(i + 1, n, j + 1), iso(i, n, j + 1)], '#d97706', `l${i}${j}`));
  }
  return <g>{cells}</g>;
}

export function Class6NumberSequencesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ seq: 'counting', terms: 5, task: false }, visual);
  const [guess, setGuess] = useState('');
  const [checked, setChecked] = useState(null);
  useEffect(() => { setGuess(''); setChecked(null); }, [s.seq]);

  const seq = SEQUENCES[s.seq];
  const terms = s.seq === 'cube' ? 4 : s.terms;
  const boxW = W / terms;
  const values = Array.from({ length: terms }, (_, i) => seq.term(i + 1));
  const nextValue = seq.term(terms + 1);

  const check = () => {
    const ok = Number(guess) === nextValue;
    setChecked(ok);
    if (ok) onInteract?.();
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Number Sequences"
      title={seq.label}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SEQUENCES).map(([k, v]) => (
              <button key={k} onClick={() => update({ seq: k })} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${s.seq === k ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{v.label}</button>
            ))}
          </div>
          <div className="font-mono text-base text-slate-200">{values.join(', ')}, <span className="text-amber-300">?</span></div>
          <div className={`flex flex-wrap items-center gap-2 p-2 rounded-xl border ${s.task ? 'border-amber-400/60 bg-amber-500/5' : 'border-slate-800'}`}>
            <span className="text-sm text-slate-300">{s.task ? '👉 Your turn: what comes next?' : 'What comes next?'}</span>
            <input value={guess} onChange={(e) => setGuess(e.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(e) => e.key === 'Enter' && check()} className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" placeholder="number" />
            <button onClick={check} className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold">Check</button>
            {checked === true && <span className="text-emerald-300 text-sm font-bold">✔ Yes! {nextValue}</span>}
            {checked === false && <span className="text-amber-300 text-sm">Not quite. Look at how each picture grows.</span>}
          </div>
        </div>
      }
    >
      <svg key={s.seq} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {values.map((v, t) => {
          const n = t + 1;
          const cx = boxW * t + boxW / 2;
          if (s.seq === 'cube') {
            return (
              <g key={t} style={pop(t, 300)}>
                <IsoCube x={cx} y={140} n={n} size={Math.min(boxW * 0.9, 130)} />
                <text x={cx} y={H - 24} textAnchor="middle" fill={AMBER} fontSize="22" fontWeight="900" fontFamily="monospace">{v}</text>
              </g>
            );
          }
          const dots = dotsFor(s.seq, n);
          const xs = dots.map((d) => d[0]);
          const ys = dots.map((d) => d[1]);
          const spanX = Math.max(...xs) - Math.min(...xs) + 1;
          const spanY = Math.max(...ys) - Math.min(...ys) + 1;
          const gap = Math.min((boxW - 16) / spanX, 230 / Math.max(spanY, 1), 34);
          const ox = cx - ((Math.max(...xs) + Math.min(...xs)) / 2) * gap;
          const oy = 170 - ((spanY - 1) / 2) * gap;
          const r = Math.max(3, gap * 0.36);
          let order = 0;
          return (
            <g key={t}>
              {dots.map(([dx, dy], i) => {
                const isNew = s.seq === 'odd' ? true : (s.seq === 'square' ? (dx === n - 1 || dy === n - 1) : s.seq === 'triangular' ? dy === n - 1 : false);
                return (
                  <circle key={i} cx={ox + dx * gap} cy={oy + dy * gap} r={r} fill={isNew && n > 1 ? AMBER : '#fde68a'} stroke="#92400e" strokeWidth="1"
                    style={pop(t * 3 + (order++) * 0.15, 90)} />
                );
              })}
              <text x={cx} y={H - 24} textAnchor="middle" fill={AMBER} fontSize="22" fontWeight="900" fontFamily="monospace">{v}</text>
            </g>
          );
        })}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Proof lab: odd numbers make squares; two triangles make a square; up-and-down sums ───
export function Class6SquarePatternsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'odd', n: 5, layers: 5 }, visual);
  const n = s.n;
  const layers = Math.min(s.layers, n);
  const slide = useTween(s.mode === 'triangles' && s.layers >= n ? 1 : 0, 1600);
  const cell = Math.min(46, 290 / n);
  const ox = 300 - (n * cell) / 2;
  const oy = 180 - (n * cell) / 2;

  const odd = Array.from({ length: n }, (_, k) => 2 * k + 1);
  const T = (k) => (k * (k + 1)) / 2;

  let caption;
  let cells = [];
  if (s.mode === 'odd') {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const layer = Math.max(r, c);
      if (layer < layers) cells.push({ x: c, y: n - 1 - r, color: LAYER_COLORS[layer % LAYER_COLORS.length], order: layer });
    }
    caption = <>{odd.slice(0, layers).map((o, i) => <span key={i} style={{ color: LAYER_COLORS[i % LAYER_COLORS.length] }}>{o}{i < layers - 1 ? ' + ' : ''}</span>)} = <strong className="text-emerald-300">{layers * layers} = {layers} × {layers}</strong></>;
  } else if (s.mode === 'triangles') {
    caption = <><span className="text-amber-300">{T(n)}</span> + <span className="text-sky-300">{T(n - 1)}</span> = <strong className="text-emerald-300">{n * n} = {n} × {n}</strong></>;
  } else {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const diag = r + c;
      cells.push({ x: c, y: r, color: LAYER_COLORS[diag % LAYER_COLORS.length], order: diag });
    }
    const parts = [...Array.from({ length: n }, (_, i) => i + 1), ...Array.from({ length: n - 1 }, (_, i) => n - 1 - i)];
    caption = <>{parts.map((p, i) => <span key={i} style={{ color: LAYER_COLORS[i % LAYER_COLORS.length] }}>{p}{i < parts.length - 1 ? ' + ' : ''}</span>)} = <strong className="text-emerald-300">{n * n}</strong></>;
  }

  useEffect(() => {
    if (s.mode === 'odd' && layers === n && n >= 6) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, n, s.mode]);

  return (
    <StoryStage
      eyebrow="Proof Lab · see it, then prove it"
      title={{ odd: 'Adding odd numbers makes squares', triangles: 'Two triangular numbers make a square', updown: 'Up-and-down sums make squares' }[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode, layers: s.n })} options={[{ value: 'odd', label: '1 + 3 + 5 + …' }, { value: 'triangles', label: 'Triangle + triangle' }, { value: 'updown', label: '1 + 2 + … + 2 + 1' }]} />
          <label className="block text-xs text-slate-400">
            Size of the square: <span className="text-amber-300 font-mono font-bold">{n} × {n}</span>
            <input type="range" min="2" max="8" value={n} onChange={(e) => update({ n: +e.target.value, layers: +e.target.value })} className="w-full accent-amber-400" />
          </label>
          {s.mode === 'odd' && (
            <div className="flex gap-2">
              <button onClick={() => update({ layers: Math.max(1, layers - 1) })} className="px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold">− layer</button>
              <button onClick={() => update({ layers: Math.min(n, layers + 1) })} className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold">+ add next odd number</button>
            </div>
          )}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-sm md:text-base">{caption}</div>
        </div>
      }
    >
      <svg key={`${s.mode}-${n}`} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode !== 'triangles' && cells.map((c, i) => (
          <rect key={i} x={ox + c.x * cell + 2} y={oy + c.y * cell + 2} width={cell - 4} height={cell - 4} rx={cell * 0.25}
            fill={c.color} opacity="0.85" style={pop(c.order, 380)} />
        ))}
        {s.mode === 'odd' && Array.from({ length: layers }, (_, k) => (
          <text key={k} x={ox + k * cell + cell / 2} y={oy + (n - 1 - k) * cell + cell / 2 + 5} textAnchor="middle" fill="#020617" fontSize={Math.min(16, cell * 0.4)} fontWeight="900" fontFamily="monospace" style={pop(k, 380)}>{2 * k + 1}</text>
        ))}
        {s.mode === 'triangles' && (
          <g>
            {Array.from({ length: n }, (_, r) => Array.from({ length: r + 1 }, (_, c) => (
              <rect key={`a${r}${c}`} x={ox + c * cell + 2} y={oy + r * cell + 2} width={cell - 4} height={cell - 4} rx={cell * 0.25} fill={AMBER} opacity="0.85" style={pop(r, 200)} />
            )))}
            {/* The smaller staircase starts outside on the right and slides in to complete the square */}
            <g transform={`translate(${(1 - slide) * (n * cell + 40)} 0)`}>
              {Array.from({ length: n - 1 }, (_, r) => Array.from({ length: n - 1 - r }, (_, c) => (
                <rect key={`b${r}${c}`} x={ox + (n - 1 - c) * cell + 2} y={oy + r * cell + 2} width={cell - 4} height={cell - 4} rx={cell * 0.25} fill={SKY} opacity="0.85" />
              )))}
            </g>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Doubling: the chessboard and the rice, 1 + 2 + 4 + … , folding paper ───
const indian = (big) => {
  const s = big.toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${last3}`;
};

export function Class6DoublingWidget({ visual }) {
  const [s, update] = useSceneState({ mode: 'chess', square: 4, k: 4, folds: 3 }, visual);
  const sq = clamp(s.square, 1, 64);
  const grains = 2n ** BigInt(sq - 1);
  const total = 2n ** BigInt(sq) - 1n;
  const k = clamp(s.k, 1, 6);
  const blocks = Array.from({ length: k }, (_, i) => 2 ** i);
  const sum = 2 ** k - 1;

  return (
    <StoryStage
      eyebrow="Visualizer · Doubling"
      title={{ chess: 'The chessboard and the rice', sum: '1 + 2 + 4 + … is one less than the next', fold: 'Folding paper doubles the layers' }[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'chess', label: 'Chessboard' }, { value: 'sum', label: '1 + 2 + 4 + …' }, { value: 'fold', label: 'Fold paper' }]} />
          {s.mode === 'chess' && (
            <>
              <label className="block text-xs text-slate-400">
                Square number: <span className="text-amber-300 font-mono font-bold">{sq}</span>
                <input type="range" min="1" max="64" value={sq} onChange={(e) => update({ square: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <div className="flex flex-wrap gap-2">
                <Readout label={`Grains on square ${sq}`} value={<span className="text-sm">{indian(grains)}</span>} tone="text-amber-300" />
                <Readout label="Total so far" value={<span className="text-sm">{indian(total)}</span>} tone="text-emerald-300" />
              </div>
              {sq === 64 && <p className="text-sm text-pink-300">That is more rice than the whole world grows in hundreds of years!</p>}
            </>
          )}
          {s.mode === 'sum' && (
            <>
              <label className="block text-xs text-slate-400">
                How many terms: <span className="text-amber-300 font-mono font-bold">{k}</span>
                <input type="range" min="1" max="6" value={k} onChange={(e) => update({ k: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-sm">{blocks.join(' + ')} = <strong className="text-emerald-300">{sum}</strong> = {2 ** k} − 1</div>
            </>
          )}
          {s.mode === 'fold' && (
            <>
              <label className="block text-xs text-slate-400">
                Number of folds: <span className="text-amber-300 font-mono font-bold">{s.folds}</span>
                <input type="range" min="0" max="7" value={s.folds} onChange={(e) => update({ folds: +e.target.value })} className="w-full accent-amber-400" />
              </label>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-sm">Layers = 2 × 2 × … ({s.folds} times) = <strong className="text-emerald-300">{2 ** s.folds}</strong></div>
            </>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode === 'chess' && (
          <g>
            {Array.from({ length: 64 }, (_, i) => {
              const r = Math.floor(i / 8);
              const c = r % 2 === 0 ? i % 8 : 7 - (i % 8);
              const x = 160 + c * 35;
              const y = 320 - (r + 1) * 35;
              const filled = i < sq;
              const dark = (r + c) % 2 === 1;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="35" height="35" fill={dark ? '#78350f' : '#fde68a'} opacity={dark ? 0.55 : 0.18} />
                  {filled && <rect x={x + 3} y={y + 3} width="29" height="29" rx="5" fill={AMBER} opacity={0.25 + 0.75 * ((i + 1) / sq)} />}
                  {i < 10 && <text x={x + 17.5} y={y + 22} textAnchor="middle" fill={filled ? '#020617' : '#94a3b8'} fontSize="11" fontWeight="800" fontFamily="monospace">{2 ** i}</text>}
                </g>
              );
            })}
            <text x="300" y="352" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">Start at the bottom-left and snake upwards; each square doubles the one before.</text>
          </g>
        )}
        {s.mode === 'sum' && (
          <g>
            {(() => {
              const unit = Math.min(22, 520 / (2 ** k));
              let x = 300 - ((2 ** k) * unit) / 2;
              const rows = [];
              blocks.forEach((b, i) => {
                rows.push(<rect key={i} x={x} y={150} width={b * unit - 3} height="60" rx="6" fill={LAYER_COLORS[i % LAYER_COLORS.length]} opacity="0.85" style={pop(i, 350)} />);
                rows.push(<text key={`t${i}`} x={x + (b * unit - 3) / 2} y={240} textAnchor="middle" fill={LAYER_COLORS[i % LAYER_COLORS.length]} fontSize="15" fontWeight="900" fontFamily="monospace" style={pop(i, 350)}>{b}</text>);
                x += b * unit;
              });
              rows.push(<rect key="one" x={x} y={150} width={unit - 3} height="60" rx="6" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 4" style={pop(k + 1, 350)} />);
              rows.push(<text key="onet" x={x + unit / 2} y={130} textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="sans-serif" style={pop(k + 1, 350)}>+1 → {2 ** k}</text>);
              return rows;
            })()}
            <text x="300" y="300" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">Add one more block and the row becomes exactly the next power of 2.</text>
          </g>
        )}
        {s.mode === 'fold' && (
          <g>
            {Array.from({ length: Math.min(2 ** s.folds, 128) }, (_, i) => {
              const layers = Math.min(2 ** s.folds, 128);
              const th = Math.min(16, 200 / layers);
              const w = Math.max(40, 360 / 2 ** Math.ceil(s.folds / 2));
              return <rect key={i} x={300 - w / 2} y={270 - (i + 1) * th} width={w} height={Math.max(th - (layers > 32 ? 0 : 2), 1)} rx={layers > 32 ? 0 : 3} fill={i % 2 ? '#e2e8f0' : '#cbd5e1'} stroke={layers > 32 ? 'none' : '#64748b'} strokeWidth="0.6" />;
            })}
            <text x="300" y="320" textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily="monospace">{2 ** s.folds} layers</text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Virahānka numbers: rhythms of short (1 beat) and long (2 beats) syllables ───
function rhythmsOf(n) {
  if (n === 0) return [[]];
  if (n < 0) return [];
  return [...rhythmsOf(n - 1).map((r) => [...r, 1]), ...rhythmsOf(n - 2).map((r) => [...r, 2])];
}

let audioCtx = null;
function playRhythm(r) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    let t = audioCtx.currentTime + 0.05;
    r.forEach((beat) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = beat === 1 ? 660 : 440;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beat * 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + beat * 0.24);
      t += beat * 0.28;
    });
  } catch { /* audio unavailable */ }
}

export function Class6VirahankaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ n: 4, build: false, task: false }, visual);
  const n = clamp(s.n, 1, 7);
  const list = rhythmsOf(n);
  const fromShort = rhythmsOf(n - 1).length;
  const seq = Array.from({ length: 8 }, (_, i) => rhythmsOf(i + 1).length);
  const [played, setPlayed] = useState(0);

  const play = (r) => {
    playRhythm(r);
    setPlayed((p) => p + 1);
    if (s.task && played + 1 >= 3) onInteract?.();
  };

  const Tile = ({ beat }) => (
    <span className={`inline-flex items-center justify-center h-7 rounded-md text-[11px] font-black ${beat === 1 ? 'w-7 bg-sky-500/80 text-slate-950' : 'w-14 bg-amber-400 text-slate-950'}`}>{beat === 1 ? 'ta' : 'taa'}</span>
  );

  return (
    <StoryStage
      eyebrow="Visualizer · Virahānka Numbers"
      title={`Rhythms with ${n} beat${n > 1 ? 's' : ''}: ${list.length}`}
      footer={
        <div className="space-y-3">
          <label className="block text-xs text-slate-400">
            Number of beats: <span className="text-amber-300 font-mono font-bold">{n}</span>
            <input type="range" min="1" max="7" value={n} onChange={(e) => update({ n: +e.target.value })} className="w-full accent-amber-400" />
          </label>
          <button onClick={() => update({ build: !s.build })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:text-white">{s.build ? 'Hide how they are built' : 'Show how they are built'}</button>
          {s.task && <TaskBanner text="Your turn: tap ▶ on three different rhythms and listen." done={played >= 3} />}
          <div className="font-mono text-sm text-slate-300">
            {seq.map((v, i) => <span key={i} className={i + 1 === n ? 'text-amber-300 font-black' : ''}>{v}{i < seq.length - 1 ? ', ' : ', …'}</span>)}
          </div>
          {n >= 3 && <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 font-mono text-sm">{rhythmsOf(n - 1).length} + {rhythmsOf(n - 2).length} = <strong className="text-emerald-300">{list.length}</strong> <span className="text-slate-400 font-sans text-xs">(each number is the sum of the two before it)</span></div>}
        </div>
      }
    >
      <div className="p-3 max-h-[340px] overflow-y-auto">
        <div className={`grid gap-1.5 ${s.build ? '' : 'sm:grid-cols-2'}`}>
          {list.map((r, i) => {
            const group = i < fromShort ? 'short' : 'long';
            return (
              <div key={`${n}-${i}`} className={`flex items-center gap-1 p-1.5 rounded-lg border ${s.build ? (group === 'short' ? 'border-sky-500/50 bg-sky-500/5' : 'border-amber-500/50 bg-amber-500/5') : 'border-slate-800'}`}
                style={{ opacity: 0, animation: `patFadeIn 300ms ease ${i * 60}ms forwards` }}>
                <button onClick={() => play(r)} className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs shrink-0" title="Play this rhythm">▶</button>
                {r.map((b, j) => <Tile key={j} beat={b} />)}
                {s.build && <span className="ml-auto text-[10px] text-slate-400">{group === 'short' ? `(${n - 1} beats) + ta` : `(${n - 2} beats) + taa`}</span>}
              </div>
            );
          })}
        </div>
        <style>{FADE}</style>
      </div>
    </StoryStage>
  );
}

// ─── WIDGET 5: Patterns in shapes ───
function kochPoints(level) {
  let p = [[0, -1], [Math.sin((2 * Math.PI) / 3), -Math.cos((2 * Math.PI) / 3)], [Math.sin((4 * Math.PI) / 3), -Math.cos((4 * Math.PI) / 3)]];
  for (let l = 0; l < level; l++) {
    const next = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i];
      const b = p[(i + 1) % p.length];
      const d = [(b[0] - a[0]) / 3, (b[1] - a[1]) / 3];
      const p1 = [a[0] + d[0], a[1] + d[1]];
      const p3 = [a[0] + 2 * d[0], a[1] + 2 * d[1]];
      const ang = -Math.PI / 3;
      const p2 = [p1[0] + d[0] * Math.cos(ang) - d[1] * Math.sin(ang), p1[1] + d[0] * Math.sin(ang) + d[1] * Math.cos(ang)];
      next.push(a, p1, p2, p3);
    }
    p = next;
  }
  return p;
}

const SHAPE_PATTERNS = {
  polygons: { label: 'Regular polygons', count: (t) => t + 3, unit: 'sides', rule: 'Sides: 3, 4, 5, 6, … the counting numbers starting from 3.' },
  complete: { label: 'Handshakes', count: (t) => (t * (t + 1)) / 2, unit: 'lines', rule: 'Every pair of points is joined once: 0, 1, 3, 6, 10, … the triangular numbers!' },
  squares: { label: 'Stacked squares', count: (t) => (t + 1) ** 2, unit: 'small squares', rule: 'An n × n grid has n × n small squares: the square numbers.' },
  triangles: { label: 'Stacked triangles', count: (t) => (t + 1) ** 2, unit: 'small triangles', rule: 'Rows have 1, 3, 5, 7, … small triangles, so the totals are square numbers again!' },
  koch: { label: 'Koch snowflake', count: (t) => 3 * 4 ** t, unit: 'sides', rule: 'Every side becomes 4 smaller sides: 3, 12, 48, 192, … multiply by 4 each time.' },
};

export function Class6ShapePatternsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ pattern: 'polygons', task: false }, visual);
  const pat = SHAPE_PATTERNS[s.pattern];
  const terms = s.pattern === 'koch' ? 4 : 5;
  const boxW = W / terms;

  useEffect(() => {
    if (s.task && s.pattern === s.task) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.pattern, s.task]);

  const draw = (t, cx, cy, R) => {
    if (s.pattern === 'polygons') {
      const n = t + 3;
      const pts = Array.from({ length: n }, (_, k) => polar(cx, cy, R, 90 + (k * 360) / n));
      return <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={AMBER} fillOpacity="0.15" stroke={AMBER} strokeWidth="2.5" />;
    }
    if (s.pattern === 'complete') {
      const n = t + 1;
      const pts = Array.from({ length: n }, (_, k) => polar(cx, cy, n === 1 ? 0 : R, 90 + (k * 360) / n));
      const lines = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) lines.push(<line key={`${i}-${j}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={SKY} strokeWidth="1.8" />);
      return <g>{lines}{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={AMBER} />)}</g>;
    }
    if (s.pattern === 'squares') {
      const n = t + 1;
      const c = (R * 1.6) / n;
      const o = [cx - (n * c) / 2, cy - (n * c) / 2];
      return <g>{Array.from({ length: n * n }, (_, k) => <rect key={k} x={o[0] + (k % n) * c} y={o[1] + Math.floor(k / n) * c} width={c} height={c} fill={GREEN} fillOpacity="0.25" stroke={GREEN} strokeWidth="1.5" />)}</g>;
    }
    if (s.pattern === 'triangles') {
      const n = t + 1;
      const side = R * 1.9;
      const h = (side * Math.sqrt(3)) / 2;
      const top = [cx, cy - h / 2];
      const pt = (row, col) => [top[0] + (col - row / 2) * (side / n), top[1] + row * (h / n)];
      const tris = [];
      for (let r = 0; r < n; r++) {
        for (let c = 0; c <= r; c++) tris.push([pt(r, c), pt(r + 1, c), pt(r + 1, c + 1)]);
        for (let c = 0; c < r; c++) tris.push([pt(r, c), pt(r, c + 1), pt(r + 1, c + 1)]);
      }
      return <g>{tris.map((tr, k) => <polygon key={k} points={tr.map((p) => p.join(',')).join(' ')} fill={PINK} fillOpacity={k % 2 ? 0.15 : 0.3} stroke={PINK} strokeWidth="1.2" />)}</g>;
    }
    const pts = kochPoints(t).map(([x, y]) => [cx + x * R, cy + y * R]);
    return <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={SKY} fillOpacity="0.15" stroke={SKY} strokeWidth={t > 2 ? 1 : 2} strokeLinejoin="round" />;
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Patterns in Shapes"
      title={pat.label}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={s.pattern} onChange={(pattern) => update({ pattern })} options={Object.entries(SHAPE_PATTERNS).map(([k, v]) => ({ value: k, label: v.label }))} />
          {s.task && <TaskBanner text={`Your turn: find the shape pattern that gives the ${SHAPE_PATTERNS[s.task].unit === 'lines' ? 'triangular numbers' : SHAPE_PATTERNS[s.task].label.toLowerCase()}.`} done={s.pattern === s.task} />}
          <p className="text-sm text-slate-300">{pat.rule}</p>
        </div>
      }
    >
      <svg key={s.pattern} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {Array.from({ length: terms }, (_, t) => {
          const cx = boxW * t + boxW / 2;
          return (
            <g key={t} style={pop(t, 450)}>
              {draw(t, cx, 160, Math.min(boxW * 0.4, 70))}
              <text x={cx} y={290} textAnchor="middle" fill={INK} fontSize="22" fontWeight="900" fontFamily="monospace">{pat.count(t)}</text>
              <text x={cx} y={312} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">{pat.unit}</text>
            </g>
          );
        })}
      </svg>
    </StoryStage>
  );
}
