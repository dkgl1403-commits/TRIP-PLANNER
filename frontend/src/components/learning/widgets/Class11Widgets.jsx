import React, { useState } from 'react';

// ─── WIDGET 1: Set Theory Venn Diagram Explorer Widget ───
export function SetTheoryVennDiagramExplorerWidget() {
  const [activeTab, setActiveTab] = useState('union'); // union, intersection, complement, difference
  const [isFullscreen, setIsFullscreen] = useState(false);

  const operations = {
    union: {
      title: "Union (A ∪ B)",
      symbol: "A ∪ B",
      subtitle: "Event A OR Event B (or Both)",
      desc: "Combines all data elements belonging to Circle A, Circle B, or both. In probability, this is the total chance of either event taking place.",
      color: "#0284c7"
    },
    intersection: {
      title: "Intersection (A ∩ B)",
      symbol: "A ∩ B",
      subtitle: "Event A AND Event B",
      desc: "The middle overlapping region containing data that satisfies BOTH events simultaneously. Essential for identifying joint occurrences.",
      color: "#6366f1"
    },
    complement: {
      title: "Complement (A')",
      symbol: "A' or Aⁿ",
      subtitle: "NOT Event A",
      desc: "Everything in the Universal Set (Sample Space) living OUTSIDE circle A. P(A') = 1 - P(A).",
      color: "#a855f7"
    },
    difference: {
      title: "Difference (A - B / Crescent Moon)",
      symbol: "A - B (A ∩ B')",
      subtitle: "Event A ONLY (A but not B)",
      desc: "All data in Circle A after removing the overlapping section shared with B. Board exams love testing this Crescent Moon region!",
      color: "#ec4899"
    }
  };

  const curr = operations[activeTab];

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">Class 11 Set Theory Prerequisite</span>
          <h3 className="text-xl font-bold text-white">Venn Diagram Set Operations Explorer</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {Object.keys(operations).map((tabKey) => {
          const tab = operations[tabKey];
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`p-3 rounded-xl text-xs font-bold transition border ${isActive ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className="font-mono text-sm mb-0.5">{tab.symbol}</div>
              <div>{tab.title.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-xl border border-slate-800">
        {/* SVG Venn Diagram */}
        <div className="flex justify-center items-center py-4">
          <svg viewBox="0 0 400 260" className="w-full max-w-sm drop-shadow-xl">
            <defs>
              <mask id="complement-mask">
                <rect x="0" y="0" width="400" height="260" fill="white" />
                <circle cx="150" cy="130" r="75" fill="black" />
              </mask>
              <mask id="diff-mask">
                <circle cx="150" cy="130" r="75" fill="white" />
                <circle cx="250" cy="130" r="75" fill="black" />
              </mask>
            </defs>

            {/* Universal Set (S) Box */}
            <rect x="10" y="10" width="380" height="240" rx="12" fill={activeTab === 'complement' ? '#a855f7' : '#0f172a'} stroke="#475569" strokeWidth="2" mask={activeTab === 'complement' ? 'url(#complement-mask)' : undefined} />
            <text x="25" y="35" fill="#94a3b8" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Universal Set (S)</text>

            {/* Circle A */}
            <circle
              cx="150"
              cy="130"
              r="75"
              fill={activeTab === 'union' ? '#0284c7' : activeTab === 'difference' ? '#ec4899' : 'transparent'}
              fillOpacity={activeTab === 'complement' ? '0' : '0.6'}
              stroke="#38bdf8"
              strokeWidth="3"
              mask={activeTab === 'difference' ? 'url(#diff-mask)' : undefined}
            />

            {/* Circle B */}
            <circle
              cx="250"
              cy="130"
              r="75"
              fill={activeTab === 'union' ? '#0284c7' : 'transparent'}
              fillOpacity="0.6"
              stroke="#818cf8"
              strokeWidth="3"
            />

            {/* Intersection Overlay */}
            {activeTab === 'intersection' && (
              <g>
                <circle cx="150" cy="130" r="75" fill="#6366f1" fillOpacity="0.9" clipPath="url(#circleB-clip)" />
                <clipPath id="circleB-clip">
                  <circle cx="250" cy="130" r="75" />
                </clipPath>
              </g>
            )}

            {/* Circle Outlines and Labels */}
            <circle cx="150" cy="130" r="75" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="250" cy="130" r="75" fill="none" stroke="#818cf8" strokeWidth="3" />

            <text x="110" y="135" fill="#ffffff" fontSize="16" fontWeight="bold">A</text>
            <text x="280" y="135" fill="#ffffff" fontSize="16" fontWeight="bold">B</text>
            <text x="190" y="135" fill="#e2e8f0" fontSize="12" fontWeight="bold">A ∩ B</text>
          </svg>
        </div>

        {/* Description Panel */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 font-mono text-xs rounded-lg w-fit border border-amber-500/20">
            Symbol: {curr.symbol}
          </div>
          <h4 className="text-2xl font-bold text-white">{curr.title}</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{curr.desc}</p>
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
            💡 Formula Note: {activeTab === 'difference' ? "P(A - B) = P(A) - P(A ∩ B)" : activeTab === 'complement' ? "P(A') = 1 - P(A)" : activeTab === 'union' ? "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)" : "P(A ∩ B) = P(A) + P(B) - P(A ∪ B)"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Class 11 Addition Theorem Interactive Simulator ───
export function Class11AdditionTheoremWidget() {
  const [probA, setProbA] = useState(0.4);
  const [probB, setProbB] = useState(0.5);
  const [probIntersect, setProbIntersect] = useState(0.2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Clamp intersection so it cannot exceed probA or probB
  const maxIntersect = Math.min(probA, probB);
  const actualIntersect = Math.min(probIntersect, maxIntersect);
  const unionVal = (probA + probB - actualIntersect).toFixed(2);
  const doubleCountVal = (probA + probB).toFixed(2);
  const isMutuallyExclusive = actualIntersect === 0;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">Class 11 Probability Theorem</span>
          <h3 className="text-xl font-bold text-white">The Addition Theorem & Double Counting Visualizer</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Adjust Probabilities</h4>
          
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-sky-400">P(A) [Event A]:</span>
              <span className="font-mono">{probA.toFixed(2)}</span>
            </div>
            <input type="range" min="0.1" max="0.8" step="0.05" value={probA} onChange={(e) => setProbA(parseFloat(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-400">P(B) [Event B]:</span>
              <span className="font-mono">{probB.toFixed(2)}</span>
            </div>
            <input type="range" min="0.1" max="0.8" step="0.05" value={probB} onChange={(e) => setProbB(parseFloat(e.target.value))} className="w-full accent-indigo-400 cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-purple-400">P(A ∩ B) [Overlap / Both]:</span>
              <span className="font-mono">{actualIntersect.toFixed(2)}</span>
            </div>
            <input type="range" min="0.0" max={maxIntersect} step="0.05" value={actualIntersect} onChange={(e) => setProbIntersect(parseFloat(e.target.value))} className="w-full accent-purple-400 cursor-pointer" />
          </div>

          {isMutuallyExclusive && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs">
              ⚡ <strong>Mutually Exclusive!</strong> The overlap is 0. Formula simplifies to P(A ∪ B) = P(A) + P(B).
            </div>
          )}
        </div>

        {/* Output & Formula Breakdown */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide mb-3">Formula Breakdown</h4>
            
            <div className="font-mono text-xs md:text-sm bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-center">
              <div className="text-slate-400">P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</div>
              <div className="text-amber-400 font-bold text-base md:text-lg">
                P(A ∪ B) = {probA.toFixed(2)} + {probB.toFixed(2)} - {actualIntersect.toFixed(2)} = <span className="text-emerald-400">{unionVal}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
              ❌ Naive Addition (P(A) + P(B)) = <strong>{doubleCountVal}</strong> (Includes double-counted overlap of {actualIntersect.toFixed(2)}!)
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800">
            <strong>Professor's Insight:</strong> We subtract P(A ∩ B) once because adding Circle A and Circle B counts the middle overlap twice!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Class 11 Edge Cases Explorer Widget ───
export function Class11EdgeCasesWidget() {
  const [caseType, setCaseType] = useState('crescent'); // crescent, mee, axiomatic
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">Class 11 Board Exam Mastery</span>
          <h3 className="text-xl font-bold text-white">The Three Edge Cases Explorer</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Case Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button onClick={() => setCaseType('crescent')} className={`p-3 rounded-xl text-xs font-bold text-left transition border ${caseType === 'crescent' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
          1. "A but not B" (Crescent Moon)
        </button>
        <button onClick={() => setCaseType('mee')} className={`p-3 rounded-xl text-xs font-bold text-left transition border ${caseType === 'mee' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
          2. Mutually Exclusive & Exhaustive
        </button>
        <button onClick={() => setCaseType('axiomatic')} className={`p-3 rounded-xl text-xs font-bold text-left transition border ${caseType === 'axiomatic' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
          3. Kolmogorov's Axiomatic Rules
        </button>
      </div>

      {/* Case Details */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
        {caseType === 'crescent' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-pink-400">1. Crescent Moon: P(A ∩ B') = P(A) - P(A ∩ B)</h4>
            <p className="text-xs md:text-sm text-slate-300">
              When examiners ask for "Cricket ONLY" or "Event A but NOT B", you take circle A and bite out the overlap.
            </p>
            <div className="p-4 bg-slate-900 rounded-xl font-mono text-xs md:text-sm space-y-2 border border-slate-800 text-slate-300">
              <div>Example: P(Cricket) = 0.60, P(Football) = 0.30, P(Both) = 0.10</div>
              <div className="text-amber-400 font-bold">P(Cricket Only) = 0.60 - 0.10 = 0.50 (50%)</div>
            </div>
          </div>
        )}

        {caseType === 'mee' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-indigo-400">2. Mutually Exclusive & Exhaustive Events (MEE)</h4>
            <p className="text-xs md:text-sm text-slate-300">
              Events that do NOT overlap AND together fill 100% of the Universal Set.
            </p>
            <div className="p-4 bg-slate-900 rounded-xl font-mono text-xs md:text-sm space-y-2 border border-slate-800 text-slate-300">
              <div>Rule: P(A) + P(B) + P(C) = 1.0</div>
              <div className="text-emerald-400 font-bold">Key for solving missing variable 'x' in board exam distribution tables!</div>
            </div>
          </div>
        )}

        {caseType === 'axiomatic' && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-purple-400">3. Kolmogorov's 3 Unbreakable Axioms</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-amber-400 mb-1">Axiom 1: Positivity</div>
                <div className="font-mono text-slate-300">P(E) ≥ 0</div>
                <div className="text-slate-400 mt-1 text-[11px]">No negative probabilities.</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-sky-400 mb-1">Axiom 2: Certainty</div>
                <div className="font-mono text-slate-300">P(S) = 1</div>
                <div className="text-slate-400 mt-1 text-[11px]">Sample space sum is 100%.</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-emerald-400 mb-1">Axiom 3: Additivity</div>
                <div className="font-mono text-slate-300">P(A ∪ B) = P(A) + P(B)</div>
                <div className="text-slate-400 mt-1 text-[11px]">For disjoint events.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
