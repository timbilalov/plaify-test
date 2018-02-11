var gulp = require('gulp');
var config = require('./gulp/config.js');
var requireDir = require('require-dir');
var reload = require('browser-sync').reload;
var runSequence = require('run-sequence');
var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });


// Default task.
// Run it for development.
gulp.task('default', function(cb) {
    runSequence(
        'build:dev',
        'watch',
        'utils:browserSync',
        cb
    );
});

gulp.task('build:dev', function(cb) {
    runSequence(
        'images:make-sprite',
        'images:svg-common',
        'styles:compile',
        cb
    );
});

gulp.task('watch', function() {
    gulp.watch(config.sprites.watch, ['images:make-sprite'], reload);
    gulp.watch(config.svg.watch, ['images:svg-common']);
    gulp.watch(config.styles.watch, ['styles:compile']);
    gulp.watch(config.scripts.watch).on("change", reload);
    gulp.watch(config.php.watch).on("change", reload);
});



// Build task (without image minifying)
gulp.task('build', function(cb) {
    environments.current(production);

    runSequence(
        'images:make-sprite', 'images:svg-common',

        'styles:lint',
        'styles:compile',
        'styles:minify',

        'scripts:compile',
        'scripts:lint',

        'utils:last-update',

        cb
    );
});

// Build task (with image minifying)
gulp.task('build:full', function(cb) {
    environments.current(production);

    runSequence(
        'images:make-sprite', 'images:svg-common',
        ['images:minify'],

        'styles:lint',
        'styles:compile',
        'styles:minify',

        'scripts:compile',
        'scripts:lint',

        'utils:last-update',

        cb
    );
});