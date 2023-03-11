//класс матрицы
class Matrix {
	constructor (height, width, content) {
		this.width = width;
		this.height = height;
		this.content = [];

		if (Array.isArray(content)) {
			for (let i = 0; i < height; i++) {
				this.content.push([]);
				for (let j = 0; j < width; j++) {
					this.content[this.content.length - 1][j] = content[i * width + j];
				}
			}
		} else if (typeof content === "function") {
			for (let i = 0; i < height; i++) {
				this.content.push([]);
				for (let j = 0; j < width; j++) {
					this.content[this.content.length - 1][j] = content(j, i);
				}
			}
		} else {
			let row = [];
			for (let i = 0; i < width; i++) {
				row.push(content);
			}
			for (let i = 0; i < height; i++) {
				this.content.push(row.slice(0, row.length));
			}
		}
	};

	//получить значения матрицы ввиде одномерного массива
	getInArray () {
		let final = [];
		for (let i = 0; i < this.height; i++) {
			final = final.concat(this.content[i]);
		}
		return final;
	};

	//получить значение по номеру ячейки
	getValue (x, y) {
		return this.content[y][x];
	};

	//задать значение
	setValue (x, y, v) {
		this.content[y][x] = v;
	};

	//точечное умножение
	dot (matrix) {
		if (this.width !== matrix.height) {
			throw new Error(`Cannot apply dot operation, if matrix width = ${this.width}, but matrix 2 height = ${matrix.height}`);
			return;
		}

		let result = new Matrix(this.height, matrix.width, 0);

		for (let i = 0; i < result.width; i++) {
			for (let j = 0; j < result.height; j++) {
				let cellValue = 0;
				for (let k = 0; k < this.width; k++) {
					cellValue += this.getValue(k, j) * matrix.getValue(i, k);
				}
				
				result.setValue(i, j, cellValue);
			}
		}

		return result;
	};

	//транспонировать
	transponse () {
		let result = new Matrix(this.width, this.height, 0);

		for (let i = 0; i < result.width; i++) {
			for (let j = 0; j < result.height; j++) {
				result.setValue(i, j, this.getValue(j, i));
			}
		}

		return result;
	};

	//для каждого элемента
	forEach (func) {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				this.setValue(i, j, func(this.getValue(i, j), i, j));
			}
		}
		return this;
	};

	//получить копью
	copy () {
		let result = new Matrix(this.height, this.width, 0);

		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				result.setValue(i, j, this.getValue(i, j));
			}
		}

		return result;
	};
};