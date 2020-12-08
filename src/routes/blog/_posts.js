import * as postsRaw from "glob:./*.svx";

const postNames = typeof process == "undefined" ? [] :
  require("fs").readdirSync("./src/routes/blog/")
    .filter(d => d.split(".")[1] == "svx")

const posts = Object.values(postsRaw).map(({ default: post, metadata={} }, i) => {
  return {
    ...metadata,
    slug: (postNames[i] || "").split(".")[0],
  };
});

export default posts;
