import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobsAPI, applicationsAPI } from '../services/api';
import {
  ArrowLeft, Plus, Users, Award, MapPin, Briefcase,
  Clock, Trash2, Edit, Zap, TrendingUp, Upload, Eye,
  CheckCircle, XCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import './JobDetailPage.css';

const STATUS_COLORS = {
  applied: 'badge-blue',
  screening: 'badge-yellow',
  interview: 'badge-purple',
  offer: 'badge-cyan',
  hired: 'badge-green',
  rejected: 'badge-red',
};

const PIPELINE_STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const RecommendationIcon = ({ rec }) => {
  if (rec === 'strong_hire') return <CheckCircle size={14} color="#10b981" />;
  if (rec === 'hire') return <CheckCircle size={14} color="#4f8ef7" />;
  if (rec === 'maybe') return <AlertCircle size={14} color="#f59e0b" />;
  return <XCircle size={14} color="#ef4444" />;
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [rankLoading, setRankLoading] = useState(false);
  const [rankInsights, setRankInsights] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        jobsAPI.getOne(id),
        applicationsAPI.getAll({ jobId: id, sortBy: sortBy, order: 'desc', limit: 50 }),
      ]);
      setJob(jobRes.data.data);
      setApplications(appsRes.data.data);
    } catch {
      toast.error('Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id, sortBy]);

  const handleDelete = async () => {
    if (!confirm(`Delete "${job?.title}"? This will also delete all ${applications.length} applications.`)) return;
    setDeleting(true);
    try {
      await jobsAPI.delete(id);
      toast.success('Job deleted successfully.');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete job.');
      setDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const res = await jobsAPI.update(id, { status: newStatus });
      setJob(res.data.data);
      toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'}.`);
    } catch {
      toast.error('Failed to update job status.');
    }
  };

  const handleRank = async () => {
    setRankLoading(true);
    try {
      const res = await applicationsAPI.rank(id);
      setRankInsights(res.data.data.aiRankingInsights);
      toast.success('Candidates ranked by AI! ');
    } catch {
      toast.error('Ranking failed. Ensure candidates have been analyzed.');
    } finally {
      setRankLoading(false);
    }
  };

  const filteredApps = filterStatus
    ? applications.filter(a => a.status === filterStatus)
    : applications;

  const scoreColor = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!job) return <div className="page-wrapper"><div className="container"><p>Job not found.</p></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container job-detail-page">
        {/* Header */}
        <div className="job-detail-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={14} /> Dashboard
          </button>

          <div className="job-detail-title">
            <div className="job-detail-icon"><Briefcase size={24} /></div>
            <div>
              <h1>{job.title}</h1>
              <div className="job-detail-meta">
                <span><MapPin size={12} />{job.location}</span>
                <span><Briefcase size={12} />{job.jobType?.replace('-', ' ')}</span>
                <span><Clock size={12} />{new Date(job.createdAt).toLocaleDateString()}</span>
                <span className={`badge ${job.status === 'open' ? 'badge-green' : 'badge-red'}`}>{job.status}</span>
              </div>
            </div>
          </div>

          <div className="job-detail-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleToggleStatus}>
              {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${id}/upload`)}>
              <Upload size={13} /> Add Candidate
            </button>
            <button className="btn btn-danger btn-sm btn-icon" onClick={handleDelete} disabled={deleting}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="job-detail-layout">
          {/* Left: Candidate List */}
          <div className="candidates-panel">
            <div className="panel-header">
              <div>
                <h2 className="section-title">Candidates</h2>
                <p className="section-subtitle">{applications.length} applicants total</p>
              </div>
              <div className="panel-controls">
                <select
                  className="form-select"
                  style={{ width: '130px' }}
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  id="status-filter-detail"
                >
                  <option value="">All Stages</option>
                  {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <select
                  className="form-select"
                  style={{ width: '130px' }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  id="sort-by"
                >
                  <option value="score">Sort by Score</option>
                  <option value="createdAt">Sort by Date</option>
                </select>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleRank}
                  disabled={rankLoading}
                  id="rank-candidates-btn"
                >
                  {rankLoading ? <div className="spinner" /> : <Zap size={13} />}
                  AI Rank
                </button>
              </div>
            </div>

            {/* Rank Insights Banner */}
            {rankInsights && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rank-banner"
              >
                <TrendingUp size={14} color="#a855f7" />
                <div>
                  <strong>AI Ranking Complete</strong>
                  <p>{rankInsights}</p>
                </div>
              </motion.div>
            )}

            {/* Pipeline Stage Tabs */}
            <div className="pipeline-tabs">
              <button
                className={`pipeline-tab ${filterStatus === '' ? 'active' : ''}`}
                onClick={() => setFilterStatus('')}
              >
                All <span>{applications.length}</span>
              </button>
              {PIPELINE_STAGES.map(stage => {
                const count = applications.filter(a => a.status === stage).length;
                if (count === 0) return null;
                return (
                  <button
                    key={stage}
                    className={`pipeline-tab ${filterStatus === stage ? 'active' : ''}`}
                    onClick={() => setFilterStatus(stage)}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Candidate Cards */}
            <div className="candidate-list">
              {filteredApps.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"></div>
                  <h3>No candidates yet</h3>
                  <p>Add candidates by uploading their resumes.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${id}/upload`)}>
                    <Plus size={13} /> Add First Candidate
                  </button>
                </div>
              ) : (
                filteredApps.map((app, i) => {
                  const score = app.aiAnalysis?.overallScore;
                  return (
                    <motion.div
                      key={app._id}
                      className="candidate-card"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => navigate(`/applications/${app._id}`)}
                    >
                      <div className="candidate-card-left">
                        <div className="cand-avatar">
                          {app.candidateName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div className="cand-name">{app.candidateName}</div>
                          <div className="cand-email">{app.candidateEmail}</div>
                          {app.resumeFileName && <div className="cand-file">{app.resumeFileName}</div>}
                        </div>
                      </div>

                      <div className="candidate-card-right">
                        {score !== undefined && score !== null ? (
                          <div className="cand-score" style={{ color: scoreColor(score) }}>
                            <RecommendationIcon rec={app.aiAnalysis?.recommendation} />
                            <span className="cand-score-num">{score}</span>
                          </div>
                        ) : (
                          <span className={`badge ${app.analysisStatus === 'processing' ? 'badge-yellow' : 'badge-gray'}`}>
                            {app.analysisStatus === 'processing' ? ' Analyzing' : 'Pending'}
                          </span>
                        )}
                        <span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>
                          {app.status}
                        </span>
                        <ChevronRight size={14} color="var(--text-muted)" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Job Info */}
          <div className="job-info-panel">
            {/* Stats */}
            <div className="job-info-stats">
              <div className="info-stat">
                <span className="info-stat-value">{job.applicantCount || 0}</span>
                <span className="info-stat-label">Applicants</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-value" style={{ color: job.averageScore >= 70 ? '#10b981' : job.averageScore >= 45 ? '#f59e0b' : '#ef4444' }}>
                  {job.averageScore || '—'}
                </span>
                <span className="info-stat-label">Avg Score</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-value">{applications.filter(a => a.status === 'hired').length}</span>
                <span className="info-stat-label">Hired</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="info-section">
              <h3>Description</h3>
              <div className="job-desc-preview">
                {job.description?.split('\n').slice(0, 8).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="info-section">
                <h3>Required Skills</h3>
                <div className="chips-container">
                  {job.skills.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="info-section">
                <h3>Requirements</h3>
                <ul className="req-list">
                  {job.requirements.map((r, i) => (
                    <li key={i}><CheckCircle size={13} color="#10b981" />{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salary */}
            {(job.salaryRange?.min || job.salaryRange?.max) && (
              <div className="info-section">
                <h3>Salary Range</h3>
                <p className="salary-range">
                  ${job.salaryRange.min?.toLocaleString()} — ${job.salaryRange.max?.toLocaleString()} {job.salaryRange.currency}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
