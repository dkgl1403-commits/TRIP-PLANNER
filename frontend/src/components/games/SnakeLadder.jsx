import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const GRID_SIZE = 10;

const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
const TELEPORTS = [15, 55, 85];
const JAILS = [12, 45, 82];
const SPRINGS = [7, 33, 77];

const COLORS = ['#FF6B6B', '#4D9DE0', '#F9DC5C', '#84DCC6', '#A5668B'];

export default function SnakeLadder({ user, onBack }) {
  const [gameMode, setGameMode] = useState(null);
  
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');

  const [myPlayerId, setMyPlayerId] = useState(1);
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('setup');
  const wsRef = useRef(null);

  const playersRef = useRef(players);
  const myPlayerIdRef = useRef(myPlayerId);
  const currentPlayerRef = useRef(currentPlayer);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);

  const initializeGame = (count) => {
    const initialPlayers = [];
    for (let i = 1; i <= count; i++) {
      let name = `Player ${i}`;
      if (gameMode === 'single') name = i === 1 ? 'You' : 'Computer';
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
    
    // Start rolling animation
    if (gameMode === 'online' && wsRef.current && !forcedValue) {
      // Generate the roll now and send it, but wait to reveal it visually
      const roll = Math.floor(Math.random() * 6) + 1;
      wsRef.current.send(JSON.stringify({ type: 'roll', value: roll, player: currentPlayer }));
      executeRollAnimation(roll);
    } else {
      const roll = forcedValue || Math.floor(Math.random() * 6) + 1;
      executeRollAnimation(roll);
    }
  };

  const executeRollAnimation = (finalRoll) => {
    // We will let the CSS animation run for 1.5 seconds.
    // The CSS handles the 3D spinning. We just delay revealing the actual dice result visually until it stops.
    setTimeout(() => {
      setDiceValue(finalRoll);
      setTimeout(() => processTurn(finalRoll), 500);
    }, 1500);
  };

  const processTurn = async (roll) => {
    const cp = currentPlayerRef.current;
    let nextPlayers = [...playersRef.current];
    let pIdx = nextPlayers.findIndex(p => p.id === cp);
    let player = { ...nextPlayers[pIdx] };

    let turnMessage = '';
    let moveToken = false;

    if (player.jailTurns > 0) {
      if (roll === 6) {
        player.jailTurns = 0;
        turnMessage = `${player.name} rolled a 6 and escaped Jail!`;
        moveToken = true;
      } else {
        player.jailTurns++;
        if (player.jailTurns > 3) {
           player.jailTurns = 0;
           turnMessage = `${player.name} served their time and is released!`;
        } else {
           turnMessage = `${player.name} is in Jail (Turn ${player.jailTurns}/3). Needs a 6!`;
        }
      }
    } else {
      moveToken = true;
    }

    if (turnMessage) showToast(turnMessage);

    if (moveToken) {
      let startPos = player.pos;
      let targetPos = player.pos + roll;
      
      if (targetPos > 100) {
        showToast(`${player.name} needs exact roll to win.`);
      } else {
        // Generate hop path
        let path = [];
        for (let i = startPos + 1; i <= targetPos; i++) {
          path.push(i);
        }

        // Animate the hops one by one
        for (const step of path) {
          player.pos = step;
          nextPlayers[pIdx] = { ...player };
          setPlayers([...nextPlayers]); // Trigger re-render for step
          await new Promise(r => setTimeout(r, 250)); // Wait for CSS transition
        }

        // Evaluate entities
        if (SNAKES[targetPos]) {
          showToast(`${player.name} got bitten by a Snake!`);
          await new Promise(r => setTimeout(r, 400));
          player.pos = SNAKES[targetPos];
        } else if (LADDERS[targetPos]) {
          showToast(`${player.name} climbed a Ladder!`);
          await new Promise(r => setTimeout(r, 400));
          player.pos = LADDERS[targetPos];
        } else if (JAILS.includes(targetPos)) {
          showToast(`Oh no! ${player.name} landed in Jail!`);
          player.jailTurns = 1;
        } else if (SPRINGS.includes(targetPos)) {
          showToast(`Boing! ${player.name} hit a Spring!`);
          await new Promise(r => setTimeout(r, 400));
          player.pos = Math.min(100, targetPos + 10);
        } else if (TELEPORTS.includes(targetPos)) {
          showToast(`Woosh! ${player.name} teleported!`);
          await new Promise(r => setTimeout(r, 400));
          player.pos = Math.floor(Math.random() * 98) + 2;
        }
        
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
        await new Promise(r => setTimeout(r, 500)); // Final pause
      }
    }

    if (player.pos === 100) {
      setWinner(player.id);
      setIsRolling(false);
      triggerWinConfetti();
      saveWin(player.id);
      return;
    }

    let nextCp = cp + 1;
    if (nextCp > nextPlayers.length) nextCp = 1;
    
    setCurrentPlayer(nextCp);
    setIsRolling(false);
  };

  const saveWin = async (winningPlayerId) => {
    if (!user) return;
    try {
      let actualPlayerId = user.login_id;
      if (gameMode === 'local' && winningPlayerId !== 1) actualPlayerId = "Guest";
      if (gameMode === 'online' && winningPlayerId !== myPlayerId) return;
      
      await fetch('/api/games/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_name: 'snake_ladder', player_id: actualPlayerId, score: 1, difficulty: 'normal' })
      });
    } catch (e) {}
  };

  const triggerWinConfetti = () => {
    var duration = 3 * 1000;
    var end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
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

  const setupWebSocket = (code, expectedCount = 2) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/games/ws/${code}?expected_players=${expectedCount}`);
    
    ws.onopen = () => setOnlineStatus('waiting');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'game_start') {
        setOnlineStatus('connected');
        initializeGame(expectedCount);
      } else if (data.type === 'player_assignment') {
        setMyPlayerId(data.player);
      } else if (data.type === 'roll') {
        if (data.player !== myPlayerIdRef.current) performRoll(data.value);
      } else if (data.type === 'reset') {
        if (data.player !== myPlayerIdRef.current) initializeGame(expectedCount);
      } else if (data.type === 'player_disconnected') {
        alert('A player disconnected.');
        setOnlineStatus('error');
      } else if (data.type === 'error') {
        alert(data.message);
        setOnlineStatus('setup');
      }
    };
    ws.onerror = () => { if (wsRef.current === ws) setOnlineStatus('error'); };
    ws.onclose = () => { if (wsRef.current === ws) setOnlineStatus('error'); };
    wsRef.current = ws;
  };

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(code);
    setupWebSocket(code, numPlayers);
  };

  const joinRoom = () => {
    if (joinCodeInput.trim().length !== 5) return alert('Enter a valid 5-character code.');
    setRoomCode(joinCodeInput.toUpperCase());
    setupWebSocket(joinCodeInput.toUpperCase(), numPlayers);
  };

  const resetGame = () => {
    initializeGame(players.length);
    if (gameMode === 'online' && wsRef.current) wsRef.current.send(JSON.stringify({ type: 'reset', player: myPlayerId }));
  };

  const handleLeaveGame = () => {
    if (wsRef.current) wsRef.current.close();
    onBack();
  };

  // Coordinates Math for SVG overlay
  const getCoords = (num) => {
    const row = Math.floor((num - 1) / 10);
    let col;
    if (row % 2 === 0) col = (num - 1) % 10;
    else col = 9 - ((num - 1) % 10);
    
    // Return percentages relative to the board
    return {
      cx: (col * 10) + 5,
      cy: 100 - (row * 10) - 5
    };
  };

  // SVG Snake rendering
  const renderSnakes = () => {
    return Object.entries(SNAKES).map(([start, end]) => {
      const s = getCoords(parseInt(start));
      const e = getCoords(parseInt(end));
      // Control points for bezier curve (slithering)
      const midY = (s.cy + e.cy) / 2;
      const c1x = s.cx + 15;
      const c1y = midY;
      const c2x = e.cx - 15;
      const c2y = midY;
      
      return (
        <g key={`snake-${start}`}>
          {/* Shadow */}
          <path d={`M ${s.cx} ${s.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${e.cx} ${e.cy}`} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="8" transform="translate(2, 2)" />
          {/* Body */}
          <path d={`M ${s.cx} ${s.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${e.cx} ${e.cy}`} fill="none" stroke="#E63946" strokeWidth="6" strokeLinecap="round" />
          {/* Pattern */}
          <path d={`M ${s.cx} ${s.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${e.cx} ${e.cy}`} fill="none" stroke="#FFE66D" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
          {/* Head */}
          <circle cx={s.cx} cy={s.cy} r="4" fill="#E63946" />
        </g>
      );
    });
  };

  // SVG Ladder rendering
  const renderLadders = () => {
    return Object.entries(LADDERS).map(([start, end]) => {
      const s = getCoords(parseInt(start));
      const e = getCoords(parseInt(end));
      
      // Calculate angle and offset for parallel rails
      const dx = e.cx - s.cx;
      const dy = e.cy - s.cy;
      const length = Math.sqrt(dx*dx + dy*dy);
      const perpX = (-dy / length) * 2; // Offset by 2% width
      const perpY = (dx / length) * 2;

      // Generate rungs
      const rungs = [];
      const numRungs = Math.floor(length / 5);
      for (let i = 1; i <= numRungs; i++) {
        const ratio = i / (numRungs + 1);
        const rx = s.cx + dx * ratio;
        const ry = s.cy + dy * ratio;
        rungs.push(
          <line key={i} x1={rx - perpX} y1={ry - perpY} x2={rx + perpX} y2={ry + perpY} stroke="#8B4513" strokeWidth="2" />
        );
      }

      return (
        <g key={`ladder-${start}`}>
          {/* Rails */}
          <line x1={s.cx - perpX} y1={s.cy - perpY} x2={e.cx - perpX} y2={e.cy - perpY} stroke="#A0522D" strokeWidth="3" strokeLinecap="round" />
          <line x1={s.cx + perpX} y1={s.cy + perpY} x2={e.cx + perpX} y2={e.cy + perpY} stroke="#A0522D" strokeWidth="3" strokeLinecap="round" />
          {/* Rungs */}
          {rungs}
        </g>
      );
    });
  };

  const generateBoardHTML = () => {
    const cells = [];
    
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        let num;
        if (r % 2 === 0) num = (GRID_SIZE - 1 - r) * GRID_SIZE + (GRID_SIZE - c); // 100 to 91
        else num = (GRID_SIZE - 1 - r) * GRID_SIZE + c + 1; // 81 to 90
        
        let entitySymbol = '';
        if (TELEPORTS.includes(num)) entitySymbol = '🌀';
        else if (JAILS.includes(num)) entitySymbol = '🚔';
        else if (SPRINGS.includes(num)) entitySymbol = '🪀';

        cells.push(
          <div key={num} className="border border-glass-stroke/30 flex items-center justify-center relative bg-surface-variant/20">
            <span className="absolute top-1 left-1 text-[9px] sm:text-xs font-bold text-on-surface-variant opacity-60">{num}</span>
            <span className="text-xl sm:text-2xl mt-2 opacity-50">{entitySymbol}</span>
          </div>
        );
      }
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
          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-neon-coral/20 cursor-pointer flex flex-col items-center text-center" onClick={() => setGameMode('single')}>
            <span className="material-symbols-outlined text-5xl text-neon-coral mb-4">smart_toy</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Single Player</h3>
          </div>
          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-[#4D9DE0]/20 cursor-pointer flex flex-col items-center text-center" onClick={() => { setGameMode('local'); setMyPlayerId(1); }}>
            <span className="material-symbols-outlined text-5xl text-[#4D9DE0] mb-4">people</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Local Multiplayer</h3>
            <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))} onClick={(e)=>e.stopPropagation()} className="bg-glass-fill text-on-surface rounded p-1 mt-2">
              {[2,3,4,5].map(n => <option key={n} value={n}>{n} Players</option>)}
            </select>
          </div>
          <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass hover:shadow-primary/20 cursor-pointer flex flex-col items-center text-center" onClick={() => { setGameMode('online'); setOnlineStatus('setup'); }}>
            <span className="material-symbols-outlined text-5xl text-primary mb-4">public</span>
            <h3 className="font-display-lg text-2xl font-bold mb-2">Online Multiplayer</h3>
            <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))} onClick={(e)=>e.stopPropagation()} className="bg-glass-fill text-on-surface rounded p-1 mt-2">
              {[2,3,4,5].map(n => <option key={n} value={n}>{n} Players</option>)}
            </select>
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
              <button onClick={createRoom} className="w-full py-3 bg-neon-coral text-surface font-title-md font-bold rounded-xl shadow-lg">Create Room for {numPlayers}</button>
              <div className="flex flex-col gap-2">
                <input type="text" value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())} placeholder="Enter 5-character Code" className="w-full bg-glass-fill border border-glass-stroke rounded-xl px-4 py-3 text-on-surface font-bold text-center uppercase" maxLength={5} />
                <button onClick={joinRoom} className="w-full py-3 bg-primary text-surface font-title-md font-bold rounded-xl shadow-lg">Join Game</button>
              </div>
            </div>
          )}
          {onlineStatus === 'waiting' && (
             <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-neon-coral/30 border-t-neon-coral rounded-full animate-spin"></div>
               <p>Waiting for players... Code: <span className="font-bold text-neon-coral">{roomCode}</span></p>
             </div>
          )}
          {onlineStatus === 'error' && (
             <div className="flex flex-col items-center gap-4">
               <span className="material-symbols-outlined text-error text-5xl">error</span>
               <p>Connection Error or Player Left</p>
               <button onClick={handleLeaveGame} className="py-2 px-6 bg-glass-fill rounded-xl border border-glass-stroke">Back</button>
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
          <button onClick={handleLeaveGame} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl font-bold tracking-tight">Snake & Ladder</h1>
        </div>
        
        {message && (
          <div className="px-6 py-2 rounded-full bg-warning/20 border border-warning text-warning font-bold animate-fade-in shadow-[0_0_15px_rgba(249,220,92,0.3)]">
            {message}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Game Board Container */}
        <div className="relative flex-shrink-0 w-full max-w-[500px] aspect-square bg-surface-container border-2 border-glass-stroke rounded-xl shadow-glass overflow-hidden">
          
          {/* HTML CSS Grid */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {generateBoardHTML()}
          </div>

          {/* SVG Overlay for Snakes and Ladders */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
             {renderLadders()}
             {renderSnakes()}
          </svg>

          {/* Animated Player Tokens */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {players.map(p => {
               const coords = getCoords(p.pos);
               // Add slight offset so tokens don't perfectly overlap
               const offset = (p.id - 3) * 2; 
               return (
                 <div 
                   key={p.id}
                   className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-lg border border-white/80 transition-all duration-300 ease-in-out z-20"
                   style={{
                     backgroundColor: p.color,
                     top: `calc(${coords.cy}% - 8px + ${offset}px)`,
                     left: `calc(${coords.cx}% - 8px + ${offset}px)`
                   }}
                 ></div>
               );
            })}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="bg-surface-container border border-glass-stroke rounded-3xl p-6 shadow-glass w-full max-w-sm flex flex-col gap-6">
          <h2 className="font-display-lg text-2xl font-bold text-center">Players</h2>
          
          <div className="flex flex-col gap-2">
            {players.map(p => (
              <div key={p.id} className={`flex items-center justify-between p-2 rounded-xl border transition-all ${currentPlayer === p.id && !winner ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.2)] bg-white/10 scale-105' : 'border-glass-stroke bg-black/20'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: p.color }}></div>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
                <div className="font-bold">{p.pos}</div>
              </div>
            ))}
          </div>
          
          {winner && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-neon-coral/20 to-primary/20 border border-neon-coral/50 animate-pulse text-center">
              <h3 className="text-xl font-bold mb-2">Game Over!</h3>
              <p className="text-primary font-bold">{players.find(p=>p.id===winner)?.name} Wins!</p>
              <button onClick={resetGame} className="mt-4 w-full py-2 bg-primary text-surface font-bold rounded-xl">Play Again</button>
            </div>
          )}
          
          {!winner && (
            <div className="mt-4 flex flex-col items-center perspective-[1000px]">
               {/* 3D Dice */}
               <div className={`dice-container w-24 h-24 relative transform-style-3d transition-transform duration-1000 ease-in-out mb-8 ${isRolling ? 'animate-roll' : ''}`} style={{ transform: isRolling ? 'rotateX(720deg) rotateY(1080deg)' : `rotateX(${diceValue === 1 ? '0deg' : diceValue === 6 ? '180deg' : diceValue === 2 ? '-90deg' : diceValue === 5 ? '90deg' : '0deg'}) rotateY(${diceValue === 3 ? '-90deg' : diceValue === 4 ? '90deg' : '0deg'})` }}>
                 {[1,2,3,4,5,6].map(face => (
                   <div key={face} className={`absolute w-full h-full bg-glass-fill border border-glass-stroke shadow-glass rounded-xl flex items-center justify-center text-4xl font-black text-on-surface
                     ${face===1?'translate-z-12':face===6?'-translate-z-12 rotate-x-180':face===2?'rotate-x-90 translate-z-12':face===5?'-rotate-x-90 translate-z-12':face===3?'rotate-y-90 translate-z-12':'-rotate-y-90 translate-z-12'}
                   `} style={{ transform: `rotateX(${face===2?'90deg':face===5?'-90deg':face===6?'180deg':'0deg'}) rotateY(${face===3?'90deg':face===4?'-90deg':'0deg'}) translateZ(48px)` }}>
                     {isRolling ? '?' : face}
                   </div>
                 ))}
               </div>
               
               <button 
                 onClick={handleRollDice}
                 disabled={isRolling || (gameMode === 'single' && currentPlayer !== 1) || (gameMode === 'online' && currentPlayer !== myPlayerId)}
                 className="w-full py-3 bg-neon-coral text-surface font-display-lg text-lg font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isRolling ? 'Rolling...' : 'ROLL DICE'}
               </button>
            </div>
          )}

          {/* Inline styles for 3D dice */}
          <style dangerouslySetInnerHTML={{__html: `
            .transform-style-3d { transform-style: preserve-3d; }
            .translate-z-12 { transform: translateZ(3rem); }
            .-translate-z-12 { transform: translateZ(-3rem); }
            .rotate-x-180 { transform: rotateX(180deg); }
            .rotate-x-90 { transform: rotateX(90deg); }
            .-rotate-x-90 { transform: rotateX(-90deg); }
            .rotate-y-90 { transform: rotateY(90deg); }
            .-rotate-y-90 { transform: rotateY(-90deg); }
            
            @keyframes roll {
               0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
               50% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) translateY(-50px); }
               100% { transform: rotateX(1080deg) rotateY(1080deg) rotateZ(360deg); }
            }
            .animate-roll { animation: roll 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          `}} />

        </div>
      </div>
    </div>
  );
}
