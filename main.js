/* ------------- GAME -------------- */

const game = new Game("#game");
game.start();
game.pause();

/* -------------- UI --------------- */

const modeButtons = document.querySelectorAll("#mode button");
const difficultyButtons = document.querySelectorAll("#difficulty button");
const popupMenuContainer = document.querySelector(".popup-container");
const popupCloseBtn = document.querySelector(".popup-container .close-btn");
const selectedMode = document.querySelector(".popup-container #selected-mode");
const menuElements = document.querySelectorAll(".menu");
const fullViewElement = document.querySelector(".full");
const playButton = document.querySelector(".play-btn");

let mode = null;
let difficulty = null;

playButton.addEventListener("click", () => {
    if (difficulty == null) return;

    let difficultySave = difficulty;

    hidePopupMenu();
    game.reset();

    if (difficultySave == "hard") game.speedIncrease = 6;
    else if (difficultySave == "medium") game.speedIncrease = 4;
    else game.speedIncrease = 2;

    setGameView();
    setTimeout(game.start.bind(game), 1 * 1000);
});

game.on("over", () => {
    game.pause();

    setMenuView();
});

popupCloseBtn.addEventListener("click", hidePopupMenu);

modeButtons.forEach(modeBtn => {
    modeBtn.addEventListener("click", e => {
        const btn = e.target;

        setMode(btn.textContent.toLowerCase());
    });
});

popupMenuContainer.addEventListener("click", e => {
    if (e.target.parentNode.id == "difficulty") return;

    difficulty = null;
});

difficultyButtons.forEach(difficultyBtn => {
    difficultyBtn.addEventListener("click", e => {
        const btn = e.target;

        setDifficulty(btn.textContent.toLowerCase());
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
    resetGameSettings();
}

function setMode(modeValue) {
    mode = modeValue;
    showPopupMenu();
}

function setDifficulty(difficultyValue) {
    difficulty = difficultyValue;
}

function resetGameSettings() {
    mode = null;
    difficulty = null;
}

function setMenuView() {
    fullViewElement.classList.add("full-hidden");
    setTimeout(() => {
        fullViewElement.classList.add("hidden");

        menuElements.forEach(menuElement => {
            menuElement.classList.remove("hidden");
            setTimeout(() => menuElement.classList.remove("menu-hidden"), 10);
        });
    }, 1 * 1000);
}

function setGameView() {
    menuElements.forEach(menuElement => {
        menuElement.classList.add("menu-hidden");
        setTimeout(() => {
            menuElement.classList.add("hidden");
            
            fullViewElement.classList.remove("hidden");
            setTimeout(() => fullViewElement.classList.remove("full-hidden"), 10);
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