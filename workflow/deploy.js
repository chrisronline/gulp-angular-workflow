'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('deploy', function() {
    // https://github.com/pgherveou/gulp-awspublish
    var awspublish = require('gulp-awspublish');
    var credentials = require('./s3credentials.json');
    var publisher = awspublish.create(credentials);
    var headers = {};
    return gulp.src('dist/**/*')
      .pipe(awspublish.gzip())
      .pipe(publisher.publish(headers))
      .pipe(publisher.sync()) // delete other files?
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
  });
};
module.exports = plugin;