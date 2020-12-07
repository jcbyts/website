<script>
  import posts from "./_posts";
  console.log(posts);
</script>

<div class="blog">
  {#each posts as { slug, title, date, description } (slug)}
    <article>
      <header>
        <a href="/blog/{slug}">{title}</a>
        <small>{date}</small>
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
    display: block;
    font-size: 2em;
    padding: 0.3em 0;
    font-weight: 900;
    text-decoration: none;
  }
</style>
