(() => {

//класс файла
class HelpMenu extends Menu {
	constructor () {
		super();

		this.config = {
			goBackBtn: {
				width: 75,
				height: 36,

				text: "назад",
			},
		};

		this.goBackBtn = elements.btn({
			get x () {
				return layout.paddingLeft;
			},

			get y () {
				return template.config.header.height / 2 - this.height / 2;
			},

			width: this.config.goBackBtn.width,
			height: this.config.goBackBtn.height,

			text: this.config.goBackBtn.text,
		}, () => {
			controller.to(this.backMenuName);
		}, hitbox => {
			template.drawBtn(hitbox);
		}, hitbox => {
			template.drawBtnHover(hitbox);
		});	

		this.elems = [
			this.goBackBtn,
		];
	};

	onactive ({subtitle, columnLeftText, columnRightText, backMenuName}) {
		this.subtitle = subtitle;
		this.columnLeftText = columnLeftText;
		this.columnRightText = columnRightText;
		this.backMenuName = backMenuName;
	};	

	drawTitle () {
		ctx.save();
		template.title("Помощь", layout.paddingLeft, template.headerOffset);
		template.subTitle(this.subtitle, layout.paddingLeft, template.headerOffset + template.titleSize + template.subTitlePadding);
		ctx.restore();
	};

	drawText () {
		const blockWidth = layout.fieldWidth(6);
		const offsetY = template.headerOffset + template.titleSize + template.headerMargin * 0.75 + template.subTitlePadding + template.subTitleSize;
		const blockHeight = height - template.titleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom - template.subTitleSize - template.subTitlePadding;

		// левая колонка
		ctx.save();

		ctx.translate(layout.paddingLeft, offsetY);

		template.field(0, 0, blockWidth, blockHeight);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.textContainer(0, 0, lang.translate(this.columnLeftText), 16, 10, blockWidth - template.fieldPaddingLeft * 2);

		ctx.restore();

		// правая колонка
		ctx.save();

		ctx.translate(layout.column(6), offsetY);

		template.field(0, 0, blockWidth, blockHeight);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.textContainer(0, 0, lang.translate(this.columnRightText), 16, 10, blockWidth - template.fieldPaddingLeft * 2);

		ctx.restore();
	};

	update () {
		ctx.save();

		template.drawHeader();

		this.drawTitle();
		this.drawText();

		this.drawElems();

		ctx.restore();
	};
};
// экспорт
window.HelpMenu = HelpMenu;

})();

