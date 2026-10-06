# Reel FinanceData – Nasdaq record (HyperFrames)

Reel vertical 1080×1920, ~52 s. DA : papier blanc avec grain sur tout (titres et texte compris),
noir + bleu FinanceData #00194B (+ cyan en touche). Sous-titres 3 mots max, Helvetica (Nimbus Sans en
attendant les fichiers Helvetica Neue).

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

## Étape suivante : voix off
ElevenLabs, voix « Waul Storyteller », modèle `eleven_v3`, français, clé dans `ELEVENLABS_API_KEY`.
Générer avec timestamps (`/v1/text-to-speech/{voice_id}/with-timestamps`), placer l'audio dans
`assets/voiceover.mp3`, ajouter un `<audio id="vo">` dans `index.html`, et remplacer le timing estimé
de `reel-data.js` par les timestamps réels (mot par mot) pour les sous-titres et les animations.
