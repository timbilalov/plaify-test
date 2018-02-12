/**
 * Общая точка входа
 * для события скролла страницы.
 *
 * NOTE: Контроллер будет передавать текущее значение скролла
 * каждой из переданных в данный модуль функций.
 */
app.createModule("windowScroll", function() {

    // Локальные переменные
    var module = this;
    var events = [];
    var enabled = false;


    /**
     * Основной обработчик,
     * который проходит по всем функциям из массива events
     * и выполняет их.
     */
    var scrollController = function() {
        if (!enabled) {
            return;
        }

        var y = document.body.scrollTop || document.documentElement.scrollTop;
        var f, i, len;
        for (i = 0, len = events.length; i < len; i++) {
            f = events[i];
            f.call(this, y);
        }
    };


    /**
     * Привязка события и контроллера.
     * Вынесено в отдельную функцию, так как если модулю не передана ни одна функция на событие "scroll"
     * то и общий обработчик вешать нет смысла.
     * Сделано для оптимизации производительности (небольшая прибавка).
     */
    var bind = function() {
        window.addEventListener("scroll", scrollController);
    };


    /**
     * Добавление переданной функции в массив всех функций,
     * которые будут вызваны при срабатывании события "scroll".
     *
     * @param {function} func
     */
    var addEvent = function(func) {
        if (typeof func !== "function") {
            return;
        }

        if (!enabled) {
            enabled = true;
            bind();
        }

        events.push(func);
        DEBUG && console.log("[module windowScroll] function added, count of functions to init now: " + events.length);
    };


    // Доступ к фукциям
    // текущего модуля
    module.addEvent = addEvent;
});