import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';

export default function OfferNegotiatorPage() {
  const [offerDetails, setOfferDetails] = useState('');
  const [targetSalary, setTargetSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!offerDetails.trim() || !targetSalary.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await api.resumeAnalyzerAPI.offerNegotiator({ offerDetails, targetSalary });
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        alert(res.data?.message || 'Error generating negotiation strategy.');
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
        title="AI Offer Negotiator & Salary Scripts | CandidateToHR"
        description="Maximize your job offer with our AI Offer Negotiator. Get personalized negotiation scripts, leverage analysis, and salary counter-offer strategies."
        canonical="/offer-negotiator"
      />

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
        
        <ToolEditorial 
          whatItDoes="<p>The AI Offer Negotiator analyzes your initial job offer against your target compensation to determine your negotiating leverage. It acts as your personal executive coach, generating customized counter-offer scripts and identifying 'hidden' compensation levers like signing bonuses, equity, and PTO.</p>"
          howItWorks="<p>Our NVIDIA-powered NLP engine processes the specific language and structure of your job offer. It cross-references this against market standards for your target salary. By evaluating the gap, it assesses your likelihood of success and crafts professional, persuasive email scripts tailored to your unique situation.</p>"
          whoShouldUse="<ul><li><strong>Job Seekers with an Active Offer:</strong> Don't accept the first number without pushing back gracefully.</li><li><strong>Professionals Expecting a Promotion:</strong> Prepare for internal compensation reviews.</li><li><strong>Career Pivoters:</strong> Understand how to value alternative compensation when base salary is rigid.</li></ul>"
          benefits="<ul><li><strong>Higher Earnings:</strong> Successfully negotiating can increase your starting salary by 5-15%, compounding over your career.</li><li><strong>Reduced Anxiety:</strong> Takes the emotion and stress out of writing the counter-offer email.</li><li><strong>Professional Tone:</strong> Ensures you sound grateful and excited while firmly advocating for your worth.</li></ul>"
          limitations="<p>The AI cannot know the hiring company's actual internal budget constraints or internal equity bands. Always use your best judgment when deciding how hard to push, especially if the company has explicitly stated it is a 'final and best' offer.</p>"
          bestPractices="<p>When using the generated scripts, always customize the placeholders with specific examples of the value you will bring to the team. Never lie about competing offers. If base salary is non-negotiable, pivot to asking for a sign-on bonus, extra vacation days, or a guaranteed 6-month performance review.</p>"
          faq={[
            { q: "Will negotiating make them pull the offer?", a: "It is extremely rare for a company to pull an offer simply because a candidate asked for a reasonable increase professionally. The scripts provided are designed to be collaborative, not confrontational." },
            { q: "What if I have a competing offer?", a: "Having a competing offer increases your leverage significantly. You should mention it in your prompt so the AI can weave it into your counter-offer strategy." },
            { q: "Can I negotiate over the phone instead of email?", a: "Yes! The scripts provided can easily be used as talking points for a live conversation." }
          ]}
        />
      </div>
    </>
  );
}
