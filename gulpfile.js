var gulp       = require('gulp')
,   gutil      = require('gulp-util')
,   coffee     = require('gulp-coffee')
,   watch      = require('gulp-watch')
,   coffeelint = require('gulp-coffeelint')
,   plumber    = require('gulp-plumber')
,   concat     = require('gulp-concat')
,   scss       = require('gulp-sass')
,   mbf        = require('main-bower-files')
,   compass    = require('gulp-compass')
,   livereload = require('gulp-livereload')
,   sourcemaps = require('gulp-sourcemaps')
;

var onError = function (err) {
  gutil.beep();
  gutil.log(err);
};

gulp.task("build_coffee", function() {
  return gulp.src(['development/scripts/**/*.coffee', 'development/scripts/main.coffee'])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(concat('application.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/scripts'))
    .pipe(livereload({auto:false}));
});

gulp.task("build_compass", function() {
  gulp.src('development/styles/styles.scss')
  .pipe(plumber({errorHandler: onError}))
  .pipe(compass({
    project: __dirname,
    css: 'build/styles',
    sass: 'development/styles',
    sourcemap: true
  }))
  .pipe(gulp.dest('build/styles'))
  .pipe(livereload({auto:false}));
});

gulp.task("build_bower", function() {
  return gulp.src(mbf(), { base: 'bower_components'})
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/scripts'));
});

gulp.task("build_assets", function() {
  return gulp.src(['development/assets/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['build_assets', 'build_compass', 'build_coffee', 'build_bower']);

gulp.task("watch", function() {
  livereload.listen(); 
  watch('development/styles/**/*.scss', function() {
    gulp.start(['build_compass']);
  });

  watch('development/scripts/**/*.coffee', function() {
    gulp.start(['build_coffee']);
  });

  watch('development/assets/**/*', function() {
    gulp.start(['build_assets']);
  });

  gulp.start('build');
});
