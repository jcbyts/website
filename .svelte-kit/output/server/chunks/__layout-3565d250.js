import { c as create_ssr_component, v as validate_component } from "./app-1a513ba3.js";
import "@sveltejs/kit/ssr";
var Nav_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "nav.svelte-1yg3xhu{align-items:center;display:flex;flex-wrap:wrap;justify-content:space-between;margin:0 -.6em;padding:.9em 0;white-space:nowrap}.link.svelte-1yg3xhu{--tw-text-opacity:1;background:none;color:rgb(75 85 99/var(--tw-text-opacity));padding:.3em .6em}.links.svelte-1yg3xhu{align-items:center;display:flex}",
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<nav class="${" svelte-1yg3xhu"}"><a class="${"link font-semibold !text-gray-900 svelte-1yg3xhu"}" href="${"/"}">Jacob Yates</a>

  <div class="${"links text-base space-x-3 svelte-1yg3xhu"}"><a class="${"link svelte-1yg3xhu"}" href="${"/publications"}">Publications</a>
    <a class="${"link svelte-1yg3xhu"}" href="${"/cv"}">CV</a>
    <a class="${"link svelte-1yg3xhu"}" href="${"/blog"}">Thoughts</a></div>
</nav>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="${"w-full h-3 mt-36 bg-gradient-to-r from-sky-500 to-teal-500"}"></footer>`;
});
var app = "";
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1thd6wv{position:relative}",
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { segment } = $$props;
  if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0)
    $$bindings.segment(segment);
  $$result.css.add(css);
  return `<div class="${"h-5 bg-black w-full"}"></div>
<div class="${"container"}"><div class="${"main"}">${validate_component(Nav, "Nav").$$render($$result, { segment }, {}, {})}

    <main class="${"svelte-1thd6wv"}">${slots.default ? slots.default({}) : ``}</main></div></div>
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
export { _layout as default };
