import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, BarChart3, Plus,
  LogOut, User, Menu, X, Zap, ChevronDown, FileText, MessageSquare, BookOpen, DollarSign, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const recruiterLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const candidateLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze', label: 'Resume', icon: FileText },
  { to: '/interview-sim', label: 'Interviews', icon: MessageSquare },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [articlesMenuOpen, setArticlesMenuOpen] = useState(false);

  const navLinks = user?.role === 'candidate' ? candidateLinks : recruiterLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <div className="logo-icon">
            <Zap size={16} />
          </div>
          <span className="logo-text">Candidatetohr</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          
          {/* Articles Dropdown (Desktop) */}
          <div className="user-menu-wrapper" onMouseLeave={() => setArticlesMenuOpen(false)}>
            <button
              className={`nav-link ${location.pathname.includes('/roadmaps') || location.pathname.includes('/interview-questions') ? 'active' : ''}`}
              onClick={() => setArticlesMenuOpen(!articlesMenuOpen)}
              onMouseEnter={() => setArticlesMenuOpen(true)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              <BookOpen size={16} />
              Articles
              <ChevronDown size={14} className={`chevron ${articlesMenuOpen ? 'open' : ''}`} />
            </button>

            <AnimatePresence>
              {articlesMenuOpen && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ top: '100%', left: 0, right: 'auto' }}
                >
                  <Link to="/career-guides" className="dropdown-item" onClick={() => setArticlesMenuOpen(false)}>
                    <BookOpen size={14} /> Career Guides
                  </Link>
                  <Link to="/roadmaps" className="dropdown-item" onClick={() => setArticlesMenuOpen(false)}>
                    <MapPin size={14} /> Career Roadmaps
                  </Link>
                  <Link to="/interview-questions" className="dropdown-item" onClick={() => setArticlesMenuOpen(false)}>
                    <MessageSquare size={14} /> Interview Questions
                  </Link>
                  <Link to="/resume-examples" className="dropdown-item" onClick={() => setArticlesMenuOpen(false)}>
                    <FileText size={14} /> Resume Examples
                  </Link>
                  <Link to="/salary-guides" className="dropdown-item" onClick={() => setArticlesMenuOpen(false)}>
                    <DollarSign size={14} /> Salary Guides
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
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
                  <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                    <User size={14} /> Profile
                  </button>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            
            <div className="dropdown-divider" />
            <div className="mobile-menu-section-title" style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Articles</div>
            <Link to="/career-guides" className="dropdown-item" onClick={() => setMobileOpen(false)}><BookOpen size={14} /> Career Guides</Link>
            <Link to="/roadmaps" className="dropdown-item" onClick={() => setMobileOpen(false)}><MapPin size={14} /> Career Roadmaps</Link>
            <Link to="/interview-questions" className="dropdown-item" onClick={() => setMobileOpen(false)}><MessageSquare size={14} /> Interview Questions</Link>
            <Link to="/resume-examples" className="dropdown-item" onClick={() => setMobileOpen(false)}><FileText size={14} /> Resume Examples</Link>
            <Link to="/salary-guides" className="dropdown-item" onClick={() => setMobileOpen(false)}><DollarSign size={14} /> Salary Guides</Link>
            <div className="dropdown-divider" />
            {user?.role !== 'candidate' && (
              <button className="btn btn-primary btn-sm" onClick={() => { navigate('/jobs/create'); setMobileOpen(false); }}>
                <Plus size={14} /> Post Job
              </button>
            )}
            <button className="dropdown-item danger" onClick={handleLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
