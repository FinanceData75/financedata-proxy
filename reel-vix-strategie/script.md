# Reel — Acheter quand le VIX dépasse 40 : la stratégie qui marche… et qui fait perdre de l'argent

Format : leçon d'investissement · Structure : La Percée (stat choc → preuve → test → révélation → règle) · ~60 s · « vous » · evergreen

## Voix off

Il existe un signal qui, depuis 1990, a presque toujours annoncé une forte hausse de la Bourse. Et pourtant, le suivre vous aurait coûté 165 000 dollars.

Ce signal, c'est le VIX, l'indice de la peur à Wall Street. Quand il dépasse 40, c'est la panique : la crise de 2008, le Covid, les droits de douane de 2025.

Et acheter le S&P 500 dans ces moments-là, ça marche. Un an plus tard, il a pris en moyenne 21 %. Presque deux fois plus que d'habitude.

Alors faisons le test. Deux investisseurs mettent 100 dollars de côté chaque mois depuis 1990.

Le premier investit tous les mois, sans se poser de questions.

Le second attend la panique. Il garde son argent, et n'achète que quand le VIX dépasse 40.

Résultat aujourd'hui : le premier a 524 000 dollars. Le second, seulement 359 000.

Pourquoi ? Parce que la vraie panique est rare. Neuf fois en 36 ans. Pendant qu'il attend, son argent dort, et il rate des années entières de hausse.

La leçon ? Acheter dans la peur, c'est puissant. Mais attendre la peur, ça coûte bien plus cher.

Pour comprendre les marchés simplement, abonnez-vous.

(≈ 190 mots)

## Découpage (trame FinanceData)

| # | Rôle | Texte | Durée | Visuel |
|---|---|---|---|---|
| 1 | Hook | « Il existe un signal… 165 000 dollars » | ~6 s | fond blanc à foyer : courbe du VIX 1990 → aujourd'hui, les pics au-dessus de 40 s'allument, puis « −165 000 $ » en rouge |
| 2 | Le signal | « Ce signal, c'est le VIX… droits de douane de 2025 » | ~7 s | vraies images des trois crises (salle de marché 2008, Covid, 2025), le VIX en grand à l'écran |
| 3 | La preuve | « Acheter le S&P 500… deux fois plus que d'habitude » | ~6 s | deux colonnes : +21 % un an après un VIX > 40 (vert) contre +12 % en moyenne (gris) |
| 4 | Le test | « Deux investisseurs… 100 dollars par mois » | ~4 s | deux silhouettes / cartes : « Chaque mois » et « Attend la panique » |
| 5 | Investisseur 1 | « Le premier investit tous les mois… » | ~3 s | aire verte qui monte régulièrement |
| 6 | Investisseur 2 | « Le second attend la panique… » | ~5 s | escalier : le cash s'accumule en gris, investi d'un coup aux 9 pics |
| 7 | Résultat | « 524 000 … 359 000 » | ~6 s | les deux courbes superposées, chiffres finaux, l'écart « −165 000 $ » en rouge |
| 8 | Pourquoi | « La vraie panique est rare. Neuf fois en 36 ans… » | ~8 s | frise 1990 → 2026 avec 9 points rouges, de longues années vides entre eux |
| 9 | Leçon | « Acheter dans la peur… coûte bien plus cher » | ~5 s | bleu nuit, une phrase |
| 10 | CTA | « Pour comprendre les marchés simplement, abonnez-vous. » | ~3 s | logo rond (anneau story), nom, bouton S'abonner |

## Le test (backtest FinanceData, `donnees/backtest.py`)
- Données : clôtures quotidiennes Yahoo Finance du 02/01/1990 au 29/10/2026 : VIX (^VIX) et S&P 500 dividendes réinvestis (^SP500TR)
- Épisodes « VIX > 40 » (première clôture au-dessus de 40 après au moins six mois sous ce seuil) : 31/08/1998, 17/09/2001, 22/07/2002, 29/09/2008, 07/05/2010, 08/08/2011, 24/08/2015, 28/02/2020, 04/04/2025, soit **9 fois en 36 ans** (207 séances au-dessus de 40 sur 9 275)
- Rendement du S&P 500 un an après le premier jour au-dessus de 40 : **+21 % en moyenne** (7 fois sur 9 positif, pire cas −15 % en 2001), contre **+12 %** en moyenne pour un jour quelconque ; à 3 ans : +44 % contre +41 % ; à 5 ans : +84 % contre +75 %
- Investisseur 1 : 100 $ investis le premier jour de bourse de chaque mois → **524 143 $** aujourd'hui (44 200 $ versés)
- Investisseur 2 : 100 $ mis de côté chaque mois (cash à 0 %), tout investi dès que le VIX clôture au-dessus de 40 → **359 433 $** (dont 1 800 $ encore en cash), soit **≈ 165 000 $ de moins**
- Variantes : garder seulement 10 %, 20 % ou 30 % en réserve pour les paniques donne 507 672 $, 491 201 $ et 474 730 $ : toujours moins que d'investir tout, tous les mois. Sans les dividendes (indice prix), l'écart reste du même ordre : 319 489 $ contre 245 169 $
- Limites : pas de frais ni d'impôts, en dollars. Le cash en attente ne rapporte rien dans le test principal ; rémunéré à 2 % ou 3 % par an, l'investisseur 2 finit à 380 196 $ ou 391 186 $ : l'écart se réduit (≈ 133 000 à 144 000 $) mais reste net. Pour rester exact avec un cash rémunéré, dire « plus de 130 000 dollars » dans le hook
