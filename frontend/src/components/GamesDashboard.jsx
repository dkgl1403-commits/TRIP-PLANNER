import React, { useState, useEffect } from 'react';
import DotsAndBoxes from './games/DotsAndBoxes';

export default function GamesDashboard({ user, onBack }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'dots') {
    return <DotsAndBoxes user={user} onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Classic Games</h1>
          <p className="font-label-md text-on-surface-variant">A collection of paper-and-pencil classics from around the world.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Dots and Boxes Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-neon-coral/20 hover:border-neon-coral/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('dots')}>
          {/* Watermark Background */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform rotate-12 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
              <circle cx="50" cy="20" r="4" fill="currentColor"/>
              <circle cx="80" cy="20" r="4" fill="currentColor"/>
              <circle cx="20" cy="50" r="4" fill="currentColor"/>
              <circle cx="50" cy="50" r="4" fill="currentColor"/>
              <circle cx="80" cy="50" r="4" fill="currentColor"/>
              <circle cx="20" cy="80" r="4" fill="currentColor"/>
              <circle cx="50" cy="80" r="4" fill="currentColor"/>
              <circle cx="80" cy="80" r="4" fill="currentColor"/>
              <line x1="20" y1="20" x2="50" y2="20" stroke="currentColor" strokeWidth="3"/>
              <line x1="20" y1="20" x2="20" y2="50" stroke="currentColor" strokeWidth="3"/>
              <line x1="20" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="3"/>
              <line x1="50" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="3"/>
              <rect x="25" y="25" width="20" height="20" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-coral/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-neon-coral">grid_4x4</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-neon-coral transition-colors">Dots and Boxes</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            The global classic. Connect the dots to claim the most boxes.
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">Local Multiplayer</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-neon-coral transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="relative overflow-hidden bg-surface-container/50 border border-glass-stroke/50 rounded-3xl p-6 shadow-glass opacity-70 flex flex-col h-full group">
          {/* Watermark Background */}
          <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 scale-150">
            <h1 className="font-display-lg font-black text-[120px] leading-none tracking-widest text-on-surface">FLAMES</h1>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-glass-fill flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">local_fire_department</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2">FLAMES</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            The classic Indian relationship prediction game based on name letters.
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke/50">
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 bg-glass-fill rounded-md">Coming Soon</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-surface-container/50 border border-glass-stroke/50 rounded-3xl p-6 shadow-glass opacity-70 flex flex-col h-full group">
          {/* Watermark Background */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform rotate-12 scale-125">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <line x1="33" y1="10" x2="33" y2="90" stroke="currentColor" strokeWidth="4"/>
              <line x1="66" y1="10" x2="66" y2="90" stroke="currentColor" strokeWidth="4"/>
              <line x1="10" y1="33" x2="90" y2="33" stroke="currentColor" strokeWidth="4"/>
              <line x1="10" y1="66" x2="90" y2="66" stroke="currentColor" strokeWidth="4"/>
              
              <line x1="15" y1="15" x2="28" y2="28" stroke="currentColor" strokeWidth="4"/>
              <line x1="28" y1="15" x2="15" y2="28" stroke="currentColor" strokeWidth="4"/>

              <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            </svg>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-glass-fill flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">close</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2">Zero Kata</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            The universal 3x3 grid game of Xs and Os (Tic-Tac-Toe).
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke/50">
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 bg-glass-fill rounded-md">Coming Soon</span>
          </div>
        </div>

      </div>
    </div>
  );
}
