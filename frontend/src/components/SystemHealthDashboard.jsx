import React, { useState, useEffect } from 'react';
import { Table, Typography, Alert, Spin, Tag, Progress } from 'antd';
import { DashboardOutlined, DatabaseOutlined, DesktopOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Text } = Typography;

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
            render: (text) => <Text strong style={{ color: 'var(--on-surface)' }}>{text}</Text>
        },
        {
            title: 'Frequency',
            key: 'frequency',
            render: (_, record) => <Text style={{ color: 'var(--on-surface-variant)' }}>{getFrequency(record.job_name)}</Text>
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
            render: (date) => date ? <Text style={{ color: 'var(--on-surface)' }}>{new Date(date).toLocaleString()} IST</Text> : <Text italic style={{ color: 'var(--on-surface-variant)' }}>Not run yet</Text>
        },
        {
            title: 'End Time',
            dataIndex: 'last_finished_at',
            key: 'last_finished_at',
            render: (date, record) => {
                if (!date) return <Text italic style={{ color: 'var(--on-surface-variant)' }}>Running / Unknown</Text>;
                const end = new Date(date);
                const duration = record.last_run_at ? Math.round((end - new Date(record.last_run_at)) / 1000) : 0;
                return (
                    <div>
                        <div style={{ color: 'var(--on-surface)' }}>{end.toLocaleString()} IST</div>
                        {duration > 0 && <div style={{ color: 'var(--on-surface-variant)', fontSize: '12px' }}>Took {duration}s</div>}
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
            render: (text) => text ? <Text type="success">{text}</Text> : <Text italic style={{ color: 'var(--on-surface-variant)' }}>N/A</Text>
        }
    ];

    const processColumns = [
        { title: 'Process', dataIndex: 'name', key: 'name', render: (t) => <Text strong style={{ color: 'var(--on-surface)' }}>{t}</Text> },
        { title: 'PID', dataIndex: 'pid', key: 'pid', render: (t) => <Text style={{ color: 'var(--on-surface-variant)' }}>{t}</Text> },
        { title: 'CPU %', dataIndex: 'cpu_percent', key: 'cpu_percent', render: (v) => <Tag color={v > 50 ? 'red' : v > 10 ? 'orange' : 'green'}>{v}%</Tag> },
        { title: 'RAM %', dataIndex: 'memory_percent', key: 'memory_percent', render: (v) => <Tag color={v > 50 ? 'red' : v > 10 ? 'orange' : 'blue'}>{v}%</Tag> },
        { title: 'RAM (MB)', dataIndex: 'memory_mb', key: 'memory_mb', render: (v) => <Text style={{ color: 'var(--on-surface)' }}>{v} MB</Text> }
    ];

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
                <h2 className="font-display-lg text-3xl font-bold m-0 flex items-center gap-3">
                    <DashboardOutlined /> System Health
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            {loading && !healthData ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-neon-coral border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : healthData ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* CPU Usage Card */}
                        <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl p-6 shadow-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                <DesktopOutlined /> <span className="font-label-md">CPU Usage</span>
                            </div>
                            <div className="font-display-md text-3xl font-bold">
                                {healthData.server.cpu_usage_percent}%
                            </div>
                            <Progress percent={healthData.server.cpu_usage_percent} showInfo={false} status={healthData.server.cpu_usage_percent > 80 ? 'exception' : 'active'} strokeColor={healthData.server.cpu_usage_percent > 80 ? '#FF4D4F' : '#3fb950'} trailColor="rgba(255,255,255,0.1)" />
                            <div className="text-on-surface-variant text-sm mt-1">Total: {healthData.server.cpu_cores} Cores</div>
                        </div>

                        {/* RAM Usage Card */}
                        <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl p-6 shadow-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                <DatabaseOutlined /> <span className="font-label-md">RAM Usage</span>
                            </div>
                            <div className="font-display-md text-3xl font-bold">
                                {healthData.server.ram_usage_percent}%
                            </div>
                            <Progress percent={healthData.server.ram_usage_percent} showInfo={false} status={healthData.server.ram_usage_percent > 85 ? 'exception' : 'active'} strokeColor={healthData.server.ram_usage_percent > 85 ? '#FF4D4F' : '#3fb950'} trailColor="rgba(255,255,255,0.1)" />
                            <div className="text-on-surface-variant text-sm mt-1">Total: {healthData.server.ram_total_gb} GB</div>
                        </div>

                        {/* Disk Usage Card */}
                        <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl p-6 shadow-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                <span className="material-symbols-outlined text-[18px]">storage</span> <span className="font-label-md">Disk Usage</span>
                            </div>
                            <div className="font-display-md text-3xl font-bold">
                                {healthData.server.disk_usage_percent}%
                            </div>
                            <Progress percent={healthData.server.disk_usage_percent} showInfo={false} strokeColor="#3fb950" trailColor="rgba(255,255,255,0.1)" />
                            <div className="text-on-surface-variant text-sm mt-1">Total: {healthData.server.disk_total_gb} GB</div>
                        </div>

                        {/* Uptime Card */}
                        <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                    <ClockCircleOutlined /> <span className="font-label-md">Server Uptime</span>
                                </div>
                                <div className="font-display-md text-2xl font-bold mt-2">
                                    {formatUptime(healthData.server.uptime_seconds)}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Tag color={healthData.server.db_status.startsWith('Online') ? 'success' : 'error'}>
                                    DB Status: {healthData.server.db_status}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    {healthData.top_processes && healthData.top_processes.length > 0 && (
                        <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl flex flex-col mb-6">
                            <div className="px-6 py-4 border-b border-glass-stroke flex items-center gap-2">
                                <DesktopOutlined /> <span className="font-title-md font-bold">Top Processes (by Memory)</span>
                            </div>
                            <div className="p-4" style={{ backgroundColor: 'transparent' }}>
                                <Table
                                    className="custom-table"
                                    dataSource={healthData.top_processes}
                                    columns={processColumns}
                                    rowKey="pid"
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl flex flex-col mb-6">
                        <div className="px-6 py-4 border-b border-glass-stroke flex items-center gap-2">
                            <DatabaseOutlined /> <span className="font-title-md font-bold">Database Metrics</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="col-span-1 bg-surface-container border border-glass-stroke rounded-xl p-5 flex flex-col gap-2">
                                <span className="text-on-surface-variant font-label-md">Total DB Size</span>
                                <span className="font-display-md text-3xl font-bold">{healthData.database.size_gb} <span className="text-xl">GB</span></span>
                            </div>
                            <div className="col-span-1 md:col-span-3">
                                <span className="block font-title-sm font-bold mb-3">Top 5 Largest Tables</span>
                                <div className="bg-surface-container border border-glass-stroke rounded-xl overflow-hidden">
                                    <Table 
                                        className="custom-table"
                                        dataSource={healthData.database.top_tables} 
                                        columns={[
                                            { title: 'Table Name', dataIndex: 'name', key: 'name', render: (t) => <Text style={{ color: 'var(--on-surface)' }}>{t}</Text> },
                                            { title: 'Size (MB)', dataIndex: 'size_mb', key: 'size_mb', render: (t) => <Text style={{ color: 'var(--on-surface)' }}>{t}</Text> }
                                        ]} 
                                        rowKey="name"
                                        pagination={false}
                                        size="small"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl overflow-hidden shadow-xl flex flex-col mb-6">
                        <div className="px-6 py-4 border-b border-glass-stroke">
                            <span className="font-title-md font-bold">Background Jobs Status</span>
                        </div>
                        <div className="p-4" style={{ backgroundColor: 'transparent' }}>
                            <Table 
                                className="custom-table"
                                dataSource={healthData.jobs} 
                                columns={columns} 
                                rowKey="job_name"
                                pagination={false}
                            />
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default SystemHealthDashboard;
