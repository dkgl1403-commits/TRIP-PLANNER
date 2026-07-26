import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

const GRID_SIZE = 10;
const TILE_SIZE = 2; // Size of each tile in 3D units

// Default constants
const INITIAL_SNAKES = { 99: 12, 72: 22, 30: 10, 52: 23, 96: 67 };
const LADDERS = { 3: 25, 35: 82, 48: 71, 20: 81, 84: 98 };
const COLORS = ['#FF4D4D', '#3399FF', '#FFCC00', '#00CC66', '#9933FF'];

// --- Helper Math: Map cell number to 3D Vector3 position ---
const getPosition = (num) => {
  if (num === 0) {
    // Starting Platform (left of tile 1)
    const x = (0 * TILE_SIZE) - (GRID_SIZE * TILE_SIZE / 2) - (TILE_SIZE * 0.8);
    const z = ((9 - 0) * TILE_SIZE) - (GRID_SIZE * TILE_SIZE / 2) + (TILE_SIZE / 2);
    return new THREE.Vector3(x, 0.5, z);
  }

  const row = Math.floor((num - 1) / 10);
  let col = (num - 1) % 10;
  if (row % 2 !== 0) col = 9 - col; // Zig-zag logic
  
  // Center the board around 0,0,0
  const x = (col * TILE_SIZE) - (GRID_SIZE * TILE_SIZE / 2) + (TILE_SIZE / 2);
  // Invert Z so row 0 is at the bottom (positive Z) and row 9 is at the top (negative Z)
  const z = ((9 - row) * TILE_SIZE) - (GRID_SIZE * TILE_SIZE / 2) + (TILE_SIZE / 2);
  const y = 0.5; // Height of the tile
  
  return new THREE.Vector3(x, y, z);
};

// ==========================================
// 3D COMPONENTS
// ==========================================

const Board = () => {
  const tiles = useMemo(() => {
    let arr = [];
    for (let i = 1; i <= 100; i++) {
      const pos = getPosition(i);
      const isAlt = (Math.floor((i - 1) / 10) + ((i - 1) % 10)) % 2 === 0;
      arr.push(
        <group key={`tile-${i}`} position={[pos.x, pos.y - 0.5, pos.z]}>
          <mesh receiveShadow>
            <boxGeometry args={[TILE_SIZE * 0.95, 0.5, TILE_SIZE * 0.95]} />
            <meshPhysicalMaterial 
              color={isAlt ? '#3a86ff' : '#8338ec'} 
              metalness={0.2} 
              roughness={0.1} 
              clearcoat={1} 
            />
          </mesh>
          <Text
            position={[0, 0.26, -0.6]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          >
            {i}
          </Text>
        </group>
      );
    }
    return arr;
  }, []);

  const startPos = getPosition(0);

  return (
    <group>
      {tiles}
      {/* Starting Platform */}
      <group position={[startPos.x, startPos.y - 0.5, startPos.z]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2, 2, 0.5, 32]} />
          <meshPhysicalMaterial color="#22223b" metalness={0.5} roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.26, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.8}
          color="#ff006e"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          START
        </Text>
      </group>
    </group>
  );
};

const Token = ({ player, isActive }) => {
  const targetPos = getPosition(player.pos);
  const offset = (player.id - 3) * 0.4;
  
  const { pos } = useSpring({
    to: async (next) => {
      await next({ pos: [targetPos.x + offset, targetPos.y + 2, targetPos.z + offset], config: { mass: 1, tension: 150, friction: 15 } });
      await next({ pos: [targetPos.x + offset, targetPos.y + 0.5, targetPos.z + offset], config: { mass: 1, tension: 250, friction: 12 } });
    },
    from: { pos: [targetPos.x + offset, targetPos.y + 0.5, targetPos.z + offset] }
  });

  return (
    <a.mesh position={pos} castShadow>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshPhysicalMaterial 
        color={player.color} 
        metalness={0.5} 
        roughness={0.2} 
        clearcoat={1}
        emissive={isActive ? player.color : '#000000'}
        emissiveIntensity={isActive ? 0.8 : 0}
      />
    </a.mesh>
  );
};

const Snakes = ({ snakesData }) => {
  return (
    <group>
      {Object.entries(snakesData).map(([start, end]) => {
        const sPos = getPosition(parseInt(start));
        const ePos = getPosition(parseInt(end));
        
        const midPoint = new THREE.Vector3().lerpVectors(sPos, ePos, 0.5);
        midPoint.y += Math.abs(sPos.x - ePos.x) * 0.3 + 3;
        
        const curve = new THREE.QuadraticBezierCurve3(sPos, midPoint, ePos);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.5, 16, false);

        return (
          <mesh key={`snake-${start}-${end}`} geometry={tubeGeo} castShadow receiveShadow>
            <meshPhysicalMaterial 
              color="#ff006e" 
              metalness={0.1} 
              roughness={0.3} 
              clearcoat={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Ladders = () => {
  return (
    <group>
      {Object.entries(LADDERS).map(([start, end]) => {
        const sPos = getPosition(parseInt(start));
        const ePos = getPosition(parseInt(end));
        
        const direction = new THREE.Vector3().subVectors(ePos, sPos);
        const distance = direction.length();
        const center = new THREE.Vector3().addVectors(sPos, ePos).multiplyScalar(0.5);
        
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize());

        const railOffset = 0.6;
        
        return (
          <group key={`ladder-${start}-${end}`} position={center} quaternion={quaternion}>
            {/* Left Rail */}
            <mesh position={[-railOffset, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, distance, 16]} />
              <meshStandardMaterial color="#fb5607" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Right Rail */}
            <mesh position={[railOffset, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, distance, 16]} />
              <meshStandardMaterial color="#fb5607" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Rungs */}
            {Array.from({ length: Math.floor(distance / 1.5) }).map((_, i) => {
              const numRungs = Math.floor(distance / 1.5);
              const yPos = -distance/2 + (i + 1) * (distance / (numRungs + 1));
              return (
                <mesh key={`rung-${i}`} position={[0, yPos, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.15, 0.15, railOffset * 2, 16]} />
                  <meshStandardMaterial color="#ffbe0b" roughness={0.6} metalness={0.3} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SnakeLadder({ user, onBack }) {
  const [gameMode, setGameMode] = useState(null);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  
  const [snakes, setSnakes] = useState(INITIAL_SNAKES);
  const [turnCounter, setTurnCounter] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);

  const [myPlayerId, setMyPlayerId] = useState(1);
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('setup');
  
  const wsRef = useRef(null);
  const playersRef = useRef(players);
  const myPlayerIdRef = useRef(myPlayerId);
  const currentPlayerRef = useRef(currentPlayer);
  const snakesRef = useRef(snakes);
  const turnCounterRef = useRef(turnCounter);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { myPlayerIdRef.current = myPlayerId; }, [myPlayerId]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);
  useEffect(() => { snakesRef.current = snakes; }, [snakes]);
  useEffect(() => { turnCounterRef.current = turnCounter; }, [turnCounter]);

  const initializeGame = (count) => {
    const initialPlayers = [];
    for (let i = 1; i <= count; i++) {
      let name = `Player ${i}`;
      if (gameMode === 'single') name = i === 1 ? 'You' : 'Computer';
      initialPlayers.push({ id: i, pos: 0, color: COLORS[i-1], name });
    }
    setPlayers(initialPlayers);
    setCurrentPlayer(1);
    setWinner(null);
    setMessage('');
    setSnakes(INITIAL_SNAKES);
    setTurnCounter(0);
    setIsMigrating(false);
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
    if (isRolling || winner || isMigrating) return;
    if (gameMode === 'single' && currentPlayer !== 1) return;
    if (gameMode === 'online' && currentPlayer !== myPlayerId) return;

    performRoll();
  };

  const performRoll = (forcedValue = null) => {
    if (isRolling || winner || isMigrating) return;
    setIsRolling(true);
    
    if (gameMode === 'online' && wsRef.current && !forcedValue) {
      const roll = Math.floor(Math.random() * 6) + 1;
      wsRef.current.send(JSON.stringify({ type: 'roll', value: roll, player: currentPlayer }));
      executeRollAnimation(roll);
    } else {
      const roll = forcedValue || Math.floor(Math.random() * 6) + 1;
      executeRollAnimation(roll);
    }
  };

  const executeRollAnimation = (finalRoll) => {
    setTimeout(() => {
      setDiceValue(finalRoll);
      setTimeout(() => processTurn(finalRoll), 500); 
    }, 600); // Faster, snappy roll
  };

  const generateNewSnakes = () => {
    const currentSnakes = { ...snakesRef.current };
    const snakeKeys = Object.keys(currentSnakes);
    if (snakeKeys.length < 2) return currentSnakes;
    
    const keysToRemove = snakeKeys.sort(() => 0.5 - Math.random()).slice(0, 2);
    keysToRemove.forEach(k => delete currentSnakes[k]);

    const isValidHead = (h) => h > 10 && h < 100 && !LADDERS[h] && !currentSnakes[h];
    const isValidTail = (t, h) => t > 1 && t < h && !LADDERS[t] && !currentSnakes[t];

    for (let i = 0; i < 2; i++) {
       let newHead, newTail;
       let attempts = 0;
       do { newHead = Math.floor(Math.random() * 88) + 11; attempts++; } while (!isValidHead(newHead) && attempts < 100);
       attempts = 0;
       do { newTail = Math.floor(Math.random() * (newHead - 2)) + 2; attempts++; } while (!isValidTail(newTail, newHead) && attempts < 100);
       if (isValidHead(newHead) && isValidTail(newTail, newHead)) currentSnakes[newHead] = newTail;
    }
    return currentSnakes;
  };

  const triggerMigration = (forcedSnakes = null) => {
    setIsMigrating(true);
    let newSnakes = forcedSnakes;
    if (!newSnakes) {
      newSnakes = generateNewSnakes();
      if (gameMode === 'online' && wsRef.current) wsRef.current.send(JSON.stringify({ type: 'snake_migration', newSnakes }));
    }
    setSnakes(newSnakes);
    setTimeout(() => { setIsMigrating(false); }, 3000);
  };

  const processTurn = async (roll) => {
    const cp = currentPlayerRef.current;
    let nextPlayers = [...playersRef.current];
    let pIdx = nextPlayers.findIndex(p => p.id === cp);
    let player = { ...nextPlayers[pIdx] };

    let startPos = player.pos;
    let targetPos = player.pos + roll;
    
    if (targetPos > 100) {
      showToast(`${player.name} needs exact roll to win.`);
    } else {
      let path = [];
      for (let i = startPos + 1; i <= targetPos; i++) path.push(i);

      for (const step of path) {
        player.pos = step;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]); 
        await new Promise(r => setTimeout(r, 400)); 
      }

      if (snakesRef.current[targetPos]) {
        showToast(`${player.name} got bitten by a Snake!`);
        await new Promise(r => setTimeout(r, 600));
        player.pos = snakesRef.current[targetPos];
      } else if (LADDERS[targetPos]) {
        showToast(`${player.name} climbed a Ladder!`);
        await new Promise(r => setTimeout(r, 600));
        player.pos = LADDERS[targetPos];
      }
      
      nextPlayers[pIdx] = { ...player };
      setPlayers([...nextPlayers]);
      await new Promise(r => setTimeout(r, 500)); 
    }

    if (player.pos === 100) {
      setWinner(player.id);
      setIsRolling(false);
      triggerWinConfetti();
      saveWin(player.id);
      return;
    }

    const newTurnCounter = turnCounterRef.current + 1;
    setTurnCounter(newTurnCounter);
    
    let nextCp = cp + 1;
    if (nextCp > nextPlayers.length) nextCp = 1;
    
    setCurrentPlayer(nextCp);
    setIsRolling(false);

    const rounds = Math.floor(newTurnCounter / nextPlayers.length);
    const isEndOfRound = (newTurnCounter % nextPlayers.length === 0);
    
    if (isEndOfRound && rounds % 5 === 0 && rounds > 0) {
      if (gameMode !== 'online' || currentPlayerRef.current === myPlayerIdRef.current) {
        triggerMigration();
      }
    }
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
    if (gameMode === 'single' && currentPlayer === 2 && !winner && !isRolling && !isMigrating) {
      const timer = setTimeout(() => { performRoll(); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, isRolling, isMigrating]);

  // UI Setup Screens...
  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col p-6 pt-28 animate-fade-in relative z-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral hover:border-neon-coral/50 transition-all shadow-glass">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display-lg text-4xl font-bold text-on-surface tracking-tight">Snake & Ladder 3D</h1>
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A10] overflow-hidden">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, -8, 15]} fov={60} />
          <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 1.5} />
          
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={2} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            shadow-camera-far={50} 
            shadow-camera-left={-20} 
            shadow-camera-right={20} 
            shadow-camera-top={20} 
            shadow-camera-bottom={-20} 
          />
          <Environment preset="city" />

          {/* Group tilted backward to fit the screen isometrically */}
          <group rotation={[-Math.PI / 5, 0, 0]} position={[0, 2, -2]}>
            <Board />
            <Snakes snakesData={snakes} />
            <Ladders />
            {players.map(p => (
              <Token key={p.id} player={p} isActive={currentPlayer === p.id} />
            ))}
            <ContactShadows position={[0, -0.6, 0]} opacity={0.6} scale={40} blur={2.5} far={10} />
          </group>
        </Canvas>
      </div>

      {/* HTML UI Overlay - Mobile Friendly */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full pointer-events-auto">
          <button onClick={onBack} className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/20 transition-all group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          {message && (
            <div className="px-6 py-2 rounded-full bg-black/80 backdrop-blur-md border border-neon-coral text-white font-bold shadow-lg animate-fade-in text-sm md:text-base">
              {message}
            </div>
          )}
        </div>

        {isMigrating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in pointer-events-auto">
            <div className="flex flex-col items-center bg-black/80 px-8 py-4 rounded-3xl backdrop-blur-md border border-neon-coral shadow-[0_0_30px_rgba(230,57,70,0.5)]">
              <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-neon-coral tracking-wider animate-pulse">SNAKES ARE MOVING!</h2>
            </div>
          </div>
        )}

        {winner && (
          <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in pointer-events-auto">
            <div className="flex flex-col items-center bg-black/90 px-12 py-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">Game Over!</h3>
              <p className="text-neon-coral font-bold text-3xl md:text-4xl mb-8">{players.find(p=>p.id===winner)?.name} Wins!</p>
              <button onClick={() => initializeGame(players.length)} className="px-10 py-4 bg-primary text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(58,134,255,0.5)]">Play Again</button>
            </div>
          </div>
        )}

        {/* Bottom Footer Area */}
        <div className="flex flex-row items-end justify-between w-full pointer-events-none gap-4">
          
          {/* Bottom Left: Dice */}
          <div className="flex flex-col items-center bg-black/70 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-2xl pointer-events-auto w-28 shrink-0">
             
             {/* Small CSS 3D Dice */}
             <div className="perspective-[500px] mb-4">
                 <div className={`dice-container w-10 h-10 relative transform-style-3d transition-transform duration-700 ease-out ${isRolling && !isMigrating ? 'animate-roll-fast' : ''}`} 
                      style={{ transform: isRolling && !isMigrating ? 'rotateX(1080deg) rotateY(1080deg)' : `rotateX(${diceValue === 1 ? '0deg' : diceValue === 6 ? '180deg' : diceValue === 2 ? '-90deg' : diceValue === 5 ? '90deg' : '0deg'}) rotateY(${diceValue === 3 ? '-90deg' : diceValue === 4 ? '90deg' : '0deg'})` }}>
                   
                   {/* 1 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex items-center justify-center translate-z-5">
                     <div className="w-2 h-2 bg-black rounded-full shadow-inner"></div>
                   </div>
                   {/* 6 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex flex-col justify-between items-center p-1.5 -translate-z-5 rotate-x-180">
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                   </div>
                   {/* 2 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex justify-between p-1.5 rotate-x-90 translate-z-5">
                     <div className="w-2 h-2 bg-black rounded-full self-start shadow-inner"></div>
                     <div className="w-2 h-2 bg-black rounded-full self-end shadow-inner"></div>
                   </div>
                   {/* 5 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex flex-col justify-between p-1.5 -rotate-x-90 translate-z-5">
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                     <div className="flex justify-center w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                   </div>
                   {/* 3 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex flex-col justify-between p-1.5 rotate-y-90 translate-z-5">
                     <div className="w-2 h-2 bg-black rounded-full self-start shadow-inner"></div>
                     <div className="w-2 h-2 bg-black rounded-full self-center shadow-inner"></div>
                     <div className="w-2 h-2 bg-black rounded-full self-end shadow-inner"></div>
                   </div>
                   {/* 4 */}
                   <div className="absolute w-full h-full bg-white border border-gray-400 rounded-lg flex flex-col justify-between p-1.5 -rotate-y-90 translate-z-5">
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                     <div className="flex justify-between w-full"><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div><div className="w-2 h-2 bg-black rounded-full shadow-inner"></div></div>
                   </div>

                 </div>
               </div>
               
               <button 
                 onClick={handleRollDice}
                 disabled={isRolling || isMigrating || (gameMode === 'single' && currentPlayer !== 1)}
                 className="w-full py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 ROLL
               </button>
          </div>

          {/* Bottom Right: Players List */}
          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-2xl pointer-events-auto flex flex-col gap-2 w-48 sm:w-64 max-h-[40vh] overflow-y-auto">
             <h3 className="font-bold text-white/70 text-xs uppercase tracking-wider mb-1">Players</h3>
             {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-2 rounded-xl transition-all ${currentPlayer === p.id && !winner ? 'bg-white/20 border border-white/50 shadow-md' : 'bg-transparent'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full shadow-md border border-black" style={{ backgroundColor: p.color }}></div>
                    <span className={`font-bold text-sm ${currentPlayer === p.id && !winner ? 'text-white' : 'text-white/70'}`}>{p.name}</span>
                  </div>
                  <div className="font-mono font-bold text-white">{p.pos}</div>
                </div>
              ))}
          </div>

        </div>
      </div>
      
      {/* Required CSS for Dice */}
      <style dangerouslySetInnerHTML={{__html: `
        .transform-style-3d { transform-style: preserve-3d; }
        .translate-z-5 { transform: translateZ(1.25rem); }
        .-translate-z-5 { transform: translateZ(-1.25rem); }
        .rotate-x-180 { transform: rotateX(180deg); }
        .rotate-x-90 { transform: rotateX(90deg); }
        .-rotate-x-90 { transform: rotateX(-90deg); }
        .rotate-y-90 { transform: rotateY(90deg); }
        .-rotate-y-90 { transform: rotateY(-90deg); }
        
        @keyframes roll-fast {
           0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0); }
           50% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg) translateY(-30px) scale(1.2); }
           100% { transform: rotateX(1080deg) rotateY(1080deg) rotateZ(360deg) translateY(0) scale(1); }
        }
        .animate-roll-fast { animation: roll-fast 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}} />

    </div>
  );
}
