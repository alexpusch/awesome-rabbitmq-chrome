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
      authHeader: auth_header(),
      timerInterval: window.timer_interval
    };

    window.postMessage(message, "*");
  });
});