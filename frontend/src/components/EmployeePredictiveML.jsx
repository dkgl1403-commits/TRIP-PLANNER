import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

export default function EmployeePredictiveML({ user }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
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
      setLoading(false);
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
                  </tr>
                </thead>
                <tbody>
                  {filteredInsights.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center opacity-50">No employees match the current filters.</td>
                    </tr>
                  ) : filteredInsights.map(insight => (
                    <tr key={insight.id} className="border-b border-surface-variant/30 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{insight.employee_name}</div>
                        <div className="text-xs opacity-70">{insight.role} • {insight.department}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(insight.flight_risk_score)}`}>
                          {Math.round(insight.flight_risk_score * 100)}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(insight.burnout_risk_score)}`}>
                          {Math.round(insight.burnout_risk_score * 100)}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${insight.compensation_fairness_score < 0.4 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>
                          {Math.round(insight.compensation_fairness_score * 100)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <ul className="list-disc pl-4 text-xs opacity-80 space-y-1">
                          {insight.top_risk_factors.map((factor, idx) => (
                            <li key={idx}>{factor}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
