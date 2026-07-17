import React, { useState, useEffect } from 'react';
import { Typography, Alert, Spin, Card, Row, Col, Statistic, Progress } from 'antd';
import { RiseOutlined, FallOutlined, WarningOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const FinanceDashboard = ({ onBack }) => {
    const [factors, setFactors] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [indices, setIndices] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refined Dark Professional Financial Palette
    const darkNavy = '#010409'; 
    const cardBg = '#0d1117';   
    const borderColor = '#30363d';
    const textColor = '#e6edf3';
    const secondaryTextColor = '#8b949e';
    const accentColor = '#58a6ff';

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
        if (!signal) return '#8c8c8c';
        if (signal.includes('CRASH')) return '#f85149';
        if (signal.includes('DOWN') || (signal.includes('MILD') && signal.includes('SELL'))) return '#d29922';
        if (signal.includes('BOOM')) return '#3fb950';
        return accentColor;
    };

    const getSignalIcon = (signal) => {
        if (!signal) return null;
        if (signal.includes('CRASH')) return <WarningOutlined />;
        if (signal.includes('DOWN') || signal.includes('SELL')) return <FallOutlined />;
        if (signal.includes('BOOM')) return <ThunderboltOutlined />;
        return <RiseOutlined />;
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', backgroundColor: darkNavy, minHeight: '100vh', color: textColor, fontFamily: "'Inter', -apple-system, sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                    onClick={onBack} 
                    style={{ 
                        marginRight: '16px', 
                        cursor: 'pointer', 
                        background: 'transparent', 
                        border: `1px solid ${borderColor}`, 
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: secondaryTextColor,
                        transition: 'none'
                    }}
                >
                    ← Back to App
                </button>
                <Title level={2} style={{ margin: 0, color: textColor, fontWeight: 600, fontSize: '22px' }}>XGBoost EOD Engine (V2)</Title>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 24, backgroundColor: '#3d1616', borderColor: '#f85149', color: '#ffa198' }} />}
            
            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={24} md={12}>
                    <Card 
                        title={<span style={{ color: textColor, fontSize: '14px', fontWeight: 600 }}>BSE SENSEX V2 Proxy</span>}
                        bordered={false}
                        style={{ backgroundColor: cardBg, borderRadius: '8px', border: `1px solid ${borderColor}` }}
                        headStyle={{ borderBottom: `1px solid ${borderColor}`, minHeight: '48px', color: textColor }}
                    >
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid stroke={borderColor} strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke={secondaryTextColor} tick={{fontSize: 12, fill: secondaryTextColor}} />
                                    <YAxis stroke={secondaryTextColor} tick={{fontSize: 12, fill: secondaryTextColor}} width={50} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: darkNavy, borderColor: borderColor, color: textColor }} />
                                    <Line type="monotone" dataKey="sensex_close" stroke={accentColor} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        {prediction && indices ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: darkNavy, borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                                <Statistic title={<span style={{ color: secondaryTextColor, fontSize: '13px' }}>AI EOD Signal</span>} value={prediction.signal} valueStyle={{ color: getSignalColor(prediction.signal), fontSize: '20px', fontWeight: 700 }} prefix={getSignalIcon(prediction.signal)} />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderColor}`, paddingTop: '12px' }}>
                                    <div><Text style={{ color: secondaryTextColor, fontSize: '12px' }}>EOD Close</Text><br/><Text strong style={{ color: textColor, fontSize: '15px' }}>{indices.sensex.toFixed(2)}</Text></div>
                                    <div style={{ textAlign: 'right' }}><Text style={{ color: secondaryTextColor, fontSize: '12px' }}>Confidence</Text><br/><Text strong style={{ color: textColor, fontSize: '15px' }}>{(prediction.confidence * 100).toFixed(1)}%</Text></div>
                                </div>
                            </div>
                        ) : <Text style={{ color: secondaryTextColor }}>Loading prediction data...</Text>}
                    </Card>
                </Col>

                <Col span={24} md={12}>
                    <Card 
                        title={<span style={{ color: textColor, fontSize: '14px', fontWeight: 600 }}>NSE NIFTY 50 V2 Target</span>}
                        bordered={false}
                        style={{ backgroundColor: cardBg, borderRadius: '8px', border: `1px solid ${borderColor}` }}
                        headStyle={{ borderBottom: `1px solid ${borderColor}`, minHeight: '48px', color: textColor }}
                    >
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid stroke={borderColor} strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" stroke={secondaryTextColor} tick={{fontSize: 12, fill: secondaryTextColor}} />
                                    <YAxis stroke={secondaryTextColor} tick={{fontSize: 12, fill: secondaryTextColor}} width={50} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: darkNavy, borderColor: borderColor, color: textColor }} />
                                    <Line type="monotone" dataKey="nifty_close" stroke="#3fb950" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        {prediction && indices ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: darkNavy, borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                                <Statistic title={<span style={{ color: secondaryTextColor, fontSize: '13px' }}>AI EOD Signal</span>} value={prediction.signal} valueStyle={{ color: getSignalColor(prediction.signal), fontSize: '20px', fontWeight: 700 }} prefix={getSignalIcon(prediction.signal)} />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderColor}`, paddingTop: '12px' }}>
                                    <div><Text style={{ color: secondaryTextColor, fontSize: '12px' }}>EOD Close</Text><br/><Text strong style={{ color: textColor, fontSize: '15px' }}>{indices.nifty50.toFixed(2)}</Text></div>
                                    <div style={{ textAlign: 'right' }}><Text style={{ color: secondaryTextColor, fontSize: '12px' }}>Confidence</Text><br/><Text strong style={{ color: textColor, fontSize: '15px' }}>{(prediction.confidence * 100).toFixed(1)}%</Text></div>
                                </div>
                            </div>
                        ) : <Text style={{ color: secondaryTextColor }}>Loading prediction data...</Text>}
                    </Card>
                </Col>
            </Row>

            <Card 
                title={<span style={{ color: textColor, fontSize: '14px', fontWeight: 600 }}>XGBoost EOD Probability Matrix</span>} 
                bordered={false}
                style={{ backgroundColor: cardBg, borderRadius: '8px', border: `1px solid ${borderColor}`, marginBottom: '24px' }}
                headStyle={{ borderBottom: `1px solid ${borderColor}`, minHeight: '48px', color: textColor }}
            >
                {prediction ? (
                    <Row gutter={24}>
                        {[ {label: 'Crash', val: 'prob_crash', color: '#f85149'}, {label: 'Down', val: 'prob_down', color: '#d29922'}, {label: 'Up', val: 'prob_up', color: '#3fb950'}, {label: 'Boom', val: 'prob_boom', color: accentColor} ].map(item => (
                            <Col span={6} key={item.label}>
                                <Text style={{ color: secondaryTextColor, fontSize: '12px', marginBottom: '8px', display: 'block' }}>{item.label}</Text>
                                <Progress percent={parseFloat((prediction[item.val] * 100).toFixed(1))} strokeColor={item.color} trailColor={borderColor} size="small" />
                            </Col>
                        ))}
                    </Row>
                ) : <Text style={{ color: secondaryTextColor }}>No predictions available.</Text>}
            </Card>

            <Card 
                title={<span style={{ color: textColor, fontSize: '14px', fontWeight: 600 }}>Top 10 Feature Importances</span>} 
                bordered={false}
                style={{ backgroundColor: cardBg, borderRadius: '8px', border: `1px solid ${borderColor}` }}
                headStyle={{ borderBottom: `1px solid ${borderColor}`, minHeight: '48px', color: textColor }}
            >
                <Text style={{ display: 'block', marginBottom: '16px', color: secondaryTextColor, fontSize: '13px' }}>Internal decision nodes of the XGBoost model.</Text>
                <div style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={factors} layout="vertical">
                            <CartesianGrid stroke={borderColor} horizontal={false} />
                            <XAxis type="number" stroke={secondaryTextColor} tick={{fontSize: 12}} tickFormatter={(v) => `${v}%`} />
                            <YAxis dataKey="factor_name" type="category" stroke={secondaryTextColor} width={120} tick={{fontSize: 12, fill: secondaryTextColor}} />
                            <RechartsTooltip contentStyle={{ backgroundColor: darkNavy, borderColor: borderColor, color: textColor }} />
                            <Bar dataKey="impact_weight" fill={accentColor} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default FinanceDashboard;