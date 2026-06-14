import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEO from '../components/SEO';
import { AdBanner, SidebarAd, InlineAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, MockInterviewCTA } from '../components/cta/PlatformCTAs';
import ReactMarkdown from 'react-markdown';
import './CareerGuideDetail.css';

export default function CareerGuideDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import(`../data/careerGuides/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading guide...</div>;
  if (!data) return <div className="p-12 text-center text-slate-400">Guide not found. <Link to="/career-guides" className="text-blue-500">Go back</Link></div>;

  const { seo, hero, sections, resources } = data;

  return (
    <div className="guide-detail-page max-w-7xl mx-auto px-6 py-8">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
      </Helmet>
      <SchemaMarkup type="Article" data={{ title: seo.title, description: seo.description }} />
      <Breadcrumbs />

      <header className="mb-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 leading-tight">{hero.title}</h1>
        <p className="text-xl text-slate-400 mb-6">{hero.description}</p>
        <div className="flex justify-center items-center gap-4 text-sm text-slate-500">
          <span>By <strong>{hero.author}</strong></span>
          <span>•</span>
          <span>{hero.date}</span>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        <main className="lg:col-span-2 article-content">
          
          {sections.map((section, idx) => (
            <section key={idx} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-fuchsia-400">{section.heading}</h2>
              <div className="prose max-w-none prose-lg text-slate-300">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
              
              {/* Insert inline ad after the 2nd section */}
              {idx === 1 && <div className="my-10"><InlineAd /></div>}
            </section>
          ))}

          <section className="mt-16 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Recommended Resources</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-300">
              {resources.map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>
          </section>

        </main>
        
        <aside className="space-y-8">
          <div className="sticky top-24 space-y-8">
            <ATSCheckerCTA />
            <SidebarAd />
            <MockInterviewCTA />
          </div>
        </aside>
      </div>
    </div>
  );
}
