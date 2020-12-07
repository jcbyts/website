import { slugify } from "./../../utils";

import * as postsRaw from "glob:./*.svx";

const posts = Object.values(postsRaw).map(({ default: post, metadata }) => {
  return {
    ...metadata,
    slug: slugify(metadata.title),
  };
});

export default posts;
