let currentUrl = window.localStorage.getItem("hyp-current-url");

document.getElementById("urlInput").value = currentUrl;
chrome.runtime.sendMessage({ url: currentUrl });

// 拉取并设置bilibili登录继承开关
chrome.cookies.get(
  {
    url: "https://www.bilibili.com",
    name: "SESSDATA",
  },
  function (sessdata) {
    if (sessdata) {
      //ok
      const sameSite = sessdata.sameSite;
      const secure = sessdata.secure;
      const el = document.getElementById("bilibiliCrossLoginCheckbox");
      if (sameSite === "no_restriction" && secure) {
        // enable cross login
        el.checked = true;
      } else {
        el.checked = false;
      }
    } else {
      //error
      //alert("很抱歉，获取信息失败！");
    }
  }
);

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

document.getElementById("bilibiliCrossLoginCheckbox").onclick = function (e) {
  chrome.cookies.get(
    {
      url: "https://www.bilibili.com",
      name: "SESSDATA",
    },
    function (sessdata) {
      if (sessdata) {
        //ok
        const value = sessdata.value;
        const expirationDate = sessdata.expirationDate;
        const httpOnly = sessdata.httpOnly;
        const sameSite = e.target.checked ? "no_restriction" : "unspecified";
        const secure = e.target.checked ? true : false;

        chrome.cookies.set(
          {
            url: "https://www.bilibili.com",
            domain: ".bilibili.com",
            path: "/",
            name: "SESSDATA",
            value,
            expirationDate,
            httpOnly,
            sameSite,
            secure,
          },
          function (sessdata) {
            if (sessdata) {
              //ok
            } else {
              //error
              e.target.checked = !e.target.checked;
              alert("很抱歉，设置失败！");
            }
          }
        );
      } else {
        //error
        e.target.checked = !e.target.checked;
        alert("设置发生错误，请确保您已登录Bilibili！");
      }
    }
  );
};
