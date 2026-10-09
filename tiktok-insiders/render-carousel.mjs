// Rend un carrousel TikTok (JPEG 1080x1920) à partir d'un fichier slides.json.
//
// Usage : node render-carousel.mjs out/<date>/slides.json
//
// Format de slides.json :
// {
//   "background": "chemin/vers/photo.jpg",        // fond par défaut (optionnel)
//   "slides": [
//     { "type": "cover", "title": "...", "subtitle": "..." },
//     { "type": "buy", "kicker": "#1", "title": "Nvidia ($NVDA)", "big": "12,4 M$",
//       "lines": ["Le PDG Jensen Huang", "a acheté 80 000 actions", "à 155 $ l'unité"] },
//     { "type": "cta", "title": "...", "subtitle": "..." }
//   ]
// }
// Chaque slide peut surcharger "background". Sans fond indiqué, une photo du
// dossier backgrounds/ est choisie (rotation quotidienne, une par slide). Les images sont écrites à côté de
// slides.json sous slide-01.jpg, slide-02.jpg, ...
import { chromium } from "playwright-core";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1920;

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: node render-carousel.mjs out/<date>/slides.json");
  process.exit(1);
}
const spec = JSON.parse(await readFile(specPath, "utf8"));
const outDir = dirname(resolve(specPath));

// Contour noir arrondi (comme le style "outline" de TikTok) : un anneau
// d'ombres portées, plus net que -webkit-text-stroke qui fait des pointes.
const outline = (r, steps = 32) => Array.from({ length: steps }, (_, i) => {
  const a = (2 * Math.PI * i) / steps;
  return `${(r * Math.cos(a)).toFixed(1)}px ${(r * Math.sin(a)).toFixed(1)}px 0 #000`;
}).join(",");

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function dataUri(path, mime) {
  const buf = await readFile(resolve(dirname(resolve(specPath)), path));
  return `data:${mime};base64,${buf.toString("base64")}`;
}
const imageMime = p => ({ ".png": "image/png", ".webp": "image/webp" })[extname(p).toLowerCase()] || "image/jpeg";

// Photos de fond disponibles (chemins absolus), triées pour une rotation stable
const library = (await readdir(join(HERE, "backgrounds")).catch(() => []))
  .filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort().map(f => join(HERE, "backgrounds", f));
const dayIndex = Math.floor(Date.now() / 86_400_000);
const pickBackground = i => library.length ? library[(dayIndex * 7 + i) % library.length] : null;

const font700 = await dataUri(join(HERE, "fonts/TikTokSans-700.ttf"), "font/ttf");
const font900 = await dataUri(join(HERE, "fonts/TikTokSans-900.ttf"), "font/ttf");

function slideBody(s) {
  const kicker = s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : "";
  const title = s.title ? `<div class="title">${esc(s.title)}</div>` : "";
  const big = s.big ? `<div class="big">${esc(s.big)}</div>` : "";
  const subtitle = s.subtitle ? `<div class="subtitle">${esc(s.subtitle)}</div>` : "";
  const lines = (s.lines || []).map(l => `<div class="line">${esc(l)}</div>`).join("");
  return `${kicker}${title}${big}${lines}${subtitle}`;
}

function html(s, bg) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "TikTok Sans"; font-weight: 700; src: url(${font700}); }
@font-face { font-family: "TikTok Sans"; font-weight: 900; src: url(${font900}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #1d2a24; }
.bg { position: absolute; inset: 0; background: ${bg ? `url(${bg}) center / cover no-repeat` : "linear-gradient(160deg,#3b5a4a,#14201a)"}; }
.shade { position: absolute; inset: 0; background: rgba(0,0,0,.18); }
/* Zone utile : TikTok masque le bas (~420px) et la colonne droite (~140px) */
.safe { position: absolute; top: 260px; left: 70px; right: 150px; bottom: 440px;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center; gap: 28px; }
.safe > div { font-family: "TikTok Sans", sans-serif; color: #fff;
  text-shadow: ${outline(7)}, ${outline(4, 16)}; line-height: 1.15;
  overflow-wrap: break-word; }
.kicker { font-weight: 900; font-size: 64px; }
.title { font-weight: 900; font-size: ${s.type === "cover" ? 96 : 80}px; }
.big { font-weight: 900; font-size: 150px; text-shadow: ${outline(10)}, ${outline(5, 16)}; }
.line { font-weight: 700; font-size: 58px; }
.subtitle { font-weight: 700; font-size: ${s.type === "cover" ? 60 : 54}px; }
</style></head><body>
<div class="bg"></div><div class="shade"></div>
<div class="safe">${slideBody(s)}</div>
</body></html>`;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
const written = [];
const bgCache = new Map();
try {
  for (const [i, s] of spec.slides.entries()) {
    const bgPath = s.background ?? spec.background ?? pickBackground(i);
    let bg = null;
    if (bgPath) {
      if (!bgCache.has(bgPath)) bgCache.set(bgPath, await dataUri(bgPath, imageMime(bgPath)));
      bg = bgCache.get(bgPath);
    }
    await page.setContent(html(s, bg), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // Réduit la taille du texte tant qu'il déborde de la zone utile
    await page.evaluate(() => {
      const box = document.querySelector(".safe");
      let scale = 1;
      while (box.scrollHeight > box.clientHeight + 1 && scale > 0.4) {
        scale -= 0.05;
        for (const el of box.children) {
          const base = el.dataset.base ?? (el.dataset.base = parseFloat(getComputedStyle(el).fontSize));
          el.style.fontSize = `${base * scale}px`;
        }
      }
    });
    const file = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.jpg`);
    await writeFile(file, await page.screenshot({ type: "jpeg", quality: 90 }));
    written.push(file);
  }
} finally {
  await browser.close();
}
console.log(written.join("\n"));
