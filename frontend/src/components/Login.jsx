import { useState, useEffect } from 'react';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsBiometricAvailable(available));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!isLogin && password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    const payload = isLogin 
      ? { login_id: loginId, password }
      : { email, password, confirm_password: confirmPassword, name, gender, phone, address };
      
    try {
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        if (isLogin && onLoginSuccess) {
            onLoginSuccess({ 
              name: data.name || loginId,
              login_id: data.login_id || loginId 
            }); 
        } else if (!isLogin) {
            // Optional: reset form after successful signup
            setName('');
            setGender('');
            setPhone('');
            setAddress('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // We intentionally do NOT switch back to login tab here so they can see the message with their ID, 
            // but the form itself is now cleared.
        }
      } else {
        setMessage({ text: data.detail || 'An error occurred', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to connect to the server.', type: 'error' });
    }
  };

  const handleBiometric = async () => {
    try {
      setMessage({ text: 'Prompting for Biometrics...', type: 'success' });
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        rpId: window.location.hostname,
        userVerification: "required",
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (credential) {
        setMessage({ text: 'Biometric Login Successful!', type: 'success' });
        if (onLoginSuccess) {
          onLoginSuccess({ name: 'Biometric User' });
        }
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Biometric authentication failed or cancelled.', type: 'error' });
    }
  };

  return (
    <div className="login-card glass-panel">
      <div className="logo-container compact-logo">
        <h1 className="logo-text">DKGL</h1>
        <div className="logo-sub">Event Planner</div>
      </div>

      <div className="auth-tabs compact-tabs">
        <button 
          className={`tab-btn ${isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(true); setMessage({text:'', type:''}); }}
        >
          Sign In
        </button>
        <button 
          className={`tab-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(false); setMessage({text:'', type:''}); }}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className="input-group compact">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
            
            <div className="form-row compact">
              <div className="input-group half">
                <label>Gender</label>
                <select 
                  className="dropdown-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required={!isLogin}
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group half">
                <label>Phone</label>
                <input 
                  type="tel" 
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>

            <div className="input-group compact">
              <label>Address</label>
              <input 
                type="text" 
                placeholder="123 Cloud Way"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required={!isLogin}
              />
            </div>
            <div className="input-group compact">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
              />
            </div>
            <div className="form-row compact">
              <div className="input-group half">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group half">
                <label>Re-key Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          </>
        )}

        {isLogin && (
          <>
            <div className="input-group compact">
              <label>Login ID or Phone Number</label>
              <input 
                type="text" 
                placeholder="e.g. DG67585 or +1234567890"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required={isLogin}
              />
            </div>
            <div className="input-group compact">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
        
        <button type="submit" className="btn-primary">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {isBiometricAvailable && isLogin && (
        <>
          <div className="divider">OR</div>
          <button type="button" className="btn-biometric" onClick={handleBiometric}>
            <svg className="fingerprint-icon" viewBox="0 0 24 24">
              <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 10.99 3.8 12 3.8c1.01 0 2.02.24 3.16.86 1.5.77 2.76 1.87 3.75 3.27.16.23.11.54-.12.7-.23.16-.54.11-.7-.12-.89-1.26-2.02-2.25-3.37-2.94-1.02-.55-1.92-.77-2.72-.77-.8 0-1.7.22-2.72.77-1.35.69-2.48 1.68-3.37 2.94-.12.18-.32.28-.51.28z" />
              <path d="M12 21c-3.15 0-5.69-1.87-6.28-4.66-.06-.27.11-.53.38-.59.27-.06.53.11.59.38.48 2.29 2.56 3.87 5.31 3.87 2.2 0 4.19-1.03 5.3-2.76.15-.23.46-.3.69-.15.23.15.3.46.15.69-1.3 1.95-3.57 3.22-6.14 3.22z" />
              <path d="M12.01 17.75c-.17 0-.33-.09-.41-.24-.72-1.36-1.12-2.98-1.12-4.51v-.5c0-1.94 1.58-3.53 3.53-3.53 1.94 0 3.53 1.58 3.53 3.53v1c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-1c0-1.39-1.13-2.53-2.53-2.53-1.39 0-2.53 1.13-2.53 2.53v.5c0 1.34.35 2.77.99 3.96.13.24.04.55-.2.68-.08.04-.17.06-.26.06z" />
            </svg>
            Sign in with Fingerprint
          </button>
        </>
      )}
    </div>
  );
}
