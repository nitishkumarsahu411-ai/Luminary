/**
 * ============================================================
 * postService.js — Posts API Service
 * ============================================================
 *
 * All post-related API calls live here.
 * Backend developer: replace the mock implementations with real
 * calls to the API endpoints documented in each function.
 *
 * MOCK MODE: Uses in-memory mockPosts array for development.
 * ============================================================
 */

import api from './api';
import { MOCK_POSTS } from '../utils/mockData';

// ---------------------------------------------------------------
// Toggle to false once the backend is ready
// ---------------------------------------------------------------
const USE_MOCK = true;

const delay = (ms = 700) => new Promise((res) => setTimeout(res, ms));

/**
 * getPosts — Fetch all posts for the feed
 *
 * BACKEND: GET /api/posts
 * Headers: Auth required
 * Query params (optional): ?page=1&limit=20
 *
 * Expected response:
 *   { success: true, posts: [ PostObject, ... ] }
 *
 * PostObject shape:
 *   {
 *     id, imageUrl, caption, createdAt,
 *     user: { id, username, profileImage }
 *   }
 *
 * Auth required: Yes
 */
export async function getPosts() {
  if (USE_MOCK) {
    await delay();
    // Return a sorted copy (newest first)
    return [...MOCK_POSTS].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // BACKEND: Replace with real API call
  const response = await api.get('/api/posts');
  return response.data.posts;
}

/**
 * getPostById — Fetch a single post by ID
 *
 * BACKEND: GET /api/posts/:postId
 * Auth required: Yes
 *
 * Expected response:
 *   { success: true, post: PostObject }
 *
 * Error: 404 if post not found
 */
export async function getPostById(postId) {
  if (USE_MOCK) {
    await delay();
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found.');
    return post;
  }

  // BACKEND: Replace with real API call
  const response = await api.get(`/api/posts/${postId}`);
  return response.data.post;
}

/**
 * createPost — Upload a new post with an image and caption
 *
 * BACKEND: POST /api/posts
 * Content-Type: multipart/form-data
 *
 * FormData fields:
 *   - image  : File   (the uploaded image file)
 *   - caption: string (the post caption / thought)
 *
 * Expected response:
 *   { success: true, message: "Post created", post: PostObject }
 *
 * Auth required: Yes
 *
 * BACKEND NOTE:
 * Use multer (Node.js) or similar to parse the multipart form.
 * Store the image in cloud storage (e.g., Cloudinary, S3) and
 * return the public URL as `imageUrl` in the response.
 */
export async function createPost({ imageFile, caption, currentUser }) {
  if (USE_MOCK) {
    await delay(1200);
    // In mock mode, use a local object URL for the preview
    const imageUrl = imageFile
      ? URL.createObjectURL(imageFile)
      : 'https://picsum.photos/seed/newpost/800/600';

    const newPost = {
      id: String(Date.now()),
      imageUrl,
      caption,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      commentsCount: 0,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        name: currentUser.name,
        isVerified: currentUser.isVerified || false,
      },
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  }

  // BACKEND: Replace with real API call using FormData
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('caption', caption);

  const response = await api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.post;
}

/**
 * updatePost — Update an existing post (image and/or caption)
 *
 * BACKEND: PUT /api/posts/:postId
 * Content-Type: multipart/form-data
 *
 * FormData fields:
 *   - image  : File   (optional — only if user is replacing the image)
 *   - caption: string (the updated caption)
 *
 * BACKEND NOTE:
 * If no new image is provided, keep the existing image.
 * Only the post owner should be allowed to update (check req.user.id === post.userId).
 *
 * Expected response:
 *   { success: true, message: "Post updated", post: PostObject }
 *
 * Auth required: Yes (must be post owner)
 */
export async function updatePost({ postId, imageFile, caption }) {
  if (USE_MOCK) {
    await delay(1000);
    const index = MOCK_POSTS.findIndex((p) => p.id === postId);
    if (index === -1) throw new Error('Post not found.');

    if (imageFile) {
      MOCK_POSTS[index].imageUrl = URL.createObjectURL(imageFile);
    }
    MOCK_POSTS[index].caption = caption;
    return MOCK_POSTS[index];
  }

  // BACKEND: Replace with real API call using FormData
  const formData = new FormData();
  if (imageFile) formData.append('image', imageFile);
  formData.append('caption', caption);

  const response = await api.put(`/api/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.post;
}

/**
 * deletePost — Delete a post by ID
 *
 * BACKEND: DELETE /api/posts/:postId
 *
 * Expected response:
 *   { success: true, message: "Post deleted" }
 *
 * Error: 403 if user is not the post owner
 * Auth required: Yes (must be post owner)
 */
export async function deletePost(postId) {
  if (USE_MOCK) {
    await delay(800);
    const index = MOCK_POSTS.findIndex((p) => p.id === postId);
    if (index === -1) throw new Error('Post not found.');
    MOCK_POSTS.splice(index, 1);
    return { success: true };
  }

  // BACKEND: Replace with real API call
  const response = await api.delete(`/api/posts/${postId}`);
  return response.data;
}

/**
 * likePost — Like a post
 *
 * BACKEND: POST /api/posts/:postId/like
 * Auth required: Yes
 * Expected response: { success: true, isLiked: true, likeCount: number }
 */
export async function likePost(postId) {
  if (USE_MOCK) {
    await delay(200);
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (post) {
      post.isLiked = true;
      post.likeCount = (post.likeCount || 0) + 1;
      return { success: true, isLiked: true, likeCount: post.likeCount };
    }
    return { success: true, isLiked: true, likeCount: 1 };
  }

  const response = await api.post(`/api/posts/${postId}/like`);
  return response.data;
}

/**
 * unlikePost — Unlike a post
 *
 * BACKEND: DELETE /api/posts/:postId/like
 * Auth required: Yes
 * Expected response: { success: true, isLiked: false, likeCount: number }
 */
export async function unlikePost(postId) {
  if (USE_MOCK) {
    await delay(200);
    const post = MOCK_POSTS.find((p) => p.id === postId);
    if (post) {
      post.isLiked = false;
      post.likeCount = Math.max(0, (post.likeCount || 1) - 1);
      return { success: true, isLiked: false, likeCount: post.likeCount };
    }
    return { success: true, isLiked: false, likeCount: 0 };
  }

  const response = await api.delete(`/api/posts/${postId}/like`);
  return response.data;
}

