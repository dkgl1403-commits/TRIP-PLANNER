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

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                // Fetch Factors (Now Feature Importances)
                const factorRes = await fetch('/api/finance/factors');
                if (!factorRes.ok) throw new Error("Failed to fetch factors");
                const factorData = await factorRes.json();
                setFactors(factorData);

                // Fetch Predictions
                const predRes = await fetch('/api/finance/predictions');
                if (!predRes.ok) throw new Error("Failed to fetch predictions");
                const predData = await predRes.json();
                
                if (predData && predData.length > 0) {
                    setPrediction(predData[0]); // The latest prediction
                }

                // Fetch Indices
                const indRes = await fetch('/api/finance/indices');
                if (!indRes.ok) throw new Error("Failed to fetch indices");
                const indData = await indRes.json();
                setIndices(indData);
                
                // Fetch History
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
        const interval = setInterval(fetchData, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    const getSignalColor = (signal) => {
        if (!signal) return '#8c8c8c';
        if (signal.includes('CRASH')) return '#cf1322';
        if (signal.includes('DOWN') || signal.includes('MILD') && signal.includes('SELL')) return '#faad14';
        if (signal.includes('BOOM')) return '#3f8600';
        return '#52c41a'; // BUY_MILD
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
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                    onClick={onBack} 
                    style={{ 
                        marginRight: '16px', 
                        cursor: 'pointer', 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        border: '1px solid #d9d9d9', 
                        borderRadius: '6px',
                        padding: '6px 16px',
                        fontSize: '14px',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                    ← Back to App
                </button>
                <Title level={2} style={{ margin: 0 }}>XGBoost EOD Engine (V2)</Title>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 24 }} />}
            
            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={24} md={12}>
                    <Card 
                        title="BSE SENSEX V2 Proxy" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ height: '250px', width: '100%' }}>
                            {history.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={history} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} />
                                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} width={60} />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="sensex_close" name="Close Price" stroke="#1677ff" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} />
                            )}
                        </div>
                        {prediction && indices && indices.sensex ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <Statistic
                                    title="AI EOD Signal"
                                    value={prediction.signal}
                                    valueStyle={{ color: getSignalColor(prediction.signal), fontWeight: 'bold' }}
                                    prefix={getSignalIcon(prediction.signal)}
                                />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                    <div>
                                        <Text type="secondary">EOD Close</Text><br/>
                                        <Text strong>{indices.sensex.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text type="secondary">Signal Confidence</Text><br/>
                                        <Text strong type="secondary">
                                            {(prediction.confidence * 100).toFixed(1)}%
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : <Text type="secondary">Loading prediction data...</Text>}
                    </Card>
                </Col>

                <Col span={24} md={12}>
                    <Card 
                        title="NSE NIFTY 50 V2 Target" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ height: '250px', width: '100%' }}>
                            {history.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={history} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} />
                                        <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} width={60} />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="nifty_close" name="Close Price" stroke="#52c41a" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} />
                            )}
                        </div>
                        {prediction && indices && indices.nifty50 ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <Statistic
                                    title="AI EOD Signal"
                                    value={prediction.signal}
                                    valueStyle={{ color: getSignalColor(prediction.signal), fontWeight: 'bold' }}
                                    prefix={getSignalIcon(prediction.signal)}
                                />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                    <div>
                                        <Text type="secondary">EOD Close</Text><br/>
                                        <Text strong>{indices.nifty50.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text type="secondary">Signal Confidence</Text><br/>
                                        <Text strong type="secondary">
                                            {(prediction.confidence * 100).toFixed(1)}%
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : <Text type="secondary">Loading prediction data...</Text>}
                    </Card>
                </Col>
            </Row>

            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card 
                        title="XGBoost EOD Probability Matrix (Softmax Distribution)" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                        }}
                    >
                        {prediction ? (
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Text type="secondary">Crash (&lt;-1%)</Text>
                                    <Progress percent={parseFloat((prediction.prob_crash * 100).toFixed(1))} strokeColor="#cf1322" />
                                </Col>
                                <Col span={6}>
                                    <Text type="secondary">Down (-1% to 0%)</Text>
                                    <Progress percent={parseFloat((prediction.prob_down * 100).toFixed(1))} strokeColor="#faad14" />
                                </Col>
                                <Col span={6}>
                                    <Text type="secondary">Up (0% to +1%)</Text>
                                    <Progress percent={parseFloat((prediction.prob_up * 100).toFixed(1))} strokeColor="#52c41a" />
                                </Col>
                                <Col span={6}>
                                    <Text type="secondary">Boom (&gt;+1%)</Text>
                                    <Progress percent={parseFloat((prediction.prob_boom * 100).toFixed(1))} strokeColor="#3f8600" />
                                </Col>
                            </Row>
                        ) : <Text type="secondary">No predictions available for today.</Text>}
                    </Card>
                </Col>
            </Row>

            <Card 
                title="Top 10 Feature Importances (Walk-Forward Retraining)" 
                bordered={false}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    This bar chart represents the internal decision nodes of the `.joblib` XGBoost model. It highlights which of the 36 engineered factors (including FinBERT Sentiment and Nifty Technicals) the model relies on most heavily.
                </Text>
                
                <div style={{ height: '400px', width: '100%' }}>
                    {factors.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={factors} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                                <YAxis dataKey="factor_name" type="category" width={100} tick={{fontSize: 12}} />
                                <RechartsTooltip 
                                    formatter={(value) => [`${value.toFixed(2)}%`, 'Importance']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="impact_weight" fill="#1677ff" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Text type="secondary">Loading feature importances...</Text>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FinanceDashboard;
