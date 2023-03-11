(() => {

const columnLeftText = "На 3-м этапе необходимо создать трек. Этот этап можно условно разделить на два шага. Для начала необходимо определить границы трека. Стоит отметить, что алгоритму проще проходить трек, когда он имеет как внешнюю, так и внутреннюю границу, а также ни одна из них не содержит разрывов (соблюдение этого условия рекомендуется, однако, оно не является необходимым). Начать прорисовку линии можно кликнув левой кнопкой мыши в нужном месте, а завершить линию можно используя сочетание клавиш Ctrl+X (при этом линия будет автоматически замкнута). "; 
const columnRightText = "На 2-м шаге необходимо расположить контрольные линии, которые будут использоваться для определения пройденного автомобилем расстояния. Эти линии должны последовательно пересекать линию движения, и располагаться перпендикулярно ей. При этом номер линии должен увеличиваться вместе с пройденным расстоянием. Важно также отметить, что линии стоит располагать таким образом, чтобы они пересекали как как внешнюю, так и внутреннюю границу трека. Это поможет избежать ошибок в обучении.";

class PreparingStep3 extends PreparingStep {
	constructor () {
		super({
			subtitle: "3-й этап",
			columnLeftText,
			columnRightText,
			backMenuName: "preparing step 3",
		});

		this.config = {
			openBtn: {
				width: 150,
				height: template.homeBtnHeight,

				text: "открыть карту",
				textSize: 16,
				margin: 20,
			},
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

		this.checkboxControlLines = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			y: template.headerOffset + template.titleSize + 95 + template.subTitleSize,
			radius: 8,
			text: "контрольные линии",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		elements.groupCheckbox([
			this.checkboxWalls,
			this.checkboxControlLines,
		]);

		this.btnClear = elements.btn({
			get x () {
				return layout.paddingLeft;
			},

			get y () {
				return template.headerOffset + template.titleSize + 149;
			},

			width: 100,
			height: 35,

			text: "очистить",

			color: colors.red,
			hoverColor: colors.lightRed,
		}, () => {
			this.clear();
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});

		this.openBtn = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth * 2 + this.margin * 2;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.openBtn.width,
			height: this.config.openBtn.height,

			text: this.config.openBtn.text,
			textSize: this.config.openBtn.textSize,

			margin: this.config.openBtn.margin,
		}, () => {
			this.open();
		}, hitbox => {
			template.drawBtn(hitbox, true);
		}, hitbox => {
			template.drawBtnHover(hitbox, true);
		});

		this.elems = [
			this.readyBtn,
			this.homeBtn,
			this.helpBtn,

			this.btnClear,
			this.openBtn,

			this.checkboxWalls,
			this.checkboxControlLines,
		].concat(this.createStepBtns(3));

		this.walls = education.map.walls;
		this.checkPoints = education.map.checkPoints;

		this.camera = new Camera(halfWidth, halfHeight);
		this.drag = false;
		this.lastPos = new Vector(0, 0);
		this.newLine = true;

		this.createEventListeners();
	};

	get coords () {
		return [
			this.camera.realX - this.camera.offsetX + mouse.x,
			this.camera.realY - this.camera.offsetY + mouse.y,
		];
	};

	get mode () {
		return this.checkboxWalls.select ? "walls" : "checkPoints";
	};

	onactive () {
		this.walls = education.map.walls;
		this.checkPoints = education.map.checkPoints;
		
		this.timer = this.params.unready;
		
		this.camera = new Camera(halfWidth, halfHeight);
		this.drag = false;
		this.lastPos = new Vector(0, 0);

		this.checkboxWalls.switch(true);
		this.newLine = true;
	};

	createEventListeners () {
		window.addEventListener("contextmenu", e => e.preventDefault());

		window.addEventListener("mousedown", e => {
			if (!this.active) return;

			if (e.which === 3) this.drag = true;
		});

		window.addEventListener("mouseup", e => {
			if (!this.active) return;

			if (e.which === 3) this.drag = false;
		});

		window.addEventListener("keydown", e => {
			if (!this.active) return;

			if (e.ctrlKey && e.code === "KeyX") this.closePath();
			if (e.ctrlKey && e.code === "KeyZ") this.deleteDot();
			if (e.ctrlKey && e.code === "KeyC") this.clear();
		});

		elements.addClickReaction(() => {
			if (!this.active || this.drag) return;
			this.continuePath();
		});
	};

	updateCamera () {
		if (this.drag) {
			let shift = calcVector.sub(mouse, this.lastPos).mult(-1).div(this.camera.realZoom);
			this.camera.update(this.camera.x + shift.x, this.camera.y + shift.y);
		}

		this.lastPos = mouse.copy();
	};

	continuePath () {
		if (this.drag || mouse.y < template.config.header.height) return;

		let [x, y] = this.coords;

		if (this.mode === "walls") {
			if (this.newLine) {
				this.walls.push([new Vector(x, y)]);
				this.newLine = false;
			} else {
				this.walls[this.walls.length - 1].push(new Vector(x, y));
			}
		} else {
			this.checkPoints.push(new Vector(x, y));
		}

		education.save();
	};

	closePath () {
		if (this.drag) return;
		
		if (this.mode === "walls") {
			this.newLine = true;

			if (this.walls[this.walls.length - 1].length < 3) {
				this.walls.pop();
			} else {
				this.walls[this.walls.length - 1].push(this.walls[this.walls.length - 1][0]);
			}
		} else if (this.checkPoints.length % 2 !== 0) {
			this.checkPoints.pop();
		}

		education.save();
	};

	deleteDot () {
		if (this.drag) return;

		if (this.mode === "walls") {
			this.newLine = false;
			this.walls[this.walls.length - 1].pop();
			if (this.walls[this.walls.length - 1].length === 0 && this.walls.length - 1 > 0) {
				this.newLine = true;
				this.walls.pop();
			}
		} else {
			this.checkPoints.pop();
		}

		education.save();
	};

	clear () {
		if (this.mode === "checkPoints") {
			education.map.checkPoints = [];
			this.checkPoints = education.map.checkPoints;

			education.save();
			return;
		}

		education.map.walls = [];
		this.walls = education.map.walls;
		this.newLine = true;

		education.save();
	};

	open () {
		let loadFromJSON = json => {
			this.walls = json.walls.map(e => e.map(e => new Vector(e.x, e.y)));
			this.checkPoints = json.checkPoints.map(e => new Vector(e.x, e.y));

			education.map.walls = this.walls;
			education.map.checkPoints = this.checkPoints;
		};

		let openField = document.createElement("input");
		openField.setAttribute("type", "file");
		openField.setAttribute("accept", ".json");

		openField.addEventListener("change", e => {
			let file = e.target.files[0];
			let fileReader = new FileReader();

			fileReader.readAsText(file);

			fileReader.onload = readerEvent => {
				let data = JSON.parse(readerEvent.target.result); 
				loadFromJSON(data);
			};
		});

		openField.click();
	};

	drawTitle () {
		ctx.save();
		template.title("Создание трека", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	drawHint () {
		ctx.save();
		template.text("использовать:", layout.paddingLeft, template.headerOffset + template.titleSize + 31);
		ctx.restore();
	};

	drawWalls () {
		ctx.save();

		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";

		ctx.beginPath();

		const map = this.walls;

		for (let j = 0; j < map.length; j++) {
			for (let i = 0; i < map[j].length; i++) {
				if (i === 0) {
					ctx.moveTo(map[j][0].x, map[j][0].y);
				} else {
					ctx.lineTo(map[j][i].x, map[j][i].y);
				}
			}

			if (j !== map.length - 1 || this.newLine) {
				ctx.closePath();
			} else if (this.mode === "walls" && !this.drag) {
				let [x, y] = this.coords;
				ctx.lineTo(x, y);
			}
		}

		ctx.stroke();
		ctx.restore();
	};

	drawCheckPoints () {
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = ctx.RGB(colors.green);

		ctx.beginPath();

		const checkPoints = this.checkPoints;

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(12, fonts.main, "center", "middle");

		for (let i = 0; i < checkPoints.length; i += 2) {
			ctx.moveTo(checkPoints[i].x, checkPoints[i].y);
			if (i + 1 !== checkPoints.length) {
				ctx.lineTo(checkPoints[i + 1].x, checkPoints[i + 1].y);

				let dist = checkPoints[i].mag(checkPoints[i + 1]);
				let dir = checkPoints[i + 1].copy().sub(checkPoints[i]).norm();
				let pos = checkPoints[i].copy().add(dir.mult(dist + 12));

				ctx.fillText(i / 2 + 1, pos.x, pos.y);
			} else {
				let [x, y] = this.coords;
				ctx.lineTo(x, y);
			}
		}

		ctx.stroke();
		ctx.restore();
	};

	drawTrack () {
		ctx.save();
		this.camera.focus();

		this.drawWalls();
		this.drawCheckPoints();

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.setLineDash([4, 1]);
		ctx.lineWidth = 1;
		ctx.rectangleWithRoundedCorners(-education.physic.carHeight * 0.5, -education.physic.carWidth * 0.5, education.physic.carHeight, education.physic.carWidth, 3, false);
		
		ctx.restore();
	};

	update () {
		ctx.save();

		this.updateCamera();

		this.drawTrack();

		template.drawHeader();
		this.drawFakeBtn(3);

		this.drawTitle();
		this.drawHint();

		this.drawElems();
		this.drawUnready();

		ctx.restore();
	};
};

// экспорт
window.PreparingStep3 = PreparingStep3;

})();

