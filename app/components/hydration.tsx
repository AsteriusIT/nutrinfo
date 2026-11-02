import { useState } from "react";
import { CIQUAL } from "~/data/ciqual";
import { NoteDonnees, ToolFrame } from "./ui";

const VERRE_L = 0.2;
const PART_BOISSONS = 0.8; // les aliments apportent environ 20 % de l'eau (EFSA 2010)

// Apports adéquats en eau totale, boissons + aliments (EFSA 2010)
const PROFILS = [
  { id: "femme", label: "Femme", total: 2.0 },
  { id: "homme", label: "Homme", total: 2.5 },
  { id: "enfant", label: "Enfant de 4 à 8 ans", total: 1.6 },
] as const;

const litres = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString("fr-FR")} L`;

/** Outil : les verres de la journée, à remplir un par un */
export function WaterGlasses() {
  const [profil, setProfil] = useState<(typeof PROFILS)[number]["id"]>("femme");
  const [bus, setBus] = useState(3);
  const p = PROFILS.find((x) => x.id === profil)!;
  const boissons = p.total * PART_BOISSONS;
  const verres = Math.ceil(boissons / VERRE_L - 0.05);
  const n = Math.min(bus, verres);

  return (
    <ToolFrame titre="Mes verres de la journée" consigne="Touchez un verre pour le remplir ou le vider">
      <div className="px-4 py-5 md:px-6">
        <fieldset>
          <legend className="font-bold">Pour qui ?</legend>
          <div className="mt-2 flex flex-wrap">
            {PROFILS.map((x) => (
              <label
                key={x.id}
                className={`flex-1 cursor-pointer whitespace-nowrap border-2 border-ink px-3 py-2.5 text-center font-semibold transition-colors duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink [&+&]:-ml-0.5 ${
                  profil === x.id ? "bg-ink text-white" : "hover:bg-faience"
                }`}
              >
                <input type="radio" name="hydra-profil" value={x.id} checked={profil === x.id} onChange={() => setProfil(x.id)} className="sr-only" />
                {x.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div className="border-l-8 border-water-500 bg-water-100 px-4 py-3">
            <p className="font-bold text-water-800">À boire chaque jour</p>
            <p className="figure mt-1 text-5xl">
              {litres(boissons)}
            </p>
            <p className="mt-1">soit environ {verres} verres de 20 cl</p>
            <p className="mt-2 text-sm text-muted">
              Sur {litres(p.total)} d'eau au total : les aliments apportent le reste.
            </p>
          </div>

          <div>
            <ol className="grid grid-cols-5 gap-2 sm:gap-3" aria-label="Verres de la journée">
              {Array.from({ length: verres }, (_, i) => {
                const plein = i < n;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      aria-pressed={plein}
                      aria-label={`Verre ${i + 1}${plein ? ", bu" : ""}`}
                      onClick={() => setBus(plein ? i : i + 1)}
                      className="relative block aspect-[3/4] w-full border-[3px] border-t-0 border-ink bg-plate"
                    >
                      <span
                        className="absolute inset-x-0 bottom-0 bg-water-500 transition-[height] duration-500 ease-(--ease-carre)"
                        style={{ height: plein ? "86%" : "0%" }}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 font-semibold" aria-live="polite">
              {n} verre{n > 1 ? "s" : ""} sur {verres}, soit {litres(n * VERRE_L)}.{" "}
              {n >= verres ? "C'est bon pour aujourd'hui, et un peu plus s'il fait chaud." : ""}
            </p>
          </div>
        </div>
        <NoteDonnees>
          Apports adéquats en eau de l'EFSA (2010). On suppose que 20 % de l'eau vient des aliments. Il faut
          boire davantage quand il fait chaud, pendant un effort, en cas de fièvre ou pendant l'allaitement.
        </NoteDonnees>
      </div>
    </ToolFrame>
  );
}

const ALIMENTS_EAU = [
  CIQUAL.concombre,
  CIQUAL.courgetteCrue,
  CIQUAL.tomate,
  CIQUAL.pasteque,
  CIQUAL.laitDemiEcreme,
  CIQUAL.yaourtNature,
  CIQUAL.orange,
  CIQUAL.pomme,
  CIQUAL.patesCuites,
  CIQUAL.baguette,
];

/** Graphique : part d'eau dans quelques aliments (CIQUAL), barres horizontales triées */
export function WaterInFood() {
  const rows = [...ALIMENTS_EAU].sort((a, b) => b.eau! - a.eau!);
  return (
    <figure className="not-prose my-10">
      <figcaption className="heading text-lg">Quelle part d'eau dans 100 g ?</figcaption>
      <table className="mt-4 w-full border-separate border-spacing-y-0.5">
        <caption className="sr-only">Eau en grammes pour 100 g d'aliment, du plus élevé au plus faible</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Aliment</th>
            <th scope="col">Eau (g pour 100 g)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.code}>
              <th scope="row" className="w-[42%] py-1 pr-3 text-left font-semibold sm:w-52">
                {a.nom}
              </th>
              <td className="py-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 flex-1 bg-faience">
                    <div className="h-full bg-water-500" style={{ width: `${a.eau}%` }} />
                  </div>
                  <span className="figure w-14 shrink-0 text-right">{Math.round(a.eau!)} %</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NoteDonnees>Teneur en eau pour 100 g, table CIQUAL 2020 de l'ANSES.</NoteDonnees>
    </figure>
  );
}

// Un verre standard = 10 g d'alcool pur (densité de l'éthanol : 0,8)
const VERRES_STANDARD = [
  { nom: "Bière à 5 %", volume: "25 cl", ml: 250, degre: 5 },
  { nom: "Vin à 12 %", volume: "10 cl", ml: 100, degre: 12 },
  { nom: "Apéritif à 18 %", volume: "7 cl", ml: 70, degre: 18 },
  { nom: "Spiritueux à 40 %", volume: "3 cl", ml: 30, degre: 40 },
];

/** Illustration : des volumes différents, la même quantité d'alcool */
export function StandardDrinks() {
  const max = Math.max(...VERRES_STANDARD.map((v) => v.ml));
  return (
    <figure className="not-prose my-10">
      <ul className="grid grid-cols-4 items-end gap-3 sm:gap-6">
        {VERRES_STANDARD.map((v) => {
          const alcool = Math.round(v.ml * (v.degre / 100) * 0.8);
          return (
            <li key={v.nom} className="flex flex-col">
              <div className="relative mx-auto w-full max-w-24 border-[3px] border-t-0 border-ink" style={{ height: `${(v.ml / max) * 9 + 2}rem` }}>
                <div className="absolute inset-x-0 bottom-0 top-[12%] bg-carb-100" />
                <div className="absolute inset-x-0 bottom-0 bg-carb-500" style={{ height: `${0.88 * v.degre}%`, minHeight: "0.375rem" }} />
              </div>
              <p className="mt-2 font-semibold leading-tight">{v.nom}</p>
              <p className="text-sm text-muted">{v.volume}</p>
              <p className="figure mt-1">≈ {alcool} g</p>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-4 text-muted">
        Quatre volumes différents, environ 10 g d'alcool pur dans chacun : c'est un « verre standard », celui des
        bars et des restaurants. La partie foncée représente la part d'alcool.
      </figcaption>
    </figure>
  );
}
