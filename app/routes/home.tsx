import { useState } from "react";
import { Link } from "react-router";
import { PixelBand } from "~/components/pixel-band";
import { EXEMPLES, Loupe, ouvrirRecherche } from "~/components/recherche";
import { ButtonLink } from "~/components/ui";
import { PlateExplorer } from "~/illustrations/plate";
import { PROFILS } from "~/data/profils";

export const meta = () => [
  { title: "nutrinfo : bien manger à chaque âge de la vie" },
  {
    name: "description",
    content:
      "Des repères simples et sourcés pour bien manger selon son âge : assiette équilibrée, protéines, vitamines, grossesse, seniors.",
  },
];

// Repères PNNS 4, repris par le PNNS 5 (adultes)
const REPERES: { titre: string; sens: string; signe: string; items: [string, string][] }[] = [
  {
    titre: "Augmenter",
    sens: "À manger plus souvent",
    signe: "+",
    items: [
      ["Fruits et légumes", "5 par jour"],
      ["Légumes secs", "2 fois par semaine"],
      ["Fruits à coque", "1 poignée par jour"],
      ["Activité physique", "30 min par jour"],
    ],
  },
  {
    titre: "Aller vers",
    sens: "À choisir de préférence",
    signe: "→",
    items: [
      ["Féculents complets", "1 par jour au moins"],
      ["Poisson", "2 fois par semaine"],
      ["Huiles colza, noix, olive", "chaque jour"],
      ["Produits laitiers", "2 par jour"],
    ],
  },
  {
    titre: "Réduire",
    sens: "À limiter",
    signe: "−",
    items: [
      ["Viande hors volaille", "500 g par semaine"],
      ["Charcuterie", "150 g par semaine"],
      ["Sel", "moins de 5 g par jour"],
      ["Alcool", "10 verres par semaine"],
    ],
  },
];

const DISPONIBLE: { titre: string; texte: string; href: string }[] = [
  { titre: "Apprendre les bases", texte: "C'est quoi une protéine, un glucide, une calorie ? 8 fiches courtes.", href: "/apprendre" },
  { titre: "Composer son assiette", texte: "Remplissez une assiette et voyez si elle est équilibrée.", href: "/bases/assiette" },
  { titre: "Protéines animales ou végétales ?", texte: "Comparez, calculez votre besoin, associez céréales et légumineuses.", href: "/nutriments/proteines/animales-vs-vegetales" },
  { titre: "Glucides, sucres et fibres", texte: "Voyez où se cache le sucre et composez une journée riche en fibres.", href: "/nutriments/glucides" },
  { titre: "Bien s'hydrater", texte: "Combien boire, quoi boire, et le sucre des boissons en morceaux.", href: "/nutriments/eau" },
  { titre: "Vitamines et minéraux", texte: "Rôle, besoin et sources de chacun, sur une fiche.", href: "/nutriments/vitamines-et-mineraux" },
  { titre: "Selon mon âge", texte: "Ce qui change pour les enfants, pendant la grossesse et après 65 ans.", href: "/ages" },
];

const A_VENIR = ["Quelle huile choisir ?", "Lire une étiquette", "Bébés de 0 à 3 ans"];

export default function Home() {
  return (
    <>
      <PixelBand />
      <Hero />
      <Reperes />
      <ProfilSelector />
      <Explorer />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b-2 border-ink">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <h1 className="display text-[2.75rem] sm:text-6xl xl:text-[5.5rem]">Bien manger, à chaque âge de la vie</h1>
          <p className="mt-7 max-w-[46ch] text-lg md:text-xl">
            Des repères clairs, tirés des recommandations officielles françaises et européennes. Posez
            votre question, la réponse vient avec sa source.
          </p>
          {/* La question d'abord : le champ ouvre la recherche, qui affiche la réponse avant les pages */}
          <button
            type="button"
            onClick={() => ouvrirRecherche()}
            className="mt-9 flex min-h-16 w-full max-w-xl items-center gap-4 rounded-lg border-2 border-ink bg-plate px-5 text-left text-lg shadow-[6px_6px_0_var(--color-accent-500)] transition-[box-shadow,transform] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--color-accent-500)]"
          >
            <Loupe className="h-6 w-6 shrink-0" />
            <span className="flex-1 text-muted">Une question, un aliment, un nutriment…</span>
          </button>
          <ul className="mt-5 flex max-w-xl flex-wrap gap-2" aria-label="Questions fréquentes">
            {EXEMPLES.slice(0, 4).map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => ouvrirRecherche(q)}
                  className="rounded-md bg-faience px-3 py-1.5 text-left hover:bg-accent-100"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted">
            Ou touchez une case de l'assiette pour lire son repère.
          </p>
        </div>
        <PlateExplorer />
      </div>
    </section>
  );
}

function Reperes() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-20 md:px-6" aria-labelledby="reperes-titre">
      <h2 id="reperes-titre" className="heading max-w-[24ch] text-3xl md:text-5xl">
        Les repères officiels en trois mots
      </h2>
      <p className="mt-4 max-w-[60ch] text-muted">
        Le Programme national nutrition santé résume l'essentiel pour les adultes. Le PNNS 5, publié
        en avril 2026, garde ces repères.
      </p>
      <div className="mt-10 grid gap-0 overflow-hidden rounded-lg border-2 border-ink md:grid-cols-3">
        {REPERES.map((r) => {
          return (
            <div key={r.titre} className="border-b-2 border-ink last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0">
              <div className="flex items-start gap-4 border-b-2 border-ink bg-faience px-5 py-5">
                <span className="figure grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent-500 text-2xl text-dark" aria-hidden="true">
                  {r.signe}
                </span>
                <span>
                  <h3 className="display text-3xl">{r.titre}</h3>
                  <p className="mt-1 font-semibold text-muted">{r.sens}</p>
                </span>
              </div>
              <dl>
                {r.items.map(([nom, freq]) => (
                  <div key={nom} className="flex items-baseline justify-between gap-4 border-t border-line px-5 py-3 first:border-t-0">
                    <dt>{nom}</dt>
                    <dd className="text-right font-bold">{freq}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted">
        Source :{" "}
        <Link to="/sources#PNNS4" className="link">
          PNNS 4 (2019)
        </Link>
        , repris par le{" "}
        <Link to="/sources#PNNS5" className="link">
          PNNS 5 (2026)
        </Link>
        .
      </p>
    </section>
  );
}

function ProfilSelector() {
  const [actif, setActif] = useState("adulte");
  const p = PROFILS.find((x) => x.id === actif)!;

  return (
    <section className="border-y-2 border-ink bg-faience" aria-labelledby="profil-titre">
      <div className="mx-auto max-w-[1240px] px-4 py-20 md:px-6">
        <h2 id="profil-titre" className="heading text-3xl md:text-5xl">
          Vos besoins changent avec l'âge
        </h2>
        <p className="mt-4 text-muted">Choisissez une période de la vie.</p>

        <div role="tablist" aria-label="Période de la vie" className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-t-lg border-2 border-ink bg-ink sm:grid-cols-5">
          {PROFILS.map((x) => (
            <button
              key={x.id}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={actif === x.id}
              aria-controls="profil-panel"
              type="button"
              onClick={() => setActif(x.id)}
              className={`px-4 py-3 text-left transition-colors duration-150 ${
                actif === x.id ? "bg-ink text-white" : "bg-plate hover:bg-accent-100"
              }`}
            >
              <span className="block font-bold">{x.label}</span>
              <span className="text-sm opacity-80">{x.age}</span>
            </button>
          ))}
        </div>

        <div id="profil-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="rounded-b-lg border-x-2 border-b-2 border-ink bg-plate p-6 md:p-8">
          <ul className="grid gap-5 md:grid-cols-3" key={p.id}>
            {p.points.map((pt) => (
              <li key={pt} className="flex animate-fade gap-3 text-lg font-semibold leading-snug">
                <span className="mt-[0.45em] h-2.5 w-2.5 shrink-0 bg-accent-500" aria-hidden="true" />
                {pt}
              </li>
            ))}
          </ul>
          {p.href && p.cta ? (
            <div className="mt-8">
              <ButtonLink to={p.href}>{p.cta}</ButtonLink>
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted">La page détaillée pour cette période est en préparation.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Explorer() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-20 md:px-6" aria-labelledby="explorer-titre">
      <h2 id="explorer-titre" className="heading text-3xl md:text-5xl">
        Déjà disponible
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {DISPONIBLE.map((r) => {
          return (
            <li key={r.href}>
              <Link
                to={r.href}
                className="group flex h-full overflow-hidden rounded-lg border-2 border-ink transition-[box-shadow,transform] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)]"
              >
                <span className="w-5 shrink-0 bg-accent-500 transition-[width] duration-200 group-hover:w-8" aria-hidden="true" />
                <span className="p-5">
                  <span className="heading block text-xl">{r.titre}</span>
                  <span className="mt-2 block text-muted">{r.texte}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-muted">
        <span className="font-bold text-ink">En préparation : </span>
        {A_VENIR.join(", ")}.
      </p>
    </section>
  );
}
