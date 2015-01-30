'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('browser-sync', function() {
    var browserSync = require('browser-sync');
    var url = require('url');
    var fs = require('fs');
    var path = require('path');
    var folder = path.resolve(config.dirname, 'app');

    browserSync({
      open: false,
      port: 3002,
      ghostMode: false,
      server: {
        baseDir: 'app',
        middleware: function(req, res, next) {
          // https://github.com/shakyShane/browser-sync/issues/204
          var fileName = url.parse(req.url);
          fileName = fileName.href.split(fileName.search).join('');
          var fileExists = fs.existsSync(folder + fileName);
          if (!fileExists && fileName.indexOf('browser-sync-client') < 0) {
            req.url = './index.html';
          }
          return next();
        }
      }
    });
  });

  gulp.task('watchers', function() {
    gulp.watch('./app/components/**/*.scss', ['watch.css']);
    // gulp.watch('./app/components/**/*.js', ['dependencies']);
    gulp.watch('./bower.json', ['dependencies']);
  });
  gulp.task('watch.css', ['css'], function() {
    var reload = require('browser-sync').reload;
    return gulp.src('./app/css/app.css')
      .pipe(reload({stream: true}));
  });

  //web serve
  gulp.task('serve', ['css', 'dependencies', 'browser-sync', 'watchers']);
};
module.exports = plugin;
