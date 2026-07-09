import { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import './NewsletterSignup.css';

export default function NewsletterSignup({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // In production, connect to a Mailchimp/Resend/ConvertKit API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="newsletter-box newsletter-success">
        <CheckCircle size={28} color="var(--color-success)" />
        <div>
          <strong>You're subscribed!</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            We'll send you career insights, new roadmaps, and AI tool updates weekly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`newsletter-box ${variant === 'inline' ? 'newsletter-inline' : ''}`}>
      <div className="newsletter-text">
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          <Mail size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Get Weekly Career Insights
        </h3>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          AI resume tips, interview prep, salary data — no spam, unsubscribe anytime.
        </p>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="newsletter-input-row">
          <input
            id="newsletter-email"
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address for newsletter"
            aria-describedby={error ? 'newsletter-error' : undefined}
            autoComplete="email"
            style={{ height: '44px', fontSize: '15px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ height: '44px', whiteSpace: 'nowrap' }}>
            Subscribe <ArrowRight size={14} />
          </button>
        </div>
        {error && <p className="form-error" id="newsletter-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}
