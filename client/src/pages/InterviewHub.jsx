import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Code, Terminal, ChevronRight, X } from 'lucide-react';
import { interviewCategories } from '../data/interviewQuestions';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import SearchIntelligence from '../services/SearchIntelligence';
import './InterviewHub.css';
import './RoadmapHub.css';

export default function InterviewHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredCategories = SearchIntelligence.search(searchTerm, interviewCategories);
  const suggestions = SearchIntelligence.getSuggestions(searchTerm);
  const trendingSearches = SearchIntelligence.getTrending();

  return (
    <div className="hub-page">
      <SEO 
        title="Interview Questions & Answers | CandidateToHR"
        description="CandidateToHR's comprehensive database of technical and behavioral interview questions for Software Engineers, Data Scientists, and more. Practice with real interview Q&A."
        canonical="/interview-questions"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><Code size={14} /> Technical Interview Prep</div>
          <h1 className="hub-title">Acing the Technical Interview</h1>
          <p className="hub-subtitle">Over 2,000 real interview questions asked by top tech companies, categorized by language and difficulty.</p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar" style={{ position: 'relative' }}>
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Search topics (e.g., Python, React, System Design)..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {searchTerm && (
                  <button type="button" className="hub-search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                    <X size={14} />
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
                      to={`/interview-questions/${s.id}`} 
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
                    const node = interviewCategories.find(i => i.id.includes(t.id) || i.title.toLowerCase().includes(t.id));
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

          <div className="interview-grid">
            {filteredCategories.map(cat => (
              <Link key={cat.id} to={`/interview-questions/${cat.id}`} className="int-card">
                <div className="int-card-header">
                  <Terminal size={20} className="text-blue" />
                  <span className="int-topic">{cat.topic}</span>
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <div className="int-footer">
                  <span>{cat.count} Questions</span>
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
