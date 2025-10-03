<script>
  import { fly } from "svelte/transition";
  import { timeFormat } from "d3-time-format";
  import { onMount } from "svelte";

  export let title = "What I'm thinking about...";
  export let count = 3;

  let posts = [];
  const formatDate = timeFormat("%b %e, %Y");

  onMount(async () => {
    try {
      const response = await fetch('/api/blog');
      const allPosts = await response.json();
      
      // Filter out drafts and get the latest posts
      posts = allPosts
        .filter(post => !post.metadata.draft && post.slug)
        .sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date))
        .slice(0, count)
        .map(post => ({
          slug: post.slug,
          title: post.metadata.title,
          date: post.metadata.date,
          description: post.metadata.description
        }));
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  });
</script>

<div class="space-y-12 -mx-2 md:-mx-14">
  {#each posts as post, i (post.slug)}
    <div in:fly|global={{ x: -30, delay: i * 200 }}>
      <article
        class="bg-white flex flex-col py-6 md:py-10 px-3 md:px-14 shadow-lg shadow-stone-50"
      >
        <header class="flex flex-col">
          <a href="/blog/{post.slug}">
            <h3 class="mt-5 !mb-1 text-stone-900 hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
          </a>
          <small class="font-sans text-stone-500 text-sm">
            {formatDate(new Date(post.date))}
          </small>
        </header>
        {#if post.description}
          <section class="mt-5 text-lg">
            <p>{post.description}</p>
          </section>
        {/if}
      </article>
    </div>
  {/each}
</div>
