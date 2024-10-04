<script>
  import { timeFormat } from "d3-time-format";

  export let data;
  const posts = data.posts
  console.log(posts)

  const formatDate = timeFormat("%b %e, %Y");
</script>

<h1>Thoughts</h1>

<div class="space-y-12 md:-mx-14">
  {#each posts.filter((d) => !d.draft && d.slug) as { slug, title, date, description } (slug)}
    <article
      class="bg-white flex flex-col py-6 md:py-10 px-5 md:px-14 shadow-lg shadow-stone-50 hover:shadow-stone-100 transition-all transform hover:-translate-y-1"
    >
      <header class="flex flex-col">
        <a href="/blog/{slug}">
          <h3 class="mt-0 !mb-1 text-stone-900">
            {title}
          </h3>
        </a>
        <small class="font-sans text-stone-500 text-sm"
          >{formatDate(new Date(date))}</small
        >
      </header>
      {#if description}
        <section class="mt-5 text-lg">
          <p>{description}</p>
        </section>
      {/if}
    </article>
  {/each}
</div>
