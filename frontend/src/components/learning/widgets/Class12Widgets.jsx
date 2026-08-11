import React, { useState } from 'react';

// ─── WIDGET 1: Detective Mumbai Escape Bayes Simulator ───
export function DetectiveBayesSimulatorWidget() {
  const [probTaxi, setProbTaxi] = useState(0.40);
  const [probTrain, setProbTrain] = useState(0.50);
  // probBike is remaining: 1.0 - (probTaxi + probTrain)
  const probBike = Math.max(0, parseFloat((1.0 - (probTaxi + probTrain)).toFixed(2)));

  const [catchRateTaxi, setCatchRateTaxi] = useState(0.30);
  const [catchRateTrain, setCatchRateTrain] = useState(0.20);
  const [catchRateBike, setCatchRateBike] = useState(0.80);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Path Calculations
  const pathTaxi = parseFloat((probTaxi * catchRateTaxi).toFixed(4));
  const pathTrain = parseFloat((probTrain * catchRateTrain).toFixed(4));
  const pathBike = parseFloat((probBike * catchRateBike).toFixed(4));

  const totalCaught = parseFloat((pathTaxi + pathTrain + pathBike).toFixed(4));

  // Bayes Posterior: Given caught, prob took Taxi
  const bayesTaxi = totalCaught > 0 ? ((pathTaxi / totalCaught) * 100).toFixed(1) : 0;
  const bayesTrain = totalCaught > 0 ? ((pathTrain / totalCaught) * 100).toFixed(1) : 0;
  const bayesBike = totalCaught > 0 ? ((pathBike / totalCaught) * 100).toFixed(1) : 0;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 12 Apex Interactive Simulator</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🕵️ Detective Mumbai: Probability Tree & Bayes Time Machine
          </h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Sliders */}
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide font-mono">1. Suspect Vehicle Choice (Priors)</h4>
          
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-sky-400">🚕 Taxi P(Taxi):</span>
              <span className="font-mono">{(probTaxi * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" min="0.0" max="0.8" step="0.05" value={probTaxi} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setProbTaxi(val);
                if (val + probTrain > 1.0) setProbTrain(parseFloat((1.0 - val).toFixed(2)));
              }} 
              className="w-full accent-sky-400 cursor-pointer" 
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-400">🚆 Local Train P(Train):</span>
              <span className="font-mono">{(probTrain * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" min="0.0" max={1.0 - probTaxi} step="0.05" value={probTrain} 
              onChange={(e) => setProbTrain(parseFloat(e.target.value))} 
              className="w-full accent-indigo-400 cursor-pointer" 
            />
          </div>

          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono flex justify-between text-slate-400">
            <span>🚲 Bicycle P(Bike):</span>
            <span className="text-pink-400 font-bold">{(probBike * 100).toFixed(0)}%</span>
          </div>

          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide font-mono pt-2">2. Police Checkpoint Catch Rates</h4>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-sky-400 font-bold">P(Caught|Taxi)</div>
              <input type="range" min="0.05" max="0.95" step="0.05" value={catchRateTaxi} onChange={(e) => setCatchRateTaxi(parseFloat(e.target.value))} className="w-full accent-sky-400" />
              <div className="text-right text-slate-300">{(catchRateTaxi * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-indigo-400 font-bold">P(Caught|Train)</div>
              <input type="range" min="0.05" max="0.95" step="0.05" value={catchRateTrain} onChange={(e) => setCatchRateTrain(parseFloat(e.target.value))} className="w-full accent-indigo-400" />
              <div className="text-right text-slate-300">{(catchRateTrain * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="text-pink-400 font-bold">P(Caught|Bike)</div>
              <input type="range" min="0.05" max="0.95" step="0.05" value={catchRateBike} onChange={(e) => setCatchRateBike(parseFloat(e.target.value))} className="w-full accent-pink-400" />
              <div className="text-right text-slate-300">{(catchRateBike * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Right Column: Tree & Bayes Results */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide font-mono mb-3">
              3. Law of Total Probability (Forward Branches)
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>🚕 Path 1: Taxi & Caught</span>
                <span className="text-sky-400 font-bold">{(probTaxi * 100).toFixed(0)}% × {(catchRateTaxi * 100).toFixed(0)}% = {(pathTaxi * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>🚆 Path 2: Train & Caught</span>
                <span className="text-indigo-400 font-bold">{(probTrain * 100).toFixed(0)}% × {(catchRateTrain * 100).toFixed(0)}% = {(pathTrain * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>🚲 Path 3: Bike & Caught</span>
                <span className="text-pink-400 font-bold">{(probBike * 100).toFixed(0)}% × {(catchRateBike * 100).toFixed(0)}% = {(pathBike * 100).toFixed(1)}%</span>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex justify-between items-center text-sm font-sans font-bold">
                <span className="text-emerald-300">Total Probability of Getting Caught P(Caught):</span>
                <span className="text-emerald-400 font-mono text-base">{(totalCaught * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Bayes Time Machine Panel */}
          <div className="p-4 bg-slate-900 rounded-xl border-2 border-amber-500/40 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <span>⏳ Bayes' Time Machine: P(Vehicle | Caught)</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Phone rings: <em>"Inspector... we caught him!"</em> Reversing time to find which vehicle he was in:
            </p>
            
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs pt-1">
              <div className="p-2 bg-sky-950/60 border border-sky-500/40 rounded-lg">
                <div className="text-sky-300 text-[10px]">P(Taxi|Caught)</div>
                <div className="text-sky-400 font-bold text-sm">{bayesTaxi}%</div>
              </div>
              <div className="p-2 bg-indigo-950/60 border border-indigo-500/40 rounded-lg">
                <div className="text-indigo-300 text-[10px]">P(Train|Caught)</div>
                <div className="text-indigo-400 font-bold text-sm">{bayesTrain}%</div>
              </div>
              <div className="p-2 bg-pink-950/60 border border-pink-500/40 rounded-lg">
                <div className="text-pink-300 text-[10px]">P(Bike|Caught)</div>
                <div className="text-pink-400 font-bold text-sm">{bayesBike}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Medical False Positive Paradox Calculator ───
export function MedicalFalsePositiveCalculatorWidget() {
  const [prevalence, setPrevalence] = useState(0.01); // 1% disease
  const [accuracy, setAccuracy] = useState(0.99); // 99% test accuracy
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Math
  const healthy = 1 - prevalence;
  const sickAndPositive = prevalence * accuracy;
  const healthyAndFalsePositive = healthy * (1 - accuracy);
  const totalPositive = sickAndPositive + healthyAndFalsePositive;
  const truePosterior = totalPositive > 0 ? (sickAndPositive / totalPositive) * 100 : 0;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 12 Real-World Application</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🩺 The Medical False Positive Paradox Calculator
          </h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-rose-400">Disease Prevalence P(Disease):</span>
              <span className="font-mono">{(prevalence * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="0.001" max="0.10" step="0.001" value={prevalence} 
              onChange={(e) => setPrevalence(parseFloat(e.target.value))} 
              className="w-full accent-rose-400 cursor-pointer" 
            />
            <p className="text-[11px] text-slate-400 mt-1">Adjust how rare the disease is in the population.</p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-400">Test Accuracy Rate:</span>
              <span className="font-mono">{(accuracy * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="0.80" max="0.999" step="0.005" value={accuracy} 
              onChange={(e) => setAccuracy(parseFloat(e.target.value))} 
              className="w-full accent-emerald-400 cursor-pointer" 
            />
            <p className="text-[11px] text-slate-400 mt-1">Sensitivity & Specificity of the test.</p>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
            <div>• Sick & Test Positive: {(sickAndPositive * 100).toFixed(3)}%</div>
            <div>• Healthy & False Positive: {(healthyAndFalsePositive * 100).toFixed(3)}%</div>
            <div className="text-amber-400 font-bold">• Total Positive Tests: {(totalPositive * 100).toFixed(3)}%</div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide font-mono mb-2">
              Bayes' Result: P(Disease | Positive Test)
            </h4>

            <div className="p-6 bg-slate-900 rounded-2xl border-2 border-rose-500/40 text-center space-y-2">
              <div className="text-xs text-slate-400 uppercase font-mono">Actual Chance You Have Disease</div>
              <div className="text-4xl font-black text-rose-400 font-mono">
                {truePosterior.toFixed(1)}%
              </div>
              <div className="text-xs text-amber-300 font-medium">
                {truePosterior < 70 ? "⚠️ Drowned out by False Positives!" : "✅ High confidence diagnosis."}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 border border-slate-800 leading-relaxed">
            <strong>Why it happens:</strong> When a disease is very rare, the huge mass of healthy people ({(healthy * 100).toFixed(1)}%) creates enough 1% false positives to match or exceed the true sick cases!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Class 12 Master MCQ Practice Exam (80% Pass Mark) ───
export function Class12ProbabilityMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What does the vertical bar in P(A|B) represent mathematically?",
      options: ["A) Divided by B", "B) Given that Event B has already occurred", "C) Probability of A or B", "D) Absolute value of A"],
      correctIdx: 1,
      explanation: "P(A|B) is Conditional Probability, read as 'Probability of A GIVEN THAT B has occurred'."
    },
    {
      id: 2,
      text: "If P(A) = 0.4 and P(B) = 0.5, and events A and B are INDEPENDENT, what is P(A ∩ B)?",
      options: ["A) 0.90", "B) 0.10", "C) 0.20", "D) 0.00"],
      correctIdx: 2,
      explanation: "For independent events, P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20."
    },
    {
      id: 3,
      text: "If P(A|B) = P(A), what can we conclude about events A and B?",
      options: ["A) They are Mutually Exclusive", "B) They are Independent", "C) P(B) = 0", "D) They are Exhaustive"],
      correctIdx: 1,
      explanation: "If knowing B happened does not change the probability of A happening at all, A and B are Independent."
    },
    {
      id: 4,
      text: "In the Law of Total Probability P(E) = ∑ P(E|Bᵢ)P(Bᵢ), what do the events Bᵢ represent?",
      options: ["A) Independent events", "B) A partition of sample space (Mutually Exclusive & Exhaustive)", "C) Complementary events only", "D) Impossible events"],
      correctIdx: 1,
      explanation: "The events Bᵢ must form a complete partition of the Sample Space S."
    },
    {
      id: 5,
      text: "Bayes' Theorem allows mathematicians to do which of the following?",
      options: ["A) Add probabilities together without subtraction", "B) Reverse conditional probabilities (calculate P(B|A) from P(A|B))", "C) Prove that false positives do not exist", "D) Calculate sample space size"],
      correctIdx: 1,
      explanation: "Bayes' Theorem reverses the direction of conditional probability, going from Effect back to Cause."
    },
    {
      id: 6,
      text: "A die is rolled. Given that the number rolled is EVEN, what is the probability that it is 6?",
      options: ["A) 1/6", "B) 1/2", "C) 1/3", "D) 2/3"],
      correctIdx: 2,
      explanation: "Given even, the sample space shrinks to {2, 4, 6} (size 3). Outcome 6 is 1 of 3, so P = 1/3."
    },
    {
      id: 7,
      text: "In Bayes' Theorem formula P(Cause|Effect) = (Specific Path) / (Total Paths), what does the denominator represent?",
      options: ["A) The Law of Total Probability for the Effect", "B) The probability of the Cause alone", "C) 1.0 always", "D) The false positive rate"],
      correctIdx: 0,
      explanation: "The denominator in Bayes' Theorem is the Law of Total Probability summing all possible branches that lead to the effect."
    },
    {
      id: 8,
      text: "In a medical test for a rare disease affecting 1% of people with 99% test accuracy, why is P(Disease | Positive Test) only 50%?",
      options: ["A) Because the test is broken", "B) Because the large volume of healthy people creates false positives that match true positives", "C) Because 99% accuracy is too low", "D) Because Bayes theorem subtracts 49%"],
      correctIdx: 1,
      explanation: "Due to high rarity (1%), 99% healthy people taking a 99% test generate as many false positives (0.99 × 0.01 = 0.0099) as true positives."
    },
    {
      id: 9,
      text: "If P(A ∩ B) = 0.12 and P(B) = 0.30, what is P(A|B)?",
      options: ["A) 0.36", "B) 0.40", "C) 0.25", "D) 0.18"],
      correctIdx: 1,
      explanation: "P(A|B) = P(A ∩ B) / P(B) = 0.12 / 0.30 = 0.40 (40%)."
    },
    {
      id: 10,
      text: "Two bags contain balls. Bag I has 3 red, 4 black. Bag II has 5 red, 6 black. A ball is drawn and is RED. What is the denominator in Bayes theorem to find P(Bag I | Red)?",
      options: ["A) P(Red|Bag I)P(Bag I) + P(Red|Bag II)P(Bag II)", "B) P(Bag I) + P(Bag II)", "C) 3/7 + 5/11", "D) 1/2"],
      correctIdx: 0,
      explanation: "The denominator is the Law of Total Probability summing the probability of getting a red ball from Bag I and Bag II."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 12 Apex Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 12 Board Exam Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to complete Class 12 Probability!
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
            <div className="bg-gradient-to-r from-amber-500 to-purple-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Class 12 Apex Probability Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified and completed Class 12 Probability!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review the detective narrative and retake the exam to earn your 80% completion badge.</span>
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
