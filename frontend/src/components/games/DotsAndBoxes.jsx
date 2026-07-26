import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 4; // 4x4 boxes means 5x5 dots

export default function DotsAndBoxes({ user, onBack }) {
  // Game Setup State
  const [gameMode, setGameMode] = useState(null); // 'single', 'local', 'online'
  const [onlineStatus, setOnlineStatus] = useState(''); // 'setup', 'waiting', 'connected', 'error'
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  
  // Game State
  const [hLines, setHLines] = useState(Array(GRID_SIZE + 1).fill().map(() => Array(GRID_SIZE).fill(false)));
  const [vLines, setVLines] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE + 1).fill(false)));
  const [boxes, setBoxes] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))); // 0: empty, 1: P1, 2: P2
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState(null);

  // Online / AI Specific State
  const [myPlayerId, setMyPlayerId] = useState(1); // 1 or 2
  const wsRef = useRef(null);

  // Refs for state that is accessed in async callbacks (WebSockets, timeouts)
  const hLinesRef = useRef(hLines);
  const vLinesRef = useRef(vLines);
  const boxesRef = useRef(boxes);

  // Update refs when state changes
  useEffect(() => { hLinesRef.current = hLines; }, [hLines]);
  useEffect(() => { vLinesRef.current = vLines; }, [vLines]);
  useEffect(() => { boxesRef.current = boxes; }, [boxes]);

  // Helper to deep copy arrays
  const copy2D = (arr) => arr.map(row => [...row]);

  useEffect(() => {
    // Check for win condition
    if (scores[1] + scores[2] === GRID_SIZE * GRID_SIZE) {
      let finalWinner = 'tie';
      if (scores[1] > scores[2]) finalWinner = 1;
      else if (scores[2] > scores[1]) finalWinner = 2;
      setWinner(finalWinner);
      saveScore(finalWinner);
    }
  }, [scores]);

  const saveScore = async (finalWinner) => {
    if (!user) return; // Don't save if not logged in
    try {
      const player1Id = user.login_id;
      let player2Id = 'Guest';
      if (gameMode === 'single') player2Id = 'Computer';
      if (gameMode === 'online') player2Id = 'OnlineOpponent'; // Ideally we'd get their ID from websocket

      let winnerId = 'tie';
      if (finalWinner === 1) winnerId = player1Id;
      if (finalWinner === 2) winnerId = player2Id;

      await fetch(`${window.location.protocol}//${window.location.host}/api/games/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'dots_and_boxes',
          player1_id: player1Id,
          player2_id: player2Id,
          player1_score: scores[1],
          player2_score: scores[2],
          winner_id: winnerId
        })
      });
    } catch (e) {
      console.error("Failed to save score", e);
    }
  };

  useEffect(() => {
    if (!gameMode) {
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
    }
  }, [gameMode]);

  // AI Logic for Single Player
  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === 2 && !winner) {
      const timer = setTimeout(() => {
        executeAITurn();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, hLines, vLines, boxes]);

  const executeAITurn = () => {
    // 1. Offensive Check: Can we complete a box?
    let bestMove = null;
    let fallbackMove = null;
    let safeMoves = [];

    const currentHLines = hLinesRef.current;
    const currentVLines = vLinesRef.current;

    // Helper to see if a line completes a box
    const checkLineCompletesBox = (r, c, type) => {
      let completes = false;
      if (type === 'h') {
        if (r > 0 && currentHLines[r-1][c] && currentVLines[r-1][c] && currentVLines[r-1][c+1]) completes = true;
        if (r < GRID_SIZE && currentHLines[r+1][c] && currentVLines[r][c] && currentVLines[r][c+1]) completes = true;
      } else {
        if (c > 0 && currentHLines[r][c-1] && currentHLines[r+1][c-1] && currentVLines[r][c-1]) completes = true;
        if (c < GRID_SIZE && currentHLines[r][c] && currentHLines[r+1][c] && currentVLines[r][c+1]) completes = true;
      }
      return completes;
    };

    // Helper to see if a line gives a box to opponent (i.e. is the 3rd line of a box)
    const checkLineGivesBox = (r, c, type) => {
      let gives = false;
      const countLines = (boxR, boxC) => {
        let count = 0;
        if (currentHLines[boxR][boxC]) count++;
        if (currentHLines[boxR+1][boxC]) count++;
        if (currentVLines[boxR][boxC]) count++;
        if (currentVLines[boxR][boxC+1]) count++;
        return count;
      };

      if (type === 'h') {
        if (r > 0 && countLines(r-1, c) === 2) gives = true;
        if (r < GRID_SIZE && countLines(r, c) === 2) gives = true;
      } else {
        if (c > 0 && countLines(r, c-1) === 2) gives = true;
        if (c < GRID_SIZE && countLines(r, c) === 2) gives = true;
      }
      return gives;
    };

    // Scan all H lines
    for (let r = 0; r <= GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!currentHLines[r][c]) {
          const move = { r, c, type: 'h' };
          if (checkLineCompletesBox(r, c, 'h')) {
            bestMove = move;
            break;
          }
          if (!checkLineGivesBox(r, c, 'h')) {
            safeMoves.push(move);
          }
          if (!fallbackMove) fallbackMove = move;
        }
      }
      if (bestMove) break;
    }

    // Scan all V lines if no best move found
    if (!bestMove) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c <= GRID_SIZE; c++) {
          if (!currentVLines[r][c]) {
            const move = { r, c, type: 'v' };
            if (checkLineCompletesBox(r, c, 'v')) {
              bestMove = move;
              break;
            }
            if (!checkLineGivesBox(r, c, 'v')) {
              safeMoves.push(move);
            }
            if (!fallbackMove) fallbackMove = move;
          }
        }
        if (bestMove) break;
      }
    }

    let moveToPlay = bestMove;
    if (!moveToPlay) {
      if (safeMoves.length > 0) {
        moveToPlay = safeMoves[Math.floor(Math.random() * safeMoves.length)];
      } else {
        moveToPlay = fallbackMove;
      }
    }

    if (moveToPlay) {
      applyMove(moveToPlay.r, moveToPlay.c, moveToPlay.type, 2);
    }
  };

  // Online Multiplayer Setup
  const setupWebSocket = (code) => {
    // Determine ws protocol based on window location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // When proxying via Vite, this might need adjustment depending on setup, but typically relative or host works.
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/games/ws/${code}`);
    
    ws.onopen = () => {
      setOnlineStatus('waiting');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'game_start') {
        setOnlineStatus('connected');
      } else if (data.type === 'player_assignment') {
        setMyPlayerId(data.player);
      } else if (data.type === 'move') {
        // Apply opponent's move
        if (data.player !== myPlayerId) {
          applyMove(data.r, data.c, data.lineType, data.player);
        }
      } else if (data.type === 'player_disconnected') {
        alert('Opponent disconnected.');
        setOnlineStatus('error');
      } else if (data.type === 'error') {
        alert(data.message);
        setOnlineStatus('setup');
      }
    };
    
    ws.onclose = () => {
      if (wsRef.current === ws && onlineStatus === 'connected') {
        setOnlineStatus('error');
      }
    };
    
    wsRef.current = ws;
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(code);
    setupWebSocket(code);
  };

  const joinRoom = () => {
    if (joinCodeInput.trim().length !== 5) {
      alert('Please enter a valid 5-character code.');
      return;
    }
    setRoomCode(joinCodeInput.toUpperCase());
    setupWebSocket(joinCodeInput.toUpperCase());
  };

  // Shared move execution
  const applyMove = (r, c, type, playerMakingMove) => {
    // Always use the latest state from refs to avoid stale closures in WebSockets
    let nextHLines = copy2D(hLinesRef.current);
    let nextVLines = copy2D(vLinesRef.current);
    
    if (type === 'h') {
      nextHLines[r][c] = true;
      setHLines(nextHLines);
    } else {
      nextVLines[r][c] = true;
      setVLines(nextVLines);
    }

    // Check boxes after a tiny timeout so the UI can paint the line first
    setTimeout(() => {
      checkBoxes(nextHLines, nextVLines, r, c, type, playerMakingMove);
    }, 50);
  };

  const handleHLineClick = (r, c) => {
    if (hLines[r][c] || winner) return;
    if (gameMode === 'single' && currentPlayer !== 1) return; // Not your turn
    if (gameMode === 'online' && currentPlayer !== myPlayerId) return; // Not your turn

    applyMove(r, c, 'h', currentPlayer);

    if (gameMode === 'online' && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'move', lineType: 'h', r, c, player: currentPlayer }));
    }
  };

  const handleVLineClick = (r, c) => {
    if (vLines[r][c] || winner) return;
    if (gameMode === 'single' && currentPlayer !== 1) return; // Not your turn
    if (gameMode === 'online' && currentPlayer !== myPlayerId) return; // Not your turn

    applyMove(r, c, 'v', currentPlayer);

    if (gameMode === 'online' && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'move', lineType: 'v', r, c, player: currentPlayer }));
    }
  };

  const checkBoxes = (currentHLines, currentVLines, r, c, type, player) => {
    let boxesFormed = 0;
    const newBoxes = copy2D(boxesRef.current);

    const checkAndClaimBox = (boxR, boxC) => {
      if (
        currentHLines[boxR][boxC] &&         // top
        currentHLines[boxR + 1][boxC] &&     // bottom
        currentVLines[boxR][boxC] &&         // left
        currentVLines[boxR][boxC + 1]        // right
      ) {
        if (newBoxes[boxR][boxC] === 0) {
          newBoxes[boxR][boxC] = player;
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
      setScores(prev => ({ ...prev, [player]: prev[player] + boxesFormed }));
      // Player gets another turn (state stays the same)
    } else {
      setBoxes(newBoxes);
      setCurrentPlayer(player === 1 ? 2 : 1);
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

  const handleLeaveGame = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setGameMode(null);
    resetGame();
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
          let canClick = !isDrawn && !winner;
          if (gameMode === 'single' && currentPlayer === 2) canClick = false;
          if (gameMode === 'online' && currentPlayer !== myPlayerId) canClick = false;

          hRow.push(
            <div 
              key={`hline-${r}-${c}`} 
              onClick={() => { if (canClick) handleHLineClick(r, c); }}
              className={`h-4 w-16 flex-shrink-0 transition-all duration-300 rounded-full my-auto mx-[-4px] z-0
                ${isDrawn ? 'bg-neon-coral shadow-[0_0_8px_rgba(255,107,107,0.8)]' : (canClick ? 'hover:bg-neon-coral/30 cursor-pointer' : '')}`}
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
          let canClick = !isDrawn && !winner;
          if (gameMode === 'single' && currentPlayer === 2) canClick = false;
          if (gameMode === 'online' && currentPlayer !== myPlayerId) canClick = false;

          vRow.push(
            <div 
              key={`vline-${r}-${c}`} 
              onClick={() => { if (canClick) handleVLineClick(r, c); }}
              className={`w-4 h-16 flex-shrink-0 transition-all duration-300 rounded-full mx-auto my-[-4px] z-0
                ${isDrawn ? 'bg-neon-coral shadow-[0_0_8px_rgba(255,107,107,0.8)]' : (canClick ? 'hover:bg-neon-coral/30 cursor-pointer' : '')}`}
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

  const renderSetupScreen = () => {
    return (
      <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Dots and Boxes</h1>
            <p className="font-label-md text-on-surface-variant">Choose a game mode</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-neon-coral/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => setGameMode('single')}>
            <span className="material-symbols-outlined text-5xl text-neon-coral mb-4 group-hover:scale-110 transition-transform">smart_toy</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Single Player</h3>
            <p className="text-on-surface-variant text-sm">Play against a smart AI opponent.</p>
          </div>

          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#4D9DE0]/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => { setGameMode('local'); setMyPlayerId(1); }}>
            <span className="material-symbols-outlined text-5xl text-[#4D9DE0] mb-4 group-hover:scale-110 transition-transform">people</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Local Multiplayer</h3>
            <p className="text-on-surface-variant text-sm">Pass and play on the same screen.</p>
          </div>

          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-primary/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => { setGameMode('online'); setOnlineStatus('setup'); }}>
            <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">public</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Online Multiplayer</h3>
            <p className="text-on-surface-variant text-sm">Play with a friend across devices.</p>
          </div>
        </div>

        {/* Global Leaderboard */}
        <div className="max-w-4xl mx-auto w-full mt-12">
          <h2 className="font-display-lg text-3xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-warning">trophy</span>
            Global Leaderboard
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
  };

  const renderOnlineSetup = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 pt-28 animate-fade-in relative z-10">
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass max-w-md w-full text-center">
          <h2 className="font-display-lg text-3xl font-bold mb-6">Online Multiplayer</h2>
          
          {onlineStatus === 'setup' && (
            <div className="flex flex-col gap-6">
              <button onClick={createRoom} className="w-full py-3 bg-neon-coral text-surface font-title-md font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                Create New Game
              </button>
              
              <div className="flex items-center gap-4">
                <div className="h-px bg-glass-stroke flex-1"></div>
                <span className="text-on-surface-variant font-title-sm">OR</span>
                <div className="h-px bg-glass-stroke flex-1"></div>
              </div>

              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={joinCodeInput} 
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter 5-character Code"
                  className="w-full bg-glass-fill border border-glass-stroke rounded-xl px-4 py-3 text-on-surface font-bold text-center tracking-widest focus:outline-none focus:border-neon-coral transition-colors uppercase"
                  maxLength={5}
                />
                <button onClick={joinRoom} className="w-full py-3 bg-primary text-surface font-title-md font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                  Join Game
                </button>
              </div>
              <button onClick={() => setGameMode(null)} className="text-on-surface-variant hover:text-on-surface underline text-sm mt-4">Back</button>
            </div>
          )}

          {onlineStatus === 'waiting' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-neon-coral/30 border-t-neon-coral rounded-full animate-spin"></div>
              <p className="text-lg font-title-md">Waiting for opponent...</p>
              <div className="p-4 bg-black/20 rounded-xl w-full border border-glass-stroke">
                <p className="text-sm text-on-surface-variant mb-1">Share this code with your friend:</p>
                <p className="text-3xl font-display-lg font-bold tracking-widest text-neon-coral">{roomCode}</p>
              </div>
              <button onClick={handleLeaveGame} className="text-error hover:text-error/80 underline text-sm mt-4">Cancel</button>
            </div>
          )}
          
          {onlineStatus === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl text-error">error</span>
              <p className="text-lg font-title-md text-error">Connection Error or Opponent Left</p>
              <button onClick={handleLeaveGame} className="w-full py-3 bg-glass-fill text-on-surface font-title-md font-bold rounded-xl border border-glass-stroke hover:-translate-y-0.5 transition-all mt-4">
                Return to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!gameMode) return renderSetupScreen();
  if (gameMode === 'online' && onlineStatus !== 'connected') return renderOnlineSetup();

  return (
    <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLeaveGame}
            className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Dots and Boxes</h1>
            <p className="font-label-md text-on-surface-variant">
              {gameMode === 'single' ? 'Single Player vs AI' : gameMode === 'local' ? 'Local Multiplayer' : `Online - Room ${roomCode}`}
            </p>
          </div>
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
                <span className="font-title-lg font-bold">
                  {gameMode === 'single' ? 'You' : gameMode === 'online' && myPlayerId === 1 ? 'You' : 'Player 1'}
                </span>
                <span className="text-4xl font-display-lg">{scores[1]}</span>
              </div>
              <div className="text-xl font-bold text-on-surface-variant">VS</div>
              <div className={`flex flex-col items-center ${currentPlayer === 2 ? 'text-[#4D9DE0] scale-110' : 'text-on-surface-variant'} transition-all`}>
                <span className="font-title-lg font-bold">
                  {gameMode === 'single' ? 'Computer' : gameMode === 'online' && myPlayerId === 2 ? 'You' : 'Player 2'}
                </span>
                <span className="text-4xl font-display-lg">{scores[2]}</span>
              </div>
            </div>
            
            {!winner && (
              <div className="mt-4 p-3 rounded-lg bg-surface-variant/30 border border-glass-stroke font-title-md">
                Current Turn: <span className={currentPlayer === 1 ? 'text-[#FF6B6B]' : 'text-[#4D9DE0]'}>
                  {currentPlayer === myPlayerId && gameMode !== 'local' ? 'Your Turn' : `Player ${currentPlayer}`}
                </span>
              </div>
            )}
            
            {winner && (
              <div className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-neon-coral/20 to-primary/20 border border-neon-coral/50 animate-pulse">
                <h3 className="text-2xl font-display-lg text-on-surface mb-2">Game Over!</h3>
                <p className="text-lg font-title-md">
                  {winner === 'tie' ? "It's a Tie!" : <span className={winner === 1 ? 'text-[#FF6B6B]' : 'text-[#4D9DE0]'}>
                    {winner === myPlayerId && gameMode !== 'local' ? 'You Win!' : gameMode === 'single' ? 'Computer Wins!' : `Player ${winner} Wins!`}
                  </span>}
                </p>
              </div>
            )}
          </div>

          {(gameMode !== 'online') && (
            <button 
              onClick={resetGame}
              className="w-full mt-auto py-3 bg-gradient-to-r from-neon-coral to-primary text-surface font-title-md font-bold rounded-xl shadow-lg hover:shadow-neon-coral/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              Reset Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
