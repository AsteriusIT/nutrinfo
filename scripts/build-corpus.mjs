// Rassemble les contenus du site en un seul texte pour l'assistant (worker/).
// Lancé avant chaque build : une nouvelle page MDX est donc connue de l'assistant
// sans rien modifier d'autre. Sortie : worker/corpus.generated.ts (ignoré par git).
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

async function listFiles(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(ext))
    .map((e) => join(e.parentPath, e.name))
    .sort(); // ordre stable : le texte doit être identique d'un build à l'autre (cache)
}

// Les composants interactifs (<ProteinDay />…) et les imports n'ont pas de sens hors du navigateur
const stripMdx = (src) =>
  src
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line) && !/^\s*<\/?[A-Z]/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const parts = [];

const pagesDir = join(root, "content/pages");
for (const file of await listFiles(pagesDir, ".mdx")) {
  const url = "/" + relative(pagesDir, file).replace(/\.mdx$/, "");
  parts.push(`<page url="${url}">\n${stripMdx(await readFile(file, "utf8"))}\n</page>`);
}

for (const file of [
  ...(await listFiles(join(root, "content/fiches"), ".yaml")).map((f) => relative(root, f)),
  "content/glossaire.yaml",
  "content/sources.yaml",
  ...(await listFiles(join(root, "app/data"), ".ts")).map((f) => relative(root, f)),
]) {
  parts.push(`<donnees fichier="${file}">\n${(await readFile(join(root, file), "utf8")).trim()}\n</donnees>`);
}

const corpus = parts.join("\n\n");
await writeFile(
  join(root, "worker/corpus.generated.ts"),
  `// Généré par scripts/build-corpus.mjs, ne pas modifier.\nexport const corpus = ${JSON.stringify(corpus)};\n`,
);
console.log(`Corpus de l'assistant : ${parts.length} documents, ${corpus.length} caractères`);
