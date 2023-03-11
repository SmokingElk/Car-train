hideLog = true;
structure = [
	{
		type: "css",
		rootDir: "css",
		files: [
			"style",
			"fonts/font",
		],
	},

	{
		type: "js",
		rootDir: "scripts",
		files: [
			{
				rootDir: "dev tools",
				files: [
					"dev tools hot keys"
				],
			},

			{
				rootDir: "math",
				files: [
					"math pack",
					"gradient values transitions",
					"matrix",
					"vectors",
					"random",
				],
			},

			{
				rootDir: "node js",
				files: [
					"module import",
					"file manager",
				],
			},

			{
				rootDir: "education",
				files: [
					"neural network",
					"physic",
					"ray",
					"player",
					"education",
				],
			},

			{
				rootDir: "interface",
				files: [
					{
						rootDir: "graphics",
						files: [
							"canvas",
							"camera",
							"sprite manager",
						],
					},

					{
						rootDir: "params",
						files: [
							"fonts",
							"colors",
						],
					},

					{
						rootDir: "interaction",
						files: [
							"keys",
							"mouse",
							"canvas elements",
						],
					},

					{
						rootDir: "lang",
						files: [
							"dict",
							"lang",
						],
					},

					{
						rootDir: "menu",
						files: [
							"layout",
							"template",
							"menu",
							"main menu",
							"map editor",
							"simulation",
							"preparing step",
							"preparing step 1",
							"preparing step 2",
							"preparing step 3",
							"preparing step 4",
							"train show",
							"train menu",
							"progress menu",
							"weights visualization menu",
							"help menu",
							"controller",
						],
					},

					"loop",
					"onload",
				],
			},
		],
	},
];