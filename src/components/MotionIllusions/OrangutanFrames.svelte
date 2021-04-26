<script>
  import Number from "./../Number.svelte";
  import InView from "./../InView.svelte";
  import BucketedImage from "./../BucketedImage.svelte";
  import PlayControls from "./../PlayControls.svelte";

  let time = 0;
  let isInView = true;
  let isPlaying = false;

  const onIsInViewChange = () => {
    setTimeout(() => {
      isPlaying = isInView;
    });
  };
  $: isInView, onIsInViewChange();

  const numberOfFrames = 24;

  $: frameIndex =
    Math.floor((time * numberOfFrames) / (numberOfFrames / 4)) *
    (numberOfFrames / 4);
</script>

<InView bind:isInViewProp={isInView}>
  <div class="c">
    <PlayControls rate={0.1} frameRate={500} bind:time bind:isPlaying isHidden>
      <div class="frame">
        <span>
          <strong>Video</strong>
          at frame
          <strong>{frameIndex + 1}</strong>
        </span>
      </div>
    </PlayControls>
    <BucketedImage
      image={'/motionillusionblog/orangGifAsImg.jpeg'}
      aspectRatio={480 / 270}
      {numberOfFrames}
      index={frameIndex}
      alt="Orangutan swinging" />
  </div>
</InView>

<style>
  .c {
    max-width: 30em;
    margin: 2em auto;
  }
  strong {
    font-weight: 700;
    font-feature-settings: "tnum" 1;
  }
</style>
