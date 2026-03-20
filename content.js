// ===== CONFIG =====
const WARNING_MESSAGE = "Vertical short-form content (Reels, Shorts, TikTok, etc.) is detrimental for focus and kids. Consider long-form content instead.";

const REDIRECT_SITES = {
  youtube: "https://www.youtube.com",
  instagram: "https://www.instagram.com",
  tiktok: "https://www.tiktok.com",
  facebook: "https://www.facebook.com",
  snapchat: "https://www.snapchat.com"
};

const SELECTORS = {
  youtube: [
    'ytd-reel-shelf-renderer', 
    'ytd-rich-shelf-renderer[is-shorts]', 
    'ytd-grid-video-renderer:has([overlay-style="SHORTS"])'
  ],
  instagram: ['[data-testid="reel"]', 'div[role="dialog"] a[href*="/reels/"]'],
  facebook: ['[data-testid="reels"]', 'div[aria-label*="Reels"]'],
  tiktok: ['.for-you-page', '[data-elem="recommendation"]', 'div[data-testid="feed-item"]'],
  snapchat: ['[data-testid="spotlight"]', '.spotlight-feed'],
  x: ['article:has(video[style*="aspect-ratio: 9/16"])']
};

function showWarningOverlay() {
  if (!document.body || document.getElementById('vertical-blocker-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'vertical-blocker-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.95); color: white; z-index: 2147483647;
    display: flex; align-items: center; justify-content: center; text-align: center;
    font-family: system-ui; padding: 40px; box-sizing: border-box;
  `;
  overlay.innerHTML = `
    <div style="max-width: 600px;">
      <h1 style="font-size: 2.5rem; margin-bottom: 20px;">⚠️ Focus Protection Active</h1>
      <p style="font-size: 1.3rem; line-height: 1.5;">${WARNING_MESSAGE}</p>
      <button id="proceed-btn" style="margin-top: 30px; padding: 15px 40px; font-size: 1.2rem; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer;">
        I understand — hide this content
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('proceed-btn').onclick = () => overlay.remove();
}

function blockVerticalContent() {
  const hostname = location.hostname;

  // 1. Redirects
  if (hostname.includes('youtube') && location.pathname.startsWith('/shorts/')) {
    location.replace(REDIRECT_SITES.youtube); return;
  }
  if (hostname.includes('instagram') && location.pathname.includes('/reels/')) {
    location.replace(REDIRECT_SITES.instagram); return;
  }
  if (hostname.includes('tiktok') && !location.pathname.includes('/following')) {
    location.replace(REDIRECT_SITES.tiktok + '/following'); return;
  }
  if (hostname.includes('snapchat') && location.pathname.includes('spotlight')) {
    location.replace(REDIRECT_SITES.snapchat); return;
  }

  // 2. Element Hiding
  const platform = Object.keys(SELECTORS).find(p => hostname.includes(p));
  const selectors = platform ? SELECTORS[platform] : [];

  function hideElements() {
    if (selectors.length > 0) {
      document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
    }
    document.querySelectorAll('video').forEach(v => {
      if (v.videoHeight > v.videoWidth * 1.4) v.pause();
    });
  }

  hideElements();

  // Ensure body exists before observing
  if (document.body) {
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Fixed Line 96 Error: Check length of selectors first
  setTimeout(() => {
    if (selectors.length > 0 && document.querySelectorAll(selectors.join(',')).length > 0) {
      showWarningOverlay();
    }
  }, 800);
}

// Handle initialization for "document_start"
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', blockVerticalContent);
} else {
  blockVerticalContent();
}

// SPA Navigation listeners
window.addEventListener('popstate', blockVerticalContent);
window.addEventListener('yt-navigate-finish', blockVerticalContent);