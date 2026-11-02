import { Link } from "react-router";
import { NAVIGATION } from "~/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-faience">
      {/* Plan du site : toutes les pages, même quand le menu est replié */}
      <nav aria-label="Plan du site" className="mx-auto grid max-w-[1240px] gap-10 border-b border-line px-4 pb-10 pt-14 sm:grid-cols-3 md:px-6">
        {NAVIGATION.map((r) => (
          <div key={r.id}>
            <h2 className="font-bold">
              <Link to={r.accueil.href} className="hover:underline">
                {r.label}
              </Link>
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {r.liens.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-muted hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <p className="heading text-lg">nutrinfo</p>
          <p className="mt-3 max-w-[44ch] text-muted">
            Des repères simples pour bien manger à chaque âge, tirés des recommandations officielles
            françaises et européennes.
          </p>
        </div>
        <div>
          <h2 className="font-bold">Ce site ne remplace pas un avis médical</h2>
          <p className="mt-2 text-sm text-muted">
            Pour une question sur votre santé, parlez-en à un médecin ou à un·e diététicien·ne.
          </p>
        </div>
        <div>
          <h2 className="font-bold">Le site</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <Link to="/sources" className="link">
                Nos sources et notre méthode
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="link">
                Données personnelles
              </Link>
            </li>
            <li>
              Contenus dans le{" "}
              <a className="link" href="https://creativecommons.org/publicdomain/zero/1.0/deed.fr" rel="license noopener">
                domaine public (CC0)
              </a>
            </li>
            <li className="text-muted">Composition des aliments : table CIQUAL de l'ANSES</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
