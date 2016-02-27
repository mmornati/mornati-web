var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var minify = require('gulp-minify-css');
var inject = require('gulp-inject');
var es = require('event-stream');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function(){
  gulp.src(['src/css/**/*.css'])
        .pipe(minify({keepBreaks: true}))
        .pipe(concat('mornati.min.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('mornati.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', ['scripts', 'styles', 'images'], function() {
  gulp.src('./src/index.html')
  .pipe(inject(es.merge(
    gulp.src('./dist/css/*.min.css', {read: false}),
    gulp.src('./dist/js/*.min.js', {read: false})
  ), { ignorePath: 'dist/', addRootSlash: false}))
  .pipe(gulp.dest('./dist'));
});

gulp.task('dist', ['scripts', 'styles', 'images', 'html']);

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/css/**/*.scss", ['styles']);
  gulp.watch("src/js/**/*.js", ['scripts']);
  gulp.watch("src/*.html", ['bs-reload']);
});
