import React, { useState } from 'react';

// ─── WIDGET 1: Factors & Multiples Visualizer (Mental Model) ───
export function Class6FactorsMultiplesVisualizerWidget() {
  const [numA, setNumA] = useState(12);
  const [numB, setNumB] = useState(18);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate factors
  const getFactors = (n) => {
    const factors = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i);
    }
    return factors;
  };

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const factorsA = getFactors(numA);
  const factorsB = getFactors(numB);
  const commonFactors = factorsA.filter((f) => factorsB.includes(f));
  const hcfVal = gcd(numA, numB);
  const lcmVal = lcm(numA, numB);

  // Multiples up to LCM + extra steps
  const multiplesA = Array.from({ length: Math.min(10, Math.ceil(lcmVal / numA) + 2) }, (_, i) => numA * (i + 1));
  const multiplesB = Array.from({ length: Math.min(10, Math.ceil(lcmVal / numB) + 2) }, (_, i) => numB * (i + 1));

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Lesson 1 Visualizer</span>
          <h3 className="text-xl font-bold text-white">Factors vs. Multiples Explorer</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* Controls Column */}
        <div className="space-y-4 font-mono text-xs">
          <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Input Numbers</span>
          
          <div className="space-y-2">
            <label className="block text-slate-300">Number A:</label>
            <input 
              type="number" min="2" max="60" value={numA} 
              onChange={(e) => setNumA(Math.max(2, Math.min(60, parseInt(e.target.value) || 2)))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-amber-400 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-300">Number B:</label>
            <input 
              type="number" min="2" max="60" value={numB} 
              onChange={(e) => setNumB(Math.max(2, Math.min(60, parseInt(e.target.value) || 2)))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sky-400 font-bold"
            />
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-sans">
            <div className="text-emerald-400 font-bold text-xs">💡 Key Intuition:</div>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong>HCF ({hcfVal})</strong> is smaller or equal to inputs — it <em>builds</em> them.<br/>
              <strong>LCM ({lcmVal})</strong> is larger or equal to inputs — they <em>grow</em> into it.
            </p>
          </div>
        </div>

        {/* Factors Column (Divisors) */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Factors (Divisors)</span>
          
          <div>
            <div className="text-slate-400 mb-1">Factors of {numA}:</div>
            <div className="flex flex-wrap gap-1.5">
              {factorsA.map(f => (
                <span key={f} className={`px-2.5 py-1 rounded-lg border ${f === hcfVal ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' : commonFactors.includes(f) ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-400 mb-1">Factors of {numB}:</div>
            <div className="flex flex-wrap gap-1.5">
              {factorsB.map(f => (
                <span key={f} className={`px-2.5 py-1 rounded-lg border ${f === hcfVal ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md' : commonFactors.includes(f) ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400 text-center font-bold">
            HCF (Largest Common Factor) = {hcfVal}
          </div>
        </div>

        {/* Multiples Column (Growth Trails) */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-xs uppercase font-bold text-sky-400 block font-sans">Multiples (Growth Trails)</span>

          <div>
            <div className="text-slate-400 mb-1">Multiples of {numA}:</div>
            <div className="flex flex-wrap gap-1.5">
              {multiplesA.map(m => (
                <span key={m} className={`px-2.5 py-1 rounded-lg border ${m === lcmVal ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md' : multiplesB.includes(m) ? 'bg-sky-950 text-sky-300 border-sky-800' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-400 mb-1">Multiples of {numB}:</div>
            <div className="flex flex-wrap gap-1.5">
              {multiplesB.map(m => (
                <span key={m} className={`px-2.5 py-1 rounded-lg border ${m === lcmVal ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md' : multiplesA.includes(m) ? 'bg-sky-950 text-sky-300 border-sky-800' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400 text-center font-bold">
            LCM (Lowest Common Multiple) = {lcmVal}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: HCF Factor Brick & Euclidean Long Division Simulator ───
export function Class6FactorBrickHCFWidget() {
  const [val1, setVal1] = useState(12);
  const [val2, setVal2] = useState(18);
  const [activeTab, setActiveTab] = useState('bricks'); // 'bricks' or 'euclid'
  const [collectedBricks, setCollectedBricks] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPrimeFactors = (n) => {
    const factors = [];
    let d = 2;
    let temp = n;
    while (temp >= 2) {
      if (temp % d === 0) {
        factors.push(d);
        temp = temp / d;
      } else {
        d++;
      }
    }
    return factors;
  };

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const pf1 = getPrimeFactors(val1);
  const pf2 = getPrimeFactors(val2);
  const targetHcf = gcd(val1, val2);

  // Common prime factors for brick mode
  const getCommonPrimes = (a1, a2) => {
    const count1 = {};
    const count2 = {};
    a1.forEach(x => count1[x] = (count1[x] || 0) + 1);
    a2.forEach(x => count2[x] = (count2[x] || 0) + 1);

    const common = [];
    Object.keys(count1).forEach(p => {
      const pNum = parseInt(p);
      const minCount = Math.min(count1[pNum] || 0, count2[pNum] || 0);
      for (let i = 0; i < minCount; i++) common.push(pNum);
    });
    return common;
  };

  const commonPrimes = getCommonPrimes(pf1, pf2);
  const currentHcfVal = collectedBricks.reduce((acc, curr) => acc * curr, 1);
  const isHcfComplete = currentHcfVal === targetHcf;

  const handleAddBrick = (p) => {
    // allow adding if count of p in collectedBricks < count in commonPrimes
    const currentCount = collectedBricks.filter(x => x === p).length;
    const maxAllowed = commonPrimes.filter(x => x === p).length;
    if (currentCount < maxAllowed) {
      setCollectedBricks([...collectedBricks, p]);
    }
  };

  const handleResetBricks = () => {
    setCollectedBricks([]);
  };

  // Euclidean long division steps
  const getEuclideanSteps = (a, b) => {
    let large = Math.max(a, b);
    let small = Math.min(a, b);
    const steps = [];

    while (small > 0) {
      const q = Math.floor(large / small);
      const rem = large % small;
      steps.push({ dividend: large, divisor: small, quotient: q, remainder: rem });
      large = small;
      small = rem;
    }
    return steps;
  };

  const euclidSteps = getEuclideanSteps(val1, val2);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Lesson 2 HCF Visualizer</span>
          <h3 className="text-xl font-bold text-white">Highest Common Factor (HCF) Simulator</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button 
              onClick={() => setActiveTab('bricks')} 
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'bricks' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Prime Bricks Method
            </button>
            <button 
              onClick={() => setActiveTab('euclid')} 
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'euclid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Continued Division Method
            </button>
          </div>

          <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Value 1:</label>
          <input 
            type="number" min="2" max="180" value={val1} 
            onChange={(e) => { setVal1(Math.max(2, Math.min(180, parseInt(e.target.value) || 2))); setCollectedBricks([]); }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-400 font-bold"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Value 2:</label>
          <input 
            type="number" min="2" max="180" value={val2} 
            onChange={(e) => { setVal2(Math.max(2, Math.min(180, parseInt(e.target.value) || 2))); setCollectedBricks([]); }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-400 font-bold"
          />
        </div>
      </div>

      {activeTab === 'bricks' ? (
        /* Prime Bricks Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="space-y-4 font-mono text-xs">
            <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Prime Factor Bricks</span>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-300 font-bold">{val1} = {pf1.join(' × ')}</div>
              <div className="flex gap-1.5">
                {pf1.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-lg">
                    [{p}]
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-300 font-bold">{val2} = {pf2.join(' × ')}</div>
              <div className="flex gap-1.5">
                {pf2.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-lg">
                    [{p}]
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-sans">
              <div className="text-amber-400 font-bold text-xs">💡 Storage Crate Challenge:</div>
              <p className="text-slate-300 text-xs">
                Click to collect common prime bricks present in BOTH numbers (lowest power rule).
              </p>
              <div className="flex gap-2 pt-2">
                {[...new Set(commonPrimes)].map(p => (
                  <button 
                    key={p} 
                    onClick={() => handleAddBrick(p)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    + Add Brick [{p}]
                  </button>
                ))}
                <button onClick={handleResetBricks} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
                  Reset 🔄
                </button>
              </div>
            </div>
          </div>

          {/* HCF Container */}
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center space-y-4">
            <span className="text-xs uppercase font-bold text-emerald-400 block font-sans">HCF Storage Crate</span>

            <div className="w-full min-h-[120px] bg-slate-950 border-2 border-dashed border-emerald-500/40 rounded-2xl p-4 flex flex-wrap justify-center items-center gap-2">
              {collectedBricks.length > 0 ? (
                collectedBricks.map((b, idx) => (
                  <span key={idx} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg animate-bounce">
                    [{b}]
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-xs font-mono">Empty Crate — Collect Common Bricks</span>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 w-full font-mono text-xs space-y-1">
              <div className="text-slate-400">Current HCF Product:</div>
              <div className="text-xl font-bold text-emerald-400">{currentHcfVal}</div>
              {isHcfComplete && (
                <div className="text-emerald-400 font-bold text-xs pt-1">🎉 Perfect! HCF ({targetHcf}) Storage Crate Assembled!</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Continued Division Mode */
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <span className="text-xs uppercase font-bold text-amber-400 block font-sans">Continued Long Division Ladder (Euclidean Algorithm)</span>
          <p className="text-slate-300 font-sans text-xs">
            Divide the larger number by the smaller number. Then make the remainder the NEW divisor and repeat until remainder is 0!
          </p>

          <div className="space-y-3 pt-2">
            {euclidSteps.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-amber-400 font-bold">Step {idx + 1}:</div>
                <div className="text-slate-200">
                  {step.dividend} ÷ {step.divisor} = <strong>Quotient: {step.quotient}</strong>, 
                  <strong className={step.remainder === 0 ? 'text-emerald-400' : 'text-amber-400'}> Remainder: {step.remainder}</strong>
                </div>
                {step.remainder > 0 ? (
                  <div className="text-slate-400 text-[11px] italic">
                    ↳ Next Divisor becomes {step.remainder}, Next Dividend becomes {step.divisor}
                  </div>
                ) : (
                  <div className="text-emerald-400 font-bold text-xs pt-1">
                    ✓ Remainder is 0! Final Divisor is HCF = {step.divisor}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WIDGET 3: LCM Factor Brick Simulator ───
export function Class6FactorBrickLCMWidget() {
  const [val1, setVal1] = useState(12);
  const [val2, setVal2] = useState(18);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPrimeFactors = (n) => {
    const factors = [];
    let d = 2;
    let temp = n;
    while (temp >= 2) {
      if (temp % d === 0) {
        factors.push(d);
        temp = temp / d;
      } else {
        d++;
      }
    }
    return factors;
  };

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const pf1 = getPrimeFactors(val1);
  const pf2 = getPrimeFactors(val2);
  const targetLcm = lcm(val1, val2);

  // Highest powers of each prime factor
  const getLcmPrimes = (a1, a2) => {
    const count1 = {};
    const count2 = {};
    a1.forEach(x => count1[x] = (count1[x] || 0) + 1);
    a2.forEach(x => count2[x] = (count2[x] || 0) + 1);

    const allPrimes = [...new Set([...Object.keys(count1), ...Object.keys(count2)])].map(Number);
    const lcmList = [];

    allPrimes.forEach(p => {
      const maxPower = Math.max(count1[p] || 0, count2[p] || 0);
      for (let i = 0; i < maxPower; i++) lcmList.push(p);
    });

    return lcmList;
  };

  const lcmPrimes = getLcmPrimes(pf1, pf2);

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-sky-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Lesson 3 LCM Visualizer</span>
          <h3 className="text-xl font-bold text-white">Lowest Common Multiple (LCM) Simulator</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Value 1:</label>
          <input 
            type="number" min="2" max="60" value={val1} 
            onChange={(e) => setVal1(Math.max(2, Math.min(60, parseInt(e.target.value) || 2)))}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sky-400 font-bold"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Value 2:</label>
          <input 
            type="number" min="2" max="60" value={val2} 
            onChange={(e) => setVal2(Math.max(2, Math.min(60, parseInt(e.target.value) || 2)))}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sky-400 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-4 font-mono text-xs">
          <span className="text-xs uppercase font-bold text-sky-400 block font-sans">Highest Power Rule</span>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="text-slate-300 font-bold">{val1} = {pf1.join(' × ')}</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="text-slate-300 font-bold">{val2} = {pf2.join(' × ')}</div>
          </div>

          <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-sky-300 font-sans space-y-1">
            <span className="font-bold text-sky-400 block">💡 Minimal Set Assembly:</span>
            Take the highest power of every prime factor present in either number to build the LCM train!
          </div>
        </div>

        {/* LCM Train Container */}
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs uppercase font-bold text-sky-400 block font-sans">LCM Train Car Assembly</span>

          <div className="w-full min-h-[120px] bg-slate-950 border-2 border-dashed border-sky-500/40 rounded-2xl p-4 flex flex-wrap justify-center items-center gap-2">
            {lcmPrimes.map((b, idx) => (
              <span key={idx} className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg">
                [{b}]
              </span>
            ))}
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 w-full font-mono text-xs space-y-1">
            <div className="text-slate-400">LCM Product ({lcmPrimes.join(' × ')}):</div>
            <div className="text-xl font-bold text-sky-400">{targetLcm}</div>
            <div className="text-sky-400 font-bold text-xs pt-1">✓ Smallest common multiple station!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: Synchronized Bell Tower Simulator ───
export function Class6SynchronizedBellsWidget() {
  const [intervalA, setIntervalA] = useState(12); // Bell A interval in seconds
  const [intervalB, setIntervalB] = useState(18); // Bell B interval in seconds
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcmVal = (intervalA * intervalB) / gcd(intervalA, intervalB);

  React.useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev >= lcmVal + 6) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, lcmVal]);

  const bellATolls = time > 0 && time % intervalA === 0;
  const bellBTolls = time > 0 && time % intervalB === 0;
  const synchronizedToll = bellATolls && bellBTolls;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Synchronized Bells Metaphor</span>
          <h3 className="text-xl font-bold text-white">LCM Real-World Synchronized Bells</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* Visual Stage */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex justify-around w-full">
            {/* Bell A */}
            <div className={`p-6 rounded-2xl border text-center transition-all ${bellATolls ? 'bg-amber-500 text-slate-950 border-amber-400 scale-110 shadow-2xl' : 'bg-slate-900 text-slate-300 border-slate-800'}`}>
              <div className="text-4xl mb-1">🔔</div>
              <div className="font-mono text-xs font-bold">Bell A</div>
              <div className="font-mono text-[11px] opacity-80">Every {intervalA} sec</div>
            </div>

            {/* Bell B */}
            <div className={`p-6 rounded-2xl border text-center transition-all ${bellBTolls ? 'bg-sky-500 text-slate-950 border-sky-400 scale-110 shadow-2xl' : 'bg-slate-900 text-slate-300 border-slate-800'}`}>
              <div className="text-4xl mb-1">🔔</div>
              <div className="font-mono text-xs font-bold">Bell B</div>
              <div className="font-mono text-[11px] opacity-80">Every {intervalB} sec</div>
            </div>
          </div>

          {/* Timeline Counter */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl w-full text-center space-y-2">
            <div className="text-slate-400 text-xs font-mono">Elapsed Time:</div>
            <div className="text-3xl font-bold font-mono text-white">{time} seconds</div>

            {synchronizedToll && (
              <div className="p-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg animate-pulse font-sans">
                🎉 TOGETHER TOLL! Both bells ring simultaneously at t = {time} sec!
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg font-sans"
            >
              {isPlaying ? 'Pause Simulation ⏸' : 'Start Ringing Simulation ▶'}
            </button>
            <button 
              onClick={() => { setTime(0); setIsPlaying(false); }} 
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs font-sans"
            >
              Reset 🔄
            </button>
          </div>
        </div>

        {/* Info & Math */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Live LCM Calculation</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Bell A Tolls at:</div>
              <div>{intervalA}, {intervalA*2}, {intervalA*3}, {intervalA*4}...</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Bell B Tolls at:</div>
              <div>{intervalB}, {intervalB*2}, {intervalB*3}, {intervalB*4}...</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              LCM({intervalA}, {intervalB}) = {lcmVal} seconds ✓
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                <span>Bell A Interval:</span>
                <span className="text-amber-400">{intervalA} sec</span>
              </div>
              <input 
                type="range" min="4" max="20" step="2" value={intervalA} 
                onChange={(e) => { setIntervalA(parseInt(e.target.value)); setTime(0); setIsPlaying(false); }} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                <span>Bell B Interval:</span>
                <span className="text-sky-400">{intervalB} sec</span>
              </div>
              <input 
                type="range" min="4" max="24" step="2" value={intervalB} 
                onChange={(e) => { setIntervalB(parseInt(e.target.value)); setTime(0); setIsPlaying(false); }} 
                className="w-full accent-sky-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 6 Playing with Numbers MCQ Exam ───
export function Class6PlayingWithNumbersMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What is the HCF of 12 and 18?",
      options: ["A) 36", "B) 6", "C) 12", "D) 3"],
      correctIdx: 1,
      explanation: "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Largest common factor = 6."
    },
    {
      id: 2,
      text: "What is the LCM of 12 and 18?",
      options: ["A) 36", "B) 72", "C) 6", "D) 216"],
      correctIdx: 0,
      explanation: "Multiples of 12: 12, 24, 36... Multiples of 18: 18, 36... Smallest common multiple = 36."
    },
    {
      id: 3,
      text: "If HCF(a, b) = 6 and LCM(a, b) = 36, and one number a = 12, what is the other number b?",
      options: ["A) 24", "B) 18", "C) 12", "D) 30"],
      correctIdx: 1,
      explanation: "By Product Rule: HCF × LCM = a × b ==> 6 × 36 = 12 × b ==> 216 = 12 × b ==> b = 18."
    },
    {
      id: 4,
      text: "Two numbers are called co-prime if their HCF is:",
      options: ["A) 0", "B) 1", "C) 2", "D) Product of numbers"],
      correctIdx: 1,
      explanation: "Co-prime numbers share no common factor other than 1. Their HCF is strictly 1."
    },
    {
      id: 5,
      text: "Three church bells ring at intervals of 9, 12, and 15 minutes. After how many minutes will they ring together next?",
      options: ["A) 90 min", "B) 180 min", "C) 60 min", "D) 120 min"],
      correctIdx: 1,
      explanation: "They will ring together at t = LCM(9, 12, 15) = 3² × 2² × 5 = 9 × 4 × 5 = 180 minutes (3 hours)."
    },
    {
      id: 6,
      text: "What is the maximum size measuring container that can empty oil drums of 120 liters and 180 liters without any remainder?",
      options: ["A) 30 L", "B) 60 L", "C) 90 L", "D) 360 L"],
      correctIdx: 1,
      explanation: "Maximum capacity container = HCF(120, 180) = 60 liters."
    },
    {
      id: 7,
      text: "Which of the following is the ONLY even prime number?",
      options: ["A) 0", "B) 1", "C) 2", "D) 4"],
      correctIdx: 2,
      explanation: "2 is the smallest prime number and the only even prime number in mathematics."
    },
    {
      id: 8,
      text: "Using Continued Division Method, what is the HCF of 144 and 180?",
      options: ["A) 12", "B) 36", "C) 24", "D) 18"],
      correctIdx: 1,
      explanation: "180 ÷ 144 = 1 remainder 36. 144 ÷ 36 = 4 remainder 0. Final divisor = 36."
    },
    {
      id: 9,
      text: "What is the maximum side length of a square tile needed to pave a rectangular room of 18 m × 12 m without cutting tiles?",
      options: ["A) 6 m", "B) 4 m", "C) 3 m", "D) 2 m"],
      correctIdx: 0,
      explanation: "Maximum tile side = HCF(18, 12) = 6 meters."
    },
    {
      id: 10,
      text: "What is the least number which when divided by 6, 8, and 12 leaves remainder 0?",
      options: ["A) 48", "B) 24", "C) 12", "D) 36"],
      correctIdx: 1,
      explanation: "Least common multiple LCM(6, 8, 12) = 24."
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
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 6 Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 6 Board Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Playing with Numbers badge!
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
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Class 6 Playing with Numbers Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified Class 6 Playing with Numbers!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review HCF & LCM methods and retake the exam to earn your 80% completion badge.</span>
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
