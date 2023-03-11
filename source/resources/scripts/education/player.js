//игрок
class Player {
	constructor (rays, weights, walls = education.map.walls, checkPoints = education.map.checkPoints, nnParams = education.eduParams, num = 0) {
		this.walls = walls;
		this.checkPoints = checkPoints;

		this.pos = new Vector(0, 0);
		this.vel = new Vector(0, 0);
		this.angle = 0;
		this.rotateVel = 0;

		this.dist = 0;
		
		this.isEnd = false;

		this.rays = rays.map(e => e.copy());

		this.NN = new NeuralNetwork(this.rays.length, nnParams.hidden1, nnParams.hidden2, 4, weights);

		// режим взаимодействия
		this.prescaler = 1;
		this.active = false;
		this.time = 0;
		this.num = num;
	};

	//сбросить
	restart () {
		this.pos = new Vector(0, 0);
		this.vel = new Vector(0, 0);
		this.angle = 0;
		this.rotateVel = 0;

		this.dist = 0;
		
		this.isEnd = false;

		this.rays.forEach(e => e.restart());
	};

	getCarsBorders (cars) {
		let bordersList = [];
		let linkList = [];

		for (let i of cars) {
			if (i.active && !i.isEnd && i.num !== this.num) {
				let borders = i.getCarHitbox();
				borders.push(borders[0]);

				bordersList.push(borders);

				linkList.push({
					car: i,
					borders: borders,
				});
			}
		}

		return [bordersList, linkList];
	};

	getControl () {
		let input = [];

		for (let i in this.rays) {
			input.push(scale(this.rays[i].data, 0, 1, 0.01, 0.99));
		}

		let result = this.NN.querry(input);
		//return [result[0], result[1] * 2 - 1];
		return [Math.round(result[0]) - Math.round(result[1]), Math.round(result[2]) - Math.round(result[3])];
	};

	getCheckPoint () {
		const checkPoints = this.checkPoints;

		let dots = {
			p1: checkPoints[(this.dist * 2) % (checkPoints.length)], 
			p2: checkPoints[(this.dist * 2) % (checkPoints.length) + 1], 
		};

		if (dots.p1 && dots.p2) {
			return dots;
		} else {
			return {p1: null, p2: null};
		}
	};

	getCarHitbox () {
		const config = education.physic;

		let carHitbox = [
			new Vector(-config.carHeight / 2, -config.carWidth / 2),
			new Vector(config.carHeight / 2, -config.carWidth / 2),
			new Vector(config.carHeight / 2, config.carWidth / 2),
			new Vector(-config.carHeight / 2, config.carWidth / 2),
		];

		for (let i = 0; i < carHitbox.length; i++) {
			carHitbox[i] = this.pos.copy().add(carHitbox[i].rotate(carHitbox[i].getAngle() + inRad(this.angle)));
		}

		return carHitbox;
	}

	updateRays (addWalls) {
		let walls = this.walls.concat(addWalls);

		for (let i in this.rays) {
			this.rays[i].update(this.pos, this.angle, walls);
		}
	};

	checkCollision () {
		if (this.isEnd) return;

		const map = this.walls;
		const carHitbox = this.getCarHitbox();

		for (let k in map) {
			let line = map[k];
			
			for (let i = 1; i < line.length; i++) {
				for (let j = 1; j < carHitbox.length; j++) {
					let p1 = carHitbox[j % 4];
					let p2 = carHitbox[j - 1];
					let p3 = line[i - 1];
					let p4 = line[i];

					if (physic.lineIntersection(p1, p2, p3, p4) !== -1) {
						this.isEnd = true;
						return;
					}
				}
			}
		}
	};

	// проверка на столкновение с машиной
	checkCarsCollision (linkList) {
		const carHitbox = this.getCarHitbox();

		for (let link of linkList) {
			let line = link.borders;
			
			for (let i = 1; i < line.length; i++) {
				for (let j = 1; j < carHitbox.length; j++) {
					let p1 = carHitbox[j % 4];
					let p2 = carHitbox[j - 1];
					let p3 = line[i - 1];
					let p4 = line[i];

					if (physic.lineIntersection(p1, p2, p3, p4) !== -1) {
						this.isEnd = true;
						this.prescaler = education.eduParams.collisionPrescaler;
						link.car.isEnd = true;
						link.car.prescaler = education.eduParams.collisionPrescaler;
						return;
					}
				}
			}
		}
	};

	//проверка на пересечение с чекпоинтом
	checkDist () {
		let {p1, p2} = this.getCheckPoint();
		if (!p1) return;

		const carHitbox = this.getCarHitbox();

		for (let j = 1; j < carHitbox.length; j++) {
			let p3 = carHitbox[j % 4];
			let p4 = carHitbox[j - 1];

			if (physic.lineIntersection(p1, p2, p3, p4) !== -1) {
				this.dist++;
				return;
			}
		}
	};

	checkActive () {
		let activeTime = this.num * education.physic.spawnInterval;

		this.time += 1000 / 60;

		if (this.time >= activeTime) {
			let control = this.getControl();

			if (control[0] !== 0) {
				this.active = true;
			} else {
				this.time -= Infinity;
			}
		}
	};

	move (control, config = education.physic, updateRays = true, interaction = false, cars = []) {
		if (interaction && !this.active) {
			this.checkActive();
			return;
		}

		control = control ?? this.getControl();

		control[1] *= control[0];
		this.rotateVel = this.vel.mag() / config.speedLimit * config.rotateSpeed * control[1];
		if (control[1] === 0) this.rotateVel = 0;
		this.angle = (this.angle + this.rotateVel + 360) % 360;

		let acc = new Vector(0, 0);
		if (control[0] === 1) {
			acc = new Vector(config.acc, 0).rotate(inRad(this.angle));
		} else if (control[0] === -1) {
			acc = new Vector(config.acc, 0).rotate(inRad((this.angle + 180) % 360));
		}

		this.vel.add(acc);
		if (control[0] === 0) this.vel.mult(config.smooth);

		this.vel.limit(config.speedLimit);
		this.pos.add(this.vel);

		let addWalls = [];
		if (interaction) {
			let [bordersList, linkList] = this.getCarsBorders(cars);
			addWalls = bordersList;

			this.checkCarsCollision(linkList);
		} 

		this.checkDist();
		this.checkCollision();
		this.updateRays(addWalls);
	};

	getPlayer () {
		return {
			rate: this.dist * this.prescaler,
			weights: this.NN.getWeights(),
		};
	};
};
