/**
 * CreatePost.jsx — Page for uploading a new post
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/postService';
import { validateImageFile } from '../utils/helpers';
import './CreatePost.css';

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState('');
  const [captionError, setCaptionError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
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

  const handleFileInput = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    let valid = true;
    if (!imageFile) {
      setImageError('Please select an image to post.');
      valid = false;
    }
    if (!caption.trim()) {
      setCaptionError('Please add a caption or thought.');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      /**
       * BACKEND NOTE:
       * createPost sends a FormData with:
       *   - image: the File object
       *   - caption: string
       * The backend should save the image to cloud storage
       * and return the full post object with imageUrl.
       */
      await createPost({
        imageFile,
        caption: caption.trim(),
        currentUser: user,
      });
      navigate('/home', { state: { toastMessage: 'Post shared! ✦' } });
    } catch (err) {
      setApiError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-header">
          <button
            className="create-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className="create-post-title">Create Post</h1>
        </div>

        {apiError && (
          <div className="create-error" role="alert">
            {apiError}
          </div>
        )}

        <form className="create-post-form" onSubmit={handleSubmit} noValidate>
          {/* Image Upload Area */}
          <div className="create-image-section">
            {!previewUrl ? (
              <div
                className={`image-dropzone ${dragOver ? 'drag-over' : ''} ${imageError ? 'dropzone-error' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload image"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">📷</div>
                <p className="dropzone-title">Drop your photo here</p>
                <p className="dropzone-sub">or click to browse</p>
                <p className="dropzone-formats">JPEG, PNG, GIF, WebP · Max 10MB</p>
              </div>
            ) : (
              <div className="image-preview-container">
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className="create-image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              id="create-image-input"
            />

            {imageError && <p className="field-error">{imageError}</p>}

            {previewUrl && (
              <button
                type="button"
                className="change-image-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Change Image
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="form-group">
            <label htmlFor="create-caption" className="form-label">
              Caption / Thought
            </label>
            <textarea
              id="create-caption"
              className={`form-textarea ${captionError ? 'input-error' : ''}`}
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (captionError) setCaptionError('');
              }}
              placeholder="Share your thought with the world…"
              rows={4}
              maxLength={500}
              disabled={loading}
            />
            <div className="caption-meta">
              {captionError && <span className="field-error">{captionError}</span>}
              <span className="char-count">{caption.length}/500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="create-post-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="create-post-submit-btn"
              disabled={loading || !imageFile}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Posting…
                </>
              ) : (
                '✦ Share Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
