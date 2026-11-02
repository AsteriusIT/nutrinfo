import { Link } from "react-router";
import { PixelBand } from "~/components/pixel-band";

export const meta = () => [
  { title: "Données personnelles | Asterius Nutrition" },
  { name: "description", content: "Quelles données le site et son assistant traitent, pourquoi, et vos droits (RGPD)." },
];

// À compléter avant la mise en ligne : le RGPD impose d'identifier le responsable et un moyen de le contacter
const RESPONSABLE = "[À compléter : nom du responsable du site]";
const CONTACT = "[À compléter : adresse e-mail de contact]";
const MAJ = "2 novembre 2026";

const EN_BREF = [
  {
    titre: "Ni cookie, ni mesure d'audience",
    texte: "Le site ne vous suit pas. Les polices sont servies par le site lui-même, sans passer par Google.",
  },
  {
    titre: "L'assistant envoie vos questions à Anthropic",
    texte: "Seulement si vous l'utilisez. C'est l'entreprise qui fournit le modèle d'IA Claude.",
  },
  {
    titre: "Nous n'enregistrons rien",
    texte: "Ni compte, ni historique de conversation. N'écrivez pas d'informations sur votre santé.",
  },
];

export default function Confidentialite() {
  return (
    <>
      <PixelBand />
      <div className="mx-auto max-w-[1240px] px-4 py-12 md:px-6">
        <h1 className="display max-w-[18ch] text-[2.5rem] md:text-7xl">Données personnelles</h1>
        <div className="mt-10 grid border-2 border-ink md:grid-cols-3">
          {EN_BREF.map((m) => (
            <div key={m.titre} className="border-b-2 border-ink p-5 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0">
              <h2 className="heading text-xl">{m.titre}</h2>
              <p className="mt-2 text-muted">{m.texte}</p>
            </div>
          ))}
        </div>

        <div className="prose-carre mt-4">
          <h2>Qui est responsable</h2>
          <p>
            Le responsable du traitement est {RESPONSABLE}. Pour toute question sur vos données : {CONTACT}.
          </p>

          <h2>Quand vous consultez le site</h2>
          <p>
            Le site est hébergé par <strong>Cloudflare</strong> (Cloudflare, Inc., États-Unis). Comme tout hébergeur, il
            reçoit des informations techniques : votre adresse IP, la date et la page demandée. Elles servent à faire
            fonctionner le site et à le protéger des attaques, et ne sont conservées que quelques jours.
          </p>
          <p>
            Si vous choisissez le thème clair ou sombre, ce choix est gardé dans votre navigateur. Il n'est jamais envoyé
            au site.
          </p>

          <h2>Quand vous utilisez l'assistant</h2>
          <ul>
            <li>
              <strong>Ce qui est envoyé :</strong> le texte de vos questions et des réponses de la conversation en cours.
              Pas de nom, pas de compte.
            </li>
            <li>
              <strong>À qui :</strong> à <strong>Anthropic</strong> (Anthropic PBC, États-Unis), qui fournit le modèle
              d'IA Claude et agit pour notre compte. Il ne s'en sert que pour produire la réponse et ne l'utilise pas pour
              entraîner ses modèles.
            </li>
            <li>
              <strong>Pourquoi :</strong> répondre à la question que vous posez. C'est vous qui déclenchez l'envoi
              (intérêt légitime, article 6.1.f du RGPD).
            </li>
            <li>
              <strong>Combien de temps :</strong> notre site n'enregistre pas les conversations. Elles disparaissent
              quand vous fermez ou rechargez la page. Anthropic les conserve pour une durée limitée, pour la sécurité de
              son service, selon{" "}
              <a href="https://www.anthropic.com/legal/privacy" rel="noopener">
                sa politique de confidentialité
              </a>
              .
            </li>
            <li>
              <strong>Hors de l'Union européenne :</strong> Anthropic et Cloudflare sont aux États-Unis. Ces transferts
              sont encadrés par les clauses contractuelles types de la Commission européenne.
            </li>
            <li>
              <strong>Limite de questions :</strong> votre adresse IP sert à compter les questions (10 par minute au
              plus). Ce compteur est temporaire et n'est pas lié au contenu des questions.
            </li>
          </ul>
          <p>
            <strong>N'écrivez pas d'informations sur votre santé</strong> (maladie, traitement, grossesse…) ni rien qui
            permette de vous reconnaître. L'assistant n'en a pas besoin pour répondre, et ce sont des données sensibles
            (article 9 du RGPD). Pour une question personnelle, parlez-en à un médecin ou à un·e diététicien·ne.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous pouvez demander l'accès à vos données, leur correction, leur effacement, ou vous opposer à leur
            traitement, en écrivant à {CONTACT}. Comme nous ne conservons pas les conversations, nous ne pourrons
            souvent rien retrouver. Vous pouvez aussi adresser une réclamation à la{" "}
            <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">
              CNIL
            </a>
            .
          </p>
          <p className="text-sm text-muted">
            Mis à jour le {MAJ}. Voir aussi <Link to="/sources">nos sources et notre méthode</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
