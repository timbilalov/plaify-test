var gulp = require('gulp');
var config = require('../../config.js').styles;
var stylus = require('gulp-stylus');
var rupture = require('rupture');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var bs = require('browser-sync');
var reload = bs.reload;
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');

var postProcessors = [
    autoprefixer({
        browsers: config.browers
    })
];

gulp.task('styles:compile', function() {
    return gulp.src(config.src)
        .pipe(plumber({
            errorHandler: notify.onError("\nAn error occurred while compiling css.\nCheck console for details.\n <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(stylus({
            url: {
                name: 'inline-url',
                // limit: false,
                paths: ['.'],
            },
            'include css': true,
            use: [rupture()]
        }))
        .pipe(postcss(postProcessors))
        .pipe(rename("project.dev.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.dest))
        .pipe(bs.stream({match: "**/*.css"}));
});
