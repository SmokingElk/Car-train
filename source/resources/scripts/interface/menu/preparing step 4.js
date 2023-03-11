(() => {

//константы и переменные
const columnLeftText = "4-й шаг необходим для проверки корректности заданных на предыдущих этапах параметров. Рекомендуется выполнить следующие шаги: 1. Пройдите трек самостоятельно, управляя автомобилем с клавиатуры (управление осуществляется клавишами-стрелками или WASD). 2. Убедитесь, что контрольные линии пересекаются автомобилем в соответствии с ожиданием. "; 
const columnRightText = "4-й шаг необходим для проверки корректности заданных на предыдущих этапах параметров. Рекомендуется выполнить следующие шаги: 1. Пройдите трек самостоятельно, управляя автомобилем с клавиатуры (управление осуществляется клавишами управления курсором или алфавитными клавишами со значениями WASD). 2. Убедитесь, что контрольные линии пересекаются автомобилем в соответствии с ожиданием. ";

//класс файла
class PreparingStep4 extends PreparingStep {
	constructor () {
		super({
			subtitle: "4-й этап",
			columnLeftText,
			columnRightText,
			backMenuName: "preparing step 4",
		});

		this.config = {
			zoom: 1.35,
		};

		this.checkboxWalls = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			y: template.headerOffset + template.titleSize + 56 + template.subTitleSize,
			radius: 8,
			text: "стены",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		this.checkboxRays = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			y: template.headerOffset + template.titleSize + 95 + template.subTitleSize,
			radius: 8,
			text: "лучи",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		elements.groupCheckbox([
			this.checkboxWalls,
			this.checkboxRays,
		]);

		this.elems = [
			this.readyBtn,
			this.homeBtn,
			this.helpBtn,

			this.checkboxWalls,
			this.checkboxRays,
		].concat(this.createStepBtns(4));

		this.stop = false;

		this.camera = new Camera(halfWidth, halfHeight);
	};

	onactive () {
		this.timer = this.params.unready;

		this.checkboxWalls.switch(true);

		this.camera = new Camera(halfWidth, halfHeight);
		this.camera.setRealZoom(this.config.zoom);

		if (education.rays.length === 0 || education.map.walls.length === 0 || education.map.checkPoints.length === 0) {
			this.stop = true;
		} else {
			this.stop = false;
			this.car = new Player(education.rays);
		}
	};

	drawTitle () {
		ctx.save();
		template.title("Проверка трека", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	drawHint () {
		ctx.save();
		template.text("показывать:", layout.paddingLeft, template.headerOffset + template.titleSize + 31);
		ctx.restore();
	};

	drawWarning () {
		ctx.save();
		template.subTitle("Завершите предыдущие шаги", halfWidth, halfHeight + template.config.header.height * 0.5, "center", "middle");
		ctx.restore();
	};

	createControl () {
		let control = [0, 0];

		if (keys.isPressed("KeyW") || keys.isPressed("ArrowUp")) {
			control[0] += 1;
		}

		if (keys.isPressed("KeyS") || keys.isPressed("ArrowDown")) {
			control[0] += -1;
		}

		if (keys.isPressed("KeyA") || keys.isPressed("ArrowLeft")) {
			control[1] += -1;
		}

		if (keys.isPressed("KeyD") || keys.isPressed("ArrowRight")) {
			control[1] += 1;
		}

		return control;
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

	drawCar (car, rays) {
		ctx.save();

		ctx.translate(car.pos.x, car.pos.y);
		ctx.rotate(inRad(car.angle - 90));

		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.rectangleWithRoundedCorners(-education.physic.carWidth * 0.5, -education.physic.carHeight * 0.5, education.physic.carWidth, education.physic.carHeight, 3, true);

		ctx.restore();

		if (!rays) return;

		ctx.save();

		car.rays.forEach(ray => this.drawRay(ray));

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

	drawTrack () {
		ctx.save();

		this.car.move(this.createControl());
		if (this.car.isEnd) this.car.restart();

		this.camera.update(this.car.pos.x, this.car.pos.y);

		this.camera.focus();

		if (this.checkboxWalls.select) this.drawWalls();

		this.drawCar(this.car, this.checkboxRays.select);

		let {p1, p2} = this.car.getCheckPoint();

		this.drawCheckPoint(p1, p2);

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.setLineDash([4, 1]);
		ctx.lineWidth = 1;
		ctx.rectangleWithRoundedCorners(-education.physic.carHeight * 0.5, -education.physic.carWidth * 0.5, education.physic.carHeight, education.physic.carWidth, 3, false);

		ctx.restore();
	};

	update () {
		ctx.save();

		if (this.stop) {
			this.drawWarning();
		} else {
			this.drawTrack();
		}

		template.drawHeader();
		this.drawFakeBtn(4);

		this.drawTitle();
		this.drawHint();

		this.drawElems();
		this.drawUnready();

		ctx.restore();
	};
};

// экспорт
window.PreparingStep4 = PreparingStep4;

})();

