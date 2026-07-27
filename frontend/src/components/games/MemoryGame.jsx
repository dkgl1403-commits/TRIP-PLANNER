import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useCursor, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// CONSTANTS & SETUP
// ==========================================

const GAME_COLORS = [
  { id: 0, name: 'Red', hex: '#e74c3c' },
  { id: 1, name: 'Blue', hex: '#3498db' },
  { id: 2, name: 'Green', hex: '#2ecc71' },
  { id: 3, name: 'Yellow', hex: '#f1c40f' },
  { id: 4, name: 'Black', hex: '#34495e' },
  { id: 5, name: 'White', hex: '#ecf0f1' }
];

const BOARD_RADIUS = 12;

const generatePegs = () => {
  // 4 of each of the 6 colors = 24 pegs
  let colorsList = [];
  for (let i = 0; i < 6; i++) {
    colorsList.push(i, i, i, i);
  }
  // Shuffle
  for (let i = colorsList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colorsList[i], colorsList[j]] = [colorsList[j], colorsList[i]];
  }

  return colorsList.map((colorId, index) => {
    const isInner = index < 8;
    const radius = isInner ? 5 : 10;
    const numInRing = isInner ? 8 : 16;
    const idxInRing = isInner ? index : index - 8;
    
    const angle = (idxInRing * Math.PI * 2) / numInRing;
    return {
      id: index,
      colorId,
      status: 'board', // 'board', 'p1_stash', 'p2_stash'
      basePos: new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    };
  });
};

// ==========================================
// 3D COMPONENTS
// ==========================================

const Peg = ({ peg, onClick, isHovered, onPointerOver, onPointerOut, isAnimating, revealHeight }) => {
  const meshRef = useRef();
  
  // Calculate target position based on status
  const targetPos = useMemo(() => {
    if (peg.status === 'board') return peg.basePos.clone();
    
    // Stash positioning
    const stashX = peg.status === 'p1_stash' ? -16 : 16;
    const stashZ = -6 + (peg.id % 6) * 1.5;
    const stashY = 0;
    
    // For p1/p2 stash, line them up neatly
    const row = Math.floor(peg.id / 6);
    const finalZ = -6 + (peg.id % 8) * 1.5;
    const finalX = peg.status === 'p1_stash' ? -16 - row * 1.5 : 16 + row * 1.5;

    return new THREE.Vector3(finalX, stashY, finalZ);
  }, [peg.status, peg.basePos, peg.id]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let currentTargetY = targetPos.y;
    if (peg.status === 'board') {
      if (isAnimating) {
        currentTargetY = revealHeight;
      } else if (isHovered) {
        currentTargetY = 0.2;
      }
    }

    const targetVector = new THREE.Vector3(targetPos.x, currentTargetY, targetPos.z);
    meshRef.current.position.lerp(targetVector, 12 * delta);
  });

  return (
    <group 
      ref={meshRef} 
      position={[targetPos.x, targetPos.y, targetPos.z]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Peg Handle (Wood) */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 2.0, 16]} />
        <meshStandardMaterial color="#cda372" roughness={0.8} />
      </mesh>
      {/* Peg Knob */}
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#cda372" roughness={0.8} />
      </mesh>
      {/* Peg Bottom (Hidden Color) */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 16]} />
        <meshStandardMaterial color={GAME_COLORS[peg.colorId].hex} metalness={0.1} roughness={0.5} />
      </mesh>
    </group>
  );
};

const Board = () => {
  return (
    <group>
      <mesh position={[0, -0.6, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[BOARD_RADIUS, BOARD_RADIUS, 1.2, 64]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      {/* Inner decorative circle */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[BOARD_RADIUS * 0.95, BOARD_RADIUS * 0.95, 1.2, 64]} />
        <meshStandardMaterial color="#6b4423" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MemoryGame({ user, onBack }) {
  const [gameState, setGameState] = useState('waiting_for_roll'); // waiting_for_roll, rolling, waiting_for_pick, animating_pick
  const [pegs, setPegs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceColorId, setDiceColorId] = useState(null);
  const [animatingPegId, setAnimatingPegId] = useState(null);
  const [hoveredPegId, setHoveredPegId] = useState(null);
  const [message, setMessage] = useState('');
  const [announcement, setAnnouncement] = useState(null);
  
  useCursor(hoveredPegId !== null && gameState === 'waiting_for_pick' ? 'pointer' : 'auto');

  useEffect(() => {
    setPegs(generatePegs());
  }, []);

  const p1Score = pegs.filter(p => p.status === 'p1_stash').length;
  const p2Score = pegs.filter(p => p.status === 'p2_stash').length;
  const isGameOver = (p1Score + p2Score) === 24;

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRollDice = () => {
    if (gameState !== 'waiting_for_roll') return;
    
    // Ensure we roll a color that is actually still on the board to prevent unwinnable scenarios
    const availablePegs = pegs.filter(p => p.status === 'board');
    if (availablePegs.length === 0) return;
    
    const randomAvailablePeg = availablePegs[Math.floor(Math.random() * availablePegs.length)];
    const target = randomAvailablePeg.colorId;
    
    setDiceColorId(target);
    setGameState('waiting_for_pick');
    
    // Flash giant color announcement
    setAnnouncement(GAME_COLORS[target]);
    setTimeout(() => setAnnouncement(null), 2500);
  };

  const handlePegClick = (peg) => {
    if (gameState !== 'waiting_for_pick' || peg.status !== 'board') return;

    setGameState('animating_pick');
    setAnimatingPegId(peg.id);

    // Animate lifting
    setTimeout(() => {
      const isMatch = peg.colorId === diceColorId;
      
      if (isMatch) {
        showToast(`✅ Match! Player ${currentPlayer} keeps the peg and rolls again!`);
        setPegs(prev => prev.map(p => 
          p.id === peg.id ? { ...p, status: currentPlayer === 1 ? 'p1_stash' : 'p2_stash' } : p
        ));
        setAnimatingPegId(null);
        setGameState('waiting_for_roll');
      } else {
        showToast(`❌ Wrong color! That was ${GAME_COLORS[peg.colorId].name}. Turn passes.`);
        setTimeout(() => {
          setAnimatingPegId(null);
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
          setGameState('waiting_for_roll');
        }, 1200); // Give them a second to memorize it before it drops
      }
    }, 800); // Time it takes to lift up
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0c1a0c] overflow-hidden">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas shadows camera={{ position: [0, 20, 24], fov: 45 }}>
          <color attach="background" args={['#1a2f1c']} />
          <ambientLight intensity={0.6} color="#ffe8cc" />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <Environment preset="forest" />
          
          <Board />
          
          {pegs.map(peg => (
            <Peg 
              key={peg.id} 
              peg={peg} 
              isHovered={hoveredPegId === peg.id}
              isAnimating={animatingPegId === peg.id}
              revealHeight={6} // Lift 6 units up to clearly reveal color
              onPointerOver={(e) => { e.stopPropagation(); setHoveredPegId(peg.id); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredPegId(null); }}
              onClick={(e) => { e.stopPropagation(); handlePegClick(peg); }}
            />
          ))}

          <ContactShadows position={[0, -0.6, 0]} opacity={0.6} scale={40} blur={2.5} far={4} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Header */}
        <div className="flex justify-between items-start z-10">
          <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-black/40 border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md shadow-xl"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <div className="flex items-center gap-8">
            <div className={`pointer-events-auto p-4 rounded-2xl backdrop-blur-md transition-all ${currentPlayer === 1 ? 'bg-white/20 border-white/40 scale-110 shadow-2xl' : 'bg-black/40 border-white/10 opacity-70'}`}>
              <h2 className="text-white text-xl font-bold">Player 1</h2>
              <p className="text-white/80 font-mono text-3xl">{p1Score}</p>
            </div>
            
            <div className={`pointer-events-auto p-4 rounded-2xl backdrop-blur-md transition-all ${currentPlayer === 2 ? 'bg-white/20 border-white/40 scale-110 shadow-2xl' : 'bg-black/40 border-white/10 opacity-70'}`}>
              <h2 className="text-white text-xl font-bold">Player 2</h2>
              <p className="text-white/80 font-mono text-3xl">{p2Score}</p>
            </div>
          </div>
        </div>

        {/* Center Toast Message */}
        <div className="flex justify-center pointer-events-none">
          <div className={`bg-black/80 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {message}
          </div>
        </div>

        {/* Giant Fading Announcement Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className={`transition-all duration-700 ease-out flex flex-col items-center ${announcement ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
          >
            {announcement && (
              <>
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white/30 shadow-[0_0_100px_rgba(255,255,255,0.2)] mb-4"
                  style={{ backgroundColor: announcement.hex }}
                />
                <h1 
                  className="text-8xl font-black tracking-tighter"
                  style={{ color: announcement.hex, textShadow: '0 0 40px rgba(0,0,0,0.8)' }}
                >
                  {announcement.name.toUpperCase()}
                </h1>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center items-end z-10 pb-8">
          {gameState === 'waiting_for_roll' && !isGameOver && (
            <button 
              onClick={handleRollDice}
              className="pointer-events-auto px-12 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white text-2xl font-black shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] transition-all animate-bounce"
            >
              🎲 Roll Dice (P{currentPlayer})
            </button>
          )}

          {gameState === 'waiting_for_pick' && (
            <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 flex items-center gap-4 animate-fade-in shadow-2xl">
              <span className="text-white text-xl font-bold">Find:</span>
              <div 
                className="w-8 h-8 rounded-full border-2 border-white/50 shadow-inner" 
                style={{ backgroundColor: GAME_COLORS[diceColorId].hex }}
              />
              <span className="text-white/80 font-bold">{GAME_COLORS[diceColorId].name}</span>
            </div>
          )}

          {isGameOver && (
            <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl flex flex-col items-center shadow-2xl animate-fade-in">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
                {p1Score > p2Score ? 'Player 1 Wins!' : p2Score > p1Score ? 'Player 2 Wins!' : 'It\'s a Tie!'}
              </h1>
              <p className="text-white/60 mb-8 text-xl">All pegs collected.</p>
              <button 
                onClick={() => {
                  setPegs(generatePegs());
                  setCurrentPlayer(1);
                  setGameState('waiting_for_roll');
                  setDiceColorId(null);
                }}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
