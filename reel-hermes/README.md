# Reel — Hermès : −57 % depuis le record (22/10/2026)

48,5 s, 1080×1920, DA FinanceData (titres Inter 800 + filet, chiffres et graphiques en Schibsted Grotesk, fonds blanc / bleu, vraies photos).

- Voix : `audio/voix-off-brute.wav` (Nouvel_enregistrement_43), meilleures prises gardées, ratés coupés, pauses ≤ 0,15 s, −16 LUFS → `audio/voix-off-hermes.wav` (`audio/coupes.json`)
- Cours : `assets/rms.js` (Yahoo Finance RMS.PA, clôtures hebdo) — record 2 957 € en séance le 14/02/2025 (clôture 2 839 €), 1 264 € le 22/10/2026 : −57 % depuis le plus haut en séance, plus bas depuis octobre 2022
- Photos (Pinterest, réelles) : boutique « Sellier » du Faubourg, Birkin, Shanghai (Nanjing Road), Dubai Mall, boutique Hermès avenue George-V
- Chiffres donnés par FinanceData : valorisation ≈ 30× les bénéfices contre 65× au plus haut, plus bas depuis 7 ans ; croissance organique 6,7 % (T2) → 4,3 % (T3) ; ventes T3 sous le consensus

```
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i audio/voix-off-hermes.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 48.45 renders/hermes.mp4
```
