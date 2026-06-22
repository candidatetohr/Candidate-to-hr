import axios from 'axios';

const api = axios.create({
  baseURL: 'https://candidatetohr-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // 120 second timeout to allow Render to wake up and heavy LLM calls to finish
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ats_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ats_token');
      localStorage.removeItem('ats_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  google: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  verifyEmail: (token) => api.get(`/auth/verifyemail/${token}`),
  forgotPassword: (data) => api.post('/auth/forgotpassword', data),
  resetPassword: (token, data) => api.put(`/auth/resetpassword/${token}`, data),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  generateJD: (data) => api.post('/jobs/generate-jd', data),
  checkBias: (id) => api.get(`/jobs/${id}/bias-check`),
  getStats: () => api.get('/jobs/stats'),
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const applicationsAPI = {
  submit: (formData) => api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  bulkSubmit: (formData) => api.post('/applications/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/applications', { params }),
  getOne: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  getInterviewQuestions: (id) => api.get(`/applications/${id}/interview-questions`),
  getSkillsGap: (id) => api.get(`/applications/${id}/skills-gap`),
  getOptimizer: (id) => api.get(`/applications/${id}/optimizer`),
  rank: (jobId) => api.get(`/applications/rank?jobId=${jobId}`),
  getHirePrediction: (id) => api.get(`/applications/${id}/hire-prediction`),
};

// ─── Public Resume Analyser (no auth required) ───────────────────────────────
export const resumeAnalyzerAPI = {
  analyze: (formData) => api.post('/resume-analyzer/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  tailor: (data) => api.post('/resume-analyzer/tailor', data),
  careerIntelligence: (data) => api.post('/resume-analyzer/career-intelligence', data),
  rejectionDecoder: (data) => api.post('/resume-analyzer/rejection-decoder', data),
  projectEvaluator: (data) => api.post('/resume-analyzer/project-evaluator', data),
  brandBuilder: (data) => api.post('/resume-analyzer/brand-builder', data),
  learningPath: (data) => api.post('/resume-analyzer/learning-path', data),
  placementProbability: (data) => api.post('/resume-analyzer/placement-probability', data),
  truthDetector: (data) => api.post('/resume-analyzer/truth-detector', data),
  cultureFit: (data) => api.post('/resume-analyzer/culture-fit', data),
  offerNegotiator: (data) => api.post('/resume-analyzer/offer-negotiator', data),
  networkBuilder: (data) => api.post('/resume-analyzer/network-builder', data),
  portfolioOptimizer: (data) => api.post('/resume-analyzer/portfolio-optimizer', data),
  skillGapPublic: (data) => api.post('/resume-analyzer/skill-gap', data),
  // chat uses native fetch for SSE streaming (see CareerCoachChat component)
};

// ─── Live Score (public, no auth) ─────────────────────────────────────────────
export const liveScoreAPI = {
  score: (data) => api.post('/live-score/score', data),
};

// ─── Interview Simulator (public, no auth) ────────────────────────────────────
export const interviewAPI = {
  gradeAnswer: (data) => api.post('/interview/grade', data),
  sessionSummary: (data) => api.post('/interview/summary', data),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  overview: () => api.get('/analytics/overview'),
  scores: (jobId) => api.get('/analytics/scores', { params: { jobId } }),
  funnel: () => api.get('/analytics/funnel'),
  timeToHire: () => api.get('/analytics/time-to-hire'),
};

// ─── AI Resume Builder ────────────────────────────────────────────────────────
export const resumeBuilderAPI = {
  generate: (data) => api.post('/resume-builder/generate', data),
};

export default api;
