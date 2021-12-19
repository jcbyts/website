const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/example-markdown.md"),
	() => import("../../../src/routes/publications.svelte"),
	() => import("../../../src/routes/blog/__layout.svelte"),
	() => import("../../../src/routes/blog/foodservice-academia.svx"),
	() => import("../../../src/routes/blog/motion-illusions.svx"),
	() => import("../../../src/routes/blog/matlab-arduino.svx"),
	() => import("../../../src/routes/blog/noisy-better.svx"),
	() => import("../../../src/routes/blog/lurz-paper.svx"),
	() => import("../../../src/routes/blog.svelte"),
	() => import("../../../src/routes/cv.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/example-markdown.md
	[/^\/example-markdown\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/publications.svelte
	[/^\/publications\/?$/, [c[0], c[4]], [c[1]]],

	,

	,

	// src/routes/blog/foodservice-academia.svx
	[/^\/blog\/foodservice-academia\/?$/, [c[0], c[5], c[6]], [c[1]]],

	// src/routes/blog/motion-illusions.svx
	[/^\/blog\/motion-illusions\/?$/, [c[0], c[5], c[7]], [c[1]]],

	// src/routes/blog/matlab-arduino.svx
	[/^\/blog\/matlab-arduino\/?$/, [c[0], c[5], c[8]], [c[1]]],

	// src/routes/blog/noisy-better.svx
	[/^\/blog\/noisy-better\/?$/, [c[0], c[5], c[9]], [c[1]]],

	// src/routes/blog/lurz-paper.svx
	[/^\/blog\/lurz-paper\/?$/, [c[0], c[5], c[10]], [c[1]]],

	// src/routes/blog.svelte
	[/^\/blog\/?$/, [c[0], c[11]], [c[1]]],

	// src/routes/cv.svelte
	[/^\/cv\/?$/, [c[0], c[12]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];