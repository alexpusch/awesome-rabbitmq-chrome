import startApp from "../../../app/index";
import "react-table/react-table.css";

chrome.runtime.sendMessage({ type: "awesome-rabbit-load", return: true }, function(response) {
  if (!isRabbitManagement()) return;

  const scriptEl = document.createElement(`script`);
  const src = chrome.runtime.getURL('bootstrap.js')
  scriptEl.src = src;
  window.document.head.appendChild(scriptEl);

  chrome.runtime.sendMessage({
    type: "awesome-rabbit-start"
  });

  window.addEventListener("message", e => {
    if (e.data.source === "awesome") {
      const root = window.document.querySelector("#awesome-root");

      const config = {
        authHeader: e.data.authHeader,
        queuesConfig: response.queuesConfig,
        timerInterval: e.data.timerInterval
      };

      startApp(root, config);
      // note: Change the favicon to mark the tab has been 0wned.
      document.querySelector('link[rel*="icon"]').href = chrome.runtime.getURL(
        "icons/icon128.png"
      );
    }
  });
});

function isRabbitManagement() {
  const title = window.document.head.querySelector("title");
  return title.innerText === "RabbitMQ Management";
}
