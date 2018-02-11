var gulp = require('gulp');
var config = require('../../config').svg;
var svgSymbols = require('gulp-svg-symbols');
var gulpif = require('gulp-if');
var path = require('path');

gulp.task('images:svg-sprite-compile', function() {
    return gulp.src(config.spriteSrc)
        .pipe(svgSymbols({
            title: false,
            id: 'svg-%f',
            class: '%f',
            templates: [
                path.join(__dirname, '../utils/svg-template.styl'),
                'default-svg'
            ]
        }))
        .pipe(gulpif(/[.]svg$/, gulp.dest(config.spriteDest)))
        .pipe(gulpif(/[.]styl$/, gulp.dest(config.mapDest)));
});