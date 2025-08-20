import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		// This ensures the page gets pre-rendered even for draft posts
		return {};
	} catch (err) {
		throw error(404, `Blog post "${params.slug}" not found`);
	}
}

// Explicitly list all blog post slugs for pre-rendering
export async function entries() {
	const allPostFiles = import.meta.glob('../*.svx');
	const slugs = Object.keys(allPostFiles).map(path => {
		const slug = path.replace('../', '').replace('.svx', '');
		return { slug };
	});
	
	return slugs;
}
