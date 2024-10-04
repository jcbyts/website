export const load = async ({ fetch }) => {
	const response = await fetch(`/api/blog`);
	const posts = await response.json();

	const parsedPosts = posts.map(d => {
		return {
			...d.metadata,
			slug: d.slug,
		}
	})

	return {
		posts: parsedPosts
	};
};
