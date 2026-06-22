import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, Zap, UploadCloud, FileText, UserPlus, 
  CheckCircle2, Circle, TrendingUp, Search, GraduationCap, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import './CandidateDashboard.css';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeGoal, setActiveGoal] = useState(null);

  const steps = [
    { label: "Upload Resume", active: false },
    { label: "Analyze Resume", active: false },
    { label: "Discover Matches", active: false },
    { label: "Practice Interviews", active: false },
    { label: "Placement Ready", active: false }
  ];

  const goals = [
    { id: 'job', icon: Search, label: 'Find a new job quickly' },
    { id: 'switch', icon: TrendingUp, label: 'Switch career paths' },
    { id: 'prep', icon: Target, label: 'Prepare for interviews' },
    { id: 'growth', icon: GraduationCap, label: 'Level up my skills' }
  ];

  const targetRoles = [
    { title: 'Software Engineer', salary: '$110k - $160k', demand: 'High Demand', tag: 'bg-blue' },
    { title: 'Data Analyst', salary: '$75k - $115k', demand: 'Very High', tag: 'bg-green' },
    { title: 'Product Manager', salary: '$120k - $180k', demand: 'Medium Demand', tag: 'bg-purple' }
  ];

  const checklist = [
    { id: 1, text: 'Verify your email address', done: true },
    { id: 2, text: 'Set your primary career goal', done: activeGoal !== null },
    { id: 3, text: 'Upload or create your resume', done: false },
    { id: 4, text: 'Select a target role', done: false }
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="os-page pb-48">
      <SEO title="Candidate Dashboard" noindex />
      <div className="os-container">
        
        <motion.div initial="hidden" animate="show" variants={containerVars} className="os-fade-wrapper">
          
          {/* HERO SECTION */}
          <motion.div className="os-hero onboarding-hero" variants={itemVars}>
            <div className="os-greeting">
              <h1>Welcome to <span className="gradient-text">Candidatetohr</span>, {user?.name?.split(' ')[0]}</h1>
              <p>Let's build your career profile and unlock personalized AI career insights.</p>
            </div>
          </motion.div>

          <div className="os-grid">
            {/* LEFT COLUMN */}
            <div className="os-col-main">
              
              {/* Primary Actions */}
              <motion.div className="os-action-cards" variants={itemVars}>
                <div className="os-card hover-card" onClick={() => navigate('/analyze')}>
                  <div className="icon-wrapper bg-blue"><UploadCloud size={24} /></div>
                  <h3>Upload Resume</h3>
                  <p>Get ATS analysis, job matching, and personalized recommendations.</p>
                </div>
                <div className="os-card hover-card" onClick={() => navigate('/live-editor')}>
                  <div className="icon-wrapper bg-purple"><FileText size={24} /></div>
                  <h3>Create Resume With AI</h3>
                  <p>Generate a professional ATS-friendly resume from scratch.</p>
                </div>
                <div className="os-card hover-card" onClick={() => navigate('/profile/edit')}>
                  <div className="icon-wrapper bg-green"><UserPlus size={24} /></div>
                  <h3>Complete Profile</h3>
                  <p>Add skills, education, projects, and career goals manually.</p>
                </div>
              </motion.div>

              {/* Career Goal Quiz */}
              <motion.div className="os-card mt-16" variants={itemVars}>
                <div className="os-card-header">
                  <h3><Target size={18} /> What brings you to Candidatetohr?</h3>
                </div>
                <div className="goal-grid">
                  {goals.map(goal => (
                    <div 
                      key={goal.id} 
                      className={`goal-card ${activeGoal === goal.id ? 'active' : ''}`}
                      onClick={() => setActiveGoal(goal.id)}
                    >
                      <goal.icon size={24} className="goal-icon" />
                      <span>{goal.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Target Role Explorer */}
              <motion.div className="os-card mt-16" variants={itemVars}>
                <div className="os-card-header">
                  <h3><TrendingUp size={18} /> Explore High-Demand Roles</h3>
                  <p className="os-subtext">Discover what you could unlock.</p>
                </div>
                <div className="role-explorer-list">
                  {targetRoles.map((role, i) => (
                    <div key={i} className="role-explorer-item">
                      <div className="role-info">
                        <h4>{role.title}</h4>
                        <span className="role-salary">{role.salary}</span>
                      </div>
                      <div className={`role-tag ${role.tag}`}>{role.demand}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="os-col-side">
              {/* ATS Resume Scanner Widget */}
              <motion.div className="os-card" variants={itemVars} style={{ background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h3><Search size={18} className="text-blue" /> ATS Scanner</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px dashed var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                    <FileText size={32} />
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Score Not Found</h4>
                  <p className="os-subtext" style={{ marginBottom: '20px' }}>Upload your resume to unlock your AI match score.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/analyze')} style={{ width: '100%' }}>
                    <Sparkles size={16} /> Scan Resume Now
                  </button>
                </div>
              </motion.div>

              {/* Onboarding Checklist */}
              <motion.div className="os-card mt-16" variants={itemVars}>
                <div className="os-card-header">
                  <h3><CheckCircle2 size={18} /> Getting Started Checklist</h3>
                  <p className="os-subtext">Complete these steps to unlock the full platform.</p>
                </div>
                <div className="os-checklist">
                  {checklist.map(item => (
                    <div key={item.id} className={`os-checklist-item ${item.done ? 'done' : ''}`}>
                      {item.done
                        ? <CheckCircle2 size={16} className="check-icon done" />
                        : <Circle size={16} className="check-icon" />
                      }
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Progress Steps */}
              <motion.div className="os-card mt-16" variants={itemVars}>
                <div className="os-card-header">
                  <h3>Your Career Journey</h3>
                </div>
                <div className="os-steps">
                  {steps.map((step, i) => (
                    <div key={i} className={`os-step ${step.active ? 'active' : ''}`}>
                      <div className="os-step-dot">{i + 1}</div>
                      <span className="os-step-label">{step.label}</span>
                      {i < steps.length - 1 && <div className="os-step-line" />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Coach Tip */}
              <motion.div className="os-card mt-16" variants={itemVars} style={{ background: 'var(--bg-card)', borderLeft: '4px solid #a855f7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '6px', borderRadius: '8px', color: '#a855f7' }}>
                    <Zap size={16} />
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Coach Tip</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  Did you know? Including quantifiable metrics in your bullet points (e.g. <strong>"increased sales by 20%"</strong>) boosts your ATS match rate by up to 40%.
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
