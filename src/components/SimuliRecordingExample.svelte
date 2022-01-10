<script>
  import { range } from "d3-array";
  import { scalePow } from "d3-scale";
  import { scaleCanvas } from "./../utils";
  import { onMount } from "svelte";
  import Canvas from "./Canvas.svelte";

  export let stimuli = "scene";
  export let numElectrodes = 8;
  export let behaviorType = "fixed";
  export let imageUrl =
    "https://images.unsplash.com/photo-1641487379327-0c271bae490c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80";
  export let numberOfRowsOfCones = 13;

  let canvas;
  let canvasScale = 1;
  let canvasWidth = 100;
  let canvasHeight = 100;
  let retinaWidth = 100;
  let retinaHeight = 100;
  let mouseOffset = [0, 0];
  const drawCanvas = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const aspectRatio = image.width / image.height;

      // const height = canvas.width / aspectRatio;
      canvasScale = scaleCanvas(canvas, ctx, canvasWidth, canvasHeight);
      const width = canvasWidth;
      const height = canvasHeight;
      ctx.drawImage(image, 0, 0, width, height);
      updateConePixels();
    };
    image.src = imageUrl;
  };
  $: imageUrl, canvas, drawCanvas();
  onMount(drawCanvas);

  let coneImages = [];
  const updateConePixels = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    coneImages = conePositions.map((row) => {
      return row.map(({ x, y, r }) => {
        try {
          const image = ctx.getImageData(
            (x - r) * canvasScale - mouseOffset[0],
            (y - r) * canvasScale - mouseOffset[1],
            r * 2 * canvasScale,
            r * 2 * canvasScale
          );
          return image;
        } catch (e) {
          return null;
        }
      });
    });
  };

  $: coneDistanceScale = scalePow()
    .exponent(2.5)
    .domain([-1, numberOfRowsOfCones + 1.1])
    .range([0, retinaWidth / 2]);
  const conePadding = 0.1;
  let conePositions = [];
  const updateConePositions = () => {
    let runningConeDistance = 0;
    conePositions = range(0, numberOfRowsOfCones).map((rowIndex) => {
      const distance = coneDistanceScale(rowIndex);
      const coneSize = (distance - runningConeDistance) ** 1.03;

      runningConeDistance = distance;
      // const coneSize = (coneDistanceScale(rowIndex + 0.9) || 0) - distance;
      const circleCircumference = 2 * Math.PI * distance;
      const numberOfCones = Math.floor(circleCircumference / coneSize);

      const anglePerCone = (2 * Math.PI) / numberOfCones;
      const conePositions = range(0, numberOfCones).map((coneIndex) => {
        const angle =
          anglePerCone * coneIndex + (rowIndex % 2 ? anglePerCone / 2 : 0);
        const x = distance * Math.cos(angle) + retinaWidth / 2;
        const y = distance * Math.sin(angle) + retinaHeight / 2;
        return { x, y, r: (coneSize / 2) * (1 - conePadding) };
      });
      return conePositions;
    });
    // updateConePixels();
  };
  $: numberOfRowsOfCones, retinaWidth, retinaHeight, updateConePositions();
  // $: mouseOffset, updateConePixels();
</script>

<div class="flex items-center">
  <div class="relative flex-1 aspect-[4/3]">
    <canvas
      bind:this={canvas}
      class="relative w-full h-full z-0"
      bind:clientWidth={canvasWidth}
      bind:clientHeight={canvasHeight}
      on:mousemove={(e) => {
        const bounds = canvas.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        mouseOffset = [x - canvasWidth / 2, y - canvasHeight / 2];
      }}
    />
    <div
      class="absolute top-1/2 left-1/2 h-2 w-2 bg-black border border-black rounded-full pointer-events-none z-10"
      style="transform: translate(-50%, -50%) translate({mouseOffset[0]}px, {mouseOffset[1]}px)"
    />
  </div>

  <div
    class="relative flex-1 aspect-[4/3]"
    bind:clientWidth={retinaWidth}
    bind:clientHeight={retinaHeight}
  >
    <!-- {#each conePositions as row, rowIndex}
      {#each row as { x, y, r }, coneIndex}
        <div
          class="absolute bg-sky-500 rounded-full flex items-center justify-center overflow-hidden"
          style="transform: translate(-50%, -50%) translate({x}px, {y}px); height: {r *
            2}px; width: {r * 2}px"
        >
          <img
            src={imageUrl}
            width={canvasWidth}
            height="auto"
            style="width: {canvasWidth}px"
          />
<Canvas
            imageData={coneImages[rowIndex]?.[coneIndex]}
            width={r * 2}
            height={r * 2}
          />
        </div>
      {/each}
    {/each} -->
    <!-- <svg class="w-full h-full">
      {#each conePositions as row}
        {#each row as { x, y, r }}
          <circle cx={x} cy={y} {r} fill="red" stroke="black" />
        {/each}
      {/each}
    </svg> -->
    <!-- <img
      class="absolute w-full h-full"
      src={imageUrl}
      width={canvasWidth}
      height="auto"
      style="transform: translate({mouseOffset[0]}px, {mouseOffset[1]}px)"
    /> -->
    <svg class="absolute w-full h-full">
      <defs>
        <mask id="mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {#each conePositions as row}
            {#each row as { x, y, r }}
              <circle cx={x} cy={y} {r} fill="black" />
            {/each}
          {/each}
        </mask>
      </defs>
      <rect fill="#f4f4f4" width="100%" height="100%" />
      <image
        xlink:href={imageUrl}
        width={canvasWidth}
        height="auto"
        transform="translate({-mouseOffset[0]},{-mouseOffset[1]})"
      />
      <rect mask="url(#mask)" fill="white" width="100%" height="100%" />
    </svg>
  </div>
</div>
