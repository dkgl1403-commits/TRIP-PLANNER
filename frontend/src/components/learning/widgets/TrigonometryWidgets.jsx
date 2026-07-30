import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------
// SkillTree3D
// ---------------------------------------------------------
export function SkillTree3D() {
  return (
    <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl shadow-neon-purple/50 border border-neon-purple relative">
      <div className="absolute top-4 left-4 z-10 text-white bg-black/50 p-2 rounded backdrop-blur">
        <h3 className="font-bold">The Trigonometry Skill Tree</h3>
        <p className="text-xs text-gray-300">Drag to rotate. Scroll to zoom.</p>
      </div>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffcc" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00cc" />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Nodes */}
        <SkillNode position={[0, -5, 0]} label="Level 0: The Roots" color="#888" />
        <SkillNode position={[0, 0, 0]} label="Level 1: The Awakening (You are here)" color="#00ffcc" glowing={true} />
        <SkillNode position={[-4, 4, 0]} label="Level 2: The Waveform" color="#ff00cc" />
        <SkillNode position={[4, 4, 0]} label="Level 3: The Engine" color="#ff00cc" />
        <SkillNode position={[0, 8, -2]} label="Level 4: The Architect" color="#ffaa00" />
        
        {/* Connections */}
        <Line points={[[0, -4.5, 0], [0, -0.5, 0]]} color="white" lineWidth={1} />
        <Line points={[[0, 0.5, 0], [-3.8, 3.8, 0]]} color="white" lineWidth={1} dashed />
        <Line points={[[0, 0.5, 0], [3.8, 3.8, 0]]} color="white" lineWidth={1} dashed />
      </Canvas>
    </div>
  );
}

function SkillNode({ position, label, color, glowing }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  
  useFrame((state) => {
    if (glowing && meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      <Sphere 
        ref={meshRef}
        args={[0.5, 32, 32]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? 'white' : color} emissive={glowing ? color : 'black'} emissiveIntensity={glowing ? 0.8 : 0} />
      </Sphere>
      <Text position={[0, -1, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

// ---------------------------------------------------------
// HexagonHack3D
// ---------------------------------------------------------
export function HexagonHack3D() {
  const [sides, setSides] = useState(3);
  
  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl shadow-neon-coral/50 border border-neon-coral relative flex flex-col">
      <div className="p-4 bg-black/80 text-white backdrop-blur flex justify-between items-center z-10">
        <div>
          <h3 className="font-bold">The Hexagon Hack</h3>
          <p className="text-xs text-gray-300">Drag the slider to build a hexagon.</p>
        </div>
        <div className="flex items-center gap-4">
          <span>Sides: {sides}</span>
          <input 
            type="range" 
            min="3" max="6" 
            value={sides} 
            onChange={(e) => setSides(parseInt(e.target.value))}
            className="w-32 accent-neon-coral"
          />
        </div>
      </div>
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls enableZoom={false} />
          <Polygon sides={sides} />
        </Canvas>
      </div>
    </div>
  );
}

function Polygon({ sides }) {
  const radius = 2;
  const points = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  
  return (
    <group>
      <Line points={points} color="#00ffcc" lineWidth={3} />
      {/* Draw lines to center */}
      {points.slice(0, -1).map((p, i) => (
        <Line key={i} points={[[0, 0, 0], p.toArray()]} color={sides === 6 ? '#ff00cc' : '#888'} lineWidth={sides === 6 ? 2 : 1} />
      ))}
      {sides === 6 && (
        <Text position={[0, -2.5, 0]} fontSize={0.3} color="#ff00cc">
          Perfect Equilateral Triangles! Radius = Chord.
        </Text>
      )}
    </group>
  );
}

// ---------------------------------------------------------
// RubberBandDemo
// ---------------------------------------------------------
export function RubberBandDemo() {
  const [height, setHeight] = useState(1);
  const base = 2;
  const hypotenuse = Math.sqrt(base*base + height*height);
  const sine = height / hypotenuse;

  return (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 p-6 text-white flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1">
        <h3 className="font-bold text-xl text-neon-coral mb-2">The 100% Rule</h3>
        <p className="text-gray-300 mb-4">
          Try to make the "Opposite" side longer than the "Hypotenuse". As you drag the height, the hypotenuse stretches to stay attached, always remaining longer.
        </p>
        <div className="mb-4">
          <label className="block text-sm mb-1">Opposite Side Height (Drag me!)</label>
          <input 
            type="range" 
            min="0.1" max="10" step="0.1"
            value={height} 
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full accent-neon-coral"
          />
        </div>
        <div className="bg-black/50 p-4 rounded border border-gray-800">
          <p>Opposite: {height.toFixed(2)}</p>
          <p>Hypotenuse: {hypotenuse.toFixed(2)}</p>
          <p className="font-bold text-lg mt-2 text-neon-purple">
            Sine = {sine.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* 2D SVG Representation for simplicity in this specific widget */}
      <div className="w-64 h-64 border-l-2 border-b-2 border-gray-600 relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 -10 10 10">
          <g transform="scale(1, -1)">
            {/* Base */}
            <line x1="0" y1="0" x2={base} y2="0" stroke="white" strokeWidth="0.1" />
            {/* Height (Opposite) */}
            <line x1={base} y1="0" x2={base} y2={height} stroke="#ff00cc" strokeWidth="0.15" />
            {/* Hypotenuse */}
            <line x1="0" y1="0" x2={base} y2={height} stroke="#00ffcc" strokeWidth="0.1" />
            <text x={base + 0.5} y={height/2} fontSize="0.5" fill="#ff00cc" transform={`scale(1, -1) translate(0, -${height})`}>Opp</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// FormulaForge
// ---------------------------------------------------------
export function FormulaForge() {
  const [sineSquared, setSineSquared] = useState(0);
  const [cosineSquared, setCosineSquared] = useState(0);

  // Just a simple interactive state demo
  const isMasterIdentity = (sineSquared + cosineSquared) === 100;

  return (
    <div className="w-full p-8 bg-black rounded-xl border border-neon-purple text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Formula Forge</h3>
      <p className="text-gray-400 mb-8">Balance the equation to forge the Master Identity.</p>
      
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="bg-surface-variant p-4 rounded-xl w-32">
          <div className="text-neon-coral font-bold text-xl mb-2">sin²(θ)</div>
          <input type="range" min="0" max="100" value={sineSquared} onChange={e => {
            const val = parseInt(e.target.value);
            setSineSquared(val);
            setCosineSquared(100 - val); // Auto balance for demo
          }} className="w-full accent-neon-coral" />
          <div className="mt-2 text-white">{sineSquared}%</div>
        </div>
        <div className="text-3xl font-bold text-white">+</div>
        <div className="bg-surface-variant p-4 rounded-xl w-32">
          <div className="text-neon-purple font-bold text-xl mb-2">cos²(θ)</div>
          <input type="range" min="0" max="100" value={cosineSquared} onChange={e => {
            const val = parseInt(e.target.value);
            setCosineSquared(val);
            setSineSquared(100 - val);
          }} className="w-full accent-neon-purple" />
          <div className="mt-2 text-white">{cosineSquared}%</div>
        </div>
        <div className="text-3xl font-bold text-white">=</div>
        <div className={`p-4 rounded-xl w-32 font-bold text-4xl transition-colors ${isMasterIdentity ? 'bg-green-500 text-white shadow-[0_0_20px_#22c55e]' : 'bg-surface-variant text-gray-500'}`}>
          1
        </div>
      </div>
      
      {isMasterIdentity && (
        <div className="text-green-400 font-bold animate-pulse">
          Master Identity Forged!
        </div>
      )}
    </div>
  );
}

// Widget Registry Map
export const WidgetRegistry = {
  SkillTree3D,
  HexagonHack3D,
  RubberBandDemo,
  FormulaForge
};
