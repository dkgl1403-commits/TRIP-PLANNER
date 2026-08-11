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

// ─── WIDGET 1B: Class 11 Set Theory MCQ Practice Exam (80% Pass Mark) ───
export function Class11SetTheoryMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which of the following represents a well-defined set in mathematics?",
      options: ["A) Collection of all good prime numbers", "B) Collection of all vowels in the English alphabet", "C) Collection of all intelligent students in Class 11", "D) Collection of all difficult math topics"],
      correctIdx: 1,
      explanation: "A set must be unambiguous. Vowels {a, e, i, o, u} are objectively defined without opinion."
    },
    {
      id: 2,
      text: "If Set A = {1, 2, 3, 4} and Set B = {3, 4, 5, 6}, what is A ∩ B?",
      options: ["A) {1, 2, 3, 4, 5, 6}", "B) {3, 4}", "C) {1, 2, 5, 6}", "D) { } (Empty set)"],
      correctIdx: 1,
      explanation: "Intersection ∩ contains only the elements present in BOTH sets: 3 and 4."
    },
    {
      id: 3,
      text: "If Set A = {a, b, c} and Set B = {x, y}, what is the total number of elements in the Cartesian Product A × B?",
      options: ["A) 5", "B) 6", "C) 8", "D) 9"],
      correctIdx: 1,
      explanation: "Number of elements n(A × B) = n(A) × n(B) = 3 × 2 = 6 ordered pairs."
    },
    {
      id: 4,
      text: "If A = {1, 2, 3} and B = {2, 3, 4}, what is the set difference A - B?",
      options: ["A) {4}", "B) {1}", "C) {1, 4}", "D) {2, 3}"],
      correctIdx: 1,
      explanation: "A - B consists of elements belonging strictly to A and not B. Removing {2,3} from A leaves {1}."
    },
    {
      id: 5,
      text: "According to De Morgan's Law, what is (A ∪ B)' equal to?",
      options: ["A) A' ∪ B'", "B) A' ∩ B'", "C) A ∩ B", "D) A' - B'"],
      correctIdx: 1,
      explanation: "De Morgan's First Law states: (A ∪ B)' = A' ∩ B' (The complement of union is the intersection of complements)."
    },
    {
      id: 6,
      text: "How many total subsets can be formed from a set containing n = 4 elements?",
      options: ["A) 8", "B) 12", "C) 16", "D) 32"],
      correctIdx: 2,
      explanation: "The total number of subsets of a set with n elements is 2ⁿ = 2⁴ = 16."
    },
    {
      id: 7,
      text: "If A ⊆ B (A is a subset of B), what is A ∩ B?",
      options: ["A) A", "B) B", "C) Universal Set S", "D) Empty Set Ø"],
      correctIdx: 0,
      explanation: "If A is entirely contained inside B, the overlapping region is the entire set A itself."
    },
    {
      id: 8,
      text: "If Set A has 10 elements and Set B has 15 elements, what is the MAXIMUM possible number of elements in A ∩ B?",
      options: ["A) 5", "B) 10", "C) 15", "D) 25"],
      correctIdx: 1,
      explanation: "The intersection cannot exceed the size of the smaller set, so max n(A ∩ B) = 10."
    },
    {
      id: 9,
      text: "What is the symmetric difference of two sets A and B, denoted as A Δ B?",
      options: ["A) (A ∪ B) - (A ∩ B)", "B) (A ∩ B) - (A ∪ B)", "C) A' ∩ B'", "D) A ∪ B ∪ S"],
      correctIdx: 0,
      explanation: "Symmetric difference A Δ B = (A - B) ∪ (B - A) = (A ∪ B) - (A ∩ B) (Elements in A or B, but NOT both)."
    },
    {
      id: 10,
      text: "In a class of 50 students, 30 like Tea, 25 like Coffee, and 10 like both. How many students like AT LEAST ONE beverage?",
      options: ["A) 55", "B) 45", "C) 35", "D) 40"],
      correctIdx: 1,
      explanation: "n(Tea ∪ Coffee) = n(Tea) + n(Coffee) - n(Both) = 30 + 25 - 10 = 45 students."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Chapter 1 Mastery Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 11 Set Theory Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to complete Chapter 1!
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
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Set Theory Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified and completed Chapter 1: Class 11 Set Theory!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the lessons and retake the exam to earn your 80% completion badge.</span>
            )}
          </div>

          <button onClick={handleRestart} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl">
            Retake Practice Exam 🔄
          </button>
        </div>
      )}
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

// ─── WIDGET 4: Class 11 Master MCQ Practice Exam with 80% Passing Criteria ───
export function Class11ProbabilityMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "If P(A) = 0.60, P(B) = 0.50, and P(A ∩ B) = 0.30, what is P(A ∪ B)?",
      options: ["A) 0.80", "B) 1.10", "C) 0.50", "D) 0.70"],
      correctIdx: 0,
      explanation: "Using the Addition Theorem: P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.60 + 0.50 - 0.30 = 0.80."
    },
    {
      id: 2,
      text: "What is the probability of 'A but NOT B', written as P(A ∩ B')?",
      options: ["A) P(A) - P(B)", "B) P(A) - P(A ∩ B)", "C) P(A ∪ B) - P(B)", "D) 1 - P(A ∩ B)"],
      correctIdx: 1,
      explanation: "The 'Crescent Moon' formula: P(A ∩ B') = P(A) - P(A ∩ B)."
    },
    {
      id: 3,
      text: "If two events A and B are Mutually Exclusive, what is P(A ∩ B)?",
      options: ["A) 1", "B) 0.5", "C) 0", "D) P(A) · P(B)"],
      correctIdx: 2,
      explanation: "Mutually Exclusive events cannot happen simultaneously, so their intersection P(A ∩ B) = 0."
    },
    {
      id: 4,
      text: "Events A, B, and C are Mutually Exclusive and Exhaustive. If P(A) = 0.35 and P(B) = 0.40, what is P(C)?",
      options: ["A) 0.25", "B) 0.75", "C) 0.15", "D) 0.35"],
      correctIdx: 0,
      explanation: "For MEE events, P(A) + P(B) + P(C) = 1.0. Thus, P(C) = 1.0 - 0.35 - 0.40 = 0.25."
    },
    {
      id: 5,
      text: "Which of Kolmogorov's Axioms states that P(S) = 1 for the Sample Space S?",
      options: ["A) Axiom of Positivity", "B) Axiom of Certainty", "C) Axiom of Additivity", "D) Axiom of Independence"],
      correctIdx: 1,
      explanation: "The Axiom of Certainty establishes that the probability of the entire sample space happening is 100% (1.0)."
    },
    {
      id: 6,
      text: "In Set Theory notation, if Event A represents drawing a Red Card and Event B represents drawing a King, what does A ∩ B represent?",
      options: ["A) Any Red Card or any King", "B) Red Kings (King of Hearts & King of Diamonds)", "C) Black Kings only", "D) Cards that are neither Red nor Kings"],
      correctIdx: 1,
      explanation: "Intersection ∩ represents elements that satisfy BOTH criteria: Red AND King."
    },
    {
      id: 7,
      text: "If P(A) = 0.7, what is the probability of the complement event P(A')?",
      options: ["A) 0.7", "B) -0.7", "C) 0.3", "D) 0"],
      correctIdx: 2,
      explanation: "P(A') = 1 - P(A) = 1 - 0.7 = 0.3."
    },
    {
      id: 8,
      text: "In a class of 100 students, 60 study Math, 50 study Physics, and 30 study both. How many study NEITHER Math nor Physics?",
      options: ["A) 20", "B) 10", "C) 30", "D) 40"],
      correctIdx: 0,
      explanation: "P(Math ∪ Physics) = 60 + 50 - 30 = 80 students. Neither = Total - 80 = 100 - 80 = 20 students."
    },
    {
      id: 9,
      text: "Why is P(A ∪ B) NOT equal to P(A) + P(B) when events overlap?",
      options: ["A) Because probabilities cannot exceed 1", "B) Because the overlapping section P(A ∩ B) gets double-counted", "C) Because Set Theory requires subtraction", "D) Because sample space changes"],
      correctIdx: 1,
      explanation: "Simply adding P(A) and P(B) counts the middle intersection twice. We subtract P(A ∩ B) to correct this double-counting."
    },
    {
      id: 10,
      text: "If event E is impossible, what is its probability under Kolmogorov's Axioms?",
      options: ["A) 0", "B) 1", "C) -1", "D) Undefined"],
      correctIdx: 0,
      explanation: "An impossible event has a probability of 0, satisfying P(E) ≥ 0."
    }
  ];

  const passingThreshold = 80; // 80% needed to pass
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Chapter 2 Mastery Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 11 Board Exam Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to complete this chapter!
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
            <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Chapter Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified and completed Chapter 2: Class 11 Probability!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the lessons and try the exam again to achieve your 80% completion badge.</span>
            )}
          </div>

          <button onClick={handleRestart} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl">
            Retake Practice Exam 🔄
          </button>
        </div>
      )}
    </div>
  );
}
