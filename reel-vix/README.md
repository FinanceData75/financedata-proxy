# Reel VIX : l'indicateur de la peur

- Voix : Waul Storyteller (fichier ElevenLabs fourni), intro « Bienvenue dans le guide… » retirée, pauses ≤ 0,15 s, −16 LUFS → `audio/voix-off-vix.wav` (brut : `audio/voix-off-brute.mp3`).
- Données réelles Yahoo Finance (^VIX plus haut / clôture, ^GSPC clôture, 1990 → 14/10/2026) : `assets/vix.js`, brut dans `data/`.
- Photo : Warren Buffett, Mark Hirschey, Wikimedia Commons (CC BY-SA).
- Rendu : `npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .` puis `node scripts/sfx.mjs renders/raw.mp4 audio/voix-off-vix.wav renders/reel-vix.mp4`.
