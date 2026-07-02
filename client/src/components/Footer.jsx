import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" aria-label="CandidateToHR - AI Career Platform">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo" aria-label="CandidateToHR Homepage">
            <img src="/logo.png" alt="CandidateToHR Logo" width="40" height="40" loading="lazy" style={{ height: '40px' }} />
            <span className="footer-brand-name">CandidateToHR</span>
          </Link>
          <p className="footer-description">
            CandidateToHR is an AI-powered career intelligence platform helping students and professionals improve resumes, prepare for interviews, discover career roadmaps, and accelerate career growth.
          </p>
          <p className="footer-tagline">
            <strong>AI Resume Analyzer</strong> &bull; <strong>ATS Optimizer</strong> &bull; <strong>Career Roadmaps</strong>
          </p>
        </div>

        {/* Column 2: Company */}
        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About CandidateToHR</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/sitemap">HTML Sitemap</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="footer-col">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/interview-questions">Interview Questions</Link></li>
            <li><Link to="/resume-examples">Resume Examples</Link></li>
            <li><Link to="/career-guides">Career Guides</Link></li>
            <li><Link to="/salary-guides">Salary Guides</Link></li>
            <li><Link to="/roadmaps">Career Roadmaps</Link></li>
          </ul>
        </div>

        {/* Column 4: AI Tools Part 1 */}
        <div className="footer-col">
          <h3>AI Tools</h3>
          <ul>
            <li><Link to="/analyze">AI Resume Analyzer</Link></li>
            <li><Link to="/resume-builder">AI Resume Builder</Link></li>
            <li><Link to="/live-editor">Live AI Editor</Link></li>
            <li><Link to="/interview-sim">Interview Simulator</Link></li>
            <li><Link to="/rejection-decoder">Rejection Decoder</Link></li>
            <li><Link to="/learning-path">Learning Path Generator</Link></li>
            <li><Link to="/placement-probability">Placement Probability</Link></li>
          </ul>
        </div>

        {/* Column 5: AI Tools Part 2 */}
        <div className="footer-col">
          <h3>AI Tools</h3>
          <ul>
            <li><Link to="/truth-detector">Truth Detector</Link></li>
            <li><Link to="/culture-fit">Culture Fit Analyzer</Link></li>
            <li><Link to="/offer-negotiator">Offer Negotiator</Link></li>
            <li><Link to="/skill-gap">Skill Gap Analyzer</Link></li>
            <li><Link to="/network-builder">Network Builder</Link></li>
            <li><Link to="/portfolio-optimizer">Portfolio Optimizer</Link></li>
          </ul>
        </div>

        {/* Column 5: Legal & EEAT Trust */}
        <div className="footer-col">
          <h3>Trust &amp; Policies</h3>
          <ul>
            <li><Link to="/trust">Trust Center Hub</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/editorial-policy">Editorial Standards</Link></li>
            <li><Link to="/ai-policy">AI Ethics Disclosures</Link></li>
            <li><Link to="/trust/cookies">Cookie Disclosures</Link></li>
            <li><Link to="/trust/accessibility">Accessibility Statement</Link></li>
            <li><Link to="/trust/security">Security Information</Link></li>
            <li><Link to="/trust/fact-checking">Fact-Checking Policy</Link></li>
          </ul>
        </div>

        {/* Column 6: Contact */}
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li><a href="mailto:support@candidatetohr.online">support@candidatetohr.online</a></li>
            <li><Link to="/contact">Contact Page</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>CandidateToHR</Link>. All Rights Reserved. &bull; AI Career Intelligence Platform
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);


