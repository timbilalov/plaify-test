var gulp = require('gulp');
var config = require('../../config.js').updateFiles;
var fs = require('fs');
var dateFormat = require('dateformat');

gulp.task('utils:last-update', function() {
    var template = config.template;
    var templateConst = template.substring(0, template.indexOf("{{"));
    var templateDateFormat = template.match(/\{\{(.+)\}\}/)[1];
    var today = dateFormat(new Date(), templateDateFormat);

    var checkAndWrite = function(file) {
        if (!file) {
            return;
        }

        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }

            var lines = data.split('\n');
            var line, i, newLine;

            for (i = 0; i < lines.length; i++) {
                line = lines[i];
                if (line.indexOf(templateConst) < 0) {
                    continue;
                }

                newLine = template.replace(/\{\{.+\}\}/, today);
                lines[i] = newLine;
            }

            newData = lines.join('\n');

            if (newData != data) {
                fs.writeFile(file, newData, function() {
                    console.log("'" + newLine + "' added to file: " + file);
                });
            }
        });
    };


    if (config.src.length) {
        for (var i = 0; i < config.src.length; i++) {
            checkAndWrite(config.src[i]);
        }

    } else if (typeof config.src == "string") {
        checkAndWrite(config.src);
    }
});
