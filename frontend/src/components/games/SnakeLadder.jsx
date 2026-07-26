import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment, ContactShadows, RoundedBox, Sky, Capsule } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

// ==========================================
// CONSTANTS
// ==========================================

const TILE_SIZE = 4.5;       // Each tile is 4.5 units wide
const TILE_H    = 0.55;      // Tile height/depth
const FOG_R     = 3.2;       // Visible tile radius around active player

const COLORS = ['#e63946', '#4361ee', '#2dc653', '#8338ec', '#fb8500'];

// Ladders: {from: to}
const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

// ==========================================
// COORDINATE HELPERS
// ==========================================

/** Returns {row, col} (row 0 = bottom, col 0 = left) for a tile number 1-100 */
const getTileCoord = (n) => {
  const idx  = n - 1;
  const row  = Math.floor(idx / 10);
  const colR = idx % 10;
  const col  = row % 2 === 0 ? colR : 9 - colR; // serpentine
  return { row, col };
};

/** Returns world {x, y, z} for a tile number. pos=0 → start platform */
const getPosition = (n) => {
  if (n <= 0) {
    const t1 = getPosition(1);
    return { x: t1.x - TILE_SIZE, y: TILE_H / 2, z: t1.z + TILE_SIZE };
  }
  const { row, col } = getTileCoord(n);
  return {
    x:  (col - 4.5) * TILE_SIZE,
    y:  TILE_H / 2,
    z: -(row - 4.5) * TILE_SIZE,   // row 0 closest to camera (+Z)
  };
};

// ==========================================
// SNAKE GENERATION  (game logic, no 3D rendering in Phase 1)
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

  // Danger-zone guards first (heads in 75-99)
  place(75, 99, 50);   // big guard
  place(75, 99, 20);   // small guard
  // Roamers
  place(51, 99, 50);   // big roamer
  place(21, 74, 20);   // small roamer 1
  place(21, 74, 20);   // small roamer 2

  return snakes;
};

// ==========================================
// TILE  (fog-of-war aware)
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
      {/* Tile body */}
      <RoundedBox
        args={[TILE_SIZE - 0.25, TILE_H, TILE_SIZE - 0.25]}
        radius={0.08}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={tileCol}
          roughness={0.65}
          metalness={0.08}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </RoundedBox>

      {/* Gold rim on top face */}
      <mesh position={[0, TILE_H / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[(TILE_SIZE - 0.25) / 2 - 0.18, (TILE_SIZE - 0.25) / 2 - 0.04, 4, 1]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={isPlayerHere ? 1.2 : 0.12}
          transparent
          opacity={opacity * 0.55}
        />
      </mesh>

      {/* Tile number — only show when close enough to read */}
      {dist < 2.2 && (
        <Text
          position={[0, TILE_H / 2 + 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.7}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {number}
        </Text>
      )}

      {/* Active tile glow light */}
      {isPlayerHere && (
        <pointLight position={[0, 1.2, 0]} color="#ffd700" intensity={3} distance={7} />
      )}
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
        <Tile
          key={n}
          number={n}
          playerRow={pRow}
          playerCol={pCol}
          isPlayerHere={activePlayerPos === n}
        />
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
      <Text
        position={[0, TILE_H * 0.35 + 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.72}
        color="#ffd700"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        START
      </Text>
      <pointLight position={[0, 1.8, 0]} color="#ffd700" intensity={2} distance={6} />
    </group>
  );
};

// ==========================================
// CHARACTER TOKEN
// ==========================================

const Character = ({ player, isActive, slotIndex }) => {
  // Slot offset so multiple players on same tile don't overlap
  const slotX = ((slotIndex % 2) - 0.5) * 1.0;
  const slotZ = (Math.floor(slotIndex / 2) - 0.5) * 1.0;

  const worldPos = player.pos <= 0 ? getPosition(0) : getPosition(player.pos);

  const { px, py, pz } = useSpring({
    px: worldPos.x + slotX,
    py: worldPos.y + TILE_H / 2 + 0.05,
    pz: worldPos.z + slotZ,
    config: { mass: 1.2, tension: 140, friction: 20 },
  });

  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (isActive && groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 2.8) * 0.1;
    } else if (groupRef.current) {
      groupRef.current.position.y = 0;
    }
  });

  return (
    <a.group position-x={px} position-y={py} position-z={pz}>
      <group ref={groupRef}>
        {/* Body */}
        <Capsule args={[0.32, 0.7, 4, 8]} position={[0, 0.1, 0]} castShadow>
          <meshPhysicalMaterial
            color={player.color}
            metalness={0.3}
            roughness={0.25}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Capsule>

        {/* Head */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshPhysicalMaterial
            color={player.color}
            metalness={0.4}
            roughness={0.2}
            clearcoat={1}
            emissive={isActive ? player.color : '#000000'}
            emissiveIntensity={isActive ? 0.5 : 0}
          />
        </mesh>

        {/* Glow disc at feet */}
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial
            color={player.color}
            emissive={player.color}
            emissiveIntensity={isActive ? 3 : 1}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* Color point light below token */}
      {isActive && (
        <pointLight color={player.color} intensity={2} distance={5} position={[0, 0.5, 0]} />
      )}
    </a.group>
  );
};

// ==========================================
// CAMERA RIG — follows active player
// ==========================================

const CameraRig = ({ targetPos }) => {
  const { camera } = useThree();
  const idealPos   = useRef(new THREE.Vector3());
  const lookRef    = useRef(new THREE.Vector3());

  useFrame(() => {
    // Camera sits above and behind the active player
    idealPos.current.set(targetPos.x, targetPos.y + 5.5, targetPos.z + 9);
    // Look slightly ahead of the character (toward tile interior)
    lookRef.current.set(targetPos.x, targetPos.y + 0.8, targetPos.z - 4);

    camera.position.lerp(idealPos.current, 0.06);

    // Smoothly steer camera toward look target
    const dir = lookRef.current.clone().sub(camera.position).normalize();
    const curDir = new THREE.Vector3();
    camera.getWorldDirection(curDir);
    curDir.lerp(dir, 0.08);
    camera.lookAt(camera.position.clone().addScaledVector(curDir, 20));
  });

  return null;
};

// ==========================================
// JUNGLE SCENE (3D world)
// ==========================================

const JungleScene = ({ players, currentPlayer, isProcessing }) => {
  const activePl   = players.find(p => p.id === currentPlayer) || players[0];
  const activePos  = activePl
    ? (activePl.pos <= 0 ? getPosition(0) : getPosition(activePl.pos))
    : { x: 0, y: 0, z: 0 };

  return (
    <>
      {/* Deep jungle atmosphere */}
      <color attach="background" args={['#0c1a0c']} />
      <fog attach="fog" args={['#1a3d1a', 14, 32]} />

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[80, 20, 60]}
        turbidity={8}
        rayleigh={0.4}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#4a7c59" />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.6}
        color="#fffbe6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />
      {/* Cool fill from opposite side */}
      <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#6ab8c8" />

      {/* Forest environment reflections */}
      <Environment preset="forest" />

      {/* Follow Camera */}
      <CameraRig targetPos={activePos} />

      {/* Dark abyss ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#080d08" roughness={1} />
      </mesh>

      {/* Board tiles */}
      <Board activePlayerPos={activePl?.pos ?? 0} />

      {/* Start platform */}
      <StartPlatform />

      {/* Player characters */}
      {players.map((p, i) => (
        <Character key={p.id} player={p} isActive={p.id === currentPlayer} slotIndex={i} />
      ))}

      {/* Soft contact shadows */}
      <ContactShadows position={[0, -0.28, 0]} opacity={0.35} scale={80} blur={2.5} far={4} />
    </>
  );
};

// ==========================================
// TURN CUT OVERLAY
// ==========================================

const TurnCutOverlay = ({ player, onComplete }) => {
  const [phase, setPhase] = useState('black');   // black → show → fade

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'),  350);
    const t2 = setTimeout(() => setPhase('fade'),  1900);
    const t3 = setTimeout(() => onComplete(),      2350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center
        transition-opacity duration-350
        ${phase === 'black' ? 'opacity-100 bg-black' : ''}
        ${phase === 'show'  ? 'opacity-100 bg-black/85' : ''}
        ${phase === 'fade'  ? 'opacity-0  bg-black' : ''}
      `}
      style={{ pointerEvents: 'all', backdropFilter: 'blur(6px)' }}
    >
      <div className={`flex flex-col items-center transition-all duration-300
        ${phase === 'show' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div
          className="w-24 h-24 rounded-full mb-6 shadow-2xl"
          style={{
            backgroundColor: player?.color,
            boxShadow: `0 0 60px ${player?.color}, 0 0 120px ${player?.color}55`
          }}
        />
        <h2 className="text-white text-5xl font-black tracking-widest uppercase mb-3">
          {player?.name}
        </h2>
        <p className="text-white/50 text-lg font-bold tracking-widest uppercase">
          🌿 Your Turn
        </p>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SnakeLadder({ user, onBack }) {
  // ── Mode / setup ──────────────────────────────────
  const [gameMode,   setGameMode]   = useState(null);
  const [numPlayers, setNumPlayers] = useState(2);

  // ── Game state ────────────────────────────────────
  const [players,      setPlayers]      = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue,    setDiceValue]    = useState(null);
  const [isRolling,    setIsRolling]    = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [winner,       setWinner]       = useState(null);
  const [message,      setMessage]      = useState('');

  // ── Snake state ───────────────────────────────────
  const [snakes,       setSnakes]       = useState({});
  const [throwCount,   setThrowCount]   = useState(0);
  const [isMigrating,  setIsMigrating]  = useState(false);

  // ── Turn-cut overlay ──────────────────────────────
  const [showTurnCut,    setShowTurnCut]    = useState(false);
  const [pendingPlayer,  setPendingPlayer]  = useState(null);

  // ── Stable refs ───────────────────────────────────
  const playersRef      = useRef(players);
  const currentPlayerRef = useRef(currentPlayer);
  const snakesRef       = useRef(snakes);
  const throwCountRef   = useRef(throwCount);

  useEffect(() => { playersRef.current = players;           }, [players]);
  useEffect(() => { currentPlayerRef.current = currentPlayer; }, [currentPlayer]);
  useEffect(() => { snakesRef.current = snakes;             }, [snakes]);
  useEffect(() => { throwCountRef.current = throwCount;     }, [throwCount]);

  // ==========================================
  // INIT
  // ==========================================

  const initializeGame = useCallback((count) => {
    const pList = [];
    for (let i = 1; i <= count; i++) {
      const name = gameMode === 'single'
        ? (i === 1 ? 'You' : 'Computer')
        : `Player ${i}`;
      pList.push({ id: i, pos: 0, color: COLORS[i - 1], name });
    }
    setPlayers(pList);
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

  // ==========================================
  // TOAST
  // ==========================================

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3200);
  };

  // ==========================================
  // SNAKE MIGRATION
  // ==========================================

  const triggerMigration = () => {
    setIsMigrating(true);
    setTimeout(() => {
      setSnakes(generateSnakes());
      setTimeout(() => setIsMigrating(false), 1800);
    }, 1200);
  };

  // ==========================================
  // TURN LOGIC
  // ==========================================

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

    // Short delay for animation feel, then commit result
    setTimeout(() => {
      setDiceValue(roll);
      setIsRolling(false);
      setTimeout(() => processTurn(roll), 700);
    }, 380);
  };

  const processTurn = async (roll) => {
    const cp          = currentPlayerRef.current;
    let   nextPlayers = [...playersRef.current];
    let   pIdx        = nextPlayers.findIndex(p => p.id === cp);
    let   player      = { ...nextPlayers[pIdx] };

    const targetPos = player.pos + roll;

    if (targetPos > 100) {
      showToast(`${player.name} needs exact roll to enter tile 100!`);
    } else {
      // Walk tile by tile
      for (let step = player.pos + 1; step <= targetPos; step++) {
        player.pos = step;
        nextPlayers[pIdx] = { ...player };
        setPlayers([...nextPlayers]);
        await new Promise(r => setTimeout(r, 280));
      }

      // Check snake
      if (snakesRef.current[targetPos]) {
        const dest = snakesRef.current[targetPos];
        const drop  = targetPos - dest;
        showToast(`🐍 Snake! ${player.name} drops ${drop} tiles back!`);
        await new Promise(r => setTimeout(r, 900));
        player.pos = dest;
      }
      // Check ladder
      else if (LADDERS[targetPos]) {
        const dest  = LADDERS[targetPos];
        const climb = dest - targetPos;
        showToast(`🪜 Ladder! ${player.name} climbs ${climb} tiles up!`);
        await new Promise(r => setTimeout(r, 900));
        player.pos = dest;
      }

      nextPlayers[pIdx] = { ...player };
      setPlayers([...nextPlayers]);
      await new Promise(r => setTimeout(r, 350));
    }

    // Win check
    if (player.pos === 100) {
      setWinner(player.id);
      setIsProcessing(false);
      triggerWinConfetti();
      return;
    }

    // Advance throw counter + migration check
    const newCount = throwCountRef.current + 1;
    setThrowCount(newCount);
    if (newCount % 10 === 0) triggerMigration();

    // Advance turn
    const totalPlayers = playersRef.current.length;
    const nextCp = cp >= totalPlayers ? 1 : cp + 1;
    setIsProcessing(false);

    // Turn cut in local multiplayer
    if (gameMode === 'local') {
      setPendingPlayer(nextCp);
      setShowTurnCut(true);
    } else {
      // Single player: just switch directly
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

  // Computer AI for single-player mode
  useEffect(() => {
    if (
      gameMode === 'single' &&
      currentPlayer === 2 &&
      !winner && !isProcessing && !isMigrating
    ) {
      const t = setTimeout(() => doRoll(), 1600);
      return () => clearTimeout(t);
    }
  }, [currentPlayer, gameMode, winner, isProcessing, isMigrating]);

  const handleTurnCutComplete = () => {
    setShowTurnCut(false);
    setCurrentPlayer(pendingPlayer);
    setPendingPlayer(null);
  };

  // ==========================================
  // MODE SELECT SCREEN
  // ==========================================

  if (!gameMode) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 pt-28 animate-fade-in relative z-10">
        <button
          onClick={onBack}
          className="absolute top-20 left-6 p-2 rounded-xl bg-glass-fill border border-glass-stroke text-on-surface-variant hover:text-neon-coral transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="font-display-lg text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-3">
            Snake & Ladder
          </h1>
          <p className="text-on-surface-variant text-lg">🌿 Cinematic Jungle Edition</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          {/* Single Player */}
          <div
            onClick={() => setGameMode('single')}
            className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass hover:border-neon-coral/60 hover:shadow-[0_0_30px_rgba(230,57,70,0.2)] cursor-pointer flex flex-col items-center text-center group transition-all duration-300"
          >
            <span className="material-symbols-outlined text-6xl text-neon-coral mb-4 group-hover:scale-110 transition-transform duration-300">
              smart_toy
            </span>
            <h3 className="text-2xl font-black mb-2">Single Player</h3>
            <p className="text-on-surface-variant text-sm">Face the jungle AI</p>
          </div>

          {/* Local Multiplayer */}
          <div
            onClick={() => setGameMode('local')}
            className="bg-surface-container border border-glass-stroke rounded-3xl p-8 shadow-glass hover:border-[#4361ee]/60 hover:shadow-[0_0_30px_rgba(67,97,238,0.2)] cursor-pointer flex flex-col items-center text-center group transition-all duration-300"
          >
            <span className="material-symbols-outlined text-6xl text-[#4361ee] mb-4 group-hover:scale-110 transition-transform duration-300">
              group
            </span>
            <h3 className="text-2xl font-black mb-2">Local Multiplayer</h3>
            <p className="text-on-surface-variant text-sm mb-5">Pass &amp; play — full-screen turns</p>
            <select
              value={numPlayers}
              onChange={e => setNumPlayers(parseInt(e.target.value))}
              onClick={e => e.stopPropagation()}
              className="bg-glass-fill text-on-surface rounded-xl px-4 py-2 border border-glass-stroke cursor-pointer"
            >
              {[2, 3, 4].map(n => <option key={n} value={n}>{n} Players</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GAME SCREEN
  // ==========================================

  const activePlayer = players.find(p => p.id === currentPlayer);
  const isMyTurn     = !winner && !isProcessing && !isMigrating &&
                       (gameMode !== 'single' || currentPlayer === 1);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: '#0c1a0c' }}>

      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 60, near: 0.1, far: 300 }}
        >
          <JungleScene
            players={players}
            currentPlayer={currentPlayer}
            isProcessing={isProcessing}
          />
        </Canvas>
      </div>

      {/* ── Turn Cut Overlay ── */}
      {showTurnCut && pendingPlayer != null && (
        <TurnCutOverlay
          player={players.find(p => p.id === pendingPlayer)}
          onComplete={handleTurnCutComplete}
        />
      )}

      {/* ── HUD ── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">

        {/* Top bar */}
        <div className="flex items-start justify-between w-full">
          {/* Back button */}
          <button
            onClick={onBack}
            className="pointer-events-auto p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-2xl"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          {/* Toast message */}
          {message && (
            <div className="pointer-events-none px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-white font-bold shadow-2xl text-sm md:text-base animate-fade-in">
              {message}
            </div>
          )}

          {/* Dice result */}
          <div className="flex flex-col items-center bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-2xl min-w-[72px]">
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Roll</span>
            <span className="text-white text-4xl font-black leading-none mt-1">
              {diceValue ?? '—'}
            </span>
          </div>
        </div>

        {/* Migration Banner */}
        {isMigrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="px-10 py-7 rounded-3xl bg-red-950/90 backdrop-blur-md border-2 border-red-500 shadow-2xl text-center">
              <h2 className="text-white text-3xl md:text-5xl font-black animate-pulse tracking-widest">
                🐍 SNAKES ARE MOVING!
              </h2>
              <p className="text-red-300 text-base mt-2 tracking-wide">Repositioning… watch your step</p>
            </div>
          </div>
        )}

        {/* Winner screen */}
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-black/90 px-14 py-12 rounded-3xl border border-white/15 shadow-2xl text-center">
              <div className="text-7xl mb-5">🏆</div>
              <h2 className="text-white text-4xl font-black mb-2">Victory!</h2>
              <p
                className="font-black text-4xl mb-10"
                style={{ color: players.find(p => p.id === winner)?.color }}
              >
                {players.find(p => p.id === winner)?.name} Wins!
              </p>
              <button
                onClick={() => initializeGame(players.length)}
                className="px-12 py-4 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Bottom footer */}
        <div className="flex items-end justify-between gap-4 pointer-events-none">

          {/* ROLL button */}
          <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <button
              onClick={handleRollDice}
              disabled={!isMyTurn}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full font-black text-white text-base md:text-lg uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: activePlayer?.color ?? '#4361ee',
                boxShadow: isMyTurn
                  ? `0 0 35px ${activePlayer?.color ?? '#4361ee'}90, 0 0 70px ${activePlayer?.color ?? '#4361ee'}40`
                  : 'none',
              }}
            >
              {isRolling ? '...' : 'ROLL'}
            </button>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest pointer-events-none">
              {winner              ? '🏆 Game Over'
               : isMigrating      ? '🐍 Migrating'
               : isProcessing     ? '⏳ Moving'
               : gameMode === 'single' && currentPlayer === 2 ? "Computer's turn"
               : `${activePlayer?.name ?? ''}'s turn`}
            </span>
          </div>

          {/* Players panel */}
          <div className="pointer-events-auto bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-52 flex flex-col gap-1.5">
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Players</h3>
            {players.map(p => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ${
                  currentPlayer === p.id && !winner
                    ? 'bg-white/15 border border-white/30'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: p.color,
                      boxShadow: `0 0 8px ${p.color}`,
                    }}
                  />
                  <span className="text-white font-semibold text-sm">{p.name}</span>
                </div>
                <span className="text-white/80 font-mono font-bold text-sm">{p.pos}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 mt-1 text-center">
              <span className="text-white/25 text-[10px] tracking-wide">
                🎲 Throw #{throwCount} · Next migration #{Math.ceil((throwCount + 1) / 10) * 10}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
