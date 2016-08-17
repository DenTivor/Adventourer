var gulp   = require('gulp');
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sequence = require('gulp-sequence');


var paths = {
  js :   {src : ['src/scripts/*.js'],      dest : 'build/scripts' },
  jade : {src : ['src/jade/**/*.jade'],      dest : 'build' },
  sass : {src : ['src/styles/**/*.scss'],      dest : 'build/styles', target: 'src/styles/main.scss' },
  prodfiles : ["build/*.html", "build/scripts/*.js", "build/styles/*.css"],
  images: {src: ['src/images/*.*'],        dest : 'build/images'},
  video: {src: ['src/video/zagreby-intro.mp4'], dest : 'build/video'},
  fonts: {src: ['src/fonts/*.*'], dest : 'build/fonts'}
};


gulp.task('clean', function () {
  return gulp.src('build/*', {read: false})
  .pipe(clean({force: true}));
});


gulp.task('build', 
    sequence(
      'clean',
      'compile:jade',
      'compile:sass',
      'copy:js',
      'copy:images',
      'copy:fonts'
      // 'copy:video')
));  


gulp.task('serve',['build'], function(){
  console.log('Serve');

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['build'],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    files: paths.prodfiles
  });

  gulp.start('watch_source');
});


gulp.task('compile:jade', function() {
 
  gulp.src('./src/jade/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./build/'))
});


gulp.task('compile:sass', function () {
  return gulp.src(paths.sass.target)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.sass.dest));
});


gulp.task('watch_source', function () {
  gulp.watch(paths.jade.src, ['compile:jade']);
  gulp.watch(paths.sass.src, ['compile:sass']);
  gulp.watch(paths.js.src, ['copy:js']);
});


gulp.task('copy:js', function() {
  return gulp.src(paths.js.src)
   .pipe(gulp.dest(paths.js.dest));
});


gulp.task('copy:images', function() {
  return gulp.src(paths.images.src)
   .pipe(gulp.dest(paths.images.dest));
});


gulp.task('copy:video', function() {
  return gulp.src(paths.video.src)
   .pipe(gulp.dest(paths.video.dest));
});


gulp.task('copy:fonts', function() {
  return gulp.src(paths.fonts.src)
   .pipe(gulp.dest(paths.fonts.dest));
});