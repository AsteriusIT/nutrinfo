import { Link, useParams } from "react-router";
import { CarresEnergie, VraiOuFaux } from "~/components/apprendre";
import { PixelBand } from "~/components/pixel-band";
import { creerTermes } from "~/components/terme";
import { KeyPoints, SourceBadges, Tag } from "~/components/ui";
import { bases } from "~/lib/content";
import type { Route } from "./+types/apprendre-fiche";
import NotFound from "./not-found";

// Les adresses /apprendre/:id sont pré-rendues d'après content/fiches/bases.yaml (react-router.config.ts)

export const meta = ({ params }: Route.MetaArgs) => {
  const f = bases.find((x) => x.id === params.id);
  return f
    ? [{ title: `${f.question} | nutrinfo` }, { name: "description", content: f.reponse }]
    : [{ title: "Page introuvable | nutrinfo" }];
};

export default function FicheApprendre() {
  const { id } = useParams();
  const index = bases.findIndex((x) => x.id === id);
  if (index === -1) return <NotFound />;

  const f = bases[index];
  const precedente = bases[index - 1];
  // Mots techniques expliqués sur place, la première fois qu'ils apparaissent dans la fiche
  const expliquer = creerTermes();
  const suivante = bases[index + 1];

  return (
    <article>
      <PixelBand />
      <header className="border-b-2 border-ink bg-faience">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6 md:pb-16">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap gap-x-2 text-sm text-muted">
              <li>
                <Link to="/" className="hover:text-ink hover:underline">
                  Accueil
                </Link>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">/</span>
                <Link to="/apprendre" className="hover:text-ink hover:underline">
                  Apprendre
                </Link>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="font-semibold text-ink">
                  {f.court}
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="display mt-8 max-w-[18ch] text-[2.5rem] md:text-7xl">{f.question}</h1>
          <p className="mt-6 max-w-[58ch] text-lg md:text-xl">{expliquer(f.reponse)}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag accent>
              Fiche {index + 1} sur {bases.length}
            </Tag>
            <Tag>3 min de lecture</Tag>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 md:px-6">
        <div className="mx-auto max-w-[72ch] space-y-12 py-12">
          <KeyPoints items={f.a_retenir} />

          <section aria-labelledby="image-titre" className="rounded-lg border-l-8 border-ink bg-faience px-6 py-5">
            <h2 id="image-titre" className="heading text-2xl">
              Pour se le représenter
            </h2>
            <p className="mt-3 text-lg">{expliquer(f.image)}</p>
          </section>

          <section aria-labelledby="roles-titre">
            <h2 id="roles-titre" className="heading text-3xl">
              À quoi ça sert ?
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {f.roles.map((r) => (
                <li key={r} className="flex gap-3 rounded-lg border-2 border-line px-4 py-3">
                  <span className="mt-[0.45em] h-2.5 w-2.5 shrink-0 bg-accent-500" aria-hidden="true" />
                  <span>{expliquer(r)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sortes-titre">
            <h2 id="sortes-titre" className="heading text-3xl">
              {f.id === "energie" ? "Ce qui en apporte, et ce qui n'en apporte pas" : "Les différentes sortes"}
            </h2>
            <ul className="mt-5 space-y-3">
              {f.sortes.map((s) => (
                <li key={s.nom} className="overflow-hidden rounded-lg border-2 border-ink">
                  <h3 className="border-b border-line bg-faience px-4 py-2.5 font-bold">{s.nom}</h3>
                  <div className="px-4 py-3">
                    <p>{expliquer(s.texte)}</p>
                    <p className="mt-1.5 text-sm text-muted">
                      <span className="font-semibold">Exemples : </span>
                      {s.exemples}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sources-titre">
            <h2 id="sources-titre" className="heading text-3xl">
              Où en trouver ?
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {f.sources_alimentaires.map((a) => (
                <li key={a} className="rounded-md border-2 border-line px-3 py-1.5 font-semibold">
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section aria-labelledby="chiffre-titre" className="rounded-lg border-2 border-ink p-5">
              <h2 id="chiffre-titre" className="tag text-muted">
                Le chiffre à retenir
              </h2>
              <p className="figure mt-2 text-5xl">{f.chiffre.valeur}</p>
              <p className="mt-1 font-semibold">{f.chiffre.legende}</p>
              {f.chiffre.note && <p className="mt-2 text-sm text-muted">{f.chiffre.note}</p>}
              <p className="mt-3 text-sm">
                <Link to={`/sources#${f.chiffre.source}`} className="link text-muted hover:text-ink">
                  Source : {f.chiffre.source.replaceAll("-", " ")}
                </Link>
              </p>
            </section>
            {f.kcal !== undefined && (
              <section aria-labelledby="energie-titre" className="rounded-lg border-2 border-ink p-5">
                <h2 id="energie-titre" className="tag text-muted">
                  Énergie dans 1 gramme
                </h2>
                <p className="figure mt-2 text-5xl">{f.kcal} kcal</p>
                <div className="mt-4">
                  <CarresEnergie kcal={f.kcal} accent />
                </div>
                <p className="mt-3 text-sm text-muted">
                  {f.kcal === 0 ? "N'apporte pas d'énergie." : "Un carré = 1 kcal. Les lipides, les plus énergétiques, en apportent 9."}{" "}
                  <Link to="/apprendre/energie" className="link hover:text-ink">
                    C'est quoi une calorie ?
                  </Link>
                </p>
              </section>
            )}
          </div>

          <VraiOuFaux idee={f.idee_recue} />

          {f.lien && (
            <p className="text-lg">
              Pour aller plus loin :{" "}
              <Link to={f.lien.href} className="link font-bold">
                {f.lien.label}
              </Link>
            </p>
          )}

          <footer className="space-y-3 border-t-2 border-ink pt-5">
            <SourceBadges codes={f.sources} />
            <p className="text-sm text-muted">
              Rédigé à partir des sources citées, en attente de relecture par un·e professionnel·le de la nutrition.
            </p>
          </footer>

          <nav aria-label="Fiches précédente et suivante" className="grid gap-3 sm:grid-cols-2">
            {precedente ? (
              <FicheVoisine fiche={precedente} sens="Fiche précédente" />
            ) : (
              <span className="hidden sm:block" />
            )}
            {suivante ? (
              <FicheVoisine fiche={suivante} sens="Fiche suivante" alignDroite />
            ) : (
              <FicheVoisine href="/apprendre" titre="Toutes les fiches" sens="Fin du parcours" alignDroite />
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}

function FicheVoisine({
  fiche,
  href,
  titre,
  sens,
  alignDroite = false,
}: Readonly<{ fiche?: (typeof bases)[number]; href?: string; titre?: string; sens: string; alignDroite?: boolean }>) {
  return (
    <Link
      to={fiche ? `/apprendre/${fiche.id}` : href!}
      className={`group flex flex-col rounded-lg border-2 border-ink px-5 py-4 transition-colors duration-150 hover:bg-faience ${alignDroite ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="text-sm text-muted">
        {alignDroite ? "" : "← "}
        {sens}
        {alignDroite ? " →" : ""}
      </span>
      <span className="heading mt-1 flex items-center gap-2 text-xl">
        {fiche ? fiche.court : titre}
      </span>
    </Link>
  );
}
