var gulp = require("gulp");
var config = require("../../config.js").scripts;
var eslint = require("gulp-eslint");
var gulpif = require("gulp-if");
var notifier = require('node-notifier');
var fs = require('fs');


// All possible lint options
// could be found at:
// http://eslint.org/docs/rules/
// http://eslint.org/docs/user-guide/configuring
var eslintrc = config.eslintrc;
var modulesPath = config.modulesPath;


gulp.task("scripts:lint", function() {
    var failedFilesCount = 0;
    var notifyErrors = function(errCount, warnCount) {
        notifier.notify({
            title: "ESLint",
            message: "ESLint found " + errCount + " errors and " + warnCount + " warnings in " + failedFilesCount + " file(s). Check console for details."
        });
    };

    var getExtension = function(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    var condition = function(file) {
        var filePath = file.path;
        var csFilePath = filePath.substring(0, filePath.length - getExtension(filePath).length) + ".coffee";

        if (fs.existsSync(csFilePath)) {
            return false;
        } else {
            return true;
        }
    };

    return gulp.src(config.lint)
        .pipe(gulpif(condition, eslint({
            rulePaths: [
                config.rulePaths
            ],
            configFile: eslintrc

        // Для файлов, сгенерённых языком CoffeeScript,
        // необходимо вырубить некоторые правила,
        // так как нет возможности задать определённое форматирование
        // при компиляции в js.
        }), eslint({
            rulePaths: [
                config.rulePaths
            ],
            configFile: eslintrc,
            rules: {
                "indent": 0
            },
        })))
        .pipe(eslint.format())
        .pipe(eslint.result(function(result) {
            if (result.errorCount > 0 || result.warningCount > 0) {
                failedFilesCount++;
            }
        }))
        .pipe(eslint.results(function(results) {
            var errCount = results.errorCount;
            var warnCount = results.warningCount;
            if (errCount > 0 || warnCount > 0) {
                notifyErrors(errCount, warnCount);
            }
        }))
});