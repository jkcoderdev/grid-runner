<?php

function scripts(...$files) {
    $html = '';

    foreach ($files as $file) {
        $html .= '<script defer src="/js/' . $file . '.js?' . time() . '"></script>';
    }

    echo $html;
}
