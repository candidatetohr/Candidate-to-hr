import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, BookOpen, ChevronRight, X } from 'lucide-react';
import { careerGuideCategories } from '../data/careerGuides';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import ComprehensiveSEOSection from '../components/seo/ComprehensiveSEOSection';
import './CareerGuideHub.css';

export default function CareerGuideHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = careerGuideCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.topic && cat.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="hub-page">
      <SEO 
        title="Career Guides & Job Search Resources | CandidateToHR"
        description="CandidateToHR's expert career guides covering ATS optimization, salary negotiation, interview prep, and how to break into top tech roles in 2026."
        canonical="/career-guides"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><BookOpen size={14} /> Career Advice</div>
          <h1 className="hub-title">Tech Career Guides</h1>
          <p className="hub-subtitle">Actionable, step-by-step blueprints to break into tech, land promotions, and build future-proof skills.</p>
          
          <div className="hub-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search guides (e.g., How to become a Data Scientist)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="hub-search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="hub-container layout-sidebar-right">
        <main className="hub-main">
          
          <AdBanner />

          <div className="guide-grid">
            {filteredCategories.map(cat => (
              <Link key={cat.id} to={`/career-guides/${cat.id}`} className="guide-card">
                <div className="guide-card-header">
                  <span className="guide-topic">{cat.topic}</span>
                  <span className="guide-time">{cat.readTime}</span>
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <div className="guide-footer">
                  <span>Read Guide</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>

        </main>
        
        <aside className="hub-sidebar">
          <ResumeBuilderCTA />
          <SidebarAd />
        </aside>
      </div>
      <ComprehensiveSEOSection topic="career-guides" />
    </div>
  );
}
