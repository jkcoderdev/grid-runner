<?php

function styles(...$files) {
    $html = '';

    foreach ($files as $file) {
        $html .= '<link rel="stylesheet" href="/css/' . $file . '.css?' . time() . '">';
    }

    echo $html;
}
