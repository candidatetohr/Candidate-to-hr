import { Link } from 'react-router-dom';
import { Calendar, UserCheck, ShieldCheck, FileCheck } from 'lucide-react';
import './AuthorInfo.css';

export default function AuthorInfo({ date, author }) {
  const displayAuthor = author || 'CandidateToHR Career Experts';
  const displayDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="author-eeat-card">
      <div className="author-avatar-section">
        <div className="author-avatar-circle" aria-hidden="true">
          {displayAuthor.charAt(0)}
        </div>
        <div className="author-details">
          <div className="author-name-title">
            <span className="author-by">By</span> <strong>{displayAuthor}</strong>
          </div>
          <div className="author-review-status">
            <UserCheck size={14} className="icon-success" aria-hidden="true" />
            <span>Reviewed by <strong>CandidateToHR Career Team</strong></span>
          </div>
        </div>
      </div>
      <div className="author-badges-grid">
        <div className="author-badge-item">
          <Calendar size={14} aria-hidden="true" />
          <span>Last Updated: <strong>{displayDate}</strong></span>
        </div>
        <div className="author-badge-item">
          <ShieldCheck size={14} className="icon-success" aria-hidden="true" />
          <span>Fact Checked</span>
        </div>
        <div className="author-badge-item">
          <FileCheck size={14} className="icon-success" aria-hidden="true" />
          <span>Sources Verified</span>
        </div>
      </div>
      <div className="author-policies-links">
        <Link to="/about" className="policy-link">About Us</Link>
        <span className="divider" aria-hidden="true">•</span>
        <Link to="/terms" className="policy-link">Editorial Policy</Link>
        <span className="divider" aria-hidden="true">•</span>
        <Link to="/contact" className="policy-link">Contact Career Team</Link>
      </div>
    </div>
  );
}
