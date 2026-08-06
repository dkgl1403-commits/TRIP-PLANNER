import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Trade Lifecycle Chapter 1: The Interactive Roadmaps Widget ───────────────
export function TradeLifecycleRoadmapWidget() {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'dual'
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Dual-Engine Animation Player State
  const [dualStepIdx, setDualStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stage 1: Macro Roadmap Data (6 Stages)
  const roadmapStages = [
    {
      id: 's1',
      number: 1,
      title: '1. Order Generation & Decision',
      office: 'Front Office (Buy-Side)',
      actor: 'Portfolio Manager (PM)',
      systems: 'Order Management System (OMS)',
      protocol: 'Internal FIX / Proprietary OMS API',
      color: '#3b82f6',
      icon: '💡',
      summary: 'The Portfolio Manager decides to buy 100,000 shares of Apple (AAPL) for a fund. The OMS checks portfolio compliance, liquidity limits, and cash availability before creating the order ticket.',
      details: {
        inputs: 'Investment Thesis, Cash Balance, Risk & Compliance Rules',
        outputs: 'Approved Order Ticket in OMS',
        keyRisk: 'Fat-finger order entry errors or buying securities violating fund ESG/concentration limits.'
      }
    },
    {
      id: 's2',
      number: 2,
      title: '2. Order Execution & Matching Engine',
      office: 'Front Office (Executing Desk & Venue)',
      actor: 'Execution Trader / Market Maker',
      systems: 'Execution Management System (EMS), CLOB, FIX Router',
      protocol: 'FIX 4.2 / 4.4 Protocol (Tag 35=D New Order Single, 35=8 Execution Report)',
      color: '#10b981',
      icon: '⚡',
      summary: 'The Execution Trader routes the order to lit exchanges (NYSE/NASDAQ) or dark pools via TWAP/VWAP algorithms. The exchange matching engine matches buyer and seller orders in milliseconds.',
      details: {
        inputs: 'FIX 35=D (New Order Single), Limit Price, Order Type',
        outputs: 'FIX 35=8 (Execution Report / Fill Confirmation)',
        keyRisk: 'Market impact (slippage) and execution latency in volatile markets.'
      }
    },
    {
      id: 's3',
      number: 3,
      title: '3. Allocation & Central Trade Matching',
      office: 'Middle Office (Buy-Side & Sell-Side)',
      actor: 'Middle Office Trade Support Analyst',
      systems: 'DTCC CTM (Central Trade Matching), OASYS, Omgeo',
      protocol: 'Electronic Trade Confirmation (ETC) & SWIFT MT515',
      color: '#f59e0b',
      icon: '🤝',
      summary: 'The 100,000 share block trade execution is sliced into 50 underlying client sub-accounts. The broker and buy-side middle office submit trade details to DTCC CTM for electronic matching and Affirmation.',
      details: {
        inputs: 'Block Execution Fill + Sub-Account Allocation Instructions',
        outputs: 'Affirmed Trade Status in DTCC CTM',
        keyRisk: 'Allocation mismatches or late affirmation causing trade settlement fails.'
      }
    },
    {
      id: 's4',
      number: 4,
      title: '4. Clearing, Novation & Risk Shield',
      office: 'Clearing House (Central Counterparty)',
      actor: 'CCP Risk Manager / Clearing Member Bank',
      systems: 'CCP Clearing Engine (NSCC / LCH / Eurex)',
      protocol: 'Real-Time Clearing API & ISO 20022 Margin Calls',
      color: '#8b5cf6',
      icon: '🛡️',
      summary: 'The CCP steps in between buyer and seller through Novation — becoming the legal Buyer to every Seller and Seller to every Buyer. The CCP calls Initial/Variation Margin to guarantee trade performance.',
      details: {
        inputs: 'Affirmed Matched Trade Data from CTM / Exchange',
        outputs: 'Novated Net Settlement Obligation + Daily Margin Calls',
        keyRisk: 'Counterparty default during volatile market swings between trade date and settlement.'
      }
    },
    {
      id: 's5',
      number: 5,
      title: '5. Custodian SWIFT Settlement Instructions',
      office: 'Back Office (Global & Local Custodians)',
      actor: 'Settlement Operations Analyst',
      systems: 'Core Settlement Engine (TCS BaNCS / Broadridge)',
      protocol: 'SWIFT ISO 15022 (MT541 RVP / MT543 DVP / MT548 Status)',
      color: '#ec4899',
      icon: '📨',
      summary: 'Buyer Custodian sends MT541 (Receive Against Payment - RVP); Seller Custodian sends MT543 (Deliver Against Payment - DVP). The CSD matches standing settlement instructions (SSIs).',
      details: {
        inputs: 'Internal Settled Trade Ticket + DTCC ALERT SSI Master Data',
        outputs: 'SWIFT MT541 / MT543 Outbound Stream -> MT548 Matched Advice',
        keyRisk: 'Mismatched Standing Settlement Instructions (SSIs) causing instant settlement fails.'
      }
    },
    {
      id: 's6',
      number: 6,
      title: '6. CSD Settlement & Account Posting',
      office: 'Central Securities Depository (CSD)',
      actor: 'Depository Clearing Agent / Settlement Agent',
      systems: 'CSD Core Settlement System (DTCC / Euroclear / Clearstream)',
      protocol: 'Delivery vs Payment (DvP) Lock & SWIFT MT566 / MT545',
      color: '#06b6d4',
      icon: '🔒',
      summary: 'On Settlement Date (T+1), the CSD executes simultaneous Delivery vs Payment (DvP) — locking shares and transferring cash via Clearing Bank accounts. Legal title is updated in the central register.',
      details: {
        inputs: 'Matched MT541/MT543 Instructions + Central Bank Cash Cover',
        outputs: 'Final Irrevocable Stock & Cash Posting (MT545/MT547 Confirmation)',
        keyRisk: 'Lack of stock inventory (short settlement fail) or cash shortfall.'
      }
    }
  ];

  // Stage 2: Dual-Sided Symmetrical Engine Stages
  const dualStages = [
    {
      step: 1,
      name: 'Stage 1: Trade Conception & Execution',
      buyer: { title: 'Buy-Side Fund A (Buyer)', action: 'PM generates Buy Order for 10,000 AAPL @ $200. OMS routes FIX 35=D to Exchange.', status: 'FIX Sent (35=D)' },
      seller: { title: 'Hedge Fund B (Seller)', action: 'Execution Trader submits Sell Order for 10,000 AAPL @ $200. OMS routes FIX 35=D to Exchange.', status: 'FIX Sent (35=D)' },
      middle: 'Exchange CLOB Matching Engine matches Buy & Sell orders @ $200. Emits FIX 35=8 Execution Reports to both parties.'
    },
    {
      step: 2,
      name: 'Stage 2: Middle Office Allocation & CTM Match',
      buyer: { title: 'Buyer Middle Office', action: 'Submits 10,000 share allocation breakdown across 4 client sub-accounts into DTCC CTM.', status: 'CTM Allocated' },
      seller: { title: 'Seller Middle Office', action: 'Submits trade confirmation details into DTCC CTM for Electronic Trade Confirmation.', status: 'CTM Submitted' },
      middle: 'DTCC CTM compares trade economics & allocations. Status updates to AFFIRMED & MATCHED.'
    },
    {
      step: 3,
      name: 'Stage 3: CCP Novation & Multilateral Netting',
      buyer: { title: 'Buyer Clearing Member Bank', action: 'Pledges $200,000 Initial Margin to CCP. Contract novated: CCP becomes Seller to Buyer A.', status: 'Novated & Margined' },
      seller: { title: 'Seller Clearing Member Bank', action: 'Pledges securities collateral to CCP. Contract novated: CCP becomes Buyer to Seller B.', status: 'Novated & Margined' },
      middle: 'CCP Novation Shield cancels original bilateral contract. CCP guarantees completion against default.'
    },
    {
      step: 4,
      name: 'Stage 4: Custodian SWIFT Instruction Dispatch',
      buyer: { title: 'Custodian Bank A (Buyer)', action: 'Dispatches SWIFT MT541 (Receive Against Payment - RVP) to CSD specifying SSI details.', status: 'MT541 Outbound' },
      seller: { title: 'Custodian Bank B (Seller)', action: 'Dispatches SWIFT MT543 (Deliver Against Payment - DVP) to CSD specifying stock line.', status: 'MT543 Outbound' },
      middle: 'CSD settlement engine matches MT541 & MT543 instructions. Emits SWIFT MT548 MATCHED advice.'
    },
    {
      step: 5,
      name: 'Stage 5: Final DvP Settlement at Depository',
      buyer: { title: 'Custodian A Account', action: '$2,000,000 cash debited; 10,000 AAPL shares credited to client Vostro ledger. Settlement complete!', status: 'DvP Settled (MT545)' },
      seller: { title: 'Custodian B Account', action: '10,000 AAPL shares debited; $2,000,000 cash credited to Nostro account. Trade closed!', status: 'DvP Settled (MT547)' },
      middle: 'CSD simultaneously transfers legal title of 10,000 shares and sweeps $2,000,000 via Central Bank cash ledger. Finality achieved!'
    }
  ];

  // Auto-play timer for Dual-Engine tab
  useEffect(() => {
    let timer;
    if (isPlaying && activeTab === 'dual') {
      timer = setInterval(() => {
        setDualStepIdx((prev) => {
          if (prev < dualStages.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTab]);

  const activeStage = roadmapStages[activeStepIdx];
  const activeDualStage = dualStages[dualStepIdx];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Trade Lifecycle Macro Roadmap</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Deconstruct the complete front-to-back office lifespan of a security trade</p>

      {/* Main Mode Navigation Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>🗺️ End-to-End Trade Lifecycle Flow</span>
        </button>
        <button
          onClick={() => setActiveTab('dual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dual' ? 'bg-indigo-600 text-white shadow-lg scale-[1.02]' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>🔄 The Dual-Sided Symmetrical Trade Engine</span>
        </button>
      </div>

      {activeTab === 'roadmap' ? (
        <div className="space-y-6">
          {/* Stepper Header Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {roadmapStages.map((stg, idx) => (
              <button
                key={stg.id}
                onClick={() => setActiveStepIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeStepIdx === idx
                    ? 'bg-slate-800 border-2 shadow-lg scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
                style={{ borderColor: activeStepIdx === idx ? stg.color : undefined }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg">{stg.icon}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">Step {stg.number}</span>
                </div>
                <span className="text-xs font-bold text-white leading-tight truncate">{stg.title.split('.')[1]}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Inspection Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeStage.icon}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">{activeStage.title}</h3>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                  <span className="text-slate-400">Desk / Actor:</span>
                  <span className="text-amber-400 font-bold">{activeStage.actor} ({activeStage.office})</span>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full font-bold self-start sm:self-center" style={{ backgroundColor: activeStage.color + '25', color: activeStage.color, border: `1px solid ${activeStage.color}50` }}>
                {activeStage.office}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
              {activeStage.summary}
            </p>

            {/* Technical Inputs & Outputs Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Systems & Software Used</span>
                <span className="text-blue-300 font-bold">{activeStage.systems}</span>
                <span className="text-[10px] text-slate-400 block font-sans border-t border-slate-800 pt-1 mt-1">Protocol: {activeStage.protocol}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Input / Output Messages</span>
                <span className="text-emerald-300 font-bold">{activeStage.details.outputs}</span>
                <span className="text-[10px] text-slate-400 block font-sans border-t border-slate-800 pt-1 mt-1">Inputs: {activeStage.details.inputs}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-red-900/50 space-y-1">
                <span className="text-[10px] text-red-400 font-sans font-bold uppercase block">⚠️ Primary Operational Risk</span>
                <p className="text-red-200 text-[11px] font-sans leading-relaxed">{activeStage.details.keyRisk}</p>
              </div>
            </div>

            {/* Navigation Stepper Controls */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                disabled={activeStepIdx === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-lg text-xs font-bold transition-all"
              >
                ← Previous Stage
              </button>

              <span className="text-xs font-mono text-slate-400 font-bold">Stage {activeStepIdx + 1} of {roadmapStages.length}</span>

              <button
                onClick={() => setActiveStepIdx(prev => Math.min(roadmapStages.length - 1, prev + 1))}
                disabled={activeStepIdx === roadmapStages.length - 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 rounded-lg text-xs font-bold transition-all shadow"
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar for Dual Engine */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] font-mono block">Symmetrical Market Simulator</span>
              <h3 className="text-sm font-bold text-white">{activeDualStage.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                  isPlaying ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white shadow-md'
                }`}
              >
                <span>{isPlaying ? '⏸️ Pause Auto Play' : '▶️ Auto-Play Lifecycle'}</span>
              </button>

              <button
                onClick={() => setDualStepIdx((prev) => (prev < dualStages.length - 1 ? prev + 1 : 0))}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition-all font-mono"
              >
                Step {dualStepIdx + 1}/{dualStages.length} →
              </button>
            </div>
          </div>

          {/* Symmetrical Dual-Sided Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BUYER SIDE */}
            <div className="bg-slate-800 border-2 border-blue-500/50 p-5 rounded-xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <h4 className="text-sm font-bold text-white">{activeDualStage.buyer.title}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                  {activeDualStage.buyer.status}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeDualStage.buyer.action}</p>
            </div>

            {/* SELLER SIDE */}
            <div className="bg-slate-800 border-2 border-amber-500/50 p-5 rounded-xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <h4 className="text-sm font-bold text-white">{activeDualStage.seller.title}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  {activeDualStage.seller.status}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeDualStage.seller.action}</p>
            </div>
          </div>

          {/* Central Counterparty (CCP) & CSD Infrastructure Convergence Card */}
          <div className="bg-slate-950 border-2 border-purple-500/60 p-5 rounded-xl space-y-2 shadow-2xl text-center font-mono">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block font-sans">Central Infrastructure Handoff & Novation Shield</span>
            <p className="text-xs text-purple-200 leading-relaxed">{activeDualStage.middle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
