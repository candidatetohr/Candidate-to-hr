import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Map, TrendingUp, Briefcase, ChevronRight, BarChart2, X } from 'lucide-react';
import { roadmapList } from '../data/roadmaps';
import './RoadmapHub.css';

export default function RoadmapHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(roadmapList.map(r => r.category))];

  const filteredRoadmaps = roadmapList.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || roadmap.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingRoadmaps = roadmapList.filter(r => r.isTrending && (activeCategory === 'All' || r.category === activeCategory)).slice(0, 3);

  return (
    <div className="hub-page">
      <SEO 
        title="Tech Career Roadmaps & Learning Paths"
        description="Discover comprehensive career roadmaps for Software Engineering, Data Science, and more. Step-by-step guides to land your dream job."
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
          
          <div className="hub-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search careers (e.g., Software Engineer, Data Scientist)..." 
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

      <div className="hub-container hub-layout">
        
        {/* Categories Sidebar */}
        <aside className="hub-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(cat => (
              <li 
                key={cat} 
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => setActiveCategory(cat)}
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
