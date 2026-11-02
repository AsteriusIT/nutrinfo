import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Appliqué dans le <head> avant le premier rendu (sinon flash blanc sur les pages pré-rendues).
 * Sans choix enregistré, aucun attribut : le CSS suit le réglage du système.
 */
export const themeScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const systemTheme = (): Theme => (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function ThemeToggle() {
  // null tant que le composant n'est pas monté : le HTML pré-rendu ne connaît pas le thème
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const read = () => setTheme((document.documentElement.dataset.theme as Theme | undefined) ?? systemTheme());
    read();
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", read);
    return () => media.removeEventListener("change", read);
  }, []);

  function toggle() {
    const next: Theme = (theme ?? systemTheme()) === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // stockage indisponible (navigation privée) : le choix vaut pour cette page seulement
    }
    setTheme(next);
  }

  const label = theme === "dark" ? "Passer en thème clair" : theme === "light" ? "Passer en thème sombre" : "Changer de thème";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-ink hover:bg-faience"
    >
      {/* Carré à moitié plein : la moitié pleine passe de côté avec le thème */}
      <span className="flex h-4 w-4 border-2 border-ink" aria-hidden="true">
        <span className={`h-full w-1/2 bg-ink transition-transform duration-200 ${theme === "dark" ? "translate-x-full" : ""}`} />
      </span>
    </button>
  );
}
