import React, { useState, useEffect } from 'react';

export function MiniChallenge({ challenge }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Reset when challenge changes
  useEffect(() => {
    setSelectedIdx(null);
    setShowResult(false);
  }, [challenge]);

  if (!challenge) return null;

  const handleSelect = (idx) => {
    if (showResult) return; // Prevent changing answer after reveal
    setSelectedIdx(idx);
    setShowResult(true);
  };

  const isCorrect = selectedIdx === challenge.correctIndex;

  return (
    <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-neon-purple text-3xl">extension</span>
        <h3 className="text-2xl font-bold text-white">Try It Yourself</h3>
      </div>
      
      <p className="text-xl text-gray-300 mb-6">{challenge.question}</p>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {challenge.options.map((opt, idx) => {
          let btnClass = "px-6 py-3 rounded-xl border font-medium transition-all ";
          
          if (!showResult) {
            btnClass += "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white";
          } else {
            if (idx === challenge.correctIndex) {
              btnClass += "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
            } else if (idx === selectedIdx) {
              btnClass += "bg-red-500/20 border-red-500 text-red-400";
            } else {
              btnClass += "border-white/10 text-gray-500 opacity-50";
            }
          }

          return (
            <button 
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={btnClass}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-4 rounded-xl flex gap-4 animate-fade-in-up ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <span className={`material-symbols-outlined text-3xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'check_circle' : 'cancel'}
          </span>
          <p className="text-lg text-gray-200">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}
