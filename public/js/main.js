/* ------------- MUSIC ------------- */

const music = new Audio();
music.loop = true;
music.autoplay = true;
music.volume = 0;

function playMusic(name) {
	if (name == "menu") {
		music.src = "assets/music/kim-lightyear_the-call.mp3";
	} else if (name == "game") {
		music.src = "assets/music/alexandr-zhelanov_brave-space-explorers.mp3";
	}
}

function stopMusic() {
	music.pause();
	music.currentTime = 0;
}

let interaction = false;
window.addEventListener("click", startMusic);
function startMusic() {
	playMusic("menu");
	interaction = true;
	window.removeEventListener("click", startMusic);
}

/* ------------- GAME -------------- */

const game = new Game("#game");
game.start();
game.pause();

/* ----------- SETTINGS ------------ */

function setMusicVolume(volume) {
	if (music.volume == 0) {
		music.currentTime = 0;
		if (interaction) music.play();
	}
	music.volume = volume;
	sessionStorage.setItem("musicVolume", volume);
}

function setFXVolume(volume) {
	game.sounds.volume = volume;
	sessionStorage.setItem("fxVolume", volume);
}

setFXVolume(
	sessionStorage.getItem("fxVolume") != null
		? parseFloat(sessionStorage.getItem("fxVolume"))
		: 0
);
setMusicVolume(
	sessionStorage.getItem("musicVolume") != null
		? parseFloat(sessionStorage.getItem("musicVolume"))
		: 0
);

document.querySelector("#music").value = Math.round(music.volume * 10);
document.querySelector("#fx").value = Math.round(game.sounds.volume * 10);

let musicVolume = 0;
let fxVolume = 0;

window.addEventListener("blur", () => {
	musicVolume = music.volume;
	fxVolume = game.sounds.volume;

	setFXVolume(0);
	setMusicVolume(0);
});

window.addEventListener("focus", () => {
	setFXVolume(fxVolume);
	setMusicVolume(musicVolume);
});

/* -------------- UI --------------- */

const modeButtons = document.querySelectorAll("#mode button");
const difficultyForm = document.querySelector("#difficulty");
const popupMenuContainer = document.querySelector(".popup-container");
const popupCloseBtn = document.querySelector(".popup-container .close-btn");
const selectedMode = document.querySelector(".popup-container #selected-mode");
const menuElements = document.querySelectorAll(".menu");
const fullViewElement = document.querySelector(".full");
const playButton = document.querySelector(".play-btn");
const settingsContainer = document.querySelector(".settings-container");
const settingsButton = document.querySelector(".settings-btn");
const settingsCloseBtn = document.querySelector(
	".settings-container .close-btn"
);
const summaryParagraph = document.querySelector("#summary");
const summaryContainer = document.querySelector(".summary");
const howtoplayBtn = document.querySelector("#howtoplay-btn");
const howtoplayContainer = document.querySelector(".howtoplay-container");
const howtoplayCloseBtn = document.querySelector(
	".howtoplay-container .close-btn"
);
const nickname = document.querySelector("#nickname");

if (sessionStorage.getItem("nickname") != null) {
    nickname.value = sessionStorage.getItem("nickname");
} else {
    sessionStorage.setItem("nickname", nickname.value);
}

nickname.addEventListener("keypress", () => {
	sessionStorage.setItem("nickname", nickname.value);
});

function showPopupMenu() {
	popupMenuContainer.classList.add("show");
}

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
			game.speedIncrease = (speed) => speed + 8;
			game.spawnRate = 1;
		} else if (difficulty == "hard") {
			game.speedIncrease = (speed) => speed + 4;
			game.spawnRate = 2;
		} else if (difficulty == "medium") {
			game.speedIncrease = (speed) => speed + 2;
			game.spawnRate = 3;
		} else if (difficulty == "easy") {
			game.speedIncrease = (speed) => speed + 1;
			game.spawnRate = 5;
		}

		if (difficulty == "insane") game.speedIncrease = (speed) => speed + 8;
		else if (difficulty == "hard")
			game.speedIncrease = (speed) => speed + 4;
		else if (difficulty == "medium")
			game.speedIncrease = (speed) => speed + 2;
		else if (difficulty == "easy")
			game.speedIncrease = (speed) => speed + 1;
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

function continueGameClickHandler() {
	setMenuView();
	summaryContainer.removeEventListener("click", continueGameClickHandler);
}

game.on("over", () => {
	game.pause();

	summaryParagraph.innerHTML = `SCORE: ${game.score}<br>LEVEL: ${game.level}`;
	summaryContainer.classList.remove("hide");

	summaryContainer.addEventListener("click", continueGameClickHandler);

	console.log(`SCORE: ${game.score}\nLEVEL: ${game.level}`);
});

popupCloseBtn.addEventListener("click", hidePopupMenu);

settingsButton.addEventListener("click", () => {
	settingsContainer.classList.remove("hidden");
	setTimeout(() => settingsContainer.classList.remove("settings-hidden"), 0);
});

settingsCloseBtn.addEventListener("click", () => {
	settingsContainer.classList.add("settings-hidden");
	setTimeout(() => settingsContainer.classList.add("hidden"), 1 * 1000);
});

howtoplayBtn.addEventListener("click", () => {
	howtoplayContainer.classList.remove("hidden");
	setTimeout(
		() => howtoplayContainer.classList.remove("howtoplay-hidden"),
		0
	);
});

howtoplayCloseBtn.addEventListener("click", () => {
	howtoplayContainer.classList.add("howtoplay-hidden");
	setTimeout(() => howtoplayContainer.classList.add("hidden"), 1 * 1000);
});

modeButtons.forEach((modeBtn) => {
	modeBtn.addEventListener("click", (e) => {
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

		menuElements.forEach((menuElement) => {
			menuElement.classList.remove("hidden");
			setTimeout(() => {
				menuElement.classList.remove("menu-hidden");
				playMusic("menu", 500);
			}, 10);
		});
	}, 1 * 1000);
}

function setGameView() {
	summaryContainer.classList.add("hide");

	menuElements.forEach((menuElement) => {
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
