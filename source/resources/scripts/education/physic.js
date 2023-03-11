//физика
class Physic {
	constructor () {};

	// dotInLine (a, b, dot) {
	// 	return Math.abs(a.mag(b) - (a.mag(dot) + dot.mag(b))) < 0.0001;
	// };

	// lineIntersection (p1, p2, p3, p4) {
	// 	let x1 = p1.x,
	// 		y1 = p1.y,
	// 		x2 = p2.x,
	// 		y2 = p2.y,
	// 		x3 = p3.x,
	// 		y3 = p3.y,
	// 		x4 = p4.x,
	// 		y4 = p4.y;

	// 	let k1 = (y2 - y1) / (x2 - x1);
	// 	let b1 = y1 - x1 * k1;
	// 	let k2 = (y4 - y3) / (x4 - x3);
	// 	let b2 = y3 - x3 * k2;

	// 	let x = (b2 - b1) / (k1 - k2);
	// 	let y = k1 * x + b1;

	// 	let res = new Vector(x, y);

	// 	return this.dotInLine(p1, p2, res) && this.dotInLine(p3, p4, res) ? res : -1;
	// };

	lineIntersection(p1, p2, p3, p4) {
		let x1 = p1.x,
			y1 = p1.y,
			x2 = p2.x,
			y2 = p2.y,
			x3 = p3.x,
			y3 = p3.y,
			x4 = p4.x,
			y4 = p4.y;

		let eps = 0.0000001;
		const between = (a, b, c) => a - eps <= b && b <= c + eps;

	    let x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
	    let y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

	    if (isNaN(x) || isNaN(y)) {
	        return -1;
	    } else {
	        if (x1 >= x2) {
	            if (!between(x2, x, x1)) return -1;
	        } else {
	            if (!between(x1, x, x2)) return -1;
	        }

	        if (y1 >= y2) {
	            if (!between(y2, y, y1)) return -1;
	        } else {
	            if (!between(y1, y, y2)) return -1;
	        }

	        if (x3 >= x4) {
	            if (!between(x4, x, x3)) return -1;
	        } else {
	            if (!between(x3, x, x4)) return -1;
	        }

	        if (y3 >= y4) {
	            if (!between(y4, y, y3)) return -1;
	        } else {
	            if (!between(y3, y, y4)) return -1;
	        }
	    }

	    return new Vector(x, y);
	}
};

const physic = new Physic();