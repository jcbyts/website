<script>
  import { fly } from "svelte/transition";

  import content from "./../assets/home.md";
</script>

<div class="c" in:fly={{ y: 30 }}>
  {@html content.html}
</div>

<style>

</style>
