import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const FinanceDashboard = ({ onBack }) => {
    const [factors, setFactors] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [indices, setIndices] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // FIN-14: Added states to track interaction for the 3D 'Back to App' button press and hover effects
    const [btnPressed, setBtnPressed] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);

    const darkNavy = 'transparent'; 
    const borderColor = 'var(--glass-stroke)';
    const textColor = 'var(--on-surface)';
    const secondaryTextColor = 'var(--on-surface-variant)';
    const accentColor = '#FF6B4A';

    // FIN-13: Helper function to safely extract open, close, and date values for indices with robust fallbacks
    const getIndexData = (key) => {
        if (!indices) return { open: 0, close: 0, date: '' };
        const val = indices[key];
        let open = null;
        let close = null;
        let date = null;

        if (val && typeof val === 'object') {
            open = val.open;
            close = val.close;
            date = val.date;
        }

        if (open === null || open === undefined) {
            open = indices[`${key}_open`] !== undefined ? indices[`${key}_open`] : (indices[`${key}Open`] !== undefined ? indices[`${key}Open`] : val);
        }
        if (close === null || close === undefined) {
            close = indices[`${key}_close`] !== undefined ? indices[`${key}_close`] : (indices[`${key}Close`] !== undefined ? indices[`${key}Close`] : val);
        }
        if (date === null || date === undefined) {
            date = indices[`${key}_date`] || indices[`${key}Date`] || indices.date || '';
        }

        const numOpen = typeof open === 'number' ? open : parseFloat(open);
        const numClose = typeof close === 'number' ? close : parseFloat(close);

        return {
            open: isNaN(numOpen) ? 0 : numOpen,
            close: isNaN(numClose) ? 0 : numClose,
            date: date || ''
        };
    };

    const formatFactorName = (text) => {
        if (!text) return text;
        const mapping = {
            'log_ret_^NSEI': 'Nifty 50',
            'log_ret_^BSESN': 'Sensex',
            'log_ret_RELIANCE.NS': 'Reliance Ind.',
            'log_ret_HDFCBANK.NS': 'HDFC Bank',
            'log_ret_ICICIBANK.NS': 'ICICI Bank',
            'log_ret_INFY.NS': 'Infosys',
            'log_ret_^INDIAVIX': 'India VIX',
            'log_ret_^GSPC': 'S&P 500',
            'log_ret_^NSEBANK': 'Nifty Bank',
            'log_ret_^CNXIT': 'Nifty IT',
            'log_ret_^CNXAUTO': 'Nifty Auto',
            'log_ret_^CNXMETAL': 'Nifty Metal',
            'log_ret_^TNX': 'US 10Y Yield',
            'log_ret_DX-Y.NYB': 'US Dollar Index',
            'log_ret_CL=F': 'Crude Oil',
            'log_ret_HG=F': 'Copper',
            'log_ret_GC=F': 'Gold',
            'rsi_14': 'RSI (14)',
            'macd_hist': 'MACD Histogram',
            'atr_14': 'ATR (14)',
            'bb_width': 'Bollinger Band Width',
            'dist_200sma': 'Dist. from 200 SMA',
            'sentiment_score': 'FinBERT Sentiment'
        };
        if (mapping[text]) return mapping[text];
        
        const prefixes = ['dom_', 'intl_', 'geo_', 'com_', 'sec_', 'pol_', 'reg_'];
        let formatted = text;
        for (const prefix of prefixes) {
            if (formatted.startsWith(prefix)) {
                formatted = formatted.substring(prefix.length);
                break;
            }
        }
        return formatted.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const factorRes = await fetch('/api/finance/factors');
                if (!factorRes.ok) throw new Error("Failed to fetch factors");
                const factorData = await factorRes.json();
                setFactors(factorData);

                const predRes = await fetch('/api/finance/predictions');
                if (!predRes.ok) throw new Error("Failed to fetch predictions");
                const predData = await predRes.json();
                
                if (predData && predData.length > 0) {
                    setPrediction(predData[0]);
                }

                const indRes = await fetch('/api/finance/indices');
                if (!indRes.ok) throw new Error("Failed to fetch indices");
                const indData = await indRes.json();
                setIndices(indData);
                
                const histRes = await fetch('/api/finance/history');
                if (!histRes.ok) throw new Error("Failed to fetch history");
                const histData = await histRes.json();
                setHistory(histData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    const getSignalColor = (signal) => {
        if (!signal) return 'text-on-surface-variant';
        if (signal.includes('CRASH')) return 'text-error';
        if (signal.includes('DOWN') || (signal.includes('MILD') && signal.includes('SELL'))) return 'text-yellow-500';
        if (signal.includes('BOOM')) return 'text-green-500';
        return 'text-neon-coral';
    };

    const getSignalIcon = (signal) => {
        if (!signal) return null;
        if (signal.includes('CRASH')) return 'warning';
        if (signal.includes('DOWN') || signal.includes('SELL')) return 'trending_down';
        if (signal.includes('BOOM')) return 'bolt';
        return 'trending_up';
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-neon-coral border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col pt-24 px-4 sm:px-8 max-w-7xl mx-auto text-on-surface font-body-md pb-12">
            <div className="flex items-center mb-8 gap-4">
                <button 
                    onClick={onBack} 
                    className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors"
                    title="Back"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                {/* FIN-16: Replaced 'Earth' icon concept with Indian Rupee sign for Global Expense/Finance context */}
                <h2 className="font-display-lg text-3xl font-bold m-0 flex items-center gap-2">
                    <span className="material-symbols-outlined">currency_rupee</span>
                    XGBoost EOD Engine (V2)
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl flex flex-col">
                    <div className="px-6 py-4 border-b border-glass-stroke">
                        <span className="font-title-md font-bold">BSE SENSEX V2 Proxy</span>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke="#8b949e" tick={{fontSize: 12, fill: "#8b949e"}} />
                                    <YAxis stroke="#8b949e" tick={{fontSize: 12, fill: "#8b949e"}} width={65} domain={['dataMin - 5%', 'dataMax + 5%']} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#111316', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="sensex_close" stroke="#FF6B4A" strokeWidth={2} dot={false} connectNulls={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        {prediction && indices ? (
                            <div className="mt-2 p-5 bg-surface-container border border-glass-stroke rounded-xl">
                                <div className="flex flex-col gap-1">
                                    <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">AI EOD Signal</span>
                                    <div className={`flex items-center gap-2 font-display-md text-2xl font-bold ${getSignalColor(prediction.signal)}`}>
                                        <span className="material-symbols-outlined">{getSignalIcon(prediction.signal)}</span>
                                        {prediction.signal}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-glass-stroke flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-label-sm text-on-surface-variant">EOD Close</span>
                                        <span className="font-title-md font-bold">{indices.sensex.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="font-label-sm text-on-surface-variant">Confidence</span>
                                        <span className="font-title-md font-bold">{(prediction.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="text-on-surface-variant">Loading prediction data...</div>}
                    </div>
                </div>

                <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl flex flex-col">
                    <div className="px-6 py-4 border-b border-glass-stroke">
                        <span className="font-title-md font-bold">NSE NIFTY 50 V2 Target</span>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke="#8b949e" tick={{fontSize: 12, fill: "#8b949e"}} />
                                    <YAxis stroke="#8b949e" tick={{fontSize: 12, fill: "#8b949e"}} width={65} domain={['dataMin - 5%', 'dataMax + 5%']} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#111316', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="nifty_close" stroke="#3fb950" strokeWidth={2} dot={false} connectNulls={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        {prediction && indices ? (
                            <div className="mt-2 p-5 bg-surface-container border border-glass-stroke rounded-xl">
                                <div className="flex flex-col gap-1">
                                    <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">AI EOD Signal</span>
                                    <div className={`flex items-center gap-2 font-display-md text-2xl font-bold ${getSignalColor(prediction.signal)}`}>
                                        <span className="material-symbols-outlined">{getSignalIcon(prediction.signal)}</span>
                                        {prediction.signal}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-glass-stroke flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-label-sm text-on-surface-variant">EOD Close</span>
                                        <span className="font-title-md font-bold">{indices.nifty50.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="font-label-sm text-on-surface-variant">Confidence</span>
                                        <span className="font-title-md font-bold">{(prediction.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="text-on-surface-variant">Loading prediction data...</div>}
                    </div>
                </div>
            </div>

            <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl mb-6">
                <div className="px-6 py-4 border-b border-glass-stroke">
                    <span className="font-title-md font-bold">XGBoost EOD Probability Matrix</span>
                </div>
                <div className="p-6">
                    {prediction ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="font-label-sm">Crash (&lt;-1%)</span>
                                <div className="w-full bg-surface-container rounded-full h-2.5">
                                    <div className="bg-error h-2.5 rounded-full" style={{ width: `${(prediction.prob_crash * 100).toFixed(1)}%` }}></div>
                                </div>
                                <span className="font-body-md font-bold">{(prediction.prob_crash * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-label-sm">Down (-1% to 0%)</span>
                                <div className="w-full bg-surface-container rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(prediction.prob_down * 100).toFixed(1)}%` }}></div>
                                </div>
                                <span className="font-body-md font-bold">{(prediction.prob_down * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-label-sm">Up (0% to +1%)</span>
                                <div className="w-full bg-surface-container rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(prediction.prob_up * 100).toFixed(1)}%` }}></div>
                                </div>
                                <span className="font-body-md font-bold">{(prediction.prob_up * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-label-sm">Boom (&gt;+1%)</span>
                                <div className="w-full bg-surface-container rounded-full h-2.5">
                                    <div className="bg-neon-coral h-2.5 rounded-full" style={{ width: `${(prediction.prob_boom * 100).toFixed(1)}%` }}></div>
                                </div>
                                <span className="font-body-md font-bold">{(prediction.prob_boom * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    ) : <div className="text-on-surface-variant">No predictions available.</div>}
                </div>
            </div>

            <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-glass-stroke">
                    <span className="font-title-md font-bold">Top 10 Feature Importances</span>
                </div>
                <div className="p-6">
                    <p className="font-body-sm text-on-surface-variant mb-6">Internal decision nodes of the XGBoost model.</p>
                    <div className="h-[400px] w-full">
                        {factors.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={factors} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                    <XAxis type="number" stroke="#8b949e" tick={{fontSize: 12}} tickFormatter={(v) => `${v}%`} />
                                    <YAxis dataKey="factor_name" type="category" stroke="#8b949e" width={120} tick={{fontSize: 12, fill: "#8b949e"}} tickFormatter={formatFactorName} />
                                    <RechartsTooltip 
                                        formatter={(value) => [`${value.toFixed(2)}%`, 'Importance']}
                                        labelFormatter={(label) => formatFactorName(label)}
                                        contentStyle={{ backgroundColor: '#111316', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} 
                                    />
                                    <Bar dataKey="impact_weight" fill="#FF6B4A" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-on-surface-variant">Loading feature importances...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;