# Reel — Le marché obligataire (version animée, DA FinanceData)

50,9 s, 1080×1920. Voix d'origine (mémo iPhone xHE-AAC, décodé avec un FFmpeg récent), pauses ramenées à 0,15 s, −16 LUFS, sans autre traitement.
Écrans : balance obligations/actions, action vs obligation, « c'est vous la banque », exemple 1 000 € / coupon 5 % / +500 €,
risque Allemagne vs entreprise fragile, risque → rendement, revente, taux ↑ prix ↓, 4 % vs 6 %, prix qui tombe à 853 €.

## Fichiers
- `index.html` : composition (sous-titres 3 mots max générés depuis `assets/vo-words.js`)
- `audio/voix-off-obligataire.wav` : voix montée ; `audio/voix-off-brute.wav` : prise d'origine
- `audio/stt-montee.json` : transcription ElevenLabs Scribe (mot par mot) de la voix montée

## Rendu
```
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i audio/voix-off-obligataire.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 50.9 renders/marche-obligataire.mp4
```

## Sources et calculs
- Encours mondial fin 2024 : obligations 145 100 Md$, actions 126 700 Md$ (SIFMA, Capital Markets Fact Book 2025)
- Revente : obligation 1 000 € à coupon 4 %, 10 ans restants, actualisée à 6 % → 40 × 7,360 + 1 000 / 1,06¹⁰ ≈ 853 € (−15 %)
- Barres de risque et courbe risque/rendement : illustratives
