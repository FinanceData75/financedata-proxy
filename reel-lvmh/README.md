# Reel FinanceData – LVMH (HyperFrames)

Reel vertical 1080×1920, ~41,5 s. DA FinanceData version « terminal de données » : fond bleu #00194B,
halo central, quadrillage fin estompé, repères d'angle ; typo Inter (chiffres tabulaires), surtitres en capitales espacées,
panneaux translucides à filets fins, pictos au trait, annotations rouges sobres (puces, anneaux, flèches droites). Bloc centré dans la safe zone Reels / TikTok
(contenu dans x 160–920, y 470–1460). Sous-titres en Inter SemiBold, 3 mots max, sur un fond gris translucide, lettres resserrées.

v5 : hook visuel avec la photo de Bernard Arnault en plein cadre et la capture du cours sur 5 ans au centre
(badge « −57 % », anneau sur le dernier point, « PLUS BAS DEPUIS 2020 »). Les fonds alternent entre le bleu quadrillé
et un blanc cassé quadrillé (Diagnostic, Luxe aspirationnel, Rentabilité, La baisse continue). Effets sonores
(assets/sfx, générés avec ElevenLabs) mixés sous la voix d'origine, qui n'est pas retouchée.

## Fichiers
- `index.html` : composition (9 scènes : graphiques sourcés + carte KPI, pictos au trait, panneau de fréquentation, jauge de rentabilité)
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
# v5 : voix d'origine + effets sonores calés sur la composition
PUPPETEER_CORE=/chemin/puppeteer-core node scripts/sfx.mjs renders/raw.mp4 audio/voix-off-lvmh.wav renders/reel-lvmh-v5.mp4
```

## Sources des chiffres
- Aire du cours : clôtures de fin d'année 679,90 € (2022), 733,60 € (2023), 635,50 € (2024) (lettres aux actionnaires et rapports annuels LVMH), ≈ 645 € (2025, déduit des variations publiées), record 904,60 € (24/04/2023, séance, Reuters), 380,90 € (clôture 08/10/2026, capture Google Finance fournie). Points reliés en ligne droite, sans données intermédiaires.
- Plus bas depuis 2020 : Zonebourse, Idéal Investisseur
- N°1 en Europe, > 500 Md$ (avril 2023) : Reuters, Bloomberg
- Part des Chinois dans le luxe mondial 33 % (2019) → 21 % (2024) : Berenberg
- Hausses de prix 2020–2023 (Dior +66 %, Louis Vuitton +31 %) : Bernstein
- Moyen-Orient ≈ 6 % des ventes, fréquentation ≈ −50 % : LVMH, T1 2026
- Croissance organique +13 % (2023), +1 % (2024), −1 % (2025), +2 % (S1 2026) : LVMH
