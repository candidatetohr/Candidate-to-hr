import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, Zap, UploadCloud, FileText, UserPlus, 
  Map, Lock, CheckCircle2, Circle, TrendingUp, Search, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    <div className="os-page pb-12">
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
              <motion.div className="os-card mt-4" variants={itemVars}>
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
              <motion.div className="os-card mt-4" variants={itemVars}>
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
              
              {/* Profile Completion Widget */}
              <motion.div className="os-card locked-widget" variants={itemVars}>
                <h3>Profile Completion</h3>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '0%' }} /></div>
                <p className="progress-text">0% Complete</p>
                
                <div className="unlock-list mt-4">
                  <p className="os-subtext">Complete your profile to unlock:</p>
                  <ul>
                    <li><Lock size={14} /> AI ATS Analysis</li>
                    <li><Lock size={14} /> Smart Job Matching</li>
                    <li><Lock size={14} /> Interview Readiness</li>
                    <li><Lock size={14} /> Placement Probability</li>
                    <li><Lock size={14} /> Career Twin Widget</li>
                    <li><Lock size={14} /> Salary Simulator</li>
                  </ul>
                </div>
              </motion.div>

              {/* Setup Checklist */}
              <motion.div className="os-card mt-4" variants={itemVars}>
                <h3><Zap size={18} className="text-yellow" /> Getting Started</h3>
                <div className="os-action-list mt-2">
                  {checklist.map(item => (
                    <div key={item.id} className={`os-action-item ${item.done ? 'done' : ''}`}>
                      <div className="os-checkbox-static">
                        {item.done ? <CheckCircle2 size={18} className="text-green" /> : <Circle size={18} className="text-muted" />}
                      </div>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Career Journey Wizard */}
              <motion.div className="os-card os-timeline-card mt-4" variants={itemVars}>
                <h3><Map size={18} /> Your Journey</h3>
                <div className="os-timeline vertical-timeline">
                  {steps.map((step, i) => (
                    <div key={i} className={`os-timeline-step-v ${step.active ? 'active' : ''}`}>
                      <div className="os-step-dot-v">{step.active && <CheckCircle2 size={12} />}</div>
                      <div className="os-step-content-v">
                        <span className="os-step-label-v">{step.label}</span>
                      </div>
                      {i < steps.length - 1 && <div className="os-step-line-v" />}
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
