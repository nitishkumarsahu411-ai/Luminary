/**
 * ============================================================
 * followService.js — Follow / Unfollow API Service
 * ============================================================
 *
 * All follow-related API calls live here.
 * Ready for backend developer to connect to REST APIs.
 *
 * BACKEND ENDPOINTS:
 *   POST   /api/users/:userId/follow
 *   DELETE /api/users/:userId/follow
 *   GET    /api/users/:userId/follow-status
 *   GET    /api/users/:userId/followers
 *   GET    /api/users/:userId/following
 * ============================================================
 */

import api from './api';
import { MOCK_USERS, MOCK_FOLLOW_RELATIONS } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

/**
 * followUser — Follow another user
 *
 * BACKEND: POST /api/users/:userId/follow
 * Auth required: Yes
 * Expected response: { success: true, message: "User followed", isFollowing: true, followersCount: N }
 */
export async function followUser(targetUserId, currentUserId) {
  if (USE_MOCK) {
    await delay();
    const key = `${currentUserId}:${targetUserId}`;
    MOCK_FOLLOW_RELATIONS.add(key);

    const user = MOCK_USERS.find((u) => u.id === targetUserId);
    if (user) {
      user.followersCount = (user.followersCount || 0) + 1;
      user.isFollowing = true;
    }

    const me = MOCK_USERS.find((u) => u.id === currentUserId);
    if (me) {
      me.followingCount = (me.followingCount || 0) + 1;
    }

    return {
      success: true,
      isFollowing: true,
      followersCount: user ? user.followersCount : 0,
    };
  }

  const response = await api.post(`/api/users/${targetUserId}/follow`);
  return response.data;
}

/**
 * unfollowUser — Unfollow a user
 *
 * BACKEND: DELETE /api/users/:userId/follow
 * Auth required: Yes
 * Expected response: { success: true, message: "User unfollowed", isFollowing: false, followersCount: N }
 */
export async function unfollowUser(targetUserId, currentUserId) {
  if (USE_MOCK) {
    await delay();
    const key = `${currentUserId}:${targetUserId}`;
    MOCK_FOLLOW_RELATIONS.delete(key);

    const user = MOCK_USERS.find((u) => u.id === targetUserId);
    if (user && user.followersCount > 0) {
      user.followersCount -= 1;
      user.isFollowing = false;
    }

    const me = MOCK_USERS.find((u) => u.id === currentUserId);
    if (me && me.followingCount > 0) {
      me.followingCount -= 1;
    }

    return {
      success: true,
      isFollowing: false,
      followersCount: user ? user.followersCount : 0,
    };
  }

  const response = await api.delete(`/api/users/${targetUserId}/follow`);
  return response.data;
}

/**
 * getFollowStatus — Check if current user is following target user
 *
 * BACKEND: GET /api/users/:userId/follow-status
 * Auth required: Yes
 * Expected response: { isFollowing: boolean }
 */
export async function getFollowStatus(targetUserId, currentUserId) {
  if (USE_MOCK) {
    await delay(150);
    const key = `${currentUserId}:${targetUserId}`;
    return { isFollowing: MOCK_FOLLOW_RELATIONS.has(key) };
  }

  const response = await api.get(`/api/users/${targetUserId}/follow-status`);
  return response.data;
}

/**
 * getFollowers — Get user followers list
 *
 * BACKEND: GET /api/users/:userId/followers
 */
export async function getFollowers(userId) {
  if (USE_MOCK) {
    await delay(300);
    // Find users who follow this userId
    const followerIds = [];
    for (const rel of MOCK_FOLLOW_RELATIONS) {
      const [follower, following] = rel.split(':');
      if (following === userId) followerIds.push(follower);
    }
    return MOCK_USERS.filter((u) => followerIds.includes(u.id));
  }

  const response = await api.get(`/api/users/${userId}/followers`);
  return response.data.followers;
}

/**
 * getFollowing — Get users this user is following
 *
 * BACKEND: GET /api/users/:userId/following
 */
export async function getFollowing(userId) {
  if (USE_MOCK) {
    await delay(300);
    const followingIds = [];
    for (const rel of MOCK_FOLLOW_RELATIONS) {
      const [follower, following] = rel.split(':');
      if (follower === userId) followingIds.push(following);
    }
    return MOCK_USERS.filter((u) => followingIds.includes(u.id));
  }

  const response = await api.get(`/api/users/${userId}/following`);
  return response.data.following;
}
