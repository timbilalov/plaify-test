var gulp = require('gulp'),
    config = require('../../config').browserSync,
    browserSync = require('browser-sync');

gulp.task('utils:browserSync', function() {
    browserSync.init(config.params);
});