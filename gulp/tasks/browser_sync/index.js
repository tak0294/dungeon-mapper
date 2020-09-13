const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const webserver = require('gulp-webserver');
const requireDir = require('require-dir');

requireDir('../../tasks', {
  recurse: true
});


gulp.task('browser-sync', function() {

  browserSync.init({
    server: './dist',
  });

  gulp.watch('./src/pug/**/*.pug', gulp.series('watch:pug'));
  gulp.watch('dist/index.html').on('change', browserSync.reload);

  gulp.watch('./src/**/*.scss', gulp.series('watch:scss'));
  gulp.watch('dist/css/style.css').on('change', browserSync.reload);

  gulp.watch('./src/js/**/*.js', gulp.series('babel'));
  gulp.watch('dist/js/babel.js').on('change', browserSync.reload);
});


// gulp.task("browser-sync", function() {
//   return gulp.src('dist')
//       .pipe(webserver({
//         livereload: false,
//         open: true
//       }));
// });
