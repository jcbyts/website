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
  import { page } from "$app/stores";

  export let segment;
  export let metadata = {};

  $: isIndex = $page.path === "/blog";
  $: title = (metadata || {}).title;
  $: slug = (metadata || {}).slug;
  $: isDraft = !isIndex && (metadata || {}).draft;
</script>

<svelte:head>
  <title>{title || "Blog"}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://jake.vision/blog/{slug ? slug : ''}"
  />
</svelte:head>

<h1>{title || "Blog"}</h1>

<div class="content">
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

<style>
  .content :global(h2) {
    font-size: 1.4em;
    font-weight: 500;
  }

  .content :global(pre) {
    background-color: #f9f9f9;
    box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
    padding: 0.5em;
    border-radius: 2px;
    overflow-x: auto;
  }

  .content :global(pre) :global(code) {
    background-color: transparent;
    padding: 0;
  }

  .content :global(blockquote) {
    margin-top: 3em;
    padding: 1em 1.6em;
    color: #264c67;
    background: #f0f7fc;
    font-style: normal;
    border: none;
  }

  .content :global(blockquote strong) {
    color: #264c67;
  }

  .content :global(ul) {
    line-height: 1.5;
  }

  .content :global(ol) {
    margin-top: -0.5em;
  }

  .content :global(li) {
    margin: 0 0 0.5em 0;
  }
  .content > :global(video),
  .content > :global(img) {
    display: block;
    max-width: 100%;
    margin: 2em auto;
    text-align: center;
  }
  .content :global(em) {
    font-style: italic;
  }
  .content :global(strong) {
    font-weight: 700;
    color: #242424;
  }

  .content :global(h1) {
    font-size: 3.6em;
    font-weight: 800;
  }

  .content :global(h2) {
    font-weight: 700;
    font-size: 2em;
  }

  .content :global(h3) {
    font-weight: 500;
    font-size: 1.6em;
    margin: 1.8em 0 0.9em;
  }

  .content :global(blockquote) {
    margin-bottom: 2em;
  }
  .content :global(blockquote > p) {
    margin-bottom: 0;
  }
  .content :global(blockquote > p + p) {
    margin-top: 1em;
  }

  .content :global(.heading-link:before) {
    content: "#";
  }
  .content :global(.heading-link) {
    position: absolute;
    margin-left: -1em;
    font-weight: 300;
    font-size: 0.8em;
    text-decoration: none;
  }

  /* .content :global(.header-link) {
  }
  .content :global(.header-link:before) {
    content: "#";
  } */
</style>
