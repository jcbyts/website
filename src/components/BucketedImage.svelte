<script>
  export let image = "";
  export let aspectRatio = 2;
  export let index = 0;
  export let dimension = "y";
  export let alt = "";
  export let numberOfFrames = 10;
  export let doFlip = false;

  $: xOffset = dimension == "x" ? (index * 100) / numberOfFrames : 0;
  $: yOffset = dimension == "y" ? (index * 100) / numberOfFrames : 0;

  $: scaleStatement = doFlip
    ? dimension == "x"
      ? `scaleX(-1)`
      : `scaleY(-1)`
    : "";
</script>

<div class="c" style="width: 100%; padding: {(1 / aspectRatio / 2) * 100}%">
  <img
    src={image}
    {alt}
    style="width: 100%; height: {numberOfFrames * 100}%; transform: translate({-xOffset}%,
    {-yOffset}%) {scaleStatement}" />
</div>

<style>
  .c {
    position: relative;
    overflow: hidden;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
