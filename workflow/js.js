'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('lint', function() {
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');
    return gulp.src('./app/components/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });
};
module.exports = plugin;
