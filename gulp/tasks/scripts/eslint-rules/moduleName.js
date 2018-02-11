/**
 * Правило, которое проверяет модули,
 * чтобы они назывались так же,
 * как любые другие переменные - camelCase или просто в одно строку,
 * но нельзя писать через дефис или использовать цифры в начале названия.
 * А также правило проверяет, чтобы название модуля совпадало
 * с названием файла этого модуля - это наши внутренние соглашения.
 *
 * Первоначальный код и сам подход к созданию собственных правил для eslint
 * взяты вот отсюда:
 * https://github.com/bahmutov/eslint-rules
 */
module.exports = function (context) {
    'use strict';

    var filenameAbs = context.getFilename();
    var src = require("fs").readFileSync(filenameAbs, "utf-8");
    var reg = new RegExp('app\\.createmodule\\("(.+?)"', 'i');
    var matches = reg.exec(src);

    if (matches && matches[1]) {
        var moduleName = matches[1];

        var filename = require("path").basename(filenameAbs);
        var filenameShort = filename.replace(/\.js$/i, "");
        var errMsgArr = [];

        if (/\W/i.test(moduleName) || /^\d+/i.test(moduleName)) {
            errMsgArr.push("contains wrong characters (digits or special chars)");
        }

        if (moduleName !== filenameShort) {
            errMsgArr.push("doesn't match file name (\"" + filename + "\")");
        }

        if (errMsgArr.length > 0) {
            context.report(
                {
                    loc: {
                        start: { line: 0 }
                    }
                },
                "module name \"" + moduleName + "\" " + errMsgArr.join(" and ")
            );
        }
    }

    return {};
};