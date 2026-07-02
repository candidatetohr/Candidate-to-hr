import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QuickLinks from '../components/seo/QuickLinks';
import RelatedResources from '../components/seo/RelatedResources';
import { AdBanner, SidebarAd, InlineAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, MockInterviewCTA } from '../components/cta/PlatformCTAs';
import { TrendingUp, MapPin, Briefcase, LineChart, Award } from 'lucide-react';
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

import './SalaryDetail.css';

export default function SalaryDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import(`../data/salaryGuides/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-48 text-center text-secondary">Loading salary data...</div>;
  if (!data) return <div className="p-48 text-center text-secondary">Salary data not found. <Link to="/salary-guides" className="color-primary">Go back</Link></div>;

  const { seo, hero, experience, byCity, topCompanies, byStack, skillsThatIncreaseSalary, skillsThatIncraseSalary, futureOutlook, marketAnalysis, careerPath, industryTrends, negotiationTips, certificationsAndSkills, faq, quickLinks } = data;
  const skillsData = skillsThatIncreaseSalary || skillsThatIncraseSalary;

  return (
    <div className="sal-detail-page container-standard px-6 py-8">
      <ReadingProgress />
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={`/salary-guides/${slug}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Salary Guides', url: '/salary-guides' },
          { name: hero.title, url: `/salary-guides/${slug}` }
        ]}
      />
      <SchemaMarkup
        type="Article"
        data={{
          title: seo.title,
          description: seo.description,
          url: `https://candidatetohr.online/salary-guides/${slug}`,
          datePublished: hero.date || '2026-01-01'
        }}
      />
      <SchemaMarkup
        type="Dataset"
        data={{
          name: `${hero.title} Dataset`,
          description: `Compensation and salary data for ${hero.title.replace(' Salary Guide 2026', '')} showing base salaries, geographic distribution, and top paying companies.`,
          url: `https://candidatetohr.online/salary-guides/${slug}`
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

      <header className="mb-32 border-b border-default pb-32 text-center">
        <h1 className="text-4xl font-bold mb-16">{hero.title}</h1>
        <p className="text-lg text-secondary container-seo">{hero.description}</p>
        <AuthorInfo date={hero.date} author={hero.author} />
        <ShareButtons title={seo.title} />
        
        <div className="mt-32 bg-slate-800/50 border border-amber-500/20 inline-block px-10 py-6">
          <div className="text-sm color-warning font-bold uppercase tracking-widest mb-8">Average Base Salary</div>
          <div className="text-5xl font-black text-inverse">{hero.averageSalary}</div>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-32">
        <main className="lg:col-span-2">
          <TableOfContents contentSelector="main" />
          
          <AIOverviewBox
            definition={hero.description}
            quickAnswer={`The average base salary for this role is ${hero.averageSalary}. Growth is projected strongly in the near future.`}
            stats={{
              "Average Base Salary": hero.averageSalary,
              "Hiring Status": "Highly Demanded"
            }}
            takeaways={skillsData}
          />
          
          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-24 flex items-center gap-8"><TrendingUp className="color-warning"/> Salary by Experience</h2>
            <div className="sal-table-wrapper">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Experience Level</th>
                    <th>Average Salary Range</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((exp, i) => (
                    <tr key={i}>
                      <td className="font-bold text-inverse">{exp.level}</td>
                      <td className="color-warning font-bold">{exp.salary}</td>
                      <td className="text-sm text-secondary">{exp.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <InlineAd />

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-24 flex items-center gap-8"><MapPin className="color-primary"/> Salary by Top Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {byCity.map((city, i) => (
                <div key={i} className="bg-slate-800/50 border border-default p-24 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-inverse">{city.city}</div>
                    <div className="text-sm text-secondary">City Premium: <span className={city.premium.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{city.premium}</span></div>
                  </div>
                  <div className="text-xl font-bold color-primary">{city.salary}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-48">
            <h2 className="text-2xl font-bold mb-24 flex items-center gap-8"><Briefcase className="text-purple-400"/> Top Paying Companies</h2>
            <div className="sal-table-wrapper">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Category</th>
                    <th>Salary Range</th>
                  </tr>
                </thead>
                <tbody>
                  {topCompanies.map((comp, i) => (
                    <tr key={i}>
                      <td className="font-bold text-inverse">{comp.company}</td>
                      <td className="text-sm text-secondary"><span className="bg-surface px-2 py-1 rounded text-xs">{comp.type}</span></td>
                      <td className="text-purple-400 font-bold">{comp.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {byStack && byStack.length > 0 && (
            <section className="mb-48">
              <h2 className="text-2xl font-bold mb-24 flex items-center gap-8"><Briefcase className="text-blue-400"/> Salary by Tech Stack</h2>
              <div className="sal-table-wrapper">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Tech Stack</th>
                      <th>Avg. Salary</th>
                      <th>Demand</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byStack.map((s, i) => (
                      <tr key={i}>
                        <td className="font-bold text-inverse">{s.stack}</td>
                        <td className="color-warning font-bold">{s.averageSalary}</td>
                        <td><span className="bg-surface px-2 py-1 rounded text-xs">{s.demandLevel}</span></td>
                        <td className="text-sm text-secondary">{s.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {skillsData && skillsData.length > 0 && (
            <section className="mb-48">
              <h2 className="text-2xl font-bold mb-24 flex items-center gap-8"><Award className="text-yellow-400"/> Skills That Increase Salary</h2>
              <div className="sal-table-wrapper">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Salary Impact</th>
                      <th>Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillsData.map((s, i) => (
                      <tr key={i}>
                        <td className="font-bold text-inverse">{s.skill}</td>
                        <td className="text-green-400 font-bold">{s.salaryImpact}</td>
                        <td className="text-sm text-secondary">{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mb-48 bg-blue-900/20 border border-blue-500/20 p-32">
            <h2 className="text-2xl font-bold mb-16 color-primary">Future Outlook (2026-2028)</h2>
            <p className="text-lg text-primary leading-relaxed">{futureOutlook}</p>
          </section>

          {marketAnalysis && (
            <section className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 flex items-center gap-8"><LineChart className="text-green-400"/> Market Analysis</h2>
              <div className="prose text-secondary"><ReactMarkdown>{marketAnalysis}</ReactMarkdown></div>
            </section>
          )}

          {industryTrends && (
            <section className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 flex items-center gap-8"><TrendingUp className="text-blue-400"/> Industry Trends</h2>
              <div className="prose text-secondary"><ReactMarkdown>{industryTrends}</ReactMarkdown></div>
            </section>
          )}

          {careerPath && (
            <section className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 flex items-center gap-8"><MapPin className="text-purple-400"/> Career Path & Progression</h2>
              <div className="prose text-secondary"><ReactMarkdown>{careerPath}</ReactMarkdown></div>
            </section>
          )}

          {certificationsAndSkills && (
            <section className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 flex items-center gap-8"><Award className="text-yellow-400"/> Certifications & Skills</h2>
              <div className="prose text-secondary"><ReactMarkdown>{certificationsAndSkills}</ReactMarkdown></div>
            </section>
          )}

          {negotiationTips && (
            <section className="mb-48 content-long-form">
              <h2 className="text-2xl font-bold mb-16 flex items-center gap-8"><Briefcase className="text-red-400"/> Salary Negotiation Tips</h2>
              <div className="prose text-secondary"><ReactMarkdown>{negotiationTips}</ReactMarkdown></div>
            </section>
          )}

          <CareerKnowledgeGraphCard roleId={slug.replace('-salary-guide-2026', '').replace('-us', '').replace('-india', '')} />
          
          <FAQAccordion items={faq} />

          <RelatedResources items={[
            { title: 'Interview Questions', description: `Top interview questions`, url: `/interview-questions/${slug.replace('-salary-guide-2026', '').replace('-us', '').replace('-india', '')}`, icon: '🎤' },
            { title: 'Learning Roadmap', description: `Step-by-step career path`, url: `/roadmaps/${slug.replace('-salary-guide-2026', '').replace('-us', '').replace('-india', '')}`, icon: '🗺️' },
            { title: 'Career Guide', description: `In-depth career advice`, url: `/career-guides/${slug.replace('-salary-guide-2026', '').replace('-us', '').replace('-india', '')}`, icon: '📈' }
          ]} />

        </main>
        
        <aside className="space-y-6">
          <CareerGraphSidebar currentType="salary" currentSlug={slug} />
        </aside>
      </div>
      <BackToTop />
    </div>
  );
}
