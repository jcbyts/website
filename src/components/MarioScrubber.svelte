<script>
  import DualScrubber from "./DualScrubber.svelte";
</script>

<div class="c">
  <DualScrubber
    leftImage={'/motionillusionblog/mariocrop_GifAsImg.jpeg'}
    rightImage={'/motionillusionblog/mariocrop_buckets.jpeg'}
    numberOfFrames={60 - 1}
    numberOfBuckets={244 / 5 - 1}
    leftAspectRatio={244 / 244}
    rightAspectRatio={244 / 244}
    playRate={0.016}
    playFrameRate={100} />
</div>

<style>
  .c {
    max-width: 30em;
    margin: 2em auto;
  }
</style>
