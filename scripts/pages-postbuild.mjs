// Prépare build/pages/ pour GitHub Pages, après `react-router build` (script npm build:pages).
//
// Avec BASE_PATH="/depot/", React Router écrit les pages pré-rendues dans build/client/depot/
// et la coquille SPA dans build/client/index.html. GitHub Pages sert déjà le site sous /depot/ :
// on recompose donc la racine du site (pages + assets + fichiers de public/) dans build/pages/.
import { cp, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const client = fileURLToPath(new URL("../build/client/", import.meta.url));
const pages = fileURLToPath(new URL("../build/pages/", import.meta.url));
const sub = (process.env.BASE_PATH ?? "/").split("/").filter(Boolean).join("/");

await rm(pages, { recursive: true, force: true });

let fallback;
if (sub) {
  await cp(`${client}${sub}`, pages, { recursive: true });
  const autres = (await readdir(client)).filter((entry) => entry !== sub && entry !== "index.html");
  await Promise.all(autres.map((entry) => cp(`${client}${entry}`, `${pages}${entry}`, { recursive: true })));
  fallback = `${client}index.html`;
} else {
  await cp(client, pages, { recursive: true });
  fallback = `${client}__spa-fallback.html`;
}

// GitHub Pages sert 404.html pour toute adresse inconnue : la coquille SPA charge alors
// React Router, qui affiche la route « * » (page introuvable) du site.
await cp(fallback, `${pages}404.html`);

// Sans ce fichier, Jekyll ignorerait les fichiers qui commencent par « _ »
await writeFile(`${pages}.nojekyll`, "");

console.log(`GitHub Pages : site prêt dans build/pages/ (sous-chemin « /${sub} »)`);
