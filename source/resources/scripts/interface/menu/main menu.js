class MainMenu extends Menu {
	constructor () {
		super();

		this.config = {
			aboutProgramm: "Данное програмное обеспечение разработано для обучение нейронных сетей вождению на виртуальном треке. Обучение осуществляется посредством генетического алгоритма. Исходный код данного ПО - открытый, вы можете изменить его при необходимости. Указание автора при использовании в своих проектах - не требуется. Для получение помощи зайдите в одноименный раздел, нажав кнопку 'помощь' в главном меню.",

			openTrainBtn: {
				width: 175,
				height: 47,

				text: "открыть тренировку",
				textSize: 16,
				marginRight: 29,
			},

			openMapEditorBtn: {
				width: 175,
				height: 47,

				text: "редактор карт",
				textSize: 16,
				marginRight: 29,
			},

			newTrainBtn: {
				width: 175,
				height: 47,

				text: "новая тренировка +",
				textSize: 16,
			},

			helpBtn: {
				width: 75,
				height: 36,

				text: "помощь",
			},

			recentlyBtn: {
				width: layout.fieldWidth(5) - 40,
				height: 40,
				spacing: 29,
				marginLeft: 20,
				marginTop: 36,
				fontSize: 14,
				paddingLeft: 12,
			},
		};

		this.openTrainBtn = elements.btn({
			get x () {
				return layout.paddingLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.openTrainBtn.width,
			height: this.config.openTrainBtn.height,

			text: this.config.openTrainBtn.text,
			textSize: this.config.openTrainBtn.textSize,
		}, () => {
			fileManager.selectOpen(() => {
				fileManager.getData().then(text => {
					education.load(text);

					if (education.settingReady) {
						controller.to("train menu");
						return;
					}

					controller.to("preparing step 1");
				});
			});
		}, hitbox => {
			template.drawBtn(hitbox, true);
		}, hitbox => {
			template.drawBtnHover(hitbox, true);
		});

		this.newTrainBtn = elements.btn({
			get x () {
				return layout.paddingLeft + this.marginLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.newTrainBtn.width,
			height: this.config.newTrainBtn.height,

			text: this.config.newTrainBtn.text,
			textSize: this.config.newTrainBtn.textSize,

			marginLeft: this.config.openTrainBtn.width + this.config.openTrainBtn.marginRight,
		}, () => {
			education.clear();

			fileManager.selectSave(() => {
				controller.to("preparing step 1");
			});
		}, hitbox => {
			template.drawBtn(hitbox, false);
		}, hitbox => {
			template.drawBtnHover(hitbox, false);
		});

		this.openMapEditorBtn = elements.btn({
			get x () {
				return layout.paddingLeft + this.marginLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.openMapEditorBtn.width,
			height: this.config.openMapEditorBtn.height,

			text: this.config.openMapEditorBtn.text,
			textSize: this.config.openMapEditorBtn.textSize,

			marginLeft: this.config.openTrainBtn.width + this.config.newTrainBtn.width + this.config.openTrainBtn.marginRight * 2,
		}, () => {
			controller.to("map editor");
		}, hitbox => {
			template.drawBtn(hitbox, true);
		}, hitbox => {
			template.drawBtnHover(hitbox, true);
		});	

		this.translateBtn = elements.btn({
			get x () {
				return layout.paddingRight - this.width;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: 150,
			height: template.config.readyBtn.height,

			text: "language: ",
		}, () => {
			if (lang.current === "ru") {
				lang.current = "en";
				return;
			}

			lang.current = "ru";
		}, hitbox => {
			let currentLang = { 
				"ru": "русский",
				"en": "english",
			}[lang.current];

			template.drawBtn(hitbox, true, hitbox.text + currentLang);
		}, hitbox => {
			let currentLang = {
				"ru": "русский",
				"en": "english",
			}[lang.current];

			template.drawBtnHover(hitbox, true, hitbox.text + currentLang);
		});
	};

	drawRecentlyBtn (hitbox, add = 0) {
		ctx.save();

		ctx.translate(hitbox.x, hitbox.y);

		ctx.fillStyle = ctx.RGB(colors.green);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, template.config.borderRadius, true);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(hitbox.config.fontSize + add, fonts.main, "left", "middle");
		ctx.fillText(hitbox.text, hitbox.config.paddingLeft, hitbox.height * 0.5);

		ctx.restore();
	};

	drawRecentlyBtnHover (hitbox) {
		this.drawRecentlyBtn(hitbox, 2);
	};

	createRecentlyButton (n, fileName) {
		return elements.btn({
			config: this.config.recentlyBtn,
			n: n,

			get x () {
				return layout.paddingLeft + this.config.marginLeft;
			},

			get y () {
				return layout.row(template.headerOffset + template.subTitleSize + template.config.header.marginBottom + this.config.marginTop, this.config.height, this.config.spacing, this.n);
			},

			width: this.config.recentlyBtn.width,
			height: this.config.recentlyBtn.height,
			text: fileName,
		}, async function () {
			if (await fileManager.checkRecently()) return;

			fileManager.path = fileManager.recently[n];

			fileManager.getData().then(text => {
				education.load(text);

				if (education.settingReady) {
					controller.to("train menu");
					return;
				}

				controller.to("preparing step 1");
			});
		}, hitbox => {
			this.drawRecentlyBtn(hitbox);
		}, hitbox => {
			this.drawRecentlyBtnHover(hitbox);
		});
	};

	onactive () {
		let recentlyBtns = [];
		for (let i = 0; i < fileManager.recently.length; i++) {
			recentlyBtns.push(this.createRecentlyButton(i, path.parse(fileManager.recently[i]).base.split(".")[0]));
		}

		this.elems = [
			this.openTrainBtn,
			this.newTrainBtn,
			this.openMapEditorBtn,
			this.translateBtn,
		].concat(recentlyBtns);
	};

	drawRecently () {
		ctx.save();

		ctx.translate(layout.column(0), template.headerOffset);

		template.subTitle("Недавние", 0, 0);

		ctx.translate(0, template.subTitleSize + template.headerMargin);

		template.field(0, 0, layout.fieldWidth(5), height - template.subTitleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom);

		ctx.restore();
	};

	drawAbout () {
		ctx.save();

		ctx.translate(layout.column(5), template.headerOffset);

		template.subTitle("О программе", 0, 0);

		ctx.translate(0, template.subTitleSize + template.headerMargin);

		let containerWidth = layout.fieldWidth(7);

		template.field(0, 0, containerWidth, height - template.subTitleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom);

		template.textContainer(template.fieldPaddingLeft, template.fieldPaddingTop, lang.translate(this.config.aboutProgramm), 16, 10, containerWidth - template.fieldPaddingLeft * 2);

		ctx.restore();
	};

	update () {
		ctx.save();
		
		template.drawHeader();

		this.drawRecently();
		this.drawAbout();

		this.drawElems();

		ctx.restore();
	};
};