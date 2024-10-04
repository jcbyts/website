<script>
  import { fly } from "svelte/transition";
  import allPublications from "./../routes/publications/_publications.json";
  import Publication from "$src/components/Publication.svelte";

  const publications = allPublications
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);
</script>

<div class="-mx-14 space-y-12">
  {#each publications as publication, i (publication.title)}
    <div in:fly|global={{ x: -30, delay: i * 200 }}>
      <Publication {...publication} />
    </div>
  {/each}
</div>
