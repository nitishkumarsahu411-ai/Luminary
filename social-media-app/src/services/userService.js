/**
 * ============================================================
 * userService.js — User Profile API Service
 * ============================================================
 *
 * All user profile-related API calls live here.
 * Backend developer: replace mock implementations with real API calls.
 * ============================================================
 */

import api from './api';
import { MOCK_USERS, MOCK_POSTS } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

/**
 * getUserById — Get a user's public profile
 *
 * BACKEND: GET /api/users/:userId
 *
 * Expected response:
 *   {
 *     success: true,
 *     user: { id, name, username, email, profileImage, bio, postsCount }
 *   }
 *
 * Auth required: Yes
 */
export async function getUserById(userId, currentUserId) {
  if (USE_MOCK) {
    await delay();
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('User not found.');
    const { password: _pw, ...safeUser } = user;
    const postsCount = MOCK_POSTS.filter((p) => p.user.id === userId).length;

    // Follow relations calculation
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      isFollowing = user.isFollowing ?? false;
    }

    return {
      ...safeUser,
      postsCount,
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
      isFollowing,
    };
  }

  // BACKEND: Replace with real API call
  const response = await api.get(`/api/users/${userId}`);
  return response.data.user;
}

/**
 * getUserPosts — Get all posts by a specific user
 *
 * BACKEND: GET /api/users/:userId/posts
 *
 * Expected response:
 *   { success: true, posts: [ PostObject, ... ] }
 *
 * Auth required: Yes
 */
export async function getUserPosts(userId) {
  if (USE_MOCK) {
    await delay();
    return MOCK_POSTS.filter((p) => p.user.id === userId).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // BACKEND: Replace with real API call
  const response = await api.get(`/api/users/${userId}/posts`);
  return response.data.posts;
}

/**
 * updateProfile — Update the current user's profile
 *
 * BACKEND: PUT /api/users/me
 * Content-Type: multipart/form-data
 *
 * FormData fields:
 *   - name        : string (optional)
 *   - username    : string (optional)
 *   - bio         : string (optional)
 *   - profileImage: File   (optional — new avatar image)
 *
 * Expected response:
 *   { success: true, message: "Profile updated", user: UserObject }
 *
 * Auth required: Yes
 */
export async function updateProfile({ name, username, bio, profileImageFile }) {
  if (USE_MOCK) {
    await delay(900);
    // In mock mode, we'll just return the updated data
    // The AuthContext will handle updating the stored user
    const profileImage = profileImageFile
      ? URL.createObjectURL(profileImageFile)
      : undefined;
    return { name, username, bio, ...(profileImage && { profileImage }) };
  }

  // BACKEND: Replace with real API call using FormData
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (username) formData.append('username', username);
  if (bio !== undefined) formData.append('bio', bio);
  if (profileImageFile) formData.append('profileImage', profileImageFile);

  const response = await api.put('/api/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.user;
}

/**
 * deleteAccount — Permanently delete the current user's account
 *
 * BACKEND: DELETE /api/users/me
 *
 * Expected response:
 *   { success: true, message: "Account deleted" }
 *
 * BACKEND NOTE:
 * This should:
 * 1. Delete all posts by the user (and their images from storage)
 * 2. Delete the user record from the database
 * 3. Clear the session / invalidate the token
 *
 * Auth required: Yes
 */
export async function deleteAccount() {
  if (USE_MOCK) {
    await delay(1000);
    return { success: true };
  }

  // BACKEND: Replace with real API call
  const response = await api.delete('/api/users/me');
  return response.data;
}
