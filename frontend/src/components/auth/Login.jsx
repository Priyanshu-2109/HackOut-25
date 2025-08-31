import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Signup from './Signup';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/auth/google`;

function GoogleButton({ label = 'Continue with Google' }) {
  const openGooglePopup = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const popup = window.open(
      GOOGLE_AUTH_URL,
      'google_oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Poll for popup close; on success backend will set cookies and if it responds with JSON it will close itself
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        // After close, reload profile if token present
        window.location.reload();
      }
    }, 600);
  };

  return (
    <button
      type="button"
      onClick={openGooglePopup}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 text-gray-700 bg-white py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
      {label}
    </button>
  );
}

// startWithSignup allows parent modal to open directly in signup mode
const Login = ({ onClose, isModal = false, startWithSignup = false }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(startWithSignup);

  useEffect(() => {
    setShowSignup(startWithSignup);
  }, [startWithSignup]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login form submitted');
    setLoading(true);
    try {
      const result = await login(form);
      if (result.success) {
        showSuccess(result.message || 'Login successful');
        onClose?.();
        navigate('/dashboard');
      } else {
        showError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      showError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) {
    return (
      <div className={isModal ? 'bg-white p-6 sm:p-7 rounded-2xl shadow-2xl w-full max-w-md' : 'max-w-md mx-auto p-4'}>
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <Signup onSuccess={() => setShowSignup(false)} />
        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
        <GoogleButton label="Sign up with Google" />
        <p className="text-sm mt-4 text-center">Already have an account?{' '}
          <button className="text-green-600" onClick={() => setShowSignup(false)}>Sign in</button>
        </p>
      </div>
    );
  }

  return (
    <div className={isModal ? 'bg-white p-6 sm:p-7 rounded-2xl shadow-2xl w-full max-w-md' : 'max-w-md mx-auto p-4'}>
      <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
      <p className="text-sm text-gray-600 mb-4">Sign in to continue</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="identifier"
          value={form.identifier}
          onChange={onChange}
          placeholder="Email or Username"
          className="w-full px-3 py-2.5 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          className="w-full px-3 py-2.5 border mb-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl shadow-sm transition">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-500">OR</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
      <GoogleButton />
      <p className="text-sm mt-4 text-center">Don't have an account?{' '}
        <button className="text-green-600" onClick={() => setShowSignup(true)}>Create one</button>
      </p>
    </div>
  );
};

export default Login;
