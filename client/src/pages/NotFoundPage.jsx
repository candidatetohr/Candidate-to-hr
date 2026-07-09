import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/SEO';
import AnalyticsService from '../services/AnalyticsService';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    AnalyticsService.event('404_page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="not-found-page">
      <SEO
        title="Page Not Found | CandidateToHR"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
      />
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          <Link to="/" className="btn btn-primary not-found-btn">
            <Home size={18} />
            Return to Home
          </Link>
          <Link to="/roadmaps" className="btn btn-outline not-found-btn">
            Career Roadmaps
          </Link>
          <Link to="/interview-questions" className="btn btn-outline not-found-btn">
            Interview Prep
          </Link>
          <Link to="/career-guides" className="btn btn-outline not-found-btn">
            Career Guides
          </Link>
        </div>
      </div>
    </div>
  );
}

