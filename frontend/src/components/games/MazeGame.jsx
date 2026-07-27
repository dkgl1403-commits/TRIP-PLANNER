import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useCursor, ContactShadows, Text, RoundedBox, Html } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// --- GAME LOGIC SCALING ---
// We will have a 4x4 grid of rooms (16 rooms total).
// Let's build a basic shell for the game.

export default function MazeGame({ user, onBack }) {
  const [gameState, setGameState] = useState('menu'); // menu, playing, game_over, won
  
  return (
    <div className="relative w-full h-full bg-[#0a0a0f] overflow-hidden font-mono text-green-400">
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all backdrop-blur-md"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        {gameState === 'playing' && (
          <div className="flex gap-6 pointer-events-auto">
            <div className="bg-black/50 border border-green-500/30 rounded-xl px-4 py-2 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs text-green-500/70 uppercase tracking-widest">Time Remaining</span>
              <span className="text-2xl font-bold">01:00</span>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-xl px-4 py-2 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs text-green-500/70 uppercase tracking-widest">Moves Left</span>
              <span className="text-2xl font-bold">15</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-black/60 border border-green-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)] text-center">
            <span className="material-symbols-outlined text-6xl text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">meeting_room</span>
            <h2 className="text-4xl font-bold text-green-400 mb-2 uppercase tracking-widest">The Maze</h2>
            <p className="text-green-500/70 mb-8">
              Navigate a 16-room grid. Solve the terminal math puzzle to find the correct door. Walk through wrong doors and lose 10 seconds. You have 15 moves to escape.
            </p>
            <button 
              onClick={() => setGameState('playing')}
              className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500 text-green-400 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              Enter The Maze
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
