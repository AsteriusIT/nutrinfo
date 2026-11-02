// Produits des outils « Où se cache le sucre ? » et « Le goûter ».
// Sucres totaux calculés depuis CIQUAL 2020 pour la portion indiquée (1 ml ≈ 1 g pour les boissons).
// On distingue, comme l'OMS (2015) :
//  - les sucres « naturellement présents » dans le fruit entier et le lait ;
//  - les sucres « libres » : ajoutés, ou contenus dans le miel, les sirops et les jus de fruits.

import { CIQUAL, pourPortion, type AlimentCiqual } from "./ciqual";

/** Un morceau de sucre n° 4 pèse environ 5 g */
export const G_PAR_MORCEAU = 5;
/** OMS 2015 : idéalement moins de 5 % de l'énergie en sucres libres, soit environ 25 g par jour pour un adulte */
export const REPERE_OMS_G = 25;

export type FamilleGouter = "fruit" | "laitier" | "cereale" | "sucre" | "boisson";

export interface ProduitSucre {
  id: string;
  nom: string;
  portion: string;
  /** Sucres totaux de la portion (g) */
  total: number;
  /** Part naturellement présente (fruit entier, lactose du lait), en g */
  naturels: number;
  code: number;
  note?: string;
  famille: FamilleGouter;
}

function produit(
  id: string,
  a: AlimentCiqual,
  nom: string,
  portion: string,
  grammes: number,
  famille: FamilleGouter,
  opts: { naturels?: "tout" | number; note?: string } = {},
): ProduitSucre {
  const total = pourPortion(a, "sucres", grammes);
  const naturels = opts.naturels === "tout" ? total : (opts.naturels ?? 0);
  return { id, nom, portion, total, naturels, code: a.code, note: opts.note, famille };
}

// Lactose d'un pot de yaourt de 125 g (yaourt nature) : sert à estimer la part naturelle d'un yaourt aux fruits
const LACTOSE_YAOURT = pourPortion(CIQUAL.yaourtNature, "sucres", 125);

export const PRODUITS = {
  cola: produit("cola", CIQUAL.cola, "Soda au cola", "1 canette, 33 cl", 330, "boisson"),
  colaEdulcore: produit("colaEdulcore", CIQUAL.colaEdulcore, "Cola « zéro »", "1 canette, 33 cl", 330, "boisson", {
    note: "Presque pas de sucre, mais des édulcorants : ils entretiennent le goût du sucré. Ce n'est pas une boisson à recommander tous les jours.",
  }),
  jusOrange: produit("jusOrange", CIQUAL.jusOrange, "Jus d'orange pur jus", "1 verre, 20 cl", 200, "boisson", {
    note: "Aucun sucre ajouté, mais le sucre d'un jus compte comme un sucre libre : le fruit a perdu ses fibres.",
  }),
  nectar: produit("nectar", CIQUAL.nectar, "Nectar multifruit", "1 verre, 20 cl", 200, "boisson"),
  energisante: produit("energisante", CIQUAL.boissonEnergisante, "Boisson énergisante", "1 canette, 25 cl", 250, "boisson", {
    note: "Riche en caféine : déconseillée aux enfants, aux adolescents et pendant la grossesse (ANSES).",
  }),
  eau: produit("eau", CIQUAL.eauRobinet, "Eau", "1 verre, 20 cl", 200, "boisson", {
    note: "La seule boisson indispensable.",
  }),
  the: produit("the", CIQUAL.the, "Thé sans sucre", "1 tasse, 20 cl", 200, "boisson"),
  lait: produit("lait", CIQUAL.laitDemiEcreme, "Lait demi-écrémé", "1 verre, 20 cl", 200, "laitier", {
    naturels: "tout",
    note: "C'est du lactose, le sucre naturel du lait : il ne compte pas dans les sucres libres.",
  }),
  yaourtFruits: produit("yaourtFruits", CIQUAL.yaourtFruitsSucre, "Yaourt aux fruits sucré", "1 pot, 125 g", 125, "laitier", {
    naturels: LACTOSE_YAOURT,
    note: "Environ 3 g viennent du lait. Le reste est surtout du sucre ajouté.",
  }),
  yaourtNature: produit("yaourtNature", CIQUAL.yaourtNature, "Yaourt nature", "1 pot, 125 g", 125, "laitier", {
    naturels: "tout",
    note: "Seulement le lactose du lait. Une cuillère à café de sucre ajoute environ 5 g : vous choisissez la dose.",
  }),
  cereales: produit("cereales", CIQUAL.cerealesChocolatees, "Céréales chocolatées", "1 bol, 30 g", 30, "cereale"),
  ketchup: produit("ketchup", CIQUAL.ketchup, "Ketchup", "2 cuillères à soupe, 30 g", 30, "sucre", {
    note: "Une sauce salée peut contenir beaucoup de sucre : un cinquième du ketchup est du sucre.",
  }),
  painDeMie: produit("painDeMie", CIQUAL.painDeMie, "Pain de mie", "2 tranches, 50 g", 50, "cereale", {
    note: "Une baguette en contient trois fois moins.",
  }),
  baguette: produit("baguette", CIQUAL.baguette, "Pain (baguette)", "1 morceau, 40 g", 40, "cereale"),
  painAuLait: produit("painAuLait", CIQUAL.painAuLait, "Pain au lait", "1 pain, 35 g", 35, "cereale"),
  biscuits: produit("biscuits", CIQUAL.biscuitSec, "Biscuits secs", "3 ou 4 biscuits, 30 g", 30, "cereale"),
  barre: produit("barre", CIQUAL.barreChocolatee, "Barre chocolatée", "1 barre, 50 g", 50, "sucre"),
  chocolat: produit("chocolat", CIQUAL.chocolatLait, "Chocolat au lait", "2 carrés, 10 g", 10, "sucre"),
  pateATartiner: produit("pateATartiner", CIQUAL.pateATartiner, "Pâte à tartiner", "1 cuillère à soupe, 15 g", 15, "sucre"),
  pomme: produit("pomme", CIQUAL.pomme, "Pomme", "1 pomme, 150 g", 150, "fruit", {
    naturels: "tout",
    note: "Le sucre d'un fruit entier n'est pas un sucre libre : il arrive avec les fibres et de l'eau, et rassasie.",
  }),
  banane: produit("banane", CIQUAL.banane, "Banane", "1 banane, 120 g", 120, "fruit", { naturels: "tout" }),
} satisfies Record<string, ProduitSucre>;

export type IdProduit = keyof typeof PRODUITS;
