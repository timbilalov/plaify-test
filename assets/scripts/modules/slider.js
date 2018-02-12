app.createModule("slider", function() {
    var parent = document.querySelector(".js-slider");
    if (!parent) {
        return false;
    }

    // Local variables

    var module = this;
    var dAttrSlide = "data-slide";
    var btns = parent.querySelectorAll(".js-btn");
    var slides = parent.querySelectorAll(".js-slide");
    var curClass = "is-current";
    var nextClass = "is-next";
    var prevClass = "is-prev";
    var currentSlideNum = 0;
    var slidesCount = slides.length;


    // Methods

    var showSlide = function(slideNum, direction) {
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

        slideNumNext = slideNum + 1;
        if (slideNumNext >= slidesCount) {
            slideNumNext = 0;
        }

        slideNumPrev = slideNum - 1;
        if (slideNumPrev < 0) {
            slideNumPrev = slidesCount - 1;
        }

        direction = direction || "next";
        DEBUG && console.log("[module slider] slideNumPrev: " + slideNumPrev + "; slideNum: " + slideNum + "; slideNumNext: " + slideNumNext + "; direction: " + direction);
        currentSlideNum = slideNum;

        var cls = direction === "next" ? nextClass : prevClass;
        slides[slideNum].classList.add(cls);

        var stop = function() {
            Array.prototype.forEach.call(slides, function(elem) {
                elem.classList.remove(curClass);
            });
            slides[slideNum].classList.remove(cls);
            slides[slideNum].classList.add(curClass);
        };

        setTimeout(stop, 500);
    };

    var btnClick = function() {
        var direction = this.getAttribute(dAttrSlide);
        showSlide(direction);
    };

    // Binds
    Array.prototype.forEach.call(btns, function(elem) {
        elem.addEventListener("click", btnClick);
    });

    // Init
    slides[currentSlideNum].classList.add(curClass)

    // Export
    module.showSlide = showSlide;
});