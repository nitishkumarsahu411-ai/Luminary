# BACKEND_INTEGRATION.md
# Luminary — Backend Integration & API Specification Guide

This document is written for the **backend developer** who will build the server and connect it to this frontend. It details the complete API contract, expected JSON shapes, authentication requirements, status codes, error handling, and how to connect the frontend services to your real backend.

---

## Table of Contents

1. [Project Structure & Service Layer](#1-project-structure--service-layer)
2. [How to Connect Backend (Toggling Mock Mode)](#2-how-to-connect-backend-toggling-mock-mode)
3. [Base URL & Axios Configuration](#3-base-url--axios-configuration)
4. [Authentication Strategy](#4-authentication-strategy)
5. [Complete API Endpoints Contract](#5-complete-api-endpoints-contract)
   - [Auth Endpoints](#auth-endpoints)
   - [Posts Endpoints (CRUD)](#posts-endpoints-crud)
   - [Likes Endpoints](#likes-endpoints)
   - [Comments Endpoints](#comments-endpoints)
   - [Stories Endpoints](#stories-endpoints)
   - [Follow & Relationship Endpoints](#follow--relationship-endpoints)
   - [User & Profile Endpoints](#user--profile-endpoints)
6. [Data Models & Object Shapes](#6-data-models--object-shapes)
7. [Multipart/Form-Data Specifications](#7-multipartform-data-specifications)
8. [Standard Error Format & HTTP Status Codes](#8-standard-error-format--http-status-codes)
9. [Summary Checklist for Backend Developer](#9-summary-checklist-for-backend-developer)

---

## 1. Project Structure & Service Layer

All API communication is strictly decoupled from UI components and centralized inside `src/services/`:

```
social-media-app/
├── src/
│   ├── services/
│   │   ├── api.js            ← Central Axios instance with interceptors & BASE_URL
│   │   ├── authService.js    ← Login, Register, Logout, GetCurrentSession
│   │   ├── postService.js    ← GetPosts, GetPostById, CreatePost, UpdatePost, DeletePost, Like, Unlike
│   │   ├── commentService.js ← GetComments, AddComment, DeleteComment
│   │   ├── storyService.js   ← GetStories, CreateStory, DeleteStory
│   │   ├── followService.js  ← FollowUser, UnfollowUser, GetFollowStatus, GetFollowers, GetFollowing
│   │   └── userService.js    ← GetUserById, GetUserPosts, UpdateProfile, DeleteAccount
│   ├── context/
│   │   ├── AuthContext.jsx   ← Global logged-in user state
│   │   └── ThemeContext.jsx  ← Centralized theme state (Light / Dark)
│   ├── utils/
│   │   └── mockData.js       ← Centralized mock dataset (posts, users, comments, stories, follows)
│   └── components/ & pages/  ← UI components consume services only
```

---

## 2. How to Connect Backend (Toggling Mock Mode)

Each service file contains a boolean flag at the top:
```javascript
const USE_MOCK = true;
```

When your backend endpoints are ready:
1. In `src/services/api.js`, update `BASE_URL` to your server address (e.g. `http://localhost:5000` or production domain).
2. Set `const USE_MOCK = false;` in the corresponding service file.
3. Once all services are connected, you can safely remove `src/utils/mockData.js`.

---

## 3. Base URL & Axios Configuration

Configured in `src/services/api.js`:
- **Default Base URL:** `http://localhost:5000`
- **Credentials:** `withCredentials: true` (for HttpOnly session cookies or refresh tokens)
- **Automatic 401 Interceptor:** On 401 Unauthorized, automatically redirects to `/login` and resets user state.

---

## 4. Authentication Strategy

The frontend supports either:
- **Cookie-Based Sessions (Recommended):** Backend sets an `httpOnly`, `secure`, `sameSite: 'lax'` session cookie on login/register.
- **Bearer Tokens:** Backend returns an `accessToken` in the login response body. Frontend will attach `Authorization: Bearer <token>` in `src/services/api.js`.

---

## 5. Complete API Endpoints Contract

### Auth Endpoints

#### `POST /api/auth/register`
- **Auth required:** No
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "user": {
      "id": "u_101",
      "name": "Jane Doe",
      "username": "janedoe",
      "email": "jane@example.com",
      "profileImage": null,
      "bio": "",
      "postsCount": 0,
      "followersCount": 0,
      "followingCount": 0
    }
  }
  ```
- **Errors:**
  - `400 Bad Request` — Missing or invalid fields.
  - `409 Conflict` — Email or username already taken.

#### `POST /api/auth/login`
- **Auth required:** No
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "user": {
      "id": "u_101",
      "name": "Jane Doe",
      "username": "janedoe",
      "email": "jane@example.com",
      "profileImage": "https://...",
      "bio": "Photographer",
      "postsCount": 3,
      "followersCount": 120,
      "followingCount": 85
    }
  }
  ```
- **Errors:** `401 Unauthorized` — Invalid credentials.

#### `POST /api/auth/logout`
- **Auth required:** Yes
- **Response `200 OK`:** `{ "success": true, "message": "Logged out" }`

#### `GET /api/auth/me`
- **Auth required:** Yes
- **Response `200 OK`:** `{ "success": true, "user": UserObject }`
- **Errors:** `401 Unauthorized`

---

### Posts Endpoints (CRUD)

#### `GET /api/posts`
- **Auth required:** Yes
- **Query parameters:** `?page=1&limit=20`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "posts": [
      {
        "id": "p_1",
        "imageUrl": "https://storage.provider.com/post_1.jpg",
        "caption": "Golden hour from the mountains 🏔️",
        "createdAt": "2026-10-02T08:30:00Z",
        "likeCount": 142,
        "isLiked": false,
        "commentsCount": 8,
        "user": {
          "id": "u_101",
          "username": "alexrivera",
          "name": "Alex Rivera",
          "profileImage": "https://storage.provider.com/avatar_1.jpg",
          "isVerified": true
        }
      }
    ]
  }
  ```

#### `GET /api/posts/:postId`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "post": PostObject
  }
  ```
- **Errors:** `404 Not Found`

#### `POST /api/posts`
- **Auth required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `image`: File (JPEG, PNG, GIF, WebP)
  - `caption`: string (max 500 chars)
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Post created",
    "post": PostObject
  }
  ```

#### `PUT /api/posts/:postId` (or `PATCH /api/posts/:postId`)
- **Auth required:** Yes (must be post owner)
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `image`: File (optional, only if changing photo)
  - `caption`: string
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Post updated",
    "post": PostObject
  }
  ```
- **Errors:** `403 Forbidden` (not owner), `404 Not Found`

#### `DELETE /api/posts/:postId`
- **Auth required:** Yes (must be post owner)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Post deleted"
  }
  ```
- **Errors:** `403 Forbidden`, `404 Not Found`

---

### Likes Endpoints

#### `POST /api/posts/:postId/like`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "isLiked": true,
    "likeCount": 143
  }
  ```
- **Errors:** `404 Not Found`, `400 Bad Request` (already liked)

#### `DELETE /api/posts/:postId/like`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "isLiked": false,
    "likeCount": 142
  }
  ```
- **Errors:** `404 Not Found`

---

### Comments Endpoints

#### `GET /api/posts/:postId/comments`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "comments": [
      {
        "id": "c_1",
        "postId": "p_1",
        "text": "Amazing shot! What camera did you use?",
        "createdAt": "2026-10-02T09:15:00Z",
        "user": {
          "id": "u_102",
          "username": "samchen",
          "name": "Sam Chen",
          "profileImage": "https://storage.provider.com/avatar_2.jpg"
        }
      }
    ]
  }
  ```

#### `POST /api/posts/:postId/comments`
- **Auth required:** Yes
- **Body:**
  ```json
  {
    "text": "Incredible colors in the sky!"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "comment": CommentObject
  }
  ```
- **Errors:** `400 Bad Request` (empty text), `404 Not Found`

#### `DELETE /api/comments/:commentId`
- **Auth required:** Yes (must be comment author or post owner)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Comment deleted"
  }
  ```
- **Errors:** `403 Forbidden`, `404 Not Found`

---

### Stories Endpoints

#### `GET /api/stories`
- **Auth required:** Yes
- **Returns:** Active stories (created within last 24h) for current user and users they follow.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "stories": [
      {
        "id": "s_1",
        "mediaUrl": "https://storage.provider.com/story_1.jpg",
        "caption": "Studio vibes today 🎧",
        "createdAt": "2026-10-02T10:00:00Z",
        "expiresAt": "2026-10-03T10:00:00Z",
        "hasUnseen": true,
        "user": {
          "id": "u_102",
          "username": "samchen",
          "name": "Sam Chen",
          "profileImage": "https://storage.provider.com/avatar_2.jpg"
        }
      }
    ]
  }
  ```

#### `POST /api/stories`
- **Auth required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `media`: File (JPEG, PNG, WebP)
  - `caption`: string (optional)
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "story": StoryObject
  }
  ```

#### `DELETE /api/stories/:storyId`
- **Auth required:** Yes (must be story author)
- **Response `200 OK`:** `{ "success": true, "message": "Story deleted" }`

---

### Follow & Relationship Endpoints

#### `POST /api/users/:userId/follow`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "isFollowing": true,
    "followersCount": 121
  }
  ```
- **Errors:** `400 Bad Request` (cannot follow self), `404 Not Found`

#### `DELETE /api/users/:userId/follow`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "isFollowing": false,
    "followersCount": 120
  }
  ```

#### `GET /api/users/:userId/follow-status`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "isFollowing": true
  }
  ```

#### `GET /api/users/:userId/followers`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "followers": [ UserSummaryObject, ... ]
  }
  ```

#### `GET /api/users/:userId/following`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "following": [ UserSummaryObject, ... ]
  }
  ```

---

### User & Profile Endpoints

#### `GET /api/users/:userId`
- **Auth required:** Yes
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "user": {
      "id": "u_101",
      "name": "Alex Rivera",
      "username": "alexrivera",
      "email": "alex@example.com",
      "profileImage": "https://storage.provider.com/avatar_1.jpg",
      "bio": "Visual storyteller 🏔️ Living between coffee and camera lenses.",
      "postsCount": 14,
      "followersCount": 1240,
      "followingCount": 418,
      "isFollowing": false,
      "isVerified": true
    }
  }
  ```

#### `GET /api/users/:userId/posts`
- **Auth required:** Yes
- **Response `200 OK`:** `{ "success": true, "posts": [ PostObject, ... ] }`

#### `PUT /api/users/profile`
- **Auth required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `profileImage`: File (optional)
  - `name`: string
  - `username`: string
  - `bio`: string
- **Response `200 OK`:** `{ "success": true, "user": UserObject }`

#### `DELETE /api/users/account`
- **Auth required:** Yes
- **Response `200 OK`:** `{ "success": true, "message": "Account deleted permanently" }`

---

## 6. Data Models & Object Shapes

### `UserObject`
```typescript
interface UserObject {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}
```

### `PostObject`
```typescript
interface PostObject {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string; // ISO 8601 (e.g. 2026-10-02T08:30:00Z)
  likeCount: number;
  isLiked: boolean;
  commentsCount: number;
  user: {
    id: string;
    username: string;
    name: string;
    profileImage: string | null;
    isVerified?: boolean;
  };
}
```

### `CommentObject`
```typescript
interface CommentObject {
  id: string;
  postId: string;
  text: string;
  createdAt: string; // ISO 8601
  user: {
    id: string;
    username: string;
    name: string;
    profileImage: string | null;
  };
}
```

### `StoryObject`
```typescript
interface StoryObject {
  id: string;
  mediaUrl: string;
  caption?: string;
  createdAt: string; // ISO 8601
  expiresAt: string; // ISO 8601 (24 hours after creation)
  hasUnseen?: boolean;
  user: {
    id: string;
    username: string;
    name: string;
    profileImage: string | null;
  };
}
```

---

## 7. Multipart/Form-Data Specifications

The frontend sends `FormData` for any file uploads:
1. **Create/Update Post:** field `'image'` contains the File object.
2. **Create Story:** field `'media'` contains the File object.
3. **Update Profile Photo:** field `'profileImage'` contains the File object.

**Backend Implementation Tip:**
- Use `multer` (Node.js/Express) or equivalent:
  ```javascript
  const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
  app.post('/api/posts', upload.single('image'), postController.create);
  ```
- Store the file in AWS S3, Cloudinary, or Google Cloud Storage, and save the public HTTPS URL in the database.

---

## 8. Standard Error Format & HTTP Status Codes

When an error occurs, return a JSON response with:
```json
{
  "success": false,
  "message": "Human-readable error description here."
}
```

Expected status codes:
- `200 OK` — Successful read / update / delete.
- `201 Created` — Successful resource creation (post, story, comment, user).
- `400 Bad Request` — Validation failure, missing required field, bad format.
- `401 Unauthorized` — Missing or invalid authentication credentials.
- `403 Forbidden` — Authenticated user does not have permission (e.g. deleting another user's post).
- `404 Not Found` — Resource does not exist.
- `409 Conflict` — Username or email already registered.
- `500 Internal Server Error` — Unexpected server failure.

---

## 9. Summary Checklist for Backend Developer

- [ ] Set up database with models: `User`, `Post`, `Like`, `Comment`, `Story`, `Follow`.
- [ ] Configure JWT or session cookie authentication.
- [ ] Configure cloud image storage (Cloudinary, S3, Firebase Storage, etc.).
- [ ] Implement Auth endpoints (`/api/auth/*`).
- [ ] Implement Posts CRUD + Likes endpoints (`/api/posts/*`).
- [ ] Implement Comments endpoints (`/api/posts/:postId/comments`, `/api/comments/:id`).
- [ ] Implement Stories endpoints with 24-hour expiration (`/api/stories/*`).
- [ ] Implement Follow system endpoints (`/api/users/:userId/follow*`).
- [ ] Set CORS to allow `http://localhost:5173` with `credentials: true`.
- [ ] Test with frontend by switching `USE_MOCK = false` in `src/services/`.
