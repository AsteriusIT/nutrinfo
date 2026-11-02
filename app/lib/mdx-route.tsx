import type { MDXProps } from "mdx/types";
import { ArticleLayout } from "~/components/article-layout";
import { Terme } from "~/components/terme";
import type { PageFrontmatter } from "./content";

/** Fabrique le composant de route d'une page MDX (type 1) */
export function mdxPage(Content: (props: MDXProps) => React.JSX.Element, fm: PageFrontmatter) {
  return function Page() {
    return (
      <ArticleLayout fm={fm}>
        {/* <Terme> est inséré par scripts/remark-nutrinfo.ts */}
        <Content components={{ Terme }} />
      </ArticleLayout>
    );
  };
}
