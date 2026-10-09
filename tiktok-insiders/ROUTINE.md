# Carrousel TikTok quotidien : achats d'insiders US

Procédure suivie chaque jour ouvré à 16h50 (Paris) par la tâche planifiée Claude.
Le carrousel doit être prêt à valider à 17h.

## Prérequis (une seule fois)

- Réseau de l'environnement cloud : autoriser `www.sec.gov` et `upload.higgsfield.ai`.
- Compte TikTok connecté dans Higgsfield (`tiktok_connect`).
- 10 à 30 photos naturelles verticales dans `backgrounds/` (JPEG, idéalement 1080x1920 ou plus) :
  Wall Street, skyline, bureaux, nature… Sans photo, le rendu s'arrête.
- Ne jamais générer d'image IA (Higgsfield ou autre) ni utiliser de fond uni/dégradé :
  uniquement les photos de `backgrounds/`. Higgsfield sert seulement à l'upload et à TikTok.

## Étapes

1. `cd tiktok-insiders && npm ci`
2. `npm run fetch` → `out/<date>/buys.json` (déclarations Form 4 de la SEC : achats "P"
   des dirigeants et administrateurs, ≥ 100 000 $, hors fonds, déposés le dernier jour ouvré US).
   Le script doit passer par le proxy (`NODE_USE_ENV_PROXY=1`, déjà dans `npm run fetch`).
   - En cas d'erreur réseau ou SEC : s'arrêter et le signaler, ne pas deviner les chiffres.
   - Si `top` est vide (jour férié, rien de notable) : ne rien publier, prévenir l'utilisateur.
3. Écrire `out/<date>/slides.json` (format dans `render-carousel.mjs`) : chaque slide a un
   `type` (`cover`, `buy`, `cta`) et `lines`, **3 lignes maximum, courtes** (~35 caractères),
   car le rendu imite le texte natif TikTok (petit, centré). Le rendu refuse une slide trop longue.

   Rédiger comme un copywriter TikTok, en français, tutoiement, ton oral :
   - **Couverture** = l'accroche qui stoppe le scroll. Un chiffre choc + une tension/curiosité,
     pas de titre descriptif. Ex. « Hier, 4 patrons US ont sorti 38 M$ / de leur poche pour acheter /
     leurs propres actions 👀 », « Ce PDG vient de racheter / pour 32 M$ de sa propre boîte. /
     Pourquoi maintenant ? 👀 ».
   - **3 à 5 slides `buy`**, une par ligne de `top`, du plus gros au plus petit :
     ligne 1 = « #1 · Société ($TICKER) », puis 1 à 2 lignes punchy : qui (`rolesFr`, ex. « Le PDG »,
     « Un administrateur ») + montant en format FR (« 32 M$ », « 850 k$ ») + au plus UN détail fort
     (« D'un seul coup. », `clusterSize` > 1 : « 3 dirigeants achètent en même temps »,
     `positionIncreasePct` élevé : « Il gonfle sa position de 40 % »).
     Verbes concrets (« pose », « sort », « rachète », « met sur la table »), phrases courtes,
     pas de jargon. Créer une envie de swiper (le #1 n'est pas forcément le plus gros si l'histoire
     d'un autre est plus forte, mais garder la numérotation cohérente).
   - **CTA** : « Abonne-toi pour ne pas louper / les prochains » + une ligne d'amorce
     (ex. « Chaque jour, des patrons US achètent. »). Pas de mention de FinanceData.
   - Jamais de conseil (« achète », « fonce ») ni d'insinuation de délit d'initié : on rapporte
     des achats publics et légaux. N'utiliser que les chiffres de `buys.json`, ne rien inventer.
   - Fonds : les slides `buy` prennent uniquement des photos neutres (`backgrounds/`) ; les photos
     de personnalités (`backgrounds/personnalites/`) sont réservées à la couverture et au CTA.
4. `node render-carousel.mjs out/<date>/slides.json` → `slide-01.jpg`… (JPEG 1080x1920).
   Vérifier visuellement chaque slide (lecture de l'image) avant de continuer.
5. Upload Higgsfield : `media_upload` (files[] avec chaque JPEG), `curl -X PUT` de chaque
   fichier, puis `media_confirm` (type image). Récupérer les URL publiques.
6. `tiktok_accounts` → `connector_id` actif, puis `tiktok_prepare_publish` avec
   `mode: DIRECT_POST`, `media_type: PHOTO`, `photo_images` dans l'ordre, `photo_cover_index: 0`,
   `title` (accroche ≤ 150 caractères) et `description` :
   accroche + liste des tickers + « Source : déclarations SEC (Form 4). Pas un
   conseil en investissement. » + hashtags (#bourse #investir #insider #actions #wallstreet #finance).
7. Terminer la session en résumant : tickers retenus, montants, et rappeler que le
   formulaire TikTok attend la validation (musique, confidentialité, publier).
