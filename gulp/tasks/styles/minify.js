var gulp = require('gulp');
var config = require('../../config.js').styles;
var csso = require('gulp-csso');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var size = require('gulp-size');
var reload = require('browser-sync').reload;
var rename = require("gulp-rename");
var replace = require('gulp-replace');

gulp.task('styles:minify', function() {
    var src = config.dest + "/" + config.nameDev;

    return gulp.src(src)
        .pipe(size({
            title: 'Raw'
        }))
        .pipe(size({
            showFiles: false,
            title: "Raw",
            gzip: true
        }))
        .pipe(plumber({
            errorHandler: notify.onError("\nAn error occurred while compressing css.\nCheck console for details.\n <%= error.message %>")
        }))
        .pipe(csso({
            // CHANGED: Из-за структурных оптимизаций как минимум на одном проекте
            // побилась вёрстка! И отловить это было сложно. Лучше не рисковать впредь.
            restructure: false
        }))
        .pipe(rename(config.nameProd))
        .pipe(replace("/build/dev/", "/build/prod/"))
        .pipe(size({
            title: 'Minified'
        }))
        .pipe(size({
            showFiles: false,
            title: "Minified",
            gzip: true
        }))
        .pipe(gulp.dest(config.destProd))
        .pipe(reload({
            stream: true
        }));
});
