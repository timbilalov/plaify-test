// https://github.com/rossPatton/stylint
// https://github.com/danielhusar/gulp-stylint

var gulp = require('gulp');
var config = require('../../config.js').styles;
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var stylint = require('gulp-stylint');
var stylintrc = config.stylintrc;

gulp.task('styles:lint', function() {

    var failedFilesCount = 0;
    var condition = function(file) {
        var fileStylint = file.stylint;
        if (fileStylint && (fileStylint.errors || fileStylint.warnings)) {
            failedFilesCount++;
            return true;
        } else {
            return false;
        }
    }

    return gulp.src(config.lintFiles)
        .pipe(plumber({
            errorHandler: notify.onError("\nAn error occurred while linting css.\nCheck console for details.\n <%= error.message %>")
        }))
        .pipe(stylint({
            config: stylintrc
        }))
        .pipe(stylint.reporter())
        .pipe(gulpif(condition, notify({
            message: function() { return "Stylint found errors or warnings in " + failedFilesCount + " file(s). Check console for details."; },
            onLast: true
        })));
});
