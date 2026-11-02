import { Link } from "react-router";
import { CarteFiche, EnergieParGramme } from "~/components/apprendre";
import { PixelBand } from "~/components/pixel-band";
import { SourceBadges } from "~/components/ui";
import { bases } from "~/lib/content";

export const meta = () => [
  { title: "Apprendre les bases | nutrinfo" },
  {
    name: "description",
    content: "C'est quoi une protéine, un glucide, un lipide, une calorie ? Les bases de la nutrition en fiches courtes.",
  },
];

export default function Apprendre() {
  return (
    <>
      <PixelBand focus="tool" />
      <header className="border-b-2 border-ink bg-tool-100">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link to="/" className="hover:text-ink hover:underline">
              Accueil
            </Link>{" "}
            / <span className="font-semibold text-ink">Apprendre</span>
          </nav>
          <h1 className="display mt-8 max-w-[18ch] text-[2.5rem] md:text-7xl">Apprendre les bases</h1>
          <p className="mt-6 max-w-[58ch] text-lg md:text-xl">
            Ce que contient notre assiette, et à quoi ça sert. {bases.length} fiches courtes, à lire dans
            l'ordre ou au choix, avec une idée reçue à démêler dans chacune.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 py-12 md:px-6">
        <section aria-labelledby="familles-titre" className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="max-w-[58ch]">
            <h2 id="familles-titre" className="heading text-3xl md:text-4xl">
              Deux grandes familles
            </h2>
            <p className="mt-4 text-lg">
              Les <strong>macronutriments</strong> (protéines, glucides, lipides) sont ceux qu'on mange en
              grande quantité. Ils apportent l'énergie et les matériaux du corps.
            </p>
            <p className="mt-4 text-lg">
              Les <strong>micronutriments</strong> (vitamines, minéraux) n'apportent pas d'énergie. Il en faut
              très peu, mais le corps ne peut pas s'en passer. Les <strong>fibres</strong> et l'
              <strong>eau</strong> complètent le tableau.
            </p>
          </div>
          <EnergieParGramme />
        </section>

        <section aria-labelledby="fiches-titre" className="mt-16">
          <h2 id="fiches-titre" className="heading text-3xl md:text-4xl">
            Les fiches
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bases.map((f, i) => (
              <li key={f.id}>
                <CarteFiche fiche={f} numero={i + 1} />
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 space-y-3 border-t-2 border-ink pt-5">
          <SourceBadges codes={["UE-INCO", "ANSES-2016", "ANSES-2021"]} />
          <p className="text-sm text-muted">
            Rédigé à partir des sources citées, en attente de relecture par un·e professionnel·le de la nutrition.
          </p>
        </div>
      </div>
    </>
  );
}
