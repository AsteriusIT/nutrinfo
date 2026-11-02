# Design system — « Carré »

> **Version 2 (novembre 2026).** Les couleurs, polices et étiquettes ont été revues : voir [revue-ux.md](revue-ux.md).
> Résumé : fond blanc « assiette », texte bleu myrtille `#1A1F36`, titres **Archivo** élargi, texte **Atkinson Hyperlegible Next**,
> étiquettes en casse normale (plus de mono en capitales), couleurs = familles d'aliments uniquement,
> paire animal/végétal `#B4467A` / `#2E9E5B` validée pour le daltonisme. **La source de vérité des valeurs est `app/app.css`.**
> Les sections ci-dessous gardent les principes ; les valeurs de couleur et de police de la v1 sont remplacées.

> Inspiration : l'esthétique anguleuse de mistral.ai (angles vifs, bordures fines, accents en blocs « pixel », fond chaud, petites étiquettes en capitales). **On reprend un style, pas une marque** : palette, typographie et motifs sont propres au projet.

## 1. Principes

1. **Arrondis doux** : `rounded-sm` (6 px) pour les étiquettes, `rounded-md` (10 px) pour les boutons, champs et choix, `rounded-lg` (16 px) pour les cartes, encadrés et panneaux. Les éléments graphiques (bande de pixels, logo, morceaux de sucre, cases des graphiques, formes des illustrations) restent carrés : c'est l'identité du site.
2. **La grille est visible** : bordures fines de 1 px, blocs alignés, rythme de 8 px.
3. **Règle des 3 couleurs (60 / 30 / 10)** : fond blanc ou gris très clair (60 %), encre `ink` (30 %), un seul accent vert `accent-*` (10 %) pour les actions, la page active, « L'essentiel » et les chiffres clés. Les couleurs de familles (`veg`, `carb`, `prot`) sont réservées aux graphiques et illustrations, où elles portent une information : vert légumes, jaune féculents, rose protéines.
4. **Le texte d'abord** : lisibilité > décoration. Une idée par bloc.
5. **Le mouvement explique** : animations courtes, désactivées si `prefers-reduced-motion`.
6. **Accessible par défaut** : WCAG 2.2 AA / RGAA 4.1.

## 2. Couleurs

> **Depuis le 2 novembre 2026 (D14)**, l'interface n'utilise que trois couleurs : le fond (`plate`, `faience`), l'encre (`ink`, `muted`, `line`) et l'accent vert (`accent-100` fond, `accent-500` aplat, `accent-800` texte, définis comme alias de `veg-*` dans `app/app.css`). Les couleurs thématiques ci-dessous ne servent plus que dans les graphiques, et seulement `veg`, `carb` et `prot`, les couleurs de l'assiette. Les autres (`dairy`, `fat`, `water`, `age`, `tool`) restent définies mais ne sont plus utilisées.

### Neutres (fond chaud, texte quasi noir)
| Token | Hex | Usage |
|---|---|---|
| `paper` | `#FBF8F1` | Fond de page |
| `surface` | `#FFFFFF` | Cartes |
| `line` | `#E4DED0` | Bordures, séparateurs |
| `muted` | `#6B6558` | Texte secondaire (contraste ≥ 4,5:1 sur `paper`) |
| `ink` | `#1C1A16` | Texte principal, boutons primaires |

### Couleurs thématiques
Chaque thème a une teinte **vive** (blocs, accents, illustrations) et une teinte **foncée** (texte et liens sur fond clair, contraste AA).

| Thème | Vive (`-500`) | Foncée (`-800`, texte) | Claire (`-100`, fond de carte) |
|---|---|---|---|
| Fruits & légumes | `#3DAA4F` | `#1F5E2A` | `#E3F4E5` |
| Féculents / glucides | `#F2B705` | `#6B5000` | `#FDF3CF` |
| Protéines | `#E85A3C` | `#8A2A15` | `#FCE3DC` |
| Laitiers / calcium | `#4FA3E0` | `#1B4F78` | `#E1F0FA` |
| Lipides / huiles | `#F08A1C` | `#7A3F00` | `#FDEBD4` |
| Eau / hydratation | `#1F7FD1` | `#0E3F6B` | `#DCECFA` |
| Âges de la vie | `#8C5BD6` | `#4A2A80` | `#EEE5FA` |
| Outils | `#14A3A3` | `#0A5555` | `#DDF3F3` |

- **Règle de contraste** : le texte ne s'écrit jamais en `-500` sur fond clair → `-800`. Sur un aplat `-500`, texte `ink`.
- Les couleurs **Nutri‑Score (A→E)** sont réservées au Nutri‑Score.
- Jamais la couleur seule : toujours pictogramme et/ou libellé.

### Motif signature : la « bande pixel »
Une bande de carrés de 8 à 16 px qui passe d'une couleur thématique à l'autre (vert → jaune → orange → rouge…). Utilisée en haut de page, en séparateur de section et en pied de page. En CSS/SVG, sans image raster.

## 3. Typographie

| Rôle | Police (libre, OFL) | Notes |
|---|---|---|
| Texte et titres | **Inter** (ou *Public Sans*, conçue pour les services publics) | Très lisible, chiffres tabulaires |
| Étiquettes, chiffres, sources | **JetBrains Mono** ou *IBM Plex Mono* | En CAPITALES, interlettrage +0,05em, petite taille → touche « technique » à la Mistral |

Échelle (rem, base 16 px, mobile → desktop) :
| Token | Taille | Usage |
|---|---|---|
| `display` | 2,5 → 4 | Titre d'accueil |
| `h1` | 2 → 3 | Titre de page |
| `h2` | 1,5 → 2 | Section |
| `h3` | 1,25 | Sous‑section, titre de carte |
| `body` | 1,0625 (17 px) | Texte courant, interligne 1,6, **60‑75 caractères par ligne** |
| `small` | 0,875 | Légendes |
| `label` | 0,75 mono CAPS | Étiquettes, badges de source |

Graisse : 400 texte, 600 titres, 700 chiffres clés. Pas d'italique long, pas de texte justifié.

## 4. Espacement, grille, mise en page

- Base **8 px** ; échelle Tailwind par défaut (`2, 4, 6, 8, 12, 16, 24`).
- Conteneur max **1200 px** ; texte d'article max **72ch**.
- Grille **12 colonnes** desktop, **4** mobile ; gouttière 24 px.
- Points de rupture Tailwind : `sm 640`, `md 768`, `lg 1024`, `xl 1280`. **Mobile d'abord**.
- Grilles de cartes : 1 col (mobile) → 2 (md) → 3 (lg) → 4 (xl pour les cartes compactes).
- Bordures : `1px solid line` ; accent thématique : **barre pleine de 4 px** en haut ou à gauche du bloc.

## 5. Composants

| Composant | Style |
|---|---|
| **Bouton primaire** | Fond `ink`, texte blanc, angles droits, hauteur 44 px min, padding 16 px × 24 px. Survol : fond couleur thématique et texte `ink`, transition 150 ms. Flèche `→` qui se décale de 4 px. |
| **Bouton secondaire** | Bordure 1 px `ink`, fond transparent. |
| **Lien** | Souligné (épaisseur 1 px, décalage 3 px), couleur `-800` du thème. |
| **Carte** | Fond `surface`, bordure `line`, **angles droits**, barre thématique de 4 px en haut, pas d'ombre (ou ombre dure décalée `4px 4px 0 ink` au survol). |
| **Badge / étiquette** | Mono CAPS, fond `-100`, texte `-800`, carré. |
| **Badge source** | `SOURCE · ANSES 2021` en mono, cliquable → bibliographie. |
| **Encadré « À retenir »** | Bloc avec bordure gauche 4 px colorée, fond `-100`. |
| **Champ de formulaire** | Bordure 1 px `ink`, angles droits, focus = contour 2 px thématique + décalage. |
| **Onglets / sélecteur de profil** | Segments carrés accolés, sélection = aplat de couleur. |
| **Navigation** | Barre haute fine, logo texte, liens mono CAPS ; méga‑menu en grille de blocs carrés colorés. |
| **Focus clavier** | Toujours visible : `outline 2px solid ink; outline-offset 2px`. |

## 6. Graphiques et data‑visualisation

- **Barres et blocs carrés** (pas de barres arrondies) ; jauges sous forme de **cases qui se remplissent** (style pixel, ex. 10 cases = 100 % du besoin).
- Une seule couleur par série, la couleur du thème ; grille de fond légère.
- Valeurs écrites directement sur le graphique ; **tableau de données équivalent** accessible.
- Bibliothèque : SVG maison pour les jauges et barres simples ; **Recharts** ou **visx** si besoin.

## 7. Animation

| Usage | Durée | Courbe |
|---|---|---|
| Survol, focus | 120‑150 ms | `ease-out` |
| Apparition au scroll (fondu + translation 8‑16 px) | 300‑400 ms | `cubic-bezier(.2,.8,.2,1)` |
| Remplissage de jauge par cases (en décalé) | 30‑50 ms par case | `steps()` ou décalage |
| Assiette, cartes de quiz | 400‑600 ms | — |

- Animations CSS d'abord ; **Motion** (ex‑Framer Motion) pour les outils interactifs.
- Ne jamais animer le texte de lecture ; pas d'autoplay en boucle infinie.
- `@media (prefers-reduced-motion: reduce)` : transitions coupées, états finaux affichés.

## 8. Tokens Tailwind v4 (extrait)

```css
@import "tailwindcss";

@theme {
  --radius-*: initial;            /* puis --radius-sm / md / lg, voir app/app.css */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-paper: #FBF8F1;
  --color-surface: #FFFFFF;
  --color-line: #E4DED0;
  --color-muted: #6B6558;
  --color-ink: #1C1A16;

  --color-veg-100: #E3F4E5;  --color-veg-500: #3DAA4F;  --color-veg-800: #1F5E2A;
  --color-carb-100: #FDF3CF; --color-carb-500: #F2B705; --color-carb-800: #6B5000;
  --color-prot-100: #FCE3DC; --color-prot-500: #E85A3C; --color-prot-800: #8A2A15;
  --color-dairy-100: #E1F0FA;--color-dairy-500: #4FA3E0;--color-dairy-800: #1B4F78;
  --color-fat-100: #FDEBD4;  --color-fat-500: #F08A1C;  --color-fat-800: #7A3F00;
  --color-water-100: #DCECFA;--color-water-500: #1F7FD1;--color-water-800: #0E3F6B;
  --color-age-100: #EEE5FA;  --color-age-500: #8C5BD6;  --color-age-800: #4A2A80;
  --color-tool-100: #DDF3F3; --color-tool-500: #14A3A3; --color-tool-800: #0A5555;
}
```

⚠️ Les contrastes sont à vérifier avec un outil (ex. WebAIM) au moment de l'implémentation.
