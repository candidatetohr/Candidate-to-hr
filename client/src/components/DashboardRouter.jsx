import { useAuth } from '../context/AuthContext';
import CandidateDashboard from '../pages/CandidateDashboard';
import RecruiterDashboard from '../pages/Dashboard'; // Old dashboard acts as recruiter dashboard
import { Navigate } from 'react-router-dom';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'candidate') {
    return <CandidateDashboard />;
  }

  // Fallback to RecruiterDashboard for 'recruiter' or 'admin' or legacy users
  return <RecruiterDashboard />;
}
