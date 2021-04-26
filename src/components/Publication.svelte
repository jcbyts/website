<script>
  export let link;
  export let title;
  export let authors;
  export let journal;
  export let year = "";
  export let page = "";
  export let highlights;
</script>

<div class="publication">
  <header>
    <a href={link} class="header">
      {title}
      <div class="link-out">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </a>
  </header>
  <div class="authors">{authors}</div>
  <div class="metadata">
    <div>
      <span class="journal">{journal}</span>
      <span class="year">{year}</span>
    </div>
    <div class="location">{page}</div>
  </div>
  {#if highlights}
    <div class="highlights">
      {#each highlights as { title, where, authors, link } (authors)}
        <div class="highlight">
          <a href={link} class="title">
            {title}
            {#if where}
              in
              <i>{where}</i>
            {/if}
          </a>
          <div>{authors}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .publication {
    padding: 0.9em 1.6em;
    margin: 1em 0 2em;
    transition: all 0.3s ease-out;
  }

  .header {
    display: block;
    font-size: 1.3em;
    line-height: 1.3em;
    color: var(--tc);
    padding: 0.3em 0;
    font-weight: 700;
    text-decoration: none;
  }

  a:visited {
    color: inherit;
  }

  .metadata {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    color: var(--grey1);
  }
  .journal {
    font-weight: 600;
  }
  .year {
    display: inline-block;
    margin-left: 0.3em;
    color: var(--grey1);
  }

  .link-out {
    display: inline-block;
    margin-left: 0.2em;
    color: var(--grey1);
  }

  .link-out svg {
    width: 1em;
    margin-bottom: -0.18em;
  }

  .highlights {
    margin-top: 1em;
  }
  .highlight {
    margin: 0.3em 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    color: var(--grey1);
  }

  .highlight a {
    color: var(--grey1);
  }
</style>
