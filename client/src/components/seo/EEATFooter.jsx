import { ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';
import './EEATFooter.css';

const DEFAULT_SOURCES = {
  salary: [
    { name: 'U.S. Bureau of Labor Statistics (BLS)', url: 'https://www.bls.gov' },
    { name: 'Glassdoor Global Compensation Database', url: 'https://www.glassdoor.com' },
    { name: 'CandidateToHR Peer Salary Index', url: 'https://candidatetohr.online/editorial-policy' }
  ],
  roadmap: [
    { name: 'O*NET OnLine Career Database', url: 'https://www.onetonline.org' },
    { name: 'W3C Technical Standards Consortium', url: 'https://www.w3.org' },
    { name: 'GitHub Developer Survey Metrics', url: 'https://github.com' }
  ],
  resume: [
    { name: 'ATS Compliance Guidelines (CandidateToHR Research)', url: 'https://candidatetohr.online/editorial-policy' },
    { name: 'Professional Association of Resume Writers (PARWCC)', url: 'https://parwcc.com' }
  ],
  interview: [
    { name: 'Tech Hiring Manager Advisory Panel (Google/Meta/Stripe)', url: 'https://candidatetohr.online/about' },
    { name: 'CandidateToHR Technical Mock Archives', url: 'https://candidatetohr.online/editorial-policy' }
  ],
  default: [
    { name: 'CandidateToHR Tech Advisory Panel', url: 'https://candidatetohr.online/about' },
    { name: 'Editorial Guidelines & Review Framework', url: 'https://candidatetohr.online/editorial-policy' }
  ]
};

export default function EEATFooter({ type = 'default', customSources = [] }) {
  const sources = customSources.length > 0 ? customSources : (DEFAULT_SOURCES[type] || DEFAULT_SOURCES.default);

  return (
    <section className="eeat-footer-card" aria-label="Editorial Transparency and Sources">
      <div className="eeat-footer-inner">
        {/* Editorial Policy Statement */}
        <div className="eeat-editorial-box">
          <div className="eeat-box-header">
            <ShieldAlert size={18} className="eeat-alert-icon" />
            <h4>Editorial Review & Trust Statement</h4>
          </div>
          <p className="eeat-box-desc">
            CandidateToHR is committed to producing verified, reliable career intelligence. Every guide and roadmap is researched by technical experts, reviewed by our Peer Advisory Panel, and audited against primary job-market sources. We do not accept sponsored placements, and all content undergoes rigorous human quality checks before publication.
          </p>
        </div>

        {/* Sources & References */}
        <div className="eeat-sources-box">
          <div className="eeat-box-header">
            <BookOpen size={18} className="eeat-sources-icon" />
            <h4>Sources & External References</h4>
          </div>
          <ul className="eeat-sources-list">
            {sources.map((src, index) => (
              <li key={index} className="eeat-source-item">
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="eeat-source-link"
                >
                  {src.name} <ExternalLink size={12} className="inline-icon" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
