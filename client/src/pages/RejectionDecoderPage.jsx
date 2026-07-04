import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, Mail, Zap, ChevronRight, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';
import './RejectionDecoderPage.css';

export default function RejectionDecoderPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [rejectionEmail, setRejectionEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDecode = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Resume and Job Description are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await resumeAnalyzerAPI.rejectionDecoder({
        resumeText,
        jobDescription,
        rejectionEmail
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decode rejection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-page-wrapper">
      <SEO 
        title="AI Rejection Decoder | CandidateToHR"
        description="Paste your resume and job description to find out exactly why you were rejected. Get brutal, honest feedback and an action plan to fix it."
        canonical="/rejection-decoder"
        type="SoftwareApplication"
        schema={{
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": "https://candidatetohr.online/rejection-decoder/#app",
          "name": "CandidateToHR AI Rejection Decoder",
          "alternateName": "CandidateToHR Rejection Analyzer",
          "url": "https://candidatetohr.online/rejection-decoder",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Paste your resume and job description to find out exactly why you were rejected. Get brutal, honest feedback and an action plan to fix it.",
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
        
        <div className="rd-header">
          <div className="rd-badge"><AlertTriangle size={14} /> AI Rejection Decoder</div>
          <h1>Find out <span className="gradient-text">exactly why</span> you were rejected.</h1>
          <p>Paste your resume, the job description, and the rejection email. Our AI will give you the brutal truth and an action plan.</p>
        </div>

        <div className="rd-grid">
          
          {/* Inputs */}
          <div className="rd-inputs-card az-card">
            <div className="rd-input-group">
              <label><FileText size={16} /> Your Resume (Text)</label>
              <textarea 
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>

            <div className="rd-input-group">
              <label><Briefcase size={16} /> Job Description</label>
              <textarea 
                placeholder="Paste the requirements and responsibilities..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
            </div>

            <div className="rd-input-group">
              <label><Mail size={16} /> Rejection Email (Optional)</label>
              <textarea 
                placeholder="Paste the 'Unfortunately, we will not be moving forward...' email here"
                value={rejectionEmail}
                onChange={e => setRejectionEmail(e.target.value)}
                className="rd-small-textarea"
              />
            </div>

            {error && <div className="rd-error">{error}</div>}

            <button 
              className="btn btn-primary rd-submit-btn" 
              onClick={handleDecode} 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Analyzing Rejection...</>
              ) : (
                <><Zap size={18} /> Decode My Rejection</>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="rd-results-pane">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  className="rd-empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <AlertTriangle size={48} className="rd-empty-icon" />
                  <h3>Awaiting Data</h3>
                  <p>Provide your details on the left to get your brutally honest rejection analysis.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  className="rd-loading-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="rd-scan-line"></div>
                  <Zap size={40} className="rd-pulse-icon" />
                  <h3>Decoding Rejection...</h3>
                  <p>Cross-referencing your skills with the job requirements.</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  className="rd-result-content"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="rd-harsh-truth">
                    <h4>The Brutal Truth</h4>
                    <p>"{result.harshTruth}"</p>
                  </div>

                  <div className="rd-reasons-list">
                    <h4>Top Reasons for Rejection</h4>
                    {result.topReasons?.map((r, i) => (
                      <div key={i} className={`rd-reason-item severity-${r.severity.toLowerCase()}`}>
                        <span className="rd-reason-icon">
                          {r.severity.toLowerCase() === 'high' ? <AlertTriangle size={16} /> : <ChevronRight size={16} />}
                        </span>
                        <span>{r.reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rd-split-grid">
                    <div className="rd-missing-skills">
                      <h4>Missing Critical Skills</h4>
                      <div className="rd-chips">
                        {result.missingSkills?.length > 0 ? result.missingSkills.map((s, i) => (
                          <span key={i} className="rd-chip error">{s}</span>
                        )) : <span className="rd-chip success">None identified</span>}
                      </div>
                    </div>
                    
                    <div className="rd-weaknesses">
                      <h4>Resume Weaknesses</h4>
                      <ul>
                        {result.resumeWeaknesses?.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rd-action-plan">
                    <h4>Action Plan to Fix This</h4>
                    <ul>
                      {result.actionPlan?.map((step, i) => (
                        <li key={i}>
                          <CheckCircle size={16} className="rd-success-icon" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rd-cta-box">
                    <p>Don't let this stop you. Tailor your resume right now for the next opportunity.</p>
                    <a href="/analyze" className="btn btn-outline">
                      Fix Resume <ArrowRight size={16} />
                    </a>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
        
        <ToolEditorial 
          whatItDoes="<p>The AI Rejection Decoder removes the ambiguity from generic 'unfortunately, we are moving forward with other candidates' emails. It acts as an unbiased hiring manager, tearing down your resume against the job description to tell you exactly where you fell short.</p>"
          howItWorks="<p>Our AI cross-references the strict requirements of the job description with the explicit skills and experience listed on your resume. It identifies missing keywords, seniority gaps, and formatting red flags to determine the mathematical probability of why the ATS or human recruiter rejected you.</p>"
          whoShouldUse="<ul><li><strong>Frustrated Applicants:</strong> Anyone stuck in a cycle of immediate auto-rejections.</li><li><strong>Career Changers:</strong> Understand if you are failing to translate your past experience into the new industry's language.</li><li><strong>Senior Professionals:</strong> Identify if you are accidentally coming across as overqualified or too expensive.</li></ul>"
          benefits="<ul><li><strong>Closure:</strong> Stop guessing why you didn't get the interview.</li><li><strong>Rapid Iteration:</strong> Immediately identify the one or two bullet points that need rewriting before your next application.</li><li><strong>Skill Gap Identification:</strong> If you are genuinely underqualified, the tool will tell you exactly what you need to learn.</li></ul>"
          limitations="<p>The AI cannot account for 'hidden' hiring factors, such as internal candidates, budget cuts, or nepotism. It strictly analyzes the textual match between your resume and the job posting.</p>"
          bestPractices="<p>Paste the exact job description you applied for (as companies often update them). Include the rejection email if possible, as sometimes recruiters leave subtle clues in the phrasing. Don't take the 'Brutal Truth' personally—use it as fuel to improve.</p>"
        />
      </div>
      <InternalLinksFooter />
    </div>
  );
}
