import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── CONSTANTS ────────────────────────────────────────────────
const HALF = 8;
const SPEED = 5.5;
const DOOR_DIST = 2.8;
const TERM_DIST = 2.5;

const DOOR_POS = {
  N: [0, 0, -HALF],
  S: [0, 0, HALF],
  E: [HALF, 0, 0],
  W: [-HALF, 0, 0],
};
const DOOR_ROT = {
  N: [0, 0, 0],
  S: [0, Math.PI, 0],
  E: [0, -Math.PI / 2, 0],
  W: [0, Math.PI / 2, 0],
};

// ─── GAME LOGIC ───────────────────────────────────────────────
function generateSafePath() {
  // Start: row=3 col=0 (bottom-left), End: row=0 col=3 (top-right)
  let row = 3, col = 0;
  const path = [{ row, col }];
  while (row !== 0 || col !== 3) {
    const canN = row > 0, canE = col < 3;
    if (canN && canE) { if (Math.random() > 0.5) row--; else col++; }
    else if (canN) row--;
    else col++;
    path.push({ row, col });
  }
  return path;
}

function getDir(from, to) {
  if (to.row < from.row) return 'N';
  if (to.row > from.row) return 'S';
  if (to.col > from.col) return 'E';
  return 'W';
}

function getAvailableDoors(row, col) {
  const d = [];
  if (row > 0) d.push('N');
  if (row < 3) d.push('S');
  if (col < 3) d.push('E');
  if (col > 0) d.push('W');
  return d;
}

function makePuzzle(target) {
  const r = Math.random();
  if (r < 0.4) {
    const a = Math.max(1, Math.floor(Math.random() * (target - 1)));
    return a + ' + ' + (target - a);
  } else if (r < 0.7) {
    const extra = Math.floor(Math.random() * 30) + 10;
    return (target + extra) + ' - ' + extra;
  } else {
    for (let i = 2; i <= Math.sqrt(target); i++) {
      if (target % i === 0) return i + ' x ' + (target / i);
    }
    const a = Math.max(1, Math.floor(Math.random() * (target - 1)));
    return a + ' + ' + (target - a);
  }
}

function generateRoom(current, next) {
  const { row, col } = current;
  const isExit = !next;
  const allDoors = getAvailableDoors(row, col);
  const correctDoor = next ? getDir(current, next) : null;

  const target = Math.floor(Math.random() * 60) + 20;
  const doorNumbers = {};
  const used = new Set([target]);

  allDoors.forEach(d => {
    if (d === correctDoor) {
      doorNumbers[d] = target;
    } else {
      let n;
      do { n = Math.floor(Math.random() * 60) + 20; } while (used.has(n));
      used.add(n);
      doorNumbers[d] = n;
    }
  });

  return {
    row, col, isExit,
    availableDoors: allDoors,
    correctDoor,
    doorNumbers,
    puzzle: isExit ? null : makePuzzle(target),
  };
}

// ─── PLAYER CHARACTER ─────────────────────────────────────────
function PlayerMesh({ meshRef }) {
  return (
    <group ref={meshRef}>
      {/* Legs */}
      <mesh position={[-0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      <mesh position={[0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.26, 0.23, 0.85, 10]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial color="#f5c27a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#f5c27a" roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.09, 1.69, 0.19]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[-0.09, 1.69, 0.19]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.4, 0.88, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.065, 0.065, 0.65, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.4, 0.88, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.065, 0.065, 0.65, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── ROOM ENVIRONMENT ─────────────────────────────────────────
function RoomWalls() {
  const H = HALF;
  const strips = [
    { pos: [0, 7.85, -H + 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [0, 7.85, H - 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [H - 0.05, 7.85, 0], size: [0.06, 0.08, H * 2] },
    { pos: [-H + 0.05, 7.85, 0], size: [0.06, 0.08, H * 2] },
  ];
  const corners = [[-H, -H], [H, -H], [-H, H], [H, H]];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#0b0b18" metalness={0.7} roughness={0.4} />
      </mesh>
      <gridHelper args={[H * 2, 16, '#182818', '#0d140d']} position={[0, 0.01, 0]} />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#06060c" />
      </mesh>

      {/* 4 Walls */}
      <mesh position={[0, 4, -H]}>
        <planeGeometry args={[H * 2, 8]} />
        <meshStandardMaterial color="#090914" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4, H]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[H * 2, 8]} />
        <meshStandardMaterial color="#090914" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[H, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[H * 2, 8]} />
        <meshStandardMaterial color="#090914" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-H, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[H * 2, 8]} />
        <meshStandardMaterial color="#090914" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Neon ceiling strips */}
      {strips.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}

      {/* Corner pillars */}
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, 4, z]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ─── DOOR MESH ────────────────────────────────────────────────
function DoorMesh({ dir, number, isExit }) {
  const pos = DOOR_POS[dir];
  const rot = DOOR_ROT[dir];
  const color = isExit ? '#00ffaa' : '#22c55e';

  return (
    <group position={pos} rotation={rot}>
      <mesh>
        <boxGeometry args={[3.6, 5.8, 0.3]} />
        <meshStandardMaterial color="#040418" metalness={0.95} roughness={0.1} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[3.7, 5.9, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      {isExit ? (
        <Text position={[0, 2, 0.2]} fontSize={0.7} anchorX="center" anchorY="middle" color={color} outlineWidth={0.05} outlineColor="#000">
          EXIT
        </Text>
      ) : (
        <Text position={[0, 2.4, 0.2]} fontSize={1.6} anchorX="center" anchorY="middle" color={color} outlineWidth={0.07} outlineColor="#000">
          {String(number)}
        </Text>
      )}
      <pointLight position={[0, 2, 1.5]} intensity={0.7} color={color} distance={5} />
    </group>
  );
}

// ─── TERMINAL MESH ────────────────────────────────────────────
function Terminal({ puzzle }) {
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.75, 2.8, 12]} />
        <meshStandardMaterial color="#0a0a1e" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.1, 0.58]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.15, 0.65]} />
        <meshStandardMaterial color="#001200" emissive="#22c55e" emissiveIntensity={0.45} />
      </mesh>
      <Text position={[0, 3.1, 0.62]} rotation={[-0.22, 0, 0]} fontSize={0.28} anchorX="center" anchorY="middle" color="#22c55e" maxWidth={1.1}>
        {puzzle ? puzzle + ' = ?' : 'Find the EXIT!'}
      </Text>
      <pointLight position={[0, 4, 0.5]} intensity={1.2} color="#22c55e" distance={5} />
    </group>
  );
}

// ─── GAME SCENE (R3F) ─────────────────────────────────────────
function GameScene({ room, onDoorTrigger, setNearDoor, setNearTerminal }) {
  const { camera } = useThree();
  const keysRef = useRef({});
  const playerRef = useRef();
  const posRef = useRef(new THREE.Vector3(0, 0, 3));
  const rotRef = useRef(Math.PI); // facing north (toward terminal)
  const coolRef = useRef(false);

  useEffect(() => {
    posRef.current.set(0, 0, 4);
    rotRef.current = Math.PI;
  }, [room]);

  useEffect(() => {
    const dn = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((_, dt) => {
    const k = keysRef.current;
    const spd = SPEED * dt;

    if (k['ArrowLeft']  || k['a'] || k['A']) rotRef.current += 2.0 * dt;
    if (k['ArrowRight'] || k['d'] || k['D']) rotRef.current -= 2.0 * dt;

    const fwd = new THREE.Vector3(-Math.sin(rotRef.current), 0, -Math.cos(rotRef.current));
    const pos = posRef.current;
    if (k['ArrowUp']   || k['w'] || k['W']) pos.addScaledVector(fwd, spd);
    if (k['ArrowDown'] || k['s'] || k['S']) pos.addScaledVector(fwd, -spd);

    pos.x = Math.max(-HALF + 0.6, Math.min(HALF - 0.6, pos.x));
    pos.z = Math.max(-HALF + 0.6, Math.min(HALF - 0.6, pos.z));

    if (playerRef.current) {
      playerRef.current.position.copy(pos);
      playerRef.current.rotation.y = rotRef.current;
    }

    // Third-person camera behind player
    const behind = new THREE.Vector3(-Math.sin(rotRef.current), 0, -Math.cos(rotRef.current)).multiplyScalar(-7);
    const camTarget = pos.clone().add(behind).add(new THREE.Vector3(0, 9, 0));
    camera.position.lerp(camTarget, 0.06);
    camera.lookAt(pos.x, 1.5, pos.z);

    // Door proximity
    let nd = null, ndist = DOOR_DIST;
    room.availableDoors.forEach(dir => {
      const dp = DOOR_POS[dir];
      const d = Math.hypot(pos.x - dp[0], pos.z - dp[2]);
      if (d < ndist) { ndist = d; nd = dir; }
    });
    setNearDoor(nd);

    // Terminal proximity
    const td = Math.hypot(pos.x, pos.z);
    setNearTerminal(td < TERM_DIST);

    // E to interact with door
    if ((k['e'] || k['E'] || k['Enter']) && nd && !coolRef.current) {
      coolRef.current = true;
      setTimeout(() => { coolRef.current = false; }, 700);
      onDoorTrigger(nd);
    }
  });

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 14, 36]} />
      <ambientLight intensity={0.3} color="#112211" />
      <spotLight position={[0, 10, 0]} angle={0.85} penumbra={0.6} intensity={2.5} castShadow color="#bbffbb" />

      <RoomWalls />
      <Terminal puzzle={room.puzzle} />
      {room.availableDoors.map(dir => (
        <DoorMesh key={dir} dir={dir} number={room.doorNumbers[dir]} isExit={room.isExit && dir === room.correctDoor} />
      ))}
      <PlayerMesh meshRef={playerRef} />
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function MazeGame({ onBack }) {
  const [gameState, setGameState] = useState('menu');
  const [path, setPath]           = useState([]);
  const [stepIdx, setStepIdx]     = useState(0);
  const [room, setRoom]           = useState(null);
  const [timeLeft, setTimeLeft]   = useState(180);
  const [nearDoor, setNearDoor]   = useState(null);
  const [nearTerm, setNearTerm]   = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [trapMsg, setTrapMsg]     = useState('');

  useEffect(() => {
    if (gameState !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { setGameState('game_over'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const startGame = () => {
    const p = generateSafePath();
    setPath(p);
    setStepIdx(0);
    setRoom(generateRoom(p[0], p[1]));
    setTimeLeft(180);
    setShowPuzzle(false);
    setNearDoor(null);
    setNearTerm(false);
    setGameState('playing');
  };

  const handleDoor = (dir) => {
    if (!room) return;
    if (room.isExit) { setGameState('won'); return; }
    if (dir === room.correctDoor) {
      const next = stepIdx + 1;
      setStepIdx(next);
      setShowPuzzle(false);
      setNearDoor(null);
      setNearTerm(false);
      setRoom(generateRoom(path[next], path[next + 1]));
    } else {
      setTrapMsg('You chose the wrong door!');
      setGameState('trap');
    }
  };

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#050510', fontFamily: 'monospace', overflow: 'hidden' }}>

      {/* HUD */}
      {gameState === 'playing' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0.7), transparent)' }}>
          <button onClick={onBack} style={{ pointerEvents: 'auto', padding: '8px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', cursor: 'pointer', fontFamily: 'monospace', fontSize: '13px' }}>
            &#8592; Back
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid ' + (timeLeft < 30 ? '#ef4444' : 'rgba(34,197,94,0.4)'), color: timeLeft < 30 ? '#ef4444' : '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '2px' }}>TIME</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{fmt(timeLeft)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '2px' }}>ROOM</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stepIdx + 1}/{path.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Interaction hint */}
      {gameState === 'playing' && (nearDoor || nearTerm) && (
        <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 25, background: 'rgba(0,0,0,0.88)', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
          {nearTerm && !showPuzzle && 'Press E to read terminal'}
          {nearTerm && showPuzzle && ('PUZZLE: ' + room.puzzle + ' = ?')}
          {nearDoor && !nearTerm && ('Press E to enter door [' + room.doorNumbers[nearDoor] + ']')}
        </div>
      )}

      {/* Controls */}
      {gameState === 'playing' && (
        <div style={{ position: 'absolute', bottom: '14px', right: '18px', zIndex: 25, color: 'rgba(34,197,94,0.45)', fontSize: '11px', lineHeight: '1.7', textAlign: 'right' }}>
          WASD / Arrows — Move<br />E — Interact
        </div>
      )}

      {/* MENU */}
      {gameState === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,3,12,0.98)' }}>
          <div style={{ maxWidth: '460px', width: '90%', padding: '40px', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', textAlign: 'center', position: 'relative' }}>
            <button onClick={onBack} style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e55', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px' }}>&#8592; Back</button>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>&#127962;</div>
            <h2 style={{ color: '#22c55e', fontSize: '30px', letterSpacing: '6px', margin: '0 0 4px' }}>THE MAZE</h2>
            <p style={{ color: 'rgba(34,197,94,0.4)', fontSize: '11px', letterSpacing: '3px', marginBottom: '24px' }}>ESCAPE OR DIE TRYING</p>
            <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left', color: 'rgba(34,197,94,0.65)', fontSize: '13px', lineHeight: '2.0' }}>
              &#8227; Walk around the room with WASD or Arrow Keys<br />
              &#8227; Find the terminal — press E to read the math puzzle<br />
              &#8227; Walk to a door — press E to enter<br />
              &#8227; Puzzle answer = safe door number<br />
              &#8227; <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Wrong door = instant Game Over</span><br />
              &#8227; Reach the EXIT to escape. You have 3 minutes.
            </div>
            <button onClick={startGame} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 'bold', fontSize: '14px', letterSpacing: '4px', cursor: 'pointer', fontFamily: 'monospace' }}>
              ENTER THE MAZE
            </button>
          </div>
        </div>
      )}

      {/* TRAP */}
      {gameState === 'trap' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,0,0,0.97)' }}>
          <div style={{ fontSize: '72px', marginBottom: '10px', animation: 'pulse 0.5s' }}>&#9762;</div>
          <h2 style={{ color: '#ef4444', fontSize: '50px', letterSpacing: '4px', marginBottom: '10px', textShadow: '0 0 30px #ef4444aa' }}>TRAP!</h2>
          <p style={{ color: 'rgba(239,68,68,0.65)', fontSize: '17px', marginBottom: '36px' }}>{trapMsg}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ padding: '13px 30px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px' }}>TRY AGAIN</button>
            <button onClick={onBack} style={{ padding: '13px 30px', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.5)', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '13px' }}>BACK</button>
          </div>
        </div>
      )}

      {/* GAME OVER (timeout) */}
      {gameState === 'game_over' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,0,0,0.97)' }}>
          <h2 style={{ color: '#ef4444', fontSize: '52px', letterSpacing: '4px', marginBottom: '12px' }}>TIME&#39;S UP</h2>
          <p style={{ color: 'rgba(239,68,68,0.55)', fontSize: '17px', marginBottom: '34px' }}>The maze consumed you.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ padding: '13px 30px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '2px' }}>TRY AGAIN</button>
            <button onClick={onBack} style={{ padding: '13px 30px', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.4)', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace' }}>BACK</button>
          </div>
        </div>
      )}

      {/* WON */}
      {gameState === 'won' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,14,0,0.97)' }}>
          <div style={{ fontSize: '72px', marginBottom: '10px' }}>&#127942;</div>
          <h2 style={{ color: '#22c55e', fontSize: '52px', letterSpacing: '4px', marginBottom: '12px', textShadow: '0 0 40px #22c55eaa' }}>ESCAPED!</h2>
          <p style={{ color: 'rgba(34,197,94,0.55)', fontSize: '17px', marginBottom: '34px' }}>Time remaining: {fmt(timeLeft)}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ padding: '13px 30px', border: '2px solid #22c55e', color: '#22c55e', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '2px' }}>PLAY AGAIN</button>
            <button onClick={onBack} style={{ padding: '13px 30px', border: '1px solid rgba(34,197,94,0.3)', color: 'rgba(34,197,94,0.4)', background: 'transparent', borderRadius: '10px', cursor: 'pointer', fontFamily: 'monospace' }}>BACK</button>
          </div>
        </div>
      )}

      {/* 3D CANVAS */}
      {gameState === 'playing' && room && (
        <Canvas shadows camera={{ position: [0, 9, 12], fov: 60 }} style={{ position: 'absolute', inset: 0 }}>
          <Suspense fallback={null}>
            <GameScene
              room={room}
              onDoorTrigger={handleDoor}
              setNearDoor={setNearDoor}
              setNearTerminal={(v) => { setNearTerm(v); if (v) setShowPuzzle(true); }}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
