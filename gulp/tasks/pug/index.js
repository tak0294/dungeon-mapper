const gulp = require('gulp');
const pug = require('gulp-pug');

const path = {
  dstDir: './dist',
  srcDir: './src/pug/**/*.pug',
  rmSrcDir: '!./src/pug/**/_*.pug'
}

gulp.task('build:pug', function() {
  return gulp.src([path.srcDir, path.rmSrcDir])
    .pipe(pug())
    .pipe(gulp.dest(path.dstDir));
});

gulp.task('watch:pug', function() {

  const pugOptions = {
    pretty: true // 圧縮はしないでネスト上で出力
  };

  return gulp.src([path.srcDir, path.rmSrcDir])
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(path.dstDir))
})
