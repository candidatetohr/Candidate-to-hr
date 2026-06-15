import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Network, Search, Zap, UserPlus, Mail, Link, Copy } from 'lucide-react';
import './NetworkBuilderPage.css';

export default function NetworkBuilderPage() {
  const [targetIndustry, setTargetIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleAnalyze = () => {
    if (!targetIndustry.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult({
        strategy: "Focus on connecting with mid-level managers who make hiring decisions, rather than just recruiters. Engage with their recent posts before sending a connection request.",
        targetProfiles: [
          { role: "Engineering Manager", priority: "High", reason: "Direct hiring manager for your target role." },
          { role: "Senior Engineer", priority: "Medium", reason: "Can refer you internally and provide interview tips." },
          { role: "Technical Recruiter", priority: "High", reason: "Gatekeeper for the initial screening round." }
        ],
        outreachTemplates: [
          {
            type: "Cold Connection Request (LinkedIn)",
            subject: "",
            body: "Hi [Name], I've been following [Company]'s work in [Industry/Tech], and I really admire the team's approach to [Specific Detail]. As a [Your Role] looking to grow in this space, I'd love to connect and follow your journey!"
          },
          {
            type: "Informational Interview (Email/Message)",
            subject: "Quick question about your experience at [Company]",
            body: "Hi [Name],\n\nI hope you're doing well. I am a [Your Role] who has always admired [Company]'s culture, and your career trajectory really stood out to me. \n\nI'm not asking for a job or referral—I'd just love to ask you 2 quick questions over email about your experience transitioning into your current role. \n\nThanks for your time,\n[Your Name]"
          }
        ]
      });
      setLoading(false);
    }, 2400);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <Helmet>
        <title>AI Network Builder | CandidateToHR</title>
        <meta name="description" content="Build meaningful professional connections with our AI Network Builder. Get targeted outreach templates and networking strategies for your industry." />
        <meta name="keywords" content="networking, linkedin outreach, cold email templates, informational interview, AI networking" />
      </Helmet>

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
      </div>
    </>
  );
}
