import { c as create_ssr_component, e as escape } from "./app-1a513ba3.js";
import { timeFormat } from "d3";
import "@sveltejs/kit/ssr";
async function load({ page, fetch, session, context }) {
  const url = "/blog.json";
  const { path } = page;
  const res = await fetch(url);
  if (res.ok) {
    const posts = await res.json();
    const metadata = posts.find((d) => d["slug"] === path.split("/")[2]);
    return { props: { metadata } };
  }
  return {
    status: res.status,
    error: new Error(`Could not load ${url}`)
  };
}
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let title;
  let slug;
  let isDraft;
  let { segment } = $$props;
  let { metadata = {} } = $$props;
  const formatDate = timeFormat("%b %e, %Y");
  if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0)
    $$bindings.segment(segment);
  if ($$props.metadata === void 0 && $$bindings.metadata && metadata !== void 0)
    $$bindings.metadata(metadata);
  title = metadata?.title;
  slug = metadata?.slug;
  isDraft = metadata?.draft;
  return `${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}<meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-1ddvq1z"><meta property="${"og:url"}" content="${"https://jake.vision/blog/" + escape(slug ? slug : "")}" data-svelte="svelte-1ddvq1z">`, ""}

<h1 class="${"mb-0"}">${escape(title)}</h1>
<div class="${"mt-2 font-mono text-gray-500"}">${escape(formatDate(new Date(metadata?.date)))}</div>

<div class="${"content bg-white mt-10 -mx-14 py-16 px-14 shadow-2xl shadow-blue-50"}">${isDraft ? `${`This post is in progress!`}` : `${slots.default ? slots.default({}) : ``}`}</div>`;
});
export { _layout as default, load };
