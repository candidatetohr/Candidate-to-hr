import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, FileText, ChevronRight, X } from 'lucide-react';
import { resumeCategories } from '../data/resumeExamples';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import SearchIntelligence from '../services/SearchIntelligence';
import './ResumeHub.css';
import './RoadmapHub.css';

export default function ResumeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredCategories = SearchIntelligence.search(searchTerm, resumeCategories);
  const suggestions = SearchIntelligence.getSuggestions(searchTerm);
  const trendingSearches = SearchIntelligence.getTrending();

  return (
    <div className="hub-page">
      <SEO 
        title="ATS-Friendly Resume Examples & Templates | CandidateToHR"
        description="Browse CandidateToHR's library of ATS-optimized resume examples for software engineers, data scientists, product managers, and 15+ more tech roles."
        canonical="/resume-examples"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><FileText size={14} /> Resume Templates & Examples</div>
          <h1 className="hub-title">The Perfect Resume Examples</h1>
          <p className="hub-subtitle">Stop getting auto-rejected. Steal the exact resume structures, keywords, and action verbs that land interviews at top companies.</p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar" style={{ position: 'relative' }}>
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                  type="text" 
                  placeholder="Search roles (e.g., Data Scientist, Software Engineer)..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

              {/* Autocomplete suggestions panel */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-autocomplete-dropdown">
                  {suggestions.map(s => (
                    <Link 
                      key={s.id} 
                      to={`/resume-examples/${s.id}`} 
                      className="autocomplete-item"
                    >
                      <span className="ac-title">{s.title}</span>
                      <span className="ac-cat">{s.category}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Trending Careers Tags */}
            <div className="trending-tags-row mt-12 text-sm text-secondary">
              <span className="font-bold">Trending: </span>
              {trendingSearches.map(t => (
                <button 
                  key={t.id} 
                  type="button" 
                  className="trending-tag-btn"
                  onClick={() => {
                    const node = resumeCategories.find(r => r.id.includes(t.id) || r.title.toLowerCase().includes(t.id));
                    setSearchTerm(node ? node.title : t.title);
                  }}
                >
                  {t.title}
                </button>
              ))}
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
