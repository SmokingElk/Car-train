(() => {

const defaultLang = "ru";

//класс файла
class Lang {
	constructor () {
		this._current = localStorage.getItem("lang") ?? "en";
	};

	set current (value) {
		this._current = value;
		localStorage.setItem("lang", value);
	};

	get current () {
		return this._current;
	};

	translate (text) {
		if (this._current === defaultLang) return text;
		return textsDict[this._current][text] ?? text;
	};
};

window.lang = new Lang();

CanvasRenderingContext2D.prototype.fillTextOld = CanvasRenderingContext2D.prototype.fillText;

CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
	this.fillTextOld(lang.translate(text), x, y);
};

})();