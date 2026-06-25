import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Briefcase, Users, TrendingUp, Sparkles,
  Search, Filter, ChevronRight, Zap, BarChart3, Award, Brain, ArrowUpRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './Dashboard.css';

const statusColors = {
  open: 'badge-emerald',
  closed: 'badge-rose',
  draft: 'badge-amber',
};

const JobCard = ({ job, onClick }) => {
  const scoreColor = job.averageScore >= 70 ? '#10b981' : job.averageScore >= 45 ? '#f59e0b' : '#64748b';

  return (
    <motion.div
      className="new-job-card"
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="new-job-card-header">
        <div className="new-job-icon">
          <Briefcase size={20} />
        </div>
        <span className={`new-badge ${statusColors[job.status] || 'badge-gray'}`}>
          {job.status}
        </span>
      </div>

      <h3 className="new-job-title">{job.title}</h3>

      <div className="new-job-meta">
        <span>{job.location || 'Remote'}</span>
        <span className="dot">•</span>
        <span>{job.jobType?.replace('-', ' ')}</span>
        {job.experienceLevel && (
          <>
            <span className="dot">•</span>
            <span className="lvl">{job.experienceLevel}</span>
          </>
        )}
      </div>

      <div className="new-job-skills">
        {job.skills?.slice(0, 3).map(skill => (
          <span key={skill} className="new-chip">{skill}</span>
        ))}
        {job.skills?.length > 3 && (
          <span className="new-chip-more">+{job.skills.length - 3}</span>
        )}
      </div>

      <div className="new-job-card-footer">
        <div className="new-job-stats">
          <div className="new-job-stat">
            <Users size={14} />
            <span>{job.applicantCount || 0} applicants</span>
          </div>
          {job.averageScore > 0 && (
            <div className="new-job-stat">
              <Award size={14} />
              <span style={{ color: scoreColor, fontWeight: '700' }}>Avg {job.averageScore}%</span>
            </div>
          )}
        </div>
        <ChevronRight size={18} className="new-job-arrow" />
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
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

      // Build data for chart
      if (statsArr.length > 0) {
        const mapped = statsArr.map(item => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          Jobs: item.count,
          Applicants: item.totalApplicants || 0,
        }));
        setChartData(mapped);
      } else {
        setChartData([
          { name: 'Applied', Applicants: 45 },
          { name: 'Screening', Applicants: 30 },
          { name: 'Interview', Applicants: 15 },
          { name: 'Offer', Applicants: 5 },
          { name: 'Hired', Applicants: 2 }
        ]);
      }
    } catch {
      // Set default mock chart data on failure or if empty database
      setChartData([
        { name: 'Applied', Applicants: 0 },
        { name: 'Screening', Applicants: 0 },
        { name: 'Interview', Applicants: 0 },
        { name: 'Offer', Applicants: 0 },
        { name: 'Hired', Applicants: 0 }
      ]);
    }
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
    { label: 'Total Jobs Created', value: stats?.total ?? '0', icon: Briefcase, color: '#3b82f6', bgGrad: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Active Open Roles', value: stats?.open ?? '0', icon: TrendingUp, color: '#10b981', bgGrad: 'from-emerald-500/20 to-emerald-600/5' },
    { label: 'Total Applicants', value: stats?.totalApplicants ?? '0', icon: Users, color: '#8b5cf6', bgGrad: 'from-violet-500/20 to-violet-600/5' },
    { label: 'AI Engine Integration', value: 'NIM Enabled', icon: Brain, color: '#f59e0b', bgGrad: 'from-amber-500/20 to-amber-600/5' },
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
    <div className="new-dashboard-page pb-48">
      <SEO title="Recruiter Dashboard" noindex />
      <div className="new-dashboard-container">
        
        <motion.div initial="hidden" animate="show" variants={containerVars} className="new-layout-wrapper">
          
          {/* HEADER SECTION */}
          <motion.div className="new-hero-banner" variants={itemVars}>
            <div className="hero-welcome">
              <h1>Welcome Back, <span className="premium-gradient-text">{user?.name?.split(' ')[0]}</span></h1>
              <p>Optimize your recruitment pipeline with the power of NVIDIA NIM AI tools.</p>
            </div>
            <div className="hero-cta-group">
              <button className="btn btn-secondary-glass" onClick={() => navigate('/analytics')}>
                <BarChart3 size={16} /> View Insights
              </button>
              <button className="btn btn-primary-glowing" onClick={() => navigate('/jobs/create')}>
                <Plus size={16} /> Post New Position
              </button>
            </div>
          </motion.div>

          {/* STATS & QUICK VISUALIZATION */}
          <div className="stats-visual-grid">
            
            {/* Stat Cards Column */}
            <div className="stat-cards-column">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`new-stat-card`}
                  variants={itemVars}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="new-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <stat.icon size={22} />
                  </div>
                  <div className="new-stat-details">
                    <span className="new-stat-value">{stat.value}</span>
                    <span className="new-stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Funnel/Pipeline Chart */}
            <motion.div className="new-chart-panel" variants={itemVars}>
              <div className="panel-header">
                <h3><BarChart3 size={18} /> Candidate Applications Volume</h3>
                <p>Status distribution of all applicants in your pipeline</p>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)', borderRadius: '12px', color: 'var(--text-primary)' }}
                      labelStyle={{ fontWeight: '700' }}
                    />
                    <Area type="monotone" dataKey="Applicants" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApplicants)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* MAIN ACTIONS & JOBS SPLIT */}
          <div className="main-dashboard-grid">
            
            {/* Left Column: Job Listings */}
            <div className="jobs-listings-column">
              <div className="section-title-bar">
                <div>
                  <h2>Active Listings</h2>
                  <p className="subtitle">{jobs.length} position{jobs.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="search-filter-controls">
                  <div className="search-box-wrapper">
                    <Search size={16} className="search-box-icon" />
                    <input
                      id="dashboard-job-search"
                      type="text"
                      placeholder="Search jobs..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    id="dashboard-status-filter"
                    className="select-filter-dropdown"
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
                <div className="loading-skeletons-grid">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-card" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="dashboard-empty-card">
                  <Briefcase size={40} className="text-muted" />
                  <h3>No jobs created yet</h3>
                  <p>Publish your first job description to start collecting and analyzing resume submissions with AI.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/jobs/create')}>
                    <Plus size={16} /> Create New Job
                  </button>
                </div>
              ) : (
                <div className="jobs-cards-grid">
                  {jobs.map((job, i) => (
                    <JobCard key={job._id} job={job} onClick={() => navigate(`/jobs/${job._id}`)} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: AI Toolkit & Advice */}
            <div className="ai-toolkit-column">
              
              {/* AI Command Center */}
              <motion.div className="new-glass-panel" variants={itemVars}>
                <h3><Brain size={18} className="text-violet" /> AI Toolkit Shortcuts</h3>
                <p className="subtext">Use our AI models to evaluate resumes, practice, or draft descriptions</p>
                <div className="ai-buttons-list">
                  <div 
                    className="ai-tool-item" 
                    onClick={() => navigate('/analyze')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/analyze');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Launch AI Resume Scanner"
                  >
                    <div className="tool-info">
                      <h4>AI Resume Scanner</h4>
                      <p>Run immediate multi-dimensional ATS evaluation</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                  <div 
                    className="ai-tool-item" 
                    onClick={() => navigate('/live-editor')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/live-editor');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Launch ATS Resume Editor"
                  >
                    <div className="tool-info">
                      <h4>ATS Resume Editor</h4>
                      <p>Modify and test resume content live</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                  <div 
                    className="ai-tool-item" 
                    onClick={() => navigate('/jobs/create')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/jobs/create');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Launch Job Description AI Writer"
                  >
                    <div className="tool-info">
                      <h4>Job Description AI Writer</h4>
                      <p>Create professional description templates</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                  <div 
                    className="ai-tool-item" 
                    onClick={() => navigate('/interview-sim')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/interview-sim');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Launch AI Mock Interview Simulator"
                  >
                    <div className="tool-info">
                      <h4>AI Mock Interview Simulator</h4>
                      <p>Conduct mock speech/text grading sessions</p>
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>

              {/* AI Coach Recruitment Advice */}
              <motion.div className="new-glass-panel coach-advice-panel" variants={itemVars}>
                <div className="coach-header">
                  <div className="sparkle-icon">
                    <Sparkles size={16} />
                  </div>
                  <span>AI Recruiter Tip of the Day</span>
                </div>
                <p>
                  To find the best technical fit, search beyond resumes. Look at candidates' projects and experience matching. High-performing recruits tend to have strong ratings (above 70%) on our multi-dimensional AI scoring engine.
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
