import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Briefcase, Users, TrendingUp, Clock,
  Search, Filter, ChevronRight, Zap, BarChart3, Award
} from 'lucide-react';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Dashboard.css';

const statusColors = {
  open: 'badge-green',
  closed: 'badge-red',
  draft: 'badge-gray',
};

const JobCard = ({ job, onClick }) => {
  const scoreColor = job.averageScore >= 70 ? '#10b981' : job.averageScore >= 45 ? '#f59e0b' : '#64748b';

  return (
    <motion.div
      className="job-card"
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="job-card-header">
        <div className="job-icon">
          <Briefcase size={18} />
        </div>
        <span className={`badge ${statusColors[job.status] || 'badge-gray'}`}>
          {job.status}
        </span>
      </div>

      <h3 className="job-title">{job.title}</h3>

      <div className="job-meta">
        <span>{job.location || 'Remote'}</span>
        <span>•</span>
        <span>{job.jobType?.replace('-', ' ')}</span>
        {job.experienceLevel && <><span>•</span><span>{job.experienceLevel}</span></>}
      </div>

      <div className="job-skills">
        {job.skills?.slice(0, 3).map(skill => (
          <span key={skill} className="chip">{skill}</span>
        ))}
        {job.skills?.length > 3 && (
          <span className="chip">+{job.skills.length - 3}</span>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
          <div className="job-stat">
            <Users size={13} />
            <span>{job.applicantCount || 0} applicants</span>
          </div>
          {job.averageScore > 0 && (
            <div className="job-stat">
              <Award size={13} />
              <span style={{ color: scoreColor }}>Avg {job.averageScore}%</span>
            </div>
          )}
        </div>
        <ChevronRight size={16} className="job-arrow" />
      </div>

      <div className="job-card-age">
        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await jobsAPI.getAll(params);
      setJobs(res.data.data);
    } catch {
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await jobsAPI.getStats();
      const statsArr = res.data.data;
      const computed = {
        total: statsArr.reduce((s, i) => s + i.count, 0),
        open: statsArr.find(i => i._id === 'open')?.count || 0,
        totalApplicants: statsArr.reduce((s, i) => s + (i.totalApplicants || 0), 0),
      };
      setStats(computed);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchJobs, 400);
    return () => clearTimeout(debounce);
  }, [search, statusFilter]);

  const statCards = [
    { label: 'Total Jobs', value: stats?.total ?? '—', icon: Briefcase, color: '#4f8ef7' },
    { label: 'Open Positions', value: stats?.open ?? '—', icon: TrendingUp, color: '#10b981' },
    { label: 'Total Applicants', value: stats?.totalApplicants ?? '—', icon: Users, color: '#a855f7' },
    { label: 'Powered by AI', value: 'NIM', icon: Zap, color: '#f59e0b' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container dashboard">
        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="dashboard-greeting">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 
            </h1>
            <p>Here's your hiring pipeline at a glance.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/analytics')}>
              <BarChart3 size={15} /> Analytics
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/jobs/create')}>
              <Plus size={15} /> Post New Job
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid-4 stats-grid">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="stat-card-inner">
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div className="stat-value" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Jobs Section */}
        <div className="jobs-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Job Listings</h2>
              <p className="section-subtitle">{jobs.length} position{jobs.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="jobs-filters">
              <div className="search-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  id="job-search"
                  type="text"
                  placeholder="Search jobs..."
                  className="form-input search-input"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                id="status-filter"
                className="form-select filter-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '16px' }} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <h3>No jobs found</h3>
              <p>Create your first job listing to start tracking candidates.</p>
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/jobs/create')}>
                <Plus size={14} /> Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {jobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <JobCard job={job} onClick={() => navigate(`/jobs/${job._id}`)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
