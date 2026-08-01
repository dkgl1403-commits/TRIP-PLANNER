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
