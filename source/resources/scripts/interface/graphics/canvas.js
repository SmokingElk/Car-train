//новые методы контекста рисования

//очистить холст
CanvasRenderingContext2D.prototype.clearCanvas = function () {
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

//залить холст
CanvasRenderingContext2D.prototype.fillCanvas = function (myCanvas) {
	if (myCanvas) {
		let tr = this.getTransform();
		this.fillRect(-tr.e * (1 / tr.a), -tr.f * (1 / tr.d), this.canvas.width * (1 / tr.a), this.canvas.height * (1 / tr.d));
	} else {
		this.fillRect(0, 0, width, height);
	}
};

//нарисовать границу
CanvasRenderingContext2D.prototype.border = function (size, width1, height1) {
	width1 = width1 !== undefined ? width1 : width;
	height1 = height1 !== undefined ? height1 : height;
	this.fillRect(0, 0, width1, size);
	this.fillRect(0, height1 - size, width1, size);
	this.fillRect(0, 0, size, height1);
	this.fillRect(width1 - size, 0, size, height1);
};

//настроить текст
CanvasRenderingContext2D.prototype.txtSetting = function (size, font, align, baseline, bold) {
	if (bold !== undefined) {
		this.font = bold + " " + size + "px " + font;
	} else {
		this.font = size + "px " + font;
	}
	this.textAlign = align;
	this.textBaseline = baseline;
};

//добавить подсветку
CanvasRenderingContext2D.prototype.addIllumination = function (color, size) {
	this.shadowColor = color;
	this.shadowBlur = size;
};

CanvasRenderingContext2D.prototype.clearIllumination = function () {
	this.shadowColor = "rgba(0, 0, 0, 0)";
	this.shadowBlur = 0;
};

//текст по углу
CanvasRenderingContext2D.prototype.textByAngle = function(txt, x, y, angle, fill) {
	this.save();
	this.translate(x, y);
	this.rotate(inRad(angle));
	if (fill) {
		this.fillText(txt, 0, 0);
	} else {
		this.strokeText(txt, 0, 0);
	}
	this.restore();
};

//нарисовать круг
CanvasRenderingContext2D.prototype.circle = function (x, y, radius, fill) {
	this.beginPath();
	this.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fill) {
		this.fill();
	} else {
		this.stroke();
	}
};

//нарисовать ромб
CanvasRenderingContext2D.prototype.romb = function (x, y, width, height, fill) {
	this.beginPath();
	this.moveTo(x - width, y);
	this.lineTo(x, y - height);
	this.lineTo(x + width, y);
	this.lineTo(x, y + height);
	this.closePath();
	if (fill) {
		this.fill();
	} else {
		this.stroke();
	}
};

//нарисовать квадрат
CanvasRenderingContext2D.prototype.square = function (x, y, size, fill) {
	if (fill) {
		this.fillRect(x - size / 2, y - size / 2, size, size);
	} else {
		this.strokeRect(x - size / 2, y - size / 2, size, size);
	}
};


//многоугольник 
CanvasRenderingContext2D.prototype.polygon = function (x, y, angles, startAngel, size, fill) {
	this.beginPath();
	for (var i = 0; i < 360 / angles; i++) {
		let angle = (startAngel + 360 / angles * i) % 360;
		let x1 = x + Math.cos(inRad(angle)) * size;
		let y1 = y + Math.sin(inRad(angle)) * size;
		if (i === 0) {
			this.moveTo(x1, y1);
		} else {
			this.lineTo(x1, y1);
		}
	}
	this.closePath();
	if (fill) {
		this.fill();
	} else {
		this.stroke();
	}
};

//наклоненный прямоугольник
CanvasRenderingContext2D.prototype.rectByAngle = function(x, y, width, height, angle, fill) {
	this.save();
	this.translate(x, y);
	this.rotate(inRad(angle));
	if (fill) {
		this.fillRect(-width / 2, - height / 2, width, height);
	} else {
		this.strokeRect(-width / 2, - height / 2, width, height);
	}
	this.restore();
};

//нарисовать прямоугольник со скруглёнными углами
CanvasRenderingContext2D.prototype.rectangleWithRoundedCorners = function (x, y, length, width, borderRadius, fill = true) {
	this.beginPath();
	this.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, Math.PI * 3 / 2, false);
	this.arc(x + length - borderRadius, y + borderRadius, borderRadius, Math.PI * 3 / 2, Math.PI * 2, false);
	this.arc(x + length - borderRadius, y + width - borderRadius, borderRadius, Math.PI * 2, Math.PI / 2, false);
	this.arc(x + borderRadius, y + width - borderRadius, borderRadius, Math.PI / 2, Math.PI, false);
	this.closePath();
	if (fill) {
		this.fill();
	} else {
		this.stroke();
	}
};

//добавить градиент
CanvasRenderingContext2D.prototype.setLinerGradient = function (x1, y1, x2, y2, massiveWithColors) {
	let gradient = this.createLinearGradient(x1, y1, x2, y2);
	for (var i = 0; i < massiveWithColors.length; i++) {
		gradient.addColorStop(i / (massiveWithColors.length - 1), massiveWithColors[i]);
	}
	return gradient;
};

//добавить радиальный градиент
CanvasRenderingContext2D.prototype.setRadialGradient = function (x1, y1, radius1, x2, y2, radius2, massiveWithColors) {
	let gradient = this.createRadialGradient(x1, y1, radius1, x2, y2, radius2);
	for (var i = 0; i < massiveWithColors.length; i++) {
		gradient.addColorStop(i / (massiveWithColors.length - 1), massiveWithColors[i]);
	}
	return gradient;
};

//нарисовать сетку
CanvasRenderingContext2D.prototype.grid = function (x, y, width, height, step) {
	let xCount = width / step;
	let yCount = height / step;

	this.beginPath();

	for (var i = 0; i < xCount; i++) {
		this.moveTo(x - width / 2 + i * step, y - height / 2);
		this.lineTo(x - width / 2 + i * step, y + height / 2);
	}

	for (var i = 0; i < xCount; i++) {
		this.moveTo(x - width / 2, y - height / 2 + i * step);
		this.lineTo(x + width / 2, y - height / 2 + i * step);
	}

	this.stroke();
};

//фильтер размытия
CanvasRenderingContext2D.prototype.blur = function (blur) {
	this.filter = `blur(${blur}px)`;
};

//получить данные цвета
CanvasRenderingContext2D.prototype.getColor = function (arr) {
	let colors = [];

	for (var i = 0; i < arr.length; i++) {
		let data = this.getImageData(arr[i].x, arr[i].y, 1, 1);
		let color = `rgb(${data.data[0]}, ${data.data[1]}, ${data.data[2]})`;
		colors.push(color);
	}

	return colors.length > 1 ? colors : colors[0];
};

//параллелограм
CanvasRenderingContext2D.prototype.parallelogram = function (x, y, width, height, padding, fill) {
	this.beginPath();
	this.moveTo(x, y);
	this.lineTo(x + width, y);
	this.lineTo(x + width - padding, y + height);
	this.lineTo(x - padding, y + height);
	this.closePath();
	if (fill) {
		this.fill();
	} else {
		this.stroke();
	}
};

//задать rgb
CanvasRenderingContext2D.prototype.RGB = function (r, g, b, a) {
	if (Array.isArray(r)) {
		let alpha = g !== undefined ? g : 1;
		return `rgba(${r[0]},${r[1]},${r[2]},${alpha})`;
	} else {
		a = a !== undefined ? a : 1;
		return `rgba(${r},${g},${b},${a})`;
	}
};

//задать hsl
CanvasRenderingContext2D.prototype.HSL = function (h, s, l, a) {
	if (Array.isArray(h)) {
		let alpha = s !== undefined ? s : 1;
		return `hsla(${h[0]},${hr[1]}%,${h[2]}%,${alpha})`;
	} else {
		a = a !== undefined ? a : 1;
		return `hsla(${h},${s}%,${l}%,${a})`;
	}
};

//переход между цветами
CanvasRenderingContext2D.prototype.interpolateColors = function (value, color1, color2) {
	return [
		scale(value, 0, 1, color1[0], color2[0]),
		scale(value, 0, 1, color1[1], color2[1]),
		scale(value, 0, 1, color1[2], color2[2]),
	];
};

//узор
CanvasRenderingContext2D.prototype.pattern = function (width, height, func) {
	const canvasLocal = document.createElement("canvas");
	canvasLocal.width = width;
	canvasLocal.height = height;
	const ctxLocal = canvasLocal.getContext("2d");
	func(ctxLocal, width, height);
	let pattern = this.createPattern(canvasLocal, "repeat");
	pattern.width = width;
	pattern.height = height;
	return pattern;
};

CanvasRenderingContext2D.prototype.drawPattern = function (x, y, w, h, pWidth, pHeight, func) {
	this.save();

	this.beginPath();
	this.rect(x, y, w, h);
	this.clip();

	for (let i = 0; i < w; i += pWidth) {
		for (let j = 0; j < h; j += pHeight) {
			this.save();
			this.translate(x + i, y + j);
			func();
			this.restore();
		}
	}

	this.restore();
};

//нарисовать изображение
CanvasRenderingContext2D.prototype.image = function (imgName, sX, sY, sW, sH, dX, dY, dW, dH) {
	if (arguments.length <= 3) return this.drawImage(sprites.get(imgName), sX, sY);
	if (arguments.length <= 5) return this.drawImage(sprites.get(imgName), sX, sY, sW, sH);
	this.drawImage(sprites.get(imgName), sX, sY, sW, sH, dX, dY, dW, dH);
};

//создание холста
document.body.style.overflow = "hidden";
document.body.style.margin = "0";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

//адаптация холста
let width = 0;
let height = 0;
let halfWidth = 0;
let halfHeight = 0;

window.onresize = function () {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    halfWidth = width / 2;
    halfHeight = height / 2;
};

window.onresize();