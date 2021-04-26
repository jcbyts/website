<script context="module">
  export async function load({ page, fetch, session, context }) {
    const url = "/blog.json";

    const res = await fetch(url);

    if (res.ok) {
      const posts = await res.json();

      return {
        props: {
          posts,
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
  import { timeFormat } from "d3";

  export let posts = [];
  const formatDate = timeFormat("%b %e, %Y");
</script>

<div class="blog">
  {#each posts.filter((d) => !d.draft) as { slug, title, date, description } (slug)}
    <article>
      <header>
        <a class="heading" href="/blog/{slug}">{title}</a>
        <small>{formatDate(new Date(date))}</small>
      </header>
      {#if description}
        <section>
          <p>{description}</p>
        </section>
      {/if}
    </article>
  {/each}
</div>

<style>
  .blog {
    margin: 0 -1.6em;
  }

  article {
    padding: 0.9em 1.6em;
    margin: 1em 0;
    transition: all 0.3s ease-out;
  }
  header {
    display: flex;
    font-size: 2em;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.3em 0;
    font-weight: 900;
    text-decoration: none;
  }

  small {
    display: block;
    font-size: 0.5em;
    font-weight: 400;
    margin-bottom: -0.3em;
    white-space: nowrap;
  }

  .heading {
    line-height: 1.2em;
    text-decoration: none;
  }
</style>
