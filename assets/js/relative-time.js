function getRelativeTimeString(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 0) return null;
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hrs = Math.floor(diffInSeconds / 3600);
    return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 172800) return 'Yesterday';
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  }
  if (diffInSeconds < 1209600) return 'Last week';
  const weeks = Math.floor(diffInSeconds / 604800);
  return `${weeks} weeks ago`;
}

function updateRelativeTimes() {
  // 1. Handle elements with explicit data-datetime attributes
  const manualElements = document.querySelectorAll('[data-datetime]');
  manualElements.forEach(el => {
    const timestamp = el.getAttribute('data-datetime');
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      const text = getRelativeTimeString(date);
      if (text) el.textContent = text;
    }
  });

  // 2. Automatically find and update time strings for articles in NEWS_METADATA
  // This looks for links to our articles and finds the time element inside them
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && NEWS_METADATA[href]) {
      const date = new Date(NEWS_METADATA[href]);
      if (!isNaN(date.getTime())) {
        const text = getRelativeTimeString(date);
        if (text) {
          // Look for common time containers inside the link
          const timeClasses = ['.card-time', '.list-meta', '.related-time', '.headliner-meta span:nth-child(3)'];
          timeClasses.forEach(selector => {
            const timeEl = link.querySelector(selector);
            if (timeEl) timeEl.textContent = text;
          });
        }
      }
    }
  });

  // 3. Update the specific article's own byline if we are ON an article page
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (NEWS_METADATA[currentFile]) {
    const bylineDate = document.querySelector('.article-byline');
    if (bylineDate) {
      const date = new Date(NEWS_METADATA[currentFile]);
      const text = getRelativeTimeString(date);
      if (text) {
        // Find the date part of the byline (usually after the dot or at the end)
        const parts = bylineDate.innerHTML.split(' · ');
        if (parts.length > 1) {
          parts[parts.length - 1] = text;
          bylineDate.innerHTML = parts.join(' · ');
        }
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', updateRelativeTimes);
setInterval(updateRelativeTimes, 60000);
