import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import markdown from "@jackfranklin/rollup-plugin-markdown";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
import svg from "rollup-plugin-svg";
import json from "@rollup/plugin-json";
import dsv from "@rollup/plugin-dsv";
import sveltePreprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";

import remarkMath from "remark-math"
import remarkKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import importGlob from "@jackfranklin/rollup-plugin-import-glob";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

const preprocess = [
  mdsvex({
    remarkPlugins: [
      remarkMath,
    ],
    rehypePlugins: [
      [
        remarkKatex, {
          output: "html",
          displayMode: true
        }
      ],
      rehypeSlug,
      // [
      //   rehypeAutolinkHeadings, {
      //     properties: {
      //       className: "header-link"
      //     }
      //   }
      // ],
    ]
  }),
  sveltePreprocess({
    postcss: {
      plugins: [require("autoprefixer")],
    },
  }),
];
const extensions = [".svelte", ".svx"];

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess,
        extensions,
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),

      legacy &&
      babel({
        extensions: [".js", ".mjs", ".html", ".svelte"],
        babelHelpers: "runtime",
        exclude: ["node_modules/@babel/**"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 0.25%, not dead",
            },
          ],
        ],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          [
            "@babel/plugin-transform-runtime",
            {
              useESModules: true,
            },
          ],
        ],
      }),
      json(),
      dsv(),
      svg(),
      markdown(),
      importGlob(),

      !dev &&
      terser({
        module: true,
      }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        generate: "ssr",
        hydratable: true,
        dev,
        preprocess,
        extensions,
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      json(),
      dsv(),
      svg(),
      markdown(),
      importGlob(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
