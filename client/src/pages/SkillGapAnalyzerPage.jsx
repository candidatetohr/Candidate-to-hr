import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Crosshair, Map, Compass, Zap, BookMarked, GraduationCap } from 'lucide-react';
import './SkillGapAnalyzerPage.css';

export default function SkillGapAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!resumeText.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult({
        readinessScore: 65,
        missingSkills: [
          { skill: "GraphQL", importance: "High", timeToLearn: "2 weeks" },
          { skill: "Docker / Containerization", importance: "Medium", timeToLearn: "1 week" },
          { skill: "System Design", importance: "High", timeToLearn: "1 month" }
        ],
        learningPath: [
          { step: 1, title: "Master GraphQL Basics", desc: "Understand queries, mutations, and Apollo Client." },
          { step: 2, title: "Containerize an App", desc: "Write a Dockerfile and docker-compose for a full-stack app." },
          { step: 3, title: "System Design Prep", desc: "Read 'Designing Data-Intensive Applications' and practice mock interviews." }
        ]
      });
      setLoading(false);
    }, 2600);
  };

  return (
    <>
      <Helmet>
        <title>AI Skill Gap Analyzer | CandidateToHR</title>
        <meta name="description" content="Compare your resume to your dream job. Our AI Skill Gap Analyzer identifies missing skills and generates a personalized learning path to get you hired." />
        <meta name="keywords" content="skill gap analysis, AI learning path, resume skills, job readiness, career growth" />
      </Helmet>

      <div className="sga-page">
        <div className="sga-container">
          
          <div className="sga-header">
            <div className="sga-badge"><Map size={14} /> AI Skill Gap Analyzer</div>
            <h1>Bridge the gap to your <span className="gradient-text-orange">dream role</span>.</h1>
            <p>Paste your resume and target job title. We'll identify exactly what skills you're missing and create a roadmap to learn them.</p>
          </div>

          <div className="sga-grid">
            {/* Inputs */}
            <div className="sga-inputs-card az-card">
              <div className="sga-input-group">
                <label><Crosshair size={16} /> Target Job Title</label>
                <input 
                  type="text"
                  placeholder="e.g., Senior Frontend Engineer"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                />
              </div>

              <div className="sga-input-group mt-4">
                <label><BookOpen size={16} /> Your Resume</label>
                <textarea 
                  placeholder="Paste your resume content or current skills..."
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  rows={6}
                />
              </div>

              <button 
                className="btn btn-primary sga-submit-btn mt-6" 
                onClick={handleAnalyze} 
                disabled={loading || !resumeText || !targetRole}
              >
                {loading ? (
                  <><span className="spinner"></span> Mapping Skills...</>
                ) : (
                  <><Zap size={18} /> Analyze Skill Gap</>
                )}
              </button>
            </div>

            {/* Results */}
            <div className="sga-results-pane">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    className="sga-empty-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <Compass size={48} className="sga-empty-icon" />
                    <h3>Find Your North Star</h3>
                    <p>Enter your details to generate a custom learning map.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    className="sga-loading-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="sga-radar"></div>
                    <h3>Scanning industry requirements...</h3>
                    <p>Cross-referencing your skills with top job descriptions.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    className="sga-result-content"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  >
                    
                    <div className="sga-score-header">
                      <div className="sga-score-circle">
                        <svg viewBox="0 0 36 36" className="circular-chart orange">
                          <path className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path className="circle"
                            strokeDasharray={`${result.readinessScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage">{result.readinessScore}%</text>
                        </svg>
                      </div>
                      <div className="sga-score-text">
                        <h3>Role Readiness</h3>
                        <p>You have a strong foundation, but there are a few key areas to upskill before applying.</p>
                      </div>
                    </div>

                    <div className="sga-missing-skills">
                      <h4 className="sga-section-title">Critical Missing Skills</h4>
                      <div className="sga-skills-list">
                        {result.missingSkills.map((item, i) => (
                          <div key={i} className="sga-skill-pill">
                            <span className="sga-skill-name">{item.skill}</span>
                            <div className="sga-skill-meta">
                              <span className={`sga-importance ${item.importance.toLowerCase()}`}>{item.importance} Priority</span>
                              <span className="sga-time"><BookMarked size={12}/> {item.timeToLearn}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sga-learning-path">
                      <h4 className="sga-section-title"><GraduationCap size={18} /> Recommended Learning Path</h4>
                      <div className="sga-timeline">
                        {result.learningPath.map((step, i) => (
                          <div key={i} className="sga-timeline-item">
                            <div className="sga-timeline-dot">{step.step}</div>
                            <div className="sga-timeline-content">
                              <h5>{step.title}</h5>
                              <p>{step.desc}</p>
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
