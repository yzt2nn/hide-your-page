let currentEle = null;
let normalStyle = "";
let fullScreenStyle = "";

chrome.extension.onMessage.addListener(function (request) {
  switch (request.signal) {
    case "setPage": {
      const srcUrl = request.info.srcUrl;
      const images = document.getElementsByTagName("img");
      let image = null;

      for (let i = 0, length = images.length; i < length; i++) {
        if (images[i].currentSrc === srcUrl) {
          image = images[i];
          break;
        }
      }
      if (image) {
        // 如果找到了图片
        let alterEle = image;
        const height = alterEle.offsetHeight;
        const width = alterEle.offsetWidth;

        let parentNode = image.parentNode;
        if (parentNode.tagName === "A") {
          alterEle = parentNode;
          parentNode = parentNode.parentNode;
        }

        const frame = document.createElement("iframe");
        normalStyle = `height: ${height}px; width: ${width}px;"`;
        fullScreenStyle = `height: 100%; width: 100%; position: fixed; top: 0px; left: 0px; z-index: 99999; background-color: #fff;`;
        frame.style = normalStyle;
        frame.src = request.url;
        parentNode.replaceChild(frame, alterEle);
        currentEle = frame;
      }
      break;
    }
    case "fullScreen": {
      console.log(currentEle);
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
