/**
 * Landing.jsx — Public landing page for unauthenticated visitors
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const { isAuthenticated, authLoading } = useAuth();

  // Redirect already-logged-in users
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="landing-hero">
        {/* Animated background orbs */}
        <div className="hero-orb hero-orb-1" aria-hidden="true"></div>
        <div className="hero-orb hero-orb-2" aria-hidden="true"></div>
        <div className="hero-orb hero-orb-3" aria-hidden="true"></div>

        <div className="landing-nav">
          <div className="landing-logo">
            <span className="landing-logo-icon">✦</span>
            <span className="landing-logo-text">Luminary</span>
          </div>
          <div className="landing-nav-btns">
            <Link to="/login" className="btn btn-ghost">Log In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">✦ A new way to share</div>
          <h1 className="hero-heading">
            Share your <span className="hero-highlight">moments</span>,
            <br /> light up the world.
          </h1>
          <p className="hero-sub">
            Luminary is a modern social platform where you can share photos,
            express thoughts, and connect with people who see the world like you do.
          </p>
          <div className="hero-cta-group">
            <Link to="/register" className="btn btn-primary btn-lg" id="landing-register-btn">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" id="landing-login-btn">
              Log In
            </Link>
          </div>
          <p className="hero-fine-print">No ads. No algorithms. Just your moments.</p>
        </div>

        {/* Mock feed preview cards */}
        <div className="hero-preview" aria-hidden="true">
          <div className="preview-card preview-card-1">
            <div className="preview-card-header">
              <div className="preview-avatar preview-avatar-a"></div>
              <div className="preview-meta">
                <span className="preview-name">@alexrivera</span>
                <span className="preview-time">2h ago</span>
              </div>
            </div>
            <div className="preview-img preview-img-1"></div>
            <p className="preview-caption">Golden hour hits different from the mountaintop 🏔️✨</p>
          </div>
          <div className="preview-card preview-card-2">
            <div className="preview-card-header">
              <div className="preview-avatar preview-avatar-b"></div>
              <div className="preview-meta">
                <span className="preview-name">@samchen</span>
                <span className="preview-time">5h ago</span>
              </div>
            </div>
            <div className="preview-img preview-img-2"></div>
            <p className="preview-caption">New design system dropped 🎨</p>
          </div>
          <div className="preview-card preview-card-3">
            <div className="preview-card-header">
              <div className="preview-avatar preview-avatar-c"></div>
              <div className="preview-meta">
                <span className="preview-name">@jordanlee</span>
                <span className="preview-time">1d ago</span>
              </div>
            </div>
            <div className="preview-img preview-img-3"></div>
            <p className="preview-caption">Reading by the window on a rainy day 📚</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <h2 className="features-title">Features designed for connection</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3 className="feature-name">Share Photos</h3>
            <p className="feature-desc">
              Upload stunning photos and pair them with captions that tell your story.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-name">Explore the Feed</h3>
            <p className="feature-desc">
              Discover moments from people around the world in a beautiful, clean feed.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3 className="feature-name">Edit Anytime</h3>
            <p className="feature-desc">
              Changed your mind? Update your photo or caption whenever you want.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-name">Your Data, Your Control</h3>
            <p className="feature-desc">
              Delete posts or your account anytime. No strings attached.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="cta-heading">Ready to share your moments?</h2>
        <p className="cta-sub">Join thousands of creators sharing their world on Luminary.</p>
        <Link to="/register" className="btn btn-primary btn-lg" id="landing-bottom-cta">
          Get Started — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Luminary. Built with ✦</p>
      </footer>
    </div>
  );
}

export default Landing;
