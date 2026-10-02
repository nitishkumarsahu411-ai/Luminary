/**
 * EditPostModal.jsx — Modal dialog for editing a post
 */
import React, { useState, useRef } from 'react';
import { validateImageFile } from '../utils/helpers';
import './Modal.css';

function EditPostModal({ post, onSave, onClose, saving }) {
  const [caption, setCaption] = useState(post.caption || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(post.imageUrl);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setImageError(error);
      return;
    }
    setImageError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    onSave({ imageFile, caption: caption.trim() });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="modal-box">
        <div className="modal-header">
          <h2 id="edit-modal-title" className="modal-title">Edit Post</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal" disabled={saving}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Image Preview */}
          <div className="edit-image-section">
            <div className="edit-image-preview-wrap">
              <img src={previewUrl} alt="Post preview" className="edit-image-preview" />
              <button
                type="button"
                className="edit-image-change-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Change Image
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="edit-image-input"
            />
            {imageError && <p className="field-error">{imageError}</p>}
            {imageFile && (
              <p className="field-hint">✓ New image selected: {imageFile.name}</p>
            )}
          </div>

          {/* Caption */}
          <div className="form-group">
            <label htmlFor="edit-caption" className="form-label">Caption</label>
            <textarea
              id="edit-caption"
              className="form-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              maxLength={500}
              required
            />
            <span className="char-count">{caption.length}/500</span>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !caption.trim()}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
