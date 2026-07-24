import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';

export default function EmployeeDataIngestion({ user }) {
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // Manual form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [inTime, setInTime] = useState('09:00');
  const [outTime, setOutTime] = useState('17:00');
  const [isLeave, setIsLeave] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [productivityScore, setProductivityScore] = useState(85);
  
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchLogs();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee-dashboard/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        if (data.length > 0) setSelectedEmployee(data[0].id);
      }
    } catch (e) {
      console.error(e);
      addToast("Failed to fetch employees", "error");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/employee-dashboard/logs?limit=50');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
      addToast("Failed to fetch logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      const payload = {
        employee_id: selectedEmployee,
        date: date,
        in_time: isLeave ? null : inTime,
        out_time: isLeave ? null : outTime,
        is_leave: isLeave,
        leave_type: isLeave ? leaveType : null,
        productivity_score: isLeave ? null : parseInt(productivityScore)
      };

      const res = await fetch('/api/employee-dashboard/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast("Log added successfully", "success");
        fetchLogs();
      } else {
        addToast("Failed to add log", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error submitting log", "error");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    addToast("Uploading logs...", "info");
    try {
      const res = await fetch('/api/employee-dashboard/logs/bulk', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        addToast(result.message, "success");
        fetchLogs();
      } else {
        const err = await res.json();
        addToast(`Upload failed: ${err.detail || 'Unknown error'}`, "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error uploading file", "error");
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full text-on-surface font-body-md text-white mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Forms */}
        <div className="space-y-8">
          
          {/* Manual Entry Form */}
          <div className="bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-neon-coral">edit_document</span>
              Manual Daily Log
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm opacity-70 mb-1">Employee</label>
                <select 
                  className="w-full bg-surface-variant border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-coral outline-none"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm opacity-70 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-surface-variant border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-coral outline-none" />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isLeave} onChange={e => setIsLeave(e.target.checked)} className="w-5 h-5 accent-neon-coral" />
                    <span>On Leave</span>
                  </label>
                </div>
              </div>

              {!isLeave ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm opacity-70 mb-1">In Time</label>
                      <input type="time" value={inTime} onChange={e => setInTime(e.target.value)} className="w-full bg-surface-variant border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-coral outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm opacity-70 mb-1">Out Time</label>
                      <input type="time" value={outTime} onChange={e => setOutTime(e.target.value)} className="w-full bg-surface-variant border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-coral outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm opacity-70 mb-1">Productivity Score ({productivityScore}/100)</label>
                    <input type="range" min="0" max="100" value={productivityScore} onChange={e => setProductivityScore(e.target.value)} className="w-full accent-neon-coral" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm opacity-70 mb-1">Leave Type</label>
                  <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="w-full bg-surface-variant border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-neon-coral outline-none">
                    <option value="">Select type...</option>
                    <option value="PTO">PTO</option>
                    <option value="Sick">Sick</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-neon-coral text-white font-bold rounded-lg p-3 hover:bg-[#E05236] transition-colors mt-4">
                Save Log
              </button>
            </form>
          </div>

          {/* Bulk Upload Form */}
          <div className="bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-neon-coral">upload_file</span>
              Bulk CSV Upload
            </h3>
            <p className="opacity-70 text-sm mb-4">Upload a CSV file containing daily logs. Required columns: employee_id, date (YYYY-MM-DD), in_time (HH:MM), out_time, is_leave, leave_type, productivity_score.</p>
            <div className="relative border-2 border-dashed border-surface-variant rounded-xl p-8 text-center hover:border-neon-coral/50 transition-colors cursor-pointer group">
              <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-neon-coral transition-colors mb-2">cloud_upload</span>
              <p className="font-bold">Click to upload CSV</p>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Logs Table */}
        <div className="bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm flex flex-col max-h-[800px]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-neon-coral">history</span>
            Recent Logs
          </h3>
          <div className="flex-1 overflow-auto rounded-xl border border-surface-variant">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-variant/50 sticky top-0">
                <tr>
                  <th className="p-3 text-sm font-semibold opacity-80 border-b border-surface-variant">Date</th>
                  <th className="p-3 text-sm font-semibold opacity-80 border-b border-surface-variant">Employee</th>
                  <th className="p-3 text-sm font-semibold opacity-80 border-b border-surface-variant">Status</th>
                  <th className="p-3 text-sm font-semibold opacity-80 border-b border-surface-variant">Hours</th>
                  <th className="p-3 text-sm font-semibold opacity-80 border-b border-surface-variant text-right">Prod</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center opacity-50">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center opacity-50">No logs found</td></tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors border-b border-surface-variant/30">
                      <td className="p-3 text-sm">{log.date}</td>
                      <td className="p-3 font-medium">{log.employee_name}</td>
                      <td className="p-3">
                        {log.is_leave ? (
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">{log.leave_type || 'Leave'}</span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">Present</span>
                        )}
                      </td>
                      <td className="p-3 text-sm opacity-80 text-nowrap">
                        {!log.is_leave ? `${log.in_time} - ${log.out_time}` : '-'}
                      </td>
                      <td className="p-3 text-right font-bold text-neon-coral">
                        {log.productivity_score || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
