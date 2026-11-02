import { useState } from "react";
import { arrondi, CIQUAL, pourPortion, type AlimentCiqual } from "~/data/ciqual";
import { NoteDonnees, ToolFrame } from "./ui";

const OBJECTIF = 30; // g par jour, adulte (ANSES 2016)

type Famille = "veg" | "carb" | "leg";
const FAMILLES: Record<Famille, { label: string; bg: string }> = {
  veg: { label: "Fruits, légumes, fruits à coque", bg: "bg-veg-500" },
  carb: { label: "Féculents", bg: "bg-carb-500" },
  leg: { label: "Légumes secs", bg: "bg-prot-500" },
};

const portion = (id: string, a: AlimentCiqual, nom: string, label: string, grammes: number, famille: Famille) => ({
  id,
  nom,
  portion: label,
  g: arrondi(pourPortion(a, "fibres", grammes)),
  famille,
});

// Paires « raffiné / complet » côte à côte pour montrer l'écart
const PORTIONS = [
  portion("baguette", CIQUAL.baguette, "Baguette", "60 g", 60, "carb"),
  portion("painComplet", CIQUAL.painComplet, "Pain complet", "60 g", 60, "carb"),
  portion("pates", CIQUAL.patesCuites, "Pâtes", "200 g cuites", 200, "carb"),
  portion("patesCompletes", CIQUAL.patesCompletesCuites, "Pâtes complètes", "200 g cuites", 200, "carb"),
  portion("avoine", CIQUAL.floconsAvoine, "Flocons d'avoine", "40 g", 40, "carb"),
  portion("lentilles", CIQUAL.lentillesVertesCuites, "Lentilles", "150 g cuites", 150, "leg"),
  portion("haricotsRouges", CIQUAL.haricotsRougesCuits, "Haricots rouges", "150 g cuits", 150, "leg"),
  portion("pomme", CIQUAL.pomme, "Pomme", "150 g", 150, "veg"),
  portion("framboises", CIQUAL.framboise, "Framboises", "125 g", 125, "veg"),
  portion("carotte", CIQUAL.carotteCrue, "Carotte râpée", "100 g", 100, "veg"),
  portion("haricotsVerts", CIQUAL.haricotsVertsCuits, "Haricots verts", "150 g", 150, "veg"),
  portion("brocoli", CIQUAL.brocoliVapeur, "Brocoli", "150 g", 150, "veg"),
  portion("amandes", CIQUAL.amandes, "Amandes", "30 g", 30, "veg"),
];

/** Outil : composer une journée et voir la jauge de fibres se remplir (1 case = 1 g) */
export function FibreDay() {
  const [choix, setChoix] = useState<string[]>(["baguette", "pates", "pomme", "carotte"]);
  const selection = PORTIONS.filter((x) => choix.includes(x.id));
  const total = selection.reduce((s, x) => s + x.g, 0);
  const toggle = (id: string) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const cells: string[] = [];
  let acc = 0;
  for (const s of selection) {
    acc += s.g;
    const filled = Math.min(OBJECTIF, Math.floor(acc));
    while (cells.length < filled) cells.push(FAMILLES[s.famille].bg);
  }

  let message = `Il manque ${arrondi(OBJECTIF - total).toLocaleString("fr-FR")} g. Essayez la version complète d'un féculent, ou une portion de légumes secs.`;
  if (total >= OBJECTIF) message = "Objectif atteint. Augmentez les fibres progressivement et buvez assez : l'intestin s'habitue en quelques semaines.";
  if (total === 0) message = "Choisissez des aliments pour remplir la jauge.";

  return (
    <ToolFrame titre="Ma journée de fibres" consigne="Objectif adulte : 30 g par jour. Une case = 1 g">
      <div className="px-4 py-5 md:px-6">
        <ul className="flex flex-wrap gap-2">
          {PORTIONS.map((x) => {
            const on = choix.includes(x.id);
            return (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(x.id)}
                  className={`flex items-center gap-2 border-2 px-3 py-1.5 text-left transition-colors duration-150 ${
                    on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                  }`}
                >
                  <span className={`h-3 w-3 shrink-0 ${FAMILLES[x.famille].bg}`} aria-hidden="true" />
                  <span>
                    <span className="font-semibold">{x.nom}</span>
                    <span className={`ml-1.5 text-sm ${on ? "text-white/80" : "text-muted"}`}>
                      {x.portion}, {x.g.toLocaleString("fr-FR")} g
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-baseline justify-between gap-3">
          <p className="font-bold">Fibres de la journée</p>
          <p className="figure text-lg" aria-live="polite">
            {arrondi(total).toLocaleString("fr-FR")} g sur {OBJECTIF} g
          </p>
        </div>
        <div className="mt-2 grid grid-cols-10 gap-0.5 sm:grid-cols-15" role="img" aria-label={`${arrondi(total)} g de fibres sur ${OBJECTIF} g`}>
          {Array.from({ length: OBJECTIF }, (_, i) => (
            <span
              key={i}
              className={`aspect-square transition-colors duration-200 ${cells[i] ?? "bg-faience"}`}
              style={{ transitionDelay: `${i * 15}ms` }}
            />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted" aria-hidden="true">
          {Object.values(FAMILLES).map((f) => (
            <li key={f.label} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 ${f.bg}`} /> {f.label}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-semibold">{message}</p>
        <NoteDonnees>Fibres calculées pour chaque portion à partir de la table CIQUAL 2020 de l'ANSES.</NoteDonnees>
      </div>
    </ToolFrame>
  );
}
