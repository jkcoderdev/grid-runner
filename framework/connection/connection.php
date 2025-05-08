<?php

require_once __DIR__ . '/../config/config.php';

function connection() {
    try {
        $db = new PDO(
            "mysql:charset=utf8;host=" . config('database.host') . ";dbname=" . config('database.name'),
            config('database.username'),
            config('database.password')
        );
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        return null;
    }

    return $db;
}
