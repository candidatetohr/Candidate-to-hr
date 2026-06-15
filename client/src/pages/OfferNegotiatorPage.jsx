import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DollarSign, MessageSquare, Target, Zap, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import './OfferNegotiatorPage.css';

export default function OfferNegotiatorPage() {
  const [offerDetails, setOfferDetails] = useState('');
  const [targetSalary, setTargetSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!offerDetails.trim() || !targetSalary.trim()) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult({
        leverageLevel: "Strong",
        confidenceScore: 82,
        strategy: "Focus on total compensation rather than just base salary. Your target is within the market upper-percentile, but your specialized skills give you leverage.",
        scripts: [
          {
            title: "The Gracious Pivot",
            text: "I’m thrilled about the offer and the opportunity to join the team. Based on my research and the specific impact I can bring to [Project/Goal], I was hoping we could explore a base salary closer to [Target]. Is there flexibility here?"
          },
          {
            title: "The Value-Add Approach",
            text: "Thank you for the offer. I've been reviewing the total compensation package. Given my background in [Key Skill], I believe my market value is around [Target]. If the base salary is fixed, could we discuss a sign-on bonus or additional equity to bridge the gap?"
          }
        ],
        hiddenLeverage: [
          "Urgency to fill the role",
          "Your unique niche skills",
          "Alternative benefits (PTO, WFH stipend)"
        ]
      });
      setLoading(false);
    }, 2800);
  };

  return (
    <>
      <Helmet>
        <title>AI Offer Negotiator & Salary Scripts | CandidateToHR</title>
        <meta name="description" content="Maximize your job offer with our AI Offer Negotiator. Get personalized negotiation scripts, leverage analysis, and salary counter-offer strategies." />
        <meta name="keywords" content="salary negotiation, AI offer negotiation, counter offer scripts, job offer advice" />
      </Helmet>

      <div className="on-page">
        <div className="on-container">
          
          <div className="on-header">
            <div className="on-badge"><DollarSign size={14} /> AI Offer Negotiator</div>
            <h1>Don't leave <span className="gradient-text-green">money</span> on the table.</h1>
            <p>Paste your initial offer details and your target salary. Our AI will analyze your leverage and generate professional counter-offer scripts.</p>
          </div>

          <div className="on-grid">
            {/* Inputs */}
            <div className="on-inputs-card az-card">
              <div className="on-input-group">
                <label><Target size={16} /> Target Salary / Comp</label>
                <input 
                  type="text"
                  placeholder="e.g., $120,000 base + 10% bonus"
                  value={targetSalary}
                  onChange={e => setTargetSalary(e.target.value)}
                />
              </div>

              <div className="on-input-group mt-4">
                <label><MessageSquare size={16} /> Initial Offer Details</label>
                <textarea 
                  placeholder="Paste what the recruiter offered (base, bonus, equity, PTO)..."
                  value={offerDetails}
                  onChange={e => setOfferDetails(e.target.value)}
                  rows={6}
                />
              </div>

              <button 
                className="btn btn-primary on-submit-btn mt-6" 
                onClick={handleAnalyze} 
                disabled={loading || !offerDetails || !targetSalary}
              >
                {loading ? (
                  <><span className="spinner"></span> Generating Strategy...</>
                ) : (
                  <><Zap size={18} /> Build Negotiation Strategy</>
                )}
              </button>
              
              <div className="on-privacy">
                <ShieldAlert size={14} /> Your offer details are not stored permanently.
              </div>
            </div>

            {/* Results */}
            <div className="on-results-pane">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    className="on-empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <DollarSign size={48} className="on-empty-icon" />
                    <h3>Ready to Negotiate</h3>
                    <p>Enter your offer details to get actionable negotiation scripts.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    className="on-loading-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <TrendingUp size={40} className="on-spin-icon" />
                    <h3>Analyzing leverage points...</h3>
                    <p>Drafting professional and persuasive counter-offers.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    className="on-result-content"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  >
                    
                    <div className="on-summary-cards">
                      <div className="on-stat-card">
                        <span className="on-stat-label">Leverage Level</span>
                        <h3 className="on-stat-val text-green">{result.leverageLevel}</h3>
                      </div>
                      <div className="on-stat-card">
                        <span className="on-stat-label">Success Confidence</span>
                        <h3 className="on-stat-val">{result.confidenceScore}%</h3>
                      </div>
                    </div>

                    <div className="on-strategy-box">
                      <h4><Sparkles size={18} /> High-Level Strategy</h4>
                      <p>{result.strategy}</p>
                    </div>

                    <div className="on-scripts-section">
                      <h3 className="on-section-title">Email / Call Scripts</h3>
                      <div className="on-scripts-list">
                        {result.scripts.map((script, i) => (
                          <div key={i} className="on-script-item">
                            <div className="on-script-header">
                              <MessageSquare size={16} className="text-primary" />
                              <strong>{script.title}</strong>
                            </div>
                            <div className="on-script-body">
                              {script.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="on-hidden-leverage">
                      <h4><Target size={16} /> Alternative Leverage to Discuss</h4>
                      <ul>
                        {result.hiddenLeverage.map((item, i) => (
                          <li key={i}><ArrowRight size={14} className="text-purple" /> {item}</li>
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
