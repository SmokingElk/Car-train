//модуль с методами генерации случайных значений
class Random {
	//случайный элемент из массива
	randomElement (collection) {
		return collection[Math.floor(Math.random() * collection.length)];
	};

	//случайное число в диапозоне
	randomRange (min, max, round) {
		let nmb = min + Math.random() * (max - min);
		return round ? Math.floor(nmb) : nmb;
	};
};

const random = new Random();

//волновой шум
class WaveNoise {
	constructor (requiredWaves, speed) {
		this.wavesSet = [];
		this.speed = speed || 1;

		for (let i = 0; i < requiredWaves; i++) {
			this.wavesSet.push(Math.random() * 360);
		}
	};

	//получить текущее значение
	getValue () {
		let blendedWave = 0;

		//считаем сумму синус волн
		this.wavesSet.forEach(e => {
			blendedWave += Math.sin(e / 180 * Math.PI);
		});

		//результат масштабируем до диапозона от 0 до 1
		return (blendedWave / this.wavesSet.length + 1) / 2;
	};

	//обновить значения
	update () {
		this.wavesSet.forEach((e, i) => {
			this.wavesSet[i] = (e + (Math.random() * (i + 1) * this.speed)) % 360;
		});
	};
};

//случайное распределение по гауссу
//случайное распределение по гаусу
class Gaussian {
	constructor () {
		let ready = false;
		let second = 0.0;
		
		this.next = function(mean, dev) {
			mean = mean == undefined ? 0.0 : mean;
			dev = dev == undefined ? 1.0 : dev;
			
			if (this.ready) {
				this.ready = false;
				return this.second * dev + mean;
			} else {
				let u, v, s;
				do {
					u = 2.0 * Math.random() - 1.0;
					v = 2.0 * Math.random() - 1.0;
					s = u * u + v * v;
				} while (s > 1.0 || s == 0.0);
				
				let r = Math.sqrt(-2.0 * Math.log(s) / s);
				this.second = r * u;
				this.ready = true;
				return r * v * dev + mean;
			}
		};
	};
	
	get (mean, sd) {
		return sd * this.next() + mean;
	};
};