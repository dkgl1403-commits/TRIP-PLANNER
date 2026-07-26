import React, { useState, useEffect, useRef } from 'react';

export default function ZeroKata({ user, onBack }) {
  // Game Setup State
  const [gameMode, setGameMode] = useState(null); // 'single', 'local', 'online'
  
  // Game Board State
  // 3x3 grid represented as a flat array of 9 elements (0-8)
  // null = empty, 1 = Player 1 (X), 2 = Player 2 (O)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState(null); // 1, 2, or 'tie'
  const [winningLine, setWinningLine] = useState(null); // Array of 3 indices

  // Online / AI Specific State
  const [myPlayerId, setMyPlayerId] = useState(1); // 1 or 2
  const [opponentId, setOpponentId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('setup'); // setup, waiting, connected, error
  const wsRef = useRef(null);

  // Refs for state that is accessed in async callbacks (WebSockets, timeouts)
  const boardRef = useRef(board);
  const myPlayerIdRef = useRef(myPlayerId);

  // Global Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);

  // Fetch Leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/games/leaderboard/zero_kata');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  useEffect(() => {
    if (!gameMode) {
      fetchLeaderboard();
    }
  }, [gameMode]);

  // Check Win Condition
  const checkWinner = (currentBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: lines[i] };
      }
    }
    if (!currentBoard.includes(null)) {
      return { winner: 'tie', line: null };
    }
    return null;
  };

  // AI Logic for Single Player (Smart but Beatable)
  const executeAITurn = () => {
    const currentBoard = boardRef.current;
    
    // Check if game is already over
    if (checkWinner(currentBoard)) return;

    // Smart but beatable: 80% chance to make the best move, 20% chance to pick random available
    const isPlayingSmart = Math.random() < 0.8;

    let move = -1;
    const available = [];
    currentBoard.forEach((cell, i) => { if (cell === null) available.push(i); });

    if (available.length === 0) return;

    if (!isPlayingSmart) {
      move = available[Math.floor(Math.random() * available.length)];
    } else {
      // 1. Can AI win?
      move = findWinningMove(currentBoard, 2);
      // 2. Can AI block Player 1?
      if (move === -1) move = findWinningMove(currentBoard, 1);
      // 3. Take center if available
      if (move === -1 && currentBoard[4] === null) move = 4;
      // 4. Take random corner
      if (move === -1) {
        const corners = [0, 2, 6, 8].filter(i => currentBoard[i] === null);
        if (corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
      }
      // 5. Take whatever is left
      if (move === -1) {
        move = available[Math.floor(Math.random() * available.length)];
      }
    }

    if (move !== -1) {
      applyMove(move, 2);
    }
  };

  const findWinningMove = (boardState, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boardState[a] === player && boardState[b] === player && boardState[c] === null) return c;
      if (boardState[a] === player && boardState[c] === player && boardState[b] === null) return b;
      if (boardState[b] === player && boardState[c] === player && boardState[a] === null) return a;
    }
    return -1;
  };

  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === 2 && !winner) {
      const timer = setTimeout(() => {
        executeAITurn();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, board]);

  // Online Multiplayer Setup
  const setupWebSocket = (code) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
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
        if (wsRef.current && user) {
          wsRef.current.send(JSON.stringify({ type: 'identify', player: data.player, userId: user.login_id }));
        }
      } else if (data.type === 'identify') {
        if (data.player !== myPlayerIdRef.current) {
          setOpponentId(data.userId);
        }
      } else if (data.type === 'move') {
        if (data.player !== myPlayerIdRef.current) {
          applyMove(data.index, data.player);
        }
      } else if (data.type === 'reset') {
        if (data.player !== myPlayerIdRef.current) {
           resetGameState();
        }
      } else if (data.type === 'player_disconnected') {
        alert('Opponent disconnected.');
        setOnlineStatus('error');
      } else if (data.type === 'error') {
        alert(data.message);
        setOnlineStatus('setup');
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (wsRef.current === ws) {
        setOnlineStatus('error');
      }
    };
    
    ws.onclose = () => {
      if (wsRef.current === ws) {
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
  const applyMove = (index, playerMakingMove) => {
    let nextBoard = [...boardRef.current];
    if (nextBoard[index] !== null) return; // Prevent overwriting
    
    nextBoard[index] = playerMakingMove;
    setBoard(nextBoard);
    boardRef.current = nextBoard; // Synchronous ref update

    const result = checkWinner(nextBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      if (result.winner === 1 || result.winner === 2) {
        setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
        
        // Save win to global leaderboard
        if ((gameMode === 'single' && result.winner === 1) || 
            (gameMode === 'local') || 
            (gameMode === 'online' && result.winner === myPlayerIdRef.current)) {
          saveWin(result.winner);
        }
      }
    } else {
      setCurrentPlayer(playerMakingMove === 1 ? 2 : 1);
    }
  };

  const saveWin = async (winningPlayerId) => {
    if (!user) return;
    try {
      let actualPlayerId = user.login_id;
      if (gameMode === 'local' && winningPlayerId === 2) actualPlayerId = "Guest";
      
      await fetch('/api/games/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'zero_kata',
          player_id: actualPlayerId,
          score: 1, // 1 win
          difficulty: gameMode === 'single' ? 'normal' : 'pvp'
        })
      });
    } catch (e) {
      console.error("Failed to save win", e);
    }
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;
    if (gameMode === 'single' && currentPlayer !== 1) return;
    if (gameMode === 'online' && currentPlayer !== myPlayerId) return;

    applyMove(index, currentPlayer);

    if (gameMode === 'online' && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'move', index, player: currentPlayer }));
    }
  };

  const resetGameState = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
  };

  const resetGame = () => {
    resetGameState();
    if (gameMode === 'online' && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'reset', player: myPlayerId }));
    }
  };

  const handleLeaveGame = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    onBack();
  };

  const renderSetupScreen = () => {
    return (
      <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Zero Kata</h1>
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

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 bg-glass-fill rounded-3xl border border-glass-stroke relative overflow-hidden">
        {board.map((cell, index) => {
          const isWinningCell = winningLine && winningLine.includes(index);
          const isPlayable = !cell && !winner;
          let canClick = isPlayable;
          if (gameMode === 'single' && currentPlayer === 2) canClick = false;
          if (gameMode === 'online' && currentPlayer !== myPlayerId) canClick = false;

          return (
            <div 
              key={index}
              onClick={() => { if (canClick) handleCellClick(index); }}
              className={`w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-2xl border transition-all duration-300
                ${isWinningCell ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(26,200,237,0.3)] scale-105 z-10' : 'bg-surface-variant/30 border-glass-stroke'}
                ${canClick ? 'hover:bg-surface-variant/50 cursor-pointer hover:border-glass-stroke/80' : ''}
              `}
            >
              {cell === 1 && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 relative animate-zoom-in">
                  <div className="absolute inset-0 bg-[#FF6B6B] rounded-full transform rotate-45 scale-y-[1.4] w-2 sm:w-3 left-1/2 -translate-x-1/2"></div>
                  <div className="absolute inset-0 bg-[#FF6B6B] rounded-full transform -rotate-45 scale-y-[1.4] w-2 sm:w-3 left-1/2 -translate-x-1/2"></div>
                </div>
              )}
              {cell === 2 && (
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[6px] sm:border-[8px] border-[#4D9DE0] animate-zoom-in"></div>
              )}
            </div>
          );
        })}
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
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Zero Kata</h1>
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
            <h2 className="font-display-lg text-2xl font-bold mb-6">Session Wins</h2>
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-glass-stroke mb-4">
              <div className={`flex flex-col items-center ${currentPlayer === 1 && !winner ? 'text-[#FF6B6B] scale-110' : 'text-on-surface-variant'} transition-all`}>
                <span className="font-title-lg font-bold">
                  {gameMode === 'single' ? 'You' : gameMode === 'online' ? (myPlayerId === 1 ? (user?.login_id || 'You') : (opponentId || 'Player 1')) : 'Player 1 (X)'}
                </span>
                <span className="text-4xl font-display-lg">{scores[1]}</span>
              </div>
              <div className="text-xl font-bold text-on-surface-variant">VS</div>
              <div className={`flex flex-col items-center ${currentPlayer === 2 && !winner ? 'text-[#4D9DE0] scale-110' : 'text-on-surface-variant'} transition-all`}>
                <span className="font-title-lg font-bold">
                  {gameMode === 'single' ? 'Computer' : gameMode === 'online' ? (myPlayerId === 2 ? (user?.login_id || 'You') : (opponentId || 'Player 2')) : 'Player 2 (O)'}
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
                <h3 className="text-2xl font-display-lg text-on-surface mb-2">Round Over!</h3>
                <p className="text-lg font-title-md">
                  {winner === 'tie' ? "It's a Tie!" : <span className={winner === 1 ? 'text-[#FF6B6B]' : 'text-[#4D9DE0]'}>
                    {winner === myPlayerId && gameMode === 'online' ? 'You Win!' : gameMode === 'single' && winner === 2 ? 'Computer Wins!' : gameMode === 'single' && winner === 1 ? 'You Win!' : gameMode === 'online' ? (opponentId ? `${opponentId} Wins!` : `Player ${winner} Wins!`) : `Player ${winner} Wins!`}
                  </span>}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={resetGame}
            className={`w-full mt-auto py-3 font-title-md font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${winner ? 'bg-gradient-to-r from-neon-coral to-primary text-surface hover:shadow-neon-coral/30 hover:-translate-y-0.5' : 'bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined">{winner ? 'replay' : 'refresh'}</span>
            {winner ? 'Play Again' : 'Restart Match'}
          </button>
        </div>
      </div>
    </div>
  );
}
