const gulp = require('gulp');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('build:scss', function() {

   const plugins = [
     autoprefixer(),
     cssnano()
   ]

  return gulp.src('./src/scss/**/*.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist/assets/css/'));
});

gulp.task('watch:scss', function() {

  const plugins = [
    autoprefixer()
  ]

 return gulp.src('./src/scss/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(scss().on('error', scss.logError))
   .pipe(postcss(plugins))
   .pipe(sourcemaps.write('./maps/'))
   .pipe(gulp.dest('./dist/assets/css/'));
});
