import { respond } from "@sveltejs/kit/ssr";
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "";
const css = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: null
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="/favicon.ico" />\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	<meta charset="utf-8" />\n	<meta name="viewport" content="width=device-width,initial-scale=1.0" />\n	<meta name="theme-color" content="#245242" />\n\n	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />\n	<meta name="description"\n		content="Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions" />\n	<meta name="news_keywords" content="tk" />\n\n	<meta property="og:title" content="Jacob Yates" />\n	<meta property="og:site_name" content="Jacob Yates" />\n	<meta property="og:url" content="https://jake.vision" />\n	<meta property="og:image" content="/share-image.png" />\n\n	<meta property="og:description"\n		content="Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions" />\n	<meta property="og:type" content="article" />\n	<meta property="og:locale" content="en_US" />\n\n	<meta name="twitter:card" content="summary_large_image" />\n	<meta name="twitter:site" content="https://jake.vision" />\n	<meta name="twitter:creator" content="@jcbyts" />\n	<meta name="twitter:title" content="Jacob Yates" />\n	<meta name="twitter:description"\n		content="Jacob Yates is a post-doc interested in how sensory signals are encoded into neural activity and how that activity is decoded to form perceptions and actions" />\n\n	<title>Jacob Yates</title>\n\n	<link rel="stylesheet" href="/reset.css" />\n	<link rel="stylesheet" href="/colors.css" />\n	<link rel="stylesheet" href="/global.css" />\n	<link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n	<link rel="alternate icon" href="/favicon.ico" />\n\n	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"\n		integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous" />\n\n	<link rel="preconnect" href="https://fonts.googleapis.com">\n	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n	<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet">\n\n	' + head + '\n</head>\n\n<body>\n	<div id="svelte">' + body + '</div>\n\n	<!-- Global site tag (gtag.js) - Google Analytics -->\n	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-96837436-1"><\/script>\n\n	<script>\n		window.dataLayer = window.dataLayer || [];\n		function gtag() {\n			dataLayer.push(arguments);\n		}\n		gtag("js", new Date());\n\n		gtag("config", "UA-96837436-1");\n	<\/script>\n\n	<script>\n		window.twttr = (function (d, s, id) {\n			var js,\n				fjs = d.getElementsByTagName(s)[0],\n				t = window.twttr || {};\n			if (d.getElementById(id)) return t;\n			js = d.createElement(s);\n			js.id = id;\n			js.src = "https://platform.twitter.com/widgets.js";\n			fjs.parentNode.insertBefore(js, fjs);\n\n			t._e = [];\n			t.ready = function (f) {\n				t._e.push(f);\n			};\n\n			return t;\n		})(document, "script", "twitter-wjs");\n	<\/script>\n</body>\n\n</html>';
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-0802e6a4.js",
      css: [assets + "/_app/assets/start-464e9d0a.css"],
      js: [assets + "/_app/start-0802e6a4.js", assets + "/_app/chunks/vendor-0fd8ff1a.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error) => String(error),
    handle_error: (error, request) => {
      hooks.handleError({ error, request });
      error.stack = options.get_stack(error);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
const empty = () => ({});
const manifest = {
  assets: [{ "file": "FiraCode-VF.woff", "size": 138576, "type": "font/woff" }, { "file": "FiraCode-VF.woff2", "size": 113088, "type": "font/woff2" }, { "file": "_redirects", "size": 24, "type": null }, { "file": "arduinoblog/fig01_Setup.png", "size": 41590, "type": "image/png" }, { "file": "arduinoblog/fig02_open.png", "size": 41614, "type": "image/png" }, { "file": "arduinoblog/fig03_loop.png", "size": 110109, "type": "image/png" }, { "file": "arduinoblog/fig04_summary.png", "size": 48268, "type": "image/png" }, { "file": "arduinoblog/fig05_libvar.png", "size": 157858, "type": "image/png" }, { "file": "arduinoblog/fig06_setup.png", "size": 112326, "type": "image/png" }, { "file": "arduinoblog/fig07_loop.png", "size": 185446, "type": "image/png" }, { "file": "arduinoblog/fig08_encoder.png", "size": 132219, "type": "image/png" }, { "file": "arduinoblog/fig09_outpu.png", "size": 219326, "type": "image/png" }, { "file": "arduinoblog/fig10_summary.png", "size": 44434, "type": "image/png" }, { "file": "arduinoblog/fig11_approach2mat.png", "size": 41737, "type": "image/png" }, { "file": "arduinoblog/fig12_approach2matloop.png", "size": 251171, "type": "image/png" }, { "file": "colors.css", "size": 1153, "type": "text/css" }, { "file": "favicon.ico", "size": 2929, "type": "image/vnd.microsoft.icon" }, { "file": "favicon.png", "size": 2929, "type": "image/png" }, { "file": "global.css", "size": 1889, "type": "text/css" }, { "file": "labmeetinglurz/battymultitaskln.png", "size": 319809, "type": "image/png" }, { "file": "labmeetinglurz/buttsdatadriven.png", "size": 751411, "type": "image/png" }, { "file": "labmeetinglurz/buttstransfer.png", "size": 665654, "type": "image/png" }, { "file": "labmeetinglurz/elu.png", "size": 138885, "type": "image/png" }, { "file": "labmeetinglurz/kingmavaelearning.png", "size": 122556, "type": "image/png" }, { "file": "labmeetinglurz/kingmavaereparameterization.png", "size": 177378, "type": "image/png" }, { "file": "labmeetinglurz/lurzfig2.png", "size": 486156, "type": "image/png" }, { "file": "labmeetinglurz/lurzfig3.png", "size": 233728, "type": "image/png" }, { "file": "labmeetinglurz/lurzfig4.png", "size": 181205, "type": "image/png" }, { "file": "labmeetinglurz/lurzfig5.png", "size": 234912, "type": "image/png" }, { "file": "labmeetinglurz/pointreadout.png", "size": 93170, "type": "image/png" }, { "file": "labmeetinglurz/sinz2018.png", "size": 185976, "type": "image/png" }, { "file": "labmeetinglurz/spatialtransformer.png", "size": 73576, "type": "image/png" }, { "file": "labmeetinglurz/wrtphi.png", "size": 46370, "type": "image/png" }, { "file": "labmeetinglurz/wrttheta.png", "size": 74355, "type": "image/png" }, { "file": "manifest.json", "size": 369, "type": "application/json" }, { "file": "motionillusionblog/1Dbars_GifAsImg.jpeg", "size": 734763, "type": "image/jpeg" }, { "file": "motionillusionblog/1Dbars_buckets.jpeg", "size": 332890, "type": "image/jpeg" }, { "file": "motionillusionblog/1Dflicker.mp4", "size": 157422, "type": "video/mp4" }, { "file": "motionillusionblog/AdelsonBergenEdgeDetector.png", "size": 81728, "type": "image/png" }, { "file": "motionillusionblog/AdelsonBergenMotionOrientation.png", "size": 206624, "type": "image/png" }, { "file": "motionillusionblog/AdelsonBergenQpair.png", "size": 160635, "type": "image/png" }, { "file": "motionillusionblog/MarioCropped.mp4", "size": 117055, "type": "video/mp4" }, { "file": "motionillusionblog/MarioCropped_motE.mp4", "size": 1383301, "type": "video/mp4" }, { "file": "motionillusionblog/MarioCropped_motE_0.mp4", "size": 688217, "type": "video/mp4" }, { "file": "motionillusionblog/MarioCropped_motE_1.mp4", "size": 1315309, "type": "video/mp4" }, { "file": "motionillusionblog/MarioFrame1.png", "size": 31353, "type": "image/png" }, { "file": "motionillusionblog/MarioGray.mp4", "size": 33376, "type": "video/mp4" }, { "file": "motionillusionblog/MarioReversePhi_Adelson0.png", "size": 18678, "type": "image/png" }, { "file": "motionillusionblog/MarioReversePhi_Adelson1.png", "size": 77977, "type": "image/png" }, { "file": "motionillusionblog/MarioReversePhi_motE.mp4", "size": 3371248, "type": "video/mp4" }, { "file": "motionillusionblog/MarioReversePhi_motE_0.mp4", "size": 1817979, "type": "video/mp4" }, { "file": "motionillusionblog/MarioReversePhi_motE_1.mp4", "size": 2075026, "type": "video/mp4" }, { "file": "motionillusionblog/MarioReversePhi_motE_1fnetvis.mp4", "size": 1117308, "type": "video/mp4" }, { "file": "motionillusionblog/MarioSpaceTime.png", "size": 31186, "type": "image/png" }, { "file": "motionillusionblog/adelsonComponents.png", "size": 27804, "type": "image/png" }, { "file": "motionillusionblog/adelsonOrientedFilters.png", "size": 23606, "type": "image/png" }, { "file": "motionillusionblog/buckets.jpeg", "size": 717165, "type": "image/jpeg" }, { "file": "motionillusionblog/buckets.jpg", "size": 716949, "type": "image/jpeg" }, { "file": "motionillusionblog/buckets.jpg:Zone.Identifier", "size": 0, "type": null }, { "file": "motionillusionblog/coloredgeannotated.png", "size": 124866, "type": "image/png" }, { "file": "motionillusionblog/constructedframe.png", "size": 8500, "type": "image/png" }, { "file": "motionillusionblog/constructedspacetime.png", "size": 13603, "type": "image/png" }, { "file": "motionillusionblog/exampleFrames.png", "size": 321403, "type": "image/png" }, { "file": "motionillusionblog/gaussianderivative.png", "size": 42579, "type": "image/png" }, { "file": "motionillusionblog/grayannotate.png", "size": 408753, "type": "image/png" }, { "file": "motionillusionblog/grayannotated.png", "size": 29398, "type": "image/png" }, { "file": "motionillusionblog/grayedgeannotated.png", "size": 41464, "type": "image/png" }, { "file": "motionillusionblog/grayedgeannotated.psd", "size": 720135, "type": "image/vnd.adobe.photoshop" }, { "file": "motionillusionblog/grayedgeannotated2.jpg", "size": 58984, "type": "image/jpeg" }, { "file": "motionillusionblog/grayedgesannotated.png", "size": 448460, "type": "image/png" }, { "file": "motionillusionblog/marioReversePhi.mp4", "size": 628741, "type": "video/mp4" }, { "file": "motionillusionblog/marioReversePhi_Adelson.png", "size": 96934, "type": "image/png" }, { "file": "motionillusionblog/mariocrop_GifAsImg.jpeg", "size": 2749512, "type": "image/jpeg" }, { "file": "motionillusionblog/mariocrop_buckets.jpeg", "size": 796468, "type": "image/jpeg" }, { "file": "motionillusionblog/marioreversephi_flownet.avi", "size": 609524, "type": "video/x-msvideo" }, { "file": "motionillusionblog/marioreversephi_flownetcomp.mp4", "size": 2361268, "type": "video/mp4" }, { "file": "motionillusionblog/motEfilters.mp4", "size": 63670, "type": "video/mp4" }, { "file": "motionillusionblog/motionlegend.png", "size": 26630, "type": "image/png" }, { "file": "motionillusionblog/motionlegendtitle.png", "size": 34055, "type": "image/png" }, { "file": "motionillusionblog/orangGifAsImg.jpeg", "size": 3926985, "type": "image/jpeg" }, { "file": "motionillusionblog/orangannotated.png", "size": 1297617, "type": "image/png" }, { "file": "motionillusionblog/orangframannotated.png", "size": 702273, "type": "image/png" }, { "file": "motionillusionblog/orangutanVid.mp4", "size": 427197, "type": "video/mp4" }, { "file": "reset.css", "size": 1056, "type": "text/css" }, { "file": "robots.txt", "size": 54, "type": "text/plain" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/example-markdown\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/example-markdown.md"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/publications\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/publications.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/sitemap\.xml$/,
      params: empty,
      load: () => import("./sitemap.xml-0197c0cd.js")
    },
    {
      type: "endpoint",
      pattern: /^\/blog\.json$/,
      params: empty,
      load: () => import("./index.json-5ceb5087.js")
    },
    {
      type: "page",
      pattern: /^\/blog\/foodservice-academia\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/foodservice-academia.svx"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/motion-illusions\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/motion-illusions.svx"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/matlab-arduino\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/matlab-arduino.svx"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/noisy-better\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/noisy-better.svx"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/lurz-paper\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/__layout.svelte", "src/routes/blog/lurz-paper.svx"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/cv\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/cv.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve }) => resolve(request)),
  handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  "src/routes/__layout.svelte": () => import("./__layout-3565d250.js"),
  ".svelte-kit/build/components/error.svelte": () => import("./error-bf451d0b.js"),
  "src/routes/index.svelte": () => import("./index-01d428c8.js"),
  "src/routes/example-markdown.md": () => import("./example-markdown-7546688c.js"),
  "src/routes/publications.svelte": () => import("./publications-9d28e871.js"),
  "src/routes/blog/__layout.svelte": () => import("./__layout-4650aa0a.js"),
  "src/routes/blog/foodservice-academia.svx": () => import("./foodservice-academia-d635871d.js"),
  "src/routes/blog/motion-illusions.svx": () => import("./motion-illusions-d12aa38b.js"),
  "src/routes/blog/matlab-arduino.svx": () => import("./matlab-arduino-78a91bba.js"),
  "src/routes/blog/noisy-better.svx": () => import("./noisy-better-f2ca926f.js"),
  "src/routes/blog/lurz-paper.svx": () => import("./lurz-paper-e6887306.js"),
  "src/routes/blog.svelte": () => import("./blog-399dc043.js"),
  "src/routes/cv.svelte": () => import("./cv-9d76ff56.js")
};
const metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-342a02c5.js", "css": ["assets/pages/__layout.svelte-243c153a.css"], "js": ["pages/__layout.svelte-342a02c5.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-5aa7872b.js", "css": [], "js": ["error.svelte-5aa7872b.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-e25d433e.js", "css": ["assets/Publication-8993e706.css"], "js": ["pages/index.svelte-e25d433e.js", "chunks/vendor-0fd8ff1a.js", "chunks/Publication-b9f7b53f.js"], "styles": [] }, "src/routes/example-markdown.md": { "entry": "pages/example-markdown.md-3e1103c1.js", "css": [], "js": ["pages/example-markdown.md-3e1103c1.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/publications.svelte": { "entry": "pages/publications.svelte-949e0a42.js", "css": ["assets/Publication-8993e706.css"], "js": ["pages/publications.svelte-949e0a42.js", "chunks/vendor-0fd8ff1a.js", "chunks/Publication-b9f7b53f.js"], "styles": [] }, "src/routes/blog/__layout.svelte": { "entry": "pages/blog/__layout.svelte-5e790048.js", "css": [], "js": ["pages/blog/__layout.svelte-5e790048.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog/foodservice-academia.svx": { "entry": "pages/blog/foodservice-academia.svx-f0c0d871.js", "css": [], "js": ["pages/blog/foodservice-academia.svx-f0c0d871.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog/motion-illusions.svx": { "entry": "pages/blog/motion-illusions.svx-b3795550.js", "css": ["assets/pages/blog/motion-illusions.svx-9ea925e9.css"], "js": ["pages/blog/motion-illusions.svx-b3795550.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog/matlab-arduino.svx": { "entry": "pages/blog/matlab-arduino.svx-0a39f38f.js", "css": [], "js": ["pages/blog/matlab-arduino.svx-0a39f38f.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog/noisy-better.svx": { "entry": "pages/blog/noisy-better.svx-8f16cd30.js", "css": [], "js": ["pages/blog/noisy-better.svx-8f16cd30.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog/lurz-paper.svx": { "entry": "pages/blog/lurz-paper.svx-8d3d0e5f.js", "css": [], "js": ["pages/blog/lurz-paper.svx-8d3d0e5f.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/blog.svelte": { "entry": "pages/blog.svelte-3f984cd7.js", "css": [], "js": ["pages/blog.svelte-3f984cd7.js", "chunks/vendor-0fd8ff1a.js"], "styles": [] }, "src/routes/cv.svelte": { "entry": "pages/cv.svelte-7b1e980c.js", "css": ["assets/Publication-8993e706.css"], "js": ["pages/cv.svelte-7b1e980c.js", "chunks/vendor-0fd8ff1a.js", "chunks/Publication-b9f7b53f.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
export { assign as a, now as b, create_ssr_component as c, subscribe as d, escape as e, each as f, add_attribute as g, set_store_value as h, identity as i, init as j, loop as l, noop as n, onDestroy as o, render as r, safe_not_equal as s, validate_component as v };
