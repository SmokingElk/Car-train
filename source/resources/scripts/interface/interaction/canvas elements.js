(() => {

//параметры элементов
const config = {
	changeCarriage: 20,
	sliderSpeed: 0.6,
};

//ограничить значение
const limit = (value, min, max) => {
	if (value < min) return min;
	if (value > max) return max;
	return value;
};

//масштабировать значение (min, max - диапазон входного значения, minR, maxR - выходного)
const scale = (value, min, max, minR, maxR) => minR + ((value - min) / (max - min)) * (maxR - minR);

//линейная интерполяция
const lerp = (current, target, speed) => current + (target - current) * speed;

//округление до знака
const round = (num, sgn) => {
	let d = 10**sgn;
	return Math.round(num * d) / d;
};

//проверки на поподание точки в фигуру
class Collision {
	rect (x, y, h) {
		return h.x < x && x < h.x + h.width && h.y < y && y < h.y + h.height;
	};

	circle (x, y, h) {
		return Math.hypot(h.x - x, h.y - y) < h.radius;
	};
};

const collision = new Collision();

//граница взаимодействия элемента
//может быть окружностью ({x, y, rad}) или прямоугольной ({x, y, width, height})
//вместо x и y можно использовать свойства left/right и top/bottom
//x и y также могут являться геттерами
//width, height - передаются классом Elements и отражают ширину и высоту холста
//в итоговом элементе могут быть получены по ключам maxWidth и maxHeight
//дополнительно можно указывать любые свойства, которые также будут переданы в элемент
class Hitbox {
	constructor (props, width, height) {
		if (!(props.hasOwnProperty("left") || props.hasOwnProperty("right") || props.hasOwnProperty("x")) || 
			!(props.hasOwnProperty("top") || props.hasOwnProperty("bottom") || props.hasOwnProperty("y"))) {
			throw new ReferenceError("Hitbox except left, right or x, and top, bottom or y properties, recieved: " + Object.keys(props).join(", "));
		}

		if (props.hasOwnProperty("width") && props.hasOwnProperty("height")) this.collisionFunc = collision.rect;
		if (props.hasOwnProperty("radius")) this.collisionFunc = collision.circle;
		if (!this.collisionFunc) throw ReferenceError("Hitbox except width/height or radius properties, recieved: " + Object.keys(props).join(", "));

		this.maxWidth = width;
		this.maxHeight = height;
		for (let i in props) this[i] = props[i];

		if (this.x === undefined || Object.getOwnPropertyDescriptor(props, 'x').get) {
			let getter = props.hasOwnProperty("x") ? Object.getOwnPropertyDescriptor(props, 'x').get : null;
			let defaultGetter = () => this.hasOwnProperty("left") ? this.left : this.maxWidth - this.right;

			Object.defineProperty(this, "x", {
				get: getter ? getter : defaultGetter,
			});
		}

		if (this.y === undefined  || Object.getOwnPropertyDescriptor(props, 'y').get) {
			let getter = props.hasOwnProperty("y") ? Object.getOwnPropertyDescriptor(props, 'y').get : null;
			let defaultGetter = () => this.hasOwnProperty("left") ? this.left : this.maxWidth - this.right;

			Object.defineProperty(this, "y", {
				get: getter ? getter : defaultGetter,
			});
		}
	};

	//проверка на столкновение точки
	colliding (x, y) {
		return this.collisionFunc(x, y, this);
	};
};

//родительский класс всех элементов
class Element {
	constructor (hitbox, width, height) {
		this.hitbox = new Hitbox(hitbox, width, height);
		this.active = false;
		this.hover = false;
	};

	//обновление ширины холста в hitbox
	set maxWidth (value) {
		this.hitbox.maxWidth = value;
	};

	//обновление высота холста в hitbox
	set maxHeight (value) {
		this.hitbox.maxHeight = value;
	};

	//наведена ли мышь на элемент, принимает координаты
	updateHover (x, y) {
		this.hover = this.hitbox.colliding(x, y) && this.active;
	};

	//события по умолчанию
	mousemove () {};
	keydown () {};
	mousedown () {};
	mouseup () {};
	draw () {};

	//включить/выключить реакцию элемента на события
	on () {
		this.active = true;
		//this.hover = false;
		return this;
	};

	off () {
		this.active = false;
		this.hover = false;
		return this;
	};
};

//кнопка
class Btn extends Element {
	constructor (maxWidth, maxHeight, hitbox, onclick, drawFunc, hoverDrawFunc) {
		super(hitbox, maxWidth, maxHeight);

		this.onclick = onclick;
		this.drawFunc = drawFunc;
		this.hoverDrawFunc = hoverDrawFunc;
	};

	mousedown () {
		if (this.hover) this.onclick();
	};

	//нарисовать (в функцию передается hitbox)
	draw () {
		if (this.hover) return this.hoverDrawFunc(this.hitbox);
		this.drawFunc(this.hitbox);
	};
};

//текстовое поле ввода
class TextField extends Element {
	constructor (maxWidth, maxHeight, hitbox, drawFunc, maxLen = 10, placeholder = "print here", filter = /./) {
		super(hitbox, maxWidth, maxHeight);

		this.drawFunc = drawFunc;
		this.focus = false;
		this.maxLen = maxLen;
		this.placeholder = placeholder;
		this.filter = filter;

		this._text = "";
		this.carriage = true;
		this.changeCarriage = 0;
	};

	get text () {
		return this._text;
	};

	set text (value) {
		this._text = String(value);
	};

	keydown (event) {
		if (!this.focus) return;
		this.restartCarriage();

		const key = event.key;
		if (key.length === 1 && this.filter.test(key) && this._text.length < this.maxLen) {
			this._text += key;		
		} else if (key === "Backspace" && this._text.length > 0) {
			this._text = this._text.slice(0, -1);
		}
	};

	mousedown () {
		this.focus = this.hover;
	};

	restartCarriage () {
		this.changeCarriage = 0;
		this.carriage = true;
	};

	updateCarriage () {
		this.changeCarriage++;
		if (this.changeCarriage >= config.changeCarriage) {
			this.changeCarriage = 0;
			this.carriage = !this.carriage;
		}
	};

	//нарисовать (в функцию передается hitbox, текущий текст, показывать ли каретку и placeholder)
	draw () {
		if (this.focus) this.updateCarriage();
		let carriage = this.carriage && this.focus;
		this.drawFunc(this.hitbox, this._text, carriage, this._text === "" ? this.placeholder : "");
	};
};

//слайдер
//может быть только горизонтальным, прямоугольным
class Slider extends Element {
	constructor (maxWidth, maxHeight, hitbox, drawFunc, min = 0, max = 1, dragWidth = 10, speed = config.sliderSpeed) {
		super(hitbox, maxWidth, maxHeight);

		if (!this.hitbox.hasOwnProperty("width")) throw new ReferenceError("Slider element must have width property");

		this.drawFunc = drawFunc;
		this.dragWidth = dragWidth;

		this._value = 0;
		this.target = 0;
		this.min = min;
		this.max = max;

		this.offset = dragWidth / 2;
		this.dragMax = this.hitbox.width - dragWidth;
		this.minX = this.hitbox.x + this.offset;
		this.maxX = this.hitbox.x + this.hitbox.width - this.offset;

		this.hold = false;

		this.speed = speed;
	};

	set value (value) {
		this.target = scale(limit(value, this.min, this.max), this.min, this.max, 0, 1);
	};

	get value () {
		return scale(this.target, 0, 1, this.min, this.max);
	};

	calcTarget (x) {
		x = limit(x, this.minX, this.maxX);
		this.target = scale(x, this.minX, this.maxX, 0, 1);
	};

	mousedown (x, y) {
		if (this.hover) {
			this.hold = true;
			this.calcTarget(x);
		} 
	};

	mouseup () {
		this.hold = false;
	};

	mousemove (x, y) {
		this.updateHover(x, y);
		if (this.hold) this.calcTarget(x);
	};

	//нарисовать (в функцию передается hitbox, ширина ползунка, максимальный сдвиг ползунка, текущее реальное значение и текущее масштабированное значение)
	draw () {
		this._value = lerp(this._value, this.target, this.speed);
		this.drawFunc(this.hitbox, this.dragWidth, this.dragMax, this._value, round(this.value, 5), this.active);
	};
};

//чекбокс
class Checkbox extends Element {
	constructor (maxWidth, maxHeight, hitbox, drawFunc) {
		super(hitbox, maxWidth, maxHeight);
		this.drawFunc = drawFunc;
		this.select = false;

		this.closeCheckBox = [];
	};

	get linked () {
		return this.closeCheckBox.length !== 0;
	};

	setClose (arr) {
		this.closeCheckBox = arr;
	};

	close () {
		this.select = false;
	};

	switch (value = !this.select) {
		if (!value && !this.linked) return this.select = false;
		this.select = true;
		this.closeCheckBox.forEach(e => e.close());
	};

	mousedown () {
		if (this.hover) {
			if (!this.linked) {
				this.select = !this.select;
			} else if (this.select === false) {
				this.select = true;
				this.closeCheckBox.forEach(e => e.close());
			}
		} 
	};

	//нарисовать (в функцию передается hitbox и отмечен ли чекбокс)
	draw () {
		this.drawFunc(this.hitbox, this.select);
	};
};

//общий класс элементов, принимает холст
class Elements {
	constructor (canvas) {
		this.canvas = canvas;
		this.elements = [];
		this.addEventListeners();

		this.clickReactions = [];
	};

	addClickReaction (func) {
		this.clickReactions.push(func);
	};

	clearClickReactions () {
		this.clickReactions = [];
	};

	get width () {
		return this.canvas.width;
	};

	get height () {
		return this.canvas.height;
	};

	add (element) {
		this.elements.push(element);
	};

	onresize () {
		this.elements.forEach(e => {
			e.maxWidth = this.width;
			e.maxHeight = this.height;
		});
	};

	onkeydown (event) {
		this.elements.forEach(e => {
			if (e.active) e.keydown(event);
		});
	};

	onmousedown (event) {
		if (event.which !== 1) return;

		let click = true;
		this.elements.forEach(e => {
			if (e.active) e.mousedown(event.x, event.y);
			if (click) click = !e.hover;
		});

		if (click) {
			this.clickReactions.forEach(f => f());
		}
	};

	onmouseup (event) {
		this.elements.forEach(e => {
			if (e.active) e.mouseup();
		});
	};

	onmousemove (event) {
		let changeCursor = false;
		this.elements.forEach(e => {
			if (e.active) {
				e.updateHover(event.x, event.y);
				e.mousemove(event.x, event.y);
			} 

			if (!changeCursor) {
				changeCursor = e.hover;
			}
		});
		
		document.body.style.cursor = changeCursor ? "pointer" : "default";
	};

	addEventListeners () {
		window.addEventListener("resize", event => this.onresize());
		window.addEventListener("keydown", event => this.onkeydown(event));
		window.addEventListener("mousedown", event => this.onmousedown(event));
		window.addEventListener("mouseup", event => this.onmouseup(event));
		window.addEventListener("mousemove", event => this.onmousemove(event));
	};

	//элементы создаются через этим методы
	btn (hitbox, onclick, drawFunc, hoverDrawFunc) {
		let element = new Btn(this.width, this.height, hitbox, onclick, drawFunc, hoverDrawFunc);
		this.add(element);
		return element;
	};

	textField (hitbox, drawFunc, maxLen, placeholder, filter) {
		let element = new TextField(this.width, this.height, hitbox, drawFunc, maxLen, placeholder, filter);
		this.add(element);
		return element;
	};

	slider (hitbox, drawFunc, min, max, dragWidth, speed) {
		let element = new Slider(this.width, this.height, hitbox, drawFunc, min, max, dragWidth, speed);
		this.add(element);
		return element;
	};

	checkbox (hitbox, drawFunc) {
		let element = new Checkbox(this.width, this.height, hitbox, drawFunc);
		this.add(element);
		return element;
	};

	groupCheckbox (arr) {
		for (let i = 0; i < arr.length; i++) {
			arr[i].setClose(arr.filter((e, index) => index !== i));
		}
	};
};

window.Elements = Elements;

})();

const elements = new Elements(canvas);