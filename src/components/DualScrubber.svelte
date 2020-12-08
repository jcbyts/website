<script>
  import Icon from "./Icon.svelte";
  import Number from "./Number.svelte";
  import InView from "./InView.svelte";
  import Scrubber from "./Scrubber.svelte";
  import BucketedImage from "./BucketedImage.svelte";
  import PlayControls from "./PlayControls.svelte";

  let isInView = false;

  export let leftImage = "/motionillusionblog/orangGifAsImg.jpeg";
  export let rightImage = "/motionillusionblog/buckets.jpg";

  export let numberOfFrames = 24 - 1;
  export let numberOfBuckets = 270 / 5 - 1;

  export let leftAspectRatio = 480 / 270;
  export let rightAspectRatio = 480 / 24 / 11.25;

  let leftProgress = 0.5;
  let rightProgress = 0;

  let isPlaying = false;
  const onIsInViewChange = () => {
    setTimeout(() => {
      isPlaying = isInView;
    });
  };
  $: isInView, onIsInViewChange();
  const onRightImageHover = () => {
    isPlaying = false;
  };

  $: leftFrameIndex = Math.floor(numberOfFrames * rightProgress);
  $: rightFrameIndex = Math.floor(numberOfBuckets * leftProgress);
</script>

<InView bind:isInViewProp={isInView}>
  <div class="c">
    <div class="left">
      <div class="top">
        <PlayControls bind:time={rightProgress} bind:isPlaying>
          <div class="frame">
            <strong>Video</strong>
            at frame
            <Number number={leftFrameIndex + 1} format=".0f" />
          </div>
        </PlayControls>
      </div>
      <Scrubber dimension="y" bind:progress={leftProgress} doShowLine>
        <BucketedImage
          image={leftImage}
          aspectRatio={leftAspectRatio}
          {numberOfFrames}
          index={leftFrameIndex}
          alt="The video" />
      </Scrubber>
    </div>
    <div class="right">
      <div class="top slice">
        <strong>Slices</strong>
        at vertical position
        <Number number={rightFrameIndex + 1} format=".0f" />
      </div>
      <div on:mouseenter={onRightImageHover}>
        <Scrubber dimension="y" bind:progress={rightProgress} doShowLine>
          <BucketedImage
            image={rightImage}
            aspectRatio={rightAspectRatio}
            numberOfFrames={numberOfBuckets}
            index={rightFrameIndex}
            alt="Slices of the video" />
        </Scrubber>
        <div class="annotation">
          Time
          <Icon name="arrow" direction="s" />
        </div>
      </div>
    </div>
  </div>
</InView>

<style>
  .c {
    display: flex;
  }
  .left {
    flex: 1;
    margin-right: 1em;
  }
  .right {
    flex: 1;
    position: relative;
  }
  .top {
    display: flex;
    align-items: center;
    height: 3em;
    margin-bottom: 0.3em;
  }
  .top :global(span) {
    font-weight: 800;
  }
  .slice :global(span) {
    padding-left: 0.3em;
  }
  .slice :global(strong) {
    padding-right: 0.3em;
  }
  .annotation {
    position: absolute;
    bottom: 0.5em;
    right: 1em;
    color: var(--a3);
    font-size: 0.9em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    z-index: 10;
  }
</style>
