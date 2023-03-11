class WeightsVisualizationMenu extends Menu {
	constructor () {
		super();

		this.config = {
			btnGoBackWidth: 116,

			layerSpacing: 200,
			neuronSpacing: 40,
			neuronSize: 8,
			lineWidth: 2,
		};

		this.btnGoBack = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + template.config.trainBtn.marginLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.btnGoBackWidth,
			height: template.config.trainBtn.height,

			text: "назад",
		}, () => {
			controller.to("progress menu");
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
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
			this.btnGoBack,
		];

		this.camera = new Camera(halfWidth, halfHeight + template.config.header.height * 0.5);
		this.lastPos = new Vector(0, 0);
		this.drag = false;
		this.createEventListeners();
	};

	onactive () {
		this.camera = new Camera(halfWidth, halfHeight + template.config.header.height * 0.5);
		this.lastPos = new Vector(0, 0);
		this.drag = false;
	};

	createEventListeners () {
		window.addEventListener("mousedown", e => {
			if (!this.active) return;

			if (e.which === 1) this.drag = true;
		});

		window.addEventListener("mouseup", e => {
			if (!this.active) return;

			if (e.which === 1) this.drag = false;
		});
	};

	updateCamera () {
		if (this.drag) {
			let shift = calcVector.sub(mouse, this.lastPos).mult(-1).div(this.camera.realZoom);
			this.camera.update(this.camera.x + shift.x, this.camera.y + shift.y);
		}

		this.lastPos = mouse.copy();
	};

	get bestNN () {
		let bestWeights = null;
		let score = -1;

		for (let i of education.cars) {
			if (i.dist > score) {
				score = i.dist;
				bestWeights = i.NN;
			}
		}

		return bestWeights;
	};

	drawLayer (matrix, n) {
		ctx.save();

		let startInput = -matrix.width / 2;
		let startOutput = -matrix.height / 2;

		ctx.translate(this.config.layerSpacing * n, 0);

		matrix.forEach((weight, x, y) => {
			let x1 = 0;
			let x2 = this.config.layerSpacing;
			let y1 = (startInput + x) * this.config.neuronSpacing;
			let y2 = (startOutput + y) * this.config.neuronSpacing;

			ctx.lineWidth = Math.abs(this.config.lineWidth * weight);
			ctx.strokeStyle = ctx.RGB(weight < 0 ? colors.red : colors.blue);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();

			ctx.fillStyle = ctx.RGB(colors.white);
			ctx.circle(x1, y1, this.config.neuronSize, true);
			ctx.lineWidth = 1;
			ctx.strokeStyle = ctx.RGB(colors.black);
			ctx.circle(x1, y1, this.config.neuronSize, false);

			return weight;
		});

		ctx.restore();
	};

	drawNeuralNetwork () {
		ctx.save();

		this.updateCamera();

		this.camera.focus();
		
		let bestNN = this.bestNN;

		const weights = bestNN.getWeights()

		const layersCount = weights.length;
		const inputNeuronsCount = education.rays.length;
		const outputNeuronsCount = bestNN[`weights${layersCount}${layersCount + 1}`].height;

		ctx.save();
		ctx.translate(-this.config.neuronSize * 2, -inputNeuronsCount / 2 * this.config.neuronSpacing);

		for (let i = 0; i < inputNeuronsCount; i++) {
			template.text(i + 1, 0, i * this.config.neuronSpacing, "right", "middle");
		}

		ctx.restore();

		for (let i = 0; i < layersCount; i++) this.drawLayer(bestNN[`weights${i + 1}${i + 2}`], i);

		ctx.translate(layersCount * this.config.layerSpacing, -outputNeuronsCount / 2 * this.config.neuronSpacing);

		let dirsList = [
			"вперед",
			"назад",
			"вправо",
			"влево",
		];

		ctx.lineWidth = 1;
		ctx.strokeStyle = ctx.RGB(colors.black);

		for (let i = 0; i < outputNeuronsCount; i++) {
			ctx.fillStyle = ctx.RGB(colors.white);
			ctx.circle(0, i * this.config.neuronSpacing, this.config.neuronSize, true);
			ctx.circle(0, i * this.config.neuronSpacing, this.config.neuronSize, false);
			template.text(dirsList[i], this.config.neuronSize * 2, i * this.config.neuronSpacing, "left", "middle");
		}

		ctx.restore();
	};

	drawRay (ray, rayNum) {
		const start = ray.start;
		const end = ray.end;
		const dir = end.copy().sub(start).norm();
		const textPos = start.copy().add(dir.mult(ray.len + template.textSize * 2));

		ctx.save();

		ctx.lineWidth = 1;
		ctx.strokeStyle = ctx.RGB(colors.red);
		ctx.fillStyle = ctx.RGB(colors.black);

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();

		ctx.circle(start.x, start.y, 2, true);
		ctx.circle(end.x, end.y, 2, true);
		template.text(rayNum, textPos.x, textPos.y, "center", "middle");

		ctx.restore();
	};

	drawCar () {
		const carWidth = education.physic.carWidth;
		const carHeight = education.physic.carHeight;

		ctx.save();

		this.camera.focus();

		ctx.translate(-halfWidth * 0.48, -20);

		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.rectangleWithRoundedCorners(-carHeight / 2, -carWidth / 2, carHeight, carWidth, 3, true);

		education.rays.forEach((e, i) => this.drawRay(e, i + 1));

		ctx.restore();
	};	

	drawTitle () {
		ctx.save();
		template.title("Визуализация весов сети", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	drawHint () {
		ctx.save();

		ctx.translate(layout.paddingLeft, template.headerOffset + template.titleSize + 31);

		ctx.fillStyle = ctx.RGB(colors.red);
		ctx.fillRect(0, template.textSize * 0.5 - 1, 19, 2);
		ctx.fillStyle = ctx.RGB(colors.blue);
		ctx.fillRect(0, template.textSize * 0.5 - 1 + 29, 19, 2);

		ctx.translate(25, 0);

		template.text("положительный вес", 0, 0);
		template.text("отрицательный вес", 0, template.textSize + 15);

		ctx.restore();
	};

	update () {
		ctx.save();

		this.drawNeuralNetwork();
		this.drawCar();

		template.drawHeader();
		this.drawTitle();
		this.drawHint();

		this.drawElems();

		ctx.restore();
	};
};