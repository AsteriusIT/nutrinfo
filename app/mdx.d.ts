declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { PageFrontmatter } from "~/lib/content";

  export const frontmatter: PageFrontmatter;
  export default function MDXContent(props: MDXProps): React.JSX.Element;
}

declare module "*.yaml" {
  const data: unknown;
  export default data;
}
