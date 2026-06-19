import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI } from '../services/api';
import {
  ArrowLeft, Zap, CheckCircle, XCircle, AlertCircle,
  Brain, Target, BookOpen, TrendingUp, ChevronDown, ChevronUp,
  MessageSquare, Lightbulb, Award, User, Mail, Phone,
  RefreshCw, Clock
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './CandidateFeedbackPage.css';

const recommendationConfig = {
  strong_hire: { label: 'Strong Hire', color: '#10b981', bg: 'rgba(16,185,129,0.1)', emoji: '' },
  hire: { label: 'Hire', color: '#4f8ef7', bg: 'rgba(79,142,247,0.1)', emoji: '' },
  maybe: { label: 'Maybe', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', emoji: '' },
  no_hire: { label: 'Do Not Hire', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', emoji: '' },
};

const ScoreCircle = ({ score, size = 120, label }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="score-circle-wrapper">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="score-circle-label" style={{ color }}>
        <div className="score-number">{score}</div>
        <div className="score-out-of">/100</div>
      </div>
      {label && <div className="score-circle-title">{label}</div>}
    </div>
  );
};

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible-section">
      <button className="collapsible-header" onClick={() => setOpen(!open)}>
        <div className="collapsible-title">
          <Icon size={16} />
          <span>{title}</span>
          {badge && <span className="collapsible-badge">{badge}</span>}
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="collapsible-body"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CandidateFeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [interviewQs, setInterviewQs] = useState(null);
  const [skillsGap, setSkillsGap] = useState(null);
  const [optimizer, setOptimizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iqLoading, setIqLoading] = useState(false);
  const [gapLoading, setGapLoading] = useState(false);
  const [optLoading, setOptLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationsAPI.getOne(id);
        setApplication(res.data.data);
      } catch {
        toast.error('Failed to load application.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // Poll if analysis is still processing
    const interval = setInterval(async () => {
      try {
        const res = await applicationsAPI.getOne(id);
        const app = res.data.data;
        if (app.analysisStatus === 'completed' || app.analysisStatus === 'failed') {
          setApplication(app);
          clearInterval(interval);
        }
      } catch { clearInterval(interval); }
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const loadInterviewQuestions = async () => {
    if (interviewQs) return;
    setIqLoading(true);
    try {
      const res = await applicationsAPI.getInterviewQuestions(id);
      setInterviewQs(res.data.data);
    } catch {
      toast.error('Failed to generate interview questions.');
    } finally {
      setIqLoading(false);
    }
  };

  const loadSkillsGap = async () => {
    if (skillsGap) return;
    setGapLoading(true);
    try {
      const res = await applicationsAPI.getSkillsGap(id);
      setSkillsGap(res.data.data);
    } catch {
      toast.error('Failed to load skills gap analysis.');
    } finally {
      setGapLoading(false);
    }
  };

  const loadOptimizer = async () => {
    if (optimizer) return;
    setOptLoading(true);
    try {
      const res = await applicationsAPI.getOptimizer(id);
      setOptimizer(res.data.data);
    } catch {
      toast.error('Failed to load ATS optimizer.');
    } finally {
      setOptLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      await applicationsAPI.updateStatus(id, { status: newStatus });
      setApplication(prev => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <p>Application not found.</p>
        </div>
      </div>
    );
  }

  const { aiAnalysis, analysisStatus } = application;
  const isProcessing = analysisStatus === 'processing' || analysisStatus === 'pending';
  const rec = recommendationConfig[aiAnalysis?.recommendation] || recommendationConfig.maybe;

  const radarData = aiAnalysis ? [
    { subject: 'Skills', value: aiAnalysis.skillsMatchScore || 0 },
    { subject: 'Experience', value: aiAnalysis.experienceMatchScore || 0 },
    { subject: 'Education', value: aiAnalysis.educationMatchScore || 0 },
    { subject: 'Communication', value: aiAnalysis.communicationScore || 0 },
  ] : [];

  const PIPELINE_STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  return (
    <div className="page-wrapper">
      <SEO title="Candidate Feedback" noindex />
      <div className="container feedback-page">
        {/* Header */}
        <div className="feedback-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="candidate-title">
            <div className="candidate-avatar">
              {application.candidateName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h1>{application.candidateName}</h1>
              <div className="candidate-contacts">
                {application.candidateEmail && <span><Mail size={12} />{application.candidateEmail}</span>}
                {application.candidatePhone && <span><Phone size={12} />{application.candidatePhone}</span>}
                {application.resumeFileName && <span><BookOpen size={12} />{application.resumeFileName}</span>}
              </div>
            </div>
          </div>
          {/* Pipeline Stage Selector */}
          <div className="status-selector">
            <select
              className="form-select"
              value={application.status}
              onChange={e => updateStatus(e.target.value)}
              disabled={statusLoading}
              id="pipeline-status-select"
            >
              {PIPELINE_STAGES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <motion.div
            className="processing-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="spinner" />
            <div>
              <strong>AI Analysis Running...</strong>
              <p>NVIDIA NIM is analyzing this resume. Page will update automatically.</p>
            </div>
            <RefreshCw size={16} className="animate-pulse" />
          </motion.div>
        )}

        {analysisStatus === 'completed' && aiAnalysis && (
          <>
            {/* Score Overview */}
            <div className="score-overview-grid">
              {/* Main Score */}
              <motion.div
                className="main-score-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="main-score-header">
                  <div>
                    <h2>ATS Score</h2>
                    <p>Overall match against job requirements</p>
                  </div>
                  <div
                    className="recommendation-badge"
                    style={{ background: rec.bg, color: rec.color, borderColor: `${rec.color}33` }}
                  >
                    {rec.emoji} {rec.label}
                  </div>
                </div>
                <div className="score-display-row">
                  <ScoreCircle score={aiAnalysis.overallScore} size={140} />
                  <div className="sub-scores">
                    {[
                      { label: 'Skills Match', value: aiAnalysis.skillsMatchScore },
                      { label: 'Experience', value: aiAnalysis.experienceMatchScore },
                      { label: 'Education', value: aiAnalysis.educationMatchScore },
                      { label: 'Communication', value: aiAnalysis.communicationScore },
                    ].map(({ label, value }) => {
                      const color = value >= 70 ? '#10b981' : value >= 45 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={label} className="sub-score-row">
                          <span>{label}</span>
                          <div className="sub-score-bar">
                            <motion.div
                              className="sub-score-fill"
                              style={{ background: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                          <span style={{ color, fontWeight: 700 }}>{value}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Radar Chart */}
              <motion.div
                className="radar-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3>Score Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar name="Score" dataKey="value" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Summary */}
            {aiAnalysis.summary && (
              <div className="ai-summary-card">
                <div className="summary-label"><Zap size={14} color="#a855f7" /> AI Summary</div>
                <p>{aiAnalysis.summary}</p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid-2 sw-grid">
              <CollapsibleSection title="Strengths" icon={CheckCircle} badge={aiAnalysis.strengths?.length}>
                <ul className="feedback-list strengths">
                  {aiAnalysis.strengths?.map((s, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <CheckCircle size={14} color="#10b981" /> {s}
                    </motion.li>
                  ))}
                </ul>
              </CollapsibleSection>
              <CollapsibleSection title="Areas to Improve" icon={AlertCircle} badge={aiAnalysis.weaknesses?.length}>
                <ul className="feedback-list weaknesses">
                  {aiAnalysis.weaknesses?.map((w, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <AlertCircle size={14} color="#f59e0b" /> {w}
                    </motion.li>
                  ))}
                </ul>
              </CollapsibleSection>
            </div>

            {/* Skills */}
            <div className="grid-2">
              <CollapsibleSection title="Matched Skills" icon={Award} badge={aiAnalysis.matchedSkills?.length}>
                <div className="chips-container">
                  {aiAnalysis.matchedSkills?.map(s => (
                    <span key={s} className="chip chip-green">{s}</span>
                  ))}
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Missing Skills" icon={XCircle} badge={aiAnalysis.missingSkills?.length}>
                <div className="chips-container">
                  {aiAnalysis.missingSkills?.map(s => (
                    <span key={s} className="chip chip-red">{s}</span>
                  ))}
                </div>
              </CollapsibleSection>
            </div>

            {/* ATS Optimizations */}
            {aiAnalysis.atsOptimizations?.length > 0 && (
              <CollapsibleSection title="ATS Optimization Tips" icon={TrendingUp} badge={aiAnalysis.atsOptimizations.length} defaultOpen={false}>
                <ul className="optimization-list">
                  {aiAnalysis.atsOptimizations.map((tip, i) => (
                    <li key={i}><Lightbulb size={14} color="#f59e0b" /> {tip}</li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Detailed Feedback */}
            {aiAnalysis.detailedFeedback && (
              <CollapsibleSection title="Detailed AI Feedback" icon={Brain} defaultOpen={false}>
                <div className="detailed-feedback">
                  {aiAnalysis.detailedFeedback.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* AI Feature Buttons */}
            <div className="ai-features-grid">
              <button
                className="ai-feature-btn"
                onClick={() => { loadInterviewQuestions(); }}
                disabled={iqLoading}
                id="load-interview-qs"
              >
                <div className="ai-feature-icon"><MessageSquare size={20} /></div>
                <div>
                  <strong>Interview Questions</strong>
                  <span>AI-generated role-specific questions</span>
                </div>
                {iqLoading ? <div className="spinner" /> : <ChevronDown size={16} />}
              </button>

              <button
                className="ai-feature-btn"
                onClick={() => { loadSkillsGap(); }}
                disabled={gapLoading}
                id="load-skills-gap"
              >
                <div className="ai-feature-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                  <Target size={20} />
                </div>
                <div>
                  <strong>Skills Gap Analysis</strong>
                  <span>Critical gaps & learning path</span>
                </div>
                {gapLoading ? <div className="spinner" /> : <ChevronDown size={16} />}
              </button>

              <button
                className="ai-feature-btn"
                onClick={() => { loadOptimizer(); }}
                disabled={optLoading}
                id="load-ats-optimizer"
              >
                <div className="ai-feature-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <strong>ATS Score Optimizer</strong>
                  <span>How to improve this resume's score</span>
                </div>
                {optLoading ? <div className="spinner" /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Interview Questions Panel */}
            <AnimatePresence>
              {interviewQs && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ai-result-panel">
                  <h3><MessageSquare size={16} /> Interview Questions</h3>
                  <div className="iq-list">
                    {interviewQs.map((q, i) => (
                      <div key={i} className="iq-item">
                        <div className="iq-header">
                          <span className="iq-number">{i + 1}</span>
                          <div className="iq-badges">
                            <span className={`badge ${q.category === 'technical' ? 'badge-blue' : q.category === 'behavioral' ? 'badge-purple' : 'badge-yellow'}`}>
                              {q.category}
                            </span>
                            <span className={`badge ${q.difficulty === 'hard' ? 'badge-red' : q.difficulty === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                        <p className="iq-question">{q.question}</p>
                        {q.suggestedAnswer && (
                          <div className="iq-answer">
                            <strong> Suggested Answer:</strong> {q.suggestedAnswer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {skillsGap && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ai-result-panel">
                  <h3><Target size={16} /> Skills Gap Analysis</h3>
                  <div className="gap-sections">
                    {skillsGap.criticalGaps?.length > 0 && (
                      <div>
                        <div className="gap-label gap-critical"> Critical Gaps</div>
                        <div className="chips-container">{skillsGap.criticalGaps.map(s => <span key={s} className="chip chip-red">{s}</span>)}</div>
                      </div>
                    )}
                    {skillsGap.niceToHaveGaps?.length > 0 && (
                      <div>
                        <div className="gap-label gap-nice"> Nice to Have</div>
                        <div className="chips-container">{skillsGap.niceToHaveGaps.map(s => <span key={s} className="chip chip-yellow">{s}</span>)}</div>
                      </div>
                    )}
                    {skillsGap.timeToFill && (
                      <div className="gap-time">
                        <Clock size={14} /> Estimated time to close gaps: <strong>{skillsGap.timeToFill}</strong>
                      </div>
                    )}
                    {skillsGap.developmentPath && (
                      <div className="gap-path"><p>{skillsGap.developmentPath}</p></div>
                    )}
                  </div>
                </motion.div>
              )}

              {optimizer && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ai-result-panel">
                  <h3><TrendingUp size={16} /> ATS Score Optimizer</h3>
                  <div className="optimizer-scores">
                    <div className="opt-score">
                      <span>Current Score</span>
                      <strong style={{ color: '#ef4444' }}>{optimizer.currentScore}/100</strong>
                    </div>
                    <div className="opt-arrow">→</div>
                    <div className="opt-score">
                      <span>Potential Score</span>
                      <strong style={{ color: '#10b981' }}>{optimizer.potentialScore}/100</strong>
                    </div>
                  </div>
                  {optimizer.criticalFixes?.length > 0 && (
                    <div>
                      <div className="gap-label gap-critical" style={{ marginTop: '16px' }}> Critical Fixes</div>
                      <ul className="optimization-list">{optimizer.criticalFixes.map((f, i) => <li key={i}><XCircle size={13} color="#ef4444" /> {f}</li>)}</ul>
                    </div>
                  )}
                  {optimizer.quickWins?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div className="gap-label gap-nice"> Quick Wins</div>
                      <ul className="optimization-list">{optimizer.quickWins.map((w, i) => <li key={i}><Lightbulb size={13} color="#f59e0b" /> {w}</li>)}</ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {analysisStatus === 'failed' && (
          <div className="analysis-failed">
            <XCircle size={32} color="#ef4444" />
            <h3>AI Analysis Failed</h3>
            <p>The AI could not analyze this resume. This may be due to a PDF that contains only images (scanned). Please upload a text-based PDF.</p>
          </div>
        )}
      </div>
    </div>
  );
}
