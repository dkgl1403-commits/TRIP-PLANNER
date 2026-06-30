import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateTrip from './components/CreateTrip'
import TripDetails from './components/TripDetails'

function App() {
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('login'); // 'login', 'dashboard', 'create_trip', 'view_trip'
  const [user, setUser] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const isLoggedIn = currentView !== 'login';

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const handleViewTrip = (tripId) => {
    setSelectedTripId(tripId);
    setCurrentView('view_trip');
  };

  return (
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
            onViewTrip={handleViewTrip}
          />
        )}
        {currentView === 'create_trip' && (
          <CreateTrip user={user} onBack={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'view_trip' && (
          <TripDetails tripId={selectedTripId} onBack={() => setCurrentView('dashboard')} user={user} />
        )}
        {currentView === 'login' && (
          <Login theme={theme} onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  )
}

export default App
