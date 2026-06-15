import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layout, Search, Zap, Code, Palette, PenTool, CheckCircle, AlertCircle } from 'lucide-react';
import './PortfolioOptimizerPage.css';

export default function PortfolioOptimizerPage() {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!portfolioUrl.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult({
        uxScore: 78,
        contentScore: 85,
        visualScore: 82,
        recommendations: [
          { type: "Critical", text: "Add a 'TL;DR' summary at the top of each case study. Recruiters spend <30 seconds per portfolio." },
          { type: "Improvement", text: "Ensure your live project links open in a new tab to keep users on your portfolio." },
          { type: "Role-Specific", text: "As a target Product Designer, you need more emphasis on the 'Why' and the business impact, not just the final UI." }
        ],
        strengths: [
          "Clean typography and whitespace",
          "Responsive mobile layout",
          "Good code quality (if linked to GitHub)"
        ]
      });
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>AI Portfolio Optimizer | CandidateToHR</title>
        <meta name="description" content="Get actionable feedback on your portfolio. Our AI analyzes your UX, content, and visuals to help you convert views into job interviews." />
        <meta name="keywords" content="portfolio review, AI portfolio analysis, UX design, software engineer portfolio, case study feedback" />
      </Helmet>

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
                <label><Layout size={16} /> Portfolio / GitHub URL</label>
                <input 
                  type="url"
                  placeholder="https://yourname.com"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
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
      </div>
    </>
  );
}
