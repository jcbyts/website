<script>
  export let cards = [
    {
      label: "PATH ONE",
      title: "Science as Optimization",
      subtitle: "Let AI solve problems through data-driven optimization and pattern recognition",
      href: "#path-one-science-as-optimization",
      active: true
    },
    {
      label: "PATH TWO",
      title: "AI-driven Discovery",
      subtitle: "AI leads the way in generating new theoretical discoveries and paradigm shifts",
      href: "#path-two-ai-driven-discovery"
    },
    {
      label: "PATH THREE",
      title: "AI as Thinking Partner",
      subtitle: "Use AI as a collaborative tool to enhance human scientific thinking",
      href: "#path-three-ai-as-a-thinking-partner"
    }
  ];
</script>

<div class="cards-container">
  {#each cards as card, i}
    <a href={card.href} class="card" class:active={i === 0}>
      <h6 class="card-label">{card.label}</h6>
      <h3 class="card-title font-sans">{card.title}</h3>
      <p class="card-subtitle font-sans">{card.subtitle}</p>
    </a>
  {/each}
</div>

<style>
  .cards-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    padding: 0;
  }

  .card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    margin: -1px;
    padding: 3.75rem var(--article-padding-x) var(--article-padding-x);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: all 0.15s ease;
    position: relative;
    border-right: 1px solid #e5e7eb;
  }

  .card-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .card-title {
    font-size: 1.0625rem;
    font-weight: 500;
    margin: 0 0 0.625rem 0;
    color: #111827;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .card-subtitle {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #6b7280;
    margin: 0;
    flex-grow: 1;
  }

  /* Tablet and Mobile */
  @media (max-width: 1024px) {
    .cards-container {
      grid-template-columns: 1fr;
    }

    .card {
      min-height: auto;
    }

    .card::after {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .cards-container {
      margin: 2rem 0;
    }

  }
</style>
