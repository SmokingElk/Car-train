(() => {

//константы и переменные
const columnLeftText = "На 2-м этапе подготовки к тренировке требуется  установить значения необходимых числовых параметров. Здесь выделено 3 раздела. Параметры 1-го раздела характеризуют физику симуляции - законы движения автомобиля по треку. К параметрам данного раздела относятся: ускорение, коэффициент трения (определяет потерю скорости при отсутствии газа, при значению один соответствует отсутствие потери), скорость поворота (величина в градусах, определяющая угловую скорость поворота автомобиля). Параметры 2-го раздела характеризуют генетический алгоритм, осуществляющий обучение сети методом нейроэволюции. Наиболее важными параметрами здесь являются: 1. размер популяции. Данный параметр прямо пропорционален скорости обучения и обратно пропорционален нагрузке на ПО. Рекомендуемое значение параметра - 80."; 
const columnRightText = "2. максимальное время на поколение: определяет число секунд, которые даются ИИ на попытку пройти трек в процессе обучения. Необходимо, чтобы этого времени было достаточно на прохождение дистанции по меньшей мере равной длине трека (для кругового трека - длине круга).  Параметры 3-го раздела характеризуют ИНС, обучение которой будет производиться в процессе работы программы. Наиболее важные значения. которые нужно задать - число нейронов в каждом из слоев. Вычислительная способность сети напрямую зависит от этого значения. Оптимальным значением данного параметра является  число, которое на 1-2 меньше количества лучей (см. этап 1). Для удобства пользователя все параметры имеют значения по умолчанию, которые подходят для успешной реализации большинства тренировок. ";

//класс файла
class PreparingStep2 extends PreparingStep {
	constructor () {
		super({
			subtitle: "2-й этап",
			columnLeftText,
			columnRightText,
			backMenuName: "preparing step 2",
		});

		this.marginTop = template.headerOffset + template.titleSize + template.headerMargin + template.config.field.paddingTop + template.subTitleSize + 42;
		this.lineHeight = 90;

		// ФИЗИКА 
		//ускорение
		this.sliderAcc = this.createSlider(0, 0, "Ускорение", 0.1, 0.8);

		//трение
		this.sliderSmooth = this.createSlider(0, 1, "Трение", 0.9, 1.0);

		//скорость поворота
		this.sliderRotateSpeed = this.createSlider(0, 2, "Скорость поворота", 3, 6);

		// включить взаимодействие между машинами
		this.checkboxCarInteraction = this.createCheckbox(0, 3, "Взаимодействие машин");

		//ГЕНЕТИЧЕСКИЙ АЛГОРИТМ
		//размер популяции
		this.textFieldPopulationSize = this.createTextField(4, 0, "Размер популяции", 3);

		//максимальное время на одно поколение
		this.sliderMaxTime = this.createSlider(4, 1, "Максимальное время на поколение", 5, 30);

		//вероятность мутации
		this.sliderMutationChance = this.createSlider(4, 2, "Вероятность мутации", 0.01, 0.5);

		//величина мутации
		this.sliderMutationValue = this.createSlider(4, 3, "Величина мутации", 0.05, 0.5);

		//подавление столкновений 
		this.sliderCollisionPrescaler = this.createSlider(4, 4, "Подавление столкновений", 0.0, 1.0);

		//НЕЙРОННАЯ СЕТЬ
		//число нейронов в первом скрытом слое
		this.textFieldNeournsCount1 = this.createTextField(8, 0, "Число нейронов в 1-м скрытом слое", 2);

		//число нейронов в втором скрытом слое
		this.textFieldNeournsCount2 = this.createTextField(8, 1, "Число нейронов в 2-м скрытом слое", 2);

		//максимальный модуль весового коэффициента
		this.sliderMaxWeight = this.createSlider(8, 2, "максимальный модуль веса", 0.9, 1.5);

		this.elems = [
			this.readyBtn,
			this.homeBtn,
			this.helpBtn,

			this.sliderAcc,
			this.sliderSmooth,
			this.sliderRotateSpeed,
			this.checkboxCarInteraction,

			this.textFieldPopulationSize,
			this.sliderMaxTime,
			this.sliderMutationChance,
			this.sliderMutationValue,
			this.sliderCollisionPrescaler,

			this.textFieldNeournsCount1,
			this.textFieldNeournsCount2,
			this.sliderMaxWeight,
		].concat(this.createStepBtns(2));
	};

	createSlider (x, y, text, min, max) {
		return elements.slider({
			marginTop: this.marginTop,
			lineHeight: this.lineHeight,

			col: x,
			row: y,

			get x () {
				return layout.column(this.col) + template.config.field.paddingLeft;
			},

			get y () {
				return layout.row(this.marginTop, this.lineHeight, 0, this.row) + template.config.slider.textMarginBottom;
			},

			width: template.config.slider.width,
			height: template.config.slider.height,
			text: text,
		}, (hitbox, dragWidth, dragMax, realValue, value, active) => {
			template.drawSlider(hitbox, dragWidth, dragMax, realValue, value, active);
		}, min, max, template.config.slider.dragWidth);
	};

	createCheckbox (x, y, text) {
		return elements.checkbox({
			marginTop: this.marginTop,
			lineHeight: this.lineHeight,

			col: x,
			row: y,

			get x () {
				return layout.column(this.col) + template.config.field.paddingLeft + this.radius;
			},

			get y () {
				return layout.row(this.marginTop, this.lineHeight, 0, this.row) + template.config.textField.textMarginBottom + this.radius;
			},

			radius: 8,
			text: text,
		}, (hitbox, selected) => {
			template.drawCheckbox(hitbox, selected);

			template.text(
				"Экспериментальная настройка!", 
				hitbox.x - hitbox.radius, 
				hitbox.y - hitbox.radius - template.config.slider.textMarginBottom,
				"left",
				"bottom",
				colors.red,
			);
		});
	};

	createTextField (x, y, text, maxLen = 7, placeholder = "введите цисло", filter = /\d/) {
		return elements.textField({
			marginTop: this.marginTop,
			lineHeight: this.lineHeight,

			col: x,
			row: y,

			get x () {
				return layout.column(this.col) + template.config.field.paddingLeft;
			},

			get y () {
				return layout.row(this.marginTop, this.lineHeight, 0, this.row) + template.config.textField.textMarginBottom;
			},

			width: template.config.textField.width,
			height: template.config.textField.height,
			text: text,
		}, (hitbox, text, carriage, placeholder) => {
			template.drawTextField(hitbox, text, carriage, placeholder);
		}, maxLen, placeholder, filter);
	};

	drawTitle () {
		ctx.save();
		template.title("Настройка параметров", layout.paddingLeft, template.headerOffset);
		ctx.restore();
	};

	drawPhysicBlock () {
		ctx.save();

		ctx.translate(layout.column(0), template.headerOffset + template.titleSize + template.headerMargin);

		const blockWidth = layout.fieldWidth(4);

		template.field(0, 0, blockWidth, height - template.titleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.subTitle("Физика", 0, 0);

		ctx.restore();
	};

	drawGeneticAlgorithmBlock () {
		ctx.save();

		ctx.translate(layout.column(4), template.headerOffset + template.titleSize + template.headerMargin);

		const blockWidth = layout.fieldWidth(4);

		template.field(0, 0, blockWidth, height - template.titleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.subTitle("Генетический алгоритм", 0, 0);

		ctx.restore();
	};

	drawNeuralNetworkBlock () {
		ctx.save();

		ctx.translate(layout.column(8), template.headerOffset + template.titleSize + template.headerMargin);

		const blockWidth = layout.fieldWidth(4);

		template.field(0, 0, blockWidth, height - template.titleSize - template.headerMargin - template.headerOffset - layout.config.paddingBottom);

		ctx.translate(template.fieldPaddingLeft, template.fieldPaddingTop);

		template.subTitle("Нейронная сеть", 0, 0);

		ctx.restore();
	};

	onactive () {
		this.timer = this.params.unready;
			
		this.sliderAcc.value = education.physic.acc;
		this.sliderSmooth.value = education.physic.smooth;
		this.sliderRotateSpeed.value = education.physic.rotateSpeed;

		let carInteraction = education.physic.carInteraction;
		this.checkboxCarInteraction.switch(carInteraction);

		this.textFieldPopulationSize.text = education.eduParams.inOneGen !== 0 ? education.eduParams.inOneGen : "";
		this.sliderMaxTime.value = education.eduParams.maxDriveTime;
		this.sliderMutationChance.value = education.eduParams.mutationChance;
		this.sliderMutationValue.value = education.eduParams.mutation;
		this.sliderCollisionPrescaler.value = education.eduParams.collisionPrescaler;

		this.textFieldNeournsCount1.text = education.eduParams.hidden1 !== 0 ? education.eduParams.hidden1 : "";
		this.textFieldNeournsCount2.text = education.eduParams.hidden2 !== 0 ? education.eduParams.hidden2 : "";
		this.sliderMaxWeight.value = education.eduParams.weightLimit;
	};

	setValues () {
		education.physic.acc = this.sliderAcc.value;
		education.physic.smooth = this.sliderSmooth.value;
		education.physic.rotateSpeed = this.sliderRotateSpeed.value;

		education.physic.carInteraction = this.checkboxCarInteraction.select;

		education.eduParams.inOneGen = Number(this.textFieldPopulationSize.text);
		education.eduParams.maxDriveTime = this.sliderMaxTime.value;
		education.eduParams.mutationChance = this.sliderMutationChance.value;
		education.eduParams.mutation = this.sliderMutationValue.value;
		education.eduParams.collisionPrescaler = this.sliderCollisionPrescaler.value;

		education.eduParams.hidden1 = Number(this.textFieldNeournsCount1.text);
		education.eduParams.hidden2 = Number(this.textFieldNeournsCount2.text);
		education.eduParams.weightLimit = this.sliderMaxWeight.value;

		education.save();
	};

	update () {
		ctx.save();

		this.checkboxCarInteraction.select ? this.sliderCollisionPrescaler.on() : this.sliderCollisionPrescaler.off();

		template.drawHeader();

		this.drawFakeBtn(2);
		this.drawTitle();

		this.drawPhysicBlock();
		this.drawGeneticAlgorithmBlock();
		this.drawNeuralNetworkBlock();

		this.drawElems();
		this.drawUnready();

		this.setValues();

		ctx.restore();
	};
};

// экспорт
window.PreparingStep2 = PreparingStep2;

})();