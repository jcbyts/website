// Registry for complex interactive components used in blog posts
// This allows us to dynamically load heavy components without breaking SSR

// export async function loadBlogComponents(slug) {
//   const components = {};
//   const componentLoaders = BLOG_COMPONENTS[slug];
  
//   if (!componentLoaders) {
//     return components;
//   }
  
//   // Load all components for this blog post
//   for (const [name, loader] of Object.entries(componentLoaders)) {
//     try {
//       const module = await loader();
//       components[name] = module.default;
//     } catch (error) {
//       console.error(`Failed to load component ${name} for blog post ${slug}:`, error);
//       components[name] = null;
//     }
//   }
  
//   return components;
// }
