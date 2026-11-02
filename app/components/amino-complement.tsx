import { useState } from "react";
import { ToolFrame } from "./ui";

// Les 9 acides aminés indispensables.
const AA = [
  { code: "His", nom: "Histidine" },
  { code: "Ile", nom: "Isoleucine" },
  { code: "Leu", nom: "Leucine" },
  { code: "Lys", nom: "Lysine" },
  { code: "Met", nom: "Méthionine" },
  { code: "Phe", nom: "Phénylalanine" },
  { code: "Thr", nom: "Thréonine" },
  { code: "Trp", nom: "Tryptophane" },
  { code: "Val", nom: "Valine" },
];

const ROWS = [
  { nom: "Céréales", exemple: "riz, blé, maïs", faible: "Lys", cls: "bg-carb-500 text-dark" },
  { nom: "Légumineuses", exemple: "lentilles, pois chiches", faible: "Met", cls: "bg-veg-500 text-dark" },
];

function Row({
  titre,
  exemple,
  cells,
}: Readonly<{ titre: string; exemple: string; cells: { code: string; nom: string; cls: string; faible: boolean; delay?: number }[] }>) {
  return (
    <div>
      <p>
        <span className="font-bold">{titre}</span> <span className="text-muted">({exemple})</span>
      </p>
      <ul className="mt-2 grid grid-cols-9 gap-1" aria-label={`Acides aminés : ${titre.toLowerCase()}`}>
        {cells.map((c) => (
          <li
            key={c.code}
            title={`${c.nom}${c.faible ? " : en petite quantité" : ""}`}
            className={`flex aspect-square items-center justify-center text-xs font-bold sm:text-sm ${
              c.faible ? "border-2 border-dashed border-ink bg-plate text-muted" : c.cls
            } ${c.delay === undefined ? "" : "animate-tile"}`}
            style={c.delay === undefined ? undefined : { animationDelay: `${c.delay}ms` }}
          >
            {c.code}
            <span className="sr-only">{c.faible ? " (en petite quantité)" : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Puzzle : céréales + légumineuses = les 9 acides aminés indispensables */
export function AminoComplement() {
  const [associe, setAssocie] = useState(false);

  return (
    <ToolFrame titre="Le bon duo" consigne="Case en pointillés : acide aminé présent en petite quantité">
      <div className="space-y-5 px-4 py-5 md:px-6">
        {ROWS.map((row) => (
          <Row
            key={row.nom}
            titre={row.nom}
            exemple={row.exemple}
            cells={AA.map((aa) => ({ ...aa, cls: row.cls, faible: aa.code === row.faible }))}
          />
        ))}

        <button
          type="button"
          onClick={() => setAssocie((a) => !a)}
          aria-pressed={associe}
          className="min-h-12 bg-ink px-5 py-3 font-bold text-white transition-colors duration-150 hover:bg-veg-500 hover:text-dark"
        >
          {associe ? "Séparer les deux familles" : "Associer céréales et légumineuses"}
        </button>

        <div aria-live="polite">
          {associe && (
            <>
              <Row
                titre="Céréales + légumineuses"
                exemple="dans la même journée"
                cells={AA.map((aa, i) => ({ ...aa, cls: "bg-ink text-white", faible: false, delay: i * 45 }))}
              />
              <p className="mt-3 font-semibold">
                Les 9 sont couverts : chaque famille apporte ce qui manque à l'autre.
              </p>
            </>
          )}
        </div>
      </div>
    </ToolFrame>
  );
}
