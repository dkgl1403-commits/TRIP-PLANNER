import React, { useState, useEffect } from 'react';
import { Table, Typography, Alert, Spin, Tag, Card, Row, Col, Statistic } from 'antd';
import { EnvironmentOutlined, BankOutlined, GlobalOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const { Title, Text } = Typography;

const FinanceDashboard = ({ onBack }) => {
    const [factors, setFactors] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [indices, setIndices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                // Fetch Factors
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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { 
            title: 'Factor (Event)', 
            dataIndex: 'factor_name', 
            key: 'factor_name',
            render: (text) => <Text strong>{text}</Text>
        },
        { 
            title: 'Geography', 
            dataIndex: 'geography', 
            key: 'geography',
            render: (geo) => <Tag icon={<EnvironmentOutlined />} color="blue">{geo}</Tag>
        },
        { 
            title: 'Event Category', 
            dataIndex: 'event_category', 
            key: 'event_category',
            render: (cat) => <Tag color="purple">{cat}</Tag>
        },
        { 
            title: 'Sector Impacted', 
            dataIndex: 'sector_impacted', 
            key: 'sector_impacted',
            render: (sec) => <Tag icon={<BankOutlined />} color="cyan">{sec}</Tag>
        },
        { 
            title: 'Domain', 
            dataIndex: 'domain', 
            key: 'domain',
            render: (dom) => <Tag icon={<GlobalOutlined />}>{dom}</Tag>
        },
        { 
            title: 'Impact Weight', 
            dataIndex: 'impact_weight', 
            key: 'impact_weight', 
            sorter: (a, b) => a.impact_weight - b.impact_weight,
            defaultSortOrder: 'descend',
            render: val => {
                const weight = parseFloat(val).toFixed(2);
                if (weight > 0) return <Text type="success">+{weight}</Text>;
                if (weight < 0) return <Text type="danger">{weight}</Text>;
                return <Text type="secondary">{weight}</Text>;
            } 
        },
    ];

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
                <Title level={2} style={{ margin: 0 }}>AI Finance Engine</Title>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 24 }} />}
            
            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={24} md={12}>
                    <Card 
                        title="BSE SENSEX Prediction" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ height: '350px', width: '100%' }}>
                            <AdvancedRealTimeChart symbol="BSE:SENSEX" interval="D" autosize hide_top_toolbar style="2" />
                        </div>
                        {prediction && indices && indices.sensex ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <Statistic
                                    title="Predicted Market Change"
                                    value={prediction.predicted_percent || 0}
                                    precision={2}
                                    valueStyle={{ color: prediction.predicted_percent >= 0 ? '#3f8600' : '#cf1322' }}
                                    prefix={prediction.predicted_percent >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                    suffix="%"
                                />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                    <div>
                                        <Text type="secondary">Current Close</Text><br/>
                                        <Text strong>{indices.sensex.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text type="secondary">Predicted Close</Text><br/>
                                        <Text strong type={prediction.predicted_percent >= 0 ? "success" : "danger"}>
                                            {(indices.sensex * (1 + (prediction.predicted_percent / 100))).toFixed(2)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : <Text type="secondary">Loading index data...</Text>}
                    </Card>
                </Col>

                <Col span={24} md={12}>
                    <Card 
                        title="NSE NIFTY 50 Prediction" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ height: '350px', width: '100%' }}>
                            <AdvancedRealTimeChart symbol="BSE:SENSEX50" interval="D" autosize hide_top_toolbar style="2" />
                        </div>
                        {prediction && indices && indices.nifty50 ? (
                            <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <Statistic
                                    title="Predicted Market Change"
                                    value={prediction.predicted_percent || 0}
                                    precision={2}
                                    valueStyle={{ color: prediction.predicted_percent >= 0 ? '#3f8600' : '#cf1322' }}
                                    prefix={prediction.predicted_percent >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                    suffix="%"
                                />
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                    <div>
                                        <Text type="secondary">Current Close</Text><br/>
                                        <Text strong>{indices.nifty50.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text type="secondary">Predicted Close</Text><br/>
                                        <Text strong type={prediction.predicted_percent >= 0 ? "success" : "danger"}>
                                            {(indices.nifty50 * (1 + (prediction.predicted_percent / 100))).toFixed(2)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : <Text type="secondary">Loading index data...</Text>}
                    </Card>
                </Col>
            </Row>

            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={24} md={12}>
                    <Card 
                        title="AI Reasoning" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%'
                        }}
                    >
                        {prediction ? (
                            <Text>{prediction.reasoning}</Text>
                        ) : <Text type="secondary">No predictions available for today.</Text>}
                    </Card>
                </Col>

                <Col span={24} md={12}>
                    <Card 
                        title="Yesterday's Reality Check & Learning" 
                        bordered={false}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                            borderRadius: '12px',
                            height: '100%',
                            background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f5f9 100%)'
                        }}
                    >
                        {prediction && prediction.actual_percent !== null ? (
                            <>
                                <Statistic
                                    title="Actual Market Close"
                                    value={prediction.actual_percent}
                                    precision={2}
                                    valueStyle={{ color: prediction.actual_percent >= 0 ? '#3f8600' : '#cf1322' }}
                                    prefix={prediction.actual_percent >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                    suffix="%"
                                />
                                <div style={{ marginTop: '16px' }}>
                                    <Text strong>AI Post-Mortem Feedback: </Text>
                                    <Text>{prediction.learning_feedback}</Text>
                                </div>
                            </>
                        ) : (
                            <Text type="secondary">Waiting for market to close (4:00 PM) to generate feedback loop.</Text>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card 
                title="Active Macro & Micro Market Drivers" 
                bordered={false}
                style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    This table ranks all distinct global and domestic events extracted from recent news based on their calculated Impact Weight (a combination of media buzz and historical feedback adjustments).
                </Text>
                <Table 
                    dataSource={factors} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default FinanceDashboard;
