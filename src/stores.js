import { writable } from "svelte/store";

export const isNavLight = writable(false);

export const maxNumberOfDots = 6000;
export const initialDots = new Array(maxNumberOfDots)
  .fill(0)
  .map(() => [1, 1, 1]);
export const padDots = (newDots) =>
  [...newDots, ...initialDots].slice(0, maxNumberOfDots);
export const dotColor = writable("#fff");
export const dotPositions = writable(initialDots);

// side dots
const numberVertical = 90;
const numberHorizontal = 6;
const padding = 11;
let sideDots = [];
new Array(numberHorizontal).fill(null).forEach((_, xPosition) => {
  new Array(numberVertical).fill(null).forEach((_, yPosition) => {
    const x = (xPosition + 1) * padding;
    const y = (yPosition + 8) * padding;
    const r = 1.3;
    sideDots.push([x, y, r]);
  });
});
export { sideDots };
