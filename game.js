const DEFAULT = {
	GRID_SIZE: 5,
	ZOOM_DURATION: 0.5,
	PLAYER_SPEED: 1,
	// MAX_VISIBLE_GRID_SIZE: 9,
};

const THEME = {
	playerColor: "#FF6347",
	lightColor: "rgb(163, 196, 212)",
	borderRadius: 8,
	appleColor: "#FF0000",
	bananaColor: "#FFD700",
	cherryColor: "#FF1493",
	foodTextColor: "#FFFFFF",
};

const FOOD_TYPES = [
	{
		type: "pear",
		points: 4,
		spawnRate: 0.3,
	},
	{
		type: "apple",
		points: 3,
		spawnRate: 0.4,
	},
	{
		type: "banana",
		points: 5,
		spawnRate: 0.2,
	},
	{
		type: "cherry",
		points: 10,
		spawnRate: 0.1,
	},
];

const FOOD_TEXTURE_COORDS = {
	banana: [0, 0, 1200, 1200],
	apple: [1200, 0, 1200, 1200],
	pear: [2400, 0, 1200, 1200],
	cherry: [3600, 0, 1200, 1200],
};

function minmax(n, min, max) {
	return Math.min(Math.max(n, min), max);
}

class Sounds {
	constructor() {
		this.sounds = {};
		this.volume = 0;
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
		if (this.volume == 0) return;

		this.sounds[name].volume = this.volume;
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

class Zoom {
	constructor() {
		this.step = 0;
		this.duration = DEFAULT.ZOOM_DURATION;
	}

	addStep() {
		this.step += 1;
	}

	update(deltaTime) {
		this.step = Math.max(this.step - deltaTime / this.duration, 0);
	}

	apply(renderer, grid, player) {
		const { width, height, ctx } = renderer;
		const { x, y } = player;
		const { size } = grid;
		const { MAX_VISIBLE_GRID_SIZE: max } = DEFAULT;
		const { step } = this;
		
		const scale = size / (size - step * 2);
		const translation = Math.min(width, height) / size * -step;

		ctx.save();

		ctx.scale(scale, scale);
		ctx.translate(translation, translation);
	}

	remove(renderer) {
		const { ctx } = renderer;

		ctx.restore();
	}

	draw(renderer, grid, player) {
		const { width, height, ctx } = renderer;
		const { x, y } = player;
		const { size } = grid;
		const { MAX_VISIBLE_GRID_SIZE: max } = DEFAULT;
		const { step } = this;

		const scale = size > max ? max / (size - step * 2) : size / (size + step * 2);
		const cx = minmax(width*(x+0.5)/size, width*scale/2, (1 - scale/2) * width);
		const cy = minmax(height*(y+0.5)/size, height*scale/2, (1 - scale/2) * height);

		ctx.strokeStyle = "red";
		ctx.lineWidth = 10;

		ctx.strokeRect(cx - width*scale/2, cy - height*scale/2, width * scale, height * scale);
	}
}

class Grid {
	constructor() {
		this.size = DEFAULT.GRID_SIZE;
	}

	increaseSize() {
		this.size += 2;
	}

	reset() {
		this.size = DEFAULT.GRID_SIZE;
	}

	draw(renderer) {
		const { width, height, ctx } = renderer;

		const squareSize = Math.min(width, height) / this.size;

		ctx.clearRect(0, 0, width, height);

		ctx.strokeStyle = THEME.lightColor;
		ctx.lineWidth = width / this.size / 50;

		const gradientColor = THEME.lightColor.replace(")", ", .3)");
		const gradientThickness = width / this.size / 2;

		ctx.canvas.style = `--light-size: ${gradientThickness / 4}px`;

		for (let i = 1; i < this.size; i++) {
			// vertical gradient
			const verticalGradient = ctx.createLinearGradient(
				i * squareSize - gradientThickness,
				0,
				i * squareSize + gradientThickness,
				0
			);

			verticalGradient.addColorStop(0.3, "transparent");
			verticalGradient.addColorStop(0.5, gradientColor);
			verticalGradient.addColorStop(0.7, "transparent");

			ctx.fillStyle = verticalGradient;
			ctx.fillRect(
				i * squareSize - gradientThickness,
				0,
				i * squareSize,
				height
			);

			ctx.beginPath();
			ctx.moveTo(i * squareSize, 0);
			ctx.lineTo(i * squareSize, height);
			ctx.stroke();

			// horizontal gradient
			const horizontalGradient = ctx.createLinearGradient(
				0,
				i * squareSize - gradientThickness,
				0,
				i * squareSize + gradientThickness
			);

			horizontalGradient.addColorStop(0.3, "transparent");
			horizontalGradient.addColorStop(0.5, gradientColor);
			horizontalGradient.addColorStop(0.7, "transparent");

			ctx.fillStyle = horizontalGradient;
			ctx.fillRect(
				0,
				i * squareSize - gradientThickness,
				height,
				i * squareSize
			);

			ctx.beginPath();
			ctx.moveTo(0, i * squareSize);
			ctx.lineTo(width, i * squareSize);
			ctx.stroke();
		}

		// Border
		ctx.save();
		ctx.resetTransform();
		ctx.strokeRect(
			ctx.lineWidth / 2,
			ctx.lineWidth / 2,
			width - ctx.lineWidth,
			height - ctx.lineWidth
		);
		ctx.restore();

		// Border light

		const topGradient = ctx.createLinearGradient(
			0,
			0,
			0,
			gradientThickness / 2
		);

		topGradient.addColorStop(0, gradientColor);
		topGradient.addColorStop(1, "transparent");

		ctx.fillStyle = topGradient;
		ctx.fillRect(0, 0, width, gradientThickness / 2);

		const bottomGradient = ctx.createLinearGradient(
			0,
			height,
			0,
			height - gradientThickness / 2
		);

		bottomGradient.addColorStop(0, gradientColor);
		bottomGradient.addColorStop(1, "transparent");

		ctx.fillStyle = bottomGradient;
		ctx.fillRect(
			0,
			height - gradientThickness / 2,
			width,
			gradientThickness / 2
		);

		const leftGradient = ctx.createLinearGradient(
			0,
			0,
			gradientThickness / 2,
			0
		);

		leftGradient.addColorStop(0, gradientColor);
		leftGradient.addColorStop(1, "transparent");

		ctx.fillStyle = leftGradient;
		ctx.fillRect(0, 0, gradientThickness / 2, height);

		const rightGradient = ctx.createLinearGradient(
			width,
			0,
			width - gradientThickness / 2,
			0
		);

		rightGradient.addColorStop(0, gradientColor);
		rightGradient.addColorStop(1, "transparent");

		ctx.fillStyle = rightGradient;
		ctx.fillRect(
			width - gradientThickness / 2,
			0,
			gradientThickness / 2,
			height
		);
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

		const squareSize = Math.min(width, height) / grid.size;

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
		this.x = grid.size >> 1;
		this.y = grid.size >> 1;
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

		// Move player at his direction
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

		const squareSize = Math.min(width, height) / grid.size;

		ctx.fillStyle = THEME.playerColor;
		ctx.fillRect(
			this.x * squareSize,
			this.y * squareSize,
			squareSize,
			squareSize
		);
	}

	reset(grid) {
		this.x = grid.size >> 1;
		this.y = grid.size >> 1;
		this.speed = DEFAULT.PLAYER_SPEED;
		this.direction = "none";
		this.movesQueue = [];
		this.nextDirection = "none";
		this.lastPosition = new PlayerPosition(this);
	}
}

class Spawner {
	constructor() {}

	spawnFood(grid, food, player, amount) {
		for (let i = 0; i < amount; i++) {
			let x = Math.floor(Math.random() * grid.size);
			let y = Math.floor(Math.random() * grid.size);

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
				x = Math.floor(Math.random() * grid.size);
				y = Math.floor(Math.random() * grid.size);
			}

			food.spawn(x, y);
		}
	}
}

class Renderer {
	constructor(selector, renderCallback) {
		this.canvas = document.querySelector(selector);
		this.ctx = this.canvas.getContext("2d");

		this.lastWidth = this.canvas.width;
		this.lastHeight = this.canvas.height;

		this.resize();

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
		const { width, height } = this.canvas.getBoundingClientRect();
		if (this.lastWidth != width || this.lastHeight != height) {
			this.resize();
			this.lastWidth = width;
			this.lastHeight = height;
		}

		const timeNow = performance.now();
		const deltaTime = (timeNow - this.lastTime) / 1000;
		this.lastTime = timeNow;

		this.fps = 1 / deltaTime;

		this.ctx.clearRect(0, 0, width, height);

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
			gridSize = grid.size;

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
		this.events = {
			over() {},
		};

		this.sounds = new Sounds();
		this.textures = new Textures();

		this.sounds.add("eating", "assets/sounds/eating.mp3");		

		this.textures.add("fruits", "assets/textures/fruits-neon.png");

		this.level = 1;
		this.score = 0;

		this.grid = new Grid();
		this.food = new Food();
		this.player = new Player(this.grid);

		this.zoom = new Zoom();

		this.collisionDetector = new CollisionDetector();

		this.spawner = new Spawner();

		// Game settings
		this.speedIncrease = speed => speed + 2;
		this.acceleration = 0;
		this.spawnRate = 1;
		this.gridIncreasing = true;
		this.autoSpawning = true;
		this.timeScoring = false;

		this.startTime = Date.now();

		this.spawner.spawnFood(this.grid, this.food, this.player, this.spawnRate);

		this.food.setEatEvent((foodItem) => {
			if (!this.timeScoring) this.score += foodItem.points * 10;
			this.level += 1;

			if (this.acceleration == 0) this.player.speed = this.speedIncrease(this.player.speed);

			if (this.gridIncreasing) {
				this.grid.increaseSize();
				this.zoom.addStep();
				this.food.moveByGridIncrease();
				this.player.moveByGridIncrease();
			}

			if (this.autoSpawning) this.spawner.spawnFood(this.grid, this.food, this.player, 1);
		});

		this.renderer = new Renderer(selector, (renderer, deltaTime) => {
			this.zoom.update(deltaTime);

			this.zoom.apply(renderer, this.grid, this.player);

			this.grid.draw(renderer, deltaTime);

			this.food.draw(renderer, this.textures, this.grid);
			this.player.draw(renderer, this.grid);

			this.zoom.remove(renderer, this.grid);
		});

		this.tick = new Tick((deltaTime) => {
			// let playerDeltaTime =
			// 	deltaTime *
			// 	(1 - DEFAULT.ZOOM_DURATION * Math.min(this.zoom.step, 1));
			this.player.speed += this.acceleration * deltaTime;

			this.player.tick(deltaTime);

			if (
				this.collisionDetector.isPlayerCollidingWithWall(
					this.player,
					this.grid
				)
			) {
				if (this.timeScoring) this.score = Math.round((Date.now() - this.startTime) / 1000 * this.level) * 10;
				this.events.over();
			}

			this.food.forEach((foodItem, foodId) => {
				if (
					this.collisionDetector.isPlayerCollidingWithFood(
						this.player,
						foodItem
					)
				) {
					this.food.eatFood(foodId);
					this.sounds.play("eating");
				}
			});
		});
	}

	on(eventName, callback) {
		this.events[eventName] = callback;
	}

	reset() {
		this.grid.reset();
		this.food.reset();
		this.player.reset(this.grid);

		this.score = 0;
		this.level = 1;
	}

	start() {
		this.player.reset(this.grid);
		this.tick.run();

		this.spawner.spawnFood(this.grid, this.food, this.player, this.spawnRate);

		this.startTime = Date.now();
	}

	pause() {
		this.tick.pause();
	}
}
