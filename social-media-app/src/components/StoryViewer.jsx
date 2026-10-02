/**
 * StoryViewer.jsx — Fullscreen Instagram-style story viewer modal
 */
import React, { useState, useEffect, useRef } from 'react';
import { formatRelativeTime } from '../utils/helpers';
import './StoryViewer.css';

function StoryViewer({ stories, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const storyDuration = 5000; // 5 seconds per story

  const currentStory = stories[currentIndex];

  // Auto-progress timer
  useEffect(() => {
    if (!currentStory || isPaused) return;

    setProgress(0);
    const intervalTime = 50;
    const step = (intervalTime / storyDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length]);

  if (!currentStory) return null;

  return (
    <div
      className="story-viewer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Story Viewer"
    >
      <div
        className="story-viewer-card"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars header */}
        <div className="story-progress-bar-row">
          {stories.map((story, idx) => (
            <div key={story.id} className="story-progress-segment">
              <div
                className="story-progress-fill"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story author header */}
        <div className="story-viewer-header">
          <div className="story-author-info">
            <img
              src={currentStory.user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentStory.user.username}
              className="story-author-avatar"
            />
            <span className="story-author-username">
              {currentStory.user.username}
            </span>
            <span className="story-time">
              {formatRelativeTime(currentStory.createdAt)}
            </span>
          </div>

          <button
            className="story-close-btn"
            onClick={onClose}
            aria-label="Close story viewer"
          >
            ✕
          </button>
        </div>

        {/* Media */}
        <div className="story-media-wrap">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption || 'Story'}
            className="story-image"
          />

          {currentStory.caption && (
            <div className="story-caption-overlay">
              <p>{currentStory.caption}</p>
            </div>
          )}
        </div>

        {/* Navigation tap targets */}
        <button
          className="story-tap-prev"
          onClick={handlePrev}
          aria-label="Previous story"
        >
          {currentIndex > 0 && <span className="nav-arrow">‹</span>}
        </button>
        <button
          className="story-tap-next"
          onClick={handleNext}
          aria-label="Next story"
        >
          <span className="nav-arrow">›</span>
        </button>
      </div>
    </div>
  );
}

export default StoryViewer;
