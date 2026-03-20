/**
 * NEURAL SHIELD v2.2 - HARDENED FOR PRODUCTION
 * Protege el enfoque eliminando contenido vertical adictivo.
 */

// 1. CONFIGURACIÓN Y LOCALIZACIÓN
const LANG = navigator.language.startsWith('es') ? 'es' : 'en';

const TEXT = {
  en: {
    title: "DIGITAL ROT DETECTED",
    message: "You are attempting to access short-form content designed to hijack your dopamine receptors.",
    science: "SCIENTIFIC REALITY: Rapid-fire vertical videos trigger dopamine loops that fragment your prefrontal cortex's ability to focus.",
    btnBack: "Return to sanity (Go Home)",
    btnBypass: "Proceed with brain atrophy",
    puzzlePrompt: "To proceed, prove you still have a functioning brain. Solve: ",
    error: "Wrong. Your focus is already slipping."
  },
  es: {
    title: "PUTREFACCIÓN DIGITAL DETECTADA",
    message: "Estás intentando acceder a contenido diseñado para secuestrar tus receptores de dopamina.",
    science: "REALIDAD CIENTÍFICA: Los videos verticales rápidos activan bucles de dopamina que fragmentan la capacidad de enfoque de tu corteza prefrontal.",
    btnBack: "Volver a la cordura (Ir al inicio)",
    btnBypass: "Continuar con la atrofia cerebral",
    puzzlePrompt: "Para continuar, demuestra que aún tienes cerebro. Resuelve: ",
    error: "Incorrecto. Tu enfoque ya está desapareciendo."
  }
};

const t = TEXT[LANG] || TEXT.en;

// 2. SELECTORES AGRESIVOS
const SELECTORS = {
  youtube: [
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-guide-entry-renderer:has(a[href="/shorts/"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'a[href^="/shorts/"]'
  ],
  instagram: [
    'a[href*="/reels/"]',
    'a[href*="/reel/"]',
    'svg[aria-label="Reels"]',
    'article:has(a[href*="/reels/"])'
  ],
  facebook: [
    'a[href*="/reels/"]',
    'a[href*="/reel/"]',
    '[aria-label*="Reel"]',
    '[aria-label*="reels"]',
    'div[aria-label="Reels"]'
  ],
  tiktok: ['body'],
  x: ['article:has(video)']
};

// 3. UTILIDADES MATEMÁTICAS Y DE AUDIO
function generatePuzzle() {
  const a = Math.floor(Math.random() * 12) + 5;
  const b = Math.floor(Math.random() * 12) + 2;
  return { q: `${a} x ${b} + 7`, a: (a * b) + 7 };
}

function killAllMedia() {
  document.querySelectorAll('video, audio').forEach(media => {
    try {
      media.pause();
      media.muted = true;
      media.src = "";
    } catch (e) {}
  });
}

// 4. SISTEMA DE BLOQUEO TOTAL (OVERLAY SANITIZADO)
function showWarningOverlay() {
  if (document.getElementById('vertical-blocker-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'vertical-blocker-overlay';
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;color:#fff;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:monospace;text-align:center;";

  const puzzle = generatePuzzle();
  const container = document.createElement('div');
  container.style.cssText = "max-width:800px;padding:50px;border:2px solid #333;background:#000;";

  const h1 = document.createElement('h1');
  h1.style.cssText = "font-size:3rem;color:#ff0000;text-transform:uppercase;margin:0;";
  h1.textContent = t.title;

  const pMsg = document.createElement('p');
  pMsg.style.cssText = "font-size:1.4rem;margin:25px 0;";
  pMsg.textContent = t.message;

  const scienceDiv = document.createElement('div');
  scienceDiv.style.cssText = "background:#111;padding:25px;margin:20px 0;color:#888;text-align:left;border-left:5px solid #ff0000;";
  scienceDiv.textContent = t.science;

  const actions = document.createElement('div');
  actions.style.cssText = "margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:20px;";

  const btnBack = document.createElement('button');
  btnBack.style.cssText = "padding:20px 50px;background:#fff;color:#000;font-weight:bold;cursor:pointer;border:none;width:100%;text-transform:uppercase;";
  btnBack.textContent = t.btnBack;
  btnBack.onclick = () => {
    const host = location.hostname;
    location.href = host.includes('youtube') ? 'https://www.youtube.com' : (host.includes('facebook') ? 'https://www.facebook.com' : 'https://www.google.com');
  };

  const btnBypass = document.createElement('button');
  btnBypass.style.cssText = "background:transparent;color:#444;text-decoration:underline;border:none;cursor:pointer;";
  btnBypass.textContent = t.btnBypass;

  const puzArea = document.createElement('div');
  puzArea.style.cssText = "display:none;margin-top:20px;background:#222;padding:20px;border-radius:10px;";
  
  const puzText = document.createElement('p');
  puzText.textContent = t.puzzlePrompt;
  const puzStrong = document.createElement('strong');
  puzStrong.textContent = puzzle.q;
  puzText.appendChild(puzStrong);

  const puzInput = document.createElement('input');
  puzInput.type = "number";
  puzInput.style.cssText = "padding:10px;width:80px;background:#000;color:#fff;border:1px solid #ff0000;margin:0 10px;";

  const puzBtn = document.createElement('button');
  puzBtn.style.cssText = "padding:10px;background:#ff0000;color:#fff;border:none;cursor:pointer;";
  puzBtn.textContent = "OK";

  // Logic
  btnBypass.onclick = () => { puzArea.style.display = 'block'; };
  puzBtn.onclick = () => {
    if (parseInt(puzInput.value) === puzzle.a) {
      clearInterval(killInterval);
      overlay.remove();
      document.getElementById('nuclear-block-css')?.remove();
    } else {
      alert(t.error);
      location.reload();
    }
  };

  // Build
  puzArea.append(puzText, puzInput, puzBtn);
  actions.append(btnBack, btnBypass, puzArea);
  container.append(h1, pMsg, scienceDiv, actions);
  overlay.appendChild(container);
  document.documentElement.appendChild(overlay);

  const killInterval = setInterval(killAllMedia, 500);
}

// 5. LIMPIEZA DINÁMICA DE ELEMENTOS
function runBlocker() {
  const host = location.hostname;
  const path = location.pathname;

  const isShortsPage = (host.includes('youtube') && path.includes('/shorts')) ||
                       (host.includes('instagram') && (path.includes('/reels') || path.includes('/reel/'))) ||
                       (host.includes('facebook') && (path.includes('/reels') || path.includes('/reel/'))) ||
                       (host.includes('tiktok'));

  if (isShortsPage) {
    if (!document.getElementById('nuclear-block-css')) {
      const style = document.createElement('style');
      style.id = 'nuclear-block-css';
      style.innerHTML = `body { overflow: hidden !important; } #content, #page-manager, #mount_0_0, .app-main { display: none !important; }`;
      document.head.appendChild(style);
    }
    showWarningOverlay();
    return;
  }

  const platform = Object.keys(SELECTORS).find(p => host.includes(p));
  const activeSelectors = platform ? SELECTORS[platform] : [];

  function deepClean() {
    activeSelectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch (e) {}
    });
    
    if (host.includes('facebook')) {
      document.querySelectorAll('span, div, a').forEach(el => {
        const isReel = el.innerText === 'Reel' || el.innerText === 'Reels' || el.getAttribute('aria-label')?.includes('Reel');
        if (isReel) {
          const container = el.closest('div[role="listitem"]') || el.closest('div[role="link"]') || el.closest('a') || el.closest('div[data-visualcompletion]');
          if (container) {
            container.style.display = 'none';
            container.remove();
          }
        }
      });
    }

    if (host.includes('youtube')) {
      document.querySelectorAll('#title-container, #header').forEach(header => {
        if (header.innerText.includes('Shorts')) {
          header.closest('ytd-rich-shelf-renderer')?.remove();
          header.closest('ytd-reel-shelf-renderer')?.remove();
        }
      });
    }
  }

  deepClean();
  new MutationObserver(deepClean).observe(document.body, { childList: true, subtree: true });
}

// 6. INIT
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runBlocker);
} else {
  runBlocker();
}

window.addEventListener('yt-navigate-finish', runBlocker);
window.addEventListener('popstate', runBlocker);