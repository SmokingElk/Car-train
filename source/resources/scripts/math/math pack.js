//степень 2
const pow = nmb => {return nmb * nmb};

//дискриминант
const D = (a, b, c) => {return pow(b) - (4 * a * c)};

//корни при положительном дискриминанте
const x1 = (a, b, D) => {return (-b + Math.sqrt(D)) / (2 * a)};
const x2 = (a, b, D) => {return (-b - Math.sqrt(D)) / (2 * a)};

//решить квадратное уравнение по коэффициентам
const quadraticEquation = (a, b, c) => {
	let d = D(a, b, c);

	if (d > 0) {
		return x1(a, b, d) + " и " + x2(a, b, d);
	} else if (d === 0) {
		return -b / (2 * a);
	} else {
		return "корней нет";
	}
};

//из градусов в радианы
const inRad = angle => {return angle * Math.PI / 180};

//радианы в градусы
const inDeg = (rad) => {return rad * 180 / Math.PI};

//полупериметр
const p = (a, b, c) => {return (a + b + c) / 2};

//площадь треугольника по:
//синусу и сторонам
const SSin = (a, b, angle) => {return 0.5 * (a * b * sin(angle))};

//формуле герона
const SHerone = (a, b, c) => {
	let hp = p(a, b, c);
	return Math.sqrt(hp * (hp - a) * (hp - b) * (hp - c));
};

//сторонам и радиусу
const SR = (a, b, c, R) => {return ((a * b * c) / (4 * R))};

//коссинус, принимает градусы
const cos = angle => {return Math.cos(inRad(angle))};

//синус, принимает градусы
const sin = angle => {return Math.sin(inRad(angle))};

//арккоссинус, возвращает результат в градусах
const acos = cos => {return inDeg(Math.acos(cos))};

//арксинус, возвращает результат в градусах
const asin = sin => {return inDeg(Math.asin(sin))};

//сторона по теореме коссинусов
const cosLine = (b, c, angle) => {return Math.sqrt((pow(b) + pow(c)) - (2 * b * c * cos(angle)))};

//угол по теореме коссинусов
const cosAngle = (a, b, c) => {return inDeg(Math.acos((pow(b) + pow(c) - pow(a)) / (2 * b * c)))};

//сторона по теореме синусов
const sinLine = (a, angle, angle2) => {return a * sin(angle2) / sin(angle)};

//угол по теореме синусов
const sinAngle = (a, b, angle) => {return asin(b * sin(angle) / a)};

//получить знак
const sgn = (v) => {
	if (v === 0) {
		return 0;
	} else if (v > 0) {
		return 1;
	} else {
		return -1;
	}
};

//получить синус
const getCos = (x1, y1, x2, y2) => {
	let dx = x2 - x1;
	let dy = y2 - y1;

	return sgn(dx) * Math.sqrt(Math.pow(dx, 2) / (Math.pow(dx, 2) + Math.pow(dy, 2)));
};

//получить косинус
const getSin = (x1, y1, x2, y2) => {
	let dx = x2 - x1;
	let dy = y2 - y1;

	return sgn(dy) * Math.sqrt(Math.pow(dy, 2) / (Math.pow(dx, 2) + Math.pow(dy, 2)));
};

//линейная интерполяция
const lerp = (x1, x2, step) => {return x1 + step * (x2 - x1)};

//масштабировать
const scale = (value, min, max, minR, maxR) => minR + ((maxR - minR) * ((value - min) / (max - min)));

//ограничить
const limit = (value, min, max) => {
	if (value > max) return max;
	if (value < min) return min;
	return value;
};

//найти максимум
const max = arr => {
	let max = arr[0];
	for (let i of arr) {
		if (i > max) max = i;
	}
	return max;
};

//округление до знака
const round = (num, sgn) => {
	let d = 10**sgn;
	return Math.round(num * d) / d;
};

//кривая безье
const curve = function (x, x1, y1, x2, y2, step = 0.001) {
	if (x === 0 || x === 1) return x;

	let c1 = new Vector(x1, y1);
	let c2 = new Vector(x2, y2);
	
	const getDot = (step) => {
		let dot1 = calcVector.mult(c1, step);
		let dot2 = calcVector.mult(calcVector.sub(c2, c1), step).add(c1);
		let dot3 = calcVector.mult(calcVector.sub(new Vector(1, 1), c2), step).add(c2);
		let dot21 = calcVector.mult(calcVector.sub(dot2, dot1), step).add(dot1);
		let dot22 = calcVector.mult(calcVector.sub(dot3, dot2), step).add(dot2);
		return calcVector.mult(calcVector.sub(dot22, dot21), step).add(dot21);
	};

	for (let i = 0; i < 1; i += step) {
		let dot1 = getDot(i);
		let dot2 = getDot(i + step);

		if (dot1.x === x) return dot1.y;
		if (dot1.x < x && x < dot2.x) return dot1.add(dot2).div(2).y;
	}
};

//находится ли точка внутри прямоугольника
const isPointInRect = (dotX, dotY, x, y, w, h) => x < dotX && dotX < x + w && y < dotY && dotY < y + h;

//если не undefined верни это значение, иначе верни второе значение
const exist = (value, alternativeValue) => value !== undefined ? value : alternativeValue;