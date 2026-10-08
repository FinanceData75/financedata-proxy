# Reel FinanceData – LVMH (HyperFrames)

Reel vertical 1080×1920, ~41,5 s. DA FinanceData : fond bleu uni #00194B (sans texture), texte clair,
bleu clair en accent, annotations en rouge. Bloc centré dans la safe zone Reels / TikTok
(contenu dans x 160–920, y 470–1460). Sous-titres en Inter SemiBold, 3 mots max, apparition mot par mot.

## Fichiers
- `index.html` : composition (9 scènes, chiffres sourcés sous chaque visuel)
- `assets/reel-data.js` : découpage des sous-titres par scène, recalé sur la voix
- `voix-off.txt` : texte exactement lu dans la prise montée
- `audio/voix-off-lvmh.wav` : voix off montée (meilleures prises, pauses ≤ 0,15 s), sans autre traitement
- `audio/coupes.json` : segments conservés de la prise brute

## Rendu
```
node scripts/voiceover.mjs --audio audio/voix-off-lvmh.wav   # alignement forcé + recalage
npx hyperframes@0.8.137 render -o renders/reel-lvmh.mp4
# puis remettre la voix d'origine telle quelle dans le MP4 :
ffmpeg -i renders/reel-lvmh.mp4 -i audio/voix-off-lvmh.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -af apad -t 41.5 out.mp4
```

## Sources des chiffres
- Record 904,60 € (24/04/2023, séance) : Reuters ; 385,60 € (clôture 06/10/2026) : Boursorama ; plus bas depuis 2020 : Zonebourse, Idéal Investisseur
- N°1 en Europe, > 500 Md$ (avril 2023) : Reuters, Bloomberg
- Part des Chinois dans le luxe mondial 33 % (2019) → 21 % (2024) : Berenberg
- Hausses de prix 2020–2023 (Dior +66 %, Chanel +59 %, Louis Vuitton +31 %) : Bernstein
- Moyen-Orient ≈ 6 % des ventes, fréquentation ≈ −50 % : LVMH, T1 2026
- Marge opérationnelle 22,5 %, résultat net 5,7 Md€ (S1 2026) : LVMH
- Croissance organique +13 % (2023), +1 % (2024), −1 % (2025), +2 % (S1 2026) : LVMH
