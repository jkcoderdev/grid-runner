<?php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

function env($name) {
    return isset($_ENV[$name]) ? $_ENV[$name] : null;
}
