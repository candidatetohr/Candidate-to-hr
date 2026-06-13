import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, DollarSign, ChevronRight } from 'lucide-react';
import { salaryCategories } from '../data/salaryGuides';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import './SalaryHub.css';

export default function SalaryHub() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = salaryCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hub-page">
      <Helmet>
        <title>Tech Salary Guides 2026 | Candidatetohr</title>
        <meta name="description" content="Discover exact salary ranges for Software Engineers, Data Scientists, and AI Engineers across top cities and companies." />
      </Helmet>

      <section className="hub-hero">
        <div className="hub-container text-center">
          <div className="hub-badge"><DollarSign size={14} /> Compensation Data</div>
          <h1 className="hub-title">Tech Salary Guides</h1>
          <p className="hub-subtitle">Don't leave money on the table. Know exactly what you're worth with our 2026 salary data based on real offers.</p>
          
          <div className="hub-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by role or country (e.g., India, Software Engineer)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
