import { c as create_ssr_component, f as each, e as escape } from "./app-1a513ba3.js";
import { timeFormat } from "d3";
import "@sveltejs/kit/ssr";
async function load({ page, fetch, session, context }) {
  const url = "/blog.json";
  const res = await fetch(url);
  if (res.ok) {
    const posts = await res.json();
    return { props: { posts } };
  }
  return {
    status: res.status,
    error: new Error(`Could not load ${url}`)
  };
}
const Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  const formatDate = timeFormat("%b %e, %Y");
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  return `<h1>Thoughts</h1>

<div class="${"space-y-12 -mx-14"}">${each(posts.filter((d) => !d.draft && d.slug), ({ slug, title, date, description }) => `<article class="${"bg-white py-6 md:py-10 px-5 md:px-14 shadow-lg shadow-blue-50 hover:shadow-blue-100 transition-all transform hover:-translate-y-1"}"><header><a href="${"/blog/" + escape(slug)}"><h3 class="${"mt-0 text-gray-900"}">${escape(title)}
          </h3></a>
        <small class="${"font-mono text-gray-500 text-sm"}">${escape(formatDate(new Date(date)))}</small></header>
      ${description ? `<section class="${"mt-3"}"><p>${escape(description)}</p>
        </section>` : ``}
    </article>`)}</div>`;
});
export { Blog as default, load };
