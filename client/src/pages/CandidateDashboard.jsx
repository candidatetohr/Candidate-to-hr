import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, Zap, UploadCloud, FileText, UserPlus, 
  CheckCircle2, Circle, TrendingUp, Search, GraduationCap, Sparkles,
  ChevronRight, BrainCircuit, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import './CandidateDashboard.css';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeGoal, setActiveGoal] = useState('job');

  const journeySteps = [
    { label: "Create Profile", active: true, done: true },
    { label: "Scan Resume", active: false, done: false },
    { label: "Review Matches", active: false, done: false },
    { label: "Mock Interview", active: false, done: false },
    { label: "Placement Ready", active: false, done: false }
  ];

  const goals = [
    { id: 'job', icon: Search, label: 'Find a new job quickly' },
    { id: 'switch', icon: TrendingUp, label: 'Switch career paths' },
    { id: 'prep', icon: Target, label: 'Prepare for interviews' },
    { id: 'growth', icon: GraduationCap, label: 'Level up my skills' }
  ];

  const targetRoles = [
    { title: 'Software Engineer', salary: '$110k - $160k', demand: 'High Demand', tag: 'badge-blue' },
    { title: 'Data Analyst', salary: '$75k - $115k', demand: 'Very High', tag: 'badge-green' },
    { title: 'Product Manager', salary: '$120k - $180k', demand: 'Medium', tag: 'badge-purple' },
    { title: 'Cloud Engineer', salary: '$125k - $170k', demand: 'High Demand', tag: 'badge-blue' }
  ];

  const checklist = [
    { id: 1, text: 'Verify your email address', done: true },
    { id: 2, text: 'Set primary career goal', done: activeGoal !== null },
    { id: 3, text: 'Upload or create your resume', done: false },
    { id: 4, text: 'Scan your resume with AI', done: false }
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="candidate-dashboard-page pb-48">
      <SEO title="Candidate Dashboard" noindex />
      <div className="candidate-container">
        
        <motion.div initial="hidden" animate="show" variants={containerVars} className="candidate-layout-wrapper">
          
          {/* WELCOME HERO */}
          <motion.div className="candidate-hero onboarding-hero" variants={itemVars}>
            <div className="candidate-greeting">
              <h1>Welcome to <span className="premium-gradient-text">CandidateToHR</span>, {user?.name?.split(' ')[0]}</h1>
              <p>Build your career profile and unlock personalized AI insights to land your dream tech job.</p>
            </div>
            <div className="candidate-progress-summary">
              <span className="summary-label">Career Readiness</span>
              <div className="progress-radial-placeholder">
                <span className="percentage">20%</span>
              </div>
            </div>
          </motion.div>

          {/* ACTIVE STEP JOURNEY */}
          <motion.div className="journey-track-card" variants={itemVars}>
            <div className="track-header">
              <h3><BrainCircuit size={18} className="text-violet" /> Your Career Journey Track</h3>
              <p>Complete these steps to achieve full placement readiness</p>
            </div>
            <div className="track-steps">
              {journeySteps.map((step, i) => (
                <div key={i} className={`track-step-node ${step.done ? 'node-done' : ''} ${step.active ? 'node-active' : ''}`}>
                  <div className="step-number">{step.done ? "✓" : i + 1}</div>
                  <span className="step-label">{step.label}</span>
                  {i < journeySteps.length - 1 && <div className="step-line-separator" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* DASHBOARD SPLIT GRID */}
          <div className="candidate-dashboard-grid">
            
            {/* Left Main Column */}
            <div className="candidate-col-main">
              
              {/* Action Toolkit Cards */}
              <div className="toolkit-section-header">
                <h2>AI Career Toolkit</h2>
                <p>Use our AI agents to optimize and prepare</p>
              </div>
              <motion.div className="toolkit-cards-row" variants={itemVars}>
                <div className="toolkit-action-card bg-hover-gradient-blue" onClick={() => navigate('/analyze')}>
                  <div className="toolkit-icon bg-blue"><UploadCloud size={24} /></div>
                  <h3>Upload Resume</h3>
                  <p>Get instant ATS scoring, structural feedback, and skills matching.</p>
                  <span className="action-link">Get Scanned <ChevronRight size={16} /></span>
                </div>
                <div className="toolkit-action-card bg-hover-gradient-purple" onClick={() => navigate('/live-editor')}>
                  <div className="toolkit-icon bg-purple"><FileText size={24} /></div>
                  <h3>Build with AI</h3>
                  <p>Generate a professional ATS-friendly CV dynamically from scratch.</p>
                  <span className="action-link">Start Creating <ChevronRight size={16} /></span>
                </div>
                <div className="toolkit-action-card bg-hover-gradient-green" onClick={() => navigate('/profile/edit')}>
                  <div className="toolkit-icon bg-green"><UserPlus size={24} /></div>
                  <h3>Complete Profile</h3>
                  <p>Manually edit skills, education, and target positions.</p>
                  <span className="action-link">Edit Profile <ChevronRight size={16} /></span>
                </div>
              </motion.div>

              {/* Career Goal Picker */}
              <motion.div className="candidate-glass-card" variants={itemVars}>
                <div className="card-header-with-subtitle">
                  <h3>What is your primary career goal?</h3>
                  <p>This helps us customize recommendations and roadmap discovery</p>
                </div>
                <div className="goals-quiz-grid">
                  {goals.map(goal => (
                    <div 
                      key={goal.id} 
                      className={`goal-quiz-card ${activeGoal === goal.id ? 'quiz-active' : ''}`}
                      onClick={() => setActiveGoal(goal.id)}
                    >
                      <goal.icon size={26} className="goal-quiz-icon" />
                      <span>{goal.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Demand Role Explorer */}
              <motion.div className="candidate-glass-card" variants={itemVars}>
                <div className="card-header-with-subtitle">
                  <h3><TrendingUp size={18} className="text-emerald" /> High-Demand Tech Careers</h3>
                  <p>Explore target positions, global salaries, and tech stack roadmaps</p>
                </div>
                <div className="demand-roles-explorer">
                  {targetRoles.map((role, i) => (
                    <div key={i} className="demand-role-row" onClick={() => navigate('/roadmaps')}>
                      <div className="role-details">
                        <h4>{role.title}</h4>
                        <span className="salary-meta">{role.salary} average pay</span>
                      </div>
                      <div className="role-right-controls">
                        <span className={`demand-indicator ${role.tag}`}>{role.demand}</span>
                        <ChevronRight size={16} className="arrow-nav" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right Side Column */}
            <div className="candidate-col-side">
              
              {/* ATS Scanner Status */}
              <motion.div className="candidate-glass-card scan-status-glowing" variants={itemVars}>
                <div className="scanner-header">
                  <BrainCircuit size={20} className="text-blue" />
                  <h3>ATS Scanner Score</h3>
                </div>
                <div className="score-placeholder-display">
                  <div className="dashed-circle">
                    <FileText size={36} />
                  </div>
                  <h4>No Resume Found</h4>
                  <p>You haven't scanned a resume yet. Let's find your ATS matching percentage.</p>
                  <button className="btn btn-primary-glowing w-full mt-12" onClick={() => navigate('/analyze')}>
                    <Sparkles size={16} /> Scan Resume Now
                  </button>
                </div>
              </motion.div>

              {/* Getting Started Checklist */}
              <motion.div className="candidate-glass-card" variants={itemVars}>
                <div className="card-header-with-subtitle">
                  <h3><CheckCircle2 size={18} className="text-emerald" /> Onboarding Checklist</h3>
                  <p>Finish these steps to configure your smart recruiter profile</p>
                </div>
                <div className="onboarding-steps-list">
                  {checklist.map(item => (
                    <div key={item.id} className={`checklist-item-row ${item.done ? 'step-checked' : ''}`}>
                      <div className="check-bullet">
                        {item.done 
                          ? <CheckCircle2 size={18} className="icon-check active-check" />
                          : <Circle size={18} className="icon-check" />
                        }
                      </div>
                      <span className="step-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Coach Assistant Quote */}
              <motion.div className="candidate-glass-card coach-tip-card-amber" variants={itemVars}>
                <div className="tip-header">
                  <div className="tip-icon-wrapper">
                    <Sparkles size={16} />
                  </div>
                  <span>AI Career Coach Tip</span>
                </div>
                <p>
                  Recruiters spend an average of <strong>7 seconds</strong> reading a resume. To get noticed instantly, structure your CV with clear headers, bulleted impact metrics, and list your top technical tools at the top!
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
