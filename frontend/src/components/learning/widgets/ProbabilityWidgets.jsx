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
