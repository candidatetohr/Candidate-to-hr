import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import CareerKnowledgeGraph from '../services/CareerKnowledgeGraph';
import CareerGraphSidebar from '../components/seo/CareerGraphSidebar';
import ReadingProgress from '../components/seo/ReadingProgress';
import FAQAccordion from '../components/seo/FAQAccordion';
import './ProgrammaticSalaryPage.css';

// City definitions with regional settings and multipliers
const CITIES = {
  // India
  bangalore: { name: 'Bangalore', country: 'India', currency: '₹', multiplier: 1.15, baseSalary: '₹18,50,000' },
  hyderabad: { name: 'Hyderabad', country: 'India', currency: '₹', multiplier: 1.0, baseSalary: '₹15,00,000' },
  pune: { name: 'Pune', country: 'India', currency: '₹', multiplier: 0.92, baseSalary: '₹13,80,000' },
  mumbai: { name: 'Mumbai', country: 'India', currency: '₹', multiplier: 1.08, baseSalary: '₹16,20,000' },
  // US
  'san-francisco': { name: 'San Francisco', country: 'United States', currency: '$', multiplier: 1.45, baseSalary: '$165,000' },
  'new-york': { name: 'New York', country: 'United States', currency: '$', multiplier: 1.35, baseSalary: '$152,000' },
  austin: { name: 'Austin', country: 'United States', currency: '$', multiplier: 1.15, baseSalary: '$132,000' },
  seattle: { name: 'Seattle', country: 'United States', currency: '$', multiplier: 1.3, baseSalary: '$148,000' }
};

export default function ProgrammaticSalaryPage() {
  const { role, city } = useParams();
  
  const career = CareerKnowledgeGraph.getById(role);
  const cityData = CITIES[city?.toLowerCase()];

  if (!career || !cityData) {
    return (
      <div className="p-48 text-center text-secondary">
        <h3>Page Not Found</h3>
        <p>The requested career salary report in this city does not exist.</p>
        <Link to="/salary-guides" className="btn btn-primary mt-16">View Salary Guides</Link>
      </div>
    );
  }

  // Parse average salary number to calculate city-specific scale
  const rawAvg = parseInt(career.averageSalary.replace(/[^\d]/g, ''), 10) || 120000;
  const isIndia = cityData.country === 'India';
  
  let localAvg;
  if (isIndia) {
    // If global average was in USD, convert to INR base then multiply
    const baseInr = rawAvg < 500000 ? rawAvg * 83 : rawAvg;
    localAvg = Math.round(baseInr * cityData.multiplier);
  } else {
    // USD
    const baseUsd = rawAvg > 500000 ? Math.round(rawAvg / 83) : rawAvg;
    localAvg = Math.round(baseUsd * cityData.multiplier);
  }

  // Format currency
  const formattedSalary = cityData.currency + localAvg.toLocaleString();

  const titleText = `${career.title} Salary in ${cityData.name} (${cityData.country}) - 2026 Guide`;
  const descriptionText = `Check average salaries, benefits, and top paying companies for a ${career.title} in ${cityData.name}, ${cityData.country}. Direct insights from CandidateToHR.`;

  const faqs = [
    {
      q: `What is the average salary of a ${career.title} in ${cityData.name}?`,
      a: `The average salary for a ${career.title} in ${cityData.name} is approximately ${formattedSalary} per year, depending on experience and the specific employer.`
    },
    {
      q: `Which companies pay the highest for a ${career.title} in ${cityData.name}?`,
      a: `Major tech companies, financial firms, and unicorn startups in the local ${cityData.name} hub generally offer top-tier compensation packages for senior ${career.title} professionals.`
    }
  ];

  return (
    <div className="p-seo-page-container container-standard px-6 py-8">
      <SEO 
        title={titleText} 
        description={descriptionText} 
        canonical={`/salary-guides/${role}/in/${city}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Salary Guides', url: '/salary-guides' },
          { name: career.title, url: `/salary-guides/${career.id}` },
          { name: `In ${cityData.name}`, url: `/salary-guides/${role}/in/${city}` }
        ]}
      />
      <SchemaMarkup
        type="Dataset"
        data={{
          name: `${career.title} Salary Dataset for ${cityData.name}`,
          description: `Geographic salary dataset listing base salaries and ranges for ${career.title} in ${cityData.name}, ${cityData.country}.`,
          url: `https://candidatetohr.online/salary-guides/${role}/in/${city}`
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-24">
        <main className="lg:col-span-2 content-long-form">
          <header className="p-seo-header">
            <span className="p-seo-tag">Geographic Compensation Report</span>
            <h1 className="text-4xl font-extrabold mb-8">{career.title} Salary in {cityData.name}</h1>
            <p className="text-lg text-secondary mb-16">
              Detailed compensation analysis, salary ranges, benefits, and market insights for professionals in the {cityData.name} metro region.
            </p>
          </header>

          <div className="glowing-salary-highlight-card">
            <span className="card-lbl-sub">Estimated Average Base Salary</span>
            <h2 className="text-5xl font-black color-success">{formattedSalary} <span className="text-base text-secondary">/ yr</span></h2>
            <div className="card-market-indicator">
              <span className="status-dot green"></span>
              <span>Strong hiring activity in {cityData.name}</span>
            </div>
          </div>

          <section className="mt-32">
            <h2>Experience Breakdown</h2>
            <p>
              Salary ranges vary heavily based on years of experience, scope of responsibilities, and specific skill matching.
            </p>
            <div className="experience-chart-bar-list">
              <div className="bar-row">
                <span className="lvl">Junior (1-3 yrs)</span>
                <div className="bar-container">
                  <div className="bar-fill junior" style={{ width: '40%' }}></div>
                </div>
                <span className="val">{cityData.currency}{Math.round(localAvg * 0.6).toLocaleString()}</span>
              </div>
              <div className="bar-row">
                <span className="lvl">Mid-Level (3-6 yrs)</span>
                <div className="bar-container">
                  <div className="bar-fill mid" style={{ width: '70%' }}></div>
                </div>
                <span className="val">{cityData.currency}{Math.round(localAvg * 0.95).toLocaleString()}</span>
              </div>
              <div className="bar-row">
                <span className="lvl">Senior (6+ yrs)</span>
                <div className="bar-container">
                  <div className="bar-fill senior" style={{ width: '100%' }}></div>
                </div>
                <span className="val">{cityData.currency}{Math.round(localAvg * 1.45).toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="mt-48">
            <h2>Key Skills Needed in {cityData.name}</h2>
            <p>
              Hiring managers in the local market prioritize candidates with hands-on proficiency in:
            </p>
            <div className="skills-row-badges mt-12">
              {career.skills.map((skill, idx) => (
                <span key={idx} className="skill-item-badge">{skill}</span>
              ))}
            </div>
          </section>

          <FAQAccordion items={faqs} />
        </main>

        <aside className="space-y-6">
          <CareerGraphSidebar roleId={career.id} />
        </aside>
      </div>
    </div>
  );
}
