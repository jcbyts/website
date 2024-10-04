<script>
  import { fly } from "svelte/transition";

  import Publication from "$src/components/Publication.svelte";
  import publications from "../publications/_publications.json";
  import cv from "./_cv.json";
</script>

<svelte:head>
  <title>Jacob Yates: CV</title>
</svelte:head>

<div class="cv">
  <h1>CV</h1>

  <div class="list">
    {#each cv as { title, items }, i (title)}
      <div class="section" in:fly|global={{ x: -30, delay: i * 200 }}>
        <h3 class="font-sans text-lg text-stone-500">{title}</h3>

        <div
          class="space-y-12"
          class:-ml-14={title.toLowerCase() === "publications"}
          class:-ml-8={title.toLowerCase() !== "publications"}
          class:space-y-12={title.toLowerCase() === "publications"}
          class:space-y-6={title.toLowerCase() !== "publications"}
        >
          {#if title.toLowerCase() === "publications"}
            {#each publications as publication (publication.title)}
              <Publication {...publication} />
            {/each}
          {/if}
          {#each items || [] as { title, when, who, authors, where, tag, footnote }}
            <div class="px-8 py-5 flex justify-between" key={title}>
              <div class="">
                <h3 class="mt-0 font-semibold text-xl mb-1">{title}</h3>
                {#each [who, authors].filter((d) => d) as d (d)}
                  <div class="text-stone-500 text-sm font-sans">{d}</div>
                {/each}
                {#each [where, tag, footnote].filter((d) => d) as d (d)}
                  <div class="text-stone-500 text-sm font-sans">{d}</div>
                {/each}
              </div>
              <div class="font-sans text-stone-500 text-sm mt-1">{when}</div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
</style>
