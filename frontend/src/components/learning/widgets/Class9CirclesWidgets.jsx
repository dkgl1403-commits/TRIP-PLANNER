import React, { useState } from 'react';

// ─── WIDGET 1: Perpendicular Bisector from Center (Archery Target Metaphor) ───
export function Class9CirclesPerpendicularBisectorWidget() {
  const [d, setD] = useState(50); // distance from center O to chord (0 to 80)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 90; // circle radius
  const cx = 200;
  const cy = 140;

  // Chord perpendicular distance d along vertical axis (y = cy + d)
  const chordY = cy + d;
  // Half chord length = sqrt(r^2 - d^2)
  const halfChord = Math.sqrt(Math.max(0, r * r - d * d));

  const ax = cx - halfChord;
  const ay = chordY;
  const bx = cx + halfChord;
  const by = chordY;
  const mx = cx;
  const my = chordY;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Archery Target Metaphor</span>
          <h3 className="text-xl font-bold text-white">The Perpendicular Bisector Theorem</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 400 280" className="w-full max-w-md drop-shadow-2xl">
            {/* Circle */}
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Right Triangle OMA Fill */}
            <polygon points={`${cx},${cy} ${mx},${my} ${ax},${ay}`} fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />

            {/* Chord AB */}
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#f59e0b" strokeWidth="3.5" />

            {/* Radius OA */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="2.5" />

            {/* Perpendicular OM */}
            <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#ef4444" strokeWidth="3" />

            {/* 90 degree angle indicator at M */}
            <rect x={mx} y={my - 12} width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="2" />

            {/* Points O, A, B, M */}
            <circle cx={cx} cy={cy} r="5" fill="#38bdf8" />
            <text x={cx - 15} y={cy - 10} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">O (Center)</text>

            <circle cx={ax} cy={ay} r="5" fill="#f59e0b" />
            <text x={ax - 20} y={ay + 20} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">A</text>

            <circle cx={bx} cy={by} r="5" fill="#f59e0b" />
            <text x={bx + 10} y={by + 20} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">B</text>

            <circle cx={mx} cy={my} r="5" fill="#ef4444" />
            <text x={mx + 8} y={my + 20} fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="mono">M (Midpoint)</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Move Center Distance OM (d):</span>
              <span className="text-red-400">{(d / 10).toFixed(1)} cm</span>
            </div>
            <input 
              type="range" min="10" max="80" step="2" value={d} 
              onChange={(e) => setD(parseInt(e.target.value))} 
              className="w-full accent-red-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Info & Live Math */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Core Theorem Statement</span>
            <p className="text-slate-200 leading-relaxed font-sans">
              <em>"The perpendicular dropped from the center of a circle to a chord bisects the chord into two equal halves."</em>
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Half Segment AM:</div>
                <div className="text-base font-bold">{(halfChord / 10).toFixed(2)} cm</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Half Segment MB:</div>
                <div className="text-base font-bold">{(halfChord / 10).toFixed(2)} cm</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              AM = MB = √({(r/10).toFixed(1)}² - {(d/10).toFixed(1)}²) = {(halfChord/10).toFixed(2)} cm ✓
            </div>
          </div>

          <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-sky-300 font-sans space-y-1">
            <span className="font-bold text-sky-400 block">💡 Archery Metaphor:</span>
            Dropping a perpendicular line straight down from the center bullseye O to bowstring AB cuts it into 2 perfectly symmetrical halves AM and MB!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Equal Chords & Distance from Center (Castle Shield Metaphor) ───
export function Class9CirclesEqualChordsWidget() {
  const [chordLen, setChordLen] = useState(120); // chord length (60 to 160)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 90;
  const cx = 200;
  const cy = 140;

  const halfLen = chordLen / 2;
  const distOM = Math.sqrt(Math.max(0, r * r - halfLen * halfLen));

  // Horizontal chord AB at y = cy - distOM
  const aX = cx - halfLen;
  const aY = cy - distOM;
  const bX = cx + halfLen;
  const bY = cy - distOM;

  // Vertical chord CD at x = cx + distOM
  const cX = cx + distOM;
  const cY = cy - halfLen;
  const dX = cx + distOM;
  const dY = cy + halfLen;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Castle Shield Metaphor</span>
          <h3 className="text-xl font-bold text-white">Equal Chords are Equidistant from Center</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 400 280" className="w-full max-w-md drop-shadow-2xl">
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Chord AB (horizontal) */}
            <line x1={aX} y1={aY} x2={bX} y2={bY} stroke="#f59e0b" strokeWidth="3.5" />

            {/* Chord CD (vertical) */}
            <line x1={cX} y1={cY} x2={dX} y2={dY} stroke="#a855f7" strokeWidth="3.5" />

            {/* Distance OM to AB */}
            <line x1={cx} y1={cy} x2={cx} y2={aY} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />

            {/* Distance ON to CD */}
            <line x1={cx} y1={cy} x2={cX} y2={cy} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />

            {/* Center O */}
            <circle cx={cx} cy={cy} r="5" fill="#38bdf8" />
            <text x={cx - 20} y={cy + 15} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">O</text>

            {/* Points A, B, C, D */}
            <text x={aX - 15} y={aY} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="mono">A</text>
            <text x={bX + 5} y={bY} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="mono">B</text>

            <text x={cX} y={cY - 8} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="mono">C</text>
            <text x={dX} y={dY + 15} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="mono">D</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Adjust Chord Length (AB = CD):</span>
              <span className="text-amber-400">{(chordLen / 10).toFixed(1)} cm</span>
            </div>
            <input 
              type="range" min="60" max="160" step="5" value={chordLen} 
              onChange={(e) => setChordLen(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Equal Chords Equidistance</span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Distance OM to AB:</div>
                <div className="text-base font-bold">{(distOM / 10).toFixed(2)} cm</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
                <div>Distance ON to CD:</div>
                <div className="text-base font-bold">{(distOM / 10).toFixed(2)} cm</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              AB = CD = {(chordLen/10).toFixed(1)} cm  ==&gt;  OM = ON = {(distOM/10).toFixed(2)} cm ✓
            </div>
          </div>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 font-sans space-y-1">
            <span className="font-bold text-purple-400 block">💡 Castle Shield Metaphor:</span>
            Two equal defensive ropes AB and CD must sit at the exact same perpendicular distance OM = ON from the royal keep center O!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Star Trek Central Angle Theorem (∠AOB = 2 · ∠ACB) ───
export function Class9CirclesStarTrekAngleWidget() {
  const [cPosAngle, setCPosAngle] = useState(90); // angle of boundary point C (30 to 150)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const r = 85;
  const cx = 160;
  const cy = 150;

  // Fixed arc endpoints A (bottom left) and B (bottom right)
  const aAngle = 210 * (Math.PI / 180);
  const bAngle = 330 * (Math.PI / 180);

  const ax = cx + r * Math.cos(aAngle);
  const ay = cy - r * Math.sin(aAngle);

  const bx = cx + r * Math.cos(bAngle);
  const by = cy - r * Math.sin(bAngle);

  // Boundary point C along upper arc
  const cRad = cPosAngle * (Math.PI / 180);
  const cxPt = cx + r * Math.cos(cRad);
  const cyPt = cy - r * Math.sin(cRad);

  // Central angle = 120 deg
  const centralAngle = 120;
  const boundaryAngle = 60;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Star Trek Emblem Metaphor</span>
          <h3 className="text-xl font-bold text-white">Central Angle Theorem: ∠AOB = 2 · ∠ACB</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 280" className="w-full max-w-md drop-shadow-2xl">
            <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

            {/* Central Angle Delta OA, OB */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="3" />
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#38bdf8" strokeWidth="3" />

            {/* Inscribed Angle Lines CA, CB (Star Trek Insignia Shape) */}
            <line x1={cxPt} y1={cyPt} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth="2.5" />
            <line x1={cxPt} y1={cyPt} x2={bx} y2={by} stroke="#f59e0b" strokeWidth="2.5" />

            {/* Points O, A, B, C */}
            <circle cx={cx} cy={cy} r="6" fill="#38bdf8" />
            <text x={cx - 15} y={cy + 20} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">O (Center: 120°)</text>

            <circle cx={ax} cy={ay} r="5" fill="#e2e8f0" />
            <text x={ax - 15} y={ay + 15} fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="mono">A</text>

            <circle cx={bx} cy={by} r="5" fill="#e2e8f0" />
            <text x={bx + 5} y={by + 15} fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="mono">B</text>

            <circle cx={cxPt} cy={cyPt} r="6" fill="#f59e0b" />
            <text x={cxPt - 10} y={cyPt - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">C ({boundaryAngle}°)</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Drag Boundary Point C Along Arc:</span>
              <span className="text-amber-400">{cPosAngle}°</span>
            </div>
            <input 
              type="range" min="45" max="135" step="2" value={cPosAngle} 
              onChange={(e) => setCPosAngle(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Live Angle Relationship</span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
                <div>Central Angle ∠AOB:</div>
                <div className="text-base font-bold">{centralAngle}°</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Boundary Angle ∠ACB:</div>
                <div className="text-base font-bold">{boundaryAngle}°</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              ∠AOB = 2 · ∠ACB  ==&gt;  {centralAngle}° = 2 × {boundaryAngle}° ✓
            </div>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 font-sans space-y-1">
            <span className="font-bold text-amber-400 block">💡 Invariance Principle:</span>
            No matter where you drag Point C along the top segment, boundary angle ∠ACB remains strictly <strong>60°</strong> (half of central angle 120°)!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: Cyclic Quadrilateral (Ferris Wheel Cage Metaphor) ───
export function Class9CirclesCyclicQuadWidget() {
  const [angleA, setAngleA] = useState(85); // Angle A (60 to 120)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const angleC = 180 - angleA;
  const angleB = 95;
  const angleD = 180 - angleB;

  const r = 85;
  const cx = 160;
  const cy = 140;

  // 4 Vertices on boundary
  const ax = cx - r * 0.7;
  const ay = cy - r * 0.7;
  const bx = cx + r * 0.8;
  const by = cy - r * 0.6;
  const cxPt = cx + r * 0.7;
  const cyPt = cy + r * 0.7;
  const dxPt = cx - r * 0.8;
  const dyPt = cy + r * 0.6;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Ferris Wheel Cage Metaphor</span>
          <h3 className="text-xl font-bold text-white">Cyclic Quadrilaterals: Opposite Angles = 180°</h3>
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

            {/* Quadrilateral ABCD */}
            <polygon points={`${ax},${ay} ${bx},${by} ${cxPt},${cyPt} ${dxPt},${dyPt}`} fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="3" />

            {/* Vertices */}
            <circle cx={ax} cy={ay} r="6" fill="#f59e0b" />
            <text x={ax - 15} y={ay - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">A ({angleA}°)</text>

            <circle cx={bx} cy={by} r="6" fill="#ec4899" />
            <text x={bx + 10} y={by - 10} fill="#ec4899" fontSize="13" fontWeight="bold" fontFamily="mono">B ({angleB}°)</text>

            <circle cx={cxPt} cy={cyPt} r="6" fill="#f59e0b" />
            <text x={cxPt + 10} y={cyPt + 15} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">C ({angleC}°)</text>

            <circle cx={dxPt} cy={dyPt} r="6" fill="#ec4899" />
            <text x={dxPt - 25} y={dyPt + 15} fill="#ec4899" fontSize="13" fontWeight="bold" fontFamily="mono">D ({angleD}°)</text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Adjust Vertex Angle ∠A:</span>
              <span className="text-amber-400">{angleA}°</span>
            </div>
            <input 
              type="range" min="60" max="120" step="2" value={angleA} 
              onChange={(e) => setAngleA(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Info & Math */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Opposite Angles Balance</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Pair 1 (∠A + ∠C):</div>
              <div className="text-base font-bold">{angleA}° + {angleC}° = 180° ✓</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-pink-500/30 text-pink-400">
              <div>Pair 2 (∠B + ∠D):</div>
              <div className="text-base font-bold">{angleB}° + {angleD}° = 180° ✓</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Sum of Opposite Angles = 180° (Supplementary)
            </div>
          </div>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 font-sans space-y-1">
            <span className="font-bold text-purple-400 block">💡 Ferris Wheel Metaphor:</span>
            In a circular passenger cage, opposite seats A and C always balance each other to exactly 180°!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 9 Circles Master MCQ Exam (80% Pass Mark) ───
export function Class9CirclesMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "The perpendicular dropped from the center of a circle to a chord:",
      options: ["A) Trisection the chord", "B) Bisects the chord", "C) Is parallel to chord", "D) Equals the radius"],
      correctIdx: 1,
      explanation: "Theorem 1 states that the perpendicular from center to a chord bisects the chord into two equal halves."
    },
    {
      id: 2,
      text: "If a chord AB = 16 cm is at a perpendicular distance of 6 cm from center O, what is the radius of the circle?",
      options: ["A) 8 cm", "B) 10 cm", "C) 12 cm", "D) 14 cm"],
      correctIdx: 1,
      explanation: "Half chord AM = 16 / 2 = 8 cm. Radius r = √(8² + 6²) = √(64 + 36) = √100 = 10 cm."
    },
    {
      id: 3,
      text: "If two chords of a circle are equal in length, what can be said about their distances from the center?",
      options: ["A) They are unequal", "B) They are equidistant from center", "C) One is double the other", "D) Sum of distances is zero"],
      correctIdx: 1,
      explanation: "Theorem 2 states that equal chords of a circle are equidistant from the center (OM = ON)."
    },
    {
      id: 4,
      text: "If an arc subtends an angle of 110° at the center of a circle, what angle does it subtend at any point on the remaining circumference?",
      options: ["A) 220°", "B) 110°", "C) 55°", "D) 90°"],
      correctIdx: 2,
      explanation: "By the Central Angle Theorem, boundary angle = (Central Angle) / 2 = 110° / 2 = 55°."
    },
    {
      id: 5,
      text: "Angles subtended by an arc in the same segment of a circle are:",
      options: ["A) Supplementary", "B) Equal", "C) Complementary", "D) Doubled"],
      correctIdx: 1,
      explanation: "Angles in the same segment of a circle are always equal."
    },
    {
      id: 6,
      text: "What is the measure of an angle subtended by a diameter in a semicircle?",
      options: ["A) 45°", "B) 60°", "C) 90°", "D) 180°"],
      correctIdx: 2,
      explanation: "The angle in a semicircle is always a right angle (90°)."
    },
    {
      id: 7,
      text: "In a cyclic quadrilateral ABCD, if ∠A = 70°, what is the measure of opposite angle ∠C?",
      options: ["A) 70°", "B) 110°", "C) 90°", "D) 140°"],
      correctIdx: 1,
      explanation: "Opposite angles of a cyclic quadrilateral are supplementary: ∠C = 180° - 70° = 110°."
    },
    {
      id: 8,
      text: "If all four vertices of a quadrilateral lie on a circle, the quadrilateral is called:",
      options: ["A) Parallelogram", "B) Cyclic quadrilateral", "C) Rhombus", "D) Trapezoid"],
      correctIdx: 1,
      explanation: "A quadrilateral whose vertices all lie on a circle is defined as a cyclic quadrilateral."
    },
    {
      id: 9,
      text: "How many circles can pass through three non-collinear points?",
      options: ["A) Infinite", "B) Exactly 1", "C) 2", "D) 0"],
      correctIdx: 1,
      explanation: "There is one and only one circle passing through three given non-collinear points."
    },
    {
      id: 10,
      text: "If two equal chords intersect inside a circle, the segments of one chord are respectively equal to:",
      options: ["A) The radius", "B) Corresponding segments of the other chord", "C) The diameter", "D) Half the circumference"],
      correctIdx: 1,
      explanation: "If two equal chords intersect within a circle, the corresponding segments of one chord equal those of the other."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 9 Circles Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 9 Board Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Class 9 Circles badge!
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
          <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-500 to-sky-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-sans">
              <span className="text-amber-400 font-bold text-xs">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-slate-400 text-xs">Required: 80%+</span>
            </div>

            <h3 className="text-base font-bold text-white font-sans leading-relaxed">{currentQ.text}</h3>

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
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 ${isPassed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
            <span className="text-4xl">{isPassed ? '🎓' : '⚠️'}</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Class 9 Circles Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified Class 9 Circles! You are now fully prepared for Class 10 Circles.</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the internal theorems and retake the exam to earn your 80% completion badge.</span>
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
