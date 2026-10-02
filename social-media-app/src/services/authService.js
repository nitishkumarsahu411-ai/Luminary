/**
 * ============================================================
 * authService.js — Authentication API Service
 * ============================================================
 *
 * All authentication-related API calls live here.
 * The backend developer connects real endpoints by replacing
 * the mock implementations inside each function.
 *
 * MOCK MODE: When USE_MOCK is true, functions return fake data
 * without making real network calls. Set to false when backend is ready.
 * ============================================================
 */

import api from './api';
import { MOCK_USERS } from '../utils/mockData';

// ---------------------------------------------------------------
// Toggle this to false once the backend is ready
// ---------------------------------------------------------------
const USE_MOCK = true;

// Simulates network delay in mock mode
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

/**
 * registerUser — Register a new user account
 *
 * BACKEND: POST /api/auth/register
 * Request body (JSON):
 *   { name, username, email, password }
 *
 * Expected response:
 *   { success: true, message: "Account created", user: { id, name, username, email, profileImage, bio } }
 *
 * Error response:
 *   { success: false, message: "Email already exists" }
 *
 * Auth required: No
 */
export async function registerUser({ name, username, email, password }) {
  if (USE_MOCK) {
    await delay();
    const existingUser = MOCK_USERS.find(
      (u) => u.email === email || u.username === username
    );
    if (existingUser) {
      throw new Error('Email or username already exists.');
    }
    const newUser = {
      id: String(Date.now()),
      name,
      username,
      email,
      profileImage: null,
      bio: '',
      postsCount: 0,
    };
    MOCK_USERS.push(newUser);
    return { success: true, user: newUser };
  }

  // BACKEND: Replace mock with real API call
  const response = await api.post('/api/auth/register', {
    name,
    username,
    email,
    password,
  });
  return response.data;
}

/**
 * loginUser — Log in with email/username + password
 *
 * BACKEND: POST /api/auth/login
 * Request body (JSON):
 *   { email, password }
 *
 * Expected response:
 *   { success: true, user: { id, name, username, email, profileImage, bio } }
 *
 * Error response:
 *   { success: false, message: "Invalid credentials" }
 *
 * Auth required: No
 */
export async function loginUser({ email, password }) {
  if (USE_MOCK) {
    await delay();
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    const { password: _pw, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  // BACKEND: Replace mock with real API call
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

/**
 * logoutUser — Log the current user out
 *
 * BACKEND: POST /api/auth/logout
 * Request body: none
 *
 * Expected response:
 *   { success: true, message: "Logged out" }
 *
 * Auth required: Yes
 */
export async function logoutUser() {
  if (USE_MOCK) {
    await delay(300);
    return { success: true };
  }

  // BACKEND: Replace mock with real API call
  const response = await api.post('/api/auth/logout');
  return response.data;
}

/**
 * getCurrentUser — Fetch the currently authenticated user
 *
 * BACKEND: GET /api/auth/me
 * Headers: Cookie (session) or Authorization: Bearer <token>
 *
 * Expected response:
 *   { success: true, user: { id, name, username, email, profileImage, bio } }
 *
 * Error: 401 if not authenticated
 *
 * Auth required: Yes
 */
export async function getCurrentUser() {
  if (USE_MOCK) {
    await delay(300);
    // In mock mode, return null (user must log in)
    return null;
  }

  // BACKEND: Replace mock with real API call
  const response = await api.get('/api/auth/me');
  return response.data.user;
}
