import { useState } from "react";
import { Link } from "react-router";
import { themes, type ThemeKey } from "~/lib/theme";

/**
 * L'assiette équilibrée, explorable (illustration maison, CC0).
 * Chaque case est un bouton : le choisir affiche le repère officiel correspondant.
 * Seul moment animé au chargement de l'accueil : les cases se posent une à une.
 */

type ZoneId = "legumes" | "feculents" | "proteines" | "eau" | "laitier" | "fruit";

const ZONES: Record<
  ZoneId,
  { nom: string; part: string; theme?: ThemeKey; repere: string; detail: string; lien?: { href: string; label: string } }
> = {
  legumes: {
    nom: "Légumes",
    part: "½ assiette",
    theme: "veg",
    repere: "Au moins 5 fruits et légumes par jour",
    detail: "Crus, cuits, frais, surgelés ou en conserve : tout compte. Une portion, c'est à peu près le volume du poing.",
  },
  feculents: {
    nom: "Féculents",
    part: "¼ assiette",
    theme: "carb",
    repere: "Au moins un féculent complet par jour",
    detail: "Pain, riz, pâtes, semoule ou pommes de terre. Les versions complètes apportent plus de fibres et rassasient mieux.",
  },
  proteines: {
    nom: "Protéines",
    part: "¼ assiette",
    theme: "prot",
    repere: "Légumineuses 2 fois par semaine, viande hors volaille 500 g par semaine au plus",
    detail: "Viande, poisson, œufs ou légumes secs. Le poisson deux fois par semaine, dont un poisson gras.",
    lien: { href: "/nutriments/proteines/animales-vs-vegetales", label: "Comparer protéines animales et végétales" },
  },
  eau: {
    nom: "Eau",
    part: "À volonté",
    repere: "La seule boisson indispensable",
    detail: "Environ 1,5 litre de boissons par jour, plus quand il fait chaud ou après le sport.",
  },
  laitier: {
    nom: "Produit laitier",
    part: "2 par jour",
    repere: "Deux produits laitiers par jour pour un adulte",
    detail: "Lait, yaourt ou fromage. Ils apportent calcium et protéines.",
    lien: { href: "/nutriments/vitamines-et-mineraux", label: "Voir les besoins en calcium" },
  },
  fruit: {
    nom: "Fruit",
    part: "1 portion",
    theme: "veg",
    repere: "Il compte dans les 5 fruits et légumes",
    detail: "Un fruit entier plutôt qu'un jus : il garde ses fibres. Un verre de jus par jour au maximum.",
  },
};

function Zone({
  id,
  selected,
  onSelect,
  className,
  index,
  children,
}: Readonly<{
  id: ZoneId;
  selected: boolean;
  onSelect: (id: ZoneId) => void;
  className: string;
  index: number;
  children: React.ReactNode;
}>) {
  const z = ZONES[id];
  // Eau et produits laitiers : en neutre, pour s'en tenir aux couleurs de l'assiette
  const fond = z.theme ? themes[z.theme].bg500 : "bg-faience";
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${z.nom}, ${z.part}`}
      onClick={() => onSelect(id)}
      className={`group relative animate-tile overflow-hidden rounded-md ${fond} ${className} transition-[outline-color,filter] duration-150 hover:brightness-105 ${
        selected ? "outline-4 -outline-offset-4 outline-ink" : "outline-0"
      }`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {children}
      </svg>
      <span
        className={`absolute left-0 top-0 px-2 py-1 text-sm font-bold ${
          selected ? "bg-ink text-white" : `bg-plate text-ink`
        }`}
      >
        {z.nom}
      </span>
    </button>
  );
}

export function PlateExplorer() {
  const [actif, setActif] = useState<ZoneId>("legumes");
  const z = ZONES[actif];

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] gap-3 sm:gap-4">
        {/* L'assiette */}
        <div className="aspect-square rounded-lg border-2 border-ink bg-plate p-2.5 sm:p-3.5">
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
            <Zone id="legumes" index={0} selected={actif === "legumes"} onSelect={setActif} className="row-span-2">
              <rect x="22" y="22" width="16" height="16" transform="rotate(45 30 30)" fill="var(--color-veg-800)" />
              <rect x="56" y="40" width="12" height="12" transform="rotate(45 62 46)" fill="var(--color-veg-100)" />
              <polygon points="34,58 56,58 45,90" fill="var(--color-veg-100)" />
              <rect x="41" y="50" width="8" height="8" fill="var(--color-veg-800)" />
              <rect x="66" y="70" width="14" height="14" fill="var(--color-veg-800)" />
            </Zone>
            <Zone id="feculents" index={1} selected={actif === "feculents"} onSelect={setActif} className="">
              <g fill="var(--color-carb-800)">
                <rect x="24" y="34" width="18" height="8" />
                <rect x="54" y="42" width="18" height="8" />
                <rect x="34" y="58" width="18" height="8" />
                <rect x="62" y="68" width="18" height="8" />
              </g>
            </Zone>
            <Zone id="proteines" index={2} selected={actif === "proteines"} onSelect={setActif} className="">
              <rect x="22" y="40" width="36" height="22" fill="var(--color-prot-100)" />
              <polygon points="58,51 76,38 76,64" fill="var(--color-prot-100)" />
              <rect x="28" y="46" width="6" height="6" fill="var(--color-ink)" />
              <rect x="26" y="72" width="9" height="9" fill="var(--color-prot-800)" />
              <rect x="40" y="72" width="9" height="9" fill="var(--color-prot-800)" />
              <rect x="54" y="72" width="9" height="9" fill="var(--color-prot-800)" />
            </Zone>
          </div>
        </div>

        {/* À côté de l'assiette */}
        <div className="grid w-16 grid-rows-3 gap-3 sm:w-24 sm:gap-4">
          <Zone id="eau" index={3} selected={actif === "eau"} onSelect={setActif} className="border-2 border-ink">
            <rect x="0" y="34" width="100" height="66" fill="var(--color-line)" />
          </Zone>
          <Zone id="laitier" index={4} selected={actif === "laitier"} onSelect={setActif} className="border-2 border-ink">
            <rect x="22" y="44" width="56" height="44" fill="var(--color-plate)" />
            <rect x="22" y="44" width="56" height="10" fill="var(--color-ink)" />
          </Zone>
          <Zone id="fruit" index={5} selected={actif === "fruit"} onSelect={setActif} className="border-2 border-ink">
            <rect x="28" y="44" width="44" height="44" fill="var(--color-prot-500)" />
            <path d="M50 44 v-16 a16 16 0 0 1 16 16 z" fill="var(--color-veg-800)" />
          </Zone>
        </div>
      </div>

      {/* Repère de la case choisie */}
      <div
        aria-live="polite"
        className="mt-4 rounded-lg border-2 border-ink bg-faience px-5 py-4"
        key={actif}
      >
        <p className="flex items-baseline justify-between gap-4 font-bold">
          <span className="flex items-center gap-2">
            {z.theme && <span className={`h-3 w-3 ${themes[z.theme].bg500}`} aria-hidden="true" />}
            {z.nom}
          </span>
          <span className="figure text-lg">{z.part}</span>
        </p>
        <p className="heading mt-1 animate-fade text-xl">{z.repere}</p>
        <p className="mt-2 text-muted">{z.detail}</p>
        {z.lien && (
          <Link to={z.lien.href} className="link mt-3 inline-block font-semibold">
            {z.lien.label}
          </Link>
        )}
      </div>
      <p className="sr-only">Les cases de l'assiette sont des boutons : choisissez-en une pour lire le repère.</p>
    </div>
  );
}
