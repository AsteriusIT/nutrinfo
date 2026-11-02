import { useState } from "react";
import { A_EVITER } from "~/data/grossesse";

/**
 * Cartes « À éviter / À la place » pour la grossesse.
 * On peut cocher les points déjà connus : la carte se replie, la liste devient une checklist.
 */
export function AvoidGrid() {
  const [vus, setVus] = useState<string[]>([]);
  const toggle = (id: string) => setVus((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  return (
    <div className="not-prose my-12">
      <p className="font-semibold" aria-live="polite">
        {vus.length} sur {A_EVITER.length} points connus
      </p>
      <div className="mt-2 grid grid-cols-7 gap-0.5" aria-hidden="true">
        {A_EVITER.map((a) => (
          <span key={a.id} className={`h-2 transition-colors duration-200 ${vus.includes(a.id) ? "bg-age-500" : "bg-faience"}`} />
        ))}
      </div>

      <ul className="mt-6 grid gap-4">
        {A_EVITER.map((a) => {
          const vu = vus.includes(a.id);
          return (
            <li key={a.id} className={`overflow-hidden rounded-lg border-2 border-ink ${vu ? "bg-faience" : "bg-plate"}`}>
              <div className="flex items-start justify-between gap-4 px-5 pt-4">
                <div>
                  <h3 className="heading text-xl">{a.titre}</h3>
                  <p className="mt-1 text-muted">{a.risque}</p>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={vu}
                    onChange={() => toggle(a.id)}
                    className="h-5 w-5 accent-age-500"
                  />
                  Je sais
                </label>
              </div>
              {!vu && (
                <div className="mt-4 grid animate-fade sm:grid-cols-2">
                  <div className="border-t-2 border-ink bg-prot-100 px-5 py-3 sm:border-r-2">
                    <p className="text-sm font-bold text-prot-800">À éviter</p>
                    <ul className="mt-1 space-y-1">
                      {a.eviter.map((e) => (
                        <li key={e} className="flex gap-2">
                          <span className="mt-[0.55em] h-2 w-2 shrink-0 bg-prot-500" aria-hidden="true" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t-2 border-ink bg-veg-100 px-5 py-3">
                    <p className="text-sm font-bold text-veg-800">À la place</p>
                    <p className="mt-1">{a.plutot}</p>
                  </div>
                </div>
              )}
              <p className="px-5 pb-3 pt-2 text-xs text-muted">Source : {a.source.replaceAll("-", " ")}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
