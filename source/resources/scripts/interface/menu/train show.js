class TrainShow {
	constructor () {
		this.camera = new Camera(halfWidth, halfHeight + template.config.header.height * 0.5);
	};

	updateCamera (car) {
		this.camera.update(car.pos.x, car.pos.y);
	};

	drawSpawnPlace () {
		ctx.save();

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.setLineDash([4, 1]);
		ctx.lineWidth = 1;
		ctx.rectangleWithRoundedCorners(-education.physic.carHeight / 2, -education.physic.carWidth / 2, education.physic.carHeight, education.physic.carWidth, 3, false);

		ctx.restore();
	};

	drawRay (ray) {
		let {p1, p2} = ray.getDots();

		ctx.save();

		ctx.lineWidth = 1;

		ctx.strokeStyle = ctx.RGB(colors.red);
		ctx.fillStyle = ctx.RGB(colors.black);

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();

		ctx.circle(p1.x, p1.y, 2, true);
		ctx.circle(p2.x, p2.y, 2, true);

		ctx.restore();
	};

	drawCheckPoint (p1, p2) {
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = ctx.RGB(colors.green);
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
		ctx.restore();
	};

	drawCar (car, rays) {
		ctx.save();

		ctx.translate(car.pos.x, car.pos.y);
		ctx.rotate(inRad(car.angle - 90));

		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.rectangleWithRoundedCorners(-education.physic.carWidth * 0.5, -education.physic.carHeight * 0.5, education.physic.carWidth, education.physic.carHeight, 3, true);

		ctx.restore();

		ctx.save();

		let {p1, p2} = car.getCheckPoint();
		this.drawCheckPoint(p1, p2);

		ctx.restore();

		if (!rays) return;

		ctx.save();

		car.rays.forEach(ray => this.drawRay(ray));

		ctx.restore();
	};

	drawCars (rays, all) {
		ctx.save();
		let cars = education.cars.sort((a, b) => {
			if (a.dist > b.dist) return -1;
			if (a.dist < b.dist) return 1;
			return 0;
		});

		this.updateCamera(cars[0]);

		if (!all) {
			this.drawCar(cars[0], rays);
			ctx.restore();
			return;
		} 

		for (let i = cars.length - 1; i >= 0; i--) {
			if (education.physic.carInteraction && (!cars[i].active || cars[i].isEnd)) continue;

			ctx.globalAlpha = 1 - (i / cars.length);
			this.drawCar(cars[i], rays);
		}

		ctx.restore();
	};

	drawWalls () {
		ctx.save();

		const map = education.map.walls;

		ctx.lineWidth = 2;
		ctx.fillStyle = ctx.RGB(colors.black);

		let path = new Path2D();

		for (let j = 0; j < map.length; j++) {
			path.moveTo(map[j][0].x, map[j][0].y);
			for (let i = 1; i < map[j].length; i++) {
				path.lineTo(map[j][i].x, map[j][i].y);
			}
			path.closePath();
		}

		ctx.stroke(path);
		ctx.restore();
	};

	draw (rays, all) {
		ctx.save();

		this.camera.focus();
		
		this.drawWalls();
		this.drawCars(rays, all);

		this.drawSpawnPlace();

		ctx.restore();
	};
};