/**
 * CommentModal.jsx — Modal / sheet to view and add comments on a post
 */
import React, { useState, useEffect, useRef } from 'react';
import { getComments, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatRelativeTime } from '../utils/helpers';
import './CommentModal.css';

function CommentModal({ post, onClose, onCommentCountChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getComments(post.id);
        setComments(data);
      } catch (err) {
        setError(err.message || 'Failed to load comments.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [post.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const added = await addComment(post.id, newComment.trim(), user);
      setComments((prev) => [...prev, added]);
      setNewComment('');
      if (onCommentCountChange) {
        onCommentCountChange((c) => c + 1);
      }
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert(err.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    setDeletingId(commentId);
    try {
      await deleteComment(commentId, post.id);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (onCommentCountChange) {
        onCommentCountChange((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete comment.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="comment-modal-box">
        {/* Header */}
        <div className="comment-modal-header">
          <h2 id="comment-modal-title" className="comment-modal-title">
            Comments
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close comments"
          >
            ✕
          </button>
        </div>

        {/* Post Summary Header */}
        <div className="comment-post-summary">
          <img
            src={post.user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={post.user.username}
            className="comment-author-avatar"
          />
          <div className="comment-author-text">
            <span className="comment-username">@{post.user.username}</span>
            <p className="comment-caption-text">{post.caption}</p>
          </div>
        </div>

        {/* Comments List */}
        <div className="comment-list-container">
          {loading ? (
            <div className="comment-loading-state">
              <div className="loading-spinner small" />
              <span>Loading comments…</span>
            </div>
          ) : error ? (
            <div className="comment-error-state">
              <p>{error}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="comment-empty-state">
              <span className="empty-bubble-icon">💬</span>
              <h3>No comments yet</h3>
              <p>Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isOwnComment = user && comment.user?.id === user.id;
              return (
                <div key={comment.id} className="comment-item">
                  {comment.user?.profileImage ? (
                    <img
                      src={comment.user.profileImage}
                      alt={comment.user.username}
                      className="comment-user-avatar"
                    />
                  ) : (
                    <div className="comment-avatar-fallback">
                      {getInitials(comment.user?.username || 'U')}
                    </div>
                  )}

                  <div className="comment-body">
                    <div className="comment-content">
                      <span className="comment-author-name">
                        @{comment.user?.username}
                      </span>{' '}
                      <span className="comment-text">{comment.text}</span>
                    </div>

                    <div className="comment-meta">
                      <span className="comment-time">
                        {formatRelativeTime(comment.createdAt)}
                      </span>

                      {isOwnComment && (
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                        >
                          {deletingId === comment.id ? 'Deleting…' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Form */}
        <form className="comment-input-form" onSubmit={handleSubmit}>
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="comment-form-avatar"
            />
          ) : (
            <div className="comment-avatar-fallback small">
              {getInitials(user?.name || user?.username || 'Me')}
            </div>
          )}

          <input
            type="text"
            className="comment-input-field"
            placeholder="Add a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            maxLength={300}
          />

          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;
