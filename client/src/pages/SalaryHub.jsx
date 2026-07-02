import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, DollarSign, ChevronRight, X } from 'lucide-react';
import { salaryCategories } from '../data/salaryGuides';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import SearchIntelligence from '../services/SearchIntelligence';
import './SalaryHub.css';
import './RoadmapHub.css';

export default function SalaryHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredCategories = SearchIntelligence.search(searchTerm, salaryCategories);
  const suggestions = SearchIntelligence.getSuggestions(searchTerm);
  const trendingSearches = SearchIntelligence.getTrending();

  return (
    <div className="hub-page">
      <SEO 
        title="Tech Salary Guides & Compensation Data | CandidateToHR"
        description="CandidateToHR's 2026 salary guides for tech roles. Discover market rates for Software Engineers, Data Scientists, DevOps, AI Engineers, and more."
        canonical="/salary-guides"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><DollarSign size={14} /> Compensation Data</div>
          <h1 className="hub-title">Tech Salary Guides</h1>
          <p className="hub-subtitle">Don't leave money on the table. Know exactly what you're worth with our 2026 salary data based on real offers.</p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar" style={{ position: 'relative' }}>
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                  type="text" 
                  placeholder="Search by role or country (e.g., India, Software Engineer)..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  aria-label="Search salaries"
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
                      to={`/salary-guides/${s.id}`} 
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
                    const node = salaryCategories.find(s => s.id.includes(t.id) || s.title.toLowerCase().includes(t.id));
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

          <div className="salary-grid">
            {filteredCategories.map(cat => (
              <Link key={cat.id} to={`/salary-guides/${cat.id}`} className="sal-card">
                <div className="sal-card-header">
                  <span className="sal-country">{cat.country}</span>
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <div className="sal-footer">
                  <span>View Full Salary Guide</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>

        </main>
        
        <aside className="hub-sidebar">
          <MockInterviewCTA />
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
