import os

jsx_content = """import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const GRID_SIZE = 10;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Define entities
const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
const TELEPORTS = [15, 55, 85]; // Random unassigned cell
const JAILS = [12, 45, 82]; // Require 6 to escape
const SPRINGS = [7, 33, 77]; // Jump 10 squares

const COLORS = ['#FF6B6B', '#4D9DE0', '#F9DC5C', '#84DCC6', '#A5668B'];

export default function SnakeLadder({ user, onBack }) {
  const [gameMode, setGameMode] = useState(null); // 'single', 'local', 'online'
  
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  // players format: [{ id: 1, pos: 1, jailTurns: 0, color: COLORS[0], name: 'Player 1' }, ...]

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(''); // Toast messages for entities

  // Online Specific State
  const [myPlayerId, setMyPlayerId] = useState(1);
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('setup'); // setup, waiting, connected, error
  const [playersJoined, setPlayersJoined] = useState(0);
  const wsRef = useRef(null);

  // Refs for async callbacks
  const playersRef = useRef(players);
  const myPlayerIdRef = useRef(myPlayerId);
  const currentPlayerRef = useRef(currentPlayer);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);

  // Setup game
  const initializeGame = (count) => {
    const initialPlayers = [];
    for (let i = 1; i <= count; i++) {
      let name = Player \;
      if (gameMode === 'single') {
        name = i === 1 ? 'You' : 'Computer';
      }
      initialPlayers.push({ id: i, pos: 1, jailTurns: 0, color: COLORS[i-1], name });
    }
    setPlayers(initialPlayers);
    setCurrentPlayer(1);
    setWinner(null);
    setMessage('');
  };

  useEffect(() => {
    if (gameMode === 'single' || gameMode === 'local') {
      initializeGame(gameMode === 'single' ? 2 : numPlayers);
    }
  }, [gameMode, numPlayers]);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRollDice = () => {
    if (isRolling || winner) return;
    if (gameMode === 'single' && currentPlayer !== 1) return;
    if (gameMode === 'online' && currentPlayer !== myPlayerId) return;

    performRoll();
  };

  const performRoll = (forcedValue = null) => {
    if (isRolling || winner) return;
    setIsRolling(true);
    
    // Simulate roll animation delay
    setTimeout(() => {
      const roll = forcedValue || Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      
      if (gameMode === 'online' && wsRef.current && !forcedValue) {
        wsRef.current.send(JSON.stringify({ type: 'roll', value: roll, player: currentPlayer }));
      }
      
      processTurn(roll);
    }, 600);
  };

  const processTurn = (roll) => {
    const cp = currentPlayerRef.current;
    let nextPlayers = [...playersRef.current];
    let pIdx = nextPlayers.findIndex(p => p.id === cp);
    let player = { ...nextPlayers[pIdx] };

    let turnMessage = '';
    let moveToken = false;

    // Handle Jail
    if (player.jailTurns > 0) {
      if (roll === 6) {
        player.jailTurns = 0;
        turnMessage = \ rolled a 6 and escaped Jail!;
        moveToken = true;
      } else {
        player.jailTurns++;
        if (player.jailTurns > 3) {
           player.jailTurns = 0;
           turnMessage = \ served their time and is released!;
        } else {
           turnMessage = \ is in Jail (Turn \/3). Needs a 6!;
        }
      }
    } else {
      moveToken = true;
    }

    if (moveToken) {
      let targetPos = player.pos + roll;
      
      if (targetPos > 100) {
        turnMessage = \ needs exact roll to win.;
        targetPos = player.pos; // Don't move
      } else {
        // Evaluate entities
        if (SNAKES[targetPos]) {
          turnMessage = \ got bitten by a Snake!;
          targetPos = SNAKES[targetPos];
        } else if (LADDERS[targetPos]) {
          turnMessage = \ climbed a Ladder!;
          targetPos = LADDERS[targetPos];
        } else if (JAILS.includes(targetPos)) {
          turnMessage = Oh no! \ landed in Jail!;
          player.jailTurns = 1;
        } else if (SPRINGS.includes(targetPos)) {
          turnMessage = Boing! \ hit a Spring!;
          targetPos = Math.min(100, targetPos + 10);
        } else if (TELEPORTS.includes(targetPos)) {
          turnMessage = Woosh! \ teleported!;
          targetPos = Math.floor(Math.random() * 98) + 2; // Random 2-99
        }
      }
      player.pos = targetPos;
    }

    nextPlayers[pIdx] = player;
    setPlayers(nextPlayers);
    if (turnMessage) showToast(turnMessage);

    if (player.pos === 100) {
      setWinner(player.id);
      setIsRolling(false);
      triggerWinConfetti();
      saveWin(player.id);
      return;
    }

    // Determine next player
    // If rolled 6, gets another turn, unless they were just in jail and used it to escape.
    // Actually, to simplify: just pass turn unless game specific rules say 6 = another turn. Let's pass turn.
    let nextCp = cp + 1;
    if (nextCp > nextPlayers.length) nextCp = 1;
    
    setTimeout(() => {
      setCurrentPlayer(nextCp);
      setIsRolling(false);
    }, 1000);
  };

  const saveWin = async (winningPlayerId) => {
    if (!user) return;
    try {
      let actualPlayerId = user.login_id;
      if (gameMode === 'local' && winningPlayerId !== 1) actualPlayerId = "Guest";
      if (gameMode === 'online' && winningPlayerId !== myPlayerId) return; // Only winner saves their own win
      
      await fetch('/api/games/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: 'snake_ladder',
          player_id: actualPlayerId,
          score: 1,
          difficulty: 'normal'
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const triggerWinConfetti = () => {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: COLORS
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: COLORS
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === 2 && !winner && !isRolling) {
      const timer = setTimeout(() => {
        performRoll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, isRolling]);

  // Online Multiplayer Setup
  const setupWebSocket = (code, expectedCount = 2) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(\//\/api/games/ws/\?expected_players=\);
    
    ws.onopen = () => {
      setOnlineStatus('waiting');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'game_start') {
        setOnlineStatus('connected');
        initializeGame(expectedCount);
      } else if (data.type === 'player_assignment') {
        setMyPlayerId(data.player);
      } else if (data.type === 'roll') {
        if (data.player !== myPlayerIdRef.current) {
          performRoll(data.value);
        }
      } else if (data.type === 'reset') {
        if (data.player !== myPlayerIdRef.current) {
           initializeGame(expectedCount);
        }
      } else if (data.type === 'player_disconnected') {
        alert('A player disconnected.');
        setOnlineStatus('error');
      } else if (data.type === 'error') {
        alert(data.message);
        setOnlineStatus('setup');
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (wsRef.current === ws) setOnlineStatus('error');
    };
    
    ws.onclose = () => {
      if (wsRef.current === ws) setOnlineStatus('error');
    };
    
    wsRef.current = ws;
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(code);
    setupWebSocket(code, numPlayers);
  };

  const joinRoom = () => {
    if (joinCodeInput.trim().length !== 5) {
      alert('Please enter a valid 5-character code.');
      return;
    }
    setRoomCode(joinCodeInput.toUpperCase());
    // Joining players don't need to specify expectedCount, the backend uses the host's count
    // But passing 2 as fallback is fine since backend sets it on first connection.
    setupWebSocket(joinCodeInput.toUpperCase(), numPlayers);
  };

  const resetGame = () => {
    initializeGame(players.length);
    if (gameMode === 'online' && wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'reset', player: myPlayerId }));
    }
  };

  const handleLeaveGame = () => {
    if (wsRef.current) wsRef.current.close();
    onBack();
  };

  // Generate Board Cells
  const generateBoard = () => {
    const cells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        let num;
        if (r % 2 === 0) {
          // Left to right
          num = (GRID_SIZE - 1 - r) * GRID_SIZE + c + 1;
        } else {
          // Right to left
          num = (GRID_SIZE - 1 - r) * GRID_SIZE + (GRID_SIZE - c);
        }
        
        let entitySymbol = '';
        if (SNAKES[num]) entitySymbol = '??';
        else if (LADDERS[num]) entitySymbol = '??';
        else if (TELEPORTS.includes(num)) entitySymbol = '??';
        else if (JAILS.includes(num)) entitySymbol = '??';
        else if (SPRINGS.includes(num)) entitySymbol = '??';

        row.push(
          <div key={num} className="w-10 h-10 sm:w-16 sm:h-16 border border-glass-stroke/50 flex flex-col items-center justify-center relative bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors">
            <span className="absolute top-1 left-1 text-[10px] sm:text-xs font-bold text-on-surface-variant">{num}</span>
            <span className="text-xl sm:text-3xl mt-1 opacity-70">{entitySymbol}</span>
            
            {/* Tokens */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center p-1 gap-1 pointer-events-none">
              {players.filter(p => p.pos === num).map(p => (
                <div key={p.id} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg border border-white/50 z-10 transition-all duration-500 transform scale-110" style={{ backgroundColor: p.color }}></div>
              ))}
            </div>
          </div>
        );
      }
      cells.push(row);
    }
    return cells;
  };

  const renderSetupScreen = () => {
    return (
      <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Snake & Ladder</h1>
            <p className="font-label-md text-on-surface-variant">Choose a game mode</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-neon-coral/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => setGameMode('single')}>
            <span className="material-symbols-outlined text-5xl text-neon-coral mb-4 group-hover:scale-110 transition-transform">smart_toy</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Single Player</h3>
            <p className="text-on-surface-variant text-sm">Play against the AI.</p>
          </div>

          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#4D9DE0]/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => { setGameMode('local'); setMyPlayerId(1); }}>
            <span className="material-symbols-outlined text-5xl text-[#4D9DE0] mb-4 group-hover:scale-110 transition-transform">people</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Local Multiplayer</h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-sm">Players:</span>
               <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))} onClick={(e)=>e.stopPropagation()} className="bg-glass-fill text-on-surface rounded p-1">
                 {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
               </select>
            </div>
          </div>

          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-primary/20 cursor-pointer flex flex-col items-center text-center group" onClick={() => { setGameMode('online'); setOnlineStatus('setup'); }}>
            <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">public</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Online Multiplayer</h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-sm">Expected:</span>
               <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))} onClick={(e)=>e.stopPropagation()} className="bg-glass-fill text-on-surface rounded p-1">
                 {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
               </select>
            </div>
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
                Create Room for {numPlayers}
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
              <p className="text-lg font-title-md">Waiting for players...</p>
              <div className="p-4 bg-black/20 rounded-xl w-full border border-glass-stroke">
                <p className="text-sm text-on-surface-variant mb-1">Share this code with your friends:</p>
                <p className="text-3xl font-display-lg font-bold tracking-widest text-neon-coral">{roomCode}</p>
              </div>
              <button onClick={handleLeaveGame} className="text-error hover:text-error/80 underline text-sm mt-4">Cancel</button>
            </div>
          )}
          
          {onlineStatus === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-5xl text-error">error</span>
              <p className="text-lg font-title-md text-error">Connection Error or Player Left</p>
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
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={handleLeaveGame} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-3xl font-bold text-on-surface tracking-tight">Snake & Ladder</h1>
            <p className="font-label-md text-on-surface-variant">
              {gameMode === 'single' ? 'Single Player vs AI' : gameMode === 'local' ? 'Local Multiplayer' : Online - Room }
            </p>
          </div>
        </div>
        
        {message && (
          <div className="px-6 py-2 rounded-full bg-warning/20 border border-warning text-warning font-bold animate-fade-in shadow-[0_0_15px_rgba(249,220,92,0.3)]">
            {message}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Game Board */}
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-2 sm:p-4 shadow-glass flex-shrink-0">
          <div className="grid grid-rows-10">
            {generateBoard().map((row, i) => (
               <div key={i} className="flex">
                  {row}
               </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-display-lg text-2xl font-bold mb-4">Players</h2>
            
            <div className="flex flex-col gap-3">
              {players.map(p => (
                <div key={p.id} className={lex items-center justify-between p-3 rounded-xl border transition-all }>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: p.color }}></div>
                    <span className="font-bold text-on-surface">{p.name}</span>
                    {gameMode === 'online' && p.id === myPlayerId && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>}
                  </div>
                  <div className="font-display-lg text-xl text-on-surface-variant">
                    {p.pos}
                  </div>
                </div>
              ))}
            </div>
            
            {winner && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-neon-coral/20 to-primary/20 border border-neon-coral/50 animate-pulse">
                <h3 className="text-2xl font-display-lg text-on-surface mb-2">Game Over!</h3>
                <p className="text-xl font-title-md font-bold text-primary">
                  {players.find(p=>p.id===winner)?.name} Wins!
                </p>
                <button onClick={resetGame} className="mt-4 w-full py-2 bg-primary text-surface font-bold rounded-xl hover:-translate-y-0.5 transition-all">Play Again</button>
              </div>
            )}
            
            {!winner && (
              <div className="mt-8 flex flex-col items-center">
                 <div className={w-24 h-24 flex items-center justify-center rounded-2xl bg-glass-fill border-2 border-glass-stroke text-5xl font-black mb-6 shadow-glass }>
                    {diceValue}
                 </div>
                 
                 <button 
                   onClick={handleRollDice}
                   disabled={isRolling || (gameMode === 'single' && currentPlayer !== 1) || (gameMode === 'online' && currentPlayer !== myPlayerId)}
                   className="w-full py-4 bg-neon-coral text-surface font-display-lg text-xl font-bold rounded-xl shadow-lg hover:shadow-neon-coral/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                 >
                   {isRolling ? 'Rolling...' : 'ROLL DICE'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open(os.path.join("c:\\Personal\\Projects\\TRIP_Planner\\frontend\\src\\components\\games", "SnakeLadder.jsx"), "w") as f:
    f.write(jsx_content)

print("Created SnakeLadder.jsx")
