// Messages clés par période de la vie (ANSES 2019, Santé publique France, HAS 2021).
// `href` : page détaillée si elle existe.

export interface Profil {
  id: string;
  label: string;
  age: string;
  points: string[];
  href?: string;
  /** Libellé de l'action vers la page détaillée */
  cta?: string;
}

export const PROFILS: Profil[] = [
  {
    id: "bebe",
    label: "Bébé",
    age: "0 à 3 ans",
    points: [
      "Allaitement seul conseillé jusqu'à 6 mois.",
      "Diversification entre 4 et 6 mois, allergènes compris.",
      "Pas de miel, de sel ni de sucre ajouté avant 1 an.",
    ],
  },
  {
    id: "enfant",
    label: "Enfant",
    age: "4 à 17 ans",
    points: [
      "Moins de boissons et de produits sucrés.",
      "Calcium et fer : besoins élevés à l'adolescence.",
      "Bouger au moins 60 minutes par jour.",
    ],
    href: "/ages/enfants",
    cta: "Lire la page enfants",
  },
  {
    id: "adulte",
    label: "Adulte",
    age: "18 à 64 ans",
    points: [
      "Plus de végétal : fruits, légumes, légumineuses.",
      "Moins de viande rouge, de charcuterie et de sel.",
      "30 minutes d'activité physique par jour.",
    ],
    href: "/bases/assiette",
    cta: "Composer mon assiette",
  },
  {
    id: "grossesse",
    label: "Grossesse",
    age: "Avant, pendant, après",
    points: [
      "Acide folique (vitamine B9) dès le projet de grossesse.",
      "Zéro alcool pendant toute la grossesse.",
      "Pas de fromage au lait cru, ni de poisson cru ou fumé.",
    ],
    href: "/ages/grossesse",
    cta: "Lire la page grossesse",
  },
  {
    id: "senior",
    label: "Senior",
    age: "65 ans et plus",
    points: [
      "Les besoins ne baissent pas, l'appétit si.",
      "Au moins 1 g de protéines par kg et par jour.",
      "Boire régulièrement, sans attendre la soif.",
    ],
    href: "/ages/seniors",
    cta: "Lire la page seniors",
  },
];
