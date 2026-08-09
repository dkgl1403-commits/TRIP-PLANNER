import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── WIDGET 1: Interactive Law of Large Numbers Coin Flip Simulator ───
export function CoinFlipLawOfLargeNumbersWidget() {
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipHistory, setFlipHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const runBatchFlips = (num) => {
    setIsFlipping(true);
    let newHeads = 0;
    let newTails = 0;
    const history = [];

    for (let i = 0; i < num; i++) {
      const isHead = Math.random() < 0.5;
      if (isHead) newHeads++;
      else newTails++;
      if (i < 20) history.push(isHead ? 'H' : 'T');
    }

    setTimeout(() => {
      setHeadsCount((prev) => prev + newHeads);
      setTailsCount((prev) => prev + newTails);
      setTotalFlips((prev) => prev + num);
      setFlipHistory(history);
      setIsFlipping(false);
    }, num > 100 ? 200 : 400);
  };

  const resetExperiment = () => {
    setHeadsCount(0);
    setTailsCount(0);
    setTotalFlips(0);
    setFlipHistory([]);
  };

  const headsPct = totalFlips > 0 ? ((headsCount / totalFlips) * 100).toFixed(2) : '0.00';
  const tailsPct = totalFlips > 0 ? ((tailsCount / totalFlips) * 100).toFixed(2) : '0.00';
  const headsRatio = totalFlips > 0 ? (headsCount / totalFlips).toFixed(4) : '0.0000';

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">Class 9 Probability Simulator</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">The Law of Large Numbers</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Watch chaos turn into perfect order as trial count increases toward the 50% theoretical line
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetExperiment}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => runBatchFlips(10)}
          disabled={isFlipping}
          className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex flex-col items-center"
        >
          <span>Flip 10 Times</span>
          <span className="text-[10px] text-blue-200 font-normal">Small Sample (High Chaos)</span>
        </button>

        <button
          onClick={() => runBatchFlips(100)}
          disabled={isFlipping}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex flex-col items-center"
        >
          <span>Flip 100 Times</span>
          <span className="text-[10px] text-indigo-200 font-normal">Medium Sample</span>
        </button>

        <button
          onClick={() => runBatchFlips(1000)}
          disabled={isFlipping}
          className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex flex-col items-center"
        >
          <span>Flip 1,000 Times</span>
          <span className="text-[10px] text-purple-200 font-normal">Large Sample</span>
        </button>

        <button
          onClick={() => runBatchFlips(5000)}
          disabled={isFlipping}
          className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex flex-col items-center"
        >
          <span>Flip 5,000 Times</span>
          <span className="text-[10px] text-emerald-200 font-normal">Massive Scale (Order)</span>
        </button>
      </div>

      {/* Main Display Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Statistics Card */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between font-mono text-xs">
          <span className="text-slate-400 font-sans text-xs font-bold block mb-2">Total Trials (Flips):</span>
          <span className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">{totalFlips.toLocaleString()}</span>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="flex justify-between">
              <span className="text-blue-400">Heads (H):</span>
              <span className="text-white font-bold">{headsCount.toLocaleString()} ({headsPct}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-400">Tails (T):</span>
              <span className="text-white font-bold">{tailsCount.toLocaleString()} ({tailsPct}%)</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
              <span className="text-slate-300">Empirical P(H):</span>
              <span className="text-emerald-400">{headsRatio}</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualizer */}
        <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-bold text-xs">Empirical Distribution vs 50% Theoretical Target</span>
            <span className="text-emerald-400 font-mono text-xs">Target Line: 50.00%</span>
          </div>

          <div className="space-y-5">
            {/* Heads Bar */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Heads (H)</span>
                <span className="text-blue-400 font-bold">{headsPct}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-6 p-1 relative overflow-hidden border border-slate-800">
                {/* 50% Target Line Marker */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-400 z-10 opacity-70"></div>
                <motion.div
                  className="bg-blue-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, parseFloat(headsPct))}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Tails Bar */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Tails (T)</span>
                <span className="text-rose-400 font-bold">{tailsPct}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-6 p-1 relative overflow-hidden border border-slate-800">
                {/* 50% Target Line Marker */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-400 z-10 opacity-70"></div>
                <motion.div
                  className="bg-rose-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, parseFloat(tailsPct))}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Educational Insight Banner */}
          <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans">
            {totalFlips === 0 ? (
              <p>💡 Click any button above to start flipping coins and observe the empirical probability!</p>
            ) : totalFlips < 100 ? (
              <p className="text-amber-300">
                ⚠️ <strong>Small Sample Alert:</strong> With only {totalFlips} flips, randomness dominates. P(H) is {headsPct}%, which deviates from 50%.
              </p>
            ) : (
              <p className="text-emerald-300">
                ✨ <strong>Law of Large Numbers at Work:</strong> At {totalFlips.toLocaleString()} flips, P(H) is {headsPct}%, snapping right to the 50% line!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Flip Sequence Chips */}
      {flipHistory.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs">
          <span className="text-slate-400 block text-[10px] mb-2 uppercase tracking-wider font-bold">Recent Flip Sequence Sample:</span>
          <div className="flex flex-wrap gap-2">
            {flipHistory.map((item, idx) => (
              <span
                key={idx}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  item === 'H' ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-rose-900 text-rose-300 border border-rose-700'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WIDGET 2: Malegaon Light Bulb Factory Calculator Widget ───
export function FaultyMachineCalculatorWidget() {
  const [sampleSize, setSampleSize] = useState(500);
  const [defectiveCount, setDefectiveCount] = useState(15);
  const [futureProduction, setFutureProduction] = useState(2000);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const empiricalProb = sampleSize > 0 ? defectiveCount / sampleSize : 0;
  const empiricalPct = (empiricalProb * 100).toFixed(2);
  const expectedDefective = Math.round(futureProduction * empiricalProb);

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">Class 9 Practice Problem</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Malegaon Light Bulb Factory Calculator</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Calculate empirical probability of defects and predict future batch defect counts
          </p>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
        >
          {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Input Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 font-mono text-xs">
        {/* Input 1: Sample Size */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Tested Sample Size:</span>
            <span className="text-blue-400 font-bold text-sm">{sampleSize} Bulbs</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value) || 100)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Input 2: Defective Count */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Defective Count Observed:</span>
            <span className="text-rose-400 font-bold text-sm">{defectiveCount} Bulbs</span>
          </div>
          <input
            type="range"
            min="1"
            max={Math.min(100, sampleSize)}
            step="1"
            value={defectiveCount}
            onChange={(e) => setDefectiveCount(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Input 3: Future Production */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Tomorrow's Total Production:</span>
            <span className="text-amber-400 font-bold text-sm">{futureProduction} Bulbs</span>
          </div>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={futureProduction}
            onChange={(e) => setFutureProduction(parseInt(e.target.value) || 500)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Output Results Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="text-white font-bold text-sm">Empirical Probability & Prediction Summary</span>
          <span className="text-amber-400 font-bold">P(D) = {defectiveCount} / {sampleSize}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-sans">Q1: Empirical Probability P(Defective):</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-400">{empiricalProb.toFixed(4)}</span>
              <span className="text-slate-400">({empiricalPct}%)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-sans">Q2: Expected Defective Bulbs ({futureProduction} Batch):</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-400">{expectedDefective} Bulbs</span>
              <span className="text-slate-400">out of {futureProduction}</span>
            </div>
          </div>
        </div>

        {/* Blackboard Step-by-Step Breakdown */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 font-sans text-xs space-y-2 text-slate-300">
          <span className="font-mono font-bold text-amber-400 block text-xs">📝 Chalkboard Formula Step-by-Step:</span>
          <p>
            1. Empirical Probability: <code className="text-blue-300 font-mono">P(D) = {defectiveCount} / {sampleSize} = {empiricalProb.toFixed(4)}</code> ({empiricalPct}%)
          </p>
          <p>
            2. Expected Defective Bulbs: <code className="text-emerald-300 font-mono">Expected = {futureProduction} × {empiricalProb.toFixed(4)} = {expectedDefective}</code> defective bulbs expected tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Chevalier de Méré 1654 Gambler Dice Simulator ───
export function ProbabilityHistoryTimelineWidget() {
  const [diceRolls, setDiceRolls] = useState([]);
  const [wins, setWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showProof, setShowProof] = useState(true);

  const rollDiceGame = () => {
    // Chevalier de Méré game: Roll a die 4 times. Win if at least one '6' appears!
    let won = false;
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      rolls.push(val);
      if (val === 6) won = true;
    }
    setDiceRolls(rolls);
    setTotalGames((prev) => prev + 1);
    if (won) setWins((prev) => prev + 1);
  };

  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : '0.00';

  return (
    <div className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 font-sans shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[10px] block font-mono">1654 History Visualizer</span>
          <h3 className="text-lg font-bold text-white">Chevalier de Méré's Dice Game (Pascal & Fermat)</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProof(!showProof)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            {showProof ? '📐 Hide Proof' : '📐 Show Proof (51.77%)'}
          </button>
          <button
            onClick={rollDiceGame}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            🎲 Roll 4 Dice (1 Game)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <span className="text-slate-400 font-sans block">Current Game 4-Dice Roll:</span>
          <div className="flex gap-2">
            {diceRolls.length > 0 ? (
              diceRolls.map((d, idx) => (
                <span
                  key={idx}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    d === 6 ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans">Click 'Roll 4 Dice' to play</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Total Dice Games:</span>
            <span className="text-white font-bold">{totalGames}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Games Won (At least one '6'):</span>
            <span className="text-emerald-400 font-bold">{wins}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800 pt-1">
            <span className="text-slate-300 font-sans font-bold">Empirical Win Rate:</span>
            <span className="text-amber-400 font-bold">{winRate}% (Theoretical: 51.77%)</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Mathematical Derivation Box */}
      {showProof && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-sans space-y-3"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-mono font-bold text-amber-400 text-xs">
              🧮 Mathematical Derivation: How is the 51.77% Theoretical Rate Calculated?
            </span>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
              Pascal & Fermat Proof (1654)
            </span>
          </div>

          <div className="space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
            <p>
              <strong className="text-white font-sans">Rule:</strong> You roll 1 fair die 4 times. You win if you get <em>at least one '6'</em>.
            </p>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Step 1: P(NOT getting a 6 on 1 roll) =</span>
                <span className="text-blue-300 font-bold">5 / 6 ≈ 0.8333</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Step 2: P(NOT getting a 6 on ALL 4 rolls) =</span>
                <span className="text-rose-400 font-bold">(5/6)⁴ = 625 / 1296 ≈ 0.48225 (48.23%)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 text-xs">
                <span className="text-emerald-400 font-bold">Step 3: P(At least one '6') = 1 - P(No '6' on 4 rolls) =</span>
                <span className="text-amber-400 font-bold text-sm">1 - 0.48225 = 0.51775 → 51.77%</span>
              </div>
            </div>

            <p className="text-slate-400 font-sans text-xs italic">
              💡 <strong>Historical Insight:</strong> Because 51.77% is slightly greater than 50.00%, Chevalier de Méré had a small 1.77% mathematical edge in the casino, making him rich over thousands of games!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── WIDGET 7: 10-Question Interactive MCQ Practice Exam Engine ───
export function ProbabilityMCQPracticeWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const questions = [
    {
      id: 1,
      text: "If P(E) = 0.07, what is the probability of P(NOT E), i.e., P(Ē)?",
      options: ["A) 0.07", "B) 0.93", "C) 0.70", "D) 0.03"],
      correctIdx: 1,
      explanation: "Using the complementary formula: P(Ē) = 1 - P(E) = 1 - 0.07 = 0.93."
    },
    {
      id: 2,
      text: "Which of the following CANNOT be the probability of an event?",
      options: ["A) 2/3", "B) -1.5", "C) 15%", "D) 0.7"],
      correctIdx: 1,
      explanation: "Every probability must satisfy 0 ≤ P(E) ≤ 1. A negative number like -1.5 is impossible."
    },
    {
      id: 3,
      text: "An event is extremely unlikely to happen. Its probability is closest to:",
      options: ["A) 0.0001", "B) 0.1000", "C) 0.0100", "D) 0.9999"],
      correctIdx: 0,
      explanation: "The closer a probability is to 0, the more unlikely the event is. 0.0001 is closest to 0."
    },
    {
      id: 4,
      text: "What is the probability of rolling a sum of 13 when two standard 6-sided dice are tossed?",
      options: ["A) 1/36", "B) 1/6", "C) 0", "D) 1"],
      correctIdx: 2,
      explanation: "The maximum possible sum on two 6-sided dice is 6 + 6 = 12. Sum 13 is an impossible event (P = 0)."
    },
    {
      id: 5,
      text: "The probability that a randomly chosen LEAP YEAR contains 53 Sundays is:",
      options: ["A) 1/7", "B) 2/7", "C) 3/7", "D) 53/366"],
      correctIdx: 1,
      explanation: "A leap year has 366 days = 52 weeks + 2 extra days. Out of 7 day-pair combinations, 2 contain Sunday (Sun-Mon, Sat-Sun). P = 2/7."
    },
    {
      id: 6,
      text: "A card is drawn from a well-shuffled deck of 52 cards. What is the probability of getting a RED FACE card?",
      options: ["A) 3/13", "B) 3/26", "C) 1/26", "D) 1/13"],
      correctIdx: 1,
      explanation: "There are 6 red face cards (J, Q, K of Hearts and Diamonds). P = 6/52 = 3/26."
    },
    {
      id: 7,
      text: "A bag contains 3 red balls and 5 black balls. A ball is drawn at random. The probability of getting a BLACK ball is:",
      options: ["A) 3/8", "B) 5/8", "C) 3/5", "D) 1/8"],
      correctIdx: 1,
      explanation: "Total balls = 3 + 5 = 8. Black balls = 5. P(Black) = 5/8."
    },
    {
      id: 8,
      text: "The probability that an ORDINARY (non-leap) year contains 53 Sundays is:",
      options: ["A) 1/7", "B) 2/7", "C) 53/365", "D) 52/365"],
      correctIdx: 0,
      explanation: "An ordinary year has 365 days = 52 weeks + 1 extra day. Out of 7 days of the week, 1 is Sunday. P = 1/7."
    },
    {
      id: 9,
      text: "Two fair coins are tossed simultaneously. What is the probability of getting AT LEAST ONE Head?",
      options: ["A) 1/4", "B) 1/2", "C) 3/4", "D) 1"],
      correctIdx: 2,
      explanation: "Sample Space = {(H,H), (H,T), (T,H), (T,T)}. 3 outcomes contain at least 1 Head. P = 3/4."
    },
    {
      id: 10,
      text: "A number x is chosen at random from numbers -3, -2, -1, 0, 1, 2, 3. What is the probability that |x| < 2?",
      options: ["A) 3/7", "B) 2/7", "C) 5/7", "D) 1/7"],
      correctIdx: 0,
      explanation: "|x| < 2 means x can be -1, 0, or 1. There are 3 favorable numbers out of 7 total numbers. P = 3/7."
    }
  ];

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
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsAnswered(false);
  };

  const currentQ = questions[currentIdx];

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Board Exam Practice Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">10 High-Yield Probability MCQs</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Test your knowledge with immediate step-by-step feedback and score tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold text-xs rounded-xl">
            Score: {score} / {questions.length}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 font-mono text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-sans">
          <span className="text-amber-400 font-bold text-xs">Question {currentIdx + 1} of {questions.length}</span>
          <span className="text-slate-400 text-xs">Topic: Class 10 Board Exam Practice</span>
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

        {/* Explanation & Next Button */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-sans"
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${selectedOpt === currentQ.correctIdx ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedOpt === currentQ.correctIdx ? '✅ Correct!' : '❌ Incorrect'}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{currentQ.explanation}</p>

            <div className="flex justify-end pt-2">
              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Next Question ➔
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  🎉 Exam Complete! Retake Exam
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── WIDGET 4: Two Dice Sample Space Grid (36 Outcomes) ───
export function TwoDiceSampleSpaceWidget() {
  const [targetSum, setTargetSum] = useState(7);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate 6x6 grid
  const diceValues = [1, 2, 3, 4, 5, 6];

  let favorablePairs = [];
  for (let d1 of diceValues) {
    for (let d2 of diceValues) {
      if (d1 + d2 === targetSum) {
        favorablePairs.push([d1, d2]);
      }
    }
  }

  const favorableCount = favorablePairs.length;
  const probFraction = `${favorableCount}/36`;
  const probDecimal = (favorableCount / 36).toFixed(4);
  const probPct = ((favorableCount / 36) * 100).toFixed(2);

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 10 Theoretical Probability</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Rolling Two Dice: 36 Sample Space Grid</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Select a target sum to see the matching dice combinations light up across all 36 possible outcomes
          </p>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
        >
          {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Target Sum Selector Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sum) => (
          <button
            key={sum}
            onClick={() => setTargetSum(sum)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow ${
              targetSum === sum
                ? 'bg-amber-500 text-slate-950 scale-105 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sum = {sum}
          </button>
        ))}
      </div>

      {/* 36 Grid Matrix & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 6x6 Grid */}
        <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 text-xs font-mono block mb-3 text-center">
            Die 1 (Rows) × Die 2 (Columns)
          </span>
          <div className="grid grid-cols-6 gap-2 font-mono text-xs">
            {diceValues.map((d1) =>
              diceValues.map((d2) => {
                const sum = d1 + d2;
                const isFavorable = sum === targetSum;
                return (
                  <div
                    key={`${d1}-${d2}`}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isFavorable
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg scale-105 z-10'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px]">({d1},{d2})</span>
                    <span className={`text-xs font-bold ${isFavorable ? 'text-slate-950' : 'text-slate-200'}`}>
                      Sum={sum}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Calculation Panel */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between font-mono text-xs space-y-4">
          <div>
            <span className="text-slate-400 font-sans block text-xs mb-1">Target Event:</span>
            <h3 className="text-lg font-bold text-amber-400">Sum of Die 1 + Die 2 = {targetSum}</h3>
          </div>

          <div className="space-y-3 border-t border-b border-slate-800 py-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Sample Space N(S):</span>
              <span className="text-white font-bold">36 outcomes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Favorable Pairs N(E):</span>
              <span className="text-amber-400 font-bold">{favorableCount} pairs</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-slate-800">
              <span className="text-slate-200 font-bold">Theoretical P(Sum={targetSum}):</span>
              <span className="text-emerald-400 font-bold">{probFraction} ({probPct}%)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-sans text-xs text-slate-300">
            <span className="font-mono text-amber-400 font-bold block text-[11px]">Matching Favorable Pairs:</span>
            <p className="font-mono text-blue-300">
              {favorablePairs.map((pair) => `(${pair[0]},${pair[1]})`).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Complementary Events & Bag of Marbles Widget ───
export function ComplementaryEventBagWidget() {
  const [redCount, setRedCount] = useState(3);
  const [blueCount, setBlueCount] = useState(5);
  const [greenCount, setGreenCount] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalMarbles = redCount + blueCount + greenCount;

  // Probability calculations
  const pGreen = totalMarbles > 0 ? (greenCount / totalMarbles).toFixed(4) : 0;
  const pGreenPct = (pGreen * 100).toFixed(2);

  const pNotGreenDirect = totalMarbles > 0 ? ((redCount + blueCount) / totalMarbles).toFixed(4) : 0;
  const pNotGreenShortcut = (1 - pGreen).toFixed(4);
  const pNotGreenPct = (pNotGreenShortcut * 100).toFixed(2);

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 10 Core Concept</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Complementary Events: The "Bag of Marbles"</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Master the power of "NOT" using the shortcut: P(Not E) = 1 - P(E)
          </p>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
        >
          {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 font-mono text-xs">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-rose-400 font-bold">🔴 Red Marbles:</span>
            <span className="text-white font-bold">{redCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={redCount}
            onChange={(e) => setRedCount(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-400 font-bold">🔵 Blue Marbles:</span>
            <span className="text-white font-bold">{blueCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={blueCount}
            onChange={(e) => setBlueCount(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-emerald-400 font-bold">🟢 Green Marbles:</span>
            <span className="text-white font-bold">{greenCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={greenCount}
            onChange={(e) => setGreenCount(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Urn Visualization & Formula Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Urn Visual Box */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-bold font-sans">The Urn (Total = {totalMarbles} Marbles)</span>
            <span className="text-amber-400">Sample Space N(S) = {totalMarbles}</span>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap gap-2 justify-center min-h-[100px] items-center">
            {Array.from({ length: redCount }).map((_, i) => (
              <span key={`r-${i}`} className="w-6 h-6 rounded-full bg-rose-500 shadow-md border border-rose-300"></span>
            ))}
            {Array.from({ length: blueCount }).map((_, i) => (
              <span key={`b-${i}`} className="w-6 h-6 rounded-full bg-blue-500 shadow-md border border-blue-300"></span>
            ))}
            {Array.from({ length: greenCount }).map((_, i) => (
              <span key={`g-${i}`} className="w-6 h-6 rounded-full bg-emerald-500 shadow-md border border-emerald-300"></span>
            ))}
          </div>
        </div>

        {/* Calculation Box */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-white font-bold text-sm">Complementary Formula Derivation</span>
            <span className="text-emerald-400 font-bold">P(E) + P(Ē) = 1</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">P(Green) =</span>
              <span className="text-emerald-400 font-bold">{greenCount}/{totalMarbles} = {pGreen} ({pGreenPct}%)</span>
            </div>

            <div className="flex justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Direct P(NOT Green) =</span>
              <span className="text-blue-400 font-bold">({redCount}+{blueCount})/{totalMarbles} = {pNotGreenDirect}</span>
            </div>

            <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl space-y-1">
              <span className="text-amber-400 font-bold block text-[11px]">✨ Complement Shortcut Rule:</span>
              <p className="text-slate-200 text-[11px]">
                P(NOT Green) = 1 - P(Green) = 1 - ({greenCount}/{totalMarbles}) = <strong className="text-amber-300">{pNotGreenShortcut} ({pNotGreenPct}%)</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 6: The Infamous Leap Year 53 Sundays Puzzle ───
export function LeapYearPuzzleWidget() {
  const [isLeapYear, setIsLeapYear] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalDays = isLeapYear ? 366 : 365;
  const extraDaysCount = isLeapYear ? 2 : 1;

  // 7 possible pairs for extra 2 days in leap year
  const leapPairs = [
    { days: 'Sunday, Monday', containsSun: true },
    { days: 'Monday, Tuesday', containsSun: false },
    { days: 'Tuesday, Wednesday', containsSun: false },
    { days: 'Wednesday, Thursday', containsSun: false },
    { days: 'Thursday, Friday', containsSun: false },
    { days: 'Friday, Saturday', containsSun: false },
    { days: 'Saturday, Sunday', containsSun: true }
  ];

  // 7 single days for extra 1 day in non-leap year
  const nonLeapDays = [
    { days: 'Sunday', containsSun: true },
    { days: 'Monday', containsSun: false },
    { days: 'Tuesday', containsSun: false },
    { days: 'Wednesday', containsSun: false },
    { days: 'Thursday', containsSun: false },
    { days: 'Friday', containsSun: false },
    { days: 'Saturday', containsSun: false }
  ];

  const currentSampleSpace = isLeapYear ? leapPairs : nonLeapDays;
  const favorableCount = isLeapYear ? 2 : 1;
  const probFraction = `${favorableCount}/7`;
  const probPct = ((favorableCount / 7) * 100).toFixed(2);

  return (
    <div
      className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans transition-all border border-slate-800 ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto'
          : 'rounded-2xl shadow-2xl h-full'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Indian Board Exam Classic Puzzle</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">The Infamous Leap Year Puzzle (53 Sundays)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Calculate the exact theoretical probability of having 53 Sundays in a Leap Year vs Non-Leap Year
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setIsLeapYear(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isLeapYear ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📅 Leap Year (366 Days)
            </button>
            <button
              onClick={() => setIsLeapYear(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isLeapYear ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📆 Ordinary Year (365 Days)
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all"
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs mb-6">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-sans block">Total Days in Year:</span>
          <span className="text-2xl font-bold text-white">{totalDays} Days</span>
          <span className="text-[10px] text-amber-400 block font-sans">
            52 Complete Weeks (364 Days) = 52 Guaranteed Sundays
          </span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-sans block">Remaining Extra Days:</span>
          <span className="text-2xl font-bold text-amber-400">{extraDaysCount} Extra Day(s)</span>
          <span className="text-[10px] text-slate-400 block font-sans">
            ({totalDays} - 364 = {extraDaysCount} days remaining)
          </span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-sans block">P(Exactly 53 Sundays):</span>
          <span className="text-2xl font-bold text-emerald-400">{probFraction} ({probPct}%)</span>
          <span className="text-[10px] text-emerald-300 block font-sans">
            {favorableCount} favorable out of 7 possible day pairs
          </span>
        </div>
      </div>

      {/* Sample Space Grid for Remaining Extra Days */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 font-mono text-xs">
        <span className="text-white font-bold font-sans block">
          Sample Space N(S) = 7 Possible Combinations for the Extra {extraDaysCount} Day(s):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {currentSampleSpace.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                item.containsSun
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[10px] text-slate-400">Combination #{idx + 1}</span>
              <span className="font-bold text-xs my-1 text-white">{item.days}</span>
              <span
                className={`text-[10px] font-bold ${
                  item.containsSun ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {item.containsSun ? '✅ Contains Sunday (53rd)' : '❌ No Sunday'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
