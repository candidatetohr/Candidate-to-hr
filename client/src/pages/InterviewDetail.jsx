import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { Helmet } from 'react-helmet-async';
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

  if (loading) return <div className="p-12 text-center text-slate-400">Loading questions...</div>;
  if (!data) return <div className="p-12 text-center text-slate-400">Questions not found. <Link to="/interview-questions" className="text-blue-500">Go back</Link></div>;

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderQuestionBlock = (questions, level) => {
    if (!questions || questions.length === 0) return null;
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 capitalize border-b border-slate-700 pb-2">{level} Questions</h2>
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
                <div className="int-q-answer mt-4 text-slate-300 bg-slate-800 p-4 rounded-lg">
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
    <div className="int-detail-page max-w-7xl mx-auto px-6 py-8">
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

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{data.hero.title}</h1>
        <p className="text-lg text-slate-400 max-w-3xl">{data.hero.description}</p>
        
        <div className="mt-6 flex items-center gap-4">
          <label className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg cursor-pointer border border-slate-700">
            <input 
              type="checkbox" 
              checked={practiceMode} 
              onChange={() => {
                setPracticeMode(!practiceMode);
                setRevealed({}); // reset revealed state
              }} 
            />
            <span className="font-semibold text-blue-400">Practice Mode (Hide Answers)</span>
          </label>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
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
