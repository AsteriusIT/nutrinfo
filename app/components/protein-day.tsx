import { useState } from "react";
import { CIQUAL, pourPortion, type AlimentCiqual } from "~/data/ciqual";
import { NoteDonnees, ToolFrame } from "./ui";

// Portions usuelles ; protéines calculées depuis CIQUAL 2020 (voir data/ciqual.ts)
const portion = (id: string, a: AlimentCiqual, nom: string, label: string, grammes: number, origine: "animal" | "vegetal") => ({
  id,
  nom,
  portion: label,
  g: Math.round(pourPortion(a, "proteines", grammes)),
  origine,
});

const PORTIONS = [
  portion("pain", CIQUAL.painComplet, "Pain complet", "2 tranches (60 g)", 60, "vegetal"),
  portion("lentilles", CIQUAL.lentillesVertesCuites, "Lentilles cuites", "150 g", 150, "vegetal"),
  portion("tofu", CIQUAL.tofu, "Tofu", "100 g", 100, "vegetal"),
  portion("riz", CIQUAL.rizBlancCuit, "Riz cuit", "150 g", 150, "vegetal"),
  portion("amandes", CIQUAL.amandes, "Amandes", "30 g", 30, "vegetal"),
  portion("oeuf", CIQUAL.oeufDur, "Œuf", "1 œuf (50 g)", 50, "animal"),
  portion("yaourt", CIQUAL.yaourtNature, "Yaourt nature", "125 g", 125, "animal"),
  portion("fromage", CIQUAL.emmental, "Emmental", "30 g", 30, "animal"),
  portion("poulet", CIQUAL.pouletFiletPoele, "Blanc de poulet", "120 g", 120, "animal"),
];

const PROFILS = [
  { id: "adulte", label: "Adulte", gkg: 0.83, source: "AFSSA 2007, EFSA 2012" },
  { id: "senior", label: "70 ans et plus", gkg: 1, source: "ANSES 2019, HAS 2021" },
] as const;

const CELLS = 20; // une case = 5 % du besoin
const fill = { animal: "bg-animal", vegetal: "bg-vegetal" } as const;

/** Outil : estimer son besoin en protéines puis composer une journée */
export function ProteinDay({ profilInitial = "adulte" }: Readonly<{ profilInitial?: (typeof PROFILS)[number]["id"] }>) {
  const [poids, setPoids] = useState(profilInitial === "senior" ? 65 : 70);
  const [profil, setProfil] = useState<(typeof PROFILS)[number]["id"]>(profilInitial);
  const [choix, setChoix] = useState<string[]>(["pain", "lentilles", "yaourt", "oeuf"]);

  const p = PROFILS.find((x) => x.id === profil)!;
  const besoin = Math.round(poids * p.gkg);
  const selection = PORTIONS.filter((x) => choix.includes(x.id));
  const total = selection.reduce((s, x) => s + x.g, 0);
  const pct = Math.round((total / besoin) * 100);

  // On empile les portions dans l'ordre de la liste : chaque case prend la couleur de son origine
  const cellColors: string[] = [];
  let acc = 0;
  for (const s of selection) {
    acc += s.g;
    const filled = Math.min(CELLS, Math.floor((acc / besoin) * CELLS));
    while (cellColors.length < filled) cellColors.push(fill[s.origine]);
  }

  const toggle = (id: string) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  let message = `Il manque environ ${besoin - total} g. Ajoutez une portion de légumineuses, d'œufs ou de produits laitiers.`;
  if (total >= besoin) message = "Besoin couvert. Le dépasser un peu n'est pas un problème : c'est le cas de la plupart des adultes en France.";
  if (total === 0) message = "Choisissez des aliments pour remplir la jauge.";

  return (
    <ToolFrame titre="Mon besoin en protéines" consigne="Estimation pour un adulte en bonne santé, hors grossesse">
      <div className="grid gap-8 px-4 py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:px-6">
        <div className="space-y-6">
          <fieldset>
            <legend className="font-bold">Âge</legend>
            <div className="mt-2 flex">
              {PROFILS.map((x) => (
                <label
                  key={x.id}
                  className={`flex-1 cursor-pointer border-2 border-ink px-3 py-2.5 text-center font-semibold transition-colors duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink first:rounded-l-md last:rounded-r-md [&+&]:-ml-0.5 ${
                    profil === x.id ? "bg-ink text-white" : "hover:bg-faience"
                  }`}
                >
                  <input type="radio" name="profil" value={x.id} checked={profil === x.id} onChange={() => setProfil(x.id)} className="sr-only" />
                  {x.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="poids" className="flex items-baseline justify-between font-bold">
              <span>Poids</span>
              <output htmlFor="poids" className="figure text-lg">
                {poids} kg
              </output>
            </label>
            <input
              id="poids"
              type="range"
              min={35}
              max={140}
              value={poids}
              onChange={(e) => setPoids(Number(e.target.value))}
              className="mt-3 w-full accent-ink"
            />
          </div>

          <div className="rounded-lg border-l-8 border-accent-500 bg-accent-100 px-4 py-3">
            <p className="font-bold text-accent-800">Besoin estimé</p>
            <p className="figure mt-1 text-5xl">
              {besoin}
              <span className="ml-2 text-xl">g par jour</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {p.gkg.toLocaleString("fr-FR")} g × {poids} kg ({p.source})
            </p>
          </div>
        </div>

        <div>
          <p className="font-bold">Ma journée</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {PORTIONS.map((x) => {
              const on = choix.includes(x.id);
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(x.id)}
                    className={`flex items-center gap-2 rounded-md border-2 px-3 py-1.5 text-left transition-colors duration-150 ${
                      on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                    }`}
                  >
                    <span className={`h-3 w-3 shrink-0 ${fill[x.origine]}`} aria-hidden="true" />
                    <span>
                      <span className="font-semibold">{x.nom}</span>
                      <span className={`ml-1.5 text-sm ${on ? "text-white/80" : "text-muted"}`}>
                        {x.portion}, {x.g} g
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-bold">Part du besoin couverte</p>
              <p className="figure text-lg" aria-live="polite">
                {total} g sur {besoin} g ({pct} %)
              </p>
            </div>
            <div className="mt-2 grid grid-cols-10 gap-0.5" role="img" aria-label={`${pct} % du besoin couvert`}>
              {Array.from({ length: CELLS }, (_, i) => (
                <span
                  key={i}
                  className={`aspect-square transition-colors duration-200 ${cellColors[i] ?? "bg-faience"}`}
                  style={{ transitionDelay: `${i * 20}ms` }}
                />
              ))}
            </div>
            <ul className="mt-2 flex gap-4 text-sm text-muted" aria-hidden="true">
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-animal" /> Animal
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-vegetal" /> Végétal
              </li>
            </ul>
            <p className="mt-4 font-semibold">{message}</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-5 md:px-6">
        <NoteDonnees>Protéines calculées pour chaque portion à partir de la table CIQUAL 2020 de l'ANSES, arrondies au gramme.</NoteDonnees>
      </div>
    </ToolFrame>
  );
}
