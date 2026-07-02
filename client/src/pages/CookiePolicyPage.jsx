import SEO from '../components/SEO';
import { Eye, ShieldAlert } from 'lucide-react';
import './StaticPage.css';

export default function CookiePolicyPage() {
  return (
    <div className="static-page">
      <SEO 
        title="Cookie & Privacy Log Disclosures | CandidateToHR"
        description="Learn how CandidateToHR handles user session analytics and telemetry without third-party tracking identifiers or privacy-invasive cookies."
        canonical="/trust/cookies"
        type="WebPage"
      />

      <div className="static-hero">
        <div className="static-container text-center">
          <h1 className="static-title">Cookie & Log Policy</h1>
          <p className="static-subtitle">CandidateToHR commits to 100% cookie-free session validation and privacy first.</p>
        </div>
      </div>

      <div className="static-container mt-48">
        <main className="static-content">
          <section>
            <h2>1. Zero Third-Party Tracker Guarantee</h2>
            <p>
              Unlike legacy analytics suites that drop persistent third-party tracking identifiers across domains to map user profiles, CandidateToHR does not place any advertising trackers or browser fingerprint markers.
            </p>
          </section>

          <section>
            <h2>2. Session Telemetry & Logs</h2>
            <p>
              We measure performance targets and aggregate clicks using transient local variables and local storage states. This logs:
            </p>
            <ul>
              <li>Which templates are viewed (e.g. Java Roadmap vs Data Analyst Resume).</li>
              <li>General duration spent verifying curriculum lists.</li>
              <li>Internal searches for keyword typo analysis.</li>
            </ul>
          </section>

          <section>
            <h2>3. Contact & Opt-Out</h2>
            <p>
              Because we don't store personal identifiers, we do not require a cookie banner popup, keeping your viewports clean and fast. To wipe any stored analytics milestones from your active browser, simply clear your browser cache and local storage at any time.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
