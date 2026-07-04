import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { FileText, MessageSquare, BookOpen, MapPin, DollarSign, Zap } from 'lucide-react';
import { resumeCategories } from '../data/resumeExamples';
import { interviewCategories } from '../data/interviewQuestions';
import { careerGuideCategories } from '../data/careerGuides';
import { salaryCategories } from '../data/salaryGuides';
import { roadmapList } from '../data/roadmaps';
import ComprehensiveSEOSection from '../components/seo/ComprehensiveSEOSection';
import './SitemapPage.css';

export default function SitemapPage() {
  return (
    <div className="sitemap-container">
      <SEO
        title="Sitemap | CandidateToHR"
        description="CandidateToHR visual sitemap. Browse all career guides, interview questions, salary guides, resume examples, and roadmaps available on our platform."
        canonical="/sitemap"
      />

      <div className="sitemap-header">
        <Zap size={32} className="sitemap-icon" />
        <h1>CandidateToHR Sitemap</h1>
        <p>A complete overview of all pages and resources available on our platform.</p>
      </div>

      <div className="sitemap-grid">

        {/* Main & Legal Pages */}
        <div className="sitemap-section">
          <h2>Main Pages</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login / Register</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

        {/* Resume Examples */}
        <div className="sitemap-section">
          <h2><FileText size={16} className="sitemap-section-icon" /> Resume Examples</h2>
          <ul>
            <li><Link to="/resume-examples">All Resume Examples</Link></li>
            {resumeCategories.map(cat => (
              <li key={cat.id}>
                <Link to={`/resume-examples/${cat.id}`}>{cat.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Interview Questions */}
        <div className="sitemap-section">
          <h2><MessageSquare size={16} className="sitemap-section-icon" /> Interview Questions</h2>
          <ul>
            <li><Link to="/interview-questions">All Interview Questions</Link></li>
            {interviewCategories.map(cat => (
              <li key={cat.id}>
                <Link to={`/interview-questions/${cat.id}`}>{cat.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Career Guides */}
        <div className="sitemap-section">
          <h2><BookOpen size={16} className="sitemap-section-icon" /> Career Guides</h2>
          <ul>
            <li><Link to="/career-guides">All Career Guides</Link></li>
            {careerGuideCategories.map(cat => (
              <li key={cat.id}>
                <Link to={`/career-guides/${cat.id}`}>{cat.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Salary Guides */}
        <div className="sitemap-section">
          <h2><DollarSign size={16} className="sitemap-section-icon" /> Salary Guides</h2>
          <ul>
            <li><Link to="/salary-guides">All Salary Guides</Link></li>
            {salaryCategories.map(cat => (
              <li key={cat.id}>
                <Link to={`/salary-guides/${cat.id}`}>{cat.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Career Roadmaps */}
        <div className="sitemap-section">
          <h2><MapPin size={16} className="sitemap-section-icon" /> Career Roadmaps</h2>
          <ul>
            <li><Link to="/roadmaps">All Career Roadmaps</Link></li>
            {roadmapList.map(r => (
              <li key={r.id}>
                <Link to={`/roadmaps/${r.id}`}>{r.title}</Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="sitemap-footer">
        <p>
          Total pages: <strong>
            {5 + 2 + resumeCategories.length + interviewCategories.length + careerGuideCategories.length + salaryCategories.length + roadmapList.length}
          </strong> indexed resources
        </p>
      </div>
      <ComprehensiveSEOSection topic="utilities" />
    </div>
  );
}
