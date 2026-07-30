import React, { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------
// HistoryStoryteller
// ---------------------------------------------------------
export function HistoryStoryteller({ data }) {
  const { scenes } = data || { scenes: [] };
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    if (scenes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentScene(prev => (prev + 1) % scenes.length);
    }, 7000); // Auto-play every 7 seconds
    return () => clearInterval(interval);
  }, [scenes]);

  if (!scenes || scenes.length === 0) return <div>No history data</div>;

  const scene = scenes[currentScene];

  return (
    <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-glass-stroke relative h-[500px] flex flex-col">
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-black overflow-hidden p-8">
        {/* Animated Background Placeholder / 2D SVG */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             {scene.id === 'hipparchus' && (
               <>
                 <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" className="animate-pulse"/>
                 <line x1="21" y1="21" x2="79" y2="79" stroke="#00ffcc" strokeWidth="1" />
                 <text x="55" y="45" fill="white" fontSize="4">Chord Table</text>
               </>
             )}
             {scene.id === 'aryabhata' && (
               <>
                 <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
                 <line x1="21" y1="21" x2="79" y2="79" stroke="#555" strokeWidth="1" strokeDasharray="2,2"/>
                 <line x1="50" y1="50" x2="79" y2="79" stroke="#ff00cc" strokeWidth="1.5" />
                 <text x="60" y="70" fill="#ff00cc" fontSize="5" fontWeight="bold">ardha-jya</text>
               </>
             )}
             {scene.id === 'linguistic' && (
               <>
                 <text x="20" y="50" fill="white" fontSize="6">Jya</text>
                 <path d="M 35 48 Q 50 20 65 48" stroke="#888" fill="none" markerEnd="url(#arrow)" />
                 <text x="70" y="50" fill="white" fontSize="6">Sine</text>
               </>
             )}
          </svg>
        </div>
        
        {/* Story Text Box */}
        <div className="z-10 bg-black/60 backdrop-blur-md p-8 rounded-xl border border-surface-variant max-w-2xl text-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <h3 className="text-3xl font-bold text-neon-coral mb-4">{scene.title}</h3>
          <p className="text-xl leading-relaxed text-gray-200">{scene.description}</p>
          {scene.technique && (
            <div className="mt-6 bg-surface-container-high p-4 rounded-lg text-left border border-neon-purple/30">
              <p className="text-neon-purple font-bold mb-2">Technique / Data:</p>
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                {scene.technique}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Timeline Controls */}
      <div className="h-16 bg-surface-container-high border-t border-glass-stroke flex items-center justify-center gap-4">
        {scenes.map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentScene(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentScene ? 'w-16 bg-neon-coral' : 'w-8 bg-surface-variant hover:bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// AutoDerivationGraph
// ---------------------------------------------------------
export function AutoDerivationGraph({ data }) {
  const { type } = data || { type: 'sohcahtoa' };
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl bg-surface-container-high rounded-2xl p-8 border border-glass-stroke shadow-xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center min-h-[400px]">
      
      {/* Drawing Area */}
      <div className="w-64 h-64 relative border-l-2 border-b-2 border-gray-500 bg-surface-container-highest rounded-lg overflow-hidden flex items-center justify-center">
        <svg viewBox="-10 -10 120 120" className="w-full h-full overflow-visible">
          {type === 'sohcahtoa' && (
            <g transform="translate(10, 90) scale(1, -1)">
              {/* Base */}
              <line x1="0" y1="0" x2="80" y2="0" stroke="white" strokeWidth="2" className="transition-all duration-1000" />
              {/* Height */}
              <line x1="80" y1="0" x2="80" y2="60" stroke={step >= 1 ? "#ff00cc" : "white"} strokeWidth={step >= 1 ? 4 : 2} className="transition-all duration-1000" />
              {/* Hypotenuse */}
              <line x1="0" y1="0" x2="80" y2="60" stroke={step >= 1 ? "#00ffcc" : "white"} strokeWidth={step >= 1 ? 4 : 2} className="transition-all duration-1000" />
              {/* Angle Arc */}
              <path d="M 15 0 A 15 15 0 0 1 12 9" fill="none" stroke="yellow" strokeWidth="2" />
              <text x="20" y="-5" fill="yellow" fontSize="10" transform="scale(1, -1)">θ</text>
              
              {step >= 1 && <text x="85" y="-30" fill="#ff00cc" fontSize="10" transform="scale(1, -1)">Opposite</text>}
              {step >= 1 && <text x="35" y="-40" fill="#00ffcc" fontSize="10" transform="scale(1, -1) rotate(-37)">Hypotenuse</text>}
              {step >= 2 && <text x="30" y="15" fill="white" fontSize="10" transform="scale(1, -1)">Adjacent</text>}
            </g>
          )}
          {type === 'identity' && (
            <g transform="translate(10, 90) scale(1, -1)">
              <line x1="0" y1="0" x2="80" y2="0" stroke="white" strokeWidth="2" />
              <line x1="80" y1="0" x2="80" y2="60" stroke="white" strokeWidth="2" />
              <line x1="0" y1="0" x2="80" y2="60" stroke="white" strokeWidth="2" />
              <text x="85" y="-30" fill="white" fontSize="12" transform="scale(1, -1)">P</text>
              <text x="40" y="15" fill="white" fontSize="12" transform="scale(1, -1)">B</text>
              <text x="35" y="-40" fill="white" fontSize="12" transform="scale(1, -1) rotate(-37)">H</text>
            </g>
          )}
        </svg>
      </div>

      {/* Formula Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/30 rounded-xl border border-glass-stroke">
        {type === 'sohcahtoa' && (
          <div className="text-3xl font-mono text-center space-y-6">
            <div className={`transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-yellow-400">sin θ</span> = <span className="text-[#ff00cc]">Opp</span> / <span className="text-[#00ffcc]">Hyp</span>
            </div>
            <div className={`transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-yellow-400">cos θ</span> = <span className="text-white">Adj</span> / <span className="text-[#00ffcc]">Hyp</span>
            </div>
            <div className={`transition-opacity duration-1000 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-yellow-400">tan θ</span> = <span className="text-[#ff00cc]">Opp</span> / <span className="text-white">Adj</span>
            </div>
          </div>
        )}
        {type === 'identity' && (
          <div className="text-2xl font-mono text-center space-y-4">
            <div className="text-gray-400">Pythagoras Theorem:</div>
            <div className="text-white font-bold text-3xl mb-4">P² + B² = H²</div>
            <div className={`transition-all duration-1000 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <span className="text-gray-400 text-lg">Divide by H²:</span><br/>
              (P/H)² + (B/H)² = (H/H)²
            </div>
            <div className={`transition-all duration-1000 ${step >= 2 ? 'opacity-100 text-neon-coral font-bold text-4xl mt-4 drop-shadow-[0_0_10px_rgba(255,107,107,0.8)]' : 'opacity-0'}`}>
              sin²θ + cos²θ = 1
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// MCQEngine
// ---------------------------------------------------------
export function MCQEngine({ data }) {
  const { questions } = data || { questions: [] };
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) return null;

  const q = questions[currentQ];
  const isFinished = currentQ >= questions.length;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === q.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentQ(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-surface-container-high rounded-2xl text-center border border-neon-purple shadow-xl">
        <h3 className="text-3xl font-bold mb-4">Assessment Complete</h3>
        <p className="text-2xl mb-6">Score: {score} / {questions.length}</p>
        <div className="w-full bg-surface-variant rounded-full h-4 mb-4">
          <div 
            className="bg-neon-purple h-4 rounded-full transition-all duration-1000" 
            style={{ width: `${(score/questions.length)*100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-surface-container-high rounded-2xl border border-glass-stroke shadow-xl">
      <div className="flex justify-between items-center mb-6 text-on-surface-variant font-bold">
        <span>Question {currentQ + 1} of {questions.length}</span>
        {q.year && <span className="bg-surface-variant px-3 py-1 rounded-md text-neon-coral text-sm">{q.year}</span>}
      </div>
      
      <h3 className="text-2xl font-bold mb-8 leading-relaxed">{q.question}</h3>
      
      <div className="flex flex-col gap-4 mb-8">
        {q.options.map((opt, idx) => {
          let btnClass = "p-4 rounded-xl text-left font-bold text-lg border-2 transition-all ";
          
          if (!isSubmitted) {
            btnClass += selectedOption === idx 
              ? "border-neon-purple bg-neon-purple/20 text-white" 
              : "border-surface-variant bg-surface-variant hover:border-gray-500";
          } else {
            if (idx === q.correctAnswer) {
              btnClass += "border-green-500 bg-green-500/20 text-green-400"; // Correct answer is always green
            } else if (selectedOption === idx) {
              btnClass += "border-red-500 bg-red-500/20 text-red-400"; // Selected wrong answer is red
            } else {
              btnClass += "border-surface-variant bg-surface-variant opacity-50"; // Others dimmed
            }
          }

          return (
            <button 
              key={idx} 
              onClick={() => !isSubmitted && setSelectedOption(idx)}
              className={btnClass}
              disabled={isSubmitted}
            >
              {String.fromCharCode(97 + idx)}) {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-glass-stroke pt-6">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-neon-coral text-background font-bold rounded-xl disabled:opacity-50 hover:shadow-[0_0_15px_rgba(255,107,107,0.5)] transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// CheatSheet
// ---------------------------------------------------------
export function CheatSheet() {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-container-high p-6 rounded-2xl border border-glass-stroke">
        <h3 className="text-xl font-bold text-neon-coral mb-4">The Magic Word</h3>
        <div className="text-3xl font-mono font-bold text-center space-y-4">
          <div><span className="text-yellow-400">SOH</span>: sin = O/H</div>
          <div><span className="text-yellow-400">CAH</span>: cos = A/H</div>
          <div><span className="text-yellow-400">TOA</span>: tan = O/A</div>
        </div>
      </div>
      <div className="bg-surface-container-high p-6 rounded-2xl border border-glass-stroke">
        <h3 className="text-xl font-bold text-neon-purple mb-4">Identities</h3>
        <div className="text-2xl font-mono font-bold space-y-4 text-center">
          <div>sin²θ + cos²θ = 1</div>
          <div>1 + tan²θ = sec²θ</div>
          <div>1 + cot²θ = csc²θ</div>
        </div>
      </div>
      <div className="bg-surface-container-high p-6 rounded-2xl border border-glass-stroke md:col-span-2 overflow-x-auto">
        <h3 className="text-xl font-bold mb-4 text-center">Standard Values</h3>
        <table className="w-full text-center text-lg">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-2">Angle (θ)</th>
              <th className="p-2">0°</th>
              <th className="p-2">30°</th>
              <th className="p-2">45°</th>
              <th className="p-2">60°</th>
              <th className="p-2">90°</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="p-3 font-bold text-yellow-400">sin θ</td>
              <td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="p-3 font-bold text-yellow-400">cos θ</td>
              <td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td>
            </tr>
            <tr>
              <td className="p-3 font-bold text-yellow-400">tan θ</td>
              <td>0</td><td>1/√3</td><td>1</td><td>√3</td><td>∞ (Not Def)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Widget Registry Map
export const WidgetRegistry = {
  HistoryStoryteller,
  AutoDerivationGraph,
  MCQEngine,
  CheatSheet
};
