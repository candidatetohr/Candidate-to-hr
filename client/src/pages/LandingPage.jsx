import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Brain, Target, BarChart3, Users, Award,
  Shield, ArrowRight, CheckCircle, MessageSquare, TrendingUp,
  FileSearch, Sparkles, AlertTriangle, Map, PieChart, ShieldAlert
} from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: Brain, title: 'AI Resume Analysis', desc: 'NVIDIA NIM scores every resume against your job requirements with 7 AI metrics.', color: '#4f8ef7' },
  { icon: Target, title: 'Skills Gap Detection', desc: 'Instantly identify missing skills and generate personalized learning paths.', color: '#a855f7' },
  { icon: MessageSquare, title: 'Interview Q Generator', desc: 'Auto-generate 10 targeted interview questions for each candidate from their resume.', color: '#10b981' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time pipeline metrics, funnel charts, score distributions, and hiring insights.', color: '#f59e0b' },
  { icon: Users, title: 'Candidate Pipeline', desc: 'Move candidates through stages: Applied → Screening → Interview → Offer → Hired.', color: '#06b6d4' },
  { icon: Shield, title: 'Bias Detection', desc: 'AI scans your job descriptions for biased language and suggests inclusive alternatives.', color: '#ef4444' },
  { icon: TrendingUp, title: 'ATS Score Optimizer', desc: 'Tell candidates exactly how to improve their score to pass your screening.', color: '#10b981' },
  { icon: Award, title: 'Auto Candidate Ranking', desc: 'Rank all applicants by AI score with a single click and get ranking insights.', color: '#a855f7' },
];

const candidateFeatures = [
  { icon: FileSearch, title: 'Instant Resume Score', desc: 'Get a 0–100 AI score across skills, experience, education, and communication.', color: '#4f8ef7' },
  { icon: Zap, title: 'Live AI Editor', desc: 'Watch your score update in real-time as you type and get instant feedback on fixes.', color: '#10b981' },
  { icon: Target, title: 'Career Intelligence Map', desc: "Map your profile against 50+ archetypes and see your salary potential.", color: '#06b6d4' },
  { icon: Map, title: 'Learning Path Optimizer', desc: 'Tell AI your target role and available hours, get a week-by-week curriculum.', color: '#3b82f6' },
  { icon: PieChart, title: 'Placement Probability', desc: 'Input your academic and technical profile to predict exactly what roles you will land.', color: '#8b5cf6' },
  { icon: ShieldAlert, title: 'Resume Truth Detector', desc: 'Scan your resume for overclaiming, contradictions, and missing evidence.', color: '#ef4444' },
  { icon: MessageSquare, title: 'AI Mock Interviews', desc: 'Practice with a real-time AI interviewer that grades your answers and gives you a readiness report.', color: '#f59e0b' },
  { icon: AlertTriangle, title: 'AI Rejection Decoder', desc: 'Paste a rejection email and job description. Get the brutal truth on exactly why you failed.', color: '#ef4444' },
  { icon: TrendingUp, title: 'One-Click Resume Tailor', desc: 'Paste a job description and AI perfectly rewrites your experience to match it.', color: '#ec4899' },
  { icon: Brain, title: 'AI Career Coach', desc: 'Chat directly with an AI coach that knows your resume and can offer career advice.', color: '#a855f7' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Background */}
      <div className="landing-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-grid" />
      </div>



      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-badge">
            <Zap size={12} /> Powered by NVIDIA NIM AI
          </div>
          <h1 className="hero-title">
            AI-Powered{' '}
            <span className="gradient-text">Resume & Hiring</span>{' '}
            Intelligence
          </h1>
          <p className="hero-subtitle">
            Whether you're a <strong>job seeker</strong> wanting to score your resume or a <strong>recruiter</strong> screening hundreds of candidates — Candidatetohr has you covered with NVIDIA NIM AI.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')} id="hero-candidate-btn">
              <Sparkles size={16} /> Analyse Resume
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/live-editor')} style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
              ️ Live AI Editor
            </button>
            <button className="btn btn-ghost btn-lg hero-recruiter-btn" onClick={() => navigate('/login')} id="hero-recruiter-btn">
              For Recruiters <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-stats">
            <div><strong>Free</strong> for candidates</div>
            <div><strong>7+</strong> AI features</div>
            <div><strong>NVIDIA</strong> NIM</div>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="score-demo-card">
            <div className="demo-header">
              <div className="demo-dot red" /><div className="demo-dot yellow" /><div className="demo-dot green" />
              <span>AI Resume Analysis</span>
            </div>
            <div className="demo-body">
              <div className="demo-score">
                <div className="demo-score-circle">
                  <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 * 0.19 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>
                  <div className="demo-score-text">
                    <strong>81</strong><span>/100</span>
                  </div>
                </div>
                <div className="demo-rec strong_hire"> Strong Hire</div>
              </div>
              <div className="demo-metrics">
                {[
                  { label: 'Skills Match', value: 88 },
                  { label: 'Experience', value: 75 },
                  { label: 'Education', value: 90 },
                  { label: 'Communication', value: 82 },
                ].map(({ label, value }) => (
                  <div key={label} className="demo-metric">
                    <span>{label}</span>
                    <div className="demo-bar">
                      <motion.div
                        className="demo-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                    </div>
                    <span>{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>For <span className="gradient-text">Job Seekers</span> — Analyse Your Resume Free</h2>
            <p>Upload your PDF and get a full AI report in under 60 seconds. No account needed.</p>
          </motion.div>

          <div className="features-grid features-grid-4">
            {candidateFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  <feature.icon size={22} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="candidate-cta-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
              <Sparkles size={16} /> Full AI Analysis
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/live-editor')} style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
              ️ Live AI Editor
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/interview-sim')} style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
              <MessageSquare size={16} /> Mock Interview
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/learning-path')} style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}>
              <Map size={16} /> Learning Path
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/placement-probability')} style={{ color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }}>
              <PieChart size={16} /> Probability Engine
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/truth-detector')} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
              <ShieldAlert size={16} /> Truth Detector
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/rejection-decoder')} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
              <AlertTriangle size={16} /> Rejection Decoder
            </button>
          </motion.div>

          <div className="section-divider" />

          <motion.div
            className="section-header-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>For <span className="gradient-text">Recruiters</span> — Everything you need to hire the best talent</h2>
            <p>8 AI-powered features built on NVIDIA NIM and the MERN stack</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  <feature.icon size={22} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to get started?</h2>
          <p>Join as a recruiter or analyse your resume as a candidate — both are free.</p>
          <div className="cta-dual-btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
              <Sparkles size={16} /> Analyse My Resume
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/live-editor')} style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}>
              ️ Live AI Editor
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/interview-sim')} style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>
              <MessageSquare size={16} /> AI Interview
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
              Recruiter Sign Up <ArrowRight size={16} />
            </button>
          </div>
          <div className="cta-checks">
            {['No credit card', 'No account for candidates', 'MERN + NVIDIA NIM', '7 AI features', 'Full pipeline'].map(c => (
              <span key={c}><CheckCircle size={14} color="#10b981" /> {c}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="logo-wrapper" style={{ justifyContent: 'center' }}>
          <img src="/logo.png" alt="CandidateToHR Logo" style={{ height: '28px' }} />
        </div>
        <p>Built with MERN Stack + NVIDIA NIM AI</p>
      </footer>
    </div>
  );
}
