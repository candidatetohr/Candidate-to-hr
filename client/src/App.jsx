import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardRouter from './components/DashboardRouter';
import JobDetailPage from './pages/JobDetailPage';
import CreateJobPage from './pages/CreateJobPage';
import UploadResumePage from './pages/UploadResumePage';
import CandidateFeedbackPage from './pages/CandidateFeedbackPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import LiveEditorPage from './pages/LiveEditorPage';
import InterviewSimPage from './pages/InterviewSimPage';
import RejectionDecoderPage from './pages/RejectionDecoderPage';
import LearningPathPage from './pages/LearningPathPage';
import ProbabilityEnginePage from './pages/ProbabilityEnginePage';
import TruthDetectorPage from './pages/TruthDetectorPage';

import RoadmapHub from './pages/RoadmapHub';
import RoadmapDetail from './pages/RoadmapDetail';
import InterviewHub from './pages/InterviewHub';
import InterviewDetail from './pages/InterviewDetail';
import ResumeHub from './pages/ResumeHub';
import ResumeDetail from './pages/ResumeDetail';
import SalaryHub from './pages/SalaryHub';
import SalaryDetail from './pages/SalaryDetail';
import CareerGuideHub from './pages/CareerGuideHub';
import CareerGuideDetail from './pages/CareerGuideDetail';

// Legal and Static Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import SitemapPage from './pages/SitemapPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/jobs/create" element={<ProtectedRoute><CreateJobPage /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
        <Route path="/jobs/:id/upload" element={<ProtectedRoute><UploadResumePage /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute><CandidateFeedbackPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/analyze" element={<ResumeAnalyzerPage />} />
        <Route path="/live-editor" element={<LiveEditorPage />} />
        <Route path="/interview-sim" element={<InterviewSimPage />} />
        <Route path="/rejection-decoder" element={<RejectionDecoderPage />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/placement-probability" element={<ProbabilityEnginePage />} />
        <Route path="/truth-detector" element={<TruthDetectorPage />} />
        
        {/* SEO Hubs */}
        <Route path="/roadmaps" element={<RoadmapHub />} />
        <Route path="/roadmaps/:slug" element={<RoadmapDetail />} />
        <Route path="/interview-questions" element={<InterviewHub />} />
        <Route path="/interview-questions/:slug" element={<InterviewDetail />} />
        <Route path="/resume-examples" element={<ResumeHub />} />
        <Route path="/resume-examples/:slug" element={<ResumeDetail />} />
        <Route path="/salary-guides" element={<SalaryHub />} />
        <Route path="/salary-guides/:slug" element={<SalaryDetail />} />
        <Route path="/career-guides" element={<CareerGuideHub />} />
        <Route path="/career-guides/:slug" element={<CareerGuideDetail />} />
        
        {/* Static & Legal Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
      <Footer />
    </>
  );
}
