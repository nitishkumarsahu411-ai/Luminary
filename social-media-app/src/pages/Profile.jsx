/**
 * Profile.jsx — Instagram-inspired User Profile page with Follow system and 3-column grid
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserById, getUserPosts } from '../services/userService';
import { deletePost } from '../services/postService';
import { followUser, unfollowUser } from '../services/followService';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import DeletePostModal from '../components/DeletePostModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  // Delete modal state
  const [deletingPost, setDeletingPost] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const [userData, userPosts] = await Promise.all([
          getUserById(userId, currentUser?.id),
          getUserPosts(userId),
        ]);
        setProfile(userData);
        setPosts(userPosts);
        setIsFollowing(userData.isFollowing || false);
        setFollowersCount(userData.followersCount || 0);
        setFollowingCount(userData.followingCount || 0);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, currentUser?.id]);

  const handleToggleFollow = async () => {
    if (followLoading || isOwnProfile) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    setFollowersCount((prev) => (nextFollowing ? prev + 1 : Math.max(0, prev - 1)));

    setFollowLoading(true);
    try {
      if (nextFollowing) {
        await followUser(userId, currentUser?.id);
      } else {
        await unfollowUser(userId, currentUser?.id);
      }
    } catch (err) {
      // Revert on error
      setIsFollowing(!nextFollowing);
      setFollowersCount((prev) => (!nextFollowing ? prev + 1 : Math.max(0, prev - 1)));
      alert(err.message || 'Failed to update follow status.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deletePost(deletingPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      setDeletingPost(null);
    } catch (err) {
      alert(err.message || 'Failed to delete post.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading fullPage message="Loading profile…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <section className="profile-header">
          {/* Avatar Column */}
          <div className="profile-avatar-wrap">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.username}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-fallback">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Profile Details Column */}
          <div className="profile-info">
            <div className="profile-info-top">
              <div className="profile-username-group">
                <h1 className="profile-username">{profile.username}</h1>
                {profile.isVerified && (
                  <span className="verified-badge" title="Verified Creator">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <Link to="/settings" className="btn btn-ghost btn-sm" id="edit-profile-btn">
                      Edit Profile
                    </Link>
                    <Link to="/settings" className="btn btn-outline btn-sm" aria-label="Settings">
                      ⚙️
                    </Link>
                  </>
                ) : (
                  <button
                    className={`btn btn-sm ${isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={handleToggleFollow}
                    disabled={followLoading}
                    id="profile-follow-btn"
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followersCount.toLocaleString()}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followingCount.toLocaleString()}</span>
                <span className="stat-label">following</span>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="profile-bio-section">
              <p className="profile-name">{profile.name}</p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            </div>
          </div>
        </section>

        {/* Tab separator */}
        <div className="profile-tabs">
          <div className="profile-tab active">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            <span>POSTS</span>
          </div>
        </div>

        {/* Posts 3-column Grid */}
        <section className="profile-posts">
          {posts.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty-icon">📷</div>
              <p className="profile-empty-title">No posts yet</p>
              {isOwnProfile && (
                <Link to="/create" className="btn btn-primary btn-sm">
                  Share Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="profile-grid">
              {posts.map((post) => (
                <div key={post.id} className="profile-grid-item">
                  <Link to={`/post/${post.id}`} className="profile-grid-link">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || 'Post'}
                      className="profile-grid-img"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Likes & Comments Counts */}
                    <div className="profile-grid-overlay">
                      <div className="grid-overlay-stat">
                        <span>❤️</span>
                        <span>{post.likeCount ?? 0}</span>
                      </div>
                      <div className="grid-overlay-stat">
                        <span>💬</span>
                        <span>{post.commentsCount ?? 0}</span>
                      </div>
                    </div>
                  </Link>

                  {isOwnProfile && (
                    <button
                      className="profile-grid-delete-btn"
                      onClick={() => setDeletingPost(post)}
                      aria-label="Delete post"
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {deletingPost && (
        <DeletePostModal
          post={deletingPost}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingPost(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}

export default Profile;
