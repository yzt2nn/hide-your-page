let currentUrl = undefined;

chrome.contextMenus.create({
  title: "将页面投放在此处",
  contexts: ["image"],
  onclick: selectAreaFunc,
});

function selectAreaFunc(info, tab) {
  if (!currentUrl) {
    alert("您还没有指定页面地址！");
    return;
  }
  chrome.tabs.sendMessage(tab.id, {
    signal: "setPage",
    info: info,
    url: currentUrl,
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  currentUrl = request.url;
});
