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
  export let playRate = 0.05;
  export let playFrameRate = 60;

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
  <div class="c font-sans">
    <div class="left">
      <div class="top">
        <PlayControls
          rate={playRate}
          frameRate={playFrameRate}
          bind:time={rightProgress}
          bind:isPlaying>
          <div class="frame">
            <span>
              <strong>Video</strong>
              at frame
              <Number number={leftFrameIndex + 1} format=".0f" />
            </span>
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
        <span>
          <strong>Slices through time</strong>
          at vertical position
          <Number number={rightFrameIndex + 1} format=".0f" />
        </span>
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
        <div class="annotation flex items-center space-x-2">
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
    line-height: 1.3em;
    margin-bottom: 0.3em;
  }
  .top span :global(span) {
    font-weight: 800;
  }
  .slice span :global(span) {
    padding-left: 0.2em;
  }
  .annotation {
    position: absolute;
    bottom: 0.5em;
    right: 1em;
    color: var(--a3);
    font-size: 0.8em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    z-index: 10;
    display: flex;
    align-items: center;
  }
  .annotation :global(svg) {
    margin-left: 0.5em;
  }

  @media (max-width: 500px) {
    .c {
      flex-direction: column;
    }
    .right {
      margin-top: 0.6em;
    }
  }
</style>
