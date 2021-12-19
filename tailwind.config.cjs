const config = {
	mode: "jit",
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ["DM Serif Display", "serif"],
				mono: ["Fira Code", "monospace"],
			},
			colors: {
			}
		}
	},

	plugins: []
};

module.exports = config;
