// Correspondance famille d'aliment → classes Tailwind.
// Les noms de classes sont écrits en entier pour que Tailwind les détecte.

export type ThemeKey = "veg" | "carb" | "prot" | "dairy" | "fat" | "water" | "age" | "tool";

type Theme = {
  label: string;
  bg100: string;
  bg500: string;
  /** Couleur de texte lisible posée sur l'aplat 500 */
  on500: string;
  text800: string;
  border500: string;
  /** Variables CSS utilisées par .prose-carre (puces) */
  vars: React.CSSProperties;
};

const v = (k: ThemeKey) =>
  ({ "--theme-100": `var(--color-${k}-100)`, "--theme-500": `var(--color-${k}-500)` }) as React.CSSProperties;

export const themes: Record<ThemeKey, Theme> = {
  veg: { label: "Légumes et fruits", bg100: "bg-veg-100", bg500: "bg-veg-500", on500: "text-dark", text800: "text-veg-800", border500: "border-veg-500", vars: v("veg") },
  carb: { label: "Féculents", bg100: "bg-carb-100", bg500: "bg-carb-500", on500: "text-dark", text800: "text-carb-800", border500: "border-carb-500", vars: v("carb") },
  prot: { label: "Protéines", bg100: "bg-prot-100", bg500: "bg-prot-500", on500: "text-light", text800: "text-prot-800", border500: "border-prot-500", vars: v("prot") },
  dairy: { label: "Produits laitiers", bg100: "bg-dairy-100", bg500: "bg-dairy-500", on500: "text-light", text800: "text-dairy-800", border500: "border-dairy-500", vars: v("dairy") },
  fat: { label: "Matières grasses", bg100: "bg-fat-100", bg500: "bg-fat-500", on500: "text-dark", text800: "text-fat-800", border500: "border-fat-500", vars: v("fat") },
  water: { label: "Eau", bg100: "bg-water-100", bg500: "bg-water-500", on500: "text-dark", text800: "text-water-800", border500: "border-water-500", vars: v("water") },
  age: { label: "Âges de la vie", bg100: "bg-age-100", bg500: "bg-age-500", on500: "text-light", text800: "text-age-800", border500: "border-age-500", vars: v("age") },
  tool: { label: "Outils", bg100: "bg-tool-100", bg500: "bg-tool-500", on500: "text-dark", text800: "text-tool-800", border500: "border-tool-500", vars: v("tool") },
};
