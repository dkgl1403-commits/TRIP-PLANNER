import React, { useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 6 · Introduction to Algebra — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const int = (v, lo, hi, dflt) => {
  const n = Math.round(Number(v));
  return clamp(Number.isFinite(n) ? n : dflt, lo, hi);
};
const SANS = 'sans-serif';
const MONO = 'monospace';

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

// "a·v + b" written the algebra way: 3n + 2, n − 2, 4x, 7
function expr(a, b, v = 'n') {
  const head = a === 0 ? '' : a === 1 ? v : `${a}${v}`;
  if (!head) return String(b);
  if (b === 0) return head;
  return b > 0 ? `${head} + ${b}` : `${head} − ${-b}`;
}

// A matchstick from (x1,y1) to (x2,y2): wooden stick with a red head at the end
function Stick({ x1, y1, x2, y2, show = true, delay = 0, color = '#fcd34d' }) {
  return (
    <g style={{ opacity: show ? 1 : 0, transition: `opacity 450ms ease ${delay}ms` }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r="4.5" fill={RED} />
    </g>
  );
}

// ─── WIDGET 1: Matchstick patterns → a rule with a variable ───
const LETTERS = {
  L: { per: 2, h: 1, sticks: [[0, 0, 0, 1], [0, 1, 1, 1]] },
  T: { per: 2, h: 1, sticks: [[0, 0, 1, 0], [0.5, 0, 0.5, 1]] },
  C: { per: 3, h: 1, sticks: [[1, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 1]] },
  U: { per: 3, h: 1, sticks: [[0, 0, 0, 1], [0, 1, 1, 1], [1, 1, 1, 0]] },
  F: { per: 4, h: 2, sticks: [[0, 0, 0, 1], [0, 1, 0, 2], [0, 0, 1, 0], [0, 1, 1, 1]] },
  E: { per: 5, h: 2, sticks: [[0, 0, 0, 1], [0, 1, 0, 2], [0, 0, 1, 0], [0, 1, 1, 1], [0, 2, 1, 2]] },
};
const MAXN = 10;

function patternSticks(mode, letter, n) {
  if (mode === 'squares') return 3 * n + 1;
  if (mode === 'triangles') return 2 * n + 1;
  return LETTERS[letter].per * n;
}

function ruleText(mode, letter) {
  if (mode === 'squares') return '3 × n + 1';
  if (mode === 'triangles') return '2 × n + 1';
  return `${LETTERS[letter].per} × n`;
}

export function Class6AlgebraMatchstickWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'letter', letter: 'L', n: 1, showTable: false, showRule: false, task: null }, visual);
  const mode = ['letter', 'squares', 'triangles'].includes(s.mode) ? s.mode : 'letter';
  const letter = LETTERS[s.letter] ? s.letter : 'L';
  const n = int(s.n, 1, MAXN, 1);
  const sticks = patternSticks(mode, letter, n);
  const shown = useTween(sticks, 700);
  const task = s.task && s.task.sticks ? s.task : null;
  const done = !!task && mode === (task.mode || 'letter') && (!task.letter || task.letter === letter) && sticks === task.sticks;
  useDone(done, onInteract);

  const lines = [];
  if (mode === 'letter') {
    const L = LETTERS[letter];
    const u = Math.min(46, 540 / (MAXN * 1.6), 520 / (n * 1.6));
    const total = n * 1.6 * u - 0.6 * u;
    const x0 = 300 - total / 2;
    const y0 = 115 - (L.h * u) / 2;
    for (let i = 0; i < MAXN; i++) {
      L.sticks.forEach(([a, b, c, d], k) => {
        lines.push(
          <Stick key={`${letter}-${i}-${k}`} show={i < n} delay={i < n ? i * 80 + k * 40 : 0}
            x1={x0 + (i * 1.6 + a) * u} y1={y0 + b * u} x2={x0 + (i * 1.6 + c) * u} y2={y0 + d * u} />,
        );
      });
    }
  } else if (mode === 'squares') {
    const u = Math.min(52, 520 / n);
    const x0 = 300 - (n * u) / 2;
    const y0 = 115 - u / 2;
    lines.push(<Stick key="first" x1={x0} y1={y0 + u} x2={x0} y2={y0} color={PINK} />);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * u;
      const d = i * 90;
      lines.push(<Stick key={`t${i}`} x1={x} y1={y0} x2={x + u} y2={y0} delay={d} />);
      lines.push(<Stick key={`b${i}`} x1={x} y1={y0 + u} x2={x + u} y2={y0 + u} delay={d + 30} />);
      lines.push(<Stick key={`r${i}`} x1={x + u} y1={y0 + u} x2={x + u} y2={y0} delay={d + 60} />);
    }
  } else {
    const u = Math.min(64, 1040 / (n + 1));
    const w = ((n + 1) / 2) * u;
    const x0 = 300 - w / 2;
    const top = 115 - (u * 0.866) / 2;
    const bot = top + u * 0.866;
    const pt = (k) => (k % 2 === 0 ? [x0 + (k / 2) * u, bot] : [x0 + ((k - 1) / 2 + 0.5) * u, top]);
    lines.push(<Stick key="first" x1={pt(0)[0]} y1={pt(0)[1]} x2={pt(1)[0]} y2={pt(1)[1]} color={PINK} />);
    for (let i = 0; i < n; i++) {
      const [ax, ay] = pt(i);
      const [bx, by] = pt(i + 1);
      const [cx, cy] = pt(i + 2);
      lines.push(<Stick key={`h${i}`} x1={ax} y1={ay} x2={cx} y2={cy} delay={i * 90} />);
      lines.push(<Stick key={`z${i}`} x1={bx} y1={by} x2={cx} y2={cy} delay={i * 90 + 45} />);
    }
  }

  const rows = [1, 2, 3, 4, 5, 6];
  const label = mode === 'letter' ? `letter ${letter}` : mode === 'squares' ? 'squares' : 'triangles';
  return (
    <StoryStage
      eyebrow="Visualizer · Matchstick patterns"
      title={`${n} ${mode === 'letter' ? `letter ${letter}${n > 1 ? "'s" : ''}` : n > 1 ? label : label.slice(0, -1)} need${n > 1 ? '' : 's'} ${sticks} matchsticks`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'letter', label: 'Letters' }, { value: 'squares', label: 'Row of squares' }, { value: 'triangles', label: 'Row of triangles' }]} />
          {mode === 'letter' && (
            <ModePills value={letter} onChange={(l) => update({ letter: l })} options={Object.keys(LETTERS).map((k) => ({ value: k, label: `${k} (${LETTERS[k].per} sticks)` }))} />
          )}
          <Slider label={`n = number of ${label}`} value={n} min={1} max={MAXN} onChange={(v) => update({ n: v })} tone="text-sky-300" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => update({ showTable: !s.showTable })} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700">{s.showTable ? 'Hide table' : 'Show table'}</button>
            <button onClick={() => update({ showRule: !s.showRule })} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700">{s.showRule ? 'Hide rule' : 'Show rule'}</button>
            <Readout label="n" value={n} tone="text-sky-300" />
            <Readout label="Matchsticks" value={Math.round(shown)} />
          </div>
          {task && <TaskBanner text={`Make a ${task.letter ? `row of letter ${task.letter}` : task.mode === 'squares' ? 'row of squares' : 'row of triangles'} that uses exactly ${task.sticks} matchsticks.`} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {lines}
        {mode !== 'letter' && (
          <text x="300" y="196" textAnchor="middle" fill={PINK} fontSize="13" fontWeight="700" fontFamily={SANS}>pink: the 1 extra stick to start · yellow: {mode === 'squares' ? 3 : 2} more for each shape</text>
        )}
        <g style={{ opacity: s.showTable ? 1 : 0, transition: 'opacity 500ms ease' }}>
          <text x="60" y="232" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>n</text>
          <text x="60" y="262" fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily={SANS}>sticks</text>
          {rows.map((r, i) => (
            <g key={r} style={{ opacity: r <= Math.max(n, 3) ? 1 : 0.35, transition: `opacity 400ms ease ${i * 70}ms` }}>
              <rect x={130 + i * 60} y="214" width="52" height="58" rx="8" fill={r === n ? 'rgba(56,189,248,0.18)' : '#0f172a'} stroke={r === n ? SKY : '#334155'} />
              <text x={156 + i * 60} y="234" textAnchor="middle" fill={SKY} fontSize="16" fontWeight="900" fontFamily={MONO}>{r}</text>
              <text x={156 + i * 60} y="263" textAnchor="middle" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={MONO}>{patternSticks(mode, letter, r)}</text>
            </g>
          ))}
          <text x="510" y="250" fill="#64748b" fontSize="22" fontWeight="900" fontFamily={MONO}>…</text>
        </g>
        <g style={{ opacity: s.showRule ? 1 : 0, transition: 'opacity 600ms ease 200ms' }}>
          <rect x="120" y="292" width="360" height="50" rx="12" fill="rgba(52,211,153,0.12)" stroke={GREEN} />
          <text x="300" y="325" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily={MONO}>sticks = {ruleText(mode, letter)}</text>
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Laddoo boxes → expressions with a variable ───
function Laddoo({ x, y, r = 7, color = AMBER, crossed }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} stroke="#78350f" strokeWidth="1.2" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fef3c7" opacity="0.6" />
      {crossed && <path d={`M ${x - r - 3} ${y - r - 3} L ${x + r + 3} ${y + r + 3} M ${x + r + 3} ${y - r - 3} L ${x - r - 3} ${y + r + 3}`} stroke={RED} strokeWidth="3" />}
    </g>
  );
}

export function Class6AlgebraBoxesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ k: 1, c: 0, op: '+', n: 5, open: false, caption: '', task: null }, visual);
  const k = int(s.k, 0, 6, 1);
  const c = int(s.c, 0, 9, 0);
  const op = s.op === '-' ? '-' : '+';
  const n = int(s.n, 1, 9, 5);
  const b = op === '-' ? -c : c;
  const value = k * n + b;
  const tv = useTween(value, 700);
  const task = s.task && typeof s.task.k === 'number' ? s.task : null;
  const done = !!task && k === task.k && c === task.c && op === (task.op || '+');
  useDone(done, onInteract);

  const bw = 64;
  const gap = 12;
  const boxesW = Math.max(1, k) * (bw + gap) - gap;
  const bx0 = op === '-' ? 300 - boxesW / 2 : 250 - boxesW / 2;
  return (
    <StoryStage
      eyebrow="Visualizer · Expressions"
      title={`Expression: ${expr(k, b)}`}
      footer={
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="Closed boxes" value={k} min={0} max={6} onChange={(v) => update({ k: v })} tone="text-sky-300" />
            <Slider label={op === '-' ? 'Laddoos taken out' : 'Loose laddoos'} value={c} min={0} max={9} onChange={(v) => update({ c: v })} />
            <Slider label="Value of n (laddoos in a box)" value={n} min={1} max={9} onChange={(v) => update({ n: v })} tone="text-pink-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ModePills value={op} onChange={(o) => update({ op: o })} options={[{ value: '+', label: 'Add loose laddoos' }, { value: '-', label: 'Take laddoos out' }]} />
            <button onClick={() => update({ open: !s.open })} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700">{s.open ? 'Close the boxes' : 'Open the boxes'}</button>
            <Readout label="Total laddoos" value={s.open ? Math.round(tv) : '?'} />
          </div>
          {task && <TaskBanner text={`Pack the order ${expr(task.k, task.op === '-' ? -task.c : task.c)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {s.caption && <text x="300" y="34" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontWeight="700" fontFamily={SANS}>{s.caption}</text>}
        {Array.from({ length: 6 }, (_, i) => {
          const x = bx0 + i * (bw + gap);
          const on = i < k;
          return (
            <g key={i} style={{ opacity: on ? 1 : 0, transition: `opacity 450ms ease ${i * 90}ms` }}>
              <rect x={x} y="90" width={bw} height={bw} rx="8" fill="#7c2d12" stroke="#fb923c" strokeWidth="2" />
              {Array.from({ length: n }, (_, j) => (
                <g key={j} style={{ opacity: s.open ? 1 : 0, transition: `opacity 350ms ease ${j * 50}ms` }}>
                  <Laddoo x={x + 14 + (j % 3) * 18} y={104 + Math.floor(j / 3) * 18} />
                </g>
              ))}
              <g style={{ transform: s.open ? 'translateY(-34px)' : 'none', transition: 'transform 600ms ease', transformBox: 'fill-box' }}>
                <rect x={x - 4} y="82" width={bw + 8} height="16" rx="5" fill="#ea580c" />
                <g style={{ opacity: s.open ? 0 : 1, transition: 'opacity 300ms' }}>
                  <rect x={x} y="98" width={bw} height={bw - 8} rx="6" fill="#9a3412" />
                  <text x={x + bw / 2} y="136" textAnchor="middle" fill="#fde68a" fontSize="28" fontWeight="900" fontFamily={MONO}>n</text>
                </g>
              </g>
            </g>
          );
        })}
        {op === '+' && Array.from({ length: c }, (_, j) => (
          <g key={`l${j}`} style={{ animation: `alFade 400ms ease ${j * 60}ms both` }}>
            <Laddoo x={bx0 + boxesW + 40 + (j % 3) * 26} y={104 + Math.floor(j / 3) * 24} r={10} />
          </g>
        ))}
        {op === '-' && (
          <g>
            {Array.from({ length: c }, (_, j) => (
              <Laddoo key={`t${j}`} x={300 - ((c - 1) * 26) / 2 + j * 26} y={196} r={10} crossed />
            ))}
            {c > 0 && <text x="300" y="228" textAnchor="middle" fill={RED} fontSize="13" fontWeight="700" fontFamily={SANS}>taken out of the boxes</text>}
          </g>
        )}
        <text x="300" y="285" textAnchor="middle" fill={AMBER} fontSize="40" fontWeight="900" fontFamily={MONO}>{expr(k, b)}</text>
        <g style={{ opacity: s.open ? 1 : 0, transition: 'opacity 500ms ease 300ms' }}>
          <text x="300" y="330" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily={MONO}>
            n = {n}: {k > 0 ? `${k} × ${n}` : ''}{b !== 0 ? `${k > 0 ? (b > 0 ? ' + ' : ' − ') : ''}${Math.abs(b)}` : ''} = {value}
          </text>
        </g>
        {value < 0 && s.open && <text x="300" y="352" textAnchor="middle" fill={RED} fontSize="13" fontWeight="700" fontFamily={SANS}>Not enough laddoos to take out!</text>}
      </svg>
      <style>{'@keyframes alFade { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: none } }'}</style>
    </StoryStage>
  );
}

// ─── WIDGET 3: Rules with variables: perimeters and a × b = b × a ───
export function Class6AlgebraRulesWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'square', s: 4, l: 6, b: 4, a: 3, c: 5, turn: false, task: null }, visual);
  const mode = ['square', 'triangle', 'rectangle', 'swap'].includes(s.mode) ? s.mode : 'square';
  const side = int(s.s, 1, 10, 4);
  const l = int(s.l, 1, 12, 6);
  const b = int(s.b, 1, 8, 4);
  const ra = int(s.a, 1, 6, 3);
  const rc = int(s.c, 1, 8, 5);
  const ts = useTween(side, 700);
  const tl = useTween(l, 700);
  const tb = useTween(b, 700);
  const per = mode === 'square' ? 4 * side : mode === 'triangle' ? 3 * side : mode === 'rectangle' ? 2 * (l + b) : ra * rc;
  const task = s.task && s.task.mode ? s.task : null;
  const done = !!task && mode === task.mode && per === task.value && (!task.notSquare || l !== b);
  useDone(done, onInteract);
  const U = 24;

  let picture;
  let formula;
  let working;
  if (mode === 'square') {
    const w = ts * U;
    const x = 175 - w / 2;
    const y = 180 - w / 2;
    picture = (
      <g>
        <rect x={x} y={y} width={w} height={w} fill="rgba(52,211,153,0.12)" stroke={GREEN} strokeWidth="4" />
        <text x={175} y={y - 10} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>s</text>
        <text x={175} y={y + w + 24} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>s</text>
        <text x={x - 16} y={186} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>s</text>
        <text x={x + w + 16} y={186} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>s</text>
      </g>
    );
    formula = 'P = 4 × s';
    working = `4 × ${side} = ${4 * side}`;
  } else if (mode === 'triangle') {
    const w = ts * U;
    const h = w * 0.866;
    const y0 = 180 + h / 2;
    const pts = `${175 - w / 2},${y0} ${175 + w / 2},${y0} 175,${y0 - h}`;
    picture = (
      <g>
        <polygon points={pts} fill="rgba(244,114,182,0.12)" stroke={PINK} strokeWidth="4" strokeLinejoin="round" />
        <text x={175} y={y0 + 24} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>l</text>
        <text x={175 - w / 4 - 16} y={y0 - h / 2} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>l</text>
        <text x={175 + w / 4 + 16} y={y0 - h / 2} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>l</text>
      </g>
    );
    formula = 'P = 3 × l';
    working = `3 × ${side} = ${3 * side}`;
  } else if (mode === 'rectangle') {
    const w = tl * U * 0.9;
    const h = tb * U * 0.9;
    const x = 175 - w / 2;
    const y = 180 - h / 2;
    picture = (
      <g>
        <rect x={x} y={y} width={w} height={h} fill="rgba(56,189,248,0.12)" stroke={SKY} strokeWidth="4" />
        <text x={175} y={y - 10} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>l = {l}</text>
        <text x={175} y={y + h + 24} textAnchor="middle" fill={AMBER} fontSize="18" fontWeight="900" fontFamily={MONO}>l</text>
        <text x={x - 10} y={186} textAnchor="end" fill={PINK} fontSize="18" fontWeight="900" fontFamily={MONO}>b = {b}</text>
        <text x={x + w + 10} y={186} fill={PINK} fontSize="18" fontWeight="900" fontFamily={MONO}>b</text>
      </g>
    );
    formula = 'P = 2 × (l + b)';
    working = `2 × (${l} + ${b}) = ${2 * (l + b)}`;
  } else {
    const rows = s.turn ? rc : ra;
    const cols = s.turn ? ra : rc;
    const step = 30;
    picture = (
      <g>
        {Array.from({ length: ra * rc }, (_, i) => {
          const r0 = Math.floor(i / rc);
          const c0 = i % rc;
          const r = s.turn ? c0 : r0;
          const cc = s.turn ? r0 : c0;
          const x = 175 - ((cols - 1) * step) / 2 + cc * step;
          const y = 180 - ((rows - 1) * step) / 2 + r * step;
          return <circle key={i} cx={x} cy={y} r="10" fill={r0 % 2 ? PURPLE : SKY} style={{ transition: 'cx 900ms ease, cy 900ms ease' }} />;
        })}
        <text x="175" y="345" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>{rows} rows of {cols} chairs</text>
      </g>
    );
    formula = 'a × b = b × a';
    working = `${ra} × ${rc} = ${rc} × ${ra} = ${ra * rc}`;
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Rules with variables"
      title={mode === 'swap' ? 'Turn the chairs: the total stays the same' : 'One rule for every size'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'square', label: 'Square' }, { value: 'triangle', label: 'Equilateral triangle' }, { value: 'rectangle', label: 'Rectangle' }, { value: 'swap', label: 'Rows of chairs' }]} />
          {(mode === 'square' || mode === 'triangle') && <Slider label={`Side ${mode === 'square' ? 's' : 'l'} (m)`} value={side} min={1} max={10} onChange={(v) => update({ s: v })} />}
          {mode === 'rectangle' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Slider label="Length l (m)" value={l} min={1} max={12} onChange={(v) => update({ l: v })} />
              <Slider label="Breadth b (m)" value={b} min={1} max={8} onChange={(v) => update({ b: v })} tone="text-pink-300" />
            </div>
          )}
          {mode === 'swap' && (
            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <Slider label="a (rows)" value={ra} min={1} max={6} onChange={(v) => update({ a: v })} tone="text-sky-300" />
              <Slider label="b (chairs in a row)" value={rc} min={1} max={8} onChange={(v) => update({ c: v })} />
              <button onClick={() => update({ turn: !s.turn })} className="px-3 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700">Turn the chairs</button>
            </div>
          )}
          {task && <TaskBanner text={task.text} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {picture}
        <rect x="350" y="110" width="230" height="140" rx="14" fill="#0f172a" stroke="#334155" />
        <text x="465" y="150" textAnchor="middle" fill={GREEN} fontSize="22" fontWeight="900" fontFamily={MONO}>{formula}</text>
        <text x="465" y="190" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>{mode === 'swap' ? 'for every a and b' : 'for these sides:'}</text>
        <text x="465" y="225" textAnchor="middle" fill={AMBER} fontSize={working.length > 16 ? 17 : 21} fontWeight="900" fontFamily={MONO}>{working}{mode === 'swap' ? '' : ' m'}</text>
        <text x="465" y="80" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700" fontFamily={SANS}>{mode === 'swap' ? 'Order of multiplying' : 'Perimeter P'}</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: A two-pan balance: expression vs equation ───
function Pan({ x, y, items }) {
  return (
    <g>
      <line x1={x} y1={y - 70} x2={x - 60} y2={y} stroke="#94a3b8" strokeWidth="1.5" />
      <line x1={x} y1={y - 70} x2={x + 60} y2={y} stroke="#94a3b8" strokeWidth="1.5" />
      <path d={`M ${x - 75} ${y} Q ${x} ${y + 30} ${x + 75} ${y} Z`} fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
      {items}
    </g>
  );
}

export function Class6AlgebraBalanceWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 1, b: 3, c: 11, x: 4, rhs: true, letter: 'x', task: null }, visual);
  const a = int(s.a, 1, 3, 1);
  const b = int(s.b, 0, 9, 3);
  const c = int(s.c, 0, 40, 11);
  const x = int(s.x, 0, 15, 4);
  const v = String(s.letter || 'x').slice(0, 1);
  const left = a * x + b;
  const rhs = s.rhs !== false;
  const diff = rhs ? left - c : 0;
  const angle = useTween(clamp(-diff * 2.5, -16, 16), 800);
  const balanced = rhs && diff === 0;
  const done = !!s.task && balanced;
  useDone(done, onInteract);

  const px = 300;
  const py = 120;
  const arm = 165;
  const rad = (angle * Math.PI) / 180;
  const lx = px - arm * Math.cos(rad);
  const ly = py - arm * Math.sin(rad);
  const rx = px + arm * Math.cos(rad);
  const ry = py + arm * Math.sin(rad);

  const bags = Array.from({ length: a }, (_, i) => (
    <g key={`bag${i}`}>
      <path d={`M ${lx - 58 + i * 34} ${ly + 68} q 2 -26 14 -30 q 12 4 14 30 z`} fill="#b45309" stroke="#fde68a" strokeWidth="1.5" />
      <text x={lx - 44 + i * 34} y={ly + 64} textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="900" fontFamily={MONO}>{v}</text>
    </g>
  ));
  const loose = Array.from({ length: b }, (_, i) => <Laddoo key={`lb${i}`} x={lx + (a > 1 ? 18 : 6) + (i % 4) * 14} y={ly + 62 - Math.floor(i / 4) * 13} r={6} />);
  const right = rhs ? Array.from({ length: c }, (_, i) => <Laddoo key={`r${i}`} x={rx - 52 + (i % 8) * 14} y={ry + 62 - Math.floor(i / 8) * 13} r={6} color={PINK} />) : null;
  const status = !rhs
    ? `Only an expression: ${expr(a, b, v)} has value ${left} when ${v} = ${x}`
    : balanced ? `Balanced! ${v} = ${x} is the solution.` : diff < 0 ? `${left} is less than ${c}: left side too light` : `${left} is more than ${c}: left side too heavy`;

  return (
    <StoryStage
      eyebrow="Visualizer · Equations"
      title={rhs ? `${expr(a, b, v)} = ${c}` : `${expr(a, b, v)} (no equals sign)`}
      footer={
        <div className="space-y-3">
          <Slider label={`Try ${v} =`} value={x} min={0} max={15} onChange={(val) => update({ x: val })} tone="text-sky-300" />
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="LHS" value={left} tone="text-amber-300" />
            {rhs && <Readout label="RHS" value={c} tone="text-pink-300" />}
            <Readout label="Status" value={!rhs ? 'expression' : balanced ? 'true' : 'not true'} tone={balanced ? 'text-emerald-400' : 'text-slate-300'} />
          </div>
          {s.task && <TaskBanner text={`Find the value of ${v} that balances ${expr(a, b, v)} = ${c}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <polygon points={`${px},${py} ${px - 30},300 ${px + 30},300`} fill="#334155" />
        <rect x={px - 80} y="300" width="160" height="12" rx="4" fill="#475569" />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <circle cx={px} cy={py} r="8" fill={AMBER} />
        <Pan x={lx} y={ly + 70} items={<g transform="translate(0,0)">{bags}{loose}</g>} />
        {rhs && <Pan x={rx} y={ry + 70} items={right} />}
        <text x={lx} y={ly + 125} textAnchor="middle" fill={AMBER} fontSize="20" fontWeight="900" fontFamily={MONO}>{expr(a, b, v)}</text>
        {rhs && <text x={rx} y={ry + 125} textAnchor="middle" fill={PINK} fontSize="20" fontWeight="900" fontFamily={MONO}>{c}</text>}
        <text x="300" y="345" textAnchor="middle" fill={balanced ? GREEN : '#cbd5e1'} fontSize="16" fontWeight="800" fontFamily={SANS}>{status}</text>
        <text x="300" y="32" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700" fontFamily={SANS}>Every bag holds {v} laddoos · each laddoo weighs the same</text>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Solving an equation by trial and error ───
export function Class6AlgebraTrialWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 4, b: 6, c: 30, letter: 'x', tries: [], guess: 5, task: null }, visual);
  const a = int(s.a, 1, 9, 4);
  const b = int(s.b, -20, 20, 6);
  const c = int(s.c, -50, 200, 30);
  const v = String(s.letter || 'x').slice(0, 1);
  const tries = (Array.isArray(s.tries) ? s.tries : []).map((t) => int(t, 0, 50, 0));
  const guess = int(s.guess, 0, 50, 5);
  const lhs = (t) => a * t + b;
  const solved = tries.some((t) => lhs(t) === c);
  const done = !!s.task && solved;
  useDone(done, onInteract);
  const rows = tries.slice(-6);
  const last = rows[rows.length - 1];
  const hint = last === undefined ? 'Pick a value and press Try.' : lhs(last) === c ? `${v} = ${last} makes both sides equal!` : lhs(last) < c ? `Too small: try a bigger ${v}.` : `Too big: try a smaller ${v}.`;
  const work = (t) => `${a === 1 ? '' : `${a} × `}${t}${b === 0 ? '' : b > 0 ? ` + ${b}` : ` − ${-b}`}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Trial and error"
      title={`Solve ${expr(a, b, v)} = ${c}`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]"><Slider label={`Your guess for ${v}`} value={guess} min={0} max={50} onChange={(val) => update({ guess: val })} tone="text-sky-300" /></div>
            <button onClick={() => update({ tries: [...tries, guess] })} className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 text-sm font-bold">Try {v} = {guess}</button>
            <button onClick={() => update({ tries: [] })} className="px-3 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-300">Clear</button>
          </div>
          {s.task && <TaskBanner text={`Find the value of ${v} that makes ${expr(a, b, v)} = ${c} true.`} done={done} />}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <text x="300" y="44" textAnchor="middle" fill={AMBER} fontSize="32" fontWeight="900" fontFamily={MONO}>{expr(a, b, v)} = {c}</text>
        <text x="80" y="84" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800" fontFamily={SANS}>{v}</text>
        <text x="260" y="84" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800" fontFamily={SANS}>LHS = {expr(a, b, v)}</text>
        <text x="480" y="84" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800" fontFamily={SANS}>compared with {c}</text>
        <line x1="30" y1="94" x2="570" y2="94" stroke="#334155" />
        {rows.map((t, i) => {
          const val = lhs(t);
          const ok = val === c;
          const tone = ok ? GREEN : val < c ? SKY : RED;
          return (
            <g key={`${tries.length - rows.length + i}-${t}`} style={{ animation: 'alRow 450ms ease both' }}>
              <rect x="30" y={100 + i * 36} width="540" height="30" rx="8" fill={ok ? 'rgba(52,211,153,0.15)' : '#0f172a'} />
              <text x="80" y={121 + i * 36} textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" fontFamily={MONO}>{t}</text>
              <text x="260" y={121 + i * 36} textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="800" fontFamily={MONO}>{work(t)} = {val}</text>
              <text x="480" y={121 + i * 36} textAnchor="middle" fill={tone} fontSize="15" fontWeight="900" fontFamily={SANS}>{ok ? '✔ equal' : val < c ? 'too small ↑' : 'too big ↓'}</text>
            </g>
          );
        })}
        {rows.length === 0 && <text x="300" y="190" textAnchor="middle" fill="#475569" fontSize="16" fontWeight="700" fontFamily={SANS}>No tries yet</text>}
        <text x="300" y="342" textAnchor="middle" fill={solved ? GREEN : '#cbd5e1'} fontSize="16" fontWeight="800" fontFamily={SANS}>{hint}</text>
      </svg>
      <style>{'@keyframes alRow { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: none } }'}</style>
    </StoryStage>
  );
}
