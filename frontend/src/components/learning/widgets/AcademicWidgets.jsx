import React, { useState, useRef, useEffect } from 'react';
import { 
  HistoryOfIrrationality, 
  EuclidAlgorithmVisualizer, 
  PrimeFactorizationTree, 
  IrrationalityProofExplorer, 
  DecimalExpansionChecker, 
  RealNumbersCheatSheet,
  StoryOfPiWidget,
  RealWorldApplicationsWidget,
  MemorySyncWidget
} from './RealNumberWidgets';

import {
  RationalDensityWidget,
  SpiralOfTheodorusWidget,
  SuccessiveMagnificationWidget,
  RationalizerWidget,
  SquareRootLoreWidget,
  InfiniteZoomLineWidget
} from './NumberSystemWidgets';

import {
  FirstNeuronWidget,
  CpuVsGpuWidget,
  VectorGalaxyWidget,
  BlindSkierWidget,
  SoftmaxWidget,
  NeuralNetworkWidget,
  AttentionWidget,
  RLHFWidget,
  PromptingWidget,
  ContextWindowWidget,
  RAGWidget,
  ReasoningWidget,
  AgentWidget,
  TaxonomyWidget,
  EmbeddingsWidget,
  GenerativeWidget,
  DiffusionWidget,
  RAGvsFineTuningWidget,
  QuantizationWidget,
  MoEWidget,
  CpuVsGpuCoreWidget,
  DataCenterWidget,
  DataCenterAnatomyWidget,
  AIEcosystemWidget,
  EchoChamberWidget,
  GenieCurseWidget,
  XRayMindWidget,
  EggTestWidget,
  LaserWeederWidget,
  HiveMindWidget,
  IndustryImpactWidget,
  PocPurgatoryWidget,
  PaletteCompressorWidget,
  AppleIntelligenceWidget,
  AGITrackerWidget,
  TakeoffSimulatorWidget
} from './AIWidgets';

import {
  WaterfallVsAgileWidget,
  KanbanFlowWidget,
  SAFeAlignmentWidget,
  WorkHierarchyWidget,
  PlanningPokerWidget,
  SprintLifecycleWidget
} from './AgileWidgets';

import {
  CorporateActionsTimelineWidget,
  CAMVIndicatorWidget,
  CALifecycleDatesWidget,
  CASettlementCycleWidget,
  SwiftStpFlowWidget,
  SwiftDictionaryWidget,
  CustodyChainPyramidWidget,
  OmnibusAllocationWidget,
  EventTaxonomyWidget,
  ClaimsTransformationWidget
} from './CorporateActionsWidgets';
// --- STEP 1.1: StarObserverDiagram ---
export function StarObserverDiagram() {
  const [starBPos, setStarBPos] = useState({ x: 80, y: 20 });
  const svgRef = useRef(null);
  const isDragging = useRef(false);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    
    // Constrain to upper sky area
    const newX = Math.max(10, Math.min(90, svgP.x));
    const newY = Math.max(10, Math.min(60, svgP.y));
    setStarBPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  // Calculate angle between Star A (fixed at 20, 30) and Star B from Observer (50, 90)
  const obsX = 50, obsY = 90;
  const starAX = 20, starAY = 30;
  const angleA = Math.atan2(starAY - obsY, starAX - obsX);
  const angleB = Math.atan2(starBPos.y - obsY, starBPos.x - obsX);
  let theta = Math.abs((angleA - angleB) * (180 / Math.PI));
  
  // Calculate distance between stars
  const dist = Math.sqrt(Math.pow(starBPos.x - starAX, 2) + Math.pow(starBPos.y - starAY, 2));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg ref={svgRef} viewBox="0 0 100 100" className="w-full max-w-lg h-auto drop-shadow-xl" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {/* Background Stars */}
        {[...Array(20)].map((_, i) => (
          <circle key={i} cx={Math.random()*100} cy={Math.random()*80} r={Math.random()*0.5} fill="#fff" opacity={0.3} />
        ))}
        
        {/* Observer */}
        <circle cx={obsX} cy={obsY} r="2" fill="#fff" />
        <text x={obsX} y={obsY+6} fill="#fff" fontSize="3" textAnchor="middle">Observer</text>

        {/* Lines of sight */}
        <line x1={obsX} y1={obsY} x2={starAX} y2={starAY} stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
        <line x1={obsX} y1={obsY} x2={starBPos.x} y2={starBPos.y} stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />

        {/* Distance Line */}
        <line x1={starAX} y1={starAY} x2={starBPos.x} y2={starBPos.y} stroke="#00ffcc" strokeWidth="0.5" strokeDasharray="2,1" />
        <text x={(starAX+starBPos.x)/2} y={(starAY+starBPos.y)/2 - 2} fill="#00ffcc" fontSize="3" textAnchor="middle">Distance = ?</text>

        {/* Stars */}
        <circle cx={starAX} cy={starAY} r="2" fill="#ffeb3b" />
        <text x={starAX} y={starAY-4} fill="#ffeb3b" fontSize="3" textAnchor="middle">Star A</text>

        <circle 
          cx={starBPos.x} cy={starBPos.y} r="3" fill="#ff00cc" 
          onPointerDown={handlePointerDown}
          className="cursor-pointer hover:stroke-white hover:stroke-[1px] transition-all"
        />
        <text x={starBPos.x} y={starBPos.y-5} fill="#ff00cc" fontSize="3" textAnchor="middle">Star B (Drag me)</text>

        {/* Angle Arc */}
        <path d={`M ${obsX - 10} ${obsY} A 10 10 0 0 1 ${obsX + 10} ${obsY}`} fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.2" />
        <text x={obsX} y={obsY - 15} fill="#fff" fontSize="4" textAnchor="middle">θ = {theta.toFixed(1)}°</text>
      </svg>
      <p className="text-gray-400 mt-4 text-center">Drag Star B to change the angle.</p>
    </div>
  );
}

// --- STEP 1.2: InteractiveChordCircle ---
export function InteractiveChordCircle() {
  const [angle, setAngle] = useState(45); // in degrees
  const radius = 40;
  const cx = 50, cy = 50;

  const handleSlider = (e) => {
    setAngle(parseFloat(e.target.value));
  };

  const rad = (angle * Math.PI) / 180;
  // Point A fixed at top (0 degrees from y-axis)
  const ax = cx;
  const ay = cy - radius;
  // Point B varies
  const bx = cx + radius * Math.sin(rad);
  const by = cy - radius * Math.cos(rad);

  const chordLength = 2 * radius * Math.sin(rad / 2);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto mb-6">
        <circle cx={cx} cy={cy} r={radius} stroke="#444" strokeWidth="0.5" fill="none" />
        <circle cx={cx} cy={cy} r="1" fill="#fff" />
        <text x={cx} y={cy+4} fill="#aaa" fontSize="3" textAnchor="middle">Observer</text>

        {/* Radii */}
        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#666" strokeWidth="0.5" />
        <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#666" strokeWidth="0.5" />

        {/* Chord */}
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#00ffcc" strokeWidth="1" />
        <text x={(ax+bx)/2 + 2} y={(ay+by)/2} fill="#00ffcc" fontSize="4">Chord = {chordLength.toFixed(1)}</text>

        {/* Points */}
        <circle cx={ax} cy={ay} r="1.5" fill="#fff" />
        <circle cx={bx} cy={by} r="2" fill="#ff00cc" />
        
        {/* Angle Text */}
        <text x={cx} y={cy - 10} fill="#ff00cc" fontSize="4" textAnchor="middle">{angle}°</text>
      </svg>
      
      <input 
        type="range" min="10" max="170" value={angle} onChange={handleSlider}
        className="w-full max-w-md cursor-pointer accent-neon-coral"
      />
      <div className="flex justify-between w-full max-w-md text-gray-400 mt-2">
        <span>Small Angle</span>
        <span>Large Angle</span>
      </div>
    </div>
  );
}

// --- STEP 1.3: HexagonChordDiagram ---
export function HexagonChordDiagram() {
  const [highlighted, setHighlighted] = useState(null);
  const cx = 50, cy = 50, r = 40;
  
  // Calculate hexagon points
  const points = [];
  for(let i=0; i<6; i++) {
    const a = (i * 60 - 90) * (Math.PI/180);
    points.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto">
        <circle cx={cx} cy={cy} r={r} stroke="#444" strokeWidth="0.5" fill="none" />
        
        {/* Triangles */}
        {points.map((p, i) => {
          const nextP = points[(i+1)%6];
          const isSelected = highlighted === i;
          return (
            <g key={i} onClick={() => setHighlighted(i)} className="cursor-pointer">
              <polygon 
                points={`${cx},${cy} ${p.x},${p.y} ${nextP.x},${nextP.y}`}
                fill={isSelected ? 'rgba(0, 255, 204, 0.2)' : 'transparent'}
                stroke={isSelected ? '#00ffcc' : '#666'}
                strokeWidth={isSelected ? '1' : '0.5'}
                className="transition-all duration-300 hover:fill-white/10"
              />
              {isSelected && (
                <>
                  <text x={cx} y={cy + (i > 1 && i < 5 ? -5 : 10)} fill="#00ffcc" fontSize="3" textAnchor="middle">60°</text>
                  <text x={(p.x+nextP.x)/2 + (p.x > 50 ? 5 : -15)} y={(p.y+nextP.y)/2} fill="#00ffcc" fontSize="3" fontWeight="bold">Chord = R</text>
                </>
              )}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="1" fill="#fff" />
      </svg>
      <p className="text-gray-400 mt-6 text-center animate-pulse">Click any triangle to highlight.</p>
    </div>
  );
}

// --- STEP 1.4: ChordTableWidget ---
export function ChordTableWidget() {
  const [hoveredAngle, setHoveredAngle] = useState(null);
  
  const data = [
    { a: 7.5, val: '7; 49, 9' },
    { a: 15, val: '15; 39, 47' },
    { a: 30, val: '31; 3, 30' },
    { a: 45, val: '44; 52, 53' },
    { a: 60, val: '60; 0, 0 (= R!)', highlight: true },
    { a: 90, val: '84; 51, 10' },
    { a: 120, val: '103; 55, 23' }
  ];

  const cx=50, cy=50, r=40;

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      <div className="w-full md:w-1/2 overflow-hidden rounded-xl border border-white/10 bg-black/50">
        <table className="w-full text-left text-lg">
          <thead>
            <tr className="bg-white/5 text-gray-400">
              <th className="p-4 font-normal">Angle (θ)</th>
              <th className="p-4 font-normal">Chord Length</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr 
                key={row.a} 
                onMouseEnter={() => setHoveredAngle(row.a)}
                onMouseLeave={() => setHoveredAngle(null)}
                className={`border-t border-white/5 cursor-pointer transition-colors ${row.highlight ? 'bg-neon-coral/10 text-neon-coral' : 'hover:bg-white/5 text-gray-200'}`}
              >
                <td className="p-4">{row.a}°</td>
                <td className="p-4 font-mono">{row.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="w-full md:w-1/3">
        <svg viewBox="0 0 100 100" className="w-full h-auto drop-shadow-lg">
          <circle cx={cx} cy={cy} r={r} stroke="#333" strokeWidth="1" fill="none" />
          <circle cx={cx} cy={cy} r="1" fill="#fff" />
          {hoveredAngle && (
            <g>
              {/* Point A at top */}
              <circle cx={cx} cy={cy-r} r="1.5" fill="#fff" />
              {/* Point B */}
              {(() => {
                const rad = hoveredAngle * Math.PI / 180;
                const bx = cx + r * Math.sin(rad);
                const by = cy - r * Math.cos(rad);
                return (
                  <>
                    <line x1={cx} y1={cy-r} x2={bx} y2={by} stroke="#00ffcc" strokeWidth="1.5" className="animate-fade-in-up" />
                    <line x1={cx} y1={cy} x2={cx} y2={cy-r} stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
                    <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
                    <circle cx={bx} cy={by} r="1.5" fill="#00ffcc" />
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// --- STEP 1.5 & 1.8: TriangulationDiagram / MoonDistanceDiagram ---
export function TriangulationDiagram({ data }) {
  const isStep8 = data?.mode === 'distance'; // 1.8 mode
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto">
        {/* Earth Curve */}
        <path d="M 10 90 Q 50 70 90 90" fill="none" stroke="#4a5568" strokeWidth="1" />
        
        {/* Cities */}
        <circle cx="40" cy="78.5" r="1.5" fill="#63b3ed" />
        <circle cx="60" cy="78.5" r="1.5" fill="#63b3ed" />
        <text x="35" y="83" fill="#63b3ed" fontSize="3" textAnchor="end">Hellespont</text>
        <text x="65" y="83" fill="#63b3ed" fontSize="3" textAnchor="start">Alexandria</text>
        
        {/* Base line */}
        <line x1="40" y1="78.5" x2="60" y2="78.5" stroke="#fff" strokeWidth="0.5" />
        <text x="50" y="82" fill="#fff" fontSize="3" textAnchor="middle">~1,000 miles</text>

        {/* Moon */}
        <circle cx="50" cy="15" r="3" fill="#f6e05e" />
        <text x="50" y="10" fill="#f6e05e" fontSize="4" textAnchor="middle">Moon</text>

        {/* Sight Lines */}
        <line x1="40" y1="78.5" x2="50" y2="15" stroke="#00ffcc" strokeWidth="0.5" strokeDasharray="1,1" />
        <line x1="60" y1="78.5" x2="50" y2="15" stroke="#00ffcc" strokeWidth="0.5" strokeDasharray="1,1" />

        {isStep8 ? (
          <>
            <text x="50" y="22" fill="#ff00cc" fontSize="3" textAnchor="middle">0.1°</text>
            <line x1="50" y1="15" x2="50" y2="78.5" stroke="#ff00cc" strokeWidth="1" />
            <text x="52" y="45" fill="#ff00cc" fontSize="4">≈ 238,000 miles</text>
            
            <circle cx="50" cy="100" r="10" fill="none" stroke="#4a5568" strokeWidth="0.5" />
            <text x="50" y="98" fill="#4a5568" fontSize="3" textAnchor="middle">Earth: ~8k miles dia.</text>
          </>
        ) : (
          <>
            <text x="43" y="73" fill="#fff" fontSize="3">α</text>
            <text x="55" y="73" fill="#fff" fontSize="3">β</text>
            <line x1="50" y1="15" x2="50" y2="78.5" stroke="#555" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="52" y="45" fill="#777" fontSize="3">Distance = ?</text>
          </>
        )}
      </svg>
    </div>
  );
}

// --- STEP 1.6: ParallaxThumbDiagram ---
export function ParallaxThumbDiagram() {
  const [view, setView] = useState('left'); // 'left' or 'right'
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('left')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'left' ? 'bg-neon-coral text-white' : 'bg-white/10 text-gray-400'}`}
        >
          👁️ Left Eye Open
        </button>
        <button 
          onClick={() => setView('right')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'right' ? 'bg-neon-purple text-white' : 'bg-white/10 text-gray-400'}`}
        >
          👁️ Right Eye Open
        </button>
      </div>

      <svg viewBox="0 0 100 60" className="w-full max-w-xl h-auto bg-gray-900/50 rounded-xl border border-white/10">
        {/* Wall */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#555" strokeWidth="1" />
        {/* Wall Marker */}
        <circle cx="50" cy="20" r="2" fill="#fff" />
        <text x="50" y="15" fill="#aaa" fontSize="3" textAnchor="middle">Background Marker</text>

        {/* Thumb */}
        <rect 
          x={view === 'left' ? 35 : 55} y="25" width="10" height="20" rx="3" 
          fill="#ff00cc" className="transition-all duration-300"
        />
        <text x={view === 'left' ? 40 : 60} y="35" fill="#fff" fontSize="3" textAnchor="middle" className="transition-all duration-300">Thumb</text>

        {/* Eyes (Fixed positions) */}
        <text x="35" y="55" fill="#777" fontSize="5" textAnchor="middle">👁️</text>
        <text x="65" y="55" fill="#777" fontSize="5" textAnchor="middle">👁️</text>
        
        {/* Sight line */}
        <line 
          x1={view === 'left' ? 35 : 65} y1="50" 
          x2={view === 'left' ? 40 : 60} y2="45" 
          stroke="#00ffcc" strokeWidth="0.5" strokeDasharray="1,1" 
        />
        <line 
          x1={view === 'left' ? 40 : 60} y1="25" 
          x2={view === 'left' ? 45 : 55} y2="20" 
          stroke="#00ffcc" strokeWidth="0.5" strokeDasharray="1,1" 
        />
      </svg>
      <p className="text-gray-400 mt-6 font-mono text-center max-w-md">
        Notice how the thumb appears to "jump" across the background marker when you switch eyes. The distance of the jump (parallax) reveals how far away the thumb is.
      </p>
    </div>
  );
}

// --- STEP 1.7: EclipseDiagram ---
export function EclipseDiagram() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 80" className="w-full max-w-xl h-auto">
        {/* Map / Earth */}
        <circle cx="50" cy="50" r="40" fill="#1a202c" stroke="#4a5568" strokeWidth="1" />
        <text x="50" y="20" fill="#4a5568" fontSize="4" textAnchor="middle">Earth</text>

        {/* Hellespont */}
        <circle cx="45" cy="35" r="1.5" fill="#fff" />
        <text x="40" y="36" fill="#fff" fontSize="3" textAnchor="end">Hellespont (Turkey)</text>
        <line x1="45" y1="35" x2="20" y2="35" stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />

        {/* Alexandria */}
        <circle cx="55" cy="65" r="1.5" fill="#fff" />
        <text x="60" y="66" fill="#fff" fontSize="3">Alexandria (Egypt)</text>
        <line x1="55" y1="65" x2="80" y2="65" stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />

        <line x1="45" y1="35" x2="55" y2="65" stroke="#00ffcc" strokeWidth="0.5" />
        <text x="58" y="50" fill="#00ffcc" fontSize="3">~1,000 miles</text>

        {/* Insets */}
        {/* Total Eclipse */}
        <rect x="5" y="25" width="20" height="20" rx="2" fill="#000" stroke="#fff" strokeWidth="0.5" />
        <circle cx="15" cy="32" r="5" fill="#f6e05e" /> {/* Sun */}
        <circle cx="15" cy="32" r="5" fill="#111" /> {/* Moon perfectly covering */}
        <text x="15" y="42" fill="#fff" fontSize="2.5" textAnchor="middle">TOTAL Eclipse</text>
        
        {/* Partial Eclipse */}
        <rect x="75" y="55" width="20" height="20" rx="2" fill="#000" stroke="#fff" strokeWidth="0.5" />
        <circle cx="85" cy="62" r="5" fill="#f6e05e" /> {/* Sun */}
        <circle cx="86" cy="62" r="5" fill="#111" /> {/* Moon shifted */}
        <text x="85" y="72" fill="#fff" fontSize="2.5" textAnchor="middle">PARTIAL (1/5th Sun)</text>
      </svg>
    </div>
  );
}

// --- STEP 1.9: ChordVsHalfChordDiagram ---
export function ChordVsHalfChordDiagram() {
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      {/* Greek Way */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h3 className="text-xl text-red-400 font-bold mb-4">The Greek Way (Full Chord)</h3>
        <svg viewBox="0 0 100 100" className="w-full max-w-sm h-auto bg-white/5 rounded-xl border border-red-500/30 p-4">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#555" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="1.5" fill="#fff" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#ff4444" strokeWidth="1.5" />
          <text x="50" y="45" fill="#ff4444" fontSize="4" textAnchor="middle" transform="rotate(45 50 50)">Full Chord</text>
          
          <line x1="50" y1="50" x2="50" y2="50" stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="50" y1="50" x2="20" y2="20" stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="50" y1="50" x2="80" y2="80" stroke="#555" strokeWidth="0.5" strokeDasharray="1,1" />
          
          {/* Perpendicular construction */}
          <line x1="50" y1="50" x2="50" y2="20" stroke="#ff4444" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.5" />
          <line x1="50" y1="50" x2="80" y2="50" stroke="#ff4444" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.5" />
        </svg>
        <p className="mt-4 text-red-300 font-mono text-sm text-center">❌ Requires extra construction lines to form a right triangle.</p>
      </div>

      {/* Indian Way */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h3 className="text-xl text-green-400 font-bold mb-4">The Indian Way (Half Chord)</h3>
        <svg viewBox="0 0 100 100" className="w-full max-w-sm h-auto bg-white/5 rounded-xl border border-green-500/30 p-4">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#555" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="1.5" fill="#fff" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#555" strokeWidth="0.5" /> {/* Diameter */}
          
          <line x1="50" y1="50" x2="80" y2="20" stroke="#555" strokeWidth="0.5" /> {/* Radius */}
          <line x1="80" y1="20" x2="80" y2="50" stroke="#4ade80" strokeWidth="1.5" /> {/* Half Chord */}
          
          {/* Right angle symbol */}
          <polyline points="75,50 75,45 80,45" fill="none" stroke="#fff" strokeWidth="0.5" />
          
          <text x="82" y="35" fill="#4ade80" fontSize="4">Half Chord</text>
          <polygon points="50,50 80,50 80,20" fill="rgba(74, 222, 128, 0.1)" />
        </svg>
        <p className="mt-4 text-green-300 font-mono text-sm text-center">✓ Directly forms a right triangle. Ready to use!</p>
      </div>
    </div>
  );
}

// --- STEP 1.10: InteractiveHalfChordCircle ---
export function InteractiveHalfChordCircle() {
  const [angle, setAngle] = useState(45);
  const cx = 50, cy = 50, r = 40;

  const handleSlider = (e) => setAngle(parseFloat(e.target.value));

  const rad = (angle * Math.PI) / 180;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad);
  
  const jya = r * Math.sin(rad);
  const sinVal = Math.sin(rad);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto mb-6">
        <circle cx={cx} cy={cy} r={r} stroke="#444" strokeWidth="0.5" fill="none" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#555" strokeWidth="0.5" />
        
        {/* Full chord ghost */}
        <line x1={px} y1={py} x2={px} y2={cy + (cy-py)} stroke="#ff4444" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.5" />
        
        {/* Right triangle */}
        <polygon points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(0, 255, 204, 0.1)" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#777" strokeWidth="0.5" />
        <text x={(cx+px)/2 - 2} y={(cy+py)/2 - 2} fill="#777" fontSize="3">R</text>

        {/* Half Chord */}
        <line x1={px} y1={py} x2={px} y2={cy} stroke="#00ffcc" strokeWidth="1.5" />
        <polyline points={`${px-3},${cy} ${px-3},${cy-3} ${px},${cy-3}`} fill="none" stroke="#fff" strokeWidth="0.5" />
        
        {/* Angle arc */}
        <path d={`M ${cx+10} ${cy} A 10 10 0 0 0 ${cx + 10*Math.cos(rad)} ${cy - 10*Math.sin(rad)}`} fill="none" stroke="#ff00cc" strokeWidth="0.5" />
        <text x={cx + 12} y={cy - 4} fill="#ff00cc" fontSize="3">θ</text>

        {/* Values */}
        <text x="50" y="90" fill="#00ffcc" fontSize="4" textAnchor="middle">jya({angle}°) = {jya.toFixed(1)}</text>
        <text x="50" y="96" fill="#fff" fontSize="3" textAnchor="middle">Modern sin({angle}°) = {sinVal.toFixed(4)}</text>
        
        <circle cx={px} cy={py} r="1.5" fill="#00ffcc" />
        <circle cx={cx} cy={cy} r="1.5" fill="#fff" />
      </svg>
      
      <input type="range" min="0" max="90" value={angle} onChange={handleSlider} className="w-full max-w-md accent-neon-coral" />
    </div>
  );
}

// --- STEP 1.11: ArcMinuteCircleDiagram ---
export function ArcMinuteCircleDiagram() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto drop-shadow-xl">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#444" strokeWidth="0.5" />
        <line x1="50" y1="50" x2="90" y2="50" stroke="#00ffcc" strokeWidth="1" />
        <text x="70" y="48" fill="#00ffcc" fontSize="4" textAnchor="middle">R = 3,438</text>
        
        <path d="M 50 10 A 40 40 0 1 1 49.9 10" fill="none" stroke="#ff00cc" strokeWidth="1" strokeDasharray="1,2" />
        
        <rect x="20" y="70" width="60" height="20" rx="2" fill="#111" stroke="#333" />
        <text x="50" y="76" fill="#fff" fontSize="3" textAnchor="middle">Circumference = 2πR = 21,600 arc-minutes</text>
        <text x="50" y="82" fill="#00ffcc" fontSize="3" textAnchor="middle">2 × 3.14159 × 3438 ≈ 21,600</text>
        <text x="50" y="88" fill="#ff00cc" fontSize="3" textAnchor="middle">Therefore: 1 arc-minute = 1 unit of length!</text>
      </svg>
    </div>
  );
}

// --- STEP 1.12: DifferenceBarChart ---
export function DifferenceBarChart() {
  const diffs = [225, 224, 222, 219, 215, 210, 205, 199];
  const max = 225;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl h-64 flex items-end justify-between border-b border-l border-white/20 p-4 gap-2">
        {diffs.map((d, i) => {
          const height = (d / max) * 100;
          return (
            <div key={i} className="flex flex-col items-center w-1/8 relative group">
              <span className="absolute -top-6 text-neon-coral font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">{d}</span>
              <div 
                className="w-full bg-neon-purple/80 hover:bg-neon-purple rounded-t-sm transition-all"
                style={{ height: `${height}%` }}
              ></div>
              <span className="mt-2 text-gray-400 text-xs">Δ{i+1}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex items-center gap-4 text-xl font-mono text-white">
        <span className="text-neon-coral">225</span>
        <span className="material-symbols-outlined text-gray-500">arrow_right_alt</span>
        <span className="text-neon-coral/90">224</span>
        <span className="material-symbols-outlined text-gray-500">arrow_right_alt</span>
        <span className="text-neon-coral/80">222</span>
        <span className="material-symbols-outlined text-gray-500">arrow_right_alt</span>
        <span className="text-neon-coral/70">219...</span>
      </div>
    </div>
  );
}

// --- STEP 1.13: AryabhataSineTable ---
export function AryabhataSineTable() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  const data = [
    { a: 3.75, j: 225, s: 0.0654 },
    { a: 7.50, j: 449, s: 0.1305 },
    { a: 11.25, j: 671, s: 0.1951 },
    { a: 15.00, j: 890, s: 0.2588 },
    { a: 30.00, j: 1719, s: 0.5000, highlight: true },
    { a: 45.00, j: 2431, s: 0.7071, highlight: true },
    { a: 60.00, j: 2978, s: 0.8660, highlight: true },
    { a: 90.00, j: 3438, s: 1.0000, highlight: true },
  ];

  const cx=50, cy=50, r=40;

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      <div className="w-full md:w-1/2 overflow-hidden rounded-xl border border-white/10 bg-black/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm">
              <th className="p-3 font-normal">Angle (θ)</th>
              <th className="p-3 font-normal">jya(θ)</th>
              <th className="p-3 font-normal">sin(θ)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr 
                key={row.a} 
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`border-t border-white/5 cursor-pointer transition-colors ${row.highlight ? 'bg-neon-purple/10 text-neon-purple' : 'hover:bg-white/5 text-gray-200'}`}
              >
                <td className="p-3">{row.a}°</td>
                <td className="p-3 font-mono font-bold">{row.j}</td>
                <td className="p-3 font-mono">{row.s.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="w-full md:w-1/3">
        <svg viewBox="0 0 100 100" className="w-full h-auto drop-shadow-lg">
          <circle cx={cx} cy={cy} r={r} stroke="#333" strokeWidth="1" fill="none" />
          <line x1={10} y1={cy} x2={90} y2={cy} stroke="#444" strokeWidth="0.5" />
          
          {hoveredIdx !== null && (
            <g>
              {(() => {
                const row = data[hoveredIdx];
                const rad = row.a * Math.PI / 180;
                const px = cx + r * Math.cos(rad);
                const py = cy - r * Math.sin(rad);
                return (
                  <>
                    <polygon points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(168, 85, 247, 0.2)" />
                    <line x1={cx} y1={cy} x2={px} y2={py} stroke="#777" strokeWidth="0.5" />
                    <line x1={px} y1={cy} x2={px} y2={py} stroke="#a855f7" strokeWidth="1.5" className="animate-fade-in-up" />
                    <circle cx={px} cy={py} r="1.5" fill="#a855f7" />
                    <text x={cx} y={cy+10} fill="#a855f7" fontSize="4" textAnchor="middle">{row.a}°</text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// --- STEP 1.14: LinguisticTimeline ---
export function LinguisticTimeline() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-neon-coral via-neon-purple to-neon-coral -translate-y-1/2"></div>
        
        <div className="flex justify-between relative z-10">
          {[
            { c: '🇮🇳', title: 'Sanskrit', word: 'jya (ज्या)', meaning: 'Bowstring', date: '~500 CE' },
            { c: '🕌', title: 'Arabic', word: 'jaib (جيب)', meaning: 'Pocket (Error!)', date: '~800 CE' },
            { c: '⛪', title: 'Latin', word: 'sinus', meaning: 'Fold / Pocket', date: '~1150 CE' },
            { c: '🇬🇧', title: 'English', word: 'Sine', meaning: 'Math Function', date: 'Modern' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-gray-900 border border-white/10 rounded-xl p-4 w-40 text-center shadow-2xl">
              <span className="text-3xl mb-2">{item.c}</span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.title}</span>
              <span className="text-lg font-black text-white my-1">{item.word}</span>
              <span className="text-sm text-neon-coral">{item.meaning}</span>
              <span className="text-xs text-gray-600 mt-2">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- STEP 4.1: InteractiveRightTriangle (SOH-CAH-TOA) ---
export function InteractiveRightTriangle() {
  const [angle, setAngle] = useState(30); // 10 to 80
  
  const handleSlider = (e) => setAngle(parseFloat(e.target.value));
  
  const rad = angle * Math.PI / 180;
  // Fixed base length
  const adj = 50;
  const opp = adj * Math.tan(rad);
  const hyp = adj / Math.cos(rad);
  
  const bx = 20, by = 80;
  const cx = bx + adj, cy = by;
  const ax = cx, ay = by - opp;

  const sinVal = opp/hyp;
  const cosVal = adj/hyp;
  const tanVal = opp/adj;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto mb-6">
        {/* Triangle */}
        <polygon points={`${bx},${by} ${cx},${cy} ${ax},${ay}`} fill="rgba(255, 107, 107, 0.05)" stroke="none" />
        
        {/* Right Angle */}
        <polyline points={`${cx-5},${cy} ${cx-5},${cy-5} ${cx},${cy-5}`} fill="none" stroke="#555" strokeWidth="0.5" />
        
        {/* Sides */}
        <line x1={bx} y1={by} x2={cx} y2={cy} stroke="#63b3ed" strokeWidth="2" /> {/* Adjacent */}
        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#fc8181" strokeWidth="2" /> {/* Opposite */}
        <line x1={bx} y1={by} x2={ax} y2={ay} stroke="#68d391" strokeWidth="2" /> {/* Hypotenuse */}
        
        {/* Labels */}
        <text x={(bx+cx)/2} y={cy+5} fill="#63b3ed" fontSize="4" textAnchor="middle">Adjacent</text>
        <text x={cx+2} y={(cy+ay)/2} fill="#fc8181" fontSize="4" alignmentBaseline="middle">Opposite</text>
        
        {/* Angle θ */}
        <path d={`M ${bx+10} ${by} A 10 10 0 0 0 ${bx + 10*Math.cos(rad)} ${by - 10*Math.sin(rad)}`} fill="none" stroke="#fff" strokeWidth="0.5" />
        <text x={bx+14} y={by-3} fill="#fff" fontSize="4">θ</text>
      </svg>
      
      <input type="range" min="15" max="75" value={angle} onChange={handleSlider} className="w-full max-w-md accent-neon-coral mb-6" />
      
      <div className="flex gap-6 text-xl font-mono">
        <div className="text-center">
          <div className="text-fc8181 font-bold">sin θ</div>
          <div>{sinVal.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-63b3ed font-bold">cos θ</div>
          <div>{cosVal.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold">tan θ</div>
          <div>{tanVal.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}

// --- STEP 4.2: EquilateralSplitDiagram ---
export function EquilateralSplitDiagram() {
  const [split, setSplit] = useState(false);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => setSplit(!split)}
        className="px-6 py-2 mb-6 bg-neon-purple text-white rounded-full font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      >
        {split ? "Reset Triangle" : "Drop Altitude"}
      </button>

      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto">
        <polygon points="50,15 15,85 85,85" fill="none" stroke="#fff" strokeWidth="1" />
        <text x="50" y="93" fill="#fff" fontSize="4" textAnchor="middle">{split ? 'a + a = 2a' : '2a'}</text>
        <text x="25" y="45" fill="#fff" fontSize="4" textAnchor="middle">2a</text>
        <text x="75" y="45" fill="#fff" fontSize="4" textAnchor="middle">2a</text>

        {/* Angles */}
        <text x="22" y="80" fill="#ff00cc" fontSize="4">60°</text>
        <text x="68" y="80" fill="#ff00cc" fontSize="4">60°</text>

        {split && (
          <g className="animate-fade-in-up">
            <line x1="50" y1="15" x2="50" y2="85" stroke="#00ffcc" strokeWidth="1" strokeDasharray="2,2" />
            <polyline points="50,80 55,80 55,85" fill="none" stroke="#fff" strokeWidth="0.5" />
            
            <text x="50" y="10" fill="#ff00cc" fontSize="4" textAnchor="middle">30° | 30°</text>
            
            <text x="52" y="55" fill="#00ffcc" fontSize="4">a√3</text>
            
            <polygon points="50,15 50,85 85,85" fill="rgba(0, 255, 204, 0.2)" />
          </g>
        )}
      </svg>
    </div>
  );
}

// --- STEP 4.3: StandardValuesTable ---
export function StandardValuesTable() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-black/50">
        <table className="w-full text-center text-lg">
          <thead>
            <tr className="bg-white/5 text-neon-coral font-bold">
              <th className="p-4 border-b border-r border-white/10">θ</th>
              <th className="p-4 border-b border-white/10">0°</th>
              <th className="p-4 border-b border-white/10">30°</th>
              <th className="p-4 border-b border-white/10">45°</th>
              <th className="p-4 border-b border-white/10">60°</th>
              <th className="p-4 border-b border-white/10">90°</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white/5 font-mono text-sm text-gray-500">
              <td className="p-2 border-r border-white/10 text-right">Pattern:</td>
              <td className="p-2">√0/2</td>
              <td className="p-2">√1/2</td>
              <td className="p-2">√2/2</td>
              <td className="p-2">√3/2</td>
              <td className="p-2">√4/2</td>
            </tr>
            <tr className="border-b border-white/5 text-white bg-neon-coral/5">
              <td className="p-4 border-r border-white/10 font-bold text-neon-coral">sin θ</td>
              <td className="p-4">0</td>
              <td className="p-4">1/2</td>
              <td className="p-4">1/√2</td>
              <td className="p-4">√3/2</td>
              <td className="p-4">1</td>
            </tr>
            <tr className="border-b border-white/5 text-gray-300">
              <td className="p-4 border-r border-white/10 font-bold text-neon-purple">cos θ</td>
              <td className="p-4">1</td>
              <td className="p-4">√3/2</td>
              <td className="p-4">1/√2</td>
              <td className="p-4">1/2</td>
              <td className="p-4">0</td>
            </tr>
            <tr className="border-b border-white/5 text-gray-300">
              <td className="p-4 border-r border-white/10 font-bold text-yellow-400">tan θ</td>
              <td className="p-4">0</td>
              <td className="p-4">1/√3</td>
              <td className="p-4">1</td>
              <td className="p-4">√3</td>
              <td className="p-4">∞</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-gray-400">Notice the beautiful symmetry: <span className="text-neon-coral">sin</span> goes up, <span className="text-neon-purple">cos</span> goes down.</p>
    </div>
  );
}

// --- STEP 4.4: IdentityDerivation ---
export function IdentityDerivation() {
  const [step, setStep] = useState(0);

  const steps = [
    { eq: "P² + B² = H²", desc: "Start with the Pythagorean Theorem" },
    { eq: "(P/H)² + (B/H)² = (H/H)²", desc: "Divide every term by H²" },
    { eq: "sin²θ + cos²θ = 1", desc: "Substitute sin and cos definitions. Done!" }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 100 100" className="w-full max-w-sm h-auto mb-8">
        <polygon points="20,80 80,80 80,20" fill="rgba(255,255,255,0.05)" stroke="#fff" strokeWidth="1" />
        <polyline points="75,80 75,75 80,75" fill="none" stroke="#555" strokeWidth="0.5" />
        <text x="50" y="86" fill="#63b3ed" fontSize="5" textAnchor="middle">B</text>
        <text x="86" y="50" fill="#fc8181" fontSize="5" textAnchor="middle">P</text>
        <text x="45" y="45" fill="#68d391" fontSize="5" textAnchor="middle">H</text>
        <path d="M 30 80 A 10 10 0 0 0 27 73" fill="none" stroke="#fff" strokeWidth="0.5" />
        <text x="32" y="78" fill="#fff" fontSize="4">θ</text>
      </svg>

      <div className="h-32 flex flex-col items-center justify-center text-center">
        <div className={`text-4xl font-mono font-bold transition-all duration-500 ${step === 2 ? 'text-neon-coral scale-110 drop-shadow-[0_0_10px_rgba(255,107,107,0.8)]' : 'text-white'}`}>
          {steps[step].eq}
        </div>
        <div className="text-gray-400 mt-4 text-lg">{steps[step].desc}</div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-30"
        >
          Previous
        </button>
        <button 
          onClick={() => setStep(Math.min(2, step + 1))}
          disabled={step === 2}
          className="px-6 py-2 bg-neon-coral text-white font-bold rounded-lg disabled:opacity-30"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

// --- STEP 3.1: RealLifePanels ---
export function RealLifePanels() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl text-neon-coral mb-2">architecture</span>
          <h4 className="font-bold text-white mb-1">Architecture</h4>
          <p className="text-xs text-gray-400">Calculate heights of structures using shadow angles.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl text-neon-purple mb-2">satellite_alt</span>
          <h4 className="font-bold text-white mb-1">GPS Navigation</h4>
          <p className="text-xs text-gray-400">Triangulate exact location from satellite signals.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl text-green-400 mb-2">graphic_eq</span>
          <h4 className="font-bold text-white mb-1">Sound Waves</h4>
          <p className="text-xs text-gray-400">Model audio and light as continuous sine waves.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl text-blue-400 mb-2">sports_esports</span>
          <h4 className="font-bold text-white mb-1">3D Graphics</h4>
          <p className="text-xs text-gray-400">Rotate and render 3D objects on a 2D screen.</p>
        </div>
      </div>
    </div>
  );
}

// --- KEEP EXISTING WIDGETS ---
// Placeholders for MCQEngine and CheatSheet which were already implemented 
// (assuming they exist in another file or are handled by a generic widget factory. 
// For this rewrite, we will stub them so the registry works).
export function BoardSolvedExamples({ data }) {
  const [openIdx, setOpenIdx] = useState(null);

  if (!data || !data.examples) return null;

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 bg-black custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-4 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neon-coral mb-2">Board Exam Vault</h2>
          <p className="text-gray-400">Master these 10 classic problems before taking the final quiz.</p>
        </div>
        
        {data.examples.map((ex, idx) => (
          <div key={idx} className={`rounded-xl border ${openIdx === idx ? 'border-neon-coral bg-gray-900/50' : 'border-white/10 bg-white/5'} overflow-hidden transition-all duration-300`}>
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex-1 pr-4">
                <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-neon-coral/20 text-neon-coral mb-2">{ex.year}</span>
                <h3 className="text-lg font-medium text-white">{ex.q}</h3>
              </div>
              <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180 text-neon-coral' : ''}`}>
                expand_more
              </span>
            </button>
            
            <div className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIdx === idx ? 'max-h-[800px] py-4 border-t border-white/10' : 'max-h-0 py-0'}`}>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Step-by-step Solution:</h4>
              <ul className="space-y-3">
                {ex.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex gap-3 text-gray-300 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-neon-coral mt-0.5">{sIdx + 1}</span>
                    <span dangerouslySetInnerHTML={{__html: step.replace(/([0-9A-Za-z²θ°√]+)/g, (match) => {
                      if (['sin', 'cos', 'tan', 'sec', 'cosec', 'cot'].includes(match)) return `<strong>${match}</strong>`;
                      return match;
                    })}} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MCQEngine({ data }) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!data || !data.questions || data.questions.length === 0) return null;

  const questions = data.questions;
  const currentQ = questions[currentQIdx];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black p-8 text-center">
        <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 border-neon-coral">
          <span className="text-4xl font-bold text-white">{score}/{questions.length}</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          {percentage >= 80 ? "Outstanding work! You've mastered these concepts." : percentage >= 50 ? "Good effort! Review the steps and try again to improve." : "Keep practicing! Trigonometry takes time to master."}
        </p>
        <button 
          onClick={handleRetry}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">refresh</span>
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden relative">
      {/* Progress Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-neon-coral">quiz</span>
          <span className="text-white font-medium">Question {currentQIdx + 1} of {questions.length}</span>
        </div>
        <div className="text-sm font-mono text-gray-400">Score: {score}</div>
      </div>

      {/* Quiz Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-2xl mx-auto pb-20">
          <h3 className="text-2xl font-bold text-white mb-10 leading-tight">
            {currentQ.q}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correct;
              
              let btnClass = "w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ";
              let icon = null;

              if (!isSubmitted) {
                btnClass += isSelected 
                  ? "bg-electric-blue/20 border-electric-blue text-white" 
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white";
              } else {
                if (isCorrect) {
                  btnClass += "bg-green-500/20 border-green-500 text-white";
                  icon = <span className="material-symbols-outlined text-green-500">check_circle</span>;
                } else if (isSelected && !isCorrect) {
                  btnClass += "bg-red-500/20 border-red-500 text-white";
                  icon = <span className="material-symbols-outlined text-red-500">cancel</span>;
                } else {
                  btnClass += "bg-white/5 border-white/5 text-gray-500 opacity-50";
                }
              }

              return (
                <button 
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={btnClass}
                >
                  <span className="text-lg font-medium">{opt}</span>
                  {icon && icon}
                </button>
              );
            })}
          </div>

          {/* Action Area */}
          <div className="mt-12 flex justify-end">
            {!isSubmitted ? (
              <button 
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`px-8 py-3 rounded-full font-bold transition-all ${selectedOption !== null ? 'bg-neon-coral text-white hover:scale-105 shadow-[0_0_15px_rgba(255,107,107,0.5)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                Check Answer
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2 hover:scale-105"
              >
                {currentQIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheatSheet() {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 bg-surface-container rounded-2xl border border-glass-stroke shadow-2xl overflow-y-auto max-h-[80vh]">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <span className="material-symbols-outlined text-3xl text-neon-coral">menu_book</span>
        <h2 className="text-2xl font-bold font-serif text-white tracking-wide">Trigonometry Master Cheat Sheet</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Ratios */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-neon-coral font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">1. Basic Ratios (Right Triangle)</h3>
          <ul className="space-y-3 font-mono text-sm text-gray-300">
            <li><span className="text-white font-bold">sin θ</span> = Opposite / Hypotenuse</li>
            <li><span className="text-white font-bold">cos θ</span> = Adjacent / Hypotenuse</li>
            <li><span className="text-white font-bold">tan θ</span> = Opposite / Adjacent</li>
            <li><span className="text-white font-bold">cosec θ</span> = Hypotenuse / Opposite</li>
            <li><span className="text-white font-bold">sec θ</span> = Hypotenuse / Adjacent</li>
            <li><span className="text-white font-bold">cot θ</span> = Adjacent / Opposite</li>
          </ul>
        </div>

        {/* Reciprocal & Quotient */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-neon-purple font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">2. Reciprocal & Quotient Relations</h3>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm text-gray-300">
            <ul className="space-y-3">
              <li><span className="text-white">sin θ</span> = 1 / cosec θ</li>
              <li><span className="text-white">cos θ</span> = 1 / sec θ</li>
              <li><span className="text-white">tan θ</span> = 1 / cot θ</li>
            </ul>
            <ul className="space-y-3 border-l border-white/5 pl-4">
              <li><span className="text-white">tan θ</span> = sin θ / cos θ</li>
              <li><span className="text-white">cot θ</span> = cos θ / sin θ</li>
            </ul>
          </div>
        </div>

        {/* Pythagorean Identities */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-electric-blue font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">3. Pythagorean Identities</h3>
          <ul className="space-y-4 font-mono text-sm text-gray-300">
            <li className="flex items-center gap-2"><span className="p-1 bg-white/5 rounded text-white">sin²θ + cos²θ = 1</span></li>
            <li className="flex items-center gap-2"><span className="p-1 bg-white/5 rounded text-white">1 + tan²θ = sec²θ</span></li>
            <li className="flex items-center gap-2"><span className="p-1 bg-white/5 rounded text-white">1 + cot²θ = cosec²θ</span></li>
          </ul>
        </div>

        {/* Complementary Angles */}
        <div className="bg-surface/50 p-5 rounded-xl border border-white/5">
          <h3 className="text-tertiary-fixed font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">4. Complementary Angles</h3>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm text-gray-300">
            <ul className="space-y-3">
              <li><span className="text-white">sin(90° - θ)</span> = cos θ</li>
              <li><span className="text-white">tan(90° - θ)</span> = cot θ</li>
              <li><span className="text-white">sec(90° - θ)</span> = cosec θ</li>
            </ul>
            <ul className="space-y-3 border-l border-white/5 pl-4">
              <li><span className="text-white">cos(90° - θ)</span> = sin θ</li>
              <li><span className="text-white">cot(90° - θ)</span> = tan θ</li>
              <li><span className="text-white">cosec(90° - θ)</span> = sec θ</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Standard Values Table */}
      <div className="mt-6 bg-surface/50 p-5 rounded-xl border border-white/5 overflow-x-auto">
        <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4 border-b border-white/5 pb-2">5. Standard Values (0° to 90°)</h3>
        <table className="w-full text-center font-mono text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-white/5">
              <th className="py-2 px-3 border border-white/10 text-gray-400">Angle (θ)</th>
              <th className="py-2 px-3 border border-white/10 text-neon-coral">0°</th>
              <th className="py-2 px-3 border border-white/10 text-neon-coral">30°</th>
              <th className="py-2 px-3 border border-white/10 text-neon-coral">45°</th>
              <th className="py-2 px-3 border border-white/10 text-neon-coral">60°</th>
              <th className="py-2 px-3 border border-white/10 text-neon-coral">90°</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr>
              <td className="py-2 px-3 border border-white/10 font-bold text-white">sin θ</td>
              <td className="py-2 px-3 border border-white/10">0</td>
              <td className="py-2 px-3 border border-white/10">1/2</td>
              <td className="py-2 px-3 border border-white/10">1/√2</td>
              <td className="py-2 px-3 border border-white/10">√3/2</td>
              <td className="py-2 px-3 border border-white/10">1</td>
            </tr>
            <tr>
              <td className="py-2 px-3 border border-white/10 font-bold text-white">cos θ</td>
              <td className="py-2 px-3 border border-white/10">1</td>
              <td className="py-2 px-3 border border-white/10">√3/2</td>
              <td className="py-2 px-3 border border-white/10">1/√2</td>
              <td className="py-2 px-3 border border-white/10">1/2</td>
              <td className="py-2 px-3 border border-white/10">0</td>
            </tr>
            <tr>
              <td className="py-2 px-3 border border-white/10 font-bold text-white">tan θ</td>
              <td className="py-2 px-3 border border-white/10">0</td>
              <td className="py-2 px-3 border border-white/10">1/√3</td>
              <td className="py-2 px-3 border border-white/10">1</td>
              <td className="py-2 px-3 border border-white/10">√3</td>
              <td className="py-2 px-3 border border-white/10 text-gray-500 italic">Not defined</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

// Full Widget Registry
export const WidgetRegistry = {
  StarObserverDiagram,
  InteractiveChordCircle,
  HexagonChordDiagram,
  ChordTableWidget,
  TriangulationDiagram,
  ParallaxThumbDiagram,
  EclipseDiagram,
  MoonDistanceDiagram: TriangulationDiagram, // Shares same component
  ChordVsHalfChordDiagram,
  InteractiveHalfChordCircle,
  ArcMinuteCircleDiagram,
  DifferenceBarChart,
  AryabhataSineTable,
  LinguisticTimeline,
  InteractiveRightTriangle,
  EquilateralSplitDiagram,
  StandardValuesTable,
  IdentityDerivation,
  RealLifePanels,
  BoardSolvedExamples,
  MCQEngine,
  CheatSheet,
  HistoryOfIrrationality,
  EuclidAlgorithmVisualizer,
  PrimeFactorizationTree,
  IrrationalityProofExplorer,
  DecimalExpansionChecker,
  RealNumbersCheatSheet,
  StoryOfPiWidget,
  RealWorldApplicationsWidget,
  MemorySyncWidget,
  
  // Class 9 Number Systems
  RationalDensityWidget,
  SpiralOfTheodorusWidget,
  SuccessiveMagnificationWidget,
  RationalizerWidget,
  SquareRootLoreWidget,
  InfiniteZoomLineWidget,
  
  // AI Masterclass
  FirstNeuronWidget,
  CpuVsGpuWidget,
  VectorGalaxyWidget,
  BlindSkierWidget,
  SoftmaxWidget,
  NeuralNetworkWidget,
  AttentionWidget,
  RLHFWidget,
  PromptingWidget,
  ContextWindowWidget,
  RAGWidget,
  ReasoningWidget,
  AgentWidget,
  TaxonomyWidget,
  EmbeddingsWidget,
  GenerativeWidget,
  DiffusionWidget,
  RAGvsFineTuningWidget,
  QuantizationWidget,
  MoEWidget,
  CpuVsGpuCoreWidget,
  DataCenterWidget,
  DataCenterAnatomyWidget,
  AIEcosystemWidget,
  EchoChamberWidget,
  GenieCurseWidget,
  XRayMindWidget,
  EggTestWidget,
  LaserWeederWidget,
  HiveMindWidget,
  IndustryImpactWidget,
  PocPurgatoryWidget,
  PaletteCompressorWidget,
  AppleIntelligenceWidget,
  AGITrackerWidget,
  TakeoffSimulatorWidget,
  
  // Agile Framework
  WaterfallVsAgileWidget,
  KanbanFlowWidget,
  SAFeAlignmentWidget,
  WorkHierarchyWidget,
  PlanningPokerWidget,
  SprintLifecycleWidget,
  
  // Corporate Actions
  'ca-history-timeline': CorporateActionsTimelineWidget,
  'ca-camv-indicator': CAMVIndicatorWidget,
  'ca-lifecycle-dates': CALifecycleDatesWidget,
  'ca-settlement-cycle': CASettlementCycleWidget,
  'swift-message-flow-sankey': SwiftStpFlowWidget,
  'ca-swift-flow': SwiftStpFlowWidget,
  'ca-swift-dictionary': SwiftDictionaryWidget,
  'custody-chain-pyramid': CustodyChainPyramidWidget,
  'ca-custody-chain': CustodyChainPyramidWidget,
  'ca-omnibus-allocation': OmnibusAllocationWidget,
  'ca-event-taxonomy': EventTaxonomyWidget,
  'ca-claims-transformations': ClaimsTransformationWidget,
  'trade-vs-settlement-timeline': ClaimsTransformationWidget
};
