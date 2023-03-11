class TrainMenu extends Menu {
	constructor () {
		super();

		this.btnProgress = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + template.config.trainBtn.marginLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: template.config.trainBtn.width,
			height: template.config.trainBtn.height,

			text: "прогресс тренировки",
		}, () => {
			controller.to("progress menu");
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});

		this.btnImportWeights = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + template.config.trainBtn.marginLeft * 2 + template.config.trainBtn.width;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: template.config.trainBtn.width,
			height: template.config.trainBtn.height,

			text: "импортировать веса",
		}, () => {
			education.importThisGen = true;
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});

		this.sliderSpeed = elements.slider({
			get x () {
				return layout.paddingLeft;
			},

			get y () {
				return template.headerOffset + template.config.slider.textMarginBottom;
			},

			width: template.config.slider.width,
			height: template.config.slider.height,

			text: "Скорость",
		}, (hitbox, dragWidth, dragMax, realValue, value) => {
			template.drawSlider(hitbox, dragWidth, dragMax, realValue, value);
		}, 0, 5, template.config.slider.dragWidth);

		this.checkboxShowRays = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			get y () {
				return template.headerOffset + 58; 
			},

			radius: 8,
			text: "показывать лучи",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
		});

		this.checkboxShowAll = elements.checkbox({
			get x () {
				return layout.paddingLeft + 8;
			},

			get y () {
				return template.headerOffset + 97; 
			},

			radius: 8,
			text: "показывать все поколение",
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);
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
			this.btnProgress,
			this.btnImportWeights,
			this.sliderSpeed,
			this.checkboxShowRays,
			this.checkboxShowAll,
		];

		this.trainShow = new TrainShow();
	};

	drawHint () {
		ctx.save();
		template.text("Завершение текущего поколения", layout.paddingLeft, template.headerOffset + 125);
		ctx.restore();
	};

	update () {
		ctx.save();

		for (let i = 0; i < this.sliderSpeed.value; i++) education.update();
		this.trainShow.draw(this.checkboxShowRays.select, this.checkboxShowAll.select);

		template.drawHeader();

		this.drawElems();
		if (education.importThisGen) this.drawHint();

		ctx.restore();
	};
};