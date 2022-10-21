// global var used by rabbitmq code

waitForLogin(() => {
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
})

/**
 * If try to add the awesome tab on the login page, it will cause a black page
 */
function waitForLogin(cb) {
  const pollMenuVisible = () => {
    const isLoggedIn = !!window.user;

    if(isLoggedIn) {
      cb();
      return;
    } 

    setTimeout(pollMenuVisible, 100);
  }

  pollMenuVisible(cb);
}