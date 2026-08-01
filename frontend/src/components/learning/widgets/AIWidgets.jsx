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

// 4. Gradient Descent: The Blind Skier
export function BlindSkierWidget() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [position, setPosition] = useState(-4); // X-coordinate on the mountain (-4 to 4)
  const [history, setHistory] = useState([{x: -4, y: 16}]); // Trail of where the skier has been
  const [isSimulating, setIsSimulating] = useState(false);
  
  // The Mountain Function: y = x^2 (Loss function)
  // The goal is to reach x=0 (the bottom of the valley where y=0)
  const f = (x) => x * x;
  
  // The Derivative: dy/dx = 2x
  // Tells us the slope of the mountain at any given point
  const df = (x) => 2 * x;

  const reset = () => {
    setPosition(-4);
    setHistory([{x: -4, y: 16}]);
    setIsSimulating(false);
  };

  const takeStep = () => {
    setPosition(prev => {
      // Gradient Descent Formula: x_new = x_old - (learningRate * derivative)
      const gradient = df(prev);
      let newX = prev - (learningRate * gradient);
      
      // Cap at extremes so they don't fly off screen infinitely
      if (newX > 5) newX = 5;
      if (newX < -5) newX = -5;
      
      const newY = f(newX);
      setHistory(h => [...h, {x: newX, y: newY}]);
      return newX;
    });
  };

  React.useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        takeStep();
      }, 500); // Take a step every 0.5s
    }
    return () => clearInterval(interval);
  }, [isSimulating, learningRate]);

  // Convert logical coordinates (-5 to 5, 0 to 25) to CSS percentages
  const toCSS = (x, y) => {
    // X axis: -5 is 0%, 5 is 100%
    const left = ((x + 5) / 10) * 100;
    // Y axis: 0 is 100% (bottom), 25 is 0% (top)
    const bottom = (y / 25) * 100;
    return { left: `${left}%`, bottom: `${bottom}%` };
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-blue mb-2 border-b border-glass-stroke pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined">downhill_skiing</span>
          Gradient Descent (The Blind Skier)
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          The AI starts at the top of a mountain (high error). Using calculus (derivatives), it feels the slope under its feet and takes a step downwards. Adjust the <strong>Learning Rate</strong> (step size) and see how it impacts training!
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Controls */}
          <div className="flex-1 w-full max-w-sm bg-surface p-6 rounded-xl border border-white/10 flex flex-col justify-center">
            
            <div className="mb-6">
              <label className="flex justify-between text-sm font-bold mb-2">
                Learning Rate (Step Size)
                <span className="text-neon-blue">{learningRate.toFixed(2)}</span>
              </label>
              <input 
                type="range" 
                min="0.01" 
                max="1.1" 
                step="0.05"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                disabled={isSimulating}
                className="w-full accent-neon-blue"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Tiny Steps</span>
                <span>Massive Leaps</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`w-full py-3 font-bold rounded-lg transition-colors flex justify-center items-center gap-2 ${isSimulating ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-neon-blue text-black hover:bg-blue-400'}`}
              >
                <span className="material-symbols-outlined">
                  {isSimulating ? 'stop' : 'play_arrow'}
                </span>
                {isSimulating ? 'Stop Training' : 'Start Auto-Training'}
              </button>
              
              <button 
                onClick={takeStep}
                disabled={isSimulating}
                className="w-full py-3 bg-surface-light border border-white/10 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Take 1 Step
              </button>
              
              <button 
                onClick={reset}
                className="w-full py-3 text-gray-400 hover:text-white text-sm font-bold underline"
              >
                Reset Skier
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-sm">
              <div className="text-gray-500 mb-1">Current State:</div>
              <div>Error (Loss): <span className="text-red-400">{f(position).toFixed(2)}</span></div>
              <div className="mt-2 text-xs text-gray-500">
                {f(position) < 0.1 ? '🎉 AI is fully trained!' : f(position) > 20 ? '🚨 AI is out of control!' : 'Training in progress...'}
              </div>
            </div>

          </div>

          {/* Visualization Mountain */}
          <div className="flex-[2] aspect-video bg-black/50 border-l-2 border-b-2 border-gray-500 relative rounded-tr-xl overflow-hidden">
            <div className="absolute top-2 right-4 text-gray-500 text-xs">Loss / Error Mountain</div>
            
            {/* Draw the Mountain Curve (y = x^2) using SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transform: 'scaleY(-1)' }}>
              <path 
                d={`M 0,100 Q 50,-100 100,100`} // Approximation of parabola for viewBox
                fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" 
              />
              <path 
                d="M 0,100 L 100,100" // Valley floor
                fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" strokeDasharray="2,2"
              />
            </svg>

            {/* Render actual curve points with CSS */}
            {Array.from({length: 41}, (_, i) => -5 + i*0.25).map((x, i) => {
              const pos = toCSS(x, f(x));
              return (
                <div key={`curve-${i}`} className="absolute w-1 h-1 bg-white/10 rounded-full" style={pos}></div>
              );
            })}

            {/* Trail */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {history.length > 1 && (
                <polyline 
                  points={history.map(h => {
                    // SVG coordinates (0,0 is top left)
                    const x = ((h.x + 5) / 10) * 100;
                    const y = 100 - ((h.y / 25) * 100);
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" strokeDasharray="4,4"
                />
              )}
            </svg>

            {/* The Skier */}
            <div 
              className="absolute w-6 h-6 -ml-3 -mb-3 rounded-full bg-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 transition-all duration-300 flex items-center justify-center text-[10px]"
              style={toCSS(position, f(position))}
            >
              🎿
            </div>

            {/* Target marker */}
            <div className="absolute left-1/2 bottom-0 w-8 h-8 -ml-4 border-2 border-green-500 rounded-full animate-ping opacity-50 z-0"></div>
            <div className="absolute left-1/2 bottom-0 w-2 h-2 -ml-1 -mb-1 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] z-0"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 4. Softmax Widget (Probability & Confidence)
export function SoftmaxWidget() {
  const [logit1, setLogit1] = useState(2.5);
  const [logit2, setLogit2] = useState(-1.0);
  const [logit3, setLogit3] = useState(0.8);
  const [temperature, setTemperature] = useState(1.0);

  const classes = ["Cat", "Dog", "Bird"];
  const logits = [logit1, logit2, logit3];
  
  // Calculate Softmax
  const expValues = logits.map(l => Math.exp(l / temperature));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  const probabilities = expValues.map(e => e / sumExp);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-teal mb-6 border-b border-glass-stroke pb-2">Softmax Sandbox</h3>
        <p className="text-gray-400 text-sm mb-8">
          The AI spits out raw, messy numbers called <strong>Logits</strong>. Adjust the Logits and the Temperature below to see how the <strong>Softmax Math</strong> turns them into clean, 100% probabilities.
        </p>

        <div className="flex flex-col md:flex-row gap-8 bg-black/40 p-6 rounded-xl border border-white/5">
          
          {/* Controls */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            <h4 className="text-white font-semibold">1. Raw Output (Logits)</h4>
            
            <div className="flex flex-col gap-4">
              {[
                { label: classes[0], val: logit1, setVal: setLogit1, color: 'bg-blue-500' },
                { label: classes[1], val: logit2, setVal: setLogit2, color: 'bg-green-500' },
                { label: classes[2], val: logit3, setVal: setLogit3, color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 text-gray-300 text-sm">{item.label}</div>
                  <input 
                    type="range" min="-5" max="5" step="0.1" 
                    value={item.val} onChange={(e) => item.setVal(parseFloat(e.target.value))}
                    className="flex-grow accent-neon-teal"
                  />
                  <div className="w-12 text-right text-neon-teal font-mono">{item.val.toFixed(1)}</div>
                </div>
              ))}
            </div>

            <h4 className="text-white font-semibold mt-4">2. Temperature (T)</h4>
            <div className="flex items-center gap-4">
              <span className="text-2xl">🧊</span>
              <input 
                type="range" min="0.1" max="3.0" step="0.1" 
                value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="flex-grow accent-neon-pink"
              />
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-center text-neon-pink font-mono">T = {temperature.toFixed(1)}</div>
            <p className="text-xs text-gray-500 text-center">
              Low T makes AI overconfident (greedy). High T makes AI unsure (creative).
            </p>
          </div>

          {/* Visualization */}
          <div className="flex flex-col gap-6 w-full md:w-1/2 border-l border-white/10 pl-8">
            <h4 className="text-white font-semibold">3. Final Probability (Confidence)</h4>
            
            <div className="flex flex-col gap-6 justify-center h-full pb-4">
              {probabilities.map((prob, idx) => {
                const isMax = prob === Math.max(...probabilities);
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className={isMax ? "text-white font-bold" : "text-gray-400"}>{classes[idx]}</span>
                      <span className={isMax ? "text-neon-teal font-bold font-mono" : "text-gray-400 font-mono"}>
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden relative">
                      <div 
                        className={`h-full transition-all duration-500 ease-out ${
                          idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-purple-500'
                        } ${isMax ? 'shadow-[0_0_10px_currentColor]' : ''}`}
                        style={{ width: `${prob * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 5. Neural Network Visualizer (Arc 3: Chapter 7)
export function NeuralNetworkWidget() {
  const [step, setStep] = useState(0); // 0: Input, 1: Hidden 1, 2: Hidden 2, 3: Output

  const inputNodes = [0, 1, 2];
  const hidden1Nodes = [0, 1, 2, 3];
  const hidden2Nodes = [0, 1, 2, 3];
  const outputNodes = [0, 1];

  const handleNextStep = () => {
    setStep((prev) => (prev + 1) % 5);
  };

  const getOpacity = (layerIdx) => {
    if (step === 0) return layerIdx === 0 ? 'opacity-100' : 'opacity-20';
    if (step === 1) return layerIdx <= 1 ? 'opacity-100' : 'opacity-20';
    if (step === 2) return layerIdx <= 2 ? 'opacity-100' : 'opacity-20';
    if (step >= 3) return 'opacity-100';
    return 'opacity-20';
  };

  const getNodeColor = (layerIdx, nodeIdx) => {
    if (step < layerIdx) return 'bg-gray-700 shadow-none';
    
    // Once activated, give them glowing colors
    if (layerIdx === 0) return 'bg-blue-500 shadow-[0_0_15px_#3b82f6]';
    if (layerIdx === 1) return 'bg-purple-500 shadow-[0_0_15px_#a855f7]';
    if (layerIdx === 2) return 'bg-pink-500 shadow-[0_0_15px_#ec4899]';
    if (layerIdx === 3) {
      if (step === 4 && nodeIdx === 0) return 'bg-green-500 shadow-[0_0_25px_#22c55e] scale-125'; // Final Answer
      if (step === 4 && nodeIdx === 1) return 'bg-red-500 shadow-[0_0_5px_#ef4444] opacity-50'; // Rejected
      return 'bg-neon-teal shadow-[0_0_15px_#14b8a6]';
    }
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">The Neural Network</h3>
          <button 
            onClick={handleNextStep}
            className="px-4 py-2 bg-neon-purple text-white rounded-full font-bold hover:bg-purple-600 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            {step === 0 ? "1. Feed Input" : step === 1 ? "2. Process Layer 1" : step === 2 ? "3. Process Layer 2" : step === 3 ? "4. Calculate Softmax" : "Reset"}
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mb-8 text-center h-12">
          {step === 0 && "The Input Layer acts as the AI's 'eyes'. It receives the raw data (like pixels of an image)."}
          {step === 1 && "Hidden Layer 1 starts finding basic patterns, like edges and lines in the image."}
          {step === 2 && "Hidden Layer 2 combines edges to find complex shapes, like ears and eyes."}
          {step === 3 && "The Output Layer adds up all the math to produce the final raw Logits."}
          {step === 4 && "Softmax turns the Logits into percentages! The AI is 95% confident it's a Cat."}
        </p>

        <div className="relative flex justify-between items-center bg-black/40 p-8 rounded-xl border border-white/5 h-80">
          
          {/* Layer 0: Input */}
          <div className={`relative flex flex-col gap-6 z-10 transition-opacity duration-500 ${getOpacity(0)}`}>
            <div className="text-xs text-gray-500 text-center uppercase tracking-widest absolute -top-6 w-full left-0 whitespace-nowrap">Input Layer</div>
            {inputNodes.map(i => (
              <div key={`in-${i}`} className={`w-8 h-8 rounded-full transition-all duration-300 ${getNodeColor(0, i)}`}></div>
            ))}
          </div>

          {/* Lines 0->1 */}
          <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" style={{opacity: step >= 1 ? 0.3 : 0.05}}>
            {inputNodes.map(i => hidden1Nodes.map(h => (
              <line key={`l0-${i}-${h}`} x1="8%" y1={`${20 + i * 30}%`} x2="35%" y2={`${15 + h * 23}%`} stroke="#a855f7" strokeWidth="1" />
            )))}
          </svg>

          {/* Layer 1: Hidden */}
          <div className={`relative flex flex-col gap-4 z-10 transition-opacity duration-500 ${getOpacity(1)}`}>
            <div className="text-xs text-gray-500 text-center uppercase tracking-widest absolute -top-6 w-full left-0 whitespace-nowrap">Hidden Layer 1</div>
            {hidden1Nodes.map(i => (
              <div key={`h1-${i}`} className={`w-8 h-8 rounded-full transition-all duration-300 ${getNodeColor(1, i)}`}></div>
            ))}
          </div>

          {/* Lines 1->2 */}
          <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" style={{opacity: step >= 2 ? 0.3 : 0.05}}>
            {hidden1Nodes.map(i => hidden2Nodes.map(h => (
              <line key={`l1-${i}-${h}`} x1="38%" y1={`${15 + i * 23}%`} x2="63%" y2={`${15 + h * 23}%`} stroke="#ec4899" strokeWidth="1" />
            )))}
          </svg>

          {/* Layer 2: Hidden */}
          <div className={`relative flex flex-col gap-4 z-10 transition-opacity duration-500 ${getOpacity(2)}`}>
            <div className="text-xs text-gray-500 text-center uppercase tracking-widest absolute -top-6 w-full left-0 whitespace-nowrap">Hidden Layer 2</div>
            {hidden2Nodes.map(i => (
              <div key={`h2-${i}`} className={`w-8 h-8 rounded-full transition-all duration-300 ${getNodeColor(2, i)}`}></div>
            ))}
          </div>

          {/* Lines 2->3 */}
          <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" style={{opacity: step >= 3 ? 0.3 : 0.05}}>
            {hidden2Nodes.map(i => outputNodes.map(h => (
              <line key={`l2-${i}-${h}`} x1="66%" y1={`${15 + i * 23}%`} x2="92%" y2={`${30 + h * 40}%`} stroke="#14b8a6" strokeWidth="1" />
            )))}
          </svg>

          {/* Layer 3: Output */}
          <div className={`relative flex flex-col gap-12 z-10 transition-opacity duration-500 ${getOpacity(3)}`}>
            <div className="text-xs text-gray-500 text-center uppercase tracking-widest absolute -top-6 w-full left-0 whitespace-nowrap">Output Layer</div>
            {outputNodes.map(i => (
              <div key={`out-${i}`} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ${getNodeColor(3, i)}`}>
                  {step === 4 ? (i === 0 ? "95%" : "5%") : ""}
                </div>
                <div className={`text-sm font-bold ${step === 4 && i === 0 ? 'text-green-400' : 'text-gray-400'}`}>
                  {i === 0 ? "Cat" : "Dog"}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
