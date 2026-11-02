import type { Config } from "@react-router/dev/config";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

// Les fiches « Apprendre » partagent une route /apprendre/:id : on liste leurs adresses pour le pré-rendu
const fiches = parse(readFileSync("content/fiches/bases.yaml", "utf8")).fiches as { id: string }[];

// Site 100 % statique : chaque route est pré-rendue en HTML au build.
// BASE_PATH : sous-chemin de publication, par ex. "/nutrinfo/" sur GitHub Pages (doit finir par /).
export default {
  ssr: false,
  prerender: ({ getStaticPaths }) => [...getStaticPaths(), ...fiches.map((f) => `/apprendre/${f.id}`)],
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
