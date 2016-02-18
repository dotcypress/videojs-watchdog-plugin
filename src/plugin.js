import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  timeout: 1000,
  errors: {
    '1': {
      type: 'MEDIA_ERR_ABORTED',
      headline: 'The video download was cancelled'
    },
    '2': {
      type: 'MEDIA_ERR_NETWORK',
      headline: 'The video connection was lost, please confirm you are ' +
                'connected to the internet'
    },
    '3': {
      type: 'MEDIA_ERR_DECODE',
      headline: 'The video is bad or in a format that cannot be played on your browser'
    },
    '4': {
      type: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
      headline: 'This video is either unavailable or not supported in this browser'
    },
    '5': {
      type: 'MEDIA_ERR_ENCRYPTED',
      headline: 'The video you are trying to watch is encrypted and we do not know how ' +
                'to decrypt it'
    },
    'unknown': {
      type: 'MEDIA_ERR_UNKNOWN',
      headline: 'An unanticipated problem was encountered, check back soon and try again'
    },
    '-1': {
      type: 'PLAYER_ERR_NO_SRC',
      headline: 'No video has been loaded'
    },
    '-2': {
      type: 'PLAYER_ERR_TIMEOUT',
      headline: 'Could not download the video'
    }
  }
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
  let errorTime;
  let request;
  let waitingForConnection = false;

  const resetWatchdog = function() {
    player.clearInterval(watchdog);
    watchdog = player.setInterval(function() {
      if (!waitingForConnection) {
        return;
      }
      if (navigator.onLine && player.src()) {
        if (request) {
          request.abort();
        }
        request = new XMLHttpRequest();
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
      }
    }, options.timeout);
  };

  player.on('error', function() {
    let error = player.error();

    if (player.src() && error.code === 2) {
      waitingForConnection = true;
      errorTime = player.cache_.currentTime;
    }
    let content = document.createElement('div');

    display = player.errorDisplay;
    content.innerHTML =
      `<div class='vjs-watchdog-display'>
        <h4>${options.errors[error.code].headline}</h4>
      </div>`;
    display.fillWith(content);
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
