class Menu {
	constructor () {
		this.elems = [];
		this.active = false;
	};

	onElems () {
		this.elems.forEach(e => e.on());
	};

	offElems () {
		this.elems.forEach(e => e.off());
	};

	on (...openArgs) {
		this.onactive(...openArgs);
		this.onElems();
		this.active = true;
	};

	off () {
		this.offElems();
		this.active = false;
	};

	drawElems () {
		this.elems.forEach(e => e.draw());
	};

	onactive () {};
	
	update () {
		ctx.save();
		this.drawElems();
		ctx.restore();
	};
};