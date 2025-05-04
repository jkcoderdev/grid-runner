const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
	const { width, height } = canvas.getBoundingClientRect();

	canvas.width = width;
	canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const fruitsTexture = new Image();
fruitsTexture.src = "./assets/textures/fruits.png";

const eatingSounds = [
	new Audio("./assets/sounds/eating.mp3"),
	new Audio("./assets/sounds/eating.mp3"),
];

let eatingSoundIndex = 0;

function playEatingSound() {
	eatingSounds[eatingSoundIndex].play();
	eatingSoundIndex = (eatingSoundIndex + 1) % eatingSounds.length;
}

function drawFruit(options) {
	let {
		screenX,
		screenY,
		screenWidth,
		screenHeight,
		imageX,
		imageY,
		imageWidth,
		imageHeight,
	} = Object.assign(
		{
			screenX: 0,
			screenY: 0,
			screenWidth: fruitsTexture.width,
			screenHeight: fruitsTexture.height,
			imageX: 0,
			imageY: 0,
			imageWidth: fruitsTexture.width,
			imageHeight: fruitsTexture.height,
		},
		options
	);

	ctx.drawImage(
		fruitsTexture,
		imageX,
		imageY,
		imageWidth,
		imageHeight,
		screenX,
		screenY,
		screenWidth,
		screenHeight
	);
}

class Food {
	constructor(x, y, points, type) {
		this.x = x;
		this.y = y;
		this.points = points;
		this.type = type;
	}

	eat() {
		playEatingSound();

		if (FOOD_ITEMS.length <= 1) {
			PLAYER.score += this.points;
			PLAYER.speed *= 1.2;

			increaseGridSize();
			PLAYER.level += 1;

			PLAYER.x += 1;
			PLAYER.y += 1;

			FOOD_ITEMS.forEach((food) => {
				food.x += 1;
				food.y += 1;
			});

			createRandomFood(3);
		}

		console.log(
			"Food of type",
			this.type,
			"has been eaten scoring",
			this.points,
			"points"
		);
	}

	copy() {
		return new Food(this.x, this.y, this.points, this.type);
	}
}

let GRID_SIZE = 5; // rozmiar planszy

const FOOD_TYPES = {
	apple: new Food(0, 0, 3, "apple"),
	banana: new Food(0, 0, 5, "banana"),
	cherry: new Food(0, 0, 10, "cherry"),
};

// Obiekt gracza
const PLAYER = {
	x: Math.floor(GRID_SIZE / 2), // pozycja gracza na osi X
	y: Math.floor(GRID_SIZE / 2), // pozycja gracza na osi Y
	speed: 1, // prędkość gracza
	direction: "up", // kierunek ruchu gracza
	score: 0, // ilość zdobytych punktów
	level: 1, // aktualny poziom gry
};

const FOOD_ITEMS = [];

// Obiekt motywu
const THEME = {
	playerColor: "#FF6347",
	gridColor: "#444",
	gridLightColor: "#aaa",
	backgroundColor: "#222",
	appleColor: "#FF0000",
	bananaColor: "#FFD700",
	cherryColor: "#FF1493",
	foodTextColor: "#FFFFFF",
};

let gridZoomAnimation = 0;
let gridZoomAnimationSpeed = 2;

function increaseGridSize() {
	GRID_SIZE += 2;
	gridZoomAnimation = 1;
}

function drawGrid() {
	ctx.fillStyle = THEME.backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;

	ctx.strokeStyle = THEME.gridColor;
	ctx.lineWidth = canvas.width / GRID_SIZE / 5;

	for (let i = 0; i <= GRID_SIZE; i++) {
		// pionowe linie
		ctx.beginPath();
		ctx.moveTo(i * squareSize, 0);
		ctx.lineTo(i * squareSize, canvas.height);
		ctx.stroke();

		// poziome linie
		ctx.beginPath();
		ctx.moveTo(0, i * squareSize);
		ctx.lineTo(canvas.width, i * squareSize);
		ctx.stroke();
	}

	ctx.strokeStyle = THEME.gridLightColor;
	ctx.lineWidth = canvas.width / GRID_SIZE / 50;

	for (let i = 0; i <= GRID_SIZE; i++) {
		// pionowe linie
		ctx.beginPath();
		ctx.moveTo(i * squareSize, 0);
		ctx.lineTo(i * squareSize, canvas.height);
		ctx.stroke();

		// poziome linie
		ctx.beginPath();
		ctx.moveTo(0, i * squareSize);
		ctx.lineTo(canvas.width, i * squareSize);
		ctx.stroke();
	}
}

function drawPlayer() {
	const { x, y } = PLAYER;
	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;

	ctx.fillStyle = THEME.playerColor;
	ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

function drawSingleFood(type, x, y) {
	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;

	switch (type) {
		case "apple":
			drawFruit({
				screenX: x * squareSize,
				screenY: y * squareSize,
				screenWidth: squareSize,
				screenHeight: squareSize,
				imageX: 270,
				imageY: 180,
				imageWidth: 300,
				imageHeight: 300,
			});
			break;
		case "banana":
			drawFruit({
				screenX: x * squareSize,
				screenY: y * squareSize,
				screenWidth: squareSize,
				screenHeight: squareSize,
				imageX: 1540,
				imageY: 580,
				imageWidth: 450,
				imageHeight: 450,
			});
			break;
		case "cherry":
			drawFruit({
				screenX: x * squareSize,
				screenY: y * squareSize,
				screenWidth: squareSize,
				screenHeight: squareSize,
				imageX: 550,
				imageY: 180,
				imageWidth: 300,
				imageHeight: 300,
			});
			break;
		default:
			break;
	}
}

function drawFood() {
	FOOD_ITEMS.forEach((food) => {
		drawSingleFood(food.type, food.x, food.y);
	});
}

let queuedMoves = [];
let nextDirection = null;
let playerPos = { x: PLAYER.x, y: PLAYER.y };

function movePlayerInDirection(distance, direction = PLAYER.direction) {
	switch (direction) {
		case "up":
			PLAYER.y -= distance;
			break;
		case "down":
			PLAYER.y += distance;
			break;
		case "left":
			PLAYER.x -= distance;
			break;
		case "right":
			PLAYER.x += distance;
			break;
	}
}

function getDistanceValue(playerPosition) {
	const { direction } = PLAYER;

	switch (direction) {
		case "up":
			return Math.floor(playerPosition.y) - PLAYER.y;
		case "down":
			return PLAYER.y - Math.ceil(playerPosition.y);
		case "left":
			return Math.floor(playerPosition.x) - PLAYER.x;
		case "right":
			return PLAYER.x - Math.ceil(playerPosition.x);
	}
}

function movePlayer(deltaTime) {
	const { direction, speed } = PLAYER;

	let calculatedSpeed = speed;
	calculatedSpeed *= 0.1 + 0.9 * (1 - gridZoomAnimation);

	if (!nextDirection && queuedMoves.length > 0) {
		if (queuedMoves[0] === direction) {
			nextDirection = null;
		} else {
			nextDirection = queuedMoves[0];
			playerPos = { x: PLAYER.x, y: PLAYER.y };
		}
		queuedMoves.shift();
	}

	movePlayerInDirection(calculatedSpeed * deltaTime);

	if (nextDirection) {
		const distance = getDistanceValue(playerPos);

		if (distance >= 0) {
			if (PLAYER.y <= Math.floor(playerPos.y) && direction == "up") {
				// w górę
				PLAYER.y = Math.floor(playerPos.y);
			} else if (
				PLAYER.y >= Math.ceil(playerPos.y) &&
				direction == "down"
			) {
				// w dół
				PLAYER.y = Math.ceil(playerPos.y);
			} else if (
				PLAYER.x <= Math.floor(playerPos.x) &&
				direction == "left"
			) {
				// w lewo
				PLAYER.x = Math.floor(playerPos.x);
			} else if (
				PLAYER.x >= Math.ceil(playerPos.x) &&
				direction == "right"
			) {
				// w prawo
				PLAYER.x = Math.ceil(playerPos.x);
			}

			PLAYER.direction = nextDirection;
			nextDirection = null;

			movePlayerInDirection(distance, PLAYER.direction);
		}
	}
}

document.addEventListener("keydown", (e) => {
	if (queuedMoves.length > 0) return;

	if (e.code === "ArrowUp" || e.code === "KeyW") {
		queuedMoves.push("up");
	} else if (e.code === "ArrowDown" || e.code === "KeyS") {
		queuedMoves.push("down");
	} else if (e.code === "ArrowLeft" || e.code === "KeyA") {
		queuedMoves.push("left");
	} else if (e.code === "ArrowRight" || e.code === "KeyD") {
		queuedMoves.push("right");
	}
});

function getRoundedPlayerPosition() {
	const { direction } = PLAYER;

	let roundedX = PLAYER.x;
	let roundedY = PLAYER.y;

	switch (direction) {
		case "up":
			roundedY = Math.floor(PLAYER.y);
			break;
		case "down":
			roundedY = Math.ceil(PLAYER.y);
			break;
		case "left":
			roundedX = Math.floor(PLAYER.x);
			break;
		case "right":
			roundedX = Math.ceil(PLAYER.x);
			break;
	}

	return {
		x: roundedX,
		y: roundedY,
	};
}

function getPlayerTiles() {
	const { direction } = PLAYER;

	let tile1 = { x: PLAYER.x, y: PLAYER.y },
		tile2 = { x: PLAYER.x, y: PLAYER.y };

	switch (direction) {
		case "up":
			tile1.y = Math.ceil(PLAYER.y);
			tile2.y = Math.floor(PLAYER.y);
			break;
		case "down":
			tile1.y = Math.floor(PLAYER.y);
			tile2.y = Math.ceil(PLAYER.y);
			break;
		case "left":
			tile1.x = Math.ceil(PLAYER.x);
			tile2.x = Math.floor(PLAYER.x);
			break;
		case "right":
			tile1.x = Math.floor(PLAYER.x);
			tile2.x = Math.ceil(PLAYER.x);
			break;
	}

	return [tile1, tile2];
}

function drawRoundedPlayerPosition() {
	const playerPosition = getRoundedPlayerPosition();

	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;

	ctx.fillStyle = "yellow";
	ctx.beginPath();
	ctx.arc(
		playerPosition.x * squareSize + squareSize / 2,
		playerPosition.y * squareSize + squareSize / 2,
		20,
		0,
		Math.PI * 2
	);
	ctx.fill();
}

function drawPlayerTiles() {
	const playerTiles = getPlayerTiles();

	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;

	ctx.fillStyle = "#8f0";
	ctx.beginPath();
	ctx.arc(
		playerTiles[0].x * squareSize + squareSize / 2,
		playerTiles[0].y * squareSize + squareSize / 2,
		20,
		0,
		Math.PI * 2
	);
	ctx.fill();

	ctx.fillStyle = "#ff0";
	ctx.beginPath();
	ctx.arc(
		playerTiles[1].x * squareSize + squareSize / 2,
		playerTiles[1].y * squareSize + squareSize / 2,
		20,
		0,
		Math.PI * 2
	);
	ctx.fill();
}

function getRandomFoodPosition() {
	const excludedPositions = getPlayerTiles().concat(FOOD_ITEMS);

	const gridSize = GRID_SIZE;

	let foodPosition = {
		x: Math.floor(Math.random() * gridSize),
		y: Math.floor(Math.random() * gridSize),
	};

	// Sprawdzamy czy wylosowana pozycja nie występuje w wykluczonych pozycjach
	while (
		excludedPositions.some(
			(pos) => pos.x === foodPosition.x && pos.y === foodPosition.y
		)
	) {
		foodPosition = {
			x: Math.floor(Math.random() * gridSize),
			y: Math.floor(Math.random() * gridSize),
		};
	}

	return foodPosition;
}

function isPlayerCollidingWithWall() {
	const { x, y } = PLAYER;
	const gridSize = GRID_SIZE;

	// sprawdzenie czy gracz znajduje się poza planszą
	if (x < 0 || x > gridSize - 1 || y < 0 || y > gridSize - 1) {
		return true;
	}

	return false;
}

function isPlayerCollidingWithFood(food) {
	let roundedPosition = getRoundedPlayerPosition();

	return food.x == roundedPosition.x && food.y == roundedPosition.y;
}

function createRandomFood(count = 1) {
	for (let i = 0; i < count; i++) {
		const foodTypeKeys = Object.keys(FOOD_TYPES);
		const randomFoodTypeKey =
			foodTypeKeys[Math.floor(Math.random() * foodTypeKeys.length)];
		const randomFoodType = FOOD_TYPES[randomFoodTypeKey].copy();
		const randomFoodPosition = getRandomFoodPosition();
		randomFoodType.x = randomFoodPosition.x;
		randomFoodType.y = randomFoodPosition.y;
		FOOD_ITEMS.push(randomFoodType);
	}
}

createRandomFood(3);

let focused = false;

setTimeout(() => (focused = document.hasFocus()), 1000);

window.addEventListener("focus", () => (focused = true));
window.addEventListener("blur", () => (focused = false));

function renderLoop() {
	ctx.save();

	const squareSize = Math.min(canvas.width, canvas.height) / GRID_SIZE;
	const scale = GRID_SIZE / (GRID_SIZE - gridZoomAnimation * 2);

	ctx.scale(scale, scale);
	ctx.translate(
		-squareSize * gridZoomAnimation,
		-squareSize * gridZoomAnimation
	);

	drawGrid();
	drawFood();
	drawPlayer();

	ctx.restore();

	requestAnimationFrame(renderLoop);
}

let lastTime = performance.now();

function gameTickLoop() {
	let now = performance.now();
	let deltaTime = (now - lastTime) / 1000;
	lastTime = now;

	gridZoomAnimation -= deltaTime * gridZoomAnimationSpeed;
	if (gridZoomAnimation < 0) gridZoomAnimation = 0;

	if (focused) {
		movePlayer(deltaTime);
	}

	if (isPlayerCollidingWithWall()) {
		PLAYER.x = Math.floor(GRID_SIZE / 2);
		PLAYER.y = Math.floor(GRID_SIZE / 2);
	}

	for (let foodIndex = 0; foodIndex < FOOD_ITEMS.length; foodIndex++) {
		let food = FOOD_ITEMS[foodIndex];

		if (isPlayerCollidingWithFood(food)) {
			food.eat();

			FOOD_ITEMS.splice(foodIndex, 1);
			break;
		}
	}
}

renderLoop();
setInterval(gameTickLoop, 0);
