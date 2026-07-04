import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QuickLinks from '../components/seo/QuickLinks';
import RelatedResources from '../components/seo/RelatedResources';
import { AdBanner, SidebarAd, InlineAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, MockInterviewCTA } from '../components/cta/PlatformCTAs';
import AuthorInfo from '../components/seo/AuthorInfo';
import SafeMarkdown from '../components/seo/SafeMarkdown';

// SEO Upgrade Widgets
import ReadingProgress from '../components/seo/ReadingProgress';
import TableOfContents from '../components/seo/TableOfContents';
import ShareButtons from '../components/seo/ShareButtons';
import BackToTop from '../components/seo/BackToTop';
import CareerGraphSidebar from '../components/seo/CareerGraphSidebar';
import CareerKnowledgeGraphCard from '../components/seo/CareerKnowledgeGraphCard';
import CareerKnowledgeGraph from '../services/CareerKnowledgeGraph';
import AIOverviewBox from '../components/seo/AIOverviewBox';
import FAQAccordion from '../components/seo/FAQAccordion';
import AIRecommendations from '../components/seo/AIRecommendations';

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

  const { seo, hero, sections, resources, faq, quickLinks } = data;

  return (
    <div className="guide-detail-page container-standard px-6 py-8">
      <ReadingProgress />
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={`/career-guides/${slug}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Career Guides', url: '/career-guides' },
          { name: hero.title, url: `/career-guides/${slug}` }
        ]}
      />
      <SchemaMarkup
        type="Article"
        data={{
          title: seo.title,
          description: seo.description,
          url: `https://candidatetohr.online/career-guides/${slug}`,
          datePublished: hero.date || '2026-01-01'
        }}
      />
      {faq && faq.length > 0 && (
        <SchemaMarkup
          type="FAQPage"
          data={faq}
        />
      )}
      <Breadcrumbs />
      {quickLinks && <QuickLinks links={quickLinks} />}

      <header className="mb-48 text-center content-long-form container-seo">
        <h1 className="text-5xl font-bold mt-24 mb-24 leading-tight">{hero.title}</h1>
        <p className="text-xl text-secondary mb-24">{hero.description}</p>
        <AuthorInfo date={hero.date} author={hero.author} />
        <ShareButtons title={seo.title} />
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-48 mt-48">
        <main className="lg:col-span-2 article-content">
          <TableOfContents contentSelector="main" />
          
          <AIOverviewBox
            definition={hero.description}
            quickAnswer={`Learn how to establish a successful career route. Get expert advice and step-by-step guidance.`}
            stats={{
              "Guide Type": "Career Deep Dive",
              "Hiring Demand": "High Growth"
            }}
            takeaways={sections.map(s => s.heading)}
          />
          
          {sections.map((section, idx) => (
            <section key={idx} className="mb-48">
              <h2 className="text-3xl font-bold mb-24 text-fuchsia-400">{section.heading}</h2>
              <div className="prose max-w-none prose-lg text-primary">
                <SafeMarkdown>{section.content}</SafeMarkdown>
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

          <CareerKnowledgeGraphCard roleId={CareerKnowledgeGraph.getBySlug('careerGuide', slug)?.id || slug} />
          
          <FAQAccordion items={faq} />

          <AIRecommendations roleId={CareerKnowledgeGraph.getBySlug('careerGuide', slug)?.id || slug} />

          <RelatedResources items={[
            { title: 'Interview Questions', description: `Top interview questions`, url: `/interview-questions/${CareerKnowledgeGraph.getBySlug('careerGuide', slug)?.id || slug}`, icon: '🎤' },
            { title: 'Learning Roadmap', description: `Step-by-step career path`, url: `/roadmaps/${CareerKnowledgeGraph.getBySlug('careerGuide', slug)?.id || slug}`, icon: '🗺️' },
            { title: 'Salary Guide', description: `Explore salary data`, url: `/salary-guides/${CareerKnowledgeGraph.getBySlug('careerGuide', slug)?.id || slug}`, icon: '💰' }
          ]} />

        </main>
        
        <aside className="space-y-8">
          <CareerGraphSidebar currentType="careerGuide" currentSlug={slug} />
        </aside>
      </div>
      <BackToTop />
    </div>
  );
}
