import SEO from '../components/SEO';
import { Eye, ShieldCheck } from 'lucide-react';
import './StaticPage.css';

export default function AccessibilityPage() {
  return (
    <div className="static-page">
      <SEO 
        title="Accessibility & WCAG 2.2 Compliance Statement | CandidateToHR"
        description="CandidateToHR is committed to digital accessibility. Read our compliance roadmap matching WCAG 2.2 AA criteria."
        canonical="/trust/accessibility"
        type="WebPage"
      />

      <div className="static-hero">
        <div className="static-container text-center">
          <h1 className="static-title">Accessibility Statement</h1>
          <p className="static-subtitle">Ensuring CandidateToHR remains usable and readable for every candidate.</p>
        </div>
      </div>

      <div className="static-container mt-48">
        <main className="static-content">
          <section>
            <h2>1. Accessibility Standards Target</h2>
            <p>
              CandidateToHR aims to conform to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** standards. Our application is audited against these benchmarks on every major layout change.
            </p>
          </section>

          <section>
            <h2>2. Specific Optimization Points</h2>
            <ul>
              <li><strong>Keyboard Navigation:</strong> All interactive elements, sidebar recommendation lists, and custom FAQs support focus triggers and keyboard triggers (`Tab`, `Enter`, `Space`).</li>
              <li><strong>Screen Reader Semantic Markup:</strong> Explicit headings hierarchies, aria landmarks, and skip-link shortcuts are built into the global template.</li>
              <li><strong>Color Contrast:</strong> Minimum text contrast thresholds meet the 4.5:1 ratio targets for small body text.</li>
            </ul>
          </section>

          <section>
            <h2>3. Accessibility Compliance Checks</h2>
            <p>
              We run automated accessibility checks using axe-core audits as part of our developer QA loop. If you encounter any barriers, please reach out to us at `support@candidatetohr.online`.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
