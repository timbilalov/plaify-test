app.createModule("tabs", function() {
    var parent = document.querySelector(".js-tabs");
    if (!parent) {
        return false;
    }

    // Локальные переменные
    var module = this;
    var dAttrTabNumber = "data-tab";
    var btns = parent.querySelectorAll(".js-btn");
    var contentElems = parent.querySelectorAll(".js-content");
    var hiddenClass = "g-hidden";
    var tabNumbersArray = [];
    var activeClass = "is-active";
    var preparingClass = "is-preparing";
    var arrProto = Array.prototype;

    // Проверка, совпадает ли количество табов и кнопок-переключателей.
    if (contentElems.length !== btns.length) {
        DEBUG && console.log("%c[module tabs] btns count != content conut. check your markup!", "color: red");
        return false;
    }

    arrProto.forEach.call(btns, function(elem) {
        tabNumbersArray.push(parseInt(elem.getAttribute(dAttrTabNumber)));
    });

    // Проверка, для всех ли табов есть подходящая кнопка, которая его раскроет.
    var k = 0;
    arrProto.forEach.call(contentElems, function(elem) {
        var tabNumber = parseInt(elem.getAttribute(dAttrTabNumber));
        if (tabNumbersArray.indexOf(tabNumber) < 0) {
            k++;
        }
    });

    if (k > 0) {
        DEBUG && console.log("%c[module tabs] wrong data-attributes. check your markup!", "color: red");
        return false;
    }


    // Методы

    var hideAllTabs = function() {
        arrProto.forEach.call(contentElems, function(elem) {
            elem.classList.add(hiddenClass);
        });

        arrProto.forEach.call(btns, function(elem) {
            elem.classList.remove(activeClass);
        });
    };

    var showTab = function(tabNumber) {
        tabNumber = parseInt(tabNumber);
        if (isNaN(tabNumber) || tabNumbersArray.indexOf(tabNumber) < 0) {
            return;
        }

        var contentToShow = arrProto.filter.call(contentElems, function(elem) {
            return parseInt(elem.getAttribute(dAttrTabNumber)) === tabNumber;
        })[0];

        var activeBtn = arrProto.filter.call(btns, function(elem) {
            return parseInt(elem.getAttribute(dAttrTabNumber)) === tabNumber;
        })[0];

        // Скрываем все табы, затем показываем один необходимый.
        hideAllTabs();
        contentToShow.classList.remove(hiddenClass);
        activeBtn.classList.add(activeClass);
    };

    var btnClick = function() {
        var tabNumber = this.getAttribute(dAttrTabNumber);
        showTab(tabNumber);
    };


    // Бинды
    arrProto.forEach.call(btns, function(elem) {
        elem.addEventListener("click", btnClick);
    });


    // Для того, чтобы корректно проставились все классы,
    // "открываем" первый таб.
    parent.classList.remove(preparingClass);
    showTab(tabNumbersArray[0]);


    // Экспорт
    module.showTab = showTab;
});