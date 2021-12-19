# Jacob Yates' website

Welcome! This site is built using Svelte & Sveltekit.

## Running the project

To get things up and running:

```bash
npm install # download dependencies
npm run dev # boot up that server
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.

## Deploying the project

The site reflects what's on the `master` branch.

When you push a change, Netlify will run `npm run build`. If that goes smoothly, it will update the site.

## Structure

There are two main folders at the root of our repo:

`/static`

- throw any assets you want to use in here. This includes images, fonts, and data files. These will be available at `/FILENAME.EXTENSION` (eg. `<img src="/favicon.png" />`)

`/src`

- this is where all of the code lives

Within the `/src` folder, we have some other friends:

`/assets`

`/components`

- these are all of our re-usable svelte components. If in doubt, put new features in a component in here so we can isolate that code and keep files as small & re-usable as possible

`/routes`

- any `.svelte` file in here will be turned into a page on the site. Files nested in folders will use that folder name in their url
- `index.svelte` is the root page at `/`
- files that start with an underscore are special. Eg. `$layout.svelte` contains layout code for every single page.

## I want to change copy

The best way to find where copy lives is either by:

- searching the whole repo for snippets
- going to the page (in `/routes`) for the page the copy is on, and finding the part of the page where the copy lives. This might involve going into the nested components - any DOM element that starts with a capital letter is a custom svelte component, and lives in `/components`

## I want to update the design

- on the component or page level, styles live in `<style>` tags at the bottom of a svelte component.
  - these will be scoped to the component, and won't affect anything else. Svelte does this by adding unique hashed names to each element, and adding those to CSS selectors
  - if you want to add a style for an element that isn't explicitly rendered in the HTML markup of that file (if it's in a nested component, or a dynamic html-rendered string with `@html`), you can wrap the selector in `:global()`. You'll likely want to have an un-global part of the selector to scope it to the component.
    - eg. `:global(h1)` will style _all_ `h1` elements on the site, but `.component :global(h1)` will only style `h1`s within that component
- global styles live in `/static/global.css`
- color variables live in `/static/colors.css`
