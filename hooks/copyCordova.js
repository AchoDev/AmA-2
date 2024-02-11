var fs = require('fs');
var path = require('path');

module.exports = function(context) {
  var platforms = context.opts.cordova.platforms;
  platforms.forEach(function(platform) {
    var cordovaJsPath = path.join(context.opts.projectRoot, 'platforms', platform, 'platform_www', 'cordova.js');
    var destPath = path.join(context.opts.projectRoot, 'platforms', platform, 'www', 'dist', 'assets','cordova.js');
    fs.copyFileSync(cordovaJsPath, destPath);
  });
};