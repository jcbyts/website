<script context="module">
  export async function load({ page, fetch, session, context }) {
    const url = "/blog.json";
    const { path } = page;

    const res = await fetch(url);

    if (res.ok) {
      const posts = await res.json();
      const metadata = posts.find((d) => d["slug"] === path.split("/")[2]);

      return {
        props: {
          metadata,
        },
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    };
  }
</script>

<script>
  import { dev } from "$app/env";
  import { timeFormat } from "d3";

  export let metadata = {};

  $: title = metadata?.title;
  $: slug = metadata?.slug;
  $: isDraft = metadata?.draft;
  const formatDate = timeFormat("%b %e, %Y");
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://jake.vision/blog/{slug ? slug : ''}"
  />
</svelte:head>

<h1 class="mb-0">{title}</h1>
<div class="mt-2 font-mono text-gray-500">
  {formatDate(new Date(metadata?.date))}
</div>

<div
  class="content bg-white mt-10 -mx-14 py-16 px-14 shadow-2xl shadow-blue-50"
>
  {#if isDraft}
    {#if dev}
      <blockquote>
        This draft is visible because you're working locally.
      </blockquote>
      <slot />
    {:else}
      This post is in progress!
    {/if}
  {:else}
    <slot />
  {/if}
</div>
