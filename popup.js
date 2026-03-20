const LANG = navigator.language.startsWith('es') ? 'es' : 'en';

const TEXT = {
  en: {
    title: "Neural Shield",
    stat: "DOPAMINE DEPLETION:",
    desc: "Short-form content causes 'Attentional Fragmentation.' If you disable this, you are choosing to weaken your focus.",
    btn: "Disable Protection (I want to rot)",
    confirm: "Are you sure you want to surrender your focus to an algorithm?"
  },
  es: {
    title: "Escudo Neuronal",
    stat: "AGOTAMIENTO DE DOPAMINA:",
    desc: "El contenido corto causa 'Fragmentación Atencional'. Si desactivas esto, eliges debilitar tu capacidad de enfoque.",
    btn: "Desactivar (Quiero la atrofia)",
    confirm: "¿Estás seguro de que quieres entregar tu atención a un algoritmo?"
  }
};

const t = TEXT[LANG] || TEXT.en;

// Set text based on language
document.getElementById('title').textContent = t.title;
document.getElementById('stat-head').textContent = t.stat;
document.getElementById('description').textContent = t.desc;
document.getElementById('toggle').textContent = t.btn;

document.getElementById('toggle').onclick = () => {
  if (confirm(t.confirm)) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: () => {
          // Add a session flag so it stays disabled until reload
          window.BLOCKER_DISABLED = true;
          alert('Neural Shield Deactivated. Refreshing page into unprotected mode...');
          window.location.reload();
        }
      });
    });
  }
};