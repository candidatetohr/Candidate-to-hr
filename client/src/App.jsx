import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AnalyticsService from './services/AnalyticsService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';

import LandingPage from './pages/LandingPage';

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
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage'));

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

// E-E-A-T and Programmatic SEO Pages
const EditorialPolicyPage = lazy(() => import('./pages/EditorialPolicyPage'));
const AIUsagePolicyPage = lazy(() => import('./pages/AIUsagePolicyPage'));
const ProgrammaticSalaryPage = lazy(() => import('./pages/ProgrammaticSalaryPage'));
const ProgrammaticCounterOfferPage = lazy(() => import('./pages/ProgrammaticCounterOfferPage'));

// Trust Center Pages
const TrustCenterPage = lazy(() => import('./pages/TrustCenterPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const FactCheckingPolicyPage = lazy(() => import('./pages/FactCheckingPolicyPage'));

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
  const location = useLocation();

  useEffect(() => {
    AnalyticsService.pageView(location.pathname + location.search);
  }, [location]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to Content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
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
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
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
          
          {/* Programmatic SEO Routes */}
          <Route path="/salary-guides/:role/in/:city" element={<ProgrammaticSalaryPage />} />
          <Route path="/resume-summaries/:role" element={<ProgrammaticCounterOfferPage />} />
          
          {/* Static & Legal Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          
          {/* E-E-A-T policy subpages */}
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          <Route path="/ai-policy" element={<AIUsagePolicyPage />} />
          <Route path="/trust" element={<TrustCenterPage />} />
          <Route path="/trust/cookies" element={<CookiePolicyPage />} />
          <Route path="/trust/accessibility" element={<AccessibilityPage />} />
          <Route path="/trust/security" element={<SecurityPage />} />
          <Route path="/trust/fact-checking" element={<FactCheckingPolicyPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
