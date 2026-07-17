import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateTrip from './components/CreateTrip'
import TripDetails from './components/TripDetails'
import AiCreateTrip from './components/AiCreateTrip'
import AdminDashboard from './components/AdminDashboard'
import FinanceDashboard from './components/FinanceDashboard'
import SystemHealthDashboard from './components/SystemHealthDashboard'
import { ToastProvider } from './components/Toast'

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tripPlannerUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentViewRaw] = useState(() => {
    const savedView = sessionStorage.getItem('tripPlannerCurrentView');
    return savedView ? savedView : (localStorage.getItem('tripPlannerUser') ? 'dashboard' : 'login');
  });
  const [selectedTripId, setSelectedTripId] = useState(() => {
    return sessionStorage.getItem('tripPlannerCurrentTrip') || null;
  });

  // Wrap setCurrentView to push browser history and save to session
  const setCurrentView = useCallback((view, pushHistory = true) => {
    setCurrentViewRaw(view);
    sessionStorage.setItem('tripPlannerCurrentView', view);
    if (pushHistory && view !== 'login') {
      window.history.pushState({ view }, '', '');
    }
  }, []);

  const isLoggedIn = currentView !== 'login';

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.view) {
        if (e.state.view === 'login' && localStorage.getItem('tripPlannerUser')) {
          setCurrentViewRaw('dashboard');
          window.history.replaceState({ view: 'dashboard' }, '', '');
        } else {
          setCurrentViewRaw(e.state.view);
          if (e.state.tripId) {
            setSelectedTripId(e.state.tripId);
          }
        }
      } else {
        // No state means we're at the beginning — go to saved view or dashboard if logged in
        if (localStorage.getItem('tripPlannerUser')) {
          const savedView = sessionStorage.getItem('tripPlannerCurrentView') || 'dashboard';
          setCurrentViewRaw(savedView);
          window.history.replaceState({ view: savedView }, '', '');
        } else {
          setCurrentViewRaw('login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial history state
    window.history.replaceState({ view: currentView }, '', '');
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('tripPlannerUser', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('tripPlannerUser');
    setUser(null);
    setCurrentViewRaw('login');
    // Clear history so back button doesn't go to logged-in pages
    window.history.replaceState({ view: 'login' }, '', '');
  };

  const handleViewTrip = (tripId) => {
    setSelectedTripId(tripId);
    setCurrentViewRaw('view_trip');
    window.history.pushState({ view: 'view_trip', tripId }, '', '');
  };

  return (
    <ToastProvider>
    <div className={`app-container ${theme} ${isLoggedIn ? 'dashboard-active' : ''}`}>
      <div className="bg-overlay"></div>
      
      {!isLoggedIn && (
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      )}

      <div className={`content-wrapper ${isLoggedIn ? 'dashboard-mode' : 'login-mode'}`}>
        {currentView === 'dashboard' && (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onCreateTrip={() => setCurrentView('create_trip')}
            onAiPlanTrip={() => setCurrentView('ai_create_trip')}
            onViewTrip={handleViewTrip}
            onAdminDashboard={() => setCurrentView('admin_dashboard')}
            onSystemHealth={() => setCurrentView('systemHealth')}
            onFinanceDashboard={() => setCurrentView('finance_dashboard')}
          />
        )}
        {currentView === 'admin_dashboard' && (
          <AdminDashboard user={user} onBack={() => window.history.back()} />
        )}
        {currentView === 'systemHealth' && (
          <SystemHealthDashboard onBack={() => window.history.back()} />
        )}
        {currentView === 'finance_dashboard' && (
          <FinanceDashboard onBack={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'create_trip' && (
          <CreateTrip user={user} onBack={() => window.history.back()} />
        )}
        {currentView === 'ai_create_trip' && (
          <AiCreateTrip user={user} onBack={() => window.history.back()} onViewTrip={handleViewTrip} />
        )}
        {currentView === 'view_trip' && (
          <TripDetails tripId={selectedTripId} onBack={() => window.history.back()} user={user} />
        )}
        {currentView === 'login' && (
          <Login theme={theme} onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
    </ToastProvider>
  )
}

export default App
