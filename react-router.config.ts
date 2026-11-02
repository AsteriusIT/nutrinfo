import type { Config } from "@react-router/dev/config";

// Site 100 % statique : chaque route est pré-rendue en HTML au build.
// BASE_PATH : sous-chemin de publication, par ex. "/asterius-nutrition/" sur GitHub Pages (doit finir par /).
export default {
  ssr: false,
  prerender: true,
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
