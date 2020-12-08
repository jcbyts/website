<script>
  import DualScrubber from "./DualScrubber.svelte";
</script>

<div class="c">
  <DualScrubber
    leftImage={'/motionillusionblog/orangGifAsImg.jpeg'}
    rightImage={'/motionillusionblog/buckets.jpg'}
    numberOfFrames={24 - 1}
    numberOfBuckets={270 / 5 - 1}
    leftAspectRatio={480 / 270}
    rightAspectRatio={480 / 24 / 11.25} />
</div>

<style>
  .c {
    margin: 2em 0;
  }
</style>
