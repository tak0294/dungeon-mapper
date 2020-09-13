const glob       = require('glob');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');

const path = {
  dstDir: './dist/assets/js',
  srcDir: './src/js/**/*.js',
  vendorSrcDir: './src/js/_vendor/**/*.js',
  rmSrcDir: '!./src/js/**/_*.js'
}

gulp.task('babel', function(callback) {

    const jsFiles = glob.sync( './src/js/{!(_)*.js,**/!(_)*/!(_)*.js}' );

    if (jsFiles.length === 0) {
        callback();
    }

    // タスクの終了を通知
    var task_num = jsFiles.length;
    var task_executed = 0;
    var onEnd = function () {
        task_executed++;
        console.log(task_executed + " / " + task_num);
        if (task_num === task_executed) {
            callback();
        }
    };

    jsFiles.forEach(function(file) {
        var fileName = file.replace(/.+\/(.+\.js)/, '$1');
        var filePath = file.replace(new RegExp('./src/(.*)/.+\.js'), '$1');
        console.log(fileName);
        browserify(file)
            .transform(babelify.configure({
                presets: ["@babel/env"],
                sourceType: "module"
            }))
            .bundle()
            .on('end', onEnd)
            .pipe(source(fileName))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(path.dstDir));
    });

});

gulp.task('vendor', function() {
    return gulp.src(path.vendorSrcDir)
        .pipe(gulp.dest(path.dstDir + '/vendor'));
});

gulp.task('babel:compress', function() {
    //nothing.
    return;
  return gulp.src([path.srcDir])
    .pipe(uglify())
    .pipe(gulp.dest(path.dstDir));
});
