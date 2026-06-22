import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { analyticsAPI } from '../services/api';
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react';

import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './AnalyticsPage.css';

const COLORS = ['#4f8ef7', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
const FUNNEL_COLORS = {
  applied: '#4f8ef7',
  screening: '#f59e0b',
  interview: '#a855f7',
  offer: '#10b981',
  hired: '#059669',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ovRes, funRes, scRes] = await Promise.all([
          analyticsAPI.overview(),
          analyticsAPI.funnel(),
          analyticsAPI.scores(),
        ]);
        setOverview(ovRes.data.data);
        setFunnel(funRes.data.data);
        setScores(scRes.data.data);
      } catch {
        toast.error('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pieData = overview?.pipelineBreakdown
    ? Object.entries(overview.pipelineBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <SEO title="Analytics" noindex />
      <div className="container analytics-page">
        {/* Header */}
        <motion.div
          className="analytics-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1><BarChart3 size={28} /> Analytics Dashboard</h1>
            <p>Real-time insights into your hiring pipeline powered by AI.</p>
          </div>
        </motion.div>

        {/* Summary Stats */}
        {overview?.summary && (
          <div className="grid-4 analytics-stats">
            {[
              { label: 'Total Jobs', value: overview.summary.totalJobs, icon: <BarChart3 size={22} />, color: '#4f8ef7' },
              { label: 'Total Applicants', value: overview.summary.totalApplications, icon: <Users size={22} />, color: '#a855f7' },
              { label: 'In Interview', value: overview.summary.interviewCount, icon: <TrendingUp size={22} />, color: '#f59e0b' },
              { label: 'Hired', value: overview.summary.hiredCount, icon: <Award size={22} />, color: '#10b981' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div
                  className="stat-value"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="charts-grid">
          {/* Hiring Funnel */}
          {funnel.length > 0 && (
            <motion.div
              className="chart-card chart-card-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Hiring Funnel</h3>
              <p>Candidates at each stage of the hiring pipeline</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnel} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    width={80}
                    tickFormatter={s => s.charAt(0).toUpperCase() + s.slice(1)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {funnel.map((entry, i) => (
                      <Cell key={i} fill={FUNNEL_COLORS[entry.stage] || '#4f8ef7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Score Distribution */}
          {scores.length > 0 && (
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>ATS Score Distribution</h3>
              <p>How candidates are scoring across all positions</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={scores}>
                  <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                    {scores.map((entry, i) => {
                      const rangeStart = parseInt(entry.range?.split('-')[0]);
                      const color = rangeStart >= 70 ? '#10b981' : rangeStart >= 40 ? '#f59e0b' : '#ef4444';
                      return <Cell key={i} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Pipeline Pie Chart */}
          {pieData.length > 0 && (
            <motion.div
              className="chart-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3>Pipeline Status Breakdown</h3>
              <p>Distribution of all candidates by current status</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Recent Applications */}
        {overview?.recentApplications?.length > 0 && (
          <motion.div
            className="chart-card recent-apps-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Recent Applications</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentApplications.map(app => (
                  <tr key={app._id}>
                    <td>{app.candidateName}</td>
                    <td>{app.jobTitle || '—'}</td>
                    <td>
                      <span className={`badge badge-sm ${app.status === 'hired' ? 'badge-green' : app.status === 'rejected' ? 'badge-red' : 'badge-blue'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.score != null ? (
                        <span style={{ color: app.score >= 70 ? '#10b981' : app.score >= 45 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                          {app.score}
                        </span>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Top Jobs */}
        {overview?.topJobs?.length > 0 && (
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h3> Top Jobs by Applicants</h3>
            <div className="top-jobs-list">
              {overview.topJobs.map((job, i) => (
                <div key={job._id} className="top-job-row">
                  <span className="top-job-rank">#{i + 1}</span>
                  <div className="top-job-info">
                    <div className="top-job-title">{job.title}</div>
                    <div className="top-job-meta">
                      <span className={`badge ${job.status === 'open' ? 'badge-green' : 'badge-red'}`}>{job.status}</span>
                    </div>
                  </div>
                  <div className="top-job-stats">
                    <span>{job.applicantCount} applicants</span>
                    {job.averageScore > 0 && (
                      <span style={{ color: job.averageScore >= 70 ? '#10b981' : '#f59e0b' }}>
                        Avg {job.averageScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!overview?.summary?.totalApplications && (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h3>No data yet</h3>
            <p>Create jobs and add candidates to see your analytics dashboard populate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
