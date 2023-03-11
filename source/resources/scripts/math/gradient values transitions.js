class TransitionValue {
	constructor (start, end, time, func) {
		this.func = func;
		this.start = start;
		this.end = end;
		this.endTime = time * 1000;
		this.time = 0;
		this.isEnd = false;

		this.revers = false;
	};

	complete () {
		this.isEnd = true;

		return this;
	};

	switch () {
		[this.start, this.end] = [this.end, this.start];
		this.time = 0;
		this.isEnd = false;
		this.revers = !this.revers;

		return this;
	};

	getValue () {
		this.time += 1000 / 60;
		if (this.time >= this.endTime) this.isEnd = true;
		if (this.isEnd) return this.end;
		let pos = this.func(this.time / this.endTime);
		return scale(pos, 0, 1, this.start, this.end);
	};

	get progress () {
		return this.time / this.endTime;
	};
};

class UpValue extends TransitionValue {
	constructor (start, end, time) {
		super(start, end, time, step => curve(step, 0.5, 0, 0.81, 0.405));
	};
};

class DownValue extends TransitionValue {
	constructor (start, end, time) {
		super(start, end, time, step => curve(step, 0.005, 0.41, 0.62, 1));
	};
};

class InOutValue extends TransitionValue {
	constructor (start, end, time) {
		super(start, end, time, step => curve(step, 0.58, 0, 0.42, 1));
	};
};

class OutInValue extends TransitionValue {
	constructor (start, end, time) {
		super(start, end, time, step => curve(step, 0, 0.455, 0.995, 0.48));
	};
};