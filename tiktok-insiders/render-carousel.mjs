// Rend un carrousel TikTok (JPEG 1080x1920) à partir d'un fichier slides.json,
// avec un texte au rendu "natif" TikTok : TikTok Sans blanc, fin contour noir,
// taille modeste, 3 lignes maximum par slide.
//
// Usage : node render-carousel.mjs out/<date>/slides.json
//
// Format de slides.json :
// {
//   "slides": [
//     { "type": "cover", "lines": ["Hier, 4 insiders ont investi 38 M$", "dans leur propre entreprise"] },
//     { "type": "buy",   "lines": ["#1 · 51Talk ($COE)", "Le PDG achète pour 32 M$", "d'actions en une seule fois"] },
//     { "type": "cta",   "lines": ["Abonne-toi pour ne pas louper", "les prochains"] }
//   ]
// }
// Tout le carrousel utilise UNE seule photo de fond, choisie chaque jour dans
// backgrounds/ (rotation quotidienne), ou forcée via "background" au niveau racine.
// Les photos de backgrounds/personnalites/ ne sont pas utilisées : un visage
// connu à côté d'un achat laisserait croire que cette personne est l'acheteur.
// Sans photo disponible, le rendu échoue.
// Le rendu échoue aussi si une slide dépasse 3 lignes une fois mise en page
// ou contient un émoji.
// Les images sont écrites à côté de slides.json : slide-01.jpg, slide-02.jpg, ...
import { chromium } from "playwright-core";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1920;
const MAX_LINES = 3;
const FONT_SIZE = 54; // ~ taille du texte ajouté dans l'app TikTok
const MIN_FONT_SIZE = 44;

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: node render-carousel.mjs out/<date>/slides.json");
  process.exit(1);
}
const spec = JSON.parse(await readFile(specPath, "utf8"));
const outDir = dirname(resolve(specPath));

// Contour noir arrondi (comme le style "outline" de TikTok) : un anneau
// d'ombres portées, plus net que -webkit-text-stroke qui fait des pointes.
const outline = (r, steps = 24) => Array.from({ length: steps }, (_, i) => {
  const a = (2 * Math.PI * i) / steps;
  return `${(r * Math.cos(a)).toFixed(1)}px ${(r * Math.sin(a)).toFixed(1)}px 0 #000`;
}).join(",");

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function dataUri(path, mime) {
  const buf = await readFile(resolve(outDir, path));
  return `data:${mime};base64,${buf.toString("base64")}`;
}
const imageMime = p => ({ ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" })[extname(p).toLowerCase()] || "image/jpeg";

// Photo de fond du jour (rotation stable sur la liste triée)
const library = (await readdir(join(HERE, "backgrounds")).catch(() => []))
  .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort().map(f => join(HERE, "backgrounds", f));
const dayIndex = Math.floor(Date.now() / 86_400_000);
const bgPath = spec.background ?? (library.length ? library[dayIndex % library.length] : null);
if (!bgPath) {
  console.error("Aucune photo dans backgrounds/ : ajoute des photos naturelles verticales (JPEG/PNG/WebP/AVIF).");
  process.exit(1);
}

const font700 = await dataUri(join(HERE, "fonts/TikTokSans-700.ttf"), "font/ttf");

function html(slide, bg) {
  const lines = (slide.lines || []).map(l => `<span class="line">${esc(l)}</span>`).join("<br>");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "TikTok Sans"; font-weight: 700; src: url(${font700}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
.bg { position: absolute; inset: 0; background: url(${bg}) center / cover no-repeat; }
/* Zone utile : TikTok masque le bas (~420px) et la colonne droite (~140px) */
.safe { position: absolute; top: 300px; left: 90px; right: 160px; bottom: 460px;
  display: flex; align-items: center; justify-content: center; }
.text { font-family: "TikTok Sans", sans-serif; font-weight: 700; font-size: ${FONT_SIZE}px;
  line-height: 1.28; color: #fff; text-align: center; overflow-wrap: break-word;
  text-shadow: ${outline(3.5)}; }
</style></head><body>
<div class="bg"></div>
<div class="safe"><div class="text">${lines}</div></div>
</body></html>`;
}

for (const [i, s] of spec.slides.entries()) {
  if (!s.lines?.length) throw new Error(`Slide ${i + 1} : "lines" manquant`);
  if (s.lines.length > MAX_LINES) throw new Error(`Slide ${i + 1} : ${s.lines.length} lignes (max ${MAX_LINES})`);
  if (s.lines.some(l => /\p{Extended_Pictographic}/u.test(l))) throw new Error(`Slide ${i + 1} : pas d'émoji`);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const bg = await dataUri(bgPath, imageMime(bgPath));
const written = [];
try {
  for (const [i, s] of spec.slides.entries()) {
    await page.setContent(html(s, bg), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // Réduit légèrement la police si une ligne trop longue se replie,
    // puis refuse la slide si elle dépasse encore 3 lignes affichées.
    const lineCount = await page.evaluate(({ max, min }) => {
      const el = document.querySelector(".text");
      const count = () => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight));
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (count() > max && size > min) el.style.fontSize = `${(size -= 2)}px`;
      return count();
    }, { max: MAX_LINES, min: MIN_FONT_SIZE });
    if (lineCount > MAX_LINES) {
      throw new Error(`Slide ${i + 1} : le texte tient sur ${lineCount} lignes à l'écran (max ${MAX_LINES}), raccourcis-le`);
    }
    const file = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.jpg`);
    await writeFile(file, await page.screenshot({ type: "jpeg", quality: 90 }));
    written.push(file);
  }
} finally {
  await browser.close();
}
console.log(written.join("\n"));
