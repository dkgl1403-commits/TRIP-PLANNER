import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Types of tiles based on connections [Top, Right, Bottom, Left]
const TILE_TYPES = {
  EMPTY: [0, 0, 0, 0],
  LINE: [1, 0, 1, 0],
  CORNER: [1, 1, 0, 0],
  T: [1, 1, 1, 0],
  CROSS: [1, 1, 1, 1],
  START: [0, 1, 0, 0], // Fixed on left edge
  END: [0, 0, 0, 1]    // Fixed on right edge
};

// 3 Hardcoded Levels to ensure they are always solvable
const LEVELS = [
  {
    rows: 4, cols: 4,
    start: [1, 0], end: [2, 3],
    grid: [
      ['CORNER', 'LINE', 'CORNER', 'EMPTY'],
      ['START',  'EMPTY', 'LINE',  'CORNER'],
      ['CORNER', 'CORNER', 'CORNER', 'END'],
      ['EMPTY',  'CORNER', 'LINE',   'CORNER']
    ],
    // Correct rotations needed to solve (0=0deg, 1=90deg, 2=180deg, 3=270deg)
    solution: [
      [1, 1, 2, 0],
      [0, 0, 0, 3],
      [0, 2, 1, 0],
      [0, 0, 1, 3]
    ]
  },
  {
    rows: 5, cols: 5,
    start: [0, 0], end: [4, 4],
    grid: [
      ['START', 'LINE', 'CORNER', 'EMPTY', 'EMPTY'],
      ['CORNER', 'CORNER', 'LINE', 'CORNER', 'EMPTY'],
      ['LINE', 'EMPTY', 'CORNER', 'CORNER', 'EMPTY'],
      ['CORNER', 'CORNER', 'CORNER', 'LINE', 'CORNER'],
      ['EMPTY', 'CORNER', 'LINE', 'CORNER', 'END']
    ],
    solution: [
      [1, 1, 2, 0, 0],
      [1, 2, 0, 3, 0],
      [0, 0, 1, 3, 0],
      [0, 2, 0, 1, 3],
      [0, 0, 1, 2, 0]
    ]
  }
];

function rotateTile(type, rotations) {
  let [t, r, b, l] = TILE_TYPES[type];
  for (let i = 0; i < (rotations % 4); i++) {
    const temp = t;
    t = l; l = b; b = r; r = temp;
  }
  return [t, r, b, l];
}

export default function RoutePuzzle({ onComplete, onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [grid, setGrid] = useState([]);
  const [rotations, setRotations] = useState([]);
  const [powered, setPowered] = useState([]);
  const [won, setWon] = useState(false);

  const level = LEVELS[levelIdx];

  useEffect(() => {
    initLevel();
  }, [levelIdx]);

  const initLevel = () => {
    const initialRots = [];
    for (let r = 0; r < level.rows; r++) {
      let row = [];
      for (let c = 0; c < level.cols; c++) {
        // Random rotation, except for START and END which are fixed (0)
        const type = level.grid[r][c];
        if (type === 'START' || type === 'END' || type === 'EMPTY') {
          row.push(0);
        } else {
          row.push(Math.floor(Math.random() * 4));
        }
      }
      initialRots.push(row);
    }
    setRotations(initialRots);
    setWon(false);
    updatePower(initialRots);
  };

  const updatePower = (currentRots) => {
    // Flood fill from start
    const pGrid = Array(level.rows).fill(null).map(() => Array(level.cols).fill(false));
    const queue = [[level.start[0], level.start[1]]];
    pGrid[level.start[0]][level.start[1]] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const currentType = level.grid[r][c];
      const currentConn = rotateTile(currentType, currentRots[r][c]);

      // Check adjacent tiles
      const neighbors = [
        [r - 1, c, 0, 2], // Top (requires current Top, neighbor Bottom)
        [r, c + 1, 1, 3], // Right
        [r + 1, c, 2, 0], // Bottom
        [r, c - 1, 3, 1]  // Left
      ];

      for (let [nr, nc, dir, opp] of neighbors) {
        if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) {
          if (!pGrid[nr][nc]) {
            const neighborType = level.grid[nr][nc];
            const neighborConn = rotateTile(neighborType, currentRots[nr][nc]);
            // If current connects outward AND neighbor connects inward
            if (currentConn[dir] === 1 && neighborConn[opp] === 1) {
              pGrid[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    setPowered(pGrid);

    // Check Win
    if (pGrid[level.end[0]][level.end[1]]) {
      setWon(true);
    }
  };

  const handleTileClick = (r, c) => {
    if (won) return;
    const type = level.grid[r][c];
    if (type === 'START' || type === 'END' || type === 'EMPTY') return;

    const newRots = [...rotations];
    newRots[r] = [...rotations[r]];
    newRots[r][c] = (newRots[r][c] + 1) % 4;
    setRotations(newRots);
    updatePower(newRots);
  };

  const nextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(levelIdx + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const renderSVG = (type, isPowered) => {
    const color = isPowered ? '#00ffaa' : '#334155';
    const glow = isPowered ? 'drop-shadow(0 0 5px #00ffaa)' : 'none';
    
    if (type === 'EMPTY') return null;
    
    // Draw paths relative to center (50, 50) in a 100x100 viewBox
    let paths = [];
    if (type === 'START') {
      paths.push(<circle key="s" cx="50" cy="50" r="20" fill={color} style={{filter: glow}} />);
      paths.push(<line key="l" x1="50" y1="50" x2="100" y2="50" stroke={color} strokeWidth="15" strokeLinecap="round" style={{filter: glow}} />);
    } else if (type === 'END') {
      paths.push(<rect key="e" x="30" y="30" width="40" height="40" fill={color} style={{filter: glow}} />);
      paths.push(<line key="l" x1="0" y1="50" x2="50" y2="50" stroke={color} strokeWidth="15" strokeLinecap="round" style={{filter: glow}} />);
    } else {
      // Basic lines
      const [t, r, b, l] = TILE_TYPES[type];
      paths.push(<circle key="c" cx="50" cy="50" r="10" fill={color} style={{filter: glow}} />);
      if (t) paths.push(<line key="t" x1="50" y1="0" x2="50" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (r) paths.push(<line key="r" x1="50" y1="50" x2="100" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (b) paths.push(<line key="b" x1="50" y1="50" x2="50" y2="100" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (l) paths.push(<line key="l" x1="0" y1="50" x2="50" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
    }

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {paths}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 pt-24 pb-8 px-4 flex flex-col items-center justify-center bg-slate-950 z-[100] overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-24 left-6 p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-[#00ffaa] hover:border-[#00ffaa]/50 transition-all shadow-lg z-[110]"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h2 className="text-4xl font-bold text-white mb-2 mt-4">Route Planner</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-8 text-center max-w-xl">
        <p className="text-slate-300 font-medium">How to play:</p>
        <p className="text-slate-400 text-sm mt-1">1. Click the grey tiles to rotate them 90 degrees.</p>
        <p className="text-slate-400 text-sm">2. Build an unbroken path from the <strong className="text-[#00ffaa]">Home (Circle)</strong> to the <strong className="text-[#00ffaa]">Destination (Square)</strong>.</p>
        <p className="text-slate-400 text-sm">3. Connected paths will glow neon green!</p>
      </div>

      {rotations.length > 0 && (
        <div 
          className="grid gap-1 p-2 bg-slate-800 rounded-lg shadow-inner"
          style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
        >
          {level.grid.map((row, r) => (
            row.map((type, c) => {
              const isPowered = powered[r] && powered[r][c];
              const rot = rotations[r][c] * 90;
              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-md cursor-pointer transition-colors ${type !== 'EMPTY' ? 'bg-slate-900 hover:bg-slate-700' : 'bg-transparent'}`}
                >
                  <motion.div
                    animate={{ rotate: rot }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full h-full"
                  >
                    {renderSVG(type, isPowered)}
                  </motion.div>
                </div>
              );
            })
          ))}
        </div>
      )}

      {won && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-10 bg-green-500/20 backdrop-blur-md border border-green-500 text-green-400 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
          <h3 className="text-2xl font-bold mb-4">Route Connected!</h3>
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
