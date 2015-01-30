'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('dependencies', function() {
    var inject = require('gulp-inject');
    var glob = require('globby');
    var path = require('path');
    var _ = require('lodash');
    var mainBowerFiles = require('main-bower-files');
    var files = mainBowerFiles();
    // This is probably slower than using a native stream, but the order
    // is random so we keep getting changes to index.html even if we didn't
    // add or remove any files
    var scripts = glob.sync(['./app/components/**/*.js', '!./app/components/**/*.test.js', '!./app/components/app.js']);
    scripts = _.sortBy(scripts, 'path');
    scripts.unshift('./app/components/app.js');

    return gulp.src('./app/index.html')
      .pipe(inject(gulp.src(files, {read:false}), {name:'bower',relative:true}))
      .pipe(inject(gulp.src(scripts, {read:false}), {relative:true}))
      .pipe(inject(gulp.src('./app/css/*.css', {read:false}), {relative:true}))
      .pipe(gulp.dest('./app'));
  });
};
module.exports = plugin;
