import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, GraduationCap, Code, Briefcase, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';
import './ProbabilityEnginePage.css';

export default function ProbabilityEnginePage() {
  const [cgpa, setCgpa] = useState('');
  const [degree, setDegree] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const skillsRef = useRef(null);
  const projectsRef = useRef(null);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!skills.trim()) {
      setError('Skills are required.');
      skillsRef.current?.focus();
      return;
    }
    if (!projects.trim()) {
      setError('Projects/Experience summary is required.');
      projectsRef.current?.focus();
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
      skillsRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prob-page-wrapper">
      <SEO 
        title="AI Placement Probability Engine | CandidateToHR"
        description="Calculate your exact statistical probability of landing your target role. Get salary estimates and identify your biggest blockers."
        canonical="/placement-probability"
        type="SoftwareApplication"
        schema={{
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": "https://candidatetohr.online/placement-probability/#app",
          "name": "CandidateToHR AI Placement Probability Engine",
          "alternateName": "CandidateToHR Placement Engine",
          "url": "https://candidatetohr.online/placement-probability",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Calculate your exact statistical probability of landing your target role. Get salary estimates and identify your biggest blockers.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://candidatetohr.online/#organization",
            "name": "CandidateToHR"
          }
        }}
      />
      <div className="prob-container">
        
        <div className="prob-header">
          <div className="prob-badge"><PieChart size={14} /> Statistical Placement Engine</div>
          <h1>Calculate your <span className="gradient-text">hiring probability</span>.</h1>
          <p>Input your academic and technical profile to let the AI predict your exact probability of landing specific roles, complete with salary estimates.</p>
        </div>

        <div className="prob-grid">
          
          {/* Inputs */}
          <form className="prob-inputs-card az-card" onSubmit={handlePredict}>
            <div className="prob-row-inputs">
              <div className="prob-input-group">
                <label htmlFor="prob-degree"><GraduationCap size={16} /> Degree / Major</label>
                <input 
                  id="prob-degree"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                />
              </div>
              <div className="prob-input-group">
                <label htmlFor="prob-cgpa">CGPA</label>
                <input 
                  id="prob-cgpa"
                  type="text"
                  placeholder="e.g. 8.5/10"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                />
              </div>
            </div>

            <div className="prob-input-group">
              <label htmlFor="prob-skills"><Code size={16} /> Top Skills (Comma separated)</label>
              <textarea 
                ref={skillsRef}
                id="prob-skills"
                placeholder="Python, React, Node.js, AWS..."
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="prob-small-textarea"
              />
            </div>

            <div className="prob-input-group">
              <label htmlFor="prob-projects"><Briefcase size={16} /> Projects & Experience Summary</label>
              <textarea 
                ref={projectsRef}
                id="prob-projects"
                placeholder="Built an e-commerce platform using MERN stack. Interned at XYZ corp as a frontend dev..."
                value={projects}
                onChange={e => setProjects(e.target.value)}
              />
            </div>

            {error && <div className="prob-error" role="alert">{error}</div>}

            <button 
              type="submit"
              className="btn btn-primary prob-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Running Simulation...</>
              ) : (
                <><Zap size={18} /> Predict My Future</>
              )}
            </button>
          </form>

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
        
        <ToolEditorial 
          whatItDoes="<p>The AI Placement Probability Engine calculates the statistical likelihood of you landing specific roles based on your current academic and technical profile. It also estimates your market salary value and identifies the single biggest 'blocker' preventing you from moving up a tier.</p>"
          howItWorks="<p>We process your degree, GPA, tech stack, and project summaries through a model trained on thousands of recent tech hires. The AI compares your specific combination of variables against the profiles of candidates who successfully landed roles (e.g., at FAANG vs. Series B startups vs. IT Services) to generate a percentage-based probability.</p>"
          whoShouldUse="<ul><li><strong>College Seniors / Freshers:</strong> Set realistic expectations before campus placements begin.</li><li><strong>Professionals Considering a Masters:</strong> See if the 'degree' variable actually moves the needle on your probability for specific roles.</li><li><strong>Self-Taught Engineers:</strong> Discover which missing project or skill is artificially holding your probability back.</li></ul>"
          benefits="<ul><li><strong>Realistic Benchmarking:</strong> Avoid the trap of applying to 500 jobs you have a 1% chance of landing.</li><li><strong>Salary Optimization:</strong> Know your mathematical worth before walking into an HR negotiation.</li><li><strong>Targeted Improvement:</strong> Focus solely on the 'Biggest Blocker' rather than trying to learn everything at once.</li></ul>"
          limitations="<p>Probability is not destiny. The engine cannot account for your soft skills, interview performance, or networking ability (which can drastically alter your real-world chances). It strictly analyzes the baseline competitiveness of your paper profile.</p>"
          bestPractices="<p>Be brutally honest with your inputs. Don't list a skill unless you can pass a technical interview on it. Play around with the variables—add a new hypothetical project or skill to see how much it increases your probability score, then go build that project!</p>"
        />
      </div>
      <InternalLinksFooter />
    </div>
  );
}
