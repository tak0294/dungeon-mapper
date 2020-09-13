const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const changed = require('gulp-changed');

const paths = {
  srcDir : './src/img',
  dstDir : './dist/virtual-exhibition/assets/img'
}

gulp.task('imagemin', function(){
  const srcGlob = paths.srcDir + '/**/*.{png,jpg,gif,svg}';
  const dstGlob = paths.dstDir;
  const options = [
    pngquant({
      quality: '65-80',
    }),
    mozjpeg({
      quality: 80,
    }),
    imagemin.svgo(),
    imagemin.optipng(),
    imagemin.gifsicle()
  ]

  return gulp.src(srcGlob)
    .pipe(changed(dstGlob))
    .pipe(imagemin(options))
    .pipe(gulp.dest(dstGlob));
});