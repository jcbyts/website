<script>
  export let dimension = "x";
  export let progress = 0;
  export let doShowLine = false;

  let width = 100;
  let height = 100;
  let scrubberElement;

  const onMouseMove = e => {
    // const position = dimension == "x" ? e.
    const bounds = scrubberElement.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    progress = Math.max(
      0,
      Math.min(1, dimension == "x" ? x / width : y / height)
    );
  };
</script>

<div
  class="scrubber"
  bind:this={scrubberElement}
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:mousemove={onMouseMove}>
  <slot />
  {#if doShowLine}
    <div
      class="line line--{dimension}"
      style="transform: translate{dimension.toUpperCase()}({height * progress}px)" />
  {/if}
</div>

<style>
  .scrubber {
    position: relative;
  }
  .line {
    position: absolute;
    background: var(--a1);
  }
  .line--x {
    top: 0;
    bottom: 0;
    left: -0.5px;
    width: 1px;
  }
  .line--y {
    left: 0;
    right: 0;
    top: -0.5px;
    height: 1px;
  }
</style>
