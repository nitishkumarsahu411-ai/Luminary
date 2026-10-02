/**
 * ============================================================
 * api.js — Central API Configuration & Contract
 * ============================================================
 *
 * This file is the SINGLE source of truth for all API communication.
 * The backend developer should modify BASE_URL to point to the real server.
 *
 * All API calls in this application go through the axios instance
 * defined here so that authentication headers, error handling,
 * and base URL are managed in ONE place.
 *
 * ============================================================
 * BACKEND DEVELOPER NOTE:
 * Change BASE_URL to your deployed server URL before going live.
 * Example: "https://api.luminary.com"
 * ============================================================
 */

import axios from 'axios';

// ---------------------------------------------------------------
// BASE URL — change this to your backend server URL
// ---------------------------------------------------------------
const BASE_URL = 'http://localhost:5000'; // <-- BACKEND: update this

/**
 * Axios instance shared by all services.
 * - Automatically sends cookies (withCredentials: true) for session auth.
 * - Sets JSON content type for all requests.
 *
 * BACKEND NOTE: If you use JWT tokens stored in localStorage instead
 * of cookies, add an interceptor below to attach the Authorization header.
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for cookie-based sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Runs before every request. Use this to attach JWT tokens if needed.
 *
 * BACKEND NOTE: If you use JWT (localStorage), uncomment the block below:
 *
 * api.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('authToken');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 */

/**
 * Response Interceptor
 * Runs after every response. Handles global errors like 401 Unauthorized.
 *
 * BACKEND NOTE: If the backend returns 401, the user is redirected to login.
 * Adjust the redirect path if your login route differs.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any local auth state and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * ============================================================
 * API CONTRACT SUMMARY
 * ============================================================
 *
 * All endpoints assume the BASE_URL prefix above.
 *
 * --- Authentication ---
 * POST   /api/auth/register     — Register a new user
 * POST   /api/auth/login        — Log in
 * POST   /api/auth/logout       — Log out
 * GET    /api/auth/me           — Get current authenticated user
 *
 * --- Posts ---
 * GET    /api/posts             — Get all posts (feed)
 * GET    /api/posts/:postId     — Get a single post by ID
 * POST   /api/posts             — Create a new post (multipart/form-data)
 * PUT    /api/posts/:postId     — Update a post (multipart/form-data)
 * DELETE /api/posts/:postId     — Delete a post
 *
 * --- Users ---
 * GET    /api/users/:userId     — Get a user's public profile
 * GET    /api/users/:userId/posts — Get all posts by a specific user
 * PUT    /api/users/me          — Update current user's profile
 * DELETE /api/users/me         — Delete current user's account
 *
 * ============================================================
 */
