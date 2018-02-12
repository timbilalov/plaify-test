<?
require_once ('header.php');
?>

<section class="js-tabs tabs is-preparing">
    <nav class="tabs__nav">
        <a role="button" class="js-btn tabs__btn" data-tab="1">Таб 1</a>
        <a role="button" class="js-btn tabs__btn" data-tab="2">Таб 2</a>
        <a role="button" class="js-btn tabs__btn" data-tab="3">Таб 3</a>
    </nav>

    <div class="tabs__text">
        <div class="js-content tabs__content" data-tab="1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis libero iste cumque eligendi corporis aliquam. Molestiae asperiores autem id. Dicta!
        </div>

        <div class="js-content tabs__content" data-tab="2">
            Содержимое второго таба.
        </div>

        <div class="js-content tabs__content" data-tab="3">
            Содержимое третьего таба.<br/> Lorem ipsum dolor sit amet.
        </div>
    </div>
</section>

<hr>

<section class="js-slider slider">
    <div class="slider__wrapper">
        <a role="button" class="js-btn slider__btn slider__btn--prev" data-slide="prev"></a>
        <a role="button" class="js-btn slider__btn slider__btn--next" data-slide="next"></a>

        <div class="slider__container">
            <div class="js-slide slider__item" data-slide="1">
                <img src="/media/images/slider/item-1.jpg" alt="">
            </div>

            <div class="js-slide slider__item" data-slide="2">
                <img src="/media/images/slider/item-2.jpg" alt="">
            </div>

            <div class="js-slide slider__item" data-slide="3">
                <img src="/media/images/slider/item-3.jpg" alt="">
            </div>
        </div>
    </div>
</section>

<hr>

<section class="js-search form search">
    <div class="search__filters">
        <div class="search__col">
            <input type="search" placeholder="Введите название" class="js-filter-name">
        </div>

        <div class="search__col">
            <select class="js-filter-genre">
                <option value="null">Выберите жанр</option>
                <option value="гонки">Гонки</option>
                <option value="аркада">Аркада</option>
                <option value="стратегия">Стратегия</option>
                <option value="спорт">Спорт</option>
            </select>
        </div>
    </div>

    <div class="search__list">
        <div class="js-item search__item" data-genre="аркада">
            <div class="search__poster">
                <img src="/media/images/search/game-1.png" alt="">
            </div>

            <div class="search__text">
                <h2 class="js-name search__title">Pac-Man</h2>
                <p>Компьютерная игра в жанре аркада, разработанная компанией Namco и впервые вышедшая в 1980 году в Японии. До выхода «Pac-Man» большинство американских игр представляли собой космические шутеры, такие как «Space Invaders» или «Defender». «Pac-Man» же развил новый жанр игры — погони в лабиринте, не предполагающий насилия, а потому игра позиционировалась как для мальчиков, так и для девочек.</p>
            </div>
        </div>

        <div class="js-item search__item" data-genre="гонки,спорт">
            <div class="search__poster">
                <img src="/media/images/search/game-2.jpg" alt="">
            </div>

            <div class="search__text">
                <h2 class="js-name search__title">F1 2017</h2>
                <p>Это гоночная компьютерная игра, разработанная Codemasters, выпуск которой состоялся 25 августа 2017 года на платформах PlayStation 4, Xbox One и Windows.Игра основана на сезоне 2017 чемпионата Формулы-1.</p>
            </div>
        </div>

        <div class="js-item search__item" data-genre="спорт">
            <div class="search__poster">
                <img src="/media/images/search/game-3.jpg" alt="">
            </div>

            <div class="search__text">
                <h2 class="js-name search__title">FIFA 18</h2>
                <p>FIFA 18 — 25-я футбольная игра из серии игр FIFA, разработанная для платформ Windows, Nintendo Switch, PlayStation 4, PlayStation 3, Xbox One и Xbox 360. Игра выпущена компанией Electronic Arts 29 сентября 2017 года. Лицом игры является футболист мадридского «Реала» и сборной Португалии Криштиану Роналду.</p>
            </div>
        </div>

        <div class="js-item search__item" data-genre="гонки">
            <div class="search__poster">
                <img src="/media/images/search/game-4.jpg" alt="">
            </div>

            <div class="search__text">
                <h2 class="js-name search__title">Need for Speed: Payback</h2>
                <p>Видеоигра серии Need for Speed в жанре аркадного автосимулятора, разработанная студией Ghost Games. Игра выпущена 10 ноября 2017 года компанией Electronic Arts для консолей PlayStation 4 и Xbox One, а также для персональных компьютеров под управлением Windows. Официальным дистрибьютором на территории России выступила компания «СофтКлаб».</p>
            </div>
        </div>

        <div class="js-item search__item" data-genre="спорт">
            <div class="search__poster">
                <img src="/media/images/search/game-5.jpg" alt="">
            </div>

            <div class="search__text">
                <h2 class="js-name search__title">NBA 2K18</h2>
                <p>NBA 2K18 is a basketball simulation video game developed by Visual Concepts and published by 2K Sports. It is the 19th installment in the NBA 2K franchise and the successor to NBA 2K17. It was released in September 2017 for Microsoft Windows, Nintendo Switch, PlayStation 4, PlayStation 3, Xbox One, and Xbox 360.</p>
            </div>
        </div>
    </div>

    <div class="search__empty js-empty-message g-hidden">
        <img src="/media/images/search/empty.png" alt="">
        Игр не найдено
    </div>
</section>


<?
require ('footer.php');
?>