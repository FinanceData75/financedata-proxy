# Direction artistique FinanceData

**Photos en bichromie bleu FinanceData, données minimales, une idée par écran.**
Catalogue des écrans : `planches/types-apercu.jpg` (sources : `types.html`), photo de référence : `planches/direction-a1.png`.

## Les fondamentaux
- **Photos** : toujours réelles, toujours passées en bichromie `#00194B → #EEF3FC` avec `python3 scripts/bichromie.py entree.jpg sortie.jpg`. Plein écran, sans texte ajouté. Seule exception : les captures (preuves), gardées en couleurs réelles.
- **Données** : fond blanc ou bleu quadrillé, une courbe bleu nuit, une ligne de repère pointillée grise, un seul point rouge avec sa valeur, un libellé gris centré au-dessus.
- **Une idée par écran**, Inter uniquement, rouge réservé au point clé, sous-titres blancs sur fond gris translucide, alternance blanc / bleu à chaque scène (début en blanc).

## Les 11 types d'écran
| Type | Quand l'utiliser |
|---|---|
| Photo | On cite une personne, une entreprise, un lieu |
| Graphique | Une évolution réelle (cours, indicateur) |
| Chiffre | Le résultat à retenir |
| Comparaison | Deux cas qui s'opposent |
| Barres | Un historique, une fréquence (« 15 fois sur 17 ») |
| Échelle | Situer une valeur sur un intervalle (RSI, VIX…) |
| Citation | Photo en haut, phrase en dessous |
| Photo + chiffre | Une personne ou une entreprise associée à un chiffre choc |
| Date | Ouvrir un exemple historique |
| Frise | Plusieurs événements dans le temps |
| Règle | La leçon finale, 2 lignes maximum |
| Capture | Preuve (article, appli, graphique source), petite, angles droits |

Données des exemples : Yahoo Finance, RSI 14 jours (Wilder). Barres : S&P 500, 6 mois après chaque premier passage du RSI sous 30 depuis 2010 (17 cas, 15 positifs).
