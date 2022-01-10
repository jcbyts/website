<script>
  import { scaleCanvas } from "./../utils";

  export let imageData;
  export let width = 100;
  export let height = 100;

  let element;
  const drawImage = () => {
    if (!element) return;
    if (!imageData) return;
    const ctx = element.getContext("2d");
    const scale = scaleCanvas(element, ctx, width, height);
    try {
      ctx.putImageData(imageData, 0, 0, 0, 0, width * scale, height * scale);
    } catch (e) {
      console.log("error", e);
    }
  };
  $: imageData, width, height, drawImage();
</script>

<canvas bind:this={element} style="width: {width}px; height: {height}px;" />
