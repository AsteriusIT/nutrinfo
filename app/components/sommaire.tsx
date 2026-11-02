import { useEffect, useState, type RefObject } from "react";

interface Titre {
  id: string;
  texte: string;
}

/**
 * Titres de niveau 2 d'un contenu (identifiants posés au build par scripts/remark-nutrinfo.ts)
 * et celui qu'on est en train de lire.
 */
export function useSommaire(contenu: RefObject<HTMLElement | null>) {
  const [titres, setTitres] = useState<Titre[]>([]);
  const [actif, setActif] = useState<string | null>(null);

  useEffect(() => {
    const elements = [...(contenu.current?.querySelectorAll<HTMLHeadingElement>(":scope > h2[id]") ?? [])];
    setTitres(elements.map((h) => ({ id: h.id, texte: h.textContent ?? "" })));
    if (elements.length === 0) return;

    // Le titre actif est le dernier passé sous l'en-tête collant
    const observer = new IntersectionObserver(
      (entrees) => {
        const visibles = entrees.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visibles.length) setActif(visibles[0]);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    elements.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [contenu]);

  return { titres, actif };
}

/** Grand écran : colonne qui reste visible pendant la lecture */
export function SommaireColonne({ titres, actif }: Readonly<ReturnType<typeof useSommaire>>) {
  if (titres.length < 3) return null;
  return (
    <nav aria-label="Sur cette page" className="sticky top-24 hidden self-start xl:block">
      <p className="font-semibold">Sur cette page</p>
      <ol className="mt-3 border-l-2 border-line">
        {titres.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={actif === t.id ? "location" : undefined}
              className={`-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors duration-150 ${
                actif === t.id
                  ? "border-accent-500 font-semibold text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.texte}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Petit écran : sommaire repliable, sous « L'essentiel » */
export function SommaireRepliable({ titres }: Readonly<ReturnType<typeof useSommaire>>) {
  if (titres.length < 3) return null;
  return (
    <details className="group mt-4 rounded-lg border-2 border-line xl:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
        Sur cette page : {titres.length} parties
        <span className="text-xl leading-none text-muted group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <ol className="border-t border-line px-4 py-2">
        {titres.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} className="block py-1.5 hover:underline">
              {t.texte}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
