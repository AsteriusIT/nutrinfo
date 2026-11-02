import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { defineConfig, type Plugin } from "vite";

// Les fichiers YAML de content/ deviennent des modules JSON au build :
// aucun parseur YAML n'est envoyé au navigateur.
const yamlData = (): Plugin => ({
  name: "yaml-data",
  transform(code, id) {
    if (!id.endsWith(".yaml")) return null;
    return { code: `export default ${JSON.stringify(parseYaml(code))};`, map: null };
  },
});

export default defineConfig({
  plugins: [
    tailwindcss(),
    yamlData(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        providerImportSource: undefined,
      }),
    },
    reactRouter(),
  ],
  resolve: {
    // Alias explicites : nécessaires pour les fichiers MDX hors de app/
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@content": fileURLToPath(new URL("./content", import.meta.url)),
    },
  },
});
