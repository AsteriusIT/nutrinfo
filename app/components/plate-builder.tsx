import { useState, type DragEvent } from "react";
import { themes } from "~/lib/theme";
import { ToolFrame } from "./ui";

/**
 * Outil « Composer son assiette ».
 * L'assiette compte 16 cases ; chaque portion en occupe 2.
 * Repère : ½ légumes (8 cases), ¼ féculents (4), ¼ protéines (4).
 * On ajoute au clic (accessible clavier et tactile) ou par glisser-déposer.
 */

type Famille = "veg" | "carb" | "prot";

const CASES = 16;
const PORTION = 2;
const CIBLE: Record<Famille, number> = { veg: 8, carb: 4, prot: 4 };
// Zones de l'assiette : moitié gauche pour les légumes, quarts droits pour féculents et protéines
const ZONE: Record<Famille, number[]> = {
  veg: [0, 4, 8, 12, 1, 5, 9, 13],
  carb: [2, 3, 6, 7],
  prot: [10, 11, 14, 15],
};

const FAMILLES: { id: Famille; nom: string; part: string; aliments: string[] }[] = [
  { id: "veg", nom: "Légumes", part: "½", aliments: ["Carottes", "Brocoli", "Tomates", "Haricots verts", "Courgettes", "Salade"] },
  { id: "carb", nom: "Féculents", part: "¼", aliments: ["Riz complet", "Pâtes", "Pain complet", "Pommes de terre", "Quinoa"] },
  { id: "prot", nom: "Protéines", part: "¼", aliments: ["Lentilles", "Poisson", "Œufs", "Poulet", "Tofu", "Pois chiches"] },
];

// Classes écrites en entier pour que Tailwind les détecte
const SURVOL: Record<Famille, string> = {
  veg: "enabled:hover:bg-veg-500",
  carb: "enabled:hover:bg-carb-500",
  prot: "enabled:hover:bg-prot-500 enabled:hover:text-light",
};

const familleDe = (aliment: string) => FAMILLES.find((f) => f.aliments.includes(aliment))!.id;

type Portion = { id: number; aliment: string; famille: Famille };

function verdict(compte: Record<Famille, number>, plein: boolean) {
  const conseils: string[] = [];
  if (compte.veg < CIBLE.veg) conseils.push("ajoutez des légumes");
  if (compte.carb > CIBLE.carb) conseils.push("réduisez les féculents");
  if (compte.prot > CIBLE.prot) conseils.push("réduisez les protéines");
  if (compte.carb < CIBLE.carb && plein) conseils.push("gardez une place pour les féculents");
  if (compte.prot < CIBLE.prot && plein) conseils.push("gardez une place pour les protéines");

  const total = compte.veg + compte.carb + compte.prot;
  if (total === 0) return { ok: false, texte: "Votre assiette est vide. Choisissez un aliment pour commencer." };
  if (compte.veg === CIBLE.veg && compte.carb === CIBLE.carb && compte.prot === CIBLE.prot)
    return { ok: true, texte: "Assiette équilibrée : la moitié de légumes, un quart de féculents, un quart de protéines." };
  const phrase = conseils.length ? conseils.join(", ") : "continuez à remplir";
  return { ok: false, texte: phrase.charAt(0).toUpperCase() + phrase.slice(1) + "." };
}

export function PlateBuilder() {
  const [portions, setPortions] = useState<Portion[]>([
    { id: 1, aliment: "Brocoli", famille: "veg" },
    { id: 2, aliment: "Pâtes", famille: "carb" },
    { id: 3, aliment: "Pâtes", famille: "carb" },
    { id: 4, aliment: "Poulet", famille: "prot" },
  ]);
  const [survol, setSurvol] = useState(false);

  const occupees = portions.length * PORTION;
  const plein = occupees >= CASES;
  const compte: Record<Famille, number> = { veg: 0, carb: 0, prot: 0 };
  for (const p of portions) compte[p.famille] += PORTION;
  const v = verdict(compte, plein);

  const ajouter = (aliment: string) => {
    if (plein) return;
    setPortions((ps) => [...ps, { id: Date.now() + Math.random(), aliment, famille: familleDe(aliment) }]);
  };
  const retirer = (id: number) => setPortions((ps) => ps.filter((p) => p.id !== id));

  // Chaque famille remplit sa zone de l'assiette (indices d'une grille 4×4, ligne par ligne).
  // Ce qui dépasse va dans les cases libres des autres zones et est marqué « en trop ».
  const cases: ({ p: Portion; trop: boolean } | undefined)[] = Array.from({ length: CASES }, () => undefined);
  const surplus: Portion[] = [];
  for (const f of ["veg", "carb", "prot"] as Famille[]) {
    const unites = portions.filter((p) => p.famille === f).flatMap((p) => Array.from({ length: PORTION }, () => p));
    unites.forEach((p, i) => {
      if (i < ZONE[f].length) cases[ZONE[f][i]] = { p, trop: false };
      else surplus.push(p);
    });
  }
  for (const p of surplus) {
    const libre = cases.findIndex((c) => !c);
    if (libre >= 0) cases[libre] = { p, trop: true };
  }
  const premiereCase = new Map<number, number>();
  cases.forEach((c, i) => {
    if (c && !premiereCase.has(c.p.id)) premiereCase.set(c.p.id, i);
  });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setSurvol(false);
    const aliment = e.dataTransfer.getData("text/plain");
    if (aliment) ajouter(aliment);
  };

  return (
    <ToolFrame titre="Composer son assiette" consigne="Touchez un aliment pour l'ajouter, ou faites-le glisser sur l'assiette">
      <div className="grid gap-8 px-4 py-5 md:grid-cols-2 md:px-6">
        {/* Garde-manger */}
        <div className="space-y-5">
          {FAMILLES.map((f) => {
            const t = themes[f.id];
            return (
              <fieldset key={f.id}>
                <legend className={`flex items-center gap-2 font-bold ${t.text800}`}>
                  <span className={`h-3 w-3 ${t.bg500}`} aria-hidden="true" />
                  {f.nom}
                </legend>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {f.aliments.map((a) => (
                    <li key={a}>
                      <button
                        type="button"
                        draggable={!plein}
                        disabled={plein}
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", a)}
                        onClick={() => ajouter(a)}
                        aria-label={`Ajouter ${a.toLowerCase()}`}
                        className={`rounded-md border-2 border-ink px-3 py-1.5 font-semibold transition-colors duration-150 enabled:cursor-grab ${SURVOL[f.id]} disabled:cursor-not-allowed disabled:border-line disabled:text-muted ${t.bg100}`}
                      >
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>
            );
          })}
        </div>

        {/* Assiette */}
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setSurvol(true);
            }}
            onDragLeave={() => setSurvol(false)}
            onDrop={onDrop}
            className={`relative aspect-square rounded-lg border-2 border-ink p-2.5 transition-colors duration-150 ${survol ? "bg-veg-100" : "bg-plate"}`}
          >
            <ul className="grid h-full grid-cols-4 grid-rows-4 gap-1" aria-label="Contenu de l'assiette">
              {cases.map((c, i) => {
                if (!c) return <li key={`vide-${i}`} className="bg-faience" aria-hidden="true" />;
                const t = themes[c.p.famille];
                const premiere = premiereCase.get(c.p.id) === i;
                return (
                  <li
                    key={`${c.p.id}-${i}`}
                    className={`relative animate-tile ${t.bg500}`}
                    aria-hidden={!premiere}
                    style={c.trop ? { backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, rgb(255 255 255 / 0.45) 6px 9px)" } : undefined}
                  >
                    {premiere && (
                      <button
                        type="button"
                        onClick={() => retirer(c.p.id)}
                        className={`h-full w-full p-1 text-left text-xs font-bold leading-tight sm:text-sm ${t.on500} hover:brightness-110`}
                        aria-label={`Retirer ${c.p.aliment.toLowerCase()}${c.trop ? " (en trop)" : ""}`}
                      >
                        {c.p.aliment}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {/* Repère : moitié gauche / quarts droits, en pointillés */}
            <div className="pointer-events-none absolute inset-2.5 grid grid-cols-2 grid-rows-2" aria-hidden="true">
              <div className="row-span-2 border-r-2 border-dashed border-ink/60" />
              <div className="border-b-2 border-dashed border-ink/60" />
              <div />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted">
            Les pointillés montrent le repère, les hachures ce qui est en trop. Touchez un aliment dans l'assiette pour le retirer.
          </p>

          {/* Proportions */}
          <dl className="mt-5 space-y-2.5">
            {FAMILLES.map((f) => {
              const t = themes[f.id];
              const n = compte[f.id];
              const cible = CIBLE[f.id];
              return (
                <div key={f.id} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3">
                  <dt className="font-semibold">
                    {f.nom} <span className="text-muted">({f.part})</span>
                  </dt>
                  <dd className="grid grid-cols-8 gap-0.5" aria-hidden="true">
                    {Array.from({ length: 8 }, (_, i) => (
                      <span
                        key={i}
                        className={`h-4 ${i < n ? t.bg500 : i < cible ? "bg-faience outline-1 -outline-offset-1 outline-dashed outline-ink/50" : "bg-transparent"}`}
                      />
                    ))}
                  </dd>
                  <dd className="figure w-14 text-right">
                    {n}/{cible}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div
            aria-live="polite"
            className={`mt-5 rounded-lg border-l-8 px-4 py-3 font-semibold ${v.ok ? "border-veg-500 bg-veg-100" : "border-carb-500 bg-carb-100"}`}
          >
            {v.texte}
          </div>
          <button
            type="button"
            onClick={() => setPortions([])}
            disabled={portions.length === 0}
            className="mt-4 rounded-md border-2 border-ink px-4 py-2 font-semibold hover:bg-ink hover:text-white disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
          >
            Vider l'assiette
          </button>
        </div>
      </div>
    </ToolFrame>
  );
}
