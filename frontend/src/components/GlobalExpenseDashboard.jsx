import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── SVG Donut Chart ───────────────────────────────────────────────────────────
function DonutChart({ toPay, toReceive }) {
  const [tooltip, setTooltip] = useState(null);
  const total = toPay + toReceive || 1;
  const size = 160;
  const r = 60;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const receiveRatio = toReceive / total;
  const payRatio = toPay / total;

  const segments = [
    { label: 'To Receive', value: toReceive, ratio: receiveRatio, color: '#10b981', offset: 0 },
    { label: 'To Pay', value: toPay, ratio: payRatio, color: '#ef4444', offset: receiveRatio * circumference },
  ];

  const polarToCartesian = (angle) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (startAngle, endAngle) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  let currentAngle = 0;
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" />
        {segments.map((seg) => {
          if (seg.value <= 0) return null;
          const startAngle = currentAngle;
          const sweepAngle = seg.ratio * 360;
          const endAngle = startAngle + sweepAngle;
          currentAngle = endAngle;
          return (
            <path
              key={seg.label}
              d={describeArc(startAngle, endAngle)}
              fill="none"
              stroke={seg.color}
              strokeWidth="22"
              strokeLinecap="butt"
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => setTooltip({ label: seg.label, value: seg.value, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="11" opacity="0.6">Net</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={toReceive >= toPay ? '#10b981' : '#ef4444'} fontSize="13" fontWeight="bold">
          ₹{Math.abs(toReceive - toPay).toFixed(0)}
        </text>
      </svg>
      {tooltip && (
        <div style={{
          position: 'fixed', top: tooltip.y - 50, left: tooltip.x + 10,
          background: 'rgba(0,0,0,0.85)', color: 'white', padding: '6px 12px',
          borderRadius: '8px', fontSize: '0.8rem', pointerEvents: 'none', zIndex: 9999,
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          {tooltip.label}: ₹{tooltip.value.toFixed(2)}
        </div>
      )}
    </div>
  );
}

// ── People Chip ───────────────────────────────────────────────────────────────
function PersonChip({ name, onRemove }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: 'rgba(255,255,255,0.12)', padding: '4px 10px 4px 4px',
      borderRadius: '20px', fontSize: '0.85rem'
    }}>
      <span style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#a855f7,#6366f1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: 'bold'
      }}>{initials}</span>
      {name}
      {onRemove && (
        <span onClick={onRemove} style={{ cursor: 'pointer', opacity: 0.5, fontSize: '1rem', lineHeight: 1 }}>×</span>
      )}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GlobalExpenseDashboard({ user, onBack, tripId, tripParticipants }) {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [simplifiedSettlements, setSimplifiedSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  // Views
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [drilldownUser, setDrilldownUser] = useState(null); // slide-in panel

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editTripId, setEditTripId] = useState(null);

  // Settle modal state
  const [settleFrom, setSettleFrom] = useState(user?.name || '');
  const [settleTo, setSettleTo] = useState('');
  const [settleAmount, setSettleAmount] = useState('');

  // Add Expense form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [payerName, setPayerName] = useState(user?.name || '');
  const [splitMode, setSplitMode] = useState('equal');
  const [expenseParticipants, setExpenseParticipants] = useState([]); // chips
  const [customSplits, setCustomSplits] = useState({});

  // User search inside modal for Split With
  const [personQuery, setPersonQuery] = useState('');
  const [personResults, setPersonResults] = useState([]);
  const searchRef = useRef(null);

  // User search inside modal for Paid By
  const [payerSearchQuery, setPayerSearchQuery] = useState('');
  const [payerSearchResults, setPayerSearchResults] = useState([]);
  const [isPayerSearchFocused, setIsPayerSearchFocused] = useState(false);


  // Filters for full transaction view
  const [filterUser, setFilterUser] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Transaction expansion
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const endpoint = tripId 
        ? `/api/trips/${tripId}/expenses?login_id=${user.login_id}` 
        : `/api/expenses/global?login_id=${user.login_id}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setSettlements(data.settlements || []);
        setSimplifiedSettlements(data.simplified_settlements || []);
        setBalances(data.balances || {});
      }
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // ── User Search (debounced) ─────────────────────────────────────────────────
  useEffect(() => {
    if (!personQuery.trim()) { setPersonResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(personQuery)}&login_id=${user?.login_id || ''}`);
        if (res.ok) {
          const data = await res.json();
          setPersonResults(data.users || []);
        }
      } catch { setPersonResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [personQuery, user]);

  useEffect(() => {
    if (!payerSearchQuery.trim()) { setPayerSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(payerSearchQuery)}&login_id=${user?.login_id || ''}`);
        if (res.ok) {
          const data = await res.json();
          setPayerSearchResults(data.users || []);
        }
      } catch { setPayerSearchResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [payerSearchQuery, user]);

  // ── Open Add Expense modal (fresh) ─────────────────────────────────────────
  const openAddModal = () => {
    setEditExpenseId(null);
    setEditTripId(null);
    setDescription(''); setAmount(''); setCategory('Food');
    setPayerName(user?.name || '');
    setSplitMode('equal');
    setExpenseParticipants(tripParticipants && tripParticipants.length > 0 
      ? tripParticipants.map(p => ({ name: p.name, login_id: p.login_id })) 
      : [{ name: user?.name || '', login_id: user?.login_id }]);
    setCustomSplits({});
    setPersonQuery(''); setPersonResults([]);
    setPayerSearchQuery(''); setPayerSearchResults([]);
    setIsPayerSearchFocused(false);
    setShowModal(true);
  };

  // ── Edit Expense ────────────────────────────────────────────────────────────
  const handleEdit = (exp) => {
    setEditExpenseId(exp.id);
    setEditTripId(exp.trip_id);
    setAmount(exp.amount); setDescription(exp.description);
    setCategory(exp.category); setPayerName(exp.payer_name);
    const splitsArray = exp.splits || [];
    const chips = Array.from(new Set([exp.payer_name, ...splitsArray.map(s => s.participant_name)]))
      .map(name => ({ name }));
    setExpenseParticipants(chips);

    let isCustom = false;
    let customSplitVals = {};
    if (splitsArray.length > 0) {
      const maxSplit = Math.max(...splitsArray.map(s => s.amount_owed));
      const minSplit = Math.min(...splitsArray.map(s => s.amount_owed));
      isCustom = (maxSplit - minSplit) > 0.02;
      splitsArray.forEach(s => {
        customSplitVals[s.participant_name] = s.amount_owed;
      });
    }

    if (isCustom) {
      setSplitMode('custom');
      setCustomSplits(customSplitVals);
    } else {
      setSplitMode('equal'); 
      setCustomSplits({});
    }

    setPersonQuery(''); setPersonResults([]);
    setPayerSearchQuery(''); setPayerSearchResults([]);
    setIsPayerSearchFocused(false);
    setShowModal(true);
  };

  // ── Delete Expense ──────────────────────────────────────────────────────────
  const handleDelete = async (exp) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await fetch(`/api/trips/${exp.trip_id}/expenses/${exp.id}`, { method: 'DELETE' });
      fetchExpenses();
    } catch (err) { console.error(err); }
  };

  // ── Add person chip ─────────────────────────────────────────────────────────
  const addPersonChip = (person) => {
    if (expenseParticipants.some(p => p.name === person.name)) return;
    setExpenseParticipants(prev => [...prev, person]);
    setPersonQuery(''); setPersonResults([]);
  };

  const removePersonChip = (name) => {
    setExpenseParticipants(prev => prev.filter(p => p.name !== name));
  };

  // ── Custom split helper ─────────────────────────────────────────────────────
  const calcPayerRemainder = () => {
    const total = parseFloat(amount) || 0;
    const othersSum = expenseParticipants
      .filter(p => p.name !== payerName)
      .reduce((s, p) => s + (parseFloat(customSplits[p.name]) || 0), 0);
    return Math.max(0, parseFloat((total - othersSum).toFixed(2)));
  };

  // ── Submit Expense ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    if (!totalAmount || totalAmount <= 0) return alert('Enter a valid amount');
    if (expenseParticipants.length === 0) return alert('Select at least one person');

    let splits = [];
    const names = expenseParticipants.map(p => p.name);

    if (splitMode === 'equal') {
      if (names.length === 0) return alert('Select at least one participant');
      const share = parseFloat((totalAmount / names.length).toFixed(2));
      splits = names.map((name, i) => ({
        participant_name: name,
        amount_owed: i === 0 ? parseFloat((totalAmount - share * (names.length - 1)).toFixed(2)) : share
      }));
    } else {
      splits = expenseParticipants
        .filter(p => p.name !== payerName)
        .map(p => ({ participant_name: p.name, amount_owed: parseFloat(customSplits[p.name]) || 0 }));
      const sum = splits.reduce((s, x) => s + x.amount_owed, 0);
      splits.unshift({ participant_name: payerName, amount_owed: parseFloat((totalAmount - sum).toFixed(2)) });
    }

    try {
      const url = editExpenseId
        ? `/api/trips/${editTripId}/expenses/${editExpenseId}`
        : (tripId 
            ? `/api/trips/${tripId}/expenses` 
            : `/api/expenses/global?login_id=${user.login_id}`);
      const method = editExpenseId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payer_name: payerName, amount: totalAmount, description, category, splits })
      });
      if (res.ok) {
        setShowModal(false);
        fetchExpenses();
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to save expense');
      }
    } catch (err) { console.error(err); alert('Network error'); }
  };

  // ── Settle ──────────────────────────────────────────────────────────────────
  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(settleAmount);
    if (!amt || amt <= 0) return alert('Enter a valid amount');
    if (settleFrom === settleTo) return alert('Cannot settle with yourself');
    try {
      const url = tripId 
        ? `/api/trips/${tripId}/expenses` 
        : `/api/expenses/global?login_id=${user.login_id}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer_name: settleFrom, amount: amt,
          description: `Settlement: ${settleFrom} paid ${settleTo}`,
          category: 'Settlement',
          splits: [{ participant_name: settleTo, amount_owed: amt }]
        })
      });
      if (res.ok) { setShowSettleModal(false); setSettleAmount(''); fetchExpenses(); }
      else { const err = await res.json(); alert(err.detail || 'Failed'); }
    } catch (err) { console.error(err); alert('Network error'); }
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const myName = user?.name || '';
  const toPay = settlements.filter(s => s.from === myName).reduce((s, x) => s + x.amount, 0);
  const toReceive = settlements.filter(s => s.to === myName).reduce((s, x) => s + x.amount, 0);

  // Active balances per person (from settlements — only unsettled)
  const peopleBalances = settlements.reduce((acc, s) => {
    if (s.from === myName) {
      acc[s.to] = (acc[s.to] || 0) - s.amount; // we owe them
    } else if (s.to === myName) {
      acc[s.from] = (acc[s.from] || 0) + s.amount; // they owe us
    }
    return acc;
  }, {});

  // All unique names ever seen
  const allNames = Array.from(new Set(
    [myName,
      ...expenses.flatMap(e => [e.payer_name, ...(e.splits || []).map(s => s.participant_name)])
    ].filter(Boolean)
  ));

  const recentExpenses = [...expenses].slice(0, 10);

  // Filtered expenses for full view
  const filteredExpenses = expenses.filter(exp => {
    if (filterUser && exp.payer_name !== filterUser && !(exp.splits || []).some(s => s.participant_name === filterUser)) return false;
    if (filterCategory && exp.category !== filterCategory) return false;
    if (filterDateFrom && new Date(exp.date) < new Date(filterDateFrom)) return false;
    if (filterDateTo && new Date(exp.date) > new Date(filterDateTo)) return false;
    return true;
  });

  // Drilldown expenses for selected user
  const drilldownExpenses = drilldownUser
    ? expenses.filter(exp =>
        exp.payer_name === drilldownUser ||
        (exp.splits || []).some(s => s.participant_name === drilldownUser))
    : [];

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="w-full min-h-screen pt-24 flex items-center justify-center text-white">
      <div className="text-center">
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
        <div style={{ opacity: 0.6 }}>Loading your expenses...</div>
      </div>
    </div>
  );

  // ── Full Transaction View ───────────────────────────────────────────────────
  if (showAllTransactions) {
    return (
      <div className="w-full min-h-screen pt-24 px-4 sm:px-8 max-w-container-max mx-auto text-on-surface">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowAllTransactions(false)} className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h3 className="text-2xl font-bold text-white m-0">All Transactions</h3>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', flex: '1', minWidth: '140px' }}>
            <option value="" style={{ background: '#1a1a2e' }}>All People</option>
            {allNames.map(n => <option key={n} value={n} style={{ background: '#1a1a2e' }}>{n}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', flex: '1', minWidth: '140px' }}>
            <option value="" style={{ background: '#1a1a2e' }}>All Categories</option>
            {['Food','Stay','Travel','Activities','Settlement','Other'].map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>)}
          </select>
          <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', flex: '1', minWidth: '140px' }} />
          <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', flex: '1', minWidth: '140px' }} />
          <button onClick={() => { setFilterUser(''); setFilterCategory(''); setFilterDateFrom(''); setFilterDateTo(''); }} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,107,74,0.2)', border: '1px solid rgba(255,107,74,0.4)', color: '#ff6b4a', cursor: 'pointer' }}>Reset</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No transactions match the filters.</div>
          ) : filteredExpenses.map(exp => (
            <div key={exp.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{exp.description}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '3px' }}>
                  {exp.payer_name} paid ₹{exp.amount} · {exp.category} · {exp.date ? new Date(exp.date).toLocaleDateString() : '—'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                  {(exp.splits || []).map((s, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                      {s.participant_name} ₹{s.amount_owed}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                <button onClick={() => { setShowAllTransactions(false); handleEdit(exp); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.1rem', padding: '5px' }}>✏️</button>
                <button onClick={() => handleDelete(exp)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', padding: '5px' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Main Dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen pt-24 px-4 sm:px-8 max-w-container-max mx-auto text-on-surface font-body-md" style={{ color: 'white' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h3 className="text-2xl sm:text-3xl m-0 font-bold text-white">₹ Global Expenses</h3>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-5 py-3 rounded-full font-bold transition-transform hover:scale-105" 
            style={{ background: '#064e3b', color: 'white', cursor: 'pointer' }}
            onClick={() => {
              const debtorName = Object.keys(peopleBalances).find(n => peopleBalances[n] < 0) || allNames.find(n => n !== myName) || '';
              setSettleFrom(myName); setSettleTo(debtorName); setSettleAmount('');
              setShowSettleModal(true);
            }}>
            = Settle Up
          </button>
          <button className="flex-1 sm:flex-none px-5 py-3 rounded-full font-bold transition-transform hover:scale-105" 
            style={{ background: '#7c2d12', color: 'white', cursor: 'pointer' }} 
            onClick={openAddModal}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* Summary — Cards + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px', alignItems: 'center' }}>
        {/* To Pay */}
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '8px' }}>🔴 Total to Pay</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>₹{toPay.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>You owe others</div>
        </div>

        {/* Donut */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DonutChart toPay={toPay} toReceive={toReceive} />
        </div>

        {/* To Receive */}
        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '8px' }}>🟢 Total to Receive</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹{toReceive.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>Others owe you</div>
        </div>
      </div>



      {/* People Balance List */}
      {Object.keys(peopleBalances).length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', opacity: 0.8 }}>👥 Active Balances</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(peopleBalances)
              .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
              .map(([name, balance]) => (
                <div key={name} onClick={() => setDrilldownUser(name)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                        {balance > 0 ? 'Owes you' : 'You owe'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: balance > 0 ? '#10b981' : '#ef4444' }}>
                      {balance > 0 ? '+' : ''}₹{Math.abs(balance).toFixed(2)}
                    </span>
                    <span className="material-symbols-outlined" style={{ opacity: 0.4, fontSize: '1rem' }}>chevron_right</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.8 }}>📄 Recent Transactions</h4>
          {expenses.length > 10 && (
            <button onClick={() => setShowAllTransactions(true)} style={{ background: 'none', border: 'none', color: '#ff6b4a', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
            </button>
          )}
        </div>

        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.4, padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💳</div>
            <div>No expenses yet. Add your first expense!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentExpenses.map(exp => (
              <div key={exp.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.description}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '2px' }}>
                    {exp.payer_name} · {exp.category} · {exp.date ? new Date(exp.date).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontWeight: 'bold', color: exp.payer_name === myName ? '#10b981' : '#a5b4fc' }}>
                    ₹{exp.amount}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleEdit(exp)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1rem', padding: '5px' }}>✏️</button>
                    <button onClick={() => handleDelete(exp)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '5px' }}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
            {expenses.length > 10 && (
              <button onClick={() => setShowAllTransactions(true)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem' }}>
                + {expenses.length - 10} more transactions — View All
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Per-User Slide-in Panel ─────────────────────────────────────────── */}
      {drilldownUser && (
        <>
          <div onClick={() => setDrilldownUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }} />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)',
            background: '#0f0f1a', borderLeft: '1px solid rgba(255,255,255,0.1)',
            zIndex: 901, overflowY: 'auto', padding: '30px 24px',
            animation: 'slideIn 0.25s ease'
          }}>
            <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{drilldownUser}</div>
                {peopleBalances[drilldownUser] !== undefined && (
                  <div style={{ fontSize: '0.9rem', color: peopleBalances[drilldownUser] > 0 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                    {peopleBalances[drilldownUser] > 0 ? `Owes you ₹${Math.abs(peopleBalances[drilldownUser]).toFixed(2)}` : `You owe ₹${Math.abs(peopleBalances[drilldownUser]).toFixed(2)}`}
                  </div>
                )}
              </div>
              <button onClick={() => setDrilldownUser(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>

            <button className="transition-transform hover:scale-105" onClick={() => {
              setDrilldownUser(null);
              const debt = peopleBalances[drilldownUser];
              if (debt > 0) { setSettleFrom(drilldownUser); setSettleTo(myName); }
              else { setSettleFrom(myName); setSettleTo(drilldownUser); }
              setSettleAmount(Math.abs(debt || 0).toString());
              setShowSettleModal(true);
            }} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#064e3b', border: '2px solid rgba(52,211,153,0.8)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', fontSize: '0.95rem' }}>
              🤝 Settle Up with {drilldownUser}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {drilldownExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.4, padding: '30px' }}>No shared transactions found.</div>
              ) : drilldownExpenses.map(exp => {
                const myShare = (exp.splits || []).find(s => s.participant_name === myName)?.amount_owed;
                const theirShare = (exp.splits || []).find(s => s.participant_name === drilldownUser)?.amount_owed;
                return (
                  <div key={exp.id} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{exp.payer_name} paid ₹{exp.amount} · {exp.date ? new Date(exp.date).toLocaleDateString() : '—'}</div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.8rem' }}>
                      {myShare !== undefined && <span style={{ background: 'rgba(99,102,241,0.2)', padding: '2px 10px', borderRadius: '10px' }}>Your share: ₹{myShare}</span>}
                      {theirShare !== undefined && <span style={{ background: 'rgba(168,85,247,0.2)', padding: '2px 10px', borderRadius: '10px' }}>{drilldownUser}: ₹{theirShare}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Add/Edit Expense Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#1a1a2e', padding: '28px', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>{editExpenseId ? '✏️ Edit Expense' : '+ Add Expense'}</h3>
            <form onSubmit={handleSubmit}>
              {/* Description */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Description</label>
                <input type="text" required value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Dinner at Goa" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', boxSizing: 'border-box' }} />
              </div>

              {/* Amount + Category */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Amount (₹)</label>
                  <input type="number" required min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(30,30,50,1)', border: 'none', color: 'white', boxSizing: 'border-box' }}>
                    {['Food 🍔','Stay 🏨','Travel 🚕','Activities 🎟️','Other 🛒'].map(c => <option key={c} value={c.split(' ')[0]} style={{ background: '#1a1a2e' }}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Paid By */}
              <div style={{ marginBottom: '18px', position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Paid By</label>
                
                {/* Mode toggle between dropdown (known users) or Search (all users) */}
                <div style={{ position: 'relative' }}>
                  {isPayerSearchFocused ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search any registered user..."
                      value={payerSearchQuery}
                      onChange={e => setPayerSearchQuery(e.target.value)}
                      onBlur={() => setTimeout(() => setIsPayerSearchFocused(false), 200)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid #10b981', color: 'white', boxSizing: 'border-box', outline: 'none' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select value={payerName} onChange={e => setPayerName(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(30,30,50,1)', border: 'none', color: 'white', boxSizing: 'border-box' }}>
                        {Array.from(new Set([user?.name, ...expenseParticipants.map(p => p.name), ...allNames].filter(Boolean))).map(name => (
                          <option key={name} value={name} style={{ background: '#1a1a2e' }}>{name}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => { setIsPayerSearchFocused(true); setPayerSearchQuery(''); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '0 12px', color: 'white', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>search</span>
                      </button>
                    </div>
                  )}

                  {/* Search Results Dropdown */}
                  {isPayerSearchFocused && payerSearchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', zIndex: 100, maxHeight: '180px', overflowY: 'auto', marginTop: '4px' }}>
                      {payerSearchResults.map(person => (
                        <div key={person.login_id} 
                          onClick={() => { setPayerName(person.name); setIsPayerSearchFocused(false); }}
                          style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {person.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div>{person.name}</div>
                            <div style={{ opacity: 0.5, fontSize: '0.75rem' }}>{person.login_id}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Person Search */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Split With</label>
                {/* Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {expenseParticipants.map(p => (
                    <PersonChip key={p.name} name={p.name} onRemove={p.name !== myName ? () => removePersonChip(p.name) : null} />
                  ))}
                </div>
                {/* Search Input */}
                <div style={{ position: 'relative' }} ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search registered user..."
                    value={personQuery}
                    onChange={e => setPersonQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', boxSizing: 'border-box' }}
                  />
                  {personResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', zIndex: 100, maxHeight: '180px', overflowY: 'auto', marginTop: '4px' }}>
                      {personResults.map(person => (
                        <div key={person.login_id} onClick={() => addPersonChip(person)}
                          style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {person.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div>{person.name}</div>
                            <div style={{ opacity: 0.5, fontSize: '0.75rem' }}>{person.login_id}</div>
                          </div>
                          {expenseParticipants.some(p => p.name === person.name) && (
                            <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.8rem' }}>✓ Added</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Split Mode */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ opacity: 0.8, fontSize: '0.85rem' }}>Split Mode</label>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
                    <button type="button" onClick={() => setSplitMode('equal')} style={{ padding: '5px 14px', background: splitMode === 'equal' ? '#ff4b2b' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Equal</button>
                    <button type="button" onClick={() => setSplitMode('custom')} style={{ padding: '5px 14px', background: splitMode === 'custom' ? '#ff4b2b' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Custom</button>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                  {splitMode === 'equal' ? (
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Split equally among {expenseParticipants.length} people — ₹{expenseParticipants.length ? ((parseFloat(amount) || 0) / expenseParticipants.length).toFixed(2) : '0.00'} each
                    </div>
                  ) : (
                    expenseParticipants.map(p => (
                      <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem' }}>{p.name} {p.name === payerName ? '(Payer)' : ''}</span>
                        {p.name === payerName ? (
                          <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>₹{calcPayerRemainder().toFixed(2)}</span>
                        ) : (
                          <input type="number" min="0" step="0.01" placeholder="0.00" value={customSplits[p.name] || ''}
                            onChange={e => setCustomSplits(prev => ({ ...prev, [p.name]: e.target.value }))}
                            style={{ width: '90px', padding: '5px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', textAlign: 'right' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{editExpenseId ? 'Update' : 'Save Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Settle Up Modal ─────────────────────────────────────────────────── */}
      {showSettleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#1a1a2e', padding: '28px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>🤝 Record Settlement</h3>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '20px' }}>Record a payment to settle debts between participants.</p>
            <form onSubmit={handleSettleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Who Paid?</label>
                <select value={settleFrom} onChange={e => setSettleFrom(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(30,30,50,1)', border: 'none', color: 'white' }}>
                  {allNames.map(n => <option key={n} value={n} style={{ background: '#1a1a2e' }}>{n}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>To Whom?</label>
                <select value={settleTo} onChange={e => setSettleTo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(30,30,50,1)', border: 'none', color: 'white' }}>
                  {allNames.map(n => <option key={n} value={n} style={{ background: '#1a1a2e' }}>{n}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.8, fontSize: '0.85rem' }}>Amount (₹)</label>
                <input type="number" required min="1" step="0.01" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', boxSizing: 'border-box' }} />
                {(() => {
                  const exactSug = settlements.find(s => s.from === settleFrom && s.to === settleTo);
                  const simpSug = simplifiedSettlements.find(s => s.from === settleFrom && s.to === settleTo);
                  
                  return (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exactSug && (
                        <div style={{ fontSize: '0.8rem', color: '#10b981', cursor: 'pointer', padding: '6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }} onClick={() => setSettleAmount(exactSug.amount)}>
                          💡 Exact debt: ₹{exactSug.amount}
                        </div>
                      )}
                      {simpSug && (!exactSug || simpSug.amount !== exactSug.amount) && (
                        <div style={{ fontSize: '0.8rem', color: '#fb923c', cursor: 'pointer', padding: '6px', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '6px' }} onClick={() => setSettleAmount(simpSug.amount)}>
                          ✨ Suggestion: Pay ₹{simpSug.amount} to {settleTo} to settle your entire net debt instead of paying individuals.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowSettleModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#34d399)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
