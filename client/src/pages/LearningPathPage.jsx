import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, CheckCircle, Clock, Zap, AlertCircle, FileText, Map } from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import './LearningPathPage.css';

export default function LearningPathPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!resumeText.trim() || !targetRole.trim()) {
      setError('Resume and Target Role are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await resumeAnalyzerAPI.learningPath({
        resumeText,
        targetRole,
        hoursPerWeek
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page-wrapper">
      <SEO 
        title="AI Learning Path Generator | CandidateToHR"
        description="Generate a personalized, step-by-step learning path to bridge the gap between your current skills and your dream job. Master the right tools faster."
        canonical="/learning-path"
      />
      <div className="lp-container">
        
        <div className="lp-header">
          <div className="lp-badge"><Map size={14} /> AI Learning Path Optimizer</div>
          <h1>Map out your exact <span className="gradient-text">skills gap</span>.</h1>
          <p>Tell us your target role and how much time you have. The AI will generate a personalized week-by-week learning roadmap based on your current resume.</p>
        </div>

        <div className="lp-grid">
          
          {/* Inputs */}
          <div className="lp-inputs-card az-card">
            <div className="lp-input-group">
              <label><FileText size={16} /> Your Resume (Text)</label>
              <textarea 
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>

            <div className="lp-input-group">
              <label><Target size={16} /> Target Role</label>
              <input 
                type="text"
                className="lp-input"
                placeholder="e.g. Senior Data Scientist"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              />
            </div>

            <div className="lp-input-group">
              <label><Clock size={16} /> Hours Available Per Week</label>
              <div className="lp-slider-container">
                <input 
                  type="range"
                  min="2" max="40" step="1"
                  value={hoursPerWeek}
                  onChange={e => setHoursPerWeek(Number(e.target.value))}
                />
                <span className="lp-slider-value">{hoursPerWeek} hrs/week</span>
              </div>
            </div>

            {error && <div className="lp-error">{error}</div>}

            <button 
              className="btn btn-primary lp-submit-btn" 
              onClick={handleGenerate} 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Generating Roadmap...</>
              ) : (
                <><Zap size={18} /> Generate My Roadmap</>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="lp-results-pane">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  className="lp-empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Map size={48} className="lp-empty-icon" />
                  <h3>Awaiting Details</h3>
                  <p>Provide your resume and target role to generate a customized learning roadmap.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  className="lp-loading-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="lp-scan-line"></div>
                  <Target size={40} className="lp-pulse-icon" />
                  <h3>Analyzing Skill Gap...</h3>
                  <p>Calculating the fastest path to {targetRole || 'your target role'}.</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  className="lp-result-content"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                >
                  
                  {/* Top Stats */}
                  <div className="lp-stats-row">
                    <div className="lp-stat-box">
                      <span className="lp-stat-label">Current Match</span>
                      <span className="lp-stat-value" style={{ color: result.currentMatchPercentage > 75 ? '#10b981' : '#f59e0b' }}>
                        {result.currentMatchPercentage}%
                      </span>
                    </div>
                    <div className="lp-stat-box">
                      <span className="lp-stat-label">Time to Ready</span>
                      <span className="lp-stat-value" style={{ color: '#06b6d4' }}>
                        {result.timeToReady}
                      </span>
                    </div>
                  </div>

                  <div className="lp-skills-overview">
                    <div className="lp-missing">
                      <h4><AlertCircle size={16}/> Missing Priority Skills</h4>
                      <div className="lp-chips">
                        {result.missingSkills?.map((s, i) => (
                          <span key={i} className={`lp-chip lp-chip-${s.priority?.toLowerCase()}`}>
                            {s.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h4 className="lp-timeline-title">Your Custom Roadmap</h4>
                  <div className="lp-timeline">
                    {result.roadmap?.map((phase, i) => (
                      <div key={i} className="lp-timeline-item">
                        <div className="lp-timeline-marker">
                          <div className="lp-timeline-dot"></div>
                          {i !== result.roadmap.length - 1 && <div className="lp-timeline-line"></div>}
                        </div>
                        <div className="lp-timeline-content">
                          <span className="lp-week-label">{phase.week}</span>
                          <h5>{phase.focus}</h5>
                          <p>{phase.description}</p>
                          <div className="lp-milestone">
                            <CheckCircle size={14} /> <span>Goal: {phase.milestone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lp-cta-box">
                    <p>Done learning? Tailor your resume specifically for this role.</p>
                    <a href="/analyze" className="btn btn-outline">
                      Tailor Resume <ArrowRight size={16} />
                    </a>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
        
        <ToolEditorial 
          whatItDoes="<p>The AI Learning Path Generator transforms an overwhelming skill gap into an actionable, weekly syllabus. It breaks down complex technical or soft skills into manageable milestones, showing you exactly what to study, in what order, to become job-ready.</p>"
          howItWorks="<p>By analyzing your current resume against the requirements of your target role, the AI identifies precisely what is missing. It then sequences these missing skills into a chronological roadmap, estimating the time required for each phase and defining clear, testable milestones.</p>"
          whoShouldUse="<ul><li><strong>Self-Taught Developers:</strong> Stop wandering through tutorial hell and follow a structured path.</li><li><strong>Career Pivoters:</strong> Understand the exact stepping stones required to shift from one industry to another.</li><li><strong>Professionals Seeking Promotion:</strong> Map out the exact leadership or technical skills required for the next level.</li></ul>"
          benefits="<ul><li><strong>Saves Time:</strong> Eliminates the guesswork of 'what should I learn next?'</li><li><strong>Maintains Motivation:</strong> Breaks massive goals into achievable weekly targets.</li><li><strong>Interview-Focused:</strong> The milestones are designed around practical application, which is exactly what hiring managers test for.</li></ul>"
          limitations="<p>The AI estimates the timeline based on average learning curves. Your actual time to completion will vary based on how many hours a week you can dedicate to study and your prior foundational knowledge.</p>"
          bestPractices="<p>Treat the generated roadmap as a living document. When you hit a milestone, update your resume and run the tool again to see if the market requirements have shifted or if you are now ready to apply.</p>"
        />
      </div>
    </div>
  );
}
