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

<?
require ('footer.php');
?>