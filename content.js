// Content script - runs on web pages
(function() {
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getSelection') {
      const selection = window.getSelection().toString().trim();
      sendResponse({selection: selection});
    } else if (request.action === 'getPageContent') {
      // Get main content of the page
      const content = extractPageContent();
      sendResponse({content: content});
    }
    return true; // Keep message channel open for async response
  });
  
  // Extract main content from page
  function extractPageContent() {
    // Try common content selectors
    const selectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post',
      '.entry-content',
      'main',
      '.main-content',
      '#content'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.innerText.substring(0, 3000); // Limit to 3000 chars
      }
    }
    
    // Fallback: get body text
    return document.body.innerText.substring(0, 3000);
  }
  
  // Add context menu for quick access
  document.addEventListener('mouseup', function(e) {
    if (e.button === 0) { // Left click
      const selection = window.getSelection().toString().trim();
      if (selection.length > 10) { // Only show for meaningful selections
        // Add a small button to translate
        showTranslateButton(e.clientX, e.clientY, selection);
      }
    }
  });
  
  function showTranslateButton(x, y, text) {
    // Create floating button
    const btn = document.createElement('div');
    btn.textContent = '.Translate';
    btn.style.position = 'fixed';
    btn.style.left = (x + 10) + 'px';
    btn.style.top = (y - 30) + 'px';
    btn.style.background = '#4f46e5';
    btn.style.color = 'white';
    btn.style.padding = '5px 10px';
    btn.style.borderRadius = '4px';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '10000';
    btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    btn.onclick = function() {
      // Send to popup for translation
      chrome.runtime.sendMessage({
        action: 'quickTranslate',
        text: text
      });
      document.body.removeChild(btn);
    };
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (btn.parentNode) {
        document.body.removeChild(btn);
      }
    }, 3000);
    
    document.body.appendChild(btn);
  }
})();