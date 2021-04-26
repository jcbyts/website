<script>
	import { onMount } from 'svelte';

	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';

	export let segment;

	onMount(() => {
		console.log('Hi!');
	});
</script>

<div class="container">
	<Nav {segment} />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	main {
		position: relative;
		box-sizing: border-box;
	}
	.container {
		max-width: 60em;
		margin: 0 auto;
		padding: 2.5em 2em;
	}
</style>
