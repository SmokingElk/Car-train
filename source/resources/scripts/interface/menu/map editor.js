(() => {

//константы и переменные


//класс файла
class MapEditorMenu extends Menu {
	constructor () {
		super();

		this.config = {
			openBtn: {
				width: 150,
				height: template.homeBtnHeight,

				text: "открыть карту",
				textSize: 16,
				margin: 29,
			},

			saveBtn: {
				width: 150,
				height: template.homeBtnHeight,

				text: "сохранить",
				textSize: 16,
			},

			simulationBtn: {
				width: 150,
				height: template.homeBtnHeight,

				text: "симулятор",
				textSize: 16,
			},
		};

		this.openBtn = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + this.margin;
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

		this.saveBtn = elements.btn({
			get x () {
				return layout.paddingLeft + this.marginLeft + template.homeBtnWidth;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.saveBtn.width,
			height: this.config.saveBtn.height,

			text: this.config.saveBtn.text,
			textSize: this.config.saveBtn.textSize,

			marginLeft: this.config.openBtn.width + this.config.openBtn.margin * 2,
		}, () => {
			this.saveAs();
		}, hitbox => {
			template.drawBtn(hitbox, false);
		}, hitbox => {
			template.drawBtnHover(hitbox, false);
		});

		this.simulationBtn = elements.btn({
			get x () {
				return layout.paddingLeft + this.marginLeft + template.homeBtnWidth;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.simulationBtn.width,
			height: this.config.simulationBtn.height,

			text: this.config.simulationBtn.text,
			textSize: this.config.simulationBtn.textSize,

			marginLeft: this.config.openBtn.width * 2 + this.config.openBtn.margin * 3,
		}, () => {
			if (this.walls.length === 0 || this.checkPoints.length === 0) return;
			controller.to("simulation", this.walls, this.checkPoints);
		}, hitbox => {
			template.drawBtn(hitbox, true);
		}, hitbox => {
			template.drawBtnHover(hitbox, true);
		});

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

			this.btnClear,
			this.checkboxWalls,
			this.checkboxControlLines,

			this.saveBtn,
			this.openBtn,
			this.simulationBtn,
		];

		this.createEventListeners();
	};

	clear () {
		if (this.mode === "checkPoints") {
			this.checkPoints = [];
			return;
		}

		this.walls = [];
		this.newLine = true;
	};

	onactive () {
		this.checkPoints = [];
		this.walls = [];

		this.camera = new Camera(halfWidth, halfHeight);
		this.drag = false;
		this.lastPos = new Vector(0, 0);

		this.checkboxWalls.switch(true);
		this.newLine = true;

		this.savePath = null;
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

	get empty () {
		return this.walls.length === 0 && this.checkPoints.length === 0;
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

			if (e.ctrlKey && e.code === "KeyS") this.save();
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
	};

	drawTitle () {
		ctx.save();
		template.title("Редактор карт", layout.paddingLeft, template.headerOffset);
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

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.setLineDash([4, 1]);
		ctx.lineWidth = 1;
		ctx.rectangleWithRoundedCorners(-education.physic.carHeight * 0.5, -education.physic.carWidth * 0.5, education.physic.carHeight, education.physic.carWidth, 3, false);

		this.drawWalls();
		this.drawCheckPoints();
		ctx.restore();
	};

	get saveData () {
		let res = {
			walls: this.walls.map(e => e.map(e => ({x: e.x, y: e.y}))),
			checkPoints: this.checkPoints.map(e => ({x: e.x, y: e.y})),
		};

		return JSON.stringify(res, null, 4);
	};	

	saveAs () {
		let writeFile = e => {
			let file = e.target.value;
			this.savePath = file;

			this.save();
		};	

		let saveField = document.createElement("input");
		saveField.setAttribute("type", "file");
		saveField.setAttribute("accept", ".json");
		saveField.setAttribute("nwsaveas", "map.json");
		saveField.addEventListener("change", writeFile);

		saveField.click();
	};

	open () {
		if (!this.empty) this.save();

		let loadFromJSON = json => {
			this.walls = json.walls.map(e => e.map(e => new Vector(e.x, e.y)));
			this.checkPoints = json.checkPoints.map(e => new Vector(e.x, e.y));
		};

		let setSavePath = path => this.savePath = path;

		let openField = document.createElement("input");
		openField.setAttribute("type", "file");
		openField.setAttribute("accept", ".json");

		openField.addEventListener("change", e => {
			let file = e.target.files[0];
			let fileReader = new FileReader();

			setSavePath(file.path);

			fileReader.readAsText(file);

			fileReader.onload = readerEvent => {
				let data = JSON.parse(readerEvent.target.result); 
				loadFromJSON(data);
			};
		});

		openField.click();
	};

	save () {
		if (!this.savePath) return this.saveAs();

		let str = this.saveData;

		fs.writeFileSync(this.savePath, str);
	};

	update () {
		ctx.save();

		this.updateCamera();

		this.drawTrack();

		template.drawHeader();
		this.drawTitle();
		this.drawHint();

		this.drawElems();

		ctx.restore();
	};
};

// экспорт
window.MapEditorMenu = MapEditorMenu;

})();