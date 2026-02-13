// Background script
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: 'ai-translate',
    title: 'AI翻译选中文本',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'ai-summarize',
    title: 'AI摘要当前页面',
    contexts: ['page']
  });
  
  chrome.contextMenus.create({
    id: 'ai-analyze',
    title: 'AI分析当前页面',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai-translate') {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'getSelection'
    }, (response) => {
      if (response && response.selection) {
        // Open popup with translation
        openPopupWithAction('translate', response.selection);
      }
    });
  } else if (info.menuItemId === 'ai-summarize') {
    // Get page content and summarize
    chrome.tabs.sendMessage(tab.id, {
      action: 'getPageContent'
    }, (response) => {
      if (response && response.content) {
        openPopupWithAction('summarize', response.content);
      }
    });
  } else if (info.menuItemId === 'ai-analyze') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'getPageContent'
    }, (response) => {
      if (response && response.content) {
        openPopupWithAction('analyze', response.content);
      }
    });
  }
});

// Handle quick translate from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'quickTranslate') {
    openPopupWithAction('translate', request.text);
  }
});

// Open popup with specific action
function openPopupWithAction(action, data) {
  // Store data temporarily
  chrome.storage.local.set({
    quickAction: {
      action: action,
      data: data,
      timestamp: Date.now()
    }
  });
  
  // Open popup
  chrome.action.openPopup();
}

// Check for premium features
async function checkPremiumFeatures() {
  const user = await chrome.storage.sync.get(['premium']);
  return user.premium || false;
}

// Initialize extension
chrome.runtime.onStartup.addListener(() => {
  console.log('AI Browser Assistant started');
});