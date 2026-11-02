/**
 * Illustration maison (CC0) : balance « animal / végétal » qui s'équilibre.
 */
export function BalanceIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      className={className}
      role="img"
      aria-label="Balance en équilibre : à gauche des protéines animales (œuf, poisson, viande), à droite des protéines végétales (lentilles, pois chiches, tofu)."
    >
      {/* Socle et pivot */}
      <rect x="150" y="196" width="60" height="12" fill="var(--color-ink)" />
      <rect x="176" y="70" width="8" height="128" fill="var(--color-ink)" />
      <polygon points="180,56 192,72 168,72" fill="var(--color-ink)" />

      {/* Fléau qui oscille puis se stabilise */}
      <g className="balance-beam" style={{ transformOrigin: "180px 64px" }}>
        <rect x="40" y="60" width="280" height="8" fill="var(--color-ink)" />
        <rect x="58" y="68" width="4" height="50" fill="var(--color-ink)" />
        <rect x="298" y="68" width="4" height="50" fill="var(--color-ink)" />

        {/* Plateau animal */}
        <rect x="10" y="118" width="100" height="8" fill="var(--color-ink)" />
        <rect x="20" y="94" width="24" height="24" fill="var(--color-plate)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="27" y="101" width="10" height="10" fill="var(--color-carb-500)" />
        <rect x="48" y="98" width="30" height="20" fill="var(--color-prot-500)" />
        <polygon points="78,108 92,98 92,118" fill="var(--color-prot-500)" />
        <rect x="58" y="80" width="26" height="16" fill="var(--color-prot-800)" />

        {/* Plateau végétal */}
        <rect x="250" y="118" width="100" height="8" fill="var(--color-ink)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={258 + i * 12} y="108" width="10" height="10" fill="var(--color-veg-800)" />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={264 + i * 12} y="96" width="10" height="10" fill="var(--color-carb-500)" />
        ))}
        <rect x="310" y="92" width="26" height="26" fill="var(--color-faience)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="296" y="76" width="14" height="14" fill="var(--color-veg-500)" />
      </g>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .balance-beam { animation: balance 2.4s var(--ease-carre) both; }
        }
        @keyframes balance {
          0% { transform: rotate(-9deg); }
          35% { transform: rotate(6deg); }
          60% { transform: rotate(-3deg); }
          80% { transform: rotate(1deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </svg>
  );
}
