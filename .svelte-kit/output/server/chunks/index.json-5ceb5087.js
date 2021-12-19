async function get() {
  const pages = await Promise.all(Object.entries({ "/src/routes/blog/foodservice-academia.svx": () => import("./foodservice-academia-d635871d.js"), "/src/routes/blog/lurz-paper.svx": () => import("./lurz-paper-e6887306.js"), "/src/routes/blog/matlab-arduino.svx": () => import("./matlab-arduino-78a91bba.js"), "/src/routes/blog/motion-illusions.svx": () => import("./motion-illusions-d12aa38b.js"), "/src/routes/blog/noisy-better.svx": () => import("./noisy-better-f2ca926f.js") }).map(async ([path, page]) => {
    const filename = path.split("/").pop();
    const slug = filename.replace(/\.svx$/, "");
    try {
      const { metadata } = await page();
      return { ...metadata, filename, slug };
    } catch (e) {
      console.log("issue loading blog post", filename, e.loc);
      return { filename };
    }
  }));
  return {
    body: pages.sort((a, b) => new Date(b.date) - new Date(a.date))
  };
}
export { get };
