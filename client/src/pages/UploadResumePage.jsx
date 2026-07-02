import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI } from '../services/api';
import {
  Upload, FileText, X, CheckCircle, ArrowLeft,
  Users, Zap, AlertCircle, CloudUpload
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import AnalyticsService from '../services/AnalyticsService';
import './UploadResumePage.css';

export default function UploadResumePage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('single'); // 'single' | 'bulk'
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    notes: '',
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const onDropSingle = useCallback(accepted => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const onDropBulk = useCallback(accepted => {
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...accepted.filter(f => !existing.has(f.name))];
    });
  }, []);

  const { getRootProps: getSingleProps, getInputProps: getSingleInput, isDragActive: isSingleDrag } =
    useDropzone({ onDrop: onDropSingle, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024 });

  const { getRootProps: getBulkProps, getInputProps: getBulkInput, isDragActive: isBulkDrag } =
    useDropzone({ onDrop: onDropBulk, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 10, maxSize: 10 * 1024 * 1024 });

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.candidateName || !form.candidateEmail) {
      toast.error('Please fill in all required fields and upload a PDF.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobId', jobId);
      fd.append('candidateName', form.candidateName);
      fd.append('candidateEmail', form.candidateEmail);
      fd.append('candidatePhone', form.candidatePhone);
      fd.append('notes', form.notes);
      const res = await applicationsAPI.submit(fd);
      setSuccess({ id: res.data.data._id, name: form.candidateName });
      AnalyticsService.resumeUpload(file.name, 'single');
      toast.success('Resume submitted! AI analysis running... ');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (files.length === 0) { toast.error('Please add at least one PDF.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('jobId', jobId);
      files.forEach(f => fd.append('resumes', f));
      const res = await applicationsAPI.bulkSubmit(fd);
      AnalyticsService.resumeUpload(`${files.length} files`, 'bulk');
      toast.success(`${res.data.data.filter(r => r.status === 'submitted').length} resumes submitted! AI analysis running... `);
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  if (success) {
    return (
      <div className="page-wrapper">
        <SEO title="Upload Resume" noindex />
        <div className="container upload-page">
          <motion.div
            className="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-check"><CheckCircle size={48} color="#10b981" /></div>
            <h2>Application Submitted!</h2>
            <p>
              <strong>{success.name}'s</strong> resume is being analyzed by NVIDIA NIM AI.
              This usually takes 30-60 seconds.
            </p>
            <div className="ai-processing-indicator">
              <div className="spinner" />
              <span>AI analysis in progress...</span>
            </div>
            <div className="success-actions-row">
              <button className="btn btn-primary" onClick={() => navigate(`/applications/${success.id}`)}>
                <Zap size={14} /> View AI Feedback
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(`/jobs/${jobId}`)}>
                <Users size={14} /> See All Candidates
              </button>
              <button className="btn btn-ghost" onClick={() => {
                setSuccess(null); setFile(null);
                setForm({ candidateName: '', candidateEmail: '', candidatePhone: '', notes: '' });
              }}>
                Upload Another
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <SEO title="Upload Resume" noindex />
      <div className="container upload-page">
        {/* Header */}
        <div className="page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1>Upload Resume</h1>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
            onClick={() => setMode('single')}
          >
            <FileText size={15} /> Single Resume
          </button>
          <button
            className={`mode-btn ${mode === 'bulk' ? 'active' : ''}`}
            onClick={() => setMode('bulk')}
          >
            <CloudUpload size={15} /> Bulk Upload
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'single' ? (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="upload-layout"
            >
              {/* Dropzone */}
              <div className="upload-card">
                <div
                  {...getSingleProps()}
                  className={`dropzone ${isSingleDrag ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                >
                  <input {...getSingleInput()} id="resume-file-input" />
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="file-preview"
                      >
                        <div className="file-icon"><FileText size={32} color="#4f8ef7" /></div>
                        <div className="file-info">
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">{formatSize(file.size)}</div>
                        </div>
                        <button
                          className="remove-file-btn"
                          onClick={e => { e.stopPropagation(); setFile(null); }}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="placeholder" className="dropzone-content">
                        <div className="drop-icon">
                          <Upload size={32} />
                        </div>
                        <h3>{isSingleDrag ? 'Drop it here!' : 'Drag & drop PDF resume'}</h3>
                        <p>or <span className="browse-link">browse files</span></p>
                        <div className="drop-hint">PDF only — Max 10MB</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Info Banner */}
                <div className="ai-info-banner">
                  <Zap size={14} color="#a855f7" />
                  <p>After upload, NVIDIA NIM AI will automatically score this resume against the job requirements.</p>
                </div>
              </div>

              {/* Candidate Form */}
              <div className="upload-card candidate-form">
                <h2>Candidate Details</h2>
                <form onSubmit={handleSingleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input id="cand-name" type="text" className="form-input" placeholder="Jane Doe"
                      value={form.candidateName} onChange={set('candidateName')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input id="cand-email" type="email" className="form-input" placeholder="jane@example.com"
                      value={form.candidateEmail} onChange={set('candidateEmail')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input id="cand-phone" type="tel" className="form-input" placeholder="+1 (555) 000-0000"
                      value={form.candidatePhone} onChange={set('candidatePhone')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Internal Notes</label>
                    <textarea id="cand-notes" className="form-textarea" style={{ minHeight: '80px' }}
                      placeholder="Recruiter notes about this candidate..."
                      value={form.notes} onChange={set('notes')} />
                  </div>
                  <button
                    id="submit-resume-btn"
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={loading || !file}
                  >
                    {loading ? (
                      <><div className="spinner" /> Uploading & Analyzing...</>
                    ) : (
                      <><Zap size={15} /> Submit & Run AI Analysis</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bulk-upload-panel"
            >
              <div
                {...getBulkProps()}
                className={`dropzone dropzone-bulk ${isBulkDrag ? 'drag-active' : ''}`}
              >
                <input {...getBulkInput()} id="bulk-file-input" />
                <div className="dropzone-content">
                  <div className="drop-icon"><CloudUpload size={40} /></div>
                  <h3>{isBulkDrag ? 'Drop them here!' : 'Drag & drop multiple PDFs'}</h3>
                  <p>Up to 10 resumes at once — AI will analyze each automatically</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="bulk-file-list">
                  <div className="bulk-list-header">
                    <span>{files.length} file{files.length !== 1 ? 's' : ''} ready</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => setFiles([])}>
                      <X size={13} /> Clear All
                    </button>
                  </div>
                  {files.map((f, i) => (
                    <div key={i} className="bulk-file-row">
                      <FileText size={16} color="#4f8ef7" />
                      <span className="bulk-file-name">{f.name}</span>
                      <span className="bulk-file-size">{formatSize(f.size)}</span>
                      <button className="remove-btn" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                    onClick={handleBulkSubmit}
                    disabled={loading}
                  >
                    {loading ? <><div className="spinner" /> Uploading...</> : <><Zap size={15} /> Submit All & Analyze</>}
                  </button>
                </div>
              )}

              <div className="ai-info-banner">
                <AlertCircle size={14} color="#f59e0b" />
                <p>For bulk uploads, candidate names are inferred from file names. You can edit them after upload.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
