import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Code, Terminal, ChevronRight } from 'lucide-react';
import { interviewCategories } from '../data/interviewQuestions';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import './InterviewHub.css';

export default function InterviewHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = interviewCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hub-page">
      <Helmet>
        <title>Top Tech Interview Questions 2026 | Candidatetohr</title>
        <meta name="description" content="Prepare for your next technical interview with our massive database of real interview questions for Python, Java, React, SQL, and System Design." />
      </Helmet>

      <section className="hub-hero">
        <div className="hub-bg-glow"></div>
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
