<script>
  export let scenarios = [
    {
      quote: "I have a nail, find me a hammer",
      content: [
        "I've identified a bespoke problem that I am a domain expert in. Search all the scientific literature to find some esoteric piece of math that solves the problem and explain it to me. This seems very doable right now. It's about building the right structures to facilitate it.",
        "Models are okay at this, but nowhere near as good as they could be with only minor changes."
      ]
    },
    {
      quote: "I have two hammers, can you combine them to build a screwdriver?",
      content: [
        "Okay, this metaphor is not great, but it shows up a lot. Not only can I articulate the problem well, but I also have identified two relevant papers that provide partial solutions. If only I could combine them."
      ]
    }
  ];
</script>

<div class="scenarios-container">
  {#each scenarios as scenario}
    <div class="scenario-card">
      <div class="scenario-quote">"{scenario.quote}"</div>
      {#each scenario.content as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
  {/each}
</div>

<style>
  .scenarios-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    margin: 2.5rem 0;
  }

  .scenario-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    margin: -1px;
    padding: var(--article-padding-x);
    position: relative;
  }

  .scenario-quote {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    /* color: #666; */
    font-style: italic;
    line-height: 1.3;
  }

  .scenario-card p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .scenario-card p:last-child {
    margin-bottom: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .scenarios-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .scenario-card {
      border: 1px solid #e5e7eb !important;
      padding: 2rem;
    }

    .scenario-quote {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 640px) {
    .scenario-card {
      padding: 1.5rem;
    }

    .scenario-quote {
      font-size: 1rem;
    }

    .scenario-card p {
      font-size: 0.9rem;
    }
  }
</style>
