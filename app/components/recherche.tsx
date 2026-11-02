import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { EntreeRecherche } from "../../scripts/index-recherche";
import { assistantActif } from "~/lib/config";
import { normaliser } from "~/lib/texte";

// ---------------------------------------------------------------------------------------------
// Ouverture depuis n'importe où (en-tête, accueil) : un événement, une seule boîte de recherche.

const EVENEMENT = "nutrinfo:recherche";
export const ouvrirRecherche = (question = "") =>
  window.dispatchEvent(new CustomEvent(EVENEMENT, { detail: question }));

/** Questions d'exemple : elles montrent qu'on peut écrire comme on parle */
export const EXEMPLES = [
  "Combien de protéines par jour ?",
  "Où trouver du fer ?",
  "C'est quoi une calorie ?",
  "Que manger enceinte ?",
  "Combien boire par jour ?",
];

// ---------------------------------------------------------------------------------------------
// Recherche : tolère les accents, les pluriels et les questions en langage courant

const MOTS_VIDES = new Set(
  "a au aux bien c ce ces comment d de des du en est et faut il j je l la le les ma manger mes mon ou par pour qu que quel quelle quels quoi sa se ses son un une y".split(
    " ",
  ),
);

function decouper(question: string): string[] {
  return normaliser(question)
    .replace(/vitamine\s+(b?\d+|[a-z])\b/g, "vitamine-$1") // « vitamine d » : la lettre compte
    .split(/[^a-z0-9-]+/)
    .filter((m) => m.length > 1 && !MOTS_VIDES.has(m))
    .map((m) => (m.length > 4 ? m.replace(/(s|x)$/, "") : m));
}

function chercher(index: EntreeRecherche[], question: string): { e: EntreeRecherche; dansTitre: number }[] {
  const mots = decouper(question);
  if (mots.length === 0) return [];
  // Un mot de la question doit commencer un mot du texte : « fer » ne trouve pas « différent ».
  // Pas d'échappement : decouper() ne garde que des lettres, des chiffres et des tirets.
  // Les mots courts (« sel », « fer ») doivent être entiers : « sel » ne trouve pas « selon ».
  const motifs = mots.map((m) => {
    const corps = m.replace(/-/g, "[- ]");
    const fin = (m.split("-").at(-1) ?? m).length <= 3 ? "(?:s|x)?(?![a-z0-9])" : "";
    return new RegExp(`(?:^|[^a-z0-9])${corps}${fin}`);
  });
  const poidsType = { reponse: 3, page: 2, section: 1, mot: 1 };
  return index
    .map((e) => {
      let trouves = 0;
      let dansTitre = 0;
      let score = poidsType[e.type];
      for (const motif of motifs) {
        if (!motif.test(e.cle)) continue;
        trouves++;
        if (motif.test(e.cleTitre)) {
          dansTitre++;
          score += 5;
        } else score += 1;
      }
      // Les entrées qui contiennent le plus de mots de la question passent devant
      return { e, trouves, dansTitre, score: trouves * 10 + score };
    })
    .filter((r) => r.trouves > 0)
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------------------------

type Option =
  | { cle: string; groupe: "Réponse directe" | "Pages et sections" | "Mots expliqués"; entree: EntreeRecherche }
  | { cle: string; groupe: "Assistant"; question: string };

export function Recherche() {
  const [ouvert, setOuvert] = useState(false);
  const [question, setQuestion] = useState("");
  const [index, setIndex] = useState<EntreeRecherche[] | null>(null);
  const [actif, setActif] = useState(0);
  const champRef = useRef<HTMLInputElement>(null);
  const declencheurRef = useRef<Element | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const listeId = useId();
  // Section à atteindre une fois la page affichée (le défilement automatique se trompe quand la page change)
  const ancreRef = useRef<string | null>(null);

  useEffect(() => {
    const id = ancreRef.current;
    if (!id) return;
    ancreRef.current = null;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, [location]);

  const ouvrir = useCallback((q: string) => {
    declencheurRef.current = document.activeElement;
    setQuestion(q);
    setActif(0);
    setOuvert(true);
  }, []);

  const fermer = useCallback(() => {
    setOuvert(false);
    (declencheurRef.current as HTMLElement | null)?.focus?.();
  }, []);

  // Ouverture : événement, « / » ou Ctrl/⌘ + K
  useEffect(() => {
    const surEvenement = (e: Event) => ouvrir((e as CustomEvent<string>).detail ?? "");
    const surTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement;
      const saisie = cible.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(cible.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !saisie)) {
        e.preventDefault();
        ouvrir("");
      }
    };
    window.addEventListener(EVENEMENT, surEvenement);
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener(EVENEMENT, surEvenement);
      window.removeEventListener("keydown", surTouche);
    };
  }, [ouvrir]);

  // À l'ouverture : index chargé une fois (module séparé), focus dans le champ, page figée
  useEffect(() => {
    if (!ouvert) return;
    if (!index) void import("virtual:recherche").then((m) => setIndex(m.default));
    champRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [ouvert, index]);

  const options = useMemo<Option[]>(() => {
    if (!index || !question.trim()) return [];
    const resultats = chercher(index, question);
    // Une réponse chiffrée n'est mise en avant que si elle parle de ce qu'on cherche (le mot est dans
    // son titre) ; sinon elle rejoint les pages, sans son chiffre
    const directe = (r: (typeof resultats)[number]) => r.e.type === "reponse" && r.dansTitre > 0;
    const opts: Option[] = [
      ...resultats
        .filter(directe)
        .slice(0, 2)
        .map(({ e }) => ({ cle: `r${e.url}`, groupe: "Réponse directe" as const, entree: e })),
      ...resultats
        .filter((r) => r.e.type !== "mot" && !directe(r))
        .slice(0, 6)
        .map(({ e }) => ({ cle: `p${e.url}`, groupe: "Pages et sections" as const, entree: e })),
      ...resultats
        .filter((r) => r.e.type === "mot")
        .slice(0, 2)
        .map(({ e }) => ({ cle: `m${e.titre}`, groupe: "Mots expliqués" as const, entree: e })),
    ];
    if (assistantActif) opts.push({ cle: "assistant", groupe: "Assistant", question: question.trim() });
    return opts;
  }, [index, question]);

  function choisir(o: Option | undefined) {
    if (!o) return;
    if (o.groupe === "Assistant") {
      window.dispatchEvent(new CustomEvent("nutrinfo:assistant", { detail: o.question }));
      setOuvert(false);
      return;
    }
    if (!o.entree.url) return; // un mot sans page : sa définition est déjà affichée
    setOuvert(false);
    document.body.style.overflow = "";
    const ancre = o.entree.url.split("#")[1];
    ancreRef.current = ancre ?? null;
    navigate(o.entree.url, { preventScrollReset: Boolean(ancre) });
  }

  function surToucheChamp(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = options.length;
      if (n) setActif((a) => (a + (e.key === "ArrowDown" ? 1 : n - 1)) % n);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choisir(options[actif]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      fermer();
    } else if (e.key === "Tab") {
      e.preventDefault(); // le focus reste dans la boîte de dialogue
    }
  }

  if (!ouvert) return null;

  const sansResultat = index && question.trim() && options.filter((o) => o.groupe !== "Assistant").length === 0;
  const optionId = (i: number) => `${listeId}-${i}`;

  return (
    <div
      className="fixed inset-0 z-[70] bg-ink/40 sm:px-4 sm:pt-[8vh]"
      onMouseDown={(e) => e.target === e.currentTarget && fermer()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher sur nutrinfo"
        className="animate-fade mx-auto flex h-full max-w-2xl flex-col overflow-hidden border-ink bg-plate sm:h-auto sm:max-h-[80vh] sm:rounded-lg sm:border-2 sm:shadow-[0_24px_48px_-16px_rgb(0_0_0/0.35)]"
      >
        <div className="flex items-center gap-3 border-b-2 border-ink px-4">
          <Loupe className="h-5 w-5 shrink-0" />
          <input
            ref={champRef}
            role="combobox"
            aria-expanded={options.length > 0}
            aria-controls={listeId}
            aria-activedescendant={options.length ? optionId(actif) : undefined}
            aria-autocomplete="list"
            aria-label="Votre question, un aliment ou un nutriment"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setActif(0);
            }}
            onKeyDown={surToucheChamp}
            placeholder="Une question, un aliment, un nutriment…"
            className="min-h-16 flex-1 bg-transparent text-lg placeholder:text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={fermer}
            className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-faience"
          >
            Fermer
          </button>
        </div>

        <div className="overflow-y-auto">
          {!question.trim() && (
            <div className="px-4 py-5">
              <p className="font-semibold">Écrivez comme vous parleriez, par exemple :</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {EXEMPLES.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestion(q);
                        champRef.current?.focus();
                      }}
                      className="rounded-md border-2 border-line px-3 py-1.5 text-left hover:border-ink"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.trim() && !index && <p className="px-4 py-5 text-muted">Chargement…</p>}

          {sansResultat && (
            <p className="px-4 pt-5 text-muted">
              Rien sur « {question.trim()} » pour l'instant. Essayez un aliment (lentilles), un nutriment (fer) ou une
              période de la vie (grossesse).
            </p>
          )}

          {options.length > 0 && (
            <ul id={listeId} role="listbox" aria-label="Résultats" className="py-2">
              {options.map((o, i) => {
                const titreGroupe = i === 0 || options[i - 1].groupe !== o.groupe;
                return (
                  <li key={o.cle} role="presentation">
                    {titreGroupe && o.groupe !== "Assistant" && (
                      <p role="presentation" className="px-4 pb-1 pt-3 text-sm font-semibold text-muted">
                        {o.groupe}
                      </p>
                    )}
                    <div
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === actif}
                      onMouseEnter={() => setActif(i)}
                      onClick={() => choisir(o)}
                      className={`mx-2 cursor-pointer rounded-md px-3 py-2.5 ${i === actif ? "bg-accent-100" : ""}`}
                    >
                      <Resultat option={o} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="hidden border-t border-line px-4 py-2 text-sm text-muted sm:block">
          <kbd className="rounded-sm border border-line px-1.5">↑</kbd>{" "}
          <kbd className="rounded-sm border border-line px-1.5">↓</kbd> pour choisir,{" "}
          <kbd className="rounded-sm border border-line px-1.5">Entrée</kbd> pour ouvrir,{" "}
          <kbd className="rounded-sm border border-line px-1.5">Échap</kbd> pour fermer
        </p>
      </div>
    </div>
  );
}

function Resultat({ option: o }: Readonly<{ option: Option }>) {
  if (o.groupe === "Assistant") {
    return (
      <span className="flex items-center gap-3">
        <span className="grid h-6 w-6 shrink-0 grid-cols-2 gap-0.5" aria-hidden="true">
          <span className="bg-accent-500" />
          <span className="bg-ink" />
          <span className="bg-ink" />
          <span className="bg-accent-500" />
        </span>
        <span>
          Poser la question à l'assistant : <span className="font-semibold">« {o.question} »</span>
        </span>
      </span>
    );
  }
  const e = o.entree;
  if (o.groupe === "Réponse directe") {
    return (
      // Mobile : le chiffre sous le titre ; grand écran : le chiffre à droite
      <span className="flex flex-col gap-2 border-l-4 border-accent-500 pl-3 sm:flex-row sm:gap-4">
        <span className="min-w-0 flex-1">
          <span className="heading block text-lg">{e.titre}</span>
          <span className="mt-0.5 line-clamp-2 text-sm text-muted">{e.texte}</span>
        </span>
        <span className="order-first shrink-0 sm:order-none sm:text-right">
          <span className="figure block text-2xl leading-none">{e.chiffre}</span>
          {e.legende && <span className="mt-1 block text-xs text-muted sm:max-w-[12rem]">{e.legende}</span>}
        </span>
      </span>
    );
  }
  if (e.type === "mot") {
    return (
      <span className="block">
        <span className="font-semibold">{e.titre}</span>
        <span className="text-muted"> : {e.texte}</span>
      </span>
    );
  }
  return (
    <span className="block">
      <span className="font-semibold">
        {e.parent && <span className="font-normal text-muted">{e.parent} › </span>}
        {e.titre}
      </span>
      {e.texte && <span className="mt-0.5 block truncate text-sm text-muted">{e.texte}</span>}
    </span>
  );
}

/** Bouton d'ouverture : un champ visible sur grand écran, une loupe sur mobile */
export function BoutonRecherche() {
  return (
    <button
      type="button"
      onClick={() => ouvrirRecherche()}
      aria-label="Rechercher"
      className="flex h-10 items-center gap-2 rounded-md border-2 border-ink px-2.5 text-muted hover:bg-faience lg:w-56 lg:border-line lg:hover:border-ink"
    >
      <Loupe className="h-4 w-4 shrink-0 text-ink" />
      <span className="hidden flex-1 text-left lg:inline">Rechercher…</span>
      <kbd className="hidden rounded-sm border border-line px-1.5 text-xs lg:inline" aria-hidden="true">
        /
      </kbd>
    </button>
  );
}

export function Loupe({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.25" />
      <path d="M12.5 12.5 L17 17" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" />
    </svg>
  );
}
