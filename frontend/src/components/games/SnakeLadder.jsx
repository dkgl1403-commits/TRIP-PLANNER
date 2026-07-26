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

// ==========================================
// PROCEDURAL TEXTURES
// ==========================================

const createNoiseTexture = (baseColor, isGrass) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);
  
  const count = isGrass ? 8000 : 5000;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    if (isGrass) {
      ctx.fillStyle = `rgba(${20 + Math.random() * 30}, ${60 + Math.random() * 60}, ${20 + Math.random() * 30}, ${0.3 + Math.random() * 0.4})`;
      ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 6 + 2);
    } else {
      const dark = Math.random() > 0.5;
      ctx.fillStyle = dark ? `rgba(30, 20, 10, ${Math.random() * 0.4})` : `rgba(70, 50, 30, ${Math.random() * 0.3})`;
      const size = Math.random() * 3 + 1;
      ctx.fillRect(x, y, size, size);
    }
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(isGrass ? 2 : 1.5, isGrass ? 2 : 1.5);
  return tex;
};

const grassTex = createNoiseTexture('#1b3b22', true);
const mudTex = createNoiseTexture('#2e1f14', false);
const floorTex = createNoiseTexture('#0b170b', true);
floorTex.repeat.set(40, 40);

const COLORS = ['#e63946', '#4361ee', '#2dc653', '#8338ec', '#fb8500'];

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

// Snake body color palette — 5 distinct realistic species
const SNAKE_PALETTE = [
  { body: '#2a2015', scale: '#3c3022', eye: '#ffd700' }, // Brown python
  { body: '#182b14', scale: '#253d1d', eye: '#ffb300' }, // Olive viper
  { body: '#141414', scale: '#222222', eye: '#ff2020' }, // Black mamba
  { body: '#3a2d1d', scale: '#4a3b26', eye: '#ff8c00' }, // Desert rattler
  { body: '#243322', scale: '#364a32', eye: '#ffdd00' }, // Jungle constrictor
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

  return (
    <group position={[pos.x, 0, pos.z]}>
      <RoundedBox args={[TILE_SIZE - 0.25, TILE_H, TILE_SIZE - 0.25]} radius={0.08} castShadow receiveShadow>
        <meshStandardMaterial map={isAlt ? grassTex : mudTex} roughness={0.9} metalness={0.05} transparent={opacity < 1} opacity={opacity} />
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
      {/* Stone Dais */}
      <mesh position={[0, TILE_H * 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[TILE_SIZE * 0.85, TILE_SIZE * 0.95, TILE_H * 0.7, 32]} />
        <meshStandardMaterial color="#6b7075" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Paved Stepping Stones connecting Dais to Tile 1 */}
      {Array.from({ length: 3 }, (_, i) => {
        const stepPos = new THREE.Vector3().lerpVectors(
          new THREE.Vector3(0, 0, 0), 
          new THREE.Vector3(TILE_SIZE, 0, -TILE_SIZE), 
          (i + 1) / 4
        );
        return (
          <mesh key={`step-${i}`} position={[stepPos.x, TILE_H * 0.2, stepPos.z]} rotation={[0, Math.random(), 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, TILE_H * 0.4, 1.2]} />
            <meshStandardMaterial color="#555a5e" roughness={0.95} />
          </mesh>
        );
      })}

      <Text position={[0, TILE_H * 0.7 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.72} color="#ffd700" fontWeight="bold" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000">
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
  // Massively increase segmentation to eliminate "corners" and make smooth curves
  const numSegs = isBig ? 45 : 30;
  const headR   = isBig ? 1.25 : 0.72;
  const color   = SNAKE_PALETTE[snakeIndex % SNAKE_PALETTE.length];

  const headPos = useMemo(() => getPosition(headTile), [headTile]);
  const tailPos = useMemo(() => getPosition(tailTile), [tailTile]);

  const { dir, perp, length, zigs } = useMemo(() => {
    const d = new THREE.Vector3().subVectors(tailPos, headPos);
    const len = d.length();
    return {
      dir: d.clone().normalize(),
      perp: new THREE.Vector3(-d.z, 0, d.x).normalize(),
      length: len,
      zigs: len * 0.45,
    };
  }, [headPos, tailPos]);

  // Procedural Scale Bump Map
  const scaleTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#fff';
    // Draw diamond scales
    for (let i = 0; i <= 128; i += 16) {
      for (let j = 0; j <= 128; j += 16) {
        ctx.beginPath();
        const ox = (j % 32 === 0) ? 0 : 8;
        ctx.arc(i + ox, j, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(numSegs * 0.8, 6);
    return tex;
  }, [numSegs]);

  // Initial flat line points
  const basePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= numSegs; i++) {
      const t = i / numSegs;
      pts.push(new THREE.Vector3().lerpVectors(
        new THREE.Vector3(headPos.x, headPos.y + 0.15, headPos.z), 
        new THREE.Vector3(tailPos.x, tailPos.y + 0.15, tailPos.z), 
        t
      ));
    }
    return pts;
  }, [headPos, tailPos, numSegs]);

  const [curve] = useState(() => new THREE.CatmullRomCurve3(basePoints.map(p => p.clone())));
  const tubeRef = useRef();
  const headRef = useRef();

  useFrame(({ clock }) => {
    // Slither VERY SLOWLY
    const time = clock.elapsedTime * 0.6;

    // Slither horizontally in a smooth zigzag/coiling pattern
    for (let i = 0; i <= numSegs; i++) {
      const t = i / numSegs;
      const basePt = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(headPos.x, headPos.y + 0.15, headPos.z), 
        new THREE.Vector3(tailPos.x, tailPos.y + 0.15, tailPos.z), 
        t
      );
      
      const env = Math.sin(t * Math.PI); // Envelope to taper amplitude at head and tail
      // Reduce amplitude to 1.1 for a more natural resting slither
      const offset = Math.sin(t * zigs * Math.PI + time) * env * 1.1;
      
      basePt.addScaledVector(perp, offset);
      curve.points[i].copy(basePt);
    }

    // Orient Head
    if (headRef.current && curve.points[0] && curve.points[1]) {
      headRef.current.position.copy(curve.points[0]);
      // Look away from the body
      const lookPos = new THREE.Vector3().subVectors(curve.points[0], curve.points[1]).add(curve.points[0]);
      headRef.current.lookAt(lookPos);
    }

    // Update Continuous Tapered Tube Geometry
    if (tubeRef.current) {
      if (tubeRef.current.geometry) tubeRef.current.geometry.dispose();
      
      const tubularSegments = numSegs * 3;
      const radialSegments = 8;
      const geo = new THREE.TubeGeometry(curve, tubularSegments, headR * 0.45, radialSegments, false);
      const posAttr = geo.attributes.position;
      
      for (let i = 0; i <= tubularSegments; i++) {
        const tVal = i / tubularSegments;
        // Smoothly taper thickness towards the tail
        const taper = Math.max(0.05, 1.0 - Math.pow(tVal, 1.8));
        const center = curve.getPoint(tVal);
        
        for (let j = 0; j <= radialSegments; j++) {
          const idx = i * (radialSegments + 1) + j;
          const px = posAttr.getX(idx);
          const py = posAttr.getY(idx);
          const pz = posAttr.getZ(idx);
          
          posAttr.setXYZ(idx,
             center.x + (px - center.x) * taper,
             center.y + (py - center.y) * taper,
             center.z + (pz - center.z) * taper
          );
        }
      }
      geo.computeVertexNormals();
      tubeRef.current.geometry = geo;
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
    <meshStandardMaterial
      color={color.body}
      roughness={0.85}
      metalness={0.15}
      bumpMap={scaleTex}
      bumpScale={0.06}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );

  return (
    <group>
      {/* OPEN MOUTH / AGGRESSIVE ORGANIC HEAD */}
      <group ref={headRef} castShadow>
        {/* Main Skull (Sleek, flattened ellipsoid) */}
        <mesh position={[0, headR * 0.2, headR * 0.1]} scale={[0.8, 0.45, 1.1]} castShadow>
          <sphereGeometry args={[headR, 32, 16]} />
          {bodyMat}
        </mesh>
        
        {/* Flared Jaw Muscles (Venom glands) */}
        <mesh position={[-headR * 0.45, headR * 0.15, headR * 0.5]} rotation={[0, -0.3, 0]} scale={[0.5, 0.4, 0.8]} castShadow>
          <sphereGeometry args={[headR * 0.7, 16, 16]} />
          {bodyMat}
        </mesh>
        <mesh position={[headR * 0.45, headR * 0.15, headR * 0.5]} rotation={[0, 0.3, 0]} scale={[0.5, 0.4, 0.8]} castShadow>
          <sphereGeometry args={[headR * 0.7, 16, 16]} />
          {bodyMat}
        </mesh>
        
        {/* Upper Jaw / Snout (Tapered, flattened, angled up) */}
        <mesh position={[0, headR * 0.35, -headR * 0.75]} rotation={[-Math.PI / 2 + 0.25, 0, 0]} scale={[0.7, 1.2, 0.35]} castShadow>
          <cylinderGeometry args={[headR * 0.35, headR * 0.8, headR * 1.6, 16]} />
          {bodyMat}
        </mesh>
        
        {/* Lower Jaw (Tapered, flattened, angled down) */}
        <mesh position={[0, -headR * 0.15, -headR * 0.65]} rotation={[-Math.PI / 2 - 0.25, 0, 0]} scale={[0.6, 1.0, 0.25]} castShadow>
          <cylinderGeometry args={[headR * 0.25, headR * 0.7, headR * 1.4, 16]} />
          {bodyMat}
        </mesh>
        
        {/* Inside Mouth / Dark Throat */}
        <mesh position={[0, headR * 0.1, -headR * 0.6]} scale={[0.6, 0.4, 1.0]}>
          <sphereGeometry args={[headR * 0.85, 16, 16]} />
          <meshStandardMaterial color="#1a0000" roughness={0.9} />
        </mesh>
        
        {/* Curved Organic Fangs (Angled backwards) */}
        <mesh position={[-headR * 0.25, headR * 0.05, -headR * 1.3]} rotation={[0.5, 0, -0.1]} scale={[0.8, 1, 0.8]} castShadow>
          <coneGeometry args={[headR * 0.12, headR * 0.9, 12]} />
          <meshStandardMaterial color="#f0f5e5" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[headR * 0.25, headR * 0.05, -headR * 1.3]} rotation={[0.5, 0, 0.1]} scale={[0.8, 1, 0.8]} castShadow>
          <coneGeometry args={[headR * 0.12, headR * 0.9, 12]} />
          <meshStandardMaterial color="#f0f5e5" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Sleek Glowing Slit Eyes (Ellipsoids) */}
        <mesh position={[-headR * 0.45, headR * 0.45, -headR * 0.4]} rotation={[0, -0.4, 0.2]} scale={[0.15, 0.7, 0.4]}>
          <sphereGeometry args={[headR * 0.3, 16, 16]} />
          <meshStandardMaterial color={color.eye} emissive={color.eye} emissiveIntensity={5} transparent opacity={opacity} />
        </mesh>
        <mesh position={[headR * 0.45, headR * 0.45, -headR * 0.4]} rotation={[0, 0.4, -0.2]} scale={[0.15, 0.7, 0.4]}>
          <sphereGeometry args={[headR * 0.3, 16, 16]} />
          <meshStandardMaterial color={color.eye} emissive={color.eye} emissiveIntensity={5} transparent opacity={opacity} />
        </mesh>
        
        {/* Forked Tongue */}
        <mesh position={[0, -headR * 0.05, -headR * 1.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[headR * 0.03, headR * 0.04, headR * 0.7, 6]} />
          <meshStandardMaterial color="#dd0022" roughness={0.4} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-headR * 0.1, -headR * 0.05, -headR * 1.65]} rotation={[-Math.PI / 2, 0, -0.4]} castShadow>
          <cylinderGeometry args={[headR * 0.015, headR * 0.03, headR * 0.4, 6]} />
          <meshStandardMaterial color="#dd0022" roughness={0.4} transparent opacity={opacity} />
        </mesh>
        <mesh position={[headR * 0.1, -headR * 0.05, -headR * 1.65]} rotation={[-Math.PI / 2, 0, 0.4]} castShadow>
          <cylinderGeometry args={[headR * 0.015, headR * 0.03, headR * 0.4, 6]} />
          <meshStandardMaterial color="#dd0022" roughness={0.4} transparent opacity={opacity} />
        </mesh>
        
        <pointLight color={color.eye} intensity={isBig ? 6 : 3} distance={isBig ? 10 : 6} position={[0, headR * 0.3, -headR * 0.5]} />
      </group>

      {/* CONTINUOUS BODY TUBE */}
      <mesh ref={tubeRef} castShadow>
        {/* Geometry is injected dynamically in useFrame */}
        <tubeGeometry args={[curve, numSegs * 3, headR * 0.45, 10, false]} />
        {bodyMat}
      </mesh>
    </group>
  );
};

// ==========================================
// LADDER — Wooden jungle ladder
// ==========================================

// ==========================================
// WOODEN BRIDGE — Replaces Ladder
// ==========================================

const Ladder = ({ fromTile, toTile, activePlayerPos }) => {
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

  const start = useMemo(() => new THREE.Vector3(fp.x, fp.y + TILE_H / 2 + 0.1, fp.z), [fromTile]);
  const end   = useMemo(() => new THREE.Vector3(tp.x, tp.y + TILE_H / 2 + 0.1, tp.z), [toTile]);

  const { curve, leftRopeCurve, rightRopeCurve, numPlanks, perpDir } = useMemo(() => {
    const d = start.distanceTo(end);
    
    // Control point for the arch
    const control = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // Peak height based on distance (make it arch gracefully high into the air)
    control.y += Math.max(2.5, d * 0.45); 

    const mainCurve = new THREE.QuadraticBezierCurve3(start, control, end);
    const length = mainCurve.getLength();
    // Dynamic plank count based on curve length
    const planksCount = Math.max(6, Math.round(length / 0.55));

    // Calculate perpendicular direction (horizontal) to offset ropes
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

    const ROAD_HALF = 0.75;
    
    // Sagging handrails (control point is lower than the main bridge control point to simulate gravity/sag)
    const sag = 0.4; 
    
    // Offset the start, control, and end points for left and right ropes
    const lStart = start.clone().addScaledVector(perp, ROAD_HALF).add(new THREE.Vector3(0, 0.45, 0));
    const lEnd = end.clone().addScaledVector(perp, ROAD_HALF).add(new THREE.Vector3(0, 0.45, 0));
    const lControl = control.clone().addScaledVector(perp, ROAD_HALF).add(new THREE.Vector3(0, 0.45 - sag, 0));
    const lCurve = new THREE.QuadraticBezierCurve3(lStart, lControl, lEnd);

    const rStart = start.clone().addScaledVector(perp, -ROAD_HALF).add(new THREE.Vector3(0, 0.45, 0));
    const rEnd = end.clone().addScaledVector(perp, -ROAD_HALF).add(new THREE.Vector3(0, 0.45, 0));
    const rControl = control.clone().addScaledVector(perp, -ROAD_HALF).add(new THREE.Vector3(0, 0.45 - sag, 0));
    const rCurve = new THREE.QuadraticBezierCurve3(rStart, rControl, rEnd);

    return { 
      curve: mainCurve, 
      leftRopeCurve: lCurve, 
      rightRopeCurve: rCurve, 
      numPlanks: planksCount,
      perpDir: perp
    };
  }, [start, end]);

  const woodMat = <meshStandardMaterial color="#5c3a21" roughness={0.88} metalness={0.05} transparent opacity={opacity} />;
  const ropeMat = <meshStandardMaterial color="#b38b59" roughness={0.95} metalness={0.01} transparent opacity={opacity} />;
  const postMat = <meshStandardMaterial color="#3d2615" roughness={0.90} metalness={0.02} transparent opacity={opacity} />;

  const ROAD_HALF = 0.75;

  return (
    <group>
      {/* Dynamic Planks along the arched bridge */}
      {Array.from({ length: numPlanks }, (_, i) => {
        const t = i / (numPlanks - 1);
        const plankPt = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        
        // Use a dummy object to perfectly calculate the "lookAt" quaternion.
        // This ensures the X axis (width of plank) stays perfectly horizontal
        // while the Z axis points along the curve.
        const dummy = new THREE.Object3D();
        dummy.position.copy(plankPt);
        dummy.lookAt(plankPt.clone().add(tangent));
        const plankQuat = dummy.quaternion.clone();
        
        return (
          <mesh key={i} position={plankPt.toArray()} quaternion={plankQuat} castShadow receiveShadow>
            <boxGeometry args={[ROAD_HALF * 2.2, 0.08, 0.35]} />
            {woodMat}
          </mesh>
        );
      })}

      {/* Left rope handrail (Procedural Tube) */}
      <mesh castShadow>
        <tubeGeometry args={[leftRopeCurve, Math.max(10, numPlanks), 0.06, 8, false]} />
        {ropeMat}
      </mesh>

      {/* Right rope handrail (Procedural Tube) */}
      <mesh castShadow>
        <tubeGeometry args={[rightRopeCurve, Math.max(10, numPlanks), 0.06, 8, false]} />
        {ropeMat}
      </mesh>
      
      {/* Support posts at start & end */}
      {[-ROAD_HALF, ROAD_HALF].map((offset, i) => (
        <React.Fragment key={`post-${i}`}>
          <mesh position={start.clone().addScaledVector(perpDir, offset).add(new THREE.Vector3(0, 0.25, 0)).toArray()} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.5, 8]} />
            {postMat}
          </mesh>
          <mesh position={end.clone().addScaledVector(perpDir, offset).add(new THREE.Vector3(0, 0.25, 0)).toArray()} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.5, 8]} />
            {postMat}
          </mesh>
        </React.Fragment>
      ))}
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

  // Dice sits on the tile, offset to front-right, scaled down to match character proportion
  const px = tilePos.x + 1.2;
  const py = TILE_H + 0.35;
  const pz = tilePos.z + 1.0;

  const pips = DICE_PIPS[value] || DICE_PIPS[1];

  return (
    <group position={[px, py, pz]}>
      {/* Bounce container */}
      <group ref={diceRef}>
        {/* Dice body */}
        <RoundedBox args={[0.48, 0.48, 0.48]} radius={0.09} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#fffff8" roughness={0.04} metalness={0.08} clearcoat={1} clearcoatRoughness={0.04} />
        </RoundedBox>

        {/* TOP face (1) */}
        {DICE_PIPS[1].map(([ox, oz], i) => (
          <mesh key={`t${i}`} position={[ox * 0.38, 0.25, oz * 0.38]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}
        {/* BOTTOM face (6) */}
        {DICE_PIPS[6].map(([ox, oz], i) => (
          <mesh key={`b${i}`} position={[ox * 0.38, -0.25, oz * 0.38]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}

        {/* FRONT face (2) */}
        {DICE_PIPS[2].map(([ox, oy], i) => (
          <mesh key={`f${i}`} position={[ox * 0.38, oy * 0.38, 0.25]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}
        {/* BACK face (5) */}
        {DICE_PIPS[5].map(([ox, oy], i) => (
          <mesh key={`bk${i}`} position={[ox * 0.38, oy * 0.38, -0.25]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}

        {/* RIGHT face (3) */}
        {DICE_PIPS[3].map(([oy, oz], i) => (
          <mesh key={`r${i}`} position={[0.25, oy * 0.38, oz * 0.38]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}
        {/* LEFT face (4) */}
        {DICE_PIPS[4].map(([oy, oz], i) => (
          <mesh key={`l${i}`} position={[-0.25, oy * 0.38, oz * 0.38]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#4a0e0e" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Soft golden light */}
      <pointLight color="#ffe8a0" intensity={0.8} distance={3} position={[0, 0.6, 0]} />
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

  const prevPosRef   = useRef({ x: target.x, z: target.z });
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
    
    // Distance traveled this frame
    const frameDist = Math.sqrt((curX - prevPosRef.current.x) ** 2 + (curZ - prevPosRef.current.z) ** 2);
    prevPosRef.current = { x: curX, z: curZ };

    const tgtX    = target.x + slotX;
    const tgtZ    = target.z + slotZ;
    const distToTgt = Math.sqrt((tgtX - curX) ** 2 + (tgtZ - curZ) ** 2);
    const moving  = distToTgt > 0.05;

    if (moving && frameDist > 0.001) {
      // Leg stride is tied DIRECTLY to physical distance moved (no sliding!)
      // Stride length ~ 0.8 units per full leg cycle (2pi radians)
      walkPhase.current += (frameDist / 0.4);
      const dx = tgtX - curX;
      const dz = tgtZ - curZ;
      if (Math.abs(dx) + Math.abs(dz) > 0.05) {
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

  useFrame((_, delta) => {
    // Smoother interpolation using delta for frame-rate independence
    idealPos.current.set(targetPos.x, targetPos.y + 5.5, targetPos.z + 9);
    lookRef.current.set(targetPos.x, targetPos.y + 0.8, targetPos.z - 4);
    
    camera.position.lerp(idealPos.current, delta * 3.5);
    
    const dir = lookRef.current.clone().sub(camera.position).normalize();
    const curDir = new THREE.Vector3();
    camera.getWorldDirection(curDir);
    curDir.lerp(dir, delta * 4.0);
    camera.lookAt(camera.position.clone().addScaledVector(curDir, 20));
  });

  return null;
};

// ==========================================
// 3D JUNGLE ENVIRONMENT & FIREFLIES
// ==========================================

const JungleTrees = () => {
  const trees = useMemo(() => {
    const list = [];
    // Generate surrounding trees strictly along outer perimeter of the 10x10 board
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      // Skip trees near the Start Platform (angle approx 3PI/4 or 2.35 rad)
      if (angle > 1.9 && angle < 2.8) continue;
      const dist  = 30 + (i % 3) * 5;
      const x     = Math.cos(angle) * dist;
      const z     = Math.sin(angle) * dist;
      const scale = 0.8 + (i % 4) * 0.3;
      const rotY  = -angle + Math.PI / 2; // Face towards the center (0,0,0)
      list.push({ x, z, scale, rotY, key: i });
    }
    return list;
  }, []);

  return (
    <group>
      {trees.map(t => (
        <group key={t.key} position={[t.x, 0, t.z]} scale={[t.scale, t.scale, t.scale]} rotation={[0, t.rotY, 0]}>
          <group rotation={[-Math.PI / 10, 0, 0]}> {/* Lean inward towards the board */}
            {/* Thin Main Trunk */}
            <mesh position={[0, 8, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.6, 16, 8]} />
              <meshStandardMaterial color="#3a2312" roughness={0.95} />
            </mesh>
            
            {/* Branch 1 (Leaning forward/over) */}
            <mesh position={[0, 13, 2]} rotation={[0.4, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.3, 8, 8]} />
              <meshStandardMaterial color="#3a2312" roughness={0.95} />
            </mesh>

            {/* Branch 2 (Leaning right/over) */}
            <mesh position={[1.5, 11, 0]} rotation={[0, 0, -0.6]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.25, 6, 8]} />
              <meshStandardMaterial color="#3a2312" roughness={0.95} />
            </mesh>

            {/* Branch 3 (Leaning left) */}
            <mesh position={[-1.2, 12, 0.5]} rotation={[0.2, 0, 0.5]} castShadow receiveShadow>
              <cylinderGeometry args={[0.1, 0.2, 5, 8]} />
              <meshStandardMaterial color="#3a2312" roughness={0.95} />
            </mesh>

            {/* Main Canopy */}
            <mesh position={[0, 16, 0]} castShadow>
              <coneGeometry args={[4.5, 6, 8]} />
              <meshStandardMaterial color="#1b4d24" roughness={0.8} />
            </mesh>
            {/* Front Canopy (Over the board) */}
            <mesh position={[0, 15, 4.5]} castShadow>
              <coneGeometry args={[3.5, 5, 8]} />
              <meshStandardMaterial color="#2d6a36" roughness={0.75} />
            </mesh>
            {/* Side Canopies */}
            <mesh position={[2.5, 13, 0]} castShadow>
              <coneGeometry args={[2.5, 4, 8]} />
              <meshStandardMaterial color="#1f5429" roughness={0.78} />
            </mesh>
            <mesh position={[-2, 13.5, 1.5]} castShadow>
              <coneGeometry args={[2, 3, 8]} />
              <meshStandardMaterial color="#1b4d24" roughness={0.78} />
            </mesh>
            
            {/* Dangling jungle vines (Hanging straight down) */}
            <mesh position={[0, 10, 3.5]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 10, 4]} />
              <meshStandardMaterial color="#1a3a1e" roughness={0.9} />
            </mesh>
            <mesh position={[1.5, 9, 1]} rotation={[0.1, 0, 0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 12, 4]} />
              <meshStandardMaterial color="#1a3a1e" roughness={0.9} />
            </mesh>
            <mesh position={[-1.5, 10, 2]} rotation={[0.2, 0, -0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 8, 4]} />
              <meshStandardMaterial color="#2d6a36" roughness={0.9} />
            </mesh>
            <mesh position={[0, 11, 2]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 14, 4]} />
              <meshStandardMaterial color="#1a3a1e" roughness={0.9} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

const Fireflies = ({ activePos }) => {
  const fliesRef = useRef([]);
  const count    = 18;

  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      baseX: activePos.x + (Math.random() - 0.5) * 16,
      baseY: 1.5 + Math.random() * 4,
      baseZ: activePos.z + (Math.random() - 0.5) * 16,
      speed: 0.8 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [activePos.x, activePos.z]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    fliesRef.current.forEach((ref, i) => {
      if (ref && positions[i]) {
        const p = positions[i];
        ref.position.x = p.baseX + Math.sin(t * p.speed + p.phase) * 1.5;
        ref.position.y = p.baseY + Math.cos(t * p.speed * 1.3) * 0.6;
        ref.position.z = p.baseZ + Math.cos(t * p.speed + p.phase) * 1.5;
      }
    });
  });

  return (
    <group>
      {positions.map((_, i) => (
        <mesh key={i} ref={el => { fliesRef.current[i] = el; }}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#aaff44" emissive="#aaff44" emissiveIntensity={5} />
        </mesh>
      ))}
    </group>
  );
};

// ==========================================
// JUNGLE SCENE
// ==========================================

const JungleScene = ({ players, currentPlayer, visualPositions, snakes, diceValue, isRolling }) => {
  const activePl  = players.find(p => p.id === currentPlayer) || players[0];
  const activePlayerPos = activePl?.pos ?? 0;
  
  // Track visual position directly for incredibly smooth camera follow
  const visualPos = activePl ? visualPositions[activePl.id] : null;
  const activePos = visualPos 
    ? { x: visualPos.x, y: visualPos.y, z: visualPos.z } 
    : (activePl?.pos <= 0 ? getPosition(0) : getPosition(activePl?.pos || 0));

  // Dice stays at the origin of the turn start until a new turn
  const [diceAnchor, setDiceAnchor] = useState(activePos);
  useEffect(() => {
    if (isRolling) setDiceAnchor(activePos);
  }, [isRolling]);

  const diceWorldPos = diceAnchor;

  return (
    <>
      <color attach="background" args={['#061206']} />
      <fog attach="fog" args={['#0e2612', 10, 28]} />

      <Sky distance={450000} sunPosition={[80, 15, 60]} turbidity={10} rayleigh={0.6} mieCoefficient={0.008} mieDirectionalG={0.8} />

      <ambientLight intensity={0.45} color="#3d6b47" />
      <directionalLight position={[25, 35, 12]} intensity={2.2} color="#fff8d6" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-near={0.5} shadow-camera-far={140}
        shadow-camera-left={-40} shadow-camera-right={40}
        shadow-camera-top={40} shadow-camera-bottom={-40}
      />
      <directionalLight position={[-15, 15, -15]} intensity={0.6} color="#4890a8" />

      <Environment preset="forest" />
      <CameraRig targetPos={activePos} />

      {/* Jungle floor mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial map={floorTex} roughness={0.95} />
      </mesh>

      {/* Surrounding 3D Jungle Trees */}
      <JungleTrees />

      {/* Floating Firefly Particles */}
      <Fireflies activePos={activePos} />

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

      {/* Bridges */}
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
      
      {/* Roll Announcement */}
      {diceValue != null && !isRolling && (
        <group position={[activePos.x, activePos.y + 4.5, activePos.z]} rotation={[-Math.PI / 8, 0, 0]}>
          <Text fontSize={2.2} color="#ffd700" anchorX="center" anchorY="middle" outlineWidth={0.08} outlineColor="#2b1100" fontWeight="bold">
            {diceValue}
          </Text>
        </group>
      )}

      {/* Characters */}
      {players.map((p, i) => (
        <Character key={p.id} player={p} isActive={p.id === currentPlayer} slotIndex={i} visualTarget={visualPositions[p.id]} />
      ))}

      <ContactShadows position={[0, -0.28, 0]} opacity={0.4} scale={80} blur={2.2} far={5} />
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
        setTimeout(() => resolve(toPos), 450); // Increased from 300
      }, 450); // Increased from 300 to slow player movement (Task 8)
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
        showToast(`🐍 Snake! ${player.name} slides ${targetPos - dest} tiles back!`);
        await new Promise(r => setTimeout(r, 600));
        
        // SLIDE ALONG SNAKE CURVE
        const fp = getPosition(targetPos);
        const tp = getPosition(dest);
        const numSegs = (targetPos - dest) >= 50 ? 45 : 30;
        
        const d = new THREE.Vector3().subVectors(tp, fp);
        const len = d.length();
        const perp = new THREE.Vector3(-d.z, 0, d.x).normalize();
        const zigs = len * 0.45;
        
        const basePoints = [];
        for (let i = 0; i <= numSegs; i++) {
          const t = i / numSegs;
          const basePt = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(fp.x, fp.y + 0.15, fp.z), 
            new THREE.Vector3(tp.x, tp.y + 0.15, tp.z), 
            t
          );
          const env = Math.sin(t * Math.PI); 
          const offset = Math.sin(t * zigs * Math.PI) * env * 1.1; 
          basePt.addScaledVector(perp, offset);
          basePoints.push(basePt);
        }
        
        const curve = new THREE.CatmullRomCurve3(basePoints);
        const slideSteps = Math.max(15, Math.round(len * 2));
        
        for (let s = 1; s <= slideSteps; s++) {
          const ratio = s / slideSteps;
          const stepPt = curve.getPoint(ratio);
          setVisualPositions(prev => ({ ...prev, [player.id]: { x: stepPt.x, y: stepPt.y, z: stepPt.z } }));
          await new Promise(r => setTimeout(r, 60)); // Fast slippery slide down
        }

        player.pos  = dest;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
      } else if (LADDERS[targetPos]) {
        const dest = LADDERS[targetPos];
        showToast(`🌉 Wooden Bridge! ${player.name} slowly crosses to tile ${dest}!`);
        await new Promise(r => setTimeout(r, 600));

        // Walk SLOWLY across the arched bridge
        const fp = getPosition(targetPos);
        const tp = getPosition(dest);
        const start = new THREE.Vector3(fp.x, fp.y + 0.1, fp.z);
        const end   = new THREE.Vector3(tp.x, tp.y + 0.1, tp.z);
        
        const dist = start.distanceTo(end);
        const control = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        control.y += Math.max(2.5, dist * 0.45); // Match the exact bridge arch height
        
        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const curveLength = curve.getLength();
        const bridgeSteps = Math.max(10, Math.round(curveLength * 2.5));

        for (let b = 1; b <= bridgeSteps; b++) {
          const ratio = b / bridgeSteps;
          const stepPt = curve.getPoint(ratio);
          
          setVisualPositions(prev => ({ ...prev, [player.id]: { x: stepPt.x, y: stepPt.y, z: stepPt.z } }));
          await new Promise(r => setTimeout(r, 120)); // Smoother, faster steps along the curve
        }

        player.pos = dest;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
      }

      await new Promise(r => setTimeout(r, 2500)); // Cinematic pause before next turn
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
