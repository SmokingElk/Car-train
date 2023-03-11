class FileManager {
	constructor () {
		this.config = {
			maxRecentlyCount: 8,
		};

		this.recently = localStorage.getItem("recently") !== null ? JSON.parse(localStorage.getItem("recently")) : [];
		this.checkRecently();

		this.file = "";
		this.callback = () => {};

		const onchange = e => {
			this.file = e.target.value;

			if (e.target.id === "save") this.saveData("");
			this.callback(this.file);

			this.updateRecently(this.file);

			delete this.openField;

			this.openField = document.createElement("input");
			this.openField.setAttribute("type", "file");
			this.openField.setAttribute("accept", ".json");
			this.openField.setAttribute("id", "open");
			this.openField.addEventListener("change", onchange);
		};

		this.openField = document.createElement("input");
		this.openField.setAttribute("type", "file");
		this.openField.setAttribute("accept", ".json");
		this.openField.setAttribute("id", "open");
		this.openField.addEventListener("change", onchange);

		this.saveField = document.createElement("input");
		this.saveField.setAttribute("type", "file");
		this.saveField.setAttribute("accept", ".json");
		this.saveField.setAttribute("nwsaveas", "train.json");
		this.saveField.setAttribute("id", "save");
		this.saveField.addEventListener("change", onchange);
	};

	exist (path) {
		return new Promise(resolve => {
			fs.readFile(path, "utf8", (err, text) => {
				if (err) return resolve(false);
				resolve(true);
			});
		});
	};

	checkRecently () {
		return new Promise(async function (resolve) {
			let existFiles = [];
			for (let i of this.recently) {
				if (await this.exist(i)) existFiles.push(i);
			}

			let change = existFiles.length !== this.recently.length;

			this.recently = existFiles;
			localStorage.setItem("recently", JSON.stringify(this.recently));

			resolve(change);
		}.bind(this));
	};

	updateRecently (fileName) {
		if (this.recently.includes(fileName)) this.recently.splice(this.recently.indexOf(fileName), 1);
		this.recently.unshift(fileName);
		if (this.recently.length > this.config.maxRecentlyCount) this.recently.pop();

		this.checkRecently();
	};

	selectSave (callback = () => {}) {
		this.callback = callback;
		this.saveField.click();
	};

	selectOpen (callback = () => {}) {
		this.callback = callback;
		this.openField.click();
	};

	getData (path = this.file) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, "utf8", (err, text) => {
				if (err) return reject(err);
				resolve(text);
			});
		});
	};

	saveData (data, path = this.file) {
		fs.writeFileSync(path, data);
	};

	selectAndSave (name = "file", data) {
		const saveField = document.createElement("input");
		saveField.setAttribute("type", "file");
		saveField.setAttribute("accept", ".json");
		saveField.setAttribute("nwsaveas", name + ".json");

		const onready = () => {
			const path = saveField.value;
			fs.writeFileSync(path, data);
		};

		saveField.addEventListener("change", onready);
		saveField.click();
	};

	set path (value) {
		this.file = value;
		this.updateRecently(this.file);
	};
};

const fileManager = new FileManager();