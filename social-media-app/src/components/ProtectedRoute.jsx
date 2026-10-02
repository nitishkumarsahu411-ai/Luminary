/**
 * ProtectedRoute.jsx — Guards routes that require authentication
 *
 * If the user is not logged in, they are redirected to /login.
 * While auth is still loading (checking session), shows a loading screen.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loading fullPage message="Checking authentication…" />;
  }

  if (!isAuthenticated) {
    // Save the intended destination so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
