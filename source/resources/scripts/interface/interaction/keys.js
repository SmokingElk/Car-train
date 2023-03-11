//проверка клавиш
class Keys {
	constructor () {
		this.clickReaction = true;
		this.keys = [];

		window.onkeydown = (event) => {
			if (!keys.keys.includes(event.code)) {
				keys.keys.push(event.code);
			}
		};

		window.onkeyup = (event) => {
			let newKeys = [];

			for (let i in keys.keys) {
				if (keys.keys[i] !== event.code) {
					newKeys.push(keys.keys[i]);
				}
			}

			keys.keys = newKeys;
		};
	};

	isPressed (code) {
		return this.keys.includes(code);
	};
};

const keys = new Keys();