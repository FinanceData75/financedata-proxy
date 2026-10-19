# Reel — Les 5 actions françaises les plus performantes en 2026

Style FinanceData (`styles/financedata/STYLE.md`), 17,6 s, 1080×1920.

- 0 → 4,3 s : vidéo tour Eiffel + titre encadré, voix off (Waul, ElevenLabs v3, prise 2, −16 LUFS)
- puis un écran par action, du N°5 au N°1 : Air Liquide +19 %, Eurofins Scientific +24 %, Euronext +33 %, TotalEnergies +45 %, STMicroelectronics +83 % (perf. depuis le 1er janvier, chiffres fournis)
- un seul effet sonore (impact discret sur le +83 %)

```bash
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i assets/voix-hook.wav -i ../.claude/skills/steal/assets/sfx/impact-boom.mp3 \
  -filter_complex "[2:a]volume=0.22,adelay=15100|15100[s];[1:a]apad[v];[v][s]amix=inputs=2:normalize=0:duration=first[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t 17.6 renders/top5-actions-fr-2026.mp4
```
