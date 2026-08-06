import React, { useState, useEffect } from 'react';
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

export function CAMVIndicatorWidget() {
  const [activeCamv, setActiveCamv] = useState(null);

  const indicators = [
    {
      id: 'MAND',
      label: 'MAND',
      name: 'Mandatory',
      color: 'bg-red-500',
      description: 'An event dictated by the issuer that applies to all eligible shareholders universally. No election or instruction is required.',
      focus: 'Unconditional entitlement application. Custodian calculates automatically based on settled position.',
      events: ['Cash Dividend (DVCA)', 'Stock Split (SPLF)', 'Merger (MRGR)']
    },
    {
      id: 'VOLU',
      label: 'VOLU',
      name: 'Voluntary',
      color: 'bg-blue-500',
      description: 'An event where the issuer makes an offer, but the shareholder must actively elect to participate. Missing the deadline means no action.',
      focus: 'Managing instruction deadlines and MT565 messages. Buyer protection and guaranteed delivery are critical.',
      events: ['Tender Offer (TEND)', 'Dutch Auction (DTCH)', 'Rights Subscription (EXRI)']
    },
    {
      id: 'CHOS',
      label: 'CHOS',
      name: 'Mandatory with Options',
      color: 'bg-purple-500',
      description: 'The event WILL happen, but the issuer provides a menu of options. Crucially, every CHOS event contains a Default Option.',
      focus: 'Reconciliation of elected vs default entitlements. Ensuring sum of elected + default exactly equals total eligible position.',
      events: ['Dividend Reinvestment Plan (DRIP)', 'Cash Dividend with Stock Option (DVOP)']
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl font-sans text-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">SWIFT CAMV Indicators (MT564)</h2>
      
      <div className="flex gap-4 mb-8">
        {indicators.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setActiveCamv(ind.id)}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeCamv === ind.id 
                ? `${ind.color} text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105` 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl min-h-[250px] relative">
        <AnimatePresence mode="wait">
          {activeCamv ? (
            <motion.div
              key={activeCamv}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"
            >
              {indicators.filter(i => i.id === activeCamv).map(ind => (
                <div key={ind.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-3 h-3 rounded-full ${ind.color}`}></span>
                    <h3 className="text-xl font-bold text-white">{ind.name}</h3>
                  </div>
                  
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {ind.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Operations Focus</h4>
                      <p className="text-sm text-slate-300">{ind.focus}</p>
                    </div>
                    
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Key SWIFT Events</h4>
                      <ul className="list-disc pl-4 text-sm text-slate-300 space-y-1">
                        {ind.events.map((ev, i) => <li key={i}>{ev}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl p-8"
            >
              Select a CAMV Indicator above to explore its definition and operations focus.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Chapter 3 Widget 1: CA Lifecycle Dates ──────────────────────────────────
const LIFECYCLE_DATES = [
  {
    id: 'announcement',
    label: 'Announcement Date',
    shortLabel: 'Announce',
    color: '#6366f1',
    icon: '📢',
    swiftTag: ':98A::ANOU//',
    definition: "The date the issuer's Board of Directors officially approves and announces the corporate action to the market.",
    operationsFocus: "Triggers the Golden Copy data scrubbing process. The ops team validates rates and dates against Bloomberg, Reuters, and SIX Financial simultaneously. Any discrepancy between vendors is flagged as a 'Rate Conflict' and escalated before broadcasting to downstream clients.",
    marketImpact: "Stock price often moves on rumour before the announcement. After confirmation, the market re-prices based on the dividend yield or ratio economics.",
    analystTip: "Always check the vendor source. Bloomberg may publish the Record Date a day earlier than SIX due to timezone normalization differences. The custodian's source of record must be documented.",
    example: "Apple Inc. (AAPL) Board announces on 25th Jan: \"We declare a USD 0.25 dividend per share. Record Date: 10th Feb. Pay Date: 16th Feb.\""
  },
  {
    id: 'cum',
    label: 'Cum-Date',
    shortLabel: 'Cum-Date',
    color: '#f59e0b',
    icon: '⏳',
    swiftTag: ':98A::LDAT// (Last Trading Date)',
    definition: "The final trading day on which a buyer can purchase the security on the open market and still legally receive the entitlement.",
    operationsFocus: "Any trade executed (and failing to settle) on or before this date must trigger a Market Claim. If a seller's position settles after the Record Date snapshot, the custodian must file a claim to forcibly recover the entitlement from the seller and credit it to the buyer.",
    marketImpact: "Heavy buying pressure is common on the Cum-Date as investors try to capture the entitlement. Volume spikes are typical.",
    analystTip: "The Cum-Date is the last day YOU can act. In T+1 markets, it is typically one business day before the Ex-Date. In T+2 markets, two business days before Record Date.",
    example: "AAPL Cum-Date: 9th Feb (T+1 market). If you buy AAPL on 9th Feb, your trade settles on 10th Feb (Record Date). You ARE entitled to the dividend."
  },
  {
    id: 'exdate',
    label: 'Ex-Date',
    shortLabel: 'Ex-Date',
    color: '#ef4444',
    icon: '🚫',
    swiftTag: ':98A::XDTE//',
    definition: "The date the security begins trading WITHOUT the value of the corporate action attached. Buying on this date means you are too late to receive the entitlement.",
    operationsFocus: "The exchange applies a 'Price Adjustment' at market open — the opening price is artificially marked down by the dividend value (or adjusted by the split ratio). This prevents arbitrage exploitation overnight.",
    marketImpact: "For a USD 0.25 dividend on AAPL: If AAPL closed at USD 200.00 on Cum-Date, the exchange sets the reference opening price at USD 199.75 on Ex-Date.",
    analystTip: "Ex-Date confusion is the #1 source of entitlement disputes. If a client complains they 'missed' a dividend, always ask: what date did they BUY the stock? If it was on or after the Ex-Date, they have no legal entitlement.",
    example: "AAPL Ex-Date: 10th Feb. If you buy AAPL on 10th Feb, you get the stock at ~$199.75 but receive NO dividend. The previous owner who sold to you keeps the $0.25 dividend."
  },
  {
    id: 'record',
    label: 'Record Date',
    shortLabel: 'Record',
    color: '#10b981',
    icon: '📸',
    swiftTag: ':98A::RDTE//',
    definition: "The date the issuer takes a final 'snapshot' of the official shareholder register. Only shareholders whose trades have fully settled by this date are legally entitled to receive the corporate action proceeds.",
    operationsFocus: "The critical reconciliation point. The custodian's settled position on Record Date must exactly match the issuer's register. Any shortfall triggers a 'Short Position' investigation. Fails (unsettled trades) that span the Record Date require immediate resolution via market claims or fails management protocols.",
    marketImpact: "Invisible to the open market. The Record Date is an internal administrative snapshot, not a trading event. The market has already adjusted on the Ex-Date.",
    analystTip: "Record Date ≠ Ex-Date. Confusing these two dates is a career-limiting mistake. In T+1 markets they often coincide, but never assume. Always check the SWIFT MT564 field :98A::RDTE// explicitly.",
    example: "AAPL Record Date: 10th Feb. The DTCC takes a snapshot at close of business. All settled AAPL holders on the register receive $0.25/share on Pay Date."
  },
  {
    id: 'paydate',
    label: 'Pay Date',
    shortLabel: 'Pay Date',
    color: '#8b5cf6',
    icon: '💰',
    swiftTag: ':98A::PAYD//',
    definition: "The date the Depository (e.g., DTCC, Euroclear) distributes the cash or new securities to Global Custodians, who then cascade the payments down to sub-custodians and ultimately credit each beneficial owner's account.",
    operationsFocus: "The ops team runs a final entitlement calculation: Settled Position × Rate = Gross Entitlement. Tax withholding (WHT) is then deducted based on the beneficial owner's tax status and treaty eligibility. Net Entitlement is then posted.",
    marketImpact: "For cash dividends, the cash hits accounts. For stock dividends or splits, new share lines are created in the custodian's books. For scrip/DRIP elections, shares are purchased in the open market and allocated.",
    analystTip: "Tax is the most complex part of Pay Date processing. The same dividend may result in 5 different net amounts for 5 investors from different countries. Always verify WHT rates against the active tax treaty, not a cached spreadsheet.",
    example: "AAPL Pay Date: 16th Feb. DTCC credits custodians. Investor holding 10,000 AAPL shares receives: 10,000 × $0.25 = $2,500 gross. After 0% WHT (US-US): Net $2,500 credited to account."
  }
];

export function CALifecycleDatesWidget() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const active = LIFECYCLE_DATES[activeIdx];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">The 5-Date Lifecycle of a Corporate Action</h2>

      {/* Timeline Navigation */}
      <div className="relative flex items-center justify-between mb-8 px-2">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-700 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 z-0 transition-all duration-500"
          style={{
            backgroundColor: active.color,
            width: `${(activeIdx / (LIFECYCLE_DATES.length - 1)) * 100}%`,
            boxShadow: `0 0 8px ${active.color}`
          }}
        />
        {LIFECYCLE_DATES.map((date, i) => (
          <button
            key={date.id}
            onClick={() => { setActiveIdx(i); setShowTip(false); }}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 border-2"
              style={{
                backgroundColor: i <= activeIdx ? active.color : '#1e293b',
                borderColor: i === activeIdx ? active.color : '#334155',
                boxShadow: i === activeIdx ? `0 0 14px ${active.color}` : 'none',
                transform: i === activeIdx ? 'scale(1.25)' : 'scale(1)'
              }}
            >
              {date.icon}
            </div>
            <span className={`text-xs font-semibold hidden md:block transition-colors ${i === activeIdx ? 'text-white' : 'text-slate-500'}`}>{date.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{active.icon}</span>
                <h3 className="text-xl md:text-2xl font-black text-white">{active.label}</h3>
              </div>
              <code className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: active.color + '30', color: active.color }}>
                SWIFT {active.swiftTag}
              </code>
            </div>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
            {active.definition}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: active.color }}>⚙ Operations Focus</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{active.operationsFocus}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: active.color }}>📈 Market Impact</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{active.marketImpact}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800 border border-blue-500/30 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-400">🍎 Live Example: Apple (AAPL) Dividend</h4>
            <p className="text-sm text-blue-200 leading-relaxed font-mono">{active.example}</p>
          </div>

          <button
            onClick={() => setShowTip(t => !t)}
            className="w-full text-left p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
          >
            <span className="text-yellow-400 font-bold text-sm">💡 Senior Analyst Tip {showTip ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-yellow-200 leading-relaxed p-4 bg-yellow-500/10 rounded-b-lg border border-t-0 border-yellow-500/30">
                  {active.analystTip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => { setActiveIdx(i => Math.max(0, i - 1)); setShowTip(false); }}
          disabled={activeIdx === 0}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold disabled:opacity-30 hover:bg-slate-700 transition-colors text-sm"
        >← Previous</button>
        <span className="text-slate-500 text-sm self-center">{activeIdx + 1} / {LIFECYCLE_DATES.length}</span>
        <button
          onClick={() => { setActiveIdx(i => Math.min(LIFECYCLE_DATES.length - 1, i + 1)); setShowTip(false); }}
          disabled={activeIdx === LIFECYCLE_DATES.length - 1}
          className="px-4 py-2 rounded-lg font-semibold disabled:opacity-30 hover:opacity-90 transition-opacity text-sm text-white"
          style={{ backgroundColor: active.color }}
        >Next →</button>
      </div>
    </div>
  );
}

// ─── Chapter 3 Widget 2: T+1 vs T+2 vs T+0 Settlement Simulator ──────────────
const SETTLEMENT_SCENARIOS = {
  'T+2': {
    label: 'T+2 (Europe)',
    color: '#6366f1',
    description: 'T+2: Trades take 2 business days to settle. Ex-Date is set 1 business day BEFORE Record Date. (e.g., most European markets: LSE, Euronext, XETRA)',
    days: [
      { label: 'Mon 8 Feb', role: 'Cum-Date', note: 'Buy here → settles Wed 10 Feb (Record Date) ✅ ENTITLED. Last chance to buy and receive the entitlement.', color: '#10b981', emoji: '✅' },
      { label: 'Tue 9 Feb', role: 'Ex-Date', note: 'Buy here → settles Thu 11 Feb (AFTER Record Date) ❌ NOT ENTITLED. Stock opens marked down by dividend value.', color: '#ef4444', emoji: '❌' },
      { label: 'Wed 10 Feb', role: 'Record Date', note: '📸 Snapshot taken at close of business. Issuer/transfer agent freezes the register. Only fully settled positions are entitled.', color: '#8b5cf6', emoji: '📸' },
      { label: 'Thu 11 Feb', role: 'Normal Day', note: 'Normal trading day. No corporate action impact.', color: '#475569', emoji: '—' },
      { label: 'Fri 12 Feb', role: 'Pay Date', note: '💰 DTCC / Euroclear credits global custodians. Entitlement cascades down to beneficial owners.', color: '#f59e0b', emoji: '💰' },
    ]
  },
  'T+1': {
    label: 'T+1 (US / India)',
    color: '#10b981',
    description: 'T+1: Trades settle the next business day. Ex-Date and Record Date are the SAME day. (US Markets since May 2024, India NSE/BSE since Jan 2023)',
    days: [
      { label: 'Tue 9 Feb', role: 'Cum-Date', note: 'Buy here → settles Wed 10 Feb (Record Date) ✅ ENTITLED. This is the last day to guarantee entitlement.', color: '#10b981', emoji: '✅' },
      { label: 'Wed 10 Feb', role: 'Ex-Date = Record Date', note: 'Buy here → settles Thu 11 Feb (AFTER Record Date) ❌ NOT ENTITLED. Snapshot also taken today. Both Ex-Date and Record Date collapse into one.', color: '#ef4444', emoji: '❌📸' },
      { label: 'Thu 11 Feb', role: 'Normal Day', note: 'Normal trading day. No corporate action impact.', color: '#475569', emoji: '—' },
      { label: 'Fri 12 Feb', role: 'Normal Day', note: 'Normal trading day.', color: '#475569', emoji: '—' },
      { label: 'Mon 15 Feb', role: 'Pay Date', note: '💰 Cash / securities credited to entitled holders\'s accounts.', color: '#f59e0b', emoji: '💰' },
    ]
  },
  'T+0': {
    label: 'T+0 (India Pilot)',
    color: '#f59e0b',
    description: 'T+0 (Same-Day Settlement): Trades settle on the same day. The Cum-Date becomes the Record Date itself — you can buy and be entitled on the SAME day. (SEBI India optional pilot, top 500 stocks, active since 2024)',
    days: [
      { label: 'Tue 9 Feb', role: 'Cum-Date = Record Date', note: 'Buy before the T+0 cut-off time (e.g., 1:30 PM) → settles same day Wed 9 Feb ✅ ENTITLED. This is the only market where you can buy and be on the Record Date the SAME day.', color: '#10b981', emoji: '✅📸' },
      { label: 'Wed 10 Feb', role: 'Ex-Date', note: 'Buy here → settles same day Wed 10 Feb, which is AFTER Record Date ❌ NOT ENTITLED. In T+0, Ex-Date is the day AFTER Record Date (the opposite of T+1/T+2 intuition!)', color: '#ef4444', emoji: '❌' },
      { label: 'Thu 11 Feb', role: 'Normal Day', note: 'Normal trading day. No corporate action impact.', color: '#475569', emoji: '—' },
      { label: 'Fri 12 Feb', role: 'Normal Day', note: 'Normal trading day.', color: '#475569', emoji: '—' },
      { label: 'Mon 15 Feb', role: 'Pay Date', note: '💰 Cash / securities credited to entitled holders. SEBI: CA securities excluded from T+0 segment on ex-date to prevent confusion.', color: '#f59e0b', emoji: '💰' },
    ]
  }
};

export function CASettlementCycleWidget() {
  const [mode, setMode] = useState('T+1');
  const [activeDayIdx, setActiveDayIdx] = useState(null);
  const scenario = SETTLEMENT_SCENARIOS[mode];

  useEffect(() => { setActiveDayIdx(null); }, [mode]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Settlement Cycle Simulator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Toggle between T+2, T+1, and T+0 to see how Ex-Date vs Record Date shifts across global markets</p>

      <div className="flex gap-3 mb-6 justify-center">
        {Object.entries(SETTLEMENT_SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className="px-6 py-3 rounded-xl font-bold text-base transition-all"
            style={{
              backgroundColor: mode === key ? s.color : '#1e293b',
              color: 'white',
              boxShadow: mode === key ? `0 0 16px ${s.color}80` : 'none',
              transform: mode === key ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm text-slate-300 text-center mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700"
        >
          {scenario.description}
        </motion.p>
      </AnimatePresence>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {scenario.days.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDayIdx(activeDayIdx === i ? null : i)}
            className="flex flex-col items-center p-3 rounded-xl border transition-all text-center"
            style={{
              backgroundColor: activeDayIdx === i ? day.color + '25' : '#1e293b',
              borderColor: activeDayIdx === i ? day.color : '#334155',
              boxShadow: activeDayIdx === i ? `0 0 12px ${day.color}50` : 'none'
            }}
          >
            <span className="text-xl mb-1">{day.emoji}</span>
            <span className="text-xs font-bold text-white">{day.label}</span>
            <span className="text-xs mt-1 font-semibold" style={{ color: day.color }}>{day.role}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeDayIdx !== null ? (
          <motion.div
            key={`${mode}-${activeDayIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: scenario.days[activeDayIdx].color + '15',
              borderColor: scenario.days[activeDayIdx].color + '60'
            }}
          >
            <p className="text-sm leading-relaxed font-bold" style={{ color: scenario.days[activeDayIdx].color }}>
              {scenario.days[activeDayIdx].label} — {scenario.days[activeDayIdx].role}
            </p>
            <p className="text-sm text-slate-300 mt-1">{scenario.days[activeDayIdx].note}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl border border-dashed border-slate-700 text-center text-slate-500 text-sm"
          >
            Click any day above to see what happens to your entitlement
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Chapter 4 Widget 1: SWIFT STP Flow Visualizer ───────────────────────────
export function SwiftStpFlowWidget() {
  const [eventType, setEventType] = useState('voluntary'); // 'mandatory' | 'voluntary' | 'choice'
  const [standard, setStandard] = useState('15022'); // '15022' | '20022'
  const [activeStep, setActiveStep] = useState(0);

  const is15022 = standard === '15022';

  const flows = {
    mandatory: [
      {
        step: 1,
        sender: 'Depository / CSD',
        receiver: 'Global Custodian',
        iso15022: 'MT564 (NEWM)',
        iso20022: 'seev.031.001',
        title: 'Corporate Action Notification',
        direction: 'downstream',
        color: '#3b82f6',
        desc: 'Depository broadcasts mandatory event details (ISIN, rate, ex-date, record date).',
        ops: 'Scrubbed against Bloomberg/Reuters to construct Golden Copy.'
      },
      {
        step: 2,
        sender: 'Global Custodian',
        receiver: 'Beneficial Owner / Fund',
        iso15022: 'MT564 (REPE/NEWM)',
        iso20022: 'seev.031.001',
        title: 'Cascaded Client Advice',
        direction: 'downstream',
        color: '#6366f1',
        desc: 'Custodian calculates eligible position on Record Date and notifies client.',
        ops: 'No client instruction required for mandatory events.'
      },
      {
        step: 3,
        sender: 'Depository',
        receiver: 'Global Custodian',
        iso15022: 'MT202 / MT566',
        iso20022: 'pacs.009 / seev.036',
        title: 'Depository Payment & Settlement',
        direction: 'downstream',
        color: '#10b981',
        desc: 'Depository releases cash (MT202 interbank transfer) and sends MT566 payment confirmation.',
        ops: 'Cash credited to custodian nostro account.'
      },
      {
        step: 4,
        sender: 'Global Custodian',
        receiver: 'Beneficial Owner',
        iso15022: 'MT566 Confirmation',
        iso20022: 'seev.036.001',
        title: 'Client Account Credit & Statement',
        direction: 'downstream',
        color: '#8b5cf6',
        desc: 'Final entitlement credited to client cash/securities account after withholding tax deduction.',
        ops: 'Reconciled against expected entitlement.'
      }
    ],
    voluntary: [
      {
        step: 1,
        sender: 'Depository / CSD',
        receiver: 'Global Custodian',
        iso15022: 'MT564 Notification',
        iso20022: 'seev.031.001',
        title: 'Event Announcement & Offer Terms',
        direction: 'downstream',
        color: '#3b82f6',
        desc: 'Announces voluntary offer (e.g. Tender Offer @ $50/share with deadline 15th Feb).',
        ops: 'Scrub terms, option codes (TEND), and market deadlines.'
      },
      {
        step: 2,
        sender: 'Beneficial Owner / Manager',
        receiver: 'Global Custodian',
        iso15022: 'MT565 Instruction',
        iso20022: 'seev.033.001',
        title: 'Client Election Instruction',
        direction: 'upstream',
        color: '#f59e0b',
        desc: 'Client instructs election: e.g. "Tender 10,000 shares under Option 1".',
        ops: 'Validate settled position. Check if client has sufficient unencumbered shares.'
      },
      {
        step: 3,
        sender: 'Global Custodian System',
        receiver: 'Internal Ledger',
        iso15022: 'MT508 Intra-Position Advice',
        iso20022: 'semt.006.001',
        title: 'Share Blocking / Reservation',
        direction: 'internal',
        color: '#ec4899',
        desc: 'Moves 10,000 shares from "Available" to "Blocked/Earmarked" sub-balance.',
        ops: 'Prevents client from selling shares on open market while tender is pending.'
      },
      {
        step: 4,
        sender: 'Global Custodian',
        receiver: 'Beneficial Owner',
        iso15022: 'MT567 Status & Advice',
        iso20022: 'seev.034.001',
        title: 'Instruction Ack / Validation Status',
        direction: 'downstream',
        color: '#10b981',
        desc: 'Sends status code: PACK (Accepted) or REJT (Rejected with reason code).',
        ops: 'If rejected (e.g., LATE or DQUA shortfall), analyst alerts client immediately.'
      },
      {
        step: 5,
        sender: 'Global Custodian',
        receiver: 'Depository / Agent',
        iso15022: 'MT565 Aggregated Instruction',
        iso20022: 'seev.033.001',
        title: 'Bulk Market Election Submission',
        direction: 'upstream',
        color: '#06b6d4',
        desc: 'Custodian aggregates all client elections and sends bulk MT565 to Depository.',
        ops: 'Must be delivered before market cut-off (Guaranteed Delivery rules apply).'
      },
      {
        step: 6,
        sender: 'Depository / Custodian',
        receiver: 'Beneficial Owner',
        iso15022: 'MT566 + MT202 Settlement',
        iso20022: 'seev.036 + pacs.009',
        title: 'Entitlement Payment & Debiting',
        direction: 'downstream',
        color: '#8b5cf6',
        desc: 'Tendered shares debited; cash credited via MT202 RTGS transfer. MT566 issued.',
        ops: 'Unblock unused shares if pro-rata scaling occurred.'
      }
    ],
    choice: [
      {
        step: 1,
        sender: 'Depository',
        receiver: 'Global Custodian',
        iso15022: 'MT564 (CAMV//CHOS)',
        iso20022: 'seev.031.001',
        title: 'Choice Announcement with Default',
        direction: 'downstream',
        color: '#3b82f6',
        desc: 'Announces Dividend Option (Option 1: Cash, Option 2: Stock DRIP, Default: Cash).',
        ops: 'Verify default option rules in case client does not respond.'
      },
      {
        step: 2,
        sender: 'Client (Optional)',
        receiver: 'Global Custodian',
        iso15022: 'MT565 Election',
        iso20022: 'seev.033.001',
        title: 'Client Election (if non-default)',
        direction: 'upstream',
        color: '#f59e0b',
        desc: 'Client elects Option 2 (Stock DRIP). If no MT565 sent, Default Option 1 applies.',
        ops: 'Monitor deadline. Reconcile elected vs default balances.'
      },
      {
        step: 3,
        sender: 'Global Custodian',
        receiver: 'FX Desk / Market',
        iso15022: 'MT304 FX Advice / Cover',
        iso20022: 'trck.001 / camt',
        title: 'Currency Conversion (if applicable)',
        direction: 'internal',
        color: '#eab308',
        desc: 'If dividend declared in EUR but client wants USD, MT304 confirms corporate FX rate.',
        ops: 'Execute corporate action FX cover trade.'
      },
      {
        step: 4,
        sender: 'Global Custodian',
        receiver: 'Client',
        iso15022: 'MT566 Confirmation',
        iso20022: 'seev.036.001',
        title: 'Allocation & Final Confirmation',
        direction: 'downstream',
        color: '#8b5cf6',
        desc: 'New stock units allocated or cash credited depending on election.',
        ops: 'Post final ledger entries.'
      }
    ]
  };

  const currentFlow = flows[eventType];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">SWIFT STP Message Flow Visualizer</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Trace end-to-end Straight-Through Processing (STP) across the custody chain</p>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
        {/* Event Type Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event:</span>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            {['mandatory', 'voluntary', 'choice'].map((t) => (
              <button
                key={t}
                onClick={() => { setEventType(t); setActiveStep(0); }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                  eventType === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Messaging Standard Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Standard:</span>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setStandard('15022')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                is15022 ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ISO 15022 (MT)
            </button>
            <button
              onClick={() => setStandard('20022')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                !is15022 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ISO 20022 (XML seev)
            </button>
          </div>
        </div>
      </div>

      {/* Flow Diagram Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flow List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Steps</h3>
          {currentFlow.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                activeStep === idx
                  ? 'bg-slate-800 border-blue-500 shadow-lg scale-[1.01]'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {is15022 ? item.iso15022 : item.iso20022}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate leading-tight">{item.title}</div>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono shrink-0">
                {item.direction === 'downstream' ? '⬇' : item.direction === 'upstream' ? '⬆' : '🔄'}
              </span>
            </button>
          ))}
        </div>

        {/* Right Column: Active Step Details */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-xl">
          {currentFlow[activeStep] && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${eventType}-${standard}-${activeStep}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 shrink-0">
                      Step {currentFlow[activeStep].step} of {currentFlow.length}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {currentFlow[activeStep].title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 shrink-0 self-start sm:self-auto">
                    {is15022 ? currentFlow[activeStep].iso15022 : currentFlow[activeStep].iso20022}
                  </span>
                </div>

                {/* Actor Diagram */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/80 flex items-center justify-around text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">🏦</span>
                    <span className="text-xs font-bold text-slate-300">{currentFlow[activeStep].sender}</span>
                    <span className="text-[10px] text-slate-500">Sender</span>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-blue-400 mb-1">
                      {is15022 ? currentFlow[activeStep].iso15022 : currentFlow[activeStep].iso20022}
                    </span>
                    <div className="w-full h-0.5 bg-blue-500/50 relative flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 capitalize">
                      {currentFlow[activeStep].direction} SWIFT Message
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">👤</span>
                    <span className="text-xs font-bold text-slate-300">{currentFlow[activeStep].receiver}</span>
                    <span className="text-[10px] text-slate-500">Receiver</span>
                  </div>
                </div>

                {/* Purpose Description */}
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Functional Purpose</h5>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentFlow[activeStep].desc}
                  </p>
                </div>

                {/* Operations Focus */}
                <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/40">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">⚙ Senior Analyst Operations Focus</h5>
                  <p className="text-sm text-blue-200 leading-relaxed">
                    {currentFlow[activeStep].ops}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Stepper Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-700/60 mt-4">
            <button
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded bg-slate-700 text-xs font-bold text-slate-200 disabled:opacity-30 hover:bg-slate-600"
            >
              ← Prev Step
            </button>
            <span className="text-xs text-slate-500">
              Click any step to inspect SWIFT payloads
            </span>
            <button
              onClick={() => setActiveStep(s => Math.min(currentFlow.length - 1, s + 1))}
              disabled={activeStep === currentFlow.length - 1}
              className="px-3 py-1.5 rounded bg-blue-600 text-xs font-bold text-white disabled:opacity-30 hover:bg-blue-500"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter 4 Widget 2: Comprehensive SWIFT Message Dictionary ─────────────
const SWIFT_DICTIONARY = [
  {
    cat: 'Core Corporate Actions',
    mt: 'MT564',
    iso20022: 'seev.031',
    name: 'Corporate Action Notification',
    direction: 'Downstream',
    lifecyclePhase: 'Announcement / Ex-Date / Record Date',
    purpose: 'Broadcasts details of an upcoming corporate action to clients and custodians.',
    keyFields: ':22F::CAEV (Event Type), :22F::CAMV (Mandatory/Voluntary), :98A:: (Dates), :92A:: (Rates)',
    analystNote: 'Must be scrubbed against multiple vendors (Bloomberg, Refinitiv) to construct the Golden Copy before broadcasting.'
  },
  {
    cat: 'Core Corporate Actions',
    mt: 'MT565',
    iso20022: 'seev.033',
    name: 'Corporate Action Instruction',
    direction: 'Upstream',
    lifecyclePhase: 'Voluntary / Choice Election Window',
    purpose: 'Sent by beneficial owner or investment manager to elect options on Voluntary (VOLU) or Choice (CHOS) events.',
    keyFields: ':13A::CAON (Option Number), :93B::ELIG (Eligible Quantity), :93B::INSTRUCTED (Quantity Tendered)',
    analystNote: 'Requires balance validation. Instructing on more than the settled eligible position results in rejection.'
  },
  {
    cat: 'Core Corporate Actions',
    mt: 'MT567',
    iso20022: 'seev.034',
    name: 'Corporate Action Instruction Status & Advice',
    direction: 'Downstream',
    lifecyclePhase: 'Post-Instruction Validation',
    purpose: 'Acknowledges receipt of MT565 and reports acceptance (PACK) or rejection (REJT) with error reason codes.',
    keyFields: ':24B::STAT (Status Code), :24B::REAS (Reason Code: e.g. LATE, DQUA, OPTI)',
    analystNote: 'Rejection reasons must be monitored in real-time to rectify client election errors before market cut-off.'
  },
  {
    cat: 'Core Corporate Actions',
    mt: 'MT566',
    iso20022: 'seev.036',
    name: 'Corporate Action Confirmation',
    direction: 'Downstream',
    lifecyclePhase: 'Pay Date / Value Date',
    purpose: 'Confirms that cash proceeds or new securities have been credited to (or debited from) the account.',
    keyFields: ':19A::PAYS (Gross Amount), :19A::WITX (Withholding Tax), :19A::NETA (Net Amount), :93B::POST (Posted Units)',
    analystNote: 'Triggers final post-payment reconciliation between expected entitlement and actual cash/security posting.'
  },
  {
    cat: 'Core Corporate Actions',
    mt: 'MT568',
    iso20022: 'seev.038',
    name: 'Corporate Action Narrative',
    direction: 'Downstream',
    lifecyclePhase: 'Any Lifecycle Phase',
    purpose: 'Provides free-text narrative details for complex restructurings, legal clauses, or AGM agenda details.',
    keyFields: ':70E::ADTX (Additional Text), :70E::TXER (Tax Explanation)',
    analystNote: 'Free-text breaks Straight-Through Processing (STP) and requires manual reading by middle-office analysts.'
  },
  {
    cat: 'Auxiliary & Cash Management',
    mt: 'MT508',
    iso20022: 'semt.006',
    name: 'Intra-Position Advice / Block Instruction',
    direction: 'Internal / Custodian Ledger',
    lifecyclePhase: 'Voluntary Election Window (Pre-Pay Date)',
    purpose: 'Instructs the internal custody ledger to transfer securities from "Unrestricted Available" to "Blocked/Earmarked" sub-balance.',
    keyFields: ':93B::BLOK (Blocked Quantity), :22F::SETT (Sub-balance indicator)',
    analystNote: 'Crucial for risk management. Prevents a client from selling tendered shares on the open market while a tender offer is pending.'
  },
  {
    cat: 'Auxiliary & Cash Management',
    mt: 'MT202',
    iso20022: 'pacs.009',
    name: 'Financial Institution Funds Transfer (Cover Payment)',
    direction: 'Interbank RTGS',
    lifecyclePhase: 'Pay Date (Cash Settlement)',
    purpose: 'Executes interbank cash settlement between custodian correspondent banks when cash proceeds are paid separately from securities.',
    keyFields: ':32A:: (Value Date, Currency, Interbank Amount), :53A:: (Sender Correspondent), :58A:: (Beneficiary Institution)',
    analystNote: 'Used on Pay Date to transfer large dividend cash pools from the issuer paying agent to global custodians via Fedwire/CHIPS/TARGET2.'
  },
  {
    cat: 'Auxiliary & Cash Management',
    mt: 'MT304',
    iso20022: 'trck.001 / FX Cover',
    name: 'Advice of FX Instruction / Corporate Action FX Cover',
    direction: 'Internal / FX Desk',
    lifecyclePhase: 'Pay Date / Pre-Pay Date Currency Conversion',
    purpose: 'Confirms corporate action foreign exchange conversions (e.g. converting a Japanese Yen dividend into USD for US investors).',
    keyFields: ':36:: (Exchange Rate), :32B:: (Bought Amount), :33B:: (Sold Amount)',
    analystNote: 'Used when dividends are declared in one currency but beneficial owners require payout in their local home currency.'
  }
];

export function SwiftDictionaryWidget() {
  const [filterCat, setFilterCat] = useState('All');
  const [selectedMsg, setSelectedMsg] = useState(SWIFT_DICTIONARY[0]);

  const categories = ['All', 'Core Corporate Actions', 'Auxiliary & Cash Management'];

  const filtered = filterCat === 'All' 
    ? SWIFT_DICTIONARY 
    : SWIFT_DICTIONARY.filter(m => m.cat === filterCat);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">SWIFT Corporate Actions Message Dictionary</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Interactive reference guide for MT5xx, MT202, MT508, and MT304 protocols</p>

      {/* Category Filter */}
      <div className="flex gap-2 justify-center mb-6">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterCat === c ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Message List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map(msg => (
            <button
              key={msg.mt}
              onClick={() => setSelectedMsg(msg)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                selectedMsg.mt === msg.mt
                  ? 'bg-blue-900/40 border-blue-500 shadow-md'
                  : 'bg-slate-800/80 border-slate-700/70 hover:bg-slate-800'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black font-mono text-amber-400 shrink-0">{msg.mt}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 font-mono text-slate-300 shrink-0">{msg.iso20022}</span>
                </div>
                <div className="text-xs font-semibold text-white mt-1 truncate">{msg.name}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                msg.direction === 'Downstream' ? 'bg-blue-500/20 text-blue-300' :
                msg.direction === 'Upstream' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {msg.direction}
              </span>
            </button>
          ))}
        </div>

        {/* Message Inspector Panel */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          {selectedMsg && (
            <motion.div
              key={selectedMsg.mt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-700 pb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-mono text-amber-400">{selectedMsg.mt}</span>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                      ISO 20022: {selectedMsg.iso20022}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedMsg.name}</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                  {selectedMsg.cat}
                </span>
              </div>

              {/* Grid Properties */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Flow Direction</span>
                  <span className="text-slate-200 font-semibold">{selectedMsg.direction}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">CA Lifecycle Phase</span>
                  <span className="text-slate-200 font-semibold">{selectedMsg.lifecyclePhase}</span>
                </div>
              </div>

              {/* Purpose */}
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message Purpose</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedMsg.purpose}</p>
              </div>

              {/* Key SWIFT Tags */}
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700 font-mono text-xs">
                <h4 className="text-xs font-sans font-bold text-amber-400 uppercase tracking-wider mb-1">Key Tags / Elements</h4>
                <p className="text-slate-300">{selectedMsg.keyFields}</p>
              </div>

              {/* Analyst Pro-Tip */}
              <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-lg text-xs">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1">💡 Senior Operations Analyst Note</h4>
                <p className="text-amber-200 leading-relaxed">{selectedMsg.analystNote}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chapter 5 Widget 1: The Custody Pyramid & Entitlement Flow Visualizer ───
const CUSTODY_ACTORS = [
  {
    level: 1,
    id: 'csd',
    title: '1. Central Securities Depository (CSD)',
    shortName: 'CSD (DTCC / CREST)',
    badge: 'Ultimate Golden Record',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    color: '#10b981',
    icon: '🏛️',
    examples: 'DTC (US), CREST (UK), Euroclear UK & Ireland',
    role: 'Holds the ultimate legal register of immobilized and dematerialized securities. On Record Date, the CSD takes the master snapshot of all direct participant balances.',
    caDuty: 'Receives bulk gross dividend cash or new shares from the Issuer\'s Paying Agent. Credits direct participants\' accounts on Pay Date in one single massive ledger entry.',
    risk: 'If a trade fails at the CSD level, the entire downstream entitlement distribution is delayed.'
  },
  {
    level: 2,
    id: 'icsd',
    title: '2. International CSD (ICSD)',
    shortName: 'ICSD (Euroclear Bank / Clearstream)',
    badge: 'Cross-Border Clearing',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    color: '#3b82f6',
    icon: '🌐',
    examples: 'Euroclear Bank (Brussels), Clearstream Banking (Luxembourg)',
    role: 'Settles international securities (Eurobonds, cross-border equities). Operates as a bridge between multiple local CSDs across 100+ countries.',
    caDuty: 'Acts as a massive omnibus holder. Intercepts local announcements, normalizes ISO 15022 tags across foreign markets, and manages multi-currency cash sweeps.',
    risk: 'Time zone differences between Asia, Europe, and US can cause instruction cut-off windows to shrink dramatically.'
  },
  {
    level: 3,
    id: 'subcustodian',
    title: '3. Sub-Custodian (Local Agent Bank)',
    shortName: 'Sub-Custodian (Local Agent)',
    badge: 'Local Market Agent',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    color: '#6366f1',
    icon: '🏦',
    examples: 'Standard Chartered (Asia/Africa), Citi (LATAM), HSBC (Middle East)',
    role: 'Hired by Global Custodians to provide direct market access in local countries where the Global Custodian has no local bank license.',
    caDuty: 'Acts as "boots on the ground." Translates local market practices, applies local withholding tax (WHT) tax treaty rates, and forwards MT564 notifications upstream.',
    risk: 'Local market nuances (e.g. physical tax certificate requirements) can cause Straight-Through Processing (STP) breaks.'
  },
  {
    level: 4,
    id: 'globalcustodian',
    title: '4. Global Custodian (GC)',
    shortName: 'Global Custodian (BNY / State Street)',
    badge: 'Master Aggregator',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    color: '#8b5cf6',
    icon: '👑',
    examples: 'BNY Mellon, State Street, J.P. Morgan Custody Services, Northern Trust',
    role: 'Consolidates multi-asset portfolios across 100+ global markets into a single client portal for massive institutional investors.',
    caDuty: 'Aggregates MT564 notifications from dozens of Sub-Custodians. Manages corporate action FX covers, calculates net tax withholding, and consolidates MT565 client elections.',
    risk: 'Must reconcile omnibus accounts daily against 50+ sub-custodian ledger feeds.'
  },
  {
    level: 5,
    id: 'broker',
    title: '5. Prime Broker / Executing Broker',
    shortName: 'Broker / Nominee',
    badge: 'Street Name Holder',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    color: '#f59e0b',
    icon: '📊',
    examples: 'Morgan Stanley Prime Brokerage, Goldman Sachs, Interactive Brokers',
    role: 'Holds assets for trading clients, hedge funds, and retail investors under a "Street Name" (nominee) structure to enable rapid margin trading and stock lending.',
    caDuty: 'Processes manufactured dividends (Substitute Payments) when client shares have been lent out to short sellers over Record Date.',
    risk: 'Hypothecation (share lending) creates massive complex reconciliation breaks during dividend pay dates.'
  },
  {
    level: 6,
    id: 'beneficialowner',
    title: '6. Beneficial Owner (HNI / Client / Fund)',
    shortName: 'Beneficial Owner (Client / Fund)',
    badge: 'Economic Owner',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    color: '#ec4899',
    icon: '👤',
    examples: 'Pension Funds, Sovereign Wealth Funds, Hedge Funds, HNI Investors',
    role: 'The ultimate investor who bears all economic risk and reward of the security.',
    caDuty: 'The ultimate decision maker on Voluntary (VOLU) and Choice (CHOS) events. Submits MT565 elections before the strict deadline.',
    risk: 'Missing an election deadline on a voluntary tender offer results in forfeiture of the tender premium.'
  }
];

export function CustodyChainPyramidWidget() {
  const [selectedLevel, setSelectedLevel] = useState(CUSTODY_ACTORS[0]);
  const [activeSim, setActiveSim] = useState('notification'); // 'notification' | 'instruction' | 'payment'

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">The Custody Chain & Pyramid Explorer</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Click any level of the custody hierarchy to inspect its role, risks, and SWIFT workflows</p>

      {/* Mode Simulation Switcher */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'notification', label: '📢 Downstream MT564 Notification', desc: '1 CSD notice multiplies down to 500+ client advices' },
          { id: 'instruction', label: '🗳️ Upstream MT565 Election', desc: 'Client choices aggregate up to CSD cut-off' },
          { id: 'payment', label: '💰 Downstream Cash Allocation', desc: 'Bulk $10M CSD cash splits into client credits' }
        ].map((sim) => (
          <button
            key={sim.id}
            onClick={() => setActiveSim(sim.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSim === sim.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sim.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Pyramid Stack, Right Actor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pyramid Interactive Stack */}
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-1">
            The Multi-Tiered Nominee Hierarchy
          </span>
          {CUSTODY_ACTORS.map((actor) => {
            const isSelected = selectedLevel.id === actor.id;
            return (
              <button
                key={actor.id}
                onClick={() => setSelectedLevel(actor)}
                className={`w-full py-3 px-4 rounded-xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-slate-800 border-2 shadow-lg scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50'
                }`}
                style={{
                  borderColor: isSelected ? actor.color : undefined,
                  boxShadow: isSelected ? `0 0 15px ${actor.color}40` : undefined
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-xl shrink-0">{actor.icon}</span>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{actor.shortName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{actor.examples}</div>
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0"
                  style={{ backgroundColor: actor.color + '25', color: actor.color }}
                >
                  L{actor.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actor Detail Inspector Panel */}
        <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLevel.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-700 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedLevel.icon}</span>
                    <h3 className="text-lg font-bold text-white">{selectedLevel.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Real-world examples: {selectedLevel.examples}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold border ${selectedLevel.badgeColor}`}>
                  {selectedLevel.badge}
                </span>
              </div>

              {/* Core Role */}
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Market Function</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedLevel.role}</p>
              </div>

              {/* Corporate Action Duty */}
              <div className="bg-blue-950/40 p-3.5 rounded-lg border border-blue-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">⚙ Corporate Action Operations Duty</h4>
                <p className="text-sm text-blue-200 leading-relaxed">{selectedLevel.caDuty}</p>
              </div>

              {/* Operational Risk */}
              <div className="bg-amber-950/30 p-3.5 rounded-lg border border-amber-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">⚠️ Operational Risk & STP Break Trigger</h4>
                <p className="text-sm text-amber-200 leading-relaxed">{selectedLevel.risk}</p>
              </div>

              {/* Flow Simulation Callout */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80 text-xs">
                <span className="text-slate-400 font-bold uppercase block mb-1">
                  Active Simulation: {activeSim === 'notification' ? '📢 MT564 Notification Cascade' : activeSim === 'instruction' ? '🗳️ MT565 Upstream Election' : '💰 Downstream Cash Split'}
                </span>
                <p className="text-slate-300">
                  {activeSim === 'notification' && `Level ${selectedLevel.level} receives MT564 from Level ${Math.max(1, selectedLevel.level - 1)}, validates ratios against golden copy, and re-broadcasts downstream.`}
                  {activeSim === 'instruction' && `Level ${selectedLevel.level} validates client position limits and forwards aggregated MT565 to Level ${Math.max(1, selectedLevel.level - 1)}.`}
                  {activeSim === 'payment' && `Level ${selectedLevel.level} receives bulk cash from Level ${Math.max(1, selectedLevel.level - 1)}, applies tax withholding, and calculates sub-ledger allocations.`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter 5 Widget 2: Omnibus Account Allocation & Break Calculator ───────
export function OmnibusAllocationWidget() {
  const [totalGrossCash, setTotalGrossCash] = useState(10000000); // $10M CSD payout
  const [whtRate, setWhtRate] = useState(15); // 15% WHT
  const [activeTab, setActiveTab] = useState('allocation'); // 'allocation' | 'reconciliation'

  // Scenario Clients under Global Custodian Omnibus Account
  const clients = [
    { name: 'US Pension Fund Alpha', shares: 4500000, wht: 0, label: '0% Treaty (US Domestic)' },
    { name: 'UK Sovereign Wealth Fund', shares: 3500000, wht: 15, label: '15% Treaty (US-UK)' },
    { name: 'Cayman Hedge Fund Beta', shares: 2000000, wht: 30, label: '30% Statutory (Non-Treaty)' }
  ];

  const totalShares = 10000000;
  const dividendPerShare = 1.00; // $1.00 per share

  const calculatedClients = clients.map(c => {
    const gross = c.shares * dividendPerShare;
    const tax = gross * (c.wht / 100);
    const net = gross - tax;
    return { ...c, gross, tax, net };
  });

  const totalGrossCalculated = calculatedClients.reduce((acc, c) => acc + c.gross, 0);
  const totalTaxCalculated = calculatedClients.reduce((acc, c) => acc + c.tax, 0);
  const totalNetCalculated = calculatedClients.reduce((acc, c) => acc + c.net, 0);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Omnibus Account Slicing & Tax Reconciliation</h2>
      <p className="text-slate-400 text-sm text-center mb-6">See how a bulk $10,000,000 CSD payout splits into individual client net entitlements</p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('allocation')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'allocation' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          📊 Omnibus Slicing & WHT Breakdown
        </button>
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reconciliation' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🔍 1-Cent Cash Break Simulator
        </button>
      </div>

      {activeTab === 'allocation' ? (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CSD Bulk Payment Received</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">${totalGrossCash.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Gross Dividend Payout ($1.00/sh)</span>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tax Withheld (WHT)</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">${totalTaxCalculated.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Deducted based on treaty status</span>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Client Distribution</span>
              <div className="text-xl font-black text-blue-400 font-mono mt-1">${totalNetCalculated.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">Net cash posted to accounts</span>
            </div>
          </div>

          {/* Client Slicing Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-800/90 border-b border-slate-700 font-bold text-sm text-white flex justify-between items-center">
              <span>Sub-Ledger Allocation Breakdown</span>
              <span className="text-xs text-slate-400 font-mono">10,000,000 Shares Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Beneficial Owner</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Gross Entitlement</th>
                    <th className="p-3">WHT Rate</th>
                    <th className="p-3">Tax Deducted</th>
                    <th className="p-3 text-right">Net Cash Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-mono">
                  {calculatedClients.map((client, i) => (
                    <tr key={i} className="hover:bg-slate-700/30">
                      <td className="p-3 font-sans font-semibold text-white">{client.name}</td>
                      <td className="p-3 text-slate-300">{client.shares.toLocaleString()} sh</td>
                      <td className="p-3 text-emerald-400">${client.gross.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-bold">
                          {client.wht}%
                        </span>
                      </td>
                      <td className="p-3 text-amber-400">-${client.tax.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-blue-400">${client.net.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">The 1-Cent Rounding Cash Break Scenario</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            When a CSD calculates a dividend payout on 10,000,000 shares at $0.333333 per share, the CSD rounds the gross payment to <strong>$3,333,330.00</strong>.
            However, when the Global Custodian calculates entitlements for 3 separate clients holding fractional blocks, the sum of individual rounded client credits equals <strong>$3,333,330.01</strong>.
          </p>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>CSD Cash Received (Nostro Account):</span>
              <span className="text-emerald-400 font-bold">$3,333,330.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sum of Client Sub-Ledger Credits:</span>
              <span className="text-blue-400 font-bold">$3,333,330.01</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between text-red-400 font-bold">
              <span>Cash Break (Shortfall):</span>
              <span>-$0.01</span>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-lg text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1">💡 Senior Operations Analyst Resolution Protocol</h4>
            <p className="text-amber-200 leading-relaxed">
              In middle-office operations, a 1-cent cash break cannot be billed to the client or returned to the CSD. Custodians write off rounding breaks to a designated <strong>"Rounding & Fractional Difference GL Account"</strong> to achieve zero-balance ledger integrity before day-end close.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chapter 6 Widget: The Taxonomy of Events ────────────────────────────────
const TAXONOMY_CATEGORIES = [
  {
    id: 'income',
    name: '1. Income / Distribution Events',
    color: '#10b981',
    icon: '💵',
    summary: 'Issuer distributes earnings or capital proceeds. Parent security ISIN does NOT change.',
    events: [
      { code: 'DVCA', name: 'Cash Dividend', swiftTag: 'DVCA', impact: 'Cash payout per share held. Heavy Withholding Tax (WHT) & FX focus.', glEntry: 'Dr Nostro Cash / Cr Client Cash (less WHT)' },
      { code: 'DVSE', name: 'Stock Dividend / Bonus Issue', swiftTag: 'DVSE', impact: 'New shares allocated pro-rata. Fraction handling applies if non-integer.', glEntry: 'Cr Client Securities Account (New Units)' },
      { code: 'INTR', name: 'Interest Payment', swiftTag: 'INTR', impact: 'Fixed-income coupon payout based on bond nominal value held on record date.', glEntry: 'Dr Paying Agent Cash / Cr Bondholder Cash' }
    ]
  },
  {
    id: 'restructuring',
    name: '2. Restructuring / Reorganization Events',
    color: '#3b82f6',
    icon: '🔄',
    summary: 'Capital structure altered. Alters share count, ISIN, or company identity. Triggers Transformations.',
    events: [
      { code: 'MRGR', name: 'Merger / Acquisition', swiftTag: 'MRGR', impact: 'Old company ISIN extinguished. Cash and/or acquirer stock distributed.', glEntry: 'Dr Old ISIN / Cr New Acquirer ISIN + Cash' },
      { code: 'SPLF', name: 'Stock Split (Forward)', swiftTag: 'SPLF', impact: 'Share count increases by ratio (e.g. 2:1). Share price reduced proportionally.', glEntry: 'Dr Old Unit Balance / Cr New Split Balance' },
      { code: 'SPLR', name: 'Reverse Stock Split', swiftTag: 'SPLR', impact: 'Share count decreases (e.g. 1:10). Fractional holdings converted to Cash-in-Lieu (CIL).', glEntry: 'Debit Old Units / Credit New Units + CIL Cash' },
      { code: 'SPUN', name: 'Spin-Off', swiftTag: 'SPUN', impact: 'Parent company spins out new subsidiary stock line to existing shareholders.', glEntry: 'Cr Client Account (New Spin-Off ISIN)' }
    ]
  },
  {
    id: 'redemption',
    name: '3. Redemption Events',
    color: '#f59e0b',
    icon: '🏷️',
    summary: 'Debt or preferred securities returned to issuer in exchange for principal and final interest.',
    events: [
      { code: 'REDM', name: 'Final Maturity Redemption', swiftTag: 'REDM', impact: 'Bond reaches end of term. Principal nominal value + final coupon paid out.', glEntry: 'Dr Bond Position (Extinguished) / Cr Cash' },
      { code: 'MCAL', name: 'Early Call / Draw', swiftTag: 'MCAL', impact: 'Issuer exercises option to redeem bonds before maturity date at call price.', glEntry: 'Dr Called Bond Nominal / Cr Cash Proceeds' },
      { code: 'PUTT', name: 'Put Option (Investor Choice)', swiftTag: 'PUTT', impact: 'Investor exercises right to sell bond back to issuer at specified put price.', glEntry: 'Dr Put Bond Position / Cr Investor Cash' }
    ]
  },
  {
    id: 'governance',
    name: '4. Information & Governance Events',
    color: '#8b5cf6',
    icon: '🗳️',
    summary: 'No immediate direct economic payout, but alters voting rights, legal terms, or corporate status.',
    events: [
      { code: 'MEET', name: 'Annual General Meeting (AGM)', swiftTag: 'MEET', impact: 'Shareholder voting on board, audit, dividends. May require temporary share blocking.', glEntry: 'No financial GL entry (Proxy Vote Execution)' },
      { code: 'CONS', name: 'Consent Solicitation', swiftTag: 'CONS', impact: 'Bondholders vote to amend bond indenture covenants in exchange for consent fee.', glEntry: 'Cr Consent Fee Cash (if approved)' },
      { code: 'BRUP', name: 'Bankruptcy / Liquidation', swiftTag: 'BRUP', impact: 'Company enters restructuring or liquidation. Claims lodged with court liquidator.', glEntry: 'Write-off / Impairment GL Entry' }
    ]
  }
];

export function EventTaxonomyWidget() {
  const [activeCatId, setActiveCatId] = useState('income');
  const [selectedEventCode, setSelectedEventCode] = useState('DVCA');

  const activeCat = TAXONOMY_CATEGORIES.find(c => c.id === activeCatId);
  const activeEvent = activeCat.events.find(e => e.code === selectedEventCode) || activeCat.events[0];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">The 4-Category Corporate Action Taxonomy</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Explore Income, Restructuring, Redemptions, and Governance event mechanics</p>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {TAXONOMY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCatId(cat.id);
              setSelectedEventCode(cat.events[0].code);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              activeCatId === cat.id
                ? 'bg-slate-800 border-2 shadow-lg scale-[1.02]'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
            }`}
            style={{ borderColor: activeCatId === cat.id ? cat.color : undefined }}
          >
            <span className="text-xl mb-1">{cat.icon}</span>
            <span className="text-xs font-bold text-white leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Category Summary Card */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Processing Overview</span>
        <p className="text-sm text-slate-200 mt-1 font-medium">{activeCat.summary}</p>
      </div>

      {/* Grid: Left Event Codes, Right Event Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Event Codes */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">SWIFT Event Codes</span>
          {activeCat.events.map(ev => (
            <button
              key={ev.code}
              onClick={() => setSelectedEventCode(ev.code)}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                selectedEventCode === ev.code
                  ? 'bg-slate-800 border-blue-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-black font-mono text-amber-400 block">{ev.code}</span>
                <span className="text-xs font-semibold text-white truncate block">{ev.name}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono shrink-0">→</span>
            </button>
          ))}
        </div>

        {/* Right Column: Deep Dive */}
        <div className="md:col-span-8 bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <span className="text-2xl font-black font-mono text-amber-400">{activeEvent.code}</span>
                <h3 className="text-lg font-bold text-white mt-1">{activeEvent.name}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-blue-300 border border-slate-700">
                SWIFT: :22F::CAEV//{activeEvent.swiftTag}
              </span>
            </div>

            {/* Economic Impact */}
            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Economic & Market Impact</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{activeEvent.impact}</p>
            </div>

            {/* Accounting GL Entry */}
            <div className="bg-blue-950/40 p-3.5 rounded-lg border border-blue-800/40 font-mono text-xs">
              <h4 className="text-xs font-sans font-bold text-blue-400 uppercase tracking-wider mb-1">Accounting & Custody GL Postings</h4>
              <p className="text-blue-200">{activeEvent.glEntry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter 7 Widget: Market Claims & Transformations Simulator ─────────────
export function ClaimsTransformationWidget() {
  const [eventType, setEventType] = useState('income'); // 'income' (dividend) | 'restructuring' (split)
  const [tradeTiming, setTradeTiming] = useState('cum'); // 'cum' (before ex) | 'ex' (on/after ex)
  const [settlementTiming, setSettlementTiming] = useState('failed'); // 'settled' (on record) | 'failed' (after record)
  const [otcFlag, setOtcFlag] = useState('none'); // 'none' | 'special_cum' | 'special_ex'

  // Calculate Claim / Transformation Outcome
  let outcome = {
    title: 'No Claim Required',
    color: '#10b981',
    badge: 'Normal Settlement',
    desc: 'Trade settled normally on or before Record Date. Depository paid the rightful owner.',
    action: 'No operational intervention required. STP settlement achieved.'
  };

  if (eventType === 'income') {
    if (otcFlag === 'special_ex') {
      outcome = {
        title: 'Special Ex Agreed (Claim Suppressed)',
        color: '#8b5cf6',
        badge: 'OTC Special Condition',
        desc: 'Buyer and Seller traded before Ex-Date but explicitly agreed "Special Ex" (Seller keeps dividend).',
        action: 'STP Engine detects Special Ex tag and suppresses automated Market Claim.'
      };
    } else if (otcFlag === 'special_cum') {
      outcome = {
        title: 'Reverse Claim Required (Special Cum)',
        color: '#f59e0b',
        badge: 'Reverse Cash Claim',
        desc: 'Trade executed after Ex-Date but agreed "Special Cum" (Buyer receives dividend).',
        action: 'Generate Reverse Claim: Debit Seller $1,000 / Credit Buyer $1,000.'
      };
    } else if (tradeTiming === 'cum' && settlementTiming === 'failed') {
      outcome = {
        title: 'Market Claim Required (Cash Dividend)',
        color: '#ef4444',
        badge: 'Market Claim Triggered',
        desc: 'Trade bought Cum-Dividend but failed to settle before Record Date. CSD paid dividend to Seller.',
        action: 'Generate Market Claim: Force-debit $1,000 from Seller Nostro account and credit Buyer account.'
      };
    } else if (tradeTiming === 'ex' && settlementTiming === 'settled') {
      outcome = {
        title: 'Reverse Claim Risk',
        color: '#f59e0b',
        badge: 'Early Settlement Anomaly',
        desc: 'Trade bought Ex-Dividend settled early before Record Date, giving dividend to Buyer incorrectly.',
        action: 'Generate Reverse Market Claim to recover funds from Buyer and credit Seller.'
      };
    }
  } else if (eventType === 'restructuring') {
    if (settlementTiming === 'failed') {
      outcome = {
        title: 'Transformation Required (2:1 Stock Split)',
        color: '#3b82f6',
        badge: 'Trade Transformation',
        desc: 'Pending trade for 100 shares of Old ISIN failed across Record Date. Old ISIN is now dead/extinguished.',
        action: 'Cancel pending trade for 100 Old ISIN -> Create transformed pending trade for 200 New ISIN shares @ half price.'
      };
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Market Claims & Transformations Simulator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Test trade timing vs settlement failures to see how Claims and Transformations are generated</p>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Event Type */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">1. Event Category</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setEventType('income')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                eventType === 'income' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              💵 Cash Dividend
            </button>
            <button
              onClick={() => setEventType('restructuring')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                eventType === 'restructuring' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 Stock Split (2:1)
            </button>
          </div>
        </div>

        {/* Trade Timing */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">2. Trade Date (TD)</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setTradeTiming('cum')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                tradeTiming === 'cum' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cum-Date (Pre-Ex)
            </button>
            <button
              onClick={() => setTradeTiming('ex')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                tradeTiming === 'ex' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ex-Date (On/After)
            </button>
          </div>
        </div>

        {/* Settlement Status */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">3. Settlement Date (SD)</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setSettlementTiming('settled')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                settlementTiming === 'settled' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              On Record Date
            </button>
            <button
              onClick={() => setSettlementTiming('failed')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                settlementTiming === 'failed' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Failed (Post Record)
            </button>
          </div>
        </div>

        {/* OTC Flags */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">4. Special OTC Trade Flag</span>
          <select
            value={otcFlag}
            onChange={(e) => setOtcFlag(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="none">Standard Exchange Trade</option>
            <option value="special_cum">Special Cum (Agreed Buyer gets CA)</option>
            <option value="special_ex">Special Ex (Agreed Seller keeps CA)</option>
          </select>
        </div>
      </div>

      {/* Outcome Results Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${eventType}-${tradeTiming}-${settlementTiming}-${otcFlag}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-slate-800 border-2 rounded-xl p-5 shadow-xl space-y-4"
          style={{ borderColor: outcome.color }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> {outcome.title}
            </h3>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border shrink-0 self-start sm:self-auto"
              style={{ backgroundColor: outcome.color + '20', color: outcome.color, borderColor: outcome.color + '50' }}
            >
              {outcome.badge}
            </span>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scenario Breakdown</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{outcome.desc}</p>
          </div>

          <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">⚙ Custodian & CCP Action Required</h4>
            <p className="text-sm text-blue-200 leading-relaxed font-mono">{outcome.action}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Chapter 8 Widget 1: Nostro vs Vostro & Cash Break Explorer ─────────────
export function NostroVostroWidget() {
  const [activeTab, setActiveTab] = useState('ledgers'); // 'ledgers' | 'break'
  const [nostroAmount, setNostroAmount] = useState(100000);
  const [expectedAmount, setExpectedAmount] = useState(100005);
  const [resolved, setResolved] = useState(false);

  const diff = nostroAmount - expectedAmount;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Nostro vs Vostro Ledger & Cash Break Simulator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Understand correspondent bank ledgers and investigate corporate action cash breaks</p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('ledgers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'ledgers' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🏦 Nostro ("Ours") vs Vostro ("Yours")
        </button>
        <button
          onClick={() => setActiveTab('break')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'break' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🔍 €5 Cash Break Investigation
        </button>
      </div>

      {activeTab === 'ledgers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nostro Account Card */}
          <div className="bg-slate-800 border border-blue-500/50 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">External Ledger</span>
                <h3 className="text-lg font-bold text-white mt-1">Nostro Account ("Ours")</h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40">
                Our Money at Sub-Custodian
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An account held by the Global Custodian (State Street) at a local Sub-Custodian bank (BNY Paribas in France).
            </p>
            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700 font-mono text-xs space-y-1">
              <span className="text-slate-500 block font-bold text-[10px] uppercase">Example Entry (French Dividend)</span>
              <div className="text-emerald-400">+ €100,000.00 credited by Sub-Custodian</div>
              <span className="text-slate-400 text-[10px]">Pertains to gross French dividend cash pool</span>
            </div>
          </div>

          {/* Vostro Account Card */}
          <div className="bg-slate-800 border border-purple-500/50 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">Internal Sub-Ledger</span>
                <h3 className="text-lg font-bold text-white mt-1">Vostro Account ("Yours")</h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                Client Money Held by Us
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An account held by the Global Custodian for the beneficial owner (Pension Fund / Client).
            </p>
            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-700 font-mono text-xs space-y-1">
              <span className="text-slate-500 block font-bold text-[10px] uppercase">Example Entry (Client Posting)</span>
              <div className="text-blue-400">+ €85,000.00 posted to Client Vostro</div>
              <span className="text-slate-400 text-[10px]">Net cash posted after 15% WHT deduction</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">The €5 Nostro vs Expected Entitlement Cash Break</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Sub-Custodian credited the Nostro account with <strong>€{nostroAmount.toLocaleString()}</strong>.
            However, the Global Custodian's corporate action engine calculated an expected MT564 entitlement of <strong>€{expectedAmount.toLocaleString()}</strong>.
          </p>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Actual Nostro Cash Received:</span>
              <span className="text-emerald-400 font-bold">€{nostroAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Expected MT564 Entitlement:</span>
              <span className="text-blue-400 font-bold">€{expectedAmount.toLocaleString()}</span>
            </div>
            <div className={`border-t border-slate-700 pt-2 flex justify-between font-bold ${diff < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              <span>Unreconciled Cash Break:</span>
              <span>{diff < 0 ? `-€${Math.abs(diff)}` : `+€${diff}`}</span>
            </div>
          </div>

          {!resolved ? (
            <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400">⚠️ Vostro Posting Lock Active</span>
                <button
                  onClick={() => setResolved(true)}
                  className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all"
                >
                  Apply €5 Tax Discrepancy Adjustment
                </button>
              </div>
              <p className="text-red-200 leading-relaxed">
                Because Nostro received €5 less than expected, Vostro credits are BLOCKED to prevent custodian cash overdraft. Root cause: Sub-custodian deducted 15.005% tax due to rounding rather than flat 15%.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-lg text-xs space-y-2">
              <span className="font-bold text-emerald-400 block">✅ Break Resolved & Vostro Unlocked</span>
              <p className="text-emerald-200 leading-relaxed">
                Analyst adjusted tax GL account for €5 rounding variance. Nostro cash matched expected sub-ledger credits. €85,000 successfully released to Client Vostro accounts!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Chapter 8 Widget 2: Cross-Border Entitlement Simulator (WHT & FX) ───────
export function CrossBorderEntitlementWidget() {
  const [grossEur, setGrossEur] = useState(100000); // €100,000 EUR dividend from Germany
  const [structure, setStructure] = useState('omnibus'); // 'omnibus' | 'segregated'
  const [whtMethod, setWhtMethod] = useState('ras'); // 'ras' (Relief at Source 15%) | 'quick' (Quick Refund) | 'standard' (Standard Reclaim)
  const [fxType, setFxType] = useState('custodian'); // 'issuer' (Depo FX spread 1.5%) | 'custodian' (Custodian FX spread 0.2%)

  // Calculation Logic
  const statutoryRate = 26.375; // German statutory WHT
  const treatyRate = 15.0; // US-Germany DTT rate

  // Applied WHT at payout time
  const initialWhtRate = whtMethod === 'ras' ? treatyRate : statutoryRate;
  const initialTaxEur = grossEur * (initialWhtRate / 100);
  const netEurReceived = grossEur - initialTaxEur;

  // Reclaimable Tax (if non-RAS)
  const reclaimableTaxEur = (whtMethod === 'quick' || whtMethod === 'standard') 
    ? grossEur * ((statutoryRate - treatyRate) / 100) 
    : 0;

  // FX Rates
  const baseEurUsdRate = 1.0850; // Spot rate
  const fxSpread = fxType === 'issuer' ? 0.015 : 0.002; // Issuer 1.5% vs Custodian 0.2%
  const effectiveEurUsdRate = baseEurUsdRate * (1 - fxSpread);

  // Final Net USD Vostro Credit
  const netUsdCredit = netEurReceived * effectiveEurUsdRate;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Cross-Border Entitlement Simulator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Watch a gross €100,000 European dividend bleed through statutory WHT, tax treaty relief, and FX spreads</p>

      {/* Inputs Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Structure */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">1. Holding Structure</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setStructure('omnibus')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                structure === 'omnibus' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Omnibus
            </button>
            <button
              onClick={() => setStructure('segregated')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                structure === 'segregated' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Segregated
            </button>
          </div>
        </div>

        {/* WHT Method */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">2. WHT Tax Method</span>
          <select
            value={whtMethod}
            onChange={(e) => setWhtMethod(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ras">Relief at Source (15% DTT)</option>
            <option value="quick">Quick Refund (26.375% → 3 Weeks)</option>
            <option value="standard">Standard Reclaim (26.375% → 3 Years)</option>
          </select>
        </div>

        {/* FX Execution */}
        <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">3. Corporate FX Mode</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setFxType('custodian')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                fxType === 'custodian' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Custodian Spot FX (0.2%)
            </button>
            <button
              onClick={() => setFxType('issuer')}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                fxType === 'issuer' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Depo Issuer FX (1.5%)
            </button>
          </div>
        </div>
      </div>

      {/* Waterfall Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. Gross Dividend (EUR)</span>
          <div className="text-lg font-black text-emerald-400 font-mono mt-1">€{grossEur.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">German Issuer Payout</span>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2. Tax Deducted (WHT)</span>
          <div className="text-lg font-black text-amber-400 font-mono mt-1">-€{initialTaxEur.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">{initialWhtRate}% ({whtMethod.toUpperCase()})</span>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. Net Nostro EUR</span>
          <div className="text-lg font-black text-blue-400 font-mono mt-1">€{netEurReceived.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Credited to Sub-Custodian</span>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-emerald-500/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">4. Net Client Vostro USD</span>
          <div className="text-lg font-black text-emerald-300 font-mono mt-1">${netUsdCredit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <span className="text-[10px] text-slate-400">Rate: {effectiveEurUsdRate.toFixed(4)} USD/EUR</span>
        </div>
      </div>

      {/* Reclaim & Operational Insights Panel */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 shadow-xl">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Operational & Tax Reclaim Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Reclaimable Pending Tax</span>
            <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
              €{reclaimableTaxEur.toLocaleString()} ({((statutoryRate - treatyRate)).toFixed(3)}% difference)
            </div>
            <span className="text-[10px] text-slate-500">
              {whtMethod === 'ras' ? 'None (Relief granted upfront at source)' : whtMethod === 'quick' ? 'Filed via Quick Refund (Expected in 3 weeks)' : 'Paper claim filed with BZSt (Expected in 1-5 years)'}
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">FX Spread Cost Comparison</span>
            <div className="text-sm font-bold text-blue-300 font-mono mt-0.5">
              {fxType === 'custodian' ? 'Saved ~$1,410 vs Issuer FX' : 'Lost ~$1,410 due to Depo FX spread'}
            </div>
            <span className="text-[10px] text-slate-500">
              {fxType === 'custodian' ? 'Custodian bulk spot desk executed @ 0.2% spread' : 'Issuer Depo converted @ mandatory 1.5% spread'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter 9 Widget: Securities Lending, Repo & Manufactured Payments ──────
export function SecuritiesLendingWidget() {
  const [decision, setDecision] = useState('lent_out'); // 'lent_out' | 'recalled' | 'repo_substitution'

  const scenarios = {
    lent_out: {
      title: 'Leave Shares Lent Out Over Record Date',
      color: '#f59e0b',
      badge: 'Manufactured Payment (PIL)',
      csdPaymentTo: 'New Buyer (Open Market)',
      lenderReceives: 'Manufactured Dividend from Borrower',
      votingRights: 'New Buyer Holds Voting Rights (Lender Lost Vote)',
      taxGrossUp: '$15,000 (Borrower pays out of pocket)',
      flowSteps: [
        { label: '1. Title Transfer', desc: 'Lender (BlackRock) transfers 100,000 shares legal title to Borrower under GMSLA contract.' },
        { label: '2. Short Sale', desc: 'Borrower immediately sells 100,000 shares in open market to New Buyer.' },
        { label: '3. CSD Snapshot', desc: 'CSD snapshot on Record Date sees New Buyer on register. CSD pays real $100,000 dividend to New Buyer.' },
        { label: '4. Manufactured Payment', desc: 'Borrower is contractually obligated to pay $100,000 Manufactured Dividend (PIL) to Lender out of pocket.' },
        { label: '5. Tax Gross-Up', desc: 'Local tax authority taxes PIL as ordinary income (30%). Borrower must pay $15,000 extra Tax Gross-Up so Lender gets 85% net.' }
      ],
      opsNote: 'Lender generated securities lending fee income, but forfeited voting rights on the upcoming AGM proxy vote.'
    },
    recalled: {
      title: 'Issue Recall Notice Before Record Date',
      color: '#10b981',
      badge: 'Recall Executed / Real Dividend',
      csdPaymentTo: 'Lender (BlackRock)',
      lenderReceives: 'Real Cash Dividend from CSD',
      votingRights: 'Lender Retains 100% Voting Rights',
      taxGrossUp: '$0 (Standard Dividend WHT applies)',
      flowSteps: [
        { label: '1. Recall Issued', desc: 'Lender issues GMSLA Recall Notice 3 business days before Record Date to participate in AGM vote.' },
        { label: '2. Open Market Buyback', desc: 'Borrower is forced to buy back 100,000 shares in open market and return them to Lender custody account.' },
        { label: '3. CSD Snapshot', desc: 'CSD snapshot on Record Date captures Lender as legal owner. Real $100,000 dividend paid to Lender.' },
        { label: '4. Proxy Voting', desc: 'Lender receives official Proxy Voting Card for 100,000 shares to vote on M&A resolution.' }
      ],
      opsNote: 'Requires strict monitoring of market recall deadlines. If borrower fails to return shares before cut-off, buy-in penalties apply.'
    },
    repo_substitution: {
      title: 'Repo Collateral Substitution (Pre-Ex Date)',
      color: '#3b82f6',
      badge: 'Repo Substitution',
      csdPaymentTo: 'Party A (Original Bond Owner)',
      lenderReceives: 'Real Coupon Payment from CSD',
      votingRights: 'N/A (Bond / Fixed Income)',
      taxGrossUp: '$0 (No Manufactured Payment Created)',
      flowSteps: [
        { label: '1. Repo Agreement', desc: 'Party A pledged €10,000,000 bonds as collateral to Party B in exchange for cash.' },
        { label: '2. Pre-Ex Substitution', desc: '1 day before Ex-Date, Party B returns bonds to Party A and substitutes with Cash collateral for dividend period.' },
        { label: '3. CSD Coupon Payout', desc: 'CSD pays real €200,000 bond coupon directly to Party A on Pay Date.' },
        { label: '4. Post-Event Swap', desc: 'After Ex-Date, original bond collateral is restored under Repo agreement.' }
      ],
      opsNote: 'Eliminates complex manufactured coupon tax tracking and cross-border withholding tax reclaims for both counterparties.'
    }
  };

  const activeScenario = scenarios[decision];

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 bg-slate-900 rounded-xl font-sans text-slate-200 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Securities Lending & Manufactured Dividend Simulator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">Explore legal title transfers, GMSLA recalls, manufactured cash (PIL), and tax gross-ups</p>

      {/* Decision Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { id: 'lent_out', label: '💸 Leave Lent Out', desc: 'Manufactured PIL + Tax Gross-Up' },
          { id: 'recalled', label: '📣 Issue Recall Notice', desc: 'Real Dividend + Retain Proxy Vote' },
          { id: 'repo_substitution', label: '🔄 Repo Substitution', desc: 'Swap Collateral to avoid PIL tax' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setDecision(btn.id)}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              decision === btn.id
                ? 'bg-slate-800 border-2 shadow-lg scale-[1.02]'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
            }`}
            style={{ borderColor: decision === btn.id ? scenarios[btn.id].color : undefined }}
          >
            <span className="text-xs font-bold text-white leading-tight">{btn.label}</span>
            <span className="text-[10px] text-slate-400 mt-1">{btn.desc}</span>
          </button>
        ))}
      </div>

      {/* Active Scenario Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={decision}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-slate-800 border-2 rounded-xl p-5 shadow-xl space-y-5"
          style={{ borderColor: activeScenario.color }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚖️</span> {activeScenario.title}
            </h3>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full border shrink-0 self-start sm:self-auto"
              style={{ backgroundColor: activeScenario.color + '20', color: activeScenario.color, borderColor: activeScenario.color + '50' }}
            >
              {activeScenario.badge}
            </span>
          </div>

          {/* Outcome Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">CSD Real Payout Recipient</span>
              <span className="text-slate-200 font-semibold">{activeScenario.csdPaymentTo}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Lender Economic Payout</span>
              <span className="text-emerald-400 font-bold">{activeScenario.lenderReceives}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Proxy Voting Status</span>
              <span className="text-amber-300 font-semibold">{activeScenario.votingRights}</span>
            </div>
          </div>

          {/* Step-by-Step Flow List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Flow & Ledger Steps</h4>
            <div className="space-y-2">
              {activeScenario.flowSteps.map((step, i) => (
                <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block">{step.label}</span>
                    <span className="text-xs text-slate-300 leading-relaxed block">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ops Analyst Gotcha */}
          <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-lg text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1">💡 Senior Operations Analyst Note</h4>
            <p className="text-amber-200 leading-relaxed">{activeScenario.opsNote}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}




