# Carrousel TikTok quotidien : achats d'insiders US

Procédure suivie chaque jour ouvré à 16h50 (Paris) par la tâche planifiée Claude.
Le carrousel doit être prêt à valider à 17h.

## Prérequis (une seule fois)

- Réseau de l'environnement cloud : autoriser `www.sec.gov` et `upload.higgsfield.ai`.
- Compte TikTok connecté dans Higgsfield (`tiktok_connect`).
- 10 à 30 photos naturelles verticales dans `backgrounds/` (JPEG, idéalement 1080x1920 ou plus) :
  Wall Street, skyline, bureaux, nature… Sans photo, un dégradé sombre est utilisé.

## Étapes

1. `cd tiktok-insiders && npm ci`
2. `node fetch-insider-buys.mjs` → `out/<date>/buys.json` (achats "P" des dirigeants et
   administrateurs, ≥ 100 000 $, déposés le dernier jour ouvré US).
   - Si `top` est vide (jour férié, rien de notable) : ne rien publier, prévenir l'utilisateur.
3. Écrire `out/<date>/slides.json` (voir le format dans `render-carousel.mjs`) :
   - **Couverture** : accroche courte et forte, en français, tutoiement. Ex. « Le PDG de X vient
     de mettre 12 M$ dans sa propre boîte 👀 ». Sous-titre : « Les N plus gros achats d'initiés d'hier ».
   - **3 à 5 slides achat**, une par ligne de `top`, dans l'ordre : `kicker` "#1"…,
     `title` "Société ($TICKER)", `big` = montant (format FR : « 12,4 M$ », « 850 k$ »),
     `lines` = qui (fonction traduite : CEO → PDG, CFO → directeur financier, Director →
     administrateur), nombre d'actions, prix moyen, et un fait marquant s'il existe
     (`clusterSize` > 1 : « 3 dirigeants achètent en même temps » ; `positionIncreasePct`
     élevé : « +40 % sur sa position »).
   - **CTA** : `title` « Abonne-toi pour ne pas louper les prochains », `subtitle`
     « Un nouveau carrousel chaque jour de la semaine ». Pas de mention de FinanceData.
   - N'utiliser que les chiffres de `buys.json`, ne rien inventer.
4. `node render-carousel.mjs out/<date>/slides.json` → `slide-01.jpg`… (JPEG 1080x1920).
   Vérifier visuellement chaque slide (lecture de l'image) avant de continuer.
5. Upload Higgsfield : `media_upload` (files[] avec chaque JPEG), `curl -X PUT` de chaque
   fichier, puis `media_confirm` (type image). Récupérer les URL publiques.
6. `tiktok_accounts` → `connector_id` actif, puis `tiktok_prepare_publish` avec
   `mode: DIRECT_POST`, `media_type: PHOTO`, `photo_images` dans l'ordre, `photo_cover_index: 0`,
   `title` (accroche ≤ 150 caractères) et `description` :
   accroche + liste des tickers + « Données publiques SEC (Form 4). Pas un conseil en
   investissement. » + hashtags (#bourse #investir #insider #actions #wallstreet #finance).
7. Terminer la session en résumant : tickers retenus, montants, et rappeler que le
   formulaire TikTok attend la validation (musique, confidentialité, publier).
