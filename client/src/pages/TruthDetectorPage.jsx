import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, FileText, Zap, AlertTriangle, AlertCircle, Crosshair, ChevronRight } from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';
import ComprehensiveSEOSection from '../components/seo/ComprehensiveSEOSection';
import './TruthDetectorPage.css';

export default function TruthDetectorPage() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  const handleDetect = async (e) => {
    if (e) e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume text to analyze.');
      inputRef.current?.focus();
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await resumeAnalyzerAPI.truthDetector({ resumeText });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getRiskBg = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'rgba(239,68,68,0.1)';
      case 'medium': return 'rgba(245,158,11,0.1)';
      case 'low': return 'rgba(16,185,129,0.1)';
      default: return 'rgba(100,116,139,0.1)';
    }
  };

  return (
    <div className="td-page-wrapper">
      <SEO 
        title="AI Truth Detector | CandidateToHR"
        description="See if your resume passes the BS test. Our AI acts as a cynical recruiter, flagging exaggerated claims and predicting exact interview interrogation questions."
        canonical="/truth-detector"
        type="SoftwareApplication"
        schema={{
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": "https://candidatetohr.online/truth-detector/#app",
          "name": "CandidateToHR AI Truth Detector",
          "alternateName": "CandidateToHR Resume Truth Checker",
          "url": "https://candidatetohr.online/truth-detector",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "See if your resume passes the BS test. Our AI acts as a cynical recruiter, flagging exaggerated claims and predicting exact interview interrogation questions.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://candidatetohr.online/#organization",
            "name": "CandidateToHR"
          }
        }}
      />
      <div className="container-seo">
        
        <div className="td-header">
          <div className="td-badge"><Shield size={14} /> AI Resume Truth Detector</div>
          <h1>Find out if your resume looks <span className="gradient-text">suspicious</span>.</h1>
          <p>Our forensic AI scans your resume for overclaiming, buzzword stuffing, and fake skills by looking for missing supporting evidence.</p>
        </div>

        <div className="td-grid">
          
          {/* Inputs */}
          <form className="td-inputs-card az-card" onSubmit={handleDetect}>
            <div className="td-input-group">
              <label htmlFor="resume-text"><FileText size={16} /> Your Resume (Text)</label>
              <textarea 
                ref={inputRef}
                id="resume-text"
                placeholder="Paste your complete resume content here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>

            {error && <div className="td-error" role="alert">{error}</div>}

            <button 
              type="submit"
              className="btn btn-primary td-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Running Forensic Scan...</>
              ) : (
                <><Zap size={18} /> Detect Truth</>
              )}
            </button>
            <div className="td-privacy">
              <ShieldAlert size={14} /> For internal/personal use. We don't share this data.
            </div>
          </form>

          {/* Results */}
          <div className="td-results-pane">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  className="td-empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <ShieldAlert size={48} className="td-empty-icon" />
                  <h3>Awaiting Scan</h3>
                  <p>Provide your resume to run the background truth analysis.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  className="td-loading-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="td-scan-line"></div>
                  <Crosshair size={50} className="td-spin-icon" />
                  <h3>Cross-referencing claims...</h3>
                  <p>Looking for contradictions and missing evidence.</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  className="td-result-content"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                  
                  {/* Trust Score */}
                  <div className="td-score-card" style={{ borderColor: getRiskColor(result.overallTrustScore < 50 ? 'high' : result.overallTrustScore < 80 ? 'medium' : 'low') }}>
                    <div className="td-score-meta">
                      <span className="td-score-label">Overall Trust Score</span>
                      <span className="td-score-val" style={{ color: getRiskColor(result.overallTrustScore < 50 ? 'high' : result.overallTrustScore < 80 ? 'medium' : 'low') }}>
                        {result.overallTrustScore} / 100
                      </span>
                    </div>
                    <div className="td-verdict">
                      "{result.verdict}"
                    </div>
                  </div>

                  {/* Suspicious Claims */}
                  <h3 className="td-section-title">Suspicious Claims</h3>
                  {result.flags?.length > 0 ? (
                    <div className="td-flags-list">
                      {result.flags.map((flag, i) => (
                        <div key={i} className="td-flag-item" style={{ borderColor: getRiskColor(flag.riskLevel) }}>
                          <div className="td-flag-header" style={{ background: getRiskBg(flag.riskLevel) }}>
                            <div className="td-flag-claim">
                              {flag.riskLevel.toLowerCase() === 'high' ? <AlertTriangle size={16} color={getRiskColor(flag.riskLevel)} /> : <AlertCircle size={16} color={getRiskColor(flag.riskLevel)} />}
                              <span>"{flag.claim}"</span>
                            </div>
                            <span className="td-flag-risk" style={{ color: getRiskColor(flag.riskLevel) }}>{flag.riskLevel} Risk</span>
                          </div>
                          <div className="td-flag-reason">
                            <ChevronRight size={16} className="td-arrow" />
                            <p>{flag.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="td-all-clear">
                      <Shield size={24} color="#10b981" />
                      <p>No highly suspicious claims detected! Your resume looks authentic and well-supported.</p>
                    </div>
                  )}

                  {/* Interrogation Questions */}
                  {result.interrogationQuestions?.length > 0 && (
                    <div className="td-interrogation-box">
                      <h4><Crosshair size={18} /> Prepare for Interrogation</h4>
                      <p className="td-interrogation-sub">Recruiters will likely poke holes in your resume using these questions:</p>
                      <ul>
                        {result.interrogationQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
        
        <ToolEditorial 
          whatItDoes="<p>The AI Truth Detector evaluates your resume from the perspective of a cynical, highly skeptical hiring manager. It scans for exaggerated metrics, buzzword stuffing, and logically inconsistent timelines, flagging exactly where an interviewer will push back.</p>"
          howItWorks="<p>Powered by NVIDIA NIM, the model analyzes the linguistic patterns in your resume. It looks for 'weasel words' (e.g., 'helped', 'involved in') and impossibly high metrics (e.g., 'increased revenue by 5000%'). It then generates the exact 'interrogation questions' a recruiter will use to verify your claims.</p>"
          whoShouldUse="<ul><li><strong>Senior Executives:</strong> Ensure your impressive metrics sound credible, not fabricated.</li><li><strong>Junior Candidates:</strong> Avoid the common mistake of over-exaggerating minor bootcamp projects.</li><li><strong>Anyone Preparing for Interviews:</strong> Get a sneak peek at the hardest verification questions you will face.</li></ul>"
          benefits="<ul><li><strong>Builds Trust:</strong> A believable resume always beats an exaggerated one that falls apart in the interview.</li><li><strong>Interview Prep:</strong> Prepares you to defend your most impressive achievements with hard data.</li><li><strong>Filters Buzzwords:</strong> Helps you sound like an expert rather than a marketer.</li></ul>"
          limitations="<p>The AI does not have access to your actual company data. It flags claims based on industry averages and linguistic probability. Just because it flags a metric doesn't mean it's a lie—it just means you need to be prepared to defend it vigorously.</p>"
          bestPractices="<p>If the AI flags a metric that is 100% true, do not delete it! Instead, add a brief note on *how* you achieved it (e.g., instead of 'Increased traffic by 500%', write 'Increased traffic by 500% by migrating from legacy CMS to Next.js').</p>"
        />
      </div>
      <ComprehensiveSEOSection topic="utilities" />
      <InternalLinksFooter />
    </div>
  );
}
