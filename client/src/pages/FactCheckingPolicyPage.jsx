import SEO from '../components/SEO';
import { CheckCircle, HelpCircle } from 'lucide-react';
import './StaticPage.css';

export default function FactCheckingPolicyPage() {
  return (
    <div className="static-page">
      <SEO 
        title="Fact-Checking & Data Verification Policies | CandidateToHR"
        description="CandidateToHR fact-checking standards. Discover how we verify tech salaries, certifications guides, and learning roadmaps."
        canonical="/trust/fact-checking"
        type="WebPage"
      />

      <div className="static-hero">
        <div className="static-container text-center">
          <h1 className="static-title">Fact-Checking Policy</h1>
          <p className="static-subtitle">How we maintain the accuracy and truthfulness of CandidateToHR databases.</p>
        </div>
      </div>

      <div className="static-container mt-48">
        <main className="static-content">
          <section>
            <h2>1. Verification Guidelines</h2>
            <p>
              CandidateToHR is built to serve accurate and current career advice. All statistics, curriculum patterns, and certifications requirements are checked against three distinct types of primary sources before they are published:
            </p>
            <ul>
              <li><strong>Government Records:</strong> Base salary guides are audited against the Bureau of Labor Statistics (BLS) and regional payroll databases.</li>
              <li><strong>Direct Documentation:</strong> Roadmap skills match direct documentation from official project teams (e.g. Oracle Java guides, React team blog updates).</li>
              <li><strong>Senior Engineering Panel:</strong> Every curriculum syllabus is verified by a reviewing engineer with over 5 years of industry experience.</li>
            </ul>
          </section>

          <section>
            <h2>2. Updates Cycles</h2>
            <p>
              Data nodes are checked every quarter to update outdated technology trends. If you spot a parameter in our guides that does not match latest releases, you can alert us at `freshness@candidatetohr.online`.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
