import React, { useState, useEffect } from 'react';
import { Table, Typography, Alert, Spin, Tag, Card, Row, Col, Statistic, Progress } from 'antd';
import { DashboardOutlined, DatabaseOutlined, DesktopOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SystemHealthDashboard = ({ onBack }) => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHealth = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/system/health');
            if (!res.ok) throw new Error("Failed to fetch system health");
            const data = await res.json();
            setHealthData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 15000); // Auto-refresh every 15s
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600*24));
        const h = Math.floor(seconds % (3600*24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        return `${d}d ${h}h ${m}m`;
    };

    const getFrequency = (jobName) => {
        const frequencies = {
            "V2 EOD Ingestion": "Daily (04:00 PM IST)",
            "V2 Feature Pipeline": "Daily (04:15 PM IST)",
            "V2 EOD Predictor": "Daily (04:30 PM IST)",
            "V2 Monthly Retraining": "Monthly (1st, 02:00 AM)"
        };
        return frequencies[jobName] || "—";
    };

    const columns = [
        {
            title: 'Job Name',
            dataIndex: 'job_name',
            key: 'job_name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Frequency',
            key: 'frequency',
            render: (_, record) => <Text type="secondary">{getFrequency(record.job_name)}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let icon = null;
                if (status === 'SUCCESS') { color = 'success'; icon = <CheckCircleOutlined />; }
                else if (status === 'FAILED') { color = 'error'; icon = <CloseCircleOutlined />; }
                else if (status === 'RUNNING') { color = 'processing'; icon = <SyncOutlined spin />; }
                return <Tag icon={icon} color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Last Run',
            dataIndex: 'last_run_at',
            key: 'last_run_at',
            render: (date) => date ? `${new Date(date).toLocaleString()} IST` : <Text type="secondary" italic>Not run yet</Text>
        },
        {
            title: 'End Time',
            dataIndex: 'last_finished_at',
            key: 'last_finished_at',
            render: (date, record) => {
                if (!date) return <Text type="secondary" italic>Running / Unknown</Text>;
                const end = new Date(date);
                const duration = record.last_run_at ? Math.round((end - new Date(record.last_run_at)) / 1000) : 0;
                return (
                    <div>
                        <div>{end.toLocaleString()} IST</div>
                        {duration > 0 && <Text type="secondary" style={{fontSize: '12px'}}>Took {duration}s</Text>}
                    </div>
                );
            }
        },
        {
            title: 'Error Message',
            dataIndex: 'error_message',
            key: 'error_message',
            render: (text) => text ? <Text type="danger">{text}</Text> : <Text type="success">None</Text>
        },
        {
            title: 'Last Run Summary',
            dataIndex: 'last_run_summary',
            key: 'last_run_summary',
            render: (text) => text ? <Text type="success">{text}</Text> : <Text type="secondary" italic>N/A</Text>
        }
    ];

    const processColumns = [
        { title: 'Process', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
        { title: 'PID', dataIndex: 'pid', key: 'pid', render: (t) => <Text type="secondary">{t}</Text> },
        { title: 'CPU %', dataIndex: 'cpu_percent', key: 'cpu_percent', render: (v) => <Tag color={v > 50 ? 'red' : v > 10 ? 'orange' : 'green'}>{v}%</Tag> },
        { title: 'RAM %', dataIndex: 'memory_percent', key: 'memory_percent', render: (v) => <Tag color={v > 50 ? 'red' : v > 10 ? 'orange' : 'blue'}>{v}%</Tag> },
        { title: 'RAM (MB)', dataIndex: 'memory_mb', key: 'memory_mb', render: (v) => `${v} MB` }
    ];

    return (
        <div className="dashboard-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}><DashboardOutlined /> System Health</Title>
                <button className="btn btn-secondary" onClick={onBack}>Back to Dashboard</button>
            </div>

            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

            {loading && !healthData ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : healthData ? (
                <>
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="CPU Usage" value={healthData.server.cpu_usage_percent} suffix="%" prefix={<DesktopOutlined />} />
                                <Progress percent={healthData.server.cpu_usage_percent} showInfo={false} status={healthData.server.cpu_usage_percent > 80 ? 'exception' : 'active'} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Total: {healthData.server.cpu_cores} Cores</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="RAM Usage" value={healthData.server.ram_usage_percent} suffix="%" prefix={<DatabaseOutlined />} />
                                <Progress percent={healthData.server.ram_usage_percent} showInfo={false} status={healthData.server.ram_usage_percent > 85 ? 'exception' : 'active'} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Total: {healthData.server.ram_total_gb} GB</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Disk Usage" value={healthData.server.disk_usage_percent} suffix="%" />
                                <Progress percent={healthData.server.disk_usage_percent} showInfo={false} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Total: {healthData.server.disk_total_gb} GB</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Server Uptime" value={formatUptime(healthData.server.uptime_seconds)} prefix={<ClockCircleOutlined />} />
                                <div style={{ marginTop: '10px' }}>
                                    <Tag color={healthData.server.db_status.startsWith('Online') ? 'success' : 'error'}>
                                        DB Status: {healthData.server.db_status}
                                    </Tag>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {healthData.top_processes && healthData.top_processes.length > 0 && (
                        <Card title={<><DesktopOutlined /> Top Processes (by Memory)</>} style={{ marginBottom: '24px' }}>
                            <Table
                                dataSource={healthData.top_processes}
                                columns={processColumns}
                                rowKey="pid"
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    )}

                    <Card title={<><DatabaseOutlined /> Database Metrics</>} style={{ marginBottom: '24px' }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={6}>
                                <Statistic title="Total DB Size" value={healthData.database.size_gb} suffix="GB" />
                            </Col>
                            <Col xs={24} md={18}>
                                <Text strong>Top 5 Largest Tables</Text>
                                <Table 
                                    dataSource={healthData.database.top_tables} 
                                    columns={[
                                        { title: 'Table Name', dataIndex: 'name', key: 'name' },
                                        { title: 'Size (MB)', dataIndex: 'size_mb', key: 'size_mb' }
                                    ]} 
                                    rowKey="name"
                                    pagination={false}
                                    size="small"
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Background Jobs Status">
                        <Table 
                            dataSource={healthData.jobs} 
                            columns={columns} 
                            rowKey="job_name"
                            pagination={false}
                        />
                    </Card>
                </>
            ) : null}
        </div>
    );
};

export default SystemHealthDashboard;
