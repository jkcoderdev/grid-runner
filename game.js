const DEFAULT = {
	GRID_SIZE: 5,
	GRID_ZOOM_ANIMATION_SPEED: 2,
	PLAYER_SPEED: 1,
};

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

const FOOD_TYPES = [
	{
		type: "apple",
		points: 3,
		spawnRate: 0.5,
	},
	{
		type: "banana",
		points: 5,
		spawnRate: 0.4,
	},
	{
		type: "cherry",
		points: 10,
		spawnRate: 0.1,
	},
];

const FOOD_TEXTURE_COORDS = {
	apple: [270, 180, 300, 300],
	banana: [1540, 580, 450, 450],
	cherry: [550, 180, 300, 300],
};

class Sounds {
	constructor() {
		this.sounds = {};
	}

	add(name, src) {
		const sound = {
			soundIndex: 0,
			sounds: [new Audio(src), new Audio(src)],
			play() {
				this.sounds[this.soundIndex].play();

				this.soundIndex = this.soundIndex == 0 ? 1 : 0;
			},
		};

		this.sounds[name] = sound;
	}

	play(name) {
		this.sounds[name].play();
	}
}

class Textures {
	constructor() {
		this.textures = {};
	}

	add(name, src) {
		const texture = new Image();
		texture.src = src;

		this.textures[name] = texture;
	}

	draw(renderer, name, ...args) {
		const texture = this.textures[name];
		const { ctx } = renderer;

		ctx.drawImage(texture, ...args);
	}
}

class Grid {
	constructor() {
		this.gridSize = DEFAULT.GRID_SIZE;
		this.gridZoomAnimationStep = 0;
		this.gridZoomAnimationSpeed = DEFAULT.GRID_ZOOM_ANIMATION_SPEED;
	}

	increaseSize() {
		this.gridZoomAnimationStep = 1;
		this.gridSize += 2;
	}

	reset() {
		this.gridSize = DEFAULT.GRID_SIZE;
		this.gridZoomAnimationStep = 0;
		this.gridZoomAnimationSpeed = DEFAULT.GRID_ZOOM_ANIMATION_SPEED;
	}

	animate(renderer) {
		const { width, height, ctx } = renderer;

		const squareSize = Math.min(width, height) / this.gridSize;
		const scale =
			this.gridSize / (this.gridSize - this.gridZoomAnimationStep * 2);

		ctx.scale(scale, scale);
		ctx.translate(
			-squareSize * this.gridZoomAnimationStep,
			-squareSize * this.gridZoomAnimationStep
		);
	}

	tick(deltaTime) {
		this.gridZoomAnimationStep -= deltaTime * this.gridZoomAnimationSpeed;
		if (this.gridZoomAnimationStep < 0) this.gridZoomAnimationStep = 0;
	}

	draw(renderer) {
		const { width, height, ctx } = renderer;

		ctx.fillStyle = THEME.backgroundColor;
		ctx.fillRect(0, 0, width, height);

		const squareSize = Math.min(width, height) / this.gridSize;

		ctx.strokeStyle = THEME.gridColor;
		ctx.lineWidth = width / this.gridSize / 5;

		for (let i = 0; i <= this.gridSize; i++) {
			// pionowe linie
			ctx.beginPath();
			ctx.moveTo(i * squareSize, 0);
			ctx.lineTo(i * squareSize, height);
			ctx.stroke();

			// poziome linie
			ctx.beginPath();
			ctx.moveTo(0, i * squareSize);
			ctx.lineTo(width, i * squareSize);
			ctx.stroke();
		}

		ctx.strokeStyle = THEME.gridLightColor;
		ctx.lineWidth = width / this.gridSize / 50;

		for (let i = 0; i <= this.gridSize; i++) {
			// pionowe linie
			ctx.beginPath();
			ctx.moveTo(i * squareSize, 0);
			ctx.lineTo(i * squareSize, height);
			ctx.stroke();

			// poziome linie
			ctx.beginPath();
			ctx.moveTo(0, i * squareSize);
			ctx.lineTo(width, i * squareSize);
			ctx.stroke();
		}
	}
}

class FoodItem {
	constructor(x, y, points, type) {
		this.x = x;
		this.y = y;
		this.points = points;
		this.type = type;
	}

	copy() {
		return new Food(this.x, this.y, this.points, this.type);
	}

	draw(renderer, textures, grid) {
		const { width, height } = renderer;

		const squareSize = Math.min(width, height) / grid.gridSize;

		textures.draw(
			renderer,
			"fruits",
			...FOOD_TEXTURE_COORDS[this.type],
			this.x * squareSize,
			this.y * squareSize,
			squareSize,
			squareSize
		);
	}
}

class Food {
	constructor() {
		this.food = [];

		this.eatEvent = () => {};
	}

	forEach(callback) {
		let i = 0;
		for (let foodItem of this.food) {
			callback(foodItem, i);
			i++;
		}
	}

	spawn(x, y) {
		let spawnRateScale = 0;
		for (let foodTypeRate of FOOD_TYPES) {
			spawnRateScale += foodTypeRate.spawnRate;
		}
		let randomSpawnRate = Math.random() * spawnRateScale;
		let neededSpawnRate = 0;
		for (let foodType of FOOD_TYPES) {
			neededSpawnRate += foodType.spawnRate;
			if (randomSpawnRate < neededSpawnRate) {
				this.food.push(
					new FoodItem(x, y, foodType.points, foodType.type)
				);
				break;
			}
		}
	}

	setEatEvent(callback) {
		this.eatEvent = callback;
	}

	eatFood(foodId) {
		this.eatEvent(this.food[foodId]);

		this.food.splice(foodId, 1);
	}

	moveByGridIncrease() {
		this.forEach((foodItem) => {
			foodItem.x += 1;
			foodItem.y += 1;
		});
	}

	draw(renderer, textures, grid) {
		for (let foodItem of this.food) {
			foodItem.draw(renderer, textures, grid);
		}
	}

	reset() {
		this.food = [];
	}
}

class Controller {
	constructor() {
		this.events = {
			up: () => {},
			down: () => {},
			left: () => {},
			right: () => {},
		};

		document.addEventListener("keydown", (e) => {
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.events.up();
			} else if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.events.down();
			} else if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.events.left();
			} else if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.events.right();
			}
		});
	}

	on(eventName, eventCallback) {
		this.events[eventName] = eventCallback;
	}
}

class PlayerPosition {
	constructor(player) {
		this.x = player.x;
		this.y = player.y;
	}

	getDistance(player) {
		switch (player.direction) {
			case "up":
				return Math.floor(this.y) - player.y;
			case "down":
				return player.y - Math.ceil(this.y);
			case "left":
				return Math.floor(this.x) - player.x;
			case "right":
				return player.x - Math.ceil(this.x);
		}
	}
}

class Player {
	constructor(grid) {
		this.x = grid.gridSize >> 1;
		this.y = grid.gridSize >> 1;
		this.speed = DEFAULT.PLAYER_SPEED;
		this.direction = "none";

		this.nextDirection = "none";
		this.movesQueue = [];
		this.lastPosition = new PlayerPosition(this);

		this.controller = new Controller();

		this.controller.on("up", () => this.addMove("up"));
		this.controller.on("down", () => this.addMove("down"));
		this.controller.on("left", () => this.addMove("left"));
		this.controller.on("right", () => this.addMove("right"));
	}

	moveByGridIncrease() {
		this.x += 1;
		this.y += 1;
	}

	addMove(direction) {
		if (this.movesQueue.length > 0) return;

		this.movesQueue.push(direction);
	}

	tick(deltaTime) {
		// First start at the beginning
		if (this.direction == "none" && this.movesQueue.length > 0) {
			this.direction = this.movesQueue[0];
			this.movesQueue.shift();
		}

		if (this.nextDirection == "none" && this.movesQueue.length > 0) {
			if (this.movesQueue[0] != this.direction) {
				this.nextDirection = this.movesQueue[0];
				this.lastPosition = new PlayerPosition(this);
			}

			this.movesQueue.shift();
		}

		// Move player in actual direction
		switch (this.direction) {
			case "up":
				this.y -= this.speed * deltaTime;
				break;
			case "down":
				this.y += this.speed * deltaTime;
				break;
			case "left":
				this.x -= this.speed * deltaTime;
				break;
			case "right":
				this.x += this.speed * deltaTime;
				break;
		}

		if (
			this.nextDirection != "none" &&
			this.lastPosition.getDistance(this) >= 0
		) {
			const distance = this.lastPosition.getDistance(this);

			if (
				this.y <= Math.floor(this.lastPosition.y) &&
				this.direction == "up"
			)
				this.y = Math.floor(this.lastPosition.y);
			else if (
				this.y >= Math.ceil(this.lastPosition.y) &&
				this.direction == "down"
			)
				this.y = Math.ceil(this.lastPosition.y);
			else if (
				this.x <= Math.floor(this.lastPosition.x) &&
				this.direction == "left"
			)
				this.x = Math.floor(this.lastPosition.x);
			else if (
				this.x >= Math.ceil(this.lastPosition.x) &&
				this.direction == "right"
			)
				this.x = Math.ceil(this.lastPosition.x);

			this.direction = this.nextDirection;
			this.nextDirection = "none";

			switch (this.direction) {
				case "up":
					this.y -= distance;
					break;
				case "down":
					this.y += distance;
					break;
				case "left":
					this.x -= distance;
					break;
				case "right":
					this.x += distance;
					break;
			}
		}
	}

	draw(renderer, grid) {
		const { ctx, width, height } = renderer;

		const squareSize = Math.min(width, height) / grid.gridSize;

		ctx.fillStyle = THEME.playerColor;
		ctx.fillRect(
			this.x * squareSize,
			this.y * squareSize,
			squareSize,
			squareSize
		);
	}

	reset(grid) {
		this.x = grid.gridSize >> 1;
		this.y = grid.gridSize >> 1;
		this.speed = DEFAULT.PLAYER_SPEED;
		this.direction = "none";
	}
}

class Spawner {
	constructor() {}

	spawnFood(grid, food, player, amount) {
		for (let i = 0; i < amount; i++) {
			let x = Math.floor(Math.random() * grid.gridSize);
			let y = Math.floor(Math.random() * grid.gridSize);

			let excludedPositions = [
				{ x: player.x, y: player.y },
				{ x: player.x, y: player.y },
			];

			switch (player.direction) {
				case "up":
					excludedPositions[0].y = Math.ceil(player.y);
					excludedPositions[1].y = Math.floor(player.y);
					break;
				case "down":
					excludedPositions[0].y = Math.floor(player.y);
					excludedPositions[1].y = Math.ceil(player.y);
					break;
				case "left":
					excludedPositions[0].x = Math.ceil(player.x);
					excludedPositions[1].x = Math.floor(player.x);
					break;
				case "right":
					excludedPositions[0].x = Math.floor(player.x);
					excludedPositions[1].x = Math.ceil(player.x);
					break;
			}

			for (let foodItem of food.food) {
				excludedPositions.push({
					x: foodItem.x,
					y: foodItem.y,
				});
			}

			while (
				excludedPositions.some((pos) => pos.x === x && pos.y === y)
			) {
				x = Math.floor(Math.random() * grid.gridSize);
				y = Math.floor(Math.random() * grid.gridSize);
			}

			food.spawn(x, y);
		}
	}
}

class Renderer {
	constructor(selector, renderCallback) {
		this.canvas = document.querySelector(selector);
		this.ctx = this.canvas.getContext("2d");

		this.resize();
		window.addEventListener("resize", this.resize);

		this.fps = 0;

		this.lastTime = performance.now();
		this.renderCallback = renderCallback;
		this.render();
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}

	resize() {
		const { width, height } = this.canvas.getBoundingClientRect();

		this.canvas.width = width;
		this.canvas.height = height;
	}

	render() {
		const timeNow = performance.now();
		const deltaTime = (timeNow - this.lastTime) / 1000;
		this.lastTime = timeNow;

		this.fps = 1 / deltaTime;

		this.ctx.save();
		this.renderCallback(this, deltaTime);
		this.ctx.restore();

		requestAnimationFrame(this.render.bind(this));
	}
}

class Tick {
	constructor(tickCallback) {
		this.lastTime = performance.now();
		this.tickCallback = tickCallback;

		this.state = "paused"; // "paused" or "running"

		setInterval(
			function () {
				const timeNow = performance.now();
				const deltaTime = (timeNow - this.lastTime) / 1000;
				this.lastTime = timeNow;

				if (this.state == "running") {
					this.tickCallback(deltaTime);
				}
			}.bind(this)
		);
	}

	pause() {
		this.state = "paused";
	}

	run() {
		this.state = "running";
	}
}

class CollisionDetector {
	constructor() {}

	isPlayerCollidingWithWall(player, grid) {
		const playerX = player.x,
			playerY = player.y,
			gridSize = grid.gridSize;

		if (
			playerX < 0 ||
			playerX > gridSize - 1 ||
			playerY < 0 ||
			playerY > gridSize - 1
		)
			return true;
		return false;
	}

	isPlayerCollidingWithFood(player, food) {
		const playerX = player.x,
			playerY = player.y,
			playerDirection = player.direction,
			foodX = food.x,
			foodY = food.y;

		let roundedX = playerX,
			roundedY = playerY;

		switch (playerDirection) {
			case "up":
				roundedY = Math.floor(playerY);
				break;
			case "down":
				roundedY = Math.ceil(playerY);
				break;
			case "left":
				roundedX = Math.floor(playerX);
				break;
			case "right":
				roundedX = Math.ceil(playerX);
				break;
		}

		return foodX == roundedX && foodY == roundedY;
	}
}

class Game {
	constructor(selector) {
		this.sounds = new Sounds();
		this.textures = new Textures();

		this.sounds.add("eating", "assets/sounds/eating.mp3");

		this.textures.add("fruits", "assets/textures/fruits.png");

		this.level = 1;
		this.score = 0;

		this.grid = new Grid();
		this.food = new Food();
		this.player = new Player(this.grid);

		this.collisionDetector = new CollisionDetector();

		this.spawner = new Spawner();

		this.spawner.spawnFood(this.grid, this.food, this.player, 3);

		this.food.setEatEvent((foodItem) => {
			this.score += foodItem.points * 10;
			this.level += 1;
			this.grid.increaseSize();
			this.player.speed += 3;

			this.food.moveByGridIncrease();
			this.player.moveByGridIncrease();

			this.spawner.spawnFood(this.grid, this.food, this.player, 1);

			console.log(foodItem);
		});

		this.renderer = new Renderer(selector, (renderer) => {
			this.grid.animate(renderer);
			this.grid.draw(renderer);

			this.food.draw(renderer, this.textures, this.grid);
			this.player.draw(renderer, this.grid);
		});

		this.tick = new Tick((deltaTime) => {
			let calculatedDeltaTime =
				deltaTime * (0.1 + 0.9 * (1 - this.grid.gridZoomAnimationStep));

			this.grid.tick(deltaTime);
			this.player.tick(calculatedDeltaTime);

			if (
				this.collisionDetector.isPlayerCollidingWithWall(
					this.player,
					this.grid
				)
			) {
				alert("Game over! Your score is " + this.score + " and your level is " + this.level);
				this.reset();
			}

			this.food.forEach((foodItem, foodId) => {
				if (
					this.collisionDetector.isPlayerCollidingWithFood(
						this.player,
						foodItem
					)
				) {
					this.food.eatFood(foodId);
				}
			});
		});
	}

	reset() {
		this.grid.reset();
		this.food.reset();
		this.player.reset(this.grid);

		this.spawner.spawnFood(this.grid, this.food, this.player, 3);

		this.score = 0;
		this.level = 1;
	}

	start() {
		this.tick.run();
	}

	pause() {
		this.tick.pause();
	}
}
