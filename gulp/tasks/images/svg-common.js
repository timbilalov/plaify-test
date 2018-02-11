var gulp = require('gulp');
var reload = require('browser-sync').reload;
var runSequence = require('run-sequence');

gulp.task('images:svg-common', ['images:svg-sprite-compile'], function() {
    runSequence('images:svg-sprite-minify', ['images:svg-sprite-to-js'], reload);
});