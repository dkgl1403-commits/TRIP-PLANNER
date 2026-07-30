import React, { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------
// CinematicHistory (Full screen, zero boxes)
// ---------------------------------------------------------
export function CinematicHistory({ data }) {
  const { scenes } = data || { scenes: [] };
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    if (scenes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentScene(prev => (prev + 1) % scenes.length);
    }, 8000); // Slower pacing for cinematic feel
    return () => clearInterval(interval);
  }, [scenes]);

  if (!scenes || scenes.length === 0) return null;

  const scene = scenes[currentScene];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Massive Cinematic SVG Animations that fill the whole viewport */}
      <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {scene.id === 'hipparchus' && (
          <g className="animate-pulse">
            <circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="0.1" fill="none" />
            <line x1="18.1" y1="18.1" x2="81.9" y2="81.9" stroke="#00ffcc" strokeWidth="0.3" strokeDasharray="1,1" />
            <text x="52" y="48" fill="#00ffcc" fontSize="3" fontWeight="100">R = 60</text>
            <text x="20" y="50" fill="#fff" fontSize="5" fontWeight="100" opacity="0.5">Chord</text>
          </g>
        )}
        {scene.id === 'aryabhata' && (
          <g>
            <circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="0.1" fill="none" />
            <line x1="18.1" y1="18.1" x2="81.9" y2="81.9" stroke="#555" strokeWidth="0.2" strokeDasharray="0.5,0.5" />
            <line x1="50" y1="50" x2="81.9" y2="81.9" stroke="#ff00cc" strokeWidth="0.5" className="animate-pulse" />
            <text x="60" y="65" fill="#ff00cc" fontSize="6" fontWeight="bold">ardha-jya</text>
          </g>
        )}
        {scene.id === 'linguistic' && (
          <g>
            <text x="10" y="50" fill="#fff" fontSize="8" opacity="0.2">Jya</text>
            <path d="M 30 48 Q 50 10 70 48" stroke="#888" strokeWidth="0.2" fill="none" />
            <text x="75" y="50" fill="#00ffcc" fontSize="12" fontWeight="bold" className="animate-pulse">Sine</text>
          </g>
        )}
      </svg>
      
      {/* Floating technique details aligned to the right to balance the left-aligned narrative */}
      <div className="absolute right-[10vw] top-1/2 -translate-y-1/2 text-right">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-600 drop-shadow-2xl mb-4 transition-all duration-1000">
          {scene.title}
        </h2>
        <p className="text-2xl text-gray-400 font-light max-w-xl ml-auto mb-8 transition-all duration-1000">
          {scene.description}
        </p>
        {scene.technique && (
          <div className="text-neon-purple text-3xl font-mono text-right animate-pulse">
            <pre className="bg-transparent m-0 p-0">{scene.technique}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// CinematicDerivation (Full screen blackboard/grid)
// ---------------------------------------------------------
export function CinematicDerivation({ data }) {
  const { type } = data || { type: 'sohcahtoa' };
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
      {/* Full screen futuristic grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="w-full flex justify-between items-center px-[10vw] z-10">
        
        {/* Massive SVG Drawing Area */}
        <div className="w-[40vw] h-[40vw] relative flex items-center justify-center">
          <svg viewBox="-10 -10 120 120" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {type === 'sohcahtoa' && (
              <g transform="translate(10, 90) scale(1, -1)">
                <line x1="0" y1="0" x2="80" y2="0" stroke="white" strokeWidth="1" className="transition-all duration-1000" />
                <line x1="80" y1="0" x2="80" y2="60" stroke={step >= 1 ? "#ff00cc" : "white"} strokeWidth={step >= 1 ? 2 : 1} className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(255,0,204,0.8)]" />
                <line x1="0" y1="0" x2="80" y2="60" stroke={step >= 1 ? "#00ffcc" : "white"} strokeWidth={step >= 1 ? 2 : 1} className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]" />
                <path d="M 15 0 A 15 15 0 0 1 12 9" fill="none" stroke="yellow" strokeWidth="1" />
                <text x="20" y="-5" fill="yellow" fontSize="8" transform="scale(1, -1)">θ</text>
                
                {step >= 1 && <text x="85" y="-30" fill="#ff00cc" fontSize="8" transform="scale(1, -1)">Opposite</text>}
                {step >= 1 && <text x="35" y="-40" fill="#00ffcc" fontSize="8" transform="scale(1, -1) rotate(-37)">Hypotenuse</text>}
                {step >= 2 && <text x="30" y="15" fill="white" fontSize="8" transform="scale(1, -1)">Adjacent</text>}
              </g>
            )}
            {type === 'identity' && (
              <g transform="translate(10, 90) scale(1, -1)">
                <line x1="0" y1="0" x2="80" y2="0" stroke="white" strokeWidth="1" />
                <line x1="80" y1="0" x2="80" y2="60" stroke="white" strokeWidth="1" />
                <line x1="0" y1="0" x2="80" y2="60" stroke="white" strokeWidth="1" />
                <text x="85" y="-30" fill="white" fontSize="10" transform="scale(1, -1)">Perpendicular (P)</text>
                <text x="35" y="15" fill="white" fontSize="10" transform="scale(1, -1)">Base (B)</text>
                <text x="35" y="-40" fill="white" fontSize="10" transform="scale(1, -1) rotate(-37)">Hypotenuse (H)</text>
              </g>
            )}
          </svg>
        </div>

        {/* Floating Typography Formulas */}
        <div className="w-[40vw]">
          {type === 'sohcahtoa' && (
            <div className="text-6xl font-mono text-right space-y-12">
              <div className={`transition-all duration-1000 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <span className="text-yellow-400">sin θ</span> = <span className="text-[#ff00cc]">Opp</span> / <span className="text-[#00ffcc]">Hyp</span>
              </div>
              <div className={`transition-all duration-1000 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <span className="text-yellow-400">cos θ</span> = <span className="text-white">Adj</span> / <span className="text-[#00ffcc]">Hyp</span>
              </div>
              <div className={`transition-all duration-1000 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <span className="text-yellow-400">tan θ</span> = <span className="text-[#ff00cc]">Opp</span> / <span className="text-white">Adj</span>
              </div>
            </div>
          )}
          {type === 'identity' && (
            <div className="text-right font-mono space-y-8">
              <div className="text-gray-400 text-3xl">Pythagoras Theorem:</div>
              <div className="text-white font-bold text-7xl mb-8">P² + B² = H²</div>
              <div className={`transition-all duration-1000 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="text-gray-400 text-3xl">Divide by H²:</span><br/>
                <span className="text-5xl">(P/H)² + (B/H)² = (H/H)²</span>
              </div>
              <div className={`transition-all duration-1000 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <div className="text-neon-coral font-black text-8xl mt-12 drop-shadow-[0_0_30px_rgba(255,107,107,0.8)]">
                  sin²θ + cos²θ = 1
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// CinematicMCQ (Interactive floating UI without boxes)
// ---------------------------------------------------------
export function CinematicMCQ({ data, part }) {
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

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-xl z-30">
      
      {/* Narrative Context at the top */}
      <div className="absolute top-24 left-[10vw] max-w-[40vw]">
        <h1 className="text-5xl font-bold text-white mb-4">{part.title}</h1>
        <p className="text-xl text-neon-coral">{part.description}</p>
      </div>

      {!isFinished ? (
        <div className="w-full max-w-5xl px-8 flex flex-col items-center animate-fade-in-up">
          <div className="w-full flex justify-between items-end mb-12">
            <span className="text-3xl text-gray-400 font-light">Question {currentQ + 1} / {questions.length}</span>
            {q.year && <span className="text-4xl font-black text-neon-purple drop-shadow-[0_0_15px_rgba(157,78,221,0.8)]">{q.year}</span>}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center leading-tight">{q.question}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
            {q.options.map((opt, idx) => {
              let styleClass = "py-6 px-8 text-3xl font-light rounded-2xl border border-white/20 transition-all duration-300 text-center cursor-pointer hover:bg-white/10 ";
              
              if (!isSubmitted) {
                styleClass += selectedOption === idx 
                  ? "bg-white text-black scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]" 
                  : "bg-transparent text-white";
              } else {
                if (idx === q.correctAnswer) {
                  styleClass += "bg-green-500 text-white shadow-[0_0_40px_rgba(34,197,94,0.6)] border-green-400 scale-105";
                } else if (selectedOption === idx) {
                  styleClass += "bg-red-500 text-white opacity-50 border-red-400";
                } else {
                  styleClass += "bg-transparent text-white opacity-20";
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                  className={styleClass}
                  disabled={isSubmitted}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {!isSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-16 py-6 bg-neon-coral text-white text-2xl font-black rounded-full disabled:opacity-0 hover:shadow-[0_0_30px_rgba(255,107,107,0.8)] hover:scale-105 transition-all"
            >
              Confirm Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-16 py-6 bg-white text-black text-2xl font-black rounded-full hover:scale-105 transition-all"
            >
              Continue
            </button>
          )}
        </div>
      ) : (
        <div className="text-center animate-fade-in-up">
          <h2 className="text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Assessment Complete</h2>
          <p className="text-5xl text-white">Final Score: <span className="font-black">{score}</span> / {questions.length}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// CinematicCheatSheet
// ---------------------------------------------------------
export function CinematicCheatSheet({ part }) {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-30 pointer-events-auto">
      <div className="absolute top-24 left-[10vw] max-w-[40vw]">
        <h1 className="text-5xl font-bold text-white mb-4">{part.title}</h1>
        <p className="text-xl text-neon-coral">{part.description}</p>
      </div>

      <div className="w-[80vw] flex flex-col md:flex-row gap-16 animate-fade-in-up mt-24">
        
        <div className="flex-1 flex flex-col justify-center space-y-16">
          <div>
            <h3 className="text-3xl font-light text-neon-coral mb-6">The Magic Word</h3>
            <div className="text-5xl font-mono font-bold space-y-6">
              <div><span className="text-white/50">SOH:</span> sin = O/H</div>
              <div><span className="text-white/50">CAH:</span> cos = A/H</div>
              <div><span className="text-white/50">TOA:</span> tan = O/A</div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light text-neon-purple mb-6">Identities</h3>
            <div className="text-5xl font-mono font-bold space-y-6">
              <div>sin²θ + cos²θ = 1</div>
              <div>1 + tan²θ = sec²θ</div>
              <div>1 + cot²θ = csc²θ</div>
            </div>
          </div>
        </div>

        <div className="flex-[2] flex flex-col justify-center">
          <h3 className="text-3xl font-light text-white mb-8">Standard Values Matrix</h3>
          <table className="w-full text-center text-4xl font-mono">
            <thead>
              <tr className="border-b border-white/20 text-white/50 pb-4">
                <th className="py-6 font-light">θ</th>
                <th className="py-6 font-light">0°</th>
                <th className="py-6 font-light">30°</th>
                <th className="py-6 font-light">45°</th>
                <th className="py-6 font-light">60°</th>
                <th className="py-6 font-light">90°</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-8 font-bold text-neon-coral">sin</td>
                <td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-8 font-bold text-neon-coral">cos</td>
                <td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-8 font-bold text-neon-coral">tan</td>
                <td>0</td><td>1/√3</td><td>1</td><td>√3</td><td className="text-white/30 text-2xl">∞</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Widget Registry Map
export const WidgetRegistry = {
  HistoryStoryteller: CinematicHistory,
  AutoDerivationGraph: CinematicDerivation,
  MCQEngine: CinematicMCQ,
  CheatSheet: CinematicCheatSheet
};
