'use strict';

var plugin = {};
plugin.attach = function(gulp, config) {
  gulp.task('build.clean', function(cb) {
    var del = require('del');
    del(['dist'], cb);
  });

  gulp.task('build.copy', ['build.clean'], function() {
    return gulp.src('app/package.json')
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('build.assemble', ['build.clean', 'lint', 'test', 'build.copy'], function() {
    var concat = require('gulp-concat');
    var es = require('event-stream');
    var inject = require('gulp-inject');
    var filter = require('gulp-filter');
    var mainBowerFiles = require('main-bower-files');
    var uglify = require('gulp-uglify');
    var ngHtml2Js = require('gulp-ng-html2js');
    var ngAnnotate = require('gulp-ng-annotate');
    var cssMin = require('gulp-cssmin');
    var order = require('gulp-order');
    var files = mainBowerFiles();

    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');
    var fontFilter = filter('**/*.{eot,svg,ttf,woff}');

    var pluginsStream = gulp.src(files)
      .pipe(jsFilter)
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('dist/js'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
        .pipe(concat('plugins.css'))
        .pipe(cssMin())
        .pipe(gulp.dest('dist/css'))
      .pipe(cssFilter.restore())
      .pipe(fontFilter)
        .pipe(gulp.dest('dist/fonts'))
      .pipe(fontFilter.restore());

    var scriptsStream = gulp.src(['./app/components/**/*.js', '!./app/components/**/*.test.js'])
      .pipe(concat('components.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));

    var cssStream = gulp.src('./app/css/**/*.css')
      .pipe(cssMin())
      .pipe(gulp.dest('dist/css'));

    var templatesStream = gulp.src('./app/components/**/*.html')
      .pipe(ngHtml2Js({
        moduleName: config.moduleName,
        prefix: 'components/'
      }))
      .pipe(concat('templates.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));

    var imagesStream = gulp.src('./app/images/**/*')
      .pipe(gulp.dest('dist/images'));

    var allStreams = es.merge(scriptsStream, cssStream, templatesStream, imagesStream);
    var scriptOrder = [
      'dist/js/templates*.js',
      'dist/js/*.js'
    ];

    return gulp.src('./app/index.html')
      .pipe(gulp.dest('dist'))
      .pipe(inject(pluginsStream, {name:'bower',relative:true}))
      .pipe(inject(allStreams.pipe(order(scriptOrder)), {relative:true}))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build.rev', ['build.assemble'], function() {
    var rev = require('gulp-rev');
    var through = require('through2');
    var del = require('del');
    var gulpFilter = require('gulp-filter');
    var revvable = gulpFilter(['**/*', '!*.html', '!*.json'])
    var revReplace = require('gulp-rev-replace');

    return gulp.src('dist/**/*')
      .pipe(revvable)
        .pipe(rev())
      .pipe(revvable.restore())
      .pipe(revReplace())
      .pipe(gulp.dest('dist/'))
      .pipe(through.obj(
        function(file, enc, cb) {
          if (file.revOrigPath && file.path !== file.revOrigPath) {
            del([file.revOrigPath], function() {
              cb(null, file);
            });
          }
          else {
            cb(null, file);
          }
        }
      ));
  });

  gulp.task('build', ['build.rev']);
};
module.exports = plugin;
