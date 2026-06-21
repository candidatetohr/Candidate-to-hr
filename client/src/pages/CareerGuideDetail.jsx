import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEO from '../components/SEO';
import RelatedResources from '../components/seo/RelatedResources';
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

  if (loading) return <div className="p-48 text-center text-secondary">Loading guide...</div>;
  if (!data) return <div className="p-48 text-center text-secondary">Guide not found. <Link to="/career-guides" className="color-primary">Go back</Link></div>;

  const { seo, hero, sections, resources, faq } = data;

  return (
    <div className="guide-detail-page container-standard px-6 py-8">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <link rel="canonical" href={`https://candidatetohr.online/career-guides/${slug}`} />
        <meta property="og:url" content={`https://candidatetohr.online/career-guides/${slug}`} />
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
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
      <SchemaMarkup type="Article" data={{ title: seo.title, description: seo.description }} />
      <Breadcrumbs />

      <header className="mb-48 text-center content-long-form container-seo">
        <h1 className="text-5xl font-bold mt-24 mb-24 leading-tight">{hero.title}</h1>
        <p className="text-xl text-secondary mb-24">{hero.description}</p>
        
        <div className="author-block flex items-center justify-center gap-16 mt-24 pb-32 border-b border-default">
          <div className="author-avatar" style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span className="font-bold text-primary">{hero.author ? hero.author.charAt(0) : 'HR'}</span>
          </div>
          <div className="author-info text-left">
            <div className="font-bold">{hero.author || 'CandidateToHR Career Experts'}</div>
            <div className="text-sm text-secondary">Updated {hero.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-48 mt-48">
        <main className="lg:col-span-2 article-content">
          
          {sections.map((section, idx) => (
            <section key={idx} className="mb-48">
              <h2 className="text-3xl font-bold mb-24 text-fuchsia-400">{section.heading}</h2>
              <div className="prose max-w-none prose-lg text-primary">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
              
              {/* Insert inline ad after the 2nd section */}
              {idx === 1 && <div className="my-10"><InlineAd /></div>}
            </section>
          ))}

          {resources && resources.length > 0 && (
            <section className="mt-64 bg-slate-800/50 p-32 border border-default">
              <h2 className="text-2xl font-bold mb-16">Recommended Resources</h2>
              <ul className="list-disc pl-6 space-y-3 text-primary">
                {resources.map((res, i) => (
                  <li key={i}>{res}</li>
                ))}
              </ul>
            </section>
          )}

          {faq && faq.length > 0 && (
            <section className="mt-48 mb-48">
              <h2 className="text-2xl font-bold mb-16">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faq.map((item, idx) => (
                  <div key={idx} className="bg-surface p-6 border border-default rounded">
                    <h3 className="font-bold text-lg mb-2 color-primary">{item.q}</h3>
                    <p className="text-secondary">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RelatedResources items={[
            { title: 'Interview Questions', description: `Top interview questions`, url: `/interview-questions/${slug}`, icon: '🎤' },
            { title: 'Learning Roadmap', description: `Step-by-step career path`, url: `/roadmaps/${slug}`, icon: '🗺️' },
            { title: 'Salary Guide', description: `Explore salary data`, url: `/salary-guides/${slug}`, icon: '💰' }
          ]} />

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
