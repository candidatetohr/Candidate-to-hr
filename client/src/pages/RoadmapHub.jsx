import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Map, TrendingUp, Briefcase, ChevronRight, BarChart2, X } from 'lucide-react';
import { roadmapList } from '../data/roadmaps';
import SearchIntelligence from '../services/SearchIntelligence';
import ComprehensiveSEOSection from '../components/seo/ComprehensiveSEOSection';
import './RoadmapHub.css';

export default function RoadmapHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ['All', ...new Set(roadmapList.map(r => r.category))];

  const baseFiltered = activeCategory === 'All' 
    ? roadmapList 
    : roadmapList.filter(r => r.category === activeCategory);

  const filteredRoadmaps = SearchIntelligence.search(searchTerm, baseFiltered);

  const suggestions = SearchIntelligence.getSuggestions(searchTerm);
  const trendingSearches = SearchIntelligence.getTrending();

  const trendingRoadmaps = roadmapList.filter(r => r.isTrending && (activeCategory === 'All' || r.category === activeCategory)).slice(0, 3);

  return (
    <div className="hub-page">
      <SEO 
        title="Tech Career Roadmaps & Learning Paths | CandidateToHR"
        description="CandidateToHR's comprehensive career roadmaps for Software Engineering, Data Science, AI, DevOps, and 20+ more tech roles. Step-by-step guides, salary data, and interview prep."
        canonical="/roadmaps"
        type="CollectionPage"
      />

      {/* Hero Section */}
      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge">
            <Map size={14} /> Ultimate Career Hub 2026
          </div>
          <h1 className="hub-title">Design Your Tech Career</h1>
          <p className="hub-subtitle">
            Stop guessing. Follow our step-by-step, industry-vetted roadmaps to land your dream job in tech. See salary data, required skills, and interview questions.
          </p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar" style={{ position: 'relative' }}>
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                  type="text" 
                  placeholder="Search careers (e.g., Software Engineer, Data Scientist)..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  aria-label="Search careers"
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
                      to={`/roadmaps/${s.slug}`} 
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
                    const node = roadmapList.find(r => r.slug.includes(t.id) || r.title.toLowerCase().includes(t.id));
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

      <div className="hub-container hub-layout">
        
        {/* Categories Sidebar */}
        <aside className="hub-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(cat => (
              <li 
                key={cat} 
                role="button"
                tabIndex={0}
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => setActiveCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveCategory(cat);
                  }
                }}
              >
                {cat}
              </li>
            ))}
          </ul>

          <div className="hub-cta-box mt-32">
            <h4>Build Your Resume</h4>
            <p>Ready to apply? Use our AI builder to generate a perfect ATS resume.</p>
            <Link to="/live-editor" className="hub-btn-outline">Create Resume <ChevronRight size={14}/></Link>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="hub-main">
          
          {/* Trending Section (only show if no search filter) */}
          {!searchTerm && activeCategory === 'All' && (
            <div className="trending-section">
              <h2 className="section-heading"><TrendingUp size={20} className="text-blue" /> Trending Careers in 2026</h2>
              <div className="roadmap-grid">
                {trendingRoadmaps.map(roadmap => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} featured />
                ))}
              </div>
            </div>
          )}

          <div className="all-roadmaps-section">
            <h2 className="section-heading"><Briefcase size={20} className="text-purple" /> Explore All Paths</h2>
            {filteredRoadmaps.length === 0 ? (
              <div className="no-results">No roadmaps found for "{searchTerm}".</div>
            ) : (
              <div className="roadmap-grid">
                {filteredRoadmaps.map(roadmap => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
      <ComprehensiveSEOSection topic="roadmaps" />
    </div>
  );
}

function RoadmapCard({ roadmap, featured = false }) {
  return (
    <Link to={`/roadmaps/${roadmap.id}`} className={`roadmap-card ${featured ? 'featured-card' : ''}`}>
      <div className="rc-header">
        <span className="rc-category">{roadmap.category}</span>
        {roadmap.isTrending && <span className="rc-trending"> Hot</span>}
      </div>
      <h3 className="rc-title">{roadmap.title}</h3>
      <p className="rc-desc">{roadmap.shortDescription}</p>
      
      <div className="rc-stats">
        <div className="rc-stat">
          <span className="stat-label">Avg Salary</span>
          <span className="stat-val text-green">{roadmap.salary}</span>
        </div>
        <div className="rc-stat">
          <span className="stat-label">Duration</span>
          <span className="stat-val">{roadmap.duration}</span>
        </div>
        <div className="rc-stat">
          <span className="stat-label">Difficulty</span>
          <span className={`stat-val diff-${roadmap.difficulty.toLowerCase()}`}>{roadmap.difficulty}</span>
        </div>
      </div>
      
      <div className="rc-footer">
        View Roadmap <ChevronRight size={16} />
      </div>
    </Link>
  );
}
