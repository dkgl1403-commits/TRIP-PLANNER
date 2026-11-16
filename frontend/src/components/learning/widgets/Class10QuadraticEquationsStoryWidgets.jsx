import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Quadratic Equations — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const seg = (p, from, to) => clamp((p - from) / (to - from), 0, 1);
const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const MINUS = '−';
const sgn = (v) => (v < 0 ? MINUS : '+');
const FADE = '@keyframes qeFadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }';
const fade = (i, step = 120) => ({ animation: `qeFadeIn 500ms ease ${i * step}ms both` });

// "2x² − 7x + 3" (display only; spoken lines are written out in words)
function fmtQuad(a, b, c) {
  const out = [];
  if (a) out.push(`${a === 1 ? '' : a === -1 ? MINUS : a < 0 ? MINUS + Math.abs(a) : a}x²`);
  if (b) out.push(`${out.length ? ` ${sgn(b)} ` : b < 0 ? MINUS : ''}${Math.abs(b) === 1 ? '' : Math.abs(b)}x`);
  if (c || !out.length) out.push(`${out.length ? ` ${sgn(c)} ` : c < 0 ? MINUS : ''}${Math.abs(c)}`);
  return out.join('');
}
const fmtNum = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));
// p/q reduced, as a string
function fracStr(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(Math.abs(p), q) || 1;
  const [n, d] = [p / g, q / g];
  return d === 1 ? fmtNum(n) : `${fmtNum(n)}/${d}`;
}
const round2 = (v) => fmtNum(Math.round(v * 100) / 100);

// 0 → 1 progress that restarts whenever `dep` changes
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

// A small graph of y = f(x) inside box {x, y, w, h}, clipped, with axes and marked roots
function Plot({ id, f, x0, x1, y0, y1, box, color = AMBER, roots = [], marker, grid = 1 }) {
  const sx = (x) => box.x + ((x - x0) / (x1 - x0)) * box.w;
  const sy = (y) => box.y + box.h - ((y - y0) / (y1 - y0)) * box.h;
  const pts = Array.from({ length: 161 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 160;
    return `${sx(x).toFixed(1)},${clamp(sy(f(x)), -2000, 2000).toFixed(1)}`;
  });
  const ticks = [];
  for (let t = Math.ceil(x0 / grid) * grid; t <= x1; t += grid) ticks.push(t);
  return (
    <g>
      <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="8" fill="#0b1222" stroke="#1e293b" />
      <g clipPath={`url(#${id})`}>
        {ticks.map((t) => <line key={t} x1={sx(t)} y1={box.y} x2={sx(t)} y2={box.y + box.h} stroke="#1e293b" strokeWidth="1" />)}
        {y0 < 0 && y1 > 0 && <line x1={box.x} y1={sy(0)} x2={box.x + box.w} y2={sy(0)} stroke="#64748b" strokeWidth="2" />}
        {x0 < 0 && x1 > 0 && <line x1={sx(0)} y1={box.y} x2={sx(0)} y2={box.y + box.h} stroke="#64748b" strokeWidth="2" />}
        <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" />
        {roots.filter((r) => r >= x0 && r <= x1).map((r, i) => (
          <g key={`${i}-${r.toFixed(3)}`}>
            <circle cx={sx(r)} cy={sy(0)} r="7" fill={GREEN} stroke="#020617" strokeWidth="2" />
            <circle cx={sx(r)} cy={sy(0)} r="7" fill="none" stroke={GREEN} strokeWidth="2">
              <animate attributeName="r" values="7;20" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {marker != null && Number.isFinite(f(marker)) && (
          <g>
            <line x1={sx(marker)} y1={sy(0)} x2={sx(marker)} y2={clamp(sy(f(marker)), box.y, box.y + box.h)} stroke={SKY} strokeWidth="2" strokeDasharray="4 4" />
            <circle cx={sx(marker)} cy={clamp(sy(f(marker)), box.y, box.y + box.h)} r="7" fill={SKY} />
          </g>
        )}
      </g>
      {y0 < 0 && y1 > 0 && <text x={box.x + box.w - 4} y={sy(0) - 6} textAnchor="end" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily="sans-serif">x</text>}
    </g>
  );
}

// ─── WIDGET 1: What is a quadratic equation? Rearranging to standard form; sorting equations ───
const FORMS = [
  { steps: ['x(x + 3) = 180', 'x² + 3x = 180', 'x² + 3x − 180 = 0'], abc: [1, 3, -180], quad: true },
  { steps: ['(x − 2)² + 1 = 2x − 3', 'x² − 4x + 4 + 1 = 2x − 3', 'x² − 6x + 8 = 0'], abc: [1, -6, 8], quad: true },
  { steps: ['x(2x + 3) = x² + 1', '2x² + 3x = x² + 1', 'x² + 3x − 1 = 0'], abc: [1, 3, -1], quad: true },
  { steps: ['(x + 2)³ = x³ − 4', 'x³ + 6x² + 12x + 8 = x³ − 4', '6x² + 12x + 12 = 0'], abc: [6, 12, 12], quad: true },
  { steps: ['x(x + 1) + 8 = (x + 2)(x − 2)', 'x² + x + 8 = x² − 4', 'x + 12 = 0'], abc: [0, 1, 12], quad: false },
  { steps: ['(x − 3)(2x + 1) = x(x + 5)', '2x² − 5x − 3 = x² + 5x', 'x² − 10x − 3 = 0'], abc: [1, -10, -3], quad: true },
];

export function Class10QuadStandardFormWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'form', eq: 0, step: 2, picked: [], task: false }, visual);
  const mode = s.mode === 'sort' ? 'sort' : 'form';
  const eq = clamp(Math.round(num(s.eq, 0)), 0, FORMS.length - 1);
  const step = clamp(Math.round(num(s.step, 2)), 0, 2);
  const F = FORMS[eq];
  const picked = Array.isArray(s.picked) ? s.picked : [];
  const correct = FORMS.map((f, i) => (f.quad ? i : -1)).filter((i) => i >= 0);
  const done = !!s.task && mode === 'sort' && picked.length === correct.length && correct.every((i) => picked.includes(i));
  useDone(done, onInteract);
  const toggle = (i) => update({ picked: picked.includes(i) ? picked.filter((j) => j !== i) : [...picked, i] });

  const [a, b, c] = F.abc;
  return (
    <StoryStage
      eyebrow="Visualizer · Standard form"
      title={mode === 'form' ? 'Bring everything to one side: ax² + bx + c = 0' : 'Which of these are quadratic?'}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'form', label: 'Rearrange' }, { value: 'sort', label: 'Sort the equations' }]} />
          {mode === 'form' ? (
            <div className="flex flex-wrap gap-2 items-center">
              {FORMS.map((f, i) => (
                <button key={f.steps[0]} onClick={() => update({ eq: i, step: 0 })} className={`px-2 py-1 rounded-lg text-xs font-mono border ${i === eq ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}>{f.steps[0]}</button>
              ))}
              <button onClick={() => update({ step: step < 2 ? step + 1 : 0 })} className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">{step < 2 ? 'Next step' : 'Start again'}</button>
            </div>
          ) : (
            <TaskBanner text={s.task ? 'Your turn: tap every equation that is quadratic (highest power exactly 2 after simplifying).' : 'Tap the cards you think are quadratic.'} done={done} />
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {mode === 'form' ? (
          <>
            {F.steps.map((t, i) => (
              <g key={`${eq}-${i}`} style={{ opacity: i <= step ? 1 : 0, transition: 'opacity 600ms ease' }}>
                <text x="300" y={62 + i * 62} textAnchor="middle" fill={i === 2 ? (F.quad ? GREEN : RED) : INK} fontSize={i === 2 ? 30 : 25} fontWeight="900" fontFamily="monospace">{t}</text>
                {i < 2 && <text x="300" y={92 + i * 62} textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="900" fontFamily="sans-serif">{i === 0 ? '▼ expand' : '▼ move every term to the left'}</text>}
              </g>
            ))}
            <g style={{ opacity: step === 2 ? 1 : 0, transition: 'opacity 600ms ease 300ms' }}>
              {F.quad ? (
                [['a', a, AMBER], ['b', b, SKY], ['c', c, PINK]].map(([k, v, col], i) => (
                  <g key={k} transform={`translate(${150 + i * 150} 250)`}>
                    <rect x="-55" y="-26" width="110" height="64" rx="14" fill="#0f172a" stroke={col} strokeWidth="2.5" />
                    <text x="0" y="-4" textAnchor="middle" fill={col} fontSize="16" fontWeight="900" fontFamily="sans-serif">{k}</text>
                    <text x="0" y="28" textAnchor="middle" fill={col} fontSize="26" fontWeight="900" fontFamily="monospace">{fmtNum(v)}</text>
                  </g>
                ))
              ) : (
                <text x="300" y="262" textAnchor="middle" fill={RED} fontSize="20" fontWeight="900" fontFamily="sans-serif">The x² terms cancel: degree 1, NOT quadratic</text>
              )}
              <text x="300" y="335" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700" fontFamily="sans-serif">
                {F.quad ? `Quadratic: a = ${fmtNum(a)} is not 0` : 'A quadratic needs a ≠ 0 after simplifying'}
              </text>
            </g>
          </>
        ) : (
          <>
            {FORMS.map((f, i) => {
              const x = 30 + (i % 2) * 280;
              const y = 18 + Math.floor(i / 2) * 110;
              const on = picked.includes(i);
              const reveal = done || !s.task;
              const border = on ? (reveal ? (f.quad ? GREEN : RED) : AMBER) : '#334155';
              return (
                <g key={f.steps[0]} onClick={() => toggle(i)} style={{ cursor: 'pointer', ...fade(i) }}>
                  <rect x={x} y={y} width="260" height="96" rx="14" fill={on ? '#111c33' : '#0f172a'} stroke={border} strokeWidth={on ? 3 : 1.5} />
                  <text x={x + 130} y={y + 40} textAnchor="middle" fill={INK} fontSize="16" fontWeight="900" fontFamily="monospace">{f.steps[0]}</text>
                  <text x={x + 130} y={y + 74} textAnchor="middle" fill={on && reveal ? (f.quad ? GREEN : RED) : '#64748b'} fontSize="14" fontWeight="800" fontFamily="monospace">
                    {on && reveal ? (f.quad ? `✔ ${f.steps[2]}` : `✘ ${f.steps[2]}`) : on ? 'picked' : 'tap to pick'}
                  </text>
                </g>
              );
            })}
          </>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Forming a quadratic from a story, then testing values of x ───
const MODELS = {
  tray: { title: "Mummy's cake tray: length 3 cm more than width, area 180 cm²", eq: 'x(x + 3) = 180', std: 'x² + 3x − 180 = 0', abc: [1, 3, -180], min: 0, max: 20, root: 12, other: -15, unit: 'cm' },
  consec: { title: 'Two consecutive positive integers, product 306', eq: 'x(x + 1) = 306', std: 'x² + x − 306 = 0', abc: [1, 1, -306], min: 0, max: 25, root: 17, other: -18, unit: '' },
  train: { title: '360 km trip: 5 km/h faster would take 1 hour less', eq: '360/x − 360/(x + 5) = 1', std: 'x² + 5x − 1800 = 0', abc: [1, 5, -1800], min: 10, max: 80, root: 40, other: -45, unit: 'km/h' },
};

export function Class10QuadModelWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ model: 'tray', x: 8, showEq: true, showGraph: false, task: false }, visual);
  const key = MODELS[s.model] ? s.model : 'tray';
  const M = MODELS[key];
  const x = clamp(Math.round(num(s.x, M.min)), M.min, M.max);
  const tx = useTween(x, 500);
  const [a, b, c] = M.abc;
  const g = (v) => a * v * v + b * v + c;
  const done = !!s.task && x === M.root;
  useDone(done, onInteract);

  let picture;
  if (key === 'tray') {
    const k = 9;
    const w = tx * k;
    const l = (tx + 3) * k;
    const area = Math.round(tx * (tx + 3));
    picture = (
      <g>
        <rect x={40} y={60} width={l} height={w} rx="8" fill={x === M.root ? '#065f46' : '#78350f'} stroke={AMBER} strokeWidth="3" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={40 + l * ((i % 3) + 0.5) / 3} cy={60 + w * (Math.floor(i / 3) + 0.5) / 2} r={Math.min(10, w / 6)} fill="#fde68a" opacity="0.6" />)}
        <text x={40 + l / 2} y={52} textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily="monospace">x + 3 = {Math.round(tx) + 3}</text>
        <text x={34} y={60 + w / 2} textAnchor="end" fill={AMBER} fontSize="15" fontWeight="900" fontFamily="monospace">x={Math.round(tx)}</text>
        <text x={40} y={340} fill={area === 180 ? GREEN : INK} fontSize="18" fontWeight="900" fontFamily="monospace">Area = {area} {area === 180 ? '= 180 ✔' : area < 180 ? '< 180' : '> 180'}</text>
      </g>
    );
  } else if (key === 'consec') {
    const p = x * (x + 1);
    picture = (
      <g>
        {[x, x + 1].map((v, i) => (
          <g key={i}>
            <rect x={40} y={90 + i * 70} width={v * 10} height="44" rx="8" fill={i ? SKY : PINK} opacity="0.8" style={{ transition: 'width 500ms ease' }} />
            <text x={50 + v * 10} y={120 + i * 70} fill={i ? SKY : PINK} fontSize="20" fontWeight="900" fontFamily="monospace">{v}</text>
          </g>
        ))}
        <text x={40} y={70} fill="#94a3b8" fontSize="15" fontWeight="800" fontFamily="sans-serif">x and the next integer x + 1</text>
        <text x={40} y={300} fill={p === 306 ? GREEN : INK} fontSize="20" fontWeight="900" fontFamily="monospace">{x} × {x + 1} = {p} {p === 306 ? '✔' : p < 306 ? '< 306' : '> 306'}</text>
      </g>
    );
  } else {
    const t1 = 360 / x;
    const t2 = 360 / (x + 5);
    const k = 6;
    picture = (
      <g>
        <text x={40} y={70} fill="#94a3b8" fontSize="14" fontWeight="800" fontFamily="sans-serif">Time for 360 km (bar length = hours)</text>
        <rect x={40} y={90} width={Math.min(270, t1 * k)} height="40" rx="8" fill={PINK} opacity="0.8" style={{ transition: 'width 500ms ease' }} />
        <text x={40} y={152} fill={PINK} fontSize="15" fontWeight="900" fontFamily="monospace">{x} km/h: {round2(t1)} h</text>
        <rect x={40} y={180} width={Math.min(270, t2 * k)} height="40" rx="8" fill={SKY} opacity="0.8" style={{ transition: 'width 500ms ease' }} />
        <text x={40} y={242} fill={SKY} fontSize="15" fontWeight="900" fontFamily="monospace">{x + 5} km/h: {round2(t2)} h</text>
        <text x={40} y={300} fill={Math.abs(t1 - t2 - 1) < 1e-9 ? GREEN : INK} fontSize="18" fontWeight="900" fontFamily="monospace">Difference = {round2(t1 - t2)} h {Math.abs(t1 - t2 - 1) < 1e-9 ? '✔' : ''}</text>
      </g>
    );
  }

  const ys = [g(M.min), g(M.max), g(0), 0];
  const y0 = Math.min(...ys) * 1.1;
  const y1 = Math.max(...ys) * 1.1 || 10;
  return (
    <StoryStage
      eyebrow="Visualizer · From words to an equation"
      title={M.title}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <ModePills value={key} onChange={(m) => update({ model: m, x: MODELS[m].min + 2 })} options={[{ value: 'tray', label: 'Cake tray' }, { value: 'consec', label: 'Consecutive integers' }, { value: 'train', label: 'Train speed' }]} />
          <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-center">
            <Slider label={`Try a value of x${M.unit ? ` (${M.unit})` : ''}`} value={x} min={M.min} max={M.max} onChange={(v) => update({ x: v })} />
            <Readout label="LHS of standard form" value={fmtNum(g(x))} tone={g(x) === 0 ? 'text-emerald-400' : 'text-amber-300'} />
            <button onClick={() => update({ showGraph: !s.showGraph })} className="px-3 py-2 rounded-lg text-xs font-bold border border-slate-600 text-slate-300">{s.showGraph ? 'Hide graph' : 'Show graph'}</button>
          </div>
          {s.task && <TaskBanner text={`Your turn: slide x until the left side becomes 0. That x answers the story.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {picture}
        <g style={{ opacity: s.showEq ? 1 : 0, transition: 'opacity 600ms ease' }}>
          <rect x="330" y="20" width="250" height="84" rx="12" fill="#0f172a" stroke="#334155" />
          <text x="455" y="52" textAnchor="middle" fill={INK} fontSize="16" fontWeight="900" fontFamily="monospace">{M.eq}</text>
          <text x="455" y="86" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily="monospace">{M.std}</text>
        </g>
        <g style={{ opacity: s.showGraph ? 1 : 0, transition: 'opacity 600ms ease' }}>
          <Plot id={`qe-model-${key}`} f={g} x0={M.min} x1={M.max} y0={y0} y1={y1} box={{ x: 330, y: 120, w: 250, h: 200 }} roots={done || x === M.root ? [M.root] : []} marker={x} grid={key === 'train' ? 10 : 5} />
          <text x="455" y="342" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily="sans-serif">y = {M.std.replace(' = 0', '')}</text>
        </g>
        {x === M.root && (
          <text x="455" y={s.showGraph ? 112 : 160} textAnchor="middle" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="sans-serif" style={fade(0)}>
            Roots: {M.root} and {fmtNum(M.other)} ({fmtNum(M.other)} rejected)
          </text>
        )}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Factorisation by splitting the middle term ───
function splitData(a, b, c, order) {
  const P = a * c;
  const pairs = [];
  const lim = Math.abs(P) || 1;
  for (let d = 1; d <= lim; d += 1) {
    if (P === 0 || lim % d) continue;
    for (const sd of [1, -1]) {
      const p = sd * d;
      const q = P / p;
      if (p <= q && !pairs.some(([x, y]) => x === p && y === q)) pairs.push([p, q]);
    }
  }
  const good = pairs.find(([p, q]) => p + q === b);
  let show = pairs.filter(([p]) => (P > 0 ? Math.sign(p) === Math.sign(b || 1) : true));
  show.sort((u, v) => Math.abs(u[0] + u[1] - b) - Math.abs(v[0] + v[1] - b));
  show = show.slice(0, 6);
  if (good && !show.includes(good)) show[5] = good;
  show.sort((u, v) => u[0] - v[0]);
  let fac = null;
  if (good) {
    const [p, q] = Array.isArray(order) && order.length === 2 && order[0] + order[1] === b && order[0] * order[1] === P ? order : good;
    const g = gcd(Math.abs(a), Math.abs(p)) * Math.sign(a);
    const [a1, b1, a2] = [a / g, p / g, g];
    const b2 = (q * g) / a;
    if (Number.isInteger(b2)) fac = { a1, b1, a2, b2, g, p, q };
  }
  return { P, pairs: show, good, fac };
}
const lin = (m, k) => `${m === 1 ? '' : m === -1 ? MINUS : fmtNum(m)}x ${sgn(k)} ${Math.abs(k)}`;

export function Class10QuadSplitWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 2, b: -5, c: 3, step: 4, task: false, chosen: null, split: null }, visual);
  const a = Math.round(num(s.a, 2)) || 1;
  const b = Math.round(num(s.b, -5));
  const c = Math.round(num(s.c, 3));
  const { P, pairs, good, fac } = splitData(a, b, c, s.split);
  const chosen = Array.isArray(s.chosen) ? s.chosen : null;
  const pickedRight = !!chosen && !!good && chosen[0] === good[0] && chosen[1] === good[1];
  const step = s.task ? (pickedRight ? 4 : 1) : clamp(Math.round(num(s.step, 4)), 0, 4);
  const done = !!s.task && pickedRight;
  useDone(done, onInteract);
  const p = useReplay(`${a},${b},${c},${step}`, 900);

  const groupG = fac ? fac.g : 1;
  const lines = fac && good ? [
    `${fmtQuad(a, 0, 0)} ${sgn(fac.p)} ${Math.abs(fac.p)}x ${sgn(fac.q)} ${Math.abs(fac.q)}x ${sgn(c)} ${Math.abs(c)} = 0`,
    `${groupG === 1 ? '' : groupG === -1 ? MINUS : fmtNum(groupG)}x(${lin(fac.a1, fac.b1)}) ${sgn(fac.b2)} ${Math.abs(fac.b2)}(${lin(fac.a1, fac.b1)}) = 0`,
    `(${lin(fac.a1, fac.b1)})(${lin(fac.a2, fac.b2)}) = 0`,
    `x = ${fracStr(-fac.b1, fac.a1)}  or  x = ${fracStr(-fac.b2, fac.a2)}`,
  ] : ['No integer pair works: use the quadratic formula.'];

  return (
    <StoryStage
      eyebrow="Visualizer · Splitting the middle term"
      title={`${fmtQuad(a, b, c)} = 0`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <div className="flex flex-wrap gap-2 items-center">
            {[[2, -5, 3], [1, 3, -180], [6, -1, -2], [1, -6, 9], [2, 1, -6], [3, -5, 2]].map(([x, y, z]) => (
              <button key={`${x}${y}${z}`} onClick={() => update({ a: x, b: y, c: z, step: 0, chosen: null, split: null })} className={`px-2 py-1 rounded-lg text-xs font-mono border ${x === a && y === b && z === c ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}>{fmtQuad(x, y, z)}</button>
            ))}
            {!s.task && <button onClick={() => update({ step: step < 4 ? step + 1 : 0 })} className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">{step < 4 ? 'Next step' : 'Start again'}</button>}
          </div>
          {s.task && <TaskBanner text={`Your turn: tap the pair whose product is ${fmtNum(P)} and whose sum is ${fmtNum(b)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <g>
          <rect x="20" y="16" width="270" height="60" rx="12" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
          <text x="155" y="42" textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily="sans-serif">Product a × c = {fmtNum(a)} × {fmtNum(c)} = {fmtNum(P)}</text>
          <text x="155" y="66" textAnchor="middle" fill={SKY} fontSize="15" fontWeight="900" fontFamily="sans-serif">Sum must be b = {fmtNum(b)}</text>
        </g>
        <g style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 500ms ease' }}>
          <text x="440" y="34" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="800" fontFamily="sans-serif">Pairs with product {fmtNum(P)}</text>
          {pairs.map(([u, v], i) => {
            const right = good && u === good[0] && v === good[1];
            const isChosen = chosen && chosen[0] === u && chosen[1] === v;
            const lit = s.task ? isChosen : right && step >= 1;
            const col = lit ? (right ? GREEN : RED) : '#334155';
            const x = 320 + (i % 2) * 135;
            const y = 46 + Math.floor(i / 2) * 36;
            return (
              <g key={`${u},${v}`} onClick={() => s.task && update({ chosen: [u, v] })} style={{ cursor: s.task ? 'pointer' : 'default', ...fade(i, 90) }}>
                <rect x={x} y={y} width="125" height="30" rx="10" fill={lit ? '#0b2a22' : '#0f172a'} stroke={col} strokeWidth={lit ? 2.5 : 1.5} />
                <text x={x + 62} y={y + 20} textAnchor="middle" fill={lit ? col : INK} fontSize="14" fontWeight="900" fontFamily="monospace">{fmtNum(u)}, {fmtNum(v)} → {fmtNum(u + v)}</text>
              </g>
            );
          })}
        </g>
        {lines.map((t, i) => {
          const show = fac ? step >= i + 1 && (s.task ? pickedRight : true) : step >= 1;
          const k = fac ? (i === 3 ? GREEN : i === 2 ? PURPLE : INK) : RED;
          return (
            <text key={t} x="30" y={205 + i * 38} fill={k} fontSize={i === 3 ? 22 : 19} fontWeight="900" fontFamily="monospace"
              style={{ opacity: show ? (i + 1 === step ? seg(p, 0, 0.6) : 1) : 0, transition: 'opacity 300ms ease' }}>
              {t}
            </text>
          );
        })}
        {fac && step >= 2 && <text x="30" y="175" fill="#64748b" fontSize="12" fontWeight="800" fontFamily="sans-serif">split → group → common bracket → each factor = 0</text>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: The quadratic formula with live substitution and graph ───
export function Class10QuadFormulaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 2, b: -7, c: 3, step: 3, task: null }, visual);
  const a = clamp(Math.round(num(s.a, 1)), -4, 4) || 1;
  const b = clamp(Math.round(num(s.b, 0)), -12, 12);
  const c = clamp(Math.round(num(s.c, 0)), -12, 12);
  const step = clamp(Math.round(num(s.step, 3)), 0, 3);
  const D = b * b - 4 * a * c;
  const ta = useTween(a, 600);
  const tb = useTween(b, 600);
  const tc = useTween(c, 600);
  const sq = D >= 0 ? Math.sqrt(D) : NaN;
  const perfect = D >= 0 && Number.isInteger(sq);
  const roots = D > 0 ? [(-b + sq) / (2 * a), (-b - sq) / (2 * a)] : D === 0 ? [-b / (2 * a)] : [];
  const task = s.task && Number.isFinite(Number(s.task.a)) ? s.task : null;
  const done = !!task && a === task.a && b === task.b && c === task.c && step === 3;
  useDone(done, onInteract);

  const rootText = D < 0 ? 'D < 0: no real roots' : perfect
    ? (D === 0 ? `x = ${fracStr(-b, 2 * a)} (equal roots)` : `x = ${fracStr(-b + sq, 2 * a)}  or  x = ${fracStr(-b - sq, 2 * a)}`)
    : `x = (${fmtNum(-b)} ± √${D}) / ${2 * a} ≈ ${round2(roots[0])}, ${round2(roots[1])}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Sridharacharya's formula"
      title={`${fmtQuad(a, b, c)} = 0`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <div className="grid grid-cols-3 gap-3">
            <Slider label="a" value={a} min={-4} max={4} onChange={(v) => update({ a: v === 0 ? (a > 0 ? -1 : 1) : v })} />
            <Slider label="b" value={b} min={-12} max={12} onChange={(v) => update({ b: v })} tone="text-sky-300" />
            <Slider label="c" value={c} min={-12} max={12} onChange={(v) => update({ c: v })} tone="text-pink-300" />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <button onClick={() => update({ step: step < 3 ? step + 1 : 0 })} className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-200">{step < 3 ? 'Next step' : 'Start again'}</button>
            <Readout label="D = b² − 4ac" value={fmtNum(D)} tone={D > 0 ? 'text-emerald-400' : D === 0 ? 'text-amber-300' : 'text-rose-400'} />
          </div>
          {task && <TaskBanner text={`Your turn: set a, b, c for ${fmtQuad(task.a, task.b, task.c)} = 0 and press Next step until the roots appear.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <rect x="16" y="14" width="300" height="70" rx="12" fill="#0f172a" stroke={GREEN} strokeWidth="2" />
        <text x="166" y="44" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace">x = (−b ± √(b² − 4ac))</text>
        <line x1="60" y1="54" x2="272" y2="54" stroke={GREEN} strokeWidth="2" />
        <text x="166" y="76" textAnchor="middle" fill={GREEN} fontSize="20" fontWeight="900" fontFamily="monospace">2a</text>
        {[
          `a = ${fmtNum(a)}, b = ${fmtNum(b)}, c = ${fmtNum(c)}`,
          `D = (${fmtNum(b)})² − 4(${fmtNum(a)})(${fmtNum(c)}) = ${fmtNum(D)}`,
          D >= 0 ? `√D = ${perfect ? sq : `√${D} ≈ ${round2(sq)}`}` : 'Square root of a negative: not real',
          rootText,
        ].map((t, i) => (
          <text key={`${i}-${t}`} x="20" y={124 + i * 40} fill={i === 3 ? (D < 0 ? RED : GREEN) : i === 0 ? AMBER : INK} fontSize={t.length > 30 ? 13 : 16} fontWeight="900" fontFamily="monospace"
            style={{ opacity: i <= step ? 1 : 0, transition: `opacity 500ms ease ${i === step ? 150 : 0}ms` }}>{t}</text>
        ))}
        <Plot id="qe-formula" f={(x) => ta * x * x + tb * x + tc} x0={-8} x1={8} y0={-14} y1={14} box={{ x: 330, y: 14, w: 255, h: 330 }}
          roots={step >= 3 ? roots : []} color={PURPLE} grid={2} />
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: The discriminant and the nature of the roots ───
export function Class10QuadDiscriminantWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 1, b: 4, c: 3, task: null, card: null }, visual);
  const a = clamp(Math.round(num(s.a, 1)), -3, 3) || 1;
  const b = clamp(Math.round(num(s.b, 0)), -10, 10);
  const c = clamp(Math.round(num(s.c, 0)), -10, 10);
  const D = b * b - 4 * a * c;
  const tb = useTween(b, 700);
  const tc = useTween(c, 700);
  const ta = useTween(a, 700);
  const roots = D > 0 ? [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)] : D === 0 ? [-b / (2 * a)] : [];
  const kind = D > 0 ? 'two' : D === 0 ? 'equal' : 'none';
  const task = ['two', 'equal', 'none'].includes(s.task) ? s.task : null;
  const done = !!task && kind === task;
  useDone(done, onInteract);
  const verdict = {
    two: ['D > 0', 'Two distinct real roots', 'the parabola cuts the x-axis twice', GREEN],
    equal: ['D = 0', 'Two equal real roots', 'the parabola just touches the x-axis', AMBER],
    none: ['D < 0', 'No real roots', 'the parabola never meets the x-axis', RED],
  }[kind];
  const CARDS = {
    park: ['Park: P = 80 m, A = 400 m²', 'x(40 − x) = 400', 'x² − 40x + 400 = 0', 'D = 1600 − 1600 = 0', 'Square park: 20 m × 20 m'],
    k: ['Find k: kx(x − 2) + 6 = 0', 'kx² − 2kx + 6 = 0', 'D = 4k² − 24k = 4k(k − 6)', 'D = 0 ⇒ k = 0 or k = 6', 'k = 0 not quadratic ⇒ k = 6'],
  };
  const card = CARDS[s.card] || null;

  return (
    <StoryStage
      eyebrow="Visualizer · Discriminant"
      title={`${fmtQuad(a, b, c)} = 0  ·  D = ${fmtNum(D)}`}
      footer={
        <div className="space-y-3">
          <style>{FADE}</style>
          <div className="grid grid-cols-3 gap-3">
            <Slider label="a" value={a} min={-3} max={3} onChange={(v) => update({ a: v === 0 ? (a > 0 ? -1 : 1) : v })} />
            <Slider label="b" value={b} min={-10} max={10} onChange={(v) => update({ b: v })} tone="text-sky-300" />
            <Slider label="c" value={c} min={-10} max={10} onChange={(v) => update({ c: v })} tone="text-pink-300" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Readout label="b²" value={b * b} tone="text-sky-300" />
            <Readout label="4ac" value={fmtNum(4 * a * c)} tone="text-pink-300" />
            <Readout label="D = b² − 4ac" value={fmtNum(D)} tone={kind === 'two' ? 'text-emerald-400' : kind === 'equal' ? 'text-amber-300' : 'text-rose-400'} />
          </div>
          {task && <TaskBanner text={task === 'equal' ? 'Your turn: change b or c so the equation has two EQUAL roots (D = 0).' : task === 'none' ? 'Your turn: lift the parabola so it has NO real roots (D < 0).' : 'Your turn: make the equation have two distinct real roots.'} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <Plot id="qe-disc" f={(x) => ta * x * x + tb * x + tc} x0={-10} x1={10} y0={-12} y1={12} box={{ x: 300, y: 14, w: 285, h: 330 }} roots={roots} color={verdict[3]} grid={2} />
        {card ? (
          <g key={s.card}>
            {card.map((t, i) => (
              <text key={t} x="20" y={46 + i * 52} fill={i === 0 ? AMBER : i === 4 ? GREEN : INK} fontSize={i === 0 ? 14 : 16} fontWeight="900" fontFamily="monospace" style={fade(i, 350)}>{t}</text>
            ))}
          </g>
        ) : (
          <g>
            <text x="20" y="60" fill={verdict[3]} fontSize="40" fontWeight="900" fontFamily="monospace" style={{ transition: 'fill 400ms' }}>{verdict[0]}</text>
            <text x="20" y="110" fill={verdict[3]} fontSize="22" fontWeight="900" fontFamily="sans-serif">{verdict[1]}</text>
            <text x="20" y="140" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily="sans-serif">{verdict[2]}</text>
            <text x="20" y="200" fill={INK} fontSize="16" fontWeight="900" fontFamily="monospace">{`D = (${fmtNum(b)})² − 4(${fmtNum(a)})(${fmtNum(c)})`}</text>
            <text x="20" y="232" fill={INK} fontSize="16" fontWeight="900" fontFamily="monospace">{`  = ${b * b} ${sgn(-4 * a * c)} ${Math.abs(4 * a * c)} = ${fmtNum(D)}`}</text>
            <text x="20" y="290" fill={GREEN} fontSize="15" fontWeight="900" fontFamily="monospace">
              {roots.length ? `x = ${roots.map(round2).join(', ')}` : 'x: none on the number line'}
            </text>
          </g>
        )}
      </svg>
    </StoryStage>
  );
}
