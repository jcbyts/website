<script>
  import { onMount } from "svelte";

  import Publication from "./../components/Publication.svelte";
  import publications from "./_publications.json";
  import cv from "./_cv.json";
</script>

<div class="cv">
  <h1>CV</h1>

  <div class="list">
    {#each cv as { title, items } (title)}
      <div class="section">
        <h3>{title}</h3>

        <div class="items">
          {#if title.toLowerCase() === 'publications'}
            {#each publications as publication (publication.title)}
              <Publication {...publication} />
            {/each}
          {/if}
          {#each items || [] as { title, when, who, authors, where, tag, footnote }}
            <div class="item" key={title}>
              <div class="main">
                <div class="title">{title}</div>
                {#each [who, authors, where, tag, footnote].filter(d => d) as d (d)}
                  <div class="note">{d}</div>
                {/each}
              </div>
              <div class="when">{when}</div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .list {
    margin: 0 -1.6em;
  }

  .list .section {
    padding: 0.9em 1.6em;
    margin: 1em 0 2em;
    transition: all 0.3s ease-out;
  }

  .list .items {
    margin: 0 -1.6em;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.6em 1.6em;
    transition: all 0.3s ease-out;
  }

  .item .title {
    font-size: 1.3em;
    line-height: 1.3em;
    font-weight: 700;
    margin: 0.3em 0;
  }

  .item .main {
    margin-right: 2em;
  }
</style>
