import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ─── Shared building blocks for scene-driven story widgets ───
// A story widget receives `visual` (the current scene's visual state from the lesson config)
// and `onInteract` (call it when the learner finishes a "your turn" task).

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Smoothly animates a number towards `target`. Returns the current (in-between) value.
export function useTween(target, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const valueRef = useRef(target);

  useEffect(() => {
    fromRef.current = valueRef.current;
    if (fromRef.current === target) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration)); // rAF time can be slightly before `start`
      const v = fromRef.current + (target - fromRef.current) * easeInOutCubic(t);
      valueRef.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

// Merges scene-driven state with learner-driven state. When a new scene arrives, the scene wins;
// when the learner drags/clicks, their change wins until the next scene.
export function useSceneState(defaults, visual) {
  const [state, setState] = useState({ ...defaults, ...(visual || {}) });
  const key = JSON.stringify(visual || {});
  useEffect(() => {
    setState({ ...defaults, ...(visual || {}) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = (patch) => setState((s) => ({ ...s, ...patch }));
  return [state, update];
}

// Geometry helpers (SVG y-axis points down, so maths angles are flipped)
export const toRad = (deg) => (deg * Math.PI) / 180;
export const polar = (cx, cy, r, deg) => [cx + r * Math.cos(toRad(deg)), cy - r * Math.sin(toRad(deg))];

export function arcPath(cx, cy, r, fromDeg, toDeg) {
  const sweep = toDeg - fromDeg;
  if (Math.abs(sweep) < 0.01) return '';
  if (Math.abs(sweep) >= 359.99) {
    const [x1, y1] = polar(cx, cy, r, fromDeg);
    const [x2, y2] = polar(cx, cy, r, fromDeg + 180);
    return `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2} A ${r} ${r} 0 1 0 ${x1} ${y1}`;
  }
  const [x1, y1] = polar(cx, cy, r, fromDeg);
  const [x2, y2] = polar(cx, cy, r, toDeg);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const dir = sweep > 0 ? 0 : 1;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${dir} ${x2} ${y2}`;
}

export function sectorPath(cx, cy, r, fromDeg, toDeg) {
  if (Math.abs(toDeg - fromDeg) < 0.01) return '';
  if (Math.abs(toDeg - fromDeg) >= 359.99) return `${arcPath(cx, cy, r, fromDeg, toDeg)} Z`;
  return `M ${cx} ${cy} L ${polar(cx, cy, r, fromDeg).join(' ')} ${arcPath(cx, cy, r, fromDeg, toDeg).replace(/^M [^A]+/, '')} Z`;
}

// Converts a pointer event to SVG viewBox coordinates
export function svgPoint(svg, evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// Drag helper: calls onMove(x, y) in SVG coordinates while the pointer is held down
export function useSvgDrag(svgRef, onMove) {
  const dragging = useRef(false);
  const start = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };
  const move = (e) => {
    if (!dragging.current || !svgRef.current) return;
    const p = svgPoint(svgRef.current, e);
    onMove(p.x, p.y);
  };
  const end = () => { dragging.current = false; };
  return { onPointerDown: start, onPointerMove: move, onPointerUp: end, onPointerCancel: end };
}

// Provided by LessonEngine: fullscreen then covers the whole visual column (story controls included)
export const StageFullscreenContext = createContext(null);

// Standard frame for every story widget: title strip, fullscreen toggle, stage, optional footer
export function StoryStage({ eyebrow, title, children, footer, accent = 'text-amber-400' }) {
  const host = useContext(StageFullscreenContext);
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = host ? host.fullscreen : localFullscreen;
  const setIsFullscreen = host ? () => host.toggle() : setLocalFullscreen;
  const selfFixed = isFullscreen && !host;
  return (
    <div className={`w-full flex flex-col p-4 md:p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${selfFixed ? 'fixed inset-0 z-[200] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl'}`}>
      <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-3 gap-3">
        <div className="min-w-0">
          {eyebrow && <span className={`${accent} font-bold uppercase text-[11px] tracking-wider block font-mono`}>{eyebrow}</span>}
          <h3 className="text-lg md:text-xl font-bold text-white truncate">{title}</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? '✕ Exit Fullscreen (Esc)' : 'Fullscreen'}
        </button>
      </div>
      <div className={`bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden ${selfFixed ? 'flex-grow flex items-center justify-center' : ''}`}>
        {children}
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

// Pill-shaped segmented control used by widgets for modes
export function ModePills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${value === o.value ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Big friendly readout used under diagrams ("∠AOB = 47°")
export function Readout({ label, value, tone = 'text-emerald-400' }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className={`text-lg font-black font-mono ${tone}`}>{value}</div>
    </div>
  );
}

// Fades/zooms children in whenever `show` turns true
export function Reveal({ show, children, delay = 0 }) {
  return (
    <g style={{ opacity: show ? 1 : 0, transition: `opacity 600ms ease ${delay}ms`, pointerEvents: show ? 'auto' : 'none' }}>
      {children}
    </g>
  );
}

// ─── Shared drawing palette and SVG pieces for story diagrams ───
export const INK = '#e2e8f0';
export const AMBER = '#fbbf24';
export const SKY = '#38bdf8';
export const GREEN = '#34d399';
export const PINK = '#f472b6';
export const PURPLE = '#a78bfa';
export const RED = '#f87171';

export function Arrowhead({ x, y, deg, color = INK, size = 12 }) {
  const [x1, y1] = polar(x, y, size, deg + 150);
  const [x2, y2] = polar(x, y, size, deg - 150);
  return <polygon points={`${x},${y} ${x1},${y1} ${x2},${y2}`} fill={color} />;
}

export function Dot({ x, y, label, color = AMBER, dx = -6, dy = -14, r = 6, pulse }) {
  return (
    <g>
      {pulse && (
        <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2">
          <animate attributeName="r" values={`${r};${r * 4}`} dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={r} fill={color} />
      {label && <text x={x + dx} y={y + dy} fill={color} fontSize="18" fontWeight="800" fontFamily="sans-serif">{label}</text>}
    </g>
  );
}

export function RightAngleMark({ cx, cy, deg, size = 18, color = SKY }) {
  const [ax, ay] = polar(cx, cy, size, deg);
  const [bx, by] = polar(cx, cy, size, deg + 90);
  const [mx, my] = [ax + bx - cx, ay + by - cy];
  return <polyline points={`${ax},${ay} ${mx},${my} ${bx},${by}`} fill="none" stroke={color} strokeWidth="2.5" />;
}

export function TaskBanner({ text, done }) {
  if (!text) return null;
  return (
    <div className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${done ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300' : 'bg-amber-500/10 border-amber-400/60 text-amber-200'}`}>
      {done ? '✔ ' : '👉 '}{text}
    </div>
  );
}
