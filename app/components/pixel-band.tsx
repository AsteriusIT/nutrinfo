/**
 * Bande de pixels sous l'en-tête : signature visuelle du site, dans la seule couleur d'accent
 * (règle des 3 couleurs, D14). Les pixels rappellent le style carré des illustrations.
 */
export function PixelBand({ cells = 48 }: Readonly<{ cells?: number }>) {
  return (
    <div className="flex h-2.5 w-full gap-px bg-plate" aria-hidden="true">
      {Array.from({ length: cells }, (_, i) => (
        <span key={i} className="h-full flex-1 bg-accent-500" />
      ))}
    </div>
  );
}
