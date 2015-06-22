'use strict';

// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint      = require('gulp-jshint');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var concatCss   = require('gulp-concat-css');
var minifyCss   = require('gulp-minify-css');
var gzip        = require('gulp-gzip');
var minifyHTML  = require('gulp-minify-html');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/quattro.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(gzip())
        .pipe(gulp.dest('dist'));
});

gulp.task('vendorscripts', function() {
    return gulp.src([
      'js/vendor/bootstrap.js', 
      'js/vendor/jquery.masonry.js', 
      'js/vendor/waypoints.js', 
      'js/vendor/waypoints-sticky.js', 
      'js/vendor/jquery.countTo.js',
      'js/vendor/mandrill.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(gzip())
        .pipe(gulp.dest('dist'));
});
            
gulp.task('concatCss', function () {
  return gulp.src('css/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('dist'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./index.html')
    .pipe(minifyHTML(opts))
    .pipe(rename('index.min.html'))
    .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts', 'vendorscripts', 'concatCss']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'vendorscripts', 'concatCss', 'watch']);

gulp.task('dist', ['scripts', 'vendorscripts', 'concatCss', 'minify-html']);