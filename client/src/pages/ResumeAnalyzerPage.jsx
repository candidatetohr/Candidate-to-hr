import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Zap, Upload, FileText, Loader2, ArrowRight, ArrowLeft,
  CheckCircle, XCircle, AlertTriangle, Target, Brain,
  TrendingUp, MessageSquare, Award, ChevronDown, ChevronUp,
  Sparkles, BookOpen, Star, Wand2, Map, RefreshCw, ChevronRight
} from 'lucide-react';
import { resumeAnalyzerAPI } from '../services/api';
import CareerCoachChat from '../components/CareerCoachChat';
import './ResumeAnalyzerPage.css';

// ── Circular Score Ring ───────────────────────────────────────────────────────
function ScoreRing({ score, size = 140, stroke = 10, color = '#4f8ef7' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const label = score >= 80 ? ' Excellent' : score >= 65 ? ' Good' : score >= 50 ? '️ Fair' : ' Needs Work';
  const labelColor = score >= 80 ? '#10b981' : score >= 65 ? '#4f8ef7' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} className="score-ring-svg">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="score-ring-inner">
        <motion.span className="score-number" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>{score}</motion.span>
        <span className="score-denom">/100</span>
      </div>
      <div className="score-label" style={{ color: labelColor }}>{label}</div>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div className="score-bar-item">
      <div className="score-bar-header"><span>{label}</span><span className="score-bar-val">{value}%</span></div>
      <div className="score-bar-track">
        <motion.div className="score-bar-fill" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="result-section">
      <button className="section-toggle" onClick={() => setOpen(o => !o)}>
        <div className="section-toggle-left">
          <div className="section-icon" style={{ background: `${color}18`, color }}><Icon size={18} /></div>
          <span className="section-title">{title}</span>
          {badge && <span className="section-badge">{badge}</span>}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="section-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Career Intelligence Panel ─────────────────────────────────────────────────
function CareerIntelligencePanel({ resumeText }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await resumeAnalyzerAPI.careerIntelligence({ resumeText });
      setData(res.data.data);
      setLoaded(true);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const DEMAND_COLOR = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };
  const FIT_COLOR = (s) => s >= 85 ? '#10b981' : s >= 70 ? '#4f8ef7' : s >= 55 ? '#f59e0b' : '#ef4444';

  if (!loaded && !loading) return (
    <div className="ci-load-wrap">
      <p>Map your profile across 50+ role archetypes with NVIDIA NIM AI.</p>
      <button className="ci-load-btn" onClick={load}><Map size={14} /> Generate Career Map</button>
    </div>
  );
  if (loading) return <div className="ci-loading"><Loader2 size={24} className="ci-spinner" /><p>Analysing career fit…</p></div>;
  if (!data) return null;

  return (
    <div className="ci-panel">
      <div className="ci-meta-row">
        <div className="ci-meta-pill"><span>Level</span><strong>{data.careerLevel}</strong></div>
        <div className="ci-meta-pill"><span>Domain</span><strong>{data.primaryDomain}</strong></div>
        <div className="ci-meta-pill" style={{ color: DEMAND_COLOR[data.marketDemand] }}>
          <span>Market Demand</span><strong style={{ color: DEMAND_COLOR[data.marketDemand] }}>{data.marketDemand}</strong>
        </div>
      </div>

      <h4 className="ci-section-title"> Top Role Matches</h4>
      <div className="ci-roles">
        {(data.topRoles || []).map((role, i) => (
          <div key={i} className="ci-role-card">
            <div className="ci-role-header">
              <div>
                <div className="ci-role-title">{role.title}</div>
                <div className="ci-role-salary">{role.salaryRange}</div>
              </div>
              <div className="ci-role-fit" style={{ color: FIT_COLOR(role.fitScore) }}>
                <div className="ci-role-fit-num">{role.fitScore}</div>
                <div className="ci-role-fit-label">fit</div>
              </div>
            </div>
            <div className="ci-role-bar-wrap"><motion.div className="ci-role-bar" style={{ background: FIT_COLOR(role.fitScore) }} initial={{ width: 0 }} animate={{ width: `${role.fitScore}%` }} transition={{ duration: 0.8 }} /></div>
            <p className="ci-role-reason">{role.reasoning}</p>
            {role.topCompanies?.length > 0 && (
              <div className="ci-role-companies">{role.topCompanies.map(c => <span key={c} className="ci-company-tag">{c}</span>)}</div>
            )}
          </div>
        ))}
      </div>

      {data.skillsToUnlock?.length > 0 && (
        <>
          <h4 className="ci-section-title"> Skills to Unlock Next Level</h4>
          <div className="ci-unlock-list">
            {data.skillsToUnlock.map((s, i) => (
              <div key={i} className="ci-unlock-item">
                <div className="ci-unlock-skill">{s.skill}</div>
                <div className="ci-unlock-impact">{s.impact}</div>
                <div className="ci-unlock-time"> {s.timeToLearn}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {data.salaryPotential && (
        <>
          <h4 className="ci-section-title"> Salary Potential</h4>
          <div className="ci-salary-grid">
            <div className="ci-salary-card"><div className="ci-salary-period">Now</div><div className="ci-salary-val">{data.salaryPotential.current}</div></div>
            <div className="ci-salary-card"><div className="ci-salary-period">1 Year</div><div className="ci-salary-val ci-salary-up">{data.salaryPotential.oneYear}</div></div>
            <div className="ci-salary-card"><div className="ci-salary-period">3 Years</div><div className="ci-salary-val ci-salary-up3">{data.salaryPotential.threeYear}</div></div>
          </div>
        </>
      )}

      {data.careerTrajectory && <p className="ci-trajectory">️ {data.careerTrajectory}</p>}
    </div>
  );
}

// ── Resume Tailor Panel ───────────────────────────────────────────────────────
function ResumeTailorPanel({ resumeText, currentScore }) {
  const [jd, setJd] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await resumeAnalyzerAPI.tailor({ resumeText, jobDescription: jd, jobTitle: jobTitle || 'Target Role' });
      setResult(res.data.data);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tailor-panel">
      <p className="tailor-intro">Paste any job description and AI will rewrite your resume sections to perfectly match it — without fabricating experience.</p>
      <div className="tailor-fields">
        <input className="az-input" placeholder="Job Title (e.g. Senior Data Scientist)" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        <textarea className="az-textarea" placeholder="Paste the job description here…" rows={6} value={jd} onChange={e => setJd(e.target.value)} />
      </div>
      <button className="tailor-run-btn" onClick={run} disabled={!jd.trim() || loading}>
        {loading ? <><Loader2 size={16} className="ci-spinner" /> Tailoring…</> : <><Wand2 size={16} /> Tailor My Resume</>}
      </button>

      {result && (
        <motion.div className="tailor-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="tailor-score-jump">
            <div className="tsj-before">Before: <strong>{result.scoreBefore || currentScore}/100</strong></div>
            <ChevronRight size={16} />
            <div className="tsj-after">After Tailoring: <strong style={{ color: '#10b981' }}>{result.estimatedNewScore}/100</strong></div>
          </div>

          <div className="tailor-section">
            <h4> Tailored Summary</h4>
            <div className="tailor-content">{result.tailoredSummary}</div>
          </div>
          <div className="tailor-section">
            <h4> Tailored Experience Bullets</h4>
            <div className="tailor-content">{result.tailoredExperience}</div>
          </div>
          <div className="tailor-section">
            <h4>️ Keywords Added</h4>
            <div className="tailor-keywords">{(result.addedKeywords || []).map(k => <span key={k} className="tailor-kw">{k}</span>)}</div>
          </div>
          {result.tailoringNotes && <p className="tailor-notes"> {result.tailoringNotes}</p>}

          <button className="tailor-copy-btn" onClick={() => {
            const text = `SUMMARY\n${result.tailoredSummary}\n\nEXPERIENCE\n${result.tailoredExperience}\n\nSKILLS\n${result.tailoredSkills}`;
            navigator.clipboard.writeText(text);
          }}> Copy Tailored Sections</button>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResumeAnalyzerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => setError('Please upload a valid PDF file under 10MB.'),
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setStep('loading');
    setError('');
    const msgs = [' Extracting resume text…', ' Running NVIDIA NIM AI analysis…', ' Scoring skills & experience…', ' Detecting skills gaps…', ' Generating interview questions…', ' Finalising your report…'];
    let i = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMsg(msgs[i]); }, 3000);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      if (jobTitle) fd.append('jobTitle', jobTitle);
      if (jobDescription) fd.append('jobDescription', jobDescription);
      const res = await resumeAnalyzerAPI.analyze(fd);
      clearInterval(iv);
      setResults(res.data.data);
      setStep('results');
    } catch (e) {
      clearInterval(iv);
      setError(e.response?.data?.message || 'Analysis failed. Please try again.');
      setStep('upload');
    }
  };

  const reset = () => { setStep('upload'); setFile(null); setJobTitle(''); setJobDescription(''); setResults(null); setError(''); };

  return (
    <div className="analyzer-page">
      <div className="analyzer-bg"><div className="az-orb az-orb-1" /><div className="az-orb az-orb-2" /><div className="az-grid" /></div>

      <nav className="az-nav">
        <button className="az-back-btn" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back</button>
        <div className="az-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="CandidateToHR Logo" width="24" height="24" style={{ height: '24px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/live-editor')} style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}>
            ️ Live Editor
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>For Recruiters →</button>
        </div>
      </nav>

      <div className="az-main">
        <AnimatePresence mode="wait">

          {step === 'upload' && (
            <motion.div key="upload" className="az-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="az-card-header">
                <div className="az-badge"><Sparkles size={12} /> AI Resume Analyser</div>
                <h1>Analyse Your Resume <span className="az-gradient">for Free</span></h1>
                <p>Upload your PDF resume and get an instant AI-powered analysis — scores, strengths, ATS tips, skills gaps, interview questions, career map, and an AI Career Coach chat.</p>
              </div>
              <div {...getRootProps()} className={`az-dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}>
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <div className="dz-file-icon"><FileText size={32} /></div>
                    <div className="dz-file-name">{file.name}</div>
                    <div className="dz-file-size">{(file.size / 1024).toFixed(0)} KB — ready to analyse</div>
                    <button className="dz-change-btn" onClick={e => { e.stopPropagation(); setFile(null); }}>Choose different file</button>
                  </>
                ) : (
                  <>
                    <div className="dz-icon"><Upload size={36} /></div>
                    <div className="dz-text">{isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume PDF'}</div>
                    <div className="dz-sub">or <span className="dz-browse">browse files</span> · Max 10MB</div>
                  </>
                )}
              </div>
              {error && <div className="az-error"><XCircle size={14} /> {error}</div>}
              <button className="az-btn-primary" disabled={!file} onClick={() => setStep('jd')}>
                Continue <ArrowRight size={16} />
              </button>
              {/* Feature Chips */}
              <div className="az-feature-chips">
                {['AI Scoring', 'ATS Tips', 'Skills Gap', 'Interview Qs', '🆕 Career Map', '🆕 Resume Tailor', '🆕 AI Coach Chat'].map(f => (
                  <span key={f} className="az-chip">{f}</span>
                ))}
              </div>
              <div className="az-privacy"> Your resume is processed securely and never stored.</div>
            </motion.div>
          )}

          {step === 'jd' && (
            <motion.div key="jd" className="az-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="az-card-header">
                <div className="az-badge"><Target size={12} /> Optional — but recommended</div>
                <h1>Target a <span className="az-gradient">Specific Job</span></h1>
                <p>Paste the job description you're applying for to get a tailored score. Skip this step for a general analysis.</p>
              </div>
              <div className="az-field">
                <label>Job Title</label>
                <input type="text" placeholder="e.g. Senior React Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="az-input" />
              </div>
              <div className="az-field">
                <label>Job Description <span className="az-optional">(paste from job posting)</span></label>
                <textarea placeholder="Paste the full job description here…" value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="az-textarea" rows={8} />
              </div>
              <div className="az-jd-actions">
                <button className="az-btn-ghost" onClick={() => setStep('upload')}><ArrowLeft size={16} /> Back</button>
                <button className="az-btn-secondary" onClick={handleAnalyze}>Skip & Analyse Anyway</button>
                <button className="az-btn-primary" onClick={handleAnalyze} disabled={!jobTitle && !jobDescription}>
                  <Zap size={16} /> Analyse Now
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" className="az-loading-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="loading-orb"><Loader2 size={40} className="spinner-icon" /></div>
              <h2>Analysing Your Resume</h2>
              <motion.p key={loadingMsg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="loading-msg">{loadingMsg}</motion.p>
              <div className="loading-steps">
                {['PDF Extraction', 'AI Scoring', 'Skills Gap', 'Interview Qs', 'Career Map'].map((s, i) => (
                  <motion.div key={s} className="loading-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}>
                    <div className="loading-step-dot" />
                    <span>{s}</span>
                  </motion.div>
                ))}
              </div>
              <p className="loading-note">This takes ~30-60 seconds — NVIDIA NIM is working hard </p>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div key="results" className="az-results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="results-header">
                <div>
                  <div className="az-badge"><Award size={12} /> Analysis Complete</div>
                  <h1>Your Resume <span className="az-gradient">Report</span></h1>
                  {results.jobTitle && <p className="results-subtitle">Analysed for: <strong>{results.jobTitle}</strong></p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="az-btn-ghost results-reset" onClick={() => navigate('/interview-sim')}>
                    <MessageSquare size={14} /> Mock Interview
                  </button>
                  <button className="az-btn-ghost results-reset" onClick={reset}><RefreshCw size={14} /> New Analysis</button>
                </div>
              </div>

              <div className="results-hero">
                <div className="results-hero-left">
                  <ScoreRing score={results.analysis.overallScore} size={160} stroke={12} color="#4f8ef7" />
                  <div className="results-summary"><h3>AI Summary</h3><p>{results.analysis.summary}</p></div>
                </div>
                <div className="results-hero-right">
                  <h3>Score Breakdown</h3>
                  <div className="score-bars">
                    <ScoreBar label="Skills Match" value={results.analysis.skillsMatchScore} color="#4f8ef7" />
                    <ScoreBar label="Experience" value={results.analysis.experienceMatchScore} color="#a855f7" />
                    <ScoreBar label="Education" value={results.analysis.educationMatchScore} color="#10b981" />
                    <ScoreBar label="Communication" value={results.analysis.communicationScore} color="#f59e0b" />
                  </div>
                </div>
              </div>

              <div className="results-sections">
                <Section icon={CheckCircle} title="Strengths" color="#10b981" defaultOpen>
                  <ul className="pill-list">{(results.analysis.strengths || []).map((s, i) => <li key={i} className="pill pill-green"><CheckCircle size={13} /> {s}</li>)}</ul>
                </Section>

                <Section icon={XCircle} title="Weaknesses & Areas to Improve" color="#ef4444" defaultOpen>
                  <ul className="pill-list">{(results.analysis.weaknesses || []).map((w, i) => <li key={i} className="pill pill-red"><AlertTriangle size={13} /> {w}</li>)}</ul>
                </Section>

                <Section icon={TrendingUp} title="ATS Optimization Tips" color="#4f8ef7">
                  {results.optimizer && (
                    <div className="optimizer-block">
                      {results.optimizer.potentialScore && (
                        <div className="optimizer-potential">
                          <span>Current Score</span><span className="opt-score">{results.optimizer.currentScore}/100</span>
                          <ArrowRight size={14} /><span>Potential Score</span><span className="opt-score opt-green">{results.optimizer.potentialScore}/100</span>
                        </div>
                      )}
                      {results.optimizer.criticalFixes?.length > 0 && <><h4> Critical Fixes</h4><ul className="tip-list">{results.optimizer.criticalFixes.map((t, i) => <li key={i}>{t}</li>)}</ul></>}
                      {results.optimizer.quickWins?.length > 0 && <><h4> Quick Wins</h4><ul className="tip-list">{results.optimizer.quickWins.map((t, i) => <li key={i}>{t}</li>)}</ul></>}
                      {results.optimizer.keywordSuggestions?.length > 0 && <><h4>️ Missing Keywords to Add</h4><ul className="pill-list">{results.optimizer.keywordSuggestions.map((k, i) => <li key={i} className="pill pill-blue">{k}</li>)}</ul></>}
                    </div>
                  )}
                </Section>

                <Section icon={Target} title="Skills Gap Analysis" color="#a855f7">
                  {results.skillsGap && (
                    <div className="skills-gap-block">
                      {results.skillsGap.criticalGaps?.length > 0 && <><h4>️ Critical Gaps</h4><ul className="pill-list">{results.skillsGap.criticalGaps.map((g, i) => <li key={i} className="pill pill-red">{g}</li>)}</ul></>}
                      {results.skillsGap.existingStrengths?.length > 0 && <><h4> Existing Strengths</h4><ul className="pill-list">{results.skillsGap.existingStrengths.map((s, i) => <li key={i} className="pill pill-green">{s}</li>)}</ul></>}
                      {results.skillsGap.timeToFill && <div className="gap-time"><BookOpen size={14} /> Estimated time to close gaps: <strong>{results.skillsGap.timeToFill}</strong></div>}
                      {results.skillsGap.developmentPath && <p className="gap-path">{results.skillsGap.developmentPath}</p>}
                    </div>
                  )}
                </Section>

                <Section icon={MessageSquare} title="Interview Questions to Prepare" color="#f59e0b">
                  <div className="iq-list">
                    {(results.interviewQuestions || []).slice(0, 10).map((q, i) => (
                      <div key={i} className="iq-item">
                        <div className="iq-header">
                          <span className="iq-num">Q{i + 1}</span>
                          <span className={`iq-tag iq-${q.category}`}>{q.category}</span>
                          <span className={`iq-diff iq-${q.difficulty}`}>{q.difficulty}</span>
                        </div>
                        <p className="iq-question">{q.question}</p>
                        {q.suggestedAnswer && <p className="iq-hint"> {q.suggestedAnswer}</p>}
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-secondary" onClick={() => navigate('/interview-sim')} style={{ marginTop: '1rem', width: '100%' }}>
                    <MessageSquare size={14} /> Practice These Questions in AI Simulator →
                  </button>
                </Section>

                {/* 🆕 CAREER INTELLIGENCE */}
                <Section icon={Map} title="Career Intelligence Map" color="#06b6d4" badge="NEW">
                  {results.resumeText && <CareerIntelligencePanel resumeText={results.resumeText} />}
                </Section>

                {/* 🆕 RESUME TAILOR */}
                <Section icon={Wand2} title="One-Click Resume Tailoring" color="#ec4899" badge="NEW">
                  {results.resumeText && <ResumeTailorPanel resumeText={results.resumeText} currentScore={results.analysis.overallScore} />}
                </Section>

                <Section icon={Brain} title="Detailed AI Feedback" color="#06b6d4">
                  <p className="detailed-feedback">{results.analysis.detailedFeedback}</p>
                </Section>
              </div>

              <div className="results-footer-cta">
                <div className="rfc-text">
                  <h3>Are you a recruiter?</h3>
                  <p>Use Candidatetohr to screen hundreds of candidates with this same AI engine.</p>
                </div>
                <button className="az-btn-primary" onClick={() => navigate('/login')}>
                  <Star size={16} /> Get Recruiter Access <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 🆕 AI CAREER COACH CHAT — appears once results are loaded */}
      {step === 'results' && results && (
        <CareerCoachChat
          context={{
            resumeText: results.resumeText,
            jobTitle: results.jobTitle,
            analysis: results.analysis,
          }}
        />
      )}
    </div>
  );
}
