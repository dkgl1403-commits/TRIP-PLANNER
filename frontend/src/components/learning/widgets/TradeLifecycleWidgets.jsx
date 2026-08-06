import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Trade Lifecycle Chapter 1: Standard Market Terminology Widget ───────────
export function TradeLifecycleRoadmapWidget() {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'dual'
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Dual-Engine Animation Player State
  const [dualStepIdx, setDualStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 6 Standard Market Stages of the Trade Lifecycle
  const roadmapStages = [
    {
      id: 's1',
      number: 1,
      title: '1. Pre-Trade Preparation & Trade Initiation',
      office: 'Front Office (Buy-Side)',
      actor: 'Portfolio Manager (PM) & Execution Desk',
      systems: 'Order Management System (OMS)',
      protocol: 'Internal FIX / Compliance & Credit Engine',
      color: '#3b82f6',
      icon: '💡',
      summary: 'Pre-trade credit limit checks, compliance validation, and trade initiation. The Portfolio Manager (PM) decides to buy 100,000 shares of Apple (AAPL) for a fund. The OMS checks portfolio compliance, liquidity limits, and cash availability before generating the order.',
      details: {
        inputs: 'Investment Thesis, Client Mandate, Credit Limits & Cash Balance',
        outputs: 'Approved Order Ticket in OMS',
        keyRisk: 'Pre-trade compliance breach, credit limit overload, or fat-finger order entry errors.'
      }
    },
    {
      id: 's2',
      number: 2,
      title: '2. Trade Execution & Trade Capture',
      office: 'Front Office (Executing Desk & Venue)',
      actor: 'Execution Trader / Market Maker',
      systems: 'Execution Management System (EMS), CLOB, FIX Router',
      protocol: 'FIX Protocol (Tag 35=D New Order Single, Tag 35=8 Execution Report)',
      color: '#10b981',
      icon: '⚡',
      summary: 'The order is submitted via FIX protocol to an exchange (NYSE/NASDAQ) or dark pool. The exchange matching engine matches buyer and seller orders. Trade Capture logs the execution details (price, time, quantity, counterparty) into the trading system.',
      details: {
        inputs: 'FIX 35=D (New Order Single), Order Type, Limit Price',
        outputs: 'FIX 35=8 (Execution Report / Fill Confirmation)',
        keyRisk: 'Execution latency, slippage, and incomplete trade capture logs.'
      }
    },
    {
      id: 's3',
      number: 3,
      title: '3. Trade Enrichment, Confirmation & Affirmation',
      office: 'Middle Office (Buy-Side & Sell-Side)',
      actor: 'Middle Office Trade Support Analyst',
      systems: 'DTCC CTM (Central Trade Matching), OASYS, Omgeo',
      protocol: 'Electronic Trade Confirmation (ETC) & DTCC ALERT (SSI)',
      color: '#f59e0b',
      icon: '🤝',
      summary: 'Trade Enrichment attaches Standing Settlement Instructions (SSIs), custodian details, and ISIN/CUSIP codes to the trade record. Middle office teams verify trade details with counterparties via DTCC CTM for Electronic Trade Confirmation (ETC) and Affirmation.',
      details: {
        inputs: 'Block Execution Fill + Sub-Account Allocation Instructions + SSI Data',
        outputs: 'Affirmed Trade Status in DTCC CTM',
        keyRisk: 'Allocation breakdown mismatches, incorrect SSIs, or late affirmation resulting in settlement fails.'
      }
    },
    {
      id: 's4',
      number: 4,
      title: '4. Clearing & CCP Novation',
      office: 'Clearing House (Central Counterparty - CCP)',
      actor: 'CCP Risk Manager / Clearing Member Bank',
      systems: 'CCP Clearing Engine (NSCC / LCH / Eurex)',
      protocol: 'Real-Time Clearing API & ISO 20022 Margin Calls',
      color: '#8b5cf6',
      icon: '🛡️',
      summary: 'Clearing verifies trade details, calculates gross/net obligations, and prepares trades for settlement. The Central Counterparty (CCP) steps in through Novation — replacing the original contract to become Buyer to every Seller and Seller to every Buyer, calling Initial and Variation Margin.',
      details: {
        inputs: 'Affirmed Matched Trade Data from CTM / Exchange',
        outputs: 'Novated Net Settlement Obligation + Daily Margin Calls',
        keyRisk: 'Counterparty default during volatile market swings between trade date and settlement date.'
      }
    },
    {
      id: 's5',
      number: 5,
      title: '5. Custodian Instructions & Matching',
      office: 'Back Office (Global & Local Custodians)',
      actor: 'Settlement Operations Analyst',
      systems: 'Core Settlement Engine (TCS BaNCS / Broadridge)',
      protocol: 'SWIFT ISO 15022 (MT541 RVP / MT543 DVP / MT548 Status Advice)',
      color: '#ec4899',
      icon: '📨',
      summary: 'Custodian banks receive settlement instructions to safeguard assets and prepare funds transfer. Buyer Custodian sends MT541 (Receive Against Payment - RVP); Seller Custodian sends MT543 (Deliver Against Payment - DVP). The CSD matches instructions and issues MT548 Matched status.',
      details: {
        inputs: 'Internal Settled Trade Ticket + DTCC ALERT SSI Master Data',
        outputs: 'SWIFT MT541 / MT543 Outbound Stream -> MT548 Matched Advice',
        keyRisk: 'Unmatched settlement instructions at CSD due to SSI discrepancies or missing cash/stock.'
      }
    },
    {
      id: 's6',
      number: 6,
      title: '6. Settlement (DvP) & Post-Trade Reconciliation',
      office: 'Central Securities Depository (CSD) & Back Office',
      actor: 'Depository Clearing Agent & Reconciliation Specialist',
      systems: 'CSD Core Settlement System (DTCC / Euroclear / Clearstream)',
      protocol: 'Delivery vs Payment (DvP) & SWIFT MT566 / MT545 / MT547',
      color: '#06b6d4',
      icon: '🔒',
      summary: 'The final, irrevocable transfer of securities and cash between buyer and seller (Delivery vs Payment - DvP). Legal title of ownership transfers at the CSD. Post-trade management completes Nostro/Vostro cash reconciliation, position updates, and regulatory reporting.',
      details: {
        inputs: 'Matched MT541/MT543 Instructions + Central Bank Cash Cover',
        outputs: 'Final Irrevocable Stock & Cash Posting + Nostro/Vostro Reconciliation Log',
        keyRisk: 'Lack of stock inventory (short settlement fail), cash shortfall, or Nostro cash breaks.'
      }
    }
  ];

  // Stage 2: Dual-Sided Symmetrical Engine Stages (Standard Market Flow)
  const dualStages = [
    {
      step: 1,
      name: 'Stage 1: Pre-Trade & Trade Initiation / Execution',
      buyer: { title: 'Buy-Side Fund A (Buyer)', action: 'PM generates Buy Order for 10,000 AAPL @ $200. OMS routes FIX 35=D to Exchange.', status: 'FIX Sent (35=D)' },
      seller: { title: 'Hedge Fund B (Seller)', action: 'Execution Trader submits Sell Order for 10,000 AAPL @ $200. OMS routes FIX 35=D to Exchange.', status: 'FIX Sent (35=D)' },
      middle: 'Exchange Matching Engine matches Buy & Sell orders @ $200. Emits FIX 35=8 Execution Reports to both parties for Trade Capture.'
    },
    {
      step: 2,
      name: 'Stage 2: Trade Enrichment, Confirmation & Affirmation',
      buyer: { title: 'Buyer Middle Office', action: 'Enriches trade with SSIs and submits 10,000 share allocation breakdown into DTCC CTM.', status: 'CTM Allocated' },
      seller: { title: 'Seller Middle Office', action: 'Enriches trade with custodian SSIs and submits confirmation details into DTCC CTM.', status: 'CTM Confirmed' },
      middle: 'DTCC CTM compares trade economics & allocations. Status updates to AFFIRMED & MATCHED.'
    },
    {
      step: 3,
      name: 'Stage 3: Clearing & CCP Novation',
      buyer: { title: 'Buyer Clearing Member Bank', action: 'Pledges Initial Margin to CCP. Contract novated: CCP becomes Seller to Buyer A.', status: 'Novated & Margined' },
      seller: { title: 'Seller Clearing Member Bank', action: 'Pledges collateral to CCP. Contract novated: CCP becomes Buyer to Seller B.', status: 'Novated & Margined' },
      middle: 'CCP Novation Shield replaces bilateral contract with two central contracts, guaranteeing performance.'
    },
    {
      step: 4,
      name: 'Stage 4: Custodian Settlement Instructions',
      buyer: { title: 'Custodian Bank A (Buyer)', action: 'Dispatches SWIFT MT541 (Receive Against Payment - RVP) to CSD specifying SSI details.', status: 'MT541 Outbound' },
      seller: { title: 'Custodian Bank B (Seller)', action: 'Dispatches SWIFT MT543 (Deliver Against Payment - DVP) to CSD specifying stock line.', status: 'MT543 Outbound' },
      middle: 'CSD settlement engine matches MT541 & MT543 instructions. Emits SWIFT MT548 MATCHED advice.'
    },
    {
      step: 5,
      name: 'Stage 5: Final Settlement (DvP) & Post-Trade Reconciliation',
      buyer: { title: 'Custodian A Account', action: '$2,000,000 cash debited; 10,000 AAPL shares credited to client ledger. Post-trade reconciliation clean!', status: 'DvP Settled (MT545)' },
      seller: { title: 'Custodian B Account', action: '10,000 AAPL shares debited; $2,000,000 cash credited to Nostro account. Trade complete!', status: 'DvP Settled (MT547)' },
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
      <p className="text-slate-400 text-sm text-center mb-6">Deconstruct the end-to-end industry standard stages of a securities trade</p>

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
          <span>🔄 Dual-Sided Trade Lifecycle Engine</span>
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
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">Stage {stg.number}</span>
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
                  <span className="text-slate-400">Participants / Desk:</span>
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
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Market Infrastructure & Systems</span>
                <span className="text-blue-300 font-bold">{activeStage.systems}</span>
                <span className="text-[10px] text-slate-400 block font-sans border-t border-slate-800 pt-1 mt-1">Protocol: {activeStage.protocol}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Input / Output Artifacts</span>
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
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] font-mono block">Symmetrical Market Flow Simulator</span>
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

          {/* Central Infrastructure Convergence Card */}
          <div className="bg-slate-950 border-2 border-purple-500/60 p-5 rounded-xl space-y-2 shadow-2xl text-center font-mono">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block font-sans">Central Infrastructure Handoff & Novation Shield</span>
            <p className="text-xs text-purple-200 leading-relaxed">{activeDualStage.middle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
