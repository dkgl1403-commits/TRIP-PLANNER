import React, { useState } from 'react';
import DotsAndBoxes from './games/DotsAndBoxes';

export default function GamesDashboard({ onBack }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'dots') {
    return <DotsAndBoxes onBack={() => setActiveGame(null)} />;
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
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-neon-coral/20 hover:border-neon-coral/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('dots')}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-coral/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-neon-coral">grid_4x4</span>
          </div>
          <h3 className="font-display-lg text-2xl font-bold mb-2 group-hover:text-neon-coral transition-colors">Dots and Boxes</h3>
          <p className="text-on-surface-variant text-sm mb-4 flex-grow">
            The global classic. Connect the dots to claim the most boxes.
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">Local Multiplayer</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-neon-coral transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="bg-surface-container/50 border border-glass-stroke/50 rounded-3xl p-6 shadow-glass opacity-70 flex flex-col h-full">
          <div className="w-16 h-16 rounded-2xl bg-glass-fill flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">local_fire_department</span>
          </div>
          <h3 className="font-display-lg text-2xl font-bold mb-2">FLAMES</h3>
          <p className="text-on-surface-variant text-sm mb-4 flex-grow">
            The classic Indian relationship prediction game based on name letters.
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke/50">
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 bg-glass-fill rounded-md">Coming Soon</span>
          </div>
        </div>

        <div className="bg-surface-container/50 border border-glass-stroke/50 rounded-3xl p-6 shadow-glass opacity-70 flex flex-col h-full">
          <div className="w-16 h-16 rounded-2xl bg-glass-fill flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">close</span>
          </div>
          <h3 className="font-display-lg text-2xl font-bold mb-2">Zero Kata</h3>
          <p className="text-on-surface-variant text-sm mb-4 flex-grow">
            The universal 3x3 grid game of Xs and Os (Tic-Tac-Toe).
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke/50">
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 bg-glass-fill rounded-md">Coming Soon</span>
          </div>
        </div>

      </div>
    </div>
  );
}
