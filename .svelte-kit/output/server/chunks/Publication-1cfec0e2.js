import { c as create_ssr_component, g as add_attribute, e as escape, f as each } from "./app-1a513ba3.js";
var publications = [
  {
    authors: "SL Cloherty*, JL Yates*, D Graf, GC DeAngelis, JF Mitchell",
    year: 2020,
    title: "Motion perception in the common marmoset",
    journal: "Cerebral Cortex",
    link: "https://marmolab.bcs.rochester.edu/pubs/2019_cloherty-etal_CC.pdf",
    highlights: [
      {
        title: "Faculty of 1000 (F1000Prime) entry",
        authors: "Marcello Rosa",
        link: "https://facultyopinions.com/prime/737076579"
      }
    ]
  },
  {
    authors: "DM Zoltowski, KW Latimer, JL Yates, AC Huk, JW Pillow",
    year: 2019,
    title: "Discrete stepping and nonlinear ramping dynamics underlie spiking responses of LIP neurons during decision-making",
    journal: "Neuron",
    page: "1249-1258",
    link: "https://pillowlab.princeton.edu/pubs/Zoltowski19_Neuron_StepRampLIP.pdf"
  },
  {
    authors: "JS Matthis, JL Yates, MM Hayhoe",
    year: 2018,
    title: "Gaze and the control of foot placement when walking in natural terrain",
    journal: "Current Biology",
    page: "1224-1233",
    link: "https://d1wqtxts1xzle7.cloudfront.net/56342614/1-s2.0-S0960982218303099-main.pdf?1523985307=&response-content-disposition=inline%3B+filename%3DGaze_and_the_Control_of_Foot_Placement_W.pdf&Expires=1605545857&Signature=IXmcSJW0Tm4rhuOnGqnNdYEv9nyJhsoM5-sfmWO8yhaMA0Z6ordEQkpRz5MKqaKPX5U2dLIsjCMSLKEbrT8pH~Y8Bn-DNT1wQaIt1Q6SUH5qqZjxU1qJCcoX~8azSDMekmA-eQzgVJDvcZdIbKvajp3KfYiNvwxxtuQuxDzgllRzD4FtKDRx7edsZvMfm-94lHi1JWCxA2IwbY8r01YcxPwN77v24KmGbMAYhel5fENzOGCKiL8zsRxAUs02DlPRkFGw7Dte8egzCRYWHWb3ani9lP9wds75NvbU~wvkTbK6kmLfbXI9WNYcx1D6fZ8bl6r5pBk9C0I8NeoFZ7UNyQ__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA"
  },
  {
    authors: "JL Yates, IM Park, LN Katz, JW Pillow, AC Huk",
    year: 2017,
    title: "Functional dissection of signal and noise in MT and LIP during decision-making",
    journal: "Nature Neuroscience",
    page: "1285-",
    link: "https://www.nature.com/articles/nn.4611.pdf?origin=ppub"
  },
  {
    authors: "AC Huk, LN Katz, JL Yates",
    year: 2017,
    title: "The role of the lateral intraparietal area in (the study of) decision making",
    journal: "Annual review of neuroscience",
    page: "40-",
    link: "https://www.annualreviews.org/doi/full/10.1146/annurev-neuro-072116-031508"
  },
  {
    authors: "LN Katz*, JL Yates*, JW Pillow, & AC Huk",
    year: 2016,
    title: "Dissociated functional significance of decision-related activity in the primate\ndorsal stream",
    journal: "Nature",
    page: "535: 285\u2013288",
    link: "http://www.nature.com/nature/journal/v535/n7611/full/nature18617.html",
    highlights: [
      {
        title: "Spotlight",
        where: "Trends in Neurosciences",
        authors: "Bijan Pesaran & David Freedman",
        link: "http://www.cell.com/trends/neurosciences/fulltext/S0166-2236(16)30099-6"
      },
      {
        title: "Spotlight",
        where: "Trends in Cognitive Sciences",
        authors: "Sashank Pisupati, Lital Chartarifsky, & Anne K. Churchland",
        link: "http://www.cell.com/trends/cognitive-sciences/fulltext/S1364-6613(16)30148-6"
      },
      {
        title: "Faculty of 1000 (F1000Prime) entry",
        authors: "Daeyeol Lee",
        link: "http://f1000.com/prime/726482747"
      },
      {
        title: "Research Highlight",
        where: "Nature Reviews Neuroscience",
        link: "http://www.nature.com/nrn/journal/vaop/ncurrent/full/nrn.2016.108.html"
      },
      {
        title: "Relevant review article",
        where: "Current Opinion in Neurobiology",
        authors: "Carlos Brody & Tim Hanks",
        link: "http://www.sciencedirect.com/science/article/pii/S0959438816000040"
      }
    ]
  },
  {
    authors: "KW Latimer, JL Yates, MM Meister, AC Huk, and JW Pillow",
    year: 2016,
    title: "Response to comment on \u201Csingle-trial spike trains in parietal cortex reveal\ndiscrete steps during decision-making\u201D",
    journal: "Science",
    page: "351(6280):1406",
    link: "http://science.sciencemag.org/content/351/6280/1406.3.long"
  },
  {
    authors: "KW Latimer, JL Yates, MM Meister, AC Huk, and JW Pillow",
    year: 2015,
    title: "Single-trial spike trains in parietal cortex reveal discrete steps during\ndecision-making",
    journal: "Science",
    page: "349(6244), 184-187",
    link: "http://www.sciencemag.org/content/349/6244/184.abstract"
  },
  {
    authors: "K Bonnen, J Burge, JL Yates, JW Pillow, LK Cormack",
    year: 2015,
    title: "Continuous Psychophysics: Target-tracking to Measure Visual Sensitivity",
    journal: "Journal of Vision",
    page: "15(3), 14",
    link: "bonnen15JOVKalmantracking",
    pdf: true
  },
  {
    authors: "JM Ales, JL Yates, AM Norcia",
    year: 2010,
    title: "V1 is not uniquely identified by polarity reversals of responses to upper\nand lower visual field stimuli",
    journal: "Neuroimage",
    page: "52(4), 1401-1409",
    link: "ales2010NeuroImage",
    pdf: true
  }
];
var Publication_svelte_svelte_type_style_lang = "";
const css = {
  code: ".header.svelte-5hc0i5.svelte-5hc0i5{color:var(--tc);font-weight:700;text-decoration:none}a.svelte-5hc0i5.svelte-5hc0i5:visited{color:inherit}.link-out.svelte-5hc0i5.svelte-5hc0i5{color:var(--grey1);display:inline-block;vertical-align:top}.link-out.svelte-5hc0i5 svg.svelte-5hc0i5{margin-bottom:-.18em;width:1em}",
  map: null
};
const Publication = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { link } = $$props;
  let { title } = $$props;
  let { authors } = $$props;
  let { journal } = $$props;
  let { year = "" } = $$props;
  let { page = "" } = $$props;
  let { highlights } = $$props;
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.authors === void 0 && $$bindings.authors && authors !== void 0)
    $$bindings.authors(authors);
  if ($$props.journal === void 0 && $$bindings.journal && journal !== void 0)
    $$bindings.journal(journal);
  if ($$props.year === void 0 && $$bindings.year && year !== void 0)
    $$bindings.year(year);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.highlights === void 0 && $$bindings.highlights && highlights !== void 0)
    $$bindings.highlights(highlights);
  $$result.css.add(css);
  return `<div class="${"publication bg-white py-10 px-14 shadow-lg shadow-blue-50 hover:shadow-blue-100 transition-all transform hover:-translate-y-1"}"><header><a${add_attribute("href", link, 0)} class="${"header block svelte-5hc0i5"}"><h3 class="${"mt-0 mb-0"}">${escape(title)}
        <div class="${"link-out svelte-5hc0i5"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" width="${"24"}" height="${"24"}" viewBox="${"0 0 24 24"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"svelte-5hc0i5"}"><line x1="${"7"}" y1="${"17"}" x2="${"17"}" y2="${"7"}"></line><polyline points="${"7 7 17 7 17 17"}"></polyline></svg></div></h3></a></header>
  <div class="${"mt-6 space-x-2 flex flex-wrap items-center"}">${each(authors.split(",").map((d) => d.trim()), (author) => `<div class="${[
    "py-1 px-3 bg-slate-50 text-slate-500 font-mono text-sm rounded-full mt-3",
    (["JL Yates", "JL Yates*"].includes(author) ? "text-sky-500" : "") + " " + (["JL Yates", "JL Yates*"].includes(author) ? "bg-sky-50" : "")
  ].join(" ").trim()}">${escape(author)}
      </div>`)}</div>
  <div class="${"flex flex-col md:flex-row md:justify-between md:items-center mt-4 md:mt-5 flex-wrap text-gray-500"}"><div><span class="${"font-bold text-gray-500"}">${escape(journal)}</span>
      <span class="${"font-thin font-mono text-sm ml-2"}">${escape(year)}</span></div>
    <div class="${"ml-auto font-thin font-mono text-sm mt-1 md:mt-0"}">${escape(page)}</div></div>
  ${highlights ? `<div class="${""}">${each(highlights, ({ title: title2, where, authors: authors2, link: link2 }) => `<div class="${"flex flex-col md:flex-row md:justify-between md:items-center mt-6 md:mt-3"}"><a${add_attribute("href", link2, 0)} class="${"text-gray-500 hover:underline leading-5 svelte-5hc0i5"}">${escape(title2)}
            ${where ? `in
              <i>${escape(where)}</i>` : ``}</a>
          <div class="${"text-gray-500 text-sm md:text-left mt-2 md:mt-0"}">${escape(authors2 || "")}</div>
        </div>`)}</div>` : ``}
</div>`;
});
export { Publication as P, publications as p };
