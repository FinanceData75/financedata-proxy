# Reel FinanceData – Le marché obligataire (HyperFrames)

Reel vertical 1080×1920, 53,6 s. DA FinanceData en version éditoriale minimaliste, inspirée du FT, de Bloomberg et de The Economist :
fond bleu #00194B avec halo, quadrillage fin estompé et vignette. Titres en Source Serif 4, données en Inter (chiffres tabulaires),
étiquettes en IBM Plex Mono. Cyan en accent, rouge vif (#ff2e24) réservé aux alertes. Sous-titres en Inter SemiBold blanc
sur fond gris translucide (3 mots max).

## Fichiers
- `index.html` : composition (7 scènes : taille des marchés, action/obligation, fiche, flux, risque, taux/prix, pourquoi)
- `assets/reel-data.js` : découpage des sous-titres par scène, recalé sur la voix
- `voix-off.txt` : texte exactement lu dans la prise montée
- `audio/voix-off-obligations.wav` : voix off montée (pauses ≤ 0,15 s, ratés coupés), sans autre traitement

## Rendu
```
node scripts/voiceover.mjs --audio audio/voix-off-obligations.wav
npx hyperframes@0.8.137 render -o renders/raw.mp4
ffmpeg -i renders/raw.mp4 -i audio/voix-off-obligations.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -af apad -t 53.6 renders/reel-obligations.mp4
```

## Sources et calculs
- Encours mondial fin 2024 : obligations 145 100 Md$, actions 126 700 Md$ (SIFMA, Capital Markets Fact Book 2025)
- Prix de revente : obligation à coupon 4 %, 10 ans restants, actualisée à 6 % → 40 × 7,360 + 1 000 / 1,06¹⁰ ≈ 853 € (−15 %)
- Risque/rendement et taux/prix : schémas illustratifs, sans données
