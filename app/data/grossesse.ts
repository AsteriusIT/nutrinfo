// Aliments à éviter pendant la grossesse, avec une alternative.
// Sources : Santé publique France (1000 premiers jours), ANSES 2016 (poissons), ANSES 2019, EFSA 2015 (caféine).

export interface AEviter {
  id: string;
  titre: string;
  risque: string;
  eviter: string[];
  plutot: string;
  source: string;
}

export const A_EVITER: AEviter[] = [
  {
    id: "alcool",
    titre: "Alcool",
    risque: "Toxique pour le cerveau du bébé, quelle que soit la quantité.",
    eviter: ["Vin, bière, cidre, spiritueux", "Plats cuisinés à l'alcool non évaporé"],
    plutot: "Zéro alcool pendant toute la grossesse et l'allaitement.",
    source: "SPF-1000J",
  },
  {
    id: "listeria",
    titre: "Listériose",
    risque: "Bactérie rare mais dangereuse pour le fœtus.",
    eviter: [
      "Fromages au lait cru et croûte des fromages",
      "Charcuterie à la coupe, rillettes, pâtés, foie gras",
      "Poissons fumés, crustacés décortiqués, graines germées crues",
    ],
    plutot: "Fromages pasteurisés ou à pâte cuite (comté, emmental), charcuterie cuite préemballée.",
    source: "SPF-1000J",
  },
  {
    id: "toxo",
    titre: "Toxoplasmose",
    risque: "Parasite à surveiller si vous n'êtes pas immunisée.",
    eviter: ["Viande crue, saignante, fumée ou marinée", "Crudités et herbes mal lavées"],
    plutot: "Viande bien cuite, fruits et légumes lavés soigneusement, mains lavées après le jardinage.",
    source: "SPF-1000J",
  },
  {
    id: "poissons",
    titre: "Poissons prédateurs",
    risque: "Ils accumulent le méthylmercure, nocif pour le développement du cerveau.",
    eviter: ["Espadon, marlin, siki, requin, lamproie", "Plus de 150 g par semaine de thon, bar, lotte, dorade, raie"],
    plutot: "Gardez 2 portions de poisson par semaine, dont un poisson gras peu contaminé : sardine, maquereau, hareng.",
    source: "ANSES-poissons",
  },
  {
    id: "oeufs",
    titre: "Œufs crus",
    risque: "Risque de salmonellose.",
    eviter: ["Mayonnaise, mousse au chocolat, tiramisu faits maison", "Œufs à la coque"],
    plutot: "Œufs bien cuits (jaune ferme) ou préparations industrielles pasteurisées.",
    source: "SPF-1000J",
  },
  {
    id: "foie",
    titre: "Foie",
    risque: "Trop riche en vitamine A, qui en excès est nocive pour le fœtus.",
    eviter: ["Foie de toutes les espèces", "Produits à base de foie"],
    plutot: "Viande, poisson, œufs bien cuits et légumineuses pour le fer et les protéines.",
    source: "ANSES-2019",
  },
  {
    id: "cafeine",
    titre: "Caféine",
    risque: "Passe chez le bébé ; à forte dose, associée à un poids de naissance plus faible.",
    eviter: ["Plus de 200 mg par jour (environ 2 tasses de café filtre)", "Boissons énergisantes"],
    plutot: "Café décaféiné, infusions courantes, eau.",
    source: "EFSA-cafeine",
  },
];
