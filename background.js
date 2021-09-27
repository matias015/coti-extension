//chrome.browserAction.onClicked.addListener(function (tab) {
//chrome.tabs.executeScript(null, { file: "main.js" });
//});

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status == "complete") {
    chrome.tabs.executeScript(null, { file: "main.js" });
  }
});
