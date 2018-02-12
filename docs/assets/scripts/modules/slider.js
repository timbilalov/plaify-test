app.createModule("slider", function() {
    var parent = document.querySelector(".js-slider");
    if (!parent) {
        return false;
    }

    // Локальные переменные
    var module = this;
    var dAttrSlide = "data-slide";
    var btns = parent.querySelectorAll(".js-btn");
    var slides = parent.querySelectorAll(".js-slide");
    var curClass = "is-current";
    var nextClass = "is-next";
    var prevClass = "is-prev";
    var currentSlideNum = 0;
    var slidesCount = slides.length;
    var arrProto = Array.prototype;


    // Методы

    var showSlide = function(slideNum, direction) {
        // По-умолчанию, функция может показать произвольный слайд.
        // Но, если есть всего лишь две кнопки, то можно передать "next" или "prev",
        // тогда будет автоматически определён текущий и следующий слайды.
        if (slideNum === "next" || slideNum === "prev" && arguments.length === 1) {
            direction = slideNum;
            if (direction === "next") {
                slideNum = currentSlideNum + 1;
                if (slideNum >= slidesCount) {
                    slideNum = 0;
                }
            } else if (direction === "prev") {
                slideNum = currentSlideNum - 1;
                if (slideNum < 0) {
                    slideNum = slidesCount - 1;
                }
            }

        } else {
            slideNum = parseInt(slideNum);
            if (isNaN(slideNum) || slideNum >= slidesCount || slideNum < 0 || slideNum === currentSlideNum) {
                return;
            }
        }

        // Если дошли до последнего слайда, то переходим к первому.
        var slideNumNext = slideNum + 1;
        if (slideNumNext >= slidesCount) {
            slideNumNext = 0;
        }

        // Если дошли до первого слайда, то переходим к последнему.
        var slideNumPrev = slideNum - 1;
        if (slideNumPrev < 0) {
            slideNumPrev = slidesCount - 1;
        }

        // Направление по-умолчанию.
        direction = direction || "next";
        DEBUG && console.log("[module slider] slideNumPrev: " + slideNumPrev + "; slideNum: " + slideNum + "; slideNumNext: " + slideNumNext + "; direction: " + direction);

        // Устанавливаем значение текущего слайда.
        currentSlideNum = slideNum;

        // В зависимости от направления перелистывания,
        // проставляется тот или иной класс
        // (соотв. анимациям прилёта слева либо справа).
        var cls = direction === "next" ? nextClass : prevClass;
        slides[slideNum].classList.add(cls);

        // Анимация задаётся в css, поэтому нужно некоторое время,
        // прежде чем задать слайду состояние current.
        // NOTE: Данное место - небольшая лазейка, где может сломаться приложение.
        // Для настоящего проекта, стоит лучше обрабатывать таймаут.
        var stop = function() {
            arrProto.forEach.call(slides, function(elem) {
                elem.classList.remove(curClass);
            });
            slides[slideNum].classList.remove(cls);
            slides[slideNum].classList.add(curClass);
        };

        // NOTE: В настоящем приложении можно было бы динамически определять
        // величину задержки (длительность css-анимации). Хотя, сама по себе,
        // это - дорогостоящая операция.
        var delay = 500;
        setTimeout(stop, delay);
    };

    var btnClick = function() {
        var direction = this.getAttribute(dAttrSlide);
        showSlide(direction);
    };


    // Бинды
    arrProto.forEach.call(btns, function(elem) {
        elem.addEventListener("click", btnClick);
    });

    // Проставляем активность первому слайду, чтобы слайдер
    // корректно отработал первые перелистывания.
    slides[currentSlideNum].classList.add(curClass);

    // Экспорт
    module.showSlide = showSlide;
});