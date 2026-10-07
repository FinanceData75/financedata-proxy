# Reel FinanceData – Nasdaq record (HyperFrames)

Reel vertical 1080×1920, ~52 s. DA : papier blanc avec grain sur tout (titres et texte compris),
noir + bleu FinanceData #00194B (+ cyan en touche). Sous-titres 3 mots max, Helvetica (Nimbus Sans en
attendant les fichiers Helvetica Neue).

## Thème et safe zones
- `data-theme="navy"` sur `<html>` (dans `index.html`) : papier bleu FinanceData #00194B, texte clair, annotations rouges,
  mots-clés des sous-titres en bleu clair. `data-theme="paper"` : papier blanc d'origine.
- Tout le contenu reste dans la zone sûre Reels / TikTok : x 80–930 px, y 250–1500 px
  (250 px libres en haut, 420 px en bas pour légende et pseudo, 150 px à droite pour les boutons).

## Voix off déjà enregistrée
`node scripts/voiceover.mjs --audio prise.wav` : convertit en MP3 et aligne la prise sur `voix-off-elevenlabs-v3.txt`
(texte exactement lu) via l'API forced-alignment d'ElevenLabs.

## Fichiers
- `index.html` : composition (7 graphiques, données fact-checkées, sources sous chaque graphique)
- `assets/reel-data.js` : script découpé en sous-titres + timing (estimé, à recaler sur la voix off)
- `voix-off-elevenlabs-v3.txt` : texte de la voix off corrigé
- `assets/gsap.min.js` : GSAP en local (le CDN jsdelivr est bloqué dans l'environnement cloud)

## Rendu
```
npm i            # optionnel, rien n'est requis au runtime
npx hyperframes@0.8.137 check
npx hyperframes@0.8.137 render -o renders/reel.mp4
```

## Voix off (ElevenLabs)
Voix « Waul Storyteller », modèle `eleven_v3`, français, clé (`sk_…`) dans `ELEVENLABS_API_KEY`.
```
node scripts/voiceover.mjs          # VOICE_ID=... pour forcer l'ID de la voix
npx hyperframes@0.8.137 render -o renders/reel.mp4
```
Le script appelle `/v1/text-to-speech/{voice_id}/with-timestamps` avec `voix-off-elevenlabs-v3.txt`, écrit
`assets/voiceover.mp3`, `assets/voiceover-alignment.json` et `assets/vo-words.js` (timing mot par mot),
ajoute `<audio id="vo">` dans `index.html` et cale la durée de la composition sur la voix.
`reel-data.js` aligne alors chaque mot des sous-titres (3 mots max) sur la voix réelle ; les animations,
qui sont accrochées aux mots (`wordAt`) et aux scènes, suivent automatiquement.
`node scripts/voiceover.mjs --from-alignment` rejoue le recalage sans rappeler l'API.
