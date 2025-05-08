<?php

define('PATH', '/' . trim($_SERVER['REQUEST_URI'], '/'));

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap/app.php';

if ($_SERVER['REQUEST_URI'] !== PATH) redirect(PATH);

$db = connection();
if (!$db) {
    require_once __DIR__ . '/../framework/connection/views/error.php';
    exit();
}

$routes = config('routes');
$route = isset($routes[PATH]) ? $routes[PATH] : Route::empty();
$route->load();

