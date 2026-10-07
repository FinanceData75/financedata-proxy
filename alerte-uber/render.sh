#!/usr/bin/env bash
# Vidéo 5 s 1080x1920 : fond (photo ou vidéo d'un véhicule Uber) + habillage alerte.
# Usage : ./render.sh <fond.jpg|png|mp4|mov> [sortie.mp4]
set -euo pipefail
cd "$(dirname "$0")"
BG="${1:?fond requis}"; OUT="${2:-alerte-uber.mp4}"
node -e '
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto("file://" + process.cwd() + "/overlay.html"); await p.waitForTimeout(300);
  await p.screenshot({ path: "overlay.png", omitBackground: true }); await b.close();
})();'
case "${BG,,}" in
  *.mp4|*.mov|*.webm|*.m4v)
    IN=(-stream_loop -1 -i "$BG")
    BGF="[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,trim=0:5,setpts=PTS-STARTPTS[bg]";;
  *)
    IN=(-loop 1 -framerate 30 -i "$BG")
    # zoom lent (Ken Burns) pour donner du mouvement à une photo
    BGF="[0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='1+0.0008*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30,setsar=1[bg]";;
esac
ffmpeg -y -loglevel error "${IN[@]}" -loop 1 -framerate 30 -i overlay.png -f lavfi -t 5 -i anullsrc=r=44100:cl=stereo \
  -filter_complex "$BGF;[bg]eq=brightness=-0.06:saturation=0.95[d];[1:v]format=rgba,fade=t=in:st=0.15:d=0.25:alpha=1[ov];[d][ov]overlay=0:0:shortest=1,format=yuv420p[v]" \
  -map "[v]" -map 2:a -t 5 -r 30 -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 128k -movflags +faststart "$OUT"
echo "OK → $OUT"
