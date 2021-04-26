const { mdsvex } = require("mdsvex");
const mdsvexConfig = require("./mdsvex.config.cjs");
const netlifyAdapter = require("@sveltejs/adapter-netlify");
/** @type {import('@sveltejs/kit').Config} */

module.exports = {
  preprocess: [mdsvex(mdsvexConfig)],
  extensions: [".svelte", ...mdsvexConfig.extensions],
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: netlifyAdapter({ out: "build" }),
  },
};
