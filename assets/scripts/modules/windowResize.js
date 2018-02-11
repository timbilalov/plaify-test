/**
 * Общая точка входа
 * для события изменения размеров экрана.
 *
 * NOTE: Событие на практике происходит редко
 * (например, поворот планшета или телефона, или равзернуть окно на полный экран на десктопе),
 * поэтому мы будем "выполнять" его с помощью debouncer
 * (отложенное выполнение).
 */
app.createModule("windowResize", function() {

    // Локальные переменные
    var module = this;
    var events = [];


    /**
     * Основной обработчик,
     * который проходит по всем функциям из массива events
     * и выполняет их.
     *
     * Вызываем обработчик через debouncer (задержка по выполнению),
     * чтобы функции из массива не вызывались слишком часто.
     */
    var resizeController = app.utils.debouncer(function() {
        if (!events.length) {
            return;
        }

        var f, i, len;
        for (i = 0, len = events.length; i < len; i++) {
            f = events[i];
            f();
        }
    });


    /**
     * Добавление переданной функции в массив всех функций,
     * которые будут вызваны при срабатывании события "resize" окна браузера.
     *
     * @param {function} func
     */
    var addEvent = function(func) {
        if (typeof func !== "function") {
            return;
        }

        events.push(func);
        DEBUG && console.log("[module windowResize] function added, count of functions to init now: " + events.length);
    };


    // Привязка события и обработчика
    window.addEventListener("resize", resizeController);


    // Доступ к фукциям
    // текущего модуля
    module.addEvent = addEvent;
});