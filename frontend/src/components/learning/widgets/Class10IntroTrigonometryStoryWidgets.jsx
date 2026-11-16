import React, { useRef, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, useSvgDrag, TaskBanner, RightAngleMark, Dot,
  polar, arcPath, INK, AMBER, SKY, GREEN, PINK, PURPLE,
} from '../engine/storyKit';

// Class 10 · Introduction to Trigonometry: scene-driven story widgets.
// Triangle ABC is right-angled at B; A is the acute angle we study (NCERT convention).

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, dflt) => (Number.isFinite(Number(v)) ? Number(v) : dflt);
const rad = (d) => (d * Math.PI) / 180;
const f2 = (v) => (Math.abs(v) > 99 ? '∞' : v.toFixed(2));
const FADE = '@keyframes itFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

function Slider({ label, value, min, max, step = 1, onChange, tone = 'text-amber-300', suffix = '' }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className={`${tone} font-mono font-bold`}>{value}{suffix}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function T({ x, y, children, color = INK, size = 16, anchor = 'middle', weight = 800, mono = false, style }) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={weight} fontFamily={mono ? 'monospace' : 'sans-serif'} style={style}>{children}</text>;
}

function Choice({ options, picked, correct, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const tone = picked === i ? (i === correct ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-red-500/20 border-red-400 text-red-300') : 'border-slate-700 text-slate-300 hover:border-slate-500';
        return <button key={o} onClick={() => onPick(i)} className={`px-3 py-1.5 rounded-full text-sm font-bold border font-mono transition-all ${tone}`}>{o}</button>;
      })}
    </div>
  );
}

const RATIOS = {
  sin: { name: 'sin A', top: 'opp', bot: 'hyp', words: 'opposite / hypotenuse' },
  cos: { name: 'cos A', top: 'adj', bot: 'hyp', words: 'adjacent / hypotenuse' },
  tan: { name: 'tan A', top: 'opp', bot: 'adj', words: 'opposite / adjacent' },
  cosec: { name: 'cosec A', top: 'hyp', bot: 'opp', words: 'hypotenuse / opposite' },
  sec: { name: 'sec A', top: 'hyp', bot: 'adj', words: 'hypotenuse / adjacent' },
  cot: { name: 'cot A', top: 'adj', bot: 'opp', words: 'adjacent / opposite' },
};
const SIDE_COLOR = { opp: PINK, adj: SKY, hyp: AMBER };

// ─── WIDGET 1: The three sides and the six ratios (Papa's railway ramp) ───
export function Class10IntroTrigRatioWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ angle: 35, show: 'sides', ratio: null, view: 'A', task: null }, visual);
  const angle = clamp(Math.round(num(s.angle, 35)), 10, 80);
  const a = useTween(angle, 800);
  const view = s.view === 'C' ? 'C' : 'A';
  const ratio = RATIOS[s.ratio] ? s.ratio : null;
  const svgRef = useRef(null);
  const Ax = 70;
  const Ay = 300;
  const L = 300;
  const [Cx, Cy] = polar(Ax, Ay, L, a);
  const Bx = Cx;
  const By = Ay;
  const drag = useSvgDrag(svgRef, (x, y) => {
    const d = (Math.atan2(Ay - y, x - Ax) * 180) / Math.PI;
    update({ angle: clamp(Math.round(d), 10, 80) });
  });
  const hyp = 10;
  const opp = hyp * Math.sin(rad(angle));
  const adj = hyp * Math.cos(rad(angle));
  const len = view === 'A' ? { opp, adj, hyp } : { opp: adj, adj: opp, hyp };
  const task = s.task && s.task.ratio ? s.task : null;
  const tv = task ? len[RATIOS[task.ratio].top] / len[RATIOS[task.ratio].bot] : 0;
  const done = !!task && Math.abs(tv - task.value) < 0.02;
  useDone(done, onInteract);
  // which segment is opposite/adjacent from the chosen angle's point of view
  const segs = view === 'A'
    ? { opp: [Bx, By, Cx, Cy], adj: [Ax, Ay, Bx, By], hyp: [Ax, Ay, Cx, Cy] }
    : { opp: [Ax, Ay, Bx, By], adj: [Bx, By, Cx, Cy], hyp: [Ax, Ay, Cx, Cy] };
  const showSides = s.show !== 'none';
  const lab = { opp: 'Opposite', adj: 'Adjacent', hyp: 'Hypotenuse' };
  const mid = (p) => [(p[0] + p[2]) / 2, (p[1] + p[3]) / 2];
  const offs = view === 'A' ? { opp: [48, 0], adj: [0, 30], hyp: [-40, -18] } : { opp: [0, 30], adj: [48, 0], hyp: [-40, -18] };

  return (
    <StoryStage
      eyebrow="Visualizer · Sides of a right triangle"
      title={ratio ? `${RATIOS[ratio].name.replace('A', view)} = ${RATIOS[ratio].words}` : `Right triangle ABC, looking from angle ${view}`}
      footer={
        <div className="space-y-3">
          <ModePills value={ratio || 'none'} onChange={(r) => update({ ratio: r === 'none' ? null : r })} options={[{ value: 'none', label: 'Sides' }, ...Object.keys(RATIOS).map((k) => ({ value: k, label: k }))]} />
          <div className="grid sm:grid-cols-2 gap-3 items-center">
            <Slider label="Angle A" value={angle} min={10} max={80} onChange={(v) => update({ angle: v })} suffix="°" />
            <ModePills value={view} onChange={(v) => update({ view: v })} options={[{ value: 'A', label: 'Look from A' }, { value: 'C', label: 'Look from C' }]} />
          </div>
          {task && <TaskBanner text={`Your turn: drag C (or use the slider) until ${task.ratio} A = ${task.label}. Now ${task.ratio} A = ${tv.toFixed(2)}.`} done={done} />}
        </div>
      }
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none touch-none">
        <rect width={W} height={H} fill="#020617" />
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {['adj', 'opp', 'hyp'].map((k) => {
          const p = segs[k];
          const on = showSides && (!ratio || RATIOS[ratio].top === k || RATIOS[ratio].bot === k);
          const [mx, my] = mid(p);
          return (
            <g key={k}>
              <line x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke={on ? SIDE_COLOR[k] : '#475569'} strokeWidth={on ? 6 : 3} strokeLinecap="round" style={{ transition: 'stroke 400ms, stroke-width 400ms' }} />
              {showSides && <T x={mx + offs[k][0]} y={my + offs[k][1]} color={on ? SIDE_COLOR[k] : '#64748b'} size={14}>{lab[k]}</T>}
            </g>
          );
        })}
        <RightAngleMark cx={Bx} cy={By} deg={90} size={16} color={SKY} />
        {view === 'A'
          ? <path d={arcPath(Ax, Ay, 44, 0, a)} fill="none" stroke={GREEN} strokeWidth="3" />
          : <path d={arcPath(Cx, Cy, 40, 270, 180 + a)} fill="none" stroke={GREEN} strokeWidth="3" />}
        <Dot x={Ax} y={Ay} label="A" color={INK} dx={-22} dy={8} r={5} />
        <Dot x={Bx} y={By} label="B" color={INK} dx={8} dy={22} r={5} />
        <g {...drag} style={{ cursor: 'grab' }}>
          <circle cx={Cx} cy={Cy} r="18" fill={AMBER} opacity="0.15" />
          <Dot x={Cx} y={Cy} label="C" color={AMBER} dx={10} dy={-8} r={7} pulse={!!task && !done} />
        </g>
        <T x={view === 'A' ? Ax + 62 : Cx - 22} y={view === 'A' ? Ay - 10 : Cy + 58} color={GREEN} size={15}>{view === 'A' ? `${angle}°` : `${90 - angle}°`}</T>
        {/* ratio panel */}
        <g style={{ animation: 'itFadeIn 500ms ease both' }} key={`${ratio}-${view}`}>
          <rect x="400" y="20" width="185" height={ratio ? 120 : 96} rx="12" fill="#0f172a" stroke="#334155" />
          {ratio ? (
            <>
              <T x={492} y={48} color={GREEN} size={18} mono>{RATIOS[ratio].name.replace('A', view)}</T>
              <T x={492} y={74} color={SIDE_COLOR[RATIOS[ratio].top]} size={15} mono>{lab[RATIOS[ratio].top]} {len[RATIOS[ratio].top].toFixed(2)}</T>
              <line x1="420" y1="82" x2="565" y2="82" stroke={INK} strokeWidth="2" />
              <T x={492} y={100} color={SIDE_COLOR[RATIOS[ratio].bot]} size={15} mono>{lab[RATIOS[ratio].bot]} {len[RATIOS[ratio].bot].toFixed(2)}</T>
              <T x={492} y={128} color={AMBER} size={18} mono>= {(len[RATIOS[ratio].top] / len[RATIOS[ratio].bot]).toFixed(2)}</T>
            </>
          ) : (
            <>
              <T x={492} y={46} color={PINK} size={14} mono>opposite {len.opp.toFixed(2)}</T>
              <T x={492} y={70} color={SKY} size={14} mono>adjacent {len.adj.toFixed(2)}</T>
              <T x={492} y={94} color={AMBER} size={14} mono>hypotenuse {hyp.toFixed(2)}</T>
            </>
          )}
        </g>
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Same angle, any size: similar triangles give the same ratios ───
const SIM_COLORS = [AMBER, PINK, SKY, GREEN];

export function Class10IntroTrigSimilarWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ angle: 30, count: 1, k: 1, mode: 'nest', task: null }, visual);
  const angle = clamp(Math.round(num(s.angle, 30)), 15, 60);
  const a = useTween(angle, 800);
  const count = clamp(Math.round(num(s.count, 1)), 1, 4);
  const k = clamp(num(s.k, 1), 1, 4);
  const kt = useTween(k, 700);
  const mode = s.mode === 'ladder' ? 'ladder' : 'nest';
  const Ax = 40;
  const Ay = 320;
  const task = s.task && s.task.k ? s.task : null;
  const done = !!task && Math.abs(k - task.k) < 0.01;
  useDone(done, onInteract);
  const sizes = mode === 'nest' ? Array.from({ length: count }, (_, i) => (i + 1)) : [kt];
  const tanA = Math.tan(rad(a));
  const maxM = mode === 'nest' ? count : 4;
  const unit = Math.min(290 / maxM, 280 / (maxM * tanA));

  return (
    <StoryStage
      eyebrow="Visualizer · Why the ratio depends only on the angle"
      title={mode === 'nest' ? `${count} triangle${count > 1 ? 's' : ''}, one angle of ${angle}°` : `Ramp scaled ${k} times, angle still ${angle}°`}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'nest', label: 'Nested triangles' }, { value: 'ladder', label: 'Stretch one triangle' }]} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Slider label="Angle A" value={angle} min={15} max={60} onChange={(v) => update({ angle: v })} suffix="°" />
            {mode === 'nest'
              ? <Slider label="Number of triangles" value={count} min={1} max={4} onChange={(v) => update({ count: v })} tone="text-sky-300" />
              : <Slider label="Scale factor" value={k} min={1} max={4} step={0.5} onChange={(v) => update({ k: v })} tone="text-sky-300" />}
          </div>
          {task && <TaskBanner text={`Your turn: switch to "Stretch one triangle" and make it ${task.k} times bigger. Watch sin A.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {sizes.map((m, i) => {
          const bx = Ax + unit * m;
          const cy = Ay - unit * m * tanA;
          const col = SIM_COLORS[i % 4];
          return (
            <g key={i} style={{ animation: 'itFadeIn 500ms ease both', animationDelay: `${i * 150}ms` }}>
              <polygon points={`${Ax},${Ay} ${bx},${Ay} ${bx},${cy}`} fill={col} fillOpacity="0.08" stroke={col} strokeWidth="3" />
              <RightAngleMark cx={bx} cy={Ay} deg={90} size={12} color={col} />
              <circle cx={bx} cy={cy} r="5" fill={col} />
            </g>
          );
        })}
        <path d={arcPath(Ax, Ay, 34, 0, a)} fill="none" stroke={GREEN} strokeWidth="3" />
        <T x={Ax + 52} y={Ay - 6} color={GREEN} size={14}>{angle}°</T>
        <Dot x={Ax} y={Ay} label="A" color={INK} dx={-4} dy={26} r={5} />
        <rect x="350" y="16" width="236" height={30 + 26 * sizes.length} rx="12" fill="#0f172a" stroke="#334155" />
        <T x={468} y={38} color="#94a3b8" size={13}>opp / hyp for each triangle</T>
        {sizes.map((m, i) => {
          const hyp = (m * (mode === 'nest' ? 4 : 2)) / Math.cos(rad(angle));
          const opp = hyp * Math.sin(rad(angle));
          return <T key={i} x={468} y={64 + 26 * i} color={SIM_COLORS[i % 4]} size={14} mono>{opp.toFixed(2)} / {hyp.toFixed(2)} = {Math.sin(rad(angle)).toFixed(3)}</T>;
        })}
        <T x={468} y={Math.min(330, 82 + 26 * sizes.length)} color={GREEN} size={15}>Same angle, same ratio!</T>
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Knowing one ratio gives all six (Pythagoras finds the third side) ───
export function Class10IntroTrigFromOneWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ given: 'tan', p: 4, q: 3, step: 0, task: null, picked: null }, visual);
  const given = RATIOS[s.given] && ['sin', 'cos', 'tan'].includes(s.given) ? s.given : 'tan';
  const p = Math.max(1, Math.round(num(s.p, 4)));
  const q = Math.max(1, Math.round(num(s.q, 3)));
  const r = RATIOS[given];
  // sides in units of k
  const sides = { opp: null, adj: null, hyp: null };
  sides[r.top] = p;
  sides[r.bot] = q;
  const missing = ['opp', 'adj', 'hyp'].find((x) => sides[x] === null);
  sides[missing] = missing === 'hyp' ? Math.sqrt(p * p + q * q) : Math.sqrt(Math.abs(q * q - p * p));
  const task = s.task && s.task.options ? s.task : null;
  const picked = Number.isInteger(s.picked) ? s.picked : null;
  const done = !!task && picked === task.answer;
  useDone(done, onInteract);
  const step = done ? 3 : clamp(Math.round(num(s.step, 0)), 0, 3);
  const lab = { opp: 'BC', adj: 'AB', hyp: 'AC' };
  const show = (n) => Number.isInteger(n) ? `${n}` : `√${Math.round(n * n)}`;
  // scale the drawing
  const sc = 230 / Math.max(sides.adj, sides.opp * 1.05);
  const Ax = 40;
  const Ay = 310;
  const bx = Ax + sides.adj * sc;
  const cy = Ay - sides.opp * sc;
  const t = useTween(step, 600);
  const all = Object.keys(RATIOS).map((key) => {
    const R = RATIOS[key];
    return `${R.name} = ${show(sides[R.top])}/${show(sides[R.bot])}`;
  });

  return (
    <StoryStage
      eyebrow="Visualizer · One ratio gives all six"
      title={`Given ${r.name} = ${p}/${q}`}
      footer={
        <div className="space-y-3">
          <ModePills value={String(step)} onChange={(v) => update({ step: +v })} options={[{ value: '0', label: 'Given' }, { value: '1', label: 'Draw with k' }, { value: '2', label: 'Pythagoras' }, { value: '3', label: 'All six ratios' }]} />
          {task && (
            <>
              <TaskBanner text={`Your turn: ${r.name} = ${p}/${q}. How long is ${lab[missing]} (in units of k)?`} done={done} />
              <Choice options={task.options} picked={picked} correct={task.answer} onPick={(i) => update({ picked: i })} />
            </>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <g style={{ opacity: clamp(0.45 + t, 0, 1), transition: 'opacity 300ms' }}>
          <polygon points={`${Ax},${Ay} ${bx},${Ay} ${bx},${cy}`} fill="#0f172a" />
          <line x1={Ax} y1={Ay} x2={bx} y2={Ay} stroke={SKY} strokeWidth={missing === 'adj' && step < 2 ? 2 : 5} strokeDasharray={missing === 'adj' && step < 2 ? '6 5' : ''} />
          <line x1={bx} y1={Ay} x2={bx} y2={cy} stroke={PINK} strokeWidth={missing === 'opp' && step < 2 ? 2 : 5} strokeDasharray={missing === 'opp' && step < 2 ? '6 5' : ''} />
          <line x1={Ax} y1={Ay} x2={bx} y2={cy} stroke={AMBER} strokeWidth={missing === 'hyp' && step < 2 ? 2 : 5} strokeDasharray={missing === 'hyp' && step < 2 ? '6 5' : ''} />
          <RightAngleMark cx={bx} cy={Ay} deg={90} size={14} />
          <T x={(Ax + bx) / 2} y={Ay + 28} color={SKY} size={16} mono>{missing === 'adj' && step < 2 ? '?' : `${show(sides.adj)}k`}</T>
          <T x={bx + 12} y={(Ay + cy) / 2} color={PINK} size={16} anchor="start" mono>{missing === 'opp' && step < 2 ? '?' : `${show(sides.opp)}k`}</T>
          <T x={(Ax + bx) / 2 - 22} y={(Ay + cy) / 2 - 10} color={AMBER} size={16} anchor="end" mono>{missing === 'hyp' && step < 2 ? '?' : `${show(sides.hyp)}k`}</T>
          <T x={Ax - 8} y={Ay + 24} size={16}>A</T>
          <T x={bx + 6} y={Ay + 24} size={16}>B</T>
          <T x={bx + 8} y={cy - 8} size={16}>C</T>
        </g>
        <rect x="330" y="16" width="256" height="326" rx="12" fill="#0f172a" stroke="#334155" />
        <T x={458} y={44} color={GREEN} size={18} mono>{r.name} = {p}/{q}</T>
        <T x={458} y={68} color="#94a3b8" size={13}>{r.words}</T>
        {step >= 1 && <T x={458} y={98} color={INK} size={14} mono style={{ animation: 'itFadeIn 500ms ease both' }}>{lab[r.top]} = {p}k, {lab[r.bot]} = {q}k</T>}
        {step >= 2 && (
          <g style={{ animation: 'itFadeIn 500ms ease both' }}>
            <T x={458} y={128} color={INK} size={14} mono>AC² = AB² + BC²</T>
            <T x={458} y={152} color={AMBER} size={14} mono>
              {missing === 'hyp' ? `AC² = ${q * q}k² + ${p * p}k²` : `${lab[missing]}² = ${q * q}k² − ${p * p}k²`}
            </T>
            <T x={458} y={176} color={GREEN} size={15} mono>{lab[missing]} = {show(sides[missing])}k</T>
          </g>
        )}
        {step >= 3 && all.map((line, i) => (
          <T key={line} x={458} y={208 + i * 22} color={i < 3 ? AMBER : PURPLE} size={14} mono style={{ animation: 'itFadeIn 400ms ease both', animationDelay: `${i * 120}ms` }}>{line}</T>
        ))}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: 45° from a square, 30° and 60° from an equilateral triangle ───
export function Class10IntroTrigSpecialWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'iso', step: 2, focus: 30, task: null, picked: null }, visual);
  const mode = s.mode === 'equi' ? 'equi' : 'iso';
  const step = clamp(Math.round(num(s.step, 2)), 0, 2);
  const focus = s.focus === 60 ? 60 : 30;
  const p = useTween(step, 900);
  const task = s.task && s.task.options ? s.task : null;
  const picked = Number.isInteger(s.picked) ? s.picked : null;
  const done = !!task && picked === task.answer;
  useDone(done, onInteract);

  let picture;
  let lines;
  if (mode === 'iso') {
    const x0 = 70; const y0 = 320; const a = 230;
    lines = ['AB = BC = a', 'AC² = a² + a² = 2a²', 'AC = √2 a', 'sin 45° = 1/√2', 'cos 45° = 1/√2', 'tan 45° = 1'];
    picture = (
      <>
        <rect x={x0} y={y0 - a} width={a} height={a} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6 5" opacity={1 - clamp(p - 1, 0, 1) * 0.6} />
        <polygon points={`${x0},${y0} ${x0 + a},${y0} ${x0 + a},${y0 - a}`} fill={SKY} fillOpacity="0.12" stroke={INK} strokeWidth="3" />
        <line x1={x0} y1={y0} x2={x0 + a} y2={y0 - a} stroke={AMBER} strokeWidth="5" strokeDasharray="400" strokeDashoffset={400 * (1 - clamp(p, 0, 1))} />
        <RightAngleMark cx={x0 + a} cy={y0} deg={90} size={16} />
        <path d={arcPath(x0, y0, 40, 0, 45)} fill="none" stroke={GREEN} strokeWidth="3" />
        <path d={arcPath(x0 + a, y0 - a, 40, 225, 270)} fill="none" stroke={GREEN} strokeWidth="3" />
        <T x={x0 + 60} y={y0 - 14} color={GREEN} size={14}>45°</T>
        <T x={x0 + a - 20} y={y0 - a + 62} color={GREEN} size={14}>45°</T>
        <T x={x0 + a / 2} y={y0 + 26} color={SKY} size={16} mono>a</T>
        <T x={x0 + a + 16} y={y0 - a / 2} color={SKY} size={16} mono>a</T>
        <g style={{ opacity: clamp(p - 1, 0, 1) }}><T x={x0 + a / 2 - 26} y={y0 - a / 2 - 8} color={AMBER} size={16} mono>√2 a</T></g>
        <T x={x0 - 12} y={y0 + 6} anchor="end">A</T>
        <T x={x0 + a + 14} y={y0 + 18}>B</T>
        <T x={x0 + a + 14} y={y0 - a - 4}>C</T>
      </>
    );
  } else {
    const cx = 175; const y0 = 320; const side = 260; const h = side * Math.sqrt(3) / 2;
    const top = y0 - h;
    const ang = focus;
    lines = ang === 30
      ? ['AB = BC = CA = 2a, BD = a', 'AD² = (2a)² − a² = 3a²', 'AD = √3 a', 'sin 30° = BD/AB = 1/2', 'cos 30° = AD/AB = √3/2', 'tan 30° = 1/√3']
      : ['AB = BC = CA = 2a, BD = a', 'AD² = (2a)² − a² = 3a²', 'AD = √3 a', 'sin 60° = AD/AB = √3/2', 'cos 60° = BD/AB = 1/2', 'tan 60° = √3'];
    picture = (
      <>
        <polygon points={`${cx - side / 2},${y0} ${cx + side / 2},${y0} ${cx},${top}`} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 5" />
        <polygon points={`${cx - side / 2},${y0} ${cx},${y0} ${cx},${top}`} fill={PINK} fillOpacity={0.15 * clamp(p - 1, 0, 1)} stroke={INK} strokeWidth="3" />
        <line x1={cx} y1={top} x2={cx} y2={top + h * clamp(p, 0, 1)} stroke={AMBER} strokeWidth="5" />
        {p > 0.9 && <RightAngleMark cx={cx} cy={y0} deg={90} size={14} />}
        <path d={arcPath(cx, top, 46, 240, 270)} fill="none" stroke={ang === 30 ? GREEN : '#475569'} strokeWidth="3" />
        <path d={arcPath(cx - side / 2, y0, 40, 0, 60)} fill="none" stroke={ang === 60 ? GREEN : '#475569'} strokeWidth="3" />
        <T x={cx - 12} y={top + 70} color={ang === 30 ? GREEN : '#94a3b8'} size={14} anchor="end">30°</T>
        <T x={cx - side / 2 + 52} y={y0 - 12} color={ang === 60 ? GREEN : '#94a3b8'} size={14}>60°</T>
        <T x={cx - side / 4} y={y0 + 26} color={SKY} size={16} mono>a</T>
        <T x={cx + side / 4} y={y0 + 26} color="#64748b" size={16} mono>a</T>
        <T x={cx - side / 4 - 26} y={(y0 + top) / 2} color={INK} size={16} mono anchor="end">2a</T>
        <g style={{ opacity: clamp(p - 1, 0, 1) }}><T x={cx + 10} y={(y0 + top) / 2 + 30} color={AMBER} size={16} mono anchor="start">√3 a</T></g>
        <T x={cx} y={top - 10}>A</T>
        <T x={cx - side / 2 - 14} y={y0 + 6}>B</T>
        <T x={cx + side / 2 + 14} y={y0 + 6}>C</T>
        <T x={cx} y={y0 + 26} color={AMBER} size={15}>D</T>
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Special angles"
      title={mode === 'iso' ? 'Cut a square along its diagonal: 45°' : `Halve an equilateral triangle: ${focus}°`}
      footer={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'iso', label: '45° (square)' }, { value: 'equi', label: '30° and 60° (equilateral)' }]} />
            {mode === 'equi' && <ModePills value={String(focus)} onChange={(v) => update({ focus: +v })} options={[{ value: '30', label: 'Angle 30°' }, { value: '60', label: 'Angle 60°' }]} />}
            <ModePills value={String(step)} onChange={(v) => update({ step: +v })} options={[{ value: '0', label: 'Shape' }, { value: '1', label: 'Cut' }, { value: '2', label: 'Ratios' }]} />
          </div>
          {task && (
            <>
              <TaskBanner text={`Your turn: ${task.q}`} done={done} />
              <Choice options={task.options} picked={picked} correct={task.answer} onPick={(i) => update({ picked: i })} />
            </>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {picture}
        <rect x="370" y="20" width="216" height="200" rx="12" fill="#0f172a" stroke="#334155" />
        {lines.map((l, i) => (
          <g key={`${mode}-${focus}-${l}`} style={{ opacity: step >= (i < 3 ? 1 : 2) ? 1 : 0, transition: `opacity 500ms ease ${i * 120}ms` }}>
            <T x={478} y={50 + i * 30} color={i < 3 ? INK : AMBER} size={i < 3 ? 13 : 16} mono>{l}</T>
          </g>
        ))}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Sweep the angle from 0° to 90°: the table of values ───
const SPECIAL = [0, 30, 45, 60, 90];
const TABLE = {
  sin: ['0', '1/2', '1/√2', '√3/2', '1'],
  cos: ['1', '√3/2', '1/√2', '1/2', '0'],
  tan: ['0', '1/√3', '1', '√3', 'n.d.'],
  cosec: ['n.d.', '2', '√2', '2/√3', '1'],
  sec: ['1', '2/√3', '√2', '2', 'n.d.'],
  cot: ['n.d.', '√3', '1', '1/√3', '0'],
};

export function Class10IntroTrigSweepWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ angle: 30, table: true, rows: 3, task: null }, visual);
  const angle = clamp(Math.round(num(s.angle, 30)), 0, 90);
  const a = useTween(angle, 900);
  const rows = clamp(Math.round(num(s.rows, 3)), 0, 6);
  const task = s.task && s.task.angle !== undefined ? s.task : null;
  const done = !!task && angle === task.angle;
  useDone(done, onInteract);
  const Ox = 50; const Oy = 300; const R = 230;
  const [Px, Py] = polar(Ox, Oy, R, a);
  const sinv = Math.sin(rad(angle));
  const cosv = Math.cos(rad(angle));
  const col = SPECIAL.indexOf(angle);

  return (
    <StoryStage
      eyebrow="Visualizer · Hypotenuse 1, angle from 0° to 90°"
      title={`A = ${angle}°: sin A = ${sinv.toFixed(3)}, cos A = ${cosv.toFixed(3)}`}
      footer={
        <div className="space-y-3">
          <Slider label="Angle A" value={angle} min={0} max={90} onChange={(v) => update({ angle: v })} suffix="°" />
          <div className="flex flex-wrap gap-2 items-center">
            {SPECIAL.map((d) => <button key={d} onClick={() => update({ angle: d })} className="px-3 py-1 rounded-full text-xs font-bold border border-slate-700 text-slate-300 hover:border-amber-400">{d}°</button>)}
            <Readout label="sin A" value={sinv.toFixed(3)} tone="text-pink-300" />
            <Readout label="cos A" value={cosv.toFixed(3)} tone="text-sky-300" />
            <Readout label="tan A" value={angle === 90 ? 'not defined' : f2(Math.tan(rad(angle)))} tone="text-amber-300" />
          </div>
          {task && <TaskBanner text={`Your turn: ${task.text}`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <path d={arcPath(Ox, Oy, R, 0, 90)} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5 5" />
        <line x1={Ox} y1={Oy} x2={Ox + R + 10} y2={Oy} stroke="#334155" strokeWidth="2" />
        <line x1={Ox} y1={Oy} x2={Ox} y2={Oy - R - 10} stroke="#334155" strokeWidth="2" />
        <polygon points={`${Ox},${Oy} ${Px},${Oy} ${Px},${Py}`} fill={AMBER} fillOpacity="0.08" />
        <line x1={Ox} y1={Oy} x2={Px} y2={Oy} stroke={SKY} strokeWidth="6" strokeLinecap="round" />
        <line x1={Px} y1={Oy} x2={Px} y2={Py} stroke={PINK} strokeWidth="6" strokeLinecap="round" />
        <line x1={Ox} y1={Oy} x2={Px} y2={Py} stroke={AMBER} strokeWidth="4" />
        <circle cx={Px} cy={Py} r="7" fill={AMBER} />
        <path d={arcPath(Ox, Oy, 36, 0, a)} fill="none" stroke={GREEN} strokeWidth="3" />
        <T x={Ox + 10} y={Oy + 26} color={SKY} size={13} anchor="start">cos A (adjacent)</T>
        {angle > 3 && <T x={Px + 8} y={(Oy + Py) / 2 + 5} color={PINK} size={13} anchor="start">sin A</T>}
        <T x={Ox - 10} y={Oy + 20}>A</T>
        <T x={Ox + R / 2} y={Oy - R / 2 - 20} color={AMBER} size={13}>hypotenuse 1</T>
        {s.table && rows > 0 && (
          <g style={{ animation: 'itFadeIn 500ms ease both' }}>
            <rect x="330" y="88" width="262" height={30 + rows * 26} rx="10" fill="#0f172a" stroke="#334155" />
            {SPECIAL.map((d, j) => (
              <g key={d}>
                {col === j && <rect x={378 + j * 42} y="92" width="40" height={24 + rows * 26} rx="6" fill={AMBER} fillOpacity="0.15" />}
                <T x={398 + j * 42} y={108} color={col === j ? AMBER : '#94a3b8'} size={12} mono>{d}°</T>
              </g>
            ))}
            {Object.keys(TABLE).slice(0, rows).map((k, i) => (
              <g key={k}>
                <T x={340} y={134 + i * 26} color={i < 3 ? [PINK, SKY, AMBER][i] : PURPLE} size={12} anchor="start" mono>{k}</T>
                {TABLE[k].map((v, j) => <T key={j} x={398 + j * 42} y={134 + i * 26} color={col === j ? AMBER : INK} size={12} mono>{v}</T>)}
              </g>
            ))}
          </g>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 6: Identities from Pythagoras, and the story of the word "sine" ───
const DIVIDE = {
  hyp: { by: 'AC²', result: 'sin²A + cos²A = 1', note: 'true for 0° ≤ A ≤ 90°' },
  adj: { by: 'AB²', result: '1 + tan²A = sec²A', note: 'true for 0° ≤ A < 90°' },
  opp: { by: 'BC²', result: 'cot²A + 1 = cosec²A', note: 'true for 0° < A ≤ 90°' },
};
const JOURNEY = [
  { word: 'jya / jiva', where: 'Sanskrit, Aryabhata', meaning: 'bowstring, half-chord', color: AMBER },
  { word: 'jiba', where: 'Arabic', meaning: 'sound kept, no meaning', color: PINK },
  { word: 'jaib', where: 'Arabic (misread)', meaning: 'fold, bay', color: SKY },
  { word: 'sinus', where: 'Latin', meaning: 'fold, bay, curve', color: PURPLE },
  { word: 'sine', where: 'English', meaning: 'the word we use', color: GREEN },
];

export function Class10IntroTrigIdentityWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'pyth', angle: 37, divide: null, journey: 5, task: null, picked: null }, visual);
  const mode = ['pyth', 'divide', 'history'].includes(s.mode) ? s.mode : 'pyth';
  const angle = clamp(Math.round(num(s.angle, 37)), 5, 85);
  const a = useTween(angle, 800);
  const divide = DIVIDE[s.divide] ? s.divide : null;
  const journey = clamp(Math.round(num(s.journey, 5)), 1, 5);
  const task = s.task && s.task.want ? s.task : null;
  const picked = DIVIDE[s.picked] ? s.picked : null;
  const done = !!task && picked === task.want;
  useDone(done, onInteract);
  const sinv = Math.sin(rad(angle));
  const cosv = Math.cos(rad(angle));
  const tanv = Math.tan(rad(angle));

  let picture;
  if (mode === 'history') {
    picture = (
      <>
        {/* bow and string */}
        <path d="M 80 60 Q 20 180 80 300" fill="none" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
        <line x1="80" y1="60" x2="80" y2="300" stroke={AMBER} strokeWidth="3" />
        <T x={60} y={330} color={AMBER} size={13}>jya = bowstring</T>
        {JOURNEY.slice(0, journey).map((j, i) => (
          <g key={j.word} style={{ animation: 'itFadeIn 600ms ease both', animationDelay: `${i * 250}ms` }}>
            <rect x="170" y={20 + i * 66} width="400" height="54" rx="12" fill="#0f172a" stroke={j.color} strokeWidth="2" />
            <T x={190} y={52 + i * 66} color={j.color} size={20} anchor="start" mono>{j.word}</T>
            <T x={555} y={44 + i * 66} color={INK} size={13} anchor="end">{j.where}</T>
            <T x={555} y={62 + i * 66} color="#94a3b8" size={12} anchor="end">{j.meaning}</T>
            {i > 0 && <T x={150} y={14 + i * 66} color="#64748b" size={14}>↓</T>}
          </g>
        ))}
      </>
    );
  } else {
    const Ax = 60; const Ay = 290; const L = 210;
    const [Cx, Cy] = polar(Ax, Ay, L, a);
    const Bx = Cx;
    const k = divide || (task ? picked : null);
    picture = (
      <>
        {/* squares on the sides */}
        <rect x={Ax} y={Ay} width={Bx - Ax} height={Math.min(60, Bx - Ax)} fill={SKY} fillOpacity={k === 'adj' ? 0.45 : 0.15} stroke={SKY} />
        <rect x={Bx} y={Cy} width={Math.min(70, Ay - Cy)} height={Ay - Cy} fill={PINK} fillOpacity={k === 'opp' ? 0.45 : 0.15} stroke={PINK} />
        <polygon points={`${Ax},${Ay} ${Bx},${Ay} ${Cx},${Cy}`} fill="#0f172a" stroke={INK} strokeWidth="3" />
        <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke={AMBER} strokeWidth={k === 'hyp' ? 7 : 4} />
        <RightAngleMark cx={Bx} cy={Ay} deg={90} size={14} />
        <path d={arcPath(Ax, Ay, 36, 0, a)} fill="none" stroke={GREEN} strokeWidth="3" />
        <T x={Ax + 50} y={Ay - 8} color={GREEN} size={13}>{angle}°</T>
        <T x={Ax - 12} y={Ay + 6}>A</T>
        <T x={Bx + 4} y={Ay - 8} anchor="start">B</T>
        <T x={Cx} y={Cy - 10}>C</T>
        <T x={(Ax + Bx) / 2} y={Ay + 40} color={SKY} size={14} mono>AB²</T>
        <T x={Bx + 36} y={(Ay + Cy) / 2} color={PINK} size={14} mono>BC²</T>
        <T x={(Ax + Cx) / 2 - 24} y={(Ay + Cy) / 2 - 6} color={AMBER} size={14} mono>AC</T>
        <rect x="330" y="20" width="256" height="200" rx="12" fill="#0f172a" stroke="#334155" />
        <T x={458} y={50} color={INK} size={18} mono>AB² + BC² = AC²</T>
        {mode === 'pyth' && !task && (
          <g style={{ animation: 'itFadeIn 500ms ease both' }}>
            <T x={458} y={90} color={PINK} size={14} mono>sin²A = {(sinv * sinv).toFixed(3)}</T>
            <T x={458} y={114} color={SKY} size={14} mono>cos²A = {(cosv * cosv).toFixed(3)}</T>
            <T x={458} y={146} color={GREEN} size={18} mono>sum = {(sinv * sinv + cosv * cosv).toFixed(3)}</T>
            <T x={458} y={180} color="#94a3b8" size={12}>Move the angle: the sum stays 1.</T>
          </g>
        )}
        {k && (
          <g key={k} style={{ animation: 'itFadeIn 500ms ease both' }}>
            <T x={458} y={84} color="#94a3b8" size={13}>divide every term by {DIVIDE[k].by}</T>
            <T x={458} y={120} color={AMBER} size={18} mono>{DIVIDE[k].result}</T>
            <T x={458} y={148} color="#94a3b8" size={12}>{DIVIDE[k].note}</T>
            <T x={458} y={182} color={GREEN} size={13} mono>
              {k === 'hyp' && `${(sinv * sinv).toFixed(3)} + ${(cosv * cosv).toFixed(3)} = 1`}
              {k === 'adj' && `1 + ${(tanv * tanv).toFixed(3)} = ${(1 / (cosv * cosv)).toFixed(3)}`}
              {k === 'opp' && `${(1 / (tanv * tanv)).toFixed(3)} + 1 = ${(1 / (sinv * sinv)).toFixed(3)}`}
            </T>
          </g>
        )}
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Trigonometric identities"
      title={mode === 'history' ? 'From jya to sine: a word that travelled' : divide ? DIVIDE[divide].result : 'Pythagoras hides inside every ratio'}
      footer={
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[{ value: 'pyth', label: 'sin² + cos²' }, { value: 'divide', label: 'Divide Pythagoras' }, { value: 'history', label: 'Story of "sine"' }]} />
          {mode !== 'history' && <Slider label="Angle A" value={angle} min={5} max={85} onChange={(v) => update({ angle: v })} suffix="°" />}
          {mode === 'divide' && !task && <ModePills value={divide || ''} onChange={(v) => update({ divide: v })} options={Object.keys(DIVIDE).map((key) => ({ value: key, label: `÷ ${DIVIDE[key].by}` }))} />}
          {mode === 'history' && <Slider label="Steps of the journey" value={journey} min={1} max={5} onChange={(v) => update({ journey: v })} tone="text-sky-300" />}
          {task && (
            <>
              <TaskBanner text={`Your turn: divide AB² + BC² = AC² by which square to get ${DIVIDE[task.want].result}?`} done={done} />
              <div className="flex flex-wrap gap-2">
                {Object.keys(DIVIDE).map((key) => (
                  <button key={key} onClick={() => update({ picked: key })} className={`px-3 py-1.5 rounded-full text-sm font-bold border font-mono ${picked === key ? (key === task.want ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-red-500/20 border-red-400 text-red-300') : 'border-slate-700 text-slate-300'}`}>÷ {DIVIDE[key].by}</button>
                ))}
              </div>
            </>
          )}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {picture}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}
