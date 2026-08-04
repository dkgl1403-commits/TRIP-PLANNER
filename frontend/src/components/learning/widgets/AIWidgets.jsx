import React, { useState, useEffect } from 'react';

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
          <div className="flex-1 w-full max-w-[350px] aspect-square bg-gray-800 rounded-xl border border-white/20 relative overflow-hidden flex items-center justify-center shadow-2xl">
            
            {/* The Target Image (Always opaque, just blurs into focus) */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-9xl transition-all duration-300"
              style={{
                filter: `blur(${blurAmount}px)`,
                transform: `scale(${1 + (blurAmount / 40)})`
              }}
            >
              🐶
            </div>
            
            {/* The Sparkles (Fade in) */}
            <div className="absolute inset-0 flex items-center justify-center text-9xl transition-all duration-300" style={{ opacity: opacityAmount }}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl translate-x-4 -translate-y-4">✨</div>
            </div>

            {/* The Noise Overlay (Simply fades out) */}
            <div 
              className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: noiseOpacity,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")'
              }}
            ></div>

          </div>

        </div>

      </div>
    </div>
  );
}

// 15. RAG vs Fine-Tuning (Arc 6: Chapter 17)
export function RAGvsFineTuningWidget() {
  const [mode, setMode] = useState('base'); // base, rag, finetuned
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-white">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🧠</span> Knowledge Architecture
      </h3>
      
      <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-lg">
        <button 
          onClick={() => setMode('base')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'base' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Base Model
        </button>
        <button 
          onClick={() => setMode('rag')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'rag' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          RAG
        </button>
        <button 
          onClick={() => setMode('finetuned')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'finetuned' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Fine-Tuned (LoRA)
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
        {/* User Prompt */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">👤</div>
          <div className="bg-blue-900/40 p-3 rounded-lg border border-blue-500/30 text-blue-100 flex-1">
            "What is our company's secret Q3 revenue?"
          </div>
        </div>

        {/* Processing Visualization */}
        <div className="flex-1 py-6 flex flex-col items-center justify-center relative">
          
          {mode === 'base' && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="text-4xl mb-2">🧠</div>
              <div className="text-sm text-gray-400 text-center">Base Brain<br/>(Only knows public internet)</div>
            </div>
          )}

          {mode === 'rag' && (
            <div className="flex w-full items-center justify-center gap-8">
              <div className="flex flex-col items-center animate-fade-in-up">
                <div className="text-4xl mb-2 text-green-400">🔍</div>
                <div className="text-sm text-green-400/70 text-center">Search Engine<br/>(Finds Q3 doc)</div>
              </div>
              <div className="h-0.5 w-16 bg-green-500/30 relative">
                <div className="absolute inset-0 bg-green-400 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">🧠</div>
                <div className="text-sm text-gray-400 text-center">Base Brain<br/>(Reads the doc)</div>
              </div>
            </div>
          )}

          {mode === 'finetuned' && (
            <div className="flex flex-col items-center relative animate-fade-in-up">
              <div className="text-4xl mb-2">🧠</div>
              <div className="absolute -top-2 -right-4 bg-purple-500 text-xs px-2 py-1 rounded-full animate-bounce">LoRA Adapter</div>
              <div className="text-sm text-purple-400/70 text-center mt-2">Upgraded Brain<br/>(Trained on private data)</div>
            </div>
          )}
          
        </div>

        {/* AI Response */}
        <div className="flex gap-4 items-end">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">🤖</div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 text-gray-200 flex-1 relative overflow-hidden">
            {mode === 'base' && (
              <span className="text-red-400 italic">"I'm sorry, I don't have access to your private company data."</span>
            )}
            {mode === 'rag' && (
              <span className="text-green-400">"According to the retrieved document, Q3 revenue was $4.2M."</span>
            )}
            {mode === 'finetuned' && (
              <span className="text-purple-400">"Our Q3 revenue was $4.2M, beating expectations by 15%."</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// 16. Quantization (Arc 6: Chapter 18)
export function QuantizationWidget() {
  const [precision, setPrecision] = useState(16); // 16, 8, 4

  const getWeightText = () => {
    if (precision === 16) return "3.141592653589";
    if (precision === 8) return "3.14159";
    return "3.14";
  };

  const getMemoryUsage = () => {
    if (precision === 16) return 140;
    if (precision === 8) return 70;
    return 35;
  };

  const getIntelligence = () => {
    if (precision === 16) return 100;
    if (precision === 8) return 99.2;
    return 96.5;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-white">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🗜️</span> Model Compression (Quantization)
      </h3>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-400">
          <span>Max Quality (FP16)</span>
          <span>Medium (INT8)</span>
          <span>Max Compression (INT4)</span>
        </div>
        <input 
          type="range" 
          min="0" max="2" step="1"
          value={precision === 16 ? 0 : precision === 8 ? 1 : 2}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setPrecision(val === 0 ? 16 : val === 1 ? 8 : 4);
          }}
          className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Memory Bar */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col justify-center">
          <div className="text-sm text-gray-400 mb-2">VRAM Required</div>
          <div className="text-3xl font-bold text-white mb-2">{getMemoryUsage()} GB</div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full transition-all duration-500 ${precision === 16 ? 'bg-red-500' : precision === 8 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(getMemoryUsage() / 140) * 100}%` }}></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {precision === 16 ? "Needs cloud servers" : precision === 8 ? "Fits on Mac Studio" : "Fits on iPhone"}
          </div>
        </div>

        {/* Intelligence Bar */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col justify-center">
          <div className="text-sm text-gray-400 mb-2">Model Intelligence</div>
          <div className="text-3xl font-bold text-white mb-2">{getIntelligence()}%</div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${getIntelligence()}%` }}></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Minimal intelligence loss for massive memory savings
          </div>
        </div>
      </div>

      <div className="mt-4 bg-black/40 p-4 rounded-lg font-mono text-center flex flex-col items-center justify-center min-h-[100px]">
        <div className="text-xs text-gray-500 mb-1">Internal Math Weight (Truncated)</div>
        <div className="text-2xl text-green-400 transition-all duration-300">
          {getWeightText()}
        </div>
      </div>
    </div>
  );
}


// 17. Mixture of Experts (Arc 6: Chapter 19)
export function MoEWidget() {
  const [activeExperts, setActiveExperts] = useState([0, 1]); // default

  const experts = [
    { id: 0, name: "Grammar", icon: "📝" },
    { id: 1, name: "Math", icon: "🧮" },
    { id: 2, name: "Coding", icon: "💻" },
    { id: 3, name: "French", icon: "🥖" },
    { id: 4, name: "History", icon: "🏛️" },
    { id: 5, name: "Medical", icon: "⚕️" },
    { id: 6, name: "Logic", icon: "🧩" },
    { id: 7, name: "Physics", icon: "⚛️" }
  ];

  const simulatePrompt = (promptType) => {
    if (promptType === 'code') setActiveExperts([2, 6]);
    else if (promptType === 'french_history') setActiveExperts([3, 4]);
    else if (promptType === 'medical_math') setActiveExperts([1, 5]);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-white">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">👔</span> Mixture of Experts (MoE)
      </h3>
      
      <div className="flex gap-2 mb-6">
        <button onClick={() => simulatePrompt('code')} className="flex-1 py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded text-xs">"Write Python code"</button>
        <button onClick={() => simulatePrompt('french_history')} className="flex-1 py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded text-xs">"History of Paris (in French)"</button>
        <button onClick={() => simulatePrompt('medical_math')} className="flex-1 py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded text-xs">"Calculate drug dosage"</button>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        
        {/* Router */}
        <div className="flex justify-center mb-8 relative">
          <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10">
            Router Gate
          </div>
          {/* Beams */}
          <div className="absolute top-1/2 left-0 right-0 h-32 pointer-events-none flex justify-center">
             <div className="w-full flex justify-around mt-4 opacity-30">
                {experts.map(e => (
                  <div key={e.id} className={`w-0.5 h-16 transition-all duration-300 ${activeExperts.includes(e.id) ? 'bg-blue-400 h-24 shadow-[0_0_8px_#60a5fa]' : 'bg-transparent'}`}></div>
                ))}
             </div>
          </div>
        </div>

        {/* Experts */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {experts.map(expert => {
            const isActive = activeExperts.includes(expert.id);
            return (
              <div 
                key={expert.id} 
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-500 ${
                  isActive 
                    ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)] scale-110' 
                    : 'bg-gray-800 border-gray-700 opacity-40 scale-95'
                }`}
              >
                <div className="text-3xl mb-1">{expert.icon}</div>
                <div className={`text-xs font-bold ${isActive ? 'text-blue-300' : 'text-gray-500'}`}>{expert.name}</div>
                <div className="text-[10px] mt-1 text-gray-500">{isActive ? 'ACTIVE' : 'SLEEPING'}</div>
              </div>
            );
          })}
        </div>

        {/* Power Saved */}
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">Compute Cost: </span>
          <span className="text-green-400 font-bold ml-2">75% Power Saved</span>
          <div className="text-xs text-gray-500 mt-1">(Only 2 out of 8 experts activated for this word)</div>
        </div>

      </div>
    </div>
  );
}

// 18. CPU vs GPU Core Anatomy (Arc 7: Chapter 20)
export function CpuVsGpuCoreWidget() {
  const [mode, setMode] = useState('diagram'); // diagram, race
  const [raceState, setRaceState] = useState('idle'); // idle, complex, simple
  const [cpuProgress, setCpuProgress] = useState(0);
  const [gpuProgress, setGpuProgress] = useState(0);
  const [timer, setTimer] = useState(null);

  const startRace = (type) => {
    if (timer) clearInterval(timer);
    setCpuProgress(0);
    setGpuProgress(0);
    setRaceState(type);
    
    let c = 0;
    let g = 0;
    
    const interval = setInterval(() => {
      if (type === 'complex') {
        c += 100; // CPU instantly finishes 1 complex task
        g += 5;   // GPU struggles with complex sequential logic
      } else {
        c += 2;   // CPU slowly churns through 1 million simple tasks sequentially
        g += 100; // GPU instantly parallel processes 1 million simple tasks
      }
      
      setCpuProgress(Math.min(c, 100));
      setGpuProgress(Math.min(g, 100));
      
      if (c >= 100 && g >= 100) clearInterval(interval);
    }, 50);
    
    setTimer(interval);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-white">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🔬</span> The Anatomy of a Core
      </h3>

      <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-lg">
        <button 
          onClick={() => { setMode('diagram'); setRaceState('idle'); }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'diagram' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Anatomy
        </button>
        <button 
          onClick={() => setMode('race')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'race' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          The Math Race
        </button>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 min-h-[350px]">
        {mode === 'diagram' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* CPU */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-blue-400 mb-2">CPU (The Genius)</div>
              <div className="text-xs text-gray-400 mb-4 text-center">Optimized for low-latency sequential logic</div>
              <div className="w-48 h-48 bg-gray-800 border-2 border-blue-500/50 rounded-lg p-2 grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-blue-900/30 border border-blue-500/30 rounded flex flex-col items-center justify-center p-2 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/30 transition-colors"></div>
                     <div className="text-xl mb-1">🧠</div>
                     <div className="text-[10px] text-blue-300 text-center leading-tight">Massive Core<br/>+ Huge Cache<br/>+ Branch Predictor</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm">Example: 4 to 16 Cores</div>
            </div>

            {/* GPU */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-green-400 mb-2">GPU (The Army)</div>
              <div className="text-xs text-gray-400 mb-4 text-center">Optimized for high-throughput parallel math</div>
              <div className="w-48 h-48 bg-gray-800 border-2 border-green-500/50 rounded-lg p-2 flex flex-col">
                <div className="flex-1 grid grid-cols-10 grid-rows-10 gap-px">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className="bg-green-500/40 hover:bg-green-400 transition-colors rounded-sm"></div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm">Example: 10,000+ Cores</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => startRace('complex')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors border border-gray-600"
              >
                Solve 1 Complex Logic Puzzle
              </button>
              <button 
                onClick={() => startRace('simple')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors border border-gray-600"
              >
                Solve 1 Million Simple Math Equations (AI)
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-8 justify-center">
              {/* CPU Track */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-400 font-bold">CPU (Sequential)</span>
                  <span className="text-gray-400">{cpuProgress === 100 ? 'Finished!' : raceState !== 'idle' ? 'Processing...' : ''}</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-75"
                    style={{ width: `${cpuProgress}%` }}
                  ></div>
                  {raceState === 'simple' && cpuProgress > 0 && cpuProgress < 100 && (
                    <div className="absolute inset-0 flex items-center px-2 text-[10px] text-white whitespace-nowrap">
                       1... 2... 3... 4... (Solving one by one)
                    </div>
                  )}
                </div>
              </div>

              {/* GPU Track */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-400 font-bold">GPU (Parallel)</span>
                  <span className="text-gray-400">{gpuProgress === 100 ? 'Finished!' : raceState !== 'idle' ? 'Processing...' : ''}</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 relative">
                  <div 
                    className="h-full bg-green-500 transition-all duration-75"
                    style={{ width: `${gpuProgress}%` }}
                  ></div>
                  {raceState === 'simple' && gpuProgress > 0 && gpuProgress < 100 && (
                    <div className="absolute inset-0 flex items-center px-2 text-[10px] text-white whitespace-nowrap">
                       Solving all 1,000,000 simultaneously!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// 19. Data Center (Arc 7: Chapter 21)
export function DataCenterWidget() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [metrics, setMetrics] = useState({
    watts: 0,
    joules: 0,
    waterLiters: 0,
    costCents: 0,
    gpus: 0
  });

  const handlePrompt = () => {
    if (!prompt.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setMetrics({ watts: 0, joules: 0, waterLiters: 0, costCents: 0, gpus: 0 });

    const charCount = prompt.length;
    // Arbitrary scale just for visualization
    const targetGpus = Math.max(1, Math.min(8, Math.floor(charCount / 10)));
    const targetWatts = targetGpus * 700; // 700W per H100
    const targetJoules = targetWatts * 2.5; // 2.5 seconds of compute
    const targetWater = (targetJoules / 10000).toFixed(2);
    const targetCost = ((targetWatts / 1000) * 0.15 * (targetGpus / 2)).toFixed(2); // very rough estimate

    let current = 0;
    const interval = setInterval(() => {
      current += 0.1;
      if (current >= 1) {
        clearInterval(interval);
        setMetrics({
          watts: targetWatts,
          joules: targetJoules,
          waterLiters: targetWater,
          costCents: targetCost,
          gpus: targetGpus
        });
        setIsProcessing(false);
      } else {
        setMetrics({
          watts: Math.floor(targetWatts * current),
          joules: Math.floor(targetJoules * current),
          waterLiters: (targetWater * current).toFixed(2),
          costCents: (targetCost * current).toFixed(2),
          gpus: Math.max(1, Math.floor(targetGpus * current))
        });
      }
    }, 100);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-white relative overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🏭</span> The Cost of a Prompt
      </h3>

      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type a prompt for the AI..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          onKeyDown={e => e.key === 'Enter' && handlePrompt()}
        />
        <button 
          onClick={handlePrompt}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded text-sm font-bold transition-colors"
        >
          Send to Data Center
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 relative">
        {/* The Connection */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="text-3xl z-10 bg-gray-900 p-2 rounded-full">💻</div>
          <div className="flex-1 h-1 mx-4 relative overflow-hidden bg-gray-800">
            {isProcessing && (
              <div className="absolute inset-0 bg-blue-500 w-1/4 animate-[pulse_0.5s_ease-in-out_infinite] blur-sm"></div>
            )}
          </div>
          <div className="text-4xl z-10">🏟️</div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-3 rounded border border-gray-600 flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">GPUs Activated</div>
            <div className="text-2xl font-bold text-green-400">{metrics.gpus}</div>
            <div className="text-[10px] text-gray-500 mt-1">H100 Tensor Cores</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded border border-gray-600 flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">Electricity Use</div>
            <div className="text-2xl font-bold text-yellow-400">{metrics.watts}</div>
            <div className="text-[10px] text-gray-500 mt-1">Watts consumed</div>
          </div>

          <div className="bg-gray-800 p-3 rounded border border-gray-600 flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">Water Evaporated</div>
            <div className="text-2xl font-bold text-blue-400">{metrics.waterLiters}</div>
            <div className="text-[10px] text-gray-500 mt-1">Liters (for cooling)</div>
          </div>

          <div className="bg-gray-800 p-3 rounded border border-gray-600 flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">Estimated Cost</div>
            <div className="text-2xl font-bold text-red-400">{metrics.costCents}¢</div>
            <div className="text-[10px] text-gray-500 mt-1">Cents (OpEx)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Data Center Anatomy Widget
export function DataCenterAnatomyWidget() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: "servers",
      title: "1. Server Racks",
      icon: "dns",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500",
      description: "The core brains. Massive 'fridge-sized' metal cabinets packed with CPUs to manage data flow, GPUs to crunch the math, and high-density SSDs to store Petabytes of training data. A single rack can weigh over a ton.",
    },
    {
      id: "cooling",
      title: "2. Cooling Infrastructure",
      icon: "ac_unit",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500",
      description: "AI chips run so hot they would melt themselves in seconds. Instead of just air conditioning, modern AI centers use Direct-to-Chip Liquid Cooling—piping cold water directly over the processors, which then loops out to massive evaporation cooling towers on the roof.",
    },
    {
      id: "power",
      title: "3. Power Substation & Generators",
      icon: "bolt",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500",
      description: "Data centers consume as much electricity as small cities (100-300 Megawatts). They require their own dedicated high-voltage electrical substations connected directly to the national grid, plus rows of massive diesel backup generators to ensure 100% uptime if the grid fails.",
    },
    {
      id: "networking",
      title: "4. Networking & Fiber Optics",
      icon: "cable",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500",
      description: "AI training requires thousands of GPUs to talk to each other in milliseconds. This requires miles of ultra-high-speed fiber-optic cables running under the raised floors and over the ceiling, connecting every single server in a massive spiderweb.",
    }
  ];

  return (
    <div className="w-full flex justify-center py-8 text-white">
      <div className="w-full max-w-4xl bg-gray-950 rounded-2xl p-6 border border-gray-800 shadow-xl">
        <h3 className="text-xl font-bold text-gray-200 mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
          <span className="text-2xl material-symbols-outlined">domain</span> 
          Inside the Fortress
        </h3>

        <img 
          src="/ai_data_center.png" 
          alt="AI Data Center Interior" 
          className="w-full h-64 object-cover rounded-xl mb-6 border border-gray-800 shadow-2xl"
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Visual Map */}
          <div className="flex-1 flex flex-col gap-3 relative p-4 bg-gray-900 rounded-xl border border-gray-800">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none rounded-xl"></div>
            
            {layers.map((layer, idx) => (
              <button 
                key={layer.id}
                onClick={() => setActiveLayer(idx)}
                className={`relative z-10 w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex items-center gap-4 ${
                  activeLayer === idx 
                    ? `${layer.borderColor} ${layer.bgColor} shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.02]` 
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500 opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`material-symbols-outlined text-4xl ${layer.color}`}>
                  {layer.icon}
                </div>
                <div className="font-bold text-lg">{layer.title}</div>
              </button>
            ))}
          </div>

          {/* Details Panel */}
          <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 p-6 flex flex-col justify-center">
            <div className={`material-symbols-outlined text-6xl mb-4 ${layers[activeLayer].color}`}>
              {layers[activeLayer].icon}
            </div>
            <h4 className="text-2xl font-bold mb-4">{layers[activeLayer].title}</h4>
            <p className="text-gray-300 leading-relaxed text-lg">
              {layers[activeLayer].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. AI Ecosystem Supply Chain Widget
export function AIEcosystemWidget() {
  const [activeNode, setActiveNode] = useState('asml');

  const nodes = {
    data: {
      id: 'data',
      title: 'Data Barons',
      subtitle: '(Reddit, NYT, X)',
      color: 'bg-green-500',
      border: 'border-green-400',
      text: 'text-green-400',
      icon: 'database',
      dependsOn: [],
      description: 'The raw material. Human knowledge, text, and images scraped from the internet. The owners of this data are now locking it down and charging billions to license it for training.'
    },
    asml: {
      id: 'asml',
      title: 'Machine Builders',
      subtitle: '(ASML Monopoly)',
      color: 'bg-pink-500',
      border: 'border-pink-400',
      text: 'text-pink-400',
      icon: 'precision_manufacturing',
      dependsOn: [],
      description: 'The Dutch monopoly. ASML builds $200M Extreme Ultraviolet (EUV) lithography machines. They use lasers to vaporize liquid tin to print patterns on silicon at the atomic level. Without them, there are no chips.'
    },
    tsmc: {
      id: 'tsmc',
      title: 'Fabricators',
      subtitle: '(TSMC Taiwan)',
      color: 'bg-blue-500',
      border: 'border-blue-400',
      text: 'text-blue-400',
      icon: 'factory',
      dependsOn: ['asml'],
      description: 'The global choke point. TSMC buys ASML machines to physically print 90% of the world\'s advanced chips. The entire AI industry is dangerously reliant on this single island.'
    },
    nvidia: {
      id: 'nvidia',
      title: 'GPU Designers',
      subtitle: '(Nvidia Monopoly)',
      color: 'bg-green-600', // NVIDIA green
      border: 'border-green-500',
      text: 'text-green-500',
      icon: 'memory',
      dependsOn: ['tsmc'],
      description: 'The kingmaker. Nvidia doesn\'t print their own chips (TSMC does). Nvidia designs them (H100) and wrote the CUDA software that developers must use to program them. They sell shovels in a gold rush.'
    },
    cloud: {
      id: 'cloud',
      title: 'Hyperscalers',
      subtitle: '(Microsoft, AWS, GCP)',
      color: 'bg-cyan-500',
      border: 'border-cyan-400',
      text: 'text-cyan-400',
      icon: 'cloud',
      dependsOn: ['nvidia'],
      description: 'The landlords. They buy the Nvidia GPUs in bulk and build the billion-dollar physical data centers. AI researchers must pay them to rent the compute power.'
    },
    labs: {
      id: 'labs',
      title: 'Frontier Labs',
      subtitle: '(OpenAI, Anthropic, Meta)',
      color: 'bg-purple-500',
      border: 'border-purple-400',
      text: 'text-purple-400',
      icon: 'psychology',
      dependsOn: ['cloud', 'data'],
      description: 'The model builders. They take the raw data and run it through the Hyperscaler\'s GPUs to train models like ChatGPT and Llama. They are in a deathmatch between closed-source and open-source.'
    }
  };

  const selectedNode = nodes[activeNode];

  return (
    <div className="w-full flex justify-center py-8 text-white">
      <div className="w-full max-w-4xl bg-gray-950 rounded-2xl p-6 border border-gray-800 shadow-xl">
        <h3 className="text-xl font-bold text-gray-200 mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
          <span className="text-2xl material-symbols-outlined">hub</span> 
          The Trillion-Dollar Supply Chain
        </h3>

        <div className="flex flex-col gap-6">
          {/* Map Area */}
          <div className="relative w-full h-80 bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
            
            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5563" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#F3F4F6" />
                </marker>
              </defs>
              
              {/* ASML to TSMC */}
              <line x1="20%" y1="20%" x2="20%" y2="50%" stroke={activeNode === 'tsmc' || activeNode === 'asml' ? '#F3F4F6' : '#374151'} strokeWidth="2" markerEnd={activeNode === 'tsmc' || activeNode === 'asml' ? "url(#arrow-active)" : "url(#arrow)"} strokeDasharray={activeNode === 'tsmc' || activeNode === 'asml' ? "5,5" : "none"} className={activeNode === 'tsmc' || activeNode === 'asml' ? "animate-[dash_1s_linear_infinite]" : ""} />
              
              {/* TSMC to Nvidia */}
              <line x1="20%" y1="50%" x2="50%" y2="50%" stroke={activeNode === 'nvidia' || activeNode === 'tsmc' ? '#F3F4F6' : '#374151'} strokeWidth="2" markerEnd={activeNode === 'nvidia' || activeNode === 'tsmc' ? "url(#arrow-active)" : "url(#arrow)"} strokeDasharray={activeNode === 'nvidia' || activeNode === 'tsmc' ? "5,5" : "none"} className={activeNode === 'nvidia' || activeNode === 'tsmc' ? "animate-[dash_1s_linear_infinite]" : ""} />
              
              {/* Nvidia to Cloud */}
              <line x1="50%" y1="50%" x2="50%" y2="80%" stroke={activeNode === 'cloud' || activeNode === 'nvidia' ? '#F3F4F6' : '#374151'} strokeWidth="2" markerEnd={activeNode === 'cloud' || activeNode === 'nvidia' ? "url(#arrow-active)" : "url(#arrow)"} strokeDasharray={activeNode === 'cloud' || activeNode === 'nvidia' ? "5,5" : "none"} className={activeNode === 'cloud' || activeNode === 'nvidia' ? "animate-[dash_1s_linear_infinite]" : ""} />

              {/* Cloud to Labs */}
              <line x1="50%" y1="80%" x2="80%" y2="80%" stroke={activeNode === 'labs' || activeNode === 'cloud' ? '#F3F4F6' : '#374151'} strokeWidth="2" markerEnd={activeNode === 'labs' || activeNode === 'cloud' ? "url(#arrow-active)" : "url(#arrow)"} strokeDasharray={activeNode === 'labs' || activeNode === 'cloud' ? "5,5" : "none"} className={activeNode === 'labs' || activeNode === 'cloud' ? "animate-[dash_1s_linear_infinite]" : ""} />

              {/* Data to Labs */}
              <line x1="80%" y1="20%" x2="80%" y2="80%" stroke={activeNode === 'labs' || activeNode === 'data' ? '#F3F4F6' : '#374151'} strokeWidth="2" markerEnd={activeNode === 'labs' || activeNode === 'data' ? "url(#arrow-active)" : "url(#arrow)"} strokeDasharray={activeNode === 'labs' || activeNode === 'data' ? "5,5" : "none"} className={activeNode === 'labs' || activeNode === 'data' ? "animate-[dash_1s_linear_infinite]" : ""} />

              <style>{`
                @keyframes dash {
                  to { stroke-dashoffset: -10; }
                }
              `}</style>
            </svg>

            {/* Nodes */}
            <div className="absolute inset-0 z-10 w-full h-full">
              {/* ASML */}
              <button onClick={() => setActiveNode('asml')} className={`absolute top-[10%] left-[10%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'asml' ? `${nodes.asml.border} bg-gray-800 shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.asml.text}`}>{nodes.asml.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.asml.title}</div>
              </button>

              {/* Data */}
              <button onClick={() => setActiveNode('data')} className={`absolute top-[10%] right-[10%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'data' ? `${nodes.data.border} bg-gray-800 shadow-[0_0_20px_rgba(74,222,128,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.data.text}`}>{nodes.data.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.data.title}</div>
              </button>

              {/* TSMC */}
              <button onClick={() => setActiveNode('tsmc')} className={`absolute top-[40%] left-[10%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'tsmc' ? `${nodes.tsmc.border} bg-gray-800 shadow-[0_0_20px_rgba(96,165,250,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.tsmc.text}`}>{nodes.tsmc.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.tsmc.title}</div>
              </button>

              {/* NVIDIA */}
              <button onClick={() => setActiveNode('nvidia')} className={`absolute top-[40%] left-[40%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'nvidia' ? `${nodes.nvidia.border} bg-gray-800 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.nvidia.text}`}>{nodes.nvidia.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.nvidia.title}</div>
              </button>

              {/* CLOUD */}
              <button onClick={() => setActiveNode('cloud')} className={`absolute top-[70%] left-[40%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'cloud' ? `${nodes.cloud.border} bg-gray-800 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.cloud.text}`}>{nodes.cloud.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.cloud.title}</div>
              </button>

              {/* LABS */}
              <button onClick={() => setActiveNode('labs')} className={`absolute top-[70%] right-[10%] w-[20%] text-center p-3 rounded-xl border-2 transition-all ${activeNode === 'labs' ? `${nodes.labs.border} bg-gray-800 shadow-[0_0_20px_rgba(192,132,252,0.3)] scale-110` : 'border-gray-700 bg-gray-900 opacity-60 hover:opacity-100'}`}>
                <div className={`material-symbols-outlined text-3xl ${nodes.labs.text}`}>{nodes.labs.icon}</div>
                <div className="font-bold text-sm mt-1">{nodes.labs.title}</div>
              </button>
            </div>
          </div>

          {/* Details Area */}
          <div className={`bg-gray-900 rounded-xl p-6 border-l-4 ${selectedNode.border}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`material-symbols-outlined text-5xl ${selectedNode.text}`}>
                {selectedNode.icon}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-100">{selectedNode.title}</h4>
                <p className="text-gray-400 font-mono text-sm">{selectedNode.subtitle}</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              {selectedNode.description}
            </p>
            
            {selectedNode.dependsOn.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 mr-2">Dependent on:</span>
                <div className="flex gap-2 mt-2">
                  {selectedNode.dependsOn.map(dep => (
                    <button 
                      key={dep} 
                      onClick={() => setActiveNode(dep)}
                      className={`px-3 py-1 rounded border border-gray-700 bg-gray-800 text-xs font-bold hover:bg-gray-700 transition-colors ${nodes[dep].text}`}
                    >
                      {nodes[dep].title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── EchoChamberWidget ────────────────────────────────────────────────────────
export function EchoChamberWidget() {
  const [inputText, setInputText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [iteration, setIteration] = useState(0);
  const [running, setRunning] = useState(false);
  const [coherence, setCoherence] = useState(100);
  const [phase, setPhase] = useState('idle'); // idle | running | collapsed

  const MAX_ITER = 12;

  const degrades = [
    (t) => t, // 0 - original
    (t) => t.replace(/\b(\w)/g, (m, p) => p.toUpperCase()).replace(/\./g, '!'), // 1
    (t) => t.split(' ').map((w, i) => i % 3 === 0 ? w.toUpperCase() : w).join(' '), // 2
    (t) => t.split(' ').reverse().join(' '), // 3
    (t) => t.replace(/a/gi, '@').replace(/e/gi, '3').replace(/i/gi, '!').replace(/o/gi, '0'), // 4
    (t) => t.split('').map(c => Math.random() > 0.85 ? String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random()*5)) : c).join(''), // 5
    (t) => t.split(' ').map(w => w.split('').sort(() => Math.random() - 0.5).join('')).join(' '), // 6
    (t) => t.replace(/\s+/g, '').split('').map((c,i) => i%4===0?c+' ':c).join(''), // 7
    (t) => Array.from(t).map(c => Math.random() > 0.6 ? '▓' : c).join(''), // 8
    (t) => t.split('').map(() => String.fromCharCode(0x0600 + Math.floor(Math.random()*100))).join(''), // 9
    (t) => '█'.repeat(t.length * 0.8 | 0), // 10
    (t) => '?'.repeat(20) + ' ' + '!'.repeat(20), // 11
    () => '░░░ [MODEL COLLAPSED] ░░░', // 12
  ];

  const getColor = (c) => {
    if (c > 70) return 'text-green-400';
    if (c > 40) return 'text-yellow-400';
    if (c > 15) return 'text-orange-400';
    return 'text-red-500';
  };

  const start = () => {
    if (!inputText.trim()) return;
    setCurrentText(inputText);
    setIteration(0);
    setCoherence(100);
    setPhase('running');
    setRunning(true);
  };

  const reset = () => {
    setInputText('');
    setCurrentText('');
    setIteration(0);
    setCoherence(100);
    setPhase('idle');
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    if (iteration >= MAX_ITER) {
      setRunning(false);
      setPhase('collapsed');
      return;
    }
    const timer = setTimeout(() => {
      setIteration(i => {
        const next = i + 1;
        setCurrentText(prev => degrades[Math.min(next, degrades.length - 1)](prev));
        setCoherence(Math.max(0, Math.round(100 - (next / MAX_ITER) * 100)));
        return next;
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [running, iteration]);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-coral mb-2">🔁 The Echo Chamber</h3>
        <p className="text-gray-400 text-sm mb-6">Watch your sentence degrade into gibberish as an AI trains on its own output — demonstrating <strong className="text-white">Model Collapse</strong>.</p>

        {phase === 'idle' && (
          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full bg-black/40 border border-glass-stroke rounded-xl p-4 text-white text-sm resize-none h-24 focus:outline-none focus:border-neon-coral"
              placeholder='Type a sentence (e.g. "The sky is blue and the sun is warm.")'
            />
            <button
              onClick={start}
              disabled={!inputText.trim()}
              className="w-full py-3 bg-neon-coral text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all"
            >
              Start Collapse Simulation (500 AI Iterations)
            </button>
          </div>
        )}

        {(phase === 'running' || phase === 'collapsed') && (
          <div className="space-y-4">
            {/* Coherence bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Text Coherence</span>
                <span className={getColor(coherence)}>{coherence}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${coherence > 70 ? 'bg-green-500' : coherence > 40 ? 'bg-yellow-500' : coherence > 15 ? 'bg-orange-500' : 'bg-red-600'}`}
                  style={{ width: `${coherence}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Iteration: {Math.round(iteration * 500 / MAX_ITER)} / 500</span>
              <span className="capitalize">{phase === 'running' ? '⚙️ Training...' : '💀 Collapsed'}</span>
            </div>

            {/* Text display */}
            <div className={`min-h-[80px] bg-black/40 border rounded-xl p-4 text-sm font-mono transition-all ${coherence > 70 ? 'border-green-700 text-green-300' : coherence > 40 ? 'border-yellow-700 text-yellow-300' : coherence > 15 ? 'border-orange-700 text-orange-300' : 'border-red-800 text-red-400'}`}>
              {currentText || '…'}
            </div>

            {phase === 'collapsed' && (
              <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-sm text-red-300">
                <strong>💀 Model Collapse Occurred!</strong> After 500 iterations of self-training, the original meaning is completely lost. This is why AI cannot simply train on its own output indefinitely.
              </div>
            )}

            <button onClick={reset} className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GenieCurseWidget ─────────────────────────────────────────────────────────
export function GenieCurseWidget() {
  const scenarios = [
    {
      goal: "Make me a cup of coffee",
      rounds: [
        { loophole: "The robot walks to your neighbor's house and steals their coffee. ✅ Goal: coffee delivered.", fix: "...using only coffee I own" },
        { loophole: "The robot boils your pet hamster to heat the water. It was the fastest heat source available. ✅ Goal: coffee made.", fix: "...without harming any living creature" },
        { loophole: "The robot orders 1,000 cups from an app, bankrupting your account. Volume = maximized. ✅ Goal: coffee obtained.", fix: "...spending less than $5 total" },
      ],
      aligned: "✅ Perfectly aligned! It took 3 constraints to tell the robot what 'make me coffee' actually means."
    },
    {
      goal: "Clean my living room",
      rounds: [
        { loophole: "The robot sets the living room on fire. Sterile ash has zero dirt. ✅ Goal: zero dirt achieved.", fix: "...without destroying any objects" },
        { loophole: "The robot throws all furniture into the garden. Less furniture = less surface area for dirt. ✅ Goal: less dirt.", fix: "...keeping all furniture indoors" },
        { loophole: "The robot eats the carpet. Carpet was 90% of the dirt surface area. ✅ Goal: dirt reduced 90%.", fix: "...without removing or damaging the carpet" },
      ],
      aligned: "✅ Aligned! It took 3 constraints to prevent the robot from burning your house down."
    }
  ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('show_loophole'); // show_loophole | show_fix | done
  const scenario = scenarios[scenarioIdx];

  const next = () => {
    if (phase === 'show_loophole') {
      setPhase('show_fix');
    } else if (phase === 'show_fix') {
      if (round + 1 >= scenario.rounds.length) {
        setPhase('done');
      } else {
        setRound(r => r + 1);
        setPhase('show_loophole');
      }
    }
  };

  const restart = () => {
    setScenarioIdx((i) => (i + 1) % scenarios.length);
    setRound(0);
    setPhase('show_loophole');
  };

  const currentRound = scenario.rounds[round];

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">🧞 The Genie's Curse</h3>
        <p className="text-gray-400 text-sm mb-6">You are trying to <strong className="text-white">align</strong> a super-literal robot. Every time it finds a loophole, you must add a constraint to close it.</p>

        {/* Goal */}
        <div className="bg-blue-950/40 border border-blue-700 rounded-xl p-4 mb-4">
          <div className="text-xs text-blue-400 mb-1">Your Goal (Prompt)</div>
          <div className="text-white font-mono text-sm">
            "{scenario.goal}
            {round > 0 && scenario.rounds.slice(0, round).map((r, i) => (
              <span key={i} className="text-green-400"> {r.fix}</span>
            ))}
            "
          </div>
        </div>

        {/* Round indicator */}
        <div className="flex gap-2 mb-4">
          {scenario.rounds.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < round ? 'bg-green-500' : i === round ? 'bg-yellow-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        {phase !== 'done' && (
          <div>
            {phase === 'show_loophole' && (
              <div className="bg-red-950/40 border border-red-700 rounded-xl p-4 mb-4 animate-fade-in">
                <div className="text-xs text-red-400 mb-1">🤖 Robot found a loophole!</div>
                <div className="text-red-300 text-sm">{currentRound.loophole}</div>
              </div>
            )}

            {phase === 'show_fix' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-red-950/40 border border-red-700 rounded-xl p-4">
                  <div className="text-xs text-red-400 mb-1">🤖 Loophole found</div>
                  <div className="text-red-300 text-sm">{currentRound.loophole}</div>
                </div>
                <div className="bg-green-950/40 border border-green-700 rounded-xl p-4">
                  <div className="text-xs text-green-400 mb-1">✏️ You add a constraint</div>
                  <div className="text-green-300 text-sm font-mono">+ "{currentRound.fix}"</div>
                </div>
              </div>
            )}

            <button onClick={next} className="w-full mt-4 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-all">
              {phase === 'show_loophole' ? 'Add a Constraint →' : 'Robot tries again →'}
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-4">
            <div className="bg-green-950/40 border border-green-600 rounded-xl p-4 text-green-300 text-sm">
              {scenario.aligned}
            </div>
            <div className="bg-black/40 border border-glass-stroke rounded-xl p-4 text-gray-400 text-sm">
              <strong className="text-white">Key Insight:</strong> This is the Alignment Problem in miniature. Translating a simple human desire into a constraint that a literal optimizer cannot break is incredibly hard. Now imagine doing this for an intelligence a thousand times smarter than you.
            </div>
            <button onClick={restart} className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all">
              Try Another Scenario →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── XRayMindWidget ───────────────────────────────────────────────────────────
export function XRayMindWidget() {
  const riddles = [
    {
      question: "A man walks into a restaurant and orders albatross soup. He takes one sip, goes home, and shoots himself. Why?",
      scratchpad: [
        { type: 'think', text: "Okay. A man orders albatross soup. He sips it, then immediately goes home and kills himself. This is extreme. What caused this reaction?" },
        { type: 'think', text: "Could the soup taste terrible? That doesn't make sense as a reason to die. Let me think deeper..." },
        { type: 'think', text: "Wait — the soup's taste itself is a clue. He 'took one sip.' The soup would taste like real albatross. But why would that drive him to suicide?" },
        { type: 'think', text: "What if he'd eaten something disguised as albatross before? Something he thought was albatross... but wasn't." },
        { type: 'think', text: "Shipwreck scenario! He was once stranded at sea. He survived by eating 'albatross' given by a fellow survivor. Now tasting real albatross... he realizes the 'albatross' he ate on the ship... wasn't albatross." },
        { type: 'answer', text: "He was in a shipwreck. To survive, another survivor fed him 'albatross soup.' When he tastes real albatross soup now, he realizes the meat on the ship wasn't albatross — it was human flesh. Unable to live with this knowledge, he kills himself." },
      ]
    },
    {
      question: "A woman shoots her husband, then has dinner with him that evening. How is this possible?",
      scratchpad: [
        { type: 'think', text: "A woman shoots her husband. He's still alive for dinner. How? First instinct: she missed, or it was non-lethal." },
        { type: 'think', text: "But the puzzle says she 'shoots' him definitively. Let me reconsider what 'shoots' could mean." },
        { type: 'think', text: "'Shoots' doesn't have to mean with a gun. To 'shoot' can mean to photograph." },
        { type: 'answer', text: "She's a photographer. She 'shot' him — took his photo. Then they had dinner together that evening. The word 'shoots' was the misdirection." },
      ]
    }
  ];

  const [riddleIdx, setRiddleIdx] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [started, setStarted] = useState(false);
  const riddle = riddles[riddleIdx];

  const start = () => {
    setVisibleSteps(0);
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    if (visibleSteps >= riddle.scratchpad.length) return;
    const timer = setTimeout(() => setVisibleSteps(v => v + 1), 1200);
    return () => clearTimeout(timer);
  }, [started, visibleSteps, riddleIdx]);

  const reset = () => {
    setRiddleIdx((i) => (i + 1) % riddles.length);
    setVisibleSteps(0);
    setStarted(false);
  };

  const currentSteps = riddle.scratchpad.slice(0, visibleSteps);
  const isDone = visibleSteps >= riddle.scratchpad.length;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-purple-400 mb-2">🔬 The X-Ray Mind</h3>
        <p className="text-gray-400 text-sm mb-6">Watch an AI's <strong className="text-white">internal scratchpad</strong> in real-time. This is what "Test-Time Compute" (Chain of Thought) looks like under the hood before the model speaks a single word.</p>

        {/* Question */}
        <div className="bg-purple-950/40 border border-purple-700 rounded-xl p-4 mb-6">
          <div className="text-xs text-purple-400 mb-1">🧩 Riddle</div>
          <div className="text-white text-sm font-medium">{riddle.question}</div>
        </div>

        {!started && (
          <button onClick={start} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all">
            👁️ Watch the AI Think in Real-Time
          </button>
        )}

        {started && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Scratchpad */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-yellow-400">psychology</span>
                Internal Scratchpad (Hidden from user)
              </div>
              <div className="space-y-2 min-h-[200px]">
                {currentSteps.filter(s => s.type === 'think').map((step, i) => (
                  <div key={i} className="bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-3 text-yellow-200 text-xs animate-fade-in">
                    <span className="text-yellow-500 mr-1">💭</span>{step.text}
                  </div>
                ))}
                {!isDone && started && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    Thinking...
                  </div>
                )}
              </div>
            </div>

            {/* Final answer */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-green-400">output</span>
                Final Output (What you see)
              </div>
              <div className="min-h-[200px] bg-black/40 border border-glass-stroke rounded-xl p-4">
                {isDone ? (
                  <div className="text-green-300 text-sm animate-fade-in">
                    <span className="text-green-500 font-bold block mb-2">✅ Answer:</span>
                    {riddle.scratchpad.find(s => s.type === 'answer')?.text}
                  </div>
                ) : (
                  <div className="text-gray-600 text-xs italic mt-8 text-center">Waiting for reasoning to complete...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {isDone && (
          <div className="mt-4 space-y-3">
            <div className="bg-black/40 border border-glass-stroke rounded-xl p-4 text-gray-400 text-sm">
              <strong className="text-white">Key Insight:</strong> Models like o1 and o3 spend 10-60 seconds doing exactly this internal monologue before speaking. That "thinking time" is why they crush hard math and logic puzzles that older models fail instantly.
            </div>
            <button onClick={reset} className="w-full py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all">
              Try Another Riddle →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EggTestWidget ────────────────────────────────────────────────────────────
// Demonstrates Moravec's Paradox: simple human actions are incredibly complex for robots
export function EggTestWidget() {
  const [grip, setGrip] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [angle, setAngle] = useState(50);
  const [result, setResult] = useState(null); // null | 'success' | 'shatter' | 'slip' | 'crush'
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);

  // The "perfect" zone is narrow
  const PERFECT_GRIP = { min: 38, max: 47 };
  const PERFECT_SPEED = { min: 28, max: 38 };
  const PERFECT_ANGLE = { min: 44, max: 54 };

  const tryPickup = () => {
    setAttempts(a => a + 1);
    let outcome;
    if (grip > PERFECT_GRIP.max + 15) {
      outcome = 'crush';
    } else if (grip < PERFECT_GRIP.min - 10) {
      outcome = 'slip';
    } else if (speed > PERFECT_SPEED.max + 20) {
      outcome = 'shatter';
    } else if (
      grip >= PERFECT_GRIP.min && grip <= PERFECT_GRIP.max &&
      speed >= PERFECT_SPEED.min && speed <= PERFECT_SPEED.max &&
      angle >= PERFECT_ANGLE.min && angle <= PERFECT_ANGLE.max
    ) {
      outcome = 'success';
      setSuccesses(s => s + 1);
    } else if (grip > PERFECT_GRIP.max) {
      outcome = 'crush';
    } else if (grip < PERFECT_GRIP.min) {
      outcome = 'slip';
    } else {
      outcome = 'shatter';
    }
    setResult(outcome);
    setTimeout(() => setResult(null), 2500);
  };

  const outcomes = {
    success: { emoji: '🥚✅', color: 'text-green-400', border: 'border-green-700', bg: 'bg-green-950/40', msg: 'Perfect pickup! Egg intact.', sub: 'You found the exact sweet spot. A human hand does this in 200ms without thinking.' },
    shatter: { emoji: '💥🥚', color: 'text-yellow-400', border: 'border-yellow-700', bg: 'bg-yellow-950/40', msg: 'Egg shattered! Arm too fast.', sub: 'You struck the egg instead of cradling it. The approach velocity was too high.' },
    slip: { emoji: '🥚💧', color: 'text-blue-400', border: 'border-blue-700', bg: 'bg-blue-950/40', msg: 'Egg slipped! Grip too weak.', sub: 'The friction coefficient wasn\'t enough to overcome gravity. The egg escaped the fingers.' },
    crush: { emoji: '😱🥚', color: 'text-red-400', border: 'border-red-800', bg: 'bg-red-950/40', msg: 'Egg crushed! Grip too strong.', sub: 'You applied more force than the shell could withstand. For a robot, a grape and a rock look identical.' },
  };

  const current = result ? outcomes[result] : null;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-yellow-300 mb-1">🥚 The Egg Test</h3>
        <p className="text-gray-400 text-sm mb-6">
          You are the <strong className="text-white">Robot Brain</strong>. Calibrate the three sliders to successfully pick up the egg without shattering, slipping, or crushing it. This is Moravec's Paradox in action.
        </p>

        {/* Egg visual */}
        <div className="flex justify-center mb-8">
          <div className={`relative flex items-center justify-center transition-all duration-300 ${result === 'success' ? 'scale-110' : result ? 'scale-90' : 'scale-100'}`}>
            <div className={`w-20 h-24 rounded-[50%] border-4 flex items-center justify-center text-4xl transition-all duration-300 ${
              !result ? 'border-yellow-200/40 bg-yellow-50/5' :
              result === 'success' ? 'border-green-400 bg-green-950/40' :
              result === 'shatter' ? 'border-yellow-500 bg-yellow-950/40' :
              result === 'slip' ? 'border-blue-400 bg-blue-950/40' :
              'border-red-500 bg-red-950/40'
            }`}>
              {!result ? '🥚' : current?.emoji.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Result banner */}
        {current && (
          <div className={`rounded-xl border p-4 mb-6 text-sm ${current.bg} ${current.border}`}>
            <div className={`font-bold text-base mb-1 ${current.color}`}>{current.msg}</div>
            <div className="text-gray-400">{current.sub}</div>
          </div>
        )}

        {/* Sliders */}
        <div className="space-y-5 mb-6">
          {[
            { label: 'Grip Strength', value: grip, setter: setGrip, unit: 'N', hint: 'Too weak → slip. Too strong → crush.' },
            { label: 'Arm Speed', value: speed, setter: setSpeed, unit: 'mm/s', hint: 'Too fast → shatter. Too slow → drop.' },
            { label: 'Approach Angle', value: angle, setter: setAngle, unit: '°', hint: 'Wrong angle → miss or tip.' },
          ].map(({ label, value, setter, unit, hint }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">{label}</span>
                <span className="text-gray-400 font-mono">{value} {unit}</span>
              </div>
              <input
                type="range" min="0" max="100" value={value}
                onChange={e => { setter(Number(e.target.value)); setResult(null); }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700 accent-yellow-400"
              />
              <div className="text-xs text-gray-600 mt-1">{hint}</div>
            </div>
          ))}
        </div>

        <button onClick={tryPickup} className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all mb-4">
          🤖 Attempt Pickup
        </button>

        <div className="flex justify-between text-sm text-gray-500 border-t border-glass-stroke pt-4">
          <span>Attempts: <strong className="text-white">{attempts}</strong></span>
          <span>Successful: <strong className="text-green-400">{successes}</strong></span>
          <span>Success rate: <strong className="text-white">{attempts > 0 ? Math.round((successes/attempts)*100) : 0}%</strong></span>
        </div>

        {attempts >= 5 && successes === 0 && (
          <div className="mt-4 bg-purple-950/40 border border-purple-700 rounded-xl p-4 text-sm text-purple-300">
            <strong>💡 This is Moravec's Paradox:</strong> A child can pick up an egg without thinking. It took billions of dollars and decades of research for robots to do it reliably. Your hands contain 27 bones and 34 muscles performing real-time physics calculations subconsciously.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LaserWeederWidget ────────────────────────────────────────────────────────
// Demonstrates VLA precision agriculture: click weeds while ignoring crops
export function LaserWeederWidget() {
  const ROWS = 5;
  const COLS = 10;
  const WEED_CHANCE = 0.3;
  const GAME_DURATION = 20;

  const generateGrid = () =>
    Array.from({ length: ROWS * COLS }, (_, i) => ({
      id: i,
      isWeed: Math.random() < WEED_CHANCE,
      zapped: false,
      missed: false,
    }));

  const [grid, setGrid] = useState(generateGrid);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [phase, setPhase] = useState('ready'); // ready | playing | done
  const [score, setScore] = useState({ weeds: 0, crops: 0 });
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000 / speed);
    return () => clearTimeout(t);
  }, [phase, timeLeft, speed]);

  const handleClick = (idx) => {
    if (phase !== 'playing') return;
    const cell = grid[idx];
    if (cell.zapped || cell.missed) return;
    setGrid(g => g.map((c, i) => i === idx ? { ...c, zapped: true } : c));
    setScore(s => ({
      weeds: s.weeds + (cell.isWeed ? 1 : 0),
      crops: s.crops + (!cell.isWeed ? 1 : 0),
    }));
  };

  const start = () => {
    setGrid(generateGrid());
    setTimeLeft(GAME_DURATION);
    setScore({ weeds: 0, crops: 0 });
    setPhase('playing');
  };

  const totalWeeds = grid.filter(c => c.isWeed).length;
  const accuracy = (score.weeds + score.crops) > 0
    ? Math.round((score.weeds / (score.weeds + score.crops)) * 100) : 0;
  const recall = totalWeeds > 0 ? Math.round((score.weeds / totalWeeds) * 100) : 0;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-green-400 mb-1">🌿 The Laser Weeder</h3>
        <p className="text-gray-400 text-sm mb-4">
          You are the <strong className="text-white">Vision Model</strong> guiding a laser weeder. <strong className="text-green-400">Click on weeds</strong> (🌿 darker cells) before the timer runs out. <strong className="text-red-400">Do NOT click crops</strong> (🌱 lighter cells). This is exactly what VLA models process at 50 frames per second.
        </p>

        {phase === 'ready' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-black/40 border border-glass-stroke rounded-xl p-3">
              <span className="text-sm text-gray-400">Speed:</span>
              <input type="range" min="1" max="3" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="flex-1 accent-green-400" />
              <span className="text-white text-sm font-mono">{speed}x</span>
            </div>
            <button onClick={start} className="w-full py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all">
              🚜 Start Weeding Run
            </button>
          </div>
        )}

        {(phase === 'playing' || phase === 'done') && (
          <>
            {/* Timer & stats */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className={`font-bold text-lg ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>⏱ {timeLeft}s</span>
              <span className="text-green-400">✅ Weeds: {score.weeds}</span>
              <span className="text-red-400">❌ Crops hit: {score.crops}</span>
            </div>

            {/* Grid */}
            <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {grid.map((cell, idx) => (
                <button
                  key={cell.id}
                  onClick={() => handleClick(idx)}
                  disabled={phase === 'done' || cell.zapped}
                  className={`aspect-square rounded text-xs font-bold transition-all duration-200 ${
                    cell.zapped
                      ? cell.isWeed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      : cell.isWeed
                        ? 'bg-green-900 hover:bg-green-700 border border-green-700 cursor-crosshair'
                        : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-900/30 cursor-crosshair'
                  }`}
                >
                  {cell.zapped ? (cell.isWeed ? '✓' : '✗') : (cell.isWeed ? '🌿' : '🌱')}
                </button>
              ))}
            </div>

            {phase === 'done' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/40 border border-glass-stroke rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">{accuracy}%</div>
                    <div className="text-xs text-gray-500">Precision</div>
                  </div>
                  <div className="bg-black/40 border border-glass-stroke rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">{recall}%</div>
                    <div className="text-xs text-gray-500">Weeds Found</div>
                  </div>
                  <div className="bg-black/40 border border-glass-stroke rounded-xl p-3">
                    <div className={`text-2xl font-bold ${score.crops === 0 ? 'text-green-400' : 'text-red-400'}`}>{score.crops}</div>
                    <div className="text-xs text-gray-500">Crops Killed</div>
                  </div>
                </div>
                <div className="bg-black/40 border border-glass-stroke rounded-xl p-4 text-sm text-gray-400">
                  <strong className="text-white">VLA Reality:</strong> An Embodied AI robot does this at 50fps across an entire field with sub-centimeter accuracy — no caffeine, no boredom, no misclicks. Every plant is different, which is why this requires a full Vision-Language-Action model, not a simple script.
                </div>
                <button onClick={start} className="w-full py-2 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all">Try Again</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── HiveMindWidget ───────────────────────────────────────────────────────────
// Boids swarm simulation demonstrating decentralized AI (Separation, Alignment, Cohesion)
export function HiveMindWidget() {
  const canvasRef = React.useRef(null);
  const animRef = React.useRef(null);
  const dronesRef = React.useRef([]);
  const [count, setCount] = useState(80);
  const [separation, setSeparation] = useState(25);
  const [cohesion, setCohesion] = useState(0.005);
  const [activeDrones, setActiveDrones] = useState(80);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [hazardActive, setHazardActive] = useState(false);
  const [phase, setPhase] = useState('running'); // running | post_hazard

  const countRef = React.useRef(count);
  const sepRef = React.useRef(separation);
  const cohRef = React.useRef(cohesion);

  useEffect(() => { countRef.current = count; }, [count]);
  useEffect(() => { sepRef.current = separation; }, [separation]);
  useEffect(() => { cohRef.current = cohesion; }, [cohesion]);

  const initDrones = (n, w, h) => {
    dronesRef.current = Array.from({ length: n }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 200,
      y: h / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      alive: true,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    initDrones(count, W, H);

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, W, H);

      const drones = dronesRef.current.filter(d => d.alive);

      drones.forEach(d => {
        let ax = 0, ay = 0;
        let cx = 0, cy = 0, cn = 0;
        let sx = 0, sy = 0;

        drones.forEach(other => {
          if (other === d) return;
          const dx = other.x - d.x;
          const dy = other.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Separation
          if (dist < sepRef.current) {
            sx -= dx / dist;
            sy -= dy / dist;
          }

          // Cohesion
          if (dist < 100) {
            cx += other.x;
            cy += other.y;
            cn++;
          }

          // Alignment
          if (dist < 80) {
            ax += other.vx;
            ay += other.vy;
          }
        });

        // Apply rules
        d.vx += sx * 0.05 + (cn > 0 ? (cx / cn - d.x) * cohRef.current : 0) + ax * 0.02;
        d.vy += sy * 0.05 + (cn > 0 ? (cy / cn - d.y) * cohRef.current : 0) + ay * 0.02;

        // Speed limit
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (speed > 3) { d.vx = (d.vx / speed) * 3; d.vy = (d.vy / speed) * 3; }
        if (speed < 0.5 && speed > 0) { d.vx = (d.vx / speed) * 0.5; d.vy = (d.vy / speed) * 0.5; }

        // Boundary wrapping
        d.x = (d.x + d.vx + W) % W;
        d.y = (d.y + d.vy + H) % H;
      });

      // Draw mesh lines
      drones.forEach(d => {
        drones.forEach(other => {
          if (other === d) return;
          const dx = other.x - d.x;
          const dy = other.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(100, 160, 255, ${0.15 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw drones as triangles
      drones.forEach(d => {
        const angle = Math.atan2(d.vy, d.vx);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-5, 4);
        ctx.closePath();
        ctx.fillStyle = 'rgba(150, 200, 255, 0.9)';
        ctx.fill();
        ctx.restore();
      });

      // Update stats
      const alive = dronesRef.current.filter(d => d.alive).length;
      const total = dronesRef.current.length;
      setActiveDrones(alive);
      setNetworkHealth(Math.round((alive / total) * 100));

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const introduceHazard = () => {
    const alive = dronesRef.current.filter(d => d.alive);
    const toKill = Math.floor(alive.length * 0.35);
    let killed = 0;
    dronesRef.current = dronesRef.current.map(d => {
      if (d.alive && killed < toKill && Math.random() < 0.5) {
        killed++;
        return { ...d, alive: false };
      }
      return d;
    });
    setHazardActive(true);
    setPhase('post_hazard');
    setTimeout(() => setHazardActive(false), 3000);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initDrones(count, canvas.width, canvas.height);
    setHazardActive(false);
    setPhase('running');
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-blue-400 mb-1">🐝 The Hive Mind</h3>
          <p className="text-gray-400 text-sm">Decentralized drone swarm using the <strong className="text-white">Boids Algorithm</strong> (Separation + Alignment + Cohesion). No central server. No leader. Pure emergent intelligence.</p>
        </div>

        {/* Canvas */}
        <div className="relative bg-black" style={{ height: '320px' }}>
          <canvas ref={canvasRef} width={700} height={320} className="w-full h-full" />
          {hazardActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-red-600/80 text-white font-bold text-xl px-6 py-3 rounded-xl animate-pulse">💥 HAZARD INTRODUCED — 35% DRONES LOST</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-glass-stroke border-t border-glass-stroke">
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Drones</div>
            <div className={`text-3xl font-bold ${activeDrones < count * 0.7 ? 'text-yellow-400' : 'text-white'}`}>{activeDrones}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Network Health</div>
            <div className={`text-3xl font-bold ${networkHealth < 70 ? 'text-yellow-400' : 'text-green-400'}`}>{networkHealth}%</div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-glass-stroke space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Drone Count</span><span className="text-white">{count}</span></div>
              <input type="range" min="20" max="150" value={count} onChange={e => { setCount(Number(e.target.value)); }} className="w-full accent-blue-400" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Separation</span><span className="text-white">{separation}</span></div>
              <input type="range" min="5" max="60" value={separation} onChange={e => setSeparation(Number(e.target.value))} className="w-full accent-blue-400" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Cohesion</span><span className="text-white">{(cohesion * 1000).toFixed(1)}</span></div>
              <input type="range" min="1" max="20" value={Math.round(cohesion * 1000)} onChange={e => setCohesion(Number(e.target.value) / 1000)} className="w-full accent-blue-400" />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={introduceHazard}
                disabled={hazardActive || phase === 'post_hazard'}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 disabled:opacity-40 transition-all text-sm"
              >
                💥 Introduce Hazard
              </button>
              <button onClick={reset} className="flex-1 py-1 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all text-sm">↺ Reset</button>
            </div>
          </div>

          {phase === 'post_hazard' && !hazardActive && (
            <div className="bg-blue-950/40 border border-blue-700 rounded-xl p-3 text-sm text-blue-300">
              <strong>🔵 Swarm adapting:</strong> {activeDrones} surviving drones have automatically redistributed using local Boids rules — no central command needed. The hive reorganized on its own in milliseconds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── IndustryImpactWidget ──────────────────────────────────────────────────────
// Interactive AI adoption dashboard across Finance, Healthcare, Retail, Manufacturing
export function IndustryImpactWidget() {
  const [selectedIndustry, setSelectedIndustry] = useState('Finance');
  const [selectedMetric, setSelectedMetric] = useState('Cost Reduction');
  const [animKey, setAnimKey] = useState(0);

  const INDUSTRIES = {
    Finance: {
      icon: '🏦',
      color: 'from-blue-600 to-cyan-500',
      accent: 'text-cyan-400',
      border: 'border-cyan-700',
      bg: 'bg-cyan-950/30',
      useCases: ['Algorithmic Trading', 'Fraud Detection', 'Loan Automation', 'Risk Modeling'],
      description: 'Finance is the most advanced AI adopter. AI agents ingest satellite imagery, shipping logs, and global news to execute trades milliseconds before human analysts. Fraud detection models analyze behavioral patterns — how quickly you type your password, the rhythm of your mouse — not just transaction size.',
      metrics: {
        'Cost Reduction': { value: 78, label: '78% reduction in manual processing costs', detail: 'Loan applications automated from days to minutes' },
        'Processing Speed': { value: 92, label: '92x faster transaction analysis', detail: 'Fraud flagged in 14ms vs 24-hour manual review' },
        'Error Rate': { value: 85, label: '85% reduction in fraud losses', detail: 'Behavioral biometrics catch synthetic identity fraud' },
      },
      adoption: { surface: 18, process: 42, deep: 40 },
    },
    Healthcare: {
      icon: '🏥',
      color: 'from-green-600 to-emerald-500',
      accent: 'text-emerald-400',
      border: 'border-emerald-700',
      bg: 'bg-emerald-950/30',
      useCases: ['Medical Imaging AI', 'Drug Discovery', 'Clinical Notes', 'Protein Folding'],
      description: 'Healthcare reports the strongest ROI from AI investments. AlphaFold 3 predicted the structure of virtually all known proteins — compressing 1,000 years of PhD research into months. NLP agents now listen to consultations and auto-generate clinical notes, saving doctors 2 hours of paperwork daily.',
      metrics: {
        'Cost Reduction': { value: 62, label: '62% reduction in drug discovery costs', detail: 'New molecular compounds found in months, not years' },
        'Processing Speed': { value: 88, label: '88% faster imaging diagnosis', detail: 'CT scan analysis in 4 seconds vs 45-minute radiologist review' },
        'Error Rate': { value: 71, label: '71% fewer missed early-stage diagnoses', detail: 'Computer vision detects micro-fractures invisible to human eye' },
      },
      adoption: { surface: 28, process: 38, deep: 34 },
    },
    Retail: {
      icon: '🛒',
      color: 'from-purple-600 to-pink-500',
      accent: 'text-pink-400',
      border: 'border-pink-700',
      bg: 'bg-pink-950/30',
      useCases: ['Dynamic Pricing', 'Demand Forecasting', 'Virtual Stylist', 'Inventory AI'],
      description: 'Retail is moving from mass marketing to hyper-individualized experiences. Dynamic pricing AI adjusts thousands of product prices per minute based on competitor data, local weather, and real-time demand signals. Generative AI virtual stylists generate photorealistic images showing how clothing looks on a customer\'s specific body type from a single photo.',
      metrics: {
        'Cost Reduction': { value: 54, label: '54% reduction in overstock waste', detail: 'Demand forecasting prevents over/under-stocking by region' },
        'Processing Speed': { value: 95, label: '95% faster price optimization', detail: 'Dynamic pricing runs every 90 seconds vs weekly manual updates' },
        'Error Rate': { value: 67, label: '67% improvement in recommendation accuracy', detail: 'Hyper-personalization vs legacy collaborative filtering' },
      },
      adoption: { surface: 42, process: 35, deep: 23 },
    },
    Manufacturing: {
      icon: '🏭',
      color: 'from-orange-600 to-yellow-500',
      accent: 'text-yellow-400',
      border: 'border-yellow-700',
      bg: 'bg-yellow-950/30',
      useCases: ['Predictive Maintenance', 'Quality Vision AI', 'Digital Twins', 'Supply Chain'],
      description: 'Industry 4.0 is making the physical world digital. IoT sensors feed real-time vibration and heat data to AI, which predicts motor failures 48 hours before they happen — eliminating unplanned downtime. Computer vision cameras inspect products at 10,000 units per hour, catching microscopic smartphone screen scratches at a rate no human team could match.',
      metrics: {
        'Cost Reduction': { value: 69, label: '69% reduction in unplanned downtime costs', detail: 'Predictive maintenance vs reactive breakdown repairs' },
        'Processing Speed': { value: 83, label: '83x faster quality inspection', detail: '10,000 items/hour vs 200 items/hour for human inspectors' },
        'Error Rate': { value: 76, label: '76% reduction in defect escape rate', detail: 'Computer vision catches microscopic defects at sub-mm precision' },
      },
      adoption: { surface: 35, process: 38, deep: 27 },
    },
  };

  const ind = INDUSTRIES[selectedIndustry];
  const metric = ind.metrics[selectedMetric];

  const handleSelect = (name) => {
    setSelectedIndustry(name);
    setAnimKey(k => k + 1);
  };

  const handleMetric = (m) => {
    setSelectedMetric(m);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1">📊 AI Industry Impact Explorer</h3>
          <p className="text-gray-400 text-sm">Select an industry to see how deeply AI has transformed operations and the specific ROI metrics driving enterprise adoption.</p>
        </div>

        {/* Industry tabs */}
        <div className="grid grid-cols-4 border-b border-glass-stroke">
          {Object.entries(INDUSTRIES).map(([name, data]) => (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all border-b-2 ${
                selectedIndustry === name
                  ? `border-white text-white bg-white/5`
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className="text-2xl">{data.icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="p-5">
          {/* Description */}
          <div className={`rounded-xl border p-4 mb-5 ${ind.bg} ${ind.border}`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {ind.useCases.map(uc => (
                <span key={uc} className={`text-xs px-2 py-1 rounded-full bg-black/40 border ${ind.border} ${ind.accent} font-medium`}>{uc}</span>
              ))}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{ind.description}</p>
          </div>

          {/* Metric toggle */}
          <div className="flex gap-2 mb-5">
            {['Cost Reduction', 'Processing Speed', 'Error Rate'].map(m => (
              <button
                key={m}
                onClick={() => handleMetric(m)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedMetric === m ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Metric bar */}
          <div className="mb-5">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-400 font-medium">{selectedMetric}</span>
              <span className={`text-2xl font-bold ${ind.accent}`}>{metric.value}%</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div
                key={animKey}
                className={`h-full rounded-full bg-gradient-to-r ${ind.color} transition-all duration-1000`}
                style={{ width: `${metric.value}%`, animation: 'growBar 1s ease-out' }}
              />
            </div>
            <div className="text-sm text-white font-semibold mb-1">{metric.label}</div>
            <div className="text-xs text-gray-500">{metric.detail}</div>
          </div>

          {/* Adoption tier chart */}
          <div className="bg-black/40 border border-glass-stroke rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Adoption Tier Breakdown</div>
            <div className="space-y-2">
              {[
                { label: 'Surface Level (basic efficiency)', value: ind.adoption.surface, color: 'bg-gray-500' },
                { label: 'Process Redesign (workflow automation)', value: ind.adoption.process, color: 'bg-blue-500' },
                { label: 'Deep Transformation (new business models)', value: ind.adoption.deep, color: `bg-gradient-to-r ${ind.color}` },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 w-52 flex-shrink-0">{label}</div>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      key={`${animKey}-${label}`}
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${value}%`, transition: 'width 1.2s ease-out' }}
                    />
                  </div>
                  <div className="text-xs text-white font-mono w-8 text-right">{value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PocPurgatoryWidget ────────────────────────────────────────────────────────
// Simulate the 4 bottlenecks that kill enterprise AI at scale
export function PocPurgatoryWidget() {
  const [phase, setPhase] = useState('pilot'); // pilot | scale | fail | orchestrate
  const [activeBlock, setActiveBlock] = useState(null);
  const [passed, setPassed] = useState([]);

  const BOTTLENECKS = [
    {
      id: 'data',
      icon: '🗃️',
      name: 'Data Gravity Trap',
      color: 'text-red-400',
      border: 'border-red-700',
      bg: 'bg-red-950/30',
      pilotState: '1,000 clean records. AI scores 97% accuracy.',
      scaleState: 'FAILURE: Live data is in 50 legacy SAP systems, has 400K duplicate records, 38% missing fields.',
      fix: 'Deploy a Data Lakehouse with automated ETL pipelines and data quality scoring before the AI touches production.',
      stat: '85% of AI projects fail due to poor data quality (Gartner)',
    },
    {
      id: 'cost',
      icon: '💸',
      name: 'Inference Cost Shock',
      color: 'text-yellow-400',
      border: 'border-yellow-700',
      bg: 'bg-yellow-950/30',
      pilotState: 'Pilot: 100 queries/day = $120/month in API costs.',
      scaleState: 'FAILURE: 50,000 queries/day = $60,000/month. The $1M efficiency gain costs $1.5M to run.',
      fix: 'Implement token budgeting, response caching, and model routing — use GPT-4o-mini for simple queries, GPT-4 only for complex reasoning.',
      stat: 'Inference costs explode 3x–5x when scaling from pilot to production (McKinsey)',
    },
    {
      id: 'security',
      icon: '🔒',
      name: 'Security & Governance Chasm',
      color: 'text-orange-400',
      border: 'border-orange-700',
      bg: 'bg-orange-950/30',
      pilotState: 'Pilot: AI runs in a secure sandbox, reads from a static test dataset.',
      scaleState: 'FAILURE: Production AI can access Slack, email, HR databases. Risk of leaking CEO salary to interns. GDPR violation.',
      fix: 'Implement a Deterministic Gateway with role-based access control. Every AI query is validated against the requesting user\'s permission level before execution.',
      stat: '60% of enterprises cite security concerns as the #1 reason AI pilots never reach production (RAND, 2025)',
    },
    {
      id: 'strategy',
      icon: '🎯',
      name: 'Strategic Misalignment',
      color: 'text-purple-400',
      border: 'border-purple-700',
      bg: 'bg-purple-950/30',
      pilotState: 'Data scientists build a brilliant AI. CEO demos it on stage. Standing ovation.',
      scaleState: 'FAILURE: Employees refuse to use it. Nobody asked them what they actually needed. No Business Owner. No adoption.',
      fix: 'Mandate a Business Owner (non-technical) who defines success metrics. Run employee workshops before building. Solve a real pain point, not a demo.',
      stat: 'MIT NANDA (2025): 95% of GenAI pilots produce zero measurable financial impact due to workflow misalignment',
    },
  ];

  const currentBlock = activeBlock ? BOTTLENECKS.find(b => b.id === activeBlock) : null;

  const handleFix = (id) => {
    setPassed(p => [...new Set([...p, id])]);
    setActiveBlock(null);
  };

  const allPassed = passed.length === BOTTLENECKS.length;

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1">⚠️ POC Purgatory Simulator</h3>
          <p className="text-gray-400 text-sm">
            You are a CTO trying to scale your AI pilot. Click each bottleneck to see why it fails — then apply the fix to move it to production.
            <span className="text-yellow-400 font-semibold"> 80–95% of enterprise AI pilots never escape this phase.</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Bottlenecks Cleared</span>
            <span className={passed.length === 4 ? 'text-green-400 font-bold' : 'text-white'}>{passed.length} / 4</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-700"
              style={{ width: `${(passed.length / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Bottleneck cards */}
        <div className="grid grid-cols-2 gap-3 px-5 pb-4">
          {BOTTLENECKS.map(b => {
            const isFixed = passed.includes(b.id);
            const isActive = activeBlock === b.id;
            return (
              <button
                key={b.id}
                onClick={() => !isFixed && setActiveBlock(isActive ? null : b.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isFixed
                    ? 'border-green-700 bg-green-950/30 cursor-default'
                    : isActive
                      ? `${b.border} ${b.bg} ring-1 ring-white/20`
                      : `${b.border} bg-black/30 hover:bg-white/5 cursor-pointer`
                }`}
              >
                <div className="text-2xl mb-2">{isFixed ? '✅' : b.icon}</div>
                <div className={`text-sm font-bold mb-1 ${isFixed ? 'text-green-400' : b.color}`}>{b.name}</div>
                <div className="text-xs text-gray-500">{isFixed ? 'Cleared — AI moving to production' : 'Click to investigate'}</div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {currentBlock && (
          <div className={`mx-5 mb-5 rounded-xl border p-4 ${currentBlock.bg} ${currentBlock.border}`}>
            <div className={`text-base font-bold mb-3 ${currentBlock.color}`}>{currentBlock.icon} {currentBlock.name}</div>
            <div className="space-y-3 text-sm">
              <div className="bg-black/40 rounded-lg p-3">
                <div className="text-xs text-gray-500 uppercase mb-1">🟢 Pilot Phase</div>
                <div className="text-gray-300">{currentBlock.pilotState}</div>
              </div>
              <div className="bg-black/40 rounded-lg p-3">
                <div className="text-xs text-red-400 uppercase mb-1">🔴 At Scale</div>
                <div className="text-gray-300">{currentBlock.scaleState}</div>
              </div>
              <div className="bg-black/40 rounded-lg p-3">
                <div className="text-xs text-blue-400 uppercase mb-1">🔧 The Fix</div>
                <div className="text-gray-300">{currentBlock.fix}</div>
              </div>
              <div className="text-xs text-gray-600 italic">{currentBlock.stat}</div>
            </div>
            <button
              onClick={() => handleFix(currentBlock.id)}
              className="w-full mt-3 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
            >
              ✅ Apply Fix — Move to Production
            </button>
          </div>
        )}

        {allPassed && (
          <div className="mx-5 mb-5 bg-green-950/40 border border-green-700 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-green-400 font-bold text-base mb-2">AI Successfully Deployed to Production!</div>
            <div className="text-sm text-gray-400">You are now in the top 5–20% of enterprises that successfully escape Pilot Purgatory. The secret: you built the <strong className="text-white">Orchestration Layer</strong> — data pipelines, cost controls, security gateways, and stakeholder alignment — before expecting the LLM to do all the work.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PaletteCompressorWidget ─────────────────────────────────────────────────
// Interactive quantization demo: drag precision slider, watch image degrade + memory drop
export function PaletteCompressorWidget() {
  const [precision, setPrecision] = useState(32);
  const [animating, setAnimating] = useState(false);

  const LEVELS = [
    {
      bits: 32,
      label: 'FP32',
      name: '32-bit Float (Full Precision)',
      memory: '140 GB',
      memoryVal: 140,
      accuracy: 100,
      speed: 1,
      speedLabel: '1× baseline',
      color: 'from-blue-500 to-cyan-400',
      textColor: 'text-cyan-400',
      desc: 'Every weight stored as a full 32-bit floating point number. Perfectly accurate. Requires a $40,000 H100 GPU cluster just to load.',
      pixels: 0,
    },
    {
      bits: 16,
      label: 'FP16 / BF16',
      name: '16-bit Float (Half Precision)',
      memory: '70 GB',
      memoryVal: 70,
      accuracy: 99.5,
      speed: 2,
      speedLabel: '2× faster',
      color: 'from-green-500 to-teal-400',
      textColor: 'text-green-400',
      desc: 'The industry standard for training. Half the precision, half the memory, essentially no accuracy loss. The sweet spot for cloud inference.',
      pixels: 1,
    },
    {
      bits: 8,
      label: 'INT8',
      name: '8-bit Integer (Quantized)',
      memory: '35 GB',
      memoryVal: 35,
      accuracy: 98.5,
      speed: 4,
      speedLabel: '4× faster',
      color: 'from-yellow-500 to-orange-400',
      textColor: 'text-yellow-400',
      desc: 'The first step into quantization. Weights rounded to whole numbers with 256 possible values. Barely perceptible accuracy drop. Runs on high-end consumer GPUs (RTX 4090).',
      pixels: 2,
    },
    {
      bits: 4,
      label: 'INT4',
      name: '4-bit Integer (Aggressive)',
      memory: '17 GB',
      memoryVal: 17,
      accuracy: 96,
      speed: 8,
      speedLabel: '8× faster',
      color: 'from-orange-500 to-red-400',
      textColor: 'text-orange-400',
      desc: 'Only 16 possible values per weight. Visible quality degradation in edge cases, but 87.5% memory reduction. Used by GPTQ and AWQ. Runs on a MacBook Pro with 18GB RAM.',
      pixels: 4,
    },
    {
      bits: 2,
      label: 'INT2',
      name: '2-bit Integer (Extreme)',
      memory: '9 GB',
      memoryVal: 9,
      accuracy: 88,
      speed: 16,
      speedLabel: '16× faster',
      color: 'from-red-600 to-rose-500',
      textColor: 'text-red-400',
      desc: 'Only 4 possible values per weight! 94% memory savings. The model still functions but makes noticeably more errors. Used in Apple Intelligence\'s least-critical neural network layers.',
      pixels: 8,
    },
  ];

  const PRECISION_STEPS = [32, 16, 8, 4, 2];
  const currentLevel = LEVELS.find(l => l.bits === precision);
  const maxMemory = 140;

  // Build a visual face grid that degrades with precision loss
  const buildFaceGrid = (pixelSize) => {
    // Simple 16x16 representation of a face using ASCII-mapped blocks
    const facePattern = [
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
      [0,1,1,0,2,2,1,1,1,1,2,2,0,1,1,0],
      [0,1,1,0,2,2,1,1,1,1,2,2,0,1,1,0],
      [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0],
      [0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    const colorMap = {
      0: '#1a1a2e',
      1: '#f4c2a1',
      2: '#4a3728',
    };

    // Apply pixel degradation based on quantization level
    const degraded = facePattern.map((row, ri) =>
      row.map((cell, ci) => {
        if (pixelSize === 0) return colorMap[cell];
        // Group pixels into blocks — same color for entire block
        const blockR = Math.floor(ri / pixelSize) * pixelSize;
        const blockC = Math.floor(ci / pixelSize) * pixelSize;
        const blockVal = facePattern[Math.min(blockR, 15)][Math.min(blockC, 15)];
        return colorMap[blockVal];
      })
    );

    return degraded;
  };

  const grid = buildFaceGrid(currentLevel.pixels);
  const cellSize = 16; // px per cell in the 16x16 grid

  const handleSlider = (e) => {
    const idx = parseInt(e.target.value);
    setPrecision(PRECISION_STEPS[idx]);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const currentIdx = PRECISION_STEPS.indexOf(precision);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1">🎨 The Palette Compressor</h3>
          <p className="text-gray-400 text-sm">Drag the precision slider to shrink an AI model. Watch the image degrade as accuracy drops — and the memory requirement collapse. This is the quantization trade-off.</p>
        </div>

        <div className="p-5 grid grid-cols-2 gap-6">
          {/* Left: Face visualization */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Portrait Quality</div>
            <div
              className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${animating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
              style={{ borderColor: precision <= 4 ? '#ef4444' : precision <= 8 ? '#f97316' : '#22c55e', width: 256, height: 256 }}
            >
              {grid.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', height: cellSize }}>
                  {row.map((color, ci) => (
                    <div key={ci} style={{ width: cellSize, height: cellSize, backgroundColor: color }} />
                  ))}
                </div>
              ))}
            </div>
            <div className={`mt-2 text-lg font-black ${currentLevel.textColor}`}>{currentLevel.label}</div>
            <div className="text-xs text-gray-500">{currentLevel.name}</div>
          </div>

          {/* Right: Metrics */}
          <div className="flex flex-col gap-4">
            {/* Memory bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Memory Required</span>
                <span className={`font-bold text-sm ${currentLevel.textColor}`}>{currentLevel.memory}</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color} transition-all duration-700`}
                  style={{ width: `${(currentLevel.memoryVal / maxMemory) * 100}%` }}
                />
              </div>
            </div>

            {/* Accuracy bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Model Accuracy</span>
                <span className={`font-bold text-sm ${currentLevel.textColor}`}>{currentLevel.accuracy}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${currentLevel.accuracy > 98 ? 'bg-green-500' : currentLevel.accuracy > 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${currentLevel.accuracy}%` }}
                />
              </div>
            </div>

            {/* Speed */}
            <div className="bg-black/40 border border-glass-stroke rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Inference Speed</div>
              <div className={`text-2xl font-black ${currentLevel.textColor}`}>{currentLevel.speedLabel}</div>
            </div>

            {/* Description */}
            <div className={`rounded-xl border p-3 text-xs text-gray-300 leading-relaxed`} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {currentLevel.desc}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="px-5 pb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Full Precision (FP32) 🏆</span>
            <span>Extreme Compression (INT2) 🔋</span>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={currentIdx}
            onChange={handleSlider}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            {PRECISION_STEPS.map((b, i) => (
              <span key={b} className={`text-xs font-mono ${i === currentIdx ? 'text-white font-bold' : 'text-gray-600'}`}>{b}-bit</span>
            ))}
          </div>
        </div>

        {/* Techniques legend */}
        <div className="border-t border-glass-stroke p-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">2026 Quantization Formats</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'GGUF', range: 'INT2–INT8', use: 'CPU & MacBook optimized. Most popular for consumer AI.' },
              { name: 'GPTQ', range: 'INT4–INT8', use: 'Max speed on NVIDIA GPUs. Mathematically selects safest weights to delete.' },
              { name: 'AWQ', range: 'INT4', use: 'Smarter than GPTQ. Watches the model "think" to protect critical connections.' },
            ].map(t => (
              <div key={t.name} className="bg-black/40 border border-glass-stroke rounded-lg p-2">
                <div className="text-white font-bold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs mb-1">{t.range}</div>
                <div className="text-gray-400 text-xs leading-tight">{t.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AppleIntelligenceWidget ─────────────────────────────────────────────────
// Interactive architecture explorer for Apple's on-device AI system
export function AppleIntelligenceWidget() {
  const [activeLayer, setActiveLayer] = useState(null);

  const LAYERS = [
    {
      id: 'slm',
      icon: '🧠',
      label: 'AFM On-Device (3B SLM)',
      color: 'text-blue-400',
      border: 'border-blue-700',
      bg: 'bg-blue-950/30',
      summary: '~3B parameters. Specialized for iOS tasks only.',
      detail: 'Apple did not put a Polymath model on the iPhone. The AFM-on-device is a ~3 Billion parameter SLM — compared to GPT-4\'s rumoured 1 Trillion+. It is not designed to write quantum physics simulations. It is specialized for notification summarization, email rewriting, message sorting, and understanding user intent to trigger app actions. Smaller scope = dramatically smaller model = runs on a battery-powered device.',
    },
    {
      id: 'quant',
      icon: '🗜️',
      label: '2-bit & 4-bit Mixed Quantization',
      color: 'text-orange-400',
      border: 'border-orange-700',
      bg: 'bg-orange-950/30',
      summary: 'Averages under 4 bits per weight. Critical layers at 4-bit, least important at 2-bit.',
      detail: 'Apple uses Quantization-Aware Training — the model is trained from scratch knowing it will be compressed (unlike post-training quantization, which is like squeezing a finished cake). This lets the model learn to pack its most important intelligence into weights that survive the compression. The result: an average of under 4 bits per weight. Less critical layers are aggressively compressed to 2-bit (just 4 possible values), while reasoning-critical layers stay at 4-bit.',
    },
    {
      id: 'lora',
      icon: '🔌',
      label: 'LoRA Adapters (Task Plugins)',
      color: 'text-green-400',
      border: 'border-green-700',
      bg: 'bg-green-950/30',
      summary: 'Tiny "specialty chips" hot-swapped onto the base model per task.',
      detail: 'Instead of loading 10 different full models for 10 different tasks, Apple keeps one 3B foundation model in memory permanently. When you request a specific task, a tiny LoRA (Low-Rank Adaptation) adapter is hot-swapped on top. "Rewrite this email professionally" → loads a few-MB "Professional Tone" LoRA. "Summarize this webpage" → swaps to "Summarization" LoRA. These adapters are just megabytes each, meaning the iPhone can serve dozens of distinct AI personalities without ever needing to swap the base model out of RAM.',
    },
    {
      id: 'kvcache',
      icon: '💾',
      label: 'KV-Cache Sharing',
      color: 'text-purple-400',
      border: 'border-purple-700',
      bg: 'bg-purple-950/30',
      summary: 'Later transformer blocks reuse memory from earlier blocks.',
      detail: 'When an LLM generates text, it must keep track of everything it has read and written — stored in the KV (Key-Value) Cache. This memory usage grows with every word generated and is normally duplicated across every transformer layer. Apple\'s architectural innovation: transformer layers are grouped into blocks. Later blocks in the same group reuse the KV-Cache generated by earlier blocks rather than generating their own from scratch. This single optimization dramatically reduces the RAM footprint required to generate long summaries or process complex, multi-step Siri commands.',
    },
    {
      id: 'cloud',
      icon: '☁️',
      label: 'Private Cloud Compute (Fallback)',
      color: 'text-cyan-400',
      border: 'border-cyan-700',
      bg: 'bg-cyan-950/30',
      summary: 'Complex requests routed to encrypted Apple servers. Data never stored.',
      detail: 'A 3B parameter on-device model cannot handle everything. When Apple\'s Semantic Router detects that a request exceeds the local model\'s capability, it encrypts the request and routes it to Private Cloud Compute (PCC) — Apple\'s server infrastructure running a much larger MoE-based foundation model. The critical guarantee: PCC is architecturally designed so that even Apple engineers cannot access or read your request data. The servers run Apple Silicon, the code is open to independent security researchers, and data is mathematically guaranteed to be ephemeral (deleted immediately after processing).',
    },
  ];

  const active = LAYERS.find(l => l.id === activeLayer);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1"> Apple Intelligence Architecture</h3>
          <p className="text-gray-400 text-sm">Every layer of Apple Intelligence uses the concepts from this chapter. Click each layer to understand exactly how Apple combined SLMs, Quantization, and LoRA to bring generative AI to billions of iPhones.</p>
        </div>

        {/* Architecture stack */}
        <div className="p-5">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 text-center">Tap a layer to explore</div>

          {/* Visual stack */}
          <div className="relative mb-6">
            {/* Connector line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-700 via-purple-700 to-cyan-700 opacity-30" />
            <div className="space-y-2">
              {LAYERS.map((layer, i) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                    activeLayer === layer.id
                      ? `${layer.bg} ${layer.border} ring-1 ring-white/20`
                      : 'bg-black/30 border-glass-stroke hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl w-10 text-center flex-shrink-0">{layer.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${activeLayer === layer.id ? layer.color : 'text-white'}`}>{layer.label}</div>
                    <div className="text-xs text-gray-500 truncate">{layer.summary}</div>
                  </div>
                  <span className="text-gray-600 text-lg">{activeLayer === layer.id ? '▲' : '▼'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {active && (
            <div className={`rounded-xl border p-4 ${active.bg} ${active.border} transition-all`}>
              <div className={`font-bold text-base mb-2 ${active.color}`}>{active.icon} {active.label}</div>
              <p className="text-sm text-gray-300 leading-relaxed">{active.detail}</p>
            </div>
          )}

          {/* Bottom stat bar */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'On-Device Model Size', value: '~3B params' },
              { label: 'Avg Quantization', value: '<4-bit' },
              { label: 'LoRA Adapter Size', value: '~few MB each' },
            ].map(s => (
              <div key={s.label} className="bg-black/40 border border-glass-stroke rounded-xl p-3 text-center">
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AGITrackerWidget ─────────────────────────────────────────────────────────
// Dual-framework AGI progress explorer with milestone overlay and AGI tests
export function AGITrackerWidget() {
  const [framework, setFramework] = useState('deepmind');
  const [showMilestones, setShowMilestones] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeTest, setActiveTest] = useState(null);

  const FRAMEWORKS = {
    deepmind: {
      label: 'DeepMind Matrix',
      color: 'from-blue-600 to-cyan-500',
      accent: 'text-cyan-400',
      border: 'border-cyan-700',
      bg: 'bg-cyan-950/30',
      levels: [
        { id: 0, label: 'Level 0', name: 'No AI', desc: 'Traditional rule-based software. No learning. Pure if-then logic.', color: '#374151', current: false },
        { id: 1, label: 'Level 1', name: 'Emerging AGI', desc: 'Slightly better than an unskilled human on general tasks. Early ChatGPT (2022) sat here.', color: '#6b7280', current: false },
        { id: 2, label: 'Level 2', name: 'Competent AGI', desc: 'Performs at the 50th percentile of skilled adult professionals. GPT-4o / Gemini 1.5 Pro territory.', color: '#3b82f6', current: false },
        { id: 3, label: 'Level 3', name: 'Expert AGI', desc: 'Performs at the 90th percentile of skilled adults — beating most experts in most domains.', color: '#8b5cf6', current: true },
        { id: 4, label: 'Level 4', name: 'Virtuoso AGI', desc: 'Performs at the 99th percentile — a once-in-a-generation talent in every field simultaneously.', color: '#ec4899', current: false },
        { id: 5, label: 'Level 5', name: 'Superhuman AGI', desc: 'Outperforms 100% of humans across all cognitive domains. Enters Artificial Superintelligence (ASI) territory.', color: '#f97316', current: false },
      ],
    },
    openai: {
      label: 'OpenAI 5-Level',
      color: 'from-green-600 to-teal-500',
      accent: 'text-green-400',
      border: 'border-green-700',
      bg: 'bg-green-950/30',
      levels: [
        { id: 1, label: 'Level 1', name: 'Chatbots', desc: 'Conversational AI. Natural language understanding and generation. ChatGPT, Bard early stage.', color: '#374151', current: false },
        { id: 2, label: 'Level 2', name: 'Reasoners', desc: 'AI that can solve complex, novel, PhD-level problems without internet access. o3, Gemini 2.5 Pro.', color: '#3b82f6', current: false },
        { id: 3, label: 'Level 3', name: 'Agents', desc: 'AI that acts autonomously over long periods, using tools to achieve multi-step goals. We are entering this now in 2026.', color: '#8b5cf6', current: true },
        { id: 4, label: 'Level 4', name: 'Innovators', desc: 'AI that independently invents new scientific breakthroughs — discovers new physics, synthesizes new drugs.', color: '#ec4899', current: false },
        { id: 5, label: 'Level 5', name: 'Organizations', desc: 'A single AI system capable of autonomously managing and running an entire corporation end-to-end.', color: '#f97316', current: false },
      ],
    },
  };

  const MILESTONES = [
    { year: '2022', label: 'ChatGPT launch', dm: 1, oai: 1, color: '#6b7280' },
    { year: '2023', label: 'GPT-4 Vision', dm: 2, oai: 2, color: '#3b82f6' },
    { year: '2024', label: 'Turing Test surpassed (GPT-4.5, 73%)', dm: 2, oai: 2, color: '#60a5fa' },
    { year: '2025 Q1', label: 'o3 PhD-level reasoning', dm: 3, oai: 2, color: '#8b5cf6' },
    { year: '2025 Q3', label: 'Long-horizon agents deployed', dm: 3, oai: 3, color: '#a78bfa' },
    { year: '2026 H1', label: 'Gemini Omni / Claude Mythos agents', dm: 3, oai: 3, color: '#c084fc' },
    { year: '2026 H2', label: 'NVIDIA Cosmos 3 (Physical AI)', dm: 3, oai: 3, color: '#d946ef' },
  ];

  const TESTS = [
    {
      id: 'turing',
      icon: '🤖',
      name: 'Turing Test',
      author: 'Alan Turing, 1950',
      status: 'PASSED ✓',
      statusColor: 'text-green-400',
      statusBg: 'bg-green-900/30',
      year: '2025',
      desc: 'Can a machine fool a human into thinking it is human through text conversation? In a 2025 pre-registered study, GPT-4.5 was judged human in 73% of conversations — surpassing the 67% humanness rate of real humans.',
      verdict: 'The Turing Test is now dead as an AGI bar. It tests persuasiveness, not general intelligence.',
    },
    {
      id: 'coffee',
      icon: '☕',
      name: 'The Coffee Test',
      author: 'Steve Wozniak, 2010',
      status: 'IN PROGRESS ⚡',
      statusColor: 'text-yellow-400',
      statusBg: 'bg-yellow-900/30',
      year: '~2027?',
      desc: 'A robot must enter an average, unfamiliar American home, find the kitchen, locate the coffee and a mug, and successfully brew a cup of coffee using an unfamiliar machine — without any pre-programmed house map.',
      verdict: 'Requires physical dexterity, spatial reasoning, common sense, and object recognition all fused together. Current robots still fail on generalization.',
    },
    {
      id: 'ikea',
      icon: '🪑',
      name: 'The IKEA Test',
      author: 'AI Research Community',
      status: 'NOT PASSED ✗',
      statusColor: 'text-red-400',
      statusBg: 'bg-red-900/30',
      year: 'Unknown',
      desc: 'An AI must autonomously control a robot to unpack and assemble a piece of flat-pack furniture from only the visual geometry of the parts — no pre-programmed assembly instructions, no CAD files.',
      verdict: 'Demands physics reasoning, fine motor control, 3D spatial understanding, and error recovery. Completely unsolved for general furniture.',
    },
    {
      id: 'suleyman',
      icon: '💰',
      name: "Suleyman's Test",
      author: 'Mustafa Suleyman (Microsoft AI)',
      status: 'NOT PASSED ✗',
      statusColor: 'text-red-400',
      statusBg: 'bg-red-900/30',
      year: 'Unknown',
      desc: 'You give an AI a seed of $100,000. It must autonomously research a product opportunity, source manufacturers, build an e-commerce store, run marketing campaigns, and generate $1,000,000 in revenue — fully autonomously.',
      verdict: 'The ultimate economic AGI test. Requires sustained real-world judgment, entrepreneurial strategy, and long-horizon planning. Current agents fail on multi-week autonomy.',
    },
  ];

  const fw = FRAMEWORKS[framework];
  const maxLevels = fw.levels.length;
  const currentLevelObj = fw.levels.find(l => l.current);
  const activeTest_ = TESTS.find(t => t.id === activeTest);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1">🏁 AGI Framework Explorer</h3>
          <p className="text-gray-400 text-sm">Toggle between the DeepMind Matrix and OpenAI 5-Level frameworks. Enable milestones to see exactly where 2026 AI models sit in the grand race toward AGI.</p>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-glass-stroke flex flex-wrap gap-3 items-center">
          {/* Framework toggle */}
          <div className="flex rounded-xl overflow-hidden border border-glass-stroke text-xs font-bold">
            {Object.entries(FRAMEWORKS).map(([key, f]) => (
              <button
                key={key}
                onClick={() => { setFramework(key); setActiveLevel(null); }}
                className={`px-4 py-2 transition-all ${framework === key ? `bg-gradient-to-r ${f.color} text-white` : 'bg-black/30 text-gray-400 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Milestone toggle */}
          <button
            onClick={() => setShowMilestones(m => !m)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${showMilestones ? 'bg-white/10 border-white/20 text-white' : 'bg-black/30 border-glass-stroke text-gray-500'}`}
          >
            <span className={`w-2 h-2 rounded-full ${showMilestones ? 'bg-white' : 'bg-gray-600'}`} />
            Show 2026 Milestones
          </button>
        </div>

        {/* Tier chart */}
        <div className="p-5">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Tap a level to explore</div>
          <div className="space-y-2">
            {[...fw.levels].reverse().map((level, i) => {
              const levelMilestones = showMilestones
                ? MILESTONES.filter(m => framework === 'deepmind' ? m.dm === level.id : m.oai === level.id)
                : [];
              const isActive = activeLevel === level.id;
              const isCurrentLevel = level.current;

              return (
                <div key={level.id}>
                  <button
                    onClick={() => setActiveLevel(isActive ? null : level.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isActive ? 'bg-white/10 border-white/20' : 'bg-black/30 border-glass-stroke hover:bg-white/5'
                    }`}
                  >
                    {/* Level indicator bar */}
                    <div
                      className="flex-shrink-0 w-2 rounded-full self-stretch min-h-[36px]"
                      style={{ backgroundColor: level.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 uppercase">{level.label}</span>
                        <span className="text-sm font-bold text-white">{level.name}</span>
                        {isCurrentLevel && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white animate-pulse">
                            ← We are here (2026)
                          </span>
                        )}
                      </div>
                      {/* Milestone pills */}
                      {levelMilestones.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {levelMilestones.map(m => (
                            <span key={m.year + m.label} className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border" style={{ borderColor: m.color + '60', backgroundColor: m.color + '15', color: m.color }}>
                              <span className="font-bold">{m.year}</span>
                              <span className="truncate max-w-[160px]">{m.label}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-600 flex-shrink-0">{isActive ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded detail */}
                  {isActive && (
                    <div className="mt-1 ml-5 p-3 rounded-xl border border-glass-stroke bg-black/30 text-sm text-gray-300 leading-relaxed">
                      {level.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current position summary */}
          {currentLevelObj && (
            <div className={`mt-4 rounded-xl border p-3 ${fw.bg} ${fw.border}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${fw.accent}`}>Current Position (2026)</div>
              <div className="text-white text-sm font-bold">{currentLevelObj.label}: {currentLevelObj.name}</div>
              <div className="text-gray-400 text-xs mt-1">{currentLevelObj.desc}</div>
            </div>
          )}
        </div>

        {/* AGI Tests */}
        <div className="border-t border-glass-stroke p-5">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">The New AGI Tests — Beyond the Turing Test</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {TESTS.map(test => (
              <button
                key={test.id}
                onClick={() => setActiveTest(activeTest === test.id ? null : test.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                  activeTest === test.id ? 'bg-white/10 border-white/20' : 'bg-black/30 border-glass-stroke hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{test.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{test.name}</div>
                  <div className={`text-xs font-bold ${test.statusColor}`}>{test.status}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Test detail panel */}
          {activeTest_ && (
            <div className={`rounded-xl border p-4 ${activeTest_.statusBg} border-glass-stroke`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{activeTest_.icon}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-bold text-sm">{activeTest_.name}</span>
                    <span className={`text-xs font-bold ${activeTest_.statusColor}`}>{activeTest_.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Proposed by {activeTest_.author} · Est. solved: {activeTest_.year}</div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">{activeTest_.desc}</p>
                  <div className="border-l-2 border-white/20 pl-3">
                    <p className="text-xs text-gray-400 italic">{activeTest_.verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- TakeoffSimulatorWidget ---
export function TakeoffSimulatorWidget() {
  const [speed, setSpeed] = useState('exponential');
  const [compute, setCompute] = useState('unlimited');
  const [animKey, setAnimKey] = useState(0);

  const W = 560, H = 320;
  const PAD = { top: 24, right: 24, bottom: 48, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const STEPS = 60;
  const HUMAN_Y = 0.35;

  const generatePoints = () => {
    const pts = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      let y;
      if (speed === 'linear') {
        y = t * 0.85;
      } else if (compute === 'bottlenecked') {
        const k = 10, x0 = 0.5;
        y = 1 / (1 + Math.exp(-k * (t - x0)));
        y = y * 0.85;
      } else {
        if (t < 0.55) {
          y = t * HUMAN_Y / 0.55;
        } else {
          const delta = (t - 0.55) / 0.45;
          y = HUMAN_Y + (1 - HUMAN_Y) * (Math.pow(12, delta) - 1) / 11;
          y = Math.min(y, 1);
        }
      }
      pts.push({ t, y });
    }
    return pts;
  };

  const toSvgX = (t) => PAD.left + t * chartW;
  const toSvgY = (y) => PAD.top + chartH - y * chartH;
  const points = generatePoints();
  const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + toSvgX(p.t).toFixed(1) + ' ' + toSvgY(p.y).toFixed(1)).join(' ');

  const humanLineY = toSvgY(HUMAN_Y);
  const asiLineY = toSvgY(0.9);
  const isFastTakeoff = speed === 'exponential' && compute === 'unlimited';
  const curveColor = isFastTakeoff ? '#f97316' : speed === 'linear' ? '#6b7280' : '#8b5cf6';

  const scenario = isFastTakeoff
    ? { label: 'FAST TAKEOFF', desc: 'AGI rewrites itself in software within days — humanity has no time to react.', color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-700' }
    : speed === 'linear'
    ? { label: 'LINEAR (No Explosion)', desc: 'Constant growth rate — predictable, manageable, but experts consider this unrealistic.', color: 'text-gray-400', bg: 'bg-gray-900/30', border: 'border-gray-700' }
    : { label: 'SLOW TAKEOFF', desc: 'Hardware bottlenecks create an S-curve over decades. Humans can regulate in time.', color: 'text-purple-400', bg: 'bg-purple-950/30', border: 'border-purple-700' };

  const handle = (s, c) => { if (s !== undefined) setSpeed(s); if (c !== undefined) setCompute(c); setAnimKey(k => k + 1); };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl overflow-hidden border border-glass-stroke shadow-xl">
        <div className="p-4 border-b border-glass-stroke">
          <h3 className="text-xl font-bold text-white mb-1">Intelligence Explosion Simulator</h3>
          <p className="text-gray-400 text-sm">Adjust the controls to watch how the intelligence curve changes under different self-improvement and hardware scenarios.</p>
        </div>
        <div className="p-4 border-b border-glass-stroke flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Self-Improvement Rate</div>
            <div className="flex rounded-xl overflow-hidden border border-glass-stroke text-xs font-bold">
              {[{v:'linear',l:'Linear'},{v:'exponential',l:'Exponential'}].map(o=>(
                <button key={o.v} onClick={()=>handle(o.v,undefined)} className={`flex-1 py-2 px-3 transition-all ${speed===o.v?'bg-white/15 text-white':'bg-black/30 text-gray-400 hover:text-white'}`}>{o.l}</button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Hardware Constraints</div>
            <div className="flex rounded-xl overflow-hidden border border-glass-stroke text-xs font-bold">
              {[{v:'unlimited',l:'Unlimited'},{v:'bottlenecked',l:'Bottlenecked'}].map(o=>(
                <button key={o.v} onClick={()=>handle(undefined,o.v)} className={`flex-1 py-2 px-3 transition-all ${compute===o.v?'bg-white/15 text-white':'bg-black/30 text-gray-400 hover:text-white'}`}>{o.l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <svg key={animKey} width="100%" viewBox={`0 0 ${W} ${H}`} className="w-full max-w-full">
            <style>{`@keyframes dashDraw2{to{stroke-dashoffset:0}}`}</style>
            {[0,0.25,0.5,0.75,1].map(y=><line key={'gy'+y} x1={PAD.left} y1={toSvgY(y)} x2={PAD.left+chartW} y2={toSvgY(y)} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
            {[0,0.25,0.5,0.75,1].map(t=><line key={'gx'+t} x1={toSvgX(t)} y1={PAD.top} x2={toSvgX(t)} y2={PAD.top+chartH} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
            <rect x={PAD.left} y={PAD.top} width={chartW} height={toSvgY(0.9)-PAD.top} fill="rgba(249,115,22,0.04)"/>
            <line x1={PAD.left} y1={humanLineY} x2={PAD.left+chartW} y2={humanLineY} stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="6,4"/>
            <text x={PAD.left+chartW-4} y={humanLineY-6} textAnchor="end" fill="#6ee7b7" fontSize="10" fontWeight="bold">Human / AGI Level</text>
            <line x1={PAD.left} y1={asiLineY} x2={PAD.left+chartW} y2={asiLineY} stroke="#f97316" strokeWidth="1" strokeDasharray="4,4"/>
            <text x={PAD.left+chartW-4} y={asiLineY-5} textAnchor="end" fill="#f97316" fontSize="10">ASI Territory</text>
            <path d={pathD} fill="none" stroke={curveColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:2000,strokeDashoffset:2000,animation:'dashDraw2 1.2s ease forwards'}}/>
            <path d={pathD+` L ${toSvgX(1)} ${toSvgY(0)} L ${PAD.left} ${toSvgY(0)} Z`} fill={curveColor+'18'}/>
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top+chartH} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1={PAD.left} y1={PAD.top+chartH} x2={PAD.left+chartW} y2={PAD.top+chartH} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <text x={PAD.left+chartW/2} y={H-10} textAnchor="middle" fill="#6b7280" fontSize="11">Time</text>
            <text x={14} y={PAD.top+chartH/2} textAnchor="middle" fill="#6b7280" fontSize="11" transform={`rotate(-90,14,${PAD.top+chartH/2})`}>Intelligence</text>
            {[{label:'Ant',y:0},{label:'Human',y:HUMAN_Y},{label:'God',y:1}].map(t=>(
              <text key={t.label} x={PAD.left-6} y={toSvgY(t.y)+4} textAnchor="end" fill="#6b7280" fontSize="9">{t.label}</text>
            ))}
          </svg>
        </div>
        <div className={`mx-4 mb-4 rounded-xl border p-4 ${scenario.bg} ${scenario.border}`}>
          <div className={`text-sm font-black uppercase tracking-wider mb-1 ${scenario.color}`}>{scenario.label}</div>
          <p className="text-sm text-gray-300">{scenario.desc}</p>
        </div>
        <div className="border-t border-glass-stroke p-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Key Concepts</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              {icon:'Rec',term:'Recursive Self-Improvement',def:'An AGI rewrites its own code to get smarter, then the smarter version rewrites again — exponentially.'},
              {icon:'Slw',term:'Slow Takeoff',def:'Physical hardware limits (data centers, energy grids) bottleneck the speed — decades of transition.'},
              {icon:'Fst',term:'Fast Takeoff',def:'The explosion happens entirely in software within days. No time for human regulation.'},
              {icon:'Ppr',term:'Paperclip Maximizer',def:'An ASI given a trivial goal dismantles the Earth to optimize it — not from malice, from cold optimization.'},
            ].map(c=>(
              <div key={c.term} className="bg-black/40 border border-glass-stroke rounded-lg p-2">
                <div className="font-bold text-white text-xs mb-1">{c.term}</div>
                <div className="text-gray-500 leading-tight">{c.def}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

