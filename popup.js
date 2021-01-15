let currentUrl = window.localStorage.getItem("hyp-current-url");
document.getElementById("urlInput").value = currentUrl;
chrome.runtime.sendMessage({ url: currentUrl });

document.forms["urlForm"].onsubmit = function () {
  currentUrl = document.getElementById("urlInput").value;
  window.localStorage.setItem("hyp-current-url", currentUrl);
  chrome.runtime.sendMessage({ url: currentUrl });
};

function getCurrentTabId(callback) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    callback(tabs[0].id);
  });
}

document.getElementById("fullScreenButton").onclick = function () {
  getCurrentTabId((tid) => {
    chrome.tabs.sendMessage(tid, { signal: "fullScreen" });
  });
};

document.getElementById("restoreScreenButton").onclick = function () {
  getCurrentTabId((tid) => {
    chrome.tabs.sendMessage(tid, { signal: "restoreScreen" });
  });
};
