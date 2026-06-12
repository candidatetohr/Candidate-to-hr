import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jobsAPI } from '../services/api';
import { ArrowLeft, Wand2, Zap, Plus, X, ArrowRight, Briefcase, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import './CreateJobPage.css';

const STEPS = ['Basic Info', 'Requirements & Skills', 'AI Assistance', 'Preview'];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [biasLoading, setBiasLoading] = useState(false);
  const [biasResult, setBiasResult] = useState(null);
  const [createdJobId, setCreatedJobId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: [''],
    skills: [''],
    location: 'Remote',
    jobType: 'full-time',
    experienceLevel: 'mid',
    department: '',
    salaryMin: '',
    salaryMax: '',
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const updateList = (field, idx, val) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr[idx] = val;
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field) => setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeItem = (field, idx) => setForm(prev => ({
    ...prev,
    [field]: prev[field].filter((_, i) => i !== idx)
  }));

  const generateAIJD = async () => {
    if (!form.title) { toast.error('Please enter a job title first.'); return; }
    setAiLoading(true);
    try {
      const res = await jobsAPI.generateJD({
        title: form.title,
        keywords: form.skills.filter(Boolean),
        companyInfo: '',
        experienceLevel: form.experienceLevel,
      });
      setForm(prev => ({ ...prev, description: res.data.data.generatedDescription }));
      toast.success('AI generated your job description! ');
    } catch {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const checkBias = async () => {
    if (!form.description) { toast.error('Please add a description first.'); return; }
    setBiasLoading(true);
    try {
      // Create temp and check — or use a standalone endpoint
      const res = await jobsAPI.generateJD({
        title: '__bias_check__',
        keywords: [],
        companyInfo: form.description,
      });
      // Parse bias from description field (we'll use dedicated endpoint after create)
      setBiasResult({ message: 'Bias check will be available after publishing the job.' });
    } catch {
      setBiasResult({ message: 'Bias check unavailable right now.' });
    } finally {
      setBiasLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements.filter(Boolean),
        skills: form.skills.filter(Boolean),
        location: form.location,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        department: form.department,
        salaryRange: form.salaryMin || form.salaryMax ? {
          min: Number(form.salaryMin) || null,
          max: Number(form.salaryMax) || null,
          currency: 'USD',
        } : undefined,
      };
      const res = await jobsAPI.create(payload);
      setCreatedJobId(res.data.data._id);
      toast.success('Job posted successfully! ');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.title.length >= 3 && form.description.length >= 50;
    if (step === 1) return true;
    if (step === 2) return true;
    return false;
  };

  return (
    <div className="page-wrapper">
      <div className="container create-job-page">
        {/* Header */}
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1>Post a New Job</h1>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-dot">{i < step ? '' : i + 1}</div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="create-job-content">
          <AnimatePresence mode="wait">
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="step-panel"
              >
                <h2>Basic Job Information</h2>
                <p>Fill in the core details about this position.</p>

                <div className="grid-2" style={{ marginTop: '24px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Job Title *</label>
                    <input id="job-title" type="text" className="form-input" placeholder="e.g. Senior Frontend Engineer"
                      value={form.title} onChange={set('title')} />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">
                      Job Description *
                      <button type="button" className="ai-gen-btn" onClick={generateAIJD} disabled={aiLoading}>
                        {aiLoading ? <div className="spinner" /> : <><Wand2 size={12} /> AI Generate</>}
                      </button>
                    </label>
                    <textarea
                      id="job-description"
                      className="form-textarea"
                      style={{ minHeight: '200px' }}
                      placeholder="Describe the role, responsibilities, and what success looks like..."
                      value={form.description}
                      onChange={set('description')}
                    />
                    <div className="char-count">{form.description.length} characters (min 50)</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input id="job-location" type="text" className="form-input" placeholder="Remote / New York, NY"
                      value={form.location} onChange={set('location')} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input id="job-department" type="text" className="form-input" placeholder="Engineering / Marketing"
                      value={form.department} onChange={set('department')} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select id="job-type" className="form-select" value={form.jobType} onChange={set('jobType')}>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <select id="exp-level" className="form-select" value={form.experienceLevel} onChange={set('experienceLevel')}>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Salary Min (USD)</label>
                    <input id="salary-min" type="number" className="form-input" placeholder="80000"
                      value={form.salaryMin} onChange={set('salaryMin')} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Salary Max (USD)</label>
                    <input id="salary-max" type="number" className="form-input" placeholder="120000"
                      value={form.salaryMax} onChange={set('salaryMax')} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Requirements & Skills */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="step-panel"
              >
                <h2>Requirements & Skills</h2>
                <p>Define what you're looking for in candidates.</p>

                <div style={{ marginTop: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">Job Requirements</label>
                    {form.requirements.map((req, idx) => (
                      <div key={idx} className="list-item-row">
                        <input
                          type="text"
                          className="form-input"
                          placeholder={`Requirement ${idx + 1}`}
                          value={req}
                          onChange={e => updateList('requirements', idx, e.target.value)}
                        />
                        {form.requirements.length > 1 && (
                          <button className="remove-btn" onClick={() => removeItem('requirements', idx)}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm add-item-btn" onClick={() => addItem('requirements')}>
                      <Plus size={13} /> Add Requirement
                    </button>
                  </div>

                  <div className="form-group" style={{ marginTop: '24px' }}>
                    <label className="form-label">Required Skills</label>
                    <div className="skills-grid">
                      {form.skills.map((skill, idx) => (
                        <div key={idx} className="skill-input-wrapper">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. React, Python"
                            value={skill}
                            onChange={e => updateList('skills', idx, e.target.value)}
                          />
                          {form.skills.length > 1 && (
                            <button className="remove-btn" onClick={() => removeItem('skills', idx)}>
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-ghost btn-sm add-item-btn" onClick={() => addItem('skills')}>
                      <Plus size={13} /> Add Skill
                    </button>

                    {/* Skills Preview */}
                    {form.skills.some(Boolean) && (
                      <div className="chips-container" style={{ marginTop: '12px' }}>
                        {form.skills.filter(Boolean).map(s => (
                          <span key={s} className="chip">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: AI Assistance */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="step-panel"
              >
                <h2>AI Assistance</h2>
                <p>Use NVIDIA NIM to enhance your job posting.</p>

                <div className="ai-tools-grid" style={{ marginTop: '24px' }}>
                  <div className="ai-tool-card">
                    <div className="ai-tool-icon">
                      <Wand2 size={20} />
                    </div>
                    <h3>Regenerate Description</h3>
                    <p>AI will rewrite or improve your job description using the title and skills you've entered.</p>
                    <button className="btn btn-primary btn-sm" onClick={generateAIJD} disabled={aiLoading}>
                      {aiLoading ? <><div className="spinner" />Generating...</> : <><Zap size={13} />Generate with AI</>}
                    </button>
                  </div>

                  <div className="ai-tool-card">
                    <div className="ai-tool-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                      <AlertTriangle size={20} />
                    </div>
                    <h3>Bias Detection</h3>
                    <p>Scan your job description for potentially biased language and get inclusive alternatives.</p>
                    <button className="btn btn-secondary btn-sm" onClick={checkBias} disabled={biasLoading}>
                      {biasLoading ? <><div className="spinner" />Checking...</> : 'Check for Bias'}
                    </button>
                    {biasResult && (
                      <div className="bias-result">
                        <span>ℹ️ {biasResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview of current description */}
                {form.description && (
                  <div className="description-preview">
                    <label className="form-label">Current Description Preview</label>
                    <div className="preview-box">
                      {form.description.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="step-panel success-panel"
              >
                <div className="success-icon"></div>
                <h2>Job Posted Successfully!</h2>
                <p>Your job listing is now live and ready to receive applications.</p>

                <div className="success-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(`/jobs/${createdJobId}/upload`)}
                  >
                    <Plus size={16} /> Add Candidates
                  </button>
                  <button
                    className="btn btn-ghost btn-lg"
                    onClick={() => navigate(`/jobs/${createdJobId}`)}
                  >
                    <Briefcase size={16} /> View Job
                  </button>
                  <button
                    className="btn btn-ghost btn-lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="step-nav">
              <button
                className="btn btn-ghost"
                onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
              >
                <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
              </button>
              <button
                className="btn btn-primary"
                onClick={step === 2 ? handleSubmit : () => setStep(s => s + 1)}
                disabled={!canProceed() || loading}
              >
                {loading ? (
                  <><div className="spinner" /> Publishing...</>
                ) : step === 2 ? (
                  <><Zap size={14} /> Publish Job</>
                ) : (
                  <>Next <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
