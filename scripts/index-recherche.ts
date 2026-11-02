// Index de la recherche, construit au build à partir des contenus (module virtuel « virtual:recherche »).
// Chargé par le navigateur seulement à la première recherche.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Plugin } from "vite";
import { parse } from "yaml";
import { normaliser, slug, type TermeGlossaire } from "../app/lib/texte.ts";

export interface EntreeRecherche {
  /** reponse : un chiffre clé ; page ; section d'une page ; mot du glossaire */
  type: "reponse" | "page" | "section" | "mot";
  titre: string;
  texte: string;
  url?: string;
  chiffre?: string;
  legende?: string;
  /** Page qui contient la section */
  parent?: string;
  /** Texte normalisé dans lequel on cherche */
  cle: string;
  cleTitre: string;
}

// Pages qui ne viennent pas d'un fichier MDX
const PAGES_CODE = [
  {
    url: "/apprendre",
    titre: "Apprendre les bases",
    texte: "C'est quoi une protéine, un glucide, un lipide, une calorie ? 8 fiches courtes.",
  },
  {
    url: "/ages",
    titre: "Selon mon âge",
    texte: "Ce qui change pour les enfants, pendant la grossesse et après 65 ans.",
  },
  {
    url: "/nutriments/vitamines-et-mineraux",
    titre: "Vitamines et minéraux",
    texte: "Le rôle, le besoin et les sources de chaque vitamine et minéral.",
  },
  {
    url: "/sources",
    titre: "Nos sources et notre méthode",
    texte: "Les références officielles utilisées sur le site.",
  },
  { url: "/confidentialite", titre: "Données personnelles", texte: "Quelles données le site traite, et vos droits." },
];

const nettoyer = (md: string) =>
  md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+/g, " ")
    .trim();

const couper = (texte: string, max = 160) =>
  texte.length <= max ? texte : `${texte.slice(0, texte.lastIndexOf(" ", max))}…`;

const entree = (
  e: Omit<EntreeRecherche, "cle" | "cleTitre">,
  ...motsCles: (string | undefined)[]
): EntreeRecherche => ({
  ...e,
  cleTitre: normaliser(e.titre),
  cle: normaliser([e.titre, e.texte, e.chiffre, e.legende, e.parent, ...motsCles].filter(Boolean).join(" ")),
});

function pagesMdx(racine: string): EntreeRecherche[] {
  const dossier = join(racine, "content/pages");
  const fichiers = readdirSync(dossier, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".mdx"));
  return fichiers.flatMap((f) => {
    const source = readFileSync(join(dossier, f), "utf8");
    const [, fmBrut, corps] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
    const fm = parse(fmBrut ?? "") as { titre: string; chapeau: string; a_retenir?: string[] };
    const url = `/${relative(dossier, join(dossier, f)).replace(/\.mdx$/, "")}`;

    const page = entree({ type: "page", titre: fm.titre, texte: fm.chapeau, url }, ...(fm.a_retenir ?? []));

    // Sections : chaque titre « ## » et le premier paragraphe qui le suit
    const sections = (corps ?? "")
      .split(/^## /m)
      .slice(1)
      .map((bloc) => {
        const [titre, ...lignes] = bloc.split("\n");
        const paragraphes = lignes
          .join("\n")
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter((p) => p && !/^<|^import /.test(p));
        const premier = paragraphes.find((p) => !/^[|>#-]/.test(p));
        // On affiche le premier paragraphe, mais on cherche dans toute la section (listes, tableaux compris)
        return entree(
          {
            type: "section",
            titre: titre.trim(),
            texte: couper(nettoyer(premier ?? "")),
            url: `${url}#${slug(titre)}`,
            parent: fm.titre,
          },
          nettoyer(paragraphes.join(" ")),
        );
      });
    return [page, ...sections];
  });
}

export function construireIndex(racine: string): EntreeRecherche[] {
  const lire = <T>(chemin: string) => parse(readFileSync(join(racine, chemin), "utf8")) as T;

  const bases = lire<{
    fiches: {
      id: string;
      titre: string;
      court: string;
      question: string;
      reponse: string;
      image: string;
      roles: string[];
      sortes: { nom: string; texte: string; exemples: string }[];
      sources_alimentaires: string[];
      a_retenir: string[];
      chiffre: { valeur: string; legende: string };
    }[];
  }>("content/fiches/bases.yaml").fiches.map((f) =>
    entree(
      {
        type: "reponse",
        titre: f.question,
        texte: couper(f.reponse),
        url: `/apprendre/${f.id}`,
        chiffre: f.chiffre.valeur,
        legende: f.chiffre.legende,
      },
      // Toute la fiche est cherchable, pas seulement ce qui s'affiche dans le résultat
      f.titre,
      f.court,
      f.image,
      ...f.roles,
      ...f.sortes.flatMap((x) => [x.nom, x.texte, x.exemples]),
      ...f.sources_alimentaires,
      ...f.a_retenir,
    ),
  );

  const nutriments = lire<{
    fiches: {
      id: string;
      titre: string;
      chiffre: string;
      chiffre_note?: string;
      resume: string;
      sources_alimentaires?: string[];
    }[];
  }>("content/fiches/nutriments.yaml").fiches.map((f) =>
    entree(
      {
        type: "reponse",
        titre: f.titre,
        texte:
          f.resume +
          (f.sources_alimentaires ? ` On en trouve dans : ${f.sources_alimentaires.join(", ").toLowerCase()}.` : ""),
        url: `/nutriments/vitamines-et-mineraux#${f.id}`,
        chiffre: f.chiffre,
        legende: f.chiffre_note,
      },
      ...(f.sources_alimentaires ?? []),
    ),
  );

  const mots = lire<TermeGlossaire[]>("content/glossaire.yaml").map((t) =>
    entree({ type: "mot", titre: t.terme, texte: t.definition, url: t.voir }, ...t.formes),
  );

  const pages = [...PAGES_CODE.map((p) => entree({ type: "page", ...p })), ...pagesMdx(racine)];
  return [
    ...bases,
    ...nutriments,
    ...pages.filter((p) => p.type === "page"),
    ...pages.filter((p) => p.type === "section"),
    ...mots,
  ];
}

/** Plugin Vite : `import("virtual:recherche")` renvoie l'index, reconstruit quand un contenu change */
export function rechercheVite(racine: string): Plugin {
  const id = "virtual:recherche";
  return {
    name: "nutrinfo-recherche",
    resolveId: (source) => (source === id ? `\0${id}` : null),
    load(source) {
      if (source !== `\0${id}`) return null;
      for (const f of ["content/fiches/bases.yaml", "content/fiches/nutriments.yaml", "content/glossaire.yaml"])
        this.addWatchFile(join(racine, f));
      return `export default ${JSON.stringify(construireIndex(racine))};`;
    },
  };
}
