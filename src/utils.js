import { onDestroy } from "svelte";

// grabbed from https://gist.github.com/callumlocke/cc258a193839691f60dd
export const scaleCanvas = (canvas, context, width, height) => {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  } else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "";
    canvas.style.height = "";
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
};

export const slugify = (str = "") =>
  str.toLowerCase().replace(/ /g, "-").replace(/\./g, "");

export const serialize = function (form) {
  var field,
    l,
    s = [];

  if (typeof form == "object" && form.nodeName == "FORM") {
    var len = form.elements.length;

    for (var i = 0; i < len; i++) {
      field = form.elements[i];
      if (
        field.name &&
        !field.disabled &&
        field.type != "button" &&
        field.type != "file" &&
        field.type != "hidden" &&
        field.type != "reset" &&
        field.type != "submit"
      ) {
        if (field.type == "select-multiple") {
          l = form.elements[i].options.length;

          for (var j = 0; j < l; j++) {
            if (field.options[j].selected) {
              s[s.length] =
                encodeURIComponent(field.name) +
                "=" +
                encodeURIComponent(field.options[j].value);
            }
          }
        } else if (
          (field.type != "checkbox" && field.type != "radio") ||
          field.checked
        ) {
          s[s.length] =
            encodeURIComponent(field.name) +
            "=" +
            encodeURIComponent(field.value);
        }
      }
    }
  }
  return s.join("&").replace(/%20/g, "+");
};

export const randomInRange = (min, max) => min + Math.random() * (max - min);

export const getHash = (numberOfCharacters = 10) => {
  let result, i, j;
  result = "";
  for (j = 0; j < 5; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
};
export const toArray = (csv) =>
  csv.map((d) => csv.columns.map((column) => d[column]));

export const fromPairs = (arr) => {
  let res = {};
  arr.forEach((d) => {
    res[d[0]] = d[1];
  });
  return res;
};

export function onInterval(callback, milliseconds) {
  let interval;
  const play = () => {
    interval = setInterval(callback, milliseconds);
  };
  const pause = () => {
    clearInterval(interval);
  };
  play();

  onDestroy(() => {
    pause();
  });

  return {
    interval,
    pause,
    play,
  };
}
