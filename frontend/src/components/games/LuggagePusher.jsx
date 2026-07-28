import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, MapPin } from 'lucide-react';

// Symbols:
// ' ' : Floor
// '#' : Wall
// '.' : Target (Loading Zone)
// '$' : Box (Luggage)
// '@' : Player
// '*' : Box on Target
// '+' : Player on Target

const LEVELS = [
  [
    "  ###  ",
    "  #.#  ",
    "  #$#  ",
    "### @##",
    "#.#$  #",
    "#     #",
    "#######"
  ],
  [
    "#####",
    "#@  #",
    "# $ #",
    "# .$#",
    "###.#",
    "  ###"
  ],
  [
    "  ####",
    "###  #",
    "#    #",
    "# #$ #",
    "# . .#",
    "#  $@#",
    "######"
  ]
];

export default function LuggagePusher({ onComplete }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [board, setBoard] = useState([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [won, setWon] = useState(false);

  // Initialize level
  useEffect(() => {
    const raw = LEVELS[levelIdx];
    const newBoard = [];
    let pr = 0, pc = 0;
    
    for (let r = 0; r < raw.length; r++) {
      const row = [];
      for (let c = 0; c < raw[r].length; c++) {
        const char = raw[r][c];
        if (char === '@' || char === '+') {
          pr = r;
          pc = c;
          row.push(char === '+' ? '.' : ' '); // the board stores background, player is overlay
        } else {
          row.push(char);
        }
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setPlayerPos({ r: pr, c: pc });
    setWon(false);
  }, [levelIdx]);

  const movePlayer = useCallback((dr, dc) => {
    if (won || board.length === 0) return;

    const r1 = playerPos.r + dr;
    const c1 = playerPos.c + dc;
    const r2 = playerPos.r + dr * 2;
    const c2 = playerPos.c + dc * 2;

    const newBoard = board.map(row => [...row]);
    let moved = false;

    // Check what is in the next cell
    const nextCell = newBoard[r1][c1];

    if (nextCell === ' ' || nextCell === '.') {
      // Free to move
      moved = true;
    } else if (nextCell === '$' || nextCell === '*') {
      // It's a box, can we push it?
      const beyondCell = newBoard[r2][c2];
      if (beyondCell === ' ' || beyondCell === '.') {
        // Yes, push it
        newBoard[r1][c1] = nextCell === '*' ? '.' : ' '; // Remove box from r1,c1
        newBoard[r2][c2] = beyondCell === '.' ? '*' : '$'; // Place box at r2,c2
        moved = true;
      }
    }

    if (moved) {
      setBoard(newBoard);
      setPlayerPos({ r: r1, c: c1 });
      checkWin(newBoard);
    }
  }, [board, playerPos, won]);

  const checkWin = (currentBoard) => {
    let allBoxesOnTargets = true;
    let boxFound = false;

    for (let r = 0; r < currentBoard.length; r++) {
      for (let c = 0; c < currentBoard[r].length; c++) {
        if (currentBoard[r][c] === '$') {
          allBoxesOnTargets = false; // A box is not on a target
        }
        if (currentBoard[r][c] === '*' || currentBoard[r][c] === '$') {
          boxFound = true;
        }
      }
    }

    if (boxFound && allBoxesOnTargets) {
      setWon(true);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(-1, 0);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(1, 0);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(0, -1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(0, 1);
          break;
        case 'r':
        case 'R':
          // Restart level trigger (hacky way: just toggle state to force rerender)
          setLevelIdx(prev => prev); 
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const nextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  if (board.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden">
      <h2 className="text-3xl font-bold text-white mb-2">Luggage Loader</h2>
      <p className="text-slate-400 mb-8">Use arrow keys or WASD to push all luggage (<Briefcase className="inline w-4 h-4 text-orange-400"/>) onto the loading zones (<MapPin className="inline w-4 h-4 text-blue-400"/>). Press 'R' to restart.</p>

      <div className="relative bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-700">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isPlayerHere = playerPos.r === r && playerPos.c === c;
              return (
                <div key={`${r}-${c}`} className="w-12 h-12 flex items-center justify-center relative">
                  {/* Floor / Wall / Target */}
                  {cell === '#' && <div className="w-full h-full bg-slate-600 rounded-sm border-2 border-slate-700" />}
                  {(cell === ' ' || cell === '.') && <div className="w-full h-full bg-slate-800 rounded-sm" />}
                  {cell === '.' && <MapPin className="absolute w-6 h-6 text-blue-500/50" />}
                  
                  {/* Box overlays */}
                  {(cell === '$' || cell === '*') && (
                    <motion.div 
                      layoutId={`box-${r}-${c}`}
                      className={`absolute inset-1 rounded-md flex items-center justify-center shadow-lg transition-colors z-10 ${cell === '*' ? 'bg-green-500' : 'bg-orange-500'}`}
                    >
                      <Briefcase className={`w-6 h-6 ${cell === '*' ? 'text-white' : 'text-orange-900'}`} />
                    </motion.div>
                  )}

                  {/* Player overlay */}
                  {isPlayerHere && (
                    <motion.div
                      layoutId="player"
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                         <User className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {won && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-10 bg-green-500/20 backdrop-blur-md border border-green-500 text-green-400 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(34,197,94,0.3)] z-50"
        >
          <h3 className="text-2xl font-bold mb-4">All Luggage Loaded!</h3>
          <button 
            onClick={nextLevel}
            className="px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition shadow-lg"
          >
            {levelIdx < LEVELS.length - 1 ? 'Next Level' : 'Finish Game'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
