document.addEventListener('DOMContentLoaded', function() {
  // Load balance
  loadBalance();
  
  // Setup event listeners
  document.getElementById('translateBtn').addEventListener('click', translateSelection);
  document.getElementById('summaryBtn').addEventListener('click', summarizePage);
  document.getElementById('rewriteBtn').addEventListener('click', rewriteText);
  document.getElementById('analyzeBtn').addEventListener('click', analyzePage);
  document.getElementById('topUp').addEventListener('click', topUp);
});

async function loadBalance() {
  try {
    const balance = await chrome.storage.sync.get(['balance']);
    document.getElementById('balance').textContent = balance.balance || '0.00';
  } catch (error) {
    console.error('Failed to load balance:', error);
  }
}

async function translateSelection() {
  // Get selected text from active tab
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  chrome.tabs.sendMessage(tab.id, {action: 'getSelection'}, function(response) {
    if (response && response.selection) {
      // Call AI API to translate
      callAI('translate', {text: response.selection}, function(result) {
        showResult('翻译结果', result.translation);
      });
    } else {
      alert('请先选择要翻译的文本');
    }
  });
}

async function summarizePage() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  chrome.tabs.sendMessage(tab.id, {action: 'getPageContent'}, function(response) {
    if (response && response.content) {
      callAI('summarize', {content: response.content}, function(result) {
        showResult('页面摘要', result.summary);
      });
    } else {
      alert('无法获取页面内容');
    }
  });
}

async function rewriteText() {
  // For now, just show a prompt
  const text = prompt('请输入要润色的文本:');
  if (text) {
    callAI('rewrite', {text: text}, function(result) {
      showResult('润色结果', result.rewritten);
    });
  }
}

async function analyzePage() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
  chrome.tabs.sendMessage(tab.id, {action: 'getPageContent'}, function(response) {
    if (response && response.content) {
      callAI('analyze', {content: response.content}, function(result) {
        showResult('页面分析', result.analysis);
      });
    } else {
      alert('无法获取页面内容');
    }
  });
}

function callAI(action, data, callback) {
  // Deduct cost
  deductCost(0.01);
  
  // Call API
  fetch('https://api.yourproxy.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('api_key')
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{role: 'user', content: buildPrompt(action, data)}]
    })
  })
  .then(response => response.json())
  .then(data => {
    callback(parseResult(action, data));
  })
  .catch(error => {
    console.error('AI API call failed:', error);
    callback({error: 'AI服务暂时不可用'});
  });
}

function buildPrompt(action, data) {
  switch(action) {
    case 'translate':
      return `请将以下文本翻译成中文：${data.text}`;
    case 'summarize':
      return `请用100字左右概括以下内容：${data.content.substring(0, 2000)}`;
    case 'rewrite':
      return `请润色以下文本，使其更加流畅：${data.text}`;
    case 'analyze':
      return `请分析以下内容的要点和核心观点：${data.content.substring(0, 2000)}`;
    default:
      return data.text;
  }
}

function parseResult(action, data) {
  const content = data.choices[0].message.content;
  
  switch(action) {
    case 'translate':
      return {translation: content};
    case 'summarize':
      return {summary: content};
    case 'rewrite':
      return {rewritten: content};
    case 'analyze':
      return {analysis: content};
    default:
      return {result: content};
  }
}

function showResult(title, content) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%; overflow-y: auto;">
        <h3>${title}</h3>
        <p>${content}</p>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="margin-top: 10px;">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
}

async function deductCost(amount) {
  const storage = await chrome.storage.sync.get(['balance']);
  let balance = parseFloat(storage.balance || '0.00');
  balance -= amount;
  
  if (balance < 0) {
    alert('余额不足，请充值');
    return false;
  }
  
  await chrome.storage.sync.set({balance: balance.toFixed(2)});
  document.getElementById('balance').textContent = balance.toFixed(2);
  return true;
}

function topUp() {
  // Open billing page
  chrome.tabs.create({url: 'https://your-service.com/billing'});
}