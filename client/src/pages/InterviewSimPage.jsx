import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowLeft, ArrowRight, MessageSquare, CheckCircle,
  Star, Award, Brain, ChevronRight, RotateCcw, Loader2,
  Mic, MicOff, Volume2, VolumeX
} from 'lucide-react';
import { interviewAPI } from '../services/api';
import SEO from '../components/SEO';
import ToolEditorial from '../components/seo/ToolEditorial';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';
import './InterviewSimPage.css';

const GRADE_COLOR = (g) => g >= 8 ? '#10b981' : g >= 6 ? '#4f8ef7' : g >= 4 ? '#f59e0b' : '#ef4444';
const GRADE_LABEL = (g) => g >= 8 ? 'Excellent' : g >= 6 ? 'Good' : g >= 4 ? 'Adequate' : 'Needs Work';
const READINESS_DATA = {
  not_ready: { label: 'Not Ready', color: '#ef4444', emoji: '' },
  developing: { label: 'Developing', color: '#f59e0b', emoji: '' },
  almost_ready: { label: 'Almost Ready', color: '#4f8ef7', emoji: '' },
  ready: { label: 'Interview Ready', color: '#10b981', emoji: '' },
  exceptional: { label: 'Exceptional', color: '#a855f7', emoji: '' },
};

const DEFAULT_QUESTIONS = [
  { question: "Tell me about yourself and why you're interested in this role.", category: 'behavioral', difficulty: 'easy' },
  { question: "Describe a technically challenging project you've worked on and how you overcame the obstacles.", category: 'technical', difficulty: 'medium' },
  { question: "How do you handle disagreements with team members or stakeholders?", category: 'behavioral', difficulty: 'medium' },
  { question: "Walk me through your approach to debugging a production issue at 3am.", category: 'situational', difficulty: 'hard' },
  { question: "What's your experience with system design and scalability?", category: 'technical', difficulty: 'hard' },
  { question: "Where do you see yourself in 3 years, and how does this role fit into that path?", category: 'culture-fit', difficulty: 'easy' },
  { question: "Describe a time you had to learn a new technology quickly under pressure.", category: 'behavioral', difficulty: 'medium' },
  { question: "How do you prioritize tasks when everything feels urgent?", category: 'situational', difficulty: 'medium' },
  { question: "What's your greatest professional strength and a real weakness you're actively working on?", category: 'behavioral', difficulty: 'easy' },
  { question: "Do you have any questions for us?", category: 'culture-fit', difficulty: 'easy' },
];

export default function InterviewSimPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup | interview | grading | results
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [session, setSession] = useState([]);
  const [currentGrade, setCurrentGrade] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);

  const currentQuestion = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };
      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecognition(rec);
    }
     
  }, []);

  const toggleRecording = () => {
    if (!recognition) return alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const speakQuestion = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Speak question when it changes
  useEffect(() => {
    if (step === 'interview' && currentQuestion) {
      speakQuestion(currentQuestion.question);
    } else {
      window.speechSynthesis?.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, currentQ, voiceEnabled]);

  const startInterview = () => {
    setSession([]);
    setCurrentQ(0);
    setAnswer('');
    setCurrentGrade(null);
    setStep('interview');
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }
    setStep('grading');
    setLoading(true);
    try {
      const res = await interviewAPI.gradeAnswer({
        question: currentQuestion.question,
        answer: answer.trim(),
        category: currentQuestion.category,
        jobTitle: jobTitle || 'Software Engineer',
      });
      setCurrentGrade(res.data.data);
      const newEntry = {
        question: currentQuestion.question,
        answer: answer.trim(),
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        grade: res.data.data.grade || 5,
        feedback: res.data.data,
      };
      setSession(prev => [...prev, newEntry]);
    } catch {
      setCurrentGrade({ grade: 5, verdict: 'adequate', strongPoints: [], improvements: ['Try to be more specific in your answer.'], missedPoints: [], modelAnswer: '', encouragement: 'Keep going!' });
      setSession(prev => [...prev, { question: currentQuestion.question, answer: answer.trim(), category: currentQuestion.category, difficulty: currentQuestion.difficulty, grade: 5, feedback: {} }]);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (isLastQuestion) {
      setStep('summary-loading');
      setLoading(true);
      try {
        const res = await interviewAPI.sessionSummary({
          session: session.map(s => ({ question: s.question, answer: s.answer, category: s.category, grade: s.grade })),
          jobTitle: jobTitle || 'Software Engineer',
        });
        setSummary(res.data.data);
      } catch {
        setSummary({ overallScore: Math.round(session.reduce((s, q) => s + q.grade, 0) / session.length * 10), readinessLevel: 'developing', verdict: 'Good effort on your mock interview!', topStrengths: ['Engagement'], criticalGaps: ['Practice more specific examples'], categoryBreakdown: { technical: 50, behavioral: 60, communication: 60, problemSolving: 50 }, nextSteps: ['Review your answers', 'Practice STAR method'], confidenceMessage: 'Keep practicing!' });
      } finally {
        setLoading(false);
        setStep('results');
      }
    } else {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setCurrentGrade(null);
      setStep('interview');
    }
  };

  const restart = () => {
    setStep('setup');
    setSession([]);
    setCurrentQ(0);
    setAnswer('');
    setCurrentGrade(null);
    setSummary(null);
  };

  const categoryColor = { technical: '#4f8ef7', behavioral: '#10b981', situational: '#f59e0b', 'role-specific': '#a855f7', 'culture-fit': '#ec4899', general: '#64748b' };

  return (
    <div className="sim-page">
      <SEO 
        title="Live AI Mock Interview Simulator | Voice & Text"
        description="Practice for your next job interview with our AI Interview Simulator. Featuring real-time voice recognition and instant grading to help you land the job."
        canonical="/interview-sim"
        type="SoftwareApplication"
        schema={{
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "@id": "https://candidatetohr.online/interview-sim/#app",
          "name": "CandidateToHR AI Mock Interview Simulator",
          "alternateName": "CandidateToHR AI Interview Practice",
          "url": "https://candidatetohr.online/interview-sim",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Practice for your next job interview with our AI Interview Simulator. Featuring real-time voice recognition and instant grading to help you land the job.",
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
      
      <div className="sim-bg"><div className="sim-orb sim-orb-1" /><div className="sim-orb sim-orb-2" /></div>

      <nav className="sim-nav">
        <button className="sim-back" onClick={() => navigate('/analyze')}><ArrowLeft size={16} /> Back</button>
        <div className="sim-logo"><div className="sim-logo-icon"><MessageSquare size={13} /></div><span>AI Interview Simulator</span></div>
        <button 
          className={`sim-voice-toggle ${voiceEnabled ? 'active' : ''}`}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
        >
          {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} 
          {voiceEnabled ? 'AI Voice On' : 'AI Voice Off'}
        </button>
      </nav>

      <div className="sim-main">
        <AnimatePresence mode="wait">

          {/* ── SETUP ── */}
          {step === 'setup' && (
            <motion.div key="setup" className="sim-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="sim-header">
                <div className="sim-badge"><Zap size={12} /> NVIDIA NIM Powered</div>
                <h1>AI Mock Interview<br /><span className="sim-gradient">Practice & Get Graded</span></h1>
                <p>The AI will ask you 10 interview questions one by one, grade your answers in real-time (1–10), and give you a full readiness report at the end.</p>
              </div>

              <div className="sim-setup-field">
                <label>Target Role (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Senior React Developer, Data Scientist, Product Manager"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="sim-input"
                />
              </div>

              <div className="sim-features">
                {[
                  { icon: MessageSquare, label: '10 Questions', desc: 'Technical, behavioral, situational', color: '#4f8ef7' },
                  { icon: Star, label: 'Live Grading', desc: 'AI grades each answer 1–10', color: '#f59e0b' },
                  { icon: Award, label: 'Full Report', desc: 'Readiness score + next steps', color: '#10b981' },
                  { icon: Brain, label: 'NVIDIA NIM', desc: 'Powered by Nemotron 253B', color: '#a855f7' },
                ].map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="sim-feature">
                    <div className="sim-feature-icon" style={{ background: `${color}18`, color }}><Icon size={16} /></div>
                    <div><div className="sim-feature-label">{label}</div><div className="sim-feature-desc">{desc}</div></div>
                  </div>
                ))}
              </div>

              <button className="sim-start-btn" onClick={startInterview}>
                <MessageSquare size={16} /> Start Mock Interview <ArrowRight size={16} />
              </button>
              <p className="sim-privacy"> Your answers are processed securely and not stored.</p>
            </motion.div>
          )}

          {/* ── INTERVIEW ── */}
          {step === 'interview' && (
            <motion.div key={`interview-${currentQ}`} className="sim-interview-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Progress */}
              <div className="sim-progress">
                <div className="sim-progress-bar" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
              </div>
              <div className="sim-q-meta">
                <span className="sim-q-num">Question {currentQ + 1} of {questions.length}</span>
                <span className="sim-q-cat" style={{ color: categoryColor[currentQuestion.category] || '#64748b' }}>{currentQuestion.category}</span>
                <span className={`sim-q-diff diff-${currentQuestion.difficulty}`}>{currentQuestion.difficulty}</span>
              </div>

              <div className="sim-question-box">
                <div className="sim-interviewer">
                  <div className="sim-ai-avatar"><Brain size={18} /></div>
                  <div className="sim-ai-label">AI Interviewer</div>
                </div>
                <motion.p className="sim-question-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {currentQuestion.question}
                </motion.p>
              </div>

              <div className="sim-answer-area">
                <label className="sim-answer-label">Your Answer</label>
                <textarea
                  className="sim-textarea"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Take your time, structure your thoughts using the STAR method (Situation, Task, Action, Result) for behavioral questions."
                  rows={6}
                  autoFocus
                />
              </div>

              <div className="sim-actions">
                {currentQ > 0 && (
                  <button className="sim-btn-ghost" onClick={() => { setCurrentQ(q => q - 1); setAnswer(session[currentQ - 1]?.answer || ''); }}>
                    <ArrowLeft size={14} /> Previous
                  </button>
                )}
                <button 
                  className={`sim-mic-btn ${isRecording ? 'recording' : ''}`} 
                  onClick={toggleRecording}
                  title="Speak your answer"
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button className="sim-btn-submit" onClick={submitAnswer} disabled={!answer.trim() && !isRecording}>
                  Submit Answer <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── GRADING ── */}
          {step === 'grading' && (
            <motion.div key="grading" className="sim-grading-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loading ? (
                <>
                  <div className="sim-grading-loader"><Loader2 size={32} className="grading-spinner" /></div>
                  <h2>Grading Your Answer…</h2>
                  <p>NVIDIA NIM is analysing your response </p>
                </>
              ) : currentGrade && (
                <motion.div className="grade-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="grade-circle" style={{ borderColor: GRADE_COLOR(currentGrade.grade), boxShadow: `0 0 30px ${GRADE_COLOR(currentGrade.grade)}40` }}>
                    <span className="grade-number" style={{ color: GRADE_COLOR(currentGrade.grade) }}>{currentGrade.grade}</span>
                    <span className="grade-denom">/10</span>
                  </div>
                  <div className="grade-verdict" style={{ color: GRADE_COLOR(currentGrade.grade) }}>{GRADE_LABEL(currentGrade.grade)}</div>

                  {currentGrade.strongPoints?.length > 0 && (
                    <div className="grade-section">
                      <h4> What you did well</h4>
                      <ul>{currentGrade.strongPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                  )}
                  {currentGrade.improvements?.length > 0 && (
                    <div className="grade-section">
                      <h4> How to improve</h4>
                      <ul>{currentGrade.improvements.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                  )}
                  {currentGrade.modelAnswer && (
                    <div className="grade-model">
                      <h4> Great answer includes</h4>
                      <p>{currentGrade.modelAnswer}</p>
                    </div>
                  )}
                  {currentGrade.encouragement && <p className="grade-encouragement">{currentGrade.encouragement}</p>}

                  <button className="sim-btn-submit" onClick={nextQuestion}>
                    {isLastQuestion ? <><Award size={16} /> Get Final Report</> : <>Next Question <ChevronRight size={16} /></>}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── SUMMARY LOADING ── */}
          {step === 'summary-loading' && (
            <motion.div key="summary-loading" className="sim-grading-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="sim-grading-loader"><Loader2 size={32} className="grading-spinner" /></div>
              <h2>Generating Your Report…</h2>
              <p>AI is analysing your complete session performance </p>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === 'results' && summary && (
            <motion.div key="results" className="sim-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="results-top">
                <div>
                  <div className="sim-badge"><Award size={12} /> Interview Complete</div>
                  <h1>Your Interview<br /><span className="sim-gradient">Performance Report</span></h1>
                </div>
                <button className="sim-btn-ghost" onClick={restart}><RotateCcw size={14} /> Retry</button>
              </div>

              {/* Hero */}
              <div className="results-hero-card">
                <div className="results-score-wrap">
                  <div className="results-score-circle" style={{ borderColor: GRADE_COLOR(summary.overallScore / 10) }}>
                    <span className="results-score-num">{summary.overallScore}</span>
                    <span className="results-score-max">/100</span>
                  </div>
                </div>
                <div className="results-meta">
                  {(() => { const r = READINESS_DATA[summary.readinessLevel] || READINESS_DATA.developing; return (
                    <div className="readiness-badge" style={{ color: r.color, borderColor: r.color, background: `${r.color}12` }}>
                      {r.emoji} {r.label}
                    </div>
                  ); })()}
                  <p className="results-verdict">{summary.verdict}</p>
                </div>
              </div>

              {/* Category Breakdown */}
              {summary.categoryBreakdown && (
                <div className="category-grid">
                  {Object.entries(summary.categoryBreakdown).map(([cat, score]) => (
                    <div key={cat} className="cat-card">
                      <div className="cat-label">{cat}</div>
                      <div className="cat-bar-wrap">
                        <motion.div className="cat-bar" style={{ background: GRADE_COLOR(score / 10), width: `${score}%` }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <div className="cat-score" style={{ color: GRADE_COLOR(score / 10) }}>{score}/100</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths & Gaps */}
              <div className="results-two-col">
                {summary.topStrengths?.length > 0 && (
                  <div className="results-box results-box-green">
                    <h3><CheckCircle size={15} /> Top Strengths</h3>
                    <ul>{summary.topStrengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </div>
                )}
                {summary.criticalGaps?.length > 0 && (
                  <div className="results-box results-box-red">
                    <h3>️ Critical Gaps</h3>
                    <ul>{summary.criticalGaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              {summary.nextSteps?.length > 0 && (
                <div className="next-steps-card">
                  <h3> Action Plan</h3>
                  <div className="next-steps-list">
                    {summary.nextSteps.map((step, i) => (
                      <div key={i} className="next-step-item">
                        <div className="next-step-num">{i + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  {summary.confidenceMessage && <p className="confidence-msg">"{summary.confidenceMessage}"</p>}
                </div>
              )}

              {/* Q&A Review */}
              <div className="qa-review">
                <h3> Answer Review</h3>
                {session.map((s, i) => (
                  <div key={i} className="qa-item">
                    <div className="qa-header">
                      <span className="qa-q-num">Q{i + 1}</span>
                      <span className="qa-cat" style={{ color: categoryColor[s.category] }}>{s.category}</span>
                      <span className="qa-grade" style={{ color: GRADE_COLOR(s.grade) }}>{s.grade}/10</span>
                    </div>
                    <p className="qa-question">{s.question}</p>
                    <p className="qa-answer">{s.answer}</p>
                  </div>
                ))}
              </div>

              <div className="sim-footer-actions">
                <button className="sim-btn-submit" onClick={restart}><RotateCcw size={16} /> Practice Again</button>
                <button className="sim-btn-ghost sim-btn-nav" onClick={() => navigate('/analyze')}>Full Resume Analysis <ChevronRight size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sim-editorial-wrapper" style={{ marginTop: '3rem', width: '100%', maxWidth: '1000px' }}>
        <ToolEditorial 
          whatItDoes="<p>The AI Interview Simulator conducts real-time, dynamic mock interviews tailored to your exact resume and target role. It acts as a specialized technical or behavioral recruiter, listens to your answers, scores your responses out of 10, and generates follow-up questions based on what you just said.</p>"
          howItWorks="<p>Unlike pre-recorded mock interviews, this tool uses NVIDIA NIM to generate contextually aware questions on the fly. When you answer, the AI analyzes your response for depth, clarity, and the STAR method (Situation, Task, Action, Result). It then provides immediate, graded feedback before moving to the next question.</p>"
          whoShouldUse="<ul><li><strong>Nervous Interviewees:</strong> Desensitize yourself to the pressure of technical and behavioral interviews in a low-stakes environment.</li><li><strong>Career Changers:</strong> Practice answering the inevitable 'Why are you pivoting into this industry?' question.</li><li><strong>Senior Leaders:</strong> Refine your ability to communicate complex, high-level strategy concisely.</li></ul>"
          benefits="<ul><li><strong>Dynamic Follow-ups:</strong> If you give a shallow answer, the AI will probe deeper, just like a real interviewer.</li><li><strong>Objective Grading:</strong> See exactly where your answers score on a scale of 1-10 before you face a human.</li><li><strong>Immediate Correction:</strong> Don't wait until you get a rejection email to realize your answers are too long or lack specifics.</li></ul>"
          limitations="<p>The simulator relies on text-based or transcribed audio input. It cannot evaluate your body language, eye contact, or tone of voice (which are also critical factors in human interviews).</p>"
          bestPractices="<p>Treat it like a real interview. Use the audio input feature if possible so you practice speaking out loud, not just typing. Always use the STAR method. Review your 'Action Plan' at the end of the session to see which category (Behavioral vs Technical) needs the most work.</p>"
        />
      </div>

      <InternalLinksFooter />

    </div>
  );
}
