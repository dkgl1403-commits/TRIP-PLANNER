import { useState, useEffect } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';


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
  const [showEnrollmentPrompt, setShowEnrollmentPrompt] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

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
        const userData = { 
          name: data.name || loginId,
          login_id: data.login_id || loginId,
          phone: data.phone,
          role: data.role
        };

        if (isLogin) {
          // Check if biometrics are enabled for this user
          if (isBiometricAvailable) {
            try {
              const statusRes = await fetch(`/api/auth/biometric-status?login_id=${userData.login_id}`);
              const statusData = await statusRes.json();
              if (!statusData.enabled) {
                setPendingUserData(userData);
                setShowEnrollmentPrompt(true);
                return;
              }
            } catch (err) {
              console.error("Failed to check biometric status", err);
            }
          }
          onLoginSuccess(userData); 
        } else if (!isLogin) {
            setName('');
            setGender('');
            setPhone('');
            setAddress('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
      } else {
        setMessage({ text: data.detail || 'An error occurred', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to connect to the server.', type: 'error' });
    }
  };

  const handleBiometricEnrollment = async (accept) => {
    if (!accept) {
      onLoginSuccess(pendingUserData);
      return;
    }

    try {
      setMessage({ text: 'Setting up Biometrics...', type: 'success' });
      
      const optsResp = await fetch(`/api/auth/register-biometric/options?login_id=${pendingUserData.login_id}`);
      const options = await optsResp.json();
      
      if (optsResp.status !== 200) {
        throw new Error(options.detail || 'Failed to get registration options');
      }

      const attResp = await startRegistration({ optionsJSON: options });
      
      const verificationResp = await fetch('/api/auth/register-biometric/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: pendingUserData.login_id,
          credential: attResp,
        }),
      });

      const verificationJSON = await verificationResp.json();
      if (verificationJSON.status === 'success') {
        setMessage({ text: 'Biometric setup complete!', type: 'success' });
        setTimeout(() => onLoginSuccess(pendingUserData), 1000);
      } else {
        throw new Error(verificationJSON.detail || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Biometric enrollment failed', type: 'error' });
      setTimeout(() => onLoginSuccess(pendingUserData), 2000);
    }
  };

  const handleBiometric = async () => {
    try {
      if (loginId) {
        const statusRes = await fetch(`/api/auth/biometric-status?login_id=${loginId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (!statusData.enabled) {
            setMessage({ text: 'Biometric login is not enabled for this user.', type: 'error' });
            return;
          }
        }
      }

      setMessage({ text: 'Prompting for Biometrics...', type: 'success' });
      
      const optsResp = await fetch('/api/auth/login-biometric/options');
      const options = await optsResp.json();
      
      if (optsResp.status !== 200) {
        throw new Error(options.detail || 'Failed to get auth options');
      }

      const asseResp = await startAuthentication({ optionsJSON: options });

      const verificationResp = await fetch('/api/auth/login-biometric/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_session_id: options.auth_session_id,
          credential: asseResp,
        }),
      });

      const verificationJSON = await verificationResp.json();
      
      if (verificationJSON.status === 'success') {
        setMessage({ text: 'Biometric Login Successful!', type: 'success' });
        if (onLoginSuccess) {
          onLoginSuccess({ 
            name: verificationJSON.name,
            login_id: verificationJSON.login_id,
            phone: verificationJSON.phone,
            role: verificationJSON.role
          });
        }
      } else {
        throw new Error(verificationJSON.detail || 'Verification failed');
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Biometric authentication failed or cancelled.', type: 'error' });
    }
  };

  if (showEnrollmentPrompt) {
    return (
      <main className="relative z-10 w-full max-w-md mx-auto p-8 sm:p-12 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <h2 className="font-display-lg text-[28px] leading-[36px] font-bold text-neon-coral tracking-tighter uppercase mb-2">Biometrics</h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant tracking-[0.2em] uppercase">Enable Face/Touch ID</p>
        </div>
        <p className="text-center mb-6 text-on-surface-variant font-body-md text-body-md">
          Would you like to use your fingerprint or face to log in securely on this device next time?
        </p>
        <div className="flex w-full gap-4">
          <button onClick={() => handleBiometricEnrollment(false)} className="flex-1 py-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-variant transition-colors font-title-md font-semibold">
            Skip
          </button>
          <button onClick={() => handleBiometricEnrollment(true)} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-neon-coral to-[#E05236] text-surface font-title-md font-bold hover:shadow-[0_4px_20px_rgba(255,107,74,0.3)] transition-all active:scale-[0.98]">
            Enable
          </button>
        </div>
        {message.text && (
          <div className={`mt-4 text-center font-label-sm p-3 rounded ${message.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {message.text}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="relative z-10 w-full max-w-md mx-auto p-8 sm:p-12 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col items-center">
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center mb-10 w-full">
        <div className="w-32 h-32 rounded-full border-4 border-white flex flex-col items-center justify-center mb-4 text-white bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] relative">
          <svg viewBox="0 0 100 100" width="100%" height="100%" className="absolute inset-0 pointer-events-none">
            {/* Top Arc for DKGL */}
            <path id="curveTop" fill="transparent" d="M 20,50 A 30,30 0 0,1 80,50" />
            {/* Bottom Arc for EST 2026 */}
            <path id="curveBottom" fill="transparent" d="M 15,50 A 35,35 0 0,0 85,50" />
            
            <text fontSize="22" fill="white" letterSpacing="6" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 'bold' }}>
              <textPath href="#curveTop" startOffset="50%" textAnchor="middle">
                <tspan dy="6">DKGL</tspan>
              </textPath>
            </text>

            <text fontSize="11" fill="white" letterSpacing="2" style={{ fontFamily: '"Courier New", Courier, monospace', opacity: 0.9 }}>
              <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">
                <tspan dy="-2">EST. 2026</tspan>
              </textPath>
            </text>
          </svg>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant tracking-[0.2em] uppercase">Organizer</p>
      </div>

      {/* Auth Tabs */}
      <div className="flex w-full mb-8 border-b border-glass-stroke">
        <button 
          className={`flex-1 pb-3 font-title-md text-title-md transition-colors ${isLogin ? 'text-neon-coral border-b-2 border-neon-coral' : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'}`}
          onClick={() => { setIsLogin(true); setMessage({text:'', type:''}); }}
        >
          Sign In
        </button>
        <button 
          className={`flex-1 pb-3 font-title-md text-title-md transition-colors ${!isLogin ? 'text-neon-coral border-b-2 border-neon-coral' : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'}`}
          onClick={() => { setIsLogin(false); setMessage({text:'', type:''}); }}
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {!isLogin && (
          <div className="space-y-6">
            <div className="relative group">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
            </div>
            
            <div className="flex gap-4">
              <div className="relative group flex-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT transition-colors group-hover:bg-surface-container-low/80 appearance-none">
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="relative group flex-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Phone</label>
                <input type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
              </div>
            </div>

            <div className="relative group">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Address</label>
              <input type="text" placeholder="123 Cloud Way" value={address} onChange={(e) => setAddress(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
            </div>

            <div className="relative group">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Email Address</label>
              <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
            </div>

            <div className="flex gap-4">
              <div className="relative group flex-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
              </div>
              <div className="relative group flex-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Re-key Password</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
              </div>
            </div>
          </div>
        )}

        {isLogin && (
          <div className="space-y-6">
            <div className="relative group">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="login-id">Login ID or Phone Number</label>
              <input id="login-id" type="text" placeholder="e.g. DG67585 or +1234567890" value={loginId} onChange={(e) => setLoginId(e.target.value)} required={isLogin} className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80" />
            </div>
            
            <div className="relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                <a className="font-label-sm text-label-sm text-electric-blue hover:text-secondary transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-surface-container-low border-0 border-b border-glass-stroke focus:ring-0 focus:border-neon-coral text-on-surface font-body-md text-body-md px-4 py-3 rounded-t-DEFAULT placeholder:text-surface-variant transition-colors group-hover:bg-surface-container-low/80 pr-12" />
                <button type="button" className="absolute inset-y-0 right-0 px-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button type="submit" className="w-full mt-8 py-4 rounded-lg bg-gradient-to-r from-neon-coral to-[#E05236] text-surface font-title-md text-title-md font-bold hover:shadow-[0_4px_20px_rgba(255,107,74,0.3)] transform transition-all duration-300 active:scale-[0.98]">
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {message.text && (
        <div className={`mt-6 w-full text-center font-label-sm p-3 rounded ${message.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
          {message.text}
        </div>
      )}

      {isBiometricAvailable && isLogin && (
        <>
          <div className="flex items-center w-full my-6">
            <hr className="flex-1 border-glass-stroke" />
            <span className="px-4 font-label-sm text-on-surface-variant uppercase tracking-widest">OR</span>
            <hr className="flex-1 border-glass-stroke" />
          </div>
          <button type="button" onClick={handleBiometric} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors font-title-md border border-glass-stroke">
            <span className="material-symbols-outlined">fingerprint</span>
            Biometric login
          </button>
        </>
      )}
    </main>
  );
}
