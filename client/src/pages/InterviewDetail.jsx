import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QuickLinks from '../components/seo/QuickLinks';
import RelatedResources from '../components/seo/RelatedResources';
import { AdBanner, InlineAd, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import AuthorInfo from '../components/seo/AuthorInfo';
import './InterviewDetail.css';

export default function InterviewDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    import(`../data/interviewQuestions/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-48 text-center text-secondary">Loading questions...</div>;
  if (!data) return <div className="p-48 text-center text-secondary">Questions not found. <Link to="/interview-questions" className="color-primary">Go back</Link></div>;

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getNormalizedQuestions = (data) => {
    if (!data) return [];
    if (data.categories) {
      return data.categories.flatMap(c => c.questions || []);
    }
    if (data.questions && Array.isArray(data.questions)) {
      return data.questions;
    }
    if (data.questions && typeof data.questions === 'object') {
      return [
        ...(data.questions.beginner || []),
        ...(data.questions.intermediate || []),
        ...(data.questions.advanced || []),
        ...(data.questions.scenarioBased || []),
        ...(data.questions.scenario || []),
        ...(data.questions.expert || []),
        ...(data.questions.practical || [])
      ];
    }
    return [];
  };


  const allQuestions = getNormalizedQuestions(data);
  const filteredQuestions = allQuestions.filter(q => 
    (q.q && q.q.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (q.a && q.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const currentQuestions = filteredQuestions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderQuestions = () => {
    if (currentQuestions.length === 0) {
      return <div className="text-center text-secondary py-32">No questions found matching your search.</div>;
    }
    return (
      <div className="mb-48">
        <div className="flex items-center justify-between mb-24 border-b border-default pb-8">
          <h2 className="text-2xl font-bold">Interview Questions</h2>
          <span className="text-sm text-secondary">{filteredQuestions.length} questions</span>
        </div>
        {currentQuestions.map((q, i) => {
          const isRevealed = !practiceMode || revealed[q.id];
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + i + 1;
          return (
            <div key={q.id || i} className="int-q-card">
              <div className="int-q-header">
                <h3>{globalIndex}. {q.q}</h3>
                {practiceMode && (
                  <button onClick={() => toggleReveal(q.id)} className="reveal-btn">
                    {isRevealed ? <EyeOff size={16}/> : <Eye size={16}/>}
                    {isRevealed ? 'Hide Answer' : 'Show Answer'}
                  </button>
                )}
              </div>
              {isRevealed && (
                <div className="int-q-answer mt-16 text-primary bg-card p-16">
                  {q.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="int-detail-page container-standard px-6 py-8">
      <Helmet>
        <title>{data.seo?.title || data.hero.title}</title>
        <meta name="description" content={data.seo?.description || data.hero.description} />
        {data.seo?.keywords && <meta name="keywords" content={data.seo.keywords} />}
        <link rel="canonical" href={`https://candidatetohr.online/interview-questions/${slug}`} />
        <meta property="og:url" content={`https://candidatetohr.online/interview-questions/${slug}`} />
        <meta property="og:title" content={data.seo?.ogTitle || data.hero.title} />
        <meta property="og:description" content={data.seo?.ogDescription || data.hero.description} />
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
      <SchemaMarkup type="FAQPage" data={allQuestions} />
      
      <Breadcrumbs />
      {data.quickLinks && <QuickLinks links={data.quickLinks} />}

      <header className="mb-32 text-center content-long-form container-seo">
        <h1 className="text-4xl font-bold mt-24 mb-16">{data.hero.title}</h1>
        <p className="text-lg text-secondary">{data.hero.description}</p>
        
        <AuthorInfo date={data.hero.date} author={data.hero.author} />

        <div className="mt-24 flex items-center justify-center gap-16 pb-32 border-b border-default">
          <label className="flex items-center gap-8 bg-card px-16 py-8 cursor-pointer border border-default" style={{borderRadius: 'var(--radius-full)'}}>
            <input 
              type="checkbox" 
              checked={practiceMode} 
              onChange={() => {
                setPracticeMode(!practiceMode);
                setRevealed({}); // reset revealed state
              }} 
            />
            <span className="font-semibold color-primary">Practice Mode (Hide Answers)</span>
          </label>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-32">
        <main className="lg:col-span-2">
          <div className="mb-24">
            <div className="int-search-bar">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button className="int-search-clear" onClick={() => { setSearchQuery(''); setCurrentPage(1); }} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          {renderQuestions()}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-32 mb-48 border-t border-default pt-24">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
              >
                ← Previous
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
              >
                Next →
              </button>
            </div>
          )}

          <RelatedResources items={[
            { title: 'Salary Guide', description: `Explore salaries for ${data.hero?.title || 'this role'}`, url: `/salary-guides/${slug}`, icon: '💰' },
            { title: 'Learning Roadmap', description: `Step-by-step career path`, url: `/roadmaps/${slug}`, icon: '🗺️' },
            { title: 'Career Guide', description: `In-depth career advice`, url: `/career-guides/${slug}`, icon: '📈' }
          ]} />

          <InlineAd />
        </main>
        
        <aside className="space-y-6">
          <MockInterviewCTA />
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
