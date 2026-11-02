// Plugin remark pour les pages MDX :
// 1. donne un identifiant aux titres de niveau 2 (ancres du sommaire et de la recherche) ;
// 2. rend touchable la première apparition de chaque mot du glossaire (<Terme id="…">).
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { motifTerme, premierTerme, slug, type TermeGlossaire } from "../app/lib/texte.ts";

interface Noeud {
  type: string;
  value?: string;
  depth?: number;
  children?: Noeud[];
  data?: { hProperties?: Record<string, string> };
  [cle: string]: unknown;
}

// Là où un mot ne doit pas devenir un bouton : titres, liens, code, composants
const IGNORES = new Set([
  "heading",
  "link",
  "linkReference",
  "inlineCode",
  "code",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxjsEsm",
  "yaml",
]);

const texteDe = (n: Noeud): string => n.value ?? (n.children ?? []).map(texteDe).join("");

export function remarkNutrinfo({ glossaire }: { glossaire: string }) {
  const termes = (parse(readFileSync(glossaire, "utf8")) as TermeGlossaire[]).map((terme) => ({
    terme,
    motif: motifTerme(terme),
  }));

  return (arbre: Noeud) => {
    const dejaVus = new Set<string>();

    const parcourir = (noeud: Noeud) => {
      if (noeud.type === "heading" && noeud.depth === 2) {
        noeud.data = { ...noeud.data, hProperties: { ...noeud.data?.hProperties, id: slug(texteDe(noeud)) } };
      }
      if (IGNORES.has(noeud.type) || !noeud.children) return;

      const enfants: Noeud[] = [];
      for (const enfant of noeud.children) {
        if (enfant.type !== "text") {
          parcourir(enfant);
          enfants.push(enfant);
          continue;
        }
        // Un nœud texte peut contenir plusieurs mots : on le découpe tant qu'il en reste
        let reste = enfant.value ?? "";
        for (let trouve = premierTerme(reste, termes, dejaVus); trouve; trouve = premierTerme(reste, termes, dejaVus)) {
          dejaVus.add(trouve.id);
          if (trouve.avant) enfants.push({ type: "text", value: trouve.avant });
          enfants.push({
            type: "mdxJsxTextElement",
            name: "Terme",
            attributes: [{ type: "mdxJsxAttribute", name: "id", value: trouve.id }],
            children: [{ type: "text", value: trouve.mot }],
          });
          reste = trouve.apres;
        }
        if (reste) enfants.push({ type: "text", value: reste });
      }
      noeud.children = enfants;
    };

    parcourir(arbre);
  };
}
