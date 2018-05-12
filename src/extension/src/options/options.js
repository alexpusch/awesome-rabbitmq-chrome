function saveOptions() {
  var queuesConfig = document.getElementById('queuesConfig').value;
  chrome.storage.sync.set({
    queuesConfig: queuesConfig
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.style = "opacity: 1";
    setTimeout(function () {
      status.style = "opacity: 0";
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ queuesConfig: '' }, function (items) {
    document.getElementById('queuesConfig').value = items.queuesConfig || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);