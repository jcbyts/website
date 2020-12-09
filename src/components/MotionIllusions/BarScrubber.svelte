<script>
  import DualScrubber from "./../DualScrubber.svelte";
</script>

<div class="c">
  <DualScrubber
    leftImage={'/motionillusionblog/1Dbars_GifAsImg.jpeg'}
    rightImage={'/motionillusionblog/1Dbars_buckets.jpeg'}
    numberOfFrames={60}
    numberOfBuckets={240 / 5}
    leftAspectRatio={240 / 240}
    rightAspectRatio={240 / 240}
    playRate={0.016}
    playFrameRate={100} />
</div>

<style>
  .c {
    max-width: 30em;
    margin: 2em auto;
  }
</style>
