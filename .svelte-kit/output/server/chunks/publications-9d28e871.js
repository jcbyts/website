import { c as create_ssr_component, e as escape, f as each, v as validate_component } from "./app-1a513ba3.js";
import { P as Publication, p as publications } from "./Publication-1cfec0e2.js";
import "@sveltejs/kit/ssr";
const Publications = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Jacob Yates: Publications</title>`, ""}`, ""}

<div class="${""}"><h1>Selected Publications</h1>
  <p>Find a complete list of publications${escape(" ")}
    <a href="${"https://scholar.google.com/citations?user=UJm-TkYAAAAJ&hl=en"}">here
    </a></p>
  <div class="${"-ml-14 space-y-12"}">${each(publications, (publication, i) => `<div>${validate_component(Publication, "Publication").$$render($$result, Object.assign(publication), {}, {})}
      </div>`)}</div></div>`;
});
export { Publications as default };
