import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

export default function EmployeePredictiveML({ user }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const { addToast } = useToast();

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
      addToast("Failed to fetch ML insights", "error");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setRunningAnalysis(true);
    addToast("Initializing predictive models...", "info");
    try {
      const res = await fetch('/api/employee-dashboard/ml/run', {
        method: 'POST'
      });
      if (res.ok) {
        const result = await res.json();
        addToast(result.message, "success");
        await fetchInsights();
      } else {
        addToast("ML Engine failed to run", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error running analysis", "error");
    } finally {
      setRunningAnalysis(false);
    }
  };

  // Process data for UI
  const highFlightRisk = insights.filter(i => i.flight_risk_score > 0.7);
  const highBurnoutRisk = insights.filter(i => i.burnout_risk_score > 0.7);
  const unfairComp = insights.filter(i => i.compensation_fairness_score < 0.4);

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
            <div className="bg-surface border border-red-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold opacity-70">High Flight Risk</h4>
                  <span className="material-symbols-outlined text-red-400">flight_takeoff</span>
                </div>
                <div className="text-4xl font-display-lg font-bold text-red-400 mb-2">{highFlightRisk.length}</div>
                <p className="text-sm opacity-70">Employees highly likely to leave within 6 months.</p>
              </div>
            </div>
            
            <div className="bg-surface border border-yellow-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold opacity-70">High Burnout Risk</h4>
                  <span className="material-symbols-outlined text-yellow-400">local_fire_department</span>
                </div>
                <div className="text-4xl font-display-lg font-bold text-yellow-400 mb-2">{highBurnoutRisk.length}</div>
                <p className="text-sm opacity-70">Working excessive hours with declining productivity.</p>
              </div>
            </div>

            <div className="bg-surface border border-orange-500/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
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
            <h3 className="text-xl font-bold mb-6">Employee Risk Roster</h3>
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
                  {insights.map(insight => (
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
