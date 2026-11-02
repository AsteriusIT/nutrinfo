import { useMemo, useState } from "react";
import type { Fiche } from "~/lib/content";
import { themes } from "~/lib/theme";

/** Type 2 : carte d'information. Cinq éléments au plus, un seul chiffre clé. */
export function FicheCard({ fiche }: Readonly<{ fiche: Fiche }>) {
  const t = themes[fiche.theme];
  return (
    <article className="flex h-full flex-col border-2 border-ink bg-plate">
      <div className={`flex items-baseline justify-between gap-3 ${t.bg100} px-5 pb-3 pt-4`}>
        <h3 className="heading text-xl">{fiche.titre}</h3>
        <span className={`tag shrink-0 ${t.text800}`}>{fiche.etiquette}</span>
      </div>
      <div className={`h-1.5 ${t.bg500}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="figure text-[2rem] leading-none">{fiche.chiffre}</p>
        {fiche.chiffre_note && <p className="mt-1.5 text-sm text-muted">{fiche.chiffre_note}</p>}
        <p className="mt-4">{fiche.resume}</p>
        {fiche.sources_alimentaires && (
          <p className="mt-4 text-sm">
            <span className="font-bold">Où le trouver : </span>
            {fiche.sources_alimentaires.join(", ").toLowerCase()}
          </p>
        )}
        <p className="mt-auto pt-4 text-xs text-muted">Source : {fiche.source.replaceAll("-", " ")}</p>
      </div>
    </article>
  );
}

type Filtre = { id: string; label: string };

/** Grille de cartes filtrable par catégorie et par situation */
export function FicheGrid({
  fiches,
  categories,
  vigilances,
}: Readonly<{
  fiches: (Fiche & { categorie: string })[];
  categories: Filtre[];
  vigilances: Filtre[];
}>) {
  const [cat, setCat] = useState("tous");
  const [vig, setVig] = useState<string | null>(null);

  const visibles = useMemo(
    () => fiches.filter((f) => (cat === "tous" || f.categorie === cat) && (!vig || f.vigilance?.includes(vig))),
    [fiches, cat, vig],
  );
  const vigLabel = vigilances.find((v) => v.id === vig)?.label;

  return (
    <div>
      <div className="grid gap-5 border-2 border-ink bg-faience p-4 md:grid-cols-[auto_1fr] md:gap-10 md:p-5">
        <fieldset>
          <legend className="text-sm font-bold">Afficher</legend>
          <div className="mt-2 flex">
            {[{ id: "tous", label: "Tout" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`border-2 border-ink px-4 py-2 font-semibold transition-colors duration-150 [&+&]:-ml-0.5 ${
                  cat === c.id ? "bg-ink text-white" : "bg-plate hover:bg-line"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-bold">À surveiller en particulier pour</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {vigilances.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={vig === v.id}
                onClick={() => setVig((x) => (x === v.id ? null : v.id))}
                className={`border-2 px-3 py-2 font-semibold transition-colors duration-150 ${
                  vig === v.id ? "border-age-800 bg-age-500 text-light" : "border-line bg-plate hover:border-ink"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-6 font-semibold" aria-live="polite">
        {visibles.length} fiche{visibles.length > 1 ? "s" : ""}
        {vigLabel && <span className="font-normal text-muted"> à surveiller pour : {vigLabel.toLowerCase()}</span>}
      </p>
      {visibles.length === 0 ? (
        <p className="mt-4 border-2 border-dashed border-line p-6 text-muted">
          Aucune fiche ne correspond. Retirez un filtre pour en voir davantage.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map((f, i) => (
            <li
              key={`${f.id}-${cat}-${vig}`}
              className="animate-fade"
              style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
            >
              <FicheCard fiche={f} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
