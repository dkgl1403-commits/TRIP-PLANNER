import React, { useState, useEffect } from 'react';
import DotsAndBoxes from './games/DotsAndBoxes';

export default function GamesDashboard({ user, onBack }) {
  const [activeGame, setActiveGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${window.location.protocol}//${window.location.host}/api/games/leaderboard/dots_and_boxes`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (e) {
        console.error("Failed to load leaderboard", e);
      }
    };
    fetchLeaderboard();
  }, [activeGame]); // Refetch when returning from a game

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

      {/* Global Leaderboard */}
      <div className="max-w-6xl mx-auto w-full mt-12">
        <h2 className="font-display-lg text-3xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-warning">trophy</span>
          Global Leaderboard (Dots & Boxes)
        </h2>
        
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass">
          {leaderboard.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8">No games played yet. Be the first to win!</p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-glass-stroke text-on-surface-variant font-title-sm uppercase tracking-wider mb-2">
                <div className="col-span-2 text-center">Rank</div>
                <div className="col-span-6">Player ID</div>
                <div className="col-span-4 text-center">Total Wins</div>
              </div>
              
              {leaderboard.map((entry, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-xl items-center transition-all ${
                    index === 0 ? 'bg-gradient-to-r from-warning/20 to-transparent border border-warning/30' :
                    index === 1 ? 'bg-gradient-to-r from-on-surface-variant/20 to-transparent border border-on-surface-variant/30' :
                    index === 2 ? 'bg-gradient-to-r from-error/20 to-transparent border border-error/30' :
                    'bg-glass-fill border border-glass-stroke hover:bg-glass-fill/80'
                  }`}
                >
                  <div className="col-span-2 text-center font-display-lg text-2xl font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="col-span-6 font-title-md font-bold text-on-surface">
                    {entry.player_id}
                    {user && user.login_id === entry.player_id && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">You</span>}
                  </div>
                  <div className="col-span-4 text-center font-display-lg text-xl text-primary font-bold">
                    {entry.wins}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
