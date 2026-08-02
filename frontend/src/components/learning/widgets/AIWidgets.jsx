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

// 6. Attention Visualizer (Arc 3: Chapter 8)
export function AttentionWidget() {
  const [activeWord, setActiveWord] = useState(null);

  const sentence = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];

  // Attention scores when "it" is selected (index 7)
  const itAttention = {
    1: 0.9, // animal
    5: 0.1, // street
    10: 0.3 // tired
  };

  // Attention scores when "animal" is selected (index 1)
  const animalAttention = {
    7: 0.9, // it
    10: 0.5 // tired
  };

  const getAttention = (sourceIdx, targetIdx) => {
    if (sourceIdx === 7) return itAttention[targetIdx] || 0;
    if (sourceIdx === 1) return animalAttention[targetIdx] || 0;
    return 0;
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">Self-Attention Mechanism</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-8 text-center">
          Click on the word <strong>"it"</strong> to see how the Transformer understands context. 
          Notice how it connects "it" strongly to "animal" rather than "street".
        </p>

        <div className="relative bg-black/40 p-12 rounded-xl border border-white/5 min-h-64 flex flex-col items-center justify-center">
          
          <div className="flex flex-wrap justify-center gap-4 z-10 relative">
            {sentence.map((word, idx) => (
              <button
                key={idx}
                onClick={() => setActiveWord(activeWord === idx ? null : idx)}
                className={`px-4 py-2 rounded-lg text-lg font-mono transition-all duration-300 ${
                  activeWord === idx 
                    ? 'bg-neon-teal text-white shadow-[0_0_15px_#14b8a6] transform scale-110' 
                    : 'bg-surface border border-glass-stroke text-gray-300 hover:bg-gray-800'
                }`}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Visualization lines (simulated using absolute positioned divs for simplicity in standard layout) */}
          <div className="mt-12 text-center h-24">
            {activeWord === 7 ? (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-neon-teal font-bold text-xl mb-2">Attention Focus: 90% "animal"</div>
                <div className="text-gray-400 text-sm">The model uses math to calculate that "it" refers to the animal, not the street, because animals get tired.</div>
              </div>
            ) : activeWord === 1 ? (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-neon-purple font-bold text-xl mb-2">Attention Focus: 90% "it"</div>
                <div className="text-gray-400 text-sm">The word "animal" looks forward in the sentence to see it is referred to later.</div>
              </div>
            ) : activeWord !== null ? (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="text-gray-500 font-bold text-xl mb-2">Weak Attention</div>
                <div className="text-gray-400 text-sm">This word doesn't have strong complex contextual links in this specific example. Try clicking "it".</div>
              </div>
            ) : (
              <div className="text-gray-600 italic">Select a word above...</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// 7. RLHF Simulator (Arc 3: Chapter 9)
export function RLHFWidget() {
  const [step, setStep] = useState(0); // 0: initial, 1: evaluated safe, 2: evaluated toxic, 3: completed
  
  const handleVote = (isSafe) => {
    if (isSafe) {
      setStep(1);
      setTimeout(() => setStep(3), 2000);
    } else {
      setStep(2);
      setTimeout(() => setStep(0), 2000); // Reset to let them try again
    }
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">RLHF Simulator</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          You are the Human in <strong>Reinforcement Learning from Human Feedback</strong>! 
          The AI was asked: <em>"How do I pick a lock?"</em><br/>
          Vote on the responses below to teach the AI what is acceptable.
        </p>

        <div className="flex gap-6 justify-center">
          
          {/* Response A (Toxic/Unsafe) */}
          <div className="flex-1 bg-black/40 p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Response A</div>
              <p className="text-gray-300 italic mb-6">"To pick a lock, you need a tension wrench and a pick. First, insert the wrench..."</p>
            </div>
            <button 
              onClick={() => handleVote(false)}
              disabled={step !== 0}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                step === 2 ? 'bg-red-600 text-white shadow-[0_0_15px_#dc2626]' : 
                step !== 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 
                'bg-surface border border-glass-stroke text-red-400 hover:bg-red-900/30'
              }`}
            >
              👎 Downvote (Unsafe)
            </button>
          </div>

          {/* Response B (Safe) */}
          <div className="flex-1 bg-black/40 p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Response B</div>
              <p className="text-gray-300 italic mb-6">"I cannot help you with picking a lock, as that information can be used illegally. I recommend calling a locksmith."</p>
            </div>
            <button 
              onClick={() => handleVote(true)}
              disabled={step !== 0}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                step === 1 || step === 3 ? 'bg-green-600 text-white shadow-[0_0_15px_#16a34a]' : 
                step !== 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 
                'bg-surface border border-glass-stroke text-green-400 hover:bg-green-900/30'
              }`}
            >
              👍 Upvote (Safe)
            </button>
          </div>

        </div>

        <div className="mt-8 text-center h-12">
          {step === 1 && <div className="text-green-400 font-bold animate-fade-in">Good job! You rewarded the AI for being safe.</div>}
          {step === 2 && <div className="text-red-400 font-bold animate-fade-in">Wait! You just taught the AI to do something illegal. Try again.</div>}
          {step === 3 && <div className="text-neon-teal font-bold animate-fade-in">The AI has updated its internal weights to prefer Response B in the future!</div>}
        </div>

      </div>
    </div>
  );
}

// 8. Prompt Engineering (Arc 4: Chapter 10)
export function PromptingWidget() {
  const [examples, setExamples] = useState(0);
  
  const getOutput = () => {
    if (examples === 0) return "Hello, how can I help you today?";
    if (examples === 1) return "Ahoy matey! How can I be of service to ye today, arrr!";
    return "Ahoy there, ye scurvy dog! What brings ye to my ship today? Speak yer mind or walk the plank! Arrr!";
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">In-Context Learning Simulator</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          Teach the AI to talk like a Pirate <strong>without changing its underlying weights</strong>! Add examples to the "Context Window" and watch the output adapt.
        </p>

        <div className="flex gap-6">
          {/* Prompt Section */}
          <div className="flex-1 space-y-4">
            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">System Prompt</div>
              <p className="text-gray-300">Translate the following English sentence to Pirate.</p>
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-white/5 min-h-[120px] transition-all">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Few-Shot Examples</div>
                <button 
                  onClick={() => setExamples(Math.min(2, examples + 1))}
                  disabled={examples >= 2}
                  className="bg-neon-teal/20 text-neon-teal px-2 py-1 rounded text-xs hover:bg-neon-teal/40 disabled:opacity-50"
                >
                  + Add Example
                </button>
              </div>
              
              {examples === 0 && <p className="text-gray-500 italic text-sm">No examples provided (Zero-Shot)</p>}
              
              {examples >= 1 && (
                <div className="text-sm text-gray-400 mb-2 p-2 bg-white/5 rounded">
                  <span className="text-blue-400">User:</span> Hello friend<br/>
                  <span className="text-green-400">Assistant:</span> Ahoy matey!
                </div>
              )}
              {examples >= 2 && (
                <div className="text-sm text-gray-400 p-2 bg-white/5 rounded">
                  <span className="text-blue-400">User:</span> Look at that boat<br/>
                  <span className="text-green-400">Assistant:</span> Avast ye! Look at that fine vessel!
                </div>
              )}
              
              {examples > 0 && (
                <button 
                  onClick={() => setExamples(0)}
                  className="mt-2 text-red-400 text-xs hover:underline"
                >
                  Clear Examples
                </button>
              )}
            </div>

            <div className="bg-black/40 p-4 rounded-xl border border-blue-500/30">
              <div className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-bold">User Input</div>
              <p className="text-white">"Hello, how can I help you today?"</p>
            </div>
          </div>

          {/* AI Output Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-green-900/20 to-black p-6 rounded-xl border border-green-500/30 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 text-xs text-green-400 uppercase tracking-widest font-bold">AI Output</div>
              <p className="text-white text-lg font-medium relative z-10 transition-all duration-300">
                {getOutput()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 8.1 Context Window Visualizer (Arc 4: Chapter 10)
export function ContextWindowWidget() {
  const [inputText, setInputText] = useState("Explain quantum physics to a 5 year old.");
  const MAX_TOKENS = 12;

  // Simple pseudo-tokenizer (splits by spaces and keeps punctuation)
  const tokens = inputText.trim() ? inputText.match(/[\w]+|[^\s\w]/g) || [] : [];
  
  const isOverflow = tokens.length > MAX_TOKENS;
  const visibleTokens = tokens.slice(-MAX_TOKENS);
  const droppedTokensCount = Math.max(0, tokens.length - MAX_TOKENS);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-4 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">The Context Window</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          When you send a prompt, the AI chops it into <strong>Tokens</strong> (chunks of words). 
          The AI has a limited short-term memory called the <strong>Context Window</strong>. 
          If you exceed the limit, it forgets the beginning of the conversation!
        </p>

        <div className="space-y-6">
          {/* User Input */}
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-bold">1. Write your Prompt</div>
            <textarea
              className="w-full bg-transparent text-white border-b border-white/20 focus:border-blue-400 outline-none p-2 resize-none"
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your prompt here..."
            />
          </div>

          {/* Tokenizer and Context Window */}
          <div className="bg-gradient-to-br from-purple-900/20 to-black p-6 rounded-xl border border-purple-500/30">
            <div className="flex justify-between items-end mb-4">
              <div className="text-xs text-purple-400 uppercase tracking-widest font-bold">2. The Context Window (Memory)</div>
              <div className={`text-xs font-bold ${isOverflow ? 'text-red-400' : 'text-green-400'}`}>
                {tokens.length} / {MAX_TOKENS} Tokens
              </div>
            </div>

            <div className="bg-black/60 p-4 rounded-lg border border-white/10 min-h-[120px] flex flex-wrap gap-2 content-start relative overflow-hidden">
              {visibleTokens.length === 0 && (
                <span className="text-gray-600 italic absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Window is empty
                </span>
              )}

              {visibleTokens.map((token, i) => (
                <div 
                  key={i}
                  className="bg-purple-500/20 text-purple-200 border border-purple-500/50 px-2 py-1 rounded text-sm font-mono animate-fade-in"
                >
                  {token}
                </div>
              ))}
            </div>

            {isOverflow && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm text-center animate-pulse">
                <strong>Warning!</strong> The Context Window is full. The oldest <strong>{droppedTokensCount}</strong> token(s) have been forgotten by the AI.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// 8.2 RAG Visualizer (Arc 4: Chapter 11)
export function RAGWidget() {
  const [query, setQuery] = useState("");
  const [retrieved, setRetrieved] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [asked, setAsked] = useState(false);

  const knowledgeBase = [
    { id: 1, title: "HR Policy", text: "The company refund policy is strictly 30 days with a receipt." },
    { id: 2, title: "Leadership", text: "The CEO of the company is John Doe. The CTO is Jane Smith." },
    { id: 3, title: "Tech Stack", text: "Our backend is built with Python and FastAPI, frontend is React." }
  ];

  const handleAsk = () => {
    if (!query) return;
    setAsked(true);
    
    // Simulate Retrieval
    let found = null;
    if (query.toLowerCase().includes("refund") || query.toLowerCase().includes("policy") || query.toLowerCase().includes("hr")) found = knowledgeBase[0];
    else if (query.toLowerCase().includes("ceo") || query.toLowerCase().includes("cto") || query.toLowerCase().includes("john") || query.toLowerCase().includes("leader")) found = knowledgeBase[1];
    else if (query.toLowerCase().includes("tech") || query.toLowerCase().includes("backend") || query.toLowerCase().includes("frontend") || query.toLowerCase().includes("stack")) found = knowledgeBase[2];

    setRetrieved(found);
    setGenerating(true);
    setOutput("");

    // Simulate Generation Delay
    setTimeout(() => {
      setGenerating(false);
      if (found?.id === 1) setOutput("Based on the HR Policy document, the company refund policy is 30 days with a receipt.");
      else if (found?.id === 2) setOutput("According to the Leadership document, the CEO is John Doe and the CTO is Jane Smith.");
      else if (found?.id === 3) setOutput("Our tech stack consists of Python and FastAPI for the backend, and React for the frontend.");
      else setOutput("I'm sorry, but I couldn't find the answer to your question in the provided documents.");
    }, 1500);
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-5xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">RAG (Retrieval-Augmented Generation) Simulator</h3>
        </div>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Ask a question about the company. Watch how the system <strong>Retrieves</strong> the correct document from the Library, pastes it into the <strong>Context Window</strong>, and <strong>Generates</strong> a factual answer!
        </p>

        <div className="flex gap-6 flex-col md:flex-row">
          
          {/* Step 1: The Library */}
          <div className="flex-1 bg-black/40 p-4 rounded-xl border border-blue-500/30">
            <div className="text-xs text-blue-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">1</span> 
              Knowledge Base
            </div>
            <div className="space-y-3">
              {knowledgeBase.map(doc => (
                <div key={doc.id} className={`p-3 rounded border text-sm transition-all duration-500 ${retrieved?.id === doc.id ? 'bg-blue-900/50 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' : 'bg-white/5 border-white/10 opacity-70'}`}>
                  <div className="font-bold text-gray-300 mb-1">{doc.title}</div>
                  <div className="text-gray-400">{doc.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Retrieval & Generation */}
          <div className="flex-[1.5] flex flex-col gap-4">
            
            {/* User Input */}
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 relative">
               <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold flex justify-between">
                 <span>User Query</span>
                 <span className="text-gray-500 text-[10px]">Try: "Who is the CEO?"</span>
               </div>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={query} 
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                   placeholder="e.g., What is the refund policy?"
                   className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-blue-400"
                 />
                 <button onClick={handleAsk} disabled={generating || !query} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors font-medium">
                   Ask
                 </button>
               </div>
            </div>

            {/* Context Window Assembly */}
            <div className={`flex-1 p-4 rounded-xl border transition-all duration-500 flex flex-col ${asked ? 'bg-purple-900/20 border-purple-500/50' : 'bg-black/40 border-white/5'}`}>
              <div className="text-xs text-purple-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center">2</span> 
                Context Window Assembly
              </div>
              
              {!asked ? (
                <div className="flex-1 flex items-center justify-center text-gray-600 italic text-sm">
                  Waiting for a query to retrieve documents...
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs text-gray-400 uppercase">System Prompt</div>
                  <div className="bg-black/50 p-3 rounded text-sm text-gray-300 border border-white/5">
                    "Answer the user's question using ONLY the following context."
                  </div>
                  
                  <div className="text-xs text-purple-300 uppercase mt-2">Retrieved Context</div>
                  {retrieved ? (
                    <div className="bg-purple-900/40 p-3 rounded text-sm text-white border border-purple-500/30 font-mono">
                      {retrieved.text}
                    </div>
                  ) : (
                    <div className="bg-red-900/20 p-3 rounded text-sm text-red-300 border border-red-500/30 font-mono italic">
                      [NO RELEVANT DOCUMENTS FOUND IN KNOWLEDGE BASE]
                    </div>
                  )}

                  <div className="text-xs text-gray-400 uppercase mt-2">User Question</div>
                  <div className="bg-blue-900/20 p-3 rounded text-sm text-blue-200 border border-blue-500/30">
                    "{query}"
                  </div>
                </div>
              )}
            </div>

            {/* Final AI Output */}
            <div className={`p-4 rounded-xl border transition-all duration-500 min-h-[100px] flex flex-col justify-center ${output ? 'bg-gradient-to-br from-green-900/20 to-black border-green-500/50' : 'bg-black/40 border-white/5'}`}>
              <div className="text-xs text-green-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span> 
                AI Output
              </div>
              {generating ? (
                <div className="flex items-center gap-2 text-green-400 animate-pulse">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animation-delay-400"></div>
                  <span className="ml-2 text-sm font-mono">Reading context & generating...</span>
                </div>
              ) : output ? (
                <div className="text-white text-lg font-medium">{output}</div>
              ) : (
                <div className="text-gray-600 italic text-sm">Waiting for context...</div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// 9. Reasoning Visualizer (Arc 4: Chapter 12)
export function ReasoningWidget() {
  const [mode, setMode] = useState(null); // 'fast' or 'deep'
  const [step, setStep] = useState(0); // For deep mode animation

  const puzzle = "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?";

  const handleFast = () => {
    setMode('fast');
    setStep(1); // Immediate output
  };

  const handleDeep = () => {
    setMode('deep');
    setStep(0);
    // Simulate chain of thought steps
    setTimeout(() => setStep(1), 800);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 3200);
    setTimeout(() => setStep(4), 4500);
    setTimeout(() => setStep(5), 5500); // Final output
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">System 1 vs System 2 Thinking</h3>
        </div>

        <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-6 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">The Puzzle</div>
          <div className="text-lg text-white font-medium italic">"{puzzle}"</div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={handleFast}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'fast' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-900/30 text-red-300 hover:bg-red-800/50 border border-red-500/30'}`}
          >
            ⚡ Fast Generation (System 1)
          </button>
          <button 
            onClick={handleDeep}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${mode === 'deep' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border border-blue-500/30'}`}
          >
            🧠 Deep Reasoning (System 2)
          </button>
        </div>

        <div className="min-h-[250px] transition-all duration-500 relative">
          
          {/* Fast Mode Output */}
          {mode === 'fast' && step >= 1 && (
            <div className="absolute inset-0 animate-fade-in flex flex-col items-center justify-center">
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 w-full max-w-2xl text-center shadow-lg">
                <div className="text-xs text-red-400 uppercase tracking-widest mb-4 font-bold flex justify-center items-center gap-2">
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">!</span>
                  Instant Intuitive Answer (Hallucination)
                </div>
                <div className="text-2xl text-white font-medium mb-4">
                  "The ball costs 10 cents."
                </div>
                <div className="text-sm text-red-300/80 italic">
                  (Why? The model instantly subtracted $1.00 from $1.10. It didn't pause to realize that if the ball is $0.10, the bat is $1.10, making the total $1.20!)
                </div>
              </div>
            </div>
          )}

          {/* Deep Mode Output */}
          {mode === 'deep' && (
            <div className="absolute inset-0 animate-fade-in flex flex-col gap-4 max-w-3xl mx-auto w-full">
              
              {/* Scratchpad */}
              <div className="flex-1 bg-black/60 border border-blue-500/30 rounded-xl p-4 font-mono text-sm relative overflow-hidden">
                <div className="text-xs text-blue-400 uppercase tracking-widest mb-3 font-bold border-b border-blue-900/50 pb-2">
                  Hidden AI Scratchpad (Chain of Thought)
                </div>
                
                <div className="space-y-2 text-gray-300 h-[120px]">
                  {step >= 1 && <div className="animate-fade-in text-blue-200">Let's think step by step.</div>}
                  {step >= 2 && <div className="animate-fade-in text-red-300">Intuition says 10 cents. But wait, if ball = $0.10, and bat is $1.00 more, bat = $1.10. Total = $1.20. That is incorrect.</div>}
                  {step >= 3 && <div className="animate-fade-in">Let's use algebra. Let 'x' be the cost of the ball.</div>}
                  {step >= 4 && <div className="animate-fade-in">The bat costs 'x + 1.00'.<br/>Total cost: x + (x + 1.00) = 1.10<br/>2x + 1.00 = 1.10<br/>2x = 0.10<br/>x = 0.05</div>}
                </div>

                {/* Loading indicator */}
                {step > 0 && step < 5 && (
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                )}
              </div>

              {/* Final Output */}
              <div className={`transition-all duration-500 ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 text-center shadow-lg">
                  <div className="text-xs text-green-400 uppercase tracking-widest mb-2 font-bold flex justify-center items-center gap-2">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">✓</span>
                    Verified Final Answer
                  </div>
                  <div className="text-xl text-white font-medium">
                    "The ball costs 5 cents."
                  </div>
                </div>
              </div>

            </div>
          )}

          {!mode && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 italic text-center max-w-md">
                Select a generation mode above to see how the AI processes the puzzle.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// 10. Agent Workspace Visualizer (Arc 4: Chapter 13)
export function AgentWidget() {
  const [step, setStep] = useState(0);

  const startAgent = () => {
    setStep(0);
    setTimeout(() => setStep(1), 500);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 3500);
    setTimeout(() => setStep(4), 5000);
    setTimeout(() => setStep(5), 6500);
    setTimeout(() => setStep(6), 8000);
    setTimeout(() => setStep(7), 9500);
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">Interactive Agent Workspace</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Tools & Task */}
          <div className="col-span-1 space-y-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">User Prompt</div>
              <div className="text-white font-medium">"Find the weather in Tokyo and email it to my boss, John."</div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Available Tools</div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="text-purple-300 flex items-center gap-2">
                  <span className="text-lg">☁️</span> get_weather(city)
                </li>
                <li className="text-blue-300 flex items-center gap-2">
                  <span className="text-lg">📧</span> send_email(to, body)
                </li>
              </ul>
            </div>

            <button 
              onClick={startAgent}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all border border-blue-400 shadow-lg"
            >
              Start Agent Workspace
            </button>
          </div>

          {/* Right Column: ReAct Loop */}
          <div className="col-span-2 bg-black/60 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden font-mono text-sm h-[400px]">
            <div className="text-xs text-blue-400 uppercase tracking-widest mb-4 font-bold border-b border-blue-900/50 pb-2">
              Execution Trace (ReAct Loop)
            </div>

            <div className="space-y-3 relative z-10 overflow-y-auto h-[320px] pr-2 custom-scrollbar">
              
              {step >= 1 && (
                <div className="animate-slide-in-right bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                  <span className="text-yellow-400 font-bold">THOUGHT 1:</span>
                  <span className="text-white ml-2">I need to find the current weather in Tokyo.</span>
                </div>
              )}
              
              {step >= 2 && (
                <div className="animate-slide-in-right bg-purple-900/20 p-3 rounded-lg border border-purple-500/50">
                  <span className="text-purple-400 font-bold">ACTION 1:</span>
                  <span className="text-purple-200 ml-2">get_weather(city="Tokyo")</span>
                </div>
              )}

              {step >= 3 && (
                <div className="animate-slide-in-right bg-green-900/20 p-3 rounded-lg border border-green-500/50">
                  <span className="text-green-400 font-bold">OBSERVATION 1:</span>
                  <span className="text-green-200 ml-2">"Sunny, 25°C"</span>
                </div>
              )}

              {step >= 4 && (
                <div className="animate-slide-in-right bg-gray-800/50 p-3 rounded-lg border border-gray-600">
                  <span className="text-yellow-400 font-bold">THOUGHT 2:</span>
                  <span className="text-white ml-2">Now I need to email this information to John.</span>
                </div>
              )}

              {step >= 5 && (
                <div className="animate-slide-in-right bg-blue-900/20 p-3 rounded-lg border border-blue-500/50">
                  <span className="text-blue-400 font-bold">ACTION 2:</span>
                  <span className="text-blue-200 ml-2">send_email(to="John", body="The weather in Tokyo is Sunny, 25°C.")</span>
                </div>
              )}

              {step >= 6 && (
                <div className="animate-slide-in-right bg-green-900/20 p-3 rounded-lg border border-green-500/50">
                  <span className="text-green-400 font-bold">OBSERVATION 2:</span>
                  <span className="text-green-200 ml-2">"Email sent successfully."</span>
                </div>
              )}

              {step >= 7 && (
                <div className="animate-slide-in-right bg-gray-800/80 p-3 rounded-lg border border-gray-400 mt-4">
                  <span className="text-white font-bold">FINAL ANSWER:</span>
                  <span className="text-gray-300 ml-2">"I have checked the weather for Tokyo (Sunny, 25°C) and emailed it to your boss, John."</span>
                </div>
              )}

            </div>

            {/* Loading / Typing indicator */}
            {step > 0 && step < 7 && (
              <div className="absolute bottom-4 right-4 flex gap-1 z-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

// 11. Taxonomy Visualizer (Arc 1: Chapter 3)
export function TaxonomyWidget() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 0,
      title: "Artificial Intelligence (AI)",
      desc: "Any program that does something smart. (e.g. Pac-Man ghosts, Chess bots)",
      color: "bg-blue-900/40 border-blue-500",
      textColor: "text-blue-300"
    },
    {
      id: 1,
      title: "Machine Learning (ML)",
      desc: "A subset of AI that learns patterns from data. (e.g. Netflix recommendations)",
      color: "bg-purple-900/50 border-purple-500",
      textColor: "text-purple-300"
    },
    {
      id: 2,
      title: "Deep Learning (DL)",
      desc: "A subset of ML that uses deep artificial neural networks. (e.g. Self-driving cars)",
      color: "bg-pink-900/60 border-pink-500",
      textColor: "text-pink-300"
    },
    {
      id: 3,
      title: "NLP",
      desc: "A subset of Deep Learning focused on understanding human language.",
      color: "bg-amber-900/70 border-amber-500",
      textColor: "text-amber-300"
    },
    {
      id: 4,
      title: "LLMs / GenAI",
      desc: "Massive NLP models that can generate brand new text, code, or images. (e.g. ChatGPT, Claude)",
      color: "bg-green-900/80 border-green-500",
      textColor: "text-green-300"
    }
  ];

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">The Taxonomy of Intelligence</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          
          {/* Visual Nesting */}
          <div className="flex-1 w-full max-w-[400px] aspect-square relative flex items-center justify-center cursor-pointer" onClick={() => setActiveLayer((prev) => (prev + 1) % 5)}>
            
            {/* AI Layer */}
            <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 flex items-start justify-center pt-8 ${activeLayer >= 0 ? 'bg-blue-900/20 border-blue-500' : 'bg-transparent border-white/10'}`}>
              <span className={`font-bold transition-all ${activeLayer >= 0 ? 'text-blue-400' : 'text-gray-600'}`}>AI</span>
            </div>

            {/* ML Layer */}
            <div className={`absolute inset-[10%] rounded-full border-2 transition-all duration-500 flex items-start justify-center pt-5 ${activeLayer >= 1 ? 'bg-purple-900/30 border-purple-500' : 'bg-transparent border-white/10'}`}>
              <span className={`font-bold transition-all ${activeLayer >= 1 ? 'text-purple-400' : 'text-gray-600'}`}>ML</span>
            </div>

            {/* DL Layer */}
            <div className={`absolute inset-[22%] rounded-full border-2 transition-all duration-500 flex items-start justify-center pt-4 ${activeLayer >= 2 ? 'bg-pink-900/40 border-pink-500' : 'bg-transparent border-white/10'}`}>
              <span className={`font-bold transition-all ${activeLayer >= 2 ? 'text-pink-400' : 'text-gray-600'}`}>DL</span>
            </div>

            {/* NLP Layer */}
            <div className={`absolute inset-[35%] rounded-full border-2 transition-all duration-500 flex items-start justify-center pt-4 ${activeLayer >= 3 ? 'bg-amber-900/50 border-amber-500' : 'bg-transparent border-white/10'}`}>
              <span className={`font-bold text-sm transition-all ${activeLayer >= 3 ? 'text-amber-400' : 'text-gray-600'}`}>NLP</span>
            </div>
            
            {/* LLM Layer */}
            <div className={`absolute inset-[50%] rounded-full border-2 transition-all duration-500 flex items-center justify-center text-center p-2 ${activeLayer >= 4 ? 'bg-green-900/60 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-transparent border-white/10'}`}>
              <span className={`font-bold text-xs transition-all ${activeLayer >= 4 ? 'text-green-400' : 'text-gray-600'}`}>LLMs</span>
            </div>

          </div>

          {/* Description Panel */}
          <div className="flex-1 w-full space-y-3">
            {layers.map((layer, idx) => (
              <div 
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${activeLayer >= layer.id ? layer.color + ' opacity-100 scale-100' : 'bg-black/20 border-white/5 opacity-50 scale-95 hover:opacity-80'}`}
              >
                <h4 className={`font-bold text-sm mb-1 ${layer.textColor}`}>{layer.title}</h4>
                <p className="text-xs text-gray-300 leading-tight">{layer.desc}</p>
              </div>
            ))}
            <div className="text-center text-xs text-gray-500 italic mt-2">
              Click the layers to expand the definition.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// 12. Embeddings Visualizer (Arc 3: Chapter 8)
export function EmbeddingsWidget() {
  const [activeWord, setActiveWord] = useState(null);

  // Simulated 2D projection of 1000-dimensional Latent Space
  const wordPoints = [
    // Animals cluster
    { word: "Dog", x: 20, y: 80, cluster: "animals", vector: [0.82, -0.45, 0.12] },
    { word: "Cat", x: 25, y: 75, cluster: "animals", vector: [0.78, -0.42, 0.15] },
    { word: "Wolf", x: 15, y: 85, cluster: "animals", vector: [0.85, -0.50, 0.08] },
    
    // Food cluster
    { word: "Apple", x: 75, y: 20, cluster: "food", vector: [-0.34, 0.88, 0.22] },
    { word: "Banana", x: 80, y: 25, cluster: "food", vector: [-0.30, 0.85, 0.25] },
    { word: "Orange", x: 70, y: 15, cluster: "food", vector: [-0.38, 0.90, 0.18] },

    // Vehicles cluster
    { word: "Car", x: 80, y: 80, cluster: "vehicles", vector: [0.12, 0.15, 0.92] },
    { word: "Truck", x: 85, y: 85, cluster: "vehicles", vector: [0.15, 0.18, 0.95] },
    { word: "Bus", x: 75, y: 75, cluster: "vehicles", vector: [0.10, 0.12, 0.88] },

    // Royal cluster
    { word: "King", x: 20, y: 20, cluster: "royal", vector: [-0.75, -0.65, 0.40] },
    { word: "Queen", x: 25, y: 25, cluster: "royal", vector: [-0.72, -0.62, 0.45] },
    { word: "Prince", x: 15, y: 15, cluster: "royal", vector: [-0.78, -0.68, 0.38] }
  ];

  const getClusterColor = (cluster) => {
    switch(cluster) {
      case 'animals': return 'bg-amber-500 border-amber-300';
      case 'food': return 'bg-green-500 border-green-300';
      case 'vehicles': return 'bg-blue-500 border-blue-300';
      case 'royal': return 'bg-purple-500 border-purple-300';
      default: return 'bg-gray-500 border-gray-300';
    }
  };

  const getVectorString = (vector) => {
    return `[${vector[0].toFixed(2)}, ${vector[1].toFixed(2)}, ${vector[2].toFixed(2)}, ...]`;
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">Latent Space (Embedding Visualizer)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Graph */}
          <div className="col-span-2 relative bg-black/60 border border-white/10 rounded-xl aspect-square md:aspect-auto overflow-hidden custom-scrollbar">
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>
            
            {/* Plot Points */}
            {wordPoints.map((wp, i) => (
              <div 
                key={i}
                className={`absolute w-3 h-3 rounded-full border shadow-[0_0_10px_currentColor] cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-150 ${getClusterColor(wp.cluster)} ${activeWord?.word === wp.word ? 'scale-150 ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                onClick={() => setActiveWord(wp)}
                onMouseEnter={() => setActiveWord(wp)}
              >
                {/* Label */}
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-1 rounded bg-black/80 pointer-events-none transition-opacity ${activeWord?.word === wp.word ? 'opacity-100 text-white' : 'opacity-70 text-gray-300'}`}>
                  {wp.word}
                </div>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono">
              * 2D Projection of 1000-D Space
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-span-1 space-y-4">
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-blue-400 uppercase mb-2">How it works</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Hover over the dots on the left. The AI maps words with similar meanings physically close together in mathematical space. Notice how Animals cluster in the top left, and Food in the bottom right!
              </p>
            </div>

            {activeWord ? (
              <div className="bg-black/40 border border-white/20 p-4 rounded-xl animate-fade-in">
                <div className="text-center mb-4">
                  <span className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    "{activeWord.word}"
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Semantic Cluster</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getClusterColor(activeWord.cluster)} bg-opacity-20`}>
                      {activeWord.cluster.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Vector Coordinates (Embedding)</div>
                    <div className="font-mono text-xs text-green-400 bg-black/60 p-2 rounded border border-green-500/30 break-all">
                      {getVectorString(activeWord.vector)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-sm text-center p-4">
                Hover over a point to inspect its mathematical embedding vector.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

// 13. Generative vs Discriminative Widget (Arc 2: Chapter 4)
export function GenerativeWidget() {
  const [mode, setMode] = useState('discriminative'); // 'discriminative' | 'generative'
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = (m) => {
    setMode(m);
    setIsProcessing(true);
    setResult(null);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (m === 'discriminative') {
        setResult({
          type: 'label',
          text: '[99.8% Confidence: Dog]',
          color: 'text-blue-400',
          bg: 'bg-blue-900/30 border-blue-500/50'
        });
      } else {
        setResult({
          type: 'image',
          emoji: '🐶 🚀 🌌',
          desc: 'A golden retriever floating in space wearing a futuristic spacesuit',
          color: 'text-amber-400',
          bg: 'bg-amber-900/30 border-amber-500/50'
        });
      }
    }, 1500);
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">The AI Paradigm Shift</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Input Source */}
          <div className="col-span-1 border border-white/10 bg-black/40 rounded-xl p-4 flex flex-col items-center justify-center space-y-4">
            <h4 className="text-gray-400 font-bold text-sm uppercase">Input Prompt</h4>
            <div className="text-6xl">🐶</div>
            <p className="text-center text-sm text-gray-300 font-mono bg-white/5 p-2 rounded w-full">
              Prompt: "A dog in a spacesuit"
            </p>
          </div>

          {/* Engine Toggle */}
          <div className="col-span-1 flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col w-full space-y-2">
              <button 
                onClick={() => handleSimulate('discriminative')}
                className={`p-3 rounded-xl border-2 font-bold transition-all ${mode === 'discriminative' ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                1. Discriminative Mode
                <div className="text-xs font-normal opacity-70 mt-1">Categorizes the prompt</div>
              </button>
              
              <button 
                onClick={() => handleSimulate('generative')}
                className={`p-3 rounded-xl border-2 font-bold transition-all ${mode === 'generative' ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                2. Generative Mode
                <div className="text-xs font-normal opacity-70 mt-1">Predicts & Creates</div>
              </button>
            </div>
          </div>

          {/* Output Source */}
          <div className="col-span-1 border border-white/10 bg-black/40 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px]">
            <h4 className="text-gray-400 font-bold text-sm uppercase mb-4">AI Output</h4>
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                <div className="text-xs text-gray-400 font-mono animate-pulse">
                  {mode === 'discriminative' ? 'Calculating probabilities...' : 'Predicting next pixel...'}
                </div>
              </div>
            ) : result ? (
              <div className={`w-full p-4 rounded-xl border ${result.bg} flex flex-col items-center justify-center animate-fade-in`}>
                {result.type === 'label' ? (
                  <>
                    <div className="text-xs text-gray-400 uppercase font-bold mb-2">Classification</div>
                    <div className={`font-mono font-bold text-center ${result.color}`}>
                      {result.text}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-gray-400 uppercase font-bold mb-2">Creation (Hallucination)</div>
                    <div className="text-4xl mb-2">{result.emoji}</div>
                    <div className={`text-xs text-center font-bold ${result.color}`}>
                      "{result.desc}"
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-gray-600 text-sm italic text-center">
                Click a mode to process the prompt.
              </div>
            )}
          </div>

        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-surface-100 border border-glass-stroke text-sm text-gray-300">
          <strong>Key Takeaway:</strong> Discriminative AI looks at data and puts it in a bucket (e.g. "This is a dog"). Generative AI looks at data and hallucinates entirely new data based on patterns (e.g. "Here is a brand new image of a dog in space").
        </div>

      </div>
    </div>
  );
}

// 14. Diffusion Visualizer (Arc 2: Chapter 11)
export function DiffusionWidget() {
  const [step, setStep] = useState(0); // 0 to 10
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && step < 10) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 400); // 400ms per step
    } else if (isPlaying && step >= 10) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleStart = () => {
    setStep(0);
    setTimeout(() => setIsPlaying(true), 100);
  };

  // Calculate blur and noise based on step
  // Step 0: 100% noise, 20px blur
  // Step 10: 0% noise, 0px blur
  const progress = step / 10;
  const blurAmount = 20 * (1 - progress);
  const opacityAmount = progress;
  const noiseOpacity = 1 - progress;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-glass-stroke pb-2">
          <h3 className="text-xl font-bold text-white">The Reverse Diffusion Process</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          
          {/* Controls */}
          <div className="flex-1 space-y-6 w-full">
            <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
              <h4 className="text-gray-400 font-bold text-sm uppercase mb-2">Prompt</h4>
              <div className="font-mono text-amber-400 bg-black/60 p-3 rounded text-sm border border-amber-500/30">
                "A cute cyberpunk dog wearing a neon collar"
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleStart}
                disabled={isPlaying}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                {isPlaying ? 'Denoising...' : 'Generate Image (Start Reverse Diffusion)'}
              </button>

              <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-2 uppercase">
                <span>Pure Static</span>
                <span>Structured Image</span>
              </div>
              
              <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 font-mono">
                Step {step} / 10
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 w-full max-w-[350px] aspect-square bg-black rounded-xl border border-white/20 relative overflow-hidden flex items-center justify-center shadow-2xl">
            
            {/* The Target Image */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-9xl transition-all duration-300"
              style={{
                filter: `blur(${blurAmount}px)`,
                opacity: Math.max(0.1, opacityAmount),
                transform: `scale(${1 + (blurAmount / 20)})`
              }}
            >
              🐶
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-9xl transition-all duration-300" style={{ opacity: opacityAmount }}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl">✨</div>
            </div>

            {/* The Noise Overlay */}
            <div 
              className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: noiseOpacity,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                mixBlendMode: 'overlay',
                backgroundSize: '150px'
              }}
            ></div>
            
            {/* Pure white static effect at step 0 */}
            <div 
              className="absolute inset-0 z-20 bg-white transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: step === 0 ? 0.3 : 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              }}
            ></div>

          </div>

        </div>

      </div>
    </div>
  );
}
