document.getElementById('toggle').onclick = () => {
  chrome.tabs.query({active:true,currentWindow:true}, tabs => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: () => alert('Temporarily disabled on this tab (refresh to re-enable)')
    });
  });
};