import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n\t<meta charset=\"utf-8\" />\n\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t<meta charset=\"utf-8\" />\n\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\" />\n\t<meta name=\"theme-color\" content=\"#245242\" />\n\n\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n\t<meta name=\"description\"\n\t\tcontent=\"Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions\" />\n\t<meta name=\"news_keywords\" content=\"tk\" />\n\n\t<meta property=\"og:title\" content=\"Jacob Yates\" />\n\t<meta property=\"og:site_name\" content=\"Jacob Yates\" />\n\t<meta property=\"og:url\" content=\"https://jake.vision\" />\n\t<meta property=\"og:image\" content=\"/share-image.png\" />\n\n\t<meta property=\"og:description\"\n\t\tcontent=\"Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions\" />\n\t<meta property=\"og:type\" content=\"article\" />\n\t<meta property=\"og:locale\" content=\"en_US\" />\n\n\t<meta name=\"twitter:card\" content=\"summary_large_image\" />\n\t<meta name=\"twitter:site\" content=\"https://jake.vision\" />\n\t<meta name=\"twitter:creator\" content=\"@jcbyts\" />\n\t<meta name=\"twitter:title\" content=\"Jacob Yates\" />\n\t<meta name=\"twitter:description\"\n\t\tcontent=\"Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions\" />\n\n\t<title>Jacob Yates</title>\n\n\t<link rel=\"stylesheet\" href=\"/reset.css\" />\n\t<link rel=\"stylesheet\" href=\"/colors.css\" />\n\t<link rel=\"stylesheet\" href=\"/global.css\" />\n\t<link rel=\"manifest\" href=\"/manifest.json\" crossorigin=\"use-credentials\" />\n\t<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\n\t<link rel=\"alternate icon\" href=\"/favicon.ico\" />\n\n\t<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css\"\n\t\tintegrity=\"sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X\" crossorigin=\"anonymous\" />\n\n\t<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n\t<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n\t<link href=\"https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap\" rel=\"stylesheet\">\n\n\t" + head + "\n</head>\n\n<body>\n\t<div id=\"svelte\">" + body + "</div>\n\n\t<!-- Global site tag (gtag.js) - Google Analytics -->\n\t<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-96837436-1\"></script>\n\n\t<script>\n\t\twindow.dataLayer = window.dataLayer || [];\n\t\tfunction gtag() {\n\t\t\tdataLayer.push(arguments);\n\t\t}\n\t\tgtag(\"js\", new Date());\n\n\t\tgtag(\"config\", \"UA-96837436-1\");\n\t</script>\n\n\t<script>\n\t\twindow.twttr = (function (d, s, id) {\n\t\t\tvar js,\n\t\t\t\tfjs = d.getElementsByTagName(s)[0],\n\t\t\t\tt = window.twttr || {};\n\t\t\tif (d.getElementById(id)) return t;\n\t\t\tjs = d.createElement(s);\n\t\t\tjs.id = id;\n\t\t\tjs.src = \"https://platform.twitter.com/widgets.js\";\n\t\t\tfjs.parentNode.insertBefore(js, fjs);\n\n\t\t\tt._e = [];\n\t\t\tt.ready = function (f) {\n\t\t\t\tt._e.push(f);\n\t\t\t};\n\n\t\t\treturn t;\n\t\t})(document, \"script\", \"twitter-wjs\");\n\t</script>\n</body>\n\n</html>";

let options = null;

const default_settings = { paths: {"base":"","assets":""} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-0802e6a4.js",
			css: [assets + "/_app/assets/start-464e9d0a.css"],
			js: [assets + "/_app/start-0802e6a4.js",assets + "/_app/chunks/vendor-0fd8ff1a.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

// input has already been decoded by decodeURI
// now handle the rest that decodeURIComponent would do
const d = s => s
	.replace(/%23/g, '#')
	.replace(/%3[Bb]/g, ';')
	.replace(/%2[Cc]/g, ',')
	.replace(/%2[Ff]/g, '/')
	.replace(/%3[Ff]/g, '?')
	.replace(/%3[Aa]/g, ':')
	.replace(/%40/g, '@')
	.replace(/%26/g, '&')
	.replace(/%3[Dd]/g, '=')
	.replace(/%2[Bb]/g, '+')
	.replace(/%24/g, '$');

const empty = () => ({});

const manifest = {
	assets: [{"file":"FiraCode-VF.woff","size":138576,"type":"font/woff"},{"file":"FiraCode-VF.woff2","size":113088,"type":"font/woff2"},{"file":"_redirects","size":24,"type":null},{"file":"arduinoblog/fig01_Setup.png","size":41590,"type":"image/png"},{"file":"arduinoblog/fig02_open.png","size":41614,"type":"image/png"},{"file":"arduinoblog/fig03_loop.png","size":110109,"type":"image/png"},{"file":"arduinoblog/fig04_summary.png","size":48268,"type":"image/png"},{"file":"arduinoblog/fig05_libvar.png","size":157858,"type":"image/png"},{"file":"arduinoblog/fig06_setup.png","size":112326,"type":"image/png"},{"file":"arduinoblog/fig07_loop.png","size":185446,"type":"image/png"},{"file":"arduinoblog/fig08_encoder.png","size":132219,"type":"image/png"},{"file":"arduinoblog/fig09_outpu.png","size":219326,"type":"image/png"},{"file":"arduinoblog/fig10_summary.png","size":44434,"type":"image/png"},{"file":"arduinoblog/fig11_approach2mat.png","size":41737,"type":"image/png"},{"file":"arduinoblog/fig12_approach2matloop.png","size":251171,"type":"image/png"},{"file":"colors.css","size":1153,"type":"text/css"},{"file":"favicon.ico","size":2929,"type":"image/vnd.microsoft.icon"},{"file":"favicon.png","size":2929,"type":"image/png"},{"file":"global.css","size":1889,"type":"text/css"},{"file":"labmeetinglurz/battymultitaskln.png","size":319809,"type":"image/png"},{"file":"labmeetinglurz/buttsdatadriven.png","size":751411,"type":"image/png"},{"file":"labmeetinglurz/buttstransfer.png","size":665654,"type":"image/png"},{"file":"labmeetinglurz/elu.png","size":138885,"type":"image/png"},{"file":"labmeetinglurz/kingmavaelearning.png","size":122556,"type":"image/png"},{"file":"labmeetinglurz/kingmavaereparameterization.png","size":177378,"type":"image/png"},{"file":"labmeetinglurz/lurzfig2.png","size":486156,"type":"image/png"},{"file":"labmeetinglurz/lurzfig3.png","size":233728,"type":"image/png"},{"file":"labmeetinglurz/lurzfig4.png","size":181205,"type":"image/png"},{"file":"labmeetinglurz/lurzfig5.png","size":234912,"type":"image/png"},{"file":"labmeetinglurz/pointreadout.png","size":93170,"type":"image/png"},{"file":"labmeetinglurz/sinz2018.png","size":185976,"type":"image/png"},{"file":"labmeetinglurz/spatialtransformer.png","size":73576,"type":"image/png"},{"file":"labmeetinglurz/wrtphi.png","size":46370,"type":"image/png"},{"file":"labmeetinglurz/wrttheta.png","size":74355,"type":"image/png"},{"file":"manifest.json","size":369,"type":"application/json"},{"file":"motionillusionblog/1Dbars_GifAsImg.jpeg","size":734763,"type":"image/jpeg"},{"file":"motionillusionblog/1Dbars_buckets.jpeg","size":332890,"type":"image/jpeg"},{"file":"motionillusionblog/1Dflicker.mp4","size":157422,"type":"video/mp4"},{"file":"motionillusionblog/AdelsonBergenEdgeDetector.png","size":81728,"type":"image/png"},{"file":"motionillusionblog/AdelsonBergenMotionOrientation.png","size":206624,"type":"image/png"},{"file":"motionillusionblog/AdelsonBergenQpair.png","size":160635,"type":"image/png"},{"file":"motionillusionblog/MarioCropped.mp4","size":117055,"type":"video/mp4"},{"file":"motionillusionblog/MarioCropped_motE.mp4","size":1383301,"type":"video/mp4"},{"file":"motionillusionblog/MarioCropped_motE_0.mp4","size":688217,"type":"video/mp4"},{"file":"motionillusionblog/MarioCropped_motE_1.mp4","size":1315309,"type":"video/mp4"},{"file":"motionillusionblog/MarioFrame1.png","size":31353,"type":"image/png"},{"file":"motionillusionblog/MarioGray.mp4","size":33376,"type":"video/mp4"},{"file":"motionillusionblog/MarioReversePhi_Adelson0.png","size":18678,"type":"image/png"},{"file":"motionillusionblog/MarioReversePhi_Adelson1.png","size":77977,"type":"image/png"},{"file":"motionillusionblog/MarioReversePhi_motE.mp4","size":3371248,"type":"video/mp4"},{"file":"motionillusionblog/MarioReversePhi_motE_0.mp4","size":1817979,"type":"video/mp4"},{"file":"motionillusionblog/MarioReversePhi_motE_1.mp4","size":2075026,"type":"video/mp4"},{"file":"motionillusionblog/MarioReversePhi_motE_1fnetvis.mp4","size":1117308,"type":"video/mp4"},{"file":"motionillusionblog/MarioSpaceTime.png","size":31186,"type":"image/png"},{"file":"motionillusionblog/adelsonComponents.png","size":27804,"type":"image/png"},{"file":"motionillusionblog/adelsonOrientedFilters.png","size":23606,"type":"image/png"},{"file":"motionillusionblog/buckets.jpeg","size":717165,"type":"image/jpeg"},{"file":"motionillusionblog/buckets.jpg","size":716949,"type":"image/jpeg"},{"file":"motionillusionblog/buckets.jpg:Zone.Identifier","size":0,"type":null},{"file":"motionillusionblog/coloredgeannotated.png","size":124866,"type":"image/png"},{"file":"motionillusionblog/constructedframe.png","size":8500,"type":"image/png"},{"file":"motionillusionblog/constructedspacetime.png","size":13603,"type":"image/png"},{"file":"motionillusionblog/exampleFrames.png","size":321403,"type":"image/png"},{"file":"motionillusionblog/gaussianderivative.png","size":42579,"type":"image/png"},{"file":"motionillusionblog/grayannotate.png","size":408753,"type":"image/png"},{"file":"motionillusionblog/grayannotated.png","size":29398,"type":"image/png"},{"file":"motionillusionblog/grayedgeannotated.png","size":41464,"type":"image/png"},{"file":"motionillusionblog/grayedgeannotated.psd","size":720135,"type":"image/vnd.adobe.photoshop"},{"file":"motionillusionblog/grayedgeannotated2.jpg","size":58984,"type":"image/jpeg"},{"file":"motionillusionblog/grayedgesannotated.png","size":448460,"type":"image/png"},{"file":"motionillusionblog/marioReversePhi.mp4","size":628741,"type":"video/mp4"},{"file":"motionillusionblog/marioReversePhi_Adelson.png","size":96934,"type":"image/png"},{"file":"motionillusionblog/mariocrop_GifAsImg.jpeg","size":2749512,"type":"image/jpeg"},{"file":"motionillusionblog/mariocrop_buckets.jpeg","size":796468,"type":"image/jpeg"},{"file":"motionillusionblog/marioreversephi_flownet.avi","size":609524,"type":"video/x-msvideo"},{"file":"motionillusionblog/marioreversephi_flownetcomp.mp4","size":2361268,"type":"video/mp4"},{"file":"motionillusionblog/motEfilters.mp4","size":63670,"type":"video/mp4"},{"file":"motionillusionblog/motionlegend.png","size":26630,"type":"image/png"},{"file":"motionillusionblog/motionlegendtitle.png","size":34055,"type":"image/png"},{"file":"motionillusionblog/orangGifAsImg.jpeg","size":3926985,"type":"image/jpeg"},{"file":"motionillusionblog/orangannotated.png","size":1297617,"type":"image/png"},{"file":"motionillusionblog/orangframannotated.png","size":702273,"type":"image/png"},{"file":"motionillusionblog/orangutanVid.mp4","size":427197,"type":"video/mp4"},{"file":"reset.css","size":1056,"type":"text/css"},{"file":"robots.txt","size":54,"type":"text/plain"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/example-markdown\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/example-markdown.md"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/publications\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/publications.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/sitemap\.xml$/,
						params: empty,
						load: () => import("../../src/routes/sitemap.xml.js")
					},
		{
						type: 'endpoint',
						pattern: /^\/blog\.json$/,
						params: empty,
						load: () => import("../../src/routes/blog/index.json.js")
					},
		{
						type: 'page',
						pattern: /^\/blog\/foodservice-academia\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/foodservice-academia.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/motion-illusions\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/motion-illusions.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/matlab-arduino\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/matlab-arduino.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/noisy-better\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/noisy-better.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/lurz-paper\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/lurz-paper.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/cv\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/cv.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/example-markdown.md": () => import("../../src/routes/example-markdown.md"),"src/routes/publications.svelte": () => import("../../src/routes/publications.svelte"),"src/routes/blog/__layout.svelte": () => import("../../src/routes/blog/__layout.svelte"),"src/routes/blog/foodservice-academia.svx": () => import("../../src/routes/blog/foodservice-academia.svx"),"src/routes/blog/motion-illusions.svx": () => import("../../src/routes/blog/motion-illusions.svx"),"src/routes/blog/matlab-arduino.svx": () => import("../../src/routes/blog/matlab-arduino.svx"),"src/routes/blog/noisy-better.svx": () => import("../../src/routes/blog/noisy-better.svx"),"src/routes/blog/lurz-paper.svx": () => import("../../src/routes/blog/lurz-paper.svx"),"src/routes/blog.svelte": () => import("../../src/routes/blog.svelte"),"src/routes/cv.svelte": () => import("../../src/routes/cv.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"pages/__layout.svelte-342a02c5.js","css":["assets/pages/__layout.svelte-243c153a.css"],"js":["pages/__layout.svelte-342a02c5.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"error.svelte-5aa7872b.js","css":[],"js":["error.svelte-5aa7872b.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/index.svelte":{"entry":"pages/index.svelte-e25d433e.js","css":["assets/Publication-8993e706.css"],"js":["pages/index.svelte-e25d433e.js","chunks/vendor-0fd8ff1a.js","chunks/Publication-b9f7b53f.js"],"styles":[]},"src/routes/example-markdown.md":{"entry":"pages/example-markdown.md-3e1103c1.js","css":[],"js":["pages/example-markdown.md-3e1103c1.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/publications.svelte":{"entry":"pages/publications.svelte-949e0a42.js","css":["assets/Publication-8993e706.css"],"js":["pages/publications.svelte-949e0a42.js","chunks/vendor-0fd8ff1a.js","chunks/Publication-b9f7b53f.js"],"styles":[]},"src/routes/blog/__layout.svelte":{"entry":"pages/blog/__layout.svelte-5e790048.js","css":[],"js":["pages/blog/__layout.svelte-5e790048.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog/foodservice-academia.svx":{"entry":"pages/blog/foodservice-academia.svx-f0c0d871.js","css":[],"js":["pages/blog/foodservice-academia.svx-f0c0d871.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog/motion-illusions.svx":{"entry":"pages/blog/motion-illusions.svx-b3795550.js","css":["assets/pages/blog/motion-illusions.svx-9ea925e9.css"],"js":["pages/blog/motion-illusions.svx-b3795550.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog/matlab-arduino.svx":{"entry":"pages/blog/matlab-arduino.svx-0a39f38f.js","css":[],"js":["pages/blog/matlab-arduino.svx-0a39f38f.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog/noisy-better.svx":{"entry":"pages/blog/noisy-better.svx-8f16cd30.js","css":[],"js":["pages/blog/noisy-better.svx-8f16cd30.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog/lurz-paper.svx":{"entry":"pages/blog/lurz-paper.svx-8d3d0e5f.js","css":[],"js":["pages/blog/lurz-paper.svx-8d3d0e5f.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/blog.svelte":{"entry":"pages/blog.svelte-3f984cd7.js","css":[],"js":["pages/blog.svelte-3f984cd7.js","chunks/vendor-0fd8ff1a.js"],"styles":[]},"src/routes/cv.svelte":{"entry":"pages/cv.svelte-7b1e980c.js","css":["assets/Publication-8993e706.css"],"js":["pages/cv.svelte-7b1e980c.js","chunks/vendor-0fd8ff1a.js","chunks/Publication-b9f7b53f.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}