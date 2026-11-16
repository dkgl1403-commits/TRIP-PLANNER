import React, { useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner, RightAngleMark, Dot,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Triangles — scene-driven story widgets (similar figures, similar polygons, BPT and its converse,
// AA / SSS / SAS criteria, heights from shadows). Each widget animates to the current scene's `visual`.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const fmt = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toString();
const FADE = '@keyframes c10trFade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';

function useDone(done, onInteract) {
  useEffect(() => {
    if (done) onInteract?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
}

function Slider({ label, value, min, max, step = 1, onChange, shown }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}: <span className="text-amber-300 font-mono font-bold">{shown ?? value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function Label({ x, y, children, color = INK, size = 15, anchor = 'middle', weight = 800 }) {
  return <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor} fontFamily="sans-serif">{children}</text>;
}

const pts = (arr) => arr.map((p) => p.join(',')).join(' ');

// ─── WIDGET 1: similar and congruent figures (circles, squares, banner logo, stretch) ───
const LOGO = [[0, -1], [0.9, -0.2], [0.55, 1], [-0.55, 1], [-0.9, -0.2]];

export function Class10TriSimilarFiguresWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'circles', k: 1, task: null }, visual);
  const mode = ['circles', 'squares', 'photo', 'congruent', 'stretch'].includes(s.mode) ? s.mode : 'circles';
  const k = clamp(num(s.k, 1), 1, 3);
  const kt = useTween(mode === 'congruent' ? 1 : k, 900);
  const task = s.task && s.task.k ? s.task : null;
  const done = !!task && mode === 'photo' && Math.abs(k - task.k) < 0.01;
  useDone(done, onInteract);

  const base = 34;
  const cx0 = 110, cx1 = 390, cy = 190;
  const sx = kt, sy = mode === 'stretch' ? 1 : kt;
  let left; let right;
  if (mode === 'circles') {
    left = <circle cx={cx0} cy={cy} r={base} fill={`${SKY}33`} stroke={SKY} strokeWidth="3" />;
    right = <circle cx={cx1} cy={cy} r={base * kt} fill={`${AMBER}33`} stroke={AMBER} strokeWidth="3" />;
  } else if (mode === 'squares') {
    left = <rect x={cx0 - base} y={cy - base} width={base * 2} height={base * 2} fill={`${SKY}33`} stroke={SKY} strokeWidth="3" />;
    right = <rect x={cx1 - base * kt} y={cy - base * kt} width={base * 2 * kt} height={base * 2 * kt} fill={`${AMBER}33`} stroke={AMBER} strokeWidth="3" />;
  } else {
    const shape = (cx, ax, ay) => pts(LOGO.map(([x, y]) => [cx + x * base * ax, cy + y * base * ay]));
    left = <polygon points={shape(cx0, 1, 1)} fill={`${SKY}33`} stroke={SKY} strokeWidth="3" />;
    right = <polygon points={shape(cx1, sx, sy)} fill={mode === 'stretch' ? `${RED}33` : `${AMBER}33`} stroke={mode === 'stretch' ? RED : AMBER} strokeWidth="3" />;
  }
  const verdict = mode === 'stretch'
    ? { t: 'Not similar: stretched one way only', c: RED }
    : mode === 'congruent' || Math.abs(kt - 1) < 0.02
      ? { t: 'Congruent (and similar): scale factor 1', c: GREEN }
      : { t: `Similar: every length times ${fmt(k)}`, c: GREEN };

  return (
    <StoryStage eyebrow="Visualizer · Similar figures" title="Same shape, any size"
      footer={(
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[
            { value: 'circles', label: 'Circles' }, { value: 'squares', label: 'Squares' }, { value: 'photo', label: 'Banner logo' },
            { value: 'congruent', label: 'Congruent' }, { value: 'stretch', label: 'Stretch one way' }]} />
          {mode !== 'congruent' && <Slider label="Scale factor k" min={1} max={3} step={0.5} value={k} onChange={(v) => update({ k: v })} />}
          <TaskBanner text={task ? 'Make a similar banner logo with scale factor 3.' : ''} done={done} />
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <Label x={cx0} y={40} color={SKY}>Original</Label>
        <Label x={cx1} y={40} color={mode === 'stretch' ? RED : AMBER}>{mode === 'stretch' ? 'Stretched copy' : 'Copy'}</Label>
        {left}
        {right}
        <line x1={cx0 - base} y1={cy + base + 22} x2={cx0 + base} y2={cy + base + 22} stroke={SKY} strokeWidth="2" />
        <Label x={cx0} y={cy + base + 42} color={SKY} size={13}>width 1</Label>
        <rect x="150" y="318" width="300" height="32" rx="10" fill="#0f172a" stroke={verdict.c} />
        <Label x={300} y={340} color={verdict.c} size={15}>{verdict.t}</Label>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: similarity of polygons needs both conditions ───
function Quad({ p, color, angles, sides }) {
  const n = p.length;
  return (
    <g style={{ animation: 'c10trFade 600ms ease both' }}>
      <polygon points={pts(p)} fill={`${color}26`} stroke={color} strokeWidth="3" />
      {angles && p.map((q, i) => {
        const prev = p[(i + n - 1) % n]; const next = p[(i + 1) % n];
        const mx = (prev[0] + next[0]) / 2 - q[0]; const my = (prev[1] + next[1]) / 2 - q[1];
        const L = Math.hypot(mx, my) || 1;
        return <Label key={`a${i}`} x={q[0] + (mx / L) * 26} y={q[1] + (my / L) * 26 + 5} color={INK} size={12}>{angles[i]}</Label>;
      })}
      {sides && p.map((q, i) => {
        const r = p[(i + 1) % n];
        const cx = p.reduce((a, b) => a + b[0], 0) / n; const cy = p.reduce((a, b) => a + b[1], 0) / n;
        const mx = (q[0] + r[0]) / 2; const my = (q[1] + r[1]) / 2;
        const dx = mx - cx; const dy = my - cy; const L = Math.hypot(dx, dy) || 1;
        return <Label key={`s${i}`} x={mx + (dx / L) * 16} y={my + (dy / L) * 16 + 5} color={color} size={13}>{sides[i]}</Label>;
      })}
    </g>
  );
}

const POLY_CASES = {
  both: {
    a: [[40, 250], [170, 250], [190, 160], [80, 130]], b: [[300, 300], [495, 300], [525, 165], [360, 120]],
    aAng: ['70°', '102°', '90°', '98°'], bAng: ['70°', '102°', '90°', '98°'], aS: ['2', '1.4', '1.7', '2.2'], bS: ['3', '2.1', '2.55', '3.3'],
    ok: true, msg: 'Angles equal AND sides in ratio 2 : 3: similar',
  },
  rect: {
    a: [[50, 260], [170, 260], [170, 140], [50, 140]], b: [[290, 260], [530, 260], [530, 140], [290, 140]],
    aAng: ['90°', '90°', '90°', '90°'], bAng: ['90°', '90°', '90°', '90°'], aS: ['4', '4', '4', '4'], bS: ['8', '4', '8', '4'],
    ok: false, msg: 'Angles equal, sides NOT proportional: not similar',
  },
  rhombus: {
    a: [[50, 260], [170, 260], [170, 140], [50, 140]], b: [[300, 260], [420, 260], [500, 160], [380, 160]],
    aAng: ['90°', '90°', '90°', '90°'], bAng: ['51°', '129°', '51°', '129°'], aS: ['4', '4', '4', '4'], bS: ['4', '4', '4', '4'],
    ok: false, msg: 'Sides proportional, angles NOT equal: not similar',
  },
  triangle: {
    a: [[60, 270], [190, 270], [100, 160]], b: [[300, 300], [495, 300], [360, 135]],
    aAng: ['A', 'B', 'C'], bAng: ['P', 'Q', 'R'], aS: ['', '', ''], bS: ['', '', ''],
    ok: true, msg: 'AB/PQ = BC/QR = CA/RP and angle A = angle P, ...',
  },
};

export function Class10TriPolygonWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'both', show: null, task: null, picked: null }, visual);
  const mode = POLY_CASES[s.mode] ? s.mode : 'both';
  const c = POLY_CASES[mode];
  const task = s.task && s.task.pick ? s.task : null;
  const done = !!task && s.picked === task.pick;
  useDone(done, onInteract);
  const pick = (m) => update({ mode: m, picked: m });

  return (
    <StoryStage eyebrow="Visualizer · Similar polygons" title="Equal angles AND proportional sides"
      footer={(
        <div className="space-y-3">
          <ModePills value={mode} onChange={pick} options={[
            { value: 'both', label: 'Scaled quadrilaterals' }, { value: 'rect', label: 'Square vs rectangle' },
            { value: 'rhombus', label: 'Square vs rhombus' }, { value: 'triangle', label: 'Triangles ABC, PQR' }]} />
          <TaskBanner text={task ? 'Tap the pair that is truly similar.' : ''} done={done} />
          {task && s.picked && !done && <div className="text-xs text-rose-300">Not this pair: check both conditions.</div>}
          <style>{FADE}</style>
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <Quad key={`a${mode}`} p={c.a} color={SKY} angles={c.aAng} sides={c.aS} />
        <Quad key={`b${mode}`} p={c.b} color={AMBER} angles={c.bAng} sides={c.bS} />
        <rect x="70" y="20" width="460" height="34" rx="10" fill="#0f172a" stroke={c.ok ? GREEN : RED} />
        <Label x={300} y={43} color={c.ok ? GREEN : RED} size={15}>{c.msg}</Label>
        {mode === 'triangle' && <Label x={300} y={345} color={PURPLE} size={14}>Order matters: A with P, B with Q, C with R</Label>}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Basic Proportionality Theorem, its area proof and its converse ───
const TA = [210, 34]; const TB = [40, 300]; const TC = [390, 300];
const onSide = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
function foot(P, Q, X) {
  const dx = Q[0] - P[0]; const dy = Q[1] - P[1];
  const t = ((X[0] - P[0]) * dx + (X[1] - P[1]) * dy) / (dx * dx + dy * dy);
  return [P[0] + dx * t, P[1] + dy * t];
}

const PROOF_TEXT = [
  [],
  ['Join BE and CD.', 'Area = ½ × base × height'],
  ['ADE, BDE: same height EN', 'ar ADE : ar BDE', '= AD : DB'],
  ['ADE, DEC: same height DM', 'ar ADE : ar DEC', '= AE : EC'],
  ['BDE, DEC: same base DE,', 'same parallels DE, BC,', 'so equal areas.', 'AD / DB = AE / EC ✔'],
];

export function Class10TriBPTWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'basic', t: 0.5, d: 0.4, e: 0.6, step: 1, task: null }, visual);
  const mode = ['basic', 'proof', 'converse'].includes(s.mode) ? s.mode : 'basic';
  const t = clamp(num(s.t, 0.5), 0.1, 0.9);
  const dRaw = mode === 'converse' ? clamp(num(s.d, 0.4), 0.1, 0.9) : t;
  const eRaw = mode === 'converse' ? clamp(num(s.e, 0.6), 0.1, 0.9) : t;
  const dt = useTween(dRaw, 800); const et = useTween(eRaw, 800);
  const step = clamp(Math.round(num(s.step, 1)), 1, 4);
  const D = onSide(TA, TB, dt); const E = onSide(TA, TC, et);
  const rd = dRaw / (1 - dRaw); const re = eRaw / (1 - eRaw);
  const parallel = Math.abs(dRaw - eRaw) < 0.015;
  const task = s.task || null;
  const done = !!task && ((task.ratio && mode === 'basic' && Math.abs(rd - task.ratio) < 0.08) || (task.parallel && mode === 'converse' && parallel));
  useDone(done, onInteract);

  const N = foot(TA, TB, E); const M = foot(TA, TC, D);
  const sh = (p, col, on) => <polygon points={pts(p)} fill={col} opacity={on ? 0.35 : 0} style={{ transition: 'opacity 600ms ease' }} />;
  const showP = mode === 'proof';
  const lineCol = mode === 'converse' ? (parallel ? GREEN : RED) : AMBER;

  return (
    <StoryStage eyebrow="Visualizer · Thales" title={mode === 'converse' ? 'Converse: equal ratios make DE parallel to BC' : 'DE parallel to BC: AD / DB = AE / EC'}
      footer={(
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[
            { value: 'basic', label: 'Theorem' }, { value: 'proof', label: 'Area proof' }, { value: 'converse', label: 'Converse' }]} />
          {mode === 'basic' && <Slider label="Beam position AD / AB" min={0.1} max={0.9} step={0.01} value={t} shown={fmt(t, 2)} onChange={(v) => update({ t: v })} />}
          {mode === 'proof' && (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((k) => (
                <button key={k} onClick={() => update({ step: k })} className={`px-3 py-1 rounded-lg text-xs font-bold border ${step === k ? 'border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400'}`}>Step {k}</button>
              ))}
            </div>
          )}
          {mode === 'converse' && (
            <div className="grid grid-cols-2 gap-3">
              <Slider label="D on AB (AD / AB)" min={0.1} max={0.9} step={0.01} value={dRaw} shown={fmt(dRaw, 2)} onChange={(v) => update({ d: v })} />
              <Slider label="E on AC (AE / AC)" min={0.1} max={0.9} step={0.01} value={eRaw} shown={fmt(eRaw, 2)} onChange={(v) => update({ e: v })} />
            </div>
          )}
          {mode !== 'proof' && (
            <div className="flex flex-wrap gap-2">
              <Readout label="AD / DB" value={fmt(rd, 2)} tone="text-sky-300" />
              <Readout label="AE / EC" value={fmt(re, 2)} tone="text-pink-300" />
              <Readout label="DE ∥ BC?" value={mode === 'basic' || parallel ? 'Yes' : 'No'} tone={mode === 'basic' || parallel ? 'text-emerald-400' : 'text-rose-400'} />
            </div>
          )}
          <TaskBanner text={task?.ratio ? 'Slide the beam so that AD is twice DB.' : task?.parallel ? 'Move E until DE is parallel to BC.' : ''} done={done} />
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {sh([TA, D, E], SKY, showP && step >= 2 && step <= 3)}
        {sh([TB, D, E], PINK, showP && (step === 2 || step === 4))}
        {sh([D, E, TC], GREEN, showP && (step === 3 || step === 4))}
        <polygon points={pts([TA, TB, TC])} fill="none" stroke={INK} strokeWidth="3" />
        <line x1={D[0]} y1={D[1]} x2={E[0]} y2={E[1]} stroke={lineCol} strokeWidth="4" />
        {showP && step >= 1 && (
          <g strokeDasharray="6 5" strokeWidth="2">
            <line x1={TB[0]} y1={TB[1]} x2={E[0]} y2={E[1]} stroke={PINK} />
            <line x1={TC[0]} y1={TC[1]} x2={D[0]} y2={D[1]} stroke={GREEN} />
          </g>
        )}
        {showP && step === 2 && <g><line x1={E[0]} y1={E[1]} x2={N[0]} y2={N[1]} stroke={PURPLE} strokeWidth="2.5" /><Dot x={N[0]} y={N[1]} r={4} color={PURPLE} label="N" dx={-22} dy={4} /></g>}
        {showP && step === 3 && <g><line x1={D[0]} y1={D[1]} x2={M[0]} y2={M[1]} stroke={PURPLE} strokeWidth="2.5" /><Dot x={M[0]} y={M[1]} r={4} color={PURPLE} label="M" dx={10} dy={4} /></g>}
        {showP && step === 4 && <g stroke={AMBER} strokeWidth="2" strokeDasharray="2 6"><line x1="20" y1={D[1]} x2="410" y2={E[1]} /><line x1="20" y1="300" x2="410" y2="300" /></g>}
        <Dot x={TA[0]} y={TA[1]} label="A" color={INK} dx={-6} dy={-10} />
        <Dot x={TB[0]} y={TB[1]} label="B" color={INK} dx={-20} dy={6} />
        <Dot x={TC[0]} y={TC[1]} label="C" color={INK} dx={8} dy={6} />
        <Dot x={D[0]} y={D[1]} label="D" color={SKY} dx={-22} dy={4} pulse={mode === 'converse'} />
        <Dot x={E[0]} y={E[1]} label="E" color={PINK} dx={10} dy={4} pulse={mode === 'converse'} />
        <g>
          {(mode === 'proof' ? PROOF_TEXT[step] : mode === 'basic'
            ? ['BPT: if DE ∥ BC,', 'then AD / DB = AE / EC', `${fmt(rd, 2)} = ${fmt(re, 2)}`]
            : ['Converse: if', 'AD / DB = AE / EC,', 'then DE ∥ BC', parallel ? 'Ratios equal: parallel' : 'Ratios differ: tilted']
          ).map((ln, i) => (
            <Label key={`${mode}${step}${i}`} x={408} y={70 + i * 28} anchor="start" size={13} color={i === 0 ? AMBER : INK}>{ln}</Label>
          ))}
        </g>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: AA, SSS and SAS criteria ───
function triFrom(mode) {
  // returns unit-coordinate vertices [A, B, C] (y up) and labels
  if (mode === 'sss') return { v: [[0, 0], [4, 0], [4, 3]], sides: [4, 3, 5], ang: ['37°', '90°', '53°'] };
  if (mode === 'sas') {
    const a = (60 * Math.PI) / 180;
    return { v: [[0, 0], [3, 0], [4 * Math.cos(a), 4 * Math.sin(a)]], sides: [3, null, 4], ang: ['60°', '', ''] };
  }
  // AAA: angle A = 50, B = 60 on base 3
  const A = (50 * Math.PI) / 180; const B = (60 * Math.PI) / 180;
  const AC = (3 * Math.sin(B)) / Math.sin(Math.PI - A - B);
  return { v: [[0, 0], [3, 0], [AC * Math.cos(A), AC * Math.sin(A)]], sides: [null, null, null], ang: ['50°', '60°', '70°'] };
}

function CritTri({ data, ox, oy, k, u, color, names }) {
  const P = data.v.map(([x, y]) => [ox + x * k * u, oy - y * k * u]);
  const cx = (P[0][0] + P[1][0] + P[2][0]) / 3; const cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
  const sidePairs = [[0, 1], [1, 2], [2, 0]];
  return (
    <g>
      <polygon points={pts(P)} fill={`${color}26`} stroke={color} strokeWidth="3" />
      {P.map((p, i) => {
        const dx = p[0] - cx; const dy = p[1] - cy; const L = Math.hypot(dx, dy) || 1;
        return (
          <g key={`v${i}`}>
            <Label x={p[0] + (dx / L) * 16} y={p[1] + (dy / L) * 16 + 5} color={INK} size={14}>{names[i]}</Label>
            {data.ang[i] && <Label x={p[0] - (dx / L) * 24 * Math.min(1.4, k)} y={p[1] - (dy / L) * 24 * Math.min(1.4, k) + 4} color={AMBER} size={11}>{data.ang[i]}</Label>}
          </g>
        );
      })}
      {sidePairs.map(([i, j], n) => {
        if (data.sides[n] == null) return null;
        const mx = (P[i][0] + P[j][0]) / 2; const my = (P[i][1] + P[j][1]) / 2;
        const dx = mx - cx; const dy = my - cy; const L = Math.hypot(dx, dy) || 1;
        return <Label key={`s${n}`} x={mx + (dx / L) * 16} y={my + (dy / L) * 16 + 5} color={color} size={13}>{fmt(data.sides[n] * k)}</Label>;
      })}
    </g>
  );
}

const CRIT_INFO = {
  aaa: { t: 'AAA / AA: equal angles ⇒ similar', c: 'Two equal angles are enough (angle sum 180°)' },
  sss: { t: 'SSS: sides in one ratio ⇒ similar', c: 'Every side ratio is the same, so every angle is equal' },
  sas: { t: 'SAS: equal included angle + 2 proportional sides', c: 'The equal angle must be BETWEEN the two sides' },
};

export function Class10TriCriteriaWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'aaa', k: 1.5, hl: null, task: null }, visual);
  const mode = CRIT_INFO[s.mode] ? s.mode : 'aaa';
  const k = clamp(num(s.k, 1.5), 1, 2.5);
  const kt = useTween(k, 900);
  const data = triFrom(mode);
  const task = s.task && s.task.k ? s.task : null;
  const done = !!task && mode === 'sas' && Math.abs(k - task.k) < 0.05;
  useDone(done, onInteract);
  const u = 25;

  return (
    <StoryStage eyebrow="Visualizer · Similarity criteria" title={CRIT_INFO[mode].t}
      footer={(
        <div className="space-y-3">
          <ModePills value={mode} onChange={(m) => update({ mode: m })} options={[
            { value: 'aaa', label: 'AAA / AA' }, { value: 'sss', label: 'SSS' }, { value: 'sas', label: 'SAS' }]} />
          <Slider label="Scale factor k" min={1} max={2.5} step={0.1} value={k} shown={fmt(k)} onChange={(v) => update({ k: v })} />
          <div className="flex flex-wrap gap-2">
            <Readout label="Ratio DE / AB" value={fmt(k)} tone="text-amber-300" />
            <Readout label="Angles" value="unchanged" tone="text-emerald-400" />
          </div>
          <TaskBanner text={task ? 'Set the scale factor to 2 in the SAS picture.' : ''} done={done} />
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <CritTri data={data} ox={30} oy={310} k={1} u={u} color={SKY} names={['A', 'B', 'C']} />
        <CritTri data={data} ox={200} oy={310} k={kt} u={u} color={AMBER} names={['D', 'E', 'F']} />
        <Label x={10} y={30} anchor="start" color={GREEN} size={14}>{CRIT_INFO[mode].c}</Label>
        {s.hl === 'aa' && <Label x={10} y={56} anchor="start" color={PINK} size={14}>third angle = 180° − 50° − 60° = 70°</Label>}
        <Label x={10} y={82} anchor="start" color={INK} size={14}>{`triangle ABC ~ triangle DEF, k = ${fmt(kt)}`}</Label>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: heights from shadows, lamp-post shadows ───
export function Class10TriShadowWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'shadow', sun: 56.31, dist: 4.8, show: null, task: null }, visual);
  const mode = s.mode === 'lamp' ? 'lamp' : 'shadow';
  const sun = clamp(num(s.sun, 56.31), 35, 70);
  const sunT = useTween(sun, 900);
  const dist = clamp(num(s.dist, 4.8), 1, 6);
  const distT = useTween(dist, 900);
  const task = s.task && s.task.shadow ? s.task : null;
  const tanS = Math.tan((sun * Math.PI) / 180);
  const poleSh = 6 / tanS; const towerSh = 42 / tanS;
  const done = !!task && mode === 'shadow' && Math.abs(poleSh - task.shadow) < 0.15;
  useDone(done, onInteract);
  const G = 320;

  let picture;
  if (mode === 'shadow') {
    const m = 6; const tT = Math.tan((sunT * Math.PI) / 180);
    const px = 50; const tx = 170;
    const pTop = [px, G - 6 * m]; const pTip = [px + (6 / tT) * m, G];
    const tTop = [tx, G - 42 * m]; const tTip = [tx + (42 / tT) * m, G];
    const tri = s.show === 'triangles' || s.show === 'answer';
    const [sx, sy] = [30, 30];
    picture = (
      <g>
        <circle cx={sx} cy={sy} r="16" fill={AMBER} />
        <line x1="0" y1={G} x2="600" y2={G} stroke="#64748b" strokeWidth="2" />
        <polygon points={pts([[px, G], pTop, pTip])} fill={SKY} opacity={tri ? 0.3 : 0} style={{ transition: 'opacity 600ms' }} />
        <polygon points={pts([[tx, G], tTop, tTip])} fill={AMBER} opacity={tri ? 0.18 : 0} style={{ transition: 'opacity 600ms' }} />
        <line x1={px} y1={G} x2={pTop[0]} y2={pTop[1]} stroke={SKY} strokeWidth="5" />
        <rect x={tx - 6} y={tTop[1]} width="12" height={42 * m} fill="#475569" stroke={INK} />
        <rect x={tx - 16} y={tTop[1] - 10} width="32" height="12" rx="3" fill={AMBER} />
        <line x1={pTop[0]} y1={pTop[1]} x2={pTip[0]} y2={pTip[1]} stroke={AMBER} strokeDasharray="5 4" strokeWidth="2" />
        <line x1={tTop[0]} y1={tTop[1]} x2={tTip[0]} y2={tTip[1]} stroke={AMBER} strokeDasharray="5 4" strokeWidth="2" />
        <line x1={px} y1={G + 4} x2={pTip[0]} y2={G + 4} stroke="#0f172a" strokeWidth="7" />
        <line x1={tx} y1={G + 4} x2={tTip[0]} y2={G + 4} stroke="#0f172a" strokeWidth="7" />
        <RightAngleMark cx={tx} cy={G} deg={0} size={12} color={GREEN} />
        <Label x={px - 6} y={G - 6 * m - 8} color={SKY} size={13}>6 m</Label>
        <Label x={(px + pTip[0]) / 2} y={G + 26} color={SKY} size={13}>{`${fmt(poleSh)} m`}</Label>
        <Label x={(tx + tTip[0]) / 2} y={G + 26} color={AMBER} size={13}>{`${fmt(towerSh)} m`}</Label>
        <Label x={tx + 28} y={tTop[1] + 30} anchor="start" color={AMBER} size={14}>{s.show === 'answer' || task ? 'h = 42 m' : 'h = ?'}</Label>
        {s.show === 'answer' && <Label x={590} y={70} anchor="end" color={GREEN} size={15}>h / 28 = 6 / 4, so h = 42 m</Label>}
      </g>
    );
  } else {
    const m = 60; const lx = 50;
    const gx = lx + distT * m; const sh = distT / 3;
    const tip = gx + sh * m;
    picture = (
      <g>
        <line x1="0" y1={G} x2="600" y2={G} stroke="#64748b" strokeWidth="2" />
        <polygon points={pts([[lx, G], [lx, G - 3.6 * m], [tip, G]])} fill={AMBER} opacity="0.12" />
        <polygon points={pts([[gx, G], [gx, G - 0.9 * m], [tip, G]])} fill={PINK} opacity="0.35" />
        <line x1={lx} y1={G} x2={lx} y2={G - 3.6 * m} stroke={INK} strokeWidth="5" />
        <circle cx={lx + 10} cy={G - 3.6 * m} r="9" fill={AMBER} />
        <line x1={lx} y1={G - 3.6 * m} x2={tip} y2={G} stroke={AMBER} strokeDasharray="5 4" strokeWidth="2" />
        <line x1={gx} y1={G} x2={gx} y2={G - 0.9 * m} stroke={PINK} strokeWidth="6" strokeLinecap="round" />
        <circle cx={gx} cy={G - 0.9 * m - 8} r="7" fill={PINK} />
        <line x1={gx} y1={G + 4} x2={tip} y2={G + 4} stroke="#0f172a" strokeWidth="7" />
        <Label x={lx + 12} y={G - 3.6 * m + 50} anchor="start" color={INK} size={13}>3.6 m</Label>
        <Label x={gx - 10} y={G - 0.9 * m - 22} color={PINK} size={13}>0.9 m</Label>
        <Label x={(lx + gx) / 2} y={G + 26} color={INK} size={13}>{`${fmt(distT)} m`}</Label>
        <Label x={(gx + tip) / 2 + 6} y={G + 26} color={PINK} size={13}>{s.show === 'answer' ? `x = ${fmt(dist / 3)} m` : 'x = ?'}</Label>
        {s.show === 'answer' && <Label x={590} y={60} anchor="end" color={GREEN} size={15}>x / (x + 4.8) = 0.9 / 3.6, x = 1.6 m</Label>}
      </g>
    );
  }

  return (
    <StoryStage eyebrow="Visualizer · Similar triangles at work" title={mode === 'shadow' ? 'Height of the floodlight tower from shadows' : 'Shadow under a street lamp'}
      footer={(
        <div className="space-y-3">
          <ModePills value={mode} onChange={(v) => update({ mode: v })} options={[{ value: 'shadow', label: 'Sun and shadows' }, { value: 'lamp', label: 'Street lamp' }]} />
          {mode === 'shadow'
            ? <Slider label="Sun height (degrees)" min={35} max={70} step={1} value={Math.round(sun)} onChange={(v) => update({ sun: v })} />
            : <Slider label="Distance from lamp (m)" min={1} max={6} step={0.1} value={dist} shown={fmt(dist)} onChange={(v) => update({ dist: v })} />}
          <div className="flex flex-wrap gap-2">
            {mode === 'shadow' ? (
              <>
                <Readout label="Pole shadow" value={`${fmt(poleSh)} m`} tone="text-sky-300" />
                <Readout label="Tower shadow" value={`${fmt(towerSh)} m`} tone="text-amber-300" />
                <Readout label="Height / shadow" value={fmt(6 / poleSh, 2)} />
              </>
            ) : (
              <>
                <Readout label="Shadow x" value={`${fmt(dist / 3, 2)} m`} tone="text-pink-300" />
                <Readout label="Ratio" value="1 : 4" />
              </>
            )}
          </div>
          <TaskBanner text={task ? 'Move the sun until the pole’s shadow is 6 m.' : ''} done={done} />
        </div>
      )}>
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        {picture}
      </svg>
    </StoryStage>
  );
}
