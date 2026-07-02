import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import './StaticPage.css';

const markdown = `
# AI Usage & Disclosure Policy

*Last Updated: July 2, 2026*

At **CandidateToHR**, we leverage advanced artificial intelligence to analyze resumes, score ATS compatibility, and simulate voice-based mock interviews. We believe in absolute transparency regarding how AI models are utilized on our platform.

---

## 1. Where We Use AI
AI technologies are actively used in the following modules:
1. **AI Resume Analyzer**: Parses experience details and compares them against target job descriptions to identify keywords and skills gaps.
2. **AI Mock Interview Simulator**: Uses generative voice models and grading modules to ask situational questions and provide score breakdowns.
3. **AI Learning Path Generator**: Suggests localized roadmap structures based on custom student career goals.

---

## 2. Integrity and Editorial Controls
- **Human Guidance**: AI is never used to write factual editorial content (such as salary guide statistics, company profiles, or historical hiring stats). All articles are written and fact-checked by human specialists.
- **Bias Mitigation**: We constantly tune our parser prompts to avoid gender, racial, or background bias in candidate evaluation scores.
- **Non-Replacement**: Our AI scoring indicators are intended as educational recommendations, not legally binding hiring decisions.

---

## 3. Data Privacy and Training
- **No Model Retention**: We do not sell or lease candidate resume uploads to third-party model developers.
- **Anonymization**: Any data routed to external API servers is stripped of personal identifiers (names, phone numbers, home addresses) wherever possible.
`;

export default function AIUsagePolicyPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="AI Usage & Transparency Policy | CandidateToHR" 
        description="CandidateToHR AI Policy. Read our disclosures on data security, algorithm transparency, and the ethical use of artificial intelligence."
        canonical="/ai-policy"
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'AI Usage Policy', url: '/ai-policy' }
        ]}
      />
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
