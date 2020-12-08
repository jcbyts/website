<script>
  import { onMount } from "svelte";

  export let id = "";
  export let options = {};

  let tweetElement;

  onMount(() => {
    if (!twttr) return;
    if (!twttr.widgets) {
      twttr.ready(initTweet);
      return;
    }
    initTweet();
  });

  const initTweet = () => {
    if (!twttr.widgets) return;
    twttr.widgets.createTweet(id, tweetElement, options);
  };
</script>

<div class="tweet" bind:this={tweetElement} />

<style>
  .tweet {
    min-height: 630px;
    margin-bottom: 1em;
  }
</style>
