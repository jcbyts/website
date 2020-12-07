<script>
  import { onMount } from "svelte";

  import Publication from "./../components/Publication.svelte";
  import publications from "./_publications.json";
</script>

<div class="publications">
  <h1>Selected Publications</h1>
  <p>
    Find a complete list of publications{' '}
    <a href="https://scholar.google.com/citations?user=UJm-TkYAAAAJ&hl=en">
      here
    </a>
  </p>
  <div class="list">
    {#each publications as publication (publication.title)}
      <Publication {...publication} />
    {/each}
  </div>
</div>

<style>
  .list {
    margin: 0 -1.6em;
  }
</style>
