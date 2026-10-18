import React, { useState, useEffect, useMemo } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner, INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Number Play (Ganita Prakash Ch. 3) — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const phase = (p, a, b) => ease(clamp((p - a) / (b - a), 0, 1));
const FADE = '@keyframes npPop { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: scale(1) } } '
  + '@keyframes npDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } } '
  + '@keyframes npPulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }';
const pop = (delay = 0, dur = 320) => ({ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center', animation: `npPop ${dur}ms ease ${delay}ms forwards` });
const draw = (delay = 0, dur = 600) => ({ strokeDasharray: 1, strokeDashoffset: 1, animation: `npDraw ${dur}ms ease ${delay}ms forwards` });
const slide = (x, y = 0, ms = 600) => ({ transform: `translate(${x}px, ${y}px)`, transition: `transform ${ms}ms cubic-bezier(0.65, 0, 0.35, 1)` });
const BTN = 'px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed';
const BTN_MAIN = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed';
const indianCommas = (n) => {
  const s = String(n);
  if (s.length <= 3) return s;
  return `${s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${s.slice(-3)}`;
};

// Restarts a 0 → 1 progress value whenever `key` changes (drives step-by-step animations)
function useReplay(key, duration = 1200) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    setT(0);
    const tick = (now) => {
      const p = clamp((now - start) / duration, 0, 1); // rAF timestamps can be slightly before `start`
      setT(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration]);
  return t;
}

// Small deterministic random generator so pictures look the same every time
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── WIDGET 1: Children in a line call out how many of their neighbours are taller ───
const KIDS = [
  null,
  { name: 'Tinku', color: SKY },
  { name: 'Aman', color: GREEN },
  { name: 'Riya', color: PINK },
  { name: 'Kabir', color: PURPLE },
  { name: 'Zoya', color: '#fb923c' },
  { name: 'Sunny', color: '#2dd4bf' },
  { name: 'Meera', color: '#facc15' },
];
const cmOf = (rank) => 128 + rank * 5;
const tallerCounts = (order) => order.map((h, i) => [order[i - 1], order[i + 1]].filter((x) => x !== undefined && x > h).length);
const CALL_COLORS = ['#94a3b8', SKY, AMBER];

export function Class6TallerNeighboursWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ order: [2, 4, 1, 5, 3], reveal: true, highlight: null, task: null }, visual);
  const [sel, setSel] = useState(null);
  const order = s.order;
  const n = order.length;
  const counts = tallerCounts(order);
  const twos = counts.filter((c) => c === 2).length;
  const done = s.task === 'two2' && twos >= 2;

  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const orderKey = order.join('-');
  useEffect(() => { setSel(null); }, [orderKey]);

  const gap = W / n;
  const xOf = (i) => gap * i + gap / 2;
  const ground = 292;
  const hpx = (rank) => 92 + rank * 22;
  const tallest = Math.max(...order);

  const tap = (rank) => {
    const i = order.indexOf(rank);
    if (sel === null) { setSel(i); return; }
    if (sel !== i) {
      const o = [...order];
      [o[sel], o[i]] = [o[i], o[sel]];
      update({ order: o });
    }
    setSel(null);
  };
  const shuffle = () => {
    const o = [...order];
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    update({ order: o });
  };
  const resize = (k) => {
    const size = clamp(n + k, 3, 7);
    if (size === n) return;
    update({ order: size > n ? [...order, size] : order.filter((r) => r !== n) });
  };

  return (
    <StoryStage
      eyebrow="Visualizer · Numbers can tell us things"
      title="How many of my neighbours are taller?"
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task === 'two2' && <TaskBanner text="Your turn: swap children until TWO of them call out 2." done={done} />}
          <div className="flex flex-wrap items-center gap-2">
            <Readout label="Numbers called out" value={s.reveal ? counts.join(' · ') : '?'} tone="text-amber-300" />
            <Readout label="Children saying 2" value={s.reveal ? twos : '?'} tone="text-sky-300" />
            <span className="text-[11px] text-slate-400">Tap one child, then another, to swap them.</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={BTN} onClick={() => update({ order: [...order].sort((a, b) => a - b) })}>Shortest to tallest</button>
            <button className={BTN} onClick={shuffle}>Shuffle</button>
            <button className={BTN} onClick={() => resize(1)} disabled={n >= 7}>+ child</button>
            <button className={BTN} onClick={() => resize(-1)} disabled={n <= 3}>− child</button>
            <button className={BTN} onClick={() => update({ reveal: !s.reveal })}>{s.reveal ? 'Hide numbers' : 'Show numbers'}</button>
          </div>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <rect x="0" y={ground} width={W} height={H - ground} fill="#14532d" opacity="0.35" />
        <line x1="0" y1={ground} x2={W} y2={ground} stroke="#166534" strokeWidth="3" />
        {s.highlight === 'ends' && [0, n - 1].map((i) => (
          <g key={`e${i}`} style={pop(0, 400)}>
            <rect x={xOf(i) - gap / 2 + 6} y="18" width={gap - 12} height={ground - 18} rx="14" fill={PINK} opacity="0.12" stroke={PINK} strokeDasharray="6 5" />
            <text x={xOf(i)} y="40" textAnchor="middle" fill={PINK} fontSize="12" fontWeight="800" fontFamily="sans-serif">1 neighbour</text>
          </g>
        ))}
        {s.highlight === 'tallest' && (
          <g key={`t${orderKey}`} style={pop(600, 400)}>
            <rect x={xOf(order.indexOf(tallest)) - gap / 2 + 6} y="18" width={gap - 12} height={ground - 18} rx="14" fill={GREEN} opacity="0.12" stroke={GREEN} strokeDasharray="6 5" />
          </g>
        )}
        {/* Arrows from each child to every taller neighbour */}
        {s.reveal && order.map((h, i) => [i - 1, i + 1].filter((j) => j >= 0 && j < n && order[j] > h).map((j) => {
          const y = ground - hpx(h) + 16;
          const x1 = xOf(i) + (j > i ? 22 : -22);
          const x2 = xOf(j) + (j > i ? -24 : 24);
          return (
            <g key={`${orderKey}-${i}-${j}`} style={pop(650, 350)}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={AMBER} strokeWidth="2.5" strokeDasharray="5 4" />
              <polygon points={`${x2},${y} ${x2 + (j > i ? -9 : 9)},${y - 5} ${x2 + (j > i ? -9 : 9)},${y + 5}`} fill={AMBER} />
            </g>
          );
        }))}
        {order.map((rank, i) => {
          const kid = KIDS[rank];
          const h = hpx(rank);
          const top = ground - h;
          const c = counts[i];
          return (
            <g key={rank} style={slide(xOf(i))} onClick={() => tap(rank)} className="cursor-pointer">
              {sel === i && <rect x={-28} y={top - 8} width="56" height={h + 8} rx="12" fill="none" stroke={SKY} strokeWidth="2.5" />}
              <rect x={-17} y={top + 32} width="34" height={h - 70} rx="10" fill={kid.color} opacity="0.9" />
              <rect x={-13} y={ground - 40} width="11" height="40" rx="4" fill="#cbd5e1" />
              <rect x={2} y={ground - 40} width="11" height="40" rx="4" fill="#cbd5e1" />
              <circle cx="0" cy={top + 16} r="16" fill="#fcd9b6" />
              <circle cx="-5" cy={top + 14} r="2" fill="#020617" />
              <circle cx="5" cy={top + 14} r="2" fill="#020617" />
              <path d={`M -5 ${top + 21} Q 0 ${top + 25} 5 ${top + 21}`} stroke="#020617" strokeWidth="1.5" fill="none" />
              <text x="0" y={top + 58} textAnchor="middle" fill="#020617" fontSize="12" fontWeight="900" fontFamily="monospace">{cmOf(rank)}</text>
              <text x="0" y={ground + 22} textAnchor="middle" fill={INK} fontSize="13" fontWeight="800" fontFamily="sans-serif">{kid.name}</text>
              <text x="0" y={ground + 40} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">{cmOf(rank)} cm</text>
              {s.reveal && (
                <g key={`${orderKey}-${c}`} style={pop(700, 380)}>
                  <circle cx="0" cy={top - 24} r="17" fill="#0f172a" stroke={CALL_COLORS[c]} strokeWidth="3" />
                  <text x="0" y={top - 17} textAnchor="middle" fill={CALL_COLORS[c]} fontSize="20" fontWeight="900" fontFamily="monospace">{c}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Supercells: a number bigger than all its neighbours ───
const superRow = (row) => row.map((v, i) => (i === 0 || v > row[i - 1]) && (i === row.length - 1 || v > row[i + 1]));
const superGrid = (g) => g.map((r, i) => r.map((v, j) => [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].every(([a, b]) => g[a]?.[b] === undefined || v > g[a][b])));
const DEFAULT_ROW = [46, 82, 37, 65, 91, 28, 54];
const DEFAULT_GRID = [[34, 52, 18, 40], [61, 27, 45, 12], [19, 73, 30, 56]];

export function Class6SupercellsWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'row', row: DEFAULT_ROW, grid: DEFAULT_GRID, reveal: true, mark: null, select: null, task: null }, visual);
  const isRow = s.mode === 'row';
  const row = s.row;
  const grid = s.grid;
  const supR = superRow(row);
  const supG = superGrid(grid);
  const count = isRow ? supR.filter(Boolean).length : supG.flat().filter(Boolean).length;
  const done = isRow && s.task && count >= s.task;

  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const tapRow = (i) => {
    if (s.select === null || s.select === undefined) return update({ select: i });
    if (s.select === i) return update({ select: null });
    const r = [...row];
    [r[s.select], r[i]] = [r[i], r[s.select]];
    return update({ row: r, select: null });
  };
  const tapGrid = (i, j) => {
    const sel = s.select;
    if (!Array.isArray(sel)) return update({ select: [i, j] });
    if (sel[0] === i && sel[1] === j) return update({ select: null });
    const g = grid.map((r) => [...r]);
    [g[sel[0]][sel[1]], g[i][j]] = [g[i][j], g[sel[0]][sel[1]]];
    return update({ grid: g, select: null });
  };
  const shuffle = () => {
    const vals = isRow ? [...row] : grid.flat();
    for (let i = vals.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [vals[i], vals[j]] = [vals[j], vals[i]]; }
    if (isRow) update({ row: vals, select: null });
    else update({ grid: grid.map((r, i) => vals.slice(i * r.length, (i + 1) * r.length)), select: null });
  };

  // Explanation of the selected cell
  let explain = 'Tap a cell to compare it with its neighbours. Tap a second cell to swap the two numbers.';
  if (isRow && Number.isInteger(s.select) && row[s.select] !== undefined) {
    const v = row[s.select];
    const nb = [row[s.select - 1], row[s.select + 1]].filter((x) => x !== undefined);
    explain = `${v} vs neighbour${nb.length > 1 ? 's' : ''} ${nb.join(' and ')}: ${supR[s.select] ? 'bigger than all of them, so it is a supercell!' : 'not bigger than all of them, so not a supercell.'}`;
  }
  if (!isRow && Array.isArray(s.select) && grid[s.select[0]]?.[s.select[1]] !== undefined) {
    const [a, b] = s.select;
    const v = grid[a][b];
    const nb = [[a - 1, b], [a + 1, b], [a, b - 1], [a, b + 1]].map(([x, y]) => grid[x]?.[y]).filter((x) => x !== undefined);
    explain = `${v} vs neighbours ${nb.join(', ')}: ${supG[a][b] ? 'bigger than all of them, so it is a supercell!' : 'not bigger than all of them, so not a supercell.'}`;
  }

  const maxV = isRow ? Math.max(...row) : Math.max(...grid.flat());
  const minV = isRow ? Math.min(...row) : Math.min(...grid.flat());

  const cell = (v, isSuper, selected, neighbour, x, y, size, onClick, delay, inside = false) => (
    <g key={v} style={slide(x, y, 550)} onClick={onClick} className="cursor-pointer">
      <rect x={4} y={4} width={size - 8} height={size - 8} rx="10"
        fill={s.reveal && isSuper ? AMBER : '#1e293b'} fillOpacity={s.reveal && isSuper ? 0.9 : 1}
        stroke={selected ? SKY : neighbour ? PINK : '#334155'} strokeWidth={selected || neighbour ? 3 : 1.5}
        strokeDasharray={neighbour ? '6 4' : 'none'} style={{ transition: 'fill 400ms' }} />
      <text x={size / 2} y={size / 2 + 7} textAnchor="middle" fill={s.reveal && isSuper ? '#020617' : INK} fontSize={Math.min(22, size * 0.34)} fontWeight="900" fontFamily="monospace">{v}</text>
      {s.reveal && isSuper && (
        <text key={`star${v}`} x={inside ? size - 15 : size / 2} y={inside ? 20 : -2} textAnchor="middle" fill={inside ? '#020617' : AMBER} fontSize={inside ? 12 : 16} style={{ ...pop(delay, 380), animation: `npPop 380ms ease ${delay}ms forwards, npPulse 1.6s ease ${delay + 400}ms infinite` }}>★</text>
      )}
    </g>
  );

  let stage;
  if (isRow) {
    const n = row.length;
    const cs = Math.min(76, 560 / n);
    const x0 = 300 - (n * cs) / 2;
    const y0 = 140;
    const sel = Number.isInteger(s.select) ? s.select : null;
    stage = (
      <g>
        {row.map((v, i) => cell(v, supR[i], sel === i, sel !== null && Math.abs(sel - i) === 1, x0 + i * cs, y0, cs, () => tapRow(i), i * 120))}
        {row.slice(0, -1).map((v, i) => (
          <text key={`cmp${i}-${v}-${row[i + 1]}`} x={x0 + (i + 1) * cs} y={y0 + cs + 26} textAnchor="middle" fill="#94a3b8" fontSize="18" fontWeight="900" fontFamily="monospace" style={pop(500, 300)}>{v > row[i + 1] ? '>' : '<'}</text>
        ))}
        {s.mark === 'maxmin' && (
          <g key={`mm${row.join('-')}`}>
            <text x={x0 + row.indexOf(maxV) * cs + cs / 2} y={y0 - 34} textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="800" fontFamily="sans-serif" style={pop(300, 400)}>largest: always super</text>
            <text x={x0 + row.indexOf(minV) * cs + cs / 2} y={y0 + cs + 52} textAnchor="middle" fill={RED} fontSize="12" fontWeight="800" fontFamily="sans-serif" style={pop(600, 400)}>smallest: never super</text>
          </g>
        )}
        <text x="300" y="60" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">In a row, a cell's neighbours are the cells just left and right of it.</text>
      </g>
    );
  } else {
    const R = grid.length;
    const C = grid[0].length;
    const cs = Math.min(70, 300 / R, 520 / C);
    const x0 = 300 - (C * cs) / 2;
    const y0 = 186 - (R * cs) / 2;
    const sel = Array.isArray(s.select) ? s.select : null;
    stage = (
      <g>
        {grid.map((r, i) => r.map((v, j) => {
          const isSel = sel && sel[0] === i && sel[1] === j;
          const isNb = sel && Math.abs(sel[0] - i) + Math.abs(sel[1] - j) === 1;
          return cell(v, supG[i][j], isSel, isNb, x0 + j * cs, y0 + i * cs, cs, () => tapGrid(i, j), (i * C + j) * 80, true);
        }))}
        {s.mark === 'maxmin' && (
          <text x="300" y={y0 + R * cs + 26} textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">The largest number ({maxV}) is always a supercell; the smallest ({minV}) never is.</text>
        )}
        <text x="300" y="16" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">Neighbours share a side: above, below, left, right.</text>
      </g>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Supercells"
      title={isRow ? 'Supercells in a row' : 'Supercells in a table'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task && <TaskBanner text={`Your turn: swap numbers until this row has ${s.task} supercells.`} done={!!done} />}
          <div className="flex flex-wrap items-center gap-2">
            <ModePills value={s.mode} onChange={(mode) => update({ mode, select: null })} options={[{ value: 'row', label: 'Row' }, { value: 'grid', label: 'Table' }]} />
            <button className={BTN} onClick={shuffle}>Shuffle</button>
            <button className={BTN} onClick={() => update({ reveal: !s.reveal })}>{s.reveal ? 'Hide supercells' : 'Show supercells'}</button>
            <Readout label="Supercells" value={s.reveal ? count : '?'} tone="text-amber-300" />
          </div>
          <p className="text-sm text-slate-300">{explain}</p>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {stage}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Digit detectives: digit sums on a 1–100 board and on the number line ───
const digitSum = (n) => String(n).split('').reduce((a, d) => a + Number(d), 0);

export function Class6DigitPlayWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'sum', target: 14, show: true, digit: 7, task: false }, visual);
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const target = clamp(s.target, 1, 18);
  const nums = Array.from({ length: 100 }, (_, i) => i + 1);
  const matches = nums.filter((n) => digitSum(n) === target);
  const taskTarget = visual?.target;
  const done = s.task && s.mode === 'sum' && target === taskTarget && matches.every((m) => found.includes(m));

  useEffect(() => { setFound([]); setWrong(null); }, [target, s.mode, s.task]);
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  useEffect(() => {
    if (wrong === null) return undefined;
    const t = setTimeout(() => setWrong(null), 600);
    return () => clearTimeout(t);
  }, [wrong]);

  const tapCell = (n) => {
    if (s.mode !== 'sum' || s.show) return;
    if (digitSum(n) === target) setFound((f) => (f.includes(n) ? f : [...f, n]));
    else setWrong(n);
  };

  const cellX = (n) => 50 + ((n - 1) % 10) * 50;
  const cellY = (n) => 18 + Math.floor((n - 1) / 10) * 32.5;

  // Digit count mode
  const occ = (n) => String(n).split('').filter((d) => Number(d) === s.digit).length;
  const totalOcc = nums.reduce((a, n) => a + occ(n), 0);
  const withDigit = nums.filter((n) => occ(n) > 0);

  // Number line mode
  const lineNums = Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => digitSum(n) === target);
  const hop = Math.min(320, 2400 / Math.max(1, lineNums.length - 1));
  const p = useReplay(`${s.mode}-${target}`, hop * Math.max(1, lineNums.length - 1) + 400);
  const lx = (n) => 40 + n * 5.25;
  const axisY = 205;

  let ball = null;
  if (s.mode === 'line' && lineNums.length > 1) {
    const f = clamp((p * (hop * (lineNums.length - 1) + 400) - 300) / hop, 0, lineNums.length - 1);
    const k = Math.min(Math.floor(f), lineNums.length - 2);
    const t = f - k;
    const x1 = lx(lineNums[k]);
    const x2 = lx(lineNums[k + 1]);
    const yq = (1 - t) * (1 - t) * (axisY - 8) + 2 * t * (1 - t) * 110 + t * t * (axisY - 8);
    ball = { x: x1 + (x2 - x1) * t, y: yq };
  }

  const titles = { sum: `Numbers from 1 to 100 with digit sum ${target}`, count: `Where does the digit ${s.digit} hide in 1 to 100?`, line: `Digit sum ${target} on the number line` };

  return (
    <StoryStage
      eyebrow="Visualizer · Digit Detectives"
      title={titles[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task && <TaskBanner text={`Your turn: tap every number up to 100 whose digits add up to ${taskTarget} (${found.length} of ${matches.length} found).`} done={!!done} />}
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'sum', label: 'Digit sums' }, { value: 'line', label: 'On the number line' }, { value: 'count', label: 'Count a digit' }]} />
          {s.mode !== 'count' && !s.task && (
            <label className="block text-xs text-slate-400">
              Digit sum: <span className="text-amber-300 font-mono font-bold">{target}</span>
              <input type="range" min="1" max="18" value={target} onChange={(e) => update({ target: +e.target.value, show: true })} className="w-full accent-amber-400" />
            </label>
          )}
          {s.mode === 'count' && (
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, d) => (
                <button key={d} onClick={() => update({ digit: d })} className={`w-8 h-8 rounded-lg text-sm font-black border ${s.digit === d ? 'border-pink-400 text-pink-300 bg-pink-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{d}</button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {s.mode === 'sum' && <Readout label="How many?" value={s.show || done ? matches.length : '?'} tone="text-amber-300" />}
            {s.mode === 'sum' && s.show && <Readout label="The numbers" value={<span className="text-sm">{matches.join(', ')}</span>} tone="text-amber-200" />}
            {s.mode === 'line' && <Readout label="Each jump" value="+ 9" tone="text-sky-300" />}
            {s.mode === 'line' && <Readout label="Numbers" value={<span className="text-sm">{lineNums.join(', ')}</span>} tone="text-amber-200" />}
            {s.mode === 'count' && <Readout label={`Times ${s.digit} is written`} value={totalOcc} tone="text-pink-300" />}
            {s.mode === 'count' && <Readout label={`Numbers containing ${s.digit}`} value={withDigit.length} tone="text-sky-300" />}
          </div>
        </div>
      }
    >
      <svg key={s.mode} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.mode !== 'line' && nums.map((n) => {
          const x = cellX(n);
          const y = cellY(n);
          let fill = '#0f172a';
          let stroke = '#1e293b';
          let txt = '#94a3b8';
          let style;
          if (s.mode === 'sum') {
            const isMatch = digitSum(n) === target;
            if (isMatch && (s.show || found.includes(n))) {
              fill = found.includes(n) && !s.show ? GREEN : AMBER; txt = '#020617'; stroke = fill;
              style = s.show ? pop(matches.indexOf(n) * 160, 380) : pop(0, 300);
            }
            if (wrong === n) { fill = RED; txt = '#020617'; stroke = RED; }
          } else if (occ(n) > 0) {
            fill = 'rgba(244,114,182,0.15)'; stroke = PINK; txt = INK;
            style = pop(withDigit.indexOf(n) * 70, 300);
          }
          return (
            <g key={`${n}-${target}-${s.digit}`} onClick={() => tapCell(n)} className={s.mode === 'sum' && !s.show ? 'cursor-pointer' : ''}>
              <rect x={x + 2} y={y + 2} width="46" height="28.5" rx="6" fill="#0f172a" stroke="#1e293b" />
              <g style={style}>
                <rect x={x + 2} y={y + 2} width="46" height="28.5" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
              </g>
              <text x={x + 25} y={y + 22} textAnchor="middle" fill={txt} fontSize="15" fontWeight="800" fontFamily="monospace">
                {s.mode === 'count'
                  ? String(n).split('').map((d, k) => <tspan key={k} fill={Number(d) === s.digit ? PINK : txt} fontWeight={Number(d) === s.digit ? 900 : 700}>{d}</tspan>)
                  : n}
              </text>
            </g>
          );
        })}
        {s.mode === 'line' && (
          <g>
            <line x1="30" y1={axisY} x2="570" y2={axisY} stroke="#64748b" strokeWidth="2.5" />
            {Array.from({ length: 100 }, (_, i) => (
              <line key={i} x1={lx(i)} y1={axisY - (i % 10 === 0 ? 9 : 4)} x2={lx(i)} y2={axisY + (i % 10 === 0 ? 9 : 4)} stroke="#475569" strokeWidth={i % 10 === 0 ? 2 : 1} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <text key={i} x={lx(i * 10)} y={axisY + 26} textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">{i * 10}</text>
            ))}
            {lineNums.slice(0, -1).map((n, i) => {
              const x1 = lx(n);
              const x2 = lx(lineNums[i + 1]);
              return (
                <g key={`arc${target}-${n}`}>
                  <path d={`M ${x1} ${axisY - 8} Q ${(x1 + x2) / 2} 110 ${x2} ${axisY - 8}`} fill="none" stroke={SKY} strokeWidth="2" pathLength="1" style={draw(300 + i * hop, hop)} />
                  <text x={(x1 + x2) / 2} y="150" textAnchor="middle" fill={SKY} fontSize="12" fontWeight="800" fontFamily="monospace" style={pop(300 + (i + 0.6) * hop, 250)}>+9</text>
                </g>
              );
            })}
            {lineNums.map((n, i) => (
              <g key={`m${target}-${n}`} style={pop(300 + i * hop, 300)}>
                <circle cx={lx(n)} cy={axisY} r="7" fill={AMBER} />
                <rect x={lx(n) - 16} y={axisY + 40} width="32" height="24" rx="6" fill="#1e293b" stroke={AMBER} />
                <text x={lx(n)} y={axisY + 57} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily="monospace">{n}</text>
              </g>
            ))}
            {ball && <circle cx={ball.x} cy={ball.y} r="7" fill={PINK} />}
            <text x="300" y="312" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif">One more ten and one less one: + 10 − 1 = + 9 every jump.</text>
            <text x="300" y="40" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily="sans-serif">Numbers up to 99 whose digits add up to {target}</text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Palindromes: reverse-and-add, clock times and calendar dates ───
const isPal = (str) => str === str.split('').reverse().join('');
function reverseAddSeq(start, cap = 30) {
  let n = BigInt(start);
  const seq = [n];
  while (!isPal(n.toString()) && seq.length <= cap) {
    n += BigInt(n.toString().split('').reverse().join(''));
    seq.push(n);
  }
  return seq;
}
const SEG = { a: [6, 0, 44, 10], g: [6, 45, 44, 10], d: [6, 90, 44, 10], f: [0, 6, 10, 42], b: [46, 6, 10, 42], e: [0, 52, 10, 42], c: [46, 52, 10, 42] };
const DIGIT_SEGS = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abcdfg'];
const wrapTime = (t) => (((t - 60) % 720) + 720) % 720 + 60;
const timeStr = (t) => `${Math.floor(t / 60)}${String(t % 60).padStart(2, '0')}`;
const timeLabel = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
const PAL_TIMES = Array.from({ length: 720 }, (_, i) => i + 60).filter((t) => isPal(timeStr(t)));
const DATES = [
  { d: '02022020', label: '02-02-2020' },
  { d: '12022021', label: '12-02-2021' },
  { d: '22022022', label: '22-02-2022' },
  { d: '18102026', label: '18-10-2026' },
  { d: '03022030', label: '03-02-2030' },
];

function SevenSeg({ d, x, y, color }) {
  const on = DIGIT_SEGS[d] || '';
  return (
    <g transform={`translate(${x} ${y})`}>
      {Object.entries(SEG).map(([k, [sx, sy, w, h]]) => (
        <rect key={k} x={sx} y={sy} width={w} height={h} rx="4" fill={on.includes(k) ? color : '#1e293b'} style={{ transition: 'fill 200ms' }} />
      ))}
    </g>
  );
}

function MirrorArcs({ count, xOf, y, color = GREEN, keyBase, delay = 0, depth = 14 }) {
  return (
    <g>
      {Array.from({ length: Math.floor(count / 2) }, (_, i) => {
        const x1 = xOf(i);
        const x2 = xOf(count - 1 - i);
        return (
          <path key={`${keyBase}-${i}`} d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + depth + (x2 - x1) * 0.18} ${x2} ${y}`} fill="none" stroke={color} strokeWidth="2.5" pathLength="1" style={draw(delay + i * 150, 500)} />
        );
      })}
    </g>
  );
}

export function Class6PalindromeWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'reverse', start: 39, step: 0, time: 465, date: '22022022', task: false }, visual);
  const [input, setInput] = useState(String(s.start));
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setInput(String(s.start)); setPlaying(false); }, [s.start]);

  const seq = useMemo(() => reverseAddSeq(clamp(Number(s.start) || 1, 1, 999999)), [s.start]);
  const maxStep = seq.length - 1;
  const step = clamp(s.step, 0, maxStep);
  const p = useReplay(`${s.mode}-${s.start}-${step}`, step === 0 ? 700 : 1600);
  const reachedPal = isPal(seq[maxStep].toString());

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= maxStep) { setPlaying(false); return undefined; }
    const t = setTimeout(() => update({ step: step + 1 }), 1800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, maxStep]);

  // Clock
  const time = wrapTime(s.time);
  const shown = wrapTime(Math.round(useTween(s.time, 1200)));
  const clockPal = isPal(timeStr(time));
  const showPal = clockPal && shown === time;
  const done = s.task && s.mode === 'clock' && clockPal;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const nextPal = () => {
    let t = s.time + 1;
    while (!isPal(timeStr(wrapTime(t)))) t += 1;
    update({ time: t });
  };

  const applyInput = () => {
    const v = clamp(Number(input) || 1, 1, 999999);
    update({ start: v, step: 0 });
  };

  let stage = null;
  if (s.mode === 'reverse') {
    if (step === 0) {
      const str = seq[0].toString();
      const tw = Math.min(56, 460 / str.length);
      const x0 = 300 - (str.length * tw) / 2;
      const pal = isPal(str);
      stage = (
        <g key={`s0-${s.start}`}>
          <text x="300" y="70" textAnchor="middle" fill="#94a3b8" fontSize="14" fontFamily="sans-serif">Start number</text>
          {str.split('').map((d, i) => (
            <g key={i} style={pop(i * 90, 320)}>
              <rect x={x0 + i * tw + 3} y="110" width={tw - 6} height={tw * 1.1} rx="8" fill={pal ? GREEN : '#1e293b'} fillOpacity={pal ? 0.85 : 1} stroke={pal ? GREEN : '#475569'} />
              <text x={x0 + i * tw + tw / 2} y={110 + tw * 0.75} textAnchor="middle" fill={pal ? '#020617' : AMBER} fontSize={tw * 0.6} fontWeight="900" fontFamily="monospace">{d}</text>
            </g>
          ))}
          {pal && <MirrorArcs count={str.length} xOf={(i) => x0 + i * tw + tw / 2} y={118 + tw * 1.1} keyBase={`p0${str}`} delay={500} />}
          <text x="300" y="300" textAnchor="middle" fill={pal ? GREEN : INK} fontSize="18" fontWeight="900" fontFamily="sans-serif" style={pop(700, 400)}>
            {pal ? 'Same from both ends: a palindrome!' : 'Not a palindrome. Reverse it and add!'}
          </text>
        </g>
      );
    } else {
      const a = seq[step - 1].toString();
      const sum = seq[step].toString();
      const L = a.length;
      const M = sum.length;
      const tw = Math.min(46, 430 / M);
      const right = 300 + (M * tw) / 2 - tw / 2 + 20;
      const colX = (j) => right - j * tw;
      const y1 = 52;
      const y2 = 118;
      const y3 = 196;
      const pm = phase(p, 0, 0.45);
      const pal = isPal(sum);
      const fs = tw * 0.62;
      stage = (
        <g>
          <text x={colX(M - 1) - tw / 2 - 34} y={y1 + tw * 0.62} textAnchor="end" fill="#64748b" fontSize="12" fontFamily="sans-serif">number</text>
          <text x={colX(M - 1) - tw / 2 - 34} y={y2 + tw * 0.62} textAnchor="end" fill="#64748b" fontSize="12" fontFamily="sans-serif">reversed</text>
          {a.split('').map((d, i) => (
            <g key={`a${i}`}>
              <rect x={colX(L - 1 - i) - tw / 2 + 2} y={y1} width={tw - 4} height={tw} rx="7" fill="#1e293b" stroke="#475569" />
              <text x={colX(L - 1 - i)} y={y1 + tw * 0.72} textAnchor="middle" fill={AMBER} fontSize={fs} fontWeight="900" fontFamily="monospace">{d}</text>
            </g>
          ))}
          {a.split('').map((d, i) => {
            const fromX = colX(L - 1 - i);
            const toX = colX(i);
            const x = fromX + (toX - fromX) * pm;
            const y = y1 + (y2 - y1) * pm;
            const lead = i === L - 1 && d === '0' && L > 1;
            return (
              <g key={`r${i}`} opacity={lead ? 0.45 : 1}>
                <rect x={x - tw / 2 + 2} y={y} width={tw - 4} height={tw} rx="7" fill="#0c4a6e" stroke={SKY} />
                <text x={x} y={y + tw * 0.72} textAnchor="middle" fill={SKY} fontSize={fs} fontWeight="900" fontFamily="monospace">{d}</text>
              </g>
            );
          })}
          <g opacity={phase(p, 0.45, 0.55)}>
            <text x={colX(M - 1) - tw / 2 - 6} y={y2 + tw * 0.72} textAnchor="end" fill={INK} fontSize="26" fontWeight="900" fontFamily="monospace">+</text>
            <line x1={colX(M - 1) - tw / 2 - 26} y1={y2 + tw + 14} x2={colX(0) + tw / 2} y2={y2 + tw + 14} stroke={INK} strokeWidth="2.5" />
          </g>
          {sum.split('').map((d, i) => {
            const j = M - 1 - i;
            const show = phase(p, 0.55 + (j * 0.35) / M, 0.6 + (j * 0.35) / M);
            return (
              <g key={`s${i}`} opacity={show}>
                <rect x={colX(j) - tw / 2 + 2} y={y3 + (1 - show) * -18} width={tw - 4} height={tw} rx="7" fill={pal && p > 0.95 ? GREEN : '#1e293b'} stroke={pal ? GREEN : '#475569'} style={{ transition: 'fill 300ms' }} />
                <text x={colX(j)} y={y3 + tw * 0.72 + (1 - show) * -18} textAnchor="middle" fill={pal && p > 0.95 ? '#020617' : INK} fontSize={fs} fontWeight="900" fontFamily="monospace">{d}</text>
              </g>
            );
          })}
          {p > 0.95 && pal && <MirrorArcs count={M} xOf={(i) => colX(M - 1 - i)} y={y3 + tw + 6} keyBase={`m${sum}`} />}
          {p > 0.95 && (
            <text x="300" y="330" textAnchor="middle" fill={pal ? GREEN : '#94a3b8'} fontSize="17" fontWeight="900" fontFamily="sans-serif" style={pop(200, 350)}>
              {pal ? `Palindrome after ${step} step${step > 1 ? 's' : ''}!` : (step === maxStep ? `Still no palindrome after ${step} steps…` : 'Not a palindrome yet. Reverse and add again!')}
            </text>
          )}
        </g>
      );
    }
  } else if (s.mode === 'clock') {
    const str = timeStr(shown);
    const color = showPal ? GREEN : AMBER;
    const dw = 74;
    const total = str.length * dw + 30;
    const x0 = 300 - total / 2;
    const xs = str.split('').map((_, i) => x0 + i * dw + (i >= str.length - 2 ? 30 : 0));
    stage = (
      <g>
        <rect x={x0 - 26} y="56" width={total + 40} height="160" rx="20" fill="#0b1220" stroke={showPal ? GREEN : '#334155'} strokeWidth="3" style={{ transition: 'stroke 300ms' }} />
        {str.split('').map((d, i) => <SevenSeg key={i} d={Number(d)} x={xs[i]} y={86} color={color} />)}
        <circle cx={xs[str.length - 2] - 22} cy="118" r="6" fill={color} style={{ animation: 'npPulse 1s infinite' }} />
        <circle cx={xs[str.length - 2] - 22} cy="154" r="6" fill={color} style={{ animation: 'npPulse 1s infinite' }} />
        {showPal && <MirrorArcs count={str.length} xOf={(i) => xs[i] + 28} y={226} keyBase={`c${str}`} depth={18} />}
        <text x="300" y="326" textAnchor="middle" fill={showPal ? GREEN : '#94a3b8'} fontSize="17" fontWeight="900" fontFamily="sans-serif">
          {showPal ? `${timeLabel(time)} reads the same both ways!` : `Digits ${str.split('').join(' ')} backwards: ${str.split('').reverse().join(' ')}`}
        </text>
      </g>
    );
  } else {
    const str = s.date;
    const tw = 52;
    const xs = str.split('').map((_, i) => 48 + i * (tw + 8) + (i >= 2 ? 16 : 0) + (i >= 4 ? 16 : 0));
    const pal = isPal(str);
    stage = (
      <g key={str}>
        <text x="300" y="56" textAnchor="middle" fill="#94a3b8" fontSize="14" fontFamily="sans-serif">Date written as DD-MM-YYYY</text>
        {str.split('').map((d, i) => (
          <g key={i} style={pop(i * 90, 320)}>
            <rect x={xs[i]} y="100" width={tw} height="64" rx="8" fill={pal ? 'rgba(52,211,153,0.15)' : '#1e293b'} stroke={pal ? GREEN : '#475569'} strokeWidth="2" />
            <rect x={xs[i]} y="100" width={tw} height="16" rx="6" fill={RED} opacity="0.7" />
            <text x={xs[i] + tw / 2} y="154" textAnchor="middle" fill={pal ? GREEN : INK} fontSize="30" fontWeight="900" fontFamily="monospace">{d}</text>
          </g>
        ))}
        <text x={xs[2] - 12} y="142" textAnchor="middle" fill="#64748b" fontSize="24" fontWeight="900">-</text>
        <text x={xs[4] - 12} y="142" textAnchor="middle" fill="#64748b" fontSize="24" fontWeight="900">-</text>
        {Array.from({ length: 4 }, (_, i) => {
          const x1 = xs[i] + tw / 2;
          const x2 = xs[7 - i] + tw / 2;
          const same = str[i] === str[7 - i];
          return (
            <path key={`${str}-${i}`} d={`M ${x1} 172 Q ${(x1 + x2) / 2} ${190 + (x2 - x1) * 0.22} ${x2} 172`} fill="none" stroke={same ? GREEN : RED} strokeWidth="2.5" strokeDasharray={same ? undefined : '6 5'} pathLength={same ? 1 : undefined} style={same ? draw(800 + i * 200, 500) : pop(800 + i * 200, 300)} />
          );
        })}
        <text x="300" y="320" textAnchor="middle" fill={pal ? GREEN : '#94a3b8'} fontSize="17" fontWeight="900" fontFamily="sans-serif" style={pop(1600, 400)}>
          {pal ? 'A palindrome date: 8 digits that mirror each other!' : `Backwards it reads ${str.split('').reverse().join('')}: not a palindrome.`}
        </text>
      </g>
    );
  }

  const hourPals = PAL_TIMES.filter((t) => Math.floor(t / 60) === Math.floor(time / 60));
  const history = seq.slice(0, step + 1).map((v) => v.toString());

  return (
    <StoryStage
      eyebrow="Visualizer · Palindromes"
      title={{ reverse: 'Reverse and add', clock: 'Palindromic times', calendar: 'Palindromic dates' }[s.mode]}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task && s.mode === 'clock' && <TaskBanner text="Your turn: change the time until the clock shows a palindrome." done={!!done} />}
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'reverse', label: 'Reverse and add' }, { value: 'clock', label: 'Clock' }, { value: 'calendar', label: 'Calendar' }]} />
          {s.mode === 'reverse' && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} onKeyDown={(e) => e.key === 'Enter' && applyInput()} className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
                <button className={BTN} onClick={applyInput}>Start</button>
                {[39, 87, 89, 196].map((v) => <button key={v} className={BTN} onClick={() => update({ start: v, step: 0 })}>{v}</button>)}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className={BTN} onClick={() => update({ step: step - 1 })} disabled={step === 0}>◀ Back</button>
                <button className={BTN_MAIN} onClick={() => update({ step: step + 1 })} disabled={step >= maxStep}>Reverse and add ▶</button>
                <button className={BTN} onClick={() => { if (step >= maxStep) update({ step: 0 }); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play all'}</button>
                <Readout label="Steps" value={step} tone="text-sky-300" />
              </div>
              <div className="font-mono text-xs md:text-sm text-slate-300 break-all">
                {history.length > 6 && <span className="text-slate-500">… </span>}
                {history.slice(-6).map((v, i, arr) => <span key={v}>{v}{i < arr.length - 1 ? ' → ' : ''}</span>)}
                {step === maxStep && !reachedPal && <span className="text-pink-300"> (196 is a famous mystery: nobody knows if it ever becomes a palindrome)</span>}
              </div>
            </>
          )}
          {s.mode === 'clock' && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <button className={BTN} onClick={() => update({ time: s.time - 10 })}>− 10 min</button>
                <button className={BTN} onClick={() => update({ time: s.time - 1 })}>− 1 min</button>
                <button className={BTN} onClick={() => update({ time: s.time + 1 })}>+ 1 min</button>
                <button className={BTN} onClick={() => update({ time: s.time + 10 })}>+ 10 min</button>
                <button className={BTN} onClick={() => update({ time: s.time + 60 })}>+ 1 hour</button>
                <button className={BTN_MAIN} onClick={nextPal}>Fast-forward to the next palindrome ⏩</button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <Readout label="In 12 hours" value={`${PAL_TIMES.length} palindromes`} tone="text-emerald-300" />
                <span>This hour:</span>
                {hourPals.map((t) => <span key={t} className={`px-2 py-0.5 rounded-full border font-mono ${t === time ? 'border-emerald-400 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>{timeLabel(t)}</span>)}
              </div>
            </>
          )}
          {s.mode === 'calendar' && (
            <div className="flex flex-wrap gap-2">
              {DATES.map((d) => <button key={d.d} onClick={() => update({ date: d.d })} className={`${BTN} ${s.date === d.d ? 'border-amber-400 text-amber-300' : ''}`}>{d.label}</button>)}
            </div>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {stage}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Number machines: Kaprekar's 6174 and the Collatz mystery ───
function kaprekarSteps(start, d) {
  const C = d === 3 ? 495 : 6174;
  const steps = [];
  let n = start;
  for (let i = 0; i < 12; i++) {
    const ds = String(n).padStart(d, '0').split('').map(Number);
    if (ds.every((x) => x === ds[0])) break;
    const desc = [...ds].sort((a, b) => b - a);
    const asc = [...ds].sort((a, b) => a - b);
    const big = Number(desc.join(''));
    const small = Number(asc.join(''));
    steps.push({ from: n, ds, big, small, diff: big - small });
    if (n === C) break;
    n = big - small;
  }
  return steps;
}
const rankOrder = (ds, desc) => {
  const idx = ds.map((v, i) => i).sort((a, b) => (desc ? ds[b] - ds[a] : ds[a] - ds[b]) || a - b);
  const pos = [];
  idx.forEach((orig, r) => { pos[orig] = r; });
  return pos;
};
function collatz(n) {
  const seq = [n];
  while (n !== 1 && seq.length < 400) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; seq.push(n); }
  return seq;
}

export function Class6NumberMachinesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'kaprekar', start: 6382, step: 0, digits: 4, task: false }, visual);
  const d = s.digits === 3 ? 3 : 4;
  const C = d === 3 ? 495 : 6174;
  const lo = d === 3 ? 100 : 1000;
  const hi = d === 3 ? 999 : 9999;
  const isK = s.mode === 'kaprekar';
  const kStart = clamp(Number(s.start) || lo, lo, hi);
  const steps = useMemo(() => kaprekarSteps(kStart, d), [kStart, d]);
  const step = clamp(s.step, 0, steps.length);
  const current = step === 0 ? kStart : steps[step - 1].diff;
  const p = useReplay(`${s.mode}-${kStart}-${d}-${step}`, 1700);
  const [input, setInput] = useState(String(s.start));
  useEffect(() => { setInput(String(s.start)); }, [s.start, s.mode]);

  const cStart = clamp(Number(s.start) || 7, 1, 9999);
  const cseq = useMemo(() => collatz(cStart), [cStart]);
  const cdur = Math.min(2400, 140 * cseq.length);
  const cp = useReplay(`c-${cStart}-${s.mode}`, cdur);

  const done = isK && s.task && step >= 1 && current === C;
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const apply = () => {
    const v = Number(input) || 0;
    update({ start: isK ? clamp(v, lo, hi) : clamp(v, 1, 9999), step: 0 });
  };

  let stage;
  if (isK) {
    const tw = 54;
    const xOf = (i) => 250 + i * 64 + (4 - d) * 32;
    const rows = { from: 44, big: 116, small: 184, diff: 262 };
    const labels = [['Number', rows.from], ['Largest first', rows.big], ['Smallest first', rows.small], ['Difference', rows.diff]];
    const allSame = steps.length === 0;
    if (step === 0) {
      const ds = String(kStart).padStart(d, '0').split('');
      stage = (
        <g key={`k0-${kStart}-${d}`}>
          <text x="40" y={rows.from + 34} fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">Start</text>
          {ds.map((v, i) => (
            <g key={i} style={pop(i * 110, 340)}>
              <rect x={xOf(i)} y={rows.from} width={tw} height={tw} rx="10" fill="#1e293b" stroke={AMBER} strokeWidth="2" />
              <text x={xOf(i) + tw / 2} y={rows.from + 38} textAnchor="middle" fill={AMBER} fontSize="30" fontWeight="900" fontFamily="monospace">{v}</text>
            </g>
          ))}
          <text x="300" y="200" textAnchor="middle" fill={allSame ? RED : INK} fontSize="16" fontWeight="800" fontFamily="sans-serif" style={pop(500, 400)}>
            {allSame ? 'All digits are the same: the machine needs at least two different digits.' : 'Arrange the digits largest first and smallest first, then subtract.'}
          </text>
          {!allSame && <text x="300" y="232" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="sans-serif" style={pop(700, 400)}>Press “Next step” to run the machine.</text>}
        </g>
      );
    } else {
      const it = steps[step - 1];
      const dPos = rankOrder(it.ds, true);
      const aPos = rankOrder(it.ds, false);
      const pb = phase(p, 0.05, 0.4);
      const ps = phase(p, 0.2, 0.55);
      const pd = phase(p, 0.62, 0.85);
      const diffDs = String(it.diff).padStart(d, '0').split('');
      const isC = it.diff === C;
      const loop = it.from === C;
      stage = (
        <g>
          {labels.map(([t, y]) => <text key={t} x="40" y={y + 34} fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">{t}</text>)}
          {it.ds.map((v, i) => (
            <g key={`f${i}`}>
              <rect x={xOf(i)} y={rows.from} width={tw} height={tw} rx="10" fill="#1e293b" stroke="#475569" />
              <text x={xOf(i) + tw / 2} y={rows.from + 38} textAnchor="middle" fill={INK} fontSize="30" fontWeight="900" fontFamily="monospace">{v}</text>
            </g>
          ))}
          {it.ds.map((v, i) => {
            const x = xOf(i) + (xOf(dPos[i]) - xOf(i)) * pb;
            const y = rows.from + (rows.big - rows.from) * pb;
            return (
              <g key={`b${i}`} opacity={pb > 0 ? 1 : 0}>
                <rect x={x} y={y} width={tw} height={tw} rx="10" fill="#78350f" stroke={AMBER} strokeWidth="2" />
                <text x={x + tw / 2} y={y + 38} textAnchor="middle" fill={AMBER} fontSize="30" fontWeight="900" fontFamily="monospace">{v}</text>
              </g>
            );
          })}
          {it.ds.map((v, i) => {
            const x = xOf(i) + (xOf(aPos[i]) - xOf(i)) * ps;
            const y = rows.from + (rows.small - rows.from) * ps;
            return (
              <g key={`s${i}`} opacity={ps > 0 ? 1 : 0}>
                <rect x={x} y={y} width={tw} height={tw} rx="10" fill="#0c4a6e" stroke={SKY} strokeWidth="2" />
                <text x={x + tw / 2} y={y + 38} textAnchor="middle" fill={SKY} fontSize="30" fontWeight="900" fontFamily="monospace">{v}</text>
              </g>
            );
          })}
          <g opacity={phase(p, 0.55, 0.62)}>
            <text x={xOf(0) - 18} y={rows.small + 38} textAnchor="middle" fill={INK} fontSize="30" fontWeight="900" fontFamily="monospace">−</text>
            <line x1={xOf(0) - 30} y1={rows.small + tw + 12} x2={xOf(d - 1) + tw} y2={rows.small + tw + 12} stroke={INK} strokeWidth="2.5" />
          </g>
          {diffDs.map((v, i) => (
            <g key={`d${i}`} opacity={pd}>
              <rect x={xOf(i)} y={rows.diff - (1 - pd) * 20} width={tw} height={tw} rx="10" fill={isC && p > 0.9 ? GREEN : '#1e293b'} stroke={isC ? GREEN : '#475569'} strokeWidth="2" style={{ transition: 'fill 300ms' }} />
              <text x={xOf(i) + tw / 2} y={rows.diff + 38 - (1 - pd) * 20} textAnchor="middle" fill={isC && p > 0.9 ? '#020617' : INK} fontSize="30" fontWeight="900" fontFamily="monospace">{v}</text>
            </g>
          ))}
          {isC && p > 0.9 && (
            <g style={pop(0, 400)}>
              <circle cx={xOf(d - 1) + tw + 40} cy={rows.diff + tw / 2} r="22" fill="none" stroke={GREEN} strokeWidth="3">
                <animate attributeName="r" values="18;30;18" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <text x={xOf(d - 1) + tw + 40} y={rows.diff + tw / 2 + 6} textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900">★</text>
            </g>
          )}
          <text x="300" y="348" textAnchor="middle" fill={isC ? GREEN : '#94a3b8'} fontSize="14" fontWeight="800" fontFamily="sans-serif" opacity={pd}>
            {loop ? `${C} gives ${C} again: the machine is stuck forever!` : isC ? `${C}! Kaprekar's magic number after ${step} step${step > 1 ? 's' : ''}.` : `${it.big} − ${String(it.small).padStart(d, '0')} = ${it.diff}`}
          </text>
        </g>
      );
    }
  } else {
    const len = cseq.length;
    const maxV = Math.max(...cseq);
    const px = (i) => 60 + (len === 1 ? 0 : (i * 500) / (len - 1));
    const py = (v) => 290 - (v / maxV) * 230;
    const f = cp * (len - 1);
    const k = Math.floor(f);
    const segs = [];
    for (let i = 0; i < Math.min(k, len - 1); i++) {
      segs.push(<line key={i} x1={px(i)} y1={py(cseq[i])} x2={px(i + 1)} y2={py(cseq[i + 1])} stroke={cseq[i] % 2 ? PINK : SKY} strokeWidth="2.5" strokeLinecap="round" />);
    }
    let bx = px(len - 1);
    let by = py(cseq[len - 1]);
    if (k < len - 1) {
      const t = f - k;
      segs.push(<line key="partial" x1={px(k)} y1={py(cseq[k])} x2={px(k) + (px(k + 1) - px(k)) * t} y2={py(cseq[k]) + (py(cseq[k + 1]) - py(cseq[k])) * t} stroke={cseq[k] % 2 ? PINK : SKY} strokeWidth="2.5" strokeLinecap="round" />);
      bx = px(k) + (px(k + 1) - px(k)) * t;
      by = py(cseq[k]) + (py(cseq[k + 1]) - py(cseq[k])) * t;
    }
    const nowV = cseq[Math.min(len - 1, Math.round(f))];
    const labelEvery = len <= 20 ? 1 : 0;
    stage = (
      <g>
        <line x1="50" y1="290" x2="570" y2="290" stroke="#475569" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="50" y2="290" stroke="#475569" strokeWidth="1.5" />
        <text x="44" y="64" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="monospace">{maxV}</text>
        <text x="44" y="292" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="monospace">0</text>
        {segs}
        {cseq.map((v, i) => (i <= f + 0.01 ? (
          <g key={i}>
            <circle cx={px(i)} cy={py(v)} r={len > 60 ? 1.8 : 4} fill={v === 1 ? GREEN : v % 2 ? PINK : SKY} />
            {labelEvery === 1 && <text x={px(i)} y={py(v) - 10} textAnchor="middle" fill={INK} fontSize="11" fontWeight="700" fontFamily="monospace">{v}</text>}
          </g>
        ) : null))}
        <circle cx={bx} cy={by} r="8" fill={AMBER} stroke="#020617" strokeWidth="2" />
        <text x="560" y="34" textAnchor="end" fill={AMBER} fontSize="22" fontWeight="900" fontFamily="monospace">{nowV}</text>
        <text x="60" y="34" fill={SKY} fontSize="13" fontWeight="800" fontFamily="sans-serif">even: half it</text>
        <text x="170" y="34" fill={PINK} fontSize="13" fontWeight="800" fontFamily="sans-serif">odd: 3 times it, plus 1</text>
        {cp >= 1 && <text x="300" y="324" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif" style={pop(0, 400)}>Reached 1 after {len - 1} steps (highest point {indianCommas(maxV)})</text>}
      </g>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Number Machines"
      title={isK ? `Kaprekar's machine (${d} digits → ${C})` : 'The Collatz mystery: does every number fall to 1?'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task && isK && <TaskBanner text="Your turn: type your own 4-digit number (try your birth year!) and run the machine until it reaches 6174." done={!!done} />}
          <div className="flex flex-wrap items-center gap-2">
            <ModePills value={s.mode} onChange={(mode) => update({ mode, start: mode === 'kaprekar' ? 6382 : 7, step: 0 })} options={[{ value: 'kaprekar', label: "Kaprekar's 6174" }, { value: 'collatz', label: 'Collatz (3n + 1)' }]} />
            {isK && <ModePills value={d} onChange={(digits) => update({ digits, start: digits === 3 ? 352 : 6382, step: 0 })} options={[{ value: 4, label: '4 digits' }, { value: 3, label: '3 digits' }]} />}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} onKeyDown={(e) => e.key === 'Enter' && apply()} className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-amber-300" />
            <button className={BTN} onClick={apply}>Start</button>
            {isK && (
              <>
                <button className={BTN} onClick={() => update({ step: step - 1 })} disabled={step === 0}>◀ Back</button>
                <button className={BTN_MAIN} onClick={() => update({ step: step + 1 })} disabled={step >= steps.length}>Next step ▶</button>
                <Readout label="Steps" value={step} tone="text-sky-300" />
              </>
            )}
            {!isK && [6, 7, 12, 27].map((v) => <button key={v} className={BTN} onClick={() => update({ start: v })}>{v}</button>)}
          </div>
          {isK && (
            <div className="font-mono text-xs md:text-sm text-slate-300">
              {[kStart, ...steps.slice(0, step).map((x) => x.diff)].map((v, i, arr) => (
                <span key={i} className={v === C && i > 0 ? 'text-emerald-300 font-black' : ''}>{String(v).padStart(d, '0')}{i < arr.length - 1 ? ' → ' : ''}</span>
              ))}
            </div>
          )}
          {!isK && (
            <div className="flex flex-wrap gap-2">
              <Readout label="Steps to reach 1" value={cseq.length - 1} tone="text-emerald-300" />
              <Readout label="Highest point" value={indianCommas(Math.max(...cseq))} tone="text-pink-300" />
            </div>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {stage}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Estimate the crowd, and the Game of 21 against the computer ───
const BOX_COUNTS = [21, 23, 20, 22, 24, 22, 19, 22, 23, 21, 25, 20, 22, 21, 23, 20, 24, 22, 21, 22];
const ACTUAL = BOX_COUNTS.reduce((a, b) => a + b, 0);
const BOX = { cols: 5, rows: 4, w: 96, h: 58, x0: 60, y0: 30 };
const FAN_COLORS = [SKY, PINK, AMBER, GREEN, PURPLE, '#fb923c', '#e2e8f0'];
const FANS = BOX_COUNTS.map((count, b) => {
  const rng = mulberry32(b * 7919 + 13);
  const slots = Array.from({ length: 25 }, (_, i) => i);
  for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; }
  const bx = BOX.x0 + (b % BOX.cols) * BOX.w;
  const by = BOX.y0 + Math.floor(b / BOX.cols) * BOX.h;
  return slots.slice(0, count).map((sl) => ({ x: bx + 9 + (sl % 5) * 18 + rng() * 6, y: by + 7 + Math.floor(sl / 5) * 10.5 + rng() * 3, c: FAN_COLORS[Math.floor(rng() * FAN_COLORS.length)] }));
});

const stonePos = (i) => (i <= 10 ? [50 + i * 50, 92] : [550 - (i - 11) * 50, 206]);

export function Class6Game21Widget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'game', max: 3, total: 0, showMagic: false, first: 'you', task: false, step: 0, box: 7 }, visual);
  const max = s.max === 2 ? 2 : 3;
  const [g, setG] = useState({ total: s.total, log: [], turn: s.first, winner: null });
  useEffect(() => { setG({ total: clamp(s.total, 0, 21), log: [], turn: s.first, winner: null }); }, [s.total, s.max, s.first, s.mode, s.task]);

  const magic = Array.from({ length: 22 }, (_, i) => i).filter((i) => (21 - i) % (max + 1) === 0);
  const done = s.task && g.winner === 'you';
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const move = (who, a) => setG((st) => {
    if (st.winner || st.total + a > 21) return st;
    const total = st.total + a;
    return { total, log: [...st.log, { who, a, total }], turn: who === 'you' ? 'cpu' : 'you', winner: total === 21 ? who : null };
  });

  // The computer always jumps to a magic number when it can
  useEffect(() => {
    if (s.mode !== 'game' || g.turn !== 'cpu' || g.winner) return undefined;
    const t = setTimeout(() => {
      let a = (21 - g.total) % (max + 1);
      if (a === 0) a = 1 + Math.floor(Math.random() * Math.min(max, 21 - g.total));
      move('cpu', Math.min(a, 21 - g.total));
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.turn, g.total, g.winner, s.mode, max]);

  const pos = useTween(g.total, 650);
  const i0 = Math.floor(pos);
  const fr = pos - i0;
  const [ax, ay] = stonePos(i0);
  const [bx, by] = stonePos(Math.min(21, i0 + 1));
  const tokenX = ax + (bx - ax) * fr;
  const tokenY = ay + (by - ay) * fr - Math.abs(Math.sin(pos * Math.PI)) * 26;
  const saidBy = {};
  g.log.forEach((m) => { saidBy[m.total] = m.who; });

  // Estimation
  const step = clamp(s.step, 0, 3);
  const box = clamp(s.box, 0, 19);
  const boxCount = BOX_COUNTS[box];
  const cp = useReplay(`est-${box}-${step}`, 1500);
  const estimate = boxCount * 20;

  let stage;
  if (s.mode === 'game') {
    stage = (
      <g>
        <path d={`M ${stonePos(0).join(' ')} L ${stonePos(10).join(' ')} Q 600 149 ${stonePos(11).join(' ')} L ${stonePos(21).join(' ')}`} fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        {Array.from({ length: 22 }, (_, i) => {
          const [x, y] = stonePos(i);
          const who = saidBy[i];
          const isMagic = s.showMagic && magic.includes(i);
          return (
            <g key={i}>
              {isMagic && <circle key={`mg${max}`} cx={x} cy={y} r="25" fill="none" stroke={AMBER} strokeWidth="2.5" strokeDasharray="4 3" style={pop(magic.indexOf(i) * 140, 380)} />}
              <circle cx={x} cy={y} r="19" fill={who === 'you' ? '#0c4a6e' : who === 'cpu' ? '#831843' : '#1e293b'} stroke={i === 21 ? GREEN : who === 'you' ? SKY : who === 'cpu' ? PINK : '#475569'} strokeWidth={i === 21 ? 3 : 1.5} style={{ transition: 'fill 300ms' }} />
              <text x={x} y={y + 6} textAnchor="middle" fill={isMagic ? AMBER : INK} fontSize="16" fontWeight="900" fontFamily="monospace">{i}</text>
            </g>
          );
        })}
        <g>
          <circle cx={tokenX} cy={tokenY - 42} r="11" fill="#dc2626" stroke="#fecaca" strokeWidth="1.5" />
          <path d={`M ${tokenX - 7} ${tokenY - 49} Q ${tokenX} ${tokenY - 42} ${tokenX - 7} ${tokenY - 35}`} stroke="#fecaca" strokeWidth="1.2" fill="none" />
        </g>
        {s.showMagic && (
          <text x="300" y="270" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="800" fontFamily="sans-serif" style={pop(400, 400)}>
            Magic numbers: {magic.join(', ')} (each is {max + 1} apart)
          </text>
        )}
        {g.winner && (
          <g style={pop(500, 400)}>
            <rect x="130" y="290" width="340" height="44" rx="12" fill={g.winner === 'you' ? 'rgba(52,211,153,0.15)' : 'rgba(244,114,182,0.15)'} stroke={g.winner === 'you' ? GREEN : PINK} />
            <text x="300" y="318" textAnchor="middle" fill={g.winner === 'you' ? GREEN : PINK} fontSize="17" fontWeight="900" fontFamily="sans-serif">
              {g.winner === 'you' ? 'You said 21. You win!' : 'The computer said 21. Try again!'}
            </text>
          </g>
        )}
        {!g.winner && (
          <text x="300" y="318" textAnchor="middle" fill={g.turn === 'you' ? SKY : PINK} fontSize="15" fontWeight="800" fontFamily="sans-serif">
            {g.turn === 'you' ? `Your turn: add ${max === 3 ? '1, 2 or 3' : '1 or 2'}` : 'Computer is thinking…'}
          </text>
        )}
      </g>
    );
  } else {
    const bxp = BOX.x0 + (box % BOX.cols) * BOX.w;
    const byp = BOX.y0 + Math.floor(box / BOX.cols) * BOX.h;
    const counted = Math.min(boxCount, Math.floor(cp * 1.25 * boxCount));
    stage = (
      <g>
        <rect x={BOX.x0 - 6} y={BOX.y0 - 6} width={BOX.cols * BOX.w + 12} height={BOX.rows * BOX.h + 12} rx="12" fill="#0b1220" stroke="#334155" />
        {FANS.map((fans, b) => fans.map((f, i) => {
          const hl = step >= 2 && b === box;
          const isCounted = hl && step === 2 && i < counted;
          return <circle key={`${b}-${i}`} cx={f.x} cy={f.y} r="3.8" fill={hl ? (step === 2 && !isCounted ? '#78350f' : AMBER) : f.c} opacity={hl ? 1 : 0.75} />;
        }))}
        {step >= 1 && (
          <g>
            {Array.from({ length: BOX.cols - 1 }, (_, i) => (
              <line key={`v${i}`} x1={BOX.x0 + (i + 1) * BOX.w} y1={BOX.y0} x2={BOX.x0 + (i + 1) * BOX.w} y2={BOX.y0 + BOX.rows * BOX.h} stroke={INK} strokeWidth="1.5" pathLength="1" style={draw(i * 120, 500)} />
            ))}
            {Array.from({ length: BOX.rows - 1 }, (_, i) => (
              <line key={`h${i}`} x1={BOX.x0} y1={BOX.y0 + (i + 1) * BOX.h} x2={BOX.x0 + BOX.cols * BOX.w} y2={BOX.y0 + (i + 1) * BOX.h} stroke={INK} strokeWidth="1.5" pathLength="1" style={draw(400 + i * 120, 500)} />
            ))}
          </g>
        )}
        {step >= 3 && FANS.map((_, b) => (
          <g key={`lab${b}`} style={pop(b * 60, 300)}>
            <rect x={BOX.x0 + (b % BOX.cols) * BOX.w + 30} y={BOX.y0 + Math.floor(b / BOX.cols) * BOX.h + 18} width="36" height="22" rx="6" fill="#020617" opacity="0.8" />
            <text x={BOX.x0 + (b % BOX.cols) * BOX.w + 48} y={BOX.y0 + Math.floor(b / BOX.cols) * BOX.h + 34} textAnchor="middle" fill={AMBER} fontSize="13" fontWeight="900" fontFamily="monospace">≈{boxCount}</text>
          </g>
        ))}
        {step >= 2 && (
          <g>
            <rect x={bxp} y={byp} width={BOX.w} height={BOX.h} fill="none" stroke={AMBER} strokeWidth="3" />
            {step === 2 && (
              <g>
                <rect x={bxp + 26} y={byp + 14} width="44" height="30" rx="8" fill="#020617" stroke={AMBER} />
                <text x={bxp + 48} y={byp + 35} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily="monospace">{counted}</text>
              </g>
            )}
          </g>
        )}
        <text x="300" y="300" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily="sans-serif">
          {['How many fans are in this stand? Guess first!', 'Split the stand into 20 equal boxes (4 rows of 5).', `Count just one box: ${boxCount} fans.`, `Estimate: 20 boxes × ${boxCount} = ${estimate}`][step]}
        </text>
        {step >= 3 && <text x="300" y="330" textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif" style={pop(1300, 400)}>Actual count: {ACTUAL}. Very close, without counting them all!</text>}
        {FANS.map((_, b) => (
          <rect key={`hit${b}`} x={BOX.x0 + (b % BOX.cols) * BOX.w} y={BOX.y0 + Math.floor(b / BOX.cols) * BOX.h} width={BOX.w} height={BOX.h} fill="transparent" className="cursor-pointer" onClick={() => update({ box: b, step: Math.max(2, step) })} />
        ))}
      </g>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Estimation and Winning Strategies"
      title={s.mode === 'game' ? 'The Game of 21' : 'Estimate the crowd'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          {s.task && s.mode === 'game' && <TaskBanner text="Your turn: beat the computer! You go first. Hint: aim for the magic numbers." done={!!done} />}
          <ModePills value={s.mode} onChange={(mode) => update({ mode })} options={[{ value: 'estimate', label: 'Estimate the crowd' }, { value: 'game', label: 'Game of 21' }]} />
          {s.mode === 'game' && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: max }, (_, i) => i + 1).map((a) => (
                  <button key={a} className={BTN_MAIN} onClick={() => move('you', a)} disabled={g.turn !== 'you' || !!g.winner || g.total + a > 21}>+ {a}</button>
                ))}
                <button className={BTN} onClick={() => setG({ total: 0, log: [], turn: s.first, winner: null })}>New game</button>
                <button className={BTN} onClick={() => update({ showMagic: !s.showMagic })}>{s.showMagic ? 'Hide magic numbers' : 'Show magic numbers'}</button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ModePills value={max} onChange={(m) => update({ max: m, total: 0 })} options={[{ value: 3, label: 'Add 1, 2 or 3' }, { value: 2, label: 'Add 1 or 2' }]} />
                <ModePills value={s.first} onChange={(first) => update({ first, total: 0 })} options={[{ value: 'you', label: 'You start' }, { value: 'cpu', label: 'Computer starts' }]} />
              </div>
              <div className="font-mono text-xs text-slate-400">
                {g.log.length === 0 ? `Start at ${g.total}. Take turns adding; whoever says 21 wins.` : g.log.map((m, i) => (
                  <span key={i} className={m.who === 'you' ? 'text-sky-300' : 'text-pink-300'}>{m.who === 'you' ? 'You' : 'CPU'} +{m.a} → {m.total}{i < g.log.length - 1 ? ' · ' : ''}</span>
                ))}
              </div>
            </>
          )}
          {s.mode === 'estimate' && (
            <>
              <div className="flex flex-wrap gap-2">
                {['1 · Look', '2 · Split into boxes', '3 · Count one box', '4 · Multiply'].map((label, i) => (
                  <button key={i} className={`${BTN} ${step === i ? 'border-amber-400 text-amber-300' : ''}`} onClick={() => update({ step: i })}>{label}</button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Readout label="Fans in one box" value={step >= 2 ? boxCount : '?'} tone="text-amber-300" />
                <Readout label="Estimate (× 20)" value={step >= 3 ? estimate : '?'} tone="text-sky-300" />
                <Readout label="Actual" value={step >= 3 ? ACTUAL : '?'} tone="text-emerald-300" />
                <span className="text-[11px] text-slate-400">Tap any box to count that one instead.</span>
              </div>
            </>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {stage}
      </svg>
    </StoryStage>
  );
}
