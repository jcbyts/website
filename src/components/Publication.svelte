<script>
  export let link;
  export let title;
  export let authors;
  export let journal;
  export let year = "";
  export let page = "";
  export let highlights;
</script>

<div
  class="publication bg-white py-10 px-14 shadow-lg shadow-blue-50 hover:shadow-blue-100 transition-all transform hover:-translate-y-1"
>
  <header>
    <a href={link} class="header block">
      <h3 class="mt-0 mb-0">
        {title}
        <div class="link-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </h3>
    </a>
  </header>
  <div class="mt-6 space-x-2 flex flex-wrap items-center">
    {#each authors.split(",").map((d) => d.trim()) as author}
      <div
        class="py-1 px-3 bg-slate-50 text-slate-500 font-mono text-sm rounded-full mt-3"
        class:text-sky-500={["JL Yates", "JL Yates*"].includes(author)}
        class:bg-sky-50={["JL Yates", "JL Yates*"].includes(author)}
      >
        {author}
      </div>
    {/each}
  </div>
  <div
    class="flex flex-col md:flex-row md:justify-between md:items-center mt-4 md:mt-5 flex-wrap text-gray-500"
  >
    <div>
      <span class="font-bold text-gray-500">{journal}</span>
      <span class="font-thin font-mono text-sm ml-2">{year}</span>
    </div>
    <div class="ml-auto font-thin font-mono text-sm mt-1 md:mt-0">{page}</div>
  </div>
  {#if highlights}
    <div class="">
      {#each highlights as { title, where, authors, link } (authors)}
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-center mt-6 md:mt-3"
        >
          <a href={link} class="text-gray-500 hover:underline leading-5">
            {title}
            {#if where}
              in
              <i>{where}</i>
            {/if}
          </a>
          <div class="text-gray-500 text-sm md:text-left mt-2 md:mt-0">
            {authors || ""}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .header {
    color: var(--tc);
    font-weight: 700;
    text-decoration: none;
  }

  a:visited {
    color: inherit;
  }

  .link-out {
    display: inline-block;
    vertical-align: top;
    color: var(--grey1);
  }

  .link-out svg {
    width: 1em;
    margin-bottom: -0.18em;
  }
</style>
