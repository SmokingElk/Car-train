//обучение ИИ водить
class Education {
	constructor () {
		this.clear();
	};

	start () {
		this.settingReady = true;
		this.save();

		if (this.gen === 0) this.nextGen();
	};

	//очистить все параметры
	clear () {
		this.settingReady = false;

		this.physic = {
			speedLimit: 5,

			acc: 0.3,

			smooth: 0.9,

			rotateSpeed: 4,

			carInteraction: false,
			spawnInterval: 400,

			carWidth: 15,
			carHeight: 35,
		};

		this.eduParams = {
			hidden1: 2,
			hidden2: 2,

			maxDriveTime: 10,
			inOneGen: 80, 

			mutation: 0.1,
			mutationChance: 0.02,
			weightLimit: 1.0,

			collisionPrescaler: 1.0,

			pow: 6,
		};

		this.map = {
			walls: [],
			checkPoints: [],
		};

		this.rays = [];
		this.cars = [];
		this.gen = 0;
		this.time = 0;
		this.ready = 0;

		this.statistics = {
			best: [],
			average: [],

			get maxScore () {
				return Math.max(...this.best);
			},
		};

		this.importThisGen = false;
	};

	//готовы ли все параметры
	get ok () {
		let unready = [];
		if (this.eduParams.inOneGen < 2 || this.eduParams.hidden1 <= 0 || this.eduParams.hidden2 <= 0) unready.push(2);
		if (this.rays.length === 0) unready.push(1);
		if (this.map.walls.length === 0 || this.map.checkPoints.length === 0) unready.push(3);
		return unready.length === 0 ? "ok" : unready;
	};

	get json () {
		let obj = {
			eduParams: this.eduParams,
			physic: this.physic,
			gen: this.gen,
			rays: this.rays.map(e => e.obj),

			map: {
				walls: this.map.walls.map(arr => arr.map(e => e.obj)),
				checkPoints: this.map.checkPoints.map(e => e.obj),
			},

			settingReady: this.settingReady,
		};

		if (this.settingReady) {
			obj.statistics = {
				best: this.statistics.best.map(e => e),
				average: this.statistics.average.map(e => e),
			};

			obj.cars = this.cars.map(e => e.NN.getWeights());
		}

		return JSON.stringify(obj, null, 4);
	};

	save () {
		fileManager.saveData(this.json);
	};

	load (json) {
		const data = JSON.parse(json);

		this.gen = data.gen;

		this.eduParams = data.eduParams;
		this.physic = data.physic;

		this.rays = [];

		for (let i of data.rays) this.rays.push(new Ray(i.len, i.dir, new Vector(i.mixing.x, i.mixing.y)));

		this.map = {
			walls: data.map.walls.map(arr => arr.map(e => new Vector(e.x, e.y))),
			checkPoints: data.map.checkPoints.map(e => new Vector(e.x, e.y)),
		};

		this.settingReady = data.settingReady ?? true;

		if (!this.settingReady) return;

		this.statistics = {
			best: data.statistics.best,
			average: data.statistics.average,

			get maxScore () {
				return Math.max(...this.best);
			},
		};

		this.cars = [];

		for (let i = 0; i < data.cars.length; i++) {
			this.cars.push(new Player(
				this.rays, 
				data.cars[i],
				this.map.walls, 
				this.map.checkPoints, 
				this.eduParams, 
				i,
			));
		}
	};

	importWeights () {
		const weights = education.cars.sort((a, b) => {
			if (a.dist > b.dist) return -1;
			if (a.dist < b.dist) return 1;
			return 0;
		}).map(e => e.NN.getWeights());

		const importData = {
			physic: this.physic,
			rays: this.rays.map(e => e.obj),
			weights,

			eduParams: {
				hidden1: this.eduParams.hidden1,
				hidden2: this.eduParams.hidden2,
				inOneGen: this.eduParams.inOneGen, 
			},
		};

		let writeFile = e => {
			let file = e.target.value;
			let saveData = JSON.stringify(importData, null, 4);
			fs.writeFileSync(file, saveData);
		};	

		let saveField = document.createElement("input");
		saveField.setAttribute("type", "file");
		saveField.setAttribute("accept", ".json");
		saveField.setAttribute("nwsaveas", "result.json");
		saveField.addEventListener("change", writeFile);

		saveField.click();
	};

	//обновить статистику
	updateStatistic (players) {
		let maxScore = 0;
		let sum = 0;

		for (let i of players) {
			maxScore = Math.max(maxScore, i.rate);
			sum += i.rate;
		}

		this.statistics.best.push(maxScore);
		this.statistics.average.push(sum / players.length);
	};

	/**
	 * обновить все симуляции, 
	 * сгенерировать новое поколение, если время на поколение - закночилось или все машины столкнулись с препятствием 
	 * 
	 * @author SmokingElk
	 */
	update () {
		const eduParams = this.eduParams;

		this.ready = 0;
		for (let i in this.cars) {
			if (this.cars[i].isEnd) {
				this.ready++;
			} else {
				this.cars[i].move(null, this.physic, true, this.physic.carInteraction, this.cars);
			}
		}

		this.time += 1000 / 60;
		let attemptTime = eduParams.maxDriveTime * 1000;
		if (this.physic.carInteraction) attemptTime += this.eduParams.inOneGen * this.physic.spawnInterval;

		if (this.time > attemptTime || this.ready >= eduParams.inOneGen) {
			this.time = 0;
			this.nextGen();
		}
	};

	/**
	 * получить список машин
	 * 
	 * @returns {array} массив игроков с маркером вероятности выбора
	 * @author SmokingElk
	 */ 
	getPlayers () {
		let players = [];

		let sum = 0;
		for (let i of this.cars) {
			let result = i.getPlayer();
			result.rate = Math.pow(result.rate, this.eduParams.pow);
			sum += result.rate;
			players.push(result);
		}

		for (let i of players) i.quality = i.rate / sum;

		return players;
	};

	/** 
	 * получить родителя
	 * 
	 * @param {Array} players - принимает массив игроков с указанием вероятности выбора
	 * @returns {Array} выбранный набор весовых коэффициентов сети
	 * @author SmokingElk
	 */
	getParent (players) {
		let randomNmb = Math.random();
		let rand = 0;

		for (let i = 0; i < players.length; i++) {
			if (players[i].quality + rand > randomNmb) {
				return players[i].weights;
			} else {
				rand += players[i].quality;
			}
		}
	};

	/**
	 * выбирает двух родителей для скрещивания
	 * 
	 * @param {Array} players - принимает массив игроков
	 * @returns {Array} новый набор весовых коэффициентов сети
	 * @author SmokingElk
	 */
	crossover (players) {
		//новые веса
		let newWeights = [[], [], []];

		let parent1 = this.getParent(players);
		let parent2 = this.getParent(players);

		//метод кроссовера
		for (let j = 0; j < parent1.length; j++) {
			//разделительная линия
			let crossover = Math.random() * parent1[j].length;

			for (let i = 0; i < parent1[j].length; i++) {
				if (i < crossover) {
					newWeights[j].push(parent1[j][i]);
				} else {
					newWeights[j].push(parent2[j][i]);
				}
			}
		}

		return newWeights;
	};

	/**
	 * мутация
	 * 
	 * @param {Array} child - массив весов для мутации
	 * @returns обновленный массив весов
	 * @author SmokingElk
	 */
	mutation (child) {
		const eduParams = this.eduParams;
		const random = (min, max) => Math.random() * (max - min) + min;

		for (let j = 0; j < child.length; j++) {
			for (let i = 0; i < child[j].length; i++) {
				if (Math.random() < eduParams.mutationChance) {
					child[j][i] = random(-eduParams.weightLimit, eduParams.weightLimit);
				}
			}
		}

		return child;
	};

	/**
	 * сгенерировать новое поколение, в первый раз поколения генерируются случайным образом
	 * 
	 * @author SmokingElk
	 */
	nextGen () {
		const eduParams = this.eduParams;

		if (this.gen === 0) {
			for (let i = 0; i < eduParams.inOneGen; i++) {
				this.cars.push(new Player(
					this.rays,
					null,
					this.map.walls, 
					this.map.checkPoints, 
					this.eduParams, 
					i,
				));
			}
		} else {
			if (this.importThisGen) this.importWeights();
			this.importThisGen = false;

			let players = this.getPlayers();

			this.updateStatistic(players);

			let cars = [];

			for (let i = 0; i < eduParams.inOneGen; i++) {
				cars.push(new Player(
					this.rays, 
					this.mutation(this.crossover(players)),
					this.map.walls, 
					this.map.checkPoints, 
					this.eduParams, 
					i,
				));
			}

			this.cars = cars;
		}
		this.gen++;

		this.save();
	};

	/**
	 * перезапустить последнее поколение
	 *
	 * @author SmokingElk
	 */
	restartGen () {
		for (let car of this.cars) {
			car.restart();
		}

		this.time = 0;
		this.ready = 0;
	};
};

const education = new Education();