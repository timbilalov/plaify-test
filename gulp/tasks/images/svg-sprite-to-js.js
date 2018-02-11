var gulp = require('gulp');
var config = require('../../config.js').svg;
var fs = require('fs');
var mkdirp = require('mkdirp');
var getDirName = require("path").dirname;
var reload = require('browser-sync').reload;

var environments = require('gulp-environments');
var development = environments.development;
var production = environments.production;

function writeFile(path, contents, cb) {
    mkdirp(getDirName(path), function(err) {
        if (err) return cb(err);
        fs.writeFile(path, contents, cb);
    });
}

gulp.task('images:svg-sprite-to-js', function() {
    fs.readFile(config.fileToJs, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        // А что, если объединить два действия в одно ;)
        // var svgData = "var " + config.constName + " = '" + data.replace(/(\r\n|\n|\r)/gm, '') + "';";
        var svgData = 'document.getElementById(\'svg-container\').innerHTML = \'' + data.replace(/(\r\n|\n|\r)/gm, '') + '\';';

        var dest = production() ? config.jsStrDestProd : config.jsStrDest;
        writeFile(dest + "/" + config.jsFileName, svgData, reload);
    });
});
