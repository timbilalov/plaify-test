<?
function getRenderedHTML($path) {
    ob_start();
    include($path);
    $var=ob_get_contents();
    ob_end_clean();
    return $var;
}


function isExternalUrl($url) {
    $serverName = $_SERVER["SERVER_NAME"];
    $serverName = str_replace("www.", "", $serverName);
    if (stristr($url, $serverName) || strpos($url, "/") !== 0 || strpos($url, "http") === 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * Подключает части верстки
 *
 * @param string $view - название подключаемой части, например articles, без окончания .php
 * @param array $vars - массив с параметрами
 */
function view($view = "", Array $vars = array())
{
    $file = $_SERVER['DOCUMENT_ROOT'] . '/include/views/' . $view . '.php';
    if (file_exists($file)) {
        extract($vars);
        require($file);
    } else {
        echo 'Часть ' . $view . ' не найдена.';
        die();
    }
}


/* This php function writes out Tim William's javascript for munging an email address
to make it hard for spammer harvestors to read it.
The original javascript is at http://www.u.arizona.edu/~trw/spam/
Feeling paranoid, I modified the version at phpbuilder.com to randomize the cipher
http://www.phpbuilder.com/snippet/detail.php?type=snippet&id=927
*/

function obfuscator($type, $address, $linkname = false, $additionalClass = false) {
    $cipherorig = "aZbcYXdeWVfUTghSiRQjklPmONnMoLpqKJrIHstGuFvEwDxCyBz1A234568790" ;
    $cipher = str_shuffle($cipherorig);
    $cipherlength = strlen($cipher) ;
    $addresslength = strlen($address) ;
    $shift = $addresslength ;

    for ($j=0; $j<$addresslength; $j++) {
        $nextchar = substr($address,$j,1) ;
        if (strpos($cipher,$nextchar)===false) {
            $coded .= substr($address,$j,1) ;
        } else {
            $chr = (strpos($cipher,$nextchar) + $shift) % $cipherlength ;
            $coded .= substr($cipher,$chr,1) ;
        }
    }

    echo
"<script type=\"text/javascript\">
    <!--
    // Obfuscator Script 2.1 by Tim Williams - freeware
    (function() {
        var coded = \"$coded\";
        var cipher = \"$cipher\";
        var shift = coded.length;
        var link=\"\";
        var ltr, i;
        for (i = 0; i < coded.length; i++) {
            if (cipher.indexOf(coded.charAt(i)) == -1) {
                ltr = coded.charAt(i);
                link += ltr;
            } else {
                ltr = (cipher.indexOf(coded.charAt(i)) - shift + cipher.length) % cipher.length;
                link += cipher.charAt(ltr)
            }
        }
        document.write(\"<a href=\'$type\"+link+\"\'".($additionalClass ? ' class=\''.$additionalClass.'\'' : '').">".(!$linkname ? '"+link+"' : $linkname)."</a>\");
    })();
    //-->
</script>
";

}

?>