# Asterius Nutrition

Site public d'information en français sur l'alimentation saine, adaptée à chaque âge de la vie.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # génère le site statique dans build/client
npm run preview    # sert build/client localement
npm run typecheck
```

Stack : React Router v8 (mode framework, pré-rendu statique), Tailwind CSS v4, MDX, TypeScript.

### Assistant (Claude) et hébergement Cloudflare

Un Worker Cloudflare (`worker/`, `wrangler.jsonc`) sert le site et l'assistant sur `/api/chat`. L'assistant n'existe pas avec `npm run dev` ; pour le tester :

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars   # ignoré par git
npm run dev:api                                   # http://localhost:8787
```

Mise en ligne : `npx wrangler secret put ANTHROPIC_API_KEY` (une fois), puis `npm run deploy`. Le modèle se change dans `wrangler.jsonc` (`CLAUDE_MODEL`). Voir la décision D8 dans `docs/decisions.md`.

### Publier sur GitHub Pages (sans assistant)

Le workflow `.github/workflows/pages.yml` construit et publie le site à chaque push sur `main`. À activer une fois dans le dépôt : **Settings > Pages > Source : GitHub Actions**. Le site est alors en ligne sur `https://<compte>.github.io/<dépôt>/`.

Pour tester ce build en local :

```bash
BASE_PATH=/asterius-nutrition/ npm run build:pages   # résultat dans build/pages/
```

| Variable | Effet |
|---|---|
| `VITE_ASSISTANT=off` | retire l'assistant IA (bouton, appels à `/api/chat`, sections de la page Données personnelles) |
| `VITE_HEBERGEUR=github` | cite GitHub Pages comme hébergeur dans la page Données personnelles |
| `BASE_PATH` | sous-chemin de publication ; le workflow le déduit du nom du dépôt (variable de dépôt `BASE_PATH` pour un domaine personnalisé : `/`) |

`npm run build:pages` fixe les deux premières variables.

## Où écrire le contenu

| Type | Emplacement | Format |
|---|---|---|
| Page plein contenu | `content/pages/**.mdx` + un fichier de route de 4 lignes (`mdxPage`, voir `app/routes/ages-seniors.tsx`) + une ligne dans `app/routes.ts` | MDX avec frontmatter (voir `docs/modele-contenu.md`) |
| Cartes d'information | `content/fiches/*.yaml` | YAML |
| Bibliographie | `content/sources.yaml` | YAML (le `code` sert de badge et d'ancre) |

Composants : `app/components/`, illustrations maison (CC0) : `app/illustrations/`, design system : `app/app.css`.

## Documentation

- [Sources de référence](docs/00-sources.md)
- Synthèses documentaires :
  1. [Repères généraux (PNNS)](docs/synthese/01-reperes-generaux.md)
  2. [Macronutriments : protéines, glucides, lipides](docs/synthese/02-macronutriments.md)
  3. [Vitamines et minéraux](docs/synthese/03-micronutriments.md)
  4. [Besoins selon l'âge](docs/synthese/04-besoins-par-age.md)
  5. [Hydratation et boissons](docs/synthese/05-hydratation-boissons.md)
  6. [Bien choisir : étiquettes, Nutri‑Score, transformation](docs/synthese/06-bien-choisir.md)
  7. [Modes alimentaires, activité physique et santé](docs/synthese/07-modes-alimentaires-et-sante.md)
- [Proposition de topologie du site](docs/topologie-site.md)
- [Décisions](docs/decisions.md)
- [Design system « Carré »](docs/design-system.md)
- [Modèle de contenu (pages et cartes)](docs/modele-contenu.md)
- [Illustrations et icônes](docs/illustrations.md)
- [Revue UI/UX, itération 2](docs/revue-ux.md)
- [Données CIQUAL et Agribalyse vérifiées](docs/donnees-ciqual.md)

## Licence

Contenus et code : domaine public ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.fr)). Les données tierces (CIQUAL, etc.) restent sous leur propre licence.
