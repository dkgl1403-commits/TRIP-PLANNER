import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

function Dashboard({ user, onLogout, theme, toggleTheme, onCreateTrip, onAiPlanTrip, onViewTrip }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const loginId = user?.login_id || 'guest';
        const res = await fetch(`/api/trips?login_id=${loginId}`);
        const data = await res.json();
        if (res.ok) {
          setTrips(data.trips);
        }
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user]);

  const mapTrip = t => ({
    id: t.id,
    title: t.title,
    date: `${t.start_date} - ${t.end_date}`,
    image: t.cover_image_url || "https://images.unsplash.com/photo-1598155523122-3842334d6c1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    location: t.dest_name,
    source_name: t.source_name,
    status: t.status,
    actual_start_time: t.actual_start_time,
    participant_count: t.participant_count
  });

  const currentLoginId = user?.login_id || 'guest';
  
  // Dashboard: All trips that are not cancelled or completed
  const dashboardTripsRaw = trips.filter(t => t.status !== 'Cancelled' && t.status !== 'Completed');
  
  // My Trips: All trips (or we could filter just to completed/cancelled, but user said "all the trip date wise")
  const myTripsRaw = [...trips].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  const activeTripsRaw = activeTab === 'dashboard' ? dashboardTripsRaw : (activeTab === 'mytrips' ? myTripsRaw : []);
  
  const nextTrip = activeTripsRaw.length > 0 ? mapTrip(activeTripsRaw[0]) : null;
  const upcomingTrips = activeTripsRaw.slice(1).map(mapTrip);
  const allMappedTrips = activeTripsRaw.map(mapTrip);

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav glass-panel">
        <div className="nav-logo">
          <span className="logo-text">DKGL</span>
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`nav-tab ${activeTab === 'mytrips' ? 'active' : ''}`} onClick={() => setActiveTab('mytrips')}>My Trips</button>
        </div>
        <div className="nav-profile" ref={profileRef}>
          <div 
            className="avatar" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ cursor: 'pointer' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          {isProfileOpen && (
            <div className="profile-dropdown glass-panel">
              <div className="dropdown-header">
                <strong>{user?.name || 'User'}</strong>
                <span className="dropdown-id">ID: {user?.login_id || 'guest'}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                👤 Profile
              </button>
              <button className="dropdown-item" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
              <button className="dropdown-item text-danger" onClick={onLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Hero Section (Only show on dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="hero-section glass-panel">
            <div className="hero-content">
              <h2>Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}!</h2>
              <p>Ready for your next adventure?</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
                <button className="btn-primary create-trip-btn" onClick={onCreateTrip} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✍️ Plan your trip
                </button>
                <button className="btn-primary create-trip-btn ai-magic-btn" onClick={onAiPlanTrip} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', border: 'none', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}>
                  ✨ Let AI plan your trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            <div className="section-header">
              <h3>Your Next Adventure</h3>
            </div>
            {loading ? (
              <p style={{padding: '20px'}}>Loading trips...</p>
            ) : nextTrip ? (
              <div 
                className="next-trip-card glass-panel" 
                style={{ backgroundImage: `url(${nextTrip.image})`, cursor: 'pointer' }}
                onClick={() => onViewTrip(nextTrip.id)}
              >
                <div className="card-overlay">
                  <div className="card-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ margin: 0 }}>{nextTrip.title}</h4>
                      {nextTrip.status && nextTrip.status !== 'Planned' && (
                        <span style={{
                          background: nextTrip.status === 'In Progress' ? 'green' : (nextTrip.status === 'Cancelled' ? 'gray' : '#3b82f6'), 
                          color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '12px'
                        }}>
                          {nextTrip.status}
                        </span>
                      )}
                    </div>
                    <p className="trip-location">📍 {nextTrip.source_name} ➔ {nextTrip.location}</p>
                    <div className="trip-meta" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                      <span className="trip-date">📅 Planned: {nextTrip.date}</span>
                      {nextTrip.actual_start_time && (
                        <span className="trip-date" style={{ color: '#4ade80' }}>
                          🚀 Started: {new Date(nextTrip.actual_start_time).toLocaleString()}
                        </span>
                      )}
                      <span className="trip-countdown">👥 Participants: {nextTrip.participant_count || 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{padding: '30px', textAlign: 'center'}}>
                <p>No trips found in this category.</p>
              </div>
            )}

            {upcomingTrips.length > 0 && (
              <>
                <div className="section-header">
                  <h3>Upcoming Trips</h3>
                </div>
                <div className="trips-grid">
                  {upcomingTrips.map(trip => (
                    <div key={trip.id} className="trip-grid-card glass-panel" onClick={() => onViewTrip(trip.id)}>
                      <div className="card-image" style={{backgroundImage: `url(${trip.image})`}}>
                        <div className="card-overlay">
                          <h4 style={{margin: 0}}>{trip.title}</h4>
                          {trip.status && trip.status !== 'Planned' && (
                            <span style={{background: trip.status === 'In Progress' ? 'green' : (trip.status === 'Cancelled' ? 'gray' : '#3b82f6'), color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', marginLeft: '5px'}}>
                              {trip.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-content" style={{ padding: '15px' }}>
                        <p className="trip-location" style={{ fontSize: '0.9em', marginBottom: '8px' }}>📍 {trip.source_name} ➔ {trip.location}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85em', color: '#ccc' }}>
                          <span>📅 Planned: {trip.date}</span>
                          {trip.actual_start_time && (
                            <span style={{ color: '#4ade80' }}>🚀 Started: {new Date(trip.actual_start_time).toLocaleString()}</span>
                          )}
                          <span>👥 Participants: {trip.participant_count || 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* My Trips (Table View) */}
        {activeTab === 'mytrips' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '20px', borderRadius: '15px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>All My Trips</h3>
            {loading ? (
              <p>Loading trips...</p>
            ) : allMappedTrips.length > 0 ? (
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Route</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {allMappedTrips.map(trip => (
                    <tr key={trip.id} onClick={() => onViewTrip(trip.id)} className="trip-table-row">
                      <td style={{ fontWeight: 'bold' }}>{trip.title}</td>
                      <td>{trip.source_name} ➔ {trip.location}</td>
                      <td>{trip.date}</td>
                      <td>
                        <span style={{
                          background: trip.status === 'In Progress' ? 'rgba(34, 197, 94, 0.2)' : (trip.status === 'Cancelled' ? 'rgba(156, 163, 175, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
                          color: trip.status === 'In Progress' ? '#4ade80' : (trip.status === 'Cancelled' ? '#9ca3af' : '#60a5fa'),
                          padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          {trip.status || 'Planned'}
                        </span>
                      </td>
                      <td>{trip.participant_count || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>You have no trips.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
