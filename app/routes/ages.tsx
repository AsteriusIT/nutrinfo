import { Link } from "react-router";
import { PixelBand } from "~/components/pixel-band";
import { PROFILS } from "~/data/profils";

export const meta = () => [
  { title: "Selon mon âge | Asterius Nutrition" },
  {
    name: "description",
    content: "Ce qui change dans l'alimentation de la naissance au grand âge : bébé, enfant, adulte, grossesse, senior.",
  },
];

// Ordre chronologique : ici la frise a du sens, ce sont des étapes de la vie.
const FRISE = ["bebe", "enfant", "adulte", "grossesse", "senior"];

export default function Ages() {
  const etapes = FRISE.map((id) => PROFILS.find((p) => p.id === id)!);

  return (
    <>
      <PixelBand focus="age" />
      <header className="border-b-2 border-ink bg-age-100">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link to="/" className="hover:text-ink hover:underline">
              Accueil
            </Link>{" "}
            / <span className="font-semibold text-ink">Selon mon âge</span>
          </nav>
          <h1 className="display mt-8 max-w-[16ch] text-[2.5rem] md:text-7xl">Selon mon âge</h1>
          <p className="mt-6 max-w-[58ch] text-lg md:text-xl">
            Les grands repères valent pour tous. Mais à certains moments de la vie, des besoins
            précis changent : voici lesquels.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
        <ol className="relative space-y-6 border-l-4 border-age-500 pl-6 md:pl-10">
          {etapes.map((p) => (
            <li key={p.id} className="relative">
              <span className="absolute -left-[2.25rem] top-6 h-5 w-5 border-4 border-plate bg-age-500 md:-left-[3.25rem]" aria-hidden="true" />
              <article className="grid border-2 border-ink md:grid-cols-[15rem_1fr]">
                <div className="border-b-2 border-ink bg-age-100 p-5 md:border-b-0 md:border-r-2">
                  <p className="figure text-age-800">{p.age}</p>
                  <h2 className="display mt-1 text-3xl">{p.label}</h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-lg">
                        <span className="mt-[0.5em] h-2.5 w-2.5 shrink-0 bg-age-500" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {p.href && p.cta ? (
                    <Link
                      to={p.href}
                      className="mt-5 inline-flex min-h-11 items-center bg-ink px-5 py-2.5 font-bold text-white transition-colors duration-150 hover:bg-age-500 hover:text-light"
                    >
                      {p.cta}
                    </Link>
                  ) : (
                    <p className="mt-5 text-sm text-muted">Page détaillée en préparation.</p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-muted">
          Sources :{" "}
          <Link to="/sources#ANSES-2019" className="link">
            ANSES 2019
          </Link>
          ,{" "}
          <Link to="/sources#SPF-1000J" className="link">
            Santé publique France
          </Link>
          ,{" "}
          <Link to="/sources#HAS-2021" className="link">
            HAS 2021
          </Link>
          .
        </p>
      </div>
    </>
  );
}
