import { useState } from "react";
import { comparateurAliments, metriques, type MetriqueKey } from "~/data/comparateur-proteines";
import { NoteDonnees, ToolFrame } from "./ui";

const SERIE = {
  animal: { label: "Origine animale", bar: "bg-animal" },
  vegetal: { label: "Origine végétale", bar: "bg-vegetal" },
} as const;

/**
 * Comparateur protéines animales / végétales.
 * Barres horizontales triées, paire de couleurs validée (CVD ΔE 8,4),
 * valeurs en couleur de texte, légende + tableau sémantique.
 */
export function CompareProteins() {
  const [metrique, setMetrique] = useState<MetriqueKey>("proteines");
  const m = metriques[metrique];
  const val = (a: (typeof comparateurAliments)[number]) => a[metrique];
  const max = Math.max(...comparateurAliments.map((a) => val(a) ?? 0));
  // Les valeurs non mesurées (null) vont en fin de liste
  const tries = [...comparateurAliments].sort((a, b) => (val(b) ?? -1) - (val(a) ?? -1));

  return (
    <ToolFrame titre="Comparer animal et végétal" consigne="Valeurs pour 100 g d'aliment prêt à manger">
      <div role="tablist" aria-label="Critère de comparaison" className="flex flex-wrap gap-px border-b-2 border-ink bg-ink">
        {(Object.keys(metriques) as MetriqueKey[]).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={metrique === key}
            aria-controls="comparateur-panel"
            onClick={() => setMetrique(key)}
            className={`flex-1 whitespace-nowrap px-3 py-2.5 font-semibold transition-colors duration-150 ${
              metrique === key ? "bg-ink text-white" : "bg-plate hover:bg-faience"
            }`}
          >
            {metriques[key].label}
          </button>
        ))}
      </div>

      <div id="comparateur-panel" role="tabpanel" className="px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="max-w-[52ch]">{m.aide}</p>
          <ul className="flex gap-4 text-sm" aria-label="Légende">
            {Object.values(SERIE).map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className={`h-3 w-3 ${s.bar}`} aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>

        <table className="mt-5 w-full border-separate border-spacing-y-0.5">
          <caption className="sr-only">
            {m.label} en {m.unite} pour 100 g, du plus élevé au plus faible
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Aliment</th>
              <th scope="col">Origine</th>
              <th scope="col">
                {m.label} ({m.unite})
              </th>
            </tr>
          </thead>
          <tbody>
            {tries.map((a) => {
              const v = val(a);
              const pct = max && v ? (v / max) * 100 : 0;
              return (
                <tr key={a.nom} className="group">
                  <th scope="row" className="w-[42%] py-1.5 pr-3 text-left font-semibold sm:w-56">
                    {a.nom}
                  </th>
                  <td className="sr-only">{SERIE[a.origine].label}</td>
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-6 flex-1">
                        <div
                          className={`h-full ${SERIE[a.origine].bar} transition-[width] duration-500 ease-(--ease-carre) group-hover:brightness-110`}
                          style={{ width: `${v ? Math.max(pct, 1) : 0}%` }}
                          title={v == null ? `${a.nom} : non mesuré` : `${a.nom} : ${v.toLocaleString("fr-FR")} ${m.unite}`}
                        />
                      </div>
                      {v == null ? (
                        <span className="w-20 shrink-0 text-right text-sm font-semibold text-muted">non mesuré</span>
                      ) : (
                        <span className="figure w-20 shrink-0 text-right text-base">
                          {v.toLocaleString("fr-FR")}
                          <span className="ml-1 text-sm font-semibold text-muted">{m.unite}</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <NoteDonnees>
          Composition : table CIQUAL 2020 de l'ANSES. Climat : Agribalyse 3.1 de l'ADEME. « Non mesuré » :
          la table CIQUAL ne donne pas de valeur pour cet aliment.
        </NoteDonnees>
      </div>
    </ToolFrame>
  );
}
