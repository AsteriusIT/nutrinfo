import { useId, useState } from "react";
import { Link } from "react-router";
import { bases, type FicheBase } from "~/lib/content";
import { themes, type ThemeKey } from "~/lib/theme";

const MAX_KCAL = 9;

/** 1 carré = 1 kcal, sur une échelle de 9 (les lipides) */
export function CarresEnergie({ kcal, theme, delai = 0 }: Readonly<{ kcal: number; theme?: ThemeKey; delai?: number }>) {
  const plein = theme ? themes[theme].bg500 : "bg-ink";
  return (
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: MAX_KCAL }, (_, i) => (
        <span
          key={i}
          className={`h-5 w-5 sm:h-6 sm:w-6 ${i < kcal ? `animate-tile ${plein}` : "border-2 border-line"}`}
          style={i < kcal ? { animationDelay: `${delai + i * 50}ms` } : undefined}
        />
      ))}
    </span>
  );
}

/** Énergie apportée par 1 g de chaque nutriment (règlement UE 1169/2011, annexe XIV) */
export function EnergieParGramme({ actif }: Readonly<{ actif?: string }>) {
  const lignes = [
    ...bases.filter((f) => f.kcal !== undefined).map((f) => ({ id: f.id, nom: f.court, kcal: f.kcal!, theme: f.theme as ThemeKey | undefined })),
    { id: "alcool", nom: "Alcool", kcal: 7, theme: undefined },
  ].sort((a, b) => b.kcal - a.kcal);

  return (
    <figure className="rounded-lg border-2 border-ink">
      <figcaption className="border-b-2 border-ink bg-faience px-4 py-3 md:px-6">
        <span className="heading text-lg">Combien d'énergie dans 1 gramme ?</span>
        <span className="block text-sm text-muted">Un carré = 1 kcal</span>
      </figcaption>
      <ul className="divide-y divide-line px-4 md:px-6">
        {lignes.map((l, i) => (
          <li
            key={l.id}
            className={`grid grid-cols-[7.5rem_1fr] items-center gap-3 py-2.5 sm:grid-cols-[10rem_auto_1fr] ${l.id === actif ? "font-bold" : ""}`}
          >
            <span>{l.nom}</span>
            <CarresEnergie kcal={l.kcal} theme={l.theme} delai={i * 80} />
            <span className="figure col-start-2 text-sm sm:col-start-auto sm:text-base">
              {l.kcal} kcal<span className="sr-only"> par gramme</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 text-sm text-muted md:px-6">
        L'eau, les vitamines et les minéraux n'apportent pas d'énergie, mais ils sont indispensables.
      </p>
    </figure>
  );
}

/** Idée reçue : on réfléchit, puis on découvre la réponse */
export function VraiOuFaux({ idee, theme }: Readonly<{ idee: FicheBase["idee_recue"]; theme: ThemeKey }>) {
  const [vu, setVu] = useState(false);
  const id = useId();
  const t = themes[theme];
  return (
    <section aria-labelledby={`${id}-titre`} className="overflow-hidden rounded-lg border-2 border-ink">
      <div className={`${t.bg100} px-5 py-4`}>
        <h2 id={`${id}-titre`} className={`tag ${t.text800}`}>
          Vrai ou faux ?
        </h2>
        <p className="heading mt-1 text-xl md:text-2xl">« {idee.affirmation} »</p>
      </div>
      <div className="px-5 py-4" aria-live="polite">
        {vu ? (
          <div className="animate-fade">
            <p className="figure text-2xl">{idee.verdict}.</p>
            <p className="mt-2">{idee.explication}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setVu(true)}
            className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 py-2.5 font-bold text-white transition-colors duration-150 hover:bg-veg-500 hover:text-dark"
          >
            Voir la réponse
          </button>
        )}
      </div>
    </section>
  );
}

/** Carte d'une fiche dans la grille de /apprendre */
export function CarteFiche({ fiche: f, numero }: Readonly<{ fiche: FicheBase; numero: number }>) {
  const t = themes[f.theme];
  return (
    <Link
      to={`/apprendre/${f.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border-2 border-ink transition-[box-shadow,transform] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)]"
    >
      <span className={`flex items-baseline justify-between gap-3 ${t.bg500} ${t.on500} px-5 py-4`}>
        <span className="heading text-2xl">{f.court}</span>
        <span className="figure text-sm opacity-80">
          <span className="sr-only">Fiche </span>
          {numero}/{bases.length}
        </span>
      </span>
      <span className="flex flex-1 flex-col px-5 py-4">
        <span className="font-semibold">{f.question}</span>
        <span className="mt-2 text-muted">{f.reponse.split(". ")[0]}.</span>
      </span>
    </Link>
  );
}
