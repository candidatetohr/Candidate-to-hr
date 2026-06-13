import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut, User, Menu, X, Zap, ChevronDown, FileText, MessageSquare, BookOpen, MapPin, DollarSign, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// The new standard AdSense-friendly public navigation structure
const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/interview-questions', label: 'Interview Questions' },
  { to: '/resume-examples', label: 'Resume Examples' },
  { to: '/career-guides', label: 'Career Guides' },
  { to: '/analyze', label: 'Resume Score' },
  { to: '/live-editor', label: 'Resume Builder' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="CandidateToHR Logo" width="32" height="32" style={{ height: '32px' }} />
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {publicLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {!user ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/login')}
            >
              Login / Register
            </button>
          ) : (
            <>
              {user?.role !== 'candidate' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/jobs/create')}
                >
                  <Plus size={14} />
                  Post Job
                </button>
              )}
              {/* User Menu */}
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">{initials}</div>
                  <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="user-info">
                        <div className="user-avatar user-avatar-lg">{initials}</div>
                        <div>
                          <div className="user-name">{user?.name}</div>
                          <div className="user-email">{user?.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <Link to="/profile/edit" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <User size={14} /> Profile
                      </Link>
                      <button className="dropdown-item danger" onClick={handleLogout}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {publicLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            
            <div className="dropdown-divider" />
            
            {!user ? (
              <button className="btn btn-primary btn-sm" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                Login / Register
              </button>
            ) : (
              <>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                {user?.role !== 'candidate' && (
                  <button className="btn btn-primary btn-sm" onClick={() => { navigate('/jobs/create'); setMobileOpen(false); }}>
                    <Plus size={14} /> Post Job
                  </button>
                )}
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
