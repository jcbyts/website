<script context="module">
  import { getPages } from "./index.json.js";
  export async function load(params) {
    const posts = await getPages();

    const path = params.url.pathname;

    const metadata = posts.find((d) => d["slug"] === path.split("/")[2]);

    return {
      props: {
        metadata,
      },
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

  $: isFullWidth = metadata?.layout === "full-width";
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

<div class="content mt-10 -mx-14" class:breakout={isFullWidth}>
  <div
    class="bg-white py-16 px-14 shadow-2xl shadow-blue-50 {isFullWidth
      ? 'mx-[2em]'
      : ''}"
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
</div>
