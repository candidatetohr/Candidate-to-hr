import { Link, useLocation } from 'react-router-dom';
import './QuickLinks.css';

export default function QuickLinks({ links }) {
  const location = useLocation();
  if (!links) return null;

  const getLocalPath = (url) => {
    if (!url) return '';
    return url.replace('https://candidatetohr.online', '');
  };

  const linkItems = [
    { key: 'resumeExample', label: 'Resume Example', icon: '📄', url: links.resumeExample },
    { key: 'interviewQuestions', label: 'Interview Q&As', icon: '🎤', url: links.interviewQuestions },
    { key: 'careerGuide', label: 'Career Guide', icon: '📖', url: links.careerGuide },
    { key: 'salaryGuide', label: 'Salary Guide', icon: '💰', url: links.salaryGuide },
    { key: 'roadmap', label: 'Roadmap', icon: '🗺️', url: links.roadmap }
  ];

  return (
    <div className="quick-links-container">
      <span className="quick-links-label">Quick Access:</span>
      <div className="quick-links-list">
        {linkItems.map((item) => {
          const path = getLocalPath(item.url);
          if (!path) return null;
          const isActive = location.pathname === path;

          return (
            <Link
              key={item.key}
              to={path}
              className={`quick-link-item ${isActive ? 'active' : ''}`}
            >
              <span className="quick-link-icon">{item.icon}</span>
              <span className="quick-link-text">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
