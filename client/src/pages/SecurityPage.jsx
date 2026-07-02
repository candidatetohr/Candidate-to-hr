import SEO from '../components/SEO';
import { Lock, ShieldCheck } from 'lucide-react';
import './StaticPage.css';

export default function SecurityPage() {
  return (
    <div className="static-page">
      <SEO 
        title="Data Security & Document Protection Standards | CandidateToHR"
        description="Learn how CandidateToHR secures candidate resumes, API connections, and automated voice recordings."
        canonical="/trust/security"
        type="WebPage"
      />

      <div className="static-hero">
        <div className="static-container text-center">
          <h1 className="static-title">Security & Safety Disclosures</h1>
          <p className="static-subtitle">How we encrypt, process, and protect your career records.</p>
        </div>
      </div>

      <div className="static-container mt-48">
        <main className="static-content">
          <section>
            <h2>1. PDF Document Protection</h2>
            <p>
              When uploading a resume to the CandidateToHR Analyzer, the file is securely transmitted over TLS 1.3 socket paths. Once our parsing nodes finish scoring keywords, the files are deleted to ensure no personal documents are stored.
            </p>
          </section>

          <section>
            <h2>2. Audio Recording Privacy</h2>
            <p>
              For our Mock Interview Simulator, voice snippets are processed via browser voice recognition or transient API buffers. We do not store, distribute, or compile audio snippets for marketing datasets.
            </p>
          </section>

          <section>
            <h2>3. Vulnerability Reporting</h2>
            <p>
              We run automated dependency vulnerability scanning using NPM audits and GitHub Dependabot alerts on every deployment. Critical vulnerability alerts force an immediate rollback to maintain safety.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
