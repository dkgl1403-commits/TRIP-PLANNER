import React, { useState } from 'react';

// ─── WIDGET 1: Parabola & Zeroes Visualizer (Geometrical Meaning) ───
export function Class10PolynomialsParabolaVisualizerWidget() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const D = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);

  let alpha = null;
  let beta = null;
  if (D >= 0) {
    alpha = (-b - Math.sqrt(D)) / (2 * a);
    beta = (-b + Math.sqrt(D)) / (2 * a);
  }

  // SVG plotting params
  const minX = -6;
  const maxX = 6;
  const minY = -10;
  const maxY = 10;
  const width = 360;
  const height = 240;

  const toSvgX = (x) => ((x - minX) / (maxX - minX)) * width;
  const toSvgY = (y) => height - ((y - minY) / (maxY - minY)) * height;

  // Generate path points
  const points = [];
  for (let x = minX; x <= maxX; x += 0.1) {
    const y = a * x * x + b * x + c;
    if (y >= minY - 5 && y <= maxY + 5) {
      points.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
  }
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Geometrical Meaning of Zeroes</span>
          <h3 className="text-xl font-bold text-white">Parabola Geometry & Discriminant Explorer</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Plot */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 240" className="w-full max-w-md drop-shadow-2xl border border-slate-800 bg-slate-900 rounded-xl">
            {/* Grid lines */}
            <line x1={0} y1={toSvgY(0)} x2={width} y2={toSvgY(0)} stroke="#475569" strokeWidth="2" />
            <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={height} stroke="#475569" strokeWidth="2" />

            {/* Parabola Curve */}
            {pathD && <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="3" />}

            {/* Vertex Point */}
            <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r="5" fill="#a855f7" />

            {/* Zeroes / Intercepts */}
            {alpha !== null && alpha >= minX && alpha <= maxX && (
              <circle cx={toSvgX(alpha)} cy={toSvgY(0)} r="6" fill="#38bdf8" />
            )}
            {beta !== null && beta >= minX && beta <= maxX && (
              <circle cx={toSvgX(beta)} cy={toSvgY(0)} r="6" fill="#38bdf8" />
            )}
          </svg>

          {/* Sliders */}
          <div className="w-full mt-4 space-y-2 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Coefficient a ({a > 0 ? 'Opens Up ∪' : 'Opens Down ∩'}):</span>
                <span className="text-amber-400">{a}</span>
              </div>
              <input 
                type="range" min="-3" max="3" step="1" value={a} 
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setA(val === 0 ? 1 : val);
                }} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Coefficient b:</span>
                <span className="text-sky-400">{b}</span>
              </div>
              <input 
                type="range" min="-8" max="8" step="1" value={b} 
                onChange={(e) => setB(parseInt(e.target.value))} 
                className="w-full accent-sky-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Constant c:</span>
                <span className="text-purple-400">{c}</span>
              </div>
              <input 
                type="range" min="-10" max="10" step="1" value={c} 
                onChange={(e) => setC(parseInt(e.target.value))} 
                className="w-full accent-purple-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Live Analysis Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Polynomial Function</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400 text-center font-bold text-base">
              p(x) = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-300">
              <div>Discriminant D = b² - 4ac:</div>
              <div className="text-base font-bold">({b})² - 4({a})({c}) = {D}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-300">
              <div>Real Zeroes (x-intercepts):</div>
              {D > 0 ? (
                <div className="text-sm font-bold text-emerald-400">
                  2 Distinct Zeroes: α = {alpha.toFixed(2)}, β = {beta.toFixed(2)}
                </div>
              ) : D === 0 ? (
                <div className="text-sm font-bold text-amber-400">
                  1 Coincident Zero: α = β = {alpha.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm font-bold text-rose-400">
                  0 Real Zeroes (D &lt; 0, No x-intercepts)
                </div>
              )}
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Vertex = ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})  |  Shape: {a > 0 ? 'Upward ∪' : 'Downward ∩'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Remainder & Factor Theorem Calculator ───
export function Class10PolynomialsRemainderFactorWidget() {
  const [coefA, setCoefA] = useState(2); // Ax^2
  const [coefB, setCoefB] = useState(-5); // Bx
  const [coefC, setCoefC] = useState(3);  // C
  const [divisorVal, setDivisorVal] = useState(1); // divisor (x - a), so a = 1
  const [isFullscreen, setIsFullscreen] = useState(false);

  // p(a) = A*a^2 + B*a + C
  const remainder = coefA * divisorVal * divisorVal + coefB * divisorVal + coefC;
  const isFactor = remainder === 0;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-sky-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Division Algorithm Simulator</span>
          <h3 className="text-xl font-bold text-white">Remainder & Factor Theorem Interactive Solver</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs">
        {/* Controls */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Polynomial & Divisor Inputs</span>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">A (Coefficient of x²):</label>
              <input 
                type="number" value={coefA} onChange={(e) => setCoefA(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-400 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">B (Coefficient of x):</label>
              <input 
                type="number" value={coefB} onChange={(e) => setCoefB(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sky-400 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">C (Constant Term):</label>
              <input 
                type="number" value={coefC} onChange={(e) => setCoefC(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-purple-400 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Divisor Root (a in x - a):</label>
              <input 
                type="number" value={divisorVal} onChange={(e) => setDivisorVal(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Proof Output */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-emerald-400 block font-sans">Theorem Step-by-Step Proof</span>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="text-slate-300">
              Polynomial: <strong className="text-amber-400">p(x) = {coefA}x² {coefB >= 0 ? `+ ${coefB}` : `- ${Math.abs(coefB)}`}x {coefC >= 0 ? `+ ${coefC}` : `- ${Math.abs(coefC)}`}</strong>
            </div>
            <div className="text-slate-300">
              Divisor: <strong className="text-emerald-400">g(x) = x {divisorVal >= 0 ? `- ${divisorVal}` : `+ ${Math.abs(divisorVal)}`}</strong>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-300 space-y-1">
              <div>Substitute x = {divisorVal} into p(x):</div>
              <div>p({divisorVal}) = {coefA}({divisorVal})² + ({coefB})({divisorVal}) + ({coefC})</div>
              <div>p({divisorVal}) = {coefA * divisorVal * divisorVal} + ({coefB * divisorVal}) + ({coefC})</div>
              <div className="text-base font-bold text-amber-400">Remainder R = p({divisorVal}) = {remainder}</div>
            </div>

            <div className={`p-4 rounded-xl border font-bold text-center text-sm ${isFactor ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-rose-950 border-rose-500 text-rose-300'}`}>
              {isFactor ? (
                <span>🎉 Factor Theorem Verified! Since R = 0, (x - {divisorVal}) IS a factor of p(x).</span>
              ) : (
                <span>⚠️ Remainder R = {remainder} ≠ 0. (x - {divisorVal}) is NOT a factor of p(x).</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Zeroes & Coefficients Relations ───
export function Class10PolynomialsZeroesCoefficientsWidget() {
  const [rootAlpha, setRootAlpha] = useState(3);
  const [rootBeta, setRootBeta] = useState(-2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sumS = rootAlpha + rootBeta;
  const prodP = rootAlpha * rootBeta;

  // p(x) = x^2 - Sx + P ==> a = 1, b = -S, c = P
  const a = 1;
  const b = -sumS;
  const c = prodP;

  const negBoverA = -b / a;
  const CoverA = c / a;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Algebraic Verification</span>
          <h3 className="text-xl font-bold text-white">Zeroes & Coefficients Relationship Verifier</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs">
        {/* Controls */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Input Zeroes (α and β)</span>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div>
              <label className="text-slate-300 block mb-1">Zero α:</label>
              <input 
                type="number" value={rootAlpha} onChange={(e) => setRootAlpha(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-400 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Zero β:</label>
              <input 
                type="number" value={rootBeta} onChange={(e) => setRootBeta(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sky-400 font-bold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-sans">
            <span className="font-bold text-amber-400 text-xs block">💡 Formed Polynomial:</span>
            <div className="p-3 bg-slate-950 rounded-lg font-mono text-amber-400 font-bold text-sm">
              p(x) = x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
            </div>
          </div>
        </div>

        {/* Verification Output */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-emerald-400 block font-sans">Relationship Proof Verification</span>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            {/* Sum */}
            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 space-y-1">
              <div className="text-amber-400 font-bold">Sum of Zeroes (α + β):</div>
              <div className="text-slate-300">α + β = {rootAlpha} + ({rootBeta}) = <strong>{sumS}</strong></div>
              <div className="text-slate-300">-b / a = -({b}) / {a} = <strong>{negBoverA}</strong></div>
              <div className="text-emerald-400 font-bold text-xs pt-1">✓ Sum Verified: α + β = -b / a = {sumS}</div>
            </div>

            {/* Product */}
            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 space-y-1">
              <div className="text-sky-400 font-bold">Product of Zeroes (α · β):</div>
              <div className="text-slate-300">α · β = ({rootAlpha}) · ({rootBeta}) = <strong>{prodP}</strong></div>
              <div className="text-slate-300">c / a = {c} / {a} = <strong>{CoverA}</strong></div>
              <div className="text-emerald-400 font-bold text-xs pt-1">✓ Product Verified: α · β = c / a = {prodP}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: 4 Algebraic Identity Transformations ───
export function Class10PolynomialsAlgebraicIdentitiesWidget() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(7);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sumS = -b / a; // 5/2 = 2.5
  const prodP = c / a; // 7/2 = 3.5

  // Identity 1: alpha^2 + beta^2 = S^2 - 2P
  const id1 = sumS * sumS - 2 * prodP;

  // Identity 2: (1/alpha) + (1/beta) = S / P
  const id2 = prodP !== 0 ? (sumS / prodP).toFixed(3) : 'Undefined';

  // Identity 3: alpha^3 + beta^3 = S^3 - 3P(S)
  const id3 = sumS * sumS * sumS - 3 * prodP * sumS;

  // Identity 4: (alpha/beta) + (beta/alpha) = (S^2 - 2P) / P
  const id4 = prodP !== 0 ? (id1 / prodP).toFixed(3) : 'Undefined';

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-purple-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Advanced Board Transformations</span>
          <h3 className="text-xl font-bold text-white">4 Algebraic Identities Live Evaluator</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
        <div>
          <label className="text-slate-400 block mb-1">a:</label>
          <input 
            type="number" value={a} onChange={(e) => setA(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-400 font-bold"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">b:</label>
          <input 
            type="number" value={b} onChange={(e) => setB(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sky-400 font-bold"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">c:</label>
          <input 
            type="number" value={c} onChange={(e) => setC(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-purple-400 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Identity 1 */}
        <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2">
          <div className="text-amber-400 font-bold text-sm">Identity 1: α² + β²</div>
          <div className="text-slate-400">Formula: (α + β)² - 2αβ</div>
          <div className="text-slate-200">Calculation: ({sumS})² - 2({prodP})</div>
          <div className="text-emerald-400 font-bold text-base pt-1">Result = {id1.toFixed(3)}</div>
        </div>

        {/* Identity 2 */}
        <div className="p-4 bg-slate-950 rounded-xl border border-sky-500/30 space-y-2">
          <div className="text-sky-400 font-bold text-sm">Identity 2: 1/α + 1/β</div>
          <div className="text-slate-400">Formula: (α + β) / (αβ)</div>
          <div className="text-slate-200">Calculation: ({sumS}) / ({prodP})</div>
          <div className="text-emerald-400 font-bold text-base pt-1">Result = {id2}</div>
        </div>

        {/* Identity 3 */}
        <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 space-y-2">
          <div className="text-purple-400 font-bold text-sm">Identity 3: α³ + β³</div>
          <div className="text-slate-400">Formula: (α + β)³ - 3αβ(α + β)</div>
          <div className="text-slate-200">Calculation: ({sumS})³ - 3({prodP})({sumS})</div>
          <div className="text-emerald-400 font-bold text-base pt-1">Result = {id3.toFixed(3)}</div>
        </div>

        {/* Identity 4 */}
        <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="text-emerald-400 font-bold text-sm">Identity 4: α/β + β/α</div>
          <div className="text-slate-400">Formula: (α² + β²) / (αβ)</div>
          <div className="text-slate-200">Calculation: ({id1.toFixed(2)}) / ({prodP})</div>
          <div className="text-emerald-400 font-bold text-base pt-1">Result = {id4}</div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 10 Polynomials MCQ Exam ───
export function Class10PolynomialsMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What are the zeroes of the quadratic polynomial p(x) = 6x² - 7x - 3?",
      options: ["A) 3/2, -1/3", "B) -3/2, 1/3", "C) 3, -2", "D) 7/6, -1/2"],
      correctIdx: 0,
      explanation: "6x² - 9x + 2x - 3 = (2x - 3)(3x + 1) = 0 ==> x = 3/2, -1/3."
    },
    {
      id: 2,
      text: "If α and β are zeroes of p(x) = ax² + bx + c, what is α² + β² equal to?",
      options: ["A) (b² - 2ac) / a²", "B) (b² + 2ac) / a²", "C) -b / a", "D) c / a"],
      correctIdx: 0,
      explanation: "α² + β² = (α + β)² - 2αβ = (-b/a)² - 2(c/a) = (b² - 2ac) / a²."
    },
    {
      id: 3,
      text: "If one zero of the polynomial (k - 1)x² + kx + 1 is -3, what is the value of k?",
      options: ["A) 4/3", "B) -4/3", "C) 2/3", "D) -2/3"],
      correctIdx: 0,
      explanation: "p(-3) = 0 ==> (k - 1)(-3)² + k(-3) + 1 = 0 ==> 9k - 9 - 3k + 1 = 0 ==> 6k = 8 ==> k = 4/3."
    },
    {
      id: 4,
      text: "What is the degree of a non-zero constant polynomial?",
      options: ["A) 0", "B) 1", "C) Undefined", "D) Infinite"],
      correctIdx: 0,
      explanation: "A constant polynomial like p(x) = c = c·x⁰ has a degree of 0."
    },
    {
      id: 5,
      text: "If a polynomial p(x) is divided by (x - a), what is the remainder according to Remainder Theorem?",
      options: ["A) p(a)", "B) p(-a)", "C) 0", "D) a"],
      correctIdx: 0,
      explanation: "By Remainder Theorem, p(x) = (x - a)q(x) + R ==> p(a) = R."
    },
    {
      id: 6,
      text: "If the discriminant D = b² - 4ac of a quadratic polynomial is negative (D < 0), how many real zeroes does it have?",
      options: ["A) 0", "B) 1", "C) 2", "D) Infinite"],
      correctIdx: 0,
      explanation: "When D < 0, the parabola does not touch or intersect the x-axis, so there are 0 real zeroes."
    },
    {
      id: 7,
      text: "What is the quadratic polynomial whose zeroes are 2 + √3 and 2 - √3?",
      options: ["A) x² - 4x + 1", "B) x² + 4x + 1", "C) x² - 4x - 1", "D) x² - 2x + 3"],
      correctIdx: 0,
      explanation: "Sum S = 4, Product P = (2+√3)(2-√3) = 4 - 3 = 1 ==> p(x) = x² - 4x + 1."
    },
    {
      id: 8,
      text: "For a cubic polynomial p(x) = ax³ + bx² + cx + d, what is the product of zeroes α·β·γ?",
      options: ["A) -d / a", "B) c / a", "C) -b / a", "D) d / a"],
      correctIdx: 0,
      explanation: "By Factor Theorem matching, the product of roots αβγ = -d / a."
    },
    {
      id: 9,
      text: "If α and β are zeroes of x² - 8x + k such that α² + β² = 40, find k.",
      options: ["A) 12", "B) 24", "C) 16", "D) 8"],
      correctIdx: 0,
      explanation: "α+β = 8, αβ = k. α²+β² = 64 - 2k = 40 ==> 2k = 24 ==> k = 12."
    },
    {
      id: 10,
      text: "If (x + 1) is a factor of p(x) = 2x² + kx, what is the value of k?",
      options: ["A) 2", "B) -2", "C) 1", "D) 0"],
      correctIdx: 0,
      explanation: "p(-1) = 0 ==> 2(-1)² + k(-1) = 0 ==> 2 - k = 0 ==> k = 2."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 10 Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 10 Polynomials Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Polynomials badge!
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Polynomials Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified Class 10 Polynomials!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review root relations and retake the exam to earn your 80% completion badge.</span>
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
