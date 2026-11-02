import Content, { frontmatter } from "@content/pages/nutriments/glucides.mdx";
import { pageMeta } from "~/lib/content";
import { mdxPage } from "~/lib/mdx-route";

export const meta = () => pageMeta(frontmatter);
export default mdxPage(Content, frontmatter);
