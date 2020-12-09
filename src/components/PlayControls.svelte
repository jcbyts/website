<script>
  import { onInterval } from "./../utils";
  import Icon from "./Icon.svelte";

  export let time = 0;
  export let rate = 0.05;
  export let frameRate = 60;
  export let isPlaying = true;

  const tick = () => {
    time += rate;
    if (time > 1) time = 0;
    if (time < 0) time = 0;
  };
  const { interval, pause, play } = onInterval(tick, frameRate);

  const onIsPlayingChange = () => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  };
  $: isPlaying, onIsPlayingChange();
</script>

<div class="bar">
  {#if !isPlaying}
    <button
      on:click={() => {
        isPlaying = true;
      }}>
      <Icon name="play" />
    </button>
  {:else}
    <button
      on:click={() => {
        isPlaying = false;
      }}>
      <Icon name="pause" />
    </button>
  {/if}
  <slot />
</div>

<style>
  .bar {
    display: flex;
    align-items: center;
  }
  button {
    margin-right: 1em;
  }
</style>
