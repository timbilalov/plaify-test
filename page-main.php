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

<?
require ('footer.php');
?>