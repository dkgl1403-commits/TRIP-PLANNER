import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

export default function EmployeePredictiveML({ user }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
  const [generatingPlanId, setGeneratingPlanId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [savingFeedbackId, setSavingFeedbackId] = useState(null);
  const [savedFeedbackId, setSavedFeedbackId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchInsights();
  }, []);

  const generateActionPlan = async (insightId) => {
    setGeneratingPlanId(insightId);
    try {
      const res = await fetch(`/api/employee-dashboard/ml/action-plan/${insightId}`, {
        method: 'POST'
      });
      if (res.ok) {
        setGeneratingPlanId(`${insightId}-success`);
        setExpandedRowId(insightId);
        setTimeout(() => {
          if (generatingPlanId !== insightId) {
            setGeneratingPlanId(null);
          }
        }, 3000);
        await fetchInsights();
      } else {
        const errorData = await res.json();
        toast.error(errorData.detail || "Failed to generate plan");
        setGeneratingPlanId(null);
      }
    } catch (e) {
      toast.error("Network error while generating action plan");
      setGeneratingPlanId(null);
    }
  };

  const handleToggleFeedback = (insight) => {
    if (activeFeedbackId === insight.id) {
      setActiveFeedbackId(null);
    } else {
      setActiveFeedbackId(insight.id);
      if (insight.feedback) {
        setFeedbackData({
          [insight.id]: {
            flight_risk_rating: insight.feedback.thumbs_up,
            burnout_rating: insight.feedback.burnout_thumbs_up,
            comp_rating: insight.feedback.comp_thumbs_up,
            notes: insight.feedback.feedback_notes || ''
          }
        });
      } else {
        setFeedbackData({
          [insight.id]: { flight_risk_rating: null, burnout_rating: null, comp_rating: null, notes: '' }
        });
      }
    }
  };

  const submitFeedback = async (insight) => {
    setSavingFeedbackId(insight.id);
    try {
      const data = feedbackData[insight.id] || {};
      const res = await fetch('/api/employee-dashboard/ml/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insight_id: insight.id,
          employee_id: insight.employee_id,
          predicted_flight_risk: insight.flight_risk_score,
          thumbs_up: data.flight_risk_rating,
          burnout_thumbs_up: data.burnout_rating,
          comp_thumbs_up: data.comp_rating,
          feedback_notes: data.notes
        })
      });
      if (res.ok) {
        setSavingFeedbackId(null);
        setSavedFeedbackId(insight.id);
        setTimeout(() => {
          setSavedFeedbackId(null);
          setActiveFeedbackId(null);
          fetchInsights(false);
        }, 1500);
      } else {
        setSavingFeedbackId(null);
      }
    } catch (e) {
      setSavingFeedbackId(null);
    }
  };

  const fetchInsights = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/employee-dashboard/insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch ML insights");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setRunningAnalysis(true);
    toast.info("Initializing predictive models...");
    try {
      const res = await fetch('/api/employee-dashboard/ml/run', {
        method: 'POST'
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(result.message);
        await fetchInsights();
      } else {
        toast.error("ML Engine failed to run");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error running analysis");
    } finally {
      setRunningAnalysis(false);
    }
  };

  const [nameFilter, setNameFilter] = useState('');
  const [flightRiskFilter, setFlightRiskFilter] = useState('all'); // all, >50, >70
  const [burnoutFilter, setBurnoutFilter] = useState('all'); // all, >50, >70
  const [compFilter, setCompFilter] = useState('all'); // all, <40, <70

  // Process data for UI
  const highFlightRisk = insights.filter(i => i.flight_risk_score > 0.7);
  const highBurnoutRisk = insights.filter(i => i.burnout_risk_score > 0.7);
  const unfairComp = insights.filter(i => i.compensation_fairness_score < 0.4);

  const filteredInsights = insights.filter(insight => {
    // Name
    if (nameFilter && !insight.employee_name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    
    // Flight Risk
    if (flightRiskFilter === '>50' && insight.flight_risk_score <= 0.5) return false;
    if (flightRiskFilter === '>70' && insight.flight_risk_score <= 0.7) return false;
    
    // Burnout
    if (burnoutFilter === '>50' && insight.burnout_risk_score <= 0.5) return false;
    if (burnoutFilter === '>70' && insight.burnout_risk_score <= 0.7) return false;
    
    // Comp Fairness
    if (compFilter === '<70' && insight.compensation_fairness_score >= 0.7) return false;
    if (compFilter === '<40' && insight.compensation_fairness_score >= 0.4) return false;

    return true;
  });

  const getRiskColor = (score) => {
    if (score > 0.7) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (score > 0.4) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-green-400 bg-green-500/10 border-green-500/20";
  };

  return (
    <>
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="w-full text-on-surface font-body-md text-white mt-8 space-y-8">
      
      {/* Top Bar: Action & Summary */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm gap-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-neon-coral">model_training</span>
            HR Intelligence Engine
          </h3>
          <p className="opacity-70 max-w-xl">
            This module processes daily logs, productivity metrics, and compensation data to predict flight risk and burnout before they happen.
          </p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={runningAnalysis}
          className="bg-neon-coral text-white font-bold rounded-xl px-6 py-3 hover:bg-[#E05236] transition-colors shadow-lg shadow-neon-coral/20 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          {runningAnalysis ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined">play_circle</span>
          )}
          {runningAnalysis ? "Processing Models..." : "Run Global Analysis"}
        </button>
      </div>

      {loading ? (
        <div className="text-center p-12 opacity-50">Loading insights...</div>
      ) : insights.length === 0 ? (
        <div className="text-center p-12 bg-surface border border-surface-variant rounded-2xl">
          <span className="material-symbols-outlined text-4xl opacity-50 mb-2">query_stats</span>
          <p>No insights generated yet. Click "Run Global Analysis" to process the data.</p>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => { setFlightRiskFilter('>70'); setBurnoutFilter('all'); setCompFilter('all'); setNameFilter(''); }}
              className="bg-surface border border-red-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold opacity-70">High Flight Risk</h4>
                  <span className="material-symbols-outlined text-red-400">flight_takeoff</span>
                </div>
                <div className="text-4xl font-display-lg font-bold text-red-400 mb-2">{highFlightRisk.length}</div>
                <p className="text-sm opacity-70">Employees highly likely to leave within 6 months.</p>
              </div>
            </div>
            
            <div 
              onClick={() => { setBurnoutFilter('>70'); setFlightRiskFilter('all'); setCompFilter('all'); setNameFilter(''); }}
              className="bg-surface border border-yellow-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold opacity-70">High Burnout Risk</h4>
                  <span className="material-symbols-outlined text-yellow-400">local_fire_department</span>
                </div>
                <div className="text-4xl font-display-lg font-bold text-yellow-400 mb-2">{highBurnoutRisk.length}</div>
                <p className="text-sm opacity-70">Working excessive hours with declining productivity.</p>
              </div>
            </div>

            <div 
              onClick={() => { setCompFilter('<40'); setFlightRiskFilter('all'); setBurnoutFilter('all'); setNameFilter(''); }}
              className="bg-surface border border-orange-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold opacity-70">Compensation Flags</h4>
                  <span className="material-symbols-outlined text-orange-400">payments</span>
                </div>
                <div className="text-4xl font-display-lg font-bold text-orange-400 mb-2">{unfairComp.length}</div>
                <p className="text-sm opacity-70">Paid significantly below role average.</p>
              </div>
            </div>
          </div>

          {/* Detailed Roster */}
          <div className="bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-bold">Employee Risk Roster</h3>
              <div className="flex flex-wrap items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="bg-surface-variant/50 border border-surface-variant rounded-lg px-3 py-2 text-white outline-none focus:border-neon-coral min-w-[200px]"
                />
                <select 
                  value={flightRiskFilter} 
                  onChange={(e) => setFlightRiskFilter(e.target.value)}
                  className="bg-surface-variant/50 border border-surface-variant rounded-lg px-3 py-2 text-white outline-none focus:border-neon-coral"
                >
                  <option value="all">Flight Risk: All</option>
                  <option value=">50">Flight Risk &gt; 50%</option>
                  <option value=">70">Flight Risk &gt; 70%</option>
                </select>
                <select 
                  value={burnoutFilter} 
                  onChange={(e) => setBurnoutFilter(e.target.value)}
                  className="bg-surface-variant/50 border border-surface-variant rounded-lg px-3 py-2 text-white outline-none focus:border-neon-coral"
                >
                  <option value="all">Burnout: All</option>
                  <option value=">50">Burnout &gt; 50%</option>
                  <option value=">70">Burnout &gt; 70%</option>
                </select>
                <select 
                  value={compFilter} 
                  onChange={(e) => setCompFilter(e.target.value)}
                  className="bg-surface-variant/50 border border-surface-variant rounded-lg px-3 py-2 text-white outline-none focus:border-neon-coral"
                >
                  <option value="all">Comp: All</option>
                  <option value="<70">Comp &lt; 70%</option>
                  <option value="<40">Comp &lt; 40%</option>
                </select>
                {(nameFilter || flightRiskFilter !== 'all' || burnoutFilter !== 'all' || compFilter !== 'all') && (
                  <button 
                    onClick={() => { setNameFilter(''); setFlightRiskFilter('all'); setBurnoutFilter('all'); setCompFilter('all'); }}
                    className="text-xs text-neon-coral hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-variant/50">
                  <tr>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant">Employee</th>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant text-center">Flight Risk</th>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant text-center">Burnout</th>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant text-center">Comp Fairness</th>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant">Top Risk Factors</th>
                    <th className="p-4 text-sm font-semibold opacity-80 border-b border-surface-variant text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInsights.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center opacity-50">No employees match the current filters.</td>
                    </tr>
                  ) : filteredInsights.map(insight => (
                    <React.Fragment key={insight.id}>
                      <tr 
                        className="border-b border-surface-variant/30 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setExpandedRowId(expandedRowId === insight.id ? null : insight.id)}
                      >
                        <td className="p-4">
                          <div className="font-bold">{insight.employee_name}</div>
                          <div className="text-xs opacity-70">{insight.role} • {insight.department}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(insight.flight_risk_score)}`}>
                            {Math.round(insight.flight_risk_score * 100)}%
                          </span>
                          {activeFeedbackId === insight.id && (
                            <div className="mt-2 flex justify-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), flight_risk_rating: true}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.flight_risk_rating === true ? 'text-green-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-green-500'}`} title="Accurate"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.flight_risk_rating === true ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), flight_risk_rating: false}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.flight_risk_rating === false ? 'text-red-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-red-500'}`} title="False Alarm"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.flight_risk_rating === false ? "'FILL' 1" : "'FILL' 0" }}>thumb_down</span>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(insight.burnout_risk_score)}`}>
                            {Math.round(insight.burnout_risk_score * 100)}%
                          </span>
                          {activeFeedbackId === insight.id && (
                            <div className="mt-2 flex justify-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), burnout_rating: true}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.burnout_rating === true ? 'text-green-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-green-500'}`} title="Accurate"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.burnout_rating === true ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), burnout_rating: false}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.burnout_rating === false ? 'text-red-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-red-500'}`} title="False Alarm"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.burnout_rating === false ? "'FILL' 1" : "'FILL' 0" }}>thumb_down</span>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${insight.compensation_fairness_score < 0.4 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>
                            {Math.round(insight.compensation_fairness_score * 100)}%
                          </span>
                          {activeFeedbackId === insight.id && (
                            <div className="mt-2 flex justify-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), comp_rating: true}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.comp_rating === true ? 'text-green-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-green-500'}`} title="Accurate"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.comp_rating === true ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), comp_rating: false}}); }}
                                className={`transition-colors p-1 flex items-center justify-center ${feedbackData[insight.id]?.comp_rating === false ? 'text-red-500' : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-red-500'}`} title="False Alarm"
                              >
                                <span className="material-symbols-outlined text-[10px] scale-75 origin-center" style={{ fontVariationSettings: feedbackData[insight.id]?.comp_rating === false ? "'FILL' 1" : "'FILL' 0" }}>thumb_down</span>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <ul className="list-disc pl-4 text-xs opacity-80 space-y-1">
                            {insight.top_risk_factors.map((factor, idx) => (
                              <li key={idx}>{factor}</li>
                            ))}
                          </ul>
                          {activeFeedbackId === insight.id && (
                            <div className="mt-2">
                              <textarea
                                value={feedbackData[insight.id]?.notes || ''}
                                onChange={(e) => setFeedbackData({...feedbackData, [insight.id]: {...(feedbackData[insight.id]||{}), notes: e.target.value}})}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Add optional feedback notes..."
                                className="w-full bg-surface-variant/50 border border-surface-variant rounded px-2 py-1 text-xs text-white outline-none focus:border-neon-coral min-h-[40px] resize-y"
                              />
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {activeFeedbackId === insight.id && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); if (savingFeedbackId !== insight.id) submitFeedback(insight); }}
                                disabled={savingFeedbackId === insight.id}
                                className={`text-xs px-2 py-1 rounded border transition-colors whitespace-nowrap mb-2 w-full relative overflow-hidden ${savedFeedbackId === insight.id ? 'bg-green-500 text-white border-green-500' : 'bg-neon-coral text-white border-neon-coral'} ${savingFeedbackId === insight.id ? 'opacity-80 cursor-wait' : 'hover:opacity-90'}`}
                              >
                                {savingFeedbackId === insight.id ? (
                                  <>
                                    <div className="absolute inset-0 bg-white/30" style={{ animation: 'sweep 1s infinite linear' }}></div>
                                    Saving...
                                  </>
                                ) : savedFeedbackId === insight.id ? (
                                  'Saved!'
                                ) : (
                                  'Save Feedback'
                                )}
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleToggleFeedback(insight); }}
                              className={`text-xs px-2 py-1 rounded border transition-colors whitespace-nowrap w-full ${activeFeedbackId === insight.id ? 'bg-surface-variant text-white border-surface-variant' : 'bg-surface-variant/50 hover:bg-surface-variant border-surface-variant'}`}
                            >
                              {activeFeedbackId === insight.id ? 'Cancel' : insight.feedback ? 'Edit Feedback' : 'Feedback'}
                            </button>
                            {(insight.flight_risk_score > 0.6 || insight.burnout_risk_score > 0.6) && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); generateActionPlan(insight.id); }}
                                disabled={generatingPlanId === insight.id || generatingPlanId === `${insight.id}-success`}
                                className="text-xs px-2 py-1 bg-neon-coral/20 text-neon-coral hover:bg-neon-coral/30 rounded border border-neon-coral/30 transition-colors whitespace-nowrap disabled:opacity-50 w-full"
                              >
                                {generatingPlanId === insight.id 
                                  ? 'Generating...' 
                                  : generatingPlanId === `${insight.id}-success`
                                    ? 'Generated!'
                                    : insight.manager_action_plan
                                      ? 'Regenerate AI Plan'
                                      : 'AI Action Plan'
                                }
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {insight.manager_action_plan && expandedRowId === insight.id && (
                        <tr className="border-b border-surface-variant/30 bg-surface-variant/10">
                          <td colSpan="6" className="p-4">
                            <div className="flex items-start gap-3 w-1/2 min-w-[300px]">
                              <span className="material-symbols-outlined text-neon-coral shrink-0 text-sm mt-0.5">auto_awesome</span>
                              <div>
                                <h4 className="font-bold text-xs mb-1 text-neon-coral">AI Action Plan</h4>
                                <p className="text-[11px] opacity-80 leading-relaxed">{insight.manager_action_plan}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
    </>
  );
}
