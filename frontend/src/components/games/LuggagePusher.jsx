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
  // 1
  [
    "  ###  ",
    "  #.#  ",
    "  #$#  ",
    "### @##",
    "#.#$  #",
    "#     #",
    "#######"
  ],
  // 2
  [
    "#####",
    "#@  #",
    "# $ #",
    "# .$#",
    "###.#",
    "  ###"
  ],
  // 3
  [
    "  ####",
    "###  #",
    "#    #",
    "# #$ #",
    "# . .#",
    "#  $@#",
    "######"
  ],
  // 4
  [
    " #### ",
    " #  # ",
    " #$ # ",
    "##$ ##",
    "# .. #",
    "# @  #",
    "######"
  ],
  // 5
  [
    " ######",
    " #    #",
    " # #$ #",
    " # .. #",
    " # $# #",
    " # @  #",
    " ######"
  ],
  // 6
  [
    "  ####",
    "###  #",
    "#  $ #",
    "#  # #",
    "## . #",
    " # @ #",
    " #####"
  ],
  // 7
  [
    "#######",
    "#     #",
    "# .$. #",
    "## $ ##",
    " # @ # ",
    " ##### "
  ],
  // 8
  [
    " ##### ",
    " #   ##",
    " # $  #",
    "##  $ #",
    "# . . #",
    "#  @  #",
    "#######"
  ],
  // 9
  [
    "  #####",
    "  #   #",
    "### $ #",
    "#  $  #",
    "# . . #",
    "### @ #",
    "  #####"
  ],
  // 10
  [
    "#######",
    "# . . #",
    "#  $  #",
    "## $ ##",
    " # @ # ",
    " ##### "
  ]
];

export default function LuggagePusher({ onComplete, onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [board, setBoard] = useState([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [won, setWon] = useState(false);

  // Initialize level
  useEffect(() => {
    // Loop back to level 0 if we exceed bounds
    const safeIdx = levelIdx % LEVELS.length;
    const raw = LEVELS[safeIdx];
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

    // Boundary check
    if (r1 < 0 || r1 >= board.length || c1 < 0 || c1 >= board[r1].length) return;

    const nextCell = newBoard[r1][c1];

    if (nextCell === ' ' || nextCell === '.') {
      moved = true;
    } else if (nextCell === '$' || nextCell === '*') {
      if (r2 < 0 || r2 >= board.length || c2 < 0 || c2 >= board[r2].length) return;
      const beyondCell = newBoard[r2][c2];
      if (beyondCell === ' ' || beyondCell === '.') {
        newBoard[r1][c1] = nextCell === '*' ? '.' : ' '; 
        newBoard[r2][c2] = beyondCell === '.' ? '*' : '$'; 
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
          allBoxesOnTargets = false; 
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
          // Force remount/reload of current level state
          setLevelIdx(prev => prev);
          // Small hack: if state didn't change, force it by resetting board locally to trigger effect?
          // Actually setLevelIdx(prev=>prev) might not trigger useEffect if the primitive value is identical.
          // Better restart mechanism:
          setBoard([]); 
          setTimeout(() => setLevelIdx(prev => prev), 10);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const restartLevel = () => {
    setBoard([]); 
    setTimeout(() => setLevelIdx(prev => prev), 10);
  };

  const nextLevel = () => {
    setLevelIdx(levelIdx + 1);
  };

  if (board.length === 0) return null;

  const cols = board.length > 0 ? Math.max(...board.map(r => r.length)) : 1;
  const rows = board.length || 1;
  const ratio = cols / rows;

  return (
    <div className="fixed inset-0 pt-24 pb-8 px-4 flex flex-col items-center justify-center bg-slate-950 z-[100] overflow-hidden">
      <button 
        onClick={onBack}
        className="absolute top-24 left-6 p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-lg z-[110]"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h2 className="text-4xl font-bold text-white mb-2 mt-4">Luggage Loader (Level {(levelIdx % LEVELS.length) + 1})</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4 text-center max-w-xl flex flex-col items-center relative">
        <button onClick={restartLevel} className="absolute right-4 top-4 p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-slate-500 transition-all" title="Restart Level">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
        <p className="text-slate-300 font-medium">How to play:</p>
        <p className="text-slate-400 text-sm mt-1">1. Use <strong className="text-white">Arrow Keys</strong> or <strong className="text-white">WASD</strong> to move.</p>
        <p className="text-slate-400 text-sm">2. Push all the <strong className="text-orange-500">Luggage Blocks</strong> onto the <strong className="text-blue-500">Blue Loading Zones</strong>.</p>
        <p className="text-slate-400 text-sm">3. If you get stuck, press <strong className="text-white">'R'</strong> or the refresh button to restart the level!</p>
      </div>

      <div 
        className="w-full mx-auto bg-slate-800 p-2 rounded-xl shadow-inner border border-slate-700 relative"
        style={{ maxWidth: `min(90vw, 55vh * ${ratio})` }}
      >
        <div 
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) => {
            const paddedRow = [...row];
            while (paddedRow.length < cols) paddedRow.push(' ');
            
            return paddedRow.map((cell, c) => {
              const isPlayerHere = playerPos.r === r && playerPos.c === c;
              return (
                <div key={`${r}-${c}`} className="w-full aspect-square flex items-center justify-center relative">
                  {/* Floor / Wall / Target */}
                  {cell === '#' && <div className="w-full h-full bg-slate-600 rounded-[10%] border border-slate-700 shadow-sm" />}
                  {(cell === ' ' || cell === '.') && <div className="w-full h-full bg-slate-800 rounded-[10%]" />}
                  {cell === '.' && <MapPin className="absolute w-[60%] h-[60%] text-blue-500/50" />}
                  
                  {/* Box overlays */}
                  {(cell === '$' || cell === '*') && (
                    <motion.div 
                      layoutId={`box-${r}-${c}`}
                      className={`absolute inset-[10%] rounded-md flex items-center justify-center shadow-lg transition-colors z-10 ${cell === '*' ? 'bg-green-500' : 'bg-orange-500'}`}
                    >
                      <Briefcase className={`w-[70%] h-[70%] ${cell === '*' ? 'text-white' : 'text-orange-900'}`} />
                    </motion.div>
                  )}

                  {/* Player overlay */}
                  {isPlayerHere && (
                    <motion.div
                      layoutId="player"
                      className="absolute inset-[10%] flex items-center justify-center z-20"
                    >
                      <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                         <User className="w-[60%] h-[60%] text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            });
          })}
        </div>
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
            Next Level
          </button>
        </motion.div>
      )}
    </div>
  );
}
