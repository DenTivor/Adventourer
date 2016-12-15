var gulp   = require('gulp');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var pug = require('gulp-pug');
var styl = require('gulp-stylus');


var paths = {
  js :   {src : ['src/scripts/*.js'],      dest : 'build/scripts' },
  pug : {src : ['src/pug/**/*.pug'],      dest : 'build' },
  styl : {src : ['src/styles/**/*.styl'],      dest : 'build/styles', target: 'src/styles/main.styl' },
  prodfiles : ["build/*.html", "build/scripts/*.js", "build/styles/*.css"],
  images: {src: ['src/images/*.*'],        dest : 'build/images'},
  video: {src: ['src/video/zagreby-intro.mp4'], dest : 'build/video'},
  fonts: {src: ['src/fonts/*.*'], dest : 'build/fonts'}
};


function handleError(err) {
    console.log('[\033[31mCritical\033[0m] Line '+err.lineNumber+' in '+err.message);
    this.emit('end');
}


gulp.task('clean', function () {
  return gulp.src('build/*', {read: false})
  .pipe(clean({force: true}));
});


gulp.task('build', 
    sequence(
      'clean',
      'compile:pug',
      'compile:styl',
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


gulp.task('compile:pug', function() {
 
  return gulp.src('./src/pug/*.pug')
    .pipe(pug({
      pretty: true
    }).on('error', handleError))
    .pipe(gulp.dest('./build/'))
});


gulp.task('compile:styl', function () {
  return gulp.src(paths.styl.target)
    .pipe(styl({
      paths:  ['/', 'bower_components', 'src/styles'] 
    }).on('error', handleError))
    .pipe(gulp.dest(paths.styl.dest));
});


gulp.task('watch_source', function () {
  gulp.watch(paths.pug.src, ['compile:complexpug']);
  gulp.watch(paths.styl.src, ['compile:styl']);
  gulp.watch(paths.js.src, ['copy:js']);
});


gulp.task('compile:complexpug',['compile:pug'], function() {
  browserSync.reload();
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