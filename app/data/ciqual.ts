// Extrait de la table CIQUAL 2020 (ANSES), valeurs pour 100 g, vérifiées le 2 novembre 2026
// sur le fichier officiel XML_2020_07_07. Chaque aliment garde son code CIQUAL pour pouvoir
// retrouver la ligne d'origine. Méthode et tableau de contrôle : docs/donnees-ciqual.md.
// Licence Ouverte Etalab 2.0 : la mention « CIQUAL, ANSES » est obligatoire.
// `null` = teneur non mesurée dans CIQUAL (on ne l'invente pas).

export interface AlimentCiqual {
  code: number;
  nom: string;
  /** g/100 g, protéines N × facteur de Jones */
  proteines?: number;
  /** g/100 g, sucres totaux */
  sucres?: number;
  /** g/100 g, fibres alimentaires */
  fibres?: number | null;
  /** mg/100 g */
  fer?: number;
  /** mg/100 g */
  calcium?: number;
  /** g/100 g, acides gras saturés */
  ags?: number;
  /** g/100 g */
  eau?: number;
}

export const CIQUAL = {
  // Protéines
  steakHache5Cuit: { code: 6251, nom: "Bœuf, steak haché 5 % MG, cuit", proteines: 25.5, fer: 2.83, fibres: 0, ags: 2.67 },
  pouletFiletPoele: { code: 36018, nom: "Poulet, filet sans peau, poêlé", proteines: 30.1, fer: 0.39, fibres: 0, ags: 0.58 },
  oeufDur: { code: 22010, nom: "Œuf dur", proteines: 13.5, fer: 1.72, fibres: 0, ags: 2.55 },
  tofu: { code: 20904, nom: "Tofu nature", proteines: 13.4, fer: 2.4, fibres: null, ags: 1.35 },
  lentillesVertesCuites: { code: 20587, nom: "Lentilles vertes cuites", proteines: 10.1, fer: 2.45, fibres: 8.45, ags: 0.093 },
  poisChichesCuits: { code: 20507, nom: "Pois chiches cuits", proteines: 8.31, fer: 1.3, fibres: 8.2, ags: 0.46 },
  haricotsRougesCuits: { code: 20503, nom: "Haricots rouges cuits", proteines: 9.63, fibres: 11.6 },
  emmental: { code: 12115, nom: "Emmental", proteines: 27.9, calcium: 898 },
  amandes: { code: 15000, nom: "Amandes avec peau", proteines: 18.8, fibres: 12.5 },

  // Féculents
  painComplet: { code: 7110, nom: "Pain complet (T150)", proteines: 8.38, fibres: 6.9, sucres: 2.2 },
  baguette: { code: 7001, nom: "Baguette courante", proteines: 8.27, fibres: 2.7, sucres: 2.3, eau: 27.5 },
  painDeMie: { code: 7200, nom: "Pain de mie courant", sucres: 7.8, fibres: 1.8 },
  painAuLait: { code: 7711, nom: "Pain au lait préemballé", sucres: 11.9 },
  rizBlancCuit: { code: 9104, nom: "Riz blanc cuit", proteines: 2.92, fibres: 0.8 },
  patesCuites: { code: 9811, nom: "Pâtes cuites", fibres: 1.9, eau: 68.3 },
  patesCompletesCuites: { code: 9871, nom: "Pâtes complètes cuites", fibres: 3.3 },
  floconsAvoine: { code: 9311, nom: "Flocons d'avoine", fibres: 10.2, sucres: 0.97 },
  cerealesChocolatees: { code: 32001, nom: "Céréales du petit-déjeuner chocolatées", sucres: 26.2, fibres: 6.7 },
  biscuitSec: { code: 24001, nom: "Biscuit sec nature", sucres: 23.6 },

  // Fruits et légumes
  pomme: { code: 13039, nom: "Pomme crue", sucres: 9.35, fibres: 1.4, eau: 85.4 },
  banane: { code: 13005, nom: "Banane crue", sucres: 15.6, fibres: 2.7 },
  orange: { code: 13034, nom: "Orange crue", eau: 87.3 },
  framboise: { code: 13015, nom: "Framboises crues", fibres: 4.3 },
  pasteque: { code: 13036, nom: "Pastèque crue", eau: 91 },
  compotePomme: { code: 13038, nom: "Compote de pomme", sucres: 20.7 },
  carotteCrue: { code: 20009, nom: "Carotte crue", fibres: 2.7 },
  haricotsVertsCuits: { code: 20030, nom: "Haricots verts cuits", fibres: 4 },
  brocoliVapeur: { code: 20304, nom: "Brocoli cuit vapeur", fibres: 2.2 },
  concombre: { code: 20019, nom: "Concombre cru", eau: 96 },
  courgetteCrue: { code: 20020, nom: "Courgette crue", eau: 94.7 },
  tomate: { code: 20047, nom: "Tomate crue", eau: 94.1 },

  // Produits laitiers
  yaourtNature: { code: 19593, nom: "Yaourt nature", proteines: 3.96, sucres: 2.65, eau: 88.6 },
  yaourtFruitsSucre: { code: 19587, nom: "Yaourt aux fruits sucré", sucres: 13.6 },
  laitDemiEcreme: { code: 19041, nom: "Lait demi-écrémé", sucres: 4.66, eau: 89.4, calcium: 117 },

  // Produits sucrés et sauces
  chocolatLait: { code: 31004, nom: "Chocolat au lait", sucres: 53.1 },
  barreChocolatee: { code: 31001, nom: "Barre chocolatée enrobée", sucres: 60.5 },
  pateATartiner: { code: 31032, nom: "Pâte à tartiner chocolat noisette", sucres: 56.2 },
  ketchup: { code: 11008, nom: "Ketchup", sucres: 20.8 },
  sauceTomate: { code: 11107, nom: "Sauce tomate préemballée", sucres: 5.44 },

  // Boissons (100 g ≈ 100 ml)
  eauRobinet: { code: 18066, nom: "Eau du robinet", sucres: 0 },
  the: { code: 18020, nom: "Thé infusé non sucré", sucres: 0 },
  cola: { code: 18018, nom: "Cola sucré", sucres: 10.2 },
  colaEdulcore: { code: 18060, nom: "Cola avec édulcorants", sucres: 0.11 },
  jusOrange: { code: 2070, nom: "Jus d'orange pur jus", sucres: 9.61 },
  nectar: { code: 2061, nom: "Nectar multifruit", sucres: 11 },
  boissonEnergisante: { code: 18352, nom: "Boisson énergisante sucrée", sucres: 11.7 },
} satisfies Record<string, AlimentCiqual>;

export type CleCiqual = keyof typeof CIQUAL;

/** Quantité d'un nutriment dans une portion (en grammes d'aliment) */
export function pourPortion(aliment: AlimentCiqual, nutriment: keyof AlimentCiqual, grammes: number) {
  const v = aliment[nutriment];
  return typeof v === "number" ? (v * grammes) / 100 : 0;
}

/** Arrondi d'affichage : 1 décimale sous 10, entier au-delà */
export function arrondi(n: number) {
  return n < 10 ? Math.round(n * 10) / 10 : Math.round(n);
}
