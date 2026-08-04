import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ERAS = [
  {
    id: 'voc',
    year: 1602,
    title: 'The VOC & First Dividend',
    description: 'The Dutch East India Company (VOC) issued shares and the first dividend (paid in-kind: mace and pepper).',
    infrastructure: 'Physical shares, paper ledgers, in-kind compensation.',
    event: 'The First Dividend (1610)'
  },
  {
    id: 'paper',
    year: 1970,
    title: 'The Paper Era & Dematerialization',
    description: 'Central Securities Depositories (CSDs) like DTCC and Euroclear emerged, transitioning from physical certificates to electronic book-entries.',
    infrastructure: 'Establishment of DTCC (1973), Mainframe Ledgers.',
    event: 'Transition from physical coupons to electronic records.'
  },
  {
    id: 'swift',
    year: 1990,
    title: 'The SWIFT Era (ISO 15022)',
    description: 'Global standardisation of corporate action messaging (MT564) allowed automated parsing of events worldwide.',
    infrastructure: 'SWIFT Network, ISO 15022 (MT Messages).',
    event: 'Standardised global communication (e.g. :22F::CAEV//DVCA).'
  },
  {
    id: 'modern',
    year: 2024,
    title: 'Modern Era (ISO 20022 & T+1)',
    description: 'Transition to richer XML-based messaging (ISO 20022) and compressed settlement cycles (T+1, T+0) demanding near real-time STP.',
    infrastructure: 'ISO 20022 (XML), Blockchain/DLT pilots, T+1 Settlement.',
    event: 'Transition to T+1 settlement (US Markets 2024).'
  }
];

export function CorporateActionsTimelineWidget() {
  const [eraIndex, setEraIndex] = useState(0);
  const [detailLevel, setDetailLevel] = useState('event'); // 'event' or 'infrastructure'

  const currentEra = ERAS[eraIndex];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-900 text-white rounded-xl font-sans">
      
      {/* Controls */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Era Slider */}
        <div className="flex-1 w-full relative pt-6 pb-2">
          <input 
            type="range" 
            min={0} 
            max={ERAS.length - 1} 
            value={eraIndex} 
            onChange={(e) => setEraIndex(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
            {ERAS.map((era, i) => (
              <div 
                key={era.id} 
                className={`cursor-pointer transition-colors ${i === eraIndex ? 'text-blue-400 font-bold' : 'hover:text-slate-300'}`}
                onClick={() => setEraIndex(i)}
              >
                {era.year}
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Details */}
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${detailLevel === 'event' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setDetailLevel('event')}
          >
            Market Event
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${detailLevel === 'infrastructure' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setDetailLevel('infrastructure')}
          >
            Infrastructure
          </button>
        </div>

      </div>

      {/* Main Display Area */}
      <div className="relative w-full max-w-4xl min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentEra.id}-${detailLevel}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden"
          >
            
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="text-9xl font-black italic">{currentEra.year}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2 relative z-10">
              {currentEra.title}
            </h3>
            
            <p className="text-slate-300 text-lg mb-8 max-w-2xl relative z-10 leading-relaxed">
              {currentEra.description}
            </p>

            <div className="mt-6 border-t border-slate-700 pt-6 relative z-10">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                {detailLevel === 'event' ? (
                  <><span className="w-2 h-2 rounded-full bg-blue-500"></span> Key Market Event</>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Technical Plumbing</>
                )}
              </h4>
              <p className={`text-xl font-medium ${detailLevel === 'event' ? 'text-blue-300' : 'text-indigo-300'}`}>
                {detailLevel === 'event' ? currentEra.event : currentEra.infrastructure}
              </p>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
