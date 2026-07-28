import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Connections [Top, Right, Bottom, Left]
const TILE_TYPES = {
  EMPTY: [0, 0, 0, 0],
  LINE: [1, 0, 1, 0],
  CORNER: [1, 1, 0, 0],
  T: [1, 1, 1, 0],
  CROSS: [1, 1, 1, 1],
  START: [0, 1, 0, 0], 
  END: [0, 0, 0, 1]    
};

function rotateTile(type, rotations) {
  let [t, r, b, l] = TILE_TYPES[type];
  for (let i = 0; i < (rotations % 4); i++) {
    const temp = t;
    t = l; l = b; b = r; r = temp;
  }
  return [t, r, b, l];
}

// Procedural Level Generator
function generateLevel(levelIdx) {
  const size = Math.min(10, 4 + Math.floor(levelIdx / 2));
  const rows = size;
  const cols = size;

  const startR = Math.floor(Math.random() * rows);
  const startC = 0;
  
  const endR = Math.floor(Math.random() * rows);
  const endC = cols - 1;

  const pathGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
  const path = [];
  
  let found = false;
  
  function dfs(r, c) {
    if (found) return;
    path.push([r, c]);
    pathGrid[r][c] = 1;
    
    if (r === endR && c === endC) {
      found = true;
      return;
    }
    
    // Bias moving right
    let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    dirs.sort(() => Math.random() - 0.5);
    if (Math.random() < 0.7) {
      // Force right to front
      const rightIdx = dirs.findIndex(d => d[0]===0 && d[1]===1);
      const rightDir = dirs.splice(rightIdx, 1)[0];
      dirs.unshift(rightDir);
    }
    
    for (let [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && pathGrid[nr][nc] === 0) {
        dfs(nr, nc);
        if (found) return;
      }
    }
    
    pathGrid[r][c] = 0;
    path.pop();
  }

  dfs(startR, startC);

  // Now we have the path. Convert to connections.
  const conns = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => [0,0,0,0]));
  
  for (let i = 0; i < path.length; i++) {
    const [r, c] = path[i];
    if (i > 0) {
      const [pr, pc] = path[i-1];
      if (pr === r - 1) { conns[r][c][0] = 1; conns[pr][pc][2] = 1; }
      if (pr === r + 1) { conns[r][c][2] = 1; conns[pr][pc][0] = 1; }
      if (pc === c - 1) { conns[r][c][3] = 1; conns[pr][pc][1] = 1; }
      if (pc === c + 1) { conns[r][c][1] = 1; conns[pr][pc][3] = 1; }
    }
  }

  // Force START and END connections
  conns[startR][startC][3] = 1; // Start comes from left
  conns[endR][endC][1] = 1;     // End goes out right

  const grid = Array(rows).fill(null).map(() => Array(cols).fill('EMPTY'));
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === startR && c === startC) {
        grid[r][c] = 'START';
      } else if (r === endR && c === endC) {
        grid[r][c] = 'END';
      } else if (pathGrid[r][c] === 1) {
        const [t, rt, b, l] = conns[r][c];
        const sum = t + rt + b + l;
        if (sum === 2) {
          if ((t && b) || (l && rt)) grid[r][c] = 'LINE';
          else grid[r][c] = 'CORNER';
        } else if (sum === 3) {
          grid[r][c] = 'T';
        } else if (sum === 4) {
          grid[r][c] = 'CROSS';
        } else {
          grid[r][c] = 'EMPTY';
        }
      } else {
        // Noise
        if (Math.random() < 0.6) {
          const rand = Math.random();
          if (rand < 0.4) grid[r][c] = 'LINE';
          else if (rand < 0.8) grid[r][c] = 'CORNER';
          else grid[r][c] = 'T';
        }
      }
    }
  }

  return { rows, cols, start: [startR, startC], end: [endR, endC], grid };
}

export default function RoutePuzzle({ onComplete, onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [level, setLevel] = useState(null);
  const [rotations, setRotations] = useState([]);
  const [powered, setPowered] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const newLevel = generateLevel(levelIdx);
    setLevel(newLevel);
    
    const initialRots = [];
    for (let r = 0; r < newLevel.rows; r++) {
      let row = [];
      for (let c = 0; c < newLevel.cols; c++) {
        if (newLevel.grid[r][c] === 'EMPTY') {
          row.push(0);
        } else {
          row.push(Math.floor(Math.random() * 4));
        }
      }
      initialRots.push(row);
    }
    
    setRotations(initialRots);
    setWon(false);
    updatePower(initialRots, newLevel);
  }, [levelIdx]);

  const updatePower = (currentRots, currentLevel) => {
    if (!currentLevel) return;
    const pGrid = Array(currentLevel.rows).fill(null).map(() => Array(currentLevel.cols).fill(false));
    const queue = [[currentLevel.start[0], currentLevel.start[1]]];
    pGrid[currentLevel.start[0]][currentLevel.start[1]] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const currentType = currentLevel.grid[r][c];
      const currentConn = rotateTile(currentType, currentRots[r][c]);

      const neighbors = [
        [r - 1, c, 0, 2],
        [r, c + 1, 1, 3],
        [r + 1, c, 2, 0],
        [r, c - 1, 3, 1] 
      ];

      for (let [nr, nc, dir, opp] of neighbors) {
        if (nr >= 0 && nr < currentLevel.rows && nc >= 0 && nc < currentLevel.cols) {
          if (!pGrid[nr][nc]) {
            const neighborType = currentLevel.grid[nr][nc];
            const neighborConn = rotateTile(neighborType, currentRots[nr][nc]);
            if (currentConn[dir] === 1 && neighborConn[opp] === 1) {
              pGrid[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    setPowered(pGrid);

    if (pGrid[currentLevel.end[0]][currentLevel.end[1]]) {
      setWon(true);
    }
  };

  const handleTileClick = (r, c) => {
    if (won || !level) return;
    const type = level.grid[r][c];
    if (type === 'EMPTY') return;

    const newRots = [...rotations];
    newRots[r] = [...rotations[r]];
    newRots[r][c] = (newRots[r][c] + 1) % 4;
    setRotations(newRots);
    updatePower(newRots, level);
  };

  const nextLevel = () => {
    setLevelIdx(levelIdx + 1);
  };

  const renderSVG = (type, isPowered) => {
    const color = isPowered ? '#00ffaa' : '#94a3b8';
    const glow = isPowered ? 'drop-shadow(0 0 5px #00ffaa)' : 'none';
    
    if (type === 'EMPTY') return null;
    
    let paths = [];
    if (type === 'START') {
      paths.push(<circle key="s" cx="50" cy="50" r="20" fill={color} style={{filter: glow}} />);
      paths.push(<line key="l" x1="50" y1="50" x2="100" y2="50" stroke={color} strokeWidth="15" strokeLinecap="round" style={{filter: glow}} />);
    } else if (type === 'END') {
      paths.push(<rect key="e" x="30" y="30" width="40" height="40" fill={color} style={{filter: glow}} />);
      paths.push(<line key="l" x1="0" y1="50" x2="50" y2="50" stroke={color} strokeWidth="15" strokeLinecap="round" style={{filter: glow}} />);
    } else {
      const [t, rt, b, l] = TILE_TYPES[type];
      paths.push(<circle key="c" cx="50" cy="50" r="10" fill={color} style={{filter: glow}} />);
      if (t) paths.push(<line key="t" x1="50" y1="0" x2="50" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (rt) paths.push(<line key="rt" x1="50" y1="50" x2="100" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (b) paths.push(<line key="b" x1="50" y1="50" x2="50" y2="100" stroke={color} strokeWidth="15" style={{filter: glow}} />);
      if (l) paths.push(<line key="l" x1="0" y1="50" x2="50" y2="50" stroke={color} strokeWidth="15" style={{filter: glow}} />);
    }

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {paths}
      </svg>
    );
  };

  if (!level || rotations.length !== level.rows) return null;

  return (
    <div className="fixed inset-0 pt-24 pb-8 px-4 flex flex-col items-center justify-center bg-slate-950 z-[100] overflow-hidden">
      <button 
        onClick={onBack}
        className="absolute top-24 left-6 p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-[#00ffaa] hover:border-[#00ffaa]/50 transition-all shadow-lg z-[110]"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h2 className="text-4xl font-bold text-white mb-2 mt-4">Route Planner (Level {levelIdx + 1})</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4 text-center max-w-xl">
        <p className="text-slate-300 font-medium">How to play:</p>
        <p className="text-slate-400 text-sm mt-1">1. Click the grey tiles to rotate them 90 degrees.</p>
        <p className="text-slate-400 text-sm">2. Build an unbroken path from the <strong className="text-[#00ffaa]">Home (Circle)</strong> to the <strong className="text-[#00ffaa]">Destination (Square)</strong>.</p>
        <p className="text-slate-400 text-sm">3. Connected paths will glow neon green!</p>
      </div>

      <div 
        className="grid gap-1 p-2 bg-slate-800 rounded-lg shadow-inner max-h-[50vh] overflow-auto"
        style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
      >
        {level.grid.map((row, r) => (
          row.map((type, c) => {
            const isPowered = powered[r] && powered[r][c];
            const rot = rotations[r][c] * 90;
            // Responsive tile sizing based on grid size
            const sizeClass = level.cols <= 5 ? "w-16 h-16 sm:w-20 sm:h-20" : level.cols <= 8 ? "w-10 h-10 sm:w-14 sm:h-14" : "w-8 h-8 sm:w-10 sm:h-10";
            return (
              <div 
                key={`${r}-${c}`}
                onClick={() => handleTileClick(r, c)}
                className={`${sizeClass} flex items-center justify-center rounded-md cursor-pointer transition-colors ${type !== 'EMPTY' ? 'bg-slate-900 hover:bg-slate-700' : 'bg-transparent'}`}
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

      {won && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-10 bg-green-500/20 backdrop-blur-md border border-green-500 text-green-400 p-6 rounded-xl text-center shadow-[0_0_30px_rgba(34,197,94,0.3)] z-50"
        >
          <h3 className="text-2xl font-bold mb-4">Route Connected!</h3>
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
