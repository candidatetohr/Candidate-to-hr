import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import SafeMarkdown from '../components/seo/SafeMarkdown';
import { ChevronDown, ChevronUp, MapPin, Target, Zap, DollarSign, PenTool, CheckCircle, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import QuickLinks from '../components/seo/QuickLinks';
import RelatedResources from '../components/seo/RelatedResources';
import AuthorInfo from '../components/seo/AuthorInfo';

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
import SkillAssessmentQuiz from '../components/seo/SkillAssessmentQuiz';
import LearningJourneyCTA from '../components/seo/LearningJourneyCTA';
import InteractiveRoadmapTimeline from '../components/seo/InteractiveRoadmapTimeline';

import './RoadmapDetail.css';

export default function RoadmapDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // Dynamically load the roadmap JSON file
    import(`../data/roadmaps/${slug}.json`)
      .then((module) => {
        setData(module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Roadmap not found:", err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="rd-loading"><div className="spinner"></div>Loading Roadmap...</div>;
  }

  if (error || !data) {
    return (
      <div className="rd-error">
        <h2>Roadmap Not Found</h2>
        <p>We are still building the roadmap for "{slug}".</p>
        <Link to="/roadmaps" className="btn">Back to Hub</Link>
      </div>
    );
  }

  const { seo, hero, overview, skillsTimeline, learningPath, toolsAndTech, projects, certifications, salaryInsights, interviewPrep, jobMarket, faq, quickLinks, expertResources, keyConceptsDeepDive, communityAndPractice, comprehensiveDeepDive } = data;

  return (
    <div className="roadmap-detail-page">
      <ReadingProgress />
      {/* ─── SEO METADATA ─────────────────────────── */}
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={`/roadmaps/${slug}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Roadmaps', url: '/roadmaps' },
          { name: hero.title, url: `/roadmaps/${slug}` }
        ]}
      />
      <SchemaMarkup
        type="Article"
        data={{
          title: seo.title,
          description: seo.description,
          url: `https://candidatetohr.online/roadmaps/${slug}`,
          datePublished: hero.date || '2026-01-01'
        }}
      />
      {learningPath && learningPath.length > 0 && (
        <SchemaMarkup
          type="HowTo"
          data={{
            name: hero.title,
            description: hero.shortDescription,
            url: `https://candidatetohr.online/roadmaps/${slug}`,
            steps: learningPath
          }}
        />
      )}
      {faq && faq.length > 0 && (
        <SchemaMarkup
          type="FAQPage"
          data={faq}
        />
      )}

      {/* ─── HERO SECTION ─────────────────────────── */}
      <header className="rd-hero">
        <div className="container-seo content-long-form text-center">
          <Breadcrumbs />
          {quickLinks && <QuickLinks links={quickLinks} />}
          <h1 className="rd-hero-title mt-24 mb-16">{hero.title}</h1>
          <p className="rd-hero-subtitle max-w-2xl text-secondary">{hero.shortDescription}</p>
          
          <AuthorInfo date={hero.date} author={hero.author} />
          <ShareButtons title={seo.title} />
          
          <div className="rd-hero-stats">
            <div className="rd-stat-box">
              <span className="rd-stat-label">Avg Salary</span>
              <span className="rd-stat-value text-green">{hero.averageSalary}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Growth Rate</span>
              <span className="rd-stat-value">{hero.growthRate}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Duration</span>
              <span className="rd-stat-value">{hero.learningDuration}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Difficulty</span>
              <span className="rd-stat-value">{hero.difficultyLevel}</span>
            </div>
            <div className="rd-stat-box">
              <span className="rd-stat-label">Demand</span>
              <span className="rd-stat-value text-blue">{hero.hiringDemand}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-standard rd-layout">
        
        <main className="rd-main">
          <TableOfContents contentSelector=".rd-main" />
          
          <AIOverviewBox
            definition={overview.whatTheyDo}
            quickAnswer={hero.shortDescription}
            stats={{
              "Average Salary": hero.averageSalary,
              "Growth Rate": hero.growthRate,
              "Learning Duration": hero.learningDuration,
              "Difficulty Level": hero.difficultyLevel,
              "Hiring Demand": hero.hiringDemand
            }}
            takeaways={toolsAndTech}
          />
          {/* ─── OVERVIEW ─────────────────────────── */}
          <section className="rd-section">
            <h2><Target size={22} className="text-purple"/> Career Overview</h2>
            <div className="card">
              <p><strong>What they do:</strong> {overview.whatTheyDo}</p>
              <div className="mt-16">
                <strong>Top Industries Hiring:</strong>
                <div className="chips-container mt-8">
                  {overview.industriesHiring.map((ind, i) => <span key={i} className="chip">{ind}</span>)}
                </div>
              </div>
              <div className="mt-16">
                <strong>Core Responsibilities:</strong>
                <ul className="rd-list mt-8">
                  {overview.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── MONTH-BY-MONTH TIMELINE ─────────────────────────── */}
          <section className="rd-section">
            <h2><MapPin size={22} className="text-blue"/> Step-by-Step Learning Path</h2>
            <InteractiveRoadmapTimeline learningPath={learningPath} />
          </section>

          {/* ─── SKILLS & TOOLS ─────────────────────────── */}
          <section className="rd-section">
            <h2><Zap size={22} className="text-yellow"/> Skills & Tools Mastery</h2>
            <div className="rd-skills-grid">
              <div className="card">
                <h3>Beginner</h3>
                <ul className="rd-list">
                  {skillsTimeline.beginner.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3>Intermediate</h3>
                <ul className="rd-list">
                  {skillsTimeline.intermediate.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3>Advanced</h3>
                <ul className="rd-list">
                  {skillsTimeline.advanced.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="card mt-16">
              <h3>Essential Tools</h3>
              <div className="chips-container mt-8">
                {toolsAndTech.map((tool, i) => <span key={i} className="chip chip-outline">{tool}</span>)}
              </div>
            </div>
          </section>

          {/* ─── PROJECTS ─────────────────────────── */}
          <section className="rd-section">
            <h2><PenTool size={22} className="text-green"/> Project Ideas to Build</h2>
            <div className="rd-projects-grid">
              <div className="rd-project-col">
                <div className="rd-project-badge beginner">Beginner</div>
                <ul className="rd-list mt-3">
                  {projects.beginner.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="rd-project-col">
                <div className="rd-project-badge intermediate">Intermediate</div>
                <ul className="rd-list mt-3">
                  {projects.intermediate.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="rd-project-col">
                <div className="rd-project-badge advanced">Advanced</div>
                <ul className="rd-list mt-3">
                  {projects.advanced.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── INTERVIEW & RESUME PREP ─────────────────────────── */}
          <section className="rd-section">
            <h2><CheckCircle size={22} className="text-blue"/> Interview & Resume Prep</h2>
            <div className="card">
              <h3>Top Interview Questions</h3>
              <ul className="rd-list mt-8 mb-16">
                {interviewPrep.topQuestions.map((q, i) => <li key={i}><strong>Q:</strong> {q}</li>)}
              </ul>
              
              <h3>Common Mistakes to Avoid</h3>
              <ul className="rd-list mt-8 mb-16">
                {interviewPrep.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
              
              <h3>Resume & ATS Tips</h3>
              <div className="rd-resume-tips mt-8">
                <p><strong>Keywords to Include:</strong> {interviewPrep.resumeTips.keywords.join(', ')}</p>
                <p><strong>ATS Optimization:</strong> {interviewPrep.resumeTips.atsOptimization}</p>
              </div>
            </div>
          </section>

          {/* ─── SALARY INSIGHTS ─────────────────────────── */}
          <section className="rd-section">
            <h2><DollarSign size={22} className="text-green"/> Salary Insights</h2>
            <div className="rd-salary-table">
              {salaryInsights.map((s, i) => (
                <div key={i} className="rd-salary-row">
                  <span className="rd-salary-exp">{s.experience}</span>
                  <span className="rd-salary-val">{s.salary}</span>
                </div>
              ))}
            </div>
          </section>

          <CareerKnowledgeGraphCard roleId={slug} />
          
          <FAQAccordion items={faq} />

          {/* ─── KEY CONCEPTS DEEP DIVE ─────────────────────────── */}
          {keyConceptsDeepDive && keyConceptsDeepDive.length > 0 && (
            <section className="rd-section">
              <h2>🔬 Key Concepts Deep Dive</h2>
              <div className="rd-concepts-grid">
                {keyConceptsDeepDive.map((item, i) => (
                  <div key={i} className="card rd-concept-card">
                    <h3>{item.concept}</h3>
                    <p className="mt-8 text-secondary" style={{lineHeight: '1.75'}}>{item.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── EXPERT RESOURCES ─────────────────────────── */}
          {expertResources && (
            <section className="rd-section">
              <h2>📚 Expert Resources & Learning Materials</h2>

              {expertResources.books && expertResources.books.length > 0 && (
                <div className="rd-resources-block">
                  <h3>📖 Essential Books</h3>
                  <div className="rd-books-grid">
                    {expertResources.books.map((book, i) => (
                      <a
                        key={i}
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rd-book-card"
                      >
                        <div className="rd-book-title">{book.title}</div>
                        <div className="rd-book-author">by {book.author}</div>
                        <p className="rd-book-desc">{book.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {expertResources.officialDocs && expertResources.officialDocs.length > 0 && (
                <div className="rd-resources-block mt-24">
                  <h3>📄 Official Documentation</h3>
                  <div className="rd-docs-grid">
                    {expertResources.officialDocs.map((doc, i) => (
                      <div key={i} className="rd-doc-item">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="rd-doc-link">
                          {doc.name} →
                        </a>
                        <p className="rd-doc-desc">{doc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expertResources.freeCourses && expertResources.freeCourses.length > 0 && (
                <div className="rd-resources-block mt-24">
                  <h3>🎓 Recommended Courses</h3>
                  <div className="rd-courses-table">
                    {expertResources.freeCourses.map((course, i) => (
                      <div key={i} className="rd-course-row">
                        <div className="rd-course-info">
                          <a href={course.url} target="_blank" rel="noopener noreferrer" className="rd-course-name">{course.name}</a>
                          <span className="rd-course-platform">{course.platform}</span>
                        </div>
                        <p className="rd-course-desc">{course.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ─── COMMUNITY & PRACTICE ─────────────────────────── */}
          {communityAndPractice && (
            <section className="rd-section">
              <h2>🌐 Community & Practice</h2>

              {communityAndPractice.subreddits && communityAndPractice.subreddits.length > 0 && (
                <div className="rd-resources-block">
                  <h3>💬 Communities to Join</h3>
                  <div className="chips-container mt-8">
                    {communityAndPractice.subreddits.map((sub, i) => (
                      <a key={i} href={sub.url} target="_blank" rel="noopener noreferrer" className="chip chip-outline">
                        {sub.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {communityAndPractice.githubRepos && communityAndPractice.githubRepos.length > 0 && (
                <div className="rd-resources-block mt-16">
                  <h3>⭐ GitHub Repos to Star</h3>
                  <ul className="rd-list mt-8">
                    {communityAndPractice.githubRepos.map((repo, i) => (
                      <li key={i}>
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="color-primary font-semibold">
                          {repo.name}
                        </a> — {repo.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {communityAndPractice.practiceProjects && communityAndPractice.practiceProjects.length > 0 && (
                <div className="rd-resources-block mt-16">
                  <h3>🛠️ Advanced Practice Projects</h3>
                  <ul className="rd-list mt-8">
                    {communityAndPractice.practiceProjects.map((proj, i) => (
                      <li key={i}>{proj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {communityAndPractice.newsletters && communityAndPractice.newsletters.length > 0 && (
                <div className="rd-resources-block mt-16">
                  <h3>📰 Newsletters to Subscribe</h3>
                  <div className="chips-container mt-8">
                    {communityAndPractice.newsletters.map((nl, i) => (
                      <a key={i} href={nl.url} target="_blank" rel="noopener noreferrer" className="chip">
                        {nl.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {comprehensiveDeepDive && comprehensiveDeepDive.length > 0 && (
            <section className="rd-section content-long-form">
              <h2><Zap size={22} className="text-yellow"/> Definitive Guide & Deep Dive</h2>
              <div className="mt-24 space-y-32">
                {comprehensiveDeepDive.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-2xl font-bold mb-16 text-inverse">{item.heading}</h3>
                    <div className="text-secondary leading-relaxed" style={{lineHeight: '1.75'}}>
                      <SafeMarkdown>{item.content}</SafeMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <LearningJourneyCTA roleName={seo.title.split(' Roadmap')[0] || 'this role'} />

          <SkillAssessmentQuiz roleId={slug} roleName={seo.title.split(' Roadmap')[0] || 'this role'} />

          <AIRecommendations roleId={slug} />

          <RelatedResources items={[
            { title: 'Interview Questions', description: `Top interview questions for ${seo.title.split(' Roadmap')[0]}`, url: `/interview-questions/${slug}`, icon: '🎤' },
            { title: 'Salary Guide', description: `Explore salaries for ${seo.title.split(' Roadmap')[0]}`, url: `/salary-guides/${slug}`, icon: '💰' },
            { title: 'Career Guide', description: `In-depth career advice for ${seo.title.split(' Roadmap')[0]}`, url: `/career-guides/${slug}`, icon: '📈' }
          ]} />

        </main>

        <aside className="rd-sidebar">
          <CareerGraphSidebar currentType="roadmap" currentSlug={slug} />
        </aside>

      </div>
      <BackToTop />
    </div>
  );
}
