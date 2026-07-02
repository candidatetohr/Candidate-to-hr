import { Link } from 'react-router-dom';
import CareerKnowledgeGraph from '../../services/CareerKnowledgeGraph';
import './CareerKnowledgeGraphCard.css';
import { Target, ArrowRight, Award, Layers } from 'lucide-react';

export default function CareerKnowledgeGraphCard({ roleId, title }) {
  const career = CareerKnowledgeGraph.getById(roleId);
  if (!career) return null;

  const links = CareerKnowledgeGraph.getLinks(career.id);

  return (
    <div className="career-knowledge-graph-card">
      <div className="card-top-header">
        <div className="badge-wrap">
          <Layers size={14} />
          <span>CandidateToHR Career Graph</span>
        </div>
        <h3 className="card-headline-title">{title || `${career.title} Career Connections`}</h3>
        <p className="card-desc-p">
          This role is part of our integrated Career Knowledge Graph. Explore linked resources, roadmap milestones, salaries, and templates.
        </p>
      </div>

      <div className="graph-cards-grid">
        {links.roadmap && (
          <Link to={links.roadmap} className="graph-subcard-item">
            <span className="card-emoji-icon">🗺️</span>
            <div>
              <h4>Learning Roadmap</h4>
              <p>Step-by-step master plan with milestones, timeline, and resources.</p>
            </div>
            <ArrowRight size={16} className="arrow-right-pos" />
          </Link>
        )}

        {links.resume && (
          <Link to={links.resume} className="graph-subcard-item">
            <span className="card-emoji-icon">📄</span>
            <div>
              <h4>Resume Examples</h4>
              <p>ATS-friendly formats, sample bullet points, and key skills.</p>
            </div>
            <ArrowRight size={16} className="arrow-right-pos" />
          </Link>
        )}

        {links.interview && (
          <Link to={links.interview} className="graph-subcard-item">
            <span className="card-emoji-icon">🎤</span>
            <div>
              <h4>Interview Prep</h4>
              <p>Technical & behavioral interview questions with answers.</p>
            </div>
            <ArrowRight size={16} className="arrow-right-pos" />
          </Link>
        )}

        {links.salary && (
          <Link to={links.salary} className="graph-subcard-item">
            <span className="card-emoji-icon">💰</span>
            <div>
              <h4>Salary Data</h4>
              <p>Compensation ranges, top companies, and geographic scales.</p>
            </div>
            <ArrowRight size={16} className="arrow-right-pos" />
          </Link>
        )}
      </div>

      <div className="card-footer-skills">
        <span className="skills-row-label">Top Skills:</span>
        <div className="skills-badge-list">
          {career.skills.slice(0, 5).map((skill, idx) => (
            <span key={idx} className="skill-badge-item">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
