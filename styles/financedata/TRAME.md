# Trame de montage FinanceData

Écrite le 29/10/2026 après le reel « La chute de Google après ses résultats » (`reel-google-resultats/`, 60,7 s, 14 scènes validées une par une).
Elle fixe l'esprit de montage à garder pour les prochains reels. En cas de conflit avec `STYLE.md`, c'est cette trame qui fait foi.

## L'esprit en une phrase

Chaque écran montre **une seule idée**, avec **une seule couleur** pour le point à retenir, sur une **vraie image** ou un **graphique façon presse éco**. Le reste est en gris ou disparaît.

## Méthode de travail

1. Script et voix d'abord : voix coupée et calée (pauses ≤ 0,15 s, jamais de coupe avant « % »), voix non traitée au-delà des coupes et du volume (−16 LUFS).
2. Découpage en scènes calées sur les mots : chaque scène = un créneau de voix précis (horodatage mot à mot).
3. On fabrique et on valide **scène par scène** (vidéo + image fixe envoyées), puis seulement on passe à la suivante.
4. Montage final : les scènes validées mises bout à bout à l'image près, sur la voix complète. La vidéo s'arrête quand la voix s'arrête.

## La trame narrative (modèle « actu décryptée »)

| # | Rôle | Ce qu'on voit | Exemple Google |
|---|---|---|---|
| 1 | **Hook** (≤ 2,5 s) | Fond blanc avec un foyer de lumière, **juste le graphique** : logo + ticker, cours géant qui descend, variation en rouge, aire rouge | GOOGL 324,89 → 291,64 $, −10,2 % |
| 2 | **Contraste** | Graphique clair : le chiffre qui semble contredire le hook | Chiffre d'affaires +25 % |
| 3 | **Question + annonce** | Vidéo réelle sur la question, puis tuiles « Raison 1 / Raison 2 » dont le nom est **masqué** (« ? ») ; la plus importante s'allume | « deux raisons, la 2e est la plus importante » |
| 4 | **Raison 1, le mécanisme** | Vidéo réelle, puis reconstitution simple du produit (page Google, recherche tapée, lien payé encadré) | La publicité |
| 5 | **Raison 1, le chiffre** | Tableau presse éco Attendu / Publié / Écart | Revenus publicitaires sous les attentes |
| 6 | **Raison 2, l'image** | Vidéo réelle plein écran + carte blanche compacte | Data center + « Investissements IA » |
| 7 | **Raison 2, le chiffre** | Colonnes avant / après, la future valeur en pointillés | 24 → 51,4 Md$, 2027 « ? » |
| 8 | **Le problème** | Barres grises + le trou en rouge | 42,3 généré vs 51,4 dépensé, −9,1 |
| 9 | **Conséquence, l'annonce** | Vidéo réelle + cartes « Solution 1 / 2 » avec « ? » | Siège de Google |
| 10 | **Conséquence, la révélation** | Mêmes cartes au même endroit, les « ? » deviennent les réponses | Dette (▲ Risqué) / Nouvelles actions |
| 11 | **Le mécanisme pour l'investisseur** | Schéma pédagogique (exemple chiffré annoncé comme exemple) | Le gâteau 25 % → 20 % |
| 12 | **Le résumé** | Un graphique avant / maintenant qui dit tout | Trésorerie +24,5 → −9,1 |
| 13 | **La question ouverte** | Portrait du dirigeant (autre photo, noir et blanc) + carte centrée avec la question | Gemini · « Rentable ? » |
| 14 | **CTA** | Logo rond (anneau story Instagram), nom, bouton S'abonner → Abonné ✓ | |

Principes de la trame :
- **alterner les trois familles d'écrans** : graphique clair → vraie image + carte → fond bleu nuit, jamais deux fois la même famille trop longtemps ;
- **suspense par masquage** : on annonce (« deux raisons », « deux solutions ») avec des « ? », puis on révèle sur le mot ; les cartes gardent la même place d'une scène à l'autre pour que l'œil suive ;
- **ne jamais répéter** un chiffre déjà montré à l'écran précédent (pas de carte « −9,1 » juste après le graphique du −9,1) ;
- scènes de 2 à 8 s, un nouvel élément qui bouge environ chaque 0,5 à 1 s, **toujours sur le mot qui le nomme**.

## Zone sûre Instagram / TikTok
- tout ce qui n'est pas un fond plein cadre (titres, graphiques, cartes, sous-titres) est **réduit à 82 %** vers le point (540, 880) : marges ≈ 150 px à gauche et à droite, titres vers y ≈ 390, sous-titres vers y ≈ 1270 ;
- photos, vidéos, voiles et fonds restent plein cadre ;
- rien d'important à droite au-delà de x ≈ 930 (boutons TikTok) ni sous y ≈ 1450 (description).

## Les 10 premières secondes
- le hook et le contraste sur le **même fond blanc à foyer** (dégradé radial blanc → gris bleuté sur les bords), puis rupture nette vers le bleu nuit ;
- chaque chiffre arrive avec un mouvement franc (compteur, « +25 % » qui tombe et rebondit, « ? » qui arrivent en grand puis se posent).

## Graphiques boursiers (validé sur Accenture)
- **1 écran = 1 info** : juste la courbe et ses annotations, aucune carte ni cadre en dessous ; la courbe prend toute la hauteur libre ;
- courbe marine épaisse, sans aire ni dégradé ; zone de tracé séparée de la gouttière des valeurs à droite : la courbe ne touche jamais les chiffres ;
- valeurs avec unité (« 250 $ ») posées au-dessus de leur ligne de grille, ligne de base marine avec petites graduations, mois en dessous ;
- au plus deux annotations courtes, chacune dans une zone vide (jamais sur la courbe ni sur une ligne de grille) : une neutre en marine (« Plus bas : 124 $ »), une clé dans la seule couleur de l'écran, avec la date repérée sous l'axe.

## Les trois familles d'écrans

### 1. Graphique « The Economist version FinanceData »
- fond **#EEF1F5**, marges 96 px ;
- titre en haut à gauche (Inter Display 700, 72–76 px, −.055em, marine #0A105E), avec le vrai logo de l'entreprise si utile ; **pas de sous-titre** ;
- sous le graphique, **une seule ligne de source** en gris #6B7290 : « Période, unité · Source(s) : … » (ex. « T3 2026, en milliards de dollars · Sources : Alphabet, Zacks ») ; **pas de signature FinanceData** ;
- quadrillage léger #D5DAE5, axe des valeurs à droite, ligne du zéro en marine, chiffres tabulaires, vrai signe moins « − » ;
- colonnes et barres à **angles droits** ;
- **une seule couleur par graphique, sur le point à retenir** ; tout le reste en gris (#C5CAD9 clair, #7A819B foncé) ;
- les chiffres **comptent** jusqu'à leur valeur quand la barre pousse ;
- formes possibles : colonnes avant / après, barres horizontales avec le trou hachuré, tableau sans bordure (filet marine sous les en-têtes, filets fins entre lignes, colonne clé légèrement teintée), camembert pédagogique.

### 2. Vraie image + carte blanche
- vraie photo ou vraie vidéo en plein écran, **lente poussée** (scale 1 → 1,06–1,08), léger filtre bleu parfois, voile bleu nuit en bas pour les sous-titres ;
- carte **blanche**, coins 4 px max, ombre douce, **largeur ajustée au contenu**, posée dans une zone vide de l'image (ciel, fond) et jamais sur le visage ou le logo filmé ; contenu centré ou aligné à gauche, mais aligné ;
- dans la carte : logo réel + nom, une ligne grise de contexte, **un** élément fort (cours, mot-clé, question) ;
- photos du dirigeant : premium (magazine, studio), visage assez haut dans le cadre ; une photo différente pour le hook et pour la fin.

### 3. Fond bleu nuit #000B22
- pour les moments de question / d'annonce ; tuiles à angles droits (fond blanc 5 %, filet blanc 12 %), la tuile importante s'allume en bleu FinanceData.

## Couleurs (une à la fois)

| Couleur | Code | Usage |
|---|---|---|
| Bleu FinanceData | #3D5AFE | le point clé neutre ou positif (colonne qui compte, question finale, bouton) |
| Rouge | #D9161E | uniquement l'alerte (chute, trou, risque) |
| Vert | #1F9D55 | uniquement un gain (+25 %) |
| Marine | #0A105E | textes sur fond clair |
| Gris | #6B7290 / #C5CAD9 / #7A819B | tout le reste |

Les logos restent dans leurs couleurs officielles (Google G multicolore, YouTube rouge, Gemini en dégradé).

## Sous-titres
- Inter Display 700, 66 px, interlettrage −.055em, centrés, **sans boîte** ;
- **blancs avec ombre** sur image ou bleu nuit, **marine** sur fond clair ;
- **3 mots max**, chiffres en chiffres (« 10 % », « 50 milliards »), calés mot à mot sur la voix ;
- hauteur ≈ 1335–1360 px ; on bouge l'image (pas les sous-titres trop bas) pour qu'ils ne cachent pas le sujet (logo filmé, visage) ;
- aucun sous-titre sur le CTA.

## Images et vidéos
- **toujours du réel** : photos et vidéos trouvées (Pinterest, banques d'images), logos officiels (Simple Icons, Wikimedia) ;
- recadrer le texte incrusté et les filigranes ; un plan trop court se ralentit (×1,5) puis se fige sur la dernière image pendant que la poussée continue ;
- vérifier les droits avant publication (photos de presse, vidéos Pinterest).

## Ce qu'on évite (retours déjà donnés)
- l'aspect « fait par IA » : tuiles vides brillantes, gros chiffre flottant au centre d'un fond sombre, effets de lueur ;
- trop de couleurs dans un même graphique ;
- les rouges pâles (rouge franc #D9161E) ;
- les écrans trop chargés : si un élément n'apporte rien de nouveau, on l'enlève ;
- les coins arrondis, le style « keynote Apple » trop lisse ou trop simpliste ;
- les cartes trop larges pour leur contenu, les éléments mal alignés dans le cadre.

## CTA
- fond #EEF1F5 ; logo FinanceData **rond** entouré de l'anneau dégradé des stories Instagram (l'anneau tourne légèrement à l'apparition) ;
- « FinanceData » en Inter Display 700 ; bouton « S'abonner » bleu FinanceData, coins 4 px, qui passe à « Abonné ✓ » sur « abonnez-vous » ;
- rien d'autre.

## Technique
- une scène = un dossier `scenes/sN/` (HyperFrames 0.8.137, timeline GSAP en pause, assets copiés en local, tranche de voix `voix.mp3`) ;
- `check` sans erreur avant chaque rendu, image fixe vérifiée à l'œil ;
- montage final : `trim` à l'image près de chaque `sceneN.mp4` sur les bornes de voix (30 i/s), `concat`, voix complète en AAC, vérification de quelques images clés et de la sonie.
