import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, Building, Briefcase, Zap, Heart, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import './CultureFitAnalyzerPage.css';

export default function CultureFitAnalyzerPage() {
  const [candidateProfile, setCandidateProfile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!candidateProfile.trim() || !companyName.trim()) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult({
        overallMatch: 88,
        verdict: "Strong Alignment",
        traits: [
          { name: "Innovation", score: 92, note: "Both you and the company heavily prioritize continuous learning and cutting-edge tech." },
          { name: "Collaboration", score: 85, note: "Your background in cross-functional teams aligns well with their matrix structure." },
          { name: "Autonomy", score: 70, note: "The company leans towards guided processes, while you index slightly higher on independence." }
        ],
        talkingPoints: [
          "Highlight your experience leading the hackathon in your interview.",
          "Ask about their specific onboarding process for remote teams.",
          "Emphasize your willingness to mentor junior developers."
        ]
      });
      setLoading(false);
    }, 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <Helmet>
        <title>AI Culture Fit Analyzer | CandidateToHR</title>
        <meta name="description" content="Discover if you are a culture fit for your dream company. Our AI Culture Fit Analyzer compares your profile with company values to give you deep insights." />
        <meta name="keywords" content="culture fit, AI culture analysis, interview prep, company culture match" />
      </Helmet>

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
      </div>
    </>
  );
}
