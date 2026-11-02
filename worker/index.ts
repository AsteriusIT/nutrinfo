// Worker Cloudflare : sert le site statique (build/client) et l'assistant sur /api/chat.
// Le modèle tourne chez Anthropic ; ce Worker garde la clé d'API et le prompt côté serveur.
import Anthropic from "@anthropic-ai/sdk";
import { corpus } from "./corpus.generated";

interface Env {
  ASSETS: Fetcher;
  ANTHROPIC_API_KEY: string;
  /** Modèle Claude, modifiable dans wrangler.jsonc sans toucher au code */
  CLAUDE_MODEL: string;
  CHAT_LIMITER: RateLimit;
}

/** Message tel qu'envoyé par le navigateur (texte seul) */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

// Ne pas y mettre de date ni rien de variable : le moindre octet changé casse le cache du prompt.
const INSTRUCTIONS = `Tu es l'assistant du site nutrinfo, un site public français qui donne des repères simples pour bien manger à chaque âge, tirés des recommandations officielles (ANSES, PNNS, EFSA, table CIQUAL).

Règles :
- Réponds en français, simplement, en quelques phrases courtes ou une courte liste. Pas de jargon.
- Appuie-toi uniquement sur les contenus du site ci-dessous. Si la réponse n'y est pas, dis-le franchement et propose la page la plus proche, sans inventer de chiffre.
- Cite la page utilisée sous forme de lien Markdown relatif, par exemple [Bien manger après 65 ans](/ages/seniors).
- Les fiches de content/fiches/bases.yaml sont publiées à l'adresse /apprendre/<id> (par exemple [C'est quoi une protéine ?](/apprendre/proteines)), et la liste des fiches à /apprendre.
- Tu ne fais ni diagnostic, ni régime personnalisé, ni conseil médical. Pour une maladie, une grossesse à risque, un traitement, une allergie, des troubles alimentaires ou une perte de poids inexpliquée, oriente vers un médecin ou un·e diététicien·ne. En cas d'urgence, indique le 15 (ou le 112).
- Ne demande pas d'informations personnelles de santé.
- Les contenus n'ont pas encore été relus par un professionnel (champ « relecture: non-relu ») : rappelle-le si une réponse engage la santé.
- Reste dans le sujet de l'alimentation ; décline poliment le reste.

Contenus du site :

`;

function isChatMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= MAX_CHARS
  );
}

/** Historique valide : alterné, commence et finit par l'utilisateur, borné en taille */
function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  if (!messages.every(isChatMessage)) return null;
  const alternates = messages.every((m, i) => m.role === (i % 2 === 0 ? "user" : "assistant"));
  return alternates && messages.length % 2 === 1 ? messages : null;
}

const json = (status: number, error: string) =>
  Response.json({ error }, { status, headers: { "cache-control": "no-store" } });

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json(405, "Méthode non autorisée.");

  // Seul le site lui-même peut appeler l'assistant (premier filtre contre la réutilisation de l'API)
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json(403, "Origine refusée.");

  const ip = request.headers.get("cf-connecting-ip") ?? "inconnue";
  const { success } = await env.CHAT_LIMITER.limit({ key: ip });
  if (!success) return json(429, "Trop de questions d'un coup. Réessayez dans une minute.");

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) return json(400, "Conversation invalide ou trop longue.");

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const stream = client.beta.messages.stream({
    model: env.CLAUDE_MODEL,
    // Plafond volontaire : les réponses attendues sont courtes et l'API est publique
    max_tokens: 4096,
    output_config: { effort: "low" },
    // En cas de refus par les filtres de sécurité, l'API relance sur le modèle recommandé
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [
      {
        type: "text",
        text: INSTRUCTIONS + corpus,
        // Le corpus (~15 000 tokens) est relu à ~10 % du prix tant qu'il reste en cache
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ],
    messages,
  });

  // Flux NDJSON vers le navigateur : {"t": "..."} pour le texte, puis {"done": true} ou {"error": "..."}
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: object) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ t: event.delta.text });
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send({ error: "Je ne peux pas répondre à cette question. Pour un avis sur votre santé, parlez-en à un professionnel." });
        } else if (final.stop_reason === "max_tokens") {
          send({ t: "\n\n(Réponse coupée car trop longue.)" });
        }
        send({ done: true });
      } catch (error) {
        // On ne journalise ni la question ni la réponse : uniquement le type d'erreur
        const status = error instanceof Anthropic.APIError ? error.status : undefined;
        console.error("Erreur API Claude", status ?? (error as Error).name);
        send({
          error:
            error instanceof Anthropic.RateLimitError
              ? "L'assistant est très sollicité. Réessayez dans un instant."
              : "L'assistant est indisponible pour le moment.",
        });
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort(); // l'utilisateur a fermé la fenêtre : on arrête de payer la génération
    },
  });

  return new Response(body, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat") return handleChat(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
