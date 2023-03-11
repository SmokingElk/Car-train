//нейронная сеть
class NeuralNetwork {
	/**
	 * @param {number} inputLayer - количество входных нейронов
	 * @param {number} hidden1 - количество нейронов первого скрытого слоя
	 * @param {number} hidden2 - количество нейронов второго скрытого слоя
	 * @param {number} output - количество выходных нейронов
	 * @param {Array} weights - веса сети (по умолчанию - случайные)
	 * @author SmokingElk
	 */
	constructor (inputLayer, hidden1, hidden2, output, weights) {
		this.inputNodes = inputLayer;
		this.hidden1Nodes = hidden1;
		this.hidden2Nodes = hidden2;
		this.outputNodes = output;

		//функция генерации веса
		const generateWeight = () => Math.random() * 2 - 1;

		//сигмоида
		const sigmoid = x => 1 / (1 + Math.exp(-x));

		//активационная функция сети
		this.activationFunc = e => sigmoid(e);

		//веса от входного слоя к скрытому слою
		this.weights12 = new Matrix(hidden1, inputLayer, 
			Array.isArray(weights) ? weights[0] : generateWeight);

		//веса от первого скрытого слоя ко второму скрытому слою
		this.weights23 = new Matrix(hidden2, hidden1, 
			Array.isArray(weights) ? weights[1] : generateWeight);

		//веса от первого скрытого слоя ко выходному слою
		this.weights34 = new Matrix(output, hidden2, 
			Array.isArray(weights) ? weights[2] : generateWeight);
	};

	/**
	 * опрос сети
	 * @param {number} input - передать на входные нейроны
	 * @returns {Array} - вернуть результат
	 * @author SmokingElk
	 */
	querry (input) {
		//преобразовать входной массив в матрицу
		let inputs = new Matrix(input.length, 1, input);

		//перемножить скрытые веса на входные значения и применить активационную функцию
		let hiddenOutputs1 = this.weights12.dot(inputs).forEach(this.activationFunc);

		//перемножить скрытые веса на входные значения и применить активационную функцию
		let hiddenOutputs2 = this.weights23.dot(hiddenOutputs1).forEach(this.activationFunc);

		//умножить выходные веса на  значения скрытого слоя, применить активационную функцию и вернуть результат ввиде массива
		return this.weights34.dot(hiddenOutputs2).forEach(this.activationFunc).getInArray();
	};

	/**
	 * получить веса
	 * @returns {Array} возвращает веса сети
	 * @author SmokingElk
	 */
	getWeights () {
		return [
			this.weights12.getInArray(), 
			this.weights23.getInArray(), 
			this.weights34.getInArray(),
		];
	};
};