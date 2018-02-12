app.createModule("search", function() {
    var parent = document.querySelector(".js-search");
    if (!parent) {
        return false;
    }

    // Local variables
    var module = this;
    var genresFilter = parent.querySelector(".js-filter-genre");
    var nameFilter = parent.querySelector(".js-filter-name");
    var currentFilterName = currentFilterGenre = null;
    var allGenres = [];
    var items = parent.querySelectorAll(".js-item");
    var itemsCount = items.length;
    var dAttrGenre = "data-genre";
    var hiddenClass = "g-hidden";
    var emptyMessageElem = parent.querySelector(".js-empty-message");

    Array.prototype.forEach.call(genresFilter.querySelectorAll("option"), function(elem) {
        var genre = elem.value;
        if (genre !== "" && genre !== "null") {
            allGenres.push(genre);
        }
    });

    DEBUG && console.log("[module search] genres obtained: ", allGenres);


    // Methods

    var setFilterName = function(name, changeInputVal) {
        changeInputVal = changeInputVal || true;
        var res;

        if (typeof name !== "string" || (typeof name === "string" && name.trim() === "")) {
            res = null;
        } else {
            res = name;
        }

        currentFilterName = res;
        nameFilter.value = res;
        DEBUG && console.log("%c[module search] filter name set to: " + res, "color: #999");
        updateCollection();
    };

    var setFilterGenre = function(genre, changeInputVal) {
        changeInputVal = changeInputVal || true;
        var res;

        if (genre && !(typeof genre === "string" && (genre.trim() === "null" || genre.trim() === "")) && allGenres.indexOf(genre) < 0) {
            return;
        }

        if (typeof genre !== "string" || (typeof genre === "string" && (genre.trim() === "null" || genre.trim() === ""))) {
            res = null;
        } else {
            res = genre;
        }

        currentFilterGenre = res;
        genresFilter.value = res;
        DEBUG && console.log("%c[module search] filter genre set to: " + res, "color: #999");
        updateCollection();
    };

    var updateCollection = function() {
        var shownItemsCount = 0;

        Array.prototype.forEach.call(items, function(elem) {
            var elemName = elem.querySelector(".js-name").textContent;
            var elemGenres = elem.getAttribute(dAttrGenre).split(",");

            var testFilterName = true;
            if (currentFilterName !== null && typeof currentFilterName === "string") {
                testFilterName = new RegExp(currentFilterName, "gi").test(elemName);
            }

            var testFilterGenre = true;
            if (currentFilterGenre !== null && typeof currentFilterGenre === "string") {
                testFilterGenre = elemGenres.indexOf(currentFilterGenre) >= 0;
            }

            if (testFilterName && testFilterGenre) {
                elem.classList.remove(hiddenClass);
                shownItemsCount++;
            } else {
                elem.classList.add(hiddenClass);
            }
        });

        if (shownItemsCount === 0) {
            showEmptyMessage();
        } else {
            hideEmptyMessage();
        }

        DEBUG && console.log("[module search] currentFilterName: " + currentFilterName + "; currentFilterGenre: " + currentFilterGenre + ". " + shownItemsCount + " of " + itemsCount + " items shown");
    };

    var showEmptyMessage = function() {
        emptyMessageElem.classList.remove(hiddenClass);
    };

    var hideEmptyMessage = function() {
        emptyMessageElem.classList.add(hiddenClass);
    };

    var filterNameController = function() {
        var text = this.value;
        setFilterName(text, false);
    };

    var filterGenreController = function() {
        var genre = this.value;
        setFilterGenre(genre, false);
    };


    // Binds
    nameFilter.addEventListener("input", app.utils.debouncer(filterNameController, 200));
    genresFilter.addEventListener("change", filterGenreController);


    // Export
    module.updateCollection = updateCollection;
    module.setFilterName = setFilterName;
    module.setFilterGenre = setFilterGenre;
});