import Content, { frontmatter } from "@content/pages/nutriments/proteines/animales-vs-vegetales.mdx";
import { pageMeta } from "~/lib/content";
import { mdxPage } from "~/lib/mdx-route";

export const meta = () => pageMeta(frontmatter);
export default mdxPage(Content, frontmatter);
