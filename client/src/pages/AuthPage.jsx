import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', role: 'candidate' });
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    if (mode === 'register' && !form.name) return;
    if (mode === 'register' && form.role === 'recruiter' && !form.company.trim()) {
      toast.error('Company Name is required for Recruiters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="auth-page">
      {/* Background Orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="CandidateToHR Logo" width="36" height="36" loading="lazy" style={{ height: '36px' }} />
        </div>

        <div className="auth-header">
          <h1>{mode === 'login' ? 'Welcome back' : 'Get started today'}</h1>
          <p>{mode === 'login' ? 'Sign in to your ATS dashboard' : 'Create your free recruiter account'}</p>
        </div>

        {/* Mode Toggle */}
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {/* Supabase Google Auth disabled for now per user request
        <button 
          type="button"
          className="btn btn-outline btn-lg w-100" 
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
          onClick={loginWithGoogle}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} loading="lazy" />
          Continue with Google
        </button>

        <div className="auth-divider" style={{ textAlign: 'center', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
          <span style={{ padding: '0 15px' }}>Or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
        </div>
        */}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="auth-role-selector">
                <p>Are you a Candidate or a Recruiter?</p>
                <div className="role-btns">
                  <button 
                    type="button" 
                    className={`role-btn ${form.role === 'candidate' ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, role: 'candidate', company: '' }))}
                  >
                    <User size={16} /> Candidate
                  </button>
                  <button 
                    type="button" 
                    className={`role-btn ${form.role === 'recruiter' ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, role: 'recruiter' }))}
                  >
                    <Building2 size={16} /> Recruiter
                  </button>
                </div>
              </div>

              <div className="input-wrapper" style={{ marginTop: '1rem' }}>
                <User size={16} className="input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  className="form-input with-icon"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoComplete="name"
                />
              </div>
            </motion.div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                className="form-input with-icon"
                placeholder="Email address"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input with-icon with-icon-right"
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === 'register' && form.role === 'recruiter' && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="input-wrapper">
                <Building2 size={16} className="input-icon" />
                <input
                  id="auth-company"
                  type="text"
                  className="form-input with-icon"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={set('company')}
                  autoComplete="organization"
                  required
                />
              </div>
            </motion.div>
          )}

          <button
            id="auth-submit"
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner" /> Processing...</>
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="auth-switch-btn"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Feature Pills */}
        <div className="auth-features">
          {[' NVIDIA NIM AI', ' Smart Analytics', ' ATS Scoring', ' Auto Emails'].map(f => (
            <span key={f} className="feature-pill">{f}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
