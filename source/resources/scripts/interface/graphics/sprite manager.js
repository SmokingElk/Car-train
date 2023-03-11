//загрузчик
class SpritesLoader {
	constructor () {
		this.catalog = {};
		this.allImgs;
		this.loadedImgs;
	};

	loadPack (data, rootFolder) {
		return new Promise(resolve => {
			this.allImgs = Object.keys(data).length;
			this.loadedImgs = 0;

			for (let i in data) {
				let img = new Image();
				img.src = path.join(nw.global.__dirname, rootFolder, data[i]);

				img.onload = () => {
					this.loadedImgs++;
					if (this.loadedImgs === this.allImgs) resolve();
				};

				this.catalog[i] = img;
			}
		});
	};

	get (id) {
		let img = this.catalog[id];
		if (img) return img;
		return false;
	};

	getLoadStatus () {
		return this.loadedImgs / this.allImgs;
	};

	createNameData (namesList, type = ".png") {
		let data = {};
		for (let i of namesList) data[i] = i + type;
		return data;
	};
};

//загрузчик 
const sprites = new SpritesLoader();

//класс спрайта
class Sprite {
	constructor (name, speed, frameCount) {
		this.img = spritesLoader.get(name);
		this.nextFrame = speed;
		this.counter = 0;
		this.frameCount = frameCount;
		this.currentFrame = 0;
		this.frameWidth = this.img.width / this.frameCount;
		this.width = this.img.width;
		this.height = this.img.height;
	};

	//сбросить
	reset () {
		this.counter = 0;
		this.frame = 0;
	};

	//нарисовать
	draw (x, y, width, height) {
		ctx.drawImage(this.img, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.height, x, y, width, height);
		this.counter++;
		if (this.counter >= this.nextFrame) {
			this.counter = 0;
			this.currentFrame++;
			if (this.currentFrame === this.frameCount) {
				this.currentFrame = 0;
			}
		}
	};
};