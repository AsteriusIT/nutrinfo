import type { ReactNode } from "react";
import { Link } from "react-router";
import { themes, type ThemeKey } from "~/lib/theme";

/** Étiquette carrée, casse normale */
export function Tag({ children, theme }: Readonly<{ children: ReactNode; theme?: ThemeKey }>) {
  const t = theme ? themes[theme] : null;
  return (
    <span className={`tag inline-block rounded-sm px-2 py-1 ${t ? `${t.bg100} ${t.text800}` : "bg-faience text-muted"}`}>
      {children}
    </span>
  );
}

/** Lien vers une référence de la bibliographie */
export function SourceBadges({ codes }: Readonly<{ codes: string[] }>) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm">
      <span className="font-semibold">Sources :</span>
      <ul className="contents">
        {codes.map((code, i) => (
          <li key={code}>
            <Link to={`/sources#${code}`} className="link text-muted hover:text-ink">
              {code.replaceAll("-", " ")}
            </Link>
            {i < codes.length - 1 && <span className="text-muted">,</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bouton / lien d'action carré — le libellé dit ce qui va se passer */
export function ButtonLink({
  to,
  children,
  variant = "primary",
}: Readonly<{ to: string; children: ReactNode; variant?: "primary" | "secondary" }>) {
  const styles =
    variant === "primary"
      ? "bg-ink text-white hover:bg-veg-500 hover:text-dark"
      : "border-2 border-ink text-ink hover:bg-ink hover:text-white";
  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center rounded-md px-6 py-3 font-bold transition-colors duration-150 ${styles}`}
    >
      {children}
    </Link>
  );
}

/** Encadré « L'essentiel » (lecture en 30 secondes). Pas de numéros : ce n'est pas une suite d'étapes. */
export function KeyPoints({ items, theme }: Readonly<{ items: string[]; theme: ThemeKey }>) {
  const t = themes[theme];
  return (
    <aside className={`rounded-lg border-l-8 ${t.border500} ${t.bg100} px-6 py-5`} aria-labelledby="essentiel">
      <h2 id="essentiel" className={`heading text-lg ${t.text800}`}>
        L'essentiel
      </h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-lg leading-snug">
            <span className={`mt-[0.45em] h-2.5 w-2.5 shrink-0 ${t.bg500}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Niveau 3 de lecture : détails repliables */
export function PourAllerPlusLoin({ titre, children }: Readonly<{ titre: string; children: ReactNode }>) {
  return (
    <details className="group overflow-hidden rounded-lg border-2 border-ink">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-bold hover:bg-faience [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm font-semibold text-muted">Pour aller plus loin</span>
          {titre}
        </span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-ink text-xl leading-none group-open:bg-ink group-open:text-white"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="prose-carre border-t-2 border-ink px-4 py-4">{children}</div>
    </details>
  );
}

/** Origine des données d'un outil ou d'un graphique (mention CIQUAL obligatoire) */
export function NoteDonnees({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="mt-4 border-t border-line pt-3 text-sm text-muted">{children}</p>;
}

/** Cadre commun des outils interactifs */
export function ToolFrame({
  titre,
  consigne,
  children,
}: Readonly<{ titre: string; consigne?: string; children: ReactNode }>) {
  return (
    <section className="not-prose my-12 overflow-hidden rounded-lg border-2 border-ink bg-plate" aria-label={titre}>
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink bg-faience px-4 py-3 md:px-6">
        <h3 className="heading text-lg">{titre}</h3>
        {consigne && <p className="text-sm text-muted">{consigne}</p>}
      </header>
      {children}
    </section>
  );
}
