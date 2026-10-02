/**
 * ErrorMessage.jsx — Reusable error display component
 */
import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-message-wrap" role="alert">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
