/**
 * DeletePostModal.jsx — Confirmation modal for deleting a post
 */
import React from 'react';
import './Modal.css';

function DeletePostModal({ post, onConfirm, onClose, deleting }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="modal-box modal-box--narrow">
        <div className="modal-header">
          <h2 id="delete-modal-title" className="modal-title">Delete Post</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal" disabled={deleting}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-icon">🗑️</div>
          <p className="delete-message">
            Are you sure you want to delete this post?
          </p>
          <p className="delete-sub-message">
            This action is <strong>permanent</strong> and cannot be undone.
          </p>

          {/* Post preview */}
          {post?.imageUrl && (
            <div className="delete-post-preview">
              <img
                src={post.imageUrl}
                alt="Post to delete"
                className="delete-post-image"
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
            id="confirm-delete-post-btn"
          >
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePostModal;
