import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import './StaticPage.css';

const markdown = `
# Editorial & Content Review Policy

*Last Updated: July 2, 2026*

At **CandidateToHR**, our mission is to deliver the most accurate, up-to-date, and actionable career intelligence resources for software engineers, data analysts, and other technical professionals. We understand that career decisions are high-stakes, which is why we enforce a rigorous editorial process.

---

## 1. Content Standards and E-E-A-T
We align our publications with Google's guidelines for **Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T)**:
- **Expert Authorship**: All of our career guides, roadmap timelines, and interview scripts are drafted and maintained by senior recruiters, veteran engineering leads, and career coaches.
- **Fact-Checking**: Any quantitative statements, salary figures, and hiring growth projections are referenced against verified sources, including the U.S. Bureau of Labor Statistics (BLS), official company reports, Glassdoor, and industry surveys.
- **No Plagiarism**: We enforce 100% originality across all resources.

---

## 2. Fact-Checking Policy
Every factual claim is subjected to multiple checks:
1. **Primary Sources Only**: We link directly to official documentation, academic papers, and official corporate sites.
2. **Review of Code & Tools**: Code snippets, tools, and technical commands listed in roadmaps are validated locally on current compilers/runtimes to ensure accuracy.
3. **External Audits**: We routinely invite external tech industry leaders to audit our interview preparation sheets.

---

## 3. Content Freshness & Updates
Tech industry standards evolve rapidly. To prevent stale resources:
- **Quarterly Reviews**: Our core career roadmaps are audited every 90 days.
- **Annual Overhauls**: At the start of every calendar year, all guides are thoroughly overhauled to reflect current hiring metrics.
- **Revision History**: Major revisions are logged with updated timestamps directly on the article header.
`;

export default function EditorialPolicyPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="Editorial & Content Review Policy | CandidateToHR" 
        description="CandidateToHR Editorial Policy. Learn how we research, fact-check, and maintain our career guides and learning paths."
        canonical="/editorial-policy"
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Editorial Policy', url: '/editorial-policy' }
        ]}
      />
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
