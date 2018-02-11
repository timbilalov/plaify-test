<section>
    <hr>

    <h5>Перелинковка страниц</h5>
    <table>
        <thead>
            <tr>
                <th>Страница</th>
                <th>Заголовок (определён автоматически)</th>
            </tr>
        </thead>
        <tbody>
        <?
            $pages = glob("page-*.php");
            foreach ($pages as $pg) {
                $href = substr($pg, strlen($docRoot));
                ?>
                <tr>
                    <td><a href="<?=$href?>"><?=$pg?></a></td>
                    <td>
                        <?
                            $pgHtml = getRenderedHTML($pg);
                            $pattern = "/<h1[^>]*>(.*?)<\/h1>/si";
                            preg_match_all($pattern, $pgHtml, $matches);
                            $h1Val = $matches[1][0];
                            if ($h1Val) {
                                $h1Val = trim((strip_tags($h1Val)));
                            } else {
                                $h1Val = "";
                            }
                            echo($h1Val);
                        ?>
                    </td>
                </tr>
                <?
            }
        ?>
        </tbody>
    </table>
</section>