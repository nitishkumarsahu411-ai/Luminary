/**
 * Loading.jsx — Reusable loading spinner component
 */
import React from 'react';
import './Loading.css';

function Loading({ message = 'Loading...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="loading-spinner-wrap">
          <div className="loading-spinner" aria-label="Loading"></div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="loading-spinner small" aria-label="Loading"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
}

export default Loading;
