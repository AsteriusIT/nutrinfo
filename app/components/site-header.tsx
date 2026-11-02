import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NAVIGATION, rubriqueActive, type NavRubrique } from "~/lib/navigation";
import { themes } from "~/lib/theme";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  // Rubrique dont le panneau est ouvert (bureau), ou "mobile" pour le menu complet
  const [ouvert, setOuvert] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const active = rubriqueActive(pathname);

  // Changer de page referme le menu
  useEffect(() => setOuvert(null), [pathname]);

  // Échap ou clic en dehors de l'en-tête referment le menu
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOuvert(null);
      headerRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="menu-${ouvert}"]`)?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOuvert(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [ouvert]);

  const bascule = (id: string) => setOuvert((o) => (o === id ? null : id));
  const rubrique = NAVIGATION.find((r) => r.id === ouvert);

  return (
    <header
      ref={headerRef}
      // Un lien suivi referme le menu, même s'il mène à la page courante
      onClick={(e) => (e.target as HTMLElement).closest("a") && setOuvert(null)}
      // Menu ouvert : au-dessus du bouton de l'assistant (z-50)
      className={`sticky top-0 border-b-2 border-ink bg-plate ${ouvert ? "z-[60]" : "z-40"}`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="nutrinfo, accueil">
          <Logo />
          <span className="heading text-lg">nutrinfo</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAVIGATION.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  aria-expanded={ouvert === r.id}
                  aria-controls={`menu-${r.id}`}
                  onClick={() => bascule(r.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 font-semibold transition-colors duration-150 ${
                    ouvert === r.id || active === r.id ? "bg-ink text-white" : "hover:bg-faience"
                  }`}
                >
                  {r.label}
                  <Chevron ouvert={ouvert === r.id} />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md border-2 border-ink px-3 py-1.5 font-semibold md:hidden"
            aria-expanded={ouvert === "mobile"}
            aria-controls="menu-mobile"
            onClick={() => bascule("mobile")}
          >
            {ouvert === "mobile" ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      {rubrique && <PanneauRubrique rubrique={rubrique} pathname={pathname} />}

      {ouvert === "mobile" && (
        <nav
          id="menu-mobile"
          aria-label="Navigation principale"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t-2 border-ink md:hidden"
        >
          {NAVIGATION.map((r) => (
            <section key={r.id} aria-labelledby={`mobile-${r.id}`} className="border-b border-line px-4 py-4">
              <h2 id={`mobile-${r.id}`} className="heading text-lg">
                <Link to={r.accueil.href} className="hover:underline">
                  {r.label}
                </Link>
              </h2>
              <ul className="mt-2 grid grid-cols-2 gap-1">
                {r.liens.map((l) => (
                  <li key={l.href}>
                    <LienMenu lien={l} compact />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      )}
    </header>
  );
}

/** Panneau déroulant d'une rubrique (écran large) : présentation à gauche, liens à droite */
function PanneauRubrique({ rubrique: r, pathname }: Readonly<{ rubrique: NavRubrique; pathname: string }>) {
  const accueilActif = pathname.replace(/\/$/, "") === r.accueil.href;
  return (
    <div id={`menu-${r.id}`} className="animate-fade absolute inset-x-0 top-full hidden border-b-2 border-ink bg-plate shadow-[0_12px_24px_-12px_rgb(0_0_0/0.25)] md:block">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-8 lg:grid-cols-[18rem_1fr]">
        <div>
          <p className="heading text-2xl">{r.label}</p>
          <p className="mt-2 text-muted">{r.intro}</p>
          <Link
            to={r.accueil.href}
            aria-current={accueilActif ? "page" : undefined}
            className="mt-4 inline-flex min-h-11 items-center rounded-md bg-ink px-4 py-2 font-bold text-white transition-colors duration-150 hover:bg-veg-500 hover:text-dark"
          >
            {r.accueil.label}
          </Link>
        </div>
        <ul className="grid content-start gap-1 sm:grid-cols-2 xl:grid-cols-3">
          {r.liens.map((l) => (
            <li key={l.href}>
              <LienMenu lien={l} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Lien de menu ; `compact` (mobile) masque la description */
function LienMenu({ lien: l, compact = false }: Readonly<{ lien: NavRubrique["liens"][number]; compact?: boolean }>) {
  return (
    <NavLink
      to={l.href}
      end
      className={({ isActive }) =>
        `group flex items-start gap-3 rounded-md ${compact ? "px-2 py-2" : "px-3 py-2.5"} transition-colors duration-150 ${isActive ? "bg-faience" : "hover:bg-faience"}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`mt-1.5 h-3 w-3 shrink-0 ${themes[l.theme].bg500}`} aria-hidden="true" />
          <span>
            <span className={`block font-semibold ${isActive ? "underline underline-offset-4" : ""}`}>{l.label}</span>
            {!compact && <span className="block text-sm text-muted">{l.description}</span>}
          </span>
        </>
      )}
    </NavLink>
  );
}

function Chevron({ ouvert }: Readonly<{ ouvert: boolean }>) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-150 ${ouvert ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Logo : l'assiette vue du dessus, ½ légumes, ¼ féculents, ¼ protéines */
function Logo() {
  return (
    <span className="grid h-8 w-8 grid-cols-2 grid-rows-2 gap-0.5 border-2 border-ink p-0.5" aria-hidden="true">
      <span className="row-span-2 bg-veg-500" />
      <span className="bg-carb-500" />
      <span className="bg-prot-500" />
    </span>
  );
}
