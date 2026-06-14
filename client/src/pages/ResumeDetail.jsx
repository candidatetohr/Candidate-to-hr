import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEO from '../components/SEO';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import './ResumeDetail.css';

export default function ResumeDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import(`../data/resumeExamples/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading template...</div>;
  if (!data) return <div className="p-12 text-center text-slate-400">Template not found. <Link to="/resume-examples" className="text-blue-500">Go back</Link></div>;

  const { seo, hero, score, keywords, mistakes, tips, exampleResume } = data;

  return (
    <div className="res-detail-page max-w-7xl mx-auto px-6 py-8">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
      </Helmet>
      <SchemaMarkup type="Article" data={{ title: seo.title, description: seo.description }} />
      <Breadcrumbs />

      <header className="mb-8 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
        <p className="text-lg text-slate-400 max-w-3xl">{hero.description}</p>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <main className="lg:col-span-2">
          
          <div className="res-score-panel mb-8">
            <div className="score-circle">
              <span className="score-num">{score.atsScore}</span>
              <span className="score-txt">ATS Score</span>
            </div>
            <div className="score-metrics">
              <div><strong>Readability:</strong> <span className="text-green-400">{score.readability}</span></div>
              <div><strong>Keywords:</strong> <span className="text-green-400">{score.keywordMatch}</span></div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Top Resume Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => <span key={i} className="res-keyword">{kw}</span>)}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-2"><XCircle/> Common Mistakes</h2>
            <ul className="space-y-3">
              {mistakes.map((m, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <AlertTriangle className="text-red-400 shrink-0 mt-1" size={18}/> {m}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2"><CheckCircle/> Best Practices</h2>
            <ul className="space-y-3">
              {tips.map((t, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <CheckCircle className="text-green-400 shrink-0 mt-1" size={18}/> {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">100/100 Resume Example</h2>
            <div className="res-a4-mockup">
              <h1 className="text-center text-2xl font-bold text-black">{exampleResume.name}</h1>
              <p className="text-center text-slate-700 text-sm mb-4">{exampleResume.title}</p>
              
              <div className="mb-4">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-2">Summary</h3>
                <p className="text-sm text-black">{exampleResume.summary}</p>
              </div>

              <div className="mb-4">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-2">Experience</h3>
                {exampleResume.experience.map((exp, i) => (
                  <div key={i} className="mb-3 text-sm text-black">
                    <div className="flex justify-between font-bold">
                      <span>{exp.role}</span>
                      <span>{exp.date}</span>
                    </div>
                    <div className="italic mb-1">{exp.company}</div>
                    <ul className="list-disc pl-5">
                      {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-4 text-sm text-black">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-2">Education</h3>
                {exampleResume.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.degree}</strong>, {edu.school}</span>
                    <span>{edu.date}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 text-sm text-black">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-2">Skills</h3>
                <p>{exampleResume.skills}</p>
              </div>
            </div>
          </section>

        </main>
        
        <aside className="space-y-6">
          <ATSCheckerCTA />
          <ResumeBuilderCTA />
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
