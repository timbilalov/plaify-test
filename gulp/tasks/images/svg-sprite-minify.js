var gulp = require('gulp');
var config = require('../../config.js').svg;
var plumber = require('gulp-plumber');
var size = require('gulp-size');
var notify = require('gulp-notify');
var svgmin = require('gulp-svgmin');
var rename = require("gulp-rename");

gulp.task('images:svg-sprite-minify', function() {
    return gulp.src(config.spriteDest + '/' + config.spriteName)
        .pipe(plumber({
            errorHandler: notify.onError("\nAn error occurred while SVG minifying.\nCheck console for details.\n <%= error.message %>")
        }))
        .pipe(size({
            title: "Raw SVG sprite"
        }))
        .pipe(svgmin({
            plugins: [{
                removeHiddenElems: false
            }, {
                removeUselessDefs: false
            }, {
                cleanupAttrs: false
            }, {
                cleanupIDs: false
            }]
        }))
        .pipe(size({
            title: "Compressed SVG sprite"
        }))
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(config.spriteDest));
});
