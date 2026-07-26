import React, { useState, useEffect } from 'react';

const GRID_SIZE = 4; // 4x4 boxes means 5x5 dots

export default function DotsAndBoxes({ onBack }) {
  const [hLines, setHLines] = useState(Array(GRID_SIZE + 1).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [vLines, setVLines] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE + 1).fill(false)));
  const [boxes, setBoxes] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))); // 0: empty, 1: P1, 2: P2
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Check for win condition
    if (scores[1] + scores[2] === GRID_SIZE * GRID_SIZE) {
      if (scores[1] > scores[2]) setWinner(1);
      else if (scores[2] > scores[1]) setWinner(2);
      else setWinner('tie');
    }
  }, [scores]);

  const handleHLineClick = (r, c) => {
    if (hLines[r][c] || winner) return;

    const newHLines = hLines.map((row, i) =>
      i === r ? row.map((line, j) => (j === c ? true : line)) : row
    );

    setHLines(newHLines);
    checkBoxes(newHLines, vLines, r, c, 'h');
  };

  const handleVLineClick = (r, c) => {
    if (vLines[r][c] || winner) return;

    const newVLines = vLines.map((row, i) =>
      i === r ? row.map((line, j) => (j === c ? true : line)) : row
    );

    setVLines(newVLines);
    checkBoxes(hLines, newVLines, r, c, 'v');
  };

  const checkBoxes = (newHLines, newVLines, r, c, type) => {
    let boxesFormed = 0;
    const newBoxes = boxes.map(row => [...row]);

    const checkAndClaimBox = (boxR, boxC) => {
      // Check if all 4 lines are true
      if (
        newHLines[boxR][boxC] &&         // top
        newHLines[boxR + 1][boxC] &&     // bottom
        newVLines[boxR][boxC] &&         // left
        newVLines[boxR][boxC + 1]        // right
      ) {
        if (newBoxes[boxR][boxC] === 0) {
          newBoxes[boxR][boxC] = currentPlayer;
          return 1;
        }
      }
      return 0;
    };

    if (type === 'h') {
      if (r > 0) boxesFormed += checkAndClaimBox(r - 1, c);
      if (r < GRID_SIZE) boxesFormed += checkAndClaimBox(r, c);
    } else {
      if (c > 0) boxesFormed += checkAndClaimBox(r, c - 1);
      if (c < GRID_SIZE) boxesFormed += checkAndClaimBox(r, c);
    }

    if (boxesFormed > 0) {
      setBoxes(newBoxes);
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + boxesFormed }));
      // current player gets another turn
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setHLines(Array(GRID_SIZE + 1).fill().map(() => Array(GRID_SIZE).fill(false)));
    setVLines(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE + 1).fill(false)));
    setBoxes(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)));
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setWinner(null);
  };

  const renderBoard = () => {
    const board = [];
    for (let r = 0; r <= GRID_SIZE; r++) {
      // Row of dots and horizontal lines
      const hRow = [];
      for (let c = 0; c <= GRID_SIZE; c++) {
        // Dot
        hRow.push(
          <div key={`dot-${r}-${c}`} className="w-4 h-4 bg-glass-stroke rounded-full flex-shrink-0 z-10" />
        );
        // Horizontal Line
        if (c < GRID_SIZE) {
          const isDrawn = hLines[r][c];
          hRow.push(
            <div 
              key={`hline-${r}-${c}`} 
              onClick={() => handleHLineClick(r, c)}
              className={`h-4 w-16 cursor-pointer flex-shrink-0 transition-all duration-300 rounded-full my-auto mx-[-4px] z-0
                ${isDrawn ? 'bg-neon-coral shadow-[0_0_8px_rgba(255,107,107,0.8)]' : 'hover:bg-neon-coral/30'}`}
            />
          );
        }
      }
      board.push(<div key={`hrow-${r}`} className="flex items-center">{hRow}</div>);

      // Row of vertical lines and boxes
      if (r < GRID_SIZE) {
        const vRow = [];
        for (let c = 0; c <= GRID_SIZE; c++) {
          // Vertical Line
          const isDrawn = vLines[r][c];
          vRow.push(
            <div 
              key={`vline-${r}-${c}`} 
              onClick={() => handleVLineClick(r, c)}
              className={`w-4 h-16 cursor-pointer flex-shrink-0 transition-all duration-300 rounded-full mx-auto my-[-4px] z-0
                ${isDrawn ? 'bg-neon-coral shadow-[0_0_8px_rgba(255,107,107,0.8)]' : 'hover:bg-neon-coral/30'}`}
            />
          );
          // Box
          if (c < GRID_SIZE) {
            const owner = boxes[r][c];
            vRow.push(
              <div 
                key={`box-${r}-${c}`} 
                className={`w-16 h-16 flex items-center justify-center text-3xl font-bold font-display-lg transition-all duration-500 rounded
                  ${owner === 1 ? 'text-[#FF6B6B] bg-[#FF6B6B]/20 shadow-[inset_0_0_15px_rgba(255,107,107,0.3)]' : 
                    owner === 2 ? 'text-[#4D9DE0] bg-[#4D9DE0]/20 shadow-[inset_0_0_15px_rgba(77,157,224,0.3)]' : ''}`}
              >
                {owner === 1 ? 'P1' : owner === 2 ? 'P2' : ''}
              </div>
            );
          }
        }
        board.push(<div key={`vrow-${r}`} className="flex items-center">{vRow}</div>);
      }
    }
    return <div className="flex flex-col items-center select-none">{board}</div>;
  };

  return (
    <div className="w-full h-full flex flex-col p-6 animate-fade-in relative z-10 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Dots and Boxes</h1>
          <p className="font-label-md text-on-surface-variant">The classic cross and dot game. Connect the dots to form boxes!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Game Board */}
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass flex-shrink-0">
          {renderBoard()}
        </div>

        {/* Scoreboard and Controls */}
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-display-lg text-2xl font-bold mb-6">Scoreboard</h2>
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-glass-stroke mb-4">
              <div className={`flex flex-col items-center ${currentPlayer === 1 ? 'text-[#FF6B6B] scale-110' : 'text-on-surface-variant'} transition-all`}>
                <span className="font-title-lg font-bold">Player 1</span>
                <span className="text-4xl font-display-lg">{scores[1]}</span>
              </div>
              <div className="text-xl font-bold text-on-surface-variant">VS</div>
              <div className={`flex flex-col items-center ${currentPlayer === 2 ? 'text-[#4D9DE0] scale-110' : 'text-on-surface-variant'} transition-all`}>
                <span className="font-title-lg font-bold">Player 2</span>
                <span className="text-4xl font-display-lg">{scores[2]}</span>
              </div>
            </div>
            
            {!winner && (
              <div className="mt-4 p-3 rounded-lg bg-surface-variant/30 border border-glass-stroke font-title-md">
                Current Turn: <span className={currentPlayer === 1 ? 'text-[#FF6B6B]' : 'text-[#4D9DE0]'}>Player {currentPlayer}</span>
              </div>
            )}
            
            {winner && (
              <div className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-neon-coral/20 to-primary/20 border border-neon-coral/50 animate-pulse">
                <h3 className="text-2xl font-display-lg text-on-surface mb-2">Game Over!</h3>
                <p className="text-lg font-title-md">
                  {winner === 'tie' ? "It's a Tie!" : <span className={winner === 1 ? 'text-[#FF6B6B]' : 'text-[#4D9DE0]'}>Player {winner} Wins!</span>}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={resetGame}
            className="w-full mt-auto py-3 bg-gradient-to-r from-neon-coral to-primary text-surface font-title-md font-bold rounded-xl shadow-lg hover:shadow-neon-coral/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}
