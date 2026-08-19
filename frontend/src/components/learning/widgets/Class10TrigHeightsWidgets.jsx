import React, { useState } from 'react';

// ─── WIDGET 1: Angle of Elevation (Lighthouse Searchlight Metaphor) ───
export function Class10TrigHeightsElevationWidget() {
  const [distance, setDistance] = useState(15); // distance from foot of tower (5 to 30 m)
  const [height, setHeight] = useState(15);   // height of tower (5 to 30 m)
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Angle of elevation theta = arctan(height / distance) in degrees
  const rad = Math.atan(height / distance);
  const angleDeg = (rad * 180 / Math.PI).toFixed(1);
  const tanVal = (height / distance).toFixed(3);
  const lineOfSightLen = Math.sqrt(height * height + distance * distance).toFixed(2);

  // SVG scaling
  const scale = 6;
  const originX = 50;
  const originY = 220;
  const towerX = originX + distance * scale;
  const towerTopY = originY - height * scale;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Lighthouse Searchlight Metaphor</span>
          <h3 className="text-xl font-bold text-white">Angle of Elevation (Looking Upward)</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Ground Line (Horizontal) */}
            <line x1={20} y1={originY} x2={360} y2={originY} stroke="#475569" strokeWidth="3" />

            {/* Vertical Tower Height */}
            <line x1={towerX} y1={originY} x2={towerX} y2={towerTopY} stroke="#f59e0b" strokeWidth="4" />
            <rect x={towerX - 6} y={towerTopY - 10} width="12" height="10" fill="#f59e0b" />

            {/* Line of Sight */}
            <line x1={originX} y1={originY} x2={towerX} y2={towerTopY} stroke="#38bdf8" strokeWidth="3" />

            {/* 90 deg symbol at foot */}
            <rect x={towerX - 12} y={originY - 12} width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="2" />

            {/* Observer Point C */}
            <circle cx={originX} cy={originY} r="6" fill="#38bdf8" />
            <text x={originX - 15} y={originY + 20} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">Observer C</text>

            {/* Top Object A */}
            <circle cx={towerX} cy={towerTopY} r="6" fill="#f59e0b" />
            <text x={towerX + 10} y={towerTopY + 5} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">Top A ({height}m)</text>

            {/* Foot B */}
            <text x={towerX + 10} y={originY + 20} fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="mono">Foot B</text>

            {/* Angle Indicator Arc */}
            <path 
              d={`M ${originX + 25} ${originY} A 25 25 0 0 0 ${originX + 25 * Math.cos(rad)} ${originY - 25 * Math.sin(rad)}`} 
              fill="none" stroke="#38bdf8" strokeWidth="2.5" 
            />
            <text x={originX + 35} y={originY - 8} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">θ = {angleDeg}°</text>
          </svg>

          <div className="w-full mt-4 space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Distance from Foot (BC):</span>
                <span className="text-amber-400">{distance} meters</span>
              </div>
              <input 
                type="range" min="5" max="30" step="1" value={distance} 
                onChange={(e) => setDistance(parseInt(e.target.value))} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Tower Height (AB):</span>
                <span className="text-amber-400">{height} meters</span>
              </div>
              <input 
                type="range" min="5" max="30" step="1" value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value))} 
                className="w-full accent-amber-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Trigonometric Ratio Verification</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>tan(θ) = Opposite / Adjacent:</div>
              <div className="text-base font-bold">tan({angleDeg}°) = {height} / {distance} = {tanVal}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Line of Sight Length (Hypotenuse):</div>
              <div className="text-base font-bold">√({height}² + {distance}²) = {lineOfSightLen} meters</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Angle of Elevation θ = {angleDeg}°  |  tan θ = {tanVal} ✓
            </div>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 font-sans space-y-1">
            <span className="font-bold text-amber-400 block">💡 Golden Board Reflex:</span>
            Over 85% of board exam problems use <strong>tan θ = Height / Distance</strong>. Knowing any 2 values lets you instantly solve for the 3rd!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 2: Angle of Depression (Cliff & Ship Metaphor) ───
export function Class10TrigHeightsDepressionWidget() {
  const [cliffH, setCliffH] = useState(20);  // cliff height in meters
  const [shipD, setShipD] = useState(20);   // ship distance in meters
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rad = Math.atan(cliffH / shipD);
  const angleDeg = (rad * 180 / Math.PI).toFixed(1);
  const tanVal = (cliffH / shipD).toFixed(3);

  const scale = 5;
  const originX = 50;
  const originY = 220;
  const cliffX = originX;
  const cliffTopY = originY - cliffH * scale;
  const shipX = originX + shipD * scale;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-sky-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Cliff & Ship Metaphor</span>
          <h3 className="text-xl font-bold text-white">Angle of Depression (Looking Downward)</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
        {/* SVG Stage */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Sea Level Ground Line */}
            <line x1={20} y1={originY} x2={360} y2={originY} stroke="#0284c7" strokeWidth="3" />

            {/* Vertical Cliff Height */}
            <line x1={cliffX} y1={originY} x2={cliffX} y2={cliffTopY} stroke="#a855f7" strokeWidth="4" />

            {/* Top Horizontal Level Line */}
            <line x1={cliffX} y1={cliffTopY} x2={cliffX + 220} y2={cliffTopY} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />

            {/* Line of Sight Downward */}
            <line x1={cliffX} y1={cliffTopY} x2={shipX} y2={originY} stroke="#ef4444" strokeWidth="3" />

            {/* Observer Top A */}
            <circle cx={cliffX} cy={cliffTopY} r="6" fill="#f59e0b" />
            <text x={cliffX - 35} y={cliffTopY - 10} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">Observer A</text>

            {/* Ship C */}
            <circle cx={shipX} cy={originY} r="6" fill="#0284c7" />
            <text x={shipX - 15} y={originY + 20} fill="#0284c7" fontSize="13" fontWeight="bold" fontFamily="mono">Ship C ⛵</text>

            {/* Top Angle of Depression phi */}
            <text x={cliffX + 35} y={cliffTopY + 18} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="mono">ϕ = {angleDeg}°</text>

            {/* Ground Alternate Interior Angle theta */}
            <text x={shipX - 60} y={originY - 10} fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="mono">θ = {angleDeg}°</text>
          </svg>

          {/* Sliders */}
          <div className="w-full mt-4 space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Cliff Height (h):</span>
                <span className="text-purple-400">{cliffH} meters</span>
              </div>
              <input 
                type="range" min="10" max="35" step="1" value={cliffH} 
                onChange={(e) => setCliffH(parseInt(e.target.value))} 
                className="w-full accent-purple-400 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Ship Distance (d):</span>
                <span className="text-sky-400">{shipD} meters</span>
              </div>
              <input 
                type="range" min="10" max="35" step="1" value={shipD} 
                onChange={(e) => setShipD(parseInt(e.target.value))} 
                className="w-full accent-sky-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Alternate Interior Angle Rule</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Top Angle of Depression (ϕ):</div>
              <div className="text-base font-bold">{angleDeg}°</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
              <div>Ground Angle of Elevation (θ):</div>
              <div className="text-base font-bold">{angleDeg}° (Alternate Interior Angle)</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              ϕ (Depression) = θ (Elevation) = {angleDeg}°  |  tan θ = {tanVal} ✓
            </div>
          </div>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 font-sans space-y-1">
            <span className="font-bold text-purple-400 block">💡 Golden Rule of Depression:</span>
            Always draw the top horizontal line first, mark depression angle ϕ, and transfer it to the ground angle θ because parallel lines form equal alternate interior angles!
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 3: Two-Triangle Systems — Flagstaff & Moving Cars ───
export function Class10TrigHeightsTwoTriangleWidget() {
  const [mode, setMode] = useState('flagstaff'); // 'flagstaff' or 'car'
  const [buildingH, setBuildingH] = useState(10); // building height 10m
  const [flagstaffH, setFlagstaffH] = useState(7.32); // flagstaff x
  const [isFullscreen, setIsFullscreen] = useState(false);

  // In flagstaff mode, building = 10m, small angle = 30 deg ==> distance = 10 * sqrt(3) = 17.32m
  // Big angle = 45 deg ==> total height = 17.32m ==> flagstaff = 17.32 - 10 = 7.32m
  const distBuilding = (10 * Math.sqrt(3)).toFixed(2); // 17.32m
  const totalH = (10 * Math.sqrt(3)).toFixed(2);       // 17.32m

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Double Sight Metaphor</span>
          <h3 className="text-xl font-bold text-white">Two-Triangle Systems (Standard Board Exam Level)</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button 
              onClick={() => setMode('flagstaff')} 
              className={`px-3 py-1 rounded-lg font-bold transition-all ${mode === 'flagstaff' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Flagstaff Mode (30° & 45°)
            </button>
            <button 
              onClick={() => setMode('car')} 
              className={`px-3 py-1 rounded-lg font-bold transition-all ${mode === 'car' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Moving Car Mode (30° to 60°)
            </button>
          </div>

          <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md drop-shadow-2xl">
            <line x1={20} y1={220} x2={360} y2={220} stroke="#475569" strokeWidth="3" />

            {mode === 'flagstaff' ? (
              <>
                {/* Building AB (10m) */}
                <line x1={260} y1={220} x2={260} y2={140} stroke="#a855f7" strokeWidth="4" />
                {/* Flagstaff BD (7.32m) */}
                <line x1={260} y1={140} x2={260} y2={80} stroke="#f59e0b" strokeWidth="4" />

                {/* Line of sight to building top (30 deg) */}
                <line x1={80} y1={220} x2={260} y2={140} stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 3" />
                {/* Line of sight to flagstaff top (45 deg) */}
                <line x1={80} y1={220} x2={260} y2={80} stroke="#f59e0b" strokeWidth="3" />

                <circle cx={80} cy={220} r="5" fill="#38bdf8" />
                <text x={80 - 15} y={240} fill="#38bdf8" fontSize="13" fontWeight="bold">P (Ground)</text>

                <text x={270} y={180} fill="#a855f7" fontSize="12" fontWeight="bold">Building (10m)</text>
                <text x={270} y={110} fill="#f59e0b" fontSize="12" fontWeight="bold">Flagstaff ({flagstaffH}m)</text>
              </>
            ) : (
              <>
                {/* Tower (60m) */}
                <line x1={300} y1={220} x2={300} y2={60} stroke="#f59e0b" strokeWidth="4" />
                {/* Car position 1 (30 deg) */}
                <line x1={60} y1={220} x2={300} y2={60} stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 3" />
                {/* Car position 2 (60 deg) */}
                <line x1={190} y1={220} x2={300} y2={60} stroke="#38bdf8" strokeWidth="3" />

                <circle cx={60} cy={220} r="5" fill="#a855f7" />
                <text x={50} y={240} fill="#a855f7" fontSize="12" fontWeight="bold">Car Pos 1 (30°)</text>

                <circle cx={190} cy={220} r="5" fill="#38bdf8" />
                <text x={180} y={240} fill="#38bdf8" fontSize="12" fontWeight="bold">Car Pos 2 (60°)</text>

                <text x={310} y={140} fill="#f59e0b" fontSize="12" fontWeight="bold">Tower (60m)</text>
              </>
            )}
          </svg>
        </div>

        {/* Math Breakdown */}
        <div className="space-y-4 font-mono text-xs">
          {mode === 'flagstaff' ? (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Flagstaff Solved Equations</span>

              <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
                <div>Small Triangle ΔPAB (tan 30° = 10 / d):</div>
                <div className="text-base font-bold">1/√3 = 10 / d  ==&gt;  d = 10√3 = 17.32 m</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
                <div>Big Triangle ΔPAD (tan 45° = (10 + x) / d):</div>
                <div className="text-base font-bold">1 = (10 + x) / 17.32  ==&gt;  x = 17.32 - 10 = 7.32 m</div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
                Distance d = 17.32 m  |  Flagstaff Length x = 7.32 m ✓
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Moving Car Solved Equations</span>

              <div className="p-3 bg-slate-950 rounded-lg border border-sky-500/30 text-sky-400">
                <div>Near Position (tan 60° = 60 / d₂):</div>
                <div className="text-base font-bold">√3 = 60 / d₂  ==&gt;  d₂ = 60 / √3 = 20√3 = 34.64 m</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
                <div>Far Position (tan 30° = 60 / d₁):</div>
                <div className="text-base font-bold">1/√3 = 60 / d₁  ==&gt;  d₁ = 60√3 = 103.92 m</div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
                Distance Traveled Δd = d₁ - d₂ = 40√3 = 69.28 m ✓
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 4: Observer Eye Level Height Offset ───
export function Class10TrigHeightsObserverHeightWidget() {
  const [obsH, setObsH] = useState(1.5); // observer height in meters (1.0 to 2.0m)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chimneyH = 30; // total chimney height 30m
  const triH = (chimneyH - obsH).toFixed(1); // vertical triangle leg = 30 - 1.5 = 28.5m
  const angleDeg = 45; // say angle is 45 deg
  const dist = triH; // tan 45 = 1 ==> dist = 28.5m

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono font-bold">Eye Level Offset Metaphor</span>
          <h3 className="text-xl font-bold text-white">Observer Height Adjustment (Ground vs. Eye Level)</h3>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition">
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs">
        {/* SVG Diagram */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md drop-shadow-2xl">
            {/* Ground line */}
            <line x1={20} y1={220} x2={360} y2={220} stroke="#475569" strokeWidth="3" />

            {/* Eye level horizontal line */}
            <line x1={80} y1={220 - obsH * 25} x2={300} y2={220 - obsH * 25} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />

            {/* Observer Body */}
            <line x1={80} y1={220} x2={80} y2={220 - obsH * 25} stroke="#38bdf8" strokeWidth="4" />
            <circle cx={80} cy={220 - obsH * 25} r="5" fill="#38bdf8" />
            <text x={35} y={210} fill="#38bdf8" fontSize="12" fontWeight="bold">h_obs = {obsH}m</text>

            {/* Chimney (30m total) */}
            <line x1={300} y1={220} x2={300} y2={50} stroke="#a855f7" strokeWidth="5" />
            <text x={310} y={130} fill="#a855f7" fontSize="12" fontWeight="bold">Chimney (30m)</text>

            {/* Line of sight from eye level to top */}
            <line x1={80} y1={220 - obsH * 25} x2={300} y2={50} stroke="#ef4444" strokeWidth="3" />

            <text x={180} y={220 - obsH * 25 - 8} fill="#f59e0b" fontSize="12" fontWeight="bold">Eye Level Line</text>
          </svg>

          {/* Slider */}
          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Observer Height (h_obs):</span>
              <span className="text-sky-400">{obsH} meters</span>
            </div>
            <input 
              type="range" min="1.0" max="2.0" step="0.1" value={obsH} 
              onChange={(e) => setObsH(parseFloat(e.target.value))} 
              className="w-full accent-sky-400 cursor-pointer" 
            />
          </div>
        </div>

        {/* Info & Calculation */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 block font-sans">Height Equation Offset</span>

            <div className="p-3 bg-slate-950 rounded-lg border border-purple-500/30 text-purple-400">
              <div>Total Structure Height:</div>
              <div className="text-base font-bold">30.0 meters</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-400">
              <div>Triangle Perpendicular Leg (h_tri):</div>
              <div className="text-base font-bold">30.0 - {obsH} = {triH} meters</div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400 font-bold text-center">
              Total Height = h_tri ({triH}m) + h_obs ({obsH}m) = 30m ✓
            </div>
          </div>

          <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-sky-300 font-sans space-y-1">
            <span className="font-bold text-sky-400 block">💡 Eye-Level Offset Rule:</span>
            When observer height is specified (e.g. {obsH}m tall boy), the right triangle sits ABOVE eye level! Solve for triangle leg first, then ADD observer height at the end.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WIDGET 5: Class 10 Some Applications of Trigonometry MCQ Exam ───
export function Class10TrigHeightsMCQExamWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "If a tower 15 m away from a ground point subtends an angle of elevation of 60°, what is the height of the tower?",
      options: ["A) 15 m", "B) 15√3 m", "C) 15 / √3 m", "D) 30 m"],
      correctIdx: 1,
      explanation: "tan(60°) = h / 15 ==> √3 = h / 15 ==> h = 15√3 m ≈ 25.98 m."
    },
    {
      id: 2,
      text: "The angle formed by the line of sight with the horizontal when looking DOWNWARD at an object below eye level is called:",
      options: ["A) Angle of Elevation", "B) Angle of Depression", "C) Central Angle", "D) Alternate Angle"],
      correctIdx: 1,
      explanation: "Looking downward below the horizontal line forms the Angle of Depression."
    },
    {
      id: 3,
      text: "Why is the angle of depression of an object from an observer equal to the angle of elevation of the observer from the object?",
      options: ["A) They are vertical angles", "B) They are alternate interior angles", "C) They sum to 90°", "D) They are corresponding angles"],
      correctIdx: 1,
      explanation: "Two parallel horizontal lines intersected by the line of sight form equal alternate interior angles."
    },
    {
      id: 4,
      text: "From a point P on the ground, the angle of elevation of top of a 10 m building is 30°. A flagstaff on top has angle 45°. What is the flagstaff length?",
      options: ["A) 10(√3 - 1) m", "B) 10√3 m", "C) 10 m", "D) 5√3 m"],
      correctIdx: 0,
      explanation: "d = 10√3 m. Total height = d · tan(45°) = 10√3 m. Flagstaff = 10√3 - 10 = 10(√3 - 1) m ≈ 7.32 m."
    },
    {
      id: 5,
      text: "A 1.5 m tall boy looks at a 30 m tall chimney. If his eye level forms an angle of elevation of 45°, what is his distance from the chimney?",
      options: ["A) 30 m", "B) 28.5 m", "C) 31.5 m", "D) 15 m"],
      correctIdx: 1,
      explanation: "Triangle vertical leg = 30 - 1.5 = 28.5 m. tan(45°) = 28.5 / d ==> 1 = 28.5 / d ==> d = 28.5 m."
    },
    {
      id: 6,
      text: "Which trigonometric ratio is most commonly used (in over 85% of board exam problems) for Heights and Distances?",
      options: ["A) sin θ", "B) cos θ", "C) tan θ", "D) sec θ"],
      correctIdx: 2,
      explanation: "tan θ = Opposite / Adjacent = Height / Distance is the primary ratio used."
    },
    {
      id: 7,
      text: "If the length of the shadow of a tower is equal to its height, what is the angle of elevation of the Sun?",
      options: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"],
      correctIdx: 1,
      explanation: "tan θ = Height / Shadow = h / h = 1 ==> θ = 45°."
    },
    {
      id: 8,
      text: "A tree breaks due to a storm and the broken top touches the ground at an angle of 30° at a distance of 8 m from foot. Find original tree height.",
      options: ["A) 8√3 m", "B) 16 / √3 m", "C) 24 m", "D) 8 m"],
      correctIdx: 0,
      explanation: "Standing part = 8 tan 30° = 8/√3. Broken part = 8 / cos 30° = 16/√3. Total = 24/√3 = 8√3 m."
    },
    {
      id: 9,
      text: "The shadow of a tower standing on a level ground is found to be 40 m longer when the Sun's altitude is 30° than when it is 60°. Find tower height.",
      options: ["A) 20√3 m", "B) 40√3 m", "C) 20 m", "D) 60 m"],
      correctIdx: 0,
      explanation: "h = 40 / (cot 30° - cot 60°) = 40 / (√3 - 1/√3) = 40 / (2/√3) = 20√3 m."
    },
    {
      id: 10,
      text: "An observer 1.732 m tall looks at a statue. If tan θ = 1/√3 and distance is 10 m, what is the height of triangle leg above eye level?",
      options: ["A) 5.77 m", "B) 10 m", "C) 17.32 m", "D) 8.66 m"],
      correctIdx: 0,
      explanation: "1/√3 = h_tri / 10 ==> h_tri = 10 / √3 = 10 / 1.732 ≈ 5.77 m."
    }
  ];

  const passingThreshold = 80;
  const passScore = Math.ceil((questions.length * passingThreshold) / 100);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsAnswered(false);
    setIsSubmitted(false);
  };

  const currentQ = questions[currentIdx];
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= passingThreshold;

  return (
    <div className={`w-full flex flex-col p-5 bg-slate-900 text-slate-100 font-sans border border-slate-800 ${isFullscreen ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24 overflow-y-auto' : 'rounded-2xl shadow-2xl h-full'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block font-mono">Class 10 Exam</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Class 10 Heights & Distances Qualification (80% Pass Mark)</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Score at least {passingThreshold}% ({passScore}/{questions.length}) to earn your Heights & Distances badge!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold text-xs rounded-xl">
            Score: {score} / {questions.length}
          </span>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all">
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {!isSubmitted ? (
        <>
          <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-500 to-sky-500 h-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-sans">
              <span className="text-amber-400 font-bold text-xs">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-slate-400 text-xs">Required: 80%+</span>
            </div>

            <h3 className="text-base font-bold text-white font-sans leading-relaxed">{currentQ.text}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800';
                if (isAnswered) {
                  if (idx === currentQ.correctIdx) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold shadow-lg';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                  } else {
                    btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-xl border text-left font-sans text-xs transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-sans">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <span>💡 Step-by-Step Solution:</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{currentQ.explanation}</p>
                <div className="pt-2 flex justify-end">
                  <button onClick={handleNextQuestion} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg">
                    {currentIdx < questions.length - 1 ? 'Next Question →' : 'Submit & Check Result'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 ${isPassed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
            <span className="text-4xl">{isPassed ? '🎓' : '⚠️'}</span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{isPassed ? 'Congratulations! Heights & Distances Mastered!' : 'Passing Requirement Not Met'}</h3>
            <p className="text-slate-300 text-sm">
              Your Score: <strong className="text-amber-400">{score} / {questions.length}</strong> ({percentage}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">Passing criteria requires at least 80% ({passScore} correct answers).</p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {isPassed ? (
              <span className="text-emerald-400 font-semibold">🎉 You have successfully qualified Class 10 Some Applications of Trigonometry!</span>
            ) : (
              <span className="text-rose-400 font-semibold">Keep practicing! Review right triangle setups and retake the exam to earn your 80% completion badge.</span>
            )}
          </div>

          <button onClick={handleRestart} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl">
            Retake Qualification Exam 🔄
          </button>
        </div>
      )}
    </div>
  );
}
