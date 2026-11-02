import nutrimentsYaml from "@content/fiches/nutriments.yaml";
import sourcesYaml from "@content/sources.yaml";
import type { ThemeKey } from "./theme";

/** Métadonnées d'une page plein contenu (type 1) : voir docs/modele-contenu.md */
export interface PageFrontmatter {
  type: "page";
  titre: string;
  chapeau: string;
  theme: ThemeKey;
  rubrique: string;
  fil: { label: string; href?: string }[];
  ages?: string[];
  duree: number;
  a_retenir: string[];
  sources: string[];
  maj: string;
  relecture: "non-relu" | "relu";
}

/** Carte d'information (type 2) */
export interface Fiche {
  type?: "fiche";
  variante?: "nutriment" | "aliment" | "repere" | "vrai-faux" | "chiffre";
  id: string;
  titre: string;
  theme: ThemeKey;
  etiquette: string;
  chiffre: string;
  chiffre_note?: string;
  resume: string;
  sources_alimentaires?: string[];
  vigilance?: string[];
  source: string;
  page?: string;
  categorie: string;
}

export interface Filtre {
  id: string;
  label: string;
}

export interface Source {
  code: string;
  titre: string;
  organisme: string;
  annee: string;
  url?: string;
}

// Les YAML sont convertis en JSON au build (plugin yaml-data de vite.config.ts)
export const nutriments = nutrimentsYaml as { categories: Filtre[]; vigilances: Filtre[]; fiches: Fiche[] };
export const sources = sourcesYaml as Source[];

export function pageMeta(fm: PageFrontmatter) {
  return [
    { title: `${fm.titre} | Asterius Nutrition` },
    { name: "description", content: fm.chapeau },
  ];
}
