import { Link } from 'react-router-dom';
import './InternalLinksFooter.css';

const TOP_ROADMAPS = [
  { id: 'software-engineer', title: 'Software Engineer Roadmap' },
  { id: 'data-scientist', title: 'Data Scientist Roadmap' },
  { id: 'frontend-developer', title: 'Frontend Developer Roadmap' },
  { id: 'devops-engineer', title: 'DevOps Engineer Roadmap' },
  { id: 'llm-developer', title: 'LLM & AI Agent Developer Roadmap' },
  { id: 'cloud-engineer-roadmap-2026', title: 'Cloud Engineer Roadmap' },
  { id: 'full-stack-developer', title: 'Full Stack Developer Roadmap' },
  { id: 'ui-ux-designer', title: 'UI/UX Designer Roadmap' },
];

const TOP_SALARY_GUIDES = [
  { id: 'software-engineer-us', title: 'Software Engineer Salary (USA)' },
  { id: 'data-scientist-india', title: 'Data Scientist Salary (India)' },
  { id: 'devops-engineer-us', title: 'DevOps Engineer Salary (USA)' },
  { id: 'ai-engineer-india', title: 'AI Engineer Salary (India)' },
  { id: 'full-stack-developer-us', title: 'Full Stack Developer Salary (USA)' },
  { id: 'frontend-developer-india', title: 'Frontend Developer Salary (India)' },
  { id: 'machine-learning-engineer-us', title: 'ML Engineer Salary (USA)' },
  { id: 'product-manager-us', title: 'Product Manager Salary (USA)' },
];

const TOP_CAREER_GUIDES = [
  { id: 'how-to-become-software-engineer', title: 'How to Become a Software Engineer' },
  { id: 'how-to-become-data-scientist', title: 'How to Become a Data Scientist' },
  { id: 'how-to-become-cloud-engineer', title: 'How to Become a Cloud Engineer' },
  { id: 'ats-resume-tips', title: 'How to Beat the ATS in 2026' },
  { id: 'how-to-transition-ai-engineering', title: 'Transition into AI Engineering' },
  { id: 'skills-to-learn-in-2026', title: 'Top Skills to Learn in 2026' },
  { id: 'how-to-get-a-job-without-experience', title: 'Get a Tech Job Without Experience' },
  { id: 'prompt-engineering-mastery', title: 'Mastering Prompt Engineering' },
];

export default function InternalLinksFooter() {
  return (
    <nav className="ilf-root" aria-label="Explore more resources">
      <div className="ilf-header">
        <h2 className="ilf-title">Explore Career Resources</h2>
        <p className="ilf-subtitle">
          Use our free tools alongside these expert guides to accelerate your career growth.
        </p>
      </div>

      <div className="ilf-grid">
        {/* Roadmaps Column */}
        <div className="ilf-col">
          <div className="ilf-col-header">
            <span className="ilf-col-icon">🗺️</span>
            <h3 className="ilf-col-title">Career Roadmaps</h3>
          </div>
          <ul className="ilf-list">
            {TOP_ROADMAPS.map((r) => (
              <li key={r.id}>
                <Link to={`/roadmaps/${r.id}`} className="ilf-link">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/roadmaps" className="ilf-see-all">
            See all roadmaps →
          </Link>
        </div>

        {/* Salary Guides Column */}
        <div className="ilf-col">
          <div className="ilf-col-header">
            <span className="ilf-col-icon">💰</span>
            <h3 className="ilf-col-title">Salary Guides</h3>
          </div>
          <ul className="ilf-list">
            {TOP_SALARY_GUIDES.map((s) => (
              <li key={s.id}>
                <Link to={`/salary-guides/${s.id}`} className="ilf-link">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/salary-guides" className="ilf-see-all">
            See all salary guides →
          </Link>
        </div>

        {/* Career Guides Column */}
        <div className="ilf-col">
          <div className="ilf-col-header">
            <span className="ilf-col-icon">📈</span>
            <h3 className="ilf-col-title">Career Guides</h3>
          </div>
          <ul className="ilf-list">
            {TOP_CAREER_GUIDES.map((g) => (
              <li key={g.id}>
                <Link to={`/career-guides/${g.id}`} className="ilf-link">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/career-guides" className="ilf-see-all">
            See all career guides →
          </Link>
        </div>
      </div>
    </nav>
  );
}
