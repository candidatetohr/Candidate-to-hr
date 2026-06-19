import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';

export default function CultureFitAnalyzerPage() {
  const [candidateProfile, setCandidateProfile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!candidateProfile.trim() || !companyName.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await api.resumeAnalyzerAPI.cultureFit({ resumeText: candidateProfile, companyValues: companyName });
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        alert(res.data?.message || 'Error generating culture fit analysis.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <SEO 
        title="AI Culture Fit Analyzer | CandidateToHR"
        description="Discover if you are a culture fit for your dream company. Our AI Culture Fit Analyzer compares your profile with company values to give you deep insights."
        canonical="/culture-fit"
      />

      <div className="cfa-page">
        <div className="cfa-container">
          
          <div className="cfa-header">
            <div className="cfa-badge"><Heart size={14} /> AI Culture Fit Analyzer</div>
            <h1>Find out if you truly <span className="gradient-text">belong</span> there.</h1>
            <p>Paste your resume/profile and the target company name to see how well your values align with their corporate culture.</p>
          </div>

          <div className="cfa-grid">
            {/* Inputs */}
            <div className="cfa-inputs-card az-card">
              <div className="cfa-input-group">
                <label><Building size={16} /> Target Company</label>
                <input 
                  type="text"
                  placeholder="e.g., Google, Stripe, or a startup..."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>

              <div className="cfa-input-group mt-4">
                <label><Briefcase size={16} /> Your Profile or Resume Summary</label>
                <textarea 
                  placeholder="Paste your professional summary, core values, or a brief description of how you like to work..."
                  value={candidateProfile}
                  onChange={e => setCandidateProfile(e.target.value)}
                  rows={6}
                />
              </div>

              <button 
                className="btn btn-primary cfa-submit-btn mt-6" 
                onClick={handleAnalyze} 
                disabled={loading || !candidateProfile || !companyName}
              >
                {loading ? (
                  <><span className="spinner"></span> Analyzing Alignment...</>
                ) : (
                  <><Zap size={18} /> Analyze Culture Match</>
                )}
              </button>
            </div>

            {/* Results */}
            <div className="cfa-results-pane">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    className="cfa-empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <Users size={48} className="cfa-empty-icon" />
                    <h3>Awaiting Profile</h3>
                    <p>Enter your details to generate a comprehensive culture map.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    className="cfa-loading-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="cfa-pulse-rings"></div>
                    <Heart size={40} className="cfa-beat-icon" />
                    <h3>Mapping core values...</h3>
                    <p>Comparing your work style against known company archetypes.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    className="cfa-result-content"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="cfa-score-banner" style={{ borderLeftColor: getScoreColor(result.overallMatch) }}>
                      <div className="cfa-score-info">
                        <span className="cfa-score-label">Overall Match Score</span>
                        <h2 className="cfa-score-val" style={{ color: getScoreColor(result.overallMatch) }}>
                          {result.overallMatch}%
                        </h2>
                      </div>
                      <div className="cfa-verdict">
                        <ShieldCheck size={20} color={getScoreColor(result.overallMatch)} />
                        <span>{result.verdict}</span>
                      </div>
                    </div>

                    <h3 className="cfa-section-title">Value Breakdown</h3>
                    <div className="cfa-traits-list">
                      {result.traits.map((trait, i) => (
                        <div key={i} className="cfa-trait-item">
                          <div className="cfa-trait-header">
                            <strong>{trait.name}</strong>
                            <span style={{ color: getScoreColor(trait.score) }}>{trait.score}/100</span>
                          </div>
                          <div className="cfa-progress-bar">
                            <div className="cfa-progress-fill" style={{ width: `${trait.score}%`, backgroundColor: getScoreColor(trait.score) }}></div>
                          </div>
                          <p className="cfa-trait-note">{trait.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="cfa-talking-points">
                      <h4>Interview Talking Points</h4>
                      <ul>
                        {result.talkingPoints.map((pt, i) => (
                          <li key={i}><CheckCircle2 size={16} className="text-green-500" /> {pt}</li>
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
          whatItDoes="<p>The AI Culture Fit Analyzer assesses the alignment between your personal working style and the core values of your target company. It scores compatibility across key psychological traits (e.g., autonomy vs. collaboration, risk-taking vs. stability) and generates specific interview talking points to highlight your cultural synergy.</p>"
          howItWorks="<p>Our NVIDIA NIM-powered engine extracts work-style indicators from your resume (e.g., words like 'independent', 'cross-functional', 'spearheaded'). It then maps these against known public archetypes of your target company (e.g., Amazon's Leadership Principles or startup agility) to calculate a granular match score.</p>"
          whoShouldUse="<ul><li><strong>Candidates in Final Rounds:</strong> When technical skills are equal, culture fit is the tie-breaker. Use this to prepare for the 'behavioral' final round.</li><li><strong>Job Seekers Evaluating Offers:</strong> Ensure the company's DNA aligns with how you do your best work.</li><li><strong>Career Changers:</strong> See how your non-traditional background maps to modern tech culture.</li></ul>"
          benefits="<ul><li><strong>Interview Edge:</strong> Provides exactly what to say to demonstrate you 'get' how the company operates.</li><li><strong>Avoid Toxic Workplaces:</strong> If your values clash with the company's, it's better to know before you accept the offer.</li><li><strong>Confidence Boost:</strong> Walk into the interview knowing exactly why you are a great fit.</li></ul>"
          limitations="<p>Company culture can vary wildly between different teams or managers within the same organization. The AI assesses macro-level corporate culture; it cannot predict the micro-culture of the specific team you will join.</p>"
          bestPractices="<p>When entering the target company, include any specific public values they have (e.g., 'Google - Don't be evil, data-driven'). If it's a smaller company, paste a snippet from their 'About Us' page to give the AI accurate context to analyze.</p>"
          faq={[
            { q: "What if my culture fit score is low?", a: "A low score doesn't mean you shouldn't apply. It simply highlights areas where you might face friction. Use the suggested talking points to address these proactively in your interview." },
            { q: "Can I use this for non-tech companies?", a: "Yes, the psychological trait mapping works across all industries, from finance to healthcare." },
            { q: "Does the AI know every company's values?", a: "It is trained on data up to 2024 for major companies. For startups, we recommend pasting their mission statement directly into the input." }
          ]}
        />
      </div>
    </>
  );
}
