module.exports = {
	mode: "jit",
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primarygreen: "#61B15A",
			},
			keyframes: {
				slideIn: {
					"0%": { transform: "translateX(100%)", opacity: 0 },
					"100%": { transform: "translateX(0%)", opacity: 1, display: "flex" },
				},
				slideOut: {
					"0%": { transform: "translateX(0)", opacity: 1 },
					"100%": { transform: "translateX(100%)", opacity: 0, display: "none" },
				},
			},
			animation: {
				slideIn: "slideIn .5s ease-in-out forwards",
				slideOut: "slideOut .5s ease-in-out forwards",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("daisyui")],

	// config (optional)
	daisyui: {
		styled: true,
		themes: ["dark", "light"],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
	},
};
