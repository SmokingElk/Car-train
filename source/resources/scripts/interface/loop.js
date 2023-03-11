//цикл анимации
class Loop {
	constructor () {
		this.now = 0;
		this.fps = 0;

		this.config = {
			brightnessChangeSpeed: 0.025,
		};

		this.brightness = 1;
		this.status = "default";
		this.onEnd = () => {};

		this.testfunc = () => {
			//ctx.fillRect(200, 200, 100, 100);
		};
	};

	nextFrame () {
		this.fps = performance.now() - this.now;
		this.now = performance.now();

		ctx.save();
		ctx.clearCanvas();
		this.testfunc();

		controller.update();

		ctx.fillStyle = ctx.RGB(0, 0, 0, limit(1 - this.brightness, 0, 1));
		ctx.fillCanvas();

		ctx.restore();

		this.updateBrightness();

		requestAnimationFrame(() => this.nextFrame());
	};

	end (brightnessValue) {
		this.brightness = brightnessValue;
		this.status = "default";
		this.onEnd();
	};

	updateBrightness () {
		if (this.status === "attenuation") {
			this.brightness -= this.config.brightnessChangeSpeed;
			if (this.brightness <= 0) return this.end(0);
		} 

		if (this.status === "manifestation") {
			this.brightness += this.config.brightnessChangeSpeed;
			if (this.brightness >= 1) return this.end(1);
		}
	};

	attenuation (callback) {
		this.brightness = 1;
		this.status = "attenuation";
		this.onEnd = callback ? callback : () => {};
	};

	manifestation (callback) {
		this.brightness = 0;
		this.status = "manifestation";
		this.onEnd = callback ? callback : () => {};
	};

	get transition () {
		return this.status !== "default";
	};
};