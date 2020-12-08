<script context="module">
  export async function preload() {
    try {
      const blog = await this.fetch(`blog.json`);
      const posts = await blog.json();
      return { posts };
    } catch (error) {
      console.error(error);
    }
  }
</script>

<script>
  export let segment;
  export let posts = [];

  $: post = posts.find(post => post.slug == segment) || {};
  $: title = post.title;
  $: slug = post.slug;
</script>

<svelte:head>
  <title>{title || 'Blog'}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://jake.vision/blog/{slug ? slug : ''}" />

</svelte:head>

<h1>{title || 'Blog'}</h1>

<div class="content">
  <slot />
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

  .content :global(ul) {
    line-height: 1.5;
  }

  .content :global(ol) {
    margin-top: -0.5em;
  }

  .content :global(li) {
    margin: 0 0 0.5em 0;
  }
  .content :global(img) {
    max-width: 100%;
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
  }
  /* .content :global(.header-link) {
  }
  .content :global(.header-link:before) {
    content: "#";
  } */
</style>
