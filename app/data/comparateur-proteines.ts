// Données du comparateur — pour 100 g d'aliment prêt à consommer.
// Composition : CIQUAL 2020 (voir ciqual.ts). Climat : Agribalyse 3.1 (ADEME), indicateur
// « Changement climatique » en kg CO₂e par kg, même code aliment que CIQUAL.
// Valeurs vérifiées le 2 novembre 2026 : docs/donnees-ciqual.md.
import { CIQUAL, type AlimentCiqual } from "./ciqual";

export type MetriqueKey = "proteines" | "fer" | "fibres" | "ags" | "climat";

export interface AlimentCompare {
  nom: string;
  origine: "animal" | "vegetal";
  code: number;
  proteines: number;
  fer: number;
  /** null : non mesuré dans CIQUAL */
  fibres: number | null;
  ags: number;
  climat: number;
}

export const metriques: Record<MetriqueKey, { label: string; unite: string; aide: string }> = {
  proteines: {
    label: "Protéines",
    unite: "g",
    aide: "Les aliments animaux sont plus concentrés en protéines, mais les légumineuses en apportent une quantité intéressante.",
  },
  fer: {
    label: "Fer",
    unite: "mg",
    aide: "Le fer des légumineuses est moins bien absorbé que celui de la viande : l'associer à de la vitamine C (poivron, agrumes) aide.",
  },
  fibres: {
    label: "Fibres",
    unite: "g",
    aide: "Seuls les végétaux apportent des fibres. Recommandation : 30 g par jour (ANSES).",
  },
  ags: {
    label: "Graisses saturées",
    unite: "g",
    aide: "Les acides gras saturés sont à limiter (≤ 12 % de l'énergie, ANSES).",
  },
  climat: {
    label: "Climat",
    unite: "kg CO₂e",
    aide: "Émissions de gaz à effet de serre pour 1 kg d'aliment, de la ferme à l'assiette (Agribalyse 3.1).",
  },
};

const r1 = (n: number) => Math.round(n * 10) / 10;

function depuisCiqual(a: AlimentCiqual, nom: string, origine: AlimentCompare["origine"], climat: number): AlimentCompare {
  return {
    nom,
    origine,
    code: a.code,
    proteines: r1(a.proteines ?? 0),
    fer: r1(a.fer ?? 0),
    fibres: a.fibres == null ? null : r1(a.fibres),
    ags: r1(a.ags ?? 0),
    climat,
  };
}

export const comparateurAliments: AlimentCompare[] = [
  depuisCiqual(CIQUAL.steakHache5Cuit, "Steak haché 5 % cuit", "animal", 45.2),
  depuisCiqual(CIQUAL.pouletFiletPoele, "Blanc de poulet cuit", "animal", 7.5),
  depuisCiqual(CIQUAL.oeufDur, "Œuf dur", "animal", 2.7),
  depuisCiqual(CIQUAL.tofu, "Tofu nature", "vegetal", 1),
  depuisCiqual(CIQUAL.lentillesVertesCuites, "Lentilles cuites", "vegetal", 0.5),
  depuisCiqual(CIQUAL.poisChichesCuits, "Pois chiches cuits", "vegetal", 0.6),
];
