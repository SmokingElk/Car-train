class ProgressMenu extends Menu {
	constructor () {
		super();

		this.config = {
			graphicHeight: 322,
			btnGoBackWidth: 116,
			btnShowWeightsWidth: 289,

			text: {
				marginBottom: 27,
				marginTop: 22,
				marginLeft:  20,
			},

			graphic: {
				offsetX: 15, 
				offsetY: 22,

				textMargin: 4,
				paddingTop: 20,
			},
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
			controller.to("train menu");
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});

		this.btnShowWeights = elements.btn({
			btnGoBackWidth: this.config.btnGoBackWidth,

			get x () {
				return layout.paddingLeft + template.homeBtnWidth + template.config.trainBtn.marginLeft * 2 + this.btnGoBackWidth;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.btnShowWeightsWidth,
			height: template.config.trainBtn.height,

			text: "показать визуализацию коэффициентов",
		}, () => {
			controller.to("weights visualization menu");
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
			this.btnShowWeights,
		];
	};

	drawTitle () {
		ctx.save();
		template.title("Прогресс тренировки", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	drawText (text, value) {
		if (typeof value === "number") value = value.toFixed(2);

		let textWidth = ctx.measureText(lang.translate(text)).width;

		ctx.fillText(text, 0, 0);
		ctx.fillText(value, textWidth + 35, 0);
		ctx.translate(0, template.textSize + this.config.text.marginBottom);
	};

	drawParams () {
		ctx.save();

		ctx.translate(this.config.text.marginLeft, this.config.text.marginTop);
		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(template.textSize, fonts.main, "left", "top");

		this.drawText("Текущее поколение", education.gen);
		this.drawText("Лучший результат", education.statistics.maxScore);

		this.drawText("Размер популяции", education.eduParams.inOneGen);
		this.drawText("Максимальное время на поколение", education.eduParams.maxDriveTime);
		this.drawText("Вероятность мутации", education.eduParams.mutationChance);
		this.drawText("Величина мутации", education.eduParams.mutation);

		this.drawText("Количество нейронов в 1-м скрытом слое", education.eduParams.hidden1);
		this.drawText("Количество нейронов в 2-м скрытом слое", education.eduParams.hidden2);
		this.drawText("Максимальное значение веса", education.eduParams.weightLimit);

		this.drawText("Ускорение", education.physic.acc);
		this.drawText("Трение", education.physic.smooth);
		this.drawText("Скорость поворота", education.physic.rotateSpeed);
		
		ctx.restore();
	};

	drawParamsBlock () {
		ctx.save();

		let offsetY = template.headerOffset + template.titleSize + 23;

		ctx.translate(layout.paddingLeft, offsetY);

		const blockWidth = layout.fieldWidth(6);
		const blockHeight = height - layout.paddingBottom - offsetY;

		template.field(0, 0, blockWidth, blockHeight);

		this.drawParams();

		ctx.restore();
	};

	drawGraphics (blockWidth, blockHeight) {
		ctx.save();

		const config = this.config.graphic;

		const maxValue = Math.max(...education.statistics.best.concat(education.statistics.average));
		const maxWidth = blockWidth - config.offsetX;
		const maxHeight = blockHeight - config.offsetY - config.paddingTop;

		ctx.fillStyle = ctx.RGB(colors.black);
		template.text("эффективность", config.offsetX + config.textMargin, config.textMargin);
		template.text("поколение", blockWidth - config.textMargin, blockHeight - config.offsetY + config.textMargin, "right", "top");

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.beginPath();
		ctx.moveTo(0, blockHeight - config.offsetY);
		ctx.lineTo(blockWidth, blockHeight - config.offsetY);
		ctx.moveTo(config.offsetX, 0);
		ctx.lineTo(config.offsetX, blockHeight);
		ctx.stroke();
		
		ctx.translate(config.offsetX, blockHeight - config.offsetY);
		ctx.scale(1, -1);

		ctx.strokeStyle = ctx.RGB(colors.blue);

		ctx.beginPath();

		ctx.moveTo(0, 0);
		for (let i = 0; i < education.statistics.best.length; i++) {
			let value = education.statistics.best[i];
			ctx.lineTo(scale((i + 1) / education.statistics.best.length, 0, 1, 0, maxWidth), scale(value, 0, maxValue, 0, maxHeight));
		}
		ctx.stroke();

		ctx.strokeStyle = ctx.RGB(colors.green);

		ctx.beginPath();

		ctx.moveTo(0, 0);
		for (let i = 0; i < education.statistics.average.length; i++) {
			let value = education.statistics.average[i];
			ctx.lineTo(scale((i + 1) / education.statistics.average.length, 0, 1, 0, maxWidth), scale(value, 0, maxValue, 0, maxHeight));
		}
		ctx.stroke();

		ctx.restore();
	};

	drawGraphicsBlock () {
		ctx.save();

		let offsetY = template.headerOffset + template.titleSize + 23;

		ctx.translate(layout.column(6), offsetY);

		template.subTitle("Зависимость эффективности от поколения", 0, 0);

		ctx.translate(0, 17 + template.subTitleSize);

		const blockWidth = layout.fieldWidth(6);
		const blockHeight = Math.min(this.config.graphicHeight, height - offsetY - 100 - template.subTitleSize - layout.paddingBottom);

		template.field(0, 0, blockWidth, blockHeight);

		this.drawGraphics(blockWidth, blockHeight);

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.rectangleWithRoundedCorners(0, 0, blockWidth, blockHeight, template.config.borderRadius, false);

		ctx.translate(0, blockHeight + 17);

		ctx.fillStyle = ctx.RGB(colors.green);
		ctx.fillRect(0, template.textSize * 0.5 - 1, 19, 2);
		ctx.fillStyle = ctx.RGB(colors.blue);
		ctx.fillRect(0, template.textSize * 0.5 - 1 + 29, 19, 2);

		ctx.translate(25, 0);

		template.text("средний прогресс", 0, 0);
		template.text("прогресс лучшего", 0, template.textSize + 15);

		ctx.restore();
	};

	update () {
		ctx.save();

		template.drawHeader();
		this.drawTitle();

		this.drawElems();

		this.drawParamsBlock();
		this.drawGraphicsBlock();

		ctx.restore();
	};
};