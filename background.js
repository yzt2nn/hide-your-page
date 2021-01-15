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
    url: currentUrl,
  });
}

function analyseUrl(url) {
  if (url.indexOf("bilibili.com")) {
    // 如果是B站的地址
    const matches = /bilibili.com\/video\/([0-9a-zA-Z]*)[\/\?]?/.exec(url);
    if (matches && matches.length > 1) {
      const bvNo = matches[1];
      let page = undefined;
      const pageMatches = /p=([0-9]*)/.exec(url);
      if (pageMatches && pageMatches.length > 1) {
        page = pageMatches[1];
      }
      return `https://player.bilibili.com/player.html?danmaku=0&high_quality=1&bvid=${bvNo}${
        page ? "&page=" + page : ""
      }`;
    }
  }
  return url;
}

chrome.runtime.onMessage.addListener(function (request) {
  currentUrl = analyseUrl(request.url);
});
