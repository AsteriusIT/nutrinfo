// Plan du site : une seule source pour le menu de l'en-tête et le pied de page.
// Pour ajouter une page au menu, ajoutez un lien dans la bonne rubrique.
import { bases } from "./content";
import type { ThemeKey } from "./theme";

export interface NavLien {
  href: string;
  label: string;
  description: string;
  theme: ThemeKey;
}

export interface NavRubrique {
  id: string;
  label: string;
  intro: string;
  /** Page d'accueil de la rubrique */
  accueil: { href: string; label: string };
  liens: NavLien[];
}

export const NAVIGATION: NavRubrique[] = [
  {
    id: "apprendre",
    label: "Apprendre",
    intro: "Les bases de la nutrition en fiches courtes : c'est quoi une protéine, un glucide, une calorie ?",
    accueil: { href: "/apprendre", label: "Toutes les fiches" },
    liens: bases.map((f) => ({ href: `/apprendre/${f.id}`, label: f.court, description: f.question, theme: f.theme })),
  },
  {
    id: "bien-manger",
    label: "Bien manger",
    intro: "Des repères concrets et des outils pour composer ses repas.",
    accueil: { href: "/bases/assiette", label: "Composer son assiette" },
    liens: [
      { href: "/bases/assiette", label: "Composer son assiette", description: "Remplissez une assiette équilibrée.", theme: "veg" },
      {
        href: "/nutriments/proteines/animales-vs-vegetales",
        label: "Protéines animales ou végétales",
        description: "Comparer, calculer son besoin.",
        theme: "prot",
      },
      { href: "/nutriments/glucides", label: "Glucides, sucres et fibres", description: "Où se cache le sucre ?", theme: "carb" },
      { href: "/nutriments/eau", label: "Bien s'hydrater", description: "Combien et quoi boire.", theme: "water" },
      {
        href: "/nutriments/vitamines-et-mineraux",
        label: "Vitamines et minéraux",
        description: "Rôle, besoin et sources de chacun.",
        theme: "dairy",
      },
    ],
  },
  {
    id: "ages",
    label: "Selon mon âge",
    intro: "Ce qui change à chaque étape de la vie.",
    accueil: { href: "/ages", label: "Vue d'ensemble" },
    liens: [
      { href: "/ages/enfants", label: "Enfants et ados", description: "De 4 à 17 ans.", theme: "age" },
      { href: "/ages/grossesse", label: "Grossesse", description: "Avant, pendant, après.", theme: "age" },
      { href: "/ages/seniors", label: "Seniors", description: "Après 65 ans.", theme: "age" },
    ],
  },
];

/** La rubrique qui contient la page courante, pour la mettre en avant dans le menu */
export function rubriqueActive(pathname: string): string | undefined {
  const path = pathname.replace(/\/$/, "") || "/";
  return NAVIGATION.find((r) => [r.accueil.href, ...r.liens.map((l) => l.href)].some((h) => path === h || path.startsWith(`${h}/`)))?.id;
}
