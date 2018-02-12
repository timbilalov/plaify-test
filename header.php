<?
// Some project options
$projectName = 'plaify-test';

// Debugging options
$serverName = $_SERVER['SERVER_NAME'];
$debug = $serverName == $projectName ? true : ($_COOKIE['debug'] == '1' || $_GET['debug'] == '1');
if ($_GET['debug'] == '0') { $debug = false; }

// Check for local server
$isLocal = ($serverName == $projectName) || (strpos($serverName, "localhost") !== false) || (strpos($serverName, "192.168") !== false) || (strpos($serverName, "10.42") !== false);

// Typograph
$useTypograph = true;

if ($debug) {
    $useTypograph = false;
}

// Set assets build path
if ($debug) {
    $buildDest = "/assets/build/dev/";
} else {
    $buildDest = "/assets/build/prod/";
}

require_once "functions.php";
?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><? if ($debug) { echo "[debug] ";} ?><?=$projectName?></title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--[if lte IE 8]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
    <![endif]-->

    <? // Main styles ?>
    <? if ($debug) { ?>
    <link rel="stylesheet" href="<?=$buildDest?>project.dev.css?<?php echo filemtime($_SERVER['DOCUMENT_ROOT'].$buildDest.'project.dev.css'); ?>" media="all" />
    <? } else { ?>
    <link rel="stylesheet" href="<?=$buildDest?>project.min.css?<?php echo filemtime($_SERVER['DOCUMENT_ROOT'].$buildDest.'project.min.css'); ?>" media="all" />
    <? } ?>
</head>

<body>
    <div class="l-wrapper">
        <?
        if ($useTypograph) {
            require_once($_SERVER['DOCUMENT_ROOT'] . '/assets/typograph/EMT.php');
            $typograph = new EMTypograph();

            // настройки
            $options = array(
                'Text.paragraphs'=>'off',
                'Text.breakline'=>'off',
                'OptAlign.oa_oquote'=>'off',

                'Nobr.phone_builder'=>'off',
                'Number.thinsp_between_no_and_number'=>'off',
                'Number.thinsp_between_number_triads'=>'off',
                'Nobr.spaces_nobr_in_surname_abbr'=>'off',

                'Symbol.arrows_symbols'=> 'off',
            );
            $typograph->setup($options);

            ob_start();
        }
        ?>

        <?php
        // Warning bar for users with disabled JS
        ?>
        <noscript class="noscript-bar">
            <!--<noindex>-->
                <input type="checkbox" id="noscript-checkbox" class="noscript-bar__checkbox">
                <div class="noscript-bar__content">
                    <div class="l-container">
                        <div class="noscript-bar__cols">
                            <div class="noscript-bar__col">Для наиболее комфортного просмотра сайта, включите, пожалуйста, JavaScript в настройках браузера</div>
                            <div class="noscript-bar__col">
                                <label for="noscript-checkbox" title="Закрыть">
                                    <?
                                    echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/assets/svg/sprite/close.svg');
                                    ?>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            <!--</noindex>-->
        </noscript>


        <header class="l-header page-header">
            <div class="page-header__container">
                <div class="page-header__content">
                    <div class="page-header__top-row">
                        <a <? if ($page != "main") echo 'href="/"'; ?> class="page-header__block page-header__logo">
                            <svg class="svg-icon">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-temp-html5"></use>
                            </svg>

                            <span class="g-vam">Logo here</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div class="l-content">
            <? if (!$rawContainer) { ?>
            <div class="l-container">
            <? } ?>