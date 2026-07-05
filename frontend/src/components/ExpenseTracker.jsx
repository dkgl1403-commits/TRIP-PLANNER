import React, { useState, useEffect } from 'react';

export default function ExpenseTracker({ tripId, participants, user }) {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);

  // Settlement states
  const [settleFrom, setSettleFrom] = useState(user?.name || '');
  const [settleTo, setSettleTo] = useState('');
  const [settleAmount, setSettleAmount] = useState('');

  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [payerName, setPayerName] = useState(user?.name || '');
  const [splitMode, setSplitMode] = useState('equal'); // 'equal' or 'custom'
  
  // selectedParticipants stores which names are included in the equal split
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  // customSplits stores exact amounts keyed by name
  const [customSplits, setCustomSplits] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  useEffect(() => {
    // Default all participants to selected
    if (participants && participants.length > 0) {
      const names = Array.from(new Set(participants.map(p => p.name)));
      setSelectedParticipants(names);
      if (!payerName) {
        setPayerName(names[0]);
      }
    }
  }, [participants]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setSettlements(data.settlements || []);
        setBalances(data.balances || {});
      }
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleEdit = (exp) => {
    setEditExpenseId(exp.id);
    setAmount(exp.amount);
    setDescription(exp.description);
    setCategory(exp.category);
    setPayerName(exp.payer_name);
    
    // Always use custom mode for editing to preserve exact numbers
    setSplitMode('custom');
    const splitsObj = {};
    exp.splits.forEach(s => {
      splitsObj[s.participant_name] = s.amount_owed;
    });
    setCustomSplits(splitsObj);
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  const handleCustomSplitChange = (name, value) => {
    const val = parseFloat(value) || 0;
    setCustomSplits(prev => ({ ...prev, [name]: val }));
  };

  const calculateCustomPayerRemainder = () => {
    const totalAmount = parseFloat(amount) || 0;
    let sumOthers = 0;
    Object.entries(customSplits).forEach(([name, val]) => {
      if (name !== payerName) {
        sumOthers += val;
      }
    });
    return Math.max(0, totalAmount - sumOthers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    if (!totalAmount || totalAmount <= 0) return alert("Enter a valid amount");

    let splits = [];
    
    if (splitMode === 'equal') {
      if (selectedParticipants.length === 0) return alert("Select at least one participant to split with");
      const splitAmount = parseFloat((totalAmount / selectedParticipants.length).toFixed(2));
      
      // Fix rounding errors by giving the remainder to the payer if they are in the split, or the first person
      let sum = 0;
      splits = selectedParticipants.map(name => {
        sum += splitAmount;
        return { participant_name: name, amount_owed: splitAmount };
      });
      
      const diff = parseFloat((totalAmount - sum).toFixed(2));
      if (diff !== 0) {
          splits[0].amount_owed = parseFloat((splits[0].amount_owed + diff).toFixed(2));
      }
    } else {
      // Custom split
      const payerRemainder = calculateCustomPayerRemainder();
      const allNames = Array.from(new Set(participants.map(p => p.name)));
      
      let sum = 0;
      splits = [];
      allNames.forEach(name => {
        let val = name === payerName ? parseFloat(payerRemainder.toFixed(2)) : (customSplits[name] || 0);
        if (val > 0) {
            splits.push({ participant_name: name, amount_owed: val });
            sum += val;
        }
      });

      if (Math.abs(sum - totalAmount) > 0.05) {
        return alert(`Custom split total (${sum}) does not match expense amount (${totalAmount})`);
      }
    }

    try {
      const url = editExpenseId ? `/api/trips/${tripId}/expenses/${editExpenseId}` : `/api/trips/${tripId}/expenses`;
      const method = editExpenseId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer_name: payerName,
          amount: totalAmount,
          description,
          category,
          splits
        })
      });

      if (res.ok) {
        setShowModal(false);
        setAmount('');
        setDescription('');
        setCustomSplits({});
        setEditExpenseId(null);
        fetchExpenses();
      } else {
        const error = await res.json();
        alert(error.detail || "Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(settleAmount);
    if (!amountNum || amountNum <= 0) return alert("Enter a valid settlement amount");
    if (settleFrom === settleTo) return alert("Cannot settle with yourself");

    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer_name: settleFrom,
          amount: amountNum,
          description: `Settlement: ${settleFrom} paid ${settleTo}`,
          category: 'Settlement',
          splits: [{ participant_name: settleTo, amount_owed: amountNum }]
        })
      });

      if (res.ok) {
        setShowSettleModal(false);
        setSettleAmount('');
        fetchExpenses();
      } else {
        const error = await res.json();
        alert(error.detail || "Failed to add settlement");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const uniqueNames = Array.from(new Set(participants.map(p => p.name)));

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading expenses...</div>;

  const totalTripCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const myTotalPaid = expenses.filter(e => e.payer_name === user?.name).reduce((sum, exp) => sum + exp.amount, 0);
  const myNetBalance = balances[user?.name] || 0;

  return (
    <div className="content-inner" style={{ padding: '20px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.8rem', margin: 0 }}>💸 Expense Tracker</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => {
            setSettleFrom(user?.name || uniqueNames[0]);
            setSettleTo(uniqueNames.find(n => n !== user?.name) || uniqueNames[1] || uniqueNames[0]);
            setSettleAmount('');
            setShowSettleModal(true);
          }} style={{ padding: '10px 20px', borderRadius: '20px', background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            🤝 Settle Up
          </button>
          <button className="btn-primary" onClick={() => {
            setEditExpenseId(null);
            setAmount('');
            setDescription('');
            setCustomSplits({});
            setSplitMode('equal');
            setShowModal(true);
          }} style={{ padding: '10px 20px', borderRadius: '20px' }}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Trip Cost</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{totalTripCost.toFixed(2)}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>You Paid</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{myTotalPaid.toFixed(2)}</div>
        </div>
        <div style={{ background: myNetBalance > 0 ? 'rgba(46, 204, 113, 0.1)' : myNetBalance < 0 ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Your Net Balance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: myNetBalance > 0 ? '#2ecc71' : myNetBalance < 0 ? '#e74c3c' : 'white' }}>
            {myNetBalance > 0 ? `Gets back ₹${myNetBalance.toFixed(2)}` : myNetBalance < 0 ? `Owes ₹${Math.abs(myNetBalance).toFixed(2)}` : 'Settled'}
          </div>
        </div>
      </div>

      {/* Settlements */}
      {settlements.length > 0 && (
        <div style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>🤝 Settlement Summary</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {settlements.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                <span style={{ fontWeight: 'bold' }}>{s.from}</span>
                <span style={{ opacity: 0.5 }}>owes</span>
                <span style={{ fontWeight: 'bold' }}>{s.to}</span>
                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>₹{s.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <h4 style={{ margin: '0 0 15px 0' }}>📄 Transactions</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No expenses logged yet.</div>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} className={`expense-flip-card ${flippedCardId === exp.id ? 'flipped' : ''}`} onClick={() => setFlippedCardId(flippedCardId === exp.id ? null : exp.id)}>
              <div className="expense-flip-inner">
                {/* FRONT SIDE */}
                <div className="expense-flip-front" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{exp.description}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{exp.payer_name} paid ₹{exp.amount} • {exp.category} • {new Date(exp.date).toLocaleDateString()}</div>
                    {exp.category !== 'Settlement' && (
                      <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '5px' }}>
                        Click to view split details 🔄
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }} onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => handleEdit(exp)}
                      style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '1.2rem', padding: '10px' }}
                      title="Edit Expense"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem', padding: '10px' }}
                      title="Delete Expense"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* BACK SIDE */}
                <div className="expense-flip-back">
                  {exp.category === 'Settlement' ? (
                    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>🤝 Settlement Complete</div>
                      <div>{exp.payer_name} paid {exp.splits[0]?.participant_name} ₹{exp.amount}</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '0.85rem', color: '#a5b4fc' }}>Split Breakdown:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '4px' }}>
                        {exp.splits.map((s, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', paddingRight: '10px', background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '5px' }}>
                            <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '5px' }}>{s.participant_name}</span>
                            <span style={{ fontWeight: 'bold' }}>₹{s.amount_owed}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div style={{ marginTop: '8px', fontSize: '0.7rem', opacity: 0.5, textAlign: 'center', position: 'absolute', bottom: '15px', width: '100%' }}>
                    Tap to flip back
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>{editExpenseId ? 'Edit Expense' : 'Add Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <input type="text" required value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Dinner at Goa" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Amount (₹)</label>
                  <input type="number" required min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                    <option value="Food" style={{ background: '#1a1a2e' }}>Food 🍔</option>
                    <option value="Stay" style={{ background: '#1a1a2e' }}>Stay 🏨</option>
                    <option value="Travel" style={{ background: '#1a1a2e' }}>Travel 🚕</option>
                    <option value="Activities" style={{ background: '#1a1a2e' }}>Activities 🎟️</option>
                    <option value="Other" style={{ background: '#1a1a2e' }}>Other 🛒</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Paid By</label>
                <select value={payerName} onChange={e => setPayerName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                  {uniqueNames.map(name => (
                    <option key={name} value={name} style={{ background: '#1a1a2e' }}>{name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ margin: 0 }}>Split Mode</label>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
                    <button type="button" onClick={() => setSplitMode('equal')} style={{ padding: '5px 15px', background: splitMode === 'equal' ? '#ff4b2b' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Equal</button>
                    <button type="button" onClick={() => setSplitMode('custom')} style={{ padding: '5px 15px', background: splitMode === 'custom' ? '#ff4b2b' : 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Custom</button>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                  {splitMode === 'equal' ? (
                    <div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '10px' }}>Select who was involved:</div>
                      {uniqueNames.map(name => (
                        <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedParticipants.includes(name)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedParticipants([...selectedParticipants, name]);
                              else setSelectedParticipants(selectedParticipants.filter(n => n !== name));
                            }}
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '10px' }}>Enter exact amounts for others:</div>
                      {uniqueNames.map(name => {
                        if (name === payerName) {
                          const remainder = calculateCustomPayerRemainder();
                          return (
                            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', opacity: 0.7 }}>
                              <span>{name} (Payer)</span>
                              <span>₹{remainder.toFixed(2)}</span>
                            </div>
                          );
                        }
                        return (
                          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span>{name}</span>
                            <input 
                              type="number" 
                              min="0" 
                              step="0.01"
                              placeholder="0.00"
                              value={customSplits[name] || ''}
                              onChange={e => handleCustomSplitChange(name, e.target.value)}
                              style={{ width: '100px', padding: '5px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', textAlign: 'right' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{editExpenseId ? 'Update Expense' : 'Save Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Up Modal */}
      {showSettleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>🤝 Record Settlement</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '20px' }}>Record a payment to settle debts between participants.</p>
            <form onSubmit={handleSettleSubmit}>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Who Paid? (From)</label>
                <select value={settleFrom} onChange={e => setSettleFrom(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                  {uniqueNames.map(name => (
                    <option key={name} value={name} style={{ background: '#1a1a2e' }}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Who Received? (To)</label>
                <select value={settleTo} onChange={e => setSettleTo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                  {uniqueNames.map(name => (
                    <option key={name} value={name} style={{ background: '#1a1a2e' }}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Amount (₹)</label>
                <input type="number" required min="1" step="0.01" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
                
                {/* Auto-suggest amount if there's a known debt */}
                {(() => {
                  const suggestedSettle = settlements.find(s => s.from === settleFrom && s.to === settleTo);
                  if (suggestedSettle) {
                    return (
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#10b981', cursor: 'pointer' }} onClick={() => setSettleAmount(suggestedSettle.amount)}>
                        💡 Suggestion: Settle full debt of ₹{suggestedSettle.amount}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setShowSettleModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #34d399)' }}>Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
