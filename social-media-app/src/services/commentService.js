/**
 * ============================================================
 * commentService.js — Comments API Service
 * ============================================================
 *
 * All comment-related API calls live here.
 * Ready for backend developer to connect to REST APIs.
 *
 * BACKEND ENDPOINTS:
 *   GET    /api/posts/:postId/comments
 *   POST   /api/posts/:postId/comments
 *   DELETE /api/comments/:commentId
 * ============================================================
 */

import api from './api';
import { MOCK_COMMENTS, MOCK_POSTS } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

/**
 * getComments — Fetch all comments for a specific post
 *
 * BACKEND: GET /api/posts/:postId/comments
 * Auth required: Yes
 * Expected response: { success: true, comments: [ CommentObject, ... ] }
 */
export async function getComments(postId) {
  if (USE_MOCK) {
    await delay();
    return MOCK_COMMENTS.filter((c) => String(c.postId) === String(postId));
  }

  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data.comments;
}

/**
 * addComment — Add a new comment to a post
 *
 * BACKEND: POST /api/posts/:postId/comments
 * Body: { text: string }
 * Auth required: Yes
 * Expected response: { success: true, comment: CommentObject }
 */
export async function addComment(postId, text, currentUser) {
  if (USE_MOCK) {
    await delay(500);
    const newComment = {
      id: 'c_' + Date.now(),
      postId: String(postId),
      user: {
        id: currentUser.id,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        name: currentUser.name,
      },
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    MOCK_COMMENTS.push(newComment);

    // Update post comments count
    const post = MOCK_POSTS.find((p) => String(p.id) === String(postId));
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
    }

    return newComment;
  }

  const response = await api.post(`/api/posts/${postId}/comments`, { text });
  return response.data.comment;
}

/**
 * deleteComment — Remove a comment by its ID
 *
 * BACKEND: DELETE /api/comments/:commentId
 * Auth required: Yes (must be comment author or post owner)
 * Expected response: { success: true, message: "Comment deleted" }
 */
export async function deleteComment(commentId, postId) {
  if (USE_MOCK) {
    await delay(300);
    const idx = MOCK_COMMENTS.findIndex((c) => c.id === commentId);
    if (idx !== -1) {
      MOCK_COMMENTS.splice(idx, 1);
    }
    if (postId) {
      const post = MOCK_POSTS.find((p) => String(p.id) === String(postId));
      if (post && post.commentsCount > 0) {
        post.commentsCount -= 1;
      }
    }
    return { success: true };
  }

  const response = await api.delete(`/api/comments/${commentId}`);
  return response.data;
}
