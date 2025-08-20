export const prerender = 'auto';

export async function load({ params }) {
	try {
		const post = await import(`../${params.slug}.svx`);
		const Content = post.default;

		// Check if this is a draft post and we're in production
		if (post.metadata?.draft && typeof window === 'undefined') {
			// During SSR/prerender, return minimal data for draft posts
			return {
				Content,
				...post.metadata,
				isDraftPrerender: true
			};
		}

		return {
			Content,
			...post.metadata
		};
	} catch (error) {
		console.error(`Failed to load blog post: ${params.slug}`, error);
		throw new Error(`Blog post "${params.slug}" not found`);
	}
}