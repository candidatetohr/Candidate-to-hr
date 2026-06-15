import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CookieConsent from './components/CookieConsent';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardRouter = lazy(() => import('./components/DashboardRouter'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const UploadResumePage = lazy(() => import('./pages/UploadResumePage'));
const CandidateFeedbackPage = lazy(() => import('./pages/CandidateFeedbackPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ResumeAnalyzerPage = lazy(() => import('./pages/ResumeAnalyzerPage'));
const LiveEditorPage = lazy(() => import('./pages/LiveEditorPage'));
const InterviewSimPage = lazy(() => import('./pages/InterviewSimPage'));
const RejectionDecoderPage = lazy(() => import('./pages/RejectionDecoderPage'));
const LearningPathPage = lazy(() => import('./pages/LearningPathPage'));
const ProbabilityEnginePage = lazy(() => import('./pages/ProbabilityEnginePage'));
const TruthDetectorPage = lazy(() => import('./pages/TruthDetectorPage'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'));

// New AI Tool Pages
const CultureFitAnalyzerPage = lazy(() => import('./pages/CultureFitAnalyzerPage'));
const OfferNegotiatorPage = lazy(() => import('./pages/OfferNegotiatorPage'));
const SkillGapAnalyzerPage = lazy(() => import('./pages/SkillGapAnalyzerPage'));
const NetworkBuilderPage = lazy(() => import('./pages/NetworkBuilderPage'));
const PortfolioOptimizerPage = lazy(() => import('./pages/PortfolioOptimizerPage'));

const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));

const RoadmapHub = lazy(() => import('./pages/RoadmapHub'));
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const InterviewHub = lazy(() => import('./pages/InterviewHub'));
const InterviewDetail = lazy(() => import('./pages/InterviewDetail'));
const ResumeHub = lazy(() => import('./pages/ResumeHub'));
const ResumeDetail = lazy(() => import('./pages/ResumeDetail'));
const SalaryHub = lazy(() => import('./pages/SalaryHub'));
const SalaryDetail = lazy(() => import('./pages/SalaryDetail'));
const CareerGuideHub = lazy(() => import('./pages/CareerGuideHub'));
const CareerGuideDetail = lazy(() => import('./pages/CareerGuideDetail'));

// Legal and Static Pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', background: 'var(--bg-primary)' }}>
    <div className="spinner spinner-lg" />
  </div>
);

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
      <main>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
          <Route path="/verify-email/:token" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
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
          <Route path="/culture-fit" element={<CultureFitAnalyzerPage />} />
          <Route path="/offer-negotiator" element={<OfferNegotiatorPage />} />
          <Route path="/skill-gap" element={<SkillGapAnalyzerPage />} />
          <Route path="/network-builder" element={<NetworkBuilderPage />} />
          <Route path="/portfolio-optimizer" element={<PortfolioOptimizerPage />} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
          
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
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
