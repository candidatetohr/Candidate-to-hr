import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, CornerDownLeft, Sparkles, Map, FileText, MessageSquare, DollarSign, BookOpen } from 'lucide-react';
import SearchIntelligence from '../services/SearchIntelligence';
import './GlobalSearch.css';

const CATEGORY_ICONS = {
  'Roadmap': Map,
  'Interview Prep': MessageSquare,
  'Career Guide': BookOpen,
  'Salary Guide': DollarSign,
  'Resume Example': FileText,
  'AI Tool': Sparkles
};

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ats_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches', e);
    }
  }, [isOpen]);

  // Save recent search helper
  const saveRecentSearch = (searchText) => {
    if (!searchText || !searchText.trim()) return;
    const cleanSearchText = searchText.trim();
    const updated = [
      cleanSearchText,
      ...recentSearches.filter(s => s.toLowerCase() !== cleanSearchText.toLowerCase())
    ].slice(0, 5); // Max 5 items
    setRecentSearches(updated);
    localStorage.setItem('ats_recent_searches', JSON.stringify(updated));
  };

  // Clear single recent search helper
  const removeRecentSearch = (e, searchText) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== searchText);
    setRecentSearches(updated);
    localStorage.setItem('ats_recent_searches', JSON.stringify(updated));
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        const searchResults = SearchIntelligence.globalSearch(query);
        setResults(searchResults);
        setActiveIndex(0);
      } else {
        setResults([]);
      }
    }, 100); // 100ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle Escape key globally
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => {
        const max = results.length > 0 ? results.length : recentSearches.length + 4; // trending counts
        return prev < max - 1 ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => {
        const max = results.length > 0 ? results.length : recentSearches.length + 4;
        return prev > 0 ? prev - 1 : max - 1;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectActive();
    }
  };

  // Auto-scroll active result into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('.search-item-active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleSelectActive = () => {
    // If we have search results
    if (results.length > 0) {
      const selected = results[activeIndex];
      if (selected) {
        saveRecentSearch(query);
        handleNavigate(selected.url);
      }
    } else {
      // If we don't have query/results, activeIndex maps to Recents then Trending
      const recentsCount = recentSearches.length;
      if (activeIndex < recentsCount) {
        const queryText = recentSearches[activeIndex];
        setQuery(queryText);
      } else {
        const trendingIndex = activeIndex - recentsCount;
        const trending = SearchIntelligence.getTrending();
        if (trending[trendingIndex]) {
          setQuery(trending[trendingIndex].title);
        }
      }
    }
  };

  const handleNavigate = (url) => {
    navigate(url);
    onClose();
  };

  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const trendingList = SearchIntelligence.getTrending();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="search-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Global Search">
          <m.div
            className="search-modal"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header / Search Input */}
            <div className="search-header">
              <Search className="search-input-icon" size={20} />
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search roadmaps, interview prep, career guides, AI tools..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-controls="search-results-list"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-activedescendant={
                  query 
                    ? (results.length > 0 ? `search-opt-result-${activeIndex}` : undefined)
                    : (activeIndex < recentSearches.length 
                        ? `search-opt-recent-${activeIndex}` 
                        : `search-opt-trending-${activeIndex - recentSearches.length}`)
                }
              />
              {query && (
                <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="Clear search query">
                  <X size={16} />
                </button>
              )}
              <div className="search-esc-tag">ESC</div>
            </div>

            {/* Content Body */}
            <div className="search-body" ref={resultsContainerRef}>
              
              {/* Empty query state: Recents & Trending */}
              {!query && (
                <div className="search-default-state">
                  {recentSearches.length > 0 && (
                    <div className="search-section">
                      <h4 className="search-section-title">Recent Searches</h4>
                      <div className="search-list" role="listbox" id="search-results-list">
                        {recentSearches.map((item, idx) => {
                          const isActive = activeIndex === idx;
                          return (
                            <div
                              key={item}
                              id={`search-opt-recent-${idx}`}
                              role="option"
                              aria-selected={isActive}
                              className={`search-item ${isActive ? 'search-item-active' : ''}`}
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => setQuery(item)}
                            >
                              <Clock size={16} className="search-item-icon" />
                              <span className="search-item-title">{item}</span>
                              <div className="search-item-actions">
                                <button
                                  className="search-remove-recent"
                                  onClick={(e) => removeRecentSearch(e, item)}
                                  aria-label={`Remove search for ${item}`}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="search-section">
                    <h4 className="search-section-title">Popular Searches</h4>
                    <div className="search-list" role="listbox" id="search-trending-list">
                      {trendingList.map((item, idx) => {
                        const globalIdx = recentSearches.length + idx;
                        const isActive = activeIndex === globalIdx;
                        return (
                          <div
                            key={item.id}
                            id={`search-opt-trending-${idx}`}
                            role="option"
                            aria-selected={isActive}
                            className={`search-item ${isActive ? 'search-item-active' : ''}`}
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                            onClick={() => {
                              saveRecentSearch(item.title);
                              handleNavigate(`/roadmaps/${item.id}`);
                            }}
                          >
                            <Sparkles size={16} className="search-item-icon text-amber-500" />
                            <span className="search-item-title">{item.title}</span>
                            <ArrowRight size={14} className="search-item-arrow" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Has query results state */}
              {query && results.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <h4 className="search-section-title">Search Results ({results.length})</h4>
                  </div>
                  <div className="search-list" role="listbox" id="search-results-list">
                    {results.map((item, idx) => {
                      const isActive = activeIndex === idx;
                      const IconComponent = CATEGORY_ICONS[item.category] || Search;
                      return (
                        <div
                          key={`${item.category}-${item.id}`}
                          id={`search-opt-result-${idx}`}
                          role="option"
                          aria-selected={isActive}
                          className={`search-item ${isActive ? 'search-item-active' : ''}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            saveRecentSearch(query);
                            handleNavigate(item.url);
                          }}
                        >
                          <div className="search-item-icon-wrapper">
                            <IconComponent size={16} />
                          </div>
                          <div className="search-item-details">
                            <div className="search-item-top">
                              <span className="search-item-title">{highlightText(item.title, query)}</span>
                              <span className="search-item-badge">{item.category}</span>
                            </div>
                            {item.description && (
                              <p className="search-item-desc">{highlightText(item.description, query)}</p>
                            )}
                          </div>
                          <div className="search-item-enter-icon">
                            <CornerDownLeft size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results state */}
              {query && results.length === 0 && (
                <div className="search-no-results">
                  <div className="no-results-icon-container">
                    <Search size={32} />
                  </div>
                  <h3>No results for "{query}"</h3>
                  <p>Check the spelling or try searching for another topic.</p>
                  
                  <div className="no-results-recommendations">
                    <h4>Recommended AI Tools</h4>
                    <div className="recommendations-grid">
                      <div className="rec-card" onClick={() => handleNavigate('/analyze')}>
                        <Sparkles size={16} className="text-cyan-400" />
                        <span>Resume Score</span>
                      </div>
                      <div className="rec-card" onClick={() => handleNavigate('/interview-sim')}>
                        <MessageSquare size={16} className="text-emerald-400" />
                        <span>Mock Interview</span>
                      </div>
                      <div className="rec-card" onClick={() => handleNavigate('/roadmaps')}>
                        <Map size={16} className="text-purple-400" />
                        <span>Tech Roadmaps</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer / Helper Guidelines */}
            <div className="search-footer">
              <div className="search-footer-hint">
                <kbd>↑↓</kbd> to navigate
              </div>
              <div className="search-footer-hint">
                <kbd>Enter</kbd> to select
              </div>
              <div className="search-footer-hint">
                <kbd>Esc</kbd> to close
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
