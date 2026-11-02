import { useState } from "react";
import { arrondi } from "~/data/ciqual";
import { G_PAR_MORCEAU, PRODUITS, REPERE_OMS_G, type FamilleGouter, type IdProduit, type ProduitSucre } from "~/data/sucres";
import { NoteDonnees, ToolFrame } from "./ui";

const PAR_RANGEE = 5; // une rangée de 5 morceaux = 25 g = repère OMS
const fr = (n: number) => arrondi(n).toLocaleString("fr-FR");

/** Découpe une quantité de sucre en morceaux de 5 g ; le dernier peut être partiel (0 à 1) */
function morceaux(g: number, type: "libre" | "naturel") {
  const n = g / G_PAR_MORCEAU;
  const pleins = Math.floor(n);
  const reste = n - pleins;
  const out = Array.from({ length: pleins }, () => ({ type, part: 1 }));
  if (reste >= 0.1) out.push({ type, part: reste });
  return out;
}

/**
 * Le bocal : des morceaux de sucre (carrés blancs) tombent et s'empilent par rangées de 5.
 * Plein = sucre libre ; contour = sucre naturellement présent (fruit entier, lait).
 * La ligne jaune marque 25 g, le repère OMS pour toute une journée.
 */
export function SugarJar({ libres, naturels }: Readonly<{ libres: number; naturels: number }>) {
  const cubes = [...morceaux(libres, "libre"), ...morceaux(naturels, "naturel")];
  const rangees = Math.max(2, Math.ceil(cubes.length / PAR_RANGEE));
  const total = libres + naturels;
  const label =
    total === 0
      ? "Pas de sucre"
      : `${fr(total)} g de sucres, soit environ ${fr(total / G_PAR_MORCEAU)} morceaux, dont ${fr(libres)} g de sucres libres`;

  return (
    <div className="bg-dark p-3" role="img" aria-label={label}>
      <div className="relative grid grid-cols-5 gap-1.5" style={{ gridTemplateRows: `repeat(${rangees}, minmax(0, 1fr))` }}>
        {Array.from({ length: rangees * PAR_RANGEE }, (_, slot) => {
          // On remplit par le bas : la case 0 est en bas à gauche
          const row = rangees - 1 - Math.floor(slot / PAR_RANGEE);
          const col = slot % PAR_RANGEE;
          const c = cubes[slot];
          return (
            <span key={slot} className="relative aspect-square bg-light/5" style={{ gridRow: row + 1, gridColumn: col + 1 }}>
              {c && (
                <span
                  className={`absolute inset-y-0 left-0 animate-drop ${
                    c.type === "libre" ? "bg-light" : "border-[3px] border-light bg-light/15"
                  }`}
                  style={{ width: `${c.part * 100}%`, animationDelay: `${col * 60 + (slot >= PAR_RANGEE ? 120 : 0)}ms` }}
                />
              )}
            </span>
          );
        })}
        {/* Repère OMS : au-dessus de la première rangée */}
        <span
          className="pointer-events-none absolute inset-x-[-0.75rem] border-t-[3px] border-dashed border-carb-500"
          style={{ bottom: `calc((100% - ${(rangees - 1) * 6}px) / ${rangees} + 1.5px)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function Legende() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm" aria-label="Légende">
      <li className="flex items-center gap-2">
        <span className="bg-dark p-1" aria-hidden="true">
          <span className="block h-3 w-3 bg-light" />
        </span>
        Sucre ajouté ou libre
      </li>
      <li className="flex items-center gap-2">
        <span className="bg-dark p-1" aria-hidden="true">
          <span className="block h-3 w-3 border-2 border-light bg-light/15" />
        </span>
        Sucre du fruit entier ou du lait
      </li>
      <li className="flex items-center gap-2">
        <span className="w-5 border-t-[3px] border-dashed border-carb-500" aria-hidden="true" />
        {REPERE_OMS_G} g : repère OMS pour une journée
      </li>
    </ul>
  );
}

function Verdict({ libres }: Readonly<{ libres: number }>) {
  const pct = Math.round((libres / REPERE_OMS_G) * 100);
  if (libres < 0.5) return <>Pas de sucre libre.</>;
  if (pct >= 100) return <>Cette portion dépasse à elle seule le repère pour toute une journée ({pct} %).</>;
  return <>Cette portion représente {pct} % du repère pour toute une journée.</>;
}

/** « Où se cache le sucre ? » : un produit à la fois, les morceaux tombent dans le bocal */
export function SugarHunt({
  ids,
  titre = "Où se cache le sucre ?",
  initial,
}: Readonly<{ ids: IdProduit[]; titre?: string; initial?: IdProduit }>) {
  const [actif, setActif] = useState<IdProduit>(initial ?? ids[0]);
  const p: ProduitSucre = PRODUITS[actif];
  const libres = p.total - p.naturels;

  return (
    <ToolFrame titre={titre} consigne="Choisissez un produit : chaque carré est un morceau de sucre de 5 g">
      <div className="grid gap-6 px-4 py-5 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:px-6">
        <ul className="grid content-start gap-1.5 sm:grid-cols-2" aria-label="Produits">
          {ids.map((id) => {
            const x = PRODUITS[id];
            const on = id === actif;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActif(id)}
                  className={`flex h-full w-full flex-col items-start border-2 px-3 py-2 text-left transition-colors duration-150 ${
                    on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                  }`}
                >
                  <span className="font-semibold">{x.nom}</span>
                  <span className={`text-sm ${on ? "text-white/80" : "text-muted"}`}>{x.portion}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div>
          <p className="font-semibold">
            {p.nom}, {p.portion}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3" aria-live="polite">
            <span className="figure text-5xl">{fr(p.total)} g</span>
            <span className="text-lg font-semibold">
              {p.total < 0.5 ? "de sucres : rien à signaler" : `≈ ${fr(p.total / G_PAR_MORCEAU)} morceaux de sucre`}
            </span>
          </p>
          <div className="mt-4 max-w-xs">
            {/* La clé relance l'animation à chaque produit */}
            <SugarJar key={actif} libres={libres} naturels={p.naturels} />
          </div>
          <Legende />
          <p className="mt-4 font-semibold">
            <Verdict libres={libres} />
          </p>
          {p.note && <p className="mt-2 text-muted">{p.note}</p>}
        </div>
      </div>
      <div className="px-4 pb-5 md:px-6">
        <NoteDonnees>
          Sucres totaux calculés pour la portion à partir de la table CIQUAL 2020 de l'ANSES. Repère : OMS
          2015, moins de 5 % de l'énergie en sucres libres, soit environ 25 g par jour pour un adulte.
        </NoteDonnees>
      </div>
    </ToolFrame>
  );
}

const FAMILLES: { id: FamilleGouter; label: string }[] = [
  { id: "fruit", label: "Fruit" },
  { id: "laitier", label: "Produit laitier" },
  { id: "cereale", label: "Produit céréalier" },
  { id: "sucre", label: "Produit sucré" },
  { id: "boisson", label: "Boisson" },
];
const UTILES: FamilleGouter[] = ["fruit", "laitier", "cereale"];

const GOUTER: IdProduit[] = [
  "pomme", "banane", "baguette", "painAuLait", "biscuits", "yaourtNature", "yaourtFruits", "lait",
  "chocolat", "pateATartiner", "barre", "eau", "jusOrange", "cola",
];

/** Composer un goûter : les morceaux s'ajoutent au bocal, les familles couvertes s'affichent */
export function GouterBuilder() {
  const [choix, setChoix] = useState<IdProduit[]>(["baguette", "chocolat", "jusOrange"]);
  const sel = choix.map((id) => PRODUITS[id]);
  const total = sel.reduce((s, x) => s + x.total, 0);
  const naturels = sel.reduce((s, x) => s + x.naturels, 0);
  const libres = total - naturels;
  const couvertes = UTILES.filter((f) => sel.some((x) => x.famille === f));
  const toggle = (id: IdProduit) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  let message = "Ajoutez des aliments pour composer le goûter.";
  if (sel.length > 0) {
    message =
      couvertes.length >= 2
        ? "Bon équilibre : le goûter réunit plusieurs familles."
        : "Pour tenir jusqu'au dîner, associez deux familles parmi fruit, produit laitier et produit céréalier.";
    if (libres > 15) message += " Beaucoup de sucre ajouté : remplacez une boisson ou un produit sucré par de l'eau ou un fruit.";
  }

  return (
    <ToolFrame titre="Composer un goûter" consigne="Touchez les aliments pour les ajouter ou les retirer">
      <div className="grid gap-6 px-4 py-5 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:px-6">
        <div className="space-y-4">
          {FAMILLES.map((f) => (
            <fieldset key={f.id}>
              <legend className="text-sm font-bold text-muted">{f.label}</legend>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {GOUTER.filter((id) => PRODUITS[id].famille === f.id).map((id) => {
                  const x = PRODUITS[id];
                  const on = choix.includes(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(id)}
                        className={`border-2 px-3 py-1.5 text-left transition-colors duration-150 ${
                          on ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                        }`}
                      >
                        <span className="font-semibold">{x.nom}</span>
                        <span className={`ml-1.5 text-sm ${on ? "text-white/80" : "text-muted"}`}>{x.portion}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>

        <div>
          <ul className="grid grid-cols-3 gap-px border-2 border-ink bg-ink" aria-label="Familles couvertes">
            {UTILES.map((f) => {
              const ok = couvertes.includes(f);
              return (
                <li key={f} className={`px-2 py-2 text-center text-sm font-semibold ${ok ? "bg-age-500 text-light" : "bg-plate text-muted"}`}>
                  {ok ? "✓ " : ""}
                  {FAMILLES.find((x) => x.id === f)!.label}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3" aria-live="polite">
            <span className="figure text-5xl">{fr(libres)} g</span>
            <span className="text-lg font-semibold">de sucres ajoutés ou libres</span>
          </p>
          <p className="text-muted">
            {total > 0 ? `Sur ${fr(total)} g de sucres au total.` : " "}
          </p>
          <div className="mt-3 max-w-xs">
            <SugarJar libres={libres} naturels={naturels} />
          </div>
          <Legende />
          <p className="mt-4 font-semibold">{message}</p>
        </div>
      </div>
      <div className="px-4 pb-5 md:px-6">
        <NoteDonnees>
          Sucres calculés à partir de la table CIQUAL 2020 de l'ANSES. Le repère de 25 g concerne un adulte et
          toute une journée : pour un enfant, qui mange moins, il est plus bas.
        </NoteDonnees>
      </div>
    </ToolFrame>
  );
}
