class Template {
	constructor () {
		this.config = {
			textSize: 14,
			subTitleSize: 21,
			titleSize: 30,

			subtitlePadding: 27,

			field: {
				paddingLeft: 14,
				paddingTop: 23,
			},

			borderRadius: 5,

			slider: {
				width: 215,
				height: 12,
				dragWidth: 35,
				textMarginBottom: 11,
				textMarginLeft: 4,
			},

			checkbox: {
				textMarginLeft: 7,
			},

			textField: {
				width: 215,
				height: 31,
				textMarginBottom: 11,
				textMarginLeft: 5,
			},

			header: {
				height: 97,
				marginBottom: 36,
			},

			homeBtn: {
				width: 35,
				height: 35,
			},

			stepBtn: {
				width: 35,
				height: 35,
				spacing: 18,
			},

			readyBtn: {
				width: 100,
				height: 35,
			},

			trainBtn: {
				width: 163,
				height: 35,
				marginLeft: 18,
			},

			helpBtn: {
				width: 35,
				height: 35,
				fontSize: 18,
			},
		};
	};

	get subTitlePadding () {
		return this.config.subtitlePadding;
	};

	get fieldPaddingLeft () {
		return this.config.field.paddingLeft;
	};

	get fieldPaddingTop () {
		return this.config.field.paddingTop;
	};

	get homeBtnWidth () {
		return this.config.homeBtn.width;
	};

	get homeBtnHeight () {
		return this.config.homeBtn.height;
	};

	get headerMargin () {
		return this.config.header.marginBottom;
	};

	get textSize () {
		return this.config.textSize;
	};

	get subTitleSize () {
		return this.config.subTitleSize;
	};

	get titleSize () {
		return this.config.titleSize;
	};

	get headerOffset () {
		return this.config.header.height + this.config.header.marginBottom;
	};

	drawHelpBtn (hitbox) {
		ctx.save();

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.strokeStyle = ctx.RGB(colors.black);

		ctx.translate(hitbox.x, hitbox.y);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, false);
		
		ctx.txtSetting(this.config.helpBtn.fontSize, fonts.main, "center", "middle");
		ctx.fillText("?", hitbox.width / 2, hitbox.height / 2 + 2);

		ctx.restore();
	};

	drawSlider (hitbox, dragWidth, dragMax, realValue, value, active = true) {
		ctx.save();

		if (!active) ctx.globalAlpha = 0.4;

		ctx.translate(hitbox.x, hitbox.y);
		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, true);
		ctx.fillStyle = ctx.RGB(colors.green);
		ctx.rectangleWithRoundedCorners(dragMax * realValue, 0, dragWidth, hitbox.height, this.config.borderRadius, true);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(this.config.textSize, fonts.main, "left", "bottom");
		ctx.fillText(hitbox.text, 0, -this.config.slider.textMarginBottom);
		ctx.txtSetting(this.config.textSize, fonts.main, "left", "middle");
		ctx.fillText(value.toFixed(2), hitbox.width + this.config.slider.textMarginLeft, hitbox.height * 0.5);

		ctx.restore();
	};

	drawCheckbox (hitbox, selected) {
		ctx.save();

		ctx.translate(hitbox.x, hitbox.y);

		ctx.lineWidth = 1;
		ctx.fillStyle = ctx.RGB(colors.green);
		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.circle(0, 0, hitbox.radius, selected);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(this.config.textSize, fonts.main, "left", "middle");
		ctx.fillText(hitbox.text, hitbox.radius + this.config.checkbox.textMarginLeft, 0);

		ctx.restore();
	};

	drawBtn (hitbox, fill = true, text = hitbox.text) {
		ctx.save();
		ctx.lineWidth = 1;
		ctx.translate(hitbox.x, hitbox.y);
		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.fillStyle = ctx.RGB(hitbox.color ? hitbox.color : colors.green);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, fill);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(hitbox.textSize ? hitbox.textSize : this.config.textSize, fonts.main, "center", "middle");
		ctx.fillText(text, hitbox.width * 0.5, hitbox.height * 0.5);
		ctx.restore();
	};

	drawBtnHover (hitbox, fill = true, text = hitbox.text) {
		ctx.save();
		ctx.lineWidth = 1;
		ctx.translate(hitbox.x, hitbox.y);
		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.fillStyle = ctx.RGB(hitbox.hoverColor ? hitbox.hoverColor : colors.lightGreen);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, fill);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting((hitbox.textSize ? hitbox.textSize : this.config.textSize) + 0.5, fonts.main, "center", "middle");
		ctx.fillText(text, hitbox.width * 0.5, hitbox.height * 0.5);
		ctx.restore();
	};

	drawTextField (hitbox, text, carriage, placeholder) {
		ctx.save();
		ctx.translate(hitbox.x, hitbox.y);

		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, false);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.txtSetting(this.config.textSize, fonts.main, "left", "bottom");
		ctx.fillText(hitbox.text, 0, -this.config.textField.textMarginBottom);

		ctx.translate(this.config.textField.textMarginLeft, hitbox.height * 0.5);

		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.txtSetting(this.config.textSize, fonts.main, "left", "middle");
		ctx.fillText(placeholder, 0, 0);

		ctx.fillStyle = ctx.RGB(colors.black);
		ctx.fillText(text, 0, 0);
		if (carriage) ctx.fillRect(ctx.measureText(text).width, -this.config.textSize * 0.5, 1, this.config.textSize);

		ctx.restore();
	};

	drawHeader () {
		ctx.save();
		ctx.fillStyle = ctx.RGB(colors.grey);
		ctx.fillRect(0, 0, width, this.config.header.height);
		ctx.restore();
	};

	drawHomeBtn (hitbox) {
		ctx.save();
		ctx.translate(hitbox.x, hitbox.y);
		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, false);
		ctx.image("home", hitbox.width * 0.5 - 9.5, hitbox.height * 0.5 - 9.5, 19, 19);
		ctx.restore();
	};

	drawHomeBtnHover (hitbox) {
		ctx.save();
		ctx.translate(hitbox.x, hitbox.y);
		ctx.fillStyle = ctx.RGB(colors.darkGrey);
		ctx.strokeStyle = ctx.RGB(colors.black);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, true);
		ctx.rectangleWithRoundedCorners(0, 0, hitbox.width, hitbox.height, this.config.borderRadius, false);
		ctx.image("home", hitbox.width * 0.5 - 9.5, hitbox.height * 0.5 - 9.5, 19, 19);
		ctx.restore();
	};

	field (x, y, w, h, stroke = false) {
		ctx.save();
		ctx.fillStyle = ctx.RGB(colors.grey);
		ctx.rectangleWithRoundedCorners(x, y, w, h, this.config.borderRadius, true);

		if (stroke) {
			ctx.strokeStyle = ctx.RGB(colors.black);
			ctx.rectangleWithRoundedCorners(x, y, w, h, this.config.borderRadius, false);
		}

		ctx.restore();
	};

	text (text, x, y, align = "left", baseline = "top", color = colors.black) {
		ctx.fillStyle = ctx.RGB(color);
		ctx.txtSetting(this.config.textSize, fonts.main, align, baseline);
		ctx.fillText(text, x, y);
	};

	subTitle (text, x, y, align = "left", baseline = "top", color = colors.black) {
		ctx.fillStyle = ctx.RGB(color);
		ctx.txtSetting(this.config.subTitleSize, fonts.main, align, baseline);
		ctx.fillText(text, x, y);
	};

	title (text, x, y, align = "left", baseline = "top", color = colors.black, weight = "normal") {
		ctx.fillStyle = ctx.RGB(color);
		ctx.txtSetting(this.config.titleSize, fonts.main, align, baseline, weight);
		ctx.fillText(text, x, y);
	};

	textContainer (x, y, text, size, lineSpacing = 10, containerWidth, color = colors.black) {
		ctx.save();

		ctx.translate(x, y);
		ctx.fillStyle = ctx.RGB(color);
		ctx.txtSetting(size, fonts.main, "left", "top");

		let rowWidth = 0;

		for (let i of text.split(" ")) {
			let textWidth = ctx.measureText(i + " ").width;

			if (rowWidth + textWidth >= containerWidth) {
				rowWidth = 0;
				ctx.translate(0, size + lineSpacing);
			}

			ctx.fillText(i + " ", rowWidth, 0);
			rowWidth += textWidth;
		}

		ctx.restore();
	};
};

const template = new Template();