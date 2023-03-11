//параметры камеры
const cameraParams = {
	zoomSpeed: 0.2,
	rotateSpeed: 0.05,
	moveSpeed: 0.2,
};

//камера
class Camera {
	constructor (offsetX, offsetY) {
		this.x = 0;
		this.y = 0;
		this.realX = 0;
		this.realY = 0;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.zoom = 1;
		this.realZoom = 1;
		this.rotate = 0;
		this.realRotate = 0;
	};

	//обновить позицию 
	update (x, y) {
		this.x = x;
		this.y = y;
	};

	//устанвить реальную позцию
	setRealPos (realX, realY, x, y) {
		this.realX = realX;
		this.realY = realY;
		this.x = x !== undefined ? x : realX;
		this.y = y !== undefined ? y : realY;
	};

	//установить приближение
	setZoom (zoom) {
		this.zoom = zoom;
	};

	//установить реальное приближение
	setRealZoom (realZoom, zoom) {
		this.realZoom = realZoom;
		this.zoom = zoom !== undefined ? zoom : realZoom;	
	};

	//установить поворот
	setRotate (angle) {
		this.rotate = angle;
	};

	//установить реальный поворот
	setRealRotate (realRotate, rotate) {
		this.realRotate = realRotate;
		this.rotate = rotate !== undefined ? rotate : realRotate;
	};

	//фокус
	focus () {
		ctx.scale(this.realZoom, this.realZoom);
		ctx.translate(-this.realX + this.offsetX / this.realZoom, -this.realY + this.offsetY / this.realZoom);
		ctx.rotate(this.realRotate);

		this.realX = lerp(this.realX, this.x, cameraParams.moveSpeed);
		this.realY = lerp(this.realY, this.y, cameraParams.moveSpeed);
		this.realZoom = lerp(this.realZoom, this.zoom, cameraParams.zoomSpeed);
		this.realRotate = lerp(this.realRotate, this.rotate, cameraParams.rotateSpeed);
	};
};