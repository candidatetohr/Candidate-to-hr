import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QuickLinks from '../components/seo/QuickLinks';
import { AdBanner, SidebarAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, ResumeBuilderCTA } from '../components/cta/PlatformCTAs';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AuthorInfo from '../components/seo/AuthorInfo';
import ReactMarkdown from 'react-markdown';

// SEO Upgrade Widgets
import ReadingProgress from '../components/seo/ReadingProgress';
import TableOfContents from '../components/seo/TableOfContents';
import ShareButtons from '../components/seo/ShareButtons';
import BackToTop from '../components/seo/BackToTop';
import CareerGraphSidebar from '../components/seo/CareerGraphSidebar';
import CareerKnowledgeGraphCard from '../components/seo/CareerKnowledgeGraphCard';
import AIOverviewBox from '../components/seo/AIOverviewBox';
import FAQAccordion from '../components/seo/FAQAccordion';
import AIRecommendations from '../components/seo/AIRecommendations';

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

  if (loading) return <div className="p-48 text-center text-secondary">Loading template...</div>;
  if (!data) return <div className="p-48 text-center text-secondary">Template not found. <Link to="/resume-examples" className="color-primary">Go back</Link></div>;

  const { seo, hero, score, keywords, mistakes, tips, exampleResume, extendedContent, faq, quickLinks } = data;

  return (
    <div className="res-detail-page container-standard px-6 py-8">
      <ReadingProgress />
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={`/resume-examples/${slug}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Resume Examples', url: '/resume-examples' },
          { name: hero.title, url: `/resume-examples/${slug}` }
        ]}
      />
      <SchemaMarkup
        type="Article"
        data={{
          title: seo.title,
          description: seo.description,
          url: `https://candidatetohr.online/resume-examples/${slug}`,
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

      <header className="mb-32 border-b border-default pb-32 text-center content-long-form container-seo">
        <h1 className="text-4xl font-bold mt-24 mb-16">{hero.title}</h1>
        <p className="text-lg text-secondary">{hero.description}</p>
        <AuthorInfo date={hero.date} author={hero.author} />
        <ShareButtons title={seo.title} />
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-32">
        <main className="lg:col-span-2">
          <TableOfContents contentSelector="main" />
          
          <AIOverviewBox
            definition={hero.description}
            quickAnswer={`Get a perfect ATS score of ${score.atsScore}/100. Incorporate our keyword suggestions and avoid common resume mistakes.`}
            stats={{
              "Average ATS Score": `${score.atsScore}/100`,
              "Readability": score.readability,
              "Keyword Match": score.keywordMatch
            }}
            takeaways={keywords.slice(0, 8)}
          />
          
          <div className="res-score-panel mb-32">
            <div className="score-circle">
              <span className="score-num">{score.atsScore}</span>
              <span className="score-txt">ATS Score</span>
            </div>
            <div className="score-metrics">
              <div><strong>Readability:</strong> <span className="color-success">{score.readability}</span></div>
              <div><strong>Keywords:</strong> <span className="color-success">{score.keywordMatch}</span></div>
            </div>
          </div>

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-16">Top Resume Keywords</h2>
            <div className="flex flex-wrap gap-8">
              {keywords.map((kw, i) => <span key={i} className="res-keyword">{kw}</span>)}
            </div>
          </section>

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-16 color-error flex items-center gap-8"><XCircle/> Common Mistakes</h2>
            <ul className="space-y-3">
              {mistakes.map((m, i) => (
                <li key={i} className="flex gap-3 text-primary">
                  <AlertTriangle className="color-error shrink-0 mt-1" size={18}/> {m}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-16 color-success flex items-center gap-8"><CheckCircle/> Best Practices</h2>
            <ul className="space-y-3">
              {tips.map((t, i) => (
                <li key={i} className="flex gap-3 text-primary">
                  <CheckCircle className="color-success shrink-0 mt-1" size={18}/> {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-24 border-b border-default pb-8">100/100 Resume Example</h2>
            <div className="res-a4-mockup">
              <h1 className="text-center text-2xl font-bold text-black">{exampleResume.name}</h1>
              <p className="text-center text-slate-700 text-sm mb-16">{exampleResume.title}</p>
              
              <div className="mb-16">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Summary</h3>
                <p className="text-sm text-black">{exampleResume.summary}</p>
              </div>

              <div className="mb-16">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Experience</h3>
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

              <div className="mb-16 text-sm text-black">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Education</h3>
                {exampleResume.education.map((edu, i) => (
                  <div key={i} className="flex justify-between">
                    <span><strong>{edu.degree}</strong>, {edu.school}</span>
                    <span>{edu.date}</span>
                  </div>
                ))}
              </div>

              <div className="mb-16 text-sm text-black">
                <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Skills</h3>
                <p>{exampleResume.skills}</p>
              </div>
              {exampleResume.certifications && exampleResume.certifications.length > 0 && (
                <div className="mb-16 text-sm text-black">
                  <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Certifications</h3>
                  <ul className="list-disc pl-5">
                    {exampleResume.certifications.map((cert, i) => <li key={i}>{typeof cert === 'string' ? cert : `${cert.name} - ${cert.issuer}`}</li>)}
                  </ul>
                </div>
              )}

              {exampleResume.projects && exampleResume.projects.length > 0 && (
                <div className="mb-16 text-sm text-black">
                  <h3 className="border-b-2 border-black font-bold text-black uppercase text-sm mb-8">Projects</h3>
                  {exampleResume.projects.map((proj, i) => (
                    <div key={i} className="mb-3">
                      <strong>{proj.name}</strong>
                      <p>{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {extendedContent && extendedContent.map((section, idx) => (
            <section key={idx} className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 text-blue-400">{section.heading}</h2>
              <div className="prose max-w-none text-secondary">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}

          <CareerKnowledgeGraphCard roleId={slug} />
          
          <FAQAccordion items={faq} />

          <AIRecommendations roleId={slug} />

        </main>
        
        <aside className="space-y-6">
          <CareerGraphSidebar currentType="resume" currentSlug={slug} />
        </aside>
      </div>
      <BackToTop />
    </div>
  );
}
