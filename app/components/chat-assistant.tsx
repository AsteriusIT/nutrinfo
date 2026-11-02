import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";

/** Assistant de questions-réponses (Claude, via le Worker /api/chat). Non disponible avec `npm run dev`. */

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Mêmes limites que worker/index.ts
const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

const EXEMPLES = [
  "Combien de protéines après 65 ans ?",
  "Quelles boissons pour un enfant ?",
  "Que manger pendant la grossesse ?",
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, error]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const full = messages.length >= MAX_MESSAGES - 1;

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending || full) return;
    const history: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setError(null);
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let answer = "";
    let failure: string | null = null;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "L'assistant est indisponible pour le moment.");
      }
      // Flux NDJSON : une ligne JSON par morceau de réponse
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines.filter(Boolean)) {
          const event = JSON.parse(line) as { t?: string; error?: string };
          if (event.error) failure = event.error;
          if (event.t) {
            answer += event.t;
            setMessages([...history, { role: "assistant", content: answer }]);
          }
        }
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      failure = e instanceof Error ? e.message : "L'assistant est indisponible pour le moment.";
    } finally {
      setPending(false);
    }

    if (failure && !answer) {
      // Rien reçu : on retire la question pour garder un historique valide, et on la rend à l'utilisateur
      setMessages(messages);
      setDraft(text);
    }
    if (failure) setError(failure);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(draft);
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setPending(false);
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-3 rounded-lg border-2 border-ink bg-ink px-5 py-3 font-bold text-white shadow-[6px_6px_0_var(--color-veg-500)] transition-colors duration-150 hover:bg-veg-500 hover:text-dark md:bottom-6 md:right-6"
      >
        <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true">
          <span className="bg-veg-500" />
          <span className="bg-carb-500" />
          <span className="bg-prot-500" />
          <span className="bg-water-500" />
        </span>
        Poser une question
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-labelledby="assistant-titre"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      className="animate-tile fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-lg border-2 border-ink bg-plate shadow-[8px_8px_0_var(--color-ink)] sm:inset-x-auto sm:bottom-6 sm:rounded-lg sm:right-6 sm:h-[600px] sm:w-[420px]"
    >
      <header className="flex items-center justify-between gap-4 border-b-2 border-ink bg-faience px-4 py-3">
        <div>
          <h2 id="assistant-titre" className="heading text-lg">
            L'assistant
          </h2>
          <p className="text-sm text-muted">Répond à partir des pages du site</p>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <button type="button" onClick={reset} className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-plate">
              Recommencer
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border-2 border-ink px-3 py-1 font-semibold hover:bg-ink hover:text-white"
          >
            Fermer
          </button>
        </div>
      </header>

      <div ref={logRef} role="log" aria-busy={pending} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p>Posez une question sur l'alimentation. Par exemple :</p>
            <ul className="space-y-2">
              {EXEMPLES.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => void ask(q)}
                    className="w-full rounded-md border-2 border-line px-3 py-2 text-left hover:border-ink"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-8 rounded-lg rounded-br-sm bg-ink px-3 py-2 text-white">
              {m.content}
            </p>
          ) : (
            <div key={i} className="mr-4 rounded-lg rounded-bl-sm border-l-4 border-veg-500 bg-veg-100 px-3 py-2">
              {m.content ? <Answer text={m.content} onNavigate={() => setOpen(false)} /> : <Typing />}
            </div>
          ),
        )}

        {error && (
          <p role="alert" className="rounded-lg border-l-4 border-prot-500 bg-prot-100 px-3 py-2 text-prot-800">
            {error}
          </p>
        )}
        {full && <p className="text-sm text-muted">Conversation terminée : cliquez sur « Recommencer ».</p>}
      </div>

      <form onSubmit={onSubmit} className="border-t-2 border-ink">
        <label htmlFor="assistant-question" className="sr-only">
          Votre question
        </label>
        <div className="flex">
          <textarea
            id="assistant-question"
            ref={inputRef}
            value={draft}
            maxLength={MAX_CHARS}
            rows={2}
            disabled={full}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(draft);
              }
            }}
            placeholder="Votre question…"
            className="min-h-12 flex-1 resize-none px-3 py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || full || !draft.trim()}
            className="bg-ink px-5 font-bold text-white transition-colors duration-150 hover:bg-veg-500 hover:text-dark disabled:bg-line disabled:text-muted"
          >
            Envoyer
          </button>
        </div>
        <p className="border-t border-line px-3 py-2 text-xs text-muted">
          Réponses générées par une IA (Claude), qui peut se tromper. Ne remplace pas un avis médical. N'indiquez pas
          d'informations personnelles de santé. Vos questions sont envoyées à Anthropic et ne sont pas enregistrées
          par le site.{" "}
          <Link to="/confidentialite" onClick={() => setOpen(false)} className="link">
            En savoir plus
          </Link>
        </p>
      </form>
    </section>
  );
}

function Typing() {
  return (
    <span className="flex gap-1 py-1" aria-label="L'assistant écrit">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 animate-pulse bg-veg-800" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  );
}

/** Markdown minimal (paragraphes, listes, gras, liens internes), sans HTML injecté */
function Answer({ text, onNavigate }: Readonly<{ text: string; onNavigate: () => void }>) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*] /, ""), onNavigate)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.map((l, j) => [j > 0 && <br key={`br${j}`} />, inline(l, onNavigate)])}</p>;
      })}
    </div>
  );
}

function inline(text: string, onNavigate: () => void): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[(.+)\]\((.+)\)$/);
    if (link) {
      // Seuls les liens internes au site deviennent cliquables
      return link[2].startsWith("/") && !link[2].startsWith("//") ? (
        <Link key={i} to={link[2]} onClick={onNavigate} className="link font-semibold">
          {link[1]}
        </Link>
      ) : (
        link[1]
      );
    }
    return part;
  });
}
