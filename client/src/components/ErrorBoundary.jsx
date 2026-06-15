import React from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import * as Sentry from '@sentry/react';

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Send to Sentry if available
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '500px',
            border: '1px solid var(--border-default)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ color: '#ef4444', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <AlertTriangle size={64} />
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              We're sorry, but the application encountered an unexpected error. Our team has been notified.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
            >
              <RefreshCcw size={16} />
              Reload Application
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-hover)', borderRadius: '8px', textAlign: 'left', overflowX: 'auto', fontSize: '0.8rem', color: '#ef4444' }}>
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary(props) {
  const location = useLocation();
  return <ErrorBoundaryInner location={location} {...props} />;
}
