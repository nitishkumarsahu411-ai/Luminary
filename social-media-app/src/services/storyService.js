/**
 * ============================================================
 * storyService.js — Stories API Service
 * ============================================================
 *
 * All story-related API calls live here.
 * Ready for backend developer to connect to REST APIs.
 *
 * BACKEND ENDPOINTS:
 *   GET    /api/stories
 *   POST   /api/stories (multipart/form-data)
 *   DELETE /api/stories/:storyId
 * ============================================================
 */

import api from './api';
import { MOCK_STORIES } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

/**
 * getStories — Fetch active stories for the current user & people they follow
 *
 * BACKEND: GET /api/stories
 * Auth required: Yes
 * Expected response: { success: true, stories: [ StoryObject, ... ] }
 *
 * StoryObject shape:
 * {
 *   id, user: { id, username, profileImage, name },
 *   mediaUrl, caption, createdAt, expiresAt, hasUnseen
 * }
 */
export async function getStories() {
  if (USE_MOCK) {
    await delay();
    return [...MOCK_STORIES];
  }

  const response = await api.get('/api/stories');
  return response.data.stories;
}

/**
 * createStory — Upload a new story photo
 *
 * BACKEND: POST /api/stories
 * Content-Type: multipart/form-data
 * Fields: media (File), caption (string, optional)
 * Auth required: Yes
 * Expected response: { success: true, story: StoryObject }
 */
export async function createStory({ mediaFile, caption = '', currentUser }) {
  if (USE_MOCK) {
    await delay(800);
    const mediaUrl = mediaFile
      ? URL.createObjectURL(mediaFile)
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

    const newStory = {
      id: 'story_' + Date.now(),
      user: {
        id: currentUser.id,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        name: currentUser.name,
      },
      mediaUrl,
      caption,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      hasUnseen: true,
    };

    // Prepend story
    MOCK_STORIES.unshift(newStory);
    return newStory;
  }

  const formData = new FormData();
  formData.append('media', mediaFile);
  if (caption) formData.append('caption', caption);

  const response = await api.post('/api/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.story;
}

/**
 * deleteStory — Delete an active story
 *
 * BACKEND: DELETE /api/stories/:storyId
 * Auth required: Yes
 */
export async function deleteStory(storyId) {
  if (USE_MOCK) {
    await delay(300);
    const idx = MOCK_STORIES.findIndex((s) => s.id === storyId);
    if (idx !== -1) {
      MOCK_STORIES.splice(idx, 1);
    }
    return { success: true };
  }

  const response = await api.delete(`/api/stories/${storyId}`);
  return response.data;
}
