/**
 * mockData.js — Centralized Development Mock Data
 *
 * This file provides in-memory mock data used when USE_MOCK = true
 * in the service files. The data shapes match what the real backend
 * API is expected to return, making it easy to swap to real data.
 *
 * BACKEND NOTE: The object structures here are the exact shapes
 * your API responses should return. See BACKEND_INTEGRATION.md.
 */

// ---------------------------------------------------------------
// Mock Users
// ---------------------------------------------------------------
export const MOCK_USERS = [
  {
    id: '101',
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@example.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Visual storyteller & outdoor enthusiast 🏔️✨ Living between coffee cups and camera lenses.',
    postsCount: 4,
    followersCount: 1240,
    followingCount: 418,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: '102',
    name: 'Sam Chen',
    username: 'samchen',
    email: 'sam@example.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Product designer & creative technologist. Building minimal interfaces. 💻✨',
    postsCount: 3,
    followersCount: 890,
    followingCount: 320,
    isFollowing: true,
    isVerified: true,
  },
  {
    id: '103',
    name: 'Jordan Lee',
    username: 'jordanlee',
    email: 'jordan@example.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Culinary wanderer 🍜 | Architecture addict 🏛️ | Tokyo & SF',
    postsCount: 3,
    followersCount: 2450,
    followingCount: 610,
    isFollowing: false,
    isVerified: false,
  },
  {
    id: '104',
    name: 'Elena Rostova',
    username: 'elenarostova',
    email: 'elena@example.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Editorial fashion & analog street photography 🎞️ Paris / NYC',
    postsCount: 2,
    followersCount: 4120,
    followingCount: 530,
    isFollowing: true,
    isVerified: true,
  },
];

// ---------------------------------------------------------------
// Mock Posts
// ---------------------------------------------------------------
export const MOCK_POSTS = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    caption: 'Golden hour hits different from the mountain ridge. Silence, cold air, and endless horizons. 🏔️✨',
    createdAt: '2026-10-02T08:30:00Z',
    likeCount: 142,
    isLiked: false,
    commentsCount: 3,
    user: {
      id: '101',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      name: 'Alex Rivera',
      isVerified: true,
    },
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    caption: 'Midnight focus mode. Finding rhythm in code and ambient soundscapes. 💻🌙',
    createdAt: '2026-10-01T23:15:00Z',
    likeCount: 89,
    isLiked: true,
    commentsCount: 2,
    user: {
      id: '102',
      username: 'samchen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      name: 'Sam Chen',
      isVerified: true,
    },
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    caption: 'Tucked away in a Shinjuku alleyway. The broth took 18 hours, and you can taste every minute. 🍜🔥',
    createdAt: '2026-09-30T12:00:00Z',
    likeCount: 230,
    isLiked: false,
    commentsCount: 4,
    user: {
      id: '103',
      username: 'jordanlee',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      name: 'Jordan Lee',
      isVerified: false,
    },
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80',
    caption: 'First light through autumn mist. Sometimes waking up before dawn is the best decision you can make. 🍁',
    createdAt: '2026-09-29T06:45:00Z',
    likeCount: 312,
    isLiked: true,
    commentsCount: 5,
    user: {
      id: '104',
      username: 'elenarostova',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      name: 'Elena Rostova',
      isVerified: true,
    },
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    caption: 'Lake reflections that look like painted glass. Pure peace. 🌲🛶',
    createdAt: '2026-09-28T14:20:00Z',
    likeCount: 76,
    isLiked: false,
    commentsCount: 1,
    user: {
      id: '101',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      name: 'Alex Rivera',
      isVerified: true,
    },
  },
];

// ---------------------------------------------------------------
// Mock Comments
// ---------------------------------------------------------------
export const MOCK_COMMENTS = [
  {
    id: 'c1',
    postId: '1',
    user: {
      id: '102',
      username: 'samchen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    text: 'Incredible lighting! What lens was this shot with?',
    createdAt: '2026-10-02T09:10:00Z',
  },
  {
    id: 'c2',
    postId: '1',
    user: {
      id: '103',
      username: 'jordanlee',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    text: 'Breathtaking view. Adding this mountain to my trail list! 🏔️',
    createdAt: '2026-10-02T09:35:00Z',
  },
  {
    id: 'c3',
    postId: '1',
    user: {
      id: '104',
      username: 'elenarostova',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    text: 'The colors in the sky are unbelievable ✨',
    createdAt: '2026-10-02T10:02:00Z',
  },
  {
    id: 'c4',
    postId: '2',
    user: {
      id: '101',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    text: 'Nothing beats late night developer flow state. Keep shipping! 🚀',
    createdAt: '2026-10-01T23:45:00Z',
  },
  {
    id: 'c5',
    postId: '3',
    user: {
      id: '102',
      username: 'samchen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    text: 'Save me a bowl next time! Looks elite. 🍜',
    createdAt: '2026-09-30T13:10:00Z',
  },
];

// ---------------------------------------------------------------
// Mock Stories
// ---------------------------------------------------------------
export const MOCK_STORIES = [
  {
    id: 'story1',
    user: {
      id: '102',
      username: 'samchen',
      name: 'Sam Chen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    caption: 'Studio vibes today 🎧💻',
    createdAt: '2026-10-02T10:00:00Z',
    expiresAt: '2026-10-03T10:00:00Z',
    hasUnseen: true,
  },
  {
    id: 'story2',
    user: {
      id: '103',
      username: 'jordanlee',
      name: 'Jordan Lee',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    caption: 'Tasting menu sneak peek 🍷',
    createdAt: '2026-10-02T08:30:00Z',
    expiresAt: '2026-10-03T08:30:00Z',
    hasUnseen: true,
  },
  {
    id: 'story3',
    user: {
      id: '104',
      username: 'elenarostova',
      name: 'Elena Rostova',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    caption: 'Backstage runway prep in Milan 👠✨',
    createdAt: '2026-10-02T06:15:00Z',
    expiresAt: '2026-10-03T06:15:00Z',
    hasUnseen: true,
  },
  {
    id: 'story4',
    user: {
      id: '101',
      username: 'alexrivera',
      name: 'Alex Rivera',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    caption: 'Summit reached! 🎒🚩',
    createdAt: '2026-10-01T16:00:00Z',
    expiresAt: '2026-10-02T16:00:00Z',
    hasUnseen: false,
  },
];

// ---------------------------------------------------------------
// Mock Follow Relationships
// Stores set of "followerId:followingId"
// ---------------------------------------------------------------
export const MOCK_FOLLOW_RELATIONS = new Set([
  '101:102', // Alex follows Sam
  '101:104', // Alex follows Elena
  '102:101', // Sam follows Alex
  '103:101', // Jordan follows Alex
  '104:101', // Elena follows Alex
]);
