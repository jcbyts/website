<script>
  import { interpolateHclLong, range, scaleLinear, scaleSqrt } from "d3";
  import { tweened } from "svelte/motion";

  let width = 2200;
  let height = 500;
  let x = 0;
  let y = 0;
  const lineW = 50;
  const padding = lineW * 0.3;
  $: numX = Math.floor(width / lineW);
  $: numY = Math.floor(height / lineW);
  $: xPadding = (width - numX * lineW) / 2;
  $: yPadding = (height - numY * lineW) / 2;
  const maxItems = 1000;
  $: rotations = tweened(
    range(0, maxItems).map(() => Math.random() * Math.PI * 2)
  );
  $: distances = tweened(range(0, maxItems).map(() => 1));

  $: items = flatten(
    range(0, numX).map((i) => {
      return range(0, numY).map((j) => {
        return [i * lineW, j * lineW];
      });
    })
  );

  $: getAngle = (pos) => {
    const angle = Math.atan2(
      pos[1] + lineW / 2 + yPadding - y,
      pos[0] + lineW / 2 + xPadding - x
    );
    return angle;
  };
  $: getDistance = (pos) => {
    const distance = Math.sqrt(
      Math.pow(pos[0] - x, 2) + Math.pow(pos[1] - y, 2)
    );
    return distance;
  };
  const flatten = (arr) => arr.reduce((a, b) => a.concat(b), []);
  const updateRotations = () => {
    $rotations = [...items.map(getAngle), ...$rotations].slice(0, maxItems);
  };
  const colorScale = scaleSqrt()
    .domain([100, 150, 500])
    .range(["#f39c12", "#0ea5e9", "#e2e8f0"])
    // .interpolate(interpolateHclLong)
    .clamp(true);
  $: x, y, updateRotations();
  const updateDistances = () => {
    $distances = [...items.map(getDistance), ...$distances].slice(0, maxItems);
  };
  $: x, y, updateDistances();
</script>

<div
  class="w-full h-[500px] mt-28 breakout"
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:mousemove={(e) => {
    const bounds = e.target.getBoundingClientRect();
    x = e.clientX - bounds.left;
    y = e.clientY - bounds.top;
  }}
>
  <svg class="w-full h-full pointer-events-none">
    <defs>
      <path
        id="line"
        d="M {padding} {padding} L {lineW - padding} {lineW - padding}"
        stroke="currentColor"
        stroke-width="9"
        stroke-linecap="round"
      />
    </defs>
    <g style="transform: translate({xPadding}px,{yPadding}px)">
      {#each items as [x, y], i}
        <use
          href="#line"
          {x}
          {y}
          style="color: {colorScale($distances[i])}; transform-origin: {x +
            lineW * 0.5}px {y + lineW * 0.5}px; transform: rotate({$rotations[
            i
          ] -
            Math.PI * 0.25}rad)"
        />
      {/each}
    </g>
  </svg>
</div>
