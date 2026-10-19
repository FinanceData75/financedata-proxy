# Reel — Le marché obligataire (animations de la v1 de reel-obligations, nouvelle voix)

50,9 s, 1080×1920. Reprend la composition de `reel-obligations` v1 (commit 8fadb49 : DA éditoriale bleu #00194B,
titres Source Serif, graphiques animés) recalée mot à mot sur la nouvelle voix off.
Changements : fin calée sur la voix (pas de générique), écran « revente » rempli avant les courbes, compteur 1 000 € → 853 € terminé avant la fin de la voix.

## Fichiers
- `index.html` + `assets/reel-data.js` : composition (scènes et sous-titres 3 mots max)
- `audio/voix-off-obligataire.wav` : voix montée (mémo iPhone xHE-AAC décodé avec un FFmpeg récent, pauses ≤ 0,15 s, −16 LUFS, sans autre traitement)
- `audio/voix-off-brute.wav` : prise d'origine ; `voix-off.txt` : texte pour l'alignement forcé

## Rendu
```
node scripts/voiceover.mjs --audio audio/voix-off-obligataire.wav
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i audio/voix-off-obligataire.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 50.9 renders/marche-obligataire.mp4
```

## Sources et calculs
- Encours mondial fin 2024 : obligations 145 100 Md$, actions 126 700 Md$ (SIFMA, Capital Markets Fact Book 2025)
- Revente : coupon 4 %, 10 ans restants, actualisée à 6 % → 40 × 7,360 + 1 000 / 1,06¹⁰ ≈ 853 € (−15 %)
