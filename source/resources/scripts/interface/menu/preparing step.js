class PreparingStep extends Menu {
	constructor (helpParams) {
		super();

		this.params = {
			unready: 10,

			helpBtn: {
				radius: 13,
			},
		};

		this.helpParams = helpParams;

		this.unready = [];
		this.timer = this.params.unready;

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

		this.helpBtn = elements.btn({
			get x () {
				return layout.paddingLeft + template.homeBtnWidth + 20;
			},

			get y () {
				return template.config.header.height / 2 - template.config.helpBtn.height / 2;
			},

			width: template.config.helpBtn.width,
			height: template.config.helpBtn.height,
		}, () => {
			controller.to("help menu", this.helpParams);
		}, hitbox => {
			template.drawHelpBtn(hitbox);
		}, hitbox => {
			template.drawHelpBtn(hitbox);
		});

		this.readyBtn = elements.btn({
			get x () {
				return layout.paddingRight - this.width;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: template.config.readyBtn.width,
			height: template.config.readyBtn.height,

			text: "готово",
		}, () => {
			let ready = education.ok;

			if (ready === "ok") {
				education.start();
				controller.to("train menu");
			} else {
				this.timer = 0;
				this.unready = ready;
			}
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});
	};

	createStepBtns (except) {
		let btns = [];

		for (let i = 0; i < 4; i++) {
			if (i + 1 === except) continue;

			btns.push(elements.btn({
				get x () {
					return layout.centerRow(halfWidth, this.width, template.config.stepBtn.spacing, this.text - 1, 4);
				},
				get y () {
					return template.config.header.height / 2 - this.height / 2;
				},
				width: template.config.stepBtn.width,
				height: template.config.stepBtn.height,
				text: i + 1,
			}, () => {
				controller.to(`preparing step ${i + 1}`);
			}, hitbox => {
				template.drawBtn(hitbox, false);
			}, hitbox => {
				template.drawBtnHover(hitbox, false);
			}));
		}

		return btns;
	};

	drawFakeBtn (nmb, color = colors.green) {
		template.drawBtn({
			get x () {
				return layout.centerRow(halfWidth, this.width, template.config.stepBtn.spacing, this.text - 1, 4);
			},
			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},
			width: template.config.stepBtn.width,
			height: template.config.stepBtn.height,
			text: nmb,
			color: color,
		});
	};

	drawUnready () {
		ctx.save();

		if (this.timer >= this.params.unready) return;
		this.timer++;

		for (let i of this.unready) this.drawFakeBtn(i, colors.red);

		ctx.restore();
	};
};