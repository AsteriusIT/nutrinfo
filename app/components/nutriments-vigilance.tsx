import { Link } from "react-router";
import { nutriments } from "~/lib/content";
import { FicheCard } from "./fiche-card";

/** Grille des fiches nutriments à surveiller pour une situation (réutilise le type 2) */
export function NutrimentsVigilance({ pour }: Readonly<{ pour: string }>) {
  const fiches = nutriments.fiches.filter((f) => f.vigilance?.includes(pour));
  return (
    <div className="not-prose my-10">
      <ul className="grid gap-4 sm:grid-cols-2">
        {fiches.map((f) => (
          <li key={f.id}>
            <FicheCard fiche={f} />
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <Link to="/nutriments/vitamines-et-mineraux" className="link font-semibold">
          Voir toutes les vitamines et tous les minéraux
        </Link>
      </p>
    </div>
  );
}
