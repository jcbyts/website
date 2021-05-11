// import posts from "./_posts.js";

// const contents = JSON.stringify(posts);

export async function get() {
  const pages = await Promise.all(
    Object.entries(import.meta.glob("/src/routes/blog/*.svx")).map(
      async ([path, page]) => {
        const filename = path.split("/").pop();
        const slug = filename.replace(/\.svx$/, "");

        try {
          const { metadata } = await page();
          return { ...metadata, filename, slug };
        } catch (e) {
          console.log("issue loading blog post", filename, e);
          return { filename };
        }
      }
    )
  );

  return {
    body: pages.sort((a,b) => new Date(b.date) - new Date(a.date)),
  };
}
