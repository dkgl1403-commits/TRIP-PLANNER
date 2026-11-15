import React, { useState, useEffect, useRef } from 'react';
import {
  StoryStage, ModePills, Readout, useTween, useSceneState, TaskBanner, svgPoint,
  INK, AMBER, SKY, GREEN, PINK, PURPLE, RED,
} from '../engine/storyKit';

// Class 10 · Polynomials (story chapter) — scene-driven widgets.
// Degree and types, graphs of linear / quadratic / cubic polynomials, zeroes as x-axis crossings,
// the sum and product of zeroes, and building a quadratic from a given sum and product.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
const SUP = { 2: '²', 3: '³', 4: '⁴' };
const FADE = '@keyframes c10poFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }';

// Number → text with a real minus sign and simple fractions (halves, thirds, quarters, sixths, eighths)
function fmt(v) {
  if (!Number.isFinite(v)) return '?';
  const r = Math.round(v * 1e6) / 1e6;
  const sign = r < 0 ? '−' : '';
  const a = Math.abs(r);
  if (near(a, Math.round(a))) return sign + Math.round(a);
  for (const d of [2, 3, 4, 6, 8]) {
    const n = a * d;
    if (near(n, Math.round(n), 1e-5)) return `${sign}${Math.round(n)}/${d}`;
  }
  return sign + a.toFixed(2);
}

// Coefficients (highest power first) → "2x² − 3x + 1"
function polyStr(cs, v = 'x') {
  const deg = cs.length - 1;
  let out = '';
  cs.forEach((c, i) => {
    const p = deg - i;
    if (near(c, 0)) return;
    const neg = c < 0;
    const mag = Math.abs(c);
    let coef = near(mag, 1) && p > 0 ? '' : fmt(mag);
    if (p > 0 && coef.includes('/')) coef = `(${coef})`;
    const vs = p === 0 ? '' : p === 1 ? v : v + SUP[p];
    if (!out) out = (neg ? '−' : '') + coef + vs;
    else out += (neg ? ' − ' : ' + ') + coef + vs;
  });
  return out || '0';
}

const evalPoly = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);

// Real zeroes of a polynomial inside [lo, hi], found by sign changes plus touching points
function findZeroes(f, lo, hi) {
  const out = [];
  const N = 1200;
  const h = (hi - lo) / N;
  let px = lo;
  let py = f(px);
  if (Math.abs(py) < 1e-9) out.push(px);
  for (let i = 1; i <= N; i += 1) {
    const x = lo + i * h;
    const y = f(x);
    if (Math.abs(y) < 1e-9) out.push(x);
    else if (py * y < 0 && Math.abs(py) > 1e-9) {
      let a = px;
      let b = x;
      for (let k = 0; k < 50; k += 1) {
        const m = (a + b) / 2;
        if (f(a) * f(m) <= 0) b = m; else a = m;
      }
      out.push((a + b) / 2);
    } else if (i < N) {
      // touching: |f| has a local minimum very close to 0 without a sign change
      const yn = f(x + h);
      if (Math.abs(y) < Math.abs(py) && Math.abs(y) < Math.abs(yn) && Math.abs(y) < 0.02 && py * yn > 0) out.push(x);
    }
    px = x;
    py = y;
  }
  const uniq = [];
  out.forEach((z) => { if (!uniq.some((u) => Math.abs(u - z) < 0.05)) uniq.push(Math.abs(z) < 1e-6 ? 0 : z); });
  return uniq;
}

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

// Endless 0 → 1 loop (for the flying cricket ball)
function useLoop(on, period = 2600) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      setT((Math.max(0, now - start) % period) / period);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, period]);
  return t;
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

// ─── Coordinate plane ───
function plane(win, box) {
  const [x0, x1, y0, y1] = win;
  const [L, T, R, B] = box;
  const sx = (x) => L + ((x - x0) / (x1 - x0)) * (R - L);
  const sy = (y) => B - ((y - y0) / (y1 - y0)) * (B - T);
  return { sx, sy, x0, x1, y0, y1, L, T, R, B };
}

function Grid({ P, id, xStep = 1, yStep = 2 }) {
  const xs = [];
  for (let x = Math.ceil(P.x0 / xStep) * xStep; x <= P.x1 + 1e-9; x += xStep) xs.push(Math.round(x * 100) / 100);
  const ys = [];
  for (let y = Math.ceil(P.y0 / yStep) * yStep; y <= P.y1 + 1e-9; y += yStep) ys.push(Math.round(y * 100) / 100);
  const ax = clamp(P.sx(0), P.L, P.R);
  const ay = clamp(P.sy(0), P.T, P.B);
  return (
    <g>
      <defs>
        <clipPath id={id}><rect x={P.L} y={P.T} width={P.R - P.L} height={P.B - P.T} /></clipPath>
      </defs>
      <rect x={P.L} y={P.T} width={P.R - P.L} height={P.B - P.T} fill="#020617" stroke="#1e293b" />
      {xs.map((x) => <line key={`gx${x}`} x1={P.sx(x)} y1={P.T} x2={P.sx(x)} y2={P.B} stroke="#1e293b" strokeWidth="1" />)}
      {ys.map((y) => <line key={`gy${y}`} x1={P.L} y1={P.sy(y)} x2={P.R} y2={P.sy(y)} stroke="#1e293b" strokeWidth="1" />)}
      <line x1={P.L} y1={ay} x2={P.R} y2={ay} stroke="#94a3b8" strokeWidth="2" />
      <line x1={ax} y1={P.T} x2={ax} y2={P.B} stroke="#94a3b8" strokeWidth="2" />
      {xs.filter((x) => x !== 0).map((x) => (
        <text key={`tx${x}`} x={P.sx(x)} y={ay + 14} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace">{fmt(x)}</text>
      ))}
      {ys.filter((y) => y !== 0).map((y) => (
        <text key={`ty${y}`} x={ax - 5} y={P.sy(y) + 4} textAnchor="end" fill="#64748b" fontSize="11" fontFamily="monospace">{fmt(y)}</text>
      ))}
      <text x={P.R - 6} y={ay - 6} textAnchor="end" fill="#94a3b8" fontSize="13" fontStyle="italic" fontWeight="700">x</text>
      <text x={ax + 6} y={P.T + 14} fill="#94a3b8" fontSize="13" fontStyle="italic" fontWeight="700">y</text>
    </g>
  );
}

function curvePath(f, P) {
  const pad = (P.y1 - P.y0) * 1.5;
  let d = '';
  const N = 240;
  for (let i = 0; i <= N; i += 1) {
    const x = P.x0 + ((P.x1 - P.x0) * i) / N;
    const y = clamp(f(x), P.y0 - pad, P.y1 + pad);
    d += `${i ? 'L' : 'M'} ${P.sx(x).toFixed(2)} ${P.sy(y).toFixed(2)} `;
  }
  return d;
}

function Curve({ f, P, clip, color = SKY, draw = 1, width = 4 }) {
  return (
    <path d={curvePath(f, P)} clipPath={`url(#${clip})`} fill="none" stroke={color} strokeWidth={width}
      strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
  );
}

function ZeroDots({ zs, P, color = GREEN, labels = true }) {
  return (
    <g>
      {zs.filter((z) => z >= P.x0 && z <= P.x1).map((z, i) => (
        <g key={`${i}-${z.toFixed(2)}`}>
          <circle cx={P.sx(z)} cy={P.sy(0)} r="7" fill="none" stroke={color} strokeWidth="2">
            <animate attributeName="r" values="7;20" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={P.sx(z)} cy={P.sy(0)} r="7" fill={color} stroke="#020617" strokeWidth="2" />
          {labels && (
            <text x={P.sx(z)} y={P.sy(0) + (i % 2 ? 34 : -14)} textAnchor="middle" fill={color} fontSize="14" fontWeight="900" fontFamily="monospace">
              ({fmt(z)}, 0)
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

// ─── WIDGET 1: What is a polynomial? Terms, degree, types ───
const TYPE = ['constant', 'linear', 'quadratic', 'cubic'];
const TYPE_COL = [INK, SKY, AMBER, PINK];

export function Class10PolyDegreeWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'build', coeffs: [0, 1, -3, -4], items: [], show: 99, task: null }, visual);
  const mode = s.mode === 'check' ? 'check' : 'build';
  const raw = Array.isArray(s.coeffs) ? s.coeffs : [0, 1, -3, -4];
  const cs = [0, 0, 0, 0].map((_, i) => num(raw[i], 0));
  const lead = cs.findIndex((c) => !near(c, 0));
  const deg = lead === -1 ? -1 : 3 - lead;
  const items = Array.isArray(s.items) ? s.items.slice(0, 5) : [];
  const shown = clamp(Math.round(num(s.show, 99)), 0, items.length);
  const task = s.task && Number.isFinite(Number(s.task.degree)) ? s.task : null;
  const done = !!task && mode === 'build' && deg === Number(task.degree) && (task.terms == null || cs.filter((c) => !near(c, 0)).length === Number(task.terms));
  useDone(done, onInteract);
  const meter = useTween(deg < 0 ? 0 : deg, 800);

  const setC = (i, v) => update({ coeffs: cs.map((c, j) => (j === i ? v : c)) });

  let picture;
  if (mode === 'build') {
    picture = (
      <>
        <text x="300" y="52" textAnchor="middle" fill={INK} fontSize="30" fontWeight="900" fontFamily="monospace">
          p(x) = {polyStr(cs)}
        </text>
        {cs.map((c, i) => {
          const p = 3 - i;
          const on = !near(c, 0);
          const isLead = i === lead;
          const x = 42 + i * 134;
          const col = isLead ? AMBER : on ? SKY : '#475569';
          const term = on ? polyStr([c, ...Array(p).fill(0)]) : `0${p === 0 ? '' : p === 1 ? 'x' : `x${SUP[p]}`}`;
          return (
            <g key={p} style={{ transition: 'transform 500ms ease, opacity 500ms ease', transform: `translateY(${isLead ? -8 : 0}px)`, opacity: on ? 1 : 0.45 }}>
              <rect x={x} y="88" width="114" height="110" rx="14" fill={isLead ? '#451a03' : '#0f172a'} stroke={col} strokeWidth={isLead ? 3.5 : 2}
                strokeDasharray={on ? 'none' : '6 5'} style={{ transition: 'fill 500ms ease, stroke 500ms ease' }} />
              <text x={x + 57} y="146" textAnchor="middle" fill={col} fontSize="28" fontWeight="900" fontFamily="monospace">{term}</text>
              <text x={x + 57} y="182" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">power {p}</text>
              {isLead && <text x={x + 57} y="80" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight="900">★ highest power</text>}
            </g>
          );
        })}
        {/* degree meter */}
        <line x1="90" y1="270" x2="510" y2="270" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        {TYPE.map((t, d) => (
          <g key={t}>
            <circle cx={90 + d * 140} cy="270" r="9" fill={deg === d ? TYPE_COL[d] : '#1e293b'} stroke={TYPE_COL[d]} strokeWidth="2" />
            <text x={90 + d * 140} y="300" textAnchor="middle" fill={deg === d ? TYPE_COL[d] : '#64748b'} fontSize="15" fontWeight="800">{t}</text>
            <text x={90 + d * 140} y="320" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">degree {d}</text>
          </g>
        ))}
        {deg >= 0 && (
          <g transform={`translate(${90 + meter * 140}, 246)`}>
            <polygon points="-10,-12 10,-12 0,4" fill={TYPE_COL[deg]} />
          </g>
        )}
        {deg < 0 && <text x="300" y="345" textAnchor="middle" fill={RED} fontSize="14" fontWeight="800">all coefficients 0: the zero polynomial (degree not defined)</text>}
      </>
    );
  } else {
    picture = (
      <>
        <text x="300" y="34" textAnchor="middle" fill={INK} fontSize="18" fontWeight="900">Polynomial or not? Every power of x must be a whole number</text>
        {items.map((it, i) => {
          const on = i < shown;
          const y = 58 + i * 58;
          const col = it.ok ? GREEN : RED;
          return (
            <g key={`${i}-${it.e}`} style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -30}px)`, transition: `opacity 500ms ease ${i * 120}ms, transform 500ms ease ${i * 120}ms` }}>
              <rect x="30" y={y} width="540" height="48" rx="12" fill="#0f172a" stroke={col} strokeWidth="2" />
              <text x="50" y={y + 31} fill={INK} fontSize="20" fontWeight="900" fontFamily="monospace">{it.e}</text>
              <text x="300" y={y + 30} fill="#cbd5e1" fontSize="13">{it.why}</text>
              <text x="552" y={y + 32} textAnchor="end" fill={col} fontSize="22" fontWeight="900">{it.ok ? '✔' : '✘'}</text>
            </g>
          );
        })}
      </>
    );
  }

  return (
    <StoryStage
      eyebrow="Visualizer · Degree of a polynomial"
      title={mode === 'build' ? `Degree ${deg < 0 ? '—' : deg}: ${deg < 0 ? 'zero polynomial' : `${TYPE[deg]} polynomial`}` : 'Which of these are polynomials?'}
      footer={
        <div className="space-y-3">
          <TaskBanner text={task ? `Make a ${TYPE[task.degree] || ''} polynomial${task.terms ? ` with exactly ${task.terms} terms` : ''}.` : ''} done={done} />
          <ModePills options={[{ value: 'build', label: 'Build p(x)' }, { value: 'check', label: 'Polynomial or not?' }]} value={mode} onChange={(m) => update({ mode: m })} />
          {mode === 'build' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['x³', 'x²', 'x', 'number'].map((lab, i) => (
                  <Slider key={lab} label={`coefficient of ${lab}`} value={cs[i]} min={-5} max={5} onChange={(v) => setC(i, v)} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Readout label="degree" value={deg < 0 ? '—' : deg} tone="text-amber-300" />
                <Readout label="type" value={deg < 0 ? 'zero' : TYPE[deg]} tone="text-sky-300" />
                <Readout label="terms" value={cs.filter((c) => !near(c, 0)).length} />
              </div>
            </>
          )}
          {mode === 'check' && items.length > 0 && shown < items.length && (
            <button onClick={() => update({ show: shown + 1 })} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-200">Show next</button>
          )}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">{picture}</svg>
    </StoryStage>
  );
}

// ─── WIDGET 2: Graph of a linear or quadratic polynomial; zeroes are x-axis crossings ───
export function Class10PolyGraphWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({
    kind: 'quadratic', a: 1, b: -3, c: -4, win: [-4, 6, -8, 8], table: false, probe: null, ball: false, task: null, note: '',
  }, visual);
  const kind = s.kind === 'linear' ? 'linear' : 'quadratic';
  const ra = num(s.a, 1);
  const rb = num(s.b, 0);
  const rc = kind === 'linear' ? 0 : num(s.c, 0);
  const a = useTween(ra);
  const b = useTween(rb);
  const c = useTween(rc);
  const win = Array.isArray(s.win) && s.win.length === 4 ? s.win.map(Number) : [-4, 6, -8, 8];
  const P = plane(win, [44, 18, 580, 342]);
  const cs = kind === 'linear' ? [ra, rb] : [ra, rb, rc];
  const csT = kind === 'linear' ? [a, b] : [a, b, c];
  const f = (x) => evalPoly(csT, x);
  const fr = (x) => evalPoly(cs, x);
  const draw = useReplay(`${kind}|${s.table}|${JSON.stringify(win)}`, 1500);

  // exact zeroes for readouts
  let zeroes = [];
  if (kind === 'linear') zeroes = near(ra, 0) ? [] : [-rb / ra];
  else if (near(ra, 0)) zeroes = near(rb, 0) ? [] : [-rc / rb];
  else {
    const D = rb * rb - 4 * ra * rc;
    if (near(D, 0)) zeroes = [-rb / (2 * ra)];
    else if (D > 0) zeroes = [(-rb - Math.sqrt(D)) / (2 * ra), (-rb + Math.sqrt(D)) / (2 * ra)].sort((p, q) => p - q);
  }
  const zT = kind === 'linear' ? (near(a, 0) ? [] : [-b / a]) : findZeroes(f, win[0], win[1]);
  const settled = near(a, ra, 1e-3) && near(b, rb, 1e-3) && near(c, rc, 1e-3);
  const showZ = settled ? zeroes : zT;

  const pts = [];
  if (s.table) {
    for (let x = Math.ceil(win[0]); x <= win[1]; x += 1) {
      const y = fr(x);
      if (y >= win[2] && y <= win[3]) pts.push([x, y]);
    }
  }
  const probe = s.probe == null ? null : clamp(num(s.probe, 0), win[0], win[1]);
  const ballT = useLoop(!!s.ball && zeroes.length === 2);
  const task = s.task && typeof s.task === 'object' ? s.task : null;
  let done = false;
  if (task) {
    done = true;
    if (task.kind && task.kind !== kind) done = false;
    if (task.zeroes != null && (kind !== 'quadratic' || near(ra, 0) || zeroes.length !== Number(task.zeroes))) done = false;
    if (task.zeroAt != null && !(zeroes.length === 1 && near(zeroes[0], Number(task.zeroAt)) && !near(ra, 0))) done = false;
    if (task.opens === 'down' && !(ra < 0)) done = false;
    if (task.opens === 'up' && !(ra > 0)) done = false;
  }
  useDone(done, onInteract);

  const taskText = task ? task.text || '' : '';
  const shape = kind === 'quadratic' && !near(ra, 0) ? (ra > 0 ? 'opens up ∪' : 'opens down ∩') : 'straight line';

  return (
    <StoryStage
      eyebrow={`Visualizer · ${kind === 'linear' ? 'Linear' : 'Quadratic'} polynomial graph`}
      title={`y = ${polyStr(cs)}`}
      footer={
        <div className="space-y-3">
          <TaskBanner text={taskText} done={done} />
          <ModePills options={[{ value: 'linear', label: 'Linear: ax + b' }, { value: 'quadratic', label: 'Quadratic: ax² + bx + c' }]} value={kind} onChange={(k) => update({ kind: k })} />
          <div className="grid grid-cols-3 gap-3">
            <Slider label="a" value={ra} min={-3} max={3} step={0.5} onChange={(v) => update({ a: v })} />
            <Slider label="b" value={rb} min={-8} max={8} onChange={(v) => update({ b: v })} tone="text-sky-300" />
            {kind === 'quadratic' && <Slider label="c" value={rc} min={-8} max={8} onChange={(v) => update({ c: v })} tone="text-pink-300" />}
          </div>
          {s.table && pts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="text-xs font-mono text-slate-300 border border-slate-800">
                <tbody>
                  <tr><td className="px-2 text-amber-300 font-bold">x</td>{pts.map(([x]) => <td key={x} className="px-2 text-center">{fmt(x)}</td>)}</tr>
                  <tr><td className="px-2 text-sky-300 font-bold">y</td>{pts.map(([x, y]) => <td key={x} className={`px-2 text-center ${near(y, 0) ? 'text-emerald-300 font-bold' : ''}`}>{fmt(y)}</td>)}</tr>
                </tbody>
              </table>
            </div>
          )}
          {probe != null && <Slider label="move the point: x" value={probe} min={win[0]} max={win[1]} step={0.5} onChange={(v) => update({ probe: v })} tone="text-purple-300" />}
          <div className="flex flex-wrap gap-2">
            <Readout label="zeroes" value={zeroes.length ? zeroes.map(fmt).join(', ') : 'none'} />
            <Readout label="how many" value={zeroes.length} tone="text-amber-300" />
            <Readout label="shape" value={shape} tone="text-sky-300" />
          </div>
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <Grid P={P} id="c10po-g2" xStep={1} yStep={(win[3] - win[2]) > 20 ? 4 : 2} />
        <Curve f={f} P={P} clip="c10po-g2" draw={draw} color={kind === 'linear' ? AMBER : SKY} />
        {pts.map(([x, y], i) => (
          <circle key={`p${x}`} cx={P.sx(x)} cy={P.sy(y)} r="6" fill={near(y, 0) ? GREEN : PURPLE} stroke="#020617" strokeWidth="2"
            style={{ opacity: 0, animation: `c10poFade 400ms ease ${i * 110}ms forwards` }} />
        ))}
        {draw > 0.95 && <ZeroDots zs={showZ} P={P} />}
        {kind === 'quadratic' && !near(ra, 0) && draw > 0.95 && (() => {
          const vx = -b / (2 * a);
          const vy = f(vx);
          if (vx < win[0] || vx > win[1] || vy < win[2] || vy > win[3]) return null;
          return (
            <g>
              <circle cx={P.sx(vx)} cy={P.sy(vy)} r="4" fill={AMBER} />
              <text x={P.sx(vx)} y={P.sy(vy) + (ra > 0 ? 22 : -12)} textAnchor="middle" fill={AMBER} fontSize="12" fontWeight="800">vertex</text>
            </g>
          );
        })()}
        {probe != null && (() => {
          const y = fr(probe);
          const inside = y >= win[2] && y <= win[3];
          const isZero = near(y, 0);
          return (
            <g>
              {inside && <line x1={P.sx(probe)} y1={P.sy(0)} x2={P.sx(probe)} y2={P.sy(y)} stroke={PURPLE} strokeWidth="2" strokeDasharray="5 4" />}
              {inside && <circle cx={P.sx(probe)} cy={P.sy(y)} r="8" fill={isZero ? GREEN : PURPLE} stroke="#020617" strokeWidth="2" style={{ transition: 'cx 300ms ease, cy 300ms ease' }} />}
              <rect x="56" y="26" width="200" height="34" rx="10" fill="#0f172a" stroke={isZero ? GREEN : PURPLE} strokeWidth="2" />
              <text x="156" y="49" textAnchor="middle" fill={isZero ? GREEN : INK} fontSize="16" fontWeight="900" fontFamily="monospace">
                p({fmt(probe)}) = {fmt(y)}{isZero ? '  zero!' : ''}
              </text>
            </g>
          );
        })()}
        {s.ball && zeroes.length === 2 && (() => {
          const x = zeroes[0] + (zeroes[1] - zeroes[0]) * ballT;
          const y = fr(x);
          return (
            <g>
              <circle cx={P.sx(x)} cy={P.sy(y)} r="9" fill={RED} stroke="#fecaca" strokeWidth="2" />
              <path d={`M ${P.sx(x) - 6} ${P.sy(y) - 4} Q ${P.sx(x)} ${P.sy(y)} ${P.sx(x) - 6} ${P.sy(y) + 4}`} stroke="#fff" strokeWidth="1.5" fill="none" />
            </g>
          );
        })()}
        {s.note && <text x="574" y="40" textAnchor="end" fill={AMBER} fontSize="14" fontWeight="800">{s.note}</text>}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 3: Cubic graphs, and reading the number of zeroes from any graph ───
const GALLERY = [
  { name: 'Graph A', f: (x) => 0.8 * x + 1 },
  { name: 'Graph B', f: (x) => (x - 1) * (x - 1) + 2 },
  { name: 'Graph C', f: (x) => (x - 1) * (x - 1) },
  { name: 'Graph D', f: (x) => 0.5 * x * (x * x - 4) },
  { name: 'Graph E', f: (x) => 0.25 * (x + 3) * (x - 1) * (x - 1) },
  { name: 'Graph F', f: (x) => 0.3 * x * x * x + 1 },
  { name: 'Graph G', f: (x) => 0.1 * (x * x - 1) * (x * x - 9) },
];
const GAL_ZEROES = [1, 0, 1, 3, 2, 1, 4];

export function Class10PolyCubicWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ mode: 'cubic', roots: [-2, 0, 2], a: 0.5, k: 0, g: 3, reveal: false, pick: null, task: null }, visual);
  const mode = s.mode === 'guess' ? 'guess' : 'cubic';
  const rr = Array.isArray(s.roots) && s.roots.length === 3 ? s.roots.map((r) => num(r, 0)) : [-2, 0, 2];
  const r1 = useTween(rr[0]);
  const r2 = useTween(rr[1]);
  const r3 = useTween(rr[2]);
  const ra = near(num(s.a, 0.5), 0) ? 0.5 : num(s.a, 0.5);
  const a = useTween(ra);
  const rk = clamp(num(s.k, 0), -5, 5);
  const k = useTween(rk);
  const g = clamp(Math.round(num(s.g, 3)), 0, GALLERY.length - 1);
  const win = [-4, 4, -6, 6];
  const P = plane(win, [44, 18, 580, 342]);
  const f = mode === 'cubic' ? (x) => a * (x - r1) * (x - r2) * (x - r3) + k : GALLERY[g].f;
  const fr = (x) => ra * (x - rr[0]) * (x - rr[1]) * (x - rr[2]) + rk;
  const draw = useReplay(`${mode}|${g}`, 1500);
  const zs = findZeroes(mode === 'cubic' ? f : GALLERY[g].f, win[0], win[1]);
  const zExact = mode === 'cubic' ? findZeroes(fr, -10, 10) : zs;
  const pick = s.pick == null ? null : Math.round(num(s.pick, -1));
  const correct = GAL_ZEROES[g];
  const reveal = !!s.reveal || pick === correct;
  const task = s.task && typeof s.task === 'object' ? s.task : null;
  let done = false;
  if (task) {
    if (task.pick) done = mode === 'guess' && pick === correct;
    else if (task.zeroes != null) done = mode === 'cubic' && zExact.length === Number(task.zeroes);
  }
  useDone(done, onInteract);
  const eq = `y = ${fmt(ra)}(x ${rr[0] < 0 ? '+' : '−'} ${fmt(Math.abs(rr[0]))})(x ${rr[1] < 0 ? '+' : '−'} ${fmt(Math.abs(rr[1]))})(x ${rr[2] < 0 ? '+' : '−'} ${fmt(Math.abs(rr[2]))})${near(rk, 0) ? '' : ` ${rk < 0 ? '−' : '+'} ${fmt(Math.abs(rk))}`}`
    .replace(/\(x − 0\)/g, 'x');

  return (
    <StoryStage
      eyebrow="Visualizer · Zeroes from a graph"
      title={mode === 'cubic' ? 'A cubic crosses the x-axis at most 3 times' : `${GALLERY[g].name}: how many zeroes?`}
      accent="text-pink-400"
      footer={
        <div className="space-y-3">
          <TaskBanner text={task ? task.text || '' : ''} done={done} />
          <ModePills options={[{ value: 'cubic', label: 'Cubic: slide it' }, { value: 'guess', label: 'Count the zeroes' }]} value={mode} onChange={(m) => update({ mode: m, pick: null })} />
          {mode === 'cubic' ? (
            <>
              <Slider label="shift the curve up or down" value={rk} min={-4} max={4} step={0.5} onChange={(v) => update({ k: v })} tone="text-pink-300" />
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => update({ a: -ra })} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-200">Flip (change sign of a)</button>
                <Readout label="zeroes" value={zExact.length} tone="text-emerald-300" />
                <Readout label="at x" value={zExact.length ? zExact.map(fmt).join(', ') : 'none'} tone="text-sky-300" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-bold">Graph:</span>
                {GALLERY.map((G, i) => (
                  <button key={G.name} onClick={() => update({ g: i, pick: null, reveal: false })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${i === g ? 'border-pink-400 text-pink-300 bg-pink-500/10' : 'border-slate-700 text-slate-400'}`}>{G.name.slice(-1)}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-bold">Number of zeroes:</span>
                {[0, 1, 2, 3, 4].map((n) => (
                  <button key={n} onClick={() => update({ pick: n })}
                    className={`w-9 h-9 rounded-full text-sm font-black border-2 transition ${pick === n ? (n === correct ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-red-400 bg-red-500/20 text-red-300') : 'border-slate-600 text-slate-300'}`}>{n}</button>
                ))}
                {pick != null && pick !== correct && <span className="text-xs text-red-300 font-bold">Count only the points where the curve meets the x-axis.</span>}
              </div>
            </>
          )}
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <Grid P={P} id="c10po-g3" />
        <Curve f={f} P={P} clip="c10po-g3" draw={draw} color={PINK} />
        {mode === 'cubic' && draw > 0.95 && <ZeroDots zs={zs} P={P} />}
        {mode === 'guess' && reveal && draw > 0.95 && <ZeroDots zs={zs} P={P} labels={false} />}
        {mode === 'cubic' && (
          <g>
            <rect x="56" y="26" width="290" height="32" rx="10" fill="#0f172a" stroke={PINK} strokeWidth="1.5" />
            <text x="201" y="48" textAnchor="middle" fill={INK} fontSize="14" fontWeight="800" fontFamily="monospace">{eq}</text>
          </g>
        )}
        {mode === 'guess' && reveal && (
          <g style={{ opacity: 0, animation: 'c10poFade 500ms ease forwards' }}>
            <rect x="400" y="26" width="168" height="34" rx="10" fill="#052e16" stroke={GREEN} strokeWidth="2" />
            <text x="484" y="49" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900">{correct} zero{correct === 1 ? '' : 'es'}</text>
          </g>
        )}
        <style>{FADE}</style>
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 4: Zeroes and coefficients: sum = −b/a, product = c/a ───
export function Class10PolySumProductWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ a: 1, al: 4, be: -1, step: 3, task: null }, visual);
  const ra = near(num(s.a, 1), 0) ? 1 : num(s.a, 1);
  const ral = clamp(num(s.al, 4), -5, 5);
  const rbe = clamp(num(s.be, -1), -5, 5);
  const step = clamp(Math.round(num(s.step, 3)), 0, 3);
  const a = useTween(ra);
  const al = useTween(ral);
  const be = useTween(rbe);
  const B = -ra * (ral + rbe);
  const C = ra * ral * rbe;
  const P = plane([-5, 5, -12, 12], [24, 18, 330, 342]);
  const f = (x) => a * (x - al) * (x - be);
  const svgRef = useRef(null);
  const dragging = useRef(null);
  const task = s.task && typeof s.task === 'object' ? s.task : null;
  let done = false;
  if (task) {
    done = true;
    if (task.sum != null && !near(ral + rbe, Number(task.sum))) done = false;
    if (task.product != null && !near(ral * rbe, Number(task.product))) done = false;
    if (task.distinct && near(ral, rbe)) done = false;
  }
  useDone(done, onInteract);

  const toX = (px) => clamp(Math.round((P.x0 + ((px - P.L) / (P.R - P.L)) * (P.x1 - P.x0)) * 2) / 2, -5, 5);
  const onDown = (e) => {
    if (!svgRef.current) return;
    const p = svgPoint(svgRef.current, e);
    const dA = Math.abs(p.x - P.sx(ral));
    const dB = Math.abs(p.x - P.sx(rbe));
    if (Math.min(dA, dB) > 30 || Math.abs(p.y - P.sy(0)) > 40) return;
    dragging.current = dA <= dB ? 'al' : 'be';
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!dragging.current || !svgRef.current) return;
    const p = svgPoint(svgRef.current, e);
    update({ [dragging.current]: toX(p.x) });
  };
  const onUp = () => { dragging.current = null; };

  const rows = [
    { show: true, col: GREEN, t: `zeroes: α = ${fmt(ral)}, β = ${fmt(rbe)}` },
    { show: step >= 1, col: INK, t: `p(x) = ${fmt(ra) === '1' ? '' : fmt(ra)}(x − α)(x − β)` },
    { show: step >= 1, col: SKY, t: `= ${polyStr([ra, B, C])}` },
    { show: step >= 1, col: '#94a3b8', t: `a = ${fmt(ra)}, b = ${fmt(B)}, c = ${fmt(C)}`, small: true },
    { show: step >= 2, col: AMBER, t: `α + β = ${fmt(ral + rbe)}` },
    { show: step >= 2, col: AMBER, t: `−b/a = ${fmt(-B / ra)}  ✔`, small: true },
    { show: step >= 3, col: PINK, t: `αβ = ${fmt(ral * rbe)}` },
    { show: step >= 3, col: PINK, t: `c/a = ${fmt(C / ra)}  ✔`, small: true },
  ];

  return (
    <StoryStage
      eyebrow="Visualizer · Zeroes and coefficients"
      title="Sum of zeroes = −b/a, product = c/a"
      accent="text-emerald-400"
      footer={
        <div className="space-y-3">
          <TaskBanner text={task ? task.text || '' : ''} done={done} />
          <div className="text-xs text-slate-400">Drag the green zeroes along the x-axis.</div>
          <div className="grid grid-cols-2 gap-3">
            <Slider label="leading coefficient a" value={ra} min={-3} max={3} step={0.5} onChange={(v) => update({ a: near(v, 0) ? 0.5 : v })} />
            <ModePills options={[0, 1, 2, 3].map((n) => ({ value: n, label: ['zeroes', 'expand', 'sum', 'product'][n] }))} value={step} onChange={(n) => update({ step: n })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Readout label="α + β" value={fmt(ral + rbe)} tone="text-amber-300" />
            <Readout label="−b/a" value={fmt(-B / ra)} tone="text-amber-300" />
            <Readout label="αβ" value={fmt(ral * rbe)} tone="text-pink-300" />
            <Readout label="c/a" value={fmt(C / ra)} tone="text-pink-300" />
          </div>
        </div>
      }
    >
      <svg ref={svgRef} viewBox="0 0 600 360" className="w-full h-auto select-none touch-none"
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <Grid P={P} id="c10po-g4" yStep={4} />
        <Curve f={f} P={P} clip="c10po-g4" color={SKY} />
        {[['α', al, ral], ['β', be, rbe]].map(([lab, x, rx], i) => (
          <g key={lab} style={{ cursor: 'grab' }}>
            <circle cx={P.sx(x)} cy={P.sy(0)} r="11" fill={GREEN} stroke="#020617" strokeWidth="2" />
            <text x={P.sx(x)} y={P.sy(0) + (i ? 34 : -18) + (near(ral, rbe) && i ? 6 : 0)} textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900">
              {lab} = {fmt(rx)}
            </text>
          </g>
        ))}
        {rows.map((r, i) => (
          <text key={i} x="342" y={44 + i * 38} fill={r.col} fontSize={r.small ? 13 : 16} fontWeight="900" fontFamily="monospace"
            style={{ opacity: r.show ? 1 : 0, transition: `opacity 500ms ease ${r.show ? (i % 4) * 150 : 0}ms` }}>
            {r.t}
          </text>
        ))}
      </svg>
    </StoryStage>
  );
}

// ─── WIDGET 5: Build a quadratic from the sum and product of its zeroes ───
export function Class10PolyBuildWidget({ visual, onInteract }) {
  const [s, update] = useSceneState({ S: 5, P: 6, k: 1, step: 3, task: null }, visual);
  const S = clamp(num(s.S, 5), -6, 6);
  const Pr = clamp(num(s.P, 6), -8, 8);
  const k = clamp(Math.round(num(s.k, 1)), 1, 8);
  const step = clamp(Math.round(num(s.step, 3)), 0, 3);
  const tS = useTween(S);
  const tP = useTween(Pr);
  const tk = useTween(k);
  const G = plane([-5, 7, -10, 10], [312, 18, 588, 342]);
  const f = (x) => tk * (x * x - tS * x + tP);
  const D = S * S - 4 * Pr;
  const zeroes = near(D, 0) ? [S / 2] : D > 0 ? [(S - Math.sqrt(D)) / 2, (S + Math.sqrt(D)) / 2] : [];
  const task = s.task && typeof s.task === 'object' ? s.task : null;
  let done = false;
  if (task && Array.isArray(task.zeroes) && task.zeroes.length === 2) {
    const [p, q] = task.zeroes.map(Number);
    done = near(S, p + q) && near(Pr, p * q) && (task.k == null || k === Number(task.k));
  }
  useDone(done, onInteract);

  const lines = [
    { show: true, y: 46, col: AMBER, size: 20, t: `sum α + β = ${fmt(S)}` },
    { show: true, y: 80, col: PINK, size: 20, t: `product αβ = ${fmt(Pr)}` },
    { show: step >= 1, y: 132, col: '#94a3b8', size: 13, t: 'p(x) = k[x² − (sum)x + product]' },
    { show: step >= 2, y: 172, col: SKY, size: 18, t: `= ${k === 1 ? '' : k}${k === 1 ? '' : '['}${polyStr([1, -S, Pr])}${k === 1 ? '' : ']'}` },
    { show: step >= 2 && k !== 1, y: 208, col: SKY, size: 18, t: `= ${polyStr([k, -k * S, k * Pr])}` },
    { show: step >= 3, y: 258, col: GREEN, size: 16, t: zeroes.length ? `zeroes: ${zeroes.map(fmt).join(' and ')}` : 'no real zeroes' },
    { show: step >= 3 && !zeroes.length, y: 290, col: '#94a3b8', size: 13, t: 'the curve misses the x-axis' },
    { show: step >= 3 && zeroes.length === 2, y: 290, col: '#94a3b8', size: 14, t: zeroes.length === 2 ? `check: ${fmt(zeroes[0])} + ${fmt(zeroes[1])} = ${fmt(S)}` : '' },
  ];

  return (
    <StoryStage
      eyebrow="Visualizer · Forming a quadratic"
      title="From sum and product to the polynomial"
      accent="text-sky-400"
      footer={
        <div className="space-y-3">
          <TaskBanner text={task ? task.text || '' : ''} done={done} />
          <div className="grid grid-cols-3 gap-3">
            <Slider label="sum of zeroes" value={S} min={-6} max={6} step={0.25} onChange={(v) => update({ S: v })} />
            <Slider label="product of zeroes" value={Pr} min={-8} max={8} step={0.25} onChange={(v) => update({ P: v })} tone="text-pink-300" />
            <Slider label="k (any non-zero number)" value={k} min={1} max={8} onChange={(v) => update({ k: v })} tone="text-sky-300" />
          </div>
          <ModePills options={[0, 1, 2, 3].map((n) => ({ value: n, label: ['given', 'rule', 'fill in', 'graph'][n] }))} value={step} onChange={(n) => update({ step: n })} />
        </div>
      }
    >
      <svg viewBox="0 0 600 360" className="w-full h-auto select-none">
        <rect x="10" y="14" width="292" height="332" rx="14" fill="#0f172a" stroke="#1e293b" />
        {lines.map((l, i) => (
          <text key={i} x="24" y={l.y} fill={l.col} fontSize={l.size} fontWeight="900" fontFamily="monospace"
            style={{ opacity: l.show ? 1 : 0, transition: `opacity 500ms ease ${l.show ? i * 120 : 0}ms` }}>
            {l.t}
          </text>
        ))}
        <Grid P={G} id="c10po-g5" xStep={1} yStep={4} />
        <g style={{ opacity: step >= 3 ? 1 : 0.15, transition: 'opacity 600ms ease' }}>
          <Curve f={f} P={G} clip="c10po-g5" color={SKY} width={3.5} />
          {step >= 3 && <ZeroDots zs={zeroes} P={G} labels={false} />}
        </g>
      </svg>
    </StoryStage>
  );
}
