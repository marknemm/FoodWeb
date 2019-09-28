cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "com.keff.IonicRecaptcha.recaptcha",
      "file": "plugins/com.keff.IonicRecaptcha/www/plugin.js",
      "pluginId": "com.keff.IonicRecaptcha",
      "clobbers": [
        "IonicRecaptcha"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-device": "2.0.3",
    "com.keff.IonicRecaptcha": "1.0.0"
  };
});