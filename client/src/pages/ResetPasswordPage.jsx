import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './AuthPage.css';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      passwordRef.current?.focus();
      return;
    }
    if (!confirmPassword) {
      confirmPasswordRef.current?.focus();
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      confirmPasswordRef.current?.focus();
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password });
      setSuccess(true);
      toast.success('Password reset successful');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SEO title="Reset Password" noindex />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              Your password has been reset successfully. Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
             <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  ref={passwordRef}
                  id="new-password"
                  type="password"
                  className="form-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  ref={confirmPasswordRef}
                  id="confirm-password"
                  type="password"
                  className="form-input pl-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading || !password || !confirmPassword}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Reset Password'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
