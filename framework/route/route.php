<?php

class Route {
    public function __construct($file) {
        $this->file = $file;
    }

    public static function view($name) {
        return new Route(__DIR__ . '/../../resources/views/' .$name . '.php');
    }

    public static function script($name) {
        return new Route(__DIR__ . '/../../resources/scripts/' .$name . '.php');
    }

    public static function empty() {
        return new Route(__DIR__ . '/views/404.php');
    }

    public function load() {
        extract($GLOBALS);
        require_once $this->file;
    }
}
