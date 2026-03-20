/**
 * NEURAL SHIELD v2.1 - AGGRESSIVE BLOCKER
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

// 4. SISTEMA DE BLOQUEO TOTAL (OVERLAY)
function showWarningOverlay() {
  if (document.getElementById('vertical-blocker-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'vertical-blocker-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: #000; color: #fff; z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Courier New', Courier, monospace; text-align: center;
  `;

  const puzzle = generatePuzzle();

  overlay.innerHTML = `
    <div style="max-width: 800px; padding: 50px; border: 2px solid #333; background: #000;">
      <h1 style="font-size: 3rem; color: #ff0000; text-transform: uppercase;">${t.title}</h1>
      <p style="font-size: 1.4rem; margin: 25px 0;">${t.message}</p>
      <div style="background: #111; padding: 25px; margin: 20px 0; color: #888; text-align: left; border-left: 5px solid #ff0000;">
        ${t.science}
      </div>
      <div style="margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <button id="back-home-btn" style="padding: 20px 50px; background: #fff; color: #000; font-weight: bold; cursor: pointer; border: none; width: 100%; text-transform: uppercase;">${t.btnBack}</button>
        <button id="bypass-trigger" style="background: transparent; color: #444; text-decoration: underline; border: none; cursor: pointer;">${t.btnBypass}</button>
        <div id="puzzle-area" style="display: none; margin-top: 20px; background: #222; padding: 20px; border-radius: 10px;">
          <p>${t.puzzlePrompt} <strong>${puzzle.q}</strong></p>
          <input type="number" id="puzzle-input" style="padding: 10px; width: 80px; background: #000; color: #fff; border: 1px solid #ff0000;">
          <button id="puzzle-check" style="padding: 10px; background: #ff0000; color: #fff; border: none; cursor: pointer;">OK</button>
        </div>
      </div>
    </div>
  `;
  
  document.documentElement.appendChild(overlay);
  const killInterval = setInterval(killAllMedia, 500);

  document.getElementById('back-home-btn').onclick = () => {
    const host = location.hostname;
    if (host.includes('youtube')) location.href = 'https://www.youtube.com';
    else if (host.includes('facebook')) location.href = 'https://www.facebook.com';
    else location.href = 'https://www.google.com';
  };

  document.getElementById('bypass-trigger').onclick = () => {
    document.getElementById('puzzle-area').style.display = 'block';
  };

  document.getElementById('puzzle-check').onclick = () => {
    if (parseInt(document.getElementById('puzzle-input').value) === puzzle.a) {
      clearInterval(killInterval);
      overlay.remove();
      const nuke = document.getElementById('nuclear-block-css');
      if (nuke) nuke.remove();
    } else {
      alert(t.error);
      location.reload();
    }
  };
}

// 5. LIMPIEZA DINÁMICA DE ELEMENTOS
function runBlocker() {
  const host = location.hostname;
  const path = location.pathname;

  // Verificación de página de Reels
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
    // Eliminación por selectores (Protección contra error en línea 166)
    activeSelectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch (e) {
        // Ignorar selectores inválidos o no soportados
      }
    });
    
    // Especial Facebook: Detectar botón "Reel" por texto o aria-label
    if (host.includes('facebook')) {
    // Buscamos cualquier elemento que mencione Reel en su texto o etiqueta
    document.querySelectorAll('span, div, a').forEach(el => {
      const isReel = el.innerText === 'Reel' || 
                    el.innerText === 'Reels' || 
                    el.getAttribute('aria-label')?.includes('Reel');

      if (isReel) {
        // Facebook mete los botones en estructuras de 'listitem' o 'link'
        const container = el.closest('div[role="listitem"]') || 
                          el.closest('div[role="link"]') || 
                          el.closest('a');
        
        if (container) {
          container.style.display = 'none'; // Lo ocultamos primero para que sea instantáneo
          container.remove(); // Luego lo borramos del mapa
        }
      }
    });
  }

    // Especial YouTube: Quitar estantes de shorts por título
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

// 6. INICIO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runBlocker);
} else {
  runBlocker();
}

window.addEventListener('yt-navigate-finish', runBlocker);
window.addEventListener('popstate', runBlocker);