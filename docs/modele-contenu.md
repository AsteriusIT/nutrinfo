# Modèle de contenu — 2 types

## Type 1 — Page plein contenu (`page`)

Pour expliquer : un sujet développé sur toute la largeur de lecture (ex. *Protéines animales vs végétales*, *Grossesse*).

**Format** : fichier **MDX** (Markdown + composants React pour graphiques et outils).

**Structure type**
```
[Bande pixel couleur du thème]
FIL D'ARIANE (mono)
H1 + chapeau (1-2 phrases)
Étiquettes : THÈME · ÂGE · 6 MIN · MAJ 2026-11
───────────────
▌À RETENIR (3 points max)
H2 Pour comprendre … (texte, illustration, graphique animé)
H2 …
▸ Pour aller plus loin (repliable : tableaux chiffrés)
───────────────
Sources (badges)  ·  Statut de relecture
Pages liées (grille de cartes)
```

**Métadonnées (frontmatter)**
```yaml
type: page
titre: "Protéines animales ou végétales ?"
chapeau: "Les deux apportent des protéines, mais pas les mêmes nutriments."
theme: proteines          # → couleur
rubrique: nutriments
ages: [adulte, ado, senior]
profils: [flexitarien, vegetarien]
a_retenir:
  - "Adulte : environ 0,83 g de protéines par kg et par jour."
  - "Céréales + légumineuses sur la journée = profil complet."
  - "Viande hors volaille : maximum 500 g par semaine."
sources: [AFSSA-2007, EFSA-DRV, PNNS4]
maj: 2026-11-01
relecture: non-relu
illustration: proteines-balance
liees: [legumineuses, vegetarien, calculateur-proteines]
```

## Type 2 — Cartes d'information (`fiche`)

Pour consulter vite : une info courte et structurée, affichée **en grille de cartes** à l'interface minimale. Exemples : un nutriment, un aliment, une idée reçue, un repère chiffré.

**Format** : **données structurées** (YAML/JSON) → un seul composant `<Carte>` rendu en grille, filtrable.

**Anatomie d'une carte** (lisibilité avant tout)
```
┌──────────────────────────┐ ← barre de 4 px couleur thème
│ [icône]       VITAMINE   │ ← étiquette mono
│ Vitamine D               │ ← titre h3
│ 15 µg/jour               │ ← chiffre clé (gros, gras)
│ Os, muscles, immunité.   │ ← 1 phrase max
│ ☀ Soleil · poissons gras │ ← sources alimentaires
│ ANSES 2021          →    │ ← source + lien vers détail
└──────────────────────────┘
```
Règles : **pas plus de 5 éléments par carte**, pas de paragraphe, un seul chiffre clé, carte entière cliquable si elle mène à une page.

**Variantes**
| Variante | Contenu | Exemple de rubrique |
|---|---|---|
| `nutriment` | Rôle, besoin, sources | Vitamines, minéraux |
| `aliment` | Groupe, chiffres CIQUAL/100 g, repère | Familles d'aliments |
| `repere` | Pictogramme + fréquence (« 2×/semaine ») | Repères PNNS |
| `vrai-faux` | Affirmation → verdict au retournement | Idées reçues |
| `chiffre` | Un grand nombre + contexte | Accueil, pages d'âge |

**Exemple de données**
```yaml
- type: fiche
  variante: nutriment
  id: vitamine-d
  titre: "Vitamine D"
  theme: laitiers
  etiquette: "Vitamine"
  chiffre: "15 µg/jour"
  chiffre_note: "adulte, apport satisfaisant"
  resume: "Fixe le calcium sur les os, soutient muscles et immunité."
  sources_alimentaires: ["Soleil", "Poissons gras", "Œufs"]
  vigilance: [senior, enfant, hiver]
  source: ANSES-2021
  page: /nutriments/vitamines/vitamine-d
```

## Combinaison des deux types
- Une **page** peut inclure une **grille de cartes** (ex. page *Seniors* → cartes « nutriments à surveiller »).
- Une **carte** peut renvoyer vers une **page** pour en savoir plus.
- Les pages d'index des rubriques (*Vitamines*, *Aliments*) sont des **grilles de cartes filtrables** (par âge, thème, profil).

## Arborescence des fichiers (prévue)
```
content/
  pages/            # MDX — type 1
    nutriments/proteines/animales-vs-vegetales.mdx
    ages/grossesse.mdx
  fiches/           # YAML — type 2
    nutriments.yaml
    aliments.yaml   # généré depuis CIQUAL
    reperes.yaml
    vrai-faux.yaml
  sources.yaml      # bibliographie (codes → références complètes)
```
