(() => {

const columnLeftText = "На 1-м этапе необходимо задать лучи, используемые алгоритмом для определения формы участка тренировочного трека, на котором в данный момент находится автомобиль. Фактически, лучи измеряют расстояние от своего начала до места пересечения с границами трека. В связи с этим, начало луча логично разместить на крае корпуса автомобиля (серая прямоугольная область). Сочетание клавиш Ctrl+Z позволяет удалить последний из созданных лучей."; 
const columnRightText = "Оптимальное кол-во лучей зависит от сложности трека. Так например,для простых трасс, в которых повороты имеют схожий радиус, как правило, достаточно 2-х лучей, выходящих из передних углов корпуса и направленных по диагонали. Для более сложных трасс с поворотами разной степени резкости, стоит использовать большее  количество лучей (5-11).";

//класс файла
class PreparingStep1 extends PreparingStep {
	constructor () {
		super({
			subtitle: "1-й этап",
			columnLeftText,
			columnRightText,
			backMenuName: "preparing step 1",
		});

		this.config = {
			carWidth: 100,
			carHeight: 43,
		};

		this.checkboxSimX = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			y: template.headerOffset + template.titleSize + 31,
			radius: 8,
			text: "Симметрия по оси X",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		this.checkboxSimY = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			y: template.headerOffset + template.titleSize + 62,
			radius: 8,
			text: "Симметрия по оси Y",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		this.btnClear = elements.btn({
			get x () {
				return layout.paddingRight - this.width;
			},

			get y () {
				return template.headerOffset + template.titleSize + 62 - this.height;
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

		this.elems = [
			this.readyBtn,
			this.homeBtn,
			this.helpBtn,

			this.btnClear,

			this.checkboxSimX,
			this.checkboxSimY,
		].concat(this.createStepBtns(1));

		this.dot1 = null;
		this.currentDot = new Vector(layout.paddingLeft, template.headerOffset + template.titleSize + 109);

		this.createEventListeners();
	};

	onactive () {
		this.timer = this.params.unready;
		this.checkboxSimX.switch(false);
		this.checkboxSimY.switch(false);
	};

	clear () {
		education.rays = [];
		education.save();
	};

	get offsetY () {
		return template.headerOffset + template.titleSize + 109;
	};

	get fieldHeight () {
		return height - layout.config.paddingBottom - this.offsetY;
	};

	get simX () {
		return this.checkboxSimX.select;
	};

	get simY () {
		return this.checkboxSimY.select;
	};

	createRay () {
		let dot1 = this.dot1.copy();
		let dot2 = this.currentDot.copy();

		let offsetX = halfWidth;
		let offsetY = this.offsetY + this.fieldHeight * 0.5;
		let offset = new Vector(offsetX, offsetY);

		dot1.sub(offset);
		dot2.sub(offset);

		const coef = education.physic.carHeight / this.config.carWidth;

		dot1.mult(coef);
		dot2.mult(coef);

		const len = dot2.mag(dot1);

		let dots1 = this.simmetryDot(dot1, 0, 0);
		let dots2 = this.simmetryDot(dot2, 0, 0);

		for (let i = 0; i < dots1.length; i++) {
			let start = dots1[i];
			let end = dots2[i];

			let dir = inDeg(start.getAngle(end));

			education.rays.push(new Ray(len, dir, start));
		}

		education.save();
	};

	convertDot (dot) {
		const coef = education.physic.carHeight / this.config.carWidth;
		const res = dot.copy().div(coef);

		let offsetX = halfWidth;
		let offsetY = this.offsetY + this.fieldHeight * 0.5;
		let offset = new Vector(offsetX, offsetY);

		res.add(offset);

		return res;
	};

	createEventListeners () {
		window.addEventListener("click", () => {
			if (!this.active) return;

			if (!isPointInRect(mouse.x, mouse.y, layout.paddingLeft, this.offsetY, layout.fieldWidth(12), this.fieldHeight)) return;

			if (this.dot1 === null) {
				this.dot1 = this.currentDot.copy();
			} else {
				this.createRay();
				this.dot1 = null;
			}
		});

		window.addEventListener("contextmenu", e => {
			e.preventDefault();
			if (!this.active) return;

			if (!isPointInRect(mouse.x, mouse.y, layout.paddingLeft, this.offsetY, layout.fieldWidth(12), this.fieldHeight)) return;

			this.dot1 = null;
		});

		window.addEventListener("keydown", e => {
			if (!this.active) return;

			if (e.code === "KeyZ" && e.ctrlKey && education.rays.length > 0) {
				education.rays.pop();
				education.save();
			} 
			
			if (e.code === "KeyC" && e.ctrlKey) this.clear();

			if (e.code === "KeyX" && e.ctrlKey) this.checkboxSimX.switch();
			if (e.code === "KeyY" && e.ctrlKey) this.checkboxSimY.switch();
		});
	};

	updateRays () {
		let x = limit(mouse.x, layout.paddingLeft, layout.paddingRight);
		let y = limit(mouse.y, template.headerOffset + template.titleSize + 109, height - layout.paddingBottom);

		if (this.dot1 !== null && keys.isPressed("ShiftLeft")) {
			if (Math.abs(this.dot1.x - x) < Math.abs(this.dot1.y - y)) {
				x = this.dot1.x;
			} else {
				y = this.dot1.y;
			}
		}

		this.currentDot.set(x, y);
	};

	drawTitle () {
		ctx.save();
		template.title("Создание лучей", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	simmetryDot (dot, cx, cy) {
		let dots = [dot.copy()];
		if (this.simX) dots.push(new Vector(dot.x + (cx - dot.x) * 2, dot.y));
		if (this.simY) dots.push(new Vector(dot.x, dot.y + (cy - dot.y) * 2));
		if (this.simX && this.simY) dots.push(new Vector(dot.x + (cx - dot.x) * 2, dot.y + (cy - dot.y) * 2));
		return dots;
	};

	drawRay (dot1, dot2) {
		ctx.beginPath();
		ctx.moveTo(dot1.x, dot1.y);
		ctx.lineTo(dot2.x, dot2.y);
		ctx.stroke();

		ctx.circle(dot1.x, dot1.y, 3, true);
		ctx.circle(dot2.x, dot2.y, 3, true);
	};

	drawRays (offsetY, blockWidth, blockHeight) {
		ctx.save();

		ctx.beginPath();
		ctx.rect(layout.paddingLeft, offsetY, blockWidth, blockHeight);
		ctx.clip();

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.strokeStyle = ctx.RGB(colors.red);

		const cx = layout.paddingLeft + blockWidth * 0.5;
		const cy = offsetY + blockHeight * 0.5;

		let dots = this.simmetryDot(this.currentDot, cx, cy);
		let dots1 = this.dot1 !== null ? this.simmetryDot(this.dot1, cx, cy) : dots;

		for (let i = 0; i < dots.length; i++) {
			this.drawRay(dots[i], dots1[i]);
		}

		for (let i of education.rays) {
			let {p1, p2} = i.getDots(); 
			this.drawRay(this.convertDot(p1), this.convertDot(p2));
		}

		ctx.restore();
	};

	drawRayField () {
		ctx.save();

		let offsetY = this.offsetY;

		ctx.translate(layout.paddingLeft, offsetY);

		let blockWidth = layout.fieldWidth(12);
		let blockHeight = this.fieldHeight;

		template.field(0, 0, blockWidth, blockHeight, true);

		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.rectangleWithRoundedCorners(layout.center(blockWidth, this.config.carWidth), layout.center(blockHeight, this.config.carHeight), this.config.carWidth, this.config.carHeight, template.config.borderRadius, true);

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.lineWidth = 1;

		ctx.restore();

		this.drawRays(offsetY, blockWidth, blockHeight);

		ctx.save();

		ctx.translate(layout.paddingLeft, offsetY);

		ctx.beginPath();
		ctx.moveTo(0, blockHeight * 0.5);
		ctx.lineTo(blockWidth, blockHeight * 0.5);
		ctx.moveTo(blockWidth * 0.5, 0);
		ctx.lineTo(blockWidth * 0.5, blockHeight);
		ctx.stroke();

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(18, fonts.main, "center", "middle");
		ctx.fillText("y", blockWidth * 0.5 - 10, 10);
		ctx.fillText("x", blockWidth - 10, blockHeight * 0.5 + 10);

		ctx.restore();


	};

	update () {
		ctx.save();

		template.drawHeader();
		this.drawFakeBtn(1);

		this.drawTitle();
		this.drawRayField();

		this.drawElems();
		this.drawUnready();

		this.updateRays();

		ctx.restore();
	};
};

// экспорт
window.PreparingStep1 = PreparingStep1;

})();