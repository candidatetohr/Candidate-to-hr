import { Link } from 'react-router-dom';
import CareerKnowledgeGraph from '../../services/CareerKnowledgeGraph';
import './CareerGraphSidebar.css';
import { Target, TrendingUp, DollarSign, Award, BookOpen, Layers } from 'lucide-react';

export default function CareerGraphSidebar({ roleId, currentType, currentSlug }) {
  // Look up career node by ID or matching slug
  let career = null;
  if (roleId) {
    career = CareerKnowledgeGraph.getById(roleId);
  } else if (currentType && currentSlug) {
    career = CareerKnowledgeGraph.getBySlug(currentType, currentSlug);
  }

  if (!career) return null;

  const links = CareerKnowledgeGraph.getLinks(career.id);
  const related = CareerKnowledgeGraph.getRelated(career.id);

  // Map types to display labels
  const linkMetadata = [
    { key: 'roadmap', label: 'Learning Roadmap', icon: '🗺️', path: links.roadmap, activeType: 'roadmap' },
    { key: 'resume', label: 'Resume Guide & Examples', icon: '📄', path: links.resume, activeType: 'resume' },
    { key: 'interview', label: 'Interview Preparation', icon: '🎤', path: links.interview, activeType: 'interview' },
    { key: 'salary', label: 'Salary & Compensation', icon: '💰', path: links.salary, activeType: 'salary' },
    { key: 'careerGuide', label: 'Career Deep Dive', icon: '📖', path: links.careerGuide, activeType: 'careerGuide' }
  ];

  return (
    <aside className="career-graph-sidebar" aria-label={`${career.title} Career Knowledge Graph`}>
      {/* Dynamic Snapshot Header */}
      <div className="sidebar-header-card">
        <span className="category-tag">{career.category}</span>
        <h3 className="sidebar-career-title">{career.title}</h3>
        <p className="sidebar-description-helper">Official Career Knowledge Hub</p>
      </div>

      {/* Snapshot Statistics */}
      <div className="sidebar-section stats-grid-sidebar">
        <div className="sidebar-stat-box">
          <DollarSign className="stat-icon-color text-green" size={16} />
          <div>
            <div className="stat-label-sub">Avg Salary</div>
            <div className="stat-value-sub text-green">{career.averageSalary}</div>
          </div>
        </div>
        <div className="sidebar-stat-box">
          <TrendingUp className="stat-icon-color text-purple" size={16} />
          <div>
            <div className="stat-label-sub">Growth Rate</div>
            <div className="stat-value-sub text-purple">{career.growthRate}</div>
          </div>
        </div>
      </div>

      {/* Dynamic Career Hub Cluster Links */}
      <div className="sidebar-section">
        <h4 className="section-title-sub"><Layers size={14} /> Career Cluster Hub</h4>
        <nav className="cluster-nav">
          {linkMetadata.map(link => {
            if (!link.path) return null;
            const isCurrentPage = currentType === link.activeType;
            return (
              <Link 
                key={link.key} 
                to={link.path} 
                className={`cluster-link-item ${isCurrentPage ? 'active' : ''}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                <span className="link-icon-emoji">{link.icon}</span>
                <span className="link-label-text">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Essential Skills */}
      {career.skills && career.skills.length > 0 && (
        <div className="sidebar-section">
          <h4 className="section-title-sub"><Target size={14} /> Essential Skills</h4>
          <div className="skills-badge-list">
            {career.skills.map((skill, idx) => (
              <span key={idx} className="skill-badge-item">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Top Certifications */}
      {career.certifications && career.certifications.length > 0 && (
        <div className="sidebar-section">
          <h4 className="section-title-sub"><Award size={14} /> Recommended Credentials</h4>
          <ul className="cert-list-sidebar">
            {career.certifications.map((cert, idx) => (
              <li key={idx} className="cert-list-item">{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Careers */}
      {related.length > 0 && (
        <div className="sidebar-section">
          <h4 className="section-title-sub"><BookOpen size={14} /> Alternate Career Paths</h4>
          <div className="related-careers-list">
            {related.map(rel => (
              <Link key={rel.id} to={`/roadmaps/${rel.roadmapSlug}`} className="related-career-link">
                <span className="rel-title">{rel.title}</span>
                <span className="rel-category">{rel.category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
