import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const BOARD_SIZE = 4;
const DIR_POSITIONS = { N: [0, 2, -4.8], S: [0, 2, 4.8], E: [4.8, 2, 0], W: [-4.8, 2, 0] };
const DIR_ROTATIONS = { N: [0, 0, 0], S: [0, Math.PI, 0], E: [0, -Math.PI / 2, 0], W: [0, Math.PI / 2, 0] };

function generatePath() {
  let x = 0, y = 0;
  const path = [];
  while (x < BOARD_SIZE - 1 || y < BOARD_SIZE - 1) {
    const canE = x < BOARD_SIZE - 1, canS = y < BOARD_SIZE - 1;
    if (canE && canS) { if (Math.random() > 0.5) { path.push('E'); x++; } else { path.push('S'); y++; } }
    else if (canE) { path.push('E'); x++; }
    else { path.push('S'); y++; }
  }
  return path;
}

function generateRoom(x, y, correctDoor) {
  const doorSet = new Set([correctDoor]);
  if (y > 0) doorSet.add('N');
  if (y < BOARD_SIZE - 1) doorSet.add('S');
  if (x < BOARD_SIZE - 1) doorSet.add('E');
  if (x > 0) doorSet.add('W');
  ['N','S','E','W'].forEach(d => { if (!doorSet.has(d) && doorSet.size < 3 && Math.random() > 0.5) doorSet.add(d); });
  const doorList = Array.from(doorSet);
  const doorNumbers = {}, used = new Set();
  doorList.forEach(d => { let n; do { n = Math.floor(Math.random() * 80) + 12; } while (used.has(n)); used.add(n); doorNumbers[d] = n; });
  const target = doorNumbers[correctDoor];
  let puzzle = '';
  const r = Math.random();
  if (r < 0.4) { const a = Math.max(1, Math.floor(Math.random() * (target - 2)) + 1); puzzle = `${a} + ${target - a}`; }
  else if (r < 0.7) { const e = Math.floor(Math.random() * 40) + 5; puzzle = `${target + e} - ${e}`; }
  else { let ok = false; for (let i = 2; i <= Math.sqrt(target); i++) { if (target % i === 0) { puzzle = `${i} x ${target / i}`; ok = true; break; } } if (!ok) { const a = Math.max(1, Math.floor(Math.random() * (target - 2)) + 1); puzzle = `${a} + ${target - a}`; } }
  return { x, y, availableDoors: doorList, correctDoor, doorNumbers, puzzle, lockedDoors: [] };
}

function Door({ dir, number, isLocked, onClick }) {
  const pos = DIR_POSITIONS[dir], rot = DIR_ROTATIONS[dir];
  const color = isLocked ? '#ef4444' : '#22c55e';
  return (
    <group position={pos} rotation={rot}>
      <mesh>
        <boxGeometry args={[3, 4, 0.3]} />
        <meshStandardMaterial color={isLocked ? '#330000' : '#003300'} metalness={0.9} roughness={0.2} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      <Text position={[0, 2.8, 0.25]} fontSize={1.2} anchorX="center" anchorY="middle" color={color} outlineWidth={0.05} outlineColor="#000000">
        {String(number)}
      </Text>
      {!isLocked && (
        <mesh onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
          <boxGeometry args={[3, 4, 0.7]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </group>
  );
}

function Room3D({ room, onDoorClick }) {
  const walls = [
    { pos: [0, 4, -5], rot: [0, 0, 0] },
    { pos: [0, 4, 5], rot: [0, Math.PI, 0] },
    { pos: [5, 4, 0], rot: [0, -Math.PI / 2, 0] },
    { pos: [-5, 4, 0], rot: [0, Math.PI / 2, 0] },
  ];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0d0d14" metalness={0.8} roughness={0.3} />
      </mesh>
      <gridHelper args={[10, 10, '#1a3a1a', '#111a11']} position={[0, 0.01, 0]} />
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot} receiveShadow>
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial color="#0a0a10" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 2, 12]} />
        <meshStandardMaterial color="#111122" metalness={0.95} roughness={0.1} />
      </mesh>
      <Text position={[0, 2.6, 0.7]} fontSize={0.45} anchorX="center" anchorY="middle" color="#22c55e" maxWidth={1.5}>
        {`${room.puzzle} = ?`}
      </Text>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.5, 4.7, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.25} />
      </mesh>
      {room.availableDoors.map(dir => (
        <Door key={dir} dir={dir} number={room.doorNumbers[dir]} isLocked={room.lockedDoors.includes(dir)} onClick={() => onDoorClick(dir)} />
      ))}
    </group>
  );
}

export default function MazeGame({ onBack }) {
  const [gameState, setGameState] = useState('menu');
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [path, setPath] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [room, setRoom] = useState(null);
  const [flashMsg, setFlashMsg] = useState(null);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => { if (prev <= 1) { setGameState('game_over'); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    const newPath = generatePath();
    setPath(newPath); setStepIndex(0);
    setRoom(generateRoom(0, 0, newPath[0]));
    setTimeRemaining(180); setFlashMsg(null);
    setGameState('playing');
  };

  const showFlash = (msg, color) => { setFlashMsg({ msg, color }); setTimeout(() => setFlashMsg(null), 1400); };

  const handleDoorClick = (dir) => {
    if (!room) return;
    if (dir === room.correctDoor) {
      showFlash('Correct!', 'green');
      const nextStep = stepIndex + 1;
      if (nextStep >= path.length) { setTimeout(() => setGameState('won'), 800); }
      else {
        setTimeout(() => {
          setStepIndex(nextStep);
          let nx = room.x, ny = room.y;
          if (dir === 'E') nx++; if (dir === 'W') nx--;
          if (dir === 'S') ny++; if (dir === 'N') ny--;
          setRoom(generateRoom(nx, ny, path[nextStep]));
        }, 600);
      }
    } else {
      showFlash('Trap! -10s', 'red');
      setTimeRemaining(prev => Math.max(0, prev - 10));
      setRoom(prev => ({ ...prev, lockedDoors: [...prev.lockedDoors, dir] }));
    }
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ position: 'fixed', inset: '0', width: '100vw', height: '100vh', overflow: 'hidden', background: '#05050f', fontFamily: 'monospace' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, pointerEvents: 'none' }}>
        <button onClick={onBack} style={{ pointerEvents: 'auto', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          &#8592;
        </button>
        {gameState === 'playing' && (
          <div style={{ display: 'flex', gap: '16px', pointerEvents: 'auto' }}>
            <div style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${timeRemaining < 30 ? '#ef4444' : 'rgba(34,197,94,0.3)'}`, color: timeRemaining < 30 ? '#ef4444' : '#22c55e', padding: '8px 16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', letterSpacing: '2px', opacity: 0.7 }}>TIME</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{fmt(timeRemaining)}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '8px 16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', letterSpacing: '2px', opacity: 0.7 }}>ROOM</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stepIndex + 1} / {path.length + 1}</span>
            </div>
          </div>
        )}
      </div>

      {flashMsg && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30, pointerEvents: 'none' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', padding: '16px 40px', background: 'rgba(0,0,0,0.85)', border: `2px solid ${flashMsg.color === 'green' ? '#22c55e' : '#ef4444'}`, color: flashMsg.color === 'green' ? '#22c55e' : '#ef4444', borderRadius: '16px' }}>
            {flashMsg.msg}
          </div>
        </div>
      )}

      {gameState === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,15,0.95)' }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '8px' }}>&#127962;</div>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px', letterSpacing: '6px' }}>THE MAZE</h2>
            <p style={{ color: 'rgba(74,222,128,0.6)', marginBottom: '32px', lineHeight: '1.7' }}>Solve the terminal puzzle. Find the door with the matching neon number and click it. Wrong doors cost 10 seconds.</p>
            <button onClick={startGame} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 'bold', fontSize: '14px', letterSpacing: '4px', cursor: 'pointer' }}>ENTER THE MAZE</button>
          </div>
        </div>
      )}

      {gameState === 'game_over' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,0,0,0.95)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '64px', fontWeight: 'bold', color: '#ef4444', letterSpacing: '4px', marginBottom: '16px' }}>TIME&#39;S UP</h2>
            <p style={{ color: 'rgba(239,68,68,0.6)', fontSize: '20px', marginBottom: '32px' }}>You were lost in the maze.</p>
            <button onClick={startGame} style={{ padding: '14px 40px', borderRadius: '12px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '3px' }}>TRY AGAIN</button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,20,0,0.95)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '64px', fontWeight: 'bold', color: '#22c55e', letterSpacing: '4px', marginBottom: '16px' }}>ESCAPED!</h2>
            <p style={{ color: 'rgba(34,197,94,0.6)', fontSize: '20px', marginBottom: '32px' }}>Time remaining: {fmt(timeRemaining)}</p>
            <button onClick={startGame} style={{ padding: '14px 40px', borderRadius: '12px', border: '2px solid #22c55e', color: '#22c55e', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '3px' }}>PLAY AGAIN</button>
          </div>
        </div>
      )}

      {gameState === 'playing' && room && (
        <Canvas shadows camera={{ position: [0, 9, 9], fov: 55 }} style={{ width: '100%', height: '100%' }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#05050f']} />
            <fog attach="fog" args={['#05050f', 12, 28]} />
            <ambientLight intensity={0.4} color="#223322" />
            <spotLight position={[0, 9, 0]} angle={0.7} penumbra={0.5} intensity={3} castShadow color="#22c55e" />
            <pointLight position={[0, 3, 0]} intensity={1} color="#22c55e" distance={8} />
            <Room3D room={room} onDoorClick={handleDoorClick} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

