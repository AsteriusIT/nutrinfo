import { useState } from "react";
import { Link, NavLink } from "react-router";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/bases/assiette", label: "Composer son assiette" },
  { href: "/nutriments/proteines/animales-vs-vegetales", label: "Protéines" },
  { href: "/nutriments/glucides", label: "Glucides" },
  { href: "/nutriments/eau", label: "Eau" },
  { href: "/nutriments/vitamines-et-mineraux", label: "Vitamines et minéraux" },
  { href: "/ages", label: "Selon mon âge" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 font-semibold transition-colors duration-150 ${
    isActive ? "bg-ink text-white" : "hover:bg-faience"
  }`;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-plate">
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

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink to={item.href} className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md border-2 border-ink px-3 py-1.5 font-semibold lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="border-t-2 border-ink lg:hidden">
          <ul>
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line">
                <NavLink to={item.href} onClick={() => setOpen(false)} className={navClass}>
                  <span className="block px-1 py-2">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
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
