# Style : financedata

Mesuré le 18/10/2026 sur 5 reels du compte @financedatafr :
[FCF](https://www.instagram.com/reel/DTcbD6oDGr5/) · [Dette US / Trump](https://www.instagram.com/reel/DUDaUu8DLEE/) · [SanDisk](https://www.instagram.com/reel/DXn4ckbDCVo/) · [Théorie de Dow](https://www.instagram.com/reel/DdmGUbitiZe/) · [VIX](https://www.instagram.com/reel/DTHy74JDGgT/).
C'est la DA FinanceData telle qu'elle est publiée : ce fichier fait référence pour tous les nouveaux reels. Images clés dans `stills/`.

## Rythme
- coupe franche toutes les **3,3 s en moyenne** (FCF 3,5 s · Dette 3,4 · SanDisk 2,6 · Dow 3,8 ; 17 à 28 coupes par reel) ; pas de fondu
- le reel « liste » (VIX) coupe moins (7,9 s/plan) mais **chaque plan s'anime en continu** : un nouvel élément environ chaque seconde (texte, valeur, surlignage, ligne qui se trace)
- durée 62 à 111 s ; le hook dure 1,4 à 2,7 s avant la première coupe

## Fonds (grammaire des écrans)
1. **Blanc vignetté** : centre #EDEBEE, bords qui tombent en gris foncé (#5D5B5E) — vignette forte, jamais un blanc plat. Parfois avec quadrillage (Dow).
2. **Bleu marine vignetté** : centre #14196D–#17215E (bleu roi profond), bords #0A0E3B.
3. **Vidéo ou photo réelle plein écran** (≈40 % des écrans) : b-roll de stock (mains, billets, usines, téléphones, bureaux), photos de personnalités (Trump, Powell, Buffett, Lynch) ; en couleur naturelle, ou en **bichromie bleue** dans les épisodes du Guide (Dow).
4. **Lavis de couleur émotionnel** sur blanc : vert = bon, rouge = mauvais/danger, jaune = attention (VIX 30), plein écran, le temps d'une phrase.
5. **Noir dramatique** pour la peur ou la crise (VIX : moniteur cardiaque, chute rouge lumineuse).
6. **Écran partagé** blanc/bleu (bord déchiré ou diagonale) pour opposer deux notions.

## Texte à l'écran
- police grotesque **grasse et serrée** (type Helvetica Now / Inter Display Bold), interlettrage négatif
- titre court en **haut à gauche ou centré haut**, deux tailles : petite ligne d'amorce + gros mot-clé
- **signature : le mot-clé dans un encadré bleu marine, texte blanc** (« meilleur investisseur », « financière », « L'accumulation », « La participation ») ; l'encadré se dessine de gauche à droite pendant que le mot s'écrit
- couleurs de sens : **vert lumineux** (« Bon indicateur », « +231 % ») et **rouge** (« Mauvais indicateur », pics de crise), avec léger halo
- **chiffre géant noir** sur blanc qui arrive en glissement avec flou de mouvement (« 970 milliards de $ »)
- équations visuelles : « Bénéfice Net = Mauvais indicateur »
- titres de série : « le guide de la culture **financière** » (mot encadré) + « épisode N »

## Images
- arrivent **sur le mot qui les nomme** (Trump à « Trump », Powell à « la Fed »)
- photos en plein écran, léger push lent ; logos d'entreprise réels (Apple, Google, Nvidia, SanDisk, AMD, Broadcom) en blanc sur bleu avec le cours (« ▼ 186,50 USD »)
- captures et graphiques sources posés en carte (iPhone, cours SanDisk), éléments 3D ponctuels (calendrier « MARS 2020 », 777)

## Graphiques
- courbe fine bleue (#3B507F / bleu clair) sur blanc, ou blanche sur bleu marine
- titre « Cours de l'action X » / « Graphique historique du VIX » en petit en haut à gauche, axes discrets à droite
- **rectangle de sélection** sur une zone (accumulation, hausse), ligne de seuil horizontale (« 40 »), pic coloré en rouge
- pourcentage géant vert lumineux posé sur la courbe

## Sous-titres
- phrases entières sur 1 ou 2 lignes, blanc, ombre portée, au tiers inférieur (y ≈ 70 %), parfois fond gris translucide (SanDisk)
- **règle FinanceData actuelle maintenue** : Inter 600 blanc, fond gris translucide, 3 mots max (demande explicite)

## Son
- voix à **−17 LUFS** (−17,1 à −17,4 mesurés)
- 3 reels sur 5 **sans musique** (silence à −65 dB entre les phrases) ; 2 avec une nappe : SanDisk ~20 dB sous la voix, VIX ~10 dB sous la voix
- pauses conservées jusqu'à 0,4–0,5 s dans les reels sans musique (nos montages actuels coupent à 0,15 s)
- effets très discrets, pas d'impact appuyé visible au spectrogramme sur les coupes

## Hook et CTA
- hook : une image forte dès la 1re image (photo du personnage, titre-question encadré « Connaissez-vous la Théorie de Dow ? », graphique), première coupe avant 2,7 s
- CTA : maquette iPhone (newsletter ou profil Instagram) + bouton S'abonner → Abonné ; appel « Commentez « GO » / « Liste » »

## Ce qu'on garde des règles FinanceData récentes
- angles droits, rouge réservé à l'alerte, sous-titres 3 mots max fond gris, vidéo coupée sur la fin de la voix, pas de zoom caméra ni de tremblement

## Laissé de côté
- les clips générés par IA éventuels et la 3D « gadget » (777) : à remplacer par une vraie image ou un chiffre
- la musique systématique : seulement une nappe très basse quand le sujet est anxiogène (VIX)

## Règles apprises (retours)
- **jamais d'écran vide** : chaque écran montre un élément dès sa première image (démarrer l'animation ~0,2 s avant la coupe) ; vérification automatique sur le rendu (5 images/s, zone 250–1300 px : aucune image sans contenu)
- minimaliste : pas de surtitre quand l'image suffit ; chaque élément dans sa zone, aucun chevauchement
- photos basse définition : en carte pleine largeur sur fond bleu plutôt qu'en plein écran flou

## Comment l'appliquer dans HyperFrames
- `assets/reel-data.js` : une scène ≈ une phrase (3 à 4 s), coupe franche entre scènes
- `index.html` : classes de fond `bg-white` (vignette), `bg-navy` (vignette), `bg-photo`, `wash-green|red|yellow`, `bg-black` ; composant `kw` (mot encadré bleu qui se dessine), `big-number` (glissement + flou), `chart` (titre, seuil, rectangle de sélection, % vert lumineux)
- `window.__SFX` : 0 à 3 sons discrets par reel ; nappe optionnelle mixée à −10/−20 dB sous la voix
