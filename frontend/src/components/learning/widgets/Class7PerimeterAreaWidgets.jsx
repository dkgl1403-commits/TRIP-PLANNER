import React, { useState } from 'react';

// ─── WIDGET 1: Squares & Rectangles — Boundary vs Surface (Fencing & Tiling Metaphor) ───
export function Class7RectSquareAreaWidget() {
  const [length, setLength] = useState(8); // length in meters (4 to 12)
  const [width, setWidth] = useState(5);   // width in meters (3 to 10)
  const [isSquare, setIsSquare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const effectiveL = isSquare ? length : length;
  const effectiveW = isSquare ? length : width;

  const perimeter = 2 * (effectiveL + effectiveW);
  const area = effectiveL * effectiveW;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Fencing & Tiling Metaphor</span>
          <h3 className="text-xl font-bold text-white">Rectangle & Square: Boundary vs. Surface</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* Visual Stage */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Grid background tiles inside rectangle */}
            <rect 
              x={40} y={30} 
              width={effectiveL * 22} height={effectiveW * 20} 
              fill="#0284c7" fillOpacity="0.25" 
              stroke="#38bdf8" strokeWidth="3" 
            />

            {/* Fence border animated dashed outline */}
            <rect 
              x={36} y={26} 
              width={effectiveL * 22 + 8} height={effectiveW * 20 + 8} 
              fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" 
            />

            {/* Labels */}
            <text x={40 + (effectiveL * 22) / 2 - 25} y={20} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">
              Length = {effectiveL} m
            </text>

            <text x={effectiveL * 22 + 48} y={30 + (effectiveW * 20) / 2} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">
              Width = {effectiveW} m
            </text>

            <text x={40 + (effectiveL * 22) / 2 - 35} y={30 + (effectiveW * 20) / 2 + 5} fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="mono">
              Area = {area} m²
            </text>
          </svg>

          {/* Sliders */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSquare} 
                  onChange={(e) => setIsSquare(e.target.checked)} 
                  className="accent-amber-400 w-4 h-4" 
                />
                <span>Lock as Square (Length = Width)</span>
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Length (l):</span>
                <span className="text-amber-400">{length} meters</span>
              </div>
              <input 
                type="range" min="4" max="12" step="1" value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>

            {!isSquare && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                  <span>Width (b):</span>
                  <span className="text-amber-400">{width} meters</span>
                </div>
                <input 
                  type="range" min="3" max="10" step="1" value={width} 
                  onChange={(e) => setWidth(parseInt(e.target.value))} 
                  className="w-full accent-amber-400 cursor-pointer" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Live Measurement Comparison</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Fence Line (Perimeter = 2(l + b)):</div>
              <div className="text-base font-bold">2 × ({effectiveL} + {effectiveW}) = {perimeter} meters</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Lawn Surface (Area = l × b):</div>
              <div className="text-base font-bold">{effectiveL} × {effectiveW} = {area} m²</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Perimeter = {perimeter} m (Linear)  |  Area = {area} m² (Surface)
            </div>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 font-sans space-y-1">
            <span className="font-bold text-amber-400 block">💡 Fencing vs Tiling Metaphor:</span>
            Buying wire fence requires measuring <strong>Perimeter</strong> ({perimeter} m), while buying grass carpet requires measuring <strong>Area</strong> ({area} m²)!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Parallelogram & Triangles — Shearing Magic (Slanted Bookshelf Metaphor) ───
export function Class7ParallelogramTriangleWidget() {
  const [base, setBase] = useState(10); // base length
  const [height, setHeight] = useState(6); // height
  const [slantShift, setSlantShift] = useState(3); // shear shift
  const [showTriangleSplit, setShowTriangleSplit] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const paraArea = base * height;
  const triArea = paraArea / 2;

  const scale = 20;
  const cx = 50;
  const cy = 180;

  // Parallelogram coordinates
  const p1x = cx;
  const p1y = cy;
  const p2x = cx + base * scale;
  const p2y = cy;
  const p3x = cx + base * scale + slantShift * scale;
  const p3y = cy - height * scale;
  const p4x = cx + slantShift * scale;
  const p4y = cy - height * scale;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Slanted Bookshelf Metaphor</span>
          <h3 className="text-xl font-bold text-white">Parallelogram & Triangle Shearing Magic</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Parallelogram Fill */}
            {!showTriangleSplit ? (
              <polygon 
                points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`} 
                fill="#a855f7" fillOpacity="0.25" stroke="#a855f7" strokeWidth="3" 
              />
            ) : (
              <>
                {/* Two Congruent Triangles Split */}
                <polygon points={`${p1x},${p1y} ${p2x},${p2y} ${p4x},${p4y}`} fill="#0284c7" fillOpacity="0.3" stroke="#0284c7" strokeWidth="2.5" />
                <polygon points={`${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`} fill="#ec4899" fillOpacity="0.3" stroke="#ec4899" strokeWidth="2.5" />
                {/* Diagonal line */}
                <line x1={p2x} y1={p2y} x2={p4x} y2={p4y} stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 4" />
              </>
            )}

            {/* Perpendicular Height Drop */}
            <line x1={p4x} y1={p4y} x2={p4x} y2={cy} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
            <rect x={p4x} y={cy - 10} width="10" height="10" fill="none" stroke="#ef4444" strokeWidth="2" />

            {/* Labels */}
            <text x={p1x + (base * scale) / 2 - 20} y={cy + 20} fill="#a855f7" fontSize="13" fontWeight="bold" fontFamily="mono">
              Base = {base} cm
            </text>

            <text x={p4x - 60} y={cy - (height * scale) / 2} fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="mono">
              h = {height} cm
            </text>
          </svg>

          {/* Controls */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showTriangleSplit} 
                  onChange={(e) => setShowTriangleSplit(e.target.checked)} 
                  className="accent-purple-400 w-4 h-4" 
                />
                <span>Split into 2 Congruent Triangles (Diagonal)</span>
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Base (b):</span>
                <span className="text-purple-400">{base} cm</span>
              </div>
              <input 
                type="range" min="6" max="14" step="1" value={base} 
                onChange={(e) => setBase(parseInt(e.target.value))} 
                className="w-full accent-purple-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Height (h):</span>
                <span className="text-red-400">{height} cm</span>
              </div>
              <input 
                type="range" min="4" max="8" step="1" value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value))} 
                className="w-full accent-red-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans font-bold">Shearing Area Laws</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
              <div>Parallelogram Area (b × h):</div>
              <div className="text-base font-bold">{base} × {height} = {paraArea} cm²</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Single Triangle Area (½ × b × h):</div>
              <div className="text-base font-bold">½ × {base} × {height} = {triArea} cm²</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Triangle Area ({triArea} cm²) = ½ × Parallelogram Area ({paraArea} cm²) ✓
            </div>
          </div>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 font-sans space-y-1">
            <span className="font-bold text-purple-400 block">💡 Slanted Bookshelf Metaphor:</span>
            Slanted tilting doesn't change the height or base! A triangle is always exactly half of a parallelogram with the same base and height.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Circles — Circumference & Pi (Rolling Bike Tire Metaphor) ───
export function Class7CircleCircumferenceAreaWidget() {
  const [r, setR] = useState(7); // radius in cm (3 to 14)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pi = 22 / 7;
  const d = 2 * r;
  const circumference = (2 * pi * r).toFixed(2);
  const area = (pi * r * r).toFixed(2);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Rolling Bike Tire Metaphor</span>
          <h3 className="text-xl font-bold text-white">Circle: Circumference & Surface Area</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Stage */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Circle Tire */}
            <circle cx={140} cy={120} r={r * 8} fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="3.5" />

            {/* Radius line */}
            <line x1={140} y1={120} x2={140 + r * 8} y2={120} stroke="#f59e0b" strokeWidth="3" />

            {/* Center O */}
            <circle cx={140} cy={120} r="5" fill="#f59e0b" />
            <text x={140 - 15} y={120 - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">O</text>

            <text x={140 + (r * 8) / 2 - 10} y={115} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">
              r = {r} cm
            </text>

            {/* Unrolled measuring tape path below */}
            <line x1={20} y1={230} x2={340} y2={230} stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
            <text x={60} y={220} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="mono">
              Unrolled Tire Rotation (C = 2πr = {circumference} cm)
            </text>
          </svg>

          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>Adjust Radius (r):</span>
              <span className="text-amber-400">{r} cm</span>
            </div>
            <input 
              type="range" min="3" max="14" step="1" value={r} 
              onChange={(e) => setR(parseInt(e.target.value))} 
              className="w-full accent-amber-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Circle Equations</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Circumference (C = 2 × 22/7 × r):</div>
              <div className="text-base font-bold">2 × 3.14 × {r} = {circumference} cm</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Surface Area (A = 22/7 × r²):</div>
              <div className="text-base font-bold">3.14 × {r}² = {area} cm²</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Diameter = {d} cm  |  C = {circumference} cm  |  A = {area} cm²
            </div>
          </div>

          <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-sky-300 font-sans space-y-1">
            <span className="font-bold text-sky-400 block">💡 Rolling Bike Tire Metaphor:</span>
            Unrolling 1 full rotation of a bike tire gives the circumference length <strong>{circumference} cm</strong>!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: Pathways, Borders & Composite Shapes (Park Walkway Metaphor) ───
export function Class7PathwayBorderWidget() {
  const [parkL, setParkL] = useState(30); // outer length
  const [parkW, setParkW] = useState(20); // outer width
  const [pathWidth, setPathWidth] = useState(3); // walkway width
  const [isFullscreen, setIsFullscreen] = useState(false);

  const outerArea = parkL * parkW;
  const innerL = Math.max(2, parkL - 2 * pathWidth);
  const innerW = Math.max(2, parkW - 2 * pathWidth);
  const innerArea = innerL * innerW;
  const pathArea = outerArea - innerArea;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Park Walkway Metaphor</span>
          <h3 className="text-xl font-bold text-white">Pathways & Border Areas</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Outer Park Rectangle (Walkway Fill) */}
            <rect x={30} y={30} width={280} height={180} fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="3" />

            {/* Inner Lawn Rectangle */}
            <rect x={30 + pathWidth * 5} y={30 + pathWidth * 4} width={280 - pathWidth * 10} height={180 - pathWidth * 8} fill="#059669" fillOpacity="0.7" stroke="#34d399" strokeWidth="2.5" />

            {/* Labels */}
            <text x={110} y={120} fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="mono">
              Inner Lawn ({innerArea} m²)
            </text>

            <text x={40} y={230} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="mono">
              Outer Park ({outerArea} m²)  |  Walkway ({pathArea} m²)
            </text>
          </svg>

          {/* Controls */}
          <div className="w-full mt-4 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Outer Length (L):</span>
                <span className="text-amber-400">{parkL} meters</span>
              </div>
              <input 
                type="range" min="20" max="40" step="2" value={parkL} 
                onChange={(e) => setParkL(parseInt(e.target.value))} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Walkway Border Width (w):</span>
                <span className="text-emerald-400">{pathWidth} meters</span>
              </div>
              <input 
                type="range" min="1" max="5" step="1" value={pathWidth} 
                onChange={(e) => setPathWidth(parseInt(e.target.value))} 
                className="w-full accent-emerald-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Border Subtraction</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Outer Park Area ({parkL} × {parkW}):</div>
              <div className="text-base font-bold">{outerArea} m²</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-emerald-400">
              <div>Inner Lawn Area ({innerL} × {innerW}):</div>
              <div className="text-base font-bold">{innerArea} m²</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Walkway Path Area = {outerArea} - {innerArea} = {pathArea} m² ✓
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 font-sans space-y-1">
            <span className="font-bold text-emerald-400 block">💡 Park Walkway Metaphor:</span>
            To find the paved walkway area, calculate the big outer park area and subtract the inner green lawn surface!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 7 Master MCQ Exam (80% Pass Mark) ───
export function Class7PerimeterAreaMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What is the perimeter of a rectangle with length 12 cm and width 5 cm?",
      options: ["A) 60 cm", "B) 34 cm", "C) 17 cm", "D) 24 cm"],
      correctIdx: 1,
      explanation: "Perimeter = 2 × (l + b) = 2 × (12 + 5) = 2 × 17 = 34 cm."
    },
    {
      id: 2,
      text: "If a square garden has an area of 144 m², what is the length of its side?",
      options: ["A) 12 m", "B) 36 m", "C) 14 m", "D) 24 m"],
      correctIdx: 0,
      explanation: "Area of square = side² ==> side = √144 = 12 m."
    },
    {
      id: 3,
      text: "What is the area of a parallelogram with base 8 cm and height 5 cm?",
      options: ["A) 20 cm²", "B) 40 cm²", "C) 26 cm²", "D) 13 cm²"],
      correctIdx: 1,
      explanation: "Area of parallelogram = base × height = 8 × 5 = 40 cm²."
    },
    {
      id: 4,
      text: "What is the area of a triangle with base 10 cm and height 6 cm?",
      options: ["A) 60 cm²", "B) 30 cm²", "C) 16 cm²", "D) 32 cm²"],
      correctIdx: 1,
      explanation: "Area of triangle = ½ × base × height = ½ × 10 × 6 = 30 cm²."
    },
    {
      id: 5,
      text: "If the radius of a circular plate is 7 cm, what is its circumference? (Use π = 22/7)",
      options: ["A) 22 cm", "B) 44 cm", "C) 154 cm", "D) 88 cm"],
      correctIdx: 1,
      explanation: "Circumference C = 2 × (22/7) × 7 = 44 cm."
    },
    {
      id: 6,
      text: "What is the surface area of a circle with radius 7 cm? (Use π = 22/7)",
      options: ["A) 44 cm²", "B) 154 cm²", "C) 308 cm²", "D) 49 cm²"],
      correctIdx: 1,
      explanation: "Area A = π × r² = (22/7) × 7 × 7 = 22 × 7 = 154 cm²."
    },
    {
      id: 7,
      text: "A wire bent into a square of side 10 cm is rebent into a rectangle of length 12 cm. What is the width of the rectangle?",
      options: ["A) 8 cm", "B) 10 cm", "C) 6 cm", "D) 14 cm"],
      correctIdx: 0,
      explanation: "Perimeter = 4 × 10 = 40 cm. For rectangle: 2 × (12 + width) = 40 ==> 12 + width = 20 ==> width = 8 cm."
    },
    {
      id: 8,
      text: "A bicycle wheel of radius 35 cm makes 100 full rotations. What total distance does it cover? (Use π = 22/7)",
      options: ["A) 220 m", "B) 110 m", "C) 440 m", "D) 70 m"],
      correctIdx: 0,
      explanation: "1 rotation = 2 × (22/7) × 35 = 220 cm. 100 rotations = 22000 cm = 220 m."
    },
    {
      id: 9,
      text: "A 2-meter wide path runs along the outer boundary of a square park of side 20 meters. What is the area of the path?",
      options: ["A) 176 m²", "B) 400 m²", "C) 576 m²", "D) 144 m²"],
      correctIdx: 0,
      explanation: "Outer side = 20 + 2 + 2 = 24 m. Outer Area = 24² = 576 m². Inner Area = 20² = 400 m². Path Area = 576 - 400 = 176 m²."
    },
    {
      id: 10,
      text: "If the area of a right-angled triangle is 24 cm² and one leg is 6 cm, what is the length of the other perpendicular leg?",
      options: ["A) 4 cm", "B) 8 cm", "C) 12 cm", "D) 10 cm"],
      correctIdx: 1,
      explanation: "Area = ½ × b × h ==> 24 = ½ × 6 × h ==> 24 = 3 × h ==> h = 8 cm."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 7 Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 7 Board Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Perimeter & Area badge!
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Class 7 Perimeter & Area Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified Class 7 Perimeter and Area!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the area & perimeter formulas and retake the exam to earn your 80% completion badge.</span>
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
