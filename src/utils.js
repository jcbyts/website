import SimplexNoise from "simplex-noise";
import { csvParse } from "d3-dsv"

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

export const getNoiseInGrid = (
  numberHorizontal = 100,
  numberVertical = 100,
  frequency = 1
) => {
  const simplex = new SimplexNoise(Math.random);
  let points = [];
  new Array(numberHorizontal).fill(null).forEach((_, xPosition) => {
    new Array(numberVertical).fill(null).forEach((_, yPosition) => {
      const x = xPosition / numberHorizontal;
      const y = yPosition / numberVertical;
      const r = simplex.noise2D(x * frequency, y * frequency) + 1;
      points.push([x, y, r]);
    });
  });
  return points;
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

export const grabSheet = async (id, gid = 0) => {
  const base = "https://www.googleapis.com/drive/v3/files/";
  const url = `${base}${id}/export?format=csv&id=${id}&gid=${gid}&version=${Date.now()}&mimeType=text/csv&key=AIzaSyDcJ8DOb1b9_q0QQqCgjEv_1jwV2U0yhlg`;
  const res = await fetch(url, {
    method: "GET",
  });
  const text = await res.text();
  return csvParse(text)
};

export const updateSheet = async (id, values=[], gid = "Sheet1", range="A1:C15") => {
  const base = "https://sheets.googleapis.com/v4/spreadsheets/";
  const url = `${base}${id}/values/${gid}!${range}?valueInputOption=USER_ENTERED&key=AIzaSyDcJ8DOb1b9_q0QQqCgjEv_1jwV2U0yhlg`;
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      range,
      "majorDimension": "ROWS",
      values,
    }),
  });
  console.log(res)
  return await res.json();
};

export const getHash = (numberOfCharacters = 10) => {
  let result, i, j;
  result = '';
  for(j=0; j<5; j++) {
    if( j == 8 || j == 12 || j == 16 || j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}
export const toArray = csv => (
  csv.map(d => csv.columns.map(column => d[column]))
)

export const fromPairs = (arr) => {
  let res = {};
  arr.forEach((d) => {
    res[d[0]] = d[1];
  });
  return res;
};