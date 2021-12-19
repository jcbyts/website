import { c as create_ssr_component } from "./app-1a513ba3.js";
import "@sveltejs/kit/ssr";
const metadata = {
  "title": "The noisier model is better?",
  "date": "2021-3-3",
  "description": "A perplexing situation where a worse model is better",
  "draft": true
};
const Noisy_better = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>I recently understood a figure from a paper or the first time the other day and the implications have been bugging me since. I\u2019ll talk more about the specific figure below, but the broad implications for neural modeling bother me: it turns out there are lots of ways that a <strong>more accurate model of neural responses can perform worse than a noisy model during statistical model comparison even though it\u2019s a better model</strong>.</p>
<h2 id="${"how-do-neuroscientists-decide-which-model-is-best"}">How do neuroscientists decide which model is best?</h2>
<p>The basic idea of most statistical models is that you have some mathematical equations that can generate fake data. In the case of neuroscience, it might be math that you think <a href>real neurons are doing</a> or it might be an equation that provides a nice <a href>functional description of a neuron\u2019s response</a>, but at the end of the day, you can make fake data that looks like real data once you\u2019ve set the <strong>parameters</strong> of the model correclty. There are many ways to learn the correct parameters, but one of the most common is to pick a <strong>loss function</strong> that specifies some</p>`;
});
export { Noisy_better as default, metadata };
