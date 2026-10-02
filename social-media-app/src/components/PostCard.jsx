/**
 * PostCard.jsx — Instagram-inspired Feed Post Card
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatRelativeTime } from '../utils/helpers';
import { likePost, unlikePost } from '../services/postService';
import CommentModal from './CommentModal';
import './PostCard.css';

function PostCard({ post, onEditClick, onDeleteClick, onToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Like state with optimistic UI
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comments state
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  // Hidden / reported state
  const [hidden, setHidden] = useState(false);

  const isOwner = user && post.user.id === user.id;

  // Like / Unlike handler
  const handleToggleLike = async (e) => {
    e?.stopPropagation();
    if (likeLoading) return;

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (nextLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }

    setLikeLoading(true);
    try {
      if (nextLiked) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (err) {
      // Revert optimistic update
      setIsLiked(!nextLiked);
      setLikeCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLikeLoading(false);
    }
  };

  // Double click image to like
  const handleImageDoubleClick = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      handleToggleLike();
    } else {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
  };

  // Share handler
  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareData = {
      title: `Post by @${post.user.username}`,
      text: post.caption || 'Check out this post on Luminary',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        if (onToast) onToast('Link copied to clipboard! 📋');
        else alert('Link copied to clipboard!');
      } catch (err) {
        prompt('Copy post link:', shareUrl);
      }
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onToast) onToast('Thank you. Post has been reported.');
    else alert('Thank you. Post has been reported.');
  };

  const handleHide = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    setHidden(true);
    if (onToast) onToast('Post hidden from your feed.');
  };

  if (hidden) {
    return (
      <div className="post-card post-card-hidden">
        <p>This post has been hidden.</p>
        <button className="btn btn-ghost btn-sm" onClick={() => setHidden(false)}>
          Undo
        </button>
      </div>
    );
  }

  return (
    <>
      <article
        className="post-card"
        aria-label={`Post by ${post.user.username}`}
      >
        {/* Header */}
        <div className="post-card-header">
          <Link
            to={`/profile/${post.user.id}`}
            className="post-card-user"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="post-card-avatar-wrap">
              {post.user.profileImage && !imgError ? (
                <img
                  src={post.user.profileImage}
                  alt={post.user.username}
                  className="post-card-avatar"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="post-card-avatar-fallback">
                  {getInitials(post.user.name || post.user.username)}
                </span>
              )}
            </div>

            <div className="post-card-user-info">
              <div className="post-card-username-row">
                <span className="post-card-username">{post.user.username}</span>
                {post.user.isVerified && (
                  <span className="verified-badge" title="Verified Creator">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </span>
                )}
                <span className="post-dot-separator">•</span>
                <span className="post-card-time">{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>
          </Link>

          {/* Three-dot menu button */}
          <div className="post-card-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="post-card-menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Post options"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <circle cx="12" cy="5" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="19" r="1.75" />
              </svg>
            </button>

            {menuOpen && (
              <div className="post-card-dropdown">
                {isOwner ? (
                  <>
                    <button
                      className="post-card-dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        onEditClick(post);
                      }}
                    >
                      <span>✏️</span> Edit Post
                    </button>
                    <button
                      className="post-card-dropdown-item danger"
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteClick(post);
                      }}
                    >
                      <span>🗑️</span> Delete Post
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="post-card-dropdown-item danger"
                      onClick={handleReport}
                    >
                      <span>🚩</span> Report Post
                    </button>
                    <button
                      className="post-card-dropdown-item"
                      onClick={handleHide}
                    >
                      <span>👁️</span> Not Interested
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Image with Double-Click Heart */}
        <div
          className="post-card-image-wrap"
          onDoubleClick={handleImageDoubleClick}
        >
          <img
            src={post.imageUrl}
            alt={post.caption || 'Post image'}
            className="post-card-image"
            loading="lazy"
          />

          {showHeartBurst && (
            <div className="heart-burst-overlay">
              <svg viewBox="0 0 24 24" className="heart-burst-icon" fill="#ffffff">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="post-card-actions">
          <div className="action-buttons-left">
            {/* Like Button */}
            <button
              className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleToggleLike}
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              {isLiked ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--clr-accent)">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              )}
            </button>

            {/* Comment Button */}
            <button
              className="action-btn comment-btn"
              onClick={() => setCommentModalOpen(true)}
              aria-label="View or write comments"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </button>

            {/* Share Button */}
            <button
              className="action-btn share-btn"
              onClick={handleShare}
              aria-label="Share post"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Likes Count Row */}
        <div className="post-card-likes">
          <span className="likes-count-text">
            {likeCount === 1 ? '1 like' : `${likeCount.toLocaleString()} likes`}
          </span>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="post-card-caption">
            <Link
              to={`/profile/${post.user.id}`}
              className="post-card-caption-username"
            >
              {post.user.username}
            </Link>
            <span className="caption-text-content">{post.caption}</span>
          </div>
        )}

        {/* Comments link */}
        {commentsCount > 0 ? (
          <button
            className="post-view-comments-btn"
            onClick={() => setCommentModalOpen(true)}
          >
            View all {commentsCount} comments
          </button>
        ) : (
          <button
            className="post-view-comments-btn add-first-comment"
            onClick={() => setCommentModalOpen(true)}
          >
            Add a comment…
          </button>
        )}
      </article>

      {/* Comment Modal */}
      {commentModalOpen && (
        <CommentModal
          post={post}
          onClose={() => setCommentModalOpen(false)}
          onCommentCountChange={setCommentsCount}
        />
      )}
    </>
  );
}

export default PostCard;
