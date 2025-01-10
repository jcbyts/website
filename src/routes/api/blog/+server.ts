import { json } from '@sveltejs/kit';

export const GET = async () => {
	const allPosts = await fetchMarkdownPosts();

	const sortedPosts = allPosts.sort((a, b) => {
		return +new Date(b.metadata.date) - +new Date(a.metadata.date);
	});

	return json(sortedPosts);
};

const fetchMarkdownPosts = async () => {
	const allPostFiles = import.meta.glob('/src/routes/blog/*.svx');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = (await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const postPath = path.slice(11, -4);
			const slug = postPath.split('/').slice(-1)[0];

			return {
				metadata,
				path: postPath,
				slug
			};
		})
	))

	return allPosts;
};
