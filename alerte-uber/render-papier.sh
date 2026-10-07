#!/usr/bin/env bash
# Version « papier bleu » FinanceData, 5 s 1080x1920, texte dans la safe zone Reels/TikTok/Shorts.
# Usage : ./render-papier.sh [sortie.mp4] [--guide]   (--guide = PNG avec la safe zone en pointillés)
set -euo pipefail
cd "$(dirname "$0")"
OUT="${1:-alerte-uber-papier-bleu.mp4}"; TMP=$(mktemp -d)
node - "$TMP" "${2:-}" <<'JS'
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const [dir, guide] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto("file://" + process.cwd() + "/papier-bleu.html"); await p.evaluate(() => document.fonts.ready);
  if (guide) { await p.evaluate(() => document.body.classList.add("guide")); await p.screenshot({ path: "safe-zone.png" }); await p.evaluate(() => document.body.classList.remove("guide")); }
  for (let i = 0; i < 150; i++) {
    await p.evaluate(t => window.seek(t), i / 30);
    await p.screenshot({ path: `${dir}/f${String(i).padStart(3, "0")}.png` });
  }
  await b.close();
})();
JS
# grain animé sur toute l'image (fond + texte), comme la DA du Reel Nasdaq
ffmpeg -y -loglevel error -framerate 30 -i "$TMP/f%03d.png" -f lavfi -t 5 -i anullsrc=r=44100:cl=stereo \
  -filter_complex "[0:v]noise=alls=9:allf=t,format=yuv420p[v]" -map "[v]" -map 1:a -t 5 \
  -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 128k -movflags +faststart "$OUT"
rm -rf "$TMP"; echo "OK → $OUT"
