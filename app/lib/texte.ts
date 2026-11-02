// Outils de texte partagés par le build (vite.config.ts, plugin remark, index de recherche)
// et par le navigateur. Pas d'import propre à Vite ici.

/** Ramène un texte à des minuscules sans accents, pour comparer « Féculents » et « feculent » */
export function normaliser(texte: string): string {
  // Après décomposition (NFD), les accents sont des caractères à part, de U+0300 à U+036F
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Identifiant d'ancre lisible : « Et l'alcool ? » → « et-l-alcool » */
export function slug(texte: string): string {
  return normaliser(texte)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface TermeGlossaire {
  id: string;
  terme: string;
  formes: string[];
  definition: string;
  voir?: string;
}

/** Motif qui reconnaît un mot entier, sous toutes ses formes (la plus longue d'abord) */
export function motifTerme(t: TermeGlossaire): RegExp {
  const alternatives = [...t.formes]
    .sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return new RegExp(`(?<![\\p{L}\\p{N}-])(${alternatives})(?![\\p{L}\\p{N}])`, "iu");
}

/**
 * Découpe un texte autour de la première apparition d'un mot du glossaire pas encore expliqué.
 * `dejaVus` est partagé à l'échelle de la page : chaque mot n'est expliqué qu'une fois.
 */
export function premierTerme(
  texte: string,
  termes: { terme: TermeGlossaire; motif: RegExp }[],
  dejaVus: Set<string>,
): { avant: string; id: string; mot: string; apres: string } | null {
  let meilleur: { index: number; id: string; mot: string } | null = null;
  for (const { terme, motif } of termes) {
    if (dejaVus.has(terme.id)) continue;
    const m = motif.exec(texte);
    if (m && (meilleur === null || m.index < meilleur.index)) meilleur = { index: m.index, id: terme.id, mot: m[1] };
  }
  if (!meilleur) return null;
  return {
    avant: texte.slice(0, meilleur.index),
    id: meilleur.id,
    mot: meilleur.mot,
    apres: texte.slice(meilleur.index + meilleur.mot.length),
  };
}
