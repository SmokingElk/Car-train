const loop = new Loop();

window.onload = async function () {
	await sprites.loadPack({
		"home": "home.png",
		"question": "question.png",
	}, "resources/imgs");

	loop.nextFrame();
	controller.to("main menu");
};