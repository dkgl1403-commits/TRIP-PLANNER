import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Data Handling and Presentation — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const arr = (v, d) => (Array.isArray(v) && v.length ? v : d);
const SANS = 'sans-serif';

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

// Tweens an array of numbers (bar heights) smoothly towards `targets`
function useTweenArr(targets, duration = 900) {
  const key = targets.join(',');
  const [vals, setVals] = useState(targets);
  const cur = useRef(targets);
  useEffect(() => {
    const from = cur.current;
    const to = key.split(',').map(Number);
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const v = to.map((x, i) => (from[i] ?? 0) + (x - (from[i] ?? 0)) * e);
      cur.current = v;
      setVals(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [key, duration]);
  return vals.length === targets.length ? vals : targets;
}

// Small seeded shuffle so the "raw data" always looks the same
function seededShuffle(list, seed = 7) {
  const a = [...list];
  let x = seed;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COLOUR_FILL = { Red: '#ef4444', Green: '#22c55e', Yellow: '#facc15', Blue: '#3b82f6', Pink: '#ec4899', Orange: '#fb923c', Purple: '#a855f7' };
const PALETTE = [AMBER, SKY, GREEN, PINK, PURPLE, RED, '#fb923c'];

// ─── WIDGET 1: Raw data → sorted groups → frequency table ───
export function Class6DataSortWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    mode: 'raw', labels: ['Red', 'Green', 'Yellow', 'Blue', 'Pink'], counts: [6, 4, 5, 3, 2], picked: null, task: null,
  }, visual);
  const labels = arr(s.labels, ['Red']);
  const counts = labels.map((_, i) => clamp(Math.round(num(arr(s.counts, [])[i])), 0, 8));
  const mode = ['raw', 'sorted', 'table'].includes(s.mode) ? s.mode : 'raw';
  const items = seededShuffle(counts.flatMap((c, i) => Array.from({ length: c }, (_, k) => ({ cat: i, k }))), 11);
  const total = counts.reduce((a, b) => a + b, 0);
  const maxIdx = counts.indexOf(Math.max(...counts));
  const picked = s.picked === null || s.picked === undefined ? null : Number(s.picked);
  const done = !!s.task && mode !== 'raw' && picked === maxIdx;
  useDone(done, onInteract);
  const n = labels.length;
  const colX = (c) => 300 + (c - (n - 1) / 2) * Math.min(110, 520 / n);
  const fillOf = (i) => COLOUR_FILL[labels[i]] || PALETTE[i % PALETTE.length];
  const darkText = (i) => ['Yellow', 'Green', 'Pink', 'Orange'].includes(labels[i]);

  return (
    <StoryStage
      eyebrow="Visualizer · Organising data"
      title={mode === 'raw' ? `${total} answers, in no order` : mode === 'sorted' ? 'Sorted into groups' : 'A frequency table'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'raw', label: 'Raw data' }, { value: 'sorted', label: 'Sort into groups' }, { value: 'table', label: 'Make a table' }]} />
          {s.task && <TaskBanner text={s.task.text || 'Click the most popular choice.'} done={done} />}
          <div className="flex flex-wrap gap-2">
            <Readout label="Total answers" value={total} tone="text-amber-300" />
            {picked !== null && labels[picked] && <Readout label={`${labels[picked]} chosen by`} value={counts[picked]} tone="text-sky-300" />}
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {items.map((it, idx) => {
          let x; let y; let rot = 0;
          if (mode === 'raw') {
            x = 62 + (idx % 6) * 95; y = 62 + Math.floor(idx / 6) * 62 + ((idx * 37) % 17) - 8; rot = ((idx * 53) % 15) - 7;
          } else {
            x = colX(it.cat); y = 292 - it.k * 32;
          }
          return (
            <g key={`${it.cat}-${it.k}`} style={{ transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, transition: `transform 900ms ease ${idx * 25}ms, opacity 600ms ease`, opacity: mode === 'table' ? 0 : 1 }}>
              <rect x="-38" y="-13" width="76" height="26" rx="13" fill={fillOf(it.cat)} />
              <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily={SANS} fill={darkText(it.cat) ? '#0f172a' : '#fff'}>{labels[it.cat]}</text>
            </g>
          );
        })}
        {mode === 'sorted' && labels.map((l, i) => (
          <g key={`col-${l}`} onClick={() => update({ picked: i })} style={{ cursor: 'pointer' }}>
            <rect x={colX(i) - 44} y={50} width="88" height="262" rx="10" fill={picked === i ? 'rgba(56,189,248,0.12)' : 'transparent'} stroke={picked === i ? SKY : 'transparent'} strokeWidth="2" />
            <text x={colX(i)} y="336" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily={SANS}>{l}: {counts[i]}</text>
          </g>
        ))}
        {mode === 'table' && (
          <g style={{ animation: 'dhFade 700ms ease both' }}>
            <rect x="140" y="40" width="320" height={44 + (n + 1) * 36} rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="220" y="70" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={SANS}>Colour</text>
            <text x="380" y="70" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={SANS}>Number of children</text>
            <line x1="140" y1="82" x2="460" y2="82" stroke="#334155" strokeWidth="2" />
            {labels.map((l, i) => (
              <g key={`row-${l}`} onClick={() => update({ picked: i })} style={{ cursor: 'pointer' }}>
                <rect x="144" y={86 + i * 36} width="312" height="32" rx="6" fill={picked === i ? 'rgba(56,189,248,0.18)' : 'transparent'} />
                <circle cx="180" cy={102 + i * 36} r="8" fill={fillOf(i)} />
                <text x="200" y={108 + i * 36} fill={INK} fontSize="16" fontWeight="700" fontFamily={SANS}>{l}</text>
                <text x="380" y={108 + i * 36} textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" fontFamily="monospace">{counts[i]}</text>
              </g>
            ))}
            <line x1="140" y1={86 + n * 36} x2="460" y2={86 + n * 36} stroke="#334155" strokeWidth="2" />
            <text x="200" y={112 + n * 36} fill={GREEN} fontSize="16" fontWeight="900" fontFamily={SANS}>Total</text>
            <text x="380" y={112 + n * 36} textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="monospace">{total}</text>
          </g>
        )}
      </svg>
      <style>{'@keyframes dhFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }'}</style>
    </StoryStage>
  );
}

// ─── WIDGET 2: Tally marks from a stream of cricket balls ───
function TallyGroup({ x, y, count, color }) {
  const marks = [];
  for (let i = 0; i < count; i++) {
    const g = Math.floor(i / 5);
    const k = i % 5;
    const gx = x + g * 50;
    const style = { transition: 'opacity 350ms ease', opacity: 1, animation: 'dhFade 400ms ease both' };
    if (k < 4) marks.push(<line key={i} x1={gx + k * 9} y1={y - 14} x2={gx + k * 9} y2={y + 14} stroke={color} strokeWidth="3" strokeLinecap="round" style={style} />);
    else marks.push(<line key={i} x1={gx - 6} y1={y + 10} x2={gx + 33} y2={y - 10} stroke={color} strokeWidth="3" strokeLinecap="round" style={style} />);
  }
  return <g>{marks}</g>;
}

const DEFAULT_RUNS = ['0', '1', '2', '4', '6'];
const DEFAULT_BALLS = [8, 9, 5, 5, 3];

export function Class6TallyMarksWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    labels: DEFAULT_RUNS, ballCounts: DEFAULT_BALLS, stream: null, upto: 0, counts: null, showFreq: false, task: null,
  }, visual);
  const labels = arr(s.labels, DEFAULT_RUNS);
  const stream = Array.isArray(s.stream) && s.stream.length
    ? s.stream.map((v) => String(v))
    : seededShuffle(labels.flatMap((l, i) => Array.from({ length: num(arr(s.ballCounts, DEFAULT_BALLS)[i]) }, () => l)), 5);
  const upto = clamp(Math.round(num(s.upto)), 0, stream.length);
  const counts = Array.isArray(s.counts)
    ? labels.map((_, i) => clamp(num(s.counts[i]), 0, 15))
    : labels.map((l) => stream.slice(0, upto).filter((b) => b === l).length);
  const total = counts.reduce((a, b) => a + b, 0);
  const runs = labels.reduce((a, l, i) => a + num(l) * counts[i], 0);
  const target = s.task && Array.isArray(s.task.target) ? s.task.target : null;
  const done = !!target && target.every((t, i) => counts[i] === t);
  useDone(done, onInteract);
  const gap = Math.min(30, 540 / stream.length);
  const r = Math.min(11, gap * 0.42);
  const ballX = (i) => 300 + (i - (stream.length - 1) / 2) * gap;
  const setCount = (i, d) => update({ counts: counts.map((c, k) => (k === i ? clamp(c + d, 0, 15) : c)) });
  const rowY = (i) => 128 + i * 44;

  return (
    <StoryStage
      eyebrow="Visualizer · Tally marks"
      title="Runs off each ball"
      footer={
        <div className="space-y-3">
          {s.task && <TaskBanner text={s.task.text || 'Make the tally match the balls.'} done={done} />}
          <div className="flex flex-wrap gap-2 items-center">
            {labels.map((l, i) => (
              <div key={l} className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200">
                <span className="font-mono">{l} run{l === '1' ? '' : 's'}</span>
                <button className="px-2 rounded bg-slate-700 hover:bg-slate-600" onClick={() => setCount(i, -1)}>-</button>
                <button className="px-2 rounded bg-amber-600 hover:bg-amber-500 text-slate-950" onClick={() => setCount(i, 1)}>+</button>
              </div>
            ))}
            <button className="px-3 py-1 rounded-lg text-xs font-bold border border-slate-700 text-slate-300" onClick={() => update({ showFreq: !s.showFreq })}>{s.showFreq ? 'Hide' : 'Show'} frequency</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Readout label="Balls tallied" value={total} tone="text-amber-300" />
            <Readout label="Total runs" value={runs} tone="text-emerald-400" />
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {stream.map((b, i) => {
          const used = !Array.isArray(s.counts) && i < upto;
          return (
            <g key={`b${i}`} style={{ opacity: Array.isArray(s.counts) || i >= upto ? 1 : 0.35, transition: 'opacity 400ms ease' }}>
              <circle cx={ballX(i)} cy="44" r={r} fill={used ? '#334155' : '#b91c1c'} stroke="#fecaca" strokeWidth="1" />
              <text x={ballX(i)} y={44 + r * 0.4} textAnchor="middle" fill="#fff" fontSize={r * 1.15} fontWeight="900" fontFamily="monospace">{b}</text>
            </g>
          );
        })}
        <text x="300" y="80" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>{Array.isArray(s.counts) ? 'Tally these balls yourself' : `${upto} of ${stream.length} balls tallied`}</text>
        <rect x="40" y="92" width="520" height={labels.length * 44 + 20} rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text x="95" y="114" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily={SANS}>Runs</text>
        <text x="290" y="114" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily={SANS}>Tally marks</text>
        <text x="495" y="114" textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily={SANS} opacity={s.showFreq ? 1 : 0.3}>Frequency</text>
        {labels.map((l, i) => (
          <g key={`r${l}`}>
            <line x1="40" y1={rowY(i) - 8} x2="560" y2={rowY(i) - 8} stroke="#1e293b" strokeWidth="1.5" />
            <text x="95" y={rowY(i) + 22} textAnchor="middle" fill={INK} fontSize="20" fontWeight="900" fontFamily="monospace">{l}</text>
            <TallyGroup x={160} y={rowY(i) + 15} count={counts[i]} color={PALETTE[i % PALETTE.length]} />
            <text x="495" y={rowY(i) + 23} textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily="monospace" style={{ opacity: s.showFreq ? 1 : 0, transition: 'opacity 500ms ease' }}>{counts[i]}</text>
          </g>
        ))}
      </svg>
      <style>{'@keyframes dhFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }'}</style>
    </StoryStage>
  );
}

// ─── WIDGET 3: Pictograph with a key (half symbols too) ───
function Laddoo({ x, y, frac, id, delay }) {
  return (
    <g style={{ animation: `dhPop 450ms ease ${delay}ms both`, transformOrigin: `${x}px ${y}px` }}>
      <clipPath id={id}><rect x={x - 15} y={y - 15} width={30 * frac} height="30" /></clipPath>
      <circle cx={x} cy={y} r="14" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="2 3" opacity={frac < 1 ? 0.7 : 0} />
      <g clipPath={`url(#${id})`}>
        <circle cx={x} cy={y} r="14" fill={AMBER} stroke="#b45309" strokeWidth="2" />
        <circle cx={x - 4} cy={y - 4} r="4" fill="#fef3c7" opacity="0.7" />
      </g>
    </g>
  );
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Class6PictographWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    labels: DAYS.slice(0, 5), values: [40, 25, 60, 35, 50], key: 10, highlight: null, task: null, unit: 'laddoos',
  }, visual);
  const labels = arr(s.labels, DAYS);
  const values = labels.map((_, i) => Math.max(0, num(arr(s.values, [])[i])));
  const key = Math.max(1, num(s.key, 10));
  const hl = s.highlight === null || s.highlight === undefined ? null : Number(s.highlight);
  const task = s.task && s.task.row !== undefined ? s.task : null;
  const done = !!task && values[task.row] === task.value && key === (task.key || key);
  useDone(done, onInteract);
  const rowY = (i) => 52 + i * 44;
  const MAXI = 13;
  const setVal = (i, d) => update({ values: values.map((v, k) => (k === i ? Math.max(0, v + d) : v)) });

  return (
    <StoryStage
      eyebrow="Visualizer · Pictograph"
      title={`${s.unit === 'laddoos' ? 'Laddoos' : 'Items'} sold each day`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-xs text-slate-400 font-bold">Key: 1 laddoo stands for</span>
            <ModePills value={key} onChange={(k) => update({ key: k })} options={[5, 10, 20].map((k) => ({ value: k, label: `${k}` }))} />
          </div>
          {task && <TaskBanner text={task.text || 'Draw the row.'} done={done} />}
          <div className="flex flex-wrap gap-2">
            {labels.map((l, i) => (
              <div key={l} className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200">
                <span>{l.slice(0, 3)}</span>
                <button className="px-2 rounded bg-slate-700 hover:bg-slate-600" onClick={() => setVal(i, -key / 2)}>-</button>
                <button className="px-2 rounded bg-amber-600 hover:bg-amber-500 text-slate-950" onClick={() => setVal(i, key / 2)}>+</button>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {labels.map((l, i) => {
          const icons = values[i] / key;
          const full = Math.floor(icons);
          const frac = icons - full;
          const count = Math.min(MAXI, Math.ceil(icons - 1e-9));
          return (
            <g key={`p${l}`}>
              <rect x="20" y={rowY(i) - 20} width="560" height="40" rx="8" fill={hl === i ? 'rgba(251,191,36,0.14)' : (i % 2 ? '#0b1220' : 'transparent')} style={{ transition: 'fill 500ms ease' }} />
              <text x="30" y={rowY(i) + 5} fill={hl === i ? AMBER : INK} fontSize="15" fontWeight="800" fontFamily={SANS}>{l}</text>
              {Array.from({ length: count }, (_, k) => (
                <Laddoo key={`${key}-${values[i]}-${k}`} id={`dhp-${i}-${k}`} x={140 + k * 32} y={rowY(i)} frac={k < full ? 1 : frac} delay={k * 50} />
              ))}
              {icons > MAXI && <text x="560" y={rowY(i) + 5} textAnchor="end" fill={RED} fontSize="13" fontWeight="900" fontFamily={SANS}>too many!</text>}
              {hl === i && <text x={150 + count * 32} y={rowY(i) + 5} fill={AMBER} fontSize="14" fontWeight="900" fontFamily="monospace">= {values[i]}</text>}
            </g>
          );
        })}
        <g>
          <rect x="150" y="318" width="300" height="34" rx="10" fill="#0f172a" stroke={GREEN} strokeWidth="2" />
          <Laddoo id="dhp-key" x={190} y={335} frac={1} delay={0} />
          <text x="215" y="341" fill={GREEN} fontSize="15" fontWeight="900" fontFamily={SANS}>Key: 1 laddoo = {key} {s.unit}</text>
        </g>
      </svg>
      <style>{'@keyframes dhPop { from { opacity: 0; transform: scale(0.3) } to { opacity: 1; transform: scale(1) } }'}</style>
    </StoryStage>
  );
}

// ─── WIDGET 4: Bar graph: read, draw (drag the bars), choose a scale ───
const BX0 = 80;
const BX1 = 570;
const BASE = 290;
const PH = 230;

export function Class6BarGraphWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    title: 'How we come to school', labels: ['Walk', 'Cycle', 'Bus', 'Car', 'Auto'], values: [12, 8, 15, 4, 6],
    scale: 2, scales: null, step: 1, xLabel: 'Way of coming', yLabel: 'Students', showValues: true, highlight: null, task: null,
  }, visual);
  const labels = arr(s.labels, ['A']);
  const values = labels.map((_, i) => Math.max(0, num(arr(s.values, [])[i])));
  const scale = Math.max(1, num(s.scale, 2));
  const step = Math.max(1, num(s.step, 1));
  const top = scale * 10;
  const topT = useTween(top);
  const shown = useTweenArr(values);
  const hl = Array.isArray(s.highlight) ? s.highlight : (s.highlight === null || s.highlight === undefined ? [] : [Number(s.highlight)]);
  const n = labels.length;
  const slot = (BX1 - BX0) / n;
  const bw = Math.min(64, slot * 0.6);
  const cx = (i) => BX0 + slot * (i + 0.5);
  const maxV = Math.max(...values);
  const overflow = maxV > top;
  const tiny = !overflow && maxV < 0.3 * top;
  const task = s.task || null;
  const done = !!task && (
    task.fitScale ? (!overflow && maxV >= 0.5 * top)
      : Array.isArray(task.values) ? task.values.every((v, i) => values[i] === v) : false);
  useDone(done, onInteract);

  const svgRef = useRef(null);
  const active = useRef(null);
  const drag = useSvgDrag(svgRef, (x, y) => {
    const i = active.current;
    if (i === null) return;
    const v = clamp(Math.round(((BASE - y) / PH) * top / step) * step, 0, top);
    if (v !== values[i]) update({ values: values.map((old, k) => (k === i ? v : old)) });
  });

  const status = overflow ? { t: 'Scale too small: a bar does not fit!', c: RED }
    : tiny ? { t: 'Scale too big: the bars are tiny', c: AMBER } : { t: 'Scale fits well', c: GREEN };

  return (
    <StoryStage
      eyebrow="Visualizer · Bar graph"
      title={s.title}
      footer={
        <div className="space-y-3">
          {Array.isArray(s.scales) && (
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-xs text-slate-400 font-bold">Scale: 1 grid line =</span>
              <ModePills value={scale} onChange={(v) => update({ scale: v })} options={s.scales.map((k) => ({ value: k, label: `${k}` }))} />
            </div>
          )}
          {task && <TaskBanner text={task.text || 'Drag the bars.'} done={done} />}
          <div className="flex flex-wrap gap-2">
            <Readout label="Scale" value={`1 unit = ${scale}`} tone="text-sky-300" />
            <Readout label="Tallest bar" value={maxV} tone="text-amber-300" />
            <Readout label="Total" value={values.reduce((a, b) => a + b, 0)} tone="text-emerald-400" />
          </div>
          <p className="text-xs text-slate-500">Drag the top of any bar to change it.</p>
        </div>
      }
    >
      <svg ref={svgRef} viewBox="0 0 600 360" className="w-full h-auto select-none touch-none"
        {...drag}
        onPointerUp={(e) => { drag.onPointerUp(e); active.current = null; }}>
        {Array.from({ length: 11 }, (_, k) => {
          const y = BASE - (k / 10) * PH;
          return (
            <g key={`g${k}`}>
              <line x1={BX0} y1={y} x2={BX1} y2={y} stroke={k === 0 ? INK : '#1e293b'} strokeWidth={k === 0 ? 2.5 : 1} />
              <text x={BX0 - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="monospace">{Math.round((topT * k) / 10)}</text>
            </g>
          );
        })}
        <line x1={BX0} y1={BASE} x2={BX0} y2={BASE - PH - 8} stroke={INK} strokeWidth="2.5" />
        <text x="22" y={BASE - PH / 2} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily={SANS} transform={`rotate(-90 22 ${BASE - PH / 2})`}>{s.yLabel}</text>
        <text x={(BX0 + BX1) / 2} y="350" textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily={SANS}>{s.xLabel}</text>
        {Array.isArray(s.scales) && <text x={BX1} y="30" textAnchor="end" fill={status.c} fontSize="14" fontWeight="900" fontFamily={SANS}>{status.t}</text>}
        {labels.map((l, i) => {
          const hv = Math.min(shown[i], topT);
          const h = (hv / topT) * PH;
          const over = values[i] > top;
          const fill = over ? RED : hl.includes(i) ? AMBER : PALETTE[(i + 1) % PALETTE.length];
          return (
            <g key={`bar${l}`}>
              <rect x={cx(i) - slot / 2 + 2} y={BASE - PH - 10} width={slot - 4} height={PH + 10} fill="transparent" style={{ cursor: 'ns-resize' }}
                onPointerDown={(e) => { active.current = i; drag.onPointerDown(e); }} />
              <rect x={cx(i) - bw / 2} y={BASE - h} width={bw} height={Math.max(0, h)} rx="4" fill={fill} opacity={hl.length && !hl.includes(i) ? 0.45 : 0.9} pointerEvents="none" />
              <rect x={cx(i) - bw / 2} y={BASE - h - 4} width={bw} height="6" rx="3" fill="#fff" opacity="0.5" pointerEvents="none" />
              {over && <text x={cx(i)} y={BASE - PH - 14} textAnchor="middle" fill={RED} fontSize="12" fontWeight="900" fontFamily={SANS} pointerEvents="none">off the top!</text>}
              {s.showValues && !over && <text x={cx(i)} y={BASE - h - 10} textAnchor="middle" fill={INK} fontSize="14" fontWeight="900" fontFamily="monospace" pointerEvents="none">{values[i]}</text>}
              <text x={cx(i)} y={BASE + 20} textAnchor="middle" fill={hl.includes(i) ? AMBER : INK} fontSize="13" fontWeight="800" fontFamily={SANS} pointerEvents="none">{l}</text>
            </g>
          );
        })}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Infographics and misleading graphs ───
export function Class6MisleadingGraphWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'baseline', from0: false, honest: false, task: null }, visual);
  const mode = ['baseline', 'icons', 'infographic'].includes(s.mode) ? s.mode : 'baseline';
  const lo = useTween(s.from0 ? 0 : 46);
  const hi = useTween(s.from0 ? 60 : 54);
  const r2 = useTween(s.honest ? 40 : 80);
  const twinO = useTween(s.honest ? 1 : 0);
  const done = !!s.task && ((mode === 'baseline' && s.from0) || (mode === 'icons' && s.honest));
  useDone(done, onInteract);

  let picture;
  if (mode === 'baseline') {
    const votes = [['Harsh', 52, AMBER], ['Rohan', 48, SKY]];
    const yOf = (v) => 300 - ((v - lo) / (hi - lo)) * 240;
    const tickStep = s.from0 ? 10 : 2;
    const ticks = [];
    for (let v = Math.ceil(lo / tickStep) * tickStep; v <= hi + 0.01; v += tickStep) ticks.push(v);
    const looks = (52 - lo) / Math.max(0.01, 48 - lo);
    picture = (
      <>
        {ticks.map((v) => (
          <g key={`t${v}`}>
            <line x1="80" y1={yOf(v)} x2="330" y2={yOf(v)} stroke="#1e293b" />
            <text x="72" y={yOf(v) + 4} textAnchor="end" fill="#94a3b8" fontSize="12" fontFamily="monospace">{v}</text>
          </g>
        ))}
        <line x1="80" y1="300" x2="330" y2="300" stroke={INK} strokeWidth="2.5" />
        <line x1="80" y1="300" x2="80" y2="52" stroke={INK} strokeWidth="2.5" />
        {votes.map(([name, v, c], i) => (
          <g key={name}>
            <rect x={120 + i * 110} y={yOf(v)} width="70" height={300 - yOf(v)} rx="4" fill={c} opacity="0.9" />
            <text x={155 + i * 110} y={yOf(v) - 8} textAnchor="middle" fill={INK} fontSize="15" fontWeight="900" fontFamily="monospace">{v}</text>
            <text x={155 + i * 110} y="322" textAnchor="middle" fill={INK} fontSize="14" fontWeight="800" fontFamily={SANS}>{name}</text>
          </g>
        ))}
        <text x="205" y="30" textAnchor="middle" fill={INK} fontSize="15" fontWeight="900" fontFamily={SANS}>Class monitor votes</text>
        {!s.from0 && <text x="80" y="345" fill={RED} fontSize="13" fontWeight="900" fontFamily={SANS}>Axis starts at 46, not 0!</text>}
        <text x="470" y="120" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>Harsh's bar looks</text>
        <text x="470" y="160" textAnchor="middle" fill={s.from0 ? GREEN : RED} fontSize="34" fontWeight="900" fontFamily="monospace">{looks.toFixed(1)} times</text>
        <text x="470" y="185" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>taller than Rohan's</text>
        <text x="470" y="240" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily={SANS}>Real votes: 52 and 48</text>
        <text x="470" y="262" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="800" fontFamily={SANS}>Only 4 votes apart</text>
      </>
    );
  } else if (mode === 'icons') {
    picture = (
      <>
        <text x="300" y="34" textAnchor="middle" fill={INK} fontSize="16" fontWeight="900" fontFamily={SANS}>Laddoos sold: last week 100, this week 200</text>
        <circle cx="130" cy="210" r="40" fill={AMBER} stroke="#b45309" strokeWidth="3" />
        <text x="130" y="300" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily={SANS}>Last week: 100</text>
        <circle cx={s.honest ? 330 : 380} cy="210" r={r2} fill={s.honest ? AMBER : RED} fillOpacity="0.85" stroke="#b45309" strokeWidth="3" style={{ transition: 'cx 800ms ease, fill 600ms' }} />
        <circle cx="430" cy="210" r="40" fill={AMBER} stroke="#b45309" strokeWidth="3" opacity={twinO} />
        <text x="380" y="315" textAnchor="middle" fill={INK} fontSize="15" fontWeight="800" fontFamily={SANS}>This week: 200</text>
        <text x="380" y="342" textAnchor="middle" fill={s.honest ? GREEN : RED} fontSize="14" fontWeight="900" fontFamily={SANS}>
          {s.honest ? 'Honest: 2 laddoos of the same size' : 'Twice as wide AND twice as tall: looks 4 times!'}
        </text>
      </>
    );
  } else {
    const cells = Array.from({ length: 100 }, (_, i) => i);
    picture = (
      <>
        {cells.map((i) => (
          <circle key={i} cx={70 + (i % 10) * 24} cy={70 + Math.floor(i / 10) * 24} r="9"
            fill={i < 51 ? AMBER : SKY} style={{ animation: `dhPop 300ms ease ${i * 18}ms both`, transformOrigin: `${70 + (i % 10) * 24}px ${70 + Math.floor(i / 10) * 24}px` }} />
        ))}
        <text x="178" y="40" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800" fontFamily={SANS}>1 ball = 1 century</text>
        <text x="440" y="90" textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" fontFamily={SANS}>Sachin Tendulkar</text>
        <text x="440" y="150" textAnchor="middle" fill={GREEN} fontSize="56" fontWeight="900" fontFamily="monospace">100</text>
        <text x="440" y="176" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>international centuries</text>
        <circle cx="360" cy="225" r="9" fill={AMBER} />
        <text x="378" y="231" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={SANS}>51 in Test matches</text>
        <circle cx="360" cy="260" r="9" fill={SKY} />
        <text x="378" y="266" fill={SKY} fontSize="16" fontWeight="900" fontFamily={SANS}>49 in ODIs</text>
        <text x="300" y="340" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily={SANS}>Source: ICC, BCCI records</text>
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Read graphs wisely"
      title={mode === 'infographic' ? 'An infographic' : 'Can a graph fool you?'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'infographic', label: 'Infographic' }, { value: 'baseline', label: 'Cut-off axis' }, { value: 'icons', label: 'Growing picture' }]} />
          {mode === 'baseline' && <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-600 text-slate-200" onClick={() => update({ from0: !s.from0 })}>{s.from0 ? 'Start axis at 46' : 'Start axis at 0'}</button>}
          {mode === 'icons' && <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-600 text-slate-200" onClick={() => update({ honest: !s.honest })}>{s.honest ? 'Show the big laddoo' : 'Draw it honestly'}</button>}
          {s.task && <TaskBanner text={s.task.text || 'Fix the graph.'} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
      <style>{'@keyframes dhPop { from { opacity: 0; transform: scale(0.3) } to { opacity: 1; transform: scale(1) } }'}</style>
    </StoryStage>
  );
}
