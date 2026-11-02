# Proposition de topologie — nutrinfo

> Site public d'information en français sur l'alimentation saine, selon l'âge et la situation de vie.
> Mots d'ordre : **simple · coloré · UX soignée · centré sur l'utilisateur**.
> Fondé sur les synthèses de [`docs/synthese/`](synthese/) et les sources de [`00-sources.md`](00-sources.md).

---

## 1. Principes directeurs

1. **Entrée par la personne, pas par la science** : la page d'accueil demande « Qui êtes‑vous ? » (âge, situation) avant de parler de nutriments.
2. **Trois niveaux de lecture** sur chaque page :
   - 🟢 **L'essentiel** (3 messages, 30 secondes) ;
   - 🟡 **Pour comprendre** (explications, graphiques) ;
   - 🔵 **Pour aller plus loin** (chiffres, tableaux ANSES, sources).
3. **Chaque chiffre est sourcé** (badge « Source : ANSES 2021 » cliquable).
4. **Bienveillance** : aucun aliment « interdit » ou « poison », pas de culpabilisation (attention aux TCA).
5. **Ce n'est pas un avis médical** : rappel discret et renvoi vers professionnels de santé.

---

## 2. Arborescence

```
🏠 Accueil
│
├── 🧭 Mon profil  ──────────────────────────── (parcours personnalisé)
│   └── Mes repères personnalisés (page générée selon âge/sexe/situation/activité/régime)
│
├── 🍽️ 1. Les bases de l'équilibre
│   ├── L'assiette équilibrée
│   ├── Les repères du PNNS : Augmenter / Aller vers / Réduire
│   ├── Les groupes d'aliments
│   ├── Énergie et calories : comprendre ses besoins
│   ├── Rythme des repas (petit‑déjeuner, goûter, grignotage)
│   └── Faire ses courses et cuisiner simple
│
├── 🔬 2. Les nutriments
│   ├── Protéines
│   │   ├── À quoi servent les protéines ?
│   │   ├── Protéines animales vs végétales  ⭐
│   │   └── Bien associer céréales + légumineuses
│   ├── Glucides
│   │   ├── Glucides complexes et féculents complets
│   │   ├── Les sucres (et sucres cachés)
│   │   ├── Index glycémique
│   │   └── Les fibres
│   ├── Lipides
│   │   ├── Les bonnes et moins bonnes graisses
│   │   ├── Oméga‑3 et oméga‑6
│   │   └── Quelle huile choisir ?
│   ├── Vitamines (une fiche par vitamine : A, B1…B12, C, D, E, K)
│   ├── Minéraux et oligo‑éléments (calcium, fer, magnésium, zinc, iode, sodium, potassium, sélénium…)
│   └── L'eau
│
├── 🥕 3. Les familles d'aliments
│   ├── Fruits et légumes (+ calendrier de saison)
│   ├── Féculents et céréales
│   ├── Légumineuses
│   ├── Fruits à coque et graines
│   ├── Viandes, volailles, œufs
│   ├── Poissons et fruits de mer
│   ├── Produits laitiers
│   ├── Matières grasses
│   ├── Produits sucrés
│   └── Boissons (eau, sucrées, café/thé, énergisantes, alcool)
│
├── 👶👧🧑👵 4. À chaque âge de la vie  ⭐
│   ├── Nourrissons (0‑12 mois) : allaitement, diversification
│   ├── Jeunes enfants (1‑3 ans)
│   ├── Enfants (4‑11 ans)
│   ├── Adolescents (12‑17 ans)
│   ├── Adultes (18‑64 ans)
│   ├── Projet de grossesse, grossesse et allaitement
│   ├── Ménopause
│   └── Seniors (65 ans et +) : prévenir la dénutrition
│
├── 🌱 5. Modes alimentaires
│   ├── Flexitarien
│   ├── Végétarien
│   ├── Végétalien / végan
│   ├── Méditerranéen
│   ├── Sport et nutrition
│   ├── Sans gluten : pour qui ?
│   └── Jeûne et régimes : ce que dit la science
│
├── 🏷️ 6. Bien choisir
│   ├── Lire une étiquette
│   ├── Nutri‑Score
│   ├── Aliments ultra‑transformés
│   ├── Additifs
│   ├── DLC / DDM et anti‑gaspillage
│   ├── Manger sain avec un petit budget
│   └── Manger durable (saison, local, bio)
│
├── ❤️ 7. Nutrition et santé (prévention)
│   ├── Cœur et vaisseaux
│   ├── Diabète de type 2
│   ├── Cancers
│   ├── Poids et corpulence
│   ├── Santé des os
│   ├── Allergies et intolérances
│   ├── Dénutrition
│   └── Relation à l'alimentation (TCA — ressources d'aide)
│
├── 🏃 8. Bouger
│   ├── Activité physique selon l'âge
│   └── Réduire la sédentarité
│
├── 🧰 9. Outils interactifs  ⭐
│   ├── Calculateur de besoins (énergie + protéines)
│   ├── Mon assiette interactive
│   ├── Comparateur d'aliments (animal vs végétal, etc.)
│   ├── Explorateur de nutriments (« où trouver du fer ? »)
│   ├── Calendrier des fruits et légumes de saison
│   ├── Compteur d'hydratation
│   ├── Quiz et Vrai/Faux
│   └── Calculateur IMC (adulte)
│
└── 📚 10. Ressources
    ├── Glossaire
    ├── FAQ
    ├── Nos sources et notre méthode
    ├── Fiches à télécharger (PDF)
    ├── À propos
    ├── Accessibilité (déclaration RGAA)
    ├── Mentions légales
    └── Confidentialité / cookies
```

⭐ = sections phares mises en avant sur l'accueil.

---

## 3. Navigation et parcours utilisateur

### Navigation principale (6 entrées max, lisible sur mobile)
**Bien manger** (bases + familles d'aliments) · **Nutriments** · **Selon mon âge** · **Mode de vie** (régimes, sport, bouger) · **Outils** · **Recherche 🔍**
Le reste (santé, bien choisir, ressources) en méga‑menu et pied de page.

### Trois parcours types
| Persona | Besoin | Parcours |
|---|---|---|
| **Léa, 32 ans, enceinte** | « Que dois‑je éviter ? » | Accueil → profil « Grossesse » → page Grossesse → checklist PDF |
| **Karim, 45 ans, veut moins de viande** | « Comment avoir assez de protéines ? » | Recherche « protéines » → Animal vs Végétal → comparateur → page Flexitarien |
| **Monique, 78 ans (ou son aidant)** | « Elle mange peu » | Selon mon âge → Seniors → Dénutrition → idées d'enrichissement |

### Éléments transverses sur chaque page
- Fil d'Ariane, temps de lecture, **badge de source**, date de mise à jour.
- Bloc « **À retenir** » en haut ; « **Pages liées** » en bas (maillage interne).
- Bouton « **Adapter à mon profil** » (si profil défini, encadrés personnalisés).

---

## 4. Interactions utilisateur

| Interaction | Description | Où |
|---|---|---|
| **Sélecteur de profil** | Âge, sexe, grossesse/allaitement, activité, mode alimentaire → repères personnalisés. **Calcul 100 % dans le navigateur, aucune donnée stockée côté serveur** (RGPD simple). | Accueil, Mon profil |
| **Assiette interactive** | Glisser‑déposer des aliments dans l'assiette ; l'assiette se colore et donne un retour bienveillant | Bases |
| **Comparateur** | 2 aliments côte à côte : protéines, fer, fibres, AGS, empreinte carbone (CIQUAL + Agribalyse) | Protéines, Outils |
| **Explorateur de nutriments** | « Tableau périodique » coloré des nutriments → fiche + top aliments | Nutriments |
| **Frise de la vie** | Curseur d'âge 0 → 100 ans ; les besoins clés évoluent en direct | Selon mon âge |
| **Calendrier de saison** | Roue des mois animée | Fruits et légumes |
| **Étiquette décryptée** | Zones survolables d'un emballage | Bien choisir |
| **Quiz / Vrai‑Faux** | Cartes qui se retournent, score final, partage | Outils, fin d'articles |
| **Compteurs hebdomadaires** | Jauges viande / poisson / légumineuses / alcool | Repères PNNS |
| **Fiches PDF** | Version imprimable des pages clés | Partout |
| **Recherche instantanée** | Recherche plein texte + suggestions (aliments, nutriments, âges) | En‑tête |

---

## 5. Animations et graphiques

### Principes
- Animations **utiles** (elles expliquent), courtes (200‑600 ms), déclenchées au scroll ou à l'interaction.
- Respect de **`prefers-reduced-motion`** (accessibilité) : version statique automatique.
- Graphiques toujours accompagnés d'un **texte alternatif / tableau** de données.

### Catalogue
| Type | Exemple |
|---|---|
| Illustration animée (Lottie/SVG) | Assiette qui se compose à l'arrivée sur l'accueil ; personnages par âge |
| Barres animées | Top 10 aliments riches en fer, comparateur |
| Jauges / anneaux | Couverture des besoins (protéines, calcium…), hydratation |
| Pictogrammes empilés | Morceaux de sucre dans les boissons ; verres standard d'alcool |
| Frise / timeline | Besoins au fil de la vie ; diversification mois par mois |
| Roue | Calendrier de saison |
| Diagramme de répartition | Répartition protéines / lipides / glucides (donut) |
| Micro‑interactions | Cartes qui se retournent (quiz), aliments qui « sautent » dans l'assiette |

---

## 6. Identité visuelle

→ Voir [design-system.md](design-system.md) (style **carré**, palette thématique, typographie, composants, animation) et [illustrations.md](illustrations.md).
Deux types de contenu : **page plein contenu** et **cartes d'information** → [modele-contenu.md](modele-contenu.md).

## 7. Exigences d'un site public

- **Accessibilité RGAA 4.1 / WCAG 2.2 AA** : navigation clavier, lecteurs d'écran, contrastes, sous‑titres pour les vidéos.
- **RGPD** : pas de compte obligatoire, profil stocké localement (localStorage) et effaçable, mesure d'audience exemptée de consentement (ex. Matomo configuré selon la CNIL), bannière cookies seulement si nécessaire.
- **Mentions légales**, éditeur, hébergeur, **déclaration d'accessibilité**.
- **Avertissement santé** : « Informations générales, ne remplacent pas un avis médical ».
- **Neutralité** : pas de publicité ni de marques ; liens d'intérêts déclarés.
- **Méthodologie éditoriale publique** : sources, date de révision, relecture par un(e) diététicien(ne)/nutritionniste recommandée.
- **Performance et éco‑conception** (RGESN) : pages légères, animations SVG/CSS plutôt que vidéo.
- **SEO** : URL lisibles en français (`/nutriments/proteines/animales-vs-vegetales`), données structurées.

---

## 8. Proposition de priorisation (MVP → V2)

| Phase | Contenu |
|---|---|
| **MVP** | Accueil + sélecteur de profil · Les bases (assiette, repères PNNS) · Protéines (dont animal vs végétal), Glucides, Lipides, Eau · 4 pages âges (enfants, adultes, grossesse, seniors) · Calculateur de besoins · Sources, mentions légales, accessibilité |
| **V1** | Fiches vitamines/minéraux · Familles d'aliments · Bien choisir (étiquette, Nutri‑Score) · Assiette interactive · Comparateur · Quiz |
| **V2** | Modes alimentaires · Nutrition et santé · Calendrier de saison · Fiches PDF · Frise de vie |

---

## 9. Décisions prises

→ Voir [decisions.md](decisions.md) : React Router v8 + Tailwind v4 (SSG), CIQUAL/ANSES/EFSA, illustrations CC0 + style maison, domaine public (CC0), relecture experte reportée.
