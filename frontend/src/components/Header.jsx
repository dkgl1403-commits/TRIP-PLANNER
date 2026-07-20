import React, { useState, useEffect, useRef } from 'react';

function Header({ user, onLogout, onAdminDashboard, onSystemHealth, onFinanceDashboard, onNavigateTab, activeTab }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
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

  useEffect(() => {
    if (user?.login_id) {
      fetch(`/api/auth/biometric-status?login_id=${user.login_id}`)
        .then(res => res.json())
        .then(data => setIsBiometricEnabled(data.enabled))
        .catch(err => console.error("Failed to fetch biometric status", err));
    }
  }, [user]);

  const handleNav = (tab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 px-4 sm:px-8 flex items-center justify-between bg-glass-fill backdrop-blur-[24px] border-b border-glass-stroke z-40">
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
                  <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors" onClick={() => { onAdminDashboard(); setIsProfileOpen(false); }}>
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span> Admin Dashboard
                  </button>
                )}
              </div>
              
              <div className="border-t border-glass-stroke py-2">
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-error hover:bg-error/10 transition-colors" onClick={() => { onLogout(); setIsProfileOpen(false); }}>
                  <span className="material-symbols-outlined text-[20px]">logout</span> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

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
              onClick={() => handleNav('dashboard')}
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span> Dashboard
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-md transition-colors ${activeTab === 'mytrips' ? 'bg-neon-coral/10 text-neon-coral' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`} 
              onClick={() => handleNav('mytrips')}
            >
              <span className="material-symbols-outlined text-[22px]">flight</span> My Trips
            </button>
            <button 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-md transition-colors ${activeTab === 'locations' ? 'bg-neon-coral/10 text-neon-coral' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}`} 
              onClick={() => handleNav('locations')}
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
    </>
  );
}

export default Header;
