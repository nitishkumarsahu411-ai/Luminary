/**
 * Settings.jsx — Account settings and danger zone
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, deleteAccount } from '../services/userService';
import { logoutUser } from '../services/authService';
import { validateImageFile } from '../utils/helpers';
import './Settings.css';
import '../components/Modal.css';

function Settings() {
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Profile edit form state
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || null);
  const [imageError, setImageError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fileInputRef = useRef(null);
  const DELETE_PHRASE = 'DELETE MY ACCOUNT';

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { valid, error } = validateImageFile(file);
    if (!valid) { setImageError(error); return; }
    setImageError('');
    setProfileImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setSaveError('Name is required.'); return; }
    if (!form.username.trim()) { setSaveError('Username is required.'); return; }

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const updatedFields = await updateProfile({
        name: form.name.trim(),
        username: form.username.trim(),
        bio: form.bio.trim(),
        profileImageFile,
      });
      updateUser(updatedFields);
      setProfileImageFile(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== DELETE_PHRASE) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      await logoutUser().catch(() => {});
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* ---- Profile Section ---- */}
        <section className="settings-section" aria-labelledby="profile-settings-heading">
          <h2 id="profile-settings-heading" className="settings-section-title">
            Edit Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="settings-form" noValidate>
            {/* Avatar */}
            <div className="settings-avatar-row">
              <div className="settings-avatar-wrap">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="settings-avatar" />
                ) : (
                  <div className="settings-avatar-placeholder">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="settings-avatar-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </button>
                {profileImageFile && (
                  <span className="field-hint">✓ {profileImageFile.name}</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="settings-avatar-input"
              />
              {imageError && <p className="field-error">{imageError}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="settings-name" className="form-label">Full Name</label>
                <input
                  id="settings-name"
                  type="text"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={handleFormChange}
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label htmlFor="settings-username" className="form-label">Username</label>
                <input
                  id="settings-username"
                  type="text"
                  name="username"
                  className="form-input"
                  value={form.username}
                  onChange={handleFormChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings-bio" className="form-label">Bio</label>
              <textarea
                id="settings-bio"
                name="bio"
                className="form-textarea"
                value={form.bio}
                onChange={handleFormChange}
                placeholder="Tell the world about yourself…"
                rows={3}
                maxLength={200}
                disabled={saving}
              />
              <span className="char-count">{form.bio.length}/200</span>
            </div>

            {saveError && (
              <div className="settings-error" role="alert">{saveError}</div>
            )}
            {saveSuccess && (
              <div className="settings-success" role="status">
                ✓ Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              id="save-profile-btn"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* ---- Appearance & Theme ---- */}
        <section className="settings-section" aria-labelledby="theme-heading">
          <h2 id="theme-heading" className="settings-section-title">
            Appearance
          </h2>
          <p className="settings-section-sub">
            Customize how Luminary looks on your device. Choose between Clean Light Mode (#FFFFFF) and Pitch Black Dark Mode (#000000).
          </p>

          <div className="theme-toggle-group">
            <button
              type="button"
              className={`theme-option-btn ${!isDark ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              id="theme-light-btn"
            >
              <span className="theme-option-icon">☀️</span>
              <div className="theme-option-info">
                <strong>Light Mode</strong>
                <span>Pure White (#FFFFFF)</span>
              </div>
              {!isDark && <span className="theme-active-check">✓</span>}
            </button>

            <button
              type="button"
              className={`theme-option-btn ${isDark ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              id="theme-dark-btn"
            >
              <span className="theme-option-icon">🌙</span>
              <div className="theme-option-info">
                <strong>Dark Mode</strong>
                <span>Pitch Black (#000000)</span>
              </div>
              {isDark && <span className="theme-active-check">✓</span>}
            </button>
          </div>
        </section>

        {/* ---- Danger Zone ---- */}
        <section className="settings-section settings-danger-zone" aria-labelledby="danger-zone-heading">
          <h2 id="danger-zone-heading" className="settings-section-title danger-title">
            ⚠️ Danger Zone
          </h2>
          <p className="danger-desc">
            Deleting your account is <strong>permanent and irreversible</strong>.
            All your posts will be deleted. This cannot be undone.
          </p>
          <button
            className="btn btn-danger"
            id="open-delete-account-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete My Account
          </button>
        </section>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="modal-box modal-box--narrow">
            <div className="modal-header">
              <h2 id="delete-account-title" className="modal-title">Delete Account</h2>
              <button
                className="modal-close-btn"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                disabled={deleting}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-icon">⚠️</div>
              <p className="delete-message">
                This will permanently delete your account and ALL your posts.
              </p>
              <p className="delete-sub-message">
                This action <strong>cannot be undone</strong>.
              </p>
              <div className="form-group delete-confirm-group">
                <label htmlFor="delete-confirm-input" className="form-label">
                  Type <strong>{DELETE_PHRASE}</strong> to confirm:
                </label>
                <input
                  id="delete-confirm-input"
                  type="text"
                  className="form-input"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={DELETE_PHRASE}
                  disabled={deleting}
                />
              </div>
              {deleteError && (
                <div className="settings-error" role="alert">{deleteError}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                id="confirm-delete-account-btn"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== DELETE_PHRASE}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
