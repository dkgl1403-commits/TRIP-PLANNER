import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const toast = useCallback({
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur || 4500),
    warning: (msg, dur) => showToast(msg, 'warning', dur || 4000),
    info: (msg, dur) => showToast(msg, 'info', dur),
  }, [showToast]);

  // Reassign since useCallback doesn't work with objects
  const toastApi = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur || 4500),
    warning: (msg, dur) => showToast(msg, 'warning', dur || 4000),
    info: (msg, dur) => showToast(msg, 'info', dur),
    show: showToast,
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const bgColors = {
    success: 'linear-gradient(135deg, #059669, #10b981)',
    error: 'linear-gradient(135deg, #dc2626, #ef4444)',
    warning: 'linear-gradient(135deg, #d97706, #f59e0b)',
    info: 'linear-gradient(135deg, #2563eb, #3b82f6)',
  };

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '400px',
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: bgColors[t.type],
              color: 'white',
              padding: '14px 20px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontSize: '0.95rem',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          >
            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
