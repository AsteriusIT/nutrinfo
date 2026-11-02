import { themes, type ThemeKey } from "~/lib/theme";

/**
 * « Bande assiette » : reprend les proportions de l'assiette équilibrée
 * (½ légumes, ¼ féculents, ¼ protéines). Si un thème est donné, une case
 * sur quatre prend sa couleur pour signaler la rubrique.
 */
export function PixelBand({ focus, cells = 48 }: { focus?: ThemeKey; cells?: number }) {
  const plate = (i: number): ThemeKey => (i < cells / 2 ? "veg" : i < (cells * 3) / 4 ? "carb" : "prot");
  return (
    <div className="flex h-2.5 w-full gap-px bg-plate" aria-hidden="true">
      {Array.from({ length: cells }, (_, i) => {
        const key = focus && i % 4 === 3 ? focus : plate(i);
        return <span key={i} className={`h-full flex-1 ${themes[key].bg500}`} />;
      })}
    </div>
  );
}
