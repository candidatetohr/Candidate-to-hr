import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, DollarSign, ChevronRight, X } from 'lucide-react';
import { salaryCategories } from '../data/salaryGuides';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import './SalaryHub.css';
import './RoadmapHub.css';

export default function SalaryHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = salaryCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hub-page">
      <SEO 
        title="Tech Salary Guides & Negotiation Strategies"
        description="Discover how much you should be earning in top tech roles. Explore salary guides for developers, data scientists, and managers."
        canonical="/salary-guides"
        type="CollectionPage"
      />

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><DollarSign size={14} /> Compensation Data</div>
          <h1 className="hub-title">Tech Salary Guides</h1>
          <p className="hub-subtitle">Don't leave money on the table. Know exactly what you're worth with our 2026 salary data based on real offers.</p>
          
          <form className="hub-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hub-search-bar">
              <div className="hub-search-bar-input-wrapper">
                <Search className="search-icon" size={22} />
                <input 
                  type="text" 
                  placeholder="Search by role or country (e.g., India, Software Engineer)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
