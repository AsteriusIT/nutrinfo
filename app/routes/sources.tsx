import { PixelBand } from "~/components/pixel-band";
import { sources } from "~/lib/content";

export const meta = () => [
  { title: "Nos sources et notre méthode | Asterius Nutrition" },
  { name: "description", content: "Les références scientifiques et officielles utilisées sur le site." },
];

const METHODE = [
  {
    titre: "Des sources officielles",
    texte: "Les agences sanitaires françaises (ANSES, Santé publique France, HAS) d'abord, puis européennes et internationales (EFSA, OMS).",
  },
  {
    titre: "Chaque chiffre est sourcé",
    texte: "Chaque page liste ses références, qui renvoient à cette page. La composition des aliments vient de la table CIQUAL.",
  },
  {
    titre: "Une relecture à venir",
    texte: "Les contenus attendent la relecture d'un·e professionnel·le de la nutrition. Ce site ne remplace pas un avis médical.",
  },
];

export default function Sources() {
  return (
    <>
      <PixelBand />
      <div className="mx-auto max-w-[1240px] px-4 py-12 md:px-6">
        <h1 className="display max-w-[18ch] text-[2.5rem] md:text-7xl">Nos sources et notre méthode</h1>
        <div className="mt-10 grid border-2 border-ink md:grid-cols-3">
          {METHODE.map((m) => (
            <div key={m.titre} className="border-b-2 border-ink p-5 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0">
              <h2 className="heading text-xl">{m.titre}</h2>
              <p className="mt-2 text-muted">{m.texte}</p>
            </div>
          ))}
        </div>

        <h2 className="heading mt-16 text-3xl">Références</h2>
        <ul className="mt-6 border-t-2 border-ink">
          {sources.map((s) => (
            <li
              key={s.code}
              id={s.code}
              className="grid scroll-mt-24 gap-1 border-b border-line py-4 target:bg-carb-100 md:grid-cols-[13rem_1fr_4rem] md:gap-4"
            >
              <span className="font-bold">{s.code.replaceAll("-", " ")}</span>
              <span>
                {s.url ? (
                  <a href={s.url} className="link" rel="noopener">
                    {s.titre}
                  </a>
                ) : (
                  s.titre
                )}
                <span className="block text-sm text-muted">{s.organisme}</span>
              </span>
              <span className="figure text-muted md:text-right">{s.annee}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
