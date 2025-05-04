<?php require_once 'php/config.php'; ?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grid Runner</title>
        <link rel="stylesheet" href="css/preloader.css">
        <link rel="stylesheet" href="css/main.css">
        <script defer src="js/preloader.js"></script>
        <script defer src="js/cache.js"></script>
        <script defer src="js/game.js"></script>
        <script defer src="js/main.js"></script>
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
        <div class="container">
            <header class="header">
                <div class="logo animated">
                    <h1>Grid</h1>
                    <h3>Runner</h3>
                    <span class="small">(Canvas Game)</span>
                </div>
            </header>
            <section class="sidebar sidebar-left menu">
                <section class="box">
                    <span class="box-name">User</span>
                    <input type="text" value="Player1234" class="input" id="nickname">
                    <?php if(isset($_SESSION['user_id'])): ?>
                        <p style="text-align: center; font-size: 12px;">You are logged in as <i><?php
                        // Get user data from database
                        $user_id = $_SESSION['user_id'];
                        $sql = "SELECT * FROM users WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $stmt->execute([$user_id]);

                        // Fetch data
                        $user = $stmt->fetch(PDO::FETCH_ASSOC);

                        echo $user['username'];
                        ?></i></p>
                    <?php endif; ?>
                    <div class="buttons">
                        <?php if(!isset($_SESSION['user_id'])): ?>
                            <button class="btn" onclick="location.href='login.php'">
                                <span>Log in</span>
                                <svg viewBox="0 0 448 512" fill="white"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                            </button>
                        <?php else: ?>
                            <button class="btn" onclick="location.href='php/logout.php'">
                                <span>Log out</span>
                                <svg viewBox="0 0 512 512" fill="white"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                            </button>
                        <?php endif; ?>
                        <button class="btn settings-btn">
                            <svg viewBox="0 0 512 512" fill="white"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                        </button>
                    </div>
                </section>
                <button class="btn" id="howtoplay-btn">How to play</button>
            </section>
            <div class="content menu">
                <h1>Select mode</h1>
                <div class="options" id="mode">
                    <button class="btn btn-center">Classic</button>
                    <button class="btn btn-center">Endurance</button>
                    <!-- <button class="btn btn-center">Extreme</button> -->
                </div>
            </div>
            <section class="sidebar sidebar-right menu">
                <section class="box">
                    <span class="box-name">Updates</span>
                    <div class="updates">
                        <h1>1.0.6 - Latest version</h1>
                        <ul>
                            <li>Log in / Sign up functionality added</li>
                            <li>Nick saving</li>
                            <li>Updates section added</li>
                            <li>Preloader added</li>
                        </ul>
                        <h1>1.0.5</h1>
                        <ul>
                            <li>Game summary added</li>
                        </ul>
                        <h1>1.0.4</h1>
                        <ul>
                            <li>Settings added</li>
                            <li>Background music and FX fixed</li>
                            <li>How to play guide</li>
                        </ul>
                        <h1>1.0.3</h1>
                        <ul>
                            <li>New look of food</li>
                            <li>Introducing background music</li>
                            <li>New game modes added</li>
                            <li>Modified game difficulties</li>
                        </ul>
                        <h1>1.0.2</h1>
                        <ul>
                            <li>New font added</li>
                            <li>Small modifications in UI</li>
                        </ul>
                        <h1>1.0.1</h1>
                        <ul>
                            <li>Completely new interface</li>
                        </ul>
                        <h1>0.2.0</h1>
                        <ul>
                            <li>Small change in UI</li>
                        </ul>
                        <h1>0.1.0</h1>
                        <ul>
                            <li>Main game mechanics</li>
                        </ul>
                    </div>
                </section>
                <!-- <section class="box">
                    <span class="box-name">Stats</span>
                    <ol>
                        <li>Player1234</li>
                        <li>Player2345</li>
                        <li>Player3456</li>
                        <li>Player4567</li>
                        <li>...</li>
                        <li>...</li>
                        <li>...</li>
                        <li>...</li>
                        <li>...</li>
                        <li>...</li>
                    </ol>
                    <p>This feature is currently unavailable</p>
                </section> -->
            </section>
            <div class="full full-hidden hidden">
                <div class="canvas">
                    <canvas id="game"></canvas>
                    <div class="summary hide">
                        <h1>Game over</h1>
                        <p id="summary">
                            LEVEL: 0<br>
                            SCORE: 0
                        </p>
                        <p>Click here to continue</p>
                    </div>
                </div>
            </div>
            <div class="howtoplay-container howtoplay-hidden hidden">
                <button class="btn btn-center close-btn">X</button>
                <div class="howtoplay">
                    <h1>How to play</h1>
                    <p>The game is played on a grid board that has a certain size. The player controls a square that can move in any direction. The goal of the game is to eat as much food as possible and get as many points as you can.</p>
                    <h2>Game Modes</h2>
                    <h3>Classic Mode</h3>
                    <p>In Classic Mode, every food eaten gives you points based on the value of the food. There are four types of food in this mode:</p>
                    <ol>
                        <li>Apple - gives you 30 points and has the highest chance of spawning at 40%</li>
                        <li>Pear - gives you 40 points and has a 30% chance of spawning</li>
                        <li>Banana - gives you 50 points and has a 20% chance of spawning</li>
                        <li>Cherry - gives you the highest points of all the food at 100 points and is the rarest with a 10% chance of spawning</li>
                    </ol>
                    <p>When you eat food in Classic Mode, the size of the grid increases and the player gets faster, making it more challenging to play. You also get a higher level for each food that you eat.</p>
                    <h3>Endurance Mode</h3>
                    <p>In Endurance Mode, the player is moving in a grid with a constant size. The goal is to last as long as possible while the player gets faster and faster, making it more challenging to stay alive. Points in this mode are based on the time you last in the game and the number of food that you eat. The type of food you eat does not matter, but you will receive a higher level for each food eaten.</p>
                </div>
            </div>
            <div class="settings-container settings-hidden hidden">
                <button class="btn btn-center close-btn">X</button>
                <div class="settings">
                    <h1>Settings</h1>
                    <h2>Sounds</h2>
                    <label for="music">Music</label>
                    <input type="range" name="music" id="music" min="0" max="10" value="0" onchange="setMusicVolume(this.value/10)">
                    <label for="fx">FX</label>
                    <input type="range" name="fx" id="fx" min="0" max="10" value="0" onchange="setFXVolume(this.value/10)">
                </div>
            </div>
            <div class="popup-container popup-hidden hidden">
                <button class="btn btn-center close-btn">X</button>
                <div class="popup">
                    <h1>Selected mode: <span class="mode" id="selected-mode">Classic</span></h1>
                    <br>
                    <h1>Select difficulty</h1>
                    <form onsubmit="return false;" class="options" id="difficulty">
                        <input type="radio" name="difficulty" value="easy" id="easy">
                        <label class="btn btn-center" for="easy">Easy</label>
                        <input type="radio" name="difficulty" value="medium" id="medium">
                        <label class="btn btn-center" for="medium">Medium</label>
                        <input type="radio" name="difficulty" value="hard" id="hard">
                        <label class="btn btn-center" for="hard">Hard</label>
                        <input type="radio" name="difficulty" value="insane" id="insane">
                        <label class="btn btn-center" for="insane">Insane</label>
                    </form>
                    <br>
                    <button class="btn play-btn">
                        <span>Start game</span>
                        <svg viewBox="0 0 384 512" fill="white"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                    </button>
                </div>
            </div>
        </div>
        <footer class="footer">
            <div class="info">
                <div>1.0.6</div>
                <div>Copyright by <a href="https://jkcoder.eu" target="_blank">JKCoder</a></div>
                <?php  if(isset($_SESSION['user_id'])): ?>
                    <div><a href="php/logout.php">Log out</a></div>
                <?php else: ?>
                    <div><a href="./login.php">Log in</a></div>
                    <div><a href="./signup.php">Sign up</a></div>
                <?php endif; ?>
            </div>
        </footer>
    </body>
</html>