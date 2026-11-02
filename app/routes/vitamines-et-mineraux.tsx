import { Link } from "react-router";
import { FicheGrid } from "~/components/fiche-card";
import { PixelBand } from "~/components/pixel-band";
import { SourceBadges } from "~/components/ui";
import { nutriments } from "~/lib/content";

export const meta = () => [
  { title: "Vitamines et minéraux | nutrinfo" },
  {
    name: "description",
    content: "Le rôle, le besoin quotidien et les meilleures sources de chaque vitamine et minéral, sur une fiche.",
  },
];

export default function VitaminesEtMineraux() {
  return (
    <>
      <PixelBand />
      <header className="border-b-2 border-ink bg-faience">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link to="/" className="hover:text-ink hover:underline">
              Accueil
            </Link>{" "}
            / Nutriments / <span className="font-semibold text-ink">Vitamines et minéraux</span>
          </nav>
          <h1 className="display mt-8 max-w-[18ch] text-[2.5rem] md:text-7xl">Vitamines et minéraux</h1>
          <p className="mt-6 max-w-[58ch] text-lg md:text-xl">
            Une alimentation variée couvre presque tous les besoins. Chaque fiche donne le rôle, la
            quantité conseillée à un adulte et les aliments qui en apportent le plus.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1240px] px-4 py-10 md:px-6" aria-label="Fiches">
        <FicheGrid fiches={nutriments.fiches} categories={nutriments.categories} vigilances={nutriments.vigilances} />
        <div className="mt-12 space-y-3 border-t-2 border-ink pt-5">
          <SourceBadges codes={["ANSES-2021", "ANSES-2016", "OMS-sel"]} />
          <p className="text-sm text-muted">
            Valeurs de référence pour un adulte en bonne santé, en attente de relecture par un·e
            professionnel·le. Ne prenez de complément alimentaire que sur avis médical.
          </p>
        </div>
      </section>
    </>
  );
}
