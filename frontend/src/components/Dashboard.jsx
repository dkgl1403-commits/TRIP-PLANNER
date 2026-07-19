import React, { useState, useEffect, useRef } from 'react';

function Dashboard({ user, onLogout, theme, toggleTheme, onCreateTrip, onAiPlanTrip, onViewTrip, onAdminDashboard, onFinanceDashboard, onSystemHealth }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
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
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    if (user?.login_id) {
      fetch(`/api/auth/biometric-status?login_id=${user.login_id}`)
        .then(res => res.json())
        .then(data => setIsBiometricEnabled(data.enabled))
        .catch(err => console.error("Failed to fetch biometric status", err));
    }
  }, [user]);

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

  useEffect(() => {
    if (activeTab === 'locations') {
      const fetchLocations = async () => {
        setLocationsLoading(true);
        try {
          const loginId = user?.login_id || 'guest';
          const res = await fetch(`/api/locations?login_id=${loginId}`);
          const data = await res.json();
          if (res.ok && data.locations) {
            setSavedLocations(data.locations);
          }
        } catch (err) {
          console.error('Failed to fetch locations', err);
        } finally {
          setLocationsLoading(false);
        }
      };
      fetchLocations();
    }
  }, [activeTab, user]);

  const handleDeleteLocation = async (locId) => {
    if (!window.confirm('Delete this saved location?')) return;
    try {
      const res = await fetch(`/api/locations/${locId}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedLocations(prev => prev.filter(l => l.id !== locId));
      }
    } catch (err) {
      console.error('Failed to delete location', err);
    }
  };

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
  const dashboardTripsRaw = trips.filter(t => t.status !== 'Cancelled' && t.status !== 'Completed');
  const myTripsRaw = [...trips].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const activeTripsRaw = activeTab === 'dashboard' ? dashboardTripsRaw : (activeTab === 'mytrips' ? myTripsRaw : []);
  
  const nextTrip = activeTripsRaw.length > 0 ? mapTrip(activeTripsRaw[0]) : null;
  const upcomingTrips = activeTripsRaw.slice(1).map(mapTrip);
  const allMappedTrips = activeTripsRaw.map(mapTrip);

  return (
    <div className="w-full min-h-screen flex flex-col pt-24 px-4 sm:px-8 max-w-container-max mx-auto text-on-surface font-body-md">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between bg-glass-fill backdrop-blur-[24px] border-b border-glass-stroke z-40">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-on-surface-variant hover:text-neon-coral transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <span className="font-display-lg text-3xl font-bold text-neon-coral tracking-tighter uppercase">DKGL</span>
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-coral to-[#E05236] text-surface flex items-center justify-center font-title-md font-bold cursor-pointer shadow-lg hover:shadow-neon-coral/30 transition-all"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          {isProfileOpen && (
            <div className="absolute top-14 right-0 w-64 bg-surface-container-high border border-glass-stroke rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-glass-stroke">
                <div className="font-title-md font-bold text-on-surface">{user?.name || 'User'}</div>
                <div className="font-label-sm text-on-surface-variant mt-1">ID: {user?.login_id || 'guest'}</div>
              </div>
              
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span> Profile
                </button>
                {user?.role === 'ADMIN' && (
                  <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors" onClick={onAdminDashboard}>
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span> Admin Dashboard
                  </button>
                )}
              </div>
              
              <div className="border-t border-glass-stroke py-2">
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-error hover:bg-error/10 transition-colors" onClick={onLogout}>
                  <span className="material-symbols-outlined text-[20px]">logout</span> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Retractable Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        aria-hidden="true"
      >
        <div 
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 w-72 bg-surface-container-highest border-r border-glass-stroke shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
        >
          <div className="p-6 border-b border-glass-stroke flex items-center justify-between">
            <span className="font-display-lg text-2xl font-bold text-neon-coral tracking-tighter uppercase">DKGL</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-on-surface-variant hover:text-neon-coral">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
            <div className="mb-4 px-2">
              <div className="font-title-md font-bold text-on-surface">{user?.name || 'User'}</div>
              <div className="font-label-sm text-on-surface-variant mt-1">ID: {user?.login_id || 'guest'}</div>
            </div>

            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-md transition-colors ${activeTab === 'dashboard' ? 'bg-neon-coral/10 text-neon-coral' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`} 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span> Dashboard
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-md transition-colors ${activeTab === 'mytrips' ? 'bg-neon-coral/10 text-neon-coral' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`} 
              onClick={() => { setActiveTab('mytrips'); setIsSidebarOpen(false); }}
            >
              <span className="material-symbols-outlined text-[22px]">flight</span> My Trips
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-md transition-colors ${activeTab === 'locations' ? 'bg-neon-coral/10 text-neon-coral' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`} 
              onClick={() => { setActiveTab('locations'); setIsSidebarOpen(false); }}
            >
              <span className="material-symbols-outlined text-[22px]">location_on</span> Saved Locations
            </button>

            <div className="h-px bg-glass-stroke my-2"></div>
            
            {user?.role === 'ADMIN' && (
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" onClick={() => { onSystemHealth(); setIsSidebarOpen(false); }}>
                <span className="material-symbols-outlined text-[22px]">health_and_safety</span> System Health
              </button>
            )}
            {(user?.role === 'ADMIN' || user?.role === 'FINANCE_USER') && (
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" onClick={() => { onFinanceDashboard(); setIsSidebarOpen(false); }}>
                <span className="material-symbols-outlined text-[22px]">monitoring</span> Finance Dashboard
              </button>
            )}
            {isBiometricEnabled && (
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" onClick={async () => {
                if (window.confirm("Are you sure you want to disable Biometric Login?")) {
                  try {
                    await fetch(`/api/auth/disable-biometric?login_id=${user?.login_id}`, { method: 'DELETE' });
                    setIsBiometricEnabled(false);
                    alert("Biometric login disabled successfully.");
                  } catch (e) {
                    alert("Failed to disable biometric login.");
                  }
                }
              }}>
                <span className="material-symbols-outlined text-[22px]">fingerprint</span> Disable Biometrics
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-12">
        {/* Hero Section */}
        {activeTab === 'dashboard' && (
          <div className="w-full p-8 rounded-2xl bg-glass-fill backdrop-blur-md border border-glass-stroke shadow-xl text-center flex flex-col items-center justify-center">
            <h2 className="font-display-lg text-4xl sm:text-5xl font-bold mb-4">Welcome back, <span className="text-neon-coral">{user?.name?.split(' ')[0] || 'Explorer'}</span>!</h2>
            <p className="font-body-lg text-on-surface-variant mb-8 text-lg">Ready for your next adventure?</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                className="px-8 py-4 rounded-xl bg-surface-container-high text-on-surface font-title-md font-bold hover:bg-surface-variant border border-glass-stroke shadow-lg transition-all flex items-center justify-center gap-2"
                onClick={onCreateTrip}
              >
                <span className="material-symbols-outlined">edit_square</span> Plan manually
              </button>
              <button 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-coral to-[#E05236] text-surface font-title-md font-bold hover:shadow-[0_4px_20px_rgba(255,107,74,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
                onClick={onAiPlanTrip}
              >
                <span className="material-symbols-outlined">auto_awesome</span> Let AI plan your trip
              </button>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            <h3 className="font-headline-lg text-3xl font-bold border-b border-glass-stroke pb-2">Your Next Adventure</h3>
            
            {loading ? (
              <p className="text-on-surface-variant p-4">Loading trips...</p>
            ) : nextTrip ? (
              <div 
                className="group relative w-full h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-glass-stroke transition-transform hover:scale-[1.01]"
                onClick={() => onViewTrip(nextTrip.id)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${nextTrip.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-display-lg text-3xl font-bold text-white m-0 leading-none">{nextTrip.title}</h4>
                    {nextTrip.status && nextTrip.status !== 'Planned' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${nextTrip.status === 'In Progress' ? 'bg-green-500/20 text-green-400' : (nextTrip.status === 'Cancelled' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400')}`}>
                        {nextTrip.status}
                      </span>
                    )}
                  </div>
                  <p className="font-title-md text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-neon-coral">location_on</span>
                    {nextTrip.source_name} ➔ {nextTrip.location}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 font-label-sm uppercase tracking-wider text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {nextTrip.date}</span>
                    {nextTrip.actual_start_time && (
                      <span className="flex items-center gap-1 text-green-400"><span className="material-symbols-outlined text-[16px]">rocket_launch</span> {new Date(nextTrip.actual_start_time).toLocaleString()}</span>
                    )}
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> {nextTrip.participant_count || 1}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-glass-fill border border-glass-stroke text-center text-on-surface-variant">
                <p>No upcoming trips found.</p>
              </div>
            )}

            {upcomingTrips.length > 0 && (
              <div className="mt-8 flex flex-col gap-6">
                <h3 className="font-headline-lg text-2xl font-bold border-b border-glass-stroke pb-2">Upcoming Trips</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map(trip => (
                    <div key={trip.id} className="group rounded-xl overflow-hidden cursor-pointer bg-surface-container border border-glass-stroke hover:border-neon-coral/50 transition-colors flex flex-col shadow-lg" onClick={() => onViewTrip(trip.id)}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url(${trip.image})`}} />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <h4 className="font-title-md font-bold text-white leading-tight">{trip.title}</h4>
                          {trip.status && trip.status !== 'Planned' && (
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${trip.status === 'In Progress' ? 'bg-green-500/20 text-green-400' : (trip.status === 'Cancelled' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400')}`}>
                              {trip.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col gap-3 flex-1 bg-glass-fill backdrop-blur-md">
                        <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-neon-coral">route</span> {trip.source_name} ➔ {trip.location}</p>
                        <div className="flex flex-col gap-1 font-label-sm text-on-surface-variant opacity-80 mt-auto pt-4 border-t border-glass-stroke">
                          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">calendar_month</span> {trip.date}</span>
                          <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">group</span> {trip.participant_count || 1} people</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Trips (Table View) */}
        {activeTab === 'mytrips' && (
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col">
            <h3 className="font-headline-lg text-3xl font-bold border-b border-glass-stroke pb-4 mb-6">All My Trips</h3>
            
            {loading ? (
              <p className="text-on-surface-variant">Loading trips...</p>
            ) : allMappedTrips.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-glass-stroke">
                      <th className="py-4 px-4 font-label-sm uppercase tracking-widest text-on-surface-variant">Title</th>
                      <th className="py-4 px-4 font-label-sm uppercase tracking-widest text-on-surface-variant">Route</th>
                      <th className="py-4 px-4 font-label-sm uppercase tracking-widest text-on-surface-variant">Dates</th>
                      <th className="py-4 px-4 font-label-sm uppercase tracking-widest text-on-surface-variant">Status</th>
                      <th className="py-4 px-4 font-label-sm uppercase tracking-widest text-on-surface-variant">Participants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMappedTrips.map(trip => (
                      <tr key={trip.id} onClick={() => onViewTrip(trip.id)} className="border-b border-glass-stroke/50 hover:bg-surface-variant/50 cursor-pointer transition-colors group">
                        <td className="py-4 px-4 font-title-md font-bold group-hover:text-neon-coral transition-colors">{trip.title}</td>
                        <td className="py-4 px-4 font-body-md text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">route</span> {trip.source_name} ➔ {trip.location}</td>
                        <td className="py-4 px-4 font-label-sm text-on-surface-variant">{trip.date}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${trip.status === 'In Progress' ? 'bg-green-500/20 text-green-400' : (trip.status === 'Cancelled' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400')}`}>
                            {trip.status || 'Planned'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-body-md text-on-surface-variant">{trip.participant_count || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-on-surface-variant">You have no trips.</p>
            )}
          </div>
        )}

        {/* Saved Locations View */}
        {activeTab === 'locations' && (
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col">
            <h3 className="font-headline-lg text-3xl font-bold border-b border-glass-stroke pb-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[32px] text-neon-coral">location_on</span> My Saved Locations
            </h3>
            
            {locationsLoading ? (
              <p className="text-on-surface-variant">Loading locations...</p>
            ) : savedLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedLocations.map(loc => (
                  <div key={loc.id} className="p-6 rounded-xl bg-surface-container border border-glass-stroke shadow-lg relative flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-title-md font-bold flex-1 pr-4">{loc.name}</h4>
                      <button 
                        onClick={() => handleDeleteLocation(loc.id)} 
                        className="text-error hover:text-red-400 transition-colors p-1 rounded-full hover:bg-error/10"
                        title="Delete Location"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                    {loc.description && <p className="font-body-md text-on-surface-variant mb-4 flex-1">{loc.description}</p>}
                    <div className="mt-auto pt-4 border-t border-glass-stroke flex flex-col gap-1 font-label-sm text-on-surface-variant opacity-70">
                      <span>{(loc.city || loc.state) ? `${loc.city || ''}${loc.city && loc.state ? ', ' : ''}${loc.state || ''}` : 'Location details unknown'}</span>
                      <span className="font-mono text-xs">{Number(loc.lat).toFixed(4)}, {Number(loc.lon).toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-glass-stroke bg-surface-container-low/50">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">location_off</span>
                <p className="font-title-md font-bold mb-2">No saved locations yet</p>
                <p className="font-body-md text-on-surface-variant">Open a trip and use the "Mark Location" tab to save your favorite spots!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

