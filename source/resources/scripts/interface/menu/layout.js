class Layout {
	constructor () {
		this.config = {
			maxWidth: 1290,
			columnsCount: 12,
			spacing: 30,

			paddingBottom: 55,
		};
	};

	row (x, elemWidth, spacing, nmb) {
		return x + (elemWidth + spacing) * nmb;
	};

	centerRow (x, elemWidth, spacing, nmb, maxNmb) {
		return this.row(x - (elemWidth * maxNmb + spacing * (maxNmb - 1)) * 0.5, elemWidth, spacing, nmb);
	};

	center (containerLength, elemLength) {
		return containerLength * 0.5 - elemLength * 0.5;
	};

	get containerWidth () {
		return Math.min(width, this.config.maxWidth + this.config.spacing * 2);
	};

	get colWidth () {
		return (this.containerWidth - (this.config.columnsCount + 1) * this.config.spacing) / this.config.columnsCount;
	};

	get paddingLeft () {
		return Math.max(this.config.spacing, (width - this.config.maxWidth) * 0.5);
	};

	get paddingRight () {
		return width - this.paddingLeft;
	};

	get paddingBottom () {
		return this.config.paddingBottom;
	};

	column (nmb) {
		return this.row(this.paddingLeft, this.colWidth, this.config.spacing, limit(nmb, 0, this.config.spacing));
	};

	fieldWidth (columnsCount) {
		return this.colWidth * columnsCount + this.config.spacing * (columnsCount - 1);
	};
};

const layout = new Layout();