import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="bg-overlay"></div>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <div className="content-wrapper">
        <Login theme={theme} />
      </div>
    </div>
  )
}

export default App
