<?php

function redirect($path) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] === 443) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];

    $url = $protocol . $host . '/' . trim($path, '/');

    header('Location: ' . $url);
    exit();
}
