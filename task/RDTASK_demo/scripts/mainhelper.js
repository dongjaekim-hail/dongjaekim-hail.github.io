const serverBaseURL = "http://localhost:8888"; // URL to the project located on the server, no trailing slash!
// https://hg-lm-s001.econ.uzh.ch/staging

// function to format the date and time
function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // months are zero indexed
  month = month < 10 ? "0" + month : month;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return (
    day + "-" + month + "-" + year + "_" + hour + "-" + minute + "-" + second
  );
}

function getTime() {
  //make a new date object
  let d = new Date();
  //return the number of milliseconds since 1 January 1970 00:00:00.
  return d.getTime();
}

// ----------------- Visualization ---------------------------
// add fullscreen button
function fullscreen(scene) {
  if (scene.scale.isFullscreen) {
    var button = scene.add.image(1400 - 16, 16, 'fullscreen', 1).setOrigin(1, 0).setInteractive();
  } else {
    var button = scene.add.image(1400 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
  }

  button.on('pointerup', function () {
    //var time = new Date();
    //time = formatDate(time);

    if (scene.scale.isFullscreen) {
      button.setFrame(0);
      scene.scale.stopFullscreen();
      scene.registry.values.fullscreenOn = 0;
    } else {
      button.setFrame(1);
      scene.scale.startFullscreen();
      scene.registry.values.fullscreenOn = 1;
    }
  }, scene);
}

//helper function for parsing per trial data
function saveTrialData(payload = {}) {
  // Read through input as key/value pairs flat
  Object.getOwnPropertyNames(payload).forEach((key) => {
    const value = payload[key];
    // Add to current trial
    window.psychoJS.experiment.addData(key, value);
  });
  console.log((window.psychoJS._serverManager._status));
  // Add to experiment ahead of next trial
  window.psychoJS.experiment.nextEntry();
}

//helper function for parsing per trial data
function saveTrialData_(payload = {}) {
  // Read through input as key/value pairs flat
  Object.getOwnPropertyNames(payload).forEach((key) => {
    const value = payload[key];
    // Add to current trial
    window.psychoJS.experiment.addData(key, value);
  });
  console.log((window.psychoJS._serverManager._status));
  // Add to experiment ahead of next trial
  window.psychoJS.experiment.nextEntry();
}