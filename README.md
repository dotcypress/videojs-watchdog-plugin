# videojs-watchdog-plugin

Internet watchdog for video.js

## Installation

```sh
npm install --save videojs-watchdog-plugin
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-watchdog-plugin
```

## Usage

To include videojs-watchdog-plugin on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<link href='//path/to/videojs-watchdog.css' rel='stylesheet'>
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-watchdog-plugin.min.js"></script>
<script>
  var player = videojs('my-video');

  player.watchdogPlugin();
</script>
```

### Browserify

When using with Browserify, install videojs-watchdog-plugin via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-watchdog-plugin');

var player = videojs('my-video');

player.watchdogPlugin();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-watchdog-plugin'], function(videojs) {
  var player = videojs('my-video');

  player.watchdogPlugin();
});
```

## License

MIT. Copyright (c) Vitaly Domnikov <dotcypress@gmail.com>;


[videojs]: http://videojs.com/
