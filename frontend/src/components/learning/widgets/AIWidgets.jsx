import React, { useState } from 'react';

// 1. The First Neuron Widget (Perceptron Replica)
export function FirstNeuronWidget() {
  const [w1, setW1] = useState(0);
  const [w2, setW2] = useState(0);
  const [bias, setBias] = useState(-5);
  
  // Inputs (Shapes)
  // Let's say we are trying to detect a "Square"
  // Feature 1: Has 4 corners? (Square=1, Circle=0, Triangle=0 (well, 3, but let's say 0 for this feature))
  // Feature 2: All sides equal? (Square=1, Rectangle=0)
  
  const shapes = [
    { name: 'Square', f1: 1, f2: 1, color: 'text-blue-400', icon: 'square' },
    { name: 'Circle', f1: 0, f2: 0, color: 'text-red-400', icon: 'circle' },
    { name: 'Rectangle', f1: 1, f2: 0, color: 'text-green-400', icon: 'rectangle' }
  ];
  
  const [activeShapeIdx, setActiveShapeIdx] = useState(0);
  const activeShape = shapes[activeShapeIdx];
  
  const sum = (w1 * activeShape.f1) + (w2 * activeShape.f2) + bias;
  const fires = sum > 0;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-purple mb-6 border-b border-glass-stroke pb-2">The 1958 Perceptron</h3>
        <p className="text-gray-400 text-sm mb-8">
          Goal: Wire the neuron to <strong>ONLY fire when it sees a Square</strong>. 
          Adjust the weights and bias. If the Sum is &gt; 0, the neuron fires!
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-black/40 p-6 rounded-xl border border-white/5 relative">
          
          {/* Inputs */}
          <div className="flex flex-col gap-6 z-10 w-full md:w-1/3">
            <div className="text-center mb-2">
              <div className="text-sm text-gray-500 mb-2">Current Shape:</div>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setActiveShapeIdx((prev) => (prev - 1 + shapes.length) % shapes.length)}
                  className="material-symbols-outlined hover:text-white"
                >
                  chevron_left
                </button>
                <div className={`material-symbols-outlined text-6xl ${activeShape.color}`}>
                  {activeShape.icon}
                </div>
                <button 
                  onClick={() => setActiveShapeIdx((prev) => (prev + 1) % shapes.length)}
                  className="material-symbols-outlined hover:text-white"
                >
                  chevron_right
                </button>
              </div>
              <div className="text-lg font-bold mt-2">{activeShape.name}</div>
            </div>

            <div className="bg-surface p-4 rounded-lg border border-white/10 flex justify-between items-center relative group">
              <div>
                <div className="text-xs text-gray-500">Feature 1 (x&#8321;)</div>
                <div className="font-bold">Has 4 corners? = {activeShape.f1}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-neon-purple font-mono mb-1">Weight 1 (w&#8321;)</div>
                <input 
                  type="range" min="-10" max="10" step="1" 
                  value={w1} onChange={(e) => setW1(Number(e.target.value))}
                  className="w-24 accent-neon-purple"
                />
                <div className="text-sm font-mono mt-1">{w1}</div>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-lg border border-white/10 flex justify-between items-center relative group">
              <div>
                <div className="text-xs text-gray-500">Feature 2 (x&#8322;)</div>
                <div className="font-bold">Sides equal? = {activeShape.f2}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-neon-purple font-mono mb-1">Weight 2 (w&#8322;)</div>
                <input 
                  type="range" min="-10" max="10" step="1" 
                  value={w2} onChange={(e) => setW2(Number(e.target.value))}
                  className="w-24 accent-neon-purple"
                />
                <div className="text-sm font-mono mt-1">{w2}</div>
              </div>
            </div>
          </div>

          {/* Lines (Desktop only for visual simplicity) */}
          <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
            <path d="M 33% 40% C 50% 40%, 50% 50%, 66% 50%" fill="none" stroke={w1 > 0 ? '#c084fc' : w1 < 0 ? '#f87171' : '#555'} strokeWidth={Math.max(1, Math.abs(w1))} strokeDasharray="5,5" className={w1 !== 0 ? 'animate-pulse' : ''} />
            <path d="M 33% 85% C 50% 85%, 50% 50%, 66% 50%" fill="none" stroke={w2 > 0 ? '#c084fc' : w2 < 0 ? '#f87171' : '#555'} strokeWidth={Math.max(1, Math.abs(w2))} strokeDasharray="5,5" className={w2 !== 0 ? 'animate-pulse' : ''} />
          </svg>

          {/* Neuron Body */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/3">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 relative ${fires ? 'border-neon-coral bg-neon-coral/20 shadow-[0_0_30px_rgba(255,107,107,0.6)]' : 'border-gray-600 bg-gray-800'}`}>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">&Sigma; Sum</div>
                <div className={`text-2xl font-bold font-mono ${fires ? 'text-white' : 'text-gray-500'}`}>{sum}</div>
              </div>
              
              {/* Bias Knob attached to neuron */}
              <div className="absolute -bottom-16 bg-surface px-4 py-2 rounded-lg border border-white/10 flex flex-col items-center">
                <div className="text-xs text-yellow-500 font-mono mb-1">Bias (b)</div>
                <input 
                  type="range" min="-10" max="10" step="1" 
                  value={bias} onChange={(e) => setBias(Number(e.target.value))}
                  className="w-20 accent-yellow-500"
                />
                <div className="text-xs font-mono mt-1">{bias}</div>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col items-center z-10 w-full md:w-1/4 pt-16 md:pt-0">
            <div className={`text-5xl mb-4 transition-all duration-300 ${fires ? 'text-neon-coral scale-110 drop-shadow-[0_0_15px_rgba(255,107,107,0.8)]' : 'text-gray-700'}`}>
              {fires ? 'bulb' : 'lightbulb'}
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Output Signal</div>
              <div className={`text-xl font-bold ${fires ? 'text-neon-coral' : 'text-gray-600'}`}>
                {fires ? 'FIRES (1)' : 'SILENT (0)'}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 bg-surface p-4 rounded-xl border border-white/10 text-center font-mono text-sm">
          y = ({w1} &times; {activeShape.f1}) + ({w2} &times; {activeShape.f2}) + ({bias}) = <strong>{sum}</strong>
        </div>
      </div>
    </div>
  );
}

// 2. CPU vs GPU Interactive Visualizer
export function CpuVsGpuWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('CPU'); // 'CPU' or 'GPU'
  const [progress, setProgress] = useState(0); // 0 to 100
  const [timeMs, setTimeMs] = useState(0);
  
  // Simulation parameters
  const TOTAL_TASKS = 64; // A grid of 8x8 pixels to process
  
  React.useEffect(() => {
    let interval;
    if (isRunning) {
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setTimeMs(elapsed);
        
        let currentProgress = 0;
        
        if (mode === 'CPU') {
          // CPU processes fast (e.g. 4 cores = 4 items at a time), but has to do 64 items
          // Say it takes 50ms per batch of 4.
          const batchesDone = Math.floor(elapsed / 50);
          currentProgress = Math.min(100, (batchesDone * 4 / TOTAL_TASKS) * 100);
        } else {
          // GPU processes slow (e.g. 64 cores = 64 items at a time), but does them all at once!
          // Say it takes 200ms to process, but it processes EVERYTHING in that one go.
          currentProgress = elapsed >= 200 ? 100 : 0;
        }
        
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          setIsRunning(false);
          clearInterval(interval);
        }
      }, 16); // 60fps
    }
    
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const startSimulation = (selectedMode) => {
    setMode(selectedMode);
    setProgress(0);
    setTimeMs(0);
    setIsRunning(true);
  };

  // Generate grid cells
  const cells = Array.from({ length: TOTAL_TASKS }, (_, i) => i);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-blue mb-2 border-b border-glass-stroke pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined">memory</span>
          The Hardware Revolution
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Watch how a CPU and a GPU process a grid of 64 pixels (matrix math). The CPU is very fast but can only process 4 pixels at a time (like a sports car). The GPU is slower per task, but has 64 cores processing them all simultaneously (like a fleet of buses)!
        </p>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => startSimulation('CPU')}
            disabled={isRunning}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${mode === 'CPU' && !isRunning ? 'bg-blue-600 text-white' : 'bg-surface hover:bg-surface-light border border-white/10'}`}
          >
            <span className="material-symbols-outlined">directions_car</span>
            Test CPU (Sequential)
          </button>
          
          <button 
            onClick={() => startSimulation('GPU')}
            disabled={isRunning}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${mode === 'GPU' && !isRunning ? 'bg-green-600 text-white' : 'bg-surface hover:bg-surface-light border border-white/10'}`}
          >
            <span className="material-symbols-outlined">directions_bus</span>
            Test GPU (Parallel)
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Visualization Grid */}
          <div className="flex-1 bg-black/40 p-6 rounded-xl border border-white/5 flex flex-col items-center">
            <div className="text-sm text-gray-500 mb-4 font-mono">Processing Grid (64 calculations)</div>
            <div className="grid grid-cols-8 gap-1">
              {cells.map(i => {
                const isProcessed = (i / TOTAL_TASKS) * 100 < progress;
                return (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-sm transition-colors duration-100 ${isProcessed ? (mode === 'CPU' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]') : 'bg-gray-800'}`}
                  ></div>
                );
              })}
            </div>
          </div>
          
          {/* Stats Panel */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-surface p-4 rounded-xl border border-white/10 flex flex-col justify-center h-full">
              <div className="text-sm text-gray-400 mb-1">Architecture Mode</div>
              <div className={`text-2xl font-bold mb-4 ${mode === 'CPU' ? 'text-blue-400' : 'text-green-400'}`}>
                {mode === 'CPU' ? 'Central Processing Unit' : 'Graphics Processing Unit'}
              </div>
              
              <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-4">
                <div className="text-sm text-gray-400">Time Elapsed</div>
                <div className="text-3xl font-mono">{timeMs} <span className="text-sm text-gray-500">ms</span></div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-xl font-mono">{Math.floor(progress)}%</div>
              </div>
              
              {/* Progress bar line */}
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 ${mode === 'CPU' ? 'bg-blue-500' : 'bg-green-500'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {progress >= 100 && (
                <div className="mt-4 text-center text-sm font-bold text-yellow-400 animate-pulse">
                  Calculation Complete!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. The Vector Galaxy (Word Embeddings)
export function VectorGalaxyWidget() {
  const [step, setStep] = useState(0);

  // Define points in a simplified 2D semantic space
  // X-axis: Gender (0 = Male, 10 = Female)
  // Y-axis: Royalty (0 = Peasant, 10 = Royal)
  const points = {
    man: { x: 2, y: 2, label: 'Man' },
    woman: { x: 8, y: 2, label: 'Woman' },
    king: { x: 2, y: 8, label: 'King' },
    queen: { x: 8, y: 8, label: 'Queen' },
  };

  // Helper to map coordinates to percentages for CSS positioning
  const toPos = (val) => `${val * 10}%`;

  const nextStep = () => {
    setStep(prev => (prev < 4 ? prev + 1 : 0));
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-blue mb-2 border-b border-glass-stroke pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined">scatter_plot</span>
          The Vector Galaxy (2D Simplified)
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Words are mapped to numbers. Let's look at 2 dimensions: <strong>Gender</strong> (X-axis) and <strong>Royalty</strong> (Y-axis). Because they are just points, we can do math with them to find meaning.
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          
          {/* Controls */}
          <div className="flex-1 w-full bg-surface p-6 rounded-xl border border-white/10">
            <h4 className="text-lg font-bold mb-4">Vector Math</h4>
            
            <div className="space-y-4 font-mono text-lg">
              <div className={`p-3 rounded-lg border transition-all ${step >= 1 ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 text-gray-600'}`}>
                1. Start at [King]
              </div>
              <div className={`p-3 rounded-lg border transition-all ${step >= 2 ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/10 text-gray-600'}`}>
                2. Subtract [Man]
              </div>
              <div className={`p-3 rounded-lg border transition-all ${step >= 3 ? 'border-green-500 bg-green-500/10 text-white' : 'border-white/10 text-gray-600'}`}>
                3. Add [Woman]
              </div>
              <div className={`p-3 rounded-lg border transition-all ${step >= 4 ? 'border-purple-500 bg-purple-500/20 text-neon-purple font-bold shadow-[0_0_15px_rgba(192,132,252,0.3)]' : 'border-white/10 text-gray-600'}`}>
                = [Queen]!
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="mt-6 w-full py-3 bg-neon-blue text-black font-bold rounded-lg hover:bg-blue-400 transition-colors"
            >
              {step === 0 ? 'Start Calculation' : step < 4 ? 'Next Step' : 'Reset'}
            </button>
          </div>

          {/* Graph */}
          <div className="flex-1 w-full aspect-square bg-black/50 border-l-2 border-b-2 border-gray-500 relative rounded-tr-xl">
            {/* Axis Labels */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Gender (Male &rarr; Female)</div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 text-xs text-gray-400">Royalty</div>

            {/* Grid Lines */}
            {[2,4,6,8].map(i => (
              <React.Fragment key={i}>
                <div className="absolute left-0 right-0 border-t border-white/5" style={{ bottom: toPos(i) }}></div>
                <div className="absolute top-0 bottom-0 border-l border-white/5" style={{ left: toPos(i) }}></div>
              </React.Fragment>
            ))}

            {/* Render Points */}
            {Object.values(points).map((pt, idx) => (
              <div 
                key={idx}
                className={`absolute w-3 h-3 rounded-full -ml-1.5 -mb-1.5 transition-all duration-500 z-10
                  ${pt.label === 'Queen' && step === 4 ? 'bg-neon-purple shadow-[0_0_15px_#c084fc] scale-150' : 'bg-gray-400'}
                  ${pt.label === 'King' && step >= 1 ? 'bg-blue-400 scale-125' : ''}
                `}
                style={{ left: toPos(pt.x), bottom: toPos(pt.y) }}
              >
                <span className="absolute top-3 left-1/2 -translate-x-1/2 text-sm font-bold text-white whitespace-nowrap">
                  {pt.label}
                </span>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500 whitespace-nowrap">
                  [{pt.x}, {pt.y}]
                </span>
              </div>
            ))}

            {/* Render Vectors (SVG Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ transform: 'scaleY(-1)' }}>
              {/* Step 2: King to (King - Man) = (2,8) - (2,2) = (0,6) relative. Point is (0,6). */}
              {step >= 2 && (
                <path 
                  d="M 20% 80% L 0% 60%" 
                  fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" className="animate-dash"
                  markerEnd="url(#arrowhead-red)"
                />
              )}
              
              {/* Step 3: (0,6) + Woman(8,2) = (8,8) */}
              {step >= 3 && (
                <path 
                  d="M 0% 60% L 80% 80%" 
                  fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" className="animate-dash"
                  markerEnd="url(#arrowhead-green)"
                />
              )}

              <defs>
                <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
                <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                </marker>
              </defs>
            </svg>

          </div>
        </div>

      </div>
    </div>
  );
}
