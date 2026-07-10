import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const AdminDashboard = ({ user, onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [user]);

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
            <button className="btn-icon" onClick={onBack} aria-label="Go Back" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
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
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
