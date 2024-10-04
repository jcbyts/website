export async function load({ params }) {
	const post = await import(`../${params.slug}.svx`);
	const Content = post.default;

	return {
    Content,
    ...post.metadata
	};
}