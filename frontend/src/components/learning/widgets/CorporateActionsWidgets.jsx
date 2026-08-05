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
