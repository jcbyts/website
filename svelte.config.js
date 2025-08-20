import adapter from '@sveltejs/adapter-static';
import {mdsvex} from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '200.html',
			strict: false
		}),

		alias: {
			'$src': './src',
		},

		prerender: {
			handleMissingId: 'warn',
			handleHttpError: 'warn'
		},
	},

  extensions: [
    '.svelte',
		'.svx',
		'.md',
	],
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)]

};

export default config;
