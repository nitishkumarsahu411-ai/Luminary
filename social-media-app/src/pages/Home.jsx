/**
 * Home.jsx — Main social feed page with Instagram-inspired layout
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, updatePost, deletePost } from '../services/postService';
import { followUser, unfollowUser } from '../services/followService';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../utils/mockData';
import { getInitials } from '../utils/helpers';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';
import DeletePostModal from '../components/DeletePostModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Suggested users
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Modal state
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast / notification
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    // Load suggested users excluding current user
    if (user) {
      const others = MOCK_USERS.filter((u) => u.id !== user.id).slice(0, 3);
      setSuggestedUsers(others);
    }
  }, [fetchPosts, user]);

  // Edit Post
  const handleEditSave = async ({ imageFile, caption }) => {
    setSaving(true);
    try {
      const updated = await updatePost({
        postId: editingPost.id,
        imageFile,
        caption,
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingPost(null);
      showToast('Post updated successfully! ✓');
    } catch (err) {
      alert(err.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Post
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deletePost(deletingPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      setDeletingPost(null);
      showToast('Post deleted. 🗑️');
    } catch (err) {
      alert(err.message || 'Failed to delete post.');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle follow on suggested user
  const handleToggleFollow = async (targetUser) => {
    const nextFollowing = !targetUser.isFollowing;
    // Optimistic update
    setSuggestedUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, isFollowing: nextFollowing } : u
      )
    );

    try {
      if (nextFollowing) {
        await followUser(targetUser.id, user.id);
        showToast(`Following @${targetUser.username} ✨`);
      } else {
        await unfollowUser(targetUser.id, user.id);
        showToast(`Unfollowed @${targetUser.username}`);
      }
    } catch (err) {
      // Revert on error
      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, isFollowing: !nextFollowing } : u
        )
      );
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Main Feed Column */}
        <main className="home-feed-col" aria-label="Main Feed">
          {/* Stories Reel at top of feed */}
          <StoriesBar />

          {/* Feed Status / Errors */}
          {loading && <Loading message="Loading your feed…" />}
          {error && <ErrorMessage message={error} onRetry={fetchPosts} />}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="feed-empty">
              <div className="feed-empty-icon">📷</div>
              <h2 className="feed-empty-title">No posts yet</h2>
              <p className="feed-empty-sub">
                Follow accounts or share your first moment!
              </p>
              <Link to="/create" className="btn btn-primary">
                Create Your First Post
              </Link>
            </div>
          )}

          {/* Posts List */}
          {!loading && !error && posts.length > 0 && (
            <div className="feed-list">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEditClick={setEditingPost}
                  onDeleteClick={setDeletingPost}
                  onToast={showToast}
                />
              ))}
            </div>
          )}
        </main>

        {/* Desktop Sidebar / Right Suggestions Panel */}
        <aside className="home-sidebar-right" aria-label="Suggestions for you">
          {/* Current user summary */}
          {user && (
            <div className="sidebar-me-card">
              <Link to={`/profile/${user.id}`} className="sidebar-me-avatar-wrap">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.username} className="sidebar-me-avatar" />
                ) : (
                  <div className="sidebar-me-initials">{getInitials(user.name)}</div>
                )}
              </Link>
              <div className="sidebar-me-info">
                <Link to={`/profile/${user.id}`} className="sidebar-me-username">
                  {user.username}
                </Link>
                <span className="sidebar-me-name">{user.name}</span>
              </div>
              <Link to="/settings" className="sidebar-switch-btn">
                Settings
              </Link>
            </div>
          )}

          {/* Suggestions header */}
          <div className="sidebar-suggestions-header">
            <span>Suggested for you</span>
            <span className="suggestions-see-all">See All</span>
          </div>

          {/* Suggested creators */}
          <div className="sidebar-suggestions-list">
            {suggestedUsers.map((su) => (
              <div key={su.id} className="sidebar-suggested-item">
                <Link to={`/profile/${su.id}`} className="suggested-avatar-wrap">
                  {su.profileImage ? (
                    <img src={su.profileImage} alt={su.username} className="suggested-avatar" />
                  ) : (
                    <div className="suggested-avatar-fallback">{getInitials(su.name)}</div>
                  )}
                </Link>

                <div className="suggested-info">
                  <Link to={`/profile/${su.id}`} className="suggested-username">
                    {su.username}
                  </Link>
                  <span className="suggested-sub">
                    {su.followersCount} followers
                  </span>
                </div>

                <button
                  className={`suggested-follow-btn ${su.isFollowing ? 'following' : ''}`}
                  onClick={() => handleToggleFollow(su)}
                >
                  {su.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>

          <footer className="sidebar-footer">
            <p>© 2026 Luminary · Built for connection</p>
          </footer>
        </aside>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={handleEditSave}
          onClose={() => setEditingPost(null)}
          saving={saving}
        />
      )}

      {/* Delete Post Modal */}
      {deletingPost && (
        <DeletePostModal
          post={deletingPost}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingPost(null)}
          deleting={deleting}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Home;
