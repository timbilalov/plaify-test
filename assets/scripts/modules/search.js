app.createModule("search", function() {
    var parent = document.querySelector(".js-search");
    if (!parent) {
        return false;
    }

    // Локальные переменные
    var module = this;
    var genresFilter = parent.querySelector(".js-filter-genre");
    var nameFilter = parent.querySelector(".js-filter-name");
    var currentFilterName = null;
    var currentFilterGenre = null;
    var allGenres = [];
    var items = parent.querySelectorAll(".js-item");
    var itemsCount = items.length;
    var dAttrGenre = "data-genre";
    var hiddenClass = "g-hidden";
    var emptyMessageElem = parent.querySelector(".js-empty-message");
    var arrProto = Array.prototype;


    // Собираем все возможные значения жанров, чтобы проводить доп. проверки в функции setFilterGenre
    arrProto.forEach.call(genresFilter.querySelectorAll("option"), function(elem) {
        var genre = elem.value;
        if (genre !== "" && genre !== "null") {
            allGenres.push(genre);
        }
    });

    DEBUG && console.log("[module search] genres obtained: ", allGenres);


    // Методы
    // TODO: При необходимости, можно отрефакторить - две функции setFilterName и setFilterGenre похожи

    var setFilterName = function(name, changeInputVal) {
        changeInputVal = changeInputVal || true;
        var res;

        // Если передать функции "левое" значение, то сбрасываем поле поиска по названию
        if (typeof name !== "string" || (typeof name === "string" && name.trim() === "")) {
            res = null;

        } else {
            res = name;
        }

        currentFilterName = res;
        // Нужно, чтобы избежать пересечения двух событий:
        // пользователь сам ввёл данные, и когда отработала сама функция.
        // Без этого, возможна ситуация, когда функция будет рекурсивно вызывать саму себя,
        // при вводе данных пользователем на странице.
        if (changeInputVal) {
            nameFilter.value = res;
        }

        DEBUG && console.log("%c[module search] filter name set to: " + res, "color: #999");
        updateCollection();
    };

    var setFilterGenre = function(genre, changeInputVal) {
        changeInputVal = changeInputVal || true;
        var res;

        // Если передать функции "левый" жанр, которого нет в изначальном наборе,
        // то прерываем функцию. В противном случае, в поле селекта "жанр" установится
        // пустое (не то, которое по дефолту) значение, и это не айс.
        if (genre && !(typeof genre === "string" && (genre.trim() === "null" || genre.trim() === "")) && allGenres.indexOf(genre) < 0) {
            return;
        }

        // Если передать пустую строку или null, то будет выбран пункт по-умолчанию.
        if (typeof genre !== "string" || (typeof genre === "string" && (genre.trim() === "null" || genre.trim() === ""))) {
            res = null;
        } else {
            res = genre;
        }

        currentFilterGenre = res;
        // Нужно, чтобы избежать пересечения двух событий:
        // пользователь сам ввёл данные, и когда отработала сама функция.
        // Без этого, возможна ситуация, когда функция будет рекурсивно вызывать саму себя,
        // при вводе данных пользователем на странице.
        if (changeInputVal) {
            genresFilter.value = res;
        }

        DEBUG && console.log("%c[module search] filter genre set to: " + res, "color: #999");
        updateCollection();
    };

    var updateCollection = function() {
        var shownItemsCount = 0;

        // Проходимся по всем экземплярам из коллекции.
        arrProto.forEach.call(items, function(elem) {
            var elemName = elem.querySelector(".js-name").textContent;
            var elemGenres = elem.getAttribute(dAttrGenre).split(",");

            // Определяем, задана ли фильтрация по названию, и, если да,
            // содержится ли строка в названии экземпляра коллекции.
            var testFilterName = true;
            if (currentFilterName !== null && typeof currentFilterName === "string") {
                testFilterName = new RegExp(currentFilterName, "gi").test(elemName);
            }

            // Определяем, задана ли фильтрация по жанру, и, если да,
            // соответствует ли жанр экземпляра коллекции тому, по которому идёт фильтрация.
            var testFilterGenre = true;
            if (currentFilterGenre !== null && typeof currentFilterGenre === "string") {
                testFilterGenre = elemGenres.indexOf(currentFilterGenre) >= 0;
            }

            // Если обе проверки дают положительный результат,
            // то отображаем данный элемент. В противном случае, скрываем его.
            if (testFilterName && testFilterGenre) {
                elem.classList.remove(hiddenClass);
                shownItemsCount++;
            } else {
                elem.classList.add(hiddenClass);
            }
        });

        // Если ни один экземпляр не проходит фильтрацию, то показываем
        // сообщение "не найдено".
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


    // Бинды
    nameFilter.addEventListener("input", app.utils.debouncer(filterNameController, 200));
    genresFilter.addEventListener("change", filterGenreController);


    // Экспорт
    module.setFilterName = setFilterName;
    module.setFilterGenre = setFilterGenre;
});