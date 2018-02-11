var gulp = require('gulp');
var config = require('../../config.js').scripts;
var concat = require('gulp-concat');
var size = require('gulp-size');
var uglify = require("gulp-uglify");
var count = require('gulp-count');
var sourcemaps = require('gulp-sourcemaps');


gulp.task("scripts:compile--pre", function() {
    var filesToConcat = config.toConcat;

    return gulp.src(filesToConcat)
        .pipe(sourcemaps.init())
        .pipe(count("Compiling ## files"))
        .pipe(size({
            showFiles: false,
            title: "Raw"
        }))
        .pipe(size({
            showFiles: false,
            title: "Raw",
            gzip: true
        }))
        .pipe(concat(config.nameProd))
        .pipe(uglify({
            compress: {
                global_defs: {
                    DEBUG: 0
                }
            }
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.compileDest));
});

gulp.task("scripts:compile", ["scripts:compile--pre"], function() {
    return gulp.src(config.compileDest + "/" + config.nameProd)
        .pipe(size({
            title: "Compressed and minified"
        }))
        .pipe(size({
            title: "Compressed and minified",
            gzip: true
        }));
});