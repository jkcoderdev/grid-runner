<?php

$config = [];

$config_files = scandir(__DIR__ . '/../../config/');
foreach ($config_files as $file) {
    if (is_file(__DIR__ . '/../../config/' . $file) && pathinfo($file, PATHINFO_EXTENSION) == 'php') {
        $config[pathinfo($file, PATHINFO_FILENAME)] = require __DIR__ . '/../../config/' . $file;
    }
}

define('CONFIG', $config);
unset($config);

function config($name) {
    $name = trim($name);

    if (empty($name)) return null;

    $parameters = explode('.', $name);
    $array = CONFIG;

    while ($parameters) {
        $parameter = $parameters[0];
        array_shift($parameters);

        if (!isset($array[$parameter])) return null;

        $array = $array[$parameter];
    }

    return $array;
}
