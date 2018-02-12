app.createModule("tabs", function() {
    var parent = document.querySelector(".js-tabs");
    if (!parent) {
        return false;
    }

    // Local variables

    var module = this;
    var dAttrTabNumber = "data-tab";
    var btns = parent.querySelectorAll(".js-btn");
    var contentElems = parent.querySelectorAll(".js-content");
    var hiddenClass = "g-hidden";
    var tabNumbersArray = [];
    var activeClass = "is-active";
    var preparingClass = "is-preparing";

    if (contentElems.length !== btns.length) {
        DEBUG && console.log("%c[module tabs] btns count != content conut. check your markup!", "color: red");
        return false;
    }

    Array.prototype.forEach.call(btns, function(elem) {
        tabNumbersArray.push(parseInt(elem.getAttribute(dAttrTabNumber)));
    });


    // Checks

    var k = 0;
    Array.prototype.forEach.call(contentElems, function(elem) {
        var tabNumber = parseInt(elem.getAttribute(dAttrTabNumber));
        if (tabNumbersArray.indexOf(tabNumber) < 0) {
            k++;
        }
    });

    if (k > 0) {
        DEBUG && console.log("%c[module tabs] wrong data-attributes. check your markup!", "color: red");
        return false;
    }


    // Methods

    var hideAllTabs = function() {
        Array.prototype.forEach.call(contentElems, function(elem) {
            elem.classList.add(hiddenClass);
        });

        Array.prototype.forEach.call(btns, function(elem) {
            elem.classList.remove(activeClass);
        });
    };

    var showTab = function(tabNumber) {
        tabNumber = parseInt(tabNumber);
        if (isNaN(tabNumber) || tabNumbersArray.indexOf(tabNumber) < 0) {
            return;
        }

        var contentToShow = Array.prototype.filter.call(contentElems, function(elem) {
            return parseInt(elem.getAttribute(dAttrTabNumber)) === tabNumber;
        })[0];

        var activeBtn = Array.prototype.filter.call(btns, function(elem) {
            return parseInt(elem.getAttribute(dAttrTabNumber)) === tabNumber;
        })[0];

        hideAllTabs();
        contentToShow.classList.remove(hiddenClass);
        activeBtn.classList.add(activeClass);
    };

    var btnClick = function() {
        var tabNumber = this.getAttribute(dAttrTabNumber);
        showTab(tabNumber);
    };


    // Binds
    Array.prototype.forEach.call(btns, function(elem) {
        elem.addEventListener("click", btnClick);
    });


    // Init
    parent.classList.remove(preparingClass);
    showTab(tabNumbersArray[0]);


    // Export
    module.showTab = showTab;
});