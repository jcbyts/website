<script>
  import { dev } from '$app/environment';
  import { timeFormat } from "d3-time-format";
  import { onMount } from 'svelte';

  export let data
  const {title, slug, url, draft, date, layout="default", Content} = data

  $: isFullWidth = layout === "full-width";
  const formatDate = timeFormat("%b %e, %Y");

  // Enhanced mobile math equation handling
  onMount(() => {
    // Add scroll indicators for overflowing math equations
    const mathElements = document.querySelectorAll('.katex-display');

    mathElements.forEach(element => {
      // Check if the math equation is wider than its container
      const isOverflowing = element.scrollWidth > element.clientWidth;

      if (isOverflowing) {
        // Add a class to indicate this equation is scrollable
        element.classList.add('math-scrollable');

        // Add scroll event listener to show/hide scroll indicators
        let scrollTimeout;
        element.addEventListener('scroll', () => {
          element.classList.add('math-scrolling');

          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            element.classList.remove('math-scrolling');
          }, 1000);
        });
      }
    });

    // Add touch-friendly scroll hints for mobile
    if (window.innerWidth <= 768) {
      mathElements.forEach(element => {
        if (element.scrollWidth > element.clientWidth) {
          // Create a subtle hint that the equation is scrollable
          const hint = document.createElement('div');
          hint.className = 'math-scroll-hint';
          hint.innerHTML = '← Scroll to see full equation →';
          hint.style.cssText = `
            font-size: 0.75em;
            color: #64748b;
            text-align: center;
            margin-top: 0.5em;
            opacity: 0.7;
            font-family: Inter, sans-serif;
          `;

          element.parentNode.insertBefore(hint, element.nextSibling);

          // Hide hint after user scrolls
          element.addEventListener('scroll', () => {
            hint.style.opacity = '0.3';
          }, { once: true });
        }
      });
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://jake.vision/blog/{slug}"
  />
</svelte:head>

<h1 class="mb-0">{title}</h1>
<div class="mt-5 font-sans text-gray-500">
  {formatDate(new Date(date))}
</div>

<div class="content mt-10 -mx-14 font-serif" class:breakout={isFullWidth}>
  <div
    class="bg-white py-16 px-14 shadow-2xl shadow-blue-50 {isFullWidth
      ? 'mx-[2em]'
      : ''}"
  >
    {#if draft && dev}
      <blockquote>
        This is a draft and won't show up on the index page.
      </blockquote>
    {/if}
    <Content />
  </div>
</div>