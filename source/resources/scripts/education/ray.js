//класс луча
class Ray {
	constructor (len, dir, mixing) {
		this.startMixing = mixing || new Vector(0, 0);

		this.mixing = this.startMixing.copy();
		this.mixingAngle = inDeg(this.mixing.getAngle());
		this.p1 = this.mixing.copy();
		this.p2 = this.p1.copy().add(new Vector(len, 0).rotate(inRad(dir)));
		this.collisionPoint = -1;
		this.dir = dir;
		this.len = len;
		this.data = 1;
	};

	get start () {
		return this.p1.copy();
	};

	get end () {
		return this.p2.copy();
	};

	copy () {
		return new Ray(this.len, this.dir, this.startMixing.copy());
	};

	restart () {
		this.mixing = this.startMixing.copy();
		this.p1 = this.mixing.copy();
		this.p2 = this.p1.copy().add(new Vector(this.len, 0).rotate(inRad(this.dir)));
		this.data = 1;
		this.collisionPoint = -1;
	};

	/**
	 * обновляет сдвиг и поворот луча
	 * 
	 * @param {Number} pos обновленный сдвиг
	 * @param {Number} angle поворот луча
	 * @author SmokingElk
	 */
	update (pos, angle, walls) {
		this.mixing.rotate(inRad((angle + this.mixingAngle) % 360));
		this.p1 = pos.copy().add(this.mixing);
		this.p2 = this.p1.copy().add(new Vector(this.len, 0).rotate(inRad((this.dir + angle) % 360)));
		this.checkCollision(walls);
	};

	/**
	 * проверяет столкновение луча и стреком
	 * 
	 * @author SmokingElk
	 */
	checkCollision (walls) {
		let min = this.len;
		let dot = null;

		const map = walls;

		for (let k in map) {
			let line = map[k];
			
			for (let i = 1; i < line.length; i++) {
				let p3 = line[i - 1];
				let p4 = line[i];

				let result = physic.lineIntersection(this.p1, this.p2, p3, p4);
				if (result !== -1) {
					let dist = this.p1.mag(result);
					if (dist < min) {
						dot = result;
						min = dist;
					}
				}
			}
		}

		if (dot === null) {
			this.collisionPoint = -1;
			this.data = 1;
		} else {
			this.data = min / this.len;
			this.collisionPoint = dot;
		}	
	};

	/**
	 * получить точки начала и конца луча
	 * 
	 * @returns {Object} объект {p1: начало, p2: конец луча}
	 */
	getDots () {
		return {
			p1: this.p1,
			p2: this.collisionPoint !== -1 ? this.collisionPoint : this.p2
		};
	};

	get obj () {
		return {
			len: this.len,
			dir: this.dir,
			mixing: {
				x: this.startMixing.x,
				y: this.startMixing.y,
			},
		};
	};
};