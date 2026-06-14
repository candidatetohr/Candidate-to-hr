import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEO from '../components/SEO';
import { AdBanner, SidebarAd, InlineAd } from '../components/monetization/Ads';
import { ATSCheckerCTA, MockInterviewCTA } from '../components/cta/PlatformCTAs';
import { TrendingUp, MapPin, Briefcase } from 'lucide-react';
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

  if (loading) return <div className="p-12 text-center text-slate-400">Loading salary data...</div>;
  if (!data) return <div className="p-12 text-center text-slate-400">Salary data not found. <Link to="/salary-guides" className="text-blue-500">Go back</Link></div>;

  const { seo, hero, experience, byCity, topCompanies, futureOutlook } = data;

  return (
    <div className="sal-detail-page max-w-7xl mx-auto px-6 py-8">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
      </Helmet>
      <SchemaMarkup type="Article" data={{ title: seo.title, description: seo.description }} />
      <Breadcrumbs />

      <header className="mb-8 border-b border-slate-800 pb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">{hero.description}</p>
        
        <div className="mt-8 bg-slate-800/50 border border-amber-500/20 inline-block px-10 py-6 rounded-2xl">
          <div className="text-sm text-amber-500 font-bold uppercase tracking-widest mb-2">Average Base Salary</div>
          <div className="text-5xl font-black text-white">{hero.averageSalary}</div>
        </div>
      </header>

      <AdBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <main className="lg:col-span-2">
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-amber-500"/> Salary by Experience</h2>
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
                      <td className="font-bold text-white">{exp.level}</td>
                      <td className="text-amber-400 font-bold">{exp.salary}</td>
                      <td className="text-sm text-slate-400">{exp.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <InlineAd />

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-blue-400"/> Salary by Top Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {byCity.map((city, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-white">{city.city}</div>
                    <div className="text-sm text-slate-400">City Premium: <span className={city.premium.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{city.premium}</span></div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">{city.salary}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-purple-400"/> Top Paying Companies</h2>
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
                      <td className="font-bold text-white">{comp.company}</td>
                      <td className="text-sm text-slate-400"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{comp.type}</span></td>
                      <td className="text-purple-400 font-bold">{comp.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12 bg-blue-900/20 border border-blue-500/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Future Outlook (2026-2028)</h2>
            <p className="text-lg text-slate-300 leading-relaxed">{futureOutlook}</p>
          </section>

        </main>
        
        <aside className="space-y-6">
          <ATSCheckerCTA />
          <MockInterviewCTA />
          <SidebarAd />
        </aside>
      </div>
    </div>
  );
}
