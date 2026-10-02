/**
 * Register.jsx — New user registration page
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import { validateEmail } from '../utils/helpers';
import './AuthPages.css';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!form.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      newErrors.username = 'Username must be 3–20 characters (letters, numbers, underscores only).';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const result = await registerUser({
        name: form.name.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      login(result.user);
      navigate('/home', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" aria-hidden="true"></div>
      <div className="auth-orb auth-orb-2" aria-hidden="true"></div>

      <div className="auth-card auth-card--register">
        <div className="auth-logo">
          <Link to="/" className="auth-logo-link">
            <span className="auth-logo-icon">✦</span>
            <span className="auth-logo-text">Luminary</span>
          </Link>
        </div>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Join Luminary and start sharing your world.</p>

        {apiError && (
          <div className="auth-error" role="alert">
            {apiError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Alex Rivera"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-username" className="form-label">Username</label>
              <input
                id="reg-username"
                type="text"
                name="username"
                className={`form-input ${errors.username ? 'input-error' : ''}`}
                placeholder="alexrivera"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="register-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
