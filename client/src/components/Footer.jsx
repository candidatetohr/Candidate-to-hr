import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="CandidateToHR Logo" width="40" height="40" loading="lazy" style={{ height: '40px' }} />
          </Link>
          <p className="footer-description">
            AI-Powered Resume Analysis & Interview Preparation
          </p>
        </div>

        {/* Column 2: Company */}
        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
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

        {/* Column 4: AI Tools */}
        <div className="footer-col">
          <h3>AI Tools</h3>
          <ul>
            <li><Link to="/culture-fit">Culture Fit Analyzer</Link></li>
            <li><Link to="/offer-negotiator">Offer Negotiator</Link></li>
            <li><Link to="/skill-gap">Skill Gap Analyzer</Link></li>
            <li><Link to="/network-builder">Network Builder</Link></li>
            <li><Link to="/portfolio-optimizer">Portfolio Optimizer</Link></li>
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div className="footer-col">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

        {/* Column 6: Contact */}
        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:Candidatetohr@gmail.com">Candidatetohr@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} CandidateToHR. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
