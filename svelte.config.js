import mdsvex from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import netlifyAdapter from "@sveltejs/adapter-netlify";
import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-auto';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: netlifyAdapter({ out: "build" }),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			resolve: {
				alias: {
					$src: path.resolve('./src')
				}
			}
		}
	},
	extensions: [".svelte", ...mdsvexConfig.extensions],

	preprocess: [
		mdsvex.mdsvex(mdsvexConfig),
		preprocess({
			postcss: true
		})
	]
};

export default config;
