'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('css', function() {
    var sass = require('gulp-sass');
    return gulp.src('./app/components/_scss/app.scss')
      .pipe(sass({
        errLogToConsole: true,
        includePaths: ['app/bower_components', 'app/components']
      }))
      .pipe(gulp.dest('./app/css'))
  });
};
module.exports = plugin;
