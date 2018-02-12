/**
 * Общая точка входа
 * для события полной загрузки страницы
 * (включая загрузку изображений, метрик и прочего).
 *
 * NOTE: Не путать с событием DOMContentLoaded
 * (оно же - $(document).ready(function() {...}) - в терминах jQuery).
 */
app.createModule("pageLoad", function() {

    // Локальные переменные
    var module = this;
    var events = [];
    var singleFunctionFired = false;
    var timeoutInit = 120;
    var timeoutDelta = 80;


    /**
     * Функция, которая сработает лишь один раз,
     * и будет означать полную загрузку страницы.
     */
    var singleLoadFunction = function() {
        var readyState = document.readyState;
        var func, timeoutCurrent;
        if ((readyState !== "complete" || singleFunctionFired) || !events.length) {
            return false;
        }

        DEBUG && console.log("%c[module pageLoad] window load event fired, count of functions to init: " + events.length + ", timeout for first func: " + timeoutInit + ", timeout delta for other: " + timeoutDelta, "color: purple");

        while (events.length > 0) {
            // Взять первый элемент массива,
            // и передать его в переменную.
            func = events.shift();

            // Будем запускать наши отложенные функции
            // через определённые промежутки времени, друг за другом с некоторым промежутком.
            // Мы уже знаем, что это функции,
            // поэтому доп. проверка не требуется.
            timeoutCurrent = timeoutCurrent ? timeoutCurrent + timeoutDelta : timeoutInit;
            setTimeout(func, timeoutCurrent);
        }

        singleFunctionFired = true;
        window.removeEventListener("load", singleLoadFunction);
        window.removeEventListener("ready", singleLoadFunction);
    };


    // Привязка собитий и функции-обработчика
    if (document.readyState === "complete") {
        singleLoadFunction();
    } else {
        window.addEventListener("load", singleLoadFunction);
        window.addEventListener("ready", singleLoadFunction);
    }


    /**
     * Добавление переданной функции в очередь на выполнение,
     * либо немедленное исполнение функции, если страница уже полностью загружена.
     *
     * @param {function} func
     */
    var addEvent = function(func) {
        if (typeof func !== "function") {
            return;
        }

        // Если страница ещё не загружена полность, то добавляем в очередь
        if (!singleFunctionFired) {
            events.push(func);
            DEBUG && console.log("[module pageLoad] function added, count of functions to init now: " + events.length);

        // Если уже загружена, то просто вызываем переданную функцию
        } else {
            DEBUG && console.log("[module pageLoad] firing function immediately, because window load event already fired");
            func();
        }
    };


    // Доступ к фукциям
    // текущего модуля
    module.addEvent = addEvent;
});