import type { MDXProps } from "mdx/types";
import { ArticleLayout } from "~/components/article-layout";
import type { PageFrontmatter } from "./content";

/** Fabrique le composant de route d'une page MDX (type 1) */
export function mdxPage(Content: (props: MDXProps) => React.JSX.Element, fm: PageFrontmatter) {
  return function Page() {
    return (
      <ArticleLayout fm={fm}>
        <Content />
      </ArticleLayout>
    );
  };
}
