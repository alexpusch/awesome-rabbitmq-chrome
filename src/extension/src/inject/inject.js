import startApp from "../../../app/index";
import "react-table/react-table.css";

chrome.extension.sendMessage({ type: "awesome-rabbit-load" }, function(response) {
  if (!isRabbitManagement()) return;

  const scriptEl = createElement(`<script>(${bootstrapScript.toString()})();</script>`);
  window.document.head.appendChild(scriptEl);

  chrome.runtime.sendMessage({
    type: "awesome-rabbit-start"
  });

  window.addEventListener("message", e => {
    if (e.data.source === "awesome") {
      const root = window.document.querySelector("#awesome-root");
      const config = {
        authHeader: e.data.authHeader,
        queuesConfig: response.queuesConfig
      };

      startApp(root, config);
      // note: Change the favicon to mark the tab has been 0wned.
      document.querySelector('link[rel*="icon"]').href = chrome.extension.getURL(
        "icons/icon128.png"
      );
    }
  });
});

function isRabbitManagement() {
  const title = window.document.head.querySelector("title");
  return title.innerText === "RabbitMQ Management";
}

function createElement(htmlString) {
  return document.createRange().createContextualFragment(htmlString);
}

function bootstrapScript() {
  // global var used by rabbitmq code
  extension_count++;
  NAVIGATION.Awesome = ["#/awesome", "management"];
  dispatcher_add(sammy => {
    sammy.get("/awesome", context => {
      current_highlight = "#/awesome";
      update_navigation();
      replace_content("main", "<div id='awesome-root'></div>");

      const message = {
        source: "awesome",
        authHeader: auth_header()
      };

      window.postMessage(message, "*");
    });
  });
}
