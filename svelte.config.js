import mdsvex from "mdsvex";
import mdsvexConfig from "./mdsvex.config.cjs";
import netlifyAdapter from "@sveltejs/adapter-netlify";
/** @type {import('@sveltejs/kit').Config} */

export default {
  preprocess: [mdsvex.mdsvex(mdsvexConfig)],
  extensions: [".svelte", ...mdsvexConfig.extensions],
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: netlifyAdapter({ out: "build" }),
  },
};
