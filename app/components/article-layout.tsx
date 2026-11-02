import type { ReactNode } from "react";
import { Link } from "react-router";
import type { PageFrontmatter } from "~/lib/content";
import { themes } from "~/lib/theme";
import { PixelBand } from "./pixel-band";
import { KeyPoints, SourceBadges, Tag } from "./ui";

const dateFr = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

/** Gabarit du type 1 : page plein contenu */
export function ArticleLayout({ fm, children }: Readonly<{ fm: PageFrontmatter; children: ReactNode }>) {
  const t = themes[fm.theme];

  return (
    <article>
      <PixelBand />
      <header className="border-b-2 border-ink bg-faience">
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-6 md:px-6 md:pb-16">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap gap-x-2 text-sm text-muted">
              {fm.fil.map((c, i) => (
                <li key={c.label} className="flex gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? (
                    <Link to={c.href} className="hover:text-ink hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="display mt-8 max-w-[18ch] text-[2.5rem] md:text-7xl">{fm.titre}</h1>
          <p className="mt-6 max-w-[58ch] text-lg md:text-xl">{fm.chapeau}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag accent>{t.label}</Tag>
            {fm.ages?.map((a) => (
              <Tag key={a}>{a}</Tag>
            ))}
            <Tag>{fm.duree} min de lecture</Tag>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 md:px-6">
        <div className="mx-auto max-w-[72ch] py-12">
          <KeyPoints items={fm.a_retenir} />
          <div className="prose-carre mt-4">{children}</div>

          <footer className="mt-16 space-y-3 border-t-2 border-ink pt-5">
            <SourceBadges codes={fm.sources} />
            <p className="text-sm text-muted">
              Mis à jour en {dateFr(fm.maj)}.
              {fm.relecture === "non-relu" &&
                " Rédigé à partir des sources citées, en attente de relecture par un·e professionnel·le de la nutrition."}
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}
