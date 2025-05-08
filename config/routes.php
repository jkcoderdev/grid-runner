<?php

return [
    '/' => Route::view('game'),
    '/login' => Route::view('login'),
    '/signup' => Route::view('signup'),

    '/api/logout' => Route::script('logout'),
    '/api/login' => Route::script('login'),
    '/api/signup' => Route::script('signup'),
];
