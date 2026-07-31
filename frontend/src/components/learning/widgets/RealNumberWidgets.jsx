import React, { useState } from 'react';

// 1. History of Irrationality (Visual panel)
export function HistoryOfIrrationality() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-2xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-[10rem] opacity-5 font-serif">√2</div>
        <h3 className="text-xl font-bold text-neon-coral mb-4 border-b border-glass-stroke pb-2">The Pythagorean Crisis</h3>
        <p className="text-gray-300 font-body-lg">
          The Pythagorean brotherhood believed numbers were divine. They held that everything in the universe could be measured using ratios of whole numbers.
        </p>
        <div className="my-6 p-4 bg-surface/50 rounded-xl border border-white/5 flex flex-col items-center">
          <div className="w-32 h-32 border-2 border-neon-purple relative flex items-center justify-center mb-2">
            <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-gray-400">1</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-gray-400">1</span>
            <div className="w-[141%] h-0.5 bg-neon-coral absolute top-0 left-0 origin-top-left rotate-45 flex items-center justify-center">
              <span className="bg-surface px-2 text-neon-coral font-bold -rotate-45 -mt-6">?</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            By Pythagoras' own theorem, the diagonal of a 1x1 square is √2.<br/>But √2 cannot be expressed as a fraction!
          </p>
        </div>
        <p className="text-gray-300 font-body-lg">
          Legend says that Hippasus, the man who proved this irrationality, was drowned at sea by the cult to keep the secret from getting out.
        </p>
      </div>
    </div>
  );
}

// 2. Euclid Algorithm Visualizer
export function EuclidAlgorithmVisualizer() {
  const [a, setA] = useState(225);
  const [b, setB] = useState(135);
  const [steps, setSteps] = useState([]);

  const calculateSteps = (numA, numB) => {
    let currentA = Math.max(numA, numB);
    let currentB = Math.min(numA, numB);
    let newSteps = [];
    
    if (currentB === 0) return;

    while (currentB > 0) {
      let q = Math.floor(currentA / currentB);
      let r = currentA % currentB;
      newSteps.push({ a: currentA, b: currentB, q, r });
      currentA = currentB;
      currentB = r;
    }
    setSteps(newSteps);
  };

  // Run on mount
  React.useEffect(() => {
    calculateSteps(a, b);
  }, [a, b]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface-container rounded-2xl border border-glass-stroke shadow-xl mt-6">
      <h3 className="text-xl font-bold text-neon-purple mb-6 text-center">Interactive HCF Finder</h3>
      
      <div className="flex gap-4 justify-center mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Number A</label>
          <input 
            type="number" 
            value={a} 
            onChange={(e) => setA(Math.max(1, parseInt(e.target.value) || 1))}
            className="px-4 py-2 bg-surface border border-glass-stroke rounded-lg text-white font-mono w-24 text-center"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Number B</label>
          <input 
            type="number" 
            value={b} 
            onChange={(e) => setB(Math.max(1, parseInt(e.target.value) || 1))}
            className="px-4 py-2 bg-surface border border-glass-stroke rounded-lg text-white font-mono w-24 text-center"
          />
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-surface/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${idx * 0.2}s` }}>
            <div className="flex-1 font-mono text-lg flex items-center justify-center gap-2">
              <span className="text-neon-coral font-bold">{step.a}</span>
              <span className="text-gray-500">=</span>
              <span className="text-neon-purple font-bold">{step.b}</span>
              <span className="text-gray-400">&times;</span>
              <span className="text-white">{step.q}</span>
              <span className="text-gray-500">+</span>
              <span className={`font-bold ${step.r === 0 ? 'text-green-400' : 'text-error'}`}>{step.r}</span>
            </div>
          </div>
        ))}
        {steps.length > 0 && steps[steps.length - 1].r === 0 && (
          <div className="mt-6 text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-lg text-white">
              The HCF of <span className="font-bold text-neon-coral">{a}</span> and <span className="font-bold text-neon-coral">{b}</span> is <span className="font-bold text-green-400 text-2xl">{steps[steps.length - 1].b}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Prime Factorization Tree
export function PrimeFactorizationTree() {
  const [number, setNumber] = useState(60);

  const factorize = (n) => {
    let factors = [];
    let d = 2;
    while (n > 1) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
      d++;
      if (d * d > n) {
        if (n > 1) factors.push(n);
        break;
      }
    }
    return factors;
  };

  const primes = factorize(number);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface-container rounded-2xl border border-glass-stroke shadow-xl mt-6">
      <h3 className="text-xl font-bold text-neon-coral mb-6 text-center">Atomic Prime Structure</h3>
      
      <div className="flex flex-col items-center gap-2 mb-8">
        <label className="text-sm text-gray-400">Enter a composite number</label>
        <input 
          type="number" 
          value={number} 
          onChange={(e) => setNumber(Math.max(2, parseInt(e.target.value) || 2))}
          className="px-4 py-2 bg-surface border border-glass-stroke rounded-lg text-white font-mono w-32 text-center text-xl"
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-surface rounded-full border-2 border-neon-coral flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,107,74,0.3)] z-10">
          {number}
        </div>
        
        {primes.length > 1 ? (
          <>
            <div className="w-0.5 h-8 bg-glass-stroke"></div>
            <div className="flex flex-wrap justify-center gap-4 mt-2 p-4 bg-surface/50 rounded-2xl border border-white/5 w-full">
              {primes.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-surface-variant rounded-full border-2 border-neon-purple flex items-center justify-center font-bold text-neon-purple animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {p}
                  </div>
                  {i < primes.length - 1 && <span className="text-gray-500">&times;</span>}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-6">
              These prime numbers are the unbreakable "atoms" that multiply together to create {number}.
            </p>
          </>
        ) : (
          <p className="text-center text-neon-purple mt-8 font-bold">
            {number} is already a prime number!
          </p>
        )}
      </div>
    </div>
  );
}

// 4. Irrationality Proof Explorer
export function IrrationalityProofExplorer() {
  const [step, setStep] = useState(0);
  
  const proofSteps = [
    { title: "The Assumption", text: "Let us assume, to the contrary, that √2 is a rational number.", formula: "√2 = p / q" },
    { title: "Coprime Condition", text: "We assume p and q are integers with NO common factors other than 1 (they are coprime), and q ≠ 0.", formula: "HCF(p, q) = 1" },
    { title: "Squaring Both Sides", text: "Square both sides of the equation to remove the square root.", formula: "2 = p² / q²  =>  p² = 2q²" },
    { title: "Deduction 1", text: "Since p² is 2 multiplied by something, p² must be an even number (divisible by 2).", formula: "2 divides p²" },
    { title: "The Prime Property", text: "By theorem: If a prime number divides the square of a number, it also divides the number itself.", formula: "2 divides p" },
    { title: "Substitute", text: "Since p is even, we can write p = 2c for some integer c. Substitute this back into p² = 2q².", formula: "(2c)² = 2q²  =>  4c² = 2q²  =>  2c² = q²" },
    { title: "Deduction 2", text: "This means q² is also an even number, which means q must also be divisible by 2.", formula: "2 divides q" },
    { title: "The Contradiction!", text: "We found that 2 divides BOTH p and q. But our very first assumption was that they have NO common factors!", formula: "HCF(p, q) ≥ 2  (Contradiction!)" },
    { title: "Conclusion", text: "Because our logical steps led to an impossible contradiction, our initial assumption MUST be false.", formula: "Therefore, √2 is IRRATIONAL." }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container rounded-2xl border border-glass-stroke shadow-xl mt-6 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-neon-coral/20 to-neon-purple/20 border-b border-glass-stroke">
        <h3 className="font-bold text-lg text-white">Proof by Contradiction: √2 is Irrational</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {proofSteps.slice(0, step + 1).map((s, idx) => (
            <div key={idx} className="p-4 bg-surface/50 border border-white/5 rounded-xl flex flex-col gap-2 animate-fade-in">
              <h4 className="text-neon-coral font-bold text-sm uppercase tracking-wider">{s.title}</h4>
              <p className="text-gray-300">{s.text}</p>
              <div className="bg-surface p-3 rounded-lg border border-glass-stroke font-mono text-center text-neon-purple font-bold">
                {s.formula}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 bg-surface-variant rounded-lg text-gray-400 disabled:opacity-50"
          >
            Previous Step
          </button>
          <button 
            onClick={() => setStep(Math.min(proofSteps.length - 1, step + 1))}
            disabled={step === proofSteps.length - 1}
            className="px-6 py-2 bg-neon-coral text-surface font-bold rounded-lg disabled:opacity-50"
          >
            {step === proofSteps.length - 1 ? "Proof Complete" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Decimal Expansion Checker
export function DecimalExpansionChecker() {
  const [num, setNum] = useState(13);
  const [den, setDen] = useState(3125);

  const getPrimeFactors = (n) => {
    let factors = {};
    let d = 2;
    while (n > 1) {
      while (n % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        n /= d;
      }
      d++;
      if (d * d > n) {
        if (n > 1) factors[n] = (factors[n] || 0) + 1;
        break;
      }
    }
    return factors;
  };

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  const hcf = gcd(num, den);
  const simNum = num / hcf;
  const simDen = den / hcf;
  const factors = getPrimeFactors(simDen);
  
  const hasOtherPrimes = Object.keys(factors).some(k => k !== '2' && k !== '5');

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-surface-container rounded-2xl border border-glass-stroke shadow-xl mt-6">
      <h3 className="text-xl font-bold text-electric-blue mb-6 text-center">Decimal Expansion Predictor</h3>
      
      <div className="flex justify-center items-center gap-6 mb-8">
        <div className="flex flex-col gap-2 items-center">
          <input 
            type="number" 
            value={num} 
            onChange={(e) => setNum(Math.max(1, parseInt(e.target.value) || 1))}
            className="px-4 py-2 bg-surface border border-glass-stroke rounded-lg text-white font-mono w-24 text-center"
          />
          <div className="w-full h-0.5 bg-gray-500"></div>
          <input 
            type="number" 
            value={den} 
            onChange={(e) => setDen(Math.max(1, parseInt(e.target.value) || 1))}
            className="px-4 py-2 bg-surface border border-glass-stroke rounded-lg text-white font-mono w-24 text-center"
          />
        </div>
        
        <div className="text-2xl text-gray-500">&rarr;</div>
        
        <div className="flex flex-col gap-2 items-center bg-surface/50 p-4 rounded-xl border border-white/5">
          <div className="text-white font-mono text-xl">{simNum}</div>
          <div className="w-full h-0.5 bg-gray-500"></div>
          <div className="text-white font-mono text-xl">
            {Object.keys(factors).length === 0 ? "1" : 
              Object.entries(factors).map(([p, pow], i) => (
                <span key={p}>
                  <span className={p === '2' || p === '5' ? 'text-green-400' : 'text-error'}>{p}<sup>{pow}</sup></span>
                  {i < Object.keys(factors).length - 1 && " × "}
                </span>
              ))
            }
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border text-center ${hasOtherPrimes ? 'bg-error/10 border-error/20' : 'bg-green-500/10 border-green-500/20'}`}>
        <p className={`font-bold text-lg ${hasOtherPrimes ? 'text-error' : 'text-green-400'}`}>
          {hasOtherPrimes ? "Non-Terminating Repeating Decimal" : "Terminating Decimal"}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {hasOtherPrimes 
            ? "The simplified denominator has prime factors other than 2 and 5." 
            : "The simplified denominator has ONLY prime factors of 2 and/or 5."}
        </p>
      </div>
    </div>
  );
}

// 6. Real Numbers Cheat Sheet
export function RealNumbersCheatSheet() {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 bg-surface-container rounded-2xl border border-glass-stroke shadow-2xl overflow-y-auto max-h-[80vh] custom-scrollbar">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <div className="p-3 bg-neon-coral/10 rounded-xl">
          <span className="material-symbols-outlined text-neon-coral text-3xl">menu_book</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Real Numbers Cheat Sheet</h2>
          <p className="text-gray-400 text-sm">Class 10 Mathematics - Chapter 1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Euclid's Lemma */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-neon-coral font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">1. Euclid's Division Lemma</h3>
          <div className="bg-surface p-4 rounded-lg border border-glass-stroke text-center mb-4">
            <span className="text-xl text-white font-mono font-bold">a = bq + r</span>
          </div>
          <p className="text-sm text-gray-400">For any two positive integers a and b, there exist unique integers q and r satisfying the above equation where:</p>
          <div className="mt-2 text-center text-neon-purple font-mono font-bold bg-surface p-2 rounded">
            0 &le; r &lt; b
          </div>
        </div>

        {/* HCF x LCM */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-neon-purple font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">2. The Golden Property</h3>
          <p className="text-sm text-gray-400 mb-4">For any two positive integers a and b:</p>
          <div className="bg-surface p-4 rounded-lg border border-glass-stroke text-center font-mono">
            <span className="text-white font-bold block mb-2">HCF(a, b) &times; LCM(a, b) = a &times; b</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-400 list-disc pl-4">
            <li><strong className="text-gray-300">HCF:</strong> Product of the <em>smallest</em> power of each common prime factor.</li>
            <li><strong className="text-gray-300">LCM:</strong> Product of the <em>greatest</em> power of each prime factor involved.</li>
          </ul>
        </div>

        {/* Rational vs Irrational */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5 md:col-span-2">
          <h3 className="text-electric-blue font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">3. Rational vs Irrational Numbers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20">
              <h4 className="text-green-400 font-bold mb-2">Rational Numbers (p/q)</h4>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                <li>Decimal expansion either <strong>terminates</strong> or is <strong>non-terminating repeating</strong>.</li>
                <li>Examples: 1/2, 3.14, 22/7, 0.333...</li>
              </ul>
            </div>
            <div className="bg-error/5 p-4 rounded-lg border border-error/20">
              <h4 className="text-error font-bold mb-2">Irrational Numbers</h4>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                <li>Cannot be written as p/q.</li>
                <li>Decimal expansion is <strong>non-terminating non-repeating</strong>.</li>
                <li>Examples: &radic;2, &radic;3, &pi;, 0.101101110...</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Decimal Expansions */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5 md:col-span-2">
          <h3 className="text-tertiary-fixed font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">4. Decimal Expansions (2^n &times; 5^m Rule)</h3>
          <p className="text-sm text-gray-400 mb-4">Let x = p/q be a rational number, such that p and q are coprime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-lg border border-glass-stroke">
              <h4 className="text-white font-bold mb-2 text-sm">Terminating</h4>
              <p className="text-sm text-gray-400">The prime factorization of q is of the form <span className="text-neon-coral font-mono font-bold">2&sp;n &times; 5&sp;m</span> (where n, m are non-negative integers).</p>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-glass-stroke">
              <h4 className="text-white font-bold mb-2 text-sm">Non-Terminating Repeating</h4>
              <p className="text-sm text-gray-400">The prime factorization of q is <strong>NOT</strong> of the form <span className="text-neon-purple font-mono font-bold">2&sp;n &times; 5&sp;m</span> (it has prime factors other than 2 or 5).</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
