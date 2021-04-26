module.exports = {
  extensions: [".svx", ".md"],
  smartypants: {
    dashes: "oldschool",
  },
  remarkPlugins: [
    // [
    //   require("remark-github"),
    //   {
    //     // Use your own repository
    //     repository: "https://github.com/jcbyts/website",
    //   },
    // ],
    // require("remark-abbr"),
    require("remark-math"),
  ],
  rehypePlugins: [
    // [
    //   require("rehype-autolink-headings"),
    //   {
    //     content: {
    //       type: "element",
    //       tagName: "span",
    //       properties: { className: ["heading-link"] },
    //       children: [],
    //     },
    //   },
    // ],
    [
      require("rehype-katex"),
      {
        output: "html",
        displayMode: true,
      },
    ],
    require("rehype-slug"),
  ],
};
