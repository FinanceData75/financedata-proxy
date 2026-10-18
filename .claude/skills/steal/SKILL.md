---
name: steal
description: Mesure le montage d'un reel d'un autre créateur (rythme des coupes, mises en page, sous-titres, images, son, zooms) et l'écrit comme un style FinanceData réutilisable, en gardant la DA FinanceData (bleu #00194B, fond blanc quadrillé / bleu quadrillé, Inter, rouge pour l'alerte, angles droits). À utiliser quand l'utilisateur dit « steal », « vole le style de », « monte comme @x », « fais un style à partir de ce reel », ou donne un reel comme modèle. Adapté de Melvynx/video-agent-skills (MIT) pour la chaîne HyperFrames de ce dépôt.
argument-hint: "<lien du reel ou fichier vidéo> [nom du style]"
---

# Steal (version FinanceData)

Le montage de quelqu'un marche et on veut son efficacité sur nos vidéos, **sans perdre la DA FinanceData**. On mesure son montage, on l'écrit comme un style, on le prouve sur une de nos vidéos, puis on l'utilise.

Ce qu'on copie : le **rythme** (durée des plans, coupes), la **grammaire des écrans** (quels types d'écrans, dans quel ordre, quand une image arrive), la **façon d'introduire les éléments** (sur le mot qui les nomme), le **son** (où tombent les impacts, niveau de la musique), le **hook** et le **CTA**.
Ce qu'on garde de FinanceData : couleurs, polices, fonds, angles droits, sous-titres (Inter 600 blanc, fond gris translucide, 3 mots max), voix non traitée, vidéo coupée sur la fin de la voix.

Sorties :
- `styles/<nom>/STYLE.md` : ce qui a été mesuré et les règles qui en découlent, traduites dans la DA FinanceData.
- `styles/<nom>/style.json` : les valeurs chiffrées (rythme, tailles, timings, sons) pour les compositions HyperFrames.
- `styles/<nom>/stills/` : 6 à 10 images clés de l'original. `styles/<nom>/assets/sfx/` : les sons retenus.
- Une vidéo test dans le reel concerné (`reel-<sujet>/renders/…-<nom>.mp4`) et la planche de comparaison.

Lire [references/learnings.md](references/learnings.md) avant de commencer : chaque règle vient d'une copie refusée.

## Préparation
- `ffmpeg -version && yt-dlp --version` (yt-dlp s'installe avec `pip install yt-dlp`).
- Parler français, dire en une ligne ce qu'on fait avant chaque étape longue.
- `<nom>` : le pseudo du créateur en minuscules avec tirets, sauf si l'utilisateur nomme le style.
- Fichiers temporaires dans le scratchpad : `W = <scratchpad>/steal-<nom>`.

## 1. Récupérer le reel
- Fichier local : l'utiliser.
- Lien YouTube, Instagram ou TikTok : `yt-dlp -o "W/reel.%(ext)s" "<url>"`. Si c'est bloqué (connexion requise, réseau), demander à l'utilisateur d'enregistrer la vidéo et de l'envoyer en pièce jointe.
- Idéalement 2 ou 3 reels du même format : un seul peut être l'exception.

## 2. Mesurer (trois passes, toutes obligatoires)

Un style copié depuis les images seules rate la moitié : le son et le rythme. Avec des sous-agents, faire soi-même les planches et `cuts.txt`, puis confier Images, Son et Zooms à trois sous-agents en parallèle (chemins absolus, une section chacun, un fichier de notes chacun : chiffres et timecodes uniquement).

### Images et coupes
```bash
ffmpeg -v error -y -i W/reel.mp4 -vf "fps=2,scale=270:480,tile=8x3:padding=4:color=black" W/sheet-%02d.jpg
ffmpeg -hide_banner -i W/reel.mp4 -vf "scdet=threshold=12" -an -f null - 2>&1 | grep -o "scd.time: [0-9.]*" | cut -d' ' -f2 > W/cuts.txt
ffprobe -v error -show_entries format=duration -of csv=p=0 W/reel.mp4
```
- Planche N, vignette i (depuis 0) = seconde 12(N-1) + i/2. Secondes par plan = durée / (lignes de `cuts.txt` + 1).
- Lire TOUTES les planches et noter :
  - **Types d'écrans** : photo plein écran, graphique, chiffre, capture, liste, split, texte sur aplat… et leur ordre.
  - **Texte à l'écran** : quantité, taille, position, apparition (mot par mot, bloc), mot mis en valeur et comment.
  - **Images** : type, cadre, taille, moment d'arrivée (sur le mot qui les nomme ?), empilement.
  - **Listes** (« 3 raisons… ») : comment le numéro apparaît, s'il y a un repère de progression.
  - **Hook** (2 premières secondes), **CTA** (3 dernières), **étalonnage**.
- Garder 6 à 10 images clés : `ffmpeg -v error -y -ss <s> -i W/reel.mp4 -frames:v 1 styles/<nom>/stills/t<s>.jpg`.

### Son
```bash
ffmpeg -v error -y -i W/reel.mp4 -lavfi "showspectrumpic=s=3000x500:legend=0:scale=log:stop=11000" W/spectrum.png
```
- Une coupe à t secondes est à x = 3000 × t / durée. Trait vertical fin et haut = clic ; large et bas = boom ; traînée montante = whoosh ; trou dans la bande de musique = la musique coupe.
- Zoom sur une coupe : `ffmpeg -v error -y -ss <t-1> -t 2 -i W/reel.mp4 -lavfi "showspectrumpic=s=1000x500:legend=0:scale=log:stop=11000" W/cut-<n>.png`.
- Tempo : traits graves réguliers sur 10 s × 6 = BPM.
- Niveau de la musique sous la voix (optionnel, utilise quelques crédits ElevenLabs, le dire avant) : isoler la voix avec `/v1/audio-isolation`, mesurer le RMS toutes les 20 ms du mix et de la voix seule, la musique = le mix quand la voix isolée se tait. Ne jamais soustraire la voix isolée du mix.

### Zooms
Mesurer sur ~10 vignettes la taille du sujet (visage ou image principale) en part de la hauteur, et lister les sauts : saut à une coupe = changement de cadre ; saut dans un plan = punch-in ; croissance lente = push. Ces chiffres sont un plafond. Rappel FinanceData : pas de zoom caméra ni de tremblement ; un léger push sur une photo est le maximum.

## 3. Écrire le style
`styles/<nom>/STYLE.md`, en français, chaque ligne = une valeur + la mesure derrière :

```markdown
# Style : <nom>
Copié de <lien>, mesuré le <date>. Appliqué sur la DA FinanceData : ce qui n'est pas ici reste comme dans nos reels.

## Rythme
- un écran toutes les 2,1 s en moyenne (24 coupes en 52 s) ; coupe franche, pas de fondu
## Types d'écrans
- ordre type : photo (hook) → chiffre → graphique → capture → liste…
## Texte à l'écran
- …
## Images
- …
## Listes
- …
## Son
- …
## Ce qu'on garde de FinanceData
- couleurs, polices, fonds alternés, sous-titres, angles droits
## Laissé de côté
- … (et pourquoi)
## Comment l'appliquer dans HyperFrames
- quoi mettre dans assets/reel-data.js (découpage des scènes), dans index.html (types d'écrans, timings), dans window.__SFX
```

Puis `styles/<nom>/style.json` : `{ "rythme": {"secondesParEcran":…, "coupe":"franche"}, "ecrans": [...], "texte": {...}, "images": {...}, "listes": {...}, "sfx": [{"evenement":"…","fichier":"…","gainDb":…}], "musique": {...}, "hook": {...}, "cta": {...}, "notes": [...] }`.

**Sons** (`styles/<nom>/assets/sfx/`) : d'abord la bibliothèque du skill (`.claude/skills/steal/assets/sfx/` : `zhhh`, `impact-boom`, `riser`, `glass-shatter`, `pop-back`) et celle des reels (`reel-*/assets/sfx/` : `whoosh`, `pop`, `click`, `swipe`). Générer avec ElevenLabs seulement si rien n'approche et après accord (crédits).

**Images** : uniquement de vraies photos, captures et logos réels (jamais d'image ni de visage générés). Photos passées en bichromie si la DA du reel le demande (`financedata-univers/scripts/bichromie.py`).

## 4. Tester
1. Prendre une voix off FinanceData existante (ou un extrait de 15 à 20 s).
2. Monter la composition HyperFrames avec le style (`npx -y hyperframes@0.8.137 check|render`), mixer les sons avec `scripts/sfx.mjs`.

## 5. Comparer avant de montrer
```bash
ffmpeg -v error -y -i W/reel.mp4 -i <test>.mp4 -filter_complex "[0:v]fps=1,scale=216:384,trim=end_frame=15,tile=15x1[a];[1:v]fps=1,scale=216:384,trim=end_frame=15,tile=15x1[b];[a][b]vstack" -frames:v 1 W/compare.jpg
```
Vignette par vignette : rythme des écrans, taille du texte et des images (elles remplissent l'espace comme dans l'original), pas de fondu là où l'original coupe, sous-titres lisibles et hors zones Instagram. Spectrogramme de la copie : les impacts tombent sur les coupes, pas plus de sons que l'original. Corriger chaque écart avant de montrer : l'utilisateur ne doit jamais être celui qui le repère.

## 6. Livrer
Envoyer la vidéo test et la planche de comparaison (SendUserFile), puis dire en quelques lignes : ce qui a été mesuré (secondes par écran, sons, musique, zooms), ce qui a été copié, ce qui a été laissé de côté et pourquoi, où vit le style. Chaque refus de l'utilisateur va dans STYLE.md ; si la leçon est générale, dans [references/learnings.md](references/learnings.md). Commit + push sur la branche de travail.
