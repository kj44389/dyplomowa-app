module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primarygreen: '#61B15A',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('daisyui')],

	// config (optional)
	daisyui: {
		styled: true,
		themes: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
	},
};
