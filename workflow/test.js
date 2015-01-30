'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('test', function(done) {
    var es = require('event-stream');
    var glob = require('globby');
    var mainBowerFiles = require('main-bower-files');
    var path = require('path');

    var karma = require('karma').server;

    var plugins = mainBowerFiles().filter(function(filePath) {
      var extname = path.extname(filePath);
      return extname === '.js';
    })
    var testSupport = glob.sync('./test/**/*.js');
    // This probably won't scale
    var scripts = glob.sync('./app/components/**/*.js').sort(function(a, b) {
      if (path.basename(a) === 'app.js') return -1;
      if (path.basename(b) === 'app.js') return 1;
      return 0;
    });
    var html = glob.sync('./app/components/**/*.html');
    var files = plugins.concat(testSupport).concat(scripts).concat(html);

    karma.start({
      configFile: config.dirname + '/karma.conf.js',
      files: files,
      singleRun: true
    }, done);
  });
};
module.exports = plugin;
