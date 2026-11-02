// Options fixées au moment du build par des variables d'environnement (voir README, « Publier »).
// Vite remplace import.meta.env.VITE_* par leur valeur : le code désactivé disparaît du bundle.

/** Assistant IA (Claude via le Worker Cloudflare). `VITE_ASSISTANT=off` le retire du site. */
export const assistantActif = import.meta.env.VITE_ASSISTANT !== "off";

/** Hébergeur, cité dans la page Données personnelles. `VITE_HEBERGEUR=github` pour GitHub Pages. */
export const hebergeur: "cloudflare" | "github" = import.meta.env.VITE_HEBERGEUR === "github" ? "github" : "cloudflare";
