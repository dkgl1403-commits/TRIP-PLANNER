import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Trade Lifecycle Chapter 1: Standard Market Terminology & Symmetrical Engine ───
export function TradeLifecycleRoadmapWidget() {
  const [activeTab, setActiveTab] = useState('dual'); // Default to 'dual' engine visualizer
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dual-Engine Interactive Simulation State
  const [simStep, setSimStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeNodes, setActiveNodes] = useState([]);
  const [activePaths, setActivePaths] = useState([]);
  const [particles, setParticles] = useState([]);

  const containerRef = useRef(null);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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
      summary: 'The order is submitted via FIX protocol to an exchange (NYSE/NASDAQ) or dark pool. The exchange matching engine matches buyer and seller orders. Trade Capture logs execution details into the trading system.',
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
      summary: 'Trade Enrichment attaches Standing Settlement Instructions (SSIs), custodian details, and ISIN/CUSIP codes. Middle office teams verify trade details with counterparties via DTCC CTM for Electronic Trade Confirmation (ETC) and Affirmation.',
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
      summary: 'The final, irrevocable transfer of securities and cash between buyer and seller (Delivery vs Payment - DvP). Legal title of ownership transfers at the CSD. Post-trade management executes Nostro/Vostro cash ledger reconciliations and regulatory reporting.',
      details: {
        inputs: 'Matched MT541/MT543 Instructions + Central Bank Cash Cover',
        outputs: 'Final Irrevocable Stock & Cash Posting + Nostro/Vostro Reconciliation Log',
        keyRisk: 'Lack of stock inventory (short settlement fail), cash shortfall, or Nostro cash breaks.'
      }
    }
  ];

  // All 14 Market Participant Nodes in Symmetrical Layout
  const nodes = [
    // BUYER SIDE (Left Column)
    { id: 'buyPm', label: 'Buyer PM', sub: 'OMS / Alpha', icon: '💼', x: 15, y: 12, side: 'buyer' },
    { id: 'buyExec', label: 'Exec Broker', sub: 'Smart Routing', icon: '📡', x: 30, y: 28, side: 'buyer' },
    { id: 'buyClear', label: 'Clear Broker', sub: 'Margin / Novation', icon: '🏦', x: 30, y: 62, side: 'buyer' },
    { id: 'buyBank', label: 'Buyer Clear Bank', sub: 'Cash Conduit', icon: '💵', x: 35, y: 80, side: 'buyer' },
    { id: 'buyCust', label: 'Buyer Custodian', sub: 'Asset Holder', icon: '🛡️', x: 15, y: 88, side: 'buyer' },

    // CENTRAL INFRASTRUCTURE (Middle Column)
    { id: 'exchange', label: 'The Venue', sub: 'CLOB Match Engine', icon: '🏛️', x: 50, y: 28, side: 'central' },
    { id: 'ctm', label: 'CTM Utility', sub: 'Affirmation', icon: '⚙️', x: 50, y: 45, side: 'central' },
    { id: 'ccp', label: 'CCP', sub: 'Novation & Netting', icon: '⚖️', x: 50, y: 62, side: 'central' },
    { id: 'csd', label: 'Depository (CSD)', sub: 'DvP Settlement', icon: '🗄️', x: 50, y: 88, side: 'central' },

    // SELLER SIDE (Right Column)
    { id: 'sellPm', label: 'Seller PM', sub: 'OMS / Alpha', icon: '💼', x: 85, y: 12, side: 'seller' },
    { id: 'sellExec', label: 'Exec Broker', sub: 'Smart Routing', icon: '📡', x: 70, y: 28, side: 'seller' },
    { id: 'sellClear', label: 'Clear Broker', sub: 'Margin / Novation', icon: '🏦', x: 70, y: 62, side: 'seller' },
    { id: 'sellBank', label: 'Seller Clear Bank', sub: 'Cash Conduit', icon: '💵', x: 65, y: 80, side: 'seller' },
    { id: 'sellCust', label: 'Seller Custodian', sub: 'Asset Holder', icon: '🛡️', x: 85, y: 88, side: 'seller' }
  ];

  // Node Connections for SVG Bezier Lines
  const connections = [
    ['buyPm', 'buyExec'], ['sellPm', 'sellExec'],
    ['buyExec', 'exchange'], ['sellExec', 'exchange'],
    ['exchange', 'ctm'],
    ['buyPm', 'ctm'], ['sellPm', 'ctm'],
    ['ctm', 'ccp'],
    ['ccp', 'buyClear'], ['ccp', 'sellClear'],
    ['buyClear', 'buyCust'], ['buyClear', 'buyBank'],
    ['sellClear', 'sellCust'], ['sellClear', 'sellBank'],
    ['buyBank', 'csd'], ['sellBank', 'csd'], ['sellCust', 'csd'], ['buyCust', 'csd']
  ];

  // Simulation Narratives
  const simSteps = [
    {
      badge: 'Step 1: Front Office',
      badgeClass: 'bg-blue-900 text-blue-300 border-blue-700',
      title: 'Front Office: Order Generation & FIX Routing',
      desc: 'Portfolio Managers send intent to Executing Brokers via OMS. Order routing engine dispatches <span class="text-amber-400 font-bold font-mono">FIX Protocol 35=D</span> (New Order Single).',
      nextBtn: 'Next Step: Execution'
    },
    {
      badge: 'Step 2: Execution',
      badgeClass: 'bg-indigo-900 text-indigo-300 border-indigo-700',
      title: 'The Venue: CLOB Matching & Trade Capture',
      desc: 'Executing Brokers route FIX orders into the Exchange Central Limit Order Book (CLOB). Price/time priority matches buyer and seller @ $200. FIX <span class="text-emerald-400 font-bold font-mono">35=8 Execution Reports</span> are logged.',
      nextBtn: 'Next Step: Middle Office'
    },
    {
      badge: 'Step 3: Middle Office',
      badgeClass: 'bg-purple-900 text-purple-300 border-purple-700',
      title: 'Middle Office: Trade Enrichment & CTM Affirmation',
      desc: 'The block trade execution drops into DTCC CTM matching utility. PMs send sub-account allocations and SSIs. Once economics match, status updates to <span class="text-emerald-400 font-bold">AFFIRMED</span>.',
      nextBtn: 'Next Step: CCP Clearing'
    },
    {
      badge: 'Step 4: CCP Clearing',
      badgeClass: 'bg-orange-900 text-orange-300 border-orange-700',
      title: 'Clearing: Contract Novation & Margin Calls',
      desc: 'The Central Counterparty (CCP) performs Novation — replacing the bilateral contract with two central contracts. CCP calls Initial & Variation Margin from Clearing Member Banks.',
      nextBtn: 'Next Step: SWIFT Pipeline'
    },
    {
      badge: 'Step 5: Custodian SWIFT',
      badgeClass: 'bg-pink-900 text-pink-300 border-pink-700',
      title: 'Back Office: Custodian SWIFT Instructions',
      desc: 'Clearing Brokers instruct settlement agents. Buyer Custodian dispatches SWIFT <span class="text-amber-400 font-bold font-mono">MT541 (RVP)</span>; Seller Custodian dispatches <span class="text-amber-400 font-bold font-mono">MT543 (DVP)</span>. CSD issues <span class="text-emerald-400 font-bold font-mono">MT548 Matched</span> advice.',
      nextBtn: 'Next Step: DvP Settlement'
    },
    {
      badge: 'Step 6: DvP Settlement',
      badgeClass: 'bg-teal-900 text-teal-300 border-teal-700',
      title: 'Depository: Delivery vs Payment (DvP) Finality',
      desc: 'On Settlement Date, the CSD executes simultaneous <span class="text-emerald-400 font-bold">Delivery vs Payment (DvP)</span>. Stock is transferred to Buyer Custodian while cash is swept via Central Bank accounts to Seller Clearing Bank. Trade closed!',
      nextBtn: 'Cycle Complete'
    }
  ];

  // Execute Step Animation
  const runStepAnimation = async (stepNum) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (stepNum === 0) {
      setActiveNodes(['buyPm', 'buyExec', 'sellPm', 'sellExec']);
      setActivePaths(['buyPm-buyExec', 'sellPm-sellExec']);
      setParticles([
        { id: 1, type: 'buy', text: 'B', x: 15, y: 12, targetX: 30, targetY: 28 },
        { id: 2, type: 'sell', text: 'S', x: 85, y: 12, targetX: 70, targetY: 28 }
      ]);
    } else if (stepNum === 1) {
      setActiveNodes(['buyExec', 'sellExec', 'exchange']);
      setActivePaths(['buyExec-exchange', 'sellExec-exchange']);
      setParticles([
        { id: 3, type: 'buy', text: 'B', x: 30, y: 28, targetX: 50, targetY: 28 },
        { id: 4, type: 'sell', text: 'S', x: 70, y: 28, targetX: 50, targetY: 28 }
      ]);
      setTimeout(() => {
        setParticles([{ id: 5, type: 'match', text: 'MATCH', x: 50, y: 28, targetX: 50, targetY: 28 }]);
      }, 800);
    } else if (stepNum === 2) {
      setActiveNodes(['exchange', 'ctm', 'buyPm', 'sellPm']);
      setActivePaths(['exchange-ctm', 'buyPm-ctm', 'sellPm-ctm']);
      setParticles([
        { id: 6, type: 'match', text: 'AFFIRMED', x: 50, y: 28, targetX: 50, targetY: 45 }
      ]);
    } else if (stepNum === 3) {
      setActiveNodes(['ctm', 'ccp', 'buyClear', 'sellClear']);
      setActivePaths(['ctm-ccp', 'ccp-buyClear', 'ccp-sellClear']);
      setParticles([
        { id: 7, type: 'match', text: 'NOVATED', x: 50, y: 45, targetX: 50, targetY: 62 }
      ]);
      setTimeout(() => {
        setParticles([
          { id: 8, type: 'buy', text: '$ Margin', x: 50, y: 62, targetX: 30, targetY: 62 },
          { id: 9, type: 'sell', text: 'Sh Margin', x: 50, y: 62, targetX: 70, targetY: 62 }
        ]);
      }, 700);
    } else if (stepNum === 4) {
      setActiveNodes(['buyClear', 'sellClear', 'buyCust', 'buyBank', 'sellCust', 'sellBank']);
      setActivePaths(['buyClear-buyCust', 'buyClear-buyBank', 'sellClear-sellCust', 'sellClear-sellBank']);
      setParticles([
        { id: 10, type: 'buy', text: 'MT541', x: 30, y: 62, targetX: 15, targetY: 88 },
        { id: 11, type: 'buy', text: '$ Cover', x: 30, y: 62, targetX: 35, targetY: 80 },
        { id: 12, type: 'sell', text: 'MT543', x: 70, y: 62, targetX: 85, targetY: 88 }
      ]);
    } else if (stepNum === 5) {
      setActiveNodes(['buyBank', 'sellCust', 'buyCust', 'sellBank', 'csd']);
      setActivePaths(['buyBank-csd', 'sellCust-csd', 'buyCust-csd', 'sellBank-csd']);
      setParticles([
        { id: 13, type: 'buy', text: '$2M Cash', x: 35, y: 80, targetX: 50, targetY: 88 },
        { id: 14, type: 'sell', text: '10k Shares', x: 85, y: 88, targetX: 50, targetY: 88 }
      ]);
      setTimeout(() => {
        setParticles([
          { id: 15, type: 'sell', text: '10k Shares', x: 50, y: 88, targetX: 15, targetY: 88 },
          { id: 16, type: 'buy', text: '$2M Cash', x: 50, y: 88, targetX: 65, targetY: 80 }
        ]);
      }, 1000);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const handleNextStep = () => {
    if (simStep < simSteps.length - 1) {
      const nextStep = simStep + 1;
      setSimStep(nextStep);
      runStepAnimation(nextStep);
    }
  };

  const handleReset = () => {
    setSimStep(0);
    setActiveNodes([]);
    setActivePaths([]);
    setParticles([]);
    setIsAnimating(false);
  };

  useEffect(() => {
    if (activeTab === 'dual') {
      runStepAnimation(simStep);
    }
  }, [activeTab]);

  const activeStage = roadmapStages[activeStepIdx];
  const currentSimNarrative = simSteps[simStep];

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Bar Header with Fullscreen Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Trade Lifecycle Macro Architecture</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Deconstruct end-to-end trade processing from Front-Office execution to Back-Office DvP settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Mode Tabs */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('dual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 Dual-Sided Trade Engine
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ 6-Stage Detailed Flow
            </button>
          </div>

          {/* Fullscreen Expand Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'dual' ? (
        <div className="flex-1 flex flex-col space-y-4">
          {/* Dual Engine Node Map Canvas */}
          <div className="relative w-full min-h-[420px] md:min-h-[500px] bg-slate-950/80 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl">
            {/* SVG Bezier Path Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {connections.map(([n1Id, n2Id]) => {
                const n1 = nodes.find(n => n.id === n1Id);
                const n2 = nodes.find(n => n.id === n2Id);
                if (!n1 || !n2) return null;

                const pathKey = `${n1Id}-${n2Id}`;
                const isActive = activePaths.includes(pathKey);

                return (
                  <line
                    key={pathKey}
                    x1={`${n1.x}%`}
                    y1={`${n1.y}%`}
                    x2={`${n2.x}%`}
                    y2={`${n2.y}%`}
                    stroke={isActive ? '#60a5fa' : '#334155'}
                    strokeWidth={isActive ? '3' : '1.5'}
                    strokeDasharray={isActive ? 'none' : '4 4'}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Render 14 Market Participant Nodes */}
            {nodes.map(node => {
              const isActive = activeNodes.includes(node.id);
              return (
                <motion.div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl border text-center z-10 shadow-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                      : 'bg-slate-800/90 border-slate-700/80 hover:border-slate-500'
                  }`}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, width: '100px' }}
                  animate={{ scale: isActive ? 1.08 : 1 }}
                >
                  <div className="text-base md:text-lg mb-0.5">{node.icon}</div>
                  <div className="text-[10px] md:text-xs font-bold text-white leading-tight truncate">{node.label}</div>
                  <div className="text-[8px] font-mono text-slate-400 uppercase tracking-tight truncate">{node.sub}</div>
                </motion.div>
              );
            })}

            {/* Dynamic Animated Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
                animate={{ left: `${p.targetX}%`, top: `${p.targetY}%`, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border shadow-xl flex items-center justify-center whitespace-nowrap ${
                  p.type === 'buy' ? 'bg-blue-600 text-white border-blue-300' :
                  p.type === 'sell' ? 'bg-emerald-600 text-white border-emerald-300' :
                  'bg-amber-500 text-white border-amber-300'
                }`}
              >
                {p.text}
              </motion.div>
            ))}
          </div>

          {/* Narrative & Interactive Controls Footer */}
          <div className="bg-slate-800 border border-slate-700 p-4 md:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${currentSimNarrative.badgeClass}`}>
                  {currentSimNarrative.badge}
                </span>
                <h3 className="text-sm md:text-base font-bold text-white truncate">{currentSimNarrative.title}</h3>
              </div>
              <p
                className="text-xs text-slate-300 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: currentSimNarrative.desc }}
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold font-mono transition-colors"
              >
                🔄 Reset
              </button>
              <button
                onClick={handleNextStep}
                disabled={isAnimating || simStep === simSteps.length - 1}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
              >
                <span>{simStep === simSteps.length - 1 ? 'Cycle Complete ✅' : currentSimNarrative.nextBtn}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
