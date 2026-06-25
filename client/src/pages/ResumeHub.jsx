import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, FileText, ChevronRight, X } from 'lucide-react';
import { resumeCategories } from '../data/resumeExamples';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import './ResumeHub.css';
import './RoadmapHub.css';

export default function ResumeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = resumeCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hub-page">
      <SEO 
        title="ATS-Friendly Resume Examples & Templates"
        description="Browse our library of ATS-optimized resume examples for software engineers, data scientists, and product managers."
        canonical="/resume-examples"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><FileText size={14} /> Resume Templates & Examples</div>
          <h1 className="hub-title">The Perfect Resume Examples</h1>
          <p className="hub-subtitle">Stop getting auto-rejected. Steal the exact resume structures, keywords, and action verbs that land interviews at top companies.</p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar">
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                  type="text" 
                  placeholder="Search roles (e.g., Data Scientist, Software Engineer)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search resume roles"
                />
                {searchTerm && (
                  <button type="button" className="hub-search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="hub-search-submit-btn">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="hub-container layout-sidebar-right">
        <main className="hub-main">
          
          <AdBanner />

          <div className="resume-grid">
            {filteredCategories.map(cat => (
              <Link key={cat.id} to={`/resume-examples/${cat.id}`} className="res-card">
                <div className="res-card-header">
                  <span className="res-role">{cat.role}</span>
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <div className="res-footer">
                  <span>View Example</span>
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
    </div>
  );
}
