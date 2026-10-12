# Reel FinanceData – Le CDS de la France (HyperFrames)

Reel vertical 1080×1920, 61,6 s. Début sur fond blanc avec la capture du CDS France 5 ans, puis alternance blanc / bleu #00194B
quadrillé à chaque scène (11 scènes, sans coupe au milieu d'une phrase), angles droits, rouge pour les alertes,
sous-titres blancs sur fond gris translucide. Analogie ami / assureur, puis investisseurs / France / CDS.
Fin : profil Instagram FinanceData + bouton « S'abonner » → « Abonné » calé sur « abonnez-vous » ; la vidéo s'arrête avec la voix.

## Fichiers
- `voix-off.txt` : texte du script
- `audio/tts-brut.mp3` : génération ElevenLabs eleven_v4 (voix Waul Story Telling)
- `audio/voix-off-cds.wav` : pauses > 0,15 s ramenées à 0,15 s
- `audio/voix-off-cds-finale.wav` : version fournie par l'utilisateur (niveau −16,7 LUFS), utilisée dans la vidéo

## Rendu
```
node scripts/voiceover.mjs --audio audio/voix-off-cds-finale.wav
npx hyperframes@0.8.137 render -o renders/raw.mp4
PUPPETEER_CORE=/chemin/puppeteer-core node scripts/sfx.mjs renders/raw.mp4 audio/voix-off-cds-finale.wav renders/reel-cds.mp4
```

## Chiffres (voir le fact-check)
- CDS France 5 ans ≈ 80 pb début octobre 2026, plus haut depuis juillet 2013 (epargnebourse.fr, S&P Global via Journal du Coin, roic.ai)
- 34,5 pb le 8 septembre (epargnebourse.fr uniquement) → « plus que doublé » et « 3 500 € » reposent sur cette seule source
