<?php

// Redirect if logged in
if (isset($_SESSION['user_id'])) {
    redirect('/');
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= config('app.name') ?> - Log in</title>
        <?php styles('preloader', 'panel') ?>
        <?php scripts('preloader') ?>
    </head>
    <body>
        <div class="preloader" id="preloader">
            <div class="preloader-grid">
                <div class="preloader-square" style="--delay: .2s;"></div>
                <div class="preloader-square" style="--delay: .3s;"></div>
                <div class="preloader-square" style="--delay: .4s;"></div>
                <div class="preloader-square" style="--delay: .1s;"></div>
                <div class="preloader-square" style="--delay: .2s;"></div>
                <div class="preloader-square" style="--delay: .3s;"></div>
                <div class="preloader-square" style="--delay: .0s;"></div>
                <div class="preloader-square" style="--delay: .1s;"></div>
                <div class="preloader-square" style="--delay: .2s;"></div>
            </div>
        </div>
        <div class="form">
            <h1>Log in</h1>
            <form action="/api/login" method="post">
                <input type="text" name="username" placeholder="Username" class="input">
                <input type="password" name="password" placeholder="Password" class="input">
                <button class="btn">
                    <span>Log in</span>
                    <svg viewBox="0 0 448 512" fill="white"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                </button>
                <?php if (isset($_SESSION['form_error'])) {
                    echo '<p class="error">'.$_SESSION['form_error'].'</p>';
                    unset($_SESSION['form_error']);
                } ?>
                <p>
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </form>
        </div>
        <footer class="footer">
            <div><?= config('app.version') ?></div>
            <div>Copyright by <a href="https://jkcoder.eu" target="_blank">JKCoder</a></div>
            <div><a href="/">Back to the game</a></div>
        </footer>
    </body>
</html>