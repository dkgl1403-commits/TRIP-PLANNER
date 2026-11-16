import React, { useState, useEffect } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Arithmetic Progressions — scene-driven story widgets.
// Each widget animates to the `visual` state of the current narrated scene; the learner can take over any time.

const W = 600;
const H = 360;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, dflt) => (v !== null && v !== undefined && Number.isFinite(Number(v)) ? Number(v) : dflt);
const int = (v, lo, hi, dflt) => clamp(Math.round(num(v, dflt)), lo, hi);
const fmt = (v) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? `−${Math.abs(r).toLocaleString('en-IN')}` : r.toLocaleString('en-IN');
};
const par = (v) => (v < 0 ? `(${fmt(v)})` : fmt(v));
const FADE = '@keyframes apFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }';
const SANS = 'sans-serif';
const MONO = 'monospace';

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
      {label}: <span className={`${tone} font-mono font-bold`}>{fmt(value)}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-amber-400" />
    </label>
  );
}

function NumBox({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-400">
      {label}
      <input type="number" value={value} onChange={(e) => onChange(num(e.target.value, 0))} className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold" />
    </label>
  );
}

// ─── WIDGET 1: Is it an AP? Towers of terms with the jumps between them ───
export function Class10APPatternWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 3, d: 2, n: 6, seq: null, task: null, caption: '' }, visual);
  const custom = Array.isArray(s.seq) && s.seq.length > 1;
  const a = num(s.a, 3);
  const d = num(s.d, 2);
  const n = int(s.n, 3, 8, 6);
  const terms = custom ? s.seq.slice(0, 8).map((v) => num(v, 0)) : Array.from({ length: n }, (_, i) => a + i * d);
  const diffs = terms.slice(1).map((t, i) => t - terms[i]);
  const isAP = diffs.every((x) => Math.abs(x - diffs[0]) < 1e-9);
  const maxAbs = Math.max(1, ...terms.map((t) => Math.abs(t)));
  const hasNeg = terms.some((t) => t < 0);
  const base = hasNeg ? 205 : 285;
  const span = hasNeg ? 105 : 180;
  const k = span / maxAbs;
  const gap = 520 / terms.length;
  const bw = Math.min(48, gap * 0.6);
  const xs = terms.map((_, i) => 40 + gap * (i + 0.5));
  const task = s.task && s.task.d !== undefined ? s.task : null;
  const done = !!task && !custom && a === task.a && d === task.d;
  useDone(done, onInteract);

  return (
    <StoryStage
      eyebrow="Visualizer · Same jump every time?"
      title={isAP ? `AP: first term ${fmt(terms[0])}, common difference ${fmt(diffs[0])}` : 'Not an AP: the jumps change'}
      footer={
        <div className="space-y-3">
          {custom ? (
            <button onClick={() => update({ seq: null })} className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-600 text-slate-300 hover:text-white">Build my own AP</button>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              <Slider label="First term a" value={a} min={-10} max={20} onChange={(v) => update({ a: v })} />
              <Slider label="Common difference d" value={d} min={-5} max={5} onChange={(v) => update({ d: v })} tone="text-emerald-300" />
              <Slider label="Terms shown" value={n} min={3} max={8} onChange={(v) => update({ n: v })} tone="text-sky-300" />
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="Differences" value={diffs.map(fmt).join(', ')} tone={isAP ? 'text-emerald-300' : 'text-rose-300'} />
            <span className="text-sm text-slate-300">{isAP ? 'Every jump is the same, so this is an arithmetic progression.' : 'The jumps are not equal, so it is not an AP.'}</span>
          </div>
          {task && <TaskBanner text={`Your turn: build the AP ${Array.from({ length: 4 }, (_, i) => fmt(task.a + i * task.d)).join(', ')}, …`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {s.caption && <text x="300" y="20" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="700" fontFamily={SANS}>{s.caption}</text>}
        <line x1="25" y1={base} x2="575" y2={base} stroke="#475569" strokeWidth="2" />
        {terms.map((t, i) => {
          const h = t * k;
          return (
            <g key={i}>
              <rect x={xs[i] - bw / 2} y={h >= 0 ? base - h : base} width={bw} height={Math.max(2, Math.abs(h))} rx="6"
                fill={t < 0 ? RED : i % 2 ? AMBER : '#f59e0b'} opacity="0.85" style={{ transition: `all 700ms ease ${i * 70}ms` }} />
              <text x={xs[i]} y={h >= 0 ? base - h - 8 : base - 8} textAnchor="middle" fill={INK} fontSize="17" fontWeight="900" fontFamily={MONO} style={{ transition: `all 700ms ease ${i * 70}ms` }}>{fmt(t)}</text>
              <text x={xs[i]} y={hasNeg ? 345 : 308} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily={MONO}>a{i + 1}</text>
            </g>
          );
        })}
        {diffs.map((df, i) => {
          const ok = Math.abs(df - diffs[0]) < 1e-9;
          const col = isAP ? GREEN : ok ? AMBER : RED;
          const y = 70;
          return (
            <g key={`${terms.length}-${i}`} style={{ animation: 'apFadeIn 500ms ease both', animationDelay: `${300 + i * 120}ms` }}>
              <path d={`M ${xs[i] + 4} ${y} Q ${(xs[i] + xs[i + 1]) / 2} ${y - 26} ${xs[i + 1] - 4} ${y}`} fill="none" stroke={col} strokeWidth="2.5" />
              <text x={(xs[i] + xs[i + 1]) / 2} y={y - 18} textAnchor="middle" fill={col} fontSize="15" fontWeight="900" fontFamily={MONO}>{df >= 0 ? '+' : ''}{fmt(df)}</text>
            </g>
          );
        })}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Jumping along the number line, nth term, term from the end, is it a term? ───
export function Class10APJumpWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 4, d: 3, n: 5, count: 0, value: null, fromEnd: false, task: null }, visual);
  const a = num(s.a, 4);
  const d = num(s.d, 3) || 1;
  const n = int(s.n, 1, 80, 5);
  const count = Math.max(int(s.count, 0, 80, 0), n, 6);
  const value = s.value === null || s.value === undefined ? null : num(s.value, null);
  const fromEnd = !!s.fromEnd;
  const term = (i) => a + (i - 1) * d;
  const last = term(count);
  const idx = fromEnd ? count - n + 1 : n;
  const sel = term(idx);
  const vals = [term(1), last, ...(value !== null ? [value] : [])];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const X = (v) => 50 + ((v - lo) / (hi - lo || 1)) * 500;
  const startX = fromEnd ? X(last) : X(term(1));
  const tx = useTween(X(sel), 900);
  const p = useReplay(`${a}-${d}-${n}-${count}-${fromEnd}`, 900);
  const LINE = 230;
  const r = count > 30 ? 3 : 5;
  const showAll = count <= 12;
  const hitK = value !== null ? (value - a) / d + 1 : null;
  const isTerm = hitK !== null && Math.abs(hitK - Math.round(hitK)) < 1e-9 && Math.round(hitK) >= 1;
  const task = s.task && s.task.value !== undefined ? s.task : null;
  const done = !!task && !fromEnd && sel === task.value;
  useDone(done, onInteract);
  const arcH = Math.min(130, Math.abs(tx - startX) * 0.45 + 20);
  const midX = (startX + tx) / 2;

  let status = null;
  if (value !== null) {
    if (isTerm) status = { text: `${fmt(value)} is term number ${Math.round(hitK)}`, col: GREEN };
    else if (hitK < 1) status = { text: `${fmt(value)} comes before the first term: not a term`, col: RED };
    else {
      const k = Math.floor(hitK);
      status = { text: `${fmt(value)} lies between a${k} = ${fmt(term(k))} and a${k + 1} = ${fmt(term(k + 1))}: not a term`, col: RED };
    }
  }

  return (
    <StoryStage
      eyebrow={fromEnd ? 'Visualizer · Counting back from the last term' : 'Visualizer · The nth term'}
      title={fromEnd ? `Term ${n} from the end = ${fmt(sel)}` : `Term ${n} = ${fmt(sel)}`}
      footer={
        <div className="space-y-3">
          <ModePills value={fromEnd ? 'end' : 'start'} onChange={(m) => update({ fromEnd: m === 'end' })} options={[{ value: 'start', label: 'Count from the start' }, { value: 'end', label: 'Count from the end' }]} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="n (which term)" value={n} min={1} max={Math.max(60, count)} onChange={(v) => update({ n: v, count: Math.max(count, v) })} />
            <Slider label="First term a" value={a} min={-30} max={30} onChange={(v) => update({ a: v })} tone="text-sky-300" />
            <Slider label="Common difference d" value={d} min={-10} max={10} onChange={(v) => update({ d: v || 1 })} tone="text-emerald-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label={fromEnd ? 'Last term l' : 'First term a'} value={fmt(fromEnd ? last : a)} tone="text-sky-300" />
            <Readout label="Jumps" value={`${n - 1}`} tone="text-amber-300" />
            <Readout label={fromEnd ? `Term ${n} from end` : `a${n}`} value={fmt(sel)} />
          </div>
          {task && <TaskBanner text={`Your turn: move n until the term equals ${fmt(task.value)}. Which term is it?`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="300" y="34" textAnchor="middle" fill={AMBER} fontSize="19" fontWeight="900" fontFamily={MONO}>
          {fromEnd
            ? `l − (n − 1)d = ${fmt(last)} − ${n - 1} × ${par(d)} = ${fmt(sel)}`
            : `a + (n − 1)d = ${fmt(a)} + ${n - 1} × ${par(d)} = ${fmt(sel)}`}
        </text>
        <text x="300" y="58" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700" fontFamily={SANS}>
          {count} terms shown: {fmt(term(1))}, {fmt(term(2))}, {fmt(term(3))}, …, {fmt(last)}
        </text>
        <line x1="40" y1={LINE} x2="560" y2={LINE} stroke="#475569" strokeWidth="3" />
        {Array.from({ length: count }, (_, i) => {
          const v = term(i + 1);
          const on = i + 1 === idx;
          return (
            <g key={`${count}-${i}`} style={{ opacity: clamp(p * count - i * 0.6, 0, 1) }}>
              <circle cx={X(v)} cy={LINE} r={on ? r + 3 : r} fill={on ? AMBER : SKY} />
              {(showAll || i === 0 || i === count - 1) && !on && (
                <text x={X(v)} y={LINE + 28} textAnchor="middle" fill={SKY} fontSize="13" fontWeight="800" fontFamily={MONO}>{fmt(v)}</text>
              )}
            </g>
          );
        })}
        {n > 1 && (
          <g>
            <path d={`M ${startX} ${LINE - 8} Q ${midX} ${LINE - 8 - arcH * 2} ${tx} ${LINE - 8}`} fill="none" stroke={AMBER} strokeWidth="3" strokeDasharray="7 5" />
            <text x={midX} y={LINE - 14 - arcH} textAnchor="middle" fill={AMBER} fontSize="15" fontWeight="900" fontFamily={SANS}>
              {n - 1} jump{n === 2 ? '' : 's'} of {fromEnd ? fmt(-d) : fmt(d)}
            </text>
          </g>
        )}
        <circle cx={tx} cy={LINE} r={r + 4} fill="none" stroke={AMBER} strokeWidth="3" />
        <text x={tx} y={LINE + 52} textAnchor="middle" fill={AMBER} fontSize="17" fontWeight="900" fontFamily={MONO}>{fmt(sel)}</text>
        <text x={startX} y={LINE + 74} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" fontFamily={SANS}>{fromEnd ? 'last term' : 'first term'}</text>
        {value !== null && (
          <g style={{ animation: 'apFadeIn 500ms ease both' }}>
            <polygon points={`${X(value)},${LINE - 8} ${X(value) - 8},${LINE - 24} ${X(value) + 8},${LINE - 24}`} fill={status.col} />
            <text x="300" y="338" textAnchor="middle" fill={status.col} fontSize="16" fontWeight="900" fontFamily={SANS}>{status.text}</text>
          </g>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Gauss's pairing, write the sum forwards and backwards ───
export function Class10APGaussWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 1, d: 1, n: 10, show: 'pairs', task: null }, visual);
  const a = num(s.a, 1);
  const d = num(s.d, 1);
  const n = int(s.n, 2, 100, 10);
  const show = ['rows', 'pairs', 'total'].includes(s.show) ? s.show : 'pairs';
  const l = a + (n - 1) * d;
  const S = (n * (a + l)) / 2;
  const cols = n <= 12 ? Array.from({ length: n }, (_, i) => i) : [0, 1, 2, 3, 4, null, n - 5, n - 4, n - 3, n - 2, n - 1];
  const cw = 540 / cols.length;
  const bw = Math.min(46, cw - 6);
  const p = useReplay(`${a}-${d}-${n}-${show}`, 1500);
  const slide = show === 'rows' ? 0 : clamp(p / 0.6, 0, 1);
  const sumOn = show !== 'rows' && p > 0.6;
  const task = s.task && s.task.sum !== undefined ? s.task : null;
  const done = !!task && S === task.sum;
  useDone(done, onInteract);
  const fs = n > 12 ? 13 : 15;

  return (
    <StoryStage
      eyebrow="Visualizer · Pair the first with the last"
      title={show === 'rows' ? `Add ${fmt(a)} + ${fmt(a + d)} + … + ${fmt(l)}` : `Every pair adds to ${fmt(a + l)}`}
      footer={
        <div className="space-y-3">
          <ModePills value={show} onChange={(m) => update({ show: m })} options={[{ value: 'rows', label: 'The sum' }, { value: 'pairs', label: 'Write it backwards' }, { value: 'total', label: 'Total' }]} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="Number of terms n" value={n} min={2} max={100} onChange={(v) => update({ n: v })} />
            <Slider label="First term a" value={a} min={1} max={20} onChange={(v) => update({ a: v })} tone="text-sky-300" />
            <Slider label="Common difference d" value={d} min={1} max={10} onChange={(v) => update({ d: v })} tone="text-emerald-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="First + last" value={fmt(a + l)} tone="text-emerald-300" />
            <Readout label="Pairs written" value={`${n}`} tone="text-sky-300" />
            <Readout label="Sum S" value={fmt(S)} tone="text-amber-300" />
          </div>
          {task && <TaskBanner text={`Your turn: with a = ${fmt(a)} and d = ${fmt(d)}, find n so that the sum is ${fmt(task.sum)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        <text x="22" y="98" fill={AMBER} fontSize="16" fontWeight="900" fontFamily={MONO}>S</text>
        <text x="22" y="158" fill={SKY} fontSize="16" fontWeight="900" fontFamily={MONO} opacity={slide}>S</text>
        {cols.map((c, j) => {
          const x = 50 + cw * (j + 0.5);
          if (c === null) {
            return (
              <g key="dots">
                <text x={x} y="98" textAnchor="middle" fill={INK} fontSize="18" fontWeight="900">…</text>
                <text x={x} y="158" textAnchor="middle" fill={INK} fontSize="18" fontWeight="900" opacity={slide}>…</text>
                {sumOn && <text x={x} y="222" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900">…</text>}
              </g>
            );
          }
          const top = a + c * d;
          const bot = a + (n - 1 - c) * d;
          return (
            <g key={`${n}-${c}`}>
              <rect x={x - bw / 2} y="76" width={bw} height="32" rx="7" fill="#78350f" stroke={AMBER} strokeWidth="2" />
              <text x={x} y="98" textAnchor="middle" fill={INK} fontSize={fs} fontWeight="900" fontFamily={MONO}>{fmt(top)}</text>
              <g transform={`translate(${(1 - slide) * 620} 0)`} opacity={slide}>
                <rect x={x - bw / 2} y="136" width={bw} height="32" rx="7" fill="#0c4a6e" stroke={SKY} strokeWidth="2" />
                <text x={x} y="158" textAnchor="middle" fill={INK} fontSize={fs} fontWeight="900" fontFamily={MONO}>{fmt(bot)}</text>
              </g>
              {sumOn && (
                <g style={{ animation: 'apFadeIn 450ms ease both', animationDelay: `${j * 50}ms` }}>
                  <line x1={x} y1="172" x2={x} y2="198" stroke={GREEN} strokeWidth="2" />
                  <rect x={x - bw / 2} y="200" width={bw} height="32" rx="7" fill="#064e3b" stroke={GREEN} strokeWidth="2" />
                  <text x={x} y="222" textAnchor="middle" fill={GREEN} fontSize={fs} fontWeight="900" fontFamily={MONO}>{fmt(top + bot)}</text>
                </g>
              )}
            </g>
          );
        })}
        {show === 'rows' && (
          <text x="300" y="290" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="700" fontFamily={SANS}>{n} terms to add, one by one?</text>
        )}
        {show !== 'rows' && sumOn && (
          <text x="300" y="275" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="900" fontFamily={MONO} style={{ animation: 'apFadeIn 500ms ease both' }}>
            2S = {n} × {fmt(a + l)} = {fmt(n * (a + l))}
          </text>
        )}
        {show === 'total' && sumOn && (
          <text x="300" y="318" textAnchor="middle" fill={AMBER} fontSize="22" fontWeight="900" fontFamily={MONO} style={{ animation: 'apFadeIn 500ms ease both', animationDelay: '300ms' }}>
            S = n(a + l) ÷ 2 = {fmt(S)}
          </text>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Two staircases make a rectangle, Sn = n/2 [2a + (n − 1)d] ───
export function Class10APStaircaseWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 3, d: 2, n: 5, flip: false, task: null }, visual);
  const a = int(s.a, 1, 6, 3);
  const d = int(s.d, 0, 3, 2);
  const n = int(s.n, 2, 8, 5);
  const hs = Array.from({ length: n }, (_, i) => a + i * d);
  const Ht = 2 * a + (n - 1) * d;
  const S = (n * Ht) / 2;
  const cw = Math.min(54, 380 / n);
  const u = Math.min(cw, 230 / Ht);
  const bottom = 300;
  const x0 = 250 - (n * cw) / 2;
  const p = useTween(s.flip ? 1 : 0, 1100);
  const task = s.task && s.task.sum !== undefined ? s.task : null;
  const done = !!task && S === task.sum;
  useDone(done, onInteract);
  const sumText = n <= 6 ? `${hs.join(' + ')} = ${S}` : `${hs.slice(0, 3).join(' + ')} + … + ${hs[n - 1]} = ${S}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Sum of n terms"
      title={s.flip ? `2S = ${n} × ${Ht}, so S = ${S}` : `S = ${sumText}`}
      footer={
        <div className="space-y-3">
          <ModePills value={s.flip ? 'two' : 'one'} onChange={(m) => update({ flip: m === 'two' })} options={[{ value: 'one', label: 'One staircase' }, { value: 'two', label: 'Add a flipped copy' }]} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Slider label="First term a" value={a} min={1} max={6} onChange={(v) => update({ a: v })} />
            <Slider label="Common difference d" value={d} min={0} max={3} onChange={(v) => update({ d: v })} tone="text-emerald-300" />
            <Slider label="Number of terms n" value={n} min={2} max={8} onChange={(v) => update({ n: v })} tone="text-sky-300" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label="2a + (n − 1)d" value={`${Ht}`} tone="text-sky-300" />
            <Readout label="Rectangle" value={`${n} × ${Ht} = ${n * Ht}`} tone="text-emerald-300" />
            <Readout label="S (half)" value={`${S}`} tone="text-amber-300" />
          </div>
          {task && <TaskBanner text={`Your turn: build a staircase of blocks whose total is exactly ${task.sum}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {hs.map((h, i) => (
          <g key={`a${n}-${i}`}>
            {Array.from({ length: h }, (_, k) => (
              <rect key={k} x={x0 + i * cw + 1.5} y={bottom - (k + 1) * u + 1} width={cw - 3} height={Math.max(1, u - 2)} rx="2"
                fill={AMBER} opacity="0.9" style={{ animation: 'apFadeIn 350ms ease both', animationDelay: `${i * 90 + k * 12}ms` }} />
            ))}
            <text x={x0 + (i + 0.5) * cw} y={bottom + 22} textAnchor="middle" fill={AMBER} fontSize="14" fontWeight="900" fontFamily={MONO}>{h}</text>
          </g>
        ))}
        <g transform={`translate(0 ${(1 - p) * -260})`} opacity={p}>
          {hs.map((_, i) => {
            const h2 = hs[n - 1 - i];
            const top = bottom - Ht * u;
            return (
              <g key={`b${n}-${i}`}>
                {Array.from({ length: h2 }, (_, k) => (
                  <rect key={k} x={x0 + i * cw + 1.5} y={top + k * u + 1} width={cw - 3} height={Math.max(1, u - 2)} rx="2" fill={SKY} opacity="0.85" />
                ))}
              </g>
            );
          })}
        </g>
        <g opacity={p}>
          <line x1={x0 + n * cw + 16} y1={bottom - Ht * u} x2={x0 + n * cw + 16} y2={bottom} stroke={GREEN} strokeWidth="2" />
          <text x={x0 + n * cw + 26} y={bottom - (Ht * u) / 2 - 8} fill={GREEN} fontSize="14" fontWeight="900" fontFamily={MONO}>height</text>
          <text x={x0 + n * cw + 26} y={bottom - (Ht * u) / 2 + 12} fill={GREEN} fontSize="14" fontWeight="900" fontFamily={MONO}>2a + (n − 1)d</text>
          <text x={x0 + n * cw + 26} y={bottom - (Ht * u) / 2 + 32} fill={GREEN} fontSize="14" fontWeight="900" fontFamily={MONO}>= {Ht}</text>
          <text x={x0 + (n * cw) / 2} y={bottom + 48} textAnchor="middle" fill={PURPLE} fontSize="14" fontWeight="900" fontFamily={SANS}>width: n = {n} columns</text>
        </g>
        <text x={x0 + n * cw + 26} y={bottom - 4} fill={AMBER} fontSize="13" fontWeight="800" fontFamily={SANS} opacity={1 - p}>first term {a}, step {d}</text>
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Planner for word problems, terms as bars, running total towards a goal ───
export function Class10APPlannerWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 100, d: 20, n: 6, goal: null, unit: '₹', item: 'Week', task: null }, visual);
  const a = num(s.a, 100);
  const d = num(s.d, 20);
  const n = int(s.n, 1, 30, 6);
  const goal = s.goal === null || s.goal === undefined ? null : num(s.goal, null);
  const unit = typeof s.unit === 'string' ? s.unit : '';
  const item = typeof s.item === 'string' && s.item ? s.item : 'Term';
  const terms = Array.from({ length: n }, (_, i) => a + i * d);
  const S = (n * (2 * a + (n - 1) * d)) / 2;
  const hasNeg = terms.some((t) => t < 0);
  const base = hasNeg ? 240 : 310;
  const span = hasNeg ? 130 : 200;
  const maxAbs = Math.max(1, ...terms.map((t) => Math.abs(t)));
  const k = span / maxAbs;
  const slot = 520 / Math.max(n, 10);
  const bw = slot * 0.7;
  const shown = useTween(S, 700);
  const frac = goal ? clamp(shown / goal, 0, 1) : 0;
  const task = s.task && s.task.goal !== undefined ? s.task : null;
  const done = !!task && S === task.goal && !hasNeg;
  useDone(done, onInteract);
  const money = (v) => `${unit === '₹' ? '₹' : ''}${fmt(v)}${unit && unit !== '₹' ? ` ${unit}` : ''}`;

  return (
    <StoryStage
      eyebrow="Visualizer · Word problems"
      title={`${item} ${n}: ${money(terms[n - 1])} · total so far ${money(S)}`}
      footer={
        <div className="space-y-3">
          <Slider label={`Number of ${item.toLowerCase()}s n`} value={n} min={1} max={30} onChange={(v) => update({ n: v })} />
          <div className="flex flex-wrap gap-3 items-center">
            <NumBox label="First term a" value={a} onChange={(v) => update({ a: v })} />
            <NumBox label="Common difference d" value={d} onChange={(v) => update({ d: v })} />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Readout label={`a${n}`} value={money(terms[n - 1])} tone={terms[n - 1] < 0 ? 'text-rose-300' : 'text-sky-300'} />
            <Readout label={`S${n}`} value={money(S)} tone="text-amber-300" />
            {hasNeg && <span className="text-sm text-rose-300">A negative term makes no sense here: this n is rejected.</span>}
          </div>
          {task && <TaskBanner text={`Your turn: find n so that the total is exactly ${money(task.goal)}.`} done={done} />}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
        <rect width={W} height={H} fill="#020617" />
        {goal !== null && (
          <g>
            <rect x="50" y="18" width="500" height="22" rx="11" fill="#0f172a" stroke="#475569" />
            <rect x="50" y="18" width={500 * frac} height="22" rx="11" fill={S === goal ? GREEN : AMBER} opacity="0.85" />
            <text x="300" y="34" textAnchor="middle" fill="#020617" fontSize="13" fontWeight="900" fontFamily={SANS}>
              {money(Math.round(shown))} of {money(goal)}{S === goal ? ' ✔' : ''}
            </text>
          </g>
        )}
        <line x1="30" y1={base} x2="570" y2={base} stroke="#475569" strokeWidth="2" />
        {terms.map((t, i) => {
          const h = t * k;
          const x = 40 + slot * i + (slot - bw) / 2;
          return (
            <g key={i} style={{ animation: 'apFadeIn 400ms ease both', animationDelay: `${i * 40}ms` }}>
              <rect x={x} y={h >= 0 ? base - h : base} width={bw} height={Math.max(2, Math.abs(h))} rx="3"
                fill={t < 0 ? RED : i % 2 ? PINK : PURPLE} opacity="0.85" style={{ transition: 'all 600ms ease' }} />
              {n <= 12 && (
                <text x={x + bw / 2} y={h >= 0 ? base - h - 6 : base + Math.abs(h) + 16} textAnchor="middle" fill={INK} fontSize="12" fontWeight="800" fontFamily={MONO}>{fmt(t)}</text>
              )}
              {(n <= 15 || i % 5 === 4 || i === 0) && (
                <text x={x + bw / 2} y={hasNeg ? 352 : 330} textAnchor="middle" fill={SKY} fontSize="11" fontWeight="700" fontFamily={MONO}>{i + 1}</text>
              )}
            </g>
          );
        })}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}
