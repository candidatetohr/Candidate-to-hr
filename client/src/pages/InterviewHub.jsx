import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Code, Terminal, ChevronRight, X } from 'lucide-react';
import { interviewCategories } from '../data/interviewQuestions';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import './InterviewHub.css';

export default function InterviewHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = interviewCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.topic && cat.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="hub-page">
      <SEO 
        title="Top Interview Questions & Answers | Technical & Behavioral"
        description="Master your next tech interview with our comprehensive database of technical and behavioral questions, answers, and tips."
        canonical="/interview-questions"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><Code size={14} /> Technical Interview Prep</div>
          <h1 className="hub-title">Acing the Technical Interview</h1>
          <p className="hub-subtitle">Over 2,000 real interview questions asked by top tech companies, categorized by language and difficulty.</p>
          
          <div className="hub-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search topics (e.g., Python, React, System Design)..." 
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
