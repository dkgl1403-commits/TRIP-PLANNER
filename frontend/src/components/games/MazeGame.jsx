import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const HALF = 8;          // half-room size → room is 16×16 units
const SPEED = 6.0;
const DOOR_DIST  = 2.8;  
const TERM_DIST  = 2.5;

const DOOR_POS = {
  N: [0, 0, -HALF],
  S: [0, 0,  HALF],
  E: [ HALF, 0, 0],
  W: [-HALF, 0, 0],
};

const DOOR_ROT = {
  N: [0, 0, 0],
  S: [0, Math.PI, 0],
  E: [0, -Math.PI / 2, 0],
  W: [0,  Math.PI / 2, 0],
};

const TEXT_POS = {
  N: [0, 5.2, -HALF + 0.4],
  S: [0, 5.2,  HALF - 0.4],
  E: [ HALF - 0.4, 5.2, 0],
  W: [-HALF + 0.4, 5.2, 0],
};
const TEXT_ROT = {
  N: [0, 0, 0],             
  S: [0, Math.PI, 0],       
  E: [0,  Math.PI / 2, 0],  
  W: [0, -Math.PI / 2, 0],  
};

// ─── GAME LOGIC ───────────────────────────────────────────────────────────────
function generateSafePath() {
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

// ─── PLAYER CHARACTER ────────────────────────────────────────────────────────
// Using React.forwardRef to allow parent to animate individual parts easily.
const PlayerMesh = React.forwardRef((props, ref) => {
  return (
    <group ref={ref}>
      {/* Left Leg */}
      <mesh name="legL" position={[-0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      {/* Right Leg */}
      <mesh name="legR" position={[0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.27, 0.24, 0.9, 10]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.66, 0]}>
        <sphereGeometry args={[0.23, 16, 12]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Eyes — now facing -z (forward) */}
      <mesh position={[0.09, 1.70, -0.20]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[-0.09, 1.70, -0.20]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      {/* Arms container to allow pivot from shoulder */}
      <group name="armL" position={[-0.35, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.7, 8]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
      <group name="armR" position={[0.35, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.065, 0.065, 0.7, 8]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
      {/* Ground shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
});

// ─── ROOM WALLS ───────────────────────────────────────────────────────────────
function RoomWalls() {
  const H = HALF;
  const neonStrips = [
    { pos: [0, 7.88, -H + 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [0, 7.88,  H - 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [ H - 0.05, 7.88, 0], size: [0.06, 0.08, H * 2] },
    { pos: [-H + 0.05, 7.88, 0], size: [0.06, 0.08, H * 2] },
  ];
  const corners = [[-H, -H], [H, -H], [-H, H], [H, H]];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#12121e" metalness={0.6} roughness={0.5} />
      </mesh>
      <gridHelper args={[H * 2, 16, '#1e441e', '#111a11']} position={[0, 0.01, 0]} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#0a0a14" />
      </mesh>
      {[
        { pos: [0, 4, -H], rot: [0, 0, 0] },
        { pos: [0, 4,  H], rot: [0, Math.PI, 0] },
        { pos: [ H, 4, 0], rot: [0, -Math.PI / 2, 0] },
        { pos: [-H, 4, 0], rot: [0,  Math.PI / 2, 0] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot} receiveShadow>
          <planeGeometry args={[H * 2, 8]} />
          <meshStandardMaterial color="#0e0e1a" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {neonStrips.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}
      {corners.map(([x, z], i) => (
        <mesh key={i} position={[x, 4, z]}>
          <boxGeometry args={[0.4, 8, 0.4]} />
          <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ─── DOOR FRAME ───────────────────────────────────────────────────────────────
function DoorFrame({ dir, isExit }) {
  const pos = DOOR_POS[dir];
  const rot = DOOR_ROT[dir];
  const color = isExit ? '#00ffaa' : '#22c55e';

  return (
    <group position={pos} rotation={rot}>
      <mesh>
        <boxGeometry args={[3.6, 5.8, 0.25]} />
        <meshStandardMaterial color="#060618" metalness={0.95} roughness={0.1} emissive={color} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <boxGeometry args={[3.7, 5.9, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      {isExit && (
        <mesh position={[0, 3.4, 0.15]}>
          <planeGeometry args={[2.8, 0.6]} />
          <meshStandardMaterial color="#003322" emissive="#00ffaa" emissiveIntensity={0.8} />
        </mesh>
      )}
      <pointLight position={[0, 2, 1.5]} intensity={0.8} color={color} distance={5} />
    </group>
  );
}

// ─── TERMINAL ─────────────────────────────────────────────────────────────────
function Terminal({ puzzle }) {
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.75, 2.8, 12]} />
        <meshStandardMaterial color="#0a0a1e" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.1, 0.58]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshStandardMaterial color="#001200" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 3.12, 0.62]}
        rotation={[-0.22, 0, 0]}
        fontSize={0.28}
        anchorX="center"
        anchorY="middle"
        color="#22c55e"
        maxWidth={1.15}
      >
        {puzzle ? puzzle + ' = ?' : 'Find the EXIT!'}
      </Text>
      <pointLight position={[0, 4, 0.5]} intensity={1.5} color="#22c55e" distance={6} />
    </group>
  );
}

// ─── MAIN 3D SCENE ────────────────────────────────────────────────────────────
function GameScene({ room, onDoorTrigger, setNearDoor, setNearTerminal }) {
  const { camera } = useThree();
  const keysRef   = useRef({});
  const playerRef = useRef();
  
  const posRef    = useRef(new THREE.Vector3(0, 0, 5.5));
  const rotRef    = useRef(Math.PI); // 0 = -z, Math.PI = +z. Starts facing +z initially if needed, but lets face -z (North)
  const targetRot = useRef(0);
  const coolRef   = useRef(false);
  const walkTime  = useRef(0);

  useEffect(() => {
    posRef.current.set(0, 0, 5.5);
    rotRef.current = 0;
    targetRot.current = 0;
    // Fixed camera, offset +y and +z
    camera.position.set(0, 12, 13);
    camera.lookAt(0, 1, 0);
  }, [room, camera]);

  useEffect(() => {
    const dn = (e) => { keysRef.current[e.key] = true; }; // Don't prevent default, lets avoid interfering with back buttons if not needed.
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, dt) => {
    const k = keysRef.current;
    
    // Absolute direction mapping
    let dx = 0, dz = 0;
    if (k['ArrowUp']   || k['w'] || k['W']) dz -= 1;
    if (k['ArrowDown'] || k['s'] || k['S']) dz += 1;
    if (k['ArrowLeft']  || k['a'] || k['A']) dx -= 1;
    if (k['ArrowRight'] || k['d'] || k['D']) dx += 1;

    let isMoving = false;
    if (dx !== 0 || dz !== 0) {
      isMoving = true;
      // Normalize vector
      const len = Math.hypot(dx, dz);
      dx /= len; dz /= len;

      targetRot.current = Math.atan2(dx, dz);

      const spd = SPEED * dt;
      posRef.current.x += dx * spd;
      posRef.current.z += dz * spd;
    }

    // Smooth rotation towards target rotation
    let diff = targetRot.current - rotRef.current;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    rotRef.current += diff * 12 * dt;

    const pos = posRef.current;
    // Clamp inside room
    pos.x = Math.max(-HALF + 0.7, Math.min(HALF - 0.7, pos.x));
    pos.z = Math.max(-HALF + 0.7, Math.min(HALF - 0.7, pos.z));

    // Update player mesh & animation
    if (playerRef.current) {
      playerRef.current.position.copy(pos);
      playerRef.current.rotation.y = rotRef.current;

      const pGroup = playerRef.current;
      const legL = pGroup.getObjectByName('legL');
      const legR = pGroup.getObjectByName('legR');
      const armL = pGroup.getObjectByName('armL');
      const armR = pGroup.getObjectByName('armR');

      if (isMoving) {
        walkTime.current += dt * 15; // Animation speed
        const t = walkTime.current;
        if(legL) legL.position.z = Math.sin(t) * 0.3;
        if(legL) legL.position.y = 0.3 + Math.abs(Math.cos(t)) * 0.1;
        
        if(legR) legR.position.z = Math.sin(t + Math.PI) * 0.3;
        if(legR) legR.position.y = 0.3 + Math.abs(Math.cos(t + Math.PI)) * 0.1;

        if(armL) armL.rotation.x = Math.sin(t + Math.PI) * 0.5;
        if(armR) armR.rotation.x = Math.sin(t) * 0.5;

        // Bobbing body
        pGroup.position.y = pos.y + Math.abs(Math.sin(t)) * 0.05;
      } else {
        // Return to idle
        if(legL) { legL.position.z = THREE.MathUtils.lerp(legL.position.z, 0, 0.2); legL.position.y = 0.3; }
        if(legR) { legR.position.z = THREE.MathUtils.lerp(legR.position.z, 0, 0.2); legR.position.y = 0.3; }
        if(armL) armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, 0, 0.2);
        if(armR) armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, 0, 0.2);
        pGroup.position.y = THREE.MathUtils.lerp(pGroup.position.y, pos.y, 0.2);
      }
    }

    // Camera strictly follows player with fixed isometric-ish offset
    const camTargetPos = pos.clone().add(new THREE.Vector3(0, 12, 11));
    camera.position.lerp(camTargetPos, 0.1);
    camera.lookAt(pos.x, 1.5, pos.z - 2); // Look slightly ahead of player

    // Proximity checks
    let nd = null, ndist = DOOR_DIST;
    room.availableDoors.forEach(dir => {
      const dp = DOOR_POS[dir];
      const d  = Math.hypot(pos.x - dp[0], pos.z - dp[2]);
      if (d < ndist) { ndist = d; nd = dir; }
    });
    setNearDoor(nd);
    setNearTerminal(Math.hypot(pos.x, pos.z) < TERM_DIST);

    if ((k['e'] || k['E'] || k['Enter']) && nd && !coolRef.current) {
      coolRef.current = true;
      setTimeout(() => { coolRef.current = false; }, 700);
      onDoorTrigger(nd);
    }
  });

  return (
    <>
      <color attach="background" args={['#080812']} />
      <fog attach="fog" args={['#080812', 15, 30]} />

      <ambientLight intensity={0.85} color="#ffffff" />
      <directionalLight position={[4, 10, 6]} intensity={1.2} color="#e8f0ff" castShadow />
      <directionalLight position={[-4, 8, -4]} intensity={0.6} color="#c0d0ff" />
      <spotLight position={[0, 9, 0]} angle={0.9} penumbra={0.5} intensity={2.5} color="#ddffdd" castShadow />

      <RoomWalls />
      <Terminal puzzle={room.puzzle} />

      {room.availableDoors.map(dir => (
        <DoorFrame key={dir} dir={dir} isExit={room.isExit && dir === room.correctDoor} />
      ))}

      {room.availableDoors.map(dir => {
        if (room.isExit && dir === room.correctDoor) {
          return (
            <Text key={dir} position={TEXT_POS[dir]} rotation={TEXT_ROT[dir]} fontSize={0.75} anchorX="center" anchorY="middle" color="#00ffaa" outlineWidth={0.06} outlineColor="#000">
              EXIT
            </Text>
          );
        }
        return (
          <Text key={dir} position={TEXT_POS[dir]} rotation={TEXT_ROT[dir]} fontSize={1.7} anchorX="center" anchorY="middle" color="#22c55e" outlineWidth={0.08} outlineColor="#000">
            {String(room.doorNumbers[dir])}
          </Text>
        );
      })}

      <PlayerMesh ref={playerRef} />
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MazeGame({ onBack }) {
  const [gameState, setGameState] = useState('menu');
  const [path,      setPath]      = useState([]);
  const [stepIdx,   setStepIdx]   = useState(0);
  const [room,      setRoom]      = useState(null);
  const [timeLeft,  setTimeLeft]  = useState(180);
  const [nearDoor,  setNearDoor]  = useState(null);
  const [nearTerm,  setNearTerm]  = useState(false);
  const [trapMsg,   setTrapMsg]   = useState('');

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
      setNearDoor(null);
      setNearTerm(false);
      setRoom(generateRoom(path[next], path[next + 1]));
    } else {
      setTrapMsg('You walked into a TRAP!');
      setGameState('trap');
    }
  };

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const btnBase = { fontFamily: 'monospace', cursor: 'pointer', border: 'none', outline: 'none' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#080812', fontFamily: 'monospace', overflow: 'hidden' }}>
      {gameState === 'playing' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0.75), transparent)' }}>
          <button onClick={onBack} style={{ ...btnBase, pointerEvents: 'auto', padding: '8px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(34,197,94,0.5)', color: '#22c55e', fontSize: '13px' }}>
            &#8592; Back
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.82)', border: '1px solid ' + (timeLeft < 30 ? '#ef4444' : 'rgba(34,197,94,0.45)'), color: timeLeft < 30 ? '#ef4444' : '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.55, letterSpacing: '2px' }}>TIME</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{fmt(timeLeft)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.82)', border: '1px solid rgba(34,197,94,0.45)', color: '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.55, letterSpacing: '2px' }}>ROOM</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stepIdx + 1}/{path.length}</div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (nearDoor || nearTerm) && (
        <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 25, background: 'rgba(0,0,0,0.88)', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
          {nearTerm && !nearDoor && ('Puzzle: ' + room.puzzle + ' = ?')}
          {nearDoor && ('Press E  →  Door [' + room.doorNumbers[nearDoor] + ']')}
        </div>
      )}

      {gameState === 'playing' && (
        <div style={{ position: 'absolute', bottom: '14px', right: '18px', zIndex: 25, color: 'rgba(34,197,94,0.4)', fontSize: '11px', lineHeight: '1.8', textAlign: 'right' }}>
          WASD / Arrows — Move<br />E — Enter nearby door
        </div>
      )}

      {gameState === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,4,14,0.98)' }}>
          <div style={{ maxWidth: '460px', width: '90%', padding: '40px', background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', textAlign: 'center', position: 'relative' }}>
            <button onClick={onBack} style={{ ...btnBase, position: 'absolute', top: '14px', left: '14px', padding: '6px 12px', borderRadius: '7px', background: 'transparent', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(34,197,94,0.5)', fontSize: '12px' }}>&#8592; Back</button>
            <div style={{ fontSize: '52px', marginBottom: '6px' }}>&#127962;</div>
            <h2 style={{ color: '#22c55e', fontSize: '28px', letterSpacing: '6px', margin: '0 0 4px' }}>THE MAZE</h2>
            <p style={{ color: 'rgba(34,197,94,0.35)', fontSize: '10px', letterSpacing: '3px', marginBottom: '22px' }}>ESCAPE OR DIE TRYING</p>
            <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '10px', padding: '14px 18px', marginBottom: '22px', textAlign: 'left', color: 'rgba(34,197,94,0.65)', fontSize: '13px', lineHeight: '2.0' }}>
              &#8227; Walk with <strong>WASD</strong> or Arrow keys.<br />
              &#8227; Walk up to the terminal — it shows the math puzzle.<br />
              &#8227; Solve it, find the door with the matching neon number.<br />
              &#8227; Walk close and press <strong>E</strong> to enter.<br />
              &#8227; <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Wrong door = instant Game Over.</span><br />
              &#8227; Reach the cyan EXIT door to escape. 3 minutes.
            </div>
            <button onClick={startGame} style={{ ...btnBase, width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 'bold', fontSize: '14px', letterSpacing: '4px' }}>
              ENTER THE MAZE
            </button>
          </div>
        </div>
      )}

      {gameState === 'trap' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,0,0,0.97)' }}>
          <div style={{ fontSize: '68px', marginBottom: '8px' }}>&#9762;</div>
          <h2 style={{ color: '#ef4444', fontSize: '50px', letterSpacing: '4px', marginBottom: '10px', textShadow: '0 0 30px #ef4444aa' }}>TRAP!</h2>
          <p style={{ color: 'rgba(239,68,68,0.65)', fontSize: '17px', marginBottom: '34px' }}>{trapMsg}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ ...btnBase, padding: '12px 28px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '10px', fontSize: '13px', letterSpacing: '2px' }}>TRY AGAIN</button>
            <button onClick={onBack}    style={{ ...btnBase, padding: '12px 28px', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.45)', background: 'transparent', borderRadius: '10px', fontSize: '13px' }}>BACK</button>
          </div>
        </div>
      )}

      {gameState === 'game_over' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,0,0,0.97)' }}>
          <h2 style={{ color: '#ef4444', fontSize: '52px', letterSpacing: '4px', marginBottom: '12px' }}>TIME&#39;S UP</h2>
          <p style={{ color: 'rgba(239,68,68,0.55)', fontSize: '17px', marginBottom: '34px' }}>The maze consumed you.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ ...btnBase, padding: '12px 28px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '10px', letterSpacing: '2px', fontSize: '13px' }}>TRY AGAIN</button>
            <button onClick={onBack}    style={{ ...btnBase, padding: '12px 28px', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.4)', background: 'transparent', borderRadius: '10px', fontSize: '13px' }}>BACK</button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,14,0,0.97)' }}>
          <div style={{ fontSize: '68px', marginBottom: '8px' }}>&#127942;</div>
          <h2 style={{ color: '#22c55e', fontSize: '52px', letterSpacing: '4px', marginBottom: '12px', textShadow: '0 0 40px #22c55eaa' }}>ESCAPED!</h2>
          <p style={{ color: 'rgba(34,197,94,0.55)', fontSize: '17px', marginBottom: '34px' }}>Time remaining: {fmt(timeLeft)}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ ...btnBase, padding: '12px 28px', border: '2px solid #22c55e', color: '#22c55e', background: 'transparent', borderRadius: '10px', letterSpacing: '2px', fontSize: '13px' }}>PLAY AGAIN</button>
            <button onClick={onBack}    style={{ ...btnBase, padding: '12px 28px', border: '1px solid rgba(34,197,94,0.3)', color: 'rgba(34,197,94,0.4)', background: 'transparent', borderRadius: '10px', fontSize: '13px' }}>BACK</button>
          </div>
        </div>
      )}

      {gameState === 'playing' && room && (
        <Canvas
          shadows
          camera={{ position: [0, 11, 14], fov: 60 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Suspense fallback={null}>
            <GameScene
              room={room}
              onDoorTrigger={handleDoor}
              setNearDoor={setNearDoor}
              setNearTerminal={(v) => setNearTerm(v)}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
