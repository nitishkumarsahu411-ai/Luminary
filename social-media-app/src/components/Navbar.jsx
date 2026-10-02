/**
 * Navbar.jsx — Instagram-inspired Navigation Bar with Theme Toggle & Mobile Bar
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authService';
import { getInitials } from '../utils/helpers';
import UserMenu from './UserMenu';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Even if API fails, clear local state
    } finally {
      logout();
      setLoggingOut(false);
      setMenuOpen(false);
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to={isAuthenticated ? '/home' : '/'} className="navbar-logo">
            <span className="navbar-logo-icon">✦</span>
            <span className="navbar-logo-text">Luminary</span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="navbar-links">
              <Link
                to="/home"
                className={`navbar-link ${isActive('/home') ? 'active' : ''}`}
                title="Home"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill={isActive('/home') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="nav-link-label">Home</span>
              </Link>

              <Link
                to="/create"
                className={`navbar-link ${isActive('/create') ? 'active' : ''}`}
                title="Create Post"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span className="nav-link-label">Create</span>
              </Link>

              <Link
                to={`/profile/${user?.id}`}
                className={`navbar-link ${location.pathname === `/profile/${user?.id}` ? 'active' : ''}`}
                title="Profile"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill={location.pathname === `/profile/${user?.id}` ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="nav-link-label">Profile</span>
              </Link>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="navbar-right">
            {/* Theme Toggle Button */}
            <button
              className="navbar-theme-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                /* Sun Icon */
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="navbar-user-wrap">
                <button
                  className="navbar-avatar-btn"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  aria-label="User menu"
                  id="navbar-user-menu-btn"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="navbar-avatar-img"
                    />
                  ) : (
                    <span className="navbar-avatar-initials">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <UserMenu
                    user={user}
                    onClose={() => setMenuOpen(false)}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                  />
                )}
              </div>
            ) : (
              <div className="navbar-auth-btns">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Instagram Style) */}
      {isAuthenticated && (
        <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
          <Link
            to="/home"
            className={`mobile-nav-item ${isActive('/home') ? 'active' : ''}`}
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill={isActive('/home') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          <Link
            to="/create"
            className={`mobile-nav-item ${isActive('/create') ? 'active' : ''}`}
            aria-label="Create Post"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </Link>

          <Link
            to="/settings"
            className={`mobile-nav-item ${isActive('/settings') ? 'active' : ''}`}
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>

          <Link
            to={`/profile/${user?.id}`}
            className={`mobile-nav-item ${location.pathname === `/profile/${user?.id}` ? 'active' : ''}`}
            aria-label="My Profile"
          >
            <div className="mobile-nav-avatar-wrap">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.username} className="mobile-nav-avatar" />
              ) : (
                <span className="mobile-nav-initials">{getInitials(user?.name)}</span>
              )}
            </div>
          </Link>
        </nav>
      )}
    </>
  );
}

export default Navbar;
