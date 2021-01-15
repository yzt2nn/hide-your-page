let alterEle = null;
let currentEle = null;
let normalStyle = "";
let fullScreenStyle = "";

document.oncontextmenu = function (e) {
  if (e.button == 2) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && el.tagName === "IMG") {
      alterEle = el;
    }
  }
};

chrome.extension.onMessage.addListener(function (request) {
  switch (request.signal) {
    case "setPage": {
      if (alterEle) {
        const height = alterEle.offsetHeight;
        const width = alterEle.offsetWidth;

        let parentNode = alterEle.parentNode;
        if (parentNode.tagName === "A") {
          alterEle = parentNode;
          parentNode = parentNode.parentNode;
        }

        const frame = document.createElement("iframe");
        normalStyle = `height: ${height}px; width: ${width}px;"`;
        fullScreenStyle = `height: 100%; width: 100%; position: fixed; top: 0px; left: 0px; z-index: 99999; background-color: #fff;`;
        frame.style = normalStyle;
        frame.src = request.url;
        // frame.sandbox = "allow-same-origin allow-top-navigation allow-scripts allow-forms allow-popups";
        parentNode.replaceChild(frame, alterEle);
        currentEle = frame;
      }
      break;
    }
    case "fullScreen": {
      if (!currentEle) {
        alert("您还没有在这个标签下投放页面！");
      }
      currentEle.style = fullScreenStyle;
      break;
    }
    case "restoreScreen": {
      if (!currentEle) {
        alert("您还没有在这个标签下放置页面！");
      }
      currentEle.style = normalStyle;
    }
  }
});
