import { n as noop, s as safe_not_equal, a as assign, b as now, l as loop, i as identity, c as create_ssr_component, d as subscribe, e as escape, f as each, g as add_attribute, h as set_store_value, v as validate_component } from "./app-1a513ba3.js";
import { scaleSqrt, range } from "d3";
import { p as publications, P as Publication } from "./Publication-1cfec0e2.js";
import "@sveltejs/kit/ssr";
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const lineW = 50;
const maxItems = 1e3;
const LinesHr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let numX;
  let numY;
  let xPadding;
  let yPadding;
  let rotations;
  let distances;
  let items;
  let getAngle;
  let getDistance;
  let $distances, $$unsubscribe_distances = noop, $$subscribe_distances = () => ($$unsubscribe_distances(), $$unsubscribe_distances = subscribe(distances, ($$value) => $distances = $$value), distances);
  let $rotations, $$unsubscribe_rotations = noop, $$subscribe_rotations = () => ($$unsubscribe_rotations(), $$unsubscribe_rotations = subscribe(rotations, ($$value) => $rotations = $$value), rotations);
  let width = 2200;
  let height = 500;
  let x = 0;
  let y = 0;
  const padding = lineW * 0.3;
  const flatten = (arr) => arr.reduce((a, b) => a.concat(b), []);
  const updateRotations = () => {
    set_store_value(rotations, $rotations = [...items.map(getAngle), ...$rotations].slice(0, maxItems), $rotations);
  };
  const colorScale = scaleSqrt().domain([0, 600]).range(["#0ea5e9", "#e2e8f0"]).clamp(true);
  const updateDistances = () => {
    set_store_value(distances, $distances = [...items.map(getDistance), ...$distances].slice(0, maxItems), $distances);
  };
  numX = Math.floor(width / lineW);
  numY = Math.floor(height / lineW);
  xPadding = (width - numX * lineW) / 2;
  yPadding = (height - numY * lineW) / 2;
  $$subscribe_rotations(rotations = tweened(range(0, maxItems).map(() => Math.random() * Math.PI * 2)));
  $$subscribe_distances(distances = tweened(range(0, maxItems).map(() => 1)));
  items = flatten(range(0, numX).map((i) => {
    return range(0, numY).map((j) => {
      return [i * lineW, j * lineW];
    });
  }));
  getAngle = (pos) => {
    const angle = Math.atan2(pos[1] + lineW / 2 + yPadding - y, pos[0] + lineW / 2 + xPadding - x);
    return angle;
  };
  getDistance = (pos) => {
    const distance = Math.sqrt(Math.pow(pos[0] - x, 2) + Math.pow(pos[1] - y, 2));
    return distance;
  };
  {
    updateRotations();
  }
  {
    updateDistances();
  }
  $$unsubscribe_distances();
  $$unsubscribe_rotations();
  return `<div class="${"w-full h-[500px] mt-28 breakout"}"><svg class="${"w-full h-full pointer-events-none"}"><defs><path id="${"line"}" d="${"M " + escape(padding) + " " + escape(padding) + " L " + escape(lineW - padding) + " " + escape(lineW - padding)}" stroke="${"currentColor"}" stroke-width="${"9"}" stroke-linecap="${"round"}"></path></defs><g style="${"transform: translate(" + escape(xPadding) + "px," + escape(yPadding) + "px)"}">${each(items, ([x2, y2], i) => `<use href="${"#line"}"${add_attribute("x", x2, 0)}${add_attribute("y", y2, 0)} style="${"color: " + escape(colorScale($distances[i])) + "; transform-origin: " + escape(x2 + lineW * 0.5) + "px " + escape(y2 + lineW * 0.5) + "px; transform: rotate(" + escape($rotations[i] - Math.PI * 0.25) + "rad)"}"></use>`)}</g></svg></div>`;
});
const LatestPublications = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const publications$1 = publications.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  }).slice(0, 3);
  return `<div class="${"-mx-14 space-y-12"}">${each(publications$1, (publication, i) => `<div>${validate_component(Publication, "Publication").$$render($$result, Object.assign(publication), {}, {})}
    </div>`)}</div>`;
});
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 id="${"hi-im-jacob-yates"}">Hi, I\u2019m Jacob Yates</h1>
<p>I\u2019m an <a href="${"https://www.openphilanthropy.org/"}" rel="${"nofollow"}">Open Philanthropy</a> Fellow of the <a href="${"http://www.lsrf.org/"}" rel="${"nofollow"}">Life Sciences Research Foundation</a>. I\u2019m currently a postdoc in the Department of Biology at the University of Maryland under the supervision of Dr. <a href="${"http://www.neurotheory.umd.edu/people/dbutts"}" rel="${"nofollow"}">Daniel Butts</a>. I collaborate closely with Drs. <a href="${"http://marmolab.bcs.rochester.edu/index.html"}" rel="${"nofollow"}">Jude Mitchell</a> and <a href="${"http://aplab.bcs.rochester.edu/"}" rel="${"nofollow"}">Michele Rucci</a> at the University of Rochester.</p>
<p>My research is broadly focused on how mammalian brains extract information about the world using vision. This is an active process and is highly specialized in humans and other primates. My specific research questions are related to general principles of active vision and primate-specific specializations for high-resolution spatial vision.</p>
<p>You can find my full publication list <a href="${"https://scholar.google.com/citations?user=UJm-TkYAAAAJ&hl=en"}" rel="${"nofollow"}">here</a> and I am sometimes active on Twitter <a href="${"https://twitter.com/jcbyts"}" rel="${"nofollow"}">@jcbyts</a>.</p>
<p>This website is an overview of my work, but it is (very much) under construction.</p>
${validate_component(LinesHr, "LinesHr").$$render($$result, {}, {}, {})}
<h2 id="${"active-vision"}">Active Vision</h2>
<p>Most animals with complex spatial vision use image-forming eyes and a \u201Csaccade and fixate\u201D pattern of eye movements to see the world. However, their eyes are never still, counter-rotating relative to body and/or head movements, and drifting during \u201Cfixations\u201D, such that the input to the retina is better thought of as a spatiotemporal movie instead of a stable (or unstable) image. My research aims to understand the algorithms the brain uses (in cortical visual areas) to utilize information that is generated by the motion of the eyes. To approach this, I use a combination of high-resolution eye-tracking and statistical models of both the visual input and neural activity in visual cortex.</p>
<h2 id="${"foveal-processing"}">Foveal Processing</h2>
<p>Humans see best at the very center center of their visual field. This \u201Chigh-resolution\u201D region is called the fovea and, among mammals, only primates have one. The primate fovea is a highly-specialized anatomical adaptation for high-resolution spatial vision and it differs substantially from the peripheral retina and the retinas of other mammals.</p>
<hr>
<h2 id="${"latest-publications"}">Latest Publications</h2>
${validate_component(LatestPublications, "LatestPublications").$$render($$result, { title: "HI" }, {}, {})}`;
});
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Jacob Yates</title>`, ""}`, ""}

<div class="${"c"}">${validate_component(Home, "Content").$$render($$result, {}, {}, {})}
</div>`;
});
export { Routes as default };
