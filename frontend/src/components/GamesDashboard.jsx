import React, { useState, useEffect } from 'react';
import DotsAndBoxes from './games/DotsAndBoxes';
import ZeroKata from './games/ZeroKata';
import SnakeLadder from './games/SnakeLadder';
import MemoryGame from './games/MemoryGame';
import MazeGame from './games/MazeGame';
import RoutePuzzle from './games/RoutePuzzle';
import LuggagePusher from './games/LuggagePusher';

export default function GamesDashboard({ user, onBack }) {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'dots') {
    return <DotsAndBoxes user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'zerokata') {
    return <ZeroKata user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'snakeladder') {
    return <SnakeLadder user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'memory') {
    return <MemoryGame user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'maze') {
    return <MazeGame user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'route') {
    return <RoutePuzzle user={user} onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'luggage') {
    return <LuggagePusher user={user} onBack={() => setActiveGame(null)} />;
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

        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-primary/20 hover:border-primary/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('zerokata')}>
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

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-primary">close</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Zero Kata</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            The universal 3x3 grid game of Xs and Os (Tic-Tac-Toe).
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">Local & Online</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Snake and Ladder Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#F9DC5C]/20 hover:border-[#F9DC5C]/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('snakeladder')}>
          {/* Watermark Background */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <path d="M10,90 Q40,40 50,70 T90,20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="90" cy="20" r="4" fill="currentColor"/>
              
              <line x1="20" y1="20" x2="30" y2="80" stroke="currentColor" strokeWidth="4"/>
              <line x1="40" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="4"/>
              <line x1="22" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="3"/>
              <line x1="25" y1="50" x2="45" y2="50" stroke="currentColor" strokeWidth="3"/>
              <line x1="28" y1="70" x2="48" y2="70" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F9DC5C]/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-[#F9DC5C]">casino</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-[#F9DC5C] transition-colors">Snake & Ladder</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            The classic race to 100, now with Teleports, Springs, and Jail!
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-[#F9DC5C] px-2 py-1 bg-[#F9DC5C]/10 rounded-md">Local & Online (Up to 5P)</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#F9DC5C] transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Memory Game Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#e74c3c]/20 hover:border-[#e74c3c]/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('memory')}>
          {/* Watermark Background */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
              <circle cx="30" cy="30" r="6" fill="currentColor" />
              <circle cx="70" cy="30" r="6" fill="currentColor" />
              <circle cx="30" cy="70" r="6" fill="currentColor" />
              <circle cx="70" cy="70" r="6" fill="currentColor" />
              <circle cx="50" cy="50" r="6" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e74c3c]/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-[#e74c3c]">psychology</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-[#e74c3c] transition-colors">Memory Chess</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            Test your memory! Pick the peg that matches the color on the dice.
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-[#e74c3c] px-2 py-1 bg-[#e74c3c]/10 rounded-md">Local Multiplayer</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#e74c3c] transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Maze Game Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#22c55e]/20 hover:border-[#22c55e]/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('maze')}>
          {/* Watermark Background */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="6" />
              <line x1="40" y1="20" x2="40" y2="60" stroke="currentColor" strokeWidth="6" />
              <line x1="60" y1="40" x2="60" y2="80" stroke="currentColor" strokeWidth="6" />
              <line x1="20" y1="40" x2="40" y2="40" stroke="currentColor" strokeWidth="6" />
              <line x1="60" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="6" />
            </svg>
          </div>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-[#22c55e]">meeting_room</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-[#22c55e] transition-colors">The Maze</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            Solve math puzzles to navigate a 16-room grid and escape before time runs out.
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-[#22c55e] px-2 py-1 bg-[#22c55e]/10 rounded-md">Single Player</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#22c55e] transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Route Puzzle Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#00ffaa]/20 hover:border-[#00ffaa]/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('route')}>
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform rotate-45 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <line x1="20" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="8"/>
              <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="8"/>
              <circle cx="50" cy="50" r="12" fill="currentColor"/>
            </svg>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ffaa]/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-[#00ffaa]">route</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-[#00ffaa] transition-colors">Route Planner</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            Rotate the path fragments to connect the origin to the destination.
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-[#00ffaa] px-2 py-1 bg-[#00ffaa]/10 rounded-md">Single Player Puzzle</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#00ffaa] transition-colors">arrow_forward</span>
          </div>
        </div>

        {/* Luggage Pusher Card */}
        <div className="relative overflow-hidden bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-orange-500/20 hover:border-orange-500/30 transition-all cursor-pointer group flex flex-col h-full" onClick={() => setActiveGame('luggage')}>
          <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 scale-150">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <rect x="30" y="30" width="40" height="40" stroke="currentColor" strokeWidth="6" fill="none"/>
              <circle cx="50" cy="50" r="10" fill="currentColor"/>
            </svg>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-[#4D9DE0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-orange-500">luggage</span>
          </div>
          <h3 className="relative z-10 font-display-lg text-2xl font-bold mb-2 group-hover:text-orange-500 transition-colors">Luggage Loader</h3>
          <p className="relative z-10 text-on-surface-variant text-sm mb-4 flex-grow">
            A classic Sokoban puzzle. Push the luggage blocks onto the loading zones without getting stuck!
          </p>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-glass-stroke">
            <span className="text-xs font-bold text-orange-500 px-2 py-1 bg-orange-500/10 rounded-md">Single Player Puzzle</span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-orange-500 transition-colors">arrow_forward</span>
          </div>
        </div>

      </div>
    </div>
  );
}
