import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { m, AnimatePresence, LazyMotion } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut, User, Menu, X, Zap, ChevronDown, FileText, MessageSquare, BookOpen, MapPin, DollarSign, Plus, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import './Navbar.css';

const loadFeatures = () => import('../framerFeatures.js').then(res => res.default);

// The new standard AdSense-friendly public navigation structure
const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/interview-questions', label: 'Interview Questions' },
  { to: '/resume-examples', label: 'Resume Examples' },
  { to: '/career-guides', label: 'Career Guides' },
  { to: '/salary-guides', label: 'Salary Guide' },
  { to: '/roadmaps', label: 'Roadmap' },
  { to: '/analyze', label: 'Resume Score' },
  { to: '/resume-builder', label: 'AI Resume Builder' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener to open search
  useEffect(() => {
    const handleGlobalSearchShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalSearchShortcut);
    return () => window.removeEventListener('keydown', handleGlobalSearchShortcut);
  }, []);

  // H6: Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // H7: Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <LazyMotion features={loadFeatures}>
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="CandidateToHR - AI Career Platform">
          <picture>
            <source srcSet="/logo-32.avif 1x, /logo-64.avif 2x, /logo-96.avif 3x" type="image/avif" />
            <source srcSet="/logo-32.webp 1x, /logo-64.webp 2x, /logo-96.webp 3x" type="image/webp" />
            <img 
              src="/logo-32.png" 
              srcSet="/logo-32.png 1x, /logo-64.png 2x, /logo-96.png 3x" 
              alt="CandidateToHR Logo" 
              width="32" 
              height="32" 
              fetchPriority="high"
              style={{ height: '32px' }} 
            />
          </picture>
          <span className="navbar-brand-text">CandidateToHR</span>
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
          <button
            className="navbar-search-trigger-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search CandidateToHR (Ctrl+K)"
          >
            <Search size={16} />
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>

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
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-menu-trigger"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">{initials}</div>
                  <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <m.div
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
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" aria-label="Toggle navigation menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="mobile-search-bar-btn"
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              aria-label="Search platform"
            >
              <Search size={16} />
              <span>Search platform...</span>
            </button>

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
          </m.div>
        )}
      </AnimatePresence>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
    </LazyMotion>
  );
}
