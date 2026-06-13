import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, MessageSquare, BookOpen, MapPin, DollarSign, Zap } from 'lucide-react';
import './SitemapPage.css';

const sitemapData = [
  {
    title: 'Main Pages',
    links: [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Login / Register' },
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact Us' },
    ]
  },
  {
    title: 'Career Resources',
    links: [
      { to: '/interview-questions', label: 'Interview Questions', icon: MessageSquare },
      { to: '/resume-examples', label: 'Resume Examples', icon: FileText },
      { to: '/career-guides', label: 'Career Guides', icon: BookOpen },
      { to: '/roadmaps', label: 'Career Roadmaps', icon: MapPin },
      { to: '/salary-guides', label: 'Salary Guides', icon: DollarSign },
    ]
  },
  {
    title: 'Legal Pages',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="sitemap-container">
      <Helmet>
        <title>Sitemap | CandidateToHR</title>
        <meta name="description" content="CandidateToHR visual sitemap. Easily find all pages, resources, and career guides on our platform." />
      </Helmet>
      
      <div className="sitemap-header">
        <Zap size={32} className="sitemap-icon" />
        <h1>CandidateToHR Sitemap</h1>
        <p>A complete overview of our platform's pages and resources.</p>
      </div>

      <div className="sitemap-grid">
        {sitemapData.map((section, idx) => (
          <div key={idx} className="sitemap-section">
            <h2>{section.title}</h2>
            <ul>
              {section.links.map((link, i) => (
                <li key={i}>
                  <Link to={link.to}>
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
