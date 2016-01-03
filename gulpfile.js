'use strict';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint            = require('gulp-jshint');
var uglify            = require('gulp-uglify');
var rename            = require('gulp-rename');
var minifyCss         = require('gulp-minify-css');
var gzip              = require('gulp-gzip');
var minifyHTML        = require('gulp-minify-html');
var awspublish        = require('gulp-awspublish');
var awspublishRouter  = require('gulp-awspublish-router');
var useref            = require('gulp-useref');
var gulpif            = require('gulp-if');
var runSequence       = require('run-sequence');
var clean             = require('gulp-clean');

gulp.task('replace-refs', function () {
    var assets = useref.assets();

    return gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpif('mandrill.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-css', function() {
    gulp.src(['dist/css/*'])
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gzip({append: false}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('compress-js', function() {
    gulp.src(['dist/js/*'])
    .pipe(uglify())
    .pipe(gzip({append: false}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('./dist/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gzip({append: false}))
    .pipe(rename('index.min.html'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
    return gulp.src('images/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src('fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/quattro.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('publish', function () {
  // create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = awspublish.create({
    params: {
      Bucket: 'luluposhhair.com'
    }
  });
    gulp.src('**/*', { cwd: './dist/' })
        .pipe(awspublishRouter({
            cache: {
                // cache for 5 minutes by default
                cacheTime: 300
            },

            routes: {
              "^images/.+$": {
                  // cache static assets for 20 years
                  cacheTime: 630720000
              },
              "^fonts/.+$": {
                  // cache static assets for 20 years
                  cacheTime: 630720000
              },
              ".js.gz": {
                    // specify extra headers
                    headers: {
                        'Content-Type': 'text/javascript',
                        'Content-Encoding': 'gzip'
                    },
                    cacheTime: 630720000
                },
                ".css.gz": {
                      // specify extra headers
                      headers: {
                          'Content-Type': 'text/css',
                          'Content-Encoding': 'gzip'
                      },
                      cacheTime: 630720000
                  },
                  ".min.html": {
                    headers: {
                        'Content-Encoding': 'gzip'
                    }
                  },
                // pass-through for anything that wasn't matched by routes above, to be uploaded with default options
                "^.+$": "$&"
            }
        }))
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter())
});

gulp.task('clean', function() {
    return gulp.src('dist').pipe(clean());
});

gulp.task('dist', ['replace-refs', 'images', 'fonts']);

gulp.task('compress', ['compress-css', 'compress-js', 'minify-html']);

gulp.task('deploy', function(callback) {
  runSequence(
    'clean',
    'dist',
    'compress',
    'publish',
    callback);
});
