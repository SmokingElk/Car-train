//класс вектора
class Vector {
	constructor (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z !== undefined ? z : NaN;
	};

	//задать значения
	set (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z !== undefined ? z : NaN;

		return this;
	};

	//сумма
	add (vector) {
		if (vector instanceof Vector) {
			this.x += vector.x;
			this.y += vector.y;
			this.z += vector.z;
		} else {
			this.x += vector;
			this.y += vector;
			this.z += vector;
		}

		return this;
	};

	//разность
	sub (vector) {
		if (vector instanceof Vector) {
			this.x -= vector.x;
			this.y -= vector.y;
			this.z -= vector.z;
		} else {
			this.x -= vector;
			this.y -= vector;
			this.z -= vector;
		}

		return this;
	};

	//произведение
	mult (vector) {
		if (vector instanceof Vector) {
			this.x *= vector.x;
			this.y *= vector.y;
			this.z *= vector.z;
		} else {
			this.x *= vector;
			this.y *= vector;
			this.z *= vector;
		}

		return this;
	};

	//деление
	div (vector) {
		if (vector instanceof Vector) {
			this.x /= vector.x;
			this.y /= vector.y;
			this.z /= vector.z;
		} else {
			this.x /= vector;
			this.y /= vector;
			this.z /= vector;
		}

		return this;
	};

	//длина
	mag (vector) {
		if (vector instanceof Vector) {
			let dist = Math.hypot(this.x - vector.x, this.y - vector.y);

			if (!isNaN(this.z) && !isNaN(vector.z)) {
				return Math.hypot(this.z - vector.z, dist);
			}

			return dist;
		} else {
			let dist = Math.hypot(this.x, this.y);

			if (!isNaN(this.z)) {
				return Math.hypot(this.z, dist);
			}

			return dist;
		}
	};

	//задать длинну
	setMag (len) {
		this.norm();
		this.mult(len);
		return this;
	};

	//нормализация
	norm () {
		let mag = this.mag();
		if (mag > 0) {
			this.div(mag);
		}
		return this;
	};

	//ограничить
	limit (max) {
  		if (this.mag() > max) {
    		this.setMag(max);
	  	} 
  		return this;
	};

	//получить угол
	getAngle (vector) {
		if (vector instanceof Vector) {
			let angle1 = Math.atan2(vector.y - this.y, vector.x - this.x);
			if (isNaN(this.z)) {
				return angle1;
			} else {
				let angle2 = Math.atan2(vector.z - this.z, Math.hypot(vector.x - this.x, vector.y - this.y));
				return [angle1, angle2];
			}
		} else {
			let angle1 = Math.atan2(this.y, this.x);
			if (isNaN(this.z)) {
				return angle1;
			} else {
				let angle2 = Math.atan2(this.z, Math.hypot(this.x, this.y));
				return [angle1, angle2];
			}
		}
	};

	//повернуть
	rotate (angle, angle2) {
		let dist = Math.hypot(this.x, this.y);
			
		this.x = Math.cos(angle) * dist;
	  	this.y = Math.sin(angle) * dist;

		if (!isNaN(this.z)) {
			this.z = Math.sin(angle2) * Math.hypot(this.z, dist);
		} 

		return this;
	};

	//получить тип
	type () {
		return isNaN(this.z) ? 2 : 3;
	};

	//копья
	copy () {
		return new Vector(this.x, this.y, this.z);
	};

	get obj () {
		return {x: this.x, y: this.y, z: this.z};
	};
};

//класс операций над векторами
class CalcVector {
	//сумма
	add (vector, vector2) {
		return vector.copy().add(vector2);
	};

	//разность
	sub (vector, vector2) {
		return vector.copy().sub(vector2);
	};

	//произведение
	mult (vector, vector2) {
		return vector.copy().mult(vector2);
	};

	//деление
	div (vector, vector2) {
		return vector.copy().div(vector2);
	};

	//задать длинну
	setMag (vector, len) {
		return vector.copy().setMag(len);
	};

	//нормализация
	norm (vector) {
		return vector.copy().norm();
	};

	//ограничить
	limit (vector, max) {
  		return vector.copy().limit(max);
	};

	//повернуть
	rotate (vector, angle) {
		return vector.copy().rotate(angle);
	};
};

const calcVector = new CalcVector();