/**
 * AuthContext.jsx — Global Authentication State
 *
 * Provides the current user, auth loading state, and auth actions
 * (login, logout, register, updateUser) to the entire application.
 *
 * BACKEND NOTE:
 * On app load, `initializeAuth()` calls `getCurrentUser()` to check
 * if the user has an active session (cookie/JWT). Once the backend
 * is connected, this will automatically restore the session.
 *
 * The `user` object stored in localStorage is a CACHE ONLY.
 * The backend is the source of truth for authentication state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true while checking session

  /**
   * initializeAuth — Called once on app mount.
   * Checks if the user is already authenticated (e.g., from a cookie or localStorage cache).
   *
   * BACKEND NOTE: When USE_MOCK = false, this will call GET /api/auth/me.
   * If it succeeds, the user is logged in. If it returns 401, they are not.
   */
  const initializeAuth = useCallback(async () => {
    try {
      // First, check localStorage cache for fast render
      const cached = localStorage.getItem('luminary_user');
      if (cached) {
        setUser(JSON.parse(cached));
      }

      // BACKEND: This will hit GET /api/auth/me to validate the session
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('luminary_user', JSON.stringify(currentUser));
      }
    } catch {
      // Session expired or no session — clear any stale cache
      localStorage.removeItem('luminary_user');
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * login — Called after a successful login API call.
   * Saves the user to state and localStorage cache.
   */
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('luminary_user', JSON.stringify(userData));
  }, []);

  /**
   * logout — Clears auth state and localStorage cache.
   * The actual API call is made in the component that triggers logout.
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('luminary_user');
  }, []);

  /**
   * updateUser — Merge updated fields into the stored user.
   * Called after a successful profile update.
   */
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('luminary_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const value = {
    user,
    authLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — Custom hook to access authentication context.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
