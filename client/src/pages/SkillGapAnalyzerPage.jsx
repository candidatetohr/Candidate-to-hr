import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Crosshair, Map, Compass, Zap, BookMarked, GraduationCap } from 'lucide-react';
import './SkillGapAnalyzerPage.css';

import { resumeAnalyzerAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';

export default function SkillGapAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !targetRole.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await resumeAnalyzerAPI.skillGapPublic({ resumeText, targetRole });
      if (res.data?.success) {
        setResult(res.data.data);
      } else {
        alert(res.data?.message || 'Error analyzing skill gap.');
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
        title="AI Skill Gap Analyzer | CandidateToHR"
        description="Compare your resume to your dream job. Our AI Skill Gap Analyzer identifies missing skills and generates a personalized learning path to get you hired."
        canonical="/skill-gap"
        type="SoftwareApplication"
        schema={{
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": "https://candidatetohr.online/skill-gap/#app",
          "name": "CandidateToHR AI Skill Gap Analyzer",
          "alternateName": "CandidateToHR Skill Assessor",
          "url": "https://candidatetohr.online/skill-gap",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Compare your resume to your dream job. Our AI Skill Gap Analyzer identifies missing skills and generates a personalized learning path to get you hired.",
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
        
        <ToolEditorial 
          whatItDoes="<p>The AI Skill Gap Analyzer evaluates your current resume against the requirements of your target job title. It acts as an intelligent career coach, rapidly scanning industry standards and thousands of job descriptions to pinpoint exactly which technical and soft skills you are missing.</p>"
          howItWorks="<p>Powered by advanced natural language processing (NLP) via NVIDIA NIM, the tool extracts your existing competencies. It then queries a vast dataset of job requirements for your target role. Finally, it calculates a readiness score and plots a step-by-step learning path to help you bridge the gap efficiently.</p>"
          whoShouldUse="<ul><li><strong>Career Changers:</strong> Understand what it takes to transition into a new field.</li><li><strong>Ambitious Professionals:</strong> Identify the specific tools needed for a promotion.</li><li><strong>Recent Graduates:</strong> Discover which practical skills employers expect beyond theoretical knowledge.</li></ul>"
          benefits="<ul><li><strong>Time-Saving:</strong> Stops you from blindly guessing what to learn next.</li><li><strong>Actionable Roadmaps:</strong> Provides a sequenced, step-by-step learning plan.</li><li><strong>Objective Feedback:</strong> Removes the bias from self-assessment.</li></ul>"
          limitations="<p>While highly accurate, the analyzer relies entirely on the text you provide. If your resume is poorly formatted or omits key experiences, the AI may incorrectly flag a skill as missing. Always ensure you provide a comprehensive summary of your background.</p>"
          bestPractices="<p>For the best results, paste an up-to-date, detailed version of your resume. When entering a target role, be specific (e.g., 'Senior React Developer' instead of just 'Developer'). Re-run the analysis every 3-6 months to track your progress.</p>"
          faq={[
            { q: "Is the readiness score an exact metric?", a: "No, it is an AI-estimated benchmark to help you gauge your relative competitiveness. It shouldn't be seen as an absolute guarantee of getting hired." },
            { q: "Does the tool recommend specific courses?", a: "Currently, it outlines the topics you need to learn. We are working on integrating direct links to top-rated courses." },
            { q: "Can I use this for non-technical roles?", a: "Yes! The tool works for marketing, finance, HR, and other domains by cross-referencing industry-specific terminology." }
          ]}
        />
      </div>
      <InternalLinksFooter />
    </>
  );
}
