import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';

export default function PortfolioOptimizerPage() {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!portfolioUrl.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Pass the portfolio details instead of web scraping since the API takes `portfolioDetails` and `resumeText`
      // We will ask the user for details instead of URL to avoid scraping complexity here, but for now
      // let's pass the URL as text and see if NIM handles it (or expects text).
      const res = await api.resumeAnalyzerAPI.portfolioOptimizer({ portfolioDetails: portfolioUrl, resumeText: targetRole });
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        alert(res.data?.message || 'Error generating portfolio analysis.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="AI Portfolio Optimizer | CandidateToHR"
        description="Get actionable feedback on your portfolio. Our AI analyzes your UX, content, and visuals to help you convert views into job interviews."
        canonical="/portfolio-optimizer"
      />

      <div className="po-page">
        <div className="po-container">
          
          <div className="po-header">
            <div className="po-badge"><Layout size={14} /> AI Portfolio Optimizer</div>
            <h1>Turn your portfolio into a <span className="gradient-text-purple">hiring magnet</span>.</h1>
            <p>Paste your portfolio URL and target role. We'll analyze your case studies, layout, and copy to help you stand out to top tech recruiters.</p>
          </div>

          <div className="po-grid">
            {/* Inputs */}
            <div className="po-inputs-card az-card">
              <div className="po-input-group">
                <label><Search size={16} /> Target Role</label>
                <input 
                  type="text"
                  placeholder="e.g., UX/UI Designer, Frontend Dev"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                />
              </div>

              <div className="po-input-group mt-4">
                <label><Layout size={16} /> Portfolio Details / Project Descriptions</label>
                <textarea 
                  placeholder="Paste the text from your case studies, project descriptions, or GitHub readmes..."
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  rows={5}
                />
              </div>

              <button 
                className="btn btn-primary po-submit-btn mt-6" 
                onClick={handleAnalyze} 
                disabled={loading || !portfolioUrl || !targetRole}
              >
                {loading ? (
                  <><span className="spinner"></span> Scanning Portfolio...</>
                ) : (
                  <><Zap size={18} /> Analyze Portfolio</>
                )}
              </button>
            </div>

            {/* Results */}
            <div className="po-results-pane">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    className="po-empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <PenTool size={48} className="po-empty-icon" />
                    <h3>Ready for Review</h3>
                    <p>Enter your URL to get an instant AI design and content audit.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    className="po-loading-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="po-scan-line"></div>
                    <Layout size={40} className="po-spin-icon" />
                    <h3>Rendering page structure...</h3>
                    <p>Evaluating case studies, accessibility, and visual hierarchy.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    className="po-result-content"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  >
                    
                    <div className="po-scores-grid">
                      <div className="po-score-box">
                        <span className="po-score-label">UX / Structure</span>
                        <div className="po-score-val text-indigo">{result.uxScore}/100</div>
                      </div>
                      <div className="po-score-box">
                        <span className="po-score-label">Content / Copy</span>
                        <div className="po-score-val text-green">{result.contentScore}/100</div>
                      </div>
                      <div className="po-score-box">
                        <span className="po-score-label">Visual Design</span>
                        <div className="po-score-val text-pink">{result.visualScore}/100</div>
                      </div>
                    </div>

                    <div className="po-recommendations">
                      <h4 className="po-section-title">Actionable Feedback</h4>
                      <div className="po-rec-list">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className={`po-rec-item ${rec.type.toLowerCase()}`}>
                            {rec.type === 'Critical' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                            <div className="po-rec-text">
                              <strong>{rec.type}:</strong> {rec.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="po-strengths">
                      <h4 className="po-section-title">What You're Doing Right</h4>
                      <ul>
                        {result.strengths.map((str, i) => (
                          <li key={i}><Zap size={14} className="text-yellow-500" /> {str}</li>
                        ))}
                      </ul>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
        
        <ToolEditorial 
          whatItDoes="<p>The AI Portfolio Optimizer reviews the structure, content, and presentation of your project descriptions. It acts like a Senior Hiring Manager looking at your case studies, providing scores across UX/Structure, Content/Copy, and Visual Design, along with actionable feedback to improve conversion.</p>"
          howItWorks="<p>Our AI model analyzes the text of your case studies and project summaries against the standard expectations for your target role. It identifies missing context (like business impact or 'the why'), flags confusing jargon, and suggests structural improvements to ensure recruiters can understand your value in under 30 seconds.</p>"
          whoShouldUse="<ul><li><strong>UX/UI Designers:</strong> Ensure your case studies tell a compelling story rather than just showing pretty screens.</li><li><strong>Software Engineers:</strong> Learn how to translate GitHub Readmes into business-focused portfolio items.</li><li><strong>Data Scientists:</strong> Optimize how you present complex data models to non-technical recruiters.</li></ul>"
          benefits="<ul><li><strong>Higher Conversion:</strong> Turn passive portfolio views into actual interview requests.</li><li><strong>Role Alignment:</strong> Ensures your projects scream 'I am perfect for THIS specific role'.</li><li><strong>Objective Critique:</strong> Get instant, unbiased feedback before sharing your work publicly.</li></ul>"
          limitations="<p>Currently, the AI analyzes text and structure descriptions. It cannot visually 'see' your live website's CSS, colors, or animations. Be sure to describe your layout and case study structure accurately for the best feedback.</p>"
          bestPractices="<p>Paste the full text of your most important case study. Include headings, bullet points, and descriptions of your process. Don't just paste a URL; paste the actual content you want reviewed. Re-run the analysis whenever you add a new project.</p>"
          faq={[
            { q: "Can it review my live website URL directly?", a: "To ensure the highest quality feedback, we currently require you to paste the text/structure of your portfolio. This prevents web-scraping errors and focuses the AI entirely on your content." },
            { q: "Does it help with GitHub Readmes?", a: "Absolutely. Paste your Readme text and specify your target role as 'Software Engineer' to get feedback on how to make it more attractive to recruiters." },
            { q: "What is a good score?", a: "Aim for 85+ across all three categories to ensure your portfolio is competitive in today's market." }
          ]}
        />
      </div>
    </>
  );
}
