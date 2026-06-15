import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, FileText, ArrowRight, Save, Copy, Download, Briefcase, 
  User, CheckCircle, RefreshCw, Zap, ExternalLink, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './ResumeBuilderPage.css';

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // input | loading | result
  const [brainDump, setBrainDump] = useState('');
  const [generatedResume, setGeneratedResume] = useState(null);

  const generateResume = async () => {
    if (!brainDump.trim() || brainDump.trim().length < 50) {
      toast.error('Please write a bit more detail so the AI can build a proper resume!');
      return;
    }

    setStep('loading');
    
    try {
      const response = await fetch('/api/resume-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawDetails: brainDump })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedResume(data.data);
        setStep('result');
        toast.success('Resume built successfully!');
      } else {
        toast.error(data.message || 'Failed to build resume');
        setStep('input');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
      setStep('input');
    }
  };

  return (
    <div className="rb-page">
      <SEO 
        title="AI Resume Builder | Create a Professional CV from Scratch"
        description="Turn your messy notes into a perfect, ATS-optimized resume. Our AI Resume Builder structures your experience and skills instantly."
        canonical="/resume-builder"
        type="SoftwareApplication"
      />
      <div className="rb-bg">
        <div className="rb-orb rb-orb-1" />
        <div className="rb-orb rb-orb-2" />
      </div>

      <div className="rb-container">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <motion.div 
              key="input"
              className="rb-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="rb-header">
                <div className="rb-badge"><Zap size={12} /> NIM Powered</div>
                <h1>AI Resume <span className="rb-gradient">Builder</span></h1>
                <p>No resume? No problem. Just dump your thoughts, experience, and skills below. Our AI will magically structure it into a professional, ATS-friendly resume.</p>
              </div>

              <div className="rb-input-area">
                <label className="rb-label">Your Experience Brain Dump</label>
                <textarea
                  className="rb-textarea"
                  placeholder="Example: I worked at Starbucks in 2019 as a barista, then went to college at NYU for computer science. I graduated in 2023. While there I built a React app for a local bakery and a Node.js API for tracking my workouts. I know python, java, javascript, and sql. I want a software engineer job..."
                  value={brainDump}
                  onChange={e => setBrainDump(e.target.value)}
                  rows={10}
                />
                <div className="rb-input-footer">
                  <span className="rb-word-count">{brainDump.length} characters (min 50)</span>
                  <button 
                    className="rb-btn-primary" 
                    onClick={generateResume}
                    disabled={brainDump.length < 50}
                  >
                    <Wand2 size={16} /> Build My Resume
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOADING */}
          {step === 'loading' && (
            <motion.div 
              key="loading"
              className="rb-card rb-loading-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rb-spinner-wrap">
                <div className="rb-spinner" />
                <Wand2 size={24} className="rb-spinner-icon" />
              </div>
              <h2>Building Your Resume</h2>
              <p>NVIDIA NIM is structuring your experience, extracting skills, and writing professional bullets...</p>
            </motion.div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && generatedResume && (
            <motion.div 
              key="result"
              className="rb-result-layout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="rb-sidebar">
                <div className="rb-sidebar-card">
                  <div className="rb-badge"><CheckCircle size={12} /> Resume Ready</div>
                  <h3>Success!</h3>
                  <p>Your brain dump was successfully transformed into a professional resume.</p>
                  
                  <div className="rb-actions">
                    <button className="rb-btn-secondary" onClick={() => window.print()}>
                      <Download size={14} /> Download PDF
                    </button>
                    <button className="rb-btn-secondary" onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedResume, null, 2));
                      toast.success('Copied JSON to clipboard');
                    }}>
                      <Copy size={14} /> Copy JSON
                    </button>
                    <button className="rb-btn-ghost" onClick={() => {
                      setStep('input');
                      setGeneratedResume(null);
                    }}>
                      <RefreshCw size={14} /> Start Over
                    </button>
                  </div>
                </div>
                
                <div className="rb-sidebar-card rb-promo">
                  <Zap size={20} color="#a855f7" />
                  <h4>Next Steps</h4>
                  <p>Now that you have a resume, test how well it performs against real jobs.</p>
                  <button className="rb-btn-outline" onClick={() => navigate('/analyze')}>
                    Analyze Resume <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Resume Preview */}
              <div className="rb-preview">
                <div className="rb-preview-header">
                  <h1 className="rb-name">{generatedResume.personalInfo?.name || 'Your Name'}</h1>
                  <div className="rb-contact">
                    {generatedResume.personalInfo?.email && <span>{generatedResume.personalInfo.email}</span>}
                    {generatedResume.personalInfo?.phone && <span>{generatedResume.personalInfo.phone}</span>}
                    {generatedResume.personalInfo?.location && <span>{generatedResume.personalInfo.location}</span>}
                  </div>
                </div>

                {generatedResume.summary && (
                  <div className="rb-section">
                    <p className="rb-summary">{generatedResume.summary}</p>
                  </div>
                )}

                {generatedResume.experience?.length > 0 && (
                  <div className="rb-section">
                    <h2 className="rb-section-title">Experience</h2>
                    {generatedResume.experience.map((exp, i) => (
                      <div key={i} className="rb-item">
                        <div className="rb-item-header">
                          <span className="rb-item-title">{exp.title}</span>
                          <span className="rb-item-date">{exp.date}</span>
                        </div>
                        <div className="rb-item-sub">{exp.company} {exp.location ? `| ${exp.location}` : ''}</div>
                        <ul className="rb-bullets">
                          {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {generatedResume.projects?.length > 0 && (
                  <div className="rb-section">
                    <h2 className="rb-section-title">Projects</h2>
                    {generatedResume.projects.map((proj, i) => (
                      <div key={i} className="rb-item">
                        <div className="rb-item-header">
                          <span className="rb-item-title">{proj.name}</span>
                          <span className="rb-item-date">{proj.date}</span>
                        </div>
                        <div className="rb-item-sub">{proj.technologies}</div>
                        <ul className="rb-bullets">
                          {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {generatedResume.education?.length > 0 && (
                  <div className="rb-section">
                    <h2 className="rb-section-title">Education</h2>
                    {generatedResume.education.map((edu, i) => (
                      <div key={i} className="rb-item">
                        <div className="rb-item-header">
                          <span className="rb-item-title">{edu.school}</span>
                          <span className="rb-item-date">{edu.date}</span>
                        </div>
                        <div className="rb-item-sub">{edu.degree} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}

                {generatedResume.skills && Object.keys(generatedResume.skills).length > 0 && (
                  <div className="rb-section">
                    <h2 className="rb-section-title">Skills</h2>
                    <div className="rb-skills-grid">
                      {Object.entries(generatedResume.skills).map(([category, skills]) => (
                        <div key={category} className="rb-skill-category">
                          <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong> {Array.isArray(skills) ? skills.join(', ') : skills}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
