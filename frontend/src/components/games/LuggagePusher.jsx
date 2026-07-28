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
  // 1 (Actual Correct Microban Level 1)
  [
    "  ####   ",
    "###  ####",
    "#     $ #",
    "# #  #$ #",
    "# . .#@ #",
    "#########"
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

  const [won, setWon] = useState(false);
  const [levelIdx, setLevelIdx] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedLevel, setSavedLevel] = useState(0);

  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u.login_id || u.id || 'Guest';
      } catch(e) {}
    }
    return 'Guest';
  };

  const saveProgress = (levelToSave) => {
    fetch(`/api/games/progress/luggage_loader/${getUserId()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: levelToSave })
    }).catch(err => console.error("Error saving progress:", err));
  };

  // Load progress on mount
  useEffect(() => {
    fetch(`/api/games/progress/luggage_loader/${getUserId()}`)
      .then(res => res.json())
      .then(data => {
        if (data.level > 0) {
          setSavedLevel(data.level);
          setShowResumePrompt(true);
        }
      })
      .catch(err => console.error("Error loading progress:", err));
  }, []);

  // Initialize level
  useEffect(() => {
    // Loop back to level 0 if we exceed bounds
    const safeIdx = levelIdx % LEVELS.length;
    const raw = LEVELS[safeIdx];
    
    // Parse raw level
    const parsedBoard = [];
    let pPos = { r: 0, c: 0 };
    
    for (let r = 0; r < raw.length; r++) {
      const row = [];
      for (let c = 0; c < raw[r].length; c++) {
        const char = raw[r][c];
        if (char === '@') {
          pPos = { r, c };
          row.push(' ');
        } else if (char === '+') {
          pPos = { r, c };
          row.push('.');
        } else {
          row.push(char);
        }
      }
      parsedBoard.push(row);
    }
    setBoard(parsedBoard);
    setPlayerPos(pPos);
    setWon(false);
  }, [levelIdx, restartKey]);

  useEffect(() => {
    if (board.length === 0) return;
    let isWon = true;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === '.') isWon = false;
        if (board[r][c] === '$') isWon = false; 
      }
    }
    if (isWon && board.length > 0) {
      setWon(true);
      const nextIdx = levelIdx + 1;
      saveProgress(nextIdx);
    }
  }, [board]);

  const restartLevel = () => {
    setRestartKey(k => k + 1);
  };

  const movePlayer = (dr, dc) => {
    if (won) return;
    const newR = playerPos.r + dr;
    const newC = playerPos.c + dc;
    
    const cell = board[newR][newC];
    
    if (cell === '#') return;
    
    if (cell === '$' || cell === '*') {
      const pushR = newR + dr;
      const pushC = newC + dc;
      const pushCell = board[pushR][pushC];
      
      if (pushCell === ' ' || pushCell === '.') {
        const newBoard = board.map(row => [...row]);
        newBoard[newR][newC] = cell === '*' ? '.' : ' ';
        newBoard[pushR][pushC] = pushCell === '.' ? '*' : '$';
        
        setBoard(newBoard);
        setPlayerPos({ r: newR, c: newC });
      }
    } else {
      setPlayerPos({ r: newR, c: newC });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (won || showResumePrompt) return;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(-1, 0); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(1, 0); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(0, -1); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(0, 1); break;
        case 'r': case 'R': restartLevel(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, board, won, showResumePrompt, movePlayer]);

  if (showResumePrompt) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center max-w-sm w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Saved Progress Found</h2>
          <p className="text-slate-300 mb-8">Do you want to resume from Level {(savedLevel % LEVELS.length) + 1} or start over?</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => { setLevelIdx(savedLevel); setShowResumePrompt(false); }} 
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg shadow-blue-500/20"
            >
              Resume Level {(savedLevel % LEVELS.length) + 1}
            </button>
            <button 
              onClick={() => { setLevelIdx(0); setShowResumePrompt(false); saveProgress(0); }} 
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition"
            >
              Start from Level 1
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (board.length === 0) return null;

  const cols = board.length > 0 ? Math.max(...board.map(r => r.length)) : 1;
  const rows = board.length || 1;
  const ratio = cols / rows;

  return (
    <div className="fixed inset-0 pt-16 pb-4 px-2 flex flex-col items-center justify-center bg-slate-950 z-[100] overflow-hidden">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-lg z-[110]"
      >
        <span className="material-symbols-outlined text-lg sm:text-2xl">arrow_back</span>
      </button>

      <div className="w-full flex flex-col items-center max-w-3xl shrink-0 mt-4 sm:mt-0">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Luggage Loader (Level {(levelIdx % LEVELS.length) + 1})</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 sm:p-3 mb-2 w-full max-w-lg flex items-center justify-center relative text-xs sm:text-sm">
          <p className="text-slate-400 text-center px-8">Push <strong className="text-orange-500">Luggage</strong> onto <strong className="text-blue-500">Targets</strong>. Stuck? Press <strong className="text-white">'R'</strong> or the Refresh button.</p>
          <button onClick={restartLevel} className="absolute right-2 p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-slate-500 transition-all" title="Restart Level">
            <span className="material-symbols-outlined text-sm sm:text-base block">refresh</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col landscape:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full min-h-0 flex-1">
        <div 
          className="w-full max-w-[min(90vw,50vh)] landscape:max-w-[min(60vw,65vh)] bg-slate-800 p-1.5 sm:p-2 rounded-xl shadow-inner border border-slate-700 relative shrink-0 mx-auto"
          style={{ aspectRatio: ratio }}
        >
          <div 
            className="grid gap-0.5 w-full h-full"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {board.map((row, r) => {
              const paddedRow = [...row];
              while (paddedRow.length < cols) paddedRow.push(' ');
              
              return paddedRow.map((cell, c) => {
                const isPlayerHere = playerPos.r === r && playerPos.c === c;
                return (
                  <div key={`${r}-${c}`} className="w-full h-full flex items-center justify-center relative">
                    {cell === '#' && <div className="w-full h-full bg-slate-600 rounded-[10%] border border-slate-700 shadow-sm" />}
                    {(cell === ' ' || cell === '.') && <div className="w-full h-full bg-slate-800 rounded-[10%]" />}
                    {cell === '.' && <MapPin className="absolute w-[60%] h-[60%] text-blue-500/50" />}
                    
                    {(cell === '$' || cell === '*') && (
                      <motion.div 
                        layoutId={`box-${r}-${c}`}
                        className={`absolute inset-[10%] rounded-md flex items-center justify-center shadow-lg transition-colors z-10 ${cell === '*' ? 'bg-green-500' : 'bg-orange-500'}`}
                      >
                        <Briefcase className={`w-[70%] h-[70%] ${cell === '*' ? 'text-white' : 'text-orange-900'}`} />
                      </motion.div>
                    )}

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

        <div className="flex flex-col items-center gap-1 sm:gap-2 lg:hidden shrink-0 pb-4 landscape:pb-0">
          <button 
            onClick={() => movePlayer(-1, 0)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-700 active:bg-slate-600 active:border-blue-500 transition shadow-lg"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_drop_up</span>
          </button>
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => movePlayer(0, -1)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-700 active:bg-slate-600 active:border-blue-500 transition shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_left</span>
            </button>
            <button 
              onClick={() => movePlayer(1, 0)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-700 active:bg-slate-600 active:border-blue-500 transition shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_drop_down</span>
            </button>
            <button 
              onClick={() => movePlayer(0, 1)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-700 active:bg-slate-600 active:border-blue-500 transition shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_right</span>
            </button>
          </div>
        </div>
      </div>

      {won && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl border border-green-500/50 m-4"
        >
          <h3 className="text-5xl font-black text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">LEVEL CLEARED!</h3>
          <button 
            onClick={() => setLevelIdx(levelIdx + 1)}
            className="px-8 py-4 bg-green-500 text-white font-bold text-xl rounded-xl hover:bg-green-400 transition shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            Next Level
          </button>
        </motion.div>
      )}
    </div>
  );
}
