import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, RoundedBox, Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

const BOARD_SIZE = 4;

function generatePath() {
  let x = 0, y = 0;
  const path = []; 
  while (x < BOARD_SIZE - 1 || y < BOARD_SIZE - 1) {
    const canGoE = x < BOARD_SIZE - 1;
    const canGoS = y < BOARD_SIZE - 1;
    if (canGoE && canGoS) {
      if (Math.random() > 0.5) { path.push('E'); x++; }
      else { path.push('S'); y++; }
    } else if (canGoE) {
      path.push('E'); x++;
    } else {
      path.push('S'); y++;
    }
  }
  return path; // length 6
}

function generateRoom(x, y, correctDoor) {
  const doors = [];
  if (y > 0) doors.push('N');
  if (y < BOARD_SIZE - 1) doors.push('S');
  if (x < BOARD_SIZE - 1) doors.push('E');
  if (x > 0) doors.push('W');
  
  const doorNumbers = {};
  let usedNumbers = new Set();
  
  doors.forEach(d => {
    let num;
    do { num = Math.floor(Math.random() * 90) + 10; } while(usedNumbers.has(num));
    usedNumbers.add(num);
    doorNumbers[d] = num;
  });
  
  const targetNum = doorNumbers[correctDoor];
  
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let puzzleStr = "";
  if (op === '+') {
    const a = Math.floor(Math.random() * (targetNum - 1)) + 1;
    const b = targetNum - a;
    puzzleStr = `${a} + ${b}`;
  } else if (op === '-') {
    const a = targetNum + Math.floor(Math.random() * 50) + 10;
    const b = a - targetNum;
    puzzleStr = `${a} - ${b}`;
  } else if (op === '*') {
    const factors = [];
    for(let i=2; i<=Math.sqrt(targetNum); i++) {
       if (targetNum % i === 0) factors.push(i);
    }
    if (factors.length > 0) {
      const a = factors[Math.floor(Math.random() * factors.length)];
      const b = targetNum / a;
      puzzleStr = `${a} * ${b}`;
    } else {
      const a = Math.floor(Math.random() * (targetNum - 1)) + 1;
      const b = targetNum - a;
      puzzleStr = `${a} + ${b}`;
    }
  }
  
  return {
    x, y,
    availableDoors: doors,
    correctDoor,
    doorNumbers,
    puzzle: puzzleStr,
    lockedDoors: []
  };
}

// --------------------------------------------------------
// 3D COMPONENTS
// --------------------------------------------------------

const Door = ({ dir, number, isLocked, isHovered, onClick }) => {
  // Map directions to positions
  const posMap = {
    'N': [0, 2, -5],
    'S': [0, 2, 5],
    'E': [5, 2, 0],
    'W': [-5, 2, 0]
  };
  const rotMap = {
    'N': [0, 0, 0],
    'S': [0, Math.PI, 0],
    'E': [0, -Math.PI/2, 0],
    'W': [0, Math.PI/2, 0]
  };

  const pos = posMap[dir];
  const rot = rotMap[dir];
  
  let color = isLocked ? '#ff0000' : '#22c55e';
  let emissiveIntensity = isLocked ? 2 : (isHovered ? 2 : 1);

  return (
    <group position={pos} rotation={rot}>
      {/* Door Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial color={isLocked ? "#331111" : "#113311"} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Neon Number */}
      <Text
        position={[0, 3, 0.3]}
        fontSize={1.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {number}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      
      {/* Clickable Area */}
      {!isLocked && (
        <mesh position={[0, 0, 0.4]} onClick={onClick} onPointerOver={(e) => {e.stopPropagation(); document.body.style.cursor = 'pointer'}} onPointerOut={(e) => {e.stopPropagation(); document.body.style.cursor = 'auto'}}>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </group>
  );
};

const Room3D = ({ room, onDoorClick }) => {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Floor Grid */}
      <gridHelper args={[10, 10, '#22c55e', '#113311']} position={[0, 0.01, 0]} />
      
      {/* Ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#050505" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Walls */}
      {/* North Wall */}
      <mesh position={[0, 4, -5]} receiveShadow castShadow>
        <boxGeometry args={[10, 8, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* South Wall */}
      <mesh position={[0, 4, 5]} receiveShadow castShadow>
        <boxGeometry args={[10, 8, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* East Wall */}
      <mesh position={[5, 4, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 8, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-5, 4, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 8, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Center Terminal */}
      <group position={[0, 1, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.7, 2, 16]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        <Text
          position={[0, 1.2, 0]}
          rotation={[-Math.PI/4, 0, 0]}
          fontSize={0.8}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          {room.puzzle}
          <meshBasicMaterial color="#22c55e" toneMapped={false} />
        </Text>
      </group>

      {/* Doors */}
      {room.availableDoors.map(dir => (
        <Door 
          key={dir} 
          dir={dir} 
          number={room.doorNumbers[dir]} 
          isLocked={room.lockedDoors.includes(dir)}
          onClick={() => onDoorClick(dir)}
        />
      ))}
    </group>
  );
};

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------

export default function MazeGame({ user, onBack }) {
  const [gameState, setGameState] = useState('menu'); // menu, playing, game_over, won
  const [timeRemaining, setTimeRemaining] = useState(60 * 3); // 3 minutes total
  const [path, setPath] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [room, setRoom] = useState(null);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameState('game_over');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  const startGame = () => {
    const newPath = generatePath();
    setPath(newPath);
    setStepIndex(0);
    setRoom(generateRoom(0, 0, newPath[0]));
    setTimeRemaining(180); // 3 mins
    setGameState('playing');
  };

  const handleDoorClick = (dir) => {
    if (dir === room.correctDoor) {
      // Correct! Advance.
      const nextStep = stepIndex + 1;
      if (nextStep >= path.length) {
        setGameState('won');
      } else {
        setStepIndex(nextStep);
        let nextX = room.x;
        let nextY = room.y;
        if (dir === 'E') nextX++;
        if (dir === 'S') nextY++;
        if (dir === 'W') nextX--;
        if (dir === 'N') nextY--;
        setRoom(generateRoom(nextX, nextY, path[nextStep]));
      }
    } else {
      // Trap! Lose 10s and lock door.
      setTimeRemaining(prev => Math.max(0, prev - 10));
      setRoom(prev => ({
        ...prev,
        lockedDoors: [...prev.lockedDoors, dir]
      }));
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0f] overflow-hidden font-mono text-green-400">
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all backdrop-blur-md"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        {(gameState === 'playing' || gameState === 'game_over' || gameState === 'won') && (
          <div className="flex gap-6 pointer-events-auto">
            <div className={`bg-black/50 border rounded-xl px-4 py-2 backdrop-blur-md flex flex-col items-center ${timeRemaining < 30 ? 'border-red-500 text-red-500 animate-pulse' : 'border-green-500/30 text-green-400'}`}>
              <span className="text-xs opacity-70 uppercase tracking-widest">Time Remaining</span>
              <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <div className="bg-black/50 border border-green-500/30 rounded-xl px-4 py-2 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs text-green-500/70 uppercase tracking-widest">Room</span>
              <span className="text-2xl font-bold">{stepIndex + 1} / 7</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-black/60 border border-green-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)] text-center">
            <span className="material-symbols-outlined text-6xl text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">meeting_room</span>
            <h2 className="text-4xl font-bold text-green-400 mb-2 uppercase tracking-widest">The Maze</h2>
            <p className="text-green-500/70 mb-8">
              Navigate a 16-room grid. Solve the terminal math puzzle to find the correct door. Walk through wrong doors and lose 10 seconds. You have 3 minutes to escape.
            </p>
            <button 
              onClick={startGame}
              className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500 text-green-400 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              Enter The Maze
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Won Menus */}
      {gameState === 'game_over' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-red-500 mb-4 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">Time's Up</h2>
            <p className="text-xl text-red-400/80 mb-8">You were lost to the maze forever.</p>
            <button onClick={startGame} className="px-8 py-3 rounded-xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-black transition-all">Try Again</button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-green-500 mb-4 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]">Escaped!</h2>
            <p className="text-xl text-green-400/80 mb-8">You survived the maze with {formatTime(timeRemaining)} remaining.</p>
            <button onClick={startGame} className="px-8 py-3 rounded-xl border-2 border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-black transition-all">Play Again</button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      {gameState === 'playing' && room && (
        <Canvas shadows camera={{ position: [0, 8, 8], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 10, 25]} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} angle={0.8} penumbra={1} intensity={2} castShadow color="#22c55e" />
          
          <Room3D room={room} onDoorClick={handleDoorClick} />
        </Canvas>
      )}

    </div>
  );
}
