import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import { Network, Search, Zap, UserPlus, Link, Mail, Copy } from 'lucide-react';

export default function NetworkBuilderPage() {
  const [targetIndustry, setTargetIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleAnalyze = async () => {
    if (!targetIndustry.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await api.resumeAnalyzerAPI.networkBuilder({ resumeText: targetIndustry, networkingGoal: targetRole });
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        alert(res.data?.message || 'Error generating network strategy.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <SEO 
        title="AI Network Builder | CandidateToHR"
        description="Build meaningful professional connections with our AI Network Builder. Get targeted outreach templates and networking strategies for your industry."
        canonical="/network-builder"
      />

      <div className="nb-page">
        <div className="nb-container">
          
          <div className="nb-header">
            <div className="nb-badge"><Network size={14} /> AI Network Builder</div>
            <h1>Your network is your <span className="gradient-text-blue">net worth</span>.</h1>
            <p>Tell us your target role and industry. We'll generate a networking strategy and personalized outreach messages that actually get replies.</p>
          </div>

          <div className="nb-grid">
            {/* Inputs */}
            <div className="nb-inputs-card az-card">
              <div className="nb-input-group">
                <label><Search size={16} /> Target Role</label>
                <input 
                  type="text"
                  placeholder="e.g., Product Designer"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                />
              </div>

              <div className="nb-input-group mt-4">
                <label><Network size={16} /> Target Industry / Company</label>
                <input 
                  type="text"
                  placeholder="e.g., FinTech, Stripe, Web3..."
                  value={targetIndustry}
                  onChange={e => setTargetIndustry(e.target.value)}
                />
              </div>

              <button 
                className="btn btn-primary nb-submit-btn mt-6" 
                onClick={handleAnalyze} 
                disabled={loading || !targetIndustry || !targetRole}
              >
                {loading ? (
                  <><span className="spinner"></span> Generating Strategy...</>
                ) : (
                  <><Zap size={18} /> Build Networking Plan</>
                )}
              </button>
            </div>

            {/* Results */}
            <div className="nb-results-pane">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    className="nb-empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <UserPlus size={48} className="nb-empty-icon" />
                    <h3>Unlock the Hidden Job Market</h3>
                    <p>80% of jobs aren't posted online. Start networking smartly.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    className="nb-loading-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="nb-nodes-anim">
                      <Network size={40} className="nb-spin-icon" />
                    </div>
                    <h3>Connecting the dots...</h3>
                    <p>Writing high-conversion outreach templates.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    className="nb-result-content"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  >
                    
                    <div className="nb-strategy-box">
                      <h4>Networking Strategy</h4>
                      <p>{result.strategy}</p>
                    </div>

                    <div className="nb-targets">
                      <h4 className="nb-section-title">Who to Connect With</h4>
                      <div className="nb-target-list">
                        {result.targetProfiles.map((profile, i) => (
                          <div key={i} className="nb-target-item">
                            <div className="nb-target-header">
                              <Link size={16} className="text-blue-500" />
                              <strong>{profile.role}</strong>
                            </div>
                            <span className="nb-target-reason">{profile.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="nb-templates">
                      <h4 className="nb-section-title"><Mail size={18} /> High-Conversion Templates</h4>
                      <div className="nb-template-list">
                        {result.outreachTemplates.map((template, i) => (
                          <div key={i} className="nb-template-card">
                            <div className="nb-template-header">
                              <span className="nb-template-type">{template.type}</span>
                              <button 
                                className="nb-copy-btn" 
                                onClick={() => copyToClipboard(template.body, i)}
                              >
                                {copied === i ? <span className="text-green-500 text-xs">Copied!</span> : <><Copy size={14} /> Copy</>}
                              </button>
                            </div>
                            {template.subject && (
                              <div className="nb-template-subject">
                                <strong>Subject:</strong> {template.subject}
                              </div>
                            )}
                            <div className="nb-template-body">
                              {template.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
        
        <ToolEditorial 
          whatItDoes="<p>The AI Network Builder is a specialized outreach engine that identifies exactly <em>who</em> you should connect with to land your target role and gives you the exact scripts to get them to reply. It shifts networking from awkward cold messages to strategic, value-driven conversations.</p>"
          howItWorks="<p>By analyzing your target industry and role, our AI maps out the typical corporate hierarchy of your target companies. It identifies key decision-makers (like hiring managers) and influencers (like senior peers). It then generates personalized connection requests and informational interview templates based on proven psychological principles of reciprocity and genuine curiosity.</p>"
          whoShouldUse="<ul><li><strong>Job Seekers in Competitive Markets:</strong> When applying online isn't working, building a 'backdoor' through networking is essential.</li><li><strong>Career Pivoters:</strong> Reach out to professionals who have successfully made the transition you are attempting.</li><li><strong>Introverts:</strong> Removes the anxiety of staring at a blank screen by providing high-conversion starting points.</li></ul>"
          benefits="<ul><li><strong>Higher Response Rates:</strong> Uses templates designed to flatter and engage, not just ask for favors.</li><li><strong>Bypass ATS Filters:</strong> A strong internal referral can put your resume straight onto the hiring manager's desk.</li><li><strong>Market Intel:</strong> Informational interviews provide insights you can use later in official job interviews.</li></ul>"
          limitations="<p>The tool provides the strategy and the script, but you still have to send the messages. AI cannot guarantee that a specific individual will reply, as that depends on their personal schedule and inbox volume.</p>"
          bestPractices="<p>Never ask for a job or a referral in your first message. Focus on building a relationship. Ask insightful questions about their career or a recent project. Always customize the bracketed placeholders with genuine, specific research about the person you are contacting.</p>"
          faq={[
            { q: "Is cold outreach on LinkedIn annoying?", a: "Only if it's generic and self-serving. Our templates are designed to be respectful of their time and complimentary of their work." },
            { q: "Should I contact recruiters or managers?", a: "Both, but focus heavily on the hiring manager (e.g., Director of Engineering). They feel the pain of an empty role the most and have the power to bypass recruiters." },
            { q: "How many people should I contact?", a: "Quality over quantity. Aim to send 3-5 highly personalized messages to key individuals at your target company rather than 50 generic connections." }
          ]}
        />
      </div>
    </>
  );
}
