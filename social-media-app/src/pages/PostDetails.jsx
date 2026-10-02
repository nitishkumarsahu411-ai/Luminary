/**
 * PostDetails.jsx — Full post view page with Likes, Comments & Share
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, updatePost, deletePost, likePost, unlikePost } from '../services/postService';
import { getComments, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatRelativeTime, getInitials } from '../utils/helpers';
import EditPostModal from '../components/EditPostModal';
import DeletePostModal from '../components/DeletePostModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './PostDetails.css';

function PostDetails() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Likes state
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Modals state
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const commentsEndRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setError('');
      try {
        const [postData, commentsData] = await Promise.all([
          getPostById(postId),
          getComments(postId),
        ]);
        setPost(postData);
        setIsLiked(postData.isLiked || false);
        setLikeCount(postData.likeCount || 0);
        setComments(commentsData || []);
      } catch (err) {
        setError(err.message || 'Post not found.');
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  const isOwner = user && post && post.user.id === user.id;

  const handleToggleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (nextLiked) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (err) {
      setIsLiked(!nextLiked);
      setLikeCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by @${post.user.username}`,
          text: post.caption,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard! 📋');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentSubmitting) return;

    setCommentSubmitting(true);
    try {
      const newC = await addComment(post.id, commentText.trim(), user);
      setComments((prev) => [...prev, newC]);
      setCommentText('');
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert(err.message || 'Failed to add comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId, post.id);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.message || 'Failed to delete comment.');
    }
  };

  const handleEditSave = async ({ imageFile, caption }) => {
    setSaving(true);
    try {
      const updated = await updatePost({ postId: post.id, imageFile, caption });
      setPost(updated);
      setShowEdit(false);
      showToast('Post updated! ✓');
    } catch (err) {
      alert(err.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deletePost(post.id);
      navigate('/home', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete post.');
      setDeleting(false);
    }
  };

  if (loading) return <Loading fullPage message="Loading post…" />;
  if (error) {
    return (
      <div className="post-details-page">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        <button className="btn btn-ghost go-back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }
  if (!post) return null;

  return (
    <div className="post-details-page">
      <div className="post-details-container">
        <button className="details-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <article className="post-details-card">
          {/* Image */}
          <div className="post-details-image-wrap">
            <img
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              className="post-details-image"
            />
          </div>

          {/* Info & Comments Panel */}
          <div className="post-details-info">
            {/* Header / User */}
            <div className="post-details-user">
              <Link to={`/profile/${post.user.id}`} className="post-details-user-link">
                {post.user.profileImage ? (
                  <img
                    src={post.user.profileImage}
                    alt={post.user.username}
                    className="post-details-avatar"
                  />
                ) : (
                  <span className="post-details-avatar-fallback">
                    {getInitials(post.user.name || post.user.username)}
                  </span>
                )}
                <div>
                  <div className="details-username-row">
                    <p className="post-details-username">{post.user.username}</p>
                    {post.user.isVerified && (
                      <span className="verified-badge">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="post-details-name">{post.user.name}</p>
                </div>
              </Link>

              {/* Owner actions */}
              {isOwner && (
                <div className="post-details-owner-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowEdit(true)}
                    id="edit-post-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowDelete(true)}
                    id="delete-post-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>

            {/* Comments & Caption Scroll Area */}
            <div className="post-details-comments-scroll">
              {/* Caption */}
              {post.caption && (
                <div className="details-comment-item">
                  <div className="comment-content">
                    <span className="comment-author-name">@{post.user.username}</span>
                    <span className="comment-text">{post.caption}</span>
                  </div>
                  <div className="comment-meta">
                    <span className="comment-time">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className="details-loading-comments">
                  <span>Loading comments…</span>
                </div>
              ) : comments.length === 0 ? (
                <div className="details-no-comments">
                  <p>No comments yet. Start the conversation!</p>
                </div>
              ) : (
                comments.map((c) => {
                  const isOwn = user && c.user?.id === user.id;
                  return (
                    <div key={c.id} className="details-comment-item">
                      <div className="comment-content">
                        <span className="comment-author-name">@{c.user?.username}</span>
                        <span className="comment-text">{c.text}</span>
                      </div>
                      <div className="comment-meta">
                        <span className="comment-time">{formatRelativeTime(c.createdAt)}</span>
                        {isOwn && (
                          <button
                            className="comment-delete-btn"
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Actions Bar (Like, Comment, Share) */}
            <div className="post-details-actions-bar">
              <div className="details-action-buttons">
                <button
                  className={`action-btn ${isLiked ? 'liked' : ''}`}
                  onClick={handleToggleLike}
                  aria-label="Like post"
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

                <button
                  className="action-btn"
                  onClick={handleShare}
                  aria-label="Share post"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <div className="details-likes-count">
                <span>{likeCount === 1 ? '1 like' : `${likeCount.toLocaleString()} likes`}</span>
              </div>

              <div className="details-date-row">
                <span title={formatDate(post.createdAt)}>
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            {/* Add Comment Input */}
            <form className="details-add-comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                className="details-comment-input"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentSubmitting}
                maxLength={300}
              />
              <button
                type="submit"
                className="details-comment-submit"
                disabled={!commentText.trim() || commentSubmitting}
              >
                {commentSubmitting ? 'Posting…' : 'Post'}
              </button>
            </form>
          </div>
        </article>
      </div>

      {showEdit && (
        <EditPostModal
          post={post}
          onSave={handleEditSave}
          onClose={() => setShowEdit(false)}
          saving={saving}
        />
      )}
      {showDelete && (
        <DeletePostModal
          post={post}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDelete(false)}
          deleting={deleting}
        />
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default PostDetails;
