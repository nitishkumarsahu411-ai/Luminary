/**
 * StoriesBar.jsx — Horizontal Instagram-inspired stories reel
 */
import React, { useState, useEffect, useRef } from 'react';
import { getStories, createStory } from '../services/storyService';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import StoryViewer from './StoryViewer';
import './StoriesBar.css';

function StoriesBar() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const data = await getStories();
        setStories(data);
      } catch (err) {
        console.error('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  const handleAddStoryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newStory = await createStory({
        mediaFile: file,
        currentUser: user,
      });
      setStories((prev) => [newStory, ...prev]);
    } catch (err) {
      alert(err.message || 'Failed to upload story.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openStoryViewer = (index) => {
    setSelectedStoryIndex(index);
    // Mark as seen
    setStories((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, hasUnseen: false } : s))
    );
  };

  return (
    <div className="stories-bar-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        id="story-upload-input"
      />

      <div className="stories-reel no-scrollbar" role="region" aria-label="Stories">
        {/* Your Story Item */}
        <div
          className="story-item"
          onClick={handleAddStoryClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStoryClick()}
          aria-label="Add your story"
        >
          <div className="story-ring-wrap your-story-wrap">
            <div className="story-avatar-container">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Your story"
                  className="story-avatar-img"
                />
              ) : (
                <div className="story-avatar-fallback">
                  {getInitials(user?.name || user?.username || 'You')}
                </div>
              )}
            </div>
            <div className="story-add-badge" title="Add story">
              {uploading ? '…' : '+'}
            </div>
          </div>
          <span className="story-username">Your Story</span>
        </div>

        {/* Other Users' Stories */}
        {loading ? (
          <div className="stories-skeleton-row">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="story-skeleton-item">
                <div className="story-skeleton-circle" />
                <div className="story-skeleton-text" />
              </div>
            ))}
          </div>
        ) : (
          stories.map((story, index) => (
            <div
              key={story.id}
              className={`story-item ${story.hasUnseen ? 'unseen' : 'seen'}`}
              onClick={() => openStoryViewer(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openStoryViewer(index)}
              aria-label={`View story by ${story.user.username}`}
            >
              <div className="story-ring-wrap">
                <div className="story-avatar-container">
                  {story.user.profileImage ? (
                    <img
                      src={story.user.profileImage}
                      alt={story.user.username}
                      className="story-avatar-img"
                    />
                  ) : (
                    <div className="story-avatar-fallback">
                      {getInitials(story.user.name || story.user.username)}
                    </div>
                  )}
                </div>
              </div>
              <span className="story-username">{story.user.username}</span>
            </div>
          ))
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
}

export default StoriesBar;
