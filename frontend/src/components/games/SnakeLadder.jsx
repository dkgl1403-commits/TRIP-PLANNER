import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment, ContactShadows, RoundedBox, Sky } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

// ==========================================
// CONSTANTS
// ==========================================

const TILE_SIZE = 4.5;
const TILE_H    = 0.55;
const FOG_R     = 3.2;

const COLORS = ['#e63946', '#4361ee', '#2dc653', '#8338ec', '#fb8500'];

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

// Snake body color palette — 5 distinct species
const SNAKE_PALETTE = [
  { body: '#1b5e3a', scale: '#4caf87', eye: '#ff2020' },  // emerald king
  { body: '#7b1a1a', scale: '#e8a04a', eye: '#ff9900' },  // blood dragon
  { body: '#1a1a2e', scale: '#5a5a9a', eye: '#bb00ff' },  // shadow wraith
  { body: '#6b1a7b', scale: '#d4a0e0', eye: '#ff2020' },  // violet death
  { body: '#1a3a6b', scale: '#8ab8e8', eye: '#00ffcc' },  // ocean tyrant
];

// Pip positions for dice face value 1-6 (x/z offsets on top face)
const DICE_PIPS = {
  1: [[0, 0]],
  2: [[-0.26, -0.26], [0.26,  0.26]],
  3: [[-0.26, -0.26], [0, 0], [0.26, 0.26]],
  4: [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.26], [0.26, 0.26]],
  5: [[-0.26, -0.26], [0.26, -0.26], [0, 0], [-0.26, 0.26], [0.26, 0.26]],
  6: [[-0.26, -0.30], [-0.26, 0], [-0.26, 0.30], [0.26, -0.30], [0.26, 0], [0.26, 0.30]],
};

// ==========================================
// COORDINATE HELPERS
// ==========================================

const getTileCoord = (n) => {
  const idx  = n - 1;
  const row  = Math.floor(idx / 10);
  const colR = idx % 10;
  const col  = row % 2 === 0 ? colR : 9 - colR;
  return { row, col };
};

const getPosition = (n) => {
  if (n <= 0) {
    const t1 = getPosition(1);
    return { x: t1.x - TILE_SIZE, y: TILE_H / 2, z: t1.z + TILE_SIZE };
  }
  const { row, col } = getTileCoord(n);
  return {
    x:  (col - 4.5) * TILE_SIZE,
    y:  TILE_H / 2,
    z: -(row - 4.5) * TILE_SIZE,
  };
};

// ==========================================
// SNAKE GENERATION
// ==========================================

const generateSnakes = () => {
  const snakes   = {};
  const occupied = new Set([
    ...Object.keys(LADDERS).map(String),
    ...Object.values(LADDERS).map(String),
  ]);

  const canPlace = (head, tail) => {
    if (occupied.has(String(head)) || occupied.has(String(tail))) return false;
    if (snakes[head] || Object.values(snakes).includes(tail))       return false;
    if (head < 2 || head > 99 || tail < 1 || tail >= head)          return false;
    return true;
  };

  const place = (headMin, headMax, minSetback) => {
    for (let attempt = 0; attempt < 150; attempt++) {
      const head    = Math.floor(Math.random() * (headMax - headMin + 1)) + headMin;
      const maxTail = head - minSetback;
      if (maxTail < 1) continue;
      const tail = Math.floor(Math.random() * maxTail) + 1;
      if (canPlace(head, tail)) {
        snakes[head] = tail;
        occupied.add(String(head));
        occupied.add(String(tail));
        return true;
      }
    }
    return false;
  };

  place(75, 99, 50);   // big guard
  place(75, 99, 20);   // small guard
  place(51, 99, 50);   // big roamer
  place(21, 74, 20);   // small roamer 1
  place(21, 74, 20);   // small roamer 2

  return snakes;
};

// ==========================================
// TILE
// ==========================================

const Tile = React.memo(({ number, playerRow, playerCol, isPlayerHere }) => {
  const { row, col } = getTileCoord(number);
  const dist  = Math.sqrt((row - playerRow) ** 2 + (col - playerCol) ** 2);
  if (dist > FOG_R) return null;

  const opacity  = dist > FOG_R - 1 ? Math.max(0.15, 1 - (dist - (FOG_R - 1))) : 1;
  const isAlt    = (row + col) % 2 === 0;
  const pos      = getPosition(number);
  const tileCol  = isAlt ? '#1b5e2e' : '#2e3b1f';

  return (
    <group position={[pos.x, 0, pos.z]}>
      <RoundedBox args={[TILE_SIZE - 0.25, TILE_H, TILE_SIZE - 0.25]} radius={0.08} castShadow receiveShadow>
        <meshStandardMaterial color={tileCol} roughness={0.65} metalness={0.08} transparent={opacity < 1} opacity={opacity} />
      </RoundedBox>

      <mesh position={[0, TILE_H / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[(TILE_SIZE - 0.25) / 2 - 0.18, (TILE_SIZE - 0.25) / 2 - 0.04, 4, 1]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={isPlayerHere ? 1.2 : 0.12} transparent opacity={opacity * 0.55} />
      </mesh>

      {dist < 2.2 && (
        <Text position={[0, TILE_H / 2 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#ffd700" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {number}
        </Text>
      )}

      {isPlayerHere && <pointLight position={[0, 1.2, 0]} color="#ffd700" intensity={3} distance={7} />}
    </group>
  );
});

// ==========================================
// BOARD
// ==========================================

const Board = ({ activePlayerPos }) => {
  const { row: pRow, col: pCol } = useMemo(
    () => (activePlayerPos > 0 ? getTileCoord(activePlayerPos) : { row: -1.5, col: 4.5 }),
    [activePlayerPos]
  );

  return (
    <group>
      {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
        <Tile key={n} number={n} playerRow={pRow} playerCol={pCol} isPlayerHere={activePlayerPos === n} />
      ))}
    </group>
  );
};

// ==========================================
// START PLATFORM
// ==========================================

const StartPlatform = () => {
  const t1  = getPosition(1);
  const pos = [t1.x - TILE_SIZE, 0, t1.z + TILE_SIZE];

  return (
    <group position={pos}>
      <RoundedBox args={[TILE_SIZE - 0.25, TILE_H * 0.7, TILE_SIZE - 0.25]} radius={0.06} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3728" roughness={0.92} metalness={0} />
      </RoundedBox>
      <Text position={[0, TILE_H * 0.35 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.72} color="#ffd700" fontWeight="bold" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000">
        START
      </Text>
      <pointLight position={[0, 1.8, 0]} color="#ffd700" intensity={2} distance={6} />
    </group>
  );
};

// ==========================================
// SNAKE — Animated jungle serpent
// ==========================================

const Snake = ({ headTile, tailTile, snakeIndex, activePlayerPos }) => {
  const isBig  = headTile - tailTile >= 50;
  const numSegs = isBig ? 22 : 13;
  const headR   = isBig ? 1.25 : 0.72;
  const color   = SNAKE_PALETTE[snakeIndex % SNAKE_PALETTE.length];

  const headPos = getPosition(headTile);
  const tailPos = getPosition(tailTile);

  const archH = useMemo(() => {
    const dist = Math.sqrt((headPos.x - tailPos.x) ** 2 + (headPos.z - tailPos.z) ** 2);
    return Math.max(2.5, dist * 0.38);
  }, [headTile, tailTile]);

  const basePoints = useMemo(() => {
    const start = new THREE.Vector3(headPos.x, headPos.y + 0.55, headPos.z);
    const end   = new THREE.Vector3(tailPos.x, tailPos.y + 0.25, tailPos.z);
    const ctrl  = new THREE.Vector3((start.x + end.x) / 2, headPos.y + archH, (start.z + end.z) / 2);
    return new THREE.QuadraticBezierCurve3(start, ctrl, end).getPoints(numSegs);
  }, [headTile, tailTile, archH]);

  // One ref per rendered object: head group + (numSegs-1) body spheres + tail
  const headRef = useRef();
  const segRefs = useRef(new Array(numSegs - 1).fill(null));
  const tailRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 1.4;

    if (headRef.current && basePoints[0]) {
      const w = Math.sin(t) * 0.2;
      headRef.current.position.set(basePoints[0].x, basePoints[0].y + w, basePoints[0].z);
    }

    segRefs.current.forEach((ref, i) => {
      const bIdx = i + 1;
      if (ref && basePoints[bIdx]) {
        const w = Math.sin(t + bIdx * 0.55) * (0.15 + (bIdx / numSegs) * 0.1);
        ref.position.set(basePoints[bIdx].x, basePoints[bIdx].y + w, basePoints[bIdx].z);
      }
    });

    if (tailRef.current && basePoints[numSegs]) {
      const w = Math.sin(t + numSegs * 0.55) * 0.22;
      tailRef.current.position.set(basePoints[numSegs].x, basePoints[numSegs].y + w, basePoints[numSegs].z);
    }
  });

  // Fog-of-war visibility check
  const { row: pRow, col: pCol } = activePlayerPos > 0 ? getTileCoord(activePlayerPos) : { row: -3, col: 5 };
  const { row: hRow, col: hCol } = getTileCoord(headTile);
  const { row: tRow, col: tCol } = getTileCoord(tailTile);
  const dHead = Math.sqrt((hRow - pRow) ** 2 + (hCol - pCol) ** 2);
  const dTail = Math.sqrt((tRow - pRow) ** 2 + (tCol - pCol) ** 2);
  const visR  = isBig ? 5.5 : 4.2;
  const dist  = Math.min(dHead, dTail);
  if (dist > visR) return null;

  const opacity = dist > visR - 1.8 ? Math.max(0.06, 1 - (dist - (visR - 1.8)) / 1.8) : 1;

  const bodyMat = (
    <meshPhysicalMaterial
      color={color.body}
      roughness={0.62}
      metalness={0.08}
      clearcoat={0.4}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );

  return (
    <group>
      {/* HEAD */}
      <group ref={headRef} castShadow>
        {/* Skull */}
        <mesh castShadow>
          <sphereGeometry args={[headR, 14, 14]} />
          {bodyMat}
        </mesh>
        {/* Snout — elongated forward */}
        <mesh position={[0, -headR * 0.1, -headR * 0.85]} castShadow>
          <sphereGeometry args={[headR * 0.6, 12, 12]} />
          {bodyMat}
        </mesh>
        {/* Eyes — glowing red */}
        <mesh position={[-headR * 0.40, headR * 0.28, -headR * 0.70]}>
          <sphereGeometry args={[headR * 0.19, 8, 8]} />
          <meshStandardMaterial color={color.eye} emissive={color.eye} emissiveIntensity={2.8} transparent opacity={opacity} />
        </mesh>
        <mesh position={[headR * 0.40, headR * 0.28, -headR * 0.70]}>
          <sphereGeometry args={[headR * 0.19, 8, 8]} />
          <meshStandardMaterial color={color.eye} emissive={color.eye} emissiveIntensity={2.8} transparent opacity={opacity} />
        </mesh>
        {/* Tongue stem */}
        <mesh position={[0, -headR * 0.12, -headR * 1.52]} rotation={[0.25, 0, 0]} castShadow>
          <cylinderGeometry args={[headR * 0.04, headR * 0.04, headR * 0.65, 5]} />
          <meshStandardMaterial color="#cc1122" emissive="#aa0010" emissiveIntensity={1.2} transparent opacity={opacity} />
        </mesh>
        {/* Tongue fork — left */}
        <mesh position={[-headR * 0.14, -headR * 0.14, -headR * 1.92]} rotation={[0.35, 0.4, 0]} castShadow>
          <cylinderGeometry args={[headR * 0.03, headR * 0.03, headR * 0.38, 4]} />
          <meshStandardMaterial color="#cc1122" emissive="#aa0010" emissiveIntensity={1.2} transparent opacity={opacity} />
        </mesh>
        {/* Tongue fork — right */}
        <mesh position={[headR * 0.14, -headR * 0.14, -headR * 1.92]} rotation={[0.35, -0.4, 0]} castShadow>
          <cylinderGeometry args={[headR * 0.03, headR * 0.03, headR * 0.38, 4]} />
          <meshStandardMaterial color="#cc1122" emissive="#aa0010" emissiveIntensity={1.2} transparent opacity={opacity} />
        </mesh>
        {/* Eye point light */}
        <pointLight color={color.eye} intensity={isBig ? 5 : 2.5} distance={isBig ? 9 : 5} position={[0, headR * 0.3, -headR * 0.5]} />
      </group>

      {/* BODY SEGMENTS */}
      {Array.from({ length: numSegs - 1 }, (_, i) => {
        const ratio  = (i + 1) / numSegs;
        const radius = THREE.MathUtils.lerp(headR * 0.86, headR * 0.21, ratio);
        return (
          <mesh key={i} ref={el => { segRefs.current[i] = el; }} castShadow>
            <sphereGeometry args={[radius, 10, 10]} />
            {bodyMat}
          </mesh>
        );
      })}

      {/* TAIL — tapered cone */}
      <mesh ref={tailRef} castShadow>
        <coneGeometry args={[headR * 0.12, headR * 0.88, 6]} />
        {bodyMat}
      </mesh>
    </group>
  );
};

// ==========================================
// LADDER — Wooden jungle ladder
// ==========================================

const Ladder = ({ fromTile, toTile, activePlayerPos }) => {
  // Fog check
  const { row: pRow, col: pCol } = activePlayerPos > 0 ? getTileCoord(activePlayerPos) : { row: -3, col: 5 };
  const { row: fRow, col: fCol } = getTileCoord(fromTile);
  const { row: tRow, col: tCol } = getTileCoord(toTile);
  const dFrom = Math.sqrt((fRow - pRow) ** 2 + (fCol - pCol) ** 2);
  const dTo   = Math.sqrt((tRow - pRow) ** 2 + (tCol - pCol) ** 2);
  const visR  = 4.5;
  const dist  = Math.min(dFrom, dTo);
  if (dist > visR) return null;

  const opacity = dist > visR - 1.5 ? Math.max(0.08, 1 - (dist - (visR - 1.5)) / 1.5) : 1;

  const fp = getPosition(fromTile);
  const tp = getPosition(toTile);

  // Ladder floats slightly above tiles
  const start = useMemo(() => new THREE.Vector3(fp.x, fp.y + TILE_H / 2 + 0.22, fp.z), [fromTile]);
  const end   = useMemo(() => new THREE.Vector3(tp.x, tp.y + TILE_H / 2 + 0.22, tp.z), [toTile]);

  const dir    = useMemo(() => new THREE.Vector3().subVectors(end, start), [fromTile, toTile]);
  const length = dir.length();
  const midPt  = useMemo(() => new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5), [fromTile, toTile]);

  // Rail offset — perpendicular to ladder direction in XZ
  const perpDir = useMemo(() => {
    const d = dir.clone().normalize();
    return new THREE.Vector3(-d.z, 0, d.x).normalize();
  }, [fromTile, toTile]);

  const railQuat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()), [fromTile, toTile]);
  const rungQuat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), perpDir), [fromTile, toTile]);

  const RAIL_HALF = 0.55;
  const leftRailPt  = useMemo(() => midPt.clone().addScaledVector(perpDir,  RAIL_HALF), [fromTile, toTile]);
  const rightRailPt = useMemo(() => midPt.clone().addScaledVector(perpDir, -RAIL_HALF), [fromTile, toTile]);

  const numRungs = Math.max(2, Math.round(length / 1.9));

  const railMat = <meshStandardMaterial color="#8b5a2b" roughness={0.92} metalness={0.02} transparent opacity={opacity} />;
  const rungMat = <meshStandardMaterial color="#a0672f" roughness={0.88} metalness={0.02} transparent opacity={opacity} />;
  const goldMat = <meshStandardMaterial color="#e8c830" roughness={0.25} metalness={0.7} emissive="#ffd700" emissiveIntensity={0.35} transparent opacity={opacity} />;

  return (
    <group>
      {/* Left rail */}
      <mesh position={leftRailPt.toArray()} quaternion={railQuat} castShadow>
        <cylinderGeometry args={[0.16, 0.20, length, 8]} />
        {railMat}
      </mesh>

      {/* Right rail */}
      <mesh position={rightRailPt.toArray()} quaternion={railQuat} castShadow>
        <cylinderGeometry args={[0.16, 0.20, length, 8]} />
        {railMat}
      </mesh>

      {/* Rungs */}
      {Array.from({ length: numRungs }, (_, i) => {
        const t      = (i + 1) / (numRungs + 1);
        const rungPt = new THREE.Vector3().lerpVectors(start, end, t);
        return (
          <mesh key={i} position={rungPt.toArray()} quaternion={rungQuat} castShadow>
            <cylinderGeometry args={[0.075, 0.075, RAIL_HALF * 2, 6]} />
            {rungMat}
          </mesh>
        );
      })}

      {/* Bottom gold bracket */}
      <mesh position={start.toArray()} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[RAIL_HALF * 0.65, 0.075, 6, 14]} />
        {goldMat}
      </mesh>

      {/* Top gold bracket */}
      <mesh position={end.toArray()} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[RAIL_HALF * 0.65, 0.075, 6, 14]} />
        {goldMat}
      </mesh>

      {/* Glow at base for discoverability */}
      {opacity > 0.5 && (
        <pointLight color="#ffd700" intensity={1.2} distance={4} position={start.toArray()} />
      )}
    </group>
  );
};

// ==========================================
// 3D DICE
// ==========================================

const Dice3D = ({ value, isRolling, tilePos }) => {
  const diceRef  = useRef();
  const spinRef  = useRef(0);
  const settled  = useRef(true);

  // Face-up rotations for each die value
  const FACE_ROT = {
    1: [0,          0, 0],
    2: [-Math.PI/2, 0, 0],
    3: [0,          0, Math.PI/2],
    4: [0,          0, -Math.PI/2],
    5: [Math.PI/2,  0, 0],
    6: [Math.PI,    0, 0],
  };

  useFrame((_, delta) => {
    if (!diceRef.current) return;

    if (isRolling) {
      settled.current = false;
      spinRef.current += delta * 14;
      diceRef.current.rotation.x = spinRef.current;
      diceRef.current.rotation.y = spinRef.current * 0.73;
      diceRef.current.rotation.z = spinRef.current * 0.49;
    } else if (!settled.current) {
      // Settle onto correct face
      const tr = FACE_ROT[value] || FACE_ROT[1];
      diceRef.current.rotation.x = THREE.MathUtils.lerp(diceRef.current.rotation.x, tr[0], 0.09);
      diceRef.current.rotation.y = THREE.MathUtils.lerp(diceRef.current.rotation.y, tr[1], 0.09);
      diceRef.current.rotation.z = THREE.MathUtils.lerp(diceRef.current.rotation.z, tr[2], 0.09);

      const dx = Math.abs(diceRef.current.rotation.x - tr[0]);
      const dy = Math.abs(diceRef.current.rotation.y - tr[1]);
      const dz = Math.abs(diceRef.current.rotation.z - tr[2]);
      if (dx + dy + dz < 0.015) settled.current = true;
    }
  });

  // Dice sits on the tile, offset to front-right
  const px = tilePos.x + 2.2;
  const py = TILE_H + 0.7;
  const pz = tilePos.z + 1.8;

  const pips = DICE_PIPS[value] || DICE_PIPS[1];

  return (
    <group position={[px, py, pz]}>
      {/* Bounce container */}
      <group ref={diceRef}>
        {/* Dice body */}
        <RoundedBox args={[1.28, 1.28, 1.28]} radius={0.24} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#fffff8"
            roughness={0.04}
            metalness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.04}
          />
        </RoundedBox>

        {/* TOP face pips (face 1 or whichever is rotated to top) */}
        {pips.map(([ox, oz], i) => (
          <mesh key={i} position={[ox, 0.66, oz]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}

        {/* FRONT face pips — always shows value=2 for depth */}
        {DICE_PIPS[2].map(([ox, oy], i) => (
          <mesh key={`f${i}`} position={[ox, oy, 0.66]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}

        {/* RIGHT face pips */}
        {DICE_PIPS[3].map(([oy, oz], i) => (
          <mesh key={`r${i}`} position={[0.66, oy, oz]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Soft golden light */}
      <pointLight color="#ffe8a0" intensity={1.5} distance={5} position={[0, 1.2, 0]} />
    </group>
  );
};

// ==========================================
// CHARACTER — Humanoid with walking animation
// ==========================================

const Character = ({ player, isActive, slotIndex, visualTarget }) => {
  const slotX  = ((slotIndex % 2) - 0.5) * 0.9;
  const slotZ  = (Math.floor(slotIndex / 2) - 0.5) * 0.9;
  const target = visualTarget || (player.pos <= 0 ? getPosition(0) : getPosition(player.pos));

  const { px, py, pz } = useSpring({
    px: target.x + slotX,
    py: target.y + TILE_H / 2 + 0.02,
    pz: target.z + slotZ,
    config: { mass: 2.2, tension: 38, friction: 18 },
  });

  const charGroupRef = useRef();
  const torsoRef     = useRef();
  const leftLegRef   = useRef();
  const rightLegRef  = useRef();
  const leftArmRef   = useRef();
  const rightArmRef  = useRef();
  const walkPhase    = useRef(0);
  const rotYRef      = useRef(0);

  useFrame((state, delta) => {
    const curX    = px.get ? px.get() : target.x + slotX;
    const curZ    = pz.get ? pz.get() : target.z + slotZ;
    const tgtX    = target.x + slotX;
    const tgtZ    = target.z + slotZ;
    const dist    = Math.sqrt((tgtX - curX) ** 2 + (tgtZ - curZ) ** 2);
    const moving  = dist > 0.05;

    if (moving) {
      walkPhase.current += delta * 4.5;
      const dx = tgtX - curX;
      const dz = tgtZ - curZ;
      if (Math.abs(dx) + Math.abs(dz) > 0.08) {
        rotYRef.current = Math.atan2(dx, dz);
      }
    } else {
      walkPhase.current *= 0.85;
    }

    const legSwing = Math.sin(walkPhase.current) * 0.65;
    const armSwing = Math.sin(walkPhase.current) * 0.45;
    const bob      = moving ? Math.abs(Math.sin(walkPhase.current)) * 0.055 : 0;

    if (leftLegRef.current)  leftLegRef.current.rotation.x  =  legSwing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
    if (leftArmRef.current)  leftArmRef.current.rotation.x  = -armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x =  armSwing;

    if (torsoRef.current) {
      if (moving) {
        torsoRef.current.position.y = THREE.MathUtils.lerp(torsoRef.current.position.y, bob, 0.25);
      } else if (isActive) {
        torsoRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
      }
    }

    if (charGroupRef.current) {
      charGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        charGroupRef.current.rotation.y,
        rotYRef.current,
        0.12
      );
    }
  });

  const bodyMat = (
    <meshPhysicalMaterial color={player.color} metalness={0.28} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />
  );
  const headMat = (
    <meshPhysicalMaterial color={player.color} metalness={0.35} roughness={0.18} clearcoat={1}
      emissive={isActive ? player.color : '#000000'} emissiveIntensity={isActive ? 0.45 : 0} />
  );

  return (
    <a.group position-x={px} position-y={py} position-z={pz}>
      <group ref={charGroupRef}>
        <group ref={torsoRef}>
          <mesh position={[0, 1.50, 0]} castShadow><sphereGeometry args={[0.21, 16, 16]} />{headMat}</mesh>
          <mesh position={[0, 1.25, 0]} castShadow><cylinderGeometry args={[0.085, 0.095, 0.18, 8]} />{bodyMat}</mesh>
          <mesh position={[0, 0.90, 0]} castShadow><boxGeometry args={[0.44, 0.50, 0.24]} />{bodyMat}</mesh>

          <group ref={leftArmRef} position={[-0.29, 1.05, 0]}>
            <mesh position={[0, -0.17, 0]} castShadow><cylinderGeometry args={[0.072, 0.066, 0.34, 8]} />{bodyMat}</mesh>
            <mesh position={[-0.01, -0.43, 0.05]} rotation={[0.15, 0, 0]} castShadow><cylinderGeometry args={[0.060, 0.052, 0.30, 8]} />{bodyMat}</mesh>
          </group>
          <group ref={rightArmRef} position={[0.29, 1.05, 0]}>
            <mesh position={[0, -0.17, 0]} castShadow><cylinderGeometry args={[0.072, 0.066, 0.34, 8]} />{bodyMat}</mesh>
            <mesh position={[0.01, -0.43, 0.05]} rotation={[0.15, 0, 0]} castShadow><cylinderGeometry args={[0.060, 0.052, 0.30, 8]} />{bodyMat}</mesh>
          </group>

          <mesh position={[0, 0.60, 0]} castShadow><boxGeometry args={[0.38, 0.17, 0.22]} />{bodyMat}</mesh>

          <group ref={leftLegRef} position={[-0.12, 0.54, 0]}>
            <mesh position={[0, -0.23, 0]} castShadow><cylinderGeometry args={[0.092, 0.082, 0.46, 8]} />{bodyMat}</mesh>
            <mesh position={[0, -0.60, 0.03]} rotation={[-0.12, 0, 0]} castShadow><cylinderGeometry args={[0.073, 0.062, 0.42, 8]} />{bodyMat}</mesh>
            <mesh position={[0, -0.87, 0.10]} castShadow><boxGeometry args={[0.12, 0.075, 0.21]} />{bodyMat}</mesh>
          </group>
          <group ref={rightLegRef} position={[0.12, 0.54, 0]}>
            <mesh position={[0, -0.23, 0]} castShadow><cylinderGeometry args={[0.092, 0.082, 0.46, 8]} />{bodyMat}</mesh>
            <mesh position={[0, -0.60, 0.03]} rotation={[-0.12, 0, 0]} castShadow><cylinderGeometry args={[0.073, 0.062, 0.42, 8]} />{bodyMat}</mesh>
            <mesh position={[0, -0.87, 0.10]} castShadow><boxGeometry args={[0.12, 0.075, 0.21]} />{bodyMat}</mesh>
          </group>

          <mesh position={[0, -0.97, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.40, 32]} />
            <meshStandardMaterial color={player.color} emissive={player.color} emissiveIntensity={isActive ? 3.5 : 0.9} transparent opacity={0.55} />
          </mesh>
        </group>
        {isActive && <pointLight color={player.color} intensity={2.2} distance={6} position={[0, 0.5, 0]} />}
      </group>
    </a.group>
  );
};

// ==========================================
// CAMERA RIG
// ==========================================

const CameraRig = ({ targetPos }) => {
  const { camera } = useThree();
  const idealPos   = useRef(new THREE.Vector3());
  const lookRef    = useRef(new THREE.Vector3());

  useFrame(() => {
    idealPos.current.set(targetPos.x, targetPos.y + 5.5, targetPos.z + 9);
    lookRef.current.set(targetPos.x, targetPos.y + 0.8, targetPos.z - 4);
    camera.position.lerp(idealPos.current, 0.06);
    const dir = lookRef.current.clone().sub(camera.position).normalize();
    const curDir = new THREE.Vector3();
    camera.getWorldDirection(curDir);
    curDir.lerp(dir, 0.08);
    camera.lookAt(camera.position.clone().addScaledVector(curDir, 20));
  });

  return null;
};

// ==========================================
// JUNGLE SCENE
// ==========================================

const JungleScene = ({ players, currentPlayer, visualPositions, snakes, diceValue, isRolling }) => {
  const activePl  = players.find(p => p.id === currentPlayer) || players[0];
  const activePos = activePl
    ? (activePl.pos <= 0 ? getPosition(0) : getPosition(activePl.pos))
    : { x: 0, y: 0, z: 0 };
  const activePlayerPos = activePl?.pos ?? 0;

  // Dice position follows active player
  const diceWorldPos = activePos;

  return (
    <>
      <color attach="background" args={['#0c1a0c']} />
      <fog attach="fog" args={['#1a3d1a', 14, 32]} />

      <Sky distance={450000} sunPosition={[80, 20, 60]} turbidity={8} rayleigh={0.4} mieCoefficient={0.005} mieDirectionalG={0.8} />

      <ambientLight intensity={0.35} color="#4a7c59" />
      <directionalLight position={[20, 30, 10]} intensity={1.6} color="#fffbe6" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-near={0.5} shadow-camera-far={120}
        shadow-camera-left={-35} shadow-camera-right={35}
        shadow-camera-top={35} shadow-camera-bottom={-35}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#6ab8c8" />

      <Environment preset="forest" />
      <CameraRig targetPos={activePos} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#080d08" roughness={1} />
      </mesh>

      <Board activePlayerPos={activePlayerPos} />
      <StartPlatform />

      {/* Snakes */}
      {Object.entries(snakes).map(([head, tail], idx) => (
        <Snake
          key={`snake-${head}-${tail}`}
          headTile={parseInt(head)}
          tailTile={tail}
          snakeIndex={idx}
          activePlayerPos={activePlayerPos}
        />
      ))}

      {/* Ladders */}
      {Object.entries(LADDERS).map(([from, to]) => (
        <Ladder
          key={`ladder-${from}-${to}`}
          fromTile={parseInt(from)}
          toTile={to}
          activePlayerPos={activePlayerPos}
        />
      ))}

      {/* Dice */}
      {diceValue != null && (
        <Dice3D value={diceValue} isRolling={isRolling} tilePos={diceWorldPos} />
      )}

      {/* Characters */}
      {players.map((p, i) => (
        <Character key={p.id} player={p} isActive={p.id === currentPlayer} slotIndex={i} visualTarget={visualPositions[p.id]} />
      ))}

      <ContactShadows position={[0, -0.28, 0]} opacity={0.35} scale={80} blur={2.5} far={4} />
    </>
  );
};

// ==========================================
// TURN CUT OVERLAY
// ==========================================

const TurnCutOverlay = ({ player, onComplete }) => {
  const [phase, setPhase] = useState('black');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'),  350);
    const t2 = setTimeout(() => setPhase('fade'),  1900);
    const t3 = setTimeout(() => onComplete(),      2350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-350
        ${phase === 'black' ? 'opacity-100 bg-black' : ''}
        ${phase === 'show'  ? 'opacity-100 bg-black/85' : ''}
        ${phase === 'fade'  ? 'opacity-0  bg-black' : ''}
      `}
      style={{ pointerEvents: 'all', backdropFilter: 'blur(6px)' }}
    >
      <div className={`flex flex-col items-center transition-all duration-300 ${phase === 'show' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="w-24 h-24 rounded-full mb-6 shadow-2xl"
          style={{ backgroundColor: player?.color, boxShadow: `0 0 60px ${player?.color}, 0 0 120px ${player?.color}55` }} />
        <h2 className="text-white text-5xl font-black tracking-widest uppercase mb-3">{player?.name}</h2>
        <p className="text-white/50 text-lg font-bold tracking-widest uppercase">🌿 Your Turn</p>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SnakeLadder({ user, onBack }) {
  const [gameMode,       setGameMode]       = useState(null);
  const [numPlayers,     setNumPlayers]     = useState(2);
  const [players,        setPlayers]        = useState([]);
  const [currentPlayer,  setCurrentPlayer]  = useState(1);
  const [diceValue,      setDiceValue]      = useState(null);
  const [isRolling,      setIsRolling]      = useState(false);
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [winner,         setWinner]         = useState(null);
  const [message,        setMessage]        = useState('');
  const [snakes,         setSnakes]         = useState({});
  const [throwCount,     setThrowCount]     = useState(0);
  const [isMigrating,    setIsMigrating]    = useState(false);
  const [showTurnCut,    setShowTurnCut]    = useState(false);
  const [pendingPlayer,  setPendingPlayer]  = useState(null);
  const [visualPositions, setVisualPositions] = useState({});

  const playersRef       = useRef(players);
  const currentPlayerRef = useRef(currentPlayer);
  const snakesRef        = useRef(snakes);
  const throwCountRef    = useRef(throwCount);

  useEffect(() => { playersRef.current       = players;        }, [players]);
  useEffect(() => { currentPlayerRef.current = currentPlayer;  }, [currentPlayer]);
  useEffect(() => { snakesRef.current        = snakes;         }, [snakes]);
  useEffect(() => { throwCountRef.current    = throwCount;     }, [throwCount]);

  // ── Init ──────────────────────────────

  const initializeGame = useCallback((count) => {
    const pList   = [];
    const initVis = {};
    const startPos = getPosition(0);

    for (let i = 1; i <= count; i++) {
      const name = gameMode === 'single' ? (i === 1 ? 'You' : 'Computer') : `Player ${i}`;
      pList.push({ id: i, pos: 0, color: COLORS[i - 1], name });
      initVis[i] = startPos;
    }

    setPlayers(pList);
    setVisualPositions(initVis);
    setCurrentPlayer(1);
    setWinner(null);
    setMessage('');
    setDiceValue(null);
    setThrowCount(0);
    setIsMigrating(false);
    setShowTurnCut(false);
    setSnakes(generateSnakes());
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'single' || gameMode === 'local') {
      initializeGame(gameMode === 'single' ? 2 : numPlayers);
    }
  }, [gameMode, numPlayers]);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3200);
  };

  const triggerMigration = () => {
    setIsMigrating(true);
    setTimeout(() => {
      setSnakes(generateSnakes());
      setTimeout(() => setIsMigrating(false), 1800);
    }, 1200);
  };

  // ── Half-tile visual movement ──────────

  const moveVisually = (playerId, fromWorldPos, toTile) => {
    const toPos  = getPosition(toTile);
    const midPos = {
      x: (fromWorldPos.x + toPos.x) / 2,
      y: toPos.y,
      z: (fromWorldPos.z + toPos.z) / 2,
    };
    return new Promise(resolve => {
      setVisualPositions(prev => ({ ...prev, [playerId]: midPos }));
      setTimeout(() => {
        setVisualPositions(prev => ({ ...prev, [playerId]: toPos }));
        setTimeout(() => resolve(toPos), 300);
      }, 300);
    });
  };

  const teleportVisually = (playerId, toTile) => {
    const toPos = toTile <= 0 ? getPosition(0) : getPosition(toTile);
    setVisualPositions(prev => ({ ...prev, [playerId]: toPos }));
    return toPos;
  };

  // ── Roll ───────────────────────────────

  const handleRollDice = () => {
    if (isRolling || isProcessing || isMigrating || winner) return;
    if (gameMode === 'single' && currentPlayer !== 1) return;
    doRoll();
  };

  const doRoll = (forced = null) => {
    if (isRolling || isProcessing || isMigrating || winner) return;
    setIsRolling(true);
    setIsProcessing(true);
    const roll = forced ?? (Math.floor(Math.random() * 6) + 1);

    setTimeout(() => {
      setDiceValue(roll);
      setIsRolling(false);
      setTimeout(() => processTurn(roll), 500);
    }, 700);
  };

  // ── Turn processing ────────────────────

  const processTurn = async (roll) => {
    const cp          = currentPlayerRef.current;
    let   nextPlayers = [...playersRef.current];
    let   pIdx        = nextPlayers.findIndex(p => p.id === cp);
    let   player      = { ...nextPlayers[pIdx] };

    const targetPos = player.pos + roll;

    if (targetPos > 100) {
      showToast(`${player.name} needs exact roll to reach tile 100!`);
    } else {
      let curWorldPos = visualPositions[player.id] || getPosition(Math.max(player.pos, 0));

      for (let step = player.pos + 1; step <= targetPos; step++) {
        curWorldPos = await moveVisually(player.id, curWorldPos, step);
        player.pos  = step;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
      }

      if (snakesRef.current[targetPos]) {
        const dest = snakesRef.current[targetPos];
        showToast(`🐍 Snake! ${player.name} drops ${targetPos - dest} tiles back!`);
        await new Promise(r => setTimeout(r, 800));
        curWorldPos = teleportVisually(player.id, dest);
        player.pos  = dest;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
      } else if (LADDERS[targetPos]) {
        const dest = LADDERS[targetPos];
        showToast(`🪜 Ladder! ${player.name} climbs ${dest - targetPos} tiles up!`);
        await new Promise(r => setTimeout(r, 800));
        curWorldPos = teleportVisually(player.id, dest);
        player.pos  = dest;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
      }

      await new Promise(r => setTimeout(r, 350));
    }

    if (player.pos === 100) {
      setWinner(player.id);
      setIsProcessing(false);
      triggerWinConfetti();
      return;
    }

    const newCount = throwCountRef.current + 1;
    setThrowCount(newCount);
    if (newCount % 10 === 0) triggerMigration();

    const total  = playersRef.current.length;
    const nextCp = cp >= total ? 1 : cp + 1;
    setIsProcessing(false);

    if (gameMode === 'local') {
      setPendingPlayer(nextCp);
      setShowTurnCut(true);
    } else {
      setCurrentPlayer(nextCp);
    }
  };

  const triggerWinConfetti = () => {
    const end = Date.now() + 3500;
    (function frame() {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors: COLORS });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  useEffect(() => {
    if (gameMode === 'single' && currentPlayer === 2 && !winner && !isProcessing && !isMigrating) {
      const t = setTimeout(() => doRoll(), 1800);
      return () => clearTimeout(t);
    }
  }, [currentPlayer, gameMode, winner, isProcessing, isMigrating]);

  const handleTurnCutComplete = () => {
    setShowTurnCut(false);
    setCurrentPlayer(pendingPlayer);
    setPendingPlayer(null);
  };

  // ── Mode Select ────────────────────────

  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 pt-28 animate-fade-in relative z-10">
        <button onClick={onBack} className="absolute top-20 left-6 p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center mb-12">
          <h1 className="font-display-lg text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-3">Snake & Ladder</h1>
          <p className="text-on-surface-variant text-lg">🌿 Cinematic Jungle Edition</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <div onClick={() => setGameMode('single')}
            className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass hover:border-neon-coral/60 hover:shadow-[0_0_30px_rgba(230,57,70,0.2)] cursor-pointer flex flex-col items-center text-center group transition-all duration-300">
            <span className="material-symbols-outlined text-6xl text-neon-coral mb-4 group-hover:scale-110 transition-transform duration-300">smart_toy</span>
            <h3 className="text-2xl font-black mb-2">Single Player</h3>
            <p className="text-on-surface-variant text-sm">Face the jungle AI</p>
          </div>
          <div onClick={() => setGameMode('local')}
            className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass hover:border-[#4361ee]/60 hover:shadow-[0_0_30px_rgba(67,97,238,0.2)] cursor-pointer flex flex-col items-center text-center group transition-all duration-300">
            <span className="material-symbols-outlined text-6xl text-[#4361ee] mb-4 group-hover:scale-110 transition-transform duration-300">group</span>
            <h3 className="text-2xl font-black mb-2">Local Multiplayer</h3>
            <p className="text-on-surface-variant text-sm mb-5">Pass &amp; play — full-screen turns</p>
            <select value={numPlayers} onChange={e => setNumPlayers(parseInt(e.target.value))} onClick={e => e.stopPropagation()}
              className="bg-glass-fill text-on-surface rounded-xl px-4 py-2 border border-glass-stroke cursor-pointer">
              {[2, 3, 4].map(n => <option key={n} value={n}>{n} Players</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ── Game Screen ────────────────────────

  const activePlayer = players.find(p => p.id === currentPlayer);
  const isMyTurn     = !winner && !isProcessing && !isMigrating &&
                       (gameMode !== 'single' || currentPlayer === 1);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: '#0c1a0c' }}>

      <div className="absolute inset-0">
        <Canvas shadows gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ fov: 60, near: 0.1, far: 300 }}>
          <JungleScene
            players={players}
            currentPlayer={currentPlayer}
            visualPositions={visualPositions}
            snakes={snakes}
            diceValue={diceValue}
            isRolling={isRolling}
          />
        </Canvas>
      </div>

      {showTurnCut && pendingPlayer != null && (
        <TurnCutOverlay player={players.find(p => p.id === pendingPlayer)} onComplete={handleTurnCutComplete} />
      )}

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">

        {/* Top bar */}
        <div className="flex items-start justify-between w-full">
          <button onClick={onBack} className="pointer-events-auto p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-2xl">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          {message && (
            <div className="pointer-events-none px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-white font-bold shadow-2xl text-sm md:text-base animate-fade-in">
              {message}
            </div>
          )}

          <div className="flex flex-col items-center bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-2xl min-w-[72px]">
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Roll</span>
            <span className="text-white text-4xl font-black leading-none mt-1">{diceValue ?? '—'}</span>
          </div>
        </div>

        {isMigrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="px-10 py-7 rounded-3xl bg-red-950/90 backdrop-blur-md border-2 border-red-500 shadow-2xl text-center">
              <h2 className="text-white text-3xl md:text-5xl font-black animate-pulse tracking-widest">🐍 SNAKES ARE MOVING!</h2>
              <p className="text-red-300 text-base mt-2 tracking-wide">Repositioning… watch your step</p>
            </div>
          </div>
        )}

        {winner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-black/90 px-14 py-12 rounded-3xl border border-white/15 shadow-2xl text-center">
              <div className="text-7xl mb-5">🏆</div>
              <h2 className="text-white text-4xl font-black mb-2">Victory!</h2>
              <p className="font-black text-4xl mb-10" style={{ color: players.find(p => p.id === winner)?.color }}>
                {players.find(p => p.id === winner)?.name} Wins!
              </p>
              <button onClick={() => initializeGame(players.length)}
                className="px-12 py-4 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="flex items-end justify-between gap-4 pointer-events-none">
          <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <button
              onClick={handleRollDice}
              disabled={!isMyTurn}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full font-black text-white text-base md:text-lg uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: activePlayer?.color ?? '#4361ee',
                boxShadow: isMyTurn ? `0 0 35px ${activePlayer?.color ?? '#4361ee'}90, 0 0 70px ${activePlayer?.color ?? '#4361ee'}40` : 'none',
              }}
            >
              {isRolling ? '…' : 'ROLL'}
            </button>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest pointer-events-none">
              {winner          ? '🏆 Game Over'
               : isMigrating  ? '🐍 Migrating'
               : isProcessing ? '⏳ Moving'
               : gameMode === 'single' && currentPlayer === 2 ? "Computer's turn"
               : `${activePlayer?.name ?? ''}'s turn`}
            </span>
          </div>

          <div className="pointer-events-auto bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-52 flex flex-col gap-1.5">
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Players</h3>
            {players.map(p => (
              <div key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ${currentPlayer === p.id && !winner ? 'bg-white/15 border border-white/30' : 'bg-transparent'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  <span className="text-white font-semibold text-sm">{p.name}</span>
                </div>
                <span className="text-white/80 font-mono font-bold text-sm">{p.pos}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 mt-1 text-center">
              <span className="text-white/25 text-[10px] tracking-wide">
                🎲 #{throwCount} · Migration #{Math.ceil((throwCount + 1) / 10) * 10}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
