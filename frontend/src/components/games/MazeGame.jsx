import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const HALF = 8;
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

// Number positions above doors (slightly in front of the wall)
const TEXT_POS = {
  N: [0, 5.2, -HALF + 0.5],
  S: [0, 5.2,  HALF - 0.5],
  E: [ HALF - 0.5, 5.2, 0],
  W: [-HALF + 0.5, 5.2, 0],
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

// ─── HARDER MATH PUZZLES ─────────────────────────────────────────────────────
function makePuzzle(target) {
  const r = Math.random();
  if (r < 0.35) {
    // Addition of 3-4 digit numbers
    const a = Math.floor(Math.random() * (target - 100)) + 100;
    const b = target - a;
    if (b > 0) return a + ' + ' + b;
    const fa = Math.max(1, Math.floor(target / 2));
    return fa + ' + ' + (target - fa);
  } else if (r < 0.65) {
    // Subtraction of 3-4 digit numbers
    const extra = Math.floor(Math.random() * 900) + 100;
    return (target + extra) + ' \u2212 ' + extra;
  } else {
    // Multiplication: 3-digit x 1-digit
    for (let d = 9; d >= 2; d--) {
      if (target % d === 0) {
        const other = target / d;
        if (other >= 100 && other <= 999) return other + ' \u00d7 ' + d;
        if (d >= 100 && d <= 999) return d + ' \u00d7 ' + other;
      }
    }
    const extra = Math.floor(Math.random() * 900) + 100;
    return (target + extra) + ' \u2212 ' + extra;
  }
}

function generateRoom(current, next) {
  const { row, col } = current;
  const isExit = !next;
  const allDoors = getAvailableDoors(row, col);
  const correctDoor = next ? getDir(current, next) : null;

  // Target is now a 3-4 digit number for harder puzzles
  const target = Math.floor(Math.random() * 900) + 100; // 100-999
  const doorNumbers = {};
  const used = new Set([target]);

  allDoors.forEach(d => {
    if (d === correctDoor) {
      doorNumbers[d] = target;
    } else {
      let n;
      do { n = Math.floor(Math.random() * 900) + 100; } while (used.has(n));
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
const PlayerMesh = React.forwardRef((props, ref) => {
  return (
    <group ref={ref}>
      <mesh name="legL" position={[-0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      <mesh name="legR" position={[0.14, 0.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 8]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.27, 0.24, 0.9, 10]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0, 1.66, 0]}>
        <sphereGeometry args={[0.23, 16, 12]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Eyes placed at -z to correctly face forward */}
      <mesh position={[0.09, 1.70, -0.20]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[-0.09, 1.70, -0.20]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
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
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
});

// ─── DUST PARTICLES ──────────────────────────────────────────────────────────
function DustParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * HALF * 1.8;
      arr[i * 3 + 1] = Math.random() * 7 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * HALF * 1.8;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += dt * 0.15 * (0.5 + Math.sin(i) * 0.5);
      if (pos[i * 3 + 1] > 7.5) pos[i * 3 + 1] = 0.5;
      pos[i * 3] += Math.sin(Date.now() * 0.0003 + i) * dt * 0.08;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#88aa88" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

// ─── ROOM WALLS (ENHANCED) ───────────────────────────────────────────────────
function RoomWalls() {
  const H = HALF;
  
  // Wall panel lines for texture feel
  const panelLines = [];
  for (let i = -H + 2; i < H; i += 2) {
    panelLines.push(
      { pos: [i, 4, -H + 0.01], size: [0.02, 8, 0.01] },
      { pos: [i, 4,  H - 0.01], size: [0.02, 8, 0.01] },
      { pos: [H - 0.01, 4, i], size: [0.01, 8, 0.02] },
      { pos: [-H + 0.01, 4, i], size: [0.01, 8, 0.02] },
    );
  }
  const hLines = [
    { pos: [0, 4, -H + 0.01], size: [H * 2, 0.02, 0.01] },
    { pos: [0, 4,  H - 0.01], size: [H * 2, 0.02, 0.01] },
    { pos: [H - 0.01, 4, 0],  size: [0.01, 0.02, H * 2] },
    { pos: [-H + 0.01, 4, 0], size: [0.01, 0.02, H * 2] },
  ];

  const neonStrips = [
    { pos: [0, 7.88, -H + 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [0, 7.88,  H - 0.05], size: [H * 2, 0.08, 0.06] },
    { pos: [ H - 0.05, 7.88, 0], size: [0.06, 0.08, H * 2] },
    { pos: [-H + 0.05, 7.88, 0], size: [0.06, 0.08, H * 2] },
    { pos: [0, 0.04, -H + 0.05], size: [H * 2, 0.04, 0.04] },
    { pos: [0, 0.04,  H - 0.05], size: [H * 2, 0.04, 0.04] },
    { pos: [ H - 0.05, 0.04, 0], size: [0.04, 0.04, H * 2] },
    { pos: [-H + 0.05, 0.04, 0], size: [0.04, 0.04, H * 2] },
  ];
  const corners = [[-H, -H], [H, -H], [-H, H], [H, H]];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#0d0d18" metalness={0.85} roughness={0.15} />
      </mesh>
      <gridHelper args={[H * 2, 16, '#1a3a1a', '#0a150a']} position={[0, 0.01, 0]} />
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[H * 2, H * 2]} />
        <meshStandardMaterial color="#060610" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Walls */}
      {[
        { pos: [0, 4, -H], rot: [0, 0, 0] },
        { pos: [0, 4,  H], rot: [0, Math.PI, 0] },
        { pos: [ H, 4, 0], rot: [0, -Math.PI / 2, 0] },
        { pos: [-H, 4, 0], rot: [0,  Math.PI / 2, 0] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot} receiveShadow>
          <planeGeometry args={[H * 2, 8]} />
          <meshStandardMaterial color="#0a0a16" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}
      
      {/* Panel lines */}
      {panelLines.map((p, i) => (
        <mesh key={`pl-${i}`} position={p.pos}>
          <boxGeometry args={p.size} />
          <meshBasicMaterial color="#1a2a1a" transparent opacity={0.4} />
        </mesh>
      ))}
      {hLines.map((p, i) => (
        <mesh key={`hl-${i}`} position={p.pos}>
          <boxGeometry args={p.size} />
          <meshBasicMaterial color="#1a2a1a" transparent opacity={0.3} />
        </mesh>
      ))}
      
      {/* Neon strips */}
      {neonStrips.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}
      
      {/* Corner pillars */}
      {corners.map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, 4, z]}>
            <boxGeometry args={[0.4, 8, 0.4]} />
            <meshStandardMaterial color="#111" metalness={0.95} roughness={0.1} emissive="#22c55e" emissiveIntensity={0.4} />
          </mesh>
          <pointLight position={[x * 0.9, 1, z * 0.9]} intensity={0.3} color="#22c55e" distance={5} decay={2} />
        </group>
      ))}
      
      <DustParticles />
    </group>
  );
}

// ─── DOOR WITH REALISTIC SWING ANIMATION ─────────────────────────────────────
function AnimatedDoor({ dir, isExit, isNear }) {
  const pos = DOOR_POS[dir];
  const rot = DOOR_ROT[dir];
  const color = isExit ? '#00ffaa' : '#22c55e';
  const doorPanelRef = useRef();
  const openAngle = useRef(0);

  useFrame((_, dt) => {
    if (!doorPanelRef.current) return;
    const targetAngle = isNear ? -Math.PI / 2.2 : 0;
    openAngle.current = THREE.MathUtils.lerp(openAngle.current, targetAngle, dt * 4);
    doorPanelRef.current.rotation.y = openAngle.current;
  });

  return (
    <group position={pos} rotation={rot}>
      {/* Left frame pillar */}
      <mesh position={[-1.7, 2.9, 0]}>
        <boxGeometry args={[0.25, 5.8, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.15} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      {/* Right frame pillar */}
      <mesh position={[1.7, 2.9, 0]}>
        <boxGeometry args={[0.25, 5.8, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.15} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      {/* Top frame beam */}
      <mesh position={[0, 5.85, 0]}>
        <boxGeometry args={[3.65, 0.25, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.15} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      {/* Threshold */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[3.15, 0.06, 0.35]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.15} />
      </mesh>

      {/* Hinged door panel — pivots from the left edge */}
      <group position={[-1.55, 2.9, 0.1]} ref={doorPanelRef}>
        <mesh position={[1.55, 0, 0]}>
          <boxGeometry args={[3.1, 5.6, 0.12]} />
          <meshStandardMaterial 
            color={isExit ? "#0a2a20" : "#0e0e22"} 
            metalness={0.7} 
            roughness={0.35}
            emissive={color}
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* Panel details */}
        <mesh position={[1.55, 1.6, 0.07]}>
          <boxGeometry args={[2.6, 2.0, 0.02]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.03} />
        </mesh>
        <mesh position={[1.55, -1.2, 0.07]}>
          <boxGeometry args={[2.6, 2.0, 0.02]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.03} />
        </mesh>
        
        {/* Doorknob */}
        <mesh position={[2.8, 0, 0.12]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#c0a050" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[2.8, 0, 0.08]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshStandardMaterial color="#b09040" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* EXIT sign */}
      {isExit && (
        <mesh position={[0, 6.3, 0.15]}>
          <boxGeometry args={[2.2, 0.5, 0.08]} />
          <meshStandardMaterial color="#003322" emissive="#00ffaa" emissiveIntensity={0.9} />
        </mesh>
      )}

      <pointLight 
        position={[0, 3, 1.5]} 
        intensity={isNear ? 2.5 : 0.6} 
        color={color} 
        distance={6} 
        decay={2}
      />
    </group>
  );
}

// ─── TERMINAL (ENHANCED) ─────────────────────────────────────────────────────
function Terminal({ puzzle }) {
  const glowRef = useRef();
  
  useFrame(() => {
    if (!glowRef.current) return;
    glowRef.current.intensity = 1.2 + Math.sin(Date.now() * 0.003) * 0.5;
  });

  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 0.3, 12]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.75, 2.5, 12]} />
        <meshStandardMaterial color="#0a0a1e" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.1, 0.55]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.4, 0.9, 0.08]} />
        <meshStandardMaterial color="#060612" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 3.1, 0.60]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.25, 0.75]} />
        <meshStandardMaterial color="#001500" emissive="#22c55e" emissiveIntensity={0.6} />
      </mesh>
      <Text 
        position={[0, 3.12, 0.64]} 
        rotation={[-0.22, 0, 0]} 
        fontSize={0.18} 
        anchorX="center" 
        anchorY="middle" 
        color="#22c55e" 
        maxWidth={1.15}
      >
        {puzzle ? puzzle + ' = ?' : 'Find the EXIT!'}
      </Text>
      <mesh position={[0, 2.5, 0]}>
        <torusGeometry args={[0.58, 0.03, 8, 24]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.77, 0.03, 8, 24]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 4, 0.5]} intensity={1.5} color="#22c55e" distance={7} decay={2} />
    </group>
  );
}

// ─── MAIN SCENE ───────────────────────────────────────────────────────────────
function GameScene({ room, onDoorTrigger, setNearDoor, setNearTerminal, keysRef }) {
  const { camera } = useThree();
  const playerRef = useRef();
  
  const posRef    = useRef(new THREE.Vector3(0, 0, 5.5));
  const rotRef    = useRef(0);
  const coolRef   = useRef(false);
  const walkTime  = useRef(0);
  const [nearDoorLocal, setNearDoorLocal] = useState(null);

  useEffect(() => {
    posRef.current.set(0, 0, 5.5);
    rotRef.current = 0;
    camera.position.set(0, 10, 13);
    camera.lookAt(0, 1.5, 0);
  }, [room, camera]);

  useEffect(() => {
    const dn = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, [keysRef]);

  useFrame((_, dt) => {
    const k = keysRef.current;
    
    if (k['ArrowLeft']  || k['a'] || k['A']) rotRef.current += 2.0 * dt;
    if (k['ArrowRight'] || k['d'] || k['D']) rotRef.current -= 2.0 * dt;

    const fwd = new THREE.Vector3(-Math.sin(rotRef.current), 0, -Math.cos(rotRef.current));
    
    let isMoving = false;
    const pos = posRef.current;
    const spd = SPEED * dt;

    if (k['ArrowUp'] || k['w'] || k['W']) {
      pos.addScaledVector(fwd, spd);
      isMoving = true;
    }
    if (k['ArrowDown'] || k['s'] || k['S']) {
      pos.addScaledVector(fwd, -spd);
      isMoving = true;
    }

    pos.x = Math.max(-HALF + 0.7, Math.min(HALF - 0.7, pos.x));
    pos.z = Math.max(-HALF + 0.7, Math.min(HALF - 0.7, pos.z));

    if (playerRef.current) {
      playerRef.current.position.copy(pos);
      playerRef.current.rotation.y = rotRef.current;

      const pGroup = playerRef.current;
      const legL = pGroup.getObjectByName('legL');
      const legR = pGroup.getObjectByName('legR');
      const armL = pGroup.getObjectByName('armL');
      const armR = pGroup.getObjectByName('armR');

      if (isMoving) {
        walkTime.current += dt * 15;
        const t = walkTime.current;
        if (legL) { legL.position.z = Math.sin(t) * 0.3; legL.position.y = 0.3 + Math.abs(Math.cos(t)) * 0.1; }
        if (legR) { legR.position.z = Math.sin(t + Math.PI) * 0.3; legR.position.y = 0.3 + Math.abs(Math.cos(t + Math.PI)) * 0.1; }
        if (armL) armL.rotation.x = Math.sin(t + Math.PI) * 0.5;
        if (armR) armR.rotation.x = Math.sin(t) * 0.5;
        pGroup.position.y = pos.y + Math.abs(Math.sin(t)) * 0.05;
      } else {
        if (legL) { legL.position.z = THREE.MathUtils.lerp(legL.position.z, 0, 0.2); legL.position.y = 0.3; }
        if (legR) { legR.position.z = THREE.MathUtils.lerp(legR.position.z, 0, 0.2); legR.position.y = 0.3; }
        if (armL) armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, 0, 0.2);
        if (armR) armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, 0, 0.2);
        pGroup.position.y = THREE.MathUtils.lerp(pGroup.position.y, pos.y, 0.2);
      }
    }

    const camOff = fwd.clone().multiplyScalar(-7.5).add(new THREE.Vector3(0, 9, 0));
    const camTarget = pos.clone().add(camOff);
    camera.position.lerp(camTarget, 0.12);
    camera.lookAt(pos.clone().add(fwd.multiplyScalar(2)).add(new THREE.Vector3(0, 1.5, 0)));

    let nd = null, ndist = DOOR_DIST;
    room.availableDoors.forEach(dir => {
      const dp = DOOR_POS[dir];
      const d  = Math.hypot(pos.x - dp[0], pos.z - dp[2]);
      if (d < ndist) { ndist = d; nd = dir; }
    });
    setNearDoor(nd);
    setNearDoorLocal(nd);
    setNearTerminal(Math.hypot(pos.x, pos.z) < TERM_DIST);

    if ((k['e'] || k['E'] || k['Enter']) && nd && !coolRef.current) {
      coolRef.current = true;
      setTimeout(() => { coolRef.current = false; }, 700);
      onDoorTrigger(nd);
    }
  });

  return (
    <>
      <color attach="background" args={['#060610']} />
      <fog attach="fog" args={['#060610', 16, 32]} />

      <ambientLight intensity={0.5} color="#8899aa" />
      <directionalLight position={[4, 10, 6]} intensity={1.0} color="#c0d8ff" castShadow />
      <directionalLight position={[-4, 8, -4]} intensity={0.4} color="#8090b0" />
      <spotLight position={[0, 7.8, 0]} angle={1.0} penumbra={0.7} intensity={2.0} color="#aaddaa" castShadow />
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#443322" distance={10} decay={2} />

      <RoomWalls />
      <Terminal puzzle={room.puzzle} />

      {room.availableDoors.map(dir => (
        <AnimatedDoor 
          key={dir} 
          dir={dir} 
          isExit={room.isExit && dir === room.correctDoor} 
          isNear={nearDoorLocal === dir}
        />
      ))}

      {/* Billboard door numbers — always face camera, never inverted */}
      {room.availableDoors.map(dir => {
        if (room.isExit && dir === room.correctDoor) {
          return (
            <Billboard key={dir} position={TEXT_POS[dir]}>
              <Text fontSize={0.75} anchorX="center" anchorY="middle" color="#00ffaa" outlineWidth={0.06} outlineColor="#000">
                EXIT
              </Text>
            </Billboard>
          );
        }
        return (
          <Billboard key={dir} position={TEXT_POS[dir]}>
            <Text fontSize={1.2} anchorX="center" anchorY="middle" color="#22c55e" outlineWidth={0.08} outlineColor="#000">
              {String(room.doorNumbers[dir])}
            </Text>
          </Billboard>
        );
      })}

      <PlayerMesh ref={playerRef} />
    </>
  );
}

// ─── MOBILE TOUCH D-PAD ───────────────────────────────────────────────────────
function MobileDPad({ keysRef }) {
  const press = (key) => { keysRef.current[key] = true; };
  const release = (key) => { keysRef.current[key] = false; };

  const btnStyle = {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '2px solid rgba(34,197,94,0.4)',
    background: 'rgba(0,0,0,0.35)',
    color: 'rgba(34,197,94,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    backdropFilter: 'blur(4px)',
  };

  const interactStyle = {
    ...btnStyle,
    width: 56,
    height: 56,
    border: '2px solid rgba(0,255,170,0.5)',
    background: 'rgba(0,255,170,0.12)',
    color: '#00ffaa',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: '1px',
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 30,
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-end',
      pointerEvents: 'auto',
    }}
    className="lg:hidden"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <button
          style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); press('w'); }}
          onTouchEnd={(e) => { e.preventDefault(); release('w'); }}
          onMouseDown={() => press('w')}
          onMouseUp={() => release('w')}
          onMouseLeave={() => release('w')}
        >{'\u25B2'}</button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            style={btnStyle}
            onTouchStart={(e) => { e.preventDefault(); press('a'); }}
            onTouchEnd={(e) => { e.preventDefault(); release('a'); }}
            onMouseDown={() => press('a')}
            onMouseUp={() => release('a')}
            onMouseLeave={() => release('a')}
          >{'\u25C4'}</button>
          <button
            style={btnStyle}
            onTouchStart={(e) => { e.preventDefault(); press('s'); }}
            onTouchEnd={(e) => { e.preventDefault(); release('s'); }}
            onMouseDown={() => press('s')}
            onMouseUp={() => release('s')}
            onMouseLeave={() => release('s')}
          >{'\u25BC'}</button>
          <button
            style={btnStyle}
            onTouchStart={(e) => { e.preventDefault(); press('d'); }}
            onTouchEnd={(e) => { e.preventDefault(); release('d'); }}
            onMouseDown={() => press('d')}
            onMouseUp={() => release('d')}
            onMouseLeave={() => release('d')}
          >{'\u25BA'}</button>
        </div>
      </div>

      <button
        style={interactStyle}
        onTouchStart={(e) => { e.preventDefault(); press('e'); }}
        onTouchEnd={(e) => { e.preventDefault(); release('e'); }}
        onMouseDown={() => press('e')}
        onMouseUp={() => release('e')}
        onMouseLeave={() => release('e')}
      >E</button>
    </div>
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
  const keysRef = useRef({});

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
    keysRef.current = {};
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#060610', fontFamily: 'monospace', overflow: 'hidden' }}>
      {gameState === 'playing' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0.8), transparent)' }}>
          <button onClick={onBack} style={{ ...btnBase, pointerEvents: 'auto', padding: '8px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(34,197,94,0.5)', color: '#22c55e', fontSize: '13px' }}>
            {'\u2190'} Back
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid ' + (timeLeft < 30 ? '#ef4444' : 'rgba(34,197,94,0.45)'), color: timeLeft < 30 ? '#ef4444' : '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.55, letterSpacing: '2px' }}>TIME</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{fmt(timeLeft)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(34,197,94,0.45)', color: '#22c55e', padding: '6px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', opacity: 0.55, letterSpacing: '2px' }}>ROOM</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stepIdx + 1}/{path.length}</div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (nearDoor || nearTerm) && (
        <div style={{ position: 'absolute', bottom: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 25, background: 'rgba(0,0,0,0.9)', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
          {nearTerm && !nearDoor && ('Puzzle: ' + room.puzzle + ' = ?')}
          {nearDoor && ('Press E  \u2192  Door [' + room.doorNumbers[nearDoor] + ']')}
        </div>
      )}

      {/* Mobile D-Pad */}
      {gameState === 'playing' && (
        <MobileDPad keysRef={keysRef} />
      )}

      {gameState === 'playing' && (
        <div className="hidden lg:block" style={{ position: 'absolute', bottom: '14px', right: '18px', zIndex: 25, color: 'rgba(34,197,94,0.4)', fontSize: '11px', lineHeight: '1.8', textAlign: 'right' }}>
          WASD / Arrows — Move & Turn<br />E — Enter nearby door
        </div>
      )}

      {gameState === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,4,14,0.98)' }}>
          <div style={{ maxWidth: '460px', width: '90%', padding: '40px', background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', textAlign: 'center', position: 'relative' }}>
            <button onClick={onBack} style={{ ...btnBase, position: 'absolute', top: '14px', left: '14px', padding: '6px 12px', borderRadius: '7px', background: 'transparent', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(34,197,94,0.5)', fontSize: '12px' }}>{'\u2190'} Back</button>
            <div style={{ fontSize: '52px', marginBottom: '6px' }}>{'\ud83c\udfe2'}</div>
            <h2 style={{ color: '#22c55e', fontSize: '28px', letterSpacing: '6px', margin: '0 0 4px' }}>THE MAZE</h2>
            <p style={{ color: 'rgba(34,197,94,0.35)', fontSize: '10px', letterSpacing: '3px', marginBottom: '22px' }}>ESCAPE OR DIE TRYING</p>
            <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '10px', padding: '14px 18px', marginBottom: '22px', textAlign: 'left', color: 'rgba(34,197,94,0.65)', fontSize: '13px', lineHeight: '2.0' }}>
              {'\u2023'} Walk with <strong>WASD</strong> / Arrows / On-screen D-pad.<br />
              {'\u2023'} Walk up to the terminal — it shows the math puzzle.<br />
              {'\u2023'} Solve it, find the door with the matching neon number.<br />
              {'\u2023'} Walk close and press <strong>E</strong> to enter.<br />
              {'\u2023'} <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Wrong door = instant Game Over.</span><br />
              {'\u2023'} Reach the cyan EXIT door to escape. 3 minutes.
            </div>
            <button onClick={startGame} style={{ ...btnBase, width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 'bold', fontSize: '14px', letterSpacing: '4px' }}>
              ENTER THE MAZE
            </button>
          </div>
        </div>
      )}

      {gameState === 'trap' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,0,0,0.97)' }}>
          <div style={{ fontSize: '68px', marginBottom: '8px' }}>{'\u2622'}</div>
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
          <h2 style={{ color: '#ef4444', fontSize: '52px', letterSpacing: '4px', marginBottom: '12px' }}>TIME'S UP</h2>
          <p style={{ color: 'rgba(239,68,68,0.55)', fontSize: '17px', marginBottom: '34px' }}>The maze consumed you.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{ ...btnBase, padding: '12px 28px', border: '2px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '10px', letterSpacing: '2px', fontSize: '13px' }}>TRY AGAIN</button>
            <button onClick={onBack}    style={{ ...btnBase, padding: '12px 28px', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.4)', background: 'transparent', borderRadius: '10px', fontSize: '13px' }}>BACK</button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,14,0,0.97)' }}>
          <div style={{ fontSize: '68px', marginBottom: '8px' }}>{'\ud83c\udfc6'}</div>
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
              keysRef={keysRef}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
