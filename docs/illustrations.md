# Illustrations et icônes

Contraintes : **simples**, très présentes, cohérentes avec le style **carré**, et **compatibles avec un site dans le domaine public**. On privilégie donc les ressources **CC0**, puis MIT/ISC/Apache (qui demandent seulement de conserver la mention de licence).

## Recommandation

| Besoin | Ressource | Licence | Pourquoi |
|---|---|---|---|
| **Icônes santé / nutrition** | **[Healthicons](https://healthicons.org)** | **CC0** (icônes), MIT (code) | Plus de 1 000 icônes santé, dont aliments, nutrition, grossesse, âges ; versions pleines et contour ; conçues pour la santé publique |
| Icônes d'interface | **[Pixelarticons](https://github.com/halfmage/pixelarticons)** (gratuit) ou **[Tabler Icons](https://tabler.io/icons)** | MIT | Pixelarticons : grille 24×24 en pixels, parfait pour l'esprit « carré ». Tabler : traits droits, `stroke-linejoin="miter"` |
| **Illustrations d'aliments et de scènes** | **Bibliothèque maison** en SVG géométrique (voir ci‑dessous) | **CC0** (création du projet) | Cohérence totale avec le design, aucune contrainte de licence, légères et animables |
| Personnages (âges de la vie) | **[Open Peeps](https://www.openpeeps.com)** | CC0 | Personnages modulaires ; à **simplifier/géométriser** pour coller au style |
| Petits sprites pixel d'aliments (en option) | [CC0 Food Icons — OpenGameArt](https://opengameart.org/content/cc0-food-icons) | CC0 | Style pixel 16‑32 px, pour décorations ou jeux (quiz) |

**À éviter ou à utiliser avec attention** : OpenMoji (CC BY‑SA : partage à l'identique obligatoire), Twemoji (CC BY : attribution), unDraw (licence propre, pas de redistribution en collection), Humaaans (licence ambiguë selon les sources).

## Style « maison » proposé : géométrie carrée

- Construction sur une **grille de 24 ou 48 unités**, formes de base : **carrés, rectangles, triangles, quarts de cercle** (une pomme = carré + quart de cercle + feuille triangle).
- **Aplats** dans les couleurs thématiques du design system, **sans dégradé ni contour noir** (ou contour 2 px `ink` en variante).
- 2‑3 couleurs maximum par illustration.
- Variante **pixel** (blocs de 4 px) pour la bande signature, les jauges et le quiz.
- Format **SVG inline** → animable en CSS (les éléments s'assemblent à l'apparition), poids minimal, couleur pilotable par `currentColor`.

### Liste d'illustrations prioritaires (MVP)
1. Assiette équilibrée (½ légumes, ¼ féculents, ¼ protéines) — **animée** sur l'accueil
2. Les 8 familles d'aliments (1 pictogramme par famille)
3. Balance « animal vs végétal »
4. 7 personnages d'âges : bébé, enfant, ado, adulte, grossesse, adulte 50+, senior
5. Verre d'eau qui se remplit
6. Morceaux de sucre (empilables)
7. Repères PNNS : pictos « augmenter / aller vers / réduire »

## Mentions
Une page « Crédits » liste les ressources tierces et leur licence, même lorsqu'elles sont CC0 (bonne pratique).
