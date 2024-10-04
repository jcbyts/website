<script>
  import { fly } from "svelte/transition";

  import Content from "$lib/home.md";
</script>

<svelte:head>
  <title>Jacob Yates</title>
</svelte:head>

<div class="c" in:fly|global={{ y: 30 }}>
  <Content />
</div>

<style>
</style>
