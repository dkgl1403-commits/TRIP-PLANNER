import React, { useState, useEffect, useRef } from 'react';
import { HistoryOfIrrationality, DecimalExpansionChecker } from './RealNumberWidgets';

// 1. Rational Density Widget
export function RationalDensityWidget() {
  const [zoomLevel, setZoomLevel] = useState(0);
  const maxZoom = 4;

  const handleZoom = () => {
    if (zoomLevel < maxZoom) setZoomLevel(z => z + 1);
  };
  
  const handleReset = () => setZoomLevel(0);

  const getFractions = (zoom) => {
    // 1/3 and 1/2.
    // Base: 2/6 and 3/6
    // Zoom 1: 4/12 and 6/12 -> 5/12
    // Zoom 2: 8/24 and 12/24 -> 9/24, 10/24, 11/24
    // Zoom 3: 16/48 and 24/48 -> 17/48 ... 23/48
    if (zoom === 0) return [{num: 1, den: 3}, {num: 1, den: 2}];
    if (zoom === 1) return [{num: 4, den: 12}, {num: 5, den: 12}, {num: 6, den: 12}];
    if (zoom === 2) return [{num: 8, den: 24}, {num: 9, den: 24}, {num: 10, den: 24}, {num: 11, den: 24}, {num: 12, den: 24}];
    
    // Zoom 3 just show a few
    return [{num: 16, den: 48}, {num: 17, den: 48}, {num: '...', den: '...'}, {num: 23, den: 48}, {num: 24, den: 48}];
  };

  const fractions = getFractions(zoomLevel);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-coral mb-6 border-b border-glass-stroke pb-2">Between 1/3 and 1/2</h3>
        
        <div className="relative h-24 mb-10 mt-8">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2"></div>
          
          {fractions.map((frac, idx) => {
            const leftPercent = (idx / (fractions.length - 1)) * 100;
            return (
              <div key={idx} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${leftPercent}%` }}>
                <div className="w-3 h-3 rounded-full bg-neon-coral shadow-[0_0_10px_rgba(255,107,107,0.8)] z-10"></div>
                <div className="mt-3 bg-black/60 px-3 py-1 rounded text-sm font-bold border border-white/10 text-white">
                  {frac.num} / {frac.den}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={handleReset}
            disabled={zoomLevel === 0}
            className="px-6 py-2 rounded-lg bg-surface border border-glass-stroke text-white disabled:opacity-50 transition-all hover:bg-white/5"
          >
            Reset
          </button>
          <button 
            onClick={handleZoom}
            disabled={zoomLevel >= 3}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-coral text-white font-bold disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(255,107,107,0.5)]"
          >
            Zoom In
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          {zoomLevel === 0 && "We can't see any integers between 1 and 2. Let's find a common denominator."}
          {zoomLevel === 1 && "By multiplying top and bottom by 4, we reveal 5/12!"}
          {zoomLevel === 2 && "Zooming further reveals 3 new fractions between them."}
          {zoomLevel >= 3 && "This process never ends. There are infinitely many rational numbers!"}
        </div>
      </div>
    </div>
  );
}

// 2. Spiral of Theodorus Widget
export function SpiralOfTheodorusWidget() {
  const [step, setStep] = useState(1); // 1 to 5
  
  // Coordinates for the spiral points (approximate for visual)
  // p0 = (0,0)
  // p1 = (1,0) (hyp = sqrt(1))
  // p2 = (1,1) (hyp = sqrt(2))
  // p3 = (0.29, 1.39) (hyp = sqrt(3))
  // p4 = (-0.63, 1.25) (hyp = sqrt(4) = 2)
  // p5 = (-1.19, 0.58) (hyp = sqrt(5))
  // p6 = (-1.22, -0.42) (hyp = sqrt(6))
  const points = [
    {x: 150, y: 150}, // Center
    {x: 250, y: 150}, // sqrt(1)
    {x: 250, y: 50},  // sqrt(2)
    {x: 165, y: 15},  // sqrt(3)
    {x: 75, y: 40},   // sqrt(4)
    {x: 25, y: 115},  // sqrt(5)
    {x: 20, y: 215},  // sqrt(6)
  ];

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl flex flex-col items-center">
        <h3 className="text-xl font-bold text-neon-purple mb-4 border-b border-glass-stroke pb-2 w-full text-left">The Spiral of Theodorus</h3>
        
        <div className="relative w-[300px] h-[300px] mb-6 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
          <svg width="300" height="300" className="absolute top-0 left-0">
            {/* Draw Triangles */}
            {points.map((p, i) => {
              if (i === 0 || i > step) return null;
              
              const prev = points[i-1];
              const center = points[0];
              
              return (
                <g key={i}>
                  {/* Outer edge (length 1) */}
                  <line x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#ff6b6b" strokeWidth="2" />
                  {/* Hypotenuse */}
                  <line x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4" />
                  {/* Fill triangle */}
                  <polygon points={`${center.x},${center.y} ${prev.x},${prev.y} ${p.x},${p.y}`} fill="rgba(255,107,107,0.1)" stroke="rgba(255,255,255,0.2)" />
                </g>
              );
            })}
            
            {/* Draw Labels */}
            {points.map((p, i) => {
              if (i === 0 || i > step) return null;
              return (
                <text key={`txt-${i}`} x={p.x + (p.x > 150 ? 5 : -25)} y={p.y + (p.y > 150 ? 15 : -5)} fill="white" fontSize="12" fontWeight="bold">
                  &radic;{i}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg bg-surface border border-glass-stroke text-white disabled:opacity-50"
          >
            Undo
          </button>
          <button 
            onClick={() => setStep(s => Math.min(6, s + 1))}
            disabled={step === 6}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-coral text-white font-bold disabled:opacity-50"
          >
            Next Triangle
          </button>
        </div>
        <p className="mt-4 text-gray-400 text-sm text-center">
          Starting with a 1x1 triangle, we use the previous hypotenuse as the new base. The outer edge is always length 1.
        </p>
      </div>
    </div>
  );
}

// 3. Successive Magnification Widget
export function SuccessiveMagnificationWidget() {
  const [level, setLevel] = useState(0); // 0, 1, 2
  
  const getBounds = (lvl) => {
    if (lvl === 0) return { min: 2, max: 3, step: 0.1, target: 2.6, next: 2.7 };
    if (lvl === 1) return { min: 2.6, max: 2.7, step: 0.01, target: 2.66, next: 2.67 };
    return { min: 2.66, max: 2.67, step: 0.001, target: 2.665, next: 2.666 };
  };

  const bounds = getBounds(level);
  const marks = Array.from({length: 11}, (_, i) => (bounds.min + i * bounds.step).toFixed(level + 1));

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-[#4ade80] mb-6 border-b border-glass-stroke pb-2">Target: 2.665</h3>
        
        <div className="flex flex-col items-center gap-8 py-4">
          <div className="w-full relative h-16 bg-black/40 rounded-xl px-4 flex items-center justify-between border border-white/5">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-white/20 -translate-y-1/2"></div>
            
            {marks.map((mark, i) => {
              const numMark = parseFloat(mark);
              const isTarget = numMark === bounds.target;
              
              return (
                <div key={i} className="relative flex flex-col items-center z-10">
                  <div className={`w-3 h-3 rounded-full ${isTarget ? 'bg-neon-coral shadow-[0_0_10px_rgba(255,107,107,0.8)] scale-150' : 'bg-gray-500'}`}></div>
                  <div className={`absolute top-6 text-xs whitespace-nowrap ${isTarget ? 'text-neon-coral font-bold' : 'text-gray-400'}`}>
                    {mark}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setLevel(0)}
              disabled={level === 0}
              className="px-6 py-2 rounded-lg bg-surface border border-glass-stroke text-white disabled:opacity-50"
            >
              Reset View
            </button>
            <button 
              onClick={() => setLevel(l => Math.min(2, l + 1))}
              disabled={level === 2}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-black font-bold disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Magnify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Rationalizer Widget
export function RationalizerWidget() {
  const [selectedConjugate, setSelectedConjugate] = useState(null);
  
  const fraction = { top: "1", bottom: "\u221A3 - \u221A2" };
  const correctConjugate = "\u221A3 + \u221A2";
  const options = ["\u221A3 - \u221A2", "\u221A3 + \u221A2", "3 - 2"];

  const checkAnswer = (opt) => setSelectedConjugate(opt);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-2xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl flex flex-col items-center">
        <h3 className="text-xl font-bold text-neon-purple mb-6 border-b border-glass-stroke pb-2 w-full text-left">Rationalize the Denominator</h3>
        
        <div className="text-3xl font-serif text-white mb-8 flex items-center gap-4 bg-black/40 p-6 rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <div className="border-b-2 border-white px-4 pb-1">{fraction.top}</div>
            <div className="pt-1 px-2">{fraction.bottom}</div>
          </div>
          <div className="text-neon-coral font-sans">&times;</div>
          
          <div className="flex flex-col items-center bg-white/5 border border-dashed border-white/20 p-2 rounded-lg min-w-[120px] min-h-[90px] justify-center text-neon-coral">
            {selectedConjugate ? (
              <>
                <div className="border-b-2 border-neon-coral px-2 pb-1">{selectedConjugate}</div>
                <div className="pt-1 px-2">{selectedConjugate}</div>
              </>
            ) : (
              <span className="text-sm font-sans text-gray-500">Select Conjugate</span>
            )}
          </div>
        </div>

        {!selectedConjugate && (
          <div className="flex gap-4 w-full justify-center">
            {options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => checkAnswer(opt)}
                className="px-6 py-3 rounded-xl bg-surface border border-glass-stroke text-lg font-serif hover:bg-white/10 transition-colors shadow-lg"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {selectedConjugate && selectedConjugate === correctConjugate && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Correct Conjugate!
            </div>
            
            <div className="bg-black/40 p-6 rounded-xl border border-green-500/30 text-center w-full">
              <div className="text-gray-300 text-sm mb-4">The denominator becomes:</div>
              <div className="text-xl font-serif text-white mb-2">(&radic;3 - &radic;2)(&radic;3 + &radic;2)</div>
              <div className="text-gray-400 text-sm mb-2">&darr; (a - b)(a + b) = a&sup2; - b&sup2;</div>
              <div className="text-xl font-serif text-white mb-2">3 - 2</div>
              <div className="text-neon-purple text-2xl font-black mt-4 border-t border-white/10 pt-4">Final Answer: &radic;3 + &radic;2</div>
            </div>
          </div>
        )}

        {selectedConjugate && selectedConjugate !== correctConjugate && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="text-red-400 font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">cancel</span>
              Incorrect Conjugate.
            </div>
            <button 
              onClick={() => setSelectedConjugate(null)}
              className="px-6 py-2 rounded-lg bg-surface border border-glass-stroke text-white hover:bg-white/10"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. Cinematic Lore Widget
export function SquareRootLoreWidget() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, title: "1. The Concept", subtitle: "Babylon, 1800 BCE" },
    { id: 1, title: "2. The Name", subtitle: "Arabic Golden Age, 800 CE" },
    { id: 2, title: "3. The Symbol", subtitle: "Germany, 1525 CE" }
  ];

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl bg-surface-container rounded-2xl p-6 md:p-8 border border-glass-stroke shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-2">Cinematic Lore: Origin of the Square Root</h2>
          <p className="text-gray-400">Discover how a real-world problem turned into the famous radical symbol.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8 bg-black/40 p-2 rounded-xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${activeTab === tab.id ? 'bg-white/10 shadow-lg border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <span className={`font-bold text-sm ${activeTab === tab.id ? 'text-amber-300' : 'text-gray-400'}`}>{tab.title}</span>
              <span className={`text-xs ${activeTab === tab.id ? 'text-amber-100/70' : 'text-gray-600'}`}>{tab.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Scene 1: The Clay Tablet */}
        {activeTab === 0 && (
          <div className="flex flex-col md:flex-row gap-8 items-center animate-fade-in">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-amber-300">The Builders of Babylon</h3>
              <p className="text-gray-300 leading-relaxed">
                The square root wasn't invented by a philosopher sitting in a room; it was invented by ancient architects and farmers.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If a builder is designing a diagonal ramp across a 1x1 square base, the area of the new square formed by that diagonal is exactly 2. What number, multiplied by itself, equals exactly 2?
              </p>
            </div>
            <div className="flex-1 w-full bg-[#8c6b4a] rounded-full aspect-square max-w-[250px] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center relative border-4 border-[#7a5c3e] overflow-hidden">
              {/* Babylonian Tablet Mockup */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOGM2YjRhIi8+CjxwYXRoIGQ9Ik0wIDRMMCAwTDEgME0zIDRMMiA0TDIgMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjN2E1YzNlIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-40 mix-blend-multiply"></div>
              <svg width="200" height="200" viewBox="0 0 200 200" className="z-10 opacity-70">
                <rect x="50" y="50" width="100" height="100" fill="none" stroke="#3b2b1a" strokeWidth="4" transform="rotate(45 100 100)" />
                <line x1="100" y1="29.2" x2="100" y2="170.7" stroke="#3b2b1a" strokeWidth="3" />
                <line x1="29.2" y1="100" x2="170.7" y2="100" stroke="#3b2b1a" strokeWidth="3" />
                <text x="110" y="90" fill="#3b2b1a" fontSize="14" fontWeight="bold" transform="rotate(-45 110 90)">1.414212...</text>
              </svg>
            </div>
          </div>
        )}

        {/* Scene 2: The Math Tree */}
        {activeTab === 1 && (
          <div className="flex flex-col md:flex-row gap-8 items-center animate-fade-in">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-green-400">The Tree of Math</h3>
              <p className="text-gray-300 leading-relaxed">
                Why do we call it a "Root"? When medieval Arabic mathematicians (like Al-Khwarizmi, the father of Algebra) wrote about math, they used a botanical analogy.
              </p>
              <p className="text-gray-300 leading-relaxed">
                They viewed a number like 9 as a tree. The fundamental "seed" hidden underground that this tree grew out of was 3 (because 3 &times; 3 = 9). They called this the <em>jadhir</em> (Arabic for "root of a plant").
              </p>
              <p className="text-gray-300 leading-relaxed">
                European scholars translated <em>jadhir</em> literally into the Latin word for plant root: <strong>Radix</strong>. (This is also where we get the word Radish!).
              </p>
            </div>
            <div className="flex-1 w-full bg-gradient-to-b from-sky-900 to-amber-900/50 rounded-2xl h-[250px] relative overflow-hidden flex flex-col border border-white/10">
              <div className="flex-1 flex justify-center items-end pb-2 relative z-10">
                {/* Tree */}
                <div className="relative flex flex-col items-center group">
                  <div className="w-32 h-32 bg-green-500/20 border border-green-500/50 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] flex items-center justify-center transition-all duration-1000 group-hover:scale-110">
                    <span className="text-4xl font-bold text-green-400">9</span>
                  </div>
                  <div className="w-4 h-16 bg-[#5c4033] mt-[-5px]"></div>
                </div>
              </div>
              {/* Underground */}
              <div className="h-16 bg-[#3a271d] w-full border-t-2 border-green-800 flex justify-center items-center relative z-10">
                <div className="px-4 py-1 bg-amber-600/30 border border-amber-500/50 rounded-full text-amber-200 font-bold text-sm shadow-[0_0_15px_rgba(217,119,6,0.5)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                  Radix = 3
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scene 3: The Symbol */}
        {activeTab === 2 && (
          <div className="flex flex-col md:flex-row gap-8 items-center animate-fade-in">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-neon-purple">The Lazy Mathematician</h3>
              <p className="text-gray-300 leading-relaxed">
                For centuries, mathematicians had to write it out in full Latin: <em>Radix 2</em>. This took too much time.
              </p>
              <p className="text-gray-300 leading-relaxed">
                In 1525, a German mathematician named Christoff Rudolff published a textbook. To write equations faster, he took the lowercase cursive letter 'r' (for radix) and stretched its tail out like a roof to cover the numbers underneath.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The magical &radic; symbol isn't a magical rune; it's just a 500-year-old cursive letter 'r'!
              </p>
            </div>
            <div className="flex-1 w-full bg-slate-900 rounded-2xl h-[250px] relative flex flex-col items-center justify-center border border-white/10 group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
              
              <div className="relative z-10 h-20 overflow-hidden text-center flex flex-col items-center justify-center w-full">
                <div className="text-4xl font-serif text-white/50 transition-all duration-1000 transform group-hover:-translate-y-20 opacity-100 group-hover:opacity-0 absolute">
                  radix 2
                </div>
                <div className="text-6xl font-serif text-white transition-all duration-1000 transform translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 absolute flex items-center">
                  <span className="text-neon-purple mr-1 scale-y-125 transform origin-bottom font-serif italic relative -top-1">&radic;</span>
                  <span className="border-t-[3px] border-neon-purple pt-1 -ml-1">2</span>
                </div>
              </div>
              <p className="absolute bottom-4 text-xs text-gray-500 font-mono">Hover to see the evolution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 6. Infinite Zoom Line Widget
export function InfiniteZoomLineWidget() {
  const [zoomLevel, setZoomLevel] = useState(0);
  const maxZoom = 4;

  const handleZoom = () => {
    if (zoomLevel < maxZoom) setZoomLevel(z => z + 1);
  };
  
  const handleReset = () => setZoomLevel(0);

  const getFractions = (zoom) => {
    if (zoom === 0) return [{num: 1, den: 1, val: 1}, {num: 2, den: 1, val: 2}];
    if (zoom === 1) return [{num: 10, den: 10, val: 1}, {num: 15, den: 10, val: 1.5}, {num: 20, den: 10, val: 2}];
    if (zoom === 2) return [{num: 100, den: 100, val: 1}, {num: 150, den: 100, val: 1.5}, {num: 199, den: 100, val: 1.99}, {num: 200, den: 100, val: 2}];
    if (zoom === 3) return [{num: 1500, den: 1000, val: 1.5}, {num: 1750, den: 1000, val: 1.75}, {num: 1990, den: 1000, val: 1.99}];
    return [{num: '...', den: '...'}, {num: 1999, den: 1000, val: 1.999}, {num: '...', den: '...'}];
  };

  const fractions = getFractions(zoomLevel);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-3xl bg-surface-container rounded-2xl p-6 border border-glass-stroke shadow-xl">
        <h3 className="text-xl font-bold text-neon-blue mb-6 border-b border-glass-stroke pb-2">The Infinite Abyss</h3>
        
        <div className="relative h-24 mb-10 mt-8 overflow-hidden rounded-lg bg-black/40 border border-white/5">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2"></div>
          
          {fractions.map((frac, idx) => {
            const leftPercent = zoomLevel < 3 ? (idx / (fractions.length - 1)) * 90 + 5 : (idx / (fractions.length - 1)) * 60 + 20;
            return (
              <div key={idx} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700" style={{ left: `${leftPercent}%` }}>
                <div className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10"></div>
                <div className="mt-3 bg-black/80 px-3 py-1 rounded text-sm font-bold border border-white/10 text-white">
                  {frac.num} / {frac.den}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={handleReset}
            disabled={zoomLevel === 0}
            className="px-6 py-2 rounded-lg bg-surface border border-glass-stroke text-white disabled:opacity-50 transition-all hover:bg-white/5"
          >
            Reset
          </button>
          <button 
            onClick={handleZoom}
            disabled={zoomLevel >= maxZoom}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            Zoom In
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm h-10">
          {zoomLevel === 0 && "Look at 1 and 2. Is there anything between them?"}
          {zoomLevel === 1 && "Zooming in... We can write 1 as 10/10 and 2 as 20/10. Look at 15/10!"}
          {zoomLevel === 2 && "Let's multiply by 10 again. Now we see 199/100."}
          {zoomLevel === 3 && "Zooming into 1.5 to 1.99. Thousands of new numbers appear."}
          {zoomLevel === maxZoom && "The abyss never ends. Between ANY two fractions, there is always another one."}
        </div>
      </div>
    </div>
  );
}
