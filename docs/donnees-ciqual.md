# Données de composition : vérification CIQUAL et Agribalyse

Vérifié le 2 novembre 2026.

## Méthode

- **Composition** : table **CIQUAL 2020** (ANSES), fichier officiel `XML_2020_07_07.zip`. Le site ciqual.anses.fr était indisponible (erreur 503) : l'archive a été récupérée par la Wayback Machine (copie du fichier officiel listé sur data.gouv.fr). C'est la dernière version publiée sur data.gouv.fr.
- **Climat** : **Agribalyse 3.1** (ADEME), indicateur « Changement climatique » en kg CO₂e par kg d'aliment, fichier de synthèse de data.ademe.fr. On a pris le même code aliment que CIQUAL.
- Toutes les valeurs utilisées sur le site sont dans [`app/data/ciqual.ts`](../app/data/ciqual.ts), avec leur code CIQUAL. Les outils calculent les quantités par portion à partir de ce fichier.
- Une teneur absente de CIQUAL est notée `null` et affichée « non mesuré ». On ne l'invente pas.

## Corrections du comparateur protéines (pour 100 g)

| Aliment (code CIQUAL) | Avant (provisoire) | Vérifié |
|---|---|---|
| Steak haché 5 % cuit (6251) | prot. 26 · fer 2,7 · AGS 2,3 · climat 28 | prot. 25,5 · fer 2,8 · AGS 2,7 · climat **45,2** |
| Blanc de poulet poêlé (36018) | prot. 29 · fer 0,5 · AGS 0,9 · climat 6 | prot. 30,1 · fer 0,4 · AGS 0,6 · climat 7,5 |
| Œuf dur (22010) | prot. 12,5 · fer 1,6 · AGS 2,8 · climat 2,4 | prot. 13,5 · fer 1,7 · AGS 2,6 · climat 2,7 |
| Tofu nature (20904) | prot. 12,5 · fer 2 · fibres 1,3 · AGS 1,2 · climat 2 | prot. 13,4 · fer 2,4 · fibres **non mesuré** · AGS 1,4 · climat 1 |
| Lentilles vertes cuites (20587) | prot. 10 · fer 2,5 · fibres 8 · climat 1 | prot. 10,1 · fer 2,5 · fibres 8,5 · climat 0,5 |
| Pois chiches cuits (20507) | fer 1,9 · fibres 7 · AGS 0,3 · climat 1 | fer **1,3** · fibres 8,2 · AGS 0,5 · climat 0,6 |

Outil « Mon besoin en protéines » : tofu 12 → 13 g, poulet 35 → 36 g, œuf 6 → 7 g (portion de 50 g). Les autres portions étaient justes.

## Hypothèses des outils

- 1 morceau de sucre n° 4 = 5 g.
- Boissons : 1 ml = 1 g.
- Sucres libres (OMS 2015) : sucres ajoutés, miel, sirops, jus de fruits. Le sucre du fruit entier et le lactose du lait n'en font pas partie.
- La part de lactose d'un yaourt aux fruits est estimée à partir d'un yaourt nature (3,3 g par pot de 125 g).
- Eau : 20 % des apports viennent des aliments (EFSA 2010).

## Reste à vérifier

- Les références des fiches vitamines et minéraux (`content/fiches/nutriments.yaml`) viennent de l'avis ANSES 2021 et non de CIQUAL. Elles restent à contrôler dans les tableaux de l'avis.
