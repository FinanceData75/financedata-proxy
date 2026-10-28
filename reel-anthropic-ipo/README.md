# Reel — L'introduction en Bourse d'Anthropic (26/10/2026)

49,6 s, 1080×1920, DA FinanceData (grille fixe : un titre + un visuel ; chiffres en Schibsted Grotesk).

- Voix : `audio/voix-off-brute.wav` (Nouvel_enregistrement_44) → meilleures prises, ratés coupés, pauses ≤ 0,15 s, −16 LUFS → `audio/voix-off-anthropic.wav` (`audio/coupes.json`)
- v3 (script AIDA, prise Nouvel_enregistrement_45) : pauses ≤ 0,18 s ; « C'est officiel » + photo Claude → valeur visée 2 000 Md$ (Nasdaq) → « Vaut-elle ce prix ? 3 choses » (vidéo Wall Street) → 1. ce qu'elle vend (4,6 → > 45 Md$, ×14) → 2. ce qu'elle gagne (vidéo serveurs : rentable sur l'activité / −80 Md$ sur le papier) → 3. le prix (2 000 vs 965 Md$) → > 40× → « Exceptionnelle ≠ bon placement » → profil Instagram
- v2 : hook photo Claude sur téléphone + compteur ; 2 lignes de texte max par écran ; vidéos Pinterest (Wall Street, serveurs, Starship) téléchargées en HLS via curl (`assets/video/`) ; pause après « estimés ? » ramenée à 0,15 s
- Écrans (v1) : compteur 0 → 2 000 Md$ · Dario Amodei · Nasdaq Times Square · « Vaut-elle 2 000 Md$ ? » · revenus 4,6 / 16,3 / > 45 Md$ · −80 Md$ (comptable) · prix 965 → 2 000 Md$ · levée ≈ 100 Md$ vs SpaceX 75 Md$ · > 40× les revenus · « Exceptionnelle ≠ bon investissement » · profil Instagram
- Sources et réserves : voir `script.md` (chiffres de presse à recouper avec le S-1 sur SEC EDGAR)

```
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i audio/voix-off-anthropic.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 49.62 renders/anthropic-ipo.mp4
```
