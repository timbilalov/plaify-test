var gulp = require('gulp');
var config = require('../../config.js').sprites;
var spritesmith = require('gulp.spritesmith');
var fs = require('fs');
var path = require('path');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var reload = require('browser-sync').reload;

var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;


function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

gulp.task('images:make-sprite', function() {

    var spriteData = [],
        spriteDirs = getDirectories(config.src),
        timestamp = Date.now(),
        i;

    var dest = production() ? config.imgDestProd : config.imgDest;

    for (i = 0; i < spriteDirs.length; i++) {
        spriteData.push(gulp.src(config.src + spriteDirs[i] + '/*.png')
            .pipe(plumber({
                errorHandler: notify.onError("\nAn error occurred while making sprite.\nCheck console for details.\n <%= error.message %>")
            }))
            .pipe(
                spritesmith({
                    cssSpritesheetName: spriteDirs[i],
                    imgName: spriteDirs[i] + '-sprite.png',
                    imgPath: dest.replace("./", "/") + spriteDirs[i] + '-sprite.png?mt=' + timestamp,
                    cssFormat: 'stylus',
                    cssName: spriteDirs[i] + '-sprite.styl',
                    padding: 5,
                    cssTemplate: config.mapTemplate,
                    cssVarMap: function(sprite) {
                        sprite.name = 's-' + sprite.name;
                    }
                })
            )
        );

        spriteData[i].img
            .pipe(gulp.dest(production() ? config.imgDestProd : config.imgDest));

        // UPD. 26.06.2015 unfriend
        // Без такой ужасно выглядещей конструкции неправильно определялся момент завершения
        // данной задачи.
        // Спрайт по факту может делаться дольше, а задача завершается мгновенно.
        // Это плохо потому, в процессе задачи build оптимизация картинок (в т. ч. и спрайтов)
        // начинается до того, как спрайт физически создан. В итоге - после build - неоптимизированные спрайты.
        //
        // Возможно, эта конструкция не будет работать, если папок спрайтов несколько.
        // Необходимы доп. проверки + возможно, есть более оптимальное решение.
        if (i == spriteDirs.length - 1) {
            return spriteData[i].css.pipe(gulp.dest(config.mapDest));
        } else {
            spriteData[i].css.pipe(gulp.dest(config.mapDest));
        }
    }

});
