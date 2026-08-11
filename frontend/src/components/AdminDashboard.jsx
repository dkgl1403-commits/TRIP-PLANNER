import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const AdminDashboard = ({ user, onBack }) => {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [adminSubjects, setAdminSubjects] = useState([]);
  const [adminSelectedClassId, setAdminSelectedClassId] = useState(null);
  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/learning/classes');
      if (!res.ok) return;
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error("Failed to fetch classes for admin", err);
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const res = await fetch(`/api/learning/subjects?class_id=${classId}`);
      if (!res.ok) return;
      const data = await res.json();
      setAdminSubjects(data.subjects || []);
    } catch (err) {
      console.error("Failed to fetch subjects for admin", err);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(classSearchQuery.toLowerCase()) || 
    c.level.toString().includes(classSearchQuery)
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?requester_id=${user.login_id}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetLoginId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${targetLoginId}/role?requester_id=${user.login_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error("Failed to update role");
      alert("Role updated successfully!");
      fetchUsers();
    } catch (err) {
      alert("Error updating role: " + err.message);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="dashboard-container">
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
        <button className="btn-primary" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={onBack} 
              className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors"
              title="Back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div>
              <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
              <p style={{ margin: 0, opacity: 0.7 }}>Manage users and roles</p>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
            <h3>Users ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '10px' }}>Login ID</th>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Phone</th>
                    <th style={{ padding: '10px' }}>Role</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.login_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px' }}>{u.login_id}</td>
                      <td style={{ padding: '10px' }}>{u.name}</td>
                      <td style={{ padding: '10px' }}>{u.email}</td>
                      <td style={{ padding: '10px' }}>{u.phone}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          background: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.2)' : u.role === 'FINANCE_USER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: u.role === 'ADMIN' ? '#ef4444' : u.role === 'FINANCE_USER' ? '#10b981' : 'white'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u.login_id, e.target.value)}
                          style={{ 
                            background: 'rgba(0,0,0,0.2)', 
                            color: 'white', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '5px',
                            borderRadius: '5px'
                          }}
                        >
                          <option value="USER">USER</option>
                          <option value="FINANCE_USER">FINANCE_USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Class Management with Searchable Select Dropdown */}
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Class & Subject Management</h3>
                <span className="text-xs text-slate-400">Total Classes: {classes.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: '#94a3b8' }}>
                    Select Class (Search / Filter):
                  </label>
                  
                  {/* Search Input for Dropdown */}
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="🔍 Type to search class (e.g. Class 11, Masterclass)..."
                      value={classSearchQuery}
                      onChange={(e) => setClassSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Dropdown Selector */}
                  <select
                    value={adminSelectedClassId || ''}
                    onChange={(e) => {
                      const cid = e.target.value;
                      setAdminSelectedClassId(cid);
                      if (cid) fetchSubjects(cid);
                    }}
                    size={Math.min(6, filteredClasses.length + 1)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: 'white',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option value="" disabled style={{ color: '#64748b' }}>
                      -- Choose a Class ({filteredClasses.length} found) --
                    </option>
                    {filteredClasses.map(c => (
                      <option key={c.id} value={c.id} style={{ padding: '6px', background: '#0f172a' }}>
                        {c.name} (Level {c.level})
                      </option>
                    ))}
                  </select>
                </div>

                {adminSelectedClassId && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#38bdf8' }}>
                      Subjects in {classes.find(c => c.id === adminSelectedClassId)?.name}
                    </h4>
                    {adminSubjects.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>No subjects found for this class.</p>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                        {adminSubjects.map(s => (
                          <li key={s.id} style={{ marginBottom: '4px' }}>{s.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
