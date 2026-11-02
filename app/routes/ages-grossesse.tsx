import Content, { frontmatter } from "@content/pages/ages/grossesse.mdx";
import { pageMeta } from "~/lib/content";
import { mdxPage } from "~/lib/mdx-route";

export const meta = () => pageMeta(frontmatter);
export default mdxPage(Content, frontmatter);
