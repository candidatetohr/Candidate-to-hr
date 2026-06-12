import { Link } from 'react-router-dom';
import { FileText, Target, Video, ArrowRight } from 'lucide-react';
import './PlatformCTAs.css';

export function ResumeBuilderCTA({ title = "Stop Getting Auto-Rejected", subtitle = "Use our AI Resume Builder to bypass the ATS and land more interviews." }) {
  return (
    <div className="cta-box cta-blue">
      <div className="cta-icon-wrap"><FileText size={24} className="text-blue" /></div>
      <div className="cta-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <Link to="/live-editor" className="cta-btn cta-btn-blue">Build Resume <ArrowRight size={16}/></Link>
    </div>
  );
}

export function ATSCheckerCTA() {
  return (
    <div className="cta-box cta-purple">
      <div className="cta-icon-wrap"><Target size={24} className="text-purple" /></div>
      <div className="cta-content">
        <h3>Check Your ATS Score</h3>
        <p>Is your resume holding you back? Upload it now for an instant AI analysis.</p>
      </div>
      <Link to="/analyze" className="cta-btn cta-btn-purple">Scan Resume <ArrowRight size={16}/></Link>
    </div>
  );
}

export function MockInterviewCTA() {
  return (
    <div className="cta-box cta-green">
      <div className="cta-icon-wrap"><Video size={24} className="text-green" /></div>
      <div className="cta-content">
        <h3>Practice Makes Perfect</h3>
        <p>Do a simulated mock interview tailored specifically to this career path.</p>
      </div>
      <Link to="/interview-sim" className="cta-btn cta-btn-green">Start Interview <ArrowRight size={16}/></Link>
    </div>
  );
}
