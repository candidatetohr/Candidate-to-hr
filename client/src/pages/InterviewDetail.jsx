import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEO from '../components/SEO';
import { AdBanner, InlineAd, SidebarAd } from '../components/monetization/Ads';
import { MockInterviewCTA } from '../components/cta/PlatformCTAs';
import { Eye, EyeOff } from 'lucide-react';
import './InterviewDetail.css';

export default function InterviewDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealed, setRevealed] = useState({});

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

  const renderQuestionBlock = (questions, level) => {
    if (!questions || questions.length === 0) return null;
    return (
      <div className="mb-48">
        <h2 className="text-2xl font-bold mb-24 capitalize border-b border-default pb-8">{level} Questions</h2>
        {questions.map((q, i) => {
          const isRevealed = !practiceMode || revealed[q.id];
          return (
            <div key={q.id} className="int-q-card">
              <div className="int-q-header">
                <h3>{i + 1}. {q.q}</h3>
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
        <meta property="og:title" content={data.seo?.ogTitle || data.hero.title} />
        <meta property="og:description" content={data.seo?.ogDescription || data.hero.description} />
      </Helmet>
      <SchemaMarkup type="FAQPage" data={[
        ...(data.questions.beginner || []),
        ...(data.questions.intermediate || []),
        ...(data.questions.advanced || [])
      ]} />
      
      <Breadcrumbs />

      <header className="mb-32 text-center content-long-form container-seo">
        <h1 className="text-4xl font-bold mt-24 mb-16">{data.hero.title}</h1>
        <p className="text-lg text-secondary">{data.hero.description}</p>
        
        <div className="author-block flex items-center justify-center gap-16 mt-24 mb-16">
          <div className="author-avatar" style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span className="font-bold text-primary">HR</span>
          </div>
          <div className="author-info text-left">
            <div className="font-bold">CandidateToHR Career Experts</div>
            <div className="text-sm text-secondary">Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

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
          {renderQuestionBlock(data.questions.beginner, 'Beginner')}
          <InlineAd />
          {renderQuestionBlock(data.questions.intermediate, 'Intermediate')}
          {renderQuestionBlock(data.questions.advanced, 'Advanced')}
        </main>
        
        <aside className="space-y-6">
          <MockInterviewCTA />
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
