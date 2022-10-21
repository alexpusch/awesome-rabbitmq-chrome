const awesomeTabs = [];

chrome.tabs.onActivated.addListener(activeInfo => {
  if (awesomeTabs.includes(activeInfo.tabId)) {
    chrome.action.enable();
  } else {
    chrome.action.disable();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request && request.type === "awesome-rabbit-load") {
    chrome.storage.sync.get({ queuesConfig: "" }, function(items) {
      const queuesConfig = items.queuesConfig ? JSON.parse(items.queuesConfig) : {};
      sendResponse({ queuesConfig });
    });
  }

  if (request && request.type === "awesome-rabbit-start") {
    awesomeTabs.push(sender.tab.id);
    chrome.action.enable(sender.tab.id);
  }
  return true;
});
