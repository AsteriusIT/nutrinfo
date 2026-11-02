import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { defineConfig, type Plugin } from "vite";
import { rechercheVite } from "./scripts/index-recherche.ts";
import { remarkNutrinfo } from "./scripts/remark-nutrinfo.ts";

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
  // Même sous-chemin que `basename` dans react-router.config.ts
  base: process.env.BASE_PATH ?? "/",
  plugins: [
    tailwindcss(),
    yamlData(),
    rechercheVite(fileURLToPath(new URL(".", import.meta.url))),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          // Ancres des titres + mots du glossaire expliqués sur place
          [remarkNutrinfo, { glossaire: fileURLToPath(new URL("./content/glossaire.yaml", import.meta.url)) }],
        ],
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
