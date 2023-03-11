(() => {

//класс файла
class SimulationMenu extends Menu {
	constructor () {
		super();

		this.config = {
			switchModeBtn: {
				width: 180,
				height: template.homeBtnHeight,

				textSize: 16,
				margin: 29,
			},
		};

		this.marginTop = template.headerOffset + template.titleSize + template.headerMargin + template.config.field.paddingTop + template.subTitleSize + 42;
		this.lineHeight = 90;

		this.fieldHeight = this.lineHeight * 3 + template.config.field.paddingTop * 3 + template.subTitleSize;

		// ФИЗИКА 
		//ускорение
		this.sliderAcc = this.createSlider(0, 0, "Ускорение", 0.1, 0.8);

		//трение
		this.sliderSmooth = this.createSlider(0, 1, "Трение", 0.9, 1.0);

		//скорость поворота
		this.sliderRotateSpeed = this.createSlider(0, 2, "Скорость поворота", 3, 6);

		this.switchModeBtn = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + this.margin;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.switchModeBtn.width,
			height: this.config.switchModeBtn.height,

			textSize: this.config.switchModeBtn.textSize,

			margin: this.config.switchModeBtn.margin,
		}, () => {
			if (this.mode === "driver") {
				this.open();
				return;
			} 

			this.setupDriverMode();
		}, hitbox => {
			let text = this.mode === "ai" ? "ручное управление" : "экспорт весов";
			template.drawBtn(hitbox, true, text);
		}, hitbox => {
			let text = this.mode === "ai" ? "ручное управление" : "экспорт весов";
			template.drawBtnHover(hitbox, true, text);
		});

		this.homeBtn = elements.btn({
			get x () {
				return layout.paddingLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: template.homeBtnWidth,
			height: template.homeBtnHeight,
		}, () => {
			controller.to("main menu");
		}, hitbox => {
			template.drawHomeBtn(hitbox);
		}, hitbox => {
			template.drawHomeBtnHover(hitbox);
		});

		this.elems = [
			this.homeBtn,
			this.switchModeBtn,

			this.sliderAcc,
			this.sliderSmooth,
			this.sliderRotateSpeed,
		];

	};

	createSlider (x, y, text, min, max) {
		return elements.slider({
			marginTop: this.marginTop,
			lineHeight: this.lineHeight,

			col: x,
			row: y,

			get x () {
				return layout.column(this.col) + template.config.field.paddingLeft;
			},

			get y () {
				return layout.row(this.marginTop, this.lineHeight, 0, this.row) + template.config.slider.textMarginBottom;
			},

			width: template.config.slider.width,
			height: template.config.slider.height,
			text: text,
		}, (hitbox, dragWidth, dragMax, realValue, value) => {
			template.drawSlider(hitbox, dragWidth, dragMax, realValue, value);
		}, min, max, template.config.slider.dragWidth);
	};

	onactive (walls, checkPoints) {
		this.walls = walls;
		this.checkPoints = checkPoints;

		this.camera = new Camera(halfWidth, halfHeight);

		this.setupDriverMode();
	};

	loadPopulation (populationData) {
		let {physic, rays, weights, eduParams} = populationData;

		this.sliderAcc.value = physic.acc;
		this.sliderSmooth.value = physic.smooth;
		this.sliderRotateSpeed.value = physic.rotateSpeed;

		let raysObjects = rays.map(e => new Ray(e.len, e.dir, new Vector(e.mixing.x, e.mixing.y)));

		this.cars = weights.map(e => new Player(raysObjects, e, this.walls, this.checkPoints, eduParams)).reverse();

		this.mode = "ai";
	};

	open () {
		let load = this.loadPopulation.bind(this);

		let openField = document.createElement("input");
		openField.setAttribute("type", "file");
		openField.setAttribute("accept", ".json");

		openField.addEventListener("change", e => {
			let file = e.target.files[0];
			let fileReader = new FileReader();

			fileReader.readAsText(file);

			fileReader.onload = readerEvent => {
				let data = JSON.parse(readerEvent.target.result); 
				load(data);
			};
		});

		openField.click();
	};

	setupDriverMode () {
		this.mode = "driver";
		this.cars = [new Player([], null, this.walls, this.checkPoints)];
	};

	drawPhysicBlock () {
		ctx.save();

		ctx.translate(layout.column(0), template.headerOffset + template.titleSize + template.headerMargin);

		const blockWidth = layout.fieldWidth(3);

		template.field(0, 0, blockWidth, this.fieldHeight);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.subTitle("Физика", 0, 0);

		ctx.restore();
	};

	drawTitle () {
		ctx.save();
		template.title("Проверка трека", layout.paddingLeft, template.headerOffset);
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

		const map = this.walls;

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

	drawCar (car, color) {
		ctx.save();

		ctx.translate(car.pos.x, car.pos.y);
		ctx.rotate(inRad(car.angle - 90));

		ctx.fillStyle = ctx.RGB(color);
		ctx.rectangleWithRoundedCorners(-education.physic.carWidth * 0.5, -education.physic.carHeight * 0.5, education.physic.carWidth, education.physic.carHeight, 3, true);

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

	createControl () {
		let control = [0, 0];

		if (keys.isPressed("KeyW")) {
			control[0] += 1;
		}

		if (keys.isPressed("KeyS")) {
			control[0] += -1;
		}

		if (keys.isPressed("KeyA")) {
			control[1] += -1;
		}

		if (keys.isPressed("KeyD")) {
			control[1] += 1;
		}

		return control;
	};

	refreshCar (car, control, physic, color) {
		car.move(control, physic, this.mode === "ai");
		if (car.isEnd) car.restart();

		this.drawCar(car, color);

		let {p1, p2} = car.getCheckPoint();

		this.drawCheckPoint(p1, p2);
	};

	simulate () {
		ctx.save();

		const physic = {
			acc: this.sliderAcc.value,
			smooth: this.sliderSmooth.value,
			rotateSpeed: this.sliderRotateSpeed.value,

			speedLimit:education.physic.speedLimit,
			carWidth: education.physic.speedLimit,
			carHeight: education.physic.speedLimit,
		};

		let control = this.mode === "driver" ? this.createControl() : null;

		this.camera.update(this.cars[this.cars.length - 1].pos.x, this.cars[this.cars.length - 1].pos.y);
		this.camera.focus();
		this.drawWalls();

		this.cars.forEach((e, i) => {
			let color = i === this.cars.length - 1 && this.mode === "ai" ? colors.lightGreen : colors.darkGrey;
			this.refreshCar(e, control, physic, color);
		});

		ctx.restore();
	};

	update () {
		ctx.save();

		this.simulate();

		template.drawHeader();
		this.drawTitle();
		this.drawPhysicBlock();
		this.drawElems();

		ctx.restore();
	};
};

// экспорт
window.SimulationMenu = SimulationMenu;

})();