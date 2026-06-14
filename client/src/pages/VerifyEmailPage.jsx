import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { CheckCircle2, XCircle } from 'lucide-react';
import './AuthPage.css';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        setTimeout(() => navigate('/login'), 4000);
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '40px 20px' }}
      >
        {status === 'verifying' && (
          <div>
            <div className="spinner spinner-lg" style={{ marginBottom: '20px' }} />
            <h2>Verifying Email...</h2>
            <p className="text-muted">Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={64} />
            </div>
            <h2>Email Verified!</h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>Your account has been successfully verified.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
            <p className="text-muted" style={{ marginTop: '16px', fontSize: '0.85rem' }}>
              Redirecting automatically in a few seconds...
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div style={{ color: '#ef4444', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <XCircle size={64} />
            </div>
            <h2>Verification Failed</h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>The verification link is invalid or has expired.</p>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
