class Mouse extends Vector {
	constructor () {
		super(0, 0);

		window.addEventListener("mousemove", function (e) {
			this.x = e.x;
			this.y = e.y;
		}.bind(this));

		this.pressed = false;

		window.addEventListener("mousedown", function (e) {
			this.pressed = true;
		}.bind(this));

		window.addEventListener("mouseup", function (e) {
			this.pressed = false;
		}.bind(this));
	};
};

const mouse = new Mouse();