<script>
  import { onMount, tick } from "svelte";

  export let id = "";
  export let options = {};

  let tweetElement;

  onMount(async () => {
    if (!twttr) return;
    if (!twttr.widgets) {
      twttr.ready(initTweet);
      return;
    }
    await tick();
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
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 15em;
    margin: -1em 0 0;
    transform: scale(0.9);
  }
</style>
