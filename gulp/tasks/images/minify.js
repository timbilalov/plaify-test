var gulp = require('gulp');
var config = require('../../config.js').images;
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var plumber = require('gulp-plumber');
var size = require('gulp-size');
var notify = require('gulp-notify');

var gulpif = require('gulp-if');
var fs = require('fs');

var condition = function(file) {
    if (fs.existsSync(config.cache + "/" + file.relative)) {
        return false;
    } else {
        console.log("Made a copy of original file: " + (config.cache + "/" + file.relative));
        return true;
    }
};

gulp.task('images:minify', function() {
    return gulp.src(config.minify, { base: "./" })
        .pipe(gulpif(condition, gulp.dest(config.cache)))
        .pipe(size({
            title: 'Raw raster images'
        }))
        .pipe(plumber({
            errorHandler: notify.onError("\nAn error occurred while minifying raster images.\nCheck console for details.\n <%= error.message %>")
        }))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(size({
            title: 'Compressed raster images'
        }))
        .pipe(gulp.dest("."));
});