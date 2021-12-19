<script>
  import Nav from "$src/components/Nav.svelte";
  import Footer from "$src/components/Footer.svelte";
  import "./../app.css";

  export let segment;
</script>

<div class="h-5 bg-black w-full" />
<div class="container">
  <div class="main">
    <Nav {segment} />

    <main>
      <slot />
    </main>
  </div>
</div>
<Footer />

<style>
  main {
    position: relative;
  }
</style>
