import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, FileText, ChevronRight } from 'lucide-react';
import { resumeCategories } from '../data/resumeExamples';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import './ResumeHub.css';

export default function ResumeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = resumeCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hub-page">
      <SEO title="ATS Resume Examples 2026 | Candidatetohr" description="Browse hundreds of ATS-friendly resume examples for Software Engineers, Data Scientists, and more." />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><FileText size={14} /> Resume Templates & Examples</div>
          <h1 className="hub-title">The Perfect Resume Examples</h1>
          <p className="hub-subtitle">Stop getting auto-rejected. Steal the exact resume structures, keywords, and action verbs that land interviews at top companies.</p>
          
          <div className="hub-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search roles (e.g., Data Scientist, Software Engineer)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
