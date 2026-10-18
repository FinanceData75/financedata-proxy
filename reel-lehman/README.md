# Reel Lehman Brothers / Dick Fuld

- Voix : fichier ElevenLabs fourni (`audio/voix-off-brute.mp3`), normalisée à −16 LUFS (`audio/voix-off-lehman.wav`). Début 0–30,2 s : `audio/voix-debut.wav`.
- Style : `styles/financedata/STYLE.md`, version minimaliste (une idée par écran, coupes franches).
- Photos (Pinterest) : `assets/img/fuld-shame.jpg` (audition au Congrès, 2008), `fuld-audition.jpg`, `lehman-enseigne.jpg`.
- Rendu : `npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .` puis voix ajoutée avec ffmpeg → `renders/lehman-debut.mp4`.
