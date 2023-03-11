(() => {
    const launchParams = {
        entryFileName: "resources/index.html",
        params: {
            frame: false,
            fullscreen: true,
            icon: "resources/imgs/icon.png",
        },
    };

    nw.Window.open(launchParams.entryFileName, launchParams.params, win => {});
})();
