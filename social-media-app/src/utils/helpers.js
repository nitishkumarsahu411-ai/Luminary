/**
 * helpers.js — Shared Utility Functions
 */

/**
 * formatDate — Format an ISO date string into a readable format
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} formatted date like "Sep 28, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * formatRelativeTime — Return a relative time string like "2 hours ago"
 * @param {string} isoString - ISO 8601 date string
 * @returns {string}
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
}

/**
 * validateEmail — Check if a string is a valid email address
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * getInitials — Get initials from a name for avatar fallback
 * @param {string} name
 * @returns {string} e.g. "Alex Rivera" → "AR"
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * truncateText — Truncate text to a given length with an ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text = '', maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * validateImageFile — Validate an uploaded image file
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'Please select an image.' };

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, GIF, and WebP images are allowed.',
    };
  }

  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image must be smaller than ${maxSizeMB}MB.`,
    };
  }

  return { valid: true, error: null };
}
