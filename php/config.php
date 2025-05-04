<?php

session_start();

define('DB_HOST', 'localhost');
define('DB_USERNAME', 'srv46835_gridrunner');
define('DB_PASSWORD', 'lRMx5Wlc');
define('DB_NAME', 'srv46835_gridrunner');

// Make PDO connection with database
$db = new PDO("mysql:charset=utf8;host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);

?>