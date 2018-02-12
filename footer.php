            <? if (!$rawContainer) { ?>
            </div><? // end of .l-container ?>
            <? } ?>
        </div><? // end of .l-content ?>

        <footer class="l-footer page-footer">
            <div class="l-container page-footer__content">
                <div class="page-footer__block page-footer__copyright">
                    <a href="#" class="page-footer__logo"></a>
                    <span class="g-vam">
                        &copy;&nbsp;<?php
                            $copyYear = "2018";
                            if ($copyYear == Date("Y")) { echo '<span itemprop="copyrightYear">'.$copyYear.'</span>'; } else { echo $copyYear . "-" . '<span itemprop="copyrightYear">'.Date("Y").'</span>'; }
                        ?><br/>
                        <a href="https://vk.com/timbilalov" target="_blank" rel="nofollow">Тимур Билалов</a>
                    </span>
                </div>

                <div class="page-footer__block page-footer__creators">
                    Пишите<sup>*</sup>: <?obfuscator("mailto:", "t-moore@mail.ru")?>
                    <br/>
                    Звоните: <?obfuscator("tel:", "+7 926 133-30-10")?>

                    <br/><br/>
                    <small>* — предпочтительный вид связи</small>
                </div>
            </div>
        </footer>

        <? // SVG icons ?>
        <div id="svg-container" class="g-hidden"></div>

        <?
        if ($isLocal) { ?>
        <div class="g-hidden" id="js-server-local"></div>
        <? } ?>

        <?
        if ($debug) { ?>
        <div class="g-hidden" id="js-server-debug"></div>
        <? } ?>

        <?
        // Load scripts for debug
        if ($debug) { ?>
        <script src="/assets/build/dev/svg-sprite.js?<?php echo filemtime($_SERVER['DOCUMENT_ROOT'].'/assets/build/dev/svg-sprite.js'); ?>"></script>
        <script src="/assets/scripts/debug-flag-enabled.js"></script>
        <script src="/assets/scripts/app.js?<?php echo filemtime($_SERVER['DOCUMENT_ROOT'].'/assets/scripts/app.js'); ?>"></script>

        <?
        // Iterator method.
        // Because glob with GLOB_BRACE doesn't work properly on Windows
        $docRoot = rtrim($_SERVER["DOCUMENT_ROOT"], "/");
        $Directory = new RecursiveDirectoryIterator($docRoot.'/assets/scripts/modules/');
        $Iterator = new RecursiveIteratorIterator($Directory);
        $Regex = new RegexIterator($Iterator, '/^.+\.js$/i', RecursiveRegexIterator::GET_MATCH);
        foreach ($Regex as $path) {
            $realPath = realpath($path[0]);
            $realPath = str_replace('\\', '/', $realPath);
            $assetPath = substr($realPath, strlen($docRoot));
            echo '<script src="'.$assetPath.'?'.filemtime($realPath).'"></script>';
        }
        ?>

        <?
        // Production scripts
        } else { ?>
        <script src="<?=$buildDest?>project.min.js?<?php echo filemtime($_SERVER['DOCUMENT_ROOT'].$buildDest.'project.min.js'); ?>" defer></script>
        <? } ?>

    </div><? // end of .l-wrapper ?>
    <?
    // Main content ends here
    // ----------------------
    ?>
</body>
</html>