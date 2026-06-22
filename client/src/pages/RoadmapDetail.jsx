import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp, MapPin, Target, Zap, DollarSign, PenTool, CheckCircle, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RelatedResources from '../components/seo/RelatedResources';
import './RoadmapDetail.css';

export default function RoadmapDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // Dynamically load the roadmap JSON file
    import(`../data/roadmaps/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Roadmap not found:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="rd-loading"><div className="spinner"></div>Loading Roadmap...</div>;
  }

  if (error || !data) {
    return (
      <div className="rd-error">
        <h2>Roadmap Not Found</h2>
        <p>We are still building the roadmap for "{slug}".</p>
        <Link to="/roadmaps" className="btn">Back to Hub</Link>
      </div>
    );
  }

  const { seo, hero, overview, skillsTimeline, learningPath, toolsAndTech, projects, certifications, salaryInsights, interviewPrep, jobMarket, faq } = data;

  return (
    <div className="roadmap-detail-page">
      {/* ─── SEO METADATA ─────────────────────────── */}
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={`https://www.candidatetohr.online/roadmaps/${slug}`} />
        <meta property="og:url" content={`https://www.candidatetohr.online/roadmaps/${slug}`} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        {data.faq && data.faq.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": data.faq.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.a
                }
              }))
            })}
          </script>
        )}
      </Helmet>

      {/* ─── HERO SECTION ─────────────────────────── */}
      <header className="rd-hero">
        <div className="container-seo content-long-form text-center">
          <Breadcrumbs />
          <h1 className="rd-hero-title mt-24 mb-16">{hero.title}</h1>
          <p className="rd-hero-subtitle max-w-2xl text-secondary">{hero.shortDescription}</p>
          
          <div className="author-block flex items-center justify-center gap-16 mt-24 mb-32">
            <div className="author-avatar" style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span className="font-bold text-primary">HR</span>
            </div>
            <div className="author-info text-left">
              <div className="font-bold">CandidateToHR Career Experts</div>
              <div className="text-sm text-secondary">Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {hero.learningDuration}</div>
            </div>
          </div>
          
          <div className="rd-hero-stats">
            <div className="rd-stat-box">
              <span className="rd-stat-label">Avg Salary</span>
              <span className="rd-stat-value text-green">{hero.averageSalary}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Growth Rate</span>
              <span className="rd-stat-value">{hero.growthRate}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Duration</span>
              <span className="rd-stat-value">{hero.learningDuration}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Difficulty</span>
              <span className="rd-stat-value">{hero.difficultyLevel}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Demand</span>
              <span className="rd-stat-value text-blue">{hero.hiringDemand}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-seo rd-layout">
        
        <main className="rd-main">
          {/* ─── OVERVIEW ─────────────────────────── */}
          <section className="rd-section">
            <h2><Target size={22} className="text-purple"/> Career Overview</h2>
            <div className="card">
              <p><strong>What they do:</strong> {overview.whatTheyDo}</p>
              <div className="mt-16">
                <strong>Top Industries Hiring:</strong>
                <div className="chips-container mt-8">
                  {overview.industriesHiring.map((ind, i) => <span key={i} className="chip">{ind}</span>)}
                </div>
              </div>
              <div className="mt-16">
                <strong>Core Responsibilities:</strong>
                <ul className="rd-list mt-8">
                  {overview.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── MONTH-BY-MONTH TIMELINE ─────────────────────────── */}
          <section className="rd-section">
            <h2><MapPin size={22} className="text-blue"/> Step-by-Step Learning Path</h2>
            <div className="rd-timeline">
              {learningPath.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div className="rd-timeline-dot"></div>
                  <div className="rd-timeline-content">
                    <h3>{step.month}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── SKILLS & TOOLS ─────────────────────────── */}
          <section className="rd-section">
            <h2><Zap size={22} className="text-yellow"/> Skills & Tools Mastery</h2>
            <div className="rd-skills-grid">
              <div className="card">
                <h3>Beginner</h3>
                <ul className="rd-list">
                  {skillsTimeline.beginner.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3>Intermediate</h3>
                <ul className="rd-list">
                  {skillsTimeline.intermediate.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3>Advanced</h3>
                <ul className="rd-list">
                  {skillsTimeline.advanced.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="card mt-16">
              <h3>Essential Tools</h3>
              <div className="chips-container mt-8">
                {toolsAndTech.map((tool, i) => <span key={i} className="chip chip-outline">{tool}</span>)}
              </div>
            </div>
          </section>

          {/* ─── PROJECTS ─────────────────────────── */}
          <section className="rd-section">
            <h2><PenTool size={22} className="text-green"/> Project Ideas to Build</h2>
            <div className="rd-projects-grid">
              <div className="rd-project-col">
                <div className="rd-project-badge beginner">Beginner</div>
                <ul className="rd-list mt-3">
                  {projects.beginner.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="rd-project-col">
                <div className="rd-project-badge intermediate">Intermediate</div>
                <ul className="rd-list mt-3">
                  {projects.intermediate.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="rd-project-col">
                <div className="rd-project-badge advanced">Advanced</div>
                <ul className="rd-list mt-3">
                  {projects.advanced.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── INTERVIEW & RESUME PREP ─────────────────────────── */}
          <section className="rd-section">
            <h2><CheckCircle size={22} className="text-blue"/> Interview & Resume Prep</h2>
            <div className="card">
              <h3>Top Interview Questions</h3>
              <ul className="rd-list mt-8 mb-16">
                {interviewPrep.topQuestions.map((q, i) => <li key={i}><strong>Q:</strong> {q}</li>)}
              </ul>
              
              <h3>Common Mistakes to Avoid</h3>
              <ul className="rd-list mt-8 mb-16">
                {interviewPrep.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
              
              <h3>Resume & ATS Tips</h3>
              <div className="rd-resume-tips mt-8">
                <p><strong>Keywords to Include:</strong> {interviewPrep.resumeTips.keywords.join(', ')}</p>
                <p><strong>ATS Optimization:</strong> {interviewPrep.resumeTips.atsOptimization}</p>
              </div>
            </div>
          </section>

          {/* ─── SALARY INSIGHTS ─────────────────────────── */}
          <section className="rd-section">
            <h2><DollarSign size={22} className="text-green"/> Salary Insights</h2>
            <div className="rd-salary-table">
              {salaryInsights.map((s, i) => (
                <div key={i} className="rd-salary-row">
                  <span className="rd-salary-exp">{s.experience}</span>
                  <span className="rd-salary-val">{s.salary}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── FAQ ─────────────────────────── */}
          <section className="rd-section">
            <h2><HelpCircle size={22} className="text-purple"/> Frequently Asked Questions</h2>
            <div className="rd-faq-list">
              {faq.map((item, i) => (
                <div key={i} className={`rd-faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="rd-faq-q">
                    {item.q}
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  {openFaq === i && <div className="rd-faq-a">{item.a}</div>}
                </div>
              ))}
            </div>
          </section>

          <RelatedResources items={[
            { title: 'Interview Questions', description: `Top interview questions for ${seo.title.split(' Roadmap')[0]}`, url: `/interview-questions/${slug}`, icon: '🎤' },
            { title: 'Salary Guide', description: `Explore salaries for ${seo.title.split(' Roadmap')[0]}`, url: `/salary-guides/${slug}`, icon: '💰' },
            { title: 'Career Guide', description: `In-depth career advice for ${seo.title.split(' Roadmap')[0]}`, url: `/career-guides/${slug}`, icon: '📈' }
          ]} />

        </main>

        <aside className="rd-sidebar">
          {/* CTA Box */}
          <div className="rd-sticky-cta">
            <h3>Get Started Today</h3>
            <p>Don't just read the roadmap—take action. Build your professional, ATS-friendly resume right now.</p>
            <Link to="/live-editor" className="btn btn-primary mb-3 text-center">Create Resume with AI</Link>
            <Link to="/analyze" className="btn btn-secondary mb-3 text-center">Check ATS Score</Link>
            <Link to="/interview-sim" className="btn btn-secondary text-center">Mock Interview</Link>
          </div>
          
          {/* Certifications Box */}
          <div className="card mt-24">
            <h3>Top Certifications</h3>
            <ul className="rd-list mt-3">
              {certifications.map((cert, i) => <li key={i}>{cert}</li>)}
            </ul>
          </div>
          
          {/* Market Insights */}
          <div className="card mt-24">
            <h3>Job Market Outlook</h3>
            <p className="text-sm mt-3 text-muted"><strong>Demand:</strong> {jobMarket.futureDemand}</p>
            <p className="text-sm mt-3 text-muted"><strong>Remote:</strong> {jobMarket.remoteOpportunities}</p>
          </div>
        </aside>

      </div>
    </div>
  );
}
