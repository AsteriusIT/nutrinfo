import glossaireYaml from "@content/glossaire.yaml";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { motifTerme, premierTerme, type TermeGlossaire } from "~/lib/texte";

const glossaire = glossaireYaml as TermeGlossaire[];
const parId = new Map(glossaire.map((t) => [t.id, t]));
const termes = glossaire.map((terme) => ({ terme, motif: motifTerme(terme) }));

/**
 * Mot technique expliqué sur place : on le touche, sa définition s'ouvre juste en dessous.
 * Inséré automatiquement dans les pages MDX (scripts/remark-nutrinfo.ts) et les fiches (creerTermes).
 */
export function Terme({ id, children }: Readonly<{ id: string; children: ReactNode }>) {
  const t = parId.get(id);
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const bulleId = useId();

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("keydown", fermer);
    document.addEventListener("click", fermer);
    return () => {
      document.removeEventListener("keydown", fermer);
      document.removeEventListener("click", fermer);
    };
  }, [ouvert]);

  if (!t) return <>{children}</>;

  return (
    <span ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls={bulleId}
        onClick={() => setOuvert((o) => !o)}
        className="cursor-help rounded-sm underline decoration-accent-500 decoration-dotted decoration-2 underline-offset-4 hover:bg-accent-100"
      >
        {children}
      </button>
      {ouvert && (
        <span
          id={bulleId}
          role="note"
          className="animate-fade absolute left-0 top-full z-30 mt-2 block w-[min(20rem,80vw)] rounded-lg border-2 border-ink bg-plate p-4 text-left text-base font-normal shadow-[0_12px_24px_-12px_rgb(0_0_0/0.3)]"
        >
          <span className="heading block text-lg">{t.terme}</span>
          <span className="mt-1 block leading-snug">{t.definition}</span>
          {t.voir && (
            <Link to={t.voir} className="link mt-2 inline-block text-sm font-semibold text-accent-800">
              En savoir plus
            </Link>
          )}
        </span>
      )}
    </span>
  );
}

/**
 * Pour les textes en YAML (fiches « Apprendre ») : renvoie une fonction qui rend touchable la
 * première apparition de chaque mot du glossaire, à l'échelle de la page.
 * À créer une fois par rendu de page, et à appliquer aux textes dans l'ordre de lecture.
 */
export function creerTermes() {
  const dejaVus = new Set<string>();
  return (texte: string): ReactNode[] => {
    const morceaux: ReactNode[] = [];
    let reste = texte;
    for (let trouve = premierTerme(reste, termes, dejaVus); trouve; trouve = premierTerme(reste, termes, dejaVus)) {
      dejaVus.add(trouve.id);
      morceaux.push(
        trouve.avant,
        <Terme key={trouve.id} id={trouve.id}>
          {trouve.mot}
        </Terme>,
      );
      reste = trouve.apres;
    }
    morceaux.push(reste);
    return morceaux;
  };
}
