# Revue UI/UX — itération 2

Revue de la v1 à l'aide des skills *frontend-design* (identité, typographie, mouvement, rédaction) et *dataviz* (couleurs vérifiées par script, anatomie des graphiques).

## 1. Ce qui n'allait pas dans la v1

| # | Constat | Pourquoi c'est un problème | Correction |
|---|---|---|---|
| 1 | Fond crème `#FBF8F1` + texte quasi noir | Combinaison « par défaut » des sites générés ; rien de spécifique à la nutrition | Fond **blanc assiette**, texte **bleu myrtille** `#1A1F36` |
| 2 | Étiquettes en mono + CAPITALES partout, méta reliées par « · » | Habillage de gabarit, fatigue de lecture, peu accessible (capitales = lecture plus lente) | Étiquettes en **casse normale**, police du texte, demi‑gras |
| 3 | Inter | Police par défaut de tous les projets | **Archivo** (largeur variable, titres élargis, carrés d'aspect « affiche de marché ») + **Atkinson Hyperlegible Next** (conçue pour la lisibilité par le Braille Institute, adaptée à un site public) |
| 4 | Pastilles numérotées 1‑2‑3 dans « À retenir » et le sélecteur d'âge | Ce ne sont pas des étapes ; la numérotation suggère un ordre qui n'existe pas | Carrés de couleur (puce = famille d'aliment) |
| 5 | Flèche « → » ajoutée à chaque bouton | Tic de gabarit ; l'action doit être dans le libellé | Libellés d'action explicites (« Comparer les protéines »), retour visuel par aplat de couleur |
| 6 | Animations partout (bande, cartes, sections au scroll) | Effets dispersés = bruit ; le mouvement doit signaler quelque chose | **Un seul moment orchestré par page** (l'assiette qui se compose) + mouvement uniquement en réponse à une action |
| 7 | **Comparateur rouge/vert : échec daltonisme** (ΔE 3,3 en deutéranopie, cible ≥ 8) | 8 % des hommes ne distinguent pas « animal » de « végétal » | Paire validée par script : **animal `#B4467A` (betterave)**, **végétal `#2E9E5B`** → ΔE 8,4, tous contrôles passés |
| 8 | Bande de pixels décorative en haut et en bas | Décor sans information | La bande **reprend les proportions de l'assiette** (½ légumes, ¼ féculents, ¼ protéines) : elle devient un rappel du message central, en haut de page uniquement |
| 9 | Illustration de l'accueil passive | Le visiteur regarde, n'agit pas | **Assiette explorable** : chaque case est un bouton qui affiche le repère correspondant |
| 10 | Rubriques « Bientôt » au même niveau que le contenu réel | Promesses vides, clics frustrants | Rubriques disponibles mises en avant ; les autres regroupées discrètement |

## 2. Plan de design révisé

### Couleurs (base)
| Nom | Hex | Rôle |
|---|---|---|
| Assiette | `#FFFFFF` | Fond |
| Faïence | `#F1F3F6` | Surfaces secondaires, zones d'outil |
| Myrtille | `#1A1F36` | Texte, traits, boutons |
| Myrtille douce | `#545A73` | Texte secondaire (contraste 6,9:1) |
| Trait | `#D9DDE5` | Séparateurs |

Les couleurs vives = **familles d'aliments** (jamais décoratives) : légumes `#2E9E5B`, féculents `#E9B10F`, protéines/animal `#B4467A`, laitiers `#3B82C4`, lipides `#F08A1C`, eau `#1F7FD1`, âges `#7C3AED`, outils `#14A3A3`. Chacune a une teinte claire (fond) et foncée (texte, contraste AA).

### Typographie
- **Archivo** élargi (`wdth` 112‑125), graisse 800 : titres. La largeur variable est un outil expressif : titres larges et carrés comme des étiquettes de marché.
- **Atkinson Hyperlegible Next** : texte, étiquettes, interface. 17 px, interlignage 1,6, 65‑72 caractères par ligne.
- Chiffres clés en Archivo, chiffres tabulaires.

### Mise en page
```
┌──────────────────────────────────────────────┐
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ (½ ¼ ¼)    │ ← bande assiette
│ Titre large Archivo        ┌───────┬───┐     │
│ chapeau                    │ légum.│féc│ eau │ ← assiette = interface
│ [action principale]        │       ├───┤ lait│
│                            │       │pro│ fruit
│                            └───────┴───┘     │
├──────────────────────────────────────────────┤
│ panneau : repère de la case choisie          │
└──────────────────────────────────────────────┘
```
Alignement à gauche partout ; grille 12 colonnes ; angles droits (exigence du brief).

### Principes
1. **L'assiette est l'interface** : le motif carré vient de l'assiette découpée en cases, pas d'un décor.
2. **Une couleur = une famille d'aliment**, partout sur le site.
3. **Une seule audace par page** ; le reste reste calme.
4. **Le mouvement répond** à une action (choisir, ajouter, filtrer), sauf l'assiette qui se compose au chargement de l'accueil.
5. **Écrire pour la personne** : verbes d'action, casse normale, pas de jargon sans explication.

## 3. Graphiques (dataviz)
- Paire animal/végétal validée par `validate_palette.js` (mode clair) ; légende toujours présente + étiquettes directes.
- Barres séparées par 2 px de fond, valeurs écrites dans la couleur du texte (jamais dans la couleur de la série).
- Tableau sémantique sous chaque graphique (lecteurs d'écran).
- Exception assumée au skill : **extrémités de barres carrées** (le brief impose zéro arrondi).
