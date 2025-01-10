<script>
  import { dev } from '$app/environment';
  import { timeFormat } from "d3-time-format";

  export let data
  const {title, slug, url, draft, date, layout="default", Content} = data

  $: isFullWidth = layout === "full-width";
  const formatDate = timeFormat("%b %e, %Y");
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://jake.vision/blog/{slug}"
  />
</svelte:head>

<h1 class="mb-0">{title}</h1>
<div class="mt-5 font-sans text-gray-500">
  {formatDate(new Date(date))}
</div>

<div class="content mt-10 -mx-14 font-serif" class:breakout={isFullWidth}>
  <div
    class="bg-white py-16 px-14 shadow-2xl shadow-blue-50 {isFullWidth
      ? 'mx-[2em]'
      : ''}"
  >
    {#if draft && dev}
      <blockquote>
        This is a draft and won't show up on the index page.
      </blockquote>
    {/if}
    <Content />
  </div>
</div>