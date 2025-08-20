export const prerender = false;

export async function load({ params }) {
	try {
		// Use import.meta.glob for reliable dynamic imports in production
		const modules = import.meta.glob('../*.svx');

		// Find the matching module by slug
		const modulePath = `../${params.slug}.svx`;
		const moduleLoader = modules[modulePath];

		if (!moduleLoader) {
			throw new Error(`No module found for slug: ${params.slug}`);
		}

		const post = await moduleLoader();
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