import React, { useState } from 'react';

// ─── WIDGET 1: Theorem 1 — Radius ⊥ Tangent (90° Perpendicular Rule) ───
export function Class10CirclesTangentRadiusWidget() {
  const [angle, setAngle] = useState(45); // angle in degrees around center (0 to 360)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rad = (angle * Math.PI) / 180;
  const r = 90; // circle radius
  const cx = 200;
  const cy = 150;

  // Tangent point A on circle
  const ax = cx + r * Math.cos(rad);
  const ay = cy + r * Math.sin(rad);

  // Tangent direction is perpendicular to radius vector (cx->ax, cy->ay)
  // Radius vector: (r*cos, r*sin)
  // Perpendicular vector: (-r*sin, r*cos)
  const perpX = -Math.sin(rad);
  const perpY = Math.cos(rad);

  const t1x = ax - 120 * perpX;
  const t1y = ay - 120 * perpY;
  const t2x = ax + 120 * perpX;
  const t2y = ay + 120 * perpY;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Theorem 1 Visualizer</span>
          <h3 className="text-xl font-bold text-white">The Right Angle Rule: Radius ⊥ Tangent (90°)</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* Interactive SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full max-w-sm drop-shadow-2xl">
            {/* Background Circle */}
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />
            
            {/* Tangent Line */}
            <line x1={t1x} y1={t1y} x2={t2x} y2={t2y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

            {/* Radius Line (O to A) */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="3" />

            {/* Center O */}
            <circle cx={cx} cy={cy} r="6" fill="#38bdf8" />
            <text x={cx - 20} y={cy - 10} fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="mono">O (Center)</text>

            {/* Point of Contact A */}
            <circle cx={ax} cy={ay} r="6" fill="#f59e0b" />
            <text x={ax + 10} y={ay + 15} fill="#f59e0b" fontSize="14" fontWeight="bold" fontFamily="mono">A (Contact)</text>

            {/* 90 Degree Angle Indicator Symbol */}
            <rect 
              x={ax - 8} y={ay - 8} width="16" height="16" 
              fill="none" stroke="#ef4444" strokeWidth="2" 
              transform={`rotate(${angle + 90}, ${ax}, ${ay})`} 
            />
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Rotate Tangent Contact Point A:</span>
              <span className="text-amber-400">{angle}°</span>
            </div>
            <input 
              type="range" min="0" max="360" step="5" value={angle} 
              onChange={(e) => setAngle(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block">Core Theorem Statement</span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              <em>"The tangent at any point of a circle is perpendicular to the radius through the point of contact."</em>
            </p>
            <div className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs font-bold text-center border border-slate-800">
              OA ⊥ Line (Tangent)  ==&gt;  ∠OAP = 90°
            </div>
          </div>

          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 font-sans space-y-1">
            <span className="font-bold block text-red-400">💡 Board Exam Pro-Tip:</span>
            Whenever a question gives you the Center O and a Tangent at point A, immediately connect OA and mark the angle as <strong>90°</strong>. Use Pythagorean theorem ($OP^2 = OA^2 + AP^2$) to solve for missing lengths!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Theorem 2 — External Point Equal Tangents (PA = PB) ───
export function Class10CirclesExternalPointWidget() {
  const [distP, setDistP] = useState(200); // distance of external point P from center O
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 80;
  const cx = 160;
  const cy = 150;

  // External Point P along horizontal axis
  const px = cx + distP;
  const py = cy;

  // Tangent lengths using Pythagorean Theorem: PA = sqrt(OP^2 - r^2)
  const tangentLen = Math.sqrt(distP * distP - r * r);
  const angleO = Math.acos(r / distP); // angle inside right triangle OAP

  // Contact points A (top) and B (bottom)
  const ax = cx + r * Math.cos(angleO);
  const ay = cy - r * Math.sin(angleO);

  const bx = cx + r * Math.cos(angleO);
  const by = cy + r * Math.sin(angleO);

  const angleAPO = ((Math.asin(r / distP) * 180) / Math.PI).toFixed(1);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Theorem 2 Visualizer</span>
          <h3 className="text-xl font-bold text-white">The External Point Rule: Twin Tangents PA = PB</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* Interactive SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 420 300" className="w-full max-w-md drop-shadow-2xl">
            {/* Circle */}
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Triangles Fill */}
            <polygon points={`${cx},${cy} ${ax},${ay} ${px},${py}`} fill="#0284c7" fillOpacity="0.15" />
            <polygon points={`${cx},${cy} ${bx},${by} ${px},${py}`} fill="#818cf8" fillOpacity="0.15" />

            {/* Radii OA, OB */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="2.5" />
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#38bdf8" strokeWidth="2.5" />

            {/* Tangents PA, PB */}
            <line x1={px} y1={py} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth="3.5" />
            <line x1={px} y1={py} x2={bx} y2={by} stroke="#ec4899" strokeWidth="3.5" />

            {/* Line OP (bisector) */}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />

            {/* Points O, P, A, B */}
            <circle cx={cx} cy={cy} r="5" fill="#38bdf8" />
            <text x={cx - 20} y={cy + 5} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">O</text>

            <circle cx={px} cy={py} r="6" fill="#e2e8f0" />
            <text x={px + 10} y={py + 5} fill="#e2e8f0" fontSize="14" fontWeight="bold" fontFamily="mono">P (External)</text>

            <circle cx={ax} cy={ay} r="5" fill="#f59e0b" />
            <text x={ax - 5} y={ay - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">A</text>

            <circle cx={bx} cy={by} r="5" fill="#ec4899" />
            <text x={bx - 5} y={by + 20} fill="#ec4899" fontSize="13" fontWeight="bold" fontFamily="mono">B</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Move External Point P Distance (OP):</span>
              <span className="text-amber-400">{(distP / 10).toFixed(1)} cm</span>
            </div>
            <input 
              type="range" min="110" max="230" step="5" value={distP} 
              onChange={(e) => setDistP(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Live Calculation Info */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block">Live Geometric Proof</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Tangent PA:</div>
                <div className="text-base font-bold">{(tangentLen / 10).toFixed(2)} cm</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-pink-500/30 text-pink-400">
                <div>Tangent PB:</div>
                <div className="text-base font-bold">{(tangentLen / 10).toFixed(2)} cm</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-mono font-bold text-center">
              PA = PB = √({(distP/10).toFixed(1)}² - {(r/10).toFixed(1)}²) = {(tangentLen/10).toFixed(2)} cm
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans space-y-1">
            <span className="font-bold text-amber-400 block">RHS Congruence Rule:</span>
            ΔOAP ≅ ΔOBP because OA = OB (radii), OP = OP (common hypotenuse), and ∠OAP = ∠OBP = 90°.
            Line OP also bisects the angle ∠APB (∠APO = ∠BPO = {angleAPO}°).
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Theorem 3 — Tangent-Secant Power Theorem (PT² = PA · PB) ───
export function Class10CirclesTangentSecantWidget() {
  const [secantAngle, setSecantAngle] = useState(25); // angle of secant line
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 75;
  const cx = 160;
  const cy = 150;
  const op = 180;
  const px = cx + op;
  const py = cy;

  // Tangent PT length
  const ptLen = Math.sqrt(op * op - r * r);
  const ptAngle = Math.asin(r / op);
  const tx = cx + r * Math.sin(ptAngle);
  const ty = cy - r * Math.cos(ptAngle);

  // Secant line intersects circle at A and B
  // Parametric line from P: (px - d*cos(θ), py - d*sin(θ))
  const radSec = (secantAngle * Math.PI) / 180;
  const dx = Math.cos(radSec);
  const dy = Math.sin(radSec);

  // Distance from center to secant line = |(px - cx)*dy - (py - cy)*dx| = op*sin(θ)
  const dCenter = op * Math.sin(radSec);
  const chordHalf = Math.sqrt(Math.max(0, r * r - dCenter * dCenter));
  const dMid = op * Math.cos(radSec);

  const distPA = dMid - chordHalf;
  const distPB = dMid + chordHalf;

  const ax = px - distPA * dx;
  const ay = py - distPA * dy;
  const bx = px - distPB * dx;
  const by = py - distPB * dy;

  const ptSquare = (ptLen * ptLen / 100).toFixed(1);
  const paTimesPb = ((distPA * distPB) / 100).toFixed(1);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Theorem 3 Visualizer</span>
          <h3 className="text-xl font-bold text-white">Tangent-Secant Power Theorem: PT² = PA · PB</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Stage */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 400 280" className="w-full max-w-md drop-shadow-2xl">
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Tangent PT */}
            <line x1={px} y1={py} x2={tx} y2={ty} stroke="#f59e0b" strokeWidth="3.5" />

            {/* Secant PAB */}
            <line x1={px} y1={py} x2={bx} y2={by} stroke="#a855f7" strokeWidth="3" />

            {/* Points */}
            <circle cx={px} cy={py} r="6" fill="#e2e8f0" />
            <text x={px + 10} y={py + 5} fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="mono">P</text>

            <circle cx={tx} cy={ty} r="5" fill="#f59e0b" />
            <text x={tx - 10} y={ty - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">T (Tangent)</text>

            <circle cx={ax} cy={ay} r="5" fill="#a855f7" />
            <text x={ax + 5} y={ay - 10} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="mono">A</text>

            <circle cx={bx} cy={by} r="5" fill="#a855f7" />
            <text x={bx - 15} y={by + 15} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="mono">B</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Adjust Secant Angle θ:</span>
              <span className="text-purple-400">{secantAngle}°</span>
            </div>
            <input 
              type="range" min="2" max="24" step="1" value={secantAngle} 
              onChange={(e) => setSecantAngle(parseInt(e.target.value))} 
              className="w-full accent-purple-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Power of Point Verification</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>PT² (Tangent Square):</div>
              <div className="text-base font-bold">{(ptLen/10).toFixed(2)}² = {ptSquare}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
              <div>PA · PB (Secant Segments):</div>
              <div className="text-base font-bold">{(distPA/10).toFixed(2)} × {(distPB/10).toFixed(2)} = {paTimesPb}</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-bold text-center">
              PT² = PA · PB = {ptSquare} ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: Theorem 4 — Alternate Segment Theorem (∠BAT = ∠BCA) ───
export function Class10CirclesAlternateSegmentWidget() {
  const [cAngle, setCAngle] = useState(130); // angle of point C on alternate segment
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 85;
  const cx = 160;
  const cy = 140;

  // Tangent point A at bottom (270 degrees = 90 deg down)
  const ax = cx;
  const ay = cy + r;

  // Chord AB endpoint B (say at 30 degrees)
  const bx = cx + r * Math.cos((30 * Math.PI) / 180);
  const by = cy - r * Math.sin((30 * Math.PI) / 180);

  // Point C on major arc (alternate segment)
  const radC = (cAngle * Math.PI) / 180;
  const cxPt = cx + r * Math.cos(radC);
  const cyPt = cy - r * Math.sin(radC);

  // Tangent line AT horizontal at bottom
  const tLeft = ax - 100;
  const tRight = ax + 100;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Theorem 4 Visualizer</span>
          <h3 className="text-xl font-bold text-white">Alternate Segment Theorem: ∠BAT = ∠BCA</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Stage */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 280" className="w-full max-w-md drop-shadow-2xl">
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Tangent AT */}
            <line x1={tLeft} y1={ay} x2={tRight} y2={ay} stroke="#f59e0b" strokeWidth="3" />

            {/* Triangle ABC */}
            <polygon points={`${ax},${ay} ${bx},${by} ${cxPt},${cyPt}`} fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="2.5" />

            {/* Points A, B, C */}
            <circle cx={ax} cy={ay} r="6" fill="#f59e0b" />
            <text x={ax - 5} y={ay + 20} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">A (Contact)</text>

            <circle cx={bx} cy={by} r="5" fill="#e2e8f0" />
            <text x={bx + 10} y={by} fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="mono">B</text>

            <circle cx={cxPt} cy={cyPt} r="6" fill="#38bdf8" />
            <text x={cxPt - 15} y={cyPt - 10} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">C</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Move Point C Along Alternate Arc:</span>
              <span className="text-sky-400">{cAngle}°</span>
            </div>
            <input 
              type="range" min="70" max="170" step="2" value={cAngle} 
              onChange={(e) => setCAngle(parseInt(e.target.value))} 
              className="w-full accent-sky-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Theorem Statement</span>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              <em>"The angle between a tangent and a chord through the point of contact is equal to the angle subtended by the chord in the alternate segment."</em>
            </p>
            <div className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs font-bold text-center border border-slate-800">
              ∠BAT = ∠BCA = 60° (Constantly Invariant!)
            </div>
          </div>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs text-purple-300 font-sans space-y-1">
            <span className="font-bold text-purple-400 block">💡 ICSE & State Board Shortcut:</span>
            No matter where Point C moves along the top arc, angle ∠BCA stays strictly equal to angle ∠BAT made by the tangent at point A!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 10 Circles Master MCQ Exam (80% Pass Mark) ───
export function Class10CirclesMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How many tangents can be drawn to a circle from a point lying strictly OUTSIDE the circle?",
      options: ["A) 1", "B) 2", "C) Infinite", "D) 0"],
      correctIdx: 1,
      explanation: "From an external point, exactly TWO tangents can be drawn to a circle."
    },
    {
      id: 2,
      text: "A tangent PA is drawn from point P to a circle with center O and radius 5 cm. If OP = 13 cm, what is the length of tangent PA?",
      options: ["A) 12 cm", "B) 10 cm", "C) 14 cm", "D) 8 cm"],
      correctIdx: 0,
      explanation: "Using Theorem 1 (∠OAP = 90°), by Pythagorean Theorem: PA = √(OP² - OA²) = √(13² - 5²) = √(169 - 25) = √144 = 12 cm."
    },
    {
      id: 3,
      text: "According to Theorem 2, if PA and PB are two tangents drawn from an external point P to a circle, what is the relationship between PA and PB?",
      options: ["A) PA = 2 · PB", "B) PA = PB", "C) PA + PB = OP", "D) PA · PB = r²"],
      correctIdx: 1,
      explanation: "Theorem 2 proves that tangent lengths drawn from an external point are equal: PA = PB."
    },
    {
      id: 4,
      text: "If a quadrilateral ABCD circumscribes a circle, which of the following side relationships is ALWAYS true?",
      options: ["A) AB + BC = CD + DA", "B) AB + CD = AD + BC", "C) AB · CD = AD · BC", "D) AB² + CD² = AC²"],
      correctIdx: 1,
      explanation: "For a circumscribed quadrilateral, the sums of opposite sides are equal: AB + CD = AD + BC."
    },
    {
      id: 5,
      text: "Two concentric circles have radii 5 cm and 3 cm. What is the length of the chord of the larger circle that touches the smaller circle?",
      options: ["A) 4 cm", "B) 6 cm", "C) 8 cm", "D) 10 cm"],
      correctIdx: 2,
      explanation: "Half-chord = √(5² - 3²) = √(25 - 9) = 4 cm. Full chord length = 2 × 4 = 8 cm."
    },
    {
      id: 6,
      text: "What is the angle between the radius of a circle and the tangent at the point of contact?",
      options: ["A) 45°", "B) 60°", "C) 90°", "D) 180°"],
      correctIdx: 2,
      explanation: "Theorem 1 states that radius and tangent are strictly perpendicular (90°) at the point of contact."
    },
    {
      id: 7,
      text: "If a tangent PT = 6 cm and a secant line PAB has external segment PA = 4 cm, what is the full length of secant segment PB according to Theorem 3?",
      options: ["A) 9 cm", "B) 8 cm", "C) 12 cm", "D) 10 cm"],
      correctIdx: 0,
      explanation: "By Tangent-Secant Theorem: PT² = PA · PB ==> 6² = 4 · PB ==> 36 = 4 · PB ==> PB = 9 cm."
    },
    {
      id: 8,
      text: "If two tangents PA and PB inclined at an angle of 60° are drawn to a circle of radius 3 cm, what is the length of each tangent?",
      options: ["A) 3 cm", "B) 3√3 cm", "C) 6 cm", "D) √3 cm"],
      correctIdx: 1,
      explanation: "Line OP bisects ∠APB into 30°. In right ΔOAP, tan(30°) = OA / PA ==> 1/√3 = 3 / PA ==> PA = 3√3 cm."
    },
    {
      id: 9,
      text: "According to the Alternate Segment Theorem, the angle between a tangent and a chord equals:",
      options: ["A) The angle at the center", "B) The angle in the alternate segment", "C) 90° always", "D) Half the central angle"],
      correctIdx: 1,
      explanation: "The Alternate Segment Theorem states that the tangent-chord angle equals the angle subtended by the chord in the alternate segment."
    },
    {
      id: 10,
      text: "If PA and PB are tangents to a circle with center O such that ∠APB = 80°, what is ∠AOB?",
      options: ["A) 100°", "B) 80°", "C) 90°", "D) 120°"],
      correctIdx: 0,
      explanation: "In quadrilateral OAPB, ∠OAP = ∠OBP = 90°. Thus ∠AOB + ∠APB = 180° ==> ∠AOB = 180° - 80° = 100°."
    }
  ];

  const passingThreshold = 80;
  const passScore = Math.ceil((questions.length * passingThreshold) / 100);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsAnswered(false);
    setIsSubmitted(false);
  };

  const currentQ = questions[currentIdx];
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= passingThreshold;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono font-sans">Class 10 Circles Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white font-sans">Class 10 Board Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm font-sans">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Circles Chapter badge!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold text-xs rounded-xl">
            Score: {score} / {questions.length}
          </span>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all">
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {!isSubmitted ? (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-500 to-sky-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>

          {/* Question Card */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-sans">
              <span className="text-amber-400 font-bold text-xs">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-slate-400 text-xs">Required: 80%+</span>
            </div>

            <h3 className="text-base font-bold text-white font-sans leading-relaxed">{currentQ.text}</h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800';
                if (isAnswered) {
                  if (idx === currentQ.correctIdx) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold shadow-lg';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                  } else {
                    btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-xl border text-left font-sans text-xs transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {isAnswered && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-sans">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <span>💡 Step-by-Step Solution:</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{currentQ.explanation}</p>
                <div className="pt-2 flex justify-end">
                  <button onClick={handleNextQuestion} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg">
                    {currentIdx < questions.length - 1 ? 'Next Question →' : 'Submit & Check Result'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Results Screen */
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 ${isPassed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
            <span className="text-4xl">{isPassed ? '🎓' : '⚠️'}</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Class 10 Circles Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified and completed Class 10 Circles!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the 4 theorems and retake the exam to earn your 80% completion badge.</span>
            )}
          </div>

          <button onClick={handleRestart} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl">
            Retake Qualification Exam 🔄
          </button>
        </div>
      )}
    </div>
  );
}
