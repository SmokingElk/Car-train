class Controller {
	constructor () {
		this.windows = {
			"main menu": new MainMenu(),
			"help menu": new HelpMenu(),
			"preparing step 1": new PreparingStep1(),
			"preparing step 2": new PreparingStep2(),
			"preparing step 3": new PreparingStep3(),
			"preparing step 4": new PreparingStep4(),
			"train menu": new TrainMenu(),
			"progress menu": new ProgressMenu(),
			"weights visualization menu": new WeightsVisualizationMenu(),

			"map editor": new MapEditorMenu(),
			"simulation": new SimulationMenu(),
		};
	};

	add (name, ...openArgs) {
		if (Array.isArray(name)) return name.forEach(e => this.popActive(e));
		if (!Object.keys(this.windows).includes(name)) throw new ReferenceError(`scene ${name} isn't defined`);

		this.windows[name].on(...openArgs);
	};

	pop (name) {
		if (Array.isArray(name)) return name.forEach(e => this.popActive(e));
		if (!Object.keys(this.windows).includes(name)) throw new ReferenceError(`scene ${name} isn't defined`);

		this.windows[name].off(); 
	};

	clear () {
		for (let i in this.windows) this.windows[i].off();
	};

	to (name, ...openArgs) {
		if (!Object.keys(this.windows).includes(name)) throw new ReferenceError(`scene ${name} isn't defined`);

		this.clear();
		this.add(name, ...openArgs);
	};

	update () {
		for (let i in this.windows) {
			if (this.windows[i].active) this.windows[i].update(); 
		}
	};
};

const controller = new Controller();