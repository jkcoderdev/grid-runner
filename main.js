/* ------------- MUSIC ------------- */

const musicFrame = document.querySelector("#musicFrame");
const audioElement = musicFrame.contentDocument.createElement("audio");
audioElement.loop = true;
audioElement.autoplay = true;
audioElement.id = "music";
musicFrame.contentDocument.body.appendChild(audioElement);
const music = musicFrame.contentDocument.querySelector("#music");

function playMusic(name) {
    if (name == "menu") {
        // music.src = "assets/music/cleyton-rx_underwater.mp3";
        music.src = "assets/music/kim-lightyear_the-call.mp3";
    } else if (name == "game") {
        music.src = "assets/music/alexandr-zhelanov_brave-space-explorers.mp3";
    }
}

function stopMusic() {
    music.pause();
    music.currentTime = 0;
}

playMusic("menu");

/* ------------- GAME -------------- */

const game = new Game("#game");
game.start();
game.pause();

/* -------------- UI --------------- */

const modeButtons = document.querySelectorAll("#mode button");
const difficultyForm = document.querySelector("#difficulty");
const popupMenuContainer = document.querySelector(".popup-container");
const popupCloseBtn = document.querySelector(".popup-container .close-btn");
const selectedMode = document.querySelector(".popup-container #selected-mode");
const menuElements = document.querySelectorAll(".menu");
const fullViewElement = document.querySelector(".full");
const playButton = document.querySelector(".play-btn");

let mode = null;

playButton.addEventListener("click", () => {
    let difficulty = difficultyForm.difficulty.value;

    if (mode == null || difficulty == "") return;

    hidePopupMenu();
    game.reset();

    if (mode == "classic") {
        game.gridIncreasing = true;
        game.autoSpawning = true;
		game.timeScoring = false;
        game.acceleration = 0;

        if (difficulty == "insane") {
            game.speedIncrease = speed => speed + 8
            game.spawnRate = 1;
        } else if (difficulty == "hard") {
            game.speedIncrease = speed => speed + 4;
            game.spawnRate = 2;
        } else if (difficulty == "medium") {
            game.speedIncrease = speed => speed + 2;
            game.spawnRate = 3;
        } else if (difficulty == "easy") {
            game.speedIncrease = speed => speed + 1;
            game.spawnRate = 5;
        }

        if (difficulty == "insane") game.speedIncrease = speed => speed + 8;
        else if (difficulty == "hard") game.speedIncrease = speed => speed + 4;
        else if (difficulty == "medium") game.speedIncrease = speed => speed + 2;
        else if (difficulty == "easy") game.speedIncrease = speed => speed + 1;
    } else if (mode == "endurance") {
        game.spawnRate = 1;
        game.gridIncreasing = false;
        game.autoSpawning = true;
		game.timeScoring = true;

        if (difficulty == "insane") {
            game.acceleration = 2;
            game.grid.size = 7;
        } else if (difficulty == "hard") {
            game.acceleration = 1.5;
            game.grid.size = 7;
        } else if (difficulty == "medium") {
            game.acceleration = 1;
            game.grid.size = 9;
        } else if (difficulty == "easy") {
            game.acceleration = 0.5;
            game.grid.size = 11;
        }
    }

    resetGameSettings();

    setGameView();
    setTimeout(game.start.bind(game), 1 * 1000);
});

game.on("over", () => {
    game.pause();

    console.log(`SCORE: ${game.score}\nLEVEL: ${game.level}`);

    setMenuView();
});

popupCloseBtn.addEventListener("click", hidePopupMenu);

modeButtons.forEach(modeBtn => {
    modeBtn.addEventListener("click", e => {
        const btn = e.target;

        setMode(btn.innerHTML.toLowerCase());
    });
});

function showPopupMenu() {
    selectedMode.textContent = mode;
    popupMenuContainer.classList.remove("hidden");
    setTimeout(() => popupMenuContainer.classList.remove("popup-hidden"), 0);
}

function hidePopupMenu() {
    popupMenuContainer.classList.add("popup-hidden");
    setTimeout(() => popupMenuContainer.classList.add("hidden"), 1 * 1000);
}

function setMode(modeValue) {
    mode = modeValue;
    showPopupMenu();
}

function resetGameSettings() {
    mode = null;
    difficultyForm.reset();
}

function setMenuView() {
    fullViewElement.classList.add("full-hidden");
    setTimeout(() => {
        fullViewElement.classList.add("hidden");

        menuElements.forEach(menuElement => {
            menuElement.classList.remove("hidden");
            setTimeout(() => {
                menuElement.classList.remove("menu-hidden");
                playMusic("menu", 500);
            }, 10);
        });
    }, 1 * 1000);
}

function setGameView() {
    menuElements.forEach(menuElement => {
        menuElement.classList.add("menu-hidden");
        setTimeout(() => {
            menuElement.classList.add("hidden");
            
            fullViewElement.classList.remove("hidden");
            setTimeout(() => {
                fullViewElement.classList.remove("full-hidden");
                playMusic("game", 500);
            }, 10);
        }, 1 * 1000);
    });
}

// const game = new Game("#canvas");
// const container = document.querySelector(".container");
// const summary = document.querySelector(".summary");

// let isGameOver = false;

// game.on("over", () => {
//     game.pause();

//     isGameOver = true;

//     summary.querySelector(".info").innerHTML = `
//     LEVEL: ${game.level}<br>
//     SCORE: ${game.score}
//     `;

//     summary.classList.add("show");
//     container.classList.add("light");
// });

// function continueGame() {
//     if (!summary.classList.contains("show") || !isGameOver) return;

//     summary.classList.remove("show");
//     container.classList.remove("light");
    
//     game.reset();

//     setTimeout(() => {
//         game.start();

//         isGameOver = false;
//     }, 500);
// }

// document.addEventListener("keydown", e => {
//     if(isGameOver && e.code == "Space") continueGame();
// });

// game.start();