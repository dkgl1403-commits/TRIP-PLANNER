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
    ['buyCust', 'csd'], ['sellCust', 'csd'],
    ['csd', 'buyCust'], ['csd', 'sellCust'],
    ['buyBank', 'csd'], ['sellBank', 'csd']
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
      nextBtn: 'Next Step: Custody SWIFT Dispatch'
    },
    {
      badge: 'Step 5: Custody SWIFT MT54x & MT548',
      badgeClass: 'bg-pink-900 text-pink-300 border-pink-700',
      title: 'Back Office: Custodian Instructions & CSD MT548 Matching Loop',
      desc: 'Buyer Custodian dispatches SWIFT <span class="text-amber-400 font-bold font-mono">MT541 (Receive Against Payment - RVP)</span>; Seller Custodian dispatches <span class="text-amber-400 font-bold font-mono">MT543 (Deliver Against Payment - DVP)</span>. The CSD compares SSIs and emits SWIFT <span class="text-emerald-400 font-bold font-mono">MT548 Status Advice (:24B::MATCH//MACH)</span> to both custodians.',
      nextBtn: 'Next Step: DvP Settlement'
    },
    {
      badge: 'Step 6: DvP & SWIFT MT545/MT547',
      badgeClass: 'bg-teal-900 text-teal-300 border-teal-700',
      title: 'Depository: DvP Finality & MT545 / MT547 Settlement Confirmations',
      desc: 'On Settlement Date, CSD executes simultaneous <span class="text-emerald-400 font-bold">Delivery vs Payment (DvP)</span>. Buyer Custodian receives shares & sends <span class="text-amber-400 font-bold font-mono">MT545 RVP Confirmation</span> to Buyer PM; Seller Custodian receives cash sweep & sends <span class="text-amber-400 font-bold font-mono">MT547 DVP Confirmation</span> to Seller PM.',
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
        { id: 1, type: 'buy', text: '35=D', x: 15, y: 12, targetX: 30, targetY: 28 },
        { id: 2, type: 'sell', text: '35=D', x: 85, y: 12, targetX: 70, targetY: 28 }
      ]);
    } else if (stepNum === 1) {
      setActiveNodes(['buyExec', 'sellExec', 'exchange']);
      setActivePaths(['buyExec-exchange', 'sellExec-exchange']);
      setParticles([
        { id: 3, type: 'buy', text: '35=D', x: 30, y: 28, targetX: 50, targetY: 28 },
        { id: 4, type: 'sell', text: '35=D', x: 70, y: 28, targetX: 50, targetY: 28 }
      ]);
      setTimeout(() => {
        setParticles([{ id: 5, type: 'match', text: '35=8 MATCH', x: 50, y: 28, targetX: 50, targetY: 28 }]);
      }, 800);
    } else if (stepNum === 2) {
      setActiveNodes(['exchange', 'ctm', 'buyPm', 'sellPm']);
      setActivePaths(['exchange-ctm', 'buyPm-ctm', 'sellPm-ctm']);
      setParticles([
        { id: 6, type: 'match', text: 'CTM AFFIRMED', x: 50, y: 28, targetX: 50, targetY: 45 }
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
      // Step 5: Custodian SWIFT Instructions MT541/MT543 -> CSD MT548 Matching Response Loop
      setActiveNodes(['buyClear', 'sellClear', 'buyCust', 'sellCust', 'csd']);
      setActivePaths(['buyClear-buyCust', 'sellClear-sellCust', 'buyCust-csd', 'sellCust-csd', 'csd-buyCust', 'csd-sellCust']);
      setParticles([
        { id: 10, type: 'buy', text: 'MT541 (RVP)', x: 15, y: 88, targetX: 50, targetY: 88 },
        { id: 11, type: 'sell', text: 'MT543 (DVP)', x: 85, y: 88, targetX: 50, targetY: 88 }
      ]);
      setTimeout(() => {
        setParticles([
          { id: 12, type: 'match', text: 'MT548 (MACH)', x: 50, y: 88, targetX: 15, targetY: 88 },
          { id: 13, type: 'match', text: 'MT548 (MACH)', x: 50, y: 88, targetX: 85, targetY: 88 }
        ]);
      }, 1000);
    } else if (stepNum === 5) {
      // Step 6: DvP Settlement & Custodian MT545 / MT547 Confirmations
      setActiveNodes(['buyBank', 'sellCust', 'buyCust', 'sellBank', 'csd', 'buyPm', 'sellPm']);
      setActivePaths(['buyBank-csd', 'sellCust-csd', 'buyCust-csd', 'sellBank-csd', 'buyCust-buyPm', 'sellCust-sellPm']);
      setParticles([
        { id: 14, type: 'buy', text: '$2M Cash', x: 35, y: 80, targetX: 50, targetY: 88 },
        { id: 15, type: 'sell', text: '10k Shares', x: 85, y: 88, targetX: 50, targetY: 88 }
      ]);
      setTimeout(() => {
        setParticles([
          { id: 16, type: 'sell', text: '10k Shares', x: 50, y: 88, targetX: 15, targetY: 88 },
          { id: 17, type: 'buy', text: '$2M Cash', x: 50, y: 88, targetX: 65, targetY: 80 },
          { id: 18, type: 'buy', text: 'MT545 (RVP Conf)', x: 15, y: 88, targetX: 15, targetY: 12 },
          { id: 19, type: 'sell', text: 'MT547 (DVP Conf)', x: 85, y: 88, targetX: 85, targetY: 12 }
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
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
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
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-mono transition-all shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]"
              >
                🔄 Reset
              </button>
              <button
                onClick={handleNextStep}
                disabled={isAnimating || simStep === simSteps.length - 1}
                className="px-5 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-500/50 backdrop-blur-md border border-blue-400/40 disabled:opacity-30 text-white text-xs md:text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
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
                    ? 'bg-white/15 border-blue-400/50 backdrop-blur-md shadow-lg scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-white/10 backdrop-blur-sm'
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
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 md:p-6 shadow-xl space-y-5 backdrop-blur-md">
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

            {/* Navigation Stepper Controls (Glassmorphic Transparent Style) */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                disabled={activeStepIdx === 0}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white disabled:opacity-30 rounded-xl text-xs font-bold transition-all shadow"
              >
                ← Previous Stage
              </button>

              <span className="text-xs font-mono text-slate-400 font-bold">Stage {activeStepIdx + 1} of {roadmapStages.length}</span>

              <button
                onClick={() => setActiveStepIdx(prev => Math.min(roadmapStages.length - 1, prev + 1))}
                disabled={activeStepIdx === roadmapStages.length - 1}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-500/50 backdrop-blur-md border border-blue-400/40 text-white disabled:opacity-30 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
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

// ─── Trade Lifecycle Chapter 2: The Evolution of the Exchange & CLOB ─────────
export function TradeLifecycleChapter2Widget() {
  const [activeTab, setActiveTab] = useState('clob'); // 'clob' | 'history'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // CLOB Order Book State
  const [asks, setAsks] = useState([
    { price: 200.25, shares: 1500, orders: 3, total: 1500 },
    { price: 200.20, shares: 2500, orders: 4, total: 4000 },
    { price: 200.15, shares: 1000, orders: 2, total: 5000 },
    { price: 200.10, shares: 800, orders: 1, total: 5800 }
  ]);

  const [bids, setBids] = useState([
    { price: 200.05, shares: 1200, orders: 2, total: 1200 },
    { price: 200.00, shares: 3000, orders: 5, total: 4200 },
    { price: 199.95, shares: 2000, orders: 3, total: 6200 },
    { price: 199.90, shares: 1500, orders: 2, total: 7700 }
  ]);

  // Order Ticket Input State
  const [orderSide, setOrderSide] = useState('BUY'); // 'BUY' | 'SELL'
  const [orderType, setOrderType] = useState('LIMIT'); // 'LIMIT' (Maker) | 'MARKET' (Taker)
  const [orderShares, setOrderShares] = useState(500);
  const [orderPrice, setOrderPrice] = useState(200.05);

  // Execution Log Feed
  const [tradeLogs, setTradeLogs] = useState([
    { id: 1, time: '10:14:02.120', side: 'BUY', shares: 500, price: 200.10, fee: '-$0.05 (Taker Fee)', type: 'FILL' },
    { id: 2, time: '10:13:58.045', side: 'SELL', shares: 1000, price: 200.05, fee: '+$0.02 (Maker Rebate)', type: 'FILL' }
  ]);

  // Exchange Evolution Eras Data
  const evolutionEras = [
    {
      year: '1792',
      title: 'The Buttonwood Agreement',
      venue: 'Physical Sycamore Tree (NYSE Precursor)',
      tech: 'Paper Ledgers & Handshakes',
      desc: '24 stockbrokers gathered under a buttonwood tree at 68 Wall Street to establish fixed commission rates and trade government bonds and bank stocks.'
    },
    {
      year: '1865-1970s',
      title: 'Open Outcry Trading Pits',
      venue: 'NYSE / CBOT Floor Trading Pits',
      tech: 'Hand Signals, Paper Tickets, Pit Noise',
      desc: 'Traders shouted prices and used complex hand signals in crowded trading pits. Floor brokers matched orders manually on paper trade slips.'
    },
    {
      year: '1971',
      title: 'The NASDAQ Revolution',
      venue: 'Automated Quotation System',
      tech: 'Computerized Display Terminals',
      desc: 'The world\'s first electronic stock market launched, allowing market makers to broadcast automated Bid/Ask quotes without a physical trading floor.'
    },
    {
      year: '1990s',
      title: 'ECNs & Electronic Matching',
      venue: 'Island, Instinet, Archipelago',
      tech: 'Central Limit Order Books (CLOB)',
      desc: 'Electronic Communication Networks (ECNs) eliminated human intermediaries, introducing microsecond matching based on strict Price-Time Priority.'
    },
    {
      year: '2010s-Present',
      title: 'HFT & Dark Pool Fragmentation',
      venue: 'Lit Exchanges, Dark Pools (ATS/MTFs)',
      tech: 'High-Frequency Trading (HFT), Microwave Links, Smart Routers',
      desc: 'Modern equity markets execute orders in nanoseconds across fragmented lit exchanges and dark pools, governed by Maker/Taker rebate models.'
    }
  ];

  const [activeEraIdx, setActiveEraIdx] = useState(0);

  // Calculate Bid/Ask Spread
  const bestAsk = asks.length > 0 ? Math.min(...asks.map(a => a.price)) : 0;
  const bestBid = bids.length > 0 ? Math.max(...bids.map(b => b.price)) : 0;
  const spread = (bestAsk - bestBid).toFixed(2);

  // Submit Order into CLOB Matching Engine
  const handlePlaceOrder = () => {
    const qty = parseInt(orderShares);
    const prc = parseFloat(orderPrice);
    if (!qty || qty <= 0) return;

    const timeStr = new Date().toISOString().split('T')[1].slice(0, 12);

    if (orderType === 'MARKET') {
      // Market Order (Taker) -> Immediately matches best opposing order
      if (orderSide === 'BUY') {
        const fillPrice = bestAsk;
        setTradeLogs(prev => [
          { id: Date.now(), time: timeStr, side: 'BUY (TAKER)', shares: qty, price: fillPrice, fee: '-$0.05 (Taker Fee)', type: 'MARKET FILL' },
          ...prev
        ]);
        // Reduce Ask volume at best ask
        setAsks(prevAsks => prevAsks.map(a => a.price === fillPrice ? { ...a, shares: Math.max(0, a.shares - qty) } : a).filter(a => a.shares > 0));
      } else {
        const fillPrice = bestBid;
        setTradeLogs(prev => [
          { id: Date.now(), time: timeStr, side: 'SELL (TAKER)', shares: qty, price: fillPrice, fee: '-$0.05 (Taker Fee)', type: 'MARKET FILL' },
          ...prev
        ]);
        // Reduce Bid volume at best bid
        setBids(prevBids => prevBids.map(b => b.price === fillPrice ? { ...b, shares: Math.max(0, b.shares - qty) } : b).filter(b => b.shares > 0));
      }
    } else {
      // Limit Order (Maker) -> Rests on the book or matches if crosses spread
      if (orderSide === 'BUY') {
        if (prc >= bestAsk && bestAsk > 0) {
          // Crosses spread -> Taker Fill
          setTradeLogs(prev => [
            { id: Date.now(), time: timeStr, side: 'BUY (CROSS TAKER)', shares: qty, price: bestAsk, fee: '-$0.05 (Taker Fee)', type: 'LIMIT FILL' },
            ...prev
          ]);
          setAsks(prevAsks => prevAsks.map(a => a.price === bestAsk ? { ...a, shares: Math.max(0, a.shares - qty) } : a).filter(a => a.shares > 0));
        } else {
          // Rests on book -> Maker
          const existing = bids.find(b => b.price === prc);
          if (existing) {
            setBids(prev => prev.map(b => b.price === prc ? { ...b, shares: b.shares + qty, orders: b.orders + 1 } : b));
          } else {
            setBids(prev => [...prev, { price: prc, shares: qty, orders: 1, total: qty }].sort((a, b) => b.price - a.price));
          }
          setTradeLogs(prev => [
            { id: Date.now(), time: timeStr, side: 'BUY (MAKER)', shares: qty, price: prc, fee: '+$0.02 (Maker Rebate)', type: 'ORDER RESTING' },
            ...prev
          ]);
        }
      } else {
        // SELL LIMIT
        if (prc <= bestBid && bestBid > 0) {
          // Crosses spread -> Taker Fill
          setTradeLogs(prev => [
            { id: Date.now(), time: timeStr, side: 'SELL (CROSS TAKER)', shares: qty, price: bestBid, fee: '-$0.05 (Taker Fee)', type: 'LIMIT FILL' },
            ...prev
          ]);
          setBids(prevBids => prevBids.map(b => b.price === bestBid ? { ...b, shares: Math.max(0, b.shares - qty) } : b).filter(b => b.shares > 0));
        } else {
          // Rests on book -> Maker
          const existing = asks.find(a => a.price === prc);
          if (existing) {
            setAsks(prev => prev.map(a => a.price === prc ? { ...a, shares: a.shares + qty, orders: a.orders + 1 } : a));
          } else {
            setAsks(prev => [...prev, { price: prc, shares: qty, orders: 1, total: qty }].sort((a, b) => a.price - b.price));
          }
          setTradeLogs(prev => [
            { id: Date.now(), time: timeStr, side: 'SELL (MAKER)', shares: qty, price: prc, fee: '+$0.02 (Maker Rebate)', type: 'ORDER RESTING' },
            ...prev
          ]);
        }
      }
    }
  };

  const currentEra = evolutionEras[activeEraIdx];

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Central Limit Order Book (CLOB) Engine</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Simulate Price-Time Priority matching, Bid/Ask depth, and Maker/Taker liquidity economics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('clob')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'clob' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Live CLOB Engine
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'history' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Exchange Evolution Timeline
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'clob' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Book Ladder (Left Column - 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm">AAPL</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-sans">CLOB Matching Engine</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">BID / ASK SPREAD</span>
                <span className="text-emerald-400 font-bold">${spread}</span>
              </div>
            </div>

            {/* Asks Section (Red - Selling Offer Depth) */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold text-red-400 uppercase tracking-wider block">Asks / Sell Offers (Red)</span>
              {asks.map((ask, idx) => (
                <div key={idx} className="relative flex justify-between items-center p-2 rounded bg-red-950/30 border border-red-900/40 text-red-300">
                  <div className="absolute left-0 top-0 bottom-0 bg-red-600/20 rounded pointer-events-none" style={{ width: `${Math.min(100, (ask.shares / 5000) * 100)}%` }} />
                  <span className="font-bold text-red-400">${ask.price.toFixed(2)}</span>
                  <span>{ask.shares.toLocaleString()} shares</span>
                  <span className="text-slate-500 text-[10px]">{ask.orders} orders</span>
                </div>
              ))}
            </div>

            {/* Spread Divider Bar */}
            <div className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 flex justify-between items-center text-slate-300 font-sans text-xs">
              <span className="font-bold text-amber-400">⚡ Touch Price Spread</span>
              <span className="font-mono">Best Bid: ${bestBid.toFixed(2)} | Best Ask: ${bestAsk.toFixed(2)}</span>
            </div>

            {/* Bids Section (Green - Buying Demand Depth) */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-wider block">Bids / Buy Orders (Green)</span>
              {bids.map((bid, idx) => (
                <div key={idx} className="relative flex justify-between items-center p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                  <div className="absolute left-0 top-0 bottom-0 bg-emerald-600/20 rounded pointer-events-none" style={{ width: `${Math.min(100, (bid.shares / 5000) * 100)}%` }} />
                  <span className="font-bold text-emerald-400">${bid.price.toFixed(2)}</span>
                  <span>{bid.shares.toLocaleString()} shares</span>
                  <span className="text-slate-500 text-[10px]">{bid.orders} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Ticket & Execution Log (Right Column - 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Entry Form */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-mono">Order Ticket & Matching Simulator</span>

              {/* Buy / Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderSide('BUY')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    orderSide === 'BUY' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 BUY (Bid)
                </button>
                <button
                  onClick={() => setOrderSide('SELL')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    orderSide === 'SELL' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🔴 SELL (Ask)
                </button>
              </div>

              {/* Limit / Market Order Type Toggle */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => setOrderType('LIMIT')}
                  className={`py-1.5 rounded-lg border font-bold transition-all ${
                    orderType === 'LIMIT' ? 'bg-blue-600/40 border-blue-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Limit Order (Maker)
                </button>
                <button
                  onClick={() => setOrderType('MARKET')}
                  className={`py-1.5 rounded-lg border font-bold transition-all ${
                    orderType === 'MARKET' ? 'bg-amber-600/40 border-amber-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Market Order (Taker)
                </button>
              </div>

              {/* Order Quantity & Price Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block text-[10px] mb-1 font-sans">Shares Quantity</label>
                  <input
                    type="number"
                    value={orderShares}
                    onChange={(e) => setOrderShares(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                {orderType === 'LIMIT' && (
                  <div>
                    <label className="text-slate-400 block text-[10px] mb-1 font-sans">Limit Price ($)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Maker / Taker Economics Info */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-slate-300">
                <span className="text-amber-400 font-bold block mb-1 font-sans">Maker vs Taker Fee Economics:</span>
                {orderType === 'LIMIT' ? (
                  <span>Limit Orders rest on book as <strong>Liquidity Maker</strong> &rarr; Earns <strong>+$0.02/share Rebate</strong> when filled.</span>
                ) : (
                  <span>Market Orders execute instantly as <strong>Liquidity Taker</strong> &rarr; Pays <strong>-$0.05/share Fee</strong>.</span>
                )}
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handlePlaceOrder}
                className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg font-mono ${
                  orderSide === 'BUY'
                    ? 'bg-emerald-600/40 hover:bg-emerald-500/60 border border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'bg-red-600/40 hover:bg-red-500/60 border border-red-400/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                }`}
              >
                Submit {orderSide} {orderType} Order to CLOB Engine →
              </button>
            </div>

            {/* Execution Audit Log Feed */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block">Matching Engine Audit Log</span>
              {tradeLogs.map(log => (
                <div key={log.id} className="p-2 rounded bg-slate-900 border border-slate-700 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[9px] block">{log.time}</span>
                    <span className="text-white font-bold">{log.side} {log.shares} shares @ ${parseFloat(log.price).toFixed(2)}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${log.fee.includes('Rebate') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                    {log.fee}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Exchange Evolution Timeline */
        <div className="space-y-6">
          {/* Era Header Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {evolutionEras.map((era, idx) => (
              <button
                key={idx}
                onClick={() => setActiveEraIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeEraIdx === idx
                    ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg scale-[1.02]'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-mono font-bold text-amber-400 block">{era.year}</span>
                <span className="text-xs font-bold truncate block">{era.title}</span>
              </button>
            ))}
          </div>

          {/* Active Era Inspector Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-700 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">{currentEra.year} Era</span>
                <h3 className="text-xl md:text-2xl font-bold text-white">{currentEra.title}</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-blue-400 border border-slate-700">
                {currentEra.venue}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
              {currentEra.desc}
            </p>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 font-mono text-xs">
              <span className="text-slate-500 uppercase text-[10px] font-bold block mb-1">Trading Technology & Plumbing</span>
              <span className="text-emerald-300 font-bold">{currentEra.tech}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 3: The Cast of Characters ────────────────────────
export function TradeLifecycleChapter3Widget() {
  const [activeTab, setActiveTab] = useState('ecosystem'); // 'ecosystem' | 'darkpool'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPillarId, setSelectedPillarId] = useState('buyside');
  const [selectedActorId, setSelectedActorId] = useState('pm');

  // Lit vs Dark Pool Simulation State
  const [simVenue, setSimVenue] = useState('lit'); // 'lit' | 'dark'
  const [orderSize] = useState(500000); // 500k shares block

  // 5 Pillars of Market Participants
  const pillars = [
    {
      id: 'buyside',
      title: '1. The Buy-Side',
      subtitle: 'Asset Managers & Funds',
      icon: '💼',
      color: '#3b82f6',
      actors: [
        {
          id: 'pm',
          title: 'Portfolio Manager (PM)',
          role: 'Generates trade ideas, allocates capital, manages fund risk & investment mandates.',
          systems: 'Order Management System (OMS), Bloomberg AIM, Charles River',
          protocols: 'Internal FIX / Portfolio Compliance Rules Engine',
          revenue: 'Management Fees (% AUM) + Performance Fees',
          risk: 'Fat-finger entries, ESG compliance breaches, or cash overdrafts.'
        },
        {
          id: 'buytrader',
          title: 'Buy-Side Execution Trader',
          role: 'Executes PM orders efficiently on market venues to minimize market impact & slippage.',
          systems: 'Execution Management System (EMS), FlexTrade, Portware',
          protocols: 'FIX 4.2 / 4.4 Protocol (Tag 35=D New Order Single)',
          revenue: 'Salary + Performance Bonus',
          risk: 'Order leakage, excessive market impact slippage, or algo routing errors.'
        }
      ]
    },
    {
      id: 'sellside',
      title: '2. The Sell-Side',
      subtitle: 'Brokers & Market Makers',
      icon: '📡',
      color: '#f59e0b',
      actors: [
        {
          id: 'execbroker',
          title: 'Executing Broker',
          role: 'Provides direct market access (DMA) and smart order routing (SOR) to lit and dark venues.',
          systems: 'Smart Order Router (SOR), FIX Engines, Order Execution Management',
          protocols: 'FIX Protocol & Market Data Feeds (ITCH/OUCH, FIX 35=8)',
          revenue: 'Execution Commissions per Share / Basis Points',
          risk: 'Venue outage, SOR routing failures, or execution misreporting.'
        },
        {
          id: 'pb',
          title: 'Prime Broker (PB)',
          role: 'Provides synthetic leverage, stock borrowing for short sales, clearing, and portfolio financing for hedge funds.',
          systems: 'Margin Engines, Stock Loan Systems, Custody Clearing Platforms',
          protocols: 'SWIFT MT515 / MT541 / MT543 & FIX Post-Trade',
          revenue: 'Net Interest Margin, Stock Loan Borrow Fees & Clearing Fees',
          risk: 'Counterparty credit default (e.g. Archegos capital collapse) & margin shortfalls.'
        },
        {
          id: 'mm',
          title: 'Market Maker (MM)',
          role: 'Provides continuous two-sided Bid and Ask quotes on lit venues, earning the Bid/Ask spread.',
          systems: 'High-Frequency Algorithmic Pricing Engines, Microwave Links',
          protocols: 'Exchange Native Protocols (NASDAQ OUCH, NYSE Pillar)',
          revenue: 'Bid-Ask Spread Capture + Exchange Maker Rebates',
          risk: 'Adverse selection risk (trading against informed institutional flow).'
        }
      ]
    },
    {
      id: 'venues',
      title: '3. The Venues',
      subtitle: 'Exchanges & Dark Pools',
      icon: '🏛️',
      color: '#10b981',
      actors: [
        {
          id: 'lit',
          title: 'Lit Exchange (NYSE, NASDAQ, LSE)',
          role: 'Public trading venue with full pre-trade transparency (visible Bid/Ask depth). Order book is visible to all.',
          systems: 'Central Limit Order Book (CLOB) Matching Engine',
          protocols: 'Exchange Market Data (ITCH) & Order Entry (OUCH/FIX)',
          revenue: 'Listing Fees, Market Data Subscription Fees & Trading Fees',
          risk: 'Market impact leakage when institutional investors place large block orders.'
        },
        {
          id: 'dark',
          title: 'Dark Pool (ATS / MTF)',
          role: 'Non-displayed private trading venue with zero pre-trade transparency. Orders match at NBBO midpoint anonymously.',
          systems: 'Alternative Trading System (ATS) Midpoint Matcher',
          protocols: 'FIX Protocol & Private Dark Aggregator API',
          revenue: 'Trading Commission Per Share',
          risk: 'Lower fill rates and potential conflict of interest from internal internalization.'
        }
      ]
    },
    {
      id: 'securities_infra',
      title: '4. Securities Infrastructure',
      subtitle: 'CCPs, CSDs & Custodians',
      icon: '🛡️',
      color: '#8b5cf6',
      actors: [
        {
          id: 'ccp',
          title: 'Central Counterparty (CCP)',
          role: 'Shields market risk through Novation (replacing bilateral contracts) and performs Multilateral Netting & Margin Calls.',
          systems: 'NSCC / EuroCCP / LCH Clearnet Risk Engines',
          protocols: 'Real-Time Clearing API & ISO 20022 Margin Messages',
          revenue: 'Clearing Fees & Interest on Collateral Deposits',
          risk: 'Member default cascade during extreme multi-sigma market crises.'
        },
        {
          id: 'csd',
          title: 'Central Securities Depository (CSD)',
          role: 'Holds central legal register of immobilised/dematerialised securities. Executes Delivery vs Payment (DvP) finality.',
          systems: 'DTCC / Euroclear / Clearstream Core CSD Settlement Engine',
          protocols: 'SWIFT ISO 15022 (MT54x / MT548) & ISO 20022 seev/sese',
          revenue: 'Custody Safekeeping Fees & Settlement Transaction Fees',
          risk: 'Settlement fails due to lack of stock inventory or SSI mismatches.'
        },
        {
          id: 'custodian',
          title: 'Global & Local Custodians',
          role: 'Safeguards client assets, handles corporate actions, and dispatches settlement instructions to CSDs.',
          systems: 'TCS BaNCS, Broadridge, BNY Mellon Custody Platform',
          protocols: 'SWIFT ISO 15022 (MT541 RVP / MT543 DVP / MT548 Status)',
          revenue: 'Assets Under Custody (AUC) Basis Points & Transaction Fees',
          risk: 'Sub-custodian fail, tax treaty withholding error, or Nostro cash break.'
        }
      ]
    },
    {
      id: 'cash_infra',
      title: '5. Cash Infrastructure',
      subtitle: 'Clearing Banks & Central Bank',
      icon: '💵',
      color: '#ec4899',
      actors: [
        {
          id: 'clearbank',
          title: 'Clearing Bank (Ultimate Cash Conduit)',
          role: 'Facilitates real-time fiat currency transfers for CCP margin calls and final DvP settlement via master Central Bank accounts.',
          systems: 'Fedwire, TARGET2, CHAPS Core Payment Gateways',
          protocols: 'SWIFT MT202 Cover / MT103 & ISO 20022 camt/pacs',
          revenue: 'Wire Transfer Fees & Overnight Liquidity Interest',
          risk: 'Intraday liquidity shortfall or Central Bank payment gateway outage.'
        }
      ]
    }
  ];

  const currentPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];
  const currentActor = currentPillar.actors.find(a => a.id === selectedActorId) || currentPillar.actors[0];

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">The Cast of Characters & Market Infrastructure</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Explore the roles, systems, protocols, and legal liabilities of Buy-Side, Sell-Side, Venues, and Infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('ecosystem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ecosystem' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Cast of Characters Ecosystem
            </button>
            <button
              onClick={() => setActiveTab('darkpool')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'darkpool' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🕶️ Lit Exchange vs Dark Pool Simulator
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'ecosystem' ? (
        <div className="space-y-6">
          {/* 5 Pillar Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {pillars.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPillarId(p.id);
                  setSelectedActorId(p.actors[0].id);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedPillarId === p.id
                    ? 'bg-slate-800 border-2 shadow-lg scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
                style={{ borderColor: selectedPillarId === p.id ? p.color : undefined }}
              >
                <span className="text-xl mb-1">{p.icon}</span>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{p.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Sub-Actor Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {currentPillar.actors.map(actor => (
              <button
                key={actor.id}
                onClick={() => setSelectedActorId(actor.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                  selectedActorId === actor.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {actor.title}
              </button>
            ))}
          </div>

          {/* Active Actor Detailed Inspector Panel */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">{currentPillar.title}</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">{currentActor.title}</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700">
                Pillar: {currentPillar.subtitle}
              </span>
            </div>

            {/* Core Role Description */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Role & Market Responsibility</span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">{currentActor.role}</p>
            </div>

            {/* Systems, Protocols & Economics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Core Enterprise Systems</span>
                <span className="text-blue-300 font-bold">{currentActor.systems}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Messaging Protocols</span>
                <span className="text-purple-300 font-bold">{currentActor.protocols}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-500 font-sans font-bold uppercase block">Primary Revenue Model</span>
                <span className="text-emerald-300 font-bold">{currentActor.revenue}</span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-red-900/50 space-y-1">
                <span className="text-[10px] text-red-400 font-sans font-bold uppercase block">⚠️ Primary Liability / Risk</span>
                <p className="text-red-200 text-[11px] font-sans leading-relaxed">{currentActor.risk}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Lit Exchange vs Dark Pool Simulator */
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">Institutional Order Routing Simulator</span>
              <h3 className="text-sm font-bold text-white">Block Order Routing: 500,000 Shares of AAPL</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSimVenue('lit')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  simVenue === 'lit' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🏛️ Lit Exchange (NYSE/NASDAQ)
              </button>
              <button
                onClick={() => setSimVenue('dark')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  simVenue === 'dark' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🕶️ Dark Pool (ATS / MTF)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualizer Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-white font-bold">{simVenue === 'lit' ? 'Lit Exchange CLOB Order Book' : 'Dark Pool Midpoint Matcher'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${simVenue === 'lit' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-purple-950 text-purple-300 border border-purple-800'}`}>
                  {simVenue === 'lit' ? 'Pre-Trade TRANSPARENT' : 'Pre-Trade ANONYMOUS'}
                </span>
              </div>

              {simVenue === 'lit' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl space-y-1">
                    <span className="text-red-400 font-bold block text-[10px]">Visible Asks Depth (Order Book Impact Leakage)</span>
                    <div className="flex justify-between text-[11px] text-red-300"><span>100,000 @ $200.05</span><span>Walks Book &rarr;</span></div>
                    <div className="flex justify-between text-[11px] text-red-300"><span>200,000 @ $200.25</span><span>Price Slippage</span></div>
                    <div className="flex justify-between text-[11px] text-red-300"><span>200,000 @ $200.50</span><span>Highest Impact</span></div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                    <span className="text-amber-400 font-bold block mb-1">Lit Market Result:</span>
                    <span>Average Execution Price: <strong className="text-red-400">$200.31</strong> (+31 bps price slippage due to public book leakage).</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-950/40 border border-purple-900/50 rounded-xl space-y-1">
                    <span className="text-purple-300 font-bold block text-[10px]">Non-Displayed Midpoint Cross (Zero Information Leakage)</span>
                    <div className="flex justify-between text-[11px] text-purple-200"><span>Institutional Buyer: 500,000 Shares</span><span>Anonymous</span></div>
                    <div className="flex justify-between text-[11px] text-purple-200"><span>Institutional Seller: 500,000 Shares</span><span>NBBO Midpoint</span></div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-bold block mb-1">Dark Pool Result:</span>
                    <span>Execution Price: <strong className="text-emerald-400">$200.025</strong> (Exact NBBO Midpoint — Zero price slippage & $142,500 price improvement saved!).</span>
                  </div>
                </div>
              )}
            </div>

            {/* Explanatory Comparison Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 text-xs font-sans">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase block">Venue Microstructure Comparison</span>

              {simVenue === 'lit' ? (
                <div className="space-y-3 text-slate-300 leading-relaxed">
                  <p><strong>Lit Exchanges (NYSE, NASDAQ, LSE):</strong> Every order submitted to a lit exchange is broadcast to the market in real-time via high-speed market data feeds (e.g. NASDAQ ITCH).</p>
                  <p><strong>The Risk for Block Orders:</strong> High-frequency traders (HFTs) detect large buy orders on the lit order book, front-run the order across venues, and push the price up before the rest of the block can be filled.</p>
                </div>
              ) : (
                <div className="space-y-3 text-slate-300 leading-relaxed">
                  <p><strong>Dark Pools (ATS / MTFs):</strong> Dark pools are private alternative trading systems that do not display Bid/Ask quotes publicly prior to execution.</p>
                  <p><strong>The Benefit for Block Orders:</strong> Large pension funds and hedge funds can cross 500,000+ share blocks against matching institutional counterparties at the exact NBBO midpoint price without alerting the open market.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 4: The Front Office (Execution & FIX) ────────────
export function TradeLifecycleChapter4Widget() {
  const [activeTab, setActiveTab] = useState('fix'); // 'fix' | 'algo'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // FIX Parser State
  const [selectedFixMsgId, setSelectedFixMsgId] = useState('nos'); // 'nos' | 'exec' | 'replace'
  const [selectedTagNum, setSelectedTagNum] = useState('35');

  // Algorithmic Execution State
  const [selectedAlgo, setSelectedAlgo] = useState('vwap'); // 'twap' | 'vwap' | 'is'

  const fixMessages = [
    {
      id: 'nos',
      title: 'New Order Single (35=D)',
      desc: 'Buy-Side OMS/EMS dispatches order to Executing Broker.',
      raw: '8=FIX.4.2|9=145|35=D|49=ALPHA_CAPITAL|56=GOLDMAN_SACHS|11=ORD_99401|55=AAPL|54=1|38=50000|40=2|44=200.00|59=0|10=184|',
      tags: [
        { tag: '8', name: 'BeginString', type: 'Header', val: 'FIX.4.2', desc: 'Protocol version identifier.' },
        { tag: '9', name: 'BodyLength', type: 'Header', val: '145', desc: 'Character count of message body.' },
        { tag: '35', name: 'MsgType', type: 'Header', val: 'D', desc: 'D = New Order Single.' },
        { tag: '49', name: 'SenderCompID', type: 'Header', val: 'ALPHA_CAPITAL', desc: 'Buy-Side Institution Sender ID.' },
        { tag: '56', name: 'TargetCompID', type: 'Header', val: 'GOLDMAN_SACHS', desc: 'Executing Broker Target ID.' },
        { tag: '11', name: 'ClOrdID', type: 'Body', val: 'ORD_99401', desc: 'Unique Client Order Identifier.' },
        { tag: '55', name: 'Symbol', type: 'Body', val: 'AAPL', desc: 'Financial instrument ticker.' },
        { tag: '54', name: 'Side', type: 'Body', val: '1', desc: '1 = Buy, 2 = Sell, 5 = Sell Short.' },
        { tag: '38', name: 'OrderQty', type: 'Body', val: '50,000', desc: 'Total shares quantity.' },
        { tag: '40', name: 'OrdType', type: 'Body', val: '2', desc: '1 = Market, 2 = Limit, 3 = Stop.' },
        { tag: '44', name: 'Price', type: 'Body', val: '200.00', desc: 'Limit Price per share.' },
        { tag: '59', name: 'TimeInForce', type: 'Body', val: '0', desc: '0 = Day, 1 = GTC, 3 = IOC, 4 = FOK.' },
        { tag: '10', name: 'CheckSum', type: 'Trailer', val: '184', desc: '3-digit checksum verification.' }
      ]
    },
    {
      id: 'exec',
      title: 'Execution Report (35=8)',
      desc: 'Venue / Broker confirms trade execution fill back to OMS.',
      raw: '8=FIX.4.2|9=168|35=8|49=GOLDMAN_SACHS|56=ALPHA_CAPITAL|37=EX_55102|11=ORD_99401|17=EXEC_8820|150=2|39=2|55=AAPL|54=1|38=50000|32=10000|31=200.00|151=40000|10=202|',
      tags: [
        { tag: '8', name: 'BeginString', type: 'Header', val: 'FIX.4.2', desc: 'Protocol version identifier.' },
        { tag: '9', name: 'BodyLength', type: 'Header', val: '168', desc: 'Character count of message body.' },
        { tag: '35', name: 'MsgType', type: 'Header', val: '8', desc: '8 = Execution Report.' },
        { tag: '49', name: 'SenderCompID', type: 'Header', val: 'GOLDMAN_SACHS', desc: 'Executing Broker Sender ID.' },
        { tag: '56', name: 'TargetCompID', type: 'Header', val: 'ALPHA_CAPITAL', desc: 'Buy-Side Institution Target ID.' },
        { tag: '37', name: 'OrderID', type: 'Body', val: 'EX_55102', desc: 'Broker System Assigned Order ID.' },
        { tag: '11', name: 'ClOrdID', type: 'Body', val: 'ORD_99401', desc: 'Original Client Order Reference.' },
        { tag: '17', name: 'ExecID', type: 'Body', val: 'EXEC_8820', desc: 'Unique Trade Execution ID.' },
        { tag: '150', name: 'ExecType', type: 'Body', val: '2', desc: '2 = Fill, 1 = Partial Fill, 0 = New.' },
        { tag: '39', name: 'OrdStatus', type: 'Body', val: '2', desc: '2 = Filled, 1 = Partially Filled, 0 = New.' },
        { tag: '55', name: 'Symbol', type: 'Body', val: 'AAPL', desc: 'Financial instrument ticker.' },
        { tag: '54', name: 'Side', type: 'Body', val: '1', desc: '1 = Buy.' },
        { tag: '32', name: 'LastShares', type: 'Body', val: '10,000', desc: 'Shares executed in this fill.' },
        { tag: '31', name: 'LastPx', type: 'Body', val: '200.00', desc: 'Execution Price for this fill.' },
        { tag: '151', name: 'LeavesQty', type: 'Body', val: '40,000', desc: 'Shares remaining open on order.' },
        { tag: '10', name: 'CheckSum', type: 'Trailer', val: '202', desc: '3-digit checksum verification.' }
      ]
    }
  ];

  const currentFixMsg = fixMessages.find(m => m.id === selectedFixMsgId) || fixMessages[0];
  const selectedTagObj = currentFixMsg.tags.find(t => t.tag === selectedTagNum) || currentFixMsg.tags[0];

  // Algorithmic Slicing Schedule Data (1,000,000 Shares)
  const algoSchedules = {
    twap: {
      name: 'TWAP (Time-Weighted Average Price)',
      objective: 'Slices order into equal volume blocks at equal time intervals throughout the trading day to ensure linear execution.',
      slices: [
        { time: '09:30 - 10:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 1' },
        { time: '10:30 - 11:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 2' },
        { time: '11:30 - 12:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 3' },
        { time: '12:30 - 13:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 4' },
        { time: '13:30 - 14:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 5' },
        { time: '14:30 - 15:30', shares: 142857, pct: 14.3, rationale: 'Equal Time Slice 6' },
        { time: '15:30 - 16:00', shares: 142858, pct: 14.3, rationale: 'Equal Time Slice 7' }
      ]
    },
    vwap: {
      name: 'VWAP (Volume-Weighted Average Price)',
      objective: 'Slices order dynamically to match historical intraday U-shaped volume curve (heavy market open/close, light midday).',
      slices: [
        { time: '09:30 - 10:30', shares: 250000, pct: 25.0, rationale: 'High Market Open Volume Spike' },
        { time: '10:30 - 11:30', shares: 150000, pct: 15.0, rationale: 'Morning Liquidity Stream' },
        { time: '11:30 - 12:30', shares: 80000, pct: 8.0, rationale: 'Midday Lull (Lunch Hour)' },
        { time: '12:30 - 13:30', shares: 70000, pct: 7.0, rationale: 'Midday Low Volume' },
        { time: '13:30 - 14:30', shares: 100000, pct: 10.0, rationale: 'Afternoon Re-activation' },
        { time: '14:30 - 15:30', shares: 150000, pct: 15.0, rationale: 'Pre-Close Institutional Acceleration' },
        { time: '15:30 - 16:00', shares: 200000, pct: 20.0, rationale: 'Market Close Auction Surcharge' }
      ]
    },
    is: {
      name: 'Implementation Shortfall (IS / Arrival Price)',
      objective: 'High-urgency front-loaded slicing algorithm designed to minimize price opportunity risk against arrival price benchmark.',
      slices: [
        { time: '09:30 - 10:30', shares: 400000, pct: 40.0, rationale: 'Aggressive Front-Load Execution' },
        { time: '10:30 - 11:30', shares: 300000, pct: 30.0, rationale: 'Morning Opportunistic Sweep' },
        { time: '11:30 - 12:30', shares: 150000, pct: 15.0, rationale: 'Midday Taper' },
        { time: '12:30 - 13:30', shares: 80000, pct: 8.0, rationale: 'Residual Clean-up' },
        { time: '13:30 - 14:30', shares: 40000, pct: 4.0, rationale: 'Tail Residual' },
        { time: '14:30 - 15:30', shares: 20000, pct: 2.0, rationale: 'Final Residual' },
        { time: '15:30 - 16:00', shares: 10000, pct: 1.0, rationale: 'Complete' }
      ]
    }
  };

  const currentAlgo = algoSchedules[selectedAlgo];

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Front Office: FIX Protocol & Algorithmic Slicing</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Deconstruct raw FIX protocol tag-value messages and simulate institutional TWAP, VWAP, and IS execution algorithms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('fix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fix' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏷️ FIX Protocol Parser
            </button>
            <button
              onClick={() => setActiveTab('algo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'algo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Algo Execution Slicer
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'fix' ? (
        <div className="space-y-6">
          {/* FIX Message Type Selector */}
          <div className="flex flex-wrap gap-2">
            {fixMessages.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedFixMsgId(m.id);
                  setSelectedTagNum(m.tags[0].tag);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                  selectedFixMsgId === m.id
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {m.title}
              </button>
            ))}
          </div>

          {/* Raw FIX String Interactive Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-amber-400 font-bold">RAW FIX STREAM (SOH Delimited)</span>
              <span className="text-slate-500 text-[10px]">{currentFixMsg.desc}</span>
            </div>

            {/* Clickable Tag Badges Stream */}
            <div className="flex flex-wrap gap-1.5 p-4 rounded-xl bg-slate-900 border border-slate-800 leading-relaxed">
              {currentFixMsg.tags.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTagNum(t.tag)}
                  className={`px-2 py-1 rounded border transition-all ${
                    selectedTagNum === t.tag
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-slate-800 text-blue-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-slate-400">{t.tag}=</span>
                  <span className="font-bold">{t.val}</span>
                  <span className="text-slate-500 text-[10px] ml-1">|</span>
                </button>
              ))}
            </div>

            {/* Selected Tag Inspector Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-3 font-sans">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Tag {selectedTagObj.tag}
                  </span>
                  <h4 className="text-base font-bold text-white font-mono">{selectedTagObj.name}</h4>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {selectedTagObj.type} Field
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Decoded Value</span>
                  <span className="text-emerald-400 font-bold text-sm">{selectedTagObj.val}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Operational Impact</span>
                  <span className="text-slate-200 text-[11px] font-sans">{selectedTagObj.desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Algorithmic Execution Simulator */
        <div className="space-y-6">
          {/* Algo Type Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(algoSchedules).map(key => (
              <button
                key={key}
                onClick={() => setSelectedAlgo(key)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedAlgo === key
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-xl scale-[1.02]'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase block mb-1">{key.toUpperCase()}</span>
                <span className="text-sm font-bold text-white block">{algoSchedules[key].name}</span>
              </button>
            ))}
          </div>

          {/* Active Algo Inspector Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-700 pb-4">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase">1,000,000 Share Block Execution Slicer</span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-1">{currentAlgo.name}</h3>
              <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                {currentAlgo.objective}
              </p>
            </div>

            {/* Slicing Schedule Table */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Intraday Execution Slicing Schedule</span>
              {currentAlgo.slices.map((slice, idx) => (
                <div key={idx} className="relative flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="absolute left-0 top-0 bottom-0 bg-indigo-600/20 rounded-xl pointer-events-none" style={{ width: `${slice.pct * 3}%` }} />
                  <span className="font-bold text-amber-400">{slice.time}</span>
                  <span className="text-white font-bold">{slice.shares.toLocaleString()} shares ({slice.pct}%)</span>
                  <span className="text-slate-400 text-[11px] font-sans truncate">{slice.rationale}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 5: The Handshake & The Breakdown ────────────────
export function TradeLifecycleChapter5Widget() {
  const [activeTab, setActiveTab] = useState('allocation'); // 'allocation' | 'ctm'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Block Allocation Breakdown State
  const [allocPercentages, setAllocPercentages] = useState([40, 30, 20, 10]);
  const totalShares = 1000000;
  const avgPrice = 200.12;

  const subAccounts = [
    { name: 'Global Equity Growth Fund', custodian: 'BNY Mellon', bic: 'BKTRUS33XXX', acct: '98104-A', color: 'text-blue-400' },
    { name: 'Pension Balanced Fund', custodian: 'State Street', bic: 'SBTRUS33XXX', acct: '45210-B', color: 'text-emerald-400' },
    { name: 'High Income Opportunity Fund', custodian: 'JP Morgan', bic: 'CHASUS33XXX', acct: '12894-C', color: 'text-purple-400' },
    { name: 'ESG Sustainability Fund', custodian: 'Citi Bank', bic: 'CITIUS33XXX', acct: '77301-D', color: 'text-amber-400' }
  ];

  // DTCC CTM Matching Engine State
  const [priceMismatch, setPriceMismatch] = useState(false);
  const [ssiMismatch, setSsiMismatch] = useState(false);

  const ctmBuySideData = {
    ref: 'CTM_IM_99812',
    isin: 'US0378331005',
    symbol: 'AAPL',
    side: 'BUY',
    qty: 1000000,
    price: priceMismatch ? 200.18 : 200.12,
    tradeDate: '2026-08-09',
    settleDate: '2026-08-10 (T+1)',
    curr: 'USD',
    custodianBic: ssiMismatch ? 'UNKNOWN_BIC' : 'BKTRUS33XXX'
  };

  const ctmSellSideData = {
    ref: 'CTM_BRK_44120',
    isin: 'US0378331005',
    symbol: 'AAPL',
    side: 'SELL',
    qty: 1000000,
    price: 200.12,
    tradeDate: '2026-08-09',
    settleDate: '2026-08-10 (T+1)',
    curr: 'USD',
    custodianBic: 'BKTRUS33XXX'
  };

  const getCtmStatus = () => {
    if (priceMismatch) return { label: 'UNMATCHED / PRICE EXCEPTION', class: 'bg-red-950 text-red-300 border-red-800', icon: '❌', desc: 'Trade Economics Mismatch: Buy-Side price ($200.18) != Broker price ($200.12)' };
    if (ssiMismatch) return { label: 'UNMATCHED / SSI MISMATCH', class: 'bg-amber-950 text-amber-300 border-amber-800', icon: '⚠️', desc: 'Standing Settlement Instruction Mismatch: Custodian BIC invalid' };
    return { label: 'MATCHED / AFFIRMED', class: 'bg-emerald-950 text-emerald-300 border-emerald-800', icon: '✅', desc: 'DTCC CTM Affirmation Complete: Dispatched for Automated CCP Novation' };
  };

  const ctmStatus = getCtmStatus();

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Middle Office: Block Allocation & DTCC CTM Affirmation</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Break block trades into sub-account allocations and simulate DTCC Central Trade Matching (CTM) affirmation mechanics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('allocation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'allocation' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Block Allocation Calculator
            </button>
            <button
              onClick={() => setActiveTab('ctm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ctm' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🤝 DTCC CTM Matching Engine
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'allocation' ? (
        <div className="space-y-6">
          {/* Block Trade Overview Header */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
            <div>
              <span className="text-amber-400 font-bold block text-[10px] uppercase">Executed Block Trade Header</span>
              <h3 className="text-lg font-bold text-white">1,000,000 Shares AAPL @ Avg Price ${avgPrice.toFixed(2)}</h3>
              <span className="text-slate-400 text-[11px] font-sans">Total Gross Settlement Value: <strong className="text-emerald-400">${(totalShares * avgPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <span className="text-slate-500 text-[10px] block font-sans">ALLOCATED PERCENTAGE</span>
              <span className="text-blue-400 font-bold text-sm">100.0% (0 Residual Shares)</span>
            </div>
          </div>

          {/* Sub-Accounts Allocation Breakdown Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">Sub-Account Allocation Breakdown & SSI Matrix</span>

            <div className="grid grid-cols-1 gap-3 font-mono text-xs">
              {subAccounts.map((acc, idx) => {
                const pct = allocPercentages[idx];
                const shares = (totalShares * pct) / 100;
                const grossVal = shares * avgPrice;

                return (
                  <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <span className={`font-bold ${acc.color}`}>{acc.name}</span>
                        <span className="text-slate-500 text-[10px] block font-sans">Custodian: {acc.custodian} | Account: {acc.acct} | BIC: {acc.bic}</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">${grossVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-[11px] w-24 shrink-0 font-sans">Allocation %:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pct}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const newPcts = [...allocPercentages];
                          newPcts[idx] = val;
                          setAllocPercentages(newPcts);
                        }}
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="font-bold text-white w-16 text-right font-mono">{pct}%</span>
                      <span className="text-blue-300 font-bold w-32 text-right font-mono">{shares.toLocaleString()} sh</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: DTCC CTM Matching Engine */
        <div className="space-y-6">
          {/* Controls & Exception Simulator */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">DTCC CTM Trade Confirmation Engine</span>
              <h3 className="text-sm font-bold text-white">Electronic Trade Confirmation (ETC) & Affirmation Matrix</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPriceMismatch(!priceMismatch)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  priceMismatch ? 'bg-red-600 text-white border-red-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {priceMismatch ? '⚠️ Fix Price ($200.12)' : '⚡ Force Price Mismatch ($200.18)'}
              </button>
              <button
                onClick={() => setSsiMismatch(!ssiMismatch)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  ssiMismatch ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {ssiMismatch ? '⚠️ Fix SSI BIC' : '⚡ Force SSI BIC Mismatch'}
              </button>
            </div>
          </div>

          {/* CTM Affirmation Status Banner */}
          <div className={`p-4 rounded-2xl border ${ctmStatus.class} flex items-center justify-between font-mono text-xs shadow-xl`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ctmStatus.icon}</span>
              <div>
                <span className="font-bold text-sm block">{ctmStatus.label}</span>
                <span className="text-[11px] font-sans opacity-90">{ctmStatus.desc}</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Matching Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Investment Manager Side */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-blue-400 font-bold">Buy-Side: Investment Manager Ticket</span>
                <span className="text-slate-500 text-[10px]">{ctmBuySideData.ref}</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Security ISIN:</span>
                  <span className="text-white font-bold">{ctmBuySideData.isin} ({ctmBuySideData.symbol})</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Order Side:</span>
                  <span className="text-emerald-400 font-bold">{ctmBuySideData.side}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Gross Shares Quantity:</span>
                  <span className="text-white font-bold">{ctmBuySideData.qty.toLocaleString()} shares</span>
                </div>
                <div className={`flex justify-between p-2 rounded border ${priceMismatch ? 'bg-red-950/60 border-red-800 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-white'}`}>
                  <span className="text-slate-500">Execution Price:</span>
                  <span>${ctmBuySideData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Settlement Date:</span>
                  <span className="text-white font-bold">{ctmBuySideData.settleDate}</span>
                </div>
                <div className={`flex justify-between p-2 rounded border ${ssiMismatch ? 'bg-amber-950/60 border-amber-800 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-white'}`}>
                  <span className="text-slate-500">Custodian SSI BIC:</span>
                  <span>{ctmBuySideData.custodianBic}</span>
                </div>
              </div>
            </div>

            {/* Executing Broker Side */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-amber-400 font-bold">Sell-Side: Executing Broker Confirmation</span>
                <span className="text-slate-500 text-[10px]">{ctmSellSideData.ref}</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Security ISIN:</span>
                  <span className="text-white font-bold">{ctmSellSideData.isin} ({ctmSellSideData.symbol})</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Order Side:</span>
                  <span className="text-red-400 font-bold">{ctmSellSideData.side}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Gross Shares Quantity:</span>
                  <span className="text-white font-bold">{ctmSellSideData.qty.toLocaleString()} shares</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800 text-white">
                  <span className="text-slate-500">Execution Price:</span>
                  <span className="font-bold">${ctmSellSideData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500">Settlement Date:</span>
                  <span className="text-white font-bold">{ctmSellSideData.settleDate}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800 text-white">
                  <span className="text-slate-500">Custodian SSI BIC:</span>
                  <span className="font-bold">{ctmSellSideData.custodianBic}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 6: CCPs, Novation & Multilateral Netting ───────
export function TradeLifecycleChapter6Widget() {
  const [activeTab, setActiveTab] = useState('novation'); // 'novation' | 'netting'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Novation Architecture State
  const [archMode, setArchMode] = useState('novated'); // 'bilateral' | 'novated'
  const [isDefaulted, setIsDefaulted] = useState(false);

  // Multilateral Netting Engine State
  const [isNetted, setIsNetted] = useState(false);

  const grossTrades = [
    { id: 1, buyer: 'Goldman Sachs', seller: 'Morgan Stanley', shares: 50000, price: 250, val: 12500000 },
    { id: 2, buyer: 'Morgan Stanley', seller: 'JP Morgan', shares: 30000, price: 250, val: 7500000 },
    { id: 3, buyer: 'JP Morgan', seller: 'Citi Bank', shares: 40000, price: 250, val: 10000000 },
    { id: 4, buyer: 'Citi Bank', seller: 'Goldman Sachs', shares: 35000, price: 250, val: 8750000 },
    { id: 5, buyer: 'Goldman Sachs', seller: 'Citi Bank', shares: 15000, price: 250, val: 3750000 },
    { id: 6, buyer: 'Citi Bank', seller: 'Morgan Stanley', shares: 10000, price: 250, val: 2500000 }
  ];

  const netPositions = [
    { broker: 'Goldman Sachs', netShares: '+30,000 (RECEIVE)', netCash: '-$7,500,000 (PAY)', status: 'Net Buyer' },
    { broker: 'Morgan Stanley', netShares: '-10,000 (DELIVER)', netCash: '+$2,500,000 (RECEIVE)', status: 'Net Seller' },
    { broker: 'JP Morgan', netShares: '-10,000 (DELIVER)', netCash: '+$2,500,000 (RECEIVE)', status: 'Net Seller' },
    { broker: 'Citi Bank', netShares: '-10,000 (DELIVER)', netCash: '+$2,500,000 (RECEIVE)', status: 'Net Seller' }
  ];

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">CCPs, Contract Novation & Multilateral Netting</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Simulate Central Counterparty (CCP) risk novation, default waterfall shielding, and multilateral netting compression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('novation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'novation' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚖️ Contract Novation & Default
            </button>
            <button
              onClick={() => setActiveTab('netting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'netting' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📉 Multilateral Netting Engine
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'novation' ? (
        <div className="space-y-6">
          {/* Controls & Architecture Switcher */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">Clearing House Risk Shielding</span>
              <h3 className="text-sm font-bold text-white">Legal Novation: Bilateral Web vs Central Counterparty (CCP)</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setArchMode(archMode === 'novated' ? 'bilateral' : 'novated')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  archMode === 'novated' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {archMode === 'novated' ? '🛡️ CCP Novated View' : '🌐 Bilateral Web View'}
              </button>
              <button
                onClick={() => setIsDefaulted(!isDefaulted)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  isDefaulted ? 'bg-red-600 text-white border-red-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isDefaulted ? '💥 Reset Default Simulator' : '⚡ Simulate Broker C Bankruptcy'}
              </button>
            </div>
          </div>

          {/* Novation / Default Simulation Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-white font-bold">{archMode === 'novated' ? 'Central Counterparty (CCP) Novated Contract Architecture' : 'Bilateral Direct Counterparty Risk Web'}</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold ${archMode === 'novated' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                {archMode === 'novated' ? 'RISK SHIELDED VIA NOVATION' : 'UNSHIELDED BILATERAL RISK'}
              </span>
            </div>

            {/* Default Waterfall Alert Banner */}
            {isDefaulted && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-sans space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-red-400 text-sm">
                  <span>🚨 BROKER C DEFAULT DETECTED</span>
                </div>
                {archMode === 'novated' ? (
                  <p><strong>CCP Risk Shield Active:</strong> Broker C defaulted on a $25M settlement obligation. The CCP absorbed the failure using Broker C's Initial Margin ($15M) and CCP Default Fund ($10M). <strong>Brokers A, B, and D suffered ZERO financial loss!</strong></p>
                ) : (
                  <p><strong>Bilateral Domino Collapse:</strong> Broker C defaulted on direct bilateral trades with Broker A and Broker B. Broker A suffers an unhedged $15M credit loss, triggering systemic contagion across Wall Street!</p>
                )}
              </div>
            )}

            {/* CCP Default Waterfall Layers */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CCP Default Waterfall Protection Layers</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-[11px]">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">LAYER 1</span>
                  <span className="text-amber-400 font-bold">Defaulter Initial Margin</span>
                  <span className="text-[10px] text-slate-400 block">$15,000,000</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">LAYER 2</span>
                  <span className="text-amber-400 font-bold">Defaulter CCP Fund Deposit</span>
                  <span className="text-[10px] text-slate-400 block">$5,000,000</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">LAYER 3</span>
                  <span className="text-blue-400 font-bold">CCP Skin-in-the-Game Equity</span>
                  <span className="text-[10px] text-slate-400 block">$10,000,000</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">LAYER 4</span>
                  <span className="text-emerald-400 font-bold">Mutualized Clearing Pool</span>
                  <span className="text-[10px] text-slate-400 block">$50,000,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Multilateral Netting Compression Engine */
        <div className="space-y-6">
          {/* Netting Controls Bar */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">Settlement Risk & Liquidity Reduction Engine</span>
              <h3 className="text-sm font-bold text-white">Multilateral Netting Trade Compression Matrix</h3>
            </div>

            <button
              onClick={() => setIsNetted(!isNetted)}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md ${
                isNetted ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              }`}
            >
              {isNetted ? '🔄 Reset to 6 Gross Trades' : '⚡ Run Multilateral Netting Compression →'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Gross Trades Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-white font-bold">Gross Executed Trades (6 Bilateral Pipes)</span>
                <span className="text-slate-400 text-[10px]">Gross Cash: $45,000,000</span>
              </div>

              <div className="space-y-2 text-[11px]">
                {grossTrades.map(tr => (
                  <div key={tr.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{tr.buyer} &larr; {tr.seller}</span>
                      <span className="text-white font-bold">{tr.shares.toLocaleString()} shares @ $250</span>
                    </div>
                    <span className="text-amber-400 font-bold">${(tr.val / 1000000).toFixed(2)}M</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Settlement Obligations Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-emerald-400 font-bold">{isNetted ? 'Multilateral Net Obligations (Compressed)' : 'Gross Pending Obligations'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isNetted ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                  {isNetted ? '93.3% LIQUIDITY COMPRESSION' : 'UNCALCULATED NET'}
                </span>
              </div>

              {isNetted ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl space-y-2">
                    <span className="text-emerald-300 font-bold block text-[10px]">CCP Net Settlement Results:</span>
                    {netPositions.map((net, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-white font-bold">{net.broker}</span>
                        <span className="text-amber-300">{net.netShares}</span>
                        <span className="text-emerald-400 font-bold">{net.netCash}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-[11px] font-sans text-slate-300">
                    <span className="text-emerald-400 font-bold block mb-1">Netting Efficiency Impact:</span>
                    <span>Multilateral Netting compressed 6 gross settlements ($45,000,000 gross cash) down to <strong>1 single net cash sweep of $7.5M</strong> and 30k net shares. Total settlement risk reduced by <strong>93.3%!</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-slate-400 font-sans">
                  <span className="text-2xl block">📉</span>
                  <p className="text-xs">Click <strong>"Run Multilateral Netting Compression"</strong> above to see how the CCP compresses 6 gross trades down to net obligations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 7: The Settlement SWIFT Flow (ISO 15022 / 20022) ─
export function TradeLifecycleChapter7Widget() {
  const [activeTab, setActiveTab] = useState('parser'); // 'parser' | 'pipeline'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // SWIFT Parser State
  const [selectedMsgType, setSelectedMsgType] = useState('MT543'); // 'MT541' | 'MT543' | 'MT540' | 'MT542' | 'MT548'
  const [simStep, setSimStep] = useState(1);

  const swiftMessages = {
    MT543: {
      title: 'MT543: Deliver Against Payment (DVP)',
      iso20022: 'sese.023.001.09 (SecuritiesSettlementTransactionInstruction)',
      direction: 'Outbound from Seller Custodian (BNY Mellon) to CSD (DTC)',
      raw: `{1:F01BKTRUS33AXXX0000000000}{2:I543DTC0216XXXXN}{4:
:16R:GENL
:20C::SEME//REF-2026-88120
:23G:NEWM
:22F::SETR//TRAD
:16S:GENL
:16R:TRADDET
:98A::TRAD//20260809
:98A::SETT//20260810
:90B::DEAL//ACTU/USD200,12
:35B:ISIN US0378331005
:16S:TRADDET
:16R:FIAC
:36B::SETT//UNIT/100000,
:16S:FIAC
:16R:SETDET
:22F::SEVT//DVP
:16R:SETPRTY
:95P::PSET//DTC0216
:16S:SETPRTY
:16S:SETDET
:16R:AMT
:19A::SETT//USD200120000,00
:16S:AMT
-}`
    },
    MT541: {
      title: 'MT541: Receive Against Payment (RVP)',
      iso20022: 'sese.023.001.09 (SecuritiesSettlementTransactionInstruction)',
      direction: 'Outbound from Buyer Custodian (State Street) to CSD (DTC)',
      raw: `{1:F01SBTRUS33AXXX0000000000}{2:I541DTC0216XXXXN}{4:
:16R:GENL
:20C::SEME//REF-2026-99411
:23G:NEWM
:22F::SETR//TRAD
:16S:GENL
:16R:TRADDET
:98A::TRAD//20260809
:98A::SETT//20260810
:90B::DEAL//ACTU/USD200,12
:35B:ISIN US0378331005
:16S:TRADDET
:16R:FIAC
:36B::SETT//UNIT/100000,
:16S:FIAC
:16R:SETDET
:22F::SEVT//RVP
:16R:SETPRTY
:95P::PSET//DTC0216
:16S:SETPRTY
:16S:SETDET
:16R:AMT
:19A::SETT//USD200120000,00
:16S:AMT
-}`
    },
    MT548: {
      title: 'MT548: Settlement Status & Processing Advice',
      iso20022: 'sese.024.001.09 (SecuritiesSettlementTransactionStatusAdvice)',
      direction: 'Outbound from CSD (DTC) to Custodians',
      raw: `{1:F01DTC0216XXXX0000000000}{2:I548BKTRUS33AXXXN}{4:
:16R:GENL
:20C::SEME//DTC-STAT-7721
:20C::RELS//REF-2026-88120
:16S:GENL
:16R:STAT
:25D::MTCH//MATCH
:16R:REAS
:24B::MTCH//MACH
:16S:REAS
:16S:STAT
-}`
    }
  };

  const currentMsg = swiftMessages[selectedMsgType] || swiftMessages.MT543;

  const pipelineSteps = [
    { step: 1, title: 'Instruction Dispatch', desc: 'Seller Custodian sends MT543 (DVP) and Buyer Custodian sends MT541 (RVP) to CSD DTC.', status: 'MT543 / MT541 Sent' },
    { step: 2, title: 'CSD Alleged Matching (NMAT)', desc: 'CSD checks trade fields. Mismatch found in SSI BIC -> Dispatches MT548 (Status: NMAT - Unmatched).', status: 'MT548 (NMAT)' },
    { step: 3, title: 'Instruction Amendment (MT530)', desc: 'Custodian sends MT530 Hold/Release amendment to correct SSI BIC.', status: 'MT530 Sent' },
    { step: 4, title: 'CSD Matched Advice (MATCH)', desc: 'CSD re-evaluates trade fields -> Match verified -> Dispatches MT548 (Status: MATCH - Matched).', status: 'MT548 (MATCH)' },
    { step: 5, title: 'DvP Settlement & Confirmations', desc: 'Simultaneous book-entry transfer of stock & Fedwire cash sweep -> Dispatches MT545/MT547 Settlement Confirmations!', status: 'MT545 / MT547 Settled' }
  ];

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Custody SWIFT Pipeline (ISO 15022 / 20022)</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Deconstruct MT54x settlement instructions, MT548 status advice, and simulate real-time CSD custody flows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('parser')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'parser' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📜 SWIFT MT54x Tag Parser
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pipeline' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 Custody Pipeline Simulator
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'parser' ? (
        <div className="space-y-6">
          {/* Message Type Selector Bar */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">SWIFT FIN / ISO 15022 Parser</span>
              <h3 className="text-sm font-bold text-white">Select Custody Settlement Message Type</h3>
            </div>

            <div className="flex gap-2">
              {['MT543', 'MT541', 'MT548'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMsgType(type)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                    selectedMsgType === type ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Message Inspector Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-amber-400 font-bold text-sm block">{currentMsg.title}</span>
                <span className="text-slate-400 text-[10px] font-sans block mt-1">{currentMsg.direction}</span>
                <span className="text-blue-400 text-[10px] font-mono block mt-1">ISO 20022 Equivalent: {currentMsg.iso20022}</span>
              </div>

              <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 text-xs overflow-x-auto leading-relaxed font-mono">
                {currentMsg.raw}
              </pre>
            </div>

            {/* Field Dictionary Reference */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">SWIFT Field Tag Dictionary</span>
              
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:20C::SEME//</span>
                  <p className="text-slate-400 text-[10px] font-sans">Sender's Message Reference</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:22F::SETR//</span>
                  <p className="text-slate-400 text-[10px] font-sans">Type of Settlement Transaction (TRAD)</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:35B:ISIN</span>
                  <p className="text-slate-400 text-[10px] font-sans">Security Identifier (ISIN US0378331005)</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:36B::SETT//</span>
                  <p className="text-slate-400 text-[10px] font-sans">Quantity of Securities to Settle (100,000)</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:19A::SETT//</span>
                  <p className="text-slate-400 text-[10px] font-sans">Settlement Amount ($20,012,000.00)</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold">:95P::PSET//</span>
                  <p className="text-slate-400 text-[10px] font-sans">Place of Settlement BIC (DTC0216)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Custody Settlement Pipeline Simulator */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">CSD Custody Flow Simulator</span>
              <h3 className="text-sm font-bold text-white">5-Step Custodian-to-CSD Settlement Sequencing</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSimStep(Math.max(1, simStep - 1))}
                disabled={simStep === 1}
                className="px-3 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-slate-300 disabled:opacity-40 font-bold"
              >
                ‹ Previous Step
              </button>
              <button
                onClick={() => setSimStep(Math.min(5, simStep + 1))}
                disabled={simStep === 5}
                className="px-3 py-1.5 rounded-lg border bg-blue-600 border-blue-500 text-white disabled:opacity-40 font-bold shadow"
              >
                Next Step ›
              </button>
            </div>
          </div>

          {/* Stepper Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
            {pipelineSteps.map((st) => (
              <div
                key={st.step}
                onClick={() => setSimStep(st.step)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  simStep === st.step
                    ? 'bg-blue-950 border-blue-500 shadow-lg scale-105'
                    : simStep > st.step
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] block font-bold">STEP {st.step}</span>
                <span className="font-bold text-white block mt-1">{st.title}</span>
                <span className="text-[10px] text-amber-400 block mt-2">{st.status}</span>
              </div>
            ))}
          </div>

          {/* Active Step Details Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-white font-bold text-sm">Step {simStep}: {pipelineSteps[simStep - 1].title}</span>
              <span className="text-amber-400 font-bold">{pipelineSteps[simStep - 1].status}</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
              {pipelineSteps[simStep - 1].desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trade Lifecycle Chapter 8: Delivery versus Payment (DvP) Models & CSD ────
export function TradeLifecycleChapter8Widget() {
  const [activeTab, setActiveTab] = useState('dvp'); // 'dvp' | 'ssi'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // DvP Models State
  const [bisModel, setBisModel] = useState('model1'); // 'model1' | 'model2' | 'model3'

  // SSI Routing Engine State
  const [ssiCorrupt, setSsiCorrupt] = useState(false);

  const bisModelData = {
    model1: {
      name: 'BIS Model 1: Gross Securities / Gross Cash',
      desc: 'Simultaneous trade-by-trade gross settlement of both securities and cash throughout the operating day.',
      liquidity: 'HIGH ($100M+ intraday cash required)',
      risk: 'ZERO Principal Risk, ZERO Credit Lag',
      settlementTime: 'Real-Time Continuous (Intraday)'
    },
    model2: {
      name: 'BIS Model 2: Gross Securities / Net Cash',
      desc: 'Securities transfers settle individually on a gross basis throughout the day, while cash settles in an end-of-day net batch sweep.',
      liquidity: 'MEDIUM (60% cash liquidity savings)',
      risk: 'Low Principal Risk, End-of-Day Cash Risk Window',
      settlementTime: 'Continuous Securities / EOD Cash Batch'
    },
    model3: {
      name: 'BIS Model 3: Net Securities / Net Cash',
      desc: 'End-of-day simultaneous multilateral net batch settlement of both securities obligations and cash transfers.',
      liquidity: 'OPTIMAL (95% cash & stock liquidity savings)',
      risk: 'Requires CCP Novation & Margin Waterfall Shielding',
      settlementTime: 'End-of-Day Multilateral Batch (16:00 EST)'
    }
  };

  const currentBis = bisModelData[bisModel];

  const ssiData = {
    market: 'US Equities (DTCC / DTC)',
    custodian: 'BNY Mellon Global Custody',
    bic: ssiCorrupt ? 'CORRUPT_BIC_999' : 'BKTRUS33XXX',
    pset: ssiCorrupt ? 'INVALID_PSET' : 'DTC0216',
    acctId: '98104-ACC-NY',
    cashAba: '021000021'
  };

  return (
    <div
      className={`w-full flex flex-col p-4 md:p-6 bg-slate-900 text-slate-200 font-sans transition-all overflow-y-auto ${
        isFullscreen
          ? 'fixed inset-0 z-[60] rounded-none h-screen w-screen pb-24'
          : 'rounded-xl h-full'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white text-center sm:text-left">Delivery versus Payment (DvP) & DTCC ALERT SSIs</h2>
          <p className="text-slate-400 text-xs md:text-sm text-center sm:text-left">
            Simulate the 3 BIS DvP settlement models and Standing Settlement Instruction (SSI) database enrichment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('dvp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dvp' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚖️ BIS 3 DvP Models
            </button>
            <button
              onClick={() => setActiveTab('ssi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ssi' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 DTCC ALERT SSI Engine
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-all shadow"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🗗 Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {activeTab === 'dvp' ? (
        <div className="space-y-6">
          {/* Model Selector Bar */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">BIS Classification (Bank for International Settlements)</span>
              <h3 className="text-sm font-bold text-white">Select Delivery versus Payment (DvP) Settlement Model</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setBisModel('model1')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  bisModel === 'model1' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Model 1 (Gross-Gross)
              </button>
              <button
                onClick={() => setBisModel('model2')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  bisModel === 'model2' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Model 2 (Gross-Net)
              </button>
              <button
                onClick={() => setBisModel('model3')}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  bisModel === 'model3' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Model 3 (Net-Net)
              </button>
            </div>
          </div>

          {/* Model Inspector Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-amber-400 font-bold text-sm">{currentBis.name}</span>
              <span className="text-slate-400 text-[10px] font-sans">Settlement Window: <strong className="text-white">{currentBis.settlementTime}</strong></span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
              {currentBis.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">LIQUIDITY DEMAND</span>
                <span className="text-blue-400 font-bold">{currentBis.liquidity}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">RISK PROFILE</span>
                <span className="text-emerald-400 font-bold">{currentBis.risk}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: DTCC ALERT SSI Engine */
        <div className="space-y-6">
          {/* SSI Controls & Mismatch Simulator */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-amber-400 font-bold uppercase text-[10px] block">DTCC ALERT Database Engine</span>
              <h3 className="text-sm font-bold text-white">Standing Settlement Instruction (SSI) Routing & Validation</h3>
            </div>

            <button
              onClick={() => setSsiCorrupt(!ssiCorrupt)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                ssiCorrupt ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              }`}
            >
              {ssiCorrupt ? '⚡ Auto-Enrich via DTCC ALERT (Fix SSI)' : '⚡ Simulate SSI Corrupted BIC / PSET Break'}
            </button>
          </div>

          {/* SSI Status Banner */}
          <div className={`p-4 rounded-2xl border ${ssiCorrupt ? 'bg-red-950 text-red-300 border-red-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'} flex items-center justify-between font-mono text-xs shadow-xl`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ssiCorrupt ? '❌' : '✅'}</span>
              <div>
                <span className="font-bold text-sm block">{ssiCorrupt ? 'SSI BREAK / INCORRECT PSET DETECTED' : 'VALIDATED FOR AUTOMATED DVP SETTLEMENT'}</span>
                <span className="text-[11px] font-sans opacity-90">{ssiCorrupt ? 'DTCC ALERT validation failed: Invalid Place of Settlement (PSET) or BIC code' : 'SSIs enriched from DTCC ALERT database match CSD participant records'}</span>
              </div>
            </div>
          </div>

          {/* SSI Field Matrix */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
            <span className="text-white font-bold block border-b border-slate-800 pb-2">Active Standing Settlement Instructions (SSIs)</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-500">Market & Depository:</span>
                <span className="text-white font-bold">{ssiData.market}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-500">Custodian Bank:</span>
                <span className="text-white font-bold">{ssiData.custodian}</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex justify-between ${ssiCorrupt ? 'bg-red-950/60 border-red-800 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-white'}`}>
                <span className="text-slate-500">Custodian BIC Code:</span>
                <span>{ssiData.bic}</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex justify-between ${ssiCorrupt ? 'bg-red-950/60 border-red-800 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-white'}`}>
                <span className="text-slate-500">Place of Settlement (PSET):</span>
                <span>{ssiData.pset}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
