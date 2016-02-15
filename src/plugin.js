import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  timeout: 1000
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  let display;
  let watchdog;
  let lastTime;
  let errorTime;
  let waitingForConnection = false;

  const resetWatchdog = function() {
    player.clearInterval(watchdog);
    watchdog = player.setInterval(function() {
      if (!waitingForConnection) {
        return;
      }
      if (navigator.onLine && player.src()) {
        let request = new XMLHttpRequest();

        request.open('head', options.testUrl || player.src(), true);
        request.onreadystatechange = function receiveResponse() {
          if (this.readyState === 4 && this.status === 200) {
            waitingForConnection = false;
            display.close();
            player.src(player.src());
            player.currentTime(errorTime);
            player.play();
          }
        };
        request.send();
        request = null;
      }
    }, options.timeout);
  };

  player.on('timeupdate', function() {
    lastTime = player.currentTime();
  });

  player.on('error', function() {
    let error = player.error();

    if (player.src() && error.code === 2) {
      waitingForConnection = true;
      errorTime = lastTime;

      let content = document.createElement('div');

      display = player.errorDisplay;
      content.innerHTML =
      `<div class='vjs-watchdog-display'>
        <h4>The video connection was lost</h4>
      </div>`;
      display.fillWith(content);
    }
  });

  player.on('dispose', function() {
    player.clearInterval(watchdog);
  });

  resetWatchdog();
};

/**
 * Watchdog video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function watchdogPlugin
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const watchdogPlugin = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('watchdogPlugin', watchdogPlugin);

// Include the version number.
watchdogPlugin.VERSION = '__VERSION__';

export default watchdogPlugin;
