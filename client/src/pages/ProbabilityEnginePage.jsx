import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, GraduationCap, Code, Briefcase, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import './ProbabilityEnginePage.css';

export default function ProbabilityEnginePage() {
  const [cgpa, setCgpa] = useState('');
  const [degree, setDegree] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!skills.trim() || !projects.trim()) {
      setError('Skills and Projects/Experience are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await resumeAnalyzerAPI.placementProbability({
        cgpa,
        degree,
        skills,
        projects
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to predict placement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prob-page">
      <div className="prob-container">
        
        <div className="prob-header">
          <div className="prob-badge"><PieChart size={14} /> Statistical Placement Engine</div>
          <h1>Calculate your <span className="gradient-text">hiring probability</span>.</h1>
          <p>Input your academic and technical profile to let the AI predict your exact probability of landing specific roles, complete with salary estimates.</p>
        </div>

        <div className="prob-grid">
          
          {/* Inputs */}
          <div className="prob-inputs-card az-card">
            <div className="prob-row-inputs">
              <div className="prob-input-group">
                <label><GraduationCap size={16} /> Degree / Major</label>
                <input 
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                />
              </div>
              <div className="prob-input-group">
                <label>CGPA</label>
                <input 
                  type="text"
                  placeholder="e.g. 8.5/10"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                />
              </div>
            </div>

            <div className="prob-input-group">
              <label><Code size={16} /> Top Skills (Comma separated)</label>
              <textarea 
                placeholder="Python, React, Node.js, AWS..."
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="prob-small-textarea"
              />
            </div>

            <div className="prob-input-group">
              <label><Briefcase size={16} /> Projects & Experience Summary</label>
              <textarea 
                placeholder="Built an e-commerce platform using MERN stack. Interned at XYZ corp as a frontend dev..."
                value={projects}
                onChange={e => setProjects(e.target.value)}
              />
            </div>

            {error && <div className="prob-error">{error}</div>}

            <button 
              className="btn btn-primary prob-submit-btn" 
              onClick={handlePredict} 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Running Simulation...</>
              ) : (
                <><Zap size={18} /> Predict My Future</>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="prob-results-pane">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  className="prob-empty-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <TrendingUp size={48} className="prob-empty-icon" />
                  <h3>Waiting for Data</h3>
                  <p>Provide your profile details to run the statistical prediction model.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  className="prob-loading-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <PieChart size={50} className="prob-spin-icon" />
                  <h3>Running 10,000 Simulations...</h3>
                  <p>Comparing your profile against active market trends and hiring data.</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div 
                  className="prob-result-content"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                  
                  {/* Top Stats */}
                  <div className="prob-profile-strength">
                    <div className="strength-circle">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                          strokeDasharray={`${result.profileStrength}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="strength-text">
                        <span className="val">{result.profileStrength}</span>
                        <span className="lbl">Overall Strength</span>
                      </div>
                    </div>
                    <div className="strength-info">
                      <div className="info-block blocker">
                        <h5><AlertTriangle size={14}/> Biggest Blocker</h5>
                        <p>{result.biggestBlocker}</p>
                      </div>
                      <div className="info-block win">
                        <h5><CheckCircle size={14}/> Quick Win</h5>
                        <p>{result.quickWin}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="prob-roles-title">Predicted Placement Roles</h3>
                  <div className="prob-roles-grid">
                    {result.topRoles?.map((role, i) => (
                      <motion.div 
                        key={i} 
                        className="prob-role-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="role-header">
                          <h4>{role.title}</h4>
                          <span className="salary-tag">{role.salaryEstimate}</span>
                        </div>
                        
                        <div className="role-prob-bar-container">
                          <div className="role-prob-meta">
                            <span>Placement Probability</span>
                            <span style={{ color: role.probability > 70 ? '#10b981' : role.probability > 40 ? '#f59e0b' : '#ef4444' }}>
                              {role.probability}%
                            </span>
                          </div>
                          <div className="role-prob-bar-bg">
                            <motion.div 
                              className="role-prob-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${role.probability}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (i * 0.1) }}
                              style={{ background: role.probability > 70 ? '#10b981' : role.probability > 40 ? '#f59e0b' : '#ef4444' }}
                            ></motion.div>
                          </div>
                        </div>

                        <p className="role-reason">"{role.why}"</p>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}
