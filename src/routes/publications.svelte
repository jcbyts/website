<script>
  import { fly } from "svelte/transition";

  import Publication from "$src/components/Publication.svelte";
  import publications from "./_publications.json";
</script>

<svelte:head>
  <title>Jacob Yates: Publications</title>
</svelte:head>

<div class="">
  <h1>Selected Publications</h1>
  <p>
    Find a complete list of publications{" "}
    <a href="https://scholar.google.com/citations?user=UJm-TkYAAAAJ&hl=en">
      here
    </a>
  </p>
  <div class="-ml-14 space-y-12">
    {#each publications as publication, i (publication.title)}
      <div in:fly={{ x: -30, delay: i * 200 }}>
        <Publication {...publication} />
      </div>
    {/each}
  </div>
</div>
