import rehypeKatexSvelte from "rehype-katex-svelte";
import remarkGithub from "remark-github"
import remarkAbbr from "remark-abbr"
import remarkMath from "remark-math"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"

export default {
  extensions: [".svx", ".md"],
  smartypants: {
    dashes: "oldschool",
  },
  remarkPlugins: [
    [
      remarkGithub,
      {
        repository: "https://github.com/jcbyts/website",
      },
    ],
    remarkAbbr,
    remarkMath,
  ],
  rehypePlugins: [
    [
      rehypeAutolinkHeadings,
      {
        content: {
          type: "element",
          tagName: "span",
          properties: { className: ["heading-link"] },
          children: [],
        },
      },
    ],
    [
      rehypeKatexSvelte,
      {
        output: "html",
        displayMode: true,
      },
    ],
    rehypeSlug,
  ],
};
